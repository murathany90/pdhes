import { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { FileText, ArrowLeft, Clock, Calendar, User } from 'lucide-react';
import { REPORTS_DATA } from '../data/reportsData';

export default function ReportsPage() {
  const [activeReportId, setActiveReportId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const activeReport = useMemo(() => {
    return REPORTS_DATA.find(r => r.id === activeReportId) || null;
  }, [activeReportId]);

  const filteredReports = useMemo(() => {
    return REPORTS_DATA.filter(r => {
      const matchFilter = filter === 'all' || r.category === filter;
      const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.summary.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [filter, search]);

  if (activeReport) {
    return (
      <section className="panel active">
        <div className="report-detail-layout" style={{ maxWidth: 800, margin: '0 auto', paddingBottom: 60 }}>
          <button className="btn" style={{ marginBottom: 24 }} onClick={() => setActiveReportId(null)}>
            <ArrowLeft size={16} /> Raporlara Dön
          </button>
          
          <div className="card" style={{ padding: '32px 40px' }}>
            <h1 style={{ marginBottom: 16 }}>{activeReport.title}</h1>
            
            <div className="metric-row" style={{ marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
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
                <span>{activeReport.readTime} dk okuma</span>
              </div>
            </div>

            <div className="markdown-body">
              <ReactMarkdown>{activeReport.content}</ReactMarkdown>
            </div>
          </div>
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
              <option value="academic">Akademik Makale</option>
              <option value="feasibility">Fizibilite Raporu</option>
              <option value="news">Sektörel Haber</option>
              <option value="guide">Kılavuzlar</option>
            </select>
          </div>
        </div>

        <div className="grid cols-3" style={{ gap: 24 }}>
          {filteredReports.map(report => (
            <div key={report.id} className="card interactive" style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }} onClick={() => setActiveReportId(report.id)}>
              <div style={{ marginBottom: 12 }}>
                <span className="tag info" style={{ textTransform: 'capitalize' }}>{report.category}</span>
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
                  <Clock size={14} /> {report.readTime} dk
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
