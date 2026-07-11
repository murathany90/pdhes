import { useEffect, useMemo, useState } from 'react';
import { CONTENT_DEFAULTS } from '../utils/constants';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { useSiteStore } from '../stores/useSiteStore';
import { moneyBn, moneyM, num } from '../utils/format';
import { CYCLE_TYPE_LABELS, PDHES_TYPE_LABELS } from '../utils/siteDerived';

interface WorkspacePageProps {
  onCreateSite: () => void;
  onEditSite: (id: string) => void;
  onEditLayout: (id: string) => void;
}

function flattenContentKeys(input: unknown, prefix = ''): string[] {
  if (typeof input === 'string') return [prefix];
  if (!input || typeof input !== 'object') return [];
  return Object.entries(input).flatMap(([key, value]) => flattenContentKeys(value, prefix ? `${prefix}.${key}` : key));
}

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function WorkspacePage({ onCreateSite, onEditSite, onEditLayout }: WorkspacePageProps) {
  const { contentOverrides, getContent, setOverride, resetOverrides, exportOverrides, importOverrides } = useWorkspaceStore();
  const { sites, selectedId, selectSite, deleteSite, importSites, exportSites } = useSiteStore();
  const [contentKey, setContentKey] = useState('');
  const [contentValue, setContentValue] = useState('');
  const [overrideImport, setOverrideImport] = useState('');
  const [siteImport, setSiteImport] = useState('');
  const [message, setMessage] = useState('');
  const contentKeys = useMemo(() => flattenContentKeys(CONTENT_DEFAULTS), []);

  useEffect(() => {
    const firstKey = contentKeys[0] || '';
    if (!contentKey && firstKey) setContentKey(firstKey);
  }, [contentKey, contentKeys]);

  useEffect(() => {
    if (contentKey) setContentValue(getContent(contentKey, CONTENT_DEFAULTS));
  }, [contentKey, contentOverrides, getContent]);

  return (
    <section className="panel active">
      <div className="notice" style={{ marginBottom: 14 }}>
        <b>Yerel Çalışma Alanı:</b> Bu yüzey gerçek bir yönetim sistemi değildir. Değişiklikler yalnızca
        bu tarayıcıda saklanır; ortak siteyi veya GitHub reposunu değiştirmez.
      </div>
      <div className="grid cols-2">
        <div className="card">
          <div className="row" style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <h2>İçerik editörü</h2>
              <p className="muted small">Metinler tarayıcıda saklanır ve yedek olarak indirilebilir.</p>
            </div>
          </div>
          <select id="workspace-content-key" name="contentKey" className="select" value={contentKey} onChange={(event) => setContentKey(event.target.value)} style={{ width: '100%', marginTop: 12 }}>
            {contentKeys.map((key) => <option key={key} value={key}>{key}</option>)}
          </select>
          <textarea id="workspace-content-value" name="contentValue" aria-label="Düzenlenen içerik" className="textarea" value={contentValue} onChange={(event) => setContentValue(event.target.value)} style={{ marginTop: 10 }} />
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 }}>
            <button className="btn primary" onClick={() => { setOverride(contentKey, contentValue); setMessage('İçerik kaydedildi.'); }}>Kaydet</button>
            <button className="btn ghost" onClick={() => downloadText('content-overrides.json', exportOverrides())}>İçerik yedeğini indir</button>
            <button className="btn danger" onClick={() => { resetOverrides(); setMessage('İçerik düzenlemeleri temizlendi.'); }}>İçeriği sıfırla</button>
          </div>
          <textarea id="workspace-content-import" name="contentImport" aria-label="İçerik yedeğini içe aktar" className="textarea" value={overrideImport} onChange={(event) => setOverrideImport(event.target.value)} placeholder="İçerik yedeğini buraya yapıştırın" style={{ marginTop: 12 }} />
          <button className="btn" onClick={() => setMessage(importOverrides(overrideImport) ? 'İçerik içe aktarıldı.' : 'İçerik yedeği geçersiz.')} style={{ marginTop: 8 }}>
            İçeriği içe aktar
          </button>
          {message && <p className="notice" style={{ marginTop: 12 }}>{message}</p>}
        </div>

        <div className="card">
          <h2>PDHES saha çalışma alanı</h2>
          <p className="muted small">Yerel değişiklikler bu tarayıcıda tutulur; yalnızca schemaVersion 3 saha yedekleri geri yüklenebilir.</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
            <button className="btn primary" onClick={onCreateSite}>Yeni PDHES adayı ekle</button>
            <button className="btn" onClick={() => onEditSite(selectedId)}>Seçili sahayı düzenle</button>
            <button className="btn" onClick={() => onEditLayout(selectedId)}>3D yerleşimi düzenle</button>
            <button className="btn ghost" onClick={() => downloadText('pspp-sites-v3-export.json', exportSites())}>Saha listesini indir</button>
          </div>
          <textarea id="workspace-site-import" name="siteImport" aria-label="Saha listesi yedeğini içe aktar" className="textarea" value={siteImport} onChange={(event) => setSiteImport(event.target.value)} placeholder="schemaVersion 3 saha yedeğini buraya yapıştırın" style={{ marginTop: 12 }} />
          <button className="btn" onClick={() => setMessage(importSites(siteImport) ? 'Saha listesi içe aktarıldı.' : 'Saha listesi geçersiz veya eski schemaVersion kullanıyor.')} style={{ marginTop: 8 }}>
            Saha listesini içe aktar
          </button>
        </div>
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <h2>Aday sahalar</h2>
        <div style={{ overflow: 'auto' }}>
          <table>
            <thead>
              <tr><th>Saha</th><th>Kaynak / çevrim</th><th>Güç</th><th>Yatırım</th><th>Gelir</th><th>Skor</th><th>İşlem</th></tr>
            </thead>
            <tbody>
              {sites.map((site) => (
                <tr key={site.id} className={site.id === selectedId ? 'selected' : ''} onClick={() => selectSite(site.id)}>
                  <td><b>{site.name}</b><br /><span className="muted small">{site.id}</span></td>
                  <td>
                    <span className={`tag ${site.pdhesType === 'SEA_WATER' ? 'sea' : 'classic'}`}>{PDHES_TYPE_LABELS[site.pdhesType]}</span>
                    <br />
                    <span className="muted small">{CYCLE_TYPE_LABELS[site.technicalClassification.cycleType]}</span>
                  </td>
                  <td>{num(site.capacityMW)} MW</td>
                  <td>{moneyBn(site.capexUsdBn)}</td>
                  <td>{moneyM(site.annualRevenueUsdM)}</td>
                  <td>{site.score ?? 'Belirtilmedi'}</td>
                  <td>
                    <button className="btn ghost" onClick={(event) => { event.stopPropagation(); onEditSite(site.id); }}>Düzenle</button>
                    <button className="btn ghost" onClick={(event) => { event.stopPropagation(); onEditLayout(site.id); }} style={{ marginLeft: 6 }}>3D yerleşim</button>
                    <button
                      className="btn danger"
                      onClick={(event) => {
                        event.stopPropagation();
                        if (confirm(`${site.name} silinsin mi?`)) deleteSite(site.id);
                      }}
                      style={{ marginLeft: 6 }}
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
