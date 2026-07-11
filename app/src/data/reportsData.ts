export interface ReportItem {
  id: string;
  title: string;
  category: 'report' | 'summary' | 'news';
  author: string;
  publishDate: string;
  readTime?: number;
  coverImage?: string;
  summary: string;
  content: string;
}

export const REPORTS_DATA: ReportItem[] = [
  {
    id: 'battery-lobby-and-psh',
    title: 'Batarya İllüzyonu ve Pompaj Depolamalı HES (PDHES) Gerçeği',
    category: 'report',
    author: 'Sistem Araştırma Modülü',
    publishDate: '2026-07-07',
    readTime: 8,
    coverImage: '/pdhes-nedir/kapak1.png',
    summary: 'Türkiye\'nin enerji depolama politikalarındaki zafiyetler, lobi faaliyetlerinin etkileri ve küresel PDHES stratejileriyle karşılaştırmalı analizi.',
    content: `# Türkiye'nin Enerji Depolama Politikalarında Stratejik Zafiyet: Batarya İllüzyonu ve Pompaj Depolamalı HES (PDHES) Gerçeği

**Giriş ve Mevzuatın Mevcut Durumu (EDT/EDÜ)**
Türkiye’nin enerji dönüşüm stratejisi, ne yazık ki teknolojik tarafsızlıktan uzaklaşarak spesifik bir "kimyasal depolama" fetişizmine hapsolmuş durumdadır. Enerji Piyasası Düzenleme Kurumu (EPDK) tarafından şekillendirilen Elektrik Depolama Tesisi (EDT) ve Elektrik Depolama Ünitesi (EDÜ) mevzuatları, kâğıt üzerinde teknoloji bağımsız bir illüzyon yaratsa da fiiliyatta yalnızca lityum-iyon batarya sistemlerini destekleyecek şekilde kurgulanmıştır. Dünyada uzun süreli enerji depolamanın ve şebeke esnekliğinin omurgasını oluşturan, uluslararası ölçekte %90'ın üzerinde pazar payına sahip Pompaj Depolamalı Hidroelektrik Santralleri (PDHES) ise bu düzenlemelerin kasıtlı ya da vizyonsuz bir biçimde tamamen dışında bırakılmıştır. Mevzuatın bu denli kısa süreli batarya depolamasına odaklanması, Türkiye'nin kendi eşsiz topografik ve hidrolojik avantajlarını elinin tersiyle itmesi anlamına gelmekte; artan rüzgâr ve güneş kapasitesinin yaratacağı şebeke dalgalanmalarına karşı ülkeyi derin ve tehlikeli bir enerji politikası zafiyetiyle baş başa bırakmaktadır.

**Küresel Pompaj Depolama Stratejileri (Çin, Japonya, ABD, İtalya Örnekleri)**
Türkiye'nin düştüğü bu stratejik körlüğün aksine, değişken yenilenebilir enerji üretimindeki agresif büyümeyi yönetmek zorunda olan küresel güçler, rotayı çoktan yeniden "su bataryalarına" çevirmiştir. Bugün Çin, planlı ekonomi, kapasite ödemeleri ve iletim tarifesine yansıtılan maliyet geri kazanım modelleriyle 600 GW'ı aşan bir PDHES geliştirme hattının tartışmasız lokomotifidir. Japonya, coğrafi kısıtlarına rağmen nükleer ve yenilenebilir enerjisini dengelemek için on yıllardır devasa PDHES kapasitesini şebekenin ana sigortası olarak kullanmaktadır. ABD, federal vergi kredileri ve piyasa erişimi (enerji arbitrajı ve yan hizmetler) yoluyla eski tesisleri modernize edip yenilerini teşvik ederken; İtalya ve genel olarak Avrupa Birliği, enerji arz güvenliğini ithal lityum tedarik zincirine mahkûm etmenin risklerini görerek sınır ötesi devasa su bataryası projelerini stratejik altyapı kabul etmektedir. Bu ülkeler, hidroelektrik potansiyellerini şebeke esnekliği için kalkan yaparken, Türkiye'nin elindeki potansiyeli spesifik regülasyon eksikliği nedeniyle atıl bırakması kabul edilemez bir yönetim zaafiyetidir.

**Türkiye'deki Lobi Faaliyetleri ve Teknoloji Tercihleri**
Bu stratejik sapmanın temelinde yalnızca bürokratik atalet değil, enerji piyasasını domine eden dar görüşlü ticari çıkarlar yatmaktadır. Türkiye'de depolama mevzuatının ve teşvik mimarisinin "batarya lobisi" olarak adlandırılabilecek pil üreticileri, invertör tedarikçileri ve kısa vadeli kâr marjlarına odaklanan EPC (Mühendislik, Tedarik ve Kurulum) firmaları tarafından tahakküm altına alındığı açık bir gerçektir. Bu lobinin oluşturduğu rüzgârla, faydalı ömrü 10-15 yılla sınırlı, hammadde bakımından dışa bağımlı ve yangın/geri dönüşüm riskleri taşıyan kimyasal bataryalara yasal zemin ve kapasite tahsisi "jet hızıyla" sağlanırken; ömrü 50 ila 80 yıl arasında değişen, yüksek yerlilik oranına sahip ve şebekeye devasa bir mekanik atalet sağlayan PDHES'ler hantal bürokrasinin dehlizlerinde boğulmaktadır. Devletin uzun vadeli enerji politikası ve arz güvenliği, ithal teknoloji mümessillerinin ticari ajandalarına teslim edilemez.

**Gökçekaya Projesi ve Teşvik (YEKDEM) Çelişkileri**
Sistemdeki bu akıl tutulmasının en somut ve acı kanıtı, EÜAŞ tarafından 2020 yılında büyük bir vizyonla duyurulan 1 milyar dolarlık Gökçekaya PDHES projesinin akıbetidir. Şebekenin şiddetle ihtiyaç duyduğu bu devasa kapasite, yıllardır yatırım kararı alınamadan kâğıt üzerinde bekletilirken; batarya entegreli rüzgâr ve güneş santrallerine önlisans süreçlerinde öncelik tanınması ve kapasite tahsislerinin hızla yapılması devasa bir çelişkidir. Şebekeye milisaniyelik tepki verecek kimyasal bataryaların gerekliliği elbette yadsınamaz; ancak koca bir ülkenin baz yük esnekliğini ve uzun süreli (saatler/günler boyu) dengeleme ihtiyacını Gökçekaya, Altınkaya gibi dev projeleri rafa kaldırıp yalnızca ithal batarya konteynerleriyle çözmeye çalışmak mühendislik bilimine aykırıdır. Batarya yatırımlarına sağlanan regülatif kolaylıklar ve entegre YEKDEM teşvikleri, neden yerli müteahhitlik ve elektromekanik gücüyle inşa edilecek stratejik PDHES yatırımlarından esirgenmektedir?

**Sonuç ve Politika Önerileri**
Sonuç itibarıyla Türkiye, 2035 yılı için belirlediği net sıfır ve yüksek yenilenebilir enerji hedeflerine salt kimyasal bataryalara bel bağlayarak ulaşamaz. Mevcut EDT/EDÜ mevzuatlarının yarattığı teknolojik asimetri ve ithalat bağımlılığı derhal kırılmalıdır. PDHES'ler mevzuatta sadece "klasik hidroelektrik" veya "genel depolama" başlığı altında bir kenara atılmamalı; acilen **"uzun süreli stratejik sistem esnekliği altyapısı"** statüsünde, kendine has kural setiyle yeniden tanımlanmalıdır. Karar alıcılar; kapasite ödeme mekanizmalarını, uzun vadeli yan hizmetler sözleşmelerini ve iletim tarifelerini PDHES projelerini bankalar nezdinde finanse edilebilir kılacak şekilde hızla dizayn etmelidir. Türkiye'nin enerji bağımsızlığı ve şebeke güvenliği, batarya lobisinin kısa vadeli kâr hırslarına kurban edilemeyecek kadar hayati bir meseledir; şebekemizin sigortası olacak su bataryaları için milli bir yatırım seferberliği başlatılması artık bir seçenek değil, ertelenemez bir zorunluluktur.`
  },
  {
    id: 'enerji-depolamada-ezber-bozan-gercekler',
    title: 'Enerji Depolamada Ezber Bozan Gerçekler: Neden Sadece Bataryalar Yetmeyecek?',
    category: 'report',
    author: 'Sistem Araştırma Modülü',
    publishDate: '2026-07-11',
    readTime: 6,
    coverImage: '/pdhes-nedir/img-ezber-bozan.png',
    summary: 'Yenilenebilir enerjinin depolama paradoksu, lityum-iyon bataryalar ile Pompaj Depolamalı Hidroelektrik Santraller (PDHES) arasındaki ölçek farkı ve Gökçekaya projesinin stratejik önemi.',
    content: `Enerji Depolamada Ezber Bozan Gerçekler: Neden Sadece Bataryalar Yetmeyecek?

Yenilenebilir Enerjinin "Depolama Paradoksu"

28 Nisan 2025 tarihinde İber Yarımadası’nda ışıklar ansızın söndü. İspanya’nın güneyinde başlayan ve saniyeler içinde Portekiz’e yayılan bu zincirleme arıza, Avrupa’nın son yirmi yılda gördüğü en şiddetli şebeke krizlerinden biri olarak tarihe geçti. Trenlerin durduğu, hastanelerin sarsıldığı bu karanlık saatler, modern enerji stratejimizin kalbindeki o can alıcı soruyu sormamıza neden oldu: Değişken yenilenebilir kaynaklar üzerine bir sistem inşa edip "depolama" ihtiyacını bir yan unsur olarak görürseniz ne olur?

Küresel enerji talebinin 2018'de %2,3 artması ve buna bağlı olarak CO2 emisyonlarının %1,7 yükselmesi, dünyayı kritik bir eşiğe getirdi. Küresel ısınmayı 2°C'nin altında tutmak için 2030'a kadar emisyonları %25 azaltmak zorundayız. Türkiye, bu vizyonla 20 GW rüzgar enerjisi hedefi koymuş durumda. Ancak rüzgarın belirsiz doğası, depolamayı bir "tercih" olmaktan çıkarıp, şebeke güvenilirliği için teknik bir zorunluluk haline getiriyor.

Ölçek Farkı: Dinorwig vs. BESS (Devasa Kapasite Gerçeği)

Enerji dünyasında "batarya" terimi genellikle tek bir teknolojiyi simgeliyor gibi kullanılsa da, bu büyük bir yanılgıdır. Lityum iyon batarya sistemleri (BESS) ile Pompaj Depolamalı Hidroelektrik Santraller (PDHES) farklı liglerde oynar. Kuzey Galler’deki Elidir Fawr dağının içine oyulmuş olan Dinorwig Santrali, bu ölçek farkının en çarpıcı kanıtıdır.

Dinorwig, 1.728 MW güç ve tam 9,1 GWh depolama kapasitesine sahiptir. 2025 yılı itibarıyla Birleşik Krallık’ın en büyük batarya projesinin 600 MWh kapasiteye ulaştığı düşünüldüğünde, Dinorwig tek başına en büyük bataryadan 15 kat daha büyüktür. Bu fark, fonksiyonları da belirler: BESS milisaniyeler içinde şebekeyi dengelerken, PDHES saatler ve hatta günler boyu süren devasa enerji ihtiyacını karşılayan bir "enerji demiri" görevi görür.

Birleşik Krallık'ta uzun süredir durma noktasında olan depolama yatırımları, Ofgem'in "cap-and-floor" (tavan ve taban fiyat) mekanizmasının devreye girmesiyle yeniden canlandı. Bu model, yatırımcılara gelir tabanı garantisi sağlayarak riskleri minimize etmiş ve İskoçya’da 8 GW’lık yeni bir PDHES projesi hattının oluşmasını tetiklemiştir.

Gökçekaya: Türkiye’nin Uyuyan Devi

Türkiye, Avrupa'nın en yüksek PDHES potansiyeline sahip olmasına rağmen henüz bu alanda çalışan bir tesise sahip değil. Japonya Uluslararası İşbirliği Ajansı (JICA) tarafından fizibilite çalışmaları tamamlanan Gökçekaya PDHES projesi, stratejik bir öneme sahip. Karışık Tam Sayılı Doğrusal Programlama (MILP) yöntemiyle gerçekleştirilen optimizasyon analizleri, bu projenin teknik ve finansal verimliliği hakkında ezber bozan sonuçlar sunuyor:

* Kapasite ve Yapı: 1400 MW toplam güç (4 adet 350 MW Francis tipi reversible ünite).
* Operasyonel Aralık: Üst rezervuarda 770m ile 800m su seviyesi arasında esnek çalışma.
* Verimlilik Mühendisliği: Sisteme ana ünitelerin yanında 60-100 MW kapasiteli küçük bir pompa ünitesinin eklenmesi, özellikle düşük enerji farklarının (low energy differences) olduğu durumlarda sistemin verimliliğini dramatik şekilde optimize etmektedir.

Analizlerin en şaşırtıcı bulgusu ise "Ocak Ayı Sürprizi"dir. MILP optimizasyonu sonuçlarına göre, Gökçekaya modelinde Ocak ayı operasyonları, Ağustos ayına göre daha karlıdır. Bu durum soğuk havalardan ziyade, kış aylarındaki elektrik piyasası fiyatlarının (market clearing price) sergilediği yüksek volatiliteden kaynaklanır. PDHES, fiyat dalgalanmalarını arbitraj yeteneğiyle kâra dönüştürme konusunda bataryalardan çok daha derin bir kapasite sunar.

Rakip Değil, Ortak: PDHES ve Bataryaların Simbiyotik İlişkisi

İberya’daki kesinti, sadece depolamanın değil, depolama çeşitliliğinin önemini kanıtladı. Kesinti anında PDHES üniteleri sistemi tek başına kurtaramadı; çünkü suyun türbinlere ulaşması ve sistemin tepki vermesi saniyeler sürer. Oysa şebekenin o kritik saniyede "milisaniyelik" bir müdahaleye ihtiyacı vardı.

Burada bir "vücut" benzetmesi yapmak mümkündür: BESS şebekenin sinir sistemidir; milisaniyeler içinde tepki vererek anlık şokları emer (fast frequency response). PDHES ise şebekenin kas sistemidir; saatler boyu süren yükü sırtlar ve bulk güç yönetimini sağlar. Türkiye’nin 20 GW’lık rüzgar yükünü stabilize etmek için bu iki teknolojinin simbiyotik ilişkisine ihtiyacı var.

APREN Başkanı'nın Portekiz Enerji Depolama Forumu'nda vurguladığı gibi: "Ülke belirleyici bir momenttedir ve depolama, ulusal enerji önceliklerinin merkezi olan tek noktadır."

Asıl Engel Teknoloji Değil, Piyasa Tasarımı

Ember verilerine göre, şebeke ölçeğindeki (utility-scale) BESS maliyetlerinin 125 \$/kWh seviyelerine gerilemesi, teknolojinin "pahalı" olduğu mitini yıktı. Ancak bir enerji stratejisti için asıl mesele ekipman maliyeti değil, sermaye maliyetidir.

Teknoloji Hazır, Mevzuat Tutuk Lityum iyon fiyatları düşse de, Portekiz gibi ülkelerde bankalanabilir bir gelir çerçevesinin (revenue framework) eksikliği yatırımları frenliyor. Teknik olarak mümkün olan bir projenin finanse edilebilir olması için piyasa tasarımının netleşmesi şarttır.

Finansmanın Görünmez Engeli: WACC Yatırım kararlarındaki asıl belirleyici faktör, Ağırlıklı Ortalama Sermaye Maliyeti'dir (WACC). Portekiz’de bu oran %8-9 seviyelerindeyken, İngiltere’deki "cap-and-floor" gibi mekanizmalar sayesinde oran %5,5-6,5 bandına çekilebilmiştir. Bu fark, milyar dolarlık enerji projelerinde "başarı" ile "iflas" arasındaki çizgiyi belirler. Türkiye’nin sadece mühendislik çözümlerine değil, riskleri yöneten finansal modellere odaklanması gerekmektedir.

Sonuç: Geleceğin Şebekesini Kim Yönetecek?

Türkiye, Avrupa'nın en büyük pompaj depolama potansiyeline sahip olup da henüz kurulu bir tesisi bulunmayan tek büyük ekonomi. Gökçekaya gibi projeler sadece rüzgarın değişkenliğini dengelemekle kalmayacak, aynı zamanda enerji ithalatına olan bağımlılığımızı yapısal olarak azaltacaktır.

Geleceğin şebekesini, sadece en çok yenilenebilir enerji kaynağına sahip olanlar değil, bu kaynakları en akıllı ve en büyük ölçekte saklayabilenler yönetecektir. Cevaplanması gereken asıl soru şudur: Enerji bağımsızlığımızı sadece kaynakları çeşitlendirerek mi, yoksa o kaynakları saklama yeteneğimizi optimize ederek mi kazanacağız?
`
  },
  {
    id: 'pdhes-investment-finance',
    title: 'PDHES Yatırım, Finansman ve Risk Analizi',
    category: 'report',
    author: 'Sistem Araştırma Modülü',
    publishDate: '2026-07-07',
    readTime: 15,
    coverImage: '/pdhes-nedir/img-13.webp',
    summary: 'Pompaj depolamalı HES projelerinin yüksek başlangıç maliyetleri, gelir mekanizmaları, risk faktörleri ve kamu/özel sektör finansman modellerinin detaylı analizi.',
    content: `# Dünyada ve Türkiye'de PDHES Yatırımlarının Politik, Ekonomik ve Stratejik Analizi

## Yönetici özeti

Pompaj depolamalı hidroelektrik santraller bunun ardından kısaca **PDHES** olarak anılacaktır. Dünyada PDHES yatırımlarının yeniden hızlanmasının ana nedeni, rüzgâr ve güneşin çok hızlı büyümesine karşı uzun süreli esneklik, sistem dengesi, atalet, frekans kontrolü ve pik talep yönetimi ihtiyacının aynı hızda büyümesidir. Uluslararası Hidroelektrik Birliği verilerine göre küresel pompaj depolama kurulu gücü 2025 itibarıyla 200 GW eşiğini aşmış, küresel geliştirme hattı 600 GW’ı geçmiş ve Çin bu büyümenin açık ara lokomotifi olmuştur. IEA, JRC ve IHA kaynakları da PDHES’in bugün hâlâ büyük ölçekli ve uzun süreli elektrik depolamanın baskın teknolojisi olduğunu vurgulamaktadır. 

Küresel teşvik mimarisi üç farklı yola ayrılıyor. Çin, planlama + kapasite ödemesi + iletim tarifesine yansıtılan maliyet geri kazanımı üzerinden son derece “yatırım yapılabilir” bir model kurdu. ABD, federal düzeyde daha çok **piyasa erişimi ve vergi kredisi** yaklaşımını izliyor; gelirler ağırlıkla enerji arbitrajı, yan hizmetler ve varsa bölgesel kapasite piyasalarından geliyor. Avrupa Birliği ise birlik düzeyinde storage’a açık kapasite mekanizmalarını ve esneklik odaklı piyasa reformunu meşrulaştırıyor; fakat fiilî yatırım sinyali ülke bazında veriliyor. Bu çerçevede Birleşik Krallık’ın cap-and-floor rejimi ve İspanya’nın 2026’da onaylanan kapasite mekanizması, Avrupa’daki en somut iki örnek olarak öne çıkıyor. 

Türkiye’de ise resmî politika belgeleri PDHES’i açık biçimde destekliyor; On İkinci Kalkınma Planı ve Enerji ve Tabii Kaynaklar Bakanlığı performans-program belgeleri “pompaj depolamalı HES’ler dâhil enerji depolama” yaklaşımını benimsemiş durumda. Buna karşılık mevcut uygulama mimarisi daha çok **batarya depolama**, **depolamalı RES lisansları**, **talep tarafı katılımı**, **toplayıcılık** ve **şebeke esnekliği** başlıklarında olgunlaşıyor. TEİAŞ’ın 2026 tarihli yan hizmet teknik kriterlerinin PDHES’i kapsam dışı bırakması ise, Türkiye’de bugün depolama mevzuatının fiilen elektrokimyasal ve müstakil elektrik depolama ekseninde ilerlediğini; PDHES için ayrı ve bankable bir piyasa tasarımının henüz tamamlanmadığını gösteriyor. 

Bu nedenle Türkiye açısından temel sonuç şudur: **PDHES ihtiyacı teknik olarak güçleniyor, politik olarak tanınıyor, fakat ekonomik-regülatif çerçeve henüz yatırımcının finansman kapatabileceği olgunluğa ulaşmış değil.** Özellikle 2035’te rüzgâr ve güneşte 120 GW hedefi ve 2035’e kadar 510,5 TWh elektrik talebi beklentisi dikkate alındığında, PDHES artık “alternatif bir teknoloji” değil; uzun süreli sistem esnekliğinin stratejik unsurlarından biri olarak düşünülmelidir. 

## Küresel politika mimarisi

### Çin

Çin’in PDHES yaklaşımı dünyanın en güçlü kamu-politika sinyalini üreten modelidir. Ulusal Enerji İdaresi’nin 2021–2035 Orta ve Uzun Vadeli Pompaj Depolama Planı, pompaj depolamayı “teknolojisi en olgun, ekonomikliği en uygun ve büyük ölçekli geliştirmeye en elverişli” esnek kaynak olarak tanımlıyor; 2025 için en az 62 GW, 2030 için yaklaşık 120 GW ve 2035 için yüksek oranlı yenilenebilir gelişimini destekleyecek modern bir sanayi-ekosistemi hedefliyor. 2026 tarihli resmî NEA aktarımı da 2025 hedefinin tamamlandığını ve 2030 hedefinin korunarak ilerlediğini belirtiyor. 

Çin’de en kritik regülatif mekanizma, 2021 tarihli NDRC fiyatlandırma görüşüyle netleşen **iki parçalı tarife** yapısıdır. Buna göre pompaj depolamanın kapasite bedeli devletçe belirleniyor, ilgili kapasite ödemesi şebeke işletmecisi tarafından karşılanıyor ve eyalet düzeyindeki iletim-dağıtım tarifesine yansıtılarak geri kazanılıyor. Aynı çerçevede santralin piyasa gelirleri ile kapasite geliri arasında da bir paylaşım mekanizması kuruluyor; yardımcı hizmet ve piyasa gelirlerinin bir kısmı yatırımcıda kalırken bir kısmı sonraki düzenleme döneminde kapasite tarifesinden mahsup ediliyor. Sonraki politika açıklamaları da bu yapının zamanla daha fazla piyasa gelirine evrilmesini hedeflediğini teyit ediyor. Bu, erken dönem finansman riskini düşürürken orta vadede piyasalaşma alanı açan hibrit bir modeldir. 

Bu modelin sonucu bugün açıkça görülüyor. Çin’in resmî ve yarı-resmî kaynaklarında PDHES, “yeni tip güç sisteminin” omurga esneklik kaynağı olarak sunuluyor. 2025 sonu itibarıyla ülkenin işletmedeki pompaj depolama kapasitesi 61 GW seviyesini aşarken, IHA verilerine göre yalnızca Çin’de inşa hâlindeki pompaj depolama kapasitesi 200 GW’ın üzerine çıkmış durumda. Bu ölçekte yatırımın motivasyonu yalnızca pik yük yönetimi değil; rüzgâr ve güneşin hızla sisteme eklenmesi, yenilenebilir kısıntılarının azaltılması, frekans ve gerilim kararlılığı, enerji güvenliği, yerli ekipman sanayii ve ekonomik canlandırma işlevlerinin birlikte görülmesidir. NEA’nın eyaletlere “uygunsa onayla, uygunsa başlat” yaklaşımı vermesi de bu nedenle önemlidir. 

### ABD

ABD’de PDHES için Çin benzeri tekil bir kamu alım modeli yoktur. Sistemin omurgası, FERC’in 841 sayılı emriyle depolama kaynaklarının RTO/ISO piyasalarında **enerji, kapasite ve yan hizmetlerin tamamına teknik yeterlilikleri ölçüsünde katılabilmesi** üzerine kurulmuştur. Başka bir ifadeyle ABD yaklaşımı, kapasite ödemesini garanti eden bir “PDHES tarifesi” yaratmak yerine, depolamayı toptan piyasalarda tam katılımcı hâline getirmeye çalışır. 

Bu nedenle ABD’de PDHES’in gelir modeli tipik olarak üçlü bir “revenue stack”tir: enerji arbitrajı, yardımcı hizmetler ve yalnızca bazı bölgelerde mevcut olan kapasite piyasası gelirleri. PNNL’nin uzun süreli depolama telafi mekanizmaları çalışması, ABD’de utility-scale depolamanın yaklaşık yüzde 90’ının hâlâ pumped storage olduğunu; buna rağmen yeni PSH yatırımlarının, tek başına enerji arbitrajının çoğu zaman yeterli olmaması ve gelir belirsizliği nedeniyle zorlandığını ortaya koyuyor. ISO-NE’nin Forward Capacity Market’i, PJM’nin RPM yapısı ve NYISO’nun ICAP pazarı, depolama için ilave gelir kanalı yaratabilen örneklerdir; ancak bu yapı ülke çapında tek tip değildir. CAISO gibi energy-only ağırlıklı pazarlarda ise gelirler daha çok enerji ve ancillary services üzerinden oluşur; CAISO ayrıca pump storage için doğrudan katılım modelini korumaktadır. 

Son yıllardaki en önemli federal kolaylaştırıcı unsur vergi kredileridir. IRS ve Treasury açıklamalarına göre temiz elektrik yatırım kredisi, 31 Aralık 2024 sonrasında devreye giren energy storage technology yatırımlarını kapsıyor; enerji depolama teknolojileri federal yatırım kredisi mimarisi içinde açıkça tanınmış durumda. Bu, ABD’de PDHES için doğrudan gelir garantisi yaratmasa da ilk yatırım maliyetinin finansmanında önemli bir destek sağlıyor. DOE de uzun süreli depolamayı şebeke güvenilirliği ve dayanıklılığı için stratejik bir alan olarak tanımlıyor. 

Buna rağmen ABD modelinin ana zayıflığı lisanslama ve izin sürecidir. FERC, America’s Water Infrastructure Act sonrası kapalı çevrim pumped storage projeleri için hızlandırılmış süreç kurmuş ve tamamlanmış başvurularda iki yıl içinde karar hedefi koymuştur; ancak DOE ve PNNL çalışmaları, birçok kapalı çevrim PSH teklifinin lisanslama-permitting zincirinde erken aşamada elendiğini, belirsizliklerin sürdüğünü göstermektedir. Dolayısıyla ABD’de mesele “piyasa erişimi yok” değil; **piyasa erişimi var ama bankable gelir ve izin süresi hâlâ riskli**dir. 

### Avrupa

Avrupa’da birlik düzeyindeki çerçeve, depolamaya doğrudan bir Avrupa çapı PDHES sübvansiyonu vermekten çok, **esnekliğin piyasa içinde değerlenmesini** ve gerektiğinde kapasite mekanizmalarının storage’a açık şekilde kurulmasını sağlıyor. Avrupa Komisyonu’nun 2024’te yürürlüğe giren elektrik piyasası tasarımı reformu, fosilsiz esnek teknolojilere yatırım çekme ihtiyacını açık biçimde vurguluyor. ACER de kapasite mekanizmalarının yalnızca kaynak yeterliliği endişesi kanıtlandığında devreye alınabileceğini ve bu mekanizmaların depolama dâhil kapasite kaynaklarına açık olması gerektiğini belirtiyor. 

Bunun pratik sonucu, Avrupa’da PDHES yatırımının ulusal tasarımlarla şekillenmesidir. En dikkat çeken örnek Birleşik Krallık’tır. Hükümet 2024’te uzun süreli elektrik depolama için **cap-and-floor** rejimini seçti; teknik detaylar 2025’te yayımlandı; Ofgem de bunun yüksek sermaye maliyeti ve uzun inşaat süresi olan projeler için asgari gelir tabanı sağlayıp, aşırı gelirleri tüketici lehine sınırlandırdığını açıkladı. 2026’da ilk pencere kapsamında seçilen projeler arasında PDHES de bulunuyor. Bu model Avrupa’daki en bankable LDES rejimlerinden biridir çünkü yatırımcıya taban gelir verirken tam bir fixed tariff yaratmaz. 

İkinci güçlü örnek İspanya’dır. Avrupa Komisyonu Mayıs 2026’da 9 milyar avroluk İspanyol kapasite mekanizmasını onayladı. Komisyona göre mekanizma, 10 yıl boyunca storage, generation ve demand response kaynaklarının kıtlık dönemlerinde hazır bulunmasını ödüllendirecek. Bu, özellikle yüksek güneş penetrasyonuna sahip İspanya’da depolama için bankability açığını kapatmaya dönük net bir adım olarak okunmalıdır. 

Avrupa’daki yatırım motivasyonu da artık çok net. JRC, enerji krizinin ve Ukrayna savaşı sonrası güvenlik şokunun hidrogüç ve pompaj depolamanın şebeke istikrarı, sevk edilebilirlik ve sistem hizmetlerindeki rolünü görünür hâle getirdiğini söylüyor. Başka bir deyişle Avrupa’da PDHES artık sadece arbitraj varlığı değil; yenilenebilir yoğun sistemlerde güvenlik ve esneklik altyapısıdır. 

## Dev küresel projelerin arkasındaki stratejik mantık

Küresel megaproje dalgasının en büyük nedeni, bataryaların çok güçlü olduğu kısa süreli hizmetlerle PDHES’in üstün olduğu çok saatli ve çok çevrimli sistem esnekliği arasında giderek daha belirginleşen görev ayrımıdır. IEA ve IHA kaynakları, pompaj depolamanın günler arası olmasa da sistem ölçeğinde saatler-mertebesi uzun süreli enerji kaydırma, spinning olmayan rezervler, frekans desteği ve pik talep güvenliği için halen temel teknoloji olduğunu vurguluyor. Özellikle güneş kurulumlarının öğlen saatlerinde fiyat çöküşü, akşam saatlerinde ise hızlı ramp ihtiyacı yaratması, arbitraj pencerelerini de büyütüyor. 

Çin örneği bunu en ileri noktaya taşıyor. Buradaki motivasyon yalnızca “fazla güneşi depolamak” değil; yeni tip güç sistemine geçiş, ultra yüksek hacimli RES entegrasyonu, kömür filosunun esnek işletmeye geçmesi, iletim yatırımının optimizasyonu, sanayi politikası ve hatta bölgesel kalkınma hedefleriyle birleşen devlet güdümlü bir esneklik inşasıdır. Resmî NEA yazışmalarında da pompaj depolamanın yenilenebilirin büyük ölçekli gelişimi, karbon zirvesi-karbon nötrlüğü hedefleri, sistem güvenliği ve etkili yatırım genişlemesi için önemli olduğu açıkça yazılıdır. 

ABD ve Avrupa’da ise motivasyon daha çok **piyasa temelli güvenilirlik** ile **yenilenebilir kaynak kısıntılarının düşürülmesi** ekseninde şekilleniyor. Reuters’in küresel analizine göre özellikle Çin, Brezilya ve Avrupa’daki curtailment baskıları, PDHES’i tekrar merkezî teknoloji hâline getiriyor; fakat Çin dışındaki piyasalarda projeler ancak uygun gelir güvence mekanizmaları bulunduğunda hızlanabiliyor. Bu da neden Britanya’nın cap-and-floor’ünün ve İspanya’nın kapasite mekanizmasının bu kadar önemli görüldüğünü açıklıyor. 

## Türkiye'nin resmî vizyonu ve proje portföyü

Türkiye’de resmî politika dili, PDHES’e olumlu ve giderek daha açık bir yer veriyor. ETKB 2025 Performans Programı, On İkinci Kalkınma Planı referansları içinde “**Pompaj depolamalı HES’ler de dâhil olmak üzere enerji depolama sistemleri tesis edilecektir**” hükmünü taşıyor. Aynı belge ayrıca talep tarafı katılımını, şebeke geliştirmelerini ve enerji depolama kapasitesini artıracak Ar-Ge’yi de öncelik olarak yazıyor. Bu, PDHES’in artık sistem esnekliği politikası içinde resmî olarak tanındığını gösterir. 

Buna karşılık resmî belgelerde kısa vadeli somutlaşma şimdilik sınırlı. ETKB 2024 Faaliyet Raporu, “önlisans verilen pompaj depolamalı hidroelektrik santrali kurulu gücü”nü ayrı bir performans göstergesi olarak izliyor; fakat aynı raporun tablo ve değerlendirme bölümü 2024 sonunda PHES cephesinde anlamlı bir kurulu güç artışı üretmediğini, buna karşılık batarya depolama ve toplayıcılık gibi başlıklarda mevzuat/uygulama ilerlemesi beklendiğini gösteriyor. Başka bir deyişle politika sahiplenmesi var, ancak yakın dönem icra takvimi daha çok batarya ve piyasa esnekliği araçlarında yoğunlaşıyor. 

Türkiye’nin orta-uzun vadeli elektrik resmi ise PDHES ihtiyacını teknik olarak güçlendiriyor. Türkiye Ulusal Enerji Planı, 2035’e kadar elektrik tüketiminin 510,5 TWh’ye çıkacağını ve sistemde batarya depolamanın 7,5 GW seviyesine yükseldiği bir senaryo kuruyor. Buna sonradan eklenen 2035 Yenilenebilir Enerji Yol Haritası, rüzgâr ve güneşte 120 GW kurulu güç hedefi ve her yıl en az 2 GW YEKA ihalesi perspektifi getiriyor. Bu iki hedef birlikte okunduğunda, Türkiye’nin gelecekte yalnızca kısa süreli değil, uzun süreli esnekliğe de ihtiyaç duyacağı açıktır. Bu son cümle, resmî planlardan yapılan bir çıkarımdır. 

Tarihsel proje portföyünde en somut isim **Gökçekaya PDHES**’tir. Kamu Kurumları raporlarında Gökçekaya için hedef; ayarlanabilir hızlı pompaj depolama santrali kurarak pik talep artışını karşılamak ve şebekeyi stabilize etmek olarak tanımlanmıştır. Kamu Kurumları fizibilite dokümanları, Türkiye’de pompaj depolama ihtiyacının 2009–2011 döneminde ilgili kurumlar arasında teyit edildiğini ve **Gökçekaya ile Altınkaya** sahalarının öncelikli adaylar olarak seçildiğini; o dönem öngörüsünde ilk ünitenin 2023’te devreye gireceğinin varsayıldığını göstermektedir. 

Ancak proje ilerlemesi bakımından tablo karışıktır. Sektörel kaynaklar Gökçekaya’nın 2020 yatırım programında yaklaşık 1.400 MW ölçeğinde ve yaklaşık 6,3 milyar TL bütçeyle yer aldığını aktarırken, güncel EÜAŞ 2025 performans dokümanlarında Gökçekaya için görünür bir yatırım/işletmeye alma kilometre taşı öne çıkmamaktadır. Bu nedenle en dikkatli ifade şu olur: **Gökçekaya, Türkiye’nin en olgun tarihsel PDHES adayıdır; fakat güncel resmî performans belgeleri itibarıyla projenin icra safhasına geçtiğini gösteren güçlü bir kamu işareti bulunmamaktadır.** Bu, resmî ve sektörel belgelerin birlikte okunmasına dayalı bir çıkarımdır. 

## Türkiye'de mevzuat, piyasa tasarımı ve yatırım yapılabilirlik

Türkiye’de depolama mevzuatı son yıllarda hızla genişledi, fakat genişleme ekseni büyük ölçüde **elektrik depolama ünitesi/tesisi** ve **depolamalı RES** üzerine kuruldu. EPDK, 2024’te hem Elektrik Piyasasında Depolama Faaliyetleri Yönetmeliği değişiklik taslağını hem de Toplayıcılık Faaliyeti Yönetmeliği taslağını görüşe açtı; ardından TEİAŞ 2025–2026 döneminde yeni yan hizmet anlaşmaları ve teknik kriterler yayımladı. Bu, sistemin esneklik odaklı yeni bir mimariye geçtiğini gösteriyor. 

Fakat PDHES açısından en kritik hukuki nokta, TEİAŞ’ın 3 Temmuz 2026 tarihli teknik kriterlerinde açıkça görülüyor. “Elektrik Depolama Ünite veya Tesislerinin Yan Hizmetlerde Kullanılmasına Dair Teknik Kriterler ve Test Prosedürleri” metni, depolama tesislerinin primer ve sekonder frekans kontrolü, hızlı frekans kontrolü ve benzeri yan hizmetlere katılım çerçevesini düzenliyor; ancak aynı metin **pompaj depolamalı hidroelektrik santralleri kapsam dışındadır** diyor. Bu hüküm, Türkiye’de bugünkü depolama yan hizmet altyapısının PSH için tamamlanmadığını; en azından PDHES’in bu teknik prosedür içinde ayrıksı bırakıldığını gösteren çok önemli bir regülasyon işaretidir. 

Bu durum yatırımcı açısından üç sonuç üretir. Birincisi, PDHES’in hangi yan hizmet ürünlerine, hangi teknik testlerle ve hangi gelir akışıyla gireceği bataryalar kadar net değildir. İkincisi, proje finansmanı için gerekli olan “öngörülebilir gelir sözleşmesi” henüz görünür değildir. Üçüncüsü, mevcut esneklik mevzuatı ilerlerken PDHES’in ondan otomatik yararlanacağı varsayılamaz. Bu üç sonuç, yukarıdaki resmî hükümden yapılan analitik çıkarımlardır. 

YEKA ve depolamalı üretim mevzuatı tarafında da benzer bir asimetri vardır. ETKB’nin 2024 YEKA-RES şartnamesi, aynı ölçüm noktasında ve lisanstaki elektriksel kurulu gücü aşmayacak şekilde depolama kurulmasına izin verirken, sözleşme kapsamı dışında ilave ödeme talep edilemeyeceğini de söylüyor. Başka bir ifadeyle Türkiye, hibrit RES+depolama kurgusunu açıyor; ama storage’a ayrı ve garantili bir gelir köprüsü kurmuyor. Bu yapı batarya hibritleri için yönetilebilir olabilir; ancak yüksek CAPEX ve uzun inşaat süresi olan PDHES için çoğu durumda yetersiz kalabilir. Son cümle, global kıyaslamaya dayalı bir çıkarımdır. 

Bağlantı ve kapasite tarafı ise hem fırsat hem engel üretiyor. TEİAŞ 2024’te 5 ve 10 yıllık bağlanabilir bölgesel üretim tesisi kapasite raporunu yayımladı; 2024 ve 2026’da lisanssız üretim ve kapasite tahsis duyuruları ile kapasite yönetimini sürdürdü. Bu, Türkiye’nin kapasiteyi idari ve bölgesel bazda dağıtmaya devam ettiğini gösteriyor. Böyle bir ortamda PDHES’in şebeke değeri teknik olarak yüksek olsa bile, yatırımın ilerleyebilmesi için proje bazlı güçlü sistem ihtiyaç gerekçesi ve iletim planıyla uyum şarttır. 

Ekonomik tarafta bir başka sorun da genel kapasite mekanizmasının PDHES için henüz yatırım sinyali üretmemesidir. TEİAŞ kapasite mekanizması ödeme listelerini aylık olarak yayımlıyor; ancak bugün kamuya açık çerçeve, işletmede PDHES bulunmadığı için, PDHES’e özgü bir kapasite tedarik yolu veya uzun dönemli availability sözleşmesi göstermez. Bu nedenle Türkiye’de bugün bir PDHES yatırımının muhtemel geliri ağırlıkla future merchant arbitraj ve henüz netleşmemiş yan hizmet gelirlerine dayanmak zorunda kalır. Bu da finansman kapanışı açısından zayıf bir çerçevedir. Bu paragraf, kamuya açık TEİAŞ mekanizmasının yapısından yapılan bir çıkarımdır. 

## Türkiye enterkonnekte sistemi için stratejik anlam

Türkiye’nin enterkonnekte sistemi hızlı RES büyümesiyle birlikte daha esnek bir işletme rejimine gidiyor. ETKB’nin 2035 yol haritası rüzgâr ve güneşte 120 GW hedefi koyarken, aynı politika kümesi yeşil iletim altyapısı, talep tarafı katılımı ve depolamanın birlikte geliştirilmesini öngörüyor. TEİAŞ da hem bağlantı kapasitesi raporları hem tekniki kriterler hem de yan hizmet sözleşmeleriyle bu dönüşüme hazırlanıyor. Bu politika seti birlikte okunduğunda, Türkiye’nin sistem ihtiyacının “sadece daha fazla üretim” değil, “daha fazla esneklik” olduğu nettir. 

PDHES’in burada kritik rolü dört başlıkta toplanır. İlk olarak, çok saatli enerji kaydırma sayesinde öğlen güneş fazlasını akşam puantına taşır. İkinci olarak, senkron makine davranışı, atalet ve kısa devre gücü üzerinden şebeke kararlılığına katkı potansiyeli taşır; bu, yalnızca enerji arbitrajına indirgenemeyecek bir sistem değeridir. Üçüncü olarak, rüzgâr ve güneş arttıkça iletim kısıtı ve curtailment baskısı oluşan bölgelerde “su bataryası” işlevi görebilir. Dördüncü olarak, doğal gaz çevrim santrallerinin esneklik yükünü kısmen azaltarak ithal yakıt bağımlılığına karşı da stratejik sigorta işlevi görür. İlk ve üçüncü noktalar küresel ve ulusal planlardan açıkça, ikinci ve dördüncü noktalar ise bu planların teknik mantığından çıkarılmaktadır. 

Özetle Türkiye için mesele artık “PDHES gerekli mi?” sorusu değildir. Asıl soru, **PDHES’i hangi piyasa tasarımıyla yatırım yapılabilir kılacağımızdır.** Çin bunu kapasite tarifesiyle, Britanya cap-and-floor ile, İspanya storage’a açık kapasite mekanizmasıyla, ABD ise piyasa erişimi + vergi kredisiyle çözmeye çalışıyor. Türkiye’nin mevcut çerçevesi ise henüz bu seçeneklerden hiçbirini PDHES için tam olarak kurmuş görünmüyor. 

## Sonuç

Güncel resmî belgeler ışığında Türkiye’de PDHES için politik yönelim pozitiftir, teknik ihtiyaç kuvvetlenmektedir, fakat regülasyon ve gelir modeli eksiktir. ETKB ve Kalkınma Planı belgeleri depolamayı, hatta açıkça pompaj depolamalı HES’i stratejik ihtiyaç olarak tanımlıyor. Kamu Kurumları veri tabanı ve tarihsel çalışmalar Gökçekaya ile Altınkaya gibi sahaların yıllardır masada olduğunu gösteriyor. Buna rağmen güncel kamu belgeleri, kısa vadede PDHES’in ticari ölçekte hayata geçirilmesini sağlayacak net bir kapasite gelir modeli, PDHES’e özgü yan hizmet kural seti ve proje bazlı ilerleme takvimi ortaya koymuyor. 

Bu nedenle Türkiye için en rasyonel politika çerçevesi, PDHES’i yalnızca klasik HES veya genel depolama başlığı altında değil, **uzun süreli sistem esnekliği altyapısı** olarak tanımlayan ayrı bir düzenleme seti geliştirmektir. Böyle bir setin en az üç ayağı olmalıdır: proje bazlı sistem ihtiyacı tespiti ve TEİAŞ planlamasına entegrasyon; kapasite/availability temelli bankable gelir desteği; PDHES’in hangi yan hizmetleri hangi kurallarla sunacağını netleştiren teknik usuller. Mevcut gidişat bu yönde bir altyapı hazırlıyor, fakat bugün itibarıyla köprünün ortasında bulunuyoruz. `
  },
  {
    id: 'pdhes-grid-tech',
    title: 'Pompaj Depolamalı HES\'lerin Şebeke Entegrasyonu ve Teknolojisi',
    category: 'report',
    author: 'Sistem Araştırma Modülü',
    publishDate: '2026-07-07',
    readTime: 18,
    coverImage: '/pdhes-nedir/img-9.webp',
    summary: 'PDHES\'lerin şebeke ölçeğinde enerji depolama rolü, değişken devirli pompalar, bataryalarla (BESS) karşılaştırma ve şebeke entegrasyonuna detaylı bir bakış.',
    content: `# Pompaj Depolamalı HES'lerin Şebeke Entegrasyonu ve Teknolojisi



## Kapsam ve küresel bağlam

Uluslararası literatürde **PSH** olarak geçen pompaj depolamalı hidroelektrik santraller, bugün hâlâ şebeke ölçeğinde en büyük ve en olgun uzun süreli enerji depolama teknolojisidir. IHA’nın 2025 görünümüne göre küresel pompaj depolama kurulu gücü 2024 sonunda **189 GW** seviyesine ulaşmıştır; IHA ayrıca bu teknolojinin dünya uzun süreli enerji depolama kapasitesinin **%94’ünden fazlasını** temsil ettiğini belirtir. GEM’in Global Hydropower Tracker veri seti ise yaklaşık **200 GW işletmede** ve yaklaşık **700 GW prospektif** pompaj depolama projesi izlediğini bildirir. Aynı IHA görünümü, küresel pompaj depolama geliştirme hattının yaklaşık **600 GW** olduğunu vurgular. 

Bu ölçek, PDHES’i yalnızca bir enerji arbitraj varlığı olmaktan çıkarır; teknoloji aynı zamanda **frekans kontrolü, voltaj regülasyonu, sistem ataleti, yedek güç ve Oturan Sistemin Toparlanması - black start** gibi hizmetlerin taşıyıcısıdır. IHA ve IRENA, özellikle değişken yenilenebilir üretim payı arttıkça PDHES’in hızlı mod değişimi, yüksek güç kapasitesi ve çok-saatli deşarj özelliği nedeniyle sistem esnekliğinin temel araçlarından biri hâline geldiğini açık biçimde ortaya koymaktadır. 

Mühendislik açısından PDHES’in ana denklemleri basittir, fakat şebeke değeri bu denklemlerin işletme pratiğine çevrilmesinden doğar. Türbin modunda yaklaşık aktif güç
\[
P \approx \rho g Q H \eta
\]
ilişkisiyle, depolanan potansiyel enerji ise yaklaşık
\[
E \approx \rho g H V \eta
\]
ilişkisiyle ifade edilir. Burada belirleyici iki parametre **net düşü** \(H\) ile **rezervuar hacmi** \(V\)’dir. Şebeke işletmecisi açısından ise asıl kritik nokta, bu enerjinin **hangi hızda**, **hangi doğrulukta** ve **hangi modda** sisteme verilip çekilebildiğidir. Bu nedenle “değişken devirli mi, sabit devirli mi, yoksa ternary mi?” sorusu yalnızca makine seçimi değil, doğrudan bir **yan hizmet stratejisi** sorusudur. 

## Türbin ve jeneratör teknolojileri

Sabit devirli pompaj sistemleri, klasik olarak **reversible pump-turbine + senkron motor/jeneratör** mimarisiyle kurulur. Bu yapı özellikle generasyon modunda esnek ve olgun bir çözümdür. Ancak pompa modunda güç çekişi pratik olarak sabittir; bu nedenle pompa modunda primer regülasyon veya sürekli yük takibi sağlayamaz. DOE/Argonne incelemesine göre gelişmiş sabit devirli tesisler daha hızlı rampa ve daha kısa mod değişim süreleriyle iyileşmiş olsa da, değişken devirli mimariler hâlâ belirgin operasyonel üstünlükler sunmaktadır. 

Değişken devirli PDHES’lerin temel farkı, pompa-türbinin dönme hızının hidrolik koşullara göre ayarlanabilmesidir. Bu, özellikle kısmi yüklerde verim optimizasyonu, daha düşük teknik minimum yük, daha dar “rough zone” ve en önemlisi **pompa modunda aktif güç modülasyonu** anlamına gelir. Argonne raporuna göre değişken devirli üniteler pompa modunda tipik olarak **anma pompalama gücünün %70–100’ü** aralığında çalışabilir; teknik minimum yük de **anma gücünün %20–30’u** kadar düşük seviyelere inebilir. Aynı kaynak, değişken devirli dönüşümlerin toplam çevrim verimini tipik olarak **%1–2** artırabildiğini vurgular. 

Elektrik makinesi tarafında iki ana değişken devir ailesi vardır. Birincisi **DFIM/DFIG** temelli çözümdür; burada wound-rotor asenkron makine kullanılır ve rotor, kısmi güçlü bir frekans dönüştürücüyle kontrol edilir. İkincisi ise **CFSM / full-converter** çözümleridir; burada tam güçlü dönüştürücü ile senkron makine veya benzeri yapı kullanılır. DFIM yaklaşımında dönüştürücü yalnızca hız ayarı için gereken kayma gücünü işler; bu yüzden dönüştürücü boyutu tam güce eşit olmak zorunda değildir. NREL, pratikte kurulu değişken devir aralığı **%0–20** ise DFIM dönüştürücüsünün çoğu durumda **stator anma gücünün yaklaşık %10’u** mertebesinde olabildiğini, daha geniş kayma aralıklarında ise bu ihtiyacın arttığını belirtir. Argonne da DFIM’in nominale göre yaklaşık **±%7** dar hız ayar bandında çalışabildiğini vurgular. 

Bu noktada kullanıcının özellikle sorduğu **asenkron motor/jeneratör kullanımının avantajları** nettir: DFIM temelli çözüm, tam güçlü dönüştürücüye kıyasla daha küçük güç elektroniği hacmi gerektirir; bu da genellikle daha düşük ekipman boyutu ve maliyet baskısı demektir. Ayrıca endüstride çok uzun süredir kullanılan indüksiyon makinesi ailesine dayanır. Buna karşılık bedeli, statorun şebekeye doğrudan bağlı olmasıdır. NREL’in karşılaştırmasına göre DFIM yapısı, full-converter mimariye göre **elektriksel ve elektromanyetik olarak şebekeye daha fazla bağlıdır**; dolayısıyla yakın arızalarda crowbar koruması ve fault ride-through koordinasyonu daha kritik hâle gelir. Başka deyişle DFIM, maliyet ve olgunluk lehine; full-converter ise şebekeden ayrışmış kontrol kabiliyeti lehine güçlüdür. 

Ternary sistemler ise ayrı bir sınıftır. Bunlarda **ayrı pompa, ayrı türbin ve ortak bir motor-jeneratör** bulunur. Modern ternary tesislerin ayırt edici özelliği, **hydraulic short-circuit** modudur. Argonne verilerine göre bu yapı sayesinde ünite gücü yaklaşık **-%100 ile +%100** arasında neredeyse sürekli bir aralıkta ayarlanabilir; ayrıca pompadan türbine geçişte dönme yönünü tersine çevirmeye gerek kalmadığı için mod geçişleri çok daha kısa olabilir. Aynı çalışmanın tablo verilerine göre sabit ve klasik değişken devirli reversible ünitelerde generasyondan pompalamaya geçiş **240–420 saniye** bandında iken, hydraulic short-circuit özellikli ternary birimlerde bu süre yaklaşık **25 saniye** düzeyine inebilir. Bu, özellikle sık mod değişimi ve yüksek frekanslı dengeleme gerektiren sistemlerde çok önemli bir üstünlüktür. 

Aşağıdaki tablo, bu üç ana teknoloji ailesini şebeke mühendisliği açısından özetler:

| Teknoloji | Elektromekanik yapı | Pompa modunda aktif güç regülasyonu | Teknik minimum / işletme aralığı | Şebeke açısından güçlü yanı | Başlıca trade-off | Kaynak |
|---|---|---:|---:|---|---|---|
| Sabit devirli | Reversible pump-turbine + senkron makine | Hayır | Generasyonda yaklaşık %30–100; pompa modunda sabit çekiş | Olgun teknoloji, güçlü generasyon modu esnekliği | Pompa modunda regülasyon yok |  |
| Değişken devirli DFIM/CFSM | Reversible pump-turbine + DFIM/CFSM + frekans dönüştürücü | Evet | Pompa modunda tipik %70–100; minimum yük yaklaşık %20–30 | Pompa modunda FCR/aFRR katkısı, daha iyi kısmi yük verimi, daha esnek Q-V kontrolü | İlave güç elektroniği, daha yüksek CAPEX |  |
| Ternary | Ayrı türbin, ayrı pompa, ortak motor-jeneratör, hydraulic short-circuit | Evet | Yaklaşık 0–100% net güç ayarı mümkün | Çok hızlı mod değişimi, pompa modunda tam regülasyon esnekliği | En karmaşık ve en pahalı mimarilerden biri |  |

## Sistem frekansı ve dengeleme performansı

PDHES’in frekans kontrolündeki gerçek değeri, yalnızca büyük enerji hacmine sahip olması değil, **frekans olayının zaman ölçeğiyle uyumlu cevap bandı** sunabilmesidir. Avrupa çerçevesinde ENTSO-E belgeleri FCR’nin saniyeler ölçeğinde devreye girdiğini; bazı resmi FCR özellik dokümanlarında tam aktivasyon için **30 saniye** referansını verdiğini göstermektedir. aFRR tarafında ise ENTSO-E/ACER çerçevesi, standart aFRR ürününün **18 Aralık 2024’ten itibaren 5 dakikalık full activation time** ile tanımlandığını belirtmektedir. Bu, 2026 itibarıyla Avrupa tipi sekonder dengeleme için pratik referans değerdir. 

PDHES’in bu gereklilikleri teknik olarak karşılayıp karşılamadığına bakıldığında tablo nettir. DOE/PNNL karakterizasyonuna göre çevrimiçi generasyon modundaki bir PDHES ünitesi **5–15 saniye** içinde tam yüke çıkabilir; shutdown’dan generasyon online durumuna geçiş **60–90 saniye**, shutdown’dan tam generasyona geçiş ise yaklaşık **120 saniye** olabilir. Sabit devirli reversible ünitelerde normal pompaj moduna geçiş daha yavaştır; DOE aynı kaynakta bunu yaklaşık **6 dakika** olarak verir. Bu veriler, **senkronize bekleme** durumundaki PDHES’in FCR için, **quick-start** veya AGC altında işletilen PDHES’in ise aFRR için fazlasıyla uygun olduğunu gösterir. 

Asıl kritik ayrım şu noktada ortaya çıkar: **sabit devirli pompa modunda primer/sekonder frekans desteği yoktur**; çünkü güç çekişi regüle edilemez. Değişken devirli ünite ise pompa modunda çektiği gücü artırıp azaltabildiği için, sistem frekansı düştüğünde pompa yükünü azaltarak şebekeye fiilen destek verir. Argonne’nun teknoloji incelemesi, sabit devirli pompa modunda “frequency regulation: no”, değişken devirli ve ternary pompa modunda ise “frequency regulation: yes” sonucunu açık biçimde verir. Bu fark, özellikle güneş üretiminin öğlen saatlerinde çok yükseldiği ve pompaj modunun uzun sürdüğü sistemlerde **operasyonel olarak oyunu değiştiren** farktır. 

Frekans cevabının kontrol yasası en basit biçimiyle bir **droop** ilişkisiyle yazılabilir:
\[
\frac{\Delta P}{P_r} \approx -\frac{1}{R}\frac{\Delta f}{f_n}
\]
Burada \(R\) droop katsayısı, \(P_r\) anma güç, \(f_n\) nominal frekanstır. Frekans düştüğünde \(\Delta f<0\) olur ve ünite aktif gücünü yukarı yönlü artırır ya da pompa modundaysa çektiği aktif gücü azaltır. ENTSO-E’nin load-frequency reserve belgeleri, FCR’nin frekans sapmasına **orantılı** çalıştığını açıkça tanımlar; kıtasal Avrupa için örnek metodolojide 0.2 Hz’lik quasi-steady-state frekans sapmasına karşı **3000 MW FCR** değeri kullanılır. Bu, sistem seviyesinde yaklaşık **15000 MW/Hz**’lik oransal tepki sabitine karşılık gelir. 

Batarya enerji depolama sistemleriyle karşılaştırmada ise sonuç iki eksende ayrılır: **hız** ve **derinlik**. DOE/NREL çalışmalarına göre bataryaların DC tarafındaki tepki süresi tipik olarak **1 saniyenin altında** kabul edilir; AC tarafta ise performans power conversion system seçimine bağlıdır ve rated power’a ulaşma süresi yaklaşık **1 saniye** düzeyinde varsayılmakla birlikte bazı PCS tasarımlarında daha uzun olabilir. Aynı NREL FAQ belgesi, bataryaların frekans regülasyonunda konvansiyonel kaynaklardan **daha hızlı ve daha hassas** hizmet verebildiğini vurgular. Buna karşılık NREL’in 2023 uzun süre raporu, yeni kurulan depolama kapasitesinin **%90’dan fazlasının 4 saat veya daha kısa süreli** olduğunu ve son yıllarda yeni kapasitenin yaklaşık **%99’unun Li-ion** olduğunu belirtir. 

Bu nedenle pratiğe dökülmüş teknik yargı şudur: **BESS ilk saniyelerde kazanır, PDHES olay uzadıkça kazanır**. Batarya, FCR ve çok hızlı AGC düzeltmelerinde daha çeviktir; PDHES ise 30 saniyeyi aşan dengesizliklerde, özellikle 15 dakikadan birkaç saate uzanan enerji açığı pencerelerinde, daha büyük enerji rezervi ve düşük marjinal çevrim baskısıyla daha kuvvetli hale gelir. Bu sonuç doğrudan kaynaklardan türetilmiş bir sistem çıkarımıdır. 

Aşağıdaki tablo bu karşılaştırmayı özetler:

| Karşılaştırma başlığı | PDHES | BESS | Mühendislik yorumu | Kaynak |
|---|---|---|---|---|
| FCR / primer cevap | Çevrimiçi ise saniyeler mertebesinde; çevrimiçi tam yüke çıkış 5–15 s | Genellikle sub-second ila ~1 s sınıfı | İlk tepkide BESS üstün; senkronize PDHES yine de FCR penceresine rahat girer |  |
| aFRR / sekonder cevap | 5 dakikalık standardı rahat karşılar; cold/standby start ile de uygundur | Teknik olarak rahat karşılar | Her iki teknoloji de aFRR için uygundur; fark daha çok enerji hacminde ortaya çıkar |  |
| Pompa modunda regülasyon | Sabit devirlide yok; değişken devirli ve ternary’de var | Şarj/deşarj yönünde çift yönlü regülasyon doğal | Yüksek güneşli sistemlerde değişken devirli PDHES çok değerli |  |
| Baskın piyasa süresi | Çok-saatli / uzun süreli | Piyasada baskın kurulumlar ≤4 saat | BESS güç elektroniği odaklı; PDHES enerji hacmi odaklı |  |
| Çevrim verimi | Tipik yaklaşık %80 bandı | Uygulamaya göre yüksek; hizmete bağlı | Verim tek başına karar kriteri değildir; hizmet süresi ve ekipman ömrü de belirleyicidir |  |

## Yan hizmetler ve sistem restorasyonu

PDHES’in yan hizmet portföyü, yalnızca aktif güçle sınırlı değildir. IHA ve IRENA, pompaj depolamanın **reaktif güç kontrolü, voltaj regülasyonu, operating reserve, Oturan Sistemin Toparlanması - black start ve inertia** sağlama kabiliyetini temel avantajlar arasında sayar. J-POWER’ın işletme açıklaması da pompaj depolamanın güç çıkışı, sistem frekansı ve sistem voltajı ayarına elverişli olduğunu belirtir. 

Reaktif güç ve voltaj kontrolü tarafında modern değişken devirli ünitelerin üstünlüğü belirgindir. Argonne, ayarlanabilir devirli ünitelerin aktif ve reaktif gücü frekans dönüştürücü üzerinden **elektronik olarak ayrıştırılmış** biçimde kontrol edebildiğini, bunun da daha esnek voltaj desteği sunduğunu belirtir. NREL’in elektrik sistemleri raporunda da hem full-converter hem DFIM tabanlı ayarlanabilir hızlı pompaj sistemlerinde reaktif güç kontrolünün mümkün olduğu; normal işletmede generatörün bir **PV bus** olarak voltajı, ya da bir **PQ bus** olarak reaktif gücü düzenleyebildiği belirtilir. Arıza anlarında ise dönüştürücü akımları çoğu durumda şebeke voltajına destek için reaktif bileşen yönünde komuta edilir. 

Burada önemli bir ayrıntı vardır: **DFIM ile full-converter aynı şey değildir**. NREL karşılaştırması, full-converter temelli çözümlerde statorun şebekeden **tam ayrıştığını**, bu nedenle güç sistemi salınımlarının rotor ve hidrolik tarafta daha iyi tamponlanabildiğini söyler. DFIM’de ise stator şebekeye bağlı kaldığından, özellikle yakın arızalarda crowbar ve koruma koordinasyonu devreye girer. Başka bir deyişle full-converter çözüm, zayıf şebeke ve fault ride-through gereksinimleri ağırlaştıkça daha “grid-forming’e yakın” bir davranış alanı açar; DFIM ise maliyet ve olgunluk açısından daha çekici kalır. 

Atalet boyutunda PDHES’in değeri daha da stratejiktir. IHA, pompaj depolamanın **system inertia** sağladığını açık biçimde belirtir. NREL de yenilenebilir üretim arttıkça klasik senkron makine parkının azalmasıyla sistemdeki döner kütle seviyesinin düştüğünü ve özellikle ayarlanabilir devirli PDHES’in hızlı ve esnek cevapla sistem kararlılığına katkı verdiğini vurgular. Klasik senkron generatörlü PDHES burada “gerçek fiziksel atalet” sunar; değişken devirli ve güç elektroniği destekli çözümler ise buna ek olarak **hızlı frekans yanıtı** ve bazı uygulamalarda **virtual inertia benzeri kontrol** sağlayabilir. 

Bu bölümün temel denklemi swing denklemidir:
\[
\frac{2H}{\omega_s}\frac{d\omega}{dt} = P_m - P_e
\]
Sistemde ani üretim kaybı olduğunda \(P_e>P_m\) olur, rotorlar yavaşlar ve frekans düşer. PDHES’in döner kütlesi ile türbin-governor/dönüştürücü kontrolü, bu ilk frekans düşüş eğimini yumuşatır. Özellikle düşük ataletli, yüksek inverter penetrasyonlu şebekelerde bu katkı yalnızca “enerji sağlama” değil, **RoCoF azaltma** açısından da değerlidir. Bu ikinci cümle, yukarıdaki kaynaklardan türetilmiş mühendislik çıkarımıdır. 

Oturan Sistemin Toparlanması - black start kabiliyeti açısından hidro tesisler çok güçlü adaylardır ve PDHES bu üstünlüğün büyük kısmını paylaşır. DOE’nin black start raporuna göre hidro tesisler **küçük istasyon yardımcı güç ihtiyacı**, **hızlı yeniden başlatma**, **frekans salınımlarına dayanıklılık**, **yüksek rampa yeteneği** ve çoğu durumda diğer santralleri ayağa kaldırmaya yetecek gerçek ve reaktif güç kapasitesi nedeniyle Oturan Sistemin Toparlanması - black start için son derece uygundur. Aynı kaynak, hidro santrallerin **10 dakikaya kadar inebilen** başlatma süresine sahip olabildiğini ve ABD’de Oturan Sistemin Toparlanması - black start için tutulan/test edilen birimlerin yaklaşık **%40’ının hidro türbin** olduğunu, oysa hidro kurulu gücünün toplamın yalnızca yaklaşık **%10’u** olduğunu bildirir. 

PDHES için tek kritik çekince, DOE’nin de belirttiği gibi, ekonomik dispatch nedeniyle üst rezervuarın boşalmış olabilmesidir. Bu yüzden bir pompaj depolama tesisinin Oturan Sistemin Toparlanması - black start kaynağı olarak güvenilir kabul edilmesi için işletme planında **üst haznede ayrılmış su rezervi** tutulması gerekir. Yani Oturan Sistemin Toparlanması - black start kabiliyeti “teknolojiye içkin” olsa da, bunun şebeke düzeyinde güvenilir hizmete dönüşmesi **hidrolik stok yönetimine** bağlıdır. 

## Gelecek teknolojiler ve tasarım ufku

Deniz suyu kullanan PDHES, kıyısal ve ada sistemleri açısından uzun süredir güçlü bir mühendislik vizyonu sunmaktadır. J-POWER’ın Okinawa Yanbaru açıklaması, deniz suyu kullanımının temel cazibesini çok açık koyar: **alt rezervuar oluşturmaya gerek kalmaz** ve deniz suyu arzı fiilen sınırsızdır. Aynı açıklama, fakat aynı netlikte, ana sorun alanlarını da sayar: **tuz kaynaklı korozyon**, **denizel organizmalar üzerindeki etki** ve **üst rezervuarlardan bırakılan deniz suyunun çevresel etkileri**. Bu, deniz suyu PDHES’te asıl zorluğun hidrolikten ziyade malzeme, kaplama, biyolojik kirlenme ve çevresel uyum tasarımı olduğunu gösterir. 

Okinawa deneyimine ilişkin teknik yayınlar ve sonraki derlemeler de bu sonucu destekler. Açık erişimli değerlendirmeler, Yanbaru örneğinde **paslanmaz çelik su geçiş yüzeyleri**, **kaplama sistemleri** ve bazı hatlarda **FRP benzeri kompozit çözümler** kullanıldığını; deniz suyu uygulamalarında korozyon ve fouling önlemlerinin tasarımın ayrılmaz parçası hâline geldiğini bildirir. Başka deyişle deniz suyu PDHES’in önündeki ana bariyer “çalışır mı?” sorusundan çok “ömrü, bakım rejimi ve çevresel izinleri nasıl optimize edilir?” sorusudur. 

Yeraltı maden boşluklarını alt rezervuar olarak kullanan konseptler ise, topoğrafyası sınırlı bölgeler için belki de daha radikal bir açılım sunar. Açık erişimli 2023 derlemesi, terk edilmiş kömür madenlerinin alt rezervuar olarak yeniden kullanımının arazi edinim ihtiyacını düşürebileceğini, mevcut altyapıdan yararlanabileceğini ve bazı bölgelerde ekonomik fizibilite yaratabileceğini; fakat asıl zorluğun madenlerin güncel durumuna ilişkin sınırlı bilgi, jeomekanik bozulma, çözünme, şişme, boşluk geometrisi, gaz ve su kimyası gibi çok katmanlı riskler olduğunu vurgular. ORNL’nin 2025 ve 2026 yayınları da yeraltı pompaj depolamada özellikle **water quality, mineral chemistry ve subsurface topology integrity** başlıklarını ana teknik engeller olarak tanımlar ve bu yüzden hidrodinamik ve kimyasal modellemenin kritik olduğunu söyler. 

Bu konseptlerin en önemli avantajı, geleneksel yüzey rezervuarlarına kıyasla daha düşük yüzey ayak izi ve düz/az eğimli bölgelerde de pompaj depolama kurulabilmesidir. Ancak hidrojeoloji burada merkezi role sahiptir. 2017 tarihli uygulamalı enerji çalışması, açık ocak veya yeraltı rezervuarıyla çevre akifer arasındaki **groundwater exchange** miktarının verimi etkileyebildiğini, fakat verimi yükselten aynı hidrolik etkileşimlerin çevresel etkiyi de büyütebildiğini göstermektedir. Dolayısıyla yeraltı çözümlerinde “maksimum verim” her zaman “minimum risk” anlamına gelmez; optimum tasarım, hidrolik verim ile hidrojeolojik güvenlik arasında bir denge problemidir. 

## Mühendislik sonuçları

Teknik sonuç nettir: **sabit devirli PDHES artık yalnızca enerji arbitraj tesisi olarak düşünülmemelidir**. Eğer hedef sadece düşük fiyat saatlerinde pompalayıp yüksek fiyat saatlerinde üretmek olsaydı sabit devirli sistemler birçok durumda yeterli kalabilirdi. Fakat modern şebekelerde ihtiyaç duyulan şey, pompa modunda da aktif güç ayarlayabilen, şebeke zayıfken Q-V desteğini kuvvetli verebilen, düşük atalet dönemlerinde daha iyi dinamik davranış sergileyen ve AGC sinyallerini daha ince çözünürlükle takip edebilen tesislerdir. Bu tanım doğrudan değişken devirli veya hydraulic short-circuit özellikli ternary yapılara işaret eder. 

Bu yüzden yatırım kararını şu şekilde çerçevelemek en rasyonel yaklaşımdır. **Sert, güçlü ve geleneksel olarak senkron bir şebekede**, ana gelir kalemi pik üretim ve enerji arbitrajı ise sabit devirli çözüm hâlâ ekonomik olabilir. **Yüksek güneş ve rüzgâr penetrasyonlu, gün içi sık yön değiştiren, AGC gereksinimi yüksek bir sistemde** değişken devirli mimari ciddi üstünlük sağlar. **Ada sistemi, zayıf enterkonneksiyon veya sık mod değişimli özel dengeleme uygulamalarında** ise ternary ve benzeri çok esnek mimariler daha doğru teknoloji olur. Bu paragraftaki son cümleler, ANL ve NREL’in teknik karşılaştırmalarından türetilmiş mühendislik yorumudur. 

BESS ile PDHES’i birbirinin rakibi olarak görmek de çoğu zaman eksik bir çerçevedir. Kaynakların birlikte okunmasından çıkan daha doğru sonuç, **hibrit zaman ölçekli bir hizmet paylaşımıdır**: BESS, ilk saniyelerde FCR/FFR benzeri çok hızlı cevabı verir; PDHES ise dakikalar ve saatler ölçeğinde enerjiyi taşır, rezervi derinleştirir ve şebekenin termal ya da kimyasal depolama yerine hidrolik depolamayla dengelenmesini sağlar. Bu, özellikle düşük ataletli ve güneş ağırlıklı sistemlerde teknik olarak çok kuvvetli bir portföy mimarisidir. Bu paragraf, NREL/DOE’nin BESS hız verileri ile PDHES’in uzun süreli deşarj ve yan hizmet kabiliyetlerine dair kaynaklardan türetilmiş bir tasarım çıkarımıdır. 

Son olarak, gelecek perspektifinde deniz suyu ve yeraltı rezervuarlı uygulamalar birer “niş” fikir değil, **coğrafi kısıtları aşmak için gerçek mühendislik yolları** olarak görülmelidir. Ancak bu iki alanın da başarısı türbin veriminden çok **malzeme dayanımı, su kimyası, hidrojeoloji, çevresel izin ve dijital izleme** paketinin kalitesine bağlı olacaktır. Dolayısıyla geleceğin en başarılı PDHES projeleri, yalnızca daha büyük rezervuar kuran değil; aynı zamanda makine, güç elektroniği, hidrojeoloji ve piyasa tasarımını birlikte optimize eden projeler olacaktır. 

## Başlıca kaynaklar

Bu rapor ağırlıklı olarak **U.S. DOE, ANL, NREL, ORNL, PNNL, ENTSO-E, ACER, IHA, IRENA ve GEM** kaynaklarına dayandırılmıştır. Özellikle teknoloji karşılaştırmaları için ANL ve NREL raporları; frekans kontrol zamanları için ENTSO-E/ACER belgeleri; Oturan Sistemin Toparlanması - black start analizi için DOE hidro raporu; küresel bağlam için IHA ve GEM kaynakları kullanılmıştır. `
  },
  {
    id: 'tr-pdhes-gelecegi',
    title: 'Türkiye\'nin PDHES Potansiyeli ve Yenilenebilir Enerji Entegrasyonu',
    category: 'summary',
    author: 'M. Yeniceli',
    publishDate: '2026-06-15',
    readTime: 5,
    coverImage: '/pdhes-nedir/img-17.webp',
    summary: 'Rüzgar ve güneş enerjisindeki dalgalanmaları dengelemek için Türkiye\'nin kapalı çevrim (closed-loop) pompaj depolama hidroelektrik santral ihtiyacının kavramsal analizi.',
    content: `## Türkiye'nin PDHES Stratejisi
    
Türkiye'nin yenilenebilir enerji kurulu gücü hızla artarken, baz yük ve dengeleme santrali ihtiyacı da kritik bir seviyeye ulaşmaktadır. Özellikle gece ve gündüz fiyat makasının açılması, lityum-iyon bataryaların kısa süreli (<4 saat) depolamaya uygun olması sebebiyle **Pumped Storage Hydropower (PDHES)** tesisleri uzun süreli (8+ saat) depolama için tek olgun teknolojidir.

### Pazar İhtiyacı
*   **Güneş Eğrisi (Duck Curve):** Gündüz oluşan üretim fazlası, akşam puantında yerini ani bir talep artışına bırakmaktadır.
*   **Yan Hizmetler:** Primer ve sekonder frekans kontrolünde PDHES'lerin esnekliği rüzgar dalgalanmalarını saniyeler içinde dengeleyebilir.

> Enerji arz güvenliği için Türkiye, önümüzdeki 10 yıl içerisinde en az 3000 MW PDHES kapasitesini devreye almalıdır.

### Kapalı Çevrim Avantajları
Açık çevrim projelere kıyasla kapalı çevrim (nehir sisteminden bağımsız) projeler:
1.  Daha az ÇED (Çevresel Etki Değerlendirmesi) engeline takılır.
2.  Balık göç yollarını etkilemez.
3.  Yüksek düşü (head) olan her topografyada konumlandırılabilir.
    `
  },
    {
    id: 'phes-rehberi',
    title: 'Enerji Depolama ve Pompaj Depolamalı Hidroelektrik Sistemler (PHES) Rehberi',
    category: 'report',
    author: 'Eğitim Modülü',
    publishDate: '2026-07-10',
    readTime: 10,
    coverImage: '/pdhes_site_gorselleri_webp/italya_dev_yercekimi_bataryasi/italya_dev_yercekimi_bataryasi_03.webp',
    summary: 'Enerji depolama teknolojilerinin sınıflandırılması, Pompaj Depolamalı Hidroelektrik Sistemlerin (PHES) çalışma mekanizması ve Gökçekaya örneği.',
    content: `# Enerji Depolama ve Pompaj Depolamalı Hidroelektrik Sistemler (PHES) Rehberi

## 1. Giriş: Yenilenebilir Enerjinin Depolama İhtiyacı

Günümüzde rüzgâr ve güneş gibi yenilenebilir enerji kaynaklarına geçiş, ekolojik zorunluluklar nedeniyle bir "yükselen trend" değil, zorunluluktur. Ancak bir enerji mühendisi adayı olarak, bu kaynakların kesintili doğası (intermittent nature) ve belirsizliğinin şebeke üzerinde yarattığı baskıyı iyi kavramalısınız. Güneşin bulutlanması veya rüzgârın aniden kesilmesi, üretimin kontrol edilebilirliğini ortadan kaldırarak arz güvenilirliği açısından büyük riskler doğurur.

Yakın tarihte yaşanan 2025 İberya Elektrik Kesintisi (Iberian Blackout), depolama kapasitesindeki boşluğun (storage gap) ne kadar kritik sonuçlar doğurabileceğini tüm dünyaya göstermiştir. Depolama olmadan, yenilenebilir enerji piyasasında karlılık "riskli" hale gelmekte ve sistem frekans stabilitesi tehlikeye girmektedir. Enerji depolama sistemleri, şebekeye şu üç temel sacayağını sağlar:

* **Kararlılık (Stability):** Üretim ve tüketim arasındaki anlık dengesizlikleri giderir, özellikle yüksek yenilenebilir penetrasyonunda bozulan frekans stabilitesini korur.
* **Esneklik (Flexibility):** Talebin aniden arttığı veya üretimin düştüğü "pik" anlarda milisaniyeler veya dakikalar içinde şebekeye destek verir.
* **Dayanıklılık (Resilience):** Büyük sistem arızalarında "Black Start" (siyah başlatma) kapasitesi sunarak şebekenin yeniden ayağa kalkmasını sağlar.

Bu kritik ihtiyaçları karşılamak amacıyla kullanılan teknolojileri, enerjiyi saklama biçimlerine göre kategorize etmek teknik bir zorunluluktur.

## 2. Enerji Depolama Teknolojilerinin Sınıflandırılması

![Sınıflandırma](/pdhes_site_gorselleri_webp/italya_dev_yercekimi_bataryasi/italya_dev_yercekimi_bataryasi_03.webp)

Görseldeki veriler ışığında, enerji depolama yöntemleri beş ana kategoride toplanır. Bir mühendis olarak, her kategorinin farklı bir tepki süresi ve deşarj süresi sunduğunu bilmelisiniz.

| Kategori | Örnek Teknolojiler |
| :--- | :--- |
| **Mekanik** | Pompaj Depolama (PHES), Flywheels (Volanlar), Sıkıştırılmış Hava (CAES), Sıvı Hava Enerji Depolama (LAES) |
| **Elektrokimyasal** | Lityum-iyon (Li-Ion), Metal-Hava (Metal Air), Sodyum-Nikel Klorür (Na-NiCl2), Akışlı Bataryalar (Flow Batteries) |
| **Kimyasal** | Hidrojen, Amonyak, Sentetik Doğal Gaz (SNG), Metanol |
| **Elektriksel** | Süperkapasitörler, Süperiletken Manyetik Enerji Depolama (SMES) |
| **Termal** | Gizli Isı (Latent), Duyulur Isı (Sensible), Termokimyasal Depolama |

Bu geniş yelpaze içinde mekanik depolama, özellikle PHES, dünyadaki operasyonel kapasitenin %98'ini oluşturarak en olgun teknoloji olarak öne çıkar.

## 3. Mekanik Depolamanın Dev Yapısı: Pompaj Depolama (PHES)

Pompaj depolamalı hidroelektrik sistemler (PHES), şebeke seviyesinde enerji depolamanın en yaygın ve olgun yöntemidir. Dünya genelindeki operasyonel depolama kapasitesinde sahip olduğu %98'lik pay, bu teknolojinin devasa ölçek avantajından kaynaklanır.

PHES ile Batarya Enerji Depolama Sistemleri (BESS) arasındaki farkı anlamak için Galler’deki Dinorwig tesisi örneğine bakmalısınız. Dinorwig, 9.1 GWh kapasitesi ile İngiltere şebekesindeki en büyük batarya projesinden yaklaşık 15 kat daha büyük bir kapasite sunar. Buradaki asıl ders şudur: BESS milisaniyelik stabilizasyon için mükemmelken, PHES devasa kapasite ve atalet (inertia) sağlayarak çok saatli dengeleme yapar. Bunlar rakip değil, birbirini tamamlayan teknolojilerdir.

## 4. PHES'in Çalışma Mekanizması ve Alt/Üst Rezervuar Mantığı

PHES, suyun potansiyel enerjisini yerçekimi yardımıyla kullanır. Bir tasarımcı için en kritik parametreler şunlardır:

* **Head (Elevasyon Farkı):** İki rezervuar arasındaki yükseklik farkıdır ve sistemin en temel tasarım kriteridir.
* **Penstock (Cebri Boru):** Suyu yüksek basınçla türbinlere taşıyan devasa çelik boru hattıdır.
* **Powerhouse (Santral Binası):** Enerji dönüşümünün kalbidir; burada türbinler, pompalar, jeneratörler ve motorlar bulunur.

Sistemin İki Temel Modu:

* **Pompalama Modu (Düşük Talep/Düşük Fiyat):** Elektriğin ucuz olduğu "off-peak" saatlerde, şebekeden alınan enerjiyle su alt rezervuardan üste taşınır. Enerji, potansiyel enerji formunda saklanır.
* **Deşarj Modu (Yüksek Talep/Yüksek Fiyat):** "Peak" saatlerde üst rezervuardaki su cebri borulardan aşağı bırakılır; suyun kinetik enerjisi türbinleri döndürerek sistemi tekrar elektrik enerjisine dönüştürür.

## 5. Enerji Dönüşümü ve Verimlilik (Sankey Analizi)

Hiçbir enerji dönüşümü kayıpsız değildir. Sankey diyagramı verilerine göre bir PHES döngüsünün verimlilik yolculuğu şöyledir:

* **Elektriksel Giriş:** %100
* **Depolanan Potansiyel Enerji:** %86.4 (Transformatör, motor ve pompa kayıpları sonrası)
* **Geri Kazanılan Elektrik:** %77.3 (Türbin, jeneratör ve boru hattı sürtünme kayıpları sonrası)

**Kritik Teknik Not:** Sistemdeki en verimsiz bileşenler pompa ve türbindir. Akış hızına ve "Head" seviyesine bağlı olarak bu bileşenlerin verimliliği %70'lere kadar düşebilir. Bu nedenle, türbin seçiminde (Gökçekaya örneğinde olduğu gibi) geniş çalışma aralığı sunan Francis tipi üniteler tercih edilir.

## 6. Özet ve Öğrenci İçin Anahtar Çıkarımlar

**Öğrenilmesi Gerekenler**

1. **Güç vs Enerji Ayırımı:** PHES sadece yüksek güç (MW) değil, uzun süreli (saatlerce süren) enerji (MWh) kapasitesi sunar. Gökçekaya gibi tesisler 7 saatlik pik süresi (peak duration) ile bataryaların çok ötesindedir.
2. **Atalet (Inertia) Avantajı:** Kimyasal pillerin (BESS) aksine PHES, dönen kütleleri sayesinde şebekeye doğal atalet sağlar. Bu, ani frekans düşüşlerini engellemek için hayati önemdedir.
3. **Hızlı Tepki ve Stratejik Karar:** PHES saniyeler/dakikalar içinde devreye girerek rüzgar forecast hatalarını (mismatch) minimize edebilir.

> **💡 Bilgi Notu:** Gökçekaya PSPP (Türkiye'nin Su Bataryası) JICA fizibilite raporuna göre planlanan Gökçekaya Pompaj Depolamalı Enerji Santrali, Türkiye için stratejik bir dönüm noktasıdır.
> 
> * **Kurulu Güç:** 1400 MW (Her biri 350 MW olan 4 adet ünite)
> * **Türbin Tipi:** Francis tipi reversible pompa-türbin.
> * **Önem:** Mevcut Gökçekaya Barajı'nı alt rezervuar olarak kullanarak maliyeti optimize eder ve rüzgâr/güneş hedeflerimiz için gereken esnekliği sağlar.

Geleceğin enerji şebekesi, PHES'in devasa kapasitesini milisaniyelik tepki veren BESS sistemleri ile birleştiren hibrit yapılar üzerine kurulacaktır. Bir mühendis olarak, bu iki teknolojinin aynı grid noktasında "co-location" (birlikte yerleşim) stratejisini nasıl optimize edeceğinizi şimdiden düşünmeye başlamalısınız.
`
  },
  {
    id: 'substack-pdhes-nedir',
    title: '# 01- Pompaj Depolamalı HES (PDHES) Nedir?',
    category: 'summary',
    author: 'Murathan Yeniceli',
    publishDate: '2026-07-07',
    readTime: 8,
    coverImage: '/pdhes_site_gorselleri_webp/gokcekaya_pompaj_depolama_bataryasi/gokcekaya_pompaj_depolama_bataryasi_01.webp',
    summary: 'PDHES, elektrik sisteminin fazla enerjisini suyun potansiyel enerjisine çeviren, ihtiyaç anında ise bu enerjiyi yeniden şebekeye veren büyük ölçekli “su bataryalarıdır”.',
    content: `![Görsel](/pdhes_site_gorselleri_webp/direncli_sebeke_mimarisi/direncli_sebeke_mimarisi_02.webp)

Görsel 1 - PDHES’in iki modlu çalışma mantığı: pompalama ve üretim.

Elektrik sistemi her saniye dengede kalmak zorundadır. Üretim tüketimden fazla olduğunda frekans yükselir, tüketim üretimden fazla olduğunda frekans düşer. Güneş ve rüzgar santrallerinin payı arttıkça bu dengeyi korumak daha zor hale gelir; çünkü üretim hava koşullarına bağlıdır, talep ise gün içinde farklı saatlerde zirve yapar. Pompaj Depolamalı Hidroelektrik Santraller (PDHES) tam bu noktada devreye girer: suyu iki rezervuar arasında hareket ettirerek elektriği saatler, günler ve bazı tasarımlarda daha uzun süreler için depolanabilir hale getirir.

Temel fikir basittir: ucuz veya fazla elektrik varken su alt rezervuardan üst rezervuara pompalanır; talep yükseldiğinde veya sistemin hızlı güce ihtiyacı olduğunda su üst rezervuardan aşağı bırakılır, türbin döner ve elektrik üretilir. Bu yüzden PDHES, batarya gibi “şarj” ve “deşarj” olur; farkı, depolama ortamının lityum hücreler değil, yükseklik farkı ve sudur.

**Tek cümlelik tanım**

PDHES, iki farklı kotta bulunan su hazneleri arasında suyu pompalar veya türbinler üzerinden akıtır; böylece elektrik enerjisini suyun potansiyel enerjisi olarak depolar ve gerektiğinde geri verir.

# 1\\. Şarj ve deşarj: sistemin iki modu

PDHES’in “şarj” modu pompalama modudur. Elektrik talebinin düşük, yenilenebilir üretimin yüksek veya piyasa fiyatının zayıf olduğu saatlerde sistem elektrik tüketir ve suyu yukarı taşır. “Deşarj” modu ise üretim modudur. Puant talep saatlerinde, üretim açığında veya yan hizmet ihtiyacı oluştuğunda su aşağı akıtılır ve türbin-jeneratör seti şebekeye güç verir.

![Görsel](/pdhes_site_gorselleri_webp/direncli_sebeke_mimarisi/direncli_sebeke_mimarisi_03.webp)

Görsel 2 - Çift yönlü döngü: şarj ve deşarjın aynı altyapıda birleşmesi.

Bu iki mod, elektrik sisteminde “zaman kaydırma” etkisi yaratır. Öğle saatlerinde güneş üretimi çok yüksek olduğunda veya gece saatlerinde talep düştüğünde oluşan fazla enerji, ilerideki puant saatlere taşınabilir. Bu nedenle PDHES, yalnızca bir üretim santrali değil, üretim ve tüketim saatlerini birbirine bağlayan bir esneklik altyapısıdır.

# 2\\. Makinenin kalbi: tersinir pompa-türbin

Modern PDHES tesislerinde en yaygın mimari, aynı hidrolik makinenin hem pompa hem türbin gibi çalışmasıdır. Tersinir Francis tipi pompa-türbinler, suyu yukarı basarken pompa, su aşağı inerken türbin gibi davranır. Bu yaklaşım ekipman sayısını azaltır, güç dönüşümünü sadeleştirir ve büyük ölçekli depolama için olgun bir mühendislik çözümü sunar.

![Görsel](/pdhes_site_gorselleri_webp/direncli_sebeke_mimarisi/direncli_sebeke_mimarisi_04.webp)

Görsel 3 - Tersinir Francis türbin/pompa mantığı.

Klasik sabit hızlı üniteler yıllardır güvenilir biçimde kullanılırken, yeni nesil değişken hızlı teknolojiler pompalama modunda da daha esnek çalışma imkanı verir. Bu durum özellikle frekans regülasyonu, hızlı güç ayarı ve değişken yenilenebilir üretimin takibi açısından önemlidir.

# 3\\. Açık devre mi, kapalı devre mi?

PDHES tesisleri su kaynakları ile ilişkisine göre iki ana gruba ayrılır. Açık devre sistemlerde rezervuarlardan en az biri doğal bir nehir, göl veya mevcut baraj sistemiyle hidrolojik ilişki içindedir. Kapalı devre sistemlerde ise iki rezervuar da doğal akarsu akışından büyük ölçüde bağımsızdır. Kapalı devre projeler, sucul ekosistem etkisini sınırlama ve izin süreçlerini daha yönetilebilir hale getirme potansiyeli nedeniyle güncel politika tartışmalarında daha fazla öne çıkar.

![Görsel](/pdhes_site_gorselleri_webp/direncli_sebeke_mimarisi/direncli_sebeke_mimarisi_05.webp)

Görsel 4 - Açık devre ve kapalı devre PDHES mimarileri.

Türkiye gibi mevcut baraj stoku güçlü ülkelerde açık devre veya mevcut HES’e entegre çözümler ilk fizibilite dalgası için cazip görünür. Bununla birlikte, yeni kapalı çevrim projeleri de özellikle topoğrafyanın uygun olduğu, şebeke bağlantısının güçlü olduğu ve çevresel etkilerin yönetilebilir kaldığı sahalarda stratejik değer taşıyabilir.

# 4\\. PDHES’in şebekeye verdiği hizmetler

![Görsel](/pdhes_site_gorselleri_webp/direncli_sebeke_mimarisi/direncli_sebeke_mimarisi_06.webp)

Görsel 5 - PDHES değer katmanları: enerji kaydırma, frekans, gerilim, Oturan Sistemin Toparlanması - black start ve yedek kapasite.

Bir PDHES’in gelir ve sistem değeri yalnızca elektrik fiyat farkından oluşmaz. Büyük senkron makineler sisteme ataletsel davranış, gerilim desteği ve kısa devre gücü katkısı sağlayabilir. İyi tasarlanmış bir tesis, işletme stratejisine bağlı olarak yan hizmetler pazarında frekans kontrolü, hızlı devreye girme, rezerv kapasite ve Oturan Sistemin Toparlanması - black start gibi kritik hizmetler sunabilir.

![Görsel](/pdhes_site_gorselleri_webp/direncli_sebeke_mimarisi/direncli_sebeke_mimarisi_07.webp)

Görsel 6 - Hızlı tepki ve şebeke güvenliği boyutu.

Bu çok katmanlı değer, PDHES’i lityum-iyon bataryalarla doğrudan rekabet eden tek bir teknoloji olmaktan çıkarır. Bataryalar milisaniye-saniye ölçeğinde çok hızlı tepki verir; PDHES ise saatlik-günlük enerji kaydırma, yüksek güç, uzun ömür ve sistem dayanımı tarafında güçlüdür. En doğru okuma, bu teknolojilerin birbirini ikame etmekten çok tamamlayıcı hale gelmesidir.

# 5\\. Ekonomik arbitraj basit, yatırım tezi daha geniş

Klasik gelir modeli düşük fiyatlı saatlerde pompalamak, yüksek fiyatlı saatlerde üretmektir. Ancak yenilenebilir ağırlıklı sistemlerde gelir modeli daha karmaşık hale gelir. Gün içi fiyat farkları, negatif fiyat riski, dengeleme güç piyasası, kapasite mekanizmaları ve yan hizmet ödemeleri birlikte değerlendirilmelidir. Bu nedenle PDHES fizibilitesi yalnızca enerji arbitrajı üzerinden yapılırsa yatırımın gerçek sistem değeri eksik görülebilir.

![Görsel](/pdhes_site_gorselleri_webp/direncli_sebeke_mimarisi/direncli_sebeke_mimarisi_08.webp)

Görsel 7 - Ekonomik arbitraj ve yük dengeleme mantığı.

# Sonuç: Su bataryası, esneklik altyapısıdır

PDHES’i yalnızca “barajdan elektrik üretmek” gibi okumak eksik kalır. Bu tesisler, elektrik sisteminin zaman boyutunu yönetir: fazla üretimi depolar, puantta güç verir, frekansa destek olur, gerilim davranışını güçlendirir ve gerektiğinde sistemin yeniden ayağa kalkmasına yardım eder. Güneş, rüzgar ve nükleer portföyünün büyüdüğü bir sistemde PDHES’in ana sorusu “üretebilir mi?” değil, “şebekeye ne kadar esneklik kazandırır?” olmalıdır.`
  },
  {
    id: 'substack-pdhes-yarisi',
    title: '# 02-Küresel PDHES Yarışı: Su Bataryaları Yeni Enerji Jeopolitiği',
    category: 'summary',
    author: 'Murathan Yeniceli',
    publishDate: '2026-07-07',
    readTime: 8,
    coverImage: '/pdhes_site_gorselleri_webp/birlesik_enerji_depolama_stratejisi/birlesik_enerji_depolama_stratejisi_01.webp',
    summary: 'Dünya hidroelektrik yatırımlarında ağırlık noktası değişiyor: pompaj depolama artık yalnızca eski bir depolama teknolojisi değil, yenilenebilir çağın ana şebeke esnekliği altyapılarından biri.',
    content: `Küresel elektrik sistemi üç baskı altında dönüşüyor: değişken yenilenebilir üretim artıyor, fosil yakıtlara bağımlılık azaltılmak isteniyor ve şebekelerin aynı anda hem daha esnek hem daha güvenilir çalışması bekleniyor. Bu üç baskının kesiştiği yerde pompaj depolamalı hidroelektrik santraller yeniden stratejik teknoloji haline geliyor.

GEM, IHA ve DOE/ORNL kaynakları üzerinden hazırlanan derin araştırma dosyaları, pompaj depolamanın küresel envanterde artık ayrı bir yatırım sınıfı olarak izlenmesi gerektiğini gösteriyor. İşletmedeki tesisler yanında inşaat, ön inşaat ve duyuru aşamasındaki kapasite de dikkat çekici büyüklüğe ulaşmış durumda.

![Görsel](/pdhes_site_gorselleri_webp/direncli_sebeke_mimarisi/direncli_sebeke_mimarisi_09.webp)

Görsel 1 - Küresel PDHES kapasite boru hattı: işletme, inşaat, ön inşaat ve anons edilmiş kapasite.

# 1\\. Sayılar ne söylüyor?

Mart 2026 GEM özetine göre dünya genelinde yaklaşık 196 GW işletmedeki pompaj depolamalı hidro kapasitesi bulunuyor. Buna karşılık inşaat aşamasında yaklaşık 248 GW, ön inşaat aşamasında 183 GW ve anons edilmiş projelerde yaklaşık 315 GW kapasite yer alıyor. Bu tablo, pompaj depolamanın “olgun ama durağan” bir teknoloji olmadığını; aksine yenilenebilir sistemlerin büyümesiyle tekrar ivme kazandığını gösteriyor.

Boru hattının ölçeği önemlidir; çünkü PDHES projeleri büyük inşaat işleri, çevresel izinler, şebeke bağlantısı ve finansman gerektirir. Bir projenin anons edilmesi ile ticari işletmeye geçmesi arasında uzun yıllar olabilir. Yine de kapasite büyüklükleri, ülkelerin sistem esnekliği meselesini artık yatırım planlarının merkezine aldığını ortaya koyuyor.

# 2\\. Liderlik tablosu: Çin, Japonya ve ABD

![Görsel](/pdhes_site_gorselleri_webp/direncli_sebeke_mimarisi/direncli_sebeke_mimarisi_10.webp)

Görsel 2 - İşletmedeki PDHES kapasitesinde ilk 15 ülke.

İşletmedeki PDHES kapasitesinde Çin açık ara liderdir. Japonya ve ABD ikinci grup liderleri oluşturur. Japonya’nın yüksek PDHES yoğunluğu tarihsel olarak sınırlı yerli enerji kaynakları, dağlık topoğrafya, nükleer/termal baz yük dönemleri ve puant yönetimi ihtiyacıyla ilişkilidir. ABD’de ise Bath County gibi çok büyük tesisler, uzun süredir bölgesel şebeke esnekliği için kritik rol oynamaktadır.

Avrupa’da İtalya, İspanya, Avusturya, Almanya, Fransa, İsviçre, Portekiz ve Birleşik Krallık öne çıkar. Bu ülkeler toplam hidro gücü bakımından her zaman küresel ilk sıralarda olmayabilir; ancak PDHES yoğunluğu açısından şebeke esnekliği stratejilerinde daha uzmanlaşmış örnekler sunar.

# 3\\. Toplam HES gücü ile PDHES uzmanlaşması aynı şey değil

![Görsel](/pdhes_site_gorselleri_webp/direncli_sebeke_mimarisi/direncli_sebeke_mimarisi_01.webp)

Görsel 3 - Seçilmiş ülkelerde geleneksel HES ve PDHES güç dengesi. Kapsam farkları veri setlerine göre değişebilir.

Hidroelektrik bakımından zengin olmak, otomatik olarak pompaj depolama lideri olmak anlamına gelmez. Brezilya ve Kanada gibi büyük doğal hidro rezervuar sistemlerine sahip ülkeler, uzun süre doğal depolama ve barajlı HES esnekliğiyle sistemlerini dengeleyebilmiştir. Buna karşılık Japonya gibi ülkelerde PDHES, büyük doğal su depolamasının eksik kaldığı alanlarda şebeke esnekliği çözümü olarak erken dönemde gelişmiştir.

![Görsel](/pdhes_site_gorselleri_webp/direncli_sebeke_mimarisi/direncli_sebeke_mimarisi_02.webp)

Görsel 4 - Toplam hidro portföyü içinde PDHES yoğunluğu. Türkiye’nin farkı: HES gücü güçlü, PDHES sıfır çizgisinde.

Bu ayrım Türkiye açısından çok önemlidir. Türkiye hidroelektrik kurulu gücü yüksek bir ülke olmasına rağmen, işletmedeki PDHES kapasitesi açısından küresel lider listelerinde yer almıyor. Dolayısıyla mesele “hidro var mı?” sorusundan çok “hidro esnekliği pompaj depolama ile yeni piyasa ve şebeke ihtiyaçlarına taşınabiliyor mu?” sorusudur.

# 4\\. Seçilmiş proje örnekleri: üç yatırım tipi

*   Dev ölçekli sistem omurgaları: Çin’de Fengning, ABD’de Bath County ve Avustralya’da Snowy 2.0 gibi projeler çok büyük güç ve enerji depolama kapasitesiyle sistem ölçeğinde çalışır.
    
*   Dağlık Avrupa esneklik merkezleri: Dinorwig, Grand’Maison, Goldisthal ve Nant de Drance gibi tesisler yüksek düşü, hızlı tepki ve şebeke hizmetleri açısından iyi örneklerdir.
    
*   Yenilenebilir entegrasyon projeleri: Hindistan Tehri, Endonezya Upper Cisokan ve Fas Abdelmoumen gibi projeler, yeni enerji dönüşümü bağlamında depolama ihtiyacına cevap verir.
    

![Görsel](/pdhes_site_gorselleri_webp/direncli_sebeke_mimarisi/direncli_sebeke_mimarisi_03.webp)

Görsel 5 - Küresel kapasite gösterge paneli infografiği.

# 5\\. Veri kalitesi: açık envanterin sınırları

Derin araştırma dosyaları bir başka önemli noktayı da ortaya koyuyor: küresel PDHES envanterinde bazı alanlar sistematik biçimde eksik kalabiliyor. Proje adı, ülke, durum, kurulu güç ve koordinat gibi alanlar çoğu zaman izlenebilirken; MWh depolama kapasitesi, rezervuar poligonları, nihai maliyet, türbin teknolojisinin ayrıntısı ve geçmiş toplam kullanım verisi her tesis için standart açık veri olarak bulunmuyor.

Bu nedenle iyi bir PDHES veri tabanı, yalnızca santral listesinden ibaret olmamalıdır. Her kayıt için durum, güç, enerji kapasitesi, düşü, rezervuar tipi, çevrim tipi, teknoloji, şebeke bağlantısı, sahiplik, lisans aşaması ve kaynak güven düzeyi ayrı ayrı tutulmalıdır. “N/A” bırakılan alanlar zayıflık değil; tahminle doldurulmaması gereken veri kalitesi uyarılarıdır.

![Görsel](/pdhes_site_gorselleri_webp/direncli_sebeke_mimarisi/direncli_sebeke_mimarisi_04.webp)

Görsel 6 - Hidrolik kurulu güç ve PDHES mukayese tablosundan sayfa görüntüsü. Kaynak: Küresel PDHES Envanter Analizi.pdf, s.3.

# Sonuç: Yeni hidroelektrik dalgası depolama merkezli

PDHES küresel ölçekte eski bir teknolojinin yeniden keşfi değil; yeni enerji sisteminin ihtiyaçlarına göre yeniden konumlanmasıdır. Büyük ölçek, uzun ömür, saatlik-günlük depolama, yüksek güç ve şebeke hizmetleri birleştiğinde, pompaj depolama birçok ülke için stratejik altyapı haline gelir. Küresel liderlerin ortak dersi açıktır: yenilenebilir kurulu gücü artırmak kadar, bu gücü taşıyacak esneklik ve depolama omurgasını kurmak da enerji güvenliğinin parçasıdır.`
  },
  {
    id: 'substack-pdhes-yol-haritasi',
    title: '# 03-Türkiye’nin Su Bataryası Yol Haritası: 2035 İçin PDHES Stratejisi',
    category: 'summary',
    author: 'Murathan Yeniceli',
    publishDate: '2026-07-07',
    readTime: 8,
    coverImage: '/pdhes_site_gorselleri_webp/turkiye_pdhes_yatirim_yol_haritasi/turkiye_pdhes_yatirim_yol_haritasi_01.webp',
    summary: '2035’e giden yolda soru şudur: mevcut baraj stoku nasıl şebeke bataryasına dönüştürülür?',
    content: `![Görsel](/pdhes_site_gorselleri_webp/direncli_sebeke_mimarisi/direncli_sebeke_mimarisi_05.webp)

Görsel 1 - Türkiye’nin Avrupa içindeki potansiyel konumunu anlatan infografik.

Türkiye’nin elektrik sistemi, bir yandan güçlü hidroelektrik mirasına, diğer yandan hızla artan rüzgar ve güneş portföyüne sahip. Bu iki gerçek birlikte okunduğunda, pompaj depolamalı hidroelektrik santraller yalnızca yeni bir yatırım kalemi değil, sistem planlamasının stratejik boşluğunu dolduracak bir esneklik aracı olarak görünür.

Derin araştırma ve strateji dosyalarında Türkiye için tekrar eden temel tespit şudur: toplam HES kurulu gücü yüksek olmasına rağmen işletmedeki PDHES kapasitesi yoktur. Bu tablo, Türkiye’yi bir eksiklik kadar bir fırsatla da karşı karşıya bırakır. Çünkü mevcut barajlar, güçlü iletim omurgası ve dağlık topoğrafya, doğru proje seçimi yapılırsa hızlı öğrenme sağlayabilecek bir başlangıç portföyü sunabilir.

**Türkiye tezi**

Türkiye’nin ilk PDHES dalgası, sıfırdan dev projelerden önce mevcut barajlı HES sistemlerinde pompaj kabiliyeti, alt hazne, şalt bağlantısı ve çevresel uygunluk açısından en yüksek fizibiliteye sahip adayları seçerek başlamalıdır.

# 1\\. Neden şimdi?

Rüzgar ve güneş kurulu gücü arttıkça üretim profili daha değişken hale gelir. Öğle saatlerinde güneş üretimi yüksek, akşam puantında talep yüksek, gece saatlerinde ise talep düşük olabilir. Sistemde nükleer gibi baz yük karakterli üretim de büyürse, düşük talep saatlerinde esneklik ihtiyacı daha görünür hale gelir. PDHES bu fazla enerjiyi üst rezervuara taşıyarak arz-talep dengesini saatler arasında köprüler.

![Görsel](/pdhes_site_gorselleri_webp/direncli_sebeke_mimarisi/direncli_sebeke_mimarisi_06.webp)

Görsel 2 - Yenilenebilir enerji yükselişi ve şebeke kararlılığı boşluğu.

Bu nedenle PDHES, Türkiye için yalnızca enerji depolama değil, aynı zamanda dengeleme, yan hizmet, sistem toparlanması ve şebeke dayanımı meselesidir. Bataryalar hızlı tepki için çok değerlidir; fakat yüksek güçlü ve uzun süreli enerji kaydırma söz konusu olduğunda PDHES’in ölçek avantajı ayrı bir kategori oluşturur.

# 2\\. Aday yaklaşım: önce mevcut hidro varlıklar

![Görsel](/pdhes_site_gorselleri_webp/direncli_sebeke_mimarisi/direncli_sebeke_mimarisi_07.webp)

Görsel 3 - Türkiye’de PDHES potansiyeli ve hedef proje anlatısı.

Türkiye için ilk mantıklı tarama alanı mevcut barajlı HES varlıklarıdır. Çünkü bu sahalarda su yapıları, yol erişimi, iletim bağlantısı, işletme deneyimi ve hidrolojik veri çoğu zaman zaten vardır. Eksik halka, pompaj çevrimine uygun ikinci rezervuar, yeterli düşü, çevresel izin ve ekonomik işletme modelidir.

Strateji dosyalarında Gökçekaya, Altınkaya, Oymapınar, Ulubat ve deniz suyu opsiyonları farklı senaryolar olarak işleniyor. Bu tür portföy yaklaşımı doğru bir yöntemdir; çünkü Türkiye’nin ilk PDHES hamlesi tek bir “en büyük proje” arayışıyla değil, farklı topoğrafya ve işletme tiplerini temsil eden kontrollü bir proje sepetiyle ilerlemelidir.

![Görsel](/pdhes_site_gorselleri_webp/direncli_sebeke_mimarisi/direncli_sebeke_mimarisi_08.webp)

Görsel 4 - Altınkaya ve Gökçekaya konseptlerinin karşılaştırmalı anlatımı.

# 3\\. Gökçekaya neden iyi bir pilot anlatısı veriyor?

Gökçekaya, dosyalardaki görsel strateji setlerinde “yatırıma yakın aday” olarak öne çıkarılıyor. Bunun nedeni, mevcut baraj altyapısı, şebeke bağlantısı ve teknik dönüşüm senaryosu ile bir pilot öğrenme alanı sunmasıdır. Ancak bu tür adaylarda nihai karar için sadece kurulu güç değil; su seviyesi rejimi, alt hazne davranışı, çevresel etkiler, iletim kısıtları, pompa/türbin seçimi ve piyasa gelir modeli birlikte değerlendirilmelidir.

![Görsel](/pdhes_site_gorselleri_webp/direncli_sebeke_mimarisi/direncli_sebeke_mimarisi_09.webp)

Görsel 5 - Gökçekaya PDHES yatırım anlatısı.

Pilot proje, sadece elektrik üretmek için değil, Türkiye’nin PDHES standartlarını belirlemek için de kritik olur. Fizibilite şablonu, çevresel değerlendirme yöntemi, kamu-özel finansman modeli, yan hizmet gelirleri, yerli ekipman kapasitesi ve işletme protokolleri ilk pilotla birlikte kurumsallaşır.

# 4\\. Üç proje ailesi: klasik dönüşüm, kapalı çevrim, deniz suyu

![Görsel](/pdhes_site_gorselleri_webp/direncli_sebeke_mimarisi/direncli_sebeke_mimarisi_10.webp)

Görsel 6 - Klasik kaskat/kapanlı çevrim ile deniz suyu kapalı çevrim seçenekleri.

Türkiye’nin PDHES portföyü üç ailede ele alınabilir. Birinci aile mevcut HES dönüşümleridir: barajlı HES sistemine pompaj çevrimi kazandırılır. İkinci aile karasal kapalı çevrim projelerdir: doğal akarsu etkisi sınırlı, iki yapay rezervuar üzerinden çalışır. Üçüncü aile deniz suyu PDHES seçenekleridir: deniz alt rezervuar gibi kullanılır, yüksek kotlu kıyı topoğrafyasında ayrı bir fırsat penceresi açılır.

![Görsel](/pdhes_site_gorselleri_webp/direncli_sebeke_mimarisi/direncli_sebeke_mimarisi_01.webp)

Görsel 7 - Deniz suyu PDHES vizyonu.

Deniz suyu seçeneği teknik olarak çekicidir; ancak korozyon, deniz ekosistemi, kıyı kullanımı, turizm ve çevresel izinler nedeniyle daha ihtiyatlı ele alınmalıdır. Bu nedenle ilk dalga projelerde mevcut baraj dönüşümleri ve karasal kapalı çevrim adayları daha hızlı öğrenme sağlayabilir; deniz suyu projeleri ise Ar-Ge ve pilot değerlendirme kulvarında ilerleyebilir.

# 5\\. Yerli sanayi ve maliyet penceresi

![Görsel](/pdhes_site_gorselleri_webp/direncli_sebeke_mimarisi/direncli_sebeke_mimarisi_02.webp)

Görsel 8 - Maliyet ve yerli üretim avantajı anlatısı.

PDHES projelerinde maliyet yalnızca elektromekanik ekipmandan oluşmaz; tünel, cebri boru, rezervuar, şalt, trafo, iletim bağlantısı, jeoloji ve inşaat riski büyük pay tutar. Buna rağmen yerli inşaat kabiliyeti, hidroelektrik tecrübesi ve elektromekanik tedarik zincirinin geliştirilmesi Türkiye için stratejik bir sanayi politikası fırsatı doğurur.

Yerli üretim avantajı iddiası, gerçekçi bir yerlileştirme takvimiyle desteklenmelidir. Pompa-türbin tasarımı, motor-jeneratör, güç elektroniği, kontrol sistemleri, SCADA/otomasyon ve model test altyapısı için üniversite, kamu ve özel sektör birlikte çalışmalıdır. Aksi halde inşaat yerli kalsa bile kritik teknolojiler ithal paket olarak kalabilir.

# 6\\. Piyasa tasarımı: yatırımın gelir modeli net olmalı

![Görsel](/pdhes_site_gorselleri_webp/direncli_sebeke_mimarisi/direncli_sebeke_mimarisi_03.webp)

Görsel 9 - Arbitraj modeli ve finansal akış.

PDHES yatırımının finansmanı için enerji arbitrajı tek başına yeterli olmayabilir. Yatırımcı veya kamu modeli; kapasite değeri, yan hizmet gelirleri, dengeleme katkısı, sistem toparlanma hizmeti ve arz güvenliği faydasını birlikte görebilmelidir. Bu nedenle Türkiye’de PDHES için piyasa tasarımı ve sistem işletmecisi ihtiyaçları aynı masada ele alınmalıdır.

![Görsel](/pdhes_site_gorselleri_webp/direncli_sebeke_mimarisi/direncli_sebeke_mimarisi_04.webp)

Görsel 10 - PDHES proje önceliklendirme matrisi: teknik avantaj, risk ve stratejik mantık.

# 7\\. 2035 yol haritası

![Görsel](/pdhes_site_gorselleri_webp/direncli_sebeke_mimarisi/direncli_sebeke_mimarisi_05.webp)

Görsel 11 - 2026-2035 için önerilen PDHES yol haritası.

Birinci aşama veri ve ön fizibilitedir. Türkiye’de mevcut HES’ler, topoğrafya, rezervuar davranışı, iletim bağlantısı ve çevresel kısıtlar tek bir GIS/veri tabanında puanlanmalıdır. İkinci aşama pilot projelerdir. En güçlü birkaç aday için ön mühendislik, çevresel etki ve piyasa modeli birlikte olgunlaştırılmalıdır. Üçüncü aşama ihale ve yerli sanayi paketidir. Dördüncü aşama ise PDHES’i RES/GES, nükleer ve yan hizmet piyasalarıyla tam sistem entegrasyonuna taşır.

# Sonuç: Türkiye’nin su bataryası planı bir altyapı programı olmalı

Türkiye’nin PDHES meselesi tek bir santral yatırımından daha büyüktür. Bu, 2035’e doğru elektrik sisteminin esnekliğini, arz güvenliğini, yenilenebilir entegrasyonunu ve yerli sanayi kapasitesini birlikte ele alan bir altyapı programı olmalıdır. Doğru başlangıç noktası, mevcut hidro varlıkları ve şebeke ihtiyaçlarını birlikte analiz eden disiplinli bir portföy yaklaşımıdır. İlk proje yalnızca MW üretmeyecek; Türkiye’nin su bataryası standardını da belirleyecektir.`
  }
];
