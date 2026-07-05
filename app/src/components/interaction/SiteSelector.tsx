import type { Site } from '../../types/site';

interface SiteSelectorProps {
  sites: Site[];
  selectedId: string;
  onChange: (id: string) => void;
}

export default function SiteSelector({ sites, selectedId, onChange }: SiteSelectorProps) {
  return (
    <select
      id="global-site-selector"
      name="selectedSite"
      className="select"
      value={selectedId}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Aday saha seçimi"
    >
      {sites.map((site) => (
        <option key={site.id} value={site.id}>{site.name}</option>
      ))}
    </select>
  );
}
