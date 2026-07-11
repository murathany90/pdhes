import { useEffect, useState } from 'react';
import { useSiteStore } from '../stores/useSiteStore';
import type {
  PdhesType,
  ConceptType,
  CoordinateConfidence,
  CycleType,
  GridSupplyType,
  InfrastructureType,
  PrimaryPurpose,
  Site,
  TechnicalClassification,
} from '../types/site';
import {
  CONCEPT_TYPE_LABELS,
  COORDINATE_CONFIDENCE_LABELS,
  CYCLE_TYPE_LABELS,
  getSiteView,
  GRID_SUPPLY_TYPE_LABELS,
  INFRASTRUCTURE_TYPE_LABELS,
  PRIMARY_PURPOSE_LABELS,
  PDHES_TYPE_LABELS,
} from '../utils/siteDerived';
import { validateSites } from '../utils/siteSchema';

interface SiteEditorPageProps {
  mode: 'new' | 'edit';
  templateSite?: Site;
  onDone: () => void;
}

type NumericKey =
  | 'capacityMW'
  | 'projectFlowCms'
  | 'headM'
  | 'energyGWh'
  | 'activeVolumeHm3'
  | 'tunnelLengthKm'
  | 'capexUsdBn'
  | 'annualRevenueUsdM'
  | 'paybackYear'
  | 'score'
  | 'shaftLengthM'
  | 'penstockLengthM'
  | 'tailraceTunnelLengthM';

const NUMERIC_FIELDS: { key: NumericKey; label: string; nullable?: boolean }[] = [
  { key: 'capacityMW', label: 'Kurulu güç (MW)' },
  { key: 'projectFlowCms', label: 'Proje debisi (m3/s)', nullable: true },
  { key: 'headM', label: 'Düşü (m)', nullable: true },
  { key: 'energyGWh', label: 'Depolama enerjisi (GWh)', nullable: true },
  { key: 'activeVolumeHm3', label: 'Aktif hacim (hm3)', nullable: true },
  { key: 'tunnelLengthKm', label: 'Tünel / su yolu (km)', nullable: true },
  { key: 'capexUsdBn', label: 'Yatırım gideri (milyar USD)', nullable: true },
  { key: 'annualRevenueUsdM', label: 'Yıllık gelir (milyon USD/yıl)', nullable: true },
  { key: 'paybackYear', label: 'Geri ödeme (yıl)', nullable: true },
  { key: 'score', label: 'Skor', nullable: true },
  { key: 'shaftLengthM', label: 'Şaft uzunluğu (m)', nullable: true },
  { key: 'penstockLengthM', label: 'Cebri boru uzunluğu (m)', nullable: true },
  { key: 'tailraceTunnelLengthM', label: 'Kuyruksuyu tüneli (m)', nullable: true },
];

function cloneSite(site: Site): Site {
  return JSON.parse(JSON.stringify(site)) as Site;
}

function makeDraft(template: Site, mode: 'new' | 'edit'): Site {
  const draft = cloneSite(template);
  if (mode === 'new') {
    const suffix = Date.now().toString().slice(-6);
    draft.id = `yeni-pdhes-${suffix}`;
    draft.name = 'Yeni PDHES adayı';
    draft.province = 'Yeni İl';
    draft.country = 'Türkiye';
    draft.sourceNote = 'Yerel çalışma alanında oluşturulan kavramsal kayıt.';
    draft.order = template.order + 1;
    draft.score = 50;
    draft.thesis = 'Yeni aday için ön eleme notu giriniz.';
    draft.risks = ['saha teyidi gerekli'];
    draft.assumptions = ['Yerel editörde oluşturuldu; teknik değerler doğrulanmalı.'];
    draft.timeline = [{ date: new Date().getFullYear().toString(), title: 'Ön kayıt', text: 'Yerel çalışma alanında oluşturuldu.' }];
  }
  return draft;
}

function entries<T extends string>(labels: Record<T, string>): [T, string][] {
  return Object.entries(labels) as [T, string][];
}

export default function SiteEditorPage({ mode, templateSite, onDone }: SiteEditorPageProps) {
  const { addSite, updateSite } = useSiteStore();
  const [draft, setDraft] = useState<Site | null>(templateSite ? makeDraft(templateSite, mode) : null);
  const [risksText, setRisksText] = useState(draft?.risks.join('\n') || '');
  const [assumptionsText, setAssumptionsText] = useState(draft?.assumptions.join('\n') || '');
  const [recordText, setRecordText] = useState(draft ? JSON.stringify(draft, null, 2) : '');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!templateSite) return;
    const nextDraft = makeDraft(templateSite, mode);
    setDraft(nextDraft);
    setRisksText(nextDraft.risks.join('\n'));
    setAssumptionsText(nextDraft.assumptions.join('\n'));
    setRecordText(JSON.stringify(nextDraft, null, 2));
  }, [mode, templateSite]);

  if (!draft) {
    return <section className="panel active"><p className="muted">Düzenlenecek saha bulunamadı.</p></section>;
  }

  const updateDraft = <K extends keyof Site>(key: K, value: Site[K]) => {
    setDraft((current) => current ? { ...current, [key]: value } : current);
  };

  const updateNumeric = (key: NumericKey, raw: string) => {
    setDraft((current) => {
      if (!current) return current;
      const field = NUMERIC_FIELDS.find((item) => item.key === key);
      const parsed = Number(raw);
      const value = raw === '' && field?.nullable
        ? null
        : Number.isFinite(parsed)
          ? parsed
          : current[key];
      return { ...current, [key]: value };
    });
  };

  const updateClassification = <K extends keyof TechnicalClassification>(key: K, value: TechnicalClassification[K]) => {
    setDraft((current) => current ? {
      ...current,
      technicalClassification: {
        ...current.technicalClassification,
        [key]: value,
      },
    } : current);
  };

  const updateCoordinateConfidence = (value: CoordinateConfidence) => {
    setDraft((current) => current ? {
      ...current,
      coordinates: { ...current.coordinates, coordinateConfidence: value },
    } : current);
  };

  const updateCoordinate = (lon: number, lat: number) => {
    setDraft((current) => {
      if (!current) return current;
      const view = getSiteView(current);
      return {
        ...current,
        coordinates: { ...current.coordinates, mapAnchor: [lon, lat] },
        view: { ...view, center: [lon, lat] },
      };
    });
  };

  const save = () => {
    const risks = risksText.split('\n').map((risk) => risk.trim()).filter(Boolean);
    const assumptions = assumptionsText.split('\n').map((assumption) => assumption.trim()).filter(Boolean);
    const site: Site = {
      ...draft,
      id: mode === 'edit' && templateSite ? templateSite.id : draft.id,
      risks,
      assumptions,
      coordinates: {
        ...draft.coordinates,
        lowerReservoir: { ...draft.coordinates.lowerReservoir, name: draft.lowerReservoirName },
        upperReservoir: { ...draft.coordinates.upperReservoir, description: draft.upperReservoirDescription },
      },
    };
    if (!site.id.trim() || !site.name.trim()) {
      setMessage('ID ve saha adı zorunludur.');
      return;
    }
    const validation = validateSites([site]);
    if (!validation.ok) {
      setMessage(`Saha kaydı geçersiz: ${validation.errors[0]}`);
      return;
    }
    const validatedSite = validation.sites[0];
    if (mode === 'new') addSite(validatedSite);
    else updateSite(templateSite?.id ?? validatedSite.id, validatedSite);
    setDraft(validatedSite);
    setRecordText(JSON.stringify(validatedSite, null, 2));
    setMessage('Saha kaydedildi.');
  };

  const mapAnchor = draft.coordinates.mapAnchor;

  return (
    <section className="panel active">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <h2>{mode === 'new' ? 'Yeni PDHES adayı ekle' : 'PDHES sahasını düzenle'}</h2>
            <p className="muted small">Form alanları kaydedildiğinde v3 çalışma listesi bu tarayıcıda güncellenir.</p>
          </div>
          <button className="btn ghost" onClick={onDone}>Yerel çalışma alanına dön</button>
        </div>

        <div className="form-tabs">
          <span className="tag classic">Genel</span>
          <span className="tag sea">Sınıflandırma</span>
          <span className="tag risk">Koordinat</span>
          <span className="tag">Teknik</span>
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
              <label>PDHES Türü</label>
              <select className="select" value={draft.pdhesType} onChange={(event) => updateDraft('pdhesType', event.target.value as PdhesType)}>
                {entries(PDHES_TYPE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>İl</label>
              <input className="input" value={draft.province} onChange={(event) => updateDraft('province', event.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label>Kaynak notu</label>
            <textarea className="textarea" value={draft.sourceNote} onChange={(event) => updateDraft('sourceNote', event.target.value)} />
          </div>

          <div className="form-group">
            <label>Yatırım tezi</label>
            <textarea className="textarea" value={draft.thesis ?? ''} onChange={(event) => updateDraft('thesis', event.target.value)} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Alt rezervuar</label>
              <input className="input" value={draft.lowerReservoirName} onChange={(event) => updateDraft('lowerReservoirName', event.target.value)} />
            </div>
            <div className="form-group">
              <label>Üst rezervuar tanımı</label>
              <input className="input" value={draft.upperReservoirDescription} onChange={(event) => updateDraft('upperReservoirDescription', event.target.value)} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Çevrim tipi</label>
              <select className="select" value={draft.technicalClassification.cycleType} onChange={(event) => updateClassification('cycleType', event.target.value as CycleType)}>
                {entries(CYCLE_TYPE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Altyapı tipi</label>
              <select className="select" value={draft.technicalClassification.infrastructureType} onChange={(event) => updateClassification('infrastructureType', event.target.value as InfrastructureType)}>
                {entries(INFRASTRUCTURE_TYPE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Kavram tipi</label>
              <select className="select" value={draft.technicalClassification.conceptType} onChange={(event) => updateClassification('conceptType', event.target.value as ConceptType)}>
                {entries(CONCEPT_TYPE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Şebeke/arz tipi</label>
              <select className="select" value={draft.technicalClassification.gridSupplyType} onChange={(event) => updateClassification('gridSupplyType', event.target.value as GridSupplyType)}>
                {entries(GRID_SUPPLY_TYPE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Birincil amaç</label>
              <select className="select" value={draft.technicalClassification.primaryPurpose} onChange={(event) => updateClassification('primaryPurpose', event.target.value as PrimaryPurpose)}>
                {entries(PRIMARY_PURPOSE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Koordinat güveni</label>
              <select className="select" value={draft.coordinates.coordinateConfidence} onChange={(event) => updateCoordinateConfidence(event.target.value as CoordinateConfidence)}>
                {entries(COORDINATE_CONFIDENCE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Sınıflandırma notu</label>
            <textarea className="textarea" value={draft.technicalClassification.classificationNote} onChange={(event) => updateClassification('classificationNote', event.target.value)} />
          </div>

          <div className="form-row">
            {NUMERIC_FIELDS.map(({ key, label }) => (
              <div className="form-group" key={key}>
                <label>{label}</label>
                <input
                  className="input"
                  type="number"
                  step="0.1"
                  value={draft[key] ?? ''}
                  onChange={(event) => updateNumeric(key, event.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Boylam</label>
              <input className="input" type="number" step="0.0001" value={mapAnchor[0]} onChange={(event) => updateCoordinate(Number(event.target.value), mapAnchor[1])} />
            </div>
            <div className="form-group">
              <label>Enlem</label>
              <input className="input" type="number" step="0.0001" value={mapAnchor[1]} onChange={(event) => updateCoordinate(mapAnchor[0], Number(event.target.value))} />
            </div>
          </div>

          <div className="form-group">
            <label>Koordinat notu</label>
            <textarea
              className="textarea"
              value={draft.coordinates.coordinateNote}
              onChange={(event) => setDraft((current) => current ? { ...current, coordinates: { ...current.coordinates, coordinateNote: event.target.value } } : current)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Risk notları (satır satır)</label>
              <textarea className="textarea" value={risksText} onChange={(event) => setRisksText(event.target.value)} />
            </div>
            <div className="form-group">
              <label>Varsayımlar (satır satır)</label>
              <textarea className="textarea" value={assumptionsText} onChange={(event) => setAssumptionsText(event.target.value)} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16 }}>
          <button className="btn outline" onClick={() => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(draft, null, 2));
            const dlAnchorElem = document.createElement('a');
            dlAnchorElem.setAttribute("href", dataStr);
            dlAnchorElem.setAttribute("download", `${draft.id}_duzenleme.json`);
            dlAnchorElem.click();
            setMessage('Veri JSON olarak indirildi.');
          }}>⬇️ İndir (JSON)</button>
          <button className="btn primary" onClick={save}>Kaydet</button>
          <button className="btn" onClick={() => setRecordText(JSON.stringify({ ...draft, risks: risksText.split('\n').map((risk) => risk.trim()).filter(Boolean), assumptions: assumptionsText.split('\n').map((item) => item.trim()).filter(Boolean) }, null, 2))}>
            Ham kaydı yenile
          </button>
          <button
            className="btn"
            onClick={() => {
              try {
                const parsed = JSON.parse(recordText) as Site;
                const candidate = mode === 'edit' && templateSite
                  ? { ...parsed, id: templateSite.id }
                  : parsed;
                const validation = validateSites([candidate]);
                if (!validation.ok) {
                  setMessage(`Ham kayıt geçersiz: ${validation.errors[0]}`);
                  return;
                }
                const nextDraft = validation.sites[0];
                setDraft(nextDraft);
                setRisksText(nextDraft.risks.join('\n'));
                setAssumptionsText(nextDraft.assumptions.join('\n'));
                setRecordText(JSON.stringify(nextDraft, null, 2));
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
