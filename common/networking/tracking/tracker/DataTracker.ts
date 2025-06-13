import { Client } from '@/common/networking/client/Client';
import { ClientPool } from '@/common/networking/client/ClientPool';
import { DataInstanceDescriptor } from '@/common/networking/tracking/descriptors/DataInstanceDescriptor';
import { TrackedInstance } from '@/common/networking/tracking/tracker/TrackedInstance';

export class DataTracker {
  private _name: string;
  private _trackedInstances: Record<number, TrackedInstance<never>>;
  private _clients: ClientPool;

  constructor(name: string, clients: ClientPool) {
    this._name = name;
    this._trackedInstances = {};
    this._clients = clients;
    // There is a real difference here between a lambda and a method reference
    this._clients
      .getEventEmitter()
      .on('onClientConnected', client => this.registerClient(client));
    this._clients
      .getEventEmitter()
      .on('onClientRemoved', client => this.unregisterClient(client));
  }

  public getName(): string {
    return this._name;
  }

  public getClientPool(): ClientPool {
    return this._clients;
  }

  protected broadcast(instance: TrackedInstance<never>): void {
    for (const client of this._clients.getClients()) {
      if (!client.isConnected()) {
        console.debug(
          `Client ${client.getId()} is not connected, not broadcasting.`,
        );
        continue;
      }
      instance.sendDataPacket(client);
    }
  }

  public broadcastById(id: number): void {
    const instance = this._trackedInstances[id];
    if (!instance) return;
    this.broadcast(instance);
  }

  public startTracking<T>(
    descriptor: DataInstanceDescriptor<T>,
    data: T,
  ): TrackedInstance<T> {
    const instance = new TrackedInstance(
      descriptor,
      descriptor.factory(data, 0),
      this,
    );
    this._trackedInstances[instance.getId()] =
      instance as unknown as TrackedInstance<never>;

    // We use setImmediate to ensure that the tracking starts after the current event loop tick
    // This way, if authentication masks depend on data to exist that is made during the same tick, won't crash.
    setImmediate(() => {
      for (const client of this._clients.getClients()) {
        if (!client.isConnected()) {
          console.debug(
            `Client ${client.getId()} is not connected, not starting tracking.`,
          );
          continue;
        }
        instance.sendDataPacket(client);
      }
    });

    return instance;
  }

  public stopTracking(id: number) {
    const instance = this._trackedInstances[id];
    if (!instance) {
      console.debug(`Instance ${id} is not tracked, not stopping tracking.`);
      return;
    }

    for (const client of this._clients.getClients()) {
      if (!client.isConnected()) {
        console.debug(
          `Client ${client.getId()} is not connected, not stopping tracking.`,
        );
        continue;
      }
      instance.sendUntrackPacket(client);
    }
    delete this._trackedInstances[id];
  }

  public get<T>(id: number): TrackedInstance<T> | undefined {
    return this._trackedInstances[id] as unknown as TrackedInstance<T>;
  }

  public isEmpty(): boolean {
    return Object.keys(this._trackedInstances).length === 0;
  }

  public registerClient(client: Client) {
    for (const instance of Object.values(this._trackedInstances)) {
      instance.sendDataPacket(client);
    }
  }

  public unregisterClient(client: Client) {
    for (const instance of Object.values(this._trackedInstances)) {
      instance.sendUntrackPacket(client);
    }
  }

  public onRemoval() {
    for (const instance of Object.values(this._trackedInstances)) {
      this.stopTracking(instance.getId());
    }
  }
}
