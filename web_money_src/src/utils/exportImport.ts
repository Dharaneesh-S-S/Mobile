import { Record, Wallet, Category } from '../types/money';
import { db } from '../db';
import { paiseToRupees, rupeesToPaise } from './currency';

export function exportRecordsToCsv(
  records: Record[],
  wallets: Wallet[],
  categories: Category[]
): string {
  const walletMap = new Map(wallets.map((w) => [w.id, w.name]));
  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

  const headers = [
    'ID',
    'Date',
    'Time',
    'Type',
    'Amount (₹)',
    'Amount (Paise)',
    'Category',
    'Wallet',
    'To Wallet',
    'Fee (₹)',
    'Description',
    'Memo',
    'Tags',
  ];

  const rows = records.map((r) => {
    const d = new Date(r.dateTime);
    const dateStr = d.toISOString().split('T')[0];
    const timeStr = d.toTimeString().split(' ')[0];
    const catName = categoryMap.get(r.categoryId) || 'Uncategorized';
    const walletName = walletMap.get(r.walletId) || 'Unknown';
    const toWalletName = r.toWalletId ? (walletMap.get(r.toWalletId) || '') : '';
    const feeRupees = r.feePaise ? (r.feePaise / 100).toFixed(2) : '0';
    const amountRupees = (r.amountPaise / 100).toFixed(2);
    const tagsStr = (r.tags || []).join('; ');

    return [
      escapeCsv(r.id),
      escapeCsv(dateStr),
      escapeCsv(timeStr),
      escapeCsv(r.type),
      escapeCsv(amountRupees),
      escapeCsv(r.amountPaise.toString()),
      escapeCsv(catName),
      escapeCsv(walletName),
      escapeCsv(toWalletName),
      escapeCsv(feeRupees),
      escapeCsv(r.description),
      escapeCsv(r.memo || ''),
      escapeCsv(tagsStr),
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\r\n');
}

function escapeCsv(val: string): string {
  if (val.includes(',') || val.includes('"') || val.includes('\n') || val.includes('\r')) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function exportFullBackupJson(): Promise<string> {
  const accounts = await db.accounts.toArray();
  const wallets = await db.wallets.toArray();
  const categories = await db.categories.toArray();
  const records = await db.records.toArray();
  const budgets = await db.budgets.toArray();
  const goals = await db.goals.toArray();
  const debts = await db.debts.toArray();
  const recurringRules = await db.recurringRules.toArray();
  const templates = await db.templates.toArray();
  const settings = await db.settings.toArray();

  const backup = {
    version: 1,
    exportTimestamp: new Date().toISOString(),
    accounts,
    wallets,
    categories,
    records,
    budgets,
    goals,
    debts,
    recurringRules,
    templates,
    settings,
  };

  return JSON.stringify(backup, null, 2);
}

export async function restoreFullBackupJson(jsonString: string): Promise<{ success: boolean; error?: string }> {
  try {
    const data = JSON.parse(jsonString);
    if (!data || !Array.isArray(data.records)) {
      return { success: false, error: 'Invalid backup file format' };
    }

    if (data.accounts?.length) await db.accounts.bulkPut(data.accounts);
    if (data.wallets?.length) await db.wallets.bulkPut(data.wallets);
    if (data.categories?.length) await db.categories.bulkPut(data.categories);
    if (data.records?.length) await db.records.bulkPut(data.records);
    if (data.budgets?.length) await db.budgets.bulkPut(data.budgets);
    if (data.goals?.length) await db.goals.bulkPut(data.goals);
    if (data.debts?.length) await db.debts.bulkPut(data.debts);
    if (data.recurringRules?.length) await db.recurringRules.bulkPut(data.recurringRules);
    if (data.templates?.length) await db.templates.bulkPut(data.templates);
    if (data.settings?.length) await db.settings.bulkPut(data.settings);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error restoring backup' };
  }
}

export interface CsvParsedData {
  headers: string[];
  rows: string[][];
}

export function parseRawCsv(csvText: string): CsvParsedData {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return { headers: [], rows: [] };

  const parsed = lines.map((line) => {
    const row: string[] = [];
    let insideQuote = false;
    let currentCell = '';

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (insideQuote && line[i + 1] === '"') {
          currentCell += '"';
          i++;
        } else {
          insideQuote = !insideQuote;
        }
      } else if (char === ',' && !insideQuote) {
        row.push(currentCell.trim());
        currentCell = '';
      } else {
        currentCell += char;
      }
    }
    row.push(currentCell.trim());
    return row;
  });

  const [headers, ...rows] = parsed;
  return { headers, rows };
}

export interface CsvColumnMapping {
  dateColIndex: number;
  descriptionColIndex: number;
  amountColIndex: number;
  typeColIndex?: number;
  categoryColIndex?: number;
  walletColIndex?: number;
}

export function mapCsvRowsToRecords(
  rows: string[][],
  mapping: CsvColumnMapping,
  defaultAccountId: string,
  defaultWalletId: string,
  categories: Category[],
  existingRecords: Record[]
): { recordsToImport: Record[]; duplicateCount: number } {
  const recordsToImport: Record[] = [];
  let duplicateCount = 0;

  // Build duplicate check set: date + description + amount
  const existingSet = new Set(
    existingRecords.map(
      (r) => `${r.dateTime.split('T')[0]}_${r.description.toLowerCase().trim()}_${r.amountPaise}`
    )
  );

  const catMap = new Map(categories.map((c) => [c.name.toLowerCase().trim(), c.id]));
  const defaultExpenseCat = categories.find((c) => c.type === 'expense')?.id || 'cat-exp-1';

  for (const row of rows) {
    const rawDate = row[mapping.dateColIndex] || '';
    const rawDesc = row[mapping.descriptionColIndex] || 'Imported Transaction';
    const rawAmount = row[mapping.amountColIndex] || '0';
    const rawType = mapping.typeColIndex !== undefined ? row[mapping.typeColIndex]?.toLowerCase() : '';
    const rawCat = mapping.categoryColIndex !== undefined ? row[mapping.categoryColIndex] : '';

    if (!rawDate && !rawAmount) continue;

    let parsedDate = new Date(rawDate);
    if (isNaN(parsedDate.getTime())) {
      // Try dd/mm/yyyy
      const parts = rawDate.split(/[-/]/);
      if (parts.length === 3) {
        parsedDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      }
      if (isNaN(parsedDate.getTime())) {
        parsedDate = new Date();
      }
    }

    const cleanAmountStr = rawAmount.replace(/[₹,\s]/g, '');
    let amountVal = parseFloat(cleanAmountStr);
    if (isNaN(amountVal)) continue;

    let type: 'income' | 'expense' | 'transfer' = 'expense';
    if (rawType.includes('income') || rawType.includes('credit') || amountVal < 0 && rawType === 'cr') {
      type = 'income';
    } else if (rawType.includes('transfer')) {
      type = 'transfer';
    } else if (amountVal < 0) {
      type = 'expense';
    }

    const amountPaise = rupeesToPaise(Math.abs(amountVal));
    if (amountPaise === 0) continue;

    const dateKey = `${parsedDate.toISOString().split('T')[0]}_${rawDesc.toLowerCase().trim()}_${amountPaise}`;
    if (existingSet.has(dateKey)) {
      duplicateCount++;
      continue;
    }

    let categoryId = defaultExpenseCat;
    if (rawCat && catMap.has(rawCat.toLowerCase().trim())) {
      categoryId = catMap.get(rawCat.toLowerCase().trim())!;
    }

    const newRecord: Record = {
      id: `rec-imp-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      accountId: defaultAccountId,
      type,
      amountPaise,
      dateTime: parsedDate.toISOString(),
      description: rawDesc,
      categoryId,
      walletId: defaultWalletId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    recordsToImport.push(newRecord);
    existingSet.add(dateKey);
  }

  return { recordsToImport, duplicateCount };
}
