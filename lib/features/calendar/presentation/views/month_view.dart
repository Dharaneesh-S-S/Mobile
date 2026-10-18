import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../providers/calendar_providers.dart';
import '../../domain/models/calendar_display_item.dart';
import '../../../../core/theme/app_colors.dart';
import '../calendar_item_handler.dart';
import '../event_editor_screen.dart';
import '../../../tasks/presentation/pages/task_form_sheet.dart';
import '../../../tasks/providers/tasks_providers.dart';

class MonthView extends ConsumerStatefulWidget {
  const MonthView({super.key});

  @override
  ConsumerState<MonthView> createState() => _MonthViewState();
}

class _MonthViewState extends ConsumerState<MonthView> {
  late PageController _pageController;
  final int _basePage = 1000;
  DateTime _currentMonth = DateTime(DateTime.now().year, DateTime.now().month, 1);

  @override
  void initState() {
    super.initState();
    final initialDate = ref.read(selectedDateProvider);
    _currentMonth = DateTime(initialDate.year, initialDate.month, 1);
    final monthDiff = (initialDate.year - DateTime.now().year) * 12 + (initialDate.month - DateTime.now().month);
    _pageController = PageController(initialPage: _basePage + monthDiff);
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _syncPageToSelectedDate(DateTime date) {
    final targetMonth = DateTime(date.year, date.month, 1);
    if (targetMonth.year != _currentMonth.year || targetMonth.month != _currentMonth.month) {
      _currentMonth = targetMonth;
      final monthDiff = (targetMonth.year - DateTime.now().year) * 12 + (targetMonth.month - DateTime.now().month);
      final targetPage = _basePage + monthDiff;
      if (_pageController.hasClients && _pageController.page?.round() != targetPage) {
        _pageController.jumpToPage(targetPage);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final selectedDate = ref.watch(selectedDateProvider);
    final items = ref.watch(calendarItemsProvider);
    final theme = Theme.of(context);

    // Sync page if selected date month changed externally (e.g. via Today button)
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        _syncPageToSelectedDate(selectedDate);
      }
    });

    // Filter items for the selected day to show in the bottom agenda section
    final selectedDayItems = items.where((i) =>
        i.startTime.year == selectedDate.year &&
        i.startTime.month == selectedDate.month &&
        i.startTime.day == selectedDate.day).toList();

    return Column(
      children: [
        _buildDaysOfWeek(theme),
        // Month Grid View
        Expanded(
          flex: 11,
          child: PageView.builder(
            controller: _pageController,
            onPageChanged: (index) {
              final offset = index - _basePage;
              final newMonth = DateTime(DateTime.now().year, DateTime.now().month + offset, 1);
              setState(() => _currentMonth = newMonth);
              // Also update selectedDate to same day in new month or 1st of month
              final clampedDay = selectedDate.day.clamp(1, DateTime(newMonth.year, newMonth.month + 1, 0).day);
              final newSelected = DateTime(newMonth.year, newMonth.month, clampedDay);
              WidgetsBinding.instance.addPostFrameCallback((_) {
                ref.read(selectedDateProvider.notifier).state = newSelected;
              });
            },
            itemBuilder: (context, index) {
              final offset = index - _basePage;
              final monthDate = DateTime(DateTime.now().year, DateTime.now().month + offset, 1);
              return _buildMonthGrid(monthDate, selectedDate, items, theme);
            },
          ),
        ),
        const Divider(height: 1),
        // Selected Day Agenda Detail Section
        Expanded(
          flex: 9,
          child: _buildSelectedDayAgenda(context, selectedDate, selectedDayItems, theme),
        ),
      ],
    );
  }

  Widget _buildDaysOfWeek(ThemeData theme) {
    final days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 4.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: days.map((d) => Text(
          d,
          style: theme.textTheme.labelSmall?.copyWith(
            fontWeight: FontWeight.w700,
            color: theme.colorScheme.onSurface.withOpacity(0.6),
            letterSpacing: 0.8,
          ),
        )).toList(),
      ),
    );
  }

  Widget _buildMonthGrid(DateTime monthDate, DateTime selectedDate, List<CalendarDisplayItem> items, ThemeData theme) {
    final firstDayOfMonth = DateTime(monthDate.year, monthDate.month, 1);
    int firstWeekday = firstDayOfMonth.weekday;
    if (firstWeekday == 7) firstWeekday = 0; // Sunday = 0

    const totalCells = 42; // 6 rows * 7 columns
    final List<DateTime> gridDates = [];

    for (int i = 0; i < totalCells; i++) {
      final dayOffset = i - firstWeekday;
      gridDates.add(DateTime(monthDate.year, monthDate.month, 1 + dayOffset));
    }

    return LayoutBuilder(
      builder: (context, constraints) {
        final cellHeight = constraints.maxHeight / 6;
        final cellWidth = constraints.maxWidth / 7;

        return GridView.builder(
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 7,
            childAspectRatio: cellWidth / cellHeight,
          ),
          itemCount: totalCells,
          itemBuilder: (context, index) {
            final date = gridDates[index];
            final isOutsideMonth = date.month != monthDate.month;

            final dayItems = items.where((item) =>
                item.startTime.year == date.year &&
                item.startTime.month == date.month &&
                item.startTime.day == date.day).toList();

            return _buildDayCell(date, isOutsideMonth, selectedDate, dayItems, theme);
          },
        );
      },
    );
  }

  Widget _buildDayCell(
    DateTime date,
    bool isOutsideMonth,
    DateTime selectedDate,
    List<CalendarDisplayItem> dayItems,
    ThemeData theme,
  ) {
    final now = DateTime.now();
    final isToday = date.year == now.year && date.month == now.month && date.day == now.day;
    final isSelected = date.year == selectedDate.year && date.month == selectedDate.month && date.day == selectedDate.day;

    return InkWell(
      onTap: () {
        ref.read(selectedDateProvider.notifier).state = date;
      },
      child: Container(
        margin: const EdgeInsets.all(1.5),
        decoration: BoxDecoration(
          color: isSelected
              ? AppColors.accentCyan.withOpacity(0.15)
              : Colors.transparent,
          borderRadius: BorderRadius.circular(8),
          border: isSelected
              ? Border.all(color: AppColors.accentCyan, width: 1.5)
              : null,
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Date number badge
            Container(
              width: 28,
              height: 28,
              alignment: Alignment.center,
              decoration: BoxDecoration(
                color: isToday ? AppColors.accentCyan : Colors.transparent,
                shape: BoxShape.circle,
              ),
              child: Text(
                '${date.day}',
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: (isToday || isSelected) ? FontWeight.bold : FontWeight.w600,
                  color: isToday
                      ? Colors.white
                      : (isOutsideMonth
                          ? theme.colorScheme.onSurface.withOpacity(0.3)
                          : theme.colorScheme.onSurface),
                ),
              ),
            ),
            const SizedBox(height: 2),
            // Event & Task indicator dots
            if (dayItems.isNotEmpty)
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  for (int i = 0; i < (dayItems.length > 3 ? 3 : dayItems.length); i++)
                    Container(
                      width: 5,
                      height: 5,
                      margin: const EdgeInsets.symmetric(horizontal: 1),
                      decoration: BoxDecoration(
                        color: dayItems[i].color,
                        shape: BoxShape.circle,
                      ),
                    ),
                  if (dayItems.length > 3)
                    Container(
                      margin: const EdgeInsets.only(left: 1),
                      child: Text(
                        '+',
                        style: TextStyle(fontSize: 8, fontWeight: FontWeight.bold, color: theme.colorScheme.primary),
                      ),
                    ),
                ],
              )
            else
              const SizedBox(height: 5),
          ],
        ),
      ),
    );
  }

  Widget _buildSelectedDayAgenda(
    BuildContext context,
    DateTime selectedDate,
    List<CalendarDisplayItem> items,
    ThemeData theme,
  ) {
    return Container(
      color: theme.colorScheme.surface,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Section header with formatted date and quick add options
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 10, 8, 4),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        DateFormat('EEEE, MMM d, yyyy').format(selectedDate),
                        style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                      ),
                      Text(
                        items.isEmpty
                            ? 'No events or tasks'
                            : '${items.length} ${items.length == 1 ? 'item' : 'items'} scheduled',
                        style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurface.withOpacity(0.6)),
                      ),
                    ],
                  ),
                ),
                IconButton(
                  tooltip: 'Add Task for this day',
                  icon: const Icon(Icons.add_task_rounded, color: AppColors.accentEmerald),
                  onPressed: () {
                    showModalBottomSheet(
                      context: context,
                      useRootNavigator: true,
                      isScrollControlled: true,
                      backgroundColor: Colors.transparent,
                      builder: (ctx) => TaskFormSheet(initialDueDate: selectedDate),
                    );
                  },
                ),
                IconButton(
                  tooltip: 'Add Event for this day',
                  icon: const Icon(Icons.event_available_rounded, color: AppColors.accentCyan),
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => EventEditorScreen(initialDate: selectedDate, initialType: CalendarItemType.event),
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
          const Divider(height: 8),
          Expanded(
            child: items.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.event_note_rounded, size: 40, color: theme.colorScheme.onSurface.withOpacity(0.3)),
                        const SizedBox(height: 8),
                        Text(
                          'No events or tasks for this day',
                          style: theme.textTheme.bodyMedium?.copyWith(color: theme.colorScheme.onSurface.withOpacity(0.5)),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                    itemCount: items.length,
                    itemBuilder: (context, idx) {
                      final item = items[idx];
                      return Card(
                        margin: const EdgeInsets.symmetric(vertical: 4),
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                          side: BorderSide(color: theme.dividerColor.withOpacity(0.4)),
                        ),
                        child: ListTile(
                          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                          leading: item.type == CalendarItemType.task
                              ? Checkbox(
                                  value: item.isCompleted,
                                  activeColor: AppColors.accentEmerald,
                                  shape: const CircleBorder(),
                                  onChanged: (val) {
                                    if (val != null) {
                                      ref.read(taskServiceProvider).toggleTaskCompletion(item.sourceId, val);
                                    }
                                  },
                                )
                              : Container(
                                  width: 14,
                                  height: 14,
                                  decoration: BoxDecoration(color: item.color, shape: BoxShape.circle),
                                ),
                          title: Text(
                            item.title,
                            style: TextStyle(
                              fontWeight: FontWeight.w600,
                              decoration: item.isCompleted ? TextDecoration.lineThrough : null,
                              color: item.isCompleted
                                  ? theme.colorScheme.onSurface.withOpacity(0.4)
                                  : theme.colorScheme.onSurface,
                            ),
                          ),
                          subtitle: Text(
                            item.isAllDay
                                ? 'All Day'
                                : '${DateFormat('h:mm a').format(item.startTime)} - ${DateFormat('h:mm a').format(item.endTime)}',
                            style: TextStyle(fontSize: 12, color: theme.colorScheme.onSurface.withOpacity(0.6)),
                          ),
                          trailing: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: item.color.withOpacity(0.15),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              item.type.name.toUpperCase(),
                              style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: item.color),
                            ),
                          ),
                          onTap: () => openCalendarItem(context, ref, item),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
