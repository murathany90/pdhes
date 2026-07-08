# Türkiye Pompaj Depolamalı Hidroelektrik Santral (PDHES) Potansiyeli

Bu depo, Türkiye'deki potansiyel Pompaj Depolamalı Hidroelektrik Santral (PDHES) adaylarını haritalandıran, finansal olarak skorlayan, 3 boyutlu kavramsal yerleşimlerini çizen ve teknik parametreleriyle listeleyen kapsamlı bir açık kaynak web uygulamasıdır. 

Uygulamanın temel amacı; hem Mülga Elektrik İşleri Etüt İdaresi (EİE) hem de Japonya Uluslararası İşbirliği Ajansı (JICA) tarafından belirlenmiş öncelikli adayları ve ilave deniz suyu (Sea-Water) prototiplerini modern bir arayüzle mühendislere, akademisyenlere ve yatırımcılara sunmaktır. 

> **Önemli Yasal Uyarı (Disclaimer):** Bu uygulama, yatırım tavsiyesi, mühendislik fizibilitesi veya resmi DSİ / TEİAŞ / EPDK onayı taşımaz. Tüm koordinatlar, 3D çizimler, şebeke bağlantı noktaları ve havuz alanları Dijital Yükseklik Modeli (DEM) tabanlı otomatik kavramsal (conceptual) çizimlerdir. Ekonomik varsayımlar akademik araştırmalara (GÖKAY vb.) dayanır ve kesin yatırım kararı olarak kullanılamaz. Açık kaynak kodlu bir teknoloji demosudur.

---

## 1. Uygulama Mimarisi ve Teknoloji Yığını (Tech Stack)

Bu proje, modern web geliştirme standartlarına uygun olarak inşa edilmiş ve performans odaklı bir yığın (stack) kullanılmıştır:

### 1.1. Core Framework ve Dil
- **React 18:** Fonksiyonel bileşenler ve hook (kanca) mimarisi ile inşa edilmiştir. React'ın Concurrent Mode avantajlarından faydalanmak üzere optimize edilmiştir.
- **TypeScript:** Tip güvenliği (type-safety) sağlar. Uygulama içerisindeki santral verileri (Site), koordinatlar, 3D malzeme tipleri gibi tüm karmaşık nesneler TS Interface ve Enum yapılarıyla korunmaktadır. Tip hataları (runtime errors) derleme aşamasında yakalanır.
- **Vite:** Geleneksel Webpack yerine kullanılan, son derece hızlı geliştirme ortamı ve derleme aracıdır. ES modules (ESM) altyapısını kullanarak anında Hot-Module-Replacement (HMR) sunar.

### 1.2. State Management (Durum Yönetimi)
- **Zustand:** Redux'ın hantal yapısı yerine, React uygulamaları için minimalist ve çok hızlı bir global state (durum) yönetim kütüphanesi olan Zustand kullanılmıştır. 
- Proje içinde farklı işlevlere sahip 3 ana store bulunur:
  1. `useAppDataStore`: Asenkron veri çekme, hata (error) durumu ve yüklenme (loading) animasyonlarını yönetir. Uygulama açılışında veritabanını `fetch` eder.
  2. `useWorkspaceStore`: Kullanıcının tarayıcı hafızasına (Local Storage) kaydedilen, Markdown formatındaki özel ayarları ve içerik değişikliklerini tutar. "PDHES Nedir?" sayfasındaki canlı düzenlemeler burada depolanır.
  3. `useSettingsStore`: Karanlık mod (Dark Theme), hareketleri azaltma (Reduced Motion) gibi kullanıcı UI tercihlerini tutar.

### 1.3. Haritalama (GIS) ve 3D Modelleme
- **Mapbox GL JS:** Vektör harita teknolojisi. Topoğrafik yükseklik verisini (DEM - Digital Elevation Model) kullanarak 3D dağ ve vadi çizimlerini gerçekleştirir.
- **react-map-gl:** Mapbox GL'in React sarmalayıcısıdır. Harita katmanlarını (Layers), kaynakları (Sources) ve kamera açılarını React hook'larıyla deklaratif olarak yönetir.

### 1.4. Validasyon ve Testler
- **Zod:** Çalışma zamanında (runtime) veri şema doğrulaması (Schema Validation) yapar. JSON formatındaki santral verileri uygulamaya girmeden önce `siteSchema.ts` tarafından denetlenir ve eksik/hatalı veri varsa engellenir.
- **Vitest:** Vite üzerine kurulu süper hızlı Unit Test aracı. Projede 60'tan fazla birim test ve entegrasyon testi vardır.

---

## 2. Sayfa Sayfa ve Sekme Sekme Uygulama Rehberi

Uygulamanın navigasyonu ekranın sol (veya mobil cihazlarda alt) kısmındaki `Nav` bileşeni üzerinden sağlanır. Uygulama 5 ana sekmeden (Tab) ve 1 Ayarlar sayfasından oluşur. Her sayfa farklı bir teknik derinlik sunar.

### Sekme 1: PDHES Nedir? (Giriş ve Eğitim Sayfası)
- **Bileşen Yolu:** `src/pages/PdhesPage.tsx`
- **İşlevi:** Uygulamayı ilk kez açan yatırımcılara veya kullanıcılara Pompaj Depolamalı HES kavramını anlatan ana giriş (Primer) sayfasıdır. 
- **Bölümler:**
  - **Genel Çalışma Prensibi:** PDHES sistemleri nasıl çalışır, enerji arbitrajı nedir (gece baz yükü ile suyun yukarı basılması, gündüz puant saatlerde aşağı salınarak enerji satılması).
  - **Türkiye'nin Şebeke İhtiyacı:** TEİAŞ'ın artan Güneş ve Rüzgar enerjisi kapasitesini dengelemek için neden mekanik bataryalara (PDHES) ihtiyaç duyduğu anlatılır. Lityum-iyon bataryalarla karşılaştırmalar yer alır.
- **Teknoloji:** Bu sayfadaki metinler standart sabit metin (hard-coded) değildir. `useWorkspaceStore` sayesinde kullanıcı tarafından doğrudan sayfa üzerinden Markdown olarak düzenlenebilir (`contenteditable`). Yapılan değişiklikler sadece o tarayıcıya (Local Storage) kaydedilir. XSS saldırılarına karşı DOM purify işlemleri uygulanır.

### Sekme 2: PDHES Adayları (DataPage - Ana Veri Tablosu)
- **Bileşen Yolu:** `src/pages/DataPage.tsx`
- **İşlevi:** Sistemdeki tüm Türkiye adaylarının (`data.json` içindeki 20 santralin) teknik ve finansal olarak listelendiği merkez interaktif veri tablosudur.
- **Filtreleme Menüleri:** 
  - **Konsept Tipi (Concept Type):** Deniz Suyu kullanan adaylar ile Tatlı Su (Nehir/Göl) kullanan adayları ayrıştırır.
  - **Altyapı Tipi (Infrastructure Type):** Sıfırdan yapılan yatırımlar (Tamamen Yeni / Pure New Build) ile Mevcut baraj gölünü alt rezervuar olarak kullanan yatırımları filtreler (Existing Reservoir Integrated). Mevcut barajlı sistemler genelde daha düşük maliyetlidir.
  - **Kaynak (Source Group):** JICA/EİE verileri ile sonradan belirlenen Deniz prototiplerini filtreler.
- **Tablo Sütunları ve Metrikleri:** 
  1. **Santral Adı ve İl:** Adayın ismi ve bağlı olduğu bölge.
  2. **Güç / Enerji:** Kurulu Güç (MW) değeri ve `7 saat` çalışma prensibiyle hesaplanmış Enerji Miktarı (MWh). *(Örn: Gökçekaya 1400 MW kurulu güç, 9800 MWh kapasite).*
  3. **Düşü / Su Yolu:** Suyun düştüğü efektif yükseklik (Head) ve Tünel/Cebri Boru (Waterway) uzunluğu.
  4. **Yatırım / Gelir:** JICA ölçek ekonomisine göre hesaplanan Yatırım tutarı (Milyar Dolar) ve yıllık arbitraj geliri (Milyon Dolar).
  5. **Skor (Senaryo):** `scenarioScore` algoritmasıyla adayın verimlilik puanı (Bar grafiği şeklinde gösterilir).
  6. **Genişletilebilir Satır (Accordion):** Herhangi bir adaya tıklandığında alt satır açılır. Adaya ait akademik tez referansları, depolama kapasitesi (hm³) ve Geri Ödeme (Amortisman - Payback Year) metrikleri burada yer alır. "Debi" verisi arayüz kalabalığını önlemek adına kasıtlı olarak kaldırılmıştır.

### Sekme 3: Harita Gösterimi (MapPage - 2D Coğrafi Keşif)
- **Bileşen Yolu:** `src/pages/MapPage.tsx`
- **İşlevi:** Türkiye haritası üzerinde tüm adayların konumlarını gösteren, Mapbox tabanlı interaktif GIS arayüzüdür.
- **Harita Deneyimi (Mapbox GL):** 
  - Veritabanındaki (`data.json`) `coordinates.mapAnchor` verileri okunarak her adaya bir Marker (İşaretçi) atanır.
  - Deniz Suyu adayları mavi/farklı renkli ikonlarla, tatlı su adayları klasik ikonlarla (Marker) gösterilir.
- **Kamera Animasyonu (Fly-to):**
  - Sol tarafta `SiteList` (Aday listesi paneli) yer alır.
  - Listeden bir adaya veya haritadaki bir ikona tıklandığında, sistem adayın koordinatlarına "Fly-to" animasyonu (süzülme hareketi) başlatır.
  - Kamera doğrudan dağ veya nehir kanyonunun üzerine yaklaşır (Zoom Level 11-13).
  - Seçili adayın teknik özet bilgileri, bir "Açılır Popup (Tooltip)" veya ekran altı paneli olarak kullanıcıya sunulur.

### Sekme 4: 3D Yerleşim (ThreeDPage - Mühendislik İncelemesi)
- **Bileşen Yolu:** `src/pages/ThreeDPage.tsx`
- **İşlevi:** Uygulamanın mühendislik ve GIS vizyonunun zirvesidir. Seçilen PDHES adayının santral bileşenlerini 3D olarak topoğrafya üzerine çizer. 
- **3D Terrain (Mapbox DEM Katmanı):**
  - Gerçek dünya uydu haritası üzerine Mapbox'ın "Digital Elevation Model (DEM)" yükseklik verisi eklenir. Kamera (Pitch/Bearing araçlarıyla) yatırılarak dağlar, vadiler ve eğimler 3 Boyutlu olarak görülür.
- **3D Footprint Poligonları (Bileşenler):**
  - Alt menüdeki Toggle (Aç/Kapat) düğmeleri ile farklı yapısal katmanlar görünür/görünmez yapılabilir:
  1. **Rezervuarlar (Su):** Üst rezervuar (`concrete-lined-pool`) ve alt rezervuar (`existing-dam-lake` veya `sea`) su kütleleri şeffaf mavi poligonlarla (Extrusion) yükseltilir.
  2. **Dolgu/Baraj Seddesi (Embankment):** Suyu tutan setler toprak renginde modellenir.
  3. **Tünel Ekseni (Su Yolu):** Üst rezervuardan aşağıya düşen su yolu hattı (Penstock/Tunnel) topoğrafyanın altında kalacak biçimde `baseElevationM` parametreleriyle kırmızı eksen şeklinde çizilir. Eğim görselleştirilir.
  4. **Santral Binası (Powerhouse):** Yeraltı boşluğu (underground-cavern) olarak gösterilir. Yüzeyden santrale inen şaft portalları da modelde yer alır.
- **Kamera Navigasyonu:** Serbest (Free-look) veya adaya kilitli (Locked) navigasyon modları bulunur.

### Sekme 5: Raporlar ve Haberler (ReportsPage)
- **Bileşen Yolu:** `src/pages/ReportsPage.tsx`
- **İşlevi:** Proje hakkındaki literatürün (geçmiş akademik makaleler, resmi fizibiliteler, EİE/JICA tarihçesi) sunulduğu dijital kütüphanedir.
- **İçerik Blokları:** 
  - "JICA Türkiye Pompaj Depolamalı HES Potansiyel Raporu Özeti (2011)"
  - "GÖKAY Yaklaşımıyla Pompaj Depolamalı HES Kârlılık Analizi (Akademik Yüksek Lisans Tezi)"
  - "Deniz Suyu PDHES Teknolojileri ve Okinawa Yanbaru Projesi" gibi statik okuma dökümanları.

### Sekme 6: Yerel Çalışma Alanı ve Ayarlar (SettingsPage)
- **Bileşen Yolu:** `src/pages/SettingsPage.tsx`
- **İşlevi:** Kullanıcı deneyimini özelleştirme (Accessibility & Theming) ve Developer (Geliştirici) araçları menüsüdür.
- **Ulaşılabilirlik (A11y) Seçenekleri:**
  - **Karanlık Mod (Dark Theme):** CSS değişkenleri (`--bg-color`, `--text-color`) ile tüm arayüzün rengini gece moduna çevirir.
  - **Animasyonları Azalt (Reduced Motion):** Haritadaki "Fly-to" gibi geçiş animasyonlarını ve arayüzdeki mikro hareketleri (CSS Transition) kaldırarak mide bulantısı yaşayan kullanıcılara uyum sağlar.
  - **Yüksek Kontrast (High Contrast):** Görme zorluğu çekenler için UI elementlerinin (butonlar, yazılar) sınırlarını ve tonlarını belirginleştirir.
- **Geliştirici Modu (Dev Mode):** Bu buton aktif edildiğinde harita katmanlarındaki (`layout3D`) raw JSON yapıları, render debug (Hata ayıklama) logları arayüzde görünür hale gelir. 
- **Çalışma Alanını Sıfırla:** Ziyaretçinin "PDHES Nedir?" sekmesinde veya lokal depolamasında (LocalStorage) yaptığı tüm metin manipülasyonlarını (Workspace Override) tamamen temizleyip orijinal haline döndürür.

---

## 3. Finansal ve Ekonomik Metodoloji (GÖKAY Yaklaşımı)

Uygulama, hem 16 JICA adayının doğrudan (sabit) değerlerini hem de olası yeni konsept adaylar için dinamik `SiteTableMetrics` hesaplamalarını kullanır (`src/utils/siteTableMetrics.ts`).

Veritabanında önceden işlenmiş olan ve arayüzde doğrudan **Kaynak** etiketiyle listelenen 16 JICA adayı için şu finansal formülasyon (GÖKAY araştırmasına göre) katı olarak uygulanmıştır:

1. **Tahmini Yatırım Maliyeti (Capex):** JICA'nın Türkiye için belirlediği ölçek ekonomisi (Scale Economy) dikkate alınarak kapasiteye göre hesaplanmıştır:
   - 1500-1600 MW kapasite için birim maliyet: ~750 $/kW
   - 1000 MW kapasite için birim maliyet: ~940 $/kW
   - 500 MW kapasite için birim maliyet: ~1100 $/kW
   - 300 MW kapasite için birim maliyet: ~1200 $/kW
   *(Avrupa ortalaması olan 2500 $/kW yerine Türkiye'nin mevcut inşaat, hafriyat işçilik kapasitesi ve JICA optimizasyonu kullanılmıştır)*
2. **Yıllık Gelir (Brüt Kar - Revenue):** Türkiye elektrik piyasası (EPİAŞ / PTF) şartlarında, sistemin sadece en karlı saatlerde devrede kalacağı varsayımıyla:
   - Optimum günlük **7.59 saat maksimum kapasite (tam yük)** çalışma süresi.
   - Pompaj için tüketilen elektrik ile türbinleme sırasında satılan elektrik arasındaki **18.49 USD/MWh arbitraj kârı (alım-satım farkı)**.
   - *Matematiksel Formül: Kurulu Güç (MW) x 7.59 saat x 365 gün x 18.49 USD = Tahmini Yıllık Kar*
3. **Geri Ödeme Süresi (Amortisman / Payback):** 
   - *Matematiksel Formül: Toplam Yatırım Maliyeti (Capex) / Yıllık Brüt Kar*
   - Bu formülle hesaplanan projelerin amortismanı 14 ila 23 yıl arasında değişkenlik göstermektedir. Gökçekaya ve Altınkaya gibi devler 14-16 yıl bantlarında seyrederek çok yüksek fizibilite sunar.

*Özel Vaka (Gökçekaya): Orijinal JICA raporlarında Gökçekaya projesi 1400 MW güce düşürülerek dizaynı netleştirilmiştir (1.098 Milyar Dolar Capex). `data.json` sistemine kesinleşen **1400 MW kurulu güç**, **379,5 m efektif düşü** ve **4.051 m toplam su yolu uzunluğu** (Waterway Length) referans olarak işlenmiştir.*

---

## 4. Teknik Sınıflandırma ve Senaryo Skorlama Algoritması

Adayların sisteme kaydedilmesi (`src/types/site.ts`) TypeScript interface'leri ve Zod şeması (`siteSchema.ts`) tarafından güvence altındadır.

### 4.1. Veri Modeli ve Altyapı Sınıflandırması
Sisteme giren her santral (`Site`), `TechnicalClassification` objesine sahiptir:
- **Çevrim Tipi (`cycleType`):** 
  - `OPEN_LOOP` (Açık Çevrim): Üst veya alt rezervuardan en az biri doğal/sürekli akan nehir veya göl olan sistemler. Su dengesi doğal yollarla da sağlanabilir.
  - `CLOSED_LOOP` (Kapalı Çevrim): İki rezervuarın da tamamen suni (beton veya geomembran) olduğu, sadece buharlaşmayı telafi edecek kadar can suyu (makeup water) barındıran sistemler.
  - `SEA_LOWER_RESERVOIR`: Alt rezervuar olarak okyanus veya denizi (Tuzlu Su) kullanan prototip sistemler. Paslanmaz çelik/özel kaplama türbin (Corrosion-resistant) gerektirir.
- **Altyapı Türü (`infrastructureType`):** 
  - `PURE_NEW_BUILD`: Sıfırdan inşa (Greenfield). Hem üst hem alt havuz yeni yapılır.
  - `EXISTING_RESERVOIR_INTEGRATED`: Mevcut baraj gölünün (Örn: Sarıyar, Keban, Gökçekaya) devasa kapasitesinden faydalanan, sadece üst rezervuarın yeni inşa edildiği (Brownfield) yapılar. Maliyet olarak büyük avantaj sağlar.

### 4.2. Senaryo Skoru (`scenarioScore`)
Kullanıcının projeleri birbiriyle rekabete sokması ve kıyaslaması için uygulanan 100 bazlı puanlama sistemidir:
- **Kapasite ve Düşü Skoru:** Santralin kurulu gücü 1600 MW'a (Maksimum Ölçek) ve düşüsü 700 metreye (Hidrolik verim sınırı) ne kadar yakınsa o kadar asimptotik olarak yüksek puan alır.
- **Koordinat ve Veri Güveni (`coordinateConfidence`):** 
  - Veritabanında `existing-data` (EİE / JICA orjinal belgesine dayalı koordinat) olanlar sisteme **+9 puan** avantajıyla başlar.
  - `fallback-approximate` (Yaklaşık, sadece topografya taramasıyla bulunan koordinat) olanlar ise **+6 puan** alır.
- **Risk Analizi (Ceza Puanı):** Her adayın taşıdığı potansiyel tehlikeler (`risks`) array olarak veritabanındadır. Örneğin: "Aktif fay hattı (KAF) üzerinde", "Göl yatağında koruma alanı var", "Yerleşim yeri taşıma maliyeti" gibi her bir metin kalemi için skordan **-1.2 puan** ceza düşülür.
- **Stratejik Deniz Bonusu:** Okyanus/Deniz çevrim (`SEA_WATER_PROTOTYPE_TOP4`) konsept projeleri, kuraklık riskine karşı içme/tarım suyu (Tatlı Su) stresini artırmadıkları için skorlamada stratejik teşvik puanıyla desteklenir.

---

## 5. Türkiye PDHES Adayları Listesi ve Tüm Veriler

Aşağıda veritabanında yer alan 20 adayın son derece detaylı bir dökümü bulunmaktadır. 


### 1. Gökçekaya PDHES (`jica-gokcekaya-pspp`)
- **İl:** Eskişehir
- **Kaynak Grubu:** JICA_EIE_16
- **Kapasite ve Enerji Üretimi:** Kurulu gücü **1400 MW** olan bu santral, günlük 7 saatlik tam yük üzerinden yaklaşık **9800 MWh** kapasiteye sahiptir.
- **Efektif Düşü ve Su Yolu Uzunluğu:** Su kütlesi yaklaşık **379.5 metre** aşağıya düşerek türbinleri çevirir. Bu esnada kat ettiği toplam cebri boru ve tünel hattı uzunluğu **4051 m**'dir.
- **Koordinat Verileri:** Haritada harita işaretçisi (Lon: 31.02100, Lat: 40.03500) noktasına düşerken, asıl santral binasının yeraltı koordinatları (Lat: 40.02560, Lon: 31.00560) olarak belirlenmiştir.

### 2. İznik I PDHES (`jica-iznik-i-pspp`)
- **İl:** Bursa
- **Kaynak Grubu:** JICA_EIE_16
- **Kapasite ve Enerji Üretimi:** Kurulu gücü **1500 MW** olan bu santral, günlük 7 saatlik tam yük üzerinden yaklaşık **10500 MWh** kapasiteye sahiptir.
- **Efektif Düşü ve Su Yolu Uzunluğu:** Su kütlesi yaklaşık **255 metre** aşağıya düşerek türbinleri çevirir. Bu esnada kat ettiği toplam cebri boru ve tünel hattı uzunluğu **-**'dir.
- **Koordinat Verileri:** Haritada harita işaretçisi (Lon: 29.50000, Lat: 40.46480) noktasına düşerken, asıl santral binasının yeraltı koordinatları (Lat: 40.44000, Lon: 29.51000) olarak belirlenmiştir.

### 3. Sarıyar PDHES (`jica-sariyar-pspp`)
- **İl:** Ankara
- **Kaynak Grubu:** JICA_EIE_16
- **Kapasite ve Enerji Üretimi:** Kurulu gücü **1000 MW** olan bu santral, günlük 7 saatlik tam yük üzerinden yaklaşık **7000 MWh** kapasiteye sahiptir.
- **Efektif Düşü ve Su Yolu Uzunluğu:** Su kütlesi yaklaşık **434 metre** aşağıya düşerek türbinleri çevirir. Bu esnada kat ettiği toplam cebri boru ve tünel hattı uzunluğu **1797 m**'dir.
- **Koordinat Verileri:** Haritada harita işaretçisi (Lon: 31.39085, Lat: 40.05495) noktasına düşerken, asıl santral binasının yeraltı koordinatları (Lat: 40.03700, Lon: 31.40950) olarak belirlenmiştir.

### 4. Bayramhacılı PDHES (`jica-bayramhacili-pspp`)
- **İl:** Kayseri
- **Kaynak Grubu:** JICA_EIE_16
- **Kapasite ve Enerji Üretimi:** Kurulu gücü **1000 MW** olan bu santral, günlük 7 saatlik tam yük üzerinden yaklaşık **7000 MWh** kapasiteye sahiptir.
- **Efektif Düşü ve Su Yolu Uzunluğu:** Su kütlesi yaklaşık **161 metre** aşağıya düşerek türbinleri çevirir. Bu esnada kat ettiği toplam cebri boru ve tünel hattı uzunluğu **465 m**'dir.
- **Koordinat Verileri:** Haritada harita işaretçisi (Lon: 34.83900, Lat: 38.77000) noktasına düşerken, asıl santral binasının yeraltı koordinatları (Lat: 38.75200, Lon: 34.85000) olarak belirlenmiştir.

### 5. Hasan Uğurlu PDHES (`jica-hasan-ugurlu-pspp`)
- **İl:** Samsun
- **Kaynak Grubu:** JICA_EIE_16
- **Kapasite ve Enerji Üretimi:** Kurulu gücü **1000 MW** olan bu santral, günlük 7 saatlik tam yük üzerinden yaklaşık **7000 MWh** kapasiteye sahiptir.
- **Efektif Düşü ve Su Yolu Uzunluğu:** Su kütlesi yaklaşık **570 metre** aşağıya düşerek türbinleri çevirir. Bu esnada kat ettiği toplam cebri boru ve tünel hattı uzunluğu **1600 m**'dir.
- **Koordinat Verileri:** Haritada harita işaretçisi (Lon: 36.62000, Lat: 41.00000) noktasına düşerken, asıl santral binasının yeraltı koordinatları (Lat: 40.99500, Lon: 36.62000) olarak belirlenmiştir.

### 6. Adıgüzel PDHES (`jica-adiguzel-pspp`)
- **İl:** Denizli
- **Kaynak Grubu:** JICA_EIE_16
- **Kapasite ve Enerji Üretimi:** Kurulu gücü **1000 MW** olan bu santral, günlük 7 saatlik tam yük üzerinden yaklaşık **7000 MWh** kapasiteye sahiptir.
- **Efektif Düşü ve Su Yolu Uzunluğu:** Su kütlesi yaklaşık **242 metre** aşağıya düşerek türbinleri çevirir. Bu esnada kat ettiği toplam cebri boru ve tünel hattı uzunluğu **966 m**'dir.
- **Koordinat Verileri:** Haritada harita işaretçisi (Lon: 29.19020, Lat: 38.17200) noktasına düşerken, asıl santral binasının yeraltı koordinatları (Lat: 38.16300, Lon: 29.20500) olarak belirlenmiştir.

### 7. Burdur PDHES (`jica-burdur-pspp`)
- **İl:** Burdur
- **Kaynak Grubu:** JICA_EIE_16
- **Kapasite ve Enerji Üretimi:** Kurulu gücü **1000 MW** olan bu santral, günlük 7 saatlik tam yük üzerinden yaklaşık **7000 MWh** kapasiteye sahiptir.
- **Efektif Düşü ve Su Yolu Uzunluğu:** Su kütlesi yaklaşık **370 metre** aşağıya düşerek türbinleri çevirir. Bu esnada kat ettiği toplam cebri boru ve tünel hattı uzunluğu **-**'dir.
- **Koordinat Verileri:** Haritada harita işaretçisi (Lon: 30.21250, Lat: 37.74750) noktasına düşerken, asıl santral binasının yeraltı koordinatları (Lat: 37.73500, Lon: 30.24000) olarak belirlenmiştir.

### 8. Eğirdir PDHES (`jica-egirdir-pspp`)
- **İl:** Isparta
- **Kaynak Grubu:** JICA_EIE_16
- **Kapasite ve Enerji Üretimi:** Kurulu gücü **1000 MW** olan bu santral, günlük 7 saatlik tam yük üzerinden yaklaşık **7000 MWh** kapasiteye sahiptir.
- **Efektif Düşü ve Su Yolu Uzunluğu:** Su kütlesi yaklaşık **672 metre** aşağıya düşerek türbinleri çevirir. Bu esnada kat ettiği toplam cebri boru ve tünel hattı uzunluğu **-**'dir.
- **Koordinat Verileri:** Haritada harita işaretçisi (Lon: 30.82750, Lat: 37.90000) noktasına düşerken, asıl santral binasının yeraltı koordinatları (Lat: 37.88300, Lon: 30.85000) olarak belirlenmiştir.

### 9. Kargı PDHES (`jica-kargi-pspp`)
- **İl:** Ankara
- **Kaynak Grubu:** JICA_EIE_16
- **Kapasite ve Enerji Üretimi:** Kurulu gücü **1000 MW** olan bu santral, günlük 7 saatlik tam yük üzerinden yaklaşık **7000 MWh** kapasiteye sahiptir.
- **Efektif Düşü ve Su Yolu Uzunluğu:** Su kütlesi yaklaşık **496 metre** aşağıya düşerek türbinleri çevirir. Bu esnada kat ettiği toplam cebri boru ve tünel hattı uzunluğu **2762 m**'dir.
- **Koordinat Verileri:** Haritada harita işaretçisi (Lon: 31.78500, Lat: 40.09350) noktasına düşerken, asıl santral binasının yeraltı koordinatları (Lat: 40.08000, Lon: 31.79800) olarak belirlenmiştir.

### 10. Karacaören II PDHES (`jica-karacaoren-ii-pspp`)
- **İl:** Burdur
- **Kaynak Grubu:** JICA_EIE_16
- **Kapasite ve Enerji Üretimi:** Kurulu gücü **1000 MW** olan bu santral, günlük 7 saatlik tam yük üzerinden yaklaşık **7000 MWh** kapasiteye sahiptir.
- **Efektif Düşü ve Su Yolu Uzunluğu:** Su kütlesi yaklaşık **615 metre** aşağıya düşerek türbinleri çevirir. Bu esnada kat ettiği toplam cebri boru ve tünel hattı uzunluğu **-**'dir.
- **Koordinat Verileri:** Haritada harita işaretçisi (Lon: 30.78185, Lat: 37.32830) noktasına düşerken, asıl santral binasının yeraltı koordinatları (Lat: 37.31000, Lon: 30.80200) olarak belirlenmiştir.

### 11. Yalova PDHES (`jica-yalova-pspp`)
- **İl:** Yalova
- **Kaynak Grubu:** JICA_EIE_16
- **Kapasite ve Enerji Üretimi:** Kurulu gücü **500 MW** olan bu santral, günlük 7 saatlik tam yük üzerinden yaklaşık **3500 MWh** kapasiteye sahiptir.
- **Efektif Düşü ve Su Yolu Uzunluğu:** Su kütlesi yaklaşık **400 metre** aşağıya düşerek türbinleri çevirir. Bu esnada kat ettiği toplam cebri boru ve tünel hattı uzunluğu **1100 m**'dir.
- **Koordinat Verileri:** Haritada harita işaretçisi (Lon: 29.19250, Lat: 40.61250) noktasına düşerken, asıl santral binasının yeraltı koordinatları (Lat: 40.60800, Lon: 29.21000) olarak belirlenmiştir.

### 12. Yamula PDHES (`jica-yamula-pspp`)
- **İl:** Kayseri
- **Kaynak Grubu:** JICA_EIE_16
- **Kapasite ve Enerji Üretimi:** Kurulu gücü **500 MW** olan bu santral, günlük 7 saatlik tam yük üzerinden yaklaşık **3500 MWh** kapasiteye sahiptir.
- **Efektif Düşü ve Su Yolu Uzunluğu:** Su kütlesi yaklaşık **260 metre** aşağıya düşerek türbinleri çevirir. Bu esnada kat ettiği toplam cebri boru ve tünel hattı uzunluğu **1920 m**'dir.
- **Koordinat Verileri:** Haritada harita işaretçisi (Lon: 35.24540, Lat: 38.91360) noktasına düşerken, asıl santral binasının yeraltı koordinatları (Lat: 38.90500, Lon: 35.26500) olarak belirlenmiştir.

### 13. Oymapınar PDHES (`jica-oymapinar-pspp`)
- **İl:** Antalya
- **Kaynak Grubu:** JICA_EIE_16
- **Kapasite ve Enerji Üretimi:** Kurulu gücü **500 MW** olan bu santral, günlük 7 saatlik tam yük üzerinden yaklaşık **3500 MWh** kapasiteye sahiptir.
- **Efektif Düşü ve Su Yolu Uzunluğu:** Su kütlesi yaklaşık **372 metre** aşağıya düşerek türbinleri çevirir. Bu esnada kat ettiği toplam cebri boru ve tünel hattı uzunluğu **919 m**'dir.
- **Koordinat Verileri:** Haritada harita işaretçisi (Lon: 31.52500, Lat: 36.88900) noktasına düşerken, asıl santral binasının yeraltı koordinatları (Lat: 36.91000, Lon: 31.50300) olarak belirlenmiştir.

### 14. Aslantaş PDHES (`jica-aslantas-pspp`)
- **İl:** Osmaniye
- **Kaynak Grubu:** JICA_EIE_16
- **Kapasite ve Enerji Üretimi:** Kurulu gücü **500 MW** olan bu santral, günlük 7 saatlik tam yük üzerinden yaklaşık **3500 MWh** kapasiteye sahiptir.
- **Efektif Düşü ve Su Yolu Uzunluğu:** Su kütlesi yaklaşık **154 metre** aşağıya düşerek türbinleri çevirir. Bu esnada kat ettiği toplam cebri boru ve tünel hattı uzunluğu **1100 m**'dir.
- **Koordinat Verileri:** Haritada harita işaretçisi (Lon: 36.24540, Lat: 37.28740) noktasına düşerken, asıl santral binasının yeraltı koordinatları (Lat: 37.27600, Lon: 36.26500) olarak belirlenmiştir.

### 15. İznik II PDHES (`jica-iznik-ii-pspp`)
- **İl:** Bursa
- **Kaynak Grubu:** JICA_EIE_16
- **Kapasite ve Enerji Üretimi:** Kurulu gücü **500 MW** olan bu santral, günlük 7 saatlik tam yük üzerinden yaklaşık **3500 MWh** kapasiteye sahiptir.
- **Efektif Düşü ve Su Yolu Uzunluğu:** Su kütlesi yaklaşık **263 metre** aşağıya düşerek türbinleri çevirir. Bu esnada kat ettiği toplam cebri boru ve tünel hattı uzunluğu **-**'dir.
- **Koordinat Verileri:** Haritada harita işaretçisi (Lon: 29.69000, Lat: 40.39000) noktasına düşerken, asıl santral binasının yeraltı koordinatları (Lat: 40.41500, Lon: 29.66500) olarak belirlenmiştir.

### 16. Demirköprü PDHES (`jica-demirkopru-pspp`)
- **İl:** Manisa
- **Kaynak Grubu:** JICA_EIE_16
- **Kapasite ve Enerji Üretimi:** Kurulu gücü **300 MW** olan bu santral, günlük 7 saatlik tam yük üzerinden yaklaşık **2100 MWh** kapasiteye sahiptir.
- **Efektif Düşü ve Su Yolu Uzunluğu:** Su kütlesi yaklaşık **213 metre** aşağıya düşerek türbinleri çevirir. Bu esnada kat ettiği toplam cebri boru ve tünel hattı uzunluğu **1462 m**'dir.
- **Koordinat Verileri:** Haritada harita işaretçisi (Lon: 28.29075, Lat: 38.62840) noktasına düşerken, asıl santral binasının yeraltı koordinatları (Lat: 38.62000, Lon: 28.30500) olarak belirlenmiştir.

### 17. Taşucu-Gülnar Deniz Suyu PSPP (`tasucu`)
- **İl:** Mersin
- **Kaynak Grubu:** SEA_WATER_PROTOTYPE_TOP4
- **Kapasite ve Enerji Üretimi:** Kurulu gücü **600 MW** olan bu santral, günlük 7 saatlik tam yük üzerinden yaklaşık **4200 MWh** kapasiteye sahiptir.
- **Efektif Düşü ve Su Yolu Uzunluğu:** Su kütlesi yaklaşık **780 metre** aşağıya düşerek türbinleri çevirir. Bu esnada kat ettiği toplam cebri boru ve tünel hattı uzunluğu **9.5 km**'dir.
- **Koordinat Verileri:** Haritada harita işaretçisi (Lon: 33.95000, Lat: 36.37000) noktasına düşerken, asıl santral binasının yeraltı koordinatları (Lat: 36.37100, Lon: 33.95300) olarak belirlenmiştir.

### 18. Bozyazı-Anamur Deniz Suyu PSPP (`bozyazi_anamur`)
- **İl:** Mersin
- **Kaynak Grubu:** SEA_WATER_PROTOTYPE_TOP4
- **Kapasite ve Enerji Üretimi:** Kurulu gücü **700 MW** olan bu santral, günlük 7 saatlik tam yük üzerinden yaklaşık **4900 MWh** kapasiteye sahiptir.
- **Efektif Düşü ve Su Yolu Uzunluğu:** Su kütlesi yaklaşık **900 metre** aşağıya düşerek türbinleri çevirir. Bu esnada kat ettiği toplam cebri boru ve tünel hattı uzunluğu **11 km**'dir.
- **Koordinat Verileri:** Haritada harita işaretçisi (Lon: 32.99000, Lat: 36.12000) noktasına düşerken, asıl santral binasının yeraltı koordinatları (Lat: 36.12200, Lon: 32.96500) olarak belirlenmiştir.

### 19. Karaburun Sırtı Deniz Suyu PSPP (`karaburun`)
- **İl:** Izmir
- **Kaynak Grubu:** SEA_WATER_PROTOTYPE_TOP4
- **Kapasite ve Enerji Üretimi:** Kurulu gücü **500 MW** olan bu santral, günlük 7 saatlik tam yük üzerinden yaklaşık **3500 MWh** kapasiteye sahiptir.
- **Efektif Düşü ve Su Yolu Uzunluğu:** Su kütlesi yaklaşık **620 metre** aşağıya düşerek türbinleri çevirir. Bu esnada kat ettiği toplam cebri boru ve tünel hattı uzunluğu **6.5 km**'dir.
- **Koordinat Verileri:** Haritada harita işaretçisi (Lon: 26.57000, Lat: 38.63000) noktasına düşerken, asıl santral binasının yeraltı koordinatları (Lat: 38.63000, Lon: 26.53500) olarak belirlenmiştir.

### 20. Finike-Kumluca Deniz Suyu PDHES (`finike_kumluca`)
- **İl:** Antalya
- **Kaynak Grubu:** SEA_WATER_PROTOTYPE_TOP4
- **Kapasite ve Enerji Üretimi:** Kurulu gücü **520 MW** olan bu santral, günlük 7 saatlik tam yük üzerinden yaklaşık **3640 MWh** kapasiteye sahiptir.
- **Efektif Düşü ve Su Yolu Uzunluğu:** Su kütlesi yaklaşık **720 metre** aşağıya düşerek türbinleri çevirir. Bu esnada kat ettiği toplam cebri boru ve tünel hattı uzunluğu **8.6 km**'dir.
- **Koordinat Verileri:** Haritada harita işaretçisi (Lon: 30.18000, Lat: 36.36000) noktasına düşerken, asıl santral binasının yeraltı koordinatları (Lat: 36.36500, Lon: 30.18500) olarak belirlenmiştir.


---

## 6. Dünya PDHES Örnekleri (Kıyaslama ve Referans Sistemi)

Türkiye'nin adaylarını dünya standartlarında tartabilmek için global PDHES devleri, ada şebekesi projeleri ve deniz suyu (Sea-Water) örnekleri uygulamaya referans olarak eklenmiştir. Bu veriler dinamik bir API yerine derleme zamanında (Compile-time) tip güvenli (type-safe) TypeScript dizisi olarak `app/src/data/worldExamples.ts` içinde tutulmaktadır.

*(Aşağıdaki liste, dünya örneklerinin sistemdeki detaylı listesidir)*


### Fengning (Çin)
- **Kurulu Kapasite:** 3600 MW. (Bu değer santralin anlık olarak şebekeye verebildiği veya şebekeden çekebildiği maksimum gücü temsil eder.)
- **Efektif Düşü:** 425 metre. (Üst rezervuardan alt rezervuara akan suyun hidrolik potansiyel enerjisini belirleyen temel etken.)
- **İşletmeye Alınma Tarihi:** 2019–2024. (PDHES projeleri genelde uzun inşaat sürelerine sahiptir.)
- **Statü:** `partial_operation` olarak sisteme kaydedilmiştir. Aktif (Operational) veya prototip aşamasında olabilir.

### Bath County (ABD)
- **Kurulu Kapasite:** 3003 MW. (Bu değer santralin anlık olarak şebekeye verebildiği veya şebekeden çekebildiği maksimum gücü temsil eder.)
- **Efektif Düşü:** 380 metre. (Üst rezervuardan alt rezervuara akan suyun hidrolik potansiyel enerjisini belirleyen temel etken.)
- **İşletmeye Alınma Tarihi:** 1985. (PDHES projeleri genelde uzun inşaat sürelerine sahiptir.)
- **Statü:** `operational` olarak sisteme kaydedilmiştir. Aktif (Operational) veya prototip aşamasında olabilir.

### Kannagawa (Japonya)
- **Kurulu Kapasite:** 2820 MW. (Bu değer santralin anlık olarak şebekeye verebildiği veya şebekeden çekebildiği maksimum gücü temsil eder.)
- **Efektif Düşü:** 653 metre. (Üst rezervuardan alt rezervuara akan suyun hidrolik potansiyel enerjisini belirleyen temel etken.)
- **İşletmeye Alınma Tarihi:** 2005+. (PDHES projeleri genelde uzun inşaat sürelerine sahiptir.)
- **Statü:** `partial_operation` olarak sisteme kaydedilmiştir. Aktif (Operational) veya prototip aşamasında olabilir.

### Guangdong (Huizhou) (Çin)
- **Kurulu Kapasite:** 2448 MW. (Bu değer santralin anlık olarak şebekeye verebildiği veya şebekeden çekebildiği maksimum gücü temsil eder.)
- **Efektif Düşü:** 531 metre. (Üst rezervuardan alt rezervuara akan suyun hidrolik potansiyel enerjisini belirleyen temel etken.)
- **İşletmeye Alınma Tarihi:** 2011. (PDHES projeleri genelde uzun inşaat sürelerine sahiptir.)
- **Statü:** `operational` olarak sisteme kaydedilmiştir. Aktif (Operational) veya prototip aşamasında olabilir.

### Guangdong / Guangzhou (Çin)
- **Kurulu Kapasite:** 2400 MW. (Bu değer santralin anlık olarak şebekeye verebildiği veya şebekeden çekebildiği maksimum gücü temsil eder.)
- **Efektif Düşü:** 535 metre. (Üst rezervuardan alt rezervuara akan suyun hidrolik potansiyel enerjisini belirleyen temel etken.)
- **İşletmeye Alınma Tarihi:** 2000. (PDHES projeleri genelde uzun inşaat sürelerine sahiptir.)
- **Statü:** `operational` olarak sisteme kaydedilmiştir. Aktif (Operational) veya prototip aşamasında olabilir.

### Ludington (ABD)
- **Kurulu Kapasite:** 2172 MW. (Bu değer santralin anlık olarak şebekeye verebildiği veya şebekeden çekebildiği maksimum gücü temsil eder.)
- **Efektif Düşü:** 110 metre. (Üst rezervuardan alt rezervuara akan suyun hidrolik potansiyel enerjisini belirleyen temel etken.)
- **İşletmeye Alınma Tarihi:** 1973 / modernizasyon sonrası. (PDHES projeleri genelde uzun inşaat sürelerine sahiptir.)
- **Statü:** `operational` olarak sisteme kaydedilmiştir. Aktif (Operational) veya prototip aşamasında olabilir.

### Okutataragi (Japonya)
- **Kurulu Kapasite:** 1932 MW. (Bu değer santralin anlık olarak şebekeye verebildiği veya şebekeden çekebildiği maksimum gücü temsil eder.)
- **Efektif Düşü:** 387 metre. (Üst rezervuardan alt rezervuara akan suyun hidrolik potansiyel enerjisini belirleyen temel etken.)
- **İşletmeye Alınma Tarihi:** 1974. (PDHES projeleri genelde uzun inşaat sürelerine sahiptir.)
- **Statü:** `operational` olarak sisteme kaydedilmiştir. Aktif (Operational) veya prototip aşamasında olabilir.

### Tianhuangping (Çin)
- **Kurulu Kapasite:** 1836 MW. (Bu değer santralin anlık olarak şebekeye verebildiği veya şebekeden çekebildiği maksimum gücü temsil eder.)
- **Efektif Düşü:** 600 metre. (Üst rezervuardan alt rezervuara akan suyun hidrolik potansiyel enerjisini belirleyen temel etken.)
- **İşletmeye Alınma Tarihi:** 2001. (PDHES projeleri genelde uzun inşaat sürelerine sahiptir.)
- **Statü:** `operational` olarak sisteme kaydedilmiştir. Aktif (Operational) veya prototip aşamasında olabilir.

### Grand Maison (Fransa)
- **Kurulu Kapasite:** 1800 MW. (Bu değer santralin anlık olarak şebekeye verebildiği veya şebekeden çekebildiği maksimum gücü temsil eder.)
- **Efektif Düşü:** 920 metre. (Üst rezervuardan alt rezervuara akan suyun hidrolik potansiyel enerjisini belirleyen temel etken.)
- **İşletmeye Alınma Tarihi:** 1987. (PDHES projeleri genelde uzun inşaat sürelerine sahiptir.)
- **Statü:** `operational` olarak sisteme kaydedilmiştir. Aktif (Operational) veya prototip aşamasında olabilir.

### Dinorwig (Birleşik Krallık)
- **Kurulu Kapasite:** 1728 MW. (Bu değer santralin anlık olarak şebekeye verebildiği veya şebekeden çekebildiği maksimum gücü temsil eder.)
- **Efektif Düşü:** 542 metre. (Üst rezervuardan alt rezervuara akan suyun hidrolik potansiyel enerjisini belirleyen temel etken.)
- **İşletmeye Alınma Tarihi:** 1984. (PDHES projeleri genelde uzun inşaat sürelerine sahiptir.)
- **Statü:** `operational` olarak sisteme kaydedilmiştir. Aktif (Operational) veya prototip aşamasında olabilir.

### Raccoon Mountain (ABD)
- **Kurulu Kapasite:** 1652 MW. (Bu değer santralin anlık olarak şebekeye verebildiği veya şebekeden çekebildiği maksimum gücü temsil eder.)
- **Efektif Düşü:** 300 metre. (Üst rezervuardan alt rezervuara akan suyun hidrolik potansiyel enerjisini belirleyen temel etken.)
- **İşletmeye Alınma Tarihi:** 1978. (PDHES projeleri genelde uzun inşaat sürelerine sahiptir.)
- **Statü:** `operational` olarak sisteme kaydedilmiştir. Aktif (Operational) veya prototip aşamasında olabilir.

### Kazunogawa (Japonya)
- **Kurulu Kapasite:** 1600 MW. (Bu değer santralin anlık olarak şebekeye verebildiği veya şebekeden çekebildiği maksimum gücü temsil eder.)
- **Efektif Düşü:** 714 metre. (Üst rezervuardan alt rezervuara akan suyun hidrolik potansiyel enerjisini belirleyen temel etken.)
- **İşletmeye Alınma Tarihi:** 1999. (PDHES projeleri genelde uzun inşaat sürelerine sahiptir.)
- **Statü:** `partial_operation` olarak sisteme kaydedilmiştir. Aktif (Operational) veya prototip aşamasında olabilir.

### La Muela II / Cortes-La Muela (İspanya)
- **Kurulu Kapasite:** 1490 MW. (Bu değer santralin anlık olarak şebekeye verebildiği veya şebekeden çekebildiği maksimum gücü temsil eder.)
- **Efektif Düşü:** 500 metre. (Üst rezervuardan alt rezervuara akan suyun hidrolik potansiyel enerjisini belirleyen temel etken.)
- **İşletmeye Alınma Tarihi:** 1989 / 2013 genişleme. (PDHES projeleri genelde uzun inşaat sürelerine sahiptir.)
- **Statü:** `operational` olarak sisteme kaydedilmiştir. Aktif (Operational) veya prototip aşamasında olabilir.

### Linth-Limmern / Linthal 2015 (İsviçre)
- **Kurulu Kapasite:** 1480 MW. (Bu değer santralin anlık olarak şebekeye verebildiği veya şebekeden çekebildiği maksimum gücü temsil eder.)
- **Efektif Düşü:** 630 metre. (Üst rezervuardan alt rezervuara akan suyun hidrolik potansiyel enerjisini belirleyen temel etken.)
- **İşletmeye Alınma Tarihi:** 2016. (PDHES projeleri genelde uzun inşaat sürelerine sahiptir.)
- **Statü:** `operational` olarak sisteme kaydedilmiştir. Aktif (Operational) veya prototip aşamasında olabilir.

### Vianden (Lüksemburg)
- **Kurulu Kapasite:** 1224 MW. (Bu değer santralin anlık olarak şebekeye verebildiği veya şebekeden çekebildiği maksimum gücü temsil eder.)
- **Efektif Düşü:** 280 metre. (Üst rezervuardan alt rezervuara akan suyun hidrolik potansiyel enerjisini belirleyen temel etken.)
- **İşletmeye Alınma Tarihi:** 1964+. (PDHES projeleri genelde uzun inşaat sürelerine sahiptir.)
- **Statü:** `operational` olarak sisteme kaydedilmiştir. Aktif (Operational) veya prototip aşamasında olabilir.

### Hohhot (Çin)
- **Kurulu Kapasite:** 1224 MW. (Bu değer santralin anlık olarak şebekeye verebildiği veya şebekeden çekebildiği maksimum gücü temsil eder.)
- **Efektif Düşü:** 521 metre. (Üst rezervuardan alt rezervuara akan suyun hidrolik potansiyel enerjisini belirleyen temel etken.)
- **İşletmeye Alınma Tarihi:** 2014. (PDHES projeleri genelde uzun inşaat sürelerine sahiptir.)
- **Statü:** `operational` olarak sisteme kaydedilmiştir. Aktif (Operational) veya prototip aşamasında olabilir.

### Helms (ABD)
- **Kurulu Kapasite:** 1212 MW. (Bu değer santralin anlık olarak şebekeye verebildiği veya şebekeden çekebildiği maksimum gücü temsil eder.)
- **Efektif Düşü:** 500 metre. (Üst rezervuardan alt rezervuara akan suyun hidrolik potansiyel enerjisini belirleyen temel etken.)
- **İşletmeye Alınma Tarihi:** 1984. (PDHES projeleri genelde uzun inşaat sürelerine sahiptir.)
- **Statü:** `operational` olarak sisteme kaydedilmiştir. Aktif (Operational) veya prototip aşamasında olabilir.

### Coo-Trois-Ponts (Belçika)
- **Kurulu Kapasite:** 1164 MW. (Bu değer santralin anlık olarak şebekeye verebildiği veya şebekeden çekebildiği maksimum gücü temsil eder.)
- **Efektif Düşü:** 230 metre. (Üst rezervuardan alt rezervuara akan suyun hidrolik potansiyel enerjisini belirleyen temel etken.)
- **İşletmeye Alınma Tarihi:** 1972. (PDHES projeleri genelde uzun inşaat sürelerine sahiptir.)
- **Statü:** `operational` olarak sisteme kaydedilmiştir. Aktif (Operational) veya prototip aşamasında olabilir.

### Blenheim-Gilboa (ABD)
- **Kurulu Kapasite:** 1160 MW. (Bu değer santralin anlık olarak şebekeye verebildiği veya şebekeden çekebildiği maksimum gücü temsil eder.)
- **Efektif Düşü:** 335 metre. (Üst rezervuardan alt rezervuara akan suyun hidrolik potansiyel enerjisini belirleyen temel etken.)
- **İşletmeye Alınma Tarihi:** 1973. (PDHES projeleri genelde uzun inşaat sürelerine sahiptir.)
- **Statü:** `operational` olarak sisteme kaydedilmiştir. Aktif (Operational) veya prototip aşamasında olabilir.

### Shintoyone (Japonya)
- **Kurulu Kapasite:** 1125 MW. (Bu değer santralin anlık olarak şebekeye verebildiği veya şebekeden çekebildiği maksimum gücü temsil eder.)
- **Efektif Düşü:** 203 metre. (Üst rezervuardan alt rezervuara akan suyun hidrolik potansiyel enerjisini belirleyen temel etken.)
- **İşletmeye Alınma Tarihi:** 1972. (PDHES projeleri genelde uzun inşaat sürelerine sahiptir.)
- **Statü:** `operational` olarak sisteme kaydedilmiştir. Aktif (Operational) veya prototip aşamasında olabilir.

### Goldisthal (Almanya)
- **Kurulu Kapasite:** 1060 MW. (Bu değer santralin anlık olarak şebekeye verebildiği veya şebekeden çekebildiği maksimum gücü temsil eder.)
- **Efektif Düşü:** 302 metre. (Üst rezervuardan alt rezervuara akan suyun hidrolik potansiyel enerjisini belirleyen temel etken.)
- **İşletmeye Alınma Tarihi:** 2003. (PDHES projeleri genelde uzun inşaat sürelerine sahiptir.)
- **Statü:** `operational` olarak sisteme kaydedilmiştir. Aktif (Operational) veya prototip aşamasında olabilir.

### Siah Bishe (İran)
- **Kurulu Kapasite:** 1040 MW. (Bu değer santralin anlık olarak şebekeye verebildiği veya şebekeden çekebildiği maksimum gücü temsil eder.)
- **Efektif Düşü:** 520 metre. (Üst rezervuardan alt rezervuara akan suyun hidrolik potansiyel enerjisini belirleyen temel etken.)
- **İşletmeye Alınma Tarihi:** 2015. (PDHES projeleri genelde uzun inşaat sürelerine sahiptir.)
- **Statü:** `operational` olarak sisteme kaydedilmiştir. Aktif (Operational) veya prototip aşamasında olabilir.

### Presenzano (Domenico Cimarosa) PSPP (İtalya)
- **Kurulu Kapasite:** 1000 MW. (Bu değer santralin anlık olarak şebekeye verebildiği veya şebekeden çekebildiği maksimum gücü temsil eder.)
- **Efektif Düşü:** 498 metre. (Üst rezervuardan alt rezervuara akan suyun hidrolik potansiyel enerjisini belirleyen temel etken.)
- **İşletmeye Alınma Tarihi:** 1992. (PDHES projeleri genelde uzun inşaat sürelerine sahiptir.)
- **Statü:** `operational` olarak sisteme kaydedilmiştir. Aktif (Operational) veya prototip aşamasında olabilir.

### Drakensberg (Güney Afrika)
- **Kurulu Kapasite:** 1000 MW. (Bu değer santralin anlık olarak şebekeye verebildiği veya şebekeden çekebildiği maksimum gücü temsil eder.)
- **Efektif Düşü:** 470 metre. (Üst rezervuardan alt rezervuara akan suyun hidrolik potansiyel enerjisini belirleyen temel etken.)
- **İşletmeye Alınma Tarihi:** 1981. (PDHES projeleri genelde uzun inşaat sürelerine sahiptir.)
- **Statü:** `operational` olarak sisteme kaydedilmiştir. Aktif (Operational) veya prototip aşamasında olabilir.

### Nant de Drance (İsviçre)
- **Kurulu Kapasite:** 900 MW. (Bu değer santralin anlık olarak şebekeye verebildiği veya şebekeden çekebildiği maksimum gücü temsil eder.)
- **Efektif Düşü:** 250 metre. (Üst rezervuardan alt rezervuara akan suyun hidrolik potansiyel enerjisini belirleyen temel etken.)
- **İşletmeye Alınma Tarihi:** 2022. (PDHES projeleri genelde uzun inşaat sürelerine sahiptir.)
- **Statü:** `operational` olarak sisteme kaydedilmiştir. Aktif (Operational) veya prototip aşamasında olabilir.

### Kopswerk II (Avusturya)
- **Kurulu Kapasite:** 525 MW. (Bu değer santralin anlık olarak şebekeye verebildiği veya şebekeden çekebildiği maksimum gücü temsil eder.)
- **Efektif Düşü:** 818 metre. (Üst rezervuardan alt rezervuara akan suyun hidrolik potansiyel enerjisini belirleyen temel etken.)
- **İşletmeye Alınma Tarihi:** 2008. (PDHES projeleri genelde uzun inşaat sürelerine sahiptir.)
- **Statü:** `operational` olarak sisteme kaydedilmiştir. Aktif (Operational) veya prototip aşamasında olabilir.

### Limberg II (Avusturya)
- **Kurulu Kapasite:** 480 MW. (Bu değer santralin anlık olarak şebekeye verebildiği veya şebekeden çekebildiği maksimum gücü temsil eder.)
- **Efektif Düşü:** 365 metre. (Üst rezervuardan alt rezervuara akan suyun hidrolik potansiyel enerjisini belirleyen temel etken.)
- **İşletmeye Alınma Tarihi:** 2011. (PDHES projeleri genelde uzun inşaat sürelerine sahiptir.)
- **Statü:** `operational` olarak sisteme kaydedilmiştir. Aktif (Operational) veya prototip aşamasında olabilir.

### Cruachan (Birleşik Krallık)
- **Kurulu Kapasite:** 440 MW. (Bu değer santralin anlık olarak şebekeye verebildiği veya şebekeden çekebildiği maksimum gücü temsil eder.)
- **Efektif Düşü:** 365 metre. (Üst rezervuardan alt rezervuara akan suyun hidrolik potansiyel enerjisini belirleyen temel etken.)
- **İşletmeye Alınma Tarihi:** 1965. (PDHES projeleri genelde uzun inşaat sürelerine sahiptir.)
- **Statü:** `operational` olarak sisteme kaydedilmiştir. Aktif (Operational) veya prototip aşamasında olabilir.

### Ffestiniog (Birleşik Krallık)
- **Kurulu Kapasite:** 360 MW. (Bu değer santralin anlık olarak şebekeye verebildiği veya şebekeden çekebildiği maksimum gücü temsil eder.)
- **Efektif Düşü:** 320 metre. (Üst rezervuardan alt rezervuara akan suyun hidrolik potansiyel enerjisini belirleyen temel etken.)
- **İşletmeye Alınma Tarihi:** 1963. (PDHES projeleri genelde uzun inşaat sürelerine sahiptir.)
- **Statü:** `operational` olarak sisteme kaydedilmiştir. Aktif (Operational) veya prototip aşamasında olabilir.

### Turlough Hill (İrlanda)
- **Kurulu Kapasite:** 292 MW. (Bu değer santralin anlık olarak şebekeye verebildiği veya şebekeden çekebildiği maksimum gücü temsil eder.)
- **Efektif Düşü:** 286 metre. (Üst rezervuardan alt rezervuara akan suyun hidrolik potansiyel enerjisini belirleyen temel etken.)
- **İşletmeye Alınma Tarihi:** 1974. (PDHES projeleri genelde uzun inşaat sürelerine sahiptir.)
- **Statü:** `operational` olarak sisteme kaydedilmiştir. Aktif (Operational) veya prototip aşamasında olabilir.

### Okinawa Yanbaru (Japonya)
- **Kurulu Kapasite:** 30 MW. (Bu değer santralin anlık olarak şebekeye verebildiği veya şebekeden çekebildiği maksimum gücü temsil eder.)
- **Efektif Düşü:** 136 metre. (Üst rezervuardan alt rezervuara akan suyun hidrolik potansiyel enerjisini belirleyen temel etken.)
- **İşletmeye Alınma Tarihi:** 1999 / 2016 söküldü. (PDHES projeleri genelde uzun inşaat sürelerine sahiptir.)
- **Statü:** `decommissioned` olarak sisteme kaydedilmiştir. Aktif (Operational) veya prototip aşamasında olabilir.


---

## 7. Harita (GIS) ve 3D Poligon (Footprint) Mimarisi Detayları

Bu uygulama, standart 2D haritalama yerine Mapbox GL altyapısının 3D (Pitch & Extrusion) yeteneklerini kullanarak, dağlık topoğrafyada (Digital Elevation Model - DEM) hidroelektrik bileşenlerini görselleştirir. `src/utils/layout3dFootprints.ts` gibi yardımcı kod dosyaları bu yapıyı render eder.

### 7.1. Veritabanı Yapısı (Footprints)
`data.json` içindeki her adayın koordinat düğümünde devasa bir `layout3D.componentFootprints` dizisi barındırılmaktadır. Bu dizi, binlerce enlem-boylam-yükseklik `[lon, lat, elevation]` setinden oluşan Array-of-Array (GeoJSON Polygon) formasyonuna sahiptir.

Örnek bir santralin poligon bloğunda şu materyal (`Material`) yapı taşları bulunur:
1. **`water` (Su Kütlesi Katmanı):** Hem üst (Upper) hem alt (Lower) rezervuarlarda suyu temsil eder. Açık mavi renkle (Hex: `#2980b9` vb.) ve hafif saydam (`opacity: 0.6`) olarak renderlanır. Topoğrafya üzerinde gerçekçi göl silüeti yaratır.
2. **`embankment` (Dolgu/Baraj Seddesi):** Su kütlesini sınırlandıran yapay setlerdir. Açık kahverengi veya gri tonlarında modellenir. Toprak, kaya dolgu veya RCC (Silindirle Sıkıştırılmış Beton) baraj yüzeyini temsil eder.
3. **`tunnel_axis` (Tünel / Cebri Boru Ekseni):** Yerin altından geçen ana basınçlı su borularıdır. Mapbox'ta bu hatlar (LineString) saydam topoğrafyanın altında kalacak şekilde `baseElevationM` (Z ekseninde kot değeri) ve `extrudeM` parametreleriyle yerin 200-400 metre altına gömülür. Rengi uyarıcı kırmızı (`#e74c3c`) olarak seçilir.
4. **`industrial` / `switchyard` (Şalt Sahası):** Transformatörlerin bulunduğu açık beton alanlardır. Koyu gri ve yüzey yükseltisi az poligonlardır.
5. **`shaft_portal` (Denge Bacası / Şaft Girişi):** Dağların zirvelerine yakın konumlandırılmış erişim ve havalandırma (Surge Tank) bacalarını temsil eder.

### 7.2. Performans Optimizasyonu
Binlerce koordinat içeren poligonların performansı düşürmemesi için, `ThreeDPage.tsx` içerisinde Mapbox'ın `useMemo` tabanlı Layer & Source optimizasyonları kullanılmıştır. Yalnızca kamera görüş alanına (Viewport) giren poligonlar (Frustum culling mantığıyla Mapbox tarafından) çizilir.

---

## 8. Kurulum ve Yerel Geliştirme Ortamı (Local Development Setup)

Proje React tabanlı olup Vite ile saniyeler içinde derlenmektedir. Yerel bilgisayarınızda (Localhost) çalıştırmak, kodları incelemek veya projeye katkı sağlamak (Contribute) için aşağıdaki adımları izleyebilirsiniz:

### 8.1. Sistem Gereksinimleri:
- **Node.js:** v16.14.0 LTS veya daha güncel bir sürüm.
- **Paket Yöneticisi:** NPM (Node Package Manager) veya Yarn.
- **Harita Kimliği:** Mapbox Access Token. (Kişisel Mapbox hesabınızdan alacağınız ücretsiz API anahtarı).

### 8.2. Başlangıç Adımları:
1. Git Reposunu yerel makinenize klonlayın:
   ```bash
   git clone https://github.com/murathany90/pdhes.git
   ```
2. Terminal (Komut satırı) üzerinden `app` klasörüne (Ana Proje Dizini) giriş yapın:
   ```bash
   cd zPompaj_DHES/app
   ```
3. Paket yöneticisini kullanarak `package.json` içindeki tüm bağımlılıkları (Dependencies) indirin:
   ```bash
   npm install
   ```
4. `app` klasörü içine yeni bir `.env` (veya `.env.local`) dosyası oluşturun ve içerisine Mapbox anahtarınızı ortam değişkeni (Environment variable) olarak ekleyin:
   ```env
   VITE_MAPBOX_TOKEN=pk.your-secret-mapbox-token-goes-here-12345
   ```
5. Son olarak `vite` geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```
   Uygulamanız varsayılan olarak `http://localhost:5173` portunda çalışmaya başlayacaktır.

### 8.3. Kalite Kontrol (Test Ortamı ve QA)
Yazılımın kalitesi ve Zod şema bütünlüğü sıkı kurallarla test edilir. Projede 60'tan fazla Unit Test (Birim Testi) ve A11y (Ulaşılabilirlik / Erişilebilirlik) testi mevcuttur.
- Çalışan testleri anlık görmek ve dosyalarda değişiklik yaptıkça otomatik tetiklemek için:
  ```bash
  npm run test:run
  ```
- `data.json` veritabanının bütünlüğünü denetleyen ve eksik parametre varsa (örn. `capacityMW` girilmemişse) uyarı veren özel script:
  ```bash
  npm run test (veya check-data.test.mjs)
  ```
- Tip denetimleri (TypeScript errors): `npm run typecheck`

---

## 9. Dosya Hiyerarşisi ve Modüller

Tüm bu özellikler modüler bir dosya hiyerarşisi ile organize edilmiştir:
```bash
app/
├── public/
│   ├── data.json              # Adayların merkez veritabanı (JSON)
│   └── favicon.svg            # Site ikonu
├── src/
│   ├── components/
│   │   ├── layout/            # Navbar, Hata sayfaları vb.
│   │   └── ui/                # Butonlar, Modal, Uyarı banner'ları
│   ├── data/
│   │   └── worldExamples.ts   # Dünya referans örnekleri listesi
│   ├── hooks/
│   │   └── useAppData.ts      # Zustand durum yönetimi
│   ├── pages/
│   │   ├── DataPage.tsx       # Aday tabloları sekmesi
│   │   ├── MapPage.tsx        # 2D Harita sekmesi
│   │   ├── ThreeDPage.tsx     # 3D Modeller sekmesi
│   │   ├── ReportsPage.tsx    # Makale ve Literatür sekmesi
│   │   └── SettingsPage.tsx   # Ayarlar sekmesi
│   ├── types/
│   │   └── site.ts            # TypeScript veri arayüzleri (Interface)
│   ├── utils/
│   │   ├── layout3dFootprints.ts # 3D Rendering mantığı
│   │   ├── siteSchema.ts      # Zod validasyon şeması
│   │   └── siteTableMetrics.ts# Finansal/teknik hesaplamalar
│   └── App.tsx                # Ana yönlendirici (Router)
```

---

## 10. Gelecek Vizyonu ve Geliştirme Yol Haritası (Roadmap)

Açık kaynak dünyasının katkılarıyla platformu gelecekte daha da ileri seviyelere taşımak için planlanan özellikler:
- **Yenilenebilir Enerji Hibritlemesi (Solar + Pumped Hydro):** Mevcut baraj göllerine (Alt Rezervuar) Yüzer Güneş Enerjisi (Floating Solar PV) panelleri eklenerek kapalı havza buharlaşmasını azaltan hibrit simülasyonların arayüze eklenmesi.
- **Gerçek Zamanlı EPİAŞ / PTF Entegrasyonu:** Piyasa Takas Fiyatı (PTF) API'leri canlı (WebSocket ile) bağlanarak saatlik, haftalık ve mevsimsel arbitraj kâr marjı simülasyonları yapılması. Karlılık algoritmasının dinamik hale gelmesi.
- **Yapay Zeka Destekli Rotalama (AI Penstock Routing):** Topoğrafyaya (Elevation profile) ve kaya zemin mekaniğine (Geology) tam uyumlu, cebri boru rotasını en az hafriyat maliyetiyle kendi çizen A-Star tabanlı yol bulma (Pathfinding) algoritması eklentisi.

> *"Türkiye'nin yeşil enerji dönüşümü, depolama esnekliğinden; depolama esnekliği ise pompajlı devasa su bataryalarından geçer..."*

