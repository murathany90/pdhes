# PDHES Yatırım İstihbaratı Uygulaması — Geliştirme Promptu

> Bu doküman, mevcut tek sayfa MapLibre prototipinin bir sonraki ajan tarafından işlenecek tam kapsamlı geliştirme görevlerini tanımlar. Varolan kod, veri ve tasarım dosyaları korunmalı; yalnızca belirtilen iyileştirmeler ve eklentiler yapılmalıdır.

---

## 0. Bağlam ve Mevcut Durum

Proje kökünde şu dosyalar vardır; hepsi analiz edilmeli ve geliştirmede referans alınmalıdır:

- `pspp_yatirim_istihbarat_app.html` — Tek dosya MVP (MapLibre GL JS, tema, daraltılabilir paneller, KML katmanları)
- `data.json` — Mevcut 5 aday saha veri modeli
- `grid_assets.json` — `YTBS_Detayli_Harita (3).kml`'den üretilmiş TEİAŞ şebeke GeoJSON'u (3.933 özellik)
- `README.md` ve `README_pspp_yatirim_istihbarat_app.md` — Ürün ve teknik dokümantasyon
- `znot1.md` — Araştırma notları, benchmarklar, kaynaklar, Galaxy Helios analojisi
- `znot2.md` — Ürün tasarım dokümanı: ekranlar, veri modeli, 3D seviyeleri, MVP önerisi
- `referanstasarim.md` — Referans veri merkezi uygulamasının PDHES'e uyarlanması
- `Türkiye'de Pompaj Depolamalı Hidroelektrik Yatırım Fırsatları.pdf` — Ana rapor; Gökçekaya, Taşucu–Gülnar, Altınkaya, Oymapınar, Karaburun verileri buradan çıkarılmıştır

Mevcut 5 aday saha:
1. **Gökçekaya PSPP** — klasik, 1.400 MW, 9,8 GWh, head 379,5 m
2. **Taşucu–Gülnar Deniz Suyu PSPP** — deniz suyu, 600 MW, 4,8 GWh, head ~780 m
3. **Altınkaya PSPP** — klasik, 1.800 MW, 12,6 GWh, head 611 m
4. **Oymapınar Off-river PSPP** — klasik, 800 MW, 6,4 GWh, head 420 m
5. **Karaburun Sırtı Deniz Suyu PSPP** — deniz suyu, 500 MW, 4,0 GWh, head 620 m

---

## 1. Tam Saha Tespiti ve KML Bağlantı Doğrulaması (Mevcut 5 Saha)

### 1.1 Hedef
Her bir mevcut aday saha için, rapor (`Türkiye'de Pompaj Depolamalı Hidroelektrik Yatırım Fırsatları.pdf`) ve `znot1.md`/`znot2.md` içindeki teknik notlar ayrıntılı olarak taranmalı; mevcut `data.json`'daki koordinatlar, head, hacim, tünel uzunluğu, şebeke mesafesi ve riskler doğrulanmalıdır.

### 1.2 Yapılacaklar
- PDF ve `.md` notlardaki her saha için JICA/rapor verileri ile `data.json` arasındaki tutarlılığı kontrol et.
- Her sahanın en yakın TEİAŞ hattını `grid_assets.json` üzerinden coğrafi olarak bul. Mevcut `layout.gridA` / `layout.gridB` koordinatları ile gerçek KML hattı arasındaki mesafeyi hesapla.
- Eğer mevcut `layout` koordinatları KML'deki gerçek 380 kV / 154 kV hatlarından uzaktaysa, `data.json` içindeki `layout` nesnesini ve `gridDistKm` değerini KML'e göre düzelt.
- Harita üzerinde her saha için "bağlantı koridoru" olarak TEİAŞ hattından saha `switchyard`'ına kadar olan gerçek hat segmentini vurgula (örneğin kırmızı/vurgulu çizgi ile).
- Her saha için şu bilgileri `data.json`'a ekle (eksikse):
  - En yakın 380 kV hat mesafesi (km)
  - En yakın 154 kV hat mesafesi (km)
  - En yakın trafo merkezi (TM) ismi ve koordinatı
  - N-1 ön değerlendirme notu (varsa rapordan)

---

## 2. PDHES Bileşenlerinin 3D Çizim İyileştirmesi ve Detaylandırılması

### 2.1 Hedef
Mevcut `buildLayout()` fonksiyonu basit dikdörtgen/silindir bloklar üretmektedir. PDHES mühendislik bileşenleri daha anlaşılır, farklı geometrilerle ve renklerle temsil edilmelidir.

### 2.2 Yapılacaklar
`buildLayout()` ve `COMPONENTS` dizisini güncelle. Her bileşen için şu iyileştirmeler yapılmalı:

**Üst Rezervuar (upper_reservoir)**
- Mevcut: basit dikdörtgen
- İyileştirme: dairesel/oval kot halkası şeklinde içi boş halka (ring) veya set çizgisi olarak göster. Su seviyesi animasyonu için yüksekliği dinamik yap.
- Renk: `#4aa3ff` (mavi ton, su teması)
- Etiket: "Üst Rezervuar"

**Alt Rezervuar / Deniz Alımı (lower_reservoir)**
- Klasik: alt rezervuarı üst rezervuara benzer şekilde, fakat daha alçak ve geniş göster.
- Deniz suyu: kıyı çizgisine yakın alçak bir platform + denize uzanan intake/outfall yapısı (T şeklinde hat).
- Renk: `#1fb6ff`
- Etiket: "Alt Rezervuar" veya "Deniz Alım/Deşarj"

**Cebri Boru / Penstock (penstock)**
- Mevcut: su yolu line'ı ile aynı
- İyileştirme: Üst rezervuardan surge tank'a kadar olan ana boru hattını kalın, kesikli/sürekli çizgi ile göster. Eğer mümkünse MapLibre'de `line-gradient` kullanarak basınç profili hissi ver (açık maviden koyu maviye).
- Renk: `#36d6ff`

**Yeraltı Güç Evi (powerhouse)**
- Mevcut: dikdörtgen blok
- İyileştirme: Uzun dikdörtgen yerine yeraltı kavern formu: genişliği dar, uzunluğu uzun, yüksekliği orta. İki paralel kavern hissi vermek için blok ortasına ince bölme çizgisi ekle.
- Renk: `#b277ff` (mor)
- Etiket: "Yeraltı Güç Evi / Kavern"

**Surge Tank (surge_tank)**
- Mevcut: silindir
- İyileştirme: Yuvarlak taban + konik tepeli kule formu. MapLibre `fill-extrusion` ile yüksek silindir olarak kalabilir, fakat etikette "Surge Tank / Denge Kulesi" yazmalı.
- Renk: `#ffd75a` (sarı)

**Şalt Sahası / Switchyard (switchyard)**
- Mevcut: dikdörtgen
- İyileştirme: Daha büyük bir dikdörtgen; içinde trafo sembolleri olarak küçük kareler (ikincil katman) ekle. Şebeke bağlantı noktasını net göster.
- Renk: `#48f49a` (yeşil)
- Etiket: "380 kV Şalt Sahası" veya "154/380 kV TM"

**Tünel Portalı / Servis Yolu (portal)**
- Mevcut: küçük dikdörtgen
- İyileştirme: Üçgen çatılı küçük bina formu (üst rezervuar tarafında tünel ağzı). Servis yolunu üst rezervuardan güç evine kadar ince gri çizgi olarak ekle.
- Renk: `#ff944d` (turuncu)
- Etiket: "Tünel Girişi / Servis"

**Ek Bileşen: Erişim Yolu (access_road)**
- Yeni ekle: Üst rezervuara ve şalt sahasına giden servis yolu. Gri, geniş olmayan çizgi.
- Renk: `#8ca69b`

**Ek Bileşen: İletim Hattı Bağlantısı (transmission)**
- Yeni ekle: Şalt sahasından en yakın TEİAŞ hattına giden bağlantı hattı. Sarı, kalın çizgi.
- Renk: `#ffd75a`

### 2.3 Teknik Not
- Tüm yeni katmanlar `blocks-extrusion` içinde değil, ayrı `fill-extrusion` veya `line` katmanları olarak eklenebilir. Mevcut `blocks` kaynağında farklı `type` property'leri kullanarak filtreleme yap.
- `COMPONENTS` dizisi yukarıdaki yeni etiketlerle güncellenmeli.

---

## 3. Haritada 3 Boyutlu Topoğrafinin Anlaşılır Olması

### 3.1 Hedef
Mevcut harita altlığı düz raster tile'dır. 3D yerleşim topografik bağlamda daha iyi anlaşılmalıdır.

### 3.2 Öneriler ve Yapılacaklar
- **Terrain / DEM ekleme:** MapLibre GL JS 2.x+ `terrain` desteği vardır. Eğer mevcut MapLibre sürümü destekliyorsa, `map.setTerrain({source: 'terrain', exaggeration: 1.5})` ile arazi şekillendirilmesi ekle. Terrain kaynağı olarak `https://demotiles.maplibre.org/terrain-tiles/tiles.json` veya MapTiler/Cesium terrain servisi kullanılabilir (token gerektirebilir; token-free alternatif tercih edilmeli).
- **Hillshade katmanı:** Eğer terrain tam olarak eklenemezse, en azından `raster-dem` kaynağı üzerinden `hillshade` katmanı ekle. Bu, yükseklik farklarını gölgelendirerek gösterir.
- **Kontur çizgileri:** `grid-assets` kaynağına benzer şekilde, yüksekliği sabit aralıklarla (örneğin 50 m veya 100 m) gösteren kontur çizgileri ekle. Kaynak: Copernicus DEM'den üretilmiş basit GeoJSON kontur veya vector tile.
- **Kıyı çizgisi vurgusu:** Deniz suyu sahaları (Taşucu, Karaburun) için kıyı çizgisini mavi, kesikli çizgi ile belirginleştir.
- **Açılış görünümü (pitch/zoom):** Mevcut `view` nesnesinde `pitch` değerini artır (örneğin 65-70 derece) ve `zoom`u biraz yakınlaştırarak 3D etkiyi güçlendir.

---

## 4. Sağ Sidebar: PDHES Bileşenleri Paneli ve Yapı Tıklama Detayları

### 4.1 Hedef
Haritadaki 3D yapılara tıklandığında sağ panelde o yapıya özel teknik bilgi görüntülensin. Mevcut "3D bileşen lejantı" kaldırılıp yerine gelişmiş "PDHES Bileşenler" paneli gelsin. "Procedural layout JSON" bölümü tamamen kaldırılsın.

### 4.2 Yapılacaklar

#### A) Haritada Yapı Tıklama Davranışı
- `blocks-extrusion` katmanına tıklama olayı ekle (`map.on('click', 'blocks-extrusion', ...)`).
- Tıklanan bloğun `properties.key` değerine göre (örneğin `upper_reservoir`, `powerhouse`) sağ panelde ayrıntılı kart aç.
- Tıklanan bloğun rengini geçici olarak değiştir (örneğin parlak beyaz/sarı border) ve seçili olduğunu belirt.

#### B) Sağ Panel: "PDHES Bileşenler" Bölümü
Mevcut `<h3>3D bileşen lejantı</h3>` kaldırılacak. Yerine:

```html
<h3>PDHES Bileşenler</h3>
<div id="pdhesComponents"></div>
```

Bu bölüm şu içeriği dinamik olarak göstermeli:

**Varsayılan durum (hiçbir yapı tıklanmamışken):**
- Tüm bileşenlerin listesi küçük ikonlarla ve renk kodlarıyla gösterilsin (eski lejant gibi, ama daha görsel).
- Her bileşenin yanında kısa teknik tanım (1 cümle).

**Yapı tıklandığında:**
Sağ panel yalnızca o yapıya özel bilgi göstersin (eski bilgilerin üzerine yazılsın veya scroll ile görünsün).

Örnek içerikler:

| Bileşen | Gösterilecek Detaylar |
|---------|----------------------|
| Üst Rezervuar | Kot aralığı, aktif hacim (Mm³), set yüksekliği, kaplama tipi, jeoloji riski |
| Alt Rezervuar | Mevcut baraj kotu / deniz seviyesi, minimum çalışma seviyesi, ekolojik akış notu |
| Cebri Boru / Penstock | Çap, uzunluk, malzeme (çelik/GRP), basınç sınıfı, adet |
| Yeraltı Güç Evi | Kavern boyutları, ünite sayısı, toplam MW, makine tipi (Francis türbin) |
| Surge Tank | Tip (kule/sürge şaft), yükseklik, çap, su darbesi koruma notu |
| Şalt Sahası | Gerilim seviyesi (380 kV / 154 kV), trafo sayısı, bağlantı hattı uzunluğu |
| Tünel Portalı | Tünel uzunluğu, çap, kazı tipi (TBM/drift), servis yolu uzunluğu |

Bu bilgiler `data.json`'daki her saha nesnesine yeni bir `components_detail` nesnesi olarak eklenebilir. Mevcut `data.json` yapısı bozulmadan, yeni alanlar eklenebilir.

#### C) "Procedural layout JSON" Kaldırma
- HTML içindeki `<h3>Procedural layout JSON</h3>` ve `<pre id="layoutJson">` elementleri tamamen silinecek.
- `renderMapPanels()` fonksiyonundaki `$('layoutJson').textContent = ...` satırı kaldırılacak.

---

## 5. 5 Yeni Aday Saha Ekleme

### 5.1 Hedef
Mevcut 5 sahaya ilave olarak, proje kökündeki rapor ve notlar kullanılarak 5 yeni aday saha oluşturulacak. Bu sahalar için:
- `data.json`'a tam veri modeli eklenecek
- Hesaplama motoru (`renderCalc`) otomatik olarak çalışacak
- 3D harita yerleşimi (`buildLayout`) prosedürel olarak üretilecek
- TEİAŞ KML bağlantısı doğrulanacak

### 5.2 Kaynaklar
Yeni sahalar şu kaynaklardan çıkarılmalıdır:
- `Türkiye'de Pompaj Depolamalı Hidroelektrik Yatırım Fırsatları.pdf` — raporda adı geçen ancak `data.json`'da olmayan diğer adaylar
- `znot2.md` — "Bozyazı–Anamur", "Amanos", "Antalya batı kıyısı", "Ege/Marmara düşük düşü lagün" gibi adı geçen bölgeler
- `znot1.md` — Türkiye kıyı grid taraması ve klasik aday mantığı

### 5.3 Seçim Kriterleri
5 yeni saha şu dağılımda olmalı:
- **En az 2 deniz suyu kıyı sahası** (farklı kıyı bölgelerinden; örn. Karadeniz veya Ege kıyısı)
- **En az 2 klasik / off-river sahası** (farklı havzalardan; örn. Fırat/Kızılırmak dışındaki havzalar)
- **1 hibrit veya stratejik farklı saha** (örn. mevcut büyük baraj kompleksi çevresi, düşük düşü lagün tipi)

### 5.4 Her Yeni Saha İçin Gerekli Veriler
`data.json` formatına tam uyumlu olarak şu alanlar doldurulmalı:

```json
{
  "id": "benzersiz-id",
  "name": "Saha Adı PSPP",
  "concept": "classic | sea",
  "conceptLabel": "Klasik ... / Deniz suyu ...",
  "lat": 00.00,
  "lon": 00.00,
  "region": "Bölge tanımı",
  "score": 0-100,
  "head": 000.0,
  "tunnelKm": 0.0,
  "activeMcm": 00.0,
  "powerMW": 0000,
  "energyGWh": 00.0,
  "capexBn": 0.00,
  "revenueM": 000,
  "payback": 00.0,
  "gridDistKm": 0.0,
  "lower": "Alt rezervuar tanımı",
  "upper": "Üst rezervuar tanımı",
  "thesis": "Yatırım tezi (1-2 cümle)",
  "risks": ["risk1", "risk2", "risk3", "risk4"],
  "scores": {"topo": 0, "grid": 0, "env": 0, "geology": 0, "access": 0, "market": 0},
  "view": {"center": [lon, lat], "zoom": 0.0, "pitch": 0, "bearing": 0},
  "color": "#hex",
  "layout": {
    "bearing": 0,
    "upper": [lon, lat],
    "lower": [lon, lat],
    "power": [lon, lat],
    "surge": [lon, lat],
    "switchyard": [lon, lat],
    "gridA": [lon, lat],
    "gridB": [lon, lat],
    "risk": [lon, lat]
  },
  "timeline": [
    {"date": "YYYY QN", "title": "...", "text": "..."}
  ],
  "components_detail": {
    "upper_reservoir": {"elevation_m": 0, "active_volume_mcm": 0, "dam_height_m": 0, "lining": "...", "geology_note": "..."},
    "lower_reservoir": {"elevation_m": 0, "min_level_m": 0, "note": "..."},
    "penstock": {"diameter_m": 0, "length_m": 0, "material": "...", "pressure_class": "...", "count": 0},
    "powerhouse": {"cavern_width_m": 0, "cavern_length_m": 0, "cavern_height_m": 0, "units": 0, "turbine_type": "..."},
    "surge_tank": {"type": "...", "height_m": 0, "diameter_m": 0},
    "switchyard": {"voltage_kv": 0, "transformer_count": 0, "connection_line_km": 0},
    "tunnel": {"length_m": 0, "diameter_m": 0, "excavation_type": "..."}
  }
}
```

### 5.5 Koordinat ve Layout Üretimi
- Her yeni saha için `lat/lon` ve `layout` koordinatları, rapordaki bölge tanımlarına ve `znot2.md`'deki kavramsal yerleşim mantığına göre belirlenmeli.
- `layout` içindeki `gridA` ve `gridB`, `grid_assets.json` üzerinden o bölgedeki gerçek TEİAŞ hattına yakın koordinatlar olmalı (coğrafi olarak makul, gerçekçi konumlandırma).
- `view.center` sahanın merkezine denk gelmeli, `zoom` 10–12 aralığında, `pitch` 55–65 aralığında olmalı.

### 5.6 3D Harita Uyumluluğu
- Yeni sahalar eklendikten sonra `buildLayout()` ve `candidateFeatures()` fonksiyonları otomatik olarak çalışmalı; ekstra kod değişikliği gerektirmemeli (mevcut yapı zaten `SITES` dizisini tarıyor).
- Yeni sahaların `color` değeri mevcut 5 sahadan farklı olmalı; renk çakışması olmamalı.
- `renderTable()` ve `renderMapPanels()` otomatik olarak yeni sahaları göstermeli.

---

## 6. Çıktı Beklentileri ve Doğrulama

### 6.1 Dosya Çıktıları
Geliştirme tamamlandığında şu dosyalar güncellenmiş/güncellenmemiş olarak teslim edilmelidir:

- `pspp_yatirim_istihbarat_app.html` — Tüm değişiklikler burada
- `data.json` — 10 sahaya çıkarılmış hali
- `README_pspp_yatirim_istihbarat_app.md` — Yeni sahalar ve özellikler dokümante edilmeli
- `prompt.md` — Bu dosya (değişiklik yapılmayabilir)

### 6.2 Fonksiyonel Doğrulama Listesi
- [ ] Tüm 10 saha `data.json`'da eksiksiz ve doğru formatta
- [ ] Harita açılıyor, tüm 10 saha noktası görünüyor
- [ ] Her sahaya tıklandığında 3D layout blokları doğru yerde görünüyor
- [ ] Bloklara tıklandığında sağ panelde "PDHES Bileşenler" detay kartı açılıyor
- [ ] "Procedural layout JSON" bölümü kaldırılmış
- [ ] KML katmanları (400/154/66 kV) açılıp kapatılabiliyor ve pop-up çalışıyor
- [ ] Tema değişimi tüm arayüzü etkiliyor
- [ ] Panel daraltma/geri açma sorunsuz çalışıyor
- [ ] Hesaplama motoru yeni sahalar için de çalışıyor
- [ ] Yeni sahaların TEİAŞ bağlantı mesafeleri `grid_assets.json` ile tutarlı

---

## 7. Teknik Kısıtlar

- **Tek dosfa HTML** kuralı korunmalı. CSS ve JS inline olarak `pspp_yatirim_istihbarat_app.html` içinde kalacak.
- **Harici veri** yalnızca `data.json` ve `grid_assets.json` olarak `fetch` ile yüklenecek.
- **MapLibre CDN** kullanılmaya devam edilecek; build sistemi gerektirmeyecek.
- **Türkçe karakterler** doğru şekilde korunacak (ç, ğ, ı, ö, ş, ü, İ, Ç, Ğ, Ö, Ş, Ü).
- Mevcut kod stili ve değişken isimleri (örn. `forEach`, `active`, `background`) İngilizce/CSS/JS anahtar kelimeleri olarak korunacak; Türkçeleştirme sadece kullanıcıya görünen metinlerde olacak.

---

*Bu prompt, proje kökündeki tüm `.md` dosyaları ve PDF rapor dikkate alınarak hazırlanmıştır. Ajan, belirsiz kaldığı noktalarda `znot1.md`, `znot2.md` ve raporu tekrar okuyarak karar vermelidir.*
