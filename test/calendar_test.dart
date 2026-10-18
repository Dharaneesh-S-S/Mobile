import 'package:flutter_test/flutter_test.dart';
import 'package:drift/native.dart';
import 'package:drift/drift.dart' as drift;
import 'package:personal_hub/core/database/app_database.dart';
import 'package:uuid/uuid.dart';

void main() {
  late AppDatabase db;

  setUp(() {
    db = AppDatabase(NativeDatabase.memory());
  });

  tearDown(() async {
    await db.close();
  });

  group('Stage 2 — Calendar Module Tests', () {
    test('Event CRUD and Duplicate functionality', () async {
      final eventId = const Uuid().v4();
      final now = DateTime.now().toUtc();
      final startUtc = now.millisecondsSinceEpoch;
      final endUtc = now.add(const Duration(hours: 2)).millisecondsSinceEpoch;

      // 1. Create Event
      await db.calendarDao.insertEvent(
        CalendarEventsCompanion.insert(
          id: eventId,
          title: 'Architecture Review',
          description: const drift.Value('Deep dive into calendar architecture'),
          startTimeUtc: startUtc,
          endTimeUtc: endUtc,
          isAllDay: const drift.Value(false),
          eventType: const drift.Value('event'),
          colorValue: const drift.Value(0xFF00BCD4),
          createdAtUtc: startUtc,
          updatedAtUtc: startUtc,
        ),
      );

      var event = await db.calendarDao.getEventById(eventId);
      expect(event, isNotNull);
      expect(event!.title, 'Architecture Review');
      expect(event.eventType, 'event');

      // 2. Edit Event
      final updated = event.copyWith(title: 'Updated Architecture Review');
      await db.calendarDao.updateEvent(updated);
      event = await db.calendarDao.getEventById(eventId);
      expect(event!.title, 'Updated Architecture Review');

      // 3. Duplicate Event
      final duplicateId = const Uuid().v4();
      final duplicate = event.copyWith(
        id: duplicateId,
        title: '${event.title} (Copy)',
      );
      await db.calendarDao.insertEvent(
        CalendarEventsCompanion.insert(
          id: duplicate.id,
          title: duplicate.title,
          description: drift.Value(duplicate.description),
          startTimeUtc: duplicate.startTimeUtc,
          endTimeUtc: duplicate.endTimeUtc,
          isAllDay: drift.Value(duplicate.isAllDay),
          eventType: drift.Value(duplicate.eventType),
          colorValue: drift.Value(duplicate.colorValue),
          createdAtUtc: duplicate.createdAtUtc,
          updatedAtUtc: duplicate.updatedAtUtc,
        ),
      );
      final duplicateEvent = await db.calendarDao.getEventById(duplicateId);
      expect(duplicateEvent, isNotNull);
      expect(duplicateEvent!.title, 'Updated Architecture Review (Copy)');

      // 4. Delete Event
      await db.calendarDao.deleteEvent(eventId);
      final deleted = await db.calendarDao.getEventById(eventId);
      expect(deleted, isNull);

      // Duplicate remains
      final duplicateStillExists = await db.calendarDao.getEventById(duplicateId);
      expect(duplicateStillExists, isNotNull);
    });

    test('Birthdays and Holidays are distinguishable and persist properly', () async {
      final bdayId = const Uuid().v4();
      final holidayId = const Uuid().v4();
      final now = DateTime.now().toUtc().millisecondsSinceEpoch;

      // Add Birthday
      await db.calendarDao.insertEvent(
        CalendarEventsCompanion.insert(
          id: bdayId,
          title: "Alice's Birthday",
          startTimeUtc: now,
          endTimeUtc: now + 86400000,
          isAllDay: const drift.Value(true),
          eventType: const drift.Value('birthday'),
          colorValue: const drift.Value(0xFFFF9800),
          createdAtUtc: now,
          updatedAtUtc: now,
        ),
      );

      // Add Holiday
      await db.calendarDao.insertEvent(
        CalendarEventsCompanion.insert(
          id: holidayId,
          title: 'Independence Day',
          startTimeUtc: now,
          endTimeUtc: now + 86400000,
          isAllDay: const drift.Value(true),
          eventType: const drift.Value('holiday'),
          colorValue: const drift.Value(0xFF4CAF50),
          createdAtUtc: now,
          updatedAtUtc: now,
        ),
      );

      final events = await db.calendarDao.getAllEvents();
      expect(events.length, 2);

      final birthday = events.firstWhere((e) => e.eventType == 'birthday');
      expect(birthday.title, "Alice's Birthday");

      final holiday = events.firstWhere((e) => e.eventType == 'holiday');
      expect(holiday.title, 'Independence Day');
    });

    test('Calendar queries across Month, Year, and Leap Year boundaries', () async {
      // 1. Year boundary (Dec 31, 2027 to Jan 1, 2028)
      final newYearsEveUtc = DateTime.utc(2027, 12, 31, 22, 0).millisecondsSinceEpoch;
      final newYearsDayUtc = DateTime.utc(2028, 1, 1, 2, 0).millisecondsSinceEpoch;
      final yearBoundaryEventId = const Uuid().v4();

      await db.calendarDao.insertEvent(
        CalendarEventsCompanion.insert(
          id: yearBoundaryEventId,
          title: "New Year's Eve Countdown",
          startTimeUtc: newYearsEveUtc,
          endTimeUtc: newYearsDayUtc,
          createdAtUtc: newYearsEveUtc,
          updatedAtUtc: newYearsEveUtc,
        ),
      );

      // Query covering the boundary
      final decQuery = await db.calendarDao.getEventsInRange(
        DateTime.utc(2027, 12, 1).millisecondsSinceEpoch,
        DateTime.utc(2027, 12, 31, 23, 59).millisecondsSinceEpoch,
      );
      expect(decQuery.any((e) => e.id == yearBoundaryEventId), isTrue);

      final janQuery = await db.calendarDao.getEventsInRange(
        DateTime.utc(2028, 1, 1).millisecondsSinceEpoch,
        DateTime.utc(2028, 1, 31).millisecondsSinceEpoch,
      );
      expect(janQuery.any((e) => e.id == yearBoundaryEventId), isTrue);

      // 2. Leap year boundary (Feb 28 - Feb 29, 2028)
      final leapDayUtc = DateTime.utc(2028, 2, 29, 10, 0).millisecondsSinceEpoch;
      final leapEventId = const Uuid().v4();

      await db.calendarDao.insertEvent(
        CalendarEventsCompanion.insert(
          id: leapEventId,
          title: 'Leap Year Event',
          startTimeUtc: leapDayUtc,
          endTimeUtc: leapDayUtc + 3600000,
          createdAtUtc: leapDayUtc,
          updatedAtUtc: leapDayUtc,
        ),
      );

      final leapQuery = await db.calendarDao.getEventsInRange(
        DateTime.utc(2028, 2, 1).millisecondsSinceEpoch,
        DateTime.utc(2028, 2, 29, 23, 59).millisecondsSinceEpoch,
      );
      expect(leapQuery.any((e) => e.id == leapEventId), isTrue);
    });
  });
}
