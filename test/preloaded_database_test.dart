import 'dart:io';
import 'package:drift/native.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:personal_hub/core/database/app_database.dart';
import 'package:personal_hub/core/database/preloaded_database_service.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  late AppDatabase db;

  setUp(() {
    db = AppDatabase(NativeDatabase.memory());
  });

  tearDown(() async {
    await db.close();
  });

  group('Preloaded & Snapshot Storage Tests', () {
    test('Database checkpoints cleanly with WAL truncate and valid integrity', () async {
      final nowUtc = DateTime.now().toUtc().millisecondsSinceEpoch;

      // 1. Insert sample calendar event (birthday / standup)
      await db.calendarDao.insertEvent(
        CalendarEventsCompanion.insert(
          id: 'test_bday_1',
          title: 'Mom Birthday',
          startTimeUtc: nowUtc,
          endTimeUtc: nowUtc,
          createdAtUtc: nowUtc,
          updatedAtUtc: nowUtc,
        ),
      );

      // 2. Insert sample task
      await db.taskDao.insertTask(
        TaskItemsCompanion.insert(
          id: 'test_task_1',
          title: 'Complete Project Milestone',
          createdAtUtc: nowUtc,
          updatedAtUtc: nowUtc,
        ),
      );

      // Verify records exist in memory
      final events = await db.calendarDao.getAllEvents();
      expect(events.length, 1);
      expect(events.first.title, 'Mom Birthday');

      final tasks = await db.taskDao.getAllTasks();
      expect(tasks.length, 1);
      expect(tasks.first.title, 'Complete Project Milestone');

      // Verify WAL checkpoint command executes with no exception
      await db.customStatement('PRAGMA wal_checkpoint(TRUNCATE);');
      final integrity = await db.customSelect('PRAGMA integrity_check;').getSingle();
      expect(integrity.data.values.first.toString().toLowerCase(), 'ok');
    });

    test('PreloadedDatabaseService singleton handles non-existent bundle safely', () async {
      final hasBundle = await PreloadedDatabaseService.instance.hasBundledPreloadedData();
      // On fresh test harness, bundle should be false or handled without throwing
      expect(hasBundle, isA<bool>());
    });
  });
}

