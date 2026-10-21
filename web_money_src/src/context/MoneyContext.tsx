import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
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
  TransactionType,
  ViewRangeType,
} from '../types/money';
import {
  initializeDatabaseDefaults,
  DEFAULT_SETTINGS,
  seedSampleDemoData,
  clearAllSampleData,
  resetAllData,
} from '../db/seedData';
import { calculateDateRange, shiftDate } from '../utils/dateUtils';
import { processDueRecurringRules } from '../utils/recurring';
import { parseInrToPaise } from '../utils/currency';
import { Toast, ToastMessage } from '../components/common/Toast';

interface AddRecordOptions {
  type?: TransactionType;
  date?: string;
  recordToEdit?: Record;
}

interface MoneyContextType {
  // Navigation
  activeTab: 'transactions' | 'calendar' | 'statistics' | 'wallet';
  setActiveTab: (tab: 'transactions' | 'calendar' | 'statistics' | 'wallet') => void;
  anchorDate: Date;
  setAnchorDate: (date: Date) => void;
  viewRange: ViewRangeType;
  setViewRange: (range: ViewRangeType) => void;
  navigatePeriod: (direction: 'prev' | 'next') => void;
  dateRange: { start: Date; end: Date; label: string };

  // Data
  accounts: Account[];
  currentAccount: Account | null;
  setCurrentAccountId: (id: string) => void;
  wallets: Wallet[];
  categories: Category[];
  records: Record[];
  filteredRecords: Record[];
  budgets: Budget[];
  goals: Goal[];
  debts: Debt[];
  recurringRules: RecurringRule[];
  templates: Template[];
  settings: UserSettings;
  updateSettings: (updates: Partial<UserSettings>) => Promise<void>;

  // Derived Totals
  walletBalances: Map<string, number>;
  totalAccountBalance: number;
  periodIncome: number;
  periodExpense: number;
  periodNet: number;
  openingBalance: number;
  endingBalance: number;

  // Balance Visibility
  isBalanceHidden: boolean;
  toggleHideBalance: () => void;

  // Chart Style toggle on Statistic tab
  chartStyle: 'donut' | 'bars';
  toggleChartStyle: () => void;

  // Modals
  addRecordOptions: AddRecordOptions | null;
  openAddRecord: (options?: AddRecordOptions) => void;
  closeAddRecord: () => void;

  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;

  isCategoryManagerOpen: boolean;
  openCategoryManager: () => void;
  closeCategoryManager: () => void;

  isAccountSwitcherOpen: boolean;
  openAccountSwitcher: () => void;
  closeAccountSwitcher: () => void;

  activeWalletForDetail: Wallet | null;
  openWalletDetail: (wallet: Wallet | null) => void;

  editingBudget: Budget | null | 'new';
  openBudgetModal: (budget?: Budget | 'new') => void;
  closeBudgetModal: () => void;

  editingGoal: Goal | null | 'new';
  openGoalModal: (goal?: Goal | 'new') => void;
  closeGoalModal: () => void;

  editingDebt: Debt | null | 'new';
  openDebtModal: (debt?: Debt | 'new') => void;
  closeDebtModal: () => void;

  editingRecurring: RecurringRule | null | 'new';
  openRecurringModal: (rule?: RecurringRule | 'new') => void;
  closeRecurringModal: () => void;

  isSettingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;

  isMonthlyReportOpen: boolean;
  openMonthlyReport: () => void;
  closeMonthlyReport: () => void;

  // Actions
  addRecord: (rec: Omit<Record, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateRecord: (id: string, updates: Partial<Record>) => Promise<void>;
  deleteRecord: (id: string, withUndo?: boolean) => Promise<void>;
  bulkDeleteRecords: (ids: string[]) => Promise<void>;
  bulkUpdateRecords: (ids: string[], updates: Partial<Record>) => Promise<void>;
  duplicateRecord: (rec: Record) => Promise<string>;
  quickAddTransaction: (text: string) => Promise<{ success: boolean; message: string }>;

  // Demo Data
  loadDemoData: () => Promise<void>;
  clearDemoData: () => Promise<void>;
  resetDatabase: () => Promise<void>;

  // Toast
  showToast: (msg: Omit<ToastMessage, 'id'>) => void;

  // Passcode
  isLocked: boolean;
  unlockApp: () => void;
}

const MoneyContext = createContext<MoneyContextType | null>(null);

export const MoneyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Navigation state
  const [activeTab, setActiveTab] = useState<'transactions' | 'calendar' | 'statistics' | 'wallet'>('transactions');
  const [anchorDate, setAnchorDate] = useState<Date>(new Date());
  const [viewRange, setViewRange] = useState<ViewRangeType>('month');
  const [chartStyle, setChartStyle] = useState<'donut' | 'bars'>('donut');
  const [isBalanceHidden, setIsBalanceHidden] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  // 2. Modals state
  const [addRecordOptions, setAddRecordOptions] = useState<AddRecordOptions | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState<boolean>(false);
  const [isAccountSwitcherOpen, setIsAccountSwitcherOpen] = useState<boolean>(false);
  const [activeWalletForDetail, setActiveWalletForDetail] = useState<Wallet | null>(null);
  const [editingBudget, setEditingBudget] = useState<Budget | null | 'new'>(null);
  const [editingGoal, setEditingGoal] = useState<Goal | null | 'new'>(null);
  const [editingDebt, setEditingDebt] = useState<Debt | null | 'new'>(null);
  const [editingRecurring, setEditingRecurring] = useState<RecurringRule | null | 'new'>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isMonthlyReportOpen, setIsMonthlyReportOpen] = useState<boolean>(false);

  // 3. Toast
  const [currentToast, setCurrentToast] = useState<ToastMessage | null>(null);

  const showToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}`;
    const newToast: ToastMessage = { ...toast, id };
    setCurrentToast(newToast);

    const duration = toast.durationMs || 4000;
    setTimeout(() => {
      setCurrentToast((curr) => (curr?.id === id ? null : curr));
    }, duration);
  }, []);

  // 4. Dexie Reactive Queries
  const accounts = useLiveQuery(() => db.accounts.toArray(), []) || [];
  const rawSettings = useLiveQuery(() => db.settings.get('user-settings-default'), []);
  const settings = rawSettings || DEFAULT_SETTINGS;

  const [currentAccountId, setCurrentAccountId] = useState<string>('acc-personal');

  useEffect(() => {
    if (accounts.length > 0 && !accounts.find((a) => a.id === currentAccountId)) {
      const def = accounts.find((a) => a.isDefault) || accounts[0];
      setCurrentAccountId(def.id);
    }
  }, [accounts, currentAccountId]);

  const currentAccount = useMemo(() => {
    return accounts.find((a) => a.id === currentAccountId) || accounts[0] || null;
  }, [accounts, currentAccountId]);

  const wallets = useLiveQuery(
    () => db.wallets.where('accountId').equals(currentAccountId).toArray(),
    [currentAccountId]
  ) || [];

  const categories = useLiveQuery(() => db.categories.toArray(), []) || [];

  const allRecords = useLiveQuery(
    () => db.records.where('accountId').equals(currentAccountId).toArray(),
    [currentAccountId]
  ) || [];

  const budgets = useLiveQuery(
    () => db.budgets.where('accountId').equals(currentAccountId).toArray(),
    [currentAccountId]
  ) || [];

  const goals = useLiveQuery(
    () => db.goals.where('accountId').equals(currentAccountId).toArray(),
    [currentAccountId]
  ) || [];

  const debts = useLiveQuery(
    () => db.debts.where('accountId').equals(currentAccountId).toArray(),
    [currentAccountId]
  ) || [];

  const recurringRules = useLiveQuery(
    () => db.recurringRules.where('accountId').equals(currentAccountId).toArray(),
    [currentAccountId]
  ) || [];

  const templates = useLiveQuery(
    () => db.templates.where('accountId').equals(currentAccountId).toArray(),
    [currentAccountId]
  ) || [];

  // 5. Initial setup & Recurring rule background processor
  useEffect(() => {
    async function init() {
      await initializeDatabaseDefaults();
      // Auto-lock if passcode enabled
      const s = await db.settings.get('user-settings-default');
      if (s?.isPasscodeEnabled && s.passcode) {
        setIsLocked(true);
      }
      // Process recurring records
      const recurringRes = await processDueRecurringRules();
      if (recurringRes.generatedCount > 0) {
        showToast({
          type: 'info',
          text: `Auto-generated ${recurringRes.generatedCount} recurring transactions`,
        });
      }
    }
    init();
  }, [showToast]);

  // Apply dark/light theme class to document element
  useEffect(() => {
    const isDark =
      settings.theme === 'dark' ||
      (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // 6. Date Range Calculations
  const dateRange = useMemo(() => {
    return calculateDateRange(
      anchorDate,
      viewRange,
      settings.weekStartDay,
      settings.monthStartDay
    );
  }, [anchorDate, viewRange, settings.weekStartDay, settings.monthStartDay]);

  const navigatePeriod = useCallback(
    (direction: 'prev' | 'next') => {
      setAnchorDate((prev) => shiftDate(prev, viewRange, direction));
    },
    [viewRange]
  );

  // 7. Dynamic Wallet Balances & Account Total
  // Wallet balance = starting balance + income - expense +/- transfers - fee
  const walletBalances = useMemo(() => {
    const map = new Map<string, number>();

    for (const w of wallets) {
      map.set(w.id, w.startingBalancePaise);
    }

    for (const r of allRecords) {
      if (r.walletId && map.has(r.walletId)) {
        const curr = map.get(r.walletId)!;
        if (r.type === 'income') {
          map.set(r.walletId, curr + r.amountPaise);
        } else if (r.type === 'expense') {
          map.set(r.walletId, curr - r.amountPaise);
        } else if (r.type === 'transfer') {
          map.set(r.walletId, curr - r.amountPaise - (r.feePaise || 0));
        }
      }
      if (r.type === 'transfer' && r.toWalletId && map.has(r.toWalletId)) {
        const curr = map.get(r.toWalletId)!;
        map.set(r.toWalletId, curr + r.amountPaise);
      }
    }

    return map;
  }, [wallets, allRecords]);

  const totalAccountBalance = useMemo(() => {
    let sum = 0;
    for (const w of wallets) {
      if (w.includeInTotal && !w.isArchived) {
        sum += walletBalances.get(w.id) || 0;
      }
    }
    return sum;
  }, [wallets, walletBalances]);

  // 8. Filtered Records for Current Period
  const filteredRecords = useMemo(() => {
    const startMs = dateRange.start.getTime();
    const endMs = dateRange.end.getTime();

    return allRecords
      .filter((r) => {
        const t = new Date(r.dateTime).getTime();
        return t >= startMs && t <= endMs;
      })
      .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
  }, [allRecords, dateRange]);

  // 9. Period Totals
  const { periodIncome, periodExpense, periodNet, openingBalance, endingBalance } = useMemo(() => {
    let inc = 0;
    let exp = 0;

    for (const r of filteredRecords) {
      if (r.type === 'income') {
        inc += r.amountPaise;
      } else if (r.type === 'expense') {
        exp += r.amountPaise;
      } else if (r.type === 'transfer' && r.feePaise) {
        exp += r.feePaise;
      }
    }

    // Opening balance = net from all records before period start + starting balances
    let priorNet = 0;
    for (const w of wallets) {
      if (w.includeInTotal && !w.isArchived) {
        priorNet += w.startingBalancePaise;
      }
    }

    const startMs = dateRange.start.getTime();
    for (const r of allRecords) {
      const t = new Date(r.dateTime).getTime();
      if (t < startMs) {
        if (r.type === 'income') priorNet += r.amountPaise;
        else if (r.type === 'expense') priorNet -= r.amountPaise;
        else if (r.type === 'transfer' && r.feePaise) priorNet -= r.feePaise;
      }
    }

    const net = inc - exp;
    return {
      periodIncome: inc,
      periodExpense: exp,
      periodNet: net,
      openingBalance: priorNet,
      endingBalance: priorNet + net,
    };
  }, [filteredRecords, allRecords, wallets, dateRange]);

  // 10. CRUD Actions with Undo support
  const addRecord = async (rec: Omit<Record, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    const id = `rec-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const fullRec: Record = {
      ...rec,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await db.records.put(fullRec);
    showToast({ type: 'success', text: `Saved ₹${(fullRec.amountPaise / 100).toLocaleString('en-IN')}` });
    return id;
  };

  const updateRecord = async (id: string, updates: Partial<Record>): Promise<void> => {
    await db.records.update(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    showToast({ type: 'success', text: 'Record updated' });
  };

  const deleteRecord = async (id: string, withUndo: boolean = true): Promise<void> => {
    const recordToDelete = await db.records.get(id);
    if (!recordToDelete) return;

    await db.records.delete(id);

    if (withUndo) {
      showToast({
        type: 'info',
        text: 'Record deleted',
        undoAction: async () => {
          await db.records.put(recordToDelete);
          showToast({ type: 'success', text: 'Record restored' });
        },
      });
    }
  };

  const bulkDeleteRecords = async (ids: string[]): Promise<void> => {
    const recordsToDelete = await db.records.bulkGet(ids);
    const valid = recordsToDelete.filter((r): r is Record => !!r);
    await db.records.bulkDelete(ids);

    showToast({
      type: 'info',
      text: `Deleted ${ids.length} records`,
      undoAction: async () => {
        await db.records.bulkPut(valid);
        showToast({ type: 'success', text: 'Records restored' });
      },
    });
  };

  const bulkUpdateRecords = async (ids: string[], updates: Partial<Record>): Promise<void> => {
    await Promise.all(
      ids.map((id) =>
        db.records.update(id, {
          ...updates,
          updatedAt: new Date().toISOString(),
        })
      )
    );
    showToast({ type: 'success', text: `Updated ${ids.length} records` });
  };

  const duplicateRecord = async (rec: Record): Promise<string> => {
    const id = `rec-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const copy: Record = {
      ...rec,
      id,
      dateTime: new Date().toISOString(),
      description: `${rec.description} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await db.records.put(copy);
    showToast({ type: 'success', text: 'Record duplicated' });
    return id;
  };

  // Quick Add parser: "lunch 90 food" or "salary 75000"
  const quickAddTransaction = async (text: string): Promise<{ success: boolean; message: string }> => {
    const trimmed = text.trim();
    if (!trimmed) return { success: false, message: 'Please enter transaction details' };

    // Find amount in text
    const amountMatch = trimmed.match(/(?:₹\s*|rs\.?\s*)?(\d+(?:\.\d+)?)/i);
    if (!amountMatch) {
      return { success: false, message: 'Could not find amount in text' };
    }

    const amountRupees = parseFloat(amountMatch[1]);
    const amountPaise = Math.round(amountRupees * 100);

    // Remaining words
    const cleanWords = trimmed
      .replace(amountMatch[0], '')
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    let desc = cleanWords.join(' ') || 'Quick Transaction';
    let type: TransactionType = 'expense';

    // Check if category name matches any word
    let matchedCat = categories.find((c) =>
      cleanWords.some((w) => w.toLowerCase() === c.name.toLowerCase())
    );

    if (matchedCat) {
      type = matchedCat.type;
    } else {
      if (/salary|dividend|bonus|income|interest/i.test(desc)) {
        type = 'income';
        matchedCat = categories.find((c) => c.name.toLowerCase() === 'salary' && c.type === 'income') ||
          categories.find((c) => c.type === 'income');
      } else {
        matchedCat = categories.find((c) => c.name.toLowerCase() === 'food' && c.type === 'expense') ||
          categories.find((c) => c.type === 'expense');
      }
    }

    const defaultWallet = wallets.find((w) => w.id === settings.defaultWalletId) || wallets[0];
    if (!defaultWallet) {
      return { success: false, message: 'No wallet found' };
    }

    await addRecord({
      accountId: currentAccountId,
      type,
      amountPaise,
      dateTime: new Date().toISOString(),
      description: desc,
      categoryId: matchedCat?.id || 'cat-exp-1',
      walletId: defaultWallet.id,
    });

    return { success: true, message: `Added ${desc} ₹${amountRupees.toLocaleString('en-IN')}` };
  };

  const updateSettings = async (updates: Partial<UserSettings>): Promise<void> => {
    await db.settings.update('user-settings-default', updates);
  };

  const loadDemoData = async () => {
    await seedSampleDemoData();
    showToast({ type: 'success', text: 'Loaded 2 months of sample rupee records' });
  };

  const clearDemoData = async () => {
    await clearAllSampleData();
    showToast({ type: 'info', text: 'Sample records cleared' });
  };

  const resetDatabase = async () => {
    await resetAllData();
    showToast({ type: 'info', text: 'All data has been reset to defaults' });
  };

  const toggleHideBalance = () => setIsBalanceHidden((prev) => !prev);
  const toggleChartStyle = () => setChartStyle((prev) => (prev === 'donut' ? 'bars' : 'donut'));

  const openAddRecord = (options?: AddRecordOptions) => setAddRecordOptions(options || {});
  const closeAddRecord = () => setAddRecordOptions(null);

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  const openCategoryManager = () => setIsCategoryManagerOpen(true);
  const closeCategoryManager = () => setIsCategoryManagerOpen(false);

  const openAccountSwitcher = () => setIsAccountSwitcherOpen(true);
  const closeAccountSwitcher = () => setIsAccountSwitcherOpen(false);

  const openWalletDetail = (wallet: Wallet | null) => setActiveWalletForDetail(wallet);

  const openBudgetModal = (b?: Budget | 'new') => setEditingBudget(b || 'new');
  const closeBudgetModal = () => setEditingBudget(null);

  const openGoalModal = (g?: Goal | 'new') => setEditingGoal(g || 'new');
  const closeGoalModal = () => setEditingGoal(null);

  const openDebtModal = (d?: Debt | 'new') => setEditingDebt(d || 'new');
  const closeDebtModal = () => setEditingDebt(null);

  const openRecurringModal = (r?: RecurringRule | 'new') => setEditingRecurring(r || 'new');
  const closeRecurringModal = () => setEditingRecurring(null);

  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);

  const openMonthlyReport = () => setIsMonthlyReportOpen(true);
  const closeMonthlyReport = () => setIsMonthlyReportOpen(false);

  const unlockApp = () => setIsLocked(false);

  return (
    <MoneyContext.Provider
      value={{
        activeTab,
        setActiveTab,
        anchorDate,
        setAnchorDate,
        viewRange,
        setViewRange,
        navigatePeriod,
        dateRange,
        accounts,
        currentAccount,
        setCurrentAccountId,
        wallets,
        categories,
        records: allRecords,
        filteredRecords,
        budgets,
        goals,
        debts,
        recurringRules,
        templates,
        settings,
        updateSettings,
        walletBalances,
        totalAccountBalance,
        periodIncome,
        periodExpense,
        periodNet,
        openingBalance,
        endingBalance,
        isBalanceHidden,
        toggleHideBalance,
        chartStyle,
        toggleChartStyle,
        addRecordOptions,
        openAddRecord,
        closeAddRecord,
        isSearchOpen,
        openSearch,
        closeSearch,
        isCategoryManagerOpen,
        openCategoryManager,
        closeCategoryManager,
        isAccountSwitcherOpen,
        openAccountSwitcher,
        closeAccountSwitcher,
        activeWalletForDetail,
        openWalletDetail,
        editingBudget,
        openBudgetModal,
        closeBudgetModal,
        editingGoal,
        openGoalModal,
        closeGoalModal,
        editingDebt,
        openDebtModal,
        closeDebtModal,
        editingRecurring,
        openRecurringModal,
        closeRecurringModal,
        isSettingsOpen,
        openSettings,
        closeSettings,
        isMonthlyReportOpen,
        openMonthlyReport,
        closeMonthlyReport,
        addRecord,
        updateRecord,
        deleteRecord,
        bulkDeleteRecords,
        bulkUpdateRecords,
        duplicateRecord,
        quickAddTransaction,
        loadDemoData,
        clearDemoData,
        resetDatabase,
        showToast,
        isLocked,
        unlockApp,
      }}
    >
      {children}
      <Toast toast={currentToast} onClose={() => setCurrentToast(null)} />
    </MoneyContext.Provider>
  );
};

export function useMoney(): MoneyContextType {
  const ctx = useContext(MoneyContext);
  if (!ctx) {
    throw new Error('useMoney must be used within a MoneyProvider');
  }
  return ctx;
}
