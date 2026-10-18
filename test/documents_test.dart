import 'package:drift/native.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:perfect_freehand/perfect_freehand.dart';
import 'package:personal_hub/core/database/app_database.dart';
import 'package:personal_hub/features/documents/models/document_models.dart';
import 'package:personal_hub/features/documents/providers/document_providers.dart';

void main() {
  group('Stage 8 — Mobile Document Editor and Drawing Tests', () {
    late AppDatabase db;
    late DocumentNotifier notifier;

    setUp(() {
      db = AppDatabase(NativeDatabase.memory());
      notifier = DocumentNotifier(db);
    });

    tearDown(() async {
      await db.close();
    });

    test('Project creation creates document and initial page', () async {
      final docId = await notifier.createProject('Annual Report');
      expect(docId, isNotEmpty);

      final doc = await db.documentDao.getDocumentById(docId);
      expect(doc, isNotNull);
      expect(doc!.title, equals('Annual Report'));

      final pages = await db.documentDao.getPagesForDocument(docId);
      expect(pages.length, equals(1));
      expect(pages.first.pageIndex, equals(0));
      expect(pages.first.backgroundColor, equals(0xFFFFFFFF)); // Default white
    });

    test('Page CRUD: add, duplicate, reorder, and delete pages', () async {
      final docId = await notifier.createProject('Design Brief');

      // Add Page 2
      await notifier.addPage(docId, 1);
      var pages = await db.documentDao.getPagesForDocument(docId);
      expect(pages.length, equals(2));
      expect(pages[0].pageIndex, equals(0));
      expect(pages[1].pageIndex, equals(1));

      // Duplicate Page 1
      await notifier.duplicatePage(pages[0]);
      pages = await db.documentDao.getPagesForDocument(docId);
      expect(pages.length, equals(3));
      expect(pages[0].pageIndex, equals(0));
      expect(pages[1].pageIndex, equals(1));
      expect(pages[2].pageIndex, equals(2));

      // Reorder pages (move page 0 to index 2)
      await notifier.reorderPages(docId, 0, 2);
      pages = await db.documentDao.getPagesForDocument(docId);
      expect(pages.length, equals(3));
      for (int i = 0; i < pages.length; i++) {
        expect(pages[i].pageIndex, equals(i));
      }

      // Delete Page (from 3 pages down to 2)
      await notifier.deletePage(pages[1].id, docId);
      pages = await db.documentDao.getPagesForDocument(docId);
      expect(pages.length, equals(2));
      expect(pages[0].pageIndex, equals(0));
      expect(pages[1].pageIndex, equals(1));
    });

    test('Independent page background colors', () async {
      final docId = await notifier.createProject('Multi-Color Doc');
      await notifier.addPage(docId, 1);

      var pages = await db.documentDao.getPagesForDocument(docId);
      expect(pages.length, equals(2));

      // Change background color of Page 1 to Yellow (0xFFFFF59D)
      await notifier.updatePageBackground(pages[0].id, 0xFFFFF59D);

      // Change background color of Page 2 to Sky Blue (0xFFE1F5FE)
      await notifier.updatePageBackground(pages[1].id, 0xFFE1F5FE);

      pages = await db.documentDao.getPagesForDocument(docId);
      expect(pages[0].backgroundColor, equals(0xFFFFF59D));
      expect(pages[1].backgroundColor, equals(0xFFE1F5FE));
      expect(pages[0].backgroundColor != pages[1].backgroundColor, isTrue);
    });

    test('Project rename, duplication, and cascade deletion', () async {
      final docId = await notifier.createProject('Original Document');
      await notifier.addPage(docId, 1);

      // Rename
      await notifier.updateProjectTitle(docId, 'Renamed Document');
      var doc = await db.documentDao.getDocumentById(docId);
      expect(doc!.title, equals('Renamed Document'));

      // Duplicate Project
      await notifier.duplicateDocument(doc);
      final allDocs = await db.documentDao.getAllDocuments();
      expect(allDocs.length, equals(2));
      final copyDoc = allDocs.where((d) => d.id != docId).first;
      expect(copyDoc.title, equals('Renamed Document (Copy)'));

      final copyPages = await db.documentDao.getPagesForDocument(copyDoc.id);
      expect(copyPages.length, equals(2));

      // Delete Project
      await notifier.deleteDocument(docId);
      final remainingDocs = await db.documentDao.getAllDocuments();
      expect(remainingDocs.length, equals(1));
      expect(remainingDocs.first.id, equals(copyDoc.id));

      final deletedPages = await db.documentDao.getPagesForDocument(docId);
      expect(deletedPages, isEmpty);
    });

    test('Stroke vector model JSON serialization and tool types', () {
      final stroke = Stroke(
        points: [
          PointVector(10.0, 20.0),
          PointVector(30.0, 45.0),
          PointVector(50.0, 60.0),
        ],
        color: const Color(0xFFEF4444),
        size: 6.0,
        opacity: 0.85,
        tool: DrawingTool.highlighter,
      );

      final json = stroke.toJson();
      expect(json['size'], equals(6.0));
      expect(json['opacity'], equals(0.85));
      expect(json['tool'], equals('highlighter'));

      final restored = Stroke.fromJson(json);
      expect(restored.points.length, equals(3));
      expect(restored.points[0].x, equals(10.0));
      expect(restored.points[0].y, equals(20.0));
      expect(restored.size, equals(6.0));
      expect(restored.opacity, equals(0.85));
      expect(restored.tool, equals(DrawingTool.highlighter));
    });

    test('DocumentPageFormat aspects and dimensions', () {
      expect(DocumentPageFormat.a4.name, equals('A4'));
      expect(DocumentPageFormat.a4.aspectRatio, closeTo(0.707, 0.01));

      expect(DocumentPageFormat.letter.name, equals('US Letter'));
      expect(DocumentPageFormat.letter.aspectRatio, closeTo(0.772, 0.01));

      expect(DocumentPageFormat.square.name, equals('Square'));
      expect(DocumentPageFormat.square.aspectRatio, equals(1.0));
    });
  });
}
