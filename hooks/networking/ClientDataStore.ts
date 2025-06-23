import { Packet } from '@/common/networking/packet/Packet';
import {
  PacketTransformer,
  EncodedPacket,
} from '@/common/networking/packet/PacketTransformer';
import { DataInstanceDescriptor } from '@/common/networking/tracking/descriptors/DataInstanceDescriptor';
import { DataStore } from '@/common/networking/tracking/stores/DataStore';
import { Dereferable } from '@/common/networking/tracking/trackable/Dereferable';
import { TrackedInstanceReference } from '@/common/networking/tracking/tracker/TrackedInstanceReference';
import { ClientTrackedInstance } from './ClientTrackedInstance';

export class ClientDataStore implements DataStore {
  private _instances: Record<number, ClientTrackedInstance<never>>;
  private _transformer: PacketTransformer;

  constructor() {
    this._instances = {};
    this._transformer = new PacketTransformer();
  }

  public get(id: number): ClientTrackedInstance<never> | undefined {
    return this._instances[id];
  }

  public startTracking(id: number, descriptor: DataInstanceDescriptor<never>) {
    this._instances[id] = new ClientTrackedInstance(id, descriptor, undefined);
  }

  public stopTracking(id: number) {
    delete this._instances[id];
  }

  public clear() {
    this._instances = {};
  }

  public decode(packet: EncodedPacket): Packet<never> {
    return this._transformer.decode(packet);
  }

  public find<T>(
    descriptor: DataInstanceDescriptor<T>,
  ): ClientTrackedInstance<T> | undefined {
    return Object.values(this._instances).find(
      i =>
        i.getTrackerName() === descriptor.tracker.name &&
        i.getInstanceName() === descriptor.name,
    ) as ClientTrackedInstance<T> | undefined;
  }

  public getFromRef<T>(
    ref: TrackedInstanceReference<T>,
  ): Dereferable<T> | undefined {
    const instance = this.get(ref.instanceId);
    if (!instance) {
      console.debug(`Can't deref: ${ref.instanceId}. No instance found.`);
      return undefined;
    }
    return instance;
  }

  public getKeys(): string[] {
    return Object.keys(this._instances);
  }
}
