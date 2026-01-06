
export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
}

export interface Player {
  id: string;
  name: string;
  position: number;
  speed: number;
  lane: number;
  isLocal: boolean;
  isBot: boolean;
  isFinished: boolean;
  score: number;
  color: string;
}

export enum GameState {
  LOBBY = 'LOBBY',
  MATCHMAKING = 'MATCHMAKING',
  STARTING = 'STARTING',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED'
}

export type MultiplayerMessageType = 'PLAYER_JOINED' | 'HEARTBEAT' | 'POSITION_UPDATE' | 'GAME_START';

export interface MultiplayerMessage {
  type: MultiplayerMessageType;
  payload: any;
}
