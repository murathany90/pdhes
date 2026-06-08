Aşağıdaki tasarım, LinkedIn’deki veri merkezi harita uygulamasının mantığını **PDHES / PSPP yatırım istihbaratı yazılımına** uyarlıyor. Buradaki ana fikir şu:

**Kamu verisi + topoğrafya + şebeke + jeoloji + piyasa verisi → aday saha eşleştirme → puanlama → 3D kavramsal yerleşim → yatırım/timeline/izin zekâsı.**

Raporun ana kararını ürün omurgasına alıyorum: **varlık geliştirme MVP’si için klasik konseptte Gökçekaya**, **yazılım/istihbarat MVP’si için deniz suyu kıyı taramasında Taşucu–Gülnar** ana odak olmalı. Raporda Gökçekaya’nın 1.400 MW/7 saat, 379,5 m efektif düşü, 4,05 km su yolu ve mevcut Gökçekaya HES şaltına yakın bağlantı avantajıyla hızlı canlandırılabilir klasik aday olduğu; Taşucu–Gülnar’ın ise deniz suyu konseptinde yüksek düşü, Mersin/Akkuyu ekseni ve kıyı-grid farklılaştırması nedeniyle en iyi ilk odak olduğu belirtiliyor. 

# 1. Ürün adı ve ana fikir

**Ürün adı:** Türkiye PDHES Potansiyeli Analiz Yazılımı
**Alt başlık:** Pumped Hydro Site Intelligence Platform
**Kısa tanım:** Türkiye genelinde klasik ve deniz suyu pompaj depolamalı hidroelektrik adaylarını otomatik tarayan, teknik/finansal/çevresel skorlayan, harita üstünde 2D/3D gösteren ve yatırım komitesine “neden bu saha?” cevabını veren karar destek platformu.

Bu yazılım, referans veri merkezi uygulamasındaki “permit → power line → 3D procedural layout → timeline” mantığını PDHES için şu akışa çevirir:

```text
DEM / DSİ / TEİAŞ / AFAD / MTA / EPİAŞ / raporlar
→ aday üst rezervuar ve alt rezervuar eşleştirme
→ head, su yolu, şebeke mesafesi, risk, CAPEX, gelir skoru
→ finalist saha seçimi
→ üst rezervuar, cebri boru/tünel, güç evi, surge tank, şalt ve iletim bağlantısı 3D yerleşimi
→ yatırım / izin / due diligence timeline’ı
```

Rapor bu yaklaşımı zaten destekliyor: tekil bir PostGIS veri tabanında kıyı çizgisi, 1 km kıyı grid’i, Copernicus DEM, SRTM, mevcut baraj/rezervuar poligonları, TEİAŞ hatları ve TM’leri, AFAD/MTA risk katmanları, yerleşim-yol ağı, orman/tarım/kadastro/korunan alan katmanlarının birlikte tutulması öneriliyor.  Copernicus DEM, GLO-30 ve GLO-90 olarak 30 m ve 90 m çözünürlüklü global DSM ürünleri sunuyor; NASA/USGS SRTM 1 arc-second ürünü de yaklaşık 30 m küresel yükseklik verisi sağlıyor. ([Copernicus Data Space Ecosystem][1])

# 2. Referans uygulamadaki mantığın PDHES’e çevrilmesi

| Veri merkezi uygulaması                        | PDHES yazılımındaki karşılığı                                                                                |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| TCEQ izin dosyası                              | DSİ, EPDK, ÇED, TEİAŞ, JICA, EPİAŞ, AFAD, MTA, uydu/DEM verisi                                               |
| Enerji iletim hattı eşleştirme                 | 154/380 kV hat, trafo merkezi, bağlanabilir kapasite, N-1 ön kontrol                                         |
| GPU hall / cooling tower / switchyard blokları | Üst rezervuar, alt rezervuar, deniz alımı, tünel, cebri boru, yeraltı güç evi, surge tank, şalt, access road |
| Timeline: lease, financing, ERCOT approval     | Timeline: saha keşfi, DSİ görüşü, TEİAŞ ön bağlantı, ÇED ön inceleme, jeoteknik, fizibilite, yatırım kararı  |
| 3D data center layout                          | 3D PDHES konsept yerleşimi ve uzunlamasına hidrolik kesit                                                    |
| Right panel investment summary                 | MW, GWh, net head, su yolu, CAPEX, yıllık gelir, geri ödeme, risk matrisi                                    |
| Confidence labels                              | Confirmed / inferred / simulated / needs field verification                                                  |

Burada özellikle “confirmed” ve “inferred” ayrımı kritik. Örneğin Gökçekaya’da JICA çalışmasıyla desteklenen parametreler daha yüksek güvenle gösterilirken; Taşucu–Gülnar’daki deniz suyu layout’u daha çok DEM + kıyı-grid + şebeke yakınlığı + konsept mühendislik çıkarımı olarak işaretlenmelidir. Raporda da JICA dışındaki adayların koordinat ve teknik boyutlarının masaüstü tarama düzeyinde olduğu, nihai mühendislik sonucu gibi okunmaması gerektiği vurgulanıyor. 

# 3. Ana ekran mimarisi

Uygulama tek ana kabuk üzerinde 4 ana sekmeyle tasarlanmalı:

```text
1. Datalar
2. Hesaplamalar
3. Harita / 3D
4. Ayarlar
```

Ancak “Harita / 3D” ekranı ürünün kalbi olur. Diğer sekmeler, haritada görünen kararları besleyen veri ve hesap motorudur.

## 3.1 Genel ekran iskeleti

```text
┌─────────────────────────────────────────────────────────────────────┐
│ Türkiye PDHES Potansiyeli Analiz Yazılımı                           │
│ Konsept: Klasik / Deniz Suyu / Hibrit   Saha: Gökçekaya / Taşucu    │
├───────────────┬───────────────────────────────────────┬─────────────┤
│ Sol panel     │ Ana harita / 3D sahne                  │ Sağ panel   │
│               │                                       │             │
│ Filtreler     │ Türkiye görünümü                       │ Yatırım     │
│ Aday listesi  │ Heatmap / aday sahalar                 │ özeti       │
│ Katmanlar     │ 3D finalist yerleşim                   │ Timeline    │
│ AI sorgu      │ Uzunlamasına kesit                     │ Risk kartı  │
│               │                                       │ Kaynaklar   │
├───────────────┴───────────────────────────────────────┴─────────────┤
│ Alt çekmece: fiyat simülasyonu / CAPEX / gelir / kesit / DD checklist│
└─────────────────────────────────────────────────────────────────────┘
```

# 4. Sekme tasarımları

## 4.1 Datalar sekmesi

Bu sekme “ham veri deposu + veri kalitesi + kaynak güven skoru” ekranıdır.

**Amaç:** Kullanıcı hangi verinin sisteme girdiğini, hangi adayın hangi kaynağa dayandığını ve hangi verinin eksik olduğunu görür.

### Ekran bölümleri

**Sol panel: veri kaynakları**

```text
DEM
- Copernicus DEM GLO-30 / GLO-90
- SRTM 1 arc-second
- LiDAR / 1:25.000 topo, varsa

Hidroloji / su yapıları
- DSİ baraj ve HES verileri
- mevcut rezervuarlar
- göl / nehir / deniz alt rezervuar adayları

Şebeke
- TEİAŞ 154 kV / 380 kV hatları
- trafo merkezleri
- bağlanabilir kapasite raporları
- kısa devre / N-1 ön bilgileri

Risk
- AFAD deprem tehlike haritası
- MTA jeoloji, diri fay, heyelan
- korunan alanlar, orman, tarım, yerleşim

Piyasa
- EPİAŞ PTF
- DGP
- PFK / SFK
- reaktif güç / sistem toparlanması varsayımları
```

AFAD’ın Türkiye Deprem Tehlike Haritası 2018’de yenilenmiş ve 1 Ocak 2019’da yürürlüğe girmiştir; MTA Yerbilimleri Harita Görüntüleyici de Türkiye jeoloji haritası, diri fay haritası ve heyelan envanteri referanslarını içerir. Bu iki katman PDHES adaylarında jeoloji/deprem/heyelan risk skorunun temel girdisi olmalıdır. ([Afad][2])

**Orta alan: aday veri tablosu**

Kolonlar:

```text
Saha adı
Konsept tipi
Alt rezervuar
Üst rezervuar kotu
Net head
Su yolu uzunluğu
Head / length oranı
MW
GWh
Şebeke mesafesi
Çevresel risk
Jeoloji riski
CAPEX
Gelir
Skor
Güven seviyesi
```

**Sağ panel: kaynak kanıt kartı**

Her saha için:

```text
Veri güven seviyesi
Confirmed: JICA / DSİ / TEİAŞ / resmi rapor
Inferred: DEM + uydu + GIS çıkarımı
Simulated: prosedürel 3D layout
Needs verification: saha etüdü gerekli
```

Bu panel, LinkedIn uygulamasındaki “filing grade / inferred / public source” mantığının PDHES versiyonudur.

---

## 4.2 Hesaplamalar sekmesi

Bu ekran mühendislik ve yatırım motorudur.

### Ana hesap modülleri

**1. Enerji hesabı**

```text
E = ρ × g × H × V × η
```

Kullanıcı şunları değiştirir:

```text
net head
aktif hacim
verim
depolama süresi
pompaj/türbin çevrim sayısı
```

**2. Hidrolik boyutlandırma**

Çıktılar:

```text
debi
tünel çapı
cebri boru çapı
basınç sınıfı
surge tank ihtiyacı
su darbesi risk seviyesi
```

**3. CAPEX / OPEX modeli**

NREL’in açık PSH maliyet modeli, saha coğrafyası, arazi, rezervuar, baraj, su yolu ve tasarım kararlarından component-level maliyet hesabı üretmeyi amaçlıyor; modelin tarama/fizibilite düzeyinde belirsizlik aralığı da yüksek olduğundan bu yazılımda P50/P90 yaklaşımı kullanılmalı. ([NREL][3])

CAPEX kartları:

```text
rezervuar / kazı / baraj
tünel / penstock / liner
elektromekanik
şalt / trafo / bağlantı
yol / şantiye
mühendislik / izin
contingency
deniz suyu özel paketleri
```

Raporda klasik PSP için 1.600–2.400 EUR/kW, deniz suyu PSP için 2.000–3.100 EUR/kW tarama bandı; 7–8 saatlik projelerde klasik için yaklaşık 220–320 EUR/kWh, deniz suyu için 280–390 EUR/kWh mertebesi öneriliyor. 

**4. Gelir modeli**

Gelir kutuları:

```text
enerji arbitrajı
PFK
SFK
DGP
reaktif güç
oturan sistemin toparlanması / black-start opsiyonu
curtailment azaltımı
hibrit RES/GES premiumu
```

TEİAŞ’ın yan hizmetler sayfasında primer frekans kontrolü, sekonder frekans kontrolü, reaktif güç kontrolü, talep tarafı katılımı ve üretim tesisleri için oturan sistemin toparlanması hizmetleri ayrı başlıklar halinde yer alıyor. Bu nedenle PDHES gelir ekranı yalnızca enerji arbitrajı değil, yardımcı hizmet gelirlerini de modellemeli. ([TEİAŞ][4]) EPİAŞ’ın Mart 2025 raporunda aylık aritmetik ortalama PTF 2.183,83 TL/MWh, puant ortalaması 2.820,21 TL/MWh ve GİP aylık eşleşme miktarı 1.573.146 MWh olarak verilmiştir; bu tip aylık veriler simülasyonun piyasa girdisi olur. ([EPİAŞ][5])

**5. Skor motoru**

Raporun önerdiği mantık doğrudan yazılım skor motoruna konulmalı:

**Deniz suyu konsepti için:**

```text
%30 topoğrafya
%20 şebeke
%15 çevresel kısıt
%10 jeoloji / deprem
%10 erişim
%10 yük merkezi
%5 sosyal / imar
```

**Klasik konsept için:**

```text
%25 mevcut altyapı
%20 şebeke
%20 head / length
%15 çevresel / su rejimi
%10 jeoloji
%10 kamulaştırma
```

Bu sayede Gökçekaya gibi daha hızlı ilerleyebilecek sahalar ile Altınkaya gibi büyük fakat şebeke takviyesi ağır sahalar aynı matriste ayrıştırılır. 

---

## 4.3 Harita / 3D sekmesi

Bu ürünün en etkileyici ekranı burası olur.

### Ekran yapısı

```text
Sol panel:
- Konsept filtresi
- Aday saha listesi
- Katman aç/kapat
- AI / sorgu kutusu
- Ölçüm araçları

Orta panel:
- Türkiye haritası
- 2D skor heatmap
- aday noktalar
- 3D finalist saha
- uzunlamasına kesit

Sağ panel:
- yatırım / kapasite özeti
- proje timeline
- risk register
- veri kanıtları
- export / rapor al
```

### Harita katmanları

```text
DEM hillshade
eğim / aspect
kontur çizgileri
kıyı 1 km grid
mevcut baraj / rezervuar
üst rezervuar aday poligonları
alt rezervuar adayları
candidate pair arc çizgileri
TEİAŞ 154/380 kV hatları
trafo merkezleri
AFAD deprem tehlikesi
MTA diri fay / heyelan / jeoloji
korunan alanlar
yerleşim tamponu
yol erişimi
CAPEX heatmap
gelir / şebeke değeri heatmap
```

MapLibre GL JS, WebGL ile tarayıcıda vektör tile tabanlı interaktif harita render eden açık kaynak bir kütüphanedir; Mapbox/MapLibre tarafında `fill-extrusion` katmanı polygon verisini 3D ekstrüzyon olarak gösterebilir. Bu nedenle MVP’de üst rezervuar, şalt sahası, güç evi gibi bileşenler GeoJSON polygon + height verisiyle hızlıca 3D blok halinde çizilebilir. ([MapLibre][6]) deck.gl tarafında Mapbox/MapLibre kamera sistemiyle senkron overlay kurulabilir; özellikle grid heatmap, arc layer, flow line ve risk overlay için uygundur. ([deck.gl][7])

### 3D gösterim türleri

**A. Türkiye ölçeği 2.5D tarama görünümü**

Bu görünümde kullanıcı Türkiye genelinde:

```text
kıyı-grid skorlarını
klasik rezervuar eşleşmelerini
yüksek head bölgelerini
şebeke yakınlığını
çevresel risk yoğunluğunu
```

renkli katmanlar olarak görür.

**B. Finalist saha 3D kavramsal layout**

Seçili saha örneğin Gökçekaya ise sistem şu bileşenleri çizer:

```text
üst rezervuar
alt rezervuar / mevcut Gökçekaya rezervuarı
iki ana penstock
yeraltı güç evi
surge tank
kablo / servis / drenaj tüneli
şalt sahası
mevcut HES şalt bağlantısı
380 kV bağlantı hattı
erişim yolları
şantiye alanı
```

Raporda Gökçekaya için JICA konseptinin ürün içinde yeniden kurulması; 800 m HWL üst rezervuar, yaklaşık 4,05 km toplam su yolu, egg-shape yeraltı güç evi, iki ana penstock ve dört üniteyle gösterilmesi öneriliyor. 

Seçili saha Taşucu–Gülnar ise sistem şu bileşenleri çizer:

```text
700–900 m kot bandında üst rezervuar
deniz alt rezervuarı
kıyıda intake / outfall
iki hatlı deniz suyu alım-deşarj yapısı
tünel ağırlıklı su yolu
orta eğimde yeraltı güç evi
surge tank
154/380 kV koridora bağlanan şalt sahası
deniz suyu korozyon / liner risk zonları
```

Raporda Taşucu–Gülnar için üst rezervuarın 700–900 m bandında doğal çanak + sınırlı bank yükseltme ile düşünülmesi, alt rezervuarın deniz olması, kıyıda rock-cut intake/outfall ve iki hatlı deniz yapısı, tünel ağırlıklı su yolu ve plato eteğinde şalt yaklaşımı öneriliyor. 

**C. Uzunlamasına kesit görünümü**

Haritanın alt çekmecesinde şu kesit görünür:

```text
üst rezervuar kotu
su yolu eğimi
tünel / şaft / cebri boru bölümleri
surge tank konumu
güç evi kotu
alt rezervuar / deniz seviyesi
basınç profili
su darbesi risk bandı
```

Bu ekran, yatırımcıya “3D güzel görsel” değil, mühendislik mantığını gösterir.

**D. Dinamik işletme animasyonu**

Kullanıcı “pompa modu” veya “türbin modu” seçer:

```text
Pompa modu:
alt rezervuar → üst rezervuar
düşük fiyat / yüksek RES üretimi saatleri

Türbin modu:
üst rezervuar → alt rezervuar
puant / DGP / frekans ihtiyacı saatleri
```

Animasyonda:

```text
su seviyesi değişimi
aktif hacim
MW çıkışı
GWh kalan enerji
tahmini gelir
pompa/türbin verimi
```

eş zamanlı gösterilir.

CesiumJS, yüksek çözünürlüklü global terrain ve su efektlerini 3D globe üzerinde stream edebilir; finalist saha detayında gerçek arazi yüzeyi, 3D Tiles ve yüksek çözünürlüklü terrain kullanmak için Cesium daha uygun olur. ([Cesium][8])

---

## 4.4 Ayarlar sekmesi

Bu sekme ürünün “kontrol paneli” olur.

### Ayar grupları

```text
Skor ağırlıkları
- topoğrafya
- şebeke
- çevre
- jeoloji
- erişim
- yük merkezi
- sosyal risk

Finansal varsayımlar
- EUR/TL
- WACC
- CAPEX katsayısı
- OPEX katsayısı
- enerji spread
- PFK/SFK yakalama oranı
- çevrim/yıl

Teknik varsayımlar
- çevrim verimi
- su yolu hız limiti
- tünel çap bandı
- minimum head
- maksimum su yolu
- minimum GWh
- deniz suyu liner katsayısı

Veri kaynakları
- DEM versiyonu
- TEİAŞ veri tarihi
- EPİAŞ fiyat dönemi
- AFAD/MTA katman versiyonu

Kullanıcı rolleri
- yatırımcı
- mühendis
- GIS analisti
- yönetici
```

# 5. Ana kullanıcı akışı

## Akış 1: Türkiye taraması

```text
Türkiye görünümü açılır
→ kullanıcı “Klasik PDHES” veya “Deniz suyu PDHES” seçer
→ sistem aday heatmap üretir
→ kullanıcı minimum head, maksimum tünel, şebeke mesafesi, risk filtresi girer
→ adaylar skorlanır
→ kısa liste oluşur
```

## Akış 2: Adaydan finalist detaya geçiş

```text
Aday seçilir: Gökçekaya
→ sağ panelde MW / GWh / head / CAPEX / gelir görünür
→ haritada üst-alt rezervuar eşleşmesi açılır
→ 3D layout oluşturulur
→ kullanıcı “kesit göster” der
→ tünel ve basınç profili çıkar
→ yatırım özeti PDF/PowerPoint olarak alınır
```

## Akış 3: Deniz suyu MVP taraması

```text
Konsept: Deniz suyu
→ kıyı 1 km grid açılır
→ 300–1.500 m kot arası üst havza adayları taranır
→ deniz kıyısına uzaklık ve head/length oranı hesaplanır
→ MTA/AFAD/korunan alan overlay uygulanır
→ Taşucu–Gülnar, Bozyazı–Anamur, Karaburun gibi finalistler listelenir
→ finalist için deniz alımı + liner + korozyon risk paketi gösterilir
```

# 6. Ürün modülleri

## 6.1 Site Intelligence Radar

Bu modül, Türkiye genelinde otomatik aday arar.

Çıktılar:

```text
ilk 100 aday
ilk 20 kısa liste
ilk 5 finalist
klasik / deniz suyu ayrımı
yatırım skoru
mühendislik skoru
izin riski
şebeke değeri
```

## 6.2 GIS Scoring Engine

Adayları teknik olarak puanlar.

Girdiler:

```text
head
su yolu uzunluğu
head/length oranı
üst rezervuar alanı
aktif hacim
eğim
jeoloji
deprem
heyelan
korunan alan
yerleşim
yol
şebeke mesafesi
yük merkezi yakınlığı
```

## 6.3 Procedural 3D Layout Engine

Veri merkezi uygulamasındaki “AI drew what it thinks is being built” yaklaşımının PDHES versiyonudur.

Girdi:

```text
saha merkezi
üst rezervuar poligonu
alt rezervuar poligonu
en uygun su yolu çizgisi
grid bağlantı noktası
kot profili
risk katmanları
```

Çıktı:

```text
üst rezervuar 3D poligonu
su alma yapısı
tünel / penstock hattı
surge tank
yeraltı güç evi
şalt sahası
iletim bağlantısı
access road
şantiye / depo / spoil area
etiketli 3D sahne
```

Bileşenler şu güven etiketleriyle gösterilmeli:

```text
confirmed
JICA/reference based
GIS inferred
AI/procedural
needs field verification
```

## 6.4 Hidrolik ve enerji simülasyonu

Modül:

```text
aktif hacim
head
debi
MW
GWh
çevrim verimi
pompa süresi
türbin süresi
su seviyesi değişimi
```

hesaplar.

## 6.5 Piyasa ve gelir simülasyonu

Modül, EPİAŞ fiyatları ve yardımcı hizmet varsayımları ile çalışır.

Çıktılar:

```text
günlük dispatch
aylık gelir
yıllık gelir
arbitraj geliri
PFK/SFK geliri
DGP fırsatı
black-start opsiyonu
curtailment azaltımı
P50 / P90 gelir
```

## 6.6 Grid Interconnection Intelligence

Bu modül TEİAŞ tarafını öne çıkarır.

Gösterilecek kartlar:

```text
en yakın 154 kV hat
en yakın 380 kV hat
en yakın TM
tahmini bağlantı mesafesi
N-1 hassasiyet seviyesi
kısa devre / bağlantı riski
bölgesel yük / üretim dengesi
şebeke takviye CAPEX kartı
```

Altınkaya gibi sahalarda arayüz özellikle “saha CAPEX” ile “şebeke takviye CAPEX”i ayırmalı. Raporda Altınkaya için belirleyici farkın santral layout’undan çok bölgesel 380 kV reinforcement ihtiyacı olduğu, bu yüzden iki maliyetin ayrı kartlarda gösterilmesi gerektiği vurgulanıyor. 

## 6.7 Environmental & Permit Intelligence

Gösterilecek başlıklar:

```text
ÇED riski
orman / tarım / mera çakışması
korunan alan çakışması
yerleşim tamponu
aktif fay uzaklığı
heyelan riski
kıyı kanunu riski
deniz ekosistemi riski
kamulaştırma zorluğu
```

## 6.8 Due Diligence Timeline

Referans uygulamadaki timeline’ın PDHES versiyonu.

Örnek timeline:

```text
2026 Q1
DEM + uydu + kıyı-grid taraması tamamlandı

2026 Q2
Gökçekaya 3D konsept layout üretildi

2026 Q2
TEİAŞ ön bağlantı soru seti hazırlandı

2026 Q3
Jeoloji / heyelan / korunan alan masaüstü DD tamamlandı

2026 Q4
Saha gezisi ve 1:25.000 topo doğrulama

2027 Q1
P50/P90 CAPEX ve gelir senaryosu

2027 Q2
Go / no-go yatırım komitesi
```

Raporda doğrulama adımları üç katmanda kurgulanıyor: DEM ve veri doğrulaması; hillshade/eğim/korunan alan/AFAD-MTA masaüstü overlay; son olarak LiDAR veya 1:25.000 topo, arazi erişimi, jeoteknik reconnaissance ve TEİAŞ ön bağlantı görüşü. 

# 7. 3D gösterim tasarımı

## 7.1 3D seviye 1: hızlı MVP

Teknoloji:

```text
MapLibre GL JS
GeoJSON polygon
fill-extrusion
deck.gl overlay
```

Gösterim:

```text
üst rezervuar blok/poligon
şalt sahası blok
güç evi blok
surge tank silindir/blok
su yolu line
iletim hattı line
risk buffer polygon
```

Bu seviye hızlıdır, web tabanlıdır ve tek sayfa uygulamaya uygundur.

## 7.2 3D seviye 2: mühendislik görselleştirme

Teknoloji:

```text
CesiumJS
3D terrain
3D Tiles
COG/terrain tile
glTF / GLB tesis bileşenleri
```

Gösterim:

```text
gerçek arazi yükselti modeli
üst rezervuar hacim yüzeyi
su seviyesi animasyonu
tünel hattı 3D
uzunlamasına kesit
şalt / trafo / iletim direği sembolleri
```

## 7.3 3D seviye 3: render ve sunum

Teknoloji:

```text
Three.js
Blender
AI image generation
offline render pipeline
```

Kullanım:

```text
yatırımcı sunumu
basın görseli
ön fizibilite raporu
saha fly-through videosu
```

Bu seviye karar motoru değil, sunum ve ikna katmanıdır.

# 8. Gökçekaya ekran tasarımı

**Saha tipi:** klasik / mevcut rezervuar kullanan PDHES
**Ana amaç:** hızlı fizibiliteye taşınabilir varlık MVP’si

### Harita görünümü

```text
üst rezervuar: 800 m HWL referanslı konsept alan
alt rezervuar: Gökçekaya mevcut rezervuarı
su yolu: yaklaşık 4,05 km
yeraltı güç evi: egg-shape kavern sembolü
penstock: iki ana hat
ünite: dört pompa-türbin
şalt: mevcut HES şaltına yakın bağlantı
380 kV bağlantı: yaklaşık rota
```

### Sağ panel kartları

```text
Kurulu güç: 1.400 MW
Enerji: 9,8 GWh
Head: 379,5 m
Aktif hacim: 10,8 Mm³
Su yolu: 4,05 km
Skor: 84
Konsept güveni: JICA/reference based
Ana risk: iletim takviyesi + ayrıntılı jeoloji
```

Rapora göre Gökçekaya, 379,5 m head, 10,8 milyon m³ efektif hacim ve 4,05 km toplam su yolu ile Türkiye’de hızlı yeniden canlandırılabilir en güçlü klasik adaydır.  JICA’nın Gökçekaya için adjustable speed pumped-storage projesi kaydı da bu sahayı peak demand growth ve şebeke stabilizasyonu amacıyla konumlandırıyor. ([jica.go.jp][9])

# 9. Taşucu–Gülnar ekran tasarımı

**Saha tipi:** deniz suyu / ocean-PSH
**Ana amaç:** farklılaştırıcı yazılım MVP’si ve kıyı tarama modülü

### Harita görünümü

```text
kıyı 1 km grid
deniz alt rezervuar
700–900 m üst rezervuar zonu
tünel ağırlıklı su yolu
kıyı intake/outfall
yeraltı güç evi
154/380 kV koridor bağlantısı
korozyon / liner / biofouling risk zonları
kıyı izinleri paneli
```

### Sağ panel kartları

```text
Kurulu güç: 600 MW
Enerji: 4,8 GWh
Head: ~780 m
Su yolu: ~9,5 km
CAPEX: deniz suyu primi dahil
Skor: 79
Konsept güveni: GIS inferred + needs field verification
Ana risk: karst + kıyı izinleri + liner + korozyon
```

Raporda Taşucu–Gülnar deniz suyu konsepti için ilk optimum nokta olarak veriliyor; gerekçe yüksek düşü, daha yönetilebilir sosyal çatışma, Mersin/Akkuyu eksenine stratejik yakınlık, Akdeniz güneş-rüzgâr hibrit potansiyeli ve Karaburun/Datça’ya göre ölçeklenebilirliktir. 

# 10. Teknoloji haritası

## 10.1 Frontend

| İhtiyaç                                  | Önerilen teknoloji                 |
| ---------------------------------------- | ---------------------------------- |
| SPA / web uygulaması                     | Next.js veya React                 |
| Temel harita                             | MapLibre GL JS                     |
| Ticari uydu / gelişmiş stil opsiyonu     | Mapbox GL JS                       |
| Heatmap, arc, grid, yoğun analiz katmanı | deck.gl                            |
| 3D terrain / dijital ikiz                | CesiumJS                           |
| Sahaya özel 3D komponentler              | Three.js                           |
| Grafikler                                | Apache ECharts veya Recharts       |
| UI sistemi                               | Tailwind + shadcn/ui               |
| Timeline                                 | custom React timeline              |
| PDF/rapor export                         | server-side PDF render / Puppeteer |

## 10.2 Backend

| İhtiyaç                | Önerilen teknoloji                                    |
| ---------------------- | ----------------------------------------------------- |
| API                    | FastAPI veya NestJS                                   |
| Coğrafi veritabanı     | PostgreSQL + PostGIS                                  |
| Raster işleme          | GDAL, Rasterio, rio-tiler                             |
| Vektör tile            | Tegola, pg_tileserv, Martin veya Tippecanoe + PMTiles |
| Asenkron işler         | Celery / RQ / Temporal                                |
| Kuyruk                 | Redis                                                 |
| Dosya/uydu/DEM saklama | S3 / MinIO / Cloudflare R2                            |
| Kimlik ve rol          | Keycloak / Auth0 / Supabase Auth                      |
| İş akışı               | Prefect / Airflow                                     |
| RAG / doküman arama    | OpenSearch / pgvector / Weaviate                      |

## 10.3 GIS / veri işleme

```text
GeoPandas
Shapely
Rasterio
xarray
WhiteboxTools
GRASS GIS
QGIS processing modelleri
PostGIS raster/vector functions
```

## 10.4 Simülasyon

| Simülasyon                          | Teknoloji                                                       |
| ----------------------------------- | --------------------------------------------------------------- |
| Enerji dispatch optimizasyonu       | Pyomo / OR-Tools                                                |
| Şebeke yük akışı ön analizi         | pandapower                                                      |
| Piyasa gelir senaryosu              | Python pandas + optimization                                    |
| Hidrolik ön boyutlandırma           | custom Python model                                             |
| Su darbesi / transient ileri analiz | uzman mühendislik yazılımı veya OpenModelica tabanlı özel model |
| Finansal Monte Carlo                | Python / NumPy / scipy                                          |

## 10.5 AI katmanı

AI burada “her şeyi bilen model” değil, veri çıkarım ve karar destek katmanı olmalı.

Görevleri:

```text
rapor/PDF okuma
JICA/DSİ/TEİAŞ/EPİAŞ dokümanlarından parametre çıkarma
saha için kanıt kartı oluşturma
“neden bu saha?” açıklaması yazma
riskleri sınıflandırma
due diligence checklist üretme
3D layout için component JSON üretme
yatırım komitesi özeti oluşturma
```

# 11. Veri modeli

Ana tablolar:

```text
projects
candidate_sites
upper_reservoir_candidates
lower_reservoirs
reservoir_pairs
transmission_lines
substations
grid_capacity_zones
risk_layers
market_prices
ancillary_service_prices
project_components
simulation_runs
capex_runs
timeline_events
evidence_sources
user_annotations
```

Her `candidate_site` şu alanlara sahip olmalı:

```text
site_id
name
concept_type
lat
lon
province
region
upper_elevation
lower_elevation
net_head
waterway_length
head_length_ratio
active_volume
power_mw
energy_gwh
grid_distance
capex
annual_revenue
payback
technical_score
grid_score
environmental_score
social_score
total_score
confidence_level
```

Her `project_component` şu şekilde tutulmalı:

```text
component_id
site_id
component_type
geometry
height
elevation
label
source_type
confidence
cost_category
risk_category
```

# 12. Katman ve ekran hiyerarşisi

## Türkiye görünümü

```text
Amaç:
Türkiye genelinde potansiyel yoğunluğu görmek

Göster:
- aday heatmap
- kıyı-grid
- klasik rezervuar eşleşmeleri
- 154/380 kV omurga
- bölgesel risk
- skor lejantı
```

## Bölge görünümü

```text
Amaç:
Akdeniz / Sakarya / Karadeniz / İç Anadolu gibi bölgesel karşılaştırma

Göster:
- ilk 20 aday
- şebeke mesafesi
- korunan alan çakışmaları
- deprem / heyelan overlay
- access road
```

## Finalist saha görünümü

```text
Amaç:
Yatırımcıya saha mantığını göstermek

Göster:
- üst-alt rezervuar
- tünel
- güç evi
- şalt
- iletim bağlantısı
- CAPEX
- timeline
- risk register
```

## 3D mühendislik görünümü

```text
Amaç:
Teknik tasarım simülasyonu

Göster:
- terrain
- üst rezervuar hacmi
- su seviyesi
- tünel kesiti
- penstock
- surge tank
- basınç profili
- pompa/türbin modu
```

# 13. “AI Inspector” paneli

LinkedIn uygulamasındaki “AI” düğmesine benzer bir panel olmalı.

Kullanıcı doğal dilde sorar:

```text
“Gökçekaya neden Altınkaya’dan daha hızlı?”
“Taşucu–Gülnar’da en kritik izin riski nedir?”
“Bu sahada 600 MW yerine 800 MW yaparsak tünel ve hacim nasıl değişir?”
“En yakın 380 kV bağlantı nerede?”
“Korunan alan çakışmasını göster.”
“CAPEX’i P90 senaryoda hesapla.”
```

AI paneli cevap verirken her cevabı şu formatta verir:

```text
Yanıt
Kaynaklar
Güven seviyesi
Haritada göster
Hesaplamayı aç
DD checklist’e ekle
```

# 14. Yatırım paneli

Sağ panelde sürekli görünen yatırım kartları:

```text
Kapasite
MW / GWh

Teknik
head / su yolu / aktif hacim

Şebeke
en yakın TM / bağlantı mesafesi / takviye riski

Finans
CAPEX / yıllık gelir / geri ödeme / IRR

Risk
jeoloji / deprem / çevre / izin / sosyal kabul

Aksiyon
ön görüş / saha ziyareti / topo / jeoteknik / ÇED
```

# 15. Simülasyon senaryoları

## Senaryo 1: baz yatırım

```text
300 çevrim/yıl
%80–85 çevrim verimi
baz CAPEX
baz gelir
normal şebeke erişimi
```

## Senaryo 2: yüksek RES entegrasyonu

```text
daha fazla düşük fiyat saati
daha fazla pompaj
yüksek PFK/SFK yakalama
curtailment azaltımı
hibrit GES/RES premiumu
```

## Senaryo 3: riskli jeoloji

```text
tünel maliyeti artar
contingency artar
inşaat süresi uzar
CAPEX P90’a yaklaşır
```

## Senaryo 4: şebeke takviyesi gerekli

```text
bağlantı CAPEX artar
devreye giriş gecikir
N-1 riski yükselir
gelir başlangıcı ötelenir
```

## Senaryo 5: deniz suyu özel riski

```text
liner maliyeti artar
korozyon OPEX’i artar
kıyı izin süresi uzar
biofouling bakım programı eklenir
```

# 16. Minimum MVP önerisi

İlk sürümde gereksiz karmaşıklığa girilmemeli. En doğru MVP şudur:

```text
1. Türkiye haritası
2. 20 klasik + 20 deniz suyu aday
3. Gökçekaya ve Taşucu–Gülnar finalist 3D ekranı
4. skor motoru
5. CAPEX / gelir ön hesap
6. risk overlay
7. timeline
8. PDF rapor export
```

**MVP hedefi:** yatırımcı veya yönetici ekranı açtığında 5 dakikada şu sorulara cevap almalı:

```text
Türkiye’de en iyi PDHES adayları nerede?
Neden Gökçekaya klasik tarafta öne çıkıyor?
Neden Taşucu–Gülnar deniz suyu tarafta farklılaştırıcı?
Bu sahaların MW/GWh/CAPEX/gelir/risk profili ne?
Haritada üst rezervuar, alt rezervuar, tünel ve şalt nerede durabilir?
Bir sonraki due diligence adımı ne?
```

# 17. Geliştirme fazları

## Faz 0 — Tasarım prototipi

Süre: 2–3 hafta

Çıktı:

```text
Figma ekranları
veri modeli
katman listesi
Gökçekaya mock layout
Taşucu–Gülnar mock layout
yatırım paneli
timeline paneli
```

## Faz 1 — Web MVP

Süre: 6–8 hafta

Çıktı:

```text
React/Next.js arayüz
MapLibre harita
PostGIS aday veri tabanı
GeoJSON katmanlar
3D fill-extrusion
aday karşılaştırma
basit CAPEX/gelir motoru
```

## Faz 2 — GIS scoring engine

Süre: 8–12 hafta

Çıktı:

```text
DEM otomatik işleme
kıyı-grid tarama
klasik rezervuar eşleştirme
risk overlay
şebeke mesafesi
skor motoru
```

## Faz 3 — 3D terrain ve simülasyon

Süre: 10–16 hafta

Çıktı:

```text
Cesium terrain
3D Tiles
uzunlamasına kesit
pompa/türbin animasyonu
hacim/seviye simülasyonu
Monte Carlo CAPEX
```

## Faz 4 — Kurumsal yatırım ürünü

Süre: 3–6 ay

Çıktı:

```text
kullanıcı rolleri
AI Inspector
RAG kaynak arama
otomatik yatırım komitesi raporu
TEİAŞ/EPİAŞ veri güncelleme
due diligence workflow
yorum / görev / onay sistemi
```

# 18. Ürünün ayırt edici noktası

Bu yazılım sıradan bir harita değildir. Ürünün farklılaştırıcı tarafı şu dört katmanı tek ekranda birleştirmesidir:

```text
1. GIS tarama
Türkiye genelinde aday bulur.

2. Mühendislik çıkarımı
Head, su yolu, hacim, güç ve enerji hesaplar.

3. Yatırım zekâsı
CAPEX, gelir, geri ödeme ve timeline üretir.

4. 3D procedural layout
Sahada neyin nereye yapılabileceğini görselleştirir.
```

Raporun nihai sonucu da bu ürün stratejisini destekliyor: **ürün-MVP ile varlık-MVP aynı şey değildir; ürün tarafında deniz suyu kıyı taraması farklılaştırır, sermaye tarafında klasik PSP daha hızlı yatırıma götürür.** 

# 19. Nihai önerilen ekran seti

## Ana ekranlar

```text
1. Türkiye Radar
Türkiye geneli aday tarama ve heatmap

2. Adaylar
Klasik ve deniz suyu saha karşılaştırma tablosu

3. Harita / 3D
PDHES konsept yerleşimi, katmanlar, 3D bloklar, terrain

4. Simülasyon
Enerji, dispatch, gelir, CAPEX, risk senaryoları

5. Due Diligence
İzin, jeoteknik, TEİAŞ, ÇED, saha ziyareti workflow’u

6. Rapor
Yatırım komitesi özeti, PDF/PPT export

7. Ayarlar
Skor ağırlıkları, veri kaynakları, finansal varsayımlar
```

## Harita / 3D ekranının final görünümü

```text
Sol panel:
- Konsept: klasik / deniz suyu
- Adaylar: Gökçekaya, Altınkaya, Taşucu–Gülnar, Bozyazı–Anamur
- Katmanlar: DEM, şebeke, risk, çevre, piyasa
- AI Inspector

Orta:
- 2D/3D harita
- üst rezervuar
- alt rezervuar
- tünel / penstock
- güç evi
- surge tank
- şalt
- iletim hattı
- risk buffer

Sağ panel:
- MW / GWh / head
- CAPEX / gelir / geri ödeme
- risk skoru
- kaynak güven seviyesi
- proje timeline
- go/no-go notu

Alt panel:
- uzunlamasına kesit
- pompa/türbin animasyonu
- fiyat-dispatch grafiği
- CAPEX kırılımı
```

# 20. Sonuç

Bu ürünün özü şu olmalı:

**Türkiye’de PDHES sahalarını sadece listeleyen değil, “neden burada, ne kadar büyük, hangi riskle, hangi şebeke bağlantısıyla, hangi gelir modeliyle ve sahada nasıl görünebilir?” sorularını harita üstünde cevaplayan yatırım istihbaratı yazılımı.**

İlk ürün stratejisi:

```text
Varlık MVP:
Gökçekaya klasik PDHES

Yazılım MVP:
Taşucu–Gülnar deniz suyu kıyı taraması

Ana teknoloji:
PostGIS + MapLibre + deck.gl + Cesium + AI Inspector

Ana farklılaştırıcı:
3D prosedürel PDHES layout + yatırım timeline + kaynak güven skoru
```

[1]: https://dataspace.copernicus.eu/explore-data/data-collections/copernicus-contributing-missions/collections-description/COP-DEM?utm_source=chatgpt.com "Copernicus DEM - Global and European Digital Elevation Model | Copernicus Data Space Ecosystem"
[2]: https://afad.gov.tr/turkiye-deprem-tehlike-haritasi?utm_source=chatgpt.com "T.C. İçişleri Bakanlığı Afet ve Acil Durum Yönetimi Başkanlığı - Türkiye Deprem Tehlike Haritası"
[3]: https://www.nrel.gov/water/pumped-storage-hydropower-cost-model.html?utm_source=chatgpt.com "Pumped Storage Hydropower Cost Model | Water Research | NREL"
[4]: https://www.teias.gov.tr/yan-hizmetler?utm_source=chatgpt.com "Yan Hizmetler"
[5]: https://www.epias.com.tr/wp-content/uploads/2025/04/Mart-2025-Elektrik-Piyasalari-Raporu.pdf?utm_source=chatgpt.com "ELEKTRİK PİYASALARI"
[6]: https://maplibre.org/maplibre-gl-js/docs?utm_source=chatgpt.com "MapLibre GL JS"
[7]: https://deck.gl/docs/api-reference/mapbox/overview?utm_source=chatgpt.com "@deck.gl/mapbox | deck.gl"
[8]: https://cesium.com/learn/cesiumjs-learn/cesiumjs-terrain/?utm_source=chatgpt.com "Visualizing 3D Terrain – Cesium"
[9]: https://www.jica.go.jp/english/about/policy/environment/id/europe/a_b_fi/turkey/c8h0vm000090rdja.html?utm_source=chatgpt.com "Project for Adjustable Speed Type Pumped-Storage Hydroelectric Power Plant Construction ｜ About JICA - JICA"
