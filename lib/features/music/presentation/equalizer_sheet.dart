import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/app_colors.dart';
import '../providers/music_player_provider.dart';

class EqualizerSheet extends ConsumerWidget {
  const EqualizerSheet({super.key});

  static const List<String> bandLabels = ['60Hz', '230Hz', '910Hz', '3.6kHz', '14kHz'];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final eq = ref.watch(equalizerStateProvider);
    final speed = ref.watch(playbackSpeedProvider);
    final controller = ref.read(musicPlaybackControllerProvider);

    return Container(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 28),
      decoration: const BoxDecoration(
        color: AppColors.canvasSurface,
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
        border: Border(
          top: BorderSide(color: AppColors.glassBorderGlow, width: 1),
        ),
      ),
      child: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header Handle
            Center(
              child: Container(
                width: 36,
                height: 4,
                decoration: BoxDecoration(
                  color: AppColors.textTealMuted.withOpacity(0.4),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Title
            const Row(
              children: [
                Icon(Icons.tune_rounded, color: AppColors.glowTealPrimary, size: 22),
                SizedBox(width: 10),
                Text(
                  'Sound & Equalizer',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: AppColors.textWhiteHeading,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 18),

            // Presets Horizontal Scroll
            SizedBox(
              height: 36,
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: equalizerPresets.keys.map((preset) {
                  final isSelected = eq.preset == preset;
                  return Padding(
                    padding: const EdgeInsets.only(right: 8.0),
                    child: ChoiceChip(
                      label: Text(preset),
                      selected: isSelected,
                      selectedColor: AppColors.glowTealPrimary,
                      backgroundColor: AppColors.glassBgSubtle,
                      labelStyle: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: isSelected ? const Color(0xFF04100F) : AppColors.textTealBody,
                      ),
                      side: BorderSide(
                        color: isSelected ? AppColors.glowTealPrimary : AppColors.glassBorderFaint,
                      ),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(9999)),
                      onSelected: (val) {
                        if (val) controller.setEqualizerPreset(preset);
                      },
                    ),
                  );
                }).toList(),
              ),
            ),
            const SizedBox(height: 24),

            // 5 Equalizer Vertical Sliders
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 16),
              decoration: BoxDecoration(
                color: AppColors.glassBgSubtle,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.glassBorderFaint),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: List.generate(5, (index) {
                  final gain = (index < eq.bandGains.length) ? eq.bandGains[index] : 0.0;
                  return Column(
                    children: [
                      Text(
                        '${gain > 0 ? '+' : ''}${gain.toStringAsFixed(0)}',
                        style: const TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          color: AppColors.glowTealPrimary,
                        ),
                      ),
                      const SizedBox(height: 6),
                      SizedBox(
                        height: 120,
                        child: RotatedBox(
                          quarterTurns: -1,
                          child: SliderTheme(
                            data: SliderTheme.of(context).copyWith(
                              activeTrackColor: AppColors.glowTealPrimary,
                              inactiveTrackColor: AppColors.canvasElevated,
                              thumbColor: AppColors.glowTealPrimary,
                              thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 6),
                              overlayColor: AppColors.glowTealPrimary.withOpacity(0.2),
                              trackHeight: 3,
                            ),
                            child: Slider(
                              value: gain,
                              min: -10.0,
                              max: 10.0,
                              onChanged: (newVal) {
                                controller.setEqualizerBand(index, newVal);
                              },
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        bandLabels[index],
                        style: const TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textTealMuted,
                        ),
                      ),
                    ],
                  );
                }),
              ),
            ),
            const SizedBox(height: 20),

            // Audio Effects: Bass Boost & Virtualizer
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.glassBgSubtle,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.glassBorderFaint),
              ),
              child: Column(
                children: [
                  Row(
                    children: [
                      const Icon(Icons.speaker_group_outlined, size: 18, color: AppColors.glowTealPrimary),
                      const SizedBox(width: 8),
                      const Text(
                        'Bass Boost',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textWhiteHeading,
                        ),
                      ),
                      const Spacer(),
                      Text(
                        '${(eq.bassBoost * 100).toInt()}%',
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: AppColors.glowTealPrimary,
                        ),
                      ),
                    ],
                  ),
                  Slider(
                    value: eq.bassBoost,
                    activeColor: AppColors.glowTealPrimary,
                    inactiveColor: AppColors.canvasElevated,
                    onChanged: (val) => controller.setBassBoost(val),
                  ),
                  const Divider(color: AppColors.glassBorderFaint, height: 16),
                  Row(
                    children: [
                      const Icon(Icons.surround_sound_outlined, size: 18, color: AppColors.glowTealPrimary),
                      const SizedBox(width: 8),
                      const Text(
                        'Virtualizer (3D Audio)',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textWhiteHeading,
                        ),
                      ),
                      const Spacer(),
                      Text(
                        '${(eq.virtualizer * 100).toInt()}%',
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: AppColors.glowTealPrimary,
                        ),
                      ),
                    ],
                  ),
                  Slider(
                    value: eq.virtualizer,
                    activeColor: AppColors.glowTealPrimary,
                    inactiveColor: AppColors.canvasElevated,
                    onChanged: (val) => controller.setVirtualizer(val),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Playback Speed Slider (0.5x to 2.0x)
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.glassBgSubtle,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.glassBorderFaint),
              ),
              child: Column(
                children: [
                  Row(
                    children: [
                      const Icon(Icons.speed_rounded, size: 18, color: AppColors.glowTealPrimary),
                      const SizedBox(width: 8),
                      const Text(
                        'Playback Speed',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textWhiteHeading,
                        ),
                      ),
                      const Spacer(),
                      Text(
                        '${speed.toStringAsFixed(2)}x',
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: AppColors.glowTealPrimary,
                        ),
                      ),
                    ],
                  ),
                  Slider(
                    value: speed,
                    min: 0.5,
                    max: 2.0,
                    divisions: 15,
                    activeColor: AppColors.glowTealPrimary,
                    inactiveColor: AppColors.canvasElevated,
                    onChanged: (val) => controller.setPlaybackSpeed(val),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
