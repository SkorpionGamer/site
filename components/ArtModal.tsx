import React, { useState, useEffect } from 'react';
import { X, Loader2, ShoppingBag } from 'lucide-react';
import { ArtPiece } from '../types';
import { generateArtCritique } from '../services/gemini';

interface ArtModalProps {
  piece: ArtPiece;
  onClose: () => void;
  onAddToCart: (piece: ArtPiece) => void;
}

const ArtModal: React.FC<ArtModalProps> = ({ piece, onClose, onAddToCart }) => {
  const [critique, setCritique] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchCritique = async () => {
      setIsLoading(true);
      // Short delay to simulate "reading" the art
      await new Promise(resolve => setTimeout(resolve, 800));
      const text = await generateArtCritique(piece.title, piece.tags, piece.artist);
      if (isMounted) {
        setCritique(text);
        setIsLoading(false);
      }
    };

    fetchCritique();

    return () => {
      isMounted = false;
    };
  }, [piece]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-slate-950 w-full max-w-5xl max-h-[90vh] rounded-xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition-all"
        >
            <X className="w-5 h-5" />
        </button>

        {/* Image Side */}
        <div className="w-full md:w-1/2 h-64 md:h-auto bg-slate-900 relative overflow-hidden group">
            <img 
                src={piece.imageUrl} 
                alt={piece.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-50 md:hidden"></div>
        </div>

        {/* Details Side */}
        <div className="w-full md:w-1/2 p-6 md:p-10 overflow-y-auto bg-gradient-to-b from-slate-950 to-slate-900">
            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl md:text-4xl font-serif text-white mb-2">{piece.title}</h2>
                    <p className="text-cyan-400 font-light text-lg">by {piece.artist}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {piece.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 text-xs uppercase tracking-wider text-slate-400 border border-slate-800 rounded-full">
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="border-l-2 border-cyan-500/30 pl-4 py-2">
                    <h3 className="text-xs font-bold text-cyan-500 uppercase tracking-widest mb-2">Curator's Note</h3>
                    {isLoading ? (
                        <div className="flex items-center gap-2 text-slate-500 text-sm animate-pulse">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Wait, interpreting the brushstrokes...
                        </div>
                    ) : (
                        <p className="text-slate-300 font-serif italic leading-relaxed text-sm md:text-base">
                            "{critique}"
                        </p>
                    )}
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-2xl font-serif text-white">${piece.price}</span>
                    <button 
                        onClick={() => {
                            onAddToCart(piece);
                            onClose();
                        }}
                        className="flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded font-medium hover:bg-cyan-50 transition-colors"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        Acquire
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ArtModal;