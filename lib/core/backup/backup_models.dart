/// Models representing the versioned backup envelope and validation results.
library;

class BackupEnvelope {
  final int version;
  final int timestampUtc;
  final String appId;
  final String appVersion;
  final String checksum;
  final String encryptedPayload;
  final Map<String, dynamic> metadata;

  const BackupEnvelope({
    required this.version,
    required this.timestampUtc,
    required this.appId,
    required this.appVersion,
    required this.checksum,
    required this.encryptedPayload,
    required this.metadata,
  });

  Map<String, dynamic> toJson() => {
        'version': version,
        'timestampUtc': timestampUtc,
        'appId': appId,
        'appVersion': appVersion,
        'checksum': checksum,
        'encryptedPayload': encryptedPayload,
        'metadata': metadata,
      };

  factory BackupEnvelope.fromJson(Map<String, dynamic> json) {
    return BackupEnvelope(
      version: json['version'] as int? ?? 1,
      timestampUtc: json['timestampUtc'] as int? ?? 0,
      appId: json['appId'] as String? ?? '',
      appVersion: json['appVersion'] as String? ?? '',
      checksum: json['checksum'] as String? ?? '',
      encryptedPayload: json['encryptedPayload'] as String? ?? '',
      metadata: (json['metadata'] as Map<String, dynamic>?) ?? {},
    );
  }
}

class BackupValidationResult {
  final bool isValid;
  final String? errorMessage;
  final int backupVersion;
  final int timestampUtc;
  final String appVersion;
  final Map<String, int> recordCounts;
  final Map<String, dynamic>? decodedData;

  const BackupValidationResult({
    required this.isValid,
    this.errorMessage,
    required this.backupVersion,
    required this.timestampUtc,
    required this.appVersion,
    required this.recordCounts,
    this.decodedData,
  });

  factory BackupValidationResult.failure(String error) {
    return BackupValidationResult(
      isValid: false,
      errorMessage: error,
      backupVersion: 0,
      timestampUtc: 0,
      appVersion: '',
      recordCounts: {},
      decodedData: null,
    );
  }
}
