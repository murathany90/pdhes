export function moneyBn(v: number): string {
  return '€' + v.toFixed(2) + ' bn';
}

export function moneyM(v: number): string {
  return '€' + Math.round(v) + ' m/yıl';
}

export function num(v: number, d = 0): string {
  return Number(v).toLocaleString('tr-TR', { maximumFractionDigits: d, minimumFractionDigits: d });
}

export function escapeHtml(str: string): string {
  return String(str).replace(/[&<>'"]/g, (m) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[m] || m)
  );
}
