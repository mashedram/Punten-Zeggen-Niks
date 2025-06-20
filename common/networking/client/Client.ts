import EventEmitter from 'events';
import { Packet } from '@/common/networking/packet/Packet';
import {
  EncodedPacket,
  PacketTransformer,
} from '@/common/networking/packet/PacketTransformer';
import { Lobby } from '@/api/managers/lobby/Lobby';
import { Player } from '@/api/managers/lobby/Player';
import { ClientManager } from '@/common/networking/client/ClientManager';
import { CLIENT_MANAGER } from '@/common/networking/Globals';

// All client data *must* be optional
type ClientData = {
  lobby?: { lobby: Lobby; player: Player };
};

interface EventMap {
  close: [];
  identify: [id: string];
  packet: [packet: unknown];
}

export class Client {
  private _id: string;
  private _token: string;
  private _emitter: EventEmitter<EventMap>;
  private _transformer: PacketTransformer;
  private _lastConnected: number | undefined;
  private _owner: ClientManager;
  private _data: ClientData;

  constructor(owner: ClientManager, id: string = crypto.randomUUID()) {
    this._id = id;
    this._emitter = new EventEmitter();
    this._transformer = new PacketTransformer();
    this._token = crypto.randomUUID();
    this._lastConnected = Date.now();
    this._owner = owner;
    this._data = {};
  }

  public getId(): string {
    return this._id;
  }

  public setConnected(connected: boolean): void {
    const oldValue = this._lastConnected;
    console.log(
      `Client ${this._id} is now ${connected ? 'connected' : 'disconnected'}.`,
    );
    this._lastConnected = connected ? undefined : Date.now();

    console.log(
      `Client ${this._id} last connected time updated from ${oldValue} to ${this._lastConnected}.`,
    );
    if (this._lastConnected === oldValue) return;

    if (this._lastConnected === undefined) {
      CLIENT_MANAGER.emit('onClientConnected', this);
      console.log(`Client ${this._id} connected.`);
    } else {
      CLIENT_MANAGER.emit('onClientDisconnected', this);
      console.log(`Client ${this._id} disconnected event emitted.`);
    }
  }

  public isConnected(): boolean {
    return this._lastConnected === undefined;
  }

  private send(packet: EncodedPacket): void {
    this._emitter.emit('packet', packet);
  }

  public sendEncoded(packet: Packet<never>): void {
    this.send(this._transformer.encode(packet));
  }

  public getEventEmitter(): EventEmitter<EventMap> {
    return this._emitter;
  }

  public getToken(): string {
    return this._token;
  }

  public getData(): ClientData {
    return this._data;
  }

  public getLastConnected(): number | undefined {
    return this._lastConnected;
  }
}
