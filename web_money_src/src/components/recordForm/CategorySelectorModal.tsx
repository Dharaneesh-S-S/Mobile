import React, { useState } from 'react';
import { ArrowLeft, Search, Settings, Check, X } from 'lucide-react';
import { Category, TransactionType } from '../../types/money';
import { useMoney } from '../../context/MoneyContext';
import { DynamicIcon } from '../common/IconHelper';

interface CategorySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategoryId: string;
  onSelectCategory: (cat: Category) => void;
  defaultType?: 'expense' | 'income';
}

export const CategorySelectorModal: React.FC<CategorySelectorModalProps> = ({
  isOpen,
  onClose,
  selectedCategoryId,
  onSelectCategory,
  defaultType = 'expense',
}) => {
  const { categories, openCategoryManager } = useMoney();

  const [activeTab, setActiveTab] = useState<'expense' | 'income'>(defaultType);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearch, setShowSearch] = useState<boolean>(false);

  if (!isOpen) return null;

  const filteredCategories = categories
    .filter((c) => c.type === activeTab)
    .filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase().trim()))
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="fixed inset-0 z-50 bg-[#090d16] flex flex-col text-slate-100 animate-in slide-in-from-right duration-200">
      {/* Header: Back arrow, Title, Search, Gear icon */}
      <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-950/70">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1 -ml-1 rounded-lg text-slate-400 hover:text-white"
            aria-label="Back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-base font-bold text-white font-display">Select Category</h2>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowSearch((prev) => !prev)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            title="Filter categories"
            aria-label="Filter categories"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            onClick={openCategoryManager}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            title="Manage categories"
            aria-label="Manage categories"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search Input Bar (when toggled) */}
      {showSearch && (
        <div className="px-4 py-2 border-b border-slate-800 bg-slate-900/60 flex items-center gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories..."
            autoFocus
            className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Two Tabs: INCOME and EXPENSE */}
      <div className="flex border-b border-slate-800 text-xs font-semibold shrink-0 bg-[#090d16]">
        <button
          onClick={() => setActiveTab('expense')}
          className={`flex-1 py-3 text-center border-b-2 transition-all ${
            activeTab === 'expense'
              ? 'border-red-500 text-red-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          EXPENSE
        </button>
        <button
          onClick={() => setActiveTab('income')}
          className={`flex-1 py-3 text-center border-b-2 transition-all ${
            activeTab === 'income'
              ? 'border-blue-500 text-blue-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          INCOME
        </button>
      </div>

      {/* Categories List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
        {filteredCategories.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500">
            No categories matching "{searchQuery}".
          </div>
        ) : (
          filteredCategories.map((cat) => {
            const isSelected = cat.id === selectedCategoryId;
            return (
              <div
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat);
                  onClose();
                }}
                className={`flex items-center justify-between px-5 py-3 hover:bg-slate-800/40 active:bg-slate-800 cursor-pointer transition-colors ${
                  isSelected ? 'bg-blue-900/15' : ''
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm"
                    style={{
                      backgroundColor: `${cat.color}22`,
                      border: `1.5px solid ${cat.color}`,
                    }}
                  >
                    <DynamicIcon name={cat.icon} className="w-5 h-5" color={cat.color} />
                  </div>
                  <span className="text-sm font-semibold text-slate-100 truncate">{cat.name}</span>
                </div>

                {/* Radio / Check mark */}
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-glow-blue'
                      : 'border border-slate-700 bg-slate-800/50'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
