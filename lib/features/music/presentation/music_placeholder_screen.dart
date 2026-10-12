import 'package:flutter/material.dart';
import '../../common/presentation/module_placeholder_screen.dart';

class MusicPlaceholderScreen extends StatelessWidget {
  const MusicPlaceholderScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const ModulePlaceholderScreen(
      title: 'Music',
      stageTag: 'Stage 7',
      icon: Icons.music_note_rounded,
      accentColor: Color(0xFF6366F1), // Indigo
      description:
          'Local offline music player and playlist manager. Reads audio files directly from their original device folders without duplicating media into private app storage.',
      plannedFeatures: [
        'Device storage indexing and metadata extraction',
        'Background audio playback with Android MediaSession',
        'Uninterrupted playback while device is pattern-locked',
        'Custom offline playlists and favorites',
      ],
      preparedTables: ['Tags', 'EntityCrossLinks'],
    );
  }
}
