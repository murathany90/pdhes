import { useEffect, useMemo, useState } from 'react';
import { CONTENT_DEFAULTS } from '../utils/constants';
import { useAdminStore } from '../stores/useAdminStore';
import { useSiteStore } from '../stores/useSiteStore';
import { moneyBn, moneyM, num } from '../utils/format';

interface AdminPageProps {
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

export default function AdminPage({ onCreateSite, onEditSite, onEditLayout }: AdminPageProps) {
  const { isAuthenticated, login, logout, getContent, setOverride, resetOverrides, exportOverrides, importOverrides } = useAdminStore();
  const { sites, selectedId, selectSite, deleteSite, importSites, exportSites } = useSiteStore();
  const [password, setPassword] = useState('');
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
  }, [contentKey, getContent]);

  if (!isAuthenticated) {
    return (
      <section className="panel active">
        <div className="card" style={{ maxWidth: 520 }}>
          <h2>Yönetim paneli</h2>
          <p className="muted">İçerik, saha ve 3D yerleşim düzenlemek için giriş yapın.</p>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !login(password)) setMessage('Şifre hatalı.');
            }}
            placeholder="Şifre"
            style={{ width: '100%', marginTop: 14 }}
          />
          <button
            className="btn primary"
            style={{ width: '100%', marginTop: 10 }}
            onClick={() => {
              setMessage(login(password) ? '' : 'Şifre hatalı.');
            }}
          >
            Giriş yap
          </button>
          {message && <p className="danger-notice notice" style={{ marginTop: 12 }}>{message}</p>}
        </div>
      </section>
    );
  }

  return (
    <section className="panel active">
      <div className="grid cols-2">
        <div className="card">
          <div className="row" style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <h2>İçerik editörü</h2>
              <p className="muted small">Metinler tarayıcıda saklanır ve yedek olarak indirilebilir.</p>
            </div>
            <button className="btn ghost" onClick={logout}>Çıkış</button>
          </div>
          <select className="select" value={contentKey} onChange={(event) => setContentKey(event.target.value)} style={{ width: '100%', marginTop: 12 }}>
            {contentKeys.map((key) => <option key={key} value={key}>{key}</option>)}
          </select>
          <textarea className="textarea" value={contentValue} onChange={(event) => setContentValue(event.target.value)} style={{ marginTop: 10 }} />
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 }}>
            <button className="btn primary" onClick={() => { setOverride(contentKey, contentValue); setMessage('İçerik kaydedildi.'); }}>Kaydet</button>
            <button className="btn ghost" onClick={() => downloadText('content-overrides.json', exportOverrides())}>İçerik yedeğini indir</button>
            <button className="btn danger" onClick={() => { resetOverrides(); setMessage('İçerik düzenlemeleri temizlendi.'); }}>İçeriği sıfırla</button>
          </div>
          <textarea className="textarea" value={overrideImport} onChange={(event) => setOverrideImport(event.target.value)} placeholder="İçerik yedeğini buraya yapıştırın" style={{ marginTop: 12 }} />
          <button className="btn" onClick={() => setMessage(importOverrides(overrideImport) ? 'İçerik içe aktarıldı.' : 'İçerik yedeği geçersiz.')} style={{ marginTop: 8 }}>
            İçeriği içe aktar
          </button>
          {message && <p className="notice" style={{ marginTop: 12 }}>{message}</p>}
        </div>

        <div className="card">
          <h2>PDHES saha yönetimi</h2>
          <p className="muted small">Admin değişiklikleri bu tarayıcıda kalıcı tutulur; saha listesini yedekleyip geri yükleyebilirsiniz.</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
            <button className="btn primary" onClick={onCreateSite}>Yeni PDHES adayı ekle</button>
            <button className="btn" onClick={() => onEditSite(selectedId)}>Seçili sahayı düzenle</button>
            <button className="btn" onClick={() => onEditLayout(selectedId)}>3D yerleşimi düzenle</button>
            <button className="btn ghost" onClick={() => downloadText('pspp-sites-export.json', exportSites())}>Saha listesini indir</button>
          </div>
          <textarea className="textarea" value={siteImport} onChange={(event) => setSiteImport(event.target.value)} placeholder="Saha listesi yedeğini buraya yapıştırın" style={{ marginTop: 12 }} />
          <button className="btn" onClick={() => setMessage(importSites(siteImport) ? 'Saha listesi içe aktarıldı.' : 'Saha listesi geçersiz.')} style={{ marginTop: 8 }}>
            Saha listesini içe aktar
          </button>
        </div>
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <h2>Aday sahalar</h2>
        <div style={{ overflow: 'auto' }}>
          <table>
            <thead>
              <tr><th>Saha</th><th>Tip</th><th>Güç</th><th>Yatırım</th><th>Gelir</th><th>Skor</th><th>İşlem</th></tr>
            </thead>
            <tbody>
              {sites.map((site) => (
                <tr key={site.id} className={site.id === selectedId ? 'selected' : ''} onClick={() => selectSite(site.id)}>
                  <td><b>{site.name}</b><br /><span className="muted small">{site.id}</span></td>
                  <td><span className={`tag ${site.concept === 'sea' ? 'sea' : 'classic'}`}>{site.conceptLabel}</span></td>
                  <td>{num(site.powerMW)} MW</td>
                  <td>{moneyBn(site.capexBn)}</td>
                  <td>{moneyM(site.revenueM)}</td>
                  <td>{site.score}/100</td>
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
