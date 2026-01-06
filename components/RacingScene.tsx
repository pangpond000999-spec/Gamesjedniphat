
import React from 'react';
import { Player } from '../types';

interface RacingSceneProps {
  players: Player[];
  trackLength: number;
  nitroActive: boolean;
}

const RacingScene: React.FC<RacingSceneProps> = ({ players, trackLength, nitroActive }) => {
  const localPlayer = players.find(p => p.isLocal);
  const currentPos = localPlayer?.position || 0;

  const LANES = 15;
  const LANE_WIDTH = 60; 
  const ROAD_WIDTH = LANES * LANE_WIDTH;
  const SCALE = 12; // Adjusted scale for better movement feel

  return (
    <div className="w-full h-full bg-[#0a0a0a] overflow-hidden relative flex justify-center items-center perspective-[1000px]">
      
      {/* Background/Ground */}
      <div className="absolute inset-0 bg-[#0d1a0d] -z-20"></div>

      {/* The 3D Road Container */}
      <div 
        className="relative h-[200%] w-full flex justify-center transition-transform duration-300"
        style={{ 
          transform: 'rotateX(25deg) translateY(-20%)',
          transformStyle: 'preserve-3d'
        }}
      >
        <div 
          className="relative h-full bg-[#1a1a1a] border-x-8 border-gray-700 shadow-[0_0_100px_rgba(0,0,0,0.9)]"
          style={{ width: `${ROAD_WIDTH}px` }}
        >
          {/* Lane Markings */}
          {Array.from({ length: LANES + 1 }).map((_, i) => (
            <div 
              key={i}
              className="absolute top-0 bottom-0 border-l border-white/5"
              style={{ left: `${i * LANE_WIDTH}px` }}
            />
          ))}

          {/* Scrolling Center Lines */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ 
              backgroundImage: `linear-gradient(to bottom, #fff 40px, transparent 40px)`,
              backgroundSize: `4px 160px`,
              backgroundRepeat: 'repeat-y',
              backgroundPositionY: `${(currentPos * SCALE) % 160}px`,
              left: '50%',
              transform: 'translateX(-50%)'
            }}
          />

          {/* Goal Line Indicator */}
          <div 
            className="absolute left-0 right-0 h-20 bg-gradient-to-t from-red-600/40 to-transparent border-t-8 border-red-500 flex items-center justify-center"
            style={{ top: `calc(70% - ${(trackLength - currentPos) * SCALE}px)` }}
          >
             <span className="orbitron font-black text-white text-4xl opacity-50">FINISH</span>
          </div>

          {/* Cars Layer */}
          <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
            {players.map((player) => {
              const relativePos = player.position - currentPos;
              const yOffset = relativePos * SCALE;
              const topPos = `calc(70% - ${yOffset}px)`;
              
              // Lane is assigned fixed in finalizePlayers
              const xPos = player.lane * LANE_WIDTH + LANE_WIDTH / 2;

              return (
                <div 
                  key={player.id}
                  className="absolute transition-all duration-[50ms] ease-linear flex flex-col items-center z-10"
                  style={{
                    top: topPos,
                    left: `${xPos}px`,
                    transform: 'translateX(-50%) translateY(-50%) translateZ(10px)',
                  }}
                >
                  {/* Name Tag */}
                  <div className={`mb-3 px-2 py-0.5 rounded-md text-[10px] font-bold orbitron whitespace-nowrap shadow-lg ${
                    player.isLocal ? 'bg-cyan-500 text-black animate-pulse' : 'bg-black/80 text-white/80'
                  }`}>
                    {player.name}
                  </div>

                  {/* 3D Car Model (CSS representation) */}
                  <div className="relative w-10 h-16 flex items-center justify-center">
                     <div 
                      className="w-full h-full rounded-md relative shadow-[0_15px_25px_rgba(0,0,0,0.5)] transition-transform"
                      style={{ 
                        backgroundColor: player.color,
                        transform: `scale(${player.isLocal ? 1.2 : 1})`
                      }}
                     >
                       {/* Cockpit / Glass */}
                       <div className="absolute top-1/4 left-2 right-2 h-1/3 bg-slate-900/90 rounded-sm border border-white/10"></div>
                       
                       {/* Spoiler */}
                       <div className="absolute -bottom-2 left-0 right-0 h-3 bg-black/90 rounded-sm border-t border-white/20"></div>
                       
                       {/* Aero Vents */}
                       <div className="absolute top-1 left-2 w-1 h-3 bg-black/20 rounded-full"></div>
                       <div className="absolute top-1 right-2 w-1 h-3 bg-black/20 rounded-full"></div>

                       {/* Wheels with rotation effect */}
                       <div className="absolute -left-2 top-3 w-2.5 h-4 bg-zinc-900 rounded-sm shadow-inner"></div>
                       <div className="absolute -right-2 top-3 w-2.5 h-4 bg-zinc-900 rounded-sm shadow-inner"></div>
                       <div className="absolute -left-2 bottom-3 w-2.5 h-4 bg-zinc-900 rounded-sm shadow-inner"></div>
                       <div className="absolute -right-2 bottom-3 w-2.5 h-4 bg-zinc-900 rounded-sm shadow-inner"></div>

                       {/* Exhaust / Nitro */}
                       {(player.isLocal && nitroActive) && (
                         <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
                           <div className="w-4 h-12 bg-gradient-to-t from-transparent via-cyan-400 to-white blur-[4px] animate-pulse"></div>
                         </div>
                       )}
                       {player.speed > 100 && (
                          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-2 h-6 bg-orange-500/40 blur-[2px] animate-bounce"></div>
                       )}
                     </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* HUD Speed Lines Overlay */}
      {nitroActive && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          <div className="absolute inset-0 bg-cyan-400/5 animate-pulse"></div>
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={i}
              className="absolute w-px h-32 bg-white/20 animate-speed-line"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-100px`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${0.2 + Math.random() * 0.3}s`
              }}
            ></div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes speed-line {
          0% { transform: translateY(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(120vh); opacity: 0; }
        }
        .animate-speed-line {
          animation: speed-line linear infinite;
        }
      `}</style>
    </div>
  );
};

export default RacingScene;
