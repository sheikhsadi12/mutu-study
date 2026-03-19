import { useState } from 'react';
import { ArrowLeft, Sparkles, Grid, Volume2, Type, AlignLeft, X, MoreVertical } from 'lucide-react';
import { useStore } from '../store';
import { ScreenType } from '../App';
import WordCard from '../components/WordCard';

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

  const fontSizeClasses = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
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
          <button onClick={() => setFilter('syn')} className={`flex-1 py-2 rounded-xl text-xs font-bold border ${filter === 'syn' ? 'bg-syn-text text-white border-syn-text' : 'bg-bg-card text-syn-text border-border'}`}>SYN</button>
          <button onClick={() => setFilter('ant')} className={`flex-1 py-2 rounded-xl text-xs font-bold border ${filter === 'ant' ? 'bg-ant-text text-white border-ant-text' : 'bg-bg-card text-ant-text border-border'}`}>ANT</button>
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
            <WordCard key={w.id} w={w} fontSize={fontSize} lineSpacing={lineSpacing} />
          ))}
        </div>
      </div>
    </div>
  );
}
