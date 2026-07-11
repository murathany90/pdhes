import { useState, useMemo, useDeferredValue } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { FileText, ArrowLeft, Clock, Calendar, User, Link } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { REPORTS_DATA } from '../data/reportsData';
import { publicAssetUrl } from '../utils/publicUrl';

const CATEGORY_LABELS: Record<string, string> = {
  report: 'Rapor',
  summary: 'Makale Özeti',
  news: 'Haber',
};

function getReadTime(report: typeof REPORTS_DATA[0]) {
  if (report.readTime) return report.readTime;
  const words = report.content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function ReportsPage() {
  const { reportId: activeReportId } = useParams();
  const navigate = useNavigate();

  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);

  const activeReport = useMemo(() => {
    return REPORTS_DATA.find(r => r.id === activeReportId) || null;
  }, [activeReportId]);

  const relatedReports = useMemo(() => {
    if (!activeReport) return [];
    return REPORTS_DATA.filter(r => r.category === activeReport.category && r.id !== activeReport.id).slice(0, 3);
  }, [activeReport]);

  const filteredReports = useMemo(() => {
    return REPORTS_DATA.filter(r => {
      const matchFilter = filter === 'all' || r.category === filter;
      const matchSearch = r.title.toLowerCase().includes(deferredSearch.toLowerCase()) || r.summary.toLowerCase().includes(deferredSearch.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [filter, deferredSearch]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Bağlantı kopyalandı!');
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`Şu raporu okumalısınız: ${activeReport?.title}`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  if (activeReport) {
    return (
      <section className="panel active">
        <div className="report-detail-layout" style={{ maxWidth: 800, margin: '0 auto', paddingBottom: 60 }}>
          <button className="btn" style={{ marginBottom: 24 }} onClick={() => navigate('/reports')}>
            <ArrowLeft size={16} /> Raporlara Dön
          </button>
          
          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            {activeReport.coverImage && (
              <img 
                src={publicAssetUrl(activeReport.coverImage)} 
                alt="" 
                loading="lazy"
                style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', display: 'block', borderBottom: '1px solid var(--line)', backgroundColor: 'var(--bg-alt)' }}
              />
            )}
            <div style={{ padding: '32px 40px' }}>
              <div style={{ marginBottom: 12 }}>
                <span className="tag info">{CATEGORY_LABELS[activeReport.category]}</span>
              </div>
              <h1 style={{ marginBottom: 16 }}>{activeReport.title}</h1>
              
              <div className="metric-row" style={{ marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
                <div className="metric" style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 'none' }}>
                  <User size={16} className="muted" />
                  <span>{activeReport.author}</span>
                </div>
                <div className="metric" style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 'none' }}>
                  <Calendar size={16} className="muted" />
                  <span>{activeReport.publishDate}</span>
                </div>
                <div className="metric" style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 'none' }}>
                  <Clock size={16} className="muted" />
                  <span>{getReadTime(activeReport)} dk okuma</span>
                </div>
              </div>

              {/* Share Buttons */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid var(--line)', flexWrap: 'wrap' }}>
                <button className="btn outline" onClick={handleCopyLink} title="Bağlantıyı Kopyala" style={{ padding: '8px 16px', borderRadius: 20 }}>
                  <Link size={14} /> <span>Bağlantıyı Kopyala</span>
                </button>
                <button className="btn outline" onClick={handleShareTwitter} title="X'te Paylaş" style={{ padding: '8px 16px', borderRadius: 20 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <span>X'te Paylaş</span>
                </button>
                <button className="btn outline" onClick={handleShareLinkedIn} title="LinkedIn'de Paylaş" style={{ padding: '8px 16px', borderRadius: 20 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span>LinkedIn'de Paylaş</span>
                </button>
              </div>

              <div className="markdown-body">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm, remarkMath]} 
                  rehypePlugins={[rehypeKatex]}
                  components={{
                    img: ({node, ...props}) => <img {...props} src={publicAssetUrl(props.src || '')} loading="lazy" style={{maxWidth: '100%', height: 'auto', borderRadius: 8}} />
                  }}
                >
                  {activeReport.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>

          {/* Related Reports */}
          {relatedReports.length > 0 && (
            <div style={{ marginTop: 40 }}>
              <h3 style={{ marginBottom: 16 }}>Bunlar da İlginizi Çekebilir</h3>
              <div className="grid cols-3" style={{ gap: 16 }}>
                {relatedReports.map(report => (
                  <div 
                    key={report.id} 
                    className="card interactive" 
                    role="button"
                    tabIndex={0}
                    style={{ padding: 16, cursor: 'pointer', display: 'flex', flexDirection: 'column' }} 
                    onClick={() => navigate(`/reports/${report.id}`)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        navigate(`/reports/${report.id}`);
                      }
                    }}
                  >
                    <h4 style={{ fontSize: '1rem', marginBottom: 8, lineHeight: 1.4 }}>{report.title}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--muted)', marginTop: 'auto' }}>
                      <Clock size={12} /> {getReadTime(report)} dk
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="panel active">
      <div className="reports-layout" style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div className="card" style={{ marginBottom: 24, padding: 24 }}>
          <h2>Raporlar ve Haberler</h2>
          <p className="muted" style={{ marginBottom: 16 }}>PDHES alanındaki en güncel akademik çalışmalar, fizibilite raporları ve sektörel incelemeler.</p>
          
          <div className="global-controls" style={{ padding: 0, border: 'none', background: 'transparent' }}>
            <input 
              type="search" 
              className="select" 
              placeholder="Rapor veya içerik ara..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, minWidth: 200 }}
            />
            <select className="select" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">Tüm Kategoriler</option>
              <option value="report">Rapor</option>
              <option value="summary">Makale Özeti</option>
              <option value="news">Haber</option>
            </select>
          </div>
        </div>

        <div className="grid cols-3" style={{ gap: 24 }}>
          {filteredReports.map(report => (
            <div 
              key={report.id} 
              className="card interactive" 
              role="button"
              tabIndex={0}
              style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer', padding: 0, overflow: 'hidden' }} 
              onClick={() => navigate(`/reports/${report.id}`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(`/reports/${report.id}`);
                }
              }}
            >
              {report.coverImage && (
                <img 
                  src={publicAssetUrl(report.coverImage)} 
                  alt="" 
                  loading="lazy"
                  style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block', borderBottom: '1px solid var(--line)' }}
                />
              )}
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ marginBottom: 12 }}>
                  <span className="tag info">{CATEGORY_LABELS[report.category]}</span>
                </div>
                <h3 style={{ marginBottom: 8, fontSize: '1.1rem', lineHeight: 1.4 }}>{report.title}</h3>
                <p className="muted small" style={{ marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {report.summary}
                </p>
                <div style={{ marginTop: 'auto', display: 'flex', gap: 16, borderTop: '1px solid var(--line)', paddingTop: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--muted)' }}>
                    <Calendar size={14} /> {report.publishDate}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--muted)' }}>
                    <Clock size={14} /> {getReadTime(report)} dk
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filteredReports.length === 0 && (
            <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 40 }}>
              <FileText size={48} className="muted" style={{ margin: '0 auto 16px' }} />
              <p className="muted">Arama kriterlerinize uygun rapor bulunamadı.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
