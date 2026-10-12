import 'package:flutter/material.dart';
import '../../common/presentation/module_placeholder_screen.dart';

class TasksPlaceholderScreen extends StatelessWidget {
  const TasksPlaceholderScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const ModulePlaceholderScreen(
      title: 'Tasks',
      stageTag: 'Stage 4',
      icon: Icons.check_circle_outline_rounded,
      accentColor: Color(0xFFF59E0B), // Amber
      description:
          'High-performance task and project management. Features priorities, subtasks, recurrence, and cross-linking to calendar events.',
      plannedFeatures: [
        'Custom task lists and projects',
        'Due dates with local notification alarms',
        'Four-tier priority matrix',
        'Recurrence rules and calendar timeline projection',
      ],
      preparedTables: ['TaskLists', 'TaskItems', 'EntityCrossLinks'],
    );
  }
}
