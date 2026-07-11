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
  
  // Update Excel Data and Recalculate FIRST
  const cleanId = siteId.replace(/_/g, '');
  const excelIndex = excelData.findIndex(e => e.normalizedName.includes(cleanId));
  
  if (excelIndex !== -1) {
    const candidate = excelData[excelIndex];
    
    // Apply new head and volume from 3D footprint
    if (exportedSite.headM !== undefined) {
      candidate.grossHeadM = exportedSite.headM;
      candidate.netHeadM = exportedSite.headM * 0.97; // Rough net head (3% loss)
    }
    if (exportedSite.activeVolumeHm3 !== undefined) {
      candidate.upperActiveVolumeHm3 = exportedSite.activeVolumeHm3;
    }
    
    // CALCULATE NEW ENERGY based on Volume and Head (Keeping Capacity Constant)
    const turbineRatio = (PDHES_EXCEL_INPUT_DEFAULTS.turbineGeneratorEfficiencyPct > 1 
      ? PDHES_EXCEL_INPUT_DEFAULTS.turbineGeneratorEfficiencyPct / 100 
      : PDHES_EXCEL_INPUT_DEFAULTS.turbineGeneratorEfficiencyPct) || 0.9;
      
    const volumeBasedEnergyMwh = PDHES_EXCEL_INPUT_DEFAULTS.waterDensityKgM3 
                               * PDHES_EXCEL_INPUT_DEFAULTS.gravityMps2 
                               * candidate.netHeadM 
                               * (candidate.upperActiveVolumeHm3 * 1_000_000) 
                               * turbineRatio 
                               / 3_600_000_000;
                               
    // Overwrite the energy limit in the candidate so the calculation engine uses it
    candidate.energyMwh = volumeBasedEnergyMwh;
    if (candidate.capacityMw > 0) {
      candidate.storageHours = volumeBasedEnergyMwh / candidate.capacityMw;
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
    console.log(`Updated Excel Data & Financials for ${siteId} -> New Payback: ${candidate.paybackYears} yrs`);
    
    // NOW update data.json
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
      if (exportedSite.components_detail) target.components_detail = exportedSite.components_detail;
      
      // SYNC FINANCIALS to Map Sidebar (data.json)
      target.capacityMW = candidate.capacityMw;
      if (candidate.annualGenerationGwh) target.energyGWh = candidate.annualGenerationGwh; 
      // Note: MapPage expects site.energyGWh to be storage capacity or generation. Actually wait:
      // In MapPage: `Depolama Kap. {site.energyGWh * 1000} MWh`. So site.energyGWh is STORAGE energy.
      target.energyGWh = candidate.energyMwh / 1000;
      
      if (candidate.capexMUsd) target.capexUsdBn = candidate.capexMUsd / 1000;
      if (candidate.annualTotalRevenueMUsd) target.annualRevenueUsdM = candidate.annualTotalRevenueMUsd;
      if (candidate.paybackYears) target.paybackYear = Math.round(candidate.paybackYears * 10) / 10;
    }
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
