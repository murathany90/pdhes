import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const maplibreWorkerAssets = () => ({
  name: 'maplibre-worker-assets',
  generateBundle() {
    this.emitFile({
      type: 'asset',
      fileName: 'assets/maplibre-gl-shared.mjs',
      source: readFileSync(
        resolve(process.cwd(), 'node_modules/maplibre-gl/dist/maplibre-gl-shared.mjs'),
      ),
    });
  },
});

export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react(), maplibreWorkerAssets(), {
    name: 'release-metadata',
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'version.json', source: JSON.stringify({
        version: '2.4.6', commit: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
      }) });
    },
  }],
});
