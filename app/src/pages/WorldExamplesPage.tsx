import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { WORLD_EXAMPLES_DETAILED } from '../data/worldExamplesDetailed';
import { useSiteStore } from '../stores/useSiteStore';

type SortConfig = { key: keyof typeof WORLD_EXAMPLES_DETAILED[0]; direction: 'asc' | 'desc' } | null;

export default function WorldExamplesPage() {
  const navigate = useNavigate();
  const setWorldExampleFocus = useSiteStore((state) => state.setWorldExampleFocus);
  
  const [query, setQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const requestSort = (key: keyof typeof WORLD_EXAMPLES_DETAILED[0]) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof typeof WORLD_EXAMPLES_DETAILED[0]) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  const filteredAndSortedData = useMemo(() => {
    let data = [...WORLD_EXAMPLES_DETAILED];

    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      data = data.filter((item) => 
        item.name.toLowerCase().includes(lowerQuery) ||
        item.country.toLowerCase().includes(lowerQuery) ||
        item.type.toLowerCase().includes(lowerQuery)
      );
    }

    if (sortConfig !== null) {
      data.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        
        // Custom sort for numeric strings with units (e.g., "3.600", "$46,8")
        if (typeof valA === 'string' && typeof valB === 'string') {
          const numA = parseFloat(valA.replace(/\./g, '').replace(/,/g, '.').replace(/[^0-9.-]/g, ''));
          const numB = parseFloat(valB.replace(/\./g, '').replace(/,/g, '.').replace(/[^0-9.-]/g, ''));
          
          if (!isNaN(numA) && !isNaN(numB)) {
            return sortConfig.direction === 'asc' ? numA - numB : numB - numA;
          }
        }

        if (valA === null && valB === null) return 0;
        if (valA === null) return sortConfig.direction === 'asc' ? 1 : -1;
        if (valB === null) return sortConfig.direction === 'asc' ? -1 : 1;

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return data;
  }, [query, sortConfig]);

  return (
    <section className="panel active">
      <div className="grid data-layout full-width">
        <div className="card table-card" style={{ padding: '24px' }}>
          <header style={{ marginBottom: '24px' }}>
            <h2>Dünya Örnekleri İncelemesi</h2>
            <p className="muted small">Dünya genelindeki seçilmiş 31 büyük PDHES tesisine ait kapsamlı veri seti.</p>
          </header>

          <div className="editor-form" style={{ marginBottom: 16 }}>
            <div className="form-row">
              <label className="form-group" style={{ maxWidth: '300px' }}>
                <span className="sr-only">Tesis veya ülke ara</span>
                <input
                  type="text"
                  className="input"
                  placeholder="Ülke veya tesis adı ara..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
            </div>
          </div>

          <div className="candidate-table-wrap" style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid var(--line)' }}>
            <table className="candidate-table" style={{ width: '100%', minWidth: '1400px' }}>
              <thead>
                <tr>
                  <th onClick={() => requestSort('name')} style={{ cursor: 'pointer' }}>Adı {getSortIcon('name')}</th>
                  <th onClick={() => requestSort('country')} style={{ cursor: 'pointer' }}>Ülke {getSortIcon('country')}</th>
                  <th onClick={() => requestSort('type')} style={{ cursor: 'pointer' }}>Tipi {getSortIcon('type')}</th>
                  <th onClick={() => requestSort('commissioningYear')} style={{ cursor: 'pointer' }}>İşletme {getSortIcon('commissioningYear')}</th>
                  <th onClick={() => requestSort('constructionPeriod')} style={{ cursor: 'pointer' }}>Yapım {getSortIcon('constructionPeriod')}</th>
                  <th onClick={() => requestSort('capacityMw')} style={{ cursor: 'pointer' }}>Güç(MW) {getSortIcon('capacityMw')}</th>
                  <th onClick={() => requestSort('storageMwh')} style={{ cursor: 'pointer' }}>Enerji(MWh) {getSortIcon('storageMwh')}</th>
                  <th onClick={() => requestSort('efficiency')} style={{ cursor: 'pointer' }}>Verim {getSortIcon('efficiency')}</th>
                  <th onClick={() => requestSort('fullLoadHours')} style={{ cursor: 'pointer' }}>Süre(sa) {getSortIcon('fullLoadHours')}</th>
                  <th onClick={() => requestSort('headM')} style={{ cursor: 'pointer' }}>Düşü(m) {getSortIcon('headM')}</th>
                  <th onClick={() => requestSort('lowerResVolume')} style={{ cursor: 'pointer' }}>Alt Hacim {getSortIcon('lowerResVolume')}</th>
                  <th onClick={() => requestSort('upperResVolume')} style={{ cursor: 'pointer' }}>Üst Hacim {getSortIcon('upperResVolume')}</th>
                  <th onClick={() => requestSort('investmentCostUsd')} style={{ cursor: 'pointer' }}>Yatırım {getSortIcon('investmentCostUsd')}</th>
                  <th onClick={() => requestSort('costPerKwh')} style={{ cursor: 'pointer' }}>$/kWh {getSortIcon('costPerKwh')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedData.map((example) => (
                  <React.Fragment key={example.id}>
                    <tr 
                      className={`main-row ${example.id === expandedId ? 'selected' : ''}`} 
                      onClick={() => setExpandedId(expandedId === example.id ? null : example.id)}
                    >
                      <td><b style={{ fontSize: '13px' }}>{example.name}</b></td>
                      <td>{example.flag} {example.country}</td>
                      <td><span className="muted small">{example.type.split('/')[0]?.trim() || example.type}</span></td>
                      <td>{example.commissioningYear}</td>
                      <td><span className="muted small">{example.constructionPeriod}</span></td>
                      <td><b>{example.capacityMw}</b></td>
                      <td>{example.storageMwh}</td>
                      <td>{example.efficiency}</td>
                      <td>{example.fullLoadHours}</td>
                      <td>{example.headM}</td>
                      <td><span className="muted small" title={example.lowerResVolume}>{example.lowerResVolume}</span></td>
                      <td><span className="muted small" title={example.upperResVolume}>{example.upperResVolume}</span></td>
                      <td>{example.investmentCostUsd}</td>
                      <td>{example.costPerKwh}</td>
                    </tr>
                    {example.id === expandedId && (
                      <tr className="expanded-details-row">
                        <td colSpan={14}>
                          <div className="expanded-details-content" style={{ padding: '16px', background: 'var(--panel2)', borderTop: '1px solid var(--line)' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
                              
                              <div className="details-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                                <div className="metric"><span>Durumu</span><b>{example.status}</b></div>
                                <div className="metric"><span>Alt Rezervuar Tipi</span><b>{example.lowerResNameType}</b></div>
                                <div className="metric"><span>Üst Rezervuar Tipi</span><b>{example.upperResNameType}</b></div>
                                <div className="metric"><span>Pompa-Türbin Tipi</span><b>{example.pumpTurbineType}</b></div>
                                <div className="metric"><span>Pompa-Türbin Gücü</span><b>{example.pumpTurbinePower}</b></div>
                                <div className="metric" style={{ gridColumn: '1 / -1' }}>
                                  <span>Kısa Analiz</span>
                                  <p className="muted" style={{ marginTop: '8px', lineHeight: 1.5 }}>{example.shortAnalysis}</p>
                                </div>
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'flex-start' }}>
                                {example.lat && example.lon ? (
                                  <button
                                    type="button"
                                    className="btn primary"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setWorldExampleFocus(example.id);
                                      navigate('/map');
                                    }}
                                  >
                                    <MapPin size={16} />
                                    Konum Göster
                                  </button>
                                ) : (
                                  <button type="button" className="btn primary" disabled>
                                    <MapPin size={16} />
                                    Konum Bulunamadı
                                  </button>
                                )}
                                
                                {example.wikiUrl ? (
                                  <a 
                                    href={example.wikiUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="btn ghost"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <ExternalLink size={16} />
                                    Wiki Sayfası
                                  </a>
                                ) : (
                                  <span className="btn ghost" aria-disabled="true">Wiki Linki Yok</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
                {filteredAndSortedData.length === 0 && (
                  <tr>
                    <td colSpan={14} style={{ textAlign: 'center', padding: '32px' }} className="muted">
                      Arama kriterlerine uygun tesis bulunamadı.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
