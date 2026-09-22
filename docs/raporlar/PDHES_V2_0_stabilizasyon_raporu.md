# PDHES V2.0 Stabilizasyon ve Kritik Hata Analizi

Tarih: 22 Eylül 2026

## Sonuç

Harita şebeke katmanı için veri ayrımı korunarak yükleme ve filtreleme güvenli hale getirildi. 3D sahnede boş/yanlış kadraj oluşturan kamera yönü düzeltildi; WebGL başlatılamadığında kullanıcıya açık hata gösteriliyor.

## Tespitler

### 1. Şebeke verileri iki ayrı sınıftaydı

- `grid_assets.json` geçerli bir `FeatureCollection`, ancak `features` dizisi boş ve dosya boyutu 51 byte.
- `power-grid-filtered.geojson` gerçek OSM verisi içeriyor: 8.353.523 byte ve 17.051 feature.
- OSM verisinin `type` alanları `line`, `minor_line`, `cable`, `substation`, `plant`; geometri türleri Point, LineString ve Polygon.
- OSM gerilimleri kV değerleri olarak sayısal tutuluyor; 154, 380, 400 gibi değerlerin yanında eksik gerilimli feature'lar da mevcut.

Bu nedenle proje içi kavramsal bağlantılar ile OSM gerçek şebeke katmanı birleştirilmedi.

### 2. 3D Canvas vardı, ancak kamera hedefi yoktu

`ThreeDModel` kamerası `[150, 120, 180]` konumuna taşınıyor fakat başlangıçta model merkezine `lookAt` uygulanmıyordu. Three.js varsayılan eksenine bakan kamera, orijin çevresindeki tesis geometriğini kadraj dışına bırakabiliyordu. Canlı Chrome kontrolünde Canvas 1469×701 piksel olarak oluşmasına rağmen tesis geometrisi görünmedi; yalnızca zemin/grid görüldü.

## Uygulanan düzeltmeler

- `ThreeDModel.tsx:1894`: sahne footprint sınırlarından kamera hedefi hesaplayan `CameraTarget` eklendi; `lookAt`, `updateMatrixWorld`, projection güncellemesi ve demand render invalidation uygulanıyor.
- `ThreeDModel.tsx:2385`: WebGL başlatılamazsa sessiz boş panel yerine kullanıcıya `WebGL başlatılamadı` durumu gösteriliyor.
- `utils/powerGrid.ts`: `400`, `400 kV`, `400000`, `400;154`, `400000;154000` gibi formatları güvenli biçimde kV değerlerine çeviren ve eksik gerilimleri sınıflandırmayan yardımcılar eklendi.
- `useMapLibre.ts:225-241`: proje şebeke filtreleri normalize edilmiş gerilim ve LineString/MultiLineString, Point/MultiPoint desteğini kullanıyor.
- `useSiteStore.ts:15-130`: boş, hazır, yüklenemeyen ve yüklenmekte olan grid veri durumları ayrıştırıldı.
- `MapPage.tsx:279-288`: boş veya yüklenemeyen proje grid kaynağı için açıklayıcı durum mesajı eklendi. OSM katmanı ayrı kalıyor.
- `ThreeDModel.test.tsx`: yeni `useThree` kamera davranışı test mock'una eklendi.
- `utils/powerGrid.test.ts`: gerilim normalizasyonu ve geometri/gerilim filtresi testleri eklendi.

## Doğrulama

Yerel kontroller:

- `npm run typecheck`: başarılı.
- `npm run test:run -- --reporter=dot`: 44 test dosyası, 150 test başarılı.
- `npm run check:data`: başarılı; `data.json` ve `grid_assets.json` şema kontrolü başarılı.
- `npm run build`: başarılı.
- Hedefli harita/3D/grid testleri: 3 dosya, 22 test başarılı.

Tarayıcı kontrolleri:

- Canlı `https://pdhes.tr/power-grid-filtered.geojson`: HTTP 200, `application/geo+json`, 8.353.523 byte ve JSON başlangıcı doğrulandı.
- Canlı harita: Şebeke açıldığında iletim hatları görüldü; kapatıldığında gizlendi; tesis ve harita altlıkları kaldı.
- Canlı 3D: Canvas ve WebGL yüzeyi oluştu, ancak mevcut dağıtımda model geometrisi görünmedi. Bu çalışma yerel kaynak kodunu düzeltir; dağıtım yetkisi verilmediği için canlı siteye yayın yapılmadı.
- Yerel üretim build'i gerçek Chrome'da açıldı. Bu çalışma ortamında WebGL context oluşturulamadığı için yeni fallback mesajı görüldü; bu sonuç yerel makinenin GPU/WebGL kısıtıdır, uygulama artık sessiz boş ekran bırakmıyor.

## Açık kalanlar

- GitHub Pages/GitHub Actions üzerinde yayın yapılmadı; kullanıcı tarafından dağıtım yetkisi verilmedi.
- Yerel Chrome ortamında WebGL context oluşturulamadığından düzeltilmiş kameranın GPU üzerinde görsel sonucu bu ortamda tekrar render edilemedi. Kamera düzeltmesi kod ve otomatik testlerle doğrulandı; gerçek GPU doğrulaması, WebGL etkin bir tarayıcıda build yayınlandıktan sonra yapılmalıdır.
- `grid_assets.json` boş kalmaya devam ediyor; doğrulanmış proje-özel trafo/hat geometrisi olmadığı için uydurma veri üretilmedi.

## Değiştirilen dosyalar

- `app/src/components/ui/ThreeDModel.tsx`
- `app/src/components/ui/ThreeDModel.test.tsx`
- `app/src/hooks/useMapLibre.ts`
- `app/src/stores/useSiteStore.ts`
- `app/src/pages/MapPage.tsx`
- `app/src/index.css`
- `app/src/utils/powerGrid.ts`
- `app/src/utils/powerGrid.test.ts`

Commit veya ana dal birleştirmesi yapılmadı.
