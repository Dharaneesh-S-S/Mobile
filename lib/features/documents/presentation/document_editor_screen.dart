import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_colorpicker/flutter_colorpicker.dart';
import 'package:flutter_quill/flutter_quill.dart' as quill;
import 'package:pdf/pdf.dart' as pw_pdf;
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';

import '../providers/document_providers.dart';
import 'document_page_editor.dart';

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

  Future<void> _exportToPdf() async {
    try {
      final pages = await ref.read(documentPagesProvider(widget.documentId).future);
      final pdf = pw.Document();

      if (pages.isEmpty) {
        pdf.addPage(
          pw.Page(
            pageFormat: pw_pdf.PdfPageFormat.a4,
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

          pdf.addPage(
            pw.Page(
              pageFormat: pw_pdf.PdfPageFormat.a4,
              build: (pw.Context context) {
                return pw.Container(
                  color: bgColor,
                  padding: const pw.EdgeInsets.all(32),
                  child: pw.Column(
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
                        textContent.isNotEmpty ? textContent : "(Blank Page)",
                        style: const pw.TextStyle(fontSize: 14),
                      ),
                    ],
                  ),
                );
              },
            ),
          );
        }
      }

      await Printing.sharePdf(bytes: await pdf.save(), filename: 'document_${widget.documentId}.pdf');
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to export PDF: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final pagesAsync = ref.watch(documentPagesProvider(widget.documentId));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Editor'),
        actions: [
          IconButton(
            icon: Icon(_isDrawingMode ? Icons.edit_off : Icons.draw),
            tooltip: 'Toggle Drawing Mode',
            onPressed: () {
              setState(() {
                _isDrawingMode = !_isDrawingMode;
              });
            },
          ),
          IconButton(
            icon: const Icon(Icons.picture_as_pdf),
            tooltip: 'Export PDF',
            onPressed: _exportToPdf,
          ),
          IconButton(
            icon: const Icon(Icons.color_lens),
            tooltip: 'Change Background Color',
            onPressed: () {
              pagesAsync.whenData((pages) {
                if (pages.isEmpty) return;
                final page = pages[_currentPageIndex];
                Color selectedColor = Color(page.backgroundColor);
                showDialog(
                  context: context,
                  builder: (context) => AlertDialog(
                    title: const Text('Page Color'),
                    content: SingleChildScrollView(
                      child: BlockPicker(
                        pickerColor: selectedColor,
                        onColorChanged: (c) => selectedColor = c,
                      ),
                    ),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(context),
                        child: const Text('Cancel'),
                      ),
                      FilledButton(
                        onPressed: () {
                          ref.read(documentNotifierProvider).updatePageBackground(page.id, selectedColor.value);
                          Navigator.pop(context);
                        },
                        child: const Text('Apply'),
                      ),
                    ],
                  ),
                );
              });
            },
          ),
          IconButton(
            icon: const Icon(Icons.note_add_outlined),
            tooltip: 'Add Page',
            onPressed: () {
              pagesAsync.whenData((pages) {
                ref.read(documentNotifierProvider).addPage(widget.documentId, pages.length);
              });
            },
          ),
        ],
      ),
      body: pagesAsync.when(
        data: (pages) {
          if (pages.isEmpty) {
            return const Center(child: Text('No pages'));
          }
          return PageView.builder(
            controller: _pageController,
            scrollDirection: Axis.vertical,
            itemCount: pages.length,
            itemBuilder: (context, index) {
              return DocumentPageEditor(
                page: pages[index],
                isDrawingMode: _isDrawingMode,
              );
            },
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, _) => Center(child: Text('Error: $err')),
      ),
    );
  }
}
