import { useEffect, useMemo, useState } from 'react';
import { CONTENT_DEFAULTS, GLOSSARY } from '../utils/constants';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import DOMPurify from 'dompurify';
import SectionNav from '../components/ui/SectionNav';
import InfoAccordion from '../components/ui/InfoAccordion';
import FullscreenImageModal from '../components/ui/FullscreenImageModal';

interface PdhesPageProps {
  sectionId?: string;
}

export default function PdhesPage({ sectionId }: PdhesPageProps) {
  const getContent = useWorkspaceStore((state) => state.getContent);

  const [query, setQuery] = useState('');
  const [modalImage, setModalImage] = useState<{ src: string; title: string } | null>(null);

  const openModal = (src: string, title: string) => {
    setModalImage({ src, title });
  };

  const filteredGlossary = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase('tr-TR');
    if (!needle) return GLOSSARY;
    return GLOSSARY.filter((item) =>
      `${item.term} ${item.definition}`.toLocaleLowerCase('tr-TR').includes(needle),
    );
  }, [query]);
  const content = (key: string) => getContent(key, CONTENT_DEFAULTS);

  useEffect(() => {
    if (!sectionId) return;
    const frame = window.requestAnimationFrame(() => {
      const target = document.getElementById(sectionId);
      if (!target) return;

      const panel = target.closest<HTMLElement>('.panel.active');
      const panelIsScrollable = Boolean(panel && panel.scrollHeight > panel.clientHeight + 1);

      if (panel && panelIsScrollable && typeof panel.scrollTo === 'function') {
        window.scrollTo({ top: 0, behavior: 'auto' });
        panel.scrollTo({
          top: Math.max(0, target.offsetTop - 80),
          behavior: 'auto',
        });
      } else if (typeof target.scrollIntoView === 'function') {
        target.scrollIntoView({ block: 'start', behavior: 'auto' });
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [sectionId]);

  return (
    <section className="panel active">
      <article className="encyclopedia encyclopedia-layout" id="pdhes-nedir" style={{ marginTop: 12 }}>
        <div className="encyclopedia-sidebar">
          <p className="section-nav-title">İçindekiler</p>
          <SectionNav sections={[
            { id: 'sec-tanim', title: 'PDHES Nedir?' },
            { id: 'sec-dongu', title: 'Şarj / Deşarj' },
            { id: 'sec-bilesenler', title: 'Ana Bileşenler' },
            { id: 'sec-enerji', title: 'Enerji Hesabı' },
            { id: 'sec-sebeke', title: 'Şebeke Değeri' },
            { id: 'sec-olgunluk', title: 'Kanıtlanmış Teknoloji' },
            { id: 'sec-tipler', title: 'PDHES Tipleri' },
            { id: 'sec-turkiye', title: 'Türkiye Potansiyeli' },
            { id: 'sec-maliyet', title: 'Gelir Modeli' },
            { id: 'sec-riskler', title: 'Riskler' },
            { id: 'sec-veri', title: 'Türkiye Aday Veri Kurgusu' },
            { id: 'sec-sozluk', title: 'Teknik Sözlük' },
            { id: 'sec-sss', title: 'Sık Sorulan Sorular' },
          ]} />
        </div>
        
        <div>
          <div className="pdhes-rich-shell" style={{ padding: 0 }}><div className="content">
          <article className="info-card" id="sec-tanim">
            <header className="card-head">
              <div className="number-pill">01</div>
              <div>
                <span className="eyebrow">Tanım ve temel fikir</span>
                <h2 dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content('pdhesWhatIs.title')) }} />
              </div>
            </header>
            <figure className="figure-frame">
              <img src="pdhes-nedir/img-1.webp" alt="PDHES nedir? Şebeke ölçeğinde “su bataryası” mantığı görseli" loading="lazy" />
              <button className="fullscreen-btn" type="button" onClick={() => openModal('pdhes-nedir/img-2.webp', 'PDHES nedir ve temel çalışma mantığı nasıldır?')}>⛶ Tam ekran oku</button>
              <figcaption><b>Görsel:</b> PDHES’in gece/gündüz, pompalama/üretim ve üst-alt rezervuar ilişkisini özetleyen kavramsal kesit.</figcaption>
            </figure>
            <div className="card-body">
              <p>Pompa depolamalı hidroelektrik santral, farklı kotlarda bulunan iki su rezervuarı arasında çalışan büyük ölçekli bir enerji depolama sistemidir. Elektrik talebinin düşük, üretim fazlasının veya elektrik fiyatının düşük olduğu saatlerde alt rezervuardaki su pompalarla üst rezervuara basılır. Böylece elektrik enerjisi, suyun yüksek kotta sahip olduğu potansiyel enerji olarak depolanır.</p>
              <p>Elektrik talebinin arttığı saatlerde ise üst rezervuardaki su kontrollü şekilde alt rezervuara bırakılır. Su, cebri boru veya tünel sistemi üzerinden türbinlerden geçerken elektrik üretir. Bu nedenle PDHES, kimyasal batarya gibi elektrik depolamaz; enerjiyi suyun yüksekliğinden kaynaklanan yerçekimi potansiyeli olarak depolar.</p>
              <p>Bu sistemler özellikle uzun süreli depolama, yüksek güç kapasitesi, şebeke esnekliği ve yenilenebilir enerji üretiminin dengelenmesi açısından önemlidir. Ancak her aday saha için kot farkı, su hacmi, çevresel etkiler, bağlantı imkânı ve maliyet ayrı ayrı incelenmelidir.</p>
              <div className="note-grid">
                <div><b>Depolama biçimi</b><span>Yüksek kotta su hacmi</span></div>
                <div><b>Güç üretimi</b><span>Pompa-türbin + motor-jeneratör</span></div>
                <div><b>Temel değer</b><span>Uzun süreli depolama ve hızlı şebeke tepkisi</span></div>
              </div>
            </div>
          </article>

          <article className="info-card" id="sec-dongu">
            <header className="card-head">
              <div className="number-pill">02</div>
              <div>
                <span className="eyebrow">Çalışma prensibi</span>
                <h2>PDHES hangi saatlerde su pompalar, hangi saatlerde elektrik üretir?</h2>
              </div>
            </header>
            <figure className="figure-frame">
              <img src="pdhes-nedir/img-3.webp" alt="İki yönlü çevrim: Pompalama modu ve üretim modu görseli" loading="lazy" />
              <button className="fullscreen-btn" type="button" onClick={() => openModal('pdhes-nedir/img-4.webp', 'PDHES hangi saatlerde su pompalar, hangi saatlerde elektrik üretir?')}>⛶ Tam ekran oku</button>
              <figcaption><b>Görsel:</b> Şarj/pompalama ve deşarj/üretim yönlerinin aynı hidrolik makine üzerinden tersinir çalışması.</figcaption>
            </figure>
            <div className="card-body">
              <p>PDHES iki ana işletme moduyla çalışır: pompalama modu ve üretim modu.</p>
              <p>Pompalama modunda sistem elektrik tüketir. Bu işlem genellikle elektrik talebinin düşük olduğu gece saatlerinde, yenilenebilir üretimin fazla olduğu dönemlerde veya sistemde enerji fazlası oluştuğunda yapılır. Alt rezervuardaki su pompalarla üst rezervuara basılır. Bu sırada elektrik enerjisi, suyun yüksek kotta depolanan potansiyel enerjisine dönüştürülür.</p>
              <p>Üretim modunda ise sistem elektrik üretir. Elektrik talebinin arttığı, puant yükün oluştuğu veya şebekenin hızlı desteğe ihtiyaç duyduğu saatlerde üst rezervuardaki su türbinlerden geçirilir. Türbin-jeneratör grubu bu akıştan elektrik üretir ve şebekeye güç verir.</p>
              <p>Bu çevrimde enerji kayıpları vardır. Sisteme verilen enerjinin tamamı geri alınamaz. Bu nedenle PDHES’in ekonomik çalışması için pompalama yapılan saatler ile üretim yapılan saatler arasındaki fiyat farkı, şebeke ihtiyacı ve yan hizmet gelirleri birlikte değerlendirilmelidir.</p>
              <div className="split-box">
                <div className="mode charge"><h4>Şarj / Pompalama</h4><ul><li>Elektrik tüketir.</li><li>Su alt rezervuardan üst rezervuara çıkar.</li><li>Fazla yenilenebilir üretimi değerlendirir.</li><li>Enerji potansiyel enerji olarak saklanır.</li></ul></div>
                <div className="mode discharge"><h4>Deşarj / Üretim</h4><ul><li>Elektrik üretir.</li><li>Su üst rezervuardan alt rezervuara iner.</li><li>Puant talebi ve sistem açığını karşılar.</li><li>Frekans ve gerilim desteğine katkı verir.</li></ul></div>
              </div>
            </div>
          </article>

          <article className="info-card" id="sec-bilesenler">
            <header className="card-head">
              <div className="number-pill">03</div>
              <div>
                <span className="eyebrow">Mühendislik bileşenleri</span>
                <h2>Bir PDHES tesisinde hangi ana yapılar bulunur?</h2>
              </div>
            </header>
            <figure className="figure-frame">
              <img src="pdhes-nedir/img-5.webp" alt="Sistem anatomisi: rezervuar, cebri boru, türbin odası ve şalt sahası görseli" loading="lazy" />
              <button className="fullscreen-btn" type="button" onClick={() => openModal('pdhes-nedir/img-6.webp', 'Bir PDHES tesisinde hangi ana yapılar bulunur?')}>⛶ Tam ekran oku</button>
              <figcaption><b>Görsel:</b> Üst rezervuar, cebri boru, motor-jeneratör ve tersinir Francis pompa-türbin yapısının kesit anlatımı.</figcaption>
            </figure>
            <div className="card-body">
              <p>Bir PDHES tesisinin temel bileşenleri üst rezervuar, alt rezervuar, su iletim sistemi, pompa-türbin grubu, motor-jeneratör, santral binası, şalt sahası ve iletim bağlantısından oluşur.</p>
              <p>Üst rezervuar, enerjinin depolandığı ana haznedir. Su yüksek kotta tutulduğu için potansiyel enerji taşır. Alt rezervuar ise üretim sonunda suyun ulaştığı veya pompalama sırasında suyun alındığı haznedir. Bu iki rezervuar arasındaki kot farkı, sistemin enerji üretme kapasitesini doğrudan etkiler.</p>
              <p>Su iletim sistemi; tünel, cebri boru, vana odası, denge bacası ve kuyruksuyu yapılarından oluşabilir. Bu sistem suyun kontrollü ve güvenli şekilde hareket etmesini sağlar. Santral binasında pompa-türbin ve motor-jeneratör grupları yer alır. Şalt sahası ve iletim bağlantısı ise üretilen elektriğin şebekeye aktarılmasını sağlar.</p>
              <p>Gerçek bir projede bu bileşenlerin yerleşimi yalnızca harita üzerinde seçilerek belirlenemez. Jeoloji, topoğrafya, kamulaştırma, çevresel etkiler, hidrolik tasarım, kısa devre gücü, bağlantı kapasitesi ve işletme güvenliği birlikte incelenmelidir.</p>
              <ul className="rich-list">
                <li><strong>Üst rezervuar:</strong> Suyun potansiyel enerji olarak depolandığı yüksek kotlu haznedir. Aktif hacim, su seviyesi aralığı, sızdırmazlık, heyelan riski ve çevresel etkiler kritik parametrelerdir.</li>
                <li><strong>Alt rezervuar:</strong> Üretim sonrası suyun toplandığı ve pompalama sırasında su kaynağı olan haznedir. Mevcut baraj, göl, deniz veya yapay havuz olabilir.</li>
                <li><strong>Cebri boru / basınç tüneli:</strong> Yüksek basınçlı suyu türbine taşıyan ana hidrolik yoldur. Uzunluk, çap, eğim, sürtünme kayıpları ve su darbesi hesabı tasarımın merkezindedir.</li>
                <li><strong>Denge bacası:</strong> Ani yük değişimlerinde su darbesi basınçlarını azaltır, hidrolik geçici rejimi güvenli hale getirir.</li>
                <li><strong>Yeraltı türbin odası:</strong> Pompa-türbin, motor-jeneratör, vanalar, trafolar ve yardımcı sistemlerin bulunduğu ana üretim merkezidir.</li>
                <li><strong>Şalt sahası ve iletim bağlantısı:</strong> Gücün TEİAŞ iletim sistemine aktarılmasını sağlar; bağlantı kapasitesi, kısa devre gücü, N-1 kriteri ve gerilim seviyesi burada belirleyicidir.</li>
              </ul>
            </div>
          </article>

          <article className="info-card" id="sec-enerji">
            <header className="card-head">
              <div className="number-pill">04</div>
              <div>
                <span className="eyebrow">Temel mühendislik bağıntısı</span>
                <h2>Bir PDHES’in depolayabileceği enerji miktarı nasıl belirlenir?</h2>
              </div>
            </header>
            <figure className="figure-frame">
              <img src="pdhes-nedir/img-7.webp" alt="Enerji hesabının özü: düşü, hacim ve çevrim verimi görseli" loading="lazy" />
              <button className="fullscreen-btn" type="button" onClick={() => openModal('pdhes-nedir/img-8.webp', 'Bir PDHES’in depolayabileceği enerji miktarı nasıl belirlenir?')}>⛶ Tam ekran oku</button>
              <figcaption><b>Görsel:</b> PDHES’in hızlı rezerv yükleme ve frekans kontrolü sağlayan esnek şebeke kaynağı olarak konumlandırılması.</figcaption>
            </figure>
            <div className="card-body">
              <p>PDHES’te depolanabilecek enerji miktarı temel olarak üç ana değişkene bağlıdır: kullanılabilir su hacmi, üst ve alt rezervuar arasındaki net düşü, sistem verimi.</p>
              <p>Kullanılabilir su hacmi arttıkça depolanabilecek enerji artar. Net düşü, suyun türbinlere ulaşırken sahip olduğu etkili yükseklik farkıdır. Düşü ne kadar yüksekse aynı su hacminden elde edilebilecek enerji de o kadar artar. Sistem verimi ise pompalama, türbinleme, jeneratör, hidrolik kayıplar ve elektriksel kayıpların toplam etkisini gösterir.</p>
              <p>Basitleştirilmiş enerji hesabı şu mantığa dayanır: suyun kütlesi, yerçekimi ivmesi, düşü ve verim birlikte dikkate alınır. Ancak bu hesap yalnızca ön değerlendirme için kullanılabilir. Gerçek fizibilitede net düşü, sürtünme kayıpları, su seviyesi değişimi, türbin verim eğrileri, işletme aralığı, rezervuar ölü hacmi ve çevresel kısıtlar ayrıca modellenmelidir.</p>
              <p>Bu nedenle bir sahada yüksek kot farkı bulunması tek başına yeterli değildir. Uygun rezervuar alanı, yeterli hacim, bağlantı imkânı ve kabul edilebilir çevresel etki birlikte sağlanmalıdır.</p>
              <div className="formula-card"><span>E = ρ × g × H × V × η</span><small>ρ: su yoğunluğu · g: yerçekimi · H: net düşü · V: aktif hacim · η: verim</small></div>
              
              <div className="note-grid four">
                <div><b>Net düşü</b><span>Brüt kot farkından hidrolik kayıplar düşülür.</span></div>
                <div><b>Aktif hacim</b><span>Kullanılabilir su hacmidir; toplam göl hacmiyle aynı değildir.</span></div>
                <div><b>Güç</b><span>Debi ve düşüyle ilişkilidir; MW kapasiteyi belirler.</span></div>
                <div><b>Enerji</b><span>Hacim ve düşüyle ilişkilidir; MWh/GWh depolamayı belirler.</span></div>
              </div>
            </div>
          </article>

          <article className="info-card" id="sec-sebeke">
            <header className="card-head">
              <div className="number-pill">05</div>
              <div>
                <span className="eyebrow">Sistem işletmesi ve esneklik</span>
                <h2>PDHES elektrik şebekesine hangi katkıları sağlayabilir?</h2>
              </div>
            </header>
            <figure className="figure-frame">
              <img src="pdhes-nedir/img-9.webp" alt="Şebeke kararlılığı: yenilenebilir üretim artarken neden kritik? görseli" loading="lazy" />
              <button className="fullscreen-btn" type="button" onClick={() => openModal('pdhes-nedir/img-10.webp', 'PDHES elektrik şebekesine hangi katkıları sağlayabilir?')}>⛶ Tam ekran oku</button>
              <figcaption><b>Görsel:</b> Yenilenebilir üretim ile tüketim eğrileri arasındaki saatlik uyumsuzluk ve “şebeke kararlılık boşluğu”.</figcaption>
            </figure>
            <div className="card-body">
              <p>PDHES yalnızca enerji depolama amacıyla değil, şebeke işletme güvenliğini desteklemek amacıyla da kullanılabilir. Büyük güçlü ve hızlı tepki verebilen bir santral olduğu için arz-talep dengesinin korunmasına katkı sağlar.</p>
              <p>Üretim modunda sisteme hızlı aktif güç desteği verebilir. Talebin aniden arttığı veya üretimin düştüğü durumlarda devreye girerek frekansın korunmasına yardımcı olabilir. Pompalama modunda ise fazla üretimi tüketerek sistemdeki dengesizliği azaltabilir. Bu özellik özellikle rüzgâr ve güneş üretiminin yüksek olduğu saatlerde önemlidir.</p>
              <p>PDHES tesisleri uygun teknik tasarımla frekans kontrolü, rezerv kapasite, gerilim desteği, reaktif güç desteği, siyah başlatma imkânı ve sistem toparlanmasına katkı gibi hizmetler sunabilir. Ancak bu hizmetlerin sağlanabilmesi için türbin-jeneratör teknolojisi, kontrol sistemi, bağlantı noktası, TEİAŞ işletme kriterleri ve piyasa kuralları ayrıca değerlendirilmelidir.</p>
              <p>Şebeke açısından PDHES’in değeri yalnızca ürettiği elektrik miktarıyla ölçülmemelidir. Esneklik, hızlı devreye girme, uzun süreli destek ve sistem güvenilirliğine katkı da ayrı bir değer oluşturur.</p>
              <ul className="rich-list compact">
                <li><strong>Frekans kontrolü:</strong> Ani üretim/tüketim dengesizliklerinde hızlı aktif güç tepkisi verebilir.</li>
                <li><strong>Senkron atalet:</strong> Büyük dönen makineler frekans değişimini doğal olarak yavaşlatabilir.</li>
                <li><strong>Gerilim desteği:</strong> Reaktif güç ve gerilim kontrolüyle iletim sistemi kararlılığına katkı sağlar.</li>
                <li><strong>Oturan Sistemin Toparlanması - black start:</strong> Uygun tasarımlarda sistem toparlama senaryolarında değerli olabilir.</li>
                <li><strong>Kısıntı azaltımı:</strong> RES/GES üretim fazlasının boşa gitmesini azaltabilir.</li>
              </ul>
            </div>
          </article>

          <article className="info-card" id="sec-olgunluk">
            <header className="card-head">
              <div className="number-pill">06</div>
              <div>
                <span className="eyebrow">Teknolojik değer önerisi</span>
                <h2>PDHES neden olgun ve uzun ömürlü bir depolama teknolojisi olarak görülür?</h2>
              </div>
            </header>
            <figure className="figure-frame">
              <img src="pdhes-nedir/img-11.webp" alt="Neden stratejik? Olgun teknoloji, uzun ömür ve düşük kapasite kaybı görseli" loading="lazy" />
              <button className="fullscreen-btn" type="button" onClick={() => openModal('pdhes-nedir/img-12.webp', 'PDHES neden olgun ve uzun ömürlü bir depolama teknolojisi olarak görülür?')}>⛶ Tam ekran oku</button>
              <figcaption><b>Görsel:</b> PDHES’in kanıtlanmış olgunluk, şebeke atalet katkısı, RES entegrasyonu ve düşük döngüsel bozulma avantajları.</figcaption>
            </figure>
            <div className="card-body">
              <p>PDHES, dünyada uzun süredir kullanılan ve büyük ölçekli enerji depolama için teknik olarak kanıtlanmış bir teknolojidir. Temel bileşenleri hidroelektrik mühendisliği, pompa-türbin teknolojisi, büyük elektrik makineleri ve yüksek gerilim bağlantı sistemlerine dayanır. Bu nedenle teknoloji riski birçok yeni depolama seçeneğine göre daha düşüktür.</p>
              <p>Uygun tasarlanmış bir PDHES tesisi uzun işletme ömrüne sahip olabilir. Mekanik ve elektrik ekipmanları periyodik bakım, yenileme ve modernizasyonla uzun yıllar işletilebilir. Depolama kapasitesi ise kimyasal bataryalarda olduğu gibi çevrim sayısına bağlı hızlı bir kapasite kaybına uğramaz. Ancak bu, bakım ihtiyacının olmadığı anlamına gelmez. Rezervuar, tünel, cebri boru, türbin, jeneratör, trafo ve kontrol sistemleri düzenli bakım ister.</p>
              <p>PDHES’in stratejik önemi; büyük güçlerde çalışabilmesi, saatler mertebesinde enerji sağlayabilmesi, yenilenebilir üretimi dengelemesi ve şebeke güvenliğine katkı vermesinden kaynaklanır. Buna karşılık ilk yatırım maliyeti yüksek, izin süreçleri uzun ve saha seçimi zor olabilir. Bu nedenle her proje teknik, ekonomik, çevresel ve hukuki yönleriyle ayrı ayrı incelenmelidir.</p>
              <div className="comparison-mini">
                <div><h4>PDHES güçlüdür</h4></div>
                <div><h4>Batarya güçlüdür</h4></div>
              </div>
            </div>
          </article>

          <article className="info-card" id="sec-tipler">
            <header className="card-head">
              <div className="number-pill">07</div>
              <div>
                <span className="eyebrow">Saha tipi ve yerleşim kararı</span>
                <h2>PDHES tesis tipleri nelerdir ve aralarındaki farklar nelerdir?</h2>
              </div>
            </header>
            <figure className="figure-frame">
              <img src="pdhes-nedir/img-13.webp" alt="Topoloji seçimi: kapalı çevrim, mevcut HES entegrasyonu ve deniz suyu modeli görseli" loading="lazy" />
              <button className="fullscreen-btn" type="button" onClick={() => openModal('pdhes-nedir/img-14.webp', 'PDHES tesis tipleri nelerdir ve aralarındaki farklar nelerdir?')}>⛶ Tam ekran oku</button>
              <figcaption><b>Görsel:</b> Mevcut HES ile bütünleşik model ve yeni yatırım/greenfield modelinin mühendislik yaklaşımı açısından karşılaştırılması.</figcaption>
            </figure>
            <div className="card-body">
              <p>PDHES tesisleri genel olarak kapalı çevrim, açık çevrim ve deniz suyu kullanan sistemler olarak sınıflandırılabilir.</p>
              <p>Kapalı çevrim PDHES’te üst ve alt rezervuar doğal akarsu sistemiyle sürekli bağlantılı olmayabilir. Su esas olarak iki rezervuar arasında çevrim yapar. Bu tip projelerde akarsu rejimine doğrudan etki daha sınırlı olabilir; ancak yine de arazi kullanımı, su temini, buharlaşma, sızma, çevresel etki ve rezervuar güvenliği değerlendirilmelidir.</p>
              <p>Açık çevrim PDHES’te rezervuarlardan biri veya her ikisi doğal su kütlesiyle bağlantılı olabilir. Mevcut baraj veya hidroelektrik altyapısıyla birlikte değerlendirilebilir. Bu durumda hidrolik işletme, mansap etkileri, ekolojik akış, su tahsisleri ve mevcut santral işletmesi daha karmaşık hale gelir.</p>
              <p>Deniz suyu PDHES’te alt rezervuar olarak deniz kullanılabilir. Üst rezervuar kıyıya yakın yüksek bir kotta yer alır. Bu yaklaşım bazı kıyı bölgelerinde kot farkı avantajı sağlayabilir; ancak tuzlu su korozyonu, deniz ekosistemi, kıyı yapıları, çevresel izinler ve malzeme seçimi önemli tasarım konularıdır.</p>
              <p>Her tipin avantajı ve sınırlaması farklıdır. Bu nedenle tesis tipi yalnızca harita üzerinde değil; su kaynağı, topoğrafya, jeoloji, çevresel hassasiyet, bağlantı imkânı ve işletme amacı birlikte değerlendirilerek seçilmelidir.</p>
              <div className="type-grid">
                <article><h4>Kapalı çevrim</h4></article>
                <article><h4>Açık / bütünleşik çevrim</h4></article>
                <article><h4>Deniz suyu PDHES</h4></article>
              </div>
            </div>
          </article>

          <article className="info-card" id="sec-turkiye">
            <header className="card-head">
              <div className="number-pill">08</div>
              <div>
                <span className="eyebrow">Ulusal stratejik bağlam</span>
                <h2>Türkiye’de PDHES neden değerlendirilmelidir?</h2>
              </div>
            </header>
            <figure className="figure-frame">
              <img src="pdhes-nedir/img-15.webp" alt="Türkiye açısından fırsat: topografya, hidro miras ve yenilenebilir dönüşüm görseli" loading="lazy" />
              <button className="fullscreen-btn" type="button" onClick={() => openModal('pdhes-nedir/img-16.webp', 'Türkiye’de PDHES neden değerlendirilmelidir?')}>⛶ Tam ekran oku</button>
              <figcaption><b>Görsel:</b> Türkiye için vurgulanan 19,6 TWh gerçekleştirilebilir potansiyel iddiası ve Avrupa karşılaştırması.</figcaption>
            </figure>
            <div className="card-body">
              <p>Türkiye’de elektrik üretim yapısı giderek daha fazla yenilenebilir kaynağa dayanmaktadır. Rüzgâr ve güneş üretimi arttıkça üretim saatleri ile tüketim saatleri her zaman aynı zamana denk gelmeyebilir. Bu durum bazı saatlerde üretim fazlası, bazı saatlerde ise esneklik ihtiyacı oluşturabilir.</p>
              <p>PDHES, bu dengesizliğin yönetilmesinde kullanılabilecek büyük ölçekli bir seçenektir. Uygun sahalarda fazla elektrikle su üst rezervuara pompalanabilir, ihtiyaç olduğunda aynı su elektrik üretimi için kullanılabilir. Bu yönüyle PDHES, yenilenebilir üretimin sisteme daha güvenli entegre edilmesine katkı sağlayabilir.</p>
              <p>Türkiye’nin topoğrafyası, mevcut baraj altyapısı, dağlık bölgeleri, kıyı alanları ve iletim sistemi dikkate alındığında PDHES için incelenebilecek farklı saha tipleri vardır. Ancak potansiyel bulunması, her sahanın yapılabilir olduğu anlamına gelmez. Gerçek uygulanabilirlik için çevresel izinler, jeoteknik koşullar, su kullanımı, bağlantı kapasitesi, maliyet, kamulaştırma ve piyasa gelirleri birlikte değerlendirilmelidir.</p>
              <p>Bu nedenle Türkiye için PDHES konusu, yalnızca enerji üretimi değil; depolama, sistem esnekliği, arz güvenliği ve yenilenebilir enerji entegrasyonu başlıklarıyla birlikte ele alınmalıdır.</p>
              <div className="callout warning"><b>Önemli not:</b> Potansiyel haritaları “yapılabilir proje” listesi değildir. Her aday saha; kot, hacim, mesafe, mülkiyet, korunan alan, fay/heyelan, bağlantı kapasitesi ve gelir modeli açısından ayrı ayrı fizibilite sürecinden geçmelidir.</div>
            </div>
          </article>

          <article className="info-card" id="sec-maliyet">
            <header className="card-head">
              <div className="number-pill">09</div>
              <div>
                <span className="eyebrow">Ekonomi ve piyasa tasarımı</span>
                <h2>PDHES yatırımlarında gelir modeli nasıl oluşur?</h2>
              </div>
            </header>
            <figure className="figure-frame">
              <img src="pdhes-nedir/img-17.webp" alt="Gelir modeli: arbitraj tek başına yeterli mi? görseli" loading="lazy" />
              <button className="fullscreen-btn" type="button" onClick={() => openModal('pdhes-nedir/img-18.webp', 'PDHES yatırımlarında gelir modeli nasıl oluşur?')}>⛶ Tam ekran oku</button>
              <figcaption><b>Görsel:</b> Gece depolama, puant üretim, fiyat farkı ve yıllık net kâr yaklaşımını özetleyen finansal akış şeması.</figcaption>
            </figure>
            <div className="card-body">
              <p>PDHES’in gelir modeli yalnızca ucuz saatte elektrik alıp pahalı saatte elektrik satma mantığına dayanmaz. Bu arbitraj geliri önemli olabilir; ancak çoğu projede tek başına yeterli olmayabilir. Çünkü pompalama ve üretim çevriminde verim kaybı vardır, ayrıca yatırım maliyeti yüksektir.</p>
              <p>Gelir kalemleri arasında enerji arbitrajı, kapasite mekanizması, yan hizmet gelirleri, frekans kontrolü, rezerv hizmetleri, sistem kısıtlarının azaltılması ve yenilenebilir üretim kesintilerinin düşürülmesi gibi başlıklar yer alabilir. Hangi gelirlerin mümkün olduğu ilgili piyasa kurallarına, bağlantı anlaşmasına, teknik yeterliliklere ve sistem işletmecisinin ihtiyaçlarına bağlıdır.</p>
              <p>Ekonomik değerlendirmede yatırım maliyeti, inşaat süresi, finansman maliyeti, çevrim sayısı, net verim, işletme-bakım giderleri, gelir belirsizliği ve piyasa fiyat senaryoları dikkate alınmalıdır. Ayrıca santralin kaç saatlik depolama sağlayacağı, ne kadar hızlı devreye gireceği ve hangi şebeke hizmetlerine katılabileceği gelir modelini doğrudan etkiler.</p>
              <p>Bu nedenle PDHES için yalnızca kurulu güç üzerinden değerlendirme yapmak eksik olur. Enerji kapasitesi, işletme esnekliği, piyasa katılımı ve sistem faydası birlikte analiz edilmelidir.</p>
              <ul className="rich-list compact">
                <li><strong>Enerji arbitrajı:</strong> Düşük fiyatlı saatlerde tüketim, yüksek fiyatlı saatlerde üretim.</li>
                <li><strong>Dengeleme piyasası:</strong> Gerçek zamanlı sistem dengesizliklerinde hızlı yük alma/yük atma kabiliyeti.</li>
                <li><strong>Yan hizmetler:</strong> Frekans kontrolü, reaktif güç, gerilim desteği, yedek kapasite ve Oturan Sistemin Toparlanması - black start değeri.</li>
                <li><strong>Kapasite değeri:</strong> Emre amade ve güvenilir esnek kapasitenin sistem planlamasındaki katkısı.</li>
                <li><strong>Kısıntı azaltımı:</strong> Yenilenebilir üretimin sistem kısıtı nedeniyle azaltılmasını önleyerek dolaylı ekonomik değer yaratması.</li>
              </ul>
            </div>
          </article>

          <article className="info-card" id="sec-riskler">
            <header className="card-head">
              <div className="number-pill">10</div>
              <div>
                <span className="eyebrow">Fizibiliteye geçmeden önce</span>
                <h2>Bir PDHES sahası değerlendirilirken hangi riskler incelenmelidir?</h2>
              </div>
            </header>
            <figure className="figure-frame">
              <img src="pdhes-nedir/img-19.webp" alt="Riskler, çevresel uyum ve ön etüt yol haritası görseli" loading="lazy" />
              <button className="fullscreen-btn" type="button" onClick={() => openModal('pdhes-nedir/img-20.webp', 'Bir PDHES sahası değerlendirilirken hangi riskler incelenmelidir?')}>⛶ Tam ekran oku</button>
              <figcaption><b>Görsel:</b> Çevresel etki değerlendirmesi, sosyal kabul, su/ekosistem ve proje geliştirme boyutlarını birlikte gösteren uyum şeması.</figcaption>
            </figure>
            <div className="card-body">
              <p>PDHES projeleri büyük altyapı yatırımlarıdır. Bu nedenle ön değerlendirme aşamasında teknik, çevresel, ekonomik ve hukuki riskler birlikte incelenmelidir.</p>
              <p>Teknik açıdan en önemli başlıklar kot farkı, rezervuar hacmi, zemin koşulları, heyelan riski, fay hatları, tünel güzergâhı, cebri boru yerleşimi, su kayıpları, bağlantı noktası ve iletim kapasitesidir. Jeolojik ve jeoteknik koşullar uygun değilse yüksek potansiyel görünen bir saha uygulanabilir olmayabilir.</p>
              <p>Çevresel açıdan su kullanımı, doğal yaşam alanları, orman alanları, koruma statüleri, tarım alanları, yerleşim yerleri, kültürel varlıklar ve mansap etkileri incelenmelidir. Kapalı çevrim projelerde bile su temini, buharlaşma, sızma ve rezervuar güvenliği değerlendirilmelidir.</p>
              <p>Ekonomik açıdan yatırım maliyeti, inşaat süresi, finansman, piyasa gelirleri, işletme-bakım giderleri ve izin süreçleri dikkate alınmalıdır. Şebeke açısından ise bağlantı kapasitesi, kısa devre seviyesi, N-1 güvenliği, sistem işletme ihtiyaçları ve yan hizmet katılım koşulları değerlendirilmelidir.</p>
              <p>Ön etüt süreci harita tabanlı aday belirleme ile başlayabilir; ancak nihai karar için arazi ölçümleri, jeoteknik etüt, hidrolik modelleme, çevresel değerlendirme, bağlantı görüşleri ve detaylı fizibilite çalışması gerekir. Bu nedenle erken aşama analizler karar destek amaçlı görülmeli, kesin yatırım kararı yerine daha ayrıntılı inceleme için başlangıç noktası olarak kullanılmalıdır.</p>
              <div className="check-flow">
                <div><span>1</span><b>Topoğrafya</b><small>Yeterli net düşü ve makul hidrolik yol var mı?</small></div>
                <div><span>2</span><b>Hacim</b><small>Aktif depolama hacmi hedef MWh için yeterli mi?</small></div>
                <div><span>3</span><b>Jeoloji</b><small>Fay, karst, heyelan, kaya kalitesi ve sızdırmazlık uygun mu?</small></div>
                <div><span>4</span><b>Çevre</b><small>ÇED, korunan alan, su rejimi, ekolojik akış ve sosyal kabul yönetilebilir mi?</small></div>
                <div><span>5</span><b>Şebeke</b><small>Bağlantı noktası, gerilim seviyesi, kısa devre gücü ve N-1 uygun mu?</small></div>
                <div><span>6</span><b>Ekonomi</b><small>CAPEX, OPEX, arbitraj, yan hizmet ve kapasite değeri dengeli mi?</small></div>
              </div>
              
              <div className="callout danger"><b>Fizibilite uyarısı:</b> Bu site ve bu sekme eğitim/ön inceleme amaçlıdır. Gerçek rezervuar sınırları, kotlar, tünel güzergâhı, kurulu güç, enerji hacmi, bağlantı uygunluğu ve yatırım kararı için mühendislik etüdü, DSİ/TEİAŞ görüşleri, ÇED ve saha ölçümleri gerekir.</div>
            </div>
          </article>



          <article className="info-card" id="sec-veri">
            <header className="card-head">
              <div className="number-pill">11</div>
              <div>
                <span className="eyebrow">Veri kurgusu ve sınırlamalar</span>
                <h2>Türkiye Aday Veri Kurgusu</h2>
              </div>
            </header>
            <div className="card-body">
              <p>Bu sürümde Türkiye adayları iki kaynak grubuyla sunulur: Açık Çevrim PDHES teknik listesine dayanan kara tipi adaylar ve gerçek skor sırasına göre seçilen 4 deniz tipi prototip. Bu ayrım, çevrim tipi, altyapı tipi, kavram tipi, şebeke besleme türü ve birincil amaç alanlarıyla okunur.</p>
              <p>Karayüzeyli (Açık Çevrim) adaylarda kurulu güç, proje debisi ve düşü değerleri teknik çalışmalara dayanır. Koordinatlar kesin nokta verilmediği için yaklaşık saha yerleşimi olarak işaretlenir. Bu yüzden harita ve 3D görünüm bir mühendislik çizimi değil, kavramsal tesis yerleşimi ve ön inceleme görselidir.</p>
              <p>Deniz tipi adaylarda Taşucu, Bozyazı-Anamur, Karaburun ve Finike-Kumluca mevcut veri setindeki deniz göstergeli adaylardan seçilmiştir. Deniz suyu korozyonu, intake/outfall ekolojisi, biofouling, kıyı izinleri ve sızdırmazlık kaplaması bu adaylarda ayrıca izlenmesi gereken tasarım riskleridir.</p>
              <ul className="rich-list compact">
                <li><strong>Açık Çevrim:</strong> teknik kapasite, debi ve düşü kaynak değerleriyle; koordinatlar kesin saha koordinatı gibi kullanılmadan gösterilir.</li>
                <li><strong>Deniz Suyu:</strong> skor ve kıyı yerleşim çizgisi korunarak, tuzlu suya özel risklerle birlikte sunulur.</li>
                <li><strong>Ekonomi:</strong> hesaplanan CAPEX/gelir varsa gösterilir; yoksa senaryo varsayımı üretilir.</li>
              </ul>
            </div>
          </article>


          <article className="info-card" id="sec-sozluk">
            <header className="card-head">
              <div className="number-pill">13</div>
              <div>
                <span className="eyebrow">Teknik okuma yardımı</span>
                <h2>Teknik Terimler Sözlüğü</h2>
              </div>
            </header>
            <label className="sr-only" htmlFor="pdhes-glossary-search">Teknik terim ara</label>
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
          </article>

          <article className="info-card" id="sec-sss">
            <header className="card-head">
              <div className="number-pill">14</div>
              <div>
                <span className="eyebrow">Hızlı yanıtlar</span>
                <h2>Sık Sorulan Sorular</h2>
              </div>
            </header>
            <div className="card-body">
              <InfoAccordion title="Bu listedeki adaylar yatırıma veya ihaleye hazır projeler midir?">
                <p>Hayır. Platformdaki adaylar temel mühendislik eğitimi, ön inceleme, kapasite planlaması ve karar destek amacıyla sunulur. Bu sahaların hayata geçebilmesi için zemin etüdü, ÇED (Çevresel Etki Değerlendirmesi) raporu, EPDK lisans süreçleri, DSİ ve TEİAŞ bağlantı onayları, ayrıntılı fizibilite çalışmaları ve finansal kapanış aşamalarından geçmesi zorunludur.</p>
              </InfoAccordion>
              <InfoAccordion title="Pompaj depolamalı HES'lerin (PDHES) lityum-iyon bataryalara göre avantajları nelerdir?">
                <p>PDHES tesisleri tipik olarak çok daha uzun ömürlüdür (50-100 yıl) ve zamanla kapasite kaybı veya degradasyon (bozulma) yaşamazlar. Devreye girme süreleri birkaç dakikayı bulsa da, çok büyük ölçekli enerjiyi (GWh seviyesinde) saatlerce kesintisiz şebekeye sağlayabilirler. Lityum-iyon bataryalar ise saniyeler içinde devreye girmesine rağmen, daha çok kısa süreli (2-4 saat) frekans kontrolü ve dengeleme hizmetleri için idealdir.</p>
              </InfoAccordion>
              <InfoAccordion title="Kapalı çevrim PDHES projelerinin açık çevrim projelere göre öne çıkan yönleri nelerdir?">
                <p>Kapalı çevrim (Closed-loop) PDHES projeleri doğal bir nehir veya göl yatağından bağımsız olarak inşa edildikleri için mevcut su ekosistemine müdahale etmezler. Bu durum, ÇED süreçlerini ve çevresel izinleri önemli ölçüde hızlandırabilir. Sadece sistemdeki buharlaşma kayıplarını telafi edecek küçük bir su kaynağına ihtiyaç duyarlar.</p>
              </InfoAccordion>
              <InfoAccordion title="Deniz suyu kullanan PDHES projelerinde mühendislik açısından ana zorluklar (belirsizlikler) nelerdir?">
                <p>Tuzlu suyun yarattığı yoğun korozyon etkisi nedeniyle elektromekanik teçhizatın (pompa, türbin, vanalar) özel alaşımlardan üretilmesi gerekir. Ayrıca deniz canlılarıyla etkileşimi (midye ve yosun birikimi) engellemek için intake/outfall (su alma ve deşarj) yapılarının özel tasarlanması, kıyı kullanım izinlerinin alınması ve üst rezervuarda tuzlu suyun yeraltı suyuna sızmasını engelleyecek yüksek kaliteli membran/kaplama (liner) teknolojisinin kullanılması şarttır.</p>
              </InfoAccordion>
              <InfoAccordion title="Platformdaki aday listelerinde neden koordinatların bazıları sadece kavramsal bir noktayı gösteriyor?">
                <p>İlgili kamu veya özel sektör raporlarında bazen projelerin kesin yerleşim planları (rezervuar aksı, santral binası konumu) ticari sırlar veya rapor kısıtlılıkları nedeniyle tam olarak paylaşılmaz. Bu durumlarda, analiz edilen havza veya bölge referans alınarak kavramsal (yaklaşık) bir koordinat oluşturulur ve uygulamada bu koordinatlar sistemin hesaplama bütünlüğünü sağlamak için bir referans noktası olarak işaretlenir.</p>
              </InfoAccordion>
              <InfoAccordion title="Tablodaki senaryo değerleri (gelir, yatırım tutarı) nasıl okunmalı?">
                <p>Eğer bir kamu veya ön fizibilite raporunda net bir yatırım veya gelir tablosu belirtilmemişse, uygulama uluslararası güncel birim maliyetleri ve genel geçer pazar senaryolarını baz alarak yaklaşık tahminler (fallback algoritmaları) üretir. Bu tahminler, sahaların kendi aralarında karşılaştırılabilmesini sağlamak amacıyla oluşturulan jenerik değerlerdir ve piyasa koşullarına göre değişkenlik gösterebilir.</p>
              </InfoAccordion>
            </div>
          </article>
        </div></div>
        </div>
      </article>
      {modalImage && (
        <FullscreenImageModal
          isOpen={true}
          src={modalImage.src}
          title={modalImage.title}
          onClose={() => setModalImage(null)}
        />
      )}
    </section>
  );
}
