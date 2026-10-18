import 'package:flutter/material.dart';
import 'package:perfect_freehand/perfect_freehand.dart';

enum DrawingTool {
  pen,
  pencil,
  highlighter,
  eraser,
}

enum DocumentPageFormat {
  a4(name: 'A4', width: 595.28, height: 841.89, aspectRatio: 1 / 1.414),
  letter(name: 'US Letter', width: 612.0, height: 792.0, aspectRatio: 1 / 1.294),
  square(name: 'Square', width: 600.0, height: 600.0, aspectRatio: 1.0);

  final String name;
  final double width;
  final double height;
  final double aspectRatio;

  const DocumentPageFormat({
    required this.name,
    required this.width,
    required this.height,
    required this.aspectRatio,
  });
}

class Stroke {
  final List<PointVector> points;
  final Color color;
  final double size;
  final double opacity;
  final DrawingTool tool;

  Stroke({
    required this.points,
    required this.color,
    required this.size,
    this.opacity = 1.0,
    this.tool = DrawingTool.pen,
  });

  Map<String, dynamic> toJson() {
    return {
      'points': points.map((p) => {'x': p.x, 'y': p.y}).toList(),
      'color': color.value,
      'size': size,
      'opacity': opacity,
      'tool': tool.name,
    };
  }

  factory Stroke.fromJson(Map<String, dynamic> json) {
    var pList = (json['points'] as List).map((p) => PointVector(p['x'], p['y'])).toList();
    DrawingTool t = DrawingTool.pen;
    if (json['tool'] != null) {
      t = DrawingTool.values.firstWhere(
        (e) => e.name == json['tool'],
        orElse: () => DrawingTool.pen,
      );
    }
    return Stroke(
      points: pList,
      color: Color(json['color']),
      size: (json['size'] as num).toDouble(),
      opacity: (json['opacity'] as num?)?.toDouble() ?? 1.0,
      tool: t,
    );
  }

  Stroke copyWith({
    List<PointVector>? points,
    Color? color,
    double? size,
    double? opacity,
    DrawingTool? tool,
  }) {
    return Stroke(
      points: points ?? this.points,
      color: color ?? this.color,
      size: size ?? this.size,
      opacity: opacity ?? this.opacity,
      tool: tool ?? this.tool,
    );
  }
}
