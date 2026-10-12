import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/pattern_lock_provider.dart';
import 'widgets/pattern_grid_widget.dart';

/// Full-screen pattern unlock interface presented on launch when pattern lock is enabled.
class PatternLockScreen extends ConsumerStatefulWidget {
  final VoidCallback? onUnlocked;

  const PatternLockScreen({super.key, this.onUnlocked});

  @override
  ConsumerState<PatternLockScreen> createState() => _PatternLockScreenState();
}

class _PatternLockScreenState extends ConsumerState<PatternLockScreen> {
  bool _isError = false;

  void _handlePatternComplete(String pattern) async {
    final notifier = ref.read(patternLockProvider.notifier);
    final success = await notifier.unlock(pattern);

    if (success) {
      widget.onUnlocked?.call();
    } else {
      setState(() {
        _isError = true;
      });
      Future.delayed(const Duration(milliseconds: 1200), () {
        if (mounted) {
          setState(() {
            _isError = false;
          });
          notifier.clearError();
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final lockState = ref.watch(patternLockProvider);

    return Scaffold(
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 400),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 32.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Spacer(),
                  // App Icon / Security Shield
                  Container(
                    width: 72,
                    height: 72,
                    decoration: BoxDecoration(
                      color: theme.colorScheme.primary.withOpacity(0.12),
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: theme.colorScheme.primary.withOpacity(0.3),
                        width: 1.5,
                      ),
                    ),
                    child: Icon(
                      Icons.lock_rounded,
                      size: 34,
                      color: theme.colorScheme.primary,
                    ),
                  ),
                  const SizedBox(height: 24),

                  Text(
                    'Personal Hub',
                    style: theme.textTheme.displayMedium,
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 8),

                  AnimatedSwitcher(
                    duration: const Duration(milliseconds: 250),
                    child: Text(
                      _isError
                          ? (lockState.errorMessage ?? 'Incorrect pattern. Try again.')
                          : 'Draw your pattern to unlock',
                      key: ValueKey(_isError ? 'error' : 'normal'),
                      style: theme.textTheme.bodyLarge?.copyWith(
                        color: _isError
                            ? theme.colorScheme.error
                            : theme.colorScheme.onSurface.withOpacity(0.7),
                        fontWeight: _isError ? FontWeight.w600 : FontWeight.w400,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),
                  const SizedBox(height: 36),

                  // 3x3 Pattern Lock Grid
                  AspectRatio(
                    aspectRatio: 1.0,
                    child: PatternGridWidget(
                      onPatternComplete: _handlePatternComplete,
                      isError: _isError,
                      onClearError: () {
                        setState(() {
                          _isError = false;
                        });
                        ref.read(patternLockProvider.notifier).clearError();
                      },
                    ),
                  ),

                  const Spacer(),
                  // Offline Indicator Badge
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.cloud_off_rounded,
                        size: 16,
                        color: theme.colorScheme.onSurface.withOpacity(0.4),
                      ),
                      const SizedBox(width: 6),
                      Text(
                        '100% Offline & Private',
                        style: theme.textTheme.bodyMedium?.copyWith(
                          color: theme.colorScheme.onSurface.withOpacity(0.4),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
