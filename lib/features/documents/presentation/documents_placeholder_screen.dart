import 'package:flutter/material.dart';
import '../../common/presentation/module_placeholder_screen.dart';

class DocumentsPlaceholderScreen extends StatelessWidget {
  const DocumentsPlaceholderScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const ModulePlaceholderScreen(
      title: 'Documents',
      stageTag: 'Stage 8',
      icon: Icons.description_outlined,
      accentColor: Color(0xFF0D9488), // Teal
      description:
          'Local structured document reader, editor, and vector sketch notebook. Stores document text and drawing vector coordinates in structured format without creating raster image duplicates.',
      plannedFeatures: [
        'Structured markdown and formatted text documents',
        'Lightweight vector drawing and stylus stroke engine',
        'PDF viewer with on-device rendering',
        'Cross-referencing to notes and calendar milestones',
      ],
      preparedTables: ['DocumentItems', 'EntityCrossLinks', 'Tags'],
    );
  }
}
