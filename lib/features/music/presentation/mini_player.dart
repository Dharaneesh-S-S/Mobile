import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:just_audio_background/just_audio_background.dart';
import 'package:on_audio_query/on_audio_query.dart';
import '../providers/music_player_provider.dart';
import 'now_playing_screen.dart';

class MiniPlayer extends ConsumerWidget {
  const MiniPlayer({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
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
            height: 68,
            decoration: BoxDecoration(
              color: theme.colorScheme.surfaceContainerHighest,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.12),
                  blurRadius: 8,
                  offset: const Offset(0, -2),
                ),
              ],
            ),
            child: Column(
              children: [
                // Mini Progress Bar
                LinearProgressIndicator(
                  value: progress,
                  minHeight: 2.5,
                  backgroundColor: Colors.transparent,
                  valueColor: AlwaysStoppedAnimation<Color>(theme.colorScheme.primary),
                ),
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 12.0),
                    child: Row(
                      children: [
                        // Album Art
                        ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: SizedBox(
                            width: 48,
                            height: 48,
                            child: currentSong != null
                                ? QueryArtworkWidget(
                                    id: currentSong.id,
                                    type: ArtworkType.AUDIO,
                                    artworkFit: BoxFit.cover,
                                    nullArtworkWidget: Container(
                                      color: theme.colorScheme.surfaceVariant,
                                      child: const Icon(Icons.music_note, size: 24),
                                    ),
                                  )
                                : Container(
                                    color: theme.colorScheme.surfaceVariant,
                                    child: const Icon(Icons.music_note, size: 24),
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
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                              const SizedBox(height: 2),
                              Text(
                                currentItem.artist ?? 'Unknown Artist',
                                style: TextStyle(
                                  color: theme.colorScheme.onSurfaceVariant,
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
                          iconSize: 32,
                          icon: Icon(isPlaying ? Icons.pause_circle_filled : Icons.play_circle_filled),
                          color: theme.colorScheme.primary,
                          onPressed: () => controller.togglePlayPause(),
                        ),

                        // Next Button
                        IconButton(
                          iconSize: 28,
                          icon: const Icon(Icons.skip_next),
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
