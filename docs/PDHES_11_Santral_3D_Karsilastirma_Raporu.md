# PDHES.tr – 11 Santral Mevcut/Yeni 3D Çizim Karşılaştırma Raporu

**İncelenen santraller:** Gökçekaya PDHES, Sarıyar PDHES, Altınkaya PDHES, Bayramhacılı PDHES, Hasan Uğurlu PDHES, Adıgüzel PDHES, Kargı PDHES, Yamula PDHES, Oymapınar PDHES, Aslantaş PDHES, Demirköprü PDHES.

## 1. Yönetici özeti

Mevcut uygulama çizimleri, `componentFootprints` bulunmadığında sabit ölçülü geometrik bloklar üretmektedir: yaklaşık 320×170 m güç evi, 390×260 m şalt sahası, 82 m yarıçaplı denge bacası ve tek merkez hatlı su yolu. Yüklenen yeni dosyalar 11 sahanın tamamında polygon tabanlı üst/alt rezervuar, güç evi, denge bacası, şalt, portal ve güzergâh tanımlamıştır. Bu, kare/standart rezervuar görünümüne göre belirgin bir gelişmedir.

Ancak yüklenen dosyalar doğrudan birleştirildiğinde önemli iç tutarsızlıklar oluşmaktadır: ana `headM` ve `activeVolumeHm3` alanları Excel hesaplarıyla uyuşmamakta; bazı yeni yerleşimler eski `mapAnchor` noktasından 10–17 km uzakta kalmakta; su yolu çizgileri kaynakta kayıtlı toplam su yolu uzunluğunun yalnızca bir kısmını veya birkaç katını temsil etmektedir. Ayrıca 11 dosyada güç evi ve şalt footprint alanları neredeyse aynıdır; bu nesneler hâlâ site-özel değil, eski standart blok boyutlarının polygon karşılığıdır.

## 2. Teknik karşılaştırma

| Santral | Yüklenen footprint | Düzeltilmiş footprint | Üst rezervuar alanı km² (yüklenen → düzeltilmiş) | Çizili güzergâh / kayıtlı su yolu km | Eski anchor–yeni güç evi km | Başlıca bulgu |
|---|---:|---:|---:|---:|---:|---|
| Gökçekaya PDHES | 8 | 14 | 0.628 → 0.434 | 0.88 / 4.05 | 0.0 | güzergâh uzunluğu kaynakla uyumsuz |
| Sarıyar PDHES | 8 | 11 | 1.078 → 0.271 | 3.45 / 1.80 | 5.2 | marker–yerleşim farkı yüksek, hacim–alan uyumsuzluğu |
| Altınkaya PDHES | 8 | 12 | 0.526 → 0.347 | 2.59 / 4.55 | 0.7 | orta düzey geometrik doğrulama gerekli |
| Bayramhacılı PDHES | 8 | 11 | 0.200 → 0.731 | 2.15 / 0.47 | 12.0 | marker–yerleşim farkı kritik, hacim–alan uyumsuzluğu kritik, güzergâh uzunluğu kaynakla uyumsuz |
| Hasan Uğurlu PDHES | 8 | 11 | 3.099 → 0.206 | 4.70 / 1.60 | 12.5 | marker–yerleşim farkı kritik, hacim–alan uyumsuzluğu kritik, güzergâh uzunluğu kaynakla uyumsuz |
| Adıgüzel PDHES | 8 | 11 | 0.200 → 0.486 | 1.86 / 0.97 | 1.5 | hacim–alan uyumsuzluğu kritik |
| Kargı PDHES | 8 | 11 | 0.200 → 0.115 | 1.92 / 2.76 | 16.6 | marker–yerleşim farkı kritik |
| Yamula PDHES | 8 | 11 | 0.200 → 0.226 | 1.03 / 1.92 | 3.4 | marker–yerleşim farkı yüksek |
| Oymapınar PDHES | 8 | 11 | 3.000 → 0.158 | 6.39 / 0.92 | 3.8 | marker–yerleşim farkı yüksek, hacim–alan uyumsuzluğu kritik, güzergâh uzunluğu kaynakla uyumsuz |
| Aslantaş PDHES | 8 | 11 | 0.199 → 0.382 | 1.22 / 1.10 | 2.7 | hacim–alan uyumsuzluğu |
| Demirköprü PDHES | 8 | 11 | 0.421 → 0.166 | 5.81 / 1.46 | 2.5 | hacim–alan uyumsuzluğu, güzergâh uzunluğu kaynakla uyumsuz |

## 3. Ortak bulgular

### Güçlü yönler

- 11 sahanın tamamında `useFootprintPolygons=true` ve kapalı rezervuar polygonları bulunmaktadır.
- Üst rezervuar su yüzeyi ile sedde footprint’i ayrı tanımlanmıştır.
- Güç evi, denge bacası, şalt sahası ve servis portalı katman bazında açılıp kapatılabilir durumdadır.
- Polygonlar kapalı ve mevcut `siteSchema` koordinat kurallarına uygundur.
- Yeni güzergâhlar topoğrafyayı izleyen çok noktalı hatlar içermektedir; bu özellikle Adıgüzel, Oymapınar ve Kargı’da eski düz merkez hatta göre daha açıklayıcıdır.

### Kritik sorunlar

1. **Hacim–geometri uyumsuzluğu:** Üst rezervuar polygonlarının çoğu kök `activeVolumeHm3 / 25 m` yaklaşımından üretilmiş, fakat aynı dosyadaki `excelCalculated.upperActiveVolumeHm3` ile eşleşmemiştir. Hasan Uğurlu ve Oymapınar’da Excel hacmi kullanıldığında ortalama aktif derinlik yaklaşık 1–2 m’ye düşerken Bayramhacılı’da 90 m’yi aşmaktadır.
2. **Anchor ve 3D saha ayrışması:** Bayramhacılı, Hasan Uğurlu ve Kargı’da eski harita anchor’ı yeni güç evi yerleşiminden 10 km’den fazla uzaktadır. Kamera eski anchor’a giderse yeni 3D çizim ekranda görünmeyebilir.
3. **Eksik su yolu zinciri:** Dosyalarda yalnızca `penstock01` vardır; ayrı headrace, tailrace ve intake footprintleri yoktur. Gökçekaya için dört, Altınkaya için iki paralel hat bilgisi olmasına rağmen tek hat çizilmiştir.
4. **Standart blokların polygonlaştırılması:** Güç evi yaklaşık 54.000 m², şalt yaklaşık 101.000 m² olarak 11 sahada neredeyse aynıdır. Bu, mevcut sabit 320×170 m ve 390×260 m blokların siteye taşınmış şeklidir; gerçek saha geometrisi olarak yorumlanmamalıdır.
5. **Kot alanlarının görselleştirme sınırı:** Mevcut `buildLayout` mantığı footprint kotlarından yalnızca ekstrüzyon yüksekliği türetmekte, `fill-extrusion-base` değerini gerçek `baseElevationM` olarak kullanmamaktadır. Bu nedenle JSON’daki kot profili mühendislik metadatasıdır; MapLibre üzerinde gerçek yeraltı/yerüstü kotuna oturmaz.

## 4. Üretilen tek JSON’da yapılan düzeltmeler

- 11 tam `Site` nesnesi tek JSON dizi halinde birleştirildi; `app/public/data.json` içindeki aynı `id` değerleriyle merge edilebilir.
- `headM`, `projectFlowCms` ve `activeVolumeHm3` değerleri her dosyanın `excelCalculated` alanıyla tutarlı hale getirildi.
- Üst rezervuar şekli ve yönü korundu; alanı uygulamadaki 25 m ortalama aktif derinlik yaklaşımıyla Excel aktif hacmine göre ölçeklendi.
- Üst rezervuar seddesi su polygonunun çevresinde %4 doğrusal tamponla yeniden kuruldu.
- Güzergâh yönü üst rezervuar → denge bacası → güç evi olarak normalize edildi.
- `headraceAlignment`, `tailraceAlignment` ve `upperIntake` eklendi.
- Gökçekaya için dört, Altınkaya için iki paralel cebri boru polyline’ı açıkça üretildi; bu sayede renderer’ın uygulanmamış `renderPenstocksAsParallelArray` bayrağına bağımlılık azaltıldı.
- Kuyruk suyu çıkışı alt rezervuar polygonunun güç evine en yakın sınır noktasına bağlandı.
- `mapAnchor`, `view.center`, `bbox`, `layout` ve bileşen merkezleri yeni footprintlerden hesaplanarak iç tutarlılık sağlandı.
- Tüm polygonlar kapalı, tüm profil dizileri koordinat sayısıyla eşleşir ve kullanılan malzemeler mevcut schema enum’una uygundur.

## 5. Uygulamaya entegrasyon

Dosya, `Site[]` biçimindedir. Mevcut 15 adayın tamamını korumak için `data.json` dosyasını bununla tamamen değiştirmek yerine 11 kaydı `id` üzerinden merge edin. Tarayıcıda daha önce kaydedilmiş `pspp-sites-v1` LocalStorage verisi yeni taban veriyi gölgeleyebilir; test sırasında “Çalışma Alanını Sıfırla” işlemi uygulanmalıdır.

## 6. Kalan mühendislik sınırlamaları

Bu çıktı kavramsal web görselleştirmesidir. Güç evi, şalt, portal ve çoğu denge bacası footprint’i gerçek aplikasyon/kadastro/CAD verisiyle doğrulanmamıştır. Su yolu yatay uzunluğu ile raporlanan tünel/şaft uzunluğu farkları ancak DEM profili, jeoloji kesiti ve proje paftalarıyla çözülebilir. JSON, bu belirsizliği ortadan kaldırmaz; yalnızca yeni çizimlerin uygulama içinde tutarlı ve görünür çalışmasını sağlar.
