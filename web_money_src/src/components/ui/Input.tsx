import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightElement, className = '', ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-semibold text-[#94B5B0] uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative flex items-center rounded-2xl bg-[#061817]/70 border border-teal-500/20 focus-within:border-[#19E6C8] focus-within:ring-2 focus-within:ring-teal-400/20 transition-all duration-200">
          {leftIcon && (
            <div className="pl-3.5 pr-1 text-[#5B7B76] pointer-events-none">{leftIcon}</div>
          )}
          <input
            ref={ref}
            className={`w-full bg-transparent px-3.5 py-3 text-sm text-white placeholder-[#45615D] focus:outline-none font-sans ${className}`}
            {...props}
          />
          {rightElement && <div className="pr-3.5">{rightElement}</div>}
        </div>
        {error && <span className="text-[11px] text-[#FF6B6B] font-medium">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
