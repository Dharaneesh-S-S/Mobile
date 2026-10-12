import 'package:drift/drift.dart';
import '../app_database.dart';
import '../tables/money_tables.dart';

part 'money_dao.g.dart';

@DriftAccessor(tables: [MoneyAccounts, MoneyCategories, MoneyTransactions])
class MoneyDao extends DatabaseAccessor<AppDatabase> with _$MoneyDaoMixin {
  MoneyDao(super.db);

  // Accounts
  Future<List<MoneyAccountEntry>> getAllAccounts() => select(moneyAccounts).get();

  Stream<List<MoneyAccountEntry>> watchAllAccounts() => select(moneyAccounts).watch();

  Future<MoneyAccountEntry?> getAccountById(String id) {
    return (select(moneyAccounts)..where((a) => a.id.equals(id))).getSingleOrNull();
  }

  Future<int> insertAccount(MoneyAccountsCompanion account) => into(moneyAccounts).insert(account);

  Future<bool> updateAccount(MoneyAccountEntry account) => update(moneyAccounts).replace(account);
  
  Future<int> deleteAccount(String id) => (delete(moneyAccounts)..where((a) => a.id.equals(id))).go();

  // Categories
  Future<List<MoneyCategoryEntry>> getAllCategories() => select(moneyCategories).get();

  Stream<List<MoneyCategoryEntry>> watchAllCategories() => select(moneyCategories).watch();

  Future<int> insertCategory(MoneyCategoriesCompanion category) => into(moneyCategories).insert(category);

  Future<bool> updateCategory(MoneyCategoryEntry category) => update(moneyCategories).replace(category);

  Future<int> deleteCategory(String id) => (delete(moneyCategories)..where((c) => c.id.equals(id))).go();

  // Transactions with atomic balance updates
  Future<List<MoneyTransactionEntry>> getAllTransactions() =>
      (select(moneyTransactions)..orderBy([(t) => OrderingTerm.desc(t.transactionTimeUtc)])).get();

  Stream<List<MoneyTransactionEntry>> watchAllTransactions() =>
      (select(moneyTransactions)..orderBy([(t) => OrderingTerm.desc(t.transactionTimeUtc)])).watch();

  /// Adds a transaction and updates the corresponding account balance(s) atomically inside a transaction.
  Future<void> recordTransaction(MoneyTransactionsCompanion transaction) {
    return db.transaction(() async {
      await into(moneyTransactions).insert(transaction);

      final accountId = transaction.accountId.value;
      final amount = transaction.amountPaise.value;
      final type = transaction.type.value;

      final account = await getAccountById(accountId);
      if (account != null) {
        if (type == 'transfer') {
          // decrease from account
          await (update(moneyAccounts)..where((a) => a.id.equals(accountId)))
              .write(MoneyAccountsCompanion(balancePaise: Value(account.balancePaise - amount)));
              
          // increase to account
          if (transaction.toAccountId.present && transaction.toAccountId.value != null) {
            final toAccount = await getAccountById(transaction.toAccountId.value!);
            if (toAccount != null) {
              await (update(moneyAccounts)..where((a) => a.id.equals(toAccount.id)))
                  .write(MoneyAccountsCompanion(balancePaise: Value(toAccount.balancePaise + amount)));
            }
          }
        } else {
          final newBalance = type == 'expense'
              ? account.balancePaise - amount
              : account.balancePaise + amount;

          await (update(moneyAccounts)..where((a) => a.id.equals(accountId)))
              .write(MoneyAccountsCompanion(balancePaise: Value(newBalance)));
        }
      }
    });
  }

  /// Deletes a transaction and reverses its balance impact atomically.
  Future<void> deleteTransaction(String transactionId) {
    return db.transaction(() async {
      final tx = await (select(moneyTransactions)..where((t) => t.id.equals(transactionId))).getSingleOrNull();
      if (tx != null) {
        final account = await getAccountById(tx.accountId);
        if (account != null) {
          if (tx.type == 'transfer') {
            await (update(moneyAccounts)..where((a) => a.id.equals(tx.accountId)))
                .write(MoneyAccountsCompanion(balancePaise: Value(account.balancePaise + tx.amountPaise)));
                
            if (tx.toAccountId != null) {
              final toAccount = await getAccountById(tx.toAccountId!);
              if (toAccount != null) {
                await (update(moneyAccounts)..where((a) => a.id.equals(toAccount.id)))
                    .write(MoneyAccountsCompanion(balancePaise: Value(toAccount.balancePaise - tx.amountPaise)));
              }
            }
          } else {
            final reversedBalance = tx.type == 'expense'
                ? account.balancePaise + tx.amountPaise
                : account.balancePaise - tx.amountPaise;

            await (update(moneyAccounts)..where((a) => a.id.equals(tx.accountId)))
                .write(MoneyAccountsCompanion(balancePaise: Value(reversedBalance)));
          }
        }
        await (delete(moneyTransactions)..where((t) => t.id.equals(transactionId))).go();
      }
    });
  }

  /// Updates a transaction and adjusts balances accordingly atomically.
  Future<void> updateTransactionRecord(MoneyTransactionEntry updatedTx) {
    return db.transaction(() async {
      final oldTx = await (select(moneyTransactions)..where((t) => t.id.equals(updatedTx.id))).getSingleOrNull();
      if (oldTx == null) return;

      // 1. Revert old transaction impact
      final oldAccount = await getAccountById(oldTx.accountId);
      if (oldAccount != null) {
        if (oldTx.type == 'transfer') {
          await (update(moneyAccounts)..where((a) => a.id.equals(oldTx.accountId)))
              .write(MoneyAccountsCompanion(balancePaise: Value(oldAccount.balancePaise + oldTx.amountPaise)));
          if (oldTx.toAccountId != null) {
            final toAcc = await getAccountById(oldTx.toAccountId!);
            if (toAcc != null) {
              await (update(moneyAccounts)..where((a) => a.id.equals(oldTx.toAccountId!)))
                  .write(MoneyAccountsCompanion(balancePaise: Value(toAcc.balancePaise - oldTx.amountPaise)));
            }
          }
        } else {
          final reversedBalance = oldTx.type == 'expense'
              ? oldAccount.balancePaise + oldTx.amountPaise
              : oldAccount.balancePaise - oldTx.amountPaise;
          await (update(moneyAccounts)..where((a) => a.id.equals(oldTx.accountId)))
              .write(MoneyAccountsCompanion(balancePaise: Value(reversedBalance)));
        }
      }

      // 2. Apply new transaction impact
      final newAccount = await getAccountById(updatedTx.accountId);
      if (newAccount != null) {
        if (updatedTx.type == 'transfer') {
          await (update(moneyAccounts)..where((a) => a.id.equals(updatedTx.accountId)))
              .write(MoneyAccountsCompanion(balancePaise: Value(newAccount.balancePaise - updatedTx.amountPaise)));
          if (updatedTx.toAccountId != null) {
            final toAcc = await getAccountById(updatedTx.toAccountId!);
            if (toAcc != null) {
              await (update(moneyAccounts)..where((a) => a.id.equals(updatedTx.toAccountId!)))
                  .write(MoneyAccountsCompanion(balancePaise: Value(toAcc.balancePaise + updatedTx.amountPaise)));
            }
          }
        } else {
          // If the account was just modified by reverting, we should technically use the updated balance,
          // but because we are inside a transaction we can just query it again or compute it.
          // Since we might have modified the same account, let's fetch fresh state inside transaction:
          final freshNewAccount = await getAccountById(updatedTx.accountId);
          if (freshNewAccount != null) {
            final newBalance = updatedTx.type == 'expense'
                ? freshNewAccount.balancePaise - updatedTx.amountPaise
                : freshNewAccount.balancePaise + updatedTx.amountPaise;

            await (update(moneyAccounts)..where((a) => a.id.equals(updatedTx.accountId)))
                .write(MoneyAccountsCompanion(balancePaise: Value(newBalance)));
          }
        }
      }

      // 3. Update the transaction record
      await update(moneyTransactions).replace(updatedTx);
    });
  }
}
