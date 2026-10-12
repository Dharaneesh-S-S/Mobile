import 'package:flutter_test/flutter_test.dart';
import 'package:drift/native.dart';
import 'package:personal_hub/core/database/app_database.dart';

void main() {
  late AppDatabase db;

  setUp(() {
    db = AppDatabase.forTesting(NativeDatabase.memory());
  });

  tearDown(() async {
    await db.close();
  });

  test('Database migration and schema creation succeeds', () async {
    final version = await db.customSelect('PRAGMA user_version;').getSingle();
    expect(version.data.values.first, greaterThanOrEqualTo(5)); // Ensure schema v5
  });

  test('Calendar Event creation persists correctly', () async {
    final dao = db.calendarDao;
    await dao.createEvent(
      title: 'Audit Meeting',
      description: 'Review code',
      startTimeUtc: DateTime(2026, 1, 1, 10).toUtc().millisecondsSinceEpoch,
      endTimeUtc: DateTime(2026, 1, 1, 11).toUtc().millisecondsSinceEpoch,
      isAllDay: false,
      colorValue: 0xFF00FF00,
    );

    final events = await dao.watchEventsForDay(DateTime(2026, 1, 1).toUtc()).first;
    expect(events.length, 1);
    expect(events.first.title, 'Audit Meeting');
  });

  test('Money transactions persist and do not cross-pollute', () async {
    final dao = db.moneyDao;
    await dao.createTransaction(
      amount: 100.0,
      isIncome: true,
      categoryId: 'salary',
      timestampUtc: DateTime.now().toUtc().millisecondsSinceEpoch,
      note: 'Salary',
    );
    await dao.createTransaction(
      amount: 20.0,
      isIncome: false,
      categoryId: 'food',
      timestampUtc: DateTime.now().toUtc().millisecondsSinceEpoch,
      note: 'Lunch',
    );

    final txs = await dao.watchTransactionsForMonth(DateTime.now().year, DateTime.now().month).first;
    expect(txs.length, 2);
    expect(txs.where((t) => t.isIncome).length, 1);
    expect(txs.where((t) => !t.isIncome).length, 1);
  });
}
