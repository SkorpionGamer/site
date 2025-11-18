import React, { useState } from 'react';
import { Sparkles, Search, Loader2, X } from 'lucide-react';
import { curateCollection } from '../services/gemini';

interface GeminiCuratorProps {
  onFilter: (ids: string[] | null) => void;
}

const GeminiCurator: React.FC<GeminiCuratorProps> = ({ onFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mood, setMood] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleCurate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mood.trim()) return;

    setIsLoading(true);
    setMessage("Listening to the winter winds...");
    
    try {
      const ids = await curateCollection(mood);
      if (ids.length > 0) {
        onFilter(ids);
        setMessage(`I found ${ids.length} pieces that match the spirit of "${mood}".`);
      } else {
        setMessage("The spirits remain silent. Try a different feeling.");
        onFilter(null);
      }
    } catch (err) {
      setMessage("The connection is frozen.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilter = () => {
    setMood('');
    setMessage('');
    onFilter(null);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-cyan-900/90 hover:bg-cyan-800 text-cyan-100 p-4 rounded-full shadow-lg shadow-cyan-900/50 backdrop-blur-sm border border-cyan-500/30 transition-all hover:scale-105 flex items-center gap-2 group"
      >
        <Sparkles className="w-5 h-5 animate-pulse" />
        <span className="font-serif hidden group-hover:inline max-w-0 group-hover:max-w-xs transition-all duration-500 overflow-hidden whitespace-nowrap">
          Ask the AI Curator
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 w-80 md:w-96 bg-slate-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
      <div className="p-4 bg-gradient-to-r from-cyan-900/50 to-slate-900 border-b border-white/5 flex justify-between items-center">
        <h3 className="font-serif text-cyan-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" /> AI Curator
        </h3>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="p-4 space-y-4">
        <div className="text-sm text-slate-300 font-light">
          {message || "Tell me how you feel, or describe the atmosphere you seek. I will find the perfect art for you."}
        </div>

        <form onSubmit={handleCurate} className="relative">
          <input
            type="text"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            placeholder="e.g., Quiet solitude, chaotic storm..."
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 pl-4 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
          />
          <button 
            type="submit"
            disabled={isLoading || !mood}
            className="absolute right-2 top-2 p-1.5 bg-cyan-700 hover:bg-cyan-600 rounded-md text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </button>
        </form>

        {message && (
            <button 
                onClick={clearFilter}
                className="text-xs text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
            >
                Clear filter and show all art
            </button>
        )}
      </div>
    </div>
  );
};

export default GeminiCurator;