/**
 * RupeeFlow / Money Manager Integration for Main Calendar
 * 
 * Provides:
 * 1. Safe local date mapping (YYYY-MM-DD) avoiding UTC timezone mismatch
 * 2. In-memory and cached daily summary aggregation (Income, Expense, Net)
 * 3. Direct IndexedDB ('RupeeFlowDB') reading without external library requirements
 * 4. Cross-tab and cross-app synchronization via localStorage and CustomEvent
 */

export interface MoneyTransaction {
  id: string;
  type: 'income' | 'expense' | 'transfer';
  amountPaise: number;
  feePaise?: number;
  dateTime: string;
  description?: string;
  categoryId?: string;
  categoryName?: string;
  categoryColor?: string;
  walletId?: string;
  walletName?: string;
  memo?: string;
}

export interface MoneyDailySummary {
  date: string; // YYYY-MM-DD local date
  incomePaise: number;
  expensePaise: number;
  netPaise: number;
  count: number;
  transactions: MoneyTransaction[];
}

export const RUPEEFLOW_STORAGE_KEY = 'rupeeflow_daily_summary_v1';
export const RUPEEFLOW_UPDATE_EVENT = 'rupeeflow_money_updated';

/**
 * Accurately extracts local YYYY-MM-DD from an ISO dateTime string or Date object.
 * Fixes timezone shifts where UTC splitting (split('T')[0]) would map transactions
 * to the previous or next day.
 */
export function getRecordLocalDateKey(dateInput: string | Date | number): string {
  try {
    const d = typeof dateInput === 'string' || typeof dateInput === 'number'
      ? new Date(dateInput)
      : dateInput;
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    return '';
  }
}

/**
 * Compact currency formatting for calendar cells and badges.
 * Examples:
 *   150000 paise (₹1,500) -> "₹1.5K"
 *   12000000 paise (₹1,20,000) -> "₹1.2L"
 *   45000 paise (₹450) -> "₹450"
 */
export function formatMoneyCompact(paise: number, includeSign = false): string {
  const isNegative = paise < 0;
  const absPaise = Math.abs(paise);
  const rupees = absPaise / 100;
  let formatted = '';

  if (rupees >= 10000000) {
    const cr = (rupees / 10000000).toFixed(1).replace(/\.0$/, '');
    formatted = `${cr}Cr`;
  } else if (rupees >= 100000) {
    const l = (rupees / 100000).toFixed(1).replace(/\.0$/, '');
    formatted = `${l}L`;
  } else if (rupees >= 1000) {
    const k = (rupees / 1000).toFixed(1).replace(/\.0$/, '');
    formatted = `${k}K`;
  } else {
    formatted = Math.round(rupees).toString();
  }

  if (isNegative) {
    return `-₹${formatted}`;
  }
  if (includeSign && rupees > 0) {
    return `+₹${formatted}`;
  }
  return `₹${formatted}`;
}

/**
 * Full INR currency formatting.
 * Examples: 150000 paise -> "₹1,500"
 */
export function formatMoneyFull(paise: number, includeSign = false): string {
  const isNegative = paise < 0;
  const absPaise = Math.abs(paise);
  const rupees = absPaise / 100;

  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(rupees);

  if (isNegative) {
    return `-₹${formatted}`;
  }
  if (includeSign && rupees > 0) {
    return `+₹${formatted}`;
  }
  return `₹${formatted}`;
}

/**
 * Reads directly from IndexedDB ('RupeeFlowDB') using raw standard browser API.
 * This guarantees data is accessible even if the user opens the Calendar first
 * without visiting the Money Manager in that session.
 */
function readRupeeFlowIndexedDB(): Promise<{
  records: any[];
  categories: any[];
  wallets: any[];
} | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }

    try {
      const openReq = window.indexedDB.open('RupeeFlowDB');

      openReq.onerror = () => {
        resolve(null);
      };

      openReq.onsuccess = () => {
        const db = openReq.result;
        if (!db.objectStoreNames.contains('records')) {
          db.close();
          resolve(null);
          return;
        }

        try {
          const storeNames: string[] = ['records'];
          if (db.objectStoreNames.contains('categories')) storeNames.push('categories');
          if (db.objectStoreNames.contains('wallets')) storeNames.push('wallets');

          const tx = db.transaction(storeNames, 'readonly');
          const recordsReq = tx.objectStore('records').getAll();
          let categoriesReq: IDBRequest<any[]> | null = null;
          let walletsReq: IDBRequest<any[]> | null = null;

          if (db.objectStoreNames.contains('categories')) {
            categoriesReq = tx.objectStore('categories').getAll();
          }
          if (db.objectStoreNames.contains('wallets')) {
            walletsReq = tx.objectStore('wallets').getAll();
          }

          tx.oncomplete = () => {
            const records = recordsReq.result || [];
            const categories = categoriesReq?.result || [];
            const wallets = walletsReq?.result || [];
            db.close();
            resolve({ records, categories, wallets });
          };

          tx.onerror = () => {
            db.close();
            resolve(null);
          };
        } catch {
          db.close();
          resolve(null);
        }
      };
    } catch {
      resolve(null);
    }
  });
}

/**
 * Loads and aggregates daily financial summary.
 * Checks localStorage cache first for instantaneous rendering, then refreshes
 * from IndexedDB.
 */
export async function loadDailyMoneyStats(): Promise<Record<string, MoneyDailySummary>> {
  let stats: Record<string, MoneyDailySummary> = {};

  // 1. Try reading cached summary from localStorage
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(RUPEEFLOW_STORAGE_KEY);
      if (cached) {
        stats = JSON.parse(cached);
      }
    } catch (e) {
      console.warn('Failed to parse cached money summary:', e);
    }
  }

  // 2. Fetch directly from IndexedDB
  try {
    const idbData = await readRupeeFlowIndexedDB();
    if (idbData && idbData.records && idbData.records.length > 0) {
      const { records, categories, wallets } = idbData;
      const catMap = new Map<string, any>(categories.map((c) => [c.id, c]));
      const walMap = new Map<string, any>(wallets.map((w) => [w.id, w]));

      const freshMap: Record<string, MoneyDailySummary> = {};

      for (const r of records) {
        if (!r.dateTime) continue;
        const dateKey = getRecordLocalDateKey(r.dateTime);
        if (!dateKey) continue;

        if (!freshMap[dateKey]) {
          freshMap[dateKey] = {
            date: dateKey,
            incomePaise: 0,
            expensePaise: 0,
            netPaise: 0,
            count: 0,
            transactions: [],
          };
        }

        const item = freshMap[dateKey];
        item.count++;

        if (r.type === 'income') {
          item.incomePaise += r.amountPaise;
          item.netPaise += r.amountPaise;
        } else if (r.type === 'expense') {
          item.expensePaise += r.amountPaise;
          item.netPaise -= r.amountPaise;
        } else if (r.type === 'transfer' && r.feePaise) {
          item.expensePaise += r.feePaise;
          item.netPaise -= r.feePaise;
        }

        const cat = catMap.get(r.categoryId);
        const wal = walMap.get(r.walletId);

        item.transactions.push({
          id: r.id,
          type: r.type,
          amountPaise: r.amountPaise,
          feePaise: r.feePaise,
          dateTime: r.dateTime,
          description: r.description,
          categoryId: r.categoryId,
          categoryName: cat?.name,
          categoryColor: cat?.color,
          walletId: r.walletId,
          walletName: wal?.name,
          memo: r.memo,
        });
      }

      stats = freshMap;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(RUPEEFLOW_STORAGE_KEY, JSON.stringify(stats));
        } catch {}
      }
    }
  } catch (err) {
    console.warn('Error reading RupeeFlowDB:', err);
  }

  return stats;
}
