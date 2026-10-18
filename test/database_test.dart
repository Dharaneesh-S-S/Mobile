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

  test('Database migration and schema creation succeeds', () async {
    expect(db.schemaVersion, 5);
    final version = await db.customSelect('PRAGMA user_version;').getSingle();
    expect(version.data.values.first, greaterThanOrEqualTo(5)); // Ensure schema v5
  });

  test('Calendar Event creation persists correctly', () async {
    final dao = db.calendarDao;
    final eventId = const Uuid().v4();
    final startUtc = DateTime(2026, 1, 1, 10).toUtc().millisecondsSinceEpoch;
    final endUtc = DateTime(2026, 1, 1, 11).toUtc().millisecondsSinceEpoch;

    await dao.insertEvent(
      CalendarEventsCompanion.insert(
        id: eventId,
        title: 'Audit Meeting',
        description: const drift.Value('Review code'),
        startTimeUtc: startUtc,
        endTimeUtc: endUtc,
        isAllDay: const drift.Value(false),
        colorValue: const drift.Value(0xFF00FF00),
        createdAtUtc: DateTime.now().toUtc().millisecondsSinceEpoch,
        updatedAtUtc: DateTime.now().toUtc().millisecondsSinceEpoch,
      ),
    );

    final events = await dao.getEventsInRange(startUtc - 1000, endUtc + 1000);
    expect(events.length, 1);
    expect(events.first.title, 'Audit Meeting');
    expect(events.first.id, eventId);
  });

  test('Money transactions persist and update account balances atomically', () async {
    final dao = db.moneyDao;
    final accountId = const Uuid().v4();

    // 1. Create account
    await dao.insertAccount(
      MoneyAccountsCompanion.insert(
        id: accountId,
        name: 'Main Wallet',
        accountType: 'cash',
        balancePaise: const drift.Value(50000), // ₹500.00
        createdAtUtc: DateTime.now().toUtc().millisecondsSinceEpoch,
      ),
    );

    // 2. Record income transaction
    final incomeTxId = const Uuid().v4();
    await dao.recordTransaction(
      MoneyTransactionsCompanion.insert(
        id: incomeTxId,
        accountId: accountId,
        amountPaise: 10000, // +₹100.00
        type: const drift.Value('income'),
        transactionTimeUtc: DateTime.now().toUtc().millisecondsSinceEpoch,
        createdAtUtc: DateTime.now().toUtc().millisecondsSinceEpoch,
        note: const drift.Value('Salary Bonus'),
      ),
    );

    // 3. Record expense transaction
    final expenseTxId = const Uuid().v4();
    await dao.recordTransaction(
      MoneyTransactionsCompanion.insert(
        id: expenseTxId,
        accountId: accountId,
        amountPaise: 2000, // -₹20.00
        type: const drift.Value('expense'),
        transactionTimeUtc: DateTime.now().toUtc().millisecondsSinceEpoch,
        createdAtUtc: DateTime.now().toUtc().millisecondsSinceEpoch,
        note: const drift.Value('Coffee'),
      ),
    );

    final txs = await dao.getAllTransactions();
    expect(txs.length, 2);

    final account = await dao.getAccountById(accountId);
    // 50000 + 10000 - 2000 = 58000 paise (₹580.00)
    expect(account!.balancePaise, 58000);
  });
}
