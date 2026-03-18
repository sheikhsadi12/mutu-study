import { useState, useEffect } from 'react';
import { ArrowLeft, Save, AlertCircle, FileText } from 'lucide-react';
import { useStore } from '../store';
import { ScreenType } from '../App';
import { Word } from '../types';

export default function AddCodeScreen({ onNavigate }: { onNavigate: (s: ScreenType, p?: any) => void }) {
  const folders = useStore(state => state.folders);
  const addPassageToFolder = useStore(state => state.addPassageToFolder);
  const createFolder = useStore(state => state.createFolder);
  
  const [inputText, setInputText] = useState('');
  const [parsedWords, setParsedWords] = useState<Word[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>(folders[0]?.id || 'new');
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderEmoji, setNewFolderEmoji] = useState('📁');
  const [passageName, setPassageName] = useState('');

  useEffect(() => {
    parseText(inputText);
  }, [inputText]);

  const parseText = (text: string) => {
    if (!text.trim()) {
      setParsedWords([]);
      return;
    }

    const lines = text.split('\n').filter(line => line.trim() !== '');
    const words: Word[] = [];
    let idCounter = 1;

    lines.forEach(line => {
      // Try to parse JSON first
      try {
        const data = JSON.parse(line);
        if (data.words && Array.isArray(data.words)) {
          words.push(...data.words);
          return;
        }
      } catch (e) {
        // Not JSON, continue with text parsing
      }

      // Format: Word - Syn1, Syn2 | Ant1, Ant2
      const dashIndex = line.indexOf('-');
      if (dashIndex === -1) return;

      const wordPart = line.substring(0, dashIndex).trim();
      const rest = line.substring(dashIndex + 1).trim();
      
      if (!wordPart || !rest) return;

      const [synPart, antPart] = rest.split('|').map(s => s.trim());

      if (synPart) {
        const syns = synPart.split(',').map(s => s.trim()).filter(Boolean);
        if (syns.length > 0) {
          words.push({
            id: String(idCounter++),
            word: wordPart,
            type: 'syn',
            pos: '',
            bn: '',
            items: syns.map(s => [s, '', ''])
          });
        }
      }

      if (antPart) {
        const ants = antPart.split(',').map(s => s.trim()).filter(Boolean);
        if (ants.length > 0) {
          words.push({
            id: String(idCounter++),
            word: wordPart,
            type: 'ant',
            pos: '',
            bn: '',
            items: ants.map(a => [a, '', ''])
          });
        }
      }
    });

    setParsedWords(words);
  };

  const handleSave = () => {
    if (parsedWords.length === 0) return;

    let targetFolderId = selectedFolder;

    if (selectedFolder === 'new') {
      if (!newFolderName.trim()) return;
      targetFolderId = `f_${Date.now()}`;
      createFolder({
        id: targetFolderId,
        name: newFolderName,
        emoji: newFolderEmoji,
        passages: []
      });
    }

    const newPassage = {
      id: `p_${Date.now()}`,
      passageNo: passageName || 'New',
      board: 'Custom',
      year: new Date().getFullYear().toString(),
      en: 'Custom vocabulary list.',
      bn: '',
      words: parsedWords,
      chatHistory: [],
      savedContent: []
    };

    addPassageToFolder(targetFolderId, newPassage);
    onNavigate('home');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-bg-main relative">
      <div className="bg-primary p-4 shrink-0 flex items-center gap-3 shadow-md z-10">
        <button onClick={() => onNavigate('home')} className="bg-white/20 p-2 rounded-xl text-white">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-white text-base font-bold">Add Code / Notes</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 pb-24">
        <div className="bg-bg-card border border-border rounded-2xl p-4 shadow-sm">
          <label className="block text-xs font-bold text-text-sub mb-2 uppercase tracking-wider">Passage Name (Optional)</label>
          <input 
            type="text" 
            value={passageName}
            onChange={(e) => setPassageName(e.target.value)}
            placeholder="e.g., Chapter 1 Vocab"
            className="w-full bg-bg-main border border-border rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all mb-4"
          />

          <label className="block text-xs font-bold text-text-sub mb-2 uppercase tracking-wider">Paste Content</label>
          <p className="text-xs text-text-sub mb-2">Format: <code className="bg-bg-main px-1 rounded">Word - Synonym1, Synonym2 | Antonym</code></p>
          <textarea 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full h-40 bg-bg-main border border-border rounded-xl p-3 text-sm text-text-main outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
            placeholder="Happy - Joyful, Cheerful | Sad&#10;Strong - Powerful | Weak"
          />
        </div>

        {parsedWords.length > 0 && (
          <div className="bg-bg-card border border-border rounded-2xl p-4 shadow-sm">
            <h3 className="font-bold text-sm text-text-main mb-3 flex items-center gap-2">
              <FileText size={16} className="text-primary" /> Live Preview ({parsedWords.length} cards)
            </h3>
            <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-2 scrollbar-hide">
              {parsedWords.map((w, idx) => (
                <div key={idx} className={`border rounded-xl p-3 ${w.type === 'syn' ? 'border-syn-border bg-syn-bg/30' : 'border-ant-border bg-ant-bg/30'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`font-bold ${w.type === 'syn' ? 'text-syn-text' : 'text-ant-text'}`}>{w.word}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold text-white ${w.type === 'syn' ? 'bg-syn-text' : 'bg-ant-text'}`}>
                      {w.type === 'syn' ? 'SYN' : 'ANT'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {w.items.map((item, i) => (
                      <span key={i} className="text-xs bg-bg-card border border-border px-2 py-1 rounded-md text-text-main">
                        {item[0]}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-bg-card border border-border rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold text-sm text-text-main mb-3">Save Location</h3>
          <select 
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="w-full bg-bg-main border border-border rounded-xl p-3 text-sm text-text-main outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all mb-3"
          >
            {folders.map(f => (
              <option key={f.id} value={f.id}>{f.emoji} {f.name}</option>
            ))}
            <option value="new">➕ Create New Folder</option>
          </select>

          {selectedFolder === 'new' && (
            <div className="flex gap-2 animate-in slide-in-from-top-2 duration-200">
              <input 
                type="text" 
                value={newFolderEmoji}
                onChange={(e) => setNewFolderEmoji(e.target.value)}
                className="w-14 bg-bg-main border border-border rounded-xl p-3 text-center text-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
              <input 
                type="text" 
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder Name"
                className="flex-1 bg-bg-main border border-border rounded-xl p-3 text-sm text-text-main outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-bg-main border-t border-border z-20">
        <button 
          onClick={handleSave}
          disabled={parsedWords.length === 0 || (selectedFolder === 'new' && !newFolderName.trim())}
          className="w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow-lg flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
        >
          <Save size={20} /> Save {parsedWords.length > 0 ? `${parsedWords.length} Cards` : ''}
        </button>
      </div>
    </div>
  );
}
