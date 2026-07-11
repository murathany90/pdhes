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
    content: `## Giriş ve Mevzuatın Mevcut Durumu (EDT/EDÜ)
Türkiye’nin enerji dönüşüm stratejisi, ne yazık ki teknolojik tarafsızlıktan uzaklaşarak spesifik bir "kimyasal depolama" fetişizmine hapsolmuş durumdadır. Enerji Piyasası Düzenleme Kurumu (EPDK) tarafından şekillendirilen Elektrik Depolama Tesisi (EDT) ve Elektrik Depolama Ünitesi (EDÜ) mevzuatları, kâğıt üzerinde teknoloji bağımsız bir illüzyon yaratsa da fiiliyatta yalnızca lityum-iyon batarya sistemlerini destekleyecek şekilde kurgulanmıştır. Dünyada uzun süreli enerji depolamanın ve şebeke esnekliğinin omurgasını oluşturan, uluslararası ölçekte %90'ın üzerinde pazar payına sahip Pompaj Depolamalı Hidroelektrik Santralleri (PDHES) ise bu düzenlemelerin kasıtlı ya da vizyonsuz bir biçimde tamamen dışında bırakılmıştır. Mevzuatın bu denli kısa süreli batarya depolamasına odaklanması, Türkiye'nin kendi eşsiz topografik ve hidrolojik avantajlarını elinin tersiyle itmesi anlamına gelmekte; artan rüzgâr ve güneş kapasitesinin yaratacağı şebeke dalgalanmalarına karşı ülkeyi derin ve tehlikeli bir enerji politikası zafiyetiyle baş başa bırakmaktadır.

## Küresel Pompaj Depolama Stratejileri (Çin, Japonya, ABD, İtalya Örnekleri)
Türkiye'nin düştüğü bu stratejik körlüğün aksine, değişken yenilenebilir enerji üretimindeki agresif büyümeyi yönetmek zorunda olan küresel güçler, rotayı çoktan yeniden "su bataryalarına" çevirmiştir. Bugün Çin, planlı ekonomi, kapasite ödemeleri ve iletim tarifesine yansıtılan maliyet geri kazanım modelleriyle 600 GW'ı aşan bir PDHES geliştirme hattının tartışmasız lokomotifidir. Japonya, coğrafi kısıtlarına rağmen nükleer ve yenilenebilir enerjisini dengelemek için on yıllardır devasa PDHES kapasitesini şebekenin ana sigortası olarak kullanmaktadır. ABD, federal vergi kredileri ve piyasa erişimi (enerji arbitrajı ve yan hizmetler) yoluyla eski tesisleri modernize edip yenilerini teşvik ederken; İtalya ve genel olarak Avrupa Birliği, enerji arz güvenliğini ithal lityum tedarik zincirine mahkûm etmenin risklerini görerek sınır ötesi devasa su bataryası projelerini stratejik altyapı kabul etmektedir. Bu ülkeler, hidroelektrik potansiyellerini şebeke esnekliği için kalkan yaparken, Türkiye'nin elindeki potansiyeli spesifik regülasyon eksikliği nedeniyle atıl bırakması kabul edilemez bir yönetim zaafiyetidir.

## Türkiye'deki Lobi Faaliyetleri ve Teknoloji Tercihleri
Bu stratejik sapmanın temelinde yalnızca bürokratik atalet değil, enerji piyasasını domine eden dar görüşlü ticari çıkarlar yatmaktadır. Türkiye'de depolama mevzuatının ve teşvik mimarisinin "batarya lobisi" olarak adlandırılabilecek pil üreticileri, invertör tedarikçileri ve kısa vadeli kâr marjlarına odaklanan EPC (Mühendislik, Tedarik ve Kurulum) firmaları tarafından tahakküm altına alındığı açık bir gerçektir. Bu lobinin oluşturduğu rüzgârla, faydalı ömrü 10-15 yılla sınırlı, hammadde bakımından dışa bağımlı ve yangın/geri dönüşüm riskleri taşıyan kimyasal bataryalara yasal zemin ve kapasite tahsisi "jet hızıyla" sağlanırken; ömrü 50 ila 80 yıl arasında değişen, yüksek yerlilik oranına sahip ve şebekeye devasa bir mekanik atalet sağlayan PDHES'ler hantal bürokrasinin dehlizlerinde boğulmaktadır. Devletin uzun vadeli enerji politikası ve arz güvenliği, ithal teknoloji mümessillerinin ticari ajandalarına teslim edilemez.

## Gökçekaya Projesi ve Teşvik (YEKDEM) Çelişkileri
Sistemdeki bu akıl tutulmasının en somut ve acı kanıtı, EÜAŞ tarafından 2020 yılında büyük bir vizyonla duyurulan 1 milyar dolarlık Gökçekaya PDHES projesinin akıbetidir. Şebekenin şiddetle ihtiyaç duyduğu bu devasa kapasite, yıllardır yatırım kararı alınamadan kâğıt üzerinde bekletilirken; batarya entegreli rüzgâr ve güneş santrallerine önlisans süreçlerinde öncelik tanınması ve kapasite tahsislerinin hızla yapılması devasa bir çelişkidir. Şebekeye milisaniyelik tepki verecek kimyasal bataryaların gerekliliği elbette yadsınamaz; ancak koca bir ülkenin baz yük esnekliğini ve uzun süreli (saatler/günler boyu) dengeleme ihtiyacını Gökçekaya, Altınkaya gibi dev projeleri rafa kaldırıp yalnızca ithal batarya konteynerleriyle çözmeye çalışmak mühendislik bilimine aykırıdır. Batarya yatırımlarına sağlanan regülatif kolaylıklar ve entegre YEKDEM teşvikleri, neden yerli müteahhitlik ve elektromekanik gücüyle inşa edilecek stratejik PDHES yatırımlarından esirgenmektedir?

## Sonuç ve Politika Önerileri
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
    content: `## Yenilenebilir Enerjinin "Depolama Paradoksu"

28 Nisan 2025 tarihinde İber Yarımadası’nda ışıklar ansızın söndü. İspanya’nın güneyinde başlayan ve saniyeler içinde Portekiz’e yayılan bu zincirleme arıza, Avrupa’nın son yirmi yılda gördüğü en şiddetli şebeke krizlerinden biri olarak tarihe geçti. Trenlerin durduğu, hastanelerin sarsıldığı bu karanlık saatler, modern enerji stratejimizin kalbindeki o can alıcı soruyu sormamıza neden oldu: Değişken yenilenebilir kaynaklar üzerine bir sistem inşa edip "depolama" ihtiyacını bir yan unsur olarak görürseniz ne olur?

Küresel enerji talebinin 2018'de %2,3 artması ve buna bağlı olarak CO2 emisyonlarının %1,7 yükselmesi, dünyayı kritik bir eşiğe getirdi. Küresel ısınmayı 2°C'nin altında tutmak için 2030'a kadar emisyonları %25 azaltmak zorundayız. Türkiye, bu vizyonla 20 GW rüzgar enerjisi hedefi koymuş durumda. Ancak rüzgarın belirsiz doğası, depolamayı bir "tercih" olmaktan çıkarıp, şebeke güvenilirliği için teknik bir zorunluluk haline getiriyor.

## Ölçek Farkı: Dinorwig vs. BESS (Devasa Kapasite Gerçeği)

Enerji dünyasında "batarya" terimi genellikle tek bir teknolojiyi simgeliyor gibi kullanılsa da, bu büyük bir yanılgıdır. Lityum iyon batarya sistemleri (BESS) ile Pompaj Depolamalı Hidroelektrik Santraller (PDHES) farklı liglerde oynar. Kuzey Galler’deki Elidir Fawr dağının içine oyulmuş olan Dinorwig Santrali, bu ölçek farkının en çarpıcı kanıtıdır.

Dinorwig, 1.728 MW güç ve tam 9,1 GWh depolama kapasitesine sahiptir. 2025 yılı itibarıyla Birleşik Krallık’ın en büyük batarya projesinin 600 MWh kapasiteye ulaştığı düşünüldüğünde, Dinorwig tek başına en büyük bataryadan 15 kat daha büyüktür. Bu fark, fonksiyonları da belirler: BESS milisaniyeler içinde şebekeyi dengelerken, PDHES saatler ve hatta günler boyu süren devasa enerji ihtiyacını karşılayan bir "enerji demiri" görevi görür.

Birleşik Krallık'ta uzun süredir durma noktasında olan depolama yatırımları, Ofgem'in "cap-and-floor" (tavan ve taban fiyat) mekanizmasının devreye girmesiyle yeniden canlandı. Bu model, yatırımcılara gelir tabanı garantisi sağlayarak riskleri minimize etmiş ve İskoçya’da 8 GW’lık yeni bir PDHES projesi hattının oluşmasını tetiklemiştir.

## Gökçekaya: Türkiye’nin Uyuyan Devi

Türkiye, Avrupa'nın en yüksek PDHES potansiyeline sahip olmasına rağmen henüz bu alanda çalışan bir tesise sahip değil. Japonya Uluslararası İşbirliği Ajansı (JICA) tarafından fizibilite çalışmaları tamamlanan Gökçekaya PDHES projesi, stratejik bir öneme sahip. Karışık Tam Sayılı Doğrusal Programlama (MILP) yöntemiyle gerçekleştirilen optimizasyon analizleri, bu projenin teknik ve finansal verimliliği hakkında ezber bozan sonuçlar sunuyor:

* Kapasite ve Yapı: 1400 MW toplam güç (4 adet 350 MW Francis tipi reversible ünite).
* Operasyonel Aralık: Üst rezervuarda 770m ile 800m su seviyesi arasında esnek çalışma.
* Verimlilik Mühendisliği: Sisteme ana ünitelerin yanında 60-100 MW kapasiteli küçük bir pompa ünitesinin eklenmesi, özellikle düşük enerji farklarının (low energy differences) olduğu durumlarda sistemin verimliliğini dramatik şekilde optimize etmektedir.

Analizlerin en şaşırtıcı bulgusu ise "Ocak Ayı Sürprizi"dir. MILP optimizasyonu sonuçlarına göre, Gökçekaya modelinde Ocak ayı operasyonları, Ağustos ayına göre daha karlıdır. Bu durum soğuk havalardan ziyade, kış aylarındaki elektrik piyasası fiyatlarının (market clearing price) sergilediği yüksek volatiliteden kaynaklanır. PDHES, fiyat dalgalanmalarını arbitraj yeteneğiyle kâra dönüştürme konusunda bataryalardan çok daha derin bir kapasite sunar.

## Rakip Değil, Ortak: PDHES ve Bataryaların Simbiyotik İlişkisi

İberya’daki kesinti, sadece depolamanın değil, depolama çeşitliliğinin önemini kanıtladı. Kesinti anında PDHES üniteleri sistemi tek başına kurtaramadı; çünkü suyun türbinlere ulaşması ve sistemin tepki vermesi saniyeler sürer. Oysa şebekenin o kritik saniyede "milisaniyelik" bir müdahaleye ihtiyacı vardı.

Burada bir "vücut" benzetmesi yapmak mümkündür: BESS şebekenin sinir sistemidir; milisaniyeler içinde tepki vererek anlık şokları emer (fast frequency response). PDHES ise şebekenin kas sistemidir; saatler boyu süren yükü sırtlar ve bulk güç yönetimini sağlar. Türkiye’nin 20 GW’lık rüzgar yükünü stabilize etmek için bu iki teknolojinin simbiyotik ilişkisine ihtiyacı var.

APREN Başkanı'nın Portekiz Enerji Depolama Forumu'nda vurguladığı gibi: "Ülke belirleyici bir momenttedir ve depolama, ulusal enerji önceliklerinin merkezi olan tek noktadır."

## Asıl Engel Teknoloji Değil, Piyasa Tasarımı

Ember verilerine göre, şebeke ölçeğindeki (utility-scale) BESS maliyetlerinin 125 \$/kWh seviyelerine gerilemesi, teknolojinin "pahalı" olduğu mitini yıktı. Ancak bir enerji stratejisti için asıl mesele ekipman maliyeti değil, sermaye maliyetidir.

### Teknoloji Hazır, Mevzuat Tutuk
 Lityum iyon fiyatları düşse de, Portekiz gibi ülkelerde bankalanabilir bir gelir çerçevesinin (revenue framework) eksikliği yatırımları frenliyor. Teknik olarak mümkün olan bir projenin finanse edilebilir olması için piyasa tasarımının netleşmesi şarttır.

### Finansmanın Görünmez Engeli: WACC
 Yatırım kararlarındaki asıl belirleyici faktör, Ağırlıklı Ortalama Sermaye Maliyeti'dir (WACC). Portekiz’de bu oran %8-9 seviyelerindeyken, İngiltere’deki "cap-and-floor" gibi mekanizmalar sayesinde oran %5,5-6,5 bandına çekilebilmiştir. Bu fark, milyar dolarlık enerji projelerinde "başarı" ile "iflas" arasındaki çizgiyi belirler. Türkiye’nin sadece mühendislik çözümlerine değil, riskleri yöneten finansal modellere odaklanması gerekmektedir.

## Sonuç: Geleceğin Şebekesini Kim Yönetecek?

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
    content: `## Yönetici özeti

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
    content: `## 1. PDHES neden yeniden stratejik önem kazandı?

Rüzgâr ve güneş enerjisinin elektrik üretimindeki payı arttıkça güç sisteminin ihtiyaç duyduğu esnekliğin niteliği değişmektedir. Geleneksel elektrik sistemlerinde üretim programı büyük ölçüde talebe göre ayarlanırken, yüksek yenilenebilir enerji payına sahip sistemlerde üretim ile tüketim arasındaki denge artık yalnızca santral yüklerinin artırılıp azaltılmasıyla sağlanamamaktadır.

Gün içinde güneş üretiminin hızla yükselmesi, akşam saatlerinde aynı hızla düşmesi, rüzgâr üretiminin tahminlerden sapması ve büyük üretim birimlerinin beklenmedik biçimde devreden çıkması; şebekede hem hızlı güç desteği hem de saatler boyunca sürdürülebilen enerji desteği gerektirir.

**Pompaj Depolamalı Hidroelektrik Santral (PDHES)**, bu iki ihtiyacı aynı altyapıda birleştirebilen az sayıdaki teknolojiden biridir.

PDHES’in çalışma ilkesi basittir:

* Elektrik üretiminin fazla veya fiyatın düşük olduğu saatlerde su, alt rezervuardan üst rezervuara pompalanır.
* Elektrik ihtiyacının veya sistem stresinin arttığı saatlerde üst rezervuardaki su türbinlerden geçirilerek yeniden elektrik üretilir.
* Böylece elektrik enerjisi, suyun yükseltiye bağlı potansiyel enerjisi olarak depolanır.

Ancak modern bir PDHES yalnızca “ucuz saatte pompalayan, pahalı saatte üreten” bir tesis değildir. Doğru makine, güç elektroniği ve kontrol sistemiyle tasarlandığında aynı tesis:

* Frekans kontrolü,
* Gerilim ve reaktif güç desteği,
* Dönen yedek,
* Hızlı yük alma ve yük atma,
* Fiziksel veya denetim tabanlı atalet desteği,
* Otomatik üretim kontrolü,
* Oturan sistemin toparlanması,
* Yenilenebilir enerji kısıntısının azaltılması,
* İletim şebekesindeki sıkışıklığın yönetilmesi

gibi çok sayıda hizmeti birlikte sunabilir.

Bu nedenle PDHES değerlendirmesi yalnızca depolama kapasitesi üzerinden değil, **enerji, güç, hız, esneklik ve şebeke hizmetleri** birlikte ele alınarak yapılmalıdır.

## 2. Güç, enerji ve depolama süresi nasıl belirlenir?

Bir PDHES’in anlık üretim gücü yaklaşık olarak aşağıdaki ilişkiyle ifade edilir:

**P = ρ × g × Q × Hnet × η**

Burada:

* **ρ**, suyun yoğunluğunu,
* **g**, yerçekimi ivmesini,
* **Q**, türbinden geçen su debisini,
* **Hnet**, net düşüyü,
* **η**, türbin, jeneratör ve ilgili ekipmanların toplam verimini

ifade eder.

Bu bağıntının mühendislik anlamı şudur:

> Aynı debide daha yüksek net düşü, aynı düşüde ise daha yüksek debi daha fazla güç üretir.

Depolanabilecek toplam enerji ise yaklaşık olarak kullanılabilir su hacmi ile net düşüye bağlıdır:

**E ≈ ρ × g × V × Hnet × η**

Buradaki **V**, üretimde kullanılabilecek etkin su hacmidir.

Bir tesisin depolama süresi ise kullanılabilir enerji kapasitesinin anma gücüne oranıyla değerlendirilir:

**Depolama süresi = Kullanılabilir enerji / Anma gücü**

Örneğin 1.000 MW güce ve 8.000 MWh kullanılabilir enerjiye sahip bir tesis, teorik olarak tam güçte yaklaşık sekiz saat üretim yapabilir.

Ancak gerçek işletmede bu süre sabit değildir. Aşağıdaki etkenlere göre değişir:

* Üst ve alt rezervuar seviyeleri,
* Değişen brüt ve net düşü,
* Su yollarındaki sürtünme kayıpları,
* Türbinin kısmi yük verimi,
* Reaktif güç işletmesi,
* Çevresel veya hidrolojik kısıtlar,
* İşletme için ayrılması gereken asgari su rezervi.

Bu nedenle yalnızca rezervuar hacmi üzerinden yapılan enerji hesabı yeterli değildir. Fizibilite çalışmalarında **dinamik rezervuar seviyesi, hidrolik kayıplar ve makine verim haritaları** birlikte kullanılmalıdır.

## 3. Brüt düşü ile net düşü arasındaki fark

Üst ve alt rezervuar su seviyeleri arasındaki geometrik fark **brüt düşü** olarak adlandırılır. Türbinin gerçekten kullanabildiği yükseklik ise su iletim sistemindeki kayıplar çıkarıldıktan sonra kalan **net düşüdür**.

Başlıca kayıp kaynakları şunlardır:

* Su alma yapıları,
* Izgaralar ve giriş geometrisi,
* Tünel ve cebri borulardaki sürtünme,
* Dirsekler, çatallar ve çap değişimleri,
* Vana ve kapaklar,
* Kuyruk suyu kanalı,
* Geçici rejimde oluşan ilave basınç kayıpları.

Su yolu kayıpları debinin yaklaşık karesiyle arttığından, tesis tam güce yaklaştıkça net düşüdeki azalma belirginleşebilir. Bu nedenle türbin gücü yalnızca sabit bir düşü değeriyle hesaplanmamalıdır.

Ayrıca uzun tünel ve cebri boru sistemlerinde ani yük değişimleri **su darbesi** ve basınç salınımlarına yol açabilir. Denge bacası, hava yastıklı denge odası, vana kapanma süreleri ve türbin denetim sistemi bu geçici olaylara göre tasarlanmalıdır.

## 4. PDHES makine teknolojileri

PDHES’in şebekeye sağlayabileceği hizmetlerin büyük bölümü seçilen makine yapısına bağlıdır. Günümüzde dört temel çözüm öne çıkmaktadır:

1. Sabit devirli tersinir pompa-türbin,
2. Çift beslemeli değişken devirli makine,
3. Tam güçlü dönüştürücüye bağlı değişken devirli makine,
4. Üç makineli düzen.

### 4.1. Sabit devirli tersinir pompa-türbin

Bu yapıda aynı hidrolik makine pompa ve türbin olarak kullanılır. Makine genellikle senkron motor-jeneratöre mekanik olarak bağlıdır.

Başlıca avantajları:

* Teknolojinin olgun ve yaygın olması,
* Görece sade elektriksel yapı,
* Büyük güçlerde kanıtlanmış işletme deneyimi,
* Üretim modunda güçlü frekans ve gerilim desteği,
* Senkron makine nedeniyle doğal fiziksel atalet sağlamasıdır.

Temel sınırlaması pompalama modunda ortaya çıkar. Sabit devirli pompa-türbinin çektiği güç, su seviyesi ve sistem koşullarına bağlı olarak değişse de işletmeci tarafından geniş ve sürekli bir aralıkta ayarlanamaz.

Bu nedenle sabit devirli bir ünite:

* Üretim sırasında etkin güç ayarı yapabilir,
* Pompalama sırasında ise çoğunlukla belirli bir çalışma noktasına bağlı kalır.

Frekans düşüşü sırasında pompalama tüketimini kademeli olarak azaltma kabiliyeti sınırlıdır. Gerekirse pompa tamamen devreden çıkarılabilir; ancak bu işlem sürekli ve hassas bir dengeleme hizmeti değildir.

### 4.2. Çift beslemeli değişken devirli sistem

Değişken devirli sistemlerde makinenin dönüş hızı, şebeke frekansına tam olarak kilitli değildir. Bu özellik özellikle pompalama modunda güç ayarı yapılmasını sağlar.

Yaygın çözümlerden biri **çift beslemeli asenkron makine** yapısıdır. Bu sistemde stator doğrudan şebekeye, rotor ise güç elektroniği dönüştürücüsüne bağlanır.

Dönüştürücü yalnızca rotor gücünü işlediği için toplam ünite gücüne göre daha düşük güçlü seçilebilir. Bu durum çok büyük güçlerde tam güçlü dönüştürücüye kıyasla maliyet avantajı sağlayabilir.

Değişken devirli işletmenin başlıca yararları:

* Pompalama gücünün belirli bir aralıkta ayarlanabilmesi,
* Kısmi yük veriminin iyileştirilmesi,
* Değişken rezervuar seviyelerine daha iyi uyum,
* Pompalama sırasında frekans kontrolüne katılım,
* Üretim modunda daha geniş ve kararlı çalışma alanı,
* Türbin ve pompanın en verimli çalışma bölgelerine daha yakın tutulmasıdır.

Bununla birlikte statorun şebekeye doğrudan bağlı olması, yakın şebeke arızalarında yüksek akım ve elektromanyetik geçici olaylara neden olabilir. Bu nedenle:

* Arıza sırasında şebekede kalma,
* Rotor aşırı akım koruması,
* Dönüştürücü koruması,
* Geçici gerilim davranışı

ayrıntılı olarak incelenmelidir.

### 4.3. Tam güçlü dönüştürücüye bağlı değişken devirli sistem

Bu yapıda motor-jeneratör, şebekeye tam güçlü bir güç elektroniği dönüştürücüsü üzerinden bağlanır. Dönüştürücü, ünitenin toplam aktif ve reaktif gücünü işler.

Başlıca avantajları:

* Makine hızının daha geniş aralıkta ayarlanabilmesi,
* Aktif ve reaktif gücün büyük ölçüde bağımsız kontrolü,
* Şebekedeki kısa süreli gerilim ve frekans değişimlerinden makinenin daha fazla ayrılması,
* Zayıf şebekelerde daha gelişmiş denetim olanağı,
* Şebeke oluşturan denetim yöntemlerine uyarlanabilme potansiyelidir.

Bu çözüm özellikle:

* Kısa devre gücü düşük bağlantı noktalarında,
* Yenilenebilir enerji oranı yüksek bölgelerde,
* Güç salınımlarının belirgin olduğu sistemlerde,
* Arıza sırasında şebekede kalma şartlarının ağır olduğu projelerde

avantaj sağlayabilir.

Dezavantajları ise:

* Daha yüksek dönüştürücü maliyeti,
* İlave elektriksel kayıplar,
* Soğutma ve harmonik filtreleme ihtiyacı,
* Güç elektroniği bileşenlerinin yenileme ve yedek parça gereksinimidir.

### 4.4. Üç makineli düzen

Üç makineli sistemde pompa ve türbin ayrı hidrolik makineler olarak tasarlanır. Her ikisi ortak bir motor-jeneratörle aynı mil hattına bağlanabilir.

Bu düzenin en önemli özelliği, pompa ve türbinin aynı anda çalıştırılabildiği **hidrolik kısa devre** işletmesidir.

Bu çalışma biçiminde:

* Pompa belirli bir güç çeker,
* Türbin aynı anda belirli bir güç üretir,
* Şebekenin gördüğü net güç bu iki değer arasındaki farktır.

Böylece ünite, pompa ve türbinin tek başına sağlayamayacağı kadar geniş bir net güç ayar aralığına ulaşabilir.

Üç makineli düzenin başlıca üstünlükleri:

* Pompalama ile üretim arasında çok hızlı geçiş,
* Geniş ve kesintisiz güç ayar alanı,
* Pompalama modunda etkin frekans kontrolü,
* Türbin ve pompanın kendi en uygun hidrolik tasarımlarında çalıştırılabilmesi,
* Ada veya zayıf bağlantılı sistemlerde yüksek işletme esnekliğidir.

Buna karşılık:

* İlk yatırım maliyeti yüksektir,
* Yeraltı santral hacmi büyür,
* Mekanik ve hidrolik sistem karmaşıklaşır,
* Vana ve geçiş düzenleri daha ayrıntılı hâle gelir,
* Bakım planlaması zorlaşır.

Bu nedenle üç makineli sistem, yalnızca enerji arbitrajı hedeflenen projelerde değil, şebeke hizmetlerinin ekonomik değerinin yüksek olduğu projelerde daha anlamlıdır.

## 5. Teknoloji karşılaştırması

| Ölçüt                      | Sabit devirli | Çift beslemeli değişken devirli | Tam dönüştürücülü değişken devirli       | Üç makineli      |
| -------------------------- | ------------- | ------------------------------- | ---------------------------------------- | ---------------- |
| Pompalama gücü ayarı       | Çok sınırlı   | Orta-geniş aralık               | Geniş aralık                             | Çok geniş aralık |
| Üretimde güç ayarı         | İyi           | Çok iyi                         | Çok iyi                                  | Çok iyi          |
| Doğal fiziksel atalet      | Yüksek        | Mevcut, denetimle değişebilir   | Şebekeye dönüştürücü üzerinden aktarılır | Yüksek           |
| Reaktif güç kontrolü       | Güçlü         | Güçlü                           | Çok esnek                                | Güçlü            |
| Zayıf şebeke uygunluğu     | Orta          | İyi                             | Çok iyi                                  | İyi              |
| Elektriksel karmaşıklık    | Düşük         | Orta-yüksek                     | Yüksek                                   | Orta             |
| Mekanik karmaşıklık        | Orta          | Orta                            | Orta                                     | Çok yüksek       |
| İlk yatırım maliyeti       | Görece düşük  | Yüksek                          | Daha yüksek                              | Çok yüksek       |
| Pompadan türbine geçiş     | Görece yavaş  | Orta                            | Orta-hızlı                               | Çok hızlı        |
| Şebeke hizmeti potansiyeli | Orta-yüksek   | Yüksek                          | Çok yüksek                               | Çok yüksek       |

Teknoloji seçimi yalnızca yatırım maliyetine göre yapılmamalıdır. Aşağıdaki sorular birlikte değerlendirilmelidir:

* Tesis pompalama sırasında dengeleme hizmeti verecek mi?
* Bağlantı noktasının kısa devre gücü yeterli mi?
* Frekans kontrolü için hangi tepki süresi isteniyor?
* Ünite yılda kaç kez devreye girip çıkacak?
* Çalışma biçimi değişimi ne kadar sık olacak?
* Gerilim ve reaktif güç hizmetlerinden gelir elde edilebilecek mi?
* Şebeke oluşturan denetim gelecekte gerekli olacak mı?
* Düşü değişimi hangi sınırlar içinde gerçekleşecek?

## 6. Frekans kontrolü ve dengeleme hizmetleri

Elektrik sisteminin frekansı, üretim ile tüketim arasındaki anlık dengenin göstergesidir. Büyük bir üretim biriminin devreden çıkması veya tüketimin hızla artması durumunda frekans düşer.

PDHES’in frekans kontrolündeki etkisi üç farklı zaman ölçeğinde değerlendirilmelidir.

### 6.1. İlk saniyeler: atalet ve hızlı frekans tepkisi

Senkron makineye sahip bir PDHES ünitesinin dönen kütlesi, frekanstaki ani değişime fiziksel olarak karşı koyar. Bu etki, büyük bir arıza sonrasında frekans değişim hızının sınırlandırılmasına yardımcı olur.

Ancak atalet ile frekans kontrolü aynı kavram değildir:

* **Atalet tepkisi**, ilk anda fiziksel olarak ve ölçüm beklemeden ortaya çıkar.
* **Birincil frekans kontrolü**, hız regülatörü veya dönüştürücü denetiminin ölçülen frekans değişimine karşı güç ayarlamasıyla gerçekleşir.

Değişken devirli ve dönüştürücü bağlantılı ünitelerde dönen kütlenin enerjisi, denetim sistemi tarafından şebekeye kontrollü biçimde aktarılabilir. Bu işlev doğal ataletle aynı değildir; denetim algoritmasına, dönüştürücü akım sınırlarına ve kullanılabilir enerji payına bağlıdır.

### 6.2. İlk saniyeler ve dakikalar: frekans tutma rezervi

**Frekans Tutma Rezervi**, üretim-tüketim dengesizliği sonrasında frekans sapmasını sınırlamak amacıyla otomatik olarak etkinleşir.

Üretim modundaki bir PDHES ünitesi:

* Kılavuz kanat açıklığını değiştirerek,
* Türbin debisini artırıp azaltarak,
* Belirli bir eğim ayarına göre aktif gücünü düzenleyerek

bu hizmete katılabilir.

Ancak türbin tepkisi yalnızca elektriksel komuta bağlı değildir. Su sütununun ataleti, tünel uzunluğu, denge bacası davranışı ve basınç sınırları rampalama hızını etkiler.

Çok hızlı güç artışı talep edildiğinde:

* Su darbesi,
* Cebri boruda aşırı basınç,
* Kuyruk suyu salınımları,
* Türbin kararsız çalışma bölgeleri

oluşabilir.

Bu nedenle frekans kontrol parametreleri, hidrolik geçici rejim çalışmalarıyla uyumlu belirlenmelidir.

### 6.3. Dakikalar ölçeği: otomatik ve elle etkinleştirilen rezervler

PDHES üniteleri, otomatik üretim kontrolü üzerinden ikincil dengeleme hizmetlerine katılabilir.

Ünitenin uygunluğu şu ölçütlerle değerlendirilir:

* En düşük kararlı üretim seviyesi,
* Yukarı ve aşağı yönlü kullanılabilir rezerv,
* Güç değişim hızı,
* Başlatma süresi,
* Komut izleme doğruluğu,
* Ölü bant,
* Gecikme,
* Rezervuar enerji durumu.

Pompalama modundaki değişken devirli bir ünite de tüketimini azaltarak yukarı yönlü dengeleme etkisi oluşturabilir.

Örneğin 300 MW güç çeken bir pompa tüketimini 220 MW’a düşürürse, sistem dengesi açısından 80 MW ilave üretime eşdeğer bir katkı sağlar. Bu özellik, yüksek güneş üretimi nedeniyle gündüz saatlerinde uzun süre pompalama yapılan sistemlerde önemli bir değerdir.

## 7. Gerilim ve reaktif güç desteği

PDHES üniteleri, bağlantı noktasındaki gerilimin düzenlenmesine reaktif güç üreterek veya tüketerek katkı sağlar.

Senkron motor-jeneratörlü bir ünite:

* Üretim modunda,
* Pompalama modunda,
* Uygun tasarım varsa senkron kompanzatör modunda

reaktif güç sağlayabilir.

Senkron kompanzatör işletmesinde hidrolik makine devre dışı bırakılır veya sudan ayrılır; motor-jeneratör şebekeye bağlı kalarak gerilim desteği ve fiziksel atalet sağlar.

Bu işletme biçimi özellikle:

* Uzun iletim koridorlarında,
* Kısa devre gücü düşük bölgelerde,
* Yüksek yenilenebilir enerji bağlantısına sahip düğüm noktalarında,
* Büyük yük merkezlerine yakın tesislerde

önemli olabilir.

Değişken devirli dönüştürücü sistemlerinde aktif ve reaktif güç daha bağımsız kontrol edilebilir. Ancak gerçek reaktif güç sınırı:

* Dönüştürücü akım kapasitesi,
* Stator ve rotor ısıl sınırları,
* Uç gerilim seviyesi,
* Aktif güç işletme noktası

tarafından belirlenir.

Bu nedenle yalnızca “reaktif güç verebilir” ifadesi yeterli değildir. Fizibilite ve bağlantı çalışmalarında ünitenin **P-Q yetenek eğrisi** farklı gerilim ve güç seviyeleri için incelenmelidir.

## 8. Arıza sırasında şebekede kalma ve zayıf şebeke davranışı

Modern santrallerden gerilim çökmesi veya kısa devre sırasında hemen devreden çıkmaması, belirli süre boyunca şebekeye bağlı kalması beklenir.

PDHES’in arıza davranışı makine tipine göre değişir.

### Sabit devirli senkron makine

Senkron makine kısa devre akımına katkı sağlar ve gerilim toparlanmasına destek olabilir. Ancak arıza sonrasında rotor açısı kararlılığı incelenmelidir.

### Çift beslemeli asenkron makine

Stator şebekeye doğrudan bağlı olduğu için gerilim çökmesi rotorda yüksek gerilim ve akım oluşturabilir. Koruma ve dönüştürücü düzeninin arıza süresince kontrolü sürdürebilmesi gerekir.

### Tam dönüştürücülü makine

Makine ile şebeke daha fazla ayrıştırılır. Arıza akımı dönüştürücü tarafından sınırlandırılır. Bu durum ekipman korunması açısından avantajlı, şebekeye yüksek kısa devre akımı sağlanması açısından ise sınırlayıcı olabilir.

Gelecekte kısa devre gücünün düşük olduğu sistemlerde yalnızca akım izleyen klasik dönüştürücü denetimi yeterli olmayabilir. Gerilim ve frekans referansı oluşturabilen **şebeke oluşturan denetim** yöntemleri, büyük değişken devirli PDHES projelerinde daha önemli hâle gelebilir.

## 9. PDHES ve batarya sistemleri rakip değil, tamamlayıcıdır

Batarya enerji depolama sistemleri ile PDHES’in yalnızca çevrim verimi veya ilk yatırım maliyeti üzerinden karşılaştırılması eksik bir değerlendirmedir.

Bataryaların güçlü olduğu alanlar:

* Milisaniye ve saniye ölçeğinde hızlı tepki,
* Çok hassas güç kontrolü,
* Modüler kurulum,
* Kısa inşaat süresi,
* Şebekeye yakın noktalarda uygulanabilme.

PDHES’in güçlü olduğu alanlar:

* Çok büyük enerji kapasitesi,
* Sekiz saatten günler ölçeğine uzanabilen depolama,
* Uzun ekonomik ömür,
* Çok yüksek çevrim sayısında daha düşük kapasite kaybı,
* Büyük güçlerde ölçek ekonomisi,
* Fiziksel atalet,
* Yüksek kısa devre katkısı,
* Oturan sistemin toparlanması.

En uygun sistem mimarisi çoğu zaman iki teknolojinin birlikte kullanılmasıdır.

Örnek görev paylaşımı:

* Batarya, olayın ilk saniyelerinde çok hızlı tepki verir.
* PDHES, saniyeler ve dakikalar içinde yükü devralır.
* PDHES, enerji açığını saatler boyunca taşır.
* Batarya, PDHES’in başlatma ve geçiş süreçlerini yumuşatır.
* Her iki sistem birlikte frekans, gerilim ve enerji dengelemesi sağlar.

Bu yapı, bataryanın yalnızca hızlı tepki için kullanılması sayesinde enerji kapasitesinin gereksiz büyütülmesini; PDHES’in ise çok sık küçük güç salınımlarına maruz kalmasını azaltabilir.

## 10. Oturan sistemin toparlanması

Büyük bir sistem çökmesi sonrasında şebekenin dış kaynaktan enerji almadan yeniden kurulması, sistem işletmecileri açısından kritik bir yetenektir.

PDHES bu hizmet için aşağıdaki avantajlara sahiptir:

* Hızlı başlatılabilir.
* Yardımcı güç ihtiyacı termik santrallere göre düşüktür.
* Frekans ve gerilim oluşturabilir.
* Diğer santrallerin yardımcı sistemlerini besleyebilir.
* Yük alma hızı yüksektir.
* Reaktif güç sağlayabilir.
* Büyük iletim koridorlarının enerjilendirilmesine katkı verebilir.

Ancak PDHES’in bu görevi yerine getirebilmesi için üst rezervuarda yeterli su bulunması gerekir.

Bu nedenle işletme planında:

* Oturan sistemin toparlanması için ayrılacak asgari enerji,
* Bu enerjinin piyasa işletmesinde kullanılmaması,
* Yardımcı dizel veya batarya sistemleri,
* Başlatma sırası,
* Enerjilendirilecek hat ve trafolar,
* Aşırı gerilim ve öz uyartım riskleri,
* Ada işletmesi sırasında frekans kontrolü

önceden tanımlanmalıdır.

Bir PDHES’in teknik olarak başlatılabilir olması, tek başına oturan sistemin toparlanmasına hazır olduğu anlamına gelmez. Su stoku, haberleşme, koruma, yardımcı sistemler ve işletme prosedürleri birlikte doğrulanmalıdır.

## 11. Deniz suyu kullanan PDHES uygulamaları

Deniz kıyısındaki projelerde deniz, alt rezervuar olarak kullanılabilir. Bu yaklaşım özellikle dik kıyı topoğrafyasına sahip bölgelerde yüksek düşü ve kısa su yolu oluşturma potansiyeli taşır.

Başlıca avantajları:

* Yeni bir alt rezervuar ihtiyacını azaltması,
* Çok büyük alt su hacmine erişim sağlaması,
* Tatlı su kullanımını sınırlaması,
* Ada sistemlerinde enerji güvenliğini artırabilmesi,
* Kıyıya yakın yenilenebilir üretimle bütünleştirilebilmesidir.

Bununla birlikte deniz suyu aşağıdaki teknik sorunları büyütür:

* Klorür kaynaklı korozyon,
* Galvanik korozyon,
* Deniz canlılarının yüzeylere tutunması,
* Izgara ve su alma yapılarında biyolojik kirlenme,
* Pompa-türbin yüzeylerinde aşınma,
* Üst rezervuardan tuzlu su sızıntısı,
* Yeraltı suyu ve toprakta tuzlanma,
* Deniz ekosistemi üzerindeki emme ve deşarj etkileri.

Malzeme seçimi ve koruma sistemleri proje ekonomisini doğrudan etkiler. Paslanmaz çelik, özel kaplama, katodik koruma ve bileşik malzemeler kullanılabilir; ancak bütün ekipmanın korozyona dayanıklı yapılması yatırım maliyetini önemli ölçüde yükseltebilir.

Bu nedenle deniz suyu PDHES fizibilitesinde yalnızca inşaat maliyeti değil:

* Yaşam döngüsü bakım maliyeti,
* Kaplama yenileme aralığı,
* Korozyon izleme sistemi,
* Su alma yapısının ekolojik etkileri,
* Sızıntı algılama ve toplama sistemi

de değerlendirilmelidir.

## 12. Terk edilmiş madenler ve yeraltı rezervuarları

Terk edilmiş açık ocaklar, maden galerileri veya özel olarak açılmış yeraltı boşlukları PDHES rezervuarı olarak değerlendirilebilir.

Bu yaklaşımın potansiyel yararları:

* Yüzey alanı ihtiyacını azaltması,
* Mevcut maden altyapısından yararlanılması,
* Dağlık olmayan bölgelerde yapay düşü oluşturulabilmesi,
* Eski maden bölgelerine yeni ekonomik işlev kazandırılmasıdır.

Ancak yeraltı projelerinde belirsizlik genellikle yüzey projelerine göre daha yüksektir.

İncelenmesi gereken başlıca konular:

* Kaya kütlesinin süreksizlik yapısı,
* Eski galeri ve şaftların gerçek geometrisi,
* Tavan ve yan duvar kararlılığı,
* Döngüsel basınç değişimlerinin kaya üzerindeki etkisi,
* Yeraltı suyu girişleri,
* Maden suyu kimyası,
* Asit maden drenajı,
* Gaz birikimi,
* Kirleticilerin çevredeki akiferlere taşınması,
* Pompa ve ekipmanlara erişim,
* Acil boşaltma ve tahliye düzeni.

Yeraltı rezervuarının çevredeki akiferle yüksek hidrolik bağlantısı, kullanılabilir su hacmini artırabilir; ancak çevresel kontrolü zorlaştırabilir. Bu nedenle enerji kapasitesinin büyümesi her zaman proje kalitesinin yükseldiği anlamına gelmez.

## 13. Yatırım değerlendirmesinde kritik ölçütler

PDHES projelerinde toplam yatırım maliyetinin önemli bölümü elektromekanik ekipmandan değil, sahaya özgü inşaat ve jeolojik koşullardan kaynaklanır.

Başlıca maliyet bileşenleri:

* Üst ve alt rezervuar,
* Baraj ve sızdırmazlık yapıları,
* Tünel ve cebri borular,
* Yeraltı santral boşluğu,
* Şaftlar ve erişim tünelleri,
* Pompa-türbin ve motor-jeneratör,
* Güç elektroniği,
* Şalt sahası ve iletim bağlantısı,
* Kazı destekleri ve zemin iyileştirmesi,
* Çevresel önlemler,
* Kamulaştırma ve izin süreçleridir.

Yatırımcı açısından yalnızca toplam yatırım tutarı değil, aşağıdaki göstergeler birlikte değerlendirilmelidir:

* Birim güç başına yatırım maliyeti,
* Birim enerji kapasitesi başına yatırım maliyeti,
* Depolama süresi,
* Çevrim verimi,
* Yıllık çevrim sayısı,
* Beklenen kullanılabilirlik,
* Başlatma ve durdurma sayısı,
* Bakım aralıkları,
* Yenileme yatırımları,
* Piyasa fiyat farkı,
* Dengeleme ve yan hizmet gelirleri,
* Kapasite mekanizması geliri,
* Yenilenebilir enerji kısıntısının önlenmesinden doğan değer,
* Şebeke yatırımlarının ertelenmesiyle oluşan sistem faydası.

Yalnızca günlük enerji fiyat farkına dayanan gelir modeli, modern bir PDHES’in gerçek sistem değerini eksik gösterebilir. Proje ekonomisinde enerji arbitrajına ek olarak kapasite, rezerv, gerilim desteği, sistem toparlama ve şebeke esnekliği gelirleri de modellenmelidir.

## 14. Tasarım seçiminde karar çerçevesi

### Sabit devirli çözüm daha uygun olabilir:

* Şebeke güçlü ve kısa devre gücü yüksekse,
* Pompalama sırasında sürekli güç ayarı gerekmiyorsa,
* Tesisin temel görevi uzun süreli enerji depolamaysa,
* Düşü değişimi sınırlıysa,
* Daha düşük teknik karmaşıklık hedefleniyorsa.

### Çift beslemeli değişken devirli çözüm daha uygun olabilir:

* Pompalama sırasında frekans kontrolü isteniyorsa,
* Yenilenebilir enerji oranı yüksekse,
* Rezervuar seviyeleri geniş aralıkta değişiyorsa,
* Kısmi yük verimi önemliyse,
* Çok büyük güçte tam dönüştürücü maliyeti sınırlandırılmak isteniyorsa.

### Tam dönüştürücülü çözüm daha uygun olabilir:

* Bağlantı noktası zayıfsa,
* Aktif ve reaktif gücün bağımsız kontrolü öncelikliyse,
* Şebeke oluşturan denetim hedefleniyorsa,
* Arıza davranışının dönüştürücü üzerinden yönetilmesi isteniyorsa,
* Geniş hız aralığına ihtiyaç duyuluyorsa.

### Üç makineli düzen daha uygun olabilir:

* Pompa ve türbin modları arasında çok sık geçiş yapılacaksa,
* Çok geniş net güç ayarı gerekiyorsa,
* Ada sistemi veya zayıf bağlantılı şebeke söz konusuysa,
* Yan hizmet gelirlerinin proje ekonomisindeki payı yüksekse,
* Mekanik karmaşıklık ve yüksek yatırım maliyeti kabul edilebiliyorsa.

## 15. Sonuç

PDHES, elektrik enerjisinin yalnızca depolandığı bir tesis değil; güç sisteminin dinamik davranışını etkileyen çok işlevli bir altyapıdır.

Modern bir PDHES aynı anda:

* Büyük enerji hacmi depolayabilir,
* Hızlı aktif güç desteği sağlayabilir,
* Pompalama sırasında tüketimini ayarlayabilir,
* Frekans tutma ve yenileme rezervlerine katılabilir,
* Reaktif güç ve gerilim desteği verebilir,
* Fiziksel veya denetim tabanlı atalet sağlayabilir,
* Şebeke arızaları sırasında sistem kararlılığına katkıda bulunabilir,
* Oturan sistemin toparlanmasında başlangıç kaynağı olabilir,
* Rüzgâr ve güneş üretimindeki kısıntıyı azaltabilir.

Bununla birlikte her PDHES aynı teknik değere sahip değildir. Üst ve alt rezervuar arasındaki yükseklik farkı kadar:

* Makine türü,
* Pompalama esnekliği,
* Su yolu geometrisi,
* Geçici hidrolik davranış,
* Bağlantı noktasının şebeke gücü,
* Kontrol sistemi,
* Rezervuar enerji yönetimi,
* Jeolojik ve çevresel riskler

de projenin başarısını belirler.

Batarya sistemleri çok hızlı tepki ve modüler kurulumda; PDHES ise uzun süreli enerji, büyük güç, fiziksel sistem desteği ve uzun ekonomik ömürde öne çıkar. Yüksek yenilenebilir enerji oranına sahip geleceğin elektrik sistemi, büyük olasılıkla bu iki teknolojinin rekabetinden değil, doğru görev paylaşımıyla birlikte çalışmasından güç alacaktır.

PDHES yatırımlarında temel soru yalnızca “Kaç megavatlık santral kurulabilir?” olmamalıdır.

Daha doğru soru şudur:

> Bu tesis, enerji piyasasına, sistem işletmecisine ve şebeke güvenliğine hangi zaman ölçeklerinde, hangi teknik sınırlar içinde ve hangi ekonomik değerle hizmet verebilir?

# Teknik Terimler ve Kısaltmalar Sözlüğü

**aFRR – Otomatik Frekans Yenileme Rezervi:** Sistem frekansını ve kontrol bölgeleri arasındaki güç alışverişini hedef değerlerine geri döndürmek amacıyla otomatik üretim kontrolü üzerinden etkinleştirilen dengeleme rezervi.

**AGC – Otomatik Üretim Kontrolü:** Üretim veya tüketim birimlerinin aktif güçlerini sistem işletmecisinin gönderdiği sürekli kontrol sinyaline göre ayarlayan merkezi denetim yapısı.

**BESS – Batarya Enerji Depolama Sistemi:** Elektrokimyasal hücreler, güç dönüştürücüleri ve enerji yönetim sistemi aracılığıyla elektrik enerjisini depolayan tesis.

**Black Start – Oturan Sistemin Toparlanması:** Tam veya geniş çaplı sistem çökmesi sonrasında bir üretim biriminin dış şebeke beslemesi olmadan başlatılması ve şebekenin kontrollü adımlarla yeniden enerjilendirilmesi.

**DFIM – Çift Beslemeli Asenkron Makine:** Statoru doğrudan şebekeye, rotoru ise kısmi güçlü dönüştürücüye bağlı olan ve değişken devirli motor-jeneratör işletmesine imkân veren makine yapısı.

**DFIG – Çift Beslemeli Asenkron Jeneratör:** Çift beslemeli asenkron makinenin jeneratör işletmesini vurgulayan kullanım biçimi.

**FCR – Frekans Tutma Rezervi:** Bir güç dengesizliği sonrasında frekans sapmasını sınırlamak için yerel frekans ölçümüne bağlı olarak otomatik etkinleşen birincil rezerv.

**FRT – Arıza Sırasında Şebekede Kalma Yeteneği:** Üretim veya depolama tesisinin kısa süreli gerilim düşümü, yükselmesi veya frekans sapması sırasında bağlantısını koruması ve bağlantı şartlarında tanımlanan desteği sürdürmesi.

**GFL – Şebeke İzleyen Dönüştürücü Denetimi:** Gerilim açısı ve frekans referansını mevcut şebekeden alan, akım kontrollü güç elektroniği yaklaşımı.

**GFM – Şebeke Oluşturan Dönüştürücü Denetimi:** Zayıf veya enerjisiz bir şebekede gerilim ve frekans referansı oluşturabilen, gerilim kaynağı benzeri davranış sağlayan dönüştürücü denetimi.

**H Atalet Sabiti:** Senkron makinenin anma gücüne göre depoladığı dönme enerjisini saniye cinsinden ifade eden parametre.

**Hidrolik Kısa Devre:** Ayrı pompa ve türbinin aynı anda çalıştırılmasıyla şebekeden görülen net gücün iki makinenin güç farkı üzerinden ayarlanması.

**LCOS – Seviyelendirilmiş Depolama Maliyeti:** Bir depolama tesisinin yatırım, işletme, bakım, kayıp ve yenileme giderlerinin ömrü boyunca şebekeye verdiği toplam enerjiye indirgenmesiyle hesaplanan birim maliyet göstergesi.

**mFRR – Elle Etkinleştirilen Frekans Yenileme Rezervi:** Sistem işletmecisinin talimatıyla devreye alınan ve otomatik rezervlerin ardından frekans ile güç dengesinin yeniden kurulmasına yardımcı olan rezerv.

**NPSH – Net Pozitif Emme Yüksekliği:** Pompa girişinde kavitasyon oluşmadan güvenli işletme için gerekli ve mevcut basınç koşullarını ifade eden hidrolik ölçüt.

**P-Q Yetenek Eğrisi:** Bir motor-jeneratör veya dönüştürücünün farklı aktif güç seviyelerinde güvenli olarak üretebileceği veya tüketebileceği reaktif güç sınırlarını gösteren çalışma bölgesi.

**RoCoF – Frekans Değişim Hızı:** Bir güç dengesizliği sonrasında sistem frekansının zamana göre değişim oranı. Düşük ataletli sistemlerde koruma ve kararlılık açısından kritik bir göstergedir.

**Senkron Kompanzatör Modu:** Hidrolik güç alışverişi olmadan motor-jeneratörün şebekeye bağlı tutularak reaktif güç, kısa devre katkısı ve atalet sağlaması.

**Su Darbesi:** Su hızının hızlı değişmesi sonucunda boru ve tünel sistemlerinde oluşan geçici basınç dalgası.

**Tam Güçlü Dönüştürücü:** Makinenin toplam aktif ve reaktif gücünü işleyen, makine ile şebeke arasındaki elektriksel ilişkiyi büyük ölçüde denetleyen güç elektroniği sistemi.

**Ünite Taahhüt ve Sevk Optimizasyonu:** Üretim ve depolama birimlerinin başlatma, durdurma, üretim ve pompalama programlarının maliyet, teknik sınır ve sistem güvenliği birlikte dikkate alınarak belirlenmesi.

**Çevrim Verimi:** Pompalamada tüketilen elektrik enerjisine karşılık üretim sırasında şebekeye geri verilen elektrik enerjisinin oranı. Yardımcı tüketimler ve hidrolik-elektriksel kayıplar bu değere dâhildir.
`
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
    content: `
# Türkiye'nin PDHES Stratejisi


## Yönetici özeti

Türkiye’nin elektrik sistemi, üretim kapasitesinin artırılmasından daha karmaşık bir döneme girmektedir. Önümüzdeki yılların temel sorunu yalnızca daha fazla elektrik üretmek değil; rüzgâr ve güneş kaynaklarından gelen değişken üretimi güvenli, ekonomik ve sürdürülebilir biçimde yönetebilmektir.

Enerji ve Tabii Kaynaklar Bakanlığının 2035 yol haritası, Türkiye’nin güneş ve rüzgâr kurulu gücünü toplam **120.000 MW’a** çıkarmayı hedeflemektedir. Aynı dönemde yıllık elektrik talebinin yaklaşık **510 TWh** düzeyine ulaşması beklenmektedir. Bu dönüşüm; enerji depolama, hızlı yedek, gerilim desteği, frekans kontrolü ve iletim sistemi esnekliği ihtiyacını belirgin biçimde artıracaktır. 

Türkiye Ulusal Enerji Planı’nda 2035 yılı için **7.500 MW batarya depolama kapasitesi** öngörülmüş ve bu kapasitenin iki saatlik dolum süresine sahip olacağı varsayılmıştır. Bu, yaklaşık 15 GWh enerjiye karşılık gelir. Ancak rüzgâr ve güneş hedefinin daha sonra 120 GW’a yükseltilmesi, Türkiye’nin iki saatlik bataryaların ötesinde, uzun süreli enerji kaydırabilen sistemlere de ihtiyaç duyacağını göstermektedir. Bu değerlendirme, iki resmî planın birlikte okunmasından çıkarılan bir sistem planlama sonucudur. 

**Pompaj Depolamalı Hidroelektrik Santraller (PDHES)** bu ihtiyacın tamamını tek başına karşılayacak bir çözüm değildir; fakat çok saatli enerji depolama, hızlı üretim artışı, frekans ve gerilim desteği, fiziksel atalet ve oturan sistemin toparlanması gibi işlevleri aynı tesiste birleştirebildiği için stratejik bir şebeke altyapısıdır.

Dünya genelindeki işletme hâlindeki PDHES gücü 2025 sonunda 200 GW eşiğini aşmış, inşa hâlindeki proje kapasitesi 243 GW’a ulaşmıştır. Bu büyüme, teknolojinin yalnızca geçmişin gece-gündüz enerji arbitrajı çözümü olmadığını; yüksek yenilenebilir enerji payına sahip geleceğin şebekelerinde yeniden merkezî konuma geldiğini göstermektedir. 

Türkiye için doğru yaklaşım, doğrudan tek bir ulusal kapasite hedefi açıklamak yerine şu üç adımı izlemektir:

1. Saatlik ve alt saatlik sistem modellemeleriyle gerçek uzun süreli depolama ihtiyacını belirlemek.
2. Mevcut rezervuarla bütünleşik, kapalı çevrim ve deniz suyu PDHES adaylarını ortak teknik ölçütlerle karşılaştırmak.
3. Enerji arbitrajının yanında kapasite, yan hizmet, şebeke güvenliği ve yenilenebilir enerji kısıntısını azaltma değerini de karşılayan bir gelir modeli kurmak.

İlk aşamada **3.000 MW düzeyindeki bir PDHES portföyü**, kesin ulusal ihtiyaç olarak değil; Gökçekaya, Altınkaya ve seçilecek yeni kapalı çevrim adaylarının ayrıntılı sistem modellemesine alınacağı bir başlangıç senaryosu olarak değerlendirilmelidir.

---

## 1. Türkiye’nin temel ihtiyacı yeni baz yükten çok sistem esnekliğidir

Geleneksel elektrik sistemlerinde planlama; baz yük, orta yük ve puant yük santrallerinin belirli görevleri üstlenmesi üzerine kuruluydu. Rüzgâr ve güneş üretiminin büyüdüğü yeni yapıda ise bu sınıflandırma tek başına yeterli değildir.

Türkiye’nin gelecekte ihtiyaç duyacağı başlıca yetenekler şunlardır:

* Öğle saatlerindeki güneş üretim fazlasını akşam puantına taşımak,
* Rüzgâr ve güneş tahmin hatalarını dengelemek,
* Büyük üretim birimlerinin beklenmedik kaybına hızlı cevap vermek,
* Düşük talep dönemlerinde asgari üretim sınırına yaklaşan termik santrallerin yükünü azaltmak,
* Yenilenebilir üretim kısıntısını düşürmek,
* İletim hatlarındaki bölgesel sıkışıklıkları yönetmek,
* Gerilim, frekans ve kısa devre gücü açısından zayıflayan şebekeyi desteklemek.

Bu nedenle tartışmanın merkezinde “Türkiye’nin ne kadar baz yük santraline ihtiyacı var?” sorusundan çok şu soru bulunmalıdır:

> Türkiye, farklı zaman ölçeklerinde ne kadar yukarı ve aşağı yönlü esnekliğe, ne kadar güvenilir güce ve kaç saatlik enerji depolama kapasitesine ihtiyaç duyacaktır?

PDHES’in sistem içindeki gerçek değeri de bu soruya verdiği çok katmanlı cevapta ortaya çıkar.

---

## 2. Güneş üretiminin oluşturduğu günlük net yük eğrisi

Güneş enerjisi kurulu gücü arttıkça elektrik sisteminin şebekeden karşılanması gereken net yükü öğle saatlerinde azalır. Güneş battığında ise net yük kısa sürede yükselir.

Bu yapı genellikle **ördek eğrisi** olarak adlandırılır. Türkiye’de özellikle ilkbahar ve sonbahar aylarında şu koşullar aynı anda oluşabilir:

* Güneş üretimi yüksek,
* Elektrik talebi yaz veya kış puantına göre düşük,
* Barajlı hidroelektrik üretimi mevsimsel olarak güçlü,
* Termik santraller teknik asgari üretim sınırında,
* İletim bölgeleri arasında güç aktarımı sınırlı.

Bu koşullarda güneş enerjisinin bir bölümü teknik veya ekonomik nedenlerle kısıtlanabilir. Akşam saatlerinde ise güneş üretimi hızla azalırken konut ve ticari tüketim yükselmeye devam edebilir.

PDHES bu yapıda iki yönlü çalışır:

**Öğle saatlerinde:** Elektrik tüketerek suyu üst rezervuara pompalar, net yükü yükseltir ve yenilenebilir enerji kısıntısını azaltır.

**Akşam saatlerinde:** Türbin işletmesine geçerek üretim yapar, hızlı net yük artışının doğal gaz ve ithal kaynaklarla karşılanma ihtiyacını azaltır.

Bu görev yalnızca enerji alım-satım farkından gelir elde etmek değildir. Aynı zamanda sistemin saatlik üretim programını daha kararlı, öngörülebilir ve düşük maliyetli hâle getirir.

---

## 3. Güç kapasitesi ile enerji kapasitesi aynı şey değildir

Depolama projeleri yalnızca megavat cinsinden karşılaştırıldığında önemli bir planlama hatası oluşur.

**Güç kapasitesi**, tesisin belirli bir anda şebekeye ne kadar üretim verebildiğini gösterir.

**Enerji kapasitesi** ise bu üretimin kaç saat sürdürülebileceğini belirler.

Örneğin:

* 1.000 MW gücünde ve 2.000 MWh enerjili bir batarya, tam güçte yaklaşık iki saat çalışabilir.
* 1.000 MW gücünde ve 10.000 MWh enerjili bir PDHES, tam güçte yaklaşık on saat çalışabilir.

İki tesisin güç değeri aynı olsa da sistemdeki görevleri aynı değildir. İlk tesis ani dengesizlikler ve kısa süreli pikler için güçlüdür. İkinci tesis, akşam puantı veya uzun süren üretim açığı boyunca yüksek gücü sürdürebilir.

Bir PDHES’in üretim gücü yaklaşık olarak şu ilişkiyle belirlenir:

**P = ρ × g × Q × Hnet × η**

Burada:

* **Q:** Türbinden geçen su debisi,
* **Hnet:** Su yolu kayıpları çıkarıldıktan sonraki net düşü,
* **η:** Türbin, jeneratör ve diğer ekipmanların toplam verimidir.

Depolanabilir enerji ise yaklaşık olarak:

**E = ρ × g × V × Hnet × η**

bağıntısıyla hesaplanır. Buradaki **V**, kullanılabilir aktif rezervuar hacmidir.

Bu ilişkilerden şu mühendislik sonucu çıkar:

> Kurulu güç; debi ve makine boyutuyla, enerji kapasitesi ise ağırlıklı olarak kullanılabilir su hacmi ve net düşüyle belirlenir.

Dolayısıyla bir PDHES projesi yalnızca “kaç megavat?” sorusuyla değil, aşağıdaki dört değer birlikte verilerek tanımlanmalıdır:

* Üretim gücü,
* Pompalama gücü,
* Kullanılabilir enerji kapasitesi,
* Tam güçte depolama süresi.

---

## 4. Türkiye için gerekli depolama süresi nasıl belirlenmelidir?

Türkiye’nin uzun süreli depolama ihtiyacının doğrudan “sekiz saat” veya “on saat” olarak kabul edilmesi doğru değildir. Bu değer, güç sistemi modellemeleriyle belirlenmelidir.

Çalışmada en az aşağıdaki senaryolar incelenmelidir:

* Normal yaz ve kış yük profilleri,
* Düşük talep ve yüksek yenilenebilir üretim günleri,
* Kurak ve yağışlı hidrolojik yıllar,
* Rüzgâr üretiminin tahminden düşük gerçekleştiği dönemler,
* Uzun süreli düşük rüzgâr koşulları,
* Güneş üretiminin yüksek olduğu hafta sonları ve bayram dönemleri,
* Büyük üretim birimi kaybı,
* İletim hattı veya trafo kaybı,
* Doğal gaz arzında veya ithalat kapasitesinde azalma,
* Ada işletmesi ve oturan sistemin toparlanması senaryoları.

Model yalnızca saatlik çözünürlükte çalıştırılmamalıdır. Frekans, rezerv ve rampalama ihtiyaçlarının incelenmesi için beş veya on beş dakikalık; dinamik kararlılık değerlendirmeleri için saniyeler ve saliseler ölçeğinde ayrı analizler yapılmalıdır.

Bu nedenle Türkiye için uygun PDHES kapasitesi tek bir çalışma sonucunda değil, şu üç modelin birlikte değerlendirilmesiyle belirlenmelidir:

1. **Üretim maliyeti ve birim taahhüt modeli:** Santrallerin hangi saatlerde devreye gireceğini belirler.
2. **Kaynak yeterliliği modeli:** Uzun süreli arz açığı ve güvenilir kapasite ihtiyacını hesaplar.
3. **Dinamik şebeke modeli:** Frekans, gerilim ve rotor açısı kararlılığını inceler.

---

## 5. PDHES’in Türkiye elektrik sistemine sağlayacağı hizmetler

### 5.1. Gün içi enerji kaydırma

PDHES, düşük fiyatlı veya fazla üretimin bulunduğu saatlerde enerji tüketir; yüksek talep ve yüksek fiyat dönemlerinde üretim yapar. Buna enerji arbitrajı denir.

Ancak Türkiye’de PDHES’in değeri yalnızca Piyasa Takas Fiyatı farkından oluşmayacaktır. Sistem açısından asıl yarar, düşük marjinal maliyetli güneş ve rüzgâr enerjisinin kısıtlanmak yerine daha sonraki saatlere taşınmasıdır.

### 5.2. Frekans tutma ve yenileme rezervleri

Şebekede üretim kaybı yaşandığında frekans düşer. Üretim tüketimden fazla olduğunda ise yükselir.

Üretim modundaki PDHES, türbin debisini değiştirerek gücünü artırabilir veya azaltabilir. Değişken devirli bir tesis, pompalama modunda da tüketimini ayarlayabilir.

Örneğin 400 MW pompalama yapan bir ünitenin tüketimini 300 MW’a düşürmesi, sistem dengesi açısından 100 MW ilave üretim sağlanmasına benzer etki oluşturur. Bu özellik, PDHES’in yalnızca üretim yaparken değil, enerji depolarken de dengeleme hizmetine katılmasını sağlar.

### 5.3. Rampalama desteği

Akşam güneş üretiminin azalması sırasında sistemin kısa sürede binlerce megavat ilave üretime ihtiyacı olabilir.

PDHES üniteleri uygun şekilde senkronize edildiğinde veya hazır bekletildiğinde, termik santrallere göre daha hızlı ve geniş bir üretim değişim aralığı sağlayabilir. Bu sayede doğal gaz santrallerinin çok hızlı yük alma zorunluluğu ve buna bağlı yakıt tüketimi azaltılabilir.

### 5.4. Reaktif güç ve gerilim kontrolü

Büyük motor-jeneratörler, üretim ve pompalama modunda reaktif güç desteği sağlayabilir. Uygun tasarımlarda ünite, su çevrimi olmaksızın senkron kompanzatör olarak da çalıştırılabilir.

Bu yetenek özellikle:

* Uzun 400 kV iletim hatlarında,
* Yoğun güneş ve rüzgâr bağlantısına sahip bölgelerde,
* Kısa devre gücü düşük bağlantı noktalarında,
* Büyük tüketim merkezlerine enerji taşıyan koridorlarda

önemlidir.

### 5.5. Fiziksel atalet ve frekans değişim hızının sınırlandırılması

Senkron motor-jeneratörün dönen kütlesi, büyük üretim kayıplarının ardından frekansın çok hızlı değişmesini yavaşlatır.

Batarya dönüştürücüleri hızlı frekans tepkisi sağlayabilir; ancak fiziksel atalet ile denetim sistemi üzerinden verilen hızlı tepki aynı özellik değildir. Geleceğin şebekesinde bu iki hizmetin birlikte planlanması gerekir.

### 5.6. Oturan sistemin toparlanması

Büyük çaplı elektrik kesintilerinden sonra şebekenin yeniden kurulabilmesi için dış beslemeye ihtiyaç duymadan başlatılabilen üretim kaynakları gerekir.

PDHES bu görevde:

* Başlatma kaynağı,
* Gerilim ve frekans referansı,
* İletim hatlarının enerjilendirilmesi,
* Termik santrallerin yardımcı sistemlerinin beslenmesi,
* Ada sisteminin güç dengesinin korunması

işlevlerini üstlenebilir.

Ancak bu hizmetin verilebilmesi için üst rezervuarda önceden ayrılmış yeterli su bulunması ve tesisin yardımcı sistemlerinin bağımsız başlatma düzenine sahip olması gerekir.

ABD Enerji Bakanlığı değerlendirmesi, modern PDHES’lerin enerji kaydırmanın yanında frekans düzenleme, işletme rezervi, gerilim desteği, atalet tepkisi ve oturan sistemin toparlanması gibi hizmetler sunabildiğini; yeni tesislerde çevrim veriminin yaklaşık yüzde 80 düzeyinde olabildiğini belirtmektedir. 

---

## 6. Batarya ve PDHES birlikte planlanmalıdır

Batarya Enerji Depolama Sistemleri ile PDHES’i birbirinin doğrudan alternatifi olarak görmek doğru değildir.

Bataryalar:

* Milisaniye ve saniye ölçeğinde tepki verebilir.
* Çok hassas güç kontrolü yapabilir.
* Modüler olarak kurulabilir.
* İnşaat süreleri görece kısadır.
* Tüketim ve üretim merkezlerine yakın konumlandırılabilir.

PDHES ise:

* Çok daha büyük enerji kapasitesine ulaşabilir.
* Yüksek gücü saatler boyunca sürdürebilir.
* Çok sayıda çevrimde kapasite kaybı sınırlıdır.
* Fiziksel atalet ve kısa devre katkısı sağlayabilir.
* Teknik ömrü büyük altyapı projeleriyle karşılaştırılabilir düzeydedir.
* Oturan sistemin toparlanması gibi çok katmanlı hizmetler sunabilir.

En uygun sistem mimarisinde batarya ilk saniyelerde tepki verir; PDHES ise saniyeler, dakikalar ve saatler boyunca enerji açığını taşır.

Bu görev paylaşımı, bataryaların yalnızca uzun süreli enerji sağlamak amacıyla aşırı büyütülmesini ve PDHES ünitelerinin çok küçük, sık ve yıpratıcı güç hareketlerine maruz kalmasını azaltabilir.

---

## 7. Türkiye için üç ana PDHES proje modeli

### 7.1. Mevcut rezervuarla bütünleşik projeler

Bu yapıda mevcut bir baraj gölü alt rezervuar olarak kullanılır ve yüksek kotta yeni bir üst rezervuar inşa edilir.

Başlıca avantajları:

* Alt rezervuar yatırımının büyük bölümünün mevcut olması,
* Mevcut erişim yolları ve şalt sahalarından yararlanılabilmesi,
* Büyük alt rezervuar hacmi,
* Mevcut hidroelektrik işletme deneyimi,
* İletim bağlantısına görece yakınlık.

Ancak mevcut barajın kullanılması projenin otomatik olarak kolay veya düşük etkili olacağı anlamına gelmez. Alt rezervuar su seviyesindeki değişimler, mevcut HES işletmesi, sulama, içme suyu, taşkın kontrolü ve mansap yükümlülükleriyle birlikte modellenmelidir.

### 7.2. Kapalı çevrim projeler

Kapalı çevrim PDHES’te rezervuarlar sürekli akan bir nehir sistemine doğrudan bağlı değildir. İlk dolum ve buharlaşma kayıplarının tamamlanması dışında aynı su iki rezervuar arasında çevrilir.

Bu projeler:

* Balık göç yollarına doğrudan müdahaleyi azaltabilir,
* Nehir akım rejimini değiştirmeyebilir,
* Üretim ve pompalama programının hidrolojiden daha bağımsız yürütülmesini sağlayabilir,
* Şebeke ihtiyacına yakın uygun topografyalarda konumlandırılabilir.

Bununla birlikte “kapalı çevrim” ifadesi, projenin çevresel etkisiz olduğu anlamına gelmez. Üst ve alt rezervuar alanı, kazı dökümü, habitat kaybı, su temini, buharlaşma, sızdırmazlık, jeoloji ve yerel topluluklar üzerindeki etkiler yine ayrıntılı biçimde değerlendirilmelidir.

ABD Enerji Bakanlığı, kapalı çevrim projelerin doğal akarsuya sürekli bağlı olmaması nedeniyle genel olarak daha düşük doğrudan su ekosistemi etkisine sahip olabileceğini; ancak her proje türünün kendine özgü maliyet ve izin zorlukları bulunduğunu belirtmektedir. 

### 7.3. Deniz suyu kullanan projeler

Türkiye’nin dik kıyı topoğrafyasına sahip bölgelerinde deniz, alt rezervuar olarak kullanılabilir.

Bu modelde:

* Yeni alt rezervuar yapılmasına gerek kalmaz.
* Tatlı su kullanımı azalır.
* Kıyıya yakın rüzgâr ve güneş üretimiyle bütünleşme sağlanabilir.
* Ada veya yarımada sistemlerinde enerji güvenliği artırılabilir.

Başlıca mühendislik sorunları ise şunlardır:

* Tuzlu su korozyonu,
* Galvanik aşınma,
* Deniz canlılarının su alma yapısına girişi,
* Biyolojik kirlenme,
* Üst rezervuardan tuzlu su sızıntısı,
* Toprak ve yeraltı suyunda tuzlanma,
* Kaplama ve katodik koruma maliyetleri.

Deniz suyu adayları, klasik tatlı su projeleriyle aynı maliyet katsayıları kullanılarak değerlendirilmemelidir. Yaşam döngüsü bakım maliyeti ve malzeme yenileme ihtiyacı ayrı modellenmelidir.

---

## 8. Gökçekaya ve Altınkaya’nın stratejik önemi

Japonya Uluslararası İşbirliği Ajansı tarafından yürütülen tarihsel çalışmalarda Gökçekaya ve Altınkaya, Türkiye’nin öncelikli pompaj depolama adayları olarak kavramsal düzeyde incelenmiştir.

Çalışmada:

* Gökçekaya için 1.400 MW,
* Altınkaya için 1.800 MW

ölçeğinde kavramsal tasarımlar değerlendirilmiştir. Projeler; çevresel ve sosyal etkiler, inşaat maliyeti, talep merkezine uzaklık, iletim bağlantısı ve sistem kararlılığı katkısı açısından karşılaştırılmıştır. 

Bu çalışmalar Türkiye açısından önemli bir teknik başlangıç noktasıdır; ancak güncel yatırım kararı için tek başına yeterli değildir. Çalışmaların hazırlanmasından bu yana:

* Elektrik talep profili,
* Rüzgâr ve güneş kapasitesi,
* İletim sistemi topolojisi,
* Piyasa yapısı,
* Döviz ve inşaat maliyetleri,
* Deprem tehlikesi değerlendirmeleri,
* Çevresel ve sosyal standartlar,
* Pompa-türbin ve güç elektroniği teknolojileri

önemli ölçüde değişmiştir.

Bu nedenle Gökçekaya ve Altınkaya için yapılması gereken işlem eski raporları yalnızca yeniden yayımlamak değil; güncel sayısal arazi modelleri, sondajlar, jeofizik çalışmalar, saatlik piyasa verileri ve güncel TEİAŞ şebeke modelleriyle yeni bir fizibilite süreci yürütmektir.

JICA çalışması ayrıca PDHES bağlantısının yalnızca kısa bir santral-şalt sahası hattından ibaret olmadığını, bazı işletme senaryolarında daha geniş 380 kV şebeke takviyelerinin gerekebileceğini göstermiştir. Bu bulgu, PDHES ile iletim planlamasının ayrı süreçler olarak ele alınamayacağını ortaya koymaktadır. 

---

## 9. Aday saha seçiminde kullanılacak teknik ölçütler

Türkiye genelinde yalnızca büyük yükseklik farkına bakılarak PDHES adayı belirlemek yeterli değildir.

### 9.1. Net düşü

Brüt kot farkından su yolu kayıpları çıkarılarak gerçek net düşü hesaplanmalıdır. Tünel ve cebri boru kayıpları, özellikle yüksek debide önemli seviyeye ulaşabilir.

### 9.2. Düşü-su yolu oranı

Net düşünün toplam su yolu uzunluğuna oranı, adayların ilk karşılaştırmasında yararlı bir göstergedir.

Yüksek düşü ve kısa su yolu genellikle:

* Daha düşük kazı miktarı,
* Daha düşük hidrolik kayıp,
* Daha küçük boru çapı veya daha düşük debi,
* Daha düşük birim enerji maliyeti

avantajı sağlayabilir.

Ancak bu oran tek başına yatırım kararı vermez. Kaya kalitesi kötü olan kısa bir tünel, sağlam kayadaki daha uzun bir tünelden pahalı olabilir.

### 9.3. Aktif rezervuar hacmi

Toplam rezervuar hacmi yerine, güvenli işletme seviyeleri arasında kullanılabilecek aktif hacim hesaplanmalıdır.

Ölü hacim, dalga payı, sediman, asgari su seviyesi, acil durum rezervi ve çevresel işletme sınırları kullanılabilir enerjiyi azaltır.

### 9.4. Jeoloji ve hidrojeoloji

Ön incelemede şu unsurlar değerlendirilmelidir:

* Aktif faylara uzaklık,
* Kaya kütlesi sınıfı,
* Süreksizlik yönelimi,
* Geçirgenlik,
* Heyelan ve kaya düşmesi riski,
* Yeraltı suyu seviyesi,
* Şişen veya çözünen mineraller,
* Yeraltı santral boşluğunun kararlılığı.

PDHES projelerinde maliyet sapmasının en önemli nedenlerinden biri, erken aşamada yeterince tanımlanmayan jeolojik koşullardır.

### 9.5. Şebeke bağlantısı

Aday saha için yalnızca en yakın trafo merkezine uzaklık değil, aşağıdaki konular incelenmelidir:

* Bağlantı noktasının kısa devre gücü,
* Normal ve N-1 durumunda hat yüklenmeleri,
* Pompalama sırasında bölgesel gerilim profili,
* Üretim sırasında güç aktarım kapasitesi,
* Dinamik ve geçici kararlılık,
* Koruma koordinasyonu,
* Harmonik ve güç kalitesi,
* İlave hat veya trafo ihtiyacı.

### 9.6. Çevresel ve sosyal etkiler

Teknik olarak güçlü bir aday;

* Yerleşim alanlarını,
* Tarım arazilerini,
* korunan alanları,
* kültürel mirası,
* içme suyu havzalarını,
* orman ve hassas habitatları

etkiliyorsa geliştirme süreci uzayabilir veya proje uygulanamaz hâle gelebilir.

Bu nedenle çevresel ve sosyal risk, fizibilitenin sonunda değil saha eleme aşamasında değerlendirilmelidir.

---

## 10. Sabit veya değişken devirli teknoloji seçimi

Türkiye’de kurulacak yeni PDHES’lerde makine teknolojisi, yalnızca ilk yatırım maliyetine göre seçilmemelidir.

### Sabit devirli üniteler

Sabit devirli tersinir pompa-türbinler:

* Olgun ve kanıtlanmış teknolojiye sahiptir.
* Üretim modunda hızlı güç ayarı yapabilir.
* Senkron makine üzerinden fiziksel atalet sağlayabilir.
* Elektriksel yapısı görece sadedir.

Ancak pompalama modunda güç tüketiminin geniş bir aralıkta ayarlanması sınırlıdır.

### Değişken devirli üniteler

Değişken devirli teknoloji:

* Pompalama gücünün ayarlanmasını,
* Pompa modunda frekans kontrolünü,
* Değişen rezervuar seviyelerine daha iyi uyumu,
* Kısmi yüklerde daha uygun verimi,
* Daha geniş kararlı işletme bölgesini

sağlayabilir.

Türkiye’nin 120 GW güneş ve rüzgâr hedefi düşünüldüğünde, ilk büyük PDHES projelerinde değişken devirli seçenekler mutlaka teknik ve ekonomik karşılaştırmaya dâhil edilmelidir.

Doğru karar, “değişken devir her zaman daha iyidir” şeklinde verilmemelidir. İlave dönüştürücü maliyeti, kayıplar, bakım ihtiyacı ve arıza sırasında şebekede kalma performansı da değerlendirilmelidir.

---

## 11. PDHES’in yatırım modeli neden yalnızca enerji arbitrajına dayanamaz?

PDHES projeleri:

* Yüksek ilk yatırım maliyetine,
* Uzun izin ve inşaat süresine,
* Sahaya özgü jeolojik riske,
* Uzun ekonomik ömre

sahiptir.

Bu tür bir yatırımın yalnızca düşük fiyatla elektrik alıp yüksek fiyatla satması beklenirse gelir belirsizliği yüksek olur. Yenilenebilir kapasite arttıkça fiyat farkı bazı dönemlerde büyüyebilir; ancak yeni depolama yatırımları aynı farkı zaman içinde azaltabilir.

Finanse edilebilir bir PDHES modeli şu gelir kalemlerini birlikte değerlendirmelidir:

* Enerji arbitrajı,
* Frekans rezervleri,
* Reaktif güç ve gerilim desteği,
* Hazır kapasite ödemesi,
* Oturan sistemin toparlanması hizmeti,
* Yenilenebilir enerji kısıntısının azaltılması,
* İletim yatırımının ertelenmesi,
* Bölgesel şebeke sıkışıklığının azaltılması,
* Güvenilir kapasite katkısı.

Bu yaklaşım, “gelirlerin üst üste konulması” olarak adlandırılır. Ancak aynı kapasitenin aynı anda iki farklı hizmet için taahhüt edilmemesi gerekir. Piyasa kuralları, fiziksel enerji durumunu ve rezervuar kısıtlarını dikkate almalıdır.

---

## 12. Türkiye için önerilen düzenleyici çerçeve

On İkinci Kalkınma Planı, pompaj depolamalı HES’ler dâhil enerji depolama sistemlerinin tesis edilmesini açık bir politika tedbiri olarak tanımlamaktadır. Ancak politika hedefinin yatırım kararına dönüşmesi için teknolojiye özgü uygulama kuralları gereklidir. 

### 12.1. PDHES’in hukuki statüsü netleştirilmelidir

PDHES hem tüketici hem üretici gibi davranır. Pompalama sırasında şebekeden enerji çeker, üretim sırasında şebekeye enerji verir.

Bu nedenle:

* Lisans türü,
* Pompalama enerjisinin tarife ve vergi uygulaması,
* Şebeke kullanım bedelleri,
* Enerji kayıplarının muhasebeleştirilmesi,
* Su kullanım hakkı,
* Depolama ve üretim faaliyetinin aynı lisans içindeki ilişkisi

açık biçimde düzenlenmelidir.

Pompalama için alınan elektriğin nihai tüketim gibi vergilendirilmesi, depolama çevriminde çifte maliyet oluşturabilir.

### 12.2. Uzun vadeli kapasite ve kullanılabilirlik sözleşmeleri kurulmalıdır

Enerji arbitrajı dışındaki sistem değerleri, uzun vadeli ve ölçülebilir sözleşmelerle karşılanmalıdır.

Ödeme yalnızca kurulu güce değil:

* Belirli sürede devreye girme,
* En az belirli süre üretimi sürdürme,
* Yukarı ve aşağı rezerv sağlama,
* Pompa modunda güç ayarlama,
* Belirli gerilim desteğini sunma,
* Üst rezervuarda zorunlu enerji bulundurma

yükümlülüklerine bağlanabilir.

### 12.3. Rekabetçi kapasite tedariki uygulanmalıdır

Devlet veya sistem işletmecisi doğrudan saha seçmek yerine ihtiyaç duyulan hizmeti tanımlayabilir.

Örneğin:

* En az sekiz saat enerji,
* 500 MW ve üzeri güç,
* Belirli rampalama hızı,
* N-1 koşulunda güvenli bağlantı,
* Oturan sistemin toparlanması,
* Değişken pompalama yeteneği

gibi ölçütler ilan edilerek farklı teknolojilerin rekabet etmesi sağlanabilir.

Böylece PDHES teknoloji ayrıcalığı değil, sağladığı sistem hizmetlerinin gerçek değeri üzerinden desteklenmiş olur.

---

## 13. “En az 3.000 MW” hedefi nasıl yorumlanmalıdır?

Mevcut yazıda Türkiye’nin önümüzdeki on yılda en az 3.000 MW PDHES kapasitesini devreye alması önerilmektedir. Bu değer yön gösterici bir başlangıç olmakla birlikte, ayrıntılı bir ulusal sistem modeline dayandırılmadan kesin teknik ihtiyaç olarak sunulmamalıdır. 

Daha doğru yaklaşım, 3.000 MW’ı bir **ilk gelişim senaryosu** olarak ele almaktır.

Örnek bir başlangıç portföyü şu şekilde kurulabilir:

* Mevcut barajla bütünleşik bir büyük proje,
* Farklı bölgede ikinci bir mevcut rezervuar projesi,
* Şebeke ihtiyacına yakın kapalı çevrim bir proje,
* Teknik doğrulama amacıyla daha küçük ölçekli deniz suyu veya maden sahası pilotu.

Bu çeşitlilik sayesinde Türkiye:

* Farklı izin modellerini,
* Jeolojik riskleri,
* Makine seçeneklerini,
* Kamu-özel sektör yapılarını,
* Şebeke hizmeti gelirlerini

tek bir projeye bağımlı kalmadan test edebilir.

2035’e kadar ihtiyaç duyulacak toplam kapasite ise güneş ve rüzgârın gerçek gelişim hızına, batarya portföyüne, doğal gaz santrallerinin esnekliğine, enterkonneksiyon kapasitesine ve talep tarafı katılımına göre yeniden hesaplanmalıdır.

---

## 14. Türkiye için aşamalı uygulama yol haritası

### Birinci aşama: Ulusal ihtiyaç ve kaynak planlaması

İlk aşamada Türkiye çapında ortak veri standardına sahip bir PDHES envanteri oluşturulmalıdır.

Bu envanterde:

* Net düşü,
* Aktif rezervuar hacmi,
* su yolu uzunluğu,
* jeoloji,
* fay uzaklığı,
* şebeke bağlantısı,
* çevresel kısıtlar,
* arazi kullanımı,
* tahmini yatırım maliyeti,
* enerji kapasitesi

birlikte yer almalıdır.

Aynı dönemde TEİAŞ tarafından 2030 ve 2035 için saatlik üretim maliyeti, kaynak yeterliliği ve dinamik şebeke çalışmaları yürütülmelidir.

### İkinci aşama: Öncelikli projelerin güncel fizibilitesi

Gökçekaya ve Altınkaya gibi tarihsel adaylarla birlikte en güçlü kapalı çevrim sahaları güncel ölçütlerle yeniden incelenmelidir.

Bu aşamada:

* Sondaj ve jeofizik çalışmalar,
* Hidrojeolojik izleme,
* Güncel çevresel ve sosyal etki değerlendirmesi,
* Dinamik rezervuar simülasyonu,
* Pompa-türbin seçim çalışması,
* Şebeke bağlantı analizi,
* Finansman ve gelir modeli

tamamlanmalıdır.

### Üçüncü aşama: İlk yatırım dalgası

İlk proje yalnızca en düşük yatırım maliyetine göre seçilmemelidir. Türkiye’ye en fazla teknik öğrenme sağlayacak ve ilerideki portföy için standart oluşturacak proje tercih edilmelidir.

İlk yatırımın:

* Değişken devirli teknoloji,
* Otomatik üretim kontrolü,
* gelişmiş gerilim desteği,
* Oturan sistemin toparlanması,
* dijital ikiz,
* çevrim ve performans izleme

özelliklerini içermesi, sonraki projeler için önemli bir ulusal deneyim oluşturabilir.

### Dördüncü aşama: Portföy ölçeklendirmesi

İlk tesislerin performansı doğrulandıktan sonra kapasite; ihtiyaç duyulan bölgelere, depolama sürelerine ve şebeke hizmetlerine göre artırılmalıdır.

Amaç yalnızca en büyük toplam megavat değerine ulaşmak değil, coğrafi olarak dengeli bir esneklik portföyü oluşturmaktır.

---

## 15. Başlıca yatırım riskleri

### Jeolojik risk

Tünel, şaft ve yeraltı santralinde beklenmeyen kaya koşulları maliyet ve süre sapmasına yol açabilir. Erken aşamada yapılan ayrıntılı saha araştırması bu nedenle doğrudan finansman aracıdır.

### Hidrolojik ve su yönetimi riski

Mevcut rezervuarlı projelerde diğer su kullanım amaçlarıyla çatışma oluşabilir. Kapalı çevrim projelerde ise ilk dolum, buharlaşma ve sızıntı kayıpları değerlendirilmelidir.

### İnşaat ve maliyet riski

Uzun tüneller, büyük yeraltı boşlukları, ulaşım yolları ve rezervuar yapıları proje bütçesinin önemli bölümünü oluşturur. Sabit fiyatlı yapım sözleşmeleri bütün jeolojik riski ortadan kaldırmaz.

### Piyasa riski

Enerji fiyat farklarının beklenenden düşük olması arbitraj gelirini azaltabilir. Bu nedenle gelir modelinin yalnızca spot piyasaya dayanmaması gerekir.

### Düzenleyici risk

Lisans, su hakkı, çevresel izin, kamulaştırma ve bağlantı süreçlerinin farklı kurumlar arasında dağınık olması geliştirme süresini uzatabilir.

### Sosyal kabul riski

Kapalı çevrim olsa bile arazi kaybı, erişim yolları, kazı dökümü, görsel etki ve yerel su kullanımı toplumsal itiraza yol açabilir. Paydaş katılımı proje tasarımının başlangıcında yapılmalıdır.

---

## 16. Stratejik sonuç

Türkiye’nin 2035 için belirlediği 120 GW güneş ve rüzgâr hedefi, yalnızca yeni üretim santrallerinin kurulmasıyla tamamlanabilecek bir program değildir. Aynı ölçekte:

* İletim yatırımı,
* enerji depolama,
* esnek üretim,
* talep tarafı katılımı,
* dijital sistem işletmesi,
* frekans ve gerilim desteği

geliştirilmelidir.

PDHES, bu dönüşümün her sorununu tek başına çözen bir teknoloji değildir. Ancak çok saatli enerji depolama ile fiziksel şebeke desteğini aynı tesiste birleştirebildiği için Türkiye açısından benzersiz bir değere sahiptir.

Kapalı çevrim projeler, yeni coğrafi seçenekler yaratabilir. Mevcut rezervuarla bütünleşik projeler, altyapı maliyetini azaltabilir. Deniz suyu projeleri, kıyı bölgelerinde tatlı su kullanmadan yeni çözümler sağlayabilir. Değişken devirli makineler ise PDHES’i yalnızca elektrik üreten değil, pompalama sırasında da sistemi dengeleyen bir kaynağa dönüştürebilir.

Türkiye’nin önündeki asıl engel teknolojinin olgunlaşmamış olması değildir. Temel eksiklikler:

* Güncel ulusal ihtiyaç modelinin bulunmaması,
* Öncelikli projelerin güncel fizibilitesinin tamamlanmaması,
* Uzun süreli depolama için gelir güvencesinin oluşturulmaması,
* PDHES’in tüketim, üretim ve depolama faaliyetlerini birleştiren hukuki statüsünün netleşmemesidir.

Bu nedenle ilk hedef yalnızca “3.000 MW PDHES kurmak” olarak tanımlanmamalıdır.

Daha doğru stratejik hedef şudur:

> Türkiye’nin enerji, kapasite, frekans, gerilim ve arz güvenliği ihtiyaçlarını birlikte karşılayacak; teknik olarak doğrulanmış, çevresel olarak kabul edilebilir ve finansal olarak uygulanabilir bir PDHES portföyü oluşturmak.

Başarılı bir program, Türkiye’nin yenilenebilir enerji kapasitesini artırmakla kalmayacak; bu kapasitenin gerçek zamanlı elektrik sisteminde güvenli ve ekonomik olarak kullanılabilmesini sağlayacaktır.

# Teknik Terimler ve Kısaltmalar Sözlüğü

**aFRR – Otomatik Frekans Yenileme Rezervi:** Frekansı hedef değerine ve kontrol bölgeleri arasındaki güç alışverişini planlanan seviyeye geri döndürmek amacıyla otomatik üretim kontrolü üzerinden etkinleştirilen rezerv.

**AGC – Otomatik Üretim Kontrolü:** Üretim ve depolama birimlerinin güçlerini sistem işletmecisinin merkezi kontrol sinyaline göre sürekli olarak değiştiren denetim yapısı.

**Atalet Sabiti H:** Senkron makinenin anma gücüne göre depoladığı dönme enerjisini saniye cinsinden ifade eden dinamik sistem parametresi.

**BESS – Batarya Enerji Depolama Sistemi:** Elektrokimyasal hücreler, dönüştürücüler ve enerji yönetim sistemi aracılığıyla şebekeye çift yönlü güç aktarabilen depolama tesisi.

**Black Start – Oturan Sistemin Toparlanması:** Geniş çaplı sistem çökmesi sonrasında dış şebeke beslemesi olmadan üretim biriminin başlatılması ve elektrik sisteminin kontrollü olarak yeniden enerjilendirilmesi.

**Çevrim Verimi:** Pompalamada tüketilen toplam elektrik enerjisine karşılık üretim sırasında şebekeye geri verilen elektrik enerjisinin oranı; hidrolik, mekanik, elektriksel ve yardımcı tüketim kayıplarını içerir.

**Değişken Devirli PDHES:** Motor-jeneratör hızının sınırlı veya geniş bir aralıkta değiştirilebildiği, özellikle pompalama modunda güç ayarına imkân sağlayan PDHES yapısı.

**DFIM – Çift Beslemeli Asenkron Makine:** Statoru doğrudan şebekeye, rotoru kısmi güçlü frekans dönüştürücüsüne bağlı olan değişken devirli motor-jeneratör teknolojisi.

**ELCC – Etkin Yük Taşıma Yeteneği:** Bir üretim veya depolama kaynağının sistem güvenilirliğini bozmadan karşılanabilecek puant talebe yaptığı istatistiksel katkı.

**FCR – Frekans Tutma Rezervi:** Bir üretim-tüketim dengesizliği sonrasında frekans sapmasını sınırlamak için yerel frekans ölçümüne göre otomatik olarak etkinleşen rezerv.

**FRT – Arıza Sırasında Şebekede Kalma Yeteneği:** Bir tesisin kısa süreli gerilim düşümü, yükselmesi veya frekans sapması sırasında bağlantısını koruyarak öngörülen desteği sürdürmesi.

**GFM – Şebeke Oluşturan Dönüştürücü Denetimi:** Düşük kısa devre güçlü veya enerjisiz bir sistemde gerilim ve frekans referansı oluşturabilen güç elektroniği denetim yaklaşımı.

**Hidrolik Geçici Rejim:** Türbin yükü, vana açıklığı veya pompa işletmesindeki hızlı değişikliklerin su yolu boyunca oluşturduğu zamana bağlı basınç ve debi davranışı.

**LCOS – Seviyelendirilmiş Depolama Maliyeti:** Depolama tesisinin yatırım, finansman, işletme, kayıp ve yenileme maliyetlerinin ekonomik ömrü boyunca şebekeye verdiği enerjiye indirgenmesiyle hesaplanan maliyet göstergesi.

**mFRR – Elle Etkinleştirilen Frekans Yenileme Rezervi:** Otomatik rezervlerin ardından sistem işletmecisi talimatıyla etkinleştirilen ve güç dengesinin yeniden kurulmasını sağlayan rezerv.

**N-1 Güvenlik Ölçütü:** Sistemdeki tek bir hat, trafo, üretim birimi veya diğer önemli elemanın kaybı sonrasında işletme sınırlarının ihlal edilmemesi gerekliliği.

**NPSH – Net Pozitif Emme Yüksekliği:** Pompa veya pompa-türbin girişinde kavitasyon oluşmadan işletme için gerekli basınç koşulunu tanımlayan hidrolik ölçüt.

**P-Q Yetenek Eğrisi:** Bir motor-jeneratörün veya güç dönüştürücüsünün farklı aktif güç seviyelerinde güvenli olarak sağlayabileceği reaktif güç sınırlarını gösteren işletme bölgesi.

**Rezervuar Enerji Durumu:** Üst rezervuardaki kullanılabilir su hacminin, işletilebilir toplam enerji kapasitesine göre anlık seviyesini gösteren depolama durumu.

**RoCoF – Frekans Değişim Hızı:** Bir güç dengesizliği sonrasında sistem frekansının zamana göre değişim oranı; düşük ataletli sistemlerde koruma ve kararlılık açısından kritik göstergedir.

**SCR – Kısa Devre Oranı:** Bağlantı noktasındaki kısa devre gücünün bağlanan tesisin anma gücüne oranı; şebekenin elektriksel olarak güçlü veya zayıf olduğunu değerlendirmede kullanılır.

**Senkron Kompanzatör Modu:** Motor-jeneratörün hidrolik güç alışverişi olmadan şebekeye bağlı tutularak reaktif güç, kısa devre katkısı ve fiziksel atalet sağlaması.

**Su Darbesi:** Debinin hızlı değişmesi sonucunda tünel ve cebri boru sisteminde oluşan geçici basınç dalgası.

**WACC – Ağırlıklı Ortalama Sermaye Maliyeti:** Borç ve öz kaynak maliyetlerinin finansman yapısındaki paylarına göre ağırlıklandırılmasıyla hesaplanan ve yatırımın indirgeme oranını doğrudan etkileyen maliyet göstergesi.

**Yan Hizmet Gelirlerinin Birleştirilmesi:** Bir depolama tesisinin enerji arbitrajı, rezerv, gerilim desteği, kapasite ve oturan sistemin toparlanması gibi farklı hizmetlerden gelir elde etmesi; fiziksel kapasitenin mükerrer taahhüt edilmemesi şartıyla uygulanır.

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
