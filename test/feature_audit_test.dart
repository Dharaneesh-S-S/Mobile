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

  group('Part 4 — Money Manager Arithmetic & Atomic Transfers', () {
    test('Exact Master Prompt Case: Income ₹10,000, Expense ₹4,000, Transfer ₹2,000 -> Net ₹6,000', () async {
      final walletAId = const Uuid().v4();
      final walletBId = const Uuid().v4();

      // Wallet A starts with ₹5,000 (500,000 paise), Wallet B starts with ₹5,000 (500,000 paise)
      // Combined balance = ₹10,000 (1,000,000 paise)
      await db.moneyDao.insertAccount(
        MoneyAccountsCompanion.insert(
          id: walletAId,
          name: 'Wallet A',
          accountType: 'bank',
          balancePaise: const drift.Value(500000),
          createdAtUtc: DateTime.now().toUtc().millisecondsSinceEpoch,
        ),
      );

      await db.moneyDao.insertAccount(
        MoneyAccountsCompanion.insert(
          id: walletBId,
          name: 'Wallet B',
          accountType: 'cash',
          balancePaise: const drift.Value(500000),
          createdAtUtc: DateTime.now().toUtc().millisecondsSinceEpoch,
        ),
      );

      // 1. Income = ₹10,000 (1,000,000 paise) to Wallet A
      await db.moneyDao.recordTransaction(
        MoneyTransactionsCompanion.insert(
          id: const Uuid().v4(),
          accountId: walletAId,
          amountPaise: 1000000,
          type: const drift.Value('income'),
          transactionTimeUtc: DateTime.now().toUtc().millisecondsSinceEpoch,
          createdAtUtc: DateTime.now().toUtc().millisecondsSinceEpoch,
        ),
      );

      // 2. Expense = ₹4,000 (400,000 paise) from Wallet A
      await db.moneyDao.recordTransaction(
        MoneyTransactionsCompanion.insert(
          id: const Uuid().v4(),
          accountId: walletAId,
          amountPaise: 400000,
          type: const drift.Value('expense'),
          transactionTimeUtc: DateTime.now().toUtc().millisecondsSinceEpoch,
          createdAtUtc: DateTime.now().toUtc().millisecondsSinceEpoch,
        ),
      );

      // 3. Transfer = ₹2,000 (200,000 paise) from Wallet A to Wallet B
      final transferId = const Uuid().v4();
      await db.moneyDao.recordTransaction(
        MoneyTransactionsCompanion.insert(
          id: transferId,
          accountId: walletAId,
          toAccountId: drift.Value(walletBId),
          amountPaise: 200000,
          type: const drift.Value('transfer'),
          transactionTimeUtc: DateTime.now().toUtc().millisecondsSinceEpoch,
          createdAtUtc: DateTime.now().toUtc().millisecondsSinceEpoch,
        ),
      );

      // Read back all transactions
      final txs = await db.moneyDao.getAllTransactions();
      expect(txs.length, 3);

      // Calculate totals
      int totalIncome = 0;
      int totalExpense = 0;
      for (final tx in txs) {
        if (tx.type == 'income') totalIncome += tx.amountPaise;
        if (tx.type == 'expense') totalExpense += tx.amountPaise;
      }
      final netCashFlow = totalIncome - totalExpense;

      // Assert expected totals:
      // Income = ₹10,000 (1,000,000 paise)
      // Expense = ₹4,000 (400,000 paise)
      // Net Cash Flow = ₹6,000 (600,000 paise)
      expect(totalIncome, 1000000);
      expect(totalExpense, 400000);
      expect(netCashFlow, 600000);

      // Assert individual wallet balances:
      // Wallet A: 500,000 + 1,000,000 - 400,000 - 200,000 = 900,000 (₹9,000)
      // Wallet B: 500,000 + 200,000 = 700,000 (₹7,000)
      final accountA = await db.moneyDao.getAccountById(walletAId);
      final accountB = await db.moneyDao.getAccountById(walletBId);
      expect(accountA!.balancePaise, 900000);
      expect(accountB!.balancePaise, 700000);

      // Combined balance must be 1,600,000 paise (Initial 1,000,000 + Net Cash Flow 600,000)
      // The transfer must not change the overall combined balance across wallets
      expect(accountA.balancePaise + accountB.balancePaise, 1600000);

      // Test deleting the transfer reverses the balance impact atomically
      await db.moneyDao.deleteTransaction(transferId);
      final accountAAfterRevert = await db.moneyDao.getAccountById(walletAId);
      final accountBAfterRevert = await db.moneyDao.getAccountById(walletBId);
      expect(accountAAfterRevert!.balancePaise, 1100000);
      expect(accountBAfterRevert!.balancePaise, 500000);
    });
  });

  group('Part 5 — Task Management & Isolation', () {
    test('Task lists and tasks can be created and tasks inherit list relationship', () async {
      final listId = const Uuid().v4();
      await db.taskDao.insertList(
        TaskListsCompanion.insert(
          id: listId,
          title: 'Work Projects',
          colorValue: const drift.Value(0xFF2196F3),
          sortOrder: const drift.Value(1),
          createdAtUtc: DateTime.now().toUtc().millisecondsSinceEpoch,
        ),
      );

      final taskId = const Uuid().v4();
      await db.taskDao.insertTask(
        TaskItemsCompanion.insert(
          id: taskId,
          title: 'Complete Audit Report',
          listId: drift.Value(listId),
          dueDateUtc: drift.Value(DateTime.now().toUtc().millisecondsSinceEpoch + 86400000),
          createdAtUtc: DateTime.now().toUtc().millisecondsSinceEpoch,
          updatedAtUtc: DateTime.now().toUtc().millisecondsSinceEpoch,
        ),
      );

      final tasks = await db.taskDao.getAllTasks();
      final task = tasks.firstWhere((t) => t.id == taskId);
      expect(task, isNotNull);
      expect(task.title, 'Complete Audit Report');
      expect(task.listId, listId);
      expect(task.isCompleted, isFalse);

      // Complete task
      await db.taskDao.toggleTaskCompletion(taskId, true, DateTime.now().toUtc().millisecondsSinceEpoch);
      final tasksAfter = await db.taskDao.getAllTasks();
      final completedTask = tasksAfter.firstWhere((t) => t.id == taskId);
      expect(completedTask.isCompleted, isTrue);
    });
  });

  group('Part 6 — Notes & Labels Cascade Preservation', () {
    test('Deleting a label does not delete its associated note', () async {
      final labelId = const Uuid().v4();
      await db.noteDao.insertLabel(
        NoteLabelsCompanion.insert(
          id: labelId,
          name: 'Important',
          createdAtUtc: DateTime.now().toUtc().millisecondsSinceEpoch,
        ),
      );

      final noteId = const Uuid().v4();
      await db.noteDao.createNote(
        NoteItemsCompanion.insert(
          id: noteId,
          title: const drift.Value('Meeting Notes'),
          content: const drift.Value('Discuss architectural audit'),
          createdAtUtc: DateTime.now().toUtc().millisecondsSinceEpoch,
          updatedAtUtc: DateTime.now().toUtc().millisecondsSinceEpoch,
        ),
        [labelId],
        [],
      );

      // Note has 1 label
      final noteWithDetails = await db.noteDao.getNoteById(noteId);
      expect(noteWithDetails, isNotNull);
      expect(noteWithDetails!.labels.length, 1);
      expect(noteWithDetails.labels.first.name, 'Important');

      // Delete the label
      await db.noteDao.deleteLabel(labelId);

      // Note must STILL exist and have 0 labels
      final noteAfterLabelDelete = await db.noteDao.getNoteById(noteId);
      expect(noteAfterLabelDelete, isNotNull);
      expect(noteAfterLabelDelete!.note.title, 'Meeting Notes');
      expect(noteAfterLabelDelete.labels.isEmpty, isTrue);
    });
  });
}
