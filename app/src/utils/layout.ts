import type { Feature, FeatureCollection, LineString, Point, Polygon } from 'geojson';
import type { Site } from '../types/site';
import { circlePolygon, centroid, mid, offset, rotatedRectangle } from './geo';

export interface LayoutBundle {
  blocks: FeatureCollection<Polygon>;
  water: FeatureCollection<LineString>;
  risk: FeatureCollection<Polygon>;
  labels: FeatureCollection<Point>;
  grid: FeatureCollection<LineString>;
}

export function buildLayout(s: Site, hScale: number): LayoutBundle {
  const layout = s.layout;
  const bearing = layout.bearing;
  const blocks: Feature<Polygon>[] = [];

  function addRect(
    key: string,
    label: string,
    center: [number, number],
    width: number,
    length: number,
    height: number,
    color: string,
    blockBearing = bearing,
    base = 2,
  ) {
    blocks.push({
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: [rotatedRectangle(center, width, length, blockBearing)] },
      properties: { key, label, width, length, height: height * hScale, base, color },
    });
  }

  function addCircle(
    key: string,
    label: string,
    center: [number, number],
    radius: number,
    height: number,
    color: string,
    base = 2,
  ) {
    blocks.push({
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: [circlePolygon(center, radius, 36)] },
      properties: { key, label, width: radius * 2, length: radius * 2, height: height * hScale, base, color },
    });
  }

  function addPolygon(
    key: string,
    label: string,
    coordinates: [number, number][],
    height: number,
    color: string,
    base = 2,
  ) {
    blocks.push({
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: [coordinates] },
      properties: { key, label, width: 600, length: 600, height: height * hScale, base, color },
    });
  }

  if (s.id === 'presenzano') {
    const upperPoly: [number, number][] = [
      [14.0470995, 41.3931105],
      [14.0475529, 41.3927172],
      [14.047978, 41.3926535],
      [14.0485305, 41.3927916],
      [14.051435, 41.3937801],
      [14.0520725, 41.3940883],
      [14.0529793, 41.3947367],
      [14.0540419, 41.3956401],
      [14.0541836, 41.3961821],
      [14.0542061, 41.3963073],
      [14.0542324, 41.3964542],
      [14.0542959, 41.3968077],
      [14.0543272, 41.3969822],
      [14.0544811, 41.3978401],
      [14.0543678, 41.3982015],
      [14.0540702, 41.3985841],
      [14.0536452, 41.3988179],
      [14.0510099, 41.3991048],
      [14.0503865, 41.3990411],
      [14.0499757, 41.3987541],
      [14.049834, 41.3984672],
      [14.0496923, 41.3976807],
      [14.049749, 41.3973406],
      [14.049494, 41.3969155],
      [14.0488281, 41.3964053],
      [14.048063, 41.396044],
      [14.0471137, 41.3956614],
      [14.0464903, 41.3953425],
      [14.0461928, 41.3950236],
      [14.0462211, 41.3945985],
      [14.0470995, 41.3931105],
    ];
    const lowerPoly: [number, number][] = [
      [14.0907298, 41.380015],
      [14.0907679, 41.3801586],
      [14.0908686, 41.3802855],
      [14.0924585, 41.3814237],
      [14.0926434, 41.3814784],
      [14.0928544, 41.3814888],
      [14.0930745, 41.3814406],
      [14.0931974, 41.3813664],
      [14.093909, 41.3808133],
      [14.0940841, 41.3807366],
      [14.0942756, 41.3807196],
      [14.094466, 41.380752],
      [14.0946671, 41.3808249],
      [14.0961392, 41.3817689],
      [14.0964083, 41.3818808],
      [14.0967205, 41.3819414],
      [14.0988815, 41.3822078],
      [14.0990771, 41.3822349],
      [14.0992681, 41.3822328],
      [14.099474, 41.3822068],
      [14.0996228, 41.3821581],
      [14.0997907, 41.3820725],
      [14.0999486, 41.3819467],
      [14.1009371, 41.3811316],
      [14.1028081, 41.3796228],
      [14.1032779, 41.3791823],
      [14.1033481, 41.3789452],
      [14.1032912, 41.3785665],
      [14.1028104, 41.3770982],
      [14.1025138, 41.3760876],
      [14.0998744, 41.3738943],
      [14.0982154, 41.3739422],
      [14.0938305, 41.3741975],
      [14.0931287, 41.3747596],
      [14.0916214, 41.3760842],
      [14.0909784, 41.3766895],
      [14.0908227, 41.3769479],
      [14.0907448, 41.377144],
      [14.0908273, 41.3774537],
      [14.0916621, 41.3785662],
      [14.0917627, 41.3787371],
      [14.0917787, 41.3788825],
      [14.0916986, 41.3790571],
      [14.0915283, 41.3792141],
      [14.0908866, 41.3797305],
      [14.0907808, 41.3798594],
      [14.0907298, 41.380015],
    ];
    addPolygon('upper_reservoir', 'Cesima Üst Rezervuarı', upperPoly, 36, '#4aa3ff');
    addPolygon('lower_reservoir', 'Presenzano Alt Rezervuarı', lowerPoly, 16, '#1fb6ff');
    addRect('powerhouse', 'Yeraltı güç evi (powerhouse)', layout.power, 260, 150, 70, '#b277ff', bearing + 2);
    addCircle('surge_tank', 'Denge bacası (surge tank)', layout.surge, 70, 115, '#ffd75a');
    addRect('switchyard', '380 kV şalt sahası (switchyard)', layout.switchyard, 340, 240, 28, '#48f49a', bearing - 12);
    addRect('portal', 'Tünel portalı / servis alanı', mid(layout.upper, layout.power, .55), 220, 120, 24, '#ff944d', bearing + 16);
  } else if (s.concept === 'sea') {
    addRect('upper_reservoir', 'Kaplamalı üst rezervuar', layout.upper, 980, 760, 42, '#4aa3ff', bearing + 8);
    addRect('lower_reservoir', 'Deniz alım/deşarj yapısı', layout.lower, 140, 90, 18, '#8a9597', bearing - 18);
    addRect('powerhouse', 'Yeraltı güç evi (powerhouse)', layout.power, 260, 150, 70, '#b277ff', bearing + 2);
    addCircle('surge_tank', 'Denge bacası (surge tank)', layout.surge, 70, 115, '#ffd75a');
    addRect('switchyard', '154/380 kV şalt sahası (switchyard)', layout.switchyard, 340, 240, 28, '#48f49a', bearing - 12);
    addRect('portal', 'Tünel portalı / servis alanı', mid(layout.upper, layout.power, .55), 220, 120, 24, '#ff944d', bearing + 16);
  } else {
    addRect('upper_reservoir', 'Üst rezervuar', layout.upper, 1100, 850, 36, '#4aa3ff', bearing + 4);
    addRect('lower_reservoir', 'Mevcut alt rezervuar', layout.lower, 900, 500, 16, '#1fb6ff', bearing - 10);
    addRect('powerhouse', 'Yeraltı güç evi (powerhouse)', layout.power, 320, 170, 78, '#b277ff', bearing + 1);
    addCircle('surge_tank', 'Denge bacası (surge tank)', layout.surge, 82, 120, '#ffd75a');
    addRect('switchyard', '380 kV şalt / trafo sahası', layout.switchyard, 390, 260, 32, '#48f49a', bearing - 7);
    addRect('portal', 'Servis + drenaj tüneli portalı', mid(layout.upper, layout.power, .58), 240, 125, 22, '#ff944d', bearing + 12);
  }

  const water: FeatureCollection<LineString> = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: [layout.upper, layout.surge, layout.power, layout.lower] },
        properties: { color: '#36d6ff', width: 4 },
      },
    ],
  };
  const risk: FeatureCollection<Polygon> = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: { type: 'Polygon', coordinates: [circlePolygon(layout.risk, s.concept === 'sea' ? 1700 : 1450, 64)] },
        properties: { label: 'risk buffer' },
      },
    ],
  };
  const labels: FeatureCollection<Point> = {
    type: 'FeatureCollection',
    features: blocks.map((feature) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: centroid(feature.geometry.coordinates[0] as [number, number][]) },
      properties: { label: feature.properties?.label },
    })),
  };
  const grid: FeatureCollection<LineString> = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: [layout.gridA, layout.switchyard, layout.gridB] },
        properties: { label: 'şebeke bağlantısı', color: '#ffd75a', width: 3 },
      },
      {
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: [offset(layout.switchyard, 550, -300), offset(layout.switchyard, -450, 300)] },
        properties: { label: 'şalt çıkışı', color: '#48f49a', width: 2 },
      },
    ],
  };

  return { blocks: { type: 'FeatureCollection', features: blocks }, water, risk, labels, grid };
}
