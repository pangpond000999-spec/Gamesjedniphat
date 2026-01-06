
import React from 'react';

interface LobbyProps {
  playerName: string;
  setPlayerName: (name: string) => void;
  onStart: () => void;
}

const Lobby: React.FC<LobbyProps> = ({ playerName, setPlayerName, onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-blue-950 to-black p-6">
      <div className="text-center mb-10 md:mb-14">
        <h1 className="text-5xl md:text-8xl font-black orbitron tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] leading-tight">
          SET RACER
        </h1>
        <p className="text-sm md:text-2xl mt-2 font-light tracking-[0.3em] text-cyan-300/80 orbitron uppercase">
          Online Math Drag Race
        </p>
      </div>

      <div className="bg-white/5 backdrop-blur-2xl p-6 md:p-8 rounded-3xl border border-white/10 w-full max-w-sm md:max-w-md shadow-2xl">
        <label className="block text-[10px] font-bold mb-3 text-cyan-400 orbitron uppercase tracking-[0.2em]">Driver Identity</label>
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="ENTER NAME"
          maxLength={15}
          className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-4 text-lg md:text-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 mb-6 transition-all text-white font-bold orbitron placeholder:text-white/20"
        />
        
        <button
          onClick={onStart}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 md:py-5 rounded-xl text-lg md:text-xl orbitron transform hover:scale-[1.02] transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3"
        >
          <span>JOIN RACE</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
        </button>

        <div className="mt-8 space-y-2 text-[10px] md:text-xs text-gray-400 border-t border-white/10 pt-6">
          <p className="flex items-center gap-2"><span className="w-1 h-1 bg-cyan-500 rounded-full shadow-[0_0_5px_cyan]"></span> 15 Multi-lane Racing Protocol</p>
          <p className="flex items-center gap-2"><span className="w-1 h-1 bg-blue-500 rounded-full"></span> 30s Strategic Matchmaking</p>
          <p className="flex items-center gap-2"><span className="w-1 h-1 bg-purple-500 rounded-full"></span> Real-time Logic Decryption</p>
          <p className="flex items-center gap-2"><span className="w-1 h-1 bg-pink-500 rounded-full"></span> Thai High School Set Theory</p>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
