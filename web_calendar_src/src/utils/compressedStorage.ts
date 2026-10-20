import LZString from 'lz-string';

const MAGIC_PREFIX = 'LZ16:';

export interface StorageStatsItem {
  key: string;
  originalBytes: number;
  compressedBytes: number;
  savingsPercent: number;
  isCompressed: boolean;
}

export interface OverallStorageStats {
  totalOriginalBytes: number;
  totalCompressedBytes: number;
  totalSavingsPercent: number;
  estimatedRemainingQuotaBytes: number;
  items: StorageStatsItem[];
}

/**
 * Compresses data using LZString UTF-16 compression and saves it to localStorage.
 * Automatically handles serialization, compression, and quota management.
 */
export function setCompressedItem<T>(key: string, value: T): boolean {
  try {
    const rawJson = JSON.stringify(value);
    const compressed = LZString.compressToUTF16(rawJson);
    const payload = MAGIC_PREFIX + compressed;

    localStorage.setItem(key, payload);
    return true;
  } catch (error: any) {
    // If QuotaExceededError or DOMException, attempt safe recovery
    if (
      error?.name === 'QuotaExceededError' ||
      error?.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
      error?.code === 22
    ) {
      console.warn(`[CompressedStorage] Quota exceeded while saving "${key}". Attempting cleanup...`);
      try {
        // Try to clear non-essential trash if saving events or settings
        if (key !== 'chronos_trash') {
          localStorage.removeItem('chronos_trash');
          const retryRaw = JSON.stringify(value);
          const retryCompressed = MAGIC_PREFIX + LZString.compressToUTF16(retryRaw);
          localStorage.setItem(key, retryCompressed);
          return true;
        }
      } catch (retryError) {
        console.error(`[CompressedStorage] Critical: Storage full after cleanup for "${key}":`, retryError);
      }
    }

    console.error(`[CompressedStorage] Failed to store "${key}":`, error);
    return false;
  }
}

/**
 * Loads data from localStorage, decompressing it if it was stored compressed.
 * Backwards compatible with legacy uncompressed JSON and automatically migrates it.
 */
export function getCompressedItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;

    // Check if compressed with LZ16
    if (raw.startsWith(MAGIC_PREFIX)) {
      const payload = raw.slice(MAGIC_PREFIX.length);
      const decompressed = LZString.decompressFromUTF16(payload);
      if (!decompressed) {
        console.warn(`[CompressedStorage] Decompression returned null for "${key}", using fallback.`);
        return fallback;
      }
      return JSON.parse(decompressed) as T;
    }

    // Legacy uncompressed data: parse directly and auto-migrate in background
    try {
      const parsed = JSON.parse(raw) as T;
      // Auto-migrate to compressed format
      setCompressedItem(key, parsed);
      return parsed;
    } catch {
      return fallback;
    }
  } catch (error) {
    console.error(`[CompressedStorage] Error loading "${key}":`, error);
    return fallback;
  }
}

/**
 * Removes an item from localStorage.
 */
export function removeCompressedItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error(`[CompressedStorage] Error removing "${key}":`, e);
  }
}

/**
 * Calculates detailed compression metrics and storage savings across all managed keys.
 */
export function getStorageStats(): OverallStorageStats {
  const managedKeys = [
    'chronos_events',
    'chronos_calendars',
    'chronos_settings',
    'chronos_trash',
    'chronos_overlaid_people',
    'chronos_templates',
  ];

  let totalOriginal = 0;
  let totalCompressed = 0;
  const items: StorageStatsItem[] = [];

  for (const key of managedKeys) {
    const raw = localStorage.getItem(key);
    if (!raw) continue;

    let originalBytes = 0;
    let compressedBytes = raw.length * 2; // UTF-16 characters take 2 bytes in memory
    let isCompressed = false;

    if (raw.startsWith(MAGIC_PREFIX)) {
      isCompressed = true;
      const decompressed = LZString.decompressFromUTF16(raw.slice(MAGIC_PREFIX.length));
      originalBytes = decompressed ? new Blob([decompressed]).size : compressedBytes;
    } else {
      originalBytes = new Blob([raw]).size;
    }

    const savings = originalBytes > 0
      ? Math.max(0, Math.round((1 - compressedBytes / originalBytes) * 100))
      : 0;

    totalOriginal += originalBytes;
    totalCompressed += compressedBytes;

    items.push({
      key,
      originalBytes,
      compressedBytes,
      savingsPercent: savings,
      isCompressed,
    });
  }

  // Typical browser localStorage capacity is 5 MB (5,242,880 bytes)
  const ESTIMATED_MAX_BYTES = 5 * 1024 * 1024;
  const remaining = Math.max(0, ESTIMATED_MAX_BYTES - totalCompressed);
  const totalSavings = totalOriginal > 0
    ? Math.max(0, Math.round((1 - totalCompressed / totalOriginal) * 100))
    : 0;

  return {
    totalOriginalBytes: totalOriginal,
    totalCompressedBytes: totalCompressed,
    totalSavingsPercent: totalSavings,
    estimatedRemainingQuotaBytes: remaining,
    items,
  };
}

/**
 * Formats byte numbers into clean human-readable strings (KB, MB).
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
