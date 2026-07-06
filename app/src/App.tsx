import { lazy, Suspense, useEffect, useState } from 'react';
import {
  BookOpen,
  Calculator,
  Database,
  MapPinned,
  Moon,
  Mountain,
  Settings,
  ShieldCheck,
  Sun,
} from 'lucide-react';
import { Navigate, NavLink, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
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
import PageLoadingState from './components/ui/PageLoadingState';
import AppErrorBoundary from './components/layout/AppErrorBoundary';
import { isLocalWorkspaceEnabled } from './utils/workspaceMode';
import './index.css';
import 'maplibre-gl/dist/maplibre-gl.css';

const loadMapPage = () => import('./pages/MapPage');
const loadThreeDPage = () => import('./pages/ThreeDPage');
const loadWorkspacePage = () => import('./pages/WorkspacePage');
const loadSettingsPage = () => import('./pages/SettingsPage');
const loadSiteEditorPage = () => import('./pages/SiteEditorPage');
const loadThreeDEditorPage = () => import('./pages/ThreeDEditorPage');

const MapPage = lazy(loadMapPage);
const ThreeDPage = lazy(loadThreeDPage);
const WorkspacePage = lazy(loadWorkspacePage);
const SettingsPage = lazy(loadSettingsPage);
const SiteEditorPage = lazy(loadSiteEditorPage);
const ThreeDEditorPage = lazy(loadThreeDEditorPage);

const ROUTE_PRELOADERS: Record<string, () => Promise<unknown>> = {
  '/map': loadMapPage,
  '/3d': loadThreeDPage,
  '/workspace': loadWorkspacePage,
  '/settings': loadSettingsPage,
};

function preloadRoute(path: string) {
  void ROUTE_PRELOADERS[path]?.();
}

const TABS = [
  { id: 'pdhes', path: '/pdhes', label: 'PDHES Nedir', Icon: BookOpen },
  { id: 'data', path: '/data', label: 'Datalar', Icon: Database },
  { id: 'map', path: '/map', label: 'Harita', Icon: MapPinned },
  { id: 'threeD', path: '/3d', label: '3D Yerleşim', Icon: Mountain },
  { id: 'calc', path: '/calc', label: 'Hesaplamalar', Icon: Calculator },
  { id: 'workspace', path: '/workspace', label: 'Yerel Çalışma Alanı', Icon: ShieldCheck },
];

function LegacyRouteRedirect() {
  const location = useLocation();
  const legacySection = location.pathname.replace(/^\/+/, '');
  const target = legacySection.startsWith('sec-')
    ? `/pdhes/${legacySection}`
    : '/pdhes';

  return <Navigate to={target} replace />;
}

function PdhesRoute() {
  const { sectionId } = useParams();
  return <PdhesPage sectionId={sectionId} />;
}

export default function App() {
  const [siteEditorMode, setSiteEditorMode] = useState<'new' | 'edit'>('edit');
  const navigate = useNavigate();
  const location = useLocation();
  const { sites, selectedId, selectSite } = useSiteStore();
  const { theme, toggleTheme } = useSettingsStore();
  const { error: dataError } = useAppData();

  const workspaceEnabled = isLocalWorkspaceEnabled(window.location.search);
  const visibleTabs = TABS.filter((tab) => {
    if (tab.id === 'workspace' && !workspaceEnabled) return false;
    return true;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    let themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!themeColor) {
      themeColor = document.createElement('meta');
      themeColor.name = 'theme-color';
      document.head.appendChild(themeColor);
    }
    themeColor.content = theme === 'dark' ? '#0a0a0a' : '#fafafa';
  }, [theme]);

  const selectedSite = sites.find((s) => s.id === selectedId) || sites[0];



  const controls = (
    <>
      <SiteSelector sites={sites} selectedId={selectedId} onChange={selectSite} />
      <NavLink className="btn primary" to="/map" onPointerEnter={() => preloadRoute('/map')} onFocus={() => preloadRoute('/map')}>
        <MapPinned size={16} aria-hidden="true" />
        Haritada incele
      </NavLink>

      <button className="btn ghost" onClick={toggleTheme} title="Tema değiştir" aria-label="Tema değiştir">
        {theme === 'dark' ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
        {theme === 'dark' ? 'Açık' : 'Koyu'}
      </button>
      <NavLink
        className="btn ghost utility-link"
        to="/settings"
        aria-label="Ayarlar"
        title="Ayarlar"
        onPointerEnter={() => preloadRoute('/settings')}
        onFocus={() => preloadRoute('/settings')}
      >
        <Settings size={16} aria-hidden="true" />
        <span className="utility-label">Ayarlar</span>
      </NavLink>
    </>
  );

  const tabsNode = (
    <nav className="tabs" aria-label="Ana bölümler">
      {visibleTabs.map(({ id, path, label, Icon }) => (
        <NavLink
          key={id}
          to={path}
          className={({ isActive }) => `tab-btn ${isActive ? 'active' : ''}`}
          onPointerEnter={() => preloadRoute(path)}
          onFocus={() => preloadRoute(path)}
        >
          <Icon size={16} aria-hidden="true" />
          {label}
        </NavLink>
      ))}
    </nav>
  );

  const showLocalWarning = ['/workspace', '/settings', '/calc', '/site-editor', '/three-d-editor']
    .some((path) => location.pathname.startsWith(path));

  return (
    <AppShell
      topNav={
        <TopNav
          title="Türkiye PDHES Potansiyeli — Eğitim ve Ön İnceleme"
          subtitle=""
          controls={controls}
          homeHref="/pdhes"
        />
      }
      tabs={tabsNode}
    >
      {location.pathname === '/calc' && (
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
      <AppErrorBoundary key={location.pathname}>
        <Suspense fallback={<PageLoadingState />}>
          <Routes>
          <Route path="/" element={<Navigate to="/pdhes" replace />} />
          <Route path="/pdhes" element={<PdhesRoute />} />
          <Route path="/pdhes/:sectionId" element={<PdhesRoute />} />
          <Route path="/data" element={<DataPage site={selectedSite} />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/3d" element={<ThreeDPage site={selectedSite} />} />
          <Route path="/calc" element={<CalcPage site={selectedSite} />} />
          <Route
            path="/workspace"
            element={workspaceEnabled ? (
              <WorkspacePage
                onCreateSite={() => {
                  setSiteEditorMode('new');
                  navigate('/site-editor');
                }}
                onEditSite={(id) => {
                  selectSite(id);
                  setSiteEditorMode('edit');
                  navigate('/site-editor');
                }}
                onEditLayout={(id) => {
                  selectSite(id);
                  navigate('/three-d-editor');
                }}
              />
            ) : (
              <Navigate to="/settings" replace />
            )}
          />
          <Route path="/settings" element={<SettingsPage />} />
          <Route
            path="/site-editor"
            element={workspaceEnabled ? (
              <SiteEditorPage
                mode={siteEditorMode}
                templateSite={selectedSite}
                onDone={() => navigate('/workspace')}
              />
            ) : (
              <Navigate to="/settings" replace />
            )}
          />
          <Route
            path="/three-d-editor"
            element={workspaceEnabled ? (
              <ThreeDEditorPage site={selectedSite} onDone={() => navigate('/workspace')} />
            ) : (
              <Navigate to="/settings" replace />
            )}
          />
          <Route path="*" element={<LegacyRouteRedirect />} />
          </Routes>
        </Suspense>
      </AppErrorBoundary>
    </AppShell>
  );
}
