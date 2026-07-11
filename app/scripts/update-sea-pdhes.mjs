import fs from 'fs';

const excelDataPath = './src/data/generated/pdhesCandidateExcelData.ts';
const dataJsonPath = './public/data.json';

const updates = {
  tasucu: {
    grossHeadM: 500,
    netHeadM: 485,
    capexMUsd: 167.08,
    capexIntensityUsdKw: 1670.77,
    totalScore: 54.17,
    paybackYears: 10.46,
    penstockLengthM: 1794,
    upperReservoirElevationM: 500,
  },
  bozyazi_anamur: {
    grossHeadM: 600,
    netHeadM: 582,
    capexMUsd: 167.27,
    capexIntensityUsdKw: 1672.75,
    totalScore: 58.73,
    paybackYears: 10.47,
    penstockLengthM: 2379,
    upperReservoirElevationM: 600,
  },
  karaburun: {
    grossHeadM: 900,
    netHeadM: 873,
    capexMUsd: 210.80,
    capexIntensityUsdKw: 2107.96,
    totalScore: 62.18,
    paybackYears: 13.76,
    penstockLengthM: 3787,
    upperReservoirElevationM: 900,
  }
};

// 1. Update data.json
let dataJsonContent = fs.readFileSync(dataJsonPath, 'utf8');
let dataJson = JSON.parse(dataJsonContent);

for (let site of dataJson) {
  if (site.id === 'tasucu' || site.id === 'bozyazi_anamur' || site.id === 'karaburun') {
    const update = updates[site.id];
    site.capacityMW = 100;
    site.energyGWh = 0.7; // 700 MWh
    
    site.headM = update.grossHeadM;
    site.capexUsdBn = update.capexMUsd / 1000;
    site.paybackYear = update.paybackYears;
    site.score = Math.round(update.totalScore);
    site.penstockLengthM = update.penstockLengthM;
    
    if (site.components_detail && site.components_detail.upper_reservoir) {
        site.components_detail.upper_reservoir.elevation_m = update.upperReservoirElevationM;
    }
  }
}

fs.writeFileSync(dataJsonPath, JSON.stringify(dataJson, null, 2));
console.log('Updated data.json');

// 2. Update pdhesCandidateExcelData.ts
let excelTsContent = fs.readFileSync(excelDataPath, 'utf8');
const match = excelTsContent.match(/export const PDHES_CANDIDATE_EXCEL_DATA\s*:\s*[^\s]+\s*=\s*(\[\s*\{[\s\S]*\}\s*\]);/);
if (match) {
  let jsonString = match[1];
  let excelData = eval('(' + jsonString + ')');
  
  for (let candidate of excelData) {
    let update = null;
    if (candidate.candidateName.includes("Taşucu")) update = updates.tasucu;
    else if (candidate.candidateName.includes("Bozyazı")) update = updates.bozyazi_anamur;
    else if (candidate.candidateName.includes("Karaburun")) update = updates.karaburun;
    
    if (update) {
      candidate.capacityMw = 100;
      candidate.storageHours = 7;
      candidate.energyMwh = 700;
      candidate.grossHeadM = update.grossHeadM;
      candidate.netHeadM = update.netHeadM;
      candidate.upperReservoirElevationM = update.upperReservoirElevationM;
      candidate.capexMUsd = update.capexMUsd;
      candidate.capexIntensityUsdKw = update.capexIntensityUsdKw;
      candidate.totalScore = update.totalScore;
      candidate.paybackYears = update.paybackYears;
    }
  }
  
  const newJsonString = JSON.stringify(excelData, null, 2);
  const newTsContent = excelTsContent.replace(match[1], newJsonString);
  fs.writeFileSync(excelDataPath, newTsContent);
  console.log('Updated pdhesCandidateExcelData.ts');
} else {
  console.log('Could not find excel data array in ts file');
}
