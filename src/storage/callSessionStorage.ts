/**
 * Disk-backed call session storage for continue / resume.
 */

const VANIRA_KEY_PREFIX = 'vanira_';

export type CallSessionStorageAdapter = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};

type AsyncStorageLike = {
  getAllKeys(): Promise<string[]>;
  multiGet(keys: readonly string[]): Promise<readonly (readonly [string, string | null])[]>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
};

const memory = new Map<string, string>();

let hydratePromise: Promise<void> | null = null;
let asyncStorageCache: AsyncStorageLike | null | undefined;

function resolveAsyncStorage(): AsyncStorageLike | null {
  if (asyncStorageCache !== undefined) {
    return asyncStorageCache;
  }

  try {
    const mod = require('@react-native-async-storage/async-storage');
    const candidate = (mod?.default ?? mod) as AsyncStorageLike | null | undefined;
    if (
      candidate &&
      typeof candidate.getAllKeys === 'function' &&
      typeof candidate.setItem === 'function'
    ) {
      asyncStorageCache = candidate;
    } else {
      asyncStorageCache = null;
    }
  } catch {
    asyncStorageCache = null;
  }

  return asyncStorageCache;
}

export function hydrateCallSessionStorage(): Promise<void> {
  if (!hydratePromise) {
    hydratePromise = (async () => {
      const disk = resolveAsyncStorage();
      if (!disk) {
        return;
      }
      try {
        const allKeys = await disk.getAllKeys();
        const vaniraKeys = allKeys.filter(key => key.startsWith(VANIRA_KEY_PREFIX));
        if (vaniraKeys.length === 0) {
          return;
        }
        const pairs = await disk.multiGet(vaniraKeys);
        for (const [key, value] of pairs) {
          if (key && value != null) {
            memory.set(key, value);
          }
        }
      } catch (err) {
        console.warn('[CallSessionStorage] hydrate failed:', err);
      }
    })();
  }
  return hydratePromise;
}

export const persistentCallStorage: CallSessionStorageAdapter = {
  getItem(key: string): string | null {
    return memory.get(key) ?? null;
  },

  setItem(key: string, value: string): void {
    memory.set(key, value);
    const disk = resolveAsyncStorage();
    if (!disk) {
      return;
    }
    void disk.setItem(key, value).catch(err => {
      console.warn('[CallSessionStorage] persist failed:', key, err);
    });
  },

  removeItem(key: string): void {
    memory.delete(key);
    const disk = resolveAsyncStorage();
    if (!disk) {
      return;
    }
    void disk.removeItem(key).catch(err => {
      console.warn('[CallSessionStorage] remove failed:', key, err);
    });
  },
};
