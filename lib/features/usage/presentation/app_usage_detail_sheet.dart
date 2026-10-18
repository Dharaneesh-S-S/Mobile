import 'package:app_usage/app_usage.dart';
import 'package:device_apps/device_apps.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:uuid/uuid.dart';
import '../../../core/database/app_database.dart';
import '../../../core/providers/core_providers.dart';
import '../models/usage_models.dart';
import '../providers/usage_providers.dart';
import '../services/app_categorizer.dart';

class AppUsageDetailSheet extends ConsumerStatefulWidget {
  final UsageAppItem appItem;

  const AppUsageDetailSheet({super.key, required this.appItem});

  @override
  ConsumerState<AppUsageDetailSheet> createState() => _AppUsageDetailSheetState();
}

class _AppUsageDetailSheetState extends ConsumerState<AppUsageDetailSheet> {
  late String _selectedCategory;
  List<DailyUsagePoint> _historyPoints = [];
  bool _isLoadingHistory = true;

  @override
  void initState() {
    super.initState();
    _selectedCategory = widget.appItem.category;
    _loadHistory();
  }

  Future<void> _loadHistory() async {
    final now = DateTime.now();
    List<DailyUsagePoint> points = [];

    for (int i = 6; i >= 0; i--) {
      final d = now.subtract(Duration(days: i));
      final startDate = DateTime(d.year, d.month, d.day);
      DateTime endDate = DateTime(d.year, d.month, d.day, 23, 59, 59);
      if (endDate.isAfter(now)) endDate = now;

      Duration appUsage = Duration.zero;
      try {
        final list = await AppUsage().getAppUsage(startDate, endDate);
        final match = list.where((u) => u.packageName == widget.appItem.packageName).firstOrNull;
        if (match != null) {
          appUsage = match.usage;
        }
      } catch (_) {}

      points.add(DailyUsagePoint(
        date: d,
        totalUsage: appUsage,
        dayLabel: DateFormat('E').format(d),
      ));
    }

    if (mounted) {
      setState(() {
        _historyPoints = points;
        _isLoadingHistory = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final limits = ref.watch(usageLimitsProvider).valueOrNull ?? [];
    final currentLimit = limits.where((l) => l.targetId == widget.appItem.packageName).firstOrNull;

    return Container(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 32),
      decoration: BoxDecoration(
        color: theme.scaffoldBackgroundColor,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            // Drag handle
            Center(
              child: Container(
                width: 40,
                height: 4,
                margin: const EdgeInsets.only(bottom: 16),
                decoration: BoxDecoration(
                  color: Colors.grey.withOpacity(0.4),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),

            // Header: Icon, Name, Package
            Row(
              children: [
                widget.appItem.iconBytes != null
                    ? ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: Image.memory(widget.appItem.iconBytes!, width: 56, height: 56),
                      )
                    : Container(
                        width: 56,
                        height: 56,
                        decoration: BoxDecoration(
                          color: AppCategorizer.getCategoryColor(_selectedCategory).withOpacity(0.15),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Icon(
                          AppCategorizer.getCategoryIcon(_selectedCategory),
                          size: 32,
                          color: AppCategorizer.getCategoryColor(_selectedCategory),
                        ),
                      ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        widget.appItem.appName,
                        style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 2),
                      Text(
                        widget.appItem.packageName,
                        style: theme.textTheme.bodySmall?.copyWith(color: Colors.grey),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Usage & Percentage Cards
            Row(
              children: [
                Expanded(
                  child: _buildMetricTile(
                    title: 'Total Usage',
                    value: formatUsageDuration(widget.appItem.usage),
                    icon: Icons.access_time_rounded,
                    color: theme.colorScheme.primary,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildMetricTile(
                    title: 'Screen Share',
                    value: '${widget.appItem.percentage.toStringAsFixed(1)}%',
                    icon: Icons.pie_chart_outline_rounded,
                    color: Colors.indigo,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Launch / Session Notice
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: theme.colorScheme.surfaceVariant.withOpacity(0.5),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  const Icon(Icons.info_outline, size: 20, color: Colors.grey),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      'Launch events and exact background durations depend on Android SDK version and manufacturer battery profiles.',
                      style: theme.textTheme.bodySmall?.copyWith(color: Colors.grey[700]),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // 7-Day History Chart
            Text('7-Day Usage Trend', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600)),
            const SizedBox(height: 12),
            SizedBox(
              height: 140,
              child: _isLoadingHistory
                  ? const Center(child: CircularProgressIndicator())
                  : _buildHistoryChart(theme),
            ),
            const SizedBox(height: 20),

            // Category Assignment
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Category', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600)),
                DropdownButton<String>(
                  value: _selectedCategory,
                  underline: const SizedBox(),
                  borderRadius: BorderRadius.circular(12),
                  items: AppCategorizer.defaultCategories.map((cat) {
                    return DropdownMenuItem<String>(
                      value: cat,
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(AppCategorizer.getCategoryIcon(cat),
                              size: 18, color: AppCategorizer.getCategoryColor(cat)),
                          const SizedBox(width: 8),
                          Text(cat),
                        ],
                      ),
                    );
                  }).toList(),
                  onChanged: (newCat) async {
                    if (newCat != null && newCat != _selectedCategory) {
                      setState(() => _selectedCategory = newCat);
                      final db = ref.read(databaseProvider);
                      await db.usageDao.insertCategory(
                        AppCategoriesCompanion.insert(
                          packageName: widget.appItem.packageName,
                          categoryName: newCat,
                        ),
                      );
                      ref.invalidate(periodAppUsageListProvider);
                    }
                  },
                ),
              ],
            ),
            const Divider(height: 24),

            // Daily Limit Section
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Daily App Limit', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600)),
                    Text(
                      currentLimit != null
                          ? '${currentLimit.limitDurationMinutes} minutes/day'
                          : 'No limit configured',
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: currentLimit != null ? theme.colorScheme.primary : Colors.grey,
                      ),
                    ),
                  ],
                ),
                FilledButton.tonal(
                  onPressed: () => _showAppLimitDialog(context, ref, currentLimit),
                  child: Text(currentLimit != null ? 'Edit Limit' : 'Set Limit'),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Launch App Button
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                icon: const Icon(Icons.open_in_new),
                label: const Text('Open App'),
                onPressed: () async {
                  await DeviceApps.openApp(widget.appItem.packageName);
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMetricTile({
    required String title,
    required String value,
    required IconData icon,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: color.withOpacity(0.08),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: color.withOpacity(0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 16, color: color),
              const SizedBox(width: 6),
              Text(title, style: TextStyle(fontSize: 12, color: Colors.grey[600], fontWeight: FontWeight.w500)),
            ],
          ),
          const SizedBox(height: 6),
          Text(value, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: color)),
        ],
      ),
    );
  }

  Widget _buildHistoryChart(ThemeData theme) {
    if (_historyPoints.isEmpty) {
      return const Center(child: Text('No historical data available.'));
    }

    final maxMinutes = _historyPoints.map((p) => p.totalUsage.inMinutes.toDouble()).reduce((a, b) => a > b ? a : b);
    final maxY = maxMinutes > 0 ? (maxMinutes * 1.25) : 60.0;

    return BarChart(
      BarChartData(
        alignment: BarChartAlignment.spaceAround,
        maxY: maxY,
        barTouchData: BarTouchData(
          touchTooltipData: BarTouchTooltipData(
            getTooltipItem: (group, groupIndex, rod, rodIndex) {
              final point = _historyPoints[group.x.toInt()];
              return BarTooltipItem(
                '${point.dayLabel}\n${formatUsageDuration(point.totalUsage)}',
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
                if (idx < 0 || idx >= _historyPoints.length) return const SizedBox();
                return Padding(
                  padding: const EdgeInsets.only(top: 6),
                  child: Text(
                    _historyPoints[idx].dayLabel,
                    style: const TextStyle(fontSize: 11, color: Colors.grey),
                  ),
                );
              },
            ),
          ),
          leftTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
          topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
          rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
        ),
        gridData: const FlGridData(show: false),
        borderData: FlBorderData(show: false),
        barGroups: _historyPoints.asMap().entries.map((entry) {
          final idx = entry.key;
          final point = entry.value;
          return BarChartGroupData(
            x: idx,
            barRods: [
              BarChartRodData(
                toY: point.totalUsage.inMinutes.toDouble(),
                color: theme.colorScheme.primary,
                width: 14,
                borderRadius: const BorderRadius.vertical(top: Radius.circular(6)),
              ),
            ],
          );
        }).toList(),
      ),
    );
  }

  void _showAppLimitDialog(BuildContext context, WidgetRef ref, UsageLimitEntry? currentLimit) {
    int durationMinutes = currentLimit?.limitDurationMinutes ?? 45;

    showDialog(
      context: context,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (ctx, setDialogState) {
            final hours = durationMinutes ~/ 60;
            final mins = durationMinutes % 60;
            final timeStr = hours > 0 ? '${hours}h ${mins}m' : '${mins}m';

            return AlertDialog(
              title: Text('Limit for ${widget.appItem.appName}'),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text('Receive a friendly notification when this limit is reached.'),
                  const SizedBox(height: 16),
                  Slider(
                    value: durationMinutes.toDouble(),
                    min: 10,
                    max: 360,
                    divisions: 35,
                    label: timeStr,
                    onChanged: (val) {
                      setDialogState(() => durationMinutes = val.toInt());
                    },
                  ),
                  Text(timeStr, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                ],
              ),
              actions: [
                if (currentLimit != null)
                  TextButton(
                    onPressed: () async {
                      final db = ref.read(databaseProvider);
                      await db.usageDao.deleteLimit(currentLimit.id);
                      if (ctx.mounted) Navigator.pop(ctx);
                      setState(() {});
                    },
                    style: TextButton.styleFrom(foregroundColor: Colors.red),
                    child: const Text('Remove Limit'),
                  ),
                TextButton(
                  onPressed: () => Navigator.pop(ctx),
                  child: const Text('Cancel'),
                ),
                FilledButton(
                  onPressed: () async {
                    final db = ref.read(databaseProvider);
                    await db.usageDao.insertLimit(
                      UsageLimitsCompanion.insert(
                        id: currentLimit?.id ?? const Uuid().v4(),
                        targetId: widget.appItem.packageName,
                        limitType: 'app',
                        limitDurationMinutes: durationMinutes,
                      ),
                    );
                    if (ctx.mounted) Navigator.pop(ctx);
                    setState(() {});
                  },
                  child: const Text('Save'),
                ),
              ],
            );
          },
        );
      },
    );
  }
}
