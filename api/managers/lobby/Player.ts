import { Lobby } from './Lobby';
import { DataTracker } from '@/common/networking/tracking/tracker/DataTracker';
import { TrackedInstance } from '@/common/networking/tracking/tracker/TrackedInstance';
import { Client } from '@/common/networking/client/Client';
import { TrackedInstanceReference } from '@/common/networking/tracking/tracker/TrackedInstanceReference';
import { SERVER_DATA_STORE } from '@/common/networking/Globals';
import {
  PlayerData,
  PlayerDataDescriptor,
} from '@/common/networking/tracking/descriptors/LobbyInstanceDescriptor';
import { DataInstanceDescriptor } from '@/common/networking/tracking/descriptors/DataInstanceDescriptor';
import { PlayerGameData } from '@/api/game/player/PlayerGameData';

export class Player {
  private _client: Client;
  private _data: TrackedInstance<PlayerData>;
  private _gameData: TrackedInstance<PlayerGameData> | undefined;
  private _lobby: Lobby;

  constructor(
    name: string,
    client: Client,
    tracker: DataTracker,
    lobby: Lobby,
  ) {
    const id = client.getId();
    this._client = client;
    this._lobby = lobby;

    this._data = SERVER_DATA_STORE.startTracking(
      {
        ...PlayerDataDescriptor,
        name: PlayerDataDescriptor.name + '-' + id,
      },
      {
        id,
        name,
        gameData: undefined,
        isConnected: client.isConnected(),
        isAdmin: false,
        isLeader: false,
      },
      tracker,
    );
  }

  public getId(): string {
    return this._data.data.id;
  }

  public isAdmin(): boolean {
    return this._data.data.isAdmin;
  }

  public isLeader(): boolean {
    return this._data.data.isLeader;
  }

  public setAdmin(value: boolean) {
    this._data.modify(data => {
      data.set('isAdmin', value);
    });
  }

  public setLeader(value: boolean) {
    this._data.modify(data => {
      data.set('isLeader', value);
    });
  }

  public setConnected(value: boolean) {
    this._data.modify(data => {
      data.set('isConnected', value);
    });
  }

  public getClient(): Client {
    return this._client;
  }

  public getInstanceReference(): TrackedInstanceReference<PlayerData> {
    return this._data.getRef();
  }

  public clearGameData(tracker: DataTracker) {
    if (!this._gameData) return;

    tracker.stopTracking(this._gameData.getId());
    this._data.data.gameData = undefined;
    this._gameData = undefined;
  }

  public setGameData<T extends PlayerGameData>(
    descriptor: DataInstanceDescriptor<T>,
    data: T,
    tracker: DataTracker,
  ) {
    this.clearGameData(tracker);

    const playerData = SERVER_DATA_STORE.startTracking(
      {
        ...descriptor,
        name: descriptor.name + '-' + this._data.data.id,
      },
      data,
      tracker,
    ) as TrackedInstance<PlayerGameData>;
    this._data.modify(data => {
      // @ts-expect-error The reference is valid, typescript just explodes the type
      data.set('gameData', playerData.getRef());
    });

    this._gameData = playerData;
    console.log('Set game data for player', this._data.data.id);
  }

  public getGameData<T extends PlayerGameData>(): T | undefined {
    return this._gameData?.data as T | undefined;
  }

  public onRemoval() {
    SERVER_DATA_STORE.stopTracking(this._data);
  }

  public sync() {
    this._data.markDirty();
  }

  public getName(): string {
    return this._data.data.name;
  }

  public getLobby(): Lobby {
    return this._lobby;
  }
}
