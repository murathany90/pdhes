# 3D Çizim ve Yerleşim Geliştirme Önerileri

Bu rapor, harita sekmesindeki 3D nesnelerin (üst/alt rezervuarlar, cebri borular, şalt sahaları vb.) gerçekçiliğini artırmak, kayma/konumlandırma hatalarını gidermek ve deniz tipi pompaj depolamalı santrallerin (Sea-Water PSPP) görsellerini iyileştirmek için teknik çözüm önerileri sunmaktadır.

---

## 1. Konum ve Hizalama Hatalarının Giderilmesi (Koordinat İnce Ayarı)

Ek-4'te paylaştığınız görselde, 3D çizim katmanlarının (mavi ve mor kutular) uydu görüntüsündeki gerçek baraj havuzları ve yapılarla tam olarak hizalanmadığı; örneğin güç evinin kasaba üzerine, baraj gövdelerinin ise gerçek rezervuar sınırlarının kenarına kaydığı görülmektedir.

### Neden Kaynaklanıyor?
3D nesneler, `data.json` içerisindeki her santralin `layout` nesnesinde tanımlanan merkez koordinatlarına (`upper`, `lower`, `power`, `switchyard`) göre çizilir. Bu koordinatlar kabaca tanımlandığında ya da sapma gösterdiğinde görselde kaymalar oluşur.

### Çözüm Önerisi:
- **Yerleşik 3D Editörün Kullanılması**: Uygulama içerisinde bulunan **3D Yerleşim Tasarım/Editör sayfası (`ThreeDEditorPage`)** kullanılarak bu noktalar harita üzerinde sürükle-bırak yöntemiyle uydu görüntüsünün tam üzerine (gerçek baraj gövdesi, trafo sahası merkezleri) yerleştirilmelidir.
- **İnce Ayar (Fine-Tuning) Süreci**: 
  - İnce ayarları yapmak için harita koordinatlarını tek tek toplamanıza gerek yoktur. Bana gerçek haritadaki (örneğin Google Maps/MapLibre üzerinde belirlediğiniz) koordinatları veya kayma miktarlarını iletirseniz, `data.json` veritabanındaki tüm koordinat setlerini otomatik olarak güncelleyebilirim.

---

## 2. Rezervuarların Alakasız ve Küçük Çizilmesi Sorunu

Mevcut yapıda, `app/src/utils/layout.ts` dosyası rezervuarları çizmek için **sabit boyutlu dikdörtgenler veya daireler** kullanmaktadır:
```typescript
addRect('upper_reservoir', 'Üst rezervuar', layout.upper, 1100, 850, 36, ...);
```
Bu durum, gerçekte daha geniş veya farklı geometrik şekillere (örneğin Presenzano'daki beşgen baraj havuzu gibi) sahip olan rezervuarların haritada küçük, kutu gibi ve uyumsuz görünmesine yol açar.

### Geliştirme Önerileri:
1. **Dinamik Boyutlandırma (Kapasiteye Duyarlı Çizim)**:
   - Sabit boyutlar (`1100x850` metre) yerine, rezervuarın genişliği ve uzunluğu santralin aktif depolama hacmine (`activeMcm`) ve yüksekliğine (head) bağlı olarak dinamik formüllerle hesaplanmalıdır.
   - Örnek: `genislik = Math.sqrt(activeMcm * 1000000 / derinlik)`
2. **Özel Çokgen (Custom GeoJSON Polygon) Desteği**:
   - `data.json` içinde sadece tek bir merkez noktası saklamak yerine, önemli santraller için gerçek rezervuar sınırlarını temsil eden koordinat listeleri (`coordinates: [[[lon1, lat1], [lon2, lat2], ...]]]`) tanımlanabilmelidir.
   - Eğer veritabanında özel çokgen (polygon) koordinatları varsa, harita motoru standart bir kutu çizmek yerine doğrudan bu GeoJSON çokgenini çizip katılaştırmalıdır (fill-extrusion).

---

## 3. Deniz Tipi Santrallerde Alt Rezervuarın Karada Görünmesi

Deniz tipi projelerde (`concept === 'sea'`) alt rezervuar aslında denizin kendisidir. Mevcut kodda deniz tipi santraller için de karada suni bir alt rezervuar kutusu çizilmektedir:
```typescript
addRect('lower_reservoir', 'Deniz alım/deşarj yapısı', layout.lower, 420, 180, ...);
```
Bu durum, deniz kıyısında olması gereken yapının karanın içinde yapay bir havuz gibi görünmesine sebep olmaktadır.

### Geliştirme Önerileri:
- **Rezervuar Kutusunun Kaldırılması**: Deniz konseptli projelerde harita üzerinde kapalı bir havuz (alt rezervuar) çizilmemelidir.
- **Kıyı Alım/Deşarj Yapısı Modellemesi**: Alt rezervuar yerine, sadece kıyı çizgisi üzerinde yer alacak minimal bir **"Kıyı Betonu / Su Alma Yapısı" (Intake/Outfall structure)** çizilmelidir.
- **Su Yolu Entegrasyonu**: Cebri borudan gelen su yolu çizgisi, karada bitmek yerine doğrudan bu kıyı yapısına ve ardından denizin içine uzanmalıdır.

---

## 4. Çizimleri Nasıl Daha İyi Geliştirebiliriz? (Görsel Kalite Ayrıntıları)

MapLibre 3D haritası üzerindeki çizimlerin görsel kalitesini premium seviyeye çıkarmak için şu detaylar ve formüller uygulanabilir:

1. **Vektör Eğim Kaplaması (Hillshading)**:
   - **Detay**: Sadece araziyi yükseltmek yetmez; güneş açısına göre dağ ve vadilerin gölgelendirilmesi (hillshade) derinlik hissini 3 katına çıkarır. MapLibre'nin `hillshade` katman türü, `terrainSource` (AWS Terrarium) kaynağını girdi olarak kullanabilir.
   - **Teknik Parametreler**:
     - `hillshade-shadow-color`: HSL tonlu koyu lacivert/yeşil gölgeler (`#0c151c` veya `#0f172a`) ile haritanın karanlık temasına uyum sağlanır.
     - `hillshade-illumination-direction`: Güneş ışığı açısı `315` derece (kuzeybatıdan gelen ışık, 3D algısı için idealdir).
     - `hillshade-exaggeration`: `0.75` ile belirgin sırtlar ve vadiler oluşturulur.

2. **Çift Katmanlı Şeffaf Su ve Beton Baraj Rezervuarları**:
   - **Detay**: Tek bir düz mavi kutu yerine, rezervuarlar iki katmandan oluşmalıdır:
     - **Dış Çeper (Baraj Gövdesi / Set)**: Rezervuar çokgeninin dış çeperi (stroke/boundary), 5-10 metre genişliğinde bir şerit olarak çizilir ve gri beton renginde (`#7f8c8d` veya `#475569`) set yüksekliğinde (örneğin 30m) extrude edilir.
     - **İç Su Kütlesi (Yarı Şeffaf Su)**: Çokgenin iç kısmı, beton set yüksekliğinden 2-3 metre daha alçak olacak şekilde su yüksekliğinde (örneğin 27m) extrude edilir. Rengi cam mavisi (`#0ea5e9` veya `#38bdf8`) ve opaklığı `0.55` yapılarak altındaki uydu arazisinin görünmesi sağlanır.

3. **MapLibre WebGL Custom Layer ile 3D GLTF Model Entegrasyonu**:
   - **Detay**: Güç evi, şalt sahası ve su alma yapıları için basit kutular yerine gerçekçi 3D modeller (.gltf / .glb) yerleştirilebilir.
   - MapLibre, WebGL Custom Layer aracılığıyla Three.js sahnelerini doğrudan harita koordinat sistemine entegre etmeyi destekler.
   - Bu sayede jeneratör binası, yüksek gerilim direkleri ve transformatör modelleri gerçek konumlarında, harita döndürüldüğünde ve eğildiğinde perspektifi bozmayacak şekilde 3D olarak çizilebilir.

---

## 5. Uygulama Planı (Implementation Plan)

### Durum Özeti (Mevcut Durumda Yapılanlar)
*   **[YAPILDI]** **"3D Yerleşim" (ThreeDModel.tsx) Sekmesi**: Bu sekmede zaten tam donanımlı bir Three.js sahnesi çalışmaktadır. Alçak poligonlu ağaçlar, gerçekçi arazi engebesi (Cesima Dağı gürültü fonksiyonu), 4 hatlı cebri borular, boruların içinden akan instanced su partikülleri ve kuyu tipi güç evi animasyonları premium seviyede uygulanmıştır.
*   **[YAPILDI]** **Harita Konum Hizalaması**: Presenzano santralindeki tüm yapılar ve rezervuarlar (Cesima gölü ve oval beşgen havuz), OpenStreetMap'ten çekilen gerçek koordinatlar ve göl sınırları ile harita üzerinde 1:1 hizalanmıştır.
*   **[YAPILDI]** **Deniz Suyu Kıyı Yapısı**: Deniz suyu projelerinde (`concept === 'sea'`) yapay kara rezervuarı kaldırılmış, sahil şeridine beton renkli su alma yapısı çizilmiştir.

---

### Adım Adım Harita Görsel Kalitesini Artırma Planı

#### Adım 1: MapLibre Hillshade (Eğim Gölgelendirmesi) Katmanının Eklenmesi
*   **Dosya**: [useMapLibre.ts](file:///c:/yazilim_projeler/zPompaj_DHES/app/src/hooks/useMapLibre.ts)
*   **İşlem**: `queueDrawLayers` fonksiyonu içerisine, arazi açıkken (`layers.terrain3d` aktifken) çalışacak şekilde bir `hillshade` katmanı eklenmelidir:
```typescript
if (layers.terrain3d && !map.getLayer('hillshade-layer')) {
  map.addLayer({
    id: 'hillshade-layer',
    type: 'hillshade',
    source: 'terrainSource',
    paint: {
      'hillshade-shadow-color': '#0f172a',
      'hillshade-illumination-direction': 315,
      'hillshade-exaggeration': 0.75
    }
  }, 'base'); // base (uydu) katmanının hemen üzerine eklenerek harmanlanır
}
```

#### Adım 2: Çift Katmanlı Su ve Beton Duvar Modellemesi
*   **Dosya**: [layout.ts](file:///c:/yazilim_projeler/zPompaj_DHES/app/src/utils/layout.ts) ve [useMapLibre.ts](file:///c:/yazilim_projeler/zPompaj_DHES/app/src/hooks/useMapLibre.ts)
*   **İşlem**:
    1. Rezervuar çokgenlerinin (`upper_reservoir`, `lower_reservoir`) GeoJSON verisine ek bir özellik (`type: "water"` ve `type: "dam_wall"`) eklenerek iki katman olarak üretilmesi sağlanır.
    2. `dam_wall` katmanı için koordinat çizgilerinden buffer/offset kullanılarak kalın beton çeperler oluşturulur.
    3. `useMapLibre.ts` içinde `fill-extrusion-color` ve `fill-extrusion-opacity` özellikleri bu tiplere göre ayrıştırılarak suya `%50` şeffaflık verilir.

#### Adım 3: MapLibre ile Three.js Entegrasyonu (Gelişmiş Aşama)
*   **Dosya**: [useMapLibre.ts](file:///c:/yazilim_projeler/zPompaj_DHES/app/src/hooks/useMapLibre.ts)
*   **İşlem**: MapLibre'nin `custom` layer türünü kullanarak, `ThreeDModel.tsx` içindeki bazı düşük poligonlu gLTF/Three.js modellerini haritanın üzerine enjekte eden bir WebGL bağlayıcısı yazılır:
```typescript
const customLayer = {
  id: '3d-models-layer',
  type: 'custom',
  renderingMode: '3d',
  onAdd: function (map, gl) {
    // Three.js sahne kurulumu ve model yükleme işlemleri
  },
  render: function (gl, matrix) {
    // Kameraya göre Three.js model projeksiyonu işlemleri
  }
};
map.addLayer(customLayer);
```
