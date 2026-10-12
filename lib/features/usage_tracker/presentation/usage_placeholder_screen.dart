import 'package:flutter/material.dart';
import '../../common/presentation/module_placeholder_screen.dart';

class UsagePlaceholderScreen extends StatelessWidget {
  const UsagePlaceholderScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const ModulePlaceholderScreen(
      title: 'Usage Tracker',
      stageTag: 'Stage 6',
      icon: Icons.pie_chart_outline_rounded,
      accentColor: Color(0xFFFB7185), // Rose
      description:
          'On-device digital wellbeing and application usage statistics. Strictly stored locally with zero analytics telemetry sent externally.',
      plannedFeatures: [
        'Android native UsageStatsManager integration',
        'Daily and weekly application screen-time metrics',
        'App launch counters and session timelines',
        'Focus goals and bedtime reminder notifications',
      ],
      preparedTables: ['UsageSessions'],
    );
  }
}
