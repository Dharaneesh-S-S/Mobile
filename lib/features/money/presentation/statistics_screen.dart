import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:fl_chart/fl_chart.dart';
import '../../../core/theme/app_colors.dart';
import '../providers/money_providers.dart';

class StatisticsScreen extends ConsumerWidget {
  const StatisticsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final stats = ref.watch(monthlyStatsProvider);
    
    return Scaffold(
      appBar: AppBar(title: const Text('Statistics')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            const Text('Income vs Expense (This Month)', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 24),
            SizedBox(
              height: 250,
              child: PieChart(
                PieChartData(
                  sections: [
                    if (stats.incomePaise > 0)
                      PieChartSectionData(
                        color: AppColors.accentCyan,
                        value: stats.incomePaise.toDouble(),
                        title: 'Income',
                        radius: 60,
                        titleStyle: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white),
                      ),
                    if (stats.expensePaise > 0)
                      PieChartSectionData(
                        color: AppColors.lightError,
                        value: stats.expensePaise.toDouble(),
                        title: 'Expense',
                        radius: 60,
                        titleStyle: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white),
                      ),
                  ],
                  sectionsSpace: 4,
                  centerSpaceRadius: 40,
                ),
              ),
            ),
            const SizedBox(height: 32),
            const Text('Future updates will include category-wise breakdown, historical trends, and custom date ranges.', textAlign: TextAlign.center, style: TextStyle(color: Colors.grey)),
          ],
        ),
      ),
    );
  }
}
