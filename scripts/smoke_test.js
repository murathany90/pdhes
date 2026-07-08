const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

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
const workspaceDataSource = read('app/src/utils/workspaceData.ts');
const workspaceSource = read('app/src/pages/WorkspacePage.tsx');
const mapProviderSource = read('app/src/utils/mapProviders.ts');
const worldExamplesSource = read('app/src/data/worldExamples.ts');
const deployWorkflow = read('.github/workflows/deploy-pages.yml');

assert(Array.isArray(sites) && sites.length === 20, `Expected exactly 20 Turkey candidates, got ${sites.length}`);
assert(new Set(sites.map((site) => site.id)).size === sites.length, 'Candidate IDs must be unique');
assert(!sites.some((site) => site.id === 'presenzano'), 'Presenzano must not be a Turkey candidate');

const sourceCounts = {};
const cycleTypes = new Set(['OPEN_LOOP', 'CLOSED_LOOP', 'SEA_LOWER_RESERVOIR']);
const legacyFields = ['pdhesType', 'concept', 'conceptLabel', 'lat', 'lon', 'powerMW', 'capexBn', 'revenueM'];
for (const site of sites) {
  assert(typeof site.name === 'string' && site.name.trim(), `${site.id} is missing name`);
  assert(site.country === 'Türkiye', `${site.id} must be a Turkey candidate`);
  assert(['JICA_EIE_16', 'SEA_WATER_PROTOTYPE_TOP4'].includes(site.sourceGroup), `${site.id} has invalid sourceGroup`);
  assert(Number.isFinite(site.capacityMW), `${site.id} has invalid capacityMW`);
  assert(site.technicalClassification && cycleTypes.has(site.technicalClassification.cycleType), `${site.id} has invalid cycleType`);
  assert(site.coordinates?.coordinateSystem === 'WGS84', `${site.id} must use WGS84 coordinates`);
  assert(site.coordinates?.coordinateOrder === '[lon, lat]', `${site.id} must use [lon, lat] coordinate order`);
  assert(Array.isArray(site.coordinates?.mapAnchor) && site.coordinates.mapAnchor.length === 2, `${site.id} has invalid mapAnchor`);
  assert(Array.isArray(site.risks), `${site.id} is missing risks`);
  assert(Array.isArray(site.assumptions), `${site.id} is missing assumptions`);
  assert(site.model3d?.terrainMode, `${site.id} is missing model3d`);
  for (const field of legacyFields) {
    assert(!(field in site), `${site.id} still contains legacy field ${field}`);
  }
  sourceCounts[site.sourceGroup] = (sourceCounts[site.sourceGroup] || 0) + 1;
}

assert(sourceCounts.JICA_EIE_16 === 16, `Expected 16 JICA/EIE candidates, got ${sourceCounts.JICA_EIE_16 || 0}`);
assert(sourceCounts.SEA_WATER_PROTOTYPE_TOP4 === 4, `Expected 4 seawater top candidates, got ${sourceCounts.SEA_WATER_PROTOTYPE_TOP4 || 0}`);

const seaTop4 = sites.filter((site) => site.sourceGroup === 'SEA_WATER_PROTOTYPE_TOP4');
assert(seaTop4.map((site) => site.id).join(',') === 'tasucu,bozyazi_anamur,karaburun,finike_kumluca', 'Unexpected seawater top4 ordering');
assert(seaTop4.map((site) => site.score).join(',') === '79,76,72,71', 'Unexpected seawater top4 score ordering');
assert(seaTop4.every((site) => site.technicalClassification.cycleType === 'SEA_LOWER_RESERVOIR'), 'Seawater top4 must use SEA_LOWER_RESERVOIR cycle type');

const sariyar = sites.find((site) => site.id === 'jica-sariyar-pspp');
assert(sariyar?.capacityMW === 1000, 'Sariyar JICA capacity must be 1000 MW');
assert(sariyar?.projectFlowCms === 270, 'Sariyar JICA project flow must be 270 cms');
assert(sariyar?.headM === 434, 'Sariyar JICA head must be 434 m');
assert(sariyar?.coordinates.coordinateConfidence === 'fallback-approximate', 'JICA coordinates must remain fallback-approximate');

const presenzanoBlock = worldExamplesSource.match(/\{\s*id: 'presenzano'[\s\S]*?\n  \},/)?.[0] || '';
assert(presenzanoBlock, 'Presenzano must be present in WORLD_EXAMPLES');
assert(!presenzanoBlock.includes('wikiUrl'), 'Presenzano must not invent a wikiUrl');

assert(grid.type === 'FeatureCollection', 'Grid data must be a FeatureCollection');
assert(Array.isArray(grid.features), 'Grid features must be an array');

assert(typeSource.includes('export type CandidateSourceGroup'), 'CandidateSourceGroup type is missing');
assert(typeSource.includes('technicalClassification: TechnicalClassification'), 'Site technicalClassification contract is missing');
assert(schemaSource.includes('LEGACY_FIELDS'), 'Runtime legacy-field rejection is missing');
assert(workspaceDataSource.includes('WORKSPACE_SCHEMA_VERSION = 3'), 'Workspace schemaVersion 3 is missing');
assert(appSource.includes('isLocalWorkspaceEnabled'), 'Local workspace feature gate is missing');
assert(workspaceSource.includes('schemaVersion 3'), 'Workspace v3 disclosure is missing');
assert(!appSource.includes('admin123') && !workspaceSource.includes('admin123'), 'Fake admin credential remains in active app');
assert(mapProviderSource.includes('OpenStreetMap contributors'), 'Map attribution is missing');
assert(deployWorkflow.includes('VITE_BASE_PATH: /pdhes/'), 'GitHub Pages base path is missing');
assert(deployWorkflow.includes('path: app/dist'), 'Pages workflow must publish only app/dist');

console.log(`OK ${sites.length} candidates validated: ${JSON.stringify(sourceCounts)}`);
console.log(`OK seawater top4: ${seaTop4.map((site) => `${site.id}:${site.score}`).join(', ')}`);
console.log(`OK ${grid.features.length} grid features loadable`);
console.log('OK schema v3, local workspace, attribution, Pages workflow and Presenzano world example present');
