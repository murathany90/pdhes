# Türkiye PDHES Potansiyeli — Eğitim ve Ön İnceleme

Türkiye'deki pompaj depolamalı hidroelektrik santral adaylarını veri, harita, kavramsal 3D yerleşim, risk notları ve senaryo hesaplarıyla inceleyen açık web demosu.

> Bu uygulama yatırım tavsiyesi, fizibilite raporu, mühendislik tasarımı veya resmi TEİAŞ/DSİ/EPDK/ÇED görüşü değildir. Koordinatlar, teknik değerler, şebeke ilişkileri ve ekonomik varsayımlar kaynak bazlı, yaklaşık veya kavramsal olabilir.

## Aktif uygulama

Yayımlanan uygulama yalnızca `app/` altındaki Vite + React + TypeScript projesidir. Kök dizindeki tek HTML prototipi ve üretici betikleri tarihsel referanstır; GitHub Pages artifactine dahil edilmez.

Başlıca özellikler:

- PDHES eğitim içeriği, dünya örnekleri, sözlük ve SSS.
- Canonical kapalı devre, açık devre, deniz suyu ve prototip/pilot sınıfları.
- Aday saha filtreleme, karşılaştırma ve ortak saha seçimi.
- MapLibre tabanlı harita, 2D/3D arazi, hillshade ve kavramsal katmanlar.
- Three.js tabanlı kavramsal tesis yerleşimi ve üretim/pompalama animasyonu.
- Fiziksel enerji ve ekonomik senaryo hesapları.
- Tema ve görünüm ayarları.
- Sürüm kontrollü yerel saha/içerik import-export araçları.

## Public görüntüleyici ve yerel çalışma alanı

Normal URL public görüntüleyiciyi açar. İçerik, saha ve yerleşim düzenleme araçları:

```text
?editor=1
```

parametresiyle açılan **Yerel Çalışma Alanı** içindedir. Bu gerçek bir admin sistemi değildir; değişiklikler yalnızca ilgili tarayıcının LocalStorage alanında tutulur ve GitHub reposunu ya da ortak siteyi değiştirmez.

## Gereksinimler

- Node.js 22 LTS önerilir.
- Vite 8 için en az Node `20.19.0` veya `22.12.0`.
- npm ve kilitli `app/package-lock.json`.

## Geliştirme

```bash
cd app
npm ci
npm run dev -- --host 127.0.0.1
```

Kalite kapısı:

```bash
npm run check
npm audit --omit=dev --audit-level=moderate
```

Production önizleme:

```bash
npm run build
npm run preview -- --host 127.0.0.1
```

## Veri

- `app/public/data.json`: aday saha kayıtları.
- `app/public/grid_assets.json`: KML'den türetilmiş şebeke GeoJSON'u.
- `app/src/types/site.ts`: TypeScript veri sözleşmesi.
- `app/src/utils/siteSchema.ts`: runtime doğrulama ve legacy tip migrasyonu.

Yeni kayıtlar benzersiz ID, canonical `pdhesType`, kaynak/güven bilgisi ve geçerli koordinat/layout alanlarıyla eklenmelidir. Ayrıntılar [DATA_SOURCES.md](DATA_SOURCES.md) ve [METHODOLOGY.md](METHODOLOGY.md) içindedir.

## GitHub Pages

`.github/workflows/deploy-pages.yml`, `main` branch'ini `/TR_PDHES_Potansiyel/` taban yoluyla build eder ve yalnızca `app/dist` klasörünü yayımlar.

GitHub üzerinde:

1. Settings → Pages.
2. Source → **GitHub Actions**.
3. `main` push veya manuel `workflow_dispatch`.
4. Actions sonucundaki Pages URL'sini açıp kontrol edin.

Repo adı veya custom domain değişirse `VITE_BASE_PATH` ve Vite `base` davranışı güncellenmelidir.

## Lisans ve atıf

Üçüncü taraf yazılım ve harita atıfları [NOTICE.md](NOTICE.md) içindedir. Veri kaynakları ve yeniden dağıtım notları [DATA_SOURCES.md](DATA_SOURCES.md) içindedir.

Bu repo için proje lisansı henüz ayrıca seçilmemiştir. Public erişim, otomatik olarak yeniden kullanım lisansı vermez.

## Güvenlik ve katkı

- Güvenlik bildirimi: [SECURITY.md](SECURITY.md)
- Katkı kuralları: [CONTRIBUTING.md](CONTRIBUTING.md)
- Değişiklik geçmişi: [CHANGELOG.md](CHANGELOG.md)

Frontend içine secret, gerçek parola veya özel anahtar koymayın. `VITE_*` değerlerinin kullanıcıya gönderilen bundle içinde görünür olduğunu unutmayın.
