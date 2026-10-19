import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_quill/flutter_quill.dart' as quill;
import 'package:drift/drift.dart' as drift;
import 'package:uuid/uuid.dart';
import '../../../core/database/app_database.dart';
import '../../../core/database/daos/note_dao.dart';
import '../../../core/providers/core_providers.dart';
import '../providers/notes_providers.dart';

class NoteEditorScreen extends ConsumerStatefulWidget {
  final NoteWithDetails? existingNote;
  final String? initialType; // 'text' or 'checklist'

  const NoteEditorScreen({super.key, this.existingNote, this.initialType});

  @override
  ConsumerState<NoteEditorScreen> createState() => _NoteEditorScreenState();
}

class _NoteEditorScreenState extends ConsumerState<NoteEditorScreen> {
  late String _noteId;
  late TextEditingController _titleController;
  late quill.QuillController _quillController;
  
  late String _type;
  late List<ChecklistItemEntry> _checklist;
  
  List<NoteLabelEntry> _selectedLabels = [];
  int? _colorValue;
  bool _isPinned = false;
  bool _isArchived = false;

  @override
  void initState() {
    super.initState();
    _noteId = widget.existingNote?.note.id ?? const Uuid().v4();
    _titleController = TextEditingController(text: widget.existingNote?.note.title ?? '');
    
    _type = widget.existingNote?.note.type ?? widget.initialType ?? 'text';
    _colorValue = widget.existingNote?.note.colorValue;
    _isPinned = widget.existingNote?.note.isPinned ?? false;
    _isArchived = widget.existingNote?.note.isArchived ?? false;
    _selectedLabels = widget.existingNote?.labels ?? [];
    _checklist = widget.existingNote?.checklistItems.map((e) => e).toList() ?? [];

    if (widget.existingNote?.note.content != null && widget.existingNote!.note.content!.isNotEmpty && _type == 'text') {
      try {
        final doc = quill.Document.fromJson(jsonDecode(widget.existingNote!.note.content!));
        _quillController = quill.QuillController(document: doc, selection: const TextSelection.collapsed(offset: 0));
      } catch (e) {
        _quillController = quill.QuillController.basic();
      }
    } else {
      _quillController = quill.QuillController.basic();
    }
  }

  bool _isSaving = false;

  Future<void> _saveNote() async {
    if (_isSaving) return;
    _isSaving = true;
    try {
      final title = _titleController.text.trim();
      String? content;
      
      if (_type == 'text') {
        final delta = _quillController.document.toDelta().toJson();
        // Only save if there's actual content or a title
        if (delta.length == 1 && delta[0]['insert'] == '\n' && title.isEmpty && _selectedLabels.isEmpty) {
          return; // Empty note, don't save
        }
        content = jsonEncode(delta);
      } else {
        if (title.isEmpty && _checklist.isEmpty && _selectedLabels.isEmpty) {
          return;
        }
      }

      final dao = ref.read(databaseProvider).noteDao;
      
      final companion = NoteItemsCompanion(
        id: drift.Value(_noteId),
        title: drift.Value(title),
        content: drift.Value(content),
        type: drift.Value(_type),
        colorValue: drift.Value(_colorValue),
        isPinned: drift.Value(_isPinned),
        isArchived: drift.Value(_isArchived),
        isDeleted: const drift.Value(false),
        createdAtUtc: drift.Value(widget.existingNote?.note.createdAtUtc ?? DateTime.now().toUtc().millisecondsSinceEpoch),
        updatedAtUtc: drift.Value(DateTime.now().toUtc().millisecondsSinceEpoch),
      );

      if (widget.existingNote == null) {
        final checklistCompanions = _checklist.map((c) => ChecklistItemsCompanion.insert(
          id: c.id,
          noteId: _noteId,
          itemText: c.itemText,
          isChecked: drift.Value(c.isChecked),
          sortOrder: drift.Value(c.sortOrder),
        )).toList();
        
        await dao.createNote(companion, _selectedLabels.map((l) => l.id).toList(), checklistCompanions);
      } else {
        // Reconstruct Entry for replace
        final entry = NoteItemEntry(
          id: _noteId,
          title: title,
          content: content,
          type: _type,
          colorValue: _colorValue,
          isPinned: _isPinned,
          isArchived: _isArchived,
          isDeleted: false,
          createdAtUtc: companion.createdAtUtc.value,
          updatedAtUtc: companion.updatedAtUtc.value,
        );
        
        await dao.updateNoteWithDetails(entry, _selectedLabels.map((l) => l.id).toList(), _checklist);
      }
    } catch (e) {
      debugPrint('Error saving note: $e');
    } finally {
      _isSaving = false;
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _quillController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    Color bgColor = _colorValue != null ? Color(_colorValue!) : Theme.of(context).scaffoldBackgroundColor;

    return PopScope(
      canPop: true,
      onPopInvokedWithResult: (didPop, result) {
        _saveNote();
      },
      child: Scaffold(
        backgroundColor: bgColor,
        appBar: AppBar(
          backgroundColor: Colors.transparent,
          elevation: 0,
          actions: [
            FilledButton.tonal(
              onPressed: () async {
                await _saveNote();
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Note saved successfully!'),
                      duration: Duration(milliseconds: 1200),
                    ),
                  );
                  Navigator.pop(context);
                }
              },
              style: FilledButton.styleFrom(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              ),
              child: const Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.check, size: 16),
                  SizedBox(width: 4),
                  Text('Save', style: TextStyle(fontWeight: FontWeight.bold)),
                ],
              ),
            ),
            IconButton(
              icon: Icon(_isPinned ? Icons.push_pin : Icons.push_pin_outlined),
              onPressed: () {
                setState(() {
                  _isPinned = !_isPinned;
                  if (_isPinned) _isArchived = false;
                });
              },
            ),
            IconButton(
              icon: const Icon(Icons.palette_outlined),
              onPressed: _showColorPicker,
            ),
            IconButton(
              icon: const Icon(Icons.archive_outlined),
              onPressed: () async {
                setState(() {
                  _isArchived = true;
                  _isPinned = false;
                });
                await _saveNote();
                if (context.mounted) Navigator.pop(context);
              },
            ),
            PopupMenuButton(
              itemBuilder: (context) => [
                PopupMenuItem(
                  value: 'labels',
                  child: const Text('Labels'),
                ),
                PopupMenuItem(
                  value: 'delete',
                  child: const Text('Delete'),
                ),
              ],
              onSelected: (val) async {
                if (val == 'labels') {
                  _showLabelPicker();
                } else if (val == 'delete') {
                  if (widget.existingNote != null) {
                    await ref.read(databaseProvider).noteDao.moveToTrash(_noteId);
                  }
                  if (mounted) {
                    Navigator.pop(context);
                  }
                }
              },
            ),
          ],
        ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: TextField(
              controller: _titleController,
              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
              decoration: const InputDecoration(
                hintText: 'Title',
                border: InputBorder.none,
              ),
              maxLines: null,
            ),
          ),
          if (_type == 'text') ...[
            quill.QuillToolbar.simple(
              configurations: quill.QuillSimpleToolbarConfigurations(
                controller: _quillController,
                showFontFamily: false,
                showFontSize: false,
                showSearchButton: false,
                showIndent: false,
                showHeaderStyle: false,
                showListCheck: false,
              ),
            ),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: quill.QuillEditor.basic(
                  configurations: quill.QuillEditorConfigurations(
                    controller: _quillController,
                    placeholder: 'Note',
                    padding: EdgeInsets.zero,
                  ),
                ),
              ),
            ),
          ] else ...[
            Expanded(
              child: ReorderableListView(
                padding: const EdgeInsets.all(16.0),
                onReorder: (oldIndex, newIndex) {
                  setState(() {
                    if (newIndex > oldIndex) {
                      newIndex -= 1;
                    }
                    final item = _checklist.removeAt(oldIndex);
                    _checklist.insert(newIndex, item);
                    for (int i = 0; i < _checklist.length; i++) {
                      _checklist[i] = ChecklistItemEntry(
                        id: _checklist[i].id,
                        noteId: _checklist[i].noteId,
                        itemText: _checklist[i].itemText,
                        isChecked: _checklist[i].isChecked,
                        sortOrder: i,
                      );
                    }
                  });
                },
                children: [
                  for (int i = 0; i < _checklist.length; i++)
                    _buildChecklistItem(i, key: ValueKey(_checklist[i].id)),
                  ListTile(
                    key: const ValueKey('add_item'),
                    leading: const Icon(Icons.add),
                    title: const Text('List item'),
                    onTap: () {
                      setState(() {
                        _checklist.add(ChecklistItemEntry(
                          id: const Uuid().v4(),
                          noteId: _noteId,
                          itemText: '',
                          isChecked: false,
                          sortOrder: _checklist.length,
                        ));
                      });
                    },
                  ),
                ],
              ),
            ),
          ],
          if (_selectedLabels.isNotEmpty)
            Container(
              padding: const EdgeInsets.all(16.0),
              alignment: Alignment.centerLeft,
              child: Wrap(
                spacing: 8,
                children: _selectedLabels.map((l) => Chip(
                  label: Text(l.name, style: const TextStyle(fontSize: 12)),
                  onDeleted: () {
                    setState(() {
                      _selectedLabels.remove(l);
                    });
                  },
                )).toList(),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildChecklistItem(int index, {required Key key}) {
    final item = _checklist[index];
    return Row(
      key: key,
      children: [
        Checkbox(
          value: item.isChecked,
          onChanged: (val) {
            setState(() {
              _checklist[index] = ChecklistItemEntry(
                id: item.id,
                noteId: item.noteId,
                itemText: item.itemText,
                isChecked: val ?? false,
                sortOrder: item.sortOrder,
              );
            });
          },
        ),
        Expanded(
          child: TextFormField(
            initialValue: item.itemText,
            style: TextStyle(
              decoration: item.isChecked ? TextDecoration.lineThrough : null,
              color: item.isChecked ? Colors.grey : null,
            ),
            decoration: const InputDecoration(border: InputBorder.none),
            onChanged: (val) {
              _checklist[index] = ChecklistItemEntry(
                id: item.id,
                noteId: item.noteId,
                itemText: val,
                isChecked: item.isChecked,
                sortOrder: item.sortOrder,
              );
            },
          ),
        ),
        IconButton(
          icon: const Icon(Icons.close),
          onPressed: () {
            setState(() {
              _checklist.removeAt(index);
            });
          },
        ),
        const Icon(Icons.drag_handle, color: Colors.grey),
        const SizedBox(width: 8),
      ],
    );
  }

  void _showColorPicker() {
    final colors = [
      null, // Default
      0xFFF28B82, // Red
      0xFFFBBC04, // Orange
      0xFFFFF475, // Yellow
      0xFFCCFF90, // Green
      0xFFA7FFEB, // Teal
      0xFFCBF0F8, // Blue
      0xFFAECBFA, // Dark Blue
      0xFFD7AEFB, // Purple
      0xFFFDCFE8, // Pink
      0xFFE6C9A8, // Brown
      0xFFE8EAED, // Grey
    ];

    showModalBottomSheet(
      context: context,
      builder: (ctx) => Container(
        height: 120,
        padding: const EdgeInsets.all(16),
        child: ListView.builder(
          scrollDirection: Axis.horizontal,
          itemCount: colors.length,
          itemBuilder: (ctx, i) {
            final c = colors[i];
            return GestureDetector(
              onTap: () {
                setState(() {
                  _colorValue = c;
                });
                Navigator.pop(ctx);
              },
              child: Container(
                width: 48,
                height: 48,
                margin: const EdgeInsets.only(right: 12),
                decoration: BoxDecoration(
                  color: c != null ? Color(c) : Theme.of(context).scaffoldBackgroundColor,
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.grey),
                ),
                child: _colorValue == c ? const Icon(Icons.check) : null,
              ),
            );
          },
        ),
      ),
    );
  }

  void _showLabelPicker() {
    showDialog(
      context: context,
      builder: (ctx) => Consumer(
        builder: (context, ref, child) {
          final labels = ref.watch(allLabelsStreamProvider).valueOrNull ?? [];
          return AlertDialog(
            title: const Text('Select Labels'),
            content: SizedBox(
              width: double.maxFinite,
              child: ListView.builder(
                shrinkWrap: true,
                itemCount: labels.length,
                itemBuilder: (context, index) {
                  final l = labels[index];
                  final isSelected = _selectedLabels.any((sl) => sl.id == l.id);
                  return CheckboxListTile(
                    title: Text(l.name),
                    value: isSelected,
                    onChanged: (val) {
                      setState(() {
                        if (val == true) {
                          _selectedLabels.add(l);
                        } else {
                          _selectedLabels.removeWhere((sl) => sl.id == l.id);
                        }
                      });
                      // Force dialog to rebuild
                      (context as Element).markNeedsBuild();
                    },
                  );
                },
              ),
            ),
            actions: [
              TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Done')),
            ],
          );
        },
      ),
    );
  }
}
