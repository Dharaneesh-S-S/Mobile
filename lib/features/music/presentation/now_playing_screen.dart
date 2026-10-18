import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:just_audio/just_audio.dart';
import 'package:just_audio_background/just_audio_background.dart';
import 'package:on_audio_query/on_audio_query.dart';
import '../../../core/providers/core_providers.dart';
import '../providers/music_player_provider.dart';
import 'playlist_dialogs.dart';
import 'queue_bottom_sheet.dart';

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
    final theme = Theme.of(context);
    final player = ref.watch(musicPlayerProvider);
    final controller = ref.read(musicPlaybackControllerProvider);
    final sequenceStateAsync = ref.watch(sequenceStateProvider);
    final playerStateAsync = ref.watch(playerStateProvider);
    final positionAsync = ref.watch(positionProvider);
    final currentSong = ref.watch(currentSongProvider);
    final db = ref.watch(databaseProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Now Playing'),
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.keyboard_arrow_down),
          tooltip: 'Minimize',
          onPressed: () => Navigator.of(context).pop(),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.queue_music),
            tooltip: 'Play Queue',
            onPressed: () {
              showModalBottomSheet(
                context: context,
                isScrollControlled: true,
                backgroundColor: Colors.transparent,
                builder: (_) => const QueueBottomSheet(),
              );
            },
          ),
          PopupMenuButton<String>(
            icon: const Icon(Icons.more_vert),
            onSelected: (val) {
              if (val == 'playlist' && currentSong != null) {
                PlaylistDialogs.showAddToPlaylistDialog(context, ref, currentSong);
              } else if (val == 'info' && currentSong != null) {
                _showTrackInfoDialog(context, currentSong);
              }
            },
            itemBuilder: (ctx) => [
              const PopupMenuItem(
                value: 'playlist',
                child: Row(
                  children: [
                    Icon(Icons.playlist_add, size: 20),
                    SizedBox(width: 10),
                    Text('Add to Playlist'),
                  ],
                ),
              ),
              const PopupMenuItem(
                value: 'info',
                child: Row(
                  children: [
                    Icon(Icons.info_outline, size: 20),
                    SizedBox(width: 10),
                    Text('Track Details'),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
      body: sequenceStateAsync.when(
        data: (sequenceState) {
          if (sequenceState == null || sequenceState.currentSource == null) {
            return const Center(child: Text('No song playing.'));
          }

          final currentItem = sequenceState.currentSource!.tag as MediaItem;
          final position = positionAsync.value ?? Duration.zero;
          final duration = player.duration ?? currentItem.duration ?? Duration.zero;

          final isPlaying = playerStateAsync.value?.playing ?? false;
          final isShuffle = player.shuffleModeEnabled;
          final loopMode = player.loopMode;

          final songPath = currentSong?.data ?? '';

          return Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
            child: Column(
              children: [
                const Spacer(flex: 1),

                // Large Album Art with Elevation
                Container(
                  width: 280,
                  height: 280,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(20),
                    color: theme.colorScheme.surfaceContainerHighest,
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.2),
                        blurRadius: 20,
                        offset: const Offset(0, 10),
                      ),
                    ],
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(20),
                    child: currentSong != null
                        ? QueryArtworkWidget(
                            id: currentSong.id,
                            type: ArtworkType.AUDIO,
                            artworkFit: BoxFit.cover,
                            nullArtworkWidget: Container(
                              color: theme.colorScheme.surfaceVariant,
                              child: Icon(
                                Icons.music_note,
                                size: 120,
                                color: theme.colorScheme.primary,
                              ),
                            ),
                          )
                        : Icon(
                            Icons.music_note,
                            size: 120,
                            color: theme.colorScheme.primary,
                          ),
                  ),
                ),

                const Spacer(flex: 1),

                // Title, Artist, and Favorite Row
                Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            currentItem.title,
                            style: theme.textTheme.headlineSmall?.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 4),
                          Text(
                            currentItem.artist ?? 'Unknown Artist',
                            style: theme.textTheme.titleMedium?.copyWith(
                              color: theme.colorScheme.onSurfaceVariant,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          if (currentItem.album != null && currentItem.album!.isNotEmpty) ...[
                            const SizedBox(height: 2),
                            Text(
                              currentItem.album!,
                              style: theme.textTheme.bodySmall?.copyWith(
                                color: Colors.grey,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ],
                      ),
                    ),

                    // SQLite Favorite Heart Toggle
                    if (songPath.isNotEmpty)
                      StreamBuilder(
                        stream: db.musicDao.watchSongMetadata(songPath),
                        builder: (context, snapshot) {
                          final isFav = snapshot.data?.isFavorite ?? false;
                          return IconButton(
                            iconSize: 28,
                            icon: Icon(
                              isFav ? Icons.favorite : Icons.favorite_border,
                              color: isFav ? Colors.red : Colors.grey,
                            ),
                            onPressed: () {
                              db.musicDao.toggleFavorite(songPath);
                            },
                          );
                        },
                      ),
                  ],
                ),

                const SizedBox(height: 16),

                // Seek Progress Slider
                SliderTheme(
                  data: SliderTheme.of(context).copyWith(
                    trackHeight: 4,
                    thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 6),
                    overlayShape: const RoundSliderOverlayShape(overlayRadius: 14),
                  ),
                  child: Slider(
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
                ),

                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        _formatDuration(position),
                        style: theme.textTheme.bodySmall,
                      ),
                      Text(
                        _formatDuration(duration),
                        style: theme.textTheme.bodySmall,
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 16),

                // Playback Controls Row (Shuffle, Prev, Play/Pause, Next, Repeat)
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    // Shuffle Button
                    IconButton(
                      icon: Icon(
                        Icons.shuffle,
                        color: isShuffle
                            ? theme.colorScheme.primary
                            : theme.colorScheme.onSurfaceVariant,
                      ),
                      tooltip: isShuffle ? 'Shuffle On' : 'Shuffle Off',
                      onPressed: () => controller.toggleShuffle(),
                    ),

                    // Previous Button
                    IconButton(
                      iconSize: 42,
                      icon: const Icon(Icons.skip_previous),
                      tooltip: 'Previous Track',
                      onPressed: () => controller.seekToPrevious(),
                    ),

                    // Play/Pause Button
                    Container(
                      width: 64,
                      height: 64,
                      decoration: BoxDecoration(
                        color: theme.colorScheme.primary,
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: theme.colorScheme.primary.withOpacity(0.3),
                            blurRadius: 12,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: IconButton(
                        iconSize: 34,
                        color: theme.colorScheme.onPrimary,
                        icon: Icon(isPlaying ? Icons.pause : Icons.play_arrow),
                        tooltip: isPlaying ? 'Pause' : 'Play',
                        onPressed: () => controller.togglePlayPause(),
                      ),
                    ),

                    // Next Button
                    IconButton(
                      iconSize: 42,
                      icon: const Icon(Icons.skip_next),
                      tooltip: 'Next Track',
                      onPressed: () => controller.seekToNext(),
                    ),

                    // Repeat Button (off -> all -> one)
                    IconButton(
                      icon: Icon(
                        loopMode == LoopMode.one
                            ? Icons.repeat_one
                            : Icons.repeat,
                        color: loopMode != LoopMode.off
                            ? theme.colorScheme.primary
                            : theme.colorScheme.onSurfaceVariant,
                      ),
                      tooltip: loopMode == LoopMode.one
                          ? 'Repeat One'
                          : loopMode == LoopMode.all
                              ? 'Repeat All'
                              : 'Repeat Off',
                      onPressed: () => controller.cycleLoopMode(),
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

  void _showTrackInfoDialog(BuildContext context, SongModel song) {
    showDialog(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          title: const Text('Track Details'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildInfoRow('Title', song.title),
              _buildInfoRow('Artist', song.artist ?? 'Unknown'),
              _buildInfoRow('Album', song.album ?? 'Unknown'),
              _buildInfoRow('Duration', _formatDuration(song.duration != null ? Duration(milliseconds: song.duration!) : null)),
              _buildInfoRow('File Path', song.data),
              _buildInfoRow('File Size', '${((song.size) / (1024 * 1024)).toStringAsFixed(2)} MB'),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Close'),
            ),
          ],
        );
      },
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.grey)),
          Text(value, style: const TextStyle(fontSize: 14)),
        ],
      ),
    );
  }
}
