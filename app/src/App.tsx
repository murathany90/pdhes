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
import { useSiteStore } from './stores/useSiteStore';
import { useSettingsStore } from './stores/useSettingsStore';
import { useAppData } from './hooks/useAppData';
import DataPage from './pages/DataPage';
import CalcPage from './pages/CalcPage';
import PdhesPage from './pages/PdhesPage';
import AppShell from './components/layout/AppShell';
import TopNav from './components/layout/TopNav';
import SiteSelector from './components/interaction/SiteSelector';
import WarningBanner from './components/ui/WarningBanner';
import { isLocalWorkspaceEnabled } from './utils/workspaceMode';
import './index.css';
import 'maplibre-gl/dist/maplibre-gl.css';

const MapPage = lazy(() => import('./pages/MapPage'));
const ThreeDPage = lazy(() => import('./pages/ThreeDPage'));
const WorkspacePage = lazy(() => import('./pages/WorkspacePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const SiteEditorPage = lazy(() => import('./pages/SiteEditorPage'));
const ThreeDEditorPage = lazy(() => import('./pages/ThreeDEditorPage'));

const TABS = [
  { id: 'pdhes', label: 'PDHES Nedir', Icon: BookOpen },
  { id: 'data', label: 'Datalar', Icon: Database },
  { id: 'map', label: 'Harita', Icon: MapPinned },
  { id: 'threeD', label: '3D Yerleşim', Icon: Mountain },
  { id: 'calc', label: 'Hesaplamalar', Icon: Calculator },
  { id: 'workspace', label: 'Yerel Çalışma Alanı', Icon: ShieldCheck },
  { id: 'settings', label: 'Ayarlar', Icon: Settings },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('pdhes');
  const [siteEditorMode, setSiteEditorMode] = useState<'new' | 'edit'>('edit');
  const { sites, selectedId, selectSite, exportSites } = useSiteStore();
  const { theme, toggleTheme } = useSettingsStore();
  const { error: dataError } = useAppData();

  const workspaceEnabled = isLocalWorkspaceEnabled(window.location.search);
  const visibleTabs = TABS.filter((tab) => {
    if (tab.id === 'workspace' && !workspaceEnabled) return false;
    if (tab.id === 'settings') return false;
    return true;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

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
      <button className="btn ghost" onClick={toggleTheme} title="Tema değiştir">
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

  const showLocalWarning = ['workspace', 'settings', 'calc', 'siteEditor', 'threeDEditor'].includes(activeTab);

  return (
    <AppShell
      topNav={
        <TopNav
          title="Türkiye PDHES Potansiyeli — Eğitim ve Ön İnceleme"
          subtitle=""
          controls={controls}
        />
      }
      tabs={tabsNode}
    >
      {activeTab === 'calc' && (
        <div style={{ padding: '18px 18px 0 18px', flexShrink: 0 }}>
          <WarningBanner
            message="Eğitim ve masaüstü ön inceleme demosudur; yatırım tavsiyesi, fizibilite, mühendislik tasarımı veya resmi kurum görüşü değildir. Harita altlıkları ve arazi verileri 3. taraf servislerden yüklenmektedir."
            type="warning"
          />
        </div>
      )}
      {dataError && (
        <div style={{ padding: '18px 18px 0 18px', flexShrink: 0 }}>
          <WarningBanner message={dataError} type="danger" />
        </div>
      )}
      {showLocalWarning && (
        <div style={{ padding: '18px 18px 0 18px', flexShrink: 0 }}>
          <WarningBanner message="Bu sayfadaki yerel çalışma ve hesaplama ayarları yalnızca sizin tarayıcınızda (LocalStorage) saklanır." type="info" />
        </div>
      )}
      <Suspense fallback={<section className="panel active"><p className="muted">İlgili bölüm yükleniyor...</p></section>}>
        {activeTab === 'pdhes' && <PdhesPage onNavigate={setActiveTab} />}
        {activeTab === 'data' && <DataPage site={selectedSite} />}
        {activeTab === 'map' && <MapPage />}
        {activeTab === 'threeD' && <ThreeDPage site={selectedSite} />}
        {activeTab === 'calc' && <CalcPage site={selectedSite} />}
        {activeTab === 'workspace' && (
          <WorkspacePage
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
          <SiteEditorPage mode={siteEditorMode} templateSite={selectedSite} onDone={() => setActiveTab('workspace')} />
        )}
        {activeTab === 'threeDEditor' && (
          <ThreeDEditorPage site={selectedSite} onDone={() => setActiveTab('workspace')} />
        )}
      </Suspense>
    </AppShell>
  );
}
