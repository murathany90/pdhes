export interface ReportItem {
  id: string;
  title: string;
  category: 'report' | 'summary' | 'news';
  author: string;
  publishDate: string;
  readTime: number;
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
    coverImage: '/pdhes-nedir/img-15.webp',
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

Tarihsel proje portföyünde en somut isim **Gökçekaya PDHES**’tir. JICA’nın proje sayfasında Gökçekaya için hedef; ayarlanabilir hızlı pompaj depolama santrali kurarak pik talep artışını karşılamak ve şebekeyi stabilize etmek olarak tanımlanmıştır. JICA’nın fizibilite dokümanları, Türkiye’de pompaj depolama ihtiyacının 2009–2011 döneminde ilgili kurumlar arasında teyit edildiğini ve **Gökçekaya ile Altınkaya** sahalarının öncelikli adaylar olarak seçildiğini; o dönem öngörüsünde ilk ünitenin 2023’te devreye gireceğinin varsayıldığını göstermektedir. 

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

Güncel resmî belgeler ışığında Türkiye’de PDHES için politik yönelim pozitiftir, teknik ihtiyaç kuvvetlenmektedir, fakat regülasyon ve gelir modeli eksiktir. ETKB ve Kalkınma Planı belgeleri depolamayı, hatta açıkça pompaj depolamalı HES’i stratejik ihtiyaç olarak tanımlıyor. JICA veri tabanı ve tarihsel çalışmalar Gökçekaya ile Altınkaya gibi sahaların yıllardır masada olduğunu gösteriyor. Buna rağmen güncel kamu belgeleri, kısa vadede PDHES’in ticari ölçekte hayata geçirilmesini sağlayacak net bir kapasite gelir modeli, PDHES’e özgü yan hizmet kural seti ve proje bazlı ilerleme takvimi ortaya koymuyor. 

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

Bu ölçek, PDHES’i yalnızca bir enerji arbitraj varlığı olmaktan çıkarır; teknoloji aynı zamanda **frekans kontrolü, voltaj regülasyonu, sistem ataleti, yedek güç ve black start** gibi hizmetlerin taşıyıcısıdır. IHA ve IRENA, özellikle değişken yenilenebilir üretim payı arttıkça PDHES’in hızlı mod değişimi, yüksek güç kapasitesi ve çok-saatli deşarj özelliği nedeniyle sistem esnekliğinin temel araçlarından biri hâline geldiğini açık biçimde ortaya koymaktadır. 

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

PDHES’in yan hizmet portföyü, yalnızca aktif güçle sınırlı değildir. IHA ve IRENA, pompaj depolamanın **reaktif güç kontrolü, voltaj regülasyonu, operating reserve, black start ve inertia** sağlama kabiliyetini temel avantajlar arasında sayar. J-POWER’ın işletme açıklaması da pompaj depolamanın güç çıkışı, sistem frekansı ve sistem voltajı ayarına elverişli olduğunu belirtir. 

Reaktif güç ve voltaj kontrolü tarafında modern değişken devirli ünitelerin üstünlüğü belirgindir. Argonne, ayarlanabilir devirli ünitelerin aktif ve reaktif gücü frekans dönüştürücü üzerinden **elektronik olarak ayrıştırılmış** biçimde kontrol edebildiğini, bunun da daha esnek voltaj desteği sunduğunu belirtir. NREL’in elektrik sistemleri raporunda da hem full-converter hem DFIM tabanlı ayarlanabilir hızlı pompaj sistemlerinde reaktif güç kontrolünün mümkün olduğu; normal işletmede generatörün bir **PV bus** olarak voltajı, ya da bir **PQ bus** olarak reaktif gücü düzenleyebildiği belirtilir. Arıza anlarında ise dönüştürücü akımları çoğu durumda şebeke voltajına destek için reaktif bileşen yönünde komuta edilir. 

Burada önemli bir ayrıntı vardır: **DFIM ile full-converter aynı şey değildir**. NREL karşılaştırması, full-converter temelli çözümlerde statorun şebekeden **tam ayrıştığını**, bu nedenle güç sistemi salınımlarının rotor ve hidrolik tarafta daha iyi tamponlanabildiğini söyler. DFIM’de ise stator şebekeye bağlı kaldığından, özellikle yakın arızalarda crowbar ve koruma koordinasyonu devreye girer. Başka bir deyişle full-converter çözüm, zayıf şebeke ve fault ride-through gereksinimleri ağırlaştıkça daha “grid-forming’e yakın” bir davranış alanı açar; DFIM ise maliyet ve olgunluk açısından daha çekici kalır. 

Atalet boyutunda PDHES’in değeri daha da stratejiktir. IHA, pompaj depolamanın **system inertia** sağladığını açık biçimde belirtir. NREL de yenilenebilir üretim arttıkça klasik senkron makine parkının azalmasıyla sistemdeki döner kütle seviyesinin düştüğünü ve özellikle ayarlanabilir devirli PDHES’in hızlı ve esnek cevapla sistem kararlılığına katkı verdiğini vurgular. Klasik senkron generatörlü PDHES burada “gerçek fiziksel atalet” sunar; değişken devirli ve güç elektroniği destekli çözümler ise buna ek olarak **hızlı frekans yanıtı** ve bazı uygulamalarda **virtual inertia benzeri kontrol** sağlayabilir. 

Bu bölümün temel denklemi swing denklemidir:
\[
\frac{2H}{\omega_s}\frac{d\omega}{dt} = P_m - P_e
\]
Sistemde ani üretim kaybı olduğunda \(P_e>P_m\) olur, rotorlar yavaşlar ve frekans düşer. PDHES’in döner kütlesi ile türbin-governor/dönüştürücü kontrolü, bu ilk frekans düşüş eğimini yumuşatır. Özellikle düşük ataletli, yüksek inverter penetrasyonlu şebekelerde bu katkı yalnızca “enerji sağlama” değil, **RoCoF azaltma** açısından da değerlidir. Bu ikinci cümle, yukarıdaki kaynaklardan türetilmiş mühendislik çıkarımıdır. 

Black start kabiliyeti açısından hidro tesisler çok güçlü adaylardır ve PDHES bu üstünlüğün büyük kısmını paylaşır. DOE’nin black start raporuna göre hidro tesisler **küçük istasyon yardımcı güç ihtiyacı**, **hızlı yeniden başlatma**, **frekans salınımlarına dayanıklılık**, **yüksek rampa yeteneği** ve çoğu durumda diğer santralleri ayağa kaldırmaya yetecek gerçek ve reaktif güç kapasitesi nedeniyle black start için son derece uygundur. Aynı kaynak, hidro santrallerin **10 dakikaya kadar inebilen** başlatma süresine sahip olabildiğini ve ABD’de black start için tutulan/test edilen birimlerin yaklaşık **%40’ının hidro türbin** olduğunu, oysa hidro kurulu gücünün toplamın yalnızca yaklaşık **%10’u** olduğunu bildirir. 

PDHES için tek kritik çekince, DOE’nin de belirttiği gibi, ekonomik dispatch nedeniyle üst rezervuarın boşalmış olabilmesidir. Bu yüzden bir pompaj depolama tesisinin black start kaynağı olarak güvenilir kabul edilmesi için işletme planında **üst haznede ayrılmış su rezervi** tutulması gerekir. Yani black start kabiliyeti “teknolojiye içkin” olsa da, bunun şebeke düzeyinde güvenilir hizmete dönüşmesi **hidrolik stok yönetimine** bağlıdır. 

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

Bu rapor ağırlıklı olarak **U.S. DOE, ANL, NREL, ORNL, PNNL, ENTSO-E, ACER, IHA, IRENA ve GEM** kaynaklarına dayandırılmıştır. Özellikle teknoloji karşılaştırmaları için ANL ve NREL raporları; frekans kontrol zamanları için ENTSO-E/ACER belgeleri; black start analizi için DOE hidro raporu; küresel bağlam için IHA ve GEM kaynakları kullanılmıştır. `
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
    id: 'seawater-pdhes-failure-analysis',
    title: 'Deniz Suyu PDHES Başarısızlık Analizi: Okinawa Yanbaru Örneği',
    category: 'report',
    author: 'Sistem Araştırma Modülü',
    publishDate: '2026-07-07',
    readTime: 20,
    coverImage: '/pdhes_site_gorselleri_webp/italya_dev_yercekimi_bataryasi/italya_dev_yercekimi_bataryasi_01.webp',
    summary: 'Dünyadaki ilk ve tek deniz suyu pompaj depolamalı hidroelektrik santrali olan Okinawa Yanbaru projesinin neden başarısız olduğuna dair kapsamlı mühendislik ve ekonomik analiz.',
    content: `# **Dünyadaki Deniz Suyu Pompaj Depolamalı Hidroelektrik Santrallerinin Kapsamlı Analizi: Okinawa Yanbaru Örneği ve Küresel Perspektif**

## **Küresel Enerji Dönüşümü ve Enerji Depolama Paradigmasının Evrimi**

Küresel enerji matrisi, iklim değişikliği ile mücadele ve karbon nötr hedefleri doğrultusunda, fosil yakıtlardan yenilenebilir enerji kaynaklarına doğru tarihsel ve benzeri görülmemiş bir hızla kaymaktadır. Ancak, özellikle rüzgar ve güneş enerjisi gibi kaynakların doğasında var olan kesintililik (intermittency) ve meteorolojik koşullara bağlı değişkenlik, modern elektrik şebekelerinin stabilitesini, güvenilirliğini ve operasyonel esnekliğini tehdit eden en büyük mühendislik ve ekonomik problemlerden biri haline gelmiştir. Bu bağlamda, enerji arzı ile enerji talebi arasındaki zamansal uyumsuzluğu gidermek, şebeke frekansını düzenlemek ve baz yük ihtiyacını karşılamak için "uzun süreli enerji depolama" (Long-Duration Energy Storage \- LDES) sistemleri kritik bir altyapı zorunluluğu olarak öne çıkmaktadır. Günümüzde, batarya teknolojilerindeki muazzam ilerlemelere rağmen, küresel elektrik depolama kapasitesinin yüzde 94'ünden fazlası hala kanıtlanmış, uzun ömürlü ve büyük ölçekli bir teknoloji olan geleneksel Pompaj Depolamalı Hidroelektrik Santralleri (PDHES) tarafından sağlanmaktadır.1  
Geleneksel PDHES sistemleri, aralarında belirli bir kot farkı (düşü) bulunan iki devasa tatlı su rezervuarı arasında suyun yerçekimine karşı pompalanması ve ardından yerçekimi ivmesiyle türbinlenmesi prensibiyle çalışır. Temel fiziksel prensip, ihtiyaç fazlası ve ucuz elektriğin bulunduğu saatlerde suyun yukarı pompalanarak potansiyel enerji formunda depolanması, talebin pik yaptığı saatlerde ise bu suyun aşağı bırakılarak kinetik ve nihayetinde elektrik enerjisine dönüştürülmesidir.4 Bu termodinamik dönüşüm, matematiksel olarak potansiyel enerji formülü ile ifade edilir:  
$ E = \rho \cdot g \cdot H \cdot V \cdot \eta $  
Bu denklemde $E$ depolanan toplam enerjiyi, $\rho$ kullanılan suyun yoğunluğunu, $g$ yerçekimi ivmesini, $H$ iki rezervuar arasındaki net düşüyü, $V$ pompalanabilen suyun hacmini ve $\eta$ hidromekanik ve elektromekanik sistemin genel çevrim verimliliğini (round-trip efficiency) temsil etmektedir.9 Bu fiziksel gerçekliğin gösterdiği üzere, yüksek bir enerji depolama kapasitesi elde etmek için mühendislerin ya düşü miktarını ($H$) ya da kullanılabilir su hacmini ($V$) maksimize etmeleri gerekmektedir. Ancak geleneksel tatlı su tabanlı PDHES tesislerinin inşası, spesifik topografik koşullara, yani birbirine yakın ancak aralarında yüksek kot farkı bulunan dağlık alanlara ve devasa hacimlerde tatlı su kaynaklarına sıkı sıkıya bağlıdır. Dünyanın pek çok gelişmiş bölgesinde, özellikle Japonya ve Avrupa'da, bu coğrafi kriterleri karşılayan tatlı su alanlarının halihazırda değerlendirilmiş olması veya katı çevresel koruma kanunlarıyla sınırlandırılması, sektörü yeni ve sınırsız bir kaynak arayışına itmiştir.10  
İşte tam bu noktada "Deniz Suyu Pompaj Depolamalı Hidroelektrik Santrali" (DSPDHES) konsepti teorik bir mühendislik devrimi olarak ortaya çıkmıştır. Okyanusların ve denizlerin sistemin alt rezervuarı olarak kullanılması, formüldeki su hacmi ($V$) kısıtlamasını teorik olarak sonsuzluğa genişletmekte ve kara içlerindeki tatlı su ekosistemleri üzerindeki ekolojik baskıyı tamamen ortadan kaldırmaktadır.6 Okyanusların alt rezervuar olarak işlev gördüğü bu sistemlerde, yalnızca kıyı şeridine yakın, yüksek rakımlı bir falez veya dağ zirvesine tek bir yapay üst rezervuarın inşa edilmesi yeterli olmaktadır.6 Ancak okyanus suyunun sınırsız potansiyeli, beraberinde muazzam metalurjik tahribat, biyolojik istila ve çevresel yıkım potansiyellerini de getirmektedir. Bu araştırma raporu, deniz suyu kullanan dünyadaki ilk PDHES pilot uygulaması olan Okinawa Yanbaru projesinin neden başarısız olduğunu, sistemin arkasındaki korozyon ve biyo-kirlenme zorluklarını, Şili, Avustralya, Japonya ve İspanya gibi ülkelerdeki diğer deniz tipi PDHES projelerinin geçmişini ve bu teknolojinin gelecekteki evrimini son derece detaylı bir analitik çerçevede incelemektedir.

## **Deniz Suyu Pompaj Depolama Sistemlerinin Hidromekanik Anatomisi**

Deniz suyu pompaj depolamalı hidroelektrik sistemlerinin temel anatomisi, geleneksel tatlı su sistemlerine benzemekle birlikte, deniz ortamının getirdiği agresif korozyon ve hidrodinamik zorluklara dayanacak şekilde tamamen yeniden tasarlanmak zorundadır. Bu sistemler, şebeke stabilitesini sağlamak, değişken yenilenebilir enerjiyi entegre etmek ve baz yük santrallerinin verimliliğini maksimize etmek için senkronize çalışan yedi temel mühendislik bileşeninden oluşur.8 Analizin derinleşebilmesi için bu bileşenlerin işlevselliklerinin incelenmesi şarttır.  
Birinci bileşen, enerjinin depolandığı üst rezervuardır. Deniz kıyısına yakın bir yükseltide, genellikle dağlık bir alanda inşa edilen bu yapay göl, suyun potansiyel enerjisini barındırır. İkinci bileşen ise alt rezervuardır; deniz suyu PDHES konseptinde bu, doğrudan Pasifik, Atlantik veya Hint Okyanusu gibi sınırsız bir su kütlesidir. Üçüncü hayati yapı, suyu üst rezervuara taşıyan ve oradan da türbinlere indiren devasa cebri borulardır (penstock). Bu borular, muazzam su basınçlarına ve deniz suyunun içsel aşındırıcı etkilerine karşı koymak zorundadır.8 Dördüncü ve en kritik bileşen ise pompa-türbin ünitesidir. Genellikle Francis tipi olarak tasarlanan bu çok yönlü makineler, şebekede fazla elektrik olduğunda suyu yukarı basan devasa bir pompa olarak, elektrik talebi zirve yaptığında ise aşağı akan suyun kinetik enerjisini mekanik enerjiye çeviren bir türbin olarak çift yönlü çalışır.8  
Beşinci bileşen olan elektrik jeneratörleri ve motorları, pompa-türbin şaftına doğrudan bağlıdır; hidrolik enerjiyi şebeke için elektriğe veya şebeke elektriğini pompalama gücüne dönüştürürler. Altıncı bileşen olan kontrol ve izleme sistemleri, tüm tesisin sinir ağını oluşturur, vana açıklıklarını, su debisini ve mod geçişlerini mili-saniyeler içinde ayarlayarak şebeke frekansındaki dalgalanmalara anında yanıt verir.8 Yedinci ve son bileşen ise, doğrudan denizle etkileşime giren su alma (intake) ve deşarj (discharge) yapılarıdır. Bu yapılar, deniz ekosistemine, balıklara ve bentik habitatlara zarar vermemek için akış hızını düşüren, türbülansı sönümleyen özel tasarımlar gerektirir.8 Tüm bu bileşenlerin okyanus suyuyla doğrudan ve sürekli teması, mühendislik biliminin sınırlarını zorlayan materyal bilimini zorunlu kılmaktadır.

## **Dünyanın İlk Deniz Suyu PDHES'i: Okinawa Yanbaru Projesi**

Japonya, ada ülkesi doğası, coğrafi kısıtlılıkları ve yüksek fosil yakıt ithalatı bağımlılığı nedeniyle tarihsel olarak enerji verimliliğine ve depolama sistemlerine devasa bütçeler ayıran bir ülkedir. Japonya'nın elektrik tüketim profili, gündüz ve gece arasındaki belirgin ve keskin talep dalgalanmaları ile karakterize edilir.10 Bu büyük değişkenliği yönetmek ve nükleer ile termik santrallerin gece boyunca maksimum verimle, sabit bir baz yükte çalışmasını sağlamak için Japonya, nehir sistemleri üzerinde çok sayıda geleneksel PDHES inşa etmiştir.7 Ancak 1980'lerin sonu ve 1990'ların başına gelindiğinde, Japonya genelinde ticari olarak uygun, ekonomik ve çevresel onayı alınabilecek karasal tatlı su potansiyeli neredeyse tamamen tükenmiş, sektör bir doygunluk noktasına ulaşmıştır.7  
Bu coğrafi kısıtlama, Japonya Uluslararası Ticaret ve Sanayi Bakanlığı'na (METI) bağlı Doğal Kaynaklar ve Enerji Ajansı'nı radikal bir çözüm aramaya itmiştir. Bakanlık, Elektrik Enerjisi Geliştirme Şirketi'ni (Electric Power Development Company \- EPDC, güncel adıyla J-Power), doğrudan deniz suyunu kullanan bir PDHES sisteminin teorik fizibilitesini, inşasını ve test süreçlerini yürütmekle görevlendirmiştir.7 Bu görevlendirme, deniz suyunun tahrip edici potansiyeline karşı küresel ölçekteki ilk büyük mühendislik meydan okuması olarak tarihe geçmiştir.

### **Projenin Doğuşu, Tasarımı ve Teknik Spesifikasyonları**

Okinawa Yanbaru Deniz Suyu Pompaj Depolamalı Hidroelektrik Santrali projesinin bilimsel araştırma, materyal testi ve saha etüdü aşamaları 1981 yılında büyük bir titizlikle başlatılmıştır.7 On yıl süren yoğun malzeme bilimleri ve korozyon araştırmalarının ardından, tesisin fiziksel inşasına Okinawa adasının kuzeybatısında, Kunigami köyünün sınırları içerisinde, doğrudan Pasifik Okyanusu'na (Filipin Denizi kıyıları) bakan sarp bir arazide başlanmıştır. İnşaatın başlama tarihi bazı kaynaklarda 1987, bazılarında ise 1991 olarak geçmekte olup, temel altyapı ve yeraltı kazı çalışmalarının 1990'ların başında ivme kazandığı bilinmektedir.7  
Tesisin inşası, Japon sivil mühendisliğinin zirve noktalarından biri olarak kabul edilmiş ve 1998 sonlarında tamamlanarak 16 Mayıs 1999 tarihinde beş yıllık zorlu bir test ve demonstrasyon operasyonu için resmi olarak devreye alınmıştır.16 Bu devasa altyapı yatırımı için dönemin parasıyla 32 Milyar Japon Yeni (bazı kaynaklarda 30 Milyar Yen veya 3.2 Milyar Yen hatalı yazımlarına rağmen, genel endüstri konsensüsü projenin yaklaşık 232-250 Milyon Euro veya 300 Milyon ABD Dolarına mal olduğu yönündedir) harcanmıştır.4 Tesisin yenilikçi inşaat metotları, Japonya İnşaat Mühendisleri Odası tarafından Mayıs 2000'de "Üstün İnşaat Mühendisliği Başarı Ödülü" ile onurlandırılmıştır.16  
Tesisin mühendislik sınırlarını zorlayan teknik parametreleri ve devasa boyutları, Tablo 1'de ayrıntılı olarak yapılandırılmıştır.

| Teknik Parametre | Spesifikasyon / Değer |
| :---- | :---- |
| **Lokasyon / Operatör** | Kunigami, Okinawa, Japonya / J-Power (EPDC) 16 |
| **Kurulu Güç (Maksimum Çıkış)** | 30 MW (40.000 beygir gücü) 16 |
| **Etkin Düşü (Effective Head)** | 136 metre 6 |
| **Maksimum Su Debisi** | 26 m³/saniye 6 |
| **Üst Rezervuar Toplam Hacmi** | 564.000 metreküp (457 acre-feet) 6 |
| **Üst Rezervuar Geometrisi** | Sekizgen planlı yapay kazı, maksimum genişlik 252m, derinlik 25m 6 |
| **Üst Rezervuar Konumu** | Kıyı şeridinden 600m içeride, deniz seviyesinden 150m yüksekte 6 |
| **Alt Rezervuar** | Pasifik Okyanusu (Filipin Denizi) 6 |
| **İşletmeye Alınma Tarihi** | 16 Mayıs 1999 16 |
| **Kapatılma / Söküm Tarihi** | Temmuz 2016 8 |
| **Toplam Yatırım Maliyeti** | Yaklaşık 32 Milyar Japon Yeni 4 |

Okinawa Yanbaru projesinin inşasındaki temel zorluk, projenin tamamen bakir bir subtropikal orman olan Yanbaru ormanı içerisinde yer almasıydı. Bu bölge, eşsiz bir bitki örtüsüne ve Okinawa'ya özgü nadir alt türleri barındıran zengin bir ekosisteme ev sahipliği yapıyordu. Tesisin inşa edileceği alanın çevresindeki özel doğa koruma alanında, kuşlar, memeliler, amfibiler ve kabuklular dahil olmak üzere nesli tükenmekte olan on altı farklı hayvan türü tespit edilmişti.4 Bu nedenle EPDC mühendisleri, inşaat öncesinde, sırasında ve sonrasında olağanüstü çevresel koruma önlemleri almak zorunda kalmış, deniz suyunun bu ekosisteme zarar vermemesi için tesis tasarımında metamorfik değişimlere gitmişlerdir.4

### **Korozyon ve Biyolojik İstilalara Karşı Geliştirilen İnovasyonlar**

Deniz suyunun yüksek basınçlı hidrolik sistemlerde doğrudan kullanımındaki en büyük iki yıkıcı güç, tuz kaynaklı ekstrem korozyon (salt damage) ve kaya koruğu (barnacles), istiridye, midye gibi deniz canlılarının yapıların iç yüzeylerine yerleşerek oluşturdukları biyo-kirlenmedir (biofouling).18 Deniz suyu kullanan pompa-türbinler, geleneksel tatlı su nehir türbinlerine kıyasla çok daha sert ve amansız bir aşınma ortamında çalışır.11 Japon mühendislik dehası, Yanbaru tesisini bu doğa güçlerine karşı korumak için üç temel yapısal inovasyon geliştirmiştir.  
Birinci devrimsel inovasyon, devasa su iletim hatlarında kullanılmıştır. Suyun üst rezervuardan türbinlere devasa bir basınç ve debiyle (26 m³/s) indiği yer altı cebri boruları (penstocks), geleneksel çelik yerine korozyona tamamen dirençli ve deniz canlılarının yapışmasını fiziksel olarak zorlaştıran devasa Fiber Takviyeli Plastik (FRP-M) malzemeden üretilmiştir.8 Fiber takviyeli plastik borular, sadece paslanmaya karşı mutlak bir bağışıklık sunmakla kalmamış, aynı zamanda çelikten çok daha hafif oldukları için yeraltı şaftlarına montajı da kolaylaştırmıştır.13 Tesisin test dönemleri boyunca dalgıçlar tarafından yapılan periyodik iç incelemelerde, yüksek hızlı su akışı ve pürüzsüz FRP yüzeyi sayesinde cebri boruların iç yüzeyinde deniz canlılarının tutunmadığı (no adhesion of marine creatures) kesin olarak doğrulanmıştır.8  
İkinci hayati inovasyon, tesisin mekanik kalbi olan Francis tipi pompa-türbinlerde kullanılan metalurjik alaşımlardır. Deniz suyu gibi klorür açısından zengin agresif elektrolitler, normal çeliklerin koruyucu pasif oksit tabakasını delerek çukurcuk korozyonu (pitting) ve aralık korozyonu (crevice corrosion) başlatır. Bunu engellemek için türbin çarkı (runner) ve kılavuz kanatçıklar (wicket gates) gibi suyla sürekli yüksek hızda temas eden hareketli parçalar, korozyon direncini olağanüstü boyutlara taşıyan, düşük karbonlu ve azot ilaveli özel östenitik paslanmaz çelikten (nitrogen-added special austenitic stainless steel) üretilmiştir.18 Azot ilavesi, malzemenin klorür saldırılarına karşı lokalize direncini maksimize etmiştir. Ek olarak, boya çiziklerinden veya statik kör noktalardan kaynaklanabilecek korozyonu önlemek amacıyla sisteme aktif, akım ayarlı katodik koruma (cathodic protection) mekanizmaları entegre edilmiştir. Korozyon hızı su akış hızıyla doğru orantılı arttığından, katodik koruma akımı suyun hızına göre dinamik olarak ayarlanabilen bir yapıya sahipti.13  
Üçüncü ve en büyük çevresel koruma inovasyonu, yapay üst rezervuarın yalıtımıdır. Pasifik Okyanusu'ndan 150 metre yüksekliğe pompalanan yarım milyon metreküp tuzlu suyun, yeraltındaki tatlı su akiferlerine sızması veya Yanbaru ormanının toprağına karışması, telafisi imkansız bir ekolojik yıkım anlamına gelirdi.17 Yeraltına sızıntıyı sıfıra indirmek ve çevresel felaketi önlemek için, sekizgen planlı üst rezervuarın tüm iç yüzeyi sızdırmaz, ultra dayanıklı EPDM (Etilen Propilen Dien Monomer) kauçuk tabakalarla (rubber sheeting) tamamen kaplanmıştır.8 Bu kauçuk membranın altına çift katmanlı bir sızıntı tespit ve drenaj sistemi inşa edilmiştir. Rezervuarın Ağustos 1998'de suyla doldurulmaya başlanmasından itibaren yapılan testlerde ve sonraki işletme yıllarında hiçbir su sızıntısı tespit edilmemiştir.8 Üstelik rüzgarın tuzlu suyu çevreye savurması (seawater dispersion) riskine karşı çevredeki atmosfer, yağmur suyu, toprak, flora ve fauna sürekli analiz edilmiş, santralin çalışmasından kaynaklanan hiçbir tuzluluk artışı veya ekolojik zarar kaydedilmemiştir.8

## **Başarısızlığın Anatomisi: Okinawa Yanbaru Neden Bir 'Hayalete' Dönüştü?**

Mühendislik açısından Okinawa Yanbaru projesi eşi görülmemiş bir başarı öyküsüydü. Deniz suyunun korozyonuna karşı direnmiş, bitki örtüsünü korumuş ve bölgeyi vuran şiddetli tayfun koşullarında bile normal operasyonlarını sorunsuz bir şekilde sürdürmüştür.8 Beş yıllık araştırma ve demonstrasyon aşamasını tamamlayan tesis, ada şebekesine elektrik sağlamaya başlamıştır.19 Ancak, teknik açıdan kusursuz işleyen bu yapı, ekonomik piyasa gerçekleri ve kurumsal hedefler karşısında tutunamamış, Temmuz 2016'da kapılarını tamamen kapatarak söküm işlemlerine geçilmiştir.8 Bu kapanışın ardındaki nedenler, teknolojik eksikliklerden ziyade, makroekonomik yanılgılar, yatırımın geri dönüş süresindeki (payback period) imkansızlıklar ve stratejik yönelimlerdeki radikal değişimlerdir.  
Projenin çöküşündeki birinci ve en belirleyici faktör, ilk planlama aşamasındaki hatalı enerji talebi projeksiyonlarıdır (unmet power demand predictions). Projenin araştırma ve fizibilite çalışmalarının yapıldığı 1980'lerin sonu, Japonya'da ekonomik büyümenin zirvede olduğu ve enerji talebinin katlanarak artacağının varsayıldığı bir dönemdi. Ancak 1990'ların başında Japonya ekonomisinin çökmesi (Kayıp Onyıl) ve demografik daralma ile birlikte, Okinawa adasındaki elektrik tüketimi beklenen ivmeyi asla yakalayamamıştır.8 2009 yılının en sıcak yaz günlerinden birinde bile, Okinawa Yanbaru tesisinin 30 MW'lık maksimum çıkışı, Okinawa adasındaki toplam maksimum güç talebinin sadece yüzde 2,1'ine denk gelmekteydi.6  
İkinci temel faktör, deniz suyu kullanımının yarattığı astronomik sermaye maliyetidir (CAPEX). Tesisin inşasına harcanan yaklaşık 32 Milyar Japon Yeni, 30 MW kapasiteli bir enerji depolama ünitesi için inanılmaz derecede yüksek bir birim maliyet (yaklaşık 10.000 USD/kW) anlamına geliyordu.16 Geleneksel tatlı su PDHES sistemlerinde veya modern lityum-iyon bataryalarda bu birim maliyet çok daha düşüktür. Deniz suyuna dayanıklı FRP boruların, devasa kauçuk kaplamaların, azot katkılı çeliklerin ve katodik koruma sistemlerinin işletme (OPEX) ve bakım maliyetleri de eklendiğinde, sistemin elektrik piyasasındaki saatlik fiyat arbitrajından kar elde etmesi matematiksel olarak imkansız hale gelmiştir. Tesisin yüksek operasyonel maliyeti ve Okinawa'da artmayan enerji talebi, operatör J-Power'ın (EPDC), adanın ana şebeke yöneticisi olan Okinawa Electric Power şirketi ile uzun vadeli ve karlı bir Elektrik Satın Alma Anlaşması (Power Purchase Agreement \- PPA) imzalamasını engellemiştir.18 Karlılık sağlayamayan bir işletme (not profitable as a business) konumuna düşen tesisin fişinin çekilmesi kaçınılmaz olmuştur.8  
Projenin sonlandırılmasıyla ilgili bir diğer kurumsal dinamik ise, sahibi J-Power'ın (EPDC) 2010'lu yıllarla birlikte yöneldiği stratejik dönüşümdür. Şirket, karbonsuzlaşma hedefleri (J-POWER BLUE MISSION 2050\) doğrultusunda verimsiz santrallerini (örneğin Takasago termik santrali gibi) devreden çıkarmaya, yatırımlarını deniz üstü rüzgar (offshore wind) enerjisi projelerine (Oga, Katagami, Akita projeleri) ve nükleer kapasitenin (Ohma Nükleer Santrali) yeniden düzenlenmesine kaydırmaya karar vermiştir.26 Karlı olmayan Okinawa Yanbaru tesisi, bu devasa portföy optimizasyonunun kurbanlarından biri olmuştur.  
Kapanışın ardından başlayan söküm süreci, tesisin adına kara bir leke süren trajik bir kazaya sahne olmuştur. 2019 yılında, yeraltındaki devasa türbin ve jeneratör odalarının sökülmesi sırasında, yukarıya doğru vinçle çekilen yaklaşık 350 kilogram ağırlığındaki bir kablo koparak 100 metreden fazla derinliğe düşmüş ve o sırada yeraltında çalışmakta olan iki işçinin feci şekilde ölümüne neden olmuştur.18 Bu kaza, projenin medya ve halk nezdinde "hayalet santral" (phantom power plant) olarak anılmasına yol açmıştır.18  
Buna rağmen, Okinawa Yanbaru'nun mirası tamamen silinmemiştir. Orada geliştirilen ve kanıtlanan "Değişken Hızlı Pompaj Depolama" (Variable-Speed Pumped Storage) sistemi, pompalama gücünün serbestçe ayarlanabilmesine olanak tanıyarak güneş ve rüzgar enerjisinin şebekeye entegrasyonunda küresel bir standart haline gelmiştir.18 Aynı zamanda FRP kaplama ve özel paslanmaz çelik teknolojileri, modern gemi inşaatında, tuzlu su soğutma sistemlerinde ve deniz yapıları inşasında güvenilirliği artıran kritik bir referans kaynağı olmaya devam etmektedir.8

## **Deniz Suyu Kullanımındaki Agresif Doğa Dinamikleri: Korozyon ve Biyo-Kirlenme Derinlemesine Analizi**

Okinawa Yanbaru projesi ve sonrasındaki teorik modellemeler göstermiştir ki; bir okyanus veya denizi alt rezervuar olarak kullanmak, geleneksel hidroelektrik mühendisliğinden ziyade, denizcilik ve malzeme bilimlerinin en karmaşık disiplinlerine girmeyi gerektirir. Sistemlerin fizibilitesini etkileyen en temel engeller, suyun kimyasal agresifliği (korozyon) ve okyanusun biyolojik üretkenliğidir (biofouling).  
Korozyon, deniz suyunun sahip olduğu yüksek klorür iyonu ($Cl^{-}$) konsantrasyonundan kaynaklanır. Klorür iyonları, paslanmaz çelik gibi metallerin yüzeyinde doğal olarak oluşan ve metali koruyan pasif oksit tabakasını yerel olarak delme eğilimindedir.24 Bu delinme, mikroskobik düzeyde başlar ancak otokatalitik bir reaksiyonla hızla derinleşerek "çukurcuk korozyonuna" (pitting corrosion) dönüşür. Sistemdeki flanş bağlantıları, cıvata altları veya contalar gibi suyun durağan kaldığı dar boşluklarda ise oksijen konsantrasyonu düşer ve klorür yoğunlaşarak çok daha hızlı ilerleyen "aralık korozyonuna" (crevice corrosion) yol açar.24 Pompaj depolamalı santrallerde su, borulardan ve türbin kanatçıklarından saniyede metrelerce hızla geçer. Korozyon hızının suyun akış hızıyla, türbülansıyla ve kavitasyon etkisiyle eksponansiyel olarak arttığı iyi bilinen bir metalurjik gerçektir.14 Bu nedenle yüksek titanyum alaşımları, süper dubleks paslanmaz çelikler (UNS S31254 gibi) kullanmak zorunludur ki bu malzemeler standart çeliğe göre muazzam fiyat farklarına sahiptir.33  
Biyo-kirlenme (Biofouling) ise en az korozyon kadar sinsi bir problemdir. Deniz suyu pompalandığında sadece tuzu değil, içinde yaşayan milyonlarca mikroorganizmayı, makroorganizmaların larvalarını, bakterileri ve yosunları da sisteme çeker.21 Sistem içine alınan deniz suyu borularda, filtrelerde ve türbin yüzeylerinde kaldığı süre boyunca bu organizmalar yüzeye tutunarak bir biyofilm oluşturur. Bu biyofilm tabakası üzerine kaya koruğu (barnacles), istiridye, yeşil midye gibi sert kabuklu canlılar yerleşerek hızla kolonileşir.22  
Biyo-kirlenmenin iki büyük yıkıcı etkisi vardır. Birincisi hidrolik verim kaybıdır; boru çeperlerinde biriken kalın biyolojik tabaka, yüzey pürüzlülüğünü (surface roughness) inanılmaz boyutlarda artırır. Bu durum, su akışını kısıtlar, sürtünme kayıplarını maksimize eder ve pompaların aynı miktarda suyu basmak için çok daha fazla enerji harcamasına neden olur.13 İkincisi ise Biyolojik Olarak İndüklenmiş Korozyondur (Microbiologically Influenced Corrosion \- MIC). Singapur açıklarında yapılan çok detaylı 30 aylık deniz suyu testleri şaşırtıcı bir gerçeği ortaya koymuştur: Çelik üzerindeki korozyon, istiridyeler tarafından şiddetle hızlandırılmakta, istiridyeler 12 ay içinde 2 milimetre kalınlığındaki paslanmaz çelik plakaları (UNS S31603) delerek santimetrelerce uzunlukta korozyon yolları açmaktadır.33 Daha da ilginç olanı, canlı kaya koruklarının altından ziyade, *ölü* kaya koruklarının kabukları altında korozyonun çok daha şiddetli olmasıdır. Ölü organizmaların altında oksijensiz (anaerobik) bir ortam oluşur ve Sülfat İndirgeyen Bakteriler (SRB) burada üreyerek çeliği asidik bir salgıyla parçalar.33 Bu tahribatı önlemek için toksik olmayan biyosit boyalar, SLIC (Superhydrophobic Lubricant Infused Composite) gibi teflondan on kat daha kaygan nano-kaplamalar kullanılsa da, türbin içindeki aşırı hız ve kavitasyon bu boyaların ömrünü çok kısaltmakta ve bakım (OPEX) maliyetlerini sürdürülemez kılmaktadır.13

## **Küresel Arenada Deniz Suyu Pompaj Depolama Projeleri: Fırsatlar ve Çöküşler**

Okinawa projesinin teknik kapasitesini kanıtlaması, iklim hedefleri doğrultusunda yenilenebilir enerjiye devasa yatırımlar yapan ancak tatlı su kaynakları kısıtlı olan diğer ülkelerin de bu teknolojiye ilgi duymasını sağlamıştır. Özellikle falezli kıyı şeridine sahip olan ve yüksek güneş/rüzgar potansiyeli barındıran bölgeler, deniz suyu PDHES projeleri için mükemmel bir teorik topografya sunmaktadır. Ancak bu projelerin birçoğu Okinawa ile benzer bir kaderi paylaşmıştır.

### **Şili: Espejo de Tarapacá (Çölün Aynası) Projesinin Yükselişi ve Düşüşü**

Dünya üzerindeki belki de en ideal coğrafi ve meteorolojik lokasyonlardan biri Şili'nin kuzeyindeki Atacama Çölü'nün Pasifik okyanusu ile birleştiği devasa sahil uçurumlarıdır. Şili, güneş enerjisi potansiyelinde dünya liderlerinden biri olmasına rağmen, şebekenin gündüzleri aşırı yüklenmesi ve fiyatların sıfıra inmesi (duck curve problemi) gibi büyük sorunlar yaşıyordu.37  
Şilili yenilenebilir enerji şirketi Valhalla ve Fundación Chile, bu sorunu çözmek için "Espejo de Tarapacá" (Tarapacá'nın Aynası) isimli, eşi benzeri görülmemiş bir entegre proje geliştirmiştir.40 Projenin vizyonu basitti: Gündüzleri, 600 MW kapasiteli devasa "Cielos de Tarapacá" güneş enerjisi santralinden elde edilecek bedava enerji kullanılarak, Pasifik Okyanusu'ndan 600 metre (2.000 fit) yükseklikteki doğal dağ çöküntülerine (concaves) deniz suyu pompalanacaktı.5 Güneşin battığı ve enerjinin en değerli olduğu gece saatlerinde ise bu su, 300 MW kapasiteli hidrolik pompa-türbinlerden serbest düşüşle geçerek okyanusa geri dönecek ve 7 gün 24 saat kesintisiz (baseload) yeşil enerji sağlayacaktı.37  
Projenin teknik detayları Okinawa'yı bile gölgede bırakacak büyüklükteydi. 375 hektarlık üst rezervuar alanı, 500 futbol sahası büyüklüğünde olup 22.000 olimpik yüzme havuzu hacmine eşdeğer bir depolama sağlayacaktı (11 günlük kesintisiz enerji kapasitesi).41 Suyu okyanustan sisteme taşımak için deniz seviyesinin 45 metre altında, 5.5 kilometre uzunluğunda dev bir tünel ağı inşa edilecek; bu tüneller işlenmemiş deniz suyunun korozyonundan korunmak için özel paslanmaz çelik veya ekstra dayanıklı beton astar (lining) ile kaplanacaktı.41  
Projenin çevresel tahribatı sıfıra yakın olduğu (çorak çöl arazisinde inşa edileceği ve nehirlerin akışını bozmayacağı) için Şili Çevre Değerlendirme Servisi'nden (SEA) onayları hızla alınmıştır.39 Hatta Yeşil İklim Fonu (Green Climate Fund \- GCF), projenin ihtiyaç duyduğu 1.5 Milyar ABD Doları tutarındaki ana yatırımı ve borçlanmayı tetiklemek amacıyla, 60 milyon dolarlık bir erken aşama öz sermaye yatırımı onaylamıştır.37  
Ancak teknolojik görkem, finansal realiteye çarpmıştır. Şili enerji piyasasının değişken spot fiyatlandırmaları (volatile pricing), böylesine devasa bir altyapı yatırımının uzun vadeli geri dönüşünü riskli kılmıştır.38 Valhalla şirketi, projenin finansal kapanışını (financial close) gerçekleştirebilmek için gerekli olan uzun vadeli bir Enerji Satın Alma Anlaşması (PPA) imzalamayı başaramamıştır.41 Ana yatırımcıların eksikliği, yükselen inşaat tahminleri ve piyasa koşulları projenin boğulmasına neden olmuş, Global Energy Monitor ve GCF raporlarına göre Espejo de Tarapacá projesi Ekim 2024 itibarıyla resmi olarak "İptal Edildi" (Cancelled) statüsüne geçerek tarihe gömülmüştür.38

### **Avustralya: Cultana SPHES Projesi ve Toplumsal Onay Engeli**

Güney Avustralya'nın enerji sistemi, yüksek oranda rüzgar ve güneş enerjisi (2021 itibariyle %62) içermesine rağmen depolama kapasitesi eksikliğinden muzdaripti. Eylül 2016'da yaşanan feci ve eyalet çapındaki elektrik kesintisi (catastrophic blackout), acil bir şebeke esnekliği arayışını tetiklemiştir.49 Bu ortamda, enerji şirketi EnergyAustralia, mühendislik danışmanlık firması Arup ve Melbourne Enerji Enstitüsü ile birleşerek Spencer Körfezi'nin kuzeybatısında yer alan Savunma Bakanlığı arazisinde "Cultana Seawater Pumped Hydro" projesi için fizibilite çalışmalarına başlamıştır.20  
Proje, 3.5 gigalitre deniz suyunu kullanarak 225 MW kapasite ve 8 saat (1770 MWh) depolama süresi sunmayı hedefliyordu (yaklaşık 126.000 ev tipi bataryaya eşdeğer).49 Projenin fizibilitesi için Avustralya Yenilenebilir Enerji Ajansı'ndan (ARENA) iki ayrı hibe fonu alınmıştır.20  
Ancak ilerleyen süreçte proje aşılamaz duvarlara çarpmıştır. İlk fizibilite raporlarında 477 milyon AUD olarak tahmin edilen yatırım bedeli 57, deniz suyunun yeraltı sularına sızmasını engellemek (groundwater contamination by seawater), gelişmiş korozyon önlemleri almak ve altyapıyı inşa etmek için yapılan detaylı mühendislik hesaplamaları sonrasında devasa seviyelere ulaşmıştır.50 Sadece maliyet değil, aynı zamanda projenin savunma arazisinde ve yerel çevre üzerinde yaratacağı etkiler konusunda toplumsal rızanın (community consultation) alınamaması, çevresel uyumsuzluk (not environmentally appropriate) ve ekonomik kârsızlık (not financially viable) projenin sonunu hazırlamıştır.50 EnergyAustralia, deniz suyu kullanmanın maliyetinin çok yüksek olduğunu belirterek rotasını Yeni Güney Galler'deki eski bir kömür madeni gölünü kullanan tatlı su bazlı Lake Lyell PDHES projesine çevirmiş ve Cultana projesi fiilen iptal edilmiştir.50

### **Yunanistan, Hawaii ve İrlanda: Teoriden Pratiğe Geçemeyen Vizyonlar**

Diğer küresel coğrafyalarda da deniz suyu PDHES potansiyeli gündeme gelmiş, ancak ilerleme kaydedilememiştir.

* **Amerika Birleşik Devletleri (Hawaii):** Adalar eyaleti Hawaii, sınırlı alan ve yüksek enerji ithalatı nedeniyle 1980'lerden beri SPHS sistemlerini araştırmaktadır.61 Lanai adasında 300 MW kapasiteli, Maui ve Kauai adalarında ise farklı kapasitelerde projeler (Pu'u 'Ōpae Energy Project) düşünülmüştür.5 Ancak yerli Hawaii halkının geleneksel ve kutsal su kaynaklarının zarar göreceği endişesi, çevresel kısıtlamalar ve devasa ilk yatırım maliyetleri projelerin ilerlemesini engellemiştir. Planlanan projeler 2024 yılına kadar yatırımcılar tarafından resmi olarak geri çekilmiştir.61  
* **Yunanistan (Girit):** Anakara bağlantısı olmayan Girit adasında fosil yakıtlardan yenilenebilir enerjiye geçiş, araştırmacılar (örneğin Dimitris Katsaprakakis) tarafından çok detaylı SPHS modellemelerine konu olmuştur.63 Yapılan akademik simülasyonlar, adadaki rüzgar türbinleri ile Potamon barajını veya denizi entegre eden SPHS sistemlerinin, Girit'in enerji ihtiyacının %90'ını yenilenebilir kaynaklardan ekonomik olarak sağlayabileceğini kanıtlamaktadır.64 Ancak Yunan devleti şu an için SPHS yerine, ana karada (Amfilochia \- 680 MW) geleneksel tatlı su göllerini kullanan devasa PDHES yatırımlarına ve batarya sistemlerine (Flampouro ve Trani Rachi) odaklanmıştır.68  
* **İrlanda:** Mutual Energy tarafından Kuzey İrlanda'da geliştirilen "Higher Ground" projesi, rüzgar enerjisindeki kısıntıları (curtailment) önlemek amacıyla deniz suyu kullanabilecek bir PDHES fizibilite aşamasındadır. Ancak proje henüz konsept aşamasındadır ve inşaatına geçilmemiştir.2

Küresel ölçekte dikkat çeken bu projelerin durumu Tablo 2'de özetlenmiştir.

| Proje Adı | Lokasyon | Planlanan Kapasite | Güncel Durumu ve Nedeni | Kaynak |
| :---- | :---- | :---- | :---- | :---- |
| **Espejo de Tarapacá** | Atacama, Şili | 300 MW (11 Gün Depolama) | **İptal Edildi** (Ekim 2024\) \- PPA eksikliği ve yüksek CAPEX. | 38 |
| **Cultana SPHES** | Spencer Körfezi, Avustralya | 225 MW (1770 MWh) | **İptal Edildi** \- Maliyet aşımı, yerel halk onayı eksikliği. | 50 |
| **Lanai Project** | Lanai Adası, Hawaii, ABD | 300 MW | **İptal Edildi / Çekildi** \- Çevresel ve kültürel muhalefet. | 5 |
| **Girit Projeleri** | Girit, Yunanistan | Değişken (Akademik Öneriler) | **Konsept Aşamasında** \- Devlet yatırımları tatlı su sistemlerinde. | 64 |

## **Paradigma Değişimi: Okinawa'nın Hatalarından Doğan "Desalinasyon Entegreli" Model (Kanarya Adaları)**

Okinawa Yanbaru'nun teknik olarak işlevsel ancak ekonomik olarak sürdürülemez olması, Tarapacá ve Cultana'nın ise maliyet duvarına çarpması, saf (işlenmemiş) deniz suyunun hidrolik türbinlerde kullanılmasının ticari bir çıkmaz sokak olduğunu endüstriye kesin olarak kanıtlamıştır.8 Ancak deniz kıyısındaki yüksek rüzgar ve güneş potansiyelini depolama ihtiyacı ortadan kalkmamıştır. Bu noktada İspanya, Kanarya Adaları'nda hayata geçirdiği projelerle deniz suyu PDHES konseptinde devrim niteliğinde "hibrit" bir paradigma değişikliği yaratmıştır.71  
İspanyol şebeke operatörü Red Eléctrica de España (REE) tarafından geliştirilen ve halihazırda Gran Canaria adasında inşaatı devam eden **Salto de Chira** projesi, deniz suyu kullanma konseptine tamamen yeni bir boyut getirmiştir.71 Proje, doğrudan okyanus suyunu sisteme pompalamak yerine, alt sisteme bir Ters Osmoz (Reverse Osmosis) **Deniz Suyu Tuzdan Arındırma (Desalinasyon) Tesisi** entegre etmiştir.71  
Sistem şu şekilde işlemektedir: Adada rüzgar ve güneşten elde edilen ancak şebekenin anlık olarak tüketemediği "ihtiyaç fazlası" yenilenebilir enerji, ilk olarak kıyıdaki tuzdan arındırma tesisini çalıştırır. Üretilen arıtılmış tatlı su (desalinated water), dağlık alandaki Chira barajına (üst rezervuar) pompalanır ve depolanır. Elektrik talebinin arttığı veya rüzgarın durduğu anlarda, bu tatlı su Soria barajına (alt rezervuar) doğru yerçekimiyle bırakılır ve kurulan üç adet 66.6 MW'lık Francis türbini (toplam 200 MW türbin, 220 MW pompa kapasitesi, 3.6 GWh depolama) aracılığıyla şebekeye elektrik sağlar.71  
Bu entegrasyonun sağladığı mühendislik ve sosyo-ekonomik avantajlar şunlardır:

1. **Korozyon ve Bio-Fouling'in İptali:** Sistemin içinden geçen su saf deniz suyu değil, arıtılmış tatlı su olduğu için, borularda, vanalarda ve türbinlerde astronomik fiyatlara sahip fiber takviyeli plastiklere, EPDM kauçuk sızdırmazlık membranlarına veya süper paslanmaz alaşımlara gerek kalmaz.71 Korozyon ve biyolojik kirlenme riski, sıradan tatlı su barajları seviyesine indirilmiştir.  
2. **Su Kıtlığına Çözüm ve Sosyal Onay:** Kanarya Adaları gibi ciddi tatlı su kıtlığı çeken bölgelerde, bu tesis sadece bir elektrik depolama aracı değil, aynı zamanda devasa bir su fabrikasıdır. Tesiste günde 7.800 metreküp (yılda 2.7 milyon metreküp) tatlı su üretilmekte ve bu suyun önemli bir kısmı tarım, ormancılık, yangınla mücadele ve içme suyu şebekesi için kullanılmaktadır.71 Bu sayede yerel halkın desteği sağlanmış ve "toplumsal rıza" engeli kolayca aşılmıştır.  
3. **Finansal Fizibilite:** Su satışından elde edilecek ek gelir (revenue stream) ve düşük inşaat maliyetleri sayesinde proje karlı hale gelmiş, Avrupa Yatırım Bankası (EIB) projeye 300 milyon Euro kredi sağlayarak yeşil ışık yakmıştır.78

Bu devrimsel konsept, daha küçük ölçekte El Hierro adasında yer alan Gorona del Viento (11.3 MW Hidro \- 11.5 MW Rüzgar) projesiyle önceden kanıtlanmış ve adanın günlerce %100 yenilenebilir enerjiyle ve tam su güvenliğiyle ayakta kalmasını sağlamıştır.79 İspanya Hükümeti (MITECO), bu başarının ardından Tenerife (Güímar) adasında benzer şekilde 1 milyar Euro yatırım değerinde ve 3.2 GWh kapasiteli devasa bir hibrit "Desalinasyon \- Pompaj Depolama" projesini daha değerlendirmeye almıştır.71 Bu durum göstermektedir ki, saf deniz suyu kullanan sistemlerin yerini, su ve enerjinin simbiyotik olarak iç içe geçtiği hibrit desalinasyon sistemleri alacaktır.1

## **Çin'in Küresel Egemenliği ve Türkiye'deki PDHES Çıkmazı**

Deniz suyu PDHES projelerinin teorik zorlukları dünyayı hibrid çözümlere veya alternatiflere iterken, küresel PDHES arenasında geleneksel tatlı su sistemlerine yatırımlar devam etmektedir. Özellikle Çin, küresel alanda tartışmasız bir hegemonya kurmuştur.5 Toplam 1646 GW kurulu güce sahip olan Çin, halihazırda 32.0 GW PDHES kapasitesini işletmekte ve 2030 yılına kadar bu kapasiteyi 120 GW'a, 2035 yılına kadar ise 420 GW'lık devasa bir planlamayla sistemine entegre etmeyi hedeflemektedir.5 Çin, 3.600 MW kapasiteli dünyanın en büyük pompaj santrali olan Fengning PSH, 2.100 MW'lık Changlongshan ve 1.400 MW'lık Dunhua gibi karasal projeleri büyük bir hızla inşa etmektedir.88 Çin'in Daishan ve Zhoushan (Shengsi) gibi ada bölgelerinde deniz suyu kullanımına, gelgit (tidal) enerjisine ve deniz altı veri merkezlerinin deniz suyuyla soğutulmasına yönelik deneysel projeleri (LHD projeleri) bulunsa da, ulusal depolama doktrini ağırlıklı olarak maliyet-etkin olan tatlı su PDHES projeleri üzerinden ilerlemektedir.87  
Üç tarafı denizlerle çevrili, dağlık sahil topografyasına sahip ve yenilenebilir enerji entegrasyonu hızla artan Türkiye için ise PDHES projeleri uzun yıllardır akademik ve bürokratik çevrelerde tartışılmaktadır. Türkiye'de geçmiş yıllarda Eskişehir Gökçekaya Barajı veya Altınkaya gibi alanlar için hibrit pompaj depolama ön fizibilite çalışmaları yapılmıştır.95 2014 yılında Japonya (JICA) ile Gökçekaya'da 1400 MW'lık ve 1 milyar dolar bütçeli bir PDHES kurulması için görüşmeler gerçekleştirilmiş olsa da, Türkiye'de henüz faaliyete geçmiş bir PDHES (tatlı veya tuzlu su) projesi bulunmamaktadır.98 Akademik çalışmalarda (Kocaman, Tiğrek, Gürsakal vd.), Türkiye'nin enerji piyasası şartları (YEKDEM, piyasa takas fiyatları), ilk yatırım maliyetleri ve Seviyelendirilmiş Depolama Maliyeti (LCOS) hesaplamaları yapılmış; PDHES tesislerinin, güneş (PV) ve rüzgar sistemleriyle hibritleştirilmediği ve devlet tarafından yüksek alım garantileri (feed-in tariff) verilmediği sürece uzun geri dönüş sürelerine (payback period \- piyasa fiyatlarıyla yaklaşık 18 ila 28 yıl) sahip olduğu saptanmıştır.9 Özellikle saf deniz suyunu kullanacak olası bir Türk SPHS projesi, Okinawa'nın gösterdiği muazzam donanım maliyetleri (korozyon önleyici çelikler, FRP borular) eklendiğinde, mevcut ekonomik piyasa realitesinde finansal olarak sürdürülemez bir yük oluşturacaktır.9

## **Sonuç**

Dünyanın ilk deniz suyu Pompaj Depolamalı Hidroelektrik Santrali olan Okinawa Yanbaru'nun inşa edilmesi ve ardından sökülmesi, teknolojinin ya da mühendislik dehasının bir yenilgisi değil, acımasız ekonomik piyasa gerçekliklerinin ve termodinamik/kimyasal bariyerlerin bir sonucudur. J-Power mühendisleri; fiber takviyeli plastik (FRP) borular, azota doyurulmuş özel östenitik paslanmaz çelikler, dinamik katodik koruma ağları ve çift sensörlü EPDM kauçuk yalıtım mekanizmaları ile deniz suyunun yıkıcı korozyonuna ve biyo-kirlenmesine karşı muazzam bir teknik zafer kazanmış, ekosistemi tayfun koşullarında bile korumayı başarmıştır. Ancak, doğayı bu denli yoğun bir şekilde alt etmeye çalışmanın bir bedeli vardır. Uygulanan mühendislik modifikasyonları, yatırımın sermaye maliyetini (CAPEX) sıradan bir barajın katbekat ötesine taşıyarak projeyi ticari bir çıkmaza sürüklemiştir. Beklenen şebeke talebinin oluşmaması ve güç satın alma anlaşmalarının yapılamaması, tesisin nihai kaderini belirlemiştir.  
Okinawa sonrasında ortaya çıkan devasa deniz suyu PDHES projeleri (Şili \- Espejo de Tarapacá ve Avustralya \- Cultana) tam olarak Okinawa ile aynı ekonomik hastalıktan muzdarip olmuştur. Milyarlarca dolara ulaşan fizibilite maliyetleri, yeraltı suyu kontaminasyon riskleri, değişken spot enerji piyasalarının yarattığı yatırım güvensizliği ve yerel halkların sosyokültürel tepkileri, bu devasa vizyonların fiilen rafa kaldırılmasına neden olmuştur. Ham okyanus suyunu metalik türbinlerden geçirmek, korozyonla ve istiridyelerle (biofouling) sürekli mücadele etmek, ekonomik olarak savunulabilir bir enerji depolama metodu değildir.  
Bu tarihsel süreçten çıkarılan en derinlemesine stratejik içgörü, İspanya'nın Kanarya Adaları'nda hayata geçirdiği "Salto de Chira" konseptidir. Gelişen teknoloji, rüzgar ve güneşin atıl enerjisini doğrudan ham deniz suyunu dağlara pompalamak için kullanmak yerine, bu enerjiyi önce deniz suyunu arıtmak (Desalinasyon) ve ardından üretilen tatlı suyu geleneksel PDHES türbinlerinden geçirmek üzere konumlandırmıştır. Bu evrimsel hibrit yöntem; hem korozyon ve biyo-kirlenme sorununu kökten çözerek donanım maliyetlerini standart seviyelere çekmekte, hem de iklim değişikliği nedeniyle tatlı su kıtlığı çeken bölgelere su arzı sağlayarak tesisin çok yönlü sosyolojik, ekolojik ve ekonomik onay almasını garanti etmektedir.  
Özetle, saf ve işlenmemiş deniz suyu kullanan açık çevrim PDHES sistemleri (Okinawa Modeli) küresel enerji matrisinde geniş çaplı yayılma şansını tamamen yitirmiştir. Ancak bu konseptin uyandırdığı entelektüel mühendislik mirası, entegre desalinasyon-hidroelektrik projeleri olarak kıyı bölgelerinin ve adaların enerji-su güvenliği denklemini çözmede hayati bir rol oynamaya devam edecektir. Geleceğin yenilenebilir altyapısı, yalnızca gücü depolayan değil, aynı zamanda yaşam kaynağı üreten simbiyotik melez tesislere emanet olacaktır.

#### **Alıntılanan çalışmalar**

1. Pumped storage plants – hydropower plant plus energy storage | Voith, erişim tarihi Temmuz 7, 2026, [https://www.voith.com/corp-en/industry-solutions/hydropower/pumped-storage-plants.html](https://www.voith.com/corp-en/industry-solutions/hydropower/pumped-storage-plants.html)  
2. Project Background \- Higher Ground NI, erişim tarihi Temmuz 7, 2026, [https://highergroundni.com/project/](https://highergroundni.com/project/)  
3. ANE's World-First Large-Scale Seawater Pumped Hydro Storage Project | A Renewables Baseload Solution \- YouTube, erişim tarihi Temmuz 7, 2026, [https://www.youtube.com/watch?v=VhyI2pOnRVE](https://www.youtube.com/watch?v=VhyI2pOnRVE)  
4. Environmental costs of hydropower plants \- WIT Press, erişim tarihi Temmuz 7, 2026, [https://www.witpress.com/Secure/elibrary/papers/EEIA06/EEIA06016FU1.pdf](https://www.witpress.com/Secure/elibrary/papers/EEIA06/EEIA06016FU1.pdf)  
5. Pumped-storage hydroelectricity \- Wikipedia, erişim tarihi Temmuz 7, 2026, [https://en.wikipedia.org/wiki/Pumped-storage\_hydroelectricity](https://en.wikipedia.org/wiki/Pumped-storage_hydroelectricity)  
6. Seawater pumped hydro storage, erişim tarihi Temmuz 7, 2026, [https://www.esru.strath.ac.uk/EandE/Web\_sites/17-18/cumbrae/Seawater%20pumped%20hydro.html](https://www.esru.strath.ac.uk/EandE/Web_sites/17-18/cumbrae/Seawater%20pumped%20hydro.html)  
7. Ayla TUTUŞ Đçkale Şirketler Grubu Enerji Koordinatörü \- EMO, erişim tarihi Temmuz 7, 2026, [https://www.emo.org.tr/ekler/11b0d4ca425280b\_ek.pdf?tipi=2\&turu=X\&sube=7](https://www.emo.org.tr/ekler/11b0d4ca425280b_ek.pdf?tipi=2&turu=X&sube=7)  
8. Seawater Pumped Storage: A Technical Overview of Opportunities and Limitations \- EPCM, erişim tarihi Temmuz 7, 2026, [https://epcmholdings.com/seawater-pumped-storage-a-technical-overview-of-opportunities-and-limitations/](https://epcmholdings.com/seawater-pumped-storage-a-technical-overview-of-opportunities-and-limitations/)  
9. Techno-Economic Optimization of a Hybrid Renewable Energy System with Seawater-Based Pumped Hydro, Hydrogen, and Battery Storage for a Coastal Hotel \- MDPI, erişim tarihi Temmuz 7, 2026, [https://www.mdpi.com/2227-9717/13/10/3339](https://www.mdpi.com/2227-9717/13/10/3339)  
10. The upper pond for Okinawa: the world's first pumped storage plant using seawater, erişim tarihi Temmuz 7, 2026, [https://www.hydropower-dams.com/articles/the-upper-pond-for-okinawa-the-worlds-first-pumped-storage-plant-using-seawater/](https://www.hydropower-dams.com/articles/the-upper-pond-for-okinawa-the-worlds-first-pumped-storage-plant-using-seawater/)  
11. Development of Pump Turbine for Seawater Pumped- Storage Power Plant, erişim tarihi Temmuz 7, 2026, [http://coopeoliennes.free.fr/fichiers/Okinawa.pdf](http://coopeoliennes.free.fr/fichiers/Okinawa.pdf)  
12. Hydropower Technologies, erişim tarihi Temmuz 7, 2026, [https://hydropower-europe.eu/uploads/news/media/The%20state%20of%20the%20art%20of%20hydropower%20industry-1600164483.pdf](https://hydropower-europe.eu/uploads/news/media/The%20state%20of%20the%20art%20of%20hydropower%20industry-1600164483.pdf)  
13. (PDF) SEA WATER PUMPED STORAGE POWER PLANT-CONCEPT PAPER, erişim tarihi Temmuz 7, 2026, [https://www.researchgate.net/publication/317200745\_SEA\_WATER\_PUMPED\_STORAGE\_POWER\_PLANT-CONCEPT\_PAPER](https://www.researchgate.net/publication/317200745_SEA_WATER_PUMPED_STORAGE_POWER_PLANT-CONCEPT_PAPER)  
14. Development of Pump-Turbine for Seawater Pumped Storage Power Plant \- ASCE Library, erişim tarihi Temmuz 7, 2026, [https://ascelibrary.org/doi/10.1061/40440%281999%2967](https://ascelibrary.org/doi/10.1061/40440%281999%2967)  
15. 4-3. Sea Water Pumped-Storage Power Plant \- JICA Report PDF, erişim tarihi Temmuz 7, 2026, [https://openjicareport.jica.go.jp/pdf/11466158\_02.pdf](https://openjicareport.jica.go.jp/pdf/11466158_02.pdf)  
16. Okinawa Yanbaru Seawater Pumped Storage Power Station \- Wikipedia, erişim tarihi Temmuz 7, 2026, [https://en.wikipedia.org/wiki/Okinawa\_Yanbaru\_Seawater\_Pumped\_Storage\_Power\_Station](https://en.wikipedia.org/wiki/Okinawa_Yanbaru_Seawater_Pumped_Storage_Power_Station)  
17. An Evaluation of Seawater Pumped Hydro Storage for Regulating the Export of Wind Energy to the National Grid \- Arrow@TU Dublin, erişim tarihi Temmuz 7, 2026, [https://arrow.tudublin.ie/cgi/viewcontent.cgi?article=1012\&context=engscheledis](https://arrow.tudublin.ie/cgi/viewcontent.cgi?article=1012&context=engscheledis)  
18. Okinawa Yanbaru Seawater Pumped Storage Power Plant｜綜合電装 \- note, erişim tarihi Temmuz 7, 2026, [https://note.com/sdenso/n/n5ffa0056081b?hl=en](https://note.com/sdenso/n/n5ffa0056081b?hl=en)  
19. Low-head pumped hydro storage \- CNR-IRIS, erişim tarihi Temmuz 7, 2026, [https://iris.cnr.it/bitstream/20.500.14243/456719/1/prod\_483521-doc\_199387.pdf](https://iris.cnr.it/bitstream/20.500.14243/456719/1/prod_483521-doc_199387.pdf)  
20. Cultana Pumped Hydro Project \- Energy Australia, erişim tarihi Temmuz 7, 2026, [https://www.energyaustralia.com.au/sites/default/files/2017-08/Cultana%20Pumped%20Hydro%20Project%20Community%20Briefing%20-%20August%202017.pdf](https://www.energyaustralia.com.au/sites/default/files/2017-08/Cultana%20Pumped%20Hydro%20Project%20Community%20Briefing%20-%20August%202017.pdf)  
21. Modelling a low-head seawater-pumped hydro storage system's impeller for energy production within a small island developing state | Water Supply, erişim tarihi Temmuz 7, 2026, [https://iwaponline.com/ws/article/24/11/3862/105390/Modelling-a-low-head-seawater-pumped-hydro-storage](https://iwaponline.com/ws/article/24/11/3862/105390/Modelling-a-low-head-seawater-pumped-hydro-storage)  
22. Marine Biofouling and Corrosion | PNNL, erişim tarihi Temmuz 7, 2026, [https://www.pnnl.gov/marine-biofouling-and-corrosion](https://www.pnnl.gov/marine-biofouling-and-corrosion)  
23. A Review of Biofouling of Ships' Internal Seawater Systems \- Frontiers, erişim tarihi Temmuz 7, 2026, [https://www.frontiersin.org/journals/marine-science/articles/10.3389/fmars.2021.761531/pdf](https://www.frontiersin.org/journals/marine-science/articles/10.3389/fmars.2021.761531/pdf)  
24. Delft University of Technology Document Version Final published ..., erişim tarihi Temmuz 7, 2026, [https://research.tudelft.nl/files/114635792/1\_s2.0\_S1364032122002003\_main.pdf](https://research.tudelft.nl/files/114635792/1_s2.0_S1364032122002003_main.pdf)  
25. Environmental impacts \- Energy Systems Research Unit, erişim tarihi Temmuz 7, 2026, [https://www.esru.strath.ac.uk/EandE/Web\_sites/17-18/cumbrae/Environmental%20impacts.html](https://www.esru.strath.ac.uk/EandE/Web_sites/17-18/cumbrae/Environmental%20impacts.html)  
26. Japan Power Provider to Decommission Coal-Fired Power Plants \- PowerGen Advancement, erişim tarihi Temmuz 7, 2026, [https://www.powergenadvancement.com/news/japan-power-provider-to-decommission-coal-fired-power-plants/](https://www.powergenadvancement.com/news/japan-power-provider-to-decommission-coal-fired-power-plants/)  
27. Takasago Thermal Power Station Decommissioning Plan, erişim tarihi Temmuz 7, 2026, [https://www.jpower.co.jp/english/news\_release/pdf/news251031\_1e.pdf](https://www.jpower.co.jp/english/news_release/pdf/news251031_1e.pdf)  
28. Nuclear Power in Japan, erişim tarihi Temmuz 7, 2026, [https://world-nuclear.org/information-library/country-profiles/countries-g-n/japan-nuclear-power](https://world-nuclear.org/information-library/country-profiles/countries-g-n/japan-nuclear-power)  
29. The Corporate Philosophy of the J-POWER Group states \- We will meet people's needs for energy without fail, and play our part in the sustainable development of Japan and the rest of the world., erişim tarihi Temmuz 7, 2026, [https://www.jpower.co.jp/english/ir/library/pdf/2023/jpower\_integrated2023\_e\_all.pdf](https://www.jpower.co.jp/english/ir/library/pdf/2023/jpower_integrated2023_e_all.pdf)  
30. AN EVALUATION OF PUMPED HYDROELECTRIC STORAGE SYSTEMS \- DergiPark, erişim tarihi Temmuz 7, 2026, [https://dergipark.org.tr/tr/download/article-file/2256404](https://dergipark.org.tr/tr/download/article-file/2256404)  
31. Optimal Sizing of Seawater Pumped Storage Plant with Variable-Speed Units Considering Offshore Wind Power Accommodation \- MDPI, erişim tarihi Temmuz 7, 2026, [https://www.mdpi.com/2071-1050/11/7/1939](https://www.mdpi.com/2071-1050/11/7/1939)  
32. Journal of Chinese Society for Corrosion and protection \- 中国腐蚀与防护学报, erişim tarihi Temmuz 7, 2026, [https://www.jcscp.org/EN/10.11902/1005.4537.2018.031](https://www.jcscp.org/EN/10.11902/1005.4537.2018.031)  
33. Research on Anti-corrosion of Water Conveyance Pipelines of Seawater Pumped Storage Power Stations \- ResearchGate, erişim tarihi Temmuz 7, 2026, [https://www.researchgate.net/publication/400253082\_Research\_on\_Anti-corrosion\_of\_Water\_Conveyance\_Pipelines\_of\_Seawater\_Pumped\_Storage\_Power\_Stations](https://www.researchgate.net/publication/400253082_Research_on_Anti-corrosion_of_Water_Conveyance_Pipelines_of_Seawater_Pumped_Storage_Power_Stations)  
34. Case Study \- Refinery \- Cahtodic Protection System Of Seawater Circulating Pipelines, erişim tarihi Temmuz 7, 2026, [https://www.topcorr.com/news/case-study-refinery-cahtodic-protection-78253959.html](https://www.topcorr.com/news/case-study-refinery-cahtodic-protection-78253959.html)  
35. Corrosion and Biofouling of OTEC System Surfaces \- Design Factors \- DTIC, erişim tarihi Temmuz 7, 2026, [https://apps.dtic.mil/sti/tr/pdf/ADA066115.pdf](https://apps.dtic.mil/sti/tr/pdf/ADA066115.pdf)  
36. Sea-Water Pumped Hydro Market Research Report 2034, erişim tarihi Temmuz 7, 2026, [https://marketintelo.com/report/sea-water-pumped-hydro-market](https://marketintelo.com/report/sea-water-pumped-hydro-market)  
37. GCF investment supports green energy transition in Chile, erişim tarihi Temmuz 7, 2026, [https://www.greenclimate.fund/news/gcf-investment-supports-green-energy-transition-chile](https://www.greenclimate.fund/news/gcf-investment-supports-green-energy-transition-chile)  
38. FP115: Espejo de Tarapacá | Green Climate Fund, erişim tarihi Temmuz 7, 2026, [https://www.greenclimate.fund/project/fp115](https://www.greenclimate.fund/project/fp115)  
39. The Mirror of Tarapaca: Chilean power project harnesses both sun and sea, erişim tarihi Temmuz 7, 2026, [https://www.power-technology.com/features/featurethe-mirror-of-tarapaca-chilean-power-project-harnesses-both-sun-and-sea-4872272/](https://www.power-technology.com/features/featurethe-mirror-of-tarapaca-chilean-power-project-harnesses-both-sun-and-sea-4872272/)  
40. The Crazy, Brilliant Plan For A Huge Hydropower Plant In South America's Driest Desert, erişim tarihi Temmuz 7, 2026, [https://www.fastcompany.com/3054773/the-crazy-brilliant-plan-for-a-huge-hydropower-plant-in-south-americas-driest-desert](https://www.fastcompany.com/3054773/the-crazy-brilliant-plan-for-a-huge-hydropower-plant-in-south-americas-driest-desert)  
41. Espejo de Tarapacá Project, Caleta San Marcos, Chile \- Power Technology, erişim tarihi Temmuz 7, 2026, [https://www.power-technology.com/projects/espejo-de-tarapaca-project/](https://www.power-technology.com/projects/espejo-de-tarapaca-project/)  
42. Fundación Chile executed an important alliance with Valhalla Energy | FCh, erişim tarihi Temmuz 7, 2026, [https://fch.cl/noticianoticia-antigua/fundacion-chile-executed-an-important-alliance-with-valhalla-energy/](https://fch.cl/noticianoticia-antigua/fundacion-chile-executed-an-important-alliance-with-valhalla-energy/)  
43. Pumped Storage Hydropower is an Option for Latin America \- Global Issues, erişim tarihi Temmuz 7, 2026, [https://www.globalissues.org/news/2025/07/02/40787](https://www.globalissues.org/news/2025/07/02/40787)  
44. Solar PV \+ Hydro Pumped-Storage Power Project \- ESMAP, erişim tarihi Temmuz 7, 2026, [https://www.esmap.org/sites/esmap.org/files/DocumentLibrary/Valhalla\_ESMAP\_Mexico\_Pumped%20Storage%20VRE%20integration.pdf](https://www.esmap.org/sites/esmap.org/files/DocumentLibrary/Valhalla_ESMAP_Mexico_Pumped%20Storage%20VRE%20integration.pdf)  
45. Chile's proposed 300-MW Espejo de Tarapaca pumped-storage plant gets environmental go-ahead \- Renewable Energy World, erişim tarihi Temmuz 7, 2026, [https://www.renewableenergyworld.com/energy-storage/pumped-storage/chile-s-proposed-300-mw-espejo-de-tarapaca-pumped-storage-plant-gets-environmental-go-ahead/](https://www.renewableenergyworld.com/energy-storage/pumped-storage/chile-s-proposed-300-mw-espejo-de-tarapaca-pumped-storage-plant-gets-environmental-go-ahead/)  
46. Chile hands environmental permit to 600MW solar project \- PV Tech, erişim tarihi Temmuz 7, 2026, [https://www.pv-tech.org/chile-hands-environmental-permit-to-600mw-solar-project/](https://www.pv-tech.org/chile-hands-environmental-permit-to-600mw-solar-project/)  
47. FP115 Espejo de Tarapacá \- Climate Policy Radar, erişim tarihi Temmuz 7, 2026, [https://cdn.climatepolicyradar.org/navigator/CHL/2019/espejo-de-tarapaca\_fc879ae36defbf9ab225a0181bebc090.pdf](https://cdn.climatepolicyradar.org/navigator/CHL/2019/espejo-de-tarapaca_fc879ae36defbf9ab225a0181bebc090.pdf)  
48. Espejo De Tarapacá hydroelectric plant \- Global Energy Monitor, erişim tarihi Temmuz 7, 2026, [https://www.gem.wiki/Espejo\_De\_Tarapac%C3%A1\_hydroelectric\_plant](https://www.gem.wiki/Espejo_De_Tarapac%C3%A1_hydroelectric_plant)  
49. Cultana pumped hydro energy storage project \- Arup, erişim tarihi Temmuz 7, 2026, [https://www.arup.com/projects/cultana-pumped-hydro-energy-storage-project/](https://www.arup.com/projects/cultana-pumped-hydro-energy-storage-project/)  
50. Only one of six pumped hydro power storage projects proposed for South Australia left standing in 2021 | Adelaide AZ, erişim tarihi Temmuz 7, 2026, [https://adelaideaz.com/articles/only-one-of-six-pumped-hydro-power-storage-projects-proposed-for-south-australia-left-standing-in-2021](https://adelaideaz.com/articles/only-one-of-six-pumped-hydro-power-storage-projects-proposed-for-south-australia-left-standing-in-2021)  
51. Cultana pumped hydro energy storage project \- Arup, erişim tarihi Temmuz 7, 2026, [https://www.arup.com/en-us/projects/cultana-pumped-hydro-energy-storage-project/](https://www.arup.com/en-us/projects/cultana-pumped-hydro-energy-storage-project/)  
52. Pumped Hydro Energy Storage \- AEMO, erişim tarihi Temmuz 7, 2026, [https://www.aemo.com.au/-/media/files/stakeholder\_consultation/consultations/nem-consultations/2024/2025-iasr-scenarios/final-docs/ghd-2025-pumped-hydro-energy-storage-cost-parameter-review.pdf?rev=23aa606f804b44c9a60efb1cd078468b\&sc\_lang=en](https://www.aemo.com.au/-/media/files/stakeholder_consultation/consultations/nem-consultations/2024/2025-iasr-scenarios/final-docs/ghd-2025-pumped-hydro-energy-storage-cost-parameter-review.pdf?rev=23aa606f804b44c9a60efb1cd078468b&sc_lang=en)  
53. Fact Sheet: Cultana Pumped Hydro Project \- Energy Australia, erişim tarihi Temmuz 7, 2026, [https://www.energyaustralia.com.au/sites/default/files/2017-08/Cultana%20Pumped%20Hydro%20Project%20Fact%20Sheet%20-%20August%202017.pdf](https://www.energyaustralia.com.au/sites/default/files/2017-08/Cultana%20Pumped%20Hydro%20Project%20Fact%20Sheet%20-%20August%202017.pdf)  
54. ADF Cultana Training Area Road Remediation, Eyre Peninsula, Australia \- Aurecon, erişim tarihi Temmuz 7, 2026, [https://www.aurecongroup.com/projects/defence/cultana-training-area-road-remediation](https://www.aurecongroup.com/projects/defence/cultana-training-area-road-remediation)  
55. Our Projects | Discover Civil Solutions – Partner with Us Today\! \- WSU Civil, erişim tarihi Temmuz 7, 2026, [https://www.wsucivil.com.au/our-projects](https://www.wsucivil.com.au/our-projects)  
56. Cultana hydroelectric plant \- Global Energy Monitor, erişim tarihi Temmuz 7, 2026, [https://www.gem.wiki/Cultana\_hydroelectric\_plant](https://www.gem.wiki/Cultana_hydroelectric_plant)  
57. Promising results from Saltwater Pumped Hydro Energy Storage Study | Malcolm Turnbull, erişim tarihi Temmuz 7, 2026, [https://www.malcolmturnbull.com.au/media/promising-results-from-saltwater-pumped-hydro-energy-storage-study](https://www.malcolmturnbull.com.au/media/promising-results-from-saltwater-pumped-hydro-energy-storage-study)  
58. One pumped hydro project still standing as South Australia heads to 100pct wind and solar \- Renew Economy, erişim tarihi Temmuz 7, 2026, [https://reneweconomy.com.au/one-pumped-hydro-project-still-standing-as-south-australia-heads-to-100pct-wind-and-solar/](https://reneweconomy.com.au/one-pumped-hydro-project-still-standing-as-south-australia-heads-to-100pct-wind-and-solar/)  
59. Queensland government pulls plug on world's largest pumped hydro project, erişim tarihi Temmuz 7, 2026, [https://www.energy-storage.news/queensland-government-pulls-plug-on-worlds-largest-pumped-hydro-project/](https://www.energy-storage.news/queensland-government-pulls-plug-on-worlds-largest-pumped-hydro-project/)  
60. EnergyAustralia hides pumped hydro from view as it seeks to lock in giant Victoria battery, erişim tarihi Temmuz 7, 2026, [https://reneweconomy.com.au/energyaustralia-hides-pumped-hydro-from-view-as-it-seeks-to-lock-in-giant-victoria-battery/](https://reneweconomy.com.au/energyaustralia-hides-pumped-hydro-from-view-as-it-seeks-to-lock-in-giant-victoria-battery/)  
61. Hawaii Proposals for Pumped Storage Hydropower \- Ililani Media, erişim tarihi Temmuz 7, 2026, [http://www.ililani.media/2025/08/hawaii-proposals-for-pumped-storage.html](http://www.ililani.media/2025/08/hawaii-proposals-for-pumped-storage.html)  
62. US Army Corps of Engineers Hydroelectric Power Source Alternative Assessment State of Hawaii, erişim tarihi Temmuz 7, 2026, [https://www.poh.usace.army.mil/portals/10/docs/technicalappendix\_hpa.pdf](https://www.poh.usace.army.mil/portals/10/docs/technicalappendix_hpa.pdf)  
63. Power Storage with Pumped-Hydro Storage Systems in the Island of Crete, Greece. A PESTEL Analysis | Engineering And Technology Journal \- Everant Journals, erişim tarihi Temmuz 7, 2026, [https://everant.org/index.php/etj/article/view/2585](https://everant.org/index.php/etj/article/view/2585)  
64. Modeling and Optimal Dimensioning of a Pumped Hydro Energy Storage System for the Exploitation of the Rejected Wind Energy in the Non-Interconnected Electrical Power System of the Crete Island, Greece \- IDEAS/RePEc, erişim tarihi Temmuz 7, 2026, [https://ideas.repec.org/a/gam/jeners/v13y2020i11p2705-d364258.html](https://ideas.repec.org/a/gam/jeners/v13y2020i11p2705-d364258.html)  
65. Turning Crete into an Energy Independent Island, erişim tarihi Temmuz 7, 2026, [https://hybridpowersystems.org/crete2019/wp-content/uploads/sites/13/2020/03/2A\_1\_HYB19\_009\_paper\_Katsaprakakis\_Dimitris.pdf](https://hybridpowersystems.org/crete2019/wp-content/uploads/sites/13/2020/03/2A_1_HYB19_009_paper_Katsaprakakis_Dimitris.pdf)  
66. Dimitris KATSAPRAKAKIS | Professor (Full) | Professor | Hellenic Mediterranean University, Irákleion | Department of Mechanical Engineering | Research profile \- ResearchGate, erişim tarihi Temmuz 7, 2026, [https://www.researchgate.net/profile/Dimitris-Katsaprakakis](https://www.researchgate.net/profile/Dimitris-Katsaprakakis)  
67. Katsaprakakis Dimitris \- Google Scholar, erişim tarihi Temmuz 7, 2026, [https://scholar.google.com/citations?user=B6UqJbkAAAAJ\&hl=el](https://scholar.google.com/citations?user=B6UqJbkAAAAJ&hl=el)  
68. Twin pumped storage hydropower projects in Greece get environmental approval, erişim tarihi Temmuz 7, 2026, [https://balkangreenenergynews.com/twin-pumped-storage-hydropower-projects-in-greece-get-environmental-approval/](https://balkangreenenergynews.com/twin-pumped-storage-hydropower-projects-in-greece-get-environmental-approval/)  
69. Pumped Storage Hydro Plant in Western Greece (Amfilochia) \- Reforms and Investments, erişim tarihi Temmuz 7, 2026, [https://reforms-investments.ec.europa.eu/projects/pumped-storage-hydro-plant-western-greece-amfilochia\_en](https://reforms-investments.ec.europa.eu/projects/pumped-storage-hydro-plant-western-greece-amfilochia_en)  
70. Amfilochia Pumped Storage: Pioneering a new hydropower era for Greece, erişim tarihi Temmuz 7, 2026, [https://www.hydropower.org/blog/amfilochia-pumped-storage-pioneering-a-new-hydropower-era-for-greece](https://www.hydropower.org/blog/amfilochia-pumped-storage-pioneering-a-new-hydropower-era-for-greece)  
71. Storage \- Red Eléctrica, erişim tarihi Temmuz 7, 2026, [https://www.ree.es/en/ecological-transition/storage](https://www.ree.es/en/ecological-transition/storage)  
72. Sustainable Desalination, Renewable Energy and Energy Storage in the Canary Islands, erişim tarihi Temmuz 7, 2026, [https://www.un.org/sites/un2.un.org/files/2020/09/sustainable\_desalination\_renewable\_energy\_and\_energy\_storage\_in\_the\_canary\_islands.pdf](https://www.un.org/sites/un2.un.org/files/2020/09/sustainable_desalination_renewable_energy_and_energy_storage_in_the_canary_islands.pdf)  
73. Chira-Soria reversible hydroelectric power plant \- 200 MW on the Canary Islands \- IDOM, erişim tarihi Temmuz 7, 2026, [https://www.idom.com/en/project/chira-soria-reversible-hydroelectric-power-plant-200-mw-on-the-canary-islands/](https://www.idom.com/en/project/chira-soria-reversible-hydroelectric-power-plant-200-mw-on-the-canary-islands/)  
74. Salto de Chira desalination plant | Tedagua \~ Grupo Cobra, erişim tarihi Temmuz 7, 2026, [https://www.tedagua.com/en/project/salto-de-chira-desalination-plant](https://www.tedagua.com/en/project/salto-de-chira-desalination-plant)  
75. REE awards the contract for the construction of the Seawater Desalination Plant for the Salto de Chira power station | Redeia, erişim tarihi Temmuz 7, 2026, [https://www.redeia.com/en/press-office/news/press-release/2021/07/ree-awards-contract-construction-seawater-plant-salto-chira-power-station](https://www.redeia.com/en/press-office/news/press-release/2021/07/ree-awards-contract-construction-seawater-plant-salto-chira-power-station)  
76. Delivering pumped storage technology for the Canary Islands \- GE Vernova, erişim tarihi Temmuz 7, 2026, [https://www.gevernova.com/gas-power/resources/case-studies/spain](https://www.gevernova.com/gas-power/resources/case-studies/spain)  
77. Salto de Chira Pumped Storage Hydropower Plant, Spain \- Power Technology, erişim tarihi Temmuz 7, 2026, [https://www.power-technology.com/projects/salto-de-chira-pumped-storage-hydropower-plant-spain/](https://www.power-technology.com/projects/salto-de-chira-pumped-storage-hydropower-plant-spain/)  
78. EIB approves a €300 million loan to Red Eléctrica for the construction of Salto de Chira hydroelectric power plant in the Canary Islands, erişim tarihi Temmuz 7, 2026, [https://www.eib.org/en/press/all/2024-403-eib-approves-a-eur300-million-loan-to-red-electrica-for-the-construction-of-salto-de-chira-hydroelectric-power-plant-in-the-canary-islands](https://www.eib.org/en/press/all/2024-403-eib-approves-a-eur300-million-loan-to-red-electrica-for-the-construction-of-salto-de-chira-hydroelectric-power-plant-in-the-canary-islands)  
79. A High-Renewables Tomorrow, Today: El Hierro, Canary Islands \- RMI, erişim tarihi Temmuz 7, 2026, [https://rmi.org/blog\_2014\_02\_13\_high\_renewables\_tomorrow\_today\_el\_hierro\_canary\_islands/](https://rmi.org/blog_2014_02_13_high_renewables_tomorrow_today_el_hierro_canary_islands/)  
80. El Hierro renewable, an example of sustainability \- Endesa, erişim tarihi Temmuz 7, 2026, [https://www.endesa.com/en/projects/all-projects/energy-transition/renewable-energies/el-hierro-renewable-sustainability](https://www.endesa.com/en/projects/all-projects/energy-transition/renewable-energies/el-hierro-renewable-sustainability)  
81. El Hierro, an example to behold in energy sustainability \- MAPFRE Global Risks, erişim tarihi Temmuz 7, 2026, [https://www.mapfreglobalrisks.com/en/risks-insurance-management/article/el-hierro-an-example-to-behold-in-energy-sustainability/](https://www.mapfreglobalrisks.com/en/risks-insurance-management/article/el-hierro-an-example-to-behold-in-energy-sustainability/)  
82. Gorona del Viento Wind-Hydro Power Plant, erişim tarihi Temmuz 7, 2026, [https://hybridpowersystems.org/wp-content/uploads/sites/9/2018/05/1\_2\_TENE18\_036\_paper\_Marrero\_Agustin.pdf](https://hybridpowersystems.org/wp-content/uploads/sites/9/2018/05/1_2_TENE18_036_paper_Marrero_Agustin.pdf)  
83. 'We're an evolving laboratory': the island on a quest to be self-sufficient in energy, erişim tarihi Temmuz 7, 2026, [https://www.theguardian.com/environment/2024/dec/11/el-hierro-canary-islands-wind-hydro-power-renewable-energy-self-sufficiency-sustainability-aoe](https://www.theguardian.com/environment/2024/dec/11/el-hierro-canary-islands-wind-hydro-power-renewable-energy-self-sufficiency-sustainability-aoe)  
84. Spain evaluates 3.2 GWh pumped-storage project in Tenerife \- Hydropower & Dams, erişim tarihi Temmuz 7, 2026, [https://www.hydropower-dams.com/news/spain-evaluates-3-2-gwh-pumped-storage-project-in-tenerife/](https://www.hydropower-dams.com/news/spain-evaluates-3-2-gwh-pumped-storage-project-in-tenerife/)  
85. MITECO launches pumped storage hydropower plant in Tenerife \- Energy Global, erişim tarihi Temmuz 7, 2026, [https://www.energyglobal.com/other-renewables/02032026/miteco-launches-pumped-storage-hydropower-plant-in-tenerife/](https://www.energyglobal.com/other-renewables/02032026/miteco-launches-pumped-storage-hydropower-plant-in-tenerife/)  
86. Role of Pumped Hydro Storage in China's Power System Transition | Energy Markets & Planning \- Lawrence Berkeley National Laboratory, erişim tarihi Temmuz 7, 2026, [https://emp.lbl.gov/publications/role-pumped-hydro-storage-china-s](https://emp.lbl.gov/publications/role-pumped-hydro-storage-china-s)  
87. China building more pumped-storage power stations to meet rising demand, erişim tarihi Temmuz 7, 2026, [https://english.www.gov.cn/news/202503/21/content\_WS67dd6c1ac6d0868f4e8f10b0.html](https://english.www.gov.cn/news/202503/21/content_WS67dd6c1ac6d0868f4e8f10b0.html)  
88. Pumped Storage Hydropower \- POWERCHINA, erişim tarihi Temmuz 7, 2026, [https://en.powerchina.cn/PumpedStorageHydropower.html](https://en.powerchina.cn/PumpedStorageHydropower.html)  
89. China's Fengning Station: World's Largest Pumped Hydro Power Plant Sets New Global Benchmark \- International Hydropower Association (IHA), erişim tarihi Temmuz 7, 2026, [https://www.hydropower.org/news/chinas-fengning-station-worlds-largest-pumped-hydro-power-plant-sets-new-global-benchmark](https://www.hydropower.org/news/chinas-fengning-station-worlds-largest-pumped-hydro-power-plant-sets-new-global-benchmark)  
90. China's New Underwater Data Center Has An Unexpected Power Source. China is trying to solve its water-consuming, power-draining data center problems by moving them under the sea. It launched what it calls the world's first wind-powered underwater data center. It houses about 2,000 servers. : r/energy \- Reddit, erişim tarihi Temmuz 7, 2026, [https://www.reddit.com/r/energy/comments/1u0epm1/chinas\_new\_underwater\_data\_center\_has\_an/](https://www.reddit.com/r/energy/comments/1u0epm1/chinas_new_underwater_data_center_has_an/)  
91. China just switched on the first underwater data center, cooling servers with the ocean to slash energy use, and coastal cities like Cartagena could be next \- OkDiario, erişim tarihi Temmuz 7, 2026, [https://okdiario.com/techy/en/china-just-switched-on-the-first-underwater-data-center-cooling-servers-with-the-ocean-to-slash-energy-use-and-coastal-cities-like-cartagena-could-be-next/5872/](https://okdiario.com/techy/en/china-just-switched-on-the-first-underwater-data-center-cooling-servers-with-the-ocean-to-slash-energy-use-and-coastal-cities-like-cartagena-could-be-next/5872/)  
92. exploring the prospects and development path for marine renewable energy industries \- Tethys, erişim tarihi Temmuz 7, 2026, [https://tethys.pnnl.gov/sites/default/files/publications/Wang\_et\_al\_2023.pdf](https://tethys.pnnl.gov/sites/default/files/publications/Wang_et_al_2023.pdf)  
93. 20151029-Zhoushan-Marine-Energy-Presentation.pdf, erişim tarihi Temmuz 7, 2026, [http://www.oref.co.uk/wp-content/uploads/2015/11/20151029-Zhoushan-Marine-Energy-Presentation.pdf](http://www.oref.co.uk/wp-content/uploads/2015/11/20151029-Zhoushan-Marine-Energy-Presentation.pdf)  
94. Genotoxicity and Health Risk of Seawater Desalination Based on Reverse Osmosis: A Case Study of Two Seawater Desalination Plants in Zhoushan, China \- MDPI, erişim tarihi Temmuz 7, 2026, [https://www.mdpi.com/2073-4441/15/13/2470](https://www.mdpi.com/2073-4441/15/13/2470)  
95. Prefeasibility analysis of the Pumped Hydro Storage (PHS) system in Türkiye: A case study on a hybrid system \- Journals \- Academic Publishing, erişim tarihi Temmuz 7, 2026, [https://ojs.acad-pub.com/index.php/ESC/article/view/215](https://ojs.acad-pub.com/index.php/ESC/article/view/215)  
96. Gökçekaya Dam \- Wikipedia, erişim tarihi Temmuz 7, 2026, [https://en.wikipedia.org/wiki/G%C3%B6k%C3%A7ekaya\_Dam](https://en.wikipedia.org/wiki/G%C3%B6k%C3%A7ekaya_Dam)  
97. Gokcekaya hydroelectric plant \- Global Energy Monitor, erişim tarihi Temmuz 7, 2026, [https://www.gem.wiki/Gokcekaya\_hydroelectric\_plant](https://www.gem.wiki/Gokcekaya_hydroelectric_plant)  
98. capacity determination of pumped storage projects using market electricity prices, erişim tarihi Temmuz 7, 2026, [https://etd.lib.metu.edu.tr/upload/12616768/index.pdf](https://etd.lib.metu.edu.tr/upload/12616768/index.pdf)  
99. Turkey-Japan to build pumped-storage hydro power plant, erişim tarihi Temmuz 7, 2026, [https://www.aa.com.tr/en/energy/renewable/turkey-japan-to-build-pumped-storage-hydro-power-plant/12463](https://www.aa.com.tr/en/energy/renewable/turkey-japan-to-build-pumped-storage-hydro-power-plant/12463)  
100. The Impact of Pumped Hydro Energy Storage \- Configurations on Investment Planning of Hybrid \- Emre Nadar, erişim tarihi Temmuz 7, 2026, [http://emre.nadar.bilkent.edu.tr/hybrid\_investment.pdf](http://emre.nadar.bilkent.edu.tr/hybrid_investment.pdf)















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

Görsel 5 - PDHES değer katmanları: enerji kaydırma, frekans, gerilim, kara başlatma ve yedek kapasite.

Bir PDHES’in gelir ve sistem değeri yalnızca elektrik fiyat farkından oluşmaz. Büyük senkron makineler sisteme ataletsel davranış, gerilim desteği ve kısa devre gücü katkısı sağlayabilir. İyi tasarlanmış bir tesis, işletme stratejisine bağlı olarak yan hizmetler pazarında frekans kontrolü, hızlı devreye girme, rezerv kapasite ve kara başlatma gibi kritik hizmetler sunabilir.

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
