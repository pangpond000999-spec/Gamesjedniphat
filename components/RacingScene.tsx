
import React, { useMemo, useState, useEffect } from 'react';
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
  
  const [windowSize, setWindowSize] = useState({ 
    width: window.innerWidth, 
    height: window.innerHeight 
  });
  
  useEffect(() => {
    const handleResize = () => setWindowSize({ 
      width: window.innerWidth, 
      height: window.innerHeight 
    });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowSize.width < 768;

  // SCALE_Y is the vertical distance multiplier for the 3D space
  const SCALE_Y = isMobile ? 8 : 12; 
  // Base position of the player car from the bottom of the viewport
  const PLAYER_BOTTOM_PX = isMobile ? 60 : 100;

  // Calculate a scale factor to fit the 900px road into the current screen width
  const horizontalScale = useMemo(() => {
    const padding = 20;
    const availableWidth = windowSize.width - padding;
    return Math.min(1, availableWidth / ROAD_WIDTH);
  }, [windowSize.width, ROAD_WIDTH]);

  return (
    <div className="w-full h-full bg-[#050505] overflow-hidden relative flex justify-center items-end perspective-[1200px]">
      
      {/* Background Atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1a1a] to-black -z-20"></div>

      {/* The 3D Road - Now anchored at the bottom */}
      <div 
        className="relative flex justify-center transition-transform duration-300"
        style={{ 
          width: `${ROAD_WIDTH}px`,
          height: '400%', // Very tall road to handle perspective
          bottom: '0',
          transform: `rotateX(55deg) scale(${horizontalScale})`,
          transformStyle: 'preserve-3d',
          transformOrigin: 'bottom center'
        }}
      >
        <div 
          className="relative w-full h-full bg-[#111] border-x-8 border-gray-800 shadow-[0_0_150px_rgba(0,0,0,1)]"
        >
          {/* Lane Markings */}
          {Array.from({ length: LANES + 1 }).map((_, i) => (
            <div 
              key={i}
              className="absolute top-0 bottom-0 border-l border-white/5"
              style={{ left: `${i * LANE_WIDTH}px` }}
            />
          ))}

          {/* Scrolling Center Lines (Visual feedback of speed) */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{ 
              backgroundImage: `linear-gradient(to bottom, #fff 40px, transparent 40px)`,
              backgroundSize: `4px 200px`,
              backgroundRepeat: 'repeat-y',
              backgroundPositionY: `${(currentPos * SCALE_Y) % 200}px`,
              left: '50%',
              transform: 'translateX(-50%)'
            }}
          />

          {/* Finish Line */}
          <div 
            className="absolute left-0 right-0 h-40 bg-gradient-to-t from-red-600/40 to-transparent border-t-[16px] border-red-500 flex items-center justify-center"
            style={{ bottom: `${(trackLength - currentPos) * SCALE_Y + PLAYER_BOTTOM_PX}px` }}
          >
             <span className="orbitron font-black text-white text-7xl md:text-9xl opacity-40 tracking-widest italic">FINISH</span>
          </div>

          {/* Cars Layer */}
          <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
            {players.map((player) => {
              const relativePos = player.position - currentPos;
              const yOffsetFromPlayer = relativePos * SCALE_Y;
              // Positioning from bottom of the road based on player's fixed bottom position
              const bottomPos = PLAYER_BOTTOM_PX + yOffsetFromPlayer;
              
              const xPos = player.lane * LANE_WIDTH + LANE_WIDTH / 2;

              return (
                <div 
                  key={player.id}
                  className="absolute transition-all duration-[60ms] ease-linear flex flex-col items-center z-10"
                  style={{
                    bottom: `${bottomPos}px`,
                    left: `${xPos}px`,
                    transform: 'translateX(-50%) translateY(50%) translateZ(25px)',
                    // Optimize rendering: hide cars that are too far behind or ahead
                    opacity: relativePos < -50 ? 0 : 1,
                    visibility: relativePos < -50 ? 'hidden' : 'visible'
                  }}
                >
                  {/* Name Tag */}
                  <div className={`mb-3 px-2 py-0.5 rounded text-[10px] md:text-sm font-bold orbitron whitespace-nowrap shadow-xl border ${
                    player.isLocal 
                      ? 'bg-cyan-500 text-black animate-pulse border-white/50 scale-125' 
                      : 'bg-black/90 text-white/70 border-white/10'
                  }`}>
                    {player.name}
                  </div>

                  {/* Car Body */}
                  <div className="relative w-10 md:w-14 h-16 md:h-24 flex items-center justify-center">
                     <div 
                      className="w-full h-full rounded-lg relative shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
                      style={{ 
                        backgroundColor: player.color,
                        transform: `scale(${player.isLocal ? 1.4 : 1})`,
                        border: '2px solid rgba(255,255,255,0.1)'
                      }}
                     >
                       {/* Glass/Cockpit */}
                       <div className="absolute top-[15%] left-[10%] right-[10%] h-[40%] bg-slate-900/90 rounded-md"></div>
                       {/* Rear Wing */}
                       <div className="absolute -bottom-2 left-[-10%] right-[-10%] h-4 bg-black/90 rounded shadow-md"></div>
                       {/* Wheels */}
                       <div className="absolute -left-2 top-4 w-3 h-5 bg-zinc-900 rounded-sm"></div>
                       <div className="absolute -right-2 top-4 w-3 h-5 bg-zinc-900 rounded-sm"></div>
                       <div className="absolute -left-2 bottom-4 w-3 h-5 bg-zinc-900 rounded-sm"></div>
                       <div className="absolute -right-2 bottom-4 w-3 h-5 bg-zinc-900 rounded-sm"></div>

                       {/* Nitro Visuals */}
                       {(player.isLocal && nitroActive) && (
                         <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center">
                           <div className="w-5 h-20 bg-gradient-to-t from-transparent via-cyan-400 to-white blur-[6px] animate-pulse"></div>
                           <div className="w-2 h-12 bg-white absolute top-2 blur-[1px]"></div>
                         </div>
                       )}
                       {!player.isLocal && player.speed > 110 && (
                         <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-4 h-10 bg-orange-500/20 blur-[4px] animate-bounce"></div>
                       )}
                     </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Speed Lines Overlay */}
      {nitroActive && (
        <div className="absolute inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 bg-cyan-400/5"></div>
          {Array.from({ length: 12 }).map((_, i) => (
            <div 
              key={i}
              className="absolute w-px bg-white/30 animate-speed-line"
              style={{
                left: `${Math.random() * 100}%`,
                height: `${50 + Math.random() * 100}px`,
                top: `-200px`,
                animationDelay: `${Math.random() * 1}s`,
                animationDuration: `${0.1 + Math.random() * 0.2}s`
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
