# PDHES Açık Repo Uygulama Durumu

Bu belge, `public_repo.md` kapsamındaki açık kaynak ve GitHub Pages hazırlığının
uygulama durumunu özetler. Dağıtılan tek uygulama `app/` klasöründeki Vite +
React uygulamasıdır. Kökteki eski tek HTML prototip yalnızca tarihsel referans
olarak korunur ve Pages paketine girmez.

## Uygulanan Mimari

- [x] Uygulama herkesin erişebildiği, salt okunur bir görüntüleyici olarak açılır.
- [x] İçerik, saha ve 3D yerleşim düzenleme araçları yalnızca `?editor=1` ile
  açılan **Yerel Çalışma Alanı** içinde sunulur.
- [x] Yerel çalışma alanı bir kimlik doğrulama veya gerçek yönetim paneli olarak
  tanıtılmaz; veriler yalnızca kullanıcının tarayıcısında tutulur.
- [x] Eski sahte parola ve admin oturumu aktif uygulamadan çıkarılmıştır.
- [x] Mevcut keşif, veri tablosu, harita, 3D yerleşim, hesaplama, içe/dışa
  aktarma ve yerel düzenleme yetenekleri korunmuştur.
- [x] Harita, 3D görünüm ve editörler ortak saha/yerleşim veri sözleşmesini
  kullanır.

## Veri Sözleşmesi ve Yerel Kayıt

- [x] Güncel veri seti 20 adayı içerir.
- [x] Kanonik PDHES tipleri `CLOSED_LOOP`, `OPEN_LOOP`, `SEA_WATER` ve
  `PROTOTYPE` olarak tekilleştirilmiştir.
- [x] Saha kimlikleri, tipleri, sayısal alanları, koordinatları ve yerleşimleri
  çalışma zamanında doğrulanır.
- [x] Eski tip adları kontrollü biçimde güncel tipe taşınabilir.
- [x] Yerel çalışma alanı dışa aktarımı `schemaVersion: 2` taşır; eski düz dizi
  kayıtları içe aktarılabilir.
- [x] Hatalı, aşırı büyük veya bozuk içe aktarımlar mevcut kayıtların üzerine
  yazılmaz.
- [x] Kök veri dosyalarıyla `app/public` kopyalarının bayt düzeyinde eşitliğini
  denetleyen komut eklenmiştir.

## Güvenlik, İçerik ve Şeffaflık

- [x] Yerel kullanıcı içeriği HTML olarak çalıştırılmaz; React metni olarak
  gösterilir.
- [x] Üretim HTML'inde kullanılan alan adlarıyla sınırlandırılmış bir CSP,
  açıklama, Open Graph ve referrer metadatası bulunur.
- [x] Uygulama genelinde eğitim/masaüstü ön inceleme kapsamı görünür biçimde
  belirtilir.
- [x] Harita sağlayıcı atıfları görünürdür ve sağlayıcı bilgileri tek yerde
  yönetilir.
- [x] `NOTICE.md`, `DATA_SOURCES.md`, `METHODOLOGY.md`, `SECURITY.md` ve
  `CONTRIBUTING.md` eklenmiştir.
- [x] `robots.txt` ve `llms.txt` yayın paketine dahildir.

## Dağıtım ve Bakım

- [x] Genel geliştirme için kök `base` değeri korunur.
- [x] GitHub Pages derlemesi `/TR_PDHES_Potansiyel/` alt yolunu kullanır.
- [x] Pull request ve ana dal kontrolleri için Node 22 tabanlı CI eklenmiştir.
- [x] Pages iş akışı yalnızca `app/dist` çıktısını yayımlar.
- [x] npm ve GitHub Actions güncellemeleri için Dependabot yapılandırılmıştır.
- [x] Harita, 3D, ayarlar ve yerel editör sayfaları ihtiyaç anında yüklenir.
- [x] İlk JavaScript paketi, ağır harita ve Three.js kodu ayrı parçalara
  alınarak önemli ölçüde küçültülmüştür.

## Otomatik Kontrol Sözleşmesi

`app/` içinde:

```powershell
npm ci
npm run check
npm audit --omit=dev --audit-level=moderate
```

Repo kökünde:

```powershell
node smoke_test.js
```

`npm run check`; TypeScript kontrolünü, Vitest testlerini, veri kopyası ve şema
kontrollerini, ardından üretim derlemesini çalıştırır.

## 2026-07-05 Doğrulama Kaydı

- [x] Temiz `npm ci`: 204 paket denetlendi, açık bulunmadı.
- [x] `npm run check`: 10 test dosyasında 35 test geçti; TypeScript, veri
  eşitliği/şeması ve üretim derlemesi başarılı oldu.
- [x] `npm audit --omit=dev --audit-level=moderate`: 0 açık.
- [x] `node smoke_test.js`: 20 adayın kanonik tip dağılımı ve 3.933 şebeke
  feature'ı doğrulandı.
- [x] Pages alt-yol önizlemesinde HTML, JavaScript, CSS, favicon, `data.json`
  ve `grid_assets.json` istekleri 404 vermedi; konsol hatasız kaldı.
- [x] 390, 768, 1024 ve 1440 px kontrollerinde yatay sayfa taşması görülmedi.
- [x] Public görünüm, `?editor=1` yerel çalışma alanı, kanonik veri filtreleri,
  harita katman/atıfları, 3D simülasyon ve hesaplama akışları tarayıcıda
  denetlendi.
- [x] Lighthouse: Accessibility 100, Best Practices 100 ve SEO 100.
- [x] Pages paketinde sahte credential/secret deseni ve kök-bağımlı
  `/data.json` veya `/grid_assets.json` yolu bulunmadı.

## Bilinçli Sınırlar ve Yayın Öncesi Sahip Kararları

- [ ] Kökte açık kaynak `LICENSE` dosyası yoktur. Proje sahibi uygun lisansı
  seçmeden kod için lisans varsayılmamalıdır.
- [ ] KML'den türetilen `grid_assets.json` verisinin yeniden dağıtım hakkı
  proje sahibi tarafından kaynak kayıtlarıyla doğrulanmalıdır.
- [ ] GitHub depo ayarlarında **Settings → Pages → Source: GitHub Actions**
  seçimi yapılmalıdır.
- [ ] Gerçek saha etüdü, güncel topoğrafya doğrulaması, bağlantı başvurusu,
  lisans/izin ve yatırım kararı verileri bu eğitim demosunun kapsamında değildir.
- [ ] Harita ve 3D modülleri ilk paketten ayrılmış olsa da kendi tembel yüklenen
  parçaları büyüktür; sonraki performans turunda daha ince bölünebilir.
- [ ] Kalıcı backend, gerçek kullanıcı hesabı ve çok kullanıcılı eşzamanlı
  düzenleme yoktur.

Bu sınırlar mevcut özelliklerin kullanımını engellemez; ancak veri lisansı ve
kod lisansı kararı tamamlanmadan repo “hukuken tamamen yayın hazır” olarak
etiketlenmemelidir.
