
import React from 'react';

interface LobbyProps {
  playerName: string;
  setPlayerName: (name: string) => void;
  onStart: () => void;
}

const Lobby: React.FC<LobbyProps> = ({ playerName, setPlayerName, onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-blue-900 to-black p-4">
      <div className="text-center mb-12">
        <h1 className="text-6xl md:text-8xl font-black orbitron tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
          SET RACER 2D
        </h1>
        <p className="text-xl md:text-2xl mt-4 font-light tracking-widest text-cyan-300 orbitron">
          ONLINE MATH COMPETITION
        </p>
      </div>

      <div className="bg-white/5 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 w-full max-w-md shadow-2xl">
        <label className="block text-xs font-bold mb-2 text-cyan-400 orbitron uppercase tracking-widest">Driver Name</label>
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Enter your name..."
          className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-4 text-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 mb-6 transition-all text-white font-bold"
        />
        
        <button
          onClick={onStart}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-5 rounded-xl text-xl orbitron transform hover:scale-[1.02] transition-all shadow-lg active:scale-95"
        >
          FIND MATCH
        </button>

        <div className="mt-8 space-y-3 text-sm text-gray-400 border-t border-white/10 pt-6">
          <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></span> 15 Players Online Competition</p>
          <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> 30s Matchmaking Phase</p>
          <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span> Top-Down 2D Physics</p>
          <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-pink-500 rounded-full"></span> Set Theory Math Challenge</p>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
