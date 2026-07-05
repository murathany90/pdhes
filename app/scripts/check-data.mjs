import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const pairs = [
  ['data.json', '../data.json'],
  ['grid_assets.json', '../grid_assets.json'],
];

let failed = false;

for (const [publicName, rootPath] of pairs) {
  const publicData = await readFile(resolve('public', publicName));
  const rootData = await readFile(resolve(rootPath));
  if (!publicData.equals(rootData)) {
    failed = true;
    console.error(`${publicName}: kök ve app/public kopyaları farklı.`);
  } else {
    console.log(`✓ ${publicName}: kopyalar eşleşiyor`);
  }
}

if (failed) process.exitCode = 1;
