import React from 'react';
import { GlassCard } from './GlassCard';

interface StatTileProps {
  label: string;
  value: string;
  subValue?: string;
  icon?: React.ReactNode;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    text: string;
  };
  variant?: 'standard' | 'featured' | 'income' | 'expense';
  className?: string;
}

export const StatTile: React.FC<StatTileProps> = ({
  label,
  value,
  subValue,
  icon,
  trend,
  variant = 'standard',
  className = '',
}) => {
  let valueColor = 'text-white text-glow-teal';
  let badgeColor = 'bg-teal-500/10 text-[#19E6C8] border-teal-500/20';

  if (variant === 'income') {
    valueColor = 'text-[#19E6C8] text-glow-teal';
    badgeColor = 'bg-teal-500/10 text-[#19E6C8] border-teal-500/30';
  } else if (variant === 'expense') {
    valueColor = 'text-[#FF6B6B] text-glow-coral';
    badgeColor = 'bg-[#FF6B6B]/10 text-[#FF6B6B] border-[#FF6B6B]/30';
  }

  const isFeatured = variant === 'featured';

  return (
    <GlassCard
      variant={isFeatured ? 'featured' : 'standard'}
      className={`flex flex-col justify-between ${className}`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#94B5B0] font-sans">
          {label}
        </span>
        {icon && (
          <div className="p-2 rounded-2xl bg-teal-950/40 border border-teal-500/20 text-[#19E6C8]">
            {icon}
          </div>
        )}
      </div>

      <div className="my-1">
        <div className={`text-2xl sm:text-3xl font-extrabold font-display tracking-tight ${valueColor}`}>
          {value}
        </div>
        {subValue && (
          <div className="text-xs text-[#5B7B76] mt-0.5 font-medium">{subValue}</div>
        )}
      </div>

      {trend && (
        <div className="mt-2 flex items-center gap-1.5">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor} font-mono`}
          >
            {trend.text}
          </span>
        </div>
      )}
    </GlassCard>
  );
};
