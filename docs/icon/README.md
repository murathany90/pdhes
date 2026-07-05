# TR_PDHES_Potansiyel Icon Pack

Bu paket, GitHub Pages üzerinde çalışan Vite/React tabanlı TR_PDHES_Potansiyel sitesi için hazırlanmış ikon setidir.

## Klasör yapısı

- `public/favicon.ico`
- `public/favicon-16x16.png`
- `public/favicon-32x32.png`
- `public/favicon-48x48.png`
- `public/apple-touch-icon.png`
- `public/site.webmanifest`
- `public/icons/icon-16x16.png` ... `icon-1024x1024.png`
- `public/icons/maskable-icon-192x192.png`
- `public/icons/maskable-icon-512x512.png`
- `index-head-snippet.html`

## Kullanım

1. Zip içindeki `public/` klasörünün içeriğini projenizdeki `app/public/` klasörüne kopyalayın.
2. `index-head-snippet.html` içindeki satırları `app/index.html` dosyasında `<head>` içine ekleyin.
3. Vite kullanıldığı için `%BASE_URL%` ifadesi GitHub Pages alt yolu `/TR_PDHES_Potansiyel/` için doğru şekilde çözülecektir.

## Önerilen dosyalar

- Favicon için: `favicon.ico`, `favicon-32x32.png`, `favicon-16x16.png`
- Mobil ana ekran için: `apple-touch-icon.png`, `icon-192x192.png`, `icon-512x512.png`
- PWA için: `site.webmanifest`, `maskable-icon-192x192.png`, `maskable-icon-512x512.png`
