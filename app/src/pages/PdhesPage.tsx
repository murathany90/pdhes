import { useEffect, useMemo, useState, useRef } from 'react';
import { CONTENT_DEFAULTS, GLOSSARY } from '../utils/constants';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import FullscreenImageModal from '../components/ui/FullscreenImageModal';

interface PdhesPageProps {
  sectionId?: string;
}

export default function PdhesPage({ sectionId }: PdhesPageProps) {
  const [query, setQuery] = useState('');
  const getContent = useWorkspaceStore((state) => state.getContent);
  const filteredGlossary = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase('tr-TR');
    if (!needle) return GLOSSARY;
    return GLOSSARY.filter((item) =>
      `${item.term} ${item.definition}`.toLocaleLowerCase('tr-TR').includes(needle),
    );
  }, [query]);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSrc, setModalSrc] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  const openModal = (src: string, title: string) => {
    setModalSrc(src);
    setModalTitle(title);
    setModalOpen(true);
  };

  // Intersection Observer for TOC
  const [activeSection, setActiveSection] = useState<string>('');
  const contentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    
    const sections = Array.from(contentRef.current.querySelectorAll('.info-card'));
    
    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id);
            }
          });
        },
        { rootMargin: '-20% 0px -70% 0px', threshold: 0.01 }
      );

      sections.forEach((sec) => observer.observe(sec));
      return () => observer.disconnect();
    }
  }, []);

  // Handle external sectionId jumps (e.g. from routing)
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
          top: Math.max(0, target.offsetTop - 16),
          behavior: 'smooth',
        });
      } else if (typeof target.scrollIntoView === 'function') {
        target.scrollIntoView({ block: 'start', behavior: 'smooth' });
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [sectionId]);

  return (
    <section className="panel active pdhes-rich-shell" style={{ padding: 0 }}>
      <div className="hero">
        <div className="hero-card">
          <span className="badge">PDHES Nedir? · Geliştirilmiş içerik sekmesi</span>
          <h1>{getContent('pdhesWhatIs.title', CONTENT_DEFAULTS)}</h1>
          <p>
            Bu zenginleştirilmiş sekme, mevcut sitedeki “PDHES Nedir?” içeriğini genişletir: çalışma prensibi, sistem bileşenleri, çevrim verimi, şebeke kararlılığı, topoloji seçenekleri, Türkiye potansiyeli, gelir modeli ve fizibilite riskleri 10 ayrıntılı kart halinde anlatılır.
          </p>
          <div className="hero-stats">
            <div><b>%70-85</b><span>Tipik çevrim verimi aralığı</span></div>
            <div><b>2 mod</b><span>Pompalama ve üretim işletmesi</span></div>
            <div><b>MW + MWh</b><span>Güç ve enerji ayrı değerlendirilir</span></div>
            <div><b>10 kart</b><span>Detaylı görsel anlatım</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <img src="pdhes-nedir/img-0.webp" alt="PDHES çalışma prensibi" />
          <div className="overlay">
            <b>Okunabilir görseller:</b> Her karttaki görseli “Tam ekran oku” düğmesiyle büyütebilir, modal içinde yakınlaştırabilirsiniz.
          </div>
        </div>
      </div>

      <div className="layout">
        <aside className="toc" aria-label="İçindekiler">
          <h3>İçindekiler</h3>
          <p>Solda sabit kalan bu menü, orijinal site yapısındaki içindekiler mantığını korur. Sağ tarafta 10 ayrıntılı bilgi kartı yer alır.</p>
          <nav>
            <a href="#su-bataryasi" className={activeSection === 'su-bataryasi' ? 'active' : ''}><span>01</span>PDHES nedir? Şebeke ölçeğinde “su bataryası” mantığı</a>
            <a href="#sarj-desarj" className={activeSection === 'sarj-desarj' ? 'active' : ''}><span>02</span>İki yönlü çevrim: Pompalama modu ve üretim modu</a>
            <a href="#anatomi" className={activeSection === 'anatomi' ? 'active' : ''}><span>03</span>Sistem anatomisi: rezervuar, cebri boru, güç evi ve şalt sahası</a>
            <a href="#enerji-formulu" className={activeSection === 'enerji-formulu' ? 'active' : ''}><span>04</span>Enerji hesabının özü: düşü, hacim ve çevrim verimi</a>
            <a href="#sebeke-degeri" className={activeSection === 'sebeke-degeri' ? 'active' : ''}><span>05</span>Şebeke kararlılığı: yenilenebilir üretim artarken neden kritik?</a>
            <a href="#teknoloji-olgunluk" className={activeSection === 'teknoloji-olgunluk' ? 'active' : ''}><span>06</span>Neden stratejik? Olgun teknoloji, uzun ömür ve düşük kapasite kaybı</a>
            <a href="#topolojiler" className={activeSection === 'topolojiler' ? 'active' : ''}><span>07</span>Topoloji seçimi: kapalı çevrim, mevcut HES entegrasyonu ve deniz suyu modeli</a>
            <a href="#turkiye-potansiyeli" className={activeSection === 'turkiye-potansiyeli' ? 'active' : ''}><span>08</span>Türkiye açısından fırsat: topografya, hidro miras ve yenilenebilir dönüşüm</a>
            <a href="#piyasa-gelir" className={activeSection === 'piyasa-gelir' ? 'active' : ''}><span>09</span>Gelir modeli: arbitraj tek başına yeterli mi?</a>
            <a href="#riskler-yol-haritasi" className={activeSection === 'riskler-yol-haritasi' ? 'active' : ''}><span>10</span>Riskler, çevresel uyum ve ön etüt yol haritası</a>
            <a href="#sec-sozluk" className={activeSection === 'sec-sozluk' ? 'active' : ''}><span>Sözlük</span>Teknik Terimler Sözlüğü</a>
          </nav>
          <div className="toc-tools">
            <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑ Başa dön</button>
          </div>
        </aside>

        <main className="content" ref={contentRef}>
          <article className="info-card" id="su-bataryasi">
            <header className="card-head">
              <div className="number-pill">01</div>
              <div>
                <span className="eyebrow">Tanım ve temel fikir</span>
                <h2>PDHES nedir? Şebeke ölçeğinde “su bataryası” mantığı</h2>
              </div>
            </header>
            <figure className="figure-frame">
              <img src="pdhes-nedir/img-1.webp" alt="PDHES nedir? Şebeke ölçeğinde “su bataryası” mantığı görseli" loading="lazy" />
              <button className="fullscreen-btn" type="button" onClick={() => openModal('pdhes-nedir/img-2.webp', 'PDHES nedir? Şebeke ölçeğinde “su bataryası” mantığı')}>⛶ Tam ekran oku</button>
              <figcaption><b>Görsel:</b> PDHES’in gece/gündüz, pompalama/üretim ve üst-alt rezervuar ilişkisini özetleyen kavramsal kesit. <span>The Water Battery, s.1</span></figcaption>
            </figure>
            <div className="card-body">
              <p><strong>Pompaj Depolamalı Hidroelektrik Sistemler (PDHES)</strong>, farklı kotlarda bulunan iki su haznesi arasında enerji depolayan büyük ölçekli bir elektrik sistemi teknolojisidir. Sistem, elektriğin bol ve görece ucuz olduğu saatlerde alt rezervuardaki suyu pompalarla üst rezervuara taşır; talebin arttığı veya sistemin hızlı güce ihtiyaç duyduğu saatlerde ise aynı suyu aşağı bırakarak türbinler üzerinden elektrik üretir.</p>
              <p>Bu nedenle PDHES, kimyasal bir batarya değil; <strong>yerçekimi + su + elektromekanik makine</strong> birleşimiyle çalışan, şebeke ölçeğinde bir “su bataryasıdır”. Depolanan şey doğrudan elektrik değil, yüksek kotta bekletilen suyun <strong>potansiyel enerjisidir</strong>. Enerji gerektiğinde bu potansiyel enerji kinetik enerjiye, sonra mekanik enerjiye ve en sonunda elektrik enerjisine dönüşür.</p>
              <div className="note-grid">
                <div><b>Depolama biçimi</b><span>Yüksek kotta su hacmi</span></div>
                <div><b>Güç üretimi</b><span>Pompa-türbin + motor-jeneratör</span></div>
                <div><b>Temel değer</b><span>Uzun süreli depolama ve hızlı şebeke tepkisi</span></div>
              </div>
              <p>PDHES’in ayırt edici yönü, çok büyük enerji miktarlarını saatler hatta bazı tasarımlarda daha uzun süreler için depolayabilmesi; aynı zamanda senkron makinelerle şebekeye atalet, frekans desteği, gerilim desteği ve hızlı devreye girme kabiliyeti sağlayabilmesidir.</p>
            </div>
          </article>

          <article className="info-card" id="sarj-desarj">
            <header className="card-head">
              <div className="number-pill">02</div>
              <div>
                <span className="eyebrow">Çalışma prensibi</span>
                <h2>İki yönlü çevrim: Pompalama modu ve üretim modu</h2>
              </div>
            </header>
            <figure className="figure-frame">
              <img src="pdhes-nedir/img-3.webp" alt="İki yönlü çevrim: Pompalama modu ve üretim modu görseli" loading="lazy" />
              <button className="fullscreen-btn" type="button" onClick={() => openModal('pdhes-nedir/img-4.webp', 'İki yönlü çevrim: Pompalama modu ve üretim modu')}>⛶ Tam ekran oku</button>
              <figcaption><b>Görsel:</b> Şarj/pompalama ve deşarj/üretim yönlerinin aynı hidrolik makine üzerinden tersinir çalışması. <span>Turkey Water Battery Blueprint, s.3</span></figcaption>
            </figure>
            <div className="card-body">
              <p>PDHES iki ana işletme moduyla çalışır. <strong>Pompalama modunda</strong> sistem elektrik tüketir; alt rezervuardaki suyu üst rezervuara taşır. Bu mod genellikle gece düşük talep saatlerinde, güneş ve rüzgâr üretim fazlası oluştuğunda veya sistemin fazla baz yük üretimini değerlendirmesi gerektiğinde kullanılır.</p>
              <p><strong>Üretim modunda</strong> ise üst rezervuardaki su cebri boru veya tünel üzerinden aşağı bırakılır. Su, türbin çarkını döndürür; motor-jeneratör bu kez jeneratör gibi çalışarak şebekeye elektrik verir. Bu mod puant saatlerinde, ani talep artışlarında, frekans düşüşlerinde veya yenilenebilir üretimin azaldığı zamanlarda değerlidir.</p>
              <div className="split-box">
                <div className="mode charge"><h4>Şarj / Pompalama</h4><ul><li>Elektrik tüketir.</li><li>Su alt rezervuardan üst rezervuara çıkar.</li><li>Fazla yenilenebilir üretimi değerlendirir.</li><li>Enerji potansiyel enerji olarak saklanır.</li></ul></div>
                <div className="mode discharge"><h4>Deşarj / Üretim</h4><ul><li>Elektrik üretir.</li><li>Su üst rezervuardan alt rezervuara iner.</li><li>Puant talebi ve sistem açığını karşılar.</li><li>Frekans ve gerilim desteğine katkı verir.</li></ul></div>
              </div>
              <p>Bu döngüde kayıplar vardır; pompalama, hidrolik sürtünme, türbin, jeneratör, trafo ve yardımcı sistem kayıpları nedeniyle sisteme verilen elektriğin tamamı geri alınamaz. Modern PDHES tasarımlarında <strong>çevrim verimi genellikle yaklaşık %70-85</strong> aralığında ele alınır. Bu kayıp, elektrik fiyat farkı, yan hizmet geliri ve sistem güvenilirliği değeriyle telafi edilir.</p>
            </div>
          </article>

          <article className="info-card" id="anatomi">
            <header className="card-head">
              <div className="number-pill">03</div>
              <div>
                <span className="eyebrow">Mühendislik bileşenleri</span>
                <h2>Sistem anatomisi: rezervuar, cebri boru, güç evi ve şalt sahası</h2>
              </div>
            </header>
            <figure className="figure-frame">
              <img src="pdhes-nedir/img-5.webp" alt="Sistem anatomisi: rezervuar, cebri boru, güç evi ve şalt sahası görseli" loading="lazy" />
              <button className="fullscreen-btn" type="button" onClick={() => openModal('pdhes-nedir/img-6.webp', 'Sistem anatomisi: rezervuar, cebri boru, güç evi ve şalt sahası')}>⛶ Tam ekran oku</button>
              <figcaption><b>Görsel:</b> Üst rezervuar, cebri boru, motor-jeneratör ve tersinir Francis pompa-türbin yapısının kesit anlatımı. <span>The Water Battery, s.2</span></figcaption>
            </figure>
            <div className="card-body">
              <p>Bir PDHES projesi yalnızca iki göletten ibaret değildir. Gerçekte tesis; hidrolik, elektromekanik, jeoteknik, inşaat, şalt ve şebeke bağlantı sistemlerinden oluşan karmaşık bir altyapıdır. Ön inceleme aşamasında en önemli soru, bu bileşenlerin araziye ve şebekeye birlikte uyup uymadığıdır.</p>
              <ul className="rich-list">
                <li><strong>Üst rezervuar:</strong> Suyun potansiyel enerji olarak depolandığı yüksek kotlu haznedir. Aktif hacim, su seviyesi aralığı, sızdırmazlık, heyelan riski ve çevresel etkiler kritik parametrelerdir.</li>
                <li><strong>Alt rezervuar:</strong> Üretim sonrası suyun toplandığı ve pompalama sırasında su kaynağı olan haznedir. Mevcut baraj, göl, deniz veya yapay havuz olabilir.</li>
                <li><strong>Cebri boru / basınç tüneli:</strong> Yüksek basınçlı suyu türbine taşıyan ana hidrolik yoldur. Uzunluk, çap, eğim, sürtünme kayıpları ve su darbesi hesabı tasarımın merkezindedir.</li>
                <li><strong>Denge bacası:</strong> Ani yük değişimlerinde su darbesi basınçlarını azaltır, hidrolik geçici rejimi güvenli hale getirir.</li>
                <li><strong>Yeraltı güç evi:</strong> Pompa-türbin, motor-jeneratör, vanalar, trafolar ve yardımcı sistemlerin bulunduğu ana üretim merkezidir.</li>
                <li><strong>Şalt sahası ve iletim bağlantısı:</strong> Gücün TEİAŞ iletim sistemine aktarılmasını sağlar; bağlantı kapasitesi, kısa devre gücü, N-1 kriteri ve gerilim seviyesi burada belirleyicidir.</li>
              </ul>
            </div>
          </article>

          <article className="info-card" id="enerji-formulu">
            <header className="card-head">
              <div className="number-pill">04</div>
              <div>
                <span className="eyebrow">Temel mühendislik bağıntısı</span>
                <h2>Enerji hesabının özü: düşü, hacim ve çevrim verimi</h2>
              </div>
            </header>
            <figure className="figure-frame">
              <img src="pdhes-nedir/img-7.webp" alt="Enerji hesabının özü: düşü, hacim ve çevrim verimi görseli" loading="lazy" />
              <button className="fullscreen-btn" type="button" onClick={() => openModal('pdhes-nedir/img-8.webp', 'Enerji hesabının özü: düşü, hacim ve çevrim verimi')}>⛶ Tam ekran oku</button>
              <figcaption><b>Görsel:</b> PDHES’in hızlı rezerv yükleme ve frekans kontrolü sağlayan esnek şebeke kaynağı olarak konumlandırılması. <span>Turkey Strategic Hydro Battery, s.3</span></figcaption>
            </figure>
            <div className="card-body">
              <p>PDHES potansiyelini anlamak için en temel bağıntı, suyun yükseklik farkından doğan potansiyel enerji hesabıdır. Ön değerlendirme düzeyinde enerji şu mantıkla okunur:</p>
              <div className="formula-card"><span>E = ρ × g × H × V × η</span><small>ρ: su yoğunluğu · g: yerçekimi · H: net düşü · V: aktif hacim · η: verim</small></div>
              <p>Bu formül, aday sahanın neden yalnızca haritada “iki yakın su kütlesi” aramakla değerlendirilemeyeceğini gösterir. Aynı hacimde su, daha yüksek düşüde çok daha fazla enerji saklar. Ancak düşü arttıkça basınç tüneli, cebri boru, vana, denge bacası ve kaya mekaniği gereksinimleri de ağırlaşır.</p>
              <div className="note-grid four">
                <div><b>Net düşü</b><span>Brüt kot farkından hidrolik kayıplar düşülür.</span></div>
                <div><b>Aktif hacim</b><span>Kullanılabilir su hacmidir; toplam göl hacmiyle aynı değildir.</span></div>
                <div><b>Güç</b><span>Debi ve düşüyle ilişkilidir; MW kapasiteyi belirler.</span></div>
                <div><b>Enerji</b><span>Hacim ve düşüyle ilişkilidir; MWh/GWh depolamayı belirler.</span></div>
              </div>
              <p>Dolayısıyla bir adayın iyi olması için yüksek düşü tek başına yeterli değildir. Üst rezervuar inşası, alt rezervuar uygunluğu, hidrolik yol uzunluğu, şebeke bağlantısı, çevresel kısıtlar ve ekonomik gelir modeli birlikte elenmelidir.</p>
            </div>
          </article>

          <article className="info-card" id="sebeke-degeri">
            <header className="card-head">
              <div className="number-pill">05</div>
              <div>
                <span className="eyebrow">Sistem işletmesi ve esneklik</span>
                <h2>Şebeke kararlılığı: yenilenebilir üretim artarken neden kritik?</h2>
              </div>
            </header>
            <figure className="figure-frame">
              <img src="pdhes-nedir/img-9.webp" alt="Şebeke kararlılığı: yenilenebilir üretim artarken neden kritik? görseli" loading="lazy" />
              <button className="fullscreen-btn" type="button" onClick={() => openModal('pdhes-nedir/img-10.webp', 'Şebeke kararlılığı: yenilenebilir üretim artarken neden kritik?')}>⛶ Tam ekran oku</button>
              <figcaption><b>Görsel:</b> Yenilenebilir üretim ile tüketim eğrileri arasındaki saatlik uyumsuzluk ve “şebeke kararlılık boşluğu”. <span>Turkey Energy Balance Blueprint, s.2</span></figcaption>
            </figure>
            <div className="card-body">
              <p>Güneş ve rüzgâr üretimi arttıkça elektrik sisteminde yeni bir sorun büyür: üretimin olduğu saat ile tüketimin en yüksek olduğu saat her zaman aynı değildir. Gündüz güneş üretimi fazlayken akşam puantında üretim düşebilir; rüzgâr ise saatlik ve günlük dalgalanma gösterebilir. Bu durum sistemde <strong>esneklik ihtiyacı</strong> yaratır.</p>
              <p>PDHES bu boşluğu iki yönden kapatır: Fazla üretim olduğunda suyu yukarı basarak enerjiyi depolar; talep yükseldiğinde veya yenilenebilir üretim düştüğünde suyu aşağı bırakarak hızlı üretim yapar. Böylece yalnızca enerji arbitrajı değil, <strong>sistem güvenliği</strong> de sağlar.</p>
              <ul className="rich-list compact">
                <li><strong>Frekans kontrolü:</strong> Ani üretim/tüketim dengesizliklerinde hızlı aktif güç tepkisi verebilir.</li>
                <li><strong>Senkron atalet:</strong> Büyük dönen makineler frekans değişimini doğal olarak yavaşlatabilir.</li>
                <li><strong>Gerilim desteği:</strong> Reaktif güç ve gerilim kontrolüyle iletim sistemi kararlılığına katkı sağlar.</li>
                <li><strong>Kara başlatma:</strong> Uygun tasarımlarda sistem toparlama senaryolarında değerli olabilir.</li>
                <li><strong>Kısıntı azaltımı:</strong> RES/GES üretim fazlasının boşa gitmesini azaltabilir.</li>
              </ul>
              <p>Bu nedenle PDHES, yalnızca fiyat farkından para kazanan bir yatırım değil; yenilenebilir ağırlıklı elektrik sisteminde güvenilirliği, rezerv kapasitesini ve operasyonel esnekliği artıran bir altyapı unsuru olarak değerlendirilmelidir.</p>
            </div>
          </article>

          <article className="info-card" id="teknoloji-olgunluk">
            <header className="card-head">
              <div className="number-pill">06</div>
              <div>
                <span className="eyebrow">Teknolojik değer önerisi</span>
                <h2>Neden stratejik? Olgun teknoloji, uzun ömür ve düşük kapasite kaybı</h2>
              </div>
            </header>
            <figure className="figure-frame">
              <img src="pdhes-nedir/img-11.webp" alt="Neden stratejik? Olgun teknoloji, uzun ömür ve düşük kapasite kaybı görseli" loading="lazy" />
              <button className="fullscreen-btn" type="button" onClick={() => openModal('pdhes-nedir/img-12.webp', 'Neden stratejik? Olgun teknoloji, uzun ömür ve düşük kapasite kaybı')}>⛶ Tam ekran oku</button>
              <figcaption><b>Görsel:</b> PDHES’in kanıtlanmış olgunluk, şebeke atalet katkısı, RES entegrasyonu ve düşük döngüsel bozulma avantajları. <span>Türkiye Energy Battery Roadmap, s.2</span></figcaption>
            </figure>
            <div className="card-body">
              <p>PDHES’in stratejik değeri, teknolojik olgunluğundan gelir. Dünyada onlarca yıldır işletilen büyük pompaj depolama tesisleri vardır. Bu tesisler yalnızca günlük enerji kaydırma için değil; ani yük değişimleri, frekans sapmaları, iletim kısıtları ve puant yük yönetimi için de kullanılmaktadır.</p>
              <p>Kimyasal bataryalar hızlı tepki ve modüler kurulum avantajı sunarken, PDHES çok büyük enerji miktarı, uzun ekonomik ömür, düşük çevrimsel performans kaybı ve senkron makine katkısı ile farklı bir sınıfta yer alır. Bu iki teknoloji birbirinin birebir ikamesi değil, çoğu sistemde tamamlayıcısıdır.</p>
              <div className="comparison-mini">
                <div><h4>PDHES güçlüdür</h4><p>Uzun süreli depolama, büyük MW/MWh ölçeği, şebeke hizmetleri, senkron atalet, uzun ömür.</p></div>
                <div><h4>Batarya güçlüdür</h4><p>Hızlı kurulum, modülerlik, dağıtık kullanım, milisaniye seviyesinde güç elektroniği tepkisi.</p></div>
              </div>
              <p>Türkiye gibi topografyası güçlü, hidroelektrik mirası bulunan ve yenilenebilir kapasitesi hızla artan bir sistemde PDHES; yalnızca enerji üretimi değil, <strong>enerji dönüşümünün sigortası</strong> olarak düşünülmelidir.</p>
            </div>
          </article>

          <article className="info-card" id="topolojiler">
            <header className="card-head">
              <div className="number-pill">07</div>
              <div>
                <span className="eyebrow">Saha tipi ve yerleşim kararı</span>
                <h2>Topoloji seçimi: kapalı çevrim, mevcut HES entegrasyonu ve deniz suyu modeli</h2>
              </div>
            </header>
            <figure className="figure-frame">
              <img src="pdhes-nedir/img-13.webp" alt="Topoloji seçimi: kapalı çevrim, mevcut HES entegrasyonu ve deniz suyu modeli görseli" loading="lazy" />
              <button className="fullscreen-btn" type="button" onClick={() => openModal('pdhes-nedir/img-14.webp', 'Topoloji seçimi: kapalı çevrim, mevcut HES entegrasyonu ve deniz suyu modeli')}>⛶ Tam ekran oku</button>
              <figcaption><b>Görsel:</b> Mevcut HES ile bütünleşik model ve yeni yatırım/greenfield modelinin mühendislik yaklaşımı açısından karşılaştırılması. <span>Turkey Strategic Hydro Battery, s.6</span></figcaption>
            </figure>
            <div className="card-body">
              <p>PDHES için tek bir proje tipi yoktur. Sahanın jeolojisi, su kaynağı, çevresel kısıtları, iletim bağlantısı ve mevcut hidro altyapıya yakınlığı farklı topolojileri gündeme getirir. Bu sekmede adaylar değerlendirilirken PDHES tipi mutlaka açıkça belirtilmelidir.</p>
              <div className="type-grid">
                <article><h4>Kapalı çevrim</h4><p>Doğal nehir akışından büyük ölçüde ayrılan iki yapay/ayrık rezervuar arasında çalışır. Ekolojik akış etkisi daha yönetilebilir olabilir; ancak yeni rezervuar ve inşaat ihtiyacı yüksektir.</p></article>
                <article><h4>Açık / bütünleşik çevrim</h4><p>Mevcut baraj, göl veya HES altyapısından yararlanır. İnşaat ve izin avantajı doğabilir; fakat mevcut su rejimi, DSİ işletmesi ve mansap etkileri daha karmaşık hale gelir.</p></article>
                <article><h4>Deniz suyu PDHES</h4><p>Denizi alt rezervuar gibi kullanır. Uygun kıyı topografyasında güçlü bir seçenek olabilir; korozyon, biyolojik birikim ve deniz ekolojisi özel tasarım ister.</p></article>
              </div>
              <p>Ön elemede “iki su kütlesi arasındaki mesafe” yeterli değildir. Minimum düşü, maksimum hidrolik yol uzunluğu, tünel güzergâhı, arazi eğimi, rezervuar inşa edilebilirliği, taşkın güvenliği, şalt alanı ve bağlantı hattı birlikte düşünülmelidir.</p>
            </div>
          </article>

          <article className="info-card" id="turkiye-potansiyeli">
            <header className="card-head">
              <div className="number-pill">08</div>
              <div>
                <span className="eyebrow">Ulusal stratejik bağlam</span>
                <h2>Türkiye açısından fırsat: topografya, hidro miras ve yenilenebilir dönüşüm</h2>
              </div>
            </header>
            <figure className="figure-frame">
              <img src="pdhes-nedir/img-15.webp" alt="Türkiye açısından fırsat: topografya, hidro miras ve yenilenebilir dönüşüm görseli" loading="lazy" />
              <button className="fullscreen-btn" type="button" onClick={() => openModal('pdhes-nedir/img-16.webp', 'Türkiye açısından fırsat: topografya, hidro miras ve yenilenebilir dönüşüm')}>⛶ Tam ekran oku</button>
              <figcaption><b>Görsel:</b> NotebookLM görselinde Türkiye için vurgulanan 19,6 TWh gerçekleştirilebilir potansiyel iddiası ve Avrupa karşılaştırması. <span>Turkey Strategic Hydro Battery, s.7</span></figcaption>
            </figure>
            <div className="card-body">
              <p>Türkiye’nin PDHES açısından güçlü tarafı yalnızca dağlık topografya değildir. Ülkenin mevcut hidroelektrik altyapısı, çok sayıda rezervuarı, büyüyen rüzgâr/güneş portföyü, büyük tüketim merkezleri ve güçlü iletim sistemi yatırımları birlikte değerlendirildiğinde PDHES için stratejik bir pencere oluşur.</p>
              <p>Yüklenen NotebookLM görsellerinde Türkiye için çok yüksek bir gerçekleştirilebilir potansiyel anlatısı öne çıkarılmaktadır. Bu tür rakamlar kesin yatırım kararı değil, <strong>masaüstü potansiyel taraması</strong> olarak okunmalıdır. Gerçek proje portföyüne dönüşebilmesi için her adayın jeoloji, ÇED, DSİ işletmesi, TEİAŞ bağlantısı, piyasa geliri ve finansman açısından doğrulanması gerekir.</p>
              <div className="callout warning"><b>Önemli not:</b> Potansiyel haritaları “yapılabilir proje” listesi değildir. Her aday saha; kot, hacim, mesafe, mülkiyet, korunan alan, fay/heyelan, bağlantı kapasitesi ve gelir modeli açısından ayrı ayrı fizibilite sürecinden geçmelidir.</div>
              <p>Bu web sitesindeki aday veri seti de aynı mantıkla okunmalıdır: amaç kesin proje ilan etmek değil, Türkiye’de PDHES tartışmasını görselleştirmek, ön eleme kriterlerini anlatmak ve yatırım/planlama konuşmalarını veri tabanlı hale getirmektir.</p>
            </div>
          </article>

          <article className="info-card" id="piyasa-gelir">
            <header className="card-head">
              <div className="number-pill">09</div>
              <div>
                <span className="eyebrow">Ekonomi ve piyasa tasarımı</span>
                <h2>Gelir modeli: arbitraj tek başına yeterli mi?</h2>
              </div>
            </header>
            <figure className="figure-frame">
              <img src="pdhes-nedir/img-17.webp" alt="Gelir modeli: arbitraj tek başına yeterli mi? görseli" loading="lazy" />
              <button className="fullscreen-btn" type="button" onClick={() => openModal('pdhes-nedir/img-18.webp', 'Gelir modeli: arbitraj tek başına yeterli mi?')}>⛶ Tam ekran oku</button>
              <figcaption><b>Görsel:</b> Gece depolama, puant üretim, fiyat farkı ve yıllık net kâr yaklaşımını özetleyen finansal akış şeması. <span>Turkey Strategic Hydro Battery, s.13</span></figcaption>
            </figure>
            <div className="card-body">
              <p>PDHES yatırımının ekonomik mantığı çoğu zaman “ucuz saatte pompala, pahalı saatte üret” şeklinde anlatılır. Bu doğrudur; ancak büyük ölçekli projeler için çoğu durumda tek başına yeterli değildir. Çünkü PDHES’in yatırım maliyeti yüksek, izin ve inşaat süresi uzundur. Bu nedenle gelir modeli çoklu fayda üzerinden kurulmalıdır.</p>
              <ul className="rich-list compact">
                <li><strong>Enerji arbitrajı:</strong> Düşük fiyatlı saatlerde tüketim, yüksek fiyatlı saatlerde üretim.</li>
                <li><strong>Dengeleme piyasası:</strong> Gerçek zamanlı sistem dengesizliklerinde hızlı yük alma/yük atma kabiliyeti.</li>
                <li><strong>Yan hizmetler:</strong> Frekans kontrolü, reaktif güç, gerilim desteği, yedek kapasite ve kara başlatma değeri.</li>
                <li><strong>Kapasite değeri:</strong> Emre amade ve güvenilir esnek kapasitenin sistem planlamasındaki katkısı.</li>
                <li><strong>Kısıntı azaltımı:</strong> Yenilenebilir üretimin sistem kısıtı nedeniyle azaltılmasını önleyerek dolaylı ekonomik değer yaratması.</li>
              </ul>
              <p>Bu nedenle Türkiye için PDHES tartışması yalnızca santral bazlı fizibilite değil, aynı zamanda <strong>piyasa tasarımı</strong> sorusudur. Yatırım sinyali, yan hizmet gelirleri, kapasite mekanizması, DGP/yan hizmet ürün süreleri ve uzun vadeli sistem esnekliği planlaması birlikte ele alınmalıdır.</p>
            </div>
          </article>

          <article className="info-card" id="riskler-yol-haritasi">
            <header className="card-head">
              <div className="number-pill">10</div>
              <div>
                <span className="eyebrow">Fizibiliteye geçmeden önce</span>
                <h2>Riskler, çevresel uyum ve ön etüt yol haritası</h2>
              </div>
            </header>
            <figure className="figure-frame">
              <img src="pdhes-nedir/img-19.webp" alt="Riskler, çevresel uyum ve ön etüt yol haritası görseli" loading="lazy" />
              <button className="fullscreen-btn" type="button" onClick={() => openModal('pdhes-nedir/img-20.webp', 'Riskler, çevresel uyum ve ön etüt yol haritası')}>⛶ Tam ekran oku</button>
              <figcaption><b>Görsel:</b> Çevresel etki değerlendirmesi, sosyal kabul, su/ekosistem ve proje geliştirme boyutlarını birlikte gösteren uyum şeması. <span>Turkey Strategic Hydro Battery, s.14</span></figcaption>
            </figure>
            <div className="card-body">
              <p>PDHES temiz ve uzun ömürlü bir depolama altyapısı olabilir; ancak her saha otomatik olarak uygun değildir. Büyük su yapıları, tüneller, yeraltı güç evi, iletim bağlantısı ve rezervuar inşası ciddi çevresel, sosyal ve jeoteknik değerlendirme gerektirir.</p>
              <div className="check-flow">
                <div><span>1</span><b>Topoğrafya</b><small>Yeterli net düşü ve makul hidrolik yol var mı?</small></div>
                <div><span>2</span><b>Hacim</b><small>Aktif depolama hacmi hedef MWh için yeterli mi?</small></div>
                <div><span>3</span><b>Jeoloji</b><small>Fay, karst, heyelan, kaya kalitesi ve sızdırmazlık uygun mu?</small></div>
                <div><span>4</span><b>Çevre</b><small>ÇED, korunan alan, su rejimi, ekolojik akış ve sosyal kabul yönetilebilir mi?</small></div>
                <div><span>5</span><b>Şebeke</b><small>Bağlantı noktası, gerilim seviyesi, kısa devre gücü ve N-1 uygun mu?</small></div>
                <div><span>6</span><b>Ekonomi</b><small>CAPEX, OPEX, arbitraj, yan hizmet ve kapasite değeri dengeli mi?</small></div>
              </div>
              <p>Bu sayfadaki anlatımın en önemli amacı, PDHES’i abartılı bir “her derde çare” teknolojisi gibi değil; güçlü ama titiz planlama isteyen bir <strong>stratejik şebeke altyapısı</strong> olarak konumlandırmaktır.</p>
              <div className="callout danger"><b>Fizibilite uyarısı:</b> Bu site ve bu sekme eğitim/ön inceleme amaçlıdır. Gerçek rezervuar sınırları, kotlar, tünel güzergâhı, kurulu güç, enerji hacmi, bağlantı uygunluğu ve yatırım kararı için mühendislik etüdü, DSİ/TEİAŞ görüşleri, ÇED ve saha ölçümleri gerekir.</div>
            </div>
          </article>

          {/* Glossary Section from old PdhesPage */}
          <article className="info-card" id="sec-sozluk">
            <h2 style={{ marginTop: 0 }}>Teknik Terimler Sözlüğü</h2>
            <p style={{ marginTop: '8px', color: 'var(--muted)' }}>PDHES ve enerji depolama dünyasında sıkça kullanılan terimlerin açıklamaları:</p>
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
              <table style={{ margin: 0, width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ position: 'sticky', top: 0, background: 'var(--panel3)' }}>
                  <tr><th style={{ padding: '12px', textAlign: 'left' }}>Terim</th><th style={{ padding: '12px', textAlign: 'left' }}>Açıklama</th></tr>
                </thead>
                <tbody>
                  {filteredGlossary.map((item) => (
                    <tr key={item.term} style={{ borderBottom: '1px solid var(--line)' }}>
                      <td style={{ padding: '12px', width: '30%' }}><b>{item.term}</b></td>
                      <td style={{ padding: '12px' }}>{item.definition}</td>
                    </tr>
                  ))}
                  {filteredGlossary.length === 0 && (
                    <tr>
                      <td colSpan={2} style={{ padding: '24px', textAlign: 'center', color: 'var(--muted)' }}>
                        Sonuç bulunamadı.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </article>

        </main>
      </div>

      <FullscreenImageModal 
        isOpen={modalOpen} 
        src={modalSrc} 
        title={modalTitle} 
        onClose={() => setModalOpen(false)} 
      />
    </section>
  );
}
