import { EventEmitter } from 'events';
import { Client } from '@/common/networking/client/Client';
import { on } from 'events';
import { tracked } from '@trpc/server';
import { EncodedPacket } from '@/common/networking/packet/PacketTransformer';
import { TrpcContext } from '@/api/common';

interface EventMap {
  onClientConnected: [client: Client];
  onClientDisconnected: [client: Client];
  onClientCreated: [client: Client];
  onClientRemoved: [client: Client];
  onClientInactive: [client: Client];
}

export class ClientManager extends EventEmitter<EventMap> {
  private _clients: Record<string, Client>;
  private _tokenMap: Record<string, Client>;

  constructor() {
    super();
    this._clients = {};
    this._tokenMap = {};
  }

  public createClient(): Client {
    const client = new Client(this);
    this._clients[client.getId()] = client;
    this._tokenMap[client.getToken()] = client;
    this.emit('onClientCreated', client);
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

    this.emit('onClientRemoved', client);

    delete this._clients[id];
    delete this._tokenMap[client.getToken()];
  }

  public getClient(id: string): Client | undefined {
    return this._clients[id];
  }

  public getClientByToken(token: string): Client | undefined {
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

  public authClient(token: string | undefined): Client {
    if (token) {
      console.log(`ClientManager: Found token ${token}`);
      const client = this.getClientByToken(token);
      if (client) {
        console.log(
          `ClientManager: Authenticated client with id ${client.getId()}`,
        );
        return client;
      } else {
        console.warn(`ClientManager: No client found for token ${token}`);
      }
    }

    return this.createClient();
  }

  public async *listen(ctx: TrpcContext, signal?: AbortSignal) {
    try {
      if (!ctx.client) {
        throw new Error('Client not found in context');
      }

      const listener = on(ctx.client, 'packet', {
        signal,
      });

      ctx.client.sendEncoded({
        index: 0,
        type: 'identify',
        id: ctx.client.getId(),
        token: ctx.client.getToken(),
      });

      ctx.client.setConnected(true);
      this.emit('onClientConnected', ctx.client);

      for await (const event of listener) {
        const packet: EncodedPacket = event[0];
        yield tracked(packet[0].toString(), packet);
      }
    } finally {
      ctx.client?.setConnected(false);
    }
  }
}
