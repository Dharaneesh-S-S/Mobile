import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:just_audio_background/just_audio_background.dart';
import 'package:on_audio_query/on_audio_query.dart';
import '../../../core/theme/app_colors.dart';
import '../providers/music_player_provider.dart';
import 'now_playing_screen.dart';

class MiniPlayer extends ConsumerWidget {
  const MiniPlayer({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final sequenceStateAsync = ref.watch(sequenceStateProvider);
    final playerStateAsync = ref.watch(playerStateProvider);
    final positionAsync = ref.watch(positionProvider);
    final player = ref.watch(musicPlayerProvider);
    final controller = ref.read(musicPlaybackControllerProvider);
    final currentSong = ref.watch(currentSongProvider);

    return sequenceStateAsync.when(
      data: (sequenceState) {
        if (sequenceState == null || sequenceState.currentSource == null) {
          return const SizedBox.shrink();
        }

        final currentItem = sequenceState.currentSource!.tag as MediaItem;
        final position = positionAsync.value ?? Duration.zero;
        final duration = player.duration ?? currentItem.duration ?? Duration.zero;
        final progress = (duration.inMilliseconds > 0)
            ? (position.inMilliseconds / duration.inMilliseconds).clamp(0.0, 1.0)
            : 0.0;

        final isPlaying = playerStateAsync.value?.playing ?? false;

        return GestureDetector(
          onTap: () {
            Navigator.of(context).push(
              MaterialPageRoute(builder: (_) => const NowPlayingScreen()),
            );
          },
          child: Container(
            height: 70,
            decoration: const BoxDecoration(
              color: AppColors.canvasElevated,
              border: Border(
                top: BorderSide(color: AppColors.glassBorderGlow, width: 1.2),
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black45,
                  blurRadius: 10,
                  offset: Offset(0, -3),
                ),
              ],
            ),
            child: Column(
              children: [
                // Mini Progress Bar
                LinearProgressIndicator(
                  value: progress,
                  minHeight: 2.5,
                  backgroundColor: AppColors.canvasBase,
                  valueColor: const AlwaysStoppedAnimation<Color>(AppColors.glowTealPrimary),
                ),
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 14.0),
                    child: Row(
                      children: [
                        // Album Art
                        ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: SizedBox(
                            width: 46,
                            height: 46,
                            child: currentSong != null
                                ? QueryArtworkWidget(
                                    id: currentSong.id,
                                    type: ArtworkType.AUDIO,
                                    artworkFit: BoxFit.cover,
                                    nullArtworkWidget: Container(
                                      color: AppColors.canvasSurface,
                                      child: const Icon(
                                        Icons.music_note,
                                        size: 22,
                                        color: AppColors.glowTealPrimary,
                                      ),
                                    ),
                                  )
                                : Container(
                                    color: AppColors.canvasSurface,
                                    child: const Icon(
                                      Icons.music_note,
                                      size: 22,
                                      color: AppColors.glowTealPrimary,
                                    ),
                                  ),
                          ),
                        ),
                        const SizedBox(width: 12),

                        // Title & Artist
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                currentItem.title,
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 14,
                                  color: AppColors.textWhiteHeading,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                              const SizedBox(height: 2),
                              Text(
                                currentItem.artist ?? 'Unknown Artist',
                                style: const TextStyle(
                                  color: AppColors.textTealMuted,
                                  fontSize: 12,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ],
                          ),
                        ),

                        // Play/Pause Button
                        IconButton(
                          iconSize: 34,
                          icon: Icon(
                            isPlaying ? Icons.pause_circle_filled : Icons.play_circle_filled,
                            color: AppColors.glowTealPrimary,
                          ),
                          onPressed: () => controller.togglePlayPause(),
                        ),

                        // Next Button
                        IconButton(
                          iconSize: 26,
                          icon: const Icon(Icons.skip_next, color: AppColors.textTealBody),
                          onPressed: () => controller.seekToNext(),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
      loading: () => const SizedBox.shrink(),
      error: (_, __) => const SizedBox.shrink(),
    );
  }
}
