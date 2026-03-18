import { useState } from 'react';
import { Settings, Plus, Folder as FolderIcon, FileText, MessageCircle, Search, Moon, Sun, X, MoreVertical, Code, Download, BarChart2, FileUp, Book, Briefcase, GraduationCap, Heart, Star, Music, Globe, Cpu } from 'lucide-react';
import { useStore } from '../store';
import { ScreenType } from '../App';
import { Folder, FolderVisualTheme } from '../types';

const ICON_MAP: Record<string, React.ElementType> = {
  'Folder': FolderIcon,
  'Book': Book,
  'Briefcase': Briefcase,
  'GraduationCap': GraduationCap,
  'Heart': Heart,
  'Star': Star,
  'Music': Music,
  'Globe': Globe,
  'Cpu': Cpu,
  'Code': Code,
};

export default function HomeScreen({ onNavigate }: { onNavigate: (s: ScreenType, p?: any) => void }) {
  const folders = useStore(state => state.folders);
  const createFolder = useStore(state => state.createFolder);
  const updateFolder = useStore(state => state.updateFolder);
  const deleteFolder = useStore(state => state.deleteFolder);
  const theme = useStore(state => state.theme);
  const setTheme = useStore(state => state.setTheme);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  
  const [activeFolderMenu, setActiveFolderMenu] = useState<string | null>(null);
  const [renamingFolderId, setRenamingFolderId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);
  const [featureAlert, setFeatureAlert] = useState<{title: string, message: string} | null>(null);

  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderIcon, setNewFolderIcon] = useState('Folder');
  const [newFolderColor, setNewFolderColor] = useState('#3B82F6');
  const [newFolderTheme, setNewFolderTheme] = useState<FolderVisualTheme>('classic');
  const [newFolderGradient, setNewFolderGradient] = useState('');
  
  // Deduplicate folders by ID to handle any corrupted state from previous sessions
  const uniqueFolders = Array.from(new Map(folders.map(f => [f.id, f])).values());
  
  const stats = {
    folders: uniqueFolders.length,
    passages: uniqueFolders.reduce((acc, f) => acc + f.passages.length, 0),
    words: uniqueFolders.reduce((acc, f) => acc + f.passages.reduce((b, p) => b + p.words.length, 0), 0)
  };

  const isDarkMode = useStore(state => state.isDarkMode);
  const setIsDarkMode = useStore(state => state.setIsDarkMode);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    
    const newFolder: Folder = {
      id: `f_${Date.now()}`,
      name: newFolderName.trim(),
      emoji: newFolderIcon,
      color: newFolderColor,
      visualTheme: newFolderTheme,
      gradient: newFolderGradient,
      passages: []
    };
    
    createFolder(newFolder);
    setShowNewFolderModal(false);
    setNewFolderName('');
    setNewFolderIcon('Folder');
    setNewFolderColor('#3B82F6');
    setNewFolderTheme('classic');
    setNewFolderGradient('');
  };

  // Filter folders based on search query
  const filteredFolders = uniqueFolders.filter(folder => {
    const query = searchQuery.toLowerCase();
    const matchesFolder = folder.name.toLowerCase().includes(query);
    const matchesPassage = folder.passages.some(p => 
      p.en.toLowerCase().includes(query) || 
      p.bn.toLowerCase().includes(query) ||
      p.board.toLowerCase().includes(query)
    );
    return matchesFolder || matchesPassage;
  });

  const renderFolderCard = (folder: Folder) => {
    const baseClasses = "border rounded-2xl px-4 py-3 shadow-sm cursor-pointer hover:translate-x-1 transition-transform relative flex items-center h-[80px]";
    let themeClasses = "bg-bg-card border-border border-l-4";
    let style: React.CSSProperties = { borderLeftColor: folder.color || 'var(--primary)' };

    if (folder.visualTheme === 'glass') {
      themeClasses = "bg-white/10 backdrop-blur-md border-white/20";
      style = { ...style, background: folder.gradient || 'rgba(255,255,255,0.1)' };
    } else if (folder.visualTheme === 'minimal') {
      themeClasses = "bg-transparent border-border";
      style = { ...style, borderLeftColor: folder.color || 'var(--text-main)' };
    } else if (folder.visualTheme === 'color-card') {
      themeClasses = "border-transparent text-white";
      style = { ...style, background: folder.gradient || folder.color || 'var(--primary)' };
    } else if (folder.visualTheme === 'book-style') {
      themeClasses = "bg-[#FDFBF7] border-[#E6E2D6] border-l-8 shadow-md";
      style = { ...style, borderLeftColor: folder.color || '#8B4513' };
    }

    const isDarkText = folder.visualTheme === 'color-card' ? false : true;
    
    // Fallback to FolderIcon if the icon name is not found or if it's an old emoji
    const IconComponent = ICON_MAP[folder.emoji] || (folder.emoji && folder.emoji.length <= 2 ? () => <span className="text-3xl">{folder.emoji}</span> : FolderIcon);

    return (
      <div 
        key={folder.id} 
        onClick={() => onNavigate('folder', { folderId: folder.id })}
        className={`${baseClasses} ${themeClasses} ${activeFolderMenu === folder.id ? 'z-50' : 'z-0'}`}
        style={style}
      >
        <div className="flex items-center gap-3 relative z-10 w-full">
          <div className={`shrink-0 flex items-center justify-center w-10 h-10 rounded-xl ${isDarkText ? 'bg-primary/10 text-primary' : 'bg-white/20 text-white'}`}>
            <IconComponent size={24} />
          </div>
          <div className="flex-1 min-w-0">
            {renamingFolderId === folder.id ? (
              <input
                autoFocus
                type="text"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (renameValue.trim()) {
                      updateFolder(folder.id, { name: renameValue.trim() });
                    }
                    setRenamingFolderId(null);
                  } else if (e.key === 'Escape') {
                    setRenamingFolderId(null);
                  }
                }}
                onBlur={() => {
                  if (renameValue.trim()) {
                    updateFolder(folder.id, { name: renameValue.trim() });
                  }
                  setRenamingFolderId(null);
                }}
                className={`w-full bg-transparent border-b ${isDarkText ? 'border-text-main text-text-main' : 'border-white text-white'} focus:outline-none font-bold`}
              />
            ) : (
              <h3 className={`font-bold truncate ${isDarkText ? 'text-text-main' : 'text-white'}`}>{folder.name}</h3>
            )}
            <div className="flex items-center gap-2 mt-1">
              <p className={`text-[10px] whitespace-nowrap ${isDarkText ? 'text-text-sub' : 'text-white/80'}`}>{folder.passages.length} Passage</p>
              <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold whitespace-nowrap ${isDarkText ? 'bg-syn-bg text-syn-text' : 'bg-white/20 text-white'}`}>
                {folder.passages.reduce((a, p) => a + p.words.filter(w => w.type === 'syn').length, 0)} SYN
              </span>
              <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold whitespace-nowrap ${isDarkText ? 'bg-ant-bg text-ant-text' : 'bg-white/20 text-white'}`}>
                {folder.passages.reduce((a, p) => a + p.words.filter(w => w.type === 'ant').length, 0)} ANT
              </span>
            </div>
          </div>
          
          <div className="relative shrink-0">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setActiveFolderMenu(activeFolderMenu === folder.id ? null : folder.id);
              }}
              className={`p-1.5 rounded-full transition-colors ${isDarkText ? 'hover:bg-black/5 text-text-sub' : 'hover:bg-white/20 text-white'}`}
            >
              <MoreVertical size={18} />
            </button>
            
            {activeFolderMenu === folder.id && (
              <>
                <div className="fixed inset-0 z-20" onClick={(e) => { e.stopPropagation(); setActiveFolderMenu(null); }} />
                <div className="absolute right-0 top-8 w-32 bg-bg-card border border-border rounded-xl shadow-lg z-30 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setRenameValue(folder.name);
                      setRenamingFolderId(folder.id);
                      setActiveFolderMenu(null);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-text-main hover:bg-bg-main transition-colors"
                  >
                    Rename
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFeatureAlert({ title: 'Move Functionality', message: 'Moving folders and passages will be available in the next update!' });
                      setActiveFolderMenu(null);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-text-main hover:bg-bg-main transition-colors"
                  >
                    Move
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFolderToDelete(folder);
                      setActiveFolderMenu(null);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto pb-24 relative">
      <div className="bg-primary p-4 rounded-b-3xl shadow-md sticky top-0 z-10">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-white text-xl font-bold tracking-tight leading-none">📖 Mutu Study</h1>
            <p className="text-white/70 text-[10px] mt-1 leading-none">HSC · SSC · Admission · IELTS</p>
          </div>
          <div className="flex gap-2">
            <button onClick={toggleTheme} className="bg-white/15 p-2 rounded-xl text-white backdrop-blur-sm">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => setShowMenu(true)} className="bg-white/15 p-2 rounded-xl text-white backdrop-blur-sm">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-white/60" />
          </div>
          <input
            type="text"
            placeholder="Search folders, passages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/10 border border-white/20 text-white placeholder-white/60 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/60 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        <div className="flex gap-2">
          <StatCard icon={<FolderIcon size={18} />} count={stats.folders} label="Folders" />
          <StatCard icon={<FileText size={18} />} count={stats.passages} label="Passages" />
          <StatCard icon={<MessageCircle size={18} />} count={stats.words} label="Words" />
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg text-text-main">আমার Folders</h2>
        </div>
        
        {filteredFolders.length === 0 ? (
          <div className="text-center py-10 text-text-sub">
            <FolderIcon size={48} className="mx-auto mb-3 opacity-20" />
            <p>No folders found matching "{searchQuery}"</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredFolders.map(renderFolderCard)}
          </div>
        )}
      </div>

      {/* Bottom Sheet Menu */}
      {showMenu && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200" onClick={() => setShowMenu(false)} />
          <div className="fixed bottom-0 left-0 right-0 bg-bg-card rounded-t-3xl z-50 p-5 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom duration-300">
            <div 
              className="w-12 h-1.5 bg-border rounded-full mx-auto mb-6 cursor-pointer hover:bg-text-sub transition-colors" 
              onClick={() => setShowMenu(false)}
            />
            
            <div className="grid grid-cols-4 gap-4 mb-6">
              <MenuButton icon={<FolderIcon size={24} />} label="New Folder" onClick={() => { setShowMenu(false); setShowNewFolderModal(true); }} color="text-blue-500" bg="bg-blue-500/10" />
              <MenuButton icon={<Code size={24} />} label="Add Code" onClick={() => { setShowMenu(false); onNavigate('addCode'); }} color="text-purple-500" bg="bg-purple-500/10" />
              <MenuButton icon={<FileUp size={24} />} label="Import" onClick={() => { setShowMenu(false); setFeatureAlert({ title: 'Import', message: 'Import functionality coming soon!' }); }} color="text-green-500" bg="bg-green-500/10" />
              <MenuButton icon={<Search size={24} />} label="Search" onClick={() => { setShowMenu(false); document.querySelector('input')?.focus(); }} color="text-orange-500" bg="bg-orange-500/10" />
              <MenuButton icon={<BarChart2 size={24} />} label="Stats" onClick={() => { setShowMenu(false); setFeatureAlert({ title: 'Statistics', message: 'Detailed statistics coming soon!' }); }} color="text-pink-500" bg="bg-pink-500/10" />
              <MenuButton icon={<Settings size={24} />} label="Settings" onClick={() => { setShowMenu(false); onNavigate('settings'); }} color="text-gray-500" bg="bg-gray-500/10" />
              <MenuButton icon={<Download size={24} />} label="Export" onClick={() => { setShowMenu(false); setFeatureAlert({ title: 'Export', message: 'Export functionality coming soon!' }); }} color="text-teal-500" bg="bg-teal-500/10" />
            </div>
          </div>
        </>
      )}

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-bg-card border border-border rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-lg text-text-main">Create New Folder</h3>
              <button onClick={() => setShowNewFolderModal(false)} className="text-text-sub hover:text-text-main">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-text-sub mb-1.5 uppercase tracking-wider">Folder Name</label>
                <input 
                  type="text" 
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="e.g., IELTS Reading"
                  className="w-full bg-bg-main border border-border rounded-xl px-4 py-3 text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-text-sub mb-1.5 uppercase tracking-wider">Icon</label>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {Object.keys(ICON_MAP).map(iconName => {
                    const Icon = ICON_MAP[iconName];
                    return (
                      <button
                        key={iconName}
                        onClick={() => setNewFolderIcon(iconName)}
                        className={`p-3 rounded-xl transition-all shrink-0 flex items-center justify-center ${newFolderIcon === iconName ? 'bg-primary text-white scale-110 shadow-md' : 'bg-bg-main text-text-sub hover:bg-border'}`}
                      >
                        <Icon size={24} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-sub mb-1.5 uppercase tracking-wider">Visual Theme</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['classic', 'glass', 'minimal', 'color-card', 'book-style'] as FolderVisualTheme[]).map(t => (
                    <button
                      key={t}
                      onClick={() => setNewFolderTheme(t)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium capitalize border transition-all ${newFolderTheme === t ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-bg-main text-text-sub hover:bg-border/50'}`}
                    >
                      {t.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-sub mb-1.5 uppercase tracking-wider">Color & Gradient</label>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6'].map(color => (
                    <button
                      key={color}
                      onClick={() => { setNewFolderColor(color); setNewFolderGradient(''); }}
                      className={`w-8 h-8 rounded-full shrink-0 transition-all ${newFolderColor === color && !newFolderGradient ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  {['linear-gradient(135deg, #FF9A9E 0%, #FECFEF 99%, #FECFEF 100%)', 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)', 'linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)', 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)'].map((grad, i) => (
                    <button
                      key={i}
                      onClick={() => { setNewFolderGradient(grad); setNewFolderColor(''); }}
                      className={`w-8 h-8 rounded-full shrink-0 transition-all ${newFolderGradient === grad ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''}`}
                      style={{ background: grad }}
                    />
                  ))}
                </div>
              </div>
              
              <button 
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim()}
                className="w-full bg-primary text-white font-bold py-3 rounded-xl mt-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
              >
                Create Folder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {folderToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-bg-card border border-border rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="font-bold text-lg text-text-main mb-2">Delete Folder</h3>
            <p className="text-text-sub text-sm mb-6">Are you sure you want to delete "{folderToDelete.name}"? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setFolderToDelete(null)}
                className="flex-1 py-3 rounded-xl font-bold text-text-main bg-bg-main border border-border hover:bg-border transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  deleteFolder(folderToDelete.id);
                  setFolderToDelete(null);
                }}
                className="flex-1 py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feature Alert Modal */}
      {featureAlert && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-bg-card border border-border rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
              <FolderIcon size={32} />
            </div>
            <h3 className="font-bold text-lg text-text-main mb-2">{featureAlert.title}</h3>
            <p className="text-text-sub text-sm mb-6">{featureAlert.message}</p>
            <button 
              onClick={() => setFeatureAlert(null)}
              className="w-full py-3 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, count, label }: { icon: React.ReactNode, count: number, label: string }) {
  return (
    <div className="flex-1 bg-white/10 rounded-xl p-1.5 text-center backdrop-blur-sm">
      <div className="text-white/80 flex justify-center mb-0.5 scale-90">{icon}</div>
      <div className="text-white font-bold text-lg leading-tight">{count}</div>
      <div className="text-white/60 text-[9px] uppercase tracking-wider">{label}</div>
    </div>
  );
}

function MenuButton({ icon, label, onClick, color, bg }: { icon: React.ReactNode, label: string, onClick: () => void, color: string, bg: string }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2 group">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bg} ${color} group-active:scale-95 transition-transform`}>
        {icon}
      </div>
      <span className="text-xs font-medium text-text-main">{label}</span>
    </button>
  );
}
