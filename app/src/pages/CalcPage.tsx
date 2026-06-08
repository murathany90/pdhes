import type { Site } from '../types/site';
import { useCalcEngine } from '../hooks/useCalcEngine';
import { moneyBn, moneyM } from '../utils/format';

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
            <div className="metric"><span>Basit geri ödeme</span><b>{values.payback.toFixed(1)} yıl</b></div>
          </div>

          <div className="grid cols-2">
            <div>
              <h3>Senaryo ayarları</h3>
              <div className="range-row">
                <label>Yatırım gideri çarpanı</label>
                <input type="range" min={0.75} max={1.45} step={0.01} value={scenario.capexFactor} onChange={(event) => setScenarioValue('capexFactor', +event.target.value)} />
                <span className="kbd">{scenario.capexFactor.toFixed(2)}x</span>
              </div>
              <div className="range-row">
                <label>Gelir yakalama</label>
                <input type="range" min={0.55} max={1.55} step={0.01} value={scenario.revenueFactor} onChange={(event) => setScenarioValue('revenueFactor', +event.target.value)} />
                <span className="kbd">{scenario.revenueFactor.toFixed(2)}x</span>
              </div>
              <div className="range-row">
                <label>Çevrim / yıl</label>
                <input type="range" min={180} max={360} step={5} value={scenario.cycles} onChange={(event) => setScenarioValue('cycles', +event.target.value)} />
                <span className="kbd">{scenario.cycles}</span>
              </div>
              <div className="range-row">
                <label>Yardımcı hizmet primi</label>
                <input type="range" min={0} max={45} step={1} value={scenario.reservePremium} onChange={(event) => setScenarioValue('reservePremium', +event.target.value)} />
                <span className="kbd">{scenario.reservePremium}%</span>
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
${Math.round(values.eurPerKw).toLocaleString('tr-TR')} €/kW

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
          <div className="danger-notice" style={{ marginTop: 14 }}>
            Nihai skor; yükseklik modeli, parsel, jeoteknik, ÇED, TEİAŞ N-1/kısa devre ve DSİ işletme rejimi doğrulanmadan yatırım kararı yerine kullanılamaz.
          </div>
        </div>
      </div>
    </section>
  );
}
