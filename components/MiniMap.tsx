
import React from 'react';
import { Player } from '../types';

interface MiniMapProps {
  players: Player[];
  trackLength: number;
}

const MiniMap: React.FC<MiniMapProps> = ({ players, trackLength }) => {
  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-48 bg-black/40 backdrop-blur-md rounded-full border border-white/20 p-1 flex flex-col-reverse items-center justify-between z-30">
      <div className="w-full h-px bg-cyan-500 shadow-[0_0_5px_cyan]"></div>
      <div className="relative flex-1 w-full">
        {players.map((p) => (
          <div
            key={p.id}
            className={`absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full transition-all duration-500 ${
              p.isLocal ? 'w-3 h-3 bg-white z-10 shadow-[0_0_8px_white]' : 'bg-opacity-60'
            }`}
            style={{ 
              bottom: `${(p.position / trackLength) * 100}%`,
              backgroundColor: p.isLocal ? undefined : p.color 
            }}
          />
        ))}
      </div>
      <div className="w-full h-px bg-red-500 shadow-[0_0_5px_red]"></div>
      <div className="absolute -top-6 text-[8px] orbitron text-white text-center w-full uppercase">Goal</div>
    </div>
  );
};

export default MiniMap;
