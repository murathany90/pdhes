import { ShieldCheck } from 'lucide-react';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useSiteStore } from '../stores/useSiteStore';
import WarningBanner from '../components/ui/WarningBanner';
import { isLocalWorkspaceEnabled } from '../utils/workspaceMode';
import { useCalcEngine } from '../hooks/useCalcEngine';
import { moneyBn, moneyM, num } from '../utils/format';

import type { MapStyleKind } from '../utils/mapProviders';

export default function SettingsPage() {
  const { 
    theme, mapStyle, heightScale,
    setTheme, setMapStyle, setHeightScale
  } = useSettingsStore();
  const { resetSites, sites, selectedId } = useSiteStore();

  const selectedSite = sites.find((site) => site.id === selectedId) || sites[0];
  const { scenario, values, setScenarioValue, resetScenario } = useCalcEngine(selectedSite);

  const workspaceEnabled = isLocalWorkspaceEnabled(window.location.search);
  const workspaceHref = workspaceEnabled
    ? '#/workspace'
    : `${window.location.pathname || '/'}?editor=1#/workspace`;

  const paybackLabel = values?.payback === null || values?.payback === undefined ? 'hesaplanamaz' : `${values.payback.toFixed(1)} yıl`;

  return (
    <section className="panel active">
      <div className="settings-layout">
        <div className="card">
          <h2>Arayüz ve harita</h2>
          <div className="editor-form">
            <div className="form-group">
              <label htmlFor="settings-theme">Tema</label>
              <select id="settings-theme" className="select" value={theme} onChange={(event) => setTheme(event.target.value as 'dark' | 'light')}>
                <option value="dark">Koyu</option>
                <option value="light">Açık</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="settings-map-style">Harita görünümü</label>
              <select id="settings-map-style" className="select" value={mapStyle} onChange={(event) => setMapStyle(event.target.value as MapStyleKind)}>
                <option value="osm">OSM Standart</option>
                <option value="topo">OpenTopoMap</option>
                <option value="light">CartoDB Light</option>
                <option value="dark">CartoDB Dark</option>
                <option value="gray">Esri World Gray</option>
                <option value="satellite">Uydu - Esri World Imagery</option>
                <option value="maptiler-basic">MapTiler Basic</option>
                <option value="maptiler-backdrop">MapTiler Backdrop</option>
                <option value="maptiler-topo">MapTiler Topo</option>
                <option value="maptiler-hybrid">Uydu - MapTiler Hybrid</option>
              </select>
            </div>
            <div className="range-row">
              <label htmlFor="settings-height-scale">3D yükseklik ölçeği</label>
              <input id="settings-height-scale" type="range" min={0.4} max={3} step={0.1} value={heightScale} aria-valuetext={`${heightScale.toFixed(1)}x`} onChange={(event) => setHeightScale(+event.target.value)} />
              <output htmlFor="settings-height-scale" className="kbd">{heightScale.toFixed(1)}x</output>
            </div>
          </div>
        </div>

        <div className="card">
          <h2>Veri yönetimi</h2>

          <div style={{ marginTop: 12 }}>
            <WarningBanner
              type="info"
              message="Saha verisi kamu kurumlarının kavramsal tasarım çalışmalarına dayanan 11 karayüzeyli aday ve 4 deniz tipi prototip üzerinden oluşturulmuştur. Eski v1/v2 çalışma alanı yedekleri içe aktarılmaz."
            />
          </div>
          <button className="btn danger" style={{ marginTop: 14 }} onClick={() => { if (confirm('Kaydedilmiş saha düzenlemeleri sıfırlansın mı?')) resetSites(); }}>
            Saha düzenlemelerini sıfırla
          </button>
          <p className="muted small" style={{ marginTop: 12 }}>
            Mevcut çalışma listesinde {sites.length} Türkiye adayı var.
          </p>
        </div>

        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <h2>Hesaplama Motoru (Aktif Tesis: {selectedSite?.name || 'Seçilmedi'})</h2>
          <p className="muted">Enerji hesabı kaynak düşü değerini ve aktif hacim yoksa kullanıcı senaryo hacmini kullanır.</p>

          {(!selectedSite || !values) ? (
            <p className="muted" style={{ marginTop: 16 }}>Hesaplama verisi yükleniyor veya tesis seçilmedi...</p>
          ) : (
            <>
              <div className="metric-row" style={{ margin: '16px 0' }}>
                <div className="metric good"><span>Fiziksel enerji</span><b>{values.physicsGWh.toFixed(2)} GWh</b></div>
                <div className="metric info"><span>Teorik güç kontrolü</span><b>{values.theoreticalPowerMW === null ? 'Belirtilmedi' : `${num(values.theoreticalPowerMW)} MW`}</b></div>
                <div className="metric warn"><span>Senaryo yatırım gideri</span><b>{moneyBn(values.adjCapex)}</b></div>
                <div className="metric"><span>Geri ödeme ({paybackLabel})</span><b>{moneyM(values.adjRevenue)}</b></div>
              </div>

              <div className="grid cols-2">
                <div>
                  <h3>Senaryo ayarları</h3>
                  <div className="range-row">
                    <label htmlFor="calc-active-volume">Senaryo aktif hacmi</label>
                    <input id="calc-active-volume" type="range" min={1} max={50} step={1} value={scenario.activeVolumeHm3} aria-valuetext={`${scenario.activeVolumeHm3} hm³`} onChange={(event) => setScenarioValue('activeVolumeHm3', +event.target.value)} />
                    <output htmlFor="calc-active-volume" className="kbd">{scenario.activeVolumeHm3} hm³</output>
                  </div>
                  <div className="range-row">
                    <label htmlFor="calc-capex-factor">Yatırım gideri çarpanı</label>
                    <input id="calc-capex-factor" type="range" min={0.75} max={1.45} step={0.01} value={scenario.capexFactor} aria-valuetext={`${scenario.capexFactor.toFixed(2)}x`} onChange={(event) => setScenarioValue('capexFactor', +event.target.value)} />
                    <output htmlFor="calc-capex-factor" className="kbd">{scenario.capexFactor.toFixed(2)}x</output>
                  </div>
                  <div className="range-row">
                    <label htmlFor="calc-revenue-factor">Gelir yakalama</label>
                    <input id="calc-revenue-factor" type="range" min={0.55} max={1.55} step={0.01} value={scenario.revenueFactor} aria-valuetext={`${scenario.revenueFactor.toFixed(2)}x`} onChange={(event) => setScenarioValue('revenueFactor', +event.target.value)} />
                    <output htmlFor="calc-revenue-factor" className="kbd">{scenario.revenueFactor.toFixed(2)}x</output>
                  </div>
                  <div className="range-row">
                    <label htmlFor="calc-cycles">Çevrim / yıl</label>
                    <input id="calc-cycles" type="range" min={180} max={360} step={5} value={scenario.cycles} aria-valuetext={`${scenario.cycles} çevrim`} onChange={(event) => setScenarioValue('cycles', +event.target.value)} />
                    <output htmlFor="calc-cycles" className="kbd">{scenario.cycles}</output>
                  </div>
                  <div className="range-row">
                    <label htmlFor="calc-reserve-premium">Yardımcı hizmet primi</label>
                    <input id="calc-reserve-premium" type="range" min={0} max={45} step={1} value={scenario.reservePremium} aria-valuetext={`${scenario.reservePremium}%`} onChange={(event) => setScenarioValue('reservePremium', +event.target.value)} />
                    <output htmlFor="calc-reserve-premium" className="kbd">{scenario.reservePremium}%</output>
                  </div>
                  <button className="btn" onClick={resetScenario}>Senaryoyu sıfırla</button>
                </div>
                <div>
                  <h3>Enerji hesabı</h3>
                  <div className="formula">
{`Seçili saha: ${selectedSite.name}

Enerji formülü:
E = ρ · g · H · V · η / 3.6e12
ρ: su yoğunluğu, g: yerçekimi, H: net düşü, V: aktif hacim, η: çevrim verimi

H=${selectedSite.headM ?? 'Belirtilmedi'} m, V=${selectedSite.activeVolumeHm3 ?? scenario.activeVolumeHm3} hm³, η=0.85
Hacim kaynağı: ${values.volumeSource === 'source' ? 'veri seti' : 'senaryo varsayımı'}
${values.consistencyNote}
Kaynak kurulu güç: ${selectedSite.capacityMW} MW
Teorik güç kontrolü: ${values.theoreticalPowerMW === null ? 'Belirtilmedi' : `${num(values.theoreticalPowerMW)} MW`}
Hesaplanan fiziksel enerji: ${values.physicsGWh.toFixed(2)} GWh

Yatırım gideri:
${selectedSite.capexUsdBn ?? 'Belirtilmedi'} milyar USD x ${scenario.capexFactor.toFixed(2)} = ${values.adjCapex.toFixed(2)} milyar USD
${values.eurPerKw === null ? 'Hesaplanamaz' : `${Math.round(values.eurPerKw).toLocaleString('tr-TR')} USD/kW`}

Gelir:
${selectedSite.annualRevenueUsdM ?? 'Belirtilmedi'} milyon USD/yıl x çevrim(${scenario.cycles}/300) x gelir(${scenario.revenueFactor.toFixed(2)}) x yardımcı hizmet(${(1 + scenario.reservePremium / 100).toFixed(2)}) = ${values.adjRevenue.toFixed(1)} milyon USD/yıl`}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="card workspace-settings-card" style={{ gridColumn: '1 / -1' }}>
          <h2>Yerel çalışma alanı</h2>
          <p className="muted">
            Saha ve 3D yerleşim düzenleme araçları yalnızca bu tarayıcıda çalışır; genel veri setini veya yayımlanan uygulamayı değiştirmez.
          </p>
          <div style={{ margin: '14px 0' }}>
            <WarningBanner
              type="info"
              message={workspaceEnabled
                ? 'Yerel çalışma alanı bu oturum için etkin.'
                : 'Gelişmiş düzenleme araçları varsayılan olarak kapalıdır. İhtiyacınız olduğunda buradan etkinleştirebilirsiniz.'}
            />
          </div>
          <a className="btn primary" href={workspaceHref}>
            <ShieldCheck size={16} aria-hidden="true" />
            {workspaceEnabled ? 'Yerel çalışma alanını aç' : 'Yerel çalışma alanını etkinleştir'}
          </a>
        </div>
      </div>
    </section>
  );
}
