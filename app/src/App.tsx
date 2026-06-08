import { lazy, Suspense, useEffect, useState } from 'react';
import {
  BookOpen,
  Calculator,
  Database,
  Download,
  MapPinned,
  Moon,
  Mountain,
  Settings,
  ShieldCheck,
  Sun,
} from 'lucide-react';
import { getLegacyCustomSites, getPersistedSites, useSiteStore } from './stores/useSiteStore';
import { useSettingsStore } from './stores/useSettingsStore';
import type { Site } from './types/site';
import DataPage from './pages/DataPage';
import CalcPage from './pages/CalcPage';
import ThreeDPage from './pages/ThreeDPage';
import PdhesPage from './pages/PdhesPage';
import AdminPage from './pages/AdminPage';
import SettingsPage from './pages/SettingsPage';
import SiteEditorPage from './pages/SiteEditorPage';
import ThreeDEditorPage from './pages/ThreeDEditorPage';
import './index.css';
import 'maplibre-gl/dist/maplibre-gl.css';

const MapPage = lazy(() => import('./pages/MapPage'));

const TABS = [
  { id: 'pdhes', label: 'PDHES Nedir', Icon: BookOpen },
  { id: 'data', label: 'Datalar', Icon: Database },
  { id: 'map', label: 'Harita', Icon: MapPinned },
  { id: 'threeD', label: '3D Yerleşim', Icon: Mountain },
  { id: 'calc', label: 'Hesaplamalar', Icon: Calculator },
  { id: 'admin', label: 'Yönetim', Icon: ShieldCheck },
  { id: 'settings', label: 'Ayarlar', Icon: Settings },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('pdhes');
  const [siteEditorMode, setSiteEditorMode] = useState<'new' | 'edit'>('edit');
  const { sites, selectedId, selectSite, setSites, setBaseSites, setGridAssets, setLoading, exportSites } = useSiteStore();
  const { theme, toggleTheme } = useSettingsStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    (async () => {
      try {
        const [dataRes, gridRes] = await Promise.all([
          fetch('/data.json'),
          fetch('/grid_assets.json'),
        ]);
        const sitesData: Site[] = await dataRes.json();
        const gridData = await gridRes.json();
        const normalizeSites = (items: Site[]) => items.map((site) => ({
          ...site,
          lon: site.coordinates?.mapAnchor?.[0] ?? site.lon,
          lat: site.coordinates?.mapAnchor?.[1] ?? site.lat,
        }));

        const baseSites = normalizeSites(sitesData);
        const persistedSites = getPersistedSites();
        const legacySites = getLegacyCustomSites();
        const mergedLegacySites = [
          ...baseSites,
          ...legacySites.filter((custom) => !baseSites.some((site) => site.id === custom.id)),
        ];

        setBaseSites(baseSites);
        setSites(normalizeSites(persistedSites || mergedLegacySites));
        setGridAssets(gridData);
      } catch (e) {
        console.error('Failed to load data', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [setSites, setBaseSites, setGridAssets, setLoading]);

  const selectedSite = sites.find((s) => s.id === selectedId) || sites[0];

  const exportJson = () => {
    const blob = new Blob([exportSites()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pdhes-potansiyeli-veri.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="logo">PDHES</div>
          <div>
            <h1>Türkiye Pompaj Depolamalı HES (PDHES) Potansiyeli</h1>
            <p>
              Türkiye’de pompaj depolamalı hidroelektrik santral adaylarını; harita, kavramsal 3D yerleşim,
              şebeke bağlantı katmanları, risk notları ve eğitim içerikleriyle inceleyen açık demo uygulama
            </p>
          </div>
        </div>
        <div className="global-controls">
          <select
            className="select"
            value={selectedId}
            onChange={(event) => selectSite(event.target.value)}
            aria-label="Aday saha seçimi"
            name="selected-site"
          >
            {sites.map((site) => (
              <option key={site.id} value={site.id}>{site.name}</option>
            ))}
          </select>
          <button className="btn primary" onClick={() => { setActiveTab('map'); }}>
            <MapPinned size={16} aria-hidden="true" />
            Haritada incele
          </button>
          <button className="btn ghost" onClick={exportJson}>
            <Download size={16} aria-hidden="true" />
            Veriyi indir
          </button>
          <button className="btn ghost" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
            {theme === 'dark' ? 'Açık' : 'Koyu'}
          </button>
        </div>
      </header>

      <nav className="tabs" aria-label="Ana sekmeler">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`tab-btn ${activeTab === id ? 'active' : ''}`}
            onClick={() => setActiveTab(id)}
          >
            <Icon size={16} aria-hidden="true" />
            {label}
          </button>
        ))}
      </nav>

      <main>
        <Suspense fallback={<section className="panel active"><p className="muted">Harita yükleniyor...</p></section>}>
          {activeTab === 'pdhes' && <PdhesPage />}
          {activeTab === 'data' && <DataPage site={selectedSite} />}
          {activeTab === 'map' && <MapPage />}
          {activeTab === 'threeD' && <ThreeDPage site={selectedSite} />}
          {activeTab === 'calc' && <CalcPage site={selectedSite} />}
          {activeTab === 'admin' && (
            <AdminPage
              onCreateSite={() => {
                setSiteEditorMode('new');
                setActiveTab('siteEditor');
              }}
              onEditSite={(id) => {
                selectSite(id);
                setSiteEditorMode('edit');
                setActiveTab('siteEditor');
              }}
              onEditLayout={(id) => {
                selectSite(id);
                setActiveTab('threeDEditor');
              }}
            />
          )}
          {activeTab === 'settings' && <SettingsPage />}
          {activeTab === 'siteEditor' && (
            <SiteEditorPage mode={siteEditorMode} templateSite={selectedSite} onDone={() => setActiveTab('admin')} />
          )}
          {activeTab === 'threeDEditor' && (
            <ThreeDEditorPage site={selectedSite} onDone={() => setActiveTab('admin')} />
          )}
        </Suspense>
      </main>
    </div>
  );
}
