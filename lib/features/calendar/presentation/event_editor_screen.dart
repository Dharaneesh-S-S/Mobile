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
  
  bool _isAllDay = false;
  late DateTime _startDate;
  late TimeOfDay _startTime;
  late DateTime _endDate;
  late TimeOfDay _endTime;
  
  CalendarItemType _eventType = CalendarItemType.event;
  Color _selectedColor = AppColors.accentCyan;
  int? _reminderMinutes;
  String? _selectedTaskListId;

  final List<Color> _availableColors = [
    AppColors.accentCyan,
    AppColors.accentViolet,
    AppColors.accentEmerald,
    AppColors.lightError,
    Colors.orange,
    Colors.pink,
  ];

  @override
  void initState() {
    super.initState();
    final e = widget.existingEvent;
    _titleController = TextEditingController(text: e?.title ?? '');
    _descController = TextEditingController(text: e?.description ?? '');
    
    _isAllDay = e?.isAllDay ?? false;
    
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
      _startDate = baseDate;
      _startTime = TimeOfDay(hour: baseDate.hour + 1, minute: 0);
      _endDate = baseDate;
      _endTime = TimeOfDay(hour: baseDate.hour + 2, minute: 0);
      if (widget.initialType != null) {
        _eventType = widget.initialType!;
      }
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descController.dispose();
    super.dispose();
  }

  Future<void> _saveEvent() async {
    if (!_formKey.currentState!.validate()) return;

    if (_eventType == CalendarItemType.task) {
      // Map directly to Tasks feature!
      final dueDateTime = DateTime(
        _startDate.year,
        _startDate.month,
        _startDate.day,
        _isAllDay ? 9 : _startTime.hour,
        _isAllDay ? 0 : _startTime.minute,
      );

      final taskService = ref.read(taskServiceProvider);
      final lists = ref.read(taskListsStreamProvider).valueOrNull ?? [];
      final targetListId = _selectedTaskListId ?? (lists.isNotEmpty ? lists.first.id : null);

      await taskService.createTask(
        title: _titleController.text.trim(),
        description: _descController.text.trim().isEmpty ? null : _descController.text.trim(),
        listId: targetListId,
        dueDate: dueDateTime,
        hasTime: !_isAllDay,
      );

      if (mounted) Navigator.pop(context);
      return;
    }

    final startUtc = DateTime(
      _startDate.year, _startDate.month, _startDate.day,
      _isAllDay ? 0 : _startTime.hour, _isAllDay ? 0 : _startTime.minute,
    ).toUtc().millisecondsSinceEpoch;

    final endUtc = DateTime(
      _endDate.year, _endDate.month, _endDate.day,
      _isAllDay ? 23 : _endTime.hour, _isAllDay ? 59 : _endTime.minute,
    ).toUtc().millisecondsSinceEpoch;

    if (endUtc <= startUtc) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('End time must be after start time')));
      return;
    }

    String eventTypeStr = 'event';
    if (_eventType == CalendarItemType.birthday) eventTypeStr = 'birthday';
    if (_eventType == CalendarItemType.holiday) eventTypeStr = 'holiday';

    final entry = CalendarEventEntry(
      id: widget.existingEvent?.id ?? const Uuid().v4(),
      title: _titleController.text.trim(),
      description: _descController.text.trim().isEmpty ? null : _descController.text.trim(),
      startTimeUtc: startUtc,
      endTimeUtc: endUtc,
      isAllDay: _isAllDay,
      recurrenceRule: null, 
      location: null, // Location field removed per request
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
        await NotificationService.instance.requestNotificationPermissions();
        await NotificationService.instance.requestExactAlarmPermission();
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

    if (mounted) Navigator.pop(context);
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
            ? (_eventType == CalendarItemType.task ? 'New Task' : 'New Event')
            : 'Edit ${_eventType.name.toUpperCase()}'),
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
          TextButton(
            onPressed: _saveEvent,
            child: const Text('Save', style: TextStyle(fontWeight: FontWeight.bold)),
          ),
        ],
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            TextFormField(
              controller: _titleController,
              decoration: InputDecoration(
                labelText: _eventType == CalendarItemType.task ? 'Task Title' : 'Title',
                border: const OutlineInputBorder(),
              ),
              validator: (v) => v!.trim().isEmpty ? 'Required' : null,
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<CalendarItemType>(
              value: _eventType,
              decoration: const InputDecoration(labelText: 'Type', border: OutlineInputBorder()),
              items: const [
                DropdownMenuItem(value: CalendarItemType.event, child: Text('Event')),
                DropdownMenuItem(value: CalendarItemType.task, child: Text('Task (Mapped to Tasks)')),
                DropdownMenuItem(value: CalendarItemType.birthday, child: Text('Birthday')),
                DropdownMenuItem(value: CalendarItemType.holiday, child: Text('Holiday')),
              ],
              onChanged: (v) {
                if (v != null) {
                  setState(() => _eventType = v);
                }
              },
            ),
            const SizedBox(height: 16),
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
            SwitchListTile(
              title: Text(_eventType == CalendarItemType.task ? 'All-day / No specific time' : 'All-day'),
              value: _isAllDay,
              onChanged: (v) => setState(() => _isAllDay = v),
            ),
            ListTile(
              title: Text(_eventType == CalendarItemType.task ? 'Due Date' : 'Start Date'),
              subtitle: Text(DateFormat('EEE, MMM d, yyyy').format(_startDate)),
              trailing: _isAllDay ? null : Text(_startTime.format(context), style: const TextStyle(fontWeight: FontWeight.bold)),
              leading: const Icon(Icons.calendar_today_rounded),
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
            if (_eventType != CalendarItemType.task) ...[
              ListTile(
                title: const Text('End Date'),
                subtitle: Text(DateFormat('EEE, MMM d, yyyy').format(_endDate)),
                trailing: _isAllDay ? null : Text(_endTime.format(context), style: const TextStyle(fontWeight: FontWeight.bold)),
                leading: const Icon(Icons.event_available_rounded),
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
              DropdownButtonFormField<int?>(
                value: _reminderMinutes,
                decoration: const InputDecoration(labelText: 'Reminder', prefixIcon: Icon(Icons.notifications)),
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
            TextFormField(
              controller: _descController,
              decoration: const InputDecoration(
                labelText: 'Description / Notes',
                prefixIcon: Icon(Icons.description),
                border: OutlineInputBorder(),
              ),
              maxLines: 3,
            ),
            if (_eventType != CalendarItemType.task) ...[
              const SizedBox(height: 16),
              const Text('Color', style: TextStyle(fontWeight: FontWeight.w600)),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                children: _availableColors.map((c) => GestureDetector(
                  onTap: () => setState(() => _selectedColor = c),
                  child: Container(
                    width: 36,
                    height: 36,
                    decoration: BoxDecoration(
                      color: c,
                      shape: BoxShape.circle,
                      border: _selectedColor == c ? Border.all(color: Colors.white, width: 3) : null,
                      boxShadow: [
                        if (_selectedColor == c)
                          BoxShadow(color: c.withOpacity(0.5), blurRadius: 6, spreadRadius: 1),
                      ],
                    ),
                  ),
                )).toList(),
              ),
            ],
            if (widget.existingEvent != null) ...[
              const SizedBox(height: 32),
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(backgroundColor: AppColors.lightError, foregroundColor: Colors.white),
                icon: const Icon(Icons.delete),
                label: const Text('Delete Event'),
                onPressed: () async {
                  await ref.read(databaseProvider).calendarDao.deleteEvent(widget.existingEvent!.id);
                  await NotificationService.instance.cancelNotification(widget.existingEvent!.id.hashCode);
                  if (mounted) Navigator.pop(context);
                },
              ),
            ],
          ],
        ),
      ),
    );
  }
}
