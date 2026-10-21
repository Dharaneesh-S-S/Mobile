import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'usage_web_view.dart';

/// UsageDashboardScreen renders the modern ZenPulse Digital Wellbeing &
/// Parental Controls application with rich visualizations, 90-day analytics,
/// app limits, bedtime mode, eye care, and family management.
class UsageDashboardScreen extends ConsumerWidget {
  const UsageDashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return const Scaffold(
      body: SafeArea(
        child: ZenPulseUsageWebView(),
      ),
    );
  }
}
