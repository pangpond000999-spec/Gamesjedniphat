
import React, { useState, useEffect, useRef } from 'react';
import { GameState, Player, Question } from './types';
import { fetchSetTheoryQuestions } from './services/geminiService';
import Lobby from './components/Lobby';
import GameView from './components/GameView';
import ResultView from './components/ResultView';

const GAME_DURATION = 180;
const QUESTION_TIME = 15;
const MAX_PLAYERS = 8; // Reduced to 8 for better mobile visibility
const TRACK_LENGTH = 10000;
const BASE_SPEED = 40;

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.LOBBY);
  const [players, setPlayers] = useState<Player[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [questionTimer, setQuestionTimer] = useState(QUESTION_TIME);
  const [playerName, setPlayerName] = useState('นักแข่ง 01');
  
  const localPlayerId = useRef('p-' + Math.random().toString(36).substr(2, 9)).current;
  const timerRef = useRef<any>(null);
  const qTimerRef = useRef<any>(null);

  // Function to start game immediately (Single Player vs Bots)
  const startGame = async () => {
    setGameState(GameState.STARTING);
    
    // Center lane calculation for 8 players (0-7): Center is 3 or 4. Let's pick 3.
    const playerLane = 3; 

    // 1. Create Local Player
    const local: Player = {
      id: localPlayerId,
      name: playerName || 'Player',
      position: 0,
      speed: BASE_SPEED,
      lane: playerLane,
      isLocal: true,
      isBot: false,
      isFinished: false,
      score: 0,
      color: '#00f2ff' // Bright Cyan
    };

    // 2. Generate Bots immediately
    const botCount = MAX_PLAYERS - 1;
    const bots: Player[] = Array.from({ length: botCount }).map((_, i) => ({
      id: `bot-${i}-${Date.now()}`,
      name: `Bot ${i + 1}`,
      position: 0,
      speed: BASE_SPEED + (Math.random() * 20 - 10), // Random start speed
      lane: i >= playerLane ? i + 1 : i, // Skip player's lane
      isLocal: false,
      isBot: true,
      isFinished: false,
      score: 0,
      color: `hsl(${Math.random() * 360}, 85%, 60%)` // Cartoonish bright colors
    }));

    setPlayers([local, ...bots]);

    // 3. Prepare Questions
    const fetchedQs = await fetchSetTheoryQuestions();
    const shuffledQs = [...fetchedQs].sort(() => Math.random() - 0.5);
    setQuestions(shuffledQs);
    setCurrentQuestionIndex(0);

    // 4. Start Game Loop
    setGameState(GameState.PLAYING);
    setTimeLeft(GAME_DURATION);
    setQuestionTimer(QUESTION_TIME);
  };

  // Main Game Loop (Timer & Bot Logic)
  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      timerRef.current = setInterval(() => {
        // Update Time
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState(GameState.FINISHED);
            return 0;
          }
          return prev - 1;
        });

        // Update Physics & Bot AI
        setPlayers(prevPlayers => prevPlayers.map(p => {
          // Local Player Friction
          if (p.isLocal) {
            const friction = 0.99;
            const newSpeed = p.speed * friction;
            return { ...p, speed: Math.max(BASE_SPEED, newSpeed) };
          }
          
          // Bot AI Behavior - HARDER DIFFICULTY UPDATE
          if (p.isBot && !p.isFinished) {
            // 1. More aggressive base acceleration (Bias towards +speed)
            const randomChange = (Math.random() - 0.35) * 12; 
            let newSpeed = p.speed + randomChange;

            // 2. Simulate "Correct Answer" bursts (20% chance per second to get a boost)
            if (Math.random() < 0.20) {
              newSpeed += 35; // Significant burst
            }
            
            // 3. Higher Speed Cap (Increased from 220 to 260)
            newSpeed = Math.min(Math.max(BASE_SPEED, newSpeed), 260);
            
            return { ...p, speed: newSpeed };
          }
          return p;
        }));
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  // Question Timer
  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      qTimerRef.current = setInterval(() => {
        setQuestionTimer(prev => {
          if (prev <= 1) {
            handleAnswer(-1); // Timeout counts as wrong answer
            return QUESTION_TIME;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (qTimerRef.current) clearInterval(qTimerRef.current);
    };
  }, [gameState, currentQuestionIndex]);

  // Handle User Answer
  const handleAnswer = (index: number) => {
    const isCorrect = index === questions[currentQuestionIndex]?.correctIndex;
    setPlayers(prev => prev.map(p => {
      if (!p.isLocal) return p;
      
      if (isCorrect) {
        // Boost speed on correct answer
        return { 
          ...p, 
          speed: Math.min(p.speed + 80, 280), // High top speed
          score: p.score + 100 + (questionTimer * 10),
        };
      } else {
        // Penalty on wrong answer
        return { ...p, speed: Math.max(BASE_SPEED, p.speed * 0.5) }; 
      }
    }));
    
    // Next Question
    setCurrentQuestionIndex(prev => (prev + 1) % (questions.length || 1));
    setQuestionTimer(QUESTION_TIME);
  };

  // Physics Movement Loop (60FPS)
  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      const moveInterval = setInterval(() => {
        setPlayers(prev => prev.map(p => {
          if (p.isFinished) return p;
          
          // Calculate distance moved
          const newPos = p.position + (p.speed / 50); // Scale speed to distance
          
          if (newPos >= TRACK_LENGTH) {
            return { ...p, position: TRACK_LENGTH, isFinished: true, speed: 0 };
          }
          return { ...p, position: newPos };
        }));
      }, 16);
      return () => clearInterval(moveInterval);
    }
  }, [gameState]);

  return (
    <div className="w-full h-screen bg-white text-slate-800 overflow-hidden relative font-sans">
      {gameState === GameState.LOBBY && (
        <Lobby 
          playerName={playerName} 
          setPlayerName={setPlayerName} 
          onStart={startGame} 
        />
      )}
      {(gameState === GameState.PLAYING || gameState === GameState.STARTING) && (
        <GameView 
          players={players} 
          timeLeft={timeLeft}
          questionTimer={questionTimer}
          currentQuestion={questions[currentQuestionIndex]}
          onAnswer={handleAnswer}
          trackLength={TRACK_LENGTH}
        />
      )}
      {gameState === GameState.FINISHED && (
        <ResultView players={players} onRestart={() => setGameState(GameState.LOBBY)} />
      )}
    </div>
  );
};

export default App;
