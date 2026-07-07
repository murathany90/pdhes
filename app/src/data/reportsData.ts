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

Bu raporun PDF sürümü de hazırlandı: [PDF raporu indir](sandbox:/mnt/data/pdhes_sebeke_teknoloji_analiz_raporu.pdf)

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
    id: 'global-pdhes-inventory',
    title: 'Küresel PDHES Envanteri İçin Derin Araştırma Özeti',
    category: 'report',
    author: 'Sistem Araştırma Modülü',
    publishDate: '2026-07-07',
    readTime: 12,
    coverImage: '/pdhes-nedir/img-19.webp',
    summary: 'GEM, IHA ve DOE/ORNL kaynakları taranarak hazırlanan küresel pompaj depolamalı hidroelektrik santral mevcut durumu.',
    content: `# Küresel PDHES Envanteri İçin Derin Araştırma Özeti

Bu belge, **Global Energy Monitor (GEM)**, **Uluslararası Hidroelektrik Birliği (IHA)** ve **ABD Enerji Bakanlığı (DOE)** veritabanlarından elde edilen bilgilerle küresel pompaj depolamalı hidroelektrik santral (PDHES) mevcut durumu, ülke özetleri ve seçilmiş tesis analizlerini sunmaktadır.

## 1. Pompaj Depolamanın Ölçeği ve Büyümesi

IHA'nın **2024 Dünya Hidroelektrik Raporu**, pompaj depolamalı hidroelektrik santrallerin (PSH) küresel temiz enerji dönüşümünde oynadığı kritik rolü net bir şekilde ortaya koymaktadır. 

*   Rapor, **2023 yılında PSH kapasitesinin 6.5 GW artarak 179 GW'a** ulaştığını vurgulamaktadır.
*   Pompaj depolamanın günümüzde **küresel enerji depolamasının yaklaşık %90'ını** oluşturduğu tahmin edilmektedir.
*   Pompaj depolama, özellikle rüzgar ve güneş gibi değişken yenilenebilir enerji kaynaklarının şebekeye entegrasyonunda hayati bir rol oynamaktadır. Uzun süreli depolama sağlayabilen ve şebeke kararlılığı sunan yegane olgun teknolojidir.

> "Su bataryaları olarak da bilinen PSH, yenilenebilir enerjinin depolanmasında hacim ve süre olarak en güçlü alternatiftir."

## 2. Ülke Düzeyinde HES ve PDHES Kapasite Görünümü

Aşağıdaki tablo, Mart 2026 GEM güncellemelerine göre dünyada öne çıkan ülkelerin mevcut durumunu özetler. İşletmedeki pompaj depolama kapasitesinde **Çin**, ardından Japonya ve ABD gelmektedir. 

| Ülke | İşletmedeki PDHES (MW) | 
|---|---:|
| Çin | 68,313 |
| Japonya | 24,841 |
| Amerika Birleşik Devletleri | 20,102 |
| İtalya | 7,643 |
| Hindistan | 7,426 |
| İspanya | 6,128 |
| Avusturya | 5,987 |
| Almanya | 5,940 |

*Kaynak: GEM Top 20 Operating Hydropower Capacity, Mart 2026.*

## 3. Kapalı Çevrim PSH ve Çevresel Avantajlar

DOE'nin **PSH INNOVATION REPORT** belgesi, yeni PDHES tesislerinin yenilikçi yaklaşımlarını analiz etmektedir. Bu raporda dikkat çeken en önemli kavram **kapalı çevrim (closed-loop) sistemlerdir**.

Mevcut bir doğal su yoluna veya nehre sürekli bağlı olmayan bu sistemlerin getirdiği faydalar:
* Çevresel Etkilerin Azaltılması
* Konumlandırma Esnekliği
* Biyoçeşitliliğin Korunması

Türkiye'nin dağlık ve eğimli topografyası göz önüne alındığında kapalı çevrim PSH tesisleri çok büyük bir potansiyel barındırmaktadır.
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
    id: 'news-iem-update',
    title: 'Enerji Piyasasında Depolama Yatırımlarına Yönelik Yeni Düzenlemeler',
    category: 'news',
    author: 'Enerji Haber Merkezi',
    publishDate: '2026-07-01',
    readTime: 3,
    coverImage: '/pdhes-nedir/img-3.webp',
    summary: 'Enerji Piyasası Düzenleme Kurumu (EPDK), depolamalı santrallerin şebekeye entegrasyonunu hızlandıracak yeni teşvikleri duyurdu.',
    content: `# Yeni EPDK Kararı
    
Enerji Piyasası Düzenleme Kurumu (EPDK), depolama entegreli üretim tesislerine kapasite tahsisi sürecini hızlandıran ve teminat şartlarında kolaylık sağlayan yeni kararı Resmi Gazete'de yayımladı.

Bu karar ile birlikte rüzgar ve güneş enerjisi yatırımlarıyla birleşik çalışacak PDHES ve batarya projelerinin önü açılıyor.
    `
  }
];
