import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/usage_notification_manager.dart';

class FocusSessionState {
  final bool isActive;
  final int totalMinutes;
  final int remainingSeconds;
  final String? taskLabel;

  const FocusSessionState({
    this.isActive = false,
    this.totalMinutes = 25,
    this.remainingSeconds = 25 * 60,
    this.taskLabel,
  });

  FocusSessionState copyWith({
    bool? isActive,
    int? totalMinutes,
    int? remainingSeconds,
    String? taskLabel,
  }) {
    return FocusSessionState(
      isActive: isActive ?? this.isActive,
      totalMinutes: totalMinutes ?? this.totalMinutes,
      remainingSeconds: remainingSeconds ?? this.remainingSeconds,
      taskLabel: taskLabel ?? this.taskLabel,
    );
  }

  double get progress {
    if (totalMinutes <= 0) return 0.0;
    final totalSec = totalMinutes * 60;
    return (totalSec - remainingSeconds) / totalSec;
  }

  String get formattedRemaining {
    final mins = remainingSeconds ~/ 60;
    final secs = remainingSeconds % 60;
    return '${mins.toString().padLeft(2, '0')}:${secs.toString().padLeft(2, '0')}';
  }
}

class FocusSessionNotifier extends StateNotifier<FocusSessionState> {
  Timer? _timer;

  FocusSessionNotifier() : super(const FocusSessionState());

  void startSession({int minutes = 25, String? label}) {
    _timer?.cancel();
    state = FocusSessionState(
      isActive: true,
      totalMinutes: minutes,
      remainingSeconds: minutes * 60,
      taskLabel: label,
    );

    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (state.remainingSeconds <= 1) {
        timer.cancel();
        final finishedMinutes = state.totalMinutes;
        state = state.copyWith(isActive: false, remainingSeconds: 0);
        UsageNotificationManager.instance.notifyFocusCompleted(minutes: finishedMinutes);
      } else {
        state = state.copyWith(remainingSeconds: state.remainingSeconds - 1);
      }
    });
  }

  void pauseSession() {
    _timer?.cancel();
    state = state.copyWith(isActive: false);
  }

  void resumeSession() {
    if (state.remainingSeconds <= 0) return;
    state = state.copyWith(isActive: true);
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (state.remainingSeconds <= 1) {
        timer.cancel();
        final finishedMinutes = state.totalMinutes;
        state = state.copyWith(isActive: false, remainingSeconds: 0);
        UsageNotificationManager.instance.notifyFocusCompleted(minutes: finishedMinutes);
      } else {
        state = state.copyWith(remainingSeconds: state.remainingSeconds - 1);
      }
    });
  }

  void stopSession() {
    _timer?.cancel();
    state = FocusSessionState(
      isActive: false,
      totalMinutes: state.totalMinutes,
      remainingSeconds: state.totalMinutes * 60,
    );
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }
}

final focusSessionProvider = StateNotifierProvider<FocusSessionNotifier, FocusSessionState>((ref) {
  return FocusSessionNotifier();
});
