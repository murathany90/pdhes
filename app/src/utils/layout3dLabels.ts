import { COMPONENTS } from './constants';
import type { Layout3DProjectedFootprint } from './layout3dFootprints';

/**
 * Yapı ağacı, bilgi paneli ve sahne etiketleri için tek etiket kaynağı.
 * Sahnedeki `compactFootprintLabel` ile aynı adları üretir; koordinat
 * güveni veya mühendislik değeri uydurmaz.
 */
export function footprintItemLabel(item: Pick<Layout3DProjectedFootprint, 'id' | 'component'>): string {
  if (item.id.startsWith('penstock')) {
    const num = item.id.replace('penstock', '');
    return `Cebri Boru ${num}`.trim();
  }
  const componentLabels: Record<string, string> = {
    upper_reservoir: 'Üst Rezervuar',
    lower_reservoir: 'Alt Rezervuar',
    intake: 'Su Alma',
    headrace_tunnel: 'İletim Tüneli',
    pressure_tunnel: 'Basınç Tüneli',
    surge_tank: 'Denge Bacası',
    penstock: 'Cebri Boru',
    powerhouse: 'Santral',
    switchyard: 'Şalt',
    new_switchyard: 'Yeni Şalt',
    existing_switchyard: 'Mevcut Şalt',
    tailrace_tunnel: 'Kuyruksuyu',
    tailrace_channel: 'Kuyruksuyu',
    portal: 'Portal',
    service_portal: 'Servis Portalı',
  };
  if (item.component in componentLabels) return componentLabels[item.component];
  const idLabels: Record<string, string> = {
    upperReservoirWater: 'Üst Rezervuar',
    upperReservoirEmbankment: 'Üst Rezervuar Seti',
    upperDamCrestRoad: 'Kret Yolu',
    upperIntake: 'Su Alma Yapısı (Intake)',
    upperIntakeStructure: 'Su Alma Yapısı (Intake)',
    intake: 'Su Alma Yapısı (Intake)',
    headraceAlignment: 'Basınç Tüneli Ekseni',
    surgeTankFootprint: 'Denge Bacası',
    serviceDrainPortal: 'Servis Portalı',
    powerhouseFootprint: 'Türbin Odası',
    tailraceOutfall: 'Kuyruksuyu',
    switchyardFootprint: 'Şalt Sahası',
    existingSwitchyardFootprint: 'Mevcut Şalt Sahası',
    newSwitchyardFootprint: 'Yeni Şalt Sahası',
    lowerReservoirWater: 'Alt Rezervuar',
    lowerDamAxis: 'Alt Rezervuar Seddesi',
    lowerReservoirDamEmbankment: 'Alt Rezervuar Seti',
  };
  return idLabels[item.id] ?? COMPONENTS.find((c) => c.key === item.component)?.label ?? item.component;
}

export function componentLabel(key: string): string {
  return COMPONENTS.find((c) => c.key === key)?.label ?? key;
}

const MATERIAL_LABELS: Record<string, string> = {
  water: 'su yüzeyi',
  embankment: 'set',
  crest_road: 'kret yolu',
  concrete: 'beton',
  tunnel_axis: 'eksen',
  shaft: 'şaft',
  portal: 'portal yapısı',
  industrial: 'yapı',
  tailrace_channel: 'kanal',
  switchyard: 'şalt',
  switchyard_existing: 'mevcut şalt',
  switchyard_new: 'yeni şalt',
};

/**
 * Yapı ağacı ve bilgi başlığı için malzeme ayrımlı etiket: aynı bileşenin
 * birden fazla poligonu (set / su / beton) birbirinden ayırt edilir.
 * Sahne etiketleri kısa tutulur, burada kesinlik önceliklidir.
 */
export function footprintItemDetailLabel(item: Pick<Layout3DProjectedFootprint, 'id' | 'component' | 'material'>): string {
  const base = footprintItemLabel(item);
  const material = MATERIAL_LABELS[item.material];
  return material ? `${base} · ${material}` : base;
}

export function componentDescription(key: string): string {
  return COMPONENTS.find((c) => c.key === key)?.description ?? '';
}
