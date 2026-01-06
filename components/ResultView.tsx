
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
    <div className="flex flex-col items-center justify-start min-h-screen bg-[#02040a] p-5 overflow-y-auto">
      <div className="text-center mt-10 mb-8">
        <h1 className="text-4xl md:text-7xl font-black orbitron text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-600 drop-shadow-lg italic">
          RACE OVER
        </h1>
        <p className="text-lg md:text-xl text-cyan-400/80 mt-2 orbitron font-bold tracking-widest uppercase">
          RESULT: RANK #{localPlayerIndex + 1}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-5xl mb-10">
        {/* Score Card */}
        <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-6 md:p-8 flex flex-col items-center justify-center">
          <div className="text-5xl md:text-7xl font-black orbitron text-white mb-1">{localPlayer?.score}</div>
          <div className="text-xs md:text-sm text-cyan-400 orbitron tracking-[0.3em] mb-8 font-bold">TOTAL PERFORMANCE</div>
          
          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="bg-black/60 p-4 rounded-2xl border border-white/5 text-center">
              <p className="text-[9px] text-gray-500 orbitron font-bold uppercase">DISTANCE</p>
              <p className="text-lg md:text-xl font-bold orbitron text-white">{Math.floor(localPlayer?.position || 0)}m</p>
            </div>
            <div className="bg-black/60 p-4 rounded-2xl border border-white/5 text-center">
              <p className="text-[9px] text-gray-500 orbitron font-bold uppercase">FINAL SPEED</p>
              <p className="text-lg md:text-xl font-bold orbitron text-pink-500">{Math.floor(localPlayer?.speed || 0)} <span className="text-[10px]">KM/H</span></p>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-5 md:p-6">
          <h3 className="text-[10px] md:text-xs font-bold text-cyan-400 orbitron mb-4 px-1 uppercase tracking-widest">Global Rankings</h3>
          <div className="space-y-1.5 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
            {sortedPlayers.map((p, idx) => (
              <div 
                key={p.id} 
                className={`flex justify-between items-center p-3 rounded-xl border transition-all ${
                  p.isLocal 
                    ? 'bg-cyan-500/20 border-cyan-500/50 ring-1 ring-cyan-500/30' 
                    : 'bg-white/5 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 text-center font-black orbitron text-sm ${idx < 3 ? 'text-yellow-400' : 'text-gray-500'}`}>
                    {idx + 1}
                  </span>
                  <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: p.color }}></div>
                  <span className={`text-sm font-bold truncate max-w-[120px] ${p.isLocal ? 'text-white' : 'text-white/60'}`}>{p.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-[9px] orbitron text-gray-500">{Math.floor(p.position)}m</p>
                  <p className="text-[11px] font-black text-cyan-400 orbitron">{p.score} <span className="text-[8px] opacity-60">PTS</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={onRestart}
        className="mb-10 px-10 py-4 bg-white text-black font-black rounded-2xl orbitron hover:bg-cyan-400 transition-all transform hover:scale-105 active:scale-95 shadow-2xl flex items-center gap-3"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
        <span>NEW GAME</span>
      </button>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(34, 211, 238, 0.3);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default ResultView;
