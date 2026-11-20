import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:just_audio/just_audio.dart';
import 'package:just_audio_background/just_audio_background.dart';
import 'package:on_audio_query/on_audio_query.dart';
import '../../../core/providers/core_providers.dart';
import '../../../core/theme/app_colors.dart';
import '../models/lyrics_model.dart';
import '../providers/music_player_provider.dart';
import 'equalizer_sheet.dart';
import 'playlist_dialogs.dart';
import 'queue_bottom_sheet.dart';
import 'sleep_timer_sheet.dart';

class NowPlayingScreen extends ConsumerStatefulWidget {
  const NowPlayingScreen({super.key});

  @override
  ConsumerState<NowPlayingScreen> createState() => _NowPlayingScreenState();
}

class _NowPlayingScreenState extends ConsumerState<NowPlayingScreen> {
  bool _showLyrics = false;
  List<LyricLine>? _lyrics;
  bool _loadingLyrics = false;
  String? _lastLoadedSongPath;
  final ScrollController _lyricsScrollController = ScrollController();
  int _lastActiveIndex = -1;

  String _formatDuration(Duration? duration) {
    if (duration == null) return '--:--';
    final minutes = duration.inMinutes;
    final seconds = duration.inSeconds.remainder(60).toString().padLeft(2, '0');
    return '$minutes:$seconds';
  }

  String _getAudioFormatBadge(String path) {
    final dot = path.lastIndexOf('.');
    if (dot != -1 && dot < path.length - 1) {
      final ext = path.substring(dot + 1).toUpperCase();
      if (ext == 'FLAC') return 'FLAC • 24-bit Lossless';
      if (ext == 'WAV') return 'WAV • Lossless';
      if (ext == 'M4A' || ext == 'AAC') return '$ext • 256 kbps';
      if (ext == 'OPUS' || ext == 'OGG') return '$ext • High Quality';
      return '$ext • 320 kbps';
    }
    return 'MP3 • 320 kbps';
  }

  Future<void> _fetchLyricsIfNeeded(String path) async {
    if (_lastLoadedSongPath == path) return;
    _lastLoadedSongPath = path;
    setState(() {
      _loadingLyrics = true;
      _lyrics = null;
      _lastActiveIndex = -1;
    });

    final lines = await LyricsParser.loadLyricsForSong(path);
    if (mounted) {
      setState(() {
        _lyrics = lines;
        _loadingLyrics = false;
      });
    }
  }

  void _scrollToActiveLyric(int activeIndex) {
    if (activeIndex != _lastActiveIndex && _lyricsScrollController.hasClients) {
      _lastActiveIndex = activeIndex;
      const itemHeight = 44.0;
      final targetOffset = (activeIndex * itemHeight) - 120.0;
      _lyricsScrollController.animateTo(
        targetOffset.clamp(0.0, _lyricsScrollController.position.maxScrollExtent),
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeOut,
      );
    }
  }

  @override
  void dispose() {
    _lyricsScrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final player = ref.watch(musicPlayerProvider);
    final controller = ref.read(musicPlaybackControllerProvider);
    final sequenceStateAsync = ref.watch(sequenceStateProvider);
    final playerStateAsync = ref.watch(playerStateProvider);
    final positionAsync = ref.watch(positionProvider);
    final currentSong = ref.watch(currentSongProvider);
    final db = ref.watch(databaseProvider);
    final sleepTimerRemaining = ref.watch(sleepTimerRemainingProvider);
    final playbackSpeed = ref.watch(playbackSpeedProvider);

    return Scaffold(
      backgroundColor: AppColors.canvasBase,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text(
          'Now Playing',
          style: TextStyle(
            color: AppColors.textWhiteHeading,
            fontWeight: FontWeight.bold,
            letterSpacing: 0.5,
          ),
        ),
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.keyboard_arrow_down, color: AppColors.textTealBody, size: 28),
          tooltip: 'Minimize',
          onPressed: () => Navigator.of(context).pop(),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.queue_music, color: AppColors.textTealBody),
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
            icon: const Icon(Icons.more_vert, color: AppColors.textTealBody),
            color: AppColors.canvasSurface,
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
                    Icon(Icons.playlist_add, color: AppColors.glowTealPrimary, size: 20),
                    SizedBox(width: 10),
                    Text('Add to Playlist', style: TextStyle(color: AppColors.textWhiteHeading)),
                  ],
                ),
              ),
              const PopupMenuItem(
                value: 'info',
                child: Row(
                  children: [
                    Icon(Icons.info_outline, color: AppColors.accentMint, size: 20),
                    SizedBox(width: 10),
                    Text('Track Details', style: TextStyle(color: AppColors.textWhiteHeading)),
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
            return const Center(
              child: Text(
                'No song playing.',
                style: TextStyle(color: AppColors.textTealMuted),
              ),
            );
          }

          final currentItem = sequenceState.currentSource!.tag as MediaItem;
          final position = positionAsync.value ?? Duration.zero;
          final duration = player.duration ?? currentItem.duration ?? Duration.zero;
          final isPlaying = playerStateAsync.value?.playing ?? false;
          final isShuffle = player.shuffleModeEnabled;
          final loopMode = player.loopMode;
          final songPath = currentSong?.data ?? '';

          if (songPath.isNotEmpty) {
            _fetchLyricsIfNeeded(songPath);
          }

          // Compute active lyric line
          int activeLyricIndex = -1;
          if (_lyrics != null && _lyrics!.isNotEmpty) {
            for (int i = 0; i < _lyrics!.length; i++) {
              if (position >= _lyrics![i].timestamp) {
                activeLyricIndex = i;
              } else {
                break;
              }
            }
            if (_showLyrics && activeLyricIndex >= 0) {
              WidgetsBinding.instance.addPostFrameCallback((_) {
                _scrollToActiveLyric(activeLyricIndex);
              });
            }
          }

          return GestureDetector(
            onVerticalDragEnd: (details) {
              // Swipe down to minimize
              if ((details.primaryVelocity ?? 0) > 300) {
                Navigator.of(context).pop();
              }
            },
            child: Container(
              decoration: const BoxDecoration(
                gradient: RadialGradient(
                  center: Alignment(0, -0.4),
                  radius: 1.2,
                  colors: [
                    Color(0xFF072421),
                    AppColors.canvasBase,
                  ],
                ),
              ),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 8.0),
                child: Column(
                  children: [
                    const SizedBox(height: 6),
                    // High-res audio format badge
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppColors.glassBgSubtle,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppColors.glassBorderFaint),
                      ),
                      child: Text(
                        _getAudioFormatBadge(songPath),
                        style: const TextStyle(
                          color: AppColors.accentMint,
                          fontSize: 10,
                          fontWeight: FontWeight.w600,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ),

                    const Spacer(flex: 1),

                    // Center Content: Album Art or Lyrics
                    AnimatedSwitcher(
                      duration: const Duration(milliseconds: 300),
                      child: _showLyrics
                          ? Container(
                              key: const ValueKey('lyrics_view'),
                              height: 300,
                              width: double.infinity,
                              decoration: BoxDecoration(
                                color: AppColors.glassBgSubtle,
                                borderRadius: BorderRadius.circular(20),
                                border: Border.all(color: AppColors.glassBorderGlow),
                              ),
                              child: _loadingLyrics
                                  ? const Center(
                                      child: CircularProgressIndicator(color: AppColors.glowTealPrimary),
                                    )
                                  : (_lyrics == null || _lyrics!.isEmpty)
                                      ? Center(
                                          child: Padding(
                                            padding: const EdgeInsets.all(24.0),
                                            child: Column(
                                              mainAxisSize: MainAxisSize.min,
                                              children: [
                                                const Icon(Icons.lyrics_outlined,
                                                    size: 48, color: AppColors.textTealMuted),
                                                const SizedBox(height: 12),
                                                const Text(
                                                  'No synchronized lyrics found',
                                                  style: TextStyle(
                                                    color: AppColors.textTealBody,
                                                    fontWeight: FontWeight.w500,
                                                  ),
                                                ),
                                                const SizedBox(height: 6),
                                                Text(
                                                  'Place an .lrc file named "${currentItem.title}.lrc" in the song directory.',
                                                  textAlign: TextAlign.center,
                                                  style: const TextStyle(
                                                    fontSize: 11,
                                                    color: AppColors.textTealMuted,
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ),
                                        )
                                      : ListView.builder(
                                          controller: _lyricsScrollController,
                                          padding: const EdgeInsets.symmetric(vertical: 40, horizontal: 16),
                                          itemCount: _lyrics!.length,
                                          itemBuilder: (context, idx) {
                                            final line = _lyrics![idx];
                                            final isActive = idx == activeLyricIndex;

                                            return GestureDetector(
                                              onTap: () {
                                                player.seek(line.timestamp);
                                              },
                                              child: AnimatedContainer(
                                                duration: const Duration(milliseconds: 200),
                                                padding: const EdgeInsets.symmetric(vertical: 8),
                                                alignment: Alignment.center,
                                                child: Text(
                                                  line.text,
                                                  textAlign: TextAlign.center,
                                                  style: TextStyle(
                                                    fontSize: isActive ? 18 : 14,
                                                    fontWeight: isActive ? FontWeight.bold : FontWeight.w400,
                                                    color: isActive
                                                        ? AppColors.glowTealPrimary
                                                        : AppColors.textTealMuted,
                                                    shadows: isActive
                                                        ? [
                                                            BoxShadow(
                                                              color: AppColors.glowTealPrimary.withOpacity(0.6),
                                                              blurRadius: 10,
                                                            ),
                                                          ]
                                                        : null,
                                                  ),
                                                ),
                                              ),
                                            );
                                          },
                                        ),
                            )
                          : GestureDetector(
                              key: const ValueKey('art_view'),
                              onHorizontalDragEnd: (details) {
                                if ((details.primaryVelocity ?? 0) < -250) {
                                  controller.seekToNext();
                                } else if ((details.primaryVelocity ?? 0) > 250) {
                                  controller.seekToPrevious();
                                }
                              },
                              child: Container(
                                width: 270,
                                height: 270,
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(24),
                                  color: AppColors.canvasElevated,
                                  border: Border.all(color: AppColors.glassBorderGlow, width: 1.5),
                                  boxShadow: [
                                    BoxShadow(
                                      color: AppColors.glowTealDeep.withOpacity(0.4),
                                      blurRadius: 28,
                                      offset: const Offset(0, 12),
                                    ),
                                  ],
                                ),
                                child: ClipRRect(
                                  borderRadius: BorderRadius.circular(22),
                                  child: currentSong != null
                                      ? QueryArtworkWidget(
                                          id: currentSong.id,
                                          type: ArtworkType.AUDIO,
                                          artworkFit: BoxFit.cover,
                                          nullArtworkWidget: Container(
                                            color: AppColors.canvasElevated,
                                            child: const Icon(
                                              Icons.music_note,
                                              size: 110,
                                              color: AppColors.glowTealPrimary,
                                            ),
                                          ),
                                        )
                                      : const Icon(
                                          Icons.music_note,
                                          size: 110,
                                          color: AppColors.glowTealPrimary,
                                        ),
                                ),
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
                                style: const TextStyle(
                                  color: AppColors.textWhiteHeading,
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                  letterSpacing: 0.3,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                              const SizedBox(height: 4),
                              Text(
                                currentItem.artist ?? 'Unknown Artist',
                                style: const TextStyle(
                                  color: AppColors.textTealBody,
                                  fontSize: 15,
                                  fontWeight: FontWeight.w500,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                              if (currentItem.album != null && currentItem.album!.isNotEmpty) ...[
                                const SizedBox(height: 2),
                                Text(
                                  currentItem.album!,
                                  style: const TextStyle(
                                    color: AppColors.textTealMuted,
                                    fontSize: 12,
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
                                  color: isFav ? AppColors.accentRose : AppColors.textTealMuted,
                                ),
                                onPressed: () {
                                  db.musicDao.toggleFavorite(songPath);
                                },
                              );
                            },
                          ),
                      ],
                    ),

                    const SizedBox(height: 14),

                    // Seek Progress Slider
                    SliderTheme(
                      data: SliderTheme.of(context).copyWith(
                        trackHeight: 4,
                        activeTrackColor: AppColors.glowTealPrimary,
                        inactiveTrackColor: AppColors.glassBorderFaint,
                        thumbColor: AppColors.glowTealPrimary,
                        thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 6),
                        overlayShape: const RoundSliderOverlayShape(overlayRadius: 14),
                        overlayColor: AppColors.glowTealPrimary.withOpacity(0.2),
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
                            style: const TextStyle(color: AppColors.textTealMuted, fontSize: 12),
                          ),
                          Text(
                            _formatDuration(duration),
                            style: const TextStyle(color: AppColors.textTealMuted, fontSize: 12),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 12),

                    // Playback Controls Row (Shuffle, Prev, Play/Pause, Next, Repeat)
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        // Shuffle Button
                        IconButton(
                          icon: Icon(
                            Icons.shuffle,
                            color: isShuffle ? AppColors.glowTealPrimary : AppColors.textTealMuted,
                          ),
                          tooltip: isShuffle ? 'Shuffle On' : 'Shuffle Off',
                          onPressed: () => controller.toggleShuffle(),
                        ),

                        // Previous Button (hold to rewind 10s)
                        GestureDetector(
                          onLongPress: () {
                            final newPos = position - const Duration(seconds: 10);
                            player.seek(newPos < Duration.zero ? Duration.zero : newPos);
                          },
                          child: IconButton(
                            iconSize: 42,
                            icon: const Icon(Icons.skip_previous, color: AppColors.textWhiteHeading),
                            tooltip: 'Previous (Hold: Rewind 10s)',
                            onPressed: () => controller.seekToPrevious(),
                          ),
                        ),

                        // Play/Pause Button
                        Container(
                          width: 66,
                          height: 66,
                          decoration: BoxDecoration(
                            color: AppColors.glowTealPrimary,
                            shape: BoxShape.circle,
                            boxShadow: [
                              BoxShadow(
                                color: AppColors.glowTealPrimary.withOpacity(0.4),
                                blurRadius: 18,
                                offset: const Offset(0, 4),
                              ),
                            ],
                          ),
                          child: IconButton(
                            iconSize: 36,
                            color: AppColors.canvasBase,
                            icon: Icon(isPlaying ? Icons.pause : Icons.play_arrow),
                            tooltip: isPlaying ? 'Pause' : 'Play',
                            onPressed: () => controller.togglePlayPause(),
                          ),
                        ),

                        // Next Button (hold to fast forward 10s)
                        GestureDetector(
                          onLongPress: () {
                            final newPos = position + const Duration(seconds: 10);
                            player.seek(newPos > duration ? duration : newPos);
                          },
                          child: IconButton(
                            iconSize: 42,
                            icon: const Icon(Icons.skip_next, color: AppColors.textWhiteHeading),
                            tooltip: 'Next (Hold: Forward 10s)',
                            onPressed: () => controller.seekToNext(),
                          ),
                        ),

                        // Repeat Button (off -> all -> one)
                        IconButton(
                          icon: Icon(
                            loopMode == LoopMode.one
                                ? Icons.repeat_one
                                : Icons.repeat,
                            color: loopMode != LoopMode.off
                                ? AppColors.glowTealPrimary
                                : AppColors.textTealMuted,
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

                    // Extra Bottom Quick Actions: Lyrics, Equalizer, Sleep Timer, Speed
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      decoration: BoxDecoration(
                        color: AppColors.glassBgSubtle,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppColors.glassBorderFaint),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          // Lyrics Toggle
                          IconButton(
                            icon: Icon(
                              _showLyrics ? Icons.lyrics : Icons.lyrics_outlined,
                              color: _showLyrics ? AppColors.glowTealPrimary : AppColors.textTealMuted,
                            ),
                            tooltip: _showLyrics ? 'Show Artwork' : 'Show Synced Lyrics',
                            onPressed: () {
                              setState(() {
                                _showLyrics = !_showLyrics;
                              });
                            },
                          ),

                          // Equalizer
                          IconButton(
                            icon: const Icon(Icons.equalizer, color: AppColors.textTealMuted),
                            tooltip: 'Sound Equalizer',
                            onPressed: () {
                              showModalBottomSheet(
                                context: context,
                                isScrollControlled: true,
                                backgroundColor: Colors.transparent,
                                builder: (_) => const EqualizerSheet(),
                              );
                            },
                          ),

                          // Sleep Timer
                          Stack(
                            alignment: Alignment.topRight,
                            children: [
                              IconButton(
                                icon: Icon(
                                  sleepTimerRemaining != null ? Icons.timer : Icons.timer_outlined,
                                  color: sleepTimerRemaining != null
                                      ? AppColors.glowTealPrimary
                                      : AppColors.textTealMuted,
                                ),
                                tooltip: sleepTimerRemaining != null
                                    ? 'Sleep Timer: ${sleepTimerRemaining.inMinutes}m left'
                                    : 'Sleep Timer',
                                onPressed: () {
                                  showModalBottomSheet(
                                    context: context,
                                    backgroundColor: Colors.transparent,
                                    builder: (_) => const SleepTimerSheet(),
                                  );
                                },
                              ),
                              if (sleepTimerRemaining != null)
                                Container(
                                  width: 8,
                                  height: 8,
                                  margin: const EdgeInsets.only(top: 8, right: 8),
                                  decoration: const BoxDecoration(
                                    color: AppColors.glowTealPrimary,
                                    shape: BoxShape.circle,
                                  ),
                                ),
                            ],
                          ),

                          // Playback Speed Selector
                          PopupMenuButton<double>(
                            tooltip: 'Playback Speed',
                            color: AppColors.canvasSurface,
                            initialValue: playbackSpeed,
                            onSelected: (val) {
                              controller.setPlaybackSpeed(val);
                            },
                            child: Padding(
                              padding: const EdgeInsets.all(8.0),
                              child: Text(
                                '${playbackSpeed}x',
                                style: const TextStyle(
                                  color: AppColors.accentMint,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 13,
                                ),
                              ),
                            ),
                            itemBuilder: (ctx) => [0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((s) {
                              return PopupMenuItem(
                                value: s,
                                child: Text(
                                  '${s}x Speed',
                                  style: TextStyle(
                                    color: s == playbackSpeed
                                        ? AppColors.glowTealPrimary
                                        : AppColors.textWhiteHeading,
                                    fontWeight: s == playbackSpeed ? FontWeight.bold : FontWeight.normal,
                                  ),
                                ),
                              );
                            }).toList(),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 12),
                  ],
                ),
              ),
            ),
          );
        },
        loading: () => const Center(
          child: CircularProgressIndicator(color: AppColors.glowTealPrimary),
        ),
        error: (err, _) => Center(
          child: Text('Error: $err', style: const TextStyle(color: AppColors.accentRose)),
        ),
      ),
    );
  }

  void _showTrackInfoDialog(BuildContext context, SongModel song) {
    showDialog(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          backgroundColor: AppColors.canvasSurface,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
            side: const BorderSide(color: AppColors.glassBorderGlow),
          ),
          title: const Text('Track Details', style: TextStyle(color: AppColors.textWhiteHeading)),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildInfoRow('Title', song.title),
              _buildInfoRow('Artist', song.artist ?? 'Unknown'),
              _buildInfoRow('Album', song.album ?? 'Unknown'),
              _buildInfoRow('Duration', _formatDuration(song.duration != null ? Duration(milliseconds: song.duration!) : null)),
              _buildInfoRow('Format', _getAudioFormatBadge(song.data)),
              _buildInfoRow('File Path', song.data),
              _buildInfoRow('File Size', '${((song.size) / (1024 * 1024)).toStringAsFixed(2)} MB'),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Close', style: TextStyle(color: AppColors.glowTealPrimary)),
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
          Text(label, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: AppColors.textTealMuted)),
          const SizedBox(height: 1),
          Text(value, style: const TextStyle(fontSize: 13, color: AppColors.textWhiteHeading)),
        ],
      ),
    );
  }
}
