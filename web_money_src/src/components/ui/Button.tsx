import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'teal' | 'coral' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled,
  ...props
}) => {
  const base =
    'rounded-full font-sans font-semibold inline-flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:pointer-events-none select-none cursor-pointer';

  let sizeStyles = 'px-5 py-2.5 text-xs';
  if (size === 'sm') sizeStyles = 'px-3 py-1.5 text-[11px]';
  if (size === 'lg') sizeStyles = 'px-7 py-3.5 text-sm font-bold';

  let variantStyles = '';
  switch (variant) {
    case 'primary':
      // Solid white pill with black text and gentle white aura
      variantStyles =
        'bg-white text-[#04100F] font-bold shadow-[0_0_20px_rgba(255,255,255,0.22)] hover:bg-slate-100 hover:shadow-[0_0_30px_rgba(25,230,200,0.3)]';
      break;
    case 'teal':
      // Vibrant teal glowing button
      variantStyles =
        'bg-[#19E6C8] text-[#030807] font-extrabold shadow-[0_0_25px_rgba(25,230,200,0.4)] hover:bg-[#2DD4BF]';
      break;
    case 'ghost':
      // Translucent teal-bordered pill
      variantStyles =
        'bg-[#061817]/60 border border-teal-500/30 text-[#2DD4BF] hover:bg-teal-900/40 hover:border-[#19E6C8] hover:text-white backdrop-blur-md';
      break;
    case 'coral':
      variantStyles =
        'bg-[#FF6B6B]/15 border border-[#FF6B6B]/30 text-[#FF6B6B] hover:bg-[#FF6B6B]/25';
      break;
    case 'icon':
      sizeStyles = 'p-2.5';
      variantStyles =
        'bg-[#061817]/60 border border-teal-500/20 text-[#94B5B0] hover:text-white hover:border-teal-400 hover:bg-teal-950/60 backdrop-blur-md';
      break;
  }

  return (
    <button
      className={`${base} ${sizeStyles} ${variantStyles} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
