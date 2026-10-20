import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:uuid/uuid.dart';
import 'package:drift/drift.dart' as drift;
import '../../../core/database/app_database.dart';
import '../../../core/providers/core_providers.dart';
import '../../../core/theme/app_colors.dart';
import '../domain/models/calendar_display_item.dart';
import '../providers/calendar_providers.dart';
import 'quick_create_sheet.dart';
import 'event_editor_screen.dart';

class CalendarDrawer extends ConsumerStatefulWidget {
  const CalendarDrawer({super.key});

  @override
  ConsumerState<CalendarDrawer> createState() => _CalendarDrawerState();
}

class _CalendarDrawerState extends ConsumerState<CalendarDrawer> {
  late DateTime _miniCalendarMonth;

  @override
  void initState() {
    super.initState();
    final selected = ref.read(selectedDateProvider);
    _miniCalendarMonth = DateTime(selected.year, selected.month, 1);
  }

  void _prevMiniMonth() {
    setState(() {
      _miniCalendarMonth = DateTime(_miniCalendarMonth.year, _miniCalendarMonth.month - 1, 1);
    });
  }

  void _nextMiniMonth() {
    setState(() {
      _miniCalendarMonth = DateTime(_miniCalendarMonth.year, _miniCalendarMonth.month + 1, 1);
    });
  }

  void _showCreateDropdown(BuildContext context) {
    final selectedDate = ref.read(selectedDateProvider);
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => QuickCreateSheet(initialDate: selectedDate),
    );
  }

  Future<void> _seedDemoData() async {
    final db = ref.read(databaseProvider);
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final nowUtc = now.toUtc().millisecondsSinceEpoch;

    final demoItems = [
      // 1. Team Standup with Google Meet
      CalendarEventsCompanion(
        id: drift.Value(const Uuid().v4()),
        title: const drift.Value('Daily Engineering Standup'),
        description: const drift.Value('Daily sync with team.\nMeeting Link: https://meet.chronos.io/eng-standup-482\n[RSVP: yes]'),
        startTimeUtc: drift.Value(today.add(const Duration(hours: 10)).toUtc().millisecondsSinceEpoch),
        endTimeUtc: drift.Value(today.add(const Duration(hours: 10, minutes: 45)).toUtc().millisecondsSinceEpoch),
        isAllDay: const drift.Value(false),
        location: const drift.Value('Virtual - Chronos Meet'),
        colorValue: drift.Value(AppColors.accentCyan.value),
        eventType: const drift.Value('event'),
        createdAtUtc: drift.Value(nowUtc),
        updatedAtUtc: drift.Value(nowUtc),
      ),
      // 2. Focus Time
      CalendarEventsCompanion(
        id: drift.Value(const Uuid().v4()),
        title: const drift.Value('Deep Work: Architecture Design'),
        description: const drift.Value('Focus session - silencing Slack & emails.'),
        startTimeUtc: drift.Value(today.add(const Duration(hours: 14)).toUtc().millisecondsSinceEpoch),
        endTimeUtc: drift.Value(today.add(const Duration(hours: 16)).toUtc().millisecondsSinceEpoch),
        isAllDay: const drift.Value(false),
        location: const drift.Value('Personal Office'),
        colorValue: drift.Value(Colors.indigo.value),
        eventType: const drift.Value('focus_time'),
        createdAtUtc: drift.Value(nowUtc),
        updatedAtUtc: drift.Value(nowUtc),
      ),
      // 3. Out of Office tomorrow afternoon
      CalendarEventsCompanion(
        id: drift.Value(const Uuid().v4()),
        title: const drift.Value('Out of Office - Personal Leave'),
        description: const drift.Value('Doctor appointment and personal errand. Auto-declines incoming calls.'),
        startTimeUtc: drift.Value(today.add(const Duration(days: 1, hours: 13)).toUtc().millisecondsSinceEpoch),
        endTimeUtc: drift.Value(today.add(const Duration(days: 1, hours: 18)).toUtc().millisecondsSinceEpoch),
        isAllDay: const drift.Value(false),
        location: const drift.Value('Away'),
        colorValue: drift.Value(Colors.purple.value),
        eventType: const drift.Value('out_of_office'),
        createdAtUtc: drift.Value(nowUtc),
        updatedAtUtc: drift.Value(nowUtc),
      ),
      // 4. Working from Home
      CalendarEventsCompanion(
        id: drift.Value(const Uuid().v4()),
        title: const drift.Value('Working from Home'),
        description: const drift.Value('Home Office location indicator'),
        startTimeUtc: drift.Value(today.toUtc().millisecondsSinceEpoch),
        endTimeUtc: drift.Value(today.add(const Duration(hours: 23)).toUtc().millisecondsSinceEpoch),
        isAllDay: const drift.Value(true),
        location: const drift.Value('Home'),
        colorValue: drift.Value(Colors.teal.value),
        eventType: const drift.Value('working_location'),
        createdAtUtc: drift.Value(nowUtc),
        updatedAtUtc: drift.Value(nowUtc),
      ),
      // 5. Appointment Schedule
      CalendarEventsCompanion(
        id: drift.Value(const Uuid().v4()),
        title: const drift.Value('Office Hours / 1-on-1 Mentorship'),
        description: const drift.Value('30-minute booking slots open to team members.'),
        startTimeUtc: drift.Value(today.add(const Duration(days: 2, hours: 15)).toUtc().millisecondsSinceEpoch),
        endTimeUtc: drift.Value(today.add(const Duration(days: 2, hours: 17)).toUtc().millisecondsSinceEpoch),
        isAllDay: const drift.Value(false),
        location: const drift.Value('https://chronos.io/book/mentorship'),
        colorValue: drift.Value(Colors.pink.value),
        eventType: const drift.Value('appointment_schedule'),
        createdAtUtc: drift.Value(nowUtc),
        updatedAtUtc: drift.Value(nowUtc),
      ),
    ];

    for (final item in demoItems) {
      await db.calendarDao.insertEvent(item);
    }

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Demo events loaded: Standup, Focus Time, Out of Office, Working Location, Appointments')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final selectedDate = ref.watch(selectedDateProvider);
    final visibleCals = ref.watch(visibleCalendarsProvider);

    return Drawer(
      backgroundColor: theme.scaffoldBackgroundColor,
      child: SafeArea(
        child: Column(
          children: [
            // Drawer Top Branding
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 12),
              child: Row(
                children: [
                  Container(
                    width: 38,
                    height: 38,
                    decoration: BoxDecoration(
                      color: AppColors.accentCyan.withOpacity(0.18),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Icon(Icons.calendar_month_rounded, color: AppColors.accentCyan, size: 24),
                  ),
                  const SizedBox(width: 12),
                  const Text(
                    'Chronos',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 0.5,
                    ),
                  ),
                  const Spacer(),
                  IconButton(
                    icon: const Icon(Icons.menu_open_rounded),
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                ],
              ),
            ),

            // "+ Create" Big Pill Button
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: SizedBox(
                width: double.infinity,
                child: FilledButton.icon(
                  icon: const Icon(Icons.add, size: 22, color: Colors.white),
                  label: const Text(
                    'Create',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                  style: FilledButton.styleFrom(
                    backgroundColor: AppColors.accentCyan,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    elevation: 3,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
                  ),
                  onPressed: () => _showCreateDropdown(context),
                ),
              ),
            ),

            const SizedBox(height: 8),

            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                children: [
                  // Mini Month Calendar
                  _buildMiniMonthCalendar(selectedDate),

                  const SizedBox(height: 16),
                  const Divider(),

                  // "My Calendars" Collapsible Section
                  Theme(
                    data: theme.copyWith(dividerColor: Colors.transparent),
                    child: ExpansionTile(
                      initiallyExpanded: true,
                      tilePadding: EdgeInsets.zero,
                      title: const Text(
                        'My calendars',
                        style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, letterSpacing: 0.5),
                      ),
                      children: [
                        _buildCalendarCheckbox(
                          label: 'Events & Meetings',
                          key: 'events',
                          color: AppColors.accentCyan,
                          isChecked: visibleCals.contains('events'),
                        ),
                        _buildCalendarCheckbox(
                          label: 'Tasks & Reminders',
                          key: 'tasks',
                          color: AppColors.accentEmerald,
                          isChecked: visibleCals.contains('tasks'),
                        ),
                        _buildCalendarCheckbox(
                          label: 'Birthdays',
                          key: 'birthdays',
                          color: Colors.orange,
                          isChecked: visibleCals.contains('birthdays'),
                        ),
                        _buildCalendarCheckbox(
                          label: 'Finance & Transactions',
                          key: 'transactions',
                          color: AppColors.accentViolet,
                          isChecked: visibleCals.contains('transactions'),
                        ),
                      ],
                    ),
                  ),

                  // "Other Calendars" Collapsible Section
                  Theme(
                    data: theme.copyWith(dividerColor: Colors.transparent),
                    child: ExpansionTile(
                      initiallyExpanded: true,
                      tilePadding: EdgeInsets.zero,
                      title: const Text(
                        'Other calendars',
                        style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, letterSpacing: 0.5),
                      ),
                      children: [
                        _buildCalendarCheckbox(
                          label: 'Holidays',
                          key: 'holidays',
                          color: Colors.teal,
                          isChecked: visibleCals.contains('holidays'),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 12),
                  const Divider(),

                  // Quick Demo Data Button
                  ListTile(
                    contentPadding: EdgeInsets.zero,
                    leading: const CircleAvatar(
                      radius: 16,
                      backgroundColor: Colors.amber,
                      child: Icon(Icons.auto_awesome, color: Colors.white, size: 16),
                    ),
                    title: const Text('Load Demo Events', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                    subtitle: const Text('Add Google Calendar sample entries', style: TextStyle(fontSize: 11)),
                    onTap: _seedDemoData,
                  ),

                  const SizedBox(height: 20),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMiniMonthCalendar(DateTime selectedDate) {
    final year = _miniCalendarMonth.year;
    final month = _miniCalendarMonth.month;
    final firstDayOfMonth = DateTime(year, month, 1);
    final daysInMonth = DateUtils.getDaysInMonth(year, month);
    final firstWeekday = firstDayOfMonth.weekday % 7; // Sunday = 0

    final now = DateTime.now();
    final isCurrentMonth = now.year == year && now.month == month;

    final weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.withOpacity(0.15)),
      ),
      child: Column(
        children: [
          // Header: Month Year + Chevrons
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                DateFormat('MMMM yyyy').format(_miniCalendarMonth),
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
              ),
              Row(
                children: [
                  InkWell(
                    onTap: _prevMiniMonth,
                    borderRadius: BorderRadius.circular(12),
                    child: const Padding(
                      padding: EdgeInsets.all(4),
                      child: Icon(Icons.chevron_left, size: 20),
                    ),
                  ),
                  InkWell(
                    onTap: _nextMiniMonth,
                    borderRadius: BorderRadius.circular(12),
                    child: const Padding(
                      padding: EdgeInsets.all(4),
                      child: Icon(Icons.chevron_right, size: 20),
                    ),
                  ),
                ],
              ),
            ],
          ),

          const SizedBox(height: 8),

          // Weekday letters
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: weekdays.map((w) {
              return SizedBox(
                width: 24,
                child: Center(
                  child: Text(
                    w,
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: Colors.grey.withOpacity(0.8),
                    ),
                  ),
                ),
              );
            }).toList(),
          ),

          const SizedBox(height: 6),

          // Days Grid (6 rows x 7 cols)
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: 42,
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 7,
              mainAxisSpacing: 2,
              crossAxisSpacing: 2,
            ),
            itemBuilder: (context, index) {
              final dayOffset = index - firstWeekday;
              if (dayOffset < 0 || dayOffset >= daysInMonth) {
                return const SizedBox();
              }

              final dayNum = dayOffset + 1;
              final cellDate = DateTime(year, month, dayNum);
              final isToday = isCurrentMonth && now.day == dayNum;
              final isSelected = selectedDate.year == year && selectedDate.month == month && selectedDate.day == dayNum;

              return InkWell(
                onTap: () {
                  ref.read(selectedDateProvider.notifier).state = cellDate;
                },
                borderRadius: BorderRadius.circular(16),
                child: Container(
                  decoration: BoxDecoration(
                    color: isSelected ? AppColors.accentCyan : (isToday ? AppColors.accentCyan.withOpacity(0.2) : null),
                    shape: BoxShape.circle,
                  ),
                  child: Center(
                    child: Text(
                      '$dayNum',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: (isToday || isSelected) ? FontWeight.bold : FontWeight.normal,
                        color: isSelected
                            ? Colors.white
                            : (isToday ? AppColors.accentCyan : null),
                      ),
                    ),
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildCalendarCheckbox({
    required String label,
    required String key,
    required Color color,
    required bool isChecked,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Row(
        children: [
          Checkbox(
            value: isChecked,
            activeColor: color,
            visualDensity: VisualDensity.compact,
            onChanged: (val) {
              final currentSet = Set<String>.from(ref.read(visibleCalendarsProvider));
              if (val == true) {
                currentSet.add(key);
              } else {
                currentSet.remove(key);
              }
              ref.read(visibleCalendarsProvider.notifier).state = currentSet;
            },
          ),
          Container(
            width: 10,
            height: 10,
            decoration: BoxDecoration(
              color: color,
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              label,
              style: const TextStyle(fontSize: 13),
            ),
          ),
        ],
      ),
    );
  }
}
