import 'package:flutter/material.dart';
import 'package:app_settings/app_settings.dart';
import 'package:app_usage/app_usage.dart';

class UsagePermissionWrapper extends StatefulWidget {
  final Widget child;

  const UsagePermissionWrapper({super.key, required this.child});

  @override
  State<UsagePermissionWrapper> createState() => _UsagePermissionWrapperState();
}

class _UsagePermissionWrapperState extends State<UsagePermissionWrapper> {
  bool _hasPermission = false;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _checkPermission();
  }

  Future<void> _checkPermission() async {
    setState(() => _isLoading = true);
    try {
      // Just check if we can fetch something for today
      DateTime endDate = DateTime.now();
      DateTime startDate = endDate.subtract(const Duration(minutes: 1));
      await AppUsage().getAppUsage(startDate, endDate);
      setState(() {
        _hasPermission = true;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _hasPermission = false;
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    if (_hasPermission) {
      return widget.child;
    }

    return Scaffold(
      appBar: AppBar(title: const Text('Usage Tracker')),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.security, size: 64, color: Colors.blue),
              const SizedBox(height: 24),
              Text(
                'Usage Access Required',
                style: Theme.of(context).textTheme.headlineSmall,
              ),
              const SizedBox(height: 16),
              const Text(
                'To track your screen time, app usage, and enforce your limits, Personal Hub needs Android Usage Access.',
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 32),
              FilledButton(
                onPressed: () async {
                  await AppSettings.openAppSettings(type: AppSettingsType.security);
                },
                child: const Text('Open Settings'),
              ),
              TextButton(
                onPressed: _checkPermission,
                child: const Text('I have granted the permission'),
              )
            ],
          ),
        ),
      ),
    );
  }
}
