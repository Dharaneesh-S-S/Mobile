import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultType);
      setSearchQuery('');
    }
  }, [isOpen, defaultType]);

  if (!isOpen) return null;

  const filteredCategories = categories
    .filter((c) => c.type === activeTab)
    .filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase().trim()))
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="fixed inset-0 z-50 bg-[#030707] flex flex-col text-[#F4FFFD] animate-in slide-in-from-right duration-200 ambient-bg-grid select-none">
      {/* Header: Back arrow, Title, Search, Gear icon */}
      <div className="px-4 py-3.5 border-b border-teal-500/20 flex items-center justify-between shrink-0 bg-[#061817]/90 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1 -ml-1 rounded-lg text-[#94B5B0] hover:text-white transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-base font-bold text-white font-display">Select Category</h2>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowSearch((prev) => !prev)}
            className="p-2 rounded-xl text-[#94B5B0] hover:text-white hover:bg-teal-950/40 transition-colors cursor-pointer"
            title="Filter categories"
            aria-label="Filter categories"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            onClick={openCategoryManager}
            className="p-2 rounded-xl text-[#94B5B0] hover:text-white hover:bg-teal-950/40 transition-colors cursor-pointer"
            title="Manage categories"
            aria-label="Manage categories"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search Input Bar (when toggled) */}
      {showSearch && (
        <div className="px-4 py-2 border-b border-teal-500/15 bg-[#061817]/80 flex items-center gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories..."
            autoFocus
            className="w-full px-3 py-1.5 rounded-xl bg-[#030707] border border-teal-500/25 text-xs text-white placeholder-[#5B7B76] focus:outline-none focus:border-[#19E6C8]"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-[#5B7B76] hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Two Tabs: INCOME and EXPENSE */}
      <div className="flex border-b border-teal-500/15 text-xs font-semibold shrink-0 bg-[#061817]/70 backdrop-blur-md">
        <button
          onClick={() => setActiveTab('expense')}
          className={`flex-1 py-3 text-center border-b-2 transition-all cursor-pointer font-mono ${
            activeTab === 'expense'
              ? 'border-[#FF6B6B] text-[#FF6B6B] font-bold bg-[#FF6B6B]/10 shadow-[inset_0_-2px_10px_rgba(255,107,107,0.15)]'
              : 'border-transparent text-[#94B5B0] hover:text-white'
          }`}
        >
          EXPENSE
        </button>
        <button
          onClick={() => setActiveTab('income')}
          className={`flex-1 py-3 text-center border-b-2 transition-all cursor-pointer font-mono ${
            activeTab === 'income'
              ? 'border-[#19E6C8] text-[#19E6C8] font-bold bg-teal-500/10 shadow-[inset_0_-2px_10px_rgba(25,230,200,0.15)]'
              : 'border-transparent text-[#94B5B0] hover:text-white'
          }`}
        >
          INCOME
        </button>
      </div>

      {/* Categories List */}
      <div className="flex-1 overflow-y-auto divide-y divide-teal-500/10">
        {filteredCategories.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#5B7B76]">
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
                className={`flex items-center justify-between px-5 py-3.5 hover:bg-teal-950/25 active:bg-teal-950/40 cursor-pointer transition-colors ${
                  isSelected ? 'bg-teal-500/15 border-l-2 border-[#19E6C8]' : ''
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border"
                    style={{
                      backgroundColor: `${cat.color}22`,
                      borderColor: `${cat.color}40`,
                      boxShadow: `0 0 10px ${cat.color}30`,
                    }}
                  >
                    <DynamicIcon name={cat.icon} className="w-5 h-5" color={cat.color} />
                  </div>
                  <span className="text-sm font-semibold text-white truncate">{cat.name}</span>
                </div>

                {/* Radio / Check mark */}
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-[#19E6C8] text-[#030807] shadow-[0_0_10px_#19E6C8]'
                      : 'border border-teal-500/30 bg-[#061817]'
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
