import { useState } from 'react';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { useStore } from '../store';
import { ScreenType } from '../App';

export default function AddCodeScreen({ onNavigate }: { onNavigate: (s: ScreenType, p?: any) => void }) {
  const folders = useStore(state => state.folders);
  const addPassageToFolder = useStore(state => state.addPassageToFolder);
  const createFolder = useStore(state => state.createFolder);
  
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');
  const [parsedData, setParsedData] = useState<any>(null);
  const [selectedFolder, setSelectedFolder] = useState<string>(folders[0]?.id || 'new');
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderEmoji, setNewFolderEmoji] = useState('📁');

  const handlePreview = () => {
    try {
      const data = JSON.parse(jsonInput);
      if (!data.passageNo || !data.en || !data.words) {
        throw new Error("Invalid format. Missing required fields.");
      }
      setParsedData(data);
      setError('');
    } catch (e: any) {
      setError(e.message || "Invalid JSON format.");
      setParsedData(null);
    }
  };

  const handleSave = () => {
    if (!parsedData) return;

    let targetFolderId = selectedFolder;

    if (selectedFolder === 'new') {
      if (!newFolderName.trim()) {
        setError("Please enter a folder name.");
        return;
      }
      targetFolderId = `f_${Date.now()}`;
      createFolder({
        id: targetFolderId,
        name: newFolderName,
        emoji: newFolderEmoji,
        passages: []
      });
    }

    const newPassage = {
      ...parsedData,
      id: `p_${Date.now()}`,
      chatHistory: [],
      savedContent: []
    };

    addPassageToFolder(targetFolderId, newPassage);
    onNavigate('home');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-bg-main">
      <div className="bg-primary p-4 shrink-0 flex items-center gap-3 shadow-sm">
        <button onClick={() => onNavigate('home')} className="bg-white/20 p-2 rounded-xl text-white">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-white text-base font-bold">Add Passage Code</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {!parsedData ? (
          <>
            <p className="text-sm text-text-sub">Paste the JSON code for the new passage below.</p>
            <textarea 
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="w-full h-64 bg-bg-card border border-border rounded-xl p-3 text-xs font-mono text-text-main outline-none focus:border-primary"
              placeholder='{"passageNo": "02", "board": "DB", "year": "25", "en": "...", "bn": "...", "words": []}'
            />
            {error && (
              <div className="flex items-center gap-2 text-ant-text bg-ant-bg p-3 rounded-xl text-sm">
                <AlertCircle size={16} /> {error}
              </div>
            )}
            <button 
              onClick={handlePreview}
              className="bg-primary text-white font-bold py-3 rounded-xl shadow-md w-full"
            >
              Preview Data
            </button>
          </>
        ) : (
          <>
            <div className="bg-bg-card border border-border rounded-xl p-4 shadow-sm">
              <h3 className="font-bold text-primary mb-1">Passage {parsedData.passageNo} · {parsedData.board}'{parsedData.year}</h3>
              <p className="text-xs text-text-sub line-clamp-2 mb-3">{parsedData.en}</p>
              <div className="flex gap-2">
                <span className="bg-syn-bg text-syn-text text-[10px] px-2 py-1 rounded-md font-bold">
                  {parsedData.words.filter((w:any) => w.type === 'syn').length} SYN
                </span>
                <span className="bg-ant-bg text-ant-text text-[10px] px-2 py-1 rounded-md font-bold">
                  {parsedData.words.filter((w:any) => w.type === 'ant').length} ANT
                </span>
              </div>
            </div>

            <div className="bg-bg-card border border-border rounded-xl p-4 shadow-sm">
              <h3 className="font-bold text-sm text-text-main mb-3">Select Folder</h3>
              <select 
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                className="w-full bg-bg-main border border-border rounded-lg p-3 text-sm text-text-main outline-none mb-3"
              >
                {folders.map(f => (
                  <option key={f.id} value={f.id}>{f.emoji} {f.name}</option>
                ))}
                <option value="new">➕ Create New Folder</option>
              </select>

              {selectedFolder === 'new' && (
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newFolderEmoji}
                    onChange={(e) => setNewFolderEmoji(e.target.value)}
                    className="w-12 bg-bg-main border border-border rounded-lg p-3 text-center text-lg outline-none"
                  />
                  <input 
                    type="text" 
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Folder Name"
                    className="flex-1 bg-bg-main border border-border rounded-lg p-3 text-sm text-text-main outline-none"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-auto pt-4">
              <button 
                onClick={() => setParsedData(null)}
                className="flex-1 bg-bg-card border border-border text-text-main font-bold py-3 rounded-xl"
              >
                Back
              </button>
              <button 
                onClick={handleSave}
                className="flex-[2] bg-primary text-white font-bold py-3 rounded-xl shadow-md flex justify-center items-center gap-2"
              >
                <Save size={18} /> Save Passage
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
