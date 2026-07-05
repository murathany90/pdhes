# Güvenlik Politikası

## Bildirim

Bir güvenlik açığı bulursanız ayrıntıları public issue içinde paylaşmayın. GitHub Security Advisory özelliği açıksa özel bildirim kullanın; değilse repository sahibine özel kanaldan ulaşın.

Gerçek token, parola, anahtar, kişisel veri veya çalışan exploit çıktısını issue/PR/log içine eklemeyin.

## Güvenlik modeli

Bu uygulama statik GitHub Pages sitesidir:

- Frontend kaynakları ve `VITE_*` değerleri herkese açıktır.
- `?editor=1` yalnızca yerel araçları gösterir; kimlik doğrulama değildir.
- Yerel değişiklikler LocalStorage içinde kalır.
- Uygulamanın backend'i veya paylaşılan kullanıcı hesabı yoktur.

## Desteklenen sürüm

Yalnızca `main` branch'indeki aktif `app/` uygulaması güvenlik güncellemesi alır. Kök tek HTML prototipi legacy referanstır ve yayımlanmaz.

## Kontroller

```bash
cd app
npm ci
npm run check
npm audit --omit=dev --audit-level=moderate
```

Git geçmişine yanlışlıkla secret eklendiyse dosyayı silmek yeterli değildir; credential iptal edilmeli/rotate edilmeli ve geçmiş temizliği ayrıca planlanmalıdır.
