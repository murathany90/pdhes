import xml.etree.ElementTree as ET
import json, re, os

kml_path = 'YTBS_Detayli_Harita (3).kml'
out_path = 'grid_assets.json'

NS = {'kml': 'http://www.opengis.net/kml/2.2'}

def voltage_from_style(style_url):
    s = style_url.lower()
    if '400' in s:
        return '400'
    if '154' in s:
        return '154'
    if '66' in s:
        return '66'
    return None

def parse_coords(text):
    # KML coordinates: lon,lat,alt lon,lat,alt ...
    pts = []
    for token in text.strip().split():
        parts = token.split(',')
        if len(parts) >= 2:
            try:
                lon = float(parts[0])
                lat = float(parts[1])
                pts.append([lon, lat])
            except ValueError:
                pass
    return pts

tree = ET.parse(kml_path)
root = tree.getroot()

features = {'400':[], '154':[], '66':[]}

for placemark in root.iter('{http://www.opengis.net/kml/2.2}Placemark'):
    name_el = placemark.find('kml:name', NS)
    style_el = placemark.find('kml:styleUrl', NS)
    name = name_el.text.strip() if name_el is not None and name_el.text else ''
    style = style_el.text.strip() if style_el is not None and style_el.text else ''
    volt = voltage_from_style(style)
    if not volt:
        continue

    point = placemark.find('.//kml:Point/kml:coordinates', NS)
    line = placemark.find('.//kml:LineString/kml:coordinates', NS)

    if point is not None and point.text:
        coords = parse_coords(point.text)
        if coords:
            features[volt].append({
                'type': 'Feature',
                'geometry': {'type': 'Point', 'coordinates': coords[0]},
                'properties': {'name': name, 'voltage': volt}
            })
    elif line is not None and line.text:
        coords = parse_coords(line.text)
        if len(coords) >= 2:
            features[volt].append({
                'type': 'Feature',
                'geometry': {'type': 'LineString', 'coordinates': coords},
                'properties': {'name': name, 'voltage': volt}
            })

geojson = {
    'type': 'FeatureCollection',
    'features': features['400'] + features['154'] + features['66']
}

with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(geojson, f, ensure_ascii=False)

print('Done. Total features:', len(geojson['features']))
print('400 kV:', len(features['400']))
print('154 kV:', len(features['154']))
print('66 kV:', len(features['66']))
