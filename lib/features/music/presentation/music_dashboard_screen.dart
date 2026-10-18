import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:on_audio_query/on_audio_query.dart';
import '../../../core/database/app_database.dart';
import '../../../core/providers/core_providers.dart';
import '../models/music_models.dart';
import '../providers/music_library_provider.dart';
import '../providers/music_player_provider.dart';
import 'mini_player.dart';
import 'playlist_dialogs.dart';

class MusicDashboardScreen extends ConsumerStatefulWidget {
  const MusicDashboardScreen({super.key});

  @override
  ConsumerState<MusicDashboardScreen> createState() => _MusicDashboardScreenState();
}

class _MusicDashboardScreenState extends ConsumerState<MusicDashboardScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final TextEditingController _searchController = TextEditingController();
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
  }

  @override
  void dispose() {
    _tabController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  String _formatDuration(int? durationMs) {
    if (durationMs == null) return '--:--';
    final duration = Duration(milliseconds: durationMs);
    final minutes = duration.inMinutes;
    final seconds = duration.inSeconds.remainder(60).toString().padLeft(2, '0');
    return '$minutes:$seconds';
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final folderPath = ref.watch(musicFolderPathProvider);
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

    return Scaffold(
      appBar: AppBar(
        title: _isSearching
            ? TextField(
                controller: _searchController,
                autofocus: true,
                decoration: InputDecoration(
                  hintText: 'Search songs, artists, albums...',
                  border: InputBorder.none,
                  hintStyle: TextStyle(color: theme.colorScheme.onSurfaceVariant),
                ),
                style: const TextStyle(fontSize: 16),
                onChanged: (val) {
                  ref.read(musicSearchQueryProvider.notifier).state = val.trim();
                },
              )
            : const Text('Samsung Music'),
        actions: [
          IconButton(
            icon: Icon(_isSearching ? Icons.close : Icons.search),
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
          PopupMenuButton<String>(
            icon: const Icon(Icons.folder_open),
            tooltip: 'Music Folder',
            onSelected: (val) async {
              if (val == 'choose') {
                await ref.read(musicFolderPathProvider.notifier).pickFolder();
              } else if (val == 'all') {
                await ref.read(musicFolderPathProvider.notifier).clearFolder();
              }
            },
            itemBuilder: (ctx) => [
              PopupMenuItem(
                value: 'choose',
                child: Row(
                  children: [
                    const Icon(Icons.create_new_folder_outlined, size: 20),
                    const SizedBox(width: 10),
                    Text(folderPath == null ? 'Choose Music Folder' : 'Change Music Folder'),
                  ],
                ),
              ),
              if (folderPath != null)
                const PopupMenuItem(
                  value: 'all',
                  child: Row(
                    children: [
                      Icon(Icons.all_inclusive, size: 20),
                      SizedBox(width: 10),
                      Text('Scan All Device Audio'),
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
          indicatorSize: TabBarIndicatorSize.label,
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
          // Selected folder notice if configured
          if (folderPath != null)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
              color: theme.colorScheme.primary.withOpacity(0.08),
              child: Row(
                children: [
                  const Icon(Icons.folder, size: 16, color: Colors.blue),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'Folder: $folderPath',
                      style: const TextStyle(fontSize: 11, color: Colors.blue, fontWeight: FontWeight.w500),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  InkWell(
                    onTap: () => ref.read(musicFolderPathProvider.notifier).clearFolder(),
                    child: const Icon(Icons.clear, size: 16, color: Colors.blue),
                  ),
                ],
              ),
            ),

          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                // 1. Tracks (Songs) Tab
                songsAsync.when(
                  data: (songs) {
                    final filtered = _filterSongs(songs, searchQuery);
                    if (filtered.isEmpty) {
                      return _buildEmptyState('No music found. Use folder menu to select a directory.');
                    }
                    return _buildSongListView(filtered, controller);
                  },
                  loading: () => const Center(child: CircularProgressIndicator()),
                  error: (e, _) => Center(child: Text('Error: $e')),
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
                  loading: () => const Center(child: CircularProgressIndicator()),
                  error: (e, _) => Center(child: Text('Error: $e')),
                ),

                // 7. Favorites Tab
                favoritesAsync.when(
                  data: (favs) {
                    final filtered = _filterSongs(favs, searchQuery);
                    if (filtered.isEmpty) {
                      return _buildEmptyState('No favorite songs yet. Tap heart on any song to add.');
                    }
                    return _buildSongListView(filtered, controller);
                  },
                  loading: () => const Center(child: CircularProgressIndicator()),
                  error: (e, _) => Center(child: Text('Error: $e')),
                ),

                // 8. Recent Tab
                recentAsync.when(
                  data: (recent) {
                    final filtered = _filterSongs(recent, searchQuery);
                    if (filtered.isEmpty) {
                      return _buildEmptyState('No recently played songs.');
                    }
                    return _buildSongListView(filtered, controller);
                  },
                  loading: () => const Center(child: CircularProgressIndicator()),
                  error: (e, _) => Center(child: Text('Error: $e')),
                ),

                // 9. Most Played Tab
                mostPlayedAsync.when(
                  data: (mostPlayed) {
                    final filtered = _filterSongs(mostPlayed, searchQuery);
                    if (filtered.isEmpty) {
                      return _buildEmptyState('No songs played yet.');
                    }
                    return _buildSongListView(filtered, controller);
                  },
                  loading: () => const Center(child: CircularProgressIndicator()),
                  error: (e, _) => Center(child: Text('Error: $e')),
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

  Widget _buildEmptyState(String message) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.music_off_outlined, size: 56, color: Colors.grey),
            const SizedBox(height: 16),
            Text(message, textAlign: TextAlign.center, style: const TextStyle(color: Colors.grey)),
          ],
        ),
      ),
    );
  }

  Widget _buildSongListView(List<SongModel> songs, MusicPlaybackController controller) {
    return ListView.builder(
      itemCount: songs.length,
      itemBuilder: (context, index) {
        final song = songs[index];
        return ListTile(
          leading: ClipRRect(
            borderRadius: BorderRadius.circular(6),
            child: SizedBox(
              width: 46,
              height: 46,
              child: QueryArtworkWidget(
                id: song.id,
                type: ArtworkType.AUDIO,
                nullArtworkWidget: Container(
                  color: Theme.of(context).colorScheme.surfaceVariant,
                  child: const Icon(Icons.music_note, size: 24),
                ),
              ),
            ),
          ),
          title: Text(song.title, maxLines: 1, overflow: TextOverflow.ellipsis),
          subtitle: Text(
            '${song.artist ?? 'Unknown Artist'} • ${_formatDuration(song.duration)}',
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(fontSize: 12),
          ),
          trailing: PopupMenuButton<String>(
            icon: const Icon(Icons.more_vert, size: 20),
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
              const PopupMenuItem(value: 'next', child: Text('Play Next')),
              const PopupMenuItem(value: 'queue', child: Text('Add to Queue')),
              const PopupMenuItem(value: 'playlist', child: Text('Add to Playlist')),
              const PopupMenuItem(value: 'favorite', child: Text('Toggle Favorite')),
            ],
          ),
          onTap: () {
            controller.playSong(song, songs, index: index);
          },
        );
      },
    );
  }

  Widget _buildAlbumsView(List<AlbumItem> albums, MusicPlaybackController controller) {
    if (albums.isEmpty) return _buildEmptyState('No albums detected.');

    return GridView.builder(
      padding: const EdgeInsets.all(12),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 0.8,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
      ),
      itemCount: albums.length,
      itemBuilder: (context, index) {
        final album = albums[index];
        final sampleSong = album.songs.first;

        return Card(
          elevation: 2,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
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
                      color: Theme.of(context).colorScheme.surfaceVariant,
                      child: const Center(child: Icon(Icons.album, size: 56, color: Colors.grey)),
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(album.album, maxLines: 1, overflow: TextOverflow.ellipsis,
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                      Text('${album.artist} • ${album.songCount} songs',
                          maxLines: 1, overflow: TextOverflow.ellipsis,
                          style: const TextStyle(fontSize: 11, color: Colors.grey)),
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
            backgroundColor: Theme.of(context).colorScheme.primaryContainer,
            child: const Icon(Icons.person, color: Colors.indigo),
          ),
          title: Text(artist.artist, style: const TextStyle(fontWeight: FontWeight.bold)),
          subtitle: Text('${artist.songCount} songs • ${artist.albums.length} albums'),
          trailing: const Icon(Icons.chevron_right),
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
            backgroundColor: Theme.of(context).colorScheme.secondaryContainer,
            child: const Icon(Icons.music_note, color: Colors.teal),
          ),
          title: Text(genre.genre, style: const TextStyle(fontWeight: FontWeight.bold)),
          subtitle: Text('${genre.songCount} songs'),
          trailing: const Icon(Icons.chevron_right),
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
          leading: const Icon(Icons.folder, color: Colors.amber, size: 36),
          title: Text(folder.folderName, style: const TextStyle(fontWeight: FontWeight.bold)),
          subtitle: Text('${folder.songCount} songs\n${folder.folderPath}', style: const TextStyle(fontSize: 11)),
          isThreeLine: true,
          trailing: IconButton(
            icon: const Icon(Icons.play_circle_outline),
            onPressed: () => controller.playAll(folder.songs),
          ),
          onTap: () => _showCollectionSongsSheet(folder.folderName, folder.songs, controller),
        );
      },
    );
  }

  Widget _buildPlaylistsView(List<MusicPlaylist> playlists, MusicPlaybackController controller) {
    return Scaffold(
      floatingActionButton: FloatingActionButton.extended(
        icon: const Icon(Icons.add),
        label: const Text('New Playlist'),
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
                          color: Theme.of(context).colorScheme.primaryContainer,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Icon(Icons.queue_music, color: Colors.blue),
                      ),
                      title: Text(pl.name, style: const TextStyle(fontWeight: FontWeight.bold)),
                      subtitle: Text('${songs.length} songs'),
                      trailing: PopupMenuButton<String>(
                        onSelected: (action) async {
                          if (action == 'play') {
                            controller.playAll(songs);
                          } else if (action == 'delete') {
                            final db = ref.read(databaseProvider);
                            await db.musicDao.deletePlaylist(pl);
                          }
                        },
                        itemBuilder: (ctx) => [
                          const PopupMenuItem(value: 'play', child: Text('Play All')),
                          const PopupMenuItem(value: 'delete', child: Text('Delete Playlist')),
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

  void _showCollectionSongsSheet(String title, List<SongModel> songs, MusicPlaybackController controller) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return Container(
          height: MediaQuery.of(context).size.height * 0.75,
          decoration: BoxDecoration(
            color: Theme.of(context).scaffoldBackgroundColor,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
          ),
          child: Column(
            children: [
              Container(
                width: 40,
                height: 4,
                margin: const EdgeInsets.only(top: 12, bottom: 8),
                decoration: BoxDecoration(
                  color: Colors.grey.withOpacity(0.4),
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
                          Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                              maxLines: 1, overflow: TextOverflow.ellipsis),
                          Text('${songs.length} tracks', style: const TextStyle(fontSize: 12, color: Colors.grey)),
                        ],
                      ),
                    ),
                    Row(
                      children: [
                        FilledButton.tonalIcon(
                          icon: const Icon(Icons.play_arrow, size: 18),
                          label: const Text('Play'),
                          onPressed: () {
                            Navigator.pop(ctx);
                            controller.playAll(songs, shuffle: false);
                          },
                        ),
                        const SizedBox(width: 8),
                        IconButton.filledTonal(
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
              const Divider(height: 1),
              Expanded(
                child: songs.isEmpty
                    ? const Center(child: Text('No tracks in this collection.'))
                    : _buildSongListView(songs, controller),
              ),
            ],
          ),
        );
      },
    );
  }
}
