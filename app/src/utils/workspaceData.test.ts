import { describe, expect, it } from 'vitest';
import sites from '../../public/data.json';
import {
  MAX_WORKSPACE_IMPORT_BYTES,
  WORKSPACE_SCHEMA_VERSION,
  parseWorkspaceImport,
  serializeWorkspaceSites,
} from './workspaceData';

describe('workspace import and export', () => {
  it('imports the legacy flat site array and normalizes records', () => {
    const result = parseWorkspaceImport(JSON.stringify(sites));

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.sites).toHaveLength(20);
    expect(result.sites.every((site) =>
      ['CLOSED_LOOP', 'OPEN_LOOP', 'SEA_WATER', 'PROTOTYPE'].includes(site.pdhesType),
    )).toBe(true);
  });

  it('imports a versioned workspace envelope', () => {
    const result = parseWorkspaceImport(JSON.stringify({
      schemaVersion: WORKSPACE_SCHEMA_VERSION,
      sites,
    }));

    expect(result.ok).toBe(true);
  });

  it('rejects invalid data without returning partial sites', () => {
    const result = parseWorkspaceImport('[{"id":"broken"}]');

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('rejects oversized imports before parsing', () => {
    const result = parseWorkspaceImport(' '.repeat(MAX_WORKSPACE_IMPORT_BYTES + 1));

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors[0]).toContain('boyut');
  });

  it('exports schema version, timestamp and sites', () => {
    const exported = JSON.parse(serializeWorkspaceSites(sites as never));

    expect(exported.schemaVersion).toBe(WORKSPACE_SCHEMA_VERSION);
    expect(exported.exportedAt).toMatch(/Z$/);
    expect(exported.sites).toHaveLength(20);
  });
});
