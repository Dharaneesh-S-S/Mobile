import 'dart:convert';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter_colorpicker/flutter_colorpicker.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_quill/flutter_quill.dart' as quill;
import 'package:perfect_freehand/perfect_freehand.dart';

import '../../../core/database/app_database.dart';
import '../models/document_models.dart';
import '../providers/document_providers.dart';

class DocumentPageEditor extends ConsumerStatefulWidget {
  final DocumentPageEntry page;
  final bool isDrawingMode;
  final DocumentPageFormat format;

  const DocumentPageEditor({
    super.key,
    required this.page,
    required this.isDrawingMode,
    this.format = DocumentPageFormat.a4,
  });

  @override
  ConsumerState<DocumentPageEditor> createState() => _DocumentPageEditorState();
}

class _DocumentPageEditorState extends ConsumerState<DocumentPageEditor> {
  late quill.QuillController _quillController;
  final FocusNode _focusNode = FocusNode();

  List<Stroke> _strokes = [];
  final List<List<Stroke>> _undoStack = [];
  final List<List<Stroke>> _redoStack = [];

  Stroke? _currentStroke;
  DrawingTool _selectedTool = DrawingTool.pen;
  Color _drawColor = const Color(0xFF1E293B);
  double _strokeWidth = 4.0;
  double _strokeOpacity = 1.0;

  @override
  void initState() {
    super.initState();
    _initQuill();
    _loadDrawings();
  }

  @override
  void didUpdateWidget(covariant DocumentPageEditor oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.page.id != widget.page.id) {
      _initQuill();
      _loadDrawings();
    }
  }

  void _initQuill() {
    if (widget.page.textContentJson.isNotEmpty && widget.page.textContentJson != '[]') {
      try {
        final doc = quill.Document.fromJson(jsonDecode(widget.page.textContentJson));
        _quillController = quill.QuillController(
          document: doc,
          selection: const TextSelection.collapsed(offset: 0),
        );
      } catch (e) {
        _quillController = quill.QuillController.basic();
      }
    } else {
      _quillController = quill.QuillController.basic();
    }

    _quillController.document.changes.listen((_) {
      _saveDebounced();
    });
  }

  void _loadDrawings() {
    if (widget.page.drawingContentJson.isNotEmpty && widget.page.drawingContentJson != '[]') {
      try {
        final List list = jsonDecode(widget.page.drawingContentJson);
        _strokes = list.map((e) => Stroke.fromJson(e)).toList();
      } catch (_) {
        _strokes = [];
      }
    } else {
      _strokes = [];
    }
    _undoStack.clear();
    _redoStack.clear();
  }

  void _saveDebounced() {
    final textJson = jsonEncode(_quillController.document.toDelta().toJson());
    final drawJson = jsonEncode(_strokes.map((s) => s.toJson()).toList());
    ref.read(documentNotifierProvider).updatePageContent(widget.page.id, textJson, drawJson);
  }

  void _recordDrawingState() {
    _undoStack.add(List<Stroke>.from(_strokes.map((s) => s.copyWith(points: List.from(s.points)))));
    _redoStack.clear();
  }

  void _undoDrawing() {
    if (_undoStack.isNotEmpty) {
      _redoStack.add(List<Stroke>.from(_strokes));
      setState(() {
        _strokes = _undoStack.removeLast();
      });
      _saveDebounced();
    }
  }

  void _redoDrawing() {
    if (_redoStack.isNotEmpty) {
      _undoStack.add(List<Stroke>.from(_strokes));
      setState(() {
        _strokes = _redoStack.removeLast();
      });
      _saveDebounced();
    }
  }

  void _clearDrawingWithConfirmation() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Clear Drawing Layer?'),
        content: const Text('Are you sure you want to erase all drawings on this page? Your typed text will not be touched.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          FilledButton(
            style: FilledButton.styleFrom(backgroundColor: Colors.red),
            onPressed: () {
              Navigator.pop(ctx);
              _recordDrawingState();
              setState(() {
                _strokes.clear();
              });
              _saveDebounced();
            },
            child: const Text('Clear Drawings'),
          ),
        ],
      ),
    );
  }

  void _onPointerDown(PointerDownEvent event) {
    if (!widget.isDrawingMode) return;

    if (_selectedTool == DrawingTool.eraser) {
      _eraseAtPoint(event.localPosition);
      return;
    }

    _recordDrawingState();

    double effectiveSize = _strokeWidth;
    double effectiveOpacity = _strokeOpacity;

    if (_selectedTool == DrawingTool.pencil) {
      effectiveSize = max(1.5, _strokeWidth * 0.6);
      effectiveOpacity = 0.8;
    } else if (_selectedTool == DrawingTool.highlighter) {
      effectiveSize = max(14.0, _strokeWidth * 2.5);
      effectiveOpacity = 0.35;
    }

    setState(() {
      _currentStroke = Stroke(
        points: [PointVector(event.localPosition.dx, event.localPosition.dy)],
        color: _drawColor,
        size: effectiveSize,
        opacity: effectiveOpacity,
        tool: _selectedTool,
      );
      _strokes.add(_currentStroke!);
    });
  }

  void _onPointerMove(PointerMoveEvent event) {
    if (!widget.isDrawingMode) return;

    if (_selectedTool == DrawingTool.eraser) {
      _eraseAtPoint(event.localPosition);
      return;
    }

    if (_currentStroke == null) return;
    setState(() {
      _currentStroke!.points.add(PointVector(event.localPosition.dx, event.localPosition.dy));
    });
  }

  void _onPointerUp(PointerUpEvent event) {
    if (!widget.isDrawingMode) return;
    if (_currentStroke != null) {
      setState(() {
        _currentStroke = null;
      });
      _saveDebounced();
    }
  }

  void _eraseAtPoint(Offset point) {
    const double eraseRadius = 20.0;
    bool erasedAny = false;

    final updatedStrokes = <Stroke>[];
    for (final s in _strokes) {
      bool intersects = false;
      for (final p in s.points) {
        final dist = sqrt(pow(p.x - point.dx, 2) + pow(p.y - point.dy, 2));
        if (dist <= eraseRadius) {
          intersects = true;
          erasedAny = true;
          break;
        }
      }
      if (!intersects) {
        updatedStrokes.add(s);
      }
    }

    if (erasedAny) {
      _recordDrawingState();
      setState(() {
        _strokes = updatedStrokes;
      });
      _saveDebounced();
    }
  }

  void _showColorPicker() {
    Color tempColor = _drawColor;
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Stroke Color'),
        content: SingleChildScrollView(
          child: BlockPicker(
            pickerColor: tempColor,
            onColorChanged: (c) => tempColor = c,
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          FilledButton(
            onPressed: () {
              setState(() => _drawColor = tempColor);
              Navigator.pop(ctx);
            },
            child: const Text('Apply'),
          ),
        ],
      ),
    );
  }

  void _showBrushSettings() {
    showModalBottomSheet(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setSheetState) {
          return Padding(
            padding: const EdgeInsets.all(20.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Brush Settings', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                const SizedBox(height: 16),
                Row(
                  children: [
                    const Text('Size: '),
                    Expanded(
                      child: Slider(
                        value: _strokeWidth,
                        min: 1.0,
                        max: 30.0,
                        divisions: 29,
                        label: '${_strokeWidth.round()}px',
                        onChanged: (val) {
                          setSheetState(() => _strokeWidth = val);
                          setState(() {});
                        },
                      ),
                    ),
                    Text('${_strokeWidth.round()}px', style: const TextStyle(fontWeight: FontWeight.bold)),
                  ],
                ),
                Row(
                  children: [
                    const Text('Opacity: '),
                    Expanded(
                      child: Slider(
                        value: _strokeOpacity,
                        min: 0.1,
                        max: 1.0,
                        divisions: 9,
                        label: '${(_strokeOpacity * 100).round()}%',
                        onChanged: (val) {
                          setSheetState(() => _strokeOpacity = val);
                          setState(() {});
                        },
                      ),
                    ),
                    Text('${(_strokeOpacity * 100).round()}%', style: const TextStyle(fontWeight: FontWeight.bold)),
                  ],
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final bgColor = Color(widget.page.backgroundColor);

    return Column(
      children: [
        // Top Formatting Bar: Text Toolbar OR Drawing Tools Bar
        if (!widget.isDrawingMode)
          Container(
            color: theme.colorScheme.surfaceContainer,
            child: quill.QuillSimpleToolbar(
              controller: _quillController,
              configurations: const quill.QuillSimpleToolbarConfigurations(
                showDividers: true,
                showFontFamily: false,
                showInlineCode: false,
                showCodeBlock: false,
                showSearchButton: false,
                showSubscript: false,
                showSuperscript: false,
                showQuote: true,
                showListCheck: true,
              ),
            ),
          )
        else
          Container(
            color: theme.colorScheme.surfaceContainer,
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  // Pen Tool
                  IconButton(
                    icon: Icon(Icons.edit, color: _selectedTool == DrawingTool.pen ? theme.colorScheme.primary : null),
                    tooltip: 'Pen',
                    onPressed: () => setState(() => _selectedTool = DrawingTool.pen),
                  ),

                  // Pencil Tool
                  IconButton(
                    icon: Icon(Icons.brush_outlined, color: _selectedTool == DrawingTool.pencil ? theme.colorScheme.primary : null),
                    tooltip: 'Pencil Brush',
                    onPressed: () => setState(() => _selectedTool = DrawingTool.pencil),
                  ),

                  // Highlighter Tool
                  IconButton(
                    icon: Icon(Icons.highlight, color: _selectedTool == DrawingTool.highlighter ? theme.colorScheme.primary : null),
                    tooltip: 'Highlighter',
                    onPressed: () => setState(() => _selectedTool = DrawingTool.highlighter),
                  ),

                  // Eraser Tool
                  IconButton(
                    icon: Icon(Icons.auto_fix_normal_outlined, color: _selectedTool == DrawingTool.eraser ? theme.colorScheme.primary : null),
                    tooltip: 'Eraser',
                    onPressed: () => setState(() => _selectedTool = DrawingTool.eraser),
                  ),

                  const VerticalDivider(width: 16),

                  // Color Indicator / Picker
                  InkWell(
                    onTap: _showColorPicker,
                    borderRadius: BorderRadius.circular(16),
                    child: Container(
                      width: 28,
                      height: 28,
                      decoration: BoxDecoration(
                        color: _drawColor,
                        shape: BoxShape.circle,
                        border: Border.all(color: Colors.white, width: 2),
                        boxShadow: const [BoxShadow(color: Colors.black26, blurRadius: 4)],
                      ),
                    ),
                  ),

                  const SizedBox(width: 8),

                  // Brush Settings (Size / Opacity)
                  IconButton(
                    icon: const Icon(Icons.tune),
                    tooltip: 'Brush Settings',
                    onPressed: _showBrushSettings,
                  ),

                  const VerticalDivider(width: 16),

                  // Undo Drawing
                  IconButton(
                    icon: const Icon(Icons.undo),
                    tooltip: 'Undo Stroke',
                    onPressed: _undoStack.isNotEmpty ? _undoDrawing : null,
                  ),

                  // Redo Drawing
                  IconButton(
                    icon: const Icon(Icons.redo),
                    tooltip: 'Redo Stroke',
                    onPressed: _redoStack.isNotEmpty ? _redoDrawing : null,
                  ),

                  // Clear Drawing Layer
                  IconButton(
                    icon: const Icon(Icons.delete_sweep_outlined, color: Colors.redAccent),
                    tooltip: 'Clear Drawings',
                    onPressed: _strokes.isNotEmpty ? _clearDrawingWithConfirmation : null,
                  ),
                ],
              ),
            ),
          ),

        // Main Document Page with A4 / Custom Aspect Ratio
        Expanded(
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 12),
              child: Center(
                child: AspectRatio(
                  aspectRatio: widget.format.aspectRatio,
                  child: Container(
                    decoration: BoxDecoration(
                      color: bgColor,
                      borderRadius: BorderRadius.circular(4),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.15),
                          blurRadius: 12,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Stack(
                      children: [
                        // Layer 1: Text Layer (Quill Editor)
                        Padding(
                          padding: const EdgeInsets.all(28.0),
                          child: IgnorePointer(
                            ignoring: widget.isDrawingMode,
                            child: quill.QuillEditor.basic(
                              controller: _quillController,
                              focusNode: _focusNode,
                              configurations: const quill.QuillEditorConfigurations(
                                placeholder: 'Start typing your document...',
                              ),
                            ),
                          ),
                        ),

                        // Layer 2: Drawing Canvas Layer (Overlay)
                        Positioned.fill(
                          child: Listener(
                            onPointerDown: _onPointerDown,
                            onPointerMove: _onPointerMove,
                            onPointerUp: _onPointerUp,
                            behavior: HitTestBehavior.translucent,
                            child: IgnorePointer(
                              ignoring: !widget.isDrawingMode,
                              child: CustomPaint(
                                painter: FreehandVectorPainter(strokes: _strokes),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class FreehandVectorPainter extends CustomPainter {
  final List<Stroke> strokes;

  FreehandVectorPainter({required this.strokes});

  @override
  void paint(Canvas canvas, Size size) {
    for (final stroke in strokes) {
      if (stroke.points.isEmpty) continue;

      final outlinePoints = getStroke(
        stroke.points,
        options: StrokeOptions(
          size: stroke.size,
          thinning: stroke.tool == DrawingTool.pencil ? 0.7 : 0.4,
          smoothing: 0.5,
          streamline: 0.5,
        ),
      );

      final path = Path();
      if (outlinePoints.isNotEmpty) {
        path.moveTo(outlinePoints.first.dx, outlinePoints.first.dy);
        for (int i = 1; i < outlinePoints.length; ++i) {
          path.lineTo(outlinePoints[i].dx, outlinePoints[i].dy);
        }
        path.close();
      }

      final paint = Paint()
        ..color = stroke.color.withOpacity(stroke.opacity)
        ..style = PaintingStyle.fill;

      canvas.drawPath(path, paint);
    }
  }

  @override
  bool shouldRepaint(covariant FreehandVectorPainter oldDelegate) {
    return true;
  }
}
