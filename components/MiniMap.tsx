
import React from 'react';
import { Player } from '../types';

interface MiniMapProps {
  players: Player[];
  trackLength: number;
}

const MiniMap: React.FC<MiniMapProps> = ({ players, trackLength }) => {
  return (
    <div className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 w-6 md:w-8 h-40 md:h-48 bg-black/50 backdrop-blur-md rounded-full border border-white/20 p-1 flex flex-col-reverse items-center justify-between z-30 shadow-2xl">
      <div className="w-full h-px bg-cyan-500 shadow-[0_0_5px_cyan]"></div>
      <div className="relative flex-1 w-full overflow-hidden">
        {players.map((p) => (
          <div
            key={p.id}
            className={`absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-300 ${
              p.isLocal ? 'w-2.5 h-2.5 md:w-3 md:h-3 bg-white z-10 shadow-[0_0_8px_white]' : 'bg-opacity-80'
            }`}
            style={{ 
              bottom: `${Math.min(100, (p.position / trackLength) * 100)}%`,
              backgroundColor: p.isLocal ? undefined : p.color 
            }}
          />
        ))}
      </div>
      <div className="w-full h-px bg-red-500 shadow-[0_0_5px_red]"></div>
      <div className="absolute -top-5 text-[7px] orbitron text-white/80 font-bold text-center w-full uppercase">FINISH</div>
    </div>
  );
};

export default MiniMap;
