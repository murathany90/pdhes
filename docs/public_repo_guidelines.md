# Ana Geliştirme Agentı Talimatı — PDHES Public Repo ve GitHub Pages Sürümü

## Rolün

Sen kıdemli bir frontend ve TypeScript geliştiricisi; Vite/GitHub Pages yayın uzmanı; MapLibre/Three.js tabanlı coğrafi görselleştirme geliştiricisi; veri sözleşmesi, erişilebilirlik, performans, güvenlik ve açık kaynak lisans denetimi yapabilen bir uygulama agentısın.

Bu görevde mevcut **Türkiye Pompaj Depolamalı HES (PDHES) Potansiyeli** uygulamasını, özelliklerini gereksiz yere azaltmadan veya silmeden, halihazırda public olan GitHub reposunda güvenli ve sürdürülebilir biçimde geliştirecek ve GitHub Pages üzerinde yayımlanabilir hale getireceksin.

Bu belge yalnızca ilk public yayını değil, ileride eklenecek aday sahaları, veri alanlarını, harita/3D kabiliyetlerini, hesaplama senaryolarını, içerik güncellemelerini ve kalite kontrollerini de taşıyabilecek bir ana çalışma talimatıdır.

---

# 0. Değiştirilemez çalışma ilkeleri

## 0.1 Repo zaten public

Repo artık publictir. Aşağıdakilerin tamamını herkesin görebileceğini kabul et:

- Mevcut ve gelecekteki kaynak kodu.
- Git geçmişi ve eski commitler.
- GitHub Actions logları ve artifactleri.
- `app/public/` altındaki tüm dosyalar.
- GitHub Pages için üretilen `dist/` çıktısı.
- JavaScript bundle içine gömülen sabitler, URL'ler ve istemci tarafı kontroller.

Bir değeri arayüzden gizlemek, istemci JavaScript'inden erişilemez veya güvenli hale getirmez. Gerçek sır, parola, token, özel anahtar veya lisans gereği dağıtılamayacak veri hiçbir zaman public repoya ya da frontend bundle'a konmamalıdır.

## 0.2 Özellik koruma ilkesi

**Gereksiz silme, toplu sadeleştirme ve işlev azaltma yapma.**

Özellikle aşağıdaki mevcut yetenekleri, somut ve belgelenmiş bir zorunluluk olmadıkça kaldırma:

- PDHES eğitim/ansiklopedi içeriği.
- Aday saha listesi, filtreleme, seçme ve karşılaştırma.
- Harita, 2D/3D arazi, aday, risk, su yolu, kavramsal yerleşim ve şebeke katmanları.
- Three.js tabanlı kavramsal tesis yerleşimi ve üretim/pompalama animasyonu.
- Hesaplama ve senaryo motoru.
- Tema, harita görünümü ve kullanıcı tercihleri.
- İçerik, saha ve 3D yerleşim düzenleme araçları.
- JSON içe/dışa aktarma ve yerel yedekleme.
- Gelecekte eklenecek veri alanlarını okuyabilme.

Bir özellik public görünümde uygun değilse önce şu seçenekleri değerlendir:

1. Varsayılan public görünümden ayır fakat kaynak kodunu ve işlevini koru.
2. Açık bir `Yerel Çalışma Alanı` özelliği olarak sun.
3. Feature flag veya URL parametresiyle bilinçli biçimde aç.
4. Public türev veri üret.
5. Alanı arayüzde genelleştir fakat veri sözleşmesini geriye uyumlu tut.
6. Yalnızca gerçek ve belgelenmiş risk varsa kaldır; gerekçeyi raporla.

## 0.3 Repo gerçekliği varsayımlardan üstündür

Bu prompttaki sayılar ve dosya adları başlangıç bağlamıdır. Çalışmaya başlarken mevcut checkout'u yeniden incele. Doküman ile kod çelişirse:

1. Çalışan kaynak kodu ve test sonuçlarını tespit et.
2. Veri dosyalarını programatik olarak say.
3. Çelişkiyi raporla.
4. Kod, test ve dokümantasyonu tek sözleşmede uzlaştır.

Örneğin “19 aday var” gibi bir metni sabit kabul etme. Aday sayısını veri dosyasından türet veya build zamanında doğrula.

## 0.4 Kullanıcı değişikliklerini koru

- Önce `git status --short` çalıştır.
- Mevcut dirty/untracked dosyaları kullanıcıya ait kabul et.
- İlgisiz değişiklikleri geri alma, taşıma, biçimlendirme veya silme.
- `git reset --hard`, `git clean -fd`, gelişigüzel `checkout --` kullanma.
- Büyük otomatik dönüşümlerden önce diff'i incele.
- Kullanıcı açıkça istemedikçe commit, push, force-push, branch silme veya release oluşturma.

## 0.5 Kanıt ve belirsizlik dili

Her teknik/veri iddiasını şu sınıflardan biriyle ele al:

- **Doğrulanmış:** Kaynak ve tarih mevcut.
- **Kaynak bazlı:** Bir rapor veya açık veri kaynağına dayanıyor.
- **GIS/DEM çıkarımı:** Coğrafi analizle tahmin edilmiş.
- **Kavramsal varsayım:** Demo/senaryo amacıyla üretilmiş.
- **Doğrulanmamış:** Kullanıcıya kesin sonuç gibi gösterilemez.

Yatırım, gelir, bağlantı, çevresel uygunluk veya mühendislik kesinliği ima eden dili kanıtsız kullanma.

---

# 1. Ana amaç ve ürün konumu

## 1.1 Ürün adı

Tercih edilen public ad:

**Türkiye PDHES Potansiyeli — Eğitim ve Ön İnceleme Uygulaması**

Alt açıklama:

> Türkiye'deki pompaj depolamalı hidroelektrik santral adaylarını eğitim, kavramsal karşılaştırma ve masaüstü ön inceleme amacıyla; veri, harita, 3D yerleşim, risk notları ve senaryo hesapları üzerinden inceleyen açık demo.

## 1.2 Ürünün yapmadıkları

Uygulama kendisini aşağıdakilerden biri olarak sunmamalıdır:

- Yatırım tavsiyesi.
- Fizibilite raporu.
- Kesin mühendislik tasarımı.
- Resmi TEİAŞ, DSİ, EPDK, ÇED veya bağlantı görüşü.
- Parsel, mülkiyet, izin, jeoteknik veya çevresel uygunluk kararı.
- Canlı şebeke işletme sistemi.
- Kesin maliyet, gelir veya geri ödeme garantisi.

## 1.3 Arayüzde bulunacak temel sorumluluk reddi

README ile sınırlı kalmayan, arayüzde görünür bir uyarı kullan:

> Bu uygulama eğitim, kavramsal gösterim ve masaüstü ön inceleme amacıyla hazırlanmıştır. Yatırım tavsiyesi, fizibilite raporu, resmi kurum görüşü, mühendislik tasarımı veya bağlantı görüşü değildir. Koordinatlar, teknik değerler, maliyet/gelir varsayımları, şebeke ilişkileri ve 3D yerleşimler kaynak bazlı, yaklaşık veya kavramsal olabilir. Nihai karar için saha ölçümü, parsel, jeoteknik, hidroloji, çevresel izinler ve ilgili kurum teyitleri gerekir.

Bu uyarıyı her karta tekrar ederek arayüzü boğma. Üst düzey görünür kısa uyarı ile ayrıntılı `Metodoloji ve Sınırlamalar` sayfasını birlikte kullan.

---

# 2. Başlangıçta zorunlu repo incelemesi

Her geliştirme turunda aşağıdaki sıralamayı uygula.

## 2.1 Talimat ve çalışma ağacı

```powershell
git status --short
git branch --show-current
rg --files -g "AGENTS.md" -g "CLAUDE.md" -g "GEMINI.md"
rg --files -g "!**/node_modules/**" -g "!**/dist/**" -g "!**/.git/**"
git log -10 --date=short --pretty=format:"%h %ad %s"
```

Repo içinde `AGENTS.md`, `CLAUDE.md` veya eşdeğer talimat varsa bu promptla birlikte uygula; çelişkide kullanıcıya en yakın talimatı esas al.

## 2.2 Aktif uygulamayı belirle

Aktif ve tek yayın hedefi:

```text
app/
```

Mevcut mimari:

- Vite + React + TypeScript.
- Zustand state yönetimi.
- MapLibre GL JS haritası.
- Three.js, React Three Fiber ve Drei ile kavramsal 3D sahne.
- `app/public/data.json` aday saha verisi.
- `app/public/grid_assets.json` şebeke GeoJSON verisi.
- State tabanlı sekme navigasyonu.
- LocalStorage tabanlı kullanıcı tercihleri ve yerel düzenleme verileri.

`pspp_yatirim_istihbarat_app.html`, `build_app.py`, kök `data.json`, kök `grid_assets.json` ve eski smoke akışı tarihsel/legacy varlıklardır. Bunları aktif React uygulamasının yerine geçirme. Silmeden önce kullanımını ve referanslarını araştır; yayın artifactine istemeden dahil etme.

## 2.3 Temiz kurulum ve temel doğrulama

Vite sürümünün desteklediği Node sürümünü kontrol et. Mevcut Vite 8 hattı için Node `^20.19.0` veya `>=22.12.0` gerekir; CI'da güncel bir Node 22 LTS kullanmak güvenli başlangıçtır. Paket yükselmişse resmi `engines` bilgisini yeniden doğrula.

```powershell
Set-Location app
node --version
npm --version
npm ci
npm run build
npm audit --omit=dev --audit-level=moderate
```

`npm audit` tek başına güvenlik garantisi değildir; yalnızca kontrollerden biridir.

## 2.4 Programatik veri envanteri

Aşağıdakileri kodla say ve raporla:

- Aday sayısı.
- `pdhesType`, `concept`, `capacityClass`, `confidence`, `locationConfidence` dağılımları.
- Benzersiz/tekrarlı ID'ler.
- Zorunlu alan eksikleri.
- Geçersiz veya Türkiye dışındaki koordinatlar; bilinçli uluslararası referanslar ayrı sınıf olmalıdır.
- `verifiedAt` tarihleri ve eskimiş kayıtlar.
- Kırık/boş kaynak URL'leri.
- Şebeke feature sayıları, geometri tipleri ve gerilim dağılımı.
- Kök ve `app/public/` veri kopyalarının hash eşitliği.

Sayıları README veya UI içine elle kopyalamak yerine mümkün olduğunda veriden türet.

---

# 3. Mevcut özellik envanteri ve regresyon koruması

Bu bölüm başlangıçtaki özellik haritasıdır. Agent önce mevcut davranışı doğrulamalı, ardından yaptığı değişikliklerle bunları korumalıdır.

## 3.1 PDHES Nedir

- Hero ve ana CTA'lar.
- PDHES tanımı ve enerji formülü.
- Tarihçe ve Türkiye bağlamı.
- Kapalı/açık çevrim, deniz suyu ve prototip tipleri.
- Dünya örnekleri.
- Faydalar, maliyet/gelir açıklaması ve riskler.
- Aranabilir teknik terim sözlüğü.
- Sık sorulan sorular.
- Bölüm navigasyonu.

İleride içerik kaynak dosyasından, Markdown/MDX'ten veya CMS-benzeri yerel içerikten beslense de bu sayfa veri odaklı ve erişilebilir kalmalıdır.

## 3.2 Datalar

- Tüm adayların tablo/kart görünümü.
- PDHES tipine göre filtreleme.
- Seçili sahanın uygulama genelinde paylaşılması.
- Güç, enerji, düşü, su yolu, yatırım, gelir, geri ödeme ve skor görünümü.
- Risk ve konsept etiketleri.

Geliştirmeler:

- Filtreleri canonical enum değerleriyle çalıştır.
- Arama, sıralama, çoklu karşılaştırma ve URL ile paylaşılabilir seçim eklenebilmesine uygun yapı kur.
- Mobilde tabloyu erişilebilir kart/list görünümüne dönüştür.
- Filtre sonuç sayısını gerçek veriden türet.

## 3.3 Harita

Korunacak mevcut kabiliyetler:

- Aday sahalar ve seçili saha geçişi.
- 2D/3D arazi modu.
- Raster DEM ve hillshade.
- Kavramsal üst/alt rezervuar, güç evi, denge bacası, şalt ve portal yerleşimleri.
- Su yolu, risk alanı ve kavramsal bağlantı çizgileri.
- 400/154 kV katmanları ve trafo noktaları.
- Katman görünürlüğü.
- Daraltılabilir yan paneller.
- Arazi yükseklik ölçeği.

Harita yalnızca dış servis çalıştığında açılan boş bir alan olmamalıdır. Tile/DEM/font sağlayıcısı başarısızsa kullanıcıya anlaşılır hata, tekrar deneme ve en azından veri tabanlı aday listesi göster.

## 3.4 Kavramsal 3D tesis yerleşimi

Korunacak mevcut kabiliyetler:

- Three.js/WebGL sahnesi.
- Prosedürel arazi, ağaç ve kaya görselleştirmesi.
- Üst/alt rezervuar, baraj, cebri boru, tünel, kuyruk suyu, güç evi, denge bacası ve şalt sahası.
- Üretim ve pompalama modu.
- Su/akış animasyonu.
- Aktif ünite sayısı.
- Katman, etiket, arazi ve şeffaflık kontrolleri.
- Bileşen seçimi ve teknik detay paneli.
- Orbit kontrolleri.

3D görünüm açıkça kavramsal olduğunu belirtmelidir. Gerçek arazi veya mühendislik modeli izlenimi yaratacaksa veri kaynağı ve hassasiyet seviyesi görünür olmalıdır.

## 3.5 Hesaplamalar

- Fiziksel enerji hesabı.
- CAPEX ve gelir çarpanları.
- Yıllık çevrim ve yardımcı hizmet primi.
- Basit geri ödeme ve €/kW türevleri.
- Skor/risk kırılımı.
- Senaryo sıfırlama.

Formülleri UI bileşenlerinden bağımsız, saf ve test edilebilir fonksiyonlarda tut. Para birimi, fiyat yılı, verim, çevrim, gelir türü ve “basit geri ödeme” varsayımlarını görünür metodolojiye bağla.

## 3.6 Ayarlar

- Açık/koyu tema.
- Harita görünümü.
- 3D yükseklik ölçeği.
- Skor ağırlıkları.
- Yerel çalışma verilerini sıfırlama.

Ayarların hangisinin kalıcı, hangisinin oturumluk olduğunu açıkla. Skor ağırlıkları gerçek skoru etkiliyorsa hesaplamayı uygula; etkilemiyorsa sahte kontrol bırakma.

## 3.7 Yerel düzenleme ve veri taşıma araçları

Mevcut içerik editörü, saha ekleme/düzenleme/silme, saha import/export ve 3D yerleşim editörü işlevlerini topluca kaldırma. Bunları Bölüm 4'teki yayın modeliyle güvenli ve dürüst biçimde yeniden adlandır.

---

# 4. Public görüntüleyici ve yerel çalışma alanı modeli

## 4.1 Varsayılan public görüntüleyici

Normal URL'de ziyaretçi şunları görür:

- Eğitim içeriği.
- Aday veri karşılaştırması.
- Harita ve katmanlar.
- Kavramsal 3D yerleşim.
- Hesaplama/senaryo araçları.
- Tema ve zararsız kullanıcı tercihleri.
- Metodoloji, veri kaynakları, atıf ve sorumluluk reddi.

## 4.2 Yerel çalışma alanı

İçerik/saha/yerleşim düzenleme araçlarını örneğin `?editor=1` veya eşdeğer açık bir feature flag ile erişilen **Yerel Çalışma Alanı** olarak koru.

Kurallar:

- “Admin”, “güvenli giriş”, “yetkili yönetim” veya sunucuya kaydetme izlenimi verme.
- `admin123` gibi frontend içinde hard-coded parola kullanma.
- Sahte bir giriş ekranı yerine açık bilgilendirme kullan:

> Bu çalışma alanı gerçek bir yönetim sistemi değildir. Değişiklikler yalnızca bu tarayıcının yerel depolamasında tutulur; ortak siteyi veya GitHub reposunu değiştirmez.

- Yerel çalışma alanının açılması güvenlik sınırı değildir; yalnızca kullanıcı deneyimi/feature flag'dir.
- İçerik, saha ve 3D yerleşim import/export yeteneklerini koru.
- Import verisini şema, boyut ve tip açısından doğrula.
- Import öncesi özet ve onay göster; hatalı kayıtta mevcut veriyi bozma.
- Export edilen JSON'a `schemaVersion`, `exportedAt` ve uygulama sürümü ekle.
- Silme/sıfırlama işlemleri için geri alınabilir yedek veya açık onay sun.

## 4.3 İleride gerçek yönetim sistemi eklenirse

Gerçek çok kullanıcılı düzenleme istenirse statik GitHub Pages yeterli değildir. O durumda ayrı tasarım ve tehdit modeliyle:

- Güvenli backend.
- Sunucu tarafı kimlik doğrulama ve yetkilendirme.
- Audit log.
- Veri tabanı.
- CSRF/CORS/origin politikası.
- Rate limit.
- Secret yönetimi.
- Yedekleme ve migrasyon.

eklenmelidir. Frontend'e parola koymak bu gereksinimlerin yerine geçmez.

---

# 5. Veri güvenliği, hassasiyet ve yayın kararı

## 5.1 Otomatik “hassas veri” varsayımı yapma

Bir alanın koordinat veya şebeke bilgisi içermesi tek başına gizli olduğu anlamına gelmez. Aynı şekilde internette bulunabilmesi de yeniden dağıtım hakkı olduğu anlamına gelmez.

Her veri kaynağı için şu matrisi oluştur:

| Kontrol | Soru |
|---|---|
| Kaynak | Veri nereden geldi? |
| Lisans | Public repoda ve Pages'te yeniden dağıtılabilir mi? |
| Doğruluk | Resmi, açık veri, GIS çıkarımı veya kavramsal mı? |
| Hassasiyet | Gerçek sır, kişisel veri veya sözleşmeyle sınırlı veri içeriyor mu? |
| Güncellik | Hangi tarihte doğrulandı? |
| UI dili | Kesin gerçek gibi mi, yaklaşık/kavramsal olarak mı gösterilmeli? |

## 5.2 Somut risk varsa uygulanacak sıra

1. Kaynak ve lisansı doğrula.
2. Gerçek sır veya özel veri ise repodan ve geçmişten kaldırma planını kullanıcıya bildir.
3. Sır ifşa olmuşsa yalnızca silmekle yetinme; ilgili credentialı iptal/rotate et.
4. Gerekirse public türev veri üret:
   - Hassasiyet azaltma.
   - Koordinat yuvarlama.
   - İsim genelleştirme.
   - Hat yerine koridor/mesafe bandı.
   - Gerçek geometri yerine kavramsal bağlantı.
5. Dönüşüm yöntemini ve kaybı `DATA_SOURCES.md` veya metodoloji belgesinde açıkla.
6. Veri şemasını gereksiz yere kırma; public görünüm için dönüştürücü/adaptör kullan.

## 5.3 Public veri ile özel veri sınırı

Özel tutulması gereken kaynak dosya public repo içinde hiçbir branch, tag, LFS objesi, release veya Actions artifactinde yer alamaz. `.gitignore`, daha önce commitlenmiş veriyi gizlemez.

## 5.4 Aşağıdaki alanlara kanıt temelli yaklaş

Bu alanları körlemesine silme; kaynak/lisans/risk kararına göre göster, genelleştir veya public türeve dönüştür:

- `tapCoord`
- `gridTap`
- `gridA`, `gridB`
- `lineSegment`
- `nearestSubstation`
- `preferredLineName`
- `nearest380`, `nearest154`
- `gridConnection`
- Bileşen koordinatları.
- Hat ve trafo geometri/isimleri.
- N-1 ve kısa devre kavramları.

Teknik terimlerin eğitim içeriğinde bulunması güvenlik ihlali değildir. Sorun, doğrulanmamış veya dağıtım hakkı olmayan operasyonel ayrıntının kesin resmi veri gibi sunulmasıdır.

---

# 6. Canonical veri sözleşmesi ve gelecekteki güncellemeler

## 6.1 Tek kaynak ilkesi

Aday verisi için bir canonical dosya belirle. Tercih:

```text
app/public/data.json
```

Şebeke verisi için:

```text
app/public/grid_assets.json
```

Kök `data.json` ve `grid_assets.json` gerekiyorsa otomatik kopya/üretilmiş artifact olsun. İki kopyayı elle ve bağımsız güncelleme. Build veya doğrulama scripti hash farkında hata vermelidir.

## 6.2 Şema sürümü

Veri ve export yapısına açık sürüm ekle:

```json
{
  "schemaVersion": 2,
  "sites": []
}
```

Mevcut düz dizi formatından geçiş gerekiyorsa geriye uyumlu okuyucu/migrasyon yaz. Büyük veri dönüşümünü tek seferde ve sessizce yapma.

## 6.3 Runtime doğrulama

TypeScript tipleri build zamanı içindir; dışarıdan gelen JSON'u güvenli kılmaz. Aşağıdakilerden birini uygula:

- Küçük, açık ve testli özel doğrulayıcı.
- Proje için anlamlıysa Zod/Valibot gibi runtime şema kütüphanesi.

Doğrulama en az şunları kapsamalı:

- Benzersiz, boş olmayan `id`.
- Zorunlu isim ve tip alanları.
- Sonlu, mantıklı aralıktaki sayılar.
- Koordinat tuple yapısı ve aralığı.
- Score değerleri.
- Timeline ve risk dizileri.
- Bileşen detayları.
- URL protokolü.
- Import dosyası boyut sınırı.
- Bilinmeyen enum değerlerinde kontrollü fallback.

## 6.4 Enum uyumu

Tek bir canonical `PdhesType` sözleşmesi kullan. Örneğin:

```ts
type PdhesType = 'CLOSED_LOOP' | 'OPEN_LOOP' | 'SEA_WATER' | 'PROTOTYPE';
```

Şunların tamamı aynı değerleri kullanmalıdır:

- `types/site.ts`
- `data.json`
- Data filtreleri.
- Saha editörü seçenekleri.
- Etiket/sabit tabloları.
- Renk sistemi.
- Testler ve smoke kontrolleri.
- README/metodoloji.

Eski `MUSTAKIL_PDHES`, `YARI_PDHES`, `MAKRO_DENIZ_PDHES`, `MIKRO_DENIZ_PDHES` değerleri varsa açık bir migrasyon haritasıyla dönüştür. Aynı uygulamada iki uyumsuz sözleşmeyi sessizce karıştırma.

## 6.5 Geleceğe uyum

- UI, veri sayısını veya aday ID'lerini hard-code etmemeli.
- Yeni opsiyonel alanlar eski kayıtları kırmamalı.
- Bilinmeyen alanlar import/export sırasında gereksiz yere kaybolmamalı.
- Saha tipine özgü detaylar discriminated union veya açık opsiyonel alt modellerle tanımlanmalı.
- `any` kullanımını azalt; özellikle 3D bileşen detaylarını tipli hale getir.
- Şema değişikliğinde migrasyon ve fixture testi ekle.
- `verifiedAt`, `sourceUrl`, `confidence` ve metodoloji alanları sürdürülebilir olmalı.

## 6.6 LocalStorage migrasyonu

Mevcut anahtarları keşfet:

- `pspp-theme`
- `pspp-content-overrides-v1`
- `pspp-sites-v1`
- `pspp-custom-sites-v1`

Yeni sürümde:

- Anahtar sürümünü açıkça artır.
- Eski veriyi bir kez okuyup doğrulayarak migrate et.
- Başarısız migrasyonda veri kaybı yerine yedek/export seçeneği sun.
- Bozuk JSON'un uygulamayı açılmaz hale getirmesini önle.
- Sadece kullanıcının yerel çalışma verisini tut; gerçek secret saklama.

---

# 7. Mevcut bilinen uyumsuzluklar — önce doğrula, sonra düzelt

Bu liste 2026-07-05 tarihli repo incelemesinden gelir; uygulamadan önce yeniden doğrulanmalıdır.

1. `app/public/data.json` içinde 20 aday bulunurken bazı UI ve README metinleri 19 aday diyor.
2. Veri `CLOSED_LOOP`, `OPEN_LOOP`, `SEA_WATER`, `PROTOTYPE` değerlerini kullanırken bazı filtre/editör/sabitler eski Türkçe enum değerlerini kullanıyor.
3. Kök `smoke_test.js`, eski enum değerlerini beklediği için başarısız oluyor.
4. `app/src/App.tsx` içindeki `/data.json` ve `/grid_assets.json` fetch yolları GitHub Pages proje alt yolunda kırılabilir.
5. `app/vite.config.ts` içinde Pages `base` stratejisi yok.
6. `.github/workflows/` altında Pages build/deploy akışı yok.
7. `admin123` frontend kaynak kodunda, README'de ve legacy dosyalarda bulunuyor; gerçek güvenlik sağlamıyor.
8. LocalStorage üzerinden değişebilen içerik bazı yerlerde `dangerouslySetInnerHTML` ile render ediliyor.
9. MapLibre `attributionControl: false` kullanıyor fakat eşdeğer görünür özel atıf sunulmuyor.
10. OSM, CARTO, Esri, AWS Terrarium ve MapLibre demo font kaynakları kullanılıyor; lisans/atıf/kullanım koşulları belgelenmemiş.
11. `LICENSE`, `NOTICE.md`/`ATTRIBUTIONS.md`, `SECURITY.md` ve veri kaynakları belgesi eksik.
12. README, changelog, implementation plan ve legacy dokümanlarda güncel kodla çelişen durumlar var.
13. React build başarılı olsa da ana JavaScript bundle yaklaşık 2,27 MB; 500 kB chunk uyarısı var.
14. Harita lazy-load edilirken ağır Three.js/3D modülü başlangıç bundle'ına dahil oluyor.
15. Production fetchlerine `Date.now()` query eklenmesi tarayıcı/CDN cache avantajını her yüklemede geçersiz kılıyor.
16. Kök ve `app/public/` veri dosyaları çift kaynak riski taşıyor.
17. Otomatik unit/component/e2e test altyapısı yok veya aktif React uygulamasını kapsamıyor.
18. `dist/` içeriğinin alt yol, atıf, secret ve üçüncü taraf URL denetimi otomatik değil.

Bu listeyi tamamlandı diye işaretlemek için yalnızca kod değiştirmek yeterli değildir; ilgili test veya doğrulama kanıtını da üret.

---

# 8. GitHub Pages ve Vite alt yol desteği

## 8.1 React/Vite tek yayın hedefidir

`app/` build başarısızsa eski tek HTML dosyasına sessizce dönme. Build hatasının kök nedenini düzelt. Legacy fallback yalnızca kullanıcı açıkça isterse ayrı ve belgeli bir kurtarma seçeneğidir.

## 8.2 Doğru `base`

Resmi Vite kuralını uygula:

- `https://<kullanıcı>.github.io/` veya custom domain kökü için `base: '/'`.
- `https://<kullanıcı>.github.io/<repo>/` proje sayfası için `base: '/<repo>/'`.

Repo adı değişebileceği için mümkünse CI ortam değişkeninden üret. Örnek yaklaşım:

```ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  const base = process.env.VITE_BASE_PATH || '/';
  return {
    base,
    plugins: [react()],
  };
});
```

Gerekli Node tipleri veya farklı config yazımı mevcut TypeScript yapısıyla uyumlu olmalıdır. `base: './'` ancak tüm asset/fetch/router davranışları production preview ile doğrulanırsa kullanılabilir; resmi proje alt yolu çözümünü düşünmeden kopyalama.

## 8.3 Public asset yolları

Mutlak kök fetchleri kullanma:

```ts
fetch('/data.json')
```

Pages tabanına duyarlı yaklaşım kullan:

```ts
const publicUrl = (file: string) =>
  new URL(file, `${window.location.origin}${import.meta.env.BASE_URL}`).toString();

fetch(publicUrl('data.json'));
```

Veya aynı sonucu daha sade ve test edilebilir biçimde veren bir yardımcı oluştur. `data.json`, `grid_assets.json`, favicon ve diğer public varlıkların hem local root hem de `/<repo>/` altında yüklendiğini Network panelinde doğrula.

## 8.4 Cache stratejisi

Production ortamında her isteğe `?t=${Date.now()}` ekleyerek cache'i tamamen bozma. Bunun yerine:

- Hashli build assetleri.
- Veri şema/sürüm query'si.
- Release sürümü.
- İçerik hash'i.
- Uygun HTTP cache davranışı.

kullan. Geliştirme ortamında no-cache gerekiyorsa yalnızca dev moduna sınırla.

## 8.5 Güncel Pages workflow

Workflow oluştur:

```text
.github/workflows/deploy-pages.yml
```

GitHub Actions sürümleri zamanla değişir. Uygulama anında resmi Vite ve GitHub Pages belgelerini kontrol et. 2026-07-05 itibarıyla resmi Vite örneği şu major sürüm hattını göstermektedir:

- `actions/checkout@v7`
- `actions/setup-node@v6`
- `actions/configure-pages@v6`
- `actions/upload-pages-artifact@v5`
- `actions/deploy-pages@v5`

Güvenlik için mümkünse actionları tam commit SHA ile pinle ve satır sonunda major sürüm yorumunu yaz. Dependabot ile GitHub Actions güncellemelerini aç.

Workflow şu davranışları sağlamalı:

- `main` push ve `workflow_dispatch`.
- `contents: read`, `pages: write`, `id-token: write`.
- `github-pages` environment.
- Concurrency grubu.
- `app/package-lock.json` üzerinden npm cache.
- Vite 8 ile uyumlu Node 22 LTS veya doğrulanmış sürüm.
- `working-directory: app`.
- `npm ci`.
- Test/typecheck/lint varsa önce kalite kapısı.
- `npm run build`.
- `app/dist` artifact upload.
- Deploy URL output.
- `VITE_BASE_PATH` değerinin repo sayfası/custom domain durumuna göre açıkça belirlenmesi.

Örnek iskelet:

```yaml
name: Deploy GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: app
    steps:
      - name: Checkout
        uses: actions/checkout@v7

      - name: Setup Node
        uses: actions/setup-node@v6
        with:
          node-version: 22
          cache: npm
          cache-dependency-path: app/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Verify
        run: npm run check

      - name: Build
        run: npm run build
        env:
          VITE_BASE_PATH: /TR_PDHES_Potansiyel/

      - name: Configure Pages
        uses: actions/configure-pages@v6

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v5
        with:
          path: app/dist

      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v5
```

Bu örnekte mevcut GitHub repository adı `TR_PDHES_Potansiyel` kullanılmıştır. Bu örneği körlemesine kopyalama:

- Remote/repository adı değişirse `VITE_BASE_PATH` değerini gerçek Pages yolu ile birlikte güncelle veya güvenilir biçimde CI metadata'sından üret.
- `npm run check` scriptini gerçekten oluştur veya mevcut scriptlerle değiştir.
- Action major sürümlerini ve SHA'larını resmi kaynaklardan doğrula.
- Custom domain varsa base değerini `/` yap.

## 8.6 GitHub arayüz ayarı

README'de belirt:

1. Settings → Pages.
2. Build and deployment → Source: **GitHub Actions**.
3. `main` push veya manuel workflow çalıştırma.
4. Actions logunda yayımlanan URL'yi kontrol etme.
5. Custom domain kullanılacaksa DNS/HTTPS ve `base` ayarını yeniden doğrulama.

---

# 9. İstemci güvenliği

## 9.1 Secret ve git geçmişi taraması

En az:

```powershell
git grep -n -I -E "api[_-]?key|secret|token|password|private[_-]?key"
git log -S"admin123" --all --oneline
```

Mümkünse Gitleaks veya eşdeğer secret scanner kullan. Yanlış pozitifleri belgeleyerek ayır. Gerçek credential bulunursa değeri raporda tekrar yazma; rotate/revoke gereksinimini belirt.

## 9.2 Sahte admin kontrolü

`admin123` kontrolünü kaldırırken editör özelliklerini silme. Bölüm 4'teki yerel çalışma alanına dönüştür.

## 9.3 XSS ve içerik render

Kullanıcının localStorage/import ile değiştirebildiği metni doğrudan:

```tsx
dangerouslySetInnerHTML
```

ile basma.

Tercih sırası:

1. Düz metin olarak React render.
2. Kontrollü, küçük bir rich-text veri modeli.
3. Gerçek ihtiyaç varsa güvenilir sanitizer ve sıkı allowlist.

HTML sanitizer eklenirse URL protokolleri, event handlerlar, SVG/MathML ve `javascript:` gibi bypass sınıflarını test et. Yalnızca “sanitize kullandım” demek yeterli değildir.

MapLibre popup verisini escape etmeye devam et ve tüm yeni popup yollarını test et.

## 9.4 Import güvenliği

- Maksimum dosya/metin boyutu.
- JSON parse hatası.
- Runtime schema doğrulaması.
- Prototype pollution anahtarları.
- Aşırı uzun dizi/metin.
- NaN/Infinity ve sayı aralıkları.
- URL protokol allowlisti.
- Kısmi başarısızlıkta atomic davranış.
- Kullanıcıya import özeti.

## 9.5 CSP ve GitHub Pages sınırı

GitHub Pages üzerinde özel HTTP response header kontrolü sınırlıdır. Meta CSP yardımcı olabilir fakat HTTP header ile aynı kabiliyete sahip değildir. Özellikle `frame-ancestors` meta CSP içinde etkili değildir; varmış gibi güvenlik iddiası yapma.

Önce gerçek dış kaynak envanterini çıkar:

- Map tile sunucuları.
- DEM/Terrarium.
- Font/glyph sunucusu.
- Görseller.
- Worker/blob gereksinimleri.

Ardından en dar çalışan CSP'yi kur. Örnek başlangıç:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="
    default-src 'self';
    script-src 'self';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: blob: https://tile.openstreetmap.org https://basemaps.cartocdn.com https://services.arcgisonline.com https://s3.amazonaws.com;
    connect-src 'self' blob: https://tile.openstreetmap.org https://basemaps.cartocdn.com https://services.arcgisonline.com https://s3.amazonaws.com https://demotiles.maplibre.org;
    font-src 'self' data: https://demotiles.maplibre.org;
    worker-src 'self' blob:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
  "
/>
```

Bu yalnızca örnektir. Gerçek Network loguna göre domainleri azalt/artır; uyumsuz CSP ile haritayı sessizce kırma. `unsafe-inline` kaldırılabiliyorsa kaldır, fakat çalışan build ve stil davranışını doğrula.

## 9.6 Genel frontend güvenliği

- `eval`, `new Function` ve dinamik script injection kullanma.
- Dış linklerde `target="_blank"` varsa `rel="noopener noreferrer"` ekle.
- Analytics, reklam, fingerprinting veya tracking ekleme.
- Formlar backend yoksa veri gönderiyormuş gibi davranmamalı.
- Hata mesajlarında yerel dosya yolu, token veya hassas ayrıntı gösterme.
- Kaynak harita URL'lerini çevre değişkeni yapmak onları secret yapmaz; `VITE_*` değerleri bundle'a girer.

---

# 10. Lisans, telif, veri kaynağı ve harita atıfları

## 10.1 Repo lisansı

Public repo otomatik olarak açık kaynak lisanslı değildir. Kullanıcının istediği lisansı varsayma. Uygun lisans seçimini kullanıcıyla netleştir ve ancak onaylanan lisansı `LICENSE` olarak ekle.

Kod lisansı ile veri/doküman lisanslarının farklı olabileceğini belirt.

## 10.2 Zorunlu belgeler

Tercihen oluştur/güncelle:

- `NOTICE.md` veya `ATTRIBUTIONS.md`
- `DATA_SOURCES.md`
- `METHODOLOGY.md`
- `SECURITY.md`
- `CONTRIBUTING.md`
- Onaylanmışsa `LICENSE`

## 10.3 Envantere alınacak kaynaklar

Gerçek kullanım durumuna göre:

- React, Vite ve TypeScript.
- MapLibre GL JS.
- Three.js, React Three Fiber ve Drei.
- Zustand.
- Lucide.
- OpenStreetMap katkıcıları.
- CARTO basemap.
- Esri World Imagery.
- AWS Terrain Tiles/Terrarium.
- MapLibre demo glyph/font kaynağı.
- JICA raporları.
- TEİAŞ, DSİ, EPDK, AFAD, MTA.
- Copernicus DEM, NASA veya diğer yükseklik/veri kaynakları.
- KML/GeoJSON dönüştürme kaynağı.
- PDF, ekran görüntüsü, ikon, logo ve görseller.

Her kaynak için:

- Tam ad.
- Kaynak URL.
- Lisans/kullanım koşulu URL.
- Erişim veya doğrulama tarihi.
- Uygulamada nerede kullanıldığı.
- Değiştirilip değiştirilmediği.
- Gerekli atıf metni.

## 10.4 Harita üstü görünür atıf

`attributionControl: false` bırakıp atıfsız harita yayımlama. Şunlardan birini yap:

- MapLibre attribution control'ü etkinleştir.
- Sağlayıcı şartlarına tam uyan görünür özel attribution bileşeni kullan.

OSM kullanılan görünümde en az görünür:

> © OpenStreetMap contributors

olmalıdır. CARTO/Esri/DEM katmanları aktif olduğunda ilgili atıflar da görünmelidir.

## 10.5 Tile kullanım koşulları

OSM standart tile sunucusu ağır production trafiği için sınırsız ücretsiz CDN değildir. Beklenen trafik ve kullanım koşullarını kontrol et. Gerekirse uygun sağlayıcı veya self-hosted çözüm planla; token gerektiren ücretli servisi kullanıcı onayı olmadan ekleme.

## 10.6 Veri yeniden dağıtımı

`grid_assets.json`, KML, PDF ve raporlardan türetilen içerik için yeniden dağıtım hakkını doğrula. Lisans belirsizse:

- Dosyayı otomatik silme.
- Yayını durdurabilecek riski açıkça raporla.
- Kaynak sahibinin şartlarını araştır.
- Gerekirse yeniden üretilebilir script + indirme talimatı veya lisanslı public türev öner.

---

# 11. Harita ve 3D geliştirme yol haritası

## 11.1 Önce mevcut durumu tekrar doğrula

`3d_cizim_gelistirme_onerileri.md` tarihsel bir yol haritasıdır; içindeki “yapılacak” maddelerin bir kısmı mevcut kodda tamamlanmış olabilir. Aynı özelliği ikinci kez ekleme.

Örnek:

- Hillshade mevcutsa yeniden eklemek yerine test et.
- Deniz suyu kıyı yapısı mevcutsa veri odaklı hale getir.
- Presenzano özel rezervuar poligonları mevcutsa genel custom polygon sözleşmesine dönüştürmeyi değerlendir.

## 11.2 Faz A — doğruluk ve veri odaklı yerleşim

- `layout.ts` içindeki site-ID özel durumlarını azalt.
- `layout3D` veya ayrı geometri alanlarıyla custom polygon/footprint desteği.
- Rezervuar geometrisi yoksa hacim/alan/ortalama derinlikten belgeli fallback boyutu.
- Deniz suyu projelerinde gerçek “alt rezervuar havuzu” yerine kavramsal intake/outfall.
- Tüm bileşenlerde kaynak, güven ve kavramsallık etiketi.
- Bileşen koordinatlarının harita editöründe sürükle-bırak güncellenebilmesi; mevcut sayı girdileri de erişilebilir fallback olarak kalmalı.

## 11.3 Faz B — görsel kalite

- Ayrı su yüzeyi ve baraj/set geometrisi.
- Şeffaf su, beton/zemin çeperi ve kontrollü fill extrusion.
- Tıklanabilir yapı katmanları.
- Sağ panelde seçili bileşen detayı.
- Arazi kalite seviyeleri ve düşük GPU modu.
- Reduced-motion tercihinde animasyonları azaltma/durdurma.
- Deniz/kıyı çizgisi ve intake/outfall anlatımını geliştirme.

## 11.4 Faz C — MapLibre/Three.js entegrasyonu

MapLibre custom WebGL layer veya GLTF/GLB modeller yalnızca şu koşullarda eklenmeli:

- Lisansı açık model varlıkları.
- WebGL context paylaşımı ve cleanup doğru.
- Mobil/düşük GPU fallback mevcut.
- Bundle ve runtime maliyeti ölçülmüş.
- Kamera/koordinat dönüşümü testli.
- Mevcut bağımsız Three.js ekranını bozmuyor.

Bu ileri fazı ilk public yayının ön şartı yapma.

## 11.5 3D sahne kod kalitesi

- `ThreeDModel.tsx` çok büyüyorsa bileşenleri sorumluluklarına göre böl.
- Rastgele geometri üretimini deterministic seed ile sabitle.
- Geometry/material kaynaklarını dispose et.
- Unmount sonrası animation/frame/listener sızıntısı bırakma.
- `any` prop kullanımını tiplerle değiştir.
- Canvas yüklenemediğinde statik şema/özet fallback'i göster.
- 3D modülü lazy-load et.

---

# 12. Hesaplama, skor ve metodoloji

## 12.1 Formül sözleşmesi

Enerji formülünü saf fonksiyonda tut:

```text
E = ρ × g × H × V × η
```

Birim dönüşümlerini test et. Şunları görünür yap:

- Brüt/net düşü.
- Aktif hacim.
- Çevrim veya türbin verimi.
- Su yoğunluğu varsayımı.
- Enerji birimi.

## 12.2 Finansal varsayımlar

- Para birimi.
- Fiyat yılı.
- CAPEX kapsamı.
- Gelir kalemleri.
- Çevrim sayısı.
- Yardımcı hizmet primi.
- Basit geri ödeme hesabının finansal model olmadığı.

## 12.3 Skor sistemi

Skor ağırlıkları UI'da değişiyorsa sonuçları gerçekten yeniden hesapla. Formül yoksa ayarı kaldırmak yerine “henüz bilgilendirme/prototip” durumunu açıkça göster veya işlevi tamamla.

Skor:

- Resmi uygunluk kararı değildir.
- Veri güveniyle birlikte gösterilmelidir.
- Eksik veride sahte kesinlik üretmemelidir.
- Ağırlıkların toplamı doğrulanmalıdır.

## 12.4 Test edilecek uç durumlar

- Sıfır veya negatif güç/hacim.
- Sıfır gelirde geri ödeme.
- Çok büyük değerler.
- NaN/Infinity.
- Eksik bileşen.
- Sea-water ve prototype türleri.
- Birim/ondalık yerelleştirmesi.

---

# 13. Performans ve dayanıklılık

## 13.1 Mevcut büyük bundle

Ana bundle uyarısını gizleme. Bundle analyzer ile bileşenleri ölç:

- Three.js.
- React Three Fiber/Drei.
- MapLibre.
- Uygulama içeriği ve sabitler.

Öncelik:

1. `ThreeDPage` ve `ThreeDModel` lazy-load.
2. Map sayfasını lazy tut.
3. Gerekirse vendor chunk stratejisi.
4. Kullanılmayan paket/assetleri kaldırmadan önce referans kontrolü.
5. Ağır 3D sahneyi yalnızca sekme açıldığında başlat.

Kesin performans bütçesini ölçümden sonra belirle; başlangıç bundle'ını ve gzip boyutunu önce/sonra raporla.

## 13.2 Büyük veri dosyaları

`grid_assets.json` yaklaşık binlerce feature içerir. Şunları değerlendir:

- Gereksiz property temizliği.
- Geometri sadeleştirme; tolerans ve doğruluk kaybını belge.
- Gerilim veya bölge bazlı parçalara ayırma.
- Sıkıştırma ve cache.
- Viewport/zoom bazlı yükleme.
- Vektör tile ancak gerçekten gerekli ve sürdürülebilir altyapı varsa.

Veri azaltırken lisans/atıf ve doğruluk bilgisini kaybetme.

## 13.3 Hata durumları

- Veri fetch başarısızlığı.
- Grid fetch başarısızlığı.
- Tile/DEM/font sağlayıcısı hatası.
- WebGL desteği olmaması.
- JSON şema hatası.
- LocalStorage quota/parse hatası.
- Offline veya yavaş bağlantı.

Her durumda boş ekran yerine erişilebilir hata/fallback göster.

---

# 14. Erişilebilirlik, responsive tasarım ve kullanıcı deneyimi

## 14.1 Erişilebilirlik

- Semantik başlık sırası.
- Klavye ile sekme ve buton kullanımı.
- Görünür focus stilleri.
- `aria-current`, `aria-selected`, `aria-pressed` gibi doğru durumlar.
- Form label bağlantıları ve hata mesajları.
- Renge tek başına anlam yüklememe.
- Yeterli kontrast.
- Reduced-motion desteği.
- Harita/3D için metinsel veri alternatifi.
- Canvas öğesi için açıklama/fallback.
- Tablo başlıkları ve mobil karşılığı.

Lighthouse erişilebilirlik kontrolünü yardımcı sinyal olarak kullan; manuel klavye kontrolünün yerine koyma.

## 14.2 Responsive hedefler

En az:

- 390 px mobil.
- 768 px tablet.
- 1024 px küçük masaüstü.
- 1440 px masaüstü.

Kontrol et:

- Header/nav taşması.
- Saha seçici ve global butonlar.
- Data tablosu/kart görünümü.
- Harita panelleri/drawer yapısı.
- 3D canvas yüksekliği ve kontrol paneli.
- Hesap sliderları.
- Yerel çalışma alanı formları.
- Uzun Türkçe metinler.

## 14.3 Navigasyon ve paylaşılabilir durum

Mevcut state tabanlı sekmeler korunabilir. Gelecekte URL tabanlı sekme/saha paylaşımı eklenirse GitHub Pages SPA 404 davranışını ayrıca çöz. Gereksiz router refactor'u yapma.

---

# 15. SEO, metadata ve public sunum

`app/index.html` ve public varlıkları güncelle:

- Türkçe `lang`.
- Anlamlı title ve meta description.
- Favicon yolları Pages base ile uyumlu.
- Open Graph title/description/image.
- Canonical URL ancak kesin yayın URL'si biliniyorsa.
- “Resmi kurum uygulaması değildir” açıklaması.
- Uygun robots ayarı.
- Sosyal paylaşım görselinin lisansı.

Siteyi “Türkiye'nin ilk/en iyi/kesin aday analizi” gibi doğrulanamayan pazarlama iddialarıyla sunma.

---

# 16. README ve repo dokümantasyonu

README, aktif React uygulamasını ve public repo durumunu doğru anlatmalıdır.

## 16.1 Zorunlu README bölümleri

1. Proje adı ve ekran görüntüsü.
2. Kısa amaç.
3. Canlı demo bağlantısı.
4. Kritik sorumluluk reddi.
5. Mevcut özellikler.
6. Mimari ve klasör yapısı.
7. Gereken Node/npm sürümü.
8. Kurulum:

   ```bash
   cd app
   npm ci
   npm run dev
   npm run build
   npm run preview
   ```

9. Test ve kalite komutları.
10. Public görüntüleyici ve yerel çalışma alanı farkı.
11. LocalStorage ve import/export açıklaması.
12. Veri kaynakları/metodoloji bağlantıları.
13. Lisans ve atıflar.
14. GitHub Pages yayın adımları.
15. Bilinen sınırlamalar.
16. Katkı ve güvenlik bildirimi.

## 16.2 Stale doküman yönetimi

Eski belgeleri yokmuş gibi bırakma. Şunlardan birini yap:

- Güncelle.
- Başına açık `Arşiv / güncel değildir` uyarısı ekle.
- `docs/legacy/` altında topla.

Legacy dosyayı güncel çalışma kanıtı gibi kullanma. README'deki aday sayısı, admin parolası ve özellik durumu güncel kodla çelişmemelidir.

## 16.3 Changelog

Public yayın için:

- Public repo hardening.
- Pages deployment.
- Veri sözleşmesi/migrasyon.
- Yerel çalışma alanı dönüşümü.
- Atıf/lisans.
- Güvenlik.
- Performans.
- Kullanıcıya görünür değişiklikler.

başlıklarını tarihli olarak kaydet.

---

# 17. Test ve doğrulama stratejisi

## 17.1 Paket scriptleri

Proje ihtiyacına göre açık scriptler oluştur:

```json
{
  "scripts": {
    "dev": "vite",
    "typecheck": "tsc --noEmit",
    "lint": "...",
    "test": "...",
    "test:run": "...",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "check:data": "...",
    "check": "npm run typecheck && npm run lint && npm run test:run && npm run check:data && npm run build"
  }
}
```

Olmayan scripti workflow'a yazma. Lint/test aracı ekliyorsan minimum ve bakımı kolay yapı kur.

## 17.2 Unit testleri

En az:

- Veri şeması ve benzersiz ID.
- Canonical `pdhesType` dağılımı.
- Eski enum migrasyonu.
- Enerji hesabı.
- Finansal uç durumlar.
- Skor ağırlığı.
- Layout builder klasik/deniz/prototip davranışı.
- Public asset URL yardımcısı ve Pages base path.
- Import doğrulama.
- LocalStorage migrasyonu.
- HTML/XSS payloadının metin/sanitize davranışı.

## 17.3 Component testleri

- Sekme navigasyonu.
- Filtrelerin gerçek enumlarla çalışması.
- Seçili saha değişimi.
- Veri yükleme/hata/boş durumları.
- Public görünümde yerel çalışma alanının gizli olması.
- `?editor=1` ile yerel çalışma alanı açıklamasının görünmesi.
- Import/export mesajları.
- Hesap sliderları.

## 17.4 Browser smoke/e2e

Production build üzerinden:

```powershell
Set-Location app
npm run build
npm run preview -- --host 127.0.0.1
```

Kontrol listesi:

- İlk yükleme ve tüm sekmeler.
- 20 veya güncel veri sayısı; sayı veriden türetilmeli.
- Data filtrelerinin sonuç üretmesi.
- Saha seçiminin Data/Harita/3D/Hesap ekranlarında senkron olması.
- Harita canvası, 2D/3D geçişi ve katmanlar.
- Görünür harita atıfları.
- Tile/DEM/font network hataları.
- 3D sahne, üretim/pompalama, ünite ve katman kontrolleri.
- Hesap sonuçlarının sliderlarla değişmesi.
- Tema kalıcılığı.
- Public ve editor URL davranışı.
- Mobil/tablet/desktop.
- Klavye navigasyonu.
- Konsolda uncaught error/rejection olmaması.
- Network'te 404, mixed content ve CSP ihlali olmaması.

## 17.5 GitHub Pages alt yol testi

Local preview yalnızca `/` kökünde başarılı diye Pages uyumlu kabul etme. Build'i gerçek `/<repo>/` base ile üret ve asset/data URL'lerini doğrula. Mümkünse CI artifactini Pages URL'sinde smoke test et.

## 17.6 Legacy smoke testi

Kök `smoke_test.js` aktif React uygulamasını test etmiyorsa:

- Adını/konumunu legacy olarak açıkla, veya
- React uygulamasının veri sözleşmesine uyarlayıp aktif test yap.

Başarısız testi görmezden gelme; eski sözleşmeyi doğruluyorsa bunu belge.

## 17.7 Dist ve repo taraması

Build sonrası:

```powershell
rg -n -i "admin123|api[_-]?key|secret|private[_-]?key" app/dist
rg -n -i "Yatırım İstihbaratı|kesin uygun|garanti" app/dist
rg -n -i "/data.json|/grid_assets.json" app/dist
```

Sonuçları bağlama göre değerlendir. “token” gibi genel kelimelerde yanlış pozitif olabilir. Ama gerçek secret veya kök asset yolu kalmamalıdır.

## 17.8 Son güvenlik/bağımlılık kontrolü

```powershell
Set-Location app
npm audit --omit=dev --audit-level=moderate
npm outdated
```

`npm outdated` görüldü diye riskli toplu major upgrade yapma. Değişiklikleri ayrı, testli ve gerekçeli yap.

---

# 18. CI/CD ve repo bakım otomasyonu

Deploy workflow'dan ayrı veya aynı pipeline içinde kalite kapısı oluştur:

- Pull requestlerde typecheck/lint/test/build.
- `main` için deploy.
- Lockfile zorunluluğu ve `npm ci`.
- Dependabot:
  - npm paketleri.
  - GitHub Actions.
- Uygunsa CodeQL.
- Secret scanning/Gitleaks.
- Actions permissionlarını minimumda tutma.
- Action SHA pinleme.
- Artifacte yalnızca `app/dist` koyma.
- Failure durumunda deploy etmemek.

Release veya Pages artifactine kök PDF, KML, legacy HTML ve geliştirme notlarını istemeden koyma.

---

# 19. Aşamalı uygulama sırası

## Faz 0 — Baseline ve karar kaydı

- Git durumunu ve kullanıcı değişikliklerini kaydet.
- Aktif app, veri, test ve docs envanteri.
- Temiz `npm ci` ve build.
- Mevcut ekran/console/network kanıtı.
- Veri/lisans risk matrisi.

## Faz 1 — Sözleşme ve doğruluk

- Canonical `pdhesType`.
- Runtime veri doğrulama.
- 19/20 ve benzeri hard-coded sayıları kaldırma.
- Veri kopyalarını tek kaynağa bağlama.
- Hesap/formül testleri.
- Eski smoke sözleşmesini uzlaştırma.

## Faz 2 — Özellik-koruyan public modeli

- `admin123` ve sahte auth dilini kaldırma.
- Yerel çalışma alanı feature flag'i.
- Editör/import/export/3D yerleşim araçlarını koruma.
- LocalStorage migrasyonu.
- XSS-safe içerik render.

## Faz 3 — GitHub Pages ve güvenlik

- Vite base.
- Base-aware public asset yolları.
- Cache stratejisi.
- Pages workflow.
- CSP ve dış kaynak allowlisti.
- Secret/history scan.

## Faz 4 — Lisans, atıf ve sunum

- Harita üstü attribution.
- NOTICE/ATTRIBUTIONS ve DATA_SOURCES.
- README, SECURITY, metodoloji.
- Public ürün dili ve uyarılar.
- SEO metadata.

## Faz 5 — Performans ve UX

- 3D lazy-loading.
- Bundle ölçümü.
- Büyük grid veri stratejisi.
- Error/fallback durumları.
- Responsive ve erişilebilirlik.

## Faz 6 — Tam doğrulama ve yayın

- Unit/component/smoke.
- Production preview.
- Pages alt yol.
- Mobil/desktop.
- Console/network/CSP.
- Dist scan.
- CI run.
- Canlı Pages URL smoke.

Her fazdan sonra diff ve test sonucunu incele. Tüm fazları tek devasa, gözden geçirilemez commit halinde uygulama.

---

# 20. Yapılmaması gerekenler

- Mevcut özellikleri “public repo” gerekçesiyle topluca silme.
- Editörleri kaldırıp gelecek veri güncelleme yolunu yok etme.
- Frontend parolasını gerçek güvenlik gibi sunma.
- Her koordinatı otomatik olarak iki ondalığa yuvarlama.
- Kamuya açık teknik terimleri sır sanıp eğitim içeriğinden çıkarma.
- Lisans kontrolü yapmadan veriyi serbestçe yeniden dağıtılabilir kabul etme.
- React build hatasında eski HTML'e sessiz fallback yapma.
- Legacy HTML'i ana kaynak olarak geliştirmeye devam etme.
- Aday sayısı, ID veya tipleri UI'da hard-code etme.
- LocalStorage şemasını migrasyonsuz bozma.
- Kullanıcı değişikliklerini resetleme veya üzerine yazma.
- Kullanıcı onayı olmadan ücretli/token gerektiren harita servisi ekleme.
- Test yokken “production ready” deme.
- Bundle uyarısını limit yükselterek görünmez yapıp performans sorununu çözülmüş sayma.
- GitHub Pages'in desteklemediği headerları varmış gibi belgeleme.
- README'de demo parolası veya gerçek secret yayımlama.
- Sadece source tarayıp `dist/` ve canlı Pages davranışını kontrol etmeden tamamlandı deme.

---

# 21. Beklenen dosya çıktıları

Gerçek ihtiyaca göre oluştur/güncelle; kullanılmayan boş dosya üretme:

- `app/src/App.tsx`
- `app/src/types/site.ts`
- `app/src/stores/useSiteStore.ts`
- `app/src/stores/useAdminStore.ts` veya yeniden adlandırılmış yerel çalışma store'u.
- `app/src/pages/AdminPage.tsx` veya yeniden adlandırılmış yerel çalışma sayfası.
- `app/src/pages/SiteEditorPage.tsx`
- `app/src/pages/ThreeDEditorPage.tsx`
- `app/src/hooks/useMapLibre.ts`
- `app/src/hooks/useCalcEngine.ts`
- `app/src/utils/layout.ts`
- `app/src/utils/` altında veri doğrulama/migrasyon/public URL yardımcıları.
- `app/src/components/` altında uyarı, attribution, error boundary ve fallback bileşenleri.
- `app/public/data.json`
- `app/public/grid_assets.json` veya türetilmiş public veri artifacti.
- `app/index.html`
- `app/vite.config.ts`
- `app/package.json`
- `app/package-lock.json`
- Test dosyaları ve fixture'lar.
- `.github/workflows/ci.yml`
- `.github/workflows/deploy-pages.yml`
- `.github/dependabot.yml`
- `README.md`
- `CHANGELOG.md`
- `NOTICE.md` veya `ATTRIBUTIONS.md`
- `DATA_SOURCES.md`
- `METHODOLOGY.md`
- `SECURITY.md`
- Kullanıcı onayladıysa `LICENSE`

Bir dosyayı değiştirmediysen sırf listeye uymak için dokunma.

---

# 22. Kabul kriterleri

İş ancak aşağıdaki maddelerin tamamı kanıtlanmışsa tamamlanır:

## Build ve yayın

- Temiz `npm ci` başarılı.
- TypeScript/build başarılı.
- Pages base path altında JS/CSS/favicon/data/grid 404 vermiyor.
- GitHub Actions resmi ve güncel action sürümleriyle çalışıyor.
- Yalnızca `app/dist` yayımlanıyor.
- Canlı Pages URL açılıyor.

## Özellikler

- PDHES eğitim içeriği çalışıyor.
- Aday veri listesi ve filtreler canonical tiplerle çalışıyor.
- Seçili saha ekranlar arasında senkron.
- Harita ve katman kontrolleri çalışıyor.
- 2D/3D arazi çalışıyor veya anlaşılır fallback gösteriyor.
- Three.js kavramsal yerleşim ve animasyonlar çalışıyor.
- Hesaplama/senaryo motoru çalışıyor.
- Tema/ayarlar çalışıyor.
- Yerel çalışma alanında içerik, saha, import/export ve 3D yerleşim araçları korunmuş.
- Public görünüm gerçek admin güvenliği varmış gibi davranmıyor.

## Veri

- Şema runtime doğrulamalı.
- ID'ler benzersiz.
- Enumlar kod/veri/filtre/editör/test arasında aynı.
- Sayılar veri kaynağından türetiliyor.
- LocalStorage migrasyonu testli.
- Kök/public kopya drift'i önleniyor.
- Kaynak, güven ve doğrulama tarihleri belgeli.

## Güvenlik

- Gerçek secret yok.
- `admin123` veya benzeri sahte credential yok.
- LocalStorage/import içeriği güvenli render ediliyor.
- Import sınırlandırılmış ve doğrulanıyor.
- CSP gerçek dış kaynaklarla test edilmiş.
- Console'da CSP/uncaught error yok.
- Dist ve git geçmişi taraması raporlanmış.

## Lisans ve atıf

- Harita üzerinde sağlayıcı atıfları görünür.
- Kod/veri/doküman lisans durumu açık.
- NOTICE/ATTRIBUTIONS ve veri kaynakları belgesi mevcut.
- Yeniden dağıtımı belirsiz veri için karar/risk kaydı mevcut.
- Site resmi kurum uygulaması izlenimi vermiyor.

## Kalite

- Unit/component testleri başarılı.
- Production browser smoke başarılı.
- 390/768/1024/1440 responsive kontrolleri başarılı.
- Klavye/focus/kontrast temel kontrolleri başarılı.
- Network'te beklenmeyen 404/mixed content yok.
- Büyük bundle ve veri boyutu ölçülmüş; yapılan optimizasyon veya kalan borç raporlanmış.
- README ve changelog güncel.

---

# 23. Görev sonu raporu

Son yanıtı aşağıdaki sırayla ver:

1. **Sonuç:** Public Pages sürümü hazır mı, değil mi?
2. **Değişen dosyalar:** Her dosyanın amacı.
3. **Korunan özellikler:** Özellikle editör/3D/hesap/harita.
4. **Düzeltilen sorunlar:** Veri sözleşmesi, alt yol, güvenlik, atıf vb.
5. **Veri ve lisans kararları:** Silinen/genelleştirilen hiçbir şey varsa gerekçesi ve alternatifi.
6. **Doğrulama kanıtı:** Çalıştırılan komut ve gerçek sonuç.
7. **Tarayıcı QA:** Görünüm, console, network ve responsive sonuçları.
8. **Kalan sınırlamalar/borç:** Gizleme veya “tamam” diye geçiştirme yok.
9. **GitHub arayüzündeki son adım:** Settings → Pages → GitHub Actions ve canlı URL kontrolü.

Başarısız veya çalıştırılmamış kontrolü başarılı gibi raporlama. “Tamamlandı” demeden önce build, test, production preview ve mümkünse canlı Pages doğrulamasını yap.

---

# 24. Resmi referanslar

Uygulama anında güncelliklerini yeniden kontrol et:

- Vite statik deployment ve GitHub Pages:  
  `https://vite.dev/guide/static-deploy.html#github-pages`
- GitHub Pages custom workflows:  
  `https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages`
- GitHub Pages publishing source:  
  `https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site`
- MapLibre GL JS dokümantasyonu:  
  `https://maplibre.org/maplibre-gl-js/docs/`
- OpenStreetMap tile kullanım politikası:  
  `https://operations.osmfoundation.org/policies/tiles/`

Bu prompttaki örnek sürüm numaraları, CSP domainleri ve repo sayıları zamanla eskiyebilir. Son uygulayıcı resmi kaynakları ve gerçek repo durumunu doğrulamakla yükümlüdür.
