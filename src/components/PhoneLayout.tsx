import React, { useEffect } from 'react';
import { useStore } from '../store';
import PwaInstallPrompt from './PwaInstallPrompt';

export default function PhoneLayout({ children }: { children: React.ReactNode }) {
  const theme = useStore((state) => state.theme);
  const customColors = useStore((state) => state.customThemeColors);

  useEffect(() => {
    const root = document.documentElement;
    root.className = theme === 'blue' ? '' : `theme-${theme}`;
    
    if (theme === 'custom') {
      Object.entries(customColors).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
    } else {
      // Reset custom properties
      root.style.cssText = '';
    }
  }, [theme, customColors]);

  return (
    <div className="min-h-screen bg-bg-main relative font-sans text-text-main overflow-hidden flex flex-col">
      {children}
      <PwaInstallPrompt />
    </div>
  );
}
