import type { ComponentDef } from '../types/site';

// WorldExample data is now in data/worldExamples.ts
export { WORLD_EXAMPLES } from '../data/worldExamples';
export type { WorldExample } from '../data/worldExamples';

export const COMPONENTS: ComponentDef[] = [
  { key: 'upper_reservoir', label: 'Üst Rezervuar', color: '#4aa3ff', description: 'Pompalama ile doldurulan ve üretim sırasında suyu aşağı veren yüksek kotlu rezervuar.' },
  { key: 'tunnel', label: 'Yeraltı Tüneli (Headrace)', color: '#888e95', description: 'Suyu üst rezervuardan denge bacasına taşıyan yatay veya hafif eğimli yeraltı tüneli.' },
  { key: 'surge_tank', label: 'Denge Bacası (Surge Tank)', color: '#ffd75a', description: 'Ani debi değişimlerinde oluşan su darbesini sönümleyen dikey hidrolik yapı.' },
  { key: 'penstock', label: 'Cebri Boru (Penstock)', color: '#ff7733', description: 'Yüksek basınçlı suyu türbine veya pompa-türbine taşıyan çelik ya da kompozit boru hattı.' },
  { key: 'powerhouse', label: 'Yeraltı Güç Evi (Powerhouse)', color: '#b277ff', description: 'Pompa-türbin, motor-jeneratör, vana ve yardımcı sistemlerin yer aldığı yeraltı tesisi.' },
  { key: 'tailrace', label: 'Kuyruksuyu (Tailrace)', color: '#36d6ff', description: 'Suyu santralden alt rezervuara veya denize boşaltan düşük basınçlı kanal/tünel.' },
  { key: 'lower_reservoir', label: 'Alt Rezervuar / Deniz Alımı', color: '#1fb6ff', description: 'Üretim sonrası suyun toplandığı, pompalama sırasında su kaynağı olarak kullanılan rezervuar veya doğal su kütlesi.' },
  { key: 'switchyard', label: 'Şalt Sahası (Switchyard)', color: '#48f49a', description: 'Üretilen enerjinin iletim şebekesine bağlanması için trafo ve koruma ekipmanlarının bulunduğu alan.' },
  { key: 'transmission', label: 'İletim Hattı (Grid Connection)', color: '#aaaaaa', description: 'Elektriği şalt sahasından ulusal şebekeye yüksek gerilimle taşıyan hat.' },
  { key: 'portal', label: 'Tünel Portalı', color: '#ff944d', description: 'Tünel giriş/çıkışını koruyan ve servis ulaşımı sağlayan yapı.' },
];

export const CONTENT_DEFAULTS: Record<string, unknown> = {
  home: {
    heroTitle: 'PDHES adaylarını harita, şebeke ve risk katmanlarıyla inceleyin.',
    heroSub: 'Bu açık demo, Türkiye’deki pompaj depolamalı hidroelektrik santral adaylarını karşılaştırmalı veri, kavramsal yerleşim ve eğitim içerikleriyle sunar.',
  },
  pdhesWhatIs: {
    title: 'Pompaj Depolamalı HES (PDHES) Nedir?',
    definitionTitle: 'Tanım ve Çalışma Prensibi',
    definitionBody: 'PDHES, elektrik talebinin düşük olduğu saatlerde suyu alt rezervuardan üst rezervuara pompalayan; talep ve fiyat yükseldiğinde aynı suyu türbinleyerek elektrik üreten büyük ölçekli enerji depolama teknolojisidir.',
    historyTitle: 'Kısa Tarihçe',
    turkeyTitle: 'Türkiye Girişimleri',
    benefitsTitle: 'Şebeke Hizmetleri',
    risksTitle: 'Çevresel ve Teknik Riskler',
    costsTitle: 'Maliyet ve Gelir Modeli',
  },
};

export const PDHES_TYPE_LABELS: Record<string, string> = {
  CLOSED_LOOP: 'Kapalı devre PDHES',
  OPEN_LOOP: 'Açık devre PDHES',
  SEA_WATER: 'Deniz suyu PDHES',
  PROTOTYPE: 'Prototip / pilot PDHES',
};

export const PDHES_TYPE_COLORS: Record<string, string> = {
  CLOSED_LOOP: '#48f49a',
  OPEN_LOOP: '#3d7dff',
  SEA_WATER: '#36d6ff',
  PROTOTYPE: '#b277ff',
};

export const GLOSSARY: { term: string; definition: string }[] = [
  { term: 'Düşü (head)', definition: 'Üst ve alt rezervuar arasındaki yükseklik farkı. Net düşü, hidrolik kayıplar düşüldükten sonra türbine kalan etkili yüksekliktir.' },
  { term: 'Cebri boru (penstock)', definition: 'Yüksek basınçlı suyu türbine veya pompa-türbine taşıyan çelik ya da kompozit boru hattı.' },
  { term: 'Denge bacası (surge tank)', definition: 'Ani debi değişimlerinde oluşan su darbesini sönümleyen dikey hidrolik yapı.' },
  { term: 'Yeraltı güç evi (powerhouse)', definition: 'Pompa-türbin, motor-jeneratör, vana ve yardımcı sistemlerin yer aldığı yeraltı tesisi.' },
  { term: 'Pompa-türbin (pump-turbine)', definition: 'Pompalama modunda suyu yukarı basan, üretim modunda türbin gibi çalışarak elektrik üreten tersinir makine.' },
  { term: 'Francis pompa-türbin (Francis pump-turbine)', definition: 'Orta ve yüksek düşülerde en yaygın kullanılan tersinir hidrolik makine tipi.' },
  { term: 'Çevrim verimi (round-trip efficiency)', definition: 'Pompalamada harcanan enerjinin üretim sırasında geri kazanılan kısmı. Modern tesislerde çoğunlukla yüzde 70-85 aralığındadır.' },
  { term: 'Aktif hacim (active storage)', definition: 'Enerji depolama çevriminde kullanılabilen su hacmi.' },
  { term: 'Alt rezervuar (lower reservoir)', definition: 'Üretim sonrası suyun toplandığı, pompalama sırasında su kaynağı olarak kullanılan rezervuar.' },
  { term: 'Üst rezervuar (upper reservoir)', definition: 'Pompalama ile doldurulan ve üretim sırasında suyu aşağı veren yüksek kotlu rezervuar.' },
  { term: 'Kapalı çevrim (closed-loop)', definition: 'Doğal nehir akışına sınırlı bağımlı, iki yapay veya ayrık rezervuar arasında çalışan PDHES düzeni.' },
  { term: 'Yarı açık çevrim (open-loop hybrid)', definition: 'Mevcut baraj, göl veya deniz gibi doğal ya da işletmedeki bir su kütlesinden yararlanan düzen.' },
  { term: 'Deniz suyu PDHES (seawater pumped storage)', definition: 'Denizi alt rezervuar olarak kullanan, korozyon ve deniz ekolojisi açısından özel tasarım isteyen PDHES tipi.' },
  { term: 'Şalt sahası (switchyard)', definition: 'Üretilen enerjinin iletim şebekesine bağlanması için kesici, ayırıcı, trafo ve koruma ekipmanlarının bulunduğu alan.' },
  { term: 'Trafo merkezi (substation)', definition: 'Gerilim seviyesini dönüştüren ve enerji akışını yöneten şebeke tesisi.' },
  { term: 'İletim hattı (transmission line)', definition: 'Elektriği yüksek gerilimle uzun mesafeye taşıyan hat.' },
  { term: 'N-1 güvenlik kriteri (N-1 criterion)', definition: 'Şebekedeki tek bir kritik eleman devre dışı kaldığında sistemin çalışmaya devam edebilmesi şartı.' },
  { term: 'Kısa devre gücü (short-circuit strength)', definition: 'Bağlantı noktasının arıza akımlarına ve büyük güç değişimlerine karşı elektriksel dayanım göstergesi.' },
  { term: 'Primer frekans kontrolü (primary frequency control)', definition: 'Şebeke frekansındaki ani sapmalara saniyeler içinde otomatik tepki veren hizmet.' },
  { term: 'Sekonder frekans kontrolü (secondary frequency control)', definition: 'Primer tepki sonrası frekansı hedef değere yaklaştıran daha yavaş dengeleme hizmeti.' },
  { term: 'Reaktif güç desteği (reactive power support)', definition: 'Gerilim kararlılığı için şebekeye verilen veya şebekeden çekilen reaktif güç hizmeti.' },
  { term: 'Kara başlatma (black-start)', definition: 'Şebeke enerjisiz kaldığında santralin dış kaynak olmadan devreye girip sistemi canlandırabilme yeteneği.' },
  { term: 'Senkron atalet (synchronous inertia)', definition: 'Dönen makinelerin kinetik enerjisiyle frekans değişimlerini doğal olarak yavaşlatması.' },
  { term: 'Enerji arbitrajı (energy arbitrage)', definition: 'Düşük fiyatlı saatlerde pompalayıp yüksek fiyatlı saatlerde üretim yaparak gelir elde etme yaklaşımı.' },
  { term: 'Yenilenebilir kısıntı (renewable curtailment)', definition: 'Şebeke veya talep kısıtı nedeniyle güneş ve rüzgar üretiminin azaltılması.' },
  { term: 'Dengeleme Güç Piyasası (balancing market)', definition: 'Gerçek zamanlı arz-talep dengesizliklerini gidermek için işletilen piyasa mekanizması.' },
  { term: 'Kapasite mekanizması (capacity mechanism)', definition: 'Güvenilir emre amade kapasite için yapılan ek ödeme veya teşvik düzeni.' },
  { term: 'Yatırım harcaması (CAPEX)', definition: 'Rezervuar, tünel, cebri boru, güç evi, elektromekanik ekipman, şalt, yol ve izin maliyetlerini kapsayan toplam kurulum harcaması.' },
  { term: 'İşletme gideri (OPEX)', definition: 'Bakım, personel, enerji tüketimi, izleme, sigorta ve yenileme gibi yıllık işletme giderleri.' },
  { term: 'Basit geri ödeme (payback)', definition: 'Toplam yatırım harcamasının yıllık net gelire bölünmesiyle bulunan yaklaşık süre.' },
  { term: 'Ağırlıklı sermaye maliyeti (WACC)', definition: 'Borç ve öz kaynak maliyetlerinin proje finansmanındaki ağırlıklarına göre ortalaması.' },
  { term: 'Jeoteknik etüt (geotechnical survey)', definition: 'Kaya kalitesi, fay, karst, heyelan ve yeraltı suyu risklerini araştıran saha çalışması.' },
  { term: 'Çevresel Etki Değerlendirmesi (EIA)', definition: 'Projenin doğa, su, toplum ve arazi kullanımı üzerindeki etkilerini inceleyen izin süreci.' },
  { term: 'Ekolojik akış (environmental flow)', definition: 'Nehir veya su ekosisteminin sağlığı için korunması gereken minimum akış.' },
  { term: 'Korozyon (corrosion)', definition: 'Özellikle deniz suyu projelerinde metal ekipmanın tuzlu ortam nedeniyle bozulması.' },
  { term: 'Biyolojik birikim (biofouling)', definition: 'Deniz canlılarının boru, ızgara ve ekipman yüzeylerinde birikerek hidrolik performansı azaltması.' },
  { term: 'Sızdırmazlık kaplaması (geomembrane lining)', definition: 'Üst rezervuarda su kaybını azaltmak için kullanılan HDPE veya benzeri kaplama sistemi.' },
  { term: 'Tünel delme makinesi (TBM)', definition: 'Uzun tünelleri dairesel kesitte ve sürekli ilerlemeyle açan makine.' },
  { term: 'Yeni Avusturya tünel yöntemi (NATM)', definition: 'Kaya davranışına göre desteklenen, delme-patlatma ve püskürtme beton kullanan tünel yöntemi.' },
  { term: 'Su darbesi (water hammer)', definition: 'Debinin hızla değişmesiyle boru ve tünellerde oluşan basınç dalgası.' },
  { term: 'Değişken hızlı ünite (variable-speed unit)', definition: 'Pompalama ve üretimde daha geniş işletme aralığı sağlayan motor-jeneratör düzeni.' },
  { term: 'Türbin yolu verimi (hydraulic efficiency)', definition: 'Suyun potansiyel enerjisinin mekanik ve elektrik enerjisine dönüşümündeki verim.' },
  { term: 'Rezervuar kotu (reservoir elevation)', definition: 'Rezervuar su seviyesinin deniz seviyesine göre yüksekliği.' },
  { term: 'Kamulaştırma riski (land acquisition risk)', definition: 'Arazi edinimi, mülkiyet, sosyal kabul ve bedel belirsizliklerinden kaynaklanan proje riski.' },
];
