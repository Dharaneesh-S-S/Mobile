import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'standard' | 'featured' | 'elevated' | 'flat';
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  variant = 'standard',
  children,
  className = '',
  glow = false,
  ...props
}) => {
  let variantClass = 'glass-card';

  if (variant === 'featured') {
    variantClass = 'glass-card-featured';
  } else if (variant === 'elevated') {
    variantClass = 'bg-[#081a18]/85 backdrop-blur-2xl border border-teal-500/25 shadow-2xl';
  } else if (variant === 'flat') {
    variantClass = 'bg-[#051211]/60 border border-teal-500/10 backdrop-blur-lg';
  }

  const glowEffect = glow ? 'shadow-[0_0_40px_-5px_rgba(25,230,200,0.3)]' : '';

  return (
    <div
      className={`rounded-3xl p-5 transition-all duration-300 relative overflow-hidden ${variantClass} ${glowEffect} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
