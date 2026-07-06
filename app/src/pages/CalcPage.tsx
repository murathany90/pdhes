import type { Site } from '../types/site';
import { useCalcEngine } from '../hooks/useCalcEngine';
import { moneyBn, moneyM } from '../utils/format';
import ScorePill from '../components/ui/ScorePill';
import WarningBanner from '../components/ui/WarningBanner';

const SCORE_LABELS: Record<string, string> = {
  topo: 'Topografya / düşü (head)',
  grid: 'Şebeke bağlantısı',
  env: 'Çevre / izin',
  geology: 'Jeoloji / deprem',
  access: 'Erişim',
  market: 'Piyasa / yük',
};

export default function CalcPage({ site }: { site?: Site }) {
  const { scenario, values, setScenarioValue, resetScenario } = useCalcEngine(site);

  if (!site || !values) return <section className="panel active"><p className="muted">Veri yükleniyor...</p></section>;

  // Karlılık skoru: 4 yılda geri ödemeye 100 puan, 24 yıla 0 puan
  const profitScore = values.payback === null
    ? 0
    : Math.max(0, Math.min(100, 100 - (values.payback - 4) * 5));
  const paybackLabel = values.payback === null ? 'hesaplanamaz' : `${values.payback.toFixed(1)} yıl`;

  return (
    <section className="panel active">
      <div className="calc-layout">
        <div className="card">
          <h2>Hesaplama motoru</h2>
          <p className="muted">Seçili saha için enerji, yatırım gideri ve gelir varsayımlarını hızlıca stres test edin.</p>

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
{`Seçili saha: ${site.name}

Enerji formülü:
E = ρ · g · H · V · η / 3.6e12
ρ: su yoğunluğu, g: yerçekimi, H: net düşü (head), V: aktif hacim, η: çevrim verimi

H=${site.head} m, V=${site.activeMcm} milyon m³, η=0.85
Veri setindeki enerji ölçeği: ${site.energyGWh} GWh
Hesaplanan fiziksel enerji: ${values.physicsGWh.toFixed(2)} GWh

Yatırım gideri:
${site.capexBn} milyar € x ${scenario.capexFactor.toFixed(2)} = ${values.adjCapex.toFixed(2)} milyar €
${values.eurPerKw === null ? 'Hesaplanamaz' : `${Math.round(values.eurPerKw).toLocaleString('tr-TR')} €/kW`}

Gelir:
${site.revenueM} milyon €/yıl x çevrim(${scenario.cycles}/300) x gelir(${scenario.revenueFactor.toFixed(2)}) x yardımcı hizmet(${(1 + scenario.reservePremium / 100).toFixed(2)}) = ${values.adjRevenue.toFixed(1)} milyon €/yıl`}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2>Skor ve risk kırılımı</h2>
          <div style={{ display: 'grid', gap: 10 }}>
            {Object.entries(site.scores).map(([key, value]) => (
              <div className="bar-row" key={key}>
                <span>{SCORE_LABELS[key] || key}</span>
                <div className="bar"><i style={{ width: `${value}%` }} /></div>
                <b>{value}/100</b>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14 }}>
            <h3>Başlıca riskler</h3>
            {site.risks.map((risk, index) => (
              <span key={risk} className={`tag ${index < 2 ? 'danger' : 'risk'}`}>{risk}</span>
            ))}
          </div>
          <div style={{ marginTop: 14 }}>
            <WarningBanner
              type="danger"
              message="Nihai skor; yükseklik modeli, parsel, jeoteknik, ÇED, TEİAŞ N-1/kısa devre ve DSİ işletme rejimi doğrulanmadan yatırım kararı yerine kullanılamaz."
            />
          </div>
        </div>
      </div>
    </section>
  );
}
