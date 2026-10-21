import React, { useState } from 'react';
import { Sparkles, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useMoney } from '../../context/MoneyContext';

const QUICK_SUGGESTIONS = [
  'Lunch 150 Food',
  'Chai 30',
  'Blinkit 450 Groceries',
  'Uber 180 Transport',
  'Salary 75000',
];

export const QuickAddBar: React.FC = () => {
  const { quickAddTransaction, showToast } = useMoney();
  const [text, setText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await quickAddTransaction(text);
      if (res.success) {
        setText('');
      } else {
        showToast({ type: 'warning', text: res.message });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-4 mb-2">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="absolute left-3 text-blue-400 pointer-events-none">
          <Sparkles className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='Quick Add: "lunch 90 food" or "salary 75000"...'
          className="w-full pl-9 pr-10 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500/70 focus:ring-1 focus:ring-blue-500/40 transition-all"
        />
        <button
          type="submit"
          disabled={!text.trim() || isSubmitting}
          className="absolute right-1.5 p-1.5 rounded-lg bg-blue-600/80 hover:bg-blue-600 disabled:opacity-30 disabled:pointer-events-none text-white transition-all"
          aria-label="Add transaction"
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Suggestion hints on focus or when empty */}
      {!text && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar mt-1.5 px-0.5 pb-1">
          <span className="text-[10px] text-slate-500 shrink-0">Try:</span>
          {QUICK_SUGGESTIONS.map((sug) => (
            <button
              key={sug}
              type="button"
              onClick={() => setText(sug)}
              className="text-[10px] whitespace-nowrap px-2 py-0.5 rounded-md bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            >
              {sug}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
