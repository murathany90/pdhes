import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSettingsStore } from '../stores/useSettingsStore';
import { BaseMap as HydrologyMap } from '../features/hydrology/components/HydrologyMap';
import { Sidebar as HydrologySidebar } from '../features/hydrology/components/HydrologySidebar';
import { Timeline as HydrologyTimeline } from '../features/hydrology/components/HydrologyTimeline';
import { HesToolbar as HydrologyToolbar } from '../features/hydrology/components/HydrologyToolbar';
import { useHydrologyStore } from '../features/hydrology/store/useHydrologyStore';
import '../features/hydrology/hydrology.css';

/** Native HES view. It deliberately lives inside AppShell's main element. */
export default function HesPage() {
  const [searchParams] = useSearchParams();
  const theme = useSettingsStore((state) => state.theme);
  const setHydrologyTheme = useHydrologyStore((state) => state.setTheme);
  const loadHydroData = useHydrologyStore((state) => state.loadHydroData);
  const setSelectedEntity = useHydrologyStore((state) => state.setSelectedEntity);
  const hesCount = useHydrologyStore((state) => state.hes177.features.length);
  const isSidebarOpen = useHydrologyStore((state) => state.isSidebarOpen);
  const isTimelineOpen = useHydrologyStore((state) => state.isTimelineOpen);

  useEffect(() => { setHydrologyTheme(theme); }, [setHydrologyTheme, theme]);
  useEffect(() => { void loadHydroData(); }, [loadHydroData]);
  useEffect(() => {
    const hesId = searchParams.get('hes');
    if (hesId) setSelectedEntity({ type: 'hes', id: hesId });
  }, [searchParams, setSelectedEntity]);

  return (
    <section className="hydrology-page" data-hydrology-theme={theme} aria-label="HES hidroloji modülü">
      <HydrologyToolbar />
      <div className="hydrology-workspace">
        {isSidebarOpen && <div className="hydrology-sidebar"><HydrologySidebar /></div>}
        <div className="hydrology-map-panel">
          <HydrologyMap />
          {isTimelineOpen && <div className="hydrology-timeline"><HydrologyTimeline /></div>}
          {hesCount === 0 && <div className="hydrology-empty-state">Kanonik HES verisi yükleniyor…</div>}
        </div>
      </div>
    </section>
  );
}
