# Changelog

## 2026-07-05

- Public görüntüleyici ile `?editor=1` yerel çalışma alanı ayrıldı; sahte frontend admin parolası aktif uygulamadan kaldırıldı.
- Canonical PDHES tip sözleşmesi, runtime veri doğrulaması ve sürümlü import/export eklendi.
- GitHub Pages base-aware public asset yükleme ve Vite base yapılandırması eklendi.
- Kullanıcı tarafından düzenlenebilen içerik güvenli metin renderına geçirildi.
- Harita sağlayıcıları ve görünür attribution tek noktada toplandı.
- Harita, 3D ve düzenleme sayfaları lazy-load edilerek başlangıç paketi küçültüldü.
- Test altyapısı, CI/Pages workflow'ları, veri/metodoloji/güvenlik/katkı belgeleri eklendi.
- README aktif React uygulaması ve public repo modeliyle uyumlu hale getirildi.

## 2026-05-11

- Added `3D Gösterim` and `PDHES NEDİR` tabs.
- Migrated `data.json` to the typed PDHES schema with multi-point coordinates, confidence labels, old coordinate retention, and location evidence.
- Expanded the dataset from 10 to 19 candidates, including new macro/micro seawater and standalone closed-loop concepts.
- Added Admin Modu with localStorage content overrides, JSON export/import, reset, patch instructions, and editable content markers.
- Added type-aware calculations, map filters, approximate-location halos, old-coordinate points, and popup confidence metadata.
- Updated smoke tests, README, and sample content override JSON.

`grid_assets.json` was not changed.
