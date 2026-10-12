import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/constants/app_constants.dart';
import '../providers/pattern_lock_provider.dart';
import 'widgets/pattern_grid_widget.dart';

enum SetupStep { drawInitial, confirmPattern }

/// First launch pattern setup screen requiring confirmation.
class PatternSetupScreen extends ConsumerStatefulWidget {
  final VoidCallback onSetupComplete;

  const PatternSetupScreen({super.key, required this.onSetupComplete});

  @override
  ConsumerState<PatternSetupScreen> createState() => _PatternSetupScreenState();
}

class _PatternSetupScreenState extends ConsumerState<PatternSetupScreen> {
  SetupStep _currentStep = SetupStep.drawInitial;
  String? _initialPattern;
  String? _statusMessage;
  bool _isError = false;

  void _handlePatternComplete(String pattern) async {
    if (pattern.length < AppConstants.minPatternLength) {
      setState(() {
        _isError = true;
        _statusMessage = 'Connect at least ${AppConstants.minPatternLength} dots';
      });
      _clearErrorAfterDelay();
      return;
    }

    if (_currentStep == SetupStep.drawInitial) {
      setState(() {
        _initialPattern = pattern;
        _currentStep = SetupStep.confirmPattern;
        _statusMessage = 'Draw the same pattern again to confirm';
        _isError = false;
      });
    } else if (_currentStep == SetupStep.confirmPattern) {
      if (pattern == _initialPattern) {
        // Successful match
        setState(() {
          _statusMessage = 'Pattern saved securely!';
          _isError = false;
        });

        final success = await ref
            .read(patternLockProvider.notifier)
            .setupPattern(pattern);

        if (success && mounted) {
          widget.onSetupComplete();
        }
      } else {
        // Mismatch
        setState(() {
          _isError = true;
          _statusMessage = 'Patterns do not match. Let’s try again.';
          _currentStep = SetupStep.drawInitial;
          _initialPattern = null;
        });
        _clearErrorAfterDelay();
      }
    }
  }

  void _clearErrorAfterDelay() {
    Future.delayed(const Duration(milliseconds: 1400), () {
      if (mounted) {
        setState(() {
          _isError = false;
          if (_currentStep == SetupStep.drawInitial) {
            _statusMessage = 'Draw a pattern connecting at least 4 dots';
          }
        });
      }
    });
  }

  void _resetSetup() {
    setState(() {
      _currentStep = SetupStep.drawInitial;
      _initialPattern = null;
      _statusMessage = 'Draw a pattern connecting at least 4 dots';
      _isError = false;
    });
  }

  @override
  void initState() {
    super.initState();
    _statusMessage = 'Draw a pattern connecting at least ${AppConstants.minPatternLength} dots';
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

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
                  Container(
                    width: 68,
                    height: 68,
                    decoration: BoxDecoration(
                      color: theme.colorScheme.primary.withOpacity(0.12),
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: theme.colorScheme.primary.withOpacity(0.3),
                        width: 1.5,
                      ),
                    ),
                    child: Icon(
                      _currentStep == SetupStep.drawInitial
                          ? Icons.shield_outlined
                          : Icons.check_circle_outline_rounded,
                      size: 32,
                      color: theme.colorScheme.primary,
                    ),
                  ),
                  const SizedBox(height: 20),

                  Text(
                    _currentStep == SetupStep.drawInitial
                        ? 'Set Up Pattern Lock'
                        : 'Confirm Your Pattern',
                    style: theme.textTheme.displayMedium,
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 8),

                  AnimatedSwitcher(
                    duration: const Duration(milliseconds: 200),
                    child: Text(
                      _statusMessage ?? '',
                      key: ValueKey(_statusMessage),
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

                  // Pattern grid
                  AspectRatio(
                    aspectRatio: 1.0,
                    child: PatternGridWidget(
                      onPatternComplete: _handlePatternComplete,
                      isError: _isError,
                      onClearError: () {
                        setState(() {
                          _isError = false;
                        });
                      },
                    ),
                  ),

                  const SizedBox(height: 24),
                  if (_currentStep == SetupStep.confirmPattern)
                    TextButton.icon(
                      onPressed: _resetSetup,
                      icon: const Icon(Icons.refresh_rounded, size: 18),
                      label: const Text('Start Over'),
                    ),

                  const Spacer(),
                  Text(
                    'Your pattern is stored as a salted cryptographic hash inside Android Keystore.',
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: theme.colorScheme.onSurface.withOpacity(0.4),
                      fontSize: 11,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 8),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
