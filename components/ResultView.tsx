
import React from 'react';
import { Player } from '../types';

interface ResultViewProps {
  players: Player[];
  onRestart: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ players, onRestart }) => {
  const sortedPlayers = [...players].sort((a, b) => b.position - a.position);
  const localPlayerIndex = sortedPlayers.findIndex(p => p.isLocal);
  const localPlayer = players.find(p => p.isLocal);

  return (
    <div className="flex flex-col items-center justify-center min-h-full bg-slate-950 p-6">
      <div className="text-center mb-10">
        <h1 className="text-5xl md:text-7xl font-black orbitron text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-600 drop-shadow-lg">
          RACE FINISHED
        </h1>
        <p className="text-xl text-gray-400 mt-2 orbitron">YOUR RANK: #{localPlayerIndex + 1}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        {/* Score Card */}
        <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-8 flex flex-col items-center justify-center">
          <div className="text-6xl font-bold orbitron text-cyan-400 mb-2">{localPlayer?.score}</div>
          <div className="text-gray-400 orbitron tracking-widest text-sm mb-8">FINAL SCORE</div>
          
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="bg-black/40 p-4 rounded-2xl border border-white/5 text-center">
              <p className="text-xs text-gray-500 orbitron">DISTANCE</p>
              <p className="text-xl font-bold orbitron">{Math.floor(localPlayer?.position || 0)}m</p>
            </div>
            <div className="bg-black/40 p-4 rounded-2xl border border-white/5 text-center">
              <p className="text-xs text-gray-500 orbitron">TOP SPEED</p>
              <p className="text-xl font-bold orbitron">{Math.floor(localPlayer?.speed || 0)} KP/H</p>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-6">
          <h3 className="text-sm font-bold text-cyan-400 orbitron mb-4 px-2 uppercase tracking-tighter">GLOBAL LEADERBOARD</h3>
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {sortedPlayers.map((p, idx) => (
              <div 
                key={p.id} 
                className={`flex justify-between items-center p-3 rounded-xl border transition-all ${
                  p.isLocal 
                    ? 'bg-cyan-500/20 border-cyan-500/50 scale-[1.02]' 
                    : 'bg-white/5 border-transparent hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`w-8 text-center font-bold orbitron ${idx < 3 ? 'text-yellow-400 text-xl' : 'text-gray-500'}`}>
                    {idx + 1}
                  </span>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></div>
                  <span className={`font-medium ${p.isLocal ? 'text-white' : 'text-gray-300'}`}>{p.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-xs orbitron text-gray-500">{Math.floor(p.position)}m</p>
                  <p className="text-xs font-bold text-cyan-500 orbitron">{p.score} PTS</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={onRestart}
        className="mt-12 px-12 py-4 bg-white text-black font-black rounded-full orbitron hover:bg-cyan-400 transition-all transform hover:scale-105 active:scale-95 shadow-xl"
      >
        BACK TO LOBBY
      </button>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

export default ResultView;
