import Dexie, { type EntityTable } from 'dexie';
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

export class RupeeFlowDatabase extends Dexie {
  accounts!: EntityTable<Account, 'id'>;
  wallets!: EntityTable<Wallet, 'id'>;
  categories!: EntityTable<Category, 'id'>;
  records!: EntityTable<Record, 'id'>;
  budgets!: EntityTable<Budget, 'id'>;
  goals!: EntityTable<Goal, 'id'>;
  debts!: EntityTable<Debt, 'id'>;
  recurringRules!: EntityTable<RecurringRule, 'id'>;
  templates!: EntityTable<Template, 'id'>;
  settings!: EntityTable<UserSettings, 'id'>;

  constructor() {
    super('RupeeFlowDB');

    this.version(1).stores({
      accounts: 'id, name, isDefault',
      wallets: 'id, accountId, type, includeInTotal, isArchived',
      categories: 'id, type, name, parentId, isDefault',
      records: 'id, accountId, type, dateTime, categoryId, walletId, toWalletId, isSample, [accountId+dateTime]',
      budgets: 'id, accountId, period',
      goals: 'id, accountId',
      debts: 'id, accountId, type, isSettled',
      recurringRules: 'id, accountId, nextDueDate, autoAdd',
      templates: 'id, accountId, type',
      settings: 'id',
    });
  }
}

export const db = new RupeeFlowDatabase();
