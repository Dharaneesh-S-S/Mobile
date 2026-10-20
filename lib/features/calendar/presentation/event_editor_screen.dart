import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:uuid/uuid.dart';
import 'package:drift/drift.dart' as drift;
import '../../../core/database/app_database.dart';
import '../../../core/providers/core_providers.dart';
import '../../../core/notifications/notification_service.dart';
import '../../calendar/domain/models/calendar_display_item.dart';
import '../../../core/theme/app_colors.dart';
import '../../tasks/providers/tasks_providers.dart';

class EventEditorScreen extends ConsumerStatefulWidget {
  final CalendarEventEntry? existingEvent;
  final DateTime? initialDate;
  final CalendarItemType? initialType;

  const EventEditorScreen({
    super.key,
    this.existingEvent,
    this.initialDate,
    this.initialType,
  });

  @override
  ConsumerState<EventEditorScreen> createState() => _EventEditorScreenState();
}

class _EventEditorScreenState extends ConsumerState<EventEditorScreen> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _titleController;
  late TextEditingController _descController;
  late TextEditingController _locationController;

  bool _isAllDay = false;
  late DateTime _startDate;
  late TimeOfDay _startTime;
  late DateTime _endDate;
  late TimeOfDay _endTime;

  CalendarItemType _eventType = CalendarItemType.event;
  Color _selectedColor = AppColors.accentCyan;
  int? _reminderMinutes;
  String? _selectedTaskListId;
  String _recurrenceRule = 'Does not repeat';
  bool _hasVideoCall = false;
  String _workingLocationChoice = 'Office';
  bool _autoDeclineOoo = true;

  final List<Color> _availableColors = [
    AppColors.accentCyan,
    AppColors.accentViolet,
    AppColors.accentEmerald,
    AppColors.lightError,
    Colors.orange,
    Colors.pink,
    Colors.indigo,
    Colors.teal,
    Colors.amber,
    Colors.purple,
  ];

  @override
  void initState() {
    super.initState();
    final e = widget.existingEvent;
    _titleController = TextEditingController(text: e?.title ?? '');
    _descController = TextEditingController(text: e?.description ?? '');
    _locationController = TextEditingController(text: e?.location ?? '');

    _isAllDay = e?.isAllDay ?? false;
    _recurrenceRule = e?.recurrenceRule ?? 'Does not repeat';

    if (e?.description != null && e!.description!.contains('meet.chronos.io')) {
      _hasVideoCall = true;
    }

    final baseDate = widget.initialDate ?? DateTime.now();
    if (e != null) {
      final start = DateTime.fromMillisecondsSinceEpoch(e.startTimeUtc, isUtc: true).toLocal();
      final end = DateTime.fromMillisecondsSinceEpoch(e.endTimeUtc, isUtc: true).toLocal();
      _startDate = start;
      _startTime = TimeOfDay.fromDateTime(start);
      _endDate = end;
      _endTime = TimeOfDay.fromDateTime(end);
      _selectedColor = e.colorValue != null ? Color(e.colorValue!) : AppColors.accentCyan;

      if (e.eventType == 'birthday') {
        _eventType = CalendarItemType.birthday;
      } else if (e.eventType == 'holiday') {
        _eventType = CalendarItemType.holiday;
      } else if (e.eventType == 'out_of_office') {
        _eventType = CalendarItemType.outOfOffice;
      } else if (e.eventType == 'focus_time') {
        _eventType = CalendarItemType.focusTime;
      } else if (e.eventType == 'working_location') {
        _eventType = CalendarItemType.workingLocation;
        if (e.location != null && ['Office', 'Home', 'Elsewhere'].contains(e.location)) {
          _workingLocationChoice = e.location!;
        }
      } else if (e.eventType == 'appointment_schedule') {
        _eventType = CalendarItemType.appointmentSchedule;
      } else {
        _eventType = CalendarItemType.event;
      }

      if (e.reminderOffsets != null && e.reminderOffsets!.isNotEmpty) {
        if (e.reminderOffsets!.contains('15')) {
          _reminderMinutes = 15;
        } else if (e.reminderOffsets!.contains('60')) {
          _reminderMinutes = 60;
        } else if (e.reminderOffsets!.contains('1440')) {
          _reminderMinutes = 1440;
        }
      }
    } else {
      final start = baseDate.add(const Duration(hours: 1));
      final end = baseDate.add(const Duration(hours: 2));
      _startDate = DateTime(start.year, start.month, start.day);
      _startTime = TimeOfDay(hour: start.hour, minute: 0);
      _endDate = DateTime(end.year, end.month, end.day);
      _endTime = TimeOfDay(hour: end.hour, minute: 0);
      if (widget.initialType != null) {
        _eventType = widget.initialType!;
        _applyTypeDefaults(_eventType);
      }
    }
  }

  void _applyTypeDefaults(CalendarItemType type) {
    switch (type) {
      case CalendarItemType.outOfOffice:
        _selectedColor = Colors.purple;
        break;
      case CalendarItemType.focusTime:
        _selectedColor = Colors.indigo;
        break;
      case CalendarItemType.workingLocation:
        _selectedColor = Colors.teal;
        _isAllDay = true;
        break;
      case CalendarItemType.appointmentSchedule:
        _selectedColor = Colors.pink;
        break;
      default:
        break;
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descController.dispose();
    _locationController.dispose();
    super.dispose();
  }

  Future<void> _saveEvent() async {
    if (!_formKey.currentState!.validate()) return;

    try {
      if (_eventType == CalendarItemType.task) {
        final dueDateTime = DateTime(
          _startDate.year,
          _startDate.month,
          _startDate.day,
          _isAllDay ? 9 : _startTime.hour,
          _isAllDay ? 0 : _startTime.minute,
        );

        final taskService = ref.read(taskServiceProvider);
        final lists = ref.read(taskListsStreamProvider).valueOrNull ?? [];
        final targetListId = _selectedTaskListId != null && lists.any((l) => l.id == _selectedTaskListId)
            ? _selectedTaskListId
            : (lists.isNotEmpty ? lists.first.id : null);

        await taskService.createTask(
          title: _titleController.text.trim(),
          description: _descController.text.trim().isEmpty ? null : _descController.text.trim(),
          listId: targetListId,
          dueDate: dueDateTime,
          hasTime: !_isAllDay,
        );

        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Task saved successfully!'), duration: Duration(milliseconds: 1200)),
          );
          Navigator.pop(context);
        }
        return;
      }

      final startUtc = DateTime(
        _startDate.year,
        _startDate.month,
        _startDate.day,
        _isAllDay ? 0 : _startTime.hour,
        _isAllDay ? 0 : _startTime.minute,
      ).toUtc().millisecondsSinceEpoch;

      final endUtc = DateTime(
        _endDate.year,
        _endDate.month,
        _endDate.day,
        _isAllDay ? 23 : _endTime.hour,
        _isAllDay ? 59 : _endTime.minute,
      ).toUtc().millisecondsSinceEpoch;

      if (endUtc <= startUtc && !_isAllDay) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('End time must be after start time')));
        return;
      }

      String eventTypeStr = 'event';
      switch (_eventType) {
        case CalendarItemType.outOfOffice:
          eventTypeStr = 'out_of_office';
          break;
        case CalendarItemType.focusTime:
          eventTypeStr = 'focus_time';
          break;
        case CalendarItemType.workingLocation:
          eventTypeStr = 'working_location';
          break;
        case CalendarItemType.appointmentSchedule:
          eventTypeStr = 'appointment_schedule';
          break;
        case CalendarItemType.birthday:
          eventTypeStr = 'birthday';
          break;
        case CalendarItemType.holiday:
          eventTypeStr = 'holiday';
          break;
        default:
          eventTypeStr = 'event';
      }

      String? fullDescription = _descController.text.trim();
      if (_hasVideoCall && !fullDescription.contains('meet.chronos.io')) {
        final meetId = const Uuid().v4().substring(0, 8);
        final meetUrl = 'https://meet.chronos.io/$meetId';
        fullDescription = fullDescription.isEmpty ? 'Video Call: $meetUrl' : '$fullDescription\nVideo Call: $meetUrl';
      }

      String? finalLocation = _locationController.text.trim();
      if (_eventType == CalendarItemType.workingLocation) {
        finalLocation = _workingLocationChoice;
      }

      final entry = CalendarEventEntry(
        id: widget.existingEvent?.id ?? const Uuid().v4(),
        title: _titleController.text.trim(),
        description: fullDescription.isEmpty ? null : fullDescription,
        startTimeUtc: startUtc,
        endTimeUtc: endUtc,
        isAllDay: _isAllDay,
        recurrenceRule: _recurrenceRule == 'Does not repeat' ? null : _recurrenceRule,
        location: finalLocation.isEmpty ? null : finalLocation,
        colorValue: _selectedColor.value,
        isCancelled: false,
        eventType: eventTypeStr,
        reminderOffsets: _reminderMinutes != null ? '[$_reminderMinutes]' : null,
        createdAtUtc: widget.existingEvent?.createdAtUtc ?? DateTime.now().toUtc().millisecondsSinceEpoch,
        updatedAtUtc: DateTime.now().toUtc().millisecondsSinceEpoch,
      );

      final db = ref.read(databaseProvider);
      if (widget.existingEvent != null) {
        await db.calendarDao.updateEvent(entry);
      } else {
        await db.calendarDao.insertEvent(
          CalendarEventsCompanion.insert(
            id: entry.id,
            title: entry.title,
            description: entry.description == null ? const drift.Value.absent() : drift.Value(entry.description),
            startTimeUtc: entry.startTimeUtc,
            endTimeUtc: entry.endTimeUtc,
            isAllDay: drift.Value(entry.isAllDay),
            recurrenceRule: entry.recurrenceRule == null ? const drift.Value.absent() : drift.Value(entry.recurrenceRule),
            location: entry.location == null ? const drift.Value.absent() : drift.Value(entry.location),
            colorValue: drift.Value(entry.colorValue),
            eventType: drift.Value(entry.eventType),
            reminderOffsets: entry.reminderOffsets == null ? const drift.Value.absent() : drift.Value(entry.reminderOffsets),
            createdAtUtc: entry.createdAtUtc,
            updatedAtUtc: entry.updatedAtUtc,
          ),
        );
      }

      // Schedule or Cancel Notification
      final notifId = entry.id.hashCode;
      if (_reminderMinutes != null) {
        final reminderTime = startUtc - (_reminderMinutes! * 60000);
        try {
          await NotificationService.instance.scheduleNotification(
            id: notifId,
            title: entry.title,
            body: 'Upcoming ${_eventType.name} in $_reminderMinutes minutes',
            scheduledUtcMillis: reminderTime,
          );
        } catch (_) {}
      } else {
        try {
          await NotificationService.instance.cancelNotification(notifId);
        } catch (_) {}
      }

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Saved successfully!'), duration: Duration(milliseconds: 1200)),
        );
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to save: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final taskLists = ref.watch(taskListsStreamProvider).valueOrNull ?? [];

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.close),
          tooltip: 'Close',
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(widget.existingEvent == null
            ? 'New ${_eventType.name}'
            : 'Edit ${_eventType.name}'),
        actions: [
          if (widget.existingEvent != null)
            IconButton(
              icon: const Icon(Icons.copy),
              tooltip: 'Duplicate Event',
              onPressed: () {
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(
                    builder: (context) => EventEditorScreen(
                      existingEvent: widget.existingEvent!.copyWith(
                        id: const Uuid().v4(),
                        title: '${widget.existingEvent!.title} (Copy)',
                      ),
                    ),
                  ),
                );
              },
            ),
          FilledButton(
            onPressed: _saveEvent,
            style: FilledButton.styleFrom(
              backgroundColor: AppColors.accentCyan,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            ),
            child: const Text('Save', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // Title
            TextFormField(
              controller: _titleController,
              decoration: InputDecoration(
                labelText: _eventType == CalendarItemType.task ? 'Task Title' : 'Title',
                border: const OutlineInputBorder(),
                prefixIcon: const Icon(Icons.title),
              ),
              validator: (v) => v!.trim().isEmpty ? 'Required' : null,
            ),
            const SizedBox(height: 16),

            // Item Type Selector
            DropdownButtonFormField<CalendarItemType>(
              value: _eventType,
              decoration: const InputDecoration(labelText: 'Type', border: OutlineInputBorder(), prefixIcon: Icon(Icons.category_outlined)),
              items: const [
                DropdownMenuItem(value: CalendarItemType.event, child: Text('Event / Meeting')),
                DropdownMenuItem(value: CalendarItemType.task, child: Text('Task')),
                DropdownMenuItem(value: CalendarItemType.outOfOffice, child: Text('Out of Office')),
                DropdownMenuItem(value: CalendarItemType.focusTime, child: Text('Focus Time')),
                DropdownMenuItem(value: CalendarItemType.workingLocation, child: Text('Working Location')),
                DropdownMenuItem(value: CalendarItemType.appointmentSchedule, child: Text('Appointment Schedule')),
                DropdownMenuItem(value: CalendarItemType.birthday, child: Text('Birthday')),
                DropdownMenuItem(value: CalendarItemType.holiday, child: Text('Holiday')),
              ],
              onChanged: (v) {
                if (v != null) {
                  setState(() {
                    _eventType = v;
                    _applyTypeDefaults(v);
                  });
                }
              },
            ),
            const SizedBox(height: 16),

            // Task List selector (if Task)
            if (_eventType == CalendarItemType.task && taskLists.isNotEmpty) ...[
              DropdownButtonFormField<String>(
                value: _selectedTaskListId ?? taskLists.first.id,
                decoration: const InputDecoration(
                  labelText: 'Task List',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.list_alt_rounded),
                ),
                items: taskLists.map((l) => DropdownMenuItem(
                  value: l.id,
                  child: Row(
                    children: [
                      CircleAvatar(radius: 6, backgroundColor: Color(l.colorValue)),
                      const SizedBox(width: 8),
                      Text(l.title),
                    ],
                  ),
                )).toList(),
                onChanged: (v) => setState(() => _selectedTaskListId = v),
              ),
              const SizedBox(height: 16),
            ],

            // All-day Switch
            SwitchListTile(
              contentPadding: EdgeInsets.zero,
              title: Text(_eventType == CalendarItemType.task ? 'All-day / No specific time' : 'All-day'),
              value: _isAllDay,
              activeColor: AppColors.accentCyan,
              onChanged: (v) => setState(() => _isAllDay = v),
            ),

            // Start Date / Time
            ListTile(
              contentPadding: EdgeInsets.zero,
              title: Text(_eventType == CalendarItemType.task ? 'Due Date' : 'Start Date'),
              subtitle: Text(DateFormat('EEE, MMM d, yyyy').format(_startDate)),
              trailing: _isAllDay ? null : Text(_startTime.format(context), style: const TextStyle(fontWeight: FontWeight.bold)),
              leading: const Icon(Icons.calendar_today_rounded, color: AppColors.accentCyan),
              onTap: () async {
                final d = await showDatePicker(
                  context: context,
                  initialDate: _startDate,
                  firstDate: DateTime(2000),
                  lastDate: DateTime(2100),
                );
                if (d != null) {
                  setState(() => _startDate = d);
                  if (!_isAllDay) {
                    final t = await showTimePicker(context: context, initialTime: _startTime);
                    if (t != null && mounted) setState(() => _startTime = t);
                  }
                }
              },
            ),

            // End Date / Time
            if (_eventType != CalendarItemType.task) ...[
              ListTile(
                contentPadding: EdgeInsets.zero,
                title: const Text('End Date'),
                subtitle: Text(DateFormat('EEE, MMM d, yyyy').format(_endDate)),
                trailing: _isAllDay ? null : Text(_endTime.format(context), style: const TextStyle(fontWeight: FontWeight.bold)),
                leading: const Icon(Icons.event_available_rounded, color: AppColors.accentCyan),
                onTap: () async {
                  final d = await showDatePicker(
                    context: context,
                    initialDate: _endDate,
                    firstDate: DateTime(2000),
                    lastDate: DateTime(2100),
                  );
                  if (d != null) {
                    setState(() => _endDate = d);
                    if (!_isAllDay) {
                      final t = await showTimePicker(context: context, initialTime: _endTime);
                      if (t != null && mounted) setState(() => _endTime = t);
                    }
                  }
                },
              ),
              const Divider(),
            ],

            // Recurrence Dropdown
            if (_eventType != CalendarItemType.task) ...[
              DropdownButtonFormField<String>(
                value: _recurrenceRule,
                decoration: const InputDecoration(labelText: 'Repeat', prefixIcon: Icon(Icons.repeat_rounded)),
                items: const [
                  DropdownMenuItem(value: 'Does not repeat', child: Text('Does not repeat')),
                  DropdownMenuItem(value: 'Daily', child: Text('Daily')),
                  DropdownMenuItem(value: 'Weekly', child: Text('Weekly')),
                  DropdownMenuItem(value: 'Monthly', child: Text('Monthly')),
                  DropdownMenuItem(value: 'Annually', child: Text('Annually')),
                ],
                onChanged: (v) => setState(() => _recurrenceRule = v ?? 'Does not repeat'),
              ),
              const SizedBox(height: 16),
            ],

            // Video Conferencing Toggle (for Events)
            if (_eventType == CalendarItemType.event) ...[
              SwitchListTile(
                contentPadding: EdgeInsets.zero,
                title: const Text('Add Google Meet / Video Conference'),
                subtitle: const Text('Generate a secure virtual meeting link'),
                value: _hasVideoCall,
                activeColor: AppColors.accentCyan,
                onChanged: (v) => setState(() => _hasVideoCall = v),
              ),
              const SizedBox(height: 12),
            ],

            // Working Location Segmented Selector
            if (_eventType == CalendarItemType.workingLocation) ...[
              const Text('Working Location', style: TextStyle(fontWeight: FontWeight.w600)),
              const SizedBox(height: 8),
              SegmentedButton<String>(
                segments: const [
                  ButtonSegment(value: 'Office', label: Text('Office'), icon: Icon(Icons.business)),
                  ButtonSegment(value: 'Home', label: Text('Home'), icon: Icon(Icons.home)),
                  ButtonSegment(value: 'Elsewhere', label: Text('Elsewhere'), icon: Icon(Icons.place)),
                ],
                selected: {_workingLocationChoice},
                onSelectionChanged: (set) => setState(() => _workingLocationChoice = set.first),
              ),
              const SizedBox(height: 16),
            ],

            // Out of Office Auto Decline Toggle
            if (_eventType == CalendarItemType.outOfOffice) ...[
              SwitchListTile(
                contentPadding: EdgeInsets.zero,
                title: const Text('Automatically decline meetings'),
                subtitle: const Text('Decline new and existing meetings during this period'),
                value: _autoDeclineOoo,
                activeColor: Colors.purple,
                onChanged: (v) => setState(() => _autoDeclineOoo = v),
              ),
              const SizedBox(height: 12),
            ],

            // Location Input (if not workingLocation)
            if (_eventType != CalendarItemType.workingLocation && _eventType != CalendarItemType.task) ...[
              TextFormField(
                controller: _locationController,
                decoration: const InputDecoration(
                  labelText: 'Location / Room',
                  prefixIcon: Icon(Icons.location_on_outlined),
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 16),
            ],

            // Reminder Dropdown
            if (_eventType != CalendarItemType.task) ...[
              DropdownButtonFormField<int?>(
                value: _reminderMinutes,
                decoration: const InputDecoration(labelText: 'Notification Reminder', prefixIcon: Icon(Icons.notifications_outlined)),
                items: const [
                  DropdownMenuItem(value: null, child: Text('None')),
                  DropdownMenuItem(value: 0, child: Text('At time of event')),
                  DropdownMenuItem(value: 15, child: Text('15 minutes before')),
                  DropdownMenuItem(value: 60, child: Text('1 hour before')),
                  DropdownMenuItem(value: 1440, child: Text('1 day before')),
                ],
                onChanged: (v) => setState(() => _reminderMinutes = v),
              ),
              const SizedBox(height: 16),
            ],

            // Description / Notes
            TextFormField(
              controller: _descController,
              decoration: const InputDecoration(
                labelText: 'Description / Notes',
                prefixIcon: Icon(Icons.description_outlined),
                border: OutlineInputBorder(),
              ),
              maxLines: 3,
            ),
            const SizedBox(height: 16),

            // Color Swatches
            if (_eventType != CalendarItemType.task) ...[
              const Text('Color', style: TextStyle(fontWeight: FontWeight.w600)),
              const SizedBox(height: 8),
              Wrap(
                spacing: 10,
                runSpacing: 10,
                children: _availableColors.map((c) => GestureDetector(
                  onTap: () => setState(() => _selectedColor = c),
                  child: Container(
                    width: 38,
                    height: 38,
                    decoration: BoxDecoration(
                      color: c,
                      shape: BoxShape.circle,
                      border: _selectedColor == c ? Border.all(color: Colors.white, width: 3) : null,
                      boxShadow: [
                        if (_selectedColor == c)
                          BoxShadow(color: c.withOpacity(0.5), blurRadius: 6, spreadRadius: 1),
                      ],
                    ),
                    child: _selectedColor == c ? const Icon(Icons.check, color: Colors.white, size: 20) : null,
                  ),
                )).toList(),
              ),
            ],

            if (widget.existingEvent != null) ...[
              const SizedBox(height: 32),
              OutlinedButton.icon(
                style: OutlinedButton.styleFrom(
                  foregroundColor: AppColors.lightError,
                  side: const BorderSide(color: AppColors.lightError),
                  padding: const EdgeInsets.symmetric(vertical: 12),
                ),
                icon: const Icon(Icons.delete_outline),
                label: const Text('Delete Event'),
                onPressed: () async {
                  await ref.read(databaseProvider).calendarDao.deleteEvent(widget.existingEvent!.id);
                  await NotificationService.instance.cancelNotification(widget.existingEvent!.id.hashCode);
                  if (mounted) Navigator.pop(context);
                },
              ),
            ],
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}
