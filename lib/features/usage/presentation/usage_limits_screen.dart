import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:uuid/uuid.dart';
import '../../../core/providers/core_providers.dart';
import '../../../core/database/app_database.dart';
import '../providers/usage_providers.dart';

class UsageLimitsScreen extends ConsumerWidget {
  const UsageLimitsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final limitsAsync = ref.watch(usageLimitsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Usage Limits & Goals'),
      ),
      body: limitsAsync.when(
        data: (limits) {
          if (limits.isEmpty) {
            return const Center(child: Text('No limits configured.'));
          }
          return ListView.builder(
            itemCount: limits.length,
            itemBuilder: (context, index) {
              final limit = limits[index];
              return ListTile(
                title: Text('${limit.limitType}: ${limit.targetId}'),
                subtitle: Text('${limit.limitDurationMinutes} minutes'),
              );
            },
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stack) => Center(child: Text('Error: $error')),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showAddLimitDialog(context, ref),
        child: const Icon(Icons.add),
      ),
    );
  }

  void _showAddLimitDialog(BuildContext context, WidgetRef ref) {
    int durationMinutes = 60;
    
    showDialog(
      context: context,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setState) {
            return AlertDialog(
              title: const Text('Add Daily Limit'),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text('Set a global daily screen time limit.'),
                  const SizedBox(height: 16),
                  Slider(
                    value: durationMinutes.toDouble(),
                    min: 15,
                    max: 1440,
                    divisions: 95,
                    label: '$durationMinutes min',
                    onChanged: (val) {
                      setState(() => durationMinutes = val.toInt());
                    },
                  ),
                  Text('$durationMinutes minutes'),
                ],
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text('Cancel'),
                ),
                FilledButton(
                  onPressed: () async {
                    final db = ref.read(databaseProvider);
                    await db.usageDao.insertLimit(
                      UsageLimitsCompanion.insert(
                        id: const Uuid().v4(),
                        targetId: 'daily',
                        limitType: 'daily_total',
                        limitDurationMinutes: durationMinutes,
                      ),
                    );
                    if (context.mounted) Navigator.pop(context);
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
