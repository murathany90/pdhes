# Türkiye Pompaj Depolamalı HES (PDHES) Potansiyeli

Türkiye’de pompaj depolamalı hidroelektrik santral adaylarını; harita, kavramsal 3D yerleşim, şebeke bağlantı katmanları, risk notları ve eğitim içerikleriyle inceleyen açık demo uygulama.

Bu çalışma kesin mühendislik veya fizibilite sonucu değildir. Koordinatlar ve teknik kabuller masaüstü ön eleme seviyesindedir; parsel, jeoteknik, TEİAŞ, DSİ ve ÇED teyidi gerekir.

## React Uygulaması

Uygulama `app/` klasöründeki Vite + React + TypeScript projesidir. Eski `pspp_yatirim_istihbarat_app.html` dosyası referans olarak korunur.

```bash
cd app
npm install
npm run dev -- --host 127.0.0.1
npm run build
```

Admin demo parolası: `admin123`

Yerel kayıt anahtarları:

- `pspp-theme`: tema tercihi
- `pspp-content-overrides-v1`: düzenlenen eğitim/içerik metinleri
- `pspp-sites-v1`: düzenlenen veya eklenen saha listesi
- `pspp-custom-sites-v1`: eski sürümden tek seferlik okunan aday saha kayıtları

## Ana Sekmeler

1. PDHES Nedir
2. Datalar
3. Harita
4. 3D Yerleşim
5. Hesaplamalar
6. Yönetim
7. Ayarlar

## İçerik

- `PDHES Nedir`: çalışma prensibi, Türkiye bağlamı, PDHES tipleri, 30+ dünya örneği, 40+ teknik terim sözlüğü ve sık sorular.
- `Datalar`: 19 varsayılan aday saha, skorlar, yatırım büyüklüğü, düşü (head), aktif hacim ve risk notları.
- `Harita`: aday sahalar, 154/380 kV hatlar, trafo merkezleri, risk alanı, su yolu ve kavramsal yerleşim katmanları.
- `3D Yerleşim`: üst rezervuar, alt rezervuar, cebri boru (penstock), denge bacası (surge tank), yeraltı güç evi (powerhouse) ve şalt sahası (switchyard) bileşen özeti.
- `Hesaplamalar`: yatırım gideri, yıllık gelir, çevrim sayısı ve yan hizmet primiyle görünür değerleri güncellenen senaryo hesabı.
- `Yönetim`: içerik düzenleme, yeni aday ekleme, saha düzenleme, saha silme, veri yedeği alma/yükleme ve 3D yerleşim düzenleme.
- `Ayarlar`: tema, harita görünümü, 3D yükseklik ölçeği ve skor ağırlıkları.

## Veri Dosyaları

- `app/public/data.json`: varsayılan PDHES adayları
- `app/public/grid_assets.json`: iletim hatları ve trafo merkezleri
- `content-overrides.sample.json`: içerik düzenleme yedeği örneği

## PDHES Tipleri

- Müstakil PDHES (kapalı çevrim)
- Yarı PDHES (mevcut rezervuar)
- Makro deniz PDHES
- Mikro deniz PDHES

## Sınırlamalar

- Harita ve 3D yerleşimler kavramsal ön inceleme içindir.
- Deniz suyu adayları kıyı izinleri, sızdırmazlık kaplaması, korozyon, biyolojik birikim (biofouling), turizm/görsel etki ve korunan alan riskleri taşır.
- Adaylar yatırım kararı için tek başına yeterli değildir; saha etüdü, bağlantı görüşü ve çevresel izin süreçleri gerekir.
