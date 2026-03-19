import { useState } from 'react';
import { ArrowLeft, Sparkles, Grid, Volume2, Type, AlignLeft, X, MoreVertical } from 'lucide-react';
import { useStore } from '../store';
import { ScreenType } from '../App';

export default function PassageScreen({ folderId, passageId, onNavigate }: { folderId: string, passageId: string, onNavigate: (s: ScreenType, p?: any) => void }) {
  const folder = useStore(state => state.folders.find(f => f.id === folderId));
  const passage = folder?.passages.find(p => p.id === passageId);
  
  const [filter, setFilter] = useState<'all' | 'syn' | 'ant'>('all');
  const [showPassageText, setShowPassageText] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Display settings from global store
  const fontSize = useStore(state => state.fontSize);
  const lineSpacing = useStore(state => state.lineSpacing);
  const setFontSize = useStore(state => state.setFontSize);
  const setLineSpacing = useStore(state => state.setLineSpacing);

  if (!passage) return null;

  const words = passage.words.filter(w => filter === 'all' || w.type === filter);
  const uniqueWords = Array.from(new Map(words.map(w => [w.id, w])).values());

  const speak = (text: string) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    window.speechSynthesis.speak(u);
  };

  const fontSizeClasses = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const wordTitleSize = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const wordBnSize = {
    sm: 'text-xs',
    base: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  const wordExEnSize = {
    sm: 'text-[10px]',
    base: 'text-xs',
    lg: 'text-sm',
    xl: 'text-base'
  };

  const wordExBnSize = {
    sm: 'text-[10px]',
    base: 'text-[10px]',
    lg: 'text-xs',
    xl: 'text-sm'
  };

  const wordPronSize = {
    sm: 'text-[10px]',
    base: 'text-[10px]',
    lg: 'text-xs',
    xl: 'text-sm'
  };
  
  const itemEnSize = {
    sm: 'text-[10px]',
    base: 'text-xs',
    lg: 'text-sm',
    xl: 'text-base'
  };
  
  const itemBnSize = {
    sm: 'text-[10px]',
    base: 'text-[10px]',
    lg: 'text-xs',
    xl: 'text-sm'
  };

  const lineSpacingClasses = {
    normal: 'leading-normal',
    relaxed: 'leading-relaxed',
    loose: 'leading-loose'
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      <div className="bg-primary p-4 shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => onNavigate('folder', { folderId })} className="bg-white/20 p-2 rounded-xl text-white">
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-white text-base font-bold">Passage {passage.passageNo} · {passage.board}'{passage.year}</h1>
            <p className="text-white/70 text-xs">{passage.words.length} words</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => onNavigate('contentHub', { folderId, passageId })} className="bg-white/20 p-2 rounded-xl text-white">
              <Grid size={18} />
            </button>
            <button onClick={() => onNavigate('tutor', { folderId, passageId })} className="bg-white/20 p-2 rounded-xl text-white">
              <Sparkles size={18} />
            </button>
            <button onClick={() => setShowSettings(!showSettings)} className="bg-white/20 p-2 rounded-xl text-white">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Display Settings Panel */}
      {showSettings && (
        <div className="absolute top-[72px] left-0 right-0 bg-bg-card border-b border-border p-4 shadow-lg z-20 animate-in slide-in-from-top-2 duration-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm text-text-main">Reading Mode</h3>
            <button onClick={() => setShowSettings(false)} className="text-text-sub">
              <X size={16} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-text-sub mb-2 uppercase tracking-wider flex items-center gap-1">
                <Type size={12} /> Font Size
              </label>
              <div className="flex gap-2">
                {(['sm', 'base', 'lg', 'xl'] as const).map(size => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${fontSize === size ? 'bg-primary text-white' : 'bg-bg-main text-text-main border border-border'}`}
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
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${lineSpacing === spacing ? 'bg-primary text-white' : 'bg-bg-main text-text-main border border-border'}`}
                  >
                    {spacing}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex gap-2 mb-4">
          <button onClick={() => setFilter('all')} className={`flex-1 py-2 rounded-xl text-xs font-bold border ${filter === 'all' ? 'bg-primary text-white border-primary' : 'bg-bg-card text-primary border-border'}`}>All Words</button>
          <button onClick={() => setFilter('syn')} className={`flex-1 py-2 rounded-xl text-xs font-bold border ${filter === 'syn' ? 'bg-syn-text text-white border-syn-text' : 'bg-bg-card text-syn-text border-border'}`}>🔵 SYN</button>
          <button onClick={() => setFilter('ant')} className={`flex-1 py-2 rounded-xl text-xs font-bold border ${filter === 'ant' ? 'bg-ant-text text-white border-ant-text' : 'bg-bg-card text-ant-text border-border'}`}>🔴 ANT</button>
          <button onClick={() => setShowPassageText(!showPassageText)} className={`px-3 py-2 rounded-xl text-xs font-bold border ${showPassageText ? 'bg-primary text-white border-primary' : 'bg-bg-card text-text-sub border-border'}`}>📄</button>
        </div>

        {showPassageText && (
          <div className="bg-bg-card border border-border rounded-xl p-4 mb-4 shadow-sm transition-all">
            <h3 className="text-xs font-bold text-primary mb-2">📄 Passage</h3>
            <p className={`${fontSizeClasses[fontSize]} ${lineSpacingClasses[lineSpacing]} text-text-main italic mb-3 transition-all`}>{passage.en}</p>
            <p className={`${fontSizeClasses[fontSize === 'xl' ? 'lg' : fontSize === 'lg' ? 'base' : 'sm']} ${lineSpacingClasses[lineSpacing]} text-text-sub transition-all`}>{passage.bn}</p>
          </div>
        )}

        <div className="flex flex-col gap-4 pb-10">
          {uniqueWords.map(w => (
            <div key={w.id} className={`bg-bg-card rounded-2xl border overflow-hidden shadow-sm ${w.type === 'syn' ? 'border-syn-border' : 'border-ant-border'}`}>
              <div className={`p-3 flex justify-between items-center border-b ${w.type === 'syn' ? 'bg-syn-bg border-syn-border/50' : 'bg-ant-bg border-ant-border/50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white ${w.type === 'syn' ? 'bg-syn-text' : 'bg-ant-text'}`}>
                    {w.id}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`font-bold ${wordTitleSize[fontSize]} ${w.type === 'syn' ? 'text-syn-text' : 'text-ant-text'} transition-all`}>{w.word}</h4>
                      <button onClick={() => speak(w.word)} className={`p-1 rounded-md ${w.type === 'syn' ? 'text-syn-text' : 'text-ant-text'}`}>
                        <Volume2 size={14} />
                      </button>
                    </div>
                    <p className={`${wordPronSize[fontSize]} opacity-80 ${w.type === 'syn' ? 'text-syn-text' : 'text-ant-text'} transition-all`}>[{w.pron}] · {w.pos}</p>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-md font-bold text-white ${w.type === 'syn' ? 'bg-syn-text' : 'bg-ant-text'}`}>
                  {w.type === 'syn' ? 'SYN' : 'ANT'}
                </span>
              </div>
              <div className="p-3">
                <p className={`font-bold ${wordBnSize[fontSize]} ${lineSpacingClasses[lineSpacing]} text-text-main mb-1 transition-all`}>{w.bn}</p>
                <p className={`${wordExEnSize[fontSize]} ${lineSpacingClasses[lineSpacing]} text-text-main italic mb-1 transition-all`}>{w.exEn}</p>
                <p className={`${wordExBnSize[fontSize]} ${lineSpacingClasses[lineSpacing]} text-text-sub mb-3 transition-all`}>{w.exBn}</p>
                
                <div className="flex flex-col gap-1">
                  {w.items.map(([en, pron, bn], i) => (
                    <div key={i} className={`flex items-center gap-2 p-2 rounded-lg ${w.type === 'syn' ? 'bg-syn-bg/50' : 'bg-ant-bg/50'}`}>
                      <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${w.type === 'syn' ? 'bg-syn-text/10 text-syn-text' : 'bg-ant-text/10 text-ant-text'}`}>{i+1}</span>
                      <div className="flex-1 flex items-center gap-1">
                        <span className={`font-bold ${itemEnSize[fontSize]} ${w.type === 'syn' ? 'text-syn-text' : 'text-ant-text'} transition-all`}>{en}</span>
                        <button onClick={() => speak(en)} className="text-text-sub"><Volume2 size={12} /></button>
                        <span className={`${wordPronSize[fontSize]} text-text-sub transition-all`}>[{pron}]</span>
                      </div>
                      <span className={`${itemBnSize[fontSize]} text-text-sub text-right max-w-[100px] truncate transition-all`}>{bn}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
