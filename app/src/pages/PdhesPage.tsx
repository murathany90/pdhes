import { useMemo, useState } from 'react';
import { CONTENT_DEFAULTS, GLOSSARY, PDHES_TYPE_LABELS, WORLD_EXAMPLES } from '../utils/constants';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import SectionNav from '../components/ui/SectionNav';
import InfoAccordion from '../components/ui/InfoAccordion';

const TYPE_DESCRIPTIONS: Record<string, string> = {
  CLOSED_LOOP: 'Üst ve alt rezervuarın doğal su sistemlerinden büyük ölçüde ayrıldığı ve suyun kapalı bir çevrimde dolaştığı model.',
  OPEN_LOOP: 'Mevcut baraj, göl veya hidroelektrik altyapısıyla doğrudan bağlantılı pompa-türbin modeli.',
  SEA_WATER: 'Denizi alt rezervuar olarak kullanan, kıyı izinleri ve korozyon kontrolü gerektiren model.',
  PROTOTYPE: 'Eğitim, pilot, ada sistemi veya özel endüstriyel kullanım için daha küçük ölçekte değerlendirilen model.',
};

const HISTORY = [
  ['1900ler', 'Avrupa dağlık bölgelerinde pompaj fikri ve ilk küçük uygulamalar.', 'İlk Adımlar'],
  ['1930lar', 'Büyük rezervuarlar ve gece-gündüz yük farkı için ilk endüstriyel tesisler.', 'Endüstriyel Ölçek'],
  ['1970-80ler', 'Baz yük santralleri, pik talep yönetimi ve büyük iletim şebekeleriyle hızlı yaygınlaşma.', 'Nükleer ve Kömür Destekleyici'],
  ['2011', 'Japonya Uluslararası İşbirliği Ajansı (JICA) tarafından Türkiye Pompaj Depolamalı HES Master Plan Çalışması yayınlandı. 7 potansiyel saha belirlendi.', 'JICA Türkiye Çalışması'],
  ['2020ler', 'Güneş ve rüzgar üretiminin artmasıyla uzun süreli enerji depolama ve şebeke esnekliği odağı.', 'Yenilenebilir Entegrasyonu'],
];

const FAQ = [
  ['PDHES ne kadar sürede inşa edilir?', 'Büyük projelerde izin, tasarım ve inşaat dahil çoğu zaman 6-10 yıl bandı gerçekçidir.'],
  ['Pil depolamaya göre avantajı nedir?', 'Çok uzun ömür, yüksek enerji kapasitesi, senkron makine katkısı ve uzun süreli depolama sağlar.'],
  ['Türkiye’de neden henüz yaygın değil?', 'Uygun topografya kadar izin, su rejimi, TEİAŞ bağlantısı, gelir modeli ve finansman netliği gerekir.'],
  ['En kritik ilk etüt nedir?', 'Düşü (head), aktif hacim, jeoloji, bağlantı mesafesi ve çevresel kısıtlar birlikte doğrulanmalıdır.'],
];



interface PdhesPageProps {
  onNavigate?: (tabId: string) => void;
}

export default function PdhesPage({ }: PdhesPageProps) {
  const [query, setQuery] = useState('');
  const getContent = useWorkspaceStore((state) => state.getContent);
  const filteredGlossary = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase('tr-TR');
    if (!needle) return GLOSSARY;
    return GLOSSARY.filter((item) =>
      `${item.term} ${item.definition}`.toLocaleLowerCase('tr-TR').includes(needle),
    );
  }, [query]);
  const content = (key: string) => getContent(key, CONTENT_DEFAULTS);

  return (
    <section className="panel active">
      <article className="encyclopedia encyclopedia-layout" id="pdhes-nedir" style={{ marginTop: 12 }}>
        <div className="encyclopedia-sidebar">
          <h3 style={{ marginBottom: 16 }}>İçindekiler</h3>
          <SectionNav sections={[
            { id: 'sec-tanim', title: 'PDHES Nedir?' },
            { id: 'sec-tarihce', title: 'Tarihçe' },
            { id: 'sec-turkiye', title: 'Türkiye Potansiyeli' },
            { id: 'sec-tipler', title: 'PDHES Tipleri' },
            { id: 'sec-ornekler', title: 'Dünya Örnekleri' },
            { id: 'sec-faydalar', title: 'Faydalar' },
            { id: 'sec-riskler', title: 'Riskler' },
            { id: 'sec-maliyet', title: 'Maliyet ve Gelir' },
            { id: 'sec-sozluk', title: 'Teknik Sözlük' },
            { id: 'sec-sss', title: 'Sık Sorulan Sorular' },
          ]} />
        </div>
        
        <div>
          <h2 id="sec-tanim" className="big-title" style={{ marginTop: 0 }}>{content('pdhesWhatIs.title')}</h2>

          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="card">
              <h2>{content('pdhesWhatIs.definitionTitle')}</h2>
              <p>{content('pdhesWhatIs.definitionBody')}</p>
            </div>
            <div className="card">
              <h2>Enerji Formülü</h2>
              <div className="formula" style={{ margin: 0, height: '100%' }}>
{`E = ρ × g × H × V × η

ρ: su yoğunluğu
g: yerçekimi ivmesi
H: net düşü (head)
V: aktif hacim
η: çevrim verimi (%70-85)`}
              </div>
            </div>
          </div>

          <h2 id="sec-tarihce" style={{ marginTop: 32 }}>{content('pdhesWhatIs.historyTitle')}</h2>
          <div className="timeline">
            {HISTORY.map(([title, body, header]) => (
              <div className="tl" key={title}>
                <time>{title}</time>
                {header && <b style={{ display: 'block', marginTop: 3 }}>{header}</b>}
                <p>{body}</p>
              </div>
            ))}
          </div>

          <h2 id="sec-turkiye" style={{ marginTop: 32 }}>{content('pdhesWhatIs.turkeyTitle')}</h2>
          <div className="card">
            <p>
              Türkiye için PDHES tartışması; JICA aday çalışmaları, DSİ rezervuarları, TEİAŞ bağlantı kabiliyeti,
              yenilenebilir üretim artışı ve yan hizmet ihtiyacı etrafında şekillenir.
            </p>
            <p>
              Bu prototipteki adaylar fizibilite sonucu <b>değildir</b>; ön eleme, yatırım anlatımı ve ayrıntılı yatırım incelemesine hazırlık için
              masaüstü seviyesinde sınıflandırılmıştır. Koordinatlar, teknik değerler, şebeke ilişkileri ve ekonomik varsayımlar kaynak bazlı, 
              yaklaşık veya kavramsal olabilir.
            </p>
          </div>

          <h2 id="sec-tipler" style={{ marginTop: 32 }}>PDHES Tipleri</h2>
          <div>
            {Object.entries(PDHES_TYPE_LABELS).map(([key, label]) => (
              <InfoAccordion key={key} title={label}>
                <p>{TYPE_DESCRIPTIONS[key]}</p>
              </InfoAccordion>
            ))}
          </div>

          <h2 id="sec-ornekler" style={{ marginTop: 32 }}>Dünya Örnekleri</h2>
          <div className="grid auto-fit">
            {WORLD_EXAMPLES.map((example) => (
              <div className="world-example-card" key={`${example.country}-${example.name}`}>
                <h4>{example.name}</h4>
                <div className="specs">
                  <span><b>{example.country}</b></span>
                  <span><b>{example.mw.toLocaleString('tr-TR')} MW</b></span>
                  <span><b>{example.head} m</b> düşü</span>
                  {example.year && <span>{example.year}</span>}
                </div>
                <p style={{ margin: '8px 0 0 0', fontSize: 13 }}>{example.description}</p>
              </div>
            ))}
          </div>

          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 32 }}>
            <div>
              <h2 id="sec-faydalar">{content('pdhesWhatIs.benefitsTitle')}</h2>
              <ul style={{ paddingLeft: 18 }}>
                <li><b>Enerji arbitrajı:</b> düşük fiyatlı saatlerde pompalama, yüksek fiyatlı saatlerde üretim.</li>
                <li><b>Şebeke hizmetleri:</b> primer/sekonder frekans kontrolü, reaktif güç desteği, kara başlatma (black-start) ve senkron atalet.</li>
                <li>Yenilenebilir kısıntıyı azaltma, pik talep yönetimi ve şebeke kararlılığı.</li>
              </ul>
            </div>
            <div>
              <h2 id="sec-riskler">{content('pdhesWhatIs.risksTitle')}</h2>
              <ul style={{ paddingLeft: 18 }}>
                <li>Jeoloji, fay, heyelan, karst ve yeraltı suyu belirsizlikleri.</li>
                <li>Çevresel Etki Değerlendirmesi (ÇED), korunan alan, ekolojik akış, kamulaştırma ve görsel etki.</li>
                <li>Deniz suyu projelerinde korozyon, biyolojik birikim (biofouling), sızdırmazlık kaplaması ve tuz aerosolu.</li>
              </ul>
            </div>
          </div>

          <h2 id="sec-maliyet" style={{ marginTop: 32 }}>{content('pdhesWhatIs.costsTitle')}</h2>
          <div className="card">
            <p style={{ margin: 0 }}>
              <b>Yatırım harcaması (CAPEX);</b> rezervuar, tünel, cebri boru (penstock), yeraltı güç evi (powerhouse),
              elektromekanik ekipman, şalt sahası (switchyard), yol, izin ve mühendislik kalemlerinden oluşur.
              Gelir modeli enerji arbitrajı, Dengeleme Güç Piyasası, yan hizmetler ve olası kapasite ödemeleriyle
              birlikte değerlendirilmelidir.
            </p>
          </div>

          <h2 id="sec-sozluk" style={{ marginTop: 32 }}>Teknik Terimler Sözlüğü</h2>
          <input
            id="pdhes-glossary-search"
            name="glossarySearch"
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
