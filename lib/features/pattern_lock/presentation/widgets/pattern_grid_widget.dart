import 'package:flutter/material.dart';

/// A sleek, tactile 3x3 pattern lock grid widget with line drawing and error feedback.
class PatternGridWidget extends StatefulWidget {
  final int dimension;
  final ValueChanged<String> onPatternComplete;
  final bool isError;
  final VoidCallback? onClearError;

  const PatternGridWidget({
    super.key,
    this.dimension = 3,
    required this.onPatternComplete,
    this.isError = false,
    this.onClearError,
  });

  @override
  State<PatternGridWidget> createState() => _PatternGridWidgetState();
}

class _PatternGridWidgetState extends State<PatternGridWidget> {
  final List<int> _selectedDots = [];
  Offset? _currentTouchPosition;

  void _handlePanStart(DragStartDetails details, BoxConstraints constraints) {
    if (widget.isError) {
      widget.onClearError?.call();
    }
    setState(() {
      _selectedDots.clear();
      _currentTouchPosition = details.localPosition;
    });
    _checkDotHit(details.localPosition, constraints);
  }

  void _handlePanUpdate(DragUpdateDetails details, BoxConstraints constraints) {
    setState(() {
      _currentTouchPosition = details.localPosition;
    });
    _checkDotHit(details.localPosition, constraints);
  }

  void _handlePanEnd(DragEndDetails details) {
    if (_selectedDots.isNotEmpty) {
      final patternString = _selectedDots.join();
      widget.onPatternComplete(patternString);
    }
    setState(() {
      _currentTouchPosition = null;
    });
  }

  void _checkDotHit(Offset localPosition, BoxConstraints constraints) {
    final size = constraints.maxWidth;
    final dotSpacing = size / widget.dimension;
    final hitRadius = dotSpacing * 0.35;

    for (int row = 0; row < widget.dimension; row++) {
      for (int col = 0; col < widget.dimension; col++) {
        final dotIndex = row * widget.dimension + col;
        if (_selectedDots.contains(dotIndex)) continue;

        final center = Offset(
          (col + 0.5) * dotSpacing,
          (row + 0.5) * dotSpacing,
        );

        if ((localPosition - center).distance <= hitRadius) {
          setState(() {
            _selectedDots.add(dotIndex);
          });
          return;
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final lineColor = widget.isError
        ? theme.colorScheme.error
        : theme.colorScheme.primary;
    final dotActiveColor = widget.isError
        ? theme.colorScheme.error
        : theme.colorScheme.primary;
    final dotInactiveColor = theme.colorScheme.onSurface.withOpacity(0.25);

    return LayoutBuilder(
      builder: (context, constraints) {
        final size = constraints.maxWidth < constraints.maxHeight
            ? constraints.maxWidth
            : (constraints.maxHeight > 0 ? constraints.maxHeight : constraints.maxWidth);

        return GestureDetector(
          onPanStart: (d) => _handlePanStart(d, constraints),
          onPanUpdate: (d) => _handlePanUpdate(d, constraints),
          onPanEnd: _handlePanEnd,
          child: Container(
            width: size,
            height: size,
            color: Colors.transparent,
            child: CustomPaint(
              size: Size(size, size),
              painter: _PatternPainter(
                dimension: widget.dimension,
                selectedDots: _selectedDots,
                currentTouchPosition: _currentTouchPosition,
                lineColor: lineColor,
                dotActiveColor: dotActiveColor,
                dotInactiveColor: dotInactiveColor,
              ),
            ),
          ),
        );
      },
    );
  }
}

class _PatternPainter extends CustomPainter {
  final int dimension;
  final List<int> selectedDots;
  final Offset? currentTouchPosition;
  final Color lineColor;
  final Color dotActiveColor;
  final Color dotInactiveColor;

  _PatternPainter({
    required this.dimension,
    required this.selectedDots,
    required this.currentTouchPosition,
    required this.lineColor,
    required this.dotActiveColor,
    required this.dotInactiveColor,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final dotSpacing = size.width / dimension;
    final dotCenters = <Offset>[];

    // Compute dot center positions
    for (int row = 0; row < dimension; row++) {
      for (int col = 0; col < dimension; col++) {
        dotCenters.add(
          Offset((col + 0.5) * dotSpacing, (row + 0.5) * dotSpacing),
        );
      }
    }

    // 1. Draw connecting lines between selected dots
    if (selectedDots.length > 1) {
      final linePaint = Paint()
        ..color = lineColor.withOpacity(0.85)
        ..strokeWidth = 4.0
        ..strokeCap = StrokeCap.round
        ..style = PaintingStyle.stroke;

      final path = Path();
      path.moveTo(dotCenters[selectedDots[0]].dx, dotCenters[selectedDots[0]].dy);

      for (int i = 1; i < selectedDots.length; i++) {
        path.lineTo(dotCenters[selectedDots[i]].dx, dotCenters[selectedDots[i]].dy);
      }

      canvas.drawPath(path, linePaint);
    }

    // 2. Draw floating line to current touch point
    if (selectedDots.isNotEmpty && currentTouchPosition != null) {
      final linePaint = Paint()
        ..color = lineColor.withOpacity(0.5)
        ..strokeWidth = 3.0
        ..strokeCap = StrokeCap.round
        ..style = PaintingStyle.stroke;

      final lastDotCenter = dotCenters[selectedDots.last];
      canvas.drawLine(lastDotCenter, currentTouchPosition!, linePaint);
    }

    // 3. Draw dots
    for (int i = 0; i < dotCenters.length; i++) {
      final center = dotCenters[i];
      final isSelected = selectedDots.contains(i);

      if (isSelected) {
        // Outer halo
        final haloPaint = Paint()
          ..color = dotActiveColor.withOpacity(0.2)
          ..style = PaintingStyle.fill;
        canvas.drawCircle(center, dotSpacing * 0.28, haloPaint);

        // Active outer ring
        final ringPaint = Paint()
          ..color = dotActiveColor
          ..strokeWidth = 2.5
          ..style = PaintingStyle.stroke;
        canvas.drawCircle(center, dotSpacing * 0.16, ringPaint);

        // Active center core
        final corePaint = Paint()
          ..color = dotActiveColor
          ..style = PaintingStyle.fill;
        canvas.drawCircle(center, 6.0, corePaint);
      } else {
        // Inactive subtle dot
        final dotPaint = Paint()
          ..color = dotInactiveColor
          ..style = PaintingStyle.fill;
        canvas.drawCircle(center, 5.0, dotPaint);
      }
    }
  }

  @override
  bool shouldRepaint(covariant _PatternPainter oldDelegate) {
    return oldDelegate.selectedDots.length != selectedDots.length ||
        oldDelegate.currentTouchPosition != currentTouchPosition ||
        oldDelegate.lineColor != lineColor;
  }
}
