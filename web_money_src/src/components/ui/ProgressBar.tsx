import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  variant?: 'teal' | 'coral' | 'dynamic';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  glow?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  variant = 'teal',
  size = 'md',
  className = '',
  glow = true,
}) => {
  const clamped = Math.max(0, Math.min(100, value));

  let height = 'h-1.5';
  if (size === 'sm') height = 'h-1';
  if (size === 'lg') height = 'h-2.5';

  let barColor = 'bg-[#19E6C8]';
  let glowColor = 'shadow-[0_0_12px_rgba(25,230,200,0.6)]';

  if (variant === 'coral') {
    barColor = 'bg-[#FF6B6B]';
    glowColor = 'shadow-[0_0_12px_rgba(255,107,107,0.6)]';
  } else if (variant === 'dynamic') {
    if (clamped >= 90) {
      barColor = 'bg-[#FF6B6B]';
      glowColor = 'shadow-[0_0_12px_rgba(255,107,107,0.6)]';
    } else if (clamped >= 75) {
      barColor = 'bg-amber-400';
      glowColor = 'shadow-[0_0_12px_rgba(251,191,36,0.6)]';
    } else {
      barColor = 'bg-[#19E6C8]';
      glowColor = 'shadow-[0_0_12px_rgba(25,230,200,0.6)]';
    }
  }

  return (
    <div className={`w-full bg-[#061817] rounded-full overflow-hidden border border-teal-500/15 ${height} ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-500 ${barColor} ${glow ? glowColor : ''}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
};
