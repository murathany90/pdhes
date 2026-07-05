import type { Site } from '../types/site';
import { validateSites } from './siteSchema';

export const WORKSPACE_SCHEMA_VERSION = 2;
export const MAX_WORKSPACE_IMPORT_BYTES = 5 * 1024 * 1024;

export type WorkspaceParseResult =
  | { ok: true; sites: Site[]; migratedFrom: number | 'legacy' }
  | { ok: false; errors: string[] };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function parseWorkspaceImport(text: string): WorkspaceParseResult {
  if (new TextEncoder().encode(text).byteLength > MAX_WORKSPACE_IMPORT_BYTES) {
    return { ok: false, errors: ['İçe aktarma boyutu 5 MB sınırını aşıyor.'] };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, errors: ['JSON biçimi geçersiz.'] };
  }

  let candidateData: unknown = parsed;
  let migratedFrom: number | 'legacy' = 'legacy';

  if (isRecord(parsed)) {
    const version = parsed.schemaVersion;
    if (!Number.isInteger(version) || Number(version) < 1) {
      return { ok: false, errors: ['Çalışma alanı schemaVersion değeri geçersiz.'] };
    }
    if (Number(version) > WORKSPACE_SCHEMA_VERSION) {
      return {
        ok: false,
        errors: [`Bu dosya daha yeni bir şema sürümü kullanıyor: ${String(version)}.`],
      };
    }
    migratedFrom = Number(version);
    candidateData = parsed.sites;
  }

  const validation = validateSites(candidateData);
  if (!validation.ok) {
    return { ok: false, errors: validation.errors };
  }

  return { ok: true, sites: validation.sites, migratedFrom };
}

export function serializeWorkspaceSites(sites: Site[]): string {
  return JSON.stringify({
    schemaVersion: WORKSPACE_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    app: 'TR_PDHES_Potansiyel',
    sites,
  }, null, 2);
}
