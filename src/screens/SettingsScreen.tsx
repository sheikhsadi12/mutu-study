import { ArrowLeft, Palette } from 'lucide-react';
import { useStore } from '../store';
import { ScreenType } from '../App';
import { Theme, CustomThemeColors } from '../types';

export default function SettingsScreen({ onNavigate }: { onNavigate: (s: ScreenType, p?: any) => void }) {
  const theme = useStore(state => state.theme);
  const setTheme = useStore(state => state.setTheme);
  const customThemeColors = useStore(state => state.customThemeColors);
  const setCustomThemeColors = useStore(state => state.setCustomThemeColors);

  const themes: { id: Theme, name: string, icon: string, color: string }[] = [
    { id: 'blue', name: 'Classic Blue', icon: '🌊', color: '#1A2F5A' },
    { id: 'dark', name: 'Night Mode', icon: '🌙', color: '#6366F1' },
    { id: 'minimal', name: 'Minimalist', icon: '🍎', color: '#000000' },
    { id: 'cyberpunk', name: 'Cyberpunk', icon: '⚡', color: '#00FFF5' },
    { id: 'sakura', name: 'Sakura Pink', icon: '🌸', color: '#BE185D' },
    { id: 'custom', name: 'Custom Theme', icon: '🎨', color: customThemeColors.primary || '#1A2F5A' },
  ];

  const handleColorChange = (key: keyof CustomThemeColors, value: string) => {
    setCustomThemeColors({ ...customThemeColors, [key]: value });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-bg-main">
      <div className="bg-primary p-4 shrink-0 flex items-center gap-3 shadow-sm">
        <button onClick={() => onNavigate('home')} className="bg-white/20 p-2 rounded-xl text-white">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-white text-base font-bold">Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="bg-bg-card border border-border rounded-2xl p-4 shadow-sm mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="text-primary" />
            <h2 className="font-bold text-text-main">App Theme</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-6">
            {themes.map(t => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`p-3 rounded-xl border text-left transition-all ${theme === t.id ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border bg-bg-main'}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span>{t.icon}</span>
                  <span className="font-bold text-sm text-text-main">{t.name}</span>
                </div>
                <div className="flex gap-1">
                  <div className="w-full h-2 rounded-full" style={{ backgroundColor: t.color }}></div>
                </div>
              </button>
            ))}
          </div>

          {theme === 'custom' && (
            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="font-bold text-sm text-text-main mb-4">Custom Colors</h3>
              <div className="space-y-3">
                {[
                  { key: 'primary', label: 'Primary Color' },
                  { key: 'bg', label: 'Background Color' },
                  { key: 'cardBg', label: 'Card Background' },
                  { key: 'text', label: 'Main Text' },
                  { key: 'synC', label: 'Synonym Accent' },
                  { key: 'antC', label: 'Antonym Accent' },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between bg-bg-main p-3 rounded-xl border border-border">
                    <span className="text-sm font-medium text-text-main">{label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-text-sub font-mono uppercase">
                        {customThemeColors[key as keyof CustomThemeColors] || '#000000'}
                      </span>
                      <input
                        type="color"
                        value={customThemeColors[key as keyof CustomThemeColors] || '#000000'}
                        onChange={(e) => handleColorChange(key as keyof CustomThemeColors, e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
