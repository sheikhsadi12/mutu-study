import { Settings, Plus, Folder as FolderIcon, FileText, MessageCircle } from 'lucide-react';
import { useStore } from '../store';
import { ScreenType } from '../App';

export default function HomeScreen({ onNavigate }: { onNavigate: (s: ScreenType, p?: any) => void }) {
  const folders = useStore(state => state.folders);
  
  // Deduplicate folders by ID to handle any corrupted state from previous sessions
  const uniqueFolders = Array.from(new Map(folders.map(f => [f.id, f])).values());
  
  const stats = {
    folders: uniqueFolders.length,
    passages: uniqueFolders.reduce((acc, f) => acc + f.passages.length, 0),
    words: uniqueFolders.reduce((acc, f) => acc + f.passages.reduce((b, p) => b + p.words.length, 0), 0)
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto pb-24">
      <div className="bg-primary p-5 rounded-b-3xl shadow-md sticky top-0 z-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-white text-2xl font-bold tracking-tight">📖 Mutu Study</h1>
            <p className="text-white/70 text-xs mt-1">HSC · SSC · Admission · IELTS</p>
          </div>
          <button onClick={() => onNavigate('settings')} className="bg-white/15 p-2 rounded-xl text-white backdrop-blur-sm">
            <Settings size={20} />
          </button>
        </div>
        
        <div className="flex gap-2">
          <StatCard icon={<FolderIcon size={18} />} count={stats.folders} label="Folders" />
          <StatCard icon={<FileText size={18} />} count={stats.passages} label="Passages" />
          <StatCard icon={<MessageCircle size={18} />} count={stats.words} label="Words" />
        </div>
      </div>

      <div className="p-5">
        <h2 className="font-bold text-lg mb-4 text-text-main">আমার Folders</h2>
        <div className="flex flex-col gap-3">
          {uniqueFolders.map(folder => (
            <div 
              key={folder.id} 
              onClick={() => onNavigate('folder', { folderId: folder.id })}
              className="bg-bg-card border border-border rounded-2xl p-4 shadow-sm cursor-pointer hover:translate-x-1 transition-transform border-l-4 border-l-primary"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{folder.emoji}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-text-main">{folder.name}</h3>
                  <p className="text-xs text-text-sub">{folder.passages.length}টি Passage</p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="bg-syn-bg text-syn-text text-[10px] px-2 py-1 rounded-md font-bold">
                  🔵 {folder.passages.reduce((a, p) => a + p.words.filter(w => w.type === 'syn').length, 0)} SYN
                </span>
                <span className="bg-ant-bg text-ant-text text-[10px] px-2 py-1 rounded-md font-bold">
                  🔴 {folder.passages.reduce((a, p) => a + p.words.filter(w => w.type === 'ant').length, 0)} ANT
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={() => onNavigate('addCode')}
        className="fixed bottom-6 right-6 bg-primary text-white rounded-full px-5 py-3 font-bold shadow-lg flex items-center gap-2 z-20"
      >
        <Plus size={20} /> Add Code
      </button>
    </div>
  );
}

function StatCard({ icon, count, label }: { icon: React.ReactNode, count: number, label: string }) {
  return (
    <div className="flex-1 bg-white/10 rounded-xl p-2 text-center backdrop-blur-sm">
      <div className="text-white/80 flex justify-center mb-1">{icon}</div>
      <div className="text-white font-bold text-xl">{count}</div>
      <div className="text-white/60 text-[10px] uppercase tracking-wider">{label}</div>
    </div>
  );
}
