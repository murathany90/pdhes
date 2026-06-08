const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = __dirname;
const htmlPath = path.join(root, 'pspp_yatirim_istihbarat_app.html');
const dataPath = path.join(root, 'data.json');
const gridPath = path.join(root, 'grid_assets.json');

const html = fs.readFileSync(htmlPath, 'utf-8');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
const grid = JSON.parse(fs.readFileSync(gridPath, 'utf-8'));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function extractScript(source) {
  const match = source.match(/<script>([\s\S]*)<\/script>\s*<\/body>/i);
  assert(match, 'Inline application script not found');
  return match[1];
}

function fakeElement(id) {
  return {
    id,
    value: '1.3',
    checked: true,
    textContent: '',
    innerHTML: '',
    dataset: {},
    classList: { add() {}, remove() {}, toggle() {} },
    addEventListener() {},
    appendChild() {},
    querySelector() { return null; },
    querySelectorAll() { return []; }
  };
}

function loadAppExports() {
  const script = extractScript(html);
  const elementCache = new Map();
  const getEl = (id) => {
    if (!elementCache.has(id)) elementCache.set(id, fakeElement(id));
    return elementCache.get(id);
  };
  const context = {
    console,
    Blob,
    URL: { createObjectURL() { return 'blob:test'; }, revokeObjectURL() {} },
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    requestAnimationFrame: (cb) => cb(),
    navigator: { clipboard: { writeText() { return Promise.resolve(); } } },
    localStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
    document: {
      documentElement: { getAttribute() { return 'dark'; }, setAttribute() {} },
      body: { appendChild() {}, removeChild() {}, classList: { toggle() {} } },
      createElement(tag) { return fakeElement(tag); },
      getElementById: getEl,
      querySelectorAll() { return []; },
      querySelector() { return fakeElement('query'); }
    },
    window: { addEventListener() {} },
    maplibregl: {}
  };
  context.globalThis = context;
  vm.runInNewContext(
    script + '\n;globalThis.__exports = { COMPONENTS, CONTENT, WORLD_EXAMPLES, FALLBACK_SITES, normalizeSite, buildLayout, candidateFeatures, getContent, mergeContentOverrides };',
    context,
    { filename: 'pspp_yatirim_istihbarat_app.html' }
  );
  return context.__exports;
}

const requiredIds = [
  'gokcekaya',
  'tasucu',
  'altinkaya',
  'oymapinar',
  'karaburun',
  'bozyazi_anamur',
  'ordu_persembe',
  'menzelet',
  'hasan_suat',
  'sariyar_aug',
  'gazipasa_toros',
  'finike_kumluca',
  'samandag_musa',
  'edremit_kazdagi',
  'datca_guney',
  'gokceada_mikro_deniz',
  'bozcaada_mikro_deniz',
  'afyon_sultandagi_mustakil',
  'kayseri_yahyali_mustakil'
];

const coordinateKeys = [
  'mapAnchor',
  'lowerReservoir',
  'upperReservoir',
  'powerhouse',
  'surgeTank',
  'switchyard',
  'gridConnection',
  'intakeOutfall',
  'bbox'
];

assert(data.length >= 19, 'Expected at least 19 sites, got ' + data.length);
for (const id of requiredIds) {
  assert(data.some((site) => site.id === id), 'Missing required site ' + id);
}
console.log('✓ Expanded candidate set present:', data.length);

const typeCounts = data.reduce((acc, site) => {
  acc[site.pdhesType] = (acc[site.pdhesType] || 0) + 1;
  return acc;
}, {});
assert(typeCounts.MUSTAKIL_PDHES >= 2, 'Expected 2+ MUSTAKIL_PDHES sites');
assert(typeCounts.YARI_PDHES >= 2, 'Expected 2+ YARI_PDHES sites');
assert(typeCounts.MAKRO_DENIZ_PDHES >= 3, 'Expected 3+ MAKRO_DENIZ_PDHES sites');
assert(typeCounts.MIKRO_DENIZ_PDHES >= 2, 'Expected 2+ MIKRO_DENIZ_PDHES sites');
console.log('✓ PDHES type distribution:', JSON.stringify(typeCounts));

for (const site of data) {
  assert(site.pdhesType, site.id + ' missing pdhesType');
  assert(site.capacityClass, site.id + ' missing capacityClass');
  assert(site.technologyReadiness, site.id + ' missing technologyReadiness');
  assert(site.confidence, site.id + ' missing confidence');
  assert(site.coordinates && typeof site.coordinates === 'object', site.id + ' missing coordinates');
  for (const key of coordinateKeys) {
    assert(Object.prototype.hasOwnProperty.call(site.coordinates, key), site.id + ' missing coordinates.' + key);
  }
  assert(Array.isArray(site.coordinates.mapAnchor) && site.coordinates.mapAnchor.length === 2, site.id + ' has invalid mapAnchor');
  assert(['high', 'medium', 'low'].includes(site.locationConfidence), site.id + ' invalid locationConfidence');
  assert(typeof site.isApproximate === 'boolean', site.id + ' missing isApproximate boolean');
  assert(/^\d{4}-\d{2}-\d{2}$/.test(site.verifiedAt), site.id + ' invalid verifiedAt');
  assert(Array.isArray(site.locationEvidence) && site.locationEvidence.length > 0, site.id + ' missing locationEvidence');
  assert(site.layout3D && site.layout3D.scale, site.id + ' missing layout3D');
  if (site.concept === 'sea') {
    assert(Array.isArray(site.coordinates.intakeOutfall), site.id + ' sea site missing intakeOutfall');
    assert(site.lowerReservoirType === 'sea', site.id + ' sea site lowerReservoirType must be sea');
  }
}
console.log('✓ Candidate schema and location evidence valid');

assert(html.includes('data-tab="threeD"') && html.includes('3D Gösterim'), '3D Gösterim tab missing');
assert(html.includes('data-tab="pdhes"') && html.includes('PDHES NEDİR'), 'PDHES NEDİR tab missing');
assert(html.includes('data-content-key='), 'Editable content key attributes missing');
assert(html.includes('admin123'), 'Admin demo password missing');
assert(html.includes('pspp-content-overrides-v1'), 'Content override storage key missing');
assert(html.includes('candidate-approx-halo'), 'Approximate location halo layer missing');
assert(html.includes('candidate-old-points'), 'Old coordinate layer missing');
console.log('✓ New tab, admin, and map hook markup present');

assert(grid.type === 'FeatureCollection' && Array.isArray(grid.features), 'GRID_ASSETS should be a FeatureCollection');
assert(grid.features.length >= 3900, 'GRID_ASSETS feature count unexpectedly low: ' + grid.features.length);
console.log('✓ GRID_ASSETS unchanged and loadable:', grid.features.length);

const app = loadAppExports();
assert(app.CONTENT && app.CONTENT.home && app.CONTENT.pdhesWhatIs, 'CONTENT defaults missing');
assert(app.WORLD_EXAMPLES && app.WORLD_EXAMPLES.length >= 10, 'WORLD_EXAMPLES missing seed examples');
assert(app.FALLBACK_SITES && app.FALLBACK_SITES.length >= 2, 'Fallback demo data missing');
assert(typeof app.normalizeSite === 'function', 'normalizeSite missing');
assert(typeof app.getContent === 'function', 'getContent missing');
assert(typeof app.mergeContentOverrides === 'function', 'mergeContentOverrides missing');
assert(app.getContent('home.heroTitle'), 'getContent should resolve dotted content keys');
console.log('✓ Content, world examples, and fallback exports present');

const normalized = app.normalizeSite(data.find((site) => site.id === 'tasucu'));
assert(normalized.lat === normalized.coordinates.mapAnchor[1], 'normalizeSite should preserve lat from mapAnchor');
assert(normalized.lon === normalized.coordinates.mapAnchor[0], 'normalizeSite should preserve lon from mapAnchor');
const layoutData = app.buildLayout(data[0]);
assert(layoutData.blocks.features.length >= 5, 'Layout should generate detailed component blocks');
const requiredComponentProps = [
  'label',
  'type',
  'pdhesComponentType',
  'height',
  'base',
  'color',
  'confidence',
  'source',
  'capexCategory',
  'riskCategory',
  'description',
  'editableByAdmin'
];
for (const feature of layoutData.blocks.features) {
  for (const prop of requiredComponentProps) {
    assert(Object.prototype.hasOwnProperty.call(feature.properties, prop), 'Component missing property ' + prop);
  }
}
assert(layoutData.water.features.some((f) => f.properties.key === 'intake_outfall'), 'Sea layout missing intake/outfall water feature');
console.log('✓ 3D layout component contract valid');

console.log('\nAll smoke checks passed.');
