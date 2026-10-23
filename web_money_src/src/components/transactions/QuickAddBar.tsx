import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
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
    <div className="mx-2 md:mx-0 mb-3 select-none">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="absolute left-3.5 text-[#19E6C8] pointer-events-none drop-shadow-[0_0_6px_#19E6C8]">
          <Sparkles className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='Quick Add: "lunch 90 food" or "salary 75000"...'
          className="w-full pl-10 pr-12 py-2.5 rounded-2xl bg-[#061817]/75 border border-teal-500/20 text-xs text-white placeholder-[#5B7B76] focus:outline-none focus:border-[#19E6C8] focus:ring-2 focus:ring-teal-400/20 backdrop-blur-xl transition-all shadow-md"
        />
        <button
          type="submit"
          disabled={!text.trim() || isSubmitting}
          className="absolute right-1.5 p-2 rounded-xl bg-[#19E6C8] hover:bg-[#2DD4BF] disabled:opacity-30 disabled:pointer-events-none text-black transition-all cursor-pointer shadow-[0_0_12px_rgba(25,230,200,0.4)]"
          aria-label="Add transaction"
        >
          <ArrowRight className="w-3.5 h-3.5 stroke-[2.8]" />
        </button>
      </form>

      {/* Suggestion hints */}
      {!text && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar mt-2 px-1 pb-1">
          <span className="text-[10px] text-[#5B7B76] font-mono shrink-0">Try:</span>
          {QUICK_SUGGESTIONS.map((sug) => (
            <button
              key={sug}
              type="button"
              onClick={() => setText(sug)}
              className="text-[10px] font-mono whitespace-nowrap px-2.5 py-0.5 rounded-full bg-[#061817]/70 border border-teal-500/15 hover:border-teal-400/40 text-[#94B5B0] hover:text-[#19E6C8] transition-colors cursor-pointer"
            >
              {sug}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
