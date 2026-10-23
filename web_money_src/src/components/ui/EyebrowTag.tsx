import React from 'react';

interface EyebrowTagProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  dot?: boolean;
  className?: string;
}

export const EyebrowTag: React.FC<EyebrowTagProps> = ({
  children,
  icon,
  dot = true,
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/25 text-[#19E6C8] text-[10px] font-bold tracking-wider uppercase font-mono backdrop-blur-md shadow-[0_0_15px_rgba(25,230,200,0.12)] ${className}`}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-[#19E6C8] shadow-[0_0_8px_#19E6C8] animate-pulse" />
      )}
      {icon}
      <span>{children}</span>
    </span>
  );
};
