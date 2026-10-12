// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'app_database.dart';

// ignore_for_file: type=lint
class $TagsTable extends Tags with TableInfo<$TagsTable, TagEntry> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $TagsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _nameMeta = const VerificationMeta('name');
  @override
  late final GeneratedColumn<String> name = GeneratedColumn<String>(
    'name',
    aliasedName,
    false,
    additionalChecks: GeneratedColumn.checkTextLength(
      minTextLength: 1,
      maxTextLength: 64,
    ),
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _colorValueMeta = const VerificationMeta(
    'colorValue',
  );
  @override
  late final GeneratedColumn<int> colorValue = GeneratedColumn<int>(
    'color_value',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: false,
    defaultValue: const Constant(0xFF4FD1C5),
  );
  static const VerificationMeta _createdAtUtcMeta = const VerificationMeta(
    'createdAtUtc',
  );
  @override
  late final GeneratedColumn<int> createdAtUtc = GeneratedColumn<int>(
    'created_at_utc',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: true,
  );
  @override
  List<GeneratedColumn> get $columns => [id, name, colorValue, createdAtUtc];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'tags';
  @override
  VerificationContext validateIntegrity(
    Insertable<TagEntry> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('name')) {
      context.handle(
        _nameMeta,
        name.isAcceptableOrUnknown(data['name']!, _nameMeta),
      );
    } else if (isInserting) {
      context.missing(_nameMeta);
    }
    if (data.containsKey('color_value')) {
      context.handle(
        _colorValueMeta,
        colorValue.isAcceptableOrUnknown(data['color_value']!, _colorValueMeta),
      );
    }
    if (data.containsKey('created_at_utc')) {
      context.handle(
        _createdAtUtcMeta,
        createdAtUtc.isAcceptableOrUnknown(
          data['created_at_utc']!,
          _createdAtUtcMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_createdAtUtcMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  TagEntry map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return TagEntry(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id'],
      )!,
      name: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}name'],
      )!,
      colorValue: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}color_value'],
      )!,
      createdAtUtc: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}created_at_utc'],
      )!,
    );
  }

  @override
  $TagsTable createAlias(String alias) {
    return $TagsTable(attachedDatabase, alias);
  }
}

class TagEntry extends DataClass implements Insertable<TagEntry> {
  final String id;
  final String name;
  final int colorValue;
  final int createdAtUtc;
  const TagEntry({
    required this.id,
    required this.name,
    required this.colorValue,
    required this.createdAtUtc,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['name'] = Variable<String>(name);
    map['color_value'] = Variable<int>(colorValue);
    map['created_at_utc'] = Variable<int>(createdAtUtc);
    return map;
  }

  TagsCompanion toCompanion(bool nullToAbsent) {
    return TagsCompanion(
      id: Value(id),
      name: Value(name),
      colorValue: Value(colorValue),
      createdAtUtc: Value(createdAtUtc),
    );
  }

  factory TagEntry.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return TagEntry(
      id: serializer.fromJson<String>(json['id']),
      name: serializer.fromJson<String>(json['name']),
      colorValue: serializer.fromJson<int>(json['colorValue']),
      createdAtUtc: serializer.fromJson<int>(json['createdAtUtc']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'name': serializer.toJson<String>(name),
      'colorValue': serializer.toJson<int>(colorValue),
      'createdAtUtc': serializer.toJson<int>(createdAtUtc),
    };
  }

  TagEntry copyWith({
    String? id,
    String? name,
    int? colorValue,
    int? createdAtUtc,
  }) => TagEntry(
    id: id ?? this.id,
    name: name ?? this.name,
    colorValue: colorValue ?? this.colorValue,
    createdAtUtc: createdAtUtc ?? this.createdAtUtc,
  );
  TagEntry copyWithCompanion(TagsCompanion data) {
    return TagEntry(
      id: data.id.present ? data.id.value : this.id,
      name: data.name.present ? data.name.value : this.name,
      colorValue: data.colorValue.present
          ? data.colorValue.value
          : this.colorValue,
      createdAtUtc: data.createdAtUtc.present
          ? data.createdAtUtc.value
          : this.createdAtUtc,
    );
  }

  @override
  String toString() {
    return (StringBuffer('TagEntry(')
          ..write('id: $id, ')
          ..write('name: $name, ')
          ..write('colorValue: $colorValue, ')
          ..write('createdAtUtc: $createdAtUtc')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(id, name, colorValue, createdAtUtc);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is TagEntry &&
          other.id == this.id &&
          other.name == this.name &&
          other.colorValue == this.colorValue &&
          other.createdAtUtc == this.createdAtUtc);
}

class TagsCompanion extends UpdateCompanion<TagEntry> {
  final Value<String> id;
  final Value<String> name;
  final Value<int> colorValue;
  final Value<int> createdAtUtc;
  final Value<int> rowid;
  const TagsCompanion({
    this.id = const Value.absent(),
    this.name = const Value.absent(),
    this.colorValue = const Value.absent(),
    this.createdAtUtc = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  TagsCompanion.insert({
    required String id,
    required String name,
    this.colorValue = const Value.absent(),
    required int createdAtUtc,
    this.rowid = const Value.absent(),
  }) : id = Value(id),
       name = Value(name),
       createdAtUtc = Value(createdAtUtc);
  static Insertable<TagEntry> custom({
    Expression<String>? id,
    Expression<String>? name,
    Expression<int>? colorValue,
    Expression<int>? createdAtUtc,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (name != null) 'name': name,
      if (colorValue != null) 'color_value': colorValue,
      if (createdAtUtc != null) 'created_at_utc': createdAtUtc,
      if (rowid != null) 'rowid': rowid,
    });
  }

  TagsCompanion copyWith({
    Value<String>? id,
    Value<String>? name,
    Value<int>? colorValue,
    Value<int>? createdAtUtc,
    Value<int>? rowid,
  }) {
    return TagsCompanion(
      id: id ?? this.id,
      name: name ?? this.name,
      colorValue: colorValue ?? this.colorValue,
      createdAtUtc: createdAtUtc ?? this.createdAtUtc,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (name.present) {
      map['name'] = Variable<String>(name.value);
    }
    if (colorValue.present) {
      map['color_value'] = Variable<int>(colorValue.value);
    }
    if (createdAtUtc.present) {
      map['created_at_utc'] = Variable<int>(createdAtUtc.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('TagsCompanion(')
          ..write('id: $id, ')
          ..write('name: $name, ')
          ..write('colorValue: $colorValue, ')
          ..write('createdAtUtc: $createdAtUtc, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $EntityCrossLinksTable extends EntityCrossLinks
    with TableInfo<$EntityCrossLinksTable, EntityCrossLink> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $EntityCrossLinksTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _sourceTypeMeta = const VerificationMeta(
    'sourceType',
  );
  @override
  late final GeneratedColumn<String> sourceType = GeneratedColumn<String>(
    'source_type',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _sourceIdMeta = const VerificationMeta(
    'sourceId',
  );
  @override
  late final GeneratedColumn<String> sourceId = GeneratedColumn<String>(
    'source_id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _targetTypeMeta = const VerificationMeta(
    'targetType',
  );
  @override
  late final GeneratedColumn<String> targetType = GeneratedColumn<String>(
    'target_type',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _targetIdMeta = const VerificationMeta(
    'targetId',
  );
  @override
  late final GeneratedColumn<String> targetId = GeneratedColumn<String>(
    'target_id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _relationTypeMeta = const VerificationMeta(
    'relationType',
  );
  @override
  late final GeneratedColumn<String> relationType = GeneratedColumn<String>(
    'relation_type',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
    defaultValue: const Constant('linked_to'),
  );
  static const VerificationMeta _createdAtUtcMeta = const VerificationMeta(
    'createdAtUtc',
  );
  @override
  late final GeneratedColumn<int> createdAtUtc = GeneratedColumn<int>(
    'created_at_utc',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: true,
  );
  @override
  List<GeneratedColumn> get $columns => [
    id,
    sourceType,
    sourceId,
    targetType,
    targetId,
    relationType,
    createdAtUtc,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'entity_cross_links';
  @override
  VerificationContext validateIntegrity(
    Insertable<EntityCrossLink> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('source_type')) {
      context.handle(
        _sourceTypeMeta,
        sourceType.isAcceptableOrUnknown(data['source_type']!, _sourceTypeMeta),
      );
    } else if (isInserting) {
      context.missing(_sourceTypeMeta);
    }
    if (data.containsKey('source_id')) {
      context.handle(
        _sourceIdMeta,
        sourceId.isAcceptableOrUnknown(data['source_id']!, _sourceIdMeta),
      );
    } else if (isInserting) {
      context.missing(_sourceIdMeta);
    }
    if (data.containsKey('target_type')) {
      context.handle(
        _targetTypeMeta,
        targetType.isAcceptableOrUnknown(data['target_type']!, _targetTypeMeta),
      );
    } else if (isInserting) {
      context.missing(_targetTypeMeta);
    }
    if (data.containsKey('target_id')) {
      context.handle(
        _targetIdMeta,
        targetId.isAcceptableOrUnknown(data['target_id']!, _targetIdMeta),
      );
    } else if (isInserting) {
      context.missing(_targetIdMeta);
    }
    if (data.containsKey('relation_type')) {
      context.handle(
        _relationTypeMeta,
        relationType.isAcceptableOrUnknown(
          data['relation_type']!,
          _relationTypeMeta,
        ),
      );
    }
    if (data.containsKey('created_at_utc')) {
      context.handle(
        _createdAtUtcMeta,
        createdAtUtc.isAcceptableOrUnknown(
          data['created_at_utc']!,
          _createdAtUtcMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_createdAtUtcMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  EntityCrossLink map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return EntityCrossLink(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id'],
      )!,
      sourceType: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}source_type'],
      )!,
      sourceId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}source_id'],
      )!,
      targetType: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}target_type'],
      )!,
      targetId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}target_id'],
      )!,
      relationType: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}relation_type'],
      )!,
      createdAtUtc: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}created_at_utc'],
      )!,
    );
  }

  @override
  $EntityCrossLinksTable createAlias(String alias) {
    return $EntityCrossLinksTable(attachedDatabase, alias);
  }
}

class EntityCrossLink extends DataClass implements Insertable<EntityCrossLink> {
  final String id;
  final String sourceType;
  final String sourceId;
  final String targetType;
  final String targetId;
  final String relationType;
  final int createdAtUtc;
  const EntityCrossLink({
    required this.id,
    required this.sourceType,
    required this.sourceId,
    required this.targetType,
    required this.targetId,
    required this.relationType,
    required this.createdAtUtc,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['source_type'] = Variable<String>(sourceType);
    map['source_id'] = Variable<String>(sourceId);
    map['target_type'] = Variable<String>(targetType);
    map['target_id'] = Variable<String>(targetId);
    map['relation_type'] = Variable<String>(relationType);
    map['created_at_utc'] = Variable<int>(createdAtUtc);
    return map;
  }

  EntityCrossLinksCompanion toCompanion(bool nullToAbsent) {
    return EntityCrossLinksCompanion(
      id: Value(id),
      sourceType: Value(sourceType),
      sourceId: Value(sourceId),
      targetType: Value(targetType),
      targetId: Value(targetId),
      relationType: Value(relationType),
      createdAtUtc: Value(createdAtUtc),
    );
  }

  factory EntityCrossLink.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return EntityCrossLink(
      id: serializer.fromJson<String>(json['id']),
      sourceType: serializer.fromJson<String>(json['sourceType']),
      sourceId: serializer.fromJson<String>(json['sourceId']),
      targetType: serializer.fromJson<String>(json['targetType']),
      targetId: serializer.fromJson<String>(json['targetId']),
      relationType: serializer.fromJson<String>(json['relationType']),
      createdAtUtc: serializer.fromJson<int>(json['createdAtUtc']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'sourceType': serializer.toJson<String>(sourceType),
      'sourceId': serializer.toJson<String>(sourceId),
      'targetType': serializer.toJson<String>(targetType),
      'targetId': serializer.toJson<String>(targetId),
      'relationType': serializer.toJson<String>(relationType),
      'createdAtUtc': serializer.toJson<int>(createdAtUtc),
    };
  }

  EntityCrossLink copyWith({
    String? id,
    String? sourceType,
    String? sourceId,
    String? targetType,
    String? targetId,
    String? relationType,
    int? createdAtUtc,
  }) => EntityCrossLink(
    id: id ?? this.id,
    sourceType: sourceType ?? this.sourceType,
    sourceId: sourceId ?? this.sourceId,
    targetType: targetType ?? this.targetType,
    targetId: targetId ?? this.targetId,
    relationType: relationType ?? this.relationType,
    createdAtUtc: createdAtUtc ?? this.createdAtUtc,
  );
  EntityCrossLink copyWithCompanion(EntityCrossLinksCompanion data) {
    return EntityCrossLink(
      id: data.id.present ? data.id.value : this.id,
      sourceType: data.sourceType.present
          ? data.sourceType.value
          : this.sourceType,
      sourceId: data.sourceId.present ? data.sourceId.value : this.sourceId,
      targetType: data.targetType.present
          ? data.targetType.value
          : this.targetType,
      targetId: data.targetId.present ? data.targetId.value : this.targetId,
      relationType: data.relationType.present
          ? data.relationType.value
          : this.relationType,
      createdAtUtc: data.createdAtUtc.present
          ? data.createdAtUtc.value
          : this.createdAtUtc,
    );
  }

  @override
  String toString() {
    return (StringBuffer('EntityCrossLink(')
          ..write('id: $id, ')
          ..write('sourceType: $sourceType, ')
          ..write('sourceId: $sourceId, ')
          ..write('targetType: $targetType, ')
          ..write('targetId: $targetId, ')
          ..write('relationType: $relationType, ')
          ..write('createdAtUtc: $createdAtUtc')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
    id,
    sourceType,
    sourceId,
    targetType,
    targetId,
    relationType,
    createdAtUtc,
  );
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is EntityCrossLink &&
          other.id == this.id &&
          other.sourceType == this.sourceType &&
          other.sourceId == this.sourceId &&
          other.targetType == this.targetType &&
          other.targetId == this.targetId &&
          other.relationType == this.relationType &&
          other.createdAtUtc == this.createdAtUtc);
}

class EntityCrossLinksCompanion extends UpdateCompanion<EntityCrossLink> {
  final Value<String> id;
  final Value<String> sourceType;
  final Value<String> sourceId;
  final Value<String> targetType;
  final Value<String> targetId;
  final Value<String> relationType;
  final Value<int> createdAtUtc;
  final Value<int> rowid;
  const EntityCrossLinksCompanion({
    this.id = const Value.absent(),
    this.sourceType = const Value.absent(),
    this.sourceId = const Value.absent(),
    this.targetType = const Value.absent(),
    this.targetId = const Value.absent(),
    this.relationType = const Value.absent(),
    this.createdAtUtc = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  EntityCrossLinksCompanion.insert({
    required String id,
    required String sourceType,
    required String sourceId,
    required String targetType,
    required String targetId,
    this.relationType = const Value.absent(),
    required int createdAtUtc,
    this.rowid = const Value.absent(),
  }) : id = Value(id),
       sourceType = Value(sourceType),
       sourceId = Value(sourceId),
       targetType = Value(targetType),
       targetId = Value(targetId),
       createdAtUtc = Value(createdAtUtc);
  static Insertable<EntityCrossLink> custom({
    Expression<String>? id,
    Expression<String>? sourceType,
    Expression<String>? sourceId,
    Expression<String>? targetType,
    Expression<String>? targetId,
    Expression<String>? relationType,
    Expression<int>? createdAtUtc,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (sourceType != null) 'source_type': sourceType,
      if (sourceId != null) 'source_id': sourceId,
      if (targetType != null) 'target_type': targetType,
      if (targetId != null) 'target_id': targetId,
      if (relationType != null) 'relation_type': relationType,
      if (createdAtUtc != null) 'created_at_utc': createdAtUtc,
      if (rowid != null) 'rowid': rowid,
    });
  }

  EntityCrossLinksCompanion copyWith({
    Value<String>? id,
    Value<String>? sourceType,
    Value<String>? sourceId,
    Value<String>? targetType,
    Value<String>? targetId,
    Value<String>? relationType,
    Value<int>? createdAtUtc,
    Value<int>? rowid,
  }) {
    return EntityCrossLinksCompanion(
      id: id ?? this.id,
      sourceType: sourceType ?? this.sourceType,
      sourceId: sourceId ?? this.sourceId,
      targetType: targetType ?? this.targetType,
      targetId: targetId ?? this.targetId,
      relationType: relationType ?? this.relationType,
      createdAtUtc: createdAtUtc ?? this.createdAtUtc,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (sourceType.present) {
      map['source_type'] = Variable<String>(sourceType.value);
    }
    if (sourceId.present) {
      map['source_id'] = Variable<String>(sourceId.value);
    }
    if (targetType.present) {
      map['target_type'] = Variable<String>(targetType.value);
    }
    if (targetId.present) {
      map['target_id'] = Variable<String>(targetId.value);
    }
    if (relationType.present) {
      map['relation_type'] = Variable<String>(relationType.value);
    }
    if (createdAtUtc.present) {
      map['created_at_utc'] = Variable<int>(createdAtUtc.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('EntityCrossLinksCompanion(')
          ..write('id: $id, ')
          ..write('sourceType: $sourceType, ')
          ..write('sourceId: $sourceId, ')
          ..write('targetType: $targetType, ')
          ..write('targetId: $targetId, ')
          ..write('relationType: $relationType, ')
          ..write('createdAtUtc: $createdAtUtc, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $CalendarEventsTable extends CalendarEvents
    with TableInfo<$CalendarEventsTable, CalendarEventEntry> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $CalendarEventsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _titleMeta = const VerificationMeta('title');
  @override
  late final GeneratedColumn<String> title = GeneratedColumn<String>(
    'title',
    aliasedName,
    false,
    additionalChecks: GeneratedColumn.checkTextLength(
      minTextLength: 1,
      maxTextLength: 256,
    ),
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _descriptionMeta = const VerificationMeta(
    'description',
  );
  @override
  late final GeneratedColumn<String> description = GeneratedColumn<String>(
    'description',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _startTimeUtcMeta = const VerificationMeta(
    'startTimeUtc',
  );
  @override
  late final GeneratedColumn<int> startTimeUtc = GeneratedColumn<int>(
    'start_time_utc',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _endTimeUtcMeta = const VerificationMeta(
    'endTimeUtc',
  );
  @override
  late final GeneratedColumn<int> endTimeUtc = GeneratedColumn<int>(
    'end_time_utc',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _isAllDayMeta = const VerificationMeta(
    'isAllDay',
  );
  @override
  late final GeneratedColumn<bool> isAllDay = GeneratedColumn<bool>(
    'is_all_day',
    aliasedName,
    false,
    type: DriftSqlType.bool,
    requiredDuringInsert: false,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'CHECK ("is_all_day" IN (0, 1))',
    ),
    defaultValue: const Constant(false),
  );
  static const VerificationMeta _recurrenceRuleMeta = const VerificationMeta(
    'recurrenceRule',
  );
  @override
  late final GeneratedColumn<String> recurrenceRule = GeneratedColumn<String>(
    'recurrence_rule',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _locationMeta = const VerificationMeta(
    'location',
  );
  @override
  late final GeneratedColumn<String> location = GeneratedColumn<String>(
    'location',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _colorValueMeta = const VerificationMeta(
    'colorValue',
  );
  @override
  late final GeneratedColumn<int> colorValue = GeneratedColumn<int>(
    'color_value',
    aliasedName,
    true,
    type: DriftSqlType.int,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _isCancelledMeta = const VerificationMeta(
    'isCancelled',
  );
  @override
  late final GeneratedColumn<bool> isCancelled = GeneratedColumn<bool>(
    'is_cancelled',
    aliasedName,
    false,
    type: DriftSqlType.bool,
    requiredDuringInsert: false,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'CHECK ("is_cancelled" IN (0, 1))',
    ),
    defaultValue: const Constant(false),
  );
  static const VerificationMeta _eventTypeMeta = const VerificationMeta(
    'eventType',
  );
  @override
  late final GeneratedColumn<String> eventType = GeneratedColumn<String>(
    'event_type',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
    defaultValue: const Constant('event'),
  );
  static const VerificationMeta _reminderOffsetsMeta = const VerificationMeta(
    'reminderOffsets',
  );
  @override
  late final GeneratedColumn<String> reminderOffsets = GeneratedColumn<String>(
    'reminder_offsets',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _createdAtUtcMeta = const VerificationMeta(
    'createdAtUtc',
  );
  @override
  late final GeneratedColumn<int> createdAtUtc = GeneratedColumn<int>(
    'created_at_utc',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _updatedAtUtcMeta = const VerificationMeta(
    'updatedAtUtc',
  );
  @override
  late final GeneratedColumn<int> updatedAtUtc = GeneratedColumn<int>(
    'updated_at_utc',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: true,
  );
  @override
  List<GeneratedColumn> get $columns => [
    id,
    title,
    description,
    startTimeUtc,
    endTimeUtc,
    isAllDay,
    recurrenceRule,
    location,
    colorValue,
    isCancelled,
    eventType,
    reminderOffsets,
    createdAtUtc,
    updatedAtUtc,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'calendar_events';
  @override
  VerificationContext validateIntegrity(
    Insertable<CalendarEventEntry> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('title')) {
      context.handle(
        _titleMeta,
        title.isAcceptableOrUnknown(data['title']!, _titleMeta),
      );
    } else if (isInserting) {
      context.missing(_titleMeta);
    }
    if (data.containsKey('description')) {
      context.handle(
        _descriptionMeta,
        description.isAcceptableOrUnknown(
          data['description']!,
          _descriptionMeta,
        ),
      );
    }
    if (data.containsKey('start_time_utc')) {
      context.handle(
        _startTimeUtcMeta,
        startTimeUtc.isAcceptableOrUnknown(
          data['start_time_utc']!,
          _startTimeUtcMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_startTimeUtcMeta);
    }
    if (data.containsKey('end_time_utc')) {
      context.handle(
        _endTimeUtcMeta,
        endTimeUtc.isAcceptableOrUnknown(
          data['end_time_utc']!,
          _endTimeUtcMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_endTimeUtcMeta);
    }
    if (data.containsKey('is_all_day')) {
      context.handle(
        _isAllDayMeta,
        isAllDay.isAcceptableOrUnknown(data['is_all_day']!, _isAllDayMeta),
      );
    }
    if (data.containsKey('recurrence_rule')) {
      context.handle(
        _recurrenceRuleMeta,
        recurrenceRule.isAcceptableOrUnknown(
          data['recurrence_rule']!,
          _recurrenceRuleMeta,
        ),
      );
    }
    if (data.containsKey('location')) {
      context.handle(
        _locationMeta,
        location.isAcceptableOrUnknown(data['location']!, _locationMeta),
      );
    }
    if (data.containsKey('color_value')) {
      context.handle(
        _colorValueMeta,
        colorValue.isAcceptableOrUnknown(data['color_value']!, _colorValueMeta),
      );
    }
    if (data.containsKey('is_cancelled')) {
      context.handle(
        _isCancelledMeta,
        isCancelled.isAcceptableOrUnknown(
          data['is_cancelled']!,
          _isCancelledMeta,
        ),
      );
    }
    if (data.containsKey('event_type')) {
      context.handle(
        _eventTypeMeta,
        eventType.isAcceptableOrUnknown(data['event_type']!, _eventTypeMeta),
      );
    }
    if (data.containsKey('reminder_offsets')) {
      context.handle(
        _reminderOffsetsMeta,
        reminderOffsets.isAcceptableOrUnknown(
          data['reminder_offsets']!,
          _reminderOffsetsMeta,
        ),
      );
    }
    if (data.containsKey('created_at_utc')) {
      context.handle(
        _createdAtUtcMeta,
        createdAtUtc.isAcceptableOrUnknown(
          data['created_at_utc']!,
          _createdAtUtcMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_createdAtUtcMeta);
    }
    if (data.containsKey('updated_at_utc')) {
      context.handle(
        _updatedAtUtcMeta,
        updatedAtUtc.isAcceptableOrUnknown(
          data['updated_at_utc']!,
          _updatedAtUtcMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_updatedAtUtcMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  CalendarEventEntry map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return CalendarEventEntry(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id'],
      )!,
      title: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}title'],
      )!,
      description: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}description'],
      ),
      startTimeUtc: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}start_time_utc'],
      )!,
      endTimeUtc: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}end_time_utc'],
      )!,
      isAllDay: attachedDatabase.typeMapping.read(
        DriftSqlType.bool,
        data['${effectivePrefix}is_all_day'],
      )!,
      recurrenceRule: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}recurrence_rule'],
      ),
      location: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}location'],
      ),
      colorValue: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}color_value'],
      ),
      isCancelled: attachedDatabase.typeMapping.read(
        DriftSqlType.bool,
        data['${effectivePrefix}is_cancelled'],
      )!,
      eventType: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}event_type'],
      )!,
      reminderOffsets: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}reminder_offsets'],
      ),
      createdAtUtc: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}created_at_utc'],
      )!,
      updatedAtUtc: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}updated_at_utc'],
      )!,
    );
  }

  @override
  $CalendarEventsTable createAlias(String alias) {
    return $CalendarEventsTable(attachedDatabase, alias);
  }
}

class CalendarEventEntry extends DataClass
    implements Insertable<CalendarEventEntry> {
  final String id;
  final String title;
  final String? description;
  final int startTimeUtc;
  final int endTimeUtc;
  final bool isAllDay;
  final String? recurrenceRule;
  final String? location;
  final int? colorValue;
  final bool isCancelled;
  final String eventType;
  final String? reminderOffsets;
  final int createdAtUtc;
  final int updatedAtUtc;
  const CalendarEventEntry({
    required this.id,
    required this.title,
    this.description,
    required this.startTimeUtc,
    required this.endTimeUtc,
    required this.isAllDay,
    this.recurrenceRule,
    this.location,
    this.colorValue,
    required this.isCancelled,
    required this.eventType,
    this.reminderOffsets,
    required this.createdAtUtc,
    required this.updatedAtUtc,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['title'] = Variable<String>(title);
    if (!nullToAbsent || description != null) {
      map['description'] = Variable<String>(description);
    }
    map['start_time_utc'] = Variable<int>(startTimeUtc);
    map['end_time_utc'] = Variable<int>(endTimeUtc);
    map['is_all_day'] = Variable<bool>(isAllDay);
    if (!nullToAbsent || recurrenceRule != null) {
      map['recurrence_rule'] = Variable<String>(recurrenceRule);
    }
    if (!nullToAbsent || location != null) {
      map['location'] = Variable<String>(location);
    }
    if (!nullToAbsent || colorValue != null) {
      map['color_value'] = Variable<int>(colorValue);
    }
    map['is_cancelled'] = Variable<bool>(isCancelled);
    map['event_type'] = Variable<String>(eventType);
    if (!nullToAbsent || reminderOffsets != null) {
      map['reminder_offsets'] = Variable<String>(reminderOffsets);
    }
    map['created_at_utc'] = Variable<int>(createdAtUtc);
    map['updated_at_utc'] = Variable<int>(updatedAtUtc);
    return map;
  }

  CalendarEventsCompanion toCompanion(bool nullToAbsent) {
    return CalendarEventsCompanion(
      id: Value(id),
      title: Value(title),
      description: description == null && nullToAbsent
          ? const Value.absent()
          : Value(description),
      startTimeUtc: Value(startTimeUtc),
      endTimeUtc: Value(endTimeUtc),
      isAllDay: Value(isAllDay),
      recurrenceRule: recurrenceRule == null && nullToAbsent
          ? const Value.absent()
          : Value(recurrenceRule),
      location: location == null && nullToAbsent
          ? const Value.absent()
          : Value(location),
      colorValue: colorValue == null && nullToAbsent
          ? const Value.absent()
          : Value(colorValue),
      isCancelled: Value(isCancelled),
      eventType: Value(eventType),
      reminderOffsets: reminderOffsets == null && nullToAbsent
          ? const Value.absent()
          : Value(reminderOffsets),
      createdAtUtc: Value(createdAtUtc),
      updatedAtUtc: Value(updatedAtUtc),
    );
  }

  factory CalendarEventEntry.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return CalendarEventEntry(
      id: serializer.fromJson<String>(json['id']),
      title: serializer.fromJson<String>(json['title']),
      description: serializer.fromJson<String?>(json['description']),
      startTimeUtc: serializer.fromJson<int>(json['startTimeUtc']),
      endTimeUtc: serializer.fromJson<int>(json['endTimeUtc']),
      isAllDay: serializer.fromJson<bool>(json['isAllDay']),
      recurrenceRule: serializer.fromJson<String?>(json['recurrenceRule']),
      location: serializer.fromJson<String?>(json['location']),
      colorValue: serializer.fromJson<int?>(json['colorValue']),
      isCancelled: serializer.fromJson<bool>(json['isCancelled']),
      eventType: serializer.fromJson<String>(json['eventType']),
      reminderOffsets: serializer.fromJson<String?>(json['reminderOffsets']),
      createdAtUtc: serializer.fromJson<int>(json['createdAtUtc']),
      updatedAtUtc: serializer.fromJson<int>(json['updatedAtUtc']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'title': serializer.toJson<String>(title),
      'description': serializer.toJson<String?>(description),
      'startTimeUtc': serializer.toJson<int>(startTimeUtc),
      'endTimeUtc': serializer.toJson<int>(endTimeUtc),
      'isAllDay': serializer.toJson<bool>(isAllDay),
      'recurrenceRule': serializer.toJson<String?>(recurrenceRule),
      'location': serializer.toJson<String?>(location),
      'colorValue': serializer.toJson<int?>(colorValue),
      'isCancelled': serializer.toJson<bool>(isCancelled),
      'eventType': serializer.toJson<String>(eventType),
      'reminderOffsets': serializer.toJson<String?>(reminderOffsets),
      'createdAtUtc': serializer.toJson<int>(createdAtUtc),
      'updatedAtUtc': serializer.toJson<int>(updatedAtUtc),
    };
  }

  CalendarEventEntry copyWith({
    String? id,
    String? title,
    Value<String?> description = const Value.absent(),
    int? startTimeUtc,
    int? endTimeUtc,
    bool? isAllDay,
    Value<String?> recurrenceRule = const Value.absent(),
    Value<String?> location = const Value.absent(),
    Value<int?> colorValue = const Value.absent(),
    bool? isCancelled,
    String? eventType,
    Value<String?> reminderOffsets = const Value.absent(),
    int? createdAtUtc,
    int? updatedAtUtc,
  }) => CalendarEventEntry(
    id: id ?? this.id,
    title: title ?? this.title,
    description: description.present ? description.value : this.description,
    startTimeUtc: startTimeUtc ?? this.startTimeUtc,
    endTimeUtc: endTimeUtc ?? this.endTimeUtc,
    isAllDay: isAllDay ?? this.isAllDay,
    recurrenceRule: recurrenceRule.present
        ? recurrenceRule.value
        : this.recurrenceRule,
    location: location.present ? location.value : this.location,
    colorValue: colorValue.present ? colorValue.value : this.colorValue,
    isCancelled: isCancelled ?? this.isCancelled,
    eventType: eventType ?? this.eventType,
    reminderOffsets: reminderOffsets.present
        ? reminderOffsets.value
        : this.reminderOffsets,
    createdAtUtc: createdAtUtc ?? this.createdAtUtc,
    updatedAtUtc: updatedAtUtc ?? this.updatedAtUtc,
  );
  CalendarEventEntry copyWithCompanion(CalendarEventsCompanion data) {
    return CalendarEventEntry(
      id: data.id.present ? data.id.value : this.id,
      title: data.title.present ? data.title.value : this.title,
      description: data.description.present
          ? data.description.value
          : this.description,
      startTimeUtc: data.startTimeUtc.present
          ? data.startTimeUtc.value
          : this.startTimeUtc,
      endTimeUtc: data.endTimeUtc.present
          ? data.endTimeUtc.value
          : this.endTimeUtc,
      isAllDay: data.isAllDay.present ? data.isAllDay.value : this.isAllDay,
      recurrenceRule: data.recurrenceRule.present
          ? data.recurrenceRule.value
          : this.recurrenceRule,
      location: data.location.present ? data.location.value : this.location,
      colorValue: data.colorValue.present
          ? data.colorValue.value
          : this.colorValue,
      isCancelled: data.isCancelled.present
          ? data.isCancelled.value
          : this.isCancelled,
      eventType: data.eventType.present ? data.eventType.value : this.eventType,
      reminderOffsets: data.reminderOffsets.present
          ? data.reminderOffsets.value
          : this.reminderOffsets,
      createdAtUtc: data.createdAtUtc.present
          ? data.createdAtUtc.value
          : this.createdAtUtc,
      updatedAtUtc: data.updatedAtUtc.present
          ? data.updatedAtUtc.value
          : this.updatedAtUtc,
    );
  }

  @override
  String toString() {
    return (StringBuffer('CalendarEventEntry(')
          ..write('id: $id, ')
          ..write('title: $title, ')
          ..write('description: $description, ')
          ..write('startTimeUtc: $startTimeUtc, ')
          ..write('endTimeUtc: $endTimeUtc, ')
          ..write('isAllDay: $isAllDay, ')
          ..write('recurrenceRule: $recurrenceRule, ')
          ..write('location: $location, ')
          ..write('colorValue: $colorValue, ')
          ..write('isCancelled: $isCancelled, ')
          ..write('eventType: $eventType, ')
          ..write('reminderOffsets: $reminderOffsets, ')
          ..write('createdAtUtc: $createdAtUtc, ')
          ..write('updatedAtUtc: $updatedAtUtc')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
    id,
    title,
    description,
    startTimeUtc,
    endTimeUtc,
    isAllDay,
    recurrenceRule,
    location,
    colorValue,
    isCancelled,
    eventType,
    reminderOffsets,
    createdAtUtc,
    updatedAtUtc,
  );
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is CalendarEventEntry &&
          other.id == this.id &&
          other.title == this.title &&
          other.description == this.description &&
          other.startTimeUtc == this.startTimeUtc &&
          other.endTimeUtc == this.endTimeUtc &&
          other.isAllDay == this.isAllDay &&
          other.recurrenceRule == this.recurrenceRule &&
          other.location == this.location &&
          other.colorValue == this.colorValue &&
          other.isCancelled == this.isCancelled &&
          other.eventType == this.eventType &&
          other.reminderOffsets == this.reminderOffsets &&
          other.createdAtUtc == this.createdAtUtc &&
          other.updatedAtUtc == this.updatedAtUtc);
}

class CalendarEventsCompanion extends UpdateCompanion<CalendarEventEntry> {
  final Value<String> id;
  final Value<String> title;
  final Value<String?> description;
  final Value<int> startTimeUtc;
  final Value<int> endTimeUtc;
  final Value<bool> isAllDay;
  final Value<String?> recurrenceRule;
  final Value<String?> location;
  final Value<int?> colorValue;
  final Value<bool> isCancelled;
  final Value<String> eventType;
  final Value<String?> reminderOffsets;
  final Value<int> createdAtUtc;
  final Value<int> updatedAtUtc;
  final Value<int> rowid;
  const CalendarEventsCompanion({
    this.id = const Value.absent(),
    this.title = const Value.absent(),
    this.description = const Value.absent(),
    this.startTimeUtc = const Value.absent(),
    this.endTimeUtc = const Value.absent(),
    this.isAllDay = const Value.absent(),
    this.recurrenceRule = const Value.absent(),
    this.location = const Value.absent(),
    this.colorValue = const Value.absent(),
    this.isCancelled = const Value.absent(),
    this.eventType = const Value.absent(),
    this.reminderOffsets = const Value.absent(),
    this.createdAtUtc = const Value.absent(),
    this.updatedAtUtc = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  CalendarEventsCompanion.insert({
    required String id,
    required String title,
    this.description = const Value.absent(),
    required int startTimeUtc,
    required int endTimeUtc,
    this.isAllDay = const Value.absent(),
    this.recurrenceRule = const Value.absent(),
    this.location = const Value.absent(),
    this.colorValue = const Value.absent(),
    this.isCancelled = const Value.absent(),
    this.eventType = const Value.absent(),
    this.reminderOffsets = const Value.absent(),
    required int createdAtUtc,
    required int updatedAtUtc,
    this.rowid = const Value.absent(),
  }) : id = Value(id),
       title = Value(title),
       startTimeUtc = Value(startTimeUtc),
       endTimeUtc = Value(endTimeUtc),
       createdAtUtc = Value(createdAtUtc),
       updatedAtUtc = Value(updatedAtUtc);
  static Insertable<CalendarEventEntry> custom({
    Expression<String>? id,
    Expression<String>? title,
    Expression<String>? description,
    Expression<int>? startTimeUtc,
    Expression<int>? endTimeUtc,
    Expression<bool>? isAllDay,
    Expression<String>? recurrenceRule,
    Expression<String>? location,
    Expression<int>? colorValue,
    Expression<bool>? isCancelled,
    Expression<String>? eventType,
    Expression<String>? reminderOffsets,
    Expression<int>? createdAtUtc,
    Expression<int>? updatedAtUtc,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (title != null) 'title': title,
      if (description != null) 'description': description,
      if (startTimeUtc != null) 'start_time_utc': startTimeUtc,
      if (endTimeUtc != null) 'end_time_utc': endTimeUtc,
      if (isAllDay != null) 'is_all_day': isAllDay,
      if (recurrenceRule != null) 'recurrence_rule': recurrenceRule,
      if (location != null) 'location': location,
      if (colorValue != null) 'color_value': colorValue,
      if (isCancelled != null) 'is_cancelled': isCancelled,
      if (eventType != null) 'event_type': eventType,
      if (reminderOffsets != null) 'reminder_offsets': reminderOffsets,
      if (createdAtUtc != null) 'created_at_utc': createdAtUtc,
      if (updatedAtUtc != null) 'updated_at_utc': updatedAtUtc,
      if (rowid != null) 'rowid': rowid,
    });
  }

  CalendarEventsCompanion copyWith({
    Value<String>? id,
    Value<String>? title,
    Value<String?>? description,
    Value<int>? startTimeUtc,
    Value<int>? endTimeUtc,
    Value<bool>? isAllDay,
    Value<String?>? recurrenceRule,
    Value<String?>? location,
    Value<int?>? colorValue,
    Value<bool>? isCancelled,
    Value<String>? eventType,
    Value<String?>? reminderOffsets,
    Value<int>? createdAtUtc,
    Value<int>? updatedAtUtc,
    Value<int>? rowid,
  }) {
    return CalendarEventsCompanion(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      startTimeUtc: startTimeUtc ?? this.startTimeUtc,
      endTimeUtc: endTimeUtc ?? this.endTimeUtc,
      isAllDay: isAllDay ?? this.isAllDay,
      recurrenceRule: recurrenceRule ?? this.recurrenceRule,
      location: location ?? this.location,
      colorValue: colorValue ?? this.colorValue,
      isCancelled: isCancelled ?? this.isCancelled,
      eventType: eventType ?? this.eventType,
      reminderOffsets: reminderOffsets ?? this.reminderOffsets,
      createdAtUtc: createdAtUtc ?? this.createdAtUtc,
      updatedAtUtc: updatedAtUtc ?? this.updatedAtUtc,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (title.present) {
      map['title'] = Variable<String>(title.value);
    }
    if (description.present) {
      map['description'] = Variable<String>(description.value);
    }
    if (startTimeUtc.present) {
      map['start_time_utc'] = Variable<int>(startTimeUtc.value);
    }
    if (endTimeUtc.present) {
      map['end_time_utc'] = Variable<int>(endTimeUtc.value);
    }
    if (isAllDay.present) {
      map['is_all_day'] = Variable<bool>(isAllDay.value);
    }
    if (recurrenceRule.present) {
      map['recurrence_rule'] = Variable<String>(recurrenceRule.value);
    }
    if (location.present) {
      map['location'] = Variable<String>(location.value);
    }
    if (colorValue.present) {
      map['color_value'] = Variable<int>(colorValue.value);
    }
    if (isCancelled.present) {
      map['is_cancelled'] = Variable<bool>(isCancelled.value);
    }
    if (eventType.present) {
      map['event_type'] = Variable<String>(eventType.value);
    }
    if (reminderOffsets.present) {
      map['reminder_offsets'] = Variable<String>(reminderOffsets.value);
    }
    if (createdAtUtc.present) {
      map['created_at_utc'] = Variable<int>(createdAtUtc.value);
    }
    if (updatedAtUtc.present) {
      map['updated_at_utc'] = Variable<int>(updatedAtUtc.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('CalendarEventsCompanion(')
          ..write('id: $id, ')
          ..write('title: $title, ')
          ..write('description: $description, ')
          ..write('startTimeUtc: $startTimeUtc, ')
          ..write('endTimeUtc: $endTimeUtc, ')
          ..write('isAllDay: $isAllDay, ')
          ..write('recurrenceRule: $recurrenceRule, ')
          ..write('location: $location, ')
          ..write('colorValue: $colorValue, ')
          ..write('isCancelled: $isCancelled, ')
          ..write('eventType: $eventType, ')
          ..write('reminderOffsets: $reminderOffsets, ')
          ..write('createdAtUtc: $createdAtUtc, ')
          ..write('updatedAtUtc: $updatedAtUtc, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $MoneyAccountsTable extends MoneyAccounts
    with TableInfo<$MoneyAccountsTable, MoneyAccountEntry> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $MoneyAccountsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _nameMeta = const VerificationMeta('name');
  @override
  late final GeneratedColumn<String> name = GeneratedColumn<String>(
    'name',
    aliasedName,
    false,
    additionalChecks: GeneratedColumn.checkTextLength(
      minTextLength: 1,
      maxTextLength: 128,
    ),
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _accountTypeMeta = const VerificationMeta(
    'accountType',
  );
  @override
  late final GeneratedColumn<String> accountType = GeneratedColumn<String>(
    'account_type',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _balancePaiseMeta = const VerificationMeta(
    'balancePaise',
  );
  @override
  late final GeneratedColumn<int> balancePaise = GeneratedColumn<int>(
    'balance_paise',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: false,
    defaultValue: const Constant(0),
  );
  static const VerificationMeta _currencyCodeMeta = const VerificationMeta(
    'currencyCode',
  );
  @override
  late final GeneratedColumn<String> currencyCode = GeneratedColumn<String>(
    'currency_code',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
    defaultValue: const Constant('INR'),
  );
  static const VerificationMeta _isActiveMeta = const VerificationMeta(
    'isActive',
  );
  @override
  late final GeneratedColumn<bool> isActive = GeneratedColumn<bool>(
    'is_active',
    aliasedName,
    false,
    type: DriftSqlType.bool,
    requiredDuringInsert: false,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'CHECK ("is_active" IN (0, 1))',
    ),
    defaultValue: const Constant(true),
  );
  static const VerificationMeta _createdAtUtcMeta = const VerificationMeta(
    'createdAtUtc',
  );
  @override
  late final GeneratedColumn<int> createdAtUtc = GeneratedColumn<int>(
    'created_at_utc',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: true,
  );
  @override
  List<GeneratedColumn> get $columns => [
    id,
    name,
    accountType,
    balancePaise,
    currencyCode,
    isActive,
    createdAtUtc,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'money_accounts';
  @override
  VerificationContext validateIntegrity(
    Insertable<MoneyAccountEntry> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('name')) {
      context.handle(
        _nameMeta,
        name.isAcceptableOrUnknown(data['name']!, _nameMeta),
      );
    } else if (isInserting) {
      context.missing(_nameMeta);
    }
    if (data.containsKey('account_type')) {
      context.handle(
        _accountTypeMeta,
        accountType.isAcceptableOrUnknown(
          data['account_type']!,
          _accountTypeMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_accountTypeMeta);
    }
    if (data.containsKey('balance_paise')) {
      context.handle(
        _balancePaiseMeta,
        balancePaise.isAcceptableOrUnknown(
          data['balance_paise']!,
          _balancePaiseMeta,
        ),
      );
    }
    if (data.containsKey('currency_code')) {
      context.handle(
        _currencyCodeMeta,
        currencyCode.isAcceptableOrUnknown(
          data['currency_code']!,
          _currencyCodeMeta,
        ),
      );
    }
    if (data.containsKey('is_active')) {
      context.handle(
        _isActiveMeta,
        isActive.isAcceptableOrUnknown(data['is_active']!, _isActiveMeta),
      );
    }
    if (data.containsKey('created_at_utc')) {
      context.handle(
        _createdAtUtcMeta,
        createdAtUtc.isAcceptableOrUnknown(
          data['created_at_utc']!,
          _createdAtUtcMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_createdAtUtcMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  MoneyAccountEntry map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return MoneyAccountEntry(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id'],
      )!,
      name: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}name'],
      )!,
      accountType: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}account_type'],
      )!,
      balancePaise: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}balance_paise'],
      )!,
      currencyCode: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}currency_code'],
      )!,
      isActive: attachedDatabase.typeMapping.read(
        DriftSqlType.bool,
        data['${effectivePrefix}is_active'],
      )!,
      createdAtUtc: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}created_at_utc'],
      )!,
    );
  }

  @override
  $MoneyAccountsTable createAlias(String alias) {
    return $MoneyAccountsTable(attachedDatabase, alias);
  }
}

class MoneyAccountEntry extends DataClass
    implements Insertable<MoneyAccountEntry> {
  final String id;
  final String name;
  final String accountType;
  final int balancePaise;
  final String currencyCode;
  final bool isActive;
  final int createdAtUtc;
  const MoneyAccountEntry({
    required this.id,
    required this.name,
    required this.accountType,
    required this.balancePaise,
    required this.currencyCode,
    required this.isActive,
    required this.createdAtUtc,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['name'] = Variable<String>(name);
    map['account_type'] = Variable<String>(accountType);
    map['balance_paise'] = Variable<int>(balancePaise);
    map['currency_code'] = Variable<String>(currencyCode);
    map['is_active'] = Variable<bool>(isActive);
    map['created_at_utc'] = Variable<int>(createdAtUtc);
    return map;
  }

  MoneyAccountsCompanion toCompanion(bool nullToAbsent) {
    return MoneyAccountsCompanion(
      id: Value(id),
      name: Value(name),
      accountType: Value(accountType),
      balancePaise: Value(balancePaise),
      currencyCode: Value(currencyCode),
      isActive: Value(isActive),
      createdAtUtc: Value(createdAtUtc),
    );
  }

  factory MoneyAccountEntry.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return MoneyAccountEntry(
      id: serializer.fromJson<String>(json['id']),
      name: serializer.fromJson<String>(json['name']),
      accountType: serializer.fromJson<String>(json['accountType']),
      balancePaise: serializer.fromJson<int>(json['balancePaise']),
      currencyCode: serializer.fromJson<String>(json['currencyCode']),
      isActive: serializer.fromJson<bool>(json['isActive']),
      createdAtUtc: serializer.fromJson<int>(json['createdAtUtc']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'name': serializer.toJson<String>(name),
      'accountType': serializer.toJson<String>(accountType),
      'balancePaise': serializer.toJson<int>(balancePaise),
      'currencyCode': serializer.toJson<String>(currencyCode),
      'isActive': serializer.toJson<bool>(isActive),
      'createdAtUtc': serializer.toJson<int>(createdAtUtc),
    };
  }

  MoneyAccountEntry copyWith({
    String? id,
    String? name,
    String? accountType,
    int? balancePaise,
    String? currencyCode,
    bool? isActive,
    int? createdAtUtc,
  }) => MoneyAccountEntry(
    id: id ?? this.id,
    name: name ?? this.name,
    accountType: accountType ?? this.accountType,
    balancePaise: balancePaise ?? this.balancePaise,
    currencyCode: currencyCode ?? this.currencyCode,
    isActive: isActive ?? this.isActive,
    createdAtUtc: createdAtUtc ?? this.createdAtUtc,
  );
  MoneyAccountEntry copyWithCompanion(MoneyAccountsCompanion data) {
    return MoneyAccountEntry(
      id: data.id.present ? data.id.value : this.id,
      name: data.name.present ? data.name.value : this.name,
      accountType: data.accountType.present
          ? data.accountType.value
          : this.accountType,
      balancePaise: data.balancePaise.present
          ? data.balancePaise.value
          : this.balancePaise,
      currencyCode: data.currencyCode.present
          ? data.currencyCode.value
          : this.currencyCode,
      isActive: data.isActive.present ? data.isActive.value : this.isActive,
      createdAtUtc: data.createdAtUtc.present
          ? data.createdAtUtc.value
          : this.createdAtUtc,
    );
  }

  @override
  String toString() {
    return (StringBuffer('MoneyAccountEntry(')
          ..write('id: $id, ')
          ..write('name: $name, ')
          ..write('accountType: $accountType, ')
          ..write('balancePaise: $balancePaise, ')
          ..write('currencyCode: $currencyCode, ')
          ..write('isActive: $isActive, ')
          ..write('createdAtUtc: $createdAtUtc')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
    id,
    name,
    accountType,
    balancePaise,
    currencyCode,
    isActive,
    createdAtUtc,
  );
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is MoneyAccountEntry &&
          other.id == this.id &&
          other.name == this.name &&
          other.accountType == this.accountType &&
          other.balancePaise == this.balancePaise &&
          other.currencyCode == this.currencyCode &&
          other.isActive == this.isActive &&
          other.createdAtUtc == this.createdAtUtc);
}

class MoneyAccountsCompanion extends UpdateCompanion<MoneyAccountEntry> {
  final Value<String> id;
  final Value<String> name;
  final Value<String> accountType;
  final Value<int> balancePaise;
  final Value<String> currencyCode;
  final Value<bool> isActive;
  final Value<int> createdAtUtc;
  final Value<int> rowid;
  const MoneyAccountsCompanion({
    this.id = const Value.absent(),
    this.name = const Value.absent(),
    this.accountType = const Value.absent(),
    this.balancePaise = const Value.absent(),
    this.currencyCode = const Value.absent(),
    this.isActive = const Value.absent(),
    this.createdAtUtc = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  MoneyAccountsCompanion.insert({
    required String id,
    required String name,
    required String accountType,
    this.balancePaise = const Value.absent(),
    this.currencyCode = const Value.absent(),
    this.isActive = const Value.absent(),
    required int createdAtUtc,
    this.rowid = const Value.absent(),
  }) : id = Value(id),
       name = Value(name),
       accountType = Value(accountType),
       createdAtUtc = Value(createdAtUtc);
  static Insertable<MoneyAccountEntry> custom({
    Expression<String>? id,
    Expression<String>? name,
    Expression<String>? accountType,
    Expression<int>? balancePaise,
    Expression<String>? currencyCode,
    Expression<bool>? isActive,
    Expression<int>? createdAtUtc,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (name != null) 'name': name,
      if (accountType != null) 'account_type': accountType,
      if (balancePaise != null) 'balance_paise': balancePaise,
      if (currencyCode != null) 'currency_code': currencyCode,
      if (isActive != null) 'is_active': isActive,
      if (createdAtUtc != null) 'created_at_utc': createdAtUtc,
      if (rowid != null) 'rowid': rowid,
    });
  }

  MoneyAccountsCompanion copyWith({
    Value<String>? id,
    Value<String>? name,
    Value<String>? accountType,
    Value<int>? balancePaise,
    Value<String>? currencyCode,
    Value<bool>? isActive,
    Value<int>? createdAtUtc,
    Value<int>? rowid,
  }) {
    return MoneyAccountsCompanion(
      id: id ?? this.id,
      name: name ?? this.name,
      accountType: accountType ?? this.accountType,
      balancePaise: balancePaise ?? this.balancePaise,
      currencyCode: currencyCode ?? this.currencyCode,
      isActive: isActive ?? this.isActive,
      createdAtUtc: createdAtUtc ?? this.createdAtUtc,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (name.present) {
      map['name'] = Variable<String>(name.value);
    }
    if (accountType.present) {
      map['account_type'] = Variable<String>(accountType.value);
    }
    if (balancePaise.present) {
      map['balance_paise'] = Variable<int>(balancePaise.value);
    }
    if (currencyCode.present) {
      map['currency_code'] = Variable<String>(currencyCode.value);
    }
    if (isActive.present) {
      map['is_active'] = Variable<bool>(isActive.value);
    }
    if (createdAtUtc.present) {
      map['created_at_utc'] = Variable<int>(createdAtUtc.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('MoneyAccountsCompanion(')
          ..write('id: $id, ')
          ..write('name: $name, ')
          ..write('accountType: $accountType, ')
          ..write('balancePaise: $balancePaise, ')
          ..write('currencyCode: $currencyCode, ')
          ..write('isActive: $isActive, ')
          ..write('createdAtUtc: $createdAtUtc, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $MoneyCategoriesTable extends MoneyCategories
    with TableInfo<$MoneyCategoriesTable, MoneyCategoryEntry> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $MoneyCategoriesTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _nameMeta = const VerificationMeta('name');
  @override
  late final GeneratedColumn<String> name = GeneratedColumn<String>(
    'name',
    aliasedName,
    false,
    additionalChecks: GeneratedColumn.checkTextLength(
      minTextLength: 1,
      maxTextLength: 64,
    ),
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _iconNameMeta = const VerificationMeta(
    'iconName',
  );
  @override
  late final GeneratedColumn<String> iconName = GeneratedColumn<String>(
    'icon_name',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
    defaultValue: const Constant('category'),
  );
  static const VerificationMeta _isExpenseMeta = const VerificationMeta(
    'isExpense',
  );
  @override
  late final GeneratedColumn<bool> isExpense = GeneratedColumn<bool>(
    'is_expense',
    aliasedName,
    false,
    type: DriftSqlType.bool,
    requiredDuringInsert: false,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'CHECK ("is_expense" IN (0, 1))',
    ),
    defaultValue: const Constant(true),
  );
  static const VerificationMeta _colorValueMeta = const VerificationMeta(
    'colorValue',
  );
  @override
  late final GeneratedColumn<int> colorValue = GeneratedColumn<int>(
    'color_value',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: false,
    defaultValue: const Constant(0xFF3B82F6),
  );
  static const VerificationMeta _createdAtUtcMeta = const VerificationMeta(
    'createdAtUtc',
  );
  @override
  late final GeneratedColumn<int> createdAtUtc = GeneratedColumn<int>(
    'created_at_utc',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: true,
  );
  @override
  List<GeneratedColumn> get $columns => [
    id,
    name,
    iconName,
    isExpense,
    colorValue,
    createdAtUtc,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'money_categories';
  @override
  VerificationContext validateIntegrity(
    Insertable<MoneyCategoryEntry> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('name')) {
      context.handle(
        _nameMeta,
        name.isAcceptableOrUnknown(data['name']!, _nameMeta),
      );
    } else if (isInserting) {
      context.missing(_nameMeta);
    }
    if (data.containsKey('icon_name')) {
      context.handle(
        _iconNameMeta,
        iconName.isAcceptableOrUnknown(data['icon_name']!, _iconNameMeta),
      );
    }
    if (data.containsKey('is_expense')) {
      context.handle(
        _isExpenseMeta,
        isExpense.isAcceptableOrUnknown(data['is_expense']!, _isExpenseMeta),
      );
    }
    if (data.containsKey('color_value')) {
      context.handle(
        _colorValueMeta,
        colorValue.isAcceptableOrUnknown(data['color_value']!, _colorValueMeta),
      );
    }
    if (data.containsKey('created_at_utc')) {
      context.handle(
        _createdAtUtcMeta,
        createdAtUtc.isAcceptableOrUnknown(
          data['created_at_utc']!,
          _createdAtUtcMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_createdAtUtcMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  MoneyCategoryEntry map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return MoneyCategoryEntry(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id'],
      )!,
      name: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}name'],
      )!,
      iconName: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}icon_name'],
      )!,
      isExpense: attachedDatabase.typeMapping.read(
        DriftSqlType.bool,
        data['${effectivePrefix}is_expense'],
      )!,
      colorValue: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}color_value'],
      )!,
      createdAtUtc: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}created_at_utc'],
      )!,
    );
  }

  @override
  $MoneyCategoriesTable createAlias(String alias) {
    return $MoneyCategoriesTable(attachedDatabase, alias);
  }
}

class MoneyCategoryEntry extends DataClass
    implements Insertable<MoneyCategoryEntry> {
  final String id;
  final String name;
  final String iconName;
  final bool isExpense;
  final int colorValue;
  final int createdAtUtc;
  const MoneyCategoryEntry({
    required this.id,
    required this.name,
    required this.iconName,
    required this.isExpense,
    required this.colorValue,
    required this.createdAtUtc,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['name'] = Variable<String>(name);
    map['icon_name'] = Variable<String>(iconName);
    map['is_expense'] = Variable<bool>(isExpense);
    map['color_value'] = Variable<int>(colorValue);
    map['created_at_utc'] = Variable<int>(createdAtUtc);
    return map;
  }

  MoneyCategoriesCompanion toCompanion(bool nullToAbsent) {
    return MoneyCategoriesCompanion(
      id: Value(id),
      name: Value(name),
      iconName: Value(iconName),
      isExpense: Value(isExpense),
      colorValue: Value(colorValue),
      createdAtUtc: Value(createdAtUtc),
    );
  }

  factory MoneyCategoryEntry.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return MoneyCategoryEntry(
      id: serializer.fromJson<String>(json['id']),
      name: serializer.fromJson<String>(json['name']),
      iconName: serializer.fromJson<String>(json['iconName']),
      isExpense: serializer.fromJson<bool>(json['isExpense']),
      colorValue: serializer.fromJson<int>(json['colorValue']),
      createdAtUtc: serializer.fromJson<int>(json['createdAtUtc']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'name': serializer.toJson<String>(name),
      'iconName': serializer.toJson<String>(iconName),
      'isExpense': serializer.toJson<bool>(isExpense),
      'colorValue': serializer.toJson<int>(colorValue),
      'createdAtUtc': serializer.toJson<int>(createdAtUtc),
    };
  }

  MoneyCategoryEntry copyWith({
    String? id,
    String? name,
    String? iconName,
    bool? isExpense,
    int? colorValue,
    int? createdAtUtc,
  }) => MoneyCategoryEntry(
    id: id ?? this.id,
    name: name ?? this.name,
    iconName: iconName ?? this.iconName,
    isExpense: isExpense ?? this.isExpense,
    colorValue: colorValue ?? this.colorValue,
    createdAtUtc: createdAtUtc ?? this.createdAtUtc,
  );
  MoneyCategoryEntry copyWithCompanion(MoneyCategoriesCompanion data) {
    return MoneyCategoryEntry(
      id: data.id.present ? data.id.value : this.id,
      name: data.name.present ? data.name.value : this.name,
      iconName: data.iconName.present ? data.iconName.value : this.iconName,
      isExpense: data.isExpense.present ? data.isExpense.value : this.isExpense,
      colorValue: data.colorValue.present
          ? data.colorValue.value
          : this.colorValue,
      createdAtUtc: data.createdAtUtc.present
          ? data.createdAtUtc.value
          : this.createdAtUtc,
    );
  }

  @override
  String toString() {
    return (StringBuffer('MoneyCategoryEntry(')
          ..write('id: $id, ')
          ..write('name: $name, ')
          ..write('iconName: $iconName, ')
          ..write('isExpense: $isExpense, ')
          ..write('colorValue: $colorValue, ')
          ..write('createdAtUtc: $createdAtUtc')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode =>
      Object.hash(id, name, iconName, isExpense, colorValue, createdAtUtc);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is MoneyCategoryEntry &&
          other.id == this.id &&
          other.name == this.name &&
          other.iconName == this.iconName &&
          other.isExpense == this.isExpense &&
          other.colorValue == this.colorValue &&
          other.createdAtUtc == this.createdAtUtc);
}

class MoneyCategoriesCompanion extends UpdateCompanion<MoneyCategoryEntry> {
  final Value<String> id;
  final Value<String> name;
  final Value<String> iconName;
  final Value<bool> isExpense;
  final Value<int> colorValue;
  final Value<int> createdAtUtc;
  final Value<int> rowid;
  const MoneyCategoriesCompanion({
    this.id = const Value.absent(),
    this.name = const Value.absent(),
    this.iconName = const Value.absent(),
    this.isExpense = const Value.absent(),
    this.colorValue = const Value.absent(),
    this.createdAtUtc = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  MoneyCategoriesCompanion.insert({
    required String id,
    required String name,
    this.iconName = const Value.absent(),
    this.isExpense = const Value.absent(),
    this.colorValue = const Value.absent(),
    required int createdAtUtc,
    this.rowid = const Value.absent(),
  }) : id = Value(id),
       name = Value(name),
       createdAtUtc = Value(createdAtUtc);
  static Insertable<MoneyCategoryEntry> custom({
    Expression<String>? id,
    Expression<String>? name,
    Expression<String>? iconName,
    Expression<bool>? isExpense,
    Expression<int>? colorValue,
    Expression<int>? createdAtUtc,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (name != null) 'name': name,
      if (iconName != null) 'icon_name': iconName,
      if (isExpense != null) 'is_expense': isExpense,
      if (colorValue != null) 'color_value': colorValue,
      if (createdAtUtc != null) 'created_at_utc': createdAtUtc,
      if (rowid != null) 'rowid': rowid,
    });
  }

  MoneyCategoriesCompanion copyWith({
    Value<String>? id,
    Value<String>? name,
    Value<String>? iconName,
    Value<bool>? isExpense,
    Value<int>? colorValue,
    Value<int>? createdAtUtc,
    Value<int>? rowid,
  }) {
    return MoneyCategoriesCompanion(
      id: id ?? this.id,
      name: name ?? this.name,
      iconName: iconName ?? this.iconName,
      isExpense: isExpense ?? this.isExpense,
      colorValue: colorValue ?? this.colorValue,
      createdAtUtc: createdAtUtc ?? this.createdAtUtc,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (name.present) {
      map['name'] = Variable<String>(name.value);
    }
    if (iconName.present) {
      map['icon_name'] = Variable<String>(iconName.value);
    }
    if (isExpense.present) {
      map['is_expense'] = Variable<bool>(isExpense.value);
    }
    if (colorValue.present) {
      map['color_value'] = Variable<int>(colorValue.value);
    }
    if (createdAtUtc.present) {
      map['created_at_utc'] = Variable<int>(createdAtUtc.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('MoneyCategoriesCompanion(')
          ..write('id: $id, ')
          ..write('name: $name, ')
          ..write('iconName: $iconName, ')
          ..write('isExpense: $isExpense, ')
          ..write('colorValue: $colorValue, ')
          ..write('createdAtUtc: $createdAtUtc, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $TaskListsTable extends TaskLists
    with TableInfo<$TaskListsTable, TaskListEntry> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $TaskListsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _titleMeta = const VerificationMeta('title');
  @override
  late final GeneratedColumn<String> title = GeneratedColumn<String>(
    'title',
    aliasedName,
    false,
    additionalChecks: GeneratedColumn.checkTextLength(
      minTextLength: 1,
      maxTextLength: 128,
    ),
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _colorValueMeta = const VerificationMeta(
    'colorValue',
  );
  @override
  late final GeneratedColumn<int> colorValue = GeneratedColumn<int>(
    'color_value',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: false,
    defaultValue: const Constant(0xFF10B981),
  );
  static const VerificationMeta _iconNameMeta = const VerificationMeta(
    'iconName',
  );
  @override
  late final GeneratedColumn<String> iconName = GeneratedColumn<String>(
    'icon_name',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
    defaultValue: const Constant('checklist'),
  );
  static const VerificationMeta _sortOrderMeta = const VerificationMeta(
    'sortOrder',
  );
  @override
  late final GeneratedColumn<int> sortOrder = GeneratedColumn<int>(
    'sort_order',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: false,
    defaultValue: const Constant(0),
  );
  static const VerificationMeta _createdAtUtcMeta = const VerificationMeta(
    'createdAtUtc',
  );
  @override
  late final GeneratedColumn<int> createdAtUtc = GeneratedColumn<int>(
    'created_at_utc',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: true,
  );
  @override
  List<GeneratedColumn> get $columns => [
    id,
    title,
    colorValue,
    iconName,
    sortOrder,
    createdAtUtc,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'task_lists';
  @override
  VerificationContext validateIntegrity(
    Insertable<TaskListEntry> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('title')) {
      context.handle(
        _titleMeta,
        title.isAcceptableOrUnknown(data['title']!, _titleMeta),
      );
    } else if (isInserting) {
      context.missing(_titleMeta);
    }
    if (data.containsKey('color_value')) {
      context.handle(
        _colorValueMeta,
        colorValue.isAcceptableOrUnknown(data['color_value']!, _colorValueMeta),
      );
    }
    if (data.containsKey('icon_name')) {
      context.handle(
        _iconNameMeta,
        iconName.isAcceptableOrUnknown(data['icon_name']!, _iconNameMeta),
      );
    }
    if (data.containsKey('sort_order')) {
      context.handle(
        _sortOrderMeta,
        sortOrder.isAcceptableOrUnknown(data['sort_order']!, _sortOrderMeta),
      );
    }
    if (data.containsKey('created_at_utc')) {
      context.handle(
        _createdAtUtcMeta,
        createdAtUtc.isAcceptableOrUnknown(
          data['created_at_utc']!,
          _createdAtUtcMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_createdAtUtcMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  TaskListEntry map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return TaskListEntry(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id'],
      )!,
      title: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}title'],
      )!,
      colorValue: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}color_value'],
      )!,
      iconName: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}icon_name'],
      )!,
      sortOrder: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}sort_order'],
      )!,
      createdAtUtc: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}created_at_utc'],
      )!,
    );
  }

  @override
  $TaskListsTable createAlias(String alias) {
    return $TaskListsTable(attachedDatabase, alias);
  }
}

class TaskListEntry extends DataClass implements Insertable<TaskListEntry> {
  final String id;
  final String title;
  final int colorValue;
  final String iconName;
  final int sortOrder;
  final int createdAtUtc;
  const TaskListEntry({
    required this.id,
    required this.title,
    required this.colorValue,
    required this.iconName,
    required this.sortOrder,
    required this.createdAtUtc,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['title'] = Variable<String>(title);
    map['color_value'] = Variable<int>(colorValue);
    map['icon_name'] = Variable<String>(iconName);
    map['sort_order'] = Variable<int>(sortOrder);
    map['created_at_utc'] = Variable<int>(createdAtUtc);
    return map;
  }

  TaskListsCompanion toCompanion(bool nullToAbsent) {
    return TaskListsCompanion(
      id: Value(id),
      title: Value(title),
      colorValue: Value(colorValue),
      iconName: Value(iconName),
      sortOrder: Value(sortOrder),
      createdAtUtc: Value(createdAtUtc),
    );
  }

  factory TaskListEntry.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return TaskListEntry(
      id: serializer.fromJson<String>(json['id']),
      title: serializer.fromJson<String>(json['title']),
      colorValue: serializer.fromJson<int>(json['colorValue']),
      iconName: serializer.fromJson<String>(json['iconName']),
      sortOrder: serializer.fromJson<int>(json['sortOrder']),
      createdAtUtc: serializer.fromJson<int>(json['createdAtUtc']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'title': serializer.toJson<String>(title),
      'colorValue': serializer.toJson<int>(colorValue),
      'iconName': serializer.toJson<String>(iconName),
      'sortOrder': serializer.toJson<int>(sortOrder),
      'createdAtUtc': serializer.toJson<int>(createdAtUtc),
    };
  }

  TaskListEntry copyWith({
    String? id,
    String? title,
    int? colorValue,
    String? iconName,
    int? sortOrder,
    int? createdAtUtc,
  }) => TaskListEntry(
    id: id ?? this.id,
    title: title ?? this.title,
    colorValue: colorValue ?? this.colorValue,
    iconName: iconName ?? this.iconName,
    sortOrder: sortOrder ?? this.sortOrder,
    createdAtUtc: createdAtUtc ?? this.createdAtUtc,
  );
  TaskListEntry copyWithCompanion(TaskListsCompanion data) {
    return TaskListEntry(
      id: data.id.present ? data.id.value : this.id,
      title: data.title.present ? data.title.value : this.title,
      colorValue: data.colorValue.present
          ? data.colorValue.value
          : this.colorValue,
      iconName: data.iconName.present ? data.iconName.value : this.iconName,
      sortOrder: data.sortOrder.present ? data.sortOrder.value : this.sortOrder,
      createdAtUtc: data.createdAtUtc.present
          ? data.createdAtUtc.value
          : this.createdAtUtc,
    );
  }

  @override
  String toString() {
    return (StringBuffer('TaskListEntry(')
          ..write('id: $id, ')
          ..write('title: $title, ')
          ..write('colorValue: $colorValue, ')
          ..write('iconName: $iconName, ')
          ..write('sortOrder: $sortOrder, ')
          ..write('createdAtUtc: $createdAtUtc')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode =>
      Object.hash(id, title, colorValue, iconName, sortOrder, createdAtUtc);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is TaskListEntry &&
          other.id == this.id &&
          other.title == this.title &&
          other.colorValue == this.colorValue &&
          other.iconName == this.iconName &&
          other.sortOrder == this.sortOrder &&
          other.createdAtUtc == this.createdAtUtc);
}

class TaskListsCompanion extends UpdateCompanion<TaskListEntry> {
  final Value<String> id;
  final Value<String> title;
  final Value<int> colorValue;
  final Value<String> iconName;
  final Value<int> sortOrder;
  final Value<int> createdAtUtc;
  final Value<int> rowid;
  const TaskListsCompanion({
    this.id = const Value.absent(),
    this.title = const Value.absent(),
    this.colorValue = const Value.absent(),
    this.iconName = const Value.absent(),
    this.sortOrder = const Value.absent(),
    this.createdAtUtc = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  TaskListsCompanion.insert({
    required String id,
    required String title,
    this.colorValue = const Value.absent(),
    this.iconName = const Value.absent(),
    this.sortOrder = const Value.absent(),
    required int createdAtUtc,
    this.rowid = const Value.absent(),
  }) : id = Value(id),
       title = Value(title),
       createdAtUtc = Value(createdAtUtc);
  static Insertable<TaskListEntry> custom({
    Expression<String>? id,
    Expression<String>? title,
    Expression<int>? colorValue,
    Expression<String>? iconName,
    Expression<int>? sortOrder,
    Expression<int>? createdAtUtc,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (title != null) 'title': title,
      if (colorValue != null) 'color_value': colorValue,
      if (iconName != null) 'icon_name': iconName,
      if (sortOrder != null) 'sort_order': sortOrder,
      if (createdAtUtc != null) 'created_at_utc': createdAtUtc,
      if (rowid != null) 'rowid': rowid,
    });
  }

  TaskListsCompanion copyWith({
    Value<String>? id,
    Value<String>? title,
    Value<int>? colorValue,
    Value<String>? iconName,
    Value<int>? sortOrder,
    Value<int>? createdAtUtc,
    Value<int>? rowid,
  }) {
    return TaskListsCompanion(
      id: id ?? this.id,
      title: title ?? this.title,
      colorValue: colorValue ?? this.colorValue,
      iconName: iconName ?? this.iconName,
      sortOrder: sortOrder ?? this.sortOrder,
      createdAtUtc: createdAtUtc ?? this.createdAtUtc,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (title.present) {
      map['title'] = Variable<String>(title.value);
    }
    if (colorValue.present) {
      map['color_value'] = Variable<int>(colorValue.value);
    }
    if (iconName.present) {
      map['icon_name'] = Variable<String>(iconName.value);
    }
    if (sortOrder.present) {
      map['sort_order'] = Variable<int>(sortOrder.value);
    }
    if (createdAtUtc.present) {
      map['created_at_utc'] = Variable<int>(createdAtUtc.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('TaskListsCompanion(')
          ..write('id: $id, ')
          ..write('title: $title, ')
          ..write('colorValue: $colorValue, ')
          ..write('iconName: $iconName, ')
          ..write('sortOrder: $sortOrder, ')
          ..write('createdAtUtc: $createdAtUtc, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $TaskItemsTable extends TaskItems
    with TableInfo<$TaskItemsTable, TaskItemEntry> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $TaskItemsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _listIdMeta = const VerificationMeta('listId');
  @override
  late final GeneratedColumn<String> listId = GeneratedColumn<String>(
    'list_id',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'REFERENCES task_lists (id) ON DELETE SET NULL',
    ),
  );
  static const VerificationMeta _parentTaskIdMeta = const VerificationMeta(
    'parentTaskId',
  );
  @override
  late final GeneratedColumn<String> parentTaskId = GeneratedColumn<String>(
    'parent_task_id',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _titleMeta = const VerificationMeta('title');
  @override
  late final GeneratedColumn<String> title = GeneratedColumn<String>(
    'title',
    aliasedName,
    false,
    additionalChecks: GeneratedColumn.checkTextLength(
      minTextLength: 1,
      maxTextLength: 256,
    ),
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _descriptionMeta = const VerificationMeta(
    'description',
  );
  @override
  late final GeneratedColumn<String> description = GeneratedColumn<String>(
    'description',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _dueDateUtcMeta = const VerificationMeta(
    'dueDateUtc',
  );
  @override
  late final GeneratedColumn<int> dueDateUtc = GeneratedColumn<int>(
    'due_date_utc',
    aliasedName,
    true,
    type: DriftSqlType.int,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _hasTimeMeta = const VerificationMeta(
    'hasTime',
  );
  @override
  late final GeneratedColumn<bool> hasTime = GeneratedColumn<bool>(
    'has_time',
    aliasedName,
    false,
    type: DriftSqlType.bool,
    requiredDuringInsert: false,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'CHECK ("has_time" IN (0, 1))',
    ),
    defaultValue: const Constant(false),
  );
  static const VerificationMeta _isCompletedMeta = const VerificationMeta(
    'isCompleted',
  );
  @override
  late final GeneratedColumn<bool> isCompleted = GeneratedColumn<bool>(
    'is_completed',
    aliasedName,
    false,
    type: DriftSqlType.bool,
    requiredDuringInsert: false,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'CHECK ("is_completed" IN (0, 1))',
    ),
    defaultValue: const Constant(false),
  );
  static const VerificationMeta _priorityMeta = const VerificationMeta(
    'priority',
  );
  @override
  late final GeneratedColumn<int> priority = GeneratedColumn<int>(
    'priority',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: false,
    defaultValue: const Constant(1),
  );
  static const VerificationMeta _recurrenceRuleMeta = const VerificationMeta(
    'recurrenceRule',
  );
  @override
  late final GeneratedColumn<String> recurrenceRule = GeneratedColumn<String>(
    'recurrence_rule',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _reminderOffsetsMeta = const VerificationMeta(
    'reminderOffsets',
  );
  @override
  late final GeneratedColumn<String> reminderOffsets = GeneratedColumn<String>(
    'reminder_offsets',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _createdAtUtcMeta = const VerificationMeta(
    'createdAtUtc',
  );
  @override
  late final GeneratedColumn<int> createdAtUtc = GeneratedColumn<int>(
    'created_at_utc',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _updatedAtUtcMeta = const VerificationMeta(
    'updatedAtUtc',
  );
  @override
  late final GeneratedColumn<int> updatedAtUtc = GeneratedColumn<int>(
    'updated_at_utc',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: true,
  );
  @override
  List<GeneratedColumn> get $columns => [
    id,
    listId,
    parentTaskId,
    title,
    description,
    dueDateUtc,
    hasTime,
    isCompleted,
    priority,
    recurrenceRule,
    reminderOffsets,
    createdAtUtc,
    updatedAtUtc,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'task_items';
  @override
  VerificationContext validateIntegrity(
    Insertable<TaskItemEntry> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('list_id')) {
      context.handle(
        _listIdMeta,
        listId.isAcceptableOrUnknown(data['list_id']!, _listIdMeta),
      );
    }
    if (data.containsKey('parent_task_id')) {
      context.handle(
        _parentTaskIdMeta,
        parentTaskId.isAcceptableOrUnknown(
          data['parent_task_id']!,
          _parentTaskIdMeta,
        ),
      );
    }
    if (data.containsKey('title')) {
      context.handle(
        _titleMeta,
        title.isAcceptableOrUnknown(data['title']!, _titleMeta),
      );
    } else if (isInserting) {
      context.missing(_titleMeta);
    }
    if (data.containsKey('description')) {
      context.handle(
        _descriptionMeta,
        description.isAcceptableOrUnknown(
          data['description']!,
          _descriptionMeta,
        ),
      );
    }
    if (data.containsKey('due_date_utc')) {
      context.handle(
        _dueDateUtcMeta,
        dueDateUtc.isAcceptableOrUnknown(
          data['due_date_utc']!,
          _dueDateUtcMeta,
        ),
      );
    }
    if (data.containsKey('has_time')) {
      context.handle(
        _hasTimeMeta,
        hasTime.isAcceptableOrUnknown(data['has_time']!, _hasTimeMeta),
      );
    }
    if (data.containsKey('is_completed')) {
      context.handle(
        _isCompletedMeta,
        isCompleted.isAcceptableOrUnknown(
          data['is_completed']!,
          _isCompletedMeta,
        ),
      );
    }
    if (data.containsKey('priority')) {
      context.handle(
        _priorityMeta,
        priority.isAcceptableOrUnknown(data['priority']!, _priorityMeta),
      );
    }
    if (data.containsKey('recurrence_rule')) {
      context.handle(
        _recurrenceRuleMeta,
        recurrenceRule.isAcceptableOrUnknown(
          data['recurrence_rule']!,
          _recurrenceRuleMeta,
        ),
      );
    }
    if (data.containsKey('reminder_offsets')) {
      context.handle(
        _reminderOffsetsMeta,
        reminderOffsets.isAcceptableOrUnknown(
          data['reminder_offsets']!,
          _reminderOffsetsMeta,
        ),
      );
    }
    if (data.containsKey('created_at_utc')) {
      context.handle(
        _createdAtUtcMeta,
        createdAtUtc.isAcceptableOrUnknown(
          data['created_at_utc']!,
          _createdAtUtcMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_createdAtUtcMeta);
    }
    if (data.containsKey('updated_at_utc')) {
      context.handle(
        _updatedAtUtcMeta,
        updatedAtUtc.isAcceptableOrUnknown(
          data['updated_at_utc']!,
          _updatedAtUtcMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_updatedAtUtcMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  TaskItemEntry map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return TaskItemEntry(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id'],
      )!,
      listId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}list_id'],
      ),
      parentTaskId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}parent_task_id'],
      ),
      title: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}title'],
      )!,
      description: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}description'],
      ),
      dueDateUtc: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}due_date_utc'],
      ),
      hasTime: attachedDatabase.typeMapping.read(
        DriftSqlType.bool,
        data['${effectivePrefix}has_time'],
      )!,
      isCompleted: attachedDatabase.typeMapping.read(
        DriftSqlType.bool,
        data['${effectivePrefix}is_completed'],
      )!,
      priority: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}priority'],
      )!,
      recurrenceRule: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}recurrence_rule'],
      ),
      reminderOffsets: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}reminder_offsets'],
      ),
      createdAtUtc: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}created_at_utc'],
      )!,
      updatedAtUtc: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}updated_at_utc'],
      )!,
    );
  }

  @override
  $TaskItemsTable createAlias(String alias) {
    return $TaskItemsTable(attachedDatabase, alias);
  }
}

class TaskItemEntry extends DataClass implements Insertable<TaskItemEntry> {
  final String id;
  final String? listId;
  final String? parentTaskId;
  final String title;
  final String? description;
  final int? dueDateUtc;
  final bool hasTime;
  final bool isCompleted;
  final int priority;
  final String? recurrenceRule;
  final String? reminderOffsets;
  final int createdAtUtc;
  final int updatedAtUtc;
  const TaskItemEntry({
    required this.id,
    this.listId,
    this.parentTaskId,
    required this.title,
    this.description,
    this.dueDateUtc,
    required this.hasTime,
    required this.isCompleted,
    required this.priority,
    this.recurrenceRule,
    this.reminderOffsets,
    required this.createdAtUtc,
    required this.updatedAtUtc,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    if (!nullToAbsent || listId != null) {
      map['list_id'] = Variable<String>(listId);
    }
    if (!nullToAbsent || parentTaskId != null) {
      map['parent_task_id'] = Variable<String>(parentTaskId);
    }
    map['title'] = Variable<String>(title);
    if (!nullToAbsent || description != null) {
      map['description'] = Variable<String>(description);
    }
    if (!nullToAbsent || dueDateUtc != null) {
      map['due_date_utc'] = Variable<int>(dueDateUtc);
    }
    map['has_time'] = Variable<bool>(hasTime);
    map['is_completed'] = Variable<bool>(isCompleted);
    map['priority'] = Variable<int>(priority);
    if (!nullToAbsent || recurrenceRule != null) {
      map['recurrence_rule'] = Variable<String>(recurrenceRule);
    }
    if (!nullToAbsent || reminderOffsets != null) {
      map['reminder_offsets'] = Variable<String>(reminderOffsets);
    }
    map['created_at_utc'] = Variable<int>(createdAtUtc);
    map['updated_at_utc'] = Variable<int>(updatedAtUtc);
    return map;
  }

  TaskItemsCompanion toCompanion(bool nullToAbsent) {
    return TaskItemsCompanion(
      id: Value(id),
      listId: listId == null && nullToAbsent
          ? const Value.absent()
          : Value(listId),
      parentTaskId: parentTaskId == null && nullToAbsent
          ? const Value.absent()
          : Value(parentTaskId),
      title: Value(title),
      description: description == null && nullToAbsent
          ? const Value.absent()
          : Value(description),
      dueDateUtc: dueDateUtc == null && nullToAbsent
          ? const Value.absent()
          : Value(dueDateUtc),
      hasTime: Value(hasTime),
      isCompleted: Value(isCompleted),
      priority: Value(priority),
      recurrenceRule: recurrenceRule == null && nullToAbsent
          ? const Value.absent()
          : Value(recurrenceRule),
      reminderOffsets: reminderOffsets == null && nullToAbsent
          ? const Value.absent()
          : Value(reminderOffsets),
      createdAtUtc: Value(createdAtUtc),
      updatedAtUtc: Value(updatedAtUtc),
    );
  }

  factory TaskItemEntry.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return TaskItemEntry(
      id: serializer.fromJson<String>(json['id']),
      listId: serializer.fromJson<String?>(json['listId']),
      parentTaskId: serializer.fromJson<String?>(json['parentTaskId']),
      title: serializer.fromJson<String>(json['title']),
      description: serializer.fromJson<String?>(json['description']),
      dueDateUtc: serializer.fromJson<int?>(json['dueDateUtc']),
      hasTime: serializer.fromJson<bool>(json['hasTime']),
      isCompleted: serializer.fromJson<bool>(json['isCompleted']),
      priority: serializer.fromJson<int>(json['priority']),
      recurrenceRule: serializer.fromJson<String?>(json['recurrenceRule']),
      reminderOffsets: serializer.fromJson<String?>(json['reminderOffsets']),
      createdAtUtc: serializer.fromJson<int>(json['createdAtUtc']),
      updatedAtUtc: serializer.fromJson<int>(json['updatedAtUtc']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'listId': serializer.toJson<String?>(listId),
      'parentTaskId': serializer.toJson<String?>(parentTaskId),
      'title': serializer.toJson<String>(title),
      'description': serializer.toJson<String?>(description),
      'dueDateUtc': serializer.toJson<int?>(dueDateUtc),
      'hasTime': serializer.toJson<bool>(hasTime),
      'isCompleted': serializer.toJson<bool>(isCompleted),
      'priority': serializer.toJson<int>(priority),
      'recurrenceRule': serializer.toJson<String?>(recurrenceRule),
      'reminderOffsets': serializer.toJson<String?>(reminderOffsets),
      'createdAtUtc': serializer.toJson<int>(createdAtUtc),
      'updatedAtUtc': serializer.toJson<int>(updatedAtUtc),
    };
  }

  TaskItemEntry copyWith({
    String? id,
    Value<String?> listId = const Value.absent(),
    Value<String?> parentTaskId = const Value.absent(),
    String? title,
    Value<String?> description = const Value.absent(),
    Value<int?> dueDateUtc = const Value.absent(),
    bool? hasTime,
    bool? isCompleted,
    int? priority,
    Value<String?> recurrenceRule = const Value.absent(),
    Value<String?> reminderOffsets = const Value.absent(),
    int? createdAtUtc,
    int? updatedAtUtc,
  }) => TaskItemEntry(
    id: id ?? this.id,
    listId: listId.present ? listId.value : this.listId,
    parentTaskId: parentTaskId.present ? parentTaskId.value : this.parentTaskId,
    title: title ?? this.title,
    description: description.present ? description.value : this.description,
    dueDateUtc: dueDateUtc.present ? dueDateUtc.value : this.dueDateUtc,
    hasTime: hasTime ?? this.hasTime,
    isCompleted: isCompleted ?? this.isCompleted,
    priority: priority ?? this.priority,
    recurrenceRule: recurrenceRule.present
        ? recurrenceRule.value
        : this.recurrenceRule,
    reminderOffsets: reminderOffsets.present
        ? reminderOffsets.value
        : this.reminderOffsets,
    createdAtUtc: createdAtUtc ?? this.createdAtUtc,
    updatedAtUtc: updatedAtUtc ?? this.updatedAtUtc,
  );
  TaskItemEntry copyWithCompanion(TaskItemsCompanion data) {
    return TaskItemEntry(
      id: data.id.present ? data.id.value : this.id,
      listId: data.listId.present ? data.listId.value : this.listId,
      parentTaskId: data.parentTaskId.present
          ? data.parentTaskId.value
          : this.parentTaskId,
      title: data.title.present ? data.title.value : this.title,
      description: data.description.present
          ? data.description.value
          : this.description,
      dueDateUtc: data.dueDateUtc.present
          ? data.dueDateUtc.value
          : this.dueDateUtc,
      hasTime: data.hasTime.present ? data.hasTime.value : this.hasTime,
      isCompleted: data.isCompleted.present
          ? data.isCompleted.value
          : this.isCompleted,
      priority: data.priority.present ? data.priority.value : this.priority,
      recurrenceRule: data.recurrenceRule.present
          ? data.recurrenceRule.value
          : this.recurrenceRule,
      reminderOffsets: data.reminderOffsets.present
          ? data.reminderOffsets.value
          : this.reminderOffsets,
      createdAtUtc: data.createdAtUtc.present
          ? data.createdAtUtc.value
          : this.createdAtUtc,
      updatedAtUtc: data.updatedAtUtc.present
          ? data.updatedAtUtc.value
          : this.updatedAtUtc,
    );
  }

  @override
  String toString() {
    return (StringBuffer('TaskItemEntry(')
          ..write('id: $id, ')
          ..write('listId: $listId, ')
          ..write('parentTaskId: $parentTaskId, ')
          ..write('title: $title, ')
          ..write('description: $description, ')
          ..write('dueDateUtc: $dueDateUtc, ')
          ..write('hasTime: $hasTime, ')
          ..write('isCompleted: $isCompleted, ')
          ..write('priority: $priority, ')
          ..write('recurrenceRule: $recurrenceRule, ')
          ..write('reminderOffsets: $reminderOffsets, ')
          ..write('createdAtUtc: $createdAtUtc, ')
          ..write('updatedAtUtc: $updatedAtUtc')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
    id,
    listId,
    parentTaskId,
    title,
    description,
    dueDateUtc,
    hasTime,
    isCompleted,
    priority,
    recurrenceRule,
    reminderOffsets,
    createdAtUtc,
    updatedAtUtc,
  );
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is TaskItemEntry &&
          other.id == this.id &&
          other.listId == this.listId &&
          other.parentTaskId == this.parentTaskId &&
          other.title == this.title &&
          other.description == this.description &&
          other.dueDateUtc == this.dueDateUtc &&
          other.hasTime == this.hasTime &&
          other.isCompleted == this.isCompleted &&
          other.priority == this.priority &&
          other.recurrenceRule == this.recurrenceRule &&
          other.reminderOffsets == this.reminderOffsets &&
          other.createdAtUtc == this.createdAtUtc &&
          other.updatedAtUtc == this.updatedAtUtc);
}

class TaskItemsCompanion extends UpdateCompanion<TaskItemEntry> {
  final Value<String> id;
  final Value<String?> listId;
  final Value<String?> parentTaskId;
  final Value<String> title;
  final Value<String?> description;
  final Value<int?> dueDateUtc;
  final Value<bool> hasTime;
  final Value<bool> isCompleted;
  final Value<int> priority;
  final Value<String?> recurrenceRule;
  final Value<String?> reminderOffsets;
  final Value<int> createdAtUtc;
  final Value<int> updatedAtUtc;
  final Value<int> rowid;
  const TaskItemsCompanion({
    this.id = const Value.absent(),
    this.listId = const Value.absent(),
    this.parentTaskId = const Value.absent(),
    this.title = const Value.absent(),
    this.description = const Value.absent(),
    this.dueDateUtc = const Value.absent(),
    this.hasTime = const Value.absent(),
    this.isCompleted = const Value.absent(),
    this.priority = const Value.absent(),
    this.recurrenceRule = const Value.absent(),
    this.reminderOffsets = const Value.absent(),
    this.createdAtUtc = const Value.absent(),
    this.updatedAtUtc = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  TaskItemsCompanion.insert({
    required String id,
    this.listId = const Value.absent(),
    this.parentTaskId = const Value.absent(),
    required String title,
    this.description = const Value.absent(),
    this.dueDateUtc = const Value.absent(),
    this.hasTime = const Value.absent(),
    this.isCompleted = const Value.absent(),
    this.priority = const Value.absent(),
    this.recurrenceRule = const Value.absent(),
    this.reminderOffsets = const Value.absent(),
    required int createdAtUtc,
    required int updatedAtUtc,
    this.rowid = const Value.absent(),
  }) : id = Value(id),
       title = Value(title),
       createdAtUtc = Value(createdAtUtc),
       updatedAtUtc = Value(updatedAtUtc);
  static Insertable<TaskItemEntry> custom({
    Expression<String>? id,
    Expression<String>? listId,
    Expression<String>? parentTaskId,
    Expression<String>? title,
    Expression<String>? description,
    Expression<int>? dueDateUtc,
    Expression<bool>? hasTime,
    Expression<bool>? isCompleted,
    Expression<int>? priority,
    Expression<String>? recurrenceRule,
    Expression<String>? reminderOffsets,
    Expression<int>? createdAtUtc,
    Expression<int>? updatedAtUtc,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (listId != null) 'list_id': listId,
      if (parentTaskId != null) 'parent_task_id': parentTaskId,
      if (title != null) 'title': title,
      if (description != null) 'description': description,
      if (dueDateUtc != null) 'due_date_utc': dueDateUtc,
      if (hasTime != null) 'has_time': hasTime,
      if (isCompleted != null) 'is_completed': isCompleted,
      if (priority != null) 'priority': priority,
      if (recurrenceRule != null) 'recurrence_rule': recurrenceRule,
      if (reminderOffsets != null) 'reminder_offsets': reminderOffsets,
      if (createdAtUtc != null) 'created_at_utc': createdAtUtc,
      if (updatedAtUtc != null) 'updated_at_utc': updatedAtUtc,
      if (rowid != null) 'rowid': rowid,
    });
  }

  TaskItemsCompanion copyWith({
    Value<String>? id,
    Value<String?>? listId,
    Value<String?>? parentTaskId,
    Value<String>? title,
    Value<String?>? description,
    Value<int?>? dueDateUtc,
    Value<bool>? hasTime,
    Value<bool>? isCompleted,
    Value<int>? priority,
    Value<String?>? recurrenceRule,
    Value<String?>? reminderOffsets,
    Value<int>? createdAtUtc,
    Value<int>? updatedAtUtc,
    Value<int>? rowid,
  }) {
    return TaskItemsCompanion(
      id: id ?? this.id,
      listId: listId ?? this.listId,
      parentTaskId: parentTaskId ?? this.parentTaskId,
      title: title ?? this.title,
      description: description ?? this.description,
      dueDateUtc: dueDateUtc ?? this.dueDateUtc,
      hasTime: hasTime ?? this.hasTime,
      isCompleted: isCompleted ?? this.isCompleted,
      priority: priority ?? this.priority,
      recurrenceRule: recurrenceRule ?? this.recurrenceRule,
      reminderOffsets: reminderOffsets ?? this.reminderOffsets,
      createdAtUtc: createdAtUtc ?? this.createdAtUtc,
      updatedAtUtc: updatedAtUtc ?? this.updatedAtUtc,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (listId.present) {
      map['list_id'] = Variable<String>(listId.value);
    }
    if (parentTaskId.present) {
      map['parent_task_id'] = Variable<String>(parentTaskId.value);
    }
    if (title.present) {
      map['title'] = Variable<String>(title.value);
    }
    if (description.present) {
      map['description'] = Variable<String>(description.value);
    }
    if (dueDateUtc.present) {
      map['due_date_utc'] = Variable<int>(dueDateUtc.value);
    }
    if (hasTime.present) {
      map['has_time'] = Variable<bool>(hasTime.value);
    }
    if (isCompleted.present) {
      map['is_completed'] = Variable<bool>(isCompleted.value);
    }
    if (priority.present) {
      map['priority'] = Variable<int>(priority.value);
    }
    if (recurrenceRule.present) {
      map['recurrence_rule'] = Variable<String>(recurrenceRule.value);
    }
    if (reminderOffsets.present) {
      map['reminder_offsets'] = Variable<String>(reminderOffsets.value);
    }
    if (createdAtUtc.present) {
      map['created_at_utc'] = Variable<int>(createdAtUtc.value);
    }
    if (updatedAtUtc.present) {
      map['updated_at_utc'] = Variable<int>(updatedAtUtc.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('TaskItemsCompanion(')
          ..write('id: $id, ')
          ..write('listId: $listId, ')
          ..write('parentTaskId: $parentTaskId, ')
          ..write('title: $title, ')
          ..write('description: $description, ')
          ..write('dueDateUtc: $dueDateUtc, ')
          ..write('hasTime: $hasTime, ')
          ..write('isCompleted: $isCompleted, ')
          ..write('priority: $priority, ')
          ..write('recurrenceRule: $recurrenceRule, ')
          ..write('reminderOffsets: $reminderOffsets, ')
          ..write('createdAtUtc: $createdAtUtc, ')
          ..write('updatedAtUtc: $updatedAtUtc, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $MoneyTransactionsTable extends MoneyTransactions
    with TableInfo<$MoneyTransactionsTable, MoneyTransactionEntry> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $MoneyTransactionsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _accountIdMeta = const VerificationMeta(
    'accountId',
  );
  @override
  late final GeneratedColumn<String> accountId = GeneratedColumn<String>(
    'account_id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'REFERENCES money_accounts (id) ON DELETE CASCADE',
    ),
  );
  static const VerificationMeta _toAccountIdMeta = const VerificationMeta(
    'toAccountId',
  );
  @override
  late final GeneratedColumn<String> toAccountId = GeneratedColumn<String>(
    'to_account_id',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'REFERENCES money_accounts (id) ON DELETE CASCADE',
    ),
  );
  static const VerificationMeta _categoryIdMeta = const VerificationMeta(
    'categoryId',
  );
  @override
  late final GeneratedColumn<String> categoryId = GeneratedColumn<String>(
    'category_id',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'REFERENCES money_categories (id) ON DELETE SET NULL',
    ),
  );
  static const VerificationMeta _amountPaiseMeta = const VerificationMeta(
    'amountPaise',
  );
  @override
  late final GeneratedColumn<int> amountPaise = GeneratedColumn<int>(
    'amount_paise',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _typeMeta = const VerificationMeta('type');
  @override
  late final GeneratedColumn<String> type = GeneratedColumn<String>(
    'type',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
    defaultValue: const Constant('expense'),
  );
  static const VerificationMeta _transactionTimeUtcMeta =
      const VerificationMeta('transactionTimeUtc');
  @override
  late final GeneratedColumn<int> transactionTimeUtc = GeneratedColumn<int>(
    'transaction_time_utc',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _noteMeta = const VerificationMeta('note');
  @override
  late final GeneratedColumn<String> note = GeneratedColumn<String>(
    'note',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _linkedCalendarEventIdMeta =
      const VerificationMeta('linkedCalendarEventId');
  @override
  late final GeneratedColumn<String> linkedCalendarEventId =
      GeneratedColumn<String>(
        'linked_calendar_event_id',
        aliasedName,
        true,
        type: DriftSqlType.string,
        requiredDuringInsert: false,
        defaultConstraints: GeneratedColumn.constraintIsAlways(
          'REFERENCES calendar_events (id) ON DELETE SET NULL',
        ),
      );
  static const VerificationMeta _linkedTaskIdMeta = const VerificationMeta(
    'linkedTaskId',
  );
  @override
  late final GeneratedColumn<String> linkedTaskId = GeneratedColumn<String>(
    'linked_task_id',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'REFERENCES task_items (id) ON DELETE SET NULL',
    ),
  );
  static const VerificationMeta _createdAtUtcMeta = const VerificationMeta(
    'createdAtUtc',
  );
  @override
  late final GeneratedColumn<int> createdAtUtc = GeneratedColumn<int>(
    'created_at_utc',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: true,
  );
  @override
  List<GeneratedColumn> get $columns => [
    id,
    accountId,
    toAccountId,
    categoryId,
    amountPaise,
    type,
    transactionTimeUtc,
    note,
    linkedCalendarEventId,
    linkedTaskId,
    createdAtUtc,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'money_transactions';
  @override
  VerificationContext validateIntegrity(
    Insertable<MoneyTransactionEntry> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('account_id')) {
      context.handle(
        _accountIdMeta,
        accountId.isAcceptableOrUnknown(data['account_id']!, _accountIdMeta),
      );
    } else if (isInserting) {
      context.missing(_accountIdMeta);
    }
    if (data.containsKey('to_account_id')) {
      context.handle(
        _toAccountIdMeta,
        toAccountId.isAcceptableOrUnknown(
          data['to_account_id']!,
          _toAccountIdMeta,
        ),
      );
    }
    if (data.containsKey('category_id')) {
      context.handle(
        _categoryIdMeta,
        categoryId.isAcceptableOrUnknown(data['category_id']!, _categoryIdMeta),
      );
    }
    if (data.containsKey('amount_paise')) {
      context.handle(
        _amountPaiseMeta,
        amountPaise.isAcceptableOrUnknown(
          data['amount_paise']!,
          _amountPaiseMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_amountPaiseMeta);
    }
    if (data.containsKey('type')) {
      context.handle(
        _typeMeta,
        type.isAcceptableOrUnknown(data['type']!, _typeMeta),
      );
    }
    if (data.containsKey('transaction_time_utc')) {
      context.handle(
        _transactionTimeUtcMeta,
        transactionTimeUtc.isAcceptableOrUnknown(
          data['transaction_time_utc']!,
          _transactionTimeUtcMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_transactionTimeUtcMeta);
    }
    if (data.containsKey('note')) {
      context.handle(
        _noteMeta,
        note.isAcceptableOrUnknown(data['note']!, _noteMeta),
      );
    }
    if (data.containsKey('linked_calendar_event_id')) {
      context.handle(
        _linkedCalendarEventIdMeta,
        linkedCalendarEventId.isAcceptableOrUnknown(
          data['linked_calendar_event_id']!,
          _linkedCalendarEventIdMeta,
        ),
      );
    }
    if (data.containsKey('linked_task_id')) {
      context.handle(
        _linkedTaskIdMeta,
        linkedTaskId.isAcceptableOrUnknown(
          data['linked_task_id']!,
          _linkedTaskIdMeta,
        ),
      );
    }
    if (data.containsKey('created_at_utc')) {
      context.handle(
        _createdAtUtcMeta,
        createdAtUtc.isAcceptableOrUnknown(
          data['created_at_utc']!,
          _createdAtUtcMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_createdAtUtcMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  MoneyTransactionEntry map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return MoneyTransactionEntry(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id'],
      )!,
      accountId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}account_id'],
      )!,
      toAccountId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}to_account_id'],
      ),
      categoryId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}category_id'],
      ),
      amountPaise: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}amount_paise'],
      )!,
      type: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}type'],
      )!,
      transactionTimeUtc: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}transaction_time_utc'],
      )!,
      note: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}note'],
      ),
      linkedCalendarEventId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}linked_calendar_event_id'],
      ),
      linkedTaskId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}linked_task_id'],
      ),
      createdAtUtc: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}created_at_utc'],
      )!,
    );
  }

  @override
  $MoneyTransactionsTable createAlias(String alias) {
    return $MoneyTransactionsTable(attachedDatabase, alias);
  }
}

class MoneyTransactionEntry extends DataClass
    implements Insertable<MoneyTransactionEntry> {
  final String id;
  final String accountId;
  final String? toAccountId;
  final String? categoryId;
  final int amountPaise;
  final String type;
  final int transactionTimeUtc;
  final String? note;
  final String? linkedCalendarEventId;
  final String? linkedTaskId;
  final int createdAtUtc;
  const MoneyTransactionEntry({
    required this.id,
    required this.accountId,
    this.toAccountId,
    this.categoryId,
    required this.amountPaise,
    required this.type,
    required this.transactionTimeUtc,
    this.note,
    this.linkedCalendarEventId,
    this.linkedTaskId,
    required this.createdAtUtc,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['account_id'] = Variable<String>(accountId);
    if (!nullToAbsent || toAccountId != null) {
      map['to_account_id'] = Variable<String>(toAccountId);
    }
    if (!nullToAbsent || categoryId != null) {
      map['category_id'] = Variable<String>(categoryId);
    }
    map['amount_paise'] = Variable<int>(amountPaise);
    map['type'] = Variable<String>(type);
    map['transaction_time_utc'] = Variable<int>(transactionTimeUtc);
    if (!nullToAbsent || note != null) {
      map['note'] = Variable<String>(note);
    }
    if (!nullToAbsent || linkedCalendarEventId != null) {
      map['linked_calendar_event_id'] = Variable<String>(linkedCalendarEventId);
    }
    if (!nullToAbsent || linkedTaskId != null) {
      map['linked_task_id'] = Variable<String>(linkedTaskId);
    }
    map['created_at_utc'] = Variable<int>(createdAtUtc);
    return map;
  }

  MoneyTransactionsCompanion toCompanion(bool nullToAbsent) {
    return MoneyTransactionsCompanion(
      id: Value(id),
      accountId: Value(accountId),
      toAccountId: toAccountId == null && nullToAbsent
          ? const Value.absent()
          : Value(toAccountId),
      categoryId: categoryId == null && nullToAbsent
          ? const Value.absent()
          : Value(categoryId),
      amountPaise: Value(amountPaise),
      type: Value(type),
      transactionTimeUtc: Value(transactionTimeUtc),
      note: note == null && nullToAbsent ? const Value.absent() : Value(note),
      linkedCalendarEventId: linkedCalendarEventId == null && nullToAbsent
          ? const Value.absent()
          : Value(linkedCalendarEventId),
      linkedTaskId: linkedTaskId == null && nullToAbsent
          ? const Value.absent()
          : Value(linkedTaskId),
      createdAtUtc: Value(createdAtUtc),
    );
  }

  factory MoneyTransactionEntry.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return MoneyTransactionEntry(
      id: serializer.fromJson<String>(json['id']),
      accountId: serializer.fromJson<String>(json['accountId']),
      toAccountId: serializer.fromJson<String?>(json['toAccountId']),
      categoryId: serializer.fromJson<String?>(json['categoryId']),
      amountPaise: serializer.fromJson<int>(json['amountPaise']),
      type: serializer.fromJson<String>(json['type']),
      transactionTimeUtc: serializer.fromJson<int>(json['transactionTimeUtc']),
      note: serializer.fromJson<String?>(json['note']),
      linkedCalendarEventId: serializer.fromJson<String?>(
        json['linkedCalendarEventId'],
      ),
      linkedTaskId: serializer.fromJson<String?>(json['linkedTaskId']),
      createdAtUtc: serializer.fromJson<int>(json['createdAtUtc']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'accountId': serializer.toJson<String>(accountId),
      'toAccountId': serializer.toJson<String?>(toAccountId),
      'categoryId': serializer.toJson<String?>(categoryId),
      'amountPaise': serializer.toJson<int>(amountPaise),
      'type': serializer.toJson<String>(type),
      'transactionTimeUtc': serializer.toJson<int>(transactionTimeUtc),
      'note': serializer.toJson<String?>(note),
      'linkedCalendarEventId': serializer.toJson<String?>(
        linkedCalendarEventId,
      ),
      'linkedTaskId': serializer.toJson<String?>(linkedTaskId),
      'createdAtUtc': serializer.toJson<int>(createdAtUtc),
    };
  }

  MoneyTransactionEntry copyWith({
    String? id,
    String? accountId,
    Value<String?> toAccountId = const Value.absent(),
    Value<String?> categoryId = const Value.absent(),
    int? amountPaise,
    String? type,
    int? transactionTimeUtc,
    Value<String?> note = const Value.absent(),
    Value<String?> linkedCalendarEventId = const Value.absent(),
    Value<String?> linkedTaskId = const Value.absent(),
    int? createdAtUtc,
  }) => MoneyTransactionEntry(
    id: id ?? this.id,
    accountId: accountId ?? this.accountId,
    toAccountId: toAccountId.present ? toAccountId.value : this.toAccountId,
    categoryId: categoryId.present ? categoryId.value : this.categoryId,
    amountPaise: amountPaise ?? this.amountPaise,
    type: type ?? this.type,
    transactionTimeUtc: transactionTimeUtc ?? this.transactionTimeUtc,
    note: note.present ? note.value : this.note,
    linkedCalendarEventId: linkedCalendarEventId.present
        ? linkedCalendarEventId.value
        : this.linkedCalendarEventId,
    linkedTaskId: linkedTaskId.present ? linkedTaskId.value : this.linkedTaskId,
    createdAtUtc: createdAtUtc ?? this.createdAtUtc,
  );
  MoneyTransactionEntry copyWithCompanion(MoneyTransactionsCompanion data) {
    return MoneyTransactionEntry(
      id: data.id.present ? data.id.value : this.id,
      accountId: data.accountId.present ? data.accountId.value : this.accountId,
      toAccountId: data.toAccountId.present
          ? data.toAccountId.value
          : this.toAccountId,
      categoryId: data.categoryId.present
          ? data.categoryId.value
          : this.categoryId,
      amountPaise: data.amountPaise.present
          ? data.amountPaise.value
          : this.amountPaise,
      type: data.type.present ? data.type.value : this.type,
      transactionTimeUtc: data.transactionTimeUtc.present
          ? data.transactionTimeUtc.value
          : this.transactionTimeUtc,
      note: data.note.present ? data.note.value : this.note,
      linkedCalendarEventId: data.linkedCalendarEventId.present
          ? data.linkedCalendarEventId.value
          : this.linkedCalendarEventId,
      linkedTaskId: data.linkedTaskId.present
          ? data.linkedTaskId.value
          : this.linkedTaskId,
      createdAtUtc: data.createdAtUtc.present
          ? data.createdAtUtc.value
          : this.createdAtUtc,
    );
  }

  @override
  String toString() {
    return (StringBuffer('MoneyTransactionEntry(')
          ..write('id: $id, ')
          ..write('accountId: $accountId, ')
          ..write('toAccountId: $toAccountId, ')
          ..write('categoryId: $categoryId, ')
          ..write('amountPaise: $amountPaise, ')
          ..write('type: $type, ')
          ..write('transactionTimeUtc: $transactionTimeUtc, ')
          ..write('note: $note, ')
          ..write('linkedCalendarEventId: $linkedCalendarEventId, ')
          ..write('linkedTaskId: $linkedTaskId, ')
          ..write('createdAtUtc: $createdAtUtc')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
    id,
    accountId,
    toAccountId,
    categoryId,
    amountPaise,
    type,
    transactionTimeUtc,
    note,
    linkedCalendarEventId,
    linkedTaskId,
    createdAtUtc,
  );
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is MoneyTransactionEntry &&
          other.id == this.id &&
          other.accountId == this.accountId &&
          other.toAccountId == this.toAccountId &&
          other.categoryId == this.categoryId &&
          other.amountPaise == this.amountPaise &&
          other.type == this.type &&
          other.transactionTimeUtc == this.transactionTimeUtc &&
          other.note == this.note &&
          other.linkedCalendarEventId == this.linkedCalendarEventId &&
          other.linkedTaskId == this.linkedTaskId &&
          other.createdAtUtc == this.createdAtUtc);
}

class MoneyTransactionsCompanion
    extends UpdateCompanion<MoneyTransactionEntry> {
  final Value<String> id;
  final Value<String> accountId;
  final Value<String?> toAccountId;
  final Value<String?> categoryId;
  final Value<int> amountPaise;
  final Value<String> type;
  final Value<int> transactionTimeUtc;
  final Value<String?> note;
  final Value<String?> linkedCalendarEventId;
  final Value<String?> linkedTaskId;
  final Value<int> createdAtUtc;
  final Value<int> rowid;
  const MoneyTransactionsCompanion({
    this.id = const Value.absent(),
    this.accountId = const Value.absent(),
    this.toAccountId = const Value.absent(),
    this.categoryId = const Value.absent(),
    this.amountPaise = const Value.absent(),
    this.type = const Value.absent(),
    this.transactionTimeUtc = const Value.absent(),
    this.note = const Value.absent(),
    this.linkedCalendarEventId = const Value.absent(),
    this.linkedTaskId = const Value.absent(),
    this.createdAtUtc = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  MoneyTransactionsCompanion.insert({
    required String id,
    required String accountId,
    this.toAccountId = const Value.absent(),
    this.categoryId = const Value.absent(),
    required int amountPaise,
    this.type = const Value.absent(),
    required int transactionTimeUtc,
    this.note = const Value.absent(),
    this.linkedCalendarEventId = const Value.absent(),
    this.linkedTaskId = const Value.absent(),
    required int createdAtUtc,
    this.rowid = const Value.absent(),
  }) : id = Value(id),
       accountId = Value(accountId),
       amountPaise = Value(amountPaise),
       transactionTimeUtc = Value(transactionTimeUtc),
       createdAtUtc = Value(createdAtUtc);
  static Insertable<MoneyTransactionEntry> custom({
    Expression<String>? id,
    Expression<String>? accountId,
    Expression<String>? toAccountId,
    Expression<String>? categoryId,
    Expression<int>? amountPaise,
    Expression<String>? type,
    Expression<int>? transactionTimeUtc,
    Expression<String>? note,
    Expression<String>? linkedCalendarEventId,
    Expression<String>? linkedTaskId,
    Expression<int>? createdAtUtc,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (accountId != null) 'account_id': accountId,
      if (toAccountId != null) 'to_account_id': toAccountId,
      if (categoryId != null) 'category_id': categoryId,
      if (amountPaise != null) 'amount_paise': amountPaise,
      if (type != null) 'type': type,
      if (transactionTimeUtc != null)
        'transaction_time_utc': transactionTimeUtc,
      if (note != null) 'note': note,
      if (linkedCalendarEventId != null)
        'linked_calendar_event_id': linkedCalendarEventId,
      if (linkedTaskId != null) 'linked_task_id': linkedTaskId,
      if (createdAtUtc != null) 'created_at_utc': createdAtUtc,
      if (rowid != null) 'rowid': rowid,
    });
  }

  MoneyTransactionsCompanion copyWith({
    Value<String>? id,
    Value<String>? accountId,
    Value<String?>? toAccountId,
    Value<String?>? categoryId,
    Value<int>? amountPaise,
    Value<String>? type,
    Value<int>? transactionTimeUtc,
    Value<String?>? note,
    Value<String?>? linkedCalendarEventId,
    Value<String?>? linkedTaskId,
    Value<int>? createdAtUtc,
    Value<int>? rowid,
  }) {
    return MoneyTransactionsCompanion(
      id: id ?? this.id,
      accountId: accountId ?? this.accountId,
      toAccountId: toAccountId ?? this.toAccountId,
      categoryId: categoryId ?? this.categoryId,
      amountPaise: amountPaise ?? this.amountPaise,
      type: type ?? this.type,
      transactionTimeUtc: transactionTimeUtc ?? this.transactionTimeUtc,
      note: note ?? this.note,
      linkedCalendarEventId:
          linkedCalendarEventId ?? this.linkedCalendarEventId,
      linkedTaskId: linkedTaskId ?? this.linkedTaskId,
      createdAtUtc: createdAtUtc ?? this.createdAtUtc,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (accountId.present) {
      map['account_id'] = Variable<String>(accountId.value);
    }
    if (toAccountId.present) {
      map['to_account_id'] = Variable<String>(toAccountId.value);
    }
    if (categoryId.present) {
      map['category_id'] = Variable<String>(categoryId.value);
    }
    if (amountPaise.present) {
      map['amount_paise'] = Variable<int>(amountPaise.value);
    }
    if (type.present) {
      map['type'] = Variable<String>(type.value);
    }
    if (transactionTimeUtc.present) {
      map['transaction_time_utc'] = Variable<int>(transactionTimeUtc.value);
    }
    if (note.present) {
      map['note'] = Variable<String>(note.value);
    }
    if (linkedCalendarEventId.present) {
      map['linked_calendar_event_id'] = Variable<String>(
        linkedCalendarEventId.value,
      );
    }
    if (linkedTaskId.present) {
      map['linked_task_id'] = Variable<String>(linkedTaskId.value);
    }
    if (createdAtUtc.present) {
      map['created_at_utc'] = Variable<int>(createdAtUtc.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('MoneyTransactionsCompanion(')
          ..write('id: $id, ')
          ..write('accountId: $accountId, ')
          ..write('toAccountId: $toAccountId, ')
          ..write('categoryId: $categoryId, ')
          ..write('amountPaise: $amountPaise, ')
          ..write('type: $type, ')
          ..write('transactionTimeUtc: $transactionTimeUtc, ')
          ..write('note: $note, ')
          ..write('linkedCalendarEventId: $linkedCalendarEventId, ')
          ..write('linkedTaskId: $linkedTaskId, ')
          ..write('createdAtUtc: $createdAtUtc, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $MoneyBudgetsTable extends MoneyBudgets
    with TableInfo<$MoneyBudgetsTable, MoneyBudgetEntry> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $MoneyBudgetsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _categoryIdMeta = const VerificationMeta(
    'categoryId',
  );
  @override
  late final GeneratedColumn<String> categoryId = GeneratedColumn<String>(
    'category_id',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'REFERENCES money_categories (id) ON DELETE CASCADE',
    ),
  );
  static const VerificationMeta _amountPaiseMeta = const VerificationMeta(
    'amountPaise',
  );
  @override
  late final GeneratedColumn<int> amountPaise = GeneratedColumn<int>(
    'amount_paise',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _periodMeta = const VerificationMeta('period');
  @override
  late final GeneratedColumn<String> period = GeneratedColumn<String>(
    'period',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
    defaultValue: const Constant('monthly'),
  );
  @override
  List<GeneratedColumn> get $columns => [id, categoryId, amountPaise, period];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'money_budgets';
  @override
  VerificationContext validateIntegrity(
    Insertable<MoneyBudgetEntry> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('category_id')) {
      context.handle(
        _categoryIdMeta,
        categoryId.isAcceptableOrUnknown(data['category_id']!, _categoryIdMeta),
      );
    }
    if (data.containsKey('amount_paise')) {
      context.handle(
        _amountPaiseMeta,
        amountPaise.isAcceptableOrUnknown(
          data['amount_paise']!,
          _amountPaiseMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_amountPaiseMeta);
    }
    if (data.containsKey('period')) {
      context.handle(
        _periodMeta,
        period.isAcceptableOrUnknown(data['period']!, _periodMeta),
      );
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  MoneyBudgetEntry map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return MoneyBudgetEntry(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id'],
      )!,
      categoryId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}category_id'],
      ),
      amountPaise: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}amount_paise'],
      )!,
      period: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}period'],
      )!,
    );
  }

  @override
  $MoneyBudgetsTable createAlias(String alias) {
    return $MoneyBudgetsTable(attachedDatabase, alias);
  }
}

class MoneyBudgetEntry extends DataClass
    implements Insertable<MoneyBudgetEntry> {
  final String id;
  final String? categoryId;
  final int amountPaise;
  final String period;
  const MoneyBudgetEntry({
    required this.id,
    this.categoryId,
    required this.amountPaise,
    required this.period,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    if (!nullToAbsent || categoryId != null) {
      map['category_id'] = Variable<String>(categoryId);
    }
    map['amount_paise'] = Variable<int>(amountPaise);
    map['period'] = Variable<String>(period);
    return map;
  }

  MoneyBudgetsCompanion toCompanion(bool nullToAbsent) {
    return MoneyBudgetsCompanion(
      id: Value(id),
      categoryId: categoryId == null && nullToAbsent
          ? const Value.absent()
          : Value(categoryId),
      amountPaise: Value(amountPaise),
      period: Value(period),
    );
  }

  factory MoneyBudgetEntry.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return MoneyBudgetEntry(
      id: serializer.fromJson<String>(json['id']),
      categoryId: serializer.fromJson<String?>(json['categoryId']),
      amountPaise: serializer.fromJson<int>(json['amountPaise']),
      period: serializer.fromJson<String>(json['period']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'categoryId': serializer.toJson<String?>(categoryId),
      'amountPaise': serializer.toJson<int>(amountPaise),
      'period': serializer.toJson<String>(period),
    };
  }

  MoneyBudgetEntry copyWith({
    String? id,
    Value<String?> categoryId = const Value.absent(),
    int? amountPaise,
    String? period,
  }) => MoneyBudgetEntry(
    id: id ?? this.id,
    categoryId: categoryId.present ? categoryId.value : this.categoryId,
    amountPaise: amountPaise ?? this.amountPaise,
    period: period ?? this.period,
  );
  MoneyBudgetEntry copyWithCompanion(MoneyBudgetsCompanion data) {
    return MoneyBudgetEntry(
      id: data.id.present ? data.id.value : this.id,
      categoryId: data.categoryId.present
          ? data.categoryId.value
          : this.categoryId,
      amountPaise: data.amountPaise.present
          ? data.amountPaise.value
          : this.amountPaise,
      period: data.period.present ? data.period.value : this.period,
    );
  }

  @override
  String toString() {
    return (StringBuffer('MoneyBudgetEntry(')
          ..write('id: $id, ')
          ..write('categoryId: $categoryId, ')
          ..write('amountPaise: $amountPaise, ')
          ..write('period: $period')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(id, categoryId, amountPaise, period);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is MoneyBudgetEntry &&
          other.id == this.id &&
          other.categoryId == this.categoryId &&
          other.amountPaise == this.amountPaise &&
          other.period == this.period);
}

class MoneyBudgetsCompanion extends UpdateCompanion<MoneyBudgetEntry> {
  final Value<String> id;
  final Value<String?> categoryId;
  final Value<int> amountPaise;
  final Value<String> period;
  final Value<int> rowid;
  const MoneyBudgetsCompanion({
    this.id = const Value.absent(),
    this.categoryId = const Value.absent(),
    this.amountPaise = const Value.absent(),
    this.period = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  MoneyBudgetsCompanion.insert({
    required String id,
    this.categoryId = const Value.absent(),
    required int amountPaise,
    this.period = const Value.absent(),
    this.rowid = const Value.absent(),
  }) : id = Value(id),
       amountPaise = Value(amountPaise);
  static Insertable<MoneyBudgetEntry> custom({
    Expression<String>? id,
    Expression<String>? categoryId,
    Expression<int>? amountPaise,
    Expression<String>? period,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (categoryId != null) 'category_id': categoryId,
      if (amountPaise != null) 'amount_paise': amountPaise,
      if (period != null) 'period': period,
      if (rowid != null) 'rowid': rowid,
    });
  }

  MoneyBudgetsCompanion copyWith({
    Value<String>? id,
    Value<String?>? categoryId,
    Value<int>? amountPaise,
    Value<String>? period,
    Value<int>? rowid,
  }) {
    return MoneyBudgetsCompanion(
      id: id ?? this.id,
      categoryId: categoryId ?? this.categoryId,
      amountPaise: amountPaise ?? this.amountPaise,
      period: period ?? this.period,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (categoryId.present) {
      map['category_id'] = Variable<String>(categoryId.value);
    }
    if (amountPaise.present) {
      map['amount_paise'] = Variable<int>(amountPaise.value);
    }
    if (period.present) {
      map['period'] = Variable<String>(period.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('MoneyBudgetsCompanion(')
          ..write('id: $id, ')
          ..write('categoryId: $categoryId, ')
          ..write('amountPaise: $amountPaise, ')
          ..write('period: $period, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $SavingsGoalsTable extends SavingsGoals
    with TableInfo<$SavingsGoalsTable, SavingsGoalEntry> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $SavingsGoalsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _nameMeta = const VerificationMeta('name');
  @override
  late final GeneratedColumn<String> name = GeneratedColumn<String>(
    'name',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _targetAmountPaiseMeta = const VerificationMeta(
    'targetAmountPaise',
  );
  @override
  late final GeneratedColumn<int> targetAmountPaise = GeneratedColumn<int>(
    'target_amount_paise',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _savedAmountPaiseMeta = const VerificationMeta(
    'savedAmountPaise',
  );
  @override
  late final GeneratedColumn<int> savedAmountPaise = GeneratedColumn<int>(
    'saved_amount_paise',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: false,
    defaultValue: const Constant(0),
  );
  static const VerificationMeta _targetDateUtcMeta = const VerificationMeta(
    'targetDateUtc',
  );
  @override
  late final GeneratedColumn<int> targetDateUtc = GeneratedColumn<int>(
    'target_date_utc',
    aliasedName,
    true,
    type: DriftSqlType.int,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _colorValueMeta = const VerificationMeta(
    'colorValue',
  );
  @override
  late final GeneratedColumn<int> colorValue = GeneratedColumn<int>(
    'color_value',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: false,
    defaultValue: const Constant(0xFF10B981),
  );
  @override
  List<GeneratedColumn> get $columns => [
    id,
    name,
    targetAmountPaise,
    savedAmountPaise,
    targetDateUtc,
    colorValue,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'savings_goals';
  @override
  VerificationContext validateIntegrity(
    Insertable<SavingsGoalEntry> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('name')) {
      context.handle(
        _nameMeta,
        name.isAcceptableOrUnknown(data['name']!, _nameMeta),
      );
    } else if (isInserting) {
      context.missing(_nameMeta);
    }
    if (data.containsKey('target_amount_paise')) {
      context.handle(
        _targetAmountPaiseMeta,
        targetAmountPaise.isAcceptableOrUnknown(
          data['target_amount_paise']!,
          _targetAmountPaiseMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_targetAmountPaiseMeta);
    }
    if (data.containsKey('saved_amount_paise')) {
      context.handle(
        _savedAmountPaiseMeta,
        savedAmountPaise.isAcceptableOrUnknown(
          data['saved_amount_paise']!,
          _savedAmountPaiseMeta,
        ),
      );
    }
    if (data.containsKey('target_date_utc')) {
      context.handle(
        _targetDateUtcMeta,
        targetDateUtc.isAcceptableOrUnknown(
          data['target_date_utc']!,
          _targetDateUtcMeta,
        ),
      );
    }
    if (data.containsKey('color_value')) {
      context.handle(
        _colorValueMeta,
        colorValue.isAcceptableOrUnknown(data['color_value']!, _colorValueMeta),
      );
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  SavingsGoalEntry map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return SavingsGoalEntry(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id'],
      )!,
      name: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}name'],
      )!,
      targetAmountPaise: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}target_amount_paise'],
      )!,
      savedAmountPaise: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}saved_amount_paise'],
      )!,
      targetDateUtc: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}target_date_utc'],
      ),
      colorValue: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}color_value'],
      )!,
    );
  }

  @override
  $SavingsGoalsTable createAlias(String alias) {
    return $SavingsGoalsTable(attachedDatabase, alias);
  }
}

class SavingsGoalEntry extends DataClass
    implements Insertable<SavingsGoalEntry> {
  final String id;
  final String name;
  final int targetAmountPaise;
  final int savedAmountPaise;
  final int? targetDateUtc;
  final int colorValue;
  const SavingsGoalEntry({
    required this.id,
    required this.name,
    required this.targetAmountPaise,
    required this.savedAmountPaise,
    this.targetDateUtc,
    required this.colorValue,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['name'] = Variable<String>(name);
    map['target_amount_paise'] = Variable<int>(targetAmountPaise);
    map['saved_amount_paise'] = Variable<int>(savedAmountPaise);
    if (!nullToAbsent || targetDateUtc != null) {
      map['target_date_utc'] = Variable<int>(targetDateUtc);
    }
    map['color_value'] = Variable<int>(colorValue);
    return map;
  }

  SavingsGoalsCompanion toCompanion(bool nullToAbsent) {
    return SavingsGoalsCompanion(
      id: Value(id),
      name: Value(name),
      targetAmountPaise: Value(targetAmountPaise),
      savedAmountPaise: Value(savedAmountPaise),
      targetDateUtc: targetDateUtc == null && nullToAbsent
          ? const Value.absent()
          : Value(targetDateUtc),
      colorValue: Value(colorValue),
    );
  }

  factory SavingsGoalEntry.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return SavingsGoalEntry(
      id: serializer.fromJson<String>(json['id']),
      name: serializer.fromJson<String>(json['name']),
      targetAmountPaise: serializer.fromJson<int>(json['targetAmountPaise']),
      savedAmountPaise: serializer.fromJson<int>(json['savedAmountPaise']),
      targetDateUtc: serializer.fromJson<int?>(json['targetDateUtc']),
      colorValue: serializer.fromJson<int>(json['colorValue']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'name': serializer.toJson<String>(name),
      'targetAmountPaise': serializer.toJson<int>(targetAmountPaise),
      'savedAmountPaise': serializer.toJson<int>(savedAmountPaise),
      'targetDateUtc': serializer.toJson<int?>(targetDateUtc),
      'colorValue': serializer.toJson<int>(colorValue),
    };
  }

  SavingsGoalEntry copyWith({
    String? id,
    String? name,
    int? targetAmountPaise,
    int? savedAmountPaise,
    Value<int?> targetDateUtc = const Value.absent(),
    int? colorValue,
  }) => SavingsGoalEntry(
    id: id ?? this.id,
    name: name ?? this.name,
    targetAmountPaise: targetAmountPaise ?? this.targetAmountPaise,
    savedAmountPaise: savedAmountPaise ?? this.savedAmountPaise,
    targetDateUtc: targetDateUtc.present
        ? targetDateUtc.value
        : this.targetDateUtc,
    colorValue: colorValue ?? this.colorValue,
  );
  SavingsGoalEntry copyWithCompanion(SavingsGoalsCompanion data) {
    return SavingsGoalEntry(
      id: data.id.present ? data.id.value : this.id,
      name: data.name.present ? data.name.value : this.name,
      targetAmountPaise: data.targetAmountPaise.present
          ? data.targetAmountPaise.value
          : this.targetAmountPaise,
      savedAmountPaise: data.savedAmountPaise.present
          ? data.savedAmountPaise.value
          : this.savedAmountPaise,
      targetDateUtc: data.targetDateUtc.present
          ? data.targetDateUtc.value
          : this.targetDateUtc,
      colorValue: data.colorValue.present
          ? data.colorValue.value
          : this.colorValue,
    );
  }

  @override
  String toString() {
    return (StringBuffer('SavingsGoalEntry(')
          ..write('id: $id, ')
          ..write('name: $name, ')
          ..write('targetAmountPaise: $targetAmountPaise, ')
          ..write('savedAmountPaise: $savedAmountPaise, ')
          ..write('targetDateUtc: $targetDateUtc, ')
          ..write('colorValue: $colorValue')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
    id,
    name,
    targetAmountPaise,
    savedAmountPaise,
    targetDateUtc,
    colorValue,
  );
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is SavingsGoalEntry &&
          other.id == this.id &&
          other.name == this.name &&
          other.targetAmountPaise == this.targetAmountPaise &&
          other.savedAmountPaise == this.savedAmountPaise &&
          other.targetDateUtc == this.targetDateUtc &&
          other.colorValue == this.colorValue);
}

class SavingsGoalsCompanion extends UpdateCompanion<SavingsGoalEntry> {
  final Value<String> id;
  final Value<String> name;
  final Value<int> targetAmountPaise;
  final Value<int> savedAmountPaise;
  final Value<int?> targetDateUtc;
  final Value<int> colorValue;
  final Value<int> rowid;
  const SavingsGoalsCompanion({
    this.id = const Value.absent(),
    this.name = const Value.absent(),
    this.targetAmountPaise = const Value.absent(),
    this.savedAmountPaise = const Value.absent(),
    this.targetDateUtc = const Value.absent(),
    this.colorValue = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  SavingsGoalsCompanion.insert({
    required String id,
    required String name,
    required int targetAmountPaise,
    this.savedAmountPaise = const Value.absent(),
    this.targetDateUtc = const Value.absent(),
    this.colorValue = const Value.absent(),
    this.rowid = const Value.absent(),
  }) : id = Value(id),
       name = Value(name),
       targetAmountPaise = Value(targetAmountPaise);
  static Insertable<SavingsGoalEntry> custom({
    Expression<String>? id,
    Expression<String>? name,
    Expression<int>? targetAmountPaise,
    Expression<int>? savedAmountPaise,
    Expression<int>? targetDateUtc,
    Expression<int>? colorValue,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (name != null) 'name': name,
      if (targetAmountPaise != null) 'target_amount_paise': targetAmountPaise,
      if (savedAmountPaise != null) 'saved_amount_paise': savedAmountPaise,
      if (targetDateUtc != null) 'target_date_utc': targetDateUtc,
      if (colorValue != null) 'color_value': colorValue,
      if (rowid != null) 'rowid': rowid,
    });
  }

  SavingsGoalsCompanion copyWith({
    Value<String>? id,
    Value<String>? name,
    Value<int>? targetAmountPaise,
    Value<int>? savedAmountPaise,
    Value<int?>? targetDateUtc,
    Value<int>? colorValue,
    Value<int>? rowid,
  }) {
    return SavingsGoalsCompanion(
      id: id ?? this.id,
      name: name ?? this.name,
      targetAmountPaise: targetAmountPaise ?? this.targetAmountPaise,
      savedAmountPaise: savedAmountPaise ?? this.savedAmountPaise,
      targetDateUtc: targetDateUtc ?? this.targetDateUtc,
      colorValue: colorValue ?? this.colorValue,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (name.present) {
      map['name'] = Variable<String>(name.value);
    }
    if (targetAmountPaise.present) {
      map['target_amount_paise'] = Variable<int>(targetAmountPaise.value);
    }
    if (savedAmountPaise.present) {
      map['saved_amount_paise'] = Variable<int>(savedAmountPaise.value);
    }
    if (targetDateUtc.present) {
      map['target_date_utc'] = Variable<int>(targetDateUtc.value);
    }
    if (colorValue.present) {
      map['color_value'] = Variable<int>(colorValue.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('SavingsGoalsCompanion(')
          ..write('id: $id, ')
          ..write('name: $name, ')
          ..write('targetAmountPaise: $targetAmountPaise, ')
          ..write('savedAmountPaise: $savedAmountPaise, ')
          ..write('targetDateUtc: $targetDateUtc, ')
          ..write('colorValue: $colorValue, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $DebtsTable extends Debts with TableInfo<$DebtsTable, DebtEntry> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $DebtsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _nameMeta = const VerificationMeta('name');
  @override
  late final GeneratedColumn<String> name = GeneratedColumn<String>(
    'name',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _amountPaiseMeta = const VerificationMeta(
    'amountPaise',
  );
  @override
  late final GeneratedColumn<int> amountPaise = GeneratedColumn<int>(
    'amount_paise',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _repaidAmountPaiseMeta = const VerificationMeta(
    'repaidAmountPaise',
  );
  @override
  late final GeneratedColumn<int> repaidAmountPaise = GeneratedColumn<int>(
    'repaid_amount_paise',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: false,
    defaultValue: const Constant(0),
  );
  static const VerificationMeta _isOwedToMeMeta = const VerificationMeta(
    'isOwedToMe',
  );
  @override
  late final GeneratedColumn<bool> isOwedToMe = GeneratedColumn<bool>(
    'is_owed_to_me',
    aliasedName,
    false,
    type: DriftSqlType.bool,
    requiredDuringInsert: true,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'CHECK ("is_owed_to_me" IN (0, 1))',
    ),
  );
  static const VerificationMeta _dueDateUtcMeta = const VerificationMeta(
    'dueDateUtc',
  );
  @override
  late final GeneratedColumn<int> dueDateUtc = GeneratedColumn<int>(
    'due_date_utc',
    aliasedName,
    true,
    type: DriftSqlType.int,
    requiredDuringInsert: false,
  );
  @override
  List<GeneratedColumn> get $columns => [
    id,
    name,
    amountPaise,
    repaidAmountPaise,
    isOwedToMe,
    dueDateUtc,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'debts';
  @override
  VerificationContext validateIntegrity(
    Insertable<DebtEntry> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('name')) {
      context.handle(
        _nameMeta,
        name.isAcceptableOrUnknown(data['name']!, _nameMeta),
      );
    } else if (isInserting) {
      context.missing(_nameMeta);
    }
    if (data.containsKey('amount_paise')) {
      context.handle(
        _amountPaiseMeta,
        amountPaise.isAcceptableOrUnknown(
          data['amount_paise']!,
          _amountPaiseMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_amountPaiseMeta);
    }
    if (data.containsKey('repaid_amount_paise')) {
      context.handle(
        _repaidAmountPaiseMeta,
        repaidAmountPaise.isAcceptableOrUnknown(
          data['repaid_amount_paise']!,
          _repaidAmountPaiseMeta,
        ),
      );
    }
    if (data.containsKey('is_owed_to_me')) {
      context.handle(
        _isOwedToMeMeta,
        isOwedToMe.isAcceptableOrUnknown(
          data['is_owed_to_me']!,
          _isOwedToMeMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_isOwedToMeMeta);
    }
    if (data.containsKey('due_date_utc')) {
      context.handle(
        _dueDateUtcMeta,
        dueDateUtc.isAcceptableOrUnknown(
          data['due_date_utc']!,
          _dueDateUtcMeta,
        ),
      );
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  DebtEntry map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return DebtEntry(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id'],
      )!,
      name: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}name'],
      )!,
      amountPaise: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}amount_paise'],
      )!,
      repaidAmountPaise: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}repaid_amount_paise'],
      )!,
      isOwedToMe: attachedDatabase.typeMapping.read(
        DriftSqlType.bool,
        data['${effectivePrefix}is_owed_to_me'],
      )!,
      dueDateUtc: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}due_date_utc'],
      ),
    );
  }

  @override
  $DebtsTable createAlias(String alias) {
    return $DebtsTable(attachedDatabase, alias);
  }
}

class DebtEntry extends DataClass implements Insertable<DebtEntry> {
  final String id;
  final String name;
  final int amountPaise;
  final int repaidAmountPaise;
  final bool isOwedToMe;
  final int? dueDateUtc;
  const DebtEntry({
    required this.id,
    required this.name,
    required this.amountPaise,
    required this.repaidAmountPaise,
    required this.isOwedToMe,
    this.dueDateUtc,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['name'] = Variable<String>(name);
    map['amount_paise'] = Variable<int>(amountPaise);
    map['repaid_amount_paise'] = Variable<int>(repaidAmountPaise);
    map['is_owed_to_me'] = Variable<bool>(isOwedToMe);
    if (!nullToAbsent || dueDateUtc != null) {
      map['due_date_utc'] = Variable<int>(dueDateUtc);
    }
    return map;
  }

  DebtsCompanion toCompanion(bool nullToAbsent) {
    return DebtsCompanion(
      id: Value(id),
      name: Value(name),
      amountPaise: Value(amountPaise),
      repaidAmountPaise: Value(repaidAmountPaise),
      isOwedToMe: Value(isOwedToMe),
      dueDateUtc: dueDateUtc == null && nullToAbsent
          ? const Value.absent()
          : Value(dueDateUtc),
    );
  }

  factory DebtEntry.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return DebtEntry(
      id: serializer.fromJson<String>(json['id']),
      name: serializer.fromJson<String>(json['name']),
      amountPaise: serializer.fromJson<int>(json['amountPaise']),
      repaidAmountPaise: serializer.fromJson<int>(json['repaidAmountPaise']),
      isOwedToMe: serializer.fromJson<bool>(json['isOwedToMe']),
      dueDateUtc: serializer.fromJson<int?>(json['dueDateUtc']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'name': serializer.toJson<String>(name),
      'amountPaise': serializer.toJson<int>(amountPaise),
      'repaidAmountPaise': serializer.toJson<int>(repaidAmountPaise),
      'isOwedToMe': serializer.toJson<bool>(isOwedToMe),
      'dueDateUtc': serializer.toJson<int?>(dueDateUtc),
    };
  }

  DebtEntry copyWith({
    String? id,
    String? name,
    int? amountPaise,
    int? repaidAmountPaise,
    bool? isOwedToMe,
    Value<int?> dueDateUtc = const Value.absent(),
  }) => DebtEntry(
    id: id ?? this.id,
    name: name ?? this.name,
    amountPaise: amountPaise ?? this.amountPaise,
    repaidAmountPaise: repaidAmountPaise ?? this.repaidAmountPaise,
    isOwedToMe: isOwedToMe ?? this.isOwedToMe,
    dueDateUtc: dueDateUtc.present ? dueDateUtc.value : this.dueDateUtc,
  );
  DebtEntry copyWithCompanion(DebtsCompanion data) {
    return DebtEntry(
      id: data.id.present ? data.id.value : this.id,
      name: data.name.present ? data.name.value : this.name,
      amountPaise: data.amountPaise.present
          ? data.amountPaise.value
          : this.amountPaise,
      repaidAmountPaise: data.repaidAmountPaise.present
          ? data.repaidAmountPaise.value
          : this.repaidAmountPaise,
      isOwedToMe: data.isOwedToMe.present
          ? data.isOwedToMe.value
          : this.isOwedToMe,
      dueDateUtc: data.dueDateUtc.present
          ? data.dueDateUtc.value
          : this.dueDateUtc,
    );
  }

  @override
  String toString() {
    return (StringBuffer('DebtEntry(')
          ..write('id: $id, ')
          ..write('name: $name, ')
          ..write('amountPaise: $amountPaise, ')
          ..write('repaidAmountPaise: $repaidAmountPaise, ')
          ..write('isOwedToMe: $isOwedToMe, ')
          ..write('dueDateUtc: $dueDateUtc')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
    id,
    name,
    amountPaise,
    repaidAmountPaise,
    isOwedToMe,
    dueDateUtc,
  );
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is DebtEntry &&
          other.id == this.id &&
          other.name == this.name &&
          other.amountPaise == this.amountPaise &&
          other.repaidAmountPaise == this.repaidAmountPaise &&
          other.isOwedToMe == this.isOwedToMe &&
          other.dueDateUtc == this.dueDateUtc);
}

class DebtsCompanion extends UpdateCompanion<DebtEntry> {
  final Value<String> id;
  final Value<String> name;
  final Value<int> amountPaise;
  final Value<int> repaidAmountPaise;
  final Value<bool> isOwedToMe;
  final Value<int?> dueDateUtc;
  final Value<int> rowid;
  const DebtsCompanion({
    this.id = const Value.absent(),
    this.name = const Value.absent(),
    this.amountPaise = const Value.absent(),
    this.repaidAmountPaise = const Value.absent(),
    this.isOwedToMe = const Value.absent(),
    this.dueDateUtc = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  DebtsCompanion.insert({
    required String id,
    required String name,
    required int amountPaise,
    this.repaidAmountPaise = const Value.absent(),
    required bool isOwedToMe,
    this.dueDateUtc = const Value.absent(),
    this.rowid = const Value.absent(),
  }) : id = Value(id),
       name = Value(name),
       amountPaise = Value(amountPaise),
       isOwedToMe = Value(isOwedToMe);
  static Insertable<DebtEntry> custom({
    Expression<String>? id,
    Expression<String>? name,
    Expression<int>? amountPaise,
    Expression<int>? repaidAmountPaise,
    Expression<bool>? isOwedToMe,
    Expression<int>? dueDateUtc,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (name != null) 'name': name,
      if (amountPaise != null) 'amount_paise': amountPaise,
      if (repaidAmountPaise != null) 'repaid_amount_paise': repaidAmountPaise,
      if (isOwedToMe != null) 'is_owed_to_me': isOwedToMe,
      if (dueDateUtc != null) 'due_date_utc': dueDateUtc,
      if (rowid != null) 'rowid': rowid,
    });
  }

  DebtsCompanion copyWith({
    Value<String>? id,
    Value<String>? name,
    Value<int>? amountPaise,
    Value<int>? repaidAmountPaise,
    Value<bool>? isOwedToMe,
    Value<int?>? dueDateUtc,
    Value<int>? rowid,
  }) {
    return DebtsCompanion(
      id: id ?? this.id,
      name: name ?? this.name,
      amountPaise: amountPaise ?? this.amountPaise,
      repaidAmountPaise: repaidAmountPaise ?? this.repaidAmountPaise,
      isOwedToMe: isOwedToMe ?? this.isOwedToMe,
      dueDateUtc: dueDateUtc ?? this.dueDateUtc,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (name.present) {
      map['name'] = Variable<String>(name.value);
    }
    if (amountPaise.present) {
      map['amount_paise'] = Variable<int>(amountPaise.value);
    }
    if (repaidAmountPaise.present) {
      map['repaid_amount_paise'] = Variable<int>(repaidAmountPaise.value);
    }
    if (isOwedToMe.present) {
      map['is_owed_to_me'] = Variable<bool>(isOwedToMe.value);
    }
    if (dueDateUtc.present) {
      map['due_date_utc'] = Variable<int>(dueDateUtc.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('DebtsCompanion(')
          ..write('id: $id, ')
          ..write('name: $name, ')
          ..write('amountPaise: $amountPaise, ')
          ..write('repaidAmountPaise: $repaidAmountPaise, ')
          ..write('isOwedToMe: $isOwedToMe, ')
          ..write('dueDateUtc: $dueDateUtc, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $RecurringTransactionsTable extends RecurringTransactions
    with TableInfo<$RecurringTransactionsTable, RecurringTransactionEntry> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $RecurringTransactionsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _accountIdMeta = const VerificationMeta(
    'accountId',
  );
  @override
  late final GeneratedColumn<String> accountId = GeneratedColumn<String>(
    'account_id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'REFERENCES money_accounts (id) ON DELETE CASCADE',
    ),
  );
  static const VerificationMeta _toAccountIdMeta = const VerificationMeta(
    'toAccountId',
  );
  @override
  late final GeneratedColumn<String> toAccountId = GeneratedColumn<String>(
    'to_account_id',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'REFERENCES money_accounts (id) ON DELETE CASCADE',
    ),
  );
  static const VerificationMeta _categoryIdMeta = const VerificationMeta(
    'categoryId',
  );
  @override
  late final GeneratedColumn<String> categoryId = GeneratedColumn<String>(
    'category_id',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'REFERENCES money_categories (id) ON DELETE SET NULL',
    ),
  );
  static const VerificationMeta _amountPaiseMeta = const VerificationMeta(
    'amountPaise',
  );
  @override
  late final GeneratedColumn<int> amountPaise = GeneratedColumn<int>(
    'amount_paise',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _typeMeta = const VerificationMeta('type');
  @override
  late final GeneratedColumn<String> type = GeneratedColumn<String>(
    'type',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _noteMeta = const VerificationMeta('note');
  @override
  late final GeneratedColumn<String> note = GeneratedColumn<String>(
    'note',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _recurrenceRuleMeta = const VerificationMeta(
    'recurrenceRule',
  );
  @override
  late final GeneratedColumn<String> recurrenceRule = GeneratedColumn<String>(
    'recurrence_rule',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _nextOccurrenceUtcMeta = const VerificationMeta(
    'nextOccurrenceUtc',
  );
  @override
  late final GeneratedColumn<int> nextOccurrenceUtc = GeneratedColumn<int>(
    'next_occurrence_utc',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _isActiveMeta = const VerificationMeta(
    'isActive',
  );
  @override
  late final GeneratedColumn<bool> isActive = GeneratedColumn<bool>(
    'is_active',
    aliasedName,
    false,
    type: DriftSqlType.bool,
    requiredDuringInsert: false,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'CHECK ("is_active" IN (0, 1))',
    ),
    defaultValue: const Constant(true),
  );
  @override
  List<GeneratedColumn> get $columns => [
    id,
    accountId,
    toAccountId,
    categoryId,
    amountPaise,
    type,
    note,
    recurrenceRule,
    nextOccurrenceUtc,
    isActive,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'recurring_transactions';
  @override
  VerificationContext validateIntegrity(
    Insertable<RecurringTransactionEntry> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('account_id')) {
      context.handle(
        _accountIdMeta,
        accountId.isAcceptableOrUnknown(data['account_id']!, _accountIdMeta),
      );
    } else if (isInserting) {
      context.missing(_accountIdMeta);
    }
    if (data.containsKey('to_account_id')) {
      context.handle(
        _toAccountIdMeta,
        toAccountId.isAcceptableOrUnknown(
          data['to_account_id']!,
          _toAccountIdMeta,
        ),
      );
    }
    if (data.containsKey('category_id')) {
      context.handle(
        _categoryIdMeta,
        categoryId.isAcceptableOrUnknown(data['category_id']!, _categoryIdMeta),
      );
    }
    if (data.containsKey('amount_paise')) {
      context.handle(
        _amountPaiseMeta,
        amountPaise.isAcceptableOrUnknown(
          data['amount_paise']!,
          _amountPaiseMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_amountPaiseMeta);
    }
    if (data.containsKey('type')) {
      context.handle(
        _typeMeta,
        type.isAcceptableOrUnknown(data['type']!, _typeMeta),
      );
    } else if (isInserting) {
      context.missing(_typeMeta);
    }
    if (data.containsKey('note')) {
      context.handle(
        _noteMeta,
        note.isAcceptableOrUnknown(data['note']!, _noteMeta),
      );
    }
    if (data.containsKey('recurrence_rule')) {
      context.handle(
        _recurrenceRuleMeta,
        recurrenceRule.isAcceptableOrUnknown(
          data['recurrence_rule']!,
          _recurrenceRuleMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_recurrenceRuleMeta);
    }
    if (data.containsKey('next_occurrence_utc')) {
      context.handle(
        _nextOccurrenceUtcMeta,
        nextOccurrenceUtc.isAcceptableOrUnknown(
          data['next_occurrence_utc']!,
          _nextOccurrenceUtcMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_nextOccurrenceUtcMeta);
    }
    if (data.containsKey('is_active')) {
      context.handle(
        _isActiveMeta,
        isActive.isAcceptableOrUnknown(data['is_active']!, _isActiveMeta),
      );
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  RecurringTransactionEntry map(
    Map<String, dynamic> data, {
    String? tablePrefix,
  }) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return RecurringTransactionEntry(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id'],
      )!,
      accountId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}account_id'],
      )!,
      toAccountId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}to_account_id'],
      ),
      categoryId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}category_id'],
      ),
      amountPaise: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}amount_paise'],
      )!,
      type: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}type'],
      )!,
      note: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}note'],
      ),
      recurrenceRule: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}recurrence_rule'],
      )!,
      nextOccurrenceUtc: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}next_occurrence_utc'],
      )!,
      isActive: attachedDatabase.typeMapping.read(
        DriftSqlType.bool,
        data['${effectivePrefix}is_active'],
      )!,
    );
  }

  @override
  $RecurringTransactionsTable createAlias(String alias) {
    return $RecurringTransactionsTable(attachedDatabase, alias);
  }
}

class RecurringTransactionEntry extends DataClass
    implements Insertable<RecurringTransactionEntry> {
  final String id;
  final String accountId;
  final String? toAccountId;
  final String? categoryId;
  final int amountPaise;
  final String type;
  final String? note;
  final String recurrenceRule;
  final int nextOccurrenceUtc;
  final bool isActive;
  const RecurringTransactionEntry({
    required this.id,
    required this.accountId,
    this.toAccountId,
    this.categoryId,
    required this.amountPaise,
    required this.type,
    this.note,
    required this.recurrenceRule,
    required this.nextOccurrenceUtc,
    required this.isActive,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['account_id'] = Variable<String>(accountId);
    if (!nullToAbsent || toAccountId != null) {
      map['to_account_id'] = Variable<String>(toAccountId);
    }
    if (!nullToAbsent || categoryId != null) {
      map['category_id'] = Variable<String>(categoryId);
    }
    map['amount_paise'] = Variable<int>(amountPaise);
    map['type'] = Variable<String>(type);
    if (!nullToAbsent || note != null) {
      map['note'] = Variable<String>(note);
    }
    map['recurrence_rule'] = Variable<String>(recurrenceRule);
    map['next_occurrence_utc'] = Variable<int>(nextOccurrenceUtc);
    map['is_active'] = Variable<bool>(isActive);
    return map;
  }

  RecurringTransactionsCompanion toCompanion(bool nullToAbsent) {
    return RecurringTransactionsCompanion(
      id: Value(id),
      accountId: Value(accountId),
      toAccountId: toAccountId == null && nullToAbsent
          ? const Value.absent()
          : Value(toAccountId),
      categoryId: categoryId == null && nullToAbsent
          ? const Value.absent()
          : Value(categoryId),
      amountPaise: Value(amountPaise),
      type: Value(type),
      note: note == null && nullToAbsent ? const Value.absent() : Value(note),
      recurrenceRule: Value(recurrenceRule),
      nextOccurrenceUtc: Value(nextOccurrenceUtc),
      isActive: Value(isActive),
    );
  }

  factory RecurringTransactionEntry.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return RecurringTransactionEntry(
      id: serializer.fromJson<String>(json['id']),
      accountId: serializer.fromJson<String>(json['accountId']),
      toAccountId: serializer.fromJson<String?>(json['toAccountId']),
      categoryId: serializer.fromJson<String?>(json['categoryId']),
      amountPaise: serializer.fromJson<int>(json['amountPaise']),
      type: serializer.fromJson<String>(json['type']),
      note: serializer.fromJson<String?>(json['note']),
      recurrenceRule: serializer.fromJson<String>(json['recurrenceRule']),
      nextOccurrenceUtc: serializer.fromJson<int>(json['nextOccurrenceUtc']),
      isActive: serializer.fromJson<bool>(json['isActive']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'accountId': serializer.toJson<String>(accountId),
      'toAccountId': serializer.toJson<String?>(toAccountId),
      'categoryId': serializer.toJson<String?>(categoryId),
      'amountPaise': serializer.toJson<int>(amountPaise),
      'type': serializer.toJson<String>(type),
      'note': serializer.toJson<String?>(note),
      'recurrenceRule': serializer.toJson<String>(recurrenceRule),
      'nextOccurrenceUtc': serializer.toJson<int>(nextOccurrenceUtc),
      'isActive': serializer.toJson<bool>(isActive),
    };
  }

  RecurringTransactionEntry copyWith({
    String? id,
    String? accountId,
    Value<String?> toAccountId = const Value.absent(),
    Value<String?> categoryId = const Value.absent(),
    int? amountPaise,
    String? type,
    Value<String?> note = const Value.absent(),
    String? recurrenceRule,
    int? nextOccurrenceUtc,
    bool? isActive,
  }) => RecurringTransactionEntry(
    id: id ?? this.id,
    accountId: accountId ?? this.accountId,
    toAccountId: toAccountId.present ? toAccountId.value : this.toAccountId,
    categoryId: categoryId.present ? categoryId.value : this.categoryId,
    amountPaise: amountPaise ?? this.amountPaise,
    type: type ?? this.type,
    note: note.present ? note.value : this.note,
    recurrenceRule: recurrenceRule ?? this.recurrenceRule,
    nextOccurrenceUtc: nextOccurrenceUtc ?? this.nextOccurrenceUtc,
    isActive: isActive ?? this.isActive,
  );
  RecurringTransactionEntry copyWithCompanion(
    RecurringTransactionsCompanion data,
  ) {
    return RecurringTransactionEntry(
      id: data.id.present ? data.id.value : this.id,
      accountId: data.accountId.present ? data.accountId.value : this.accountId,
      toAccountId: data.toAccountId.present
          ? data.toAccountId.value
          : this.toAccountId,
      categoryId: data.categoryId.present
          ? data.categoryId.value
          : this.categoryId,
      amountPaise: data.amountPaise.present
          ? data.amountPaise.value
          : this.amountPaise,
      type: data.type.present ? data.type.value : this.type,
      note: data.note.present ? data.note.value : this.note,
      recurrenceRule: data.recurrenceRule.present
          ? data.recurrenceRule.value
          : this.recurrenceRule,
      nextOccurrenceUtc: data.nextOccurrenceUtc.present
          ? data.nextOccurrenceUtc.value
          : this.nextOccurrenceUtc,
      isActive: data.isActive.present ? data.isActive.value : this.isActive,
    );
  }

  @override
  String toString() {
    return (StringBuffer('RecurringTransactionEntry(')
          ..write('id: $id, ')
          ..write('accountId: $accountId, ')
          ..write('toAccountId: $toAccountId, ')
          ..write('categoryId: $categoryId, ')
          ..write('amountPaise: $amountPaise, ')
          ..write('type: $type, ')
          ..write('note: $note, ')
          ..write('recurrenceRule: $recurrenceRule, ')
          ..write('nextOccurrenceUtc: $nextOccurrenceUtc, ')
          ..write('isActive: $isActive')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
    id,
    accountId,
    toAccountId,
    categoryId,
    amountPaise,
    type,
    note,
    recurrenceRule,
    nextOccurrenceUtc,
    isActive,
  );
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is RecurringTransactionEntry &&
          other.id == this.id &&
          other.accountId == this.accountId &&
          other.toAccountId == this.toAccountId &&
          other.categoryId == this.categoryId &&
          other.amountPaise == this.amountPaise &&
          other.type == this.type &&
          other.note == this.note &&
          other.recurrenceRule == this.recurrenceRule &&
          other.nextOccurrenceUtc == this.nextOccurrenceUtc &&
          other.isActive == this.isActive);
}

class RecurringTransactionsCompanion
    extends UpdateCompanion<RecurringTransactionEntry> {
  final Value<String> id;
  final Value<String> accountId;
  final Value<String?> toAccountId;
  final Value<String?> categoryId;
  final Value<int> amountPaise;
  final Value<String> type;
  final Value<String?> note;
  final Value<String> recurrenceRule;
  final Value<int> nextOccurrenceUtc;
  final Value<bool> isActive;
  final Value<int> rowid;
  const RecurringTransactionsCompanion({
    this.id = const Value.absent(),
    this.accountId = const Value.absent(),
    this.toAccountId = const Value.absent(),
    this.categoryId = const Value.absent(),
    this.amountPaise = const Value.absent(),
    this.type = const Value.absent(),
    this.note = const Value.absent(),
    this.recurrenceRule = const Value.absent(),
    this.nextOccurrenceUtc = const Value.absent(),
    this.isActive = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  RecurringTransactionsCompanion.insert({
    required String id,
    required String accountId,
    this.toAccountId = const Value.absent(),
    this.categoryId = const Value.absent(),
    required int amountPaise,
    required String type,
    this.note = const Value.absent(),
    required String recurrenceRule,
    required int nextOccurrenceUtc,
    this.isActive = const Value.absent(),
    this.rowid = const Value.absent(),
  }) : id = Value(id),
       accountId = Value(accountId),
       amountPaise = Value(amountPaise),
       type = Value(type),
       recurrenceRule = Value(recurrenceRule),
       nextOccurrenceUtc = Value(nextOccurrenceUtc);
  static Insertable<RecurringTransactionEntry> custom({
    Expression<String>? id,
    Expression<String>? accountId,
    Expression<String>? toAccountId,
    Expression<String>? categoryId,
    Expression<int>? amountPaise,
    Expression<String>? type,
    Expression<String>? note,
    Expression<String>? recurrenceRule,
    Expression<int>? nextOccurrenceUtc,
    Expression<bool>? isActive,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (accountId != null) 'account_id': accountId,
      if (toAccountId != null) 'to_account_id': toAccountId,
      if (categoryId != null) 'category_id': categoryId,
      if (amountPaise != null) 'amount_paise': amountPaise,
      if (type != null) 'type': type,
      if (note != null) 'note': note,
      if (recurrenceRule != null) 'recurrence_rule': recurrenceRule,
      if (nextOccurrenceUtc != null) 'next_occurrence_utc': nextOccurrenceUtc,
      if (isActive != null) 'is_active': isActive,
      if (rowid != null) 'rowid': rowid,
    });
  }

  RecurringTransactionsCompanion copyWith({
    Value<String>? id,
    Value<String>? accountId,
    Value<String?>? toAccountId,
    Value<String?>? categoryId,
    Value<int>? amountPaise,
    Value<String>? type,
    Value<String?>? note,
    Value<String>? recurrenceRule,
    Value<int>? nextOccurrenceUtc,
    Value<bool>? isActive,
    Value<int>? rowid,
  }) {
    return RecurringTransactionsCompanion(
      id: id ?? this.id,
      accountId: accountId ?? this.accountId,
      toAccountId: toAccountId ?? this.toAccountId,
      categoryId: categoryId ?? this.categoryId,
      amountPaise: amountPaise ?? this.amountPaise,
      type: type ?? this.type,
      note: note ?? this.note,
      recurrenceRule: recurrenceRule ?? this.recurrenceRule,
      nextOccurrenceUtc: nextOccurrenceUtc ?? this.nextOccurrenceUtc,
      isActive: isActive ?? this.isActive,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (accountId.present) {
      map['account_id'] = Variable<String>(accountId.value);
    }
    if (toAccountId.present) {
      map['to_account_id'] = Variable<String>(toAccountId.value);
    }
    if (categoryId.present) {
      map['category_id'] = Variable<String>(categoryId.value);
    }
    if (amountPaise.present) {
      map['amount_paise'] = Variable<int>(amountPaise.value);
    }
    if (type.present) {
      map['type'] = Variable<String>(type.value);
    }
    if (note.present) {
      map['note'] = Variable<String>(note.value);
    }
    if (recurrenceRule.present) {
      map['recurrence_rule'] = Variable<String>(recurrenceRule.value);
    }
    if (nextOccurrenceUtc.present) {
      map['next_occurrence_utc'] = Variable<int>(nextOccurrenceUtc.value);
    }
    if (isActive.present) {
      map['is_active'] = Variable<bool>(isActive.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('RecurringTransactionsCompanion(')
          ..write('id: $id, ')
          ..write('accountId: $accountId, ')
          ..write('toAccountId: $toAccountId, ')
          ..write('categoryId: $categoryId, ')
          ..write('amountPaise: $amountPaise, ')
          ..write('type: $type, ')
          ..write('note: $note, ')
          ..write('recurrenceRule: $recurrenceRule, ')
          ..write('nextOccurrenceUtc: $nextOccurrenceUtc, ')
          ..write('isActive: $isActive, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $NoteLabelsTable extends NoteLabels
    with TableInfo<$NoteLabelsTable, NoteLabelEntry> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $NoteLabelsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _nameMeta = const VerificationMeta('name');
  @override
  late final GeneratedColumn<String> name = GeneratedColumn<String>(
    'name',
    aliasedName,
    false,
    additionalChecks: GeneratedColumn.checkTextLength(
      minTextLength: 1,
      maxTextLength: 64,
    ),
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _createdAtUtcMeta = const VerificationMeta(
    'createdAtUtc',
  );
  @override
  late final GeneratedColumn<int> createdAtUtc = GeneratedColumn<int>(
    'created_at_utc',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: true,
  );
  @override
  List<GeneratedColumn> get $columns => [id, name, createdAtUtc];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'note_labels';
  @override
  VerificationContext validateIntegrity(
    Insertable<NoteLabelEntry> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('name')) {
      context.handle(
        _nameMeta,
        name.isAcceptableOrUnknown(data['name']!, _nameMeta),
      );
    } else if (isInserting) {
      context.missing(_nameMeta);
    }
    if (data.containsKey('created_at_utc')) {
      context.handle(
        _createdAtUtcMeta,
        createdAtUtc.isAcceptableOrUnknown(
          data['created_at_utc']!,
          _createdAtUtcMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_createdAtUtcMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  NoteLabelEntry map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return NoteLabelEntry(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id'],
      )!,
      name: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}name'],
      )!,
      createdAtUtc: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}created_at_utc'],
      )!,
    );
  }

  @override
  $NoteLabelsTable createAlias(String alias) {
    return $NoteLabelsTable(attachedDatabase, alias);
  }
}

class NoteLabelEntry extends DataClass implements Insertable<NoteLabelEntry> {
  final String id;
  final String name;
  final int createdAtUtc;
  const NoteLabelEntry({
    required this.id,
    required this.name,
    required this.createdAtUtc,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['name'] = Variable<String>(name);
    map['created_at_utc'] = Variable<int>(createdAtUtc);
    return map;
  }

  NoteLabelsCompanion toCompanion(bool nullToAbsent) {
    return NoteLabelsCompanion(
      id: Value(id),
      name: Value(name),
      createdAtUtc: Value(createdAtUtc),
    );
  }

  factory NoteLabelEntry.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return NoteLabelEntry(
      id: serializer.fromJson<String>(json['id']),
      name: serializer.fromJson<String>(json['name']),
      createdAtUtc: serializer.fromJson<int>(json['createdAtUtc']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'name': serializer.toJson<String>(name),
      'createdAtUtc': serializer.toJson<int>(createdAtUtc),
    };
  }

  NoteLabelEntry copyWith({String? id, String? name, int? createdAtUtc}) =>
      NoteLabelEntry(
        id: id ?? this.id,
        name: name ?? this.name,
        createdAtUtc: createdAtUtc ?? this.createdAtUtc,
      );
  NoteLabelEntry copyWithCompanion(NoteLabelsCompanion data) {
    return NoteLabelEntry(
      id: data.id.present ? data.id.value : this.id,
      name: data.name.present ? data.name.value : this.name,
      createdAtUtc: data.createdAtUtc.present
          ? data.createdAtUtc.value
          : this.createdAtUtc,
    );
  }

  @override
  String toString() {
    return (StringBuffer('NoteLabelEntry(')
          ..write('id: $id, ')
          ..write('name: $name, ')
          ..write('createdAtUtc: $createdAtUtc')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(id, name, createdAtUtc);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is NoteLabelEntry &&
          other.id == this.id &&
          other.name == this.name &&
          other.createdAtUtc == this.createdAtUtc);
}

class NoteLabelsCompanion extends UpdateCompanion<NoteLabelEntry> {
  final Value<String> id;
  final Value<String> name;
  final Value<int> createdAtUtc;
  final Value<int> rowid;
  const NoteLabelsCompanion({
    this.id = const Value.absent(),
    this.name = const Value.absent(),
    this.createdAtUtc = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  NoteLabelsCompanion.insert({
    required String id,
    required String name,
    required int createdAtUtc,
    this.rowid = const Value.absent(),
  }) : id = Value(id),
       name = Value(name),
       createdAtUtc = Value(createdAtUtc);
  static Insertable<NoteLabelEntry> custom({
    Expression<String>? id,
    Expression<String>? name,
    Expression<int>? createdAtUtc,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (name != null) 'name': name,
      if (createdAtUtc != null) 'created_at_utc': createdAtUtc,
      if (rowid != null) 'rowid': rowid,
    });
  }

  NoteLabelsCompanion copyWith({
    Value<String>? id,
    Value<String>? name,
    Value<int>? createdAtUtc,
    Value<int>? rowid,
  }) {
    return NoteLabelsCompanion(
      id: id ?? this.id,
      name: name ?? this.name,
      createdAtUtc: createdAtUtc ?? this.createdAtUtc,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (name.present) {
      map['name'] = Variable<String>(name.value);
    }
    if (createdAtUtc.present) {
      map['created_at_utc'] = Variable<int>(createdAtUtc.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('NoteLabelsCompanion(')
          ..write('id: $id, ')
          ..write('name: $name, ')
          ..write('createdAtUtc: $createdAtUtc, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $NoteItemsTable extends NoteItems
    with TableInfo<$NoteItemsTable, NoteItemEntry> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $NoteItemsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _titleMeta = const VerificationMeta('title');
  @override
  late final GeneratedColumn<String> title = GeneratedColumn<String>(
    'title',
    aliasedName,
    true,
    additionalChecks: GeneratedColumn.checkTextLength(maxTextLength: 256),
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _contentMeta = const VerificationMeta(
    'content',
  );
  @override
  late final GeneratedColumn<String> content = GeneratedColumn<String>(
    'content',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _typeMeta = const VerificationMeta('type');
  @override
  late final GeneratedColumn<String> type = GeneratedColumn<String>(
    'type',
    aliasedName,
    false,
    additionalChecks: GeneratedColumn.checkTextLength(
      minTextLength: 1,
      maxTextLength: 32,
    ),
    type: DriftSqlType.string,
    requiredDuringInsert: false,
    defaultValue: const Constant('text'),
  );
  static const VerificationMeta _colorValueMeta = const VerificationMeta(
    'colorValue',
  );
  @override
  late final GeneratedColumn<int> colorValue = GeneratedColumn<int>(
    'color_value',
    aliasedName,
    true,
    type: DriftSqlType.int,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _isPinnedMeta = const VerificationMeta(
    'isPinned',
  );
  @override
  late final GeneratedColumn<bool> isPinned = GeneratedColumn<bool>(
    'is_pinned',
    aliasedName,
    false,
    type: DriftSqlType.bool,
    requiredDuringInsert: false,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'CHECK ("is_pinned" IN (0, 1))',
    ),
    defaultValue: const Constant(false),
  );
  static const VerificationMeta _isArchivedMeta = const VerificationMeta(
    'isArchived',
  );
  @override
  late final GeneratedColumn<bool> isArchived = GeneratedColumn<bool>(
    'is_archived',
    aliasedName,
    false,
    type: DriftSqlType.bool,
    requiredDuringInsert: false,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'CHECK ("is_archived" IN (0, 1))',
    ),
    defaultValue: const Constant(false),
  );
  static const VerificationMeta _isDeletedMeta = const VerificationMeta(
    'isDeleted',
  );
  @override
  late final GeneratedColumn<bool> isDeleted = GeneratedColumn<bool>(
    'is_deleted',
    aliasedName,
    false,
    type: DriftSqlType.bool,
    requiredDuringInsert: false,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'CHECK ("is_deleted" IN (0, 1))',
    ),
    defaultValue: const Constant(false),
  );
  static const VerificationMeta _createdAtUtcMeta = const VerificationMeta(
    'createdAtUtc',
  );
  @override
  late final GeneratedColumn<int> createdAtUtc = GeneratedColumn<int>(
    'created_at_utc',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _updatedAtUtcMeta = const VerificationMeta(
    'updatedAtUtc',
  );
  @override
  late final GeneratedColumn<int> updatedAtUtc = GeneratedColumn<int>(
    'updated_at_utc',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: true,
  );
  @override
  List<GeneratedColumn> get $columns => [
    id,
    title,
    content,
    type,
    colorValue,
    isPinned,
    isArchived,
    isDeleted,
    createdAtUtc,
    updatedAtUtc,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'note_items';
  @override
  VerificationContext validateIntegrity(
    Insertable<NoteItemEntry> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('title')) {
      context.handle(
        _titleMeta,
        title.isAcceptableOrUnknown(data['title']!, _titleMeta),
      );
    }
    if (data.containsKey('content')) {
      context.handle(
        _contentMeta,
        content.isAcceptableOrUnknown(data['content']!, _contentMeta),
      );
    }
    if (data.containsKey('type')) {
      context.handle(
        _typeMeta,
        type.isAcceptableOrUnknown(data['type']!, _typeMeta),
      );
    }
    if (data.containsKey('color_value')) {
      context.handle(
        _colorValueMeta,
        colorValue.isAcceptableOrUnknown(data['color_value']!, _colorValueMeta),
      );
    }
    if (data.containsKey('is_pinned')) {
      context.handle(
        _isPinnedMeta,
        isPinned.isAcceptableOrUnknown(data['is_pinned']!, _isPinnedMeta),
      );
    }
    if (data.containsKey('is_archived')) {
      context.handle(
        _isArchivedMeta,
        isArchived.isAcceptableOrUnknown(data['is_archived']!, _isArchivedMeta),
      );
    }
    if (data.containsKey('is_deleted')) {
      context.handle(
        _isDeletedMeta,
        isDeleted.isAcceptableOrUnknown(data['is_deleted']!, _isDeletedMeta),
      );
    }
    if (data.containsKey('created_at_utc')) {
      context.handle(
        _createdAtUtcMeta,
        createdAtUtc.isAcceptableOrUnknown(
          data['created_at_utc']!,
          _createdAtUtcMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_createdAtUtcMeta);
    }
    if (data.containsKey('updated_at_utc')) {
      context.handle(
        _updatedAtUtcMeta,
        updatedAtUtc.isAcceptableOrUnknown(
          data['updated_at_utc']!,
          _updatedAtUtcMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_updatedAtUtcMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  NoteItemEntry map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return NoteItemEntry(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id'],
      )!,
      title: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}title'],
      ),
      content: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}content'],
      ),
      type: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}type'],
      )!,
      colorValue: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}color_value'],
      ),
      isPinned: attachedDatabase.typeMapping.read(
        DriftSqlType.bool,
        data['${effectivePrefix}is_pinned'],
      )!,
      isArchived: attachedDatabase.typeMapping.read(
        DriftSqlType.bool,
        data['${effectivePrefix}is_archived'],
      )!,
      isDeleted: attachedDatabase.typeMapping.read(
        DriftSqlType.bool,
        data['${effectivePrefix}is_deleted'],
      )!,
      createdAtUtc: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}created_at_utc'],
      )!,
      updatedAtUtc: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}updated_at_utc'],
      )!,
    );
  }

  @override
  $NoteItemsTable createAlias(String alias) {
    return $NoteItemsTable(attachedDatabase, alias);
  }
}

class NoteItemEntry extends DataClass implements Insertable<NoteItemEntry> {
  final String id;
  final String? title;
  final String? content;
  final String type;
  final int? colorValue;
  final bool isPinned;
  final bool isArchived;
  final bool isDeleted;
  final int createdAtUtc;
  final int updatedAtUtc;
  const NoteItemEntry({
    required this.id,
    this.title,
    this.content,
    required this.type,
    this.colorValue,
    required this.isPinned,
    required this.isArchived,
    required this.isDeleted,
    required this.createdAtUtc,
    required this.updatedAtUtc,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    if (!nullToAbsent || title != null) {
      map['title'] = Variable<String>(title);
    }
    if (!nullToAbsent || content != null) {
      map['content'] = Variable<String>(content);
    }
    map['type'] = Variable<String>(type);
    if (!nullToAbsent || colorValue != null) {
      map['color_value'] = Variable<int>(colorValue);
    }
    map['is_pinned'] = Variable<bool>(isPinned);
    map['is_archived'] = Variable<bool>(isArchived);
    map['is_deleted'] = Variable<bool>(isDeleted);
    map['created_at_utc'] = Variable<int>(createdAtUtc);
    map['updated_at_utc'] = Variable<int>(updatedAtUtc);
    return map;
  }

  NoteItemsCompanion toCompanion(bool nullToAbsent) {
    return NoteItemsCompanion(
      id: Value(id),
      title: title == null && nullToAbsent
          ? const Value.absent()
          : Value(title),
      content: content == null && nullToAbsent
          ? const Value.absent()
          : Value(content),
      type: Value(type),
      colorValue: colorValue == null && nullToAbsent
          ? const Value.absent()
          : Value(colorValue),
      isPinned: Value(isPinned),
      isArchived: Value(isArchived),
      isDeleted: Value(isDeleted),
      createdAtUtc: Value(createdAtUtc),
      updatedAtUtc: Value(updatedAtUtc),
    );
  }

  factory NoteItemEntry.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return NoteItemEntry(
      id: serializer.fromJson<String>(json['id']),
      title: serializer.fromJson<String?>(json['title']),
      content: serializer.fromJson<String?>(json['content']),
      type: serializer.fromJson<String>(json['type']),
      colorValue: serializer.fromJson<int?>(json['colorValue']),
      isPinned: serializer.fromJson<bool>(json['isPinned']),
      isArchived: serializer.fromJson<bool>(json['isArchived']),
      isDeleted: serializer.fromJson<bool>(json['isDeleted']),
      createdAtUtc: serializer.fromJson<int>(json['createdAtUtc']),
      updatedAtUtc: serializer.fromJson<int>(json['updatedAtUtc']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'title': serializer.toJson<String?>(title),
      'content': serializer.toJson<String?>(content),
      'type': serializer.toJson<String>(type),
      'colorValue': serializer.toJson<int?>(colorValue),
      'isPinned': serializer.toJson<bool>(isPinned),
      'isArchived': serializer.toJson<bool>(isArchived),
      'isDeleted': serializer.toJson<bool>(isDeleted),
      'createdAtUtc': serializer.toJson<int>(createdAtUtc),
      'updatedAtUtc': serializer.toJson<int>(updatedAtUtc),
    };
  }

  NoteItemEntry copyWith({
    String? id,
    Value<String?> title = const Value.absent(),
    Value<String?> content = const Value.absent(),
    String? type,
    Value<int?> colorValue = const Value.absent(),
    bool? isPinned,
    bool? isArchived,
    bool? isDeleted,
    int? createdAtUtc,
    int? updatedAtUtc,
  }) => NoteItemEntry(
    id: id ?? this.id,
    title: title.present ? title.value : this.title,
    content: content.present ? content.value : this.content,
    type: type ?? this.type,
    colorValue: colorValue.present ? colorValue.value : this.colorValue,
    isPinned: isPinned ?? this.isPinned,
    isArchived: isArchived ?? this.isArchived,
    isDeleted: isDeleted ?? this.isDeleted,
    createdAtUtc: createdAtUtc ?? this.createdAtUtc,
    updatedAtUtc: updatedAtUtc ?? this.updatedAtUtc,
  );
  NoteItemEntry copyWithCompanion(NoteItemsCompanion data) {
    return NoteItemEntry(
      id: data.id.present ? data.id.value : this.id,
      title: data.title.present ? data.title.value : this.title,
      content: data.content.present ? data.content.value : this.content,
      type: data.type.present ? data.type.value : this.type,
      colorValue: data.colorValue.present
          ? data.colorValue.value
          : this.colorValue,
      isPinned: data.isPinned.present ? data.isPinned.value : this.isPinned,
      isArchived: data.isArchived.present
          ? data.isArchived.value
          : this.isArchived,
      isDeleted: data.isDeleted.present ? data.isDeleted.value : this.isDeleted,
      createdAtUtc: data.createdAtUtc.present
          ? data.createdAtUtc.value
          : this.createdAtUtc,
      updatedAtUtc: data.updatedAtUtc.present
          ? data.updatedAtUtc.value
          : this.updatedAtUtc,
    );
  }

  @override
  String toString() {
    return (StringBuffer('NoteItemEntry(')
          ..write('id: $id, ')
          ..write('title: $title, ')
          ..write('content: $content, ')
          ..write('type: $type, ')
          ..write('colorValue: $colorValue, ')
          ..write('isPinned: $isPinned, ')
          ..write('isArchived: $isArchived, ')
          ..write('isDeleted: $isDeleted, ')
          ..write('createdAtUtc: $createdAtUtc, ')
          ..write('updatedAtUtc: $updatedAtUtc')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
    id,
    title,
    content,
    type,
    colorValue,
    isPinned,
    isArchived,
    isDeleted,
    createdAtUtc,
    updatedAtUtc,
  );
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is NoteItemEntry &&
          other.id == this.id &&
          other.title == this.title &&
          other.content == this.content &&
          other.type == this.type &&
          other.colorValue == this.colorValue &&
          other.isPinned == this.isPinned &&
          other.isArchived == this.isArchived &&
          other.isDeleted == this.isDeleted &&
          other.createdAtUtc == this.createdAtUtc &&
          other.updatedAtUtc == this.updatedAtUtc);
}

class NoteItemsCompanion extends UpdateCompanion<NoteItemEntry> {
  final Value<String> id;
  final Value<String?> title;
  final Value<String?> content;
  final Value<String> type;
  final Value<int?> colorValue;
  final Value<bool> isPinned;
  final Value<bool> isArchived;
  final Value<bool> isDeleted;
  final Value<int> createdAtUtc;
  final Value<int> updatedAtUtc;
  final Value<int> rowid;
  const NoteItemsCompanion({
    this.id = const Value.absent(),
    this.title = const Value.absent(),
    this.content = const Value.absent(),
    this.type = const Value.absent(),
    this.colorValue = const Value.absent(),
    this.isPinned = const Value.absent(),
    this.isArchived = const Value.absent(),
    this.isDeleted = const Value.absent(),
    this.createdAtUtc = const Value.absent(),
    this.updatedAtUtc = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  NoteItemsCompanion.insert({
    required String id,
    this.title = const Value.absent(),
    this.content = const Value.absent(),
    this.type = const Value.absent(),
    this.colorValue = const Value.absent(),
    this.isPinned = const Value.absent(),
    this.isArchived = const Value.absent(),
    this.isDeleted = const Value.absent(),
    required int createdAtUtc,
    required int updatedAtUtc,
    this.rowid = const Value.absent(),
  }) : id = Value(id),
       createdAtUtc = Value(createdAtUtc),
       updatedAtUtc = Value(updatedAtUtc);
  static Insertable<NoteItemEntry> custom({
    Expression<String>? id,
    Expression<String>? title,
    Expression<String>? content,
    Expression<String>? type,
    Expression<int>? colorValue,
    Expression<bool>? isPinned,
    Expression<bool>? isArchived,
    Expression<bool>? isDeleted,
    Expression<int>? createdAtUtc,
    Expression<int>? updatedAtUtc,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (title != null) 'title': title,
      if (content != null) 'content': content,
      if (type != null) 'type': type,
      if (colorValue != null) 'color_value': colorValue,
      if (isPinned != null) 'is_pinned': isPinned,
      if (isArchived != null) 'is_archived': isArchived,
      if (isDeleted != null) 'is_deleted': isDeleted,
      if (createdAtUtc != null) 'created_at_utc': createdAtUtc,
      if (updatedAtUtc != null) 'updated_at_utc': updatedAtUtc,
      if (rowid != null) 'rowid': rowid,
    });
  }

  NoteItemsCompanion copyWith({
    Value<String>? id,
    Value<String?>? title,
    Value<String?>? content,
    Value<String>? type,
    Value<int?>? colorValue,
    Value<bool>? isPinned,
    Value<bool>? isArchived,
    Value<bool>? isDeleted,
    Value<int>? createdAtUtc,
    Value<int>? updatedAtUtc,
    Value<int>? rowid,
  }) {
    return NoteItemsCompanion(
      id: id ?? this.id,
      title: title ?? this.title,
      content: content ?? this.content,
      type: type ?? this.type,
      colorValue: colorValue ?? this.colorValue,
      isPinned: isPinned ?? this.isPinned,
      isArchived: isArchived ?? this.isArchived,
      isDeleted: isDeleted ?? this.isDeleted,
      createdAtUtc: createdAtUtc ?? this.createdAtUtc,
      updatedAtUtc: updatedAtUtc ?? this.updatedAtUtc,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (title.present) {
      map['title'] = Variable<String>(title.value);
    }
    if (content.present) {
      map['content'] = Variable<String>(content.value);
    }
    if (type.present) {
      map['type'] = Variable<String>(type.value);
    }
    if (colorValue.present) {
      map['color_value'] = Variable<int>(colorValue.value);
    }
    if (isPinned.present) {
      map['is_pinned'] = Variable<bool>(isPinned.value);
    }
    if (isArchived.present) {
      map['is_archived'] = Variable<bool>(isArchived.value);
    }
    if (isDeleted.present) {
      map['is_deleted'] = Variable<bool>(isDeleted.value);
    }
    if (createdAtUtc.present) {
      map['created_at_utc'] = Variable<int>(createdAtUtc.value);
    }
    if (updatedAtUtc.present) {
      map['updated_at_utc'] = Variable<int>(updatedAtUtc.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('NoteItemsCompanion(')
          ..write('id: $id, ')
          ..write('title: $title, ')
          ..write('content: $content, ')
          ..write('type: $type, ')
          ..write('colorValue: $colorValue, ')
          ..write('isPinned: $isPinned, ')
          ..write('isArchived: $isArchived, ')
          ..write('isDeleted: $isDeleted, ')
          ..write('createdAtUtc: $createdAtUtc, ')
          ..write('updatedAtUtc: $updatedAtUtc, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $NoteLabelCrossRefTable extends NoteLabelCrossRef
    with TableInfo<$NoteLabelCrossRefTable, NoteLabelCrossRefEntry> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $NoteLabelCrossRefTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _noteIdMeta = const VerificationMeta('noteId');
  @override
  late final GeneratedColumn<String> noteId = GeneratedColumn<String>(
    'note_id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'REFERENCES note_items (id) ON DELETE CASCADE',
    ),
  );
  static const VerificationMeta _labelIdMeta = const VerificationMeta(
    'labelId',
  );
  @override
  late final GeneratedColumn<String> labelId = GeneratedColumn<String>(
    'label_id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'REFERENCES note_labels (id) ON DELETE CASCADE',
    ),
  );
  @override
  List<GeneratedColumn> get $columns => [noteId, labelId];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'note_label_cross_ref';
  @override
  VerificationContext validateIntegrity(
    Insertable<NoteLabelCrossRefEntry> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('note_id')) {
      context.handle(
        _noteIdMeta,
        noteId.isAcceptableOrUnknown(data['note_id']!, _noteIdMeta),
      );
    } else if (isInserting) {
      context.missing(_noteIdMeta);
    }
    if (data.containsKey('label_id')) {
      context.handle(
        _labelIdMeta,
        labelId.isAcceptableOrUnknown(data['label_id']!, _labelIdMeta),
      );
    } else if (isInserting) {
      context.missing(_labelIdMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {noteId, labelId};
  @override
  NoteLabelCrossRefEntry map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return NoteLabelCrossRefEntry(
      noteId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}note_id'],
      )!,
      labelId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}label_id'],
      )!,
    );
  }

  @override
  $NoteLabelCrossRefTable createAlias(String alias) {
    return $NoteLabelCrossRefTable(attachedDatabase, alias);
  }
}

class NoteLabelCrossRefEntry extends DataClass
    implements Insertable<NoteLabelCrossRefEntry> {
  final String noteId;
  final String labelId;
  const NoteLabelCrossRefEntry({required this.noteId, required this.labelId});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['note_id'] = Variable<String>(noteId);
    map['label_id'] = Variable<String>(labelId);
    return map;
  }

  NoteLabelCrossRefCompanion toCompanion(bool nullToAbsent) {
    return NoteLabelCrossRefCompanion(
      noteId: Value(noteId),
      labelId: Value(labelId),
    );
  }

  factory NoteLabelCrossRefEntry.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return NoteLabelCrossRefEntry(
      noteId: serializer.fromJson<String>(json['noteId']),
      labelId: serializer.fromJson<String>(json['labelId']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'noteId': serializer.toJson<String>(noteId),
      'labelId': serializer.toJson<String>(labelId),
    };
  }

  NoteLabelCrossRefEntry copyWith({String? noteId, String? labelId}) =>
      NoteLabelCrossRefEntry(
        noteId: noteId ?? this.noteId,
        labelId: labelId ?? this.labelId,
      );
  NoteLabelCrossRefEntry copyWithCompanion(NoteLabelCrossRefCompanion data) {
    return NoteLabelCrossRefEntry(
      noteId: data.noteId.present ? data.noteId.value : this.noteId,
      labelId: data.labelId.present ? data.labelId.value : this.labelId,
    );
  }

  @override
  String toString() {
    return (StringBuffer('NoteLabelCrossRefEntry(')
          ..write('noteId: $noteId, ')
          ..write('labelId: $labelId')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(noteId, labelId);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is NoteLabelCrossRefEntry &&
          other.noteId == this.noteId &&
          other.labelId == this.labelId);
}

class NoteLabelCrossRefCompanion
    extends UpdateCompanion<NoteLabelCrossRefEntry> {
  final Value<String> noteId;
  final Value<String> labelId;
  final Value<int> rowid;
  const NoteLabelCrossRefCompanion({
    this.noteId = const Value.absent(),
    this.labelId = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  NoteLabelCrossRefCompanion.insert({
    required String noteId,
    required String labelId,
    this.rowid = const Value.absent(),
  }) : noteId = Value(noteId),
       labelId = Value(labelId);
  static Insertable<NoteLabelCrossRefEntry> custom({
    Expression<String>? noteId,
    Expression<String>? labelId,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (noteId != null) 'note_id': noteId,
      if (labelId != null) 'label_id': labelId,
      if (rowid != null) 'rowid': rowid,
    });
  }

  NoteLabelCrossRefCompanion copyWith({
    Value<String>? noteId,
    Value<String>? labelId,
    Value<int>? rowid,
  }) {
    return NoteLabelCrossRefCompanion(
      noteId: noteId ?? this.noteId,
      labelId: labelId ?? this.labelId,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (noteId.present) {
      map['note_id'] = Variable<String>(noteId.value);
    }
    if (labelId.present) {
      map['label_id'] = Variable<String>(labelId.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('NoteLabelCrossRefCompanion(')
          ..write('noteId: $noteId, ')
          ..write('labelId: $labelId, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $ChecklistItemsTable extends ChecklistItems
    with TableInfo<$ChecklistItemsTable, ChecklistItemEntry> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $ChecklistItemsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _noteIdMeta = const VerificationMeta('noteId');
  @override
  late final GeneratedColumn<String> noteId = GeneratedColumn<String>(
    'note_id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'REFERENCES note_items (id) ON DELETE CASCADE',
    ),
  );
  static const VerificationMeta _itemTextMeta = const VerificationMeta(
    'itemText',
  );
  @override
  late final GeneratedColumn<String> itemText = GeneratedColumn<String>(
    'item_text',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _isCheckedMeta = const VerificationMeta(
    'isChecked',
  );
  @override
  late final GeneratedColumn<bool> isChecked = GeneratedColumn<bool>(
    'is_checked',
    aliasedName,
    false,
    type: DriftSqlType.bool,
    requiredDuringInsert: false,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'CHECK ("is_checked" IN (0, 1))',
    ),
    defaultValue: const Constant(false),
  );
  static const VerificationMeta _sortOrderMeta = const VerificationMeta(
    'sortOrder',
  );
  @override
  late final GeneratedColumn<int> sortOrder = GeneratedColumn<int>(
    'sort_order',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: false,
    defaultValue: const Constant(0),
  );
  @override
  List<GeneratedColumn> get $columns => [
    id,
    noteId,
    itemText,
    isChecked,
    sortOrder,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'checklist_items';
  @override
  VerificationContext validateIntegrity(
    Insertable<ChecklistItemEntry> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('note_id')) {
      context.handle(
        _noteIdMeta,
        noteId.isAcceptableOrUnknown(data['note_id']!, _noteIdMeta),
      );
    } else if (isInserting) {
      context.missing(_noteIdMeta);
    }
    if (data.containsKey('item_text')) {
      context.handle(
        _itemTextMeta,
        itemText.isAcceptableOrUnknown(data['item_text']!, _itemTextMeta),
      );
    } else if (isInserting) {
      context.missing(_itemTextMeta);
    }
    if (data.containsKey('is_checked')) {
      context.handle(
        _isCheckedMeta,
        isChecked.isAcceptableOrUnknown(data['is_checked']!, _isCheckedMeta),
      );
    }
    if (data.containsKey('sort_order')) {
      context.handle(
        _sortOrderMeta,
        sortOrder.isAcceptableOrUnknown(data['sort_order']!, _sortOrderMeta),
      );
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  ChecklistItemEntry map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return ChecklistItemEntry(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id'],
      )!,
      noteId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}note_id'],
      )!,
      itemText: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}item_text'],
      )!,
      isChecked: attachedDatabase.typeMapping.read(
        DriftSqlType.bool,
        data['${effectivePrefix}is_checked'],
      )!,
      sortOrder: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}sort_order'],
      )!,
    );
  }

  @override
  $ChecklistItemsTable createAlias(String alias) {
    return $ChecklistItemsTable(attachedDatabase, alias);
  }
}

class ChecklistItemEntry extends DataClass
    implements Insertable<ChecklistItemEntry> {
  final String id;
  final String noteId;
  final String itemText;
  final bool isChecked;
  final int sortOrder;
  const ChecklistItemEntry({
    required this.id,
    required this.noteId,
    required this.itemText,
    required this.isChecked,
    required this.sortOrder,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['note_id'] = Variable<String>(noteId);
    map['item_text'] = Variable<String>(itemText);
    map['is_checked'] = Variable<bool>(isChecked);
    map['sort_order'] = Variable<int>(sortOrder);
    return map;
  }

  ChecklistItemsCompanion toCompanion(bool nullToAbsent) {
    return ChecklistItemsCompanion(
      id: Value(id),
      noteId: Value(noteId),
      itemText: Value(itemText),
      isChecked: Value(isChecked),
      sortOrder: Value(sortOrder),
    );
  }

  factory ChecklistItemEntry.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return ChecklistItemEntry(
      id: serializer.fromJson<String>(json['id']),
      noteId: serializer.fromJson<String>(json['noteId']),
      itemText: serializer.fromJson<String>(json['itemText']),
      isChecked: serializer.fromJson<bool>(json['isChecked']),
      sortOrder: serializer.fromJson<int>(json['sortOrder']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'noteId': serializer.toJson<String>(noteId),
      'itemText': serializer.toJson<String>(itemText),
      'isChecked': serializer.toJson<bool>(isChecked),
      'sortOrder': serializer.toJson<int>(sortOrder),
    };
  }

  ChecklistItemEntry copyWith({
    String? id,
    String? noteId,
    String? itemText,
    bool? isChecked,
    int? sortOrder,
  }) => ChecklistItemEntry(
    id: id ?? this.id,
    noteId: noteId ?? this.noteId,
    itemText: itemText ?? this.itemText,
    isChecked: isChecked ?? this.isChecked,
    sortOrder: sortOrder ?? this.sortOrder,
  );
  ChecklistItemEntry copyWithCompanion(ChecklistItemsCompanion data) {
    return ChecklistItemEntry(
      id: data.id.present ? data.id.value : this.id,
      noteId: data.noteId.present ? data.noteId.value : this.noteId,
      itemText: data.itemText.present ? data.itemText.value : this.itemText,
      isChecked: data.isChecked.present ? data.isChecked.value : this.isChecked,
      sortOrder: data.sortOrder.present ? data.sortOrder.value : this.sortOrder,
    );
  }

  @override
  String toString() {
    return (StringBuffer('ChecklistItemEntry(')
          ..write('id: $id, ')
          ..write('noteId: $noteId, ')
          ..write('itemText: $itemText, ')
          ..write('isChecked: $isChecked, ')
          ..write('sortOrder: $sortOrder')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(id, noteId, itemText, isChecked, sortOrder);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is ChecklistItemEntry &&
          other.id == this.id &&
          other.noteId == this.noteId &&
          other.itemText == this.itemText &&
          other.isChecked == this.isChecked &&
          other.sortOrder == this.sortOrder);
}

class ChecklistItemsCompanion extends UpdateCompanion<ChecklistItemEntry> {
  final Value<String> id;
  final Value<String> noteId;
  final Value<String> itemText;
  final Value<bool> isChecked;
  final Value<int> sortOrder;
  final Value<int> rowid;
  const ChecklistItemsCompanion({
    this.id = const Value.absent(),
    this.noteId = const Value.absent(),
    this.itemText = const Value.absent(),
    this.isChecked = const Value.absent(),
    this.sortOrder = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  ChecklistItemsCompanion.insert({
    required String id,
    required String noteId,
    required String itemText,
    this.isChecked = const Value.absent(),
    this.sortOrder = const Value.absent(),
    this.rowid = const Value.absent(),
  }) : id = Value(id),
       noteId = Value(noteId),
       itemText = Value(itemText);
  static Insertable<ChecklistItemEntry> custom({
    Expression<String>? id,
    Expression<String>? noteId,
    Expression<String>? itemText,
    Expression<bool>? isChecked,
    Expression<int>? sortOrder,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (noteId != null) 'note_id': noteId,
      if (itemText != null) 'item_text': itemText,
      if (isChecked != null) 'is_checked': isChecked,
      if (sortOrder != null) 'sort_order': sortOrder,
      if (rowid != null) 'rowid': rowid,
    });
  }

  ChecklistItemsCompanion copyWith({
    Value<String>? id,
    Value<String>? noteId,
    Value<String>? itemText,
    Value<bool>? isChecked,
    Value<int>? sortOrder,
    Value<int>? rowid,
  }) {
    return ChecklistItemsCompanion(
      id: id ?? this.id,
      noteId: noteId ?? this.noteId,
      itemText: itemText ?? this.itemText,
      isChecked: isChecked ?? this.isChecked,
      sortOrder: sortOrder ?? this.sortOrder,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (noteId.present) {
      map['note_id'] = Variable<String>(noteId.value);
    }
    if (itemText.present) {
      map['item_text'] = Variable<String>(itemText.value);
    }
    if (isChecked.present) {
      map['is_checked'] = Variable<bool>(isChecked.value);
    }
    if (sortOrder.present) {
      map['sort_order'] = Variable<int>(sortOrder.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('ChecklistItemsCompanion(')
          ..write('id: $id, ')
          ..write('noteId: $noteId, ')
          ..write('itemText: $itemText, ')
          ..write('isChecked: $isChecked, ')
          ..write('sortOrder: $sortOrder, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $UsageSessionsTable extends UsageSessions
    with TableInfo<$UsageSessionsTable, UsageSessionEntry> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $UsageSessionsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _packageNameMeta = const VerificationMeta(
    'packageName',
  );
  @override
  late final GeneratedColumn<String> packageName = GeneratedColumn<String>(
    'package_name',
    aliasedName,
    false,
    additionalChecks: GeneratedColumn.checkTextLength(
      minTextLength: 1,
      maxTextLength: 256,
    ),
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _appNameMeta = const VerificationMeta(
    'appName',
  );
  @override
  late final GeneratedColumn<String> appName = GeneratedColumn<String>(
    'app_name',
    aliasedName,
    false,
    additionalChecks: GeneratedColumn.checkTextLength(
      minTextLength: 1,
      maxTextLength: 128,
    ),
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _startTimeUtcMeta = const VerificationMeta(
    'startTimeUtc',
  );
  @override
  late final GeneratedColumn<int> startTimeUtc = GeneratedColumn<int>(
    'start_time_utc',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _endTimeUtcMeta = const VerificationMeta(
    'endTimeUtc',
  );
  @override
  late final GeneratedColumn<int> endTimeUtc = GeneratedColumn<int>(
    'end_time_utc',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _durationSecondsMeta = const VerificationMeta(
    'durationSeconds',
  );
  @override
  late final GeneratedColumn<int> durationSeconds = GeneratedColumn<int>(
    'duration_seconds',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _createdAtUtcMeta = const VerificationMeta(
    'createdAtUtc',
  );
  @override
  late final GeneratedColumn<int> createdAtUtc = GeneratedColumn<int>(
    'created_at_utc',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: true,
  );
  @override
  List<GeneratedColumn> get $columns => [
    id,
    packageName,
    appName,
    startTimeUtc,
    endTimeUtc,
    durationSeconds,
    createdAtUtc,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'usage_sessions';
  @override
  VerificationContext validateIntegrity(
    Insertable<UsageSessionEntry> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('package_name')) {
      context.handle(
        _packageNameMeta,
        packageName.isAcceptableOrUnknown(
          data['package_name']!,
          _packageNameMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_packageNameMeta);
    }
    if (data.containsKey('app_name')) {
      context.handle(
        _appNameMeta,
        appName.isAcceptableOrUnknown(data['app_name']!, _appNameMeta),
      );
    } else if (isInserting) {
      context.missing(_appNameMeta);
    }
    if (data.containsKey('start_time_utc')) {
      context.handle(
        _startTimeUtcMeta,
        startTimeUtc.isAcceptableOrUnknown(
          data['start_time_utc']!,
          _startTimeUtcMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_startTimeUtcMeta);
    }
    if (data.containsKey('end_time_utc')) {
      context.handle(
        _endTimeUtcMeta,
        endTimeUtc.isAcceptableOrUnknown(
          data['end_time_utc']!,
          _endTimeUtcMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_endTimeUtcMeta);
    }
    if (data.containsKey('duration_seconds')) {
      context.handle(
        _durationSecondsMeta,
        durationSeconds.isAcceptableOrUnknown(
          data['duration_seconds']!,
          _durationSecondsMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_durationSecondsMeta);
    }
    if (data.containsKey('created_at_utc')) {
      context.handle(
        _createdAtUtcMeta,
        createdAtUtc.isAcceptableOrUnknown(
          data['created_at_utc']!,
          _createdAtUtcMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_createdAtUtcMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  UsageSessionEntry map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return UsageSessionEntry(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id'],
      )!,
      packageName: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}package_name'],
      )!,
      appName: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}app_name'],
      )!,
      startTimeUtc: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}start_time_utc'],
      )!,
      endTimeUtc: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}end_time_utc'],
      )!,
      durationSeconds: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}duration_seconds'],
      )!,
      createdAtUtc: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}created_at_utc'],
      )!,
    );
  }

  @override
  $UsageSessionsTable createAlias(String alias) {
    return $UsageSessionsTable(attachedDatabase, alias);
  }
}

class UsageSessionEntry extends DataClass
    implements Insertable<UsageSessionEntry> {
  final String id;
  final String packageName;
  final String appName;
  final int startTimeUtc;
  final int endTimeUtc;
  final int durationSeconds;
  final int createdAtUtc;
  const UsageSessionEntry({
    required this.id,
    required this.packageName,
    required this.appName,
    required this.startTimeUtc,
    required this.endTimeUtc,
    required this.durationSeconds,
    required this.createdAtUtc,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['package_name'] = Variable<String>(packageName);
    map['app_name'] = Variable<String>(appName);
    map['start_time_utc'] = Variable<int>(startTimeUtc);
    map['end_time_utc'] = Variable<int>(endTimeUtc);
    map['duration_seconds'] = Variable<int>(durationSeconds);
    map['created_at_utc'] = Variable<int>(createdAtUtc);
    return map;
  }

  UsageSessionsCompanion toCompanion(bool nullToAbsent) {
    return UsageSessionsCompanion(
      id: Value(id),
      packageName: Value(packageName),
      appName: Value(appName),
      startTimeUtc: Value(startTimeUtc),
      endTimeUtc: Value(endTimeUtc),
      durationSeconds: Value(durationSeconds),
      createdAtUtc: Value(createdAtUtc),
    );
  }

  factory UsageSessionEntry.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return UsageSessionEntry(
      id: serializer.fromJson<String>(json['id']),
      packageName: serializer.fromJson<String>(json['packageName']),
      appName: serializer.fromJson<String>(json['appName']),
      startTimeUtc: serializer.fromJson<int>(json['startTimeUtc']),
      endTimeUtc: serializer.fromJson<int>(json['endTimeUtc']),
      durationSeconds: serializer.fromJson<int>(json['durationSeconds']),
      createdAtUtc: serializer.fromJson<int>(json['createdAtUtc']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'packageName': serializer.toJson<String>(packageName),
      'appName': serializer.toJson<String>(appName),
      'startTimeUtc': serializer.toJson<int>(startTimeUtc),
      'endTimeUtc': serializer.toJson<int>(endTimeUtc),
      'durationSeconds': serializer.toJson<int>(durationSeconds),
      'createdAtUtc': serializer.toJson<int>(createdAtUtc),
    };
  }

  UsageSessionEntry copyWith({
    String? id,
    String? packageName,
    String? appName,
    int? startTimeUtc,
    int? endTimeUtc,
    int? durationSeconds,
    int? createdAtUtc,
  }) => UsageSessionEntry(
    id: id ?? this.id,
    packageName: packageName ?? this.packageName,
    appName: appName ?? this.appName,
    startTimeUtc: startTimeUtc ?? this.startTimeUtc,
    endTimeUtc: endTimeUtc ?? this.endTimeUtc,
    durationSeconds: durationSeconds ?? this.durationSeconds,
    createdAtUtc: createdAtUtc ?? this.createdAtUtc,
  );
  UsageSessionEntry copyWithCompanion(UsageSessionsCompanion data) {
    return UsageSessionEntry(
      id: data.id.present ? data.id.value : this.id,
      packageName: data.packageName.present
          ? data.packageName.value
          : this.packageName,
      appName: data.appName.present ? data.appName.value : this.appName,
      startTimeUtc: data.startTimeUtc.present
          ? data.startTimeUtc.value
          : this.startTimeUtc,
      endTimeUtc: data.endTimeUtc.present
          ? data.endTimeUtc.value
          : this.endTimeUtc,
      durationSeconds: data.durationSeconds.present
          ? data.durationSeconds.value
          : this.durationSeconds,
      createdAtUtc: data.createdAtUtc.present
          ? data.createdAtUtc.value
          : this.createdAtUtc,
    );
  }

  @override
  String toString() {
    return (StringBuffer('UsageSessionEntry(')
          ..write('id: $id, ')
          ..write('packageName: $packageName, ')
          ..write('appName: $appName, ')
          ..write('startTimeUtc: $startTimeUtc, ')
          ..write('endTimeUtc: $endTimeUtc, ')
          ..write('durationSeconds: $durationSeconds, ')
          ..write('createdAtUtc: $createdAtUtc')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
    id,
    packageName,
    appName,
    startTimeUtc,
    endTimeUtc,
    durationSeconds,
    createdAtUtc,
  );
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is UsageSessionEntry &&
          other.id == this.id &&
          other.packageName == this.packageName &&
          other.appName == this.appName &&
          other.startTimeUtc == this.startTimeUtc &&
          other.endTimeUtc == this.endTimeUtc &&
          other.durationSeconds == this.durationSeconds &&
          other.createdAtUtc == this.createdAtUtc);
}

class UsageSessionsCompanion extends UpdateCompanion<UsageSessionEntry> {
  final Value<String> id;
  final Value<String> packageName;
  final Value<String> appName;
  final Value<int> startTimeUtc;
  final Value<int> endTimeUtc;
  final Value<int> durationSeconds;
  final Value<int> createdAtUtc;
  final Value<int> rowid;
  const UsageSessionsCompanion({
    this.id = const Value.absent(),
    this.packageName = const Value.absent(),
    this.appName = const Value.absent(),
    this.startTimeUtc = const Value.absent(),
    this.endTimeUtc = const Value.absent(),
    this.durationSeconds = const Value.absent(),
    this.createdAtUtc = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  UsageSessionsCompanion.insert({
    required String id,
    required String packageName,
    required String appName,
    required int startTimeUtc,
    required int endTimeUtc,
    required int durationSeconds,
    required int createdAtUtc,
    this.rowid = const Value.absent(),
  }) : id = Value(id),
       packageName = Value(packageName),
       appName = Value(appName),
       startTimeUtc = Value(startTimeUtc),
       endTimeUtc = Value(endTimeUtc),
       durationSeconds = Value(durationSeconds),
       createdAtUtc = Value(createdAtUtc);
  static Insertable<UsageSessionEntry> custom({
    Expression<String>? id,
    Expression<String>? packageName,
    Expression<String>? appName,
    Expression<int>? startTimeUtc,
    Expression<int>? endTimeUtc,
    Expression<int>? durationSeconds,
    Expression<int>? createdAtUtc,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (packageName != null) 'package_name': packageName,
      if (appName != null) 'app_name': appName,
      if (startTimeUtc != null) 'start_time_utc': startTimeUtc,
      if (endTimeUtc != null) 'end_time_utc': endTimeUtc,
      if (durationSeconds != null) 'duration_seconds': durationSeconds,
      if (createdAtUtc != null) 'created_at_utc': createdAtUtc,
      if (rowid != null) 'rowid': rowid,
    });
  }

  UsageSessionsCompanion copyWith({
    Value<String>? id,
    Value<String>? packageName,
    Value<String>? appName,
    Value<int>? startTimeUtc,
    Value<int>? endTimeUtc,
    Value<int>? durationSeconds,
    Value<int>? createdAtUtc,
    Value<int>? rowid,
  }) {
    return UsageSessionsCompanion(
      id: id ?? this.id,
      packageName: packageName ?? this.packageName,
      appName: appName ?? this.appName,
      startTimeUtc: startTimeUtc ?? this.startTimeUtc,
      endTimeUtc: endTimeUtc ?? this.endTimeUtc,
      durationSeconds: durationSeconds ?? this.durationSeconds,
      createdAtUtc: createdAtUtc ?? this.createdAtUtc,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (packageName.present) {
      map['package_name'] = Variable<String>(packageName.value);
    }
    if (appName.present) {
      map['app_name'] = Variable<String>(appName.value);
    }
    if (startTimeUtc.present) {
      map['start_time_utc'] = Variable<int>(startTimeUtc.value);
    }
    if (endTimeUtc.present) {
      map['end_time_utc'] = Variable<int>(endTimeUtc.value);
    }
    if (durationSeconds.present) {
      map['duration_seconds'] = Variable<int>(durationSeconds.value);
    }
    if (createdAtUtc.present) {
      map['created_at_utc'] = Variable<int>(createdAtUtc.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('UsageSessionsCompanion(')
          ..write('id: $id, ')
          ..write('packageName: $packageName, ')
          ..write('appName: $appName, ')
          ..write('startTimeUtc: $startTimeUtc, ')
          ..write('endTimeUtc: $endTimeUtc, ')
          ..write('durationSeconds: $durationSeconds, ')
          ..write('createdAtUtc: $createdAtUtc, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $AppCategoriesTable extends AppCategories
    with TableInfo<$AppCategoriesTable, AppCategoryEntry> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $AppCategoriesTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _packageNameMeta = const VerificationMeta(
    'packageName',
  );
  @override
  late final GeneratedColumn<String> packageName = GeneratedColumn<String>(
    'package_name',
    aliasedName,
    false,
    additionalChecks: GeneratedColumn.checkTextLength(
      minTextLength: 1,
      maxTextLength: 256,
    ),
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _categoryNameMeta = const VerificationMeta(
    'categoryName',
  );
  @override
  late final GeneratedColumn<String> categoryName = GeneratedColumn<String>(
    'category_name',
    aliasedName,
    false,
    additionalChecks: GeneratedColumn.checkTextLength(
      minTextLength: 1,
      maxTextLength: 128,
    ),
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  @override
  List<GeneratedColumn> get $columns => [packageName, categoryName];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'app_categories';
  @override
  VerificationContext validateIntegrity(
    Insertable<AppCategoryEntry> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('package_name')) {
      context.handle(
        _packageNameMeta,
        packageName.isAcceptableOrUnknown(
          data['package_name']!,
          _packageNameMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_packageNameMeta);
    }
    if (data.containsKey('category_name')) {
      context.handle(
        _categoryNameMeta,
        categoryName.isAcceptableOrUnknown(
          data['category_name']!,
          _categoryNameMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_categoryNameMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {packageName};
  @override
  AppCategoryEntry map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return AppCategoryEntry(
      packageName: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}package_name'],
      )!,
      categoryName: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}category_name'],
      )!,
    );
  }

  @override
  $AppCategoriesTable createAlias(String alias) {
    return $AppCategoriesTable(attachedDatabase, alias);
  }
}

class AppCategoryEntry extends DataClass
    implements Insertable<AppCategoryEntry> {
  final String packageName;
  final String categoryName;
  const AppCategoryEntry({
    required this.packageName,
    required this.categoryName,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['package_name'] = Variable<String>(packageName);
    map['category_name'] = Variable<String>(categoryName);
    return map;
  }

  AppCategoriesCompanion toCompanion(bool nullToAbsent) {
    return AppCategoriesCompanion(
      packageName: Value(packageName),
      categoryName: Value(categoryName),
    );
  }

  factory AppCategoryEntry.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return AppCategoryEntry(
      packageName: serializer.fromJson<String>(json['packageName']),
      categoryName: serializer.fromJson<String>(json['categoryName']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'packageName': serializer.toJson<String>(packageName),
      'categoryName': serializer.toJson<String>(categoryName),
    };
  }

  AppCategoryEntry copyWith({String? packageName, String? categoryName}) =>
      AppCategoryEntry(
        packageName: packageName ?? this.packageName,
        categoryName: categoryName ?? this.categoryName,
      );
  AppCategoryEntry copyWithCompanion(AppCategoriesCompanion data) {
    return AppCategoryEntry(
      packageName: data.packageName.present
          ? data.packageName.value
          : this.packageName,
      categoryName: data.categoryName.present
          ? data.categoryName.value
          : this.categoryName,
    );
  }

  @override
  String toString() {
    return (StringBuffer('AppCategoryEntry(')
          ..write('packageName: $packageName, ')
          ..write('categoryName: $categoryName')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(packageName, categoryName);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is AppCategoryEntry &&
          other.packageName == this.packageName &&
          other.categoryName == this.categoryName);
}

class AppCategoriesCompanion extends UpdateCompanion<AppCategoryEntry> {
  final Value<String> packageName;
  final Value<String> categoryName;
  final Value<int> rowid;
  const AppCategoriesCompanion({
    this.packageName = const Value.absent(),
    this.categoryName = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  AppCategoriesCompanion.insert({
    required String packageName,
    required String categoryName,
    this.rowid = const Value.absent(),
  }) : packageName = Value(packageName),
       categoryName = Value(categoryName);
  static Insertable<AppCategoryEntry> custom({
    Expression<String>? packageName,
    Expression<String>? categoryName,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (packageName != null) 'package_name': packageName,
      if (categoryName != null) 'category_name': categoryName,
      if (rowid != null) 'rowid': rowid,
    });
  }

  AppCategoriesCompanion copyWith({
    Value<String>? packageName,
    Value<String>? categoryName,
    Value<int>? rowid,
  }) {
    return AppCategoriesCompanion(
      packageName: packageName ?? this.packageName,
      categoryName: categoryName ?? this.categoryName,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (packageName.present) {
      map['package_name'] = Variable<String>(packageName.value);
    }
    if (categoryName.present) {
      map['category_name'] = Variable<String>(categoryName.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('AppCategoriesCompanion(')
          ..write('packageName: $packageName, ')
          ..write('categoryName: $categoryName, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $UsageLimitsTable extends UsageLimits
    with TableInfo<$UsageLimitsTable, UsageLimitEntry> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $UsageLimitsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _targetIdMeta = const VerificationMeta(
    'targetId',
  );
  @override
  late final GeneratedColumn<String> targetId = GeneratedColumn<String>(
    'target_id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _limitTypeMeta = const VerificationMeta(
    'limitType',
  );
  @override
  late final GeneratedColumn<String> limitType = GeneratedColumn<String>(
    'limit_type',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _limitDurationMinutesMeta =
      const VerificationMeta('limitDurationMinutes');
  @override
  late final GeneratedColumn<int> limitDurationMinutes = GeneratedColumn<int>(
    'limit_duration_minutes',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: true,
  );
  @override
  List<GeneratedColumn> get $columns => [
    id,
    targetId,
    limitType,
    limitDurationMinutes,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'usage_limits';
  @override
  VerificationContext validateIntegrity(
    Insertable<UsageLimitEntry> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('target_id')) {
      context.handle(
        _targetIdMeta,
        targetId.isAcceptableOrUnknown(data['target_id']!, _targetIdMeta),
      );
    } else if (isInserting) {
      context.missing(_targetIdMeta);
    }
    if (data.containsKey('limit_type')) {
      context.handle(
        _limitTypeMeta,
        limitType.isAcceptableOrUnknown(data['limit_type']!, _limitTypeMeta),
      );
    } else if (isInserting) {
      context.missing(_limitTypeMeta);
    }
    if (data.containsKey('limit_duration_minutes')) {
      context.handle(
        _limitDurationMinutesMeta,
        limitDurationMinutes.isAcceptableOrUnknown(
          data['limit_duration_minutes']!,
          _limitDurationMinutesMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_limitDurationMinutesMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  UsageLimitEntry map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return UsageLimitEntry(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id'],
      )!,
      targetId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}target_id'],
      )!,
      limitType: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}limit_type'],
      )!,
      limitDurationMinutes: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}limit_duration_minutes'],
      )!,
    );
  }

  @override
  $UsageLimitsTable createAlias(String alias) {
    return $UsageLimitsTable(attachedDatabase, alias);
  }
}

class UsageLimitEntry extends DataClass implements Insertable<UsageLimitEntry> {
  final String id;
  final String targetId;
  final String limitType;
  final int limitDurationMinutes;
  const UsageLimitEntry({
    required this.id,
    required this.targetId,
    required this.limitType,
    required this.limitDurationMinutes,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['target_id'] = Variable<String>(targetId);
    map['limit_type'] = Variable<String>(limitType);
    map['limit_duration_minutes'] = Variable<int>(limitDurationMinutes);
    return map;
  }

  UsageLimitsCompanion toCompanion(bool nullToAbsent) {
    return UsageLimitsCompanion(
      id: Value(id),
      targetId: Value(targetId),
      limitType: Value(limitType),
      limitDurationMinutes: Value(limitDurationMinutes),
    );
  }

  factory UsageLimitEntry.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return UsageLimitEntry(
      id: serializer.fromJson<String>(json['id']),
      targetId: serializer.fromJson<String>(json['targetId']),
      limitType: serializer.fromJson<String>(json['limitType']),
      limitDurationMinutes: serializer.fromJson<int>(
        json['limitDurationMinutes'],
      ),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'targetId': serializer.toJson<String>(targetId),
      'limitType': serializer.toJson<String>(limitType),
      'limitDurationMinutes': serializer.toJson<int>(limitDurationMinutes),
    };
  }

  UsageLimitEntry copyWith({
    String? id,
    String? targetId,
    String? limitType,
    int? limitDurationMinutes,
  }) => UsageLimitEntry(
    id: id ?? this.id,
    targetId: targetId ?? this.targetId,
    limitType: limitType ?? this.limitType,
    limitDurationMinutes: limitDurationMinutes ?? this.limitDurationMinutes,
  );
  UsageLimitEntry copyWithCompanion(UsageLimitsCompanion data) {
    return UsageLimitEntry(
      id: data.id.present ? data.id.value : this.id,
      targetId: data.targetId.present ? data.targetId.value : this.targetId,
      limitType: data.limitType.present ? data.limitType.value : this.limitType,
      limitDurationMinutes: data.limitDurationMinutes.present
          ? data.limitDurationMinutes.value
          : this.limitDurationMinutes,
    );
  }

  @override
  String toString() {
    return (StringBuffer('UsageLimitEntry(')
          ..write('id: $id, ')
          ..write('targetId: $targetId, ')
          ..write('limitType: $limitType, ')
          ..write('limitDurationMinutes: $limitDurationMinutes')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode =>
      Object.hash(id, targetId, limitType, limitDurationMinutes);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is UsageLimitEntry &&
          other.id == this.id &&
          other.targetId == this.targetId &&
          other.limitType == this.limitType &&
          other.limitDurationMinutes == this.limitDurationMinutes);
}

class UsageLimitsCompanion extends UpdateCompanion<UsageLimitEntry> {
  final Value<String> id;
  final Value<String> targetId;
  final Value<String> limitType;
  final Value<int> limitDurationMinutes;
  final Value<int> rowid;
  const UsageLimitsCompanion({
    this.id = const Value.absent(),
    this.targetId = const Value.absent(),
    this.limitType = const Value.absent(),
    this.limitDurationMinutes = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  UsageLimitsCompanion.insert({
    required String id,
    required String targetId,
    required String limitType,
    required int limitDurationMinutes,
    this.rowid = const Value.absent(),
  }) : id = Value(id),
       targetId = Value(targetId),
       limitType = Value(limitType),
       limitDurationMinutes = Value(limitDurationMinutes);
  static Insertable<UsageLimitEntry> custom({
    Expression<String>? id,
    Expression<String>? targetId,
    Expression<String>? limitType,
    Expression<int>? limitDurationMinutes,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (targetId != null) 'target_id': targetId,
      if (limitType != null) 'limit_type': limitType,
      if (limitDurationMinutes != null)
        'limit_duration_minutes': limitDurationMinutes,
      if (rowid != null) 'rowid': rowid,
    });
  }

  UsageLimitsCompanion copyWith({
    Value<String>? id,
    Value<String>? targetId,
    Value<String>? limitType,
    Value<int>? limitDurationMinutes,
    Value<int>? rowid,
  }) {
    return UsageLimitsCompanion(
      id: id ?? this.id,
      targetId: targetId ?? this.targetId,
      limitType: limitType ?? this.limitType,
      limitDurationMinutes: limitDurationMinutes ?? this.limitDurationMinutes,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (targetId.present) {
      map['target_id'] = Variable<String>(targetId.value);
    }
    if (limitType.present) {
      map['limit_type'] = Variable<String>(limitType.value);
    }
    if (limitDurationMinutes.present) {
      map['limit_duration_minutes'] = Variable<int>(limitDurationMinutes.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('UsageLimitsCompanion(')
          ..write('id: $id, ')
          ..write('targetId: $targetId, ')
          ..write('limitType: $limitType, ')
          ..write('limitDurationMinutes: $limitDurationMinutes, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $DocumentItemsTable extends DocumentItems
    with TableInfo<$DocumentItemsTable, DocumentItemEntry> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $DocumentItemsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _titleMeta = const VerificationMeta('title');
  @override
  late final GeneratedColumn<String> title = GeneratedColumn<String>(
    'title',
    aliasedName,
    false,
    additionalChecks: GeneratedColumn.checkTextLength(
      minTextLength: 1,
      maxTextLength: 256,
    ),
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _mimeTypeMeta = const VerificationMeta(
    'mimeType',
  );
  @override
  late final GeneratedColumn<String> mimeType = GeneratedColumn<String>(
    'mime_type',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
    defaultValue: const Constant('application/json'),
  );
  static const VerificationMeta _filePathMeta = const VerificationMeta(
    'filePath',
  );
  @override
  late final GeneratedColumn<String> filePath = GeneratedColumn<String>(
    'file_path',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _contentStructuredJsonMeta =
      const VerificationMeta('contentStructuredJson');
  @override
  late final GeneratedColumn<String> contentStructuredJson =
      GeneratedColumn<String>(
        'content_structured_json',
        aliasedName,
        true,
        type: DriftSqlType.string,
        requiredDuringInsert: false,
      );
  static const VerificationMeta _fileSizeBytesMeta = const VerificationMeta(
    'fileSizeBytes',
  );
  @override
  late final GeneratedColumn<int> fileSizeBytes = GeneratedColumn<int>(
    'file_size_bytes',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: false,
    defaultValue: const Constant(0),
  );
  static const VerificationMeta _createdAtUtcMeta = const VerificationMeta(
    'createdAtUtc',
  );
  @override
  late final GeneratedColumn<int> createdAtUtc = GeneratedColumn<int>(
    'created_at_utc',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _updatedAtUtcMeta = const VerificationMeta(
    'updatedAtUtc',
  );
  @override
  late final GeneratedColumn<int> updatedAtUtc = GeneratedColumn<int>(
    'updated_at_utc',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: true,
  );
  @override
  List<GeneratedColumn> get $columns => [
    id,
    title,
    mimeType,
    filePath,
    contentStructuredJson,
    fileSizeBytes,
    createdAtUtc,
    updatedAtUtc,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'document_items';
  @override
  VerificationContext validateIntegrity(
    Insertable<DocumentItemEntry> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('title')) {
      context.handle(
        _titleMeta,
        title.isAcceptableOrUnknown(data['title']!, _titleMeta),
      );
    } else if (isInserting) {
      context.missing(_titleMeta);
    }
    if (data.containsKey('mime_type')) {
      context.handle(
        _mimeTypeMeta,
        mimeType.isAcceptableOrUnknown(data['mime_type']!, _mimeTypeMeta),
      );
    }
    if (data.containsKey('file_path')) {
      context.handle(
        _filePathMeta,
        filePath.isAcceptableOrUnknown(data['file_path']!, _filePathMeta),
      );
    }
    if (data.containsKey('content_structured_json')) {
      context.handle(
        _contentStructuredJsonMeta,
        contentStructuredJson.isAcceptableOrUnknown(
          data['content_structured_json']!,
          _contentStructuredJsonMeta,
        ),
      );
    }
    if (data.containsKey('file_size_bytes')) {
      context.handle(
        _fileSizeBytesMeta,
        fileSizeBytes.isAcceptableOrUnknown(
          data['file_size_bytes']!,
          _fileSizeBytesMeta,
        ),
      );
    }
    if (data.containsKey('created_at_utc')) {
      context.handle(
        _createdAtUtcMeta,
        createdAtUtc.isAcceptableOrUnknown(
          data['created_at_utc']!,
          _createdAtUtcMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_createdAtUtcMeta);
    }
    if (data.containsKey('updated_at_utc')) {
      context.handle(
        _updatedAtUtcMeta,
        updatedAtUtc.isAcceptableOrUnknown(
          data['updated_at_utc']!,
          _updatedAtUtcMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_updatedAtUtcMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  DocumentItemEntry map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return DocumentItemEntry(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id'],
      )!,
      title: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}title'],
      )!,
      mimeType: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}mime_type'],
      )!,
      filePath: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}file_path'],
      ),
      contentStructuredJson: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}content_structured_json'],
      ),
      fileSizeBytes: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}file_size_bytes'],
      )!,
      createdAtUtc: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}created_at_utc'],
      )!,
      updatedAtUtc: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}updated_at_utc'],
      )!,
    );
  }

  @override
  $DocumentItemsTable createAlias(String alias) {
    return $DocumentItemsTable(attachedDatabase, alias);
  }
}

class DocumentItemEntry extends DataClass
    implements Insertable<DocumentItemEntry> {
  final String id;
  final String title;
  final String mimeType;
  final String? filePath;
  final String? contentStructuredJson;
  final int fileSizeBytes;
  final int createdAtUtc;
  final int updatedAtUtc;
  const DocumentItemEntry({
    required this.id,
    required this.title,
    required this.mimeType,
    this.filePath,
    this.contentStructuredJson,
    required this.fileSizeBytes,
    required this.createdAtUtc,
    required this.updatedAtUtc,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['title'] = Variable<String>(title);
    map['mime_type'] = Variable<String>(mimeType);
    if (!nullToAbsent || filePath != null) {
      map['file_path'] = Variable<String>(filePath);
    }
    if (!nullToAbsent || contentStructuredJson != null) {
      map['content_structured_json'] = Variable<String>(contentStructuredJson);
    }
    map['file_size_bytes'] = Variable<int>(fileSizeBytes);
    map['created_at_utc'] = Variable<int>(createdAtUtc);
    map['updated_at_utc'] = Variable<int>(updatedAtUtc);
    return map;
  }

  DocumentItemsCompanion toCompanion(bool nullToAbsent) {
    return DocumentItemsCompanion(
      id: Value(id),
      title: Value(title),
      mimeType: Value(mimeType),
      filePath: filePath == null && nullToAbsent
          ? const Value.absent()
          : Value(filePath),
      contentStructuredJson: contentStructuredJson == null && nullToAbsent
          ? const Value.absent()
          : Value(contentStructuredJson),
      fileSizeBytes: Value(fileSizeBytes),
      createdAtUtc: Value(createdAtUtc),
      updatedAtUtc: Value(updatedAtUtc),
    );
  }

  factory DocumentItemEntry.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return DocumentItemEntry(
      id: serializer.fromJson<String>(json['id']),
      title: serializer.fromJson<String>(json['title']),
      mimeType: serializer.fromJson<String>(json['mimeType']),
      filePath: serializer.fromJson<String?>(json['filePath']),
      contentStructuredJson: serializer.fromJson<String?>(
        json['contentStructuredJson'],
      ),
      fileSizeBytes: serializer.fromJson<int>(json['fileSizeBytes']),
      createdAtUtc: serializer.fromJson<int>(json['createdAtUtc']),
      updatedAtUtc: serializer.fromJson<int>(json['updatedAtUtc']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'title': serializer.toJson<String>(title),
      'mimeType': serializer.toJson<String>(mimeType),
      'filePath': serializer.toJson<String?>(filePath),
      'contentStructuredJson': serializer.toJson<String?>(
        contentStructuredJson,
      ),
      'fileSizeBytes': serializer.toJson<int>(fileSizeBytes),
      'createdAtUtc': serializer.toJson<int>(createdAtUtc),
      'updatedAtUtc': serializer.toJson<int>(updatedAtUtc),
    };
  }

  DocumentItemEntry copyWith({
    String? id,
    String? title,
    String? mimeType,
    Value<String?> filePath = const Value.absent(),
    Value<String?> contentStructuredJson = const Value.absent(),
    int? fileSizeBytes,
    int? createdAtUtc,
    int? updatedAtUtc,
  }) => DocumentItemEntry(
    id: id ?? this.id,
    title: title ?? this.title,
    mimeType: mimeType ?? this.mimeType,
    filePath: filePath.present ? filePath.value : this.filePath,
    contentStructuredJson: contentStructuredJson.present
        ? contentStructuredJson.value
        : this.contentStructuredJson,
    fileSizeBytes: fileSizeBytes ?? this.fileSizeBytes,
    createdAtUtc: createdAtUtc ?? this.createdAtUtc,
    updatedAtUtc: updatedAtUtc ?? this.updatedAtUtc,
  );
  DocumentItemEntry copyWithCompanion(DocumentItemsCompanion data) {
    return DocumentItemEntry(
      id: data.id.present ? data.id.value : this.id,
      title: data.title.present ? data.title.value : this.title,
      mimeType: data.mimeType.present ? data.mimeType.value : this.mimeType,
      filePath: data.filePath.present ? data.filePath.value : this.filePath,
      contentStructuredJson: data.contentStructuredJson.present
          ? data.contentStructuredJson.value
          : this.contentStructuredJson,
      fileSizeBytes: data.fileSizeBytes.present
          ? data.fileSizeBytes.value
          : this.fileSizeBytes,
      createdAtUtc: data.createdAtUtc.present
          ? data.createdAtUtc.value
          : this.createdAtUtc,
      updatedAtUtc: data.updatedAtUtc.present
          ? data.updatedAtUtc.value
          : this.updatedAtUtc,
    );
  }

  @override
  String toString() {
    return (StringBuffer('DocumentItemEntry(')
          ..write('id: $id, ')
          ..write('title: $title, ')
          ..write('mimeType: $mimeType, ')
          ..write('filePath: $filePath, ')
          ..write('contentStructuredJson: $contentStructuredJson, ')
          ..write('fileSizeBytes: $fileSizeBytes, ')
          ..write('createdAtUtc: $createdAtUtc, ')
          ..write('updatedAtUtc: $updatedAtUtc')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
    id,
    title,
    mimeType,
    filePath,
    contentStructuredJson,
    fileSizeBytes,
    createdAtUtc,
    updatedAtUtc,
  );
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is DocumentItemEntry &&
          other.id == this.id &&
          other.title == this.title &&
          other.mimeType == this.mimeType &&
          other.filePath == this.filePath &&
          other.contentStructuredJson == this.contentStructuredJson &&
          other.fileSizeBytes == this.fileSizeBytes &&
          other.createdAtUtc == this.createdAtUtc &&
          other.updatedAtUtc == this.updatedAtUtc);
}

class DocumentItemsCompanion extends UpdateCompanion<DocumentItemEntry> {
  final Value<String> id;
  final Value<String> title;
  final Value<String> mimeType;
  final Value<String?> filePath;
  final Value<String?> contentStructuredJson;
  final Value<int> fileSizeBytes;
  final Value<int> createdAtUtc;
  final Value<int> updatedAtUtc;
  final Value<int> rowid;
  const DocumentItemsCompanion({
    this.id = const Value.absent(),
    this.title = const Value.absent(),
    this.mimeType = const Value.absent(),
    this.filePath = const Value.absent(),
    this.contentStructuredJson = const Value.absent(),
    this.fileSizeBytes = const Value.absent(),
    this.createdAtUtc = const Value.absent(),
    this.updatedAtUtc = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  DocumentItemsCompanion.insert({
    required String id,
    required String title,
    this.mimeType = const Value.absent(),
    this.filePath = const Value.absent(),
    this.contentStructuredJson = const Value.absent(),
    this.fileSizeBytes = const Value.absent(),
    required int createdAtUtc,
    required int updatedAtUtc,
    this.rowid = const Value.absent(),
  }) : id = Value(id),
       title = Value(title),
       createdAtUtc = Value(createdAtUtc),
       updatedAtUtc = Value(updatedAtUtc);
  static Insertable<DocumentItemEntry> custom({
    Expression<String>? id,
    Expression<String>? title,
    Expression<String>? mimeType,
    Expression<String>? filePath,
    Expression<String>? contentStructuredJson,
    Expression<int>? fileSizeBytes,
    Expression<int>? createdAtUtc,
    Expression<int>? updatedAtUtc,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (title != null) 'title': title,
      if (mimeType != null) 'mime_type': mimeType,
      if (filePath != null) 'file_path': filePath,
      if (contentStructuredJson != null)
        'content_structured_json': contentStructuredJson,
      if (fileSizeBytes != null) 'file_size_bytes': fileSizeBytes,
      if (createdAtUtc != null) 'created_at_utc': createdAtUtc,
      if (updatedAtUtc != null) 'updated_at_utc': updatedAtUtc,
      if (rowid != null) 'rowid': rowid,
    });
  }

  DocumentItemsCompanion copyWith({
    Value<String>? id,
    Value<String>? title,
    Value<String>? mimeType,
    Value<String?>? filePath,
    Value<String?>? contentStructuredJson,
    Value<int>? fileSizeBytes,
    Value<int>? createdAtUtc,
    Value<int>? updatedAtUtc,
    Value<int>? rowid,
  }) {
    return DocumentItemsCompanion(
      id: id ?? this.id,
      title: title ?? this.title,
      mimeType: mimeType ?? this.mimeType,
      filePath: filePath ?? this.filePath,
      contentStructuredJson:
          contentStructuredJson ?? this.contentStructuredJson,
      fileSizeBytes: fileSizeBytes ?? this.fileSizeBytes,
      createdAtUtc: createdAtUtc ?? this.createdAtUtc,
      updatedAtUtc: updatedAtUtc ?? this.updatedAtUtc,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (title.present) {
      map['title'] = Variable<String>(title.value);
    }
    if (mimeType.present) {
      map['mime_type'] = Variable<String>(mimeType.value);
    }
    if (filePath.present) {
      map['file_path'] = Variable<String>(filePath.value);
    }
    if (contentStructuredJson.present) {
      map['content_structured_json'] = Variable<String>(
        contentStructuredJson.value,
      );
    }
    if (fileSizeBytes.present) {
      map['file_size_bytes'] = Variable<int>(fileSizeBytes.value);
    }
    if (createdAtUtc.present) {
      map['created_at_utc'] = Variable<int>(createdAtUtc.value);
    }
    if (updatedAtUtc.present) {
      map['updated_at_utc'] = Variable<int>(updatedAtUtc.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('DocumentItemsCompanion(')
          ..write('id: $id, ')
          ..write('title: $title, ')
          ..write('mimeType: $mimeType, ')
          ..write('filePath: $filePath, ')
          ..write('contentStructuredJson: $contentStructuredJson, ')
          ..write('fileSizeBytes: $fileSizeBytes, ')
          ..write('createdAtUtc: $createdAtUtc, ')
          ..write('updatedAtUtc: $updatedAtUtc, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $DocumentPagesTable extends DocumentPages
    with TableInfo<$DocumentPagesTable, DocumentPageEntry> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $DocumentPagesTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _documentIdMeta = const VerificationMeta(
    'documentId',
  );
  @override
  late final GeneratedColumn<String> documentId = GeneratedColumn<String>(
    'document_id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'REFERENCES document_items (id) ON DELETE CASCADE',
    ),
  );
  static const VerificationMeta _pageIndexMeta = const VerificationMeta(
    'pageIndex',
  );
  @override
  late final GeneratedColumn<int> pageIndex = GeneratedColumn<int>(
    'page_index',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _backgroundColorMeta = const VerificationMeta(
    'backgroundColor',
  );
  @override
  late final GeneratedColumn<int> backgroundColor = GeneratedColumn<int>(
    'background_color',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: false,
    defaultValue: const Constant(0xFFFFFFFF),
  );
  static const VerificationMeta _textContentJsonMeta = const VerificationMeta(
    'textContentJson',
  );
  @override
  late final GeneratedColumn<String> textContentJson = GeneratedColumn<String>(
    'text_content_json',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
    defaultValue: const Constant('[]'),
  );
  static const VerificationMeta _drawingContentJsonMeta =
      const VerificationMeta('drawingContentJson');
  @override
  late final GeneratedColumn<String> drawingContentJson =
      GeneratedColumn<String>(
        'drawing_content_json',
        aliasedName,
        false,
        type: DriftSqlType.string,
        requiredDuringInsert: false,
        defaultValue: const Constant('[]'),
      );
  @override
  List<GeneratedColumn> get $columns => [
    id,
    documentId,
    pageIndex,
    backgroundColor,
    textContentJson,
    drawingContentJson,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'document_pages';
  @override
  VerificationContext validateIntegrity(
    Insertable<DocumentPageEntry> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('document_id')) {
      context.handle(
        _documentIdMeta,
        documentId.isAcceptableOrUnknown(data['document_id']!, _documentIdMeta),
      );
    } else if (isInserting) {
      context.missing(_documentIdMeta);
    }
    if (data.containsKey('page_index')) {
      context.handle(
        _pageIndexMeta,
        pageIndex.isAcceptableOrUnknown(data['page_index']!, _pageIndexMeta),
      );
    } else if (isInserting) {
      context.missing(_pageIndexMeta);
    }
    if (data.containsKey('background_color')) {
      context.handle(
        _backgroundColorMeta,
        backgroundColor.isAcceptableOrUnknown(
          data['background_color']!,
          _backgroundColorMeta,
        ),
      );
    }
    if (data.containsKey('text_content_json')) {
      context.handle(
        _textContentJsonMeta,
        textContentJson.isAcceptableOrUnknown(
          data['text_content_json']!,
          _textContentJsonMeta,
        ),
      );
    }
    if (data.containsKey('drawing_content_json')) {
      context.handle(
        _drawingContentJsonMeta,
        drawingContentJson.isAcceptableOrUnknown(
          data['drawing_content_json']!,
          _drawingContentJsonMeta,
        ),
      );
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  DocumentPageEntry map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return DocumentPageEntry(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id'],
      )!,
      documentId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}document_id'],
      )!,
      pageIndex: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}page_index'],
      )!,
      backgroundColor: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}background_color'],
      )!,
      textContentJson: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}text_content_json'],
      )!,
      drawingContentJson: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}drawing_content_json'],
      )!,
    );
  }

  @override
  $DocumentPagesTable createAlias(String alias) {
    return $DocumentPagesTable(attachedDatabase, alias);
  }
}

class DocumentPageEntry extends DataClass
    implements Insertable<DocumentPageEntry> {
  final String id;
  final String documentId;
  final int pageIndex;
  final int backgroundColor;
  final String textContentJson;
  final String drawingContentJson;
  const DocumentPageEntry({
    required this.id,
    required this.documentId,
    required this.pageIndex,
    required this.backgroundColor,
    required this.textContentJson,
    required this.drawingContentJson,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['document_id'] = Variable<String>(documentId);
    map['page_index'] = Variable<int>(pageIndex);
    map['background_color'] = Variable<int>(backgroundColor);
    map['text_content_json'] = Variable<String>(textContentJson);
    map['drawing_content_json'] = Variable<String>(drawingContentJson);
    return map;
  }

  DocumentPagesCompanion toCompanion(bool nullToAbsent) {
    return DocumentPagesCompanion(
      id: Value(id),
      documentId: Value(documentId),
      pageIndex: Value(pageIndex),
      backgroundColor: Value(backgroundColor),
      textContentJson: Value(textContentJson),
      drawingContentJson: Value(drawingContentJson),
    );
  }

  factory DocumentPageEntry.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return DocumentPageEntry(
      id: serializer.fromJson<String>(json['id']),
      documentId: serializer.fromJson<String>(json['documentId']),
      pageIndex: serializer.fromJson<int>(json['pageIndex']),
      backgroundColor: serializer.fromJson<int>(json['backgroundColor']),
      textContentJson: serializer.fromJson<String>(json['textContentJson']),
      drawingContentJson: serializer.fromJson<String>(
        json['drawingContentJson'],
      ),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'documentId': serializer.toJson<String>(documentId),
      'pageIndex': serializer.toJson<int>(pageIndex),
      'backgroundColor': serializer.toJson<int>(backgroundColor),
      'textContentJson': serializer.toJson<String>(textContentJson),
      'drawingContentJson': serializer.toJson<String>(drawingContentJson),
    };
  }

  DocumentPageEntry copyWith({
    String? id,
    String? documentId,
    int? pageIndex,
    int? backgroundColor,
    String? textContentJson,
    String? drawingContentJson,
  }) => DocumentPageEntry(
    id: id ?? this.id,
    documentId: documentId ?? this.documentId,
    pageIndex: pageIndex ?? this.pageIndex,
    backgroundColor: backgroundColor ?? this.backgroundColor,
    textContentJson: textContentJson ?? this.textContentJson,
    drawingContentJson: drawingContentJson ?? this.drawingContentJson,
  );
  DocumentPageEntry copyWithCompanion(DocumentPagesCompanion data) {
    return DocumentPageEntry(
      id: data.id.present ? data.id.value : this.id,
      documentId: data.documentId.present
          ? data.documentId.value
          : this.documentId,
      pageIndex: data.pageIndex.present ? data.pageIndex.value : this.pageIndex,
      backgroundColor: data.backgroundColor.present
          ? data.backgroundColor.value
          : this.backgroundColor,
      textContentJson: data.textContentJson.present
          ? data.textContentJson.value
          : this.textContentJson,
      drawingContentJson: data.drawingContentJson.present
          ? data.drawingContentJson.value
          : this.drawingContentJson,
    );
  }

  @override
  String toString() {
    return (StringBuffer('DocumentPageEntry(')
          ..write('id: $id, ')
          ..write('documentId: $documentId, ')
          ..write('pageIndex: $pageIndex, ')
          ..write('backgroundColor: $backgroundColor, ')
          ..write('textContentJson: $textContentJson, ')
          ..write('drawingContentJson: $drawingContentJson')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
    id,
    documentId,
    pageIndex,
    backgroundColor,
    textContentJson,
    drawingContentJson,
  );
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is DocumentPageEntry &&
          other.id == this.id &&
          other.documentId == this.documentId &&
          other.pageIndex == this.pageIndex &&
          other.backgroundColor == this.backgroundColor &&
          other.textContentJson == this.textContentJson &&
          other.drawingContentJson == this.drawingContentJson);
}

class DocumentPagesCompanion extends UpdateCompanion<DocumentPageEntry> {
  final Value<String> id;
  final Value<String> documentId;
  final Value<int> pageIndex;
  final Value<int> backgroundColor;
  final Value<String> textContentJson;
  final Value<String> drawingContentJson;
  final Value<int> rowid;
  const DocumentPagesCompanion({
    this.id = const Value.absent(),
    this.documentId = const Value.absent(),
    this.pageIndex = const Value.absent(),
    this.backgroundColor = const Value.absent(),
    this.textContentJson = const Value.absent(),
    this.drawingContentJson = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  DocumentPagesCompanion.insert({
    required String id,
    required String documentId,
    required int pageIndex,
    this.backgroundColor = const Value.absent(),
    this.textContentJson = const Value.absent(),
    this.drawingContentJson = const Value.absent(),
    this.rowid = const Value.absent(),
  }) : id = Value(id),
       documentId = Value(documentId),
       pageIndex = Value(pageIndex);
  static Insertable<DocumentPageEntry> custom({
    Expression<String>? id,
    Expression<String>? documentId,
    Expression<int>? pageIndex,
    Expression<int>? backgroundColor,
    Expression<String>? textContentJson,
    Expression<String>? drawingContentJson,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (documentId != null) 'document_id': documentId,
      if (pageIndex != null) 'page_index': pageIndex,
      if (backgroundColor != null) 'background_color': backgroundColor,
      if (textContentJson != null) 'text_content_json': textContentJson,
      if (drawingContentJson != null)
        'drawing_content_json': drawingContentJson,
      if (rowid != null) 'rowid': rowid,
    });
  }

  DocumentPagesCompanion copyWith({
    Value<String>? id,
    Value<String>? documentId,
    Value<int>? pageIndex,
    Value<int>? backgroundColor,
    Value<String>? textContentJson,
    Value<String>? drawingContentJson,
    Value<int>? rowid,
  }) {
    return DocumentPagesCompanion(
      id: id ?? this.id,
      documentId: documentId ?? this.documentId,
      pageIndex: pageIndex ?? this.pageIndex,
      backgroundColor: backgroundColor ?? this.backgroundColor,
      textContentJson: textContentJson ?? this.textContentJson,
      drawingContentJson: drawingContentJson ?? this.drawingContentJson,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (documentId.present) {
      map['document_id'] = Variable<String>(documentId.value);
    }
    if (pageIndex.present) {
      map['page_index'] = Variable<int>(pageIndex.value);
    }
    if (backgroundColor.present) {
      map['background_color'] = Variable<int>(backgroundColor.value);
    }
    if (textContentJson.present) {
      map['text_content_json'] = Variable<String>(textContentJson.value);
    }
    if (drawingContentJson.present) {
      map['drawing_content_json'] = Variable<String>(drawingContentJson.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('DocumentPagesCompanion(')
          ..write('id: $id, ')
          ..write('documentId: $documentId, ')
          ..write('pageIndex: $pageIndex, ')
          ..write('backgroundColor: $backgroundColor, ')
          ..write('textContentJson: $textContentJson, ')
          ..write('drawingContentJson: $drawingContentJson, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $MusicPlaylistsTable extends MusicPlaylists
    with TableInfo<$MusicPlaylistsTable, MusicPlaylist> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $MusicPlaylistsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _nameMeta = const VerificationMeta('name');
  @override
  late final GeneratedColumn<String> name = GeneratedColumn<String>(
    'name',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _createdAtMeta = const VerificationMeta(
    'createdAt',
  );
  @override
  late final GeneratedColumn<DateTime> createdAt = GeneratedColumn<DateTime>(
    'created_at',
    aliasedName,
    false,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: true,
  );
  @override
  List<GeneratedColumn> get $columns => [id, name, createdAt];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'music_playlists';
  @override
  VerificationContext validateIntegrity(
    Insertable<MusicPlaylist> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('name')) {
      context.handle(
        _nameMeta,
        name.isAcceptableOrUnknown(data['name']!, _nameMeta),
      );
    } else if (isInserting) {
      context.missing(_nameMeta);
    }
    if (data.containsKey('created_at')) {
      context.handle(
        _createdAtMeta,
        createdAt.isAcceptableOrUnknown(data['created_at']!, _createdAtMeta),
      );
    } else if (isInserting) {
      context.missing(_createdAtMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  MusicPlaylist map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return MusicPlaylist(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id'],
      )!,
      name: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}name'],
      )!,
      createdAt: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}created_at'],
      )!,
    );
  }

  @override
  $MusicPlaylistsTable createAlias(String alias) {
    return $MusicPlaylistsTable(attachedDatabase, alias);
  }
}

class MusicPlaylist extends DataClass implements Insertable<MusicPlaylist> {
  final String id;
  final String name;
  final DateTime createdAt;
  const MusicPlaylist({
    required this.id,
    required this.name,
    required this.createdAt,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['name'] = Variable<String>(name);
    map['created_at'] = Variable<DateTime>(createdAt);
    return map;
  }

  MusicPlaylistsCompanion toCompanion(bool nullToAbsent) {
    return MusicPlaylistsCompanion(
      id: Value(id),
      name: Value(name),
      createdAt: Value(createdAt),
    );
  }

  factory MusicPlaylist.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return MusicPlaylist(
      id: serializer.fromJson<String>(json['id']),
      name: serializer.fromJson<String>(json['name']),
      createdAt: serializer.fromJson<DateTime>(json['createdAt']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'name': serializer.toJson<String>(name),
      'createdAt': serializer.toJson<DateTime>(createdAt),
    };
  }

  MusicPlaylist copyWith({String? id, String? name, DateTime? createdAt}) =>
      MusicPlaylist(
        id: id ?? this.id,
        name: name ?? this.name,
        createdAt: createdAt ?? this.createdAt,
      );
  MusicPlaylist copyWithCompanion(MusicPlaylistsCompanion data) {
    return MusicPlaylist(
      id: data.id.present ? data.id.value : this.id,
      name: data.name.present ? data.name.value : this.name,
      createdAt: data.createdAt.present ? data.createdAt.value : this.createdAt,
    );
  }

  @override
  String toString() {
    return (StringBuffer('MusicPlaylist(')
          ..write('id: $id, ')
          ..write('name: $name, ')
          ..write('createdAt: $createdAt')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(id, name, createdAt);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is MusicPlaylist &&
          other.id == this.id &&
          other.name == this.name &&
          other.createdAt == this.createdAt);
}

class MusicPlaylistsCompanion extends UpdateCompanion<MusicPlaylist> {
  final Value<String> id;
  final Value<String> name;
  final Value<DateTime> createdAt;
  final Value<int> rowid;
  const MusicPlaylistsCompanion({
    this.id = const Value.absent(),
    this.name = const Value.absent(),
    this.createdAt = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  MusicPlaylistsCompanion.insert({
    required String id,
    required String name,
    required DateTime createdAt,
    this.rowid = const Value.absent(),
  }) : id = Value(id),
       name = Value(name),
       createdAt = Value(createdAt);
  static Insertable<MusicPlaylist> custom({
    Expression<String>? id,
    Expression<String>? name,
    Expression<DateTime>? createdAt,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (name != null) 'name': name,
      if (createdAt != null) 'created_at': createdAt,
      if (rowid != null) 'rowid': rowid,
    });
  }

  MusicPlaylistsCompanion copyWith({
    Value<String>? id,
    Value<String>? name,
    Value<DateTime>? createdAt,
    Value<int>? rowid,
  }) {
    return MusicPlaylistsCompanion(
      id: id ?? this.id,
      name: name ?? this.name,
      createdAt: createdAt ?? this.createdAt,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (name.present) {
      map['name'] = Variable<String>(name.value);
    }
    if (createdAt.present) {
      map['created_at'] = Variable<DateTime>(createdAt.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('MusicPlaylistsCompanion(')
          ..write('id: $id, ')
          ..write('name: $name, ')
          ..write('createdAt: $createdAt, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $PlaylistSongsTable extends PlaylistSongs
    with TableInfo<$PlaylistSongsTable, PlaylistSong> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $PlaylistSongsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _playlistIdMeta = const VerificationMeta(
    'playlistId',
  );
  @override
  late final GeneratedColumn<String> playlistId = GeneratedColumn<String>(
    'playlist_id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'REFERENCES music_playlists (id) ON DELETE CASCADE',
    ),
  );
  static const VerificationMeta _songPathMeta = const VerificationMeta(
    'songPath',
  );
  @override
  late final GeneratedColumn<String> songPath = GeneratedColumn<String>(
    'song_path',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _sortOrderMeta = const VerificationMeta(
    'sortOrder',
  );
  @override
  late final GeneratedColumn<int> sortOrder = GeneratedColumn<int>(
    'sort_order',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: false,
    defaultValue: const Constant(0),
  );
  @override
  List<GeneratedColumn> get $columns => [playlistId, songPath, sortOrder];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'playlist_songs';
  @override
  VerificationContext validateIntegrity(
    Insertable<PlaylistSong> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('playlist_id')) {
      context.handle(
        _playlistIdMeta,
        playlistId.isAcceptableOrUnknown(data['playlist_id']!, _playlistIdMeta),
      );
    } else if (isInserting) {
      context.missing(_playlistIdMeta);
    }
    if (data.containsKey('song_path')) {
      context.handle(
        _songPathMeta,
        songPath.isAcceptableOrUnknown(data['song_path']!, _songPathMeta),
      );
    } else if (isInserting) {
      context.missing(_songPathMeta);
    }
    if (data.containsKey('sort_order')) {
      context.handle(
        _sortOrderMeta,
        sortOrder.isAcceptableOrUnknown(data['sort_order']!, _sortOrderMeta),
      );
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {playlistId, songPath};
  @override
  PlaylistSong map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return PlaylistSong(
      playlistId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}playlist_id'],
      )!,
      songPath: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}song_path'],
      )!,
      sortOrder: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}sort_order'],
      )!,
    );
  }

  @override
  $PlaylistSongsTable createAlias(String alias) {
    return $PlaylistSongsTable(attachedDatabase, alias);
  }
}

class PlaylistSong extends DataClass implements Insertable<PlaylistSong> {
  final String playlistId;
  final String songPath;
  final int sortOrder;
  const PlaylistSong({
    required this.playlistId,
    required this.songPath,
    required this.sortOrder,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['playlist_id'] = Variable<String>(playlistId);
    map['song_path'] = Variable<String>(songPath);
    map['sort_order'] = Variable<int>(sortOrder);
    return map;
  }

  PlaylistSongsCompanion toCompanion(bool nullToAbsent) {
    return PlaylistSongsCompanion(
      playlistId: Value(playlistId),
      songPath: Value(songPath),
      sortOrder: Value(sortOrder),
    );
  }

  factory PlaylistSong.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return PlaylistSong(
      playlistId: serializer.fromJson<String>(json['playlistId']),
      songPath: serializer.fromJson<String>(json['songPath']),
      sortOrder: serializer.fromJson<int>(json['sortOrder']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'playlistId': serializer.toJson<String>(playlistId),
      'songPath': serializer.toJson<String>(songPath),
      'sortOrder': serializer.toJson<int>(sortOrder),
    };
  }

  PlaylistSong copyWith({
    String? playlistId,
    String? songPath,
    int? sortOrder,
  }) => PlaylistSong(
    playlistId: playlistId ?? this.playlistId,
    songPath: songPath ?? this.songPath,
    sortOrder: sortOrder ?? this.sortOrder,
  );
  PlaylistSong copyWithCompanion(PlaylistSongsCompanion data) {
    return PlaylistSong(
      playlistId: data.playlistId.present
          ? data.playlistId.value
          : this.playlistId,
      songPath: data.songPath.present ? data.songPath.value : this.songPath,
      sortOrder: data.sortOrder.present ? data.sortOrder.value : this.sortOrder,
    );
  }

  @override
  String toString() {
    return (StringBuffer('PlaylistSong(')
          ..write('playlistId: $playlistId, ')
          ..write('songPath: $songPath, ')
          ..write('sortOrder: $sortOrder')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(playlistId, songPath, sortOrder);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is PlaylistSong &&
          other.playlistId == this.playlistId &&
          other.songPath == this.songPath &&
          other.sortOrder == this.sortOrder);
}

class PlaylistSongsCompanion extends UpdateCompanion<PlaylistSong> {
  final Value<String> playlistId;
  final Value<String> songPath;
  final Value<int> sortOrder;
  final Value<int> rowid;
  const PlaylistSongsCompanion({
    this.playlistId = const Value.absent(),
    this.songPath = const Value.absent(),
    this.sortOrder = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  PlaylistSongsCompanion.insert({
    required String playlistId,
    required String songPath,
    this.sortOrder = const Value.absent(),
    this.rowid = const Value.absent(),
  }) : playlistId = Value(playlistId),
       songPath = Value(songPath);
  static Insertable<PlaylistSong> custom({
    Expression<String>? playlistId,
    Expression<String>? songPath,
    Expression<int>? sortOrder,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (playlistId != null) 'playlist_id': playlistId,
      if (songPath != null) 'song_path': songPath,
      if (sortOrder != null) 'sort_order': sortOrder,
      if (rowid != null) 'rowid': rowid,
    });
  }

  PlaylistSongsCompanion copyWith({
    Value<String>? playlistId,
    Value<String>? songPath,
    Value<int>? sortOrder,
    Value<int>? rowid,
  }) {
    return PlaylistSongsCompanion(
      playlistId: playlistId ?? this.playlistId,
      songPath: songPath ?? this.songPath,
      sortOrder: sortOrder ?? this.sortOrder,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (playlistId.present) {
      map['playlist_id'] = Variable<String>(playlistId.value);
    }
    if (songPath.present) {
      map['song_path'] = Variable<String>(songPath.value);
    }
    if (sortOrder.present) {
      map['sort_order'] = Variable<int>(sortOrder.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('PlaylistSongsCompanion(')
          ..write('playlistId: $playlistId, ')
          ..write('songPath: $songPath, ')
          ..write('sortOrder: $sortOrder, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $SongMetadataTable extends SongMetadata
    with TableInfo<$SongMetadataTable, SongMetadataData> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $SongMetadataTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _songPathMeta = const VerificationMeta(
    'songPath',
  );
  @override
  late final GeneratedColumn<String> songPath = GeneratedColumn<String>(
    'song_path',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _isFavoriteMeta = const VerificationMeta(
    'isFavorite',
  );
  @override
  late final GeneratedColumn<bool> isFavorite = GeneratedColumn<bool>(
    'is_favorite',
    aliasedName,
    false,
    type: DriftSqlType.bool,
    requiredDuringInsert: false,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'CHECK ("is_favorite" IN (0, 1))',
    ),
    defaultValue: const Constant(false),
  );
  static const VerificationMeta _playCountMeta = const VerificationMeta(
    'playCount',
  );
  @override
  late final GeneratedColumn<int> playCount = GeneratedColumn<int>(
    'play_count',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: false,
    defaultValue: const Constant(0),
  );
  static const VerificationMeta _lastPlayedMeta = const VerificationMeta(
    'lastPlayed',
  );
  @override
  late final GeneratedColumn<DateTime> lastPlayed = GeneratedColumn<DateTime>(
    'last_played',
    aliasedName,
    true,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: false,
  );
  @override
  List<GeneratedColumn> get $columns => [
    songPath,
    isFavorite,
    playCount,
    lastPlayed,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'song_metadata';
  @override
  VerificationContext validateIntegrity(
    Insertable<SongMetadataData> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('song_path')) {
      context.handle(
        _songPathMeta,
        songPath.isAcceptableOrUnknown(data['song_path']!, _songPathMeta),
      );
    } else if (isInserting) {
      context.missing(_songPathMeta);
    }
    if (data.containsKey('is_favorite')) {
      context.handle(
        _isFavoriteMeta,
        isFavorite.isAcceptableOrUnknown(data['is_favorite']!, _isFavoriteMeta),
      );
    }
    if (data.containsKey('play_count')) {
      context.handle(
        _playCountMeta,
        playCount.isAcceptableOrUnknown(data['play_count']!, _playCountMeta),
      );
    }
    if (data.containsKey('last_played')) {
      context.handle(
        _lastPlayedMeta,
        lastPlayed.isAcceptableOrUnknown(data['last_played']!, _lastPlayedMeta),
      );
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {songPath};
  @override
  SongMetadataData map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return SongMetadataData(
      songPath: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}song_path'],
      )!,
      isFavorite: attachedDatabase.typeMapping.read(
        DriftSqlType.bool,
        data['${effectivePrefix}is_favorite'],
      )!,
      playCount: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}play_count'],
      )!,
      lastPlayed: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}last_played'],
      ),
    );
  }

  @override
  $SongMetadataTable createAlias(String alias) {
    return $SongMetadataTable(attachedDatabase, alias);
  }
}

class SongMetadataData extends DataClass
    implements Insertable<SongMetadataData> {
  final String songPath;
  final bool isFavorite;
  final int playCount;
  final DateTime? lastPlayed;
  const SongMetadataData({
    required this.songPath,
    required this.isFavorite,
    required this.playCount,
    this.lastPlayed,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['song_path'] = Variable<String>(songPath);
    map['is_favorite'] = Variable<bool>(isFavorite);
    map['play_count'] = Variable<int>(playCount);
    if (!nullToAbsent || lastPlayed != null) {
      map['last_played'] = Variable<DateTime>(lastPlayed);
    }
    return map;
  }

  SongMetadataCompanion toCompanion(bool nullToAbsent) {
    return SongMetadataCompanion(
      songPath: Value(songPath),
      isFavorite: Value(isFavorite),
      playCount: Value(playCount),
      lastPlayed: lastPlayed == null && nullToAbsent
          ? const Value.absent()
          : Value(lastPlayed),
    );
  }

  factory SongMetadataData.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return SongMetadataData(
      songPath: serializer.fromJson<String>(json['songPath']),
      isFavorite: serializer.fromJson<bool>(json['isFavorite']),
      playCount: serializer.fromJson<int>(json['playCount']),
      lastPlayed: serializer.fromJson<DateTime?>(json['lastPlayed']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'songPath': serializer.toJson<String>(songPath),
      'isFavorite': serializer.toJson<bool>(isFavorite),
      'playCount': serializer.toJson<int>(playCount),
      'lastPlayed': serializer.toJson<DateTime?>(lastPlayed),
    };
  }

  SongMetadataData copyWith({
    String? songPath,
    bool? isFavorite,
    int? playCount,
    Value<DateTime?> lastPlayed = const Value.absent(),
  }) => SongMetadataData(
    songPath: songPath ?? this.songPath,
    isFavorite: isFavorite ?? this.isFavorite,
    playCount: playCount ?? this.playCount,
    lastPlayed: lastPlayed.present ? lastPlayed.value : this.lastPlayed,
  );
  SongMetadataData copyWithCompanion(SongMetadataCompanion data) {
    return SongMetadataData(
      songPath: data.songPath.present ? data.songPath.value : this.songPath,
      isFavorite: data.isFavorite.present
          ? data.isFavorite.value
          : this.isFavorite,
      playCount: data.playCount.present ? data.playCount.value : this.playCount,
      lastPlayed: data.lastPlayed.present
          ? data.lastPlayed.value
          : this.lastPlayed,
    );
  }

  @override
  String toString() {
    return (StringBuffer('SongMetadataData(')
          ..write('songPath: $songPath, ')
          ..write('isFavorite: $isFavorite, ')
          ..write('playCount: $playCount, ')
          ..write('lastPlayed: $lastPlayed')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(songPath, isFavorite, playCount, lastPlayed);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is SongMetadataData &&
          other.songPath == this.songPath &&
          other.isFavorite == this.isFavorite &&
          other.playCount == this.playCount &&
          other.lastPlayed == this.lastPlayed);
}

class SongMetadataCompanion extends UpdateCompanion<SongMetadataData> {
  final Value<String> songPath;
  final Value<bool> isFavorite;
  final Value<int> playCount;
  final Value<DateTime?> lastPlayed;
  final Value<int> rowid;
  const SongMetadataCompanion({
    this.songPath = const Value.absent(),
    this.isFavorite = const Value.absent(),
    this.playCount = const Value.absent(),
    this.lastPlayed = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  SongMetadataCompanion.insert({
    required String songPath,
    this.isFavorite = const Value.absent(),
    this.playCount = const Value.absent(),
    this.lastPlayed = const Value.absent(),
    this.rowid = const Value.absent(),
  }) : songPath = Value(songPath);
  static Insertable<SongMetadataData> custom({
    Expression<String>? songPath,
    Expression<bool>? isFavorite,
    Expression<int>? playCount,
    Expression<DateTime>? lastPlayed,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (songPath != null) 'song_path': songPath,
      if (isFavorite != null) 'is_favorite': isFavorite,
      if (playCount != null) 'play_count': playCount,
      if (lastPlayed != null) 'last_played': lastPlayed,
      if (rowid != null) 'rowid': rowid,
    });
  }

  SongMetadataCompanion copyWith({
    Value<String>? songPath,
    Value<bool>? isFavorite,
    Value<int>? playCount,
    Value<DateTime?>? lastPlayed,
    Value<int>? rowid,
  }) {
    return SongMetadataCompanion(
      songPath: songPath ?? this.songPath,
      isFavorite: isFavorite ?? this.isFavorite,
      playCount: playCount ?? this.playCount,
      lastPlayed: lastPlayed ?? this.lastPlayed,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (songPath.present) {
      map['song_path'] = Variable<String>(songPath.value);
    }
    if (isFavorite.present) {
      map['is_favorite'] = Variable<bool>(isFavorite.value);
    }
    if (playCount.present) {
      map['play_count'] = Variable<int>(playCount.value);
    }
    if (lastPlayed.present) {
      map['last_played'] = Variable<DateTime>(lastPlayed.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('SongMetadataCompanion(')
          ..write('songPath: $songPath, ')
          ..write('isFavorite: $isFavorite, ')
          ..write('playCount: $playCount, ')
          ..write('lastPlayed: $lastPlayed, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

abstract class _$AppDatabase extends GeneratedDatabase {
  _$AppDatabase(QueryExecutor e) : super(e);
  $AppDatabaseManager get managers => $AppDatabaseManager(this);
  late final $TagsTable tags = $TagsTable(this);
  late final $EntityCrossLinksTable entityCrossLinks = $EntityCrossLinksTable(
    this,
  );
  late final $CalendarEventsTable calendarEvents = $CalendarEventsTable(this);
  late final $MoneyAccountsTable moneyAccounts = $MoneyAccountsTable(this);
  late final $MoneyCategoriesTable moneyCategories = $MoneyCategoriesTable(
    this,
  );
  late final $TaskListsTable taskLists = $TaskListsTable(this);
  late final $TaskItemsTable taskItems = $TaskItemsTable(this);
  late final $MoneyTransactionsTable moneyTransactions =
      $MoneyTransactionsTable(this);
  late final $MoneyBudgetsTable moneyBudgets = $MoneyBudgetsTable(this);
  late final $SavingsGoalsTable savingsGoals = $SavingsGoalsTable(this);
  late final $DebtsTable debts = $DebtsTable(this);
  late final $RecurringTransactionsTable recurringTransactions =
      $RecurringTransactionsTable(this);
  late final $NoteLabelsTable noteLabels = $NoteLabelsTable(this);
  late final $NoteItemsTable noteItems = $NoteItemsTable(this);
  late final $NoteLabelCrossRefTable noteLabelCrossRef =
      $NoteLabelCrossRefTable(this);
  late final $ChecklistItemsTable checklistItems = $ChecklistItemsTable(this);
  late final $UsageSessionsTable usageSessions = $UsageSessionsTable(this);
  late final $AppCategoriesTable appCategories = $AppCategoriesTable(this);
  late final $UsageLimitsTable usageLimits = $UsageLimitsTable(this);
  late final $DocumentItemsTable documentItems = $DocumentItemsTable(this);
  late final $DocumentPagesTable documentPages = $DocumentPagesTable(this);
  late final $MusicPlaylistsTable musicPlaylists = $MusicPlaylistsTable(this);
  late final $PlaylistSongsTable playlistSongs = $PlaylistSongsTable(this);
  late final $SongMetadataTable songMetadata = $SongMetadataTable(this);
  late final Index idxSourceEntity = Index(
    'idx_source_entity',
    'CREATE INDEX idx_source_entity ON entity_cross_links (source_type, source_id)',
  );
  late final Index idxTargetEntity = Index(
    'idx_target_entity',
    'CREATE INDEX idx_target_entity ON entity_cross_links (target_type, target_id)',
  );
  late final Index idxCalStartTime = Index(
    'idx_cal_start_time',
    'CREATE INDEX idx_cal_start_time ON calendar_events (start_time_utc)',
  );
  late final Index idxTxTime = Index(
    'idx_tx_time',
    'CREATE INDEX idx_tx_time ON money_transactions (transaction_time_utc)',
  );
  late final Index idxTxAccount = Index(
    'idx_tx_account',
    'CREATE INDEX idx_tx_account ON money_transactions (account_id)',
  );
  late final Index idxTaskDueDate = Index(
    'idx_task_due_date',
    'CREATE INDEX idx_task_due_date ON task_items (due_date_utc)',
  );
  late final Index idxTaskCompleted = Index(
    'idx_task_completed',
    'CREATE INDEX idx_task_completed ON task_items (is_completed)',
  );
  late final Index idxNotePinned = Index(
    'idx_note_pinned',
    'CREATE INDEX idx_note_pinned ON note_items (is_pinned)',
  );
  late final Index idxNoteArchived = Index(
    'idx_note_archived',
    'CREATE INDEX idx_note_archived ON note_items (is_archived)',
  );
  late final Index idxNoteDeleted = Index(
    'idx_note_deleted',
    'CREATE INDEX idx_note_deleted ON note_items (is_deleted)',
  );
  late final Index idxUsagePackage = Index(
    'idx_usage_package',
    'CREATE INDEX idx_usage_package ON usage_sessions (package_name)',
  );
  late final Index idxUsageStartTime = Index(
    'idx_usage_start_time',
    'CREATE INDEX idx_usage_start_time ON usage_sessions (start_time_utc)',
  );
  late final Index idxDocMime = Index(
    'idx_doc_mime',
    'CREATE INDEX idx_doc_mime ON document_items (mime_type)',
  );
  late final SharedDao sharedDao = SharedDao(this as AppDatabase);
  late final CalendarDao calendarDao = CalendarDao(this as AppDatabase);
  late final MoneyDao moneyDao = MoneyDao(this as AppDatabase);
  late final TaskDao taskDao = TaskDao(this as AppDatabase);
  late final NoteDao noteDao = NoteDao(this as AppDatabase);
  late final UsageDao usageDao = UsageDao(this as AppDatabase);
  late final DocumentDao documentDao = DocumentDao(this as AppDatabase);
  late final MusicDao musicDao = MusicDao(this as AppDatabase);
  @override
  Iterable<TableInfo<Table, Object?>> get allTables =>
      allSchemaEntities.whereType<TableInfo<Table, Object?>>();
  @override
  List<DatabaseSchemaEntity> get allSchemaEntities => [
    tags,
    entityCrossLinks,
    calendarEvents,
    moneyAccounts,
    moneyCategories,
    taskLists,
    taskItems,
    moneyTransactions,
    moneyBudgets,
    savingsGoals,
    debts,
    recurringTransactions,
    noteLabels,
    noteItems,
    noteLabelCrossRef,
    checklistItems,
    usageSessions,
    appCategories,
    usageLimits,
    documentItems,
    documentPages,
    musicPlaylists,
    playlistSongs,
    songMetadata,
    idxSourceEntity,
    idxTargetEntity,
    idxCalStartTime,
    idxTxTime,
    idxTxAccount,
    idxTaskDueDate,
    idxTaskCompleted,
    idxNotePinned,
    idxNoteArchived,
    idxNoteDeleted,
    idxUsagePackage,
    idxUsageStartTime,
    idxDocMime,
  ];
  @override
  StreamQueryUpdateRules get streamUpdateRules => const StreamQueryUpdateRules([
    WritePropagation(
      on: TableUpdateQuery.onTableName(
        'task_lists',
        limitUpdateKind: UpdateKind.delete,
      ),
      result: [TableUpdate('task_items', kind: UpdateKind.update)],
    ),
    WritePropagation(
      on: TableUpdateQuery.onTableName(
        'money_accounts',
        limitUpdateKind: UpdateKind.delete,
      ),
      result: [TableUpdate('money_transactions', kind: UpdateKind.delete)],
    ),
    WritePropagation(
      on: TableUpdateQuery.onTableName(
        'money_accounts',
        limitUpdateKind: UpdateKind.delete,
      ),
      result: [TableUpdate('money_transactions', kind: UpdateKind.delete)],
    ),
    WritePropagation(
      on: TableUpdateQuery.onTableName(
        'money_categories',
        limitUpdateKind: UpdateKind.delete,
      ),
      result: [TableUpdate('money_transactions', kind: UpdateKind.update)],
    ),
    WritePropagation(
      on: TableUpdateQuery.onTableName(
        'calendar_events',
        limitUpdateKind: UpdateKind.delete,
      ),
      result: [TableUpdate('money_transactions', kind: UpdateKind.update)],
    ),
    WritePropagation(
      on: TableUpdateQuery.onTableName(
        'task_items',
        limitUpdateKind: UpdateKind.delete,
      ),
      result: [TableUpdate('money_transactions', kind: UpdateKind.update)],
    ),
    WritePropagation(
      on: TableUpdateQuery.onTableName(
        'money_categories',
        limitUpdateKind: UpdateKind.delete,
      ),
      result: [TableUpdate('money_budgets', kind: UpdateKind.delete)],
    ),
    WritePropagation(
      on: TableUpdateQuery.onTableName(
        'money_accounts',
        limitUpdateKind: UpdateKind.delete,
      ),
      result: [TableUpdate('recurring_transactions', kind: UpdateKind.delete)],
    ),
    WritePropagation(
      on: TableUpdateQuery.onTableName(
        'money_accounts',
        limitUpdateKind: UpdateKind.delete,
      ),
      result: [TableUpdate('recurring_transactions', kind: UpdateKind.delete)],
    ),
    WritePropagation(
      on: TableUpdateQuery.onTableName(
        'money_categories',
        limitUpdateKind: UpdateKind.delete,
      ),
      result: [TableUpdate('recurring_transactions', kind: UpdateKind.update)],
    ),
    WritePropagation(
      on: TableUpdateQuery.onTableName(
        'note_items',
        limitUpdateKind: UpdateKind.delete,
      ),
      result: [TableUpdate('note_label_cross_ref', kind: UpdateKind.delete)],
    ),
    WritePropagation(
      on: TableUpdateQuery.onTableName(
        'note_labels',
        limitUpdateKind: UpdateKind.delete,
      ),
      result: [TableUpdate('note_label_cross_ref', kind: UpdateKind.delete)],
    ),
    WritePropagation(
      on: TableUpdateQuery.onTableName(
        'note_items',
        limitUpdateKind: UpdateKind.delete,
      ),
      result: [TableUpdate('checklist_items', kind: UpdateKind.delete)],
    ),
    WritePropagation(
      on: TableUpdateQuery.onTableName(
        'document_items',
        limitUpdateKind: UpdateKind.delete,
      ),
      result: [TableUpdate('document_pages', kind: UpdateKind.delete)],
    ),
    WritePropagation(
      on: TableUpdateQuery.onTableName(
        'music_playlists',
        limitUpdateKind: UpdateKind.delete,
      ),
      result: [TableUpdate('playlist_songs', kind: UpdateKind.delete)],
    ),
  ]);
}

typedef $$TagsTableCreateCompanionBuilder =
    TagsCompanion Function({
      required String id,
      required String name,
      Value<int> colorValue,
      required int createdAtUtc,
      Value<int> rowid,
    });
typedef $$TagsTableUpdateCompanionBuilder =
    TagsCompanion Function({
      Value<String> id,
      Value<String> name,
      Value<int> colorValue,
      Value<int> createdAtUtc,
      Value<int> rowid,
    });

class $$TagsTableFilterComposer extends Composer<_$AppDatabase, $TagsTable> {
  $$TagsTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get name => $composableBuilder(
    column: $table.name,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get colorValue => $composableBuilder(
    column: $table.colorValue,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get createdAtUtc => $composableBuilder(
    column: $table.createdAtUtc,
    builder: (column) => ColumnFilters(column),
  );
}

class $$TagsTableOrderingComposer extends Composer<_$AppDatabase, $TagsTable> {
  $$TagsTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get name => $composableBuilder(
    column: $table.name,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get colorValue => $composableBuilder(
    column: $table.colorValue,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get createdAtUtc => $composableBuilder(
    column: $table.createdAtUtc,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$TagsTableAnnotationComposer
    extends Composer<_$AppDatabase, $TagsTable> {
  $$TagsTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get name =>
      $composableBuilder(column: $table.name, builder: (column) => column);

  GeneratedColumn<int> get colorValue => $composableBuilder(
    column: $table.colorValue,
    builder: (column) => column,
  );

  GeneratedColumn<int> get createdAtUtc => $composableBuilder(
    column: $table.createdAtUtc,
    builder: (column) => column,
  );
}

class $$TagsTableTableManager
    extends
        RootTableManager<
          _$AppDatabase,
          $TagsTable,
          TagEntry,
          $$TagsTableFilterComposer,
          $$TagsTableOrderingComposer,
          $$TagsTableAnnotationComposer,
          $$TagsTableCreateCompanionBuilder,
          $$TagsTableUpdateCompanionBuilder,
          (TagEntry, BaseReferences<_$AppDatabase, $TagsTable, TagEntry>),
          TagEntry,
          PrefetchHooks Function()
        > {
  $$TagsTableTableManager(_$AppDatabase db, $TagsTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$TagsTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$TagsTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$TagsTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> id = const Value.absent(),
                Value<String> name = const Value.absent(),
                Value<int> colorValue = const Value.absent(),
                Value<int> createdAtUtc = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => TagsCompanion(
                id: id,
                name: name,
                colorValue: colorValue,
                createdAtUtc: createdAtUtc,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String id,
                required String name,
                Value<int> colorValue = const Value.absent(),
                required int createdAtUtc,
                Value<int> rowid = const Value.absent(),
              }) => TagsCompanion.insert(
                id: id,
                name: name,
                colorValue: colorValue,
                createdAtUtc: createdAtUtc,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ),
      );
}

typedef $$TagsTableProcessedTableManager =
    ProcessedTableManager<
      _$AppDatabase,
      $TagsTable,
      TagEntry,
      $$TagsTableFilterComposer,
      $$TagsTableOrderingComposer,
      $$TagsTableAnnotationComposer,
      $$TagsTableCreateCompanionBuilder,
      $$TagsTableUpdateCompanionBuilder,
      (TagEntry, BaseReferences<_$AppDatabase, $TagsTable, TagEntry>),
      TagEntry,
      PrefetchHooks Function()
    >;
typedef $$EntityCrossLinksTableCreateCompanionBuilder =
    EntityCrossLinksCompanion Function({
      required String id,
      required String sourceType,
      required String sourceId,
      required String targetType,
      required String targetId,
      Value<String> relationType,
      required int createdAtUtc,
      Value<int> rowid,
    });
typedef $$EntityCrossLinksTableUpdateCompanionBuilder =
    EntityCrossLinksCompanion Function({
      Value<String> id,
      Value<String> sourceType,
      Value<String> sourceId,
      Value<String> targetType,
      Value<String> targetId,
      Value<String> relationType,
      Value<int> createdAtUtc,
      Value<int> rowid,
    });

class $$EntityCrossLinksTableFilterComposer
    extends Composer<_$AppDatabase, $EntityCrossLinksTable> {
  $$EntityCrossLinksTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get sourceType => $composableBuilder(
    column: $table.sourceType,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get sourceId => $composableBuilder(
    column: $table.sourceId,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get targetType => $composableBuilder(
    column: $table.targetType,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get targetId => $composableBuilder(
    column: $table.targetId,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get relationType => $composableBuilder(
    column: $table.relationType,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get createdAtUtc => $composableBuilder(
    column: $table.createdAtUtc,
    builder: (column) => ColumnFilters(column),
  );
}

class $$EntityCrossLinksTableOrderingComposer
    extends Composer<_$AppDatabase, $EntityCrossLinksTable> {
  $$EntityCrossLinksTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get sourceType => $composableBuilder(
    column: $table.sourceType,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get sourceId => $composableBuilder(
    column: $table.sourceId,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get targetType => $composableBuilder(
    column: $table.targetType,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get targetId => $composableBuilder(
    column: $table.targetId,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get relationType => $composableBuilder(
    column: $table.relationType,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get createdAtUtc => $composableBuilder(
    column: $table.createdAtUtc,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$EntityCrossLinksTableAnnotationComposer
    extends Composer<_$AppDatabase, $EntityCrossLinksTable> {
  $$EntityCrossLinksTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get sourceType => $composableBuilder(
    column: $table.sourceType,
    builder: (column) => column,
  );

  GeneratedColumn<String> get sourceId =>
      $composableBuilder(column: $table.sourceId, builder: (column) => column);

  GeneratedColumn<String> get targetType => $composableBuilder(
    column: $table.targetType,
    builder: (column) => column,
  );

  GeneratedColumn<String> get targetId =>
      $composableBuilder(column: $table.targetId, builder: (column) => column);

  GeneratedColumn<String> get relationType => $composableBuilder(
    column: $table.relationType,
    builder: (column) => column,
  );

  GeneratedColumn<int> get createdAtUtc => $composableBuilder(
    column: $table.createdAtUtc,
    builder: (column) => column,
  );
}

class $$EntityCrossLinksTableTableManager
    extends
        RootTableManager<
          _$AppDatabase,
          $EntityCrossLinksTable,
          EntityCrossLink,
          $$EntityCrossLinksTableFilterComposer,
          $$EntityCrossLinksTableOrderingComposer,
          $$EntityCrossLinksTableAnnotationComposer,
          $$EntityCrossLinksTableCreateCompanionBuilder,
          $$EntityCrossLinksTableUpdateCompanionBuilder,
          (
            EntityCrossLink,
            BaseReferences<
              _$AppDatabase,
              $EntityCrossLinksTable,
              EntityCrossLink
            >,
          ),
          EntityCrossLink,
          PrefetchHooks Function()
        > {
  $$EntityCrossLinksTableTableManager(
    _$AppDatabase db,
    $EntityCrossLinksTable table,
  ) : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$EntityCrossLinksTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$EntityCrossLinksTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$EntityCrossLinksTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> id = const Value.absent(),
                Value<String> sourceType = const Value.absent(),
                Value<String> sourceId = const Value.absent(),
                Value<String> targetType = const Value.absent(),
                Value<String> targetId = const Value.absent(),
                Value<String> relationType = const Value.absent(),
                Value<int> createdAtUtc = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => EntityCrossLinksCompanion(
                id: id,
                sourceType: sourceType,
                sourceId: sourceId,
                targetType: targetType,
                targetId: targetId,
                relationType: relationType,
                createdAtUtc: createdAtUtc,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String id,
                required String sourceType,
                required String sourceId,
                required String targetType,
                required String targetId,
                Value<String> relationType = const Value.absent(),
                required int createdAtUtc,
                Value<int> rowid = const Value.absent(),
              }) => EntityCrossLinksCompanion.insert(
                id: id,
                sourceType: sourceType,
                sourceId: sourceId,
                targetType: targetType,
                targetId: targetId,
                relationType: relationType,
                createdAtUtc: createdAtUtc,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ),
      );
}

typedef $$EntityCrossLinksTableProcessedTableManager =
    ProcessedTableManager<
      _$AppDatabase,
      $EntityCrossLinksTable,
      EntityCrossLink,
      $$EntityCrossLinksTableFilterComposer,
      $$EntityCrossLinksTableOrderingComposer,
      $$EntityCrossLinksTableAnnotationComposer,
      $$EntityCrossLinksTableCreateCompanionBuilder,
      $$EntityCrossLinksTableUpdateCompanionBuilder,
      (
        EntityCrossLink,
        BaseReferences<_$AppDatabase, $EntityCrossLinksTable, EntityCrossLink>,
      ),
      EntityCrossLink,
      PrefetchHooks Function()
    >;
typedef $$CalendarEventsTableCreateCompanionBuilder =
    CalendarEventsCompanion Function({
      required String id,
      required String title,
      Value<String?> description,
      required int startTimeUtc,
      required int endTimeUtc,
      Value<bool> isAllDay,
      Value<String?> recurrenceRule,
      Value<String?> location,
      Value<int?> colorValue,
      Value<bool> isCancelled,
      Value<String> eventType,
      Value<String?> reminderOffsets,
      required int createdAtUtc,
      required int updatedAtUtc,
      Value<int> rowid,
    });
typedef $$CalendarEventsTableUpdateCompanionBuilder =
    CalendarEventsCompanion Function({
      Value<String> id,
      Value<String> title,
      Value<String?> description,
      Value<int> startTimeUtc,
      Value<int> endTimeUtc,
      Value<bool> isAllDay,
      Value<String?> recurrenceRule,
      Value<String?> location,
      Value<int?> colorValue,
      Value<bool> isCancelled,
      Value<String> eventType,
      Value<String?> reminderOffsets,
      Value<int> createdAtUtc,
      Value<int> updatedAtUtc,
      Value<int> rowid,
    });

final class $$CalendarEventsTableReferences
    extends
        BaseReferences<
          _$AppDatabase,
          $CalendarEventsTable,
          CalendarEventEntry
        > {
  $$CalendarEventsTableReferences(
    super.$_db,
    super.$_table,
    super.$_typedResult,
  );

  static MultiTypedResultKey<
    $MoneyTransactionsTable,
    List<MoneyTransactionEntry>
  >
  _moneyTransactionsRefsTable(_$AppDatabase db) =>
      MultiTypedResultKey.fromTable(
        db.moneyTransactions,
        aliasName: $_aliasNameGenerator(
          db.calendarEvents.id,
          db.moneyTransactions.linkedCalendarEventId,
        ),
      );

  $$MoneyTransactionsTableProcessedTableManager get moneyTransactionsRefs {
    final manager =
        $$MoneyTransactionsTableTableManager(
          $_db,
          $_db.moneyTransactions,
        ).filter(
          (f) =>
              f.linkedCalendarEventId.id.sqlEquals($_itemColumn<String>('id')!),
        );

    final cache = $_typedResult.readTableOrNull(
      _moneyTransactionsRefsTable($_db),
    );
    return ProcessedTableManager(
      manager.$state.copyWith(prefetchedData: cache),
    );
  }
}

class $$CalendarEventsTableFilterComposer
    extends Composer<_$AppDatabase, $CalendarEventsTable> {
  $$CalendarEventsTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get title => $composableBuilder(
    column: $table.title,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get description => $composableBuilder(
    column: $table.description,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get startTimeUtc => $composableBuilder(
    column: $table.startTimeUtc,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get endTimeUtc => $composableBuilder(
    column: $table.endTimeUtc,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<bool> get isAllDay => $composableBuilder(
    column: $table.isAllDay,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get recurrenceRule => $composableBuilder(
    column: $table.recurrenceRule,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get location => $composableBuilder(
    column: $table.location,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get colorValue => $composableBuilder(
    column: $table.colorValue,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<bool> get isCancelled => $composableBuilder(
    column: $table.isCancelled,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get eventType => $composableBuilder(
    column: $table.eventType,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get reminderOffsets => $composableBuilder(
    column: $table.reminderOffsets,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get createdAtUtc => $composableBuilder(
    column: $table.createdAtUtc,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get updatedAtUtc => $composableBuilder(
    column: $table.updatedAtUtc,
    builder: (column) => ColumnFilters(column),
  );

  Expression<bool> moneyTransactionsRefs(
    Expression<bool> Function($$MoneyTransactionsTableFilterComposer f) f,
  ) {
    final $$MoneyTransactionsTableFilterComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.id,
      referencedTable: $db.moneyTransactions,
      getReferencedColumn: (t) => t.linkedCalendarEventId,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$MoneyTransactionsTableFilterComposer(
            $db: $db,
            $table: $db.moneyTransactions,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return f(composer);
  }
}

class $$CalendarEventsTableOrderingComposer
    extends Composer<_$AppDatabase, $CalendarEventsTable> {
  $$CalendarEventsTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get title => $composableBuilder(
    column: $table.title,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get description => $composableBuilder(
    column: $table.description,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get startTimeUtc => $composableBuilder(
    column: $table.startTimeUtc,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get endTimeUtc => $composableBuilder(
    column: $table.endTimeUtc,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<bool> get isAllDay => $composableBuilder(
    column: $table.isAllDay,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get recurrenceRule => $composableBuilder(
    column: $table.recurrenceRule,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get location => $composableBuilder(
    column: $table.location,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get colorValue => $composableBuilder(
    column: $table.colorValue,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<bool> get isCancelled => $composableBuilder(
    column: $table.isCancelled,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get eventType => $composableBuilder(
    column: $table.eventType,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get reminderOffsets => $composableBuilder(
    column: $table.reminderOffsets,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get createdAtUtc => $composableBuilder(
    column: $table.createdAtUtc,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get updatedAtUtc => $composableBuilder(
    column: $table.updatedAtUtc,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$CalendarEventsTableAnnotationComposer
    extends Composer<_$AppDatabase, $CalendarEventsTable> {
  $$CalendarEventsTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get title =>
      $composableBuilder(column: $table.title, builder: (column) => column);

  GeneratedColumn<String> get description => $composableBuilder(
    column: $table.description,
    builder: (column) => column,
  );

  GeneratedColumn<int> get startTimeUtc => $composableBuilder(
    column: $table.startTimeUtc,
    builder: (column) => column,
  );

  GeneratedColumn<int> get endTimeUtc => $composableBuilder(
    column: $table.endTimeUtc,
    builder: (column) => column,
  );

  GeneratedColumn<bool> get isAllDay =>
      $composableBuilder(column: $table.isAllDay, builder: (column) => column);

  GeneratedColumn<String> get recurrenceRule => $composableBuilder(
    column: $table.recurrenceRule,
    builder: (column) => column,
  );

  GeneratedColumn<String> get location =>
      $composableBuilder(column: $table.location, builder: (column) => column);

  GeneratedColumn<int> get colorValue => $composableBuilder(
    column: $table.colorValue,
    builder: (column) => column,
  );

  GeneratedColumn<bool> get isCancelled => $composableBuilder(
    column: $table.isCancelled,
    builder: (column) => column,
  );

  GeneratedColumn<String> get eventType =>
      $composableBuilder(column: $table.eventType, builder: (column) => column);

  GeneratedColumn<String> get reminderOffsets => $composableBuilder(
    column: $table.reminderOffsets,
    builder: (column) => column,
  );

  GeneratedColumn<int> get createdAtUtc => $composableBuilder(
    column: $table.createdAtUtc,
    builder: (column) => column,
  );

  GeneratedColumn<int> get updatedAtUtc => $composableBuilder(
    column: $table.updatedAtUtc,
    builder: (column) => column,
  );

  Expression<T> moneyTransactionsRefs<T extends Object>(
    Expression<T> Function($$MoneyTransactionsTableAnnotationComposer a) f,
  ) {
    final $$MoneyTransactionsTableAnnotationComposer composer =
        $composerBuilder(
          composer: this,
          getCurrentColumn: (t) => t.id,
          referencedTable: $db.moneyTransactions,
          getReferencedColumn: (t) => t.linkedCalendarEventId,
          builder:
              (
                joinBuilder, {
                $addJoinBuilderToRootComposer,
                $removeJoinBuilderFromRootComposer,
              }) => $$MoneyTransactionsTableAnnotationComposer(
                $db: $db,
                $table: $db.moneyTransactions,
                $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
                joinBuilder: joinBuilder,
                $removeJoinBuilderFromRootComposer:
                    $removeJoinBuilderFromRootComposer,
              ),
        );
    return f(composer);
  }
}

class $$CalendarEventsTableTableManager
    extends
        RootTableManager<
          _$AppDatabase,
          $CalendarEventsTable,
          CalendarEventEntry,
          $$CalendarEventsTableFilterComposer,
          $$CalendarEventsTableOrderingComposer,
          $$CalendarEventsTableAnnotationComposer,
          $$CalendarEventsTableCreateCompanionBuilder,
          $$CalendarEventsTableUpdateCompanionBuilder,
          (CalendarEventEntry, $$CalendarEventsTableReferences),
          CalendarEventEntry,
          PrefetchHooks Function({bool moneyTransactionsRefs})
        > {
  $$CalendarEventsTableTableManager(
    _$AppDatabase db,
    $CalendarEventsTable table,
  ) : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$CalendarEventsTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$CalendarEventsTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$CalendarEventsTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> id = const Value.absent(),
                Value<String> title = const Value.absent(),
                Value<String?> description = const Value.absent(),
                Value<int> startTimeUtc = const Value.absent(),
                Value<int> endTimeUtc = const Value.absent(),
                Value<bool> isAllDay = const Value.absent(),
                Value<String?> recurrenceRule = const Value.absent(),
                Value<String?> location = const Value.absent(),
                Value<int?> colorValue = const Value.absent(),
                Value<bool> isCancelled = const Value.absent(),
                Value<String> eventType = const Value.absent(),
                Value<String?> reminderOffsets = const Value.absent(),
                Value<int> createdAtUtc = const Value.absent(),
                Value<int> updatedAtUtc = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => CalendarEventsCompanion(
                id: id,
                title: title,
                description: description,
                startTimeUtc: startTimeUtc,
                endTimeUtc: endTimeUtc,
                isAllDay: isAllDay,
                recurrenceRule: recurrenceRule,
                location: location,
                colorValue: colorValue,
                isCancelled: isCancelled,
                eventType: eventType,
                reminderOffsets: reminderOffsets,
                createdAtUtc: createdAtUtc,
                updatedAtUtc: updatedAtUtc,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String id,
                required String title,
                Value<String?> description = const Value.absent(),
                required int startTimeUtc,
                required int endTimeUtc,
                Value<bool> isAllDay = const Value.absent(),
                Value<String?> recurrenceRule = const Value.absent(),
                Value<String?> location = const Value.absent(),
                Value<int?> colorValue = const Value.absent(),
                Value<bool> isCancelled = const Value.absent(),
                Value<String> eventType = const Value.absent(),
                Value<String?> reminderOffsets = const Value.absent(),
                required int createdAtUtc,
                required int updatedAtUtc,
                Value<int> rowid = const Value.absent(),
              }) => CalendarEventsCompanion.insert(
                id: id,
                title: title,
                description: description,
                startTimeUtc: startTimeUtc,
                endTimeUtc: endTimeUtc,
                isAllDay: isAllDay,
                recurrenceRule: recurrenceRule,
                location: location,
                colorValue: colorValue,
                isCancelled: isCancelled,
                eventType: eventType,
                reminderOffsets: reminderOffsets,
                createdAtUtc: createdAtUtc,
                updatedAtUtc: updatedAtUtc,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map(
                (e) => (
                  e.readTable(table),
                  $$CalendarEventsTableReferences(db, table, e),
                ),
              )
              .toList(),
          prefetchHooksCallback: ({moneyTransactionsRefs = false}) {
            return PrefetchHooks(
              db: db,
              explicitlyWatchedTables: [
                if (moneyTransactionsRefs) db.moneyTransactions,
              ],
              addJoins: null,
              getPrefetchedDataCallback: (items) async {
                return [
                  if (moneyTransactionsRefs)
                    await $_getPrefetchedData<
                      CalendarEventEntry,
                      $CalendarEventsTable,
                      MoneyTransactionEntry
                    >(
                      currentTable: table,
                      referencedTable: $$CalendarEventsTableReferences
                          ._moneyTransactionsRefsTable(db),
                      managerFromTypedResult: (p0) =>
                          $$CalendarEventsTableReferences(
                            db,
                            table,
                            p0,
                          ).moneyTransactionsRefs,
                      referencedItemsForCurrentItem: (item, referencedItems) =>
                          referencedItems.where(
                            (e) => e.linkedCalendarEventId == item.id,
                          ),
                      typedResults: items,
                    ),
                ];
              },
            );
          },
        ),
      );
}

typedef $$CalendarEventsTableProcessedTableManager =
    ProcessedTableManager<
      _$AppDatabase,
      $CalendarEventsTable,
      CalendarEventEntry,
      $$CalendarEventsTableFilterComposer,
      $$CalendarEventsTableOrderingComposer,
      $$CalendarEventsTableAnnotationComposer,
      $$CalendarEventsTableCreateCompanionBuilder,
      $$CalendarEventsTableUpdateCompanionBuilder,
      (CalendarEventEntry, $$CalendarEventsTableReferences),
      CalendarEventEntry,
      PrefetchHooks Function({bool moneyTransactionsRefs})
    >;
typedef $$MoneyAccountsTableCreateCompanionBuilder =
    MoneyAccountsCompanion Function({
      required String id,
      required String name,
      required String accountType,
      Value<int> balancePaise,
      Value<String> currencyCode,
      Value<bool> isActive,
      required int createdAtUtc,
      Value<int> rowid,
    });
typedef $$MoneyAccountsTableUpdateCompanionBuilder =
    MoneyAccountsCompanion Function({
      Value<String> id,
      Value<String> name,
      Value<String> accountType,
      Value<int> balancePaise,
      Value<String> currencyCode,
      Value<bool> isActive,
      Value<int> createdAtUtc,
      Value<int> rowid,
    });

class $$MoneyAccountsTableFilterComposer
    extends Composer<_$AppDatabase, $MoneyAccountsTable> {
  $$MoneyAccountsTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get name => $composableBuilder(
    column: $table.name,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get accountType => $composableBuilder(
    column: $table.accountType,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get balancePaise => $composableBuilder(
    column: $table.balancePaise,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get currencyCode => $composableBuilder(
    column: $table.currencyCode,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<bool> get isActive => $composableBuilder(
    column: $table.isActive,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get createdAtUtc => $composableBuilder(
    column: $table.createdAtUtc,
    builder: (column) => ColumnFilters(column),
  );
}

class $$MoneyAccountsTableOrderingComposer
    extends Composer<_$AppDatabase, $MoneyAccountsTable> {
  $$MoneyAccountsTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get name => $composableBuilder(
    column: $table.name,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get accountType => $composableBuilder(
    column: $table.accountType,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get balancePaise => $composableBuilder(
    column: $table.balancePaise,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get currencyCode => $composableBuilder(
    column: $table.currencyCode,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<bool> get isActive => $composableBuilder(
    column: $table.isActive,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get createdAtUtc => $composableBuilder(
    column: $table.createdAtUtc,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$MoneyAccountsTableAnnotationComposer
    extends Composer<_$AppDatabase, $MoneyAccountsTable> {
  $$MoneyAccountsTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get name =>
      $composableBuilder(column: $table.name, builder: (column) => column);

  GeneratedColumn<String> get accountType => $composableBuilder(
    column: $table.accountType,
    builder: (column) => column,
  );

  GeneratedColumn<int> get balancePaise => $composableBuilder(
    column: $table.balancePaise,
    builder: (column) => column,
  );

  GeneratedColumn<String> get currencyCode => $composableBuilder(
    column: $table.currencyCode,
    builder: (column) => column,
  );

  GeneratedColumn<bool> get isActive =>
      $composableBuilder(column: $table.isActive, builder: (column) => column);

  GeneratedColumn<int> get createdAtUtc => $composableBuilder(
    column: $table.createdAtUtc,
    builder: (column) => column,
  );
}

class $$MoneyAccountsTableTableManager
    extends
        RootTableManager<
          _$AppDatabase,
          $MoneyAccountsTable,
          MoneyAccountEntry,
          $$MoneyAccountsTableFilterComposer,
          $$MoneyAccountsTableOrderingComposer,
          $$MoneyAccountsTableAnnotationComposer,
          $$MoneyAccountsTableCreateCompanionBuilder,
          $$MoneyAccountsTableUpdateCompanionBuilder,
          (
            MoneyAccountEntry,
            BaseReferences<
              _$AppDatabase,
              $MoneyAccountsTable,
              MoneyAccountEntry
            >,
          ),
          MoneyAccountEntry,
          PrefetchHooks Function()
        > {
  $$MoneyAccountsTableTableManager(_$AppDatabase db, $MoneyAccountsTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$MoneyAccountsTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$MoneyAccountsTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$MoneyAccountsTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> id = const Value.absent(),
                Value<String> name = const Value.absent(),
                Value<String> accountType = const Value.absent(),
                Value<int> balancePaise = const Value.absent(),
                Value<String> currencyCode = const Value.absent(),
                Value<bool> isActive = const Value.absent(),
                Value<int> createdAtUtc = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => MoneyAccountsCompanion(
                id: id,
                name: name,
                accountType: accountType,
                balancePaise: balancePaise,
                currencyCode: currencyCode,
                isActive: isActive,
                createdAtUtc: createdAtUtc,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String id,
                required String name,
                required String accountType,
                Value<int> balancePaise = const Value.absent(),
                Value<String> currencyCode = const Value.absent(),
                Value<bool> isActive = const Value.absent(),
                required int createdAtUtc,
                Value<int> rowid = const Value.absent(),
              }) => MoneyAccountsCompanion.insert(
                id: id,
                name: name,
                accountType: accountType,
                balancePaise: balancePaise,
                currencyCode: currencyCode,
                isActive: isActive,
                createdAtUtc: createdAtUtc,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ),
      );
}

typedef $$MoneyAccountsTableProcessedTableManager =
    ProcessedTableManager<
      _$AppDatabase,
      $MoneyAccountsTable,
      MoneyAccountEntry,
      $$MoneyAccountsTableFilterComposer,
      $$MoneyAccountsTableOrderingComposer,
      $$MoneyAccountsTableAnnotationComposer,
      $$MoneyAccountsTableCreateCompanionBuilder,
      $$MoneyAccountsTableUpdateCompanionBuilder,
      (
        MoneyAccountEntry,
        BaseReferences<_$AppDatabase, $MoneyAccountsTable, MoneyAccountEntry>,
      ),
      MoneyAccountEntry,
      PrefetchHooks Function()
    >;
typedef $$MoneyCategoriesTableCreateCompanionBuilder =
    MoneyCategoriesCompanion Function({
      required String id,
      required String name,
      Value<String> iconName,
      Value<bool> isExpense,
      Value<int> colorValue,
      required int createdAtUtc,
      Value<int> rowid,
    });
typedef $$MoneyCategoriesTableUpdateCompanionBuilder =
    MoneyCategoriesCompanion Function({
      Value<String> id,
      Value<String> name,
      Value<String> iconName,
      Value<bool> isExpense,
      Value<int> colorValue,
      Value<int> createdAtUtc,
      Value<int> rowid,
    });

final class $$MoneyCategoriesTableReferences
    extends
        BaseReferences<
          _$AppDatabase,
          $MoneyCategoriesTable,
          MoneyCategoryEntry
        > {
  $$MoneyCategoriesTableReferences(
    super.$_db,
    super.$_table,
    super.$_typedResult,
  );

  static MultiTypedResultKey<
    $MoneyTransactionsTable,
    List<MoneyTransactionEntry>
  >
  _moneyTransactionsRefsTable(_$AppDatabase db) =>
      MultiTypedResultKey.fromTable(
        db.moneyTransactions,
        aliasName: $_aliasNameGenerator(
          db.moneyCategories.id,
          db.moneyTransactions.categoryId,
        ),
      );

  $$MoneyTransactionsTableProcessedTableManager get moneyTransactionsRefs {
    final manager = $$MoneyTransactionsTableTableManager(
      $_db,
      $_db.moneyTransactions,
    ).filter((f) => f.categoryId.id.sqlEquals($_itemColumn<String>('id')!));

    final cache = $_typedResult.readTableOrNull(
      _moneyTransactionsRefsTable($_db),
    );
    return ProcessedTableManager(
      manager.$state.copyWith(prefetchedData: cache),
    );
  }

  static MultiTypedResultKey<$MoneyBudgetsTable, List<MoneyBudgetEntry>>
  _moneyBudgetsRefsTable(_$AppDatabase db) => MultiTypedResultKey.fromTable(
    db.moneyBudgets,
    aliasName: $_aliasNameGenerator(
      db.moneyCategories.id,
      db.moneyBudgets.categoryId,
    ),
  );

  $$MoneyBudgetsTableProcessedTableManager get moneyBudgetsRefs {
    final manager = $$MoneyBudgetsTableTableManager(
      $_db,
      $_db.moneyBudgets,
    ).filter((f) => f.categoryId.id.sqlEquals($_itemColumn<String>('id')!));

    final cache = $_typedResult.readTableOrNull(_moneyBudgetsRefsTable($_db));
    return ProcessedTableManager(
      manager.$state.copyWith(prefetchedData: cache),
    );
  }

  static MultiTypedResultKey<
    $RecurringTransactionsTable,
    List<RecurringTransactionEntry>
  >
  _recurringTransactionsRefsTable(_$AppDatabase db) =>
      MultiTypedResultKey.fromTable(
        db.recurringTransactions,
        aliasName: $_aliasNameGenerator(
          db.moneyCategories.id,
          db.recurringTransactions.categoryId,
        ),
      );

  $$RecurringTransactionsTableProcessedTableManager
  get recurringTransactionsRefs {
    final manager = $$RecurringTransactionsTableTableManager(
      $_db,
      $_db.recurringTransactions,
    ).filter((f) => f.categoryId.id.sqlEquals($_itemColumn<String>('id')!));

    final cache = $_typedResult.readTableOrNull(
      _recurringTransactionsRefsTable($_db),
    );
    return ProcessedTableManager(
      manager.$state.copyWith(prefetchedData: cache),
    );
  }
}

class $$MoneyCategoriesTableFilterComposer
    extends Composer<_$AppDatabase, $MoneyCategoriesTable> {
  $$MoneyCategoriesTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get name => $composableBuilder(
    column: $table.name,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get iconName => $composableBuilder(
    column: $table.iconName,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<bool> get isExpense => $composableBuilder(
    column: $table.isExpense,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get colorValue => $composableBuilder(
    column: $table.colorValue,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get createdAtUtc => $composableBuilder(
    column: $table.createdAtUtc,
    builder: (column) => ColumnFilters(column),
  );

  Expression<bool> moneyTransactionsRefs(
    Expression<bool> Function($$MoneyTransactionsTableFilterComposer f) f,
  ) {
    final $$MoneyTransactionsTableFilterComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.id,
      referencedTable: $db.moneyTransactions,
      getReferencedColumn: (t) => t.categoryId,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$MoneyTransactionsTableFilterComposer(
            $db: $db,
            $table: $db.moneyTransactions,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return f(composer);
  }

  Expression<bool> moneyBudgetsRefs(
    Expression<bool> Function($$MoneyBudgetsTableFilterComposer f) f,
  ) {
    final $$MoneyBudgetsTableFilterComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.id,
      referencedTable: $db.moneyBudgets,
      getReferencedColumn: (t) => t.categoryId,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$MoneyBudgetsTableFilterComposer(
            $db: $db,
            $table: $db.moneyBudgets,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return f(composer);
  }

  Expression<bool> recurringTransactionsRefs(
    Expression<bool> Function($$RecurringTransactionsTableFilterComposer f) f,
  ) {
    final $$RecurringTransactionsTableFilterComposer composer =
        $composerBuilder(
          composer: this,
          getCurrentColumn: (t) => t.id,
          referencedTable: $db.recurringTransactions,
          getReferencedColumn: (t) => t.categoryId,
          builder:
              (
                joinBuilder, {
                $addJoinBuilderToRootComposer,
                $removeJoinBuilderFromRootComposer,
              }) => $$RecurringTransactionsTableFilterComposer(
                $db: $db,
                $table: $db.recurringTransactions,
                $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
                joinBuilder: joinBuilder,
                $removeJoinBuilderFromRootComposer:
                    $removeJoinBuilderFromRootComposer,
              ),
        );
    return f(composer);
  }
}

class $$MoneyCategoriesTableOrderingComposer
    extends Composer<_$AppDatabase, $MoneyCategoriesTable> {
  $$MoneyCategoriesTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get name => $composableBuilder(
    column: $table.name,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get iconName => $composableBuilder(
    column: $table.iconName,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<bool> get isExpense => $composableBuilder(
    column: $table.isExpense,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get colorValue => $composableBuilder(
    column: $table.colorValue,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get createdAtUtc => $composableBuilder(
    column: $table.createdAtUtc,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$MoneyCategoriesTableAnnotationComposer
    extends Composer<_$AppDatabase, $MoneyCategoriesTable> {
  $$MoneyCategoriesTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get name =>
      $composableBuilder(column: $table.name, builder: (column) => column);

  GeneratedColumn<String> get iconName =>
      $composableBuilder(column: $table.iconName, builder: (column) => column);

  GeneratedColumn<bool> get isExpense =>
      $composableBuilder(column: $table.isExpense, builder: (column) => column);

  GeneratedColumn<int> get colorValue => $composableBuilder(
    column: $table.colorValue,
    builder: (column) => column,
  );

  GeneratedColumn<int> get createdAtUtc => $composableBuilder(
    column: $table.createdAtUtc,
    builder: (column) => column,
  );

  Expression<T> moneyTransactionsRefs<T extends Object>(
    Expression<T> Function($$MoneyTransactionsTableAnnotationComposer a) f,
  ) {
    final $$MoneyTransactionsTableAnnotationComposer composer =
        $composerBuilder(
          composer: this,
          getCurrentColumn: (t) => t.id,
          referencedTable: $db.moneyTransactions,
          getReferencedColumn: (t) => t.categoryId,
          builder:
              (
                joinBuilder, {
                $addJoinBuilderToRootComposer,
                $removeJoinBuilderFromRootComposer,
              }) => $$MoneyTransactionsTableAnnotationComposer(
                $db: $db,
                $table: $db.moneyTransactions,
                $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
                joinBuilder: joinBuilder,
                $removeJoinBuilderFromRootComposer:
                    $removeJoinBuilderFromRootComposer,
              ),
        );
    return f(composer);
  }

  Expression<T> moneyBudgetsRefs<T extends Object>(
    Expression<T> Function($$MoneyBudgetsTableAnnotationComposer a) f,
  ) {
    final $$MoneyBudgetsTableAnnotationComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.id,
      referencedTable: $db.moneyBudgets,
      getReferencedColumn: (t) => t.categoryId,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$MoneyBudgetsTableAnnotationComposer(
            $db: $db,
            $table: $db.moneyBudgets,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return f(composer);
  }

  Expression<T> recurringTransactionsRefs<T extends Object>(
    Expression<T> Function($$RecurringTransactionsTableAnnotationComposer a) f,
  ) {
    final $$RecurringTransactionsTableAnnotationComposer composer =
        $composerBuilder(
          composer: this,
          getCurrentColumn: (t) => t.id,
          referencedTable: $db.recurringTransactions,
          getReferencedColumn: (t) => t.categoryId,
          builder:
              (
                joinBuilder, {
                $addJoinBuilderToRootComposer,
                $removeJoinBuilderFromRootComposer,
              }) => $$RecurringTransactionsTableAnnotationComposer(
                $db: $db,
                $table: $db.recurringTransactions,
                $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
                joinBuilder: joinBuilder,
                $removeJoinBuilderFromRootComposer:
                    $removeJoinBuilderFromRootComposer,
              ),
        );
    return f(composer);
  }
}

class $$MoneyCategoriesTableTableManager
    extends
        RootTableManager<
          _$AppDatabase,
          $MoneyCategoriesTable,
          MoneyCategoryEntry,
          $$MoneyCategoriesTableFilterComposer,
          $$MoneyCategoriesTableOrderingComposer,
          $$MoneyCategoriesTableAnnotationComposer,
          $$MoneyCategoriesTableCreateCompanionBuilder,
          $$MoneyCategoriesTableUpdateCompanionBuilder,
          (MoneyCategoryEntry, $$MoneyCategoriesTableReferences),
          MoneyCategoryEntry,
          PrefetchHooks Function({
            bool moneyTransactionsRefs,
            bool moneyBudgetsRefs,
            bool recurringTransactionsRefs,
          })
        > {
  $$MoneyCategoriesTableTableManager(
    _$AppDatabase db,
    $MoneyCategoriesTable table,
  ) : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$MoneyCategoriesTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$MoneyCategoriesTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$MoneyCategoriesTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> id = const Value.absent(),
                Value<String> name = const Value.absent(),
                Value<String> iconName = const Value.absent(),
                Value<bool> isExpense = const Value.absent(),
                Value<int> colorValue = const Value.absent(),
                Value<int> createdAtUtc = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => MoneyCategoriesCompanion(
                id: id,
                name: name,
                iconName: iconName,
                isExpense: isExpense,
                colorValue: colorValue,
                createdAtUtc: createdAtUtc,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String id,
                required String name,
                Value<String> iconName = const Value.absent(),
                Value<bool> isExpense = const Value.absent(),
                Value<int> colorValue = const Value.absent(),
                required int createdAtUtc,
                Value<int> rowid = const Value.absent(),
              }) => MoneyCategoriesCompanion.insert(
                id: id,
                name: name,
                iconName: iconName,
                isExpense: isExpense,
                colorValue: colorValue,
                createdAtUtc: createdAtUtc,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map(
                (e) => (
                  e.readTable(table),
                  $$MoneyCategoriesTableReferences(db, table, e),
                ),
              )
              .toList(),
          prefetchHooksCallback:
              ({
                moneyTransactionsRefs = false,
                moneyBudgetsRefs = false,
                recurringTransactionsRefs = false,
              }) {
                return PrefetchHooks(
                  db: db,
                  explicitlyWatchedTables: [
                    if (moneyTransactionsRefs) db.moneyTransactions,
                    if (moneyBudgetsRefs) db.moneyBudgets,
                    if (recurringTransactionsRefs) db.recurringTransactions,
                  ],
                  addJoins: null,
                  getPrefetchedDataCallback: (items) async {
                    return [
                      if (moneyTransactionsRefs)
                        await $_getPrefetchedData<
                          MoneyCategoryEntry,
                          $MoneyCategoriesTable,
                          MoneyTransactionEntry
                        >(
                          currentTable: table,
                          referencedTable: $$MoneyCategoriesTableReferences
                              ._moneyTransactionsRefsTable(db),
                          managerFromTypedResult: (p0) =>
                              $$MoneyCategoriesTableReferences(
                                db,
                                table,
                                p0,
                              ).moneyTransactionsRefs,
                          referencedItemsForCurrentItem:
                              (item, referencedItems) => referencedItems.where(
                                (e) => e.categoryId == item.id,
                              ),
                          typedResults: items,
                        ),
                      if (moneyBudgetsRefs)
                        await $_getPrefetchedData<
                          MoneyCategoryEntry,
                          $MoneyCategoriesTable,
                          MoneyBudgetEntry
                        >(
                          currentTable: table,
                          referencedTable: $$MoneyCategoriesTableReferences
                              ._moneyBudgetsRefsTable(db),
                          managerFromTypedResult: (p0) =>
                              $$MoneyCategoriesTableReferences(
                                db,
                                table,
                                p0,
                              ).moneyBudgetsRefs,
                          referencedItemsForCurrentItem:
                              (item, referencedItems) => referencedItems.where(
                                (e) => e.categoryId == item.id,
                              ),
                          typedResults: items,
                        ),
                      if (recurringTransactionsRefs)
                        await $_getPrefetchedData<
                          MoneyCategoryEntry,
                          $MoneyCategoriesTable,
                          RecurringTransactionEntry
                        >(
                          currentTable: table,
                          referencedTable: $$MoneyCategoriesTableReferences
                              ._recurringTransactionsRefsTable(db),
                          managerFromTypedResult: (p0) =>
                              $$MoneyCategoriesTableReferences(
                                db,
                                table,
                                p0,
                              ).recurringTransactionsRefs,
                          referencedItemsForCurrentItem:
                              (item, referencedItems) => referencedItems.where(
                                (e) => e.categoryId == item.id,
                              ),
                          typedResults: items,
                        ),
                    ];
                  },
                );
              },
        ),
      );
}

typedef $$MoneyCategoriesTableProcessedTableManager =
    ProcessedTableManager<
      _$AppDatabase,
      $MoneyCategoriesTable,
      MoneyCategoryEntry,
      $$MoneyCategoriesTableFilterComposer,
      $$MoneyCategoriesTableOrderingComposer,
      $$MoneyCategoriesTableAnnotationComposer,
      $$MoneyCategoriesTableCreateCompanionBuilder,
      $$MoneyCategoriesTableUpdateCompanionBuilder,
      (MoneyCategoryEntry, $$MoneyCategoriesTableReferences),
      MoneyCategoryEntry,
      PrefetchHooks Function({
        bool moneyTransactionsRefs,
        bool moneyBudgetsRefs,
        bool recurringTransactionsRefs,
      })
    >;
typedef $$TaskListsTableCreateCompanionBuilder =
    TaskListsCompanion Function({
      required String id,
      required String title,
      Value<int> colorValue,
      Value<String> iconName,
      Value<int> sortOrder,
      required int createdAtUtc,
      Value<int> rowid,
    });
typedef $$TaskListsTableUpdateCompanionBuilder =
    TaskListsCompanion Function({
      Value<String> id,
      Value<String> title,
      Value<int> colorValue,
      Value<String> iconName,
      Value<int> sortOrder,
      Value<int> createdAtUtc,
      Value<int> rowid,
    });

final class $$TaskListsTableReferences
    extends BaseReferences<_$AppDatabase, $TaskListsTable, TaskListEntry> {
  $$TaskListsTableReferences(super.$_db, super.$_table, super.$_typedResult);

  static MultiTypedResultKey<$TaskItemsTable, List<TaskItemEntry>>
  _taskItemsRefsTable(_$AppDatabase db) => MultiTypedResultKey.fromTable(
    db.taskItems,
    aliasName: $_aliasNameGenerator(db.taskLists.id, db.taskItems.listId),
  );

  $$TaskItemsTableProcessedTableManager get taskItemsRefs {
    final manager = $$TaskItemsTableTableManager(
      $_db,
      $_db.taskItems,
    ).filter((f) => f.listId.id.sqlEquals($_itemColumn<String>('id')!));

    final cache = $_typedResult.readTableOrNull(_taskItemsRefsTable($_db));
    return ProcessedTableManager(
      manager.$state.copyWith(prefetchedData: cache),
    );
  }
}

class $$TaskListsTableFilterComposer
    extends Composer<_$AppDatabase, $TaskListsTable> {
  $$TaskListsTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get title => $composableBuilder(
    column: $table.title,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get colorValue => $composableBuilder(
    column: $table.colorValue,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get iconName => $composableBuilder(
    column: $table.iconName,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get sortOrder => $composableBuilder(
    column: $table.sortOrder,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get createdAtUtc => $composableBuilder(
    column: $table.createdAtUtc,
    builder: (column) => ColumnFilters(column),
  );

  Expression<bool> taskItemsRefs(
    Expression<bool> Function($$TaskItemsTableFilterComposer f) f,
  ) {
    final $$TaskItemsTableFilterComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.id,
      referencedTable: $db.taskItems,
      getReferencedColumn: (t) => t.listId,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$TaskItemsTableFilterComposer(
            $db: $db,
            $table: $db.taskItems,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return f(composer);
  }
}

class $$TaskListsTableOrderingComposer
    extends Composer<_$AppDatabase, $TaskListsTable> {
  $$TaskListsTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get title => $composableBuilder(
    column: $table.title,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get colorValue => $composableBuilder(
    column: $table.colorValue,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get iconName => $composableBuilder(
    column: $table.iconName,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get sortOrder => $composableBuilder(
    column: $table.sortOrder,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get createdAtUtc => $composableBuilder(
    column: $table.createdAtUtc,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$TaskListsTableAnnotationComposer
    extends Composer<_$AppDatabase, $TaskListsTable> {
  $$TaskListsTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get title =>
      $composableBuilder(column: $table.title, builder: (column) => column);

  GeneratedColumn<int> get colorValue => $composableBuilder(
    column: $table.colorValue,
    builder: (column) => column,
  );

  GeneratedColumn<String> get iconName =>
      $composableBuilder(column: $table.iconName, builder: (column) => column);

  GeneratedColumn<int> get sortOrder =>
      $composableBuilder(column: $table.sortOrder, builder: (column) => column);

  GeneratedColumn<int> get createdAtUtc => $composableBuilder(
    column: $table.createdAtUtc,
    builder: (column) => column,
  );

  Expression<T> taskItemsRefs<T extends Object>(
    Expression<T> Function($$TaskItemsTableAnnotationComposer a) f,
  ) {
    final $$TaskItemsTableAnnotationComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.id,
      referencedTable: $db.taskItems,
      getReferencedColumn: (t) => t.listId,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$TaskItemsTableAnnotationComposer(
            $db: $db,
            $table: $db.taskItems,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return f(composer);
  }
}

class $$TaskListsTableTableManager
    extends
        RootTableManager<
          _$AppDatabase,
          $TaskListsTable,
          TaskListEntry,
          $$TaskListsTableFilterComposer,
          $$TaskListsTableOrderingComposer,
          $$TaskListsTableAnnotationComposer,
          $$TaskListsTableCreateCompanionBuilder,
          $$TaskListsTableUpdateCompanionBuilder,
          (TaskListEntry, $$TaskListsTableReferences),
          TaskListEntry,
          PrefetchHooks Function({bool taskItemsRefs})
        > {
  $$TaskListsTableTableManager(_$AppDatabase db, $TaskListsTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$TaskListsTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$TaskListsTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$TaskListsTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> id = const Value.absent(),
                Value<String> title = const Value.absent(),
                Value<int> colorValue = const Value.absent(),
                Value<String> iconName = const Value.absent(),
                Value<int> sortOrder = const Value.absent(),
                Value<int> createdAtUtc = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => TaskListsCompanion(
                id: id,
                title: title,
                colorValue: colorValue,
                iconName: iconName,
                sortOrder: sortOrder,
                createdAtUtc: createdAtUtc,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String id,
                required String title,
                Value<int> colorValue = const Value.absent(),
                Value<String> iconName = const Value.absent(),
                Value<int> sortOrder = const Value.absent(),
                required int createdAtUtc,
                Value<int> rowid = const Value.absent(),
              }) => TaskListsCompanion.insert(
                id: id,
                title: title,
                colorValue: colorValue,
                iconName: iconName,
                sortOrder: sortOrder,
                createdAtUtc: createdAtUtc,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map(
                (e) => (
                  e.readTable(table),
                  $$TaskListsTableReferences(db, table, e),
                ),
              )
              .toList(),
          prefetchHooksCallback: ({taskItemsRefs = false}) {
            return PrefetchHooks(
              db: db,
              explicitlyWatchedTables: [if (taskItemsRefs) db.taskItems],
              addJoins: null,
              getPrefetchedDataCallback: (items) async {
                return [
                  if (taskItemsRefs)
                    await $_getPrefetchedData<
                      TaskListEntry,
                      $TaskListsTable,
                      TaskItemEntry
                    >(
                      currentTable: table,
                      referencedTable: $$TaskListsTableReferences
                          ._taskItemsRefsTable(db),
                      managerFromTypedResult: (p0) =>
                          $$TaskListsTableReferences(
                            db,
                            table,
                            p0,
                          ).taskItemsRefs,
                      referencedItemsForCurrentItem: (item, referencedItems) =>
                          referencedItems.where((e) => e.listId == item.id),
                      typedResults: items,
                    ),
                ];
              },
            );
          },
        ),
      );
}

typedef $$TaskListsTableProcessedTableManager =
    ProcessedTableManager<
      _$AppDatabase,
      $TaskListsTable,
      TaskListEntry,
      $$TaskListsTableFilterComposer,
      $$TaskListsTableOrderingComposer,
      $$TaskListsTableAnnotationComposer,
      $$TaskListsTableCreateCompanionBuilder,
      $$TaskListsTableUpdateCompanionBuilder,
      (TaskListEntry, $$TaskListsTableReferences),
      TaskListEntry,
      PrefetchHooks Function({bool taskItemsRefs})
    >;
typedef $$TaskItemsTableCreateCompanionBuilder =
    TaskItemsCompanion Function({
      required String id,
      Value<String?> listId,
      Value<String?> parentTaskId,
      required String title,
      Value<String?> description,
      Value<int?> dueDateUtc,
      Value<bool> hasTime,
      Value<bool> isCompleted,
      Value<int> priority,
      Value<String?> recurrenceRule,
      Value<String?> reminderOffsets,
      required int createdAtUtc,
      required int updatedAtUtc,
      Value<int> rowid,
    });
typedef $$TaskItemsTableUpdateCompanionBuilder =
    TaskItemsCompanion Function({
      Value<String> id,
      Value<String?> listId,
      Value<String?> parentTaskId,
      Value<String> title,
      Value<String?> description,
      Value<int?> dueDateUtc,
      Value<bool> hasTime,
      Value<bool> isCompleted,
      Value<int> priority,
      Value<String?> recurrenceRule,
      Value<String?> reminderOffsets,
      Value<int> createdAtUtc,
      Value<int> updatedAtUtc,
      Value<int> rowid,
    });

final class $$TaskItemsTableReferences
    extends BaseReferences<_$AppDatabase, $TaskItemsTable, TaskItemEntry> {
  $$TaskItemsTableReferences(super.$_db, super.$_table, super.$_typedResult);

  static $TaskListsTable _listIdTable(_$AppDatabase db) => db.taskLists
      .createAlias($_aliasNameGenerator(db.taskItems.listId, db.taskLists.id));

  $$TaskListsTableProcessedTableManager? get listId {
    final $_column = $_itemColumn<String>('list_id');
    if ($_column == null) return null;
    final manager = $$TaskListsTableTableManager(
      $_db,
      $_db.taskLists,
    ).filter((f) => f.id.sqlEquals($_column));
    final item = $_typedResult.readTableOrNull(_listIdTable($_db));
    if (item == null) return manager;
    return ProcessedTableManager(
      manager.$state.copyWith(prefetchedData: [item]),
    );
  }

  static MultiTypedResultKey<
    $MoneyTransactionsTable,
    List<MoneyTransactionEntry>
  >
  _moneyTransactionsRefsTable(_$AppDatabase db) =>
      MultiTypedResultKey.fromTable(
        db.moneyTransactions,
        aliasName: $_aliasNameGenerator(
          db.taskItems.id,
          db.moneyTransactions.linkedTaskId,
        ),
      );

  $$MoneyTransactionsTableProcessedTableManager get moneyTransactionsRefs {
    final manager = $$MoneyTransactionsTableTableManager(
      $_db,
      $_db.moneyTransactions,
    ).filter((f) => f.linkedTaskId.id.sqlEquals($_itemColumn<String>('id')!));

    final cache = $_typedResult.readTableOrNull(
      _moneyTransactionsRefsTable($_db),
    );
    return ProcessedTableManager(
      manager.$state.copyWith(prefetchedData: cache),
    );
  }
}

class $$TaskItemsTableFilterComposer
    extends Composer<_$AppDatabase, $TaskItemsTable> {
  $$TaskItemsTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get parentTaskId => $composableBuilder(
    column: $table.parentTaskId,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get title => $composableBuilder(
    column: $table.title,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get description => $composableBuilder(
    column: $table.description,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get dueDateUtc => $composableBuilder(
    column: $table.dueDateUtc,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<bool> get hasTime => $composableBuilder(
    column: $table.hasTime,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<bool> get isCompleted => $composableBuilder(
    column: $table.isCompleted,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get priority => $composableBuilder(
    column: $table.priority,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get recurrenceRule => $composableBuilder(
    column: $table.recurrenceRule,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get reminderOffsets => $composableBuilder(
    column: $table.reminderOffsets,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get createdAtUtc => $composableBuilder(
    column: $table.createdAtUtc,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get updatedAtUtc => $composableBuilder(
    column: $table.updatedAtUtc,
    builder: (column) => ColumnFilters(column),
  );

  $$TaskListsTableFilterComposer get listId {
    final $$TaskListsTableFilterComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.listId,
      referencedTable: $db.taskLists,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$TaskListsTableFilterComposer(
            $db: $db,
            $table: $db.taskLists,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }

  Expression<bool> moneyTransactionsRefs(
    Expression<bool> Function($$MoneyTransactionsTableFilterComposer f) f,
  ) {
    final $$MoneyTransactionsTableFilterComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.id,
      referencedTable: $db.moneyTransactions,
      getReferencedColumn: (t) => t.linkedTaskId,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$MoneyTransactionsTableFilterComposer(
            $db: $db,
            $table: $db.moneyTransactions,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return f(composer);
  }
}

class $$TaskItemsTableOrderingComposer
    extends Composer<_$AppDatabase, $TaskItemsTable> {
  $$TaskItemsTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get parentTaskId => $composableBuilder(
    column: $table.parentTaskId,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get title => $composableBuilder(
    column: $table.title,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get description => $composableBuilder(
    column: $table.description,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get dueDateUtc => $composableBuilder(
    column: $table.dueDateUtc,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<bool> get hasTime => $composableBuilder(
    column: $table.hasTime,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<bool> get isCompleted => $composableBuilder(
    column: $table.isCompleted,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get priority => $composableBuilder(
    column: $table.priority,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get recurrenceRule => $composableBuilder(
    column: $table.recurrenceRule,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get reminderOffsets => $composableBuilder(
    column: $table.reminderOffsets,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get createdAtUtc => $composableBuilder(
    column: $table.createdAtUtc,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get updatedAtUtc => $composableBuilder(
    column: $table.updatedAtUtc,
    builder: (column) => ColumnOrderings(column),
  );

  $$TaskListsTableOrderingComposer get listId {
    final $$TaskListsTableOrderingComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.listId,
      referencedTable: $db.taskLists,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$TaskListsTableOrderingComposer(
            $db: $db,
            $table: $db.taskLists,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }
}

class $$TaskItemsTableAnnotationComposer
    extends Composer<_$AppDatabase, $TaskItemsTable> {
  $$TaskItemsTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get parentTaskId => $composableBuilder(
    column: $table.parentTaskId,
    builder: (column) => column,
  );

  GeneratedColumn<String> get title =>
      $composableBuilder(column: $table.title, builder: (column) => column);

  GeneratedColumn<String> get description => $composableBuilder(
    column: $table.description,
    builder: (column) => column,
  );

  GeneratedColumn<int> get dueDateUtc => $composableBuilder(
    column: $table.dueDateUtc,
    builder: (column) => column,
  );

  GeneratedColumn<bool> get hasTime =>
      $composableBuilder(column: $table.hasTime, builder: (column) => column);

  GeneratedColumn<bool> get isCompleted => $composableBuilder(
    column: $table.isCompleted,
    builder: (column) => column,
  );

  GeneratedColumn<int> get priority =>
      $composableBuilder(column: $table.priority, builder: (column) => column);

  GeneratedColumn<String> get recurrenceRule => $composableBuilder(
    column: $table.recurrenceRule,
    builder: (column) => column,
  );

  GeneratedColumn<String> get reminderOffsets => $composableBuilder(
    column: $table.reminderOffsets,
    builder: (column) => column,
  );

  GeneratedColumn<int> get createdAtUtc => $composableBuilder(
    column: $table.createdAtUtc,
    builder: (column) => column,
  );

  GeneratedColumn<int> get updatedAtUtc => $composableBuilder(
    column: $table.updatedAtUtc,
    builder: (column) => column,
  );

  $$TaskListsTableAnnotationComposer get listId {
    final $$TaskListsTableAnnotationComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.listId,
      referencedTable: $db.taskLists,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$TaskListsTableAnnotationComposer(
            $db: $db,
            $table: $db.taskLists,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }

  Expression<T> moneyTransactionsRefs<T extends Object>(
    Expression<T> Function($$MoneyTransactionsTableAnnotationComposer a) f,
  ) {
    final $$MoneyTransactionsTableAnnotationComposer composer =
        $composerBuilder(
          composer: this,
          getCurrentColumn: (t) => t.id,
          referencedTable: $db.moneyTransactions,
          getReferencedColumn: (t) => t.linkedTaskId,
          builder:
              (
                joinBuilder, {
                $addJoinBuilderToRootComposer,
                $removeJoinBuilderFromRootComposer,
              }) => $$MoneyTransactionsTableAnnotationComposer(
                $db: $db,
                $table: $db.moneyTransactions,
                $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
                joinBuilder: joinBuilder,
                $removeJoinBuilderFromRootComposer:
                    $removeJoinBuilderFromRootComposer,
              ),
        );
    return f(composer);
  }
}

class $$TaskItemsTableTableManager
    extends
        RootTableManager<
          _$AppDatabase,
          $TaskItemsTable,
          TaskItemEntry,
          $$TaskItemsTableFilterComposer,
          $$TaskItemsTableOrderingComposer,
          $$TaskItemsTableAnnotationComposer,
          $$TaskItemsTableCreateCompanionBuilder,
          $$TaskItemsTableUpdateCompanionBuilder,
          (TaskItemEntry, $$TaskItemsTableReferences),
          TaskItemEntry,
          PrefetchHooks Function({bool listId, bool moneyTransactionsRefs})
        > {
  $$TaskItemsTableTableManager(_$AppDatabase db, $TaskItemsTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$TaskItemsTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$TaskItemsTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$TaskItemsTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> id = const Value.absent(),
                Value<String?> listId = const Value.absent(),
                Value<String?> parentTaskId = const Value.absent(),
                Value<String> title = const Value.absent(),
                Value<String?> description = const Value.absent(),
                Value<int?> dueDateUtc = const Value.absent(),
                Value<bool> hasTime = const Value.absent(),
                Value<bool> isCompleted = const Value.absent(),
                Value<int> priority = const Value.absent(),
                Value<String?> recurrenceRule = const Value.absent(),
                Value<String?> reminderOffsets = const Value.absent(),
                Value<int> createdAtUtc = const Value.absent(),
                Value<int> updatedAtUtc = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => TaskItemsCompanion(
                id: id,
                listId: listId,
                parentTaskId: parentTaskId,
                title: title,
                description: description,
                dueDateUtc: dueDateUtc,
                hasTime: hasTime,
                isCompleted: isCompleted,
                priority: priority,
                recurrenceRule: recurrenceRule,
                reminderOffsets: reminderOffsets,
                createdAtUtc: createdAtUtc,
                updatedAtUtc: updatedAtUtc,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String id,
                Value<String?> listId = const Value.absent(),
                Value<String?> parentTaskId = const Value.absent(),
                required String title,
                Value<String?> description = const Value.absent(),
                Value<int?> dueDateUtc = const Value.absent(),
                Value<bool> hasTime = const Value.absent(),
                Value<bool> isCompleted = const Value.absent(),
                Value<int> priority = const Value.absent(),
                Value<String?> recurrenceRule = const Value.absent(),
                Value<String?> reminderOffsets = const Value.absent(),
                required int createdAtUtc,
                required int updatedAtUtc,
                Value<int> rowid = const Value.absent(),
              }) => TaskItemsCompanion.insert(
                id: id,
                listId: listId,
                parentTaskId: parentTaskId,
                title: title,
                description: description,
                dueDateUtc: dueDateUtc,
                hasTime: hasTime,
                isCompleted: isCompleted,
                priority: priority,
                recurrenceRule: recurrenceRule,
                reminderOffsets: reminderOffsets,
                createdAtUtc: createdAtUtc,
                updatedAtUtc: updatedAtUtc,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map(
                (e) => (
                  e.readTable(table),
                  $$TaskItemsTableReferences(db, table, e),
                ),
              )
              .toList(),
          prefetchHooksCallback:
              ({listId = false, moneyTransactionsRefs = false}) {
                return PrefetchHooks(
                  db: db,
                  explicitlyWatchedTables: [
                    if (moneyTransactionsRefs) db.moneyTransactions,
                  ],
                  addJoins:
                      <
                        T extends TableManagerState<
                          dynamic,
                          dynamic,
                          dynamic,
                          dynamic,
                          dynamic,
                          dynamic,
                          dynamic,
                          dynamic,
                          dynamic,
                          dynamic,
                          dynamic
                        >
                      >(state) {
                        if (listId) {
                          state =
                              state.withJoin(
                                    currentTable: table,
                                    currentColumn: table.listId,
                                    referencedTable: $$TaskItemsTableReferences
                                        ._listIdTable(db),
                                    referencedColumn: $$TaskItemsTableReferences
                                        ._listIdTable(db)
                                        .id,
                                  )
                                  as T;
                        }

                        return state;
                      },
                  getPrefetchedDataCallback: (items) async {
                    return [
                      if (moneyTransactionsRefs)
                        await $_getPrefetchedData<
                          TaskItemEntry,
                          $TaskItemsTable,
                          MoneyTransactionEntry
                        >(
                          currentTable: table,
                          referencedTable: $$TaskItemsTableReferences
                              ._moneyTransactionsRefsTable(db),
                          managerFromTypedResult: (p0) =>
                              $$TaskItemsTableReferences(
                                db,
                                table,
                                p0,
                              ).moneyTransactionsRefs,
                          referencedItemsForCurrentItem:
                              (item, referencedItems) => referencedItems.where(
                                (e) => e.linkedTaskId == item.id,
                              ),
                          typedResults: items,
                        ),
                    ];
                  },
                );
              },
        ),
      );
}

typedef $$TaskItemsTableProcessedTableManager =
    ProcessedTableManager<
      _$AppDatabase,
      $TaskItemsTable,
      TaskItemEntry,
      $$TaskItemsTableFilterComposer,
      $$TaskItemsTableOrderingComposer,
      $$TaskItemsTableAnnotationComposer,
      $$TaskItemsTableCreateCompanionBuilder,
      $$TaskItemsTableUpdateCompanionBuilder,
      (TaskItemEntry, $$TaskItemsTableReferences),
      TaskItemEntry,
      PrefetchHooks Function({bool listId, bool moneyTransactionsRefs})
    >;
typedef $$MoneyTransactionsTableCreateCompanionBuilder =
    MoneyTransactionsCompanion Function({
      required String id,
      required String accountId,
      Value<String?> toAccountId,
      Value<String?> categoryId,
      required int amountPaise,
      Value<String> type,
      required int transactionTimeUtc,
      Value<String?> note,
      Value<String?> linkedCalendarEventId,
      Value<String?> linkedTaskId,
      required int createdAtUtc,
      Value<int> rowid,
    });
typedef $$MoneyTransactionsTableUpdateCompanionBuilder =
    MoneyTransactionsCompanion Function({
      Value<String> id,
      Value<String> accountId,
      Value<String?> toAccountId,
      Value<String?> categoryId,
      Value<int> amountPaise,
      Value<String> type,
      Value<int> transactionTimeUtc,
      Value<String?> note,
      Value<String?> linkedCalendarEventId,
      Value<String?> linkedTaskId,
      Value<int> createdAtUtc,
      Value<int> rowid,
    });

final class $$MoneyTransactionsTableReferences
    extends
        BaseReferences<
          _$AppDatabase,
          $MoneyTransactionsTable,
          MoneyTransactionEntry
        > {
  $$MoneyTransactionsTableReferences(
    super.$_db,
    super.$_table,
    super.$_typedResult,
  );

  static $MoneyAccountsTable _accountIdTable(_$AppDatabase db) =>
      db.moneyAccounts.createAlias(
        $_aliasNameGenerator(
          db.moneyTransactions.accountId,
          db.moneyAccounts.id,
        ),
      );

  $$MoneyAccountsTableProcessedTableManager get accountId {
    final $_column = $_itemColumn<String>('account_id')!;

    final manager = $$MoneyAccountsTableTableManager(
      $_db,
      $_db.moneyAccounts,
    ).filter((f) => f.id.sqlEquals($_column));
    final item = $_typedResult.readTableOrNull(_accountIdTable($_db));
    if (item == null) return manager;
    return ProcessedTableManager(
      manager.$state.copyWith(prefetchedData: [item]),
    );
  }

  static $MoneyAccountsTable _toAccountIdTable(_$AppDatabase db) =>
      db.moneyAccounts.createAlias(
        $_aliasNameGenerator(
          db.moneyTransactions.toAccountId,
          db.moneyAccounts.id,
        ),
      );

  $$MoneyAccountsTableProcessedTableManager? get toAccountId {
    final $_column = $_itemColumn<String>('to_account_id');
    if ($_column == null) return null;
    final manager = $$MoneyAccountsTableTableManager(
      $_db,
      $_db.moneyAccounts,
    ).filter((f) => f.id.sqlEquals($_column));
    final item = $_typedResult.readTableOrNull(_toAccountIdTable($_db));
    if (item == null) return manager;
    return ProcessedTableManager(
      manager.$state.copyWith(prefetchedData: [item]),
    );
  }

  static $MoneyCategoriesTable _categoryIdTable(_$AppDatabase db) =>
      db.moneyCategories.createAlias(
        $_aliasNameGenerator(
          db.moneyTransactions.categoryId,
          db.moneyCategories.id,
        ),
      );

  $$MoneyCategoriesTableProcessedTableManager? get categoryId {
    final $_column = $_itemColumn<String>('category_id');
    if ($_column == null) return null;
    final manager = $$MoneyCategoriesTableTableManager(
      $_db,
      $_db.moneyCategories,
    ).filter((f) => f.id.sqlEquals($_column));
    final item = $_typedResult.readTableOrNull(_categoryIdTable($_db));
    if (item == null) return manager;
    return ProcessedTableManager(
      manager.$state.copyWith(prefetchedData: [item]),
    );
  }

  static $CalendarEventsTable _linkedCalendarEventIdTable(_$AppDatabase db) =>
      db.calendarEvents.createAlias(
        $_aliasNameGenerator(
          db.moneyTransactions.linkedCalendarEventId,
          db.calendarEvents.id,
        ),
      );

  $$CalendarEventsTableProcessedTableManager? get linkedCalendarEventId {
    final $_column = $_itemColumn<String>('linked_calendar_event_id');
    if ($_column == null) return null;
    final manager = $$CalendarEventsTableTableManager(
      $_db,
      $_db.calendarEvents,
    ).filter((f) => f.id.sqlEquals($_column));
    final item = $_typedResult.readTableOrNull(
      _linkedCalendarEventIdTable($_db),
    );
    if (item == null) return manager;
    return ProcessedTableManager(
      manager.$state.copyWith(prefetchedData: [item]),
    );
  }

  static $TaskItemsTable _linkedTaskIdTable(_$AppDatabase db) =>
      db.taskItems.createAlias(
        $_aliasNameGenerator(
          db.moneyTransactions.linkedTaskId,
          db.taskItems.id,
        ),
      );

  $$TaskItemsTableProcessedTableManager? get linkedTaskId {
    final $_column = $_itemColumn<String>('linked_task_id');
    if ($_column == null) return null;
    final manager = $$TaskItemsTableTableManager(
      $_db,
      $_db.taskItems,
    ).filter((f) => f.id.sqlEquals($_column));
    final item = $_typedResult.readTableOrNull(_linkedTaskIdTable($_db));
    if (item == null) return manager;
    return ProcessedTableManager(
      manager.$state.copyWith(prefetchedData: [item]),
    );
  }
}

class $$MoneyTransactionsTableFilterComposer
    extends Composer<_$AppDatabase, $MoneyTransactionsTable> {
  $$MoneyTransactionsTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get amountPaise => $composableBuilder(
    column: $table.amountPaise,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get type => $composableBuilder(
    column: $table.type,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get transactionTimeUtc => $composableBuilder(
    column: $table.transactionTimeUtc,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get note => $composableBuilder(
    column: $table.note,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get createdAtUtc => $composableBuilder(
    column: $table.createdAtUtc,
    builder: (column) => ColumnFilters(column),
  );

  $$MoneyAccountsTableFilterComposer get accountId {
    final $$MoneyAccountsTableFilterComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.accountId,
      referencedTable: $db.moneyAccounts,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$MoneyAccountsTableFilterComposer(
            $db: $db,
            $table: $db.moneyAccounts,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }

  $$MoneyAccountsTableFilterComposer get toAccountId {
    final $$MoneyAccountsTableFilterComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.toAccountId,
      referencedTable: $db.moneyAccounts,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$MoneyAccountsTableFilterComposer(
            $db: $db,
            $table: $db.moneyAccounts,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }

  $$MoneyCategoriesTableFilterComposer get categoryId {
    final $$MoneyCategoriesTableFilterComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.categoryId,
      referencedTable: $db.moneyCategories,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$MoneyCategoriesTableFilterComposer(
            $db: $db,
            $table: $db.moneyCategories,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }

  $$CalendarEventsTableFilterComposer get linkedCalendarEventId {
    final $$CalendarEventsTableFilterComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.linkedCalendarEventId,
      referencedTable: $db.calendarEvents,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$CalendarEventsTableFilterComposer(
            $db: $db,
            $table: $db.calendarEvents,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }

  $$TaskItemsTableFilterComposer get linkedTaskId {
    final $$TaskItemsTableFilterComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.linkedTaskId,
      referencedTable: $db.taskItems,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$TaskItemsTableFilterComposer(
            $db: $db,
            $table: $db.taskItems,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }
}

class $$MoneyTransactionsTableOrderingComposer
    extends Composer<_$AppDatabase, $MoneyTransactionsTable> {
  $$MoneyTransactionsTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get amountPaise => $composableBuilder(
    column: $table.amountPaise,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get type => $composableBuilder(
    column: $table.type,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get transactionTimeUtc => $composableBuilder(
    column: $table.transactionTimeUtc,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get note => $composableBuilder(
    column: $table.note,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get createdAtUtc => $composableBuilder(
    column: $table.createdAtUtc,
    builder: (column) => ColumnOrderings(column),
  );

  $$MoneyAccountsTableOrderingComposer get accountId {
    final $$MoneyAccountsTableOrderingComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.accountId,
      referencedTable: $db.moneyAccounts,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$MoneyAccountsTableOrderingComposer(
            $db: $db,
            $table: $db.moneyAccounts,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }

  $$MoneyAccountsTableOrderingComposer get toAccountId {
    final $$MoneyAccountsTableOrderingComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.toAccountId,
      referencedTable: $db.moneyAccounts,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$MoneyAccountsTableOrderingComposer(
            $db: $db,
            $table: $db.moneyAccounts,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }

  $$MoneyCategoriesTableOrderingComposer get categoryId {
    final $$MoneyCategoriesTableOrderingComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.categoryId,
      referencedTable: $db.moneyCategories,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$MoneyCategoriesTableOrderingComposer(
            $db: $db,
            $table: $db.moneyCategories,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }

  $$CalendarEventsTableOrderingComposer get linkedCalendarEventId {
    final $$CalendarEventsTableOrderingComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.linkedCalendarEventId,
      referencedTable: $db.calendarEvents,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$CalendarEventsTableOrderingComposer(
            $db: $db,
            $table: $db.calendarEvents,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }

  $$TaskItemsTableOrderingComposer get linkedTaskId {
    final $$TaskItemsTableOrderingComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.linkedTaskId,
      referencedTable: $db.taskItems,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$TaskItemsTableOrderingComposer(
            $db: $db,
            $table: $db.taskItems,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }
}

class $$MoneyTransactionsTableAnnotationComposer
    extends Composer<_$AppDatabase, $MoneyTransactionsTable> {
  $$MoneyTransactionsTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<int> get amountPaise => $composableBuilder(
    column: $table.amountPaise,
    builder: (column) => column,
  );

  GeneratedColumn<String> get type =>
      $composableBuilder(column: $table.type, builder: (column) => column);

  GeneratedColumn<int> get transactionTimeUtc => $composableBuilder(
    column: $table.transactionTimeUtc,
    builder: (column) => column,
  );

  GeneratedColumn<String> get note =>
      $composableBuilder(column: $table.note, builder: (column) => column);

  GeneratedColumn<int> get createdAtUtc => $composableBuilder(
    column: $table.createdAtUtc,
    builder: (column) => column,
  );

  $$MoneyAccountsTableAnnotationComposer get accountId {
    final $$MoneyAccountsTableAnnotationComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.accountId,
      referencedTable: $db.moneyAccounts,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$MoneyAccountsTableAnnotationComposer(
            $db: $db,
            $table: $db.moneyAccounts,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }

  $$MoneyAccountsTableAnnotationComposer get toAccountId {
    final $$MoneyAccountsTableAnnotationComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.toAccountId,
      referencedTable: $db.moneyAccounts,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$MoneyAccountsTableAnnotationComposer(
            $db: $db,
            $table: $db.moneyAccounts,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }

  $$MoneyCategoriesTableAnnotationComposer get categoryId {
    final $$MoneyCategoriesTableAnnotationComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.categoryId,
      referencedTable: $db.moneyCategories,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$MoneyCategoriesTableAnnotationComposer(
            $db: $db,
            $table: $db.moneyCategories,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }

  $$CalendarEventsTableAnnotationComposer get linkedCalendarEventId {
    final $$CalendarEventsTableAnnotationComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.linkedCalendarEventId,
      referencedTable: $db.calendarEvents,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$CalendarEventsTableAnnotationComposer(
            $db: $db,
            $table: $db.calendarEvents,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }

  $$TaskItemsTableAnnotationComposer get linkedTaskId {
    final $$TaskItemsTableAnnotationComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.linkedTaskId,
      referencedTable: $db.taskItems,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$TaskItemsTableAnnotationComposer(
            $db: $db,
            $table: $db.taskItems,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }
}

class $$MoneyTransactionsTableTableManager
    extends
        RootTableManager<
          _$AppDatabase,
          $MoneyTransactionsTable,
          MoneyTransactionEntry,
          $$MoneyTransactionsTableFilterComposer,
          $$MoneyTransactionsTableOrderingComposer,
          $$MoneyTransactionsTableAnnotationComposer,
          $$MoneyTransactionsTableCreateCompanionBuilder,
          $$MoneyTransactionsTableUpdateCompanionBuilder,
          (MoneyTransactionEntry, $$MoneyTransactionsTableReferences),
          MoneyTransactionEntry,
          PrefetchHooks Function({
            bool accountId,
            bool toAccountId,
            bool categoryId,
            bool linkedCalendarEventId,
            bool linkedTaskId,
          })
        > {
  $$MoneyTransactionsTableTableManager(
    _$AppDatabase db,
    $MoneyTransactionsTable table,
  ) : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$MoneyTransactionsTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$MoneyTransactionsTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$MoneyTransactionsTableAnnotationComposer(
                $db: db,
                $table: table,
              ),
          updateCompanionCallback:
              ({
                Value<String> id = const Value.absent(),
                Value<String> accountId = const Value.absent(),
                Value<String?> toAccountId = const Value.absent(),
                Value<String?> categoryId = const Value.absent(),
                Value<int> amountPaise = const Value.absent(),
                Value<String> type = const Value.absent(),
                Value<int> transactionTimeUtc = const Value.absent(),
                Value<String?> note = const Value.absent(),
                Value<String?> linkedCalendarEventId = const Value.absent(),
                Value<String?> linkedTaskId = const Value.absent(),
                Value<int> createdAtUtc = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => MoneyTransactionsCompanion(
                id: id,
                accountId: accountId,
                toAccountId: toAccountId,
                categoryId: categoryId,
                amountPaise: amountPaise,
                type: type,
                transactionTimeUtc: transactionTimeUtc,
                note: note,
                linkedCalendarEventId: linkedCalendarEventId,
                linkedTaskId: linkedTaskId,
                createdAtUtc: createdAtUtc,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String id,
                required String accountId,
                Value<String?> toAccountId = const Value.absent(),
                Value<String?> categoryId = const Value.absent(),
                required int amountPaise,
                Value<String> type = const Value.absent(),
                required int transactionTimeUtc,
                Value<String?> note = const Value.absent(),
                Value<String?> linkedCalendarEventId = const Value.absent(),
                Value<String?> linkedTaskId = const Value.absent(),
                required int createdAtUtc,
                Value<int> rowid = const Value.absent(),
              }) => MoneyTransactionsCompanion.insert(
                id: id,
                accountId: accountId,
                toAccountId: toAccountId,
                categoryId: categoryId,
                amountPaise: amountPaise,
                type: type,
                transactionTimeUtc: transactionTimeUtc,
                note: note,
                linkedCalendarEventId: linkedCalendarEventId,
                linkedTaskId: linkedTaskId,
                createdAtUtc: createdAtUtc,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map(
                (e) => (
                  e.readTable(table),
                  $$MoneyTransactionsTableReferences(db, table, e),
                ),
              )
              .toList(),
          prefetchHooksCallback:
              ({
                accountId = false,
                toAccountId = false,
                categoryId = false,
                linkedCalendarEventId = false,
                linkedTaskId = false,
              }) {
                return PrefetchHooks(
                  db: db,
                  explicitlyWatchedTables: [],
                  addJoins:
                      <
                        T extends TableManagerState<
                          dynamic,
                          dynamic,
                          dynamic,
                          dynamic,
                          dynamic,
                          dynamic,
                          dynamic,
                          dynamic,
                          dynamic,
                          dynamic,
                          dynamic
                        >
                      >(state) {
                        if (accountId) {
                          state =
                              state.withJoin(
                                    currentTable: table,
                                    currentColumn: table.accountId,
                                    referencedTable:
                                        $$MoneyTransactionsTableReferences
                                            ._accountIdTable(db),
                                    referencedColumn:
                                        $$MoneyTransactionsTableReferences
                                            ._accountIdTable(db)
                                            .id,
                                  )
                                  as T;
                        }
                        if (toAccountId) {
                          state =
                              state.withJoin(
                                    currentTable: table,
                                    currentColumn: table.toAccountId,
                                    referencedTable:
                                        $$MoneyTransactionsTableReferences
                                            ._toAccountIdTable(db),
                                    referencedColumn:
                                        $$MoneyTransactionsTableReferences
                                            ._toAccountIdTable(db)
                                            .id,
                                  )
                                  as T;
                        }
                        if (categoryId) {
                          state =
                              state.withJoin(
                                    currentTable: table,
                                    currentColumn: table.categoryId,
                                    referencedTable:
                                        $$MoneyTransactionsTableReferences
                                            ._categoryIdTable(db),
                                    referencedColumn:
                                        $$MoneyTransactionsTableReferences
                                            ._categoryIdTable(db)
                                            .id,
                                  )
                                  as T;
                        }
                        if (linkedCalendarEventId) {
                          state =
                              state.withJoin(
                                    currentTable: table,
                                    currentColumn: table.linkedCalendarEventId,
                                    referencedTable:
                                        $$MoneyTransactionsTableReferences
                                            ._linkedCalendarEventIdTable(db),
                                    referencedColumn:
                                        $$MoneyTransactionsTableReferences
                                            ._linkedCalendarEventIdTable(db)
                                            .id,
                                  )
                                  as T;
                        }
                        if (linkedTaskId) {
                          state =
                              state.withJoin(
                                    currentTable: table,
                                    currentColumn: table.linkedTaskId,
                                    referencedTable:
                                        $$MoneyTransactionsTableReferences
                                            ._linkedTaskIdTable(db),
                                    referencedColumn:
                                        $$MoneyTransactionsTableReferences
                                            ._linkedTaskIdTable(db)
                                            .id,
                                  )
                                  as T;
                        }

                        return state;
                      },
                  getPrefetchedDataCallback: (items) async {
                    return [];
                  },
                );
              },
        ),
      );
}

typedef $$MoneyTransactionsTableProcessedTableManager =
    ProcessedTableManager<
      _$AppDatabase,
      $MoneyTransactionsTable,
      MoneyTransactionEntry,
      $$MoneyTransactionsTableFilterComposer,
      $$MoneyTransactionsTableOrderingComposer,
      $$MoneyTransactionsTableAnnotationComposer,
      $$MoneyTransactionsTableCreateCompanionBuilder,
      $$MoneyTransactionsTableUpdateCompanionBuilder,
      (MoneyTransactionEntry, $$MoneyTransactionsTableReferences),
      MoneyTransactionEntry,
      PrefetchHooks Function({
        bool accountId,
        bool toAccountId,
        bool categoryId,
        bool linkedCalendarEventId,
        bool linkedTaskId,
      })
    >;
typedef $$MoneyBudgetsTableCreateCompanionBuilder =
    MoneyBudgetsCompanion Function({
      required String id,
      Value<String?> categoryId,
      required int amountPaise,
      Value<String> period,
      Value<int> rowid,
    });
typedef $$MoneyBudgetsTableUpdateCompanionBuilder =
    MoneyBudgetsCompanion Function({
      Value<String> id,
      Value<String?> categoryId,
      Value<int> amountPaise,
      Value<String> period,
      Value<int> rowid,
    });

final class $$MoneyBudgetsTableReferences
    extends
        BaseReferences<_$AppDatabase, $MoneyBudgetsTable, MoneyBudgetEntry> {
  $$MoneyBudgetsTableReferences(super.$_db, super.$_table, super.$_typedResult);

  static $MoneyCategoriesTable _categoryIdTable(_$AppDatabase db) =>
      db.moneyCategories.createAlias(
        $_aliasNameGenerator(db.moneyBudgets.categoryId, db.moneyCategories.id),
      );

  $$MoneyCategoriesTableProcessedTableManager? get categoryId {
    final $_column = $_itemColumn<String>('category_id');
    if ($_column == null) return null;
    final manager = $$MoneyCategoriesTableTableManager(
      $_db,
      $_db.moneyCategories,
    ).filter((f) => f.id.sqlEquals($_column));
    final item = $_typedResult.readTableOrNull(_categoryIdTable($_db));
    if (item == null) return manager;
    return ProcessedTableManager(
      manager.$state.copyWith(prefetchedData: [item]),
    );
  }
}

class $$MoneyBudgetsTableFilterComposer
    extends Composer<_$AppDatabase, $MoneyBudgetsTable> {
  $$MoneyBudgetsTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get amountPaise => $composableBuilder(
    column: $table.amountPaise,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get period => $composableBuilder(
    column: $table.period,
    builder: (column) => ColumnFilters(column),
  );

  $$MoneyCategoriesTableFilterComposer get categoryId {
    final $$MoneyCategoriesTableFilterComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.categoryId,
      referencedTable: $db.moneyCategories,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$MoneyCategoriesTableFilterComposer(
            $db: $db,
            $table: $db.moneyCategories,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }
}

class $$MoneyBudgetsTableOrderingComposer
    extends Composer<_$AppDatabase, $MoneyBudgetsTable> {
  $$MoneyBudgetsTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get amountPaise => $composableBuilder(
    column: $table.amountPaise,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get period => $composableBuilder(
    column: $table.period,
    builder: (column) => ColumnOrderings(column),
  );

  $$MoneyCategoriesTableOrderingComposer get categoryId {
    final $$MoneyCategoriesTableOrderingComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.categoryId,
      referencedTable: $db.moneyCategories,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$MoneyCategoriesTableOrderingComposer(
            $db: $db,
            $table: $db.moneyCategories,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }
}

class $$MoneyBudgetsTableAnnotationComposer
    extends Composer<_$AppDatabase, $MoneyBudgetsTable> {
  $$MoneyBudgetsTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<int> get amountPaise => $composableBuilder(
    column: $table.amountPaise,
    builder: (column) => column,
  );

  GeneratedColumn<String> get period =>
      $composableBuilder(column: $table.period, builder: (column) => column);

  $$MoneyCategoriesTableAnnotationComposer get categoryId {
    final $$MoneyCategoriesTableAnnotationComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.categoryId,
      referencedTable: $db.moneyCategories,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$MoneyCategoriesTableAnnotationComposer(
            $db: $db,
            $table: $db.moneyCategories,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }
}

class $$MoneyBudgetsTableTableManager
    extends
        RootTableManager<
          _$AppDatabase,
          $MoneyBudgetsTable,
          MoneyBudgetEntry,
          $$MoneyBudgetsTableFilterComposer,
          $$MoneyBudgetsTableOrderingComposer,
          $$MoneyBudgetsTableAnnotationComposer,
          $$MoneyBudgetsTableCreateCompanionBuilder,
          $$MoneyBudgetsTableUpdateCompanionBuilder,
          (MoneyBudgetEntry, $$MoneyBudgetsTableReferences),
          MoneyBudgetEntry,
          PrefetchHooks Function({bool categoryId})
        > {
  $$MoneyBudgetsTableTableManager(_$AppDatabase db, $MoneyBudgetsTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$MoneyBudgetsTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$MoneyBudgetsTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$MoneyBudgetsTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> id = const Value.absent(),
                Value<String?> categoryId = const Value.absent(),
                Value<int> amountPaise = const Value.absent(),
                Value<String> period = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => MoneyBudgetsCompanion(
                id: id,
                categoryId: categoryId,
                amountPaise: amountPaise,
                period: period,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String id,
                Value<String?> categoryId = const Value.absent(),
                required int amountPaise,
                Value<String> period = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => MoneyBudgetsCompanion.insert(
                id: id,
                categoryId: categoryId,
                amountPaise: amountPaise,
                period: period,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map(
                (e) => (
                  e.readTable(table),
                  $$MoneyBudgetsTableReferences(db, table, e),
                ),
              )
              .toList(),
          prefetchHooksCallback: ({categoryId = false}) {
            return PrefetchHooks(
              db: db,
              explicitlyWatchedTables: [],
              addJoins:
                  <
                    T extends TableManagerState<
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic
                    >
                  >(state) {
                    if (categoryId) {
                      state =
                          state.withJoin(
                                currentTable: table,
                                currentColumn: table.categoryId,
                                referencedTable: $$MoneyBudgetsTableReferences
                                    ._categoryIdTable(db),
                                referencedColumn: $$MoneyBudgetsTableReferences
                                    ._categoryIdTable(db)
                                    .id,
                              )
                              as T;
                    }

                    return state;
                  },
              getPrefetchedDataCallback: (items) async {
                return [];
              },
            );
          },
        ),
      );
}

typedef $$MoneyBudgetsTableProcessedTableManager =
    ProcessedTableManager<
      _$AppDatabase,
      $MoneyBudgetsTable,
      MoneyBudgetEntry,
      $$MoneyBudgetsTableFilterComposer,
      $$MoneyBudgetsTableOrderingComposer,
      $$MoneyBudgetsTableAnnotationComposer,
      $$MoneyBudgetsTableCreateCompanionBuilder,
      $$MoneyBudgetsTableUpdateCompanionBuilder,
      (MoneyBudgetEntry, $$MoneyBudgetsTableReferences),
      MoneyBudgetEntry,
      PrefetchHooks Function({bool categoryId})
    >;
typedef $$SavingsGoalsTableCreateCompanionBuilder =
    SavingsGoalsCompanion Function({
      required String id,
      required String name,
      required int targetAmountPaise,
      Value<int> savedAmountPaise,
      Value<int?> targetDateUtc,
      Value<int> colorValue,
      Value<int> rowid,
    });
typedef $$SavingsGoalsTableUpdateCompanionBuilder =
    SavingsGoalsCompanion Function({
      Value<String> id,
      Value<String> name,
      Value<int> targetAmountPaise,
      Value<int> savedAmountPaise,
      Value<int?> targetDateUtc,
      Value<int> colorValue,
      Value<int> rowid,
    });

class $$SavingsGoalsTableFilterComposer
    extends Composer<_$AppDatabase, $SavingsGoalsTable> {
  $$SavingsGoalsTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get name => $composableBuilder(
    column: $table.name,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get targetAmountPaise => $composableBuilder(
    column: $table.targetAmountPaise,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get savedAmountPaise => $composableBuilder(
    column: $table.savedAmountPaise,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get targetDateUtc => $composableBuilder(
    column: $table.targetDateUtc,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get colorValue => $composableBuilder(
    column: $table.colorValue,
    builder: (column) => ColumnFilters(column),
  );
}

class $$SavingsGoalsTableOrderingComposer
    extends Composer<_$AppDatabase, $SavingsGoalsTable> {
  $$SavingsGoalsTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get name => $composableBuilder(
    column: $table.name,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get targetAmountPaise => $composableBuilder(
    column: $table.targetAmountPaise,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get savedAmountPaise => $composableBuilder(
    column: $table.savedAmountPaise,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get targetDateUtc => $composableBuilder(
    column: $table.targetDateUtc,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get colorValue => $composableBuilder(
    column: $table.colorValue,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$SavingsGoalsTableAnnotationComposer
    extends Composer<_$AppDatabase, $SavingsGoalsTable> {
  $$SavingsGoalsTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get name =>
      $composableBuilder(column: $table.name, builder: (column) => column);

  GeneratedColumn<int> get targetAmountPaise => $composableBuilder(
    column: $table.targetAmountPaise,
    builder: (column) => column,
  );

  GeneratedColumn<int> get savedAmountPaise => $composableBuilder(
    column: $table.savedAmountPaise,
    builder: (column) => column,
  );

  GeneratedColumn<int> get targetDateUtc => $composableBuilder(
    column: $table.targetDateUtc,
    builder: (column) => column,
  );

  GeneratedColumn<int> get colorValue => $composableBuilder(
    column: $table.colorValue,
    builder: (column) => column,
  );
}

class $$SavingsGoalsTableTableManager
    extends
        RootTableManager<
          _$AppDatabase,
          $SavingsGoalsTable,
          SavingsGoalEntry,
          $$SavingsGoalsTableFilterComposer,
          $$SavingsGoalsTableOrderingComposer,
          $$SavingsGoalsTableAnnotationComposer,
          $$SavingsGoalsTableCreateCompanionBuilder,
          $$SavingsGoalsTableUpdateCompanionBuilder,
          (
            SavingsGoalEntry,
            BaseReferences<_$AppDatabase, $SavingsGoalsTable, SavingsGoalEntry>,
          ),
          SavingsGoalEntry,
          PrefetchHooks Function()
        > {
  $$SavingsGoalsTableTableManager(_$AppDatabase db, $SavingsGoalsTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$SavingsGoalsTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$SavingsGoalsTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$SavingsGoalsTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> id = const Value.absent(),
                Value<String> name = const Value.absent(),
                Value<int> targetAmountPaise = const Value.absent(),
                Value<int> savedAmountPaise = const Value.absent(),
                Value<int?> targetDateUtc = const Value.absent(),
                Value<int> colorValue = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => SavingsGoalsCompanion(
                id: id,
                name: name,
                targetAmountPaise: targetAmountPaise,
                savedAmountPaise: savedAmountPaise,
                targetDateUtc: targetDateUtc,
                colorValue: colorValue,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String id,
                required String name,
                required int targetAmountPaise,
                Value<int> savedAmountPaise = const Value.absent(),
                Value<int?> targetDateUtc = const Value.absent(),
                Value<int> colorValue = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => SavingsGoalsCompanion.insert(
                id: id,
                name: name,
                targetAmountPaise: targetAmountPaise,
                savedAmountPaise: savedAmountPaise,
                targetDateUtc: targetDateUtc,
                colorValue: colorValue,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ),
      );
}

typedef $$SavingsGoalsTableProcessedTableManager =
    ProcessedTableManager<
      _$AppDatabase,
      $SavingsGoalsTable,
      SavingsGoalEntry,
      $$SavingsGoalsTableFilterComposer,
      $$SavingsGoalsTableOrderingComposer,
      $$SavingsGoalsTableAnnotationComposer,
      $$SavingsGoalsTableCreateCompanionBuilder,
      $$SavingsGoalsTableUpdateCompanionBuilder,
      (
        SavingsGoalEntry,
        BaseReferences<_$AppDatabase, $SavingsGoalsTable, SavingsGoalEntry>,
      ),
      SavingsGoalEntry,
      PrefetchHooks Function()
    >;
typedef $$DebtsTableCreateCompanionBuilder =
    DebtsCompanion Function({
      required String id,
      required String name,
      required int amountPaise,
      Value<int> repaidAmountPaise,
      required bool isOwedToMe,
      Value<int?> dueDateUtc,
      Value<int> rowid,
    });
typedef $$DebtsTableUpdateCompanionBuilder =
    DebtsCompanion Function({
      Value<String> id,
      Value<String> name,
      Value<int> amountPaise,
      Value<int> repaidAmountPaise,
      Value<bool> isOwedToMe,
      Value<int?> dueDateUtc,
      Value<int> rowid,
    });

class $$DebtsTableFilterComposer extends Composer<_$AppDatabase, $DebtsTable> {
  $$DebtsTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get name => $composableBuilder(
    column: $table.name,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get amountPaise => $composableBuilder(
    column: $table.amountPaise,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get repaidAmountPaise => $composableBuilder(
    column: $table.repaidAmountPaise,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<bool> get isOwedToMe => $composableBuilder(
    column: $table.isOwedToMe,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get dueDateUtc => $composableBuilder(
    column: $table.dueDateUtc,
    builder: (column) => ColumnFilters(column),
  );
}

class $$DebtsTableOrderingComposer
    extends Composer<_$AppDatabase, $DebtsTable> {
  $$DebtsTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get name => $composableBuilder(
    column: $table.name,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get amountPaise => $composableBuilder(
    column: $table.amountPaise,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get repaidAmountPaise => $composableBuilder(
    column: $table.repaidAmountPaise,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<bool> get isOwedToMe => $composableBuilder(
    column: $table.isOwedToMe,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get dueDateUtc => $composableBuilder(
    column: $table.dueDateUtc,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$DebtsTableAnnotationComposer
    extends Composer<_$AppDatabase, $DebtsTable> {
  $$DebtsTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get name =>
      $composableBuilder(column: $table.name, builder: (column) => column);

  GeneratedColumn<int> get amountPaise => $composableBuilder(
    column: $table.amountPaise,
    builder: (column) => column,
  );

  GeneratedColumn<int> get repaidAmountPaise => $composableBuilder(
    column: $table.repaidAmountPaise,
    builder: (column) => column,
  );

  GeneratedColumn<bool> get isOwedToMe => $composableBuilder(
    column: $table.isOwedToMe,
    builder: (column) => column,
  );

  GeneratedColumn<int> get dueDateUtc => $composableBuilder(
    column: $table.dueDateUtc,
    builder: (column) => column,
  );
}

class $$DebtsTableTableManager
    extends
        RootTableManager<
          _$AppDatabase,
          $DebtsTable,
          DebtEntry,
          $$DebtsTableFilterComposer,
          $$DebtsTableOrderingComposer,
          $$DebtsTableAnnotationComposer,
          $$DebtsTableCreateCompanionBuilder,
          $$DebtsTableUpdateCompanionBuilder,
          (DebtEntry, BaseReferences<_$AppDatabase, $DebtsTable, DebtEntry>),
          DebtEntry,
          PrefetchHooks Function()
        > {
  $$DebtsTableTableManager(_$AppDatabase db, $DebtsTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$DebtsTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$DebtsTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$DebtsTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> id = const Value.absent(),
                Value<String> name = const Value.absent(),
                Value<int> amountPaise = const Value.absent(),
                Value<int> repaidAmountPaise = const Value.absent(),
                Value<bool> isOwedToMe = const Value.absent(),
                Value<int?> dueDateUtc = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => DebtsCompanion(
                id: id,
                name: name,
                amountPaise: amountPaise,
                repaidAmountPaise: repaidAmountPaise,
                isOwedToMe: isOwedToMe,
                dueDateUtc: dueDateUtc,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String id,
                required String name,
                required int amountPaise,
                Value<int> repaidAmountPaise = const Value.absent(),
                required bool isOwedToMe,
                Value<int?> dueDateUtc = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => DebtsCompanion.insert(
                id: id,
                name: name,
                amountPaise: amountPaise,
                repaidAmountPaise: repaidAmountPaise,
                isOwedToMe: isOwedToMe,
                dueDateUtc: dueDateUtc,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ),
      );
}

typedef $$DebtsTableProcessedTableManager =
    ProcessedTableManager<
      _$AppDatabase,
      $DebtsTable,
      DebtEntry,
      $$DebtsTableFilterComposer,
      $$DebtsTableOrderingComposer,
      $$DebtsTableAnnotationComposer,
      $$DebtsTableCreateCompanionBuilder,
      $$DebtsTableUpdateCompanionBuilder,
      (DebtEntry, BaseReferences<_$AppDatabase, $DebtsTable, DebtEntry>),
      DebtEntry,
      PrefetchHooks Function()
    >;
typedef $$RecurringTransactionsTableCreateCompanionBuilder =
    RecurringTransactionsCompanion Function({
      required String id,
      required String accountId,
      Value<String?> toAccountId,
      Value<String?> categoryId,
      required int amountPaise,
      required String type,
      Value<String?> note,
      required String recurrenceRule,
      required int nextOccurrenceUtc,
      Value<bool> isActive,
      Value<int> rowid,
    });
typedef $$RecurringTransactionsTableUpdateCompanionBuilder =
    RecurringTransactionsCompanion Function({
      Value<String> id,
      Value<String> accountId,
      Value<String?> toAccountId,
      Value<String?> categoryId,
      Value<int> amountPaise,
      Value<String> type,
      Value<String?> note,
      Value<String> recurrenceRule,
      Value<int> nextOccurrenceUtc,
      Value<bool> isActive,
      Value<int> rowid,
    });

final class $$RecurringTransactionsTableReferences
    extends
        BaseReferences<
          _$AppDatabase,
          $RecurringTransactionsTable,
          RecurringTransactionEntry
        > {
  $$RecurringTransactionsTableReferences(
    super.$_db,
    super.$_table,
    super.$_typedResult,
  );

  static $MoneyAccountsTable _accountIdTable(_$AppDatabase db) =>
      db.moneyAccounts.createAlias(
        $_aliasNameGenerator(
          db.recurringTransactions.accountId,
          db.moneyAccounts.id,
        ),
      );

  $$MoneyAccountsTableProcessedTableManager get accountId {
    final $_column = $_itemColumn<String>('account_id')!;

    final manager = $$MoneyAccountsTableTableManager(
      $_db,
      $_db.moneyAccounts,
    ).filter((f) => f.id.sqlEquals($_column));
    final item = $_typedResult.readTableOrNull(_accountIdTable($_db));
    if (item == null) return manager;
    return ProcessedTableManager(
      manager.$state.copyWith(prefetchedData: [item]),
    );
  }

  static $MoneyAccountsTable _toAccountIdTable(_$AppDatabase db) =>
      db.moneyAccounts.createAlias(
        $_aliasNameGenerator(
          db.recurringTransactions.toAccountId,
          db.moneyAccounts.id,
        ),
      );

  $$MoneyAccountsTableProcessedTableManager? get toAccountId {
    final $_column = $_itemColumn<String>('to_account_id');
    if ($_column == null) return null;
    final manager = $$MoneyAccountsTableTableManager(
      $_db,
      $_db.moneyAccounts,
    ).filter((f) => f.id.sqlEquals($_column));
    final item = $_typedResult.readTableOrNull(_toAccountIdTable($_db));
    if (item == null) return manager;
    return ProcessedTableManager(
      manager.$state.copyWith(prefetchedData: [item]),
    );
  }

  static $MoneyCategoriesTable _categoryIdTable(_$AppDatabase db) =>
      db.moneyCategories.createAlias(
        $_aliasNameGenerator(
          db.recurringTransactions.categoryId,
          db.moneyCategories.id,
        ),
      );

  $$MoneyCategoriesTableProcessedTableManager? get categoryId {
    final $_column = $_itemColumn<String>('category_id');
    if ($_column == null) return null;
    final manager = $$MoneyCategoriesTableTableManager(
      $_db,
      $_db.moneyCategories,
    ).filter((f) => f.id.sqlEquals($_column));
    final item = $_typedResult.readTableOrNull(_categoryIdTable($_db));
    if (item == null) return manager;
    return ProcessedTableManager(
      manager.$state.copyWith(prefetchedData: [item]),
    );
  }
}

class $$RecurringTransactionsTableFilterComposer
    extends Composer<_$AppDatabase, $RecurringTransactionsTable> {
  $$RecurringTransactionsTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get amountPaise => $composableBuilder(
    column: $table.amountPaise,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get type => $composableBuilder(
    column: $table.type,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get note => $composableBuilder(
    column: $table.note,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get recurrenceRule => $composableBuilder(
    column: $table.recurrenceRule,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get nextOccurrenceUtc => $composableBuilder(
    column: $table.nextOccurrenceUtc,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<bool> get isActive => $composableBuilder(
    column: $table.isActive,
    builder: (column) => ColumnFilters(column),
  );

  $$MoneyAccountsTableFilterComposer get accountId {
    final $$MoneyAccountsTableFilterComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.accountId,
      referencedTable: $db.moneyAccounts,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$MoneyAccountsTableFilterComposer(
            $db: $db,
            $table: $db.moneyAccounts,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }

  $$MoneyAccountsTableFilterComposer get toAccountId {
    final $$MoneyAccountsTableFilterComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.toAccountId,
      referencedTable: $db.moneyAccounts,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$MoneyAccountsTableFilterComposer(
            $db: $db,
            $table: $db.moneyAccounts,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }

  $$MoneyCategoriesTableFilterComposer get categoryId {
    final $$MoneyCategoriesTableFilterComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.categoryId,
      referencedTable: $db.moneyCategories,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$MoneyCategoriesTableFilterComposer(
            $db: $db,
            $table: $db.moneyCategories,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }
}

class $$RecurringTransactionsTableOrderingComposer
    extends Composer<_$AppDatabase, $RecurringTransactionsTable> {
  $$RecurringTransactionsTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get amountPaise => $composableBuilder(
    column: $table.amountPaise,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get type => $composableBuilder(
    column: $table.type,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get note => $composableBuilder(
    column: $table.note,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get recurrenceRule => $composableBuilder(
    column: $table.recurrenceRule,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get nextOccurrenceUtc => $composableBuilder(
    column: $table.nextOccurrenceUtc,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<bool> get isActive => $composableBuilder(
    column: $table.isActive,
    builder: (column) => ColumnOrderings(column),
  );

  $$MoneyAccountsTableOrderingComposer get accountId {
    final $$MoneyAccountsTableOrderingComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.accountId,
      referencedTable: $db.moneyAccounts,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$MoneyAccountsTableOrderingComposer(
            $db: $db,
            $table: $db.moneyAccounts,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }

  $$MoneyAccountsTableOrderingComposer get toAccountId {
    final $$MoneyAccountsTableOrderingComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.toAccountId,
      referencedTable: $db.moneyAccounts,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$MoneyAccountsTableOrderingComposer(
            $db: $db,
            $table: $db.moneyAccounts,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }

  $$MoneyCategoriesTableOrderingComposer get categoryId {
    final $$MoneyCategoriesTableOrderingComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.categoryId,
      referencedTable: $db.moneyCategories,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$MoneyCategoriesTableOrderingComposer(
            $db: $db,
            $table: $db.moneyCategories,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }
}

class $$RecurringTransactionsTableAnnotationComposer
    extends Composer<_$AppDatabase, $RecurringTransactionsTable> {
  $$RecurringTransactionsTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<int> get amountPaise => $composableBuilder(
    column: $table.amountPaise,
    builder: (column) => column,
  );

  GeneratedColumn<String> get type =>
      $composableBuilder(column: $table.type, builder: (column) => column);

  GeneratedColumn<String> get note =>
      $composableBuilder(column: $table.note, builder: (column) => column);

  GeneratedColumn<String> get recurrenceRule => $composableBuilder(
    column: $table.recurrenceRule,
    builder: (column) => column,
  );

  GeneratedColumn<int> get nextOccurrenceUtc => $composableBuilder(
    column: $table.nextOccurrenceUtc,
    builder: (column) => column,
  );

  GeneratedColumn<bool> get isActive =>
      $composableBuilder(column: $table.isActive, builder: (column) => column);

  $$MoneyAccountsTableAnnotationComposer get accountId {
    final $$MoneyAccountsTableAnnotationComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.accountId,
      referencedTable: $db.moneyAccounts,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$MoneyAccountsTableAnnotationComposer(
            $db: $db,
            $table: $db.moneyAccounts,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }

  $$MoneyAccountsTableAnnotationComposer get toAccountId {
    final $$MoneyAccountsTableAnnotationComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.toAccountId,
      referencedTable: $db.moneyAccounts,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$MoneyAccountsTableAnnotationComposer(
            $db: $db,
            $table: $db.moneyAccounts,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }

  $$MoneyCategoriesTableAnnotationComposer get categoryId {
    final $$MoneyCategoriesTableAnnotationComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.categoryId,
      referencedTable: $db.moneyCategories,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$MoneyCategoriesTableAnnotationComposer(
            $db: $db,
            $table: $db.moneyCategories,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }
}

class $$RecurringTransactionsTableTableManager
    extends
        RootTableManager<
          _$AppDatabase,
          $RecurringTransactionsTable,
          RecurringTransactionEntry,
          $$RecurringTransactionsTableFilterComposer,
          $$RecurringTransactionsTableOrderingComposer,
          $$RecurringTransactionsTableAnnotationComposer,
          $$RecurringTransactionsTableCreateCompanionBuilder,
          $$RecurringTransactionsTableUpdateCompanionBuilder,
          (RecurringTransactionEntry, $$RecurringTransactionsTableReferences),
          RecurringTransactionEntry,
          PrefetchHooks Function({
            bool accountId,
            bool toAccountId,
            bool categoryId,
          })
        > {
  $$RecurringTransactionsTableTableManager(
    _$AppDatabase db,
    $RecurringTransactionsTable table,
  ) : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$RecurringTransactionsTableFilterComposer(
                $db: db,
                $table: table,
              ),
          createOrderingComposer: () =>
              $$RecurringTransactionsTableOrderingComposer(
                $db: db,
                $table: table,
              ),
          createComputedFieldComposer: () =>
              $$RecurringTransactionsTableAnnotationComposer(
                $db: db,
                $table: table,
              ),
          updateCompanionCallback:
              ({
                Value<String> id = const Value.absent(),
                Value<String> accountId = const Value.absent(),
                Value<String?> toAccountId = const Value.absent(),
                Value<String?> categoryId = const Value.absent(),
                Value<int> amountPaise = const Value.absent(),
                Value<String> type = const Value.absent(),
                Value<String?> note = const Value.absent(),
                Value<String> recurrenceRule = const Value.absent(),
                Value<int> nextOccurrenceUtc = const Value.absent(),
                Value<bool> isActive = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => RecurringTransactionsCompanion(
                id: id,
                accountId: accountId,
                toAccountId: toAccountId,
                categoryId: categoryId,
                amountPaise: amountPaise,
                type: type,
                note: note,
                recurrenceRule: recurrenceRule,
                nextOccurrenceUtc: nextOccurrenceUtc,
                isActive: isActive,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String id,
                required String accountId,
                Value<String?> toAccountId = const Value.absent(),
                Value<String?> categoryId = const Value.absent(),
                required int amountPaise,
                required String type,
                Value<String?> note = const Value.absent(),
                required String recurrenceRule,
                required int nextOccurrenceUtc,
                Value<bool> isActive = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => RecurringTransactionsCompanion.insert(
                id: id,
                accountId: accountId,
                toAccountId: toAccountId,
                categoryId: categoryId,
                amountPaise: amountPaise,
                type: type,
                note: note,
                recurrenceRule: recurrenceRule,
                nextOccurrenceUtc: nextOccurrenceUtc,
                isActive: isActive,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map(
                (e) => (
                  e.readTable(table),
                  $$RecurringTransactionsTableReferences(db, table, e),
                ),
              )
              .toList(),
          prefetchHooksCallback:
              ({accountId = false, toAccountId = false, categoryId = false}) {
                return PrefetchHooks(
                  db: db,
                  explicitlyWatchedTables: [],
                  addJoins:
                      <
                        T extends TableManagerState<
                          dynamic,
                          dynamic,
                          dynamic,
                          dynamic,
                          dynamic,
                          dynamic,
                          dynamic,
                          dynamic,
                          dynamic,
                          dynamic,
                          dynamic
                        >
                      >(state) {
                        if (accountId) {
                          state =
                              state.withJoin(
                                    currentTable: table,
                                    currentColumn: table.accountId,
                                    referencedTable:
                                        $$RecurringTransactionsTableReferences
                                            ._accountIdTable(db),
                                    referencedColumn:
                                        $$RecurringTransactionsTableReferences
                                            ._accountIdTable(db)
                                            .id,
                                  )
                                  as T;
                        }
                        if (toAccountId) {
                          state =
                              state.withJoin(
                                    currentTable: table,
                                    currentColumn: table.toAccountId,
                                    referencedTable:
                                        $$RecurringTransactionsTableReferences
                                            ._toAccountIdTable(db),
                                    referencedColumn:
                                        $$RecurringTransactionsTableReferences
                                            ._toAccountIdTable(db)
                                            .id,
                                  )
                                  as T;
                        }
                        if (categoryId) {
                          state =
                              state.withJoin(
                                    currentTable: table,
                                    currentColumn: table.categoryId,
                                    referencedTable:
                                        $$RecurringTransactionsTableReferences
                                            ._categoryIdTable(db),
                                    referencedColumn:
                                        $$RecurringTransactionsTableReferences
                                            ._categoryIdTable(db)
                                            .id,
                                  )
                                  as T;
                        }

                        return state;
                      },
                  getPrefetchedDataCallback: (items) async {
                    return [];
                  },
                );
              },
        ),
      );
}

typedef $$RecurringTransactionsTableProcessedTableManager =
    ProcessedTableManager<
      _$AppDatabase,
      $RecurringTransactionsTable,
      RecurringTransactionEntry,
      $$RecurringTransactionsTableFilterComposer,
      $$RecurringTransactionsTableOrderingComposer,
      $$RecurringTransactionsTableAnnotationComposer,
      $$RecurringTransactionsTableCreateCompanionBuilder,
      $$RecurringTransactionsTableUpdateCompanionBuilder,
      (RecurringTransactionEntry, $$RecurringTransactionsTableReferences),
      RecurringTransactionEntry,
      PrefetchHooks Function({
        bool accountId,
        bool toAccountId,
        bool categoryId,
      })
    >;
typedef $$NoteLabelsTableCreateCompanionBuilder =
    NoteLabelsCompanion Function({
      required String id,
      required String name,
      required int createdAtUtc,
      Value<int> rowid,
    });
typedef $$NoteLabelsTableUpdateCompanionBuilder =
    NoteLabelsCompanion Function({
      Value<String> id,
      Value<String> name,
      Value<int> createdAtUtc,
      Value<int> rowid,
    });

final class $$NoteLabelsTableReferences
    extends BaseReferences<_$AppDatabase, $NoteLabelsTable, NoteLabelEntry> {
  $$NoteLabelsTableReferences(super.$_db, super.$_table, super.$_typedResult);

  static MultiTypedResultKey<
    $NoteLabelCrossRefTable,
    List<NoteLabelCrossRefEntry>
  >
  _noteLabelCrossRefRefsTable(_$AppDatabase db) =>
      MultiTypedResultKey.fromTable(
        db.noteLabelCrossRef,
        aliasName: $_aliasNameGenerator(
          db.noteLabels.id,
          db.noteLabelCrossRef.labelId,
        ),
      );

  $$NoteLabelCrossRefTableProcessedTableManager get noteLabelCrossRefRefs {
    final manager = $$NoteLabelCrossRefTableTableManager(
      $_db,
      $_db.noteLabelCrossRef,
    ).filter((f) => f.labelId.id.sqlEquals($_itemColumn<String>('id')!));

    final cache = $_typedResult.readTableOrNull(
      _noteLabelCrossRefRefsTable($_db),
    );
    return ProcessedTableManager(
      manager.$state.copyWith(prefetchedData: cache),
    );
  }
}

class $$NoteLabelsTableFilterComposer
    extends Composer<_$AppDatabase, $NoteLabelsTable> {
  $$NoteLabelsTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get name => $composableBuilder(
    column: $table.name,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get createdAtUtc => $composableBuilder(
    column: $table.createdAtUtc,
    builder: (column) => ColumnFilters(column),
  );

  Expression<bool> noteLabelCrossRefRefs(
    Expression<bool> Function($$NoteLabelCrossRefTableFilterComposer f) f,
  ) {
    final $$NoteLabelCrossRefTableFilterComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.id,
      referencedTable: $db.noteLabelCrossRef,
      getReferencedColumn: (t) => t.labelId,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$NoteLabelCrossRefTableFilterComposer(
            $db: $db,
            $table: $db.noteLabelCrossRef,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return f(composer);
  }
}

class $$NoteLabelsTableOrderingComposer
    extends Composer<_$AppDatabase, $NoteLabelsTable> {
  $$NoteLabelsTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get name => $composableBuilder(
    column: $table.name,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get createdAtUtc => $composableBuilder(
    column: $table.createdAtUtc,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$NoteLabelsTableAnnotationComposer
    extends Composer<_$AppDatabase, $NoteLabelsTable> {
  $$NoteLabelsTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get name =>
      $composableBuilder(column: $table.name, builder: (column) => column);

  GeneratedColumn<int> get createdAtUtc => $composableBuilder(
    column: $table.createdAtUtc,
    builder: (column) => column,
  );

  Expression<T> noteLabelCrossRefRefs<T extends Object>(
    Expression<T> Function($$NoteLabelCrossRefTableAnnotationComposer a) f,
  ) {
    final $$NoteLabelCrossRefTableAnnotationComposer composer =
        $composerBuilder(
          composer: this,
          getCurrentColumn: (t) => t.id,
          referencedTable: $db.noteLabelCrossRef,
          getReferencedColumn: (t) => t.labelId,
          builder:
              (
                joinBuilder, {
                $addJoinBuilderToRootComposer,
                $removeJoinBuilderFromRootComposer,
              }) => $$NoteLabelCrossRefTableAnnotationComposer(
                $db: $db,
                $table: $db.noteLabelCrossRef,
                $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
                joinBuilder: joinBuilder,
                $removeJoinBuilderFromRootComposer:
                    $removeJoinBuilderFromRootComposer,
              ),
        );
    return f(composer);
  }
}

class $$NoteLabelsTableTableManager
    extends
        RootTableManager<
          _$AppDatabase,
          $NoteLabelsTable,
          NoteLabelEntry,
          $$NoteLabelsTableFilterComposer,
          $$NoteLabelsTableOrderingComposer,
          $$NoteLabelsTableAnnotationComposer,
          $$NoteLabelsTableCreateCompanionBuilder,
          $$NoteLabelsTableUpdateCompanionBuilder,
          (NoteLabelEntry, $$NoteLabelsTableReferences),
          NoteLabelEntry,
          PrefetchHooks Function({bool noteLabelCrossRefRefs})
        > {
  $$NoteLabelsTableTableManager(_$AppDatabase db, $NoteLabelsTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$NoteLabelsTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$NoteLabelsTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$NoteLabelsTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> id = const Value.absent(),
                Value<String> name = const Value.absent(),
                Value<int> createdAtUtc = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => NoteLabelsCompanion(
                id: id,
                name: name,
                createdAtUtc: createdAtUtc,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String id,
                required String name,
                required int createdAtUtc,
                Value<int> rowid = const Value.absent(),
              }) => NoteLabelsCompanion.insert(
                id: id,
                name: name,
                createdAtUtc: createdAtUtc,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map(
                (e) => (
                  e.readTable(table),
                  $$NoteLabelsTableReferences(db, table, e),
                ),
              )
              .toList(),
          prefetchHooksCallback: ({noteLabelCrossRefRefs = false}) {
            return PrefetchHooks(
              db: db,
              explicitlyWatchedTables: [
                if (noteLabelCrossRefRefs) db.noteLabelCrossRef,
              ],
              addJoins: null,
              getPrefetchedDataCallback: (items) async {
                return [
                  if (noteLabelCrossRefRefs)
                    await $_getPrefetchedData<
                      NoteLabelEntry,
                      $NoteLabelsTable,
                      NoteLabelCrossRefEntry
                    >(
                      currentTable: table,
                      referencedTable: $$NoteLabelsTableReferences
                          ._noteLabelCrossRefRefsTable(db),
                      managerFromTypedResult: (p0) =>
                          $$NoteLabelsTableReferences(
                            db,
                            table,
                            p0,
                          ).noteLabelCrossRefRefs,
                      referencedItemsForCurrentItem: (item, referencedItems) =>
                          referencedItems.where((e) => e.labelId == item.id),
                      typedResults: items,
                    ),
                ];
              },
            );
          },
        ),
      );
}

typedef $$NoteLabelsTableProcessedTableManager =
    ProcessedTableManager<
      _$AppDatabase,
      $NoteLabelsTable,
      NoteLabelEntry,
      $$NoteLabelsTableFilterComposer,
      $$NoteLabelsTableOrderingComposer,
      $$NoteLabelsTableAnnotationComposer,
      $$NoteLabelsTableCreateCompanionBuilder,
      $$NoteLabelsTableUpdateCompanionBuilder,
      (NoteLabelEntry, $$NoteLabelsTableReferences),
      NoteLabelEntry,
      PrefetchHooks Function({bool noteLabelCrossRefRefs})
    >;
typedef $$NoteItemsTableCreateCompanionBuilder =
    NoteItemsCompanion Function({
      required String id,
      Value<String?> title,
      Value<String?> content,
      Value<String> type,
      Value<int?> colorValue,
      Value<bool> isPinned,
      Value<bool> isArchived,
      Value<bool> isDeleted,
      required int createdAtUtc,
      required int updatedAtUtc,
      Value<int> rowid,
    });
typedef $$NoteItemsTableUpdateCompanionBuilder =
    NoteItemsCompanion Function({
      Value<String> id,
      Value<String?> title,
      Value<String?> content,
      Value<String> type,
      Value<int?> colorValue,
      Value<bool> isPinned,
      Value<bool> isArchived,
      Value<bool> isDeleted,
      Value<int> createdAtUtc,
      Value<int> updatedAtUtc,
      Value<int> rowid,
    });

final class $$NoteItemsTableReferences
    extends BaseReferences<_$AppDatabase, $NoteItemsTable, NoteItemEntry> {
  $$NoteItemsTableReferences(super.$_db, super.$_table, super.$_typedResult);

  static MultiTypedResultKey<
    $NoteLabelCrossRefTable,
    List<NoteLabelCrossRefEntry>
  >
  _noteLabelCrossRefRefsTable(_$AppDatabase db) =>
      MultiTypedResultKey.fromTable(
        db.noteLabelCrossRef,
        aliasName: $_aliasNameGenerator(
          db.noteItems.id,
          db.noteLabelCrossRef.noteId,
        ),
      );

  $$NoteLabelCrossRefTableProcessedTableManager get noteLabelCrossRefRefs {
    final manager = $$NoteLabelCrossRefTableTableManager(
      $_db,
      $_db.noteLabelCrossRef,
    ).filter((f) => f.noteId.id.sqlEquals($_itemColumn<String>('id')!));

    final cache = $_typedResult.readTableOrNull(
      _noteLabelCrossRefRefsTable($_db),
    );
    return ProcessedTableManager(
      manager.$state.copyWith(prefetchedData: cache),
    );
  }

  static MultiTypedResultKey<$ChecklistItemsTable, List<ChecklistItemEntry>>
  _checklistItemsRefsTable(_$AppDatabase db) => MultiTypedResultKey.fromTable(
    db.checklistItems,
    aliasName: $_aliasNameGenerator(db.noteItems.id, db.checklistItems.noteId),
  );

  $$ChecklistItemsTableProcessedTableManager get checklistItemsRefs {
    final manager = $$ChecklistItemsTableTableManager(
      $_db,
      $_db.checklistItems,
    ).filter((f) => f.noteId.id.sqlEquals($_itemColumn<String>('id')!));

    final cache = $_typedResult.readTableOrNull(_checklistItemsRefsTable($_db));
    return ProcessedTableManager(
      manager.$state.copyWith(prefetchedData: cache),
    );
  }
}

class $$NoteItemsTableFilterComposer
    extends Composer<_$AppDatabase, $NoteItemsTable> {
  $$NoteItemsTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get title => $composableBuilder(
    column: $table.title,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get content => $composableBuilder(
    column: $table.content,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get type => $composableBuilder(
    column: $table.type,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get colorValue => $composableBuilder(
    column: $table.colorValue,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<bool> get isPinned => $composableBuilder(
    column: $table.isPinned,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<bool> get isArchived => $composableBuilder(
    column: $table.isArchived,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<bool> get isDeleted => $composableBuilder(
    column: $table.isDeleted,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get createdAtUtc => $composableBuilder(
    column: $table.createdAtUtc,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get updatedAtUtc => $composableBuilder(
    column: $table.updatedAtUtc,
    builder: (column) => ColumnFilters(column),
  );

  Expression<bool> noteLabelCrossRefRefs(
    Expression<bool> Function($$NoteLabelCrossRefTableFilterComposer f) f,
  ) {
    final $$NoteLabelCrossRefTableFilterComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.id,
      referencedTable: $db.noteLabelCrossRef,
      getReferencedColumn: (t) => t.noteId,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$NoteLabelCrossRefTableFilterComposer(
            $db: $db,
            $table: $db.noteLabelCrossRef,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return f(composer);
  }

  Expression<bool> checklistItemsRefs(
    Expression<bool> Function($$ChecklistItemsTableFilterComposer f) f,
  ) {
    final $$ChecklistItemsTableFilterComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.id,
      referencedTable: $db.checklistItems,
      getReferencedColumn: (t) => t.noteId,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$ChecklistItemsTableFilterComposer(
            $db: $db,
            $table: $db.checklistItems,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return f(composer);
  }
}

class $$NoteItemsTableOrderingComposer
    extends Composer<_$AppDatabase, $NoteItemsTable> {
  $$NoteItemsTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get title => $composableBuilder(
    column: $table.title,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get content => $composableBuilder(
    column: $table.content,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get type => $composableBuilder(
    column: $table.type,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get colorValue => $composableBuilder(
    column: $table.colorValue,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<bool> get isPinned => $composableBuilder(
    column: $table.isPinned,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<bool> get isArchived => $composableBuilder(
    column: $table.isArchived,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<bool> get isDeleted => $composableBuilder(
    column: $table.isDeleted,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get createdAtUtc => $composableBuilder(
    column: $table.createdAtUtc,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get updatedAtUtc => $composableBuilder(
    column: $table.updatedAtUtc,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$NoteItemsTableAnnotationComposer
    extends Composer<_$AppDatabase, $NoteItemsTable> {
  $$NoteItemsTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get title =>
      $composableBuilder(column: $table.title, builder: (column) => column);

  GeneratedColumn<String> get content =>
      $composableBuilder(column: $table.content, builder: (column) => column);

  GeneratedColumn<String> get type =>
      $composableBuilder(column: $table.type, builder: (column) => column);

  GeneratedColumn<int> get colorValue => $composableBuilder(
    column: $table.colorValue,
    builder: (column) => column,
  );

  GeneratedColumn<bool> get isPinned =>
      $composableBuilder(column: $table.isPinned, builder: (column) => column);

  GeneratedColumn<bool> get isArchived => $composableBuilder(
    column: $table.isArchived,
    builder: (column) => column,
  );

  GeneratedColumn<bool> get isDeleted =>
      $composableBuilder(column: $table.isDeleted, builder: (column) => column);

  GeneratedColumn<int> get createdAtUtc => $composableBuilder(
    column: $table.createdAtUtc,
    builder: (column) => column,
  );

  GeneratedColumn<int> get updatedAtUtc => $composableBuilder(
    column: $table.updatedAtUtc,
    builder: (column) => column,
  );

  Expression<T> noteLabelCrossRefRefs<T extends Object>(
    Expression<T> Function($$NoteLabelCrossRefTableAnnotationComposer a) f,
  ) {
    final $$NoteLabelCrossRefTableAnnotationComposer composer =
        $composerBuilder(
          composer: this,
          getCurrentColumn: (t) => t.id,
          referencedTable: $db.noteLabelCrossRef,
          getReferencedColumn: (t) => t.noteId,
          builder:
              (
                joinBuilder, {
                $addJoinBuilderToRootComposer,
                $removeJoinBuilderFromRootComposer,
              }) => $$NoteLabelCrossRefTableAnnotationComposer(
                $db: $db,
                $table: $db.noteLabelCrossRef,
                $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
                joinBuilder: joinBuilder,
                $removeJoinBuilderFromRootComposer:
                    $removeJoinBuilderFromRootComposer,
              ),
        );
    return f(composer);
  }

  Expression<T> checklistItemsRefs<T extends Object>(
    Expression<T> Function($$ChecklistItemsTableAnnotationComposer a) f,
  ) {
    final $$ChecklistItemsTableAnnotationComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.id,
      referencedTable: $db.checklistItems,
      getReferencedColumn: (t) => t.noteId,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$ChecklistItemsTableAnnotationComposer(
            $db: $db,
            $table: $db.checklistItems,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return f(composer);
  }
}

class $$NoteItemsTableTableManager
    extends
        RootTableManager<
          _$AppDatabase,
          $NoteItemsTable,
          NoteItemEntry,
          $$NoteItemsTableFilterComposer,
          $$NoteItemsTableOrderingComposer,
          $$NoteItemsTableAnnotationComposer,
          $$NoteItemsTableCreateCompanionBuilder,
          $$NoteItemsTableUpdateCompanionBuilder,
          (NoteItemEntry, $$NoteItemsTableReferences),
          NoteItemEntry,
          PrefetchHooks Function({
            bool noteLabelCrossRefRefs,
            bool checklistItemsRefs,
          })
        > {
  $$NoteItemsTableTableManager(_$AppDatabase db, $NoteItemsTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$NoteItemsTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$NoteItemsTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$NoteItemsTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> id = const Value.absent(),
                Value<String?> title = const Value.absent(),
                Value<String?> content = const Value.absent(),
                Value<String> type = const Value.absent(),
                Value<int?> colorValue = const Value.absent(),
                Value<bool> isPinned = const Value.absent(),
                Value<bool> isArchived = const Value.absent(),
                Value<bool> isDeleted = const Value.absent(),
                Value<int> createdAtUtc = const Value.absent(),
                Value<int> updatedAtUtc = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => NoteItemsCompanion(
                id: id,
                title: title,
                content: content,
                type: type,
                colorValue: colorValue,
                isPinned: isPinned,
                isArchived: isArchived,
                isDeleted: isDeleted,
                createdAtUtc: createdAtUtc,
                updatedAtUtc: updatedAtUtc,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String id,
                Value<String?> title = const Value.absent(),
                Value<String?> content = const Value.absent(),
                Value<String> type = const Value.absent(),
                Value<int?> colorValue = const Value.absent(),
                Value<bool> isPinned = const Value.absent(),
                Value<bool> isArchived = const Value.absent(),
                Value<bool> isDeleted = const Value.absent(),
                required int createdAtUtc,
                required int updatedAtUtc,
                Value<int> rowid = const Value.absent(),
              }) => NoteItemsCompanion.insert(
                id: id,
                title: title,
                content: content,
                type: type,
                colorValue: colorValue,
                isPinned: isPinned,
                isArchived: isArchived,
                isDeleted: isDeleted,
                createdAtUtc: createdAtUtc,
                updatedAtUtc: updatedAtUtc,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map(
                (e) => (
                  e.readTable(table),
                  $$NoteItemsTableReferences(db, table, e),
                ),
              )
              .toList(),
          prefetchHooksCallback:
              ({noteLabelCrossRefRefs = false, checklistItemsRefs = false}) {
                return PrefetchHooks(
                  db: db,
                  explicitlyWatchedTables: [
                    if (noteLabelCrossRefRefs) db.noteLabelCrossRef,
                    if (checklistItemsRefs) db.checklistItems,
                  ],
                  addJoins: null,
                  getPrefetchedDataCallback: (items) async {
                    return [
                      if (noteLabelCrossRefRefs)
                        await $_getPrefetchedData<
                          NoteItemEntry,
                          $NoteItemsTable,
                          NoteLabelCrossRefEntry
                        >(
                          currentTable: table,
                          referencedTable: $$NoteItemsTableReferences
                              ._noteLabelCrossRefRefsTable(db),
                          managerFromTypedResult: (p0) =>
                              $$NoteItemsTableReferences(
                                db,
                                table,
                                p0,
                              ).noteLabelCrossRefRefs,
                          referencedItemsForCurrentItem:
                              (item, referencedItems) => referencedItems.where(
                                (e) => e.noteId == item.id,
                              ),
                          typedResults: items,
                        ),
                      if (checklistItemsRefs)
                        await $_getPrefetchedData<
                          NoteItemEntry,
                          $NoteItemsTable,
                          ChecklistItemEntry
                        >(
                          currentTable: table,
                          referencedTable: $$NoteItemsTableReferences
                              ._checklistItemsRefsTable(db),
                          managerFromTypedResult: (p0) =>
                              $$NoteItemsTableReferences(
                                db,
                                table,
                                p0,
                              ).checklistItemsRefs,
                          referencedItemsForCurrentItem:
                              (item, referencedItems) => referencedItems.where(
                                (e) => e.noteId == item.id,
                              ),
                          typedResults: items,
                        ),
                    ];
                  },
                );
              },
        ),
      );
}

typedef $$NoteItemsTableProcessedTableManager =
    ProcessedTableManager<
      _$AppDatabase,
      $NoteItemsTable,
      NoteItemEntry,
      $$NoteItemsTableFilterComposer,
      $$NoteItemsTableOrderingComposer,
      $$NoteItemsTableAnnotationComposer,
      $$NoteItemsTableCreateCompanionBuilder,
      $$NoteItemsTableUpdateCompanionBuilder,
      (NoteItemEntry, $$NoteItemsTableReferences),
      NoteItemEntry,
      PrefetchHooks Function({
        bool noteLabelCrossRefRefs,
        bool checklistItemsRefs,
      })
    >;
typedef $$NoteLabelCrossRefTableCreateCompanionBuilder =
    NoteLabelCrossRefCompanion Function({
      required String noteId,
      required String labelId,
      Value<int> rowid,
    });
typedef $$NoteLabelCrossRefTableUpdateCompanionBuilder =
    NoteLabelCrossRefCompanion Function({
      Value<String> noteId,
      Value<String> labelId,
      Value<int> rowid,
    });

final class $$NoteLabelCrossRefTableReferences
    extends
        BaseReferences<
          _$AppDatabase,
          $NoteLabelCrossRefTable,
          NoteLabelCrossRefEntry
        > {
  $$NoteLabelCrossRefTableReferences(
    super.$_db,
    super.$_table,
    super.$_typedResult,
  );

  static $NoteItemsTable _noteIdTable(_$AppDatabase db) =>
      db.noteItems.createAlias(
        $_aliasNameGenerator(db.noteLabelCrossRef.noteId, db.noteItems.id),
      );

  $$NoteItemsTableProcessedTableManager get noteId {
    final $_column = $_itemColumn<String>('note_id')!;

    final manager = $$NoteItemsTableTableManager(
      $_db,
      $_db.noteItems,
    ).filter((f) => f.id.sqlEquals($_column));
    final item = $_typedResult.readTableOrNull(_noteIdTable($_db));
    if (item == null) return manager;
    return ProcessedTableManager(
      manager.$state.copyWith(prefetchedData: [item]),
    );
  }

  static $NoteLabelsTable _labelIdTable(_$AppDatabase db) =>
      db.noteLabels.createAlias(
        $_aliasNameGenerator(db.noteLabelCrossRef.labelId, db.noteLabels.id),
      );

  $$NoteLabelsTableProcessedTableManager get labelId {
    final $_column = $_itemColumn<String>('label_id')!;

    final manager = $$NoteLabelsTableTableManager(
      $_db,
      $_db.noteLabels,
    ).filter((f) => f.id.sqlEquals($_column));
    final item = $_typedResult.readTableOrNull(_labelIdTable($_db));
    if (item == null) return manager;
    return ProcessedTableManager(
      manager.$state.copyWith(prefetchedData: [item]),
    );
  }
}

class $$NoteLabelCrossRefTableFilterComposer
    extends Composer<_$AppDatabase, $NoteLabelCrossRefTable> {
  $$NoteLabelCrossRefTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  $$NoteItemsTableFilterComposer get noteId {
    final $$NoteItemsTableFilterComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.noteId,
      referencedTable: $db.noteItems,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$NoteItemsTableFilterComposer(
            $db: $db,
            $table: $db.noteItems,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }

  $$NoteLabelsTableFilterComposer get labelId {
    final $$NoteLabelsTableFilterComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.labelId,
      referencedTable: $db.noteLabels,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$NoteLabelsTableFilterComposer(
            $db: $db,
            $table: $db.noteLabels,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }
}

class $$NoteLabelCrossRefTableOrderingComposer
    extends Composer<_$AppDatabase, $NoteLabelCrossRefTable> {
  $$NoteLabelCrossRefTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  $$NoteItemsTableOrderingComposer get noteId {
    final $$NoteItemsTableOrderingComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.noteId,
      referencedTable: $db.noteItems,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$NoteItemsTableOrderingComposer(
            $db: $db,
            $table: $db.noteItems,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }

  $$NoteLabelsTableOrderingComposer get labelId {
    final $$NoteLabelsTableOrderingComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.labelId,
      referencedTable: $db.noteLabels,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$NoteLabelsTableOrderingComposer(
            $db: $db,
            $table: $db.noteLabels,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }
}

class $$NoteLabelCrossRefTableAnnotationComposer
    extends Composer<_$AppDatabase, $NoteLabelCrossRefTable> {
  $$NoteLabelCrossRefTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  $$NoteItemsTableAnnotationComposer get noteId {
    final $$NoteItemsTableAnnotationComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.noteId,
      referencedTable: $db.noteItems,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$NoteItemsTableAnnotationComposer(
            $db: $db,
            $table: $db.noteItems,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }

  $$NoteLabelsTableAnnotationComposer get labelId {
    final $$NoteLabelsTableAnnotationComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.labelId,
      referencedTable: $db.noteLabels,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$NoteLabelsTableAnnotationComposer(
            $db: $db,
            $table: $db.noteLabels,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }
}

class $$NoteLabelCrossRefTableTableManager
    extends
        RootTableManager<
          _$AppDatabase,
          $NoteLabelCrossRefTable,
          NoteLabelCrossRefEntry,
          $$NoteLabelCrossRefTableFilterComposer,
          $$NoteLabelCrossRefTableOrderingComposer,
          $$NoteLabelCrossRefTableAnnotationComposer,
          $$NoteLabelCrossRefTableCreateCompanionBuilder,
          $$NoteLabelCrossRefTableUpdateCompanionBuilder,
          (NoteLabelCrossRefEntry, $$NoteLabelCrossRefTableReferences),
          NoteLabelCrossRefEntry,
          PrefetchHooks Function({bool noteId, bool labelId})
        > {
  $$NoteLabelCrossRefTableTableManager(
    _$AppDatabase db,
    $NoteLabelCrossRefTable table,
  ) : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$NoteLabelCrossRefTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$NoteLabelCrossRefTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$NoteLabelCrossRefTableAnnotationComposer(
                $db: db,
                $table: table,
              ),
          updateCompanionCallback:
              ({
                Value<String> noteId = const Value.absent(),
                Value<String> labelId = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => NoteLabelCrossRefCompanion(
                noteId: noteId,
                labelId: labelId,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String noteId,
                required String labelId,
                Value<int> rowid = const Value.absent(),
              }) => NoteLabelCrossRefCompanion.insert(
                noteId: noteId,
                labelId: labelId,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map(
                (e) => (
                  e.readTable(table),
                  $$NoteLabelCrossRefTableReferences(db, table, e),
                ),
              )
              .toList(),
          prefetchHooksCallback: ({noteId = false, labelId = false}) {
            return PrefetchHooks(
              db: db,
              explicitlyWatchedTables: [],
              addJoins:
                  <
                    T extends TableManagerState<
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic
                    >
                  >(state) {
                    if (noteId) {
                      state =
                          state.withJoin(
                                currentTable: table,
                                currentColumn: table.noteId,
                                referencedTable:
                                    $$NoteLabelCrossRefTableReferences
                                        ._noteIdTable(db),
                                referencedColumn:
                                    $$NoteLabelCrossRefTableReferences
                                        ._noteIdTable(db)
                                        .id,
                              )
                              as T;
                    }
                    if (labelId) {
                      state =
                          state.withJoin(
                                currentTable: table,
                                currentColumn: table.labelId,
                                referencedTable:
                                    $$NoteLabelCrossRefTableReferences
                                        ._labelIdTable(db),
                                referencedColumn:
                                    $$NoteLabelCrossRefTableReferences
                                        ._labelIdTable(db)
                                        .id,
                              )
                              as T;
                    }

                    return state;
                  },
              getPrefetchedDataCallback: (items) async {
                return [];
              },
            );
          },
        ),
      );
}

typedef $$NoteLabelCrossRefTableProcessedTableManager =
    ProcessedTableManager<
      _$AppDatabase,
      $NoteLabelCrossRefTable,
      NoteLabelCrossRefEntry,
      $$NoteLabelCrossRefTableFilterComposer,
      $$NoteLabelCrossRefTableOrderingComposer,
      $$NoteLabelCrossRefTableAnnotationComposer,
      $$NoteLabelCrossRefTableCreateCompanionBuilder,
      $$NoteLabelCrossRefTableUpdateCompanionBuilder,
      (NoteLabelCrossRefEntry, $$NoteLabelCrossRefTableReferences),
      NoteLabelCrossRefEntry,
      PrefetchHooks Function({bool noteId, bool labelId})
    >;
typedef $$ChecklistItemsTableCreateCompanionBuilder =
    ChecklistItemsCompanion Function({
      required String id,
      required String noteId,
      required String itemText,
      Value<bool> isChecked,
      Value<int> sortOrder,
      Value<int> rowid,
    });
typedef $$ChecklistItemsTableUpdateCompanionBuilder =
    ChecklistItemsCompanion Function({
      Value<String> id,
      Value<String> noteId,
      Value<String> itemText,
      Value<bool> isChecked,
      Value<int> sortOrder,
      Value<int> rowid,
    });

final class $$ChecklistItemsTableReferences
    extends
        BaseReferences<
          _$AppDatabase,
          $ChecklistItemsTable,
          ChecklistItemEntry
        > {
  $$ChecklistItemsTableReferences(
    super.$_db,
    super.$_table,
    super.$_typedResult,
  );

  static $NoteItemsTable _noteIdTable(_$AppDatabase db) =>
      db.noteItems.createAlias(
        $_aliasNameGenerator(db.checklistItems.noteId, db.noteItems.id),
      );

  $$NoteItemsTableProcessedTableManager get noteId {
    final $_column = $_itemColumn<String>('note_id')!;

    final manager = $$NoteItemsTableTableManager(
      $_db,
      $_db.noteItems,
    ).filter((f) => f.id.sqlEquals($_column));
    final item = $_typedResult.readTableOrNull(_noteIdTable($_db));
    if (item == null) return manager;
    return ProcessedTableManager(
      manager.$state.copyWith(prefetchedData: [item]),
    );
  }
}

class $$ChecklistItemsTableFilterComposer
    extends Composer<_$AppDatabase, $ChecklistItemsTable> {
  $$ChecklistItemsTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get itemText => $composableBuilder(
    column: $table.itemText,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<bool> get isChecked => $composableBuilder(
    column: $table.isChecked,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get sortOrder => $composableBuilder(
    column: $table.sortOrder,
    builder: (column) => ColumnFilters(column),
  );

  $$NoteItemsTableFilterComposer get noteId {
    final $$NoteItemsTableFilterComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.noteId,
      referencedTable: $db.noteItems,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$NoteItemsTableFilterComposer(
            $db: $db,
            $table: $db.noteItems,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }
}

class $$ChecklistItemsTableOrderingComposer
    extends Composer<_$AppDatabase, $ChecklistItemsTable> {
  $$ChecklistItemsTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get itemText => $composableBuilder(
    column: $table.itemText,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<bool> get isChecked => $composableBuilder(
    column: $table.isChecked,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get sortOrder => $composableBuilder(
    column: $table.sortOrder,
    builder: (column) => ColumnOrderings(column),
  );

  $$NoteItemsTableOrderingComposer get noteId {
    final $$NoteItemsTableOrderingComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.noteId,
      referencedTable: $db.noteItems,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$NoteItemsTableOrderingComposer(
            $db: $db,
            $table: $db.noteItems,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }
}

class $$ChecklistItemsTableAnnotationComposer
    extends Composer<_$AppDatabase, $ChecklistItemsTable> {
  $$ChecklistItemsTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get itemText =>
      $composableBuilder(column: $table.itemText, builder: (column) => column);

  GeneratedColumn<bool> get isChecked =>
      $composableBuilder(column: $table.isChecked, builder: (column) => column);

  GeneratedColumn<int> get sortOrder =>
      $composableBuilder(column: $table.sortOrder, builder: (column) => column);

  $$NoteItemsTableAnnotationComposer get noteId {
    final $$NoteItemsTableAnnotationComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.noteId,
      referencedTable: $db.noteItems,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$NoteItemsTableAnnotationComposer(
            $db: $db,
            $table: $db.noteItems,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }
}

class $$ChecklistItemsTableTableManager
    extends
        RootTableManager<
          _$AppDatabase,
          $ChecklistItemsTable,
          ChecklistItemEntry,
          $$ChecklistItemsTableFilterComposer,
          $$ChecklistItemsTableOrderingComposer,
          $$ChecklistItemsTableAnnotationComposer,
          $$ChecklistItemsTableCreateCompanionBuilder,
          $$ChecklistItemsTableUpdateCompanionBuilder,
          (ChecklistItemEntry, $$ChecklistItemsTableReferences),
          ChecklistItemEntry,
          PrefetchHooks Function({bool noteId})
        > {
  $$ChecklistItemsTableTableManager(
    _$AppDatabase db,
    $ChecklistItemsTable table,
  ) : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$ChecklistItemsTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$ChecklistItemsTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$ChecklistItemsTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> id = const Value.absent(),
                Value<String> noteId = const Value.absent(),
                Value<String> itemText = const Value.absent(),
                Value<bool> isChecked = const Value.absent(),
                Value<int> sortOrder = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => ChecklistItemsCompanion(
                id: id,
                noteId: noteId,
                itemText: itemText,
                isChecked: isChecked,
                sortOrder: sortOrder,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String id,
                required String noteId,
                required String itemText,
                Value<bool> isChecked = const Value.absent(),
                Value<int> sortOrder = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => ChecklistItemsCompanion.insert(
                id: id,
                noteId: noteId,
                itemText: itemText,
                isChecked: isChecked,
                sortOrder: sortOrder,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map(
                (e) => (
                  e.readTable(table),
                  $$ChecklistItemsTableReferences(db, table, e),
                ),
              )
              .toList(),
          prefetchHooksCallback: ({noteId = false}) {
            return PrefetchHooks(
              db: db,
              explicitlyWatchedTables: [],
              addJoins:
                  <
                    T extends TableManagerState<
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic
                    >
                  >(state) {
                    if (noteId) {
                      state =
                          state.withJoin(
                                currentTable: table,
                                currentColumn: table.noteId,
                                referencedTable: $$ChecklistItemsTableReferences
                                    ._noteIdTable(db),
                                referencedColumn:
                                    $$ChecklistItemsTableReferences
                                        ._noteIdTable(db)
                                        .id,
                              )
                              as T;
                    }

                    return state;
                  },
              getPrefetchedDataCallback: (items) async {
                return [];
              },
            );
          },
        ),
      );
}

typedef $$ChecklistItemsTableProcessedTableManager =
    ProcessedTableManager<
      _$AppDatabase,
      $ChecklistItemsTable,
      ChecklistItemEntry,
      $$ChecklistItemsTableFilterComposer,
      $$ChecklistItemsTableOrderingComposer,
      $$ChecklistItemsTableAnnotationComposer,
      $$ChecklistItemsTableCreateCompanionBuilder,
      $$ChecklistItemsTableUpdateCompanionBuilder,
      (ChecklistItemEntry, $$ChecklistItemsTableReferences),
      ChecklistItemEntry,
      PrefetchHooks Function({bool noteId})
    >;
typedef $$UsageSessionsTableCreateCompanionBuilder =
    UsageSessionsCompanion Function({
      required String id,
      required String packageName,
      required String appName,
      required int startTimeUtc,
      required int endTimeUtc,
      required int durationSeconds,
      required int createdAtUtc,
      Value<int> rowid,
    });
typedef $$UsageSessionsTableUpdateCompanionBuilder =
    UsageSessionsCompanion Function({
      Value<String> id,
      Value<String> packageName,
      Value<String> appName,
      Value<int> startTimeUtc,
      Value<int> endTimeUtc,
      Value<int> durationSeconds,
      Value<int> createdAtUtc,
      Value<int> rowid,
    });

class $$UsageSessionsTableFilterComposer
    extends Composer<_$AppDatabase, $UsageSessionsTable> {
  $$UsageSessionsTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get packageName => $composableBuilder(
    column: $table.packageName,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get appName => $composableBuilder(
    column: $table.appName,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get startTimeUtc => $composableBuilder(
    column: $table.startTimeUtc,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get endTimeUtc => $composableBuilder(
    column: $table.endTimeUtc,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get durationSeconds => $composableBuilder(
    column: $table.durationSeconds,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get createdAtUtc => $composableBuilder(
    column: $table.createdAtUtc,
    builder: (column) => ColumnFilters(column),
  );
}

class $$UsageSessionsTableOrderingComposer
    extends Composer<_$AppDatabase, $UsageSessionsTable> {
  $$UsageSessionsTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get packageName => $composableBuilder(
    column: $table.packageName,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get appName => $composableBuilder(
    column: $table.appName,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get startTimeUtc => $composableBuilder(
    column: $table.startTimeUtc,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get endTimeUtc => $composableBuilder(
    column: $table.endTimeUtc,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get durationSeconds => $composableBuilder(
    column: $table.durationSeconds,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get createdAtUtc => $composableBuilder(
    column: $table.createdAtUtc,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$UsageSessionsTableAnnotationComposer
    extends Composer<_$AppDatabase, $UsageSessionsTable> {
  $$UsageSessionsTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get packageName => $composableBuilder(
    column: $table.packageName,
    builder: (column) => column,
  );

  GeneratedColumn<String> get appName =>
      $composableBuilder(column: $table.appName, builder: (column) => column);

  GeneratedColumn<int> get startTimeUtc => $composableBuilder(
    column: $table.startTimeUtc,
    builder: (column) => column,
  );

  GeneratedColumn<int> get endTimeUtc => $composableBuilder(
    column: $table.endTimeUtc,
    builder: (column) => column,
  );

  GeneratedColumn<int> get durationSeconds => $composableBuilder(
    column: $table.durationSeconds,
    builder: (column) => column,
  );

  GeneratedColumn<int> get createdAtUtc => $composableBuilder(
    column: $table.createdAtUtc,
    builder: (column) => column,
  );
}

class $$UsageSessionsTableTableManager
    extends
        RootTableManager<
          _$AppDatabase,
          $UsageSessionsTable,
          UsageSessionEntry,
          $$UsageSessionsTableFilterComposer,
          $$UsageSessionsTableOrderingComposer,
          $$UsageSessionsTableAnnotationComposer,
          $$UsageSessionsTableCreateCompanionBuilder,
          $$UsageSessionsTableUpdateCompanionBuilder,
          (
            UsageSessionEntry,
            BaseReferences<
              _$AppDatabase,
              $UsageSessionsTable,
              UsageSessionEntry
            >,
          ),
          UsageSessionEntry,
          PrefetchHooks Function()
        > {
  $$UsageSessionsTableTableManager(_$AppDatabase db, $UsageSessionsTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$UsageSessionsTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$UsageSessionsTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$UsageSessionsTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> id = const Value.absent(),
                Value<String> packageName = const Value.absent(),
                Value<String> appName = const Value.absent(),
                Value<int> startTimeUtc = const Value.absent(),
                Value<int> endTimeUtc = const Value.absent(),
                Value<int> durationSeconds = const Value.absent(),
                Value<int> createdAtUtc = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => UsageSessionsCompanion(
                id: id,
                packageName: packageName,
                appName: appName,
                startTimeUtc: startTimeUtc,
                endTimeUtc: endTimeUtc,
                durationSeconds: durationSeconds,
                createdAtUtc: createdAtUtc,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String id,
                required String packageName,
                required String appName,
                required int startTimeUtc,
                required int endTimeUtc,
                required int durationSeconds,
                required int createdAtUtc,
                Value<int> rowid = const Value.absent(),
              }) => UsageSessionsCompanion.insert(
                id: id,
                packageName: packageName,
                appName: appName,
                startTimeUtc: startTimeUtc,
                endTimeUtc: endTimeUtc,
                durationSeconds: durationSeconds,
                createdAtUtc: createdAtUtc,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ),
      );
}

typedef $$UsageSessionsTableProcessedTableManager =
    ProcessedTableManager<
      _$AppDatabase,
      $UsageSessionsTable,
      UsageSessionEntry,
      $$UsageSessionsTableFilterComposer,
      $$UsageSessionsTableOrderingComposer,
      $$UsageSessionsTableAnnotationComposer,
      $$UsageSessionsTableCreateCompanionBuilder,
      $$UsageSessionsTableUpdateCompanionBuilder,
      (
        UsageSessionEntry,
        BaseReferences<_$AppDatabase, $UsageSessionsTable, UsageSessionEntry>,
      ),
      UsageSessionEntry,
      PrefetchHooks Function()
    >;
typedef $$AppCategoriesTableCreateCompanionBuilder =
    AppCategoriesCompanion Function({
      required String packageName,
      required String categoryName,
      Value<int> rowid,
    });
typedef $$AppCategoriesTableUpdateCompanionBuilder =
    AppCategoriesCompanion Function({
      Value<String> packageName,
      Value<String> categoryName,
      Value<int> rowid,
    });

class $$AppCategoriesTableFilterComposer
    extends Composer<_$AppDatabase, $AppCategoriesTable> {
  $$AppCategoriesTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get packageName => $composableBuilder(
    column: $table.packageName,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get categoryName => $composableBuilder(
    column: $table.categoryName,
    builder: (column) => ColumnFilters(column),
  );
}

class $$AppCategoriesTableOrderingComposer
    extends Composer<_$AppDatabase, $AppCategoriesTable> {
  $$AppCategoriesTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get packageName => $composableBuilder(
    column: $table.packageName,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get categoryName => $composableBuilder(
    column: $table.categoryName,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$AppCategoriesTableAnnotationComposer
    extends Composer<_$AppDatabase, $AppCategoriesTable> {
  $$AppCategoriesTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get packageName => $composableBuilder(
    column: $table.packageName,
    builder: (column) => column,
  );

  GeneratedColumn<String> get categoryName => $composableBuilder(
    column: $table.categoryName,
    builder: (column) => column,
  );
}

class $$AppCategoriesTableTableManager
    extends
        RootTableManager<
          _$AppDatabase,
          $AppCategoriesTable,
          AppCategoryEntry,
          $$AppCategoriesTableFilterComposer,
          $$AppCategoriesTableOrderingComposer,
          $$AppCategoriesTableAnnotationComposer,
          $$AppCategoriesTableCreateCompanionBuilder,
          $$AppCategoriesTableUpdateCompanionBuilder,
          (
            AppCategoryEntry,
            BaseReferences<
              _$AppDatabase,
              $AppCategoriesTable,
              AppCategoryEntry
            >,
          ),
          AppCategoryEntry,
          PrefetchHooks Function()
        > {
  $$AppCategoriesTableTableManager(_$AppDatabase db, $AppCategoriesTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$AppCategoriesTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$AppCategoriesTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$AppCategoriesTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> packageName = const Value.absent(),
                Value<String> categoryName = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => AppCategoriesCompanion(
                packageName: packageName,
                categoryName: categoryName,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String packageName,
                required String categoryName,
                Value<int> rowid = const Value.absent(),
              }) => AppCategoriesCompanion.insert(
                packageName: packageName,
                categoryName: categoryName,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ),
      );
}

typedef $$AppCategoriesTableProcessedTableManager =
    ProcessedTableManager<
      _$AppDatabase,
      $AppCategoriesTable,
      AppCategoryEntry,
      $$AppCategoriesTableFilterComposer,
      $$AppCategoriesTableOrderingComposer,
      $$AppCategoriesTableAnnotationComposer,
      $$AppCategoriesTableCreateCompanionBuilder,
      $$AppCategoriesTableUpdateCompanionBuilder,
      (
        AppCategoryEntry,
        BaseReferences<_$AppDatabase, $AppCategoriesTable, AppCategoryEntry>,
      ),
      AppCategoryEntry,
      PrefetchHooks Function()
    >;
typedef $$UsageLimitsTableCreateCompanionBuilder =
    UsageLimitsCompanion Function({
      required String id,
      required String targetId,
      required String limitType,
      required int limitDurationMinutes,
      Value<int> rowid,
    });
typedef $$UsageLimitsTableUpdateCompanionBuilder =
    UsageLimitsCompanion Function({
      Value<String> id,
      Value<String> targetId,
      Value<String> limitType,
      Value<int> limitDurationMinutes,
      Value<int> rowid,
    });

class $$UsageLimitsTableFilterComposer
    extends Composer<_$AppDatabase, $UsageLimitsTable> {
  $$UsageLimitsTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get targetId => $composableBuilder(
    column: $table.targetId,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get limitType => $composableBuilder(
    column: $table.limitType,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get limitDurationMinutes => $composableBuilder(
    column: $table.limitDurationMinutes,
    builder: (column) => ColumnFilters(column),
  );
}

class $$UsageLimitsTableOrderingComposer
    extends Composer<_$AppDatabase, $UsageLimitsTable> {
  $$UsageLimitsTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get targetId => $composableBuilder(
    column: $table.targetId,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get limitType => $composableBuilder(
    column: $table.limitType,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get limitDurationMinutes => $composableBuilder(
    column: $table.limitDurationMinutes,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$UsageLimitsTableAnnotationComposer
    extends Composer<_$AppDatabase, $UsageLimitsTable> {
  $$UsageLimitsTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get targetId =>
      $composableBuilder(column: $table.targetId, builder: (column) => column);

  GeneratedColumn<String> get limitType =>
      $composableBuilder(column: $table.limitType, builder: (column) => column);

  GeneratedColumn<int> get limitDurationMinutes => $composableBuilder(
    column: $table.limitDurationMinutes,
    builder: (column) => column,
  );
}

class $$UsageLimitsTableTableManager
    extends
        RootTableManager<
          _$AppDatabase,
          $UsageLimitsTable,
          UsageLimitEntry,
          $$UsageLimitsTableFilterComposer,
          $$UsageLimitsTableOrderingComposer,
          $$UsageLimitsTableAnnotationComposer,
          $$UsageLimitsTableCreateCompanionBuilder,
          $$UsageLimitsTableUpdateCompanionBuilder,
          (
            UsageLimitEntry,
            BaseReferences<_$AppDatabase, $UsageLimitsTable, UsageLimitEntry>,
          ),
          UsageLimitEntry,
          PrefetchHooks Function()
        > {
  $$UsageLimitsTableTableManager(_$AppDatabase db, $UsageLimitsTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$UsageLimitsTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$UsageLimitsTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$UsageLimitsTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> id = const Value.absent(),
                Value<String> targetId = const Value.absent(),
                Value<String> limitType = const Value.absent(),
                Value<int> limitDurationMinutes = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => UsageLimitsCompanion(
                id: id,
                targetId: targetId,
                limitType: limitType,
                limitDurationMinutes: limitDurationMinutes,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String id,
                required String targetId,
                required String limitType,
                required int limitDurationMinutes,
                Value<int> rowid = const Value.absent(),
              }) => UsageLimitsCompanion.insert(
                id: id,
                targetId: targetId,
                limitType: limitType,
                limitDurationMinutes: limitDurationMinutes,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ),
      );
}

typedef $$UsageLimitsTableProcessedTableManager =
    ProcessedTableManager<
      _$AppDatabase,
      $UsageLimitsTable,
      UsageLimitEntry,
      $$UsageLimitsTableFilterComposer,
      $$UsageLimitsTableOrderingComposer,
      $$UsageLimitsTableAnnotationComposer,
      $$UsageLimitsTableCreateCompanionBuilder,
      $$UsageLimitsTableUpdateCompanionBuilder,
      (
        UsageLimitEntry,
        BaseReferences<_$AppDatabase, $UsageLimitsTable, UsageLimitEntry>,
      ),
      UsageLimitEntry,
      PrefetchHooks Function()
    >;
typedef $$DocumentItemsTableCreateCompanionBuilder =
    DocumentItemsCompanion Function({
      required String id,
      required String title,
      Value<String> mimeType,
      Value<String?> filePath,
      Value<String?> contentStructuredJson,
      Value<int> fileSizeBytes,
      required int createdAtUtc,
      required int updatedAtUtc,
      Value<int> rowid,
    });
typedef $$DocumentItemsTableUpdateCompanionBuilder =
    DocumentItemsCompanion Function({
      Value<String> id,
      Value<String> title,
      Value<String> mimeType,
      Value<String?> filePath,
      Value<String?> contentStructuredJson,
      Value<int> fileSizeBytes,
      Value<int> createdAtUtc,
      Value<int> updatedAtUtc,
      Value<int> rowid,
    });

final class $$DocumentItemsTableReferences
    extends
        BaseReferences<_$AppDatabase, $DocumentItemsTable, DocumentItemEntry> {
  $$DocumentItemsTableReferences(
    super.$_db,
    super.$_table,
    super.$_typedResult,
  );

  static MultiTypedResultKey<$DocumentPagesTable, List<DocumentPageEntry>>
  _documentPagesRefsTable(_$AppDatabase db) => MultiTypedResultKey.fromTable(
    db.documentPages,
    aliasName: $_aliasNameGenerator(
      db.documentItems.id,
      db.documentPages.documentId,
    ),
  );

  $$DocumentPagesTableProcessedTableManager get documentPagesRefs {
    final manager = $$DocumentPagesTableTableManager(
      $_db,
      $_db.documentPages,
    ).filter((f) => f.documentId.id.sqlEquals($_itemColumn<String>('id')!));

    final cache = $_typedResult.readTableOrNull(_documentPagesRefsTable($_db));
    return ProcessedTableManager(
      manager.$state.copyWith(prefetchedData: cache),
    );
  }
}

class $$DocumentItemsTableFilterComposer
    extends Composer<_$AppDatabase, $DocumentItemsTable> {
  $$DocumentItemsTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get title => $composableBuilder(
    column: $table.title,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get mimeType => $composableBuilder(
    column: $table.mimeType,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get filePath => $composableBuilder(
    column: $table.filePath,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get contentStructuredJson => $composableBuilder(
    column: $table.contentStructuredJson,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get fileSizeBytes => $composableBuilder(
    column: $table.fileSizeBytes,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get createdAtUtc => $composableBuilder(
    column: $table.createdAtUtc,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get updatedAtUtc => $composableBuilder(
    column: $table.updatedAtUtc,
    builder: (column) => ColumnFilters(column),
  );

  Expression<bool> documentPagesRefs(
    Expression<bool> Function($$DocumentPagesTableFilterComposer f) f,
  ) {
    final $$DocumentPagesTableFilterComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.id,
      referencedTable: $db.documentPages,
      getReferencedColumn: (t) => t.documentId,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$DocumentPagesTableFilterComposer(
            $db: $db,
            $table: $db.documentPages,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return f(composer);
  }
}

class $$DocumentItemsTableOrderingComposer
    extends Composer<_$AppDatabase, $DocumentItemsTable> {
  $$DocumentItemsTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get title => $composableBuilder(
    column: $table.title,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get mimeType => $composableBuilder(
    column: $table.mimeType,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get filePath => $composableBuilder(
    column: $table.filePath,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get contentStructuredJson => $composableBuilder(
    column: $table.contentStructuredJson,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get fileSizeBytes => $composableBuilder(
    column: $table.fileSizeBytes,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get createdAtUtc => $composableBuilder(
    column: $table.createdAtUtc,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get updatedAtUtc => $composableBuilder(
    column: $table.updatedAtUtc,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$DocumentItemsTableAnnotationComposer
    extends Composer<_$AppDatabase, $DocumentItemsTable> {
  $$DocumentItemsTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get title =>
      $composableBuilder(column: $table.title, builder: (column) => column);

  GeneratedColumn<String> get mimeType =>
      $composableBuilder(column: $table.mimeType, builder: (column) => column);

  GeneratedColumn<String> get filePath =>
      $composableBuilder(column: $table.filePath, builder: (column) => column);

  GeneratedColumn<String> get contentStructuredJson => $composableBuilder(
    column: $table.contentStructuredJson,
    builder: (column) => column,
  );

  GeneratedColumn<int> get fileSizeBytes => $composableBuilder(
    column: $table.fileSizeBytes,
    builder: (column) => column,
  );

  GeneratedColumn<int> get createdAtUtc => $composableBuilder(
    column: $table.createdAtUtc,
    builder: (column) => column,
  );

  GeneratedColumn<int> get updatedAtUtc => $composableBuilder(
    column: $table.updatedAtUtc,
    builder: (column) => column,
  );

  Expression<T> documentPagesRefs<T extends Object>(
    Expression<T> Function($$DocumentPagesTableAnnotationComposer a) f,
  ) {
    final $$DocumentPagesTableAnnotationComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.id,
      referencedTable: $db.documentPages,
      getReferencedColumn: (t) => t.documentId,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$DocumentPagesTableAnnotationComposer(
            $db: $db,
            $table: $db.documentPages,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return f(composer);
  }
}

class $$DocumentItemsTableTableManager
    extends
        RootTableManager<
          _$AppDatabase,
          $DocumentItemsTable,
          DocumentItemEntry,
          $$DocumentItemsTableFilterComposer,
          $$DocumentItemsTableOrderingComposer,
          $$DocumentItemsTableAnnotationComposer,
          $$DocumentItemsTableCreateCompanionBuilder,
          $$DocumentItemsTableUpdateCompanionBuilder,
          (DocumentItemEntry, $$DocumentItemsTableReferences),
          DocumentItemEntry,
          PrefetchHooks Function({bool documentPagesRefs})
        > {
  $$DocumentItemsTableTableManager(_$AppDatabase db, $DocumentItemsTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$DocumentItemsTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$DocumentItemsTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$DocumentItemsTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> id = const Value.absent(),
                Value<String> title = const Value.absent(),
                Value<String> mimeType = const Value.absent(),
                Value<String?> filePath = const Value.absent(),
                Value<String?> contentStructuredJson = const Value.absent(),
                Value<int> fileSizeBytes = const Value.absent(),
                Value<int> createdAtUtc = const Value.absent(),
                Value<int> updatedAtUtc = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => DocumentItemsCompanion(
                id: id,
                title: title,
                mimeType: mimeType,
                filePath: filePath,
                contentStructuredJson: contentStructuredJson,
                fileSizeBytes: fileSizeBytes,
                createdAtUtc: createdAtUtc,
                updatedAtUtc: updatedAtUtc,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String id,
                required String title,
                Value<String> mimeType = const Value.absent(),
                Value<String?> filePath = const Value.absent(),
                Value<String?> contentStructuredJson = const Value.absent(),
                Value<int> fileSizeBytes = const Value.absent(),
                required int createdAtUtc,
                required int updatedAtUtc,
                Value<int> rowid = const Value.absent(),
              }) => DocumentItemsCompanion.insert(
                id: id,
                title: title,
                mimeType: mimeType,
                filePath: filePath,
                contentStructuredJson: contentStructuredJson,
                fileSizeBytes: fileSizeBytes,
                createdAtUtc: createdAtUtc,
                updatedAtUtc: updatedAtUtc,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map(
                (e) => (
                  e.readTable(table),
                  $$DocumentItemsTableReferences(db, table, e),
                ),
              )
              .toList(),
          prefetchHooksCallback: ({documentPagesRefs = false}) {
            return PrefetchHooks(
              db: db,
              explicitlyWatchedTables: [
                if (documentPagesRefs) db.documentPages,
              ],
              addJoins: null,
              getPrefetchedDataCallback: (items) async {
                return [
                  if (documentPagesRefs)
                    await $_getPrefetchedData<
                      DocumentItemEntry,
                      $DocumentItemsTable,
                      DocumentPageEntry
                    >(
                      currentTable: table,
                      referencedTable: $$DocumentItemsTableReferences
                          ._documentPagesRefsTable(db),
                      managerFromTypedResult: (p0) =>
                          $$DocumentItemsTableReferences(
                            db,
                            table,
                            p0,
                          ).documentPagesRefs,
                      referencedItemsForCurrentItem: (item, referencedItems) =>
                          referencedItems.where((e) => e.documentId == item.id),
                      typedResults: items,
                    ),
                ];
              },
            );
          },
        ),
      );
}

typedef $$DocumentItemsTableProcessedTableManager =
    ProcessedTableManager<
      _$AppDatabase,
      $DocumentItemsTable,
      DocumentItemEntry,
      $$DocumentItemsTableFilterComposer,
      $$DocumentItemsTableOrderingComposer,
      $$DocumentItemsTableAnnotationComposer,
      $$DocumentItemsTableCreateCompanionBuilder,
      $$DocumentItemsTableUpdateCompanionBuilder,
      (DocumentItemEntry, $$DocumentItemsTableReferences),
      DocumentItemEntry,
      PrefetchHooks Function({bool documentPagesRefs})
    >;
typedef $$DocumentPagesTableCreateCompanionBuilder =
    DocumentPagesCompanion Function({
      required String id,
      required String documentId,
      required int pageIndex,
      Value<int> backgroundColor,
      Value<String> textContentJson,
      Value<String> drawingContentJson,
      Value<int> rowid,
    });
typedef $$DocumentPagesTableUpdateCompanionBuilder =
    DocumentPagesCompanion Function({
      Value<String> id,
      Value<String> documentId,
      Value<int> pageIndex,
      Value<int> backgroundColor,
      Value<String> textContentJson,
      Value<String> drawingContentJson,
      Value<int> rowid,
    });

final class $$DocumentPagesTableReferences
    extends
        BaseReferences<_$AppDatabase, $DocumentPagesTable, DocumentPageEntry> {
  $$DocumentPagesTableReferences(
    super.$_db,
    super.$_table,
    super.$_typedResult,
  );

  static $DocumentItemsTable _documentIdTable(_$AppDatabase db) =>
      db.documentItems.createAlias(
        $_aliasNameGenerator(db.documentPages.documentId, db.documentItems.id),
      );

  $$DocumentItemsTableProcessedTableManager get documentId {
    final $_column = $_itemColumn<String>('document_id')!;

    final manager = $$DocumentItemsTableTableManager(
      $_db,
      $_db.documentItems,
    ).filter((f) => f.id.sqlEquals($_column));
    final item = $_typedResult.readTableOrNull(_documentIdTable($_db));
    if (item == null) return manager;
    return ProcessedTableManager(
      manager.$state.copyWith(prefetchedData: [item]),
    );
  }
}

class $$DocumentPagesTableFilterComposer
    extends Composer<_$AppDatabase, $DocumentPagesTable> {
  $$DocumentPagesTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get pageIndex => $composableBuilder(
    column: $table.pageIndex,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get backgroundColor => $composableBuilder(
    column: $table.backgroundColor,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get textContentJson => $composableBuilder(
    column: $table.textContentJson,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get drawingContentJson => $composableBuilder(
    column: $table.drawingContentJson,
    builder: (column) => ColumnFilters(column),
  );

  $$DocumentItemsTableFilterComposer get documentId {
    final $$DocumentItemsTableFilterComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.documentId,
      referencedTable: $db.documentItems,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$DocumentItemsTableFilterComposer(
            $db: $db,
            $table: $db.documentItems,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }
}

class $$DocumentPagesTableOrderingComposer
    extends Composer<_$AppDatabase, $DocumentPagesTable> {
  $$DocumentPagesTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get pageIndex => $composableBuilder(
    column: $table.pageIndex,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get backgroundColor => $composableBuilder(
    column: $table.backgroundColor,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get textContentJson => $composableBuilder(
    column: $table.textContentJson,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get drawingContentJson => $composableBuilder(
    column: $table.drawingContentJson,
    builder: (column) => ColumnOrderings(column),
  );

  $$DocumentItemsTableOrderingComposer get documentId {
    final $$DocumentItemsTableOrderingComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.documentId,
      referencedTable: $db.documentItems,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$DocumentItemsTableOrderingComposer(
            $db: $db,
            $table: $db.documentItems,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }
}

class $$DocumentPagesTableAnnotationComposer
    extends Composer<_$AppDatabase, $DocumentPagesTable> {
  $$DocumentPagesTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<int> get pageIndex =>
      $composableBuilder(column: $table.pageIndex, builder: (column) => column);

  GeneratedColumn<int> get backgroundColor => $composableBuilder(
    column: $table.backgroundColor,
    builder: (column) => column,
  );

  GeneratedColumn<String> get textContentJson => $composableBuilder(
    column: $table.textContentJson,
    builder: (column) => column,
  );

  GeneratedColumn<String> get drawingContentJson => $composableBuilder(
    column: $table.drawingContentJson,
    builder: (column) => column,
  );

  $$DocumentItemsTableAnnotationComposer get documentId {
    final $$DocumentItemsTableAnnotationComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.documentId,
      referencedTable: $db.documentItems,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$DocumentItemsTableAnnotationComposer(
            $db: $db,
            $table: $db.documentItems,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }
}

class $$DocumentPagesTableTableManager
    extends
        RootTableManager<
          _$AppDatabase,
          $DocumentPagesTable,
          DocumentPageEntry,
          $$DocumentPagesTableFilterComposer,
          $$DocumentPagesTableOrderingComposer,
          $$DocumentPagesTableAnnotationComposer,
          $$DocumentPagesTableCreateCompanionBuilder,
          $$DocumentPagesTableUpdateCompanionBuilder,
          (DocumentPageEntry, $$DocumentPagesTableReferences),
          DocumentPageEntry,
          PrefetchHooks Function({bool documentId})
        > {
  $$DocumentPagesTableTableManager(_$AppDatabase db, $DocumentPagesTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$DocumentPagesTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$DocumentPagesTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$DocumentPagesTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> id = const Value.absent(),
                Value<String> documentId = const Value.absent(),
                Value<int> pageIndex = const Value.absent(),
                Value<int> backgroundColor = const Value.absent(),
                Value<String> textContentJson = const Value.absent(),
                Value<String> drawingContentJson = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => DocumentPagesCompanion(
                id: id,
                documentId: documentId,
                pageIndex: pageIndex,
                backgroundColor: backgroundColor,
                textContentJson: textContentJson,
                drawingContentJson: drawingContentJson,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String id,
                required String documentId,
                required int pageIndex,
                Value<int> backgroundColor = const Value.absent(),
                Value<String> textContentJson = const Value.absent(),
                Value<String> drawingContentJson = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => DocumentPagesCompanion.insert(
                id: id,
                documentId: documentId,
                pageIndex: pageIndex,
                backgroundColor: backgroundColor,
                textContentJson: textContentJson,
                drawingContentJson: drawingContentJson,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map(
                (e) => (
                  e.readTable(table),
                  $$DocumentPagesTableReferences(db, table, e),
                ),
              )
              .toList(),
          prefetchHooksCallback: ({documentId = false}) {
            return PrefetchHooks(
              db: db,
              explicitlyWatchedTables: [],
              addJoins:
                  <
                    T extends TableManagerState<
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic
                    >
                  >(state) {
                    if (documentId) {
                      state =
                          state.withJoin(
                                currentTable: table,
                                currentColumn: table.documentId,
                                referencedTable: $$DocumentPagesTableReferences
                                    ._documentIdTable(db),
                                referencedColumn: $$DocumentPagesTableReferences
                                    ._documentIdTable(db)
                                    .id,
                              )
                              as T;
                    }

                    return state;
                  },
              getPrefetchedDataCallback: (items) async {
                return [];
              },
            );
          },
        ),
      );
}

typedef $$DocumentPagesTableProcessedTableManager =
    ProcessedTableManager<
      _$AppDatabase,
      $DocumentPagesTable,
      DocumentPageEntry,
      $$DocumentPagesTableFilterComposer,
      $$DocumentPagesTableOrderingComposer,
      $$DocumentPagesTableAnnotationComposer,
      $$DocumentPagesTableCreateCompanionBuilder,
      $$DocumentPagesTableUpdateCompanionBuilder,
      (DocumentPageEntry, $$DocumentPagesTableReferences),
      DocumentPageEntry,
      PrefetchHooks Function({bool documentId})
    >;
typedef $$MusicPlaylistsTableCreateCompanionBuilder =
    MusicPlaylistsCompanion Function({
      required String id,
      required String name,
      required DateTime createdAt,
      Value<int> rowid,
    });
typedef $$MusicPlaylistsTableUpdateCompanionBuilder =
    MusicPlaylistsCompanion Function({
      Value<String> id,
      Value<String> name,
      Value<DateTime> createdAt,
      Value<int> rowid,
    });

final class $$MusicPlaylistsTableReferences
    extends BaseReferences<_$AppDatabase, $MusicPlaylistsTable, MusicPlaylist> {
  $$MusicPlaylistsTableReferences(
    super.$_db,
    super.$_table,
    super.$_typedResult,
  );

  static MultiTypedResultKey<$PlaylistSongsTable, List<PlaylistSong>>
  _playlistSongsRefsTable(_$AppDatabase db) => MultiTypedResultKey.fromTable(
    db.playlistSongs,
    aliasName: $_aliasNameGenerator(
      db.musicPlaylists.id,
      db.playlistSongs.playlistId,
    ),
  );

  $$PlaylistSongsTableProcessedTableManager get playlistSongsRefs {
    final manager = $$PlaylistSongsTableTableManager(
      $_db,
      $_db.playlistSongs,
    ).filter((f) => f.playlistId.id.sqlEquals($_itemColumn<String>('id')!));

    final cache = $_typedResult.readTableOrNull(_playlistSongsRefsTable($_db));
    return ProcessedTableManager(
      manager.$state.copyWith(prefetchedData: cache),
    );
  }
}

class $$MusicPlaylistsTableFilterComposer
    extends Composer<_$AppDatabase, $MusicPlaylistsTable> {
  $$MusicPlaylistsTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get name => $composableBuilder(
    column: $table.name,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get createdAt => $composableBuilder(
    column: $table.createdAt,
    builder: (column) => ColumnFilters(column),
  );

  Expression<bool> playlistSongsRefs(
    Expression<bool> Function($$PlaylistSongsTableFilterComposer f) f,
  ) {
    final $$PlaylistSongsTableFilterComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.id,
      referencedTable: $db.playlistSongs,
      getReferencedColumn: (t) => t.playlistId,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$PlaylistSongsTableFilterComposer(
            $db: $db,
            $table: $db.playlistSongs,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return f(composer);
  }
}

class $$MusicPlaylistsTableOrderingComposer
    extends Composer<_$AppDatabase, $MusicPlaylistsTable> {
  $$MusicPlaylistsTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get name => $composableBuilder(
    column: $table.name,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get createdAt => $composableBuilder(
    column: $table.createdAt,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$MusicPlaylistsTableAnnotationComposer
    extends Composer<_$AppDatabase, $MusicPlaylistsTable> {
  $$MusicPlaylistsTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get name =>
      $composableBuilder(column: $table.name, builder: (column) => column);

  GeneratedColumn<DateTime> get createdAt =>
      $composableBuilder(column: $table.createdAt, builder: (column) => column);

  Expression<T> playlistSongsRefs<T extends Object>(
    Expression<T> Function($$PlaylistSongsTableAnnotationComposer a) f,
  ) {
    final $$PlaylistSongsTableAnnotationComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.id,
      referencedTable: $db.playlistSongs,
      getReferencedColumn: (t) => t.playlistId,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$PlaylistSongsTableAnnotationComposer(
            $db: $db,
            $table: $db.playlistSongs,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return f(composer);
  }
}

class $$MusicPlaylistsTableTableManager
    extends
        RootTableManager<
          _$AppDatabase,
          $MusicPlaylistsTable,
          MusicPlaylist,
          $$MusicPlaylistsTableFilterComposer,
          $$MusicPlaylistsTableOrderingComposer,
          $$MusicPlaylistsTableAnnotationComposer,
          $$MusicPlaylistsTableCreateCompanionBuilder,
          $$MusicPlaylistsTableUpdateCompanionBuilder,
          (MusicPlaylist, $$MusicPlaylistsTableReferences),
          MusicPlaylist,
          PrefetchHooks Function({bool playlistSongsRefs})
        > {
  $$MusicPlaylistsTableTableManager(
    _$AppDatabase db,
    $MusicPlaylistsTable table,
  ) : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$MusicPlaylistsTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$MusicPlaylistsTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$MusicPlaylistsTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> id = const Value.absent(),
                Value<String> name = const Value.absent(),
                Value<DateTime> createdAt = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => MusicPlaylistsCompanion(
                id: id,
                name: name,
                createdAt: createdAt,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String id,
                required String name,
                required DateTime createdAt,
                Value<int> rowid = const Value.absent(),
              }) => MusicPlaylistsCompanion.insert(
                id: id,
                name: name,
                createdAt: createdAt,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map(
                (e) => (
                  e.readTable(table),
                  $$MusicPlaylistsTableReferences(db, table, e),
                ),
              )
              .toList(),
          prefetchHooksCallback: ({playlistSongsRefs = false}) {
            return PrefetchHooks(
              db: db,
              explicitlyWatchedTables: [
                if (playlistSongsRefs) db.playlistSongs,
              ],
              addJoins: null,
              getPrefetchedDataCallback: (items) async {
                return [
                  if (playlistSongsRefs)
                    await $_getPrefetchedData<
                      MusicPlaylist,
                      $MusicPlaylistsTable,
                      PlaylistSong
                    >(
                      currentTable: table,
                      referencedTable: $$MusicPlaylistsTableReferences
                          ._playlistSongsRefsTable(db),
                      managerFromTypedResult: (p0) =>
                          $$MusicPlaylistsTableReferences(
                            db,
                            table,
                            p0,
                          ).playlistSongsRefs,
                      referencedItemsForCurrentItem: (item, referencedItems) =>
                          referencedItems.where((e) => e.playlistId == item.id),
                      typedResults: items,
                    ),
                ];
              },
            );
          },
        ),
      );
}

typedef $$MusicPlaylistsTableProcessedTableManager =
    ProcessedTableManager<
      _$AppDatabase,
      $MusicPlaylistsTable,
      MusicPlaylist,
      $$MusicPlaylistsTableFilterComposer,
      $$MusicPlaylistsTableOrderingComposer,
      $$MusicPlaylistsTableAnnotationComposer,
      $$MusicPlaylistsTableCreateCompanionBuilder,
      $$MusicPlaylistsTableUpdateCompanionBuilder,
      (MusicPlaylist, $$MusicPlaylistsTableReferences),
      MusicPlaylist,
      PrefetchHooks Function({bool playlistSongsRefs})
    >;
typedef $$PlaylistSongsTableCreateCompanionBuilder =
    PlaylistSongsCompanion Function({
      required String playlistId,
      required String songPath,
      Value<int> sortOrder,
      Value<int> rowid,
    });
typedef $$PlaylistSongsTableUpdateCompanionBuilder =
    PlaylistSongsCompanion Function({
      Value<String> playlistId,
      Value<String> songPath,
      Value<int> sortOrder,
      Value<int> rowid,
    });

final class $$PlaylistSongsTableReferences
    extends BaseReferences<_$AppDatabase, $PlaylistSongsTable, PlaylistSong> {
  $$PlaylistSongsTableReferences(
    super.$_db,
    super.$_table,
    super.$_typedResult,
  );

  static $MusicPlaylistsTable _playlistIdTable(_$AppDatabase db) =>
      db.musicPlaylists.createAlias(
        $_aliasNameGenerator(db.playlistSongs.playlistId, db.musicPlaylists.id),
      );

  $$MusicPlaylistsTableProcessedTableManager get playlistId {
    final $_column = $_itemColumn<String>('playlist_id')!;

    final manager = $$MusicPlaylistsTableTableManager(
      $_db,
      $_db.musicPlaylists,
    ).filter((f) => f.id.sqlEquals($_column));
    final item = $_typedResult.readTableOrNull(_playlistIdTable($_db));
    if (item == null) return manager;
    return ProcessedTableManager(
      manager.$state.copyWith(prefetchedData: [item]),
    );
  }
}

class $$PlaylistSongsTableFilterComposer
    extends Composer<_$AppDatabase, $PlaylistSongsTable> {
  $$PlaylistSongsTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get songPath => $composableBuilder(
    column: $table.songPath,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get sortOrder => $composableBuilder(
    column: $table.sortOrder,
    builder: (column) => ColumnFilters(column),
  );

  $$MusicPlaylistsTableFilterComposer get playlistId {
    final $$MusicPlaylistsTableFilterComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.playlistId,
      referencedTable: $db.musicPlaylists,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$MusicPlaylistsTableFilterComposer(
            $db: $db,
            $table: $db.musicPlaylists,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }
}

class $$PlaylistSongsTableOrderingComposer
    extends Composer<_$AppDatabase, $PlaylistSongsTable> {
  $$PlaylistSongsTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get songPath => $composableBuilder(
    column: $table.songPath,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get sortOrder => $composableBuilder(
    column: $table.sortOrder,
    builder: (column) => ColumnOrderings(column),
  );

  $$MusicPlaylistsTableOrderingComposer get playlistId {
    final $$MusicPlaylistsTableOrderingComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.playlistId,
      referencedTable: $db.musicPlaylists,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$MusicPlaylistsTableOrderingComposer(
            $db: $db,
            $table: $db.musicPlaylists,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }
}

class $$PlaylistSongsTableAnnotationComposer
    extends Composer<_$AppDatabase, $PlaylistSongsTable> {
  $$PlaylistSongsTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get songPath =>
      $composableBuilder(column: $table.songPath, builder: (column) => column);

  GeneratedColumn<int> get sortOrder =>
      $composableBuilder(column: $table.sortOrder, builder: (column) => column);

  $$MusicPlaylistsTableAnnotationComposer get playlistId {
    final $$MusicPlaylistsTableAnnotationComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.playlistId,
      referencedTable: $db.musicPlaylists,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$MusicPlaylistsTableAnnotationComposer(
            $db: $db,
            $table: $db.musicPlaylists,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }
}

class $$PlaylistSongsTableTableManager
    extends
        RootTableManager<
          _$AppDatabase,
          $PlaylistSongsTable,
          PlaylistSong,
          $$PlaylistSongsTableFilterComposer,
          $$PlaylistSongsTableOrderingComposer,
          $$PlaylistSongsTableAnnotationComposer,
          $$PlaylistSongsTableCreateCompanionBuilder,
          $$PlaylistSongsTableUpdateCompanionBuilder,
          (PlaylistSong, $$PlaylistSongsTableReferences),
          PlaylistSong,
          PrefetchHooks Function({bool playlistId})
        > {
  $$PlaylistSongsTableTableManager(_$AppDatabase db, $PlaylistSongsTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$PlaylistSongsTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$PlaylistSongsTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$PlaylistSongsTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> playlistId = const Value.absent(),
                Value<String> songPath = const Value.absent(),
                Value<int> sortOrder = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => PlaylistSongsCompanion(
                playlistId: playlistId,
                songPath: songPath,
                sortOrder: sortOrder,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String playlistId,
                required String songPath,
                Value<int> sortOrder = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => PlaylistSongsCompanion.insert(
                playlistId: playlistId,
                songPath: songPath,
                sortOrder: sortOrder,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map(
                (e) => (
                  e.readTable(table),
                  $$PlaylistSongsTableReferences(db, table, e),
                ),
              )
              .toList(),
          prefetchHooksCallback: ({playlistId = false}) {
            return PrefetchHooks(
              db: db,
              explicitlyWatchedTables: [],
              addJoins:
                  <
                    T extends TableManagerState<
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic
                    >
                  >(state) {
                    if (playlistId) {
                      state =
                          state.withJoin(
                                currentTable: table,
                                currentColumn: table.playlistId,
                                referencedTable: $$PlaylistSongsTableReferences
                                    ._playlistIdTable(db),
                                referencedColumn: $$PlaylistSongsTableReferences
                                    ._playlistIdTable(db)
                                    .id,
                              )
                              as T;
                    }

                    return state;
                  },
              getPrefetchedDataCallback: (items) async {
                return [];
              },
            );
          },
        ),
      );
}

typedef $$PlaylistSongsTableProcessedTableManager =
    ProcessedTableManager<
      _$AppDatabase,
      $PlaylistSongsTable,
      PlaylistSong,
      $$PlaylistSongsTableFilterComposer,
      $$PlaylistSongsTableOrderingComposer,
      $$PlaylistSongsTableAnnotationComposer,
      $$PlaylistSongsTableCreateCompanionBuilder,
      $$PlaylistSongsTableUpdateCompanionBuilder,
      (PlaylistSong, $$PlaylistSongsTableReferences),
      PlaylistSong,
      PrefetchHooks Function({bool playlistId})
    >;
typedef $$SongMetadataTableCreateCompanionBuilder =
    SongMetadataCompanion Function({
      required String songPath,
      Value<bool> isFavorite,
      Value<int> playCount,
      Value<DateTime?> lastPlayed,
      Value<int> rowid,
    });
typedef $$SongMetadataTableUpdateCompanionBuilder =
    SongMetadataCompanion Function({
      Value<String> songPath,
      Value<bool> isFavorite,
      Value<int> playCount,
      Value<DateTime?> lastPlayed,
      Value<int> rowid,
    });

class $$SongMetadataTableFilterComposer
    extends Composer<_$AppDatabase, $SongMetadataTable> {
  $$SongMetadataTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get songPath => $composableBuilder(
    column: $table.songPath,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<bool> get isFavorite => $composableBuilder(
    column: $table.isFavorite,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get playCount => $composableBuilder(
    column: $table.playCount,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get lastPlayed => $composableBuilder(
    column: $table.lastPlayed,
    builder: (column) => ColumnFilters(column),
  );
}

class $$SongMetadataTableOrderingComposer
    extends Composer<_$AppDatabase, $SongMetadataTable> {
  $$SongMetadataTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get songPath => $composableBuilder(
    column: $table.songPath,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<bool> get isFavorite => $composableBuilder(
    column: $table.isFavorite,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get playCount => $composableBuilder(
    column: $table.playCount,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get lastPlayed => $composableBuilder(
    column: $table.lastPlayed,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$SongMetadataTableAnnotationComposer
    extends Composer<_$AppDatabase, $SongMetadataTable> {
  $$SongMetadataTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get songPath =>
      $composableBuilder(column: $table.songPath, builder: (column) => column);

  GeneratedColumn<bool> get isFavorite => $composableBuilder(
    column: $table.isFavorite,
    builder: (column) => column,
  );

  GeneratedColumn<int> get playCount =>
      $composableBuilder(column: $table.playCount, builder: (column) => column);

  GeneratedColumn<DateTime> get lastPlayed => $composableBuilder(
    column: $table.lastPlayed,
    builder: (column) => column,
  );
}

class $$SongMetadataTableTableManager
    extends
        RootTableManager<
          _$AppDatabase,
          $SongMetadataTable,
          SongMetadataData,
          $$SongMetadataTableFilterComposer,
          $$SongMetadataTableOrderingComposer,
          $$SongMetadataTableAnnotationComposer,
          $$SongMetadataTableCreateCompanionBuilder,
          $$SongMetadataTableUpdateCompanionBuilder,
          (
            SongMetadataData,
            BaseReferences<_$AppDatabase, $SongMetadataTable, SongMetadataData>,
          ),
          SongMetadataData,
          PrefetchHooks Function()
        > {
  $$SongMetadataTableTableManager(_$AppDatabase db, $SongMetadataTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$SongMetadataTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$SongMetadataTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$SongMetadataTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> songPath = const Value.absent(),
                Value<bool> isFavorite = const Value.absent(),
                Value<int> playCount = const Value.absent(),
                Value<DateTime?> lastPlayed = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => SongMetadataCompanion(
                songPath: songPath,
                isFavorite: isFavorite,
                playCount: playCount,
                lastPlayed: lastPlayed,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String songPath,
                Value<bool> isFavorite = const Value.absent(),
                Value<int> playCount = const Value.absent(),
                Value<DateTime?> lastPlayed = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => SongMetadataCompanion.insert(
                songPath: songPath,
                isFavorite: isFavorite,
                playCount: playCount,
                lastPlayed: lastPlayed,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ),
      );
}

typedef $$SongMetadataTableProcessedTableManager =
    ProcessedTableManager<
      _$AppDatabase,
      $SongMetadataTable,
      SongMetadataData,
      $$SongMetadataTableFilterComposer,
      $$SongMetadataTableOrderingComposer,
      $$SongMetadataTableAnnotationComposer,
      $$SongMetadataTableCreateCompanionBuilder,
      $$SongMetadataTableUpdateCompanionBuilder,
      (
        SongMetadataData,
        BaseReferences<_$AppDatabase, $SongMetadataTable, SongMetadataData>,
      ),
      SongMetadataData,
      PrefetchHooks Function()
    >;

class $AppDatabaseManager {
  final _$AppDatabase _db;
  $AppDatabaseManager(this._db);
  $$TagsTableTableManager get tags => $$TagsTableTableManager(_db, _db.tags);
  $$EntityCrossLinksTableTableManager get entityCrossLinks =>
      $$EntityCrossLinksTableTableManager(_db, _db.entityCrossLinks);
  $$CalendarEventsTableTableManager get calendarEvents =>
      $$CalendarEventsTableTableManager(_db, _db.calendarEvents);
  $$MoneyAccountsTableTableManager get moneyAccounts =>
      $$MoneyAccountsTableTableManager(_db, _db.moneyAccounts);
  $$MoneyCategoriesTableTableManager get moneyCategories =>
      $$MoneyCategoriesTableTableManager(_db, _db.moneyCategories);
  $$TaskListsTableTableManager get taskLists =>
      $$TaskListsTableTableManager(_db, _db.taskLists);
  $$TaskItemsTableTableManager get taskItems =>
      $$TaskItemsTableTableManager(_db, _db.taskItems);
  $$MoneyTransactionsTableTableManager get moneyTransactions =>
      $$MoneyTransactionsTableTableManager(_db, _db.moneyTransactions);
  $$MoneyBudgetsTableTableManager get moneyBudgets =>
      $$MoneyBudgetsTableTableManager(_db, _db.moneyBudgets);
  $$SavingsGoalsTableTableManager get savingsGoals =>
      $$SavingsGoalsTableTableManager(_db, _db.savingsGoals);
  $$DebtsTableTableManager get debts =>
      $$DebtsTableTableManager(_db, _db.debts);
  $$RecurringTransactionsTableTableManager get recurringTransactions =>
      $$RecurringTransactionsTableTableManager(_db, _db.recurringTransactions);
  $$NoteLabelsTableTableManager get noteLabels =>
      $$NoteLabelsTableTableManager(_db, _db.noteLabels);
  $$NoteItemsTableTableManager get noteItems =>
      $$NoteItemsTableTableManager(_db, _db.noteItems);
  $$NoteLabelCrossRefTableTableManager get noteLabelCrossRef =>
      $$NoteLabelCrossRefTableTableManager(_db, _db.noteLabelCrossRef);
  $$ChecklistItemsTableTableManager get checklistItems =>
      $$ChecklistItemsTableTableManager(_db, _db.checklistItems);
  $$UsageSessionsTableTableManager get usageSessions =>
      $$UsageSessionsTableTableManager(_db, _db.usageSessions);
  $$AppCategoriesTableTableManager get appCategories =>
      $$AppCategoriesTableTableManager(_db, _db.appCategories);
  $$UsageLimitsTableTableManager get usageLimits =>
      $$UsageLimitsTableTableManager(_db, _db.usageLimits);
  $$DocumentItemsTableTableManager get documentItems =>
      $$DocumentItemsTableTableManager(_db, _db.documentItems);
  $$DocumentPagesTableTableManager get documentPages =>
      $$DocumentPagesTableTableManager(_db, _db.documentPages);
  $$MusicPlaylistsTableTableManager get musicPlaylists =>
      $$MusicPlaylistsTableTableManager(_db, _db.musicPlaylists);
  $$PlaylistSongsTableTableManager get playlistSongs =>
      $$PlaylistSongsTableTableManager(_db, _db.playlistSongs);
  $$SongMetadataTableTableManager get songMetadata =>
      $$SongMetadataTableTableManager(_db, _db.songMetadata);
}
