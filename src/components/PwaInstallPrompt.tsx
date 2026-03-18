import React, { useState, useEffect } from 'react';
import { Download, X, Sparkles } from 'lucide-react';

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if already installed
    window.addEventListener('appinstalled', () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    
    setDeferredPrompt(null);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 animate-[slideUp_0.5s_ease-out]">
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div className="w-full max-w-[360px] relative overflow-hidden rounded-3xl border border-white/10 bg-black/60 backdrop-blur-2xl shadow-[0_0_40px_rgba(59,130,246,0.2)]">
        {/* Glow effect */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/40 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-500/30 rounded-full blur-3xl"></div>
        
        <div className="relative p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shrink-0 shadow-lg border border-white/20">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-white font-bold text-sm">Install Mutu Study</h3>
            <p className="text-white/60 text-xs mt-0.5 leading-tight">Get the premium app experience on your home screen.</p>
          </div>
          
          <div className="flex flex-col gap-2 shrink-0">
            <button 
              onClick={handleInstall}
              className="bg-white text-primary hover:bg-white/90 px-4 py-2 rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all active:scale-95 flex items-center gap-1"
            >
              <Download size={14} /> Install
            </button>
          </div>
          
          <button 
            onClick={() => setShowPrompt(false)}
            className="absolute top-2 right-2 p-1.5 text-white/40 hover:text-white/80 transition-colors rounded-full"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
