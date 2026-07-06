# PDHES Nedir - Orijinal site tasarımına uyumlu 10 kartlı içerik

Bu paket, pdhes sitesindeki `PDHES Nedir?` sekmesini zenginleştirmek için hazırlanmıştır.

## İçerik
- Solda sabit `İçindekiler` navigasyonu
- Sağda 10 ayrıntılı bilgi kartı
- Her kartta yüksek çözünürlüklü görsel
- Görseller için `Tam ekran oku`, yakınlaştır/uzaklaştır ve tarayıcı tam ekran özelliği
- Siteyle uyumlu koyu mavi/teal kart tasarımı
- Eğitim/ön inceleme amaçlı fizibilite uyarısı

## Entegrasyon
1. `assets/` klasörünü Vite projesinde `app/public/pdhes-nedir/` altına kopyalayın.
2. HTML içindeki `src="assets/..."` yollarını `/pdhes/pdhes-nedir/...` veya uygulamadaki base path mantığına göre güncelleyin.
3. React'e taşırken:
   - `class` -> `className`
   - modal JavaScript -> `useState` tabanlı modal bileşeni
   - `onclick` -> React `onClick`
4. İçeriği `app/src/pages/PdhesPage.tsx` içinde mevcut başlıkların yerine veya altına ekleyin.

## Not
Bu materyal eğitim ve ön inceleme amaçlıdır; kesin fizibilite, yatırım veya resmi kurum görüşü değildir.
