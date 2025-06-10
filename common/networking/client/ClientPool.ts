import { EventEmitter } from 'events';
import { Client } from '@/common/networking/client/Client';
import { CLIENT_MANAGER } from '@/common/networking/client/ClientManager';

type EventMap = {
  onClientConnected: [Client];
  onClientRemoved: [Client];
};

/**
 * Represents a pool of clients.
 */
export class ClientPool {
  private _clients: Set<Client>;
  private _emitter: EventEmitter<EventMap>;

  constructor() {
    this._clients = new Set();
    this._emitter = new EventEmitter();
    CLIENT_MANAGER.getEventEmitter().addListener(
      'onClientConnected',
      client => {
        if (!this._clients.has(client)) return;
        this._emitter.emit('onClientConnected', client);
      },
    );

    CLIENT_MANAGER.getEventEmitter().addListener('onClientRemoved', client => {
      if (!this._clients.has(client)) return;
      this.removeClient(client);
    });
  }

  public addClient(client: Client): void {
    this._clients.add(client);
    this._emitter.emit('onClientConnected', client);
  }

  public hasClient(client: Client): boolean {
    return this._clients.has(client);
  }

  public getClients(): Client[] {
    return Array.from(this._clients);
  }

  public removeClient(client: Client) {
    const success = this._clients.delete(client);
    if (!success) return;
    this._emitter.emit('onClientRemoved', client);
  }

  public getEventEmitter(): EventEmitter {
    return this._emitter;
  }

  public clear() {
    for (const client of this._clients) {
      this._emitter.emit('onClientRemoved', client);
    }
    this._clients.clear();
  }
}
