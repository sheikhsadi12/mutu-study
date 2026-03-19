import React from 'react';

export default function PhoneLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-[100dvh] w-full bg-[var(--bg-main)] text-[var(--text-main)] flex flex-col overflow-hidden">
      {children}
    </div>
  );
}
