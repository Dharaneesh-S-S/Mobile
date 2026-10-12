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

  test('Transfers do not affect income or expense totals and update wallet balances correctly', () async {
    final wallet1Id = const Uuid().v4();
    final wallet2Id = const Uuid().v4();

    await db.moneyDao.insertAccount(
      MoneyAccountsCompanion.insert(
        id: wallet1Id,
        name: 'Wallet 1',
        accountType: 'bank',
        balancePaise: const drift.Value(100000), 
        createdAtUtc: DateTime.now().toUtc().millisecondsSinceEpoch,
      ),
    );

    await db.moneyDao.insertAccount(
      MoneyAccountsCompanion.insert(
        id: wallet2Id,
        name: 'Wallet 2',
        accountType: 'bank',
        balancePaise: const drift.Value(50000), 
        createdAtUtc: DateTime.now().toUtc().millisecondsSinceEpoch,
      ),
    );

    final transferTxId = const Uuid().v4();
    await db.moneyDao.recordTransaction(
      MoneyTransactionsCompanion.insert(
        id: transferTxId,
        accountId: wallet1Id,
        toAccountId: drift.Value(wallet2Id),
        amountPaise: 20000,
        type: const drift.Value('transfer'),
        transactionTimeUtc: DateTime.now().toUtc().millisecondsSinceEpoch,
        createdAtUtc: DateTime.now().toUtc().millisecondsSinceEpoch,
      ),
    );

    final w1 = await db.moneyDao.getAccountById(wallet1Id);
    final w2 = await db.moneyDao.getAccountById(wallet2Id);

    expect(w1!.balancePaise, 80000); 
    expect(w2!.balancePaise, 70000); 

    final txs = await db.moneyDao.getAllTransactions();
    expect(txs.length, 1);
    expect(txs.first.type, 'transfer');

    int income = 0;
    int expense = 0;
    for (final tx in txs) {
      if (tx.type == 'income') income = income + tx.amountPaise;
      if (tx.type == 'expense') expense = expense + tx.amountPaise;
    }
    
    expect(income, 0);
    expect(expense, 0);
    expect(income - expense, 0); 
  });
}
