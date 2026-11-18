import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:path/path.dart' as p;
import 'package:path_provider/path_provider.dart';
import 'package:share_plus/share_plus.dart';

import '../database/app_database.dart';

class PreloadedDatabaseService {
  static final PreloadedDatabaseService instance = PreloadedDatabaseService._();
  PreloadedDatabaseService._();

  static const String dbName = 'personal_hub_db';
  static const String preloadedAssetPath = 'assets/preloaded_data/personal_hub_preloaded.sqlite';

  /// Returns the target local SQLite file path on Android/desktop native platforms.
  Future<File> getLocalDatabaseFile() async {
    final docsDir = await getApplicationDocumentsDirectory();
    return File(p.join(docsDir.path, '$dbName.sqlite'));
  }

  /// Checks if preloaded asset data exists in the APK bundle.
  Future<bool> hasBundledPreloadedData() async {
    try {
      final byteData = await rootBundle.load(preloadedAssetPath);
      return byteData.lengthInBytes > 0;
    } catch (_) {
      return false;
    }
  }

  /// Initial setup on fresh installations:
  /// If the local database doesn't exist yet, copies the bundled SQLite database
  /// so that all initial birthdays, tasks, and data are instantly available.
  Future<bool> initializePreloadedDataIfNeeded() async {
    if (kIsWeb) return false;

    try {
      final localDbFile = await getLocalDatabaseFile();

      // If local database already exists on this mobile, never overwrite it!
      if (await localDbFile.exists()) {
        debugPrint('[PreloadedDB] Local database already exists at ${localDbFile.path}. Preserving existing user data.');
        return false;
      }

      // Check if preloaded snapshot asset was packaged in the APK
      try {
        final byteData = await rootBundle.load(preloadedAssetPath);
        if (byteData.lengthInBytes > 0) {
          // Ensure parent directory exists
          await localDbFile.parent.create(recursive: true);

          // Write bytes atomically
          final buffer = byteData.buffer;
          await localDbFile.writeAsBytes(
            buffer.asUint8List(byteData.offsetInBytes, byteData.lengthInBytes),
            flush: true,
          );

          debugPrint('[PreloadedDB] Successfully seeded local database from APK preloaded asset (${byteData.lengthInBytes} bytes).');
          return true;
        }
      } catch (assetError) {
        debugPrint('[PreloadedDB] No preloaded asset found in APK or empty. Proceeding with fresh database.');
      }
    } catch (e) {
      debugPrint('[PreloadedDB] Initialization check note: $e');
    }

    return false;
  }

  /// Checkpoints the SQLite WAL and exports a consistent standalone database file.
  Future<File> exportDatabaseSnapshot(AppDatabase db) async {
    if (kIsWeb) {
      throw UnsupportedError('Database snapshot export is only supported on native mobile devices.');
    }

    // 1. Force SQLite WAL checkpoint to truncate and merge all pending memory/log transactions into main DB file
    try {
      await db.customStatement('PRAGMA wal_checkpoint(TRUNCATE);');
      final integrity = await db.customSelect('PRAGMA integrity_check;').getSingle();
      final resultStr = integrity.data.values.first?.toString() ?? '';
      if (resultStr.toLowerCase() != 'ok') {
        throw StateError('Database integrity check failed: $resultStr');
      }
    } catch (e) {
      debugPrint('[PreloadedDB] WAL checkpoint note: $e');
    }

    final localDbFile = await getLocalDatabaseFile();
    if (!await localDbFile.exists()) {
      throw StateError('Active SQLite database file not found at ${localDbFile.path}');
    }

    // 2. Copy to temporary export file
    final tempDir = await getTemporaryDirectory();
    final timestamp = DateTime.now().millisecondsSinceEpoch;
    final exportTarget = File(p.join(tempDir.path, 'personal_hub_snapshot_$timestamp.sqlite'));

    await localDbFile.copy(exportTarget.path);
    return exportTarget;
  }

  /// Exports snapshot and invokes Android Share Sheet.
  Future<void> shareDatabaseSnapshot(AppDatabase db) async {
    final snapshotFile = await exportDatabaseSnapshot(db);
    final xFile = XFile(
      snapshotFile.path,
      mimeType: 'application/x-sqlite3',
      name: 'personal_hub_preloaded.sqlite',
    );
    await Share.shareXFiles(
      [xFile],
      subject: 'Personal Hub Database Snapshot',
      text: 'Copy this snapshot into assets/preloaded_data/personal_hub_preloaded.sqlite to generate an APK with your latest data.',
    );
  }

  /// Safely restores a snapshot into an existing installation after creating a safety backup.
  Future<void> restoreDatabaseFromSnapshotFile({
    required File snapshotFile,
    required AppDatabase db,
  }) async {
    if (!await snapshotFile.exists()) {
      throw ArgumentError('Snapshot file does not exist: ${snapshotFile.path}');
    }

    final localDbFile = await getLocalDatabaseFile();

    // 1. Safety backup of existing DB before replacing
    if (await localDbFile.exists()) {
      final tempDir = await getTemporaryDirectory();
      final safetyBackup = File(p.join(tempDir.path, 'safety_backup_${DateTime.now().millisecondsSinceEpoch}.sqlite'));
      await localDbFile.copy(safetyBackup.path);
    }

    // 2. Flush and checkpoint WAL
    try {
      await db.customStatement('PRAGMA wal_checkpoint(TRUNCATE);');
    } catch (_) {}

    // 3. Close database and overwrite with snapshot
    await db.close();

    // Remove old WAL and SHM files if present
    final walFile = File('${localDbFile.path}-wal');
    if (await walFile.exists()) await walFile.delete();
    final shmFile = File('${localDbFile.path}-shm');
    if (await shmFile.exists()) await shmFile.delete();

    await snapshotFile.copy(localDbFile.path);
    debugPrint('[PreloadedDB] Database restored successfully from ${snapshotFile.path}');
  }
}

