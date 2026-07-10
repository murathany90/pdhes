# Yerel Çalışma Alanı ve 3D Editör Kullanım Rehberi

PDHES (Pompaj Depolamalı Hidroelektrik Sistemler) arayüzündeki kod altyapısı incelenerek hazırlanan bu rapor, "Yerel Çalışma Alanı" (Local Workspace) konseptinin nasıl çalıştığını, nasıl kapatılabileceğini ve yeni "3D Yerleşim Editörü"nün nasıl kullanılacağını açıklamaktadır.

---

## 1. Yerel Çalışma Alanı (Local Workspace)

### Nedir ve Nasıl Çalışır?
Yerel Çalışma Alanı, genel veri setini (`data.json`) bozmadan projeleri test etmenizi sağlayan tarayıcı tabanlı, izole bir düzenleme modudur.

Kod yapısına (özellikle `src/stores/useSiteStore.ts`) bakıldığında süreç şu şekilde işler:
- **Etkinleştirme:** URL'de `?editor=1` veya `#editor` bulunduğunda sistem bu moda geçer.
- **Veri Saklama:** Yaptığınız değişiklikler (örneğin `updateSite` ve `addSite` fonksiyonları ile) uygulamanın genel belleğine yazılmaz; tarayıcınızın `localStorage` depolama alanında `pspp-sites-v1` anahtarı altında tutulur.
- **Kalıcılık:** Sayfayı yenileseniz dahi yerel belleğe yazıldığı için taslak çalışmalarınız kaybolmaz.

### Neler Yapılabilir? (Örnekler)
1. **Sıfırdan Proje Ekleme:** Veritabanında olmayan yeni bir potansiyel saha belirleyip sisteme ekleyebilirsiniz.
2. **Kapasite ve Maliyet Simülasyonu:** Mevcut bir sahanın debisini, türbin verimliliğini veya net düşü yüksekliğini değiştirerek, sistemin finansal getiri (Amortisman, CAPEX) hesaplarını anlık test edebilirsiniz.
3. **Alternatif Senaryolar:** Aynı sahaya farklı su yolu (penstock) alternatifleri deneyip harita üzerinde nasıl durduğunu gözlemleyebilirsiniz.

### Yerel Çalışma Alanı Nasıl Kapatılır?
Sistemden çıkmak ve orijinal salt-okunur (read-only) verilere dönmek için:
1. **Ayarlar (Settings)** sekmesine gidin.
2. "Yerel çalışma alanı" isimli kartı bulun.
3. Kartın içerisindeki kırmızı renkli **"Yerel çalışma alanını kapat"** tuşuna tıklayın.

*Kod seviyesinde olanlar (`SettingsPage.tsx`):*
Bu butona tıklandığında, sistem sizi URL'deki `?editor=1` eklentisini temizleyerek (`window.location.pathname` referansını kullanarak) yeniden yönlendirir. Editör modu parametresi kalktığı için sistem otomatik olarak yerel verileri gizler ve genel veritabanı ayarlarına döner.

---

## 2. 3D Yerleşim Editörü (Gelişmiş)

Çalışma alanı etkinken herhangi bir sahada "3D Yerleşim" seçeneğine tıkladığınızda karşınıza Gelişmiş 3D Editör (`ThreeDEditorPage.tsx`) çıkar.

### 3D Çizimler / Yerleşimler Değiştirilebilir mi?
**Evet, kesinlikle!** Hem de çok kapsamlı bir şekilde değiştirilebilir. 
Eski sistemdeki basit nokta kaydırma yapısının aksine; yeni editör sayesinde 3 boyutlu blokların yerlerinden ziyade, çoklu kırılıma sahip su tüneli rotalarını (`penstockRoute`), havuzları sınırlayan dev poligonları (`upperReservoirPolygon`), şalt sahalarını ve tesisin haritadaki bakış açısını dilediğiniz gibi değiştirebilirsiniz.

### Editör Nasıl Kullanılır?
1. **Haritadan Koordinat Alma:** Editör açıkken ekranın ortasındaki 3 boyutlu haritada herhangi bir yere tıklayın. Sol taraftaki **"Harita Etkileşimi"** kutusunda, tıkladığınız noktanın enlem ve boylamı (örneğin: `[30.456123, 40.123456]`) belirir. Altındaki "Kopyala" tuşuna basarak bu koordinatı panoya alabilirsiniz.
2. **JSON Verisini Düzenleme:** Sol alttaki siyah metin kutusu (JSON alanı), sahanın tüm geometrik ve harita verilerini tutar. 
   - Kopyaladığınız koordinatı, değiştirmek istediğiniz objenin (Örneğin: `powerhouse.point` veya `penstockRoute` dizisinin içi) yanına yapıştırın.
3. **Uygula (Test Etme):** "Uygula" butonuna bastığınızda, yazdığınız JSON anında derlenerek (parse) yandaki haritaya yansır. Boruların yer değiştirdiğini veya tünel ağzının yeni konumuna geçtiğini görebilirsiniz.
4. **Kaydet ve Dışa Aktar:** 
   - **Kaydet:** Değişikliklerinizi tarayıcınıza kalıcı olarak işler.
   - **Kopyala:** Oluşturduğunuz mükemmel yerleşimin tüm kodunu kopyalar. Daha sonra bu kodu yazılımcıya iletebilir veya doğrudan projenin ana `data.json` verisine yapıştırarak projeyi güncelleyebilirsiniz.
