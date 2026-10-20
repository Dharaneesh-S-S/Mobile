import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'calendar_web_view.dart';

/// CalendarScreen renders the modern Chronos Calendar web application
/// with Google Calendar features, interactive views, drag-and-drop,
/// and compressed local storage.
class CalendarScreen extends ConsumerWidget {
  const CalendarScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return const Scaffold(
      body: SafeArea(
        child: ChronosCalendarWebView(),
      ),
    );
  }
}
