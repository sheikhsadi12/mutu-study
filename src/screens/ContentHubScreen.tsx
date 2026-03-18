import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, FileText, HelpCircle, BrainCircuit, Mic, Loader2, Play, Pause } from 'lucide-react';
import { useStore } from '../store';
import { ScreenType } from '../App';
import { generateSummary, generateQuiz, generateAudio } from '../lib/gemini';

export default function ContentHubScreen({ folderId, passageId, onNavigate }: { folderId: string, passageId: string, onNavigate: (s: ScreenType, p?: any) => void }) {
  const folder = useStore(state => state.folders.find(f => f.id === folderId));
  const passage = folder?.passages.find(p => p.id === passageId);
  const saveContent = useStore(state => state.saveContent);
  
  const [loading, setLoading] = useState<string | null>(null);
  const [viewingContent, setViewingContent] = useState<any>(null);

  if (!passage) return null;

  const handleGenerate = async (type: 'summary' | 'quiz' | 'audio') => {
    setLoading(type);
    try {
      let data;
      if (type === 'summary') {
        data = await generateSummary(passage.en, passage.words);
      } else if (type === 'quiz') {
        data = await generateQuiz(passage.en, passage.words);
      } else if (type === 'audio') {
        data = await generateAudio(passage.en);
      }
      
      const newContent = {
        id: `${type}_${Date.now()}`,
        type,
        label: `${type.charAt(0).toUpperCase() + type.slice(1)} - ${new Date().toLocaleDateString()}`,
        content: data,
        date: Date.now()
      };
      
      saveContent(folderId, passageId, newContent as any);
      setViewingContent(newContent);
    } catch (error) {
      console.error(error);
      alert("Failed to generate content. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const savedItems = passage.savedContent || [];
  const uniqueSavedItems = Array.from(new Map(savedItems.map(item => [item.id, item])).values());

  return (
    <div className="flex-1 flex flex-col h-full bg-bg-main">
      <div className="bg-primary p-4 shrink-0 flex items-center gap-3 shadow-sm">
        <button onClick={() => onNavigate('passage', { folderId, passageId })} className="bg-white/20 p-2 rounded-xl text-white">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-white text-base font-bold">Content Hub</h1>
          <p className="text-white/70 text-xs">AI Generated Materials</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="font-bold text-sm text-text-main mb-3">Generate New</h2>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <GenButton icon={<FileText />} label="Summary" loading={loading === 'summary'} onClick={() => handleGenerate('summary')} />
          <GenButton icon={<HelpCircle />} label="Quiz" loading={loading === 'quiz'} onClick={() => handleGenerate('quiz')} />
          <GenButton icon={<Mic />} label="Audio TTS" loading={loading === 'audio'} onClick={() => handleGenerate('audio')} />
          <GenButton icon={<BrainCircuit />} label="Mind Map" loading={false} onClick={() => alert("Coming soon!")} />
        </div>

        <h2 className="font-bold text-sm text-text-main mb-3">Saved Content</h2>
        {uniqueSavedItems.length === 0 ? (
          <p className="text-xs text-text-sub text-center py-8">No saved content yet. Generate something above!</p>
        ) : (
          <div className="flex flex-col gap-2">
            {uniqueSavedItems.map(item => (
              <div key={item.id} onClick={() => setViewingContent(item)} className="bg-bg-card border border-border p-3 rounded-xl flex items-center justify-between cursor-pointer shadow-sm hover:border-primary">
                <div>
                  <p className="font-bold text-sm text-text-main">{item.label}</p>
                  <p className="text-[10px] text-text-sub">{new Date(item.date).toLocaleString()}</p>
                </div>
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-md uppercase font-bold">{item.type}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {viewingContent && (
        <ContentModal content={viewingContent} onClose={() => setViewingContent(null)} />
      )}
    </div>
  );
}

function GenButton({ icon, label, loading, onClick }: { icon: React.ReactNode, label: string, loading: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick} 
      disabled={loading}
      className="bg-bg-card border border-border p-4 rounded-2xl flex flex-col items-center gap-2 shadow-sm active:scale-95 transition-transform disabled:opacity-50"
    >
      <div className="text-primary">
        {loading ? <Loader2 className="animate-spin" /> : icon}
      </div>
      <span className="text-xs font-bold text-text-main">{label}</span>
    </button>
  );
}

function ContentModal({ content, onClose }: { content: any, onClose: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (sourceRef.current) {
        sourceRef.current.stop();
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const toggleAudio = async () => {
    if (isPlaying) {
      if (sourceRef.current) sourceRef.current.stop();
      if (audioRef.current) audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);

    try {
      if (content.content.startsWith('data:audio/wav') || content.content.startsWith('data:audio/mp3')) {
        if (!audioRef.current) {
          audioRef.current = new Audio(content.content);
          audioRef.current.onended = () => setIsPlaying(false);
        }
        audioRef.current.play();
      } else {
        // Assume PCM or needs decoding
        if (!audioCtxRef.current) {
          audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        
        let base64Data = content.content;
        if (base64Data.startsWith('data:')) {
          base64Data = base64Data.split(',')[1];
        }

        const binaryString = atob(base64Data);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        // Try to decode as WAV first
        let audioBuffer: AudioBuffer;
        try {
          audioBuffer = await audioCtxRef.current.decodeAudioData(bytes.buffer.slice(0));
        } catch (e) {
          // Fallback to raw PCM 16-bit 24kHz
          const int16Array = new Int16Array(bytes.buffer);
          const float32Array = new Float32Array(int16Array.length);
          for (let i = 0; i < int16Array.length; i++) {
            float32Array[i] = int16Array[i] / 32768.0;
          }
          audioBuffer = audioCtxRef.current.createBuffer(1, float32Array.length, 24000);
          audioBuffer.getChannelData(0).set(float32Array);
        }

        const source = audioCtxRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioCtxRef.current.destination);
        source.onended = () => setIsPlaying(false);
        source.start();
        sourceRef.current = source;
      }
    } catch (e) {
      console.error("Audio playback failed", e);
      setIsPlaying(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center sm:items-center">
      <div className="bg-bg-main w-full max-w-[400px] h-[85vh] sm:h-[600px] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden">
        <div className="bg-primary p-4 flex items-center justify-between shrink-0">
          <h2 className="text-white font-bold">{content.label}</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white font-bold">Close</button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {content.type === 'summary' && (
            <div className="space-y-4">
              <div className="bg-bg-card p-4 rounded-xl border border-border">
                <h3 className="font-bold text-primary mb-2">Overview</h3>
                <p className="text-sm text-text-main leading-relaxed">{content.content.overview}</p>
              </div>
              <div className="bg-syn-bg p-4 rounded-xl border border-syn-border">
                <h3 className="font-bold text-syn-text mb-2">Synonyms</h3>
                {content.content.synWords?.map((w: any, i: number) => (
                  <div key={i} className="mb-2 text-sm">
                    <span className="font-bold text-syn-text">{w.word}</span> <span className="text-text-sub">→ {w.meaning}</span>
                  </div>
                ))}
              </div>
              <div className="bg-ant-bg p-4 rounded-xl border border-ant-border">
                <h3 className="font-bold text-ant-text mb-2">Antonyms</h3>
                {content.content.antWords?.map((w: any, i: number) => (
                  <div key={i} className="mb-2 text-sm">
                    <span className="font-bold text-ant-text">{w.word}</span> <span className="text-text-sub">→ {w.meaning}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {content.type === 'quiz' && (
            <div className="space-y-4">
              {content.content.map((q: any, i: number) => (
                <div key={i} className="bg-bg-card p-4 rounded-xl border border-border">
                  <p className="font-bold text-sm mb-3 text-text-main">{i+1}. {q.q}</p>
                  <div className="space-y-2">
                    {q.options.map((opt: string, j: number) => (
                      <div key={j} className={`p-2 rounded-lg text-sm border ${j === q.correct ? 'bg-syn-bg border-syn-border text-syn-text font-bold' : 'bg-bg-main border-border text-text-sub'}`}>
                        {String.fromCharCode(65+j)}. {opt}
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-text-sub italic bg-bg-main p-2 rounded-lg">{q.explanation}</p>
                </div>
              ))}
            </div>
          )}

          {content.type === 'audio' && (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Mic size={40} className="text-primary" />
              </div>
              <button 
                onClick={toggleAudio}
                className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
              </button>
              <p className="mt-4 text-sm text-text-sub">Tap to play/pause</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
