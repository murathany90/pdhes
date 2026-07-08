# Katkı Rehberi

## Başlangıç

```bash
cd app
npm install
npm run dev
```

Değişiklik göndermeden önce:

```bash
npm run check
```

## Kod Katkıları

- Aktif uygulama `app/` altındadır.
- Ağır harita/3D modüllerini lazy-load sınırlarının dışına taşımayın.
- Kullanıcı/import içeriğini `dangerouslySetInnerHTML` ile render etmeyin.
- Frontend'e secret veya gerçek parola koymayın.
- Yeni davranış için önce başarısız test, ardından en küçük uygulama değişikliği ekleyin.

## Veri Katkıları

- Aktif Türkiye aday listesi `app/public/data.json` içinde tam 20 kayıt olmalıdır: 16 `JICA_EIE_16` + 4 `SEA_WATER_PROTOTYPE_TOP4`.
- Presenzano Türkiye aday listesine eklenmemelidir; dünya örneği olarak `WORLD_EXAMPLES` içinde tutulur.
- Yeni kayıtlarda `sourceGroup`, `capacityMW`, `projectFlowCms`, `headM`, `technicalClassification`, `coordinates`, `risks`, `assumptions`, `model3d` alanları kullanılmalıdır.
- Eski `pdhesType`, `concept`, `conceptLabel`, üst seviye `lat/lon`, `powerMW`, `capexBn`, `revenueM` alanları kullanılmamalıdır.
- JICA/EİE koordinatları canlı doğrulama yapılmadıkça `fallback-approximate` kalmalıdır.
- Yerel workspace export/import formatı yalnızca `schemaVersion: 3` destekler; eski düz array veya v1/v2 yedekleri kabul edilmez.
- `npm run check:data` başarılı olmalıdır.

## Dokümantasyon

Harita sağlayıcısı veya veri kaynağı değişirse `NOTICE.md`, `DATA_SOURCES.md`, CSP ve attribution kodunu birlikte güncelleyin. `docs/legacy` tarihsel arşivdir; aktif veri sözleşmesi için kaynak kabul edilmemelidir.
