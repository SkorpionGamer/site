import React from 'react';
import { ArrowDown } from 'lucide-react';

interface HeroProps {
  onEnterShop: () => void;
}

const Hero: React.FC<HeroProps> = ({ onEnterShop }) => {
  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image (The "Outside") */}
      <div 
        className="absolute inset-0 bg-cover bg-center scale-110 transform"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1483664852095-d6cc6870705d?q=80&w=2070&auto=format&fit=crop")',
        }}
      >
         {/* Dark overlay for contrast */}
         <div className="absolute inset-0 bg-slate-900/30"></div>
      </div>

      {/* The "Window" Container */}
      <div className="relative z-10 p-8 md:p-16 max-w-3xl text-center">
        {/* Glass Pane Effect */}
        <div className="absolute inset-0 backdrop-blur-md bg-white/10 rounded-lg border border-white/20 shadow-2xl shadow-cyan-900/50"></div>
        
        {/* Frost accents (SVG or CSS borders) */}
        <div className="absolute inset-0 rounded-lg border-2 border-white/10 pointer-events-none"></div>

        {/* Content */}
        <div className="relative z-20 space-y-6">
          <h1 className="text-5xl md:text-7xl font-serif text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] tracking-wider">
            FROST & CANVAS
          </h1>
          <p className="text-lg md:text-xl text-cyan-50 font-light max-w-xl mx-auto leading-relaxed drop-shadow-md">
            Where the chill of winter meets the warmth of imagination. 
            Experience art curated by the season's silence.
          </p>
          
          <div className="pt-8">
            <button 
              onClick={onEnterShop}
              className="group relative px-8 py-4 bg-slate-900/80 hover:bg-slate-800 text-white font-serif tracking-widest uppercase border border-cyan-500/30 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Enter Gallery <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
              </span>
              <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;