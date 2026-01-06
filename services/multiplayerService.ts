
import { Player, MultiplayerMessage, MultiplayerMessageType } from '../types';

/**
 * MultiplayerService handles real-time synchronization.
 * Updated with lazy initialization to handle channel closure gracefully.
 */
class MultiplayerService {
  private channel: BroadcastChannel | null = null;
  private onMessageCallback: (msg: MultiplayerMessage) => void = () => {};

  private init() {
    if (this.channel) return;
    this.channel = new BroadcastChannel('set_racer_network');
    this.channel.onmessage = (event) => {
      if (this.onMessageCallback) {
        this.onMessageCallback(event.data);
      }
    };
  }

  onMessage(callback: (msg: MultiplayerMessage) => void) {
    this.onMessageCallback = callback;
    this.init();
  }

  broadcast(type: MultiplayerMessageType, payload: any) {
    this.init();
    const msg: MultiplayerMessage = { type, payload };
    try {
      this.channel?.postMessage(msg);
    } catch (e) {
      console.warn("Broadcast failed, re-initializing channel...", e);
      this.channel = null;
      this.init();
      this.channel?.postMessage(msg);
    }
  }

  joinLobby(player: Player) {
    this.broadcast('PLAYER_JOINED', player);
  }

  updatePosition(player: Player) {
    this.broadcast('POSITION_UPDATE', {
      id: player.id,
      position: player.position,
      speed: player.speed,
      score: player.score,
      isFinished: player.isFinished
    });
  }

  sendHeartbeat(player: Player) {
    this.broadcast('HEARTBEAT', player);
  }

  signalStart() {
    this.broadcast('GAME_START', {});
  }

  close() {
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }
  }
}

export const multiplayer = new MultiplayerService();
