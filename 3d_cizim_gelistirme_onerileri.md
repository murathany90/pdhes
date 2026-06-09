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

## 4. Çizimleri Nasıl Daha İyi Geliştirebiliriz? (Görsel Kalite)

MapLibre 3D haritası üzerindeki çizimlerin görsel kalitesini premium seviyeye çıkarmak için şu adımlar uygulanabilir:

1. **Vektör Eğim Kaplaması (Hillshading)**:
   - 3D arazi üzerine gölgelendirme katmanı (`hillshade`) eklenerek vadi ve dağların gölge detayları daha belirgin hale getirilebilir.
2. **3D Model Simgeleri (3D Model Markers)**:
   - MapLibre üzerinde basit fill-extrusion kutuları yerine, Three.js veya gLTF formatındaki gerçekçi 3D baraj setleri, jeneratör binaları ve şalt direkleri haritaya yerleştirilebilir (MapLibre'nin 3D model ekleme desteği kullanılarak).
3. **Şeffaf Su Katmanı**:
   - Rezervuar alanlarının üstü, içini gösteren yarı şeffaf mavi renkli bir su katmanıyla kaplanmalı ve doluluk/boşalma efektleri bu katman üzerinden simüle edilmelidir.
