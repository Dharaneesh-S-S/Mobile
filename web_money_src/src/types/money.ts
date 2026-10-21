export type TransactionType = 'income' | 'expense' | 'transfer';

export type WalletType = 
  | 'cash' 
  | 'bank' 
  | 'upi' 
  | 'credit' 
  | 'meal' 
  | 'savings' 
  | 'investment' 
  | 'other';

export interface Account {
  id: string;
  name: string;
  isDefault?: boolean;
  createdAt: string;
}

export interface Wallet {
  id: string;
  accountId: string;
  name: string;
  type: WalletType;
  startingBalancePaise: number;
  color: string;
  icon: string;
  currency: 'INR';
  includeInTotal: boolean;
  creditLimitPaise?: number;
  billDay?: number;
  isArchived?: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  color: string;
  parentId?: string;
  isDefault?: boolean;
  order?: number;
}

export interface SplitLine {
  categoryId: string;
  amountPaise: number;
  note?: string;
}

export interface Record {
  id: string;
  accountId: string;
  type: TransactionType;
  amountPaise: number; // Stored in integer paise (₹1 = 100 paise)
  dateTime: string; // ISO 8601 string
  description: string;
  categoryId: string;
  walletId: string;
  toWalletId?: string; // For transfers
  feePaise?: number; // Fee for transfers in paise
  memo?: string;
  imageBlobs?: string[]; // Data URLs or blob URLs
  tags?: string[];
  splitLines?: SplitLine[];
  recurringId?: string;
  isSample?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  accountId: string;
  name: string;
  amountPaise: number;
  period: 'weekly' | 'monthly' | 'yearly' | 'custom';
  categoryIds: string[]; // empty means all categories
  walletIds?: string[];
  rollover: boolean;
  alertThresholdPercent: number; // e.g. 80
  createdAt: string;
}

export interface Goal {
  id: string;
  accountId: string;
  name: string;
  targetAmountPaise: number;
  currentSavedPaise: number;
  targetDate: string;
  icon: string;
  color: string;
  walletId?: string;
  createdAt: string;
}

export interface DebtPayment {
  id: string;
  amountPaise: number;
  dateTime: string;
  note?: string;
}

export interface Debt {
  id: string;
  accountId: string;
  type: 'owe' | 'owed'; // 'owe' = I owe them, 'owed' = They owe me
  person: string;
  amountPaise: number;
  date: string;
  dueDate?: string;
  interestRate?: number; // annual percentage
  note?: string;
  payments: DebtPayment[];
  isSettled: boolean;
  createdAt: string;
}

export type RecurringFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'customDays';

export interface RecurringRule {
  id: string;
  accountId: string;
  type: TransactionType;
  amountPaise: number;
  description: string;
  categoryId: string;
  walletId: string;
  toWalletId?: string;
  feePaise?: number;
  memo?: string;
  startDate: string;
  frequency: RecurringFrequency;
  intervalDays?: number; // for customDays
  daysOfWeek?: number[]; // 0=Sun, 6=Sat
  dayOfMonth?: number; // 1-31
  isLastDayOfMonth?: boolean;
  endType: 'never' | 'date' | 'count';
  endDate?: string;
  endCount?: number;
  executionCount: number;
  lastExecutedDate?: string;
  nextDueDate: string;
  autoAdd: boolean; // true = auto, false = ask for confirmation
  splitLines?: SplitLine[];
  createdAt: string;
}

export interface Template {
  id: string;
  accountId: string;
  name: string;
  type: TransactionType;
  amountPaise: number;
  description: string;
  categoryId: string;
  walletId: string;
  toWalletId?: string;
  memo?: string;
}

export type ViewRangeType = 'day' | 'week' | 'month' | 'year' | 'all' | 'custom';

export interface UserSettings {
  id: string;
  theme: 'dark' | 'light' | 'system';
  accentColor: string;
  weekStartDay: 0 | 1; // 0=Sunday, 1=Monday
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  timeFormat: '12h' | '24h';
  numberGrouping: 'in' | 'intl';
  showDecimals: boolean;
  compactCalendarFormat: 'full' | 'short' | 'lakhs';
  defaultWalletId?: string;
  defaultAccountId: string;
  monthStartDay: number; // 1 to 28 (e.g. 25th for salary cycle)
  hideBalanceDefault: boolean;
  showGreenNet: boolean;
  isPhoneFrameEnabled: boolean;
  passcode?: string;
  isPasscodeEnabled: boolean;
  autoLockMinutes: number;
  lastActiveTimestamp?: number;
  hasSeededData: boolean;
}
