"""Nombres reales de los barrios y pueblos junto a la ruta (OSM / Nominatim, ~1 consulta por segundo)."""
import json, math, subprocess, time, urllib.parse, sys
route = json.load(open('data/route.json'))['coords']   # [lon, lat]
cum = [0.0]
for (a, b), (c, d) in zip(route, route[1:]):
    cum.append(cum[-1] + math.hypot((c - a) * 85000, (d - b) * 111000))
L = cum[-1]; step = 600
out, seen = [], set()
s = 0
while s <= L:
    i = next(k for k in range(len(cum)) if cum[k] >= s)
    lon, lat = route[i]
    for zoom in (16, 14):
        url = f'https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat={lat}&lon={lon}&zoom={zoom}&accept-language=ca,es'
        r = subprocess.run(['curl', '-sf', '-A', 'boda-marina-jaime/1.0 (video personal)', url], capture_output=True).stdout
        time.sleep(1.1)
        try: d = json.loads(r)
        except Exception: continue
        a = d.get('address', {})
        for key in ('neighbourhood', 'quarter', 'suburb', 'hamlet', 'village', 'town'):
            name = a.get(key)
            if name and (key, name) not in seen:
                seen.add((key, name))
                out.append({'s': round(s), 'kind': key, 'name': name, 'lat': float(d['lat']), 'lon': float(d['lon']), 'zoom': zoom})
                print(round(s / 1000, 1), key, name, flush=True)
    s += step
json.dump(out, open('data/places.json', 'w'), ensure_ascii=False, indent=1)
