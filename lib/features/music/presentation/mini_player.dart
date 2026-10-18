import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:just_audio_background/just_audio_background.dart';

import '../providers/music_player_provider.dart';
import 'now_playing_screen.dart';

class MiniPlayer extends ConsumerWidget {
  const MiniPlayer({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final sequenceStateAsync = ref.watch(sequenceStateProvider);
    final playerStateAsync = ref.watch(playerStateProvider);
    final player = ref.watch(musicPlayerProvider);

    return sequenceStateAsync.when(
      data: (sequenceState) {
        if (sequenceState == null || sequenceState.currentSource == null) {
          return const SizedBox.shrink();
        }

        final currentItem = sequenceState.currentSource!.tag as MediaItem;

        return GestureDetector(
          onTap: () {
            Navigator.of(context).push(
              MaterialPageRoute(builder: (_) => const NowPlayingScreen()),
            );
          },
          child: Container(
            height: 72,
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.surfaceContainerHigh,
              border: Border(
                top: BorderSide(
                  color: Theme.of(context).dividerColor,
                  width: 1,
                ),
              ),
            ),
            child: Row(
              children: [
                if (currentItem.artUri != null)
                  Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(4),
                      child: Image.network(
                        currentItem.artUri.toString(),
                        width: 56,
                        height: 56,
                        fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) => const Icon(Icons.music_note, size: 56),
                      ),
                    ),
                  )
                else
                  const Padding(
                    padding: EdgeInsets.all(16.0),
                    child: Icon(Icons.music_note),
                  ),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        currentItem.title,
                        style: const TextStyle(fontWeight: FontWeight.bold),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      if (currentItem.artist != null)
                        Text(
                          currentItem.artist!,
                          style: TextStyle(
                            color: Theme.of(context).colorScheme.onSurfaceVariant,
                            fontSize: 12,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                    ],
                  ),
                ),
                playerStateAsync.when(
                  data: (playerState) {
                    final isPlaying = playerState.playing;
                    return IconButton(
                      icon: Icon(isPlaying ? Icons.pause : Icons.play_arrow),
                      onPressed: () {
                        if (isPlaying) {
                          player.pause();
                        } else {
                          player.play();
                        }
                      },
                    );
                  },
                  loading: () => const Padding(
                    padding: EdgeInsets.all(16.0),
                    child: CircularProgressIndicator(),
                  ),
                  error: (_, __) => const SizedBox.shrink(),
                ),
                IconButton(
                  icon: const Icon(Icons.skip_next),
                  onPressed: () => player.seekToNext(),
                ),
                const SizedBox(width: 8),
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
