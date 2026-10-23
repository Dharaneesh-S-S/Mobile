import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  className?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-between gap-3 ${className}`}>
      {(label || description) && (
        <div>
          {label && <div className="text-sm font-semibold text-white">{label}</div>}
          {description && <div className="text-xs text-[#5B7B76]">{description}</div>}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border border-teal-500/30 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-400/40 ${
          checked ? 'bg-[#19E6C8] shadow-[0_0_15px_rgba(25,230,200,0.4)]' : 'bg-[#061817]'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
            checked ? 'translate-x-5 bg-[#030807]' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );
};
