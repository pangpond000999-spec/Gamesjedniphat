
import React, { useMemo, useState, useEffect } from 'react';
import { Player } from '../types';

interface RacingSceneProps {
  players: Player[];
  trackLength: number;
  nitroActive: boolean;
}

// --- SVG Car Components ---

const CarShadow = () => (
  <ellipse cx="50" cy="50" rx="40" ry="80" fill="black" fillOpacity="0.4" filter="blur(8px)" />
);

// Model 1: The "Speedster" (Classic Supercar shape)
const CarModel1 = ({ color }: { color: string }) => (
  <g transform="scale(0.8) translate(12, 10)">
    {/* Wheels */}
    <rect x="0" y="25" width="12" height="35" rx="4" fill="#1a1a1a" />
    <rect x="88" y="25" width="12" height="35" rx="4" fill="#1a1a1a" />
    <rect x="0" y="130" width="12" height="40" rx="4" fill="#1a1a1a" />
    <rect x="88" y="130" width="12" height="40" rx="4" fill="#1a1a1a" />

    {/* Body Main */}
    <path d="M50 0 C 30 0, 10 20, 10 50 L 10 160 C 10 180, 20 195, 50 195 C 80 195, 90 180, 90 160 L 90 50 C 90 20, 70 0, 50 0 Z" fill={color} stroke="#000" strokeWidth="1" />
    
    {/* Hood Detail */}
    <path d="M50 10 L 30 40 L 70 40 Z" fill="rgba(0,0,0,0.1)" />

    {/* Windshield */}
    <path d="M20 55 L 80 55 L 75 80 L 25 80 Z" fill="#334455" stroke="#111" strokeWidth="1" />
    
    {/* Roof */}
    <path d="M25 80 L 75 80 L 70 110 L 30 110 Z" fill={color} opacity="0.9" />
    
    {/* Rear Window & Engine Cover */}
    <path d="M30 110 L 70 110 L 80 150 L 20 150 Z" fill="#111" />
    <line x1="30" y1="120" x2="70" y2="120" stroke="#333" strokeWidth="2" />
    <line x1="30" y1="130" x2="70" y2="130" stroke="#333" strokeWidth="2" />
    <line x1="30" y1="140" x2="70" y2="140" stroke="#333" strokeWidth="2" />

    {/* Spoiler */}
    <rect x="15" y="180" width="70" height="8" rx="2" fill="#111" />
    
    {/* Headlights */}
    <path d="M15 20 Q 25 10 30 30" fill="none" stroke="#fff" strokeWidth="3" opacity="0.8" />
    <path d="M85 20 Q 75 10 70 30" fill="none" stroke="#fff" strokeWidth="3" opacity="0.8" />
  </g>
);

// Model 2: The "Hyper" (Aggressive, sharp lines)
const CarModel2 = ({ color }: { color: string }) => (
  <g transform="scale(0.85) translate(10, 5)">
     {/* Wheels */}
     <rect x="-5" y="25" width="14" height="35" rx="3" fill="#111" />
     <rect x="91" y="25" width="14" height="35" rx="3" fill="#111" />
     <rect x="-5" y="125" width="16" height="40" rx="3" fill="#111" />
     <rect x="89" y="125" width="16" height="40" rx="3" fill="#111" />

     {/* Body Base */}
     <path d="M50 5 L 20 40 L 15 140 L 30 190 L 70 190 L 85 140 L 80 40 Z" fill={color} stroke="#000" strokeWidth="1" />
     
     {/* Side Scoops */}
     <path d="M15 80 L 25 80 L 25 130 L 15 130 Z" fill="#000" />
     <path d="M85 80 L 75 80 L 75 130 L 85 130 Z" fill="#000" />

     {/* Cockpit */}
     <path d="M30 60 L 70 60 L 75 120 L 25 120 Z" fill="#222" />
     <path d="M32 65 L 68 65 L 72 90 L 28 90 Z" fill="#446688" /> {/* Glass */}

     {/* Racing Stripe */}
     <rect x="45" y="5" width="10" height="185" fill="#fff" fillOpacity="0.8" />

     {/* Spoiler */}
     <path d="M10 180 L 90 180 L 90 195 L 10 195 Z" fill="#111" />
     
     {/* Tail lights */}
     <rect x="20" y="192" width="20" height="3" fill="red" />
     <rect x="60" y="192" width="20" height="3" fill="red" />
  </g>
);

// Model 3: The "GT-Racer" (Wide body, track focused)
const CarModel3 = ({ color }: { color: string }) => (
  <g transform="scale(0.85) translate(10, 5)">
    {/* Wheels */}
    <rect x="-2" y="30" width="12" height="30" rx="2" fill="#222" />
    <rect x="90" y="30" width="12" height="30" rx="2" fill="#222" />
    <rect x="-2" y="120" width="14" height="40" rx="2" fill="#222" />
    <rect x="88" y="120" width="14" height="40" rx="2" fill="#222" />

    {/* Body */}
    <path d="M50 0 C 20 10, 5 30, 5 60 L 5 150 C 5 170, 15 190, 50 190 C 85 190, 95 170, 95 150 L 95 60 C 95 30, 80 10, 50 0 Z" fill={color} stroke="#000" strokeWidth="1" />

    {/* Front Splitter */}
    <path d="M10 10 L 90 10 L 85 20 L 15 20 Z" fill="#111" />

    {/* Windshield */}
    <path d="M20 50 L 80 50 L 85 90 L 15 90 Z" fill="#111" />
    <path d="M25 55 L 75 55 L 78 80 L 22 80 Z" fill="#4a5a6a" />

    {/* Roof & Rear */}
    <rect x="20" y="90" width="60" height="40" fill={color} />
    <path d="M20 130 L 80 130 L 75 160 L 25 160 Z" fill="#222" />

    {/* Giant Wing */}
    <rect x="0" y="170" width="100" height="15" rx="5" fill="#111" />
    <rect x="20" y="160" width="5" height="15" fill="#333" />
    <rect x="75" y="160" width="5" height="15" fill="#333" />

    {/* Decals */}
    <circle cx="50" cy="110" r="12" fill="white" />
    <text x="50" y="115" textAnchor="middle" fontSize="10" fontWeight="bold" fill="black">
      RACER
    </text>
  </g>
);

const CarRenderer: React.FC<{ type: number; color: string; isLocal: boolean }> = ({ type, color, isLocal }) => {
  const CarComponent = [CarModel1, CarModel2, CarModel3][type % 3];
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 200" overflow="visible">
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter={isLocal ? "url(#glow)" : ""}>
        <CarShadow />
        <CarComponent color={color} />
      </g>
    </svg>
  );
};

const RacingScene: React.FC<RacingSceneProps> = ({ players, trackLength, nitroActive }) => {
  const localPlayer = players.find(p => p.isLocal);
  const currentPos = localPlayer?.position || 0;

  const LANES = 8;
  const LANE_WIDTH = 90; // Much wider lanes for better mobile view
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
  const SCALE_Y = isMobile ? 8 : 12; 
  const PLAYER_BOTTOM_PX = isMobile ? 120 : 100;

  const horizontalScale = useMemo(() => {
    const padding = 20;
    const availableWidth = windowSize.width - padding;
    return Math.min(1, availableWidth / ROAD_WIDTH);
  }, [windowSize.width, ROAD_WIDTH]);

  const getCarType = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };

  return (
    <div className="w-full h-full bg-blue-400 overflow-hidden relative flex justify-center items-end perspective-[1200px]">
      
      {/* Modern Cartoon Sky Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-blue-500 to-indigo-900 -z-20"></div>
      
      {/* Decorative 'Sun' or Glow */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[50%] bg-gradient-to-b from-purple-500/30 to-transparent blur-3xl -z-10 rounded-full"></div>

      {/* The 3D Road */}
      <div 
        className="relative flex justify-center transition-transform duration-300"
        style={{ 
          width: `${ROAD_WIDTH}px`,
          height: '400%', 
          bottom: '0',
          transform: `rotateX(55deg) scale(${horizontalScale})`,
          transformStyle: 'preserve-3d',
          transformOrigin: 'bottom center'
        }}
      >
        <div 
          className="relative w-full h-full bg-slate-800 border-x-8 border-slate-900 shadow-2xl"
        >
          {/* Lane Markings */}
          {Array.from({ length: LANES + 1 }).map((_, i) => (
            <div 
              key={i}
              className="absolute top-0 bottom-0 border-l-2 border-white/10"
              style={{ left: `${i * LANE_WIDTH}px` }}
            />
          ))}

          {/* Scrolling Center Lines */}
          <div 
            className="absolute inset-0 opacity-50 pointer-events-none"
            style={{ 
              backgroundImage: `linear-gradient(to bottom, #ffffff 60px, transparent 60px)`,
              backgroundSize: `6px 200px`,
              backgroundRepeat: 'repeat-y',
              backgroundPositionY: `${(currentPos * SCALE_Y) % 200}px`,
              left: '50%',
              transform: 'translateX(-50%)'
            }}
          />

          {/* Finish Line */}
          <div 
            className="absolute left-0 right-0 h-40 flex items-center justify-center overflow-hidden"
            style={{ 
                bottom: `${(trackLength - currentPos) * SCALE_Y + PLAYER_BOTTOM_PX}px`,
                backgroundImage: `
                    linear-gradient(45deg, #000 25%, transparent 25%), 
                    linear-gradient(-45deg, #000 25%, transparent 25%), 
                    linear-gradient(45deg, transparent 75%, #000 75%), 
                    linear-gradient(-45deg, transparent 75%, #000 75%)
                `,
                backgroundSize: '40px 40px',
                backgroundColor: '#fff',
                opacity: 0.9
            }}
          >
             <span className="font-kanit font-black text-white text-7xl md:text-9xl tracking-widest italic drop-shadow-[0_4px_0_rgba(0,0,0,1)] z-10 stroke-black stroke-2" style={{ WebkitTextStroke: '2px black' }}>FINISH</span>
          </div>

          {/* Cars Layer */}
          <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
            {players.map((player) => {
              const relativePos = player.position - currentPos;
              const yOffsetFromPlayer = relativePos * SCALE_Y;
              const bottomPos = PLAYER_BOTTOM_PX + yOffsetFromPlayer;
              const xPos = player.lane * LANE_WIDTH + LANE_WIDTH / 2;
              const carType = getCarType(player.id);

              return (
                <div 
                  key={player.id}
                  className="absolute transition-all duration-[60ms] ease-linear flex flex-col items-center z-10"
                  style={{
                    bottom: `${bottomPos}px`,
                    left: `${xPos}px`,
                    transform: 'translateX(-50%) translateY(50%) translateZ(10px)',
                    opacity: relativePos < -50 ? 0 : 1,
                    visibility: relativePos < -50 ? 'hidden' : 'visible'
                  }}
                >
                  {/* Name Tag */}
                  <div className={`mb-1 px-2 py-0.5 rounded-full text-[10px] md:text-xs font-bold font-kanit whitespace-nowrap shadow-lg border-2 ${
                    player.isLocal 
                      ? 'bg-yellow-400 text-black border-white scale-110 z-20' 
                      : 'bg-white/90 text-slate-700 border-slate-200'
                  }`}>
                    {player.name}
                  </div>

                  {/* SVG Car Body - RESIZED FOR BETTER VISIBILITY */}
                  {/* Fixed sizes ensuring 50-60% lane occupancy for clean look */}
                  <div 
                    className="relative flex items-center justify-center -mb-2"
                    style={{
                      width: isMobile ? '50px' : '64px',
                      height: isMobile ? '100px' : '128px' 
                    }}
                  >
                     <CarRenderer 
                       type={carType} 
                       color={player.color} 
                       isLocal={player.isLocal} 
                     />

                     {/* Nitro Visuals */}
                     {(player.isLocal && nitroActive) && (
                       <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-1 z-[-1]">
                         <div className="w-2 h-10 bg-gradient-to-t from-transparent via-cyan-400 to-white blur-[2px] animate-pulse"></div>
                         <div className="w-2 h-10 bg-gradient-to-t from-transparent via-cyan-400 to-white blur-[2px] animate-pulse"></div>
                       </div>
                     )}
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
          {Array.from({ length: 8 }).map((_, i) => (
            <div 
              key={i}
              className="absolute w-1 bg-white/50 rounded-full animate-speed-line"
              style={{
                left: `${Math.random() * 100}%`,
                height: `${80 + Math.random() * 100}px`,
                top: `-200px`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${0.2 + Math.random() * 0.3}s`
              }}
            ></div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes speed-line {
          0% { transform: translateY(0); opacity: 0; }
          50% { opacity: 0.8; }
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
