# Katkı Rehberi

## Başlangıç

```bash
cd app
npm ci
npm run dev
```

Değişiklik göndermeden önce:

```bash
npm run check
```

## Kod katkıları

- Aktif uygulama `app/` altındadır.
- Ağır harita/3D modüllerini lazy-load sınırlarının dışına taşımayın.
- Kullanıcı/import içeriğini `dangerouslySetInnerHTML` ile render etmeyin.
- Frontend'e secret veya gerçek parola koymayın.
- Yeni davranış için önce başarısız test, ardından en küçük uygulama değişikliği ekleyin.

## Veri katkıları

- Canonical `pdhesType`: `CLOSED_LOOP`, `OPEN_LOOP`, `SEA_WATER`, `PROTOTYPE`.
- ID benzersiz olmalıdır.
- Kaynak, doğrulama tarihi, yöntem, güven ve lisans notu eklenmelidir.
- Kavramsal değerler açıkça işaretlenmelidir.
- `npm run check:data` başarılı olmalıdır.

## Dokümantasyon

Harita sağlayıcısı veya veri kaynağı değişirse `NOTICE.md`, `DATA_SOURCES.md`, CSP ve attribution kodunu birlikte güncelleyin.
