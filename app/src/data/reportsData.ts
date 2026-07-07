export interface ReportItem {
  id: string;
  title: string;
  category: 'report' | 'summary' | 'news';
  author: string;
  publishDate: string;
  readTime: number;
  coverImage?: string;
  summary: string;
  content: string;
}

export const REPORTS_DATA: ReportItem[] = [
  {
    id: 'global-pdhes-inventory',
    title: 'Küresel PDHES Envanteri İçin Derin Araştırma Özeti',
    category: 'report',
    author: 'Sistem Araştırma Modülü',
    publishDate: '2026-07-07',
    readTime: 12,
    coverImage: '/pdhes-nedir/img-19.webp',
    summary: 'GEM, IHA ve DOE/ORNL kaynakları taranarak hazırlanan küresel pompaj depolamalı hidroelektrik santral mevcut durumu.',
    content: `# Küresel PDHES Envanteri İçin Derin Araştırma Özeti

Bu belge, **Global Energy Monitor (GEM)**, **Uluslararası Hidroelektrik Birliği (IHA)** ve **ABD Enerji Bakanlığı (DOE)** veritabanlarından elde edilen bilgilerle küresel pompaj depolamalı hidroelektrik santral (PDHES) mevcut durumu, ülke özetleri ve seçilmiş tesis analizlerini sunmaktadır.

## 1. Pompaj Depolamanın Ölçeği ve Büyümesi

IHA'nın **2024 Dünya Hidroelektrik Raporu**, pompaj depolamalı hidroelektrik santrallerin (PSH) küresel temiz enerji dönüşümünde oynadığı kritik rolü net bir şekilde ortaya koymaktadır. 

*   Rapor, **2023 yılında PSH kapasitesinin 6.5 GW artarak 179 GW'a** ulaştığını vurgulamaktadır.
*   Pompaj depolamanın günümüzde **küresel enerji depolamasının yaklaşık %90'ını** oluşturduğu tahmin edilmektedir.
*   Pompaj depolama, özellikle rüzgar ve güneş gibi değişken yenilenebilir enerji kaynaklarının şebekeye entegrasyonunda hayati bir rol oynamaktadır. Uzun süreli depolama sağlayabilen ve şebeke kararlılığı sunan yegane olgun teknolojidir.

> "Su bataryaları olarak da bilinen PSH, yenilenebilir enerjinin depolanmasında hacim ve süre olarak en güçlü alternatiftir."

## 2. Ülke Düzeyinde HES ve PDHES Kapasite Görünümü

Aşağıdaki tablo, Mart 2026 GEM güncellemelerine göre dünyada öne çıkan ülkelerin mevcut durumunu özetler. İşletmedeki pompaj depolama kapasitesinde **Çin**, ardından Japonya ve ABD gelmektedir. 

| Ülke | İşletmedeki PDHES (MW) | 
|---|---:|
| Çin | 68,313 |
| Japonya | 24,841 |
| Amerika Birleşik Devletleri | 20,102 |
| İtalya | 7,643 |
| Hindistan | 7,426 |
| İspanya | 6,128 |
| Avusturya | 5,987 |
| Almanya | 5,940 |

*Kaynak: GEM Top 20 Operating Hydropower Capacity, Mart 2026.*

## 3. Kapalı Çevrim PSH ve Çevresel Avantajlar

DOE'nin **PSH INNOVATION REPORT** belgesi, yeni PDHES tesislerinin yenilikçi yaklaşımlarını analiz etmektedir. Bu raporda dikkat çeken en önemli kavram **kapalı çevrim (closed-loop) sistemlerdir**.

Mevcut bir doğal su yoluna veya nehre sürekli bağlı olmayan bu sistemlerin getirdiği faydalar:
* Çevresel Etkilerin Azaltılması
* Konumlandırma Esnekliği
* Biyoçeşitliliğin Korunması

Türkiye'nin dağlık ve eğimli topografyası göz önüne alındığında kapalı çevrim PSH tesisleri çok büyük bir potansiyel barındırmaktadır.
`
  },
  {
    id: 'tr-pdhes-gelecegi',
    title: 'Türkiye\'nin PDHES Potansiyeli ve Yenilenebilir Enerji Entegrasyonu',
    category: 'summary',
    author: 'M. Yeniceli',
    publishDate: '2026-06-15',
    readTime: 5,
    coverImage: '/pdhes-nedir/img-17.webp',
    summary: 'Rüzgar ve güneş enerjisindeki dalgalanmaları dengelemek için Türkiye\'nin kapalı çevrim (closed-loop) pompaj depolama hidroelektrik santral ihtiyacının kavramsal analizi.',
    content: `## Türkiye'nin PDHES Stratejisi
    
Türkiye'nin yenilenebilir enerji kurulu gücü hızla artarken, baz yük ve dengeleme santrali ihtiyacı da kritik bir seviyeye ulaşmaktadır. Özellikle gece ve gündüz fiyat makasının açılması, lityum-iyon bataryaların kısa süreli (<4 saat) depolamaya uygun olması sebebiyle **Pumped Storage Hydropower (PDHES)** tesisleri uzun süreli (8+ saat) depolama için tek olgun teknolojidir.

### Pazar İhtiyacı
*   **Güneş Eğrisi (Duck Curve):** Gündüz oluşan üretim fazlası, akşam puantında yerini ani bir talep artışına bırakmaktadır.
*   **Yan Hizmetler:** Primer ve sekonder frekans kontrolünde PDHES'lerin esnekliği rüzgar dalgalanmalarını saniyeler içinde dengeleyebilir.

> Enerji arz güvenliği için Türkiye, önümüzdeki 10 yıl içerisinde en az 3000 MW PDHES kapasitesini devreye almalıdır.

### Kapalı Çevrim Avantajları
Açık çevrim projelere kıyasla kapalı çevrim (nehir sisteminden bağımsız) projeler:
1.  Daha az ÇED (Çevresel Etki Değerlendirmesi) engeline takılır.
2.  Balık göç yollarını etkilemez.
3.  Yüksek düşü (head) olan her topografyada konumlandırılabilir.
    `
  },
  {
    id: 'news-iem-update',
    title: 'Enerji Piyasasında Depolama Yatırımlarına Yönelik Yeni Düzenlemeler',
    category: 'news',
    author: 'Enerji Haber Merkezi',
    publishDate: '2026-07-01',
    readTime: 3,
    coverImage: '/pdhes-nedir/img-3.webp',
    summary: 'Enerji Piyasası Düzenleme Kurumu (EPDK), depolamalı santrallerin şebekeye entegrasyonunu hızlandıracak yeni teşvikleri duyurdu.',
    content: `# Yeni EPDK Kararı
    
Enerji Piyasası Düzenleme Kurumu (EPDK), depolama entegreli üretim tesislerine kapasite tahsisi sürecini hızlandıran ve teminat şartlarında kolaylık sağlayan yeni kararı Resmi Gazete'de yayımladı.

Bu karar ile birlikte rüzgar ve güneş enerjisi yatırımlarıyla birleşik çalışacak PDHES ve batarya projelerinin önü açılıyor.
    `
  }
];
