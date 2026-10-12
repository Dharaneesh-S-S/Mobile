// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'money_dao.dart';

// ignore_for_file: type=lint
mixin _$MoneyDaoMixin on DatabaseAccessor<AppDatabase> {
  $MoneyAccountsTable get moneyAccounts => attachedDatabase.moneyAccounts;
  $MoneyCategoriesTable get moneyCategories => attachedDatabase.moneyCategories;
  $CalendarEventsTable get calendarEvents => attachedDatabase.calendarEvents;
  $TaskListsTable get taskLists => attachedDatabase.taskLists;
  $TaskItemsTable get taskItems => attachedDatabase.taskItems;
  $MoneyTransactionsTable get moneyTransactions =>
      attachedDatabase.moneyTransactions;
  MoneyDaoManager get managers => MoneyDaoManager(this);
}

class MoneyDaoManager {
  final _$MoneyDaoMixin _db;
  MoneyDaoManager(this._db);
  $$MoneyAccountsTableTableManager get moneyAccounts =>
      $$MoneyAccountsTableTableManager(_db.attachedDatabase, _db.moneyAccounts);
  $$MoneyCategoriesTableTableManager get moneyCategories =>
      $$MoneyCategoriesTableTableManager(
        _db.attachedDatabase,
        _db.moneyCategories,
      );
  $$CalendarEventsTableTableManager get calendarEvents =>
      $$CalendarEventsTableTableManager(
        _db.attachedDatabase,
        _db.calendarEvents,
      );
  $$TaskListsTableTableManager get taskLists =>
      $$TaskListsTableTableManager(_db.attachedDatabase, _db.taskLists);
  $$TaskItemsTableTableManager get taskItems =>
      $$TaskItemsTableTableManager(_db.attachedDatabase, _db.taskItems);
  $$MoneyTransactionsTableTableManager get moneyTransactions =>
      $$MoneyTransactionsTableTableManager(
        _db.attachedDatabase,
        _db.moneyTransactions,
      );
}
