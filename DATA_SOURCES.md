# Veri Kaynakları ve Yeniden Dağıtım Notları

## Aday saha verisi

Canonical public dosya `app/public/data.json` dosyasıdır. Kayıtlar; kaynak bazlı bilgiler, GIS/DEM çıkarımları ve kavramsal demo varsayımlarının birleşimidir.

Başlıca referans alanları:

- JICA rapor sayfaları: `openjicareport.jica.go.jp`, `jica.go.jp`
- OpenStreetMap: `openstreetmap.org`
- AFAD: `afad.gov.tr`
- MTA Yerbilimleri: `yerbilimleri.mta.gov.tr`
- Copernicus Data Space: `dataspace.copernicus.eu`
- NASA: `science.nasa.gov`

Her kayıt için `confidence`, `locationConfidence`, `verifiedAt`, `verificationNotes` ve `locationEvidence` alanları kullanılmalıdır. Bir değer resmi kaynakla doğrulanmadıysa UI'da kesin mühendislik sonucu gibi sunulmamalıdır.

## Şebeke verisi

`app/public/grid_assets.json`, `docs/YTBS_Detayli_Harita (3).kml` dosyasından türetilmiş 3.933 feature içeren GeoJSON veri setidir.

Önemli yayın notu:

- Kaynağın yeniden dağıtım şartları repo içinde kesin bir lisans metniyle belgelenmemiştir.
- Public Pages yayını öncesinde veri sahibinin kullanım ve yeniden dağıtım koşulları repository sahibi tarafından doğrulanmalıdır.
- Gerekirse ham geometri yerine lisansı açık kaynaktan yeniden üretilmiş veya genelleştirilmiş bir public türev kullanılmalıdır.
- Bu belirsizlik çözülmeden veri “TEİAŞ tarafından doğrulanmış canlı sistem verisi” olarak tanıtılmamalıdır.

## Harita ve DEM

Aktif harita sağlayıcıları ve attribution metinleri `app/src/utils/mapProviders.ts` içinde tek noktadan yönetilir. Sağlayıcı URL veya koşulu değişirse kod, CSP, `NOTICE.md` ve bu dosya birlikte güncellenmelidir.

## Katkı kuralı

Yeni bir saha veya alan ekleyen değişiklik şu bilgileri sağlamalıdır:

1. Kaynak adı ve URL.
2. Erişim/doğrulama tarihi.
3. Çıkarım yöntemi.
4. Güven seviyesi.
5. Lisans/yeniden dağıtım notu.
6. Kavramsal değerlerin açık işareti.
