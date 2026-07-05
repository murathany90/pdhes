# Public Repo Prompt Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the stale destructive publication prompt with a repository-grounded, feature-preserving and future-proof public-repository implementation brief.

**Architecture:** Keep `public_repo.md` as the single operational prompt. Organize it from non-negotiable principles through current-state inventory, phased implementation, verification and acceptance criteria; distinguish verified current facts from work that the implementing agent must re-check.

**Tech Stack:** Markdown, Vite 8, React 19, TypeScript 6, MapLibre GL JS, Three.js/React Three Fiber, Zustand, GitHub Pages and GitHub Actions.

---

### Task 1: Rewrite the operational prompt

**Files:**
- Modify: `public_repo.md`

- [ ] **Step 1: Preserve useful requirements and replace stale assumptions**

Retain the legal, security, attribution, CSP, deployment, README, testing and acceptance intent while changing “repo will become public” to “repo is already public” and removing blanket feature-deletion instructions.

- [ ] **Step 2: Add repository-grounded architecture and feature inventory**

Document the active `app/` architecture, public data assets, stores, map/3D/calculation surfaces, local authoring features, legacy artifacts and current known inconsistencies.

- [ ] **Step 3: Add feature-preserving public-mode rules**

Specify a default viewer and explicit local workspace; remove fake authentication semantics without deleting local editing, backup or 3D-layout capabilities.

- [ ] **Step 4: Add future-proof data and roadmap rules**

Require schema validation, migrations, a canonical data source, derived public assets, future feature compatibility, phased 3D/GIS improvements and documentation synchronization.

- [ ] **Step 5: Modernize deployment and security guidance**

Require repository-aware Vite base paths, `import.meta.env.BASE_URL`, current official GitHub Pages Actions verified at implementation time, least-privilege permissions, attributions, CSP and dependency/security checks.

### Task 2: Verify prompt integrity

**Files:**
- Test: `public_repo.md`

- [ ] **Step 1: Check required concepts**

Run:

```powershell
rg -n "repo zaten public|özellik kaybı|yerel çalışma alanı|import.meta.env.BASE_URL|GitHub Pages|NOTICE|şema|migrasyon|3D|MapLibre|smoke" public_repo.md
```

Expected: every concept is present in an actionable section.

- [ ] **Step 2: Check stale destructive directives**

Run:

```powershell
rg -n "Yönetim panelini kaldır|tamamen kaldır|app/ klasörü eksikse|Repo public yapılacaktır" public_repo.md
```

Expected: no unconditional destructive or stale publication instruction remains.

- [ ] **Step 3: Review diff and encoding**

Run:

```powershell
git diff --no-index -- /dev/null public_repo.md
```

Expected: detailed UTF-8 Turkish Markdown with no placeholders, contradictory acceptance criteria or accidental truncation.
