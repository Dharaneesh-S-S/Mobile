import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/app_colors.dart';
import '../providers/money_providers.dart';
import 'transaction_editor_screen.dart';
import 'wallets_screen.dart';
import 'statistics_screen.dart';

class MoneyScreen extends ConsumerWidget {
  const MoneyScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedMonth = ref.watch(selectedMonthProvider);
    final stats = ref.watch(monthlyStatsProvider);
    final totalBalance = ref.watch(totalBalanceProvider);
    final accountsAsync = ref.watch(accountsStreamProvider);
    final transactions = ref.watch(monthlyTransactionsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Money Manager'),
        actions: [
          IconButton(
            icon: const Icon(Icons.analytics),
            onPressed: () {
              Navigator.push(context, MaterialPageRoute(builder: (_) => const StatisticsScreen()));
            },
          ),
          IconButton(
            icon: const Icon(Icons.account_balance_wallet),
            onPressed: () {
              Navigator.push(context, MaterialPageRoute(builder: (_) => const WalletsScreen()));
            },
          ),
        ],
      ),
      body: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: _buildHeader(context, ref, selectedMonth, stats, totalBalance),
          ),
          SliverToBoxAdapter(
            child: _buildAccountsCarousel(accountsAsync),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Text('Recent Transactions', style: Theme.of(context).textTheme.titleLarge),
            ),
          ),
          transactions.isEmpty
              ? SliverToBoxAdapter(
                  child: Center(
                    child: Padding(
                      padding: const EdgeInsets.all(32.0),
                      child: Text('No transactions this month.', style: TextStyle(color: Colors.grey)),
                    ),
                  ),
                )
              : SliverList(
                  delegate: SliverChildBuilderDelegate(
                    (context, index) {
                      final tx = transactions[index];
                      return ListTile(
                        leading: CircleAvatar(
                          backgroundColor: tx.type == 'income' ? AppColors.accentCyan : (tx.type == 'expense' ? AppColors.lightError : Colors.grey),
                          child: Icon(
                            tx.type == 'income' ? Icons.arrow_downward : (tx.type == 'expense' ? Icons.arrow_upward : Icons.swap_horiz),
                            color: Colors.white,
                          ),
                        ),
                        title: Text(tx.note ?? (tx.type == 'transfer' ? 'Transfer' : 'Transaction')),
                        subtitle: Text(DateFormat('MMM d, yyyy - h:mm a').format(DateTime.fromMillisecondsSinceEpoch(tx.transactionTimeUtc, isUtc: true).toLocal())),
                        trailing: Text(
                          '${tx.type == 'expense' ? '-' : (tx.type == 'income' ? '+' : '')}₹${(tx.amountPaise / 100).toStringAsFixed(2)}',
                          style: TextStyle(
                            color: tx.type == 'income' ? AppColors.accentCyan : (tx.type == 'expense' ? AppColors.lightError : Colors.grey),
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        onTap: () {
                           Navigator.push(context, MaterialPageRoute(builder: (_) => TransactionEditorScreen(existingTx: tx)));
                        },
                      );
                    },
                    childCount: transactions.length,
                  ),
                ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: AppColors.accentEmerald,
        onPressed: () {
          Navigator.push(context, MaterialPageRoute(builder: (_) => const TransactionEditorScreen()));
        },
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildHeader(BuildContext context, WidgetRef ref, DateTime selectedMonth, MonthlyStats stats, int totalBalance) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.darkSurface,
        borderRadius: const BorderRadius.only(bottomLeft: Radius.circular(24), bottomRight: Radius.circular(24)),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              IconButton(
                icon: const Icon(Icons.chevron_left),
                onPressed: () {
                  ref.read(selectedMonthProvider.notifier).state = DateTime(selectedMonth.year, selectedMonth.month - 1);
                },
              ),
              Text(DateFormat('MMMM yyyy').format(selectedMonth), style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              IconButton(
                icon: const Icon(Icons.chevron_right),
                onPressed: () {
                  ref.read(selectedMonthProvider.notifier).state = DateTime(selectedMonth.year, selectedMonth.month + 1);
                },
              ),
            ],
          ),
          const SizedBox(height: 16),
          const Text('Total Balance', style: TextStyle(color: Colors.grey)),
          const SizedBox(height: 4),
          Text('₹${(totalBalance / 100).toStringAsFixed(2)}', style: const TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: Colors.white)),
          const SizedBox(height: 24),
          Row(
            children: [
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.accentCyan.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Column(
                    children: [
                      const Icon(Icons.arrow_downward, color: AppColors.accentCyan),
                      const SizedBox(height: 4),
                      const Text('Income', style: TextStyle(color: Colors.grey, fontSize: 12)),
                      Text('₹${(stats.incomePaise / 100).toStringAsFixed(2)}', style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.accentCyan)),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.lightError.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Column(
                    children: [
                      const Icon(Icons.arrow_upward, color: AppColors.lightError),
                      const SizedBox(height: 4),
                      const Text('Expense', style: TextStyle(color: Colors.grey, fontSize: 12)),
                      Text('₹${(stats.expensePaise / 100).toStringAsFixed(2)}', style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.lightError)),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            'Net Cash Flow: ${stats.netCashFlow >= 0 ? "+" : "-"}₹${(stats.netCashFlow.abs() / 100).toStringAsFixed(2)}',
            style: TextStyle(
              color: stats.netCashFlow >= 0 ? AppColors.accentCyan : AppColors.lightError,
              fontWeight: FontWeight.bold,
            ),
          )
        ],
      ),
    );
  }

  Widget _buildAccountsCarousel(AsyncValue accountsAsync) {
    return accountsAsync.when(
      data: (accounts) {
        if (accounts.isEmpty) {
          return const Padding(
            padding: EdgeInsets.all(16.0),
            child: Text('No accounts created yet. Please create a wallet.', style: TextStyle(color: Colors.grey)),
          );
        }
        return SizedBox(
          height: 120,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 16),
            itemCount: accounts.length,
            itemBuilder: (context, index) {
              final acc = accounts[index];
              return Container(
                width: 160,
                margin: const EdgeInsets.symmetric(horizontal: 4),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.darkSurfaceVariant,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(acc.name, style: const TextStyle(fontWeight: FontWeight.bold), overflow: TextOverflow.ellipsis),
                    const SizedBox(height: 8),
                    Text('₹${(acc.balancePaise / 100).toStringAsFixed(2)}', style: const TextStyle(fontSize: 16, color: AppColors.accentEmerald)),
                  ],
                ),
              );
            },
          ),
        );
      },
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, st) => Center(child: Text('Error: $e')),
    );
  }
}
