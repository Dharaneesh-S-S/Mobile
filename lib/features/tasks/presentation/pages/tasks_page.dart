import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../tasks_web_view.dart';

/// TasksPage renders the modern Zenith Tasks web application
/// inspired by Google Tasks' layout and features, with lists,
/// drag-and-drop, rapid task entry, calendar view, subtasks,
/// and compressed local storage.
class TasksPage extends ConsumerWidget {
  const TasksPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return const Scaffold(
      body: SafeArea(
        child: ZenithTasksWebView(),
      ),
    );
  }
}
