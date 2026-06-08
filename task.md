# Modern Frontend Geçiş — Görev Takip

## Faz 1: Proje İskeleti
- [ ] Vite + React + TypeScript projesi oluştur (`app/` dizininde)
- [ ] Bağımlılıkları yükle (zustand, maplibre-gl, react-router-dom)
- [ ] Mevcut veri dosyalarını `app/public/` altına kopyala
- [ ] TypeScript tip tanımları oluştur (`types/site.ts`)

## Faz 2: Tasarım Sistemi ve Yardımcılar
- [ ] Mevcut CSS'i `index.css`'e taşı
- [ ] Yardımcı fonksiyonları oluştur (`utils/`)
- [ ] Sabit verileri taşı (`constants.ts`)

## Faz 3: State Yönetimi
- [ ] `useSiteStore.ts` — site verileri ve seçim
- [ ] `useSettingsStore.ts` — tema ve ayarlar
- [ ] `useAdminStore.ts` — admin kimlik doğrulama ve içerik

## Faz 4: UI Bileşenleri
- [ ] Layout bileşenleri (TopBar, TabNav, PageShell)
- [ ] UI bileşenleri (Card, Metric, Tag, Button, vb.)

## Faz 5: Sayfa Bileşenleri
- [ ] DataPage (Datalar)
- [ ] CalcPage (Hesaplamalar)
- [ ] MapPage (Harita)
- [ ] ThreeDPage (3D Gösterim)
- [ ] PdhesPage (PDHES NEDİR — ansiklopedi)
- [ ] AdminPage (Yönetim paneli)
- [ ] SiteEditorPage (PSPP ekleme/düzenleme)
- [ ] ThreeDEditorPage (3D layout editörü)
- [ ] SettingsPage (Ayarlar)

## Faz 6: Hooks ve Entegrasyon
- [ ] `useMapLibre.ts` — harita hook'u
- [ ] `useCalcEngine.ts` — hesaplama hook'u
- [ ] `useLayoutBuilder.ts` — 3D layout hook'u

## Faz 7: Doğrulama
- [ ] Dev server çalıştırma testi
- [ ] Tüm sekmelerin açılma testi
- [ ] Build testi
