import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:uuid/uuid.dart';
import 'package:drift/drift.dart' as drift;

import '../../../core/database/app_database.dart';
import '../../../core/providers/core_providers.dart';
import '../models/document_models.dart';

// Current active page format (A4 default)
final documentPageFormatProvider = StateProvider<DocumentPageFormat>((ref) => DocumentPageFormat.a4);

// Provider for all document projects
final allDocumentsProvider = StreamProvider<List<DocumentItemEntry>>((ref) {
  final db = ref.watch(databaseProvider);
  return db.documentDao.watchAllDocuments();
});

// Provider for pages of a specific document
final documentPagesProvider = StreamProvider.family<List<DocumentPageEntry>, String>((ref, documentId) {
  final db = ref.watch(databaseProvider);
  return db.documentDao.watchPagesForDocument(documentId);
});

class DocumentNotifier {
  final AppDatabase _db;
  Timer? _debounceTimer;

  DocumentNotifier(this._db);

  Future<String> createProject(String title) async {
    final docId = const Uuid().v4();
    final now = DateTime.now().toUtc().millisecondsSinceEpoch;

    await _db.documentDao.insertDocument(
      DocumentItemsCompanion.insert(
        id: docId,
        title: title,
        createdAtUtc: now,
        updatedAtUtc: now,
      ),
    );

    // Create initial page
    await addPage(docId, 0);
    return docId;
  }

  Future<void> addPage(String documentId, int index) async {
    final pageId = const Uuid().v4();
    await _db.documentDao.insertPage(
      DocumentPagesCompanion.insert(
        id: pageId,
        documentId: documentId,
        pageIndex: index,
        backgroundColor: const drift.Value(0xFFFFFFFF), // Default white
      ),
    );

    await _touchDocument(documentId);
  }

  Future<void> duplicatePage(DocumentPageEntry page) async {
    final pages = await _db.documentDao.getPagesForDocument(page.documentId);
    final targetIndex = page.pageIndex + 1;

    // Shift subsequent pages
    for (var p in pages) {
      if (p.pageIndex >= targetIndex) {
        await _db.documentDao.updatePage(p.copyWith(pageIndex: p.pageIndex + 1));
      }
    }

    final newPageId = const Uuid().v4();
    await _db.documentDao.insertPage(
      DocumentPagesCompanion.insert(
        id: newPageId,
        documentId: page.documentId,
        pageIndex: targetIndex,
        backgroundColor: drift.Value(page.backgroundColor),
        textContentJson: drift.Value(page.textContentJson),
        drawingContentJson: drift.Value(page.drawingContentJson),
      ),
    );

    await _touchDocument(page.documentId);
  }

  Future<void> deletePage(String pageId, String documentId) async {
    final pages = await _db.documentDao.getPagesForDocument(documentId);
    if (pages.length <= 1) return; // Prevent deleting only page

    await _db.documentDao.deletePage(pageId);

    // Re-index remaining pages
    final remainingPages = await _db.documentDao.getPagesForDocument(documentId);
    for (int i = 0; i < remainingPages.length; i++) {
      if (remainingPages[i].pageIndex != i) {
        await _db.documentDao.updatePage(remainingPages[i].copyWith(pageIndex: i));
      }
    }

    await _touchDocument(documentId);
  }

  Future<void> reorderPages(String documentId, int oldIndex, int newIndex) async {
    final pages = await _db.documentDao.getPagesForDocument(documentId);
    if (oldIndex < 0 || oldIndex >= pages.length || newIndex < 0 || newIndex >= pages.length) return;

    final movedPage = pages.removeAt(oldIndex);
    pages.insert(newIndex, movedPage);

    for (int i = 0; i < pages.length; i++) {
      await _db.documentDao.updatePage(pages[i].copyWith(pageIndex: i));
    }

    await _touchDocument(documentId);
  }

  Future<void> updateProjectTitle(String documentId, String title) async {
    final doc = await (_db.select(_db.documentItems)..where((d) => d.id.equals(documentId))).getSingleOrNull();
    if (doc != null) {
      await _db.documentDao.updateDocument(
        doc.copyWith(
          title: title,
          updatedAtUtc: DateTime.now().toUtc().millisecondsSinceEpoch,
        ),
      );
    }
  }

  void updatePageContent(String pageId, String textJson, String drawingJson) {
    _debounceTimer?.cancel();
    _debounceTimer = Timer(const Duration(milliseconds: 350), () async {
      final page = await (_db.select(_db.documentPages)..where((p) => p.id.equals(pageId))).getSingleOrNull();
      if (page != null) {
        await _db.documentDao.updatePage(
          page.copyWith(
            textContentJson: textJson,
            drawingContentJson: drawingJson,
          ),
        );
        await _touchDocument(page.documentId);
      }
    });
  }

  Future<void> updatePageBackground(String pageId, int colorValue) async {
    final page = await (_db.select(_db.documentPages)..where((p) => p.id.equals(pageId))).getSingleOrNull();
    if (page != null) {
      await _db.documentDao.updatePage(
        page.copyWith(
          backgroundColor: colorValue,
        ),
      );
      await _touchDocument(page.documentId);
    }
  }

  Future<void> deleteDocument(String id) async {
    await _db.documentDao.deleteDocument(id);
  }

  Future<void> duplicateDocument(DocumentItemEntry original) async {
    final newDocId = const Uuid().v4();
    final now = DateTime.now().toUtc().millisecondsSinceEpoch;

    await _db.documentDao.insertDocument(
      DocumentItemsCompanion.insert(
        id: newDocId,
        title: '${original.title} (Copy)',
        createdAtUtc: now,
        updatedAtUtc: now,
      ),
    );

    final pages = await _db.documentDao.getPagesForDocument(original.id);
    for (var page in pages) {
      await _db.documentDao.insertPage(
        DocumentPagesCompanion.insert(
          id: const Uuid().v4(),
          documentId: newDocId,
          pageIndex: page.pageIndex,
          backgroundColor: drift.Value(page.backgroundColor),
          textContentJson: drift.Value(page.textContentJson),
          drawingContentJson: drift.Value(page.drawingContentJson),
        ),
      );
    }
  }

  Future<void> _touchDocument(String documentId) async {
    final doc = await (_db.select(_db.documentItems)..where((d) => d.id.equals(documentId))).getSingleOrNull();
    if (doc != null) {
      await _db.documentDao.updateDocument(
        doc.copyWith(updatedAtUtc: DateTime.now().toUtc().millisecondsSinceEpoch),
      );
    }
  }
}

final documentNotifierProvider = Provider<DocumentNotifier>((ref) {
  return DocumentNotifier(ref.watch(databaseProvider));
});
