import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:path_provider/path_provider.dart';

class UpdateInfo {
  final bool hasUpdate;
  final String currentVersion;
  final int currentVersionCode;
  final String latestVersion;
  final int latestVersionCode;
  final String apkUrl;
  final String changelog;
  final String? releaseDate;

  const UpdateInfo({
    required this.hasUpdate,
    required this.currentVersion,
    required this.currentVersionCode,
    required this.latestVersion,
    required this.latestVersionCode,
    required this.apkUrl,
    required this.changelog,
    this.releaseDate,
  });
}

/// Service that checks for GitHub-pushed updates and triggers direct in-app OTA installation on mobile.
class AppUpdateService {
  static const MethodChannel _channel = MethodChannel('com.personal.app.personal_hub/updater');

  // GitHub repository constants
  static const String repoOwner = 'Dharaneesh-S-S';
  static const String repoName = 'Mobile';
  static const String versionManifestUrl =
      'https://raw.githubusercontent.com/$repoOwner/$repoName/main/version.json';
  static const String githubLatestReleaseApi =
      'https://api.github.com/repos/$repoOwner/$repoName/releases/latest';

  // Fallback version metadata if native package manager cannot be queried
  static const String defaultAppVersion = '1.0.0';
  static const int defaultAppVersionCode = 1;

  /// Retrieves the actual installed app version and version code from Android's PackageManager.
  Future<Map<String, dynamic>> getInstalledVersion() async {
    if (!kIsWeb && Platform.isAndroid) {
      try {
        final result = await _channel.invokeMethod<Map>('getAppVersion');
        if (result != null) {
          return {
            'versionName': result['versionName']?.toString() ?? defaultAppVersion,
            'versionCode': (result['versionCode'] as num?)?.toInt() ?? defaultAppVersionCode,
          };
        }
      } catch (e) {
        debugPrint('[AppUpdateService] Could not retrieve native package info: $e');
      }
    }
    return {
      'versionName': defaultAppVersion,
      'versionCode': defaultAppVersionCode,
    };
  }

  /// Checks whether a newer version has been pushed to GitHub.
  Future<UpdateInfo> checkForUpdate() async {
    final installed = await getInstalledVersion();
    final localVersion = installed['versionName'] as String;
    final localVersionCode = installed['versionCode'] as int;

    if (kIsWeb) {
      return UpdateInfo(
        hasUpdate: false,
        currentVersion: localVersion,
        currentVersionCode: localVersionCode,
        latestVersion: localVersion,
        latestVersionCode: localVersionCode,
        apkUrl: '',
        changelog: 'Web version updates automatically via browser refresh.',
      );
    }

    try {
      // 1. Try reading raw version.json manifest first (CDN-cached, no rate limits)
      final client = HttpClient();
      client.connectionTimeout = const Duration(seconds: 10);

      try {
        final request = await client.getUrl(Uri.parse(versionManifestUrl));
        final response = await request.close();

        if (response.statusCode == 200) {
          final content = await response.transform(utf8.decoder).join();
          final data = jsonDecode(content) as Map<String, dynamic>;

          final remoteCode = (data['versionCode'] as num?)?.toInt() ?? localVersionCode;
          final remoteVersion = (data['version'] as String?) ?? localVersion;
          final apkUrl = (data['apkUrl'] as String?) ??
              'https://github.com/$repoOwner/$repoName/releases/download/latest/personal_hub.apk';
          final changelog = (data['changelog'] as String?) ?? 'Performance optimizations and bug fixes.';
          final releaseDate = data['releaseDate'] as String?;

          final hasUpdate = remoteCode > localVersionCode;

          return UpdateInfo(
            hasUpdate: hasUpdate,
            currentVersion: localVersion,
            currentVersionCode: localVersionCode,
            latestVersion: remoteVersion,
            latestVersionCode: remoteCode,
            apkUrl: apkUrl,
            changelog: changelog,
            releaseDate: releaseDate,
          );
        }
      } catch (manifestError) {
        debugPrint('Direct manifest check failed, trying GitHub Releases API: $manifestError');
      }

      // 2. Fallback to GitHub API releases endpoint
      final apiRequest = await client.getUrl(Uri.parse(githubLatestReleaseApi));
      apiRequest.headers.set('User-Agent', 'PersonalHub-AppUpdateService');
      final apiResponse = await apiRequest.close();

      if (apiResponse.statusCode == 200) {
        final body = await apiResponse.transform(utf8.decoder).join();
        final releaseData = jsonDecode(body) as Map<String, dynamic>;

        final tagName = (releaseData['tag_name'] as String?) ?? 'v1.0.0';
        final bodyText = (releaseData['body'] as String?) ?? 'Latest release build';
        final publishedAt = releaseData['published_at'] as String?;

        // Find personal_hub.apk or app-release.apk asset
        String apkDownloadUrl = '';
        if (releaseData['assets'] is List) {
          for (final asset in releaseData['assets'] as List) {
            final name = (asset['name'] as String?) ?? '';
            if (name.endsWith('.apk')) {
              apkDownloadUrl = (asset['browser_download_url'] as String?) ?? '';
              break;
            }
          }
        }

        // Parse version code from tag if formatted like v1.0.1+2
        var parsedCode = localVersionCode;
        if (tagName.contains('+')) {
          final parts = tagName.split('+');
          parsedCode = int.tryParse(parts.last) ?? localVersionCode;
        }

        final hasUpdate = parsedCode > localVersionCode;

        return UpdateInfo(
          hasUpdate: hasUpdate,
          currentVersion: localVersion,
          currentVersionCode: localVersionCode,
          latestVersion: tagName.replaceAll('v', ''),
          latestVersionCode: parsedCode,
          apkUrl: apkDownloadUrl,
          changelog: bodyText,
          releaseDate: publishedAt,
        );
      }
    } catch (e) {
      debugPrint('Update check error: $e');
    }

    return UpdateInfo(
      hasUpdate: false,
      currentVersion: localVersion,
      currentVersionCode: localVersionCode,
      latestVersion: localVersion,
      latestVersionCode: localVersionCode,
      apkUrl: '',
      changelog: 'Up to date.',
    );
  }

  /// Downloads the APK directly on the mobile device and triggers the native Android installer.
  Future<bool> downloadAndInstallApk({
    required String downloadUrl,
    Function(double progress)? onProgress,
  }) async {
    if (kIsWeb || !Platform.isAndroid) {
      throw UnsupportedError('Direct APK installation is only supported on Android devices.');
    }

    if (downloadUrl.isEmpty) {
      throw ArgumentError('Download URL cannot be empty.');
    }

    final client = HttpClient();
    final request = await client.getUrl(Uri.parse(downloadUrl));
    final response = await request.close();

    if (response.statusCode != 200) {
      throw HttpException('Failed to download update APK (HTTP ${response.statusCode})');
    }

    final totalBytes = response.contentLength;
    var receivedBytes = 0;

    final tempDir = await getTemporaryDirectory();
    final targetFile = File('${tempDir.path}/personal_hub_update.apk');
    if (await targetFile.exists()) {
      await targetFile.delete();
    }

    final sink = targetFile.openWrite();

    await for (final chunk in response) {
      receivedBytes += chunk.length;
      sink.add(chunk);
      if (totalBytes > 0 && onProgress != null) {
        onProgress(receivedBytes / totalBytes);
      }
    }

    await sink.flush();
    await sink.close();

    // Launch Android native Package Installer via MethodChannel
    final bool success = await _channel.invokeMethod('installApk', {
      'filePath': targetFile.path,
    });

    return success;
  }
}

