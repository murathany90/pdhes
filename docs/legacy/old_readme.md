# Türkiye PSPP Yatırım İstihbaratı - Tek Sayfa Web Uygulaması

Bu prototip, **Türkiye'de Pompaj Depolamalı Hidroelektrik Yatırım Fırsatları** raporundaki aday sahaları tek sayfalık bir yatırım/altyapı istihbaratı arayüzüne dönüştürür. Referans alınan mantık, kamu kayıtları ve enerji altyapısı katmanlarını eşleştirip harita üzerinde tahmini tesis yerleşimini 3D bloklarla göstermek üzerine kuruludur.

## 1. Dosya yapısı

Uygulama tek HTML dosyasıdır ve yanında iki JSON veri dosyası bulunur:

```text
pspp_yatirim_istihbarat_app.html   # ana uygulama
data.json                           # aday saha veri modeli
grid_assets.json                    # TEİAŞ KML'den üretilmiş şebeke katmanları
```

HTML dosyası içinde üç bölüm birlikte bulunur:

```text
<head>  : MapLibre GL JS CDN, CSS ve sayfa meta bilgileri
<style> : tüm arayüz tasarımı
<script>: tüm veri modeli, hesaplama motoru, harita ve 3D render mantığı
```

Ek bir build sistemi, backend, npm kurulumu veya Mapbox token zorunluluğu yoktur. Harita ve tile servisleri için internet bağlantısı gerekir.

## 2. Kurulum ve çalıştırma

En basit kullanım:

```bash
# Dosyayı tarayıcıda açın
open pspp_yatirim_istihbarat_app.html
```

Yerel HTTP sunucusu ile çalıştırma önerilir:

```bash
python3 -m http.server 8080
# Sonra tarayıcıdan:
# http://localhost:8080/pspp_yatirim_istihbarat_app.html
```

CDN erişimi olmayan ortamda MapLibre kütüphanesi yüklenemez; bu durumda sayfa arayüzü açılır, fakat harita alanı fallback mesajı gösterir.

## 3. Ana sekmeler

### Datalar

Bu sekmede rapordan türetilmiş aday saha veri tablosu bulunur. Adaylar:

- Gökçekaya PSPP
- Taşucu-Gülnar Deniz Suyu PSPP
- Altınkaya PSPP
- Oymapınar Off-river PSPP
- Karaburun Sırtı Deniz Suyu PSPP
- Bozyazı-Anamur Deniz Suyu PSPP
- Ordu-Perşembe Arka Sırt Deniz Suyu PSPP
- Menzelet Off-river PSPP
- Hasan Uğurlu-Suat Uğurlu PSPP
- Sarıyar-Gökçekaya Augmentasyon PSPP

Her satırda konsept, kurulu güç, enerji kapasitesi, net head, su yolu uzunluğu, CAPEX, yıllık gelir ve skor gösterilir. Yeni beş saha PDF raporundaki kısa liste değerleri ve `grid_assets.json` içindeki TEİAŞ hat geometrisiyle masaüstü seviyesinde eşleştirilmiştir.

### Hesaplamalar

Bu sekmede seçili saha için hızlı senaryo motoru çalışır.

Kullanılan temel enerji formülü:

```text
E_GWh = ρ · g · H · V · η / 3.6e12
```

Parametreler:

```text
ρ = 1000 kg/m³
g = 9.81 m/s²
H = net düşü, metre
V = aktif hacim, m³
η = 0.85 ön kabul
```

Kullanıcı şu değişkenleri kaydırıcılarla değiştirebilir:

- CAPEX çarpanı
- Gelir yakalama çarpanı
- Yıllık çevrim sayısı
- Yardımcı hizmet primi

Sonuçlar anlık olarak CAPEX, gelir, geri ödeme ve fiziksel enerji ekranına yansır.

### Harita

Bu sekme uygulamanın ana istihbarat ekranıdır. MapLibre GL JS ile taban harita açılır, ardından seçili saha için prosedürel 3D yerleşim çizilir.

Yeni özellikler:

- **Koyu / açık tema:** Sağ üstteki tema düğmesiyle tüm arayüz ve harita karoları senkronize değişir.
- **Yan panelleri daralt:** Harita alanını genişletmek için sol ve sağ panelleri gizleyebilir, kenardaki oklarla geri açabilirsiniz.
- **TEİAŞ şebeke katmanları (KML):** 400 kV, 154 kV ve 66 kV hatları ayrı ayrı açılıp kapatılabilir; trafo/geriilim merkezlerine tıklayarak isim ve gerilim bilgisi görülebilir.
- **Terrain + hillshade:** Token gerektirmeyen MapLibre DEM kaynağıyla 3D terrain ve gölgeli topoğrafya bağlamı açılır.
- **PDHES bileşen paneli:** 3D bloklara tıklandığında sağ panelde seçili yapının teknik detay kartı gösterilir.

Harita bileşenleri:

- Aday saha noktaları
- Üst rezervuar poligonu
- Alt rezervuar veya deniz alım/deşarj noktası
- Cebri tünel / penstock hattı
- Yeraltı güç evi / kavern
- Surge tank
- Şalt sahası
- Erişim yolu
- 154/380 kV TEİAŞ bağlantı koridoru
- Yaklaşık topoğrafik kontur halkaları
- Risk/izin buffer overlay'i
- Sağ panelde yatırım/kazanç kartları
- Sağ panelde proje zaman çizelgesi
- Sağ panelde PDHES bileşen detayları

### Ayarlar

Bu sekmede harita stili, 3D yükseklik çarpanı ve örnek skor ağırlıkları ayarlanır. Ayrıca gömülü JSON veri modeli görüntülenir.

## 4. Veri modeli

Frontend içinde `SITES` dizisi kullanılır. Her saha şu alanları taşır:

```js
{
  id: 'gokcekaya',
  name: 'Gökçekaya PSPP',
  concept: 'classic',
  lat: 39.93,
  lon: 30.52,
  score: 84,
  head: 379.5,
  tunnelKm: 4.05,
  activeMcm: 10.8,
  powerMW: 1400,
  energyGWh: 9.8,
  capexBn: 2.59,
  revenueM: 252,
  payback: 10.3,
  nearest380Km: 7.1,
  nearest154Km: 9.1,
  nearestSubstation: { name: 'KARTAL RES', voltage_kv: 154, coord: [30.426507, 39.930818] },
  gridConnection: {
    preferredVoltageKv: 380,
    preferredLineName: '400kV ESKİŞEHİR3 - GÖKÇEKAYA HES EİH',
    preferredLineDistanceKm: 7.1,
    tapCoord: [lon, lat]
  },
  risks: [...],
  layout: {
    upper: [lon, lat],
    lower: [lon, lat],
    power: [lon, lat],
    surge: [lon, lat],
    switchyard: [lon, lat]
  },
  timeline: [...],
  components_detail: {
    upper_reservoir: {...},
    lower_reservoir: {...},
    penstock: {...},
    powerhouse: {...},
    surge_tank: {...},
    switchyard: {...},
    tunnel: {...}
  }
}
```

Üretim sürümünde bu veri doğrudan elle gömülmemelidir. Önerilen backend veri modeli:

```text
PostgreSQL + PostGIS
- coast_grid
- upper_basin_candidates
- lower_reservoirs
- pair_candidates
- grid_assets
- risk_layers
- project_events
- project_components
```

## 5. 3D render mantığı

Uygulama gerçek CAD/BIM modeli üretmez. Bunun yerine rapordaki saha parametrelerinden tahmini bir **procedural layout** oluşturur.

Akış:

```text
Seçili saha
→ layout koordinatları
→ parametrik bileşenler
→ oval/ring, dikdörtgen, daire ve üçgen GeoJSON polygon üretimi
→ MapLibre fill-extrusion layer
→ 3D blok, bağlantı hattı, erişim yolu ve kontur görselleştirme
```

Kodda ana fonksiyon:

```js
buildLayout(site)
```

Bu fonksiyon şu kaynakları üretir:

```text
blocks : 3D ekstrüde edilen tesis blokları
water  : cebri tünel / su yolu line layer
risk   : risk buffer polygon layer
topo   : yaklaşık kontur çizgileri
access : servis yolu line layer
grid   : TEİAŞ hat segmenti + bağlantı koridoru
labels : harita üstü bileşen etiketleri
```

Dikdörtgen bloklar şu fonksiyonla üretilir:

```js
rotatedRectangle(center, widthM, lengthM, bearingDeg)
```

Bu fonksiyon merkez koordinatını, metre cinsinden genişlik/uzunluğu ve dönüklük açısını alır; küçük alan yaklaşımıyla lon/lat polygon üretir.

3D görünüm MapLibre `fill-extrusion` ile sağlanır:

```js
map.addLayer({
  id: 'blocks-extrusion',
  type: 'fill-extrusion',
  source: 'blocks',
  paint: {
    'fill-extrusion-color': ['case', ['get', 'selected'], '#fff4a8', ['get', 'color']],
    'fill-extrusion-height': ['get', 'height'],
    'fill-extrusion-base': ['get', 'base'],
    'fill-extrusion-opacity': 0.86
  }
});
```

## 6. Harita katmanları

Uygulamada şu katmanlar vardır:

```text
candidate-circles        : aday sahalar
candidate-labels         : saha adları
risk-fill                : risk/izin buffer alanı
risk-line                : risk buffer sınırı
topo-contours            : yaklaşık topoğrafik kontur çizgileri
topo-labels              : kontur kot etiketleri
grid-line                : TEİAŞ segmenti ve bağlantı koridoru
grid-labels              : şebeke etiketi
water-line               : cebri tünel / penstock
water-points             : su yolu başlangıç/bitiş noktaları
access-road              : servis/erişim yolu
blocks-extrusion         : 3D tesis blokları
blocks-outline           : seçili blok vurgusu
block-labels             : üst rezervuar, güç evi, şalt vb. etiketler
grid-assets-lines-400    : TEİAŞ 400 kV hatları (KML)
grid-assets-lines-154    : TEİAŞ 154 kV hatları (KML)
grid-assets-lines-66     : TEİAŞ 66 kV hatları (KML)
grid-assets-points-400   : 400 kV trafo/geriilim merkezleri
grid-assets-points-154   : 154 kV trafo/geriilim merkezleri
grid-assets-points-66    : 66 kV trafo/geriilim merkezleri
```

Katmanlar sol paneldeki checkbox'larla açılıp kapatılabilir.

## 7. Referans mimari

Bu tek dosya MVP, üretim sürümünde aşağıdaki mimariye evrilebilir:

```text
Frontend
- Next.js veya Vite
- MapLibre GL JS / Mapbox GL JS
- deck.gl overlay katmanları
- Three.js veya Cesium detay sahnesi

Backend
- FastAPI veya Node.js
- PostgreSQL + PostGIS
- Object storage: render görselleri ve raporlar
- Queue: haftalık veri güncelleme

Veri / AI katmanı
- PDF parser
- LLM structured extraction
- DEM tarama pipeline
- Şebeke ve rezervuar yakınlık eşleştirme
- Skor motoru
```

## 8. Üretim veri akışı

Önerilen uçtan uca akış:

```text
PDF / kamu raporu / piyasa raporu
→ entity extraction
→ normalize JSON
→ PostGIS import
→ DEM + kıyı + rezervuar + şebeke spatial join
→ skor motoru
→ finalist layout generator
→ MapLibre/deck.gl/Three.js görselleştirme
→ yatırım komitesi dashboard'u
```

## 9. Geliştirme notları

Bu prototip bilinçli olarak tek dosya tasarlandı. Gerçek ürüne çevrilirken şu adımlar önerilir:

1. `SITES` verisini REST API'den getirin.
2. Gerçek TEİAŞ hatları, DSİ rezervuarları, Copernicus DEM, AFAD/MTA risk katmanlarını PostGIS'e alın.
3. `buildLayout(site)` fonksiyonunu backend tarafında deterministik layout servisine dönüştürün.
4. Harita katmanlarını vector tile veya PMTiles formatına taşıyın.
5. 3D finalist sahne için Three.js/Cesium modülü ekleyin.
6. Render butonunu Blender/AI render pipeline'a bağlayın.
7. Timeline kartlarını kaynak URL, dosya referansı ve güven seviyesiyle genişletin.

## 10. Sınırlamalar

- Haritadaki koordinatlar ve bileşen konumları kavramsal/prototip seviyesindedir.
- 3D bloklar mühendislik çizimi değildir.
- Şebeke hatları temsili çizilmiştir; gerçek TEİAŞ veri setiyle değiştirilmelidir.
- Risk buffer'ları temsili overlay'dir; AFAD/MTA/korunan alan verisiyle doğrulanmalıdır.
- CAPEX ve gelir hesapları yatırım kararı için değil, senaryo ekranı için kullanılır.
- Deniz suyu konsepti için kıyı izinleri, deniz yapısı, korozyon, liner ve biofouling çalışmaları ayrıca yapılmalıdır.

## 11. Son Geliştirmeler

### Tema sistemi (Koyu / Açık)
- `data-theme` attribute ile CSS custom properties üzerinden çalışır.
- Dark modda yeşil vurgu (`#48f49a`), light modda nötr yeşil (`#0d9e5c`) kullanılır.
- Tercih `localStorage`'da saklanır; sayfa yenilendiğinde korunur.

### Daraltılabilir paneller
- Harita sekmesinde sol ve sağ paneller CSS `grid-template-columns` geçişi ile daraltılıp genişletilebilir.
- Panel kapandığında harita otomatik olarak `map.resize()` ile boyutlandırılır.
- Paneller kapalıyken harita kenarlarında açma okları belirir.

### TEİAŞ KML şebeke katmanları
- `YTBS_Detayli_Harita (3).kml` önceden `kml_to_json.py` ile GeoJSON'a dönüştürüldü (`grid_assets.json`).
- 3.933 özellik: 550×400 kV, 3.302×154 kV, 81×66 kV hattı ve noktası.
- Her gerilim seviyesi ayrı MapLibre katmanı olarak filtrelenir ve ayrı açılıp kapatılabilir.
- Tıklanabilir noktalar: trafo/geriilim merkezi ismi ve gerilimi popup ile gösterilir.

### Harita performans iyileştirmeleri
- `removeMapLayers` / re-add yerine `setData` kullanılarak kaynak güncellenir; bu sayede kaynak değişiminde harita titremesi (flicker) önlenir.
- `fill-extrusion-opacity` 0.85'e düşürülerek z-fighting azaltıldı.
- `map.on('styledata')` debounce ile 80ms geciktirilerek gereksiz yeniden çizimler engellendi.
- `requestAnimationFrame` + `setTimeout` ile map resize zamanlaması düzeltildi.

### Türkçe karakter düzeltmeleri
- Tüm arayüz metinleri doğru Türkçe karakterlerle güncellendi (ç, ğ, ı, ö, ş, ü, İ, Ç, Ğ, Ö, Ş, Ü).

## 12. Ana mesaj

Bu uygulama, "rapordaki yatırım tezi" ile "harita üzerinde prosedürel 3D tesis yerleşimi" arasında çalışan bir arayüzdür. Varlık geliştirme açısından Gökçekaya hızlı klasik PSPP rotasını, ürün/istihbarat açısından Taşucu-Gülnar deniz suyu kıyı taraması rotasını ön plana çıkarır.
