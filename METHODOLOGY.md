# Metodoloji ve Sınırlamalar

## Amaç

Uygulama, PDHES adaylarını eğitim ve masaüstü ön inceleme seviyesinde karşılaştırır. Sonuçlar fizibilite, yatırım kararı, resmi bağlantı görüşü veya mühendislik tasarımı değildir.

## Enerji hesabı

Kavramsal fiziksel enerji:

```text
E = ρ × g × H × V × η
```

Uygulama su yoğunluğu, yerçekimi, düşü, aktif hacim ve varsayılan verim üzerinden GWh ölçeği üretir. Brüt/net düşü, hidrolik kayıplar ve işletme rejimi detaylı proje modelinin yerini tutmaz.

## Ekonomik senaryo

CAPEX ve gelir değerleri demo veri setinden gelir. Kullanıcı çarpanları, yıllık çevrim ve yardımcı hizmet primiyle basit bir stres testi yapar. Gösterilen geri ödeme:

- İskonto oranı içermez.
- Finansman, vergi ve enflasyonu modellemez.
- İnşaat takvimi ve fiyat eskalasyonunu içermez.
- Gelir garantisi değildir.

## Skorlar

Topografya, şebeke, çevre, jeoloji, erişim ve piyasa skorları ön eleme göstergeleridir. Eksik veya düşük güvenli veri resmi uygunluk sonucu olarak yorumlanmamalıdır.

## Harita ve 3D

Harita yerleşimleri ile Three.js modelleri kavramsaldır. Özel saha poligonu bulunmayan kayıtlarda prosedürel geometriler kullanılır. Arazi tile kaynağı ve yükseklik abartısı görselleştirme amaçlıdır.

## Zorunlu sonraki çalışmalar

Nihai değerlendirme için en az parsel/mülkiyet, jeoteknik, hidroloji, topoğrafik ölçüm, çevresel izin, DSİ işletme rejimi ve resmi şebeke bağlantı etütleri gerekir.
