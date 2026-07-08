# Türkiye PDHES Potansiyeli

Türkiye'deki pompaj depolamalı hidroelektrik santral (PDHES) adaylarını veri, harita, kavramsal 3D yerleşim, risk notları ve senaryo hesaplarıyla inceleyen açık web demosu.

> **Uyarı:** Bu uygulama yatırım tavsiyesi, fizibilite raporu, mühendislik tasarımı veya resmi TEİAŞ/DSİ/EPDK/ÇED görüşü değildir. Eğitim ve masaüstü ön inceleme demosudur. Koordinatlar, teknik değerler ve ekonomik varsayımlar kesin konum veya yatırım kararı olarak sunulmaz. Tüm 3D çizimler, şebeke bağlantı noktaları ve havuz alanları DEM tabanlı otomatik kavramsal çizimlerdir.

## İçindekiler
1. [Veri Kurgusu ve Teknik Sınıflandırma](#veri-kurgusu-ve-teknik-sınıflandırma)
2. [Finansal ve Ekonomik Metodoloji (GÖKAY)](#finansal-ve-ekonomik-metodoloji-gökay)
3. [Türkiye PDHES Adayları Listesi ve Detayları](#türkiye-pdhes-adayları-listesi-ve-detayları)
4. [3D Çizim ve Kavramsal Yerleşim Parametreleri](#3d-cizim-ve-kavramsal-yerlesim-parametreleri)
5. [Dünya PDHES Örnekleri](#dünya-pdhes-örnekleri)

---

## Veri Kurgusu ve Teknik Sınıflandırma

Uygulamanın merkezindeki aday havuzu `app/public/data.json` dosyası içinde tutulmaktadır ve güncel verilere göre tam 20 kayıt barındırır. Bu adayların dağılımı şu şekildedir:
- **16 adet `JICA_EIE_16` kaynak grubu:** JICA ve Mülga EİE etütlerinden süzülmüş, potansiyeli ve saha etüdü görece ilerlemiş kavramsal adaylar (Gökçekaya, İznik, Sarıyar vb.).
- **4 adet `SEA_WATER_PROTOTYPE_TOP4` kaynak grubu:** Mevcut Türkiye kıyı şeridinde deniz suyu kullanan (Sea-Water Pumped Storage) PDHES prototipi olarak skorlama algoritması ile seçilmiş adaylar (Taşucu, Bozyazı Anamur, Karaburun, Finike Kumluca).

**Teknik Sınıflandırma (Technical Classification):**
Her adayın yapısal tipi (`infrastructureType`), çevrim tipi (`cycleType`), konsept tipi (`conceptType`) ve ana amacı (`primaryPurpose`) veri modelinde (`Site` arayüzünde) belirtilmiştir. Sistem, *Tamamen Yeni (Pure New Build)*, *Mevcut Baraja Entegre (Existing Reservoir Integrated)* gibi altyapı kodlarını filtreleme altyapısında dinamik olarak yönetir. 

Mevcut durumda 16 JICA adayı tatlı su havzalarında iken, Deniz Suyu konseptli 4 aday doğrudan okyanus/deniz tabanlı açık çevrim olarak sistemde işlenmiştir.

---

## Finansal ve Ekonomik Metodoloji (GÖKAY)

Maliyet ve kârlılık gibi geri ödeme süresi (Amortisman - Payback Year) metrikleri, "Kaynak" (`source`) veri yoksa "Senaryo" (`scenario`) fonksiyonu ile sistemde formüle dayalı dinamik hesaplanmaktadır. 
Ancak sistemdeki **16 JICA/EİE adayı için akademik çalışmalardaki (GÖKAY yaklaşımı) ve JICA'nın Türkiye ölçek ekonomisi parametrelerine** göre şu sabit veriler (Kaynak Verisi) entegre edilmiştir:

### Hesaba Katılan Parametreler:
1. **Tahmini Yatırım Maliyeti (Capex):** JICA'nın büyük tesisler için uyguladığı ölçek ekonomisi tablosu (1500-1600 MW için ~750 $/kW, 1000 MW için ~940 $/kW, 500 MW için ~1100 $/kW ve 300 MW için ~1200 $/kW) referans alınmıştır. Dünya ortalaması olan 2500-3500 $/kW yerine Türkiye'nin mevcut inşaat kapasitesi ve JICA optimizasyonu kullanılmıştır.
2. **Yıllık Gelir (Brüt Kar):** Türkiye elektrik piyasası şartlarında, optimum günlük **7.59 saat maksimum kapasite (tam yük)** çalışma süresi ve **18.49 USD/MWh'lik saatlik ortalama elektrik piyasası arbitraj marjı** (alım-satım farkı) üzerinden hesaplanmıştır.
   *Formül: `Kurulu Güç (MW) x 7.59 saat x 365 gün x 18.49 USD = Tahmini Yıllık Kar`*
3. **Tahmini Enerji Üretimi:** "7 saatlik tam yükte pik çalışma" (Peak Duration Time: 7 hrs) standardı kullanılarak, santrallerin kurulu güçlerinin 7 ile çarpılmasıyla (`MW x 7`) hesaplanmış enerji verileri.

*Önemli Not: Gökçekaya projesi JICA optimizasyonuyla aslında 1400 MW güce düşürülerek $1.098 Milyar yatırım değerine sahip olsa da, orijinal liste hiyerarşisinde Gökçekaya için de akademik orantı kullanılmış; `data.json` sistemine kesinleşen 1400 MW kurulu güç, 379,5 m efektif düşü ve 4.051 m toplam su yolu uzunluğu (Waterway Length) baz alınarak işlenmiştir.*

---

## Türkiye PDHES Adayları Listesi ve Detayları

Toplam 20 adayın veri yapısındaki temel kapasite, enerji (MWh), düşü, su yolu uzunluğu, finansal geri dönüş ve koordinat özellikleri aşağıda listelenmiştir.

| Sıra | ID | Santral Adı | Kapasite / Enerji | Düşü / Su Yolu | Koordinat (Lat, Lon) | Harita Odak Noktası (Lon, Lat) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `jica-gokcekaya-pspp` | **Gökçekaya PDHES** | 1400 MW / 9800 MWh | 379.5 m / 4051 m | (40.02560, 31.00560) | (31.02100, 40.03500) |
| 2 | `jica-iznik-i-pspp` | **İznik I PDHES** | 1500 MW / 10500 MWh | 255 m / - | (40.44000, 29.51000) | (29.50000, 40.46480) |
| 3 | `jica-sariyar-pspp` | **Sarıyar PDHES** | 1000 MW / 7000 MWh | 434 m / 1797 m | (40.03700, 31.40950) | (31.39085, 40.05495) |
| 4 | `jica-bayramhacili-pspp` | **Bayramhacılı PDHES** | 1000 MW / 7000 MWh | 161 m / 465 m | (38.75200, 34.85000) | (34.83900, 38.77000) |
| 5 | `jica-hasan-ugurlu-pspp` | **Hasan Uğurlu PDHES** | 1000 MW / 7000 MWh | 570 m / 1600 m | (40.99500, 36.62000) | (36.62000, 41.00000) |
| 6 | `jica-adiguzel-pspp` | **Adıgüzel PDHES** | 1000 MW / 7000 MWh | 242 m / 966 m | (38.16300, 29.20500) | (29.19020, 38.17200) |
| 7 | `jica-burdur-pspp` | **Burdur PDHES** | 1000 MW / 7000 MWh | 370 m / - | (37.73500, 30.24000) | (30.21250, 37.74750) |
| 8 | `jica-egirdir-pspp` | **Eğirdir PDHES** | 1000 MW / 7000 MWh | 672 m / - | (37.88300, 30.85000) | (30.82750, 37.90000) |
| 9 | `jica-kargi-pspp` | **Kargı PDHES** | 1000 MW / 7000 MWh | 496 m / 2762 m | (40.08000, 31.79800) | (31.78500, 40.09350) |
| 10 | `jica-karacaoren-ii-pspp` | **Karacaören II PDHES** | 1000 MW / 7000 MWh | 615 m / - | (37.31000, 30.80200) | (30.78185, 37.32830) |
| 11 | `jica-yalova-pspp` | **Yalova PDHES** | 500 MW / 3500 MWh | 400 m / 1100 m | (40.60800, 29.21000) | (29.19250, 40.61250) |
| 12 | `jica-yamula-pspp` | **Yamula PDHES** | 500 MW / 3500 MWh | 260 m / 1920 m | (38.90500, 35.26500) | (35.24540, 38.91360) |
| 13 | `jica-oymapinar-pspp` | **Oymapınar PDHES** | 500 MW / 3500 MWh | 372 m / 919 m | (36.91000, 31.50300) | (31.52500, 36.88900) |
| 14 | `jica-aslantas-pspp` | **Aslantaş PDHES** | 500 MW / 3500 MWh | 154 m / 1100 m | (37.27600, 36.26500) | (36.24540, 37.28740) |
| 15 | `jica-iznik-ii-pspp` | **İznik II PDHES** | 500 MW / 3500 MWh | 263 m / - | (40.41500, 29.66500) | (29.69000, 40.39000) |
| 16 | `jica-demirkopru-pspp` | **Demirköprü PDHES** | 300 MW / 2100 MWh | 213 m / 1462 m | (38.62000, 28.30500) | (28.29075, 38.62840) |
| 17 | `tasucu` | **Taşucu-Gülnar Deniz Suyu PSPP** | 600 MW / 4200 MWh | 780 m / 9.5 km | (36.37100, 33.95300) | (33.95000, 36.37000) |
| 18 | `bozyazi_anamur` | **Bozyazı-Anamur Deniz Suyu PSPP** | 700 MW / 4900 MWh | 900 m / 11 km | (36.12200, 32.96500) | (32.99000, 36.12000) |
| 19 | `karaburun` | **Karaburun Sırtı Deniz Suyu PSPP** | 500 MW / 3500 MWh | 620 m / 6.5 km | (38.63000, 26.53500) | (26.57000, 38.63000) |
| 20 | `finike_kumluca` | **Finike-Kumluca Deniz Suyu PDHES** | 520 MW / 3640 MWh | 720 m / 8.6 km | (36.36500, 30.18500) | (30.18000, 36.36000) |


---

## 3D Çizim ve Kavramsal Yerleşim Parametreleri

Sistem, veritabanındaki coğrafi `coordinates` alt objesi sayesinde, React-Map-GL (Mapbox GL) arayüzünde santralin bileşenlerini (üst rezervuar, alt rezervuar, santral binası, şaft, cebri boru ve şalt sahası) çizebilmektedir. Her bir adayın 3D yerleşim ve poligon parametreleri (Footprints) şöyledir:

### Model ve Terrain Özellikleri:
Tüm adaylarda `model3d` özelliği aşağıdaki render konfigürasyonlarını içerir:
- `terrainMode`: `real-dem-if-available-else-procedural` (Türkiye Topoğrafyası üzerinden 3D Yükseklik Verisi kullanır).
- `lowerReservoirMode`: Adayın tipine göre `existing-dam-lake`, `sea` veya `artificial-lower-pond`.
- `upperReservoirMode`: Genellikle `concrete-lined-pool` (Beton kaplı suni havuz) veya `geomembrane-or-conceptual-pool` (Jeomembran kaplı sızdırmaz rezervuar).
- `powerhouseMode`: `underground-cavern` (Yeraltı Santral Binası) 
- `penstockMode`: `shaft-plus-pressure-tunnel` veya `surface-or-buried-penstock`

### Poligon (Footprint) Yapısı:
Sistemde binlerce koordinat noktasından oluşan `layout3D.componentFootprints` verisi barındırılmaktadır. Bu koordinatlar sayesinde 3 Boyutlu olarak şu bileşenler inşa edilir:
- **Water (Su Kütlesi):** Alt ve Üst rezervuar su alanları.
- **Embankment (Dolgu/Baraj Gövdesi):** Toprak veya kaya dolgu yapılar.
- **Tunnel Axis (Tünel Ekseni):** Yeraltında uzanan su yolları ve cebri boru (penstock) hatları.
- **Shaft & Portal:** Havalandırma, denge bacası ve erişim tüneli portalları.
- **Switchyard:** Şalt sahası ve şebeke bağlantı noktaları.

---

## Dünya PDHES Örnekleri

Türkiye'deki potansiyel adayların büyüklüğünü ve kapasitesini kıyaslamak, global çaptaki PDHES (Pumped-Storage Hydroelectricity) vizyonunu göstermek için referans alınan bazı dünya devleri ve istisnai mühendislik örnekleri uygulamada bulunur (`app/src/data/worldExamples.ts`).

*(Aşağıdaki tablo, dünya örneklerinin sistemdeki listesidir. Sıralama genelde kapasiteye göredir)*

| Santral Adı | Ülke | Kapasite (MW) | Düşü (m) | İşletmeye Alınma | Durum |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Fengning** | Çin | 3600 MW | 425 m | 2019–2024 | partial_operation |
| **Bath County** | ABD | 3003 MW | 380 m | 1985 | operational |
| **Kannagawa** | Japonya | 2820 MW | 653 m | 2005+ | partial_operation |
| **Guangdong (Huizhou)** | Çin | 2448 MW | 531 m | 2011 | operational |
| **Guangdong / Guangzhou** | Çin | 2400 MW | 535 m | 2000 | operational |
| **Ludington** | ABD | 2172 MW | 110 m | 1973 / modernizasyon sonrası | operational |
| **Okutataragi** | Japonya | 1932 MW | 387 m | 1974 | operational |
| **Tianhuangping** | Çin | 1836 MW | 600 m | 2001 | operational |
| **Grand Maison** | Fransa | 1800 MW | 920 m | 1987 | operational |
| **Dinorwig** | Birleşik Krallık | 1728 MW | 542 m | 1984 | operational |
| **Raccoon Mountain** | ABD | 1652 MW | 300 m | 1978 | operational |
| **Kazunogawa** | Japonya | 1600 MW | 714 m | 1999 | partial_operation |
| **La Muela II / Cortes-La Muela** | İspanya | 1490 MW | 500 m | 1989 / 2013 genişleme | operational |
| **Linth-Limmern / Linthal 2015** | İsviçre | 1480 MW | 630 m | 2016 | operational |
| **Vianden** | Lüksemburg | 1224 MW | 280 m | 1964+ | operational |
| **Hohhot** | Çin | 1224 MW | 521 m | 2014 | operational |
| **Helms** | ABD | 1212 MW | 500 m | 1984 | operational |
| **Coo-Trois-Ponts** | Belçika | 1164 MW | 230 m | 1972 | operational |
| **Blenheim-Gilboa** | ABD | 1160 MW | 335 m | 1973 | operational |
| **Shintoyone** | Japonya | 1125 MW | 203 m | 1972 | operational |
| **Goldisthal** | Almanya | 1060 MW | 302 m | 2003 | operational |
| **Siah Bishe** | İran | 1040 MW | 520 m | 2015 | operational |
| **Presenzano (Domenico Cimarosa) PSPP** | İtalya | 1000 MW | 498 m | 1992 | operational |
| **Drakensberg** | Güney Afrika | 1000 MW | 470 m | 1981 | operational |
| **Nant de Drance** | İsviçre | 900 MW | 250 m | 2022 | operational |
| **Kopswerk II** | Avusturya | 525 MW | 818 m | 2008 | operational |
| **Limberg II** | Avusturya | 480 MW | 365 m | 2011 | operational |
| **Cruachan** | Birleşik Krallık | 440 MW | 365 m | 1965 | operational |
| **Ffestiniog** | Birleşik Krallık | 360 MW | 320 m | 1963 | operational |
| **Turlough Hill** | İrlanda | 292 MW | 286 m | 1974 | operational |
| **Okinawa Yanbaru** | Japonya | 30 MW | 136 m | 1999 / 2016 söküldü | decommissioned |


> Not: Bu projeye katkıda bulunmak veya yerel ortamda çalıştırmak için `app` klasörüne gidip `npm install` ve `npm run dev` komutlarını kullanabilirsiniz. Node.js ve Vite altyapısı üzerine kuruludur. Harita gösterimi için Mapbox token gereksinimi bulunur.


---

## Ek Bölüm: Uygulama İçi Metrik Hesaplamaları ve TypeScript Arayüzleri

Uygulama, hem 16 JICA adayının doğrudan değerlerini hem de diğer konsept adaylar için dinamik `SiteTableMetrics` hesaplamalarını kullanır. 
Aşağıda kod tabanında ( `src/utils/siteTableMetrics.ts` ve `src/types/site.ts` ) yer alan bazı temel yapıların açıklaması bulunmaktadır. 

### Teknik Sınıflandırma Detayları
Uygulama adayları sadece güçlerine göre değil, çalışma şekillerine göre de sınıflandırır:
- `OPEN_LOOP` (Açık Çevrim): Alt veya üst rezervuarından en az biri mevcut, doğal ve sürekli akan bir su kütlesine bağlı olan sistemler. 
- `CLOSED_LOOP` (Kapalı Çevrim): Her iki rezervuarı da suni olan ve doğal bir su kaynağıyla bağlantısı olmayan sistemler. Coğrafi ve çevresel esneklik sunar.
- `SEA_LOWER_RESERVOIR`: Denizin alt rezervuar olarak kullanıldığı sistemler. Yüksek korozif etkilere karşı dayanıklı altyapı gerektirir.

### Skorlama Algoritması
Adayların teknik ve ekonomik "Skor (Senaryo)" değeri `scenarioScore` fonksiyonu ile üretilir:
- **Kapasite ve Düşü Skoru:** Santralin kurulu gücü 1600 MW'a, düşüsü 700 metreye, debisi 180 m³/s'ye yaklaştıkça daha yüksek puan alır.
- **Koordinat Güveni:** `existing-data` olanlar +9 puan alırken, yaklaşık (`fallback-approximate`) olanlar +6 puan alır.
- **Risk Cezası:** Sahanın barındırdığı her bir risk (Örn: fay hattı, yerleşim yeri engeli) için -1.2 puan cezası uygulanır.
- **Deniz Suyu Bonusu:** Okyanus/Deniz projeleri için ekstradan teşvik puanları uygulanmaktadır.

