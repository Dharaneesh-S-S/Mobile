import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/providers/core_providers.dart';
import '../../../core/theme/app_colors.dart';
import '../providers/calendar_providers.dart';

class CalendarSettingsSheet extends ConsumerWidget {
  const CalendarSettingsSheet({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final showWeekends = ref.watch(showWeekendsProvider);
    final dimPast = ref.watch(dimPastEventsProvider);
    final showWeekNums = ref.watch(showWeekNumbersProvider);
    final showCompletedTasks = ref.watch(showCompletedTasksProvider);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      decoration: BoxDecoration(
        color: theme.scaffoldBackgroundColor,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 36,
                height: 4,
                margin: const EdgeInsets.only(bottom: 16),
                decoration: BoxDecoration(
                  color: Colors.grey.withOpacity(0.3),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            Row(
              children: [
                const Icon(Icons.settings_outlined, color: AppColors.accentCyan),
                const SizedBox(width: 12),
                Text(
                  'Calendar View Settings',
                  style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                ),
              ],
            ),
            const SizedBox(height: 16),
            const Divider(height: 1),
            const SizedBox(height: 8),

            SwitchListTile(
              contentPadding: EdgeInsets.zero,
              title: const Text('Show weekends'),
              subtitle: const Text('Include Saturday and Sunday in week/month grids'),
              value: showWeekends,
              activeColor: AppColors.accentCyan,
              onChanged: (val) => ref.read(showWeekendsProvider.notifier).state = val,
            ),

            SwitchListTile(
              contentPadding: EdgeInsets.zero,
              title: const Text('Dim past events'),
              subtitle: const Text('Fade events and tasks that have already ended'),
              value: dimPast,
              activeColor: AppColors.accentCyan,
              onChanged: (val) => ref.read(dimPastEventsProvider.notifier).state = val,
            ),

            SwitchListTile(
              contentPadding: EdgeInsets.zero,
              title: const Text('Show week numbers'),
              subtitle: const Text('Display week number alongside month grid'),
              value: showWeekNums,
              activeColor: AppColors.accentCyan,
              onChanged: (val) => ref.read(showWeekNumbersProvider.notifier).state = val,
            ),

            SwitchListTile(
              contentPadding: EdgeInsets.zero,
              title: const Text('Show completed tasks'),
              subtitle: const Text('Keep completed tasks visible on due dates'),
              value: showCompletedTasks,
              activeColor: AppColors.accentCyan,
              onChanged: (val) => ref.read(showCompletedTasksProvider.notifier).state = val,
            ),

            const SizedBox(height: 12),
            const Divider(height: 1),
            const SizedBox(height: 12),

            // Clear all events button
            ListTile(
              contentPadding: EdgeInsets.zero,
              leading: const Icon(Icons.delete_sweep_outlined, color: AppColors.lightError),
              title: const Text('Clear All Calendar Events', style: TextStyle(color: AppColors.lightError)),
              subtitle: const Text('Deletes all local events (tasks are preserved)'),
              onTap: () async {
                final confirm = await showDialog<bool>(
                  context: context,
                  builder: (ctx) => AlertDialog(
                    title: const Text('Clear Calendar Events?'),
                    content: const Text('This will permanently delete all created calendar events from your local database.'),
                    actions: [
                      TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancel')),
                      FilledButton(
                        style: FilledButton.styleFrom(backgroundColor: AppColors.lightError),
                        onPressed: () => Navigator.pop(ctx, true),
                        child: const Text('Clear All'),
                      ),
                    ],
                  ),
                );

                if (confirm == true && context.mounted) {
                  final db = ref.read(databaseProvider);
                  final allEvents = await db.calendarDao.getAllEvents();
                  for (final e in allEvents) {
                    await db.calendarDao.deleteEvent(e.id);
                  }
                  if (context.mounted) {
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('All calendar events cleared.')),
                    );
                  }
                }
              },
            ),

            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }
}
