# PDHES Public Release Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the feature-preserving public-viewer/local-workspace architecture, canonical data contract, GitHub Pages deployment, safety controls, documentation and verification required by `public_repo.md`.

**Architecture:** Keep `app/` as the only deployable application. Introduce small pure utility modules for schema validation, migration, public asset URLs and calculations; keep Zustand as the runtime store; expose editing as an opt-in local workspace rather than fake authentication; lazy-load WebGL-heavy pages and make map attribution explicit.

**Tech Stack:** Vite 8, React 19, TypeScript 6, Zustand 5, MapLibre GL JS 5, Three.js/React Three Fiber, Vitest, Testing Library, GitHub Pages and GitHub Actions.

---

### Task 1: Test Harness and Canonical PDHES Contract

**Files:**
- Modify: `app/package.json`
- Modify: `app/package-lock.json`
- Modify: `app/src/types/site.ts`
- Create: `app/src/utils/siteSchema.ts`
- Create: `app/src/utils/siteSchema.test.ts`
- Create: `app/src/utils/testFixtures.ts`

- [ ] **Step 1: Install the test dependencies**

Run:

```powershell
npm install --save-dev vitest jsdom @testing-library/react @testing-library/jest-dom
```

Add `test`, `test:run`, `typecheck`, `check:data` and `check` scripts.

- [ ] **Step 2: Write failing schema and enum tests**

Tests must prove that the current JSON uses only:

```ts
type PdhesType = 'CLOSED_LOOP' | 'OPEN_LOOP' | 'SEA_WATER' | 'PROTOTYPE';
```

They must reject duplicate IDs, malformed coordinates, non-finite numbers and invalid types, and accept the real `data.json`.

- [ ] **Step 3: Run the focused test and observe RED**

Run:

```powershell
npm run test:run -- src/utils/siteSchema.test.ts
```

Expected: failure because `validateSites` and migration helpers do not exist.

- [ ] **Step 4: Implement validation and legacy type migration**

Create pure functions:

```ts
export function normalizePdhesType(value: unknown): PdhesType | null;
export function validateSites(value: unknown): SiteValidationResult;
export function migrateSiteRecord(value: unknown): Site | null;
```

Legacy values map to canonical values without changing current canonical records.

- [ ] **Step 5: Run GREEN and typecheck**

```powershell
npm run test:run -- src/utils/siteSchema.test.ts
npm run typecheck
```

### Task 2: Versioned Local Workspace Persistence

**Files:**
- Modify: `app/src/stores/useSiteStore.ts`
- Modify: `app/src/stores/useAdminStore.ts`
- Create: `app/src/utils/workspaceData.ts`
- Create: `app/src/utils/workspaceData.test.ts`

- [ ] **Step 1: Write failing migration/import/export tests**

Cover:

- Current flat arrays.
- Legacy type values.
- Versioned `{ schemaVersion, sites }` imports.
- Invalid IDs and oversized input.
- Export metadata.
- Corrupt localStorage values.

- [ ] **Step 2: Verify RED**

```powershell
npm run test:run -- src/utils/workspaceData.test.ts
```

- [ ] **Step 3: Implement atomic versioned workspace helpers**

Use:

```ts
export const WORKSPACE_SCHEMA_VERSION = 2;
export function parseWorkspaceImport(text: string): WorkspaceParseResult;
export function serializeWorkspaceSites(sites: Site[]): string;
```

Do not persist failed imports. Keep one-time reads of legacy storage keys.

- [ ] **Step 4: Integrate helpers into Zustand stores**

Remove raw `as Site[]` trust paths and direct unvalidated import. Rename authentication semantics in the content store to local-workspace semantics.

- [ ] **Step 5: Run tests**

```powershell
npm run test:run -- src/utils/workspaceData.test.ts src/utils/siteSchema.test.ts
```

### Task 3: Public Asset Paths and Data Loading

**Files:**
- Create: `app/src/utils/publicUrl.ts`
- Create: `app/src/utils/publicUrl.test.ts`
- Create: `app/src/hooks/useAppData.ts`
- Modify: `app/src/App.tsx`
- Modify: `app/vite.config.ts`

- [ ] **Step 1: Write failing URL tests**

Prove `publicAssetUrl('data.json', '/TR_PDHES_Potansiyel/')` resolves under the project base and never returns `/data.json`.

- [ ] **Step 2: Verify RED**

```powershell
npm run test:run -- src/utils/publicUrl.test.ts
```

- [ ] **Step 3: Implement base-aware public URLs**

Use `import.meta.env.BASE_URL` at the call site and a pure helper for tests.

- [ ] **Step 4: Extract validated parallel data loading**

`useAppData` loads candidate and grid data in parallel, validates candidate data, reports actionable errors and avoids `Date.now()` cache busting in production.

- [ ] **Step 5: Configure Vite base**

Use `process.env.VITE_BASE_PATH || '/'`, preserving local development.

- [ ] **Step 6: Run focused tests and build**

```powershell
npm run test:run -- src/utils/publicUrl.test.ts src/utils/siteSchema.test.ts
npm run build
```

### Task 4: Public Viewer and Opt-in Local Workspace

**Files:**
- Modify: `app/src/App.tsx`
- Move: `app/src/pages/AdminPage.tsx` to `app/src/pages/WorkspacePage.tsx`
- Modify: `app/src/pages/SiteEditorPage.tsx`
- Modify: `app/src/pages/ThreeDEditorPage.tsx`
- Modify: `app/src/pages/SettingsPage.tsx`
- Modify: `app/src/stores/useAdminStore.ts`
- Create: `app/src/utils/workspaceMode.ts`
- Create: `app/src/utils/workspaceMode.test.ts`

- [ ] **Step 1: Write failing workspace-mode tests**

`?editor=1` enables the workspace; normal URLs do not. No password is involved.

- [ ] **Step 2: Verify RED**

```powershell
npm run test:run -- src/utils/workspaceMode.test.ts
```

- [ ] **Step 3: Implement the pure workspace flag**

```ts
export function isLocalWorkspaceEnabled(search: string): boolean;
```

- [ ] **Step 4: Replace fake admin UI without removing features**

Use the visible name `Yerel Çalışma Alanı`, preserve content/site/layout editing and imports/exports, and display the local-only warning.

- [ ] **Step 5: Remove `admin123` from active app and README**

Legacy files may retain historical content only if clearly marked and excluded from deployment; current source and docs must not present it as a credential.

- [ ] **Step 6: Run tests and build**

```powershell
npm run test:run
npm run build
```

### Task 5: Safe Content Rendering and Application Errors

**Files:**
- Modify: `app/src/pages/PdhesPage.tsx`
- Modify: `app/src/pages/DataPage.tsx`
- Create: `app/src/components/ui/AppErrorState.tsx`
- Create: `app/src/components/ui/DisclaimerBanner.tsx`
- Modify: `app/src/App.tsx`
- Create: `app/src/pages/PdhesPage.test.tsx`

- [ ] **Step 1: Write a failing content-safety test**

Store `<img src=x onerror=alert(1)>` as an override and assert that it renders as text, not an image.

- [ ] **Step 2: Verify RED**

```powershell
npm run test:run -- src/pages/PdhesPage.test.tsx
```

- [ ] **Step 3: Remove editable `dangerouslySetInnerHTML` paths**

Render content as React text. Keep formatting in static JSX rather than user-controlled HTML.

- [ ] **Step 4: Add loading/error/disclaimer surfaces**

Data load failures must not leave a blank app. The disclaimer is visible in the shell and links to methodology/source documentation.

- [ ] **Step 5: Run tests**

```powershell
npm run test:run -- src/pages/PdhesPage.test.tsx
npm run build
```

### Task 6: Map Attribution, Provider Metadata and Resilience

**Files:**
- Modify: `app/src/hooks/useMapLibre.ts`
- Modify: `app/src/pages/MapPage.tsx`
- Create: `app/src/components/ui/MapAttribution.tsx`
- Create: `app/src/utils/mapProviders.ts`
- Create: `app/src/utils/mapProviders.test.ts`

- [ ] **Step 1: Write provider-attribution tests**

Each map style must expose its provider attribution and external host inventory.

- [ ] **Step 2: Verify RED**

```powershell
npm run test:run -- src/utils/mapProviders.test.ts
```

- [ ] **Step 3: Centralize providers and enable visible attribution**

Keep OSM/CARTO/Esri/AWS metadata with the style definition. Add a visible attribution control/component and error notification for provider failures.

- [ ] **Step 4: Verify cleanup behavior**

Listener and map cleanup must remain idempotent across style/site changes.

- [ ] **Step 5: Run tests/build**

```powershell
npm run test:run -- src/utils/mapProviders.test.ts
npm run build
```

### Task 7: Bundle and 3D Loading

**Files:**
- Modify: `app/src/App.tsx`
- Modify: `app/src/pages/ThreeDPage.tsx`
- Modify: `app/src/components/ui/ThreeDModel.tsx`
- Modify: `app/vite.config.ts`

- [ ] **Step 1: Record the baseline bundle**

Current evidence: main JavaScript approximately 2,265.68 kB (616.13 kB gzip).

- [ ] **Step 2: Lazy-load 3D and editor pages**

Use top-level `lazy()` imports and section-specific Suspense fallbacks. Do not mount Canvas before the 3D tab opens.

- [ ] **Step 3: Add reduced-motion behavior**

Stop continuous simulation when the user prefers reduced motion; keep manual controls.

- [ ] **Step 4: Build and compare**

```powershell
npm run build
```

Expected: Three.js moves out of the initial application chunk and the initial gzip payload is materially lower.

### Task 8: Metadata, CSP, Legal and Source Documentation

**Files:**
- Modify: `app/index.html`
- Create: `NOTICE.md`
- Create: `DATA_SOURCES.md`
- Create: `METHODOLOGY.md`
- Create: `SECURITY.md`
- Create: `CONTRIBUTING.md`
- Modify: `README.md`
- Modify: `CHANGELOG.md`

- [ ] **Step 1: Add public metadata and a tested meta CSP**

Include description and Open Graph metadata. CSP must list only hosts used by the current map providers and support MapLibre workers.

- [ ] **Step 2: Document third-party and data provenance**

Record actual libraries, map providers, JICA/AFAD/MTA/Copernicus/NASA/OSM evidence sources and the unresolved redistribution question for the KML-derived grid data.

- [ ] **Step 3: Rewrite README around the active React app**

Document public viewer, `?editor=1` local workspace, Node requirements, commands, Pages and limitations. Remove the fake password.

- [ ] **Step 4: Add security and contribution policies**

Explain responsible reporting, no secrets in frontend, schema/data contribution requirements and verification commands.

### Task 9: CI, Pages and Dependency Maintenance

**Files:**
- Create: `.github/workflows/ci.yml`
- Create: `.github/workflows/deploy-pages.yml`
- Create: `.github/dependabot.yml`
- Modify: `app/package.json`

- [ ] **Step 1: Add `check` as the CI contract**

It runs typecheck, unit tests, data validation and build.

- [ ] **Step 2: Add pull-request CI**

Use Node 22, `npm ci` from `app/package-lock.json`, least permissions and pinned current official action major versions.

- [ ] **Step 3: Add GitHub Pages deployment**

Build with `/TR_PDHES_Potansiyel/`, configure/upload/deploy Pages and publish only `app/dist`.

- [ ] **Step 4: Add Dependabot**

Track npm and GitHub Actions weekly.

### Task 10: Full Verification and Browser QA

**Files:**
- Modify: `smoke_test.js` or move it under a clearly named legacy path
- Update: `docs/implementation_plan.md`

- [ ] **Step 1: Replace stale enum smoke assertions**

The active contract must check canonical enum values and 20/current candidates without hard-coded UI text.

- [ ] **Step 2: Run the complete command gate**

```powershell
Set-Location app
npm ci
npm run check
npm audit --omit=dev --audit-level=moderate
Set-Location ..
node smoke_test.js
```

- [ ] **Step 3: Run production preview browser QA**

Verify public and `?editor=1` flows at 1440, 1024, 768 and 390 widths; inspect console and network; exercise data, map, 3D and calculations.

- [ ] **Step 4: Scan the artifact**

```powershell
rg -n -i "admin123|api[_-]?key|private[_-]?key" app/dist
rg -n "\"/(data|grid_assets)\\.json" app/dist
```

Expected: no fake credential, secret or root-relative data URL.

- [ ] **Step 5: Record remaining non-blocking limitations**

Document provider terms that require owner confirmation, performance budget status and any live Pages setting that cannot be changed from the local checkout.
