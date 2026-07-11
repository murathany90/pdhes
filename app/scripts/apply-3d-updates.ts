import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Because we're in TypeScript, we can import from the source files directly using tsx
import { PDHES_CANDIDATE_EXCEL_DATA, PDHES_EXCEL_INPUT_DEFAULTS } from '../src/data/generated/pdhesCandidateExcelData.ts';
import { createCalculationInputsFromExcel, calculatePdhesFinancials } from '../src/utils/pdhes/calculationEngine.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');
const appDir = path.resolve(rootDir, 'app');

const dataJsonPath = path.join(appDir, 'public', 'data.json');
const exportsDir = path.join(rootDir, 'docs', '3d_yeni_koordinatlar');
const excelDataTsPath = path.join(appDir, 'src', 'data', 'generated', 'pdhesCandidateExcelData.ts');

const jsonFiles = fs.readdirSync(exportsDir).filter(f => f.endsWith('.json'));

let dataJson = JSON.parse(fs.readFileSync(dataJsonPath, 'utf8'));
let excelData = [...PDHES_CANDIDATE_EXCEL_DATA];

for (const jsonFile of jsonFiles) {
  const exportPath = path.join(exportsDir, jsonFile);
  const exportedSite = JSON.parse(fs.readFileSync(exportPath, 'utf8'));
  const siteId = exportedSite.id;
  
  if (!siteId) continue;
  
  // 1. Update data.json
  const dataJsonIndex = dataJson.findIndex((s: any) => s.id === siteId);
  if (dataJsonIndex !== -1) {
    const target = dataJson[dataJsonIndex];
    // Copy coordinates
    target.coordinates = exportedSite.coordinates;
    // Copy topographic data
    if (exportedSite.headM !== undefined) target.headM = exportedSite.headM;
    if (exportedSite.activeVolumeHm3 !== undefined) target.activeVolumeHm3 = exportedSite.activeVolumeHm3;
    if (exportedSite.penstockLengthM !== undefined) target.penstockLengthM = exportedSite.penstockLengthM;
    if (exportedSite.tunnelLengthKm !== undefined) target.tunnelLengthKm = exportedSite.tunnelLengthKm;
    if (exportedSite.layout3D) target.layout3D = exportedSite.layout3D;
    
    // Copy components_detail if it exists (from layout3D or directly if the UI attached it)
    if (exportedSite.components_detail) target.components_detail = exportedSite.components_detail;
  }
  
  // 2. Update Excel Data and Recalculate
  // The siteId usually matches normalizedName or we can find it by some id. 
  // Let's find by normalizedName (tasucu -> tasucudenizsuyupspp, vb.)
  // We'll match by checking if normalizedName starts with siteId without underscores
  const cleanId = siteId.replace(/_/g, '');
  const excelIndex = excelData.findIndex(e => e.normalizedName.includes(cleanId));
  
  if (excelIndex !== -1) {
    const candidate = excelData[excelIndex];
    
    if (exportedSite.headM !== undefined) {
      candidate.grossHeadM = exportedSite.headM;
      candidate.netHeadM = exportedSite.headM * 0.97; // Rough net head (3% loss)
    }
    if (exportedSite.activeVolumeHm3 !== undefined) {
      candidate.upperActiveVolumeHm3 = exportedSite.activeVolumeHm3;
    }
    
    // Recalculate using CalculationEngine
    const inputs = createCalculationInputsFromExcel(candidate, PDHES_EXCEL_INPUT_DEFAULTS);
    const outputs = calculatePdhesFinancials(inputs);
    
    // Update calculated values
    candidate.designFlowCms = outputs.designFlowCms;
    candidate.pumpingEnergyPerCycleMwh = outputs.pumpingEnergyPerCycleMwh;
    candidate.pumpPowerMw = outputs.pumpPowerMw;
    candidate.annualGenerationGwh = outputs.annualGenerationGwh;
    candidate.grossGenerationRevenueMUsd = outputs.grossGenerationRevenueMUsd;
    candidate.pumpingEnergyCostMUsd = outputs.pumpingEnergyCostMUsd;
    candidate.netArbitrageRevenueMUsd = outputs.netArbitrageRevenueMUsd;
    candidate.ancillaryServiceRevenueMUsd = outputs.ancillaryServiceRevenueMUsd;
    candidate.capacityMechanismRevenueMUsd = outputs.capacityMechanismRevenueMUsd;
    candidate.annualTotalRevenueMUsd = outputs.annualTotalRevenueMUsd;
    candidate.capexMUsd = outputs.capexMUsd;
    candidate.omMUsdPerYear = outputs.omMUsdPerYear;
    candidate.netCashFlowMUsdPerYear = outputs.netCashFlowMUsdPerYear;
    candidate.paybackYears = outputs.paybackYears;
    
    excelData[excelIndex] = candidate;
    console.log(`Updated Excel Data for ${siteId}`);
  }
}

// Write data.json
fs.writeFileSync(dataJsonPath, JSON.stringify(dataJson, null, 2), 'utf8');

// Write pdhesCandidateExcelData.ts
const tsSource = `import type { PdhesCandidateExcelCalculatedData, PdhesExcelInputDefaults } from "../../utils/pdhes/types";

// Bu dosya app/scripts/generate-pdhes-candidate-data.mjs veya apply-3d-updates.ts tarafından üretilir.
// Excel koordinat ve Google Earth/link kolonları bilinçli olarak export edilmez.
export const PDHES_EXCEL_INPUT_DEFAULTS: PdhesExcelInputDefaults = ${JSON.stringify(PDHES_EXCEL_INPUT_DEFAULTS, null, 2)};

export const PDHES_CANDIDATE_EXCEL_DATA: PdhesCandidateExcelCalculatedData[] = ${JSON.stringify(excelData, null, 2)};
`;

fs.writeFileSync(excelDataTsPath, tsSource, 'utf8');

console.log('Update completed successfully.');
