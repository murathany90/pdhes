## 1. PDHES neden yeniden stratejik önem kazandı?

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
