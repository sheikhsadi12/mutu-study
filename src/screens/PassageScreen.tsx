import { useState } from 'react';
import { ArrowLeft, Sparkles, Grid, Volume2 } from 'lucide-react';
import { useStore } from '../store';
import { ScreenType } from '../App';

export default function PassageScreen({ folderId, passageId, onNavigate }: { folderId: string, passageId: string, onNavigate: (s: ScreenType, p?: any) => void }) {
  const folder = useStore(state => state.folders.find(f => f.id === folderId));
  const passage = folder?.passages.find(p => p.id === passageId);
  
  const [filter, setFilter] = useState<'all' | 'syn' | 'ant'>('all');
  const [showPassageText, setShowPassageText] = useState(false);

  if (!passage) return null;

  const words = passage.words.filter(w => filter === 'all' || w.type === filter);
  const uniqueWords = Array.from(new Map(words.map(w => [w.id, w])).values());

  const speak = (text: string) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="bg-primary p-4 shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => onNavigate('folder', { folderId })} className="bg-white/20 p-2 rounded-xl text-white">
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-white text-base font-bold">Passage {passage.passageNo} · {passage.board}'{passage.year}</h1>
            <p className="text-white/70 text-xs">{passage.words.length} words</p>
          </div>
          <button onClick={() => onNavigate('tutor', { folderId, passageId })} className="bg-white/20 p-2 rounded-xl text-white flex items-center gap-1 text-xs font-bold">
            <Sparkles size={14} /> Tutor
          </button>
          <button onClick={() => onNavigate('contentHub', { folderId, passageId })} className="bg-white/20 p-2 rounded-xl text-white">
            <Grid size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex gap-2 mb-4">
          <button onClick={() => setFilter('all')} className={`flex-1 py-2 rounded-xl text-xs font-bold border ${filter === 'all' ? 'bg-primary text-white border-primary' : 'bg-bg-card text-primary border-border'}`}>All Words</button>
          <button onClick={() => setFilter('syn')} className={`flex-1 py-2 rounded-xl text-xs font-bold border ${filter === 'syn' ? 'bg-syn-text text-white border-syn-text' : 'bg-bg-card text-syn-text border-border'}`}>🔵 SYN</button>
          <button onClick={() => setFilter('ant')} className={`flex-1 py-2 rounded-xl text-xs font-bold border ${filter === 'ant' ? 'bg-ant-text text-white border-ant-text' : 'bg-bg-card text-ant-text border-border'}`}>🔴 ANT</button>
          <button onClick={() => setShowPassageText(!showPassageText)} className={`px-3 py-2 rounded-xl text-xs font-bold border ${showPassageText ? 'bg-primary text-white border-primary' : 'bg-bg-card text-text-sub border-border'}`}>📄</button>
        </div>

        {showPassageText && (
          <div className="bg-bg-card border border-border rounded-xl p-4 mb-4 shadow-sm">
            <h3 className="text-xs font-bold text-primary mb-2">📄 Passage</h3>
            <p className="text-sm text-text-main italic mb-2 leading-relaxed">{passage.en}</p>
            <p className="text-xs text-text-sub leading-relaxed">{passage.bn}</p>
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
                      <h4 className={`font-bold text-base ${w.type === 'syn' ? 'text-syn-text' : 'text-ant-text'}`}>{w.word}</h4>
                      <button onClick={() => speak(w.word)} className={`p-1 rounded-md ${w.type === 'syn' ? 'text-syn-text' : 'text-ant-text'}`}>
                        <Volume2 size={14} />
                      </button>
                    </div>
                    <p className={`text-[10px] opacity-80 ${w.type === 'syn' ? 'text-syn-text' : 'text-ant-text'}`}>[{w.pron}] · {w.pos}</p>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-md font-bold text-white ${w.type === 'syn' ? 'bg-syn-text' : 'bg-ant-text'}`}>
                  {w.type === 'syn' ? 'SYN' : 'ANT'}
                </span>
              </div>
              <div className="p-3">
                <p className="font-bold text-sm text-text-main mb-1">{w.bn}</p>
                <p className="text-xs text-text-main italic mb-1">{w.exEn}</p>
                <p className="text-[10px] text-text-sub mb-3">{w.exBn}</p>
                
                <div className="flex flex-col gap-1">
                  {w.items.map(([en, pron, bn], i) => (
                    <div key={i} className={`flex items-center gap-2 p-2 rounded-lg ${i % 2 === 0 ? (w.type === 'syn' ? 'bg-syn-bg/50' : 'bg-ant-bg/50') : 'bg-bg-main'}`}>
                      <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${w.type === 'syn' ? 'bg-syn-text/10 text-syn-text' : 'bg-ant-text/10 text-ant-text'}`}>{i+1}</span>
                      <div className="flex-1 flex items-center gap-1">
                        <span className={`font-bold text-xs ${w.type === 'syn' ? 'text-syn-text' : 'text-ant-text'}`}>{en}</span>
                        <button onClick={() => speak(en)} className="text-text-sub"><Volume2 size={12} /></button>
                        <span className="text-[10px] text-text-sub">[{pron}]</span>
                      </div>
                      <span className="text-[10px] text-text-sub text-right max-w-[100px] truncate">{bn}</span>
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
