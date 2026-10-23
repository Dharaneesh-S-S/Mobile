import React from 'react';

interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const BentoGrid: React.FC<BentoGridProps> = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const BentoItem: React.FC<{
  children: React.ReactNode;
  colSpan?: string;
  className?: string;
}> = ({ children, colSpan = 'lg:col-span-4', className = '' }) => {
  return <div className={`${colSpan} flex flex-col ${className}`}>{children}</div>;
};
