import { ShieldCheck } from 'lucide-react';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useSiteStore } from '../stores/useSiteStore';
import WarningBanner from '../components/ui/WarningBanner';
import ScorePill from '../components/ui/ScorePill';
import { calculateWeightedScore } from '../utils/scoring';
import { isLocalWorkspaceEnabled } from '../utils/workspaceMode';
import { useCalcEngine } from '../hooks/useCalcEngine';
import { moneyBn, moneyM } from '../utils/format';

const WEIGHT_LABELS: Record<string, string> = {
  topo: 'Topografya / düşü',
  grid: 'Şebeke yakınlığı',
  env: 'Çevresel kısıt',
  geology: 'Jeoloji / deprem',
  access: 'Erişim ve lojistik',
  market: 'Piyasa ve yük',
};



export default function SettingsPage() {
  const { theme, mapStyle, heightScale, weights, setTheme, setMapStyle, setHeightScale, setWeight } = useSettingsStore();
  const { resetSites, sites, selectedId } = useSiteStore();
  
  const selectedSite = sites.find((site) => site.id === selectedId) || sites[0];
  const { scenario, values, setScenarioValue, resetScenario } = useCalcEngine(selectedSite);
  
  const scenarioScore = selectedSite
    ? calculateWeightedScore(selectedSite.scores, weights)
    : null;
  const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
  const workspaceEnabled = isLocalWorkspaceEnabled(window.location.search);
  const workspaceHref = workspaceEnabled
    ? '#/workspace'
    : `${window.location.pathname || '/'}?editor=1#/workspace`;

  // Karlılık skoru
  const profitScore = values?.payback === null || values?.payback === undefined
    ? 0
    : Math.max(0, Math.min(100, 100 - (values.payback - 4) * 5));
  const paybackLabel = values?.payback === null || values?.payback === undefined ? 'hesaplanamaz' : `${values.payback.toFixed(1)} yıl`;

  return (
    <section className="panel active">
      <div className="settings-layout">
        
        {/* Ayarlar ve Tema Kartı */}
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
              <select id="settings-map-style" className="select" value={mapStyle} onChange={(event) => setMapStyle(event.target.value as 'dark' | 'light' | 'satellite')}>
                <option value="dark">Koyu</option>
                <option value="light">Açık</option>
                <option value="satellite">Uydu</option>
              </select>
            </div>
            <div className="range-row">
              <label htmlFor="settings-height-scale">3D yükseklik ölçeği</label>
              <input id="settings-height-scale" type="range" min={0.4} max={3} step={0.1} value={heightScale} aria-valuetext={`${heightScale.toFixed(1)}x`} onChange={(event) => setHeightScale(+event.target.value)} />
              <output htmlFor="settings-height-scale" className="kbd">{heightScale.toFixed(1)}x</output>
            </div>
          </div>
        </div>

        {/* Skor Ağırlıkları Kartı */}
        <div className="card">
          <h2>Skor ağırlıkları</h2>
          {Object.entries(weights).map(([key, value]) => {
            const inputId = `settings-weight-${key}`;
            return (
              <div className="range-row" key={key}>
                <label htmlFor={inputId}>{WEIGHT_LABELS[key] || key}</label>
                <input id={inputId} type="range" min={0} max={50} step={1} value={value} aria-valuetext={`${value} ağırlık`} onChange={(event) => setWeight(key as keyof typeof weights, +event.target.value)} />
                <output htmlFor={inputId} className="kbd">{value}</output>
              </div>
            );
          })}
          {selectedSite && (
            <div className="scenario-score-preview" aria-live="polite">
              <div>
                <span>Kaynak skor {selectedSite.score}</span>
                <small>Veri seti, değişmez</small>
              </div>
              <div>
                <span>Senaryo skoru {scenarioScore}</span>
                <small>{totalWeight} toplam ağırlık</small>
              </div>
            </div>
          )}
          <div style={{ marginTop: 12 }}>
            <WarningBanner
              type={totalWeight === 0 ? 'warning' : 'info'}
              message={totalWeight === 0
                ? 'Senaryo skoru için en az bir ağırlığı sıfırdan büyük seçin.'
                : 'Ağırlıklar senaryo skorunu anlık hesaplar; veri setindeki kaynak skoru değiştirmez.'}
            />
          </div>
          <h3 style={{ marginTop: 16 }}>Veri yönetimi</h3>
          <button className="btn danger" onClick={() => { if (confirm('Kaydedilmiş saha düzenlemeleri sıfırlansın mı?')) resetSites(); }}>
            Saha düzenlemelerini sıfırla
          </button>
          <p className="muted small" style={{ marginTop: 12 }}>
            Mevcut çalışma listesinde {sites.length} aday saha var. Yedek alma ve geri yükleme işlemleri Yerel Çalışma Alanı sekmesinden yapılır.
          </p>
        </div>

        {/* Hesaplama Motoru Kartı (CalcPage'den taşındı) */}
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <h2>Hesaplama Motoru (Aktif Tesis: {selectedSite?.name || 'Seçilmedi'})</h2>
          <p className="muted">Seçili saha için enerji, yatırım gideri ve gelir varsayımlarını stres test edin.</p>

          {(!selectedSite || !values) ? (
            <p className="muted" style={{ marginTop: 16 }}>Hesaplama verisi yükleniyor veya tesis seçilmedi...</p>
          ) : (
            <>
              <div className="metric-row" style={{ margin: '16px 0' }}>
                <div className="metric good"><span>Fiziksel enerji</span><b>{values.physicsGWh.toFixed(2)} GWh</b></div>
                <div className="metric info"><span>Senaryo yatırım gideri</span><b>{moneyBn(values.adjCapex)}</b></div>
                <div className="metric warn"><span>Brüt yıllık gelir</span><b>{moneyM(values.adjRevenue)}</b></div>
                <div className="metric">
                  <span>Senaryo göstergesi ({paybackLabel})</span>
                  <div style={{ marginTop: 6 }}><ScorePill score={Math.round(profitScore)} label="Skor" /></div>
                </div>
              </div>

              <div className="grid cols-2">
                <div>
                  <h3>Senaryo ayarları</h3>
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
ρ: su yoğunluğu, g: yerçekimi, H: net düşü (head), V: aktif hacim, η: çevrim verimi

H=${selectedSite.head} m, V=${selectedSite.activeMcm} milyon m³, η=0.85
Veri setindeki enerji ölçeği: ${selectedSite.energyGWh} GWh
Hesaplanan fiziksel enerji: ${values.physicsGWh.toFixed(2)} GWh

Yatırım gideri:
${selectedSite.capexBn} milyar € x ${scenario.capexFactor.toFixed(2)} = ${values.adjCapex.toFixed(2)} milyar €
${values.eurPerKw === null ? 'Hesaplanamaz' : `${Math.round(values.eurPerKw).toLocaleString('tr-TR')} €/kW`}

Gelir:
${selectedSite.revenueM} milyon €/yıl x çevrim(${scenario.cycles}/300) x gelir(${scenario.revenueFactor.toFixed(2)}) x yardımcı hizmet(${(1 + scenario.reservePremium / 100).toFixed(2)}) = ${values.adjRevenue.toFixed(1)} milyon €/yıl`}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Yerel Çalışma Alanı Kartı */}
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
