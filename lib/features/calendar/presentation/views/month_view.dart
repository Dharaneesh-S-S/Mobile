import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/calendar_providers.dart';
import '../../domain/models/calendar_display_item.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../tasks/presentation/pages/task_form_sheet.dart';
import '../../../tasks/providers/tasks_providers.dart';

class MonthView extends ConsumerStatefulWidget {
  const MonthView({super.key});

  @override
  ConsumerState<MonthView> createState() => _MonthViewState();
}

class _MonthViewState extends ConsumerState<MonthView> {
  late PageController _pageController;

  @override
  void initState() {
    super.initState();
    _pageController = PageController(initialPage: 1000); // start at a high number for infinite scroll
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final selectedDate = ref.watch(selectedDateProvider);
    final items = ref.watch(calendarItemsProvider);

    return Column(
      children: [
        _buildDaysOfWeek(),
        Expanded(
          child: PageView.builder(
            controller: _pageController,
            onPageChanged: (index) {
              final offset = index - 1000;
              final newDate = DateTime(DateTime.now().year, DateTime.now().month + offset, 1);
              // Only update if month/year changed to avoid jumpiness
              if (selectedDate.month != newDate.month || selectedDate.year != newDate.year) {
                WidgetsBinding.instance.addPostFrameCallback((_) {
                  ref.read(selectedDateProvider.notifier).state = newDate;
                });
              }
            },
            itemBuilder: (context, index) {
              final offset = index - 1000;
              final monthDate = DateTime(DateTime.now().year, DateTime.now().month + offset, 1);
              return _buildMonthGrid(monthDate, items);
            },
          ),
        ),
      ],
    );
  }

  Widget _buildDaysOfWeek() {
    final days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: days.map((d) => Text(d, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.grey))).toList(),
      ),
    );
  }

  Widget _buildMonthGrid(DateTime monthDate, List<CalendarDisplayItem> items) {
    // Calculate days to show
    final firstDayOfMonth = DateTime(monthDate.year, monthDate.month, 1);
    final daysInMonth = DateUtils.getDaysInMonth(monthDate.year, monthDate.month);
    
    // 0 = Sunday, 1 = Monday ... 6 = Saturday in our UI, but weekday is 1=Monday...7=Sunday
    int firstWeekday = firstDayOfMonth.weekday;
    if (firstWeekday == 7) firstWeekday = 0; // Adjust Sunday to 0

    final totalCells = 42; // 6 rows of 7 days
    final List<DateTime> gridDates = [];
    
    for (int i = 0; i < totalCells; i++) {
      final dayOffset = i - firstWeekday;
      gridDates.add(firstDayOfMonth.add(Duration(days: dayOffset)));
    }

    return LayoutBuilder(
      builder: (context, constraints) {
        final cellHeight = constraints.maxHeight / 6;
        return GridView.builder(
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 7,
            childAspectRatio: (constraints.maxWidth / 7) / cellHeight,
          ),
          itemCount: totalCells,
          itemBuilder: (context, index) {
            final date = gridDates[index];
            final isOutsideMonth = date.month != monthDate.month;
            
            // Get items for this day
            final dayItems = items.where((item) {
              return item.startTime.year == date.year &&
                     item.startTime.month == date.month &&
                     item.startTime.day == date.day;
            }).toList();

            return _buildDayCell(date, isOutsideMonth, dayItems);
          },
        );
      }
    );
  }

  Widget _buildDayCell(DateTime date, bool isOutsideMonth, List<CalendarDisplayItem> dayItems) {
    final isToday = date.year == DateTime.now().year &&
                    date.month == DateTime.now().month &&
                    date.day == DateTime.now().day;
    
    final isSelected = ref.watch(selectedDateProvider).year == date.year &&
                       ref.watch(selectedDateProvider).month == date.month &&
                       ref.watch(selectedDateProvider).day == date.day;

    return GestureDetector(
      onTap: () {
        ref.read(selectedDateProvider.notifier).state = date;
      },
      child: Container(
        decoration: BoxDecoration(
          border: Border.all(color: AppColors.lightBorder.withValues(alpha: 0.3), width: 0.5),
          color: isSelected ? AppColors.accentCyan.withValues(alpha: 0.1) : Colors.transparent,
        ),
        child: Column(
          children: [
            const SizedBox(height: 2),
            Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: isToday ? AppColors.accentCyan : Colors.transparent,
                shape: BoxShape.circle,
              ),
              child: Text(
                '${date.day}',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: isToday || isSelected ? FontWeight.bold : FontWeight.normal,
                  color: isToday
                      ? Colors.white
                      : (isOutsideMonth ? Colors.grey : null),
                ),
              ),
            ),
            const SizedBox(height: 2),
            Expanded(
              child: ListView.builder(
                physics: const NeverScrollableScrollPhysics(),
                itemCount: dayItems.length > 3 ? 3 : dayItems.length,
                itemBuilder: (context, idx) {
                  if (idx == 2 && dayItems.length > 3) {
                    return Text('+${dayItems.length - 2} more', style: const TextStyle(fontSize: 8, color: Colors.grey));
                  }
                  final item = dayItems[idx];
                  return GestureDetector(
                    onTap: () async {
                      if (item.type == CalendarItemType.task) {
                        final tasks = await ref.read(allTasksStreamProvider.future);
                        final task = tasks.firstWhere((t) => t.id == item.sourceId);
                        showModalBottomSheet(
                          context: context,
                          isScrollControlled: true,
                          backgroundColor: Colors.transparent,
                          builder: (context) => TaskFormSheet(task: task),
                        );
                      } else if (item.type == CalendarItemType.event || item.type == CalendarItemType.birthday || item.type == CalendarItemType.holiday) {
                         // TODO handle event open
                      }
                    },
                    child: Container(
                      margin: const EdgeInsets.symmetric(horizontal: 2, vertical: 1),
                      padding: const EdgeInsets.symmetric(horizontal: 2),
                      decoration: BoxDecoration(
                        color: item.color.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(2),
                      ),
                      child: Text(
                        item.title,
                        style: TextStyle(
                          fontSize: 8,
                          color: item.color,
                          decoration: item.isCompleted ? TextDecoration.lineThrough : null,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
