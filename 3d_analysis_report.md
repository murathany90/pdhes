# 3D Yerleşim Analiz Raporu — Kod + Canlı Site İncelemesi

> **Analiz Yöntemi:** Kaynak kodu incelemesi (`ThreeDModel.tsx` - 1556 satır) + Chrome DevTools MCP ile canlı site (`murathany90.github.io/pdhes/#/3d`) üzerinde 6 farklı aday test edildi (Gökçekaya, Taşucu-Gülnar, Presenzano, Afyon-Sultandağı, Gökçeada, Gazipaşa).

---

## 🐛 Tespit Edilen Hatalar (Buglar)

### BUG-1: `steelMat` Her Frame'de Yeniden Oluşturuluyor (Performans)
**Dosya:** [ThreeDModel.tsx](file:///c:/yazilim_projeler/zPompaj_DHES/app/src/components/ui/ThreeDModel.tsx#L960-L971)
**Ciddiyet:** 🔴 Yüksek (Performans)

`RealisticPenstock` bileşenindeki `steelMat`, `useMemo` kullanmadan doğrudan fonksiyon gövdesinde oluşturuluyor. React her render'da yeni bir `MeshStandardMaterial` nesnesi yaratıyor. Bu, GPU bellek sızıntısına ve frame drop'larına yol açabilir.

```diff
- const steelMat = new THREE.MeshStandardMaterial({
+ const steelMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: active ? '#f5b50b' : (isPlaying ? '#5aa8e3' : '#606972'),
    ...
- });
+ }), [active, isPlaying]);
```

> [!WARNING]
> Aynı sorun `RealisticTerrain` material'ında da var (L87-L126), ancak orada `useMemo` doğru kullanılmış ama `opacity` değiştiğinde material + color buffer birlikte yeniden oluşturuluyor.

---

### BUG-2: Powerhouse Pozisyonu `isPresenzano` Parametresini Yok Sayıyor
**Dosya:** [ThreeDModel.tsx](file:///c:/yazilim_projeler/zPompaj_DHES/app/src/components/ui/ThreeDModel.tsx#L390)
**Ciddiyet:** 🟡 Orta

```typescript
const pos: [number, number, number] = [45, getTerrainHeight(45, 15, false) - 2, 15];
//                                                                   ^^^^^ false hardcoded!
```

Presenzano seçildiğinde bile powerhouse pozisyonu `isPresenzano=false` ile hesaplanıyor. Bu, Presenzano'nun özel Cesima dağ profili yerine jenerik arazi yüksekliğini kullanması demek. Presenzano'da powerhouse araziye göre yanlış kotta duruyor olabilir.

---

### BUG-3: `Üst Rezervuar` Etiketi Tüm Adaylarda Aynı Görünüyor
**Dosya:** [ThreeDModel.tsx](file:///c:/yazilim_projeler/zPompaj_DHES/app/src/components/ui/ThreeDModel.tsx#L236)
**Ciddiyet:** 🟢 Düşük

Deniz suyu tipi (`SEA_WATER`) adaylarda alt rezervuar doğru şekilde "Deniz Alım / Deşarj Yapısı" olarak gösteriliyor. Ancak üst rezervuar etiketinde site-spesifik bilgi yok (örneğin baraj adı, kapasite gibi).

---

### BUG-4: `terrainOpacity` 95'in Altına Düşünce Ağaçlar Aniden Kayboluyor
**Dosya:** [ThreeDModel.tsx](file:///c:/yazilim_projeler/zPompaj_DHES/app/src/components/ui/ThreeDModel.tsx#L1348)
**Ciddiyet:** 🟢 Düşük (UX)

```typescript
{showTerrain && terrainOpacity >= 95 && <InstancedEnvironment assets={environmentAssets} />}
```

Slider'ı %95 → %90'a çektiğinizde 600 ağaç ve kaya aniden kaybolur — geçişsiz bir "pop-in/pop-out" etkisi oluşur. Fade-out animasyonu eklenmeli veya eşik değeri düşürülmeli.

---

### BUG-5: Tunnel Label Y Pozisyonu Garip Hesaplama
**Dosya:** [ThreeDModel.tsx](file:///c:/yazilim_projeler/zPompaj_DHES/app/src/components/ui/ThreeDModel.tsx#L1040)
**Ciddiyet:** 🟡 Orta

```typescript
position={[(from.x+to.x)/2, (from.y+to.y)/2 + 25 - 5, (from.z+to.z)/2]}
```

`+25 - 5` yani `+20` birim. Tünel etiket "Yeraltı Tüneli" yazısı, tünelin fiziksel konumundan 20 birim (≈60m) yukarıda gösteriliyor. Bu, bazı kamera açılarında tünelden çok uzakta görünmesine neden oluyor.

---

### BUG-6: Cebri Boru ExtrudeGeometry Yarım Boru Yönlendirmesi Belirsiz
**Dosya:** [ThreeDModel.tsx](file:///c:/yazilim_projeler/zPompaj_DHES/app/src/components/ui/ThreeDModel.tsx#L886-L894)
**Ciddiyet:** 🟡 Orta

`ExtrudeGeometry` ile yarım daire profil oluşturulurken, profil yerel koordinat düzleminde çiziliyor (`absarc(0,0,radius, PI, 2*PI)`). Fakat `extrudePath` eğrisi boyunca ekstrüzyon yapılırken, normal vektörü otomatik hesaplandığı için yarım borunun "açık tarafı" kamera açısına bağlı olarak beklenmedik yöne bakabiliyor. Özellikle eğrinin büküldüğü orta noktada (pMid) twist olabilir.

---

### BUG-7: Deniz Suyu Adaylarda Üst Rezervuar Deniz Tabanından Uzakta
**Canlı Gözlem:** Taşucu-Gülnar ve Gazipaşa ekran görüntülerinde üst rezervuar sol üstte, deniz yüzeyi ise sağ altta. Ancak tünel `upperPos` → `surgeTankPos` arasında çiziliyor ve sahada doğru bağlantıyı gösteriyor. Ancak **Üst Tünel Portalı** deniz suyu adaylarda ekranda görünmüyor — çünkü `tunnelKm` değerine bağlı olarak çok uzağa konumlandırılmış olabilir.

---

## ⚡ Performans Sorunları

| Sorun | Açıklama | Önem |
|-------|----------|------|
| Material re-creation | `steelMat` her render'da yeni oluşturuluyor | 🔴 |
| 600 çevre asset'i | `InstancedEnvironment` 600 ağaç/kaya hesaplıyor, site değiştiğinde `useMemo` dependency yalnızca `isPresenzano` | 🟡 |
| `useFrame` içinde `Math.random()` | Penstock ve transmission partikülleri `Math.random()` kullanıyor — her frame'de titreme (jitter) yaratıyor | 🟡 |
| Shadow map 2048×2048 | Tüm sahne için tek directional light shadow — mobilde ağır | 🟢 |

---

## 💡 İyileştirme Önerileri

### 1. Kamera Açısını Adaya Göre Otomatik Konumlandır
Şu an kamera her aday değişiminde aynı noktadan (`[150, 120, 180]`) başlıyor. `tunnelKm` büyük olan adaylarda (örn. Gökçekaya, Menzelet) yapıların büyük kısmı görüş alanı dışında kalıyor. Çözüm: Site değiştiğinde kamerayı yapıların bounding box'una göre `fitBounds` yaparak otomatik konumlandırmak.

### 2. Deniz Suyu Modelinde Dalga Animasyonu Ekle
`SeaWaterReservoir` şu an düz bir `PlaneGeometry` kullanıyor. Vertex displacement shader ile basit dalga efekti eklemek realizmi artırır.

### 3. Etiket Çakışma Önleme
Canlı site incelemesinde "Kuyruksuyu Portalı" ve "Şalt Sahası (380 kV)" etiketleri sürekli üst üste biniyor (tüm adaylarda). Etiketlere collision avoidance veya z-index sıralama eklenebilir.

### 4. Gece Modu / Aydınlatma Tonu
3D sahne her zaman gündüz modu. `Sky` bileşenine `sunPosition` animasyonu eklenip, uygulamanın koyu/açık temasına bağlı olarak gece sahne görünümü verilebilir.

### 5. Mobile Responsive
Canvas `minHeight: 600` sabit. Mobil cihazlarda sağ panel 3D alanı tamamen kaplayabilir. Responsive breakpoint eklenmeli.

### 6. Penstock Partikülleri İçin Seeded Random
`Math.random()` yerine `pseudoRandom(seed)` fonksiyonu zaten dosyada var (L1296). Partiküllerin jitter'ını azaltmak için bu fonksiyon kullanılmalı.

### 7. Açıkla / Kapat Geçişi İçin Geometry Dispose
`linesData` useMemo'su `isPlaying` değiştiğinde yeni geometry oluşturuyor ama eski geometry dispose edilmiyor. Uzun süreli kullanımda GPU bellek sızıntısı olabilir.

---

## ✅ Doğru Çalışan Kısımlar

| Özellik | Durum |
|---------|-------|
| Terminoloji "Türbin Odası" güncellendi | ✅ Tüm adaylarda doğru |
| Deniz suyu / klasik ayrımı çalışıyor | ✅ `isSeaWater` flag'i doğru |
| Presenzano özel arazi profili | ✅ Cesima dağ profili ayrıştırılmış |
| Katman aç/kapat | ✅ Tüm katmanlar bağımsız toggle edilebiliyor |
| Simülasyon üretim/pompa modları | ✅ Akış yönü doğru değişiyor |
| Ünite sayısı dinamik | ✅ Her adayın ünite sayısı farklı ve doğru |
| Zoom sınırı (maxDistance=1000) | ✅ Artık yapının tamamı görülebiliyor |
| Cebri boru görünürlüğü (kapalıyken) | ✅ Artık solid gri renkte görünüyor |

---

## 📊 Öncelik Sıralaması

| # | Sorun | Önem | Çözüm Karmaşıklığı |
|---|-------|------|---------------------|
| 1 | Material re-creation (BUG-1) | 🔴 | Düşük |
| 2 | Powerhouse isPresenzano (BUG-2) | 🟡 | Düşük |
| 3 | Etiket çakışması (Öneri 3) | 🟡 | Orta |
| 4 | Tunnel label offset (BUG-5) | 🟡 | Düşük |
| 5 | ExtrudeGeometry twist (BUG-6) | 🟡 | Orta |
| 6 | Geometry dispose (Öneri 7) | 🟡 | Düşük |
| 7 | Kamera auto-fit (Öneri 1) | 🟢 | Orta |
| 8 | Ağaç pop-in (BUG-4) | 🟢 | Düşük |
