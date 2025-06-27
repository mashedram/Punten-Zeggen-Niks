import { Client } from '@/common/networking/client/Client';
import {
  DataPacket,
  Packet,
  trackPacket,
  UntrackPacket,
} from '@/common/networking/packet/Packet';
import { PacketBuilder } from '@/common/networking/packet/PacketBuilder';
import { DataTracker } from '@/common/networking/tracking/tracker/DataTracker';
import { DataStore } from '@/common/networking/tracking/stores/DataStore';
import {
  Dereferable as Dereferable,
  LoadingSymbolType,
} from '@/common/networking/tracking/trackable/Dereferable';
import { Trackable } from '@/common/networking/tracking/trackable/Trackable';
import { DataInstanceDescriptor } from '@/common/networking/tracking/descriptors/DataInstanceDescriptor';
import {
  Deref,
  TrackedInstanceReference,
} from '@/common/networking/tracking/tracker/TrackedInstanceReference';

type TrackedClientState = { instantiated: boolean; step: number };

function createPublicDataObject<T>(
  fields: (keyof T)[],
  instance: TrackedInstance<T>,
) {
  const object = {};
  for (const field of fields) {
    Object.defineProperty(object, field, {
      get: () => {
        return instance.getValue().get(field as keyof T);
      },
      set: value => {
        instance.getValue().set(field, value);
        instance.markDirty();
      },
    });
  }
  return object as T;
}

export class TrackedInstance<T = never> implements Dereferable<T> {
  private _id: number;
  private _descriptor: DataInstanceDescriptor<T>;
  private _data: Trackable<T>;
  private _isDirty: boolean;
  private _tracker: DataTracker;
  private _builder: PacketBuilder<T>;
  private _clients: Record<string, TrackedClientState>;

  /**
   * A never read, quickly accessible value of the instance
   *
   * DO NOT EDIT, use @method modify to do so.
   * @readonly
   */
  public data: T;

  constructor(
    descriptor: DataInstanceDescriptor<T>,
    data: Trackable<T>,
    tracker: DataTracker,
  ) {
    this._id = TrackedInstance.createId(descriptor);
    this._descriptor = descriptor;
    this._data = data;
    this._isDirty = false;
    this._tracker = tracker;
    this._builder = new PacketBuilder<T>(descriptor.mask);
    this._clients = {};

    this.data = createPublicDataObject(data.fields(), this);
  }

  private static createId<T>(descriptor: DataInstanceDescriptor<T>) {
    const saltBits = 6;

    const hash = Bun.hash.cityHash32(descriptor.name);
    const salt = Math.floor(Math.random() * Math.pow(2, saltBits));
    return (hash << saltBits) | salt;
  }

  private static shouldDrop(
    packet: DataPacket<Record<string, unknown>>,
  ): boolean {
    if (Object.keys(packet.data).length === 0) {
      return true; // No data to send
    }

    return false;
  }

  private broadcast() {
    this._tracker.broadcastById(this._id);
  }

  private resolveDirty() {
    this._isDirty = false;
    this.broadcast();
  }

  public getValue(): Trackable<T> {
    return this._data;
  }

  public modify(callback: (data: Trackable<T>) => void) {
    callback(this._data);
    this.markDirty();
  }

  public markDirty() {
    if (this._isDirty) return;
    this._isDirty = true;

    setImmediate(() => {
      this.resolveDirty();
    });
  }

  public sync(field: keyof T) {
    this._data.set(field, this._data.get(field));
    this.markDirty();
  }

  public getId(): number {
    return this._id;
  }

  public getName(): string {
    return this._descriptor.name;
  }

  public getUntrackPacket(): UntrackPacket {
    return this._builder.untrackPacket(this.getId());
  }

  public getTrackPacket(client: Client): trackPacket | null {
    return this._builder.trackPacket(
      client,
      this.data,
      this._descriptor.id,
      this.getId(),
    );
  }

  public getOrInitiateClient(client: Client): TrackedClientState {
    let data = this._clients[client.getId()];
    if (data) {
      return data;
    }

    data = { instantiated: false, step: 0 };
    this._clients[client.getId()] = data;
    return data;
  }

  public isInitiated(client: Client) {
    return this._clients[client.getId()].instantiated;
  }

  public sendUntrackPacket(client: Client) {
    const packet = this.getUntrackPacket();
    client.sendEncoded(packet);
    delete this._clients[client.getId()];
  }

  public sendTrackPacket(client: Client) {
    const packet = this.getTrackPacket(client);
    if (!packet) {
      console.debug(
        `No packet to send for ${this.getName()} on client ${client.getId()}`,
      );
      return;
    }
    client.sendEncoded(packet);
    this.getOrInitiateClient(client).instantiated = true;
  }

  public getDataPacket(client: Client): DataPacket<Partial<T>> {
    const clientData = this.getOrInitiateClient(client);
    const contents = this._data.getDataPacket(clientData.step);
    const packet = this._builder.pack(
      client,
      clientData.step,
      this.data,
      contents,
      this.getId(),
      this._descriptor.id,
    );
    return packet;
  }

  public sendDataPacket(client: Client) {
    const clientData = this.getOrInitiateClient(client);
    if (!clientData.instantiated) {
      this.sendTrackPacket(client);
    }
    const packet = this.getDataPacket(client);

    clientData.step = packet.step;
    client.sendEncoded(packet as Packet<never>);
  }

  public setInstantiated(client: Client, instantiated: boolean) {
    const data = this.getOrInitiateClient(client);
    this._clients[client.getId()] = { ...data, instantiated };
  }

  public setClientStep(client: Client, step: number) {
    this._clients[client.getId()].step = step;
  }

  public resend(
    client: Client,
    step: number = 0,
    reinstantiate: boolean = true,
  ) {
    if (reinstantiate) {
      this.setInstantiated(client, false);
    }
    this.setClientStep(client, step);
    this.sendDataPacket(client);
  }

  public getRef(): TrackedInstanceReference<T> {
    return new TrackedInstanceReference(this.getId(), this._descriptor.id);
  }

  public deref(store: DataStore): Deref<T> | LoadingSymbolType {
    return this._descriptor.deref(this._data.raw(), store);
  }

  public getTracker(): DataTracker {
    return this._tracker;
  }
}
