import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  Check,
  Palette,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { db } from '../../db';
import { Category } from '../../types/money';
import { useMoney } from '../../context/MoneyContext';
import { CATEGORY_ICON_LIST, COLOR_PALETTE, DynamicIcon } from '../common/IconHelper';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { categories, showToast } = useMoney();

  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);

  // Form states
  const [name, setName] = useState<string>('');
  const [icon, setIcon] = useState<string>('Tag');
  const [color, setColor] = useState<string>('#3b82f6');
  const [parentId, setParentId] = useState<string>('');
  const [iconSearch, setIconSearch] = useState<string>('');
  const [showIconPicker, setShowIconPicker] = useState<boolean>(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [reassignTargetCatId, setReassignTargetCatId] = useState<string>('');

  if (!isOpen) return null;

  const currentList = categories
    .filter((c) => c.type === activeTab)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const startEdit = (cat: Category) => {
    setEditingCategory(cat);
    setIsCreatingNew(false);
    setName(cat.name);
    setIcon(cat.icon);
    setColor(cat.color);
    setParentId(cat.parentId || '');
  };

  const startNew = () => {
    setIsCreatingNew(true);
    setEditingCategory(null);
    setName('');
    setIcon('Tag');
    setColor(activeTab === 'expense' ? '#ef4444' : '#3b82f6');
    setParentId('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isCreatingNew) {
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name: name.trim(),
        type: activeTab,
        icon,
        color,
        parentId: parentId || undefined,
        order: currentList.length + 1,
      };
      await db.categories.put(newCat);
      showToast({ type: 'success', text: `Created category ${name}` });
    } else if (editingCategory) {
      await db.categories.update(editingCategory.id, {
        name: name.trim(),
        icon,
        color,
        parentId: parentId || undefined,
      });
      showToast({ type: 'success', text: `Updated category ${name}` });
    }

    setEditingCategory(null);
    setIsCreatingNew(false);
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;

    // If reassigning records
    if (reassignTargetCatId) {
      const affected = await db.records.where('categoryId').equals(categoryToDelete.id).toArray();
      await Promise.all(affected.map((r) => db.records.update(r.id, { categoryId: reassignTargetCatId })));
    }

    await db.categories.delete(categoryToDelete.id);
    showToast({ type: 'info', text: `Deleted ${categoryToDelete.name}` });
    setCategoryToDelete(null);
    setReassignTargetCatId('');
  };

  // Filter 60+ icons by query
  const filteredIcons = CATEGORY_ICON_LIST.filter((ic) =>
    ic.toLowerCase().includes(iconSearch.toLowerCase().trim())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150 select-none">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="w-full sm:max-w-md bg-[#061817]/95 border border-teal-500/25 rounded-t-3xl sm:rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] p-5 z-10 max-h-[88vh] flex flex-col animate-in slide-in-from-bottom-6 duration-200 backdrop-blur-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-teal-500/15 shrink-0">
          <div>
            <h3 className="text-base font-bold text-white font-display">Manage Categories</h3>
            <p className="text-xs text-[#94B5B0]">Add, edit icons, color & subcategories</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-[#94B5B0] hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-teal-500/15 text-xs font-semibold my-2 shrink-0 font-mono">
          <button
            onClick={() => {
              setActiveTab('expense');
              setEditingCategory(null);
              setIsCreatingNew(false);
            }}
            className={`flex-1 py-2 text-center border-b-2 transition-all cursor-pointer ${activeTab === 'expense'
              ? 'border-[#FF6B6B] text-[#FF6B6B] font-bold bg-[#FF6B6B]/10 shadow-[inset_0_-2px_10px_rgba(255,107,107,0.15)]'
              : 'border-transparent text-[#94B5B0] hover:text-white'
              }`}
          >
            EXPENSE ({categories.filter((c) => c.type === 'expense').length})
          </button>
          <button
            onClick={() => {
              setActiveTab('income');
              setEditingCategory(null);
              setIsCreatingNew(false);
            }}
            className={`flex-1 py-2 text-center border-b-2 transition-all cursor-pointer ${activeTab === 'income'
              ? 'border-[#19E6C8] text-[#19E6C8] font-bold bg-teal-500/10 shadow-[inset_0_-2px_10px_rgba(25,230,200,0.15)]'
              : 'border-transparent text-[#94B5B0] hover:text-white'
              }`}
          >
            INCOME ({categories.filter((c) => c.type === 'income').length})
          </button>
        </div>

        {/* Form Modal when editing or adding */}
        {(isCreatingNew || editingCategory) ? (
          <form onSubmit={handleSave} className="flex-1 overflow-y-auto space-y-4 py-2">
            <h4 className="text-sm font-bold text-white">
              {isCreatingNew ? 'Add Category' : `Edit ${editingCategory?.name}`}
            </h4>

            {/* Name */}
            <div>
              <label className="text-xs font-mono text-[#94B5B0] uppercase font-bold block mb-1">Category Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Groceries, Gym, OTT"
                required
                className="w-full px-3.5 py-2 rounded-xl bg-[#030707] border border-teal-500/25 text-xs text-white placeholder-[#5B7B76] focus:outline-none focus:border-[#19E6C8]"
              />
            </div>

            {/* Icon & Color Selector row */}
            <div className="grid grid-cols-2 gap-3">
              {/* Selected Icon Trigger */}
              <div>
                <label className="text-xs font-mono text-[#94B5B0] uppercase font-bold block mb-1">Icon (60+ available)</label>
                <button
                  type="button"
                  onClick={() => setShowIconPicker((prev) => !prev)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-[#030707] border border-teal-500/25 text-xs text-white hover:bg-teal-950/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <DynamicIcon name={icon} className="w-4 h-4" color={color} />
                    <span className="truncate">{icon}</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-[#94B5B0]" />
                </button>
              </div>

              {/* Color Preview */}
              <div>
                <label className="text-xs font-mono text-[#94B5B0] uppercase font-bold block mb-1">Color</label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#030707] border border-teal-500/25">
                  <div className="w-4 h-4 rounded-full shrink-0 shadow-[0_0_6px]" style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}80` }} />
                  <span className="text-xs text-[#94B5B0] font-mono">{color}</span>
                </div>
              </div>
            </div>

            {/* Color Palette Grid */}
            <div>
              <label className="text-[11px] font-mono text-[#94B5B0] uppercase font-bold block mb-1.5">Pick Color</label>
              <div className="flex flex-wrap gap-2">
                {COLOR_PALETTE.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${color === c ? 'scale-125 ring-2 ring-[#19E6C8] shadow-[0_0_8px_#19E6C8]' : 'hover:scale-110'
                      }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {/* Icon Picker Popover */}
            {showIconPicker && (
              <div className="p-3 bg-[#030707] rounded-2xl border border-teal-500/25 space-y-2">
                <input
                  type="text"
                  value={iconSearch}
                  onChange={(e) => setIconSearch(e.target.value)}
                  placeholder="Search 60+ icons..."
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#061817] border border-teal-500/25 text-xs text-white placeholder-[#5B7B76] focus:outline-none focus:border-[#19E6C8]"
                />
                <div className="grid grid-cols-6 gap-2 max-h-40 overflow-y-auto p-1">
                  {filteredIcons.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => {
                        setIcon(ic);
                        setShowIconPicker(false);
                      }}
                      className={`p-2 rounded-xl flex items-center justify-center transition-all cursor-pointer ${icon === ic ? 'bg-[#19E6C8] text-[#030807] shadow-[0_0_10px_#19E6C8]' : 'bg-[#061817] hover:bg-teal-950/40 text-[#94B5B0]'
                        }`}
                      title={ic}
                    >
                      <DynamicIcon name={ic} className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Parent Category (Optional for sub-categories) */}
            <div>
              <label className="text-xs font-mono text-[#94B5B0] uppercase font-bold block mb-1">
                Parent Category (Optional sub-category)
              </label>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#030707] border border-teal-500/25 text-xs text-white focus:outline-none focus:border-[#19E6C8]"
              >
                <option value="">None (Top Level)</option>
                {currentList
                  .filter((c) => !editingCategory || c.id !== editingCategory.id)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Form Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setEditingCategory(null);
                  setIsCreatingNew(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#030707] hover:bg-teal-950/40 border border-teal-500/20 text-[#94B5B0] hover:text-white text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#19E6C8] hover:bg-[#2DD4BF] text-[#030807] text-xs font-bold shadow-[0_0_15px_rgba(25,230,200,0.4)] cursor-pointer"
              >
                Save
              </button>
            </div>
          </form>
        ) : (
          /* List of Categories with Edit / Delete actions */
          <div className="flex-1 overflow-y-auto space-y-1.5 py-1">
            <div className="flex justify-between items-center px-1 mb-2">
              <span className="text-xs font-mono font-bold text-[#94B5B0] uppercase tracking-wider">Categories</span>
              <button
                onClick={startNew}
                className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-[#19E6C8] text-[#030807] hover:bg-[#2DD4BF] transition-all shadow-[0_0_10px_rgba(25,230,200,0.3)] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add Category</span>
              </button>
            </div>

            {currentList.map((cat) => (
              <div
                key={cat.id}
                className="p-2.5 rounded-2xl glass-card bg-[#061817]/60 border border-teal-500/15 hover:border-teal-400/40 flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border"
                    style={{
                      backgroundColor: `${cat.color}22`,
                      borderColor: `${cat.color}40`,
                      boxShadow: `0 0 6px ${cat.color}30`,
                    }}
                  >
                    <DynamicIcon name={cat.icon} className="w-4 h-4" color={cat.color} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-white truncate">{cat.name}</span>
                    {cat.parentId && (
                      <span className="text-[10px] text-[#5B7B76]">
                        Sub of: {categories.find((c) => c.id === cat.parentId)?.name || 'Parent'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => startEdit(cat)}
                    className="p-1.5 rounded-lg text-[#94B5B0] hover:text-white hover:bg-teal-950/40 transition-colors cursor-pointer"
                    title="Edit category"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setCategoryToDelete(cat);
                      // default reassign to another category of same type
                      const other = categories.find((c) => c.id !== cat.id && c.type === cat.type);
                      setReassignTargetCatId(other?.id || '');
                    }}
                    className="p-1.5 rounded-lg text-[#94B5B0] hover:text-[#FF6B6B] hover:bg-teal-950/40 transition-colors cursor-pointer"
                    title="Delete category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation & Reassign Prompt */}
        {categoryToDelete && (
          <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-xs bg-[#061817]/95 border border-teal-500/25 rounded-2xl p-4 shadow-2xl space-y-3 backdrop-blur-2xl">
              <h4 className="text-sm font-bold text-white">Delete "{categoryToDelete.name}"?</h4>
              <p className="text-xs text-[#94B5B0] leading-relaxed">
                Reassign existing transactions to another category:
              </p>
              <select
                value={reassignTargetCatId}
                onChange={(e) => setReassignTargetCatId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#030707] border border-teal-500/25 text-xs text-white focus:outline-none focus:border-[#19E6C8]"
              >
                {categories
                  .filter((c) => c.id !== categoryToDelete.id && c.type === categoryToDelete.type)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setCategoryToDelete(null)}
                  className="flex-1 py-2 rounded-xl bg-[#030707] border border-teal-500/20 text-xs font-semibold text-[#94B5B0] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteCategory}
                  className="flex-1 py-2 rounded-xl bg-[#FF6B6B] hover:bg-[#ff8585] text-xs font-bold text-[#030807] shadow-[0_0_12px_rgba(255,107,107,0.4)] cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
      </div >
    </div >
  );
};
