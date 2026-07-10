import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'public', 'data.json');
const footprintsDir = path.join(process.cwd(), 'public', 'footprints');

if (!fs.existsSync(footprintsDir)) {
  fs.mkdirSync(footprintsDir, { recursive: true });
}

const dataStr = fs.readFileSync(dataPath, 'utf-8');
const data = JSON.parse(dataStr);

data.forEach((site) => {
  if (site.layout3D && site.layout3D.componentFootprints && site.layout3D.componentFootprints.length > 0) {
    const footprintPath = path.join(footprintsDir, `${site.id}.json`);
    fs.writeFileSync(footprintPath, JSON.stringify(site.layout3D.componentFootprints, null, 2), 'utf-8');
    
    // Remove it from the main data.json to reduce size
    delete site.layout3D.componentFootprints;
  }
});

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
console.log('Footprints separated successfully.');
