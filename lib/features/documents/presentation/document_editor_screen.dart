import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_colorpicker/flutter_colorpicker.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_quill/flutter_quill.dart' as quill;
import 'package:pdf/pdf.dart' as pw_pdf;
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';

import '../../../core/database/app_database.dart';
import '../../../core/providers/core_providers.dart';
import '../models/document_models.dart';
import '../providers/document_providers.dart';
import 'document_page_editor.dart';
import 'page_manager_sheet.dart';

class DocumentEditorScreen extends ConsumerStatefulWidget {
  final String documentId;

  const DocumentEditorScreen({super.key, required this.documentId});

  @override
  ConsumerState<DocumentEditorScreen> createState() => _DocumentEditorScreenState();
}

class _DocumentEditorScreenState extends ConsumerState<DocumentEditorScreen> {
  bool _isDrawingMode = false;
  final PageController _pageController = PageController();
  int _currentPageIndex = 0;

  @override
  void initState() {
    super.initState();
    _pageController.addListener(() {
      final page = _pageController.page?.round() ?? 0;
      if (page != _currentPageIndex) {
        setState(() => _currentPageIndex = page);
      }
    });
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _renameProject(String currentTitle) {
    final controller = TextEditingController(text: currentTitle);
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Rename Project'),
        content: TextField(
          controller: controller,
          decoration: const InputDecoration(labelText: 'Title'),
          autofocus: true,
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          FilledButton(
            onPressed: () {
              final newTitle = controller.text.trim();
              if (newTitle.isNotEmpty) {
                ref.read(documentNotifierProvider).updateProjectTitle(widget.documentId, newTitle);
                Navigator.pop(ctx);
              }
            },
            child: const Text('Rename'),
          ),
        ],
      ),
    );
  }

  Future<void> _exportToPdf() async {
    try {
      final pages = await ref.read(documentPagesProvider(widget.documentId).future);
      final format = ref.read(documentPageFormatProvider);
      final pdf = pw.Document();

      final pw_pdf.PdfPageFormat pdfFormat = format == DocumentPageFormat.letter
          ? pw_pdf.PdfPageFormat.letter
          : format == DocumentPageFormat.square
              ? const pw_pdf.PdfPageFormat(600, 600)
              : pw_pdf.PdfPageFormat.a4;

      if (pages.isEmpty) {
        pdf.addPage(
          pw.Page(
            pageFormat: pdfFormat,
            build: (pw.Context context) {
              return pw.Center(
                child: pw.Text("Empty Document", style: const pw.TextStyle(fontSize: 18)),
              );
            },
          ),
        );
      } else {
        for (int i = 0; i < pages.length; i++) {
          final p = pages[i];
          String textContent = '';
          if (p.textContentJson.isNotEmpty && p.textContentJson != '[]') {
            try {
              final doc = quill.Document.fromJson(jsonDecode(p.textContentJson));
              textContent = doc.toPlainText().trim();
            } catch (_) {
              textContent = '';
            }
          }
          final bgColor = pw_pdf.PdfColor.fromInt(p.backgroundColor);

          // Parse drawing strokes for PDF rendering
          List<Stroke> strokes = [];
          if (p.drawingContentJson.isNotEmpty && p.drawingContentJson != '[]') {
            try {
              final List list = jsonDecode(p.drawingContentJson);
              strokes = list.map((e) => Stroke.fromJson(e)).toList();
            } catch (_) {
              strokes = [];
            }
          }

          pdf.addPage(
            pw.Page(
              pageFormat: pdfFormat,
              build: (pw.Context context) {
                return pw.Container(
                  color: bgColor,
                  padding: const pw.EdgeInsets.all(36),
                  child: pw.Stack(
                    children: [
                      pw.Column(
                        crossAxisAlignment: pw.CrossAxisAlignment.start,
                        children: [
                          pw.Row(
                            mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                            children: [
                              pw.Text(
                                "Page ${i + 1} of ${pages.length}",
                                style: pw.TextStyle(color: pw_pdf.PdfColors.grey600, fontSize: 10),
                              ),
                            ],
                          ),
                          pw.Divider(color: pw_pdf.PdfColors.grey400),
                          pw.SizedBox(height: 12),
                          pw.Text(
                            textContent.isNotEmpty ? textContent : "",
                            style: const pw.TextStyle(fontSize: 13, lineSpacing: 2),
                          ),
                        ],
                      ),
                      if (strokes.isNotEmpty)
                        pw.Positioned.fill(
                          child: pw.CustomPaint(
                            painter: (canvas, size) {
                              for (final stroke in strokes) {
                                if (stroke.points.isEmpty) continue;
                                final strokeColor = pw_pdf.PdfColor.fromInt(stroke.color.value);
                                canvas.setStrokeColor(strokeColor);
                                canvas.setLineWidth(stroke.size);

                                canvas.moveTo(stroke.points.first.x, stroke.points.first.y);
                                for (int j = 1; j < stroke.points.length; j++) {
                                  canvas.lineTo(stroke.points[j].x, stroke.points[j].y);
                                }
                                canvas.strokePath();
                              }
                            },
                          ),
                        ),
                    ],
                  ),
                );
              },
            ),
          );
        }
      }

      await Printing.sharePdf(
        bytes: await pdf.save(),
        filename: 'document_${widget.documentId}.pdf',
      );
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to export PDF: $e')),
        );
      }
    }
  }

  void _showColorPicker(DocumentPageEntry page) {
    Color selectedColor = Color(page.backgroundColor);
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Page Background Color'),
        content: SingleChildScrollView(
          child: BlockPicker(
            pickerColor: selectedColor,
            onColorChanged: (c) => selectedColor = c,
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          FilledButton(
            onPressed: () {
              ref.read(documentNotifierProvider).updatePageBackground(page.id, selectedColor.value);
              Navigator.pop(ctx);
            },
            child: const Text('Apply'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final db = ref.watch(databaseProvider);
    final pagesAsync = ref.watch(documentPagesProvider(widget.documentId));
    final format = ref.watch(documentPageFormatProvider);

    return Scaffold(
      appBar: AppBar(
        title: StreamBuilder(
          stream: (db.select(db.documentItems)..where((d) => d.id.equals(widget.documentId))).watchSingleOrNull(),
          builder: (context, snapshot) {
            final title = snapshot.data?.title ?? 'Editor';
            return InkWell(
              onTap: () => _renameProject(title),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Flexible(
                    child: Text(
                      title,
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  const SizedBox(width: 4),
                  const Icon(Icons.edit, size: 14, color: Colors.grey),
                ],
              ),
            );
          },
        ),
        actions: [
          FilledButton.tonal(
            onPressed: () {
              ScaffoldMessenger.of(context).hideCurrentSnackBar();
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Document changes saved successfully!'),
                  duration: Duration(milliseconds: 1200),
                ),
              );
            },
            style: FilledButton.styleFrom(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            ),
            child: const Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.check, size: 16),
                SizedBox(width: 4),
                Text('Save', style: TextStyle(fontWeight: FontWeight.bold)),
              ],
            ),
          ),
          const SizedBox(width: 4),
          // Mode Toggle (Text Mode <-> Drawing Mode)
          IconButton(
            icon: Icon(
              _isDrawingMode ? Icons.brush : Icons.text_fields,
              color: _isDrawingMode ? theme.colorScheme.primary : null,
            ),
            tooltip: _isDrawingMode ? 'Drawing Mode Active (Tap to Type)' : 'Text Mode Active (Tap to Draw)',
            onPressed: () {
              setState(() => _isDrawingMode = !_isDrawingMode);
              ScaffoldMessenger.of(context).hideCurrentSnackBar();
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  duration: const Duration(milliseconds: 1000),
                  content: Text(_isDrawingMode ? 'Switched to Drawing Mode' : 'Switched to Text Editing Mode'),
                ),
              );
            },
          ),

          // Page Background Color
          IconButton(
            icon: const Icon(Icons.palette_outlined),
            tooltip: 'Page Color',
            onPressed: () {
              pagesAsync.whenData((pages) {
                if (pages.isEmpty) return;
                final page = pages[_currentPageIndex.clamp(0, pages.length - 1)];
                _showColorPicker(page);
              });
            },
          ),

          // Page Format (A4 / Letter / Square)
          PopupMenuButton<DocumentPageFormat>(
            icon: const Icon(Icons.aspect_ratio),
            tooltip: 'Page Format',
            onSelected: (fmt) {
              ref.read(documentPageFormatProvider.notifier).state = fmt;
            },
            itemBuilder: (ctx) => [
              for (var f in DocumentPageFormat.values)
                PopupMenuItem(
                  value: f,
                  child: Row(
                    children: [
                      Icon(f == format ? Icons.check : Icons.crop_portrait, size: 18),
                      const SizedBox(width: 8),
                      Text(f.name),
                    ],
                  ),
                ),
            ],
          ),

          // Export PDF
          IconButton(
            icon: const Icon(Icons.picture_as_pdf),
            tooltip: 'Export as PDF',
            onPressed: _exportToPdf,
          ),
        ],
      ),
      body: pagesAsync.when(
        data: (pages) {
          if (pages.isEmpty) {
            return const Center(child: Text('No pages in this document.'));
          }

          final safePageIndex = _currentPageIndex.clamp(0, pages.length - 1);

          return Column(
            children: [
              // Page View
              Expanded(
                child: PageView.builder(
                  controller: _pageController,
                  physics: _isDrawingMode ? const NeverScrollableScrollPhysics() : const PageScrollPhysics(),
                  itemCount: pages.length,
                  itemBuilder: (context, index) {
                    return DocumentPageEditor(
                      page: pages[index],
                      isDrawingMode: _isDrawingMode,
                      format: format,
                    );
                  },
                ),
              ),

              // Bottom Navigation & Page Manager Bar
              Container(
                height: 52,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                decoration: BoxDecoration(
                  color: theme.colorScheme.surfaceContainerHighest,
                  border: Border(top: BorderSide(color: theme.dividerColor)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    // Previous Page Button
                    IconButton(
                      icon: const Icon(Icons.chevron_left),
                      tooltip: 'Previous Page',
                      onPressed: safePageIndex > 0
                          ? () => _pageController.previousPage(
                                duration: const Duration(milliseconds: 250),
                                curve: Curves.easeInOut,
                              )
                          : null,
                    ),

                    // Page X of Y (Tap to open PageManagerSheet)
                    InkWell(
                      borderRadius: BorderRadius.circular(12),
                      onTap: () {
                        showModalBottomSheet(
                          context: context,
                          isScrollControlled: true,
                          backgroundColor: Colors.transparent,
                          builder: (_) => PageManagerSheet(
                            documentId: widget.documentId,
                            currentPageIndex: safePageIndex,
                            onSelectPage: (idx) {
                              _pageController.jumpToPage(idx);
                            },
                          ),
                        );
                      },
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              'Page ${safePageIndex + 1} of ${pages.length}',
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                            ),
                            const SizedBox(width: 4),
                            const Icon(Icons.layers_outlined, size: 16),
                          ],
                        ),
                      ),
                    ),

                    // Next Page Button
                    IconButton(
                      icon: const Icon(Icons.chevron_right),
                      tooltip: 'Next Page',
                      onPressed: safePageIndex < pages.length - 1
                          ? () => _pageController.nextPage(
                                duration: const Duration(milliseconds: 250),
                                curve: Curves.easeInOut,
                              )
                          : null,
                    ),
                  ],
                ),
              ),
            ],
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, _) => Center(child: Text('Error: $err')),
      ),
    );
  }
}
