import { EventEmitter } from 'events';
import { Client } from '@/common/networking/client/Client';
import { CLIENT_MANAGER } from '@/common/networking/Globals';

type EventMap = {
  onClientAdded: [Client];
  onClientConnected: [Client];
  onClientDisconnected: [Client];
  onClientRemoved: [Client];
};

/**
 * Represents a pool of clients.
 */
export class ClientPool extends EventEmitter<EventMap> {
  private _clients: Set<Client>;

  constructor() {
    super();
    this._clients = new Set();
    CLIENT_MANAGER.on('onClientConnected', client => {
      if (!this._clients.has(client)) return;
      console.log(`ClientPool: Client connected: ${client.getId()}`);
      this.emit('onClientConnected', client);
    });

    CLIENT_MANAGER.on('onClientDisconnected', client => {
      if (!this._clients.has(client)) return;
      console.log(`ClientPool: Client disconnected: ${client.getId()}`);
      this.emit('onClientDisconnected', client);
    });

    CLIENT_MANAGER.on('onClientRemoved', client => {
      if (!this._clients.has(client)) return;
      this.removeClient(client);
    });
  }

  public addClient(client: Client): void {
    this._clients.add(client);
    this.emit('onClientAdded', client);
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
    this.emit('onClientRemoved', client);
  }

  public clear() {
    for (const client of this._clients) {
      this.emit('onClientRemoved', client);
    }
    this._clients.clear();
  }
}
