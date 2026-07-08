function isFiniteValue(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v);
}

export function moneyBn(v: number | null | undefined): string {
  if (!isFiniteValue(v)) return 'Belirtilmedi';
  return '$' + v.toFixed(2) + ' bn';
}

export function moneyM(v: number | null | undefined): string {
  if (!isFiniteValue(v)) return 'Belirtilmedi';
  return '$' + Math.round(v) + ' m/yıl';
}

export function num(v: number | null | undefined, d = 0): string {
  if (!isFiniteValue(v)) return 'Belirtilmedi';
  return Number(v).toLocaleString('tr-TR', { maximumFractionDigits: d, minimumFractionDigits: d });
}

export function escapeHtml(str: string): string {
  return String(str).replace(/[&<>'"]/g, (m) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[m] || m)
  );
}
