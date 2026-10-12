import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/database/app_database.dart';
import '../../../core/providers/core_providers.dart';

// Provides all accounts
final accountsStreamProvider = StreamProvider<List<MoneyAccountEntry>>((ref) {
  return ref.watch(databaseProvider).moneyDao.watchAllAccounts();
});

// Provides all categories
final categoriesStreamProvider = StreamProvider<List<MoneyCategoryEntry>>((ref) {
  return ref.watch(databaseProvider).moneyDao.watchAllCategories();
});

// Provides all transactions
final transactionsStreamProvider = StreamProvider<List<MoneyTransactionEntry>>((ref) {
  return ref.watch(databaseProvider).moneyDao.watchAllTransactions();
});

// Monthly filter provider
final selectedMonthProvider = StateProvider<DateTime>((ref) {
  final now = DateTime.now();
  return DateTime(now.year, now.month);
});

// Provides filtered transactions based on selected month
final monthlyTransactionsProvider = Provider<List<MoneyTransactionEntry>>((ref) {
  final txs = ref.watch(transactionsStreamProvider).valueOrNull ?? [];
  final selectedMonth = ref.watch(selectedMonthProvider);
  
  return txs.where((tx) {
    final date = DateTime.fromMillisecondsSinceEpoch(tx.transactionTimeUtc, isUtc: true).toLocal();
    return date.year == selectedMonth.year && date.month == selectedMonth.month;
  }).toList();
});

// Calculates the totals for the selected month
class MonthlyStats {
  final int incomePaise;
  final int expensePaise;
  
  MonthlyStats({required this.incomePaise, required this.expensePaise});
  
  int get netCashFlow => incomePaise - expensePaise;
}

final monthlyStatsProvider = Provider<MonthlyStats>((ref) {
  final txs = ref.watch(monthlyTransactionsProvider);
  
  int inc = 0;
  int exp = 0;
  
  for (final tx in txs) {
    if (tx.type == 'income') {
      inc += tx.amountPaise;
    } else if (tx.type == 'expense') {
      exp += tx.amountPaise;
    }
    // transfers do not affect income/expense
  }
  
  return MonthlyStats(incomePaise: inc, expensePaise: exp);
});

// Total balance across all wallets
final totalBalanceProvider = Provider<int>((ref) {
  final accounts = ref.watch(accountsStreamProvider).valueOrNull ?? [];
  return accounts.fold<int>(0, (sum, acc) => sum + acc.balancePaise);
});
