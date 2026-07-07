export interface ReportItem {
  id: string;
  title: string;
  category: 'feasibility' | 'academic' | 'news' | 'guide';
  author: string;
  publishDate: string;
  readTime: number;
  coverImage?: string;
  summary: string;
  content: string;
}

export const REPORTS_DATA: ReportItem[] = [
  {
    id: 'global-pdhes-inventory',
    title: 'Küresel PDHES Envanteri İçin Derin Araştırma Özeti',
    category: 'academic',
    author: 'Sistem Araştırma Modülü',
    publishDate: '2026-07-07',
    readTime: 12,
    summary: 'GEM, IHA ve DOE/ORNL kaynakları taranarak hazırlanan küresel pompaj depolamalı hidroelektrik santral (PDHES) mevcut durumu, ülke özetleri ve seçilmiş tesis analizlerini içeren kapsamlı rapor.',
    content: `# Küresel PDHES Envanteri İçin Derin Araştırma Özeti

Bu çalışma, kamuya açık ve doğrulanabilir katmanlar üzerinden **Global Energy Monitor (GEM)**, **International Hydropower Association (IHA)** ve **ABD Enerji Bakanlığı/Oak Ridge National Laboratory HydroSource (DOE/ORNL)** kaynakları taranarak hazırlanmıştır. Kullanılan omurga veri kaynakları arasında GEM’in Mart 2026 tarihli özet tabloları ve proje sayfaları, IHA’nın Pumped Storage Tracking Tool sayfası ve DOE/ORNL’nin 2025 tarihli U.S. Existing Hydropower Assets ile U.S. Hydropower Development Pipeline sayfaları yer alır. GEM özet tabloları, **en az 30 MW** büyüklüğündeki hidro projeleri kapsar. IHA izleme aracı ise tarama anında “scheduled update” notu taşıyordu; bu nedenle IHA tarafı özellikle doğrulama ve kapsam kıyaslaması için kullanıldı, ancak proje bazında alan tamamlama kapasitesi sınırlı kaldı. citeturn16view0turn4view0turn10view0turn11view0

Bu yanıtın birlikte üretilen teslimleri:
- [Ayrıntılı CSV envanteri](sandbox:/mnt/data/pdhes_kuresel_envanter_secili_projeler_2026-07-07.csv)
- [PDF raporu](sandbox:/mnt/data/pdhes_kuresel_rapor_2026-07-07.pdf)

## Yöntem ve kaynak kapsamı

GEM, küresel hidro ve pompaj depolamalı hidro santraller için proje düzeyinde **durum, devreye alma yılı, kapasite, teknoloji türü, sahiplik ve koordinat** gibi alanları sağlıyor; ancak rezervuar poligonları, tutarlı MWh depolama kapasitesi, ayrıntılı maliyet ve yaşam boyu kullanım verileri çoğu tesis için kamu katmanlarında sistematik olarak yer almıyor. DOE/ORNL HydroSource ise ABD için daha güçlü bir kaynak: 2025 “Existing Hydropower Assets” veri kümesi mevcut operasyonel hidro tesisleri, 2025 “Development Pipeline” ise henüz işletmede olmayan projeleri kapsıyor. DOE’nin 2025 PSH pipeline haritası da proje bazında **tip, büyüklük ve geliştirme aşaması** sunduğunu açıkça belirtiyor. citeturn23view0turn23view1turn23view2turn23view3turn10view0turn11view0turn12view0

Küresel ölçekte pompaj depolama tarafında güçlü genişleme dinamiği var. GEM’in Mart 2026 PSH özet sayfasına göre dünya genelinde **196,116 MW işletmedeki PSH kapasitesi** bulunuyor; ayrıca **247,753 MW inşaat**, **183,371 MW ön inşaat** ve **314,972 MW anons edilmiş** kapasite kayıtlı. GEM aynı sayfada, **hidroelektrikte inşaat aşamasındaki kapasitenin yaklaşık %60’ının pompaj depolama** olduğunu da not ediyor. citeturn35view0turn5view1

## Ülke düzeyinde HES ve PDHES kapasite görünümü

GEM’in Mart 2026 “Top Data” sayfaları, ülke karşılaştırmasını yapmak için en sağlam ve tutarlı küresel özet katmanını sunuyor. Toplam işletmedeki hidro kapasitesinde Çin açık ara önde; onu Brezilya, ABD ve Kanada izliyor. İşletmedeki pompaj depolama kapasitesinde ise yine Çin ilk sırada, ardından Japonya ve ABD geliyor. Bu görünüm, toplam hidro kapasitesi ile pompaj depolama kapasitesinin coğrafi dağılımının aynı olmadığını gösteriyor: örneğin **Norveç toplam HES’te üst sıralarda iken PSH’de ilk 20’ye girmiyor**, buna karşılık **Portekiz, Birleşik Krallık, Güney Afrika ve Avusturya** PSH’de göreli olarak daha güçlü bir yoğunluğa sahip. citeturn36view0turn35view0

### İşletmedeki toplam HES kapasitesine göre öne çıkan ülkeler

| Ülke | İşletmedeki toplam HES MW |
|---|---:|
| Çin | 371,683 |
| Brezilya | 102,667 |
| Amerika Birleşik Devletleri | 95,393 |
| Kanada | 80,912 |
| Rusya | 52,385 |
| Hindistan | 51,195 |
| Japonya | 40,391 |
| Norveç | 28,933 |
| Türkiye | 26,479 |
| Fransa | 21,155 |
| İtalya | 17,404 |
| İspanya | 16,335 |
| İsviçre | 14,529 |
| Avusturya | 12,593 |  
Kaynak: GEM Top 20 Operating Hydropower Capacity, Mart 2026. citeturn36view0

### İşletmedeki PDHES kapasitesine göre öne çıkan ülkeler

| Ülke | İşletmedeki PDHES MW |
|---|---:|
| Çin | 68,313 |
| Japonya | 24,841 |
| Amerika Birleşik Devletleri | 20,102 |
| İtalya | 7,643 |
| Hindistan | 7,426 |
| İspanya | 6,128 |
| Avusturya | 5,987 |
| Almanya | 5,940 |
| Fransa | 5,042 |
| Güney Kore | 4,790 |
| İsviçre | 3,748 |
| Portekiz | 3,714 |
| Birleşik Krallık | 3,160 |
| Güney Afrika | 2,892 |
| Avustralya | 2,610 |  
Kaynak: GEM Top 20 Operating Pumped Storage Capacity, Mart 2026. citeturn35view0

ABD özelinde DOE/ORNL tarafı önemli bir ek katman sağlıyor. HydroSource’un 2025 PSH pipeline haritası, 31 Aralık 2024 itibarıyla ABD’de geliştiricilerin FERC veya Bureau of Reclamation nezdinde resmi adımlar atmış PSH projelerini gösteriyor. Bu harita metnine göre yeni projelerde **10 adet pending preliminary permit projesi 12,761 MW**, **54 adet issued preliminary permit projesi 42,596 MW**, **3 adet pending license projesi 3,172 MW** ve **3 adet issued license projesi 2,093 MW** kapasiteye karşılık geliyor; ayrıca kapasite ilaveleri tarafında **2 planlama aşamasındaki proje 2,500 MW** olarak veriliyor. citeturn12view0turn13view0

## Seçilmiş yüksek güvenilirlikli proje envanteri

Aşağıdaki tablo, kamuya açık kaynaklarda istenen alanların anlamlı bir kısmı doğrulanabilen, farklı kıtalardan seçilmiş **yüksek güvenilirlikli** PDHES kayıtlarını özetler. Daha ayrıntılı ve tüm sütunları içeren tablo CSV dosyasındadır. Kamu sayfalarında kesin bulunamayan alanlar kullanıcı talebine uygun şekilde **N/A** bırakılmıştır.

| Santral | Ülke | Durum | Kurulu güç MW | Depolama MWh | Net düşü m | Koordinat | Yıl | Türbin/teknoloji | Alt / üst rezervuar | Sahiplik / işletme | Kaynak |
|---|---|---:|---:|---:|---:|---|---|---|---|---|---|
| Bath County Pumped Storage Station | ABD | Aktif | 3003 | N/A | N/A | 38.2089, -79.8001 | 1985 | 6 ünite, tersinir pompa-türbin | Back Creek alt / Little Back Creek üst | Dominion Energy %60; Bath County Energy LLC ~%24; Alleghany Power System ~%16 | GEM ve Dominion Energy. citeturn23view0turn31view0 |
| Snowy 2.0 | Avustralya | Yapım aşamasında | 2200 | 350000 | N/A | -35.7452, 148.6536 | 2028 plan | 6 tersinir türbin | Talbingo alt / Tantangara üst | Snowy Hydro Ltd | GEM ve Snowy Hydro. citeturn23view1turn31view2 |
| Dinorwig | Birleşik Krallık | Aktif | 1728 | N/A | 546.7 | 53.1206, -4.1153 | 1983/1984 | 6 dikey tersinir Francis tipi pompa-türbin | Marchlyn Mawr üst / alt rezervuar N/A | First Hydro Company / ENGIE UK | GEM ve ANDRITZ. citeturn24search0turn31view3 |
| Grand'Maison | Fransa | Aktif | 1800 | N/A | 822–955 | 45.1454, 6.0515 | 1987 | 4 Pelton + 8 tersinir pompa-türbin | Lac du Verney alt / Lac de Grand'Maison üst | EDF | GEM ve EDF. citeturn24search1turn39search0turn39search3turn39search6 |
| Goldisthal | Almanya | Aktif | 1060 | N/A | 302 | 50.5178, 11.0085 | 2004 | Francis; iki değişken hızlı ünite bildiriliyor | Üst rezervuar çalışma suyu ~13 milyon m³; alt rezervuar N/A | Vattenfall | GEM, Vattenfall, Voith. citeturn24search2turn41view0turn34search1 |
| Nant de Drance | İsviçre | Aktif | 900 | 20000 | 395 | 46.0625, 6.8982 | 2022 | 6 Francis pompa-türbin | Emosson alt / Vieux Emosson üst | Nant de Drance SA konsorsiyumu | GEM, Nant de Drance, Alpiq, AFRY. citeturn23view2turn41view2turn41view3turn34search8 |
| Reisseck II | Avusturya | Aktif | 430 | N/A | N/A | 46.8934, 13.3432 | 2016 | 2 ünite | N/A | Verbund Hydro Power | GEM. citeturn28view2 |
| Alqueva II | Portekiz | Aktif | 256 | N/A | N/A | 38.1941, -7.4970 | 2012 | Sabit hızlı tersinir pompa-türbin | Pedrógão alt / Alqueva üst | EDP | GEM, XFLEX, Alstom. citeturn24search3turn38view1turn40search14 |
| Cortes La Muela II | İspanya | Aktif | 882 | N/A | N/A | 39.2444, -0.9314 | 2013 | 4 ünite | La Muela üst / alt rezervuar N/A | Iberdrola | GEM. citeturn28view1 |
| Mount Gilboa | İsrail | Aktif | 300 | 3000 | N/A | 32.4781, 35.4384 | 2020 | Pumped storage | N/A | Electra Group | GEM ve Shikun & Binui Energy. citeturn28view0turn37view3 |
| Tehri Pumped Storage Plant | Hindistan | Aktif | 1000 | N/A | N/A | 30.37001, 78.4794 | 2025 | 4 x 250 MW; değişken hızlı | N/A | THDC India Ltd | GEM ve THDCIL. citeturn26view0turn37view0 |
| Purulia Pumped Storage | Hindistan | Aktif | 900 | N/A | N/A | 23.1975, 86.097 | 2007 | 4 x 225 MW | N/A | WBSEDCO | GEM. citeturn28view3 |
| Fengning Pumped Storage | Çin | Aktif | 3600 | N/A | N/A | 41.6988, 116.5844 | 2021 | 12 x 300 MW | N/A | State Grid / Hebei Fengning Pumped Storage | GEM. citeturn23view3 |
| Upper Cisokan | Endonezya | Yapım aşamasında | 1040 | N/A | N/A | -6.9458, 107.2173 | N/A | 4 x 260 MW; pompa kapasitesi 1100 MW | Cisokan alt / Cirumamis üst | PLN | GEM, AIIB, Dünya Bankası belgeleri. citeturn30search0turn42view0turn42view2turn43view0 |
| Ingula Pumped Storage Scheme | Güney Afrika | Aktif | 1332 | N/A | N/A | -28.2809, 29.588 | 2016 | 4 x 333 MW Francis pump-türbin | Bramhoek alt / Bedford üst | Eskom | GEM, Eskom, Knight Piésold. citeturn26view1turn37view1turn33search9 |
| Drakensberg Pumped Storage Scheme | Güney Afrika | Aktif | 1000 | N/A | 400–448.5 | -28.566, 29.0834 | 1982 | Tek kademeli tersinir Francis | Kilburn alt / Driekloof üst | Eskom | GEM ve Eskom. citeturn26view2turn37view2turn33search10 |
| Abdelmoumen | Fas | Aktif | 350 | N/A | 555 | 30.4751, -8.8052 | 2024 | 2 x 175 MW tersinir pompa-türbin | Abdelmoumen rezervuarı alt / üst rezervuar 1.3 milyon m³ | ONEE | GEM, ANDRITZ, VINCI, AfDB. citeturn26view3turn33search11turn33search3turn33search7 |

Bu tablodaki satırların daha ayrıntılı sürümünde, kullanıcı tarafından talep edilen ek sütunlar da yer almaktadır; tam sürüm CSV dosyasındadır. Özellikle **maliyet, bugüne kadarki üretim/kullanım, rezervuar poligon koordinatları ve bazı santrallerin kesin MWh depolama kapasitesi** çoğu açık kamu kaynağında standart biçimde yer almadığından, bu alanlar geniş ölçüde **N/A** kalmıştır. Bu tercih, kullanıcı talebindeki “tahmini veri girmekten kaçın” şartına uygundur. GEM ve DOE sayfaları proje mevcudiyetini, statüsünü ve temel teknik alanları güçlü biçimde sağlarken; detaylı rezervuar geometri verisi gibi alanlar çoğu zaman ayrı coğrafi çalışma gerektirir. citeturn23view0turn23view1turn23view2turn23view3turn10view0turn11view0

## Ana bulgular

Birincisi, kamuya açık küresel özetlere göre pompaj depolama artık yalnızca “mevcut depo” değil, aynı zamanda **hidro inşaat dalgasının da baskın alt segmentlerinden biri**. GEM’in Mart 2026 verisi, inşa halindeki hidro kapasitesinin yaklaşık %60’ının pompaj depolama olduğunu gösteriyor; bu da PDHES’in yenilenebilir ağırlıklı sistemlerde uzun süreli esneklik aracı olarak yeniden merkezileştiğini ortaya koyuyor. citeturn5view1

İkincisi, **ülke bazında toplam hidro kapasitesi ile pompaj depolama uzmanlaşması aynı şey değil**. Çin, Japonya ve ABD hem toplam hidroda hem PDHES’te üst sıralarda. Ancak Avusturya, Portekiz, Birleşik Krallık ve Güney Afrika gibi ülkeler, toplam hidro ölçeğine kıyasla PDHES yoğunluğu daha yüksek sistemler olarak öne çıkıyor. Buna karşılık Türkiye toplam hidro kapasitesinde küresel ilk 10’da olmasına rağmen, GEM’in işletmedeki PSH top-20 listesinde yer almıyor. citeturn36view0turn35view0

Üçüncüsü, teknik yapı açısından seçilmiş örneklerde üç desen belirgin. Bir grup tesis, klasik **reversible Francis** mimarisiyle şebeke dengeleme ve puant üretim için çalışıyor; Dinorwig, Drakensberg ve Ingula bu gruba iyi örnekler. Bir ikinci grup, **yüksek esneklik** ve yeni piyasa servisleri için optimize ediliyor; Alqueva’da pompalama modunda regülasyon ve HSC çalışmaları, Grand’Maison’da verim ve esneklik artırımı, Tehri’de ise değişken hızlı teknoloji bunun örnekleri. Üçüncü grup ise Snowy 2.0 ve Upper Cisokan gibi, doğrudan **yenilenebilir dönüşümünü taşıyacak uzun süreli depolama omurgası** olarak kurgulanan büyük yeni projeler. citeturn31view3turn37view2turn37view1turn38view1turn39search7turn37view0turn31view2turn42view0

## Açık sorular ve sınırlamalar

Bu çalışmanın en önemli sınırlaması, kullanıcının istediği bazı alanların üç ana veri tabanında da proje bazında **tek bir standart açık veri tablosu** olarak sunulmamasıdır. Özellikle aşağıdaki alanlarda açık boşluklar sürmektedir:
- rezervuarların **çokgen formatında kesin koordinatları**,
- çok sayıda saha için **kesin MWh depolama kapasitesi**,
- “bugüne kadarki toplam üretim ve kullanım” gibi **işletme geçmişi** verileri,
- kamuya açıklanmamış veya farklı fazlara dağılmış **nihai maliyet** değerleri,
- sabit hızlı / değişken hızlı / ternary ayrımının her proje için teyit edilebildiği kamu sayfaları.

Bu nedenle burada sunduğum çıktı, “maksimum doğrulanabilirlik” yaklaşımıyla hazırlanmış bir **yüksek güvenilirlikli çekirdek envanter** niteliğindedir. Ayrıntılı coğrafi rezervuar poligonları ve eksik faz bazlı maliyetler için bir sonraki aşamada ulusal su idareleri, çevresel etki değerlendirmeleri, uydu/GIS tabanlı rezervuar sınır çıkarımı ve şirket lisans dosyalarıyla ülke ülke derinleştirme gerekir. Bu sınırlama, eldeki açık GEM/IHA/DOE katmanlarının yapısından kaynaklanır; tahmin yürütmek yerine eksik alanları N/A bırakmak, veri kalitesi açısından daha doğru yaklaşımdır. citeturn4view0turn10view0turn11view0turn23view0turn23view1turn23view2turn23view3

## Kaynak notu

Başlıca kaynaklar: GEM Global Hydropower Tracker özet tabloları ve proje sayfaları; IHA Pumped Storage Tracking Tool sayfası; DOE/ORNL HydroSource Existing Hydropower Assets 2025, U.S. Hydropower Development Pipeline 2025 ve U.S. Pumped Storage Development Pipeline map; ayrıca proje bazında resmi işletmeci/teknoloji sağlayıcısı sayfaları. Üstteki Markdown tablo satırları, satır sonundaki kaynak alıntıları üzerinden derlenmiştir. citeturn16view0turn35view0turn36view0turn10view0turn11view0turn12view0`
  },
  {
    id: 'tr-pdhes-gelecegi',
    title: 'Türkiye\'nin PDHES Potansiyeli ve Yenilenebilir Enerji Entegrasyonu',
    category: 'feasibility',
    author: 'M. Yeniceli',
    publishDate: '2026-06-15',
    readTime: 5,
    summary: 'Rüzgar ve güneş enerjisindeki dalgalanmaları dengelemek için Türkiye\'nin kapalı çevrim (closed-loop) pompaj depolama hidroelektrik santral ihtiyacının kavramsal analizi.',
    content: `## Türkiye'nin PDHES Stratejisi
    
Türkiye'nin yenilenebilir enerji kurulu gücü hızla artarken, baz yük ve dengeleme santrali ihtiyacı da kritik bir seviyeye ulaşmaktadır. Özellikle gece ve gündüz fiyat makasının açılması, lityum-iyon bataryaların kısa süreli (<4 saat) depolamaya uygun olması sebebiyle **Pumped Storage Hydropower (PDHES)** tesisleri uzun süreli (8+ saat) depolama için tek olgun teknolojidir.

### Pazar İhtiyacı
*   **Güneş Eğrisi (Duck Curve):** Gündüz oluşan üretim fazlası, akşam puantında yerini ani bir talep artışına bırakmaktadır.
*   **Yan Hizmetler:** Primer ve sekonder frekans kontrolünde PDHES'lerin esnekliği rüzgar dalgalanmalarını saniyeler içinde dengeleyebilir.

### Kapalı Çevrim Avantajları
Açık çevrim projelere kıyasla kapalı çevrim (nehir sisteminden bağımsız) projeler:
1.  Daha az ÇED (Çevresel Etki Değerlendirmesi) engeline takılır.
2.  Balık göç yollarını etkilemez.
3.  Yüksek düşü (head) olan her topografyada konumlandırılabilir.
    `
  }
];
