import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/app_colors.dart';
import '../providers/money_providers.dart';

class StatisticsScreen extends ConsumerWidget {
  const StatisticsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedMonth = ref.watch(selectedMonthProvider);
    final stats = ref.watch(monthlyStatsProvider);
    final transactions = ref.watch(monthlyTransactionsProvider);
    final categories = ref.watch(categoriesStreamProvider).valueOrNull ?? [];
    final accounts = ref.watch(accountsStreamProvider).valueOrNull ?? [];

    final categoryMap = {for (final c in categories) c.id: c};

    // Calculate category-wise expense breakdown
    final Map<String, int> expenseByCategory = {};
    for (final tx in transactions) {
      if (tx.type == 'expense') {
        final catId = tx.categoryId ?? 'uncategorized';
        expenseByCategory[catId] = (expenseByCategory[catId] ?? 0) + tx.amountPaise;
      }
    }

    final totalExpense = stats.expensePaise;

    return Scaffold(
      appBar: AppBar(
        title: Text('Financial Reports (${DateFormat('MMM yyyy').format(selectedMonth)})'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 1. Month Overview Card
            Card(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Cash Flow Summary', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                        Text(
                          DateFormat('MMMM yyyy').format(selectedMonth),
                          style: const TextStyle(color: Colors.grey, fontSize: 12),
                        ),
                      ],
                    ),
                    const Divider(height: 24),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        _buildStatColumn('Income', '₹${(stats.incomePaise / 100).toStringAsFixed(2)}', AppColors.accentCyan),
                        _buildStatColumn('Expense', '₹${(stats.expensePaise / 100).toStringAsFixed(2)}', AppColors.lightError),
                        _buildStatColumn(
                          'Net Flow',
                          '${stats.netCashFlow >= 0 ? "+" : "-"}₹${(stats.netCashFlow.abs() / 100).toStringAsFixed(2)}',
                          stats.netCashFlow >= 0 ? AppColors.accentCyan : AppColors.lightError,
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // 2. Income vs Expense Chart
            const Text('Income vs Expense', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            if (stats.incomePaise == 0 && stats.expensePaise == 0)
              const Center(
                child: Padding(
                  padding: EdgeInsets.all(32.0),
                  child: Text('No transactions recorded for this period.', style: TextStyle(color: Colors.grey)),
                ),
              )
            else
              SizedBox(
                height: 200,
                child: PieChart(
                  PieChartData(
                    sections: [
                      if (stats.incomePaise > 0)
                        PieChartSectionData(
                          color: AppColors.accentCyan,
                          value: stats.incomePaise.toDouble(),
                          title: '${((stats.incomePaise / (stats.incomePaise + stats.expensePaise)) * 100).toStringAsFixed(0)}%',
                          radius: 50,
                          titleStyle: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white, fontSize: 14),
                        ),
                      if (stats.expensePaise > 0)
                        PieChartSectionData(
                          color: AppColors.lightError,
                          value: stats.expensePaise.toDouble(),
                          title: '${((stats.expensePaise / (stats.incomePaise + stats.expensePaise)) * 100).toStringAsFixed(0)}%',
                          radius: 50,
                          titleStyle: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white, fontSize: 14),
                        ),
                    ],
                    sectionsSpace: 4,
                    centerSpaceRadius: 35,
                  ),
                ),
              ),
            const SizedBox(height: 24),

            // 3. Category-wise Expense Breakdown
            const Text('Expense by Category', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            if (expenseByCategory.isEmpty)
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 16.0),
                child: Text('No expenses in this month.', style: TextStyle(color: Colors.grey)),
              )
            else
              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: expenseByCategory.length,
                itemBuilder: (context, index) {
                  final catId = expenseByCategory.keys.elementAt(index);
                  final amount = expenseByCategory[catId]!;
                  final cat = categoryMap[catId];
                  final catName = cat?.name ?? (catId == 'uncategorized' ? 'Uncategorized' : 'General');
                  final catColor = cat != null ? Color(cat.colorValue) : Colors.grey;
                  final percentage = totalExpense > 0 ? (amount / totalExpense) * 100 : 0.0;

                  return Padding(
                    padding: const EdgeInsets.symmetric(vertical: 6.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: [
                                CircleAvatar(radius: 6, backgroundColor: catColor),
                                const SizedBox(width: 8),
                                Text(catName, style: const TextStyle(fontWeight: FontWeight.w600)),
                              ],
                            ),
                            Text(
                              '₹${(amount / 100).toStringAsFixed(2)} (${percentage.toStringAsFixed(1)}%)',
                              style: const TextStyle(fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(4),
                          child: LinearProgressIndicator(
                            value: totalExpense > 0 ? amount / totalExpense : 0,
                            backgroundColor: catColor.withOpacity(0.15),
                            valueColor: AlwaysStoppedAnimation(catColor),
                            minHeight: 6,
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            const SizedBox(height: 24),

            // 4. Wallet Balances Summary
            const Text('Wallet Balances', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            if (accounts.isEmpty)
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 16.0),
                child: Text('No active wallets.', style: TextStyle(color: Colors.grey)),
              )
            else
              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: accounts.length,
                itemBuilder: (context, index) {
                  final acc = accounts[index];
                  return ListTile(
                    contentPadding: EdgeInsets.zero,
                    leading: const CircleAvatar(
                      backgroundColor: Color(0xFF1E293B),
                      child: Icon(Icons.account_balance_wallet, color: AppColors.accentEmerald, size: 20),
                    ),
                    title: Text(acc.name, style: const TextStyle(fontWeight: FontWeight.w600)),
                    subtitle: Text(acc.accountType.toUpperCase(), style: const TextStyle(fontSize: 11)),
                    trailing: Text(
                      '₹${(acc.balancePaise / 100).toStringAsFixed(2)}',
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppColors.accentEmerald),
                    ),
                  );
                },
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatColumn(String label, String value, Color color) {
    return Column(
      children: [
        Text(label, style: const TextStyle(color: Colors.grey, fontSize: 12)),
        const SizedBox(height: 4),
        Text(value, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: color)),
      ],
    );
  }
}
