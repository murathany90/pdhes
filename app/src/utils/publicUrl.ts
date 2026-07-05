export function publicAssetUrl(file: string, base = import.meta.env.BASE_URL): string {
  const normalizedBase = `/${base}`.replace(/\/+/g, '/').replace(/\/?$/, '/');
  const normalizedFile = file.replace(/^\/+/, '');
  return `${normalizedBase}${normalizedFile}`;
}
