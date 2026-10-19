import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../providers/calendar_providers.dart';
import 'views/month_view.dart';
import 'views/week_view.dart';
import 'views/year_view.dart';
import 'views/day_view.dart';
import 'views/agenda_view.dart';
import 'views/four_day_view.dart';
import 'event_editor_screen.dart';
import '../../tasks/presentation/pages/task_form_sheet.dart';
import '../../../core/theme/app_colors.dart';
import '../domain/models/calendar_display_item.dart';
import 'calendar_item_handler.dart';

class CalendarScreen extends ConsumerWidget {
  const CalendarScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedDate = ref.watch(selectedDateProvider);
    final currentView = ref.watch(currentViewProvider);

    String titleText;
    if (currentView == CalendarViewType.year) {
      titleText = '${selectedDate.year}';
    } else if (currentView == CalendarViewType.day) {
      titleText = DateFormat('MMM d, yyyy').format(selectedDate);
    } else {
      titleText = DateFormat('MMMM yyyy').format(selectedDate);
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(titleText),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {
              showSearch(
                context: context,
                delegate: CalendarSearchDelegate(ref: ref),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.today),
            tooltip: 'Today',
            onPressed: () {
              ref.read(selectedDateProvider.notifier).state = DateTime.now();
            },
          ),
          PopupMenuButton<CalendarViewType>(
            icon: const Icon(Icons.calendar_view_month_rounded),
            tooltip: 'Select View',
            initialValue: currentView,
            onSelected: (view) => ref.read(currentViewProvider.notifier).state = view,
            itemBuilder: (context) => const [
              PopupMenuItem(value: CalendarViewType.month, child: Text('Month View')),
              PopupMenuItem(value: CalendarViewType.week, child: Text('Week View')),
              PopupMenuItem(value: CalendarViewType.fourDay, child: Text('4-Day View')),
              PopupMenuItem(value: CalendarViewType.year, child: Text('Year View')),
              PopupMenuItem(value: CalendarViewType.day, child: Text('Day View')),
              PopupMenuItem(value: CalendarViewType.agenda, child: Text('Agenda View')),
            ],
          ),
        ],
      ),
      body: _buildView(currentView),
      floatingActionButton: FloatingActionButton(
        backgroundColor: AppColors.accentCyan,
        onPressed: () {
          _showAddOptionsSheet(context, selectedDate);
        },
        child: const Icon(Icons.add, color: Colors.white),
      ),
    );
  }

  void _showAddOptionsSheet(BuildContext context, DateTime selectedDate) {
    showModalBottomSheet(
      context: context,
      useRootNavigator: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (bCtx) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 12.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 36,
                height: 4,
                margin: const EdgeInsets.only(bottom: 12),
                decoration: BoxDecoration(
                  color: Colors.grey.withOpacity(0.4),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              ListTile(
                leading: const CircleAvatar(
                  backgroundColor: AppColors.accentCyan,
                  child: Icon(Icons.event, color: Colors.white),
                ),
                title: const Text('Add Event', style: TextStyle(fontWeight: FontWeight.bold)),
                subtitle: const Text('Meetings, appointments, birthdays'),
                onTap: () {
                  Navigator.pop(bCtx);
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => EventEditorScreen(
                        initialDate: selectedDate,
                        initialType: CalendarItemType.event,
                      ),
                    ),
                  );
                },
              ),
              ListTile(
                leading: const CircleAvatar(
                  backgroundColor: AppColors.accentEmerald,
                  child: Icon(Icons.check_circle_outline, color: Colors.white),
                ),
                title: const Text('Add Task', style: TextStyle(fontWeight: FontWeight.bold)),
                subtitle: const Text('To-do item with due date synced to Tasks'),
                onTap: () {
                  Navigator.pop(bCtx);
                  showModalBottomSheet(
                    context: context,
                    useRootNavigator: true,
                    isScrollControlled: true,
                    backgroundColor: Colors.transparent,
                    builder: (context) => TaskFormSheet(initialDueDate: selectedDate),
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildView(CalendarViewType view) {
    switch (view) {
      case CalendarViewType.month:
        return const MonthView();
      case CalendarViewType.week:
        return const WeekView();
      case CalendarViewType.fourDay:
        return const FourDayView();
      case CalendarViewType.year:
        return const YearView();
      case CalendarViewType.day:
        return const DayView();
      case CalendarViewType.agenda:
        return const AgendaView();
    }
  }
}

class CalendarSearchDelegate extends SearchDelegate<CalendarDisplayItem?> {
  final WidgetRef ref;

  CalendarSearchDelegate({required this.ref});

  @override
  List<Widget>? buildActions(BuildContext context) {
    return [
      if (query.isNotEmpty)
        IconButton(
          icon: const Icon(Icons.clear),
          onPressed: () => query = '',
        ),
    ];
  }

  @override
  Widget? buildLeading(BuildContext context) {
    return IconButton(
      icon: const Icon(Icons.arrow_back),
      onPressed: () => close(context, null),
    );
  }

  @override
  Widget buildResults(BuildContext context) => _buildSearchResults(context);

  @override
  Widget buildSuggestions(BuildContext context) => _buildSearchResults(context);

  Widget _buildSearchResults(BuildContext context) {
    final allItems = ref.watch(calendarItemsProvider);
    final q = query.trim().toLowerCase();
    final results = q.isEmpty
        ? allItems
        : allItems.where((i) {
            final titleMatch = i.title.toLowerCase().contains(q);
            final descMatch = i.description?.toLowerCase().contains(q) ?? false;
            final locMatch = i.location?.toLowerCase().contains(q) ?? false;
            return titleMatch || descMatch || locMatch;
          }).toList();

    if (results.isEmpty) {
      return const Center(child: Text('No matching calendar entries found.'));
    }

    return ListView.builder(
      itemCount: results.length,
      itemBuilder: (context, index) {
        final item = results[index];
        return ListTile(
          leading: CircleAvatar(
            backgroundColor: item.color.withOpacity(0.2),
            child: Icon(_getIconData(item.type), color: item.color, size: 20),
          ),
          title: Text(item.title, style: const TextStyle(fontWeight: FontWeight.w600)),
          subtitle: Text(
            '${DateFormat('MMM d, yyyy').format(item.startTime)} • ${item.isAllDay ? "All Day" : DateFormat('jm').format(item.startTime)}',
          ),
          trailing: Text(
            item.type.name.toUpperCase(),
            style: TextStyle(fontSize: 10, color: item.color, fontWeight: FontWeight.bold),
          ),
          onTap: () {
            close(context, item);
            openCalendarItem(context, ref, item);
          },
        );
      },
    );
  }

  IconData _getIconData(CalendarItemType type) {
    switch (type) {
      case CalendarItemType.birthday:
        return Icons.cake;
      case CalendarItemType.holiday:
        return Icons.flag;
      case CalendarItemType.task:
        return Icons.check_circle_outline;
      case CalendarItemType.transaction:
        return Icons.attach_money;
      case CalendarItemType.event:
        return Icons.event;
    }
  }
}
