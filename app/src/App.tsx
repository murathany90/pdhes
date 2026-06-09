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
import AppShell from './components/layout/AppShell';
import TopNav from './components/layout/TopNav';
import SiteSelector from './components/interaction/SiteSelector';
import WarningBanner from './components/ui/WarningBanner';
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

  const isAdmin = new URLSearchParams(window.location.search).get('admin') === '1';
  const visibleTabs = TABS.filter((tab) => {
    if (tab.id === 'admin' && !isAdmin) return false;
    if (tab.id === 'settings') return false;
    return true;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    (async () => {
      try {
        const [dataRes, gridRes] = await Promise.all([
          fetch(`/data.json?t=${Date.now()}`),
          fetch(`/grid_assets.json?t=${Date.now()}`),
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
        
        let finalSites: Site[] = [];
        if (persistedSites && persistedSites.length > 0) {
          const missingBase = baseSites.filter((bs) => !persistedSites.some((ps) => ps.id === bs.id));
          finalSites = [...persistedSites, ...missingBase];
          // Persist the merged list to local storage
          localStorage.setItem('pspp-sites-v1', JSON.stringify(finalSites));
        } else {
          finalSites = [
            ...baseSites,
            ...legacySites.filter((custom) => !baseSites.some((site) => site.id === custom.id)),
          ];
        }

        setBaseSites(baseSites);
        setSites(normalizeSites(finalSites));
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

  const controls = (
    <>
      <SiteSelector sites={sites} selectedId={selectedId} onChange={selectSite} />
      <button className="btn primary" onClick={() => { setActiveTab('map'); }}>
        <MapPinned size={16} aria-hidden="true" />
        Haritada incele
      </button>
      <button className="btn ghost" onClick={exportJson}>
        <Download size={16} aria-hidden="true" />
        Veriyi indir
      </button>
      <button className="btn ghost" onClick={toggleTheme} aria-label="Tema Değiştir">
        {theme === 'dark' ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
        {theme === 'dark' ? 'Açık' : 'Koyu'}
      </button>
      <button className="btn ghost" onClick={() => setActiveTab('settings')} aria-label="Ayarlar" title="Ayarlar">
        <Settings size={16} aria-hidden="true" />
      </button>
    </>
  );

  const tabsNode = (
    <nav className="tabs" aria-label="Ana sekmeler">
      {visibleTabs.map(({ id, label, Icon }) => (
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
  );

  const showLocalWarning = ['admin', 'settings', 'calc', 'siteEditor', 'threeDEditor'].includes(activeTab);

  return (
    <AppShell
      topNav={
        <TopNav 
          title="Türkiye Pompaj Depolamalı HES (PDHES) Potansiyeli" 
          subtitle="Türkiye’de pompaj depolamalı hidroelektrik santral adaylarını; harita, kavramsal 3D yerleşim, şebeke bağlantı katmanları, risk notları ve eğitim içerikleriyle inceleyen açık demo uygulama" 
          controls={controls} 
        />
      }
      tabs={tabsNode}
    >
      {showLocalWarning && (
        <div style={{ padding: '18px 18px 0 18px', flexShrink: 0 }}>
          <WarningBanner message="Bu sayfadaki değişiklikler (yönetim veya hesaplama ayarları) yalnızca sizin tarayıcınızda (localStorage) saklanır." type="info" />
        </div>
      )}
      <Suspense fallback={<section className="panel active"><p className="muted">Harita yükleniyor...</p></section>}>
        {activeTab === 'pdhes' && <PdhesPage onNavigate={setActiveTab} />}
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
    </AppShell>
  );
}
