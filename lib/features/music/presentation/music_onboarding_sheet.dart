import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/app_colors.dart';
import '../providers/music_library_provider.dart';

class MusicOnboardingSheet extends ConsumerWidget {
  final VoidCallback? onCompleted;

  const MusicOnboardingSheet({super.key, this.onCompleted});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final folderState = ref.watch(musicFolderStateProvider);
    final notifier = ref.read(musicFolderStateProvider.notifier);

    return Scaffold(
      backgroundColor: AppColors.canvasBase,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 12.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              // Top Bar with Close button
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const SizedBox(width: 40),
                  Container(
                    width: 40,
                    height: 4,
                    decoration: BoxDecoration(
                      color: AppColors.textTealMuted.withOpacity(0.4),
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, color: AppColors.textTealMuted),
                    tooltip: 'Close',
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                ],
              ),

              const Spacer(flex: 1),

              // Hero Music Icon with Glow
              Container(
                width: 96,
                height: 96,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppColors.glowTealPrimary.withOpacity(0.12),
                  border: Border.all(
                    color: AppColors.glowTealPrimary.withOpacity(0.35),
                    width: 2,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.glowTealPrimary.withOpacity(0.25),
                      blurRadius: 36,
                      spreadRadius: 4,
                    ),
                  ],
                ),
                child: const Icon(
                  Icons.music_note_rounded,
                  size: 48,
                  color: AppColors.glowTealPrimary,
                ),
              ),

              const SizedBox(height: 24),

              // Title & Subtitle
              const Text(
                'Select Music Folder',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textWhiteHeading,
                  letterSpacing: -0.5,
                ),
              ),

              const SizedBox(height: 12),

              const Text(
                'Personal Music plays offline audio files directly from your device. Choose the directory containing your song library to begin.',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 13,
                  color: AppColors.textTealBody,
                  height: 1.5,
                ),
              ),

              const SizedBox(height: 28),

              // Folder Selection Glass Card
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: AppColors.glassBgMedium,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(
                    color: folderState.folderPath != null
                        ? AppColors.glowTealPrimary.withOpacity(0.4)
                        : AppColors.glassBorderFaint,
                  ),
                ),
                child: Column(
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: AppColors.glowTealPrimary.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(14),
                          ),
                          child: const Icon(
                            Icons.folder_open_rounded,
                            color: AppColors.glowTealPrimary,
                            size: 22,
                          ),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                folderState.folderPath != null
                                    ? 'Selected Folder'
                                    : 'No Folder Selected',
                                style: const TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w700,
                                  color: AppColors.textWhiteHeading,
                                ),
                              ),
                              const SizedBox(height: 3),
                              Text(
                                folderState.folderPath ?? 'Tap below to select from storage',
                                style: TextStyle(
                                  fontSize: 11,
                                  color: folderState.folderPath != null
                                      ? AppColors.glowTealPrimary
                                      : AppColors.textTealMuted,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 16),

                    // Pick Folder Action Button
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton.icon(
                        onPressed: folderState.isScanning ? null : () => notifier.pickFolder(),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white,
                          foregroundColor: const Color(0xFF04100F),
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(9999),
                          ),
                          elevation: 0,
                        ),
                        icon: const Icon(Icons.folder_shared_outlined, size: 18),
                        label: Text(
                          folderState.folderPath == null ? 'Browse & Select Folder' : 'Change Folder',
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 18),

              // Options & Toggles Card
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                decoration: BoxDecoration(
                  color: AppColors.glassBgSubtle,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppColors.glassBorderFaint),
                ),
                child: Column(
                  children: [
                    // Include subfolders switch
                    SwitchListTile(
                      contentPadding: EdgeInsets.zero,
                      dense: true,
                      activeColor: AppColors.glowTealPrimary,
                      title: const Text(
                        'Include Subfolders',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textWhiteHeading,
                        ),
                      ),
                      subtitle: const Text(
                        'Recursively scan all nested folders for music',
                        style: TextStyle(fontSize: 11, color: AppColors.textTealMuted),
                      ),
                      value: folderState.includeSubfolders,
                      onChanged: (val) => notifier.setIncludeSubfolders(val),
                    ),

                    const Divider(color: AppColors.glassBorderFaint, height: 16),

                    // Minimum duration switch (30 seconds)
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Filter Short Audio (< 30s)',
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                                color: AppColors.textWhiteHeading,
                              ),
                            ),
                            SizedBox(height: 2),
                            Text(
                              'Ignores notification tones, voice notes & ringtones',
                              style: TextStyle(fontSize: 11, color: AppColors.textTealMuted),
                            ),
                          ],
                        ),
                        Checkbox(
                          activeColor: AppColors.glowTealPrimary,
                          checkColor: const Color(0xFF04100F),
                          value: folderState.minDurationSeconds > 0,
                          onChanged: (val) {
                            notifier.setMinDurationSeconds((val ?? true) ? 30 : 0);
                          },
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              const Spacer(flex: 2),

              // Scanning progress or confirmation
              if (folderState.isScanning) ...[
                const LinearProgressIndicator(
                  backgroundColor: AppColors.canvasElevated,
                  valueColor: AlwaysStoppedAnimation<Color>(AppColors.glowTealPrimary),
                ),
                const SizedBox(height: 8),
                Text(
                  folderState.scanStatus ?? 'Scanning tracks...',
                  style: const TextStyle(fontSize: 12, color: AppColors.glowTealPrimary),
                ),
                const SizedBox(height: 16),
              ] else if (folderState.folderPath != null) ...[
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.check_circle_rounded, color: AppColors.glowTealPrimary, size: 16),
                    const SizedBox(width: 6),
                    Text(
                      '${folderState.trackCount} tracks indexed and ready',
                      style: const TextStyle(fontSize: 12, color: AppColors.glowTealPrimary, fontWeight: FontWeight.w600),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
              ],

              // Get Started CTA Button
              SizedBox(
                width: double.infinity,
                child: FilledButton(
                  onPressed: folderState.folderPath == null || folderState.isScanning
                      ? null
                      : () async {
                          await notifier.completeOnboarding();
                          onCompleted?.call();
                          if (context.mounted) {
                            Navigator.of(context).pop();
                          }
                        },
                  style: FilledButton.styleFrom(
                    backgroundColor: AppColors.glowTealPrimary,
                    foregroundColor: const Color(0xFF04100F),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(9999),
                    ),
                    elevation: 0,
                  ),
                  child: const Text(
                    'Start Listening',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                  ),
                ),
              ),

              const SizedBox(height: 8),

              // Skip / Dismiss Button
              TextButton(
                onPressed: () => Navigator.of(context).pop(),
                child: const Text(
                  'Skip for Now',
                  style: TextStyle(
                    color: AppColors.textTealMuted,
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),

              const SizedBox(height: 4),
            ],
          ),
        ),
      ),
    );
  }
}
