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
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150 select-none">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="w-full sm:max-w-md bg-[#061817]/95 border border-teal-500/25 rounded-t-3xl sm:rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] p-5 z-10 max-h-[85vh] flex flex-col animate-in slide-in-from-bottom-6 duration-200 backdrop-blur-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-teal-500/15 shrink-0">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-[#19E6C8]" />
            <h3 className="text-base font-bold text-white font-display">Record Templates</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-[#94B5B0] hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Save Current as Template Action */}
        {currentDraft && currentDraft.amountPaise > 0 && (
          <div className="my-3 p-3 rounded-2xl bg-[#030707] border border-teal-500/15">
            {isSavingDraft ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Template Name (e.g. Swiggy Lunch, Metro)"
                  autoFocus
                  className="w-full px-3 py-2 rounded-xl bg-[#061817] border border-teal-500/25 text-xs text-white placeholder-[#5B7B76] focus:outline-none focus:border-[#19E6C8]"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsSavingDraft(false)}
                    className="flex-1 py-1.5 rounded-lg bg-[#061817] text-[#94B5B0] hover:text-white text-xs font-semibold border border-teal-500/15 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveCurrentAsTemplate}
                    disabled={!templateName.trim()}
                    className="flex-1 py-1.5 rounded-lg bg-[#19E6C8] hover:bg-[#2DD4BF] disabled:opacity-40 text-[#030807] text-xs font-bold shadow-[0_0_12px_rgba(25,230,200,0.35)] cursor-pointer"
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
                className="w-full py-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-[#19E6C8] border border-teal-500/25 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer font-mono"
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
            <div className="py-12 text-center text-xs text-[#5B7B76]">
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
                  className="p-3 rounded-2xl glass-card bg-[#061817]/60 hover:bg-teal-950/30 border border-teal-500/15 hover:border-teal-400/40 cursor-pointer flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border"
                      style={{
                        backgroundColor: `${cat?.color || '#19E6C8'}22`,
                        borderColor: `${cat?.color || '#19E6C8'}40`,
                        boxShadow: `0 0 8px ${cat?.color || '#19E6C8'}30`,
                      }}
                    >
                      <DynamicIcon
                        name={cat?.icon || 'Tag'}
                        className="w-4 h-4"
                        color={cat?.color || '#19E6C8'}
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-white truncate">
                        {tmpl.name}
                      </span>
                      <span className="text-[11px] text-[#94B5B0] font-mono">
                        {wal?.name} • {cat?.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-bold font-mono text-white">
                      {formatInr(tmpl.amountPaise, opts)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTemplate(tmpl.id, tmpl.name);
                      }}
                      className="p-1 rounded text-[#5B7B76] hover:text-[#FF6B6B] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
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
