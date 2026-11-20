import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ArrowLeft,
  ChevronDown,
  Calendar,
  Clock,
  Camera,
  X,
  Plus,
  Bookmark,
  Check,
  AlertCircle,
  HelpCircle,
  PiggyBank,
} from 'lucide-react';
import { useMoney } from '../../context/MoneyContext';
import { Category, Wallet, TransactionType, Template, Budget } from '../../types/money';
import { formatInr, rupeesToPaise, paiseToRupees } from '../../utils/currency';
import { DynamicIcon } from '../common/IconHelper';
import { CalculatorKeypad } from './CalculatorKeypad';
import { CategorySelectorModal } from './CategorySelectorModal';
import { WalletSelectorModal } from './WalletSelectorModal';
import { TemplateManagerModal } from './TemplateManagerModal';
import { BudgetSelectorModal } from './BudgetSelectorModal';

export const AddRecordModal: React.FC = () => {
  const {
    addRecordOptions,
    closeAddRecord,
    addRecord,
    updateRecord,
    categories,
    wallets,
    walletBalances,
    records,
    currentAccount,
    budgets,
    openBudgetModal,
    showToast,
    settings,
  } = useMoney();

  if (!addRecordOptions) return null;

  const isEditing = !!addRecordOptions.recordToEdit;
  const initialRecord = addRecordOptions.recordToEdit;

  // Active Tab: Income, Expense, Transfer
  const [activeType, setActiveType] = useState<TransactionType>(
    initialRecord ? initialRecord.type : addRecordOptions.type || 'expense'
  );

  // Form Fields
  const [amountInput, setAmountInput] = useState<string>(
    initialRecord ? (initialRecord.amountPaise / 100).toString() : '0'
  );
  const [showCalculator, setShowCalculator] = useState<boolean>(!isEditing);
  const [dateTime, setDateTime] = useState<string>(
    initialRecord ? initialRecord.dateTime : addRecordOptions.date || new Date().toISOString()
  );
  const [description, setDescription] = useState<string>(initialRecord ? initialRecord.description : '');
  const [categoryId, setCategoryId] = useState<string>(
    initialRecord
      ? initialRecord.categoryId
      : categories.find((c) => c.type === (addRecordOptions.type || 'expense'))?.id || ''
  );
  const [walletId, setWalletId] = useState<string>(
    initialRecord ? initialRecord.walletId : settings.defaultWalletId || wallets[0]?.id || ''
  );
  const [toWalletId, setToWalletId] = useState<string>(
    initialRecord ? initialRecord.toWalletId || '' : wallets[1]?.id || ''
  );
  const [selectedBudgetIds, setSelectedBudgetIds] = useState<string[]>(
    initialRecord?.budgetIds || []
  );
  const [budgetModalOpen, setBudgetModalOpen] = useState<boolean>(false);
  const [hasFee, setHasFee] = useState<boolean>(!!initialRecord?.feePaise && initialRecord.feePaise > 0);
  const [feeInput, setFeeInput] = useState<string>(
    initialRecord?.feePaise ? (initialRecord.feePaise / 100).toString() : '0'
  );
  const [memo, setMemo] = useState<string>(initialRecord?.memo || '');
  const [imageBlobs, setImageBlobs] = useState<string[]>(initialRecord?.imageBlobs || []);
  const [tags, setTags] = useState<string[]>(initialRecord?.tags || []);

  // Modals for sub-selection
  const [categoryModalOpen, setCategoryModalOpen] = useState<boolean>(false);
  const [walletModalMode, setWalletModalMode] = useState<'from' | 'to' | null>(null);
  const [templateModalOpen, setTemplateModalOpen] = useState<boolean>(false);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Autocomplete suggestions
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const suggestions = useMemo(() => {
    if (!description.trim()) return [];
    const q = description.toLowerCase().trim();
    const seen = new Set<string>();
    const list: { description: string; categoryId: string; walletId: string; amountPaise: number }[] = [];

    for (const r of records) {
      if (r.type === activeType && r.description.toLowerCase().includes(q)) {
        if (!seen.has(r.description.toLowerCase())) {
          seen.add(r.description.toLowerCase());
          list.push({
            description: r.description,
            categoryId: r.categoryId,
            walletId: r.walletId,
            amountPaise: r.amountPaise,
          });
          if (list.length >= 4) break;
        }
      }
    }
    return list;
  }, [description, records, activeType]);

  // Adjust category when type changes
  useEffect(() => {
    const targetType = activeType === 'transfer' ? 'expense' : activeType;
    const currentCat = categories.find((c) => c.id === categoryId);
    if (!currentCat || currentCat.type !== targetType) {
      const match = categories.find((c) => c.type === targetType);
      if (match) {
        setCategoryId(match.id);
      }
    }
  }, [activeType, categories, categoryId]);

  // Auto-suggest matching budgets for new transactions when category changes
  useEffect(() => {
    if (!isEditing && (!initialRecord?.budgetIds || initialRecord.budgetIds.length === 0)) {
      const matches = budgets
        .filter((b) => b.categoryIds.length === 0 || b.categoryIds.includes(categoryId))
        .map((b) => b.id);
      setSelectedBudgetIds(matches);
    }
  }, [categoryId, isEditing, budgets]);

  const selectedCategory = categories.find((c) => c.id === categoryId);
  const selectedWallet = wallets.find((w) => w.id === walletId);
  const selectedToWallet = wallets.find((w) => w.id === toWalletId);

  const amountPaise = rupeesToPaise(parseFloat(amountInput) || 0);
  const feePaise = hasFee ? rupeesToPaise(parseFloat(feeInput) || 0) : 0;

  // Validation
  const isValid =
    amountPaise > 0 &&
    (activeType === 'transfer' ? walletId !== toWalletId && !!walletId && !!toWalletId : !!categoryId && !!walletId);

  const handleSave = async (andAddAnother: boolean = false) => {
    if (!isValid) return;

    const recordPayload = {
      accountId: currentAccount?.id || 'acc-personal',
      type: activeType,
      amountPaise,
      dateTime,
      description: description.trim() || (activeType === 'transfer' ? 'Transfer' : selectedCategory?.name || 'Transaction'),
      categoryId: activeType === 'transfer' ? categories.find((c) => c.name.toLowerCase() === 'fees')?.id || categoryId : categoryId,
      walletId,
      toWalletId: activeType === 'transfer' ? toWalletId : undefined,
      feePaise: activeType === 'transfer' ? feePaise : undefined,
      memo: memo.trim() || undefined,
      imageBlobs: imageBlobs.length > 0 ? imageBlobs : undefined,
      tags: tags.length > 0 ? tags : undefined,
      budgetIds: selectedBudgetIds.length > 0 ? selectedBudgetIds : undefined,
    };

    if (isEditing && initialRecord) {
      await updateRecord(initialRecord.id, recordPayload);
      closeAddRecord();
    } else {
      await addRecord(recordPayload);
      if (andAddAnother) {
        setAmountInput('0');
        setDescription('');
        setMemo('');
        setImageBlobs([]);
        setSelectedBudgetIds([]);
        setShowCalculator(true);
        showToast({ type: 'info', text: 'Saved! Ready for next record' });
      } else {
        closeAddRecord();
      }
    }
  };

  // Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImageBlobs((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Template autofill
  const handleApplyTemplate = (tmpl: Template) => {
    setActiveType(tmpl.type);
    setAmountInput((tmpl.amountPaise / 100).toString());
    setDescription(tmpl.description);
    setCategoryId(tmpl.categoryId);
    setWalletId(tmpl.walletId);
    if (tmpl.toWalletId) setToWalletId(tmpl.toWalletId);
    if (tmpl.memo) setMemo(tmpl.memo);
    setShowCalculator(false);
  };

  const opts = {
    showDecimals: settings.showDecimals,
    useInternationalGrouping: settings.numberGrouping === 'intl',
  };

  // Format date time for display
  const d = new Date(dateTime);
  const formattedDateTimeStr = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  return (
    <div className="fixed inset-0 z-50 bg-[#030707] flex flex-col text-[#F4FFFD] animate-in slide-in-from-bottom-8 duration-200 ambient-bg-grid select-none">
      {/* 1. Header: Back, Title, Save */}
      <div className="px-4 py-3 border-b border-teal-500/20 flex items-center justify-between shrink-0 bg-[#061817]/90 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={closeAddRecord}
            className="p-1 -ml-1 rounded-lg text-[#94B5B0] hover:text-white transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-base font-bold text-white font-display capitalize">
            {isEditing ? `Edit ${activeType}` : activeType}
          </h2>
        </div>

        {/* Save button (with long-press support for "Save and add another") */}
        <div className="flex items-center gap-2">
          {!isEditing && (
            <button
              type="button"
              onClick={() => handleSave(true)}
              disabled={!isValid}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-teal-500/10 border border-teal-500/20 hover:bg-teal-500/20 disabled:opacity-30 text-[#19E6C8] transition-all cursor-pointer"
              title="Save & Add Another"
            >
              + Another
            </button>
          )}
          <button
            onClick={() => handleSave(false)}
            disabled={!isValid}
            className={`text-xs font-extrabold px-4 py-2 rounded-xl transition-all shadow-md cursor-pointer ${
              isValid
                ? activeType === 'income'
                  ? 'bg-[#19E6C8] hover:bg-[#2DD4BF] text-[#030807] shadow-[0_0_20px_rgba(25,230,200,0.45)]'
                  : activeType === 'expense'
                  ? 'bg-[#FF6B6B] hover:bg-[#ff8585] text-[#030807] shadow-[0_0_20px_rgba(255,107,107,0.45)]'
                  : 'bg-[#19E6C8] hover:bg-[#2DD4BF] text-[#030807] shadow-[0_0_20px_rgba(25,230,200,0.45)]'
                : 'bg-teal-950/40 border border-teal-500/10 text-[#5B7B76] cursor-not-allowed opacity-50'
            }`}
          >
            SAVE
          </button>
        </div>
      </div>

      {/* 2. Type Tabs: Income, Expense, Transfer */}
      <div className="flex border-b border-teal-500/15 text-xs font-semibold shrink-0 bg-[#061817]/70 backdrop-blur-md">
        <button
          onClick={() => {
            setActiveType('income');
            const incCat = categories.find((c) => c.type === 'income');
            const curCat = categories.find((c) => c.id === categoryId);
            if (incCat && (!curCat || curCat.type !== 'income')) {
              setCategoryId(incCat.id);
            }
          }}
          className={`flex-1 py-3 text-center border-b-2 transition-all cursor-pointer ${
            activeType === 'income'
              ? 'border-[#19E6C8] text-[#19E6C8] font-bold bg-teal-500/10 shadow-[inset_0_-2px_10px_rgba(25,230,200,0.15)]'
              : 'border-transparent text-[#94B5B0] hover:text-white'
          }`}
        >
          Income
        </button>
        <button
          onClick={() => {
            setActiveType('expense');
            const expCat = categories.find((c) => c.type === 'expense');
            const curCat = categories.find((c) => c.id === categoryId);
            if (expCat && (!curCat || curCat.type !== 'expense')) {
              setCategoryId(expCat.id);
            }
          }}
          className={`flex-1 py-3 text-center border-b-2 transition-all cursor-pointer ${
            activeType === 'expense'
              ? 'border-[#FF6B6B] text-[#FF6B6B] font-bold bg-[#FF6B6B]/10 shadow-[inset_0_-2px_10px_rgba(255,107,107,0.15)]'
              : 'border-transparent text-[#94B5B0] hover:text-white'
          }`}
        >
          Expense
        </button>
        <button
          onClick={() => setActiveType('transfer')}
          className={`flex-1 py-3 text-center border-b-2 transition-all cursor-pointer ${
            activeType === 'transfer'
              ? 'border-[#38BDF8] text-[#38BDF8] font-bold bg-[#38BDF8]/10 shadow-[inset_0_-2px_10px_rgba(56,189,248,0.15)]'
              : 'border-transparent text-[#94B5B0] hover:text-white'
          }`}
        >
          Transfer
        </button>
      </div>

      {/* 3. Form Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {/* Amount Field & Dropdown Keypad Trigger */}
        <div
          onClick={() => setShowCalculator((prev) => !prev)}
          className="p-4 rounded-2xl glass-card bg-[#061817] border border-teal-500/25 hover:border-teal-400/50 cursor-pointer flex items-center justify-between transition-all group"
        >
          <div className="flex flex-col">
            <span className="text-[11px] font-mono text-[#94B5B0] uppercase tracking-wider font-bold">
              Amount
            </span>
            <div className="flex items-baseline gap-1 mt-1 font-mono">
              <span className="text-xl font-bold text-[#5B7B76]">₹</span>
              <span
                className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
                  activeType === 'income'
                    ? 'text-[#19E6C8] text-glow-teal'
                    : activeType === 'expense'
                    ? 'text-[#FF6B6B] text-glow-coral'
                    : 'text-[#38BDF8]'
                }`}
              >
                {amountInput || '0'}
              </span>
            </div>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-[#94B5B0] transition-transform ${
              showCalculator ? 'rotate-180 text-[#19E6C8]' : 'group-hover:text-white'
            }`}
          />
        </div>

        {/* Date & Time Field */}
        <div>
          <div
            onClick={() => setShowDatePicker(true)}
            className="w-full p-3 rounded-2xl glass-card bg-[#061817] border border-teal-500/20 flex items-center justify-between cursor-pointer hover:border-teal-400/40 transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Calendar className="w-4 h-4 text-[#19E6C8] shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-mono text-[#94B5B0] uppercase font-bold">Date & Time</span>
                <span className="text-xs font-semibold text-white truncate">
                  {formattedDateTimeStr}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Description Field with Autocomplete */}
        <div className="relative">
          <label className="text-[11px] font-mono text-[#94B5B0] block mb-1 uppercase font-bold tracking-wider">
            Short Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder={
              activeType === 'income'
                ? 'e.g. Salary, Dividend, Bonus'
                : activeType === 'expense'
                ? 'e.g. Grocery, Lunch, Metro recharge'
                : 'e.g. ATM cash withdrawal'
            }
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#030707] border border-teal-500/25 text-xs text-white placeholder-[#5B7B76] focus:outline-none focus:border-[#19E6C8] focus:shadow-[0_0_15px_rgba(25,230,200,0.2)] font-sans"
          />

          {/* Autocomplete Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-[#061817] border border-teal-500/30 rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.9)] overflow-hidden divide-y divide-teal-500/15 backdrop-blur-xl">
              {suggestions.map((sug, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setDescription(sug.description);
                    setCategoryId(sug.categoryId);
                    setWalletId(sug.walletId);
                    setAmountInput((sug.amountPaise / 100).toString());
                    setShowSuggestions(false);
                  }}
                  className="px-3.5 py-2 hover:bg-teal-950/40 cursor-pointer flex items-center justify-between text-xs transition-colors"
                >
                  <span className="text-[#F4FFFD] font-semibold">{sug.description}</span>
                  <span className="text-[#19E6C8] font-mono">
                    ₹{(sug.amountPaise / 100).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category, Wallet & Budget Dropdowns */}
        {activeType !== 'transfer' ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
            {/* Category Selector */}
            <div
              onClick={() => setCategoryModalOpen(true)}
              className="p-3 rounded-2xl glass-card bg-[#061817] border border-teal-500/20 hover:border-teal-400/40 cursor-pointer flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-[0_0_8px]"
                  style={{
                    backgroundColor: `${selectedCategory?.color || '#19E6C8'}22`,
                    border: `1.5px solid ${selectedCategory?.color || '#19E6C8'}`,
                    boxShadow: `0 0 8px ${selectedCategory?.color || '#19E6C8'}60`,
                  }}
                >
                  <DynamicIcon
                    name={selectedCategory?.icon || 'Tag'}
                    className="w-3.5 h-3.5"
                    color={selectedCategory?.color || '#19E6C8'}
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-mono text-[#94B5B0] uppercase font-bold">Category</span>
                  <span className="text-xs font-semibold text-white truncate">
                    {selectedCategory?.name || 'Select'}
                  </span>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-[#94B5B0]" />
            </div>

            {/* Wallet Selector */}
            <div
              onClick={() => setWalletModalMode('from')}
              className="p-3 rounded-2xl glass-card bg-[#061817] border border-teal-500/20 hover:border-teal-400/40 cursor-pointer flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-[0_0_8px]"
                  style={{
                    backgroundColor: `${selectedWallet?.color || '#19E6C8'}22`,
                    border: `1.5px solid ${selectedWallet?.color || '#19E6C8'}`,
                    boxShadow: `0 0 8px ${selectedWallet?.color || '#19E6C8'}60`,
                  }}
                >
                  <DynamicIcon
                    name={selectedWallet?.icon || 'Smartphone'}
                    className="w-3.5 h-3.5"
                    color={selectedWallet?.color || '#19E6C8'}
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-mono text-[#94B5B0] uppercase font-bold">Wallet</span>
                  <span className="text-xs font-semibold text-white truncate">
                    {selectedWallet?.name || 'Select'}
                  </span>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-[#94B5B0]" />
            </div>
          </div>

          {/* Budget Selector (Multiple Selection Allowed, Wallet is Single) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-mono text-[#94B5B0] flex items-center gap-1.5 uppercase font-bold tracking-wider">
                <PiggyBank className="w-3.5 h-3.5 text-[#19E6C8]" />
                <span>Budgets (Multi-select)</span>
              </label>
              <div className="flex items-center gap-2">
                {selectedBudgetIds.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedBudgetIds([])}
                    className="text-[10px] font-mono text-[#5B7B76] hover:text-[#94B5B0] transition-colors cursor-pointer"
                  >
                    Clear all
                  </button>
                )}
                {budgets.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedBudgetIds(budgets.map((b) => b.id))}
                    className="text-[10px] font-mono text-[#19E6C8] hover:underline transition-colors cursor-pointer font-bold"
                  >
                    Select all
                  </button>
                )}
              </div>
            </div>

            {/* Clickable Budget Summary Card */}
            <div
              onClick={() => setBudgetModalOpen(true)}
              className="p-3 rounded-2xl glass-card bg-[#061817] border border-teal-500/20 hover:border-teal-400/50 cursor-pointer flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="w-7 h-7 rounded-full bg-teal-500/15 border border-teal-500/30 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(25,230,200,0.2)]">
                  <PiggyBank className="w-3.5 h-3.5 text-[#19E6C8]" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[10px] font-mono text-[#94B5B0] uppercase font-bold">Assigned Budgets</span>
                  {selectedBudgetIds.length === 0 ? (
                    <span className="text-xs text-[#5B7B76]">
                      None selected (Tap to select budgets)
                    </span>
                  ) : (
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {selectedBudgetIds.map((bId) => {
                        const b = budgets.find((item) => item.id === bId);
                        if (!b) return null;
                        return (
                          <span
                            key={b.id}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-500/20 text-[#19E6C8] border border-teal-500/30 text-[11px] font-semibold font-mono"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#19E6C8] shadow-[0_0_4px_#19E6C8]" />
                            {b.name}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 text-[#94B5B0] shrink-0 ml-2">
                {selectedBudgetIds.length > 0 && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-teal-500/20 text-[#19E6C8] border border-teal-500/30 font-bold">
                    {selectedBudgetIds.length}
                  </span>
                )}
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>

            {/* Quick Multi-select Chips */}
            {budgets.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {budgets.map((b) => {
                  const isSelected = selectedBudgetIds.includes(b.id);
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        setSelectedBudgetIds((prev) =>
                          isSelected ? prev.filter((id) => id !== b.id) : [...prev, b.id]
                        );
                      }}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer font-mono ${
                        isSelected
                          ? 'bg-teal-500/20 text-[#19E6C8] border border-teal-500/50 shadow-[0_0_10px_rgba(25,230,200,0.25)]'
                          : 'bg-[#061817] text-[#94B5B0] border border-teal-500/15 hover:border-teal-500/35 hover:text-white'
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded flex items-center justify-center transition-all ${
                          isSelected ? 'bg-[#19E6C8] text-black shadow-[0_0_6px_#19E6C8]' : 'border border-teal-500/30 bg-[#030707]'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                      <span>{b.name}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-[11px] text-[#5B7B76] flex items-center justify-between px-1">
                <span>No active budgets found.</span>
                <button
                  type="button"
                  onClick={() => openBudgetModal('new')}
                  className="text-[#19E6C8] hover:underline font-semibold cursor-pointer"
                >
                  + Create budget
                </button>
              </div>
            )}
          </div>
        </div>
        ) : (
          /* Transfer Wallet Selectors (From -> To) */
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {/* From Wallet */}
              <div
                onClick={() => setWalletModalMode('from')}
                className="p-3 rounded-2xl glass-card bg-[#061817] border border-teal-500/20 hover:border-teal-400/40 cursor-pointer flex items-center justify-between transition-colors"
              >
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-mono text-[#94B5B0] uppercase font-bold">From Wallet</span>
                  <span className="text-xs font-semibold text-white truncate mt-0.5">
                    {selectedWallet?.name || 'Select'}
                  </span>
                  <span className="text-[10px] text-[#5B7B76] font-mono">
                    {formatInr(walletBalances.get(walletId) || 0, opts)}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-[#94B5B0]" />
              </div>

              {/* To Wallet */}
              <div
                onClick={() => setWalletModalMode('to')}
                className="p-3 rounded-2xl glass-card bg-[#061817] border border-teal-500/20 hover:border-teal-400/40 cursor-pointer flex items-center justify-between transition-colors"
              >
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-mono text-[#94B5B0] uppercase font-bold">To Wallet</span>
                  <span className="text-xs font-semibold text-white truncate mt-0.5">
                    {selectedToWallet?.name || 'Select'}
                  </span>
                  <span className="text-[10px] text-[#5B7B76] font-mono">
                    {formatInr(walletBalances.get(toWalletId) || 0, opts)}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-[#94B5B0]" />
              </div>
            </div>

            {/* Transfer Fee Toggle */}
            <div className="p-3 rounded-2xl glass-card bg-[#061817] border border-teal-500/20 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white">Transfer Fee</span>
                <p className="text-[10px] text-[#5B7B76]">Record ATM or transaction fee</p>
              </div>
              <div className="flex items-center gap-3">
                {hasFee && (
                  <div className="flex items-center gap-1 bg-[#030707] px-2.5 py-1 rounded-lg border border-teal-500/20">
                    <span className="text-xs text-[#94B5B0]">₹</span>
                    <input
                      type="number"
                      value={feeInput}
                      onChange={(e) => setFeeInput(e.target.value)}
                      className="w-16 bg-transparent text-xs text-white focus:outline-none font-mono"
                    />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setHasFee((prev) => !prev)}
                  className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${
                    hasFee ? 'bg-[#19E6C8]' : 'bg-[#061817] border border-teal-500/25'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                      hasFee ? 'left-5' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Memo & Attach Photo */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-mono text-[#94B5B0] uppercase font-bold tracking-wider">
              Memo & Receipt
            </label>
            <label className="cursor-pointer text-[#19E6C8] hover:text-[#2DD4BF] flex items-center gap-1 text-xs font-semibold transition-colors">
              <Camera className="w-4 h-4" />
              <span>Attach Photo</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            rows={2}
            placeholder="Add a note or receipt memo..."
            className="w-full px-3.5 py-2 rounded-xl bg-[#030707] border border-teal-500/25 text-xs text-white placeholder-[#5B7B76] focus:outline-none focus:border-[#19E6C8] font-sans"
          />

          {/* Image Thumbnails */}
          {imageBlobs.length > 0 && (
            <div className="flex items-center gap-2 mt-2 overflow-x-auto pb-1">
              {imageBlobs.map((blob, idx) => (
                <div key={idx} className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-teal-500/25 group">
                  <img
                    src={blob}
                    alt="Receipt"
                    onClick={() => setPreviewImage(blob)}
                    className="w-full h-full object-cover cursor-pointer"
                  />
                  <button
                    onClick={() => setImageBlobs((prev) => prev.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 p-0.5 rounded-full bg-black/70 text-white hover:text-[#FF6B6B]"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Templates Action Button */}
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setTemplateModalOpen(true)}
          className="w-12 h-12 rounded-full bg-[#061817] hover:bg-teal-950/60 border border-teal-500/30 text-[#19E6C8] flex items-center justify-center shadow-[0_0_20px_rgba(25,230,200,0.3)] active:scale-95 transition-all cursor-pointer"
          title="Templates"
          aria-label="Open templates"
        >
          <Bookmark className="w-5 h-5" />
        </button>
      </div>

      {/* 4. Built-in Calculator Keypad Tray (Bottom) */}
      {showCalculator && (
        <div className="shrink-0 z-30 animate-in slide-in-from-bottom-4 duration-150">
          <CalculatorKeypad
            expression={amountInput}
            onChangeExpression={(val) => setAmountInput(val)}
            onDone={(evalVal) => {
              setAmountInput(evalVal.toString());
              setShowCalculator(false);
            }}
          />
        </div>
      )}

      {/* Category Selector Screen */}
      <CategorySelectorModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        selectedCategoryId={categoryId}
        onSelectCategory={(cat) => {
          setCategoryId(cat.id);
          if (activeType !== 'transfer' && cat.type !== activeType) {
            setActiveType(cat.type);
          }
        }}
        defaultType={activeType === 'income' ? 'income' : 'expense'}
      />

      {/* Wallet Selector Screen */}
      <WalletSelectorModal
        isOpen={walletModalMode !== null}
        onClose={() => setWalletModalMode(null)}
        selectedWalletId={walletModalMode === 'to' ? toWalletId : walletId}
        excludedWalletId={walletModalMode === 'to' ? walletId : activeType === 'transfer' ? toWalletId : undefined}
        onSelectWallet={(w) => {
          if (walletModalMode === 'to') setToWalletId(w.id);
          else setWalletId(w.id);
        }}
        title={walletModalMode === 'to' ? 'Select Destination Wallet' : 'Select Wallet'}
      />

      {/* Budget Selector Screen (Multi-select) */}
      <BudgetSelectorModal
        isOpen={budgetModalOpen}
        onClose={() => setBudgetModalOpen(false)}
        selectedBudgetIds={selectedBudgetIds}
        onToggleBudget={(bId) => {
          setSelectedBudgetIds((prev) =>
            prev.includes(bId) ? prev.filter((id) => id !== bId) : [...prev, bId]
          );
        }}
        onSelectAll={() => setSelectedBudgetIds(budgets.map((b) => b.id))}
        onClearAll={() => setSelectedBudgetIds([])}
      />

      {/* Template Manager Modal */}
      <TemplateManagerModal
        isOpen={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
        onApplyTemplate={handleApplyTemplate}
        currentDraft={{
          type: activeType,
          amountPaise,
          description,
          categoryId,
          walletId,
        }}
      />

      {/* Date Picker Simple Modal */}
      {showDatePicker && (
        <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-[#061817]/95 border border-teal-500/25 rounded-3xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.9)] space-y-3 backdrop-blur-2xl">
            <h4 className="text-sm font-bold text-white font-display">Select Date & Time</h4>
            <input
              type="datetime-local"
              value={dateTime.slice(0, 16)}
              onChange={(e) => {
                if (e.target.value) setDateTime(new Date(e.target.value).toISOString());
              }}
              className="w-full px-3 py-2 rounded-xl bg-[#030707] border border-teal-500/20 text-xs text-white focus:outline-none focus:border-[#19E6C8]"
            />
            <button
              onClick={() => setShowDatePicker(false)}
              className="w-full py-2.5 rounded-xl bg-[#19E6C8] hover:bg-[#2DD4BF] text-xs font-bold text-[#030807] shadow-[0_0_15px_rgba(25,230,200,0.4)] cursor-pointer transition-all"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-4 right-4 p-2.5 text-[#94B5B0] hover:text-white bg-[#061817] border border-teal-500/30 rounded-full cursor-pointer transition-colors shadow-lg"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={previewImage}
            alt="Receipt Full Preview"
            className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl border border-teal-500/20"
          />
        </div>
      )}
    </div>
  );
};
