import 'package:drift/drift.dart';
import 'package:drift_flutter/drift_flutter.dart';

import 'tables/shared_tables.dart';
import 'tables/calendar_tables.dart';
import 'tables/money_tables.dart';
import 'tables/task_tables.dart';
import 'tables/note_tables.dart';
import 'tables/usage_tables.dart';
import 'tables/document_tables.dart';
import 'tables/music_tables.dart';

import 'daos/shared_dao.dart';
import 'daos/calendar_dao.dart';
import 'daos/money_dao.dart';
import 'daos/task_dao.dart';
import 'daos/note_dao.dart';
import 'daos/usage_dao.dart';
import 'daos/document_dao.dart';
import 'daos/music_dao.dart';

part 'app_database.g.dart';

@DriftDatabase(
  tables: [
    Tags,
    EntityCrossLinks,
    CalendarEvents,
    MoneyAccounts,
    MoneyCategories,
    MoneyTransactions,
    MoneyBudgets,
    SavingsGoals,
    Debts,
    RecurringTransactions,
    TaskLists,
    TaskItems,
    NoteLabels,
    NoteItems,
    NoteLabelCrossRef,
    ChecklistItems,
    UsageSessions,
    AppCategories,
    UsageLimits,
    DocumentItems,
    DocumentPages,
    MusicPlaylists,
    PlaylistSongs,
    SongMetadata,
  ],
  daos: [
    SharedDao,
    CalendarDao,
    MoneyDao,
    TaskDao,
    NoteDao,
    UsageDao,
    DocumentDao,
    MusicDao,
  ],
)
class AppDatabase extends _$AppDatabase {
  AppDatabase([QueryExecutor? executor]) : super(executor ?? _openConnection());

  @override
  int get schemaVersion => 5;

  @override
  MigrationStrategy get migration {
    return MigrationStrategy(
      onCreate: (Migrator m) async {
        await m.createAll();
      },
      onUpgrade: (Migrator m, int from, int to) async {
        if (from < 2) {
          // Drop old tables
          await customStatement('DROP TABLE IF EXISTS note_folders;');
          await customStatement('DROP TABLE IF EXISTS note_items;');
          
          await m.createTable(noteLabels);
          await m.createTable(noteItems);
          await m.createTable(noteLabelCrossRef);
          await m.createTable(checklistItems);
        }
        if (from < 3) {
          await m.createTable(appCategories);
          await m.createTable(usageLimits);
        }
        if (from < 4) {
          await m.createTable(musicPlaylists);
          await m.createTable(playlistSongs);
          await m.createTable(songMetadata);
        }
        if (from < 5) {
          await m.createTable(documentPages);
        }
      },
      beforeOpen: (details) async {
        // Enforce foreign key constraints in SQLite
        await customStatement('PRAGMA foreign_keys = ON;');

        final existingCats = await select(moneyCategories).get();
        final now = DateTime.now().toUtc().millisecondsSinceEpoch;
        if (existingCats.isEmpty) {
          final defaultCategories = [
            MoneyCategoriesCompanion.insert(id: 'cat_salary', name: 'Salary', iconName: const Value('work'), colorValue: const Value(0xFF10B981), isExpense: const Value(false), createdAtUtc: now),
            MoneyCategoriesCompanion.insert(id: 'cat_freelance', name: 'Freelance', iconName: const Value('laptop'), colorValue: const Value(0xFF06B6D4), isExpense: const Value(false), createdAtUtc: now),
            MoneyCategoriesCompanion.insert(id: 'cat_investment', name: 'Investment', iconName: const Value('trending_up'), colorValue: const Value(0xFF8B5CF6), isExpense: const Value(false), createdAtUtc: now),
            MoneyCategoriesCompanion.insert(id: 'cat_other_inc', name: 'Other Income', iconName: const Value('attach_money'), colorValue: const Value(0xFF3B82F6), isExpense: const Value(false), createdAtUtc: now),
            MoneyCategoriesCompanion.insert(id: 'cat_food', name: 'Food & Dining', iconName: const Value('restaurant'), colorValue: const Value(0xFFEF4444), isExpense: const Value(true), createdAtUtc: now),
            MoneyCategoriesCompanion.insert(id: 'cat_groceries', name: 'Groceries', iconName: const Value('shopping_cart'), colorValue: const Value(0xFFF97316), isExpense: const Value(true), createdAtUtc: now),
            MoneyCategoriesCompanion.insert(id: 'cat_transport', name: 'Transportation', iconName: const Value('directions_car'), colorValue: const Value(0xFFF59E0B), isExpense: const Value(true), createdAtUtc: now),
            MoneyCategoriesCompanion.insert(id: 'cat_bills', name: 'Bills & Utilities', iconName: const Value('receipt'), colorValue: const Value(0xFFEC4899), isExpense: const Value(true), createdAtUtc: now),
            MoneyCategoriesCompanion.insert(id: 'cat_shopping', name: 'Shopping', iconName: const Value('shopping_bag'), colorValue: const Value(0xFF8B5CF6), isExpense: const Value(true), createdAtUtc: now),
            MoneyCategoriesCompanion.insert(id: 'cat_entertainment', name: 'Entertainment', iconName: const Value('movie'), colorValue: const Value(0xFF6366F1), isExpense: const Value(true), createdAtUtc: now),
            MoneyCategoriesCompanion.insert(id: 'cat_health', name: 'Healthcare', iconName: const Value('medical_services'), colorValue: const Value(0xFF14B8A6), isExpense: const Value(true), createdAtUtc: now),
            MoneyCategoriesCompanion.insert(id: 'cat_other_exp', name: 'Other Expense', iconName: const Value('more_horiz'), colorValue: const Value(0xFF6B7280), isExpense: const Value(true), createdAtUtc: now),
          ];
          for (final c in defaultCategories) {
            await into(moneyCategories).insert(c);
          }
        }

        final existingAccounts = await select(moneyAccounts).get();
        if (existingAccounts.isEmpty) {
          final defaultAccounts = [
            MoneyAccountsCompanion.insert(id: 'acc_cash', name: 'Cash', accountType: 'cash', balancePaise: const Value(0), createdAtUtc: now),
            MoneyAccountsCompanion.insert(id: 'acc_bank', name: 'Bank Account', accountType: 'bank', balancePaise: const Value(0), createdAtUtc: now),
          ];
          for (final a in defaultAccounts) {
            await into(moneyAccounts).insert(a);
          }
        }
      },
    );
  }

  static QueryExecutor _openConnection() {
    return driftDatabase(
      name: 'personal_hub_db',
      native: const DriftNativeOptions(
        shareAcrossIsolates: true,
      ),
      web: DriftWebOptions(
        sqlite3Wasm: Uri.parse('sqlite3.wasm'),
        driftWorker: Uri.parse('drift_worker.js'),
      ),
    );
  }
}
