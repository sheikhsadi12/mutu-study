import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../store';
import { ScreenType } from '../App';

export default function FolderScreen({ folderId, onNavigate }: { folderId: string, onNavigate: (s: ScreenType, p?: any) => void }) {
  const folder = useStore(state => state.folders.find(f => f.id === folderId));

  if (!folder) return null;

  const uniquePassages = Array.from(new Map(folder.passages.map(p => [p.id, p])).values());

  const headerStyle: React.CSSProperties = {};
  if (folder.gradient) {
    headerStyle.background = folder.gradient;
  } else if (folder.color) {
    headerStyle.backgroundColor = folder.color;
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      <div 
        className="bg-primary p-4 sticky top-0 z-10 flex items-center gap-3 shadow-sm"
        style={headerStyle}
      >
        <button onClick={() => onNavigate('home')} className="bg-white/20 p-2 rounded-xl text-white backdrop-blur-sm">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-white text-lg font-bold flex items-center gap-2 drop-shadow-sm">
            <span>{folder.emoji}</span> {folder.name}
          </h1>
          <p className="text-white/90 text-xs drop-shadow-sm">{folder.passages.length}টি Passage</p>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3">
        {uniquePassages.map(p => (
          <div 
            key={p.id} 
            onClick={() => onNavigate('passage', { folderId, passageId: p.id })}
            className="bg-bg-card border border-border rounded-2xl p-4 shadow-sm cursor-pointer hover:translate-x-1 transition-transform border-l-4"
            style={{ borderLeftColor: folder.color || 'var(--primary)' }}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-text-main">Passage {p.passageNo}</h3>
                <p className="text-xs text-text-sub">{p.board} Board · 20{p.year}</p>
              </div>
              <ChevronRight size={20} className="text-text-sub" />
            </div>
            <p className="text-xs text-text-sub line-clamp-2 mb-3 italic">{p.en}</p>
            <div className="flex gap-2">
              <span className="bg-syn-bg text-syn-text text-[10px] px-2 py-1 rounded-md font-bold">
                🔵 {p.words.filter(w => w.type === 'syn').length} SYN
              </span>
              <span className="bg-ant-bg text-ant-text text-[10px] px-2 py-1 rounded-md font-bold">
                🔴 {p.words.filter(w => w.type === 'ant').length} ANT
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
