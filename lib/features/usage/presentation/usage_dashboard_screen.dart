import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../models/usage_models.dart';
import '../providers/usage_providers.dart';
import '../services/app_categorizer.dart';
import 'app_usage_detail_sheet.dart';
import 'usage_limits_screen.dart';
import 'usage_permission_wrapper.dart';
import 'usage_reports_screen.dart';
import 'usage_settings_screen.dart';

class UsageDashboardScreen extends ConsumerWidget {
  const UsageDashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return const UsagePermissionWrapper(
      child: _UsageDashboardContent(),
    );
  }
}

class _UsageDashboardContent extends ConsumerStatefulWidget {
  const _UsageDashboardContent();

  @override
  ConsumerState<_UsageDashboardContent> createState() => _UsageDashboardContentState();
}

class _UsageDashboardContentState extends ConsumerState<_UsageDashboardContent> {
  final TextEditingController _searchController = TextEditingController();

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _refreshAll() {
    ref.read(lastRefreshTimeProvider.notifier).state = DateTime.now();
    ref.invalidate(periodAppUsageListProvider);
    ref.invalidate(sevenDayTrendProvider);
    ref.invalidate(installedAppsProvider);
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final selectedDate = ref.watch(usageDateProvider);
    final timeframe = ref.watch(usageTimeframeProvider);
    final lastRefresh = ref.watch(lastRefreshTimeProvider);
    final periodDuration = ref.watch(periodTotalDurationProvider);
    final comparison = ref.watch(screenTimeComparisonProvider);
    final dailyAvg = ref.watch(dailyAverageUsageProvider);
    final streakAsync = ref.watch(usageStreakProvider);
    final categorySummaries = ref.watch(categorySummariesProvider);
    final appUsageListAsync = ref.watch(periodAppUsageListProvider);
    final searchQuery = ref.watch(usageAppSearchQueryProvider);
    final sortCriteria = ref.watch(usageAppSortProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Usage Tracker'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            tooltip: 'Refresh Usage',
            onPressed: _refreshAll,
          ),
          IconButton(
            icon: const Icon(Icons.insights_rounded),
            tooltip: 'Reports & Heatmap',
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => const UsageReportsScreen()),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.timer_outlined),
            tooltip: 'Limits & Focus',
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => const UsageLimitsScreen()),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.settings_outlined),
            tooltip: 'Usage Settings',
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => const UsageSettingsScreen()),
              );
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          _refreshAll();
          await Future.delayed(const Duration(milliseconds: 600));
        },
        child: CustomScrollView(
          slivers: [
            // Top Controls: Timeframe Selector (Day | Week | Month)
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
                child: Column(
                  children: [
                    SegmentedButton<UsageTimeframe>(
                      segments: const [
                        ButtonSegment(value: UsageTimeframe.day, label: Text('Day')),
                        ButtonSegment(value: UsageTimeframe.week, label: Text('Week')),
                        ButtonSegment(value: UsageTimeframe.month, label: Text('Month')),
                      ],
                      selected: {timeframe},
                      onSelectionChanged: (set) {
                        ref.read(usageTimeframeProvider.notifier).state = set.first;
                      },
                    ),
                    const SizedBox(height: 12),

                    // Date Navigator Bar
                    _buildDateNavigator(selectedDate, timeframe, lastRefresh, theme),
                  ],
                ),
              ),
            ),

            // Hero Screen-Time Card
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        theme.colorScheme.primary,
                        theme.colorScheme.secondary,
                      ],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: [
                      BoxShadow(
                        color: theme.colorScheme.primary.withOpacity(0.25),
                        blurRadius: 12,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            timeframe == UsageTimeframe.day
                                ? 'Total Screen Time'
                                : timeframe == UsageTimeframe.week
                                    ? 'Weekly Screen Time'
                                    : 'Monthly Screen Time',
                            style: const TextStyle(color: Colors.white70, fontSize: 14, fontWeight: FontWeight.w500),
                          ),
                          streakAsync.when(
                            data: (streak) => streak > 0
                                ? Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: Colors.white.withOpacity(0.2),
                                      borderRadius: BorderRadius.circular(16),
                                    ),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        const Text('🔥', style: TextStyle(fontSize: 12)),
                                        const SizedBox(width: 4),
                                        Text(
                                          '$streak d streak',
                                          style: const TextStyle(
                                            color: Colors.white,
                                            fontWeight: FontWeight.bold,
                                            fontSize: 11,
                                          ),
                                        ),
                                      ],
                                    ),
                                  )
                                : const SizedBox(),
                            loading: () => const SizedBox(),
                            error: (_, __) => const SizedBox(),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        formatUsageDuration(periodDuration),
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 36,
                          fontWeight: FontWeight.bold,
                          letterSpacing: -0.5,
                        ),
                      ),
                      const SizedBox(height: 16),
                      const Divider(color: Colors.white24, height: 1),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text('Yesterday', style: TextStyle(color: Colors.white70, fontSize: 11)),
                                const SizedBox(height: 2),
                                Text(
                                  formatUsageDuration(comparison.yesterday),
                                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
                                ),
                              ],
                            ),
                          ),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text('Daily Average', style: TextStyle(color: Colors.white70, fontSize: 11)),
                                const SizedBox(height: 2),
                                Text(
                                  formatUsageDuration(dailyAvg),
                                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
                                ),
                              ],
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: comparison.isIncrease ? Colors.red.shade400 : Colors.green.shade400,
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              '${comparison.isIncrease ? '+' : '-'}${comparison.percentageChange.toStringAsFixed(0)}%',
                              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),

            // Category Overview Chips
            if (categorySummaries.isNotEmpty) ...[
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('Category Breakdown', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
                          TextButton(
                            onPressed: () {
                              Navigator.of(context).push(
                                MaterialPageRoute(builder: (_) => const UsageReportsScreen()),
                              );
                            },
                            child: const Text('View Charts'),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      SizedBox(
                        height: 48,
                        child: ListView.separated(
                          scrollDirection: Axis.horizontal,
                          itemCount: categorySummaries.length,
                          separatorBuilder: (_, __) => const SizedBox(width: 8),
                          itemBuilder: (context, idx) {
                            final cat = categorySummaries[idx];
                            return Chip(
                              avatar: Icon(AppCategorizer.getCategoryIcon(cat.categoryName), size: 16, color: cat.color),
                              label: Text('${cat.categoryName}: ${formatUsageDuration(cat.totalUsage)}'),
                              backgroundColor: cat.color.withOpacity(0.08),
                              side: BorderSide(color: cat.color.withOpacity(0.3)),
                            );
                          },
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],

            // App List Section Header with Search & Sort
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Application Activity',
                            style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
                        DropdownButton<AppSortCriteria>(
                          value: sortCriteria,
                          underline: const SizedBox(),
                          borderRadius: BorderRadius.circular(12),
                          items: const [
                            DropdownMenuItem(value: AppSortCriteria.durationDesc, child: Text('By Usage')),
                            DropdownMenuItem(value: AppSortCriteria.nameAsc, child: Text('By Name')),
                            DropdownMenuItem(value: AppSortCriteria.categoryAsc, child: Text('By Category')),
                          ],
                          onChanged: (val) {
                            if (val != null) {
                              ref.read(usageAppSortProvider.notifier).state = val;
                            }
                          },
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    TextField(
                      controller: _searchController,
                      decoration: InputDecoration(
                        hintText: 'Search installed apps...',
                        prefixIcon: const Icon(Icons.search, size: 20),
                        suffixIcon: searchQuery.isNotEmpty
                            ? IconButton(
                                icon: const Icon(Icons.clear, size: 18),
                                onPressed: () {
                                  _searchController.clear();
                                  ref.read(usageAppSearchQueryProvider.notifier).state = '';
                                },
                              )
                            : null,
                        isDense: true,
                        filled: true,
                        fillColor: theme.colorScheme.surfaceVariant.withOpacity(0.35),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(14),
                          borderSide: BorderSide.none,
                        ),
                      ),
                      onChanged: (val) {
                        ref.read(usageAppSearchQueryProvider.notifier).state = val.trim();
                      },
                    ),
                  ],
                ),
              ),
            ),

            // App List Items
            appUsageListAsync.when(
              data: (list) {
                var filtered = list.where((app) {
                  if (searchQuery.isEmpty) return true;
                  return app.appName.toLowerCase().contains(searchQuery.toLowerCase()) ||
                      app.packageName.toLowerCase().contains(searchQuery.toLowerCase());
                }).toList();

                if (sortCriteria == AppSortCriteria.durationDesc) {
                  filtered.sort((a, b) => b.usage.compareTo(a.usage));
                } else if (sortCriteria == AppSortCriteria.nameAsc) {
                  filtered.sort((a, b) => a.appName.toLowerCase().compareTo(b.appName.toLowerCase()));
                } else {
                  filtered.sort((a, b) => a.category.compareTo(b.category));
                }

                if (filtered.isEmpty) {
                  return const SliverFillRemaining(
                    hasScrollBody: false,
                    child: Center(
                      child: Padding(
                        padding: EdgeInsets.all(32),
                        child: Text(
                          'No application usage recorded for this date range.',
                          style: TextStyle(color: Colors.grey),
                          textAlign: TextAlign.center,
                        ),
                      ),
                    ),
                  );
                }

                return SliverList(
                  delegate: SliverChildBuilderDelegate(
                    (context, index) {
                      final item = filtered[index];
                      final catColor = AppCategorizer.getCategoryColor(item.category);

                      return ListTile(
                        leading: item.iconBytes != null
                            ? ClipRRect(
                                borderRadius: BorderRadius.circular(10),
                                child: Image.memory(item.iconBytes!, width: 44, height: 44),
                              )
                            : Container(
                                width: 44,
                                height: 44,
                                decoration: BoxDecoration(
                                  color: catColor.withOpacity(0.12),
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: Icon(AppCategorizer.getCategoryIcon(item.category), color: catColor, size: 24),
                              ),
                        title: Text(item.appName, style: const TextStyle(fontWeight: FontWeight.w600)),
                        subtitle: Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: catColor.withOpacity(0.12),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                item.category,
                                style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: catColor),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                item.packageName,
                                style: const TextStyle(fontSize: 11, color: Colors.grey),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                        trailing: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Text(
                              formatUsageDuration(item.usage),
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                            ),
                            Text(
                              '${item.percentage.toStringAsFixed(1)}%',
                              style: const TextStyle(fontSize: 11, color: Colors.grey),
                            ),
                          ],
                        ),
                        onTap: () {
                          showModalBottomSheet(
                            context: context,
                            isScrollControlled: true,
                            backgroundColor: Colors.transparent,
                            builder: (_) => AppUsageDetailSheet(appItem: item),
                          );
                        },
                      );
                    },
                    childCount: filtered.length,
                  ),
                );
              },
              loading: () => const SliverFillRemaining(
                child: Center(child: CircularProgressIndicator()),
              ),
              error: (err, _) => SliverFillRemaining(
                child: Center(child: Text('Error loading usage: $err')),
              ),
            ),
            const SliverToBoxAdapter(child: SizedBox(height: 48)),
          ],
        ),
      ),
    );
  }

  Widget _buildDateNavigator(DateTime date, UsageTimeframe timeframe, DateTime lastRefresh, ThemeData theme) {
    String dateRangeLabel;

    if (timeframe == UsageTimeframe.day) {
      final now = DateTime.now();
      if (date.year == now.year && date.month == now.month && date.day == now.day) {
        dateRangeLabel = 'Today, ${DateFormat('MMM d').format(date)}';
      } else {
        dateRangeLabel = DateFormat('EEE, MMM d, yyyy').format(date);
      }
    } else if (timeframe == UsageTimeframe.week) {
      int weekday = date.weekday;
      final start = date.subtract(Duration(days: weekday - 1));
      final end = start.add(const Duration(days: 6));
      dateRangeLabel = '${DateFormat('MMM d').format(start)} - ${DateFormat('MMM d').format(end)}';
    } else {
      dateRangeLabel = DateFormat('MMMM yyyy').format(date);
    }

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        IconButton(
          icon: const Icon(Icons.chevron_left),
          tooltip: 'Previous Period',
          onPressed: () {
            DateTime newDate;
            if (timeframe == UsageTimeframe.day) {
              newDate = date.subtract(const Duration(days: 1));
            } else if (timeframe == UsageTimeframe.week) {
              newDate = date.subtract(const Duration(days: 7));
            } else {
              newDate = DateTime(date.year, date.month - 1, date.day);
            }
            ref.read(usageDateProvider.notifier).state = newDate;
          },
        ),
        InkWell(
          borderRadius: BorderRadius.circular(12),
          onTap: () async {
            final picked = await showDatePicker(
              context: context,
              initialDate: date,
              firstDate: DateTime.now().subtract(const Duration(days: 180)),
              lastDate: DateTime.now(),
            );
            if (picked != null) {
              ref.read(usageDateProvider.notifier).state = picked;
            }
          },
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            child: Column(
              children: [
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(dateRangeLabel, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                    const SizedBox(width: 4),
                    const Icon(Icons.arrow_drop_down, size: 18),
                  ],
                ),
                Text(
                  'Updated: ${DateFormat('h:mm a').format(lastRefresh)}',
                  style: const TextStyle(fontSize: 10, color: Colors.grey),
                ),
              ],
            ),
          ),
        ),
        IconButton(
          icon: const Icon(Icons.chevron_right),
          tooltip: 'Next Period',
          onPressed: () {
            DateTime newDate;
            if (timeframe == UsageTimeframe.day) {
              newDate = date.add(const Duration(days: 1));
            } else if (timeframe == UsageTimeframe.week) {
              newDate = date.add(const Duration(days: 7));
            } else {
              newDate = DateTime(date.year, date.month + 1, date.day);
            }
            if (!newDate.isAfter(DateTime.now())) {
              ref.read(usageDateProvider.notifier).state = newDate;
            }
          },
        ),
      ],
    );
  }
}
