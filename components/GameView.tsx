
import React, { useState, useEffect } from 'react';
import { Player, Question } from '../types';
import RacingScene from './RacingScene';
import MiniMap from './MiniMap';

interface GameViewProps {
  players: Player[];
  timeLeft: number;
  questionTimer: number;
  currentQuestion: Question | undefined;
  onAnswer: (index: number) => void;
  trackLength: number;
}

const GameView: React.FC<GameViewProps> = ({ 
  players, 
  timeLeft, 
  questionTimer, 
  currentQuestion, 
  onAnswer,
  trackLength
}) => {
  const localPlayer = players.find(p => p.isLocal);
  const progress = localPlayer ? (localPlayer.position / trackLength) * 100 : 0;
  const [showNitro, setShowNitro] = useState(false);

  useEffect(() => {
    if (localPlayer && localPlayer.speed > 130) {
      setShowNitro(true);
      const timer = setTimeout(() => setShowNitro(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [localPlayer?.speed]);

  return (
    <div className="flex flex-col w-full h-screen bg-black overflow-hidden select-none">
      
      {/* TOP SECTION: Racing View (45% of screen on mobile) */}
      <div className="relative h-[45vh] md:h-[50vh] border-b border-cyan-500/30 overflow-hidden shadow-[inset_0_-20px_50px_rgba(0,0,0,0.95)]">
        <RacingScene players={players} trackLength={trackLength} nitroActive={showNitro} />
        
        {/* Compact HUD for mobile */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none z-30">
          <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md px-2 py-1 rounded border border-white/10 shadow-lg">
             <div className="text-[7px] text-cyan-400 orbitron font-bold">TIME</div>
             <div className="text-sm md:text-xl font-black orbitron tabular-nums text-white">
               {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
             </div>
          </div>
          
          <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md px-2 py-1 rounded border border-white/10 shadow-lg">
             <div className="text-[7px] text-pink-500 orbitron font-bold">KM/H</div>
             <div className="text-sm md:text-xl font-black orbitron tabular-nums text-pink-400">
               {Math.floor(localPlayer?.speed || 0)}
             </div>
          </div>
        </div>

        {/* Rank Position */}
        <div className="absolute top-3 right-3 z-30 pointer-events-none">
           <div className="bg-cyan-500/30 backdrop-blur-md border border-cyan-500/50 px-2 py-1 rounded flex items-baseline gap-1.5">
              <span className="text-[7px] text-cyan-300 orbitron font-bold">POS</span>
              <span className="text-lg md:text-2xl font-black orbitron italic text-white">
                {[...players].sort((a, b) => b.position - a.position).findIndex(p => p.isLocal) + 1}
              </span>
           </div>
        </div>

        <MiniMap players={players} trackLength={trackLength} />

        {showNitro && (
          <div className="absolute inset-x-0 bottom-4 flex justify-center pointer-events-none z-40">
            <div className="text-2xl font-black orbitron italic text-cyan-400 animate-pulse drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
              NITRO BOOST
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM SECTION: Math Quiz Terminal (55% of screen on mobile) */}
      <div className="h-[55vh] md:h-[50vh] relative bg-[#020205] p-3 md:p-8 overflow-y-auto flex flex-col">
        <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
          
          {/* Subtle Race Progress */}
          <div className="w-full h-1 bg-white/10 rounded-full mb-4 overflow-hidden">
             <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300" 
              style={{ width: `${progress}%` }}
             ></div>
          </div>

          {currentQuestion ? (
            <div className="flex flex-col flex-1">
              <div className="flex justify-between items-center mb-2 px-1">
                <span className="text-[8px] orbitron text-cyan-500/60 font-black uppercase tracking-[0.2em]">Logic Decryptor v3.1</span>
                <div className={`px-2 py-0.5 rounded font-bold orbitron text-[10px] md:text-base border ${
                  questionTimer < 5 ? 'bg-red-500/20 border-red-500 text-red-500 animate-pulse' : 'bg-white/5 border-white/10 text-cyan-400'
                }`}>
                  {questionTimer}s
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 md:p-10 mb-3 md:mb-6 flex items-center justify-center min-h-[70px] md:min-h-[140px] shadow-inner">
                <h2 className="text-sm md:text-2xl font-bold text-center text-white leading-relaxed">
                  {currentQuestion.text}
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-2 md:gap-4 flex-1 pb-4">
                {currentQuestion.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => onAnswer(idx)}
                    className="group relative h-11 md:h-16 bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/50 rounded-lg p-2 transition-all active:scale-[0.98] flex items-center justify-center overflow-hidden"
                  >
                    <span className="text-xs md:text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">{option}</span>
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1">
               <div className="w-10 h-10 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
               <p className="orbitron text-[9px] text-cyan-500 tracking-[0.4em] animate-pulse">CONNECTING TO GRID...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameView;
