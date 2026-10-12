import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../providers/calendar_providers.dart';
import 'views/month_view.dart';
import 'views/agenda_view.dart';
import 'views/day_view.dart';
import 'views/week_view.dart';
import 'event_editor_screen.dart';
import '../../../core/theme/app_colors.dart';

class CalendarScreen extends ConsumerWidget {
  const CalendarScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedDate = ref.watch(selectedDateProvider);
    final currentView = ref.watch(currentViewProvider);

    return Scaffold(
      appBar: AppBar(
        title: Text(
          DateFormat('MMMM yyyy').format(selectedDate),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {
              // TODO: implement search
            },
          ),
          IconButton(
            icon: const Icon(Icons.today),
            onPressed: () {
              ref.read(selectedDateProvider.notifier).state = DateTime.now();
            },
          ),
          PopupMenuButton<CalendarViewType>(
            icon: const Icon(Icons.more_vert),
            onSelected: (view) => ref.read(currentViewProvider.notifier).state = view,
            itemBuilder: (context) => const [
              PopupMenuItem(value: CalendarViewType.month, child: Text('Month')),
              PopupMenuItem(value: CalendarViewType.week, child: Text('Week')),
              PopupMenuItem(value: CalendarViewType.day, child: Text('Day')),
              PopupMenuItem(value: CalendarViewType.agenda, child: Text('Agenda')),
            ],
          ),
        ],
      ),
      body: _buildView(currentView),
      floatingActionButton: FloatingActionButton(
        backgroundColor: AppColors.accentCyan,
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => const EventEditorScreen(),
            ),
          );
        },
        child: const Icon(Icons.add, color: Colors.white),
      ),
    );
  }

  Widget _buildView(CalendarViewType view) {
    switch (view) {
      case CalendarViewType.month:
        return const MonthView();
      case CalendarViewType.week:
        return const WeekView();
      case CalendarViewType.day:
        return const DayView();
      case CalendarViewType.agenda:
        return const AgendaView();
    }
  }
}
