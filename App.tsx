
import React, { useState, useEffect, useRef } from 'react';
import { GameState, Player, Question, MultiplayerMessage } from './types';
import { fetchSetTheoryQuestions } from './services/geminiService';
import { multiplayer } from './services/multiplayerService';
import Lobby from './components/Lobby';
import GameView from './components/GameView';
import ResultView from './components/ResultView';
import MatchmakingView from './components/MatchmakingView';

const GAME_DURATION = 180;
const QUESTION_TIME = 15;
const MATCHMAKING_TIME = 30;
const MAX_PLAYERS = 15;
const TRACK_LENGTH = 10000;
const BASE_SPEED = 40; // Increased base speed to ensure movement is visible

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.LOBBY);
  const [players, setPlayers] = useState<Player[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [questionTimer, setQuestionTimer] = useState(QUESTION_TIME);
  const [matchmakingTimer, setMatchmakingTimer] = useState(MATCHMAKING_TIME);
  const [playerName, setPlayerName] = useState('Racer_' + Math.floor(Math.random() * 9000 + 1000));
  
  const localPlayerId = useRef('p-' + Math.random().toString(36).substr(2, 9)).current;
  const gameStateRef = useRef(gameState);
  const timerRef = useRef<any>(null);
  const qTimerRef = useRef<any>(null);
  const matchRef = useRef<any>(null);
  const syncIntervalRef = useRef<any>(null);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    return () => {
      multiplayer.close();
    };
  }, []);

  useEffect(() => {
    multiplayer.onMessage((msg: MultiplayerMessage) => {
      switch (msg.type) {
        case 'PLAYER_JOINED':
        case 'HEARTBEAT':
          handleRemotePlayerUpdate(msg.payload);
          break;
        case 'POSITION_UPDATE':
          handleRemotePositionUpdate(msg.payload);
          break;
        case 'GAME_START':
          if (gameStateRef.current === GameState.MATCHMAKING) {
            setMatchmakingTimer(1); 
          }
          break;
      }
    });
  }, []);

  const handleRemotePlayerUpdate = (remote: Player) => {
    if (remote.id === localPlayerId) return;
    setPlayers(prev => {
      const exists = prev.find(p => p.id === remote.id);
      if (exists) {
        // Update existing remote player (name might have changed or heartbeat)
        return prev.map(p => p.id === remote.id ? { ...p, ...remote, isLocal: false, isBot: false } : p);
      }
      if (prev.length >= MAX_PLAYERS) return prev;
      return [...prev, { ...remote, isLocal: false, isBot: false }];
    });
  };

  const handleRemotePositionUpdate = (data: any) => {
    setPlayers(prev => prev.map(p => {
      if (p.id === data.id && !p.isLocal) {
        return { 
          ...p, 
          position: data.position, 
          speed: data.speed, 
          score: data.score, 
          isFinished: data.isFinished 
        };
      }
      return p;
    }));
  };

  const startMatchmaking = () => {
    setGameState(GameState.MATCHMAKING);
    setMatchmakingTimer(MATCHMAKING_TIME);
    
    const local: Player = {
      id: localPlayerId,
      name: playerName,
      position: 0,
      speed: BASE_SPEED,
      lane: 0, // Temporarily 0, will be finalized
      isLocal: true,
      isBot: false,
      isFinished: false,
      score: 0,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`
    };
    
    setPlayers([local]);
    multiplayer.joinLobby(local);

    const heartbeat = setInterval(() => {
      if (gameStateRef.current === GameState.MATCHMAKING) {
        multiplayer.sendHeartbeat({ ...local, name: playerName }); // Use latest playerName
      } else {
        clearInterval(heartbeat);
      }
    }, 2000);

    matchRef.current = setInterval(() => {
      setMatchmakingTimer(prev => {
        if (prev <= 1) {
          clearInterval(matchRef.current);
          clearInterval(heartbeat);
          finalizePlayers();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const finalizePlayers = async () => {
    setGameState(GameState.STARTING);
    const fetchedQs = await fetchSetTheoryQuestions();
    setQuestions(fetchedQs);

    setPlayers(prev => {
      // 1. Assign lanes to existing human players (sorted by ID for consistency)
      const humans = prev.filter(p => !p.isBot).sort((a, b) => a.id.localeCompare(b.id));
      const updatedHumans = humans.map((p, idx) => ({ ...p, lane: idx }));

      // 2. Add bots for remaining lanes
      const currentCount = updatedHumans.length;
      const botsNeeded = MAX_PLAYERS - currentCount;
      const botPlayers: Player[] = Array.from({ length: botsNeeded }).map((_, i) => ({
        id: `bot-${i}-${Date.now()}`,
        name: `Bot Racer ${i + 1}`,
        position: 0,
        speed: BASE_SPEED + (Math.random() * 20),
        lane: currentCount + i,
        isLocal: false,
        isBot: true,
        isFinished: false,
        score: 0,
        color: `hsl(${(i * 40 + 200) % 360}, 40%, 40%)`
      }));
      return [...updatedHumans, ...botPlayers];
    });

    setGameState(GameState.PLAYING);
    setTimeLeft(GAME_DURATION);
    setQuestionTimer(QUESTION_TIME);

    syncIntervalRef.current = setInterval(() => {
      setPlayers(currentPlayers => {
        const local = currentPlayers.find(p => p.isLocal);
        if (local && gameStateRef.current === GameState.PLAYING) {
          multiplayer.updatePosition(local);
        }
        return currentPlayers;
      });
    }, 100);
  };

  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState(GameState.FINISHED);
            if (syncIntervalRef.current) clearInterval(syncIntervalRef.current);
            return 0;
          }
          return prev - 1;
        });

        setPlayers(prevPlayers => prevPlayers.map(p => {
          if (p.isLocal) {
            const friction = 0.99;
            const newSpeed = p.speed * friction;
            return { ...p, speed: Math.max(BASE_SPEED, newSpeed) };
          }
          if (p.isBot && !p.isFinished) {
            // Bots randomly change speed slightly to simulate thinking
            const aiVariation = (Math.random() - 0.48) * 3;
            return { ...p, speed: Math.min(Math.max(BASE_SPEED + 10, p.speed + aiVariation), 110) };
          }
          return p;
        }));
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      qTimerRef.current = setInterval(() => {
        setQuestionTimer(prev => {
          if (prev <= 1) {
            handleAnswer(-1);
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

  const handleAnswer = (index: number) => {
    const isCorrect = index === questions[currentQuestionIndex]?.correctIndex;
    setPlayers(prev => prev.map(p => {
      if (!p.isLocal) return p;
      if (isCorrect) {
        return { 
          ...p, 
          speed: Math.min(p.speed + 70, 250),
          score: p.score + 100 + (questionTimer * 10),
        };
      } else {
        return { ...p, speed: Math.max(BASE_SPEED, p.speed * 0.4) }; 
      }
    }));
    setCurrentQuestionIndex(prev => (prev + 1) % (questions.length || 1));
    setQuestionTimer(QUESTION_TIME);
  };

  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      const moveInterval = setInterval(() => {
        setPlayers(prev => prev.map(p => {
          if (p.isFinished) return p;
          const newPos = p.position + (p.speed / 40); // Faster physics update
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
    <div className="w-full h-screen bg-black text-white overflow-hidden relative font-sans">
      {gameState === GameState.LOBBY && (
        <Lobby 
          playerName={playerName} 
          setPlayerName={setPlayerName} 
          onStart={startMatchmaking} 
        />
      )}
      {gameState === GameState.MATCHMAKING && (
        <MatchmakingView 
          timer={matchmakingTimer} 
          players={players} 
          maxPlayers={MAX_PLAYERS} 
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
