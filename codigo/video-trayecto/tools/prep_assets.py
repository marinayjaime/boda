"""Convierte los datos descargados en assets.js para la composición:
texturas (data URI), alturas del terreno, ruta en coordenadas del mundo, fuentes y la foto del autobús.

Mundo: metros reales sobre el suelo. x = este, z = -norte (convención three.js), y = altura.
Las ortofotos están en teselas Web Mercator, así que se trabaja en Mercator escalado por cos(lat0):
cada mosaico es un rectángulo exacto en ese plano.
Uso: python3 tools/prep_assets.py   (desde video-trayecto/)
"""
import base64, io, json, math, os
import numpy as np
from PIL import Image

Image.MAX_IMAGE_PIXELS = None
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(HERE, 'data')
PUBLIC = os.path.join(HERE, '..', 'public')
R = 6378137.0

route = json.load(open(os.path.join(DATA, 'route.json')))
LAT0 = 39.65
K = math.cos(math.radians(LAT0))
X0 = math.radians(2.71) * R
Y0 = math.log(math.tan(math.pi / 4 + math.radians(LAT0) / 2)) * R

def world(lat, lon):
    mx = math.radians(lon) * R
    my = math.log(math.tan(math.pi / 4 + math.radians(lat) / 2)) * R
    return ((mx - X0) * K, -(my - Y0) * K)          # (x, z)

def tile_world(tx, ty, z):
    n = 2 ** z
    mx = tx / n * 2 * math.pi * R - math.pi * R
    my = math.pi * R - ty / n * 2 * math.pi * R
    return ((mx - X0) * K, -(my - Y0) * K)

def bounds(meta):
    x0, z0 = tile_world(meta['tx0'], meta['ty0'], meta['z'])
    x1, z1 = tile_world(meta['tx0'] + meta['cols'], meta['ty0'] + meta['rows'], meta['z'])
    return [x0, z0, x1, z1]                          # oeste, norte(z menor), este, sur

def data_uri(im, q=86, fmt='JPEG'):
    b = io.BytesIO()
    im.save(b, fmt, quality=q) if fmt == 'JPEG' else im.save(b, fmt)
    return f'data:image/{fmt.lower()};base64,' + base64.b64encode(b.getvalue()).decode()

def fit(im, maxside):
    s = min(1.0, maxside / max(im.size))
    return im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS) if s < 1 else im

out = {'textures': {}, 'layers': []}

# Relieve (Terrarium: h = R*256 + G + B/256 - 32768)
rm = json.load(open(os.path.join(DATA, 'relieve.json')))
rel = np.asarray(Image.open(os.path.join(DATA, 'relieve.png')).convert('RGB')).astype(np.float64)
h = rel[..., 0] * 256 + rel[..., 1] + rel[..., 2] / 256 - 32768
h = np.maximum(h, 0)                                  # el mar a 0
out['height'] = {'bounds': bounds(rm), 'w': h.shape[1], 'h': h.shape[0],
                 'data': [round(float(v), 1) for v in h.ravel()]}

# Capas de ortofoto: (nombre, lado máximo, troceo, orden)
def layer(name, maxside, split=1, order=0, feather=0.0):
    meta = json.load(open(os.path.join(DATA, f'{name}.json')))
    im = Image.open(os.path.join(DATA, f'{name}.jpg')).convert('RGB')
    b = bounds(meta)
    W, H = im.size
    for j in range(split):
        for i in range(split):
            px0, px1 = W * i // split, W * (i + 1) // split
            py0, py1 = H * j // split, H * (j + 1) // split
            piece = fit(im.crop((px0, py0, px1, py1)), maxside)
            key = f'{name}-{i}{j}'
            out['textures'][key] = data_uri(piece)
            lb = [b[0] + (b[2] - b[0]) * px0 / W, b[1] + (b[3] - b[1]) * py0 / H,
                  b[0] + (b[2] - b[0]) * px1 / W, b[1] + (b[3] - b[1]) * py1 / H]
            out['layers'].append({'tex': key, 'bounds': lb, 'order': order, 'feather': feather})
    print(name, 'listo')

layer('orto-amplia', 4096, 1, 0, 0.0)
layer('orto-ruta', 2560, 3, 1, 0.04)
layer('orto-iglesia', 4096, 1, 2, 0.18)
layer('orto-finca', 4096, 1, 2, 0.18)

# Ruta
pts = [world(lat, lon) for lon, lat in route['coords']]
out['route'] = [[round(x, 1), round(z, 1)] for x, z in pts]
out['places'] = {
    'church': world(*route['church']), 'finca': world(*route['finca']),
    'palma': world(39.5730, 2.6505), 'alaro': world(39.7045, 2.7905),
    'puigAlaro': world(39.7300, 2.7830), 'serra': world(39.7720, 2.8000),
}

# Foto real del autobús (la que pasó Jaime en agosto)
out['textures']['bus'] = data_uri(Image.open(os.path.join(PUBLIC, 'assets', 'bus-route.png')), fmt='PNG')

# Fuentes de la web, en línea (file:// no carga fuentes externas)
fonts = {'Lora': 'Lora-VF.ttf', 'LoraItalic': 'Lora-Italic-VF.ttf', 'Jost': 'font-03.ttf', 'JostMedium': 'font-04.ttf'}
css = ''
for fam, fn in fonts.items():
    b64 = base64.b64encode(open(os.path.join(PUBLIC, 'fonts', fn), 'rb').read()).decode()
    real = 'Lora' if fam.startswith('Lora') else 'Jost'
    style = 'italic' if fam == 'LoraItalic' else 'normal'
    weight = '500' if fam == 'JostMedium' else ('400 700' if real == 'Lora' else '400')
    css += f"@font-face{{font-family:'{real}';font-style:{style};font-weight:{weight};src:url(data:font/ttf;base64,{b64}) format('truetype')}}\n"
out['fontCSS'] = css

with open(os.path.join(HERE, 'assets.js'), 'w') as f:
    f.write('window.ASSETS=' + json.dumps(out, separators=(',', ':')) + ';')
print('assets.js', round(os.path.getsize(os.path.join(HERE, 'assets.js')) / 1e6, 1), 'MB')
