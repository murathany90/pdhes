# Türkiye PDHES Potansiyeli

Türkiye'deki pompaj depolamalı hidroelektrik santral (PDHES) adaylarını veri, harita, kavramsal 3D yerleşim, risk notları ve senaryo hesaplarıyla inceleyen açık web demosu.

> Bu uygulama yatırım tavsiyesi, fizibilite raporu, mühendislik tasarımı veya resmi TEİAŞ/DSİ/EPDK/ÇED görüşü değildir. Eğitim ve masaüstü ön inceleme demosudur. Koordinatlar, teknik değerler ve ekonomik varsayımlar kesin konum veya yatırım kararı olarak sunulmaz.

## Veri Kurgusu

`app/public/data.json` aktif Türkiye aday listesidir ve tam 20 kayıt içerir:

- 16 adet `JICA_EIE_16` kaynak grubu: JICA/EİE teknik aday kayıtları.
- 4 adet `SEA_WATER_PROTOTYPE_TOP4` kaynak grubu: mevcut deniz tipi prototipler içinden skorla seçilen `tasucu`, `bozyazi_anamur`, `karaburun`, `finike_kumluca`.
- Presenzano Türkiye adayı değildir; `app/src/data/worldExamples.ts` içindeki dünya örnekleri arasındadır.

Aktif `Site` sözleşmesi `app/src/types/site.ts` içindedir. Temel alanlar:

- `sourceGroup`
- `capacityMW`, `projectFlowCms`, `headM`
- `technicalClassification.cycleType`, `infrastructureType`, `conceptType`, `gridSupplyType`, `primaryPurpose`
- `coordinates.coordinateSystem`, `coordinateOrder`, `coordinateConfidence`, `mapAnchor`
- `risks`, `assumptions`, `model3d`

Eski `pdhesType`, `concept`, `conceptLabel`, üst seviye `lat/lon`, `powerMW`, `capexBn`, `revenueM` alanları aktif veri sözleşmesinde kullanılmaz ve validasyonda reddedilir.

## Uygulama

Yayındaki uygulama `app/` altında Vite + React + TypeScript ile geliştirilir.

- Harita: MapLibre GL
- 3D: Three.js, React Three Fiber, Drei
- Durum yönetimi: Zustand
- Veri: statik JSON ve istemci tarafı yükleme

Ana sayfalar:

- `PDHES Nedir`: teknoloji, sınıflandırma, riskler ve dünya örnekleri
- `Data`: 20 Türkiye adayının tablo ve detay görünümü
- `Harita`: aday işaretçileri, popup ve kavramsal tesis yerleşimi
- `3D`: seçili aday için temsilî tesis modeli
- `Settings`: görünüm, veri yönetimi ve senaryo hesabı
- `Workspace`: yalnızca `?editor=1` ile yerel düzenleme ve schemaVersion 3 export/import

## Kurulum

```bash
cd app
npm install
npm run dev
```

## Doğrulama

```bash
cd app
npm run typecheck
npm run test:run
npm run check:data
npm run build
npm run check
cd ..
node scripts/smoke_test.js
```

`npm run lint` tanımlıysa ayrıca çalıştırılmalıdır. Bu repoda lint scripti yoksa doğrulama raporunda açıkça belirtilir.

## Yayın

GitHub Pages build hedefi `app/dist` klasörüdür. Mevcut workflow tabanı `/pdhes/` olarak korunur.

## Sınırlamalar

- Canlı DEM/uydu doğrulaması bu demo içinde yapılmaz.
- JICA aday koordinatları `fallback-approximate` güven sınıfıyla gösterilir.
- 3D yerleşimler mühendislik çizimi değil, kavramsal görselleştirmedir.
- `docs/legacy` tarihsel arşivdir; aktif veri sözleşmesinin kaynağı olarak kullanılmaz.
