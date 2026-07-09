export function deg2rad(d: number): number {
  return d * Math.PI / 180;
}

export function offset(center: [number, number], eastM: number, northM: number): [number, number] {
  const lon = center[0], lat = center[1];
  return [lon + eastM / (111320 * Math.cos(deg2rad(lat))), lat + northM / 111320];
}

export function rotatedRectangle(center: [number, number], widthM: number, lengthM: number, bearingDeg: number): [number, number][] {
  const t = deg2rad(bearingDeg);
  const le: [number, number] = [Math.sin(t), Math.cos(t)];
  const we: [number, number] = [Math.cos(t), -Math.sin(t)];
  const corners: [number, number][] = [
    [-widthM / 2, -lengthM / 2], [widthM / 2, -lengthM / 2],
    [widthM / 2, lengthM / 2], [-widthM / 2, lengthM / 2],
    [-widthM / 2, -lengthM / 2]
  ];
  return corners.map(([x, y]) => offset(center, x * we[0] + y * le[0], x * we[1] + y * le[1]));
}

export function circlePolygon(center: [number, number], radiusM: number, steps = 48): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const a = i / steps * 2 * Math.PI;
    pts.push(offset(center, Math.cos(a) * radiusM, Math.sin(a) * radiusM));
  }
  return pts;
}

export function centroid(coords: [number, number][]): [number, number] {
  let x = 0, y = 0;
  const n = coords.length - 1;
  for (let i = 0; i < n; i++) { x += coords[i][0]; y += coords[i][1]; }
  return [x / n, y / n];
}

export function mid(a: [number, number], b: [number, number], t = 0.5): [number, number] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

export function scalePolygon(coords: [number, number][], factor: number): [number, number][] {
  const c = centroid(coords);
  return coords.map(([x, y]) => [
    c[0] + (x - c[0]) * factor,
    c[1] + (y - c[1]) * factor
  ]);
}
