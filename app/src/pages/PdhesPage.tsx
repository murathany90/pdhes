import { useMemo, useState } from 'react';
import { CONTENT_DEFAULTS, GLOSSARY, PDHES_TYPE_LABELS, WORLD_EXAMPLES } from '../utils/constants';
import { useAdminStore } from '../stores/useAdminStore';
import SectionNav from '../components/ui/SectionNav';
import InfoAccordion from '../components/ui/InfoAccordion';

const TYPE_DESCRIPTIONS: Record<string, string> = {
  MUSTAKIL_PDHES: 'Üst ve alt rezervuarın proje için ayrı kurgulandığı, su döngüsünün büyük ölçüde kendi içinde çalıştığı model.',
  YARI_PDHES: 'Mevcut baraj, göl veya hidroelektrik altyapısından yararlanarak ek üst/alt rezervuar ve pompa-türbin sistemi kuran model.',
  MAKRO_DENIZ_PDHES: 'Denizi alt rezervuar olarak kullanan, yüksek düşü ve büyük kurulu güç hedefleyen kıyı modeli.',
  MIKRO_DENIZ_PDHES: 'Daha küçük ölçekli, eğitim, ada sistemi, yerel şebeke veya özel endüstriyel kullanım için düşünülebilen kıyı modeli.',
};

const HISTORY = [
  ['1900ler', 'Avrupa dağlık bölgelerinde pompaj fikri ve ilk küçük uygulamalar.'],
  ['1930lar', 'Büyük rezervuarlar ve gece-gündüz yük farkı için ilk endüstriyel tesisler.'],
  ['1970-80ler', 'Baz yük santralleri, pik talep yönetimi ve büyük iletim şebekeleriyle hızlı yaygınlaşma.'],
  ['2020ler', 'Güneş ve rüzgar üretiminin artmasıyla uzun süreli enerji depolama ve şebeke esnekliği odağı.'],
];

const FAQ = [
  ['PDHES ne kadar sürede inşa edilir?', 'Büyük projelerde izin, tasarım ve inşaat dahil çoğu zaman 6-10 yıl bandı gerçekçidir.'],
  ['Pil depolamaya göre avantajı nedir?', 'Çok uzun ömür, yüksek enerji kapasitesi, senkron makine katkısı ve uzun süreli depolama sağlar.'],
  ['Türkiye’de neden henüz yaygın değil?', 'Uygun topografya kadar izin, su rejimi, TEİAŞ bağlantısı, gelir modeli ve finansman netliği gerekir.'],
  ['En kritik ilk etüt nedir?', 'Düşü (head), aktif hacim, jeoloji, bağlantı mesafesi ve çevresel kısıtlar birlikte doğrulanmalıdır.'],
];

import MetricCard from '../components/ui/MetricCard';

interface PdhesPageProps {
  onNavigate?: (tabId: string) => void;
}

export default function PdhesPage({ onNavigate }: PdhesPageProps) {
  const [query, setQuery] = useState('');
  const getContent = useAdminStore((state) => state.getContent);
  const filteredGlossary = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase('tr-TR');
    if (!needle) return GLOSSARY;
    return GLOSSARY.filter((item) =>
      `${item.term} ${item.definition}`.toLocaleLowerCase('tr-TR').includes(needle),
    );
  }, [query]);
  const html = (key: string) => ({ __html: getContent(key, CONTENT_DEFAULTS) });

  return (
    <section className="panel active">
      <div className="hero" style={{ marginBottom: 32 }}>
        <div className="card">
          <h2 className="big-title">Türkiye PDHES Potansiyeli</h2>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.5 }}>
            Uzun süreli enerji depolama, şebeke esnekliği ve yenilenebilir entegrasyonu için etkileşimli ön-inceleme aracı.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button className="btn primary" onClick={() => onNavigate?.('map')}>Haritada İncele</button>
            <button className="btn ghost" onClick={() => onNavigate?.('data')}>Adayları Karşılaştır</button>
            <button className="btn ghost" onClick={() => {
              document.getElementById('pdhes-nedir')?.scrollIntoView({ behavior: 'smooth' });
            }}>PDHES Nedir?</button>
          </div>
        </div>
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Sistem Özeti</h3>
          <div className="grid cols-2" style={{ gap: 12 }}>
            <MetricCard label="Aday Saha" value="19" variant="default" />
            <MetricCard label="En Büyük Aday" value="1.400 MW" variant="capacity" />
            <MetricCard label="Örnek Enerji Kapasitesi" value="9.8 GWh" variant="default" />
            <MetricCard label="Şebeke Katmanları" value="154/380 kV" variant="grid" />
          </div>
          <div style={{ marginTop: 12 }}>
            <MetricCard label="Kavramsal 3D Yerleşim" value="Mevcut" variant="default" />
          </div>
        </div>
      </div>

      <article className="encyclopedia encyclopedia-layout" id="pdhes-nedir">
        <div className="encyclopedia-sidebar">
          <h3 style={{ marginBottom: 16 }}>İçindekiler</h3>
          <SectionNav sections={[
            { id: 'sec-tanim', title: 'PDHES Nedir?' },
            { id: 'sec-tarihce', title: 'Tarihçe' },
            { id: 'sec-turkiye', title: 'Türkiye Potansiyeli' },
            { id: 'sec-tipler', title: 'PDHES Tipleri' },
            { id: 'sec-ornekler', title: 'Dünya Örnekleri' },
            { id: 'sec-faydalar', title: 'Faydalar' },
            { id: 'sec-maliyet', title: 'Maliyet ve Gelir' },
            { id: 'sec-riskler', title: 'Riskler' },
            { id: 'sec-sozluk', title: 'Teknik Sözlük' },
            { id: 'sec-sss', title: 'Sık Sorulan Sorular' },
          ]} />
        </div>
        
        <div>
          <h2 id="sec-tanim" className="big-title" dangerouslySetInnerHTML={html('pdhesWhatIs.title')} />

          <div className="card">
            <h2 dangerouslySetInnerHTML={html('pdhesWhatIs.definitionTitle')} />
            <p dangerouslySetInnerHTML={html('pdhesWhatIs.definitionBody')} />
            <div className="formula">
{`E = ρ × g × H × V × η
ρ: su yoğunluğu, g: yerçekimi ivmesi, H: net düşü (head), V: aktif hacim, η: çevrim verimi

Modern PDHES tesislerinde çevrim verimi (round-trip efficiency) çoğunlukla %70-85 aralığındadır.`}
            </div>
          </div>

          <h2 id="sec-tarihce" dangerouslySetInnerHTML={html('pdhesWhatIs.historyTitle')} style={{ marginTop: 32 }} />
          <div className="grid cols-2" style={{ gap: 16 }}>
            {HISTORY.map(([title, body]) => (
              <div className="step" key={title}>
                <div className="num">{title.slice(0, 2)}</div>
                <b>{title}</b>
                <p>{body}</p>
              </div>
            ))}
          </div>

          <h2 id="sec-turkiye" dangerouslySetInnerHTML={html('pdhesWhatIs.turkeyTitle')} style={{ marginTop: 32 }} />
          <p>
            Türkiye için PDHES tartışması JICA aday çalışmaları, DSİ rezervuarları, TEİAŞ bağlantı kabiliyeti,
            yenilenebilir üretim artışı ve yan hizmet ihtiyacı etrafında şekillenir. Bu prototipteki adaylar
            fizibilite sonucu değildir; ön eleme, yatırım anlatımı ve ayrıntılı yatırım incelemesine hazırlık için
            masaüstü seviyesinde sınıflandırılmıştır.
          </p>

          <h2 id="sec-tipler" style={{ marginTop: 32 }}>PDHES Tipleri</h2>
          <div>
            {Object.entries(PDHES_TYPE_LABELS).map(([key, label]) => (
              <InfoAccordion key={key} title={label}>
                <p>{TYPE_DESCRIPTIONS[key]}</p>
              </InfoAccordion>
            ))}
          </div>

          <h2 id="sec-ornekler" style={{ marginTop: 32 }}>Dünya Örnekleri</h2>
          <div className="grid cols-2">
            {WORLD_EXAMPLES.map((example) => (
              <div className="world-example-card" key={`${example.country}-${example.name}`}>
                <h4>{example.name}</h4>
                <div className="specs">
                  <span><b>{example.country}</b></span>
                  <span><b>{example.mw.toLocaleString('tr-TR')} MW</b></span>
                  <span><b>{example.head} m</b> düşü</span>
                  {example.year && <span>{example.year}</span>}
                </div>
                <p>{example.description}</p>
              </div>
            ))}
          </div>

          <h2 id="sec-faydalar" dangerouslySetInnerHTML={html('pdhesWhatIs.benefitsTitle')} style={{ marginTop: 32 }} />
          <ul>
            <li>Enerji arbitrajı (energy arbitrage): düşük fiyatlı saatlerde pompalama, yüksek fiyatlı saatlerde üretim.</li>
            <li>Primer frekans kontrolü (primary frequency control), sekonder frekans kontrolü (secondary frequency control), reaktif güç desteği (reactive power support), kara başlatma (black-start) ve senkron atalet (synchronous inertia).</li>
            <li>Yenilenebilir kısıntıyı azaltma, pik talep yönetimi ve şebeke kararlılığı.</li>
          </ul>

          <h2 id="sec-maliyet" dangerouslySetInnerHTML={html('pdhesWhatIs.costsTitle')} style={{ marginTop: 32 }} />
          <p>
            Yatırım harcaması (CAPEX); rezervuar, tünel, cebri boru (penstock), yeraltı güç evi (powerhouse),
            elektromekanik ekipman, şalt sahası (switchyard), yol, izin ve mühendislik kalemlerinden oluşur.
            Gelir modeli enerji arbitrajı, Dengeleme Güç Piyasası, yan hizmetler ve olası kapasite ödemeleriyle
            birlikte değerlendirilmelidir.
          </p>

          <h2 id="sec-riskler" dangerouslySetInnerHTML={html('pdhesWhatIs.risksTitle')} style={{ marginTop: 32 }} />
          <ul>
            <li>Jeoloji, fay, heyelan, karst ve yeraltı suyu belirsizlikleri.</li>
            <li>Çevresel Etki Değerlendirmesi (EIA), korunan alan, ekolojik akış, kamulaştırma ve görsel etki.</li>
            <li>Deniz suyu projelerinde korozyon, biyolojik birikim (biofouling), sızdırmazlık kaplaması ve tuz aerosolu.</li>
          </ul>

          <h2 id="sec-sozluk" style={{ marginTop: 32 }}>Teknik Terimler Sözlüğü</h2>
          <input
            className="input glossary-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Terim ara"
            style={{ marginBottom: 16 }}
          />
          <div style={{ overflow: 'auto', maxHeight: 400, border: '1px solid var(--line)', borderRadius: 12 }}>
            <table style={{ margin: 0 }}>
              <thead style={{ position: 'sticky', top: 0, background: 'var(--panel3)' }}>
                <tr><th>Terim</th><th>Açıklama</th></tr>
              </thead>
              <tbody>
                {filteredGlossary.map((item) => (
                  <tr key={item.term}>
                    <td><b>{item.term}</b></td>
                    <td>{item.definition}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 id="sec-sss" style={{ marginTop: 32 }}>Sık Sorulan Sorular</h2>
          <div>
            {FAQ.map(([question, answer]) => (
              <InfoAccordion key={question} title={question}>
                <p>{answer}</p>
              </InfoAccordion>
            ))}
          </div>
        </div>
      </article>
    </section>
  );
}
