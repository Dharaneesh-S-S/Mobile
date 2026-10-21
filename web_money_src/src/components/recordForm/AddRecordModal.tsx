import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ArrowLeft,
  ChevronDown,
  Calendar,
  Clock,
  Repeat,
  Camera,
  X,
  Plus,
  Bookmark,
  Check,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useMoney } from '../../context/MoneyContext';
import { Category, Wallet, TransactionType, Template } from '../../types/money';
import { formatInr, rupeesToPaise, paiseToRupees } from '../../utils/currency';
import { DynamicIcon } from '../common/IconHelper';
import { CalculatorKeypad } from './CalculatorKeypad';
import { CategorySelectorModal } from './CategorySelectorModal';
import { WalletSelectorModal } from './WalletSelectorModal';
import { TemplateManagerModal } from './TemplateManagerModal';

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
    openRecurringModal,
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
    if (!isEditing) {
      const match = categories.find((c) => c.type === (activeType === 'transfer' ? 'expense' : activeType));
      if (match && (!categoryId || categories.find((c) => c.id === categoryId)?.type !== match.type)) {
        setCategoryId(match.id);
      }
    }
  }, [activeType, categories, categoryId, isEditing]);

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
    <div className="fixed inset-0 z-50 bg-[#090d16] flex flex-col text-slate-100 animate-in slide-in-from-bottom-8 duration-200">
      {/* 1. Header: Back, Title, Save */}
      <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-950/80">
        <div className="flex items-center gap-3">
          <button
            onClick={closeAddRecord}
            className="p-1 -ml-1 rounded-lg text-slate-400 hover:text-white"
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
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300"
              title="Save & Add Another"
            >
              + Another
            </button>
          )}
          <button
            onClick={() => handleSave(false)}
            disabled={!isValid}
            className={`text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md ${
              isValid
                ? activeType === 'income'
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-glow-blue'
                  : activeType === 'expense'
                  ? 'bg-red-600 hover:bg-red-500 text-white shadow-glow-red'
                  : 'bg-slate-700 hover:bg-slate-600 text-white'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
            }`}
          >
            SAVE
          </button>
        </div>
      </div>

      {/* 2. Type Tabs: Income, Expense, Transfer */}
      <div className="flex border-b border-slate-800 text-xs font-semibold shrink-0 bg-[#090d16]">
        <button
          onClick={() => setActiveType('income')}
          className={`flex-1 py-3 text-center border-b-2 transition-all ${
            activeType === 'income'
              ? 'border-blue-500 text-blue-400 font-bold bg-blue-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Income
        </button>
        <button
          onClick={() => setActiveType('expense')}
          className={`flex-1 py-3 text-center border-b-2 transition-all ${
            activeType === 'expense'
              ? 'border-red-500 text-red-400 font-bold bg-red-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Expense
        </button>
        <button
          onClick={() => setActiveType('transfer')}
          className={`flex-1 py-3 text-center border-b-2 transition-all ${
            activeType === 'transfer'
              ? 'border-slate-400 text-slate-200 font-bold bg-slate-800/30'
              : 'border-transparent text-slate-400 hover:text-slate-200'
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
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer flex items-center justify-between transition-colors group"
        >
          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Amount
            </span>
            <div className="flex items-baseline gap-1 mt-1 font-display">
              <span className="text-xl font-bold text-slate-400">₹</span>
              <span
                className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
                  activeType === 'income'
                    ? 'text-blue-400'
                    : activeType === 'expense'
                    ? 'text-red-400'
                    : 'text-white'
                }`}
              >
                {amountInput || '0'}
              </span>
            </div>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-slate-400 transition-transform ${
              showCalculator ? 'rotate-180 text-blue-400' : ''
            }`}
          />
        </div>

        {/* Date & Time Field + Recurring shortcut */}
        <div className="flex items-center gap-2">
          <div
            onClick={() => setShowDatePicker(true)}
            className="flex-1 p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-slate-400 uppercase">Date & Time</span>
                <span className="text-xs font-semibold text-slate-100 truncate">
                  {formattedDateTimeStr}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => openRecurringModal()}
            className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 text-slate-400 hover:text-blue-400 transition-colors"
            title="Make recurring transaction"
          >
            <Repeat className="w-5 h-5" />
          </button>
        </div>

        {/* Description Field with Autocomplete */}
        <div className="relative">
          <label className="text-[11px] font-medium text-slate-400 block mb-1">
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
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />

          {/* Autocomplete Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden divide-y divide-slate-800">
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
                  className="px-3.5 py-2 hover:bg-slate-800 cursor-pointer flex items-center justify-between text-xs"
                >
                  <span className="text-slate-200 font-semibold">{sug.description}</span>
                  <span className="text-slate-400 font-display">
                    ₹{(sug.amountPaise / 100).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category & Wallet Dropdowns */}
        {activeType !== 'transfer' ? (
          <div className="grid grid-cols-2 gap-3">
            {/* Category Selector */}
            <div
              onClick={() => setCategoryModalOpen(true)}
              className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: `${selectedCategory?.color || '#3b82f6'}22`,
                    border: `1.5px solid ${selectedCategory?.color || '#3b82f6'}`,
                  }}
                >
                  <DynamicIcon
                    name={selectedCategory?.icon || 'Tag'}
                    className="w-3.5 h-3.5"
                    color={selectedCategory?.color || '#3b82f6'}
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] text-slate-400">Category</span>
                  <span className="text-xs font-semibold text-slate-100 truncate">
                    {selectedCategory?.name || 'Select'}
                  </span>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>

            {/* Wallet Selector */}
            <div
              onClick={() => setWalletModalMode('from')}
              className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: `${selectedWallet?.color || '#3b82f6'}22`,
                    border: `1.5px solid ${selectedWallet?.color || '#3b82f6'}`,
                  }}
                >
                  <DynamicIcon
                    name={selectedWallet?.icon || 'Smartphone'}
                    className="w-3.5 h-3.5"
                    color={selectedWallet?.color || '#3b82f6'}
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] text-slate-400">Wallet</span>
                  <span className="text-xs font-semibold text-slate-100 truncate">
                    {selectedWallet?.name || 'Select'}
                  </span>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        ) : (
          /* Transfer Wallet Selectors (From -> To) */
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {/* From Wallet */}
              <div
                onClick={() => setWalletModalMode('from')}
                className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer flex items-center justify-between"
              >
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] text-slate-400">From Wallet</span>
                  <span className="text-xs font-semibold text-slate-100 truncate mt-0.5">
                    {selectedWallet?.name || 'Select'}
                  </span>
                  <span className="text-[10px] text-slate-500 font-display">
                    {formatInr(walletBalances.get(walletId) || 0, opts)}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>

              {/* To Wallet */}
              <div
                onClick={() => setWalletModalMode('to')}
                className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer flex items-center justify-between"
              >
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] text-slate-400">To Wallet</span>
                  <span className="text-xs font-semibold text-slate-100 truncate mt-0.5">
                    {selectedToWallet?.name || 'Select'}
                  </span>
                  <span className="text-[10px] text-slate-500 font-display">
                    {formatInr(walletBalances.get(toWalletId) || 0, opts)}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Transfer Fee Toggle */}
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-200">Transfer Fee</span>
                <p className="text-[10px] text-slate-500">Record ATM or transaction fee</p>
              </div>
              <div className="flex items-center gap-3">
                {hasFee && (
                  <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                    <span className="text-xs text-slate-400">₹</span>
                    <input
                      type="number"
                      value={feeInput}
                      onChange={(e) => setFeeInput(e.target.value)}
                      className="w-16 bg-transparent text-xs text-white focus:outline-none"
                    />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setHasFee((prev) => !prev)}
                  className={`w-10 h-6 rounded-full transition-colors relative ${
                    hasFee ? 'bg-blue-600' : 'bg-slate-700'
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
            <label className="text-[11px] font-medium text-slate-400">Memo & Receipt</label>
            <label className="cursor-pointer text-blue-400 hover:text-blue-300 flex items-center gap-1 text-xs font-semibold">
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
            className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />

          {/* Image Thumbnails */}
          {imageBlobs.length > 0 && (
            <div className="flex items-center gap-2 mt-2 overflow-x-auto pb-1">
              {imageBlobs.map((blob, idx) => (
                <div key={idx} className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-slate-700 group">
                  <img
                    src={blob}
                    alt="Receipt"
                    onClick={() => setPreviewImage(blob)}
                    className="w-full h-full object-cover cursor-pointer"
                  />
                  <button
                    onClick={() => setImageBlobs((prev) => prev.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 p-0.5 rounded-full bg-black/70 text-white hover:text-red-400"
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
          className="w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-600 text-blue-400 flex items-center justify-center shadow-xl active:scale-95 transition-all"
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
        onSelectCategory={(cat) => setCategoryId(cat.id)}
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
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl space-y-3">
            <h4 className="text-sm font-bold text-white">Select Date & Time</h4>
            <input
              type="datetime-local"
              value={dateTime.slice(0, 16)}
              onChange={(e) => {
                if (e.target.value) setDateTime(new Date(e.target.value).toISOString());
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
            />
            <button
              onClick={() => setShowDatePicker(false)}
              className="w-full py-2 rounded-xl bg-blue-600 text-xs font-semibold text-white shadow-glow-blue"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-60 bg-black/90 flex flex-col items-center justify-center p-4">
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-4 right-4 p-2 text-white bg-slate-800 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={previewImage}
            alt="Receipt Full Preview"
            className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
