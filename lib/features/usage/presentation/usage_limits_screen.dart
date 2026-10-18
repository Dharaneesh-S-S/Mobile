import 'package:device_apps/device_apps.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:uuid/uuid.dart';
import '../../../core/database/app_database.dart';
import '../../../core/providers/core_providers.dart';
import '../models/usage_models.dart';
import '../providers/focus_session_provider.dart';
import '../providers/usage_providers.dart';
import '../services/app_categorizer.dart';

class UsageLimitsScreen extends ConsumerStatefulWidget {
  const UsageLimitsScreen({super.key});

  @override
  ConsumerState<UsageLimitsScreen> createState() => _UsageLimitsScreenState();
}

class _UsageLimitsScreenState extends ConsumerState<UsageLimitsScreen> {
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final limitsAsync = ref.watch(usageLimitsProvider);
    final streakAsync = ref.watch(usageStreakProvider);
    final focusState = ref.watch(focusSessionProvider);
    final installedApps = ref.watch(installedAppsProvider).valueOrNull ?? {};

    return Scaffold(
      appBar: AppBar(
        title: const Text('Limits, Goals & Focus'),
      ),
      body: limitsAsync.when(
        data: (limits) {
          final dailyLimit = limits.where((l) => l.targetId == 'daily' || l.limitType == 'daily_total').firstOrNull;
          final appLimits = limits.where((l) => l.limitType == 'app').toList();
          final categoryLimits = limits.where((l) => l.limitType == 'category').toList();
          final continuousLimit = limits.where((l) => l.limitType == 'continuous' || l.targetId == 'continuous').firstOrNull;

          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              // Goal Streak Card
              streakAsync.when(
                data: (streak) => Container(
                  padding: const EdgeInsets.all(16),
                  margin: const EdgeInsets.only(bottom: 16),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [Colors.orange.shade400, Colors.deepOrange.shade600],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.orange.withOpacity(0.3),
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      const Text('🔥', style: TextStyle(fontSize: 36)),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              streak > 0 ? '$streak-Day Goal Streak!' : 'Start Your Screen Time Streak',
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 18,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              streak > 0
                                  ? 'You stayed under your daily screen-time goal for $streak consecutive days.'
                                  : 'Stay under your daily screen-time limit today to build your streak.',
                              style: const TextStyle(color: Colors.white70, fontSize: 12),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                loading: () => const SizedBox(),
                error: (_, __) => const SizedBox(),
              ),

              // Focus Session Active Banner
              if (focusState.isActive) ...[
                Container(
                  padding: const EdgeInsets.all(16),
                  margin: const EdgeInsets.only(bottom: 16),
                  decoration: BoxDecoration(
                    color: theme.colorScheme.primaryContainer,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              const Icon(Icons.psychology, color: Colors.indigo),
                              const SizedBox(width: 8),
                              Text('Active Focus Session',
                                  style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
                            ],
                          ),
                          Text(
                            focusState.formattedRemaining,
                            style: theme.textTheme.headlineSmall?.copyWith(
                              fontWeight: FontWeight.bold,
                              color: theme.colorScheme.primary,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      LinearProgressIndicator(
                        value: focusState.progress,
                        borderRadius: BorderRadius.circular(4),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          TextButton.icon(
                            onPressed: () => ref.read(focusSessionProvider.notifier).pauseSession(),
                            icon: const Icon(Icons.pause),
                            label: const Text('Pause'),
                          ),
                          const SizedBox(width: 8),
                          FilledButton.tonalIcon(
                            onPressed: () => ref.read(focusSessionProvider.notifier).stopSession(),
                            icon: const Icon(Icons.stop),
                            label: const Text('End Focus'),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],

              // 1. Daily Total Screen Time Goal
              _buildSectionTitle('Daily Total Screen-Time Goal', Icons.flag_outlined, theme),
              const SizedBox(height: 8),
              Card(
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('Global Daily Limit', style: TextStyle(fontWeight: FontWeight.bold)),
                          Text(
                            dailyLimit != null ? formatMinutes(dailyLimit.limitDurationMinutes) : 'Not configured',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              color: dailyLimit != null ? theme.colorScheme.primary : Colors.grey,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        'Set your target screen time for the entire day. Friendly alerts notify you when reaching this threshold.',
                        style: TextStyle(fontSize: 12, color: Colors.grey),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          if (dailyLimit != null)
                            TextButton(
                              onPressed: () async {
                                final db = ref.read(databaseProvider);
                                await db.usageDao.deleteLimit(dailyLimit.id);
                              },
                              style: TextButton.styleFrom(foregroundColor: Colors.red),
                              child: const Text('Remove'),
                            ),
                          FilledButton.tonal(
                            onPressed: () => _showDailyGoalDialog(context, dailyLimit?.limitDurationMinutes ?? 240),
                            child: Text(dailyLimit != null ? 'Adjust Goal' : 'Set Goal'),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 20),

              // 2. Continuous-Use Warning Threshold
              _buildSectionTitle('Continuous-Use Warning', Icons.timer_outlined, theme),
              const SizedBox(height: 8),
              Card(
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('Unbroken Screen Time Alert', style: TextStyle(fontWeight: FontWeight.bold)),
                          Text(
                            continuousLimit != null ? formatMinutes(continuousLimit.limitDurationMinutes) : '60 min (Default)',
                            style: TextStyle(fontWeight: FontWeight.bold, color: theme.colorScheme.primary),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        'Alerts you to rest your eyes if you have been continuously on your phone without locking.',
                        style: TextStyle(fontSize: 12, color: Colors.grey),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          FilledButton.tonal(
                            onPressed: () => _showContinuousDialog(context, continuousLimit?.limitDurationMinutes ?? 60),
                            child: const Text('Configure Threshold'),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 20),

              // 3. Category Usage Limits
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  _buildSectionTitle('Category Limits', Icons.category_outlined, theme),
                  IconButton(
                    icon: const Icon(Icons.add_circle_outline),
                    tooltip: 'Add Category Limit',
                    onPressed: () => _showAddCategoryLimitDialog(context),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              if (categoryLimits.isEmpty)
                Card(
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  child: const Padding(
                    padding: EdgeInsets.all(16),
                    child: Text('No category limits configured. Tap + to set limits for Social media, Entertainment, etc.',
                        style: TextStyle(color: Colors.grey, fontSize: 13)),
                  ),
                )
              else
                ...categoryLimits.map((lim) {
                  return Card(
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    margin: const EdgeInsets.only(bottom: 8),
                    child: ListTile(
                      leading: Icon(
                        AppCategorizer.getCategoryIcon(lim.targetId),
                        color: AppCategorizer.getCategoryColor(lim.targetId),
                      ),
                      title: Text(lim.targetId, style: const TextStyle(fontWeight: FontWeight.bold)),
                      subtitle: Text('${formatMinutes(lim.limitDurationMinutes)} daily limit'),
                      trailing: IconButton(
                        icon: const Icon(Icons.delete_outline, color: Colors.red),
                        onPressed: () async {
                          final db = ref.read(databaseProvider);
                          await db.usageDao.deleteLimit(lim.id);
                        },
                      ),
                    ),
                  );
                }),
              const SizedBox(height: 20),

              // 4. Per-App Usage Limits
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  _buildSectionTitle('Per-App Limits', Icons.apps_outlined, theme),
                  IconButton(
                    icon: const Icon(Icons.add_circle_outline),
                    tooltip: 'Add App Limit',
                    onPressed: () => _showAddAppLimitDialog(context, installedApps),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              if (appLimits.isEmpty)
                Card(
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  child: const Padding(
                    padding: EdgeInsets.all(16),
                    child: Text('No per-app limits configured. Tap + to cap specific distracting applications.',
                        style: TextStyle(color: Colors.grey, fontSize: 13)),
                  ),
                )
              else
                ...appLimits.map((lim) {
                  final app = installedApps[lim.targetId];
                  return Card(
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    margin: const EdgeInsets.only(bottom: 8),
                    child: ListTile(
                      leading: app is ApplicationWithIcon
                          ? Image.memory(app.icon, width: 36, height: 36)
                          : const Icon(Icons.android, size: 36),
                      title: Text(app?.appName ?? lim.targetId, style: const TextStyle(fontWeight: FontWeight.bold)),
                      subtitle: Text('${formatMinutes(lim.limitDurationMinutes)} daily limit'),
                      trailing: IconButton(
                        icon: const Icon(Icons.delete_outline, color: Colors.red),
                        onPressed: () async {
                          final db = ref.read(databaseProvider);
                          await db.usageDao.deleteLimit(lim.id);
                        },
                      ),
                    ),
                  );
                }),
              const SizedBox(height: 20),

              // 5. Focus Sessions & Phone-Free Time
              _buildSectionTitle('Focus & Phone-Free Mode', Icons.self_improvement_outlined, theme),
              const SizedBox(height: 8),
              Card(
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Start a Focus Session', style: TextStyle(fontWeight: FontWeight.bold)),
                      const SizedBox(height: 6),
                      const Text('Commit to uninterrupted deep work without picking up your phone.',
                          style: TextStyle(fontSize: 12, color: Colors.grey)),
                      const SizedBox(height: 12),
                      Wrap(
                        spacing: 8,
                        children: [
                          ActionChip(
                            avatar: const Icon(Icons.play_arrow, size: 16),
                            label: const Text('25 min'),
                            onPressed: () => ref.read(focusSessionProvider.notifier).startSession(minutes: 25),
                          ),
                          ActionChip(
                            avatar: const Icon(Icons.play_arrow, size: 16),
                            label: const Text('45 min'),
                            onPressed: () => ref.read(focusSessionProvider.notifier).startSession(minutes: 45),
                          ),
                          ActionChip(
                            avatar: const Icon(Icons.play_arrow, size: 16),
                            label: const Text('60 min'),
                            onPressed: () => ref.read(focusSessionProvider.notifier).startSession(minutes: 60),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),

              // 6. Transparent Android Policy Card
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: theme.colorScheme.surfaceVariant.withOpacity(0.4),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(Icons.info_outline, size: 20, color: Colors.blue),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        'Android OS Restrictions: Personal Hub prioritizes battery life and privacy. Android prevents third-party apps from forcibly blocking or killing other apps without Device Owner or accessibility services. When a limit is reached, a visible notification alert and dashboard reminder will guide your digital wellbeing.',
                        style: theme.textTheme.bodySmall?.copyWith(color: Colors.grey[700], height: 1.4),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 32),
            ],
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Error: $e')),
      ),
    );
  }

  Widget _buildSectionTitle(String title, IconData icon, ThemeData theme) {
    return Row(
      children: [
        Icon(icon, size: 20, color: theme.colorScheme.primary),
        const SizedBox(width: 8),
        Text(title, style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
      ],
    );
  }

  String formatMinutes(int minutes) {
    final h = minutes ~/ 60;
    final m = minutes % 60;
    if (h > 0 && m > 0) return '${h}h ${m}m';
    if (h > 0) return '${h}h';
    return '${m}m';
  }

  void _showDailyGoalDialog(BuildContext context, int initialMinutes) {
    int duration = initialMinutes;
    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setDialogState) {
          return AlertDialog(
            title: const Text('Daily Screen-Time Goal'),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text('Choose your total daily target across all applications.'),
                const SizedBox(height: 16),
                Slider(
                  value: duration.toDouble(),
                  min: 30,
                  max: 720,
                  divisions: 23,
                  label: formatMinutes(duration),
                  onChanged: (val) => setDialogState(() => duration = val.toInt()),
                ),
                Text(formatMinutes(duration), style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
              ],
            ),
            actions: [
              TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
              FilledButton(
                onPressed: () async {
                  final db = ref.read(databaseProvider);
                  await db.usageDao.insertLimit(
                    UsageLimitsCompanion.insert(
                      id: 'daily_goal_limit',
                      targetId: 'daily',
                      limitType: 'daily_total',
                      limitDurationMinutes: duration,
                    ),
                  );
                  if (ctx.mounted) Navigator.pop(ctx);
                },
                child: const Text('Save Goal'),
              ),
            ],
          );
        },
      ),
    );
  }

  void _showContinuousDialog(BuildContext context, int initialMinutes) {
    int duration = initialMinutes;
    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setDialogState) {
          return AlertDialog(
            title: const Text('Continuous-Use Warning'),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text('Notify when continuous phone usage exceeds:'),
                const SizedBox(height: 16),
                Slider(
                  value: duration.toDouble(),
                  min: 20,
                  max: 180,
                  divisions: 16,
                  label: '$duration min',
                  onChanged: (val) => setDialogState(() => duration = val.toInt()),
                ),
                Text('$duration minutes', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
              ],
            ),
            actions: [
              TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
              FilledButton(
                onPressed: () async {
                  final db = ref.read(databaseProvider);
                  await db.usageDao.insertLimit(
                    UsageLimitsCompanion.insert(
                      id: 'continuous_use_limit',
                      targetId: 'continuous',
                      limitType: 'continuous',
                      limitDurationMinutes: duration,
                    ),
                  );
                  if (ctx.mounted) Navigator.pop(ctx);
                },
                child: const Text('Save'),
              ),
            ],
          );
        },
      ),
    );
  }

  void _showAddCategoryLimitDialog(BuildContext context) {
    String selectedCat = AppCategorizer.categorySocial;
    int duration = 90;

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setDialogState) {
          return AlertDialog(
            title: const Text('Add Category Limit'),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                DropdownButton<String>(
                  value: selectedCat,
                  isExpanded: true,
                  items: AppCategorizer.defaultCategories.map((c) {
                    return DropdownMenuItem(value: c, child: Text(c));
                  }).toList(),
                  onChanged: (val) {
                    if (val != null) setDialogState(() => selectedCat = val);
                  },
                ),
                const SizedBox(height: 16),
                Slider(
                  value: duration.toDouble(),
                  min: 15,
                  max: 360,
                  divisions: 23,
                  label: formatMinutes(duration),
                  onChanged: (val) => setDialogState(() => duration = val.toInt()),
                ),
                Text(formatMinutes(duration), style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              ],
            ),
            actions: [
              TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
              FilledButton(
                onPressed: () async {
                  final db = ref.read(databaseProvider);
                  await db.usageDao.insertLimit(
                    UsageLimitsCompanion.insert(
                      id: const Uuid().v4(),
                      targetId: selectedCat,
                      limitType: 'category',
                      limitDurationMinutes: duration,
                    ),
                  );
                  if (ctx.mounted) Navigator.pop(ctx);
                },
                child: const Text('Save Limit'),
              ),
            ],
          );
        },
      ),
    );
  }

  void _showAddAppLimitDialog(BuildContext context, Map<String, Application> apps) {
    if (apps.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('No installed applications detected.')),
      );
      return;
    }

    final appList = apps.values.toList()..sort((a, b) => a.appName.compareTo(b.appName));
    String selectedPkg = appList.first.packageName;
    int duration = 45;

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setDialogState) {
          return AlertDialog(
            title: const Text('Set App Limit'),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                DropdownButton<String>(
                  value: selectedPkg,
                  isExpanded: true,
                  items: appList.take(50).map((app) {
                    return DropdownMenuItem(
                      value: app.packageName,
                      child: Text(app.appName, overflow: TextOverflow.ellipsis),
                    );
                  }).toList(),
                  onChanged: (val) {
                    if (val != null) setDialogState(() => selectedPkg = val);
                  },
                ),
                const SizedBox(height: 16),
                Slider(
                  value: duration.toDouble(),
                  min: 10,
                  max: 300,
                  divisions: 29,
                  label: formatMinutes(duration),
                  onChanged: (val) => setDialogState(() => duration = val.toInt()),
                ),
                Text(formatMinutes(duration), style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              ],
            ),
            actions: [
              TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
              FilledButton(
                onPressed: () async {
                  final db = ref.read(databaseProvider);
                  await db.usageDao.insertLimit(
                    UsageLimitsCompanion.insert(
                      id: const Uuid().v4(),
                      targetId: selectedPkg,
                      limitType: 'app',
                      limitDurationMinutes: duration,
                    ),
                  );
                  if (ctx.mounted) Navigator.pop(ctx);
                },
                child: const Text('Save Limit'),
              ),
            ],
          );
        },
      ),
    );
  }
}
