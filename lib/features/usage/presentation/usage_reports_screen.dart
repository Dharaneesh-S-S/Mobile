import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../models/usage_models.dart';
import '../providers/usage_providers.dart';
import '../services/app_categorizer.dart';

class UsageReportsScreen extends ConsumerStatefulWidget {
  const UsageReportsScreen({super.key});

  @override
  ConsumerState<UsageReportsScreen> createState() => _UsageReportsScreenState();
}

class _UsageReportsScreenState extends ConsumerState<UsageReportsScreen> {
  int _selectedTab = 0; // 0 = Weekly Trend, 1 = Category Breakdown, 2 = Usage Heatmap

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final comparison = ref.watch(screenTimeComparisonProvider);
    final categorySummaries = ref.watch(categorySummariesProvider);
    final sevenDayPointsAsync = ref.watch(sevenDayTrendProvider(DateTime.now()));
    final dailyAvg = ref.watch(dailyAverageUsageProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Usage Reports & Insights'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Period Comparison Hero Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    theme.colorScheme.primaryContainer,
                    theme.colorScheme.secondaryContainer.withOpacity(0.8),
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Period Comparison',
                        style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: comparison.isIncrease ? Colors.red.withOpacity(0.15) : Colors.green.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(
                              comparison.isIncrease ? Icons.arrow_upward : Icons.arrow_downward,
                              size: 14,
                              color: comparison.isIncrease ? Colors.red : Colors.green,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              '${comparison.percentageChange.toStringAsFixed(1)}% vs yesterday',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: comparison.isIncrease ? Colors.red : Colors.green,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('Today', style: TextStyle(fontSize: 12, color: Colors.black54)),
                            const SizedBox(height: 4),
                            Text(
                              formatUsageDuration(comparison.today),
                              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                      ),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('Yesterday', style: TextStyle(fontSize: 12, color: Colors.black54)),
                            const SizedBox(height: 4),
                            Text(
                              formatUsageDuration(comparison.yesterday),
                              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                      ),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('Daily Average', style: TextStyle(fontSize: 12, color: Colors.black54)),
                            const SizedBox(height: 4),
                            Text(
                              formatUsageDuration(dailyAvg),
                              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Tab Selector: Weekly Trends | Categories | Heatmap
            SegmentedButton<int>(
              segments: const [
                ButtonSegment(value: 0, label: Text('Weekly Trend'), icon: Icon(Icons.bar_chart)),
                ButtonSegment(value: 1, label: Text('Categories'), icon: Icon(Icons.pie_chart_outline)),
                ButtonSegment(value: 2, label: Text('Heatmap'), icon: Icon(Icons.grid_on)),
              ],
              selected: {_selectedTab},
              onSelectionChanged: (set) => setState(() => _selectedTab = set.first),
            ),
            const SizedBox(height: 24),

            // Tab 0: Weekly Trend Chart
            if (_selectedTab == 0) ...[
              Text('7-Day Usage Activity', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
              const SizedBox(height: 12),
              Container(
                height: 220,
                padding: const EdgeInsets.fromLTRB(16, 20, 16, 12),
                decoration: BoxDecoration(
                  color: theme.colorScheme.surfaceVariant.withOpacity(0.35),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: sevenDayPointsAsync.when(
                  data: (points) => _buildWeeklyBarChart(points, theme),
                  loading: () => const Center(child: CircularProgressIndicator()),
                  error: (e, _) => Center(child: Text('Error: $e')),
                ),
              ),
            ],

            // Tab 1: Category Breakdown
            if (_selectedTab == 1) ...[
              Text('Screen Time by Category', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
              const SizedBox(height: 16),
              if (categorySummaries.isEmpty)
                const Center(child: Padding(
                  padding: EdgeInsets.all(32),
                  child: Text('No category data recorded for this period.'),
                ))
              else ...[
                // Pie Chart
                SizedBox(
                  height: 180,
                  child: PieChart(
                    PieChartData(
                      sectionsSpace: 2,
                      centerSpaceRadius: 40,
                      sections: categorySummaries.map((cat) {
                        return PieChartSectionData(
                          color: cat.color,
                          value: cat.totalUsage.inSeconds.toDouble(),
                          title: '${cat.percentage.toStringAsFixed(0)}%',
                          radius: 45,
                          titleStyle: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        );
                      }).toList(),
                    ),
                  ),
                ),
                const SizedBox(height: 20),

                // Category List
                ...categorySummaries.map((cat) {
                  return Container(
                    margin: const EdgeInsets.only(bottom: 8),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: cat.color.withOpacity(0.08),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: cat.color.withOpacity(0.2)),
                    ),
                    child: Row(
                      children: [
                        Icon(AppCategorizer.getCategoryIcon(cat.categoryName), color: cat.color),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(cat.categoryName, style: const TextStyle(fontWeight: FontWeight.bold)),
                              Text('${cat.appCount} apps', style: const TextStyle(fontSize: 12, color: Colors.grey)),
                            ],
                          ),
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Text(formatUsageDuration(cat.totalUsage),
                                style: TextStyle(fontWeight: FontWeight.bold, color: cat.color)),
                            Text('${cat.percentage.toStringAsFixed(1)}%',
                                style: const TextStyle(fontSize: 12, color: Colors.grey)),
                          ],
                        ),
                      ],
                    ),
                  );
                }),
              ],
            ],

            // Tab 2: Usage Heatmap Matrix
            if (_selectedTab == 2) ...[
              Text('7-Day Intensity Heatmap', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              const Text(
                'Visualizes screen time intensity across the week based on actual Android UsageStatsManager data.',
                style: TextStyle(fontSize: 12, color: Colors.grey),
              ),
              const SizedBox(height: 16),
              sevenDayPointsAsync.when(
                data: (points) => _buildHeatmapGrid(points, theme),
                loading: () => const Center(child: CircularProgressIndicator()),
                error: (e, _) => Center(child: Text('Error: $e')),
              ),
            ],

            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildWeeklyBarChart(List<DailyUsagePoint> points, ThemeData theme) {
    if (points.isEmpty) return const Center(child: Text('No usage data.'));

    final maxMinutes = points.map((p) => p.totalUsage.inMinutes.toDouble()).reduce((a, b) => a > b ? a : b);
    final maxY = maxMinutes > 0 ? (maxMinutes * 1.2) : 60.0;

    return BarChart(
      BarChartData(
        alignment: BarChartAlignment.spaceAround,
        maxY: maxY,
        barTouchData: BarTouchData(
          touchTooltipData: BarTouchTooltipData(
            getTooltipItem: (group, groupIndex, rod, rodIndex) {
              final point = points[group.x.toInt()];
              return BarTooltipItem(
                '${DateFormat('EEEE, MMM d').format(point.date)}\n${formatUsageDuration(point.totalUsage)}',
                const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12),
              );
            },
          ),
        ),
        titlesData: FlTitlesData(
          show: true,
          bottomTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              getTitlesWidget: (val, meta) {
                final idx = val.toInt();
                if (idx < 0 || idx >= points.length) return const SizedBox();
                return Padding(
                  padding: const EdgeInsets.only(top: 6),
                  child: Text(points[idx].dayLabel, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                );
              },
            ),
          ),
          leftTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              reservedSize: 32,
              getTitlesWidget: (val, meta) {
                if (val == 0) return const SizedBox();
                final hours = (val / 60).round();
                return Text('${hours}h', style: const TextStyle(fontSize: 10, color: Colors.grey));
              },
            ),
          ),
          topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
          rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
        ),
        gridData: FlGridData(
          show: true,
          drawVerticalLine: false,
          horizontalInterval: 60,
          getDrawingHorizontalLine: (val) => FlLine(color: Colors.grey.withOpacity(0.15), strokeWidth: 1),
        ),
        borderData: FlBorderData(show: false),
        barGroups: points.asMap().entries.map((entry) {
          final idx = entry.key;
          final point = entry.value;
          return BarChartGroupData(
            x: idx,
            barRods: [
              BarChartRodData(
                toY: point.totalUsage.inMinutes.toDouble(),
                color: theme.colorScheme.primary,
                width: 16,
                borderRadius: const BorderRadius.vertical(top: Radius.circular(6)),
              ),
            ],
          );
        }).toList(),
      ),
    );
  }

  Widget _buildHeatmapGrid(List<DailyUsagePoint> points, ThemeData theme) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: theme.colorScheme.surfaceVariant.withOpacity(0.3),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: points.map((p) {
              return Expanded(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 4),
                  child: Column(
                    children: [
                      Text(p.dayLabel, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 8),
                      _buildHeatmapCell(p.totalUsage.inMinutes, theme),
                      const SizedBox(height: 6),
                      Text(
                        formatUsageDuration(p.totalUsage),
                        style: const TextStyle(fontSize: 10, color: Colors.grey),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 16),
          // Legend
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text('Less', style: TextStyle(fontSize: 11, color: Colors.grey)),
              const SizedBox(width: 8),
              _buildLegendBox(Colors.grey.withOpacity(0.2)),
              _buildLegendBox(theme.colorScheme.primary.withOpacity(0.3)),
              _buildLegendBox(theme.colorScheme.primary.withOpacity(0.6)),
              _buildLegendBox(theme.colorScheme.primary),
              const SizedBox(width: 8),
              const Text('More', style: TextStyle(fontSize: 11, color: Colors.grey)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildHeatmapCell(int minutes, ThemeData theme) {
    Color cellColor;
    if (minutes <= 0) {
      cellColor = Colors.grey.withOpacity(0.15);
    } else if (minutes < 90) {
      cellColor = theme.colorScheme.primary.withOpacity(0.25);
    } else if (minutes < 180) {
      cellColor = theme.colorScheme.primary.withOpacity(0.55);
    } else if (minutes < 300) {
      cellColor = theme.colorScheme.primary.withOpacity(0.8);
    } else {
      cellColor = theme.colorScheme.primary;
    }

    return Container(
      height: 48,
      decoration: BoxDecoration(
        color: cellColor,
        borderRadius: BorderRadius.circular(8),
      ),
    );
  }

  Widget _buildLegendBox(Color color) {
    return Container(
      width: 14,
      height: 14,
      margin: const EdgeInsets.symmetric(horizontal: 2),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(3),
      ),
    );
  }
}
