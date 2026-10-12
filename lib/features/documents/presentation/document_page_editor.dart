import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_quill/flutter_quill.dart' as quill;
import 'package:perfect_freehand/perfect_freehand.dart';

import '../../../core/database/app_database.dart';
import '../providers/document_providers.dart';

class Stroke {
  final List<PointVector> points;
  final Color color;
  final double size;

  Stroke({required this.points, required this.color, required this.size});

  Map<String, dynamic> toJson() {
    return {
      'points': points.map((p) => {'x': p.x, 'y': p.y}).toList(),
      'color': color.value,
      'size': size,
    };
  }

  factory Stroke.fromJson(Map<String, dynamic> json) {
    var pList = (json['points'] as List).map((p) => PointVector(p['x'], p['y'])).toList();
    return Stroke(
      points: pList,
      color: Color(json['color']),
      size: (json['size'] as num).toDouble(),
    );
  }
}

class DocumentPageEditor extends ConsumerStatefulWidget {
  final DocumentPageEntry page;
  final bool isDrawingMode;

  const DocumentPageEditor({
    super.key,
    required this.page,
    required this.isDrawingMode,
  });

  @override
  ConsumerState<DocumentPageEditor> createState() => _DocumentPageEditorState();
}

class _DocumentPageEditorState extends ConsumerState<DocumentPageEditor> {
  late quill.QuillController _quillController;
  final FocusNode _focusNode = FocusNode();

  List<Stroke> _strokes = [];
  Stroke? _currentStroke;
  Color _drawColor = Colors.red;
  final double _drawSize = 5.0;

  @override
  void initState() {
    super.initState();
    
    // Load text
    if (widget.page.textContentJson != '[]') {
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

    _quillController.document.changes.listen((event) {
      _saveDebounced();
    });

    // Load drawings
    if (widget.page.drawingContentJson != '[]') {
      try {
        final List list = jsonDecode(widget.page.drawingContentJson);
        _strokes = list.map((e) => Stroke.fromJson(e)).toList();
      } catch (e) {
        _strokes = [];
      }
    }
  }

  void _saveDebounced() {
    // Simple direct save for now
    final textJson = jsonEncode(_quillController.document.toDelta().toJson());
    final drawJson = jsonEncode(_strokes.map((s) => s.toJson()).toList());
    ref.read(documentNotifierProvider).updatePageContent(widget.page.id, textJson, drawJson);
  }

  void _onPointerDown(PointerDownEvent event) {
    if (!widget.isDrawingMode) return;
    setState(() {
      _currentStroke = Stroke(
        points: [PointVector(event.localPosition.dx, event.localPosition.dy)],
        color: _drawColor,
        size: _drawSize,
      );
      _strokes.add(_currentStroke!);
    });
  }

  void _onPointerMove(PointerMoveEvent event) {
    if (!widget.isDrawingMode || _currentStroke == null) return;
    setState(() {
      _currentStroke!.points.add(PointVector(event.localPosition.dx, event.localPosition.dy));
    });
  }

  void _onPointerUp(PointerUpEvent event) {
    if (!widget.isDrawingMode || _currentStroke == null) return;
    setState(() {
      _currentStroke = null;
    });
    _saveDebounced();
  }

  @override
  Widget build(BuildContext context) {
    final bgColor = Color(widget.page.backgroundColor);

    return Column(
      children: [
        if (!widget.isDrawingMode)
          quill.QuillSimpleToolbar(
            controller: _quillController,
            configurations: const quill.QuillSimpleToolbarConfigurations(
              showDividers: false,
              showFontFamily: false,
              showSearchButton: false,
              showInlineCode: false,
              showCodeBlock: false,
            ),
          ),
        if (widget.isDrawingMode)
          Container(
            color: Theme.of(context).colorScheme.surfaceContainer,
            padding: const EdgeInsets.all(8),
            child: Row(
              children: [
                IconButton(
                  icon: const Icon(Icons.undo),
                  onPressed: () {
                    if (_strokes.isNotEmpty) {
                      setState(() {
                        _strokes.removeLast();
                      });
                      _saveDebounced();
                    }
                  },
                ),
                IconButton(
                  icon: const Icon(Icons.delete_outline),
                  onPressed: () {
                    setState(() {
                      _strokes.clear();
                    });
                    _saveDebounced();
                  },
                ),
                const Spacer(),
                IconButton(
                  icon: const Icon(Icons.circle, color: Colors.black),
                  onPressed: () => setState(() => _drawColor = Colors.black),
                ),
                IconButton(
                  icon: const Icon(Icons.circle, color: Colors.red),
                  onPressed: () => setState(() => _drawColor = Colors.red),
                ),
                IconButton(
                  icon: const Icon(Icons.circle, color: Colors.blue),
                  onPressed: () => setState(() => _drawColor = Colors.blue),
                ),
              ],
            ),
          ),
        Expanded(
          child: AspectRatio(
            aspectRatio: 1 / 1.414, // A4 ratio
            child: Container(
              margin: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: bgColor,
                boxShadow: const [
                  BoxShadow(
                    color: Colors.black12,
                    blurRadius: 10,
                    offset: Offset(0, 5),
                  )
                ],
              ),
              child: Stack(
                children: [
                  // Quill Text Layer
                  Padding(
                    padding: const EdgeInsets.all(24.0),
                    child: IgnorePointer(
                      ignoring: widget.isDrawingMode,
                      child: quill.QuillEditor.basic(
                        controller: _quillController,
                        focusNode: _focusNode,
                        configurations: const quill.QuillEditorConfigurations(
                          placeholder: 'Start writing...',
                        ),
                      ),
                    ),
                  ),
                  
                  // Drawing Layer
                  Positioned.fill(
                    child: Listener(
                      onPointerDown: _onPointerDown,
                      onPointerMove: _onPointerMove,
                      onPointerUp: _onPointerUp,
                      behavior: HitTestBehavior.translucent,
                      child: IgnorePointer(
                        ignoring: !widget.isDrawingMode,
                        child: CustomPaint(
                          painter: FreehandPainter(strokes: _strokes),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class FreehandPainter extends CustomPainter {
  final List<Stroke> strokes;

  FreehandPainter({required this.strokes});

  @override
  void paint(Canvas canvas, Size size) {
    for (final stroke in strokes) {
      if (stroke.points.isEmpty) continue;
      
      final outlinePoints = getStroke(
        stroke.points,
        options: StrokeOptions(
          size: stroke.size,
          thinning: 0.5,
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
        ..color = stroke.color
        ..style = PaintingStyle.fill;
      
      canvas.drawPath(path, paint);
    }
  }

  @override
  bool shouldRepaint(covariant FreehandPainter oldDelegate) {
    return true; // Simplified for this prototype
  }
}
