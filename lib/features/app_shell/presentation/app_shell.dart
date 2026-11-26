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
      context.go(allNavDestinations[index].path);
    }
  }

  @override
  Widget build(BuildContext context) {
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
                Container(
                  decoration: const BoxDecoration(
                    color: Color(0xFF051211),
                    border: Border(
                      right: BorderSide(color: Color(0x1F2DD4BF), width: 1),
                    ),
                  ),
                  child: NavigationRail(
                    backgroundColor: Colors.transparent,
                    selectedIndex: isSettingsOpen ? null : selectedIndex,
                    onDestinationSelected: (index) => _onDestinationSelected(context, index),
                    labelType: NavigationRailLabelType.all,
                    leading: Padding(
                      padding: const EdgeInsets.symmetric(vertical: 20.0),
                      child: Container(
                        width: 46,
                        height: 46,
                        decoration: BoxDecoration(
                          color: const Color(0x2619E6C8),
                          shape: BoxShape.circle,
                          border: Border.all(color: const Color(0x6619E6C8)),
                          boxShadow: const [
                            BoxShadow(
                              color: Color(0x3819E6C8),
                              blurRadius: 16,
                            ),
                          ],
                        ),
                        child: const Icon(Icons.hub_rounded, color: Color(0xFF19E6C8), size: 24),
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
                                  ? const Color(0xFF19E6C8)
                                  : const Color(0xFF94B5B0).withOpacity(0.7),
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
                ),
                Expanded(child: child),
              ],
            ),
          );
        }

        // Mobile Layout with Floating Glass Navigation Pill
        return Scaffold(
          extendBody: false,
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

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(12, 0, 12, 8),
        child: Container(
          height: 62,
          decoration: BoxDecoration(
            color: const Color(0xE8061413),
            borderRadius: BorderRadius.circular(32),
            border: Border.all(
              color: const Color(0x382DD4BF),
              width: 1.2,
            ),
            boxShadow: const [
              BoxShadow(
                color: Colors.black54,
                blurRadius: 24,
                offset: Offset(0, 8),
              ),
              BoxShadow(
                color: Color(0x1419E6C8),
                blurRadius: 16,
                spreadRadius: 1,
              ),
            ],
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: allNavDestinations.asMap().entries.map((entry) {
              final idx = entry.key;
              final item = entry.value;
              final isSelected = selectedIndex == idx && !isSettingsOpen;

              return Expanded(
                child: InkWell(
                  borderRadius: BorderRadius.circular(28),
                  onTap: () => onSelect(idx),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: isSelected ? const Color(0x2E19E6C8) : Colors.transparent,
                          borderRadius: BorderRadius.circular(14),
                          boxShadow: isSelected
                              ? const [
                                  BoxShadow(
                                    color: Color(0x2619E6C8),
                                    blurRadius: 8,
                                  ),
                                ]
                              : null,
                        ),
                        child: Icon(
                          isSelected ? item.selectedIcon : item.icon,
                          color: isSelected
                              ? const Color(0xFF19E6C8)
                              : const Color(0xFF5B7B76),
                          size: 20,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        item.label,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontSize: 9.5,
                          fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                          color: isSelected
                              ? const Color(0xFFF4FFFD)
                              : const Color(0xFF5B7B76),
                        ),
                      ),
                    ],
                  ),
                ),
              );
            }).toList(),
          ),
        ),
      ),
    );
  }
}
