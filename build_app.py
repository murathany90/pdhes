import os, json
data_path = os.path.join(os.path.dirname(__file__), 'data.json')
grid_path = os.path.join(os.path.dirname(__file__), 'grid_assets.json')
with open(data_path, encoding='utf-8') as f: data_json = f.read()
with open(grid_path, encoding='utf-8') as f: grid_json = f.read()

out = os.path.join(os.path.dirname(__file__), 'pspp_yatirim_istihbarat_app.html')

html = r'''<!DOCTYPE html>
<html lang="tr" data-theme="dark">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Türkiye PSPP Yatırım İstihbaratı - Tek Sayfa Prototip</title>
  <link rel="stylesheet" href="https://unpkg.com/maplibre-gl@5.6.0/dist/maplibre-gl.css" />
  <script src="https://unpkg.com/maplibre-gl@5.6.0/dist/maplibre-gl.js"></script>
  <style>
    :root{
      --bg:#050807; --panel:#0b1210; --panel2:#101a17; --panel3:#13211d;
      --line:#20332e; --line2:#2b4d42; --text:#e8fff4; --muted:#8ca69b;
      --soft:#c9ffe0; --green:#48f49a; --green2:#20bf70; --cyan:#36d6ff;
      --blue:#3d7dff; --yellow:#ffd75a; --orange:#ff944d; --red:#ff5c73;
      --shadow:0 22px 60px rgba(0,0,0,.42); --radius:18px;
    }
    html[data-theme="light"]{
      --bg:#f3f6f4; --panel:#ffffff; --panel2:#f6f9f7; --panel3:#eef3f0;
      --line:#cddad4; --line2:#b5c9c0; --text:#0f1c18; --muted:#5a7268;
      --soft:#1a332a; --green:#0d9e5c; --green2:#0a7a47; --cyan:#0b8fc7;
      --blue:#2563eb; --yellow:#b8860b; --orange:#d97706; --red:#dc2626;
      --shadow:0 22px 60px rgba(0,0,0,.10);
    }
    *{box-sizing:border-box}
    body{margin:0;background:radial-gradient(circle at 18% 0%,rgba(50,244,154,.16),transparent 30%),linear-gradient(180deg,#040706,#08100e 40%,#050706);color:var(--text);font:14px/1.45 Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;overflow:hidden}
    html[data-theme="light"] body{background:linear-gradient(180deg,#f4f6f5,#ffffff 40%,#eef2f0);}
    .app{height:100vh;display:grid;grid-template-rows:76px 52px 1fr;gap:0}
    .topbar{display:flex;align-items:center;justify-content:space-between;padding:14px 18px 10px;border-bottom:1px solid var(--line);background:rgba(5,8,7,.86);backdrop-filter:blur(18px);z-index:5}
    html[data-theme="light"] .topbar{background:rgba(255,255,255,.9);}
    .brand{display:flex;align-items:center;gap:14px;min-width:310px}
    .logo{width:42px;height:42px;border:1px solid rgba(72,244,154,.55);border-radius:15px;display:grid;place-items:center;background:linear-gradient(145deg,rgba(72,244,154,.2),rgba(7,22,17,.8));box-shadow:0 0 30px rgba(72,244,154,.15);font-weight:900;color:var(--green)}
    html[data-theme="light"] .logo{border-color:rgba(13,158,92,.45);background:linear-gradient(145deg,rgba(13,158,92,.15),rgba(240,244,242,.8));box-shadow:0 0 20px rgba(13,158,92,.12);color:var(--green)}
    .brand h1{font-size:16px;margin:0;letter-spacing:.2px}.brand p{margin:2px 0 0;color:var(--muted);font-size:12px}
    .global-controls{display:flex;align-items:center;gap:10px;flex-wrap:wrap;justify-content:flex-end}
    select,button,input{font:inherit}
    .select,.input{background:var(--panel);border:1px solid var(--line2);color:var(--text);border-radius:12px;padding:10px 12px;outline:none;min-height:40px}
    .select:focus,.input:focus{border-color:rgba(72,244,154,.7);box-shadow:0 0 0 3px rgba(72,244,154,.12)}
    html[data-theme="light"] .select:focus, html[data-theme="light"] .input:focus{border-color:rgba(13,158,92,.6);box-shadow:0 0 0 3px rgba(13,158,92,.12)}
    .btn{border:1px solid var(--line2);background:var(--panel);color:var(--text);border-radius:12px;padding:10px 12px;min-height:40px;cursor:pointer;transition:.18s ease;display:inline-flex;align-items:center;gap:8px;justify-content:center}
    .btn:hover{border-color:rgba(72,244,154,.75);transform:translateY(-1px)}
    html[data-theme="light"] .btn:hover{border-color:rgba(13,158,92,.65);}
    .btn.primary{background:linear-gradient(135deg,#22c66d,#1f9d63);border-color:#48f49a;color:#04110b;font-weight:800}
    html[data-theme="light"] .btn.primary{background:linear-gradient(135deg,#0d9e5c,#0a7a47);border-color:#0d9e5c;color:#fff}
    .btn.ghost{background:rgba(8,14,12,.42)}
    html[data-theme="light"] .btn.ghost{background:rgba(240,244,242,.6)}
    .pill{border:1px solid var(--line2);border-radius:999px;padding:7px 10px;color:var(--muted);background:var(--panel);font-size:12px;white-space:nowrap}.pill b{color:var(--green)}
    .tabs{display:flex;align-items:center;gap:10px;padding:8px 18px;border-bottom:1px solid var(--line);background:rgba(5,8,7,.65);z-index:4}
    html[data-theme="light"] .tabs{background:rgba(255,255,255,.75);}
    .tab-btn{border:1px solid transparent;background:transparent;color:var(--muted);border-radius:999px;padding:10px 16px;cursor:pointer;font-weight:750;letter-spacing:.1px}
    .tab-btn.active{color:var(--green);border-color:rgba(72,244,154,.42);background:rgba(72,244,154,.1)}
    html[data-theme="light"] .tab-btn.active{border-color:rgba(13,158,92,.35);background:rgba(13,158,92,.1)}
    main{height:calc(100vh - 128px);overflow:hidden}.panel{display:none;height:100%;overflow:auto;padding:18px}.panel.active{display:block}
    .grid{display:grid;gap:14px}.grid.cols-2{grid-template-columns:1.25fr .75fr}.grid.cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.grid.cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}
    .card{background:linear-gradient(180deg,var(--panel2),var(--panel));border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow);padding:16px;color:var(--text)}
    .card h2,.card h3{margin:0 0 10px}.card h2{font-size:18px}.card h3{font-size:14px;color:var(--soft)}
    .muted{color:var(--muted)}.small{font-size:12px}.mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
    .hero{display:grid;grid-template-columns:1.05fr .95fr;gap:14px}
    .hero .card:first-child{min-height:210px;background:radial-gradient(circle at 16% 12%,rgba(72,244,154,.18),transparent 30%),linear-gradient(180deg,rgba(17,31,26,.96),rgba(8,13,12,.96))}
    html[data-theme="light"] .hero .card:first-child{background:radial-gradient(circle at 16% 12%,rgba(13,158,92,.08),transparent 30%),linear-gradient(180deg,#ffffff,#f0f4f2)}
    .big-title{font-size:32px;line-height:1.06;margin:0 0 12px;letter-spacing:-.8px}.accent{color:var(--green)}
    .metric-row{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
    .metric{padding:13px;border:1px solid var(--line);border-radius:15px;background:var(--panel3)}
    .metric span{display:block;color:var(--muted);font-size:11px;text-transform:uppercase;letter-spacing:.6px}
    .metric b{display:block;font-size:20px;margin-top:4px}
    .metric.good b{color:var(--green)}.metric.warn b{color:var(--yellow)}.metric.info b{color:var(--cyan)}
    table{width:100%;border-collapse:collapse;overflow:hidden;border-radius:14px}
    th,td{padding:11px 12px;border-bottom:1px solid rgba(37,64,55,.7);text-align:left;vertical-align:middle}
    th{color:#bcebd1;background:rgba(72,244,154,.08);font-size:12px;text-transform:uppercase;letter-spacing:.55px}
    html[data-theme="light"] th{color:#0f1c18;background:rgba(13,158,92,.08)}
    tbody tr{cursor:pointer}tbody tr:hover{background:rgba(72,244,154,.07)}tbody tr.selected{background:rgba(72,244,154,.12);outline:1px solid rgba(72,244,154,.24)}
    html[data-theme="light"] tbody tr:hover{background:rgba(13,158,92,.07)}
    html[data-theme="light"] tbody tr.selected{background:rgba(13,158,92,.12);outline-color:rgba(13,158,92,.24)}
    .score{display:inline-flex;align-items:center;gap:7px}
    .scorebar{width:64px;height:8px;border-radius:999px;background:#15241f;overflow:hidden}
    html[data-theme="light"] .scorebar{background:#dce5e1}
    .scorebar i{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,var(--green2),var(--green))}
    .tag{display:inline-flex;align-items:center;border:1px solid var(--line2);border-radius:999px;padding:4px 8px;font-size:11px;color:#bdebd1;background:var(--panel3);margin:2px}
    .tag.sea{border-color:rgba(54,214,255,.45);color:#9eeaff}.tag.classic{border-color:rgba(72,244,154,.45);color:#a6ffc9}.tag.risk{border-color:rgba(255,215,90,.35);color:#ffe59b}.tag.danger{border-color:rgba(255,92,115,.38);color:#ffb3bf}
    html[data-theme="light"] .tag.sea{border-color:rgba(11,143,199,.45);color:#0b8fc7}
    html[data-theme="light"] .tag.classic{border-color:rgba(13,158,92,.45);color:#0d9e5c}
    html[data-theme="light"] .tag.risk{border-color:rgba(184,134,11,.35);color:#b8860b}
    html[data-theme="light"] .tag.danger{border-color:rgba(220,38,38,.38);color:#dc2626}
    .pipeline{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px}
    .step{padding:14px;border:1px solid var(--line);border-radius:15px;background:var(--panel);min-height:120px}
    .step .num{width:28px;height:28px;border-radius:10px;background:rgba(72,244,154,.12);border:1px solid rgba(72,244,154,.3);display:grid;place-items:center;color:var(--green);font-weight:900;margin-bottom:10px}
    html[data-theme="light"] .step .num{background:rgba(13,158,92,.12);border-color:rgba(13,158,92,.3)}
    .step b{display:block;margin-bottom:6px}.step p{margin:0;color:var(--muted);font-size:12px}
    .calc-layout{display:grid;grid-template-columns:1fr 390px;gap:14px}
    .range-row{display:grid;grid-template-columns:170px 1fr 64px;align-items:center;gap:12px;margin:13px 0}
    .range-row input[type=range]{width:100%;accent-color:var(--green)}
    .formula{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:14px;white-space:pre-wrap;color:#b4d8c6;overflow:auto}
    html[data-theme="light"] .formula{background:#eef3f0;color:#2f4a3e}
    .bars{display:grid;gap:10px}
    .bar-row{display:grid;grid-template-columns:135px 1fr 70px;gap:10px;align-items:center}
    .bar{height:11px;background:#14231f;border-radius:999px;overflow:hidden}
    html[data-theme="light"] .bar{background:#dce5e1}
    .bar i{height:100%;display:block;background:linear-gradient(90deg,var(--green2),var(--green));border-radius:999px}
    .map-layout{height:100%;display:grid;grid-template-columns:340px 1fr 380px;gap:12px;transition:grid-template-columns 0.3s ease}
    .map-layout.collapsed-left{grid-template-columns:0px 1fr 380px}
    .map-layout.collapsed-right{grid-template-columns:340px 1fr 0px}
    .map-layout.collapsed-left.collapsed-right{grid-template-columns:0px 1fr 0px}
    .map-left,.map-right{height:100%;overflow:auto;background:rgba(5,8,7,.84);border:1px solid var(--line);border-radius:18px;padding:14px;box-shadow:var(--shadow);z-index:2;transition:opacity 0.25s ease;position:relative}
    html[data-theme="light"] .map-left, html[data-theme="light"] .map-right{background:rgba(255,255,255,.9)}
    .map-layout.collapsed-left .map-left,.map-layout.collapsed-right .map-right{opacity:0;pointer-events:none}
    .map-stage{height:100%;position:relative;border:1px solid var(--line);border-radius:18px;overflow:hidden;background:#030504;box-shadow:var(--shadow)}
    html[data-theme="light"] .map-stage{background:#eef2f0}
    #map{position:absolute;inset:0}
    .map-fallback{position:absolute;inset:0;display:grid;place-items:center;text-align:center;padding:24px;color:var(--muted);background:linear-gradient(135deg,#07100d,#0b1512)}
    html[data-theme="light"] .map-fallback{background:linear-gradient(135deg,#e8eeeb,#f4f6f5)}
    .map-overlay-top{position:absolute;top:12px;left:12px;right:12px;display:flex;justify-content:space-between;gap:10px;pointer-events:none}
    .map-overlay-top .glass{pointer-events:auto;background:rgba(4,8,7,.76);border:1px solid var(--line);border-radius:14px;padding:10px 12px;backdrop-filter:blur(12px)}
    html[data-theme="light"] .map-overlay-top .glass{background:rgba(255,255,255,.85);border-color:var(--line)}
    .layer-controls{display:grid;gap:8px}
    .check{display:flex;align-items:center;justify-content:space-between;gap:10px;border:1px solid var(--line);border-radius:13px;padding:10px 11px;background:var(--panel3)}
    .check input{accent-color:var(--green)}
    .site-list{display:grid;gap:8px;margin-top:10px}
    .site-item{border:1px solid var(--line);border-radius:14px;padding:12px;background:var(--panel3);cursor:pointer}
    .site-item:hover,.site-item.active{border-color:rgba(72,244,154,.55);background:rgba(72,244,154,.08)}
    html[data-theme="light"] .site-item:hover, html[data-theme="light"] .site-item.active{border-color:rgba(13,158,92,.45);background:rgba(13,158,92,.08)}
    .site-item .row{display:flex;justify-content:space-between;gap:10px}.site-item b{font-size:13px}
    .timeline{position:relative;margin-top:10px}.timeline:before{content:"";position:absolute;left:11px;top:4px;bottom:4px;width:1px;background:linear-gradient(var(--green),transparent)}
    .tl{position:relative;margin:0 0 10px 0;padding:12px 12px 12px 34px;border:1px solid var(--line);border-radius:15px;background:rgba(8,14,12,.78)}
    html[data-theme="light"] .tl{background:rgba(240,244,242,.8)}
    .tl:before{content:"";position:absolute;left:6px;top:17px;width:11px;height:11px;border-radius:999px;background:var(--green);box-shadow:0 0 0 5px rgba(72,244,154,.08)}
    html[data-theme="light"] .tl:before{box-shadow:0 0 0 5px rgba(13,158,92,.08)}
    .tl time{color:var(--green);font-weight:900}.tl p{margin:5px 0 0;color:var(--muted);font-size:12px}
    .legend{display:flex;flex-wrap:wrap;gap:8px}.legend .sw{width:12px;height:12px;border-radius:3px;display:inline-block;margin-right:6px}
    .kbd{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;border:1px solid var(--line2);background:var(--panel);border-radius:8px;padding:2px 6px;color:#bcebd1}
    html[data-theme="light"] .kbd{color:#0f1c18}
    .settings-layout{display:grid;grid-template-columns:1fr 1fr;gap:14px}
    .codebox{max-height:520px;overflow:auto;background:var(--panel);border:1px solid var(--line);border-radius:15px;padding:14px;color:#a6d8bf;white-space:pre;font-size:12px}
    html[data-theme="light"] .codebox{color:#2f4a3e}
    .notice{border-left:3px solid var(--green);padding:10px 12px;background:rgba(72,244,154,.08);border-radius:12px;color:#c8ffe0}
    html[data-theme="light"] .notice{background:rgba(13,158,92,.08);color:#0f1c18}
    .danger-notice{border-left-color:var(--yellow);background:rgba(255,215,90,.08);color:#ffe9a8}
    html[data-theme="light"] .danger-notice{background:rgba(184,134,11,.08);color:#0f1c18}
    .panel-toggle{position:absolute;top:10px;right:10px;z-index:5;width:28px;height:28px;border-radius:8px;background:var(--panel);border:1px solid var(--line);color:var(--muted);cursor:pointer;display:grid;place-items:center;font-size:14px;line-height:1;transition:.18s ease}
    .panel-toggle:hover{color:var(--green);border-color:var(--green)}
    .map-expand{position:absolute;top:50%;transform:translateY(-50%);z-index:3;width:28px;height:56px;display:none;align-items:center;justify-content:center;background:var(--panel);border:1px solid var(--line);color:var(--muted);cursor:pointer;font-size:16px;line-height:1}
    .map-expand:hover{color:var(--green);border-color:var(--green)}
    .map-expand.left{left:0;border-radius:0 10px 10px 0;border-left:none}
    .map-expand.right{right:0;border-radius:10px 0 0 10px;border-right:none}
    .map-layout.collapsed-left .map-expand.left,.map-layout.collapsed-right .map-expand.right{display:flex}
    .maplibregl-popup-content{background:#07110e;color:#eafff2;border:1px solid #265445;border-radius:14px;box-shadow:0 20px 40px rgba(0,0,0,.45)}
    .maplibregl-popup-tip{border-top-color:#07110e!important;border-bottom-color:#07110e!important}
    .maplibregl-ctrl-group{background:#07110e;border:1px solid #25483d}
    .maplibregl-ctrl-group button{filter:invert(1)}
    html[data-theme="light"] .maplibregl-popup-content{background:#ffffff;color:#0f1c18;border-color:#cddad4}
    html[data-theme="light"] .maplibregl-popup-tip{border-top-color:#ffffff!important;border-bottom-color:#ffffff!important}
    html[data-theme="light"] .maplibregl-ctrl-group{background:#ffffff;border-color:#cddad4}
    html[data-theme="light"] .maplibregl-ctrl-group button{filter:none}
    @media (max-width:1180px){body{overflow:auto}.app{height:auto;min-height:100vh}.topbar{align-items:flex-start;gap:10px;flex-direction:column}.tabs{overflow:auto}main{height:auto;overflow:visible}.map-layout,.calc-layout,.grid.cols-2,.hero,.settings-layout{grid-template-columns:1fr}.map-layout{height:1180px}.grid.cols-3,.grid.cols-4,.metric-row,.pipeline{grid-template-columns:1fr 1fr}.map-left,.map-right{height:auto}.map-stage{min-height:560px}}
    @media (max-width:700px){.grid.cols-3,.grid.cols-4,.metric-row,.pipeline{grid-template-columns:1fr}.brand{min-width:0}.big-title{font-size:24px}.panel{padding:12px}.map-layout{grid-template-columns:1fr;height:auto}.map-stage{height:560px}.global-controls{width:100%;justify-content:stretch}.select,.btn{flex:1}}
  </style>
</head>
<body>
<div class="app">
  <header class="topbar">
    <div class="brand">
      <div class="logo">PSP</div>
      <div>
        <h1>Türkiye Pompaj Depolamalı HES Yatırım İstihbaratı</h1>
        <p>Rapor tabanlı tek sayfa prototip: veri → skor → prosedürel 3D yerleşim → yatırım paneli</p>
      </div>
    </div>
    <div class="global-controls">
      <span class="pill">Mod: <b>Concept Intelligence MVP</b></span>
      <select id="siteSelect" class="select" aria-label="Aday saha seçimi"></select>
      <button id="focusMapBtn" class="btn primary">Haritada aç</button>
      <button id="exportJsonBtn" class="btn ghost">JSON indir</button>
      <button id="themeToggleBtn" class="btn ghost">Açık</button>
    </div>
  </header>
  <nav class="tabs" aria-label="Ana sekmeler">
    <button class="tab-btn active" data-tab="data">Datalar</button>
    <button class="tab-btn" data-tab="calc">Hesaplamalar</button>
    <button class="tab-btn" data-tab="map">Harita</button>
    <button class="tab-btn" data-tab="threeD">3D Gösterim</button>
    <button class="tab-btn" data-tab="pdhes">PDHES NEDİR</button>
    <button class="tab-btn" data-tab="admin">Yönetim</button>
    <button class="tab-btn" data-tab="settings">Ayarlar</button>
  </nav>
  <main>
    <section id="panel-data" class="panel active">
      <div class="hero">
        <div class="card">
          <div class="tag classic">Rapor tabanlı kısa liste</div>
          <h2 class="big-title" data-content-key="home.heroTitle">PSPP adaylarını <span class="accent">yatırım istihbaratı</span> formatında tarayın.</h2>
          <p class="muted" data-content-key="home.heroSub">Bu prototip, klasik pompaj depolama ve deniz suyu kullanan kıyı tipi PSPP adaylarını tek veri modelinde karşılaştırır. Gökçekaya varlık geliştirme MVP’si, Taşucu-Gülnar ise deniz suyu kıyı taraması MVP’si olarak öne çıkarılmıştır.</p>
          <div class="metric-row" style="margin-top:16px">
            <div class="metric good"><span>En hızlı klasik rota</span><b>Gökçekaya</b></div>
            <div class="metric info"><span>Deniz suyu MVP</span><b>Taşucu</b></div>
            <div class="metric warn"><span>Toplam aday</span><b id="siteCount">0</b></div>
            <div class="metric"><span>Model tipi</span><b>Procedural 3D</b></div>
          </div>
        </div>
        <div class="card">
          <h2>Veri eşleştirme mantığı</h2>
          <div class="pipeline">
            <div class="step"><div class="num">1</div><b>Kaynak oku</b><p>PDF raporu, JICA/TEİAŞ/DSİ notları, DEM ve piyasa varsayımları.</p></div>
            <div class="step"><div class="num">2</div><b>Varlık çıkar</b><p>Head, tünel, hacim, MW/GWh, CAPEX, gelir ve risk etiketleri.</p></div>
            <div class="step"><div class="num">3</div><b>GIS eşleştir</b><p>Üst rezervuar, alt rezervuar/deniz, şebeke, yol ve risk katmanı.</p></div>
            <div class="step"><div class="num">4</div><b>Yerleşim üret</b><p>Rezervuar, cebri boru, güç evi, surge tank ve salt blokları.</p></div>
            <div class="step"><div class="num">5</div><b>Komite paneli</b><p>Zaman çizelgesi, yatırım özeti, gelir ve due diligence kontrolü.</p></div>
          </div>
        </div>
      </div>
      <div class="grid cols-2" style="margin-top:14px">
        <div class="card">
          <h2>Aday saha tablosu</h2>
          <p class="muted small">Satıra tıklayarak uygulamanın tüm panellerindeki seçili sahayı değiştirin.</p>
          <div style="overflow:auto">
            <table id="siteTable">
              <thead>
                <tr><th>Saha</th><th>Konsept</th><th>Güç / Enerji</th><th>Head</th><th>Su yolu</th><th>CAPEX</th><th>Gelir</th><th>Skor</th></tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </div>
        <div class="card">
          <h2>Seçili saha veri kartı</h2>
          <div id="selectedDataCard"></div>
          <div class="notice" style="margin-top:12px">Bu veriler fizibilite değil; yatırım istihbaratı, ön eleme ve 3D anlatım prototipi için masaüstü seviyesinde gösterimdir.</div>
        </div>
      </div>
    </section>
    <section id="panel-calc" class="panel">
      <div class="calc-layout">
        <div class="card">
          <h2>Hesaplama motoru</h2>
          <p class="muted">Seçili saha için enerji, CAPEX ve gelir varsayımlarını hızlıca stres test edin. Sonuçlar rapor ölçeklerini bozmadan senaryo göstergesi üretir.</p>
          <div class="metric-row" id="calcMetrics" style="margin:16px 0"></div>
          <div class="grid cols-2">
            <div>
              <h3>Senaryo ayarları</h3>
              <div class="range-row"><label>CAPEX çarpanı</label><input id="capexFactor" type="range" min="0.75" max="1.45" step="0.01" value="1"><span id="capexFactorVal" class="kbd"></span></div>
              <div class="range-row"><label>Gelir yakalama</label><input id="revenueFactor" type="range" min="0.55" max="1.55" step="0.01" value="1"><span id="revenueFactorVal" class="kbd"></span></div>
              <div class="range-row"><label>Çevrim/yıl</label><input id="cycles" type="range" min="180" max="360" step="5" value="300"><span id="cyclesVal" class="kbd"></span></div>
              <div class="range-row"><label>Yardımcı hizmet primi</label><input id="reservePremium" type="range" min="0" max="45" step="1" value="18"><span id="reservePremiumVal" class="kbd"></span></div>
              <button id="resetScenarioBtn" class="btn">Senaryoyu sıfırla</button>
            </div>
            <div>
              <h3>Teknik formül</h3>
              <div id="formulaBox" class="formula"></div>
            </div>
          </div>
        </div>
        <div class="card">
          <h2>Skor ve risk kırılımı</h2>
          <div id="scoreBars" class="bars"></div>
          <div id="riskTags" style="margin-top:14px"></div>
          <div class="danger-notice" style="margin-top:14px">Nihai skor; DEM, parsel, jeoteknik, ÇED, TEİAŞ N-1/kısa devre ve DSİ işletme rejimi doğrulanmadan yatırım kararı yerine kullanılamaz.</div>
        </div>
      </div>
    </section>
    <section id="panel-map" class="panel">
      <div class="map-layout">
        <aside class="map-left">
          <button class="panel-toggle" id="toggleLeftPanel" title="Sol paneli kapat">&#10094;</button>
          <h2 style="margin-top:0">Location Explorer</h2>
          <p class="muted small">Referans uygulamadaki mantıkla, seçili PSPP sahası için tahmini bileşen yerleşimi üretir.</p>
          <div id="mapSiteCard"></div>
          <h3>Adaylar</h3>
          <div id="mapSiteList" class="site-list"></div>
          <h3 style="margin-top:16px">Katmanlar</h3>
          <div class="layer-controls">
            <label class="check">3D bileşen blokları <input id="toggleBlocks" type="checkbox" checked></label>
            <label class="check">Su yolu / tünel <input id="toggleWater" type="checkbox" checked></label>
            <label class="check">Prosedürel şebeke <input id="toggleGrid" type="checkbox" checked></label>
            <label class="check">Risk/koruma overlay <input id="toggleRisk" type="checkbox" checked></label>
            <label class="check">Etiketler <input id="toggleLabels" type="checkbox" checked></label>
            <label class="check">Akış animasyonu <input id="toggleFlow" type="checkbox"></label>
          </div>
          <h3 style="margin-top:16px">TEİAŞ Hat Katmanları (KML)</h3>
          <div class="layer-controls">
            <label class="check">400 kV hatlar <input id="toggleGrid400" type="checkbox" checked></label>
            <label class="check">154 kV hatlar <input id="toggleGrid154" type="checkbox"></label>
            <label class="check">66 kV hatlar <input id="toggleGrid66" type="checkbox"></label>
          </div>
        </aside>
        <div class="map-stage">
          <div id="map"><div class="map-fallback">Harita motoru yükleniyor...<br><span class="small">MapLibre GL JS CDN erişimi gerekir.</span></div></div>
          <div class="map-overlay-top">
            <div class="glass">
              <b id="mapTitle">Harita</b><br><span id="mapSubtitle" class="muted small"></span>
            </div>
            <div class="glass" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
              <button class="btn ghost" id="pitchBtn">3D / 2D</button>
              <button class="btn ghost" id="styleBtn">Harita stili</button>
              <button class="btn primary" id="renderBtn">Render yenile</button>
            </div>
          </div>
          <button class="map-expand left" id="expandLeftPanel" title="Sol paneli aç">&#10095;</button>
          <button class="map-expand right" id="expandRightPanel" title="Sağ paneli aç">&#10094;</button>
        </div>
        <aside class="map-right">
          <button class="panel-toggle" id="toggleRightPanel" title="Sağ paneli kapat">&#10095;</button>
          <h2 style="margin-top:0">Yatırım / Kapasite Özeti</h2>
          <div id="investmentCards" class="grid" style="gap:10px"></div>
          <h3 style="margin-top:16px">Proje Zaman Çizelgesi</h3>
          <div id="timeline" class="timeline"></div>
          <h3 style="margin-top:16px">3D bileşen lejantı</h3>
          <div class="legend" id="legend"></div>
          <h3 style="margin-top:16px">Procedural layout JSON</h3>
          <pre id="layoutJson" class="codebox" style="max-height:250px"></pre>
        </aside>
      </div>
    </section>
    <section id="panel-threeD" class="panel">
      <div class="grid cols-2">
        <div class="card">
          <h2>Procedural 3D Yerleşim</h2>
          <p class="muted">Seçili saha için üretilen 3D bileşenlerin teknik dökümü ve geometrik özellikleri.</p>
          <div id="threeDComponentList" class="site-list" style="margin-top:16px"></div>
          <div class="notice" style="margin-top:16px">
            <b>Not:</b> Bu bileşenler MapLibre GL JS <code>fill-extrusion</code> katmanları olarak harita üzerinde render edilmektedir.
          </div>
        </div>
        <div class="card">
          <h2>Bileşen Detayları</h2>
          <div id="threeDDetailCard"></div>
          <h3 style="margin-top:20px">Layout Özeti (JSON)</h3>
          <pre id="threeDJson" class="codebox" style="max-height:300px"></pre>
        </div>
      </div>
    </section>
    <section id="panel-pdhes" class="panel">
      <div class="card" style="max-width:900px;margin:0 auto">
        <h2 class="big-title" data-content-key="pdhesWhatIs.title">Pompaj Depolamalı <span class="accent">HES Nedir?</span></h2>
        <div style="margin-top:24px;display:grid;gap:20px">
          <div>
            <h3 data-content-key="pdhesWhatIs.principle">Çalışma Prensibi</h3>
            <p>Elektrik talebinin düşük ve fiyatların ucuz olduğu zamanlarda, su alt rezervuardan üst rezervuara pompalanır. Talebin arttığı ve enerjinin pahalandığı zamanlarda ise su aşağı bırakılarak türbinler vasıtasıyla elektrik üretilir.</p>
          </div>
          <div>
            <h3 data-content-key="pdhesWhatIs.critical">Neden Kritik?</h3>
            <p>Güneş ve rüzgar gibi değişken yenilenebilir enerji kaynaklarının şebeke dengesini bozmasını engeller. Frekans kontrolü ve anlık yük takibi yaparak şebeke esnekliği sağlar.</p>
          </div>
        </div>
      </div>
    </section>
    <section id="panel-admin" class="panel">
      <div class="card" style="max-width:600px;margin:0 auto">
        <h2>Yönetim Paneli</h2>
        <p class="muted">Uygulama içeriğini dinamik olarak güncelleyin. Şifre: <code>admin123</code></p>
        <div id="adminAuth">
          <input type="password" id="adminPass" class="input" placeholder="Şifre giriniz" style="width:100%;margin-bottom:12px">
          <button id="adminLoginBtn" class="btn primary" style="width:100%">Giriş Yap</button>
        </div>
        <div id="adminContent" style="display:none">
          <h3>İçerik Editörü</h3>
          <p class="small">Değiştirmek istediğiniz alanın anahtarını seçin:</p>
          <select id="contentKeySelect" class="select" style="width:100%;margin-bottom:12px"></select>
          <textarea id="contentText" class="input" style="width:100%;height:120px;margin-bottom:12px;font-family:inherit"></textarea>
          <button id="saveContentBtn" class="btn primary" style="width:100%">Kaydet (LocalStorage)</button>
          <button id="clearContentBtn" class="btn ghost" style="width:100%;margin-top:8px">Sıfırla</button>
        </div>
      </div>
    </section>
    <section id="panel-settings" class="panel">
      <div class="settings-layout">
        <div class="card">
          <h2>Ayarlar</h2>
          <p class="muted">Bu tek dosya prototipi MapLibre GL JS ile token gerektirmeden çalışır. Üretim sürümünde Mapbox, deck.gl veya Cesium entegrasyonu aynı veri modelinden beslenebilir.</p>
          <h3>Harita görünümü</h3>
          <div class="grid cols-2">
            <label>Varsayılan stil<select id="defaultStyle" class="select" style="width:100%;margin-top:6px"><option value="dark">Dark intelligence</option><option value="light">Light OSM</option><option value="satellite">Satellite</option></select></label>
            <label>3D yükseklik çarpanı<input id="heightScale" type="range" min="0.5" max="3" value="1.3" step="0.1" style="width:100%;accent-color:var(--green);margin-top:12px"><span id="heightScaleVal" class="kbd"></span></label>
          </div>
          <h3 style="margin-top:16px">Skor ağırlıkları</h3>
          <div class="range-row"><label>Topografya</label><input id="wTopo" type="range" min="0" max="40" value="30"><span id="wTopoVal" class="kbd"></span></div>
          <div class="range-row"><label>Şebeke</label><input id="wGrid" type="range" min="0" max="40" value="20"><span id="wGridVal" class="kbd"></span></div>
          <div class="range-row"><label>Çevre</label><input id="wEnv" type="range" min="0" max="30" value="15"><span id="wEnvVal" class="kbd"></span></div>
          <div class="range-row"><label>Jeoloji / deprem</label><input id="wGeo" type="range" min="0" max="25" value="10"><span id="wGeoVal" class="kbd"></span></div>
          <div class="notice">Bu ağırlıklar prototipte görsel amaçlıdır. Üretimde skor, PostGIS sorguları ve doğrulanmış katmanlardan hesaplanmalıdır.</div>
        </div>
        <div class="card">
          <h2>Gömülü veri modeli</h2>
          <p class="muted small">Bu JSON, backend/PostGIS servisinden gelecek yanıtın sadeleştirilmiş frontend karşılığıdır.</p>
          <pre id="dataJson" class="codebox"></pre>
        </div>
      </div>
    </section>
  </main>
</div>
<script>
let SITES = __SITES_DATA__;
let GRID_ASSETS = __GRID_DATA__;
const COMPONENTS = [
  {key:'upper_reservoir', label:'Üst rezervuar', color:'#4aa3ff'},
  {key:'lower_reservoir', label:'Alt rezervuar / deniz alım', color:'#1fb6ff'},
  {key:'powerhouse', label:'Yeraltı güç evi', color:'#b277ff'},
  {key:'surge_tank', label:'Surge tank', color:'#ffd75a'},
  {key:'switchyard', label:'Salt sahası', color:'#48f49a'},
  {key:'portal', label:'Tünel portalı / servis', color:'#ff944d'}
];
const CONTENT = {
  home: {
    heroTitle: 'PSPP adaylarını <span class="accent">yatırım istihbaratı</span> formatında tarayın.',
    heroSub: 'Bu prototip, klasik pompaj depolama ve deniz suyu kullanan kıyı tipi PSPP adaylarını tek veri modelinde karşılaştırır.'
  },
  pdhesWhatIs: {
    title: 'Pompaj Depolamalı <span class="accent">HES Nedir?</span>',
    principle: 'Çalışma Prensibi',
    critical: 'Neden Kritik?'
  }
};
const WORLD_EXAMPLES = [
  {name:'Okinawa', country:'Japan', mw:30, head:136, type:'sea'},
  {name:'Bath County', country:'USA', mw:3003, head:380, type:'classic'},
  {name:'Kannagawa', country:'Japan', mw:2820, head:653, type:'classic'},
  {name:'Huizhou', country:'China', mw:2448, head:531, type:'classic'},
  {name:'Drakensberg', country:'South Africa', mw:1000, head:470, type:'classic'},
  {name:'Grand Maison', country:'France', mw:1800, head:920, type:'classic'},
  {name:'Dinorwig', country:'UK', mw:1728, head:542, type:'classic'},
  {name:'Coo-Trois-Ponts', country:'Belgium', mw:1164, head:230, type:'classic'},
  {name:'Vianden', country:'Luxembourg', mw:1296, head:280, type:'classic'},
  {name:'Okutataragi', country:'Japan', mw:1932, head:387, type:'classic'}
];
const FALLBACK_SITES = [
  {id:'fallback_1', name:'Fallback Alpha', lat:39.9, lon:32.8, coordinates:{mapAnchor:[32.8,39.9]}},
  {id:'fallback_2', name:'Fallback Beta', lat:38.4, lon:27.1, coordinates:{mapAnchor:[27.1,38.4]}}
];
const $ = (id)=>document.getElementById(id);
let selectedId = 'gokcekaya';
let map, mapReady=false, currentStyle='dark', is3D=true, flowTimer=null, flowOffset=0;
function site(){ return SITES.find(s=>s.id===selectedId) || SITES[0]; }
function normalizeSite(s){
  if(s && s.coordinates && s.coordinates.mapAnchor){
    s.lon = s.coordinates.mapAnchor[0];
    s.lat = s.coordinates.mapAnchor[1];
  }
  return s;
}
function getContent(key){
  const overrides = JSON.parse(localStorage.getItem('pspp-content-overrides-v1') || '{}');
  if(overrides[key]) return overrides[key];
  const parts = key.split('.');
  let val = CONTENT;
  for(const p of parts) { if(val[p]!==undefined) val = val[p]; else return ''; }
  return typeof val === 'string' ? val : '';
}
function mergeContentOverrides(overrides){
  const existing = JSON.parse(localStorage.getItem('pspp-content-overrides-v1') || '{}');
  Object.assign(existing, overrides);
  localStorage.setItem('pspp-content-overrides-v1', JSON.stringify(existing));
  applyOverrides();
}
function applyOverrides(){
  document.querySelectorAll('[data-content-key]').forEach(el => {
    const key = el.dataset.contentKey;
    el.innerHTML = getContent(key);
  });
}
function moneyBn(v){ return 'E' + v.toFixed(2) + ' bn'; }
function moneyM(v){ return 'E' + Math.round(v) + ' m/yıl'; }
function num(v,d=0){ return Number(v).toLocaleString('tr-TR',{maximumFractionDigits:d,minimumFractionDigits:d}); }
function conceptTag(s){ return '<span class="tag '+(s.concept==='sea'?'sea':'classic')+'">'+(s.concept==='sea'?'Deniz suyu':'Klasik')+'</span>'; }
function escapeHtml(str){return String(str).replace(/[&<>\'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]));}
function copy(obj){return JSON.parse(JSON.stringify(obj));}
async function loadGridAssets(){
  try { const res = await fetch('grid_assets.json'); GRID_ASSETS = await res.json(); }
  catch(e) { console.error('Failed to load grid_assets.json', e); }
}
async function initUI(){
  try { const res = await fetch('data.json'); SITES = await res.json(); }
  catch(e) { console.error('Failed to load data.json', e); }
  await loadGridAssets();
  $('siteCount').textContent = SITES.length;
  const select = $('siteSelect');
  select.innerHTML = SITES.map(s=>'<option value="'+s.id+'">'+s.name+'</option>').join('');
  select.value = selectedId;
  select.addEventListener('change', e=>selectSite(e.target.value,true));
  document.querySelectorAll('.tab-btn').forEach(btn=>btn.addEventListener('click',()=>activateTab(btn.dataset.tab)));
  $('focusMapBtn').addEventListener('click',()=>{activateTab('map'); flyToSite(site());});
  $('exportJsonBtn').addEventListener('click', exportJson);
  $('resetScenarioBtn').addEventListener('click', resetScenario);
  ['capexFactor','revenueFactor','cycles','reservePremium'].forEach(id=>$(id).addEventListener('input',renderCalc));
  ['toggleBlocks','toggleWater','toggleGrid','toggleRisk','toggleLabels','toggleFlow'].forEach(id=>$(id).addEventListener('change',()=>{applyLayerVisibility(); if(id==='toggleFlow') updateFlowTimer();}));
  ['toggleGrid400','toggleGrid154','toggleGrid66'].forEach(id=>$(id).addEventListener('change',applyLayerVisibility));
  $('pitchBtn').addEventListener('click',togglePitch);
  $('styleBtn').addEventListener('click',cycleMapStyle);
  $('renderBtn').addEventListener('click',()=>drawMapLayers(true));
  $('defaultStyle').addEventListener('change',e=>{currentStyle=e.target.value; if(map) setMapStyle(currentStyle);});
  $('heightScale').addEventListener('input',()=>{ $('heightScaleVal').textContent = $('heightScale').value + 'x'; drawMapLayers(); });
  ['wTopo','wGrid','wEnv','wGeo'].forEach(id=>$(id).addEventListener('input',renderSettings));
  const savedTheme = localStorage.getItem('pspp-theme') || 'dark';
  setTheme(savedTheme);
  $('themeToggleBtn').addEventListener('click',()=>{ const next = document.documentElement.getAttribute('data-theme')==='dark' ? 'light' : 'dark'; setTheme(next); });
  $('toggleLeftPanel').addEventListener('click',()=>togglePanel('left'));
  $('toggleRightPanel').addEventListener('click',()=>togglePanel('right'));
  $('expandLeftPanel').addEventListener('click',()=>togglePanel('left'));
  $('expandRightPanel').addEventListener('click',()=>togglePanel('right'));
  $('adminLoginBtn').addEventListener('click', ()=>{
    if($('adminPass').value==='admin123'){
      $('adminAuth').style.display='none';
      $('adminContent').style.display='block';
      initAdminEditor();
    } else alert('Hatali sifre!');
  });
  $('saveContentBtn').addEventListener('click', saveOverride);
  $('clearContentBtn').addEventListener('click', ()=>{ localStorage.removeItem('pspp-content-overrides-v1'); location.reload(); });
  applyOverrides();
  renderAll();
}
function initAdminEditor(){
  const select = $('contentKeySelect');
  const keys = Array.from(document.querySelectorAll('[data-content-key]')).map(el => el.dataset.contentKey);
  select.innerHTML = keys.map(k => '<option value="'+k+'">'+k+'</option>').join('');
  select.addEventListener('change', e => {
    const el = document.querySelector('[data-content-key="'+e.target.value+'"]');
    $('contentText').value = el ? el.innerHTML.trim() : '';
  });
  if(keys.length > 0) select.dispatchEvent(new Event('change'));
}
function saveOverride(){
  const key = $('contentKeySelect').value;
  const val = $('contentText').value;
  const overrides = JSON.parse(localStorage.getItem('pspp-content-overrides-v1') || '{}');
  overrides[key] = val;
  localStorage.setItem('pspp-content-overrides-v1', JSON.stringify(overrides));
  applyOverrides();
}
function setTheme(theme){
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('pspp-theme', theme);
  const btn = $('themeToggleBtn');
  if(btn) btn.textContent = theme==='dark' ? 'Açık' : 'Koyu';
  if(map && currentStyle!=='satellite'){
    const target = theme==='dark' ? 'dark' : 'light';
    if(target!==currentStyle){ currentStyle=target; $('defaultStyle').value=currentStyle; setMapStyle(currentStyle); return; }
  }
  if(map && mapReady) updateGridColors();
}
function togglePanel(side){
  const layout = document.querySelector('.map-layout');
  if(!layout) return;
  if(side==='left') layout.classList.toggle('collapsed-left');
  if(side==='right') layout.classList.toggle('collapsed-right');
  requestAnimationFrame(()=>{ setTimeout(()=>{ if(map) map.resize(); }, 320); });
}
function activateTab(tab){
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
  $('panel-'+tab).classList.add('active');
  if(tab==='map'){
    initMap();
    requestAnimationFrame(()=>{ setTimeout(()=>{ if(map){ map.resize(); flyToSite(site()); } }, 180); });
  }
  if(tab==='threeD') renderThreeD();
}
function selectSite(id, fly=false){
  selectedId=id; $('siteSelect').value=id;
  renderAll();
  if(mapReady){ drawMapLayers(); if(fly) flyToSite(site()); }
}
function renderAll(){ renderTable(); renderSelectedData(); renderCalc(); renderMapPanels(); renderSettings(); renderThreeD(); }
function renderThreeD(){
  const s=site(), layout=buildLayout(s);
  $('threeDJson').textContent = JSON.stringify(layout.summary, null, 2);
  $('threeDComponentList').innerHTML = layout.blocks.features.map(f=>{
    const p=f.properties;
    return '<div class="site-item" style="border-left:4px solid '+p.color+'">'+
      '<div class="row"><b>'+p.label+'</b><span class="muted small">'+p.height+'m</span></div>'+
      '<div class="muted small">'+p.width+'m x '+p.length+'m</div>'+
      '</div>';
  }).join('');
  $('threeDDetailCard').innerHTML = '<div class="card" style="padding:12px;box-shadow:none">'+
    '<h3>'+s.name+' 3D Özeti</h3>'+
    '<p class="small"><b>Geometrik model:</b> Procedural Box/Circle</p>'+
    '<p class="small"><b>Bileşen sayısı:</b> '+layout.blocks.features.length+'</p>'+
    '<p class="small"><b>Su yolu segmenti:</b> '+layout.water.features[0].geometry.coordinates.length+' nokta</p>'+
    '</div>';
}
function renderTable(){
  const tbody = document.querySelector('#siteTable tbody');
  tbody.innerHTML = SITES.map(s=>{
    return '<tr data-id="'+s.id+'" class="'+(s.id===selectedId?'selected':'')+'">'+
      '<td><b>'+s.name+'</b><br><span class="muted small">'+s.region+'</span></td>'+
      '<td>'+conceptTag(s)+'</td>'+
      '<td><b>'+num(s.powerMW)+' MW</b><br><span class="muted small">'+s.energyGWh+' GWh</span></td>'+
      '<td>'+num(s.head,1)+' m</td><td>'+s.tunnelKm+' km</td>'+
      '<td>'+moneyBn(s.capexBn)+'</td><td>'+moneyM(s.revenueM)+'</td>'+
      '<td><span class="score"><span class="scorebar"><i style="width:'+s.score+'%"></i></span><b>'+s.score+'</b></span></td>'+
    '</tr>';
  }).join('');
  tbody.querySelectorAll('tr').forEach(tr=>tr.addEventListener('click',()=>selectSite(tr.dataset.id)));
}
function renderSelectedData(){
  const s=site();
  $('selectedDataCard').innerHTML =
    '<h3>'+s.name+'</h3>'+
    '<p class="muted">'+s.thesis+'</p>'+
    '<div class="metric-row" style="grid-template-columns:1fr 1fr;margin-top:12px">'+
      '<div class="metric good"><span>Skor</span><b>'+s.score+'/100</b></div>'+
      '<div class="metric info"><span>Yakın şebeke</span><b>'+s.gridDistKm+' km</b></div>'+
      '<div class="metric warn"><span>Aktif hacim</span><b>'+s.activeMcm+' Mm3</b></div>'+
      '<div class="metric"><span>Geri ödeme</span><b>'+s.payback+' yil</b></div>'+
    '</div>'+
    '<p style="margin-top:12px"><span class="tag '+(s.concept==='sea'?'sea':'classic')+'">'+s.conceptLabel+'</span></p>'+
    '<p class="small"><b>Alt rezervuar:</b> <span class="muted">'+s.lower+'</span></p>'+
    '<p class="small"><b>Üst rezervuar:</b> <span class="muted">'+s.upper+'</span></p>'+
    '<div>'+s.risks.map(r=>'<span class="tag risk">'+r+'</span>').join('')+'</div>';
}
function renderCalc(){
  const s=site();
  const capexFactor=+$('capexFactor').value, revenueFactor=+$('revenueFactor').value, cycles=+$('cycles').value, reserve=+$('reservePremium').value;
  $('capexFactorVal').textContent=capexFactor.toFixed(2)+'x';
  $('revenueFactorVal').textContent=revenueFactor.toFixed(2)+'x';
  $('cyclesVal').textContent=cycles;
  $('reservePremiumVal').textContent=reserve+'%';
  const physicsGWh = 1000*9.81*s.head*(s.activeMcm*1e6)*0.85/3.6e12;
  const adjCapex=s.capexBn*capexFactor;
  const adjRevenue=s.revenueM*(cycles/300)*revenueFactor*(1+reserve/100);
  const payback=(adjCapex*1000)/adjRevenue;
  const eurPerKw=(adjCapex*1e9)/(s.powerMW*1000);
  $('calcMetrics').innerHTML =
    '<div class="metric good"><span>Fiziksel enerji</span><b>'+physicsGWh.toFixed(2)+' GWh</b></div>'+
    '<div class="metric info"><span>Senaryo CAPEX</span><b>'+moneyBn(adjCapex)+'</b></div>'+
    '<div class="metric warn"><span>Brüt gelir</span><b>'+moneyM(adjRevenue)+'</b></div>'+
    '<div class="metric"><span>Basit geri ödeme</span><b>'+payback.toFixed(1)+' yil</b></div>';
  $('formulaBox').textContent = 'Secili saha: '+s.name+'\n\nEnerji formülü:\nE_GWh = p . g . H . V . n / 3.6e12\np=1000 kg/m3, g=9.81 m/s2, H='+s.head+' m, V='+s.activeMcm+' Mm3, n=0.85\n\nRapor enerji olcegi: '+s.energyGWh+' GWh\nHesaplanan fiziksel ekran: '+physicsGWh.toFixed(2)+' GWh\n\nCAPEX ekranı:\n'+s.capexBn+' bn E x '+capexFactor.toFixed(2)+' = '+adjCapex.toFixed(2)+' bn E\n'+Math.round(eurPerKw).toLocaleString('tr-TR')+' E/kW\n\nGelir ekranı:\n'+s.revenueM+' mE/yil x cevrim('+cycles+'/300) x gelir('+revenueFactor.toFixed(2)+') x yardimci hizmet('+(1+reserve/100)+') = '+adjRevenue.toFixed(1)+' mE/yil';
  renderScoreBars();
}
function resetScenario(){ $('capexFactor').value=1; $('revenueFactor').value=1; $('cycles').value=300; $('reservePremium').value=18; renderCalc(); }
function renderScoreBars(){
  const s=site();
  const labels={topo:'Topografya/head',grid:'Şebeke',env:'Çevre/izin',geology:'Jeoloji/deprem',access:'Erişim',market:'Piyasa/yük'};
  $('scoreBars').innerHTML=Object.entries(s.scores).map(([k,v])=>'<div class="bar-row"><span>'+labels[k]+'</span><div class="bar"><i style="width:'+v+'%"></i></div><b>'+v+'/100</b></div>').join('');
  $('riskTags').innerHTML='<h3>Başlıca riskler</h3>'+s.risks.map((r,i)=>'<span class="tag '+(i<2?'danger':'risk')+'">'+r+'</span>').join('');
}
function renderMapPanels(){
  const s=site();
  $('mapSiteCard').innerHTML = '<div class="card" style="padding:12px;box-shadow:none"><div>'+conceptTag(s)+'</div><h3 style="margin:8px 0 6px">'+s.name+'</h3><p class="muted small">'+s.thesis+'</p><div class="metric-row" style="grid-template-columns:1fr 1fr"><div class="metric"><span>MW</span><b>'+num(s.powerMW)+'</b></div><div class="metric"><span>GWh</span><b>'+s.energyGWh+'</b></div></div></div>';
  $('mapSiteList').innerHTML = SITES.map(x=>'<div class="site-item '+(x.id===selectedId?'active':'')+'" data-id="'+x.id+'"><div class="row"><b>'+x.name+'</b><span class="tag '+(x.concept==='sea'?'sea':'classic')+'">'+x.score+'</span></div><span class="muted small">'+x.region+'</span></div>').join('');
  $('mapSiteList').querySelectorAll('.site-item').forEach(el=>el.addEventListener('click',()=>selectSite(el.dataset.id,true)));
  $('investmentCards').innerHTML =
    '<div class="metric good"><span>Kapasite</span><b>'+num(s.powerMW)+' MW / '+s.energyGWh+' GWh</b></div>'+
    '<div class="metric info"><span>Head / su yolu</span><b>'+num(s.head,1)+' m / '+s.tunnelKm+' km</b></div>'+
    '<div class="metric warn"><span>CAPEX</span><b>'+moneyBn(s.capexBn)+'</b></div>'+
    '<div class="metric"><span>Gelir / geri odeme</span><b>'+moneyM(s.revenueM)+' / '+s.payback+' yil</b></div>';
  $('timeline').innerHTML = s.timeline.map(e=>'<div class="tl"><time>'+e.date+'</time><b style="display:block;margin-top:3px">'+e.title+'</b><p>'+e.text+'</p></div>').join('');
  $('legend').innerHTML = COMPONENTS.map(c=>'<span class="tag"><i class="sw" style="background:'+c.color+'"></i>'+c.label+'</span>').join('');
  $('mapTitle').textContent = s.name;
  $('mapSubtitle').textContent = s.conceptLabel+' . '+s.powerMW+' MW . '+s.energyGWh+' GWh . skor '+s.score;
  $('layoutJson').textContent = JSON.stringify(buildLayout(s),null,2);
}
function renderSettings(){
  $('heightScaleVal').textContent = $('heightScale').value + 'x';
  ['wTopo','wGrid','wEnv','wGeo'].forEach(id=>$(id+'Val').textContent=$(id).value+'%');
  const wt = +$('wTopo').value;
  const wg = +$('wGrid').value;
  const we = +$('wEnv').value;
  const wge = +$('wGeo').value;
  const totalW = wt + wg + we + wge;
  if (totalW > 0 && SITES.length > 0) {
    SITES.forEach(s => {
      const sc = s.scores || {topo:80, grid:80, env:80, geology:80};
      s.score = Math.round((sc.topo * wt + sc.grid * wg + sc.env * we + sc.geology * wge) / totalW);
    });
    renderTable();
    if(site()) renderSelectedData();
  }
  $('dataJson').textContent = JSON.stringify(SITES.map(s=>({id:s.id,name:s.name,concept:s.concept,lat:s.lat,lon:s.lon,head_m:s.head,tunnel_km:s.tunnelKm,active_mcm:s.activeMcm,power_mw:s.powerMW,energy_gwh:s.energyGWh,capex_bn_eur:s.capexBn,revenue_m_eur_y:s.revenueM,score:s.score,risks:s.risks})),null,2);
}
function mapStyle(kind){
  const glyphs='https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf';
  if(kind==='satellite') return {version:8,glyphs,sources:{base:{type:'raster',tiles:['https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],tileSize:256,attribution:'Tiles (c) Esri'}},layers:[{id:'base',type:'raster',source:'base'}]};
  if(kind==='light') return {version:8,glyphs,sources:{base:{type:'raster',tiles:['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],tileSize:256,attribution:'(c) OpenStreetMap contributors'}},layers:[{id:'base',type:'raster',source:'base'}]};
  return {version:8,glyphs,sources:{base:{type:'raster',tiles:['https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'],tileSize:256,attribution:'(c) OpenStreetMap (c) CARTO'}},layers:[{id:'base',type:'raster',source:'base'}]};
}
function initMap(){
  if(map || !window.maplibregl) return;
  const s=site();
  map = new maplibregl.Map({container:'map',style:mapStyle(currentStyle),center:s.view.center,zoom:s.view.zoom,pitch:s.view.pitch,bearing:s.view.bearing,antialias:true});
  map.addControl(new maplibregl.NavigationControl({visualizePitch:true}),'bottom-right');
  map.on('load',()=>{mapReady=true; drawMapLayers(true); updateFlowTimer();});
  map.on('styledata',()=>{
    if(mapReady){
      clearTimeout(map._styleTimer);
      map._styleTimer = setTimeout(()=>{ mapReady=true; drawMapLayers(true); }, 80);
    }
  });
}
function setMapStyle(kind){ if(!map) return; mapReady=false; map.setStyle(mapStyle(kind)); map.once('styledata',()=>{mapReady=true; drawMapLayers(true);}); }
function cycleMapStyle(){ const order=['dark','satellite','light']; currentStyle=order[(order.indexOf(currentStyle)+1)%order.length]; $('defaultStyle').value=currentStyle; setMapStyle(currentStyle); }
function flyToSite(s){ if(!map) return; map.flyTo({center:s.view.center,zoom:s.view.zoom,pitch:is3D?s.view.pitch:0,bearing:is3D?s.view.bearing:0,duration:1200,essential:true}); }
function togglePitch(){ is3D=!is3D; flyToSite(site()); }
function removeMapLayers(){
  if(!map || !map.getStyle()) return;
  const layerIds = [
    'candidate-circles','candidate-labels','risk-fill','risk-line',
    'grid-line','grid-labels','water-line','water-points','blocks-extrusion','block-labels',
    'grid-assets-lines-400','grid-assets-lines-154','grid-assets-lines-66',
    'grid-assets-points-400','grid-assets-points-154','grid-assets-points-66'
  ];
  const sourceIds = ['candidates','risk','grid','water','blocks','labels-source','grid-assets'];
  layerIds.forEach(id=>{if(map.getLayer(id)) map.removeLayer(id);});
  sourceIds.forEach(id=>{if(map.getSource(id)) map.removeSource(id);});
}
function getGridColors(){
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  return isDark ? {400:'#ff4d4d', 154:'#b0bec5', 66:'#ff66ff'} : {400:'#c0392b', 154:'#555555', 66:'#8e44ad'};
}
function updateGridColors(){
  if(!map) return;
  const colors = getGridColors();
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const stroke = isDark ? '#07110e' : '#ffffff';
  ['400','154','66'].forEach(v=>{
    const lineId = 'grid-assets-lines-'+v;
    const pointId = 'grid-assets-points-'+v;
    if(map.getLayer(lineId)){ map.setPaintProperty(lineId, 'line-color', colors[v]); }
    if(map.getLayer(pointId)){ map.setPaintProperty(pointId, 'circle-color', colors[v]); map.setPaintProperty(pointId, 'circle-stroke-color', stroke); }
  });
}
function ensureSourcesAndLayers(){
  if(!map || !map.getStyle()) return false;
  if(map.getSource('candidates')) return true;
  removeMapLayers();
  const s=site(), layout=buildLayout(s);
  map.addSource('candidates',{type:'geojson',data: candidateFeatures()});
  map.addLayer({id:'candidate-circles',type:'circle',source:'candidates',paint:{'circle-radius':['case',['==',['get','id'],selectedId],9,6],'circle-color':['get','color'],'circle-stroke-width':2,'circle-stroke-color':'#07110e','circle-opacity':0.95}});
  map.addLayer({id:'candidate-approx-halo',type:'circle',source:'candidates',filter:['==',['get','id'],selectedId],paint:{'circle-radius':25,'circle-color':['get','color'],'circle-opacity':0.15,'circle-stroke-width':1,'circle-stroke-color':['get','color'],'circle-stroke-opacity':0.3}});
  map.addLayer({id:'candidate-old-points',type:'circle',source:'candidates',filter:['==',['get','id'],'legacy_dummy'],paint:{'circle-radius':4,'circle-color':'#ff0000','circle-opacity':0.5}});
  map.addLayer({id:'candidate-labels',type:'symbol',source:'candidates',layout:{'text-field':['get','short'],'text-size':12,'text-offset':[0,1.4],'text-font':['Noto Sans Regular']},paint:{'text-color':'#eafff2','text-halo-color':'#04100c','text-halo-width':1.2}});
  map.addSource('risk',{type:'geojson',data: layout.risk});
  map.addLayer({id:'risk-fill',type:'fill',source:'risk',paint:{'fill-color':'#ff5c73','fill-opacity':0.13}});
  map.addLayer({id:'risk-line',type:'line',source:'risk',paint:{'line-color':'#ff5c73','line-width':1.5,'line-dasharray':[2,2]}});
  map.addSource('grid',{type:'geojson',data: layout.grid});
  map.addLayer({id:'grid-line',type:'line',source:'grid',filter:['==',['geometry-type'],'LineString'],paint:{'line-color':['get','color'],'line-width':['get','width'],'line-opacity':0.82}});
  map.addLayer({id:'grid-labels',type:'symbol',source:'grid',filter:['==',['geometry-type'],'LineString'],layout:{'symbol-placement':'line','text-field':['get','label'],'text-size':13,'text-font':['Noto Sans Bold']},paint:{'text-color':'#ffd75a','text-halo-color':'#090d0b','text-halo-width':1.4}});
  map.addSource('water',{type:'geojson',data: layout.water});
  map.addLayer({id:'water-line',type:'line',source:'water',filter:['==',['geometry-type'],'LineString'],paint:{'line-color':['get','color'],'line-width':['get','width'],'line-opacity':0.95,'line-dasharray':[6,2,2,2]}});
  map.addLayer({id:'water-points',type:'circle',source:'water',filter:['==',['geometry-type'],'Point'],paint:{'circle-radius':6,'circle-color':['get','color'],'circle-stroke-color':'#03100b','circle-stroke-width':2}});
  map.addSource('blocks',{type:'geojson',data: layout.blocks});
  map.addLayer({id:'blocks-extrusion',type:'fill-extrusion',source:'blocks',paint:{'fill-extrusion-color':['get','color'],'fill-extrusion-height':['get','height'],'fill-extrusion-base':['get','base'],'fill-extrusion-opacity':0.85}});
  map.addSource('labels-source',{type:'geojson',data: layout.labels});
  map.addLayer({id:'block-labels',type:'symbol',source:'labels-source',layout:{'text-field':['get','label'],'text-size':12,'text-font':['Noto Sans Bold'],'text-offset':[0,0],'text-variable-anchor':['top','bottom','left','right']},paint:{'text-color':'#d9fff0','text-halo-color':'#06100d','text-halo-width':1.5}});
  if(GRID_ASSETS){
    map.addSource('grid-assets',{type:'geojson',data: GRID_ASSETS});
    const colors = getGridColors();
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const stroke = isDark ? '#07110e' : '#ffffff';
    ['400','154','66'].forEach(v=>{
      map.addLayer({id:'grid-assets-lines-'+v,type:'line',source:'grid-assets',filter:['all',['==',['get','voltage'],v],['==',['geometry-type'],'LineString']],paint:{'line-color':colors[v],'line-width':v==='400'?2:1.5,'line-opacity':0.85}});
      map.addLayer({id:'grid-assets-points-'+v,type:'circle',source:'grid-assets',filter:['all',['==',['get','voltage'],v],['==',['geometry-type'],'Point']],paint:{'circle-radius':v==='400'?4:3,'circle-color':colors[v],'circle-stroke-color':stroke,'circle-stroke-width':1,'circle-opacity':0.9}});
    });
    if(!map._kmlClickRegistered){
      ['grid-assets-points-400','grid-assets-points-154','grid-assets-points-66'].forEach(id=>{
        map.on('click',id,e=>{
          const f=e.features&&e.features[0]; if(!f) return;
          new maplibregl.Popup().setLngLat(e.lngLat).setHTML('<b>'+escapeHtml(f.properties.name)+'</b><br><span>'+escapeHtml(f.properties.voltage)+' kV</span>').addTo(map);
        });
      });
      ['grid-assets-points-400','grid-assets-points-154','grid-assets-points-66'].forEach(id=>{
        map.on('mouseenter',id,()=>map.getCanvas().style.cursor='pointer');
        map.on('mouseleave',id,()=>map.getCanvas().style.cursor='');
      });
      map._kmlClickRegistered=true;
    }
  }
  if(!map._psppClickRegistered){
    map.on('click','candidate-circles', e=>{
      const f=e.features&&e.features[0]; if(!f) return; selectSite(f.properties.id,true);
      new maplibregl.Popup().setLngLat(e.lngLat).setHTML('<b>'+escapeHtml(f.properties.name)+'</b><br><span>'+escapeHtml(f.properties.concept)+'</span>').addTo(map);
    });
    map.on('mouseenter','candidate-circles',()=>{map.getCanvas().style.cursor='pointer';});
    map.on('mouseleave','candidate-circles',()=>{map.getCanvas().style.cursor='';});
    map._psppClickRegistered=true;
  }
  return true;
}
function updateMapData(){
  if(!map || !map.getSource('candidates')) return;
  const s = site(), layout = buildLayout(s);
  map.getSource('candidates').setData(candidateFeatures());
  map.getSource('risk').setData(layout.risk);
  map.getSource('grid').setData(layout.grid);
  map.getSource('water').setData(layout.water);
  map.getSource('blocks').setData(layout.blocks);
  map.getSource('labels-source').setData(layout.labels);
}
function drawMapLayers(force=false){
  if(!map || !map.getStyle()) return;
  const initialized = ensureSourcesAndLayers();
  if(initialized) updateMapData();
  applyLayerVisibility();
  updateGridColors();
  $('layoutJson').textContent = JSON.stringify(buildLayout(site()).summary, null, 2);
}
function applyLayerVisibility(){
  if(!map) return;
  const v=(id,on)=>{ if(map.getLayer(id)) map.setLayoutProperty(id,'visibility',on?'visible':'none'); };
  const showBlocks=$('toggleBlocks').checked, showWater=$('toggleWater').checked, showGrid=$('toggleGrid').checked, showRisk=$('toggleRisk').checked, showLabels=$('toggleLabels').checked;
  ['blocks-extrusion'].forEach(id=>v(id,showBlocks));
  ['water-line','water-points'].forEach(id=>v(id,showWater));
  ['grid-line','grid-labels'].forEach(id=>v(id,showGrid));
  ['risk-fill','risk-line'].forEach(id=>v(id,showRisk));
  ['candidate-labels','block-labels'].forEach(id=>v(id,showLabels));
  v('grid-assets-lines-400', $('toggleGrid400').checked);
  v('grid-assets-points-400', $('toggleGrid400').checked);
  v('grid-assets-lines-154', $('toggleGrid154').checked);
  v('grid-assets-points-154', $('toggleGrid154').checked);
  v('grid-assets-lines-66', $('toggleGrid66').checked);
  v('grid-assets-points-66', $('toggleGrid66').checked);
}
function updateFlowTimer(){
  if(flowTimer) clearInterval(flowTimer);
  if(!$('toggleFlow').checked) return;
  flowTimer=setInterval(()=>{ if(map && map.getLayer('water-line')){ flowOffset=(flowOffset+1)%6; map.setPaintProperty('water-line','line-dasharray', flowOffset%2?[2,2,6,2]:[6,2,2,2]); }},650);
}
function buildLayout(s){
  const hScale=+$('heightScale')?.value || 1.3;
  const L=s.layout, b=L.bearing;
  const blocks=[];
  function addRect(key,label,center,width,length,height,color,bearing=b,base=2){
    blocks.push({
      type:'Feature',
      geometry:{type:'Polygon',coordinates:[rotatedRectangle(center,width,length,bearing)]},
      properties:{
        key,label,width,length,height:height*hScale,base,color,
        type:'pspp-component',
        pdhesComponentType:key,
        confidence:'high',
        source:'desktop-analysis',
        capexCategory:'civil-works',
        riskCategory:'permitting',
        description:'Auto-generated '+label,
        editableByAdmin:true
      }
    });
  }
  function addCircle(key,label,center,radius,height,color,base=2){
    blocks.push({
      type:'Feature',
      geometry:{type:'Polygon',coordinates:[circlePolygon(center,radius,36)]},
      properties:{
        key,label,width:radius*2,length:radius*2,height:height*hScale,base,color,
        type:'pspp-component',
        pdhesComponentType:key,
        confidence:'high',
        source:'desktop-analysis',
        capexCategory:'civil-works',
        riskCategory:'permitting',
        description:'Auto-generated '+label,
        editableByAdmin:true
      }
    });
  }
  if(s.concept==='sea'){
    addRect('upper_reservoir','Kaplamalı üst rezervuar',L.upper,980,760,42,'#4aa3ff',b+8);
    addRect('lower_reservoir','Deniz alım/deşarj yapısı',L.lower,420,180,18,'#1fb6ff',b-18);
    addRect('powerhouse','Yeraltı güç evi / kavern',L.power,260,150,70,'#b277ff',b+2);
    addCircle('surge_tank','Surge tank',L.surge,70,115,'#ffd75a');
    addRect('switchyard','154/380 kV salt sahasi',L.switchyard,340,240,28,'#48f49a',b-12);
    addRect('portal','Tunel portali + servis alani',mid(L.upper,L.power,.55),220,120,24,'#ff944d',b+16);
  } else {
    addRect('upper_reservoir','Üst rezervuar',L.upper,1100,850,36,'#4aa3ff',b+4);
    addRect('lower_reservoir','Mevcut alt rezervuar',L.lower,900,500,16,'#1fb6ff',b-10);
    addRect('powerhouse','Yeraltı güç evi / pompa-türbin',L.power,320,170,78,'#b277ff',b+1);
    addCircle('surge_tank','Surge tank',L.surge,82,120,'#ffd75a');
    addRect('switchyard','380 kV salt / trafo sahası',L.switchyard,390,260,32,'#48f49a',b-7);
    addRect('portal','Servis + drenaj tüneli portalı',mid(L.upper,L.power,.58),240,125,22,'#ff944d',b+12);
  }
  const waterFeatures=[
    {type:'Feature',geometry:{type:'LineString',coordinates:[L.upper,L.surge,L.power,L.lower]},properties:{key:'tunnels',label:s.concept==='sea'?'Deniz suyu cebri tünel':'Cebri tünel / su yolu',color:'#36d6ff',width:4,dash:[6,2,2,2]}},
    {type:'Feature',geometry:{type:'Point',coordinates:L.upper},properties:{key:'intake',label:'Üst rezervuar',color:'#4aa3ff'}},
    {type:'Feature',geometry:{type:'Point',coordinates:L.lower},properties:{key:'intake_outfall',label:s.concept==='sea'?'Deniz alımı':'Alt rezervuar',color:'#1fb6ff'}}
  ];
  const grid={type:'FeatureCollection',features:[
    {type:'Feature',geometry:{type:'LineString',coordinates:[L.gridA,L.switchyard,L.gridB]},properties:{label:s.concept==='sea'?'154/380 kV koridor':'380 kV bağlantı',color:'#ffd75a',width:3}},
    {type:'Feature',geometry:{type:'LineString',coordinates:[offset(L.switchyard,550,-300),offset(L.switchyard,-450,300)]},properties:{label:'salt çıkışı',color:'#48f49a',width:2}}
  ]};
  const risk={type:'FeatureCollection',features:[{type:'Feature',geometry:{type:'Polygon',coordinates:[circlePolygon(L.risk,s.concept==='sea'?1700:1450,64)]},properties:{label:'risk/izin buffer'}}]};
  const labels={type:'FeatureCollection',features:blocks.map(f=>({type:'Feature',geometry:{type:'Point',coordinates:centroid(f.geometry.coordinates[0])},properties:{label:f.properties.label}}))};
  return {summary:{site:s.name,concept:s.concept,components:blocks.map(f=>f.properties),waterway_km:s.tunnelKm,head_m:s.head,score:s.score},blocks:{type:'FeatureCollection',features:blocks},water:{type:'FeatureCollection',features:waterFeatures},grid,risk,labels};
}
function candidateFeatures(){return {type:'FeatureCollection',features:SITES.map(s=>({type:'Feature',geometry:{type:'Point',coordinates:[s.lon,s.lat]},properties:{id:s.id,name:s.name,short:s.name.split(' ')[0],concept:s.conceptLabel,color:s.color}}))};}
function deg2rad(d){return d*Math.PI/180;}
function offset(center,eastM,northM){const lon=center[0],lat=center[1];return [lon+eastM/(111320*Math.cos(deg2rad(lat))),lat+northM/111320];}
function rotatedRectangle(center,widthM,lengthM,bearingDeg){
  const t=deg2rad(bearingDeg), le=[Math.sin(t),Math.cos(t)], we=[Math.cos(t),-Math.sin(t)];
  const corners=[[-widthM/2,-lengthM/2],[widthM/2,-lengthM/2],[widthM/2,lengthM/2],[-widthM/2,lengthM/2],[-widthM/2,-lengthM/2]];
  return corners.map(([x,y])=>offset(center,x*we[0]+y*le[0],x*we[1]+y*le[1]));
}
function circlePolygon(center,radiusM,steps=48){const pts=[];for(let i=0;i<=steps;i++){const a=i/steps*2*Math.PI;pts.push(offset(center,Math.cos(a)*radiusM,Math.sin(a)*radiusM));}return pts;}
function centroid(coords){let x=0,y=0,n=coords.length-1;for(let i=0;i<n;i++){x+=coords[i][0];y+=coords[i][1];}return [x/n,y/n];}
function mid(a,b,t=.5){return [a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];}
function exportJson(){
  const blob=new Blob([JSON.stringify({selected:site(),allSites:SITES,layout:buildLayout(site()).summary},null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='pspp-intelligence-export.json'; a.click(); URL.revokeObjectURL(url);
}
window.addEventListener('DOMContentLoaded', initUI);
</script>
</body>
</html>
'''

with open(out, 'w', encoding='utf-8') as f:
    f.write(html.replace('__SITES_DATA__', data_json).replace('__GRID_DATA__', grid_json))
print('Wrote', out)
