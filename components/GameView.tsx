
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
    <div className="flex flex-col w-full h-screen bg-slate-50 overflow-hidden select-none font-kanit">
      
      {/* TOP SECTION: Racing View */}
      <div className="relative h-[45vh] md:h-[50vh] border-b-4 border-slate-200 overflow-hidden shadow-lg z-10">
        <RacingScene players={players} trackLength={trackLength} nitroActive={showNitro} />
        
        {/* HUD Layer - Modern Cards */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 pointer-events-none z-30">
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-lg border-2 border-slate-100">
             <div className="text-[10px] text-slate-500 font-black">เวลา</div>
             <div className="text-xl md:text-2xl font-black tabular-nums text-slate-800">
               {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
             </div>
          </div>
          
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-lg border-2 border-slate-100">
             <div className="text-[10px] text-purple-500 font-black">ความเร็ว</div>
             <div className="text-xl md:text-2xl font-black tabular-nums text-purple-600">
               {Math.floor(localPlayer?.speed || 0)} <span className="text-xs text-slate-400">KM/H</span>
             </div>
          </div>
        </div>

        {/* Rank Position */}
        <div className="absolute top-3 right-3 z-30 pointer-events-none">
           <div className="bg-yellow-400/90 backdrop-blur-md border-4 border-white px-4 py-2 rounded-2xl shadow-xl flex items-baseline gap-2 transform rotate-1">
              <span className="text-[10px] text-yellow-900 font-black">อันดับ</span>
              <span className="text-2xl md:text-4xl font-black italic text-white drop-shadow-md">
                {[...players].sort((a, b) => b.position - a.position).findIndex(p => p.isLocal) + 1}
              </span>
           </div>
        </div>

        <MiniMap players={players} trackLength={trackLength} />

        {showNitro && (
          <div className="absolute inset-x-0 bottom-4 flex justify-center pointer-events-none z-40">
            <div className="text-3xl md:text-5xl font-black italic text-yellow-400 stroke-text animate-bounce drop-shadow-xl">
              NITRO!
            </div>
            <style>{`.stroke-text { -webkit-text-stroke: 2px white; }`}</style>
          </div>
        )}
      </div>

      {/* BOTTOM SECTION: Quiz Area - Clean & Friendly */}
      <div className="h-[55vh] md:h-[50vh] relative bg-white p-3 md:p-6 overflow-y-auto flex flex-col">
        <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
          
          {/* Progress Bar */}
          <div className="w-full h-3 bg-slate-100 rounded-full mb-4 overflow-hidden border border-slate-200">
             <div 
              className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 rounded-full" 
              style={{ width: `${progress}%` }}
             ></div>
          </div>

          {currentQuestion ? (
            <div className="flex flex-col flex-1">
              <div className="flex justify-between items-center mb-2 px-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">คำถาม</span>
                <div className={`px-3 py-1 rounded-lg font-bold text-sm md:text-lg border-2 ${
                  questionTimer < 5 ? 'bg-red-50 border-red-200 text-red-500 animate-pulse' : 'bg-blue-50 border-blue-100 text-blue-500'
                }`}>
                  เวลา: {questionTimer}s
                </div>
              </div>

              <div className="bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 md:p-8 mb-3 md:mb-6 flex items-center justify-center min-h-[80px] md:min-h-[140px] shadow-sm">
                <h2 className="text-base md:text-2xl font-bold text-center text-slate-700 leading-relaxed">
                  {currentQuestion.text}
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-2 md:gap-4 flex-1 pb-4">
                {currentQuestion.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => onAnswer(idx)}
                    className="group relative h-12 md:h-16 bg-white hover:bg-purple-50 border-2 border-slate-200 hover:border-purple-300 rounded-xl p-2 transition-all active:scale-[0.98] active:bg-purple-100 flex items-center justify-center overflow-hidden shadow-sm hover:shadow-md"
                  >
                    <span className="text-sm md:text-xl font-bold text-slate-600 group-hover:text-purple-600 transition-colors">{option}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1">
               <div className="w-12 h-12 border-4 border-slate-200 border-t-purple-500 rounded-full animate-spin mb-4"></div>
               <p className="font-bold text-slate-400">กำลังโหลดคำถาม...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameView;
