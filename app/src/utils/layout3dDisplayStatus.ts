/**
 * Aşama 1 altyapısı: tesisin 3D gösterim düzeyini tek bir yerden çözümle.
 *
 * Aşama 2'deki UI kontrolleri bu durumu doğrudan kullanabilir; sahne
 * bileşenleri ve sayfa uyarıları aynı kaynağa bakmalıdır.
 *
 * - `footprint`: doğrulanmış footprint poligonları sahnede aktiftir.
 * - `loading`: footprint verisi bekleniyor; önceki tesise ait geometri
 *   gösterilmez.
 * - `representative`: tesis bilerek temsili modelle gösterilir
 *   (footprint modu kapalı).
 * - `fallback`: footprint hedeflendi ama yüklenemedi; ekrandaki model
 *   temsilidir ve doğrulanmış gibi gösterilmemelidir.
 */

export type Layout3DDisplayStatus =
  | 'footprint'
  | 'loading'
  | 'representative'
  | 'fallback';

export type FootprintLoadStatusLike =
  | 'idle'
  | 'loading'
  | 'success'
  | 'empty'
  | 'not-found'
  | 'invalid-schema'
  | 'network-error'
  | 'timeout'
  | 'fallback-model';

const FOOTPRINT_FAILURE: ReadonlySet<FootprintLoadStatusLike> = new Set([
  'empty',
  'not-found',
  'invalid-schema',
  'network-error',
  'timeout',
  'fallback-model',
]);

export function resolveLayout3DDisplayStatus(input: {
  useFootprintPolygons?: boolean;
  loadStatus?: FootprintLoadStatusLike;
  hasFootprints: boolean;
}): Layout3DDisplayStatus {
  if (!input.useFootprintPolygons) return 'representative';
  if (input.loadStatus === 'success' && input.hasFootprints) return 'footprint';
  if (input.loadStatus && FOOTPRINT_FAILURE.has(input.loadStatus)) return 'fallback';
  return 'loading';
}

/** Temsili niteliği taşıyan her durum için UI uyarı/etiket göstermelidir. */
export function isRepresentativeDisplay(status: Layout3DDisplayStatus): boolean {
  return status !== 'footprint';
}
