import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import { useStore } from '../store';
import { ScreenType } from '../App';
import { generateTutorResponse } from '../lib/gemini';
import Markdown from 'react-markdown';

export default function TutorScreen({ folderId, passageId, onNavigate }: { folderId: string, passageId: string, onNavigate: (s: ScreenType, p?: any) => void }) {
  const folder = useStore(state => state.folders.find(f => f.id === folderId));
  const passage = folder?.passages.find(p => p.id === passageId);
  const updateChatHistory = useStore(state => state.updateChatHistory);
  
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (!passage) return null;

  const chatHistory = passage.chatHistory || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = input.trim();
    setInput('');
    updateChatHistory(folderId, passageId, { role: 'user', text: userMsg });
    setLoading(true);

    try {
      const responseText = await generateTutorResponse(passage.en, chatHistory, userMsg);
      updateChatHistory(folderId, passageId, { role: 'model', text: responseText });
    } catch (error) {
      console.error(error);
      updateChatHistory(folderId, passageId, { role: 'model', text: "Sorry, I encountered an error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-bg-main">
      <div className="bg-primary p-4 shrink-0 flex items-center gap-3 shadow-sm">
        <button onClick={() => onNavigate('passage', { folderId, passageId })} className="bg-white/20 p-2 rounded-xl text-white">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-white text-base font-bold">AI Tutor</h1>
          <p className="text-white/70 text-xs">Ask anything about Passage {passage.passageNo}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {chatHistory.length === 0 && (
          <div className="text-center text-text-sub text-sm mt-10">
            <p>👋 Hello! I am your AI Tutor.</p>
            <p>Ask me to explain grammar, translate sentences, or clarify meanings from the passage.</p>
          </div>
        )}
        
        {chatHistory.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${msg.role === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-bg-card text-text-main border border-border rounded-bl-none'}`}>
              {msg.role === 'user' ? (
                msg.text
              ) : (
                <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-snug prose-p:my-1">
                  <Markdown>{msg.text}</Markdown>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-bg-card border border-border rounded-2xl rounded-bl-none p-3 shadow-sm">
              <Loader2 size={18} className="animate-spin text-primary" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-bg-card border-t border-border shrink-0">
        <div className="flex items-center gap-2 bg-bg-main rounded-full p-1 border border-border">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question..."
            className="flex-1 bg-transparent px-4 py-2 text-sm outline-none text-text-main"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="bg-primary text-white p-2 rounded-full disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
