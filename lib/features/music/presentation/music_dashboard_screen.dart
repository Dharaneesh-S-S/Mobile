import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:on_audio_query/on_audio_query.dart';
import '../../../core/database/app_database.dart';
import '../../../core/providers/core_providers.dart';
import '../../../core/theme/app_colors.dart';
import '../models/music_models.dart';
import '../providers/music_library_provider.dart';
import '../providers/music_player_provider.dart';
import 'equalizer_sheet.dart';
import 'mini_player.dart';
import 'music_onboarding_sheet.dart';
import 'music_settings_screen.dart';
import 'music_web_view.dart';
import 'playlist_dialogs.dart';
import 'sleep_timer_sheet.dart';

class MusicDashboardScreen extends ConsumerStatefulWidget {
  const MusicDashboardScreen({super.key});

  @override
  ConsumerState<MusicDashboardScreen> createState() => _MusicDashboardScreenState();
}

class _MusicDashboardScreenState extends ConsumerState<MusicDashboardScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final TextEditingController _searchController = TextEditingController();
  final ScrollController _trackScrollController = ScrollController();
  bool _isSearching = false;

  final List<MusicTab> _tabs = [
    MusicTab.tracks,
    MusicTab.albums,
    MusicTab.artists,
    MusicTab.genres,
    MusicTab.folders,
    MusicTab.playlists,
    MusicTab.favorites,
    MusicTab.recent,
    MusicTab.mostPlayed,
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _tabs.length, vsync: this);

    WidgetsBinding.instance.addPostFrameCallback((_) {
      final folderState = ref.read(musicFolderStateProvider);
      if (!folderState.hasCompletedOnboarding && !kIsWeb) {
        showModalBottomSheet(
          context: context,
          isScrollControlled: true,
          isDismissible: false,
          enableDrag: false,
          backgroundColor: Colors.transparent,
          builder: (_) => const MusicOnboardingSheet(),
        );
      }
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    _searchController.dispose();
    _trackScrollController.dispose();
    super.dispose();
  }

  String _formatDuration(int? durationMs) {
    if (durationMs == null) return '--:--';
    final duration = Duration(milliseconds: durationMs);
    final minutes = duration.inMinutes;
    final seconds = duration.inSeconds.remainder(60).toString().padLeft(2, '0');
    return '$minutes:$seconds';
  }

  void _scrollToLetter(String letter, List<SongModel> songs) {
    int targetIndex = -1;
    if (letter == '#') {
      targetIndex = 0;
    } else {
      targetIndex = songs.indexWhere(
        (s) => s.title.toUpperCase().startsWith(letter.toUpperCase()),
      );
    }

    if (targetIndex != -1 && _trackScrollController.hasClients) {
      const itemHeight = 68.0;
      final offset = (targetIndex * itemHeight).clamp(
        0.0,
        _trackScrollController.position.maxScrollExtent,
      );
      _trackScrollController.animateTo(
        offset,
        duration: const Duration(milliseconds: 250),
        curve: Curves.easeOut,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    if (kIsWeb) {
      return const Scaffold(
        body: SafeArea(
          child: AuraBeatMusicWebView(),
        ),
      );
    }

    final folderState = ref.watch(musicFolderStateProvider);
    final songsAsync = ref.watch(songsProvider);
    final albums = ref.watch(albumsProvider);
    final artists = ref.watch(artistsProvider);
    final genres = ref.watch(genresProvider);
    final folders = ref.watch(foldersProvider);
    final playlistsAsync = ref.watch(musicPlaylistsProvider);
    final favoritesAsync = ref.watch(favoriteSongsProvider);
    final recentAsync = ref.watch(recentlyPlayedSongsProvider);
    final mostPlayedAsync = ref.watch(mostPlayedSongsProvider);
    final controller = ref.read(musicPlaybackControllerProvider);
    final searchQuery = ref.watch(musicSearchQueryProvider);
    final currentSort = ref.watch(songSortOptionProvider);
    final isMultiSelect = ref.watch(isMultiSelectModeProvider);
    final selectedIds = ref.watch(selectedSongIdsProvider);

    return Scaffold(
      backgroundColor: AppColors.canvasBase,
      appBar: isMultiSelect
          ? AppBar(
              backgroundColor: AppColors.canvasElevated,
              leading: IconButton(
                icon: const Icon(Icons.close, color: AppColors.textTealMuted),
                onPressed: () {
                  ref.read(selectedSongIdsProvider.notifier).state = {};
                },
              ),
              title: Text(
                '${selectedIds.length} Selected',
                style: const TextStyle(
                  color: AppColors.glowTealPrimary,
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
              actions: [
                IconButton(
                  icon: const Icon(Icons.select_all, color: AppColors.textTealBody),
                  tooltip: 'Select All',
                  onPressed: () {
                    final allSongs = songsAsync.valueOrNull ?? [];
                    if (selectedIds.length == allSongs.length) {
                      ref.read(selectedSongIdsProvider.notifier).state = {};
                    } else {
                      ref.read(selectedSongIdsProvider.notifier).state =
                          allSongs.map((s) => s.id).toSet();
                    }
                  },
                ),
                IconButton(
                  icon: const Icon(Icons.play_arrow, color: AppColors.glowTealPrimary),
                  tooltip: 'Play Selected',
                  onPressed: () {
                    final allSongs = songsAsync.valueOrNull ?? [];
                    final selectedSongs = allSongs.where((s) => selectedIds.contains(s.id)).toList();
                    if (selectedSongs.isNotEmpty) {
                      controller.playAll(selectedSongs);
                      ref.read(selectedSongIdsProvider.notifier).state = {};
                    }
                  },
                ),
                IconButton(
                  icon: const Icon(Icons.queue_music, color: AppColors.accentMint),
                  tooltip: 'Add to Queue',
                  onPressed: () {
                    final allSongs = songsAsync.valueOrNull ?? [];
                    final selectedSongs = allSongs.where((s) => selectedIds.contains(s.id)).toList();
                    if (selectedSongs.isNotEmpty) {
                      controller.addMultipleToQueue(selectedSongs);
                      ref.read(selectedSongIdsProvider.notifier).state = {};
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Added ${selectedSongs.length} tracks to queue')),
                      );
                    }
                  },
                ),
                IconButton(
                  icon: const Icon(Icons.playlist_add, color: AppColors.glowTealPrimary),
                  tooltip: 'Add to Playlist',
                  onPressed: () {
                    final allSongs = songsAsync.valueOrNull ?? [];
                    final selectedSongs = allSongs.where((s) => selectedIds.contains(s.id)).toList();
                    if (selectedSongs.isNotEmpty) {
                      PlaylistDialogs.showAddSongsToPlaylistDialog(context, ref, selectedSongs);
                      ref.read(selectedSongIdsProvider.notifier).state = {};
                    }
                  },
                ),
              ],
            )
          : AppBar(
              backgroundColor: AppColors.canvasBase,
              elevation: 0,
              title: _isSearching
                  ? TextField(
                      controller: _searchController,
                      autofocus: true,
                      decoration: const InputDecoration(
                        hintText: 'Search songs, artists, albums...',
                        border: InputBorder.none,
                        hintStyle: TextStyle(color: AppColors.textTealMuted),
                      ),
                      style: const TextStyle(color: AppColors.textWhiteHeading, fontSize: 16),
                      onChanged: (val) {
                        ref.read(musicSearchQueryProvider.notifier).state = val.trim();
                      },
                    )
                  : const Text(
                      'Samsung Music',
                      style: TextStyle(
                        color: AppColors.textWhiteHeading,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 0.5,
                      ),
                    ),
              actions: [
                IconButton(
                  icon: Icon(_isSearching ? Icons.close : Icons.search, color: AppColors.textTealBody),
                  tooltip: _isSearching ? 'Close Search' : 'Search Music',
                  onPressed: () {
                    setState(() {
                      _isSearching = !_isSearching;
                      if (!_isSearching) {
                        _searchController.clear();
                        ref.read(musicSearchQueryProvider.notifier).state = '';
                      }
                    });
                  },
                ),

                // Sort Menu
                PopupMenuButton<SongSortOption>(
                  icon: const Icon(Icons.sort, color: AppColors.textTealBody),
                  tooltip: 'Sort Tracks',
                  color: AppColors.canvasSurface,
                  initialValue: currentSort,
                  onSelected: (val) {
                    if (ref.read(songSortOptionProvider) == val) {
                      ref.read(songSortAscendingProvider.notifier).state =
                          !ref.read(songSortAscendingProvider);
                    } else {
                      ref.read(songSortOptionProvider.notifier).state = val;
                      ref.read(songSortAscendingProvider.notifier).state = true;
                    }
                  },
                  itemBuilder: (ctx) => [
                    _buildSortMenuItem(SongSortOption.title, 'Title', currentSort),
                    _buildSortMenuItem(SongSortOption.artist, 'Artist', currentSort),
                    _buildSortMenuItem(SongSortOption.album, 'Album', currentSort),
                    _buildSortMenuItem(SongSortOption.duration, 'Duration', currentSort),
                    _buildSortMenuItem(SongSortOption.dateAdded, 'Date Added', currentSort),
                  ],
                ),

                // Equalizer Quick Button
                IconButton(
                  icon: const Icon(Icons.equalizer, color: AppColors.textTealBody),
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

                // Sleep Timer Quick Button
                IconButton(
                  icon: const Icon(Icons.timer_outlined, color: AppColors.textTealBody),
                  tooltip: 'Sleep Timer',
                  onPressed: () {
                    showModalBottomSheet(
                      context: context,
                      backgroundColor: Colors.transparent,
                      builder: (_) => const SleepTimerSheet(),
                    );
                  },
                ),

                // Settings & Folder options
                PopupMenuButton<String>(
                  icon: const Icon(Icons.more_vert, color: AppColors.textTealBody),
                  tooltip: 'More Options',
                  color: AppColors.canvasSurface,
                  onSelected: (val) async {
                    if (val == 'settings') {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const MusicSettingsScreen()),
                      );
                    } else if (val == 'rescan') {
                      await ref.read(musicFolderStateProvider.notifier).rescan();
                    } else if (val == 'onboarding') {
                      showModalBottomSheet(
                        context: context,
                        isScrollControlled: true,
                        backgroundColor: Colors.transparent,
                        builder: (_) => const MusicOnboardingSheet(),
                      );
                    }
                  },
                  itemBuilder: (ctx) => [
                    const PopupMenuItem(
                      value: 'settings',
                      child: Row(
                        children: [
                          Icon(Icons.settings_outlined, color: AppColors.glowTealPrimary, size: 20),
                          SizedBox(width: 10),
                          Text('Music Settings', style: TextStyle(color: AppColors.textWhiteHeading)),
                        ],
                      ),
                    ),
                    const PopupMenuItem(
                      value: 'rescan',
                      child: Row(
                        children: [
                          Icon(Icons.refresh, color: AppColors.accentMint, size: 20),
                          SizedBox(width: 10),
                          Text('Rescan Folder', style: TextStyle(color: AppColors.textWhiteHeading)),
                        ],
                      ),
                    ),
                    const PopupMenuItem(
                      value: 'onboarding',
                      child: Row(
                        children: [
                          Icon(Icons.folder_open, color: AppColors.glowTealPrimary, size: 20),
                          SizedBox(width: 10),
                          Text('Folder Setup Wizard', style: TextStyle(color: AppColors.textWhiteHeading)),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
              bottom: TabBar(
                controller: _tabController,
                isScrollable: true,
                tabAlignment: TabAlignment.start,
                indicatorColor: AppColors.glowTealPrimary,
                indicatorWeight: 3,
                labelColor: AppColors.glowTealPrimary,
                unselectedLabelColor: AppColors.textTealMuted,
                labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                tabs: const [
                  Tab(text: 'Tracks'),
                  Tab(text: 'Albums'),
                  Tab(text: 'Artists'),
                  Tab(text: 'Genres'),
                  Tab(text: 'Folders'),
                  Tab(text: 'Playlists'),
                  Tab(text: 'Favorites'),
                  Tab(text: 'Recent'),
                  Tab(text: 'Most Played'),
                ],
              ),
            ),
      body: Column(
        children: [
          // Scanning progress indicator banner
          if (folderState.isScanning)
            LinearProgressIndicator(
              backgroundColor: AppColors.canvasBase,
              valueColor: const AlwaysStoppedAnimation<Color>(AppColors.glowTealPrimary),
              value: folderState.scanProgress > 0 ? folderState.scanProgress : null,
              minHeight: 3,
            ),

          // Folder banner with rescan & path info
          if (folderState.folderPath != null)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
              decoration: const BoxDecoration(
                color: AppColors.canvasElevated,
                border: Border(
                  bottom: BorderSide(color: AppColors.glassBorderFaint, width: 1),
                ),
              ),
              child: Row(
                children: [
                  const Icon(Icons.folder, size: 16, color: AppColors.accentMint),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'Folder: ${folderState.folderPath}',
                      style: const TextStyle(
                        fontSize: 11,
                        color: AppColors.textTealBody,
                        fontWeight: FontWeight.w500,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  if (folderState.isScanning) ...[
                    const SizedBox(width: 8),
                    const SizedBox(
                      width: 12,
                      height: 12,
                      child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.glowTealPrimary),
                    ),
                  ] else ...[
                    InkWell(
                      onTap: () => ref.read(musicFolderStateProvider.notifier).rescan(),
                      child: const Padding(
                        padding: EdgeInsets.symmetric(horizontal: 4.0),
                        child: Icon(Icons.refresh, size: 16, color: AppColors.textTealMuted),
                      ),
                    ),
                  ],
                ],
              ),
            ),

          // Onboarding prompt banner if onboarding is not completed
          if (!folderState.hasCompletedOnboarding)
            Container(
              margin: const EdgeInsets.all(12),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.glowTealDeep.withOpacity(0.3),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppColors.glassBorderGlow),
              ),
              child: Row(
                children: [
                  const Icon(Icons.music_note, color: AppColors.glowTealPrimary, size: 28),
                  const SizedBox(width: 12),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Choose Your Music Folder',
                          style: TextStyle(
                            color: AppColors.textWhiteHeading,
                            fontWeight: FontWeight.bold,
                            fontSize: 13,
                          ),
                        ),
                        SizedBox(height: 2),
                        Text(
                          'Select your offline music directory to scan tracks',
                          style: TextStyle(color: AppColors.textTealBody, fontSize: 11),
                        ),
                      ],
                    ),
                  ),
                  FilledButton.tonal(
                    style: FilledButton.styleFrom(
                      backgroundColor: AppColors.glowTealPrimary,
                      foregroundColor: AppColors.canvasBase,
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    ),
                    onPressed: () {
                      showModalBottomSheet(
                        context: context,
                        isScrollControlled: true,
                        backgroundColor: Colors.transparent,
                        builder: (_) => const MusicOnboardingSheet(),
                      );
                    },
                    child: const Text('Setup', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                  ),
                ],
              ),
            ),

          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                // 1. Tracks (Songs) Tab with Alphabet Fast-Scrubber
                songsAsync.when(
                  data: (songs) {
                    final filtered = _filterSongs(songs, searchQuery);
                    if (filtered.isEmpty) {
                      return _buildEmptyState(
                        'No music found in folder.',
                        showChooseFolder: true,
                      );
                    }
                    return _buildSongListViewWithScrubber(
                      filtered,
                      controller,
                      isMultiSelect,
                      selectedIds,
                    );
                  },
                  loading: () => const Center(
                    child: CircularProgressIndicator(color: AppColors.glowTealPrimary),
                  ),
                  error: (e, _) => Center(
                    child: Text('Error: $e', style: const TextStyle(color: AppColors.accentRose)),
                  ),
                ),

                // 2. Albums Tab
                _buildAlbumsView(albums, controller),

                // 3. Artists Tab
                _buildArtistsView(artists, controller),

                // 4. Genres Tab
                _buildGenresView(genres, controller),

                // 5. Folders Tab
                _buildFoldersView(folders, controller),

                // 6. Playlists Tab
                playlistsAsync.when(
                  data: (playlists) => _buildPlaylistsView(playlists, controller),
                  loading: () => const Center(
                    child: CircularProgressIndicator(color: AppColors.glowTealPrimary),
                  ),
                  error: (e, _) => Center(
                    child: Text('Error: $e', style: const TextStyle(color: AppColors.accentRose)),
                  ),
                ),

                // 7. Favorites Tab
                favoritesAsync.when(
                  data: (favs) {
                    final filtered = _filterSongs(favs, searchQuery);
                    if (filtered.isEmpty) {
                      return _buildEmptyState('No favorite songs yet. Tap heart on any song to add.');
                    }
                    return _buildSongListView(filtered, controller, isMultiSelect, selectedIds);
                  },
                  loading: () => const Center(
                    child: CircularProgressIndicator(color: AppColors.glowTealPrimary),
                  ),
                  error: (e, _) => Center(
                    child: Text('Error: $e', style: const TextStyle(color: AppColors.accentRose)),
                  ),
                ),

                // 8. Recent Tab
                recentAsync.when(
                  data: (recent) {
                    final filtered = _filterSongs(recent, searchQuery);
                    if (filtered.isEmpty) {
                      return _buildEmptyState('No recently played songs.');
                    }
                    return _buildSongListView(filtered, controller, isMultiSelect, selectedIds);
                  },
                  loading: () => const Center(
                    child: CircularProgressIndicator(color: AppColors.glowTealPrimary),
                  ),
                  error: (e, _) => Center(
                    child: Text('Error: $e', style: const TextStyle(color: AppColors.accentRose)),
                  ),
                ),

                // 9. Most Played Tab
                mostPlayedAsync.when(
                  data: (mostPlayed) {
                    final filtered = _filterSongs(mostPlayed, searchQuery);
                    if (filtered.isEmpty) {
                      return _buildEmptyState('No songs played yet.');
                    }
                    return _buildSongListView(filtered, controller, isMultiSelect, selectedIds);
                  },
                  loading: () => const Center(
                    child: CircularProgressIndicator(color: AppColors.glowTealPrimary),
                  ),
                  error: (e, _) => Center(
                    child: Text('Error: $e', style: const TextStyle(color: AppColors.accentRose)),
                  ),
                ),
              ],
            ),
          ),

          // Persistent Mini Player
          const MiniPlayer(),
        ],
      ),
    );
  }

  PopupMenuItem<SongSortOption> _buildSortMenuItem(
    SongSortOption option,
    String label,
    SongSortOption current,
  ) {
    final isSelected = option == current;
    return PopupMenuItem(
      value: option,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              color: isSelected ? AppColors.glowTealPrimary : AppColors.textWhiteHeading,
              fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
            ),
          ),
          if (isSelected)
            const Icon(Icons.check, size: 18, color: AppColors.glowTealPrimary),
        ],
      ),
    );
  }

  List<SongModel> _filterSongs(List<SongModel> songs, String query) {
    if (query.isEmpty) return songs;
    final q = query.toLowerCase();
    return songs.where((s) {
      final title = s.title.toLowerCase();
      final artist = (s.artist ?? '').toLowerCase();
      final album = (s.album ?? '').toLowerCase();
      return title.contains(q) || artist.contains(q) || album.contains(q);
    }).toList();
  }

  Widget _buildEmptyState(String message, {bool showChooseFolder = false}) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.music_off_outlined, size: 56, color: AppColors.textTealMuted),
            const SizedBox(height: 16),
            Text(
              message,
              textAlign: TextAlign.center,
              style: const TextStyle(color: AppColors.textTealMuted, fontSize: 14),
            ),
            if (showChooseFolder) ...[
              const SizedBox(height: 20),
              FilledButton.icon(
                style: FilledButton.styleFrom(
                  backgroundColor: AppColors.glowTealPrimary,
                  foregroundColor: AppColors.canvasBase,
                ),
                icon: const Icon(Icons.folder_open),
                label: const Text('Choose Music Folder', style: TextStyle(fontWeight: FontWeight.bold)),
                onPressed: () {
                  showModalBottomSheet(
                    context: context,
                    isScrollControlled: true,
                    backgroundColor: Colors.transparent,
                    builder: (_) => const MusicOnboardingSheet(),
                  );
                },
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildSongListViewWithScrubber(
    List<SongModel> songs,
    MusicPlaybackController controller,
    bool isMultiSelect,
    Set<int> selectedIds,
  ) {
    final alphabet = ['#', ...List.generate(26, (i) => String.fromCharCode(65 + i))];

    return Stack(
      children: [
        ListView.builder(
          controller: _trackScrollController,
          padding: const EdgeInsets.only(right: 28, bottom: 8),
          itemCount: songs.length,
          itemBuilder: (context, index) {
            final song = songs[index];
            return _buildSongTile(song, songs, index, controller, isMultiSelect, selectedIds);
          },
        ),

        // Alphabet Fast-Scrubber Bar on right edge
        Positioned(
          top: 8,
          right: 2,
          bottom: 8,
          child: Container(
            width: 24,
            decoration: BoxDecoration(
              color: AppColors.canvasElevated.withOpacity(0.6),
              borderRadius: BorderRadius.circular(12),
            ),
            child: FittedBox(
              fit: BoxFit.scaleDown,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: alphabet.map((letter) {
                  return GestureDetector(
                    behavior: HitTestBehavior.opaque,
                    onTap: () => _scrollToLetter(letter, songs),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(vertical: 2.0, horizontal: 4.0),
                      child: Text(
                        letter,
                        style: const TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          color: AppColors.textTealMuted,
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildSongListView(
    List<SongModel> songs,
    MusicPlaybackController controller,
    bool isMultiSelect,
    Set<int> selectedIds,
  ) {
    return ListView.builder(
      itemCount: songs.length,
      itemBuilder: (context, index) {
        final song = songs[index];
        return _buildSongTile(song, songs, index, controller, isMultiSelect, selectedIds);
      },
    );
  }

  Widget _buildSongTile(
    SongModel song,
    List<SongModel> contextList,
    int index,
    MusicPlaybackController controller,
    bool isMultiSelect,
    Set<int> selectedIds,
  ) {
    final isSelected = selectedIds.contains(song.id);

    return Container(
      decoration: BoxDecoration(
        color: isSelected ? AppColors.glowTealDeep.withOpacity(0.35) : Colors.transparent,
        border: Border(
          bottom: BorderSide(color: AppColors.glassBorderFaint.withOpacity(0.3), width: 0.5),
        ),
      ),
      child: ListTile(
        leading: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (isMultiSelect)
              Padding(
                padding: const EdgeInsets.only(right: 8.0),
                child: Icon(
                  isSelected ? Icons.check_circle : Icons.circle_outlined,
                  color: isSelected ? AppColors.glowTealPrimary : AppColors.textTealMuted,
                  size: 22,
                ),
              ),
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: SizedBox(
                width: 46,
                height: 46,
                child: QueryArtworkWidget(
                  id: song.id,
                  type: ArtworkType.AUDIO,
                  nullArtworkWidget: Container(
                    color: AppColors.canvasElevated,
                    child: const Icon(Icons.music_note, color: AppColors.textTealMuted, size: 24),
                  ),
                ),
              ),
            ),
          ],
        ),
        title: Text(
          song.title,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: TextStyle(
            color: isSelected ? AppColors.glowTealPrimary : AppColors.textWhiteHeading,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
            fontSize: 14,
          ),
        ),
        subtitle: Text(
          '${song.artist ?? 'Unknown Artist'} • ${_formatDuration(song.duration)}',
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: const TextStyle(fontSize: 12, color: AppColors.textTealMuted),
        ),
        trailing: isMultiSelect
            ? null
            : PopupMenuButton<String>(
                icon: const Icon(Icons.more_vert, size: 20, color: AppColors.textTealMuted),
                color: AppColors.canvasSurface,
                onSelected: (action) {
                  if (action == 'next') {
                    controller.playNext(song);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Playing next')),
                    );
                  } else if (action == 'queue') {
                    controller.addToQueue(song);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Added to queue')),
                    );
                  } else if (action == 'playlist') {
                    PlaylistDialogs.showAddToPlaylistDialog(context, ref, song);
                  } else if (action == 'favorite') {
                    final db = ref.read(databaseProvider);
                    db.musicDao.toggleFavorite(song.data);
                    ref.invalidate(favoriteSongsProvider);
                  }
                },
                itemBuilder: (ctx) => [
                  const PopupMenuItem(
                    value: 'next',
                    child: Row(
                      children: [
                        Icon(Icons.skip_next, color: AppColors.glowTealPrimary, size: 18),
                        SizedBox(width: 8),
                        Text('Play Next', style: TextStyle(color: AppColors.textWhiteHeading)),
                      ],
                    ),
                  ),
                  const PopupMenuItem(
                    value: 'queue',
                    child: Row(
                      children: [
                        Icon(Icons.queue_music, color: AppColors.accentMint, size: 18),
                        SizedBox(width: 8),
                        Text('Add to Queue', style: TextStyle(color: AppColors.textWhiteHeading)),
                      ],
                    ),
                  ),
                  const PopupMenuItem(
                    value: 'playlist',
                    child: Row(
                      children: [
                        Icon(Icons.playlist_add, color: AppColors.glowTealPrimary, size: 18),
                        SizedBox(width: 8),
                        Text('Add to Playlist', style: TextStyle(color: AppColors.textWhiteHeading)),
                      ],
                    ),
                  ),
                  const PopupMenuItem(
                    value: 'favorite',
                    child: Row(
                      children: [
                        Icon(Icons.favorite_border, color: AppColors.accentRose, size: 18),
                        SizedBox(width: 8),
                        Text('Toggle Favorite', style: TextStyle(color: AppColors.textWhiteHeading)),
                      ],
                    ),
                  ),
                ],
              ),
        onTap: () {
          if (isMultiSelect) {
            final nextSet = Set<int>.from(selectedIds);
            if (nextSet.contains(song.id)) {
              nextSet.remove(song.id);
            } else {
              nextSet.add(song.id);
            }
            ref.read(selectedSongIdsProvider.notifier).state = nextSet;
          } else {
            controller.playSong(song, contextList, index: index);
          }
        },
        onLongPress: () {
          final nextSet = Set<int>.from(selectedIds);
          if (nextSet.contains(song.id)) {
            nextSet.remove(song.id);
          } else {
            nextSet.add(song.id);
          }
          ref.read(selectedSongIdsProvider.notifier).state = nextSet;
        },
      ),
    );
  }

  Widget _buildAlbumsView(List<AlbumItem> albums, MusicPlaybackController controller) {
    if (albums.isEmpty) return _buildEmptyState('No albums detected.');

    return GridView.builder(
      padding: const EdgeInsets.all(14),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 0.82,
        crossAxisSpacing: 14,
        mainAxisSpacing: 14,
      ),
      itemCount: albums.length,
      itemBuilder: (context, index) {
        final album = albums[index];
        final sampleSong = album.songs.first;

        return Container(
          decoration: BoxDecoration(
            color: AppColors.canvasElevated,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.glassBorderFaint),
          ),
          clipBehavior: Clip.antiAlias,
          child: InkWell(
            onTap: () => _showCollectionSongsSheet(album.album, album.songs, controller),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: QueryArtworkWidget(
                    id: sampleSong.id,
                    type: ArtworkType.AUDIO,
                    artworkWidth: double.infinity,
                    artworkHeight: double.infinity,
                    artworkFit: BoxFit.cover,
                    nullArtworkWidget: Container(
                      color: AppColors.canvasSurface,
                      child: const Center(
                        child: Icon(Icons.album, size: 52, color: AppColors.textTealMuted),
                      ),
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(10.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        album.album,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 13,
                          color: AppColors.textWhiteHeading,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        '${album.artist} • ${album.songCount} songs',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(fontSize: 11, color: AppColors.textTealMuted),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildArtistsView(List<ArtistItem> artists, MusicPlaybackController controller) {
    if (artists.isEmpty) return _buildEmptyState('No artists detected.');

    return ListView.builder(
      itemCount: artists.length,
      itemBuilder: (context, index) {
        final artist = artists[index];
        return ListTile(
          leading: CircleAvatar(
            backgroundColor: AppColors.canvasElevated,
            child: const Icon(Icons.person, color: AppColors.glowTealPrimary),
          ),
          title: Text(
            artist.artist,
            style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.textWhiteHeading),
          ),
          subtitle: Text(
            '${artist.songCount} songs • ${artist.albums.length} albums',
            style: const TextStyle(color: AppColors.textTealMuted, fontSize: 12),
          ),
          trailing: const Icon(Icons.chevron_right, color: AppColors.textTealMuted),
          onTap: () => _showCollectionSongsSheet(artist.artist, artist.songs, controller),
        );
      },
    );
  }

  Widget _buildGenresView(List<GenreItem> genres, MusicPlaybackController controller) {
    if (genres.isEmpty) return _buildEmptyState('No genres found.');

    return ListView.builder(
      itemCount: genres.length,
      itemBuilder: (context, index) {
        final genre = genres[index];
        return ListTile(
          leading: CircleAvatar(
            backgroundColor: AppColors.canvasElevated,
            child: const Icon(Icons.music_note, color: AppColors.accentMint),
          ),
          title: Text(
            genre.genre,
            style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.textWhiteHeading),
          ),
          subtitle: Text(
            '${genre.songCount} songs',
            style: const TextStyle(color: AppColors.textTealMuted, fontSize: 12),
          ),
          trailing: const Icon(Icons.chevron_right, color: AppColors.textTealMuted),
          onTap: () => _showCollectionSongsSheet(genre.genre, genre.songs, controller),
        );
      },
    );
  }

  Widget _buildFoldersView(List<FolderItem> folders, MusicPlaybackController controller) {
    if (folders.isEmpty) return _buildEmptyState('No folders detected.');

    return ListView.builder(
      itemCount: folders.length,
      itemBuilder: (context, index) {
        final folder = folders[index];
        return ListTile(
          leading: const Icon(Icons.folder, color: AppColors.accentMint, size: 36),
          title: Text(
            folder.folderName,
            style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.textWhiteHeading),
          ),
          subtitle: Text(
            '${folder.songCount} songs\n${folder.folderPath}',
            style: const TextStyle(fontSize: 11, color: AppColors.textTealMuted),
          ),
          isThreeLine: true,
          trailing: IconButton(
            icon: const Icon(Icons.play_circle_outline, color: AppColors.glowTealPrimary),
            onPressed: () => controller.playAll(folder.songs),
          ),
          onTap: () => _showCollectionSongsSheet(folder.folderName, folder.songs, controller),
        );
      },
    );
  }

  Widget _buildPlaylistsView(List<MusicPlaylist> playlists, MusicPlaybackController controller) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppColors.glowTealPrimary,
        foregroundColor: AppColors.canvasBase,
        icon: const Icon(Icons.add),
        label: const Text('New Playlist', style: TextStyle(fontWeight: FontWeight.bold)),
        onPressed: () => PlaylistDialogs.showCreatePlaylistDialog(context, ref),
      ),
      body: playlists.isEmpty
          ? _buildEmptyState('No playlists yet. Tap "New Playlist" to create one.')
          : ListView.builder(
              padding: const EdgeInsets.only(bottom: 72),
              itemCount: playlists.length,
              itemBuilder: (context, index) {
                final pl = playlists[index];
                return Consumer(
                  builder: (context, ref, _) {
                    final plSongsAsync = ref.watch(playlistSongsProvider(pl.id));
                    final songs = plSongsAsync.valueOrNull ?? [];

                    return ListTile(
                      leading: Container(
                        width: 48,
                        height: 48,
                        decoration: BoxDecoration(
                          color: AppColors.canvasElevated,
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: AppColors.glassBorderFaint),
                        ),
                        child: const Icon(Icons.queue_music, color: AppColors.glowTealPrimary),
                      ),
                      title: Text(
                        pl.name,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          color: AppColors.textWhiteHeading,
                        ),
                      ),
                      subtitle: Text(
                        '${songs.length} songs',
                        style: const TextStyle(color: AppColors.textTealMuted, fontSize: 12),
                      ),
                      trailing: PopupMenuButton<String>(
                        color: AppColors.canvasSurface,
                        onSelected: (action) async {
                          if (action == 'play') {
                            controller.playAll(songs);
                          } else if (action == 'delete') {
                            final db = ref.read(databaseProvider);
                            await db.musicDao.deletePlaylist(pl);
                          }
                        },
                        itemBuilder: (ctx) => [
                          const PopupMenuItem(
                            value: 'play',
                            child: Row(
                              children: [
                                Icon(Icons.play_arrow, color: AppColors.glowTealPrimary, size: 18),
                                SizedBox(width: 8),
                                Text('Play All', style: TextStyle(color: AppColors.textWhiteHeading)),
                              ],
                            ),
                          ),
                          const PopupMenuItem(
                            value: 'delete',
                            child: Row(
                              children: [
                                Icon(Icons.delete_outline, color: AppColors.accentRose, size: 18),
                                SizedBox(width: 8),
                                Text('Delete Playlist', style: TextStyle(color: AppColors.textWhiteHeading)),
                              ],
                            ),
                          ),
                        ],
                      ),
                      onTap: () => _showCollectionSongsSheet(pl.name, songs, controller),
                    );
                  },
                );
              },
            ),
    );
  }

  void _showCollectionSongsSheet(
    String title,
    List<SongModel> songs,
    MusicPlaybackController controller,
  ) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return Container(
          height: MediaQuery.of(context).size.height * 0.75,
          decoration: const BoxDecoration(
            color: AppColors.canvasBase,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
            border: Border(
              top: BorderSide(color: AppColors.glassBorderGlow, width: 1.2),
            ),
          ),
          child: Column(
            children: [
              Container(
                width: 44,
                height: 4,
                margin: const EdgeInsets.only(top: 12, bottom: 8),
                decoration: BoxDecoration(
                  color: AppColors.textTealMuted.withOpacity(0.4),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 8, 20, 12),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            title,
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: AppColors.textWhiteHeading,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          Text(
                            '${songs.length} tracks',
                            style: const TextStyle(fontSize: 12, color: AppColors.textTealMuted),
                          ),
                        ],
                      ),
                    ),
                    Row(
                      children: [
                        FilledButton.tonalIcon(
                          style: FilledButton.styleFrom(
                            backgroundColor: AppColors.glowTealPrimary,
                            foregroundColor: AppColors.canvasBase,
                          ),
                          icon: const Icon(Icons.play_arrow, size: 18),
                          label: const Text('Play', style: TextStyle(fontWeight: FontWeight.bold)),
                          onPressed: () {
                            Navigator.pop(ctx);
                            controller.playAll(songs, shuffle: false);
                          },
                        ),
                        const SizedBox(width: 8),
                        IconButton.filledTonal(
                          style: IconButton.styleFrom(
                            backgroundColor: AppColors.canvasElevated,
                            foregroundColor: AppColors.glowTealPrimary,
                          ),
                          icon: const Icon(Icons.shuffle, size: 18),
                          tooltip: 'Shuffle',
                          onPressed: () {
                            Navigator.pop(ctx);
                            controller.playAll(songs, shuffle: true);
                          },
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const Divider(height: 1, color: AppColors.glassBorderFaint),
              Expanded(
                child: songs.isEmpty
                    ? const Center(
                        child: Text(
                          'No tracks in this collection.',
                          style: TextStyle(color: AppColors.textTealMuted),
                        ),
                      )
                    : ListView.builder(
                        itemCount: songs.length,
                        itemBuilder: (context, idx) {
                          final song = songs[idx];
                          return ListTile(
                            leading: ClipRRect(
                              borderRadius: BorderRadius.circular(6),
                              child: SizedBox(
                                width: 44,
                                height: 44,
                                child: QueryArtworkWidget(
                                  id: song.id,
                                  type: ArtworkType.AUDIO,
                                  nullArtworkWidget: Container(
                                    color: AppColors.canvasElevated,
                                    child: const Icon(
                                      Icons.music_note,
                                      color: AppColors.textTealMuted,
                                      size: 20,
                                    ),
                                  ),
                                ),
                              ),
                            ),
                            title: Text(
                              song.title,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                color: AppColors.textWhiteHeading,
                                fontSize: 14,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            subtitle: Text(
                              '${song.artist ?? 'Unknown Artist'} • ${_formatDuration(song.duration)}',
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(fontSize: 12, color: AppColors.textTealMuted),
                            ),
                            onTap: () {
                              Navigator.pop(ctx);
                              controller.playSong(song, songs, index: idx);
                            },
                          );
                        },
                      ),
              ),
            ],
          ),
        );
      },
    );
  }
}
