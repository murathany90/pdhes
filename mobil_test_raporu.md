# Mobil Uyum Test Raporu — TR_PDHES_Potansiyeli

**Test edilen uygulama:** `https://murathany90.github.io/TR_PDHES_Potansiyel/#/pdhes`
**Hedef çözünürlük:** 390 × 844 (iPhone 12/13 emülasyonu)
**Test tarihi:** 07.07.2026
**Test yöntemi:** Kaynak kod analizi (`index.css`, `App.tsx`, `PdhesPage.tsx`, `TopNav.tsx`, `SectionNav.tsx` ve diğer bileşenler) + dist CSS doğrulaması

---

## 1. ÜST MENÜ (TopNav / TopBar)

### 1.1. Başlık ve Alt Başlık (`.brand`)

| Kontrol | Durum | Açıklama |
|---------|-------|----------|
| Başlık uzunluğu | ⚠️ **Risk** | `h1` metni: *"Türkiye Pompaj Depolama HES (PDHES) Potansiyeli"* (47 karakter). `700px` altında `font-size: 15px` ve `overflow-wrap: anywhere` ile kırılıyor ancak 390px’de 3+ satıra taşarak dikey alanı şişiriyor. |
| Alt başlık | ⚠️ **Risk** | `p` etiketi *"PDHES Eğitim ve Ön İnceleme"* — 390px’de başlıkla birlikte yüksek bir `.brand` bloğu oluşturuyor. |
| Logo | ✅ **Uygun** | `width: 40px; height: 40px` (700px altında), `flex-shrink: 0` değil ama sıkıştırılmıyor. |

**Öneri:** Başlık kısaltılabilir veya `h1` için `font-size` daha küçük bir `clamp()` değerine çekilebilir (`clamp(13px, 4vw, 17px)` gibi). Logo `flex-shrink: 0` almalı.

### 1.2. Global Kontroller (`.global-controls`)

| Kontrol | Durum | Açıklama |
|---------|-------|----------|
| SiteSelector dropdown | ✅ **Uygun** | 700px altında `grid-column: 1 / -1`, tam genişlik. |
| "Haritada incele" butonu | ✅ **Uygun** | Aynı şekilde `grid-column: 1 / -1`. |
| Tema butonu + Ayarlar | ⚠️ **Sıkışık** | 700px altında 2 sütunlu grid’in ikinci satırını paylaşıyorlar. `min-width: 0` ve `width: 100%` var, ancak buton içindeki yazılar ("Açık tema", "Ayarlar") + ikonlar 390px’de taşabilir. |
| Genel taşma | ⚠️ **Sınırda** | `.global-controls` grid `grid-template-columns: repeat(2, minmax(0, 1fr))` — ikinci satırda iki buton yan yana; 390px'de buton iç metinleri kırpılabilir. |

**Öneri:** `@media (max-width: 480px)` eşiğinde buton metinlerini gizleyip yalnızca ikon göster ("Açık tema" → sadece güneş/ay ikonu, "Ayarlar" → sadece çark ikonu). `utility-label` class'ı zaten mevcut (`App.tsx:134`), CSS'de `display: none` yapılabilir.

---

## 2. İÇİNDEKİLER (TOC) MENÜSÜ — SectionNav

### 2.1. Yatay Kaydırma (Horizontal Scroll)

| Kontrol | Durum | Açıklama |
|---------|-------|----------|
| Scroll davranışı | ✅ **Uygun** | `<700px`'de `.section-nav-list` `flex-direction: row` + `overflow-x: auto` ile yatay kaydırma çalışıyor. |
| Sticky konum | ✅ **Uygun** | `.encyclopedia-sidebar` `position: sticky; top: 0; z-index: 4` ile içerik kayarken sabit kalıyor. |

### 2.2. Alt Başlıklar (SSS — 10 adet `.sub`)

| Kontrol | Durum | Açıklama |
|---------|-------|----------|
| Metin uzunluğu | ❌ **Sorun** | Alt başlıklar çok uzun (örn: *"10. Bir PDHES sahası değerlendirilirken hangi riskler incelenmelidir?"* ~70 karakter). `white-space: nowrap` ile tek satır pill butona dönüşüyor, bu da 400+ piksel genişlik oluşturuyor. |
| Yatay scroll mesafesi | ❌ **Sorun** | 10 alt başlığın her biri ~400px genişliğinde → toplam ~4000px scroll alanı. Kullanıcı deneyimi zayıf. |
| Padding/hizalama | ⚠️ **Tutarsız** | `.section-nav a.sub` mobilde `padding-left: 11px` alıyor. Oysa yatay `flex-direction: row` düzende sol padding gereksiz — buton metni ortalanmamış görünüyor. |
| `.section-nav-title` gizleme | ✅ **Uygun** | `700px` altında `display: none` — gereksiz yer kaplamıyor. |

**Öneriler:**
- Alt başlık metinleri kısaltılmalı (örn: "1. PDHES nedir?", "10. Riskler nelerdir?" gibi).
- Alternatif olarak `<700px`'de alt başlıklar için `white-space: normal` ile çok satırlı pill veya `max-width` constraint eklenebilir.
- `.section-nav a.sub` için mobilde `padding-left: 11px` yerine simetrik padding (`padding: 8px 11px`) kullanılmalı.

---

## 3. GENEL DÜZEN (LAYOUT) VE KARTLAR

### 3.1. Breakpoint Tutarsızlığı: 700px vs 680px

| Durum | Açıklama |
|-------|----------|
| ❌ **Tutarsızlık** | Ana uygulama `@media (max-width: 700px)` kullanırken PDHES ansiklopedisi `@media (max-width: 680px)` kullanıyor. 680–700px aralığında (ör. 690px genişlik) çatışma: genel layout mobil olurken PDHES içeriği hâlâ tablet düzeninde kalıyor. |

**Öneri:** PDHES ansiklopedisi breakpoint'i 680px → 700px ile aynı yapılmalı veya tüm breakpoint'ler `700px` altında tek bir tutarlı eşikte birleştirilmeli.

### 3.2. Grid ve Kart Düzenleri

| Kontrol | Durum | Açıklama |
|---------|-------|----------|
| `.hero-stats` (4 sütun) | ✅ **Uygun** | 680px'de `1fr`'a düşüyor. |
| `.note-grid` (3 sütun) | ✅ **Uygun** | 680px'de `1fr`'a düşüyor. |
| `.note-grid.four` (4 sütun) | ✅ **Uygun** | 680px'de `1fr`'a düşüyor. |
| `.split-box` / `.comparison-mini` | ✅ **Uygun** | 680px'de 1 sütun. |
| `.check-flow` (3 sütun) | ✅ **Uygun** | 680px'de 1 sütun. |
| `.rich-list.compact` | ✅ **Uygun** | 1050px'de 1fr, mobilde zaten dikey. |
| `.type-grid` (3 sütun) | ✅ **Uygun** | 1050px'de 1fr. |
| `.grid.cols-3` / `.cols-4` | ⚠️ **Geçiş** | 700px'de 1fr; 1180px'de 2 sütun — iyi bir kademeli yaklaşım. |
| `.encyclopedia-layout` | ✅ **Uygun** | 1050px'de `1fr` (sidebar + içerik alt alta). |
| `.pdhes-rich-shell .layout` | ✅ **Uygun** | 1050px'de `1fr`, TOC içeriğin üstüne çıkıyor. |

### 3.3. Yatay Kaydırma (Horizontal Scroll) Riski

| Element | Durum | Açıklama |
|---------|-------|----------|
| Tablolar (`<table>`) | ❌ **Sorun** | `table { min-width: 680px }` — 390px ekranda tablolar zorunlu olarak taşıyor. Kapsayıcı `.card:has(table)` `overflow-x: auto` ile çözülmüş olsa da UX zayıf: kullanıcı yatay kaydırma yapmak zorunda. |
| Sözlük tablosu | ⚠️ **Sınırda** | `PdhesPage.tsx:208`'de `overflow: auto; max-height: 400px` içinde tablo — hem dikey hem yatay scroll gerekebilir. |
| SectionNav (TOC) pill butonları | ⚠️ **Beklenen** | Yatay scroll tasarımın bilinçli bir parçası, ancak SSS alt başlıkları gereksiz uzun. |

**Öneri:** Tablolar için `<700px`'de alternatif bir kart/liste görünümü düşünülebilir. En azından `min-width: 680px` daha küçük bir değere çekilmeli (örn. `min-width: 360px`).

### 3.4. Kart Padding ve Metin Kırılması

| Kontrol | Durum | Açıklama |
|---------|-------|----------|
| `.info-card` padding | ✅ **Uygun** | 22px → 680px'de 18px. |
| `.pdhes-rich-shell` padding | ✅ **Uygun** | 24px → 680px'de 14px. |
| `overflow-wrap: anywhere` | ✅ **Uygun** | 700px'de başlık, kart, metrik ve site-item öğelerinde metin taşması önlenmiş. |
| `.big-title` font-size | ✅ **Uygun** | 32px → 700px'de 24px. |
| `h1` (hero) font-size | ✅ **Uygun** | `clamp(34px, 4vw, 64px)` — mobilde ~28px’e kadar düşüyor. |
| `h2` (encyclopedia) font-size | ✅ **Uygun** | 28px → 700px'de 22px. |

### 3.5. Görseller ve Figure Frame

| Kontrol | Durum | Açıklama |
|---------|-------|----------|
| Görsel genişliği | ✅ **Uygun** | `width: 100%` + `aspect-ratio: 16/8.94`. |
| Fullscreen butonu | ⚠️ **Sınırda** | 680px'de `position: static; display: block; width: calc(100% - 24px)` — işlevsel ama görsel tasarımı bozuyor. |
| Figcaption | ✅ **Uygun** | Metin kırılması `overflow-wrap: anywhere` ile korunuyor. |

---

## 4. DİĞER TESPİTLER

### 4.1. Modern Mobil Breakpoint Eksikliği

| Sorun | Açıklama |
|-------|----------|
| ❌ **Eksik** | Projede 390px (iPhone 12/13), 414px (iPhone Plus), 375px (iPhone SE) gibi modern mobil çözünürlükler için özel bir media sorgusu bulunmuyor. En dar eşik 680px/700px. |

**Öneri:** `@media (max-width: 480px)` veya `@media (max-width: 420px)` eşiği eklenmeli. Bu eşikte:
- TopNav buton metinleri gizlenip yalnızca ikon gösterilmeli
- Tablo font-size'ı küçültülmeli
- TOC alt başlık metinleri kısaltılmalı veya `white-space: normal` yapılmalı

### 4.2. CSS Spesifiklik ve Kapsülleme

| Sorun | Açıklama |
|-------|----------|
| ⚠️ **Dikkat** | Tüm CSS global `index.css` içinde, BEM veya CSS Modules kullanılmıyor. 800+ satırlık tek dosyada medya sorguları dağınık halde. İleride responsive düzenleme yapmak zorlaşabilir. |

---

## 5. ÖZET: HATA ve İYİLEŞTİRME LİSTESİ

| # | Bileşen | Sorun | Öncelik | Öneri |
|---|---------|-------|---------|-------|
| 1 | **TopNav** | Başlık 390px'de 3+ satıra taşıyor | Orta | `font-size`'ı `clamp(13px, 4vw, 17px)` yap, başlık metnini kısalt |
| 2 | **TopNav** | Tema/Ayarlar butonları 390px'de sıkışık | Yüksek | `<480px`'de buton metinlerini gizle, sadece ikon göster (`.utility-label { display: none }`) |
| 3 | **SectionNav** | SSS alt başlıkları çok uzun, pill butonlar aşırı geniş | **Kritik** | Alt başlık metinlerini kısalt veya `white-space: normal` yap |
| 4 | **SectionNav** | `.sub` mobilde `padding-left: 11px` asimetrisi | Düşük | Mobilde simetrik padding kullan |
| 5 | **Layout** | 700px / 680px breakpoint tutarsızlığı | Orta | PDHES breakpoint'ini 700px ile uyumlu hale getir |
| 6 | **Tablolar** | `min-width: 680px` mobilde yatay scroll'a zorluyor | Orta | Alternatif kart/liste görünümü veya `min-width` düşürme |
| 7 | **Genel** | 390px/414px/375px gibi modern mobil eşik yok | Yüksek | `@media (max-width: 480px)` ekle |
| 8 | **CSS** | Tek dosyada dağınık medya sorguları | Düşük | Modüler CSS yapısına geçiş düşünülebilir |

---

## 6. SONUÇ

Uygulama genel olarak responsive yapıdadır ve 700px altında temel işlevleri (grid tek sütuna düşürme, sticky TOC, overflow-wrap) yerine getirmektedir. Ancak **mobil deneyim açısından iki kritik sorun** bulunmaktadır:

1. **SectionNav alt başlıkları** (SSS): 10 adet uzun soru metni, yatay kaydırılabilir pill butonlara dönüştüğünde kullanılabilirlik zayıflıyor.
2. **Breakpoint eşleşmezliği**: Modern telefon çözünürlükleri (390–414px) için özel bir iyileştirme yapılmamış; mevcut en dar eşik (680/700px) bu cihazlarda suboptimal bir deneyim sunuyor.

Bu iki sorun giderildiğinde uygulama tüm mobil cihazlarda rahatça kullanılabilir hale gelecektir.
