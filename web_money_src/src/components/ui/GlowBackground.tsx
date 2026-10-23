import React from 'react';

export const GlowBackground: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`relative min-h-screen w-full bg-[#030707] text-[#F4FFFD] overflow-hidden ${className}`}>
      {/* 1. Ambient Background Grid */}
      <div className="absolute inset-0 ambient-bg-grid pointer-events-none opacity-40 z-0" />

      {/* 2. Top-Center Ethereal Teal Light Bleed (from Reference Screenshot) */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[500px] rounded-full bg-radial-teal pointer-events-none opacity-30 blur-3xl z-0"
           style={{
             background: 'radial-gradient(circle, rgba(25, 230, 200, 0.28) 0%, rgba(13, 148, 136, 0.12) 40%, transparent 70%)'
           }}
      />

      {/* 3. Lateral Cyan Light Pillars */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 rounded-full pointer-events-none opacity-20 blur-3xl"
           style={{
             background: 'radial-gradient(circle, rgba(25, 230, 200, 0.2) 0%, transparent 70%)'
           }}
      />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 rounded-full pointer-events-none opacity-20 blur-3xl"
           style={{
             background: 'radial-gradient(circle, rgba(13, 148, 136, 0.2) 0%, transparent 70%)'
           }}
      />

      {/* 4. Children Content (elevated above ambient light) */}
      <div className="relative z-10 w-full h-full flex flex-col">
        {children}
      </div>
    </div>
  );
};
