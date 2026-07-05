export function isLocalWorkspaceEnabled(search: string): boolean {
  return new URLSearchParams(search).get('editor') === '1';
}
