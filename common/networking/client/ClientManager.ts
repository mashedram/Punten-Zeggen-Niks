import { EventEmitter } from 'events';
import { Client } from '@/common/networking/client/Client';
import { on } from 'events';
import { tracked } from '@trpc/server';
import { EncodedPacket } from '@/common/networking/packet/PacketTransformer';
import { TrpcContext } from '@/api/common';

interface EventMap {
  onClientConnected: [client: Client];
  onClientCreated: [client: Client];
  onClientRemoved: [client: Client];
}

export class ClientManager {
  private _clients: Record<string, Client>;
  private _tokenMap: Record<string, Client>;
  private _eventEmitter: EventEmitter<EventMap>;

  constructor() {
    this._clients = {};
    this._tokenMap = {};
    this._eventEmitter = new EventEmitter();
  }

  public getEventEmitter(): EventEmitter<EventMap> {
    return this._eventEmitter;
  }

  public createClient(): Client {
    const client = new Client();
    this._clients[client.getId()] = client;
    this._tokenMap[client.getToken()] = client;
    this._eventEmitter.emit('onClientCreated', client);
    return client;
  }

  public getOrCreateClient(id?: string): Client {
    if (id) {
      return this.getClient(id) ?? this.createClient();
    }

    return this.createClient();
  }

  public removeClient(id: string): void {
    const client = this._clients[id];
    if (!client) {
      console.error(`Failed to remove client of id ${id}`);
      return;
    }

    this._eventEmitter.emit('onClientRemoved', client);

    delete this._clients[id];
    delete this._tokenMap[client.getToken()];
  }

  public getClient(id: string): Client | undefined {
    return this._clients[id];
  }

  public getClientByToken(token: string): Client | undefined {
    console.log('token', token, this._tokenMap);
    return this._tokenMap[token];
  }

  public getClients(): Client[] {
    return Object.values(this._clients);
  }

  public cleanupOldClients(timeoutMs: number) {
    for (const client of this.getClients()) {
      const lastConnected = client.getLastConnected();
      if (lastConnected === undefined) continue;
      if (lastConnected + timeoutMs < Date.now()) continue;

      this.removeClient(client.getId());
    }
  }

  public async *listen(ctx: TrpcContext, token?: string, signal?: AbortSignal) {
    try {
      if (token) {
        ctx.client = this.getClientByToken(token);
      }

      if (ctx.client === undefined) {
        ctx.client = this.createClient();
      }

      const listener = on(ctx.client.getEventEmitter(), 'packet', {
        signal,
      });

      ctx.client.sendEncoded({
        index: 0,
        type: 'identify',
        id: ctx.client.getId(),
        token: ctx.client.getToken(),
      });

      ctx.client.setConnected(true);
      this._eventEmitter.emit('onClientConnected', ctx.client);

      for await (const event of listener) {
        const packet: EncodedPacket = event[0];
        yield tracked(packet[0].toString(), packet);
      }
    } finally {
      ctx.client?.setConnected(false);
    }
  }
}

const CLIENT_TIMEOUT_MS = 10 * 5 * 1000;

export const CLIENT_MANAGER = new ClientManager();

setInterval(() => {
  CLIENT_MANAGER.cleanupOldClients(CLIENT_TIMEOUT_MS);
}, CLIENT_TIMEOUT_MS);
