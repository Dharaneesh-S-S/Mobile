import 'package:drift/drift.dart';
import 'calendar_tables.dart';
import 'task_tables.dart';

/// Money accounts table (e.g. Bank, Cash, Credit Card)
@DataClassName('MoneyAccountEntry')
class MoneyAccounts extends Table {
  TextColumn get id => text()();
  TextColumn get name => text().withLength(min: 1, max: 128)();
  TextColumn get accountType => text()(); // 'bank', 'cash', 'credit_card', 'wallet'
  IntColumn get balancePaise => integer().withDefault(const Constant(0))(); // Integer minor units (Paise)
  TextColumn get currencyCode => text().withDefault(const Constant('INR'))();
  BoolColumn get isActive => boolean().withDefault(const Constant(true))();
  IntColumn get createdAtUtc => integer()();

  @override
  Set<Column> get primaryKey => {id};
}

/// Money categories table (e.g. Groceries, Rent, Salary, Utilities)
@DataClassName('MoneyCategoryEntry')
class MoneyCategories extends Table {
  TextColumn get id => text()();
  TextColumn get name => text().withLength(min: 1, max: 64)();
  TextColumn get iconName => text().withDefault(const Constant('category'))();
  BoolColumn get isExpense => boolean().withDefault(const Constant(true))();
  IntColumn get colorValue => integer().withDefault(const Constant(0xFF3B82F6))();
  IntColumn get createdAtUtc => integer()();

  @override
  Set<Column> get primaryKey => {id};
}

/// Money transactions table
@DataClassName('MoneyTransactionEntry')
@TableIndex(name: 'idx_tx_time', columns: {#transactionTimeUtc})
@TableIndex(name: 'idx_tx_account', columns: {#accountId})
class MoneyTransactions extends Table {
  TextColumn get id => text()();
  TextColumn get accountId => text().references(MoneyAccounts, #id, onDelete: KeyAction.cascade)();
  TextColumn get toAccountId => text().nullable().references(MoneyAccounts, #id, onDelete: KeyAction.cascade)(); // For transfers
  TextColumn get categoryId => text().nullable().references(MoneyCategories, #id, onDelete: KeyAction.setNull)();
  IntColumn get amountPaise => integer()(); // Integer minor units (Paise). NEVER float!
  TextColumn get type => text().withDefault(const Constant('expense'))(); // 'income', 'expense', 'transfer'
  IntColumn get transactionTimeUtc => integer()(); // UTC epoch milliseconds
  TextColumn get note => text().nullable()();
  
  // Shared references to Calendar and Tasks (avoiding duplicate copies)
  TextColumn get linkedCalendarEventId => text().nullable().references(CalendarEvents, #id, onDelete: KeyAction.setNull)();
  TextColumn get linkedTaskId => text().nullable().references(TaskItems, #id, onDelete: KeyAction.setNull)();
  
  IntColumn get createdAtUtc => integer()();

  @override
  Set<Column> get primaryKey => {id};
}

/// Budgets table
@DataClassName('MoneyBudgetEntry')
class MoneyBudgets extends Table {
  TextColumn get id => text()();
  TextColumn get categoryId => text().nullable().references(MoneyCategories, #id, onDelete: KeyAction.cascade)(); // null = overall budget
  IntColumn get amountPaise => integer()();
  TextColumn get period => text().withDefault(const Constant('monthly'))(); // 'weekly', 'monthly', 'yearly'
  
  @override
  Set<Column> get primaryKey => {id};
}

/// Savings Goals table
@DataClassName('SavingsGoalEntry')
class SavingsGoals extends Table {
  TextColumn get id => text()();
  TextColumn get name => text()();
  IntColumn get targetAmountPaise => integer()();
  IntColumn get savedAmountPaise => integer().withDefault(const Constant(0))();
  IntColumn get targetDateUtc => integer().nullable()();
  IntColumn get colorValue => integer().withDefault(const Constant(0xFF10B981))(); // Emerald

  @override
  Set<Column> get primaryKey => {id};
}

/// Debts table
@DataClassName('DebtEntry')
class Debts extends Table {
  TextColumn get id => text()();
  TextColumn get name => text()();
  IntColumn get amountPaise => integer()();
  IntColumn get repaidAmountPaise => integer().withDefault(const Constant(0))();
  BoolColumn get isOwedToMe => boolean()(); // true = someone owes me, false = I owe someone
  IntColumn get dueDateUtc => integer().nullable()();

  @override
  Set<Column> get primaryKey => {id};
}

/// Recurring transactions template table
@DataClassName('RecurringTransactionEntry')
class RecurringTransactions extends Table {
  TextColumn get id => text()();
  TextColumn get accountId => text().references(MoneyAccounts, #id, onDelete: KeyAction.cascade)();
  TextColumn get toAccountId => text().nullable().references(MoneyAccounts, #id, onDelete: KeyAction.cascade)();
  TextColumn get categoryId => text().nullable().references(MoneyCategories, #id, onDelete: KeyAction.setNull)();
  IntColumn get amountPaise => integer()();
  TextColumn get type => text()(); // 'income', 'expense', 'transfer'
  TextColumn get note => text().nullable()();
  TextColumn get recurrenceRule => text()(); // e.g. 'monthly', 'weekly', 'daily', 'yearly'
  IntColumn get nextOccurrenceUtc => integer()();
  BoolColumn get isActive => boolean().withDefault(const Constant(true))();

  @override
  Set<Column> get primaryKey => {id};
}
