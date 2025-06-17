import { LOBBY_CONSTANTS, LobbyManager } from './LobbyManager';
import { Player } from './Player';
import { TrackedInstance } from '@/common/networking/tracking/tracker/TrackedInstance';
import { Client } from '@/common/networking/client/Client';
import { SERVER_DATA_STORE } from '@/common/networking/Globals';
import { ClientPool } from '@/common/networking/client/ClientPool';
import { LobbyGameData } from '@/api/game/lobby/LobbyGameData';
import { GameType, GameTypes } from '@/api/game/GameType';
import {
  LobbyData,
  LobbyDataDescriptor,
} from '@/common/networking/tracking/descriptors/LobbyInstanceDescriptor';
import { DataTracker } from '@/common/networking/tracking/tracker/DataTracker';
import { PlayerGameData } from '@/api/game/player/PlayerGameData';
import {
  LobbyDataGameInstanceDescriptor,
  PlayerDataGameInstanceDescriptor,
} from '@/common/networking/tracking/descriptors/StrategoInstanceDescriptors';
import { act } from 'react';

type GameState<P extends PlayerGameData, L extends LobbyGameData> =
  | {
      id: string;
      type: GameType<P, L>;
      data: TrackedInstance<L>;
    }
  | {
      id: null;
    };

function generateRandomCode(length: number): string {
  let value = '';

  for (let i = 0; i < length; i++) {
    value += Math.floor(Math.random() * 9);
  }

  return value;
}

export class Lobby {
  private manager: LobbyManager;

  code: string;
  private _players: { [id: string]: Player } = {};

  private _clients: ClientPool;
  private _tracker: DataTracker;
  private _data: TrackedInstance<LobbyData>;

  private _gameState: GameState<PlayerGameData, LobbyGameData> = {
    id: null,
  };

  constructor(manager: LobbyManager, code?: string) {
    this.manager = manager;
    this.code = code ?? generateRandomCode(LOBBY_CONSTANTS.LOBBY_CODE_LENGTH);

    this._clients = new ClientPool();
    this._tracker = SERVER_DATA_STORE.createDataTracker(
      LobbyDataDescriptor.tracker.name,
      this._clients,
    );
    this._data = SERVER_DATA_STORE.startTracking(
      LobbyDataDescriptor,
      {
        code: this.code,
        players: [],
        game: undefined,
      },
      this._tracker,
    );
  }

  // Player control methods

  public getCode(): string {
    return this.code;
  }

  public getGameType(): GameType<PlayerGameData, LobbyGameData> | undefined {
    return this._gameState.id ? this._gameState.type : undefined;
  }

  public getGameData<T extends LobbyGameData>(): T | undefined {
    if (this._gameState.id === null) return undefined;
    return this._gameState.data.data as T;
  }

  public clearGame() {
    if (this._gameState.id === null) return;
    for (const player of Object.values(this._players)) {
      player.clearGameData(this._tracker);
    }
    this._tracker.stopTracking(this._gameState.data.getId());
    this._gameState = {
      id: null,
    };
  }

  public setGame(gameId: string) {
    const type = GameTypes.find(g => g.id === gameId);
    if (!type) {
      throw new Error('Game not found');
    }
    if (this._gameState.id) {
      this.clearGame();
    }
    const lobbyGameData = SERVER_DATA_STORE.startTracking(
      LobbyDataGameInstanceDescriptor,
      type.createLobbyData(),
      this._tracker,
    );
    this._gameState = {
      id: gameId,
      type: type as GameType<PlayerGameData, LobbyGameData>,
      data: lobbyGameData,
    };
    // @ts-expect-error Type resolving doesn't go well with generic hell
    this._data.data.game = lobbyGameData.getRef();

    for (const player of Object.values(this._players)) {
      player.setGameData(
        PlayerDataGameInstanceDescriptor,
        type.createPlayerData(this, player),
        this._tracker,
      );
    }

    type.onGameStart?.(this);
  }

  public getPlayers(): Player[] {
    return Object.values(this._players);
  }

  public getPlayer(id: string): Player | undefined {
    return this._players[id];
  }

  public getPlayerOfClient(client: Client): Player | undefined {
    return this._players[client.getId()];
  }

  /**
   * @returns all players that are currently in the lobby and are active (connected, not inactive, etc.)
   */
  public getActivePlayers(): Player[] {
    return Object.values(this._players).filter(
      p =>
        p.getClient().isConnected() &&
        (this._gameState.id === null || p.getGameData() !== undefined),
    );
  }

  public sync() {
    this._data.markDirty();
  }

  public createPlayer(name: string, client: Client): Player {
    const existingPlayer = client.getData().lobby;
    if (existingPlayer?.lobby) {
      if (existingPlayer.lobby.getCode() === this.getCode()) {
        return existingPlayer.player;
      }

      // If the client is already in a different lobby, remove them from that lobby first
      existingPlayer.lobby.removePlayer(existingPlayer.player.getId());
    }

    this._clients.addClient(client);
    const player = new Player(
      client.getId(),
      name,
      client,
      this._tracker,
      this,
    );
    if (Object.keys(this._players).length === 0) {
      player.setAdmin(true);
    }
    this._players[player.getId()] = player;
    this._data.data.players.push(player.getInstanceReference());
    this._data.sync('players');
    client.getData().lobby = { lobby: this, player };

    const activeGame = this.getGameType();
    if (activeGame !== undefined) {
      player.setGameData(
        PlayerDataGameInstanceDescriptor,
        activeGame.createPlayerData(this, player),
        this._tracker,
      );

      activeGame.onLateJoin?.(this, player);
    }

    return player;
  }

  public removePlayer(id: string) {
    const player = this._players[id];
    if (!player) return;

    player.getClient().getData().lobby = undefined;
    player.onRemoval();
    this._clients.removeClient(player.getClient());
    delete this._players[id];
    this._data.data.players = this._data.data.players.filter(
      p => p.get()?.data.id !== id,
    );

    if (Object.keys(this._players).length === 0) {
      this.manager.deleteLobby(this.getCode());
      return;
    }

    if (
      player.isAdmin() &&
      !Object.values(this._players).some(p => p.isAdmin())
    ) {
      const newAdmin = Object.values(this._players).find(p => !p.isAdmin());
      newAdmin?.setAdmin(true);
    }
  }

  public onRemoval() {
    for (const player of Object.values(this._players)) {
      player.onRemoval();
    }
    SERVER_DATA_STORE.removeDataTracker(this._data.getTracker());
  }
}
