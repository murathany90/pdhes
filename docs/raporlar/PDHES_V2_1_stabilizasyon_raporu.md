# PDHES V2.1 Stabilizasyon Raporu

Tarih: 22 Eylül 2026

## 1. Tespit edilen hatalar ve kök nedenleri

- 3D `CameraTarget` yalnızca kameraya `lookAt` uyguluyor, `OrbitControls.target` ile aynı hedefi kullanmıyordu. Kamera sabit konumda kaldığı için tesis sınırları genişlediğinde model kadraj dışında kalabiliyordu.
- Footprint verisi yalnızca alanların dizi olup olmadığıyla doğrulanıyordu. Geçersiz, sonlu olmayan veya yetersiz koordinatlar 3D sınır/kamera hesaplarına taşınabiliyordu.
- OSM şebeke stilinde 300 kV üzerindeki tüm değerler 400 kV grubuna alınıyordu; 380 kV ve 400 kV nominal değerleri ayrışmıyordu.
- Proje şebeke trafo sembolü yalnızca metin `400` ile eşleştiği için sayısal `400` veya `400000` değerlerini aynı şekilde gösteremiyordu.

## 2. Uygulanan kod düzeltmeleri

- Kamera hedefi ve mesafesi footprint sınırlarından hesaplanıyor; tesis değiştiğinde kamera yeniden konumlanıyor ve aynı hedef `OrbitControls.target` ile kullanılıyor.
- Geçersiz footprint kayıtları plan dışında bırakılıyor; bozuk polygon/polyline geometrileri render edilmiyor.
- OSM şebekesinde 154, 380, 400 ve 500 kV üstü grupları ayrıştırıldı. Eski ayar depolarında eksik 380 kV ayarı varsayılan değerle tamamlanıyor.
- Proje şebeke filtreleri gerçek gerilim normalizasyonunu, çoklu gerilim değerlerini ve uyumlu MultiLineString/MultiPoint geometrilerini koruyor.
- Boş veya yüklenemeyen proje şebeke verisi için bildirim korunuyor; doğrulanmış veri yoksa sahte hat/trafo üretilmiyor.
- WebGL başlatılamadığında mevcut kullanıcı hata mesajı korunuyor.

## 3. Değiştirilen dosyalar

- `app/src/components/FabPopover.tsx`
- `app/src/components/ui/ThreeDModel.test.tsx`
- `app/src/components/ui/ThreeDModel.tsx`
- `app/src/hooks/useMapLibre.ts`
- `app/src/index.css`
- `app/src/pages/MapPage.tsx`
- `app/src/pages/ThreeDPage.tsx`
- `app/src/stores/useSettingsStore.ts`
- `app/src/stores/useSiteStore.ts`
- `app/src/utils/layout3dFootprints.test.ts`
- `app/src/utils/layout3dFootprints.ts`
- `app/src/utils/powerGrid.test.ts`
- `app/src/utils/powerGrid.ts`
- `docs/raporlar/PDHES_V2_0_stabilizasyon_raporu.md`
- `docs/raporlar/PDHES_V2_1_stabilizasyon_raporu.md`

## 4. Test sonuçları

- `npm run typecheck`: başarılı.
- `npm run test:run`: 44 test dosyası, 153 test başarılı.
- `npm run check:data`: başarılı; kanonik `data.json` ve `grid_assets.json` doğrulandı; 9 şema testi başarılı.
- `npm run build`: başarılı. Vite yalnızca mevcut büyük bundle boyutları için uyarı verdi.
- Hedefli grid/3D/harita testleri: 4 dosya, 30 test başarılı.

## 5. 3D gösterimin doğrulama durumu

Kamera hedefi, OrbitControls hedefi, otomatik kadraj ve geçersiz footprint korumaları kod/test düzeyinde doğrulandı. Yerel production build Chrome’da açıldı; bu çalışma ortamında WebGL context başlatılamadığı için GPU üzerinde modelin görsel render sonucu doğrulanamadı. Uygulama artık sessiz boş ekran yerine `WebGL başlatılamadı` mesajı gösteriyor.

## 6. Devam eden sorunlar

- `grid_assets.json` halen boş; doğrulanmış proje-özel hat/trafo geometrisi bulunmadığından sahte veri eklenmedi. Gerçek OSM şebeke katmanı ayrı kaynaktan kullanılmaya devam ediyor.
- WebGL destekli gerçek GPU ortamında 3D görsel doğrulama yapılması gerekiyor.
- Bu çalışma dalına push yapılacak; `main` dalına merge ve canlı production deploy yapılmayacak.
