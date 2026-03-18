import { ArrowLeft, Palette, Type, AlignLeft, Moon, Sun } from 'lucide-react';
import { useStore } from '../store';
import { ScreenType } from '../App';
import { Theme, CustomThemeColors } from '../types';

export default function SettingsScreen({ onNavigate }: { onNavigate: (s: ScreenType, p?: any) => void }) {
  const theme = useStore(state => state.theme);
  const setTheme = useStore(state => state.setTheme);
  const isDarkMode = useStore(state => state.isDarkMode);
  const setIsDarkMode = useStore(state => state.setIsDarkMode);
  const customThemeColors = useStore(state => state.customThemeColors);
  const setCustomThemeColors = useStore(state => state.setCustomThemeColors);
  
  const fontSize = useStore(state => state.fontSize);
  const lineSpacing = useStore(state => state.lineSpacing);
  const setFontSize = useStore(state => state.setFontSize);
  const setLineSpacing = useStore(state => state.setLineSpacing);
  const fontFamily = useStore(state => state.fontFamily);
  const setFontFamily = useStore(state => state.setFontFamily);

  const themes: { id: Theme, name: string, icon: string, color: string }[] = [
    { id: 'blue', name: 'Classic Blue', icon: '🌊', color: '#3B82F6' },
    { id: 'minimal', name: 'Minimalist', icon: '🍎', color: '#888888' },
    { id: 'cyberpunk', name: 'Cyberpunk', icon: '⚡', color: '#00FFF5' },
    { id: 'sakura', name: 'Sakura Pink', icon: '🌸', color: '#BE185D' },
    { id: 'custom', name: 'Custom Theme', icon: '🎨', color: customThemeColors.primary || '#1A2F5A' },
  ];

  const fonts = [
    { id: 'Inter', name: 'Inter (Default)' },
    { id: 'Roboto', name: 'Roboto' },
    { id: 'Poppins', name: 'Poppins' },
    { id: 'Playfair Display', name: 'Playfair Display' },
    { id: 'Noto Sans Bengali', name: 'Noto Sans Bengali' },
    { id: 'Hind Siliguri', name: 'Hind Siliguri' },
    { id: 'Galada', name: 'Galada' },
    { id: 'Tiro Bangla', name: 'Tiro Bangla' },
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
        {/* Appearance */}
        <div className="bg-bg-card border border-border rounded-2xl p-4 shadow-sm mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="text-primary" />
            <h2 className="font-bold text-text-main">Appearance</h2>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-bg-main rounded-xl border border-border mb-6">
            <div className="flex items-center gap-3">
              {isDarkMode ? <Moon className="text-primary" size={20} /> : <Sun className="text-primary" size={20} />}
              <span className="font-bold text-sm text-text-main">Dark Mode</span>
            </div>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`w-12 h-6 rounded-full transition-colors relative ${isDarkMode ? 'bg-primary' : 'bg-border'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${isDarkMode ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>

          <h3 className="font-bold text-sm text-text-sub mb-3 uppercase tracking-wider">Accent Color</h3>
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
            <div className="mt-8 pt-8 border-t border-border">
              <h3 className="font-bold text-lg text-text-main mb-6">Custom Palette</h3>
              <div className="space-y-4">
                {[
                  { key: 'primary', label: 'Primary Accent', description: 'Main brand identity' },
                  { key: 'syn-text', label: 'Synonym Highlight', description: 'Synonym text styling' },
                  { key: 'ant-text', label: 'Antonym Highlight', description: 'Antonym text styling' },
                ].map(({ key, label, description }) => (
                  <div key={key} className="flex items-center justify-between bg-bg-main p-4 rounded-2xl border border-border hover:border-primary/50 transition-all">
                    <div>
                      <p className="text-sm font-bold text-text-main">{label}</p>
                      <p className="text-xs text-text-sub">{description}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-text-sub font-mono uppercase bg-bg-card px-2 py-1 rounded-md border border-border">
                        {customThemeColors[key as keyof CustomThemeColors] || '#000000'}
                      </span>
                      <div className="relative">
                        <input
                          type="color"
                          value={customThemeColors[key as keyof CustomThemeColors] || '#000000'}
                          onChange={(e) => handleColorChange(key as keyof CustomThemeColors, e.target.value)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div 
                          className="w-10 h-10 rounded-full border-2 border-white shadow-inner"
                          style={{ backgroundColor: customThemeColors[key as keyof CustomThemeColors] || '#000000' }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reading Preferences */}
        <div className="bg-bg-card border border-border rounded-2xl p-4 shadow-sm mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Type className="text-primary" />
            <h2 className="font-bold text-text-main">Reading Preferences</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-text-sub mb-2 uppercase tracking-wider flex items-center gap-1">
                <Type size={12} /> Font Family
              </label>
              <select 
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full bg-bg-main border border-border text-text-main rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all font-bold"
                style={{ fontFamily: fontFamily }}
              >
                {fonts.map(f => (
                  <option key={f.id} value={f.id} style={{ fontFamily: f.id }}>{f.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-sub mb-2 uppercase tracking-wider flex items-center gap-1">
                <Type size={12} /> Font Size
              </label>
              <div className="flex gap-2">
                {(['sm', 'base', 'lg', 'xl'] as const).map(size => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${fontSize === size ? 'bg-primary text-white shadow-md' : 'bg-bg-main text-text-main border border-border hover:bg-border'}`}
                  >
                    {size.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-text-sub mb-2 uppercase tracking-wider flex items-center gap-1">
                <AlignLeft size={12} /> Line Spacing
              </label>
              <div className="flex gap-2">
                {(['normal', 'relaxed', 'loose'] as const).map(spacing => (
                  <button
                    key={spacing}
                    onClick={() => setLineSpacing(spacing)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all capitalize ${lineSpacing === spacing ? 'bg-primary text-white shadow-md' : 'bg-bg-main text-text-main border border-border hover:bg-border'}`}
                  >
                    {spacing}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
