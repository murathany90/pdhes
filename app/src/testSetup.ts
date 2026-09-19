class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>();

  get length(): number {
    return this.values.size;
  }

  clear(): void {
    this.values.clear();
  }

  getItem(key: string): string | null {
    return this.values.get(String(key)) ?? null;
  }

  key(index: number): string | null {
    return [...this.values.keys()][index] ?? null;
  }

  removeItem(key: string): void {
    this.values.delete(String(key));
  }

  setItem(key: string, value: string): void {
    this.values.set(String(key), String(value));
  }
}

const localStorageShim = new MemoryStorage();
const sessionStorageShim = new MemoryStorage();

Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: localStorageShim });
Object.defineProperty(globalThis, 'sessionStorage', { configurable: true, value: sessionStorageShim });

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', { configurable: true, value: localStorageShim });
  Object.defineProperty(window, 'sessionStorage', { configurable: true, value: sessionStorageShim });
}
