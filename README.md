# Türkiye Pompaj Depolamalı Hidroelektrik Santral (PDHES) Potansiyeli

Türkiye'deki pompaj depolamalı hidroelektrik santral (PSPP / PDHES) adaylarını veri, harita, kavramsal 3D yerleşim, risk notları ve senaryo hesaplarıyla inceleyen açık web demosu.

> **ÖNEMLİ BİLGİLENDİRME:** Bu uygulama bir yatırım tavsiyesi, fizibilite raporu, mühendislik tasarımı veya resmi TEİAŞ/DSİ/EPDK/ÇED görüşü **değildir**. Eğitim ve masaüstü ön inceleme demosu niteliğindedir. Harita altlıkları, topografya ve şebeke gibi arazi verileri 3. taraf açık kaynak servislerden (OpenStreetMap, MapLibre, Copernicus DEM) derlenmektedir. Koordinatlar, teknik değerler ve ekonomik varsayımlar kavramsal nitelik taşır ve sadece konsept doğrulama (PoC) amaçlı kullanılabilir.

---

## 1. Proje Özeti ve Amacı

Bu proje, Türkiye'nin güneş ve rüzgar enerjisi kapasitesindeki artışa paralel olarak şebeke esnekliği (flexibility) sağlamak için gereken Pompaj Depolamalı Hidroelektrik Santrallerinin potansiyelini teknik, bölgesel ve kavramsal seviyede sergilemek amacıyla hazırlanmıştır. 

Geleneksel rapor formatlarının ötesine geçerek, **veri görselleştirme, 3D arazi modelleme, coğrafi bilgi sistemi (GIS) ve dinamik senaryo hesaplamalarını** tek bir web uygulamasında birleştiren interaktif bir ansiklopedi ve analiz platformu olarak tasarlanmıştır.

Platform üzerinde şu anda **19 adet Türkiye adayı** (Kızılırmak, Sakarya, Fırat, Dicle ve çeşitli deniz/kıyı bölgelerinde) ve **1 adet dünya ölçekli örnek tesis** (Presenzano - İtalya) olmak üzere toplam 20 saha incelenebilir durumdadır.

---

## 2. Uygulama Mimarisi ve Teknoloji Yığını

Yayımlanan uygulama `app/` klasörü altındaki modern bir Vite + React + TypeScript projesidir. (Kök dizindeki eski HTML prototipi sadece tarihsel referans amacıyla tutulmaktadır). Uygulama tamamen istemci taraflı (client-side) çalışır ve statik bir sayfa olarak sunulur (GitHub Pages veya benzeri bir servisle).

- **Çerçeve (Framework):** React 18, Vite, TypeScript
- **Stil ve Arayüz (Styling/UI):** Saf CSS (Vanilla CSS) ve modern CSS Grid/Flexbox sistemleri, değişken odaklı (CSS variables) dinamik "Dark Mode" / "Light Mode" desteği.
- **Durum Yönetimi (State Management):** Zustand (Saha verilerini ve arayüz durumlarını merkezi yönetmek için).
- **Harita Alt Yapısı (Mapping):** MapLibre GL JS, React Map GL.
- **3D Arazi ve Yerleşim Modeli (3D Rendering):** Three.js, React Three Fiber (R3F), Drei (Kavramsal tesislerin, cebri boruların, güç evinin ve türbinlerin prosedürel 3D üretimi).
- **Veri Kaynağı:** Tüm tesis metadataları `app/public/data.json` içinde statik olarak saklanır. Çalışma zamanında asenkron olarak yüklenir.

---

## 3. Detaylı Özellikler (Features)

### 3.1. Kapsamlı PDHES Ansiklopedisi (PDHES Nedir?)
Sistemin ilk karşılama modülüdür. 
- PDHES çalışma mantığı, 
- "Açık Devre", "Kapalı Devre", "Deniz Suyu (Sea Water)" ve "Mevcut Rezervuar" konseptlerinin avantaj ve dezavantajları.
- Dünyadan öne çıkan uygulamalar (Bath County, Fengning, Linthal, vb.)
- Teknik terimler ve kısaltmalar sözlüğü (Glossary) ile interaktif bir rehber sunar.
- **Not:** Yeni saha ekleme standartları gibi repo-içi geliştirici metinleri arayüzden çıkarılmış, salt bilgilendirici ve profesyonel bir tasarıma geçilmiştir. Sayfa `1200px` simetrik grid düzeniyle geniş ekranlarda yüksek okunabilirlik sağlar.

### 3.2. Dinamik Saha Listesi ve Veri Özeti (Datalar Sekmesi)
- Seçilen sahaya ait **Skor, Kapasite (MW), Enerji (GWh), Yatırım Miktarı (CAPEX), Gelir (Revenue), Geri Ödeme Süresi, Düşü (Head), Su Yolu Uzunluğu ve Aktif Hacim** gibi temel parametreler özet kartı halinde asimetrik ve temiz bir grid içinde sunulur.
- Kapasite (MW), puan ve konsepte göre sıralama/filtreleme yeteneklerine sahip veri tablosu yer alır. 

### 3.3. Harita Entegrasyonu (MapLibre ve GIS)
- Türkiye genelindeki tesisler MapLibre tabanlı etkileşimli bir haritada gösterilir.
- Aday tesisler haritada statik daireler (circles) değil, modern **ikonik markerlar** olarak temsil edilir. Üzerlerine gelindiğinde (hover) saha isimleri görünür.
- Tıklanan sahanın detayları harita üzerinde bir pop-up içinde gösterilir. (Karanlık/Aydınlık moda tam uyumlu pop-up tasarımı).
- Tıklama ile `flyTo` / `easeTo` animasyonları tetiklenerek kamera hedefe pitch/bearing ayarlamaları ile zum yapar.
- Sağ panelde o sahaya özel tesis yerleşim planı (üst rezervuar, alt rezervuar, güç evi, şalt sahası) animasyonlu bağlantı hatlarıyla (svg/canvas üzerinde) canlandırılır.
- "Kavramsal Tesis Yerleşimi Göster" butonuyla seçilen sahanın harita üzerinde alt rezervuar, güç evi ve üst rezervuar koordinatları arası topolojik bağlantıları çizilir.

### 3.4. 3D Kavramsal Yerleşim (ThreeDPage)
Projenin en teknik ve görsel bölümlerinden biridir:
- **Prosedürel Arazi (Terrain):** Seçilen sahanın özelliklerine göre orman, kayalık, vadi ve tepe topolojisini React Three Fiber ile eş zamanlı çizer. Arazinin şeffaflığı değiştirilerek yeraltı yapılarının (güç evi, tüneller) görülmesi sağlanır. Arazideki yapılar (şalt, güç evi vs.) düşü ve boru uzunluğuna göre gerçek arazi kotlarına (getTerrainHeight) otomatik hizalanır.
- **Rezervuar Dinamikleri:** Üst ve alt rezervuarlar 3D ortamda gerçekçi su efektleri (MeshPhysicalMaterial) ile dalgalanma efekti verir. Santral çalışırken (üretim/pompa modlarında) su yüzeylerinde dönme (vortex) ve debi dalgalanmaları canlandırılır. Deniz suyu projeleri için açık deniz kıyı yapıları oluşturulur.
- **Güç Evi ve Tüneller (Powerhouse & Penstock):** Dağın içine kazılmış devasa bir kavern (cavern) ve içinde dönen francis pompa-türbin jeneratör üniteleri detaylandırılmıştır. Cebri borularda ve yeraltı kuyruk suyu tünelinde su akış hızını gösteren dinamik akış animasyonları (particle flow) mevcuttur.
- **Üretim / Pompalama Simülasyonu:** Kullanıcı mod değiştirdiğinde, türbinlerin dönüş yönü değişir ve borulardaki su akış parçacıkları üretimi (aşağı doğru) veya pompalamayı (yukarı doğru) simüle eder. Şalt sahasındaki anlık MW gücü, aktif ünite sayısına göre otomatik hesaplanarak 3D ekran üzerinde dinamik olarak gösterilir.
- Aktif ünite sayısı canlı olarak artırılıp azaltılabilir.

### 3.5. Ekonomi ve Enerji Hesaplamaları (Calculations)
Canlı ve tamamen değiştirilebilir bir finansal / mühendislik hesap makinesidir:
- **Formüller:** 
  - Enerji: `E (GWh) = (Ünite Sayısı × Birim Kapasite) × Süre / 1000`
  - CAPEX: Sivil İşler (Civil) + Elektromekanik + Şebeke Bağlantısı kalemleri alt kırılımlarla (`$/kW` bazında) hesaplanır. Tünel uzunluğu, düşü ve güç kapasitesi baz alınır.
- **Senaryolar:** Kullanıcı birim maliyetleri, arbitraj spread farkını (`$/MWh`), kapasite mekanizması desteklerini ve döviz bazlı iskonto oranını (WACC) değiştirerek tesisin IRR (İç Verim Oranı) ve NPV (Net Bugünkü Değer) hesaplamasını saniyeler içinde görebilir.
- Tüm hesaplamalar açık bir biçimde arayüzde kırılımlarıyla listelenir, "kara kutu" mantığından uzaktır.

---

## 4. Geliştirme, Kurulum ve Test (Development & Setup)

Geliştiriciler için ortam hazırlığı oldukça basittir. Node.js (v18+) gerektirir.

### 4.1. Kurulum ve Çalıştırma
```bash
# Repoyu klonlayın
git clone https://github.com/murathany90/pdhes.git

# app dizinine geçin
cd pdhes/app

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

### 4.2. Test ve Kalite Güvencesi (QA)
Sistem üzerinde TypeScript uyumluluğu, linting kuralları ve testler mevcuttur. Vite tabanlı build sistemi esnasında tüm tipler doğrulanır.

```bash
# Sadece TypeScript hata kontrolü yapmak için:
npm run typecheck

# Uygulamayı production için derlemek için (typecheck başarılıysa geçer):
npm run build
```
Derlenmiş `dist/` klasörü doğrudan herhangi bir statik sunucuda veya GitHub Pages üzerinde barındırılabilir.

---

## 5. Veri Kayıt Mantığı ve Meta-Veri Standardı (Data Schema)

Yeni saha ekleneceği veya mevcut sahalar güncelleneceği zaman veriler `app/public/data.json` dosyasına JSON formatında eklenir. Her kayıt `Site` tipinde (Bkz: `app/src/types/site.ts`) olmalıdır.

Örnek zorunlu alanlar:
- `id`: Benzersiz kimlik (örn. `gokcekaya`).
- `name`: Görünen proje adı.
- `concept`: `classic`, `sea`, `open_loop` gibi bir değer (canonical pdhesType).
- `lat` / `lon`: Haritada ikonun konacağı merkez koordinatlar.
- `powerMW` / `energyGWh` / `head` vb.: Temel mühendislik verileri.
- `confidence`: Kaynak güveni (gis_inferred, reference_based vb.)
- `layout3D`: Haritada saha çizgilerinin çizilmesi için gereken koordinat dizisi (upper, lower, power, surge, vb.).

---

### 20 Aday Sahanın Özeti

| İsim | Bölge | Kapasite (MW) | Enerji (GWh) | Düşü (m) | Tünel Uz. (km) | CAPEX (Milyar $) | Gelir (Milyon $) | Geri Ödeme (Yıl) | Tip |
|---|---|---|---|---|---|---|---|---|---|
| Gökçekaya PSPP | Sakarya havzasi - Gokcekaya Baraji | 1400 | 9.8 | 379.5 | 4.05 | 2.59 | 252 | 10.3 | Klasik kapalı devre / mevcut rezervuar |
| Taşucu-Gülnar Deniz Suyu PSPP | Mersin - Taşucu/Gülnar kıyı kuşağı | 600 | 4.8 | 780 | 9.5 | 1.44 | 81 | 17.8 | Deniz suyu / kıyı tipi |
| Altınkaya PSPP | Kizilirmak havzasi - Altinkaya Baraji | 1800 | 12.6 | 611 | 5.5 | 3.42 | 297 | 11.5 | Klasik / stratejik ölçek |
| Oymapınar Off-river PSPP | Antalya - Manavgat/Oymapinar | 800 | 6.4 | 420 | 4.8 | 1.48 | 128 | 11.6 | Klasik / mevcut HES çevresi |
| Karaburun Sırtı Deniz Suyu PSPP | Izmir - Karaburun yarımadası | 500 | 4 | 620 | 6.5 | 1.25 | 70 | 17.9 | Deniz suyu / görsel etki hassas |
| Bozyazı-Anamur Deniz Suyu PSPP | Mersin - Bozyazi/Anamur kıyı daglari | 700 | 5.6 | 900 | 11 | 1.78 | 89.6 | 19.9 | Deniz suyu / yüksek düşülü kıyı tipi |
| Ordu-Perşembe Arka Sırt Deniz Suyu PSPP | Ordu - Persembe/Altinordu arka sırtları | 350 | 2.8 | 550 | 8 | 0.84 | 38.5 | 21.8 | Deniz suyu / Karadeniz kıyı tipi |
| Menzelet Off-river PSPP | Ceyhan havzasi - Menzelet Baraji | 900 | 6.3 | 450 | 5.5 | 1.71 | 139.5 | 12.3 | Klasik / mevcut rezervuar destekli off-river |
| Hasan Uğurlu-Suat Uğurlu PSPP | Yesilirmak havzasi - Hasan Ugurlu/Suat Ugurlu | 700 | 4.9 | 390 | 4 | 1.26 | 105 | 12 | Klasik / Karadeniz mevcut hidro omurgası |
| Sarıyar-Gökçekaya Augmentasyon PSPP | Sakarya havzasi - Sariyar/Gokcekaya koridoru | 700 | 5.6 | 300 | 6 | 1.26 | 105 | 12 | Stratejik hibrit / Sakarya rezervuar augmentasyonu |
| Gazipaşa Kıyı-Toros Deniz Suyu PDHES | Gazipaşa kıyı - Toros arka sırtı | 420 | 3.2 | 640 | 7.4 | 1.05 | 58 | 18.1 | Makro Deniz PDHES / Akdeniz kıyı-sirt |
| Finike-Kumluca Deniz Suyu PDHES | Finike-Kumluca kıyı ve Beydağları eteği | 520 | 4 | 720 | 8.6 | 1.32 | 70 | 18.9 | Makro Deniz PDHES / bati Antalya |
| Samandağ-Musa Dağı Deniz Suyu PDHES | Samandağ kıyısi - Musa Dağı | 300 | 2.1 | 560 | 6.8 | 0.82 | 42 | 19.5 | Makro Deniz PDHES / Dogu Akdeniz |
| Edremit-Kazdağı Güney Eteği Deniz Suyu PDHES | Edremit Körfezi - Kazdağı güney eteği | 260 | 1.9 | 520 | 5.9 | 0.7 | 36 | 19.4 | Makro Deniz PDHES / Körfez-Kazdağı |
| Datça Güney Sırtı Deniz Suyu PDHES | Datça yarımadası güney sırtı | 180 | 1.2 | 430 | 4.7 | 0.52 | 26 | 20 | Makro Deniz PDHES / Ege yarimada |
| Gökçeada Mikro Deniz PDHES Pilot | Gökçeada mikro şebekesi | 20 | 0.1 | 230 | 1.8 | 0.09 | 3.2 | 28.1 | Mikro Deniz PDHES / ada pilotu |
| Bozcaada Mikro Deniz PDHES Pilot | Bozcaada mikro şebekesi | 12 | 0.06 | 150 | 1.2 | 0.06 | 2 | 30 | Mikro Deniz PDHES / ada pilotu |
| Afyon-Sultandağı Kapalı Çevrim Müstakil PDHES | Sultandağı etekleri kapalı Çevrim konsepti | 320 | 2.4 | 520 | 4.9 | 0.86 | 42 | 20.5 | Müstakil PDHES / kapalı Çevrim |
| Kayseri-Yahyalı Kapalı Çevrim Müstakil PDHES | Yahyalı-Aladağlar etekleri kapalı Çevrim konsepti | 450 | 3.2 | 650 | 5.8 | 1.15 | 56 | 20.5 | Müstakil PDHES / kapalı Çevrim |
| Presenzano (Domenico Cimarosa) PSPP | Caserta, Campania, İtalya | 1000 | 7.0 | 498.0 | 0.26 | 1.2 | 110 | 10.9 | Kapalı Çevrim Pompaj Depolamalı HES (İtalya) |

### Aday Sahalar Detaylı İnceleme

#### 1. Gökçekaya PSPP (Klasik kapalı devre / mevcut rezervuar)
- **Bölge:** Sakarya havzasi - Gokcekaya Baraji
- **Puan:** 84/100
- **Kapasite (MW):** 1400 MW | **Enerji (GWh):** 9.8 GWh
- **Düşü:** 379.5 m | **Tünel Uzunluğu:** 4.05 km | **Aktif Hacim:** 10.8 Milyon m³
- **Ekonomi:** CAPEX: $2.59 Milyar | Yıllık Gelir: $252 Milyon | Geri Ödeme: 10.3 Yıl
- **Şebeke Bağlantısı:** 7.1 km uzakta. 
- **Üst Rezervuar:** ~800 m HWL üst rezervuar
- **Alt Rezervuar:** Gökçekaya Barajı / mevcut HES şaltı
- **Proje Özeti (Tez):** İlk 24 ayda fizibiliteye taşınabilecek en hızlı klasik PSPP adayı.
- **Riskler:** İletim takviyesi, ayrıntılı jeoloji, mevcut HES işletme rejimi, kamulaştırma
- **Bileşen Detayları:**
  - **Üst Rezervuar:** 801m kot, 38m gövde yüksekliği, kil çekirdekli set ve yerel geomembran alternatifi
  - **Cebri Boru (Penstock):** Çap: 8.2m, Uzunluk: 4050m, Sınıf: ~37 bar statik basınç sınıfı
  - **Güç Evi:** 6 ünite, ayarlanabilir hızlı Francis pompa-türbin. Boyutlar: 36m(G) x 266m(U) x 39m(Y)

#### 2. Taşucu-Gülnar Deniz Suyu PSPP (Deniz suyu / kıyı tipi)
- **Bölge:** Mersin - Taşucu/Gülnar kıyı kuşağı
- **Puan:** 79/100
- **Kapasite (MW):** 600 MW | **Enerji (GWh):** 4.8 GWh
- **Düşü:** 780 m | **Tünel Uzunluğu:** 9.5 km | **Aktif Hacim:** 2.51 Milyon m³
- **Ekonomi:** CAPEX: $1.44 Milyar | Yıllık Gelir: $81 Milyon | Geri Ödeme: 17.8 Yıl
- **Şebeke Bağlantısı:** 0.7 km uzakta. 
- **Üst Rezervuar:** 700-900 m bandında kaplamalı üst rezervuar
- **Alt Rezervuar:** Akdeniz - deniz alt rezervuarı
- **Proje Özeti (Tez):** Deniz suyu kıyı taraması ve farklılaştırıcı aday portföyü için en iyi ilk odak.
- **Riskler:** Karst, kıyı izinleri, liner/sızdırmazlık, korozyon ve biyofouling
- **Bileşen Detayları:**
  - **Üst Rezervuar:** 780m kot, 44m gövde yüksekliği, HDPE geomembran + beton koruma kaplaması
  - **Cebri Boru (Penstock):** Çap: 6.2m, Uzunluk: 9500m, Sınıf: ~76 bar statik basınç sınıfı
  - **Güç Evi:** 3 ünite, Francis pompa-türbin. Boyutlar: 27m(G) x 188m(U) x 44m(Y)

#### 3. Altınkaya PSPP (Klasik / stratejik ölçek)
- **Bölge:** Kizilirmak havzasi - Altinkaya Baraji
- **Puan:** 81/100
- **Kapasite (MW):** 1800 MW | **Enerji (GWh):** 12.6 GWh
- **Düşü:** 611 m | **Tünel Uzunluğu:** 5.5 km | **Aktif Hacim:** 8.4 Milyon m³
- **Ekonomi:** CAPEX: $3.42 Milyar | Yıllık Gelir: $297 Milyon | Geri Ödeme: 11.5 Yıl
- **Şebeke Bağlantısı:** 1.5 km uzakta. 
- **Üst Rezervuar:** Yüksek kotlu üst rezervuar
- **Alt Rezervuar:** Altınkaya rezervuarı
- **Proje Özeti (Tez):** Stratejik ölçekte çok güçlü; ancak 380 kV takviye ihtiyacı ilk sprint hızını düşürür.
- **Riskler:** Bölgesel iletim güçlendirmesi, yüksek CAPEX, uzun geliştirme takvimi
- **Bileşen Detayları:**
  - **Üst Rezervuar:** 691m kot, 46m gövde yüksekliği, kil çekirdekli set ve yerel geomembran alternatifi
  - **Cebri Boru (Penstock):** Çap: 8.2m, Uzunluk: 5500m, Sınıf: ~60 bar statik basınç sınıfı
  - **Güç Evi:** 6 ünite, ayarlanabilir hızlı Francis pompa-türbin. Boyutlar: 36m(G) x 266m(U) x 42m(Y)

#### 4. Oymapınar Off-river PSPP (Klasik / mevcut HES çevresi)
- **Bölge:** Antalya - Manavgat/Oymapinar
- **Puan:** 76/100
- **Kapasite (MW):** 800 MW | **Enerji (GWh):** 6.4 GWh
- **Düşü:** 420 m | **Tünel Uzunluğu:** 4.8 km | **Aktif Hacim:** 6.21 Milyon m³
- **Ekonomi:** CAPEX: $1.48 Milyar | Yıllık Gelir: $128 Milyon | Geri Ödeme: 11.6 Yıl
- **Şebeke Bağlantısı:** 11.6 km uzakta. 
- **Üst Rezervuar:** Off-river üst havza
- **Alt Rezervuar:** Oymapınar mevcut rezervuar çevresi
- **Proje Özeti (Tez):** Mevcut HES altyapısı ve kısa su yolu nedeniyle güçlü üçüncü seçenek.
- **Riskler:** Turizm baskısı, çevresel akış, su rejimi koordinasyonu
- **Bileşen Detayları:**
  - **Üst Rezervuar:** 600m kot, 34m gövde yüksekliği, kil çekirdekli set ve yerel geomembran alternatifi
  - **Cebri Boru (Penstock):** Çap: 6.2m, Uzunluk: 4800m, Sınıf: ~41 bar statik basınç sınıfı
  - **Güç Evi:** 3 ünite, Francis pompa-türbin. Boyutlar: 27m(G) x 188m(U) x 39m(Y)

#### 5. Karaburun Sırtı Deniz Suyu PSPP (Deniz suyu / görsel etki hassas)
- **Bölge:** Izmir - Karaburun yarımadası
- **Puan:** 72/100
- **Kapasite (MW):** 500 MW | **Enerji (GWh):** 4 GWh
- **Düşü:** 620 m | **Tünel Uzunluğu:** 6.5 km | **Aktif Hacim:** 2.63 Milyon m³
- **Ekonomi:** CAPEX: $1.25 Milyar | Yıllık Gelir: $70 Milyon | Geri Ödeme: 17.9 Yıl
- **Şebeke Bağlantısı:** 14.5 km uzakta. 
- **Üst Rezervuar:** Karaburun sırtlarında üst rezervuar
- **Alt Rezervuar:** Ege Denizi
- **Proje Özeti (Tez):** Teknik olarak yakın yük merkezi premiumu sunar; izin ve sosyal kabul daha zor.
- **Riskler:** Turizm, korunan alan, görsel etki, imar baskısı
- **Bileşen Detayları:**
  - **Üst Rezervuar:** 620m kot, 36m gövde yüksekliği, HDPE geomembran + beton koruma kaplaması
  - **Cebri Boru (Penstock):** Çap: 5.2m, Uzunluk: 6500m, Sınıf: ~61 bar statik basınç sınıfı
  - **Güç Evi:** 2 ünite, Francis pompa-türbin. Boyutlar: 24m(G) x 162m(U) x 42m(Y)

#### 6. Bozyazı-Anamur Deniz Suyu PSPP (Deniz suyu / yüksek düşülü kıyı tipi)
- **Bölge:** Mersin - Bozyazi/Anamur kıyı daglari
- **Puan:** 76/100
- **Kapasite (MW):** 700 MW | **Enerji (GWh):** 5.6 GWh
- **Düşü:** 900 m | **Tünel Uzunluğu:** 11 km | **Aktif Hacim:** 2.54 Milyon m³
- **Ekonomi:** CAPEX: $1.78 Milyar | Yıllık Gelir: $89.6 Milyon | Geri Ödeme: 19.9 Yıl
- **Şebeke Bağlantısı:** 3.6 km uzakta. 
- **Üst Rezervuar:** ~900 m bandında kaplamalı kıyı üst rezervuarı
- **Alt Rezervuar:** Akdeniz - Anamur kıyısı deniz alt rezervuarı
- **Proje Özeti (Tez):** Taşucu sonrası ikinci Akdeniz deniz suyu finalisti; yüksek düşü güçlü enerji yoğunluğu sağlar, ancak kıyı-çevre ve bağlantı riski daha ağırdır.
- **Riskler:** Kıyı ekolojisi, uzun bağlantı hattı, deprem/heyelan, liner ve korozyon
- **Bileşen Detayları:**
  - **Üst Rezervuar:** 900m kot, 48m gövde yüksekliği, HDPE geomembran + beton koruma kaplaması
  - **Cebri Boru (Penstock):** Çap: 6.2m, Uzunluk: 11000m, Sınıf: ~88 bar statik basınç sınıfı
  - **Güç Evi:** 3 ünite, Francis pompa-türbin. Boyutlar: 27m(G) x 188m(U) x 45m(Y)

#### 7. Ordu-Perşembe Arka Sırt Deniz Suyu PSPP (Deniz suyu / Karadeniz kıyı tipi)
- **Bölge:** Ordu - Persembe/Altinordu arka sırtları
- **Puan:** 57/100
- **Kapasite (MW):** 350 MW | **Enerji (GWh):** 2.8 GWh
- **Düşü:** 550 m | **Tünel Uzunluğu:** 8 km | **Aktif Hacim:** 2.08 Milyon m³
- **Ekonomi:** CAPEX: $0.84 Milyar | Yıllık Gelir: $38.5 Milyon | Geri Ödeme: 21.8 Yıl
- **Şebeke Bağlantısı:** 0.3 km uzakta. 
- **Üst Rezervuar:** ~550 m bandında küçük kaplamalı üst rezervuar
- **Alt Rezervuar:** Karadeniz - Perşembe kıyısı deniz alt rezervuarı
- **Proje Özeti (Tez):** Karadeniz kıyısı için ürün kapsama alanını genişleten daha küçük ölçekli aday; yoğun yağış ve heyelan riski nedeniyle temkinli puanlanır.
- **Riskler:** Heyelan, yoğun yağış, kıyı yerleşimi, Karadeniz deniz koşulları
- **Bileşen Detayları:**
  - **Üst Rezervuar:** 550m kot, 32m gövde yüksekliği, HDPE geomembran + beton koruma kaplaması
  - **Cebri Boru (Penstock):** Çap: 5.2m, Uzunluk: 8000m, Sınıf: ~54 bar statik basınç sınıfı
  - **Güç Evi:** 2 ünite, Francis pompa-türbin. Boyutlar: 24m(G) x 162m(U) x 41m(Y)

#### 8. Menzelet Off-river PSPP (Klasik / mevcut rezervuar destekli off-river)
- **Bölge:** Ceyhan havzasi - Menzelet Baraji
- **Puan:** 74/100
- **Kapasite (MW):** 900 MW | **Enerji (GWh):** 6.3 GWh
- **Düşü:** 450 m | **Tünel Uzunluğu:** 5.5 km | **Aktif Hacim:** 5.71 Milyon m³
- **Ekonomi:** CAPEX: $1.71 Milyar | Yıllık Gelir: $139.5 Milyon | Geri Ödeme: 12.3 Yıl
- **Şebeke Bağlantısı:** 1.1 km uzakta. 
- **Üst Rezervuar:** Menzelet kuzeybatı yüksek plato üst rezervuarı
- **Alt Rezervuar:** Menzelet rezervuarı / mevcut HES omurgası
- **Proje Özeti (Tez):** Ceyhan havzasında mevcut HES altyapısına yakın klasik aday; orta head ve yakın 154 kV hat ile dengeli bir ikinci dalga seçeneği sunar.
- **Riskler:** Jeoloji, rezervuar işletme rejimi, deprem etkisi, kamulaştırma
- **Bileşen Detayları:**
  - **Üst Rezervuar:** 970m kot, 36m gövde yüksekliği, kil çekirdekli set ve yerel geomembran alternatifi
  - **Cebri Boru (Penstock):** Çap: 7.2m, Uzunluk: 5500m, Sınıf: ~44 bar statik basınç sınıfı
  - **Güç Evi:** 4 ünite, ayarlanabilir hızlı Francis pompa-türbin. Boyutlar: 30m(G) x 214m(U) x 40m(Y)

#### 9. Hasan Uğurlu-Suat Uğurlu PSPP (Klasik / Karadeniz mevcut hidro omurgası)
- **Bölge:** Yesilirmak havzasi - Hasan Ugurlu/Suat Ugurlu
- **Puan:** 71/100
- **Kapasite (MW):** 700 MW | **Enerji (GWh):** 4.9 GWh
- **Düşü:** 390 m | **Tünel Uzunluğu:** 4 km | **Aktif Hacim:** 5.12 Milyon m³
- **Ekonomi:** CAPEX: $1.26 Milyar | Yıllık Gelir: $105 Milyon | Geri Ödeme: 12 Yıl
- **Şebeke Bağlantısı:** 1.7 km uzakta. 
- **Üst Rezervuar:** Yeşilırmak vadisi arka sırt üst rezervuarı
- **Alt Rezervuar:** Hasan Uğurlu-Suat Uğurlu hidro sistemi
- **Proje Özeti (Tez):** Karadeniz hidro omurgasında mevcut rezervuar avantajı olan klasik aday; kısa su yolu güçlü, heyelan ve ekolojik etki kritik filtrelerdir.
- **Riskler:** Ekolojik etki, Karadeniz heyelanı, rezervuar koordinasyonu, yerel izinler
- **Bileşen Detayları:**
  - **Üst Rezervuar:** 475m kot, 34m gövde yüksekliği, kil çekirdekli set ve yerel geomembran alternatifi
  - **Cebri Boru (Penstock):** Çap: 6.2m, Uzunluk: 4000m, Sınıf: ~38 bar statik basınç sınıfı
  - **Güç Evi:** 3 ünite, Francis pompa-türbin. Boyutlar: 27m(G) x 188m(U) x 39m(Y)

#### 10. Sarıyar-Gökçekaya Augmentasyon PSPP (Stratejik hibrit / Sakarya rezervuar augmentasyonu)
- **Bölge:** Sakarya havzasi - Sariyar/Gokcekaya koridoru
- **Puan:** 67/100
- **Kapasite (MW):** 700 MW | **Enerji (GWh):** 5.6 GWh
- **Düşü:** 300 m | **Tünel Uzunluğu:** 6 km | **Aktif Hacim:** 7.61 Milyon m³
- **Ekonomi:** CAPEX: $1.26 Milyar | Yıllık Gelir: $105 Milyon | Geri Ödeme: 12 Yıl
- **Şebeke Bağlantısı:** 6.1 km uzakta. 
- **Üst Rezervuar:** Sakarya koridorunda ilave off-river üst rezervuar
- **Alt Rezervuar:** Sarıyar-Gökçekaya rezervuar sistemi
- **Proje Özeti (Tez):** Mevcut Sakarya hidro zincirini güçlendiren stratejik augmentasyon adayı; tekil saha kadar hızlı değil, ancak sistem optimizasyonu değeri yüksektir.
- **Riskler:** Kümülatif çevresel etki, Sakarya işletme rejimi, rezervuar koordinasyonu, iletim koridoru
- **Bileşen Detayları:**
  - **Üst Rezervuar:** 775m kot, 30m gövde yüksekliği, kil çekirdekli set ve yerel geomembran alternatifi
  - **Cebri Boru (Penstock):** Çap: 6.2m, Uzunluk: 6000m, Sınıf: ~29 bar statik basınç sınıfı
  - **Güç Evi:** 3 ünite, Francis pompa-türbin. Boyutlar: 27m(G) x 188m(U) x 38m(Y)

#### 11. Gazipaşa Kıyı-Toros Deniz Suyu PDHES (Makro Deniz PDHES / Akdeniz kıyı-sirt)
- **Bölge:** Gazipaşa kıyı - Toros arka sırtı
- **Puan:** 69/100
- **Kapasite (MW):** 420 MW | **Enerji (GWh):** 3.2 GWh
- **Düşü:** 640 m | **Tünel Uzunluğu:** 7.4 km | **Aktif Hacim:** 2.12 Milyon m³
- **Ekonomi:** CAPEX: $1.05 Milyar | Yıllık Gelir: $58 Milyon | Geri Ödeme: 18.1 Yıl
- **Şebeke Bağlantısı:** 8.5 km uzakta. 
- **Üst Rezervuar:** Gazipaşa arka sırtında kaplamali ust rezervuar konsepti
- **Alt Rezervuar:** Akdeniz kıyısi / deniz intake-outfall
- **Proje Özeti (Tez):** Yüksek head potansiyeli olan Akdeniz kıyı-sirt adayi; turizm ve kıyı izinleri ana karar filtresidir.
- **Riskler:** kıyı izinleri, liner/sızdırmazlık, korozyon, biofouling, turizm/görsel etki, heyelan/yamaç kararlılığı, şebeke uzaklığı
- **Bileşen Detayları:**
  - **Üst Rezervuar:** 640m kot, 36m gövde yüksekliği, HDPE geomembran + beton koruma kaplamasi
  - **Cebri Boru (Penstock):** Çap: 6.2m, Uzunluk: 7400m, Sınıf: ~63 bar statik basinc sinifi
  - **Güç Evi:** 3 ünite, Francis pompa-turbin. Boyutlar: 27m(G) x 188m(U) x 40m(Y)

#### 12. Finike-Kumluca Deniz Suyu PDHES (Makro Deniz PDHES / bati Antalya)
- **Bölge:** Finike-Kumluca kıyı ve Beydağları eteği
- **Puan:** 71/100
- **Kapasite (MW):** 520 MW | **Enerji (GWh):** 4 GWh
- **Düşü:** 720 m | **Tünel Uzunluğu:** 8.6 km | **Aktif Hacim:** 2.35 Milyon m³
- **Ekonomi:** CAPEX: $1.32 Milyar | Yıllık Gelir: $70 Milyon | Geri Ödeme: 18.9 Yıl
- **Şebeke Bağlantısı:** 10.4 km uzakta. 
- **Üst Rezervuar:** Beydağları eteğinde kaplamali ust rezervuar konsepti
- **Alt Rezervuar:** Finike/Kumluca kıyısi deniz alımı
- **Proje Özeti (Tez):** Yüksek düşü avantajli, ancak tarim, turizm ve korunan alan hassasiyeti yüksek bati Antalya adayi.
- **Riskler:** kıyı izinleri, liner/sızdırmazlık, korozyon, biofouling, turizm/görsel etki, korunan alan, deprem/fay
- **Bileşen Detayları:**
  - **Üst Rezervuar:** 720m kot, 36m gövde yüksekliği, HDPE geomembran + beton koruma kaplamasi
  - **Cebri Boru (Penstock):** Çap: 6.2m, Uzunluk: 8600m, Sınıf: ~71 bar statik basinc sinifi
  - **Güç Evi:** 3 ünite, Francis pompa-turbin. Boyutlar: 27m(G) x 188m(U) x 40m(Y)

#### 13. Samandağ-Musa Dağı Deniz Suyu PDHES (Makro Deniz PDHES / Dogu Akdeniz)
- **Bölge:** Samandağ kıyısi - Musa Dağı
- **Puan:** 62/100
- **Kapasite (MW):** 300 MW | **Enerji (GWh):** 2.1 GWh
- **Düşü:** 560 m | **Tünel Uzunluğu:** 6.8 km | **Aktif Hacim:** 1.6 Milyon m³
- **Ekonomi:** CAPEX: $0.82 Milyar | Yıllık Gelir: $42 Milyon | Geri Ödeme: 19.5 Yıl
- **Şebeke Bağlantısı:** 9.2 km uzakta. 
- **Üst Rezervuar:** Musa Dağı yamaçinda kaplamali ust rezervuar konsepti
- **Alt Rezervuar:** Samandağ kıyısi deniz alımı
- **Proje Özeti (Tez):** Sistem değeri yüksek doğu Akdeniz adayi; deprem/fay ve korunan alan riski nedeniyle düşük güvenlidir.
- **Riskler:** kıyı izinleri, liner/sızdırmazlık, korozyon, biofouling, korunan alan, deprem/fay, heyelan/yamaç kararlılığı
- **Bileşen Detayları:**
  - **Üst Rezervuar:** 560m kot, 36m gövde yüksekliği, HDPE geomembran + beton koruma kaplamasi
  - **Cebri Boru (Penstock):** Çap: 4.5m, Uzunluk: 6800m, Sınıf: ~55 bar statik basinc sinifi
  - **Güç Evi:** 2 ünite, Francis pompa-turbin. Boyutlar: 27m(G) x 188m(U) x 40m(Y)

#### 14. Edremit-Kazdağı Güney Eteği Deniz Suyu PDHES (Makro Deniz PDHES / Körfez-Kazdağı)
- **Bölge:** Edremit Körfezi - Kazdağı güney eteği
- **Puan:** 60/100
- **Kapasite (MW):** 260 MW | **Enerji (GWh):** 1.9 GWh
- **Düşü:** 520 m | **Tünel Uzunluğu:** 5.9 km | **Aktif Hacim:** 1.55 Milyon m³
- **Ekonomi:** CAPEX: $0.7 Milyar | Yıllık Gelir: $36 Milyon | Geri Ödeme: 19.4 Yıl
- **Şebeke Bağlantısı:** 12 km uzakta. 
- **Üst Rezervuar:** Kazdağı güney eteği kaplamali ust rezervuar konsepti
- **Alt Rezervuar:** Edremit Körfezi deniz alımı
- **Proje Özeti (Tez):** Kısa kıyı-sirt mesafesi cazip; Kazdağı koruma, turizm ve görsel etki riski belirleyicidir.
- **Riskler:** kıyı izinleri, liner/sızdırmazlık, korozyon, biofouling, turizm/görsel etki, korunan alan, deprem/fay, kamulaştırma/imar
- **Bileşen Detayları:**
  - **Üst Rezervuar:** 520m kot, 36m gövde yüksekliği, HDPE geomembran + beton koruma kaplamasi
  - **Cebri Boru (Penstock):** Çap: 4.5m, Uzunluk: 5900m, Sınıf: ~51 bar statik basinc sinifi
  - **Güç Evi:** 2 ünite, Francis pompa-turbin. Boyutlar: 27m(G) x 188m(U) x 40m(Y)

#### 15. Datça Güney Sırtı Deniz Suyu PDHES (Makro Deniz PDHES / Ege yarimada)
- **Bölge:** Datça yarımadası güney sırtı
- **Puan:** 55/100
- **Kapasite (MW):** 180 MW | **Enerji (GWh):** 1.2 GWh
- **Düşü:** 430 m | **Tünel Uzunluğu:** 4.7 km | **Aktif Hacim:** 1.18 Milyon m³
- **Ekonomi:** CAPEX: $0.52 Milyar | Yıllık Gelir: $26 Milyon | Geri Ödeme: 20 Yıl
- **Şebeke Bağlantısı:** 18 km uzakta. 
- **Üst Rezervuar:** Yarimada güney sırtında küçük kaplamali ust rezervuar
- **Alt Rezervuar:** Datça güney kıyısi deniz alımı
- **Proje Özeti (Tez):** Ada/yarimada arz güvenliği anlatimi güçlü; şebeke ve koruma hassasiyeti nedeniyle temkinli aday.
- **Riskler:** kıyı izinleri, liner/sızdırmazlık, korozyon, biofouling, turizm/görsel etki, korunan alan, şebeke uzaklığı, kamulaştırma/imar
- **Bileşen Detayları:**
  - **Üst Rezervuar:** 430m kot, 36m gövde yüksekliği, HDPE geomembran + beton koruma kaplamasi
  - **Cebri Boru (Penstock):** Çap: 4.5m, Uzunluk: 4700m, Sınıf: ~42 bar statik basinc sinifi
  - **Güç Evi:** 2 ünite, Francis pompa-turbin. Boyutlar: 27m(G) x 188m(U) x 40m(Y)

#### 16. Gökçeada Mikro Deniz PDHES Pilot (Mikro Deniz PDHES / ada pilotu)
- **Bölge:** Gökçeada mikro şebekesi
- **Puan:** 48/100
- **Kapasite (MW):** 20 MW | **Enerji (GWh):** 0.1 GWh
- **Düşü:** 230 m | **Tünel Uzunluğu:** 1.8 km | **Aktif Hacim:** 0.18 Milyon m³
- **Ekonomi:** CAPEX: $0.09 Milyar | Yıllık Gelir: $3.2 Milyon | Geri Ödeme: 28.1 Yıl
- **Şebeke Bağlantısı:** 4 km uzakta. 
- **Üst Rezervuar:** Ada içinde kaplamali mikro ust havuz
- **Alt Rezervuar:** Gökçeada kıyısi küçük deniz alımı
- **Proje Özeti (Tez):** Yatırım shortlist değil; mikro şebeke, teknoloji pilotu ve eğitim demonstrasyonu olarak etiketlenmelidir.
- **Riskler:** kıyı izinleri, liner/sızdırmazlık, korozyon, biofouling, turizm/görsel etki, korunan alan, şebeke uzaklığı
- **Bileşen Detayları:**
  - **Üst Rezervuar:** 230m kot, 16m gövde yüksekliği, HDPE geomembran + beton koruma kaplamasi
  - **Cebri Boru (Penstock):** Çap: 1.8m, Uzunluk: 1800m, Sınıf: ~23 bar statik basinc sinifi
  - **Güç Evi:** 1 ünite, kompakt reversible pompa-turbin pilot seti. Boyutlar: 12m(G) x 48m(U) x 18m(Y)

#### 17. Bozcaada Mikro Deniz PDHES Pilot (Mikro Deniz PDHES / ada pilotu)
- **Bölge:** Bozcaada mikro şebekesi
- **Puan:** 45/100
- **Kapasite (MW):** 12 MW | **Enerji (GWh):** 0.06 GWh
- **Düşü:** 150 m | **Tünel Uzunluğu:** 1.2 km | **Aktif Hacim:** 0.17 Milyon m³
- **Ekonomi:** CAPEX: $0.06 Milyar | Yıllık Gelir: $2 Milyon | Geri Ödeme: 30 Yıl
- **Şebeke Bağlantısı:** 3 km uzakta. 
- **Üst Rezervuar:** Ada içinde küçük kaplamali ust havuz
- **Alt Rezervuar:** Bozcaada kıyısi küçük deniz alımı
- **Proje Özeti (Tez):** Küçük ölçek maliyet primi yüksek; eğitim, ada sistemi ve pilot teknoloji değeri için tutulur.
- **Riskler:** kıyı izinleri, liner/sızdırmazlık, korozyon, biofouling, turizm/görsel etki, korunan alan, kamulaştırma/imar
- **Bileşen Detayları:**
  - **Üst Rezervuar:** 150m kot, 16m gövde yüksekliği, HDPE geomembran + beton koruma kaplamasi
  - **Cebri Boru (Penstock):** Çap: 1.8m, Uzunluk: 1200m, Sınıf: ~15 bar statik basinc sinifi
  - **Güç Evi:** 1 ünite, kompakt reversible pompa-turbin pilot seti. Boyutlar: 12m(G) x 48m(U) x 18m(Y)

#### 18. Afyon-Sultandağı Kapalı Çevrim Müstakil PDHES (Müstakil PDHES / kapalı Çevrim)
- **Bölge:** Sultandağı etekleri kapalı Çevrim konsepti
- **Puan:** 58/100
- **Kapasite (MW):** 320 MW | **Enerji (GWh):** 2.4 GWh
- **Düşü:** 520 m | **Tünel Uzunluğu:** 4.9 km | **Aktif Hacim:** 1.98 Milyon m³
- **Ekonomi:** CAPEX: $0.86 Milyar | Yıllık Gelir: $42 Milyon | Geri Ödeme: 20.5 Yıl
- **Şebeke Bağlantısı:** 14 km uzakta. 
- **Üst Rezervuar:** Yeni kaplamali ust rezervuar
- **Alt Rezervuar:** Yeni yapay alt rezervuar
- **Proje Özeti (Tez):** Mevcut baraja bağlı olmayan kapalı Çevrim demo adayi; su temini, parsel ve jeoteknik saha seçimi açıktır.
- **Riskler:** liner/sızdırmazlık, deprem/fay, heyelan/yamaç kararlılığı, şebeke uzaklığı, kamulaştırma/imar
- **Bileşen Detayları:**
  - **Üst Rezervuar:** 940m kot, 36m gövde yüksekliği, HDPE geomembran + beton koruma kaplamasi
  - **Cebri Boru (Penstock):** Çap: 4.5m, Uzunluk: 4900m, Sınıf: ~51 bar statik basinc sinifi
  - **Güç Evi:** 2 ünite, Francis pompa-turbin. Boyutlar: 27m(G) x 188m(U) x 40m(Y)

#### 19. Kayseri-Yahyalı Kapalı Çevrim Müstakil PDHES (Müstakil PDHES / kapalı Çevrim)
- **Bölge:** Yahyalı-Aladağlar etekleri kapalı Çevrim konsepti
- **Puan:** 61/100
- **Kapasite (MW):** 450 MW | **Enerji (GWh):** 3.2 GWh
- **Düşü:** 650 m | **Tünel Uzunluğu:** 5.8 km | **Aktif Hacim:** 2.11 Milyon m³
- **Ekonomi:** CAPEX: $1.15 Milyar | Yıllık Gelir: $56 Milyon | Geri Ödeme: 20.5 Yıl
- **Şebeke Bağlantısı:** 16 km uzakta. 
- **Üst Rezervuar:** Yeni kaplamali ust rezervuar
- **Alt Rezervuar:** Yeni yapay alt rezervuar
- **Proje Özeti (Tez):** Yüksek düşü potansiyelli müstakil kapalı Çevrim konsepti; Aladağlar koruma ve jeoloji filtreleri belirleyicidir.
- **Riskler:** liner/sızdırmazlık, korunan alan, deprem/fay, heyelan/yamaç kararlılığı, şebeke uzaklığı, kamulaştırma/imar
- **Bileşen Detayları:**
  - **Üst Rezervuar:** 1070m kot, 36m gövde yüksekliği, HDPE geomembran + beton koruma kaplamasi
  - **Cebri Boru (Penstock):** Çap: 6.2m, Uzunluk: 5800m, Sınıf: ~64 bar statik basinc sinifi
  - **Güç Evi:** 3 ünite, Francis pompa-turbin. Boyutlar: 27m(G) x 188m(U) x 40m(Y)

#### 20. Presenzano (Domenico Cimarosa) PSPP (Kapalı Çevrim Pompaj Depolamalı HES (İtalya))
- **Bölge:** Caserta, Campania, İtalya
- **Puan:** 95/100
- **Kapasite (MW):** 1000 MW | **Enerji (GWh):** 7.0 GWh
- **Düşü:** 498.0 m | **Tünel Uzunluğu:** 0.26 km | **Aktif Hacim:** 6.0 Milyon m³
- **Ekonomi:** CAPEX: $1.2 Milyar | Yıllık Gelir: $110 Milyon | Geri Ödeme: 10.9 Yıl
- **Şebeke Bağlantısı:** 0.5 km uzakta. 
- **Üst Rezervuar:** Cesima Üst Rezervuarı (6 milyon m³)
- **Alt Rezervuar:** Presenzano Alt Rezervuarı (6 milyon m³)
- **Proje Özeti (Tez):** İtalya'da bulunan 1.000 MW kapasiteli, kuyu tipi santral yapısına sahip modern kapalı çevrim HES.
- **Riskler:** Yeraltı şaft kazıları, Peyzaj ve çevre koruma
- **Bileşen Detayları:**
  - **Üst Rezervuar:** 643m kot, 45m gövde yüksekliği, Asfalt beton sızdırmazlık kaplaması
  - **Cebri Boru (Penstock):** Çap: 6.2m, Uzunluk: 260m, Sınıf: ~50 bar statik yük
  - **Güç Evi:** 4 ünite, Tersinir Francis Tipi Pompa-Türbin (4x250 MW). Boyutlar: 28m(G) x 160m(U) x 50m(Y)



---

## 6. Sorumluluk Reddi (Disclaimer)

Yineliyoruz; bu repoda sunulan kod, harita lokasyonları, topografya analizleri, kavramsal tasarım görselleri, kapasite/üretim tahminleri ve yatırım tutarları (CAPEX, NPV vb.) **tamamen eğitim, fikir jimnastiği ve kavramsal konsept araştırma** amaçlıdır. Bir projenin resmi Çevresel Etki Değerlendirmesi (ÇED), iletim şebekesi oluru, fizibilite onayı veya jeolojik etüt sonucu yerine geçmez. 

Bu kod veya içerik kullanılarak alınacak ticari, mühendislik veya yasal hiçbir kararın sorumluluğu kabul edilmemektedir.

## 7. Lisans
Bu projedeki kaynak kodlar **MIT Lisansı** ile sunulmaktadır. (Kök dizindeki `LICENSE` dosyasını inceleyebilirsiniz). Tesis verileri ve topoğrafik koordinat derlemeleri eğitim amaçlı açık erişimdir.
