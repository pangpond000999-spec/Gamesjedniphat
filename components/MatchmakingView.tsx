
import React from 'react';
import { Player } from '../types';

interface MatchmakingViewProps {
  timer: number;
  players: Player[];
  maxPlayers: number;
}

const MatchmakingView: React.FC<MatchmakingViewProps> = ({ timer, players, maxPlayers }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-slate-950 p-6 overflow-hidden">
      <div className="text-center mb-8">
        <h2 className="text-2xl orbitron text-cyan-400 font-bold tracking-[0.2em] mb-2 uppercase">Online Matchmaking</h2>
        <div className="text-6xl font-black orbitron tabular-nums text-white">
          {timer}<span className="text-2xl text-cyan-500 ml-2">s</span>
        </div>
      </div>

      <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
             <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_green]"></div>
             <span className="orbitron text-sm font-bold tracking-widest text-white/80 uppercase">Finding Players...</span>
          </div>
          <div className="orbitron text-sm text-cyan-400 font-bold">
            {players.length} / {maxPlayers}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {players.map((p, idx) => (
            <div 
              key={p.id} 
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all animate-in fade-in slide-in-from-left-4 duration-500 ${
                p.isLocal ? 'bg-cyan-500/20 border-cyan-500/40' : 'bg-white/5 border-white/5'
              }`}
            >
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }}></div>
              <span className={`font-bold orbitron text-sm ${p.isLocal ? 'text-white' : 'text-white/60'}`}>
                {p.name} {p.isLocal && '(YOU)'}
              </span>
              {!p.isLocal && <span className="ml-auto text-[10px] orbitron text-green-500 font-black">CONNECTED</span>}
            </div>
          ))}
          {players.length < maxPlayers && (
            <div className="flex items-center gap-4 p-4 rounded-2xl border border-dashed border-white/10 bg-white/0 animate-pulse">
              <div className="w-3 h-3 rounded-full bg-white/10"></div>
              <span className="orbitron text-sm text-white/20 font-bold italic">Waiting...</span>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
           <p className="text-xs text-gray-500 orbitron tracking-widest italic">
             Any empty slots will be filled with expert AI bots at 0s
           </p>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(34, 211, 238, 0.2);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default MatchmakingView;
