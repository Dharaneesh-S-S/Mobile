import React from 'react';
import { ArrowRight, Image as ImageIcon, Layers, Trash2, CheckSquare, Square } from 'lucide-react';
import { Record } from '../../types/money';
import { useMoney } from '../../context/MoneyContext';
import { DynamicIcon } from '../common/IconHelper';
import { formatInr } from '../../utils/currency';
import { formatTransactionDateTime } from '../../utils/dateUtils';

interface TransactionRowProps {
  record: Record;
  isSelectMode: boolean;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onLongPress: (id: string) => void;
}

export const TransactionRow: React.FC<TransactionRowProps> = ({
  record,
  isSelectMode,
  isSelected,
  onToggleSelect,
  onLongPress,
}) => {
  const { categories, wallets, openAddRecord, deleteRecord, settings } = useMoney();

  const category = categories.find((c) => c.id === record.categoryId);
  const wallet = wallets.find((w) => w.id === record.walletId);
  const toWallet = record.toWalletId ? wallets.find((w) => w.id === record.toWalletId) : null;

  const { timeStr } = formatTransactionDateTime(record.dateTime);

  const opts = {
    showDecimals: settings.showDecimals,
    useInternationalGrouping: settings.numberGrouping === 'intl',
  };

  // Color and symbol per type
  let amountText = '';
  let amountColor = '';

  if (record.type === 'income') {
    amountText = `+${formatInr(record.amountPaise, opts)}`;
    amountColor = 'text-blue-400';
  } else if (record.type === 'expense') {
    amountText = `-${formatInr(record.amountPaise, opts)}`;
    amountColor = 'text-red-400';
  } else {
    // Transfer
    amountText = formatInr(record.amountPaise, opts);
    amountColor = 'text-slate-300';
  }

  const handleRowClick = () => {
    if (isSelectMode) {
      onToggleSelect(record.id);
    } else {
      openAddRecord({ recordToEdit: record });
    }
  };

  return (
    <div
      onClick={handleRowClick}
      onContextMenu={(e) => {
        e.preventDefault();
        onLongPress(record.id);
      }}
      className={`group relative flex items-center justify-between px-4 py-3 hover:bg-slate-800/40 active:bg-slate-800/70 cursor-pointer transition-colors border-b border-slate-800/40 select-none ${
        isSelected ? 'bg-blue-900/20' : ''
      }`}
    >
      {/* Left: Checkbox (if select mode) + Category Icon + Info */}
      <div className="flex items-center gap-3 min-w-0 pr-3">
        {isSelectMode && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSelect(record.id);
            }}
            className="text-blue-400 p-0.5"
            aria-label="Select transaction"
          >
            {isSelected ? (
              <CheckSquare className="w-5 h-5 fill-blue-500 text-slate-900" />
            ) : (
              <Square className="w-5 h-5 text-slate-500" />
            )}
          </button>
        )}

        {/* Round Colored Category Icon */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm"
          style={{
            backgroundColor: record.type === 'transfer' ? '#334155' : `${category?.color || '#3b82f6'}22`,
            border: `1.5px solid ${record.type === 'transfer' ? '#64748b' : category?.color || '#3b82f6'}`,
          }}
        >
          {record.type === 'transfer' ? (
            <ArrowRight className="w-4 h-4 text-slate-300" />
          ) : (
            <DynamicIcon
              name={category?.icon || 'CircleHelp'}
              className="w-4 h-4"
              color={category?.color || '#3b82f6'}
            />
          )}
        </div>

        {/* Description & Wallet Details */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-slate-100 truncate">
              {record.type === 'transfer'
                ? `Transfer: ${wallet?.name || 'Wallet'} → ${toWallet?.name || 'Wallet'}`
                : record.description}
            </span>

            {/* Badges: Image, Split */}
            {record.imageBlobs && record.imageBlobs.length > 0 && (
              <span title="Has attachment" className="text-blue-400">
                <ImageIcon className="w-3.5 h-3.5" />
              </span>
            )}
            {record.splitLines && record.splitLines.length > 0 && (
              <span title="Split transaction" className="text-purple-400">
                <Layers className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
            <span>{wallet?.name || 'Wallet'}</span>
            {record.feePaise ? (
              <span className="text-[10px] text-amber-400/90 font-medium">
                (Fee: {formatInr(record.feePaise, opts)})
              </span>
            ) : null}
            {record.memo && (
              <>
                <span>•</span>
                <span className="truncate max-w-[140px] text-slate-500">{record.memo}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right: Amount & Time + Swipe Delete Shortcut */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex flex-col items-end">
          <span className={`text-sm sm:text-base font-bold font-display tracking-tight ${amountColor}`}>
            {amountText}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5">{timeStr}</span>
        </div>

        {/* Quick Delete button on hover for desktop */}
        {!isSelectMode && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteRecord(record.id, true);
            }}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-all ml-1"
            title="Delete record"
            aria-label="Delete record"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
