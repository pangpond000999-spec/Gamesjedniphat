
import React from 'react';

interface LobbyProps {
  playerName: string;
  setPlayerName: (name: string) => void;
  onStart: () => void;
}

const Lobby: React.FC<LobbyProps> = ({ playerName, setPlayerName, onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 overflow-hidden relative">
      
      {/* Cartoon Background Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-64 h-64 bg-yellow-300/30 rounded-full blur-3xl"></div>

      <div className="text-center mb-8 relative z-10">
        <div className="bg-white/90 px-8 py-4 rounded-[3rem] shadow-[0_10px_0_rgba(0,0,0,0.1)] border-4 border-white transform -rotate-2 mb-6 inline-block">
          <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 drop-shadow-sm leading-tight font-kanit">
            เกมแข่งรถ คณิตศาสตร์
          </h1>
        </div>
        <br />
        <h2 className="text-4xl md:text-7xl font-black text-white drop-shadow-[0_4px_0_rgba(0,0,0,0.2)] tracking-wider font-kanit">
          เรื่อง เซต
        </h2>
        <div className="mt-4 bg-black/20 inline-block px-6 py-2 rounded-full backdrop-blur-sm">
           <p className="text-lg md:text-2xl text-white font-bold font-kanit">
             โดย เจตนิพัทธ์ ชัยพฤกษ์
           </p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.3)] w-full max-w-sm md:max-w-md relative z-10 border-b-8 border-gray-200">
        <label className="block text-sm font-black mb-3 text-slate-500 font-kanit uppercase tracking-wider pl-2">ชื่อนักแข่ง</label>
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="พิมพ์ชื่อของคุณ..."
          maxLength={15}
          className="w-full bg-slate-100 border-2 border-slate-200 rounded-2xl px-5 py-4 text-xl md:text-2xl focus:outline-none focus:ring-4 focus:ring-purple-400 focus:border-purple-400 mb-6 transition-all text-slate-700 font-bold font-kanit placeholder:text-slate-400"
        />
        
        <button
          onClick={onStart}
          className="w-full bg-gradient-to-b from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-white font-black py-5 rounded-2xl text-2xl font-kanit transform hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(245,158,11,0.4)] transition-all shadow-[0_5px_0_#d97706] active:translate-y-0 active:shadow-none flex items-center justify-center gap-3 border-b-4 border-orange-600"
        >
          <span>เริ่มเกม!</span>
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </button>
      </div>
    </div>
  );
};

export default Lobby;
