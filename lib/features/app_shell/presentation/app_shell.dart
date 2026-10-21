import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class NavDestinationItem {
  final String path;
  final String label;
  final IconData icon;
  final IconData selectedIcon;

  const NavDestinationItem({
    required this.path,
    required this.label,
    required this.icon,
    required this.selectedIcon,
  });
}

const List<NavDestinationItem> allNavDestinations = [
  NavDestinationItem(
    path: '/calendar',
    label: 'Calendar',
    icon: Icons.calendar_month_outlined,
    selectedIcon: Icons.calendar_month_rounded,
  ),
  NavDestinationItem(
    path: '/money',
    label: 'Money',
    icon: Icons.account_balance_wallet_outlined,
    selectedIcon: Icons.account_balance_wallet_rounded,
  ),
  NavDestinationItem(
    path: '/tasks',
    label: 'Tasks',
    icon: Icons.check_circle_outline_rounded,
    selectedIcon: Icons.check_circle_rounded,
  ),
  NavDestinationItem(
    path: '/notes',
    label: 'Notes',
    icon: Icons.note_alt_outlined,
    selectedIcon: Icons.note_alt_rounded,
  ),
  NavDestinationItem(
    path: '/usage',
    label: 'Usage',
    icon: Icons.pie_chart_outline_rounded,
    selectedIcon: Icons.pie_chart_rounded,
  ),
  NavDestinationItem(
    path: '/music',
    label: 'Music',
    icon: Icons.music_note_outlined,
    selectedIcon: Icons.music_note_rounded,
  ),
];

/// Adaptive App Shell with persistent navigation across all seven modules and settings.
class AppShell extends StatelessWidget {
  final Widget child;

  const AppShell({super.key, required this.child});

  int _calculateSelectedIndex(BuildContext context) {
    final location = GoRouterState.of(context).uri.path;
    for (int i = 0; i < allNavDestinations.length; i++) {
      if (location.startsWith(allNavDestinations[i].path)) {
        return i;
      }
    }
    return 0;
  }

  void _onDestinationSelected(BuildContext context, int index) {
    if (index >= 0 && index < allNavDestinations.length) {
      try {
        final rootNav = Navigator.of(context, rootNavigator: true);
        if (rootNav.canPop()) {
          rootNav.pop();
        }
      } catch (_) {}
      try {
        final localNav = Navigator.of(context, rootNavigator: false);
        if (localNav.canPop()) {
          localNav.pop();
        }
      } catch (_) {}
      context.go(allNavDestinations[index].path);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final selectedIndex = _calculateSelectedIndex(context);
    final isSettingsOpen = GoRouterState.of(context).uri.path == '/settings';

    return LayoutBuilder(
      builder: (context, constraints) {
        final isWideScreen = constraints.maxWidth >= 720;

        if (isWideScreen) {
          // Tablet / Foldable / Landscape layout with NavigationRail
          return Scaffold(
            body: Row(
              children: [
                NavigationRail(
                  selectedIndex: isSettingsOpen ? null : selectedIndex,
                  onDestinationSelected: (index) => _onDestinationSelected(context, index),
                  labelType: NavigationRailLabelType.all,
                  leading: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 16.0),
                    child: Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        color: theme.colorScheme.primary.withOpacity(0.12),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(Icons.hub_rounded, color: theme.colorScheme.primary),
                    ),
                  ),
                  trailing: Expanded(
                    child: Align(
                      alignment: Alignment.bottomCenter,
                      child: Padding(
                        padding: const EdgeInsets.only(bottom: 20.0),
                        child: IconButton(
                          tooltip: 'Settings',
                          icon: Icon(
                            isSettingsOpen ? Icons.settings : Icons.settings_outlined,
                            color: isSettingsOpen
                                ? theme.colorScheme.primary
                                : theme.colorScheme.onSurface.withOpacity(0.6),
                          ),
                          onPressed: () => context.go('/settings'),
                        ),
                      ),
                    ),
                  ),
                  destinations: allNavDestinations.map((item) {
                    return NavigationRailDestination(
                      icon: Icon(item.icon),
                      selectedIcon: Icon(item.selectedIcon),
                      label: Text(item.label),
                    );
                  }).toList(),
                ),
                const VerticalDivider(width: 1),
                Expanded(child: child),
              ],
            ),
          );
        }

        // Mobile Layout with Persistent Compact Navigation Bar and More Sheet
        return Scaffold(
          body: child,
          bottomNavigationBar: _MobileBottomNav(
            selectedIndex: selectedIndex,
            isSettingsOpen: isSettingsOpen,
            onSelect: (index) => _onDestinationSelected(context, index),
            onOpenSettings: () => context.go('/settings'),
          ),
        );
      },
    );
  }
}

class _MobileBottomNav extends StatelessWidget {
  final int selectedIndex;
  final bool isSettingsOpen;
  final ValueChanged<int> onSelect;
  final VoidCallback onOpenSettings;

  const _MobileBottomNav({
    required this.selectedIndex,
    required this.isSettingsOpen,
    required this.onSelect,
    required this.onOpenSettings,
  });

  void _showAllModulesSheet(BuildContext context) {
    final theme = Theme.of(context);

    showModalBottomSheet(
      context: context,
      backgroundColor: theme.scaffoldBackgroundColor,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(20.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Center(
                  child: Container(
                    width: 36,
                    height: 4,
                    decoration: BoxDecoration(
                      color: theme.colorScheme.onSurface.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Text(
                      'All Modules',
                      style: theme.textTheme.titleLarge,
                    ),
                    const Spacer(),
                    IconButton(
                      icon: const Icon(Icons.settings_outlined),
                      tooltip: 'Settings',
                      onPressed: () {
                        Navigator.of(ctx).pop();
                        onOpenSettings();
                      },
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 4,
                    mainAxisSpacing: 12,
                    crossAxisSpacing: 12,
                    childAspectRatio: 0.85,
                  ),
                  itemCount: allNavDestinations.length,
                  itemBuilder: (context, i) {
                    final item = allNavDestinations[i];
                    final isSelected = selectedIndex == i && !isSettingsOpen;

                    return InkWell(
                      borderRadius: BorderRadius.circular(16),
                      onTap: () {
                        Navigator.of(ctx).pop();
                        onSelect(i);
                      },
                      child: Container(
                        decoration: BoxDecoration(
                          color: isSelected
                              ? theme.colorScheme.primary.withOpacity(0.12)
                              : theme.colorScheme.surface,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: isSelected
                                ? theme.colorScheme.primary
                                : theme.colorScheme.outlineVariant.withOpacity(0.4),
                          ),
                        ),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              isSelected ? item.selectedIcon : item.icon,
                              color: isSelected
                                  ? theme.colorScheme.primary
                                  : theme.colorScheme.onSurface,
                              size: 26,
                            ),
                            const SizedBox(height: 8),
                            Text(
                              item.label,
                              style: theme.textTheme.labelSmall?.copyWith(
                                color: isSelected
                                    ? theme.colorScheme.primary
                                    : theme.colorScheme.onSurface,
                                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                              ),
                              textAlign: TextAlign.center,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
                const SizedBox(height: 8),
              ],
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    // Primary 4 items in bottom bar: Calendar, Money, Tasks, Notes + Modules menu
    const primaryCount = 4;
    final isMoreSelected = selectedIndex >= primaryCount && !isSettingsOpen;

    return Container(
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        border: Border(
          top: BorderSide(
            color: theme.colorScheme.outlineVariant.withOpacity(0.3),
            width: 1,
          ),
        ),
      ),
      child: SafeArea(
        top: false,
        child: NavigationBar(
          height: 64,
          elevation: 0,
          selectedIndex: isSettingsOpen
              ? 0
              : (isMoreSelected ? 4 : selectedIndex),
          onDestinationSelected: (index) {
            if (index == 4) {
              _showAllModulesSheet(context);
            } else {
              onSelect(index);
            }
          },
          destinations: [
            ...allNavDestinations.take(primaryCount).map((item) {
              return NavigationDestination(
                icon: Icon(item.icon),
                selectedIcon: Icon(item.selectedIcon),
                label: item.label,
              );
            }),
            NavigationDestination(
              icon: Badge(
                isLabelVisible: isMoreSelected,
                child: const Icon(Icons.grid_view_rounded),
              ),
              selectedIcon: const Icon(Icons.grid_view_rounded),
              label: 'Modules',
            ),
          ],
        ),
      ),
    );
  }
}
