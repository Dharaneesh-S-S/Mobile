import 'package:flutter/material.dart';

enum CalendarItemType {
  event,
  birthday,
  holiday,
  task,
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
  });
}
