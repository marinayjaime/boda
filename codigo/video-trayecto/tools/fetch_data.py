"""Descarga los datos reales del trayecto: ruta OSRM, ortofotos PNOA (IGN) y relieve (Terrarium, AWS Open Data).
Uso: python3 -I tools/fetch_data.py <carpeta-data>
"""
import io, json, math, os, sys, time, urllib.request
from concurrent.futures import ThreadPoolExecutor
from PIL import Image

OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)
UA = {'User-Agent': 'boda-marina-jaime/1.0 (video trayecto, uso personal)'}

CHURCH = (39.5693, 2.6264)   # Parroquia Santa Teresa del Niño Jesús, C/ Pilar Juncosa 13, Palma
FINCA = (39.7355, 2.8030)    # s'Olivaret, Ctra. Alaró–Orient km 3

def get(url, tries=4):
    # curl en vez de urllib: el Python del sistema (LibreSSL) no negocia TLS con algunos servidores
    import subprocess
    for i in range(tries):
        try:
            return subprocess.run(['curl', '-sfL', '--max-time', '30', '-A', UA['User-Agent'], url],
                                  check=True, capture_output=True).stdout
        except Exception as e:
            if i == tries - 1:
                raise
            time.sleep(1 + i)

def tile_xy(lat, lon, z):
    n = 2 ** z
    x = (lon + 180) / 360 * n
    y = (1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n
    return x, y

def mosaic(name, url_fn, bbox, z, mode='RGB', workers=6):
    """bbox = (lat_s, lon_w, lat_n, lon_e). Guarda <name>.png/.jpg + <name>.json con la georreferencia."""
    x0, y0 = tile_xy(bbox[2], bbox[1], z)
    x1, y1 = tile_xy(bbox[0], bbox[3], z)
    tx0, ty0, tx1, ty1 = int(x0), int(y0), int(x1), int(y1)
    cols, rows = tx1 - tx0 + 1, ty1 - ty0 + 1
    print(f'{name}: z{z} {cols}x{rows} teselas', flush=True)
    img = Image.new(mode, (cols * 256, rows * 256))
    jobs = [(tx, ty) for ty in range(ty0, ty1 + 1) for tx in range(tx0, tx1 + 1)]
    def one(j):
        tx, ty = j
        return j, Image.open(io.BytesIO(get(url_fn(z, tx, ty)))).convert(mode)
    with ThreadPoolExecutor(workers) as ex:
        for (tx, ty), im in ex.map(one, jobs):
            img.paste(im, ((tx - tx0) * 256, (ty - ty0) * 256))
    ext = 'png' if name == 'relieve' or mode != 'RGB' else 'jpg'
    path = os.path.join(OUT, f'{name}.{ext}')
    img.save(path, quality=92) if ext == 'jpg' else img.save(path)
    meta = {'z': z, 'tx0': tx0, 'ty0': ty0, 'cols': cols, 'rows': rows, 'w': img.width, 'h': img.height}
    json.dump(meta, open(os.path.join(OUT, f'{name}.json'), 'w'))
    return meta

pnoa = lambda z, x, y: ('https://www.ign.es/wmts/pnoa-ma?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0'
                        '&LAYER=OI.OrthoimageCoverage&STYLE=default&FORMAT=image/jpeg'
                        f'&TILEMATRIXSET=GoogleMapsCompatible&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}')
terrarium = lambda z, x, y: f'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'

def around(c, km):
    dlat = km / 111.0
    dlon = km / (111.0 * math.cos(math.radians(c[0])))
    return (c[0] - dlat, c[1] - dlon, c[0] + dlat, c[1] + dlon)

# 1 · Ruta real por carretera (OSRM sobre OpenStreetMap)
r = json.loads(get('https://router.project-osrm.org/route/v1/driving/'
                   f'{CHURCH[1]},{CHURCH[0]};{FINCA[1]},{FINCA[0]}?overview=full&geometries=geojson'))
route = r['routes'][0]
json.dump({'distance_m': route['distance'], 'duration_s': route['duration'],
           'coords': route['geometry']['coordinates'], 'church': CHURCH, 'finca': FINCA},
          open(os.path.join(OUT, 'route.json'), 'w'))
print('ruta', round(route['distance'] / 1000, 1), 'km', len(route['geometry']['coordinates']), 'puntos')

# 2 · Zona amplia: Palma + llanura + Tramuntana al norte (para el horizonte)
BIG = (39.50, 2.52, 39.84, 2.94)
mosaic('relieve', terrarium, BIG, 12, mode='RGB')
mosaic('orto-amplia', pnoa, BIG, 14)
# 3 · Pasillo de la ruta a más detalle
lats = [c[1] for c in route['geometry']['coordinates']]; lons = [c[0] for c in route['geometry']['coordinates']]
mosaic('orto-ruta', pnoa, (min(lats) - 0.012, min(lons) - 0.015, max(lats) + 0.012, max(lons) + 0.015), 16)
# 4 · Detalle máximo en la salida y la llegada
mosaic('orto-iglesia', pnoa, around(CHURCH, 0.7), 19)
mosaic('orto-finca', pnoa, around(FINCA, 0.7), 19)
print('hecho')
