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
      },
    );
  }

  static QueryExecutor _openConnection() {
    return driftDatabase(
      name: 'personal_hub_db',
      native: const DriftNativeOptions(
        shareAcrossIsolates: true,
      ),
    );
  }
}
