
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

  // Trigger nitro effect locally when speed is high
  useEffect(() => {
    if (localPlayer && localPlayer.speed > 100) {
      setShowNitro(true);
      const timer = setTimeout(() => setShowNitro(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [localPlayer?.speed]);

  const handleAnswerClick = (idx: number) => {
    onAnswer(idx);
  };

  return (
    <div className="flex flex-col w-full h-screen bg-black overflow-hidden select-none">
      
      {/* TOP SECTION: Racing View (Top-Down Follow) */}
      <div className="relative flex-[1] min-h-[50%] border-b border-cyan-500/30 overflow-hidden shadow-[inset_0_-20px_40px_rgba(0,0,0,0.8)]">
        <RacingScene players={players} trackLength={trackLength} nitroActive={showNitro} />
        
        {/* HUD Layer */}
        <div className="absolute top-6 left-6 flex flex-col gap-3 pointer-events-none z-30">
          <div className="flex items-center gap-4 bg-black/70 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10">
             <div className="text-[10px] text-cyan-400 orbitron font-bold tracking-widest uppercase">Timer</div>
             <div className="text-3xl font-black orbitron tabular-nums text-white">
               {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
             </div>
          </div>
          
          <div className="flex items-center gap-4 bg-black/70 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10">
             <div className="text-[10px] text-pink-500 orbitron font-bold tracking-widest uppercase">KM/H</div>
             <div className="text-3xl font-black orbitron tabular-nums text-pink-400">
               {Math.floor(localPlayer?.speed || 0)}
             </div>
          </div>
        </div>

        {/* Rank Display */}
        <div className="absolute top-6 right-6 z-30 pointer-events-none">
           <div className="bg-cyan-500/20 backdrop-blur-md border border-cyan-500/40 px-6 py-2 rounded-2xl flex items-baseline gap-2">
              <span className="text-xs text-cyan-400 orbitron font-bold">RANK</span>
              <span className="text-4xl font-black orbitron italic text-white">
                {[...players].sort((a, b) => b.position - a.position).findIndex(p => p.isLocal) + 1}
              </span>
           </div>
        </div>

        <MiniMap players={players} trackLength={trackLength} />

        {/* Dash Text Feedback */}
        {showNitro && (
          <div className="absolute inset-x-0 bottom-10 flex justify-center pointer-events-none z-40">
            <div className="text-5xl font-black orbitron italic text-white drop-shadow-[0_0_20px_#06b6d4] animate-bounce">
              BOOST!
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM SECTION: Math Quiz Console */}
      <div className="flex-[0.8] relative bg-[#050510] p-4 md:p-8 overflow-hidden flex flex-col border-t border-white/5">
        <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col justify-center">
          
          {/* Main Progress Indicator */}
          <div className="flex justify-between items-end mb-2 px-1">
            <span className="text-[10px] orbitron text-cyan-400/60 font-bold uppercase">Race Progress</span>
            <span className="text-[10px] orbitron text-white font-bold">{Math.floor(progress)}%</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full mb-8 overflow-hidden">
             <div 
              className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 transition-all duration-1000 ease-linear" 
              style={{ width: `${progress}%` }}
             ></div>
          </div>

          {currentQuestion ? (
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_cyan]"></div>
                   <span className="text-xs orbitron text-white/60 font-bold uppercase tracking-widest">Logic Decryptor</span>
                </div>
                <div className={`px-5 py-1.5 rounded-xl border-2 font-black orbitron text-xl ${
                  questionTimer < 5 
                    ? 'bg-red-500/20 border-red-500 text-red-500 animate-pulse' 
                    : 'bg-white/5 border-white/10 text-cyan-400'
                }`}>
                  {questionTimer}s
                </div>
              </div>

              <div className="bg-gradient-to-b from-white/10 to-transparent border border-white/10 rounded-[2rem] p-6 md:p-10 mb-8 shadow-2xl backdrop-blur-sm">
                <h2 className="text-xl md:text-3xl font-bold text-center leading-relaxed text-white">
                  {currentQuestion.text}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {currentQuestion.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswerClick(idx)}
                    className="group relative h-16 md:h-24 bg-white/5 hover:bg-cyan-500/20 border-2 border-white/10 hover:border-cyan-400 rounded-2xl p-4 transition-all active:scale-95 flex flex-col justify-center items-center overflow-hidden"
                  >
                    <span className="text-[10px] orbitron text-white/30 uppercase group-hover:text-cyan-400 mb-1">Choice {idx + 1}</span>
                    <span className="text-lg md:text-xl font-bold text-center text-white">{option}</span>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center space-y-6">
               <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
               <p className="orbitron text-xs text-cyan-400 animate-pulse tracking-[0.3em]">SYNCHRONIZING...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameView;
