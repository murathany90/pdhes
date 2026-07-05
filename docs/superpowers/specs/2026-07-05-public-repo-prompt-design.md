# Public Repo Ana Geliştirme Promptu Tasarımı

## Amaç

`public_repo.md`, halihazırda public olan PDHES reposunu GitHub Pages üzerinde güvenli, sürdürülebilir ve özellik kaybı olmadan yayımlamaya hazırlayacak ana agent talimatı olacaktır.

## Karar

Public site iki açık davranış katmanına ayrılır:

- Varsayılan public görüntüleyici; eğitim, aday karşılaştırma, harita, kavramsal 3D ve senaryo hesaplarını sunar.
- URL ile bilinçli olarak açılan yerel çalışma alanı; içerik, saha ve yerleşim düzenleme/import/export işlevlerini yalnızca kullanıcının tarayıcısında yürütür. Bu yüzey gerçek kimlik doğrulamalı bir admin paneli olarak tanıtılmaz.

Sahte istemci parolası kaldırılır fakat yerel düzenleme yetenekleri topluca silinmez. Veri veya özellik kaldırma kararı ancak lisans, kaynak doğruluğu, kişisel veri, gerçek sır veya somut güvenlik riski kanıtıyla verilir. Öncelik mümkün olduğunda genelleştirme, özellik kapısı, veri dönüşümü veya public türev veri üretimidir.

## Prompt kapsamı

Prompt şu başlıkları kapsar:

- Repo ve git geçmişi envanteri, kullanıcı değişikliklerini koruma ve kanıt kaydı.
- Mevcut React/Vite uygulamasının tek yayın hedefi olması; eski HTML ve üretici betiklerinin arşiv statüsü.
- Mevcut özellik envanteri ve regresyon koruması.
- Public görüntüleyici ile yerel çalışma alanı ayrımı.
- Veri sözleşmesi, şema doğrulaması, sürümleme, migrasyon ve tek kaynak ilkesi.
- GitHub Pages alt yol desteği, güncel resmi Actions kurulumu ve CI.
- Kaynak/lisans/atıf, harita sağlayıcıları, CSP ve istemci güvenliği.
- Harita, 3D, hesaplama, performans, erişilebilirlik, responsive tasarım ve hata durumları.
- Mevcut bilinen uyumsuzlukların düzeltilmesi ve gelecek yol haritası.
- Otomatik kontroller, tarayıcı QA, dağıtım doğrulaması ve kabul kriterleri.

## Bilinen başlangıç bulguları

- `app/` build alıyor ancak ana JavaScript paketi yaklaşık 2,27 MB ve chunk uyarısı veriyor.
- Veri setinde 20 aday bulunmasına rağmen bazı görünür metinler 19 diyor.
- `pdhesType` enum değerleri; filtreler, editör, sabitler ve smoke testi arasında uyuşmuyor.
- `App.tsx` içindeki `/data.json` ve `/grid_assets.json` istekleri GitHub Pages proje alt yolunda kırılabilir.
- Vite `base` yapılandırması ve Pages workflow’u yok.
- `admin123` istemci tarafında güvenli olmayan bir yetki izlenimi oluşturuyor.
- Kullanıcı tarafından düzenlenebilen içerik `dangerouslySetInnerHTML` ile basılıyor.
- Harita sağlayıcı atıfları görünür değil ve attribution kontrolü kapalı.
- README, changelog, smoke testi ve eski dokümanlarda güncel uygulamayla çelişen sayılar ve durumlar var.

## Başarı ölçütü

Son prompt, sonraki agentın özellikleri koruyarak çalışmasını; varsayımları repo üzerinden doğrulamasını; güvenlik veya lisans bahanesiyle toplu silme yapmamasını; tamamlanmayı build, test, tarayıcı ve dağıtım kanıtıyla göstermesini zorunlu kılar.
