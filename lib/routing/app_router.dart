import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../features/app_shell/presentation/app_shell.dart';
import '../features/calendar/presentation/calendar_screen.dart';
import '../features/money/presentation/money_screen.dart';
import '../features/music/presentation/music_dashboard_screen.dart';
import '../features/notes/presentation/notes_dashboard_screen.dart';
import '../features/notes/presentation/note_editor_screen.dart';
import '../features/notes/presentation/notes_archive_screen.dart';
import '../features/notes/presentation/notes_trash_screen.dart';
import '../core/database/daos/note_dao.dart';
import '../features/pattern_lock/presentation/pattern_lock_screen.dart';
import '../features/pattern_lock/presentation/pattern_setup_screen.dart';
import '../features/pattern_lock/providers/pattern_lock_provider.dart';
import '../features/settings/presentation/settings_screen.dart';
import '../features/tasks/presentation/pages/tasks_page.dart';
import '../features/usage/presentation/usage_dashboard_screen.dart';

final GlobalKey<NavigatorState> _rootNavigatorKey = GlobalKey<NavigatorState>(debugLabel: 'root');
final GlobalKey<NavigatorState> _shellNavigatorKey = GlobalKey<NavigatorState>(debugLabel: 'shell');

/// GoRouter provider with authentication / pattern lock guards
final routerProvider = Provider<GoRouter>((ref) {
  final lockState = ref.watch(patternLockProvider);

  return GoRouter(
    navigatorKey: _rootNavigatorKey,
    initialLocation: '/calendar',
    redirect: (context, state) {
      if (!lockState.isInitialized) {
        return null;
      }

      final isGoingToSetup = state.matchedLocation == '/setup-lock';
      final isGoingToLock = state.matchedLocation == '/lock';

      // 1. If pattern is not set at all, redirect to setup
      if (!lockState.isSet) {
        return isGoingToSetup ? null : '/setup-lock';
      }

      // 2. If pattern is enabled and app is locked, redirect to lock
      if (lockState.isEnabled && !lockState.isUnlocked) {
        return isGoingToLock ? null : '/lock';
      }

      // 3. If unlocked or disabled, do not stay on lock/setup screens
      if (isGoingToLock || isGoingToSetup) {
        return '/calendar';
      }

      return null;
    },
    routes: [
      GoRoute(
        path: '/setup-lock',
        builder: (context, state) => PatternSetupScreen(
          onSetupComplete: () => context.go('/calendar'),
        ),
      ),
      GoRoute(
        path: '/lock',
        builder: (context, state) => PatternLockScreen(
          onUnlocked: () => context.go('/calendar'),
        ),
      ),
      ShellRoute(
        navigatorKey: _shellNavigatorKey,
        builder: (context, state, child) => AppShell(child: child),
        routes: [
          GoRoute(
            path: '/calendar',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: CalendarScreen(),
            ),
          ),
          GoRoute(
            path: '/money',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: MoneyScreen(),
            ),
          ),
          GoRoute(
            path: '/tasks',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: TasksPage(),
            ),
          ),
          GoRoute(
            path: '/notes',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: NotesDashboardScreen(),
            ),
            routes: [
              GoRoute(
                path: 'edit',
                builder: (context, state) {
                  final extra = state.extra as Map<String, dynamic>?;
                  final noteDetails = extra?['note'] as NoteWithDetails?;
                  final type = extra?['type'] as String?;
                  return NoteEditorScreen(existingNote: noteDetails, initialType: type);
                },
              ),
              GoRoute(
                path: 'archive',
                builder: (context, state) => const NotesArchiveScreen(),
              ),
              GoRoute(
                path: 'trash',
                builder: (context, state) => const NotesTrashScreen(),
              ),
            ],
          ),
          GoRoute(
            path: '/usage',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: UsageDashboardScreen(),
            ),
          ),
          GoRoute(
            path: '/music',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: MusicDashboardScreen(),
            ),
          ),
          GoRoute(
            path: '/settings',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: SettingsScreen(),
            ),
          ),
        ],
      ),
    ],
  );
});
