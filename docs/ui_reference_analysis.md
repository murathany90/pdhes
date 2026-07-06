Bu uygulama büyük ihtimalle **“data-center/site-intelligence + harita + yapay zekâ destekli konsept yerleşim”** prototipi. Yani gerçek bir CAD/BIM modeli değil; kamu kayıtlarından çıkan ipuçlarını alıp, enerji altyapısı ve uydu görüntüsü üstüne **tahmini bir kampüs yerleşimi** çiziyor.

Postta anlatılan akış şöyle: TCEQ’nin güncellediği pipe-delimited dosyada “Galaxy Helios I LLC / Dickens County / 984 County Road 112 / 120 emergency diesel generators” kaydı bulunuyor; AI bu permit bilgisini okuyor, power line verileriyle eşleştiriyor, interconnection’ı modelliyor ve “GPU halls, cooling towers, switchyard, BTM gas generation” gibi blokları 138 kV hatta göre yerleştiriyor. ([LinkedIn][1]) TCEQ teknik inceleme dokümanında da Galaxy Helios I LLC için Afton/Dickens County kaydı, 120 CAT 3516E dizel jeneratör ve yaklaşık 251 MW acil durum güç kapasitesi geçiyor.  Galaxy tarafında ise Helios kampüsü için $1.4B finansman, CoreWeave anlaşması ve ilk 800 MW kapasite resmi olarak açıklanmış; ayrıca Galaxy’nin kendi sitesinde Helios’un 1.6+ GW onaylı güç kapasitesi ve 1,500+ acre kampüs büyüklüğü belirtiliyor. ([Galaxy][2]) ([Galaxy][3])

## Ekrandaki uygulama nasıl çalışıyor olabilir?

Bence 3 katmandan oluşuyor:

**1. Veri katmanı**
Uygulama TCEQ permit dosyaları, permit PDF’leri, şirket/finansman haberleri, ERCOT/LLIS bilgileri, enerji iletim hatları, substations, parsel/uydu görüntüsü gibi kaynakları topluyor. HIFLD gibi açık veri setleri ABD’deki elektrik iletim hatları için kullanılabilir; HIFLD dataset’i “Electric Power Transmission Lines” olarak yayımlanıyor. ([Data.gov][4])

**2. AI çıkarım katmanı**
LLM veya klasik parser şunları çıkarıyor olabilir:

```json
{
  "company": "Galaxy Helios I LLC",
  "site": "984 County Road 112, Afton, TX",
  "county": "Dickens",
  "equipment": "120 CAT 3516E diesel generators",
  "backup_power_mw": 251,
  "possible_components": [
    "GPU halls",
    "cooling towers",
    "switchyard",
    "BTM gas generation",
    "staging/logistics"
  ],
  "confidence": "filing-grade"
}
```

Sonra bu veri PostGIS gibi bir coğrafi veritabanına giriyor. En yakın 138 kV / 230 kV hatlar, substation noktaları, parsel sınırı, yol erişimi ve arazi boşluğu hesaplanıyor. Örneğin:

```sql
SELECT *
FROM transmission_lines
WHERE ST_DWithin(site.geom, transmission_lines.geom, 10000)
ORDER BY ST_Distance(site.geom, transmission_lines.geom)
LIMIT 5;
```

**3. Harita + 3D görselleştirme katmanı**
Ekranda `localhost:3000` göründüğü için bu muhtemelen bir **Next.js / React** uygulaması. Harita tarafında büyük olasılıkla **Mapbox GL JS** veya **MapLibre GL JS** kullanılmış; ekranda Mapbox/OpenStreetMap attribution’ı da görünüyor.

Mapbox tarafında 3D için iki tip yaklaşım var:

Birincisi, basit binalar için **GeoJSON polygon + fill-extrusion**. Mapbox dokümanlarında bu yöntemle polygon’ların yükseklik değerlerine göre 3D bina gibi yükseltilebildiği anlatılıyor. ([Mapbox][5]) ([Mapbox][6])

İkincisi, daha özel 3D modeller için **Mapbox custom layer + Three.js**. Mapbox’ın kendi örneği, custom style layer kullanarak Three.js modeli haritaya eklemeyi gösteriyor. ([Mapbox][7]) Daha yoğun görselleştirmelerde deck.gl de Mapbox/MapLibre kamera sistemiyle senkron çalışabiliyor ve 3D layer’ları harita üstüne bindirebiliyor. ([deck.gl][8])

## 3D çizim kısmı özellikle nasıl yapılmış olabilir?

Ekrandaki 3D, bana göre gerçek mimari model değil; **ölçekli dikdörtgen bloklardan oluşan “procedural layout”**.

Örneğin AI şunu üretiyor olabilir:

```json
[
  {
    "type": "gpu_hall",
    "width_m": 509,
    "length_m": 276,
    "height_m": 18,
    "bearing": 92,
    "color": "blue-gray"
  },
  {
    "type": "cooling_yard",
    "width_m": 382,
    "length_m": 212,
    "height_m": 8,
    "bearing": 92,
    "color": "cyan"
  },
  {
    "type": "switchyard",
    "width_m": 201,
    "length_m": 159,
    "height_m": 6,
    "bearing": 92,
    "color": "yellow"
  }
]
```

Sonra frontend bu objeleri:

1. Site merkezine göre metre koordinatlarına çeviriyor.
2. Transmission line açısına göre döndürüyor.
3. GeoJSON polygon veya Three.js mesh olarak çiziyor.
4. Üstüne HTML/CSS label koyuyor: “Main GPU halls”, “Cooling tower”, “BTM generation” gibi.
5. Mapbox pitch/bearing ile kamerayı eğip 3D hissi veriyor.

Bu yüzden binalar uydu görüntüsüne “oturmuş” gibi görünüyor ama aslında çizilen şeyler **tahmini footprint + extrusion**. Yani “AI çizdi” ifadesi muhtemelen şu anlama geliyor: AI permit’ten ihtiyaçları çıkardı, enerji hattı ve arazi bağlamını gördü, sonra olası kampüs bileşenlerini kurallı şekilde yerleştirdi.

## Sağ paneldeki timeline nasıl yapılmış?

Sağdaki panel bir “evidence timeline” gibi:

* 2025-03-28: leased
* 2025-04-23: expanded
* 2025-08-15: financed
* 2026-01-15: scaled / ERCOT approval

Bu kayıtlar muhtemelen ayrı bir `events` tablosundan geliyor:

```sql
events
- id
- site_id
- date
- type: lease | financing | permit | ercot | render
- title
- mw
- source_url
- confidence: filing_grade | public | inferred
- summary
```

Galaxy’nin 2026 duyurusunda ERCOT Large Load Interconnection Study tamamlanıp ek 830 MW computing demand onayı alındığı ve toplam onaylı/utility-contracted kapasitenin 1.6 GW üzerine çıktığı yazıyor; sağ paneldeki “2026-01-15 / 1.63 GW” kartı büyük ihtimalle bu olaya bağlanmış. ([Galaxy Digital Inc.][9])

## “Render” görselleri nasıl üretilmiş olabilir?

Ekranda “Saved renders / public / images” ve `bfl-campus-render.jpg` gibi isimler görünüyor. Bu iki olasılığa işaret ediyor:

**Olasılık A — Three.js / Blender render**
Uygulama layout JSON’u üretir, bunu Three.js veya Blender’a gönderir. Blender/Three.js sahnesinde binalar, yollar, elektrik hatları, çöl zemini ve etiketler oluşturulur. Sonra PNG/JPG render alınır.

**Olasılık B — AI image generation**
Layout JSON + uydu görüntüsü + açıklama bir image model’e prompt olarak verilir:

> “Aerial oblique render of a West Texas AI data center campus, GPU halls, cooling towers, switchyard, behind-the-meter gas generation, aligned along 138 kV transmission line, arid scrubland, labeled infrastructure components…”

Sonuç “public/images” klasörüne kaydedilir ve panelde gösterilir.

Bence uygulamada ikisi birlikte olabilir:
Harita üstündeki renkli bloklar **deterministic 3D geometry**, sağ paneldeki fotogerçekçi kampüs görselleri ise **AI render** veya Blender render.

## Bunu kendin yapmak istesen minimum stack

En pratik stack şöyle olurdu:

**Frontend**

* Next.js / React
* Mapbox GL JS veya MapLibre GL JS
* deck.gl veya Three.js
* Tailwind / shadcn UI
* Zustand veya Redux

**Backend**

* Python FastAPI veya Node.js
* PostgreSQL + PostGIS
* S3/R2 image storage
* Celery/Temporal/cron job for weekly ingestion

**AI / extraction**

* PDF parser: PyMuPDF, pdfplumber, Tesseract gerekirse
* LLM extraction: structured JSON schema
* Geocoding: Mapbox/Google/Nominatim
* GIS: PostGIS, Turf.js, Shapely, GeoPandas

**Render**

* Basit: Mapbox fill-extrusion
* Orta: deck.gl `PolygonLayer` / `GeoJsonLayer` with extrusion
* İleri: Three.js custom Mapbox layer
* Fotogerçekçi: Blender Python veya image-generation API

## En kritik teknik numara

Bu uygulamanın “akıllı” görünmesini sağlayan şey 3D’den çok şu:

**Permit → entity extraction → geospatial join → power-line proximity → procedural site layout → map render.**

Yani AI sadece sohbet etmiyor; yapılandırılmış veri çıkarıyor ve bu veriyi haritada çalıştırıyor. 3D çizim de bu verinin görsel temsili. Gerçek mühendislik çizimi değil, ama yatırım/altyapı istihbaratı için çok güçlü bir “ne inşa ediliyor olabilir?” arayüzü.

[1]: https://www.linkedin.com/posts/yair-titelboim-aaa5ab18_datacenters-ai-infrastructure-ugcPost-7459215369837256704-ETnu?rcm=ACoAAC02RBYBGNmurb-V0wiYsne4fwvtvi-2TW8&utm_medium=member_desktop&utm_source=share "#datacenters #ai #infrastructure | Yair Titelboim"
[2]: https://www.galaxy.com/newsroom/galaxy-closes-helios-project-financing "Galaxy Closes $1.4B Project Financing to Accelerate Helios AI Datacenter Development | Galaxy"
[3]: https://www.galaxy.com/data-centers "Galaxy Data Center Infrastructure - AI and HPC Data Center | Galaxy"
[4]: https://catalog.data.gov/dataset/electric-power-transmission-lines "Department of Homeland Security - Electric Power Transmission Lines"
[5]: https://docs.mapbox.com/mapbox-gl-js/example/3d-buildings/ "Display buildings in 3D | Mapbox GL JS | Mapbox"
[6]: https://docs.mapbox.com/mapbox-gl-js/example/3d-extrusion-floorplan/ "Extrude polygons for 3D indoor mapping | Mapbox GL JS | Mapbox"
[7]: https://docs.mapbox.com/mapbox-gl-js/example/add-3d-model/ "Add a 3D model with three.js | Mapbox GL JS | Mapbox"
[8]: https://deck.gl/docs/api-reference/mapbox/overview "@deck.gl/mapbox | deck.gl"
[9]: https://investor.galaxy.com/news-releases/news-release-details/galaxy-completes-ercot-interconnection-studies-and-secures "Galaxy Completes ERCOT Interconnection Studies and Secures Approval for Additional 830 Megawatts at Helios Data Center Campus, Doubling Total Approved Power Capacity to over 1.6 Gigawatts | Thu, 01/15/2026 - 09:15"
