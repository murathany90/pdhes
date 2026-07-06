const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const sites = readJson('app/public/data.json');
const grid = readJson('app/public/grid_assets.json');
const appSource = read('app/src/App.tsx');
const typeSource = read('app/src/types/site.ts');
const schemaSource = read('app/src/utils/siteSchema.ts');
const workspaceSource = read('app/src/pages/WorkspacePage.tsx');
const mapProviderSource = read('app/src/utils/mapProviders.ts');
const deployWorkflow = read('.github/workflows/deploy-pages.yml');

assert(Array.isArray(sites) && sites.length >= 20, `Expected at least 20 candidates, got ${sites.length}`);
assert(new Set(sites.map((site) => site.id)).size === sites.length, 'Candidate IDs must be unique');

const canonicalTypes = new Set(['CLOSED_LOOP', 'OPEN_LOOP', 'SEA_WATER', 'PROTOTYPE']);
const typeCounts = {};
for (const site of sites) {
  assert(canonicalTypes.has(site.pdhesType), `${site.id} has invalid pdhesType ${site.pdhesType}`);
  assert(typeof site.name === 'string' && site.name.trim(), `${site.id} is missing name`);
  assert(Number.isFinite(site.lat) && Number.isFinite(site.lon), `${site.id} has invalid map anchor`);
  assert(site.layout && Array.isArray(site.layout.upper) && Array.isArray(site.layout.lower), `${site.id} has invalid layout`);
  const hasEvidence = (Array.isArray(site.locationEvidence) && site.locationEvidence.length > 0)
    || (Array.isArray(site.evidence) && site.evidence.length > 0);
  assert(hasEvidence, `${site.id} is missing evidence`);
  typeCounts[site.pdhesType] = (typeCounts[site.pdhesType] || 0) + 1;
}

for (const type of canonicalTypes) {
  assert(typeCounts[type] > 0, `Expected at least one ${type} candidate`);
}

assert(grid.type === 'FeatureCollection', 'Grid data must be a FeatureCollection');
assert(Array.isArray(grid.features) && grid.features.length >= 3900, 'Grid feature count is unexpectedly low');

assert(typeSource.includes("'CLOSED_LOOP' | 'OPEN_LOOP' | 'SEA_WATER' | 'PROTOTYPE'"), 'Canonical PdhesType is missing');
assert(schemaSource.includes('validateSites'), 'Runtime site validation is missing');
assert(appSource.includes('isLocalWorkspaceEnabled'), 'Local workspace feature gate is missing');
assert(workspaceSource.includes('Yerel Çalışma Alanı'), 'Local workspace disclosure is missing');
assert(!appSource.includes('admin123') && !workspaceSource.includes('admin123'), 'Fake admin credential remains in active app');
assert(mapProviderSource.includes('OpenStreetMap contributors'), 'Map attribution is missing');
assert(deployWorkflow.includes('VITE_BASE_PATH: /TR_PDHES_Potansiyel/'), 'GitHub Pages base path is missing');
assert(deployWorkflow.includes('path: app/dist'), 'Pages workflow must publish only app/dist');

console.log(`✓ ${sites.length} candidates validated: ${JSON.stringify(typeCounts)}`);
console.log(`✓ ${grid.features.length} grid features loadable`);
console.log('✓ Canonical schema, local workspace, attribution and Pages workflow present');
