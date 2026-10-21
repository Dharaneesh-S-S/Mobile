import React, { useState } from 'react';
import { X, Bookmark, Trash2, Plus, Check } from 'lucide-react';
import { db } from '../../db';
import { Template } from '../../types/money';
import { useMoney } from '../../context/MoneyContext';
import { formatInr } from '../../utils/currency';
import { DynamicIcon } from '../common/IconHelper';

interface TemplateManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate: (tmpl: Template) => void;
  currentDraft?: {
    type: 'income' | 'expense' | 'transfer';
    amountPaise: number;
    description: string;
    categoryId: string;
    walletId: string;
  };
}

export const TemplateManagerModal: React.FC<TemplateManagerModalProps> = ({
  isOpen,
  onClose,
  onApplyTemplate,
  currentDraft,
}) => {
  const { templates, categories, wallets, currentAccount, showToast, settings } = useMoney();
  const [templateName, setTemplateName] = useState<string>('');
  const [isSavingDraft, setIsSavingDraft] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSaveCurrentAsTemplate = async () => {
    if (!currentDraft || !templateName.trim()) return;

    const newTemplate: Template = {
      id: `tmpl-${Date.now()}`,
      accountId: currentAccount?.id || 'acc-personal',
      name: templateName.trim(),
      type: currentDraft.type,
      amountPaise: currentDraft.amountPaise,
      description: currentDraft.description,
      categoryId: currentDraft.categoryId,
      walletId: currentDraft.walletId,
    };

    await db.templates.put(newTemplate);
    showToast({ type: 'success', text: `Saved template "${templateName}"` });
    setTemplateName('');
    setIsSavingDraft(false);
  };

  const handleDeleteTemplate = async (id: string, name: string) => {
    await db.templates.delete(id);
    showToast({ type: 'info', text: `Deleted template "${name}"` });
  };

  const opts = {
    showDecimals: settings.showDecimals,
    useInternationalGrouping: settings.numberGrouping === 'intl',
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="w-full sm:max-w-md bg-slate-900 border border-slate-700/80 rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 z-10 max-h-[85vh] flex flex-col animate-in slide-in-from-bottom-6 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-white font-display">Record Templates</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Save Current as Template Action */}
        {currentDraft && currentDraft.amountPaise > 0 && (
          <div className="my-3 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            {isSavingDraft ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Template Name (e.g. Swiggy Lunch, Metro)"
                  autoFocus
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsSavingDraft(false)}
                    className="flex-1 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveCurrentAsTemplate}
                    disabled={!templateName.trim()}
                    className="flex-1 py-1.5 rounded-lg bg-blue-600 disabled:opacity-40 text-white text-xs font-semibold shadow-glow-blue"
                  >
                    Save Template
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setTemplateName(currentDraft.description || '');
                  setIsSavingDraft(true);
                }}
                className="w-full py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Save Current Form as Template</span>
              </button>
            )}
          </div>
        )}

        {/* Templates List */}
        <div className="flex-1 overflow-y-auto space-y-2 py-1">
          {templates.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No saved templates yet. Fill the record form and save it as a template for one-tap entry!
            </div>
          ) : (
            templates.map((tmpl) => {
              const cat = categories.find((c) => c.id === tmpl.categoryId);
              const wal = wallets.find((w) => w.id === tmpl.walletId);
              return (
                <div
                  key={tmpl.id}
                  onClick={() => {
                    onApplyTemplate(tmpl);
                    onClose();
                  }}
                  className="p-3 rounded-2xl bg-slate-800/40 hover:bg-slate-800 active:bg-slate-750 border border-slate-700/40 cursor-pointer flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: `${cat?.color || '#3b82f6'}22`,
                        border: `1.5px solid ${cat?.color || '#3b82f6'}`,
                      }}
                    >
                      <DynamicIcon
                        name={cat?.icon || 'Tag'}
                        className="w-4 h-4"
                        color={cat?.color || '#3b82f6'}
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-slate-100 truncate">
                        {tmpl.name}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {wal?.name} • {cat?.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-bold font-display text-slate-100">
                      {formatInr(tmpl.amountPaise, opts)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTemplate(tmpl.id, tmpl.name);
                      }}
                      className="p-1 rounded text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Delete template"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
