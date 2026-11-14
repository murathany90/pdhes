// Browser-based visual smoke test. Intended to run with a real Chromium
// renderer on a GitHub-hosted runner, not with mocked react-three-fiber.
// Captures both the first idle view and the post-camera-click frame.
import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import fs from 'node:fs/promises';
import path from 'node:path';

const output = process.env.PDHES_VISUAL_OUTPUT ?? 'visual-artifacts';
const port = Number(process.env.PDHES_PREVIEW_PORT ?? 4173);
await fs.mkdir(output, { recursive: true });
const events = [];
const browser = await chromium.launch({
  headless: true,
  args: [
    '--enable-unsafe-swiftshader',
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--ignore-gpu-blocklist',
    '--disable-dev-shm-usage',
  ],
});
const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
page.on('console', (message) => {
  if (message.type() === 'error' || /WebGLRenderer|THREE.Clock|context lost/i.test(message.text()))
    events.push(`console:${message.type()}: ${message.text()}`);
});
page.on('pageerror', (error) => events.push(`pageerror: ${error.message}`));

async function capture(label) {
  const canvas = page.locator('.threed-scene-stage canvas').first();
  await canvas.waitFor({ state: 'visible', timeout: 45000 });
  await page.screenshot({ path: path.join(output, `${label}-full.png`), animations: 'disabled' });
  const imageBuffer = await canvas.screenshot({ path: path.join(output, `${label}-canvas.png`) });
  const image = PNG.sync.read(imageBuffer);
  let colored = 0;
  let dark = 0;
  const palette = new Set();
  const pixels = image.width * image.height;
  // Ignore the top 80 pixels to exclude overlay camera buttons.
  for (let y = Math.min(80, image.height); y < image.height; y += 2) {
    for (let x = 0; x < image.width; x += 2) {
      const index = (y * image.width + x) * 4;
      const [r, g, b] = image.data.subarray(index, index + 3);
      if (b > r + 22 && b > g + 5) colored++;
      if (Math.max(r, g, b) < 175) dark++;
      palette.add(`${Math.floor(r / 16)}.${Math.floor(g / 16)}.${Math.floor(b / 16)}`);
    }
  }
  const samples = (Math.ceil(image.width / 2) * Math.ceil((image.height - Math.min(80, image.height)) / 2));
  return {
    width: image.width, height: image.height, pixels,
    coloredFraction: colored / samples,
    darkFraction: dark / samples,
    paletteBins: palette.size,
    screenshot: `${label}-full.png`,
  };
}
let metrics;
try {
  await page.goto(`http://127.0.0.1:${port}/#/3d`, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.locator('.threed-scene-stage canvas').waitFor({ state: 'visible', timeout: 45000 });
  await page.waitForTimeout(4500);
  const initial = await capture('first-open');
  // Reproduce the viewport dimensions supplied in the user's screenshots.
  await page.setViewportSize({ width: 1815, height: 824 });
  await page.waitForTimeout(1400);
  const userViewport = await capture('first-open-1815x824');
  await page.getByRole('button', { name: 'Santral', exact: true }).click();
  await page.waitForTimeout(1200);
  const clicked = await capture('camera-plant');
  const loss = await page.getByText(/WebGL görüntü bağlamı kaybedildi/).count();
  metrics = { initial, userViewport, clicked, contextLostWarnings: loss, consoleMessages: events };
  await fs.writeFile(path.join(output, 'metrics.json'), JSON.stringify(metrics, null, 2));
  console.log('VISUAL_METRICS ' + JSON.stringify(metrics));

  if (loss > 0) throw Error('WebGL context was lost during the visual smoke test');
  if (initial.paletteBins < 12 || initial.coloredFraction < 0.045) {
    throw Error('Initial 3D subject occupies too little canvas or is blank: ' + JSON.stringify(initial));
  }
  if (userViewport.paletteBins < 12 || userViewport.coloredFraction < 0.045) {
    throw Error('3D subject is too small or blank at actual 1815x824 user viewport: ' + JSON.stringify(userViewport));
  }
  if (clicked.paletteBins < 12 || clicked.coloredFraction < 0.001) {
    throw Error('3D canvas is blank after camera preset: ' + JSON.stringify(clicked));
  }
} finally {
  await browser.close();
}
