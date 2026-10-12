import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/constants/app_constants.dart';
import '../providers/pattern_lock_provider.dart';
import 'widgets/pattern_grid_widget.dart';

enum ChangeFlowMode { changePattern, disablePattern, enablePattern }
enum ChangeStep { verifyCurrent, drawNew, confirmNew }

/// Modal bottom sheet or dialog to securely verify, change, or disable pattern lock.
class PatternChangeSheet extends ConsumerStatefulWidget {
  final ChangeFlowMode mode;

  const PatternChangeSheet({super.key, required this.mode});

  static Future<bool?> show(BuildContext context, {required ChangeFlowMode mode}) {
    return showModalBottomSheet<bool>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => PatternChangeSheet(mode: mode),
    );
  }

  @override
  ConsumerState<PatternChangeSheet> createState() => _PatternChangeSheetState();
}

class _PatternChangeSheetState extends ConsumerState<PatternChangeSheet> {
  ChangeStep _step = ChangeStep.verifyCurrent;
  String? _verifiedCurrentPattern;
  String? _newPattern;
  String _title = 'Verify Current Pattern';
  String _subtitle = 'Draw your current pattern to continue';
  bool _isError = false;

  void _handlePatternComplete(String pattern) async {
    final notifier = ref.read(patternLockProvider.notifier);

    if (_step == ChangeStep.verifyCurrent) {
      if (widget.mode == ChangeFlowMode.disablePattern) {
        final success = await notifier.disablePattern(pattern);
        if (success && mounted) {
          Navigator.of(context).pop(true);
        } else {
          _setError('Incorrect pattern. Try again.');
        }
      } else if (widget.mode == ChangeFlowMode.enablePattern) {
        final success = await notifier.enablePattern(pattern);
        if (success && mounted) {
          Navigator.of(context).pop(true);
        } else {
          _setError('Incorrect pattern. Try again.');
        }
      } else {
        // Change pattern mode
        final isValid = await ref.read(patternLockProvider.notifier).unlock(pattern);
        if (isValid) {
          setState(() {
            _verifiedCurrentPattern = pattern;
            _step = ChangeStep.drawNew;
            _title = 'Draw New Pattern';
            _subtitle = 'Connect at least ${AppConstants.minPatternLength} dots';
            _isError = false;
          });
        } else {
          _setError('Current pattern is incorrect.');
        }
      }
    } else if (_step == ChangeStep.drawNew) {
      if (pattern.length < AppConstants.minPatternLength) {
        _setError('Connect at least ${AppConstants.minPatternLength} dots');
        return;
      }
      setState(() {
        _newPattern = pattern;
        _step = ChangeStep.confirmNew;
        _title = 'Confirm New Pattern';
        _subtitle = 'Draw the new pattern again to confirm';
        _isError = false;
      });
    } else if (_step == ChangeStep.confirmNew) {
      if (pattern == _newPattern) {
        final success = await notifier.changePattern(
          currentPattern: _verifiedCurrentPattern!,
          newPattern: pattern,
        );
        if (success && mounted) {
          Navigator.of(context).pop(true);
        } else {
          _setError('Failed to update pattern. Please try again.');
        }
      } else {
        _setError('Patterns do not match. Try drawing the new pattern again.');
        setState(() {
          _step = ChangeStep.drawNew;
          _newPattern = null;
          _title = 'Draw New Pattern';
        });
      }
    }
  }

  void _setError(String message) {
    setState(() {
      _isError = true;
      _subtitle = message;
    });
    Future.delayed(const Duration(milliseconds: 1400), () {
      if (mounted) {
        setState(() {
          _isError = false;
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Padding(
      padding: EdgeInsets.only(
        top: 24,
        left: 24,
        right: 24,
        bottom: MediaQuery.of(context).viewInsets.bottom + 24,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: theme.colorScheme.onSurface.withOpacity(0.2),
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(height: 16),
          Text(_title, style: theme.textTheme.titleLarge),
          const SizedBox(height: 6),
          Text(
            _subtitle,
            style: theme.textTheme.bodyMedium?.copyWith(
              color: _isError ? theme.colorScheme.error : theme.colorScheme.onSurface.withOpacity(0.6),
            ),
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: 280,
            height: 280,
            child: PatternGridWidget(
              onPatternComplete: _handlePatternComplete,
              isError: _isError,
            ),
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}
