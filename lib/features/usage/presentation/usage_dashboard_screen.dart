import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'usage_permission_wrapper.dart';
import '../providers/usage_providers.dart';
import 'package:device_apps/device_apps.dart';

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
  DateTime _selectedDate = DateTime.now();

  @override
  Widget build(BuildContext context) {
    final dailyUsageAsync = ref.watch(dailyUsageProvider(_selectedDate));
    final installedAppsAsync = ref.watch(installedAppsProvider);
    final totalDuration = ref.watch(dailyTotalUsageProvider(_selectedDate));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Usage Tracker'),
        actions: [
          IconButton(
            icon: const Icon(Icons.calendar_today),
            onPressed: () async {
              final picked = await showDatePicker(
                context: context,
                initialDate: _selectedDate,
                firstDate: DateTime.now().subtract(const Duration(days: 30)),
                lastDate: DateTime.now(),
              );
              if (picked != null) {
                setState(() => _selectedDate = picked);
              }
            },
          )
        ],
      ),
      body: dailyUsageAsync.when(
        data: (usageList) {
          if (usageList.isEmpty) {
            return const Center(child: Text('No usage data available for this date.'));
          }

          // Sort by usage descending
          usageList.sort((a, b) => b.usage.compareTo(a.usage));

          return CustomScrollView(
            slivers: [
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    children: [
                      Text('Total Screen Time', style: Theme.of(context).textTheme.titleLarge),
                      const SizedBox(height: 8),
                      Text(
                        _formatDuration(totalDuration),
                        style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                          color: Theme.of(context).colorScheme.primary,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text('Last updated: ${TimeOfDay.now().format(context)}'),
                    ],
                  ),
                ),
              ),
              SliverList(
                delegate: SliverChildBuilderDelegate(
                  (context, index) {
                    final info = usageList[index];
                    return installedAppsAsync.when(
                      data: (appsMap) {
                        final app = appsMap[info.packageName];
                        return ListTile(
                          leading: app is ApplicationWithIcon
                              ? Image.memory(app.icon, width: 40, height: 40)
                              : const Icon(Icons.android, size: 40),
                          title: Text(app?.appName ?? info.appName),
                          subtitle: Text(info.packageName),
                          trailing: Text(_formatDuration(info.usage)),
                          onTap: () {
                            // Show details or limits
                          },
                        );
                      },
                      loading: () => ListTile(
                        leading: const CircularProgressIndicator(),
                        title: Text(info.appName),
                        trailing: Text(_formatDuration(info.usage)),
                      ),
                      error: (_, __) => ListTile(
                        leading: const Icon(Icons.error),
                        title: Text(info.appName),
                        trailing: Text(_formatDuration(info.usage)),
                      ),
                    );
                  },
                  childCount: usageList.length,
                ),
              ),
            ],
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stack) => Center(child: Text('Error: $error')),
      ),
    );
  }

  String _formatDuration(Duration duration) {
    if (duration.inHours > 0) {
      return '${duration.inHours}h ${duration.inMinutes.remainder(60)}m';
    }
    return '${duration.inMinutes}m';
  }
}
