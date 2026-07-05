import { useEffect, useState } from 'react';
import { useSiteStore } from '../stores/useSiteStore';
import type { Concept, PdhesType, Site } from '../types/site';

interface SiteEditorPageProps {
  mode: 'new' | 'edit';
  templateSite?: Site;
  onDone: () => void;
}

const SCORE_LABELS: Record<string, string> = {
  topo: 'Topografya',
  grid: 'Şebeke',
  capex: 'Yatırım',
  revenue: 'Gelir',
  risk: 'Risk',
};

function cloneSite(site: Site): Site {
  return JSON.parse(JSON.stringify(site)) as Site;
}

function makeDraft(template: Site, mode: 'new' | 'edit'): Site {
  const draft = cloneSite(template);
  if (mode === 'new') {
    const suffix = Date.now().toString().slice(-6);
    draft.id = `yeni-pspp-${suffix}`;
    draft.name = 'Yeni PDHES adayı';
    draft.region = 'Yeni Bölge';
    draft.province = 'Yeni İl';
    draft.score = 50;
    draft.thesis = 'Yeni aday için ön eleme notu giriniz.';
    draft.risks = ['saha teyidi gerekli'];
    draft.timeline = [{ date: new Date().getFullYear().toString(), title: 'Ön kayıt', text: 'Yerel çalışma alanında oluşturuldu.' }];
  }
  return draft;
}

export default function SiteEditorPage({ mode, templateSite, onDone }: SiteEditorPageProps) {
  const { addSite, updateSite } = useSiteStore();
  const [draft, setDraft] = useState<Site | null>(templateSite ? makeDraft(templateSite, mode) : null);
  const [risksText, setRisksText] = useState(draft?.risks.join(', ') || '');
  const [recordText, setRecordText] = useState(draft ? JSON.stringify(draft, null, 2) : '');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!templateSite) return;
    const nextDraft = makeDraft(templateSite, mode);
    setDraft(nextDraft);
    setRisksText(nextDraft.risks.join(', '));
    setRecordText(JSON.stringify(nextDraft, null, 2));
  }, [mode, templateSite]);

  if (!draft) {
    return <section className="panel active"><p className="muted">Düzenlenecek saha bulunamadı.</p></section>;
  }

  const updateDraft = <K extends keyof Site>(key: K, value: Site[K]) => {
    setDraft((current) => current ? { ...current, [key]: value } : current);
  };
  const updateCoordinate = (lon: number, lat: number) => {
    setDraft((current) => current ? {
      ...current,
      lon,
      lat,
      coordinates: { ...current.coordinates, mapAnchor: [lon, lat] },
      view: { ...current.view, center: [lon, lat] },
    } : current);
  };
  const scoreEntries = Object.entries(draft.scores) as [keyof Site['scores'], number][];

  const save = () => {
    const risks = risksText.split(',').map((risk) => risk.trim()).filter(Boolean);
    const site = { ...draft, risks };
    if (!site.id.trim() || !site.name.trim()) {
      setMessage('ID ve saha adı zorunludur.');
      return;
    }
    if (mode === 'new') addSite(site);
    else updateSite(site.id, site);
    setMessage('Saha kaydedildi.');
  };

  return (
    <section className="panel active">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <h2>{mode === 'new' ? 'Yeni PDHES adayı ekle' : 'PDHES sahasını düzenle'}</h2>
            <p className="muted small">Form alanları kaydedildiğinde tam çalışma listesi bu tarayıcıda güncellenir.</p>
          </div>
          <button className="btn ghost" onClick={onDone}>Yerel çalışma alanına dön</button>
        </div>

        <div className="form-tabs">
          <span className="tag classic">Genel</span>
          <span className="tag sea">Teknik</span>
          <span className="tag risk">Koordinat</span>
          <span className="tag">Skor</span>
        </div>

        <div className="editor-form">
          <div className="form-row">
            <div className="form-group">
              <label>ID</label>
              <input className="input" value={draft.id} onChange={(event) => updateDraft('id', event.target.value)} disabled={mode === 'edit'} />
            </div>
            <div className="form-group">
              <label>Saha adı</label>
              <input className="input" value={draft.name} onChange={(event) => updateDraft('name', event.target.value)} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Kavram tipi</label>
              <select className="select" value={draft.concept} onChange={(event) => updateDraft('concept', event.target.value as Concept)}>
                <option value="classic">Klasik iki rezervuarlı</option>
                <option value="sea">Deniz suyu kullanımlı</option>
              </select>
            </div>
            <div className="form-group">
              <label>PDHES tipi</label>
              <select className="select" value={draft.pdhesType} onChange={(event) => updateDraft('pdhesType', event.target.value as PdhesType)}>
                <option value="OPEN_LOOP">Açık Devre</option>
                <option value="CLOSED_LOOP">Kapalı Devre</option>
                <option value="SEA_WATER">Deniz Suyu</option>
                <option value="PROTOTYPE">Prototip / Pilot</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Bölge</label>
              <input className="input" value={draft.region} onChange={(event) => updateDraft('region', event.target.value)} />
            </div>
            <div className="form-group">
              <label>İl</label>
              <input className="input" value={draft.province} onChange={(event) => updateDraft('province', event.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label>Yatırım tezi</label>
            <textarea className="textarea" value={draft.thesis} onChange={(event) => updateDraft('thesis', event.target.value)} />
          </div>

          <div className="form-row">
            {[
              ['head', 'Düşü (head, m)'],
              ['tunnelKm', 'Tünel / cebri boru (km)'],
              ['activeMcm', 'Aktif hacim (Mm³)'],
              ['powerMW', 'Kurulu güç (MW)'],
              ['energyGWh', 'Depolama enerjisi (GWh)'],
              ['capexBn', 'Yatırım gideri (milyar €)'],
              ['revenueM', 'Yıllık gelir (milyon €/yıl)'],
              ['payback', 'Geri ödeme (yıl)'],
            ].map(([key, label]) => (
              <div className="form-group" key={key}>
                <label>{label}</label>
                <input
                  className="input"
                  type="number"
                  step="0.1"
                  value={String(draft[key as keyof Site] ?? '')}
                  onChange={(event) => updateDraft(key as keyof Site, Number(event.target.value) as Site[keyof Site])}
                />
              </div>
            ))}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Boylam</label>
              <input className="input" type="number" step="0.0001" value={draft.lon} onChange={(event) => updateCoordinate(Number(event.target.value), draft.lat)} />
            </div>
            <div className="form-group">
              <label>Enlem</label>
              <input className="input" type="number" step="0.0001" value={draft.lat} onChange={(event) => updateCoordinate(draft.lon, Number(event.target.value))} />
            </div>
          </div>

          <div className="form-group">
            <label>Risk notları (virgülle ayırın)</label>
            <textarea className="textarea" value={risksText} onChange={(event) => setRisksText(event.target.value)} />
          </div>

          <div className="grid cols-3">
            {scoreEntries.map(([key, value]) => (
              <div className="range-row" key={key}>
                <label>{SCORE_LABELS[key] || key}</label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={value}
                  onChange={(event) => setDraft((current) => current ? {
                    ...current,
                    scores: { ...current.scores, [key]: Number(event.target.value) },
                  } : current)}
                />
                <span className="kbd">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16 }}>
          <button className="btn primary" onClick={save}>Kaydet</button>
          <button className="btn" onClick={() => setRecordText(JSON.stringify({ ...draft, risks: risksText.split(',').map((risk) => risk.trim()).filter(Boolean) }, null, 2))}>
            Ham kaydı yenile
          </button>
          <button
            className="btn"
            onClick={() => {
              try {
                const parsed = JSON.parse(recordText) as Site;
                setDraft(parsed);
                setRisksText(parsed.risks?.join(', ') || '');
                setMessage('Ham kayıt taslağa aktarıldı.');
              } catch {
                setMessage('Ham kayıt geçersiz.');
              }
            }}
          >
            Ham kaydı taslağa aktar
          </button>
        </div>
        {message && <p className="notice" style={{ marginTop: 12 }}>{message}</p>}
        <textarea className="textarea mono" value={recordText} onChange={(event) => setRecordText(event.target.value)} style={{ marginTop: 12, minHeight: 220 }} />
      </div>
    </section>
  );
}
