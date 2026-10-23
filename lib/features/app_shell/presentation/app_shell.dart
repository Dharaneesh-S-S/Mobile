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

  void _showAllModulesSheet(BuildContext context) {
    final theme = Theme.of(context);

    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (ctx) {
        return Container(
          decoration: const BoxDecoration(
            color: Color(0xF2061413),
            borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
            border: Border(
              top: BorderSide(color: Color(0x402DD4BF), width: 1.2),
              left: BorderSide(color: Color(0x262DD4BF), width: 1),
              right: BorderSide(color: Color(0x262DD4BF), width: 1),
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black,
                blurRadius: 30,
                offset: Offset(0, -10),
              ),
            ],
          ),
          child: SafeArea(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 20),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Center(
                    child: Container(
                      width: 40,
                      height: 4,
                      decoration: BoxDecoration(
                        color: const Color(0xFF19E6C8).withOpacity(0.4),
                        borderRadius: BorderRadius.circular(2),
                        boxShadow: const [
                          BoxShadow(
                            color: Color(0x3319E6C8),
                            blurRadius: 6,
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 18),
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0x1F2DD4BF),
                          borderRadius: BorderRadius.circular(9999),
                          border: Border.all(color: const Color(0x402DD4BF)),
                        ),
                        child: const Text(
                          'SUITE MODULES',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w700,
                            letterSpacing: 1.0,
                            color: Color(0xFF19E6C8),
                          ),
                        ),
                      ),
                      const Spacer(),
                      IconButton(
                        icon: const Icon(Icons.settings_outlined, color: Color(0xFF94B5B0)),
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
                      crossAxisCount: 3,
                      mainAxisSpacing: 12,
                      crossAxisSpacing: 12,
                      childAspectRatio: 1.1,
                    ),
                    itemCount: allNavDestinations.length,
                    itemBuilder: (context, i) {
                      final item = allNavDestinations[i];
                      final isSelected = selectedIndex == i && !isSettingsOpen;

                      return InkWell(
                        borderRadius: BorderRadius.circular(20),
                        onTap: () {
                          Navigator.of(ctx).pop();
                          onSelect(i);
                        },
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 180),
                          decoration: BoxDecoration(
                            color: isSelected
                                ? const Color(0x2619E6C8)
                                : const Color(0x80081A18),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: isSelected
                                  ? const Color(0xFF19E6C8)
                                  : const Color(0x262DD4BF),
                              width: isSelected ? 1.5 : 1,
                            ),
                            boxShadow: isSelected
                                ? const [
                                    BoxShadow(
                                      color: Color(0x3319E6C8),
                                      blurRadius: 16,
                                    ),
                                  ]
                                : null,
                          ),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                isSelected ? item.selectedIcon : item.icon,
                                color: isSelected
                                    ? const Color(0xFF19E6C8)
                                    : const Color(0xFF94B5B0),
                                size: 28,
                              ),
                              const SizedBox(height: 8),
                              Text(
                                item.label,
                                style: TextStyle(
                                  color: isSelected
                                      ? const Color(0xFFF4FFFD)
                                      : const Color(0xFF94B5B0),
                                  fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                                  fontSize: 12,
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
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    const primaryCount = 4;
    final isMoreSelected = selectedIndex >= primaryCount && !isSettingsOpen;

    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(16, 0, 16, 10),
        child: Container(
          height: 64,
          decoration: BoxDecoration(
            color: const Color(0xE8061413),
            borderRadius: BorderRadius.circular(36),
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
            children: [
              ...allNavDestinations.take(primaryCount).toList().asMap().entries.map((entry) {
                final idx = entry.key;
                final item = entry.value;
                final isSelected = selectedIndex == idx && !isSettingsOpen;

                return Expanded(
                  child: InkWell(
                    borderRadius: BorderRadius.circular(32),
                    onTap: () => onSelect(idx),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
                          decoration: BoxDecoration(
                            color: isSelected ? const Color(0x2E19E6C8) : Colors.transparent,
                            borderRadius: BorderRadius.circular(16),
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
                            size: 22,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          item.label,
                          style: TextStyle(
                            fontSize: 10,
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
              }),
              Expanded(
                child: InkWell(
                  borderRadius: BorderRadius.circular(32),
                  onTap: () => _showAllModulesSheet(context),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
                        decoration: BoxDecoration(
                          color: isMoreSelected ? const Color(0x2E19E6C8) : Colors.transparent,
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Badge(
                          isLabelVisible: isMoreSelected,
                          backgroundColor: const Color(0xFF19E6C8),
                          child: Icon(
                            Icons.grid_view_rounded,
                            color: isMoreSelected
                                ? const Color(0xFF19E6C8)
                                : const Color(0xFF5B7B76),
                            size: 22,
                          ),
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        'More',
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: isMoreSelected ? FontWeight.w700 : FontWeight.w500,
                          color: isMoreSelected
                              ? const Color(0xFFF4FFFD)
                              : const Color(0xFF5B7B76),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
