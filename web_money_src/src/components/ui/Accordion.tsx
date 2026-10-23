import React, { useState } from 'react';
import { ChevronDown, Plus, Minus } from 'lucide-react';

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  type?: 'single' | 'multiple';
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  type = 'single',
  className = '',
}) => {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set([items[0]?.id || '']));

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(type === 'single' ? [] : prev);
      if (prev.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item) => {
        const isOpen = openIds.has(item.id);
        return (
          <div
            key={item.id}
            className={`rounded-2xl transition-all duration-300 overflow-hidden border ${
              isOpen
                ? 'bg-[#082220]/75 border-teal-400/40 shadow-[0_0_25px_rgba(25,230,200,0.15)]'
                : 'bg-[#061817]/60 border-teal-500/15 hover:border-teal-500/30'
            }`}
          >
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className="w-full px-5 py-4 flex items-center justify-between text-left gap-4"
            >
              <span className="text-sm font-semibold text-white font-sans">{item.title}</span>
              <div
                className={`p-1 rounded-full transition-transform duration-200 ${
                  isOpen ? 'text-[#19E6C8] bg-teal-500/15' : 'text-[#5B7B76]'
                }`}
              >
                {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </div>
            </button>

            {isOpen && (
              <div className="px-5 pb-5 pt-1 text-xs text-[#94B5B0] leading-relaxed border-t border-teal-500/10">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
