/**
 * Aşama 2 görsel dili: su / akış / elektrik renkleri, kamera görünümleri,
 * kalite ve hareket-azaltma kararları tek yerden alınır.
 *
 * Renkler dışında yön okları (3D koniler) ve durum etiketleri de
 * kullanılır; renk tek başına anlam taşımaz.
 */

export const FLOW_VISUAL = {
  /** Su yüzeyleri: mavi tonları. */
  water: '#0f70b7',
  /** Hidrolik akış: açık mavi / camgöbeği. */
  hydraulic: '#22d3ee',
  hydraulicBright: '#67e8f9',
  /** Üretimde elektrik akışı: yeşil. */
  generate: '#22c55e',
  /** Pompalamada elektrik akışı: kırmızı (üretimden açıkça farklı). */
  pump: '#ef4444',
  /** Temsili bağlantı: kesikli çizgi rengi. */
  representativeLink: '#d6a85e',
  /** Seçili bileşen vurgusu. */
  selected: '#f8fafc',
  /** Pasif / akışsız su yolu. */
  idle: '#64748b',
} as const;

export type CameraViewId =
  | 'site'
  | 'upper'
  | 'lower'
  | 'route'
  | 'plant'
  | 'section'
  | 'switchyard';

export const CAMERA_VIEWS: ReadonlyArray<{ id: CameraViewId; label: string }> = [
  { id: 'site', label: 'Tesis' },
  { id: 'upper', label: 'Üst Rez.' },
  { id: 'lower', label: 'Alt Rez.' },
  { id: 'route', label: 'Güzergâh' },
  { id: 'plant', label: 'Santral' },
  { id: 'section', label: 'Kesit' },
  { id: 'switchyard', label: 'Şalt' },
];

/** Kamera görünümünde kadraja alınacak footprint bileşenleri (`null` = tamamı). */
export const CAMERA_VIEW_COMPONENTS: Record<CameraViewId, string[] | null> = {
  site: null,
  upper: ['upper_reservoir', 'intake'],
  lower: ['lower_reservoir'],
  route: ['headrace_tunnel', 'pressure_tunnel', 'penstock', 'tailrace_tunnel', 'tailrace_channel', 'surge_tank'],
  plant: ['powerhouse'],
  section: ['powerhouse', 'penstock', 'pressure_tunnel', 'headrace_tunnel', 'tailrace_tunnel', 'surge_tank'],
  switchyard: ['switchyard', 'new_switchyard', 'existing_switchyard'],
};

/** Mobil / düşük güçlü cihazlarda düşük ayrıntı; yeni bağımlılık yok. */
export function resolveSceneQuality(): 'low' | 'high' {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return 'high';
  if (window.matchMedia?.('(max-width: 768px)').matches) return 'low';
  const cores = typeof navigator.hardwareConcurrency === 'number' ? navigator.hardwareConcurrency : 8;
  const memory = typeof (navigator as Navigator & { deviceMemory?: number }).deviceMemory === 'number'
    ? (navigator as Navigator & { deviceMemory?: number }).deviceMemory as number
    : 8;
  return cores <= 4 || memory <= 4 ? 'low' : 'high';
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
