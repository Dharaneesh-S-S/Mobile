import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/app_colors.dart';
import '../providers/music_player_provider.dart';

class SleepTimerSheet extends ConsumerWidget {
  const SleepTimerSheet({super.key});

  String _formatDuration(Duration d) {
    final minutes = d.inMinutes;
    final seconds = d.inSeconds.remainder(60).toString().padLeft(2, '0');
    return '$minutes:$seconds';
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final remaining = ref.watch(sleepTimerRemainingProvider);
    final endOfTrack = ref.watch(sleepAtEndOfTrackProvider);
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
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Row(
                children: [
                  Icon(Icons.bedtime_outlined, color: AppColors.glowTealPrimary, size: 22),
                  SizedBox(width: 10),
                  Text(
                    'Sleep Timer',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppColors.textWhiteHeading,
                    ),
                  ),
                ],
              ),
              if (remaining != null || endOfTrack)
                TextButton(
                  onPressed: () {
                    controller.cancelSleepTimer();
                    Navigator.pop(context);
                  },
                  child: const Text('Turn Off', style: TextStyle(color: AppColors.accentRose)),
                ),
            ],
          ),

          // Active countdown chip if active
          if (remaining != null) ...[
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              decoration: BoxDecoration(
                color: AppColors.glowTealPrimary.withOpacity(0.12),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.glowTealPrimary.withOpacity(0.3)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.timer_outlined, color: AppColors.glowTealPrimary, size: 18),
                  const SizedBox(width: 8),
                  Text(
                    'Stopping in ${_formatDuration(remaining)}',
                    style: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      color: AppColors.glowTealPrimary,
                    ),
                  ),
                ],
              ),
            ),
          ],

          const SizedBox(height: 20),

          // Preset Buttons: 15, 30, 45, 60 minutes
          const Text(
            'DURATION',
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w700,
              color: AppColors.textTealMuted,
              letterSpacing: 0.8,
            ),
          ),
          const SizedBox(height: 10),

          Row(
            children: [15, 30, 45, 60].map((mins) {
              return Expanded(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 4.0),
                  child: OutlinedButton(
                    onPressed: () {
                      controller.startSleepTimer(mins);
                      Navigator.pop(context);
                    },
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(color: AppColors.glassBorderFaint),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      backgroundColor: AppColors.glassBgSubtle,
                    ),
                    child: Text(
                      '${mins}m',
                      style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textWhiteHeading,
                      ),
                    ),
                  ),
                ),
              );
            }).toList(),
          ),

          const SizedBox(height: 16),

          // End of current track option
          Container(
            decoration: BoxDecoration(
              color: AppColors.glassBgSubtle,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.glassBorderFaint),
            ),
            child: ListTile(
              dense: true,
              title: const Text(
                'End of current track',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textWhiteHeading,
                ),
              ),
              trailing: Switch(
                value: endOfTrack,
                activeColor: AppColors.glowTealPrimary,
                onChanged: (val) {
                  controller.toggleSleepAtEndOfTrack();
                  Navigator.pop(context);
                },
              ),
            ),
          ),
        ],
      ),
    );
  }
}
