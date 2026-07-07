# PDHES Uygulaması JICA 16 + 4 Deniz Tipi Prototip Güncelleme Promptu

> Bu dosya, `README.md` ile verilen mevcut PDHES web uygulamasını geliştiren agente verilecek tam görev promptudur.  
> Amaç: mevcut 20 adaylı yapıyı, **16 JICA/EİE PDHES adayı + mevcut veri setinden en yüksek puanlı 4 deniz tipi prototip** olacak şekilde yeniden kurmak; İtalya’daki projeyi Türkiye aday listesinden çıkarıp **Dünyadaki Örnekler** bölümüne taşımak; PDHES tip sınıflandırmasını teknik olarak düzeltmek; harita ve 3D yerleşim koordinatlarını tüm tesis yapıları için çalışır hale getirmektir.

---

## 0. Rolün

Sen üst düzey bir **React + TypeScript + GIS + Three.js / React Three Fiber geliştiricisi**, aynı zamanda enerji altyapısı veri modeli ve hidroelektrik tesis kavramsal yerleşimi konusunda çalışan bir **teknik veri mühendisisin**.

Görevin, mevcut uygulamayı bozmadan değil; **temiz veri modeliyle yeniden düzenleyerek** geliştirmektir. Geriye dönük uyumluluk gerekmez. Eski tip adları, eski aday yapısı ve eski veri alanlarıyla uyumluluk sağlamak zorunda değilsin. Uygulama temiz, güncel ve teknik olarak tutarlı yeni veri modeliyle çalışmalıdır.

---

## 1. İncelenecek Dosyalar ve Mevcut Mimari

Önce ekli dokümanları ve repo dosyalarını incele:

1. `README.md`
2. `app/public/data.json`
3. `app/public/grid_assets.json`
4. `app/src` altındaki tüm veri tipi, store, sayfa ve bileşen dosyaları
5. Harita bileşenleri: MapLibre / React Map GL kullanılan component’ler
6. 3D bileşenleri: Three.js, React Three Fiber, Drei kullanılan component’ler
7. Yönetim / veri düzenleme / JSON export-import bileşenleri
8. PDHES Nedir / Datalar / Harita / 3D Yerleşim / Hesaplamalar / Yönetim / Ayarlar sekmeleri
9. Ek teknik dokümanlar:
   - JICA raporu / Türkiye Pik Talebin Karşılanması İçin Optimal Güç Üretimi çalışması
   - TESAB / Pompaj Depolamalı HES Projeleri dokümanı
   - TSKB PDHES bilgi notu
   - Kullanıcının verdiği 16 aday teknik veri listesi

Mevcut README’ye göre uygulama:
- React 18 + Vite + TypeScript tabanlıdır.
- Zustand ile durum yönetimi yapmaktadır.
- MapLibre / React Map GL ile harita üretmektedir.
- Three.js / React Three Fiber / Drei ile kavramsal 3D tesis yerleşimi üretmektedir.
- Tesis verilerini `app/public/data.json` içinden statik olarak yüklemektedir.
- Eğitim ve masaüstü ön inceleme demosudur; resmi fizibilite, yatırım tavsiyesi veya mühendislik tasarımı değildir.

Bu uyarı metni korunacak, daha da belirgin hale getirilecektir.

---

## 2. En Önemli Kural: Geriye Dönük Uyumluluk Yok

Bu görevde geriye dönük uyumluluk gerekmiyor.

Buna göre:

- Eski `Müstakil PDHES`, `Yarı PDHES`, `Makro Deniz PDHES`, `Mikro Deniz PDHES` gibi kullanıcıya gösterilen sınıflar kaldırılacak.
- Eski aday listesi korunmayacak.
- Eski veri alanlarını yaşatmak için karmaşık migration zorunlu değil.
- Eski JSON yedeklerini okuyabilmek zorunda değilsin.
- Ancak kod tarafında kullanılmayan eski alanlar kalırsa uygulamayı kirleteceği için temizle.
- Yeni veri modeli açık, teknik, çok boyutlu ve okunabilir olmalıdır.
- UI tarafında kullanıcıya sadece yeni teknik sınıflandırma gösterilecektir.

---

## 3. Ana Hedef

Mevcut uygulamadaki 20 adaylı yapı şu şekilde yeniden kurulacaktır:

### Yeni Türkiye Aday Listesi

Toplam Türkiye adayı yine **20 adet** olacaktır:

1. **16 adet JICA/EİE PDHES adayı**
2. **Mevcut veri setindeki deniz tipi/offshore/sea-water adaylar arasından en yüksek puanlı 4 prototip**

### Dünya Örnekleri Listesi

Mevcut Türkiye aday listesinde görünen **İtalya’daki PDHES projesi** Türkiye aday listesinden çıkarılacak ve **Dünyadaki Örnekler Listesi** bölümüne taşınacaktır.

İtalya projesi:
- Türkiye aday listesinde görünmeyecek.
- Türkiye haritasında aday marker olarak görünmeyecek.
- Dünya örnekleri bölümünde görünecek.
- Varsa mevcut açıklama, kapasite, koordinat, görsel, dış bağlantı ve risk notları korunacak.


---

## 4. Yeni Veri Modeli

`data.json` veya ilgili veri dosyasını temiz ve açık bir şemaya dönüştür.

Önerilen ana yapı:

```ts
type CandidateSourceGroup =
  | "JICA_EIE_16"
  | "SEA_WATER_PROTOTYPE_TOP4";

type WorldExampleSourceGroup =
  | "WORLD_EXAMPLE";

type CycleType =
  | "OPEN_LOOP"
  | "CLOSED_LOOP"
  | "SEA_LOWER_RESERVOIR";

type InfrastructureType =
  | "PURE_NEW_BUILD"
  | "MIXED_EXISTING_HYDRO_CASCADE"
  | "EXISTING_RESERVOIR_INTEGRATED"
  | "SEAWATER_COASTAL";

type ConceptType =
  | "CONVENTIONAL_LAND"
  | "SEAWATER"
  | "VARIABLE_SPEED_OPTION"
  | "HYBRID_RENEWABLE_OPTION";

type GridSupplyType =
  | "GRID_SUPPORTED"
  | "HYBRID_RENEWABLE_POTENTIAL"
  | "OFFGRID_OR_ISLAND_PILOT";

type PrimaryPurpose =
  | "PEAK_POWER"
  | "ENERGY_STORAGE"
  | "RENEWABLE_BALANCING"
  | "ISLAND_GRID_RESILIENCE";

type CoordinateConfidence =
  | "existing-data"
  | "fallback-approximate"
  | "agent-verified-dem"
  | "official-or-surveyed";

interface TechnicalClassification {
  cycleType: CycleType;
  infrastructureType: InfrastructureType;
  conceptType: ConceptType;
  gridSupplyType: GridSupplyType;
  primaryPurpose: PrimaryPurpose;
  classificationNote: string;
}

interface PdhCandidate {
  id: string;
  name: string;
  province: string;
  country: "Türkiye";
  sourceGroup: CandidateSourceGroup;
  sourceNote: string;

  capacityMW: number;
  projectFlowCms: number | null;
  headM: number | null;
  energyGWh?: number | null;
  activeVolumeHm3?: number | null;
  tunnelLengthKm?: number | null;
  capexUsdBn?: number | null;
  annualRevenueUsdM?: number | null;
  paybackYear?: number | null;
  score?: number | null;

  lowerReservoirName: string;
  upperReservoirDescription: string;
  shaftLengthM?: number | null;
  penstockLengthM?: number | null;
  tailraceTunnelLengthM?: number | null;

  technicalClassification: TechnicalClassification;

  coordinates: PdhCoordinateSet;

  risks: string[];
  assumptions: string[];
  model3d: Pdh3dModelSpec;
}

interface PdhCoordinateSet {
  coordinateSystem: "WGS84";
  coordinateOrder: "[lon, lat]";
  coordinateConfidence: CoordinateConfidence;
  coordinateNote: string;
  mapAnchor: [number, number];
  lowerReservoir: { name: string; point: [number, number] };
  upperReservoir: { description: string; point: [number, number] };
  powerhouse: { point: [number, number]; preferred3dType: string };
  surgeTank: { point: [number, number] };
  penstockRoute: [number, number][];
  tailraceOutlet: { point: [number, number] };
  switchyard: { point: [number, number] };
  gridConnection: { point: [number, number]; voltageClassHint: string };
  intakeOutfall?: { point: [number, number]; description: string } | null;
  bbox: [number, number, number, number];
}

interface Pdh3dModelSpec {
  terrainMode: "real-dem-if-available-else-procedural";
  lowerReservoirMode: "existing-dam-lake" | "artificial-lower-pond" | "sea";
  upperReservoirMode: "concrete-lined-pool" | "compacted-clay-pool" | "geomembrane-or-conceptual-pool";
  powerhouseMode: "underground-cavern" | "semi-underground-or-surface";
  penstockMode: "shaft-plus-pressure-tunnel" | "surface-or-buried-penstock" | "conceptual-waterway";
  showUncertaintyOverlay: boolean;
}
```

Bu şema bire bir uygulanmak zorunda değildir; ancak veri modeli bu seviyede kapsamlı olmalı, null/undefined kaynaklı UI hatası üretmemelidir.

---

## 5. Yeni Türkiye Aday Listesi: Tam 20 Kayıt

Türkiye aday listesi yalnızca aşağıdakilerden oluşacaktır:

### 5.1. JICA/EİE 16 Adayı

| Sıra | Proje | İl | Kurulu Güç MW | Proje Debisi m³/s | Düşü m | Yapı | Alt Rezervuar / Varsayım | Şaft | Cebri Boru | Kuyruk Suyu Tüneli |
|---:|---|---|---:|---:|---:|---|---|---:|---:|---:|
| 1 | Gökçekaya PDHES | Eskişehir | 1600 | 193 | 962 | Mevcut baraj gölüne entegre | Gökçekaya Barajı / mevcut baraj gölü | Belirtilmedi | Belirtilmedi | Belirtilmedi |
| 2 | İznik I PDHES | Bursa | 1500 | 687 | 255 | Tamamen yeni yatırım | İznik Gölü çevresi / kavramsal alt rezervuar | Belirtilmedi | Belirtilmedi | Belirtilmedi |
| 3 | Sarıyar PDHES | Ankara | 1000 | 270 | 434 | Mevcut baraj gölüne entegre | Sarıyar Barajı | 387 m | 595 m | 815 m |
| 4 | Bayramhacılı PDHES | Kayseri | 1000 | 720 | 161 | Mevcut baraj gölüne entegre | Bayramhacılı Barajı / Kızılırmak | 305 m | Belirtilmedi | 160 m |
| 5 | Hasan Uğurlu PDHES | Samsun | 1000 | 204 | 570 | Mevcut baraj gölüne entegre | Hasan Uğurlu Barajı | 635 m | Belirtilmedi | 965 m |
| 6 | Adıgüzel PDHES | Denizli | 1000 | 484 | 242 | Mevcut baraj gölüne entegre | Adıgüzel Barajı | 303 m | 216 m | 447 m |
| 7 | Burdur PDHES | Burdur | 1000 | 316 | 370 | Tamamen yeni yatırım | Burdur Gölü çevresi / kavramsal alt rezervuar | Belirtilmedi | Belirtilmedi | Belirtilmedi |
| 8 | Eğirdir PDHES | Isparta | 1000 | 175 | 672 | Tamamen yeni yatırım | Eğirdir Gölü çevresi / kavramsal alt rezervuar | Belirtilmedi | Belirtilmedi | Belirtilmedi |
| 9 | Kargı PDHES | Ankara | 1000 | 238 | 496 | Mevcut baraj gölüne entegre | Kargı Barajı / Sakarya Nehri | 367 m | 1815 m | 580 m |
| 10 | Karacaören II PDHES | Burdur | 1000 | 190 | 615 | Mevcut baraj gölüne entegre | Karacaören II Barajı | Belirtilmedi | Belirtilmedi | Belirtilmedi |
| 11 | Yalova PDHES | Yalova | 500 | 147 | 400 | Tamamen yeni yatırım / alt rezervuar Yalova Regülatörü | Yalova Regülatörü | 800 m | Belirtilmedi | 300 m |
| 12 | Yamula PDHES | Kayseri | 500 | 228 | 260 | Mevcut baraj gölüne entegre | Yamula Barajı | 80 m | 1540 m | 300 m |
| 13 | Oymapınar PDHES | Antalya | 500 | 156 | 372 | Mevcut baraj gölüne entegre | Oymapınar Barajı | 419 m | Belirtilmedi | 500 m |
| 14 | Aslantaş PDHES | Osmaniye | 500 | 379 | 154 | Mevcut baraj gölüne entegre | Aslantaş Barajı | Belirtilmedi | 875 m | 225 m |
| 15 | İznik II PDHES | Bursa | 500 | 221 | 263 | Tamamen yeni yatırım | İznik Gölü çevresi / kavramsal alt rezervuar | Belirtilmedi | Belirtilmedi | Belirtilmedi |
| 16 | Demirköprü PDHES | Manisa | 300 | 166 | 213 | Mevcut baraj gölüne entegre | Demirköprü Barajı | 157 m | 473 m | 832 m |

### 5.2. Deniz Tipi 4 Prototip

Mevcut `data.json` içinde deniz tipi / offshore / sea-water / sea lower reservoir adaylarını tespit et.

Aşağıdaki adımlar uygulanacak:

1. `sourceGroup`, `concept`, `type`, `category`, `name`, `description`, `technicalClassification`, `legacyType` gibi tüm alanlarda deniz tipi göstergelerini ara.
2. Aşağıdaki anahtar kelimeleri kullan:
   - `deniz`
   - `sea`
   - `seawater`
   - `offshore`
   - `coastal`
   - `kıyı`
   - `MAKRO_DENIZ`
   - `MIKRO_DENIZ`
   - `Deniz Suyu`
3. Deniz tipi adayları çıkar.
4. Gerçek `score` alanına göre büyükten küçüğe sırala.
5. En yüksek puanlı 4 adayı Türkiye aday listesinde 17-20. sıra olarak tut.
6. Eğer `score` alanı yoksa veya tüm adaylarda boşsa:
   - Önce README’deki detaylı aday kartlarında “Puan” ifadesini ara.
   - Sonra `paybackYear`, `headM`, `capacityMW`, `distanceToGridKm`, `environmentRisk`, `capex` gibi alanlardan mevcut uygulamadaki skor mantığını yeniden hesapla.
   - Hesaplama yaparsan formülü kod yorumunda ve Yönetim/Ayarlar sekmesinde açıkça belirt.
7. Yeni deniz tipi ad uydurma.
8. Veri setindeki mevcut deniz adaylarının koordinatlarını, açıklamalarını, skorlarını ve risklerini mümkün olduğunca koru.
9. Deniz tipi adayların `technicalClassification` değerleri şu mantıkta olmalı:
   - `cycleType: "SEA_LOWER_RESERVOIR"`
   - `infrastructureType: "SEAWATER_COASTAL"`
   - `conceptType: "SEAWATER"`
   - `gridSupplyType`: ana karadaysa `"GRID_SUPPORTED"`, ada pilotuysa `"OFFGRID_OR_ISLAND_PILOT"`
   - `primaryPurpose`: büyük kıyı projelerinde `"ENERGY_STORAGE"` veya `"RENEWABLE_BALANCING"`, ada pilotlarında `"ISLAND_GRID_RESILIENCE"`

---

## 6. PDHES Teknik Sınıflandırması

Kullanıcıya gösterilecek yeni tip sistemi çok boyutlu olmalıdır.

### 6.1. Döngü Yapısına Göre

1. **Açık Devre / Birleşik / Açık Döngü PDHES**  
   Alt veya üst rezervuarın doğal nehir, baraj gölü, deniz veya sürekli su kaynağı ile ilişkili olduğu sistem.

2. **Kapalı Devre / Saf / Kapalı Döngü PDHES**  
   Doğal akarsuya sürekli bağlı olmayan, iki yapay rezervuar arasında suyun devridaim ettiği sistem.

3. **Deniz Alt Rezervuarlı PDHES**  
   Alt rezervuarın deniz olduğu, üst rezervuarın kıyı yüksek topoğrafyada konumlandığı sistem.

### 6.2. Yapılış Şekline / Altyapıya Göre

1. **Saf / Tamamen Yeni PDHES**
2. **Karışık / Mevcut HES Kaskadı Entegrasyonu**
3. **Mevcut Rezervuar Entegre PDHES**
4. **Kıyı / Deniz Suyu PDHES**

### 6.3. Konsept Teknolojisine Göre

1. **Geleneksel Kara Tipi PDHES**
2. **Deniz Suyu PDHES**
3. **Değişken Hızlı PDHES Seçeneği**
4. **Hibrit Yenilenebilir Entegrasyon Seçeneği**

Önemli: Kaynakta kesin bilgi yoksa değişken hızlı veya hibrit teknoloji kesinmiş gibi yazma. “Seçenek / potansiyel / ileri tasarımda değerlendirilecek” şeklinde belirt.

### 6.4. Enerji Besleme / Şebeke Durumuna Göre

1. **Şebeke Destekli PDHES**
2. **Hibrit Yenilenebilir Potansiyelli PDHES**
3. **Ada / Mikro Şebeke Pilot PDHES**

### 6.5. Yapılış Amacına Göre

1. **Pik Güç Santrali**
2. **Enerji Depolama Santrali**
3. **Yenilenebilir Enerji Dengeleme Tesisi**
4. **Ada Şebeke Dayanıklılığı Pilot Tesisi**

### 6.6. JICA 16 İçin Varsayılan Sınıflandırma Mantığı

- Mevcut baraj gölüne entegre olanlar:
  - `cycleType: "OPEN_LOOP"`
  - `infrastructureType: "EXISTING_RESERVOIR_INTEGRATED"`
  - `conceptType: "CONVENTIONAL_LAND"`
  - `gridSupplyType: "GRID_SUPPORTED"`
  - `primaryPurpose: "PEAK_POWER"`

- Tamamen yeni yatırım olanlar:
  - `cycleType: "CLOSED_LOOP"` veya alt rezervuar doğal göl/regülatör olarak yorumlanıyorsa `"OPEN_LOOP"`; UI’da not olarak açıkla.
  - `infrastructureType: "PURE_NEW_BUILD"`
  - `conceptType: "CONVENTIONAL_LAND"`
  - `gridSupplyType: "GRID_SUPPORTED"`
  - `primaryPurpose: "PEAK_POWER"`

- Güncel enerji depolama bağlamı için açıklama alanında:
  - “JICA/EİE çalışması pik güç optimizasyonu bağlamındadır; güncel sistemde aynı tesisler yenilenebilir enerji entegrasyonu ve uzun süreli enerji depolama için de değerlendirilebilir.”
  yaz.

---

## 7. Koordinat ve Harita Modeli

JICA/EİE raporunda 16 aday için enlem/boylam verilmediği kabul edilecektir. Bu nedenle:

- Koordinatlar hiçbir yerde “resmi / kesin / JICA’da verilen koordinat” olarak gösterilmeyecek.
- Tüm öneri koordinatlar `coordinateConfidence: "fallback-approximate"` olarak işaretlenecek.
- Kullanıcı arayüzünde şu not gösterilecek:

> “Bu koordinatlar, kaynak raporda enlem/boylam verilmediği için baraj/göl/regülatör adı ve açık harita/topografya ön kabulüyle yaklaşık yerleştirilmiştir. Saha etüdü, resmi proje paftası, DEM analizi, kamulaştırma verisi, korunan alan ve jeoloji doğrulaması yapılmadan kesin proje konumu olarak kullanılamaz.”

### 7.1. Koordinat Formatı

- WGS84 kullanılacak.
- Tüm dizi koordinatları `[lon, lat]` sırasındadır.
- MapLibre ve GeoJSON için aynı format korunacak.
- UI’da gösterirken “Enlem / Boylam” olarak çevrilebilir, fakat veri dosyasında `[lon, lat]` kalmalıdır.

---

## 8. 16 JICA Adayı İçin Fallback Öneri Koordinatları ve 3D Yapı Yerleşimleri

Aşağıdaki koordinatlar, otomatik/harita tabanlı üretim başarısız olursa kullanılacak **fallback öneri koordinatlardır**. Agent, DEM ve uydu görüntüsüyle daha iyi nokta bulursa bu değerleri güncelleyebilir; ancak koordinat güven notunu yine korumalıdır.

```json
[
  {
    "id": "jica-gokcekaya-pspp",
    "name": "Gökçekaya PDHES",
    "coordinateSystem": "WGS84",
    "coordinateOrder": "[lon, lat]",
    "coordinateConfidence": "fallback-approximate",
    "coordinateNote": "Kaynak raporda enlem/boylam verilmediği için baraj/göl/regülatör adı ve açık harita/topografya ön kabulüyle öneri koordinat verilmiştir; DEM, uydu görüntüsü, mülkiyet, korunan alan ve saha etüdüyle doğrulanmadan kesin konum gibi kullanılmamalıdır.",
    "mapAnchor": [
      31.0274,
      40.04065
    ],
    "lowerReservoir": {
      "name": "Gökçekaya Barajı / mevcut baraj gölü",
      "point": [
        31.0098,
        40.0263
      ]
    },
    "upperReservoir": {
      "description": "Kavramsal üst rezervuar; JICA detayına göre yüksek düşülü yapı",
      "point": [
        31.045,
        40.055
      ]
    },
    "powerhouse": {
      "point": [
        31.0145,
        40.0295
      ],
      "preferred3dType": "underground-cavern"
    },
    "surgeTank": {
      "point": [
        31.02975,
        40.04225
      ]
    },
    "penstockRoute": [
      [
        31.045,
        40.055
      ],
      [
        31.02975,
        40.04225
      ],
      [
        31.022125,
        40.035875
      ],
      [
        31.0145,
        40.0295
      ]
    ],
    "tailraceOutlet": {
      "point": [
        31.01215,
        40.0279
      ]
    },
    "switchyard": {
      "point": [
        31.02,
        40.031
      ]
    },
    "gridConnection": {
      "point": [
        31.035,
        40.0355
      ],
      "voltageClassHint": "154/380 kV yakın bağlantı ön kabulü; gerçek trafo merkezi/hat verisiyle doğrulanacak"
    },
    "intakeOutfall": null,
    "bbox": [
      30.9798,
      39.9963,
      31.075,
      40.085
    ],
    "modelHints": {
      "headM": 962,
      "flowCms": 193,
      "capacityMW": 1600,
      "shaftM": null,
      "penstockM": null,
      "tailraceM": null,
      "upperReservoirMaterialHint": "Kavramsal havuz",
      "waterAnimation": {
        "generation": "upperReservoir -> penstockRoute -> powerhouse -> tailraceOutlet -> lowerReservoir",
        "pumping": "lowerReservoir -> powerhouse -> penstockRoute -> upperReservoir"
      }
    }
  },
  {
    "id": "jica-iznik-i-pspp",
    "name": "İznik I PDHES",
    "coordinateSystem": "WGS84",
    "coordinateOrder": "[lon, lat]",
    "coordinateConfidence": "fallback-approximate",
    "coordinateNote": "Kaynak raporda enlem/boylam verilmediği için baraj/göl/regülatör adı ve açık harita/topografya ön kabulüyle öneri koordinat verilmiştir; DEM, uydu görüntüsü, mülkiyet, korunan alan ve saha etüdüyle doğrulanmadan kesin konum gibi kullanılmamalıdır.",
    "mapAnchor": [
      29.5,
      40.4648
    ],
    "lowerReservoir": {
      "name": "İznik Gölü çevresi / kavramsal alt rezervuar",
      "point": [
        29.52,
        40.4336
      ]
    },
    "upperReservoir": {
      "description": "İznik kuzey yamaçlarında kavramsal üst rezervuar",
      "point": [
        29.48,
        40.496
      ]
    },
    "powerhouse": {
      "point": [
        29.51,
        40.44
      ],
      "preferred3dType": "semi-underground-or-surface"
    },
    "surgeTank": {
      "point": [
        29.495,
        40.468
      ]
    },
    "penstockRoute": [
      [
        29.48,
        40.496
      ],
      [
        29.495,
        40.468
      ],
      [
        29.5025,
        40.454
      ],
      [
        29.51,
        40.44
      ]
    ],
    "tailraceOutlet": {
      "point": [
        29.515,
        40.4368
      ]
    },
    "switchyard": {
      "point": [
        29.516,
        40.443
      ]
    },
    "gridConnection": {
      "point": [
        29.545,
        40.456
      ],
      "voltageClassHint": "154/380 kV yakın bağlantı ön kabulü; gerçek trafo merkezi/hat verisiyle doğrulanacak"
    },
    "intakeOutfall": null,
    "bbox": [
      29.45,
      40.4036,
      29.575,
      40.526
    ],
    "modelHints": {
      "headM": 255,
      "flowCms": 687,
      "capacityMW": 1500,
      "shaftM": null,
      "penstockM": null,
      "tailraceM": null,
      "upperReservoirMaterialHint": "Kavramsal havuz",
      "waterAnimation": {
        "generation": "upperReservoir -> penstockRoute -> powerhouse -> tailraceOutlet -> lowerReservoir",
        "pumping": "lowerReservoir -> powerhouse -> penstockRoute -> upperReservoir"
      }
    }
  },
  {
    "id": "jica-sariyar-pspp",
    "name": "Sarıyar PDHES",
    "coordinateSystem": "WGS84",
    "coordinateOrder": "[lon, lat]",
    "coordinateConfidence": "fallback-approximate",
    "coordinateNote": "Kaynak raporda enlem/boylam verilmediği için baraj/göl/regülatör adı ve açık harita/topografya ön kabulüyle öneri koordinat verilmiştir; DEM, uydu görüntüsü, mülkiyet, korunan alan ve saha etüdüyle doğrulanmadan kesin konum gibi kullanılmamalıdır.",
    "mapAnchor": [
      31.39085,
      40.05495
    ],
    "lowerReservoir": {
      "name": "Sarıyar Barajı",
      "point": [
        31.4147,
        40.0399
      ]
    },
    "upperReservoir": {
      "description": "435 m yükseklikte beton kaplamalı üst havuz",
      "point": [
        31.367,
        40.07
      ]
    },
    "powerhouse": {
      "point": [
        31.4095,
        40.037
      ],
      "preferred3dType": "underground-cavern"
    },
    "surgeTank": {
      "point": [
        31.38825,
        40.0535
      ]
    },
    "penstockRoute": [
      [
        31.367,
        40.07
      ],
      [
        31.38825,
        40.0535
      ],
      [
        31.398875,
        40.04525
      ],
      [
        31.4095,
        40.037
      ]
    ],
    "tailraceOutlet": {
      "point": [
        31.4121,
        40.03845
      ]
    },
    "switchyard": {
      "point": [
        31.4155,
        40.0355
      ]
    },
    "gridConnection": {
      "point": [
        31.44,
        40.048
      ],
      "voltageClassHint": "154/380 kV yakın bağlantı ön kabulü; gerçek trafo merkezi/hat verisiyle doğrulanacak"
    },
    "intakeOutfall": null,
    "bbox": [
      31.337,
      40.0055,
      31.47,
      40.1
    ],
    "modelHints": {
      "headM": 434,
      "flowCms": 270,
      "capacityMW": 1000,
      "shaftM": 387,
      "penstockM": 595,
      "tailraceM": 815,
      "upperReservoirMaterialHint": "Beton kaplamalı havuz",
      "waterAnimation": {
        "generation": "upperReservoir -> penstockRoute -> powerhouse -> tailraceOutlet -> lowerReservoir",
        "pumping": "lowerReservoir -> powerhouse -> penstockRoute -> upperReservoir"
      }
    }
  },
  {
    "id": "jica-bayramhacili-pspp",
    "name": "Bayramhacılı PDHES",
    "coordinateSystem": "WGS84",
    "coordinateOrder": "[lon, lat]",
    "coordinateConfidence": "fallback-approximate",
    "coordinateNote": "Kaynak raporda enlem/boylam verilmediği için baraj/göl/regülatör adı ve açık harita/topografya ön kabulüyle öneri koordinat verilmiştir; DEM, uydu görüntüsü, mülkiyet, korunan alan ve saha etüdüyle doğrulanmadan kesin konum gibi kullanılmamalıdır.",
    "mapAnchor": [
      34.839,
      38.77
    ],
    "lowerReservoir": {
      "name": "Bayramhacılı Barajı / Kızılırmak",
      "point": [
        34.855,
        38.748
      ]
    },
    "upperReservoir": {
      "description": "161 m yükseklikte beton kaplamalı üst havuz",
      "point": [
        34.823,
        38.792
      ]
    },
    "powerhouse": {
      "point": [
        34.85,
        38.752
      ],
      "preferred3dType": "semi-underground-or-surface"
    },
    "surgeTank": {
      "point": [
        34.8365,
        38.772
      ]
    },
    "penstockRoute": [
      [
        34.823,
        38.792
      ],
      [
        34.8365,
        38.772
      ],
      [
        34.84325,
        38.762
      ],
      [
        34.85,
        38.752
      ]
    ],
    "tailraceOutlet": {
      "point": [
        34.8525,
        38.75
      ]
    },
    "switchyard": {
      "point": [
        34.856,
        38.754
      ]
    },
    "gridConnection": {
      "point": [
        34.875,
        38.76
      ],
      "voltageClassHint": "154/380 kV yakın bağlantı ön kabulü; gerçek trafo merkezi/hat verisiyle doğrulanacak"
    },
    "intakeOutfall": null,
    "bbox": [
      34.793,
      38.718,
      34.905,
      38.822
    ],
    "modelHints": {
      "headM": 161,
      "flowCms": 720,
      "capacityMW": 1000,
      "shaftM": 305,
      "penstockM": null,
      "tailraceM": 160,
      "upperReservoirMaterialHint": "Beton kaplamalı havuz",
      "waterAnimation": {
        "generation": "upperReservoir -> penstockRoute -> powerhouse -> tailraceOutlet -> lowerReservoir",
        "pumping": "lowerReservoir -> powerhouse -> penstockRoute -> upperReservoir"
      }
    }
  },
  {
    "id": "jica-hasan-ugurlu-pspp",
    "name": "Hasan Uğurlu PDHES",
    "coordinateSystem": "WGS84",
    "coordinateOrder": "[lon, lat]",
    "coordinateConfidence": "fallback-approximate",
    "coordinateNote": "Kaynak raporda enlem/boylam verilmediği için baraj/göl/regülatör adı ve açık harita/topografya ön kabulüyle öneri koordinat verilmiştir; DEM, uydu görüntüsü, mülkiyet, korunan alan ve saha etüdüyle doğrulanmadan kesin konum gibi kullanılmamalıdır.",
    "mapAnchor": [
      36.6282,
      40.95305
    ],
    "lowerReservoir": {
      "name": "Hasan Uğurlu Barajı",
      "point": [
        36.6464,
        40.9361
      ]
    },
    "upperReservoir": {
      "description": "570 m yükseklikte beton kaplamalı üst havuz",
      "point": [
        36.61,
        40.97
      ]
    },
    "powerhouse": {
      "point": [
        36.64,
        40.939
      ],
      "preferred3dType": "underground-cavern"
    },
    "surgeTank": {
      "point": [
        36.625,
        40.9545
      ]
    },
    "penstockRoute": [
      [
        36.61,
        40.97
      ],
      [
        36.625,
        40.9545
      ],
      [
        36.6325,
        40.94675
      ],
      [
        36.64,
        40.939
      ]
    ],
    "tailraceOutlet": {
      "point": [
        36.6432,
        40.93755
      ]
    },
    "switchyard": {
      "point": [
        36.6455,
        40.941
      ]
    },
    "gridConnection": {
      "point": [
        36.675,
        40.95
      ],
      "voltageClassHint": "154/380 kV yakın bağlantı ön kabulü; gerçek trafo merkezi/hat verisiyle doğrulanacak"
    },
    "intakeOutfall": null,
    "bbox": [
      36.58,
      40.9061,
      36.705,
      41.0
    ],
    "modelHints": {
      "headM": 570,
      "flowCms": 204,
      "capacityMW": 1000,
      "shaftM": 635,
      "penstockM": null,
      "tailraceM": 965,
      "upperReservoirMaterialHint": "Beton kaplamalı havuz",
      "waterAnimation": {
        "generation": "upperReservoir -> penstockRoute -> powerhouse -> tailraceOutlet -> lowerReservoir",
        "pumping": "lowerReservoir -> powerhouse -> penstockRoute -> upperReservoir"
      }
    }
  },
  {
    "id": "jica-adiguzel-pspp",
    "name": "Adıgüzel PDHES",
    "coordinateSystem": "WGS84",
    "coordinateOrder": "[lon, lat]",
    "coordinateConfidence": "fallback-approximate",
    "coordinateNote": "Kaynak raporda enlem/boylam verilmediği için baraj/göl/regülatör adı ve açık harita/topografya ön kabulüyle öneri koordinat verilmiştir; DEM, uydu görüntüsü, mülkiyet, korunan alan ve saha etüdüyle doğrulanmadan kesin konum gibi kullanılmamalıdır.",
    "mapAnchor": [
      29.1902,
      38.172
    ],
    "lowerReservoir": {
      "name": "Adıgüzel Barajı",
      "point": [
        29.2104,
        38.159
      ]
    },
    "upperReservoir": {
      "description": "242 m yükseklikte beton kaplamalı üst havuz",
      "point": [
        29.17,
        38.185
      ]
    },
    "powerhouse": {
      "point": [
        29.205,
        38.163
      ],
      "preferred3dType": "semi-underground-or-surface"
    },
    "surgeTank": {
      "point": [
        29.1875,
        38.174
      ]
    },
    "penstockRoute": [
      [
        29.17,
        38.185
      ],
      [
        29.1875,
        38.174
      ],
      [
        29.19625,
        38.1685
      ],
      [
        29.205,
        38.163
      ]
    ],
    "tailraceOutlet": {
      "point": [
        29.2077,
        38.161
      ]
    },
    "switchyard": {
      "point": [
        29.211,
        38.166
      ]
    },
    "gridConnection": {
      "point": [
        29.235,
        38.176
      ],
      "voltageClassHint": "154/380 kV yakın bağlantı ön kabulü; gerçek trafo merkezi/hat verisiyle doğrulanacak"
    },
    "intakeOutfall": null,
    "bbox": [
      29.14,
      38.129,
      29.265,
      38.215
    ],
    "modelHints": {
      "headM": 242,
      "flowCms": 484,
      "capacityMW": 1000,
      "shaftM": 303,
      "penstockM": 216,
      "tailraceM": 447,
      "upperReservoirMaterialHint": "Beton kaplamalı havuz",
      "waterAnimation": {
        "generation": "upperReservoir -> penstockRoute -> powerhouse -> tailraceOutlet -> lowerReservoir",
        "pumping": "lowerReservoir -> powerhouse -> penstockRoute -> upperReservoir"
      }
    }
  },
  {
    "id": "jica-burdur-pspp",
    "name": "Burdur PDHES",
    "coordinateSystem": "WGS84",
    "coordinateOrder": "[lon, lat]",
    "coordinateConfidence": "fallback-approximate",
    "coordinateNote": "Kaynak raporda enlem/boylam verilmediği için baraj/göl/regülatör adı ve açık harita/topografya ön kabulüyle öneri koordinat verilmiştir; DEM, uydu görüntüsü, mülkiyet, korunan alan ve saha etüdüyle doğrulanmadan kesin konum gibi kullanılmamalıdır.",
    "mapAnchor": [
      30.2125,
      37.7475
    ],
    "lowerReservoir": {
      "name": "Burdur Gölü çevresi / kavramsal alt rezervuar",
      "point": [
        30.25,
        37.735
      ]
    },
    "upperReservoir": {
      "description": "Burdur Gölü yakın yüksek topoğrafyada kavramsal üst rezervuar",
      "point": [
        30.175,
        37.76
      ]
    },
    "powerhouse": {
      "point": [
        30.24,
        37.735
      ],
      "preferred3dType": "underground-cavern"
    },
    "surgeTank": {
      "point": [
        30.2075,
        37.7475
      ]
    },
    "penstockRoute": [
      [
        30.175,
        37.76
      ],
      [
        30.2075,
        37.7475
      ],
      [
        30.22375,
        37.74125
      ],
      [
        30.24,
        37.735
      ]
    ],
    "tailraceOutlet": {
      "point": [
        30.245,
        37.735
      ]
    },
    "switchyard": {
      "point": [
        30.246,
        37.738
      ]
    },
    "gridConnection": {
      "point": [
        30.285,
        37.745
      ],
      "voltageClassHint": "154/380 kV yakın bağlantı ön kabulü; gerçek trafo merkezi/hat verisiyle doğrulanacak"
    },
    "intakeOutfall": null,
    "bbox": [
      30.145,
      37.705,
      30.315,
      37.79
    ],
    "modelHints": {
      "headM": 370,
      "flowCms": 316,
      "capacityMW": 1000,
      "shaftM": null,
      "penstockM": null,
      "tailraceM": null,
      "upperReservoirMaterialHint": "Kavramsal havuz",
      "waterAnimation": {
        "generation": "upperReservoir -> penstockRoute -> powerhouse -> tailraceOutlet -> lowerReservoir",
        "pumping": "lowerReservoir -> powerhouse -> penstockRoute -> upperReservoir"
      }
    }
  },
  {
    "id": "jica-egirdir-pspp",
    "name": "Eğirdir PDHES",
    "coordinateSystem": "WGS84",
    "coordinateOrder": "[lon, lat]",
    "coordinateConfidence": "fallback-approximate",
    "coordinateNote": "Kaynak raporda enlem/boylam verilmediği için baraj/göl/regülatör adı ve açık harita/topografya ön kabulüyle öneri koordinat verilmiştir; DEM, uydu görüntüsü, mülkiyet, korunan alan ve saha etüdüyle doğrulanmadan kesin konum gibi kullanılmamalıdır.",
    "mapAnchor": [
      30.8275,
      37.9
    ],
    "lowerReservoir": {
      "name": "Eğirdir Gölü çevresi / kavramsal alt rezervuar",
      "point": [
        30.855,
        37.875
      ]
    },
    "upperReservoir": {
      "description": "Eğirdir Gölü çevresi yüksek topoğrafyada kavramsal üst rezervuar",
      "point": [
        30.8,
        37.925
      ]
    },
    "powerhouse": {
      "point": [
        30.85,
        37.883
      ],
      "preferred3dType": "underground-cavern"
    },
    "surgeTank": {
      "point": [
        30.825,
        37.904
      ]
    },
    "penstockRoute": [
      [
        30.8,
        37.925
      ],
      [
        30.825,
        37.904
      ],
      [
        30.8375,
        37.8935
      ],
      [
        30.85,
        37.883
      ]
    ],
    "tailraceOutlet": {
      "point": [
        30.8525,
        37.879
      ]
    },
    "switchyard": {
      "point": [
        30.856,
        37.887
      ]
    },
    "gridConnection": {
      "point": [
        30.885,
        37.9
      ],
      "voltageClassHint": "154/380 kV yakın bağlantı ön kabulü; gerçek trafo merkezi/hat verisiyle doğrulanacak"
    },
    "intakeOutfall": null,
    "bbox": [
      30.77,
      37.845,
      30.915,
      37.955
    ],
    "modelHints": {
      "headM": 672,
      "flowCms": 175,
      "capacityMW": 1000,
      "shaftM": null,
      "penstockM": null,
      "tailraceM": null,
      "upperReservoirMaterialHint": "Kavramsal havuz",
      "waterAnimation": {
        "generation": "upperReservoir -> penstockRoute -> powerhouse -> tailraceOutlet -> lowerReservoir",
        "pumping": "lowerReservoir -> powerhouse -> penstockRoute -> upperReservoir"
      }
    }
  },
  {
    "id": "jica-kargi-pspp",
    "name": "Kargı PDHES",
    "coordinateSystem": "WGS84",
    "coordinateOrder": "[lon, lat]",
    "coordinateConfidence": "fallback-approximate",
    "coordinateNote": "Kaynak raporda enlem/boylam verilmediği için baraj/göl/regülatör adı ve açık harita/topografya ön kabulüyle öneri koordinat verilmiştir; DEM, uydu görüntüsü, mülkiyet, korunan alan ve saha etüdüyle doğrulanmadan kesin konum gibi kullanılmamalıdır.",
    "mapAnchor": [
      31.785,
      40.0935
    ],
    "lowerReservoir": {
      "name": "Kargı Barajı / Sakarya Nehri",
      "point": [
        31.805,
        40.077
      ]
    },
    "upperReservoir": {
      "description": "513 m yükseklikte sıkıştırılmış kil havuz",
      "point": [
        31.765,
        40.11
      ]
    },
    "powerhouse": {
      "point": [
        31.798,
        40.08
      ],
      "preferred3dType": "underground-cavern"
    },
    "surgeTank": {
      "point": [
        31.7815,
        40.095
      ]
    },
    "penstockRoute": [
      [
        31.765,
        40.11
      ],
      [
        31.7815,
        40.095
      ],
      [
        31.78975,
        40.0875
      ],
      [
        31.798,
        40.08
      ]
    ],
    "tailraceOutlet": {
      "point": [
        31.8015,
        40.0785
      ]
    },
    "switchyard": {
      "point": [
        31.804,
        40.082
      ]
    },
    "gridConnection": {
      "point": [
        31.83,
        40.09
      ],
      "voltageClassHint": "154/380 kV yakın bağlantı ön kabulü; gerçek trafo merkezi/hat verisiyle doğrulanacak"
    },
    "intakeOutfall": null,
    "bbox": [
      31.735,
      40.047,
      31.86,
      40.14
    ],
    "modelHints": {
      "headM": 496,
      "flowCms": 238,
      "capacityMW": 1000,
      "shaftM": 367,
      "penstockM": 1815,
      "tailraceM": 580,
      "upperReservoirMaterialHint": "Sıkıştırılmış kil havuz",
      "waterAnimation": {
        "generation": "upperReservoir -> penstockRoute -> powerhouse -> tailraceOutlet -> lowerReservoir",
        "pumping": "lowerReservoir -> powerhouse -> penstockRoute -> upperReservoir"
      }
    }
  },
  {
    "id": "jica-karacaoren-ii-pspp",
    "name": "Karacaören II PDHES",
    "coordinateSystem": "WGS84",
    "coordinateOrder": "[lon, lat]",
    "coordinateConfidence": "fallback-approximate",
    "coordinateNote": "Kaynak raporda enlem/boylam verilmediği için baraj/göl/regülatör adı ve açık harita/topografya ön kabulüyle öneri koordinat verilmiştir; DEM, uydu görüntüsü, mülkiyet, korunan alan ve saha etüdüyle doğrulanmadan kesin konum gibi kullanılmamalıdır.",
    "mapAnchor": [
      30.78185,
      37.3283
    ],
    "lowerReservoir": {
      "name": "Karacaören II Barajı",
      "point": [
        30.8087,
        37.3066
      ]
    },
    "upperReservoir": {
      "description": "Kavramsal üst rezervuar; raporda ayrıntı yoksa beton kaplamalı/geomembranlı havuz varsayımı",
      "point": [
        30.755,
        37.35
      ]
    },
    "powerhouse": {
      "point": [
        30.802,
        37.31
      ],
      "preferred3dType": "underground-cavern"
    },
    "surgeTank": {
      "point": [
        30.7785,
        37.33
      ]
    },
    "penstockRoute": [
      [
        30.755,
        37.35
      ],
      [
        30.7785,
        37.33
      ],
      [
        30.79025,
        37.32
      ],
      [
        30.802,
        37.31
      ]
    ],
    "tailraceOutlet": {
      "point": [
        30.80535,
        37.3083
      ]
    },
    "switchyard": {
      "point": [
        30.808,
        37.312
      ]
    },
    "gridConnection": {
      "point": [
        30.835,
        37.325
      ],
      "voltageClassHint": "154/380 kV yakın bağlantı ön kabulü; gerçek trafo merkezi/hat verisiyle doğrulanacak"
    },
    "intakeOutfall": null,
    "bbox": [
      30.725,
      37.2766,
      30.865,
      37.38
    ],
    "modelHints": {
      "headM": 615,
      "flowCms": 190,
      "capacityMW": 1000,
      "shaftM": null,
      "penstockM": null,
      "tailraceM": null,
      "upperReservoirMaterialHint": "Beton kaplamalı havuz",
      "waterAnimation": {
        "generation": "upperReservoir -> penstockRoute -> powerhouse -> tailraceOutlet -> lowerReservoir",
        "pumping": "lowerReservoir -> powerhouse -> penstockRoute -> upperReservoir"
      }
    }
  },
  {
    "id": "jica-yalova-pspp",
    "name": "Yalova PDHES",
    "coordinateSystem": "WGS84",
    "coordinateOrder": "[lon, lat]",
    "coordinateConfidence": "fallback-approximate",
    "coordinateNote": "Kaynak raporda enlem/boylam verilmediği için baraj/göl/regülatör adı ve açık harita/topografya ön kabulüyle öneri koordinat verilmiştir; DEM, uydu görüntüsü, mülkiyet, korunan alan ve saha etüdüyle doğrulanmadan kesin konum gibi kullanılmamalıdır.",
    "mapAnchor": [
      29.1925,
      40.6125
    ],
    "lowerReservoir": {
      "name": "Yalova Regülatörü",
      "point": [
        29.215,
        40.605
      ]
    },
    "upperReservoir": {
      "description": "400 m yükseklikte beton kaplamalı üst havuz",
      "point": [
        29.17,
        40.62
      ]
    },
    "powerhouse": {
      "point": [
        29.21,
        40.608
      ],
      "preferred3dType": "underground-cavern"
    },
    "surgeTank": {
      "point": [
        29.19,
        40.614
      ]
    },
    "penstockRoute": [
      [
        29.17,
        40.62
      ],
      [
        29.19,
        40.614
      ],
      [
        29.2,
        40.611
      ],
      [
        29.21,
        40.608
      ]
    ],
    "tailraceOutlet": {
      "point": [
        29.2125,
        40.6065
      ]
    },
    "switchyard": {
      "point": [
        29.216,
        40.61
      ]
    },
    "gridConnection": {
      "point": [
        29.245,
        40.62
      ],
      "voltageClassHint": "154/380 kV yakın bağlantı ön kabulü; gerçek trafo merkezi/hat verisiyle doğrulanacak"
    },
    "intakeOutfall": null,
    "bbox": [
      29.14,
      40.575,
      29.275,
      40.65
    ],
    "modelHints": {
      "headM": 400,
      "flowCms": 147,
      "capacityMW": 500,
      "shaftM": 800,
      "penstockM": null,
      "tailraceM": 300,
      "upperReservoirMaterialHint": "Beton kaplamalı havuz",
      "waterAnimation": {
        "generation": "upperReservoir -> penstockRoute -> powerhouse -> tailraceOutlet -> lowerReservoir",
        "pumping": "lowerReservoir -> powerhouse -> penstockRoute -> upperReservoir"
      }
    }
  },
  {
    "id": "jica-yamula-pspp",
    "name": "Yamula PDHES",
    "coordinateSystem": "WGS84",
    "coordinateOrder": "[lon, lat]",
    "coordinateConfidence": "fallback-approximate",
    "coordinateNote": "Kaynak raporda enlem/boylam verilmediği için baraj/göl/regülatör adı ve açık harita/topografya ön kabulüyle öneri koordinat verilmiştir; DEM, uydu görüntüsü, mülkiyet, korunan alan ve saha etüdüyle doğrulanmadan kesin konum gibi kullanılmamalıdır.",
    "mapAnchor": [
      35.2454,
      38.9136
    ],
    "lowerReservoir": {
      "name": "Yamula Barajı",
      "point": [
        35.2708,
        38.9022
      ]
    },
    "upperReservoir": {
      "description": "260 m yükseklikte beton kaplamalı üst havuz",
      "point": [
        35.22,
        38.925
      ]
    },
    "powerhouse": {
      "point": [
        35.265,
        38.905
      ],
      "preferred3dType": "semi-underground-or-surface"
    },
    "surgeTank": {
      "point": [
        35.2425,
        38.915
      ]
    },
    "penstockRoute": [
      [
        35.22,
        38.925
      ],
      [
        35.2425,
        38.915
      ],
      [
        35.25375,
        38.91
      ],
      [
        35.265,
        38.905
      ]
    ],
    "tailraceOutlet": {
      "point": [
        35.2679,
        38.9036
      ]
    },
    "switchyard": {
      "point": [
        35.271,
        38.907
      ]
    },
    "gridConnection": {
      "point": [
        35.295,
        38.915
      ],
      "voltageClassHint": "154/380 kV yakın bağlantı ön kabulü; gerçek trafo merkezi/hat verisiyle doğrulanacak"
    },
    "intakeOutfall": null,
    "bbox": [
      35.19,
      38.8722,
      35.325,
      38.955
    ],
    "modelHints": {
      "headM": 260,
      "flowCms": 228,
      "capacityMW": 500,
      "shaftM": 80,
      "penstockM": 1540,
      "tailraceM": 300,
      "upperReservoirMaterialHint": "Beton kaplamalı havuz",
      "waterAnimation": {
        "generation": "upperReservoir -> penstockRoute -> powerhouse -> tailraceOutlet -> lowerReservoir",
        "pumping": "lowerReservoir -> powerhouse -> penstockRoute -> upperReservoir"
      }
    }
  },
  {
    "id": "jica-oymapinar-pspp",
    "name": "Oymapınar PDHES",
    "coordinateSystem": "WGS84",
    "coordinateOrder": "[lon, lat]",
    "coordinateConfidence": "fallback-approximate",
    "coordinateNote": "Kaynak raporda enlem/boylam verilmediği için baraj/göl/regülatör adı ve açık harita/topografya ön kabulüyle öneri koordinat verilmiştir; DEM, uydu görüntüsü, mülkiyet, korunan alan ve saha etüdüyle doğrulanmadan kesin konum gibi kullanılmamalıdır.",
    "mapAnchor": [
      31.50835,
      36.9293
    ],
    "lowerReservoir": {
      "name": "Oymapınar Barajı",
      "point": [
        31.5317,
        36.9086
      ]
    },
    "upperReservoir": {
      "description": "372 m yükseklikte beton kaplamalı üst havuz",
      "point": [
        31.485,
        36.95
      ]
    },
    "powerhouse": {
      "point": [
        31.525,
        36.912
      ],
      "preferred3dType": "underground-cavern"
    },
    "surgeTank": {
      "point": [
        31.505,
        36.931
      ]
    },
    "penstockRoute": [
      [
        31.485,
        36.95
      ],
      [
        31.505,
        36.931
      ],
      [
        31.515,
        36.9215
      ],
      [
        31.525,
        36.912
      ]
    ],
    "tailraceOutlet": {
      "point": [
        31.52835,
        36.9103
      ]
    },
    "switchyard": {
      "point": [
        31.531,
        36.914
      ]
    },
    "gridConnection": {
      "point": [
        31.555,
        36.925
      ],
      "voltageClassHint": "154/380 kV yakın bağlantı ön kabulü; gerçek trafo merkezi/hat verisiyle doğrulanacak"
    },
    "intakeOutfall": null,
    "bbox": [
      31.455,
      36.8786,
      31.585,
      36.98
    ],
    "modelHints": {
      "headM": 372,
      "flowCms": 156,
      "capacityMW": 500,
      "shaftM": 419,
      "penstockM": null,
      "tailraceM": 500,
      "upperReservoirMaterialHint": "Beton kaplamalı havuz",
      "waterAnimation": {
        "generation": "upperReservoir -> penstockRoute -> powerhouse -> tailraceOutlet -> lowerReservoir",
        "pumping": "lowerReservoir -> powerhouse -> penstockRoute -> upperReservoir"
      }
    }
  },
  {
    "id": "jica-aslantas-pspp",
    "name": "Aslantaş PDHES",
    "coordinateSystem": "WGS84",
    "coordinateOrder": "[lon, lat]",
    "coordinateConfidence": "fallback-approximate",
    "coordinateNote": "Kaynak raporda enlem/boylam verilmediği için baraj/göl/regülatör adı ve açık harita/topografya ön kabulüyle öneri koordinat verilmiştir; DEM, uydu görüntüsü, mülkiyet, korunan alan ve saha etüdüyle doğrulanmadan kesin konum gibi kullanılmamalıdır.",
    "mapAnchor": [
      36.2454,
      37.2874
    ],
    "lowerReservoir": {
      "name": "Aslantaş Barajı",
      "point": [
        36.2708,
        37.2728
      ]
    },
    "upperReservoir": {
      "description": "154 m yükseklikte beton kaplamalı üst havuz",
      "point": [
        36.22,
        37.302
      ]
    },
    "powerhouse": {
      "point": [
        36.265,
        37.276
      ],
      "preferred3dType": "semi-underground-or-surface"
    },
    "surgeTank": {
      "point": [
        36.2425,
        37.289
      ]
    },
    "penstockRoute": [
      [
        36.22,
        37.302
      ],
      [
        36.2425,
        37.289
      ],
      [
        36.25375,
        37.2825
      ],
      [
        36.265,
        37.276
      ]
    ],
    "tailraceOutlet": {
      "point": [
        36.2679,
        37.2744
      ]
    },
    "switchyard": {
      "point": [
        36.271,
        37.278
      ]
    },
    "gridConnection": {
      "point": [
        36.295,
        37.287
      ],
      "voltageClassHint": "154/380 kV yakın bağlantı ön kabulü; gerçek trafo merkezi/hat verisiyle doğrulanacak"
    },
    "intakeOutfall": null,
    "bbox": [
      36.19,
      37.2428,
      36.325,
      37.332
    ],
    "modelHints": {
      "headM": 154,
      "flowCms": 379,
      "capacityMW": 500,
      "shaftM": null,
      "penstockM": 875,
      "tailraceM": 225,
      "upperReservoirMaterialHint": "Beton kaplamalı havuz",
      "waterAnimation": {
        "generation": "upperReservoir -> penstockRoute -> powerhouse -> tailraceOutlet -> lowerReservoir",
        "pumping": "lowerReservoir -> powerhouse -> penstockRoute -> upperReservoir"
      }
    }
  },
  {
    "id": "jica-iznik-ii-pspp",
    "name": "İznik II PDHES",
    "coordinateSystem": "WGS84",
    "coordinateOrder": "[lon, lat]",
    "coordinateConfidence": "fallback-approximate",
    "coordinateNote": "Kaynak raporda enlem/boylam verilmediği için baraj/göl/regülatör adı ve açık harita/topografya ön kabulüyle öneri koordinat verilmiştir; DEM, uydu görüntüsü, mülkiyet, korunan alan ve saha etüdüyle doğrulanmadan kesin konum gibi kullanılmamalıdır.",
    "mapAnchor": [
      29.69,
      40.39
    ],
    "lowerReservoir": {
      "name": "İznik Gölü çevresi / kavramsal alt rezervuar",
      "point": [
        29.67,
        40.42
      ]
    },
    "upperReservoir": {
      "description": "İznik güney yamaçlarında kavramsal üst rezervuar",
      "point": [
        29.71,
        40.36
      ]
    },
    "powerhouse": {
      "point": [
        29.665,
        40.415
      ],
      "preferred3dType": "semi-underground-or-surface"
    },
    "surgeTank": {
      "point": [
        29.6875,
        40.3875
      ]
    },
    "penstockRoute": [
      [
        29.71,
        40.36
      ],
      [
        29.6875,
        40.3875
      ],
      [
        29.67625,
        40.40125
      ],
      [
        29.665,
        40.415
      ]
    ],
    "tailraceOutlet": {
      "point": [
        29.6675,
        40.4175
      ]
    },
    "switchyard": {
      "point": [
        29.671,
        40.417
      ]
    },
    "gridConnection": {
      "point": [
        29.7,
        40.405
      ],
      "voltageClassHint": "154/380 kV yakın bağlantı ön kabulü; gerçek trafo merkezi/hat verisiyle doğrulanacak"
    },
    "intakeOutfall": null,
    "bbox": [
      29.635,
      40.33,
      29.74,
      40.45
    ],
    "modelHints": {
      "headM": 263,
      "flowCms": 221,
      "capacityMW": 500,
      "shaftM": null,
      "penstockM": null,
      "tailraceM": null,
      "upperReservoirMaterialHint": "Kavramsal havuz",
      "waterAnimation": {
        "generation": "upperReservoir -> penstockRoute -> powerhouse -> tailraceOutlet -> lowerReservoir",
        "pumping": "lowerReservoir -> powerhouse -> penstockRoute -> upperReservoir"
      }
    }
  },
  {
    "id": "jica-demirkopru-pspp",
    "name": "Demirköprü PDHES",
    "coordinateSystem": "WGS84",
    "coordinateOrder": "[lon, lat]",
    "coordinateConfidence": "fallback-approximate",
    "coordinateNote": "Kaynak raporda enlem/boylam verilmediği için baraj/göl/regülatör adı ve açık harita/topografya ön kabulüyle öneri koordinat verilmiştir; DEM, uydu görüntüsü, mülkiyet, korunan alan ve saha etüdüyle doğrulanmadan kesin konum gibi kullanılmamalıdır.",
    "mapAnchor": [
      28.29075,
      38.6284
    ],
    "lowerReservoir": {
      "name": "Demirköprü Barajı",
      "point": [
        28.3115,
        38.6168
      ]
    },
    "upperReservoir": {
      "description": "215 m yükseklikte beton kaplamalı üst havuz",
      "point": [
        28.27,
        38.64
      ]
    },
    "powerhouse": {
      "point": [
        28.305,
        38.62
      ],
      "preferred3dType": "semi-underground-or-surface"
    },
    "surgeTank": {
      "point": [
        28.2875,
        38.63
      ]
    },
    "penstockRoute": [
      [
        28.27,
        38.64
      ],
      [
        28.2875,
        38.63
      ],
      [
        28.29625,
        38.625
      ],
      [
        28.305,
        38.62
      ]
    ],
    "tailraceOutlet": {
      "point": [
        28.30825,
        38.6184
      ]
    },
    "switchyard": {
      "point": [
        28.311,
        38.622
      ]
    },
    "gridConnection": {
      "point": [
        28.335,
        38.632
      ],
      "voltageClassHint": "154/380 kV yakın bağlantı ön kabulü; gerçek trafo merkezi/hat verisiyle doğrulanacak"
    },
    "intakeOutfall": null,
    "bbox": [
      28.24,
      38.5868,
      28.365,
      38.67
    ],
    "modelHints": {
      "headM": 213,
      "flowCms": 166,
      "capacityMW": 300,
      "shaftM": 157,
      "penstockM": 473,
      "tailraceM": 832,
      "upperReservoirMaterialHint": "Beton kaplamalı havuz",
      "waterAnimation": {
        "generation": "upperReservoir -> penstockRoute -> powerhouse -> tailraceOutlet -> lowerReservoir",
        "pumping": "lowerReservoir -> powerhouse -> penstockRoute -> upperReservoir"
      }
    }
  }
]
```

---

## 9. 3D Çizim / Gerçek Saha Modeli Talimatı

Her aday için 3D model aşağıdaki yapıları içermelidir:

1. Alt rezervuar
2. Üst rezervuar
3. Güç evi
4. Şaft / cebri boru / su yolu
5. Denge bacası
6. Kuyruk suyu çıkışı
7. Şalt sahası
8. Şebeke bağlantı yönü
9. Kot/düşü görsel etiketi
10. Belirsizlik / kavramsal model uyarı etiketi

### 9.1. 3D Arazi

- Gerçek DEM servisinden yüklenebiliyorsa kullan.
- DEM yoksa procedural terrain üret.
- Haritadaki `bbox` alanından arazi kırpması yap.
- Arazide alt rezervuar, üst rezervuar ve su yolu güzergâhını ölçekli olmasa da coğrafi yön ve göreli mesafeye uygun göster.
- Düşü çok yüksek olanlarda `verticalScale` otomatik normalize edilsin.
- UI’da gerçek düşü metre olarak gösterilsin; 3D ölçeğin görselleştirme ölçeği olduğu belirt.

### 9.2. Üst Rezervuar Görünümü

- Beton kaplamalı havuz bilgisi olanlar: dikdörtgen/oval beton kaplamalı havuz, çevre set, servis yolu.
- Kargı: sıkıştırılmış kil havuz, toprak/kil set rengi, geomembran opsiyon etiketi.
- Bilgi olmayanlar: kavramsal üst rezervuar; “kaynakta detay verilmedi” etiketi.
- Deniz tipi adaylar: kıyıya yakın üst havuz, deniz alt rezervuarı, kıyı intake/outfall, korozyon uyarısı.

### 9.3. Güç Evi 

- `headM >= 350` olanlarda varsayılan `underground-cavern`.
- `headM < 350` olanlarda `semi-underground-or-surface`.
- Kaynakta açıkça yeraltı güç evi bilgisi varsa onu kullan.
- Güç evi yanında şalt sahası ve trafo sembolü göster.
-Powerhouse - Güç evi ifadeleri "Türbin Odası" olarak kullanıcaktır. 

### 9.4. Su Yolu

- Şaft bilgisi varsa dikey/şevli şaft olarak çiz.
- Cebri boru uzunluğu varsa bilgi paneline yaz; çizim güzergâhında ölçeklenmiş boru göster.
- Kuyruk suyu tüneli varsa güç evi ile alt rezervuar arasında ayrı segment olarak çiz.
- Bilinmeyen uzunluklarda `conceptual-waterway` etiketi göster.

### 9.5. Animasyon

- Üretim modu: üst rezervuar → cebri boru/şaft → güç evi → kuyruk suyu → alt rezervuar.
- Pompa modu: alt rezervuar → güç evi → cebri boru/şaft → üst rezervuar.
- Deniz tipi: deniz → üst rezervuar pompa; üst rezervuar → deniz üretim.
- Animasyon yönleri hem 3D sahnede hem harita overlay çizgilerinde tutarlı olsun.

---

## 10. Harita Katmanı

Harita şu katmanları desteklemelidir:

1. JICA/EİE adayları
2. Deniz tipi prototipler
3. Dünya örnekleri
4. Tesis yerleşim bileşenleri
5. Su yolu güzergâhı
6. Şebeke bağlantı yönü
7. Koordinat güven uyarısı

### 10.1. Marker Renkleri

- JICA mevcut rezervuar entegre: mavi
- JICA tamamen yeni/saf: yeşil
- Deniz tipi prototip: turkuaz
- Dünya örneği: mor/gri
- Koordinat güveni düşük olanlar: marker üstünde küçük uyarı rozeti

### 10.2. Popup İçeriği

Her popup:
- Proje adı
- İl
- Kaynak grubu
- Kurulu güç
- Düşü
- Debi
- Teknik sınıflandırma
- Alt rezervuar
- Üst rezervuar
- Koordinat güven notu
- “Kavramsal tesis yerleşimini göster” butonu
içermelidir.

---

## 11. Datalar Sekmesi

Datalar sekmesinde yeni tablo şu kolonları içermelidir:

- Sıra
- Saha adı
- İl
- Kaynak grubu
- Kurulu güç MW
- Proje debisi m³/s
- Düşü m
- Alt rezervuar
- Üst rezervuar tipi
- Döngü tipi
- Altyapı tipi
- Konsept tipi
- Şebeke/enerji besleme tipi
- Ana amaç
- Skor
- Koordinat güveni
- Not

Filtreler:
- JICA/EİE adayları
- Deniz tipi prototipler
- Mevcut rezervuar entegre
- Tamamen yeni / saf
- Deniz suyu
- İl
- Kurulu güç aralığı
- Düşü aralığı
- Debi aralığı
- Koordinat güveni

Sıralama:
- Varsayılan: önce JICA 16, sonra deniz tipi 4.
- Alternatif: skor, MW, düşü, debi, il, ada göre.

---

## 12. PDHES Nedir Sayfası

PDHES Nedir sayfasını teknik olarak yeniden yaz. Düzenli olasun tüm başlıklar kart yapısında olsun.  

Kapsanacak başlıklar:

1. PDHES çalışma prensibi
2. PDHES tarihçesi
3. Üretim ve pompalama modu
4. Faydaları Risleri Maliyet ve Gelir
5.Dünya Örnekleri ( içerik aynı kalacak sadece İtalya projesi eklencektir. )
6. Açık döngü / kapalı döngü farkı
7. Mevcut baraj gölü entegrasyonu
8. Saf / tamamen yeni PDHES
9. Karışık / ardışık rezervuar entegrasyonu
10. Deniz suyu PDHES
11. Değişken hızlı PDHES
12. Şebeke destekli ve hibrit PDHES
13. Pik güç ve enerji depolama amacı
14. Yenilenebilir enerji entegrasyonu
15. Türkiye bağlamında JICA/EİE 16 aday çalışması
16. Harita ve 3D koordinatların kavramsal olduğu uyarısı
17.Teknik Sözlük  
18. Sık Sorulan Sorular (içerik aynı kalacaktır)

Eski tip adlarını kullanıcıya teknik sınıf gibi sunma.

---

## 13. Hesaplamalar Sekmesi

Enerji hesabını koru:

```text
E_GWh = ρ · g · H · V · η / 3.6e12
```

Kurallar:
- `H = headM`
- `V = activeVolumeM3` veya senaryo hacmi
- `η = toplam çevrim / türbin-pompa verim ön kabulü`
- JICA adaylarında aktif hacim kaynakta yoksa UI’da “aktif hacim kaynakta yok; senaryo hacmi kullanıcı varsayımıdır” yaz.
- Debi ve düşüye göre teorik güç hesabı yapılabilir:
  - `P_MW ≈ ρ · g · Q · H · η / 1e6`
- Bu hesap kaynak kurulu güçle uyuşmazsa kaynak değerini değiştirme.
- Sadece “kontrol / tutarlılık notu” üret.
- NaN, undefined, null değerleri UI’da görünmemeli; “Belirtilmedi” veya “Senaryo varsayımı” yaz.

---

## 14. Deniz Tipi Prototip Risk Notları

Seçilen 4 deniz tipi adayda şu risk kartları olmalıdır:

- Deniz suyu korozyonu
- Tuzlu su sızdırmazlığı
- Biofouling / biyolojik birikim
- Deniz intake/outfall çevresel etkisi
- Kıyı izinleri
- Turizm/görsel etki
- Denizel korunan alan riski
- Kıyı erozyonu ve dalga etkisi
- Şalt ve trafo sahası tuzlu atmosfer etkisi
- İçme suyu/yeraltı suyu karışımı riski
- Acil boşaltma ve taşkın güvenliği

---

## 15. Dünya Örnekleri Listesi

Dünya örnekleri bölümünde en az şu mantık uygulanmalı:

- İtalya (Presenzano) projesi Türkiye "PDHES Adayları" listesinden ve genel aday rotasyonundan tamamen çıkarılır.
- İtalya projesi **"PDHES Nedir"**  ve **"Harita Gösterimi"** sekmesinde sayfasındaki mevcut Dünya Örnekleri bölümüne statik/dinamik içerik olarak eklenir.  **"Harita Gösterimi"** şimşek ikonu açılır pencerede sekmede gösterim.

---

## 16. Kod Tarafı Temizlik

Aşağıdaki kontrolleri yap:

1. TypeScript interface/type dosyalarını güncelle.
2. `data.json` yeni şemaya göre temizle.
3. Eski tip enum’larını kaldır.
4. Component’lerde eski tip alanlarına bağımlılık bırakma.
5. Harita marker kategorilerini yeni sınıflara göre kur.
6. 3D model component’lerini yeni `model3d` ve `coordinates` alanlarına bağla. Mevcut 3D kodundaki eski `isSeaWater` kontrolünü yeni modeldeki `candidate.technicalClassification.cycleType === 'SEA_LOWER_RESERVOIR'` kuralıyla değiştir. Presenzano dağı yükleme mantığını (`isPresenzano`) ise sadece Dünya Örnekleri içindeki İtalya projesinin ID'sine bağla.
7. Store selector’larını güncelle.
8. Datalar, Detay, Harita, 3D, Hesaplamalar, Yönetim sekmelerinde yeni alanları kullan.
9. Export/import varsa yeni şemaya göre çalıştır.
10. Build sırasında unused import/type hatalarını temizle. Tüm değişiklikleri yaptıktan sonra `npx tsc --noEmit` komutunu çalıştırarak kırılan tüm Componentleri tek tek tespit et ve düzelt. Uygulama tsc'den hatasız geçene kadar görevi sonlandırma.

---

## 17. Kabul Testleri

Aşağıdaki testler tamamlanmadan görevi bitirme:

### 17.1. Veri Testleri

- Türkiye aday sayısı tam olarak 20.
- JICA/EİE aday sayısı tam olarak 16.
- Deniz tipi prototip aday sayısı tam olarak 4.
- İtalya projesi Türkiye adaylarında yok.
- İtalya projesi dünya örneklerinde var.
- Her adayda `id`, `name`, `province`, `capacityMW`, `technicalClassification`, `coordinates.mapAnchor` var.
- Her JICA adayında `projectFlowCms` ve `headM` doğru.
- Verilen şaft/cebri boru/kuyruk tüneli değerleri doğru.
- Deniz tipi 4 aday `score` büyükten küçüğe seçilmiş.

### 17.2. UI Testleri

- PDHES Nedir sayfası açılıyor.
- Datalar sekmesi açılıyor, filtre/sıralama çalışıyor.
- Harita açılıyor.
- Tüm 20 aday marker olarak görünüyor.
- Her marker popup açıyor.
- Her adayda kavramsal tesis yerleşimi çiziliyor.
- 3D sekmesi tüm 20 aday için hata vermeden açılıyor.
- Hesaplamalar sekmesinde NaN/undefined/null görünmüyor.
- Dark/light tema bozulmuyor.

### 17.3. Build Testleri

Çalıştır:

```bash
npm install
npm run lint
npm run build
npm run dev
```

Eğer lint script’i yoksa bunu raporda belirt; build ve dev mutlaka kontrol et.

---

## 18. Çıktı Raporu

Görev bitince bana şu formatta rapor ver:

1. Değiştirilen dosyalar
2. Silinen Türkiye adayları
3. Korunan/güncellenen 16 JICA adayı
4. Seçilen 4 deniz tipi prototip ve seçim gerekçesi
5. Dünya örneklerine taşınan İtalya projesi
6. Yeni teknik sınıflandırma özeti
7. Koordinat üretim / düzeltme özeti
8. 3D modelleme değişiklikleri
9. Harita değişiklikleri
10. Hesaplama sekmesi değişiklikleri
11. Build/test sonuçları
12. Bilinen sınırlamalar
13. Sonraki öneriler

---

## 19. Önemli Uyarılar

- Koordinatları kesin resmi veri gibi gösterme.
- JICA/EİE raporunda olmayan koordinatları “rapordan alınmıştır” deme.
- Deniz tipi aday seçimini elle uydurma; mevcut veri setinden skorla seç.
- Eski 20 aday listesinden JICA dışı olanları koruma.
- İtalya projesini silme, dünya örneklerine taşı.
- Eski tipleri yeni teknik sınıflandırmaya dönüştür; kullanıcıya eski tipleri gösterme.
- Türkçe karakterleri doğru kullan:
  - Gökçekaya
  - İznik
  - Sarıyar
  - Bayramhacılı
  - Hasan Uğurlu
  - Adıgüzel
  - Eğirdir
  - Kargı
  - Karacaören
  - Yalova
  - Yamula
  - Oymapınar
  - Aslantaş
  - Demirköprü
- Harita ve 3D sahnede null/undefined kaynaklı hata bırakma.
- Uygulama hâlâ eğitim/PoC/masaüstü ön inceleme demosu olarak kalmalı.
- Resmi fizibilite, yatırım önerisi veya mühendislik tasarımı dili kullanma.
