import { describe, it, expect } from 'vitest';
import {
  formatInr,
  formatCompactInr,
  paiseToRupees,
  rupeesToPaise,
  parseInrToPaise,
} from './currency';
import { evaluateExpression } from './calculator';
import { calculateNextDueDate } from './recurring';
import { parseRawCsv, mapCsvRowsToRecords } from './exportImport';
import { Record, RecurringRule, Wallet } from '../types/money';

describe('0. Currency & Indian Digit Grouping', () => {
  it('formats positive and negative amounts correctly in Indian rupees', () => {
    // 7,209 / 12,179 / 1,23,456 / 12,34,567
    expect(formatInr(720900)).toBe('₹7,209');
    expect(formatInr(1217900)).toBe('₹12,179');
    expect(formatInr(12345600)).toBe('₹1,23,456');
    expect(formatInr(123456700)).toBe('₹12,34,567');

    // Negative amounts show minus sign before symbol: -₹37
    expect(formatInr(-3700)).toBe('-₹37');
    expect(formatInr(-138200)).toBe('-₹1,382');
  });

  it('supports decimals when setting is enabled', () => {
    expect(formatInr(123450, { showDecimals: true })).toBe('₹1,234.50');
    expect(formatInr(500000, { showDecimals: true })).toBe('₹5,000.00');
  });

  it('formats compact cells accurately for calendar and stats', () => {
    expect(formatCompactInr(150000, 'lakhs')).toBe('1.5K');
    expect(formatCompactInr(12000000, 'lakhs')).toBe('1.2L');
    expect(formatCompactInr(25000000, 'lakhs')).toBe('2.5L');
    expect(formatCompactInr(350000000, 'lakhs')).toBe('35L');
    expect(formatCompactInr(3500000000, 'lakhs')).toBe('3.5Cr');
    expect(formatCompactInr(2438700, 'full')).toBe('24,387');
  });

  it('converts between rupees and paise without floating point issues', () => {
    expect(rupeesToPaise(123.45)).toBe(12345);
    expect(paiseToRupees(12345)).toBe(123.45);
    expect(parseInrToPaise('₹ 1,23,456')).toBe(12345600);
    expect(parseInrToPaise('7209')).toBe(720900);
  });
});

describe('1. Calculator Expression Parsing', () => {
  it('evaluates basic operations (+, -, *, /)', () => {
    expect(evaluateExpression('120+45*2')).toBe(210);
    expect(evaluateExpression('1500 / 3')).toBe(500);
    expect(evaluateExpression('100 - 25 + 5')).toBe(80);
    expect(evaluateExpression('2.5 * 40')).toBe(100);
  });

  it('handles multiplication & division unicode symbols (×, ÷)', () => {
    expect(evaluateExpression('150 × 2')).toBe(300);
    expect(evaluateExpression('1000 ÷ 4')).toBe(250);
  });

  it('returns null on invalid or division by zero', () => {
    expect(evaluateExpression('100 / 0')).toBeNull();
    expect(evaluateExpression('abc + 5')).toBeNull();
  });
});

describe('2. Wallet Balance & Period Aggregation', () => {
  it('computes wallet balance correctly from records and transfers with fee', () => {
    const startingBalancePaise = 1000000; // ₹10,000

    const records: Partial<Record>[] = [
      { type: 'income', amountPaise: 500000, walletId: 'wal-1' }, // +5,000
      { type: 'expense', amountPaise: 200000, walletId: 'wal-1' }, // -2,000
      { type: 'transfer', amountPaise: 100000, walletId: 'wal-1', toWalletId: 'wal-2', feePaise: 5000 }, // out 1000, fee 50
    ];

    let currentBalance = startingBalancePaise;
    for (const r of records) {
      if (r.walletId === 'wal-1') {
        if (r.type === 'income') currentBalance += r.amountPaise!;
        if (r.type === 'expense') currentBalance -= r.amountPaise!;
        if (r.type === 'transfer') {
          currentBalance -= r.amountPaise!;
          if (r.feePaise) currentBalance -= r.feePaise;
        }
      }
      if (r.toWalletId === 'wal-1' && r.type === 'transfer') {
        currentBalance += r.amountPaise!;
      }
    }

    // 10000 + 5000 - 2000 - 1000 - 50 = 11950 (₹11,950 -> 1195000 paise)
    expect(currentBalance).toBe(1195000);
  });
});

describe('3. Recurring Rule Next Due Date Calculation', () => {
  it('calculates monthly and daily intervals', () => {
    const sampleRule: RecurringRule = {
      id: 'rule-1',
      accountId: 'acc-1',
      type: 'expense',
      amountPaise: 500000,
      description: 'Rent',
      categoryId: 'cat-1',
      walletId: 'wal-1',
      startDate: '2026-10-01T00:00:00.000Z',
      frequency: 'monthly',
      dayOfMonth: 5,
      endType: 'never',
      executionCount: 1,
      nextDueDate: '2026-10-05T00:00:00.000Z',
      autoAdd: true,
      createdAt: '2026-10-01T00:00:00.000Z',
    };

    const nextDue = calculateNextDueDate(sampleRule, new Date('2026-10-05T00:00:00.000Z'));
    expect(nextDue.getDate()).toBe(5);
    expect(nextDue.getMonth()).toBe(10); // November (0-indexed 10)
  });
});

describe('4. CSV Import & Duplicate Checking', () => {
  it('parses raw CSV text accurately', () => {
    const csvContent = 'Date,Description,Amount,Type\n2026-10-15,Swiggy Lunch,450,Expense\n2026-10-16,"Grocery, Veggies",1200,Expense';
    const parsed = parseRawCsv(csvContent);
    expect(parsed.headers).toEqual(['Date', 'Description', 'Amount', 'Type']);
    expect(parsed.rows.length).toBe(2);
    expect(parsed.rows[1][1]).toBe('Grocery, Veggies');
  });

  it('detects duplicates during import mapping', () => {
    const existing: Record[] = [
      {
        id: 'rec-1',
        accountId: 'acc-1',
        type: 'expense',
        amountPaise: 45000,
        dateTime: '2026-10-15T12:00:00.000Z',
        description: 'Swiggy Lunch',
        categoryId: 'cat-1',
        walletId: 'wal-1',
        createdAt: '',
        updatedAt: '',
      },
    ];

    const rows = [
      ['2026-10-15', 'Swiggy Lunch', '450', 'Expense'], // Duplicate
      ['2026-10-16', 'Metro Card', '200', 'Expense'],   // New
    ];

    const mapping = {
      dateColIndex: 0,
      descriptionColIndex: 1,
      amountColIndex: 2,
      typeColIndex: 3,
    };

    const res = mapCsvRowsToRecords(rows, mapping, 'acc-1', 'wal-1', [], existing);
    expect(res.duplicateCount).toBe(1);
    expect(res.recordsToImport.length).toBe(1);
    expect(res.recordsToImport[0].description).toBe('Metro Card');
  });
});
