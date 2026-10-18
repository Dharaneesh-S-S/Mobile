import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:just_audio/just_audio.dart';
import 'package:just_audio_background/just_audio_background.dart';

import '../providers/music_player_provider.dart';

class NowPlayingScreen extends ConsumerWidget {
  const NowPlayingScreen({super.key});

  String _formatDuration(Duration? duration) {
    if (duration == null) return '--:--';
    final minutes = duration.inMinutes;
    final seconds = duration.inSeconds.remainder(60).toString().padLeft(2, '0');
    return '$minutes:$seconds';
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final player = ref.watch(musicPlayerProvider);
    final sequenceStateAsync = ref.watch(sequenceStateProvider);
    final playerStateAsync = ref.watch(playerStateProvider);
    final positionAsync = ref.watch(positionProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Now Playing'),
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.keyboard_arrow_down),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: sequenceStateAsync.when(
        data: (sequenceState) {
          if (sequenceState == null || sequenceState.currentSource == null) {
            return const Center(child: Text('No song playing'));
          }

          final currentItem = sequenceState.currentSource!.tag as MediaItem;
          final position = positionAsync.value ?? Duration.zero;
          final duration = player.duration ?? currentItem.duration ?? Duration.zero;

          final isPlaying = playerStateAsync.value?.playing ?? false;
          final isShuffle = player.shuffleModeEnabled;
          final loopMode = player.loopMode;

          return Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
            child: Column(
              children: [
                const Spacer(flex: 1),
                // Album Art
                Container(
                  width: 260,
                  height: 260,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(16),
                    color: Theme.of(context).colorScheme.surfaceContainerHighest,
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.15),
                        blurRadius: 16,
                        offset: const Offset(0, 8),
                      ),
                    ],
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(16),
                    child: currentItem.artUri != null
                        ? Image.network(
                            currentItem.artUri.toString(),
                            fit: BoxFit.cover,
                            errorBuilder: (_, __, ___) => Icon(
                              Icons.music_note,
                              size: 100,
                              color: Theme.of(context).colorScheme.primary,
                            ),
                          )
                        : Icon(
                            Icons.music_note,
                            size: 100,
                            color: Theme.of(context).colorScheme.primary,
                          ),
                  ),
                ),
                const Spacer(flex: 1),
                // Title & Artist
                Text(
                  currentItem.title,
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                  textAlign: TextAlign.center,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 8),
                Text(
                  currentItem.artist ?? 'Unknown Artist',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                      ),
                  textAlign: TextAlign.center,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const Spacer(flex: 1),
                // Progress Slider
                Slider(
                  min: 0.0,
                  max: (duration.inMilliseconds > 0)
                      ? duration.inMilliseconds.toDouble()
                      : 1.0,
                  value: position.inMilliseconds
                      .clamp(0, duration.inMilliseconds > 0 ? duration.inMilliseconds : 1)
                      .toDouble(),
                  onChanged: (val) {
                    player.seek(Duration(milliseconds: val.round()));
                  },
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        _formatDuration(position),
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                      Text(
                        _formatDuration(duration),
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                // Controls Row
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    // Shuffle
                    IconButton(
                      icon: Icon(
                        Icons.shuffle,
                        color: isShuffle
                            ? Theme.of(context).colorScheme.primary
                            : Theme.of(context).colorScheme.onSurfaceVariant,
                      ),
                      onPressed: () async {
                        final enable = !isShuffle;
                        if (enable) {
                          await player.shuffle();
                        }
                        await player.setShuffleModeEnabled(enable);
                      },
                    ),
                    // Previous
                    IconButton(
                      iconSize: 40,
                      icon: const Icon(Icons.skip_previous),
                      onPressed: () => player.seekToPrevious(),
                    ),
                    // Play/Pause
                    Container(
                      decoration: BoxDecoration(
                        color: Theme.of(context).colorScheme.primary,
                        shape: BoxShape.circle,
                      ),
                      child: IconButton(
                        iconSize: 48,
                        color: Theme.of(context).colorScheme.onPrimary,
                        icon: Icon(isPlaying ? Icons.pause : Icons.play_arrow),
                        onPressed: () {
                          if (isPlaying) {
                            player.pause();
                          } else {
                            player.play();
                          }
                        },
                      ),
                    ),
                    // Next
                    IconButton(
                      iconSize: 40,
                      icon: const Icon(Icons.skip_next),
                      onPressed: () => player.seekToNext(),
                    ),
                    // Repeat (off -> all -> one)
                    IconButton(
                      icon: Icon(
                        loopMode == LoopMode.one
                            ? Icons.repeat_one
                            : loopMode == LoopMode.all
                                ? Icons.repeat
                                : Icons.repeat,
                        color: loopMode != LoopMode.off
                            ? Theme.of(context).colorScheme.primary
                            : Theme.of(context).colorScheme.onSurfaceVariant,
                      ),
                      onPressed: () {
                        if (loopMode == LoopMode.off) {
                          player.setLoopMode(LoopMode.all);
                        } else if (loopMode == LoopMode.all) {
                          player.setLoopMode(LoopMode.one);
                        } else {
                          player.setLoopMode(LoopMode.off);
                        }
                      },
                    ),
                  ],
                ),
                const Spacer(flex: 1),
              ],
            ),
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, _) => Center(child: Text('Error: $err')),
      ),
    );
  }
}
