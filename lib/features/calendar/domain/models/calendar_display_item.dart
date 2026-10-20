import 'package:flutter/material.dart';

enum CalendarItemType {
  event,
  task,
  outOfOffice,
  focusTime,
  workingLocation,
  appointmentSchedule,
  birthday,
  holiday,
  transaction,
}

class CalendarDisplayItem {
  final String id;
  final String sourceId;
  final CalendarItemType type;
  final String title;
  final String? description;
  final DateTime startTime;
  final DateTime endTime;
  final bool isAllDay;
  final Color color;
  final String? location;
  final bool isCompleted; // for tasks
  final String? videoUrl;
  final String? recurrenceRule;
  final String? rsvpStatus; // 'yes', 'no', 'maybe'
  final String? workingLocationTag; // 'Office', 'Home', 'Other'

  const CalendarDisplayItem({
    required this.id,
    required this.sourceId,
    required this.type,
    required this.title,
    this.description,
    required this.startTime,
    required this.endTime,
    required this.isAllDay,
    required this.color,
    this.location,
    this.isCompleted = false,
    this.videoUrl,
    this.recurrenceRule,
    this.rsvpStatus,
    this.workingLocationTag,
  });

  CalendarDisplayItem copyWith({
    String? id,
    String? sourceId,
    CalendarItemType? type,
    String? title,
    String? description,
    DateTime? startTime,
    DateTime? endTime,
    bool? isAllDay,
    Color? color,
    String? location,
    bool? isCompleted,
    String? videoUrl,
    String? recurrenceRule,
    String? rsvpStatus,
    String? workingLocationTag,
  }) {
    return CalendarDisplayItem(
      id: id ?? this.id,
      sourceId: sourceId ?? this.sourceId,
      type: type ?? this.type,
      title: title ?? this.title,
      description: description ?? this.description,
      startTime: startTime ?? this.startTime,
      endTime: endTime ?? this.endTime,
      isAllDay: isAllDay ?? this.isAllDay,
      color: color ?? this.color,
      location: location ?? this.location,
      isCompleted: isCompleted ?? this.isCompleted,
      videoUrl: videoUrl ?? this.videoUrl,
      recurrenceRule: recurrenceRule ?? this.recurrenceRule,
      rsvpStatus: rsvpStatus ?? this.rsvpStatus,
      workingLocationTag: workingLocationTag ?? this.workingLocationTag,
    );
  }
}
