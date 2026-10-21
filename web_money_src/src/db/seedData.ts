import { db } from './index';
import {
  Account,
  Wallet,
  Category,
  Record,
  Budget,
  Goal,
  Debt,
  RecurringRule,
  Template,
  UserSettings,
} from '../types/money';

export const DEFAULT_INCOME_CATEGORIES: Omit<Category, 'id'>[] = [
  { name: 'Salary', type: 'income', icon: 'Briefcase', color: '#3b82f6', isDefault: true, order: 1 },
  { name: 'Allowance', type: 'income', icon: 'Gift', color: '#10b981', isDefault: true, order: 2 },
  { name: 'Bonus', type: 'income', icon: 'Award', color: '#f59e0b', isDefault: true, order: 3 },
  { name: 'Dividend', type: 'income', icon: 'TrendingUp', color: '#8b5cf6', isDefault: true, order: 4 },
  { name: 'Investment', type: 'income', icon: 'BarChart2', color: '#06b6d4', isDefault: true, order: 5 },
  { name: 'Lottery', type: 'income', icon: 'Sparkles', color: '#ec4899', isDefault: true, order: 6 },
  { name: 'Tips', type: 'income', icon: 'Coins', color: '#14b8a6', isDefault: true, order: 7 },
  { name: 'Award', type: 'income', icon: 'Trophy', color: '#eab308', isDefault: true, order: 8 },
  { name: 'Others', type: 'income', icon: 'MoreHorizontal', color: '#64748b', isDefault: true, order: 9 },
];

export const DEFAULT_EXPENSE_CATEGORIES: Omit<Category, 'id'>[] = [
  { name: 'Food', type: 'expense', icon: 'Utensils', color: '#f97316', isDefault: true, order: 1 },
  { name: 'Groceries', type: 'expense', icon: 'ShoppingCart', color: '#84cc16', isDefault: true, order: 2 },
  { name: 'Bills', type: 'expense', icon: 'Receipt', color: '#ef4444', isDefault: true, order: 3 },
  { name: 'Transport', type: 'expense', icon: 'Car', color: '#06b6d4', isDefault: true, order: 4 },
  { name: 'Shopping', type: 'expense', icon: 'ShoppingBag', color: '#ec4899', isDefault: true, order: 5 },
  { name: 'Rent', type: 'expense', icon: 'Home', color: '#6366f1', isDefault: true, order: 6 },
  { name: 'Recharge', type: 'expense', icon: 'Smartphone', color: '#3b82f6', isDefault: true, order: 7 },
  { name: 'Entertainment', type: 'expense', icon: 'Film', color: '#a855f7', isDefault: true, order: 8 },
  { name: 'Health', type: 'expense', icon: 'HeartPulse', color: '#14b8a6', isDefault: true, order: 9 },
  { name: 'Gifts', type: 'expense', icon: 'Gift', color: '#f43f5e', isDefault: true, order: 10 },
  { name: 'Education', type: 'expense', icon: 'GraduationCap', color: '#eab308', isDefault: true, order: 11 },
  { name: 'Travel', type: 'expense', icon: 'Plane', color: '#0ea5e9', isDefault: true, order: 12 },
  { name: 'EMI', type: 'expense', icon: 'CreditCard', color: '#dc2626', isDefault: true, order: 13 },
  { name: 'Fees', type: 'expense', icon: 'Percent', color: '#94a3b8', isDefault: true, order: 14 },
  { name: 'Others', type: 'expense', icon: 'MoreHorizontal', color: '#64748b', isDefault: true, order: 15 },
];

export const DEFAULT_SETTINGS: UserSettings = {
  id: 'user-settings-default',
  theme: 'dark',
  accentColor: '#3b82f6',
  weekStartDay: 0, // Sunday
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '12h',
  numberGrouping: 'in',
  showDecimals: false,
  compactCalendarFormat: 'short',
  defaultAccountId: 'acc-personal',
  monthStartDay: 1,
  hideBalanceDefault: false,
  showGreenNet: true,
  isPhoneFrameEnabled: true,
  isPasscodeEnabled: false,
  autoLockMinutes: 5,
  hasSeededData: false,
};

export async function initializeDatabaseDefaults(): Promise<void> {
  const existingSettings = await db.settings.get('user-settings-default');
  if (!existingSettings) {
    await db.settings.put(DEFAULT_SETTINGS);
  }

  const existingAccounts = await db.accounts.count();
  if (existingAccounts === 0) {
    const defaultAccount: Account = {
      id: 'acc-personal',
      name: 'Personal',
      isDefault: true,
      createdAt: new Date().toISOString(),
    };
    await db.accounts.put(defaultAccount);
  }

  const existingCategories = await db.categories.count();
  if (existingCategories === 0) {
    const categories: Category[] = [
      ...DEFAULT_INCOME_CATEGORIES.map((c, i) => ({
        ...c,
        id: `cat-inc-${i + 1}`,
      })),
      ...DEFAULT_EXPENSE_CATEGORIES.map((c, i) => ({
        ...c,
        id: `cat-exp-${i + 1}`,
      })),
    ];
    await db.categories.bulkPut(categories);
  }

  const existingWallets = await db.wallets.count();
  if (existingWallets === 0) {
    const defaultWallets: Wallet[] = [
      {
        id: 'wal-upi',
        accountId: 'acc-personal',
        name: 'UPI',
        type: 'upi',
        startingBalancePaise: 1500000, // ₹15,000
        color: '#3b82f6',
        icon: 'Smartphone',
        currency: 'INR',
        includeInTotal: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'wal-cash',
        accountId: 'acc-personal',
        name: 'Cash',
        type: 'cash',
        startingBalancePaise: 500000, // ₹5,000
        color: '#10b981',
        icon: 'Banknote',
        currency: 'INR',
        includeInTotal: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'wal-meal',
        accountId: 'acc-personal',
        name: 'Meal Card',
        type: 'meal',
        startingBalancePaise: 400000, // ₹4,000
        color: '#84cc16',
        icon: 'Utensils',
        currency: 'INR',
        includeInTotal: true,
        createdAt: new Date().toISOString(),
      },
    ];
    await db.wallets.bulkPut(defaultWallets);
  }
}

export async function seedSampleDemoData(): Promise<void> {
  await initializeDatabaseDefaults();

  // Find or verify default category IDs
  const allCats = await db.categories.toArray();
  const getCatId = (name: string, type: 'income' | 'expense') => {
    const found = allCats.find((c) => c.name.toLowerCase() === name.toLowerCase() && c.type === type);
    return found ? found.id : allCats[0]?.id || 'cat-exp-1';
  };

  const catSalary = getCatId('Salary', 'income');
  const catBonus = getCatId('Bonus', 'income');
  const catFood = getCatId('Food', 'expense');
  const catGroceries = getCatId('Groceries', 'expense');
  const catBills = getCatId('Bills', 'expense');
  const catTransport = getCatId('Transport', 'expense');
  const catShopping = getCatId('Shopping', 'expense');
  const catRent = getCatId('Rent', 'expense');
  const catRecharge = getCatId('Recharge', 'expense');
  const catEntertainment = getCatId('Entertainment', 'expense');
  const catGifts = getCatId('Gifts', 'expense');

  const now = new Date();
  const currYear = now.getFullYear();
  const currMonth = now.getMonth();

  // Create two months of realistic records: previous month and current month
  const sampleRecords: Record[] = [
    // --- PREVIOUS MONTH ---
    {
      id: 'rec-sample-01',
      accountId: 'acc-personal',
      type: 'income',
      amountPaise: 7500000, // ₹75,000
      dateTime: new Date(currYear, currMonth - 1, 1, 10, 30).toISOString(),
      description: 'Monthly Salary Credit',
      categoryId: catSalary,
      walletId: 'wal-upi',
      memo: 'Tech Corp September Salary',
      tags: ['salary', 'work'],
      isSample: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'rec-sample-02',
      accountId: 'acc-personal',
      type: 'expense',
      amountPaise: 2200000, // ₹22,000
      dateTime: new Date(currYear, currMonth - 1, 3, 14, 15).toISOString(),
      description: 'Apartment Rent',
      categoryId: catRent,
      walletId: 'wal-upi',
      memo: 'Transfer to Owner via UPI',
      tags: ['fixed', 'rent'],
      isSample: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'rec-sample-03',
      accountId: 'acc-personal',
      type: 'expense',
      amountPaise: 185000, // ₹1,850
      dateTime: new Date(currYear, currMonth - 1, 5, 11, 20).toISOString(),
      description: 'Electricity Bill (BESCOM)',
      categoryId: catBills,
      walletId: 'wal-upi',
      memo: 'Auto-debit bill payment',
      tags: ['utilities'],
      isSample: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'rec-sample-04',
      accountId: 'acc-personal',
      type: 'expense',
      amountPaise: 99900, // ₹999
      dateTime: new Date(currYear, currMonth - 1, 6, 9, 45).toISOString(),
      description: 'Airtel Broadband Fiber',
      categoryId: catBills,
      walletId: 'wal-upi',
      tags: ['wifi'],
      isSample: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'rec-sample-05',
      accountId: 'acc-personal',
      type: 'expense',
      amountPaise: 125000, // ₹1,250
      dateTime: new Date(currYear, currMonth - 1, 8, 18, 30).toISOString(),
      description: 'Blinkit Grocery Order',
      categoryId: catGroceries,
      walletId: 'wal-upi',
      memo: 'Vegetables, milk, pulses and pantry',
      tags: ['groceries'],
      isSample: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'rec-sample-06',
      accountId: 'acc-personal',
      type: 'expense',
      amountPaise: 45000, // ₹450
      dateTime: new Date(currYear, currMonth - 1, 10, 13, 10).toISOString(),
      description: 'Lunch at Cafe',
      categoryId: catFood,
      walletId: 'wal-meal',
      memo: 'Biryani bowl with colleagues',
      isSample: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'rec-sample-07',
      accountId: 'acc-personal',
      type: 'transfer',
      amountPaise: 500000, // ₹5,000
      dateTime: new Date(currYear, currMonth - 1, 12, 16, 0).toISOString(),
      description: 'ATM Cash Withdrawal',
      categoryId: getCatId('Others', 'expense'),
      walletId: 'wal-upi',
      toWalletId: 'wal-cash',
      feePaise: 0,
      memo: 'HDFC ATM withdrawal for petty cash',
      isSample: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'rec-sample-08',
      accountId: 'acc-personal',
      type: 'expense',
      amountPaise: 18000, // ₹180
      dateTime: new Date(currYear, currMonth - 1, 14, 17, 30).toISOString(),
      description: 'Chai & Samosa',
      categoryId: catFood,
      walletId: 'wal-cash',
      isSample: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'rec-sample-09',
      accountId: 'acc-personal',
      type: 'expense',
      amountPaise: 349900, // ₹3,499
      dateTime: new Date(currYear, currMonth - 1, 18, 20, 15).toISOString(),
      description: 'Amazon Great Indian Sale',
      categoryId: catShopping,
      walletId: 'wal-upi',
      memo: 'Wireless earbuds and backpack',
      tags: ['gadgets'],
      isSample: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'rec-sample-10',
      accountId: 'acc-personal',
      type: 'expense',
      amountPaise: 45000, // ₹450
      dateTime: new Date(currYear, currMonth - 1, 22, 19, 0).toISOString(),
      description: 'Uber Ride from Airport',
      categoryId: catTransport,
      walletId: 'wal-upi',
      isSample: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'rec-sample-11',
      accountId: 'acc-personal',
      type: 'expense',
      amountPaise: 79900, // ₹799
      dateTime: new Date(currYear, currMonth - 1, 26, 21, 0).toISOString(),
      description: 'Netflix 4K Subscription',
      categoryId: catEntertainment,
      walletId: 'wal-upi',
      isSample: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },

    // --- CURRENT MONTH ---
    {
      id: 'rec-sample-12',
      accountId: 'acc-personal',
      type: 'income',
      amountPaise: 7500000, // ₹75,000
      dateTime: new Date(currYear, currMonth, 1, 10, 0).toISOString(),
      description: 'Monthly Salary Credit',
      categoryId: catSalary,
      walletId: 'wal-upi',
      memo: 'October Salary Direct Deposit',
      tags: ['salary'],
      isSample: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'rec-sample-13',
      accountId: 'acc-personal',
      type: 'income',
      amountPaise: 1200000, // ₹12,000
      dateTime: new Date(currYear, currMonth, 2, 16, 40).toISOString(),
      description: 'Quarterly Performance Bonus',
      categoryId: catBonus,
      walletId: 'wal-upi',
      memo: 'Q3 excellence award',
      tags: ['bonus'],
      isSample: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'rec-sample-14',
      accountId: 'acc-personal',
      type: 'expense',
      amountPaise: 2200000, // ₹22,000
      dateTime: new Date(currYear, currMonth, 3, 11, 0).toISOString(),
      description: 'Apartment Rent',
      categoryId: catRent,
      walletId: 'wal-upi',
      memo: 'October rent via UPI',
      tags: ['rent'],
      isSample: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'rec-sample-15',
      accountId: 'acc-personal',
      type: 'expense',
      amountPaise: 178000, // ₹1,780
      dateTime: new Date(currYear, currMonth, 5, 12, 10).toISOString(),
      description: 'Electricity Bill',
      categoryId: catBills,
      walletId: 'wal-upi',
      tags: ['utilities'],
      isSample: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'rec-sample-16',
      accountId: 'acc-personal',
      type: 'expense',
      amountPaise: 215000, // ₹2,150
      dateTime: new Date(currYear, currMonth, 7, 18, 45).toISOString(),
      description: 'Nature Basket Supermarket',
      categoryId: catGroceries,
      walletId: 'wal-upi',
      memo: 'Monthly groceries stock',
      tags: ['groceries'],
      isSample: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'rec-sample-17',
      accountId: 'acc-personal',
      type: 'expense',
      amountPaise: 34900, // ₹349
      dateTime: new Date(currYear, currMonth, 8, 15, 20).toISOString(),
      description: 'Jio Prepaid 5G Recharge',
      categoryId: catRecharge,
      walletId: 'wal-upi',
      isSample: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'rec-sample-18',
      accountId: 'acc-personal',
      type: 'expense',
      amountPaise: 142000, // ₹1,420
      dateTime: new Date(currYear, currMonth, 10, 20, 30).toISOString(),
      description: 'Weekend Dinner Outing',
      categoryId: catFood,
      walletId: 'wal-meal',
      memo: 'Barbeque Nation with friends',
      tags: ['dining', 'weekend'],
      isSample: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'rec-sample-19',
      accountId: 'acc-personal',
      type: 'expense',
      amountPaise: 20000, // ₹200
      dateTime: new Date(currYear, currMonth, 12, 9, 15).toISOString(),
      description: 'Namma Metro Card Recharge',
      categoryId: catTransport,
      walletId: 'wal-upi',
      memo: 'Smart card recharge at MG Road station',
      tags: ['metro'],
      isSample: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'rec-sample-20',
      accountId: 'acc-personal',
      type: 'expense',
      amountPaise: 210000, // ₹2,100
      dateTime: new Date(currYear, currMonth, 15, 17, 0).toISOString(),
      description: 'Diwali Dry Fruits & Sweets Box',
      categoryId: catGifts,
      walletId: 'wal-upi',
      memo: 'Festive gifts for family and neighbors',
      tags: ['festival', 'diwali'],
      isSample: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'rec-sample-21',
      accountId: 'acc-personal',
      type: 'expense',
      amountPaise: 82000, // ₹820
      dateTime: new Date(currYear, currMonth, 18, 19, 10).toISOString(),
      description: 'Zepto Instant Grocery',
      categoryId: catGroceries,
      walletId: 'wal-upi',
      memo: 'Snacks, tea leaves, olive oil',
      isSample: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'rec-sample-22',
      accountId: 'acc-personal',
      type: 'expense',
      amountPaise: 38000, // ₹380
      dateTime: new Date(currYear, currMonth, 20, 13, 0).toISOString(),
      description: 'Zomato Lunch Box',
      categoryId: catFood,
      walletId: 'wal-meal',
      memo: 'North Indian Thali',
      tags: ['lunch'],
      isSample: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'rec-sample-23',
      accountId: 'acc-personal',
      type: 'expense',
      amountPaise: 12000, // ₹120
      dateTime: new Date(currYear, currMonth, 21, 16, 15).toISOString(),
      description: 'Evening Filter Coffee & Snacks',
      categoryId: catFood,
      walletId: 'wal-cash',
      memo: 'Udupi darshini coffee',
      isSample: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  await db.records.bulkPut(sampleRecords);

  // Sample Budget
  const existingBudget = await db.budgets.get('bud-monthly-living');
  if (!existingBudget) {
    const sampleBudget: Budget = {
      id: 'bud-monthly-living',
      accountId: 'acc-personal',
      name: 'Monthly Essentials & Food',
      amountPaise: 3500000, // ₹35,000
      period: 'monthly',
      categoryIds: [catFood, catGroceries, catBills, catTransport],
      rollover: true,
      alertThresholdPercent: 80,
      createdAt: new Date().toISOString(),
    };
    await db.budgets.put(sampleBudget);
  }

  // Sample Goal
  const existingGoal = await db.goals.get('goal-macbook');
  if (!existingGoal) {
    const sampleGoal: Goal = {
      id: 'goal-macbook',
      accountId: 'acc-personal',
      name: 'MacBook Pro Setup',
      targetAmountPaise: 18000000, // ₹1,80,000
      currentSavedPaise: 7500000,  // ₹75,000
      targetDate: new Date(currYear + 1, 3, 30).toISOString(),
      icon: 'Laptop',
      color: '#3b82f6',
      walletId: 'wal-upi',
      createdAt: new Date().toISOString(),
    };
    await db.goals.put(sampleGoal);
  }

  // Sample Debt
  const existingDebt = await db.debts.get('debt-rahul');
  if (!existingDebt) {
    const sampleDebt: Debt = {
      id: 'debt-rahul',
      accountId: 'acc-personal',
      type: 'owed',
      person: 'Rahul Sharma',
      amountPaise: 350000, // ₹3,500
      date: new Date(currYear, currMonth, 10).toISOString(),
      dueDate: new Date(currYear, currMonth + 1, 15).toISOString(),
      note: 'Goa road trip villa booking split',
      payments: [
        {
          id: 'pay-1',
          amountPaise: 100000, // ₹1,000
          dateTime: new Date(currYear, currMonth, 14).toISOString(),
          note: 'Google Pay partial settlement',
        },
      ],
      isSettled: false,
      createdAt: new Date().toISOString(),
    };
    await db.debts.put(sampleDebt);
  }

  // Sample Recurring Rules
  const existingRecurring = await db.recurringRules.get('rec-rule-salary');
  if (!existingRecurring) {
    const sampleRule: RecurringRule = {
      id: 'rec-rule-salary',
      accountId: 'acc-personal',
      type: 'income',
      amountPaise: 7500000, // ₹75,000
      description: 'Monthly Salary Credit',
      categoryId: catSalary,
      walletId: 'wal-upi',
      startDate: new Date(currYear, currMonth - 2, 1).toISOString(),
      frequency: 'monthly',
      dayOfMonth: 1,
      endType: 'never',
      executionCount: 2,
      lastExecutedDate: new Date(currYear, currMonth, 1).toISOString(),
      nextDueDate: new Date(currYear, currMonth + 1, 1, 9, 0).toISOString(),
      autoAdd: true,
      createdAt: new Date().toISOString(),
    };
    await db.recurringRules.put(sampleRule);
  }

  // Sample Templates
  const existingTemplates = await db.templates.count();
  if (existingTemplates === 0) {
    const sampleTemplates: Template[] = [
      {
        id: 'tmpl-1',
        accountId: 'acc-personal',
        name: 'Chai & Snacks',
        type: 'expense',
        amountPaise: 8000, // ₹80
        description: 'Chai & Snacks',
        categoryId: catFood,
        walletId: 'wal-cash',
      },
      {
        id: 'tmpl-2',
        accountId: 'acc-personal',
        name: 'Metro Recharge',
        type: 'expense',
        amountPaise: 20000, // ₹200
        description: 'Metro Card UPI Recharge',
        categoryId: catTransport,
        walletId: 'wal-upi',
      },
      {
        id: 'tmpl-3',
        accountId: 'acc-personal',
        name: 'Zepto Essentials',
        type: 'expense',
        amountPaise: 45000, // ₹450
        description: 'Zepto Quick Grocery',
        categoryId: catGroceries,
        walletId: 'wal-upi',
      },
    ];
    await db.templates.bulkPut(sampleTemplates);
  }

  // Mark settings as seeded
  await db.settings.update('user-settings-default', { hasSeededData: true });
}

export async function clearAllSampleData(): Promise<void> {
  await db.records.filter((r) => !!r.isSample).delete();
  await db.settings.update('user-settings-default', { hasSeededData: false });
}

export async function resetAllData(): Promise<void> {
  await db.records.clear();
  await db.wallets.clear();
  await db.categories.clear();
  await db.budgets.clear();
  await db.goals.clear();
  await db.debts.clear();
  await db.recurringRules.clear();
  await db.templates.clear();
  await db.accounts.clear();
  await initializeDatabaseDefaults();
}
