import { describe, expect, it } from 'vitest';
import { isLocalWorkspaceEnabled } from './workspaceMode';

describe('isLocalWorkspaceEnabled', () => {
  it('enables the local workspace only for editor=1', () => {
    expect(isLocalWorkspaceEnabled('?editor=1')).toBe(true);
    expect(isLocalWorkspaceEnabled('?foo=bar&editor=1')).toBe(true);
  });

  it('keeps normal public URLs in viewer mode', () => {
    expect(isLocalWorkspaceEnabled('')).toBe(false);
    expect(isLocalWorkspaceEnabled('?editor=0')).toBe(false);
    expect(isLocalWorkspaceEnabled('?admin=1')).toBe(false);
  });
});
