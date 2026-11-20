import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/app_colors.dart';
import '../providers/music_library_provider.dart';
import '../providers/music_player_provider.dart';
import 'equalizer_sheet.dart';
import 'sleep_timer_sheet.dart';

class MusicSettingsScreen extends ConsumerWidget {
  const MusicSettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final folderState = ref.watch(musicFolderStateProvider);
    final folderNotifier = ref.read(musicFolderStateProvider.notifier);

    return Scaffold(
      backgroundColor: AppColors.canvasBase,
      appBar: AppBar(
        title: const Text('Music Settings'),
        centerTitle: false,
        backgroundColor: AppColors.canvasBase,
      ),
      body: ListView(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        children: [
          // 1. MUSIC FOLDER SECTION
          _buildSectionHeader('MUSIC FOLDER'),
          Container(
            decoration: BoxDecoration(
              color: AppColors.glassBgSubtle,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppColors.glassBorderFaint),
            ),
            child: Column(
              children: [
                ListTile(
                  leading: const Icon(Icons.folder_outlined, color: AppColors.glowTealPrimary),
                  title: const Text(
                    'Active Music Folder',
                    style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14, color: AppColors.textWhiteHeading),
                  ),
                  subtitle: Text(
                    folderState.folderPath ?? 'All device audio',
                    style: const TextStyle(fontSize: 12, color: AppColors.textTealMuted),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  trailing: OutlinedButton(
                    onPressed: () => folderNotifier.pickFolder(),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppColors.glowTealPrimary,
                      side: const BorderSide(color: AppColors.glowTealPrimary),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(9999)),
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                    ),
                    child: const Text('Change', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                  ),
                ),
                const Divider(color: AppColors.glassBorderFaint, height: 1),
                SwitchListTile(
                  dense: true,
                  activeColor: AppColors.glowTealPrimary,
                  title: const Text('Include Subfolders', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13, color: AppColors.textWhiteHeading)),
                  subtitle: const Text('Recursively scan nested subdirectories', style: TextStyle(fontSize: 11, color: AppColors.textTealMuted)),
                  value: folderState.includeSubfolders,
                  onChanged: (val) => folderNotifier.setIncludeSubfolders(val),
                ),
                const Divider(color: AppColors.glassBorderFaint, height: 1),
                ListTile(
                  dense: true,
                  leading: const Icon(Icons.timer_outlined, color: AppColors.glowTealPrimary, size: 20),
                  title: const Text('Filter Short Audio Tracks', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13, color: AppColors.textWhiteHeading)),
                  subtitle: Text('Ignore files shorter than ${folderState.minDurationSeconds}s', style: const TextStyle(fontSize: 11, color: AppColors.textTealMuted)),
                  trailing: DropdownButton<int>(
                    value: folderState.minDurationSeconds,
                    dropdownColor: AppColors.canvasElevated,
                    style: const TextStyle(color: AppColors.glowTealPrimary, fontSize: 13, fontWeight: FontWeight.bold),
                    underline: const SizedBox.shrink(),
                    items: const [
                      DropdownMenuItem(value: 0, child: Text('No filter')),
                      DropdownMenuItem(value: 15, child: Text('< 15s')),
                      DropdownMenuItem(value: 30, child: Text('< 30s')),
                      DropdownMenuItem(value: 60, child: Text('< 60s')),
                    ],
                    onChanged: (val) {
                      if (val != null) folderNotifier.setMinDurationSeconds(val);
                    },
                  ),
                ),
                const Divider(color: AppColors.glassBorderFaint, height: 1),
                ListTile(
                  dense: true,
                  leading: const Icon(Icons.refresh_rounded, color: AppColors.glowTealPrimary, size: 20),
                  title: const Text('Rescan Music Library', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13, color: AppColors.textWhiteHeading)),
                  subtitle: Text(folderState.scanStatus ?? 'Rebuild library index', style: const TextStyle(fontSize: 11, color: AppColors.textTealMuted)),
                  trailing: folderState.isScanning
                      ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.glowTealPrimary))
                      : IconButton(
                          icon: const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: AppColors.textTealMuted),
                          onPressed: () => folderNotifier.rescan(),
                        ),
                  onTap: folderState.isScanning ? null : () => folderNotifier.rescan(),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // 2. SOUND & PLAYBACK SECTION
          _buildSectionHeader('SOUND & PLAYBACK'),
          Container(
            decoration: BoxDecoration(
              color: AppColors.glassBgSubtle,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppColors.glassBorderFaint),
            ),
            child: Column(
              children: [
                ListTile(
                  leading: const Icon(Icons.tune_rounded, color: AppColors.glowTealPrimary),
                  title: const Text('Equalizer & Audio Effects', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14, color: AppColors.textWhiteHeading)),
                  subtitle: const Text('5-band equalizer, bass boost, virtualizer', style: TextStyle(fontSize: 12, color: AppColors.textTealMuted)),
                  trailing: const Icon(Icons.chevron_right_rounded, color: AppColors.textTealMuted),
                  onTap: () {
                    showModalBottomSheet(
                      context: context,
                      isScrollControlled: true,
                      backgroundColor: Colors.transparent,
                      builder: (_) => const EqualizerSheet(),
                    );
                  },
                ),
                const Divider(color: AppColors.glassBorderFaint, height: 1),
                ListTile(
                  leading: const Icon(Icons.bedtime_outlined, color: AppColors.glowTealPrimary),
                  title: const Text('Sleep Timer', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14, color: AppColors.textWhiteHeading)),
                  subtitle: const Text('Timer duration with volume fade-out', style: TextStyle(fontSize: 12, color: AppColors.textTealMuted)),
                  trailing: const Icon(Icons.chevron_right_rounded, color: AppColors.textTealMuted),
                  onTap: () {
                    showModalBottomSheet(
                      context: context,
                      backgroundColor: Colors.transparent,
                      builder: (_) => const SleepTimerSheet(),
                    );
                  },
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // 3. HOME SCREEN WIDGETS
          _buildSectionHeader('HOME SCREEN WIDGETS'),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.glassBgSubtle,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppColors.glassBorderFaint),
            ),
            child: const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(Icons.widgets_outlined, color: AppColors.glowTealPrimary, size: 20),
                    SizedBox(width: 10),
                    Text(
                      '3 Widget Sizes Available',
                      style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14, color: AppColors.textWhiteHeading),
                    ),
                  ],
                ),
                SizedBox(height: 8),
                Text(
                  '• Small (2x2): Album art with play/pause overlay.\n• Medium (4x2): Art, title, artist, prev / play / next.\n• Large (4x4): Large art, title, progress bar, shuffle, controls & repeat.\n\nTo add: Long-press your home screen, select Widgets, and choose Personal Hub Music.',
                  style: TextStyle(fontSize: 12, color: AppColors.textTealBody, height: 1.5),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // 4. ABOUT
          _buildSectionHeader('ABOUT'),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.glassBgSubtle,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppColors.glassBorderFaint),
            ),
            child: const Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Offline Music Player Module',
                  style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13, color: AppColors.textWhiteHeading),
                ),
                Text(
                  'v1.0.0 (Samsung-inspired)',
                  style: TextStyle(fontSize: 12, color: AppColors.glowTealPrimary, fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.only(left: 4, bottom: 8),
      child: Text(
        title,
        style: const TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.w700,
          color: AppColors.textTealMuted,
          letterSpacing: 0.8,
        ),
      ),
    );
  }
}
