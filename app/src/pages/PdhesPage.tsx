import { useMemo, useState } from 'react';
import { CONTENT_DEFAULTS, GLOSSARY, PDHES_TYPE_LABELS, WORLD_EXAMPLES } from '../utils/constants';
import { useAdminStore } from '../stores/useAdminStore';

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

export default function PdhesPage() {
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
      <article className="encyclopedia">
        <h2 className="big-title" dangerouslySetInnerHTML={html('pdhesWhatIs.title')} />

        <div className="card">
          <h2 dangerouslySetInnerHTML={html('pdhesWhatIs.definitionTitle')} />
          <p dangerouslySetInnerHTML={html('pdhesWhatIs.definitionBody')} />
          <div className="formula">
{`E = ρ × g × H × V × η
ρ: su yoğunluğu, g: yerçekimi ivmesi, H: net düşü (head), V: aktif hacim, η: çevrim verimi

Modern PDHES tesislerinde çevrim verimi (round-trip efficiency) çoğunlukla %70-85 aralığındadır.`}
          </div>
        </div>

        <h2 dangerouslySetInnerHTML={html('pdhesWhatIs.historyTitle')} />
        <div className="grid cols-4">
          {HISTORY.map(([title, body]) => (
            <div className="step" key={title}>
              <div className="num">{title.slice(0, 2)}</div>
              <b>{title}</b>
              <p>{body}</p>
            </div>
          ))}
        </div>

        <h2 dangerouslySetInnerHTML={html('pdhesWhatIs.turkeyTitle')} />
        <p>
          Türkiye için PDHES tartışması JICA aday çalışmaları, DSİ rezervuarları, TEİAŞ bağlantı kabiliyeti,
          yenilenebilir üretim artışı ve yan hizmet ihtiyacı etrafında şekillenir. Bu prototipteki adaylar
          fizibilite sonucu değildir; ön eleme, yatırım anlatımı ve ayrıntılı yatırım incelemesine hazırlık için
          masaüstü seviyesinde sınıflandırılmıştır.
        </p>

        <h2>PDHES Tipleri</h2>
        <div className="grid cols-4">
          {Object.entries(PDHES_TYPE_LABELS).map(([key, label]) => (
            <div className="world-example-card" key={key}>
              <h4>{label}</h4>
              <p>{TYPE_DESCRIPTIONS[key]}</p>
            </div>
          ))}
        </div>

        <h2>Dünya Örnekleri</h2>
        <div className="grid cols-3">
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

        <h2 dangerouslySetInnerHTML={html('pdhesWhatIs.benefitsTitle')} />
        <ul>
          <li>Enerji arbitrajı (energy arbitrage): düşük fiyatlı saatlerde pompalama, yüksek fiyatlı saatlerde üretim.</li>
          <li>Primer frekans kontrolü (primary frequency control), sekonder frekans kontrolü (secondary frequency control), reaktif güç desteği (reactive power support), kara başlatma (black-start) ve senkron atalet (synchronous inertia).</li>
          <li>Yenilenebilir kısıntıyı azaltma, pik talep yönetimi ve şebeke kararlılığı.</li>
        </ul>

        <h2 dangerouslySetInnerHTML={html('pdhesWhatIs.costsTitle')} />
        <p>
          Yatırım harcaması (CAPEX); rezervuar, tünel, cebri boru (penstock), yeraltı güç evi (powerhouse),
          elektromekanik ekipman, şalt sahası (switchyard), yol, izin ve mühendislik kalemlerinden oluşur.
          Gelir modeli enerji arbitrajı, Dengeleme Güç Piyasası, yan hizmetler ve olası kapasite ödemeleriyle
          birlikte değerlendirilmelidir.
        </p>

        <h2 dangerouslySetInnerHTML={html('pdhesWhatIs.risksTitle')} />
        <ul>
          <li>Jeoloji, fay, heyelan, karst ve yeraltı suyu belirsizlikleri.</li>
          <li>Çevresel Etki Değerlendirmesi (EIA), korunan alan, ekolojik akış, kamulaştırma ve görsel etki.</li>
          <li>Deniz suyu projelerinde korozyon, biyolojik birikim (biofouling), sızdırmazlık kaplaması ve tuz aerosolu.</li>
        </ul>

        <h2>Teknik Terimler Sözlüğü</h2>
        <input
          className="input glossary-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Terim ara"
        />
        <div style={{ overflow: 'auto' }}>
          <table>
            <thead>
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

        <h2>Sık Sorulan Sorular</h2>
        <div className="grid cols-2">
          {FAQ.map(([question, answer]) => (
            <div className="notice" key={question}>
              <b>{question}</b>
              <p className="small" style={{ marginTop: 6 }}>{answer}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
