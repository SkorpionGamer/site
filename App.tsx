import React, { useState, useEffect } from 'react';
import SnowFall from './components/SnowFall';
import Hero from './components/Hero';
import { ART_COLLECTION } from './constants';
import { ArtPiece, CartItem } from './types';
import ArtModal from './components/ArtModal';
import GeminiCurator from './components/GeminiCurator';
import { ShoppingBag, Trash2, ArrowLeft } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'hero' | 'shop'>('hero');
  const [selectedPiece, setSelectedPiece] = useState<ArtPiece | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [filteredIds, setFilteredIds] = useState<string[] | null>(null);

  // Persist cart just for fun
  useEffect(() => {
    const saved = localStorage.getItem('frost_cart');
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch(e) {
        console.error("Failed to load cart");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('frost_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (piece: ArtPiece) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === piece.id);
      if (existing) {
        return prev.map(item => 
          item.id === piece.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...piece, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const filteredCollection = filteredIds 
    ? ART_COLLECTION.filter(p => filteredIds.includes(p.id)) 
    : ART_COLLECTION;

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <SnowFall density={120} speed={0.5} />
      
      {/* Navigation / Header (Overlay) */}
      <nav className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ${view === 'shop' ? 'bg-slate-950/80 backdrop-blur-lg border-b border-white/5' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div 
            className="font-serif text-xl font-semibold cursor-pointer z-50"
            onClick={() => setView('hero')}
          >
            FROST & CANVAS
          </div>
          
          <div className="flex items-center gap-6 z-50">
             {view === 'shop' && (
                 <button onClick={() => setView('hero')} className="text-slate-400 hover:text-white text-sm hidden md:block">
                    Back to Window
                 </button>
             )}
             <button 
                className="relative p-2 hover:text-cyan-300 transition-colors"
                onClick={() => setIsCartOpen(true)}
             >
                <ShoppingBag className="w-5 h-5" />
                {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-cyan-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                        {cart.reduce((a,b) => a + b.quantity, 0)}
                    </span>
                )}
             </button>
          </div>
        </div>
      </nav>

      {/* Cart Drawer */}
      {isCartOpen && (
          <div className="fixed inset-0 z-[60] flex justify-end">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
              <div className="relative w-full max-w-md bg-slate-900 border-l border-slate-800 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                  <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                      <h2 className="font-serif text-xl">Your Collection</h2>
                      <button onClick={() => setIsCartOpen(false)}><ArrowLeft className="w-5 h-5" /></button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                      {cart.length === 0 ? (
                          <div className="text-center text-slate-500 mt-10">
                              <p>The canvas is empty.</p>
                              <button onClick={() => setIsCartOpen(false)} className="mt-4 text-cyan-400 hover:underline">Browse Gallery</button>
                          </div>
                      ) : (
                          cart.map(item => (
                              <div key={item.id} className="flex gap-4 items-center">
                                  <img src={item.imageUrl} alt={item.title} className="w-16 h-16 object-cover rounded bg-slate-800" />
                                  <div className="flex-1">
                                      <h4 className="font-serif text-sm text-white">{item.title}</h4>
                                      <p className="text-xs text-slate-400">{item.artist}</p>
                                      <p className="text-xs text-cyan-300 mt-1">${item.price} x {item.quantity}</p>
                                  </div>
                                  <button onClick={() => removeFromCart(item.id)} className="text-slate-500 hover:text-red-400 transition-colors">
                                      <Trash2 className="w-4 h-4" />
                                  </button>
                              </div>
                          ))
                      )}
                  </div>

                  <div className="p-6 border-t border-slate-800 bg-slate-900/50">
                      <div className="flex justify-between items-center mb-4 text-lg font-serif">
                          <span>Total</span>
                          <span>${total.toLocaleString()}</span>
                      </div>
                      <button className="w-full bg-white text-slate-900 py-3 font-medium hover:bg-cyan-50 transition-colors rounded">
                          Checkout
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Main Content Switcher */}
      {view === 'hero' ? (
        <Hero onEnterShop={() => setView('shop')} />
      ) : (
        <div className="relative z-20 pt-24 px-6 pb-20 min-h-screen max-w-7xl mx-auto animate-in fade-in zoom-in-95 duration-500">
          
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-serif text-white">Current Exhibition</h2>
            <p className="text-slate-400 max-w-lg mx-auto">
                Explore our winter collection. Each piece tells a story of cold, quiet, and resilience.
            </p>
            {filteredIds && (
                <div className="inline-block bg-cyan-900/30 border border-cyan-500/30 rounded-full px-4 py-1 text-sm text-cyan-300">
                    Filtering by Curator's Selection
                </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {filteredCollection.map((piece) => (
              <div 
                key={piece.id}
                className="group relative cursor-pointer"
                onClick={() => setSelectedPiece(piece)}
              >
                <div className="aspect-[4/5] overflow-hidden rounded-sm bg-slate-900 relative">
                    <img 
                        src={piece.imageUrl} 
                        alt={piece.title} 
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    />
                    {/* Hover overlay info */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                        <span className="text-cyan-400 text-xs tracking-widest uppercase mb-1">View Details</span>
                    </div>
                </div>
                <div className="mt-4 text-center">
                    <h3 className="font-serif text-lg text-white group-hover:text-cyan-300 transition-colors">{piece.title}</h3>
                    <p className="text-sm text-slate-500">{piece.artist} — ${piece.price}</p>
                </div>
              </div>
            ))}
          </div>
          
          {filteredCollection.length === 0 && (
              <div className="text-center py-20 text-slate-500">
                  <p>No artworks found matching this mood.</p>
              </div>
          )}

          <GeminiCurator onFilter={setFilteredIds} />
        </div>
      )}

      {/* Product Modal */}
      {selectedPiece && (
        <ArtModal 
            piece={selectedPiece} 
            onClose={() => setSelectedPiece(null)} 
            onAddToCart={addToCart}
        />
      )}
    </div>
  );
};

export default App;