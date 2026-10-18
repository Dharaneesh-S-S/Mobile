import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/calendar_providers.dart';
import '../../domain/models/calendar_display_item.dart';
import '../../../../core/theme/app_colors.dart';

class YearView extends ConsumerStatefulWidget {
  const YearView({super.key});

  @override
  ConsumerState<YearView> createState() => _YearViewState();
}

class _YearViewState extends ConsumerState<YearView> {
  late int _selectedYear;

  @override
  void initState() {
    super.initState();
    _selectedYear = ref.read(selectedDateProvider).year;
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final items = ref.watch(calendarItemsProvider);
    final selectedDate = ref.watch(selectedDateProvider);

    return Column(
      children: [
        // Year Selector Header
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              IconButton(
                icon: const Icon(Icons.chevron_left_rounded),
                onPressed: () => setState(() => _selectedYear--),
              ),
              Text(
                '$_selectedYear',
                style: theme.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold),
              ),
              IconButton(
                icon: const Icon(Icons.chevron_right_rounded),
                onPressed: () => setState(() => _selectedYear++),
              ),
            ],
          ),
        ),
        const Divider(height: 1),
        // 12 Months Grid
        Expanded(
          child: GridView.builder(
            padding: const EdgeInsets.all(12),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              mainAxisSpacing: 16,
              crossAxisSpacing: 16,
              childAspectRatio: 0.95,
            ),
            itemCount: 12,
            itemBuilder: (context, monthIndex) {
              final month = monthIndex + 1;
              return _buildMiniMonthCard(month, selectedDate, items, theme);
            },
          ),
        ),
      ],
    );
  }

  Widget _buildMiniMonthCard(
    int month,
    DateTime selectedDate,
    List<CalendarDisplayItem> items,
    ThemeData theme,
  ) {
    final monthName = _getMonthName(month);
    final daysInMonth = DateTime(_selectedYear, month + 1, 0).day;
    final firstWeekday = DateTime(_selectedYear, month, 1).weekday % 7; // Sunday = 0

    final now = DateTime.now();

    return InkWell(
      borderRadius: BorderRadius.circular(12),
      onTap: () {
        // Switch to Month View for this month
        final newDate = DateTime(_selectedYear, month, 1);
        ref.read(selectedDateProvider.notifier).state = newDate;
        ref.read(currentViewProvider.notifier).state = CalendarViewType.month;
      },
      child: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: theme.colorScheme.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: theme.dividerColor.withOpacity(0.4)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              monthName,
              style: theme.textTheme.titleSmall?.copyWith(
                fontWeight: FontWeight.bold,
                color: theme.colorScheme.primary,
              ),
            ),
            const SizedBox(height: 6),
            // Days of week row
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => Text(
                d,
                style: TextStyle(
                  fontSize: 9,
                  fontWeight: FontWeight.w600,
                  color: theme.colorScheme.onSurface.withOpacity(0.4),
                ),
              )).toList(),
            ),
            const SizedBox(height: 4),
            // Mini days grid
            Expanded(
              child: GridView.builder(
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 7,
                  childAspectRatio: 1.0,
                ),
                itemCount: 35, // 5 rows
                itemBuilder: (context, cellIndex) {
                  final dayNumber = cellIndex - firstWeekday + 1;
                  if (dayNumber < 1 || dayNumber > daysInMonth) {
                    return const SizedBox.shrink();
                  }

                  final isToday = _selectedYear == now.year && month == now.month && dayNumber == now.day;
                  final hasItems = items.any((i) =>
                      i.startTime.year == _selectedYear &&
                      i.startTime.month == month &&
                      i.startTime.day == dayNumber);

                  return Center(
                    child: Container(
                      width: 18,
                      height: 18,
                      alignment: Alignment.center,
                      decoration: BoxDecoration(
                        color: isToday
                            ? AppColors.accentCyan
                            : (hasItems ? theme.colorScheme.primary.withOpacity(0.15) : Colors.transparent),
                        shape: BoxShape.circle,
                      ),
                      child: Text(
                        '$dayNumber',
                        style: TextStyle(
                          fontSize: 9,
                          fontWeight: (isToday || hasItems) ? FontWeight.bold : FontWeight.w500,
                          color: isToday
                              ? Colors.white
                              : (hasItems
                                  ? theme.colorScheme.primary
                                  : theme.colorScheme.onSurface),
                        ),
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

  String _getMonthName(int month) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1];
  }
}
