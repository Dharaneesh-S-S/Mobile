import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';
import 'package:crypto/crypto.dart';
import 'package:path_provider/path_provider.dart';
import 'package:share_plus/share_plus.dart';

import '../constants/app_constants.dart';
import '../database/app_database.dart';
import '../security/security_service.dart';
import '../utils/date_time_utils.dart';
import 'backup_models.dart';

/// Service responsible for encrypted local backup export, integrity verification,
/// and safe atomic restoration.
class BackupService {
  final AppDatabase _db;
  final SecurityService _securityService;

  BackupService({
    required AppDatabase db,
    required SecurityService securityService,
  })  : _db = db,
        _securityService = securityService;

  /// Exports an encrypted backup archive to the device's storage and invokes the system share sheet / SAF.
  Future<File> exportEncryptedBackup() async {
    // 1. Gather all database records
    final tags = await _db.sharedDao.getAllTags();
    final links = await _db.select(_db.entityCrossLinks).get();
    final calendarEvents = await _db.calendarDao.getAllEvents();
    final moneyAccounts = await _db.moneyDao.getAllAccounts();
    final moneyCategories = await _db.moneyDao.getAllCategories();
    final moneyTransactions = await _db.moneyDao.getAllTransactions();
    final taskLists = await _db.taskDao.getAllLists();
    final taskItems = await _db.taskDao.getAllTasks();
    final noteItems = await _db.select(_db.noteItems).get();
    final usageSessions = await _db.usageDao.getAllSessions();
    final documentItems = await _db.documentDao.getAllDocuments();

    final payloadMap = <String, dynamic>{
      'tags': tags.map((t) => t.toJson()).toList(),
      'entity_cross_links': links.map((l) => l.toJson()).toList(),
      'calendar_events': calendarEvents.map((c) => c.toJson()).toList(),
      'money_accounts': moneyAccounts.map((a) => a.toJson()).toList(),
      'money_categories': moneyCategories.map((c) => c.toJson()).toList(),
      'money_transactions': moneyTransactions.map((t) => t.toJson()).toList(),
      'task_lists': taskLists.map((l) => l.toJson()).toList(),
      'task_items': taskItems.map((t) => t.toJson()).toList(),
      'note_items': noteItems.map((n) => n.toJson()).toList(),
      'usage_sessions': usageSessions.map((u) => u.toJson()).toList(),
      'document_items': documentItems.map((d) => d.toJson()).toList(),
    };

    final rawJsonString = jsonEncode(payloadMap);
    final keyBase64 = await _securityService.getOrCreateBackupKey();
    final keyBytes = base64Decode(keyBase64);

    // 2. Encrypt payload
    final encryptedBase64 = _encryptPayload(rawJsonString, keyBytes);

    // 3. Compute HMAC-SHA256 checksum for tamper detection
    final checksum = Hmac(sha256, keyBytes)
        .convert(utf8.encode(encryptedBase64))
        .toString();

    // 4. Construct versioned envelope
    final envelope = BackupEnvelope(
      version: AppConstants.backupFormatVersion,
      timestampUtc: DateTimeUtils.currentUtcMillis(),
      appId: 'com.personal.app.personal_hub',
      appVersion: AppConstants.appVersion,
      checksum: checksum,
      encryptedPayload: encryptedBase64,
      metadata: {
        'schema_version': _db.schemaVersion,
        'tag_count': tags.length,
        'calendar_count': calendarEvents.length,
        'transaction_count': moneyTransactions.length,
        'task_count': taskItems.length,
        'note_count': noteItems.length,
        'document_count': documentItems.length,
      },
    );

    // 5. Write to local app cache and share
    final dir = await getTemporaryDirectory();
    final fileName = 'personal_hub_backup_${DateTime.now().millisecondsSinceEpoch}.phbackup';
    final backupFile = File('${dir.path}/$fileName');
    await backupFile.writeAsString(jsonEncode(envelope.toJson()));

    return backupFile;
  }

  /// Shares the generated backup file so the user can save it anywhere via Android SAF or drive.
  Future<void> shareBackupFile(File backupFile) async {
    final xFile = XFile(backupFile.path, mimeType: 'application/octet-stream');
    await Share.shareXFiles([xFile], subject: 'Personal Hub Encrypted Backup');
  }

  /// Validates a backup file's integrity, version, and contents without modifying the database.
  Future<BackupValidationResult> validateBackupFile(File file) async {
    try {
      if (!await file.exists()) {
        return BackupValidationResult.failure('Backup file does not exist.');
      }

      final content = await file.readAsString();
      final Map<String, dynamic> jsonMap = jsonDecode(content) as Map<String, dynamic>;
      final envelope = BackupEnvelope.fromJson(jsonMap);

      if (envelope.version > AppConstants.backupFormatVersion) {
        return BackupValidationResult.failure(
          'Backup version (${envelope.version}) is newer than current app supported version (${AppConstants.backupFormatVersion}). Please update the app.',
        );
      }

      final keyBase64 = await _securityService.getOrCreateBackupKey();
      final keyBytes = base64Decode(keyBase64);

      // Verify HMAC checksum
      final expectedChecksum = Hmac(sha256, keyBytes)
          .convert(utf8.encode(envelope.encryptedPayload))
          .toString();

      if (expectedChecksum != envelope.checksum) {
        return BackupValidationResult.failure(
          'Backup integrity validation failed: Checksum mismatch or invalid encryption key.',
        );
      }

      // Decrypt and test payload parsing
      final decryptedJson = _decryptPayload(envelope.encryptedPayload, keyBytes);
      final data = jsonDecode(decryptedJson) as Map<String, dynamic>;

      final counts = <String, int>{
        'Calendar Events': (data['calendar_events'] as List?)?.length ?? 0,
        'Transactions': (data['money_transactions'] as List?)?.length ?? 0,
        'Tasks': (data['task_items'] as List?)?.length ?? 0,
        'Notes': (data['note_items'] as List?)?.length ?? 0,
        'Documents': (data['document_items'] as List?)?.length ?? 0,
      };

      return BackupValidationResult(
        isValid: true,
        backupVersion: envelope.version,
        timestampUtc: envelope.timestampUtc,
        appVersion: envelope.appVersion,
        recordCounts: counts,
        decodedData: data,
      );
    } catch (e) {
      return BackupValidationResult.failure('Failed to read or decrypt backup: ${e.toString()}');
    }
  }

  /// Restores verified backup data into the SQLite database inside an atomic transaction.
  /// Existing records are replaced with the backup records.
  Future<void> restoreValidatedBackup(BackupValidationResult validated) async {
    if (!validated.isValid || validated.decodedData == null) {
      throw StateError('Cannot restore an invalid or unverified backup.');
    }

    final data = validated.decodedData!;

    await _db.transaction(() async {
      // 1. Clear existing data in reverse foreign key order
      await _db.delete(_db.entityCrossLinks).go();
      await _db.delete(_db.moneyTransactions).go();
      await _db.delete(_db.taskItems).go();
      await _db.delete(_db.noteItems).go();
      await _db.delete(_db.moneyAccounts).go();
      await _db.delete(_db.moneyCategories).go();
      await _db.delete(_db.calendarEvents).go();
      await _db.delete(_db.taskLists).go();
      // no note folders
      await _db.delete(_db.usageSessions).go();
      await _db.delete(_db.documentItems).go();
      await _db.delete(_db.tags).go();

      // 2. Restore primary entities
      if (data['tags'] is List) {
        for (final item in data['tags'] as List) {
          await _db.into(_db.tags).insert(TagEntry.fromJson(item as Map<String, dynamic>));
        }
      }

      if (data['calendar_events'] is List) {
        for (final item in data['calendar_events'] as List) {
          await _db.into(_db.calendarEvents).insert(CalendarEventEntry.fromJson(item as Map<String, dynamic>));
        }
      }

      if (data['money_accounts'] is List) {
        for (final item in data['money_accounts'] as List) {
          await _db.into(_db.moneyAccounts).insert(MoneyAccountEntry.fromJson(item as Map<String, dynamic>));
        }
      }

      if (data['money_categories'] is List) {
        for (final item in data['money_categories'] as List) {
          await _db.into(_db.moneyCategories).insert(MoneyCategoryEntry.fromJson(item as Map<String, dynamic>));
        }
      }

      if (data['money_transactions'] is List) {
        for (final item in data['money_transactions'] as List) {
          await _db.into(_db.moneyTransactions).insert(MoneyTransactionEntry.fromJson(item as Map<String, dynamic>));
        }
      }

      if (data['task_lists'] is List) {
        for (final item in data['task_lists'] as List) {
          await _db.into(_db.taskLists).insert(TaskListEntry.fromJson(item as Map<String, dynamic>));
        }
      }

      if (data['task_items'] is List) {
        for (final item in data['task_items'] as List) {
          await _db.into(_db.taskItems).insert(TaskItemEntry.fromJson(item as Map<String, dynamic>));
        }
      }

      // no note folders

      if (data['note_items'] is List) {
        for (final item in data['note_items'] as List) {
          await _db.into(_db.noteItems).insert(NoteItemEntry.fromJson(item as Map<String, dynamic>));
        }
      }

      if (data['usage_sessions'] is List) {
        for (final item in data['usage_sessions'] as List) {
          await _db.into(_db.usageSessions).insert(UsageSessionEntry.fromJson(item as Map<String, dynamic>));
        }
      }

      if (data['document_items'] is List) {
        for (final item in data['document_items'] as List) {
          await _db.into(_db.documentItems).insert(DocumentItemEntry.fromJson(item as Map<String, dynamic>));
        }
      }

      if (data['entity_cross_links'] is List) {
        for (final item in data['entity_cross_links'] as List) {
          await _db.into(_db.entityCrossLinks).insert(EntityCrossLink.fromJson(item as Map<String, dynamic>));
        }
      }
    });
  }

  // --- Stream Keystream Encryption / Decryption ---

  String _encryptPayload(String plaintext, Uint8List key) {
    final plaintextBytes = utf8.encode(plaintext);
    final encryptedBytes = _applyKeystream(plaintextBytes, key);
    return base64Encode(encryptedBytes);
  }

  String _decryptPayload(String ciphertextBase64, Uint8List key) {
    final ciphertextBytes = base64Decode(ciphertextBase64);
    final decryptedBytes = _applyKeystream(ciphertextBytes, key);
    return utf8.decode(decryptedBytes);
  }

  /// Cryptographic keystream generator using repetitive HMAC-SHA256 blocks (similar to ChaCha/AES-CTR stream cipher)
  Uint8List _applyKeystream(List<int> input, Uint8List key) {
    final output = Uint8List(input.length);
    var blockIndex = 0;
    var byteOffset = 0;

    while (byteOffset < input.length) {
      final counterBytes = Uint8List(4)..buffer.asByteData().setUint32(0, blockIndex, Endian.big);
      final blockKey = Hmac(sha256, key).convert(counterBytes).bytes;

      for (var i = 0; i < blockKey.length && byteOffset < input.length; i++) {
        output[byteOffset] = input[byteOffset] ^ blockKey[i];
        byteOffset++;
      }
      blockIndex++;
    }

    return output;
  }
}
