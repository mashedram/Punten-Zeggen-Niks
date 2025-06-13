import { DataPacket } from '@/common/networking/packet/Packet';
import { DataInstanceDescriptor } from '@/common/networking/tracking/descriptors/DataInstanceDescriptor';
import { DataStore } from '@/common/networking/tracking/stores/DataStore';
import {
  Dereferable,
  LoadingSymbol,
  LoadingSymbolType,
} from '@/common/networking/tracking/trackable/Dereferable';
import {
  DataPacketContents,
  Trackable,
} from '@/common/networking/tracking/trackable/Trackable';
import { Deref } from '@/common/networking/tracking/tracker/TrackedInstanceReference';

export class ClientTrackedInstance<T> implements Dereferable<T> {
  private _id: number;
  private _descriptor: DataInstanceDescriptor<T>;
  private _data: Trackable<T> | undefined;

  constructor(
    id: number,
    descriptor: DataInstanceDescriptor<T>,
    data: Trackable<T> | undefined,
  ) {
    this._id = id;
    this._descriptor = descriptor;
    this._data = data;
  }

  public getId(): number {
    return this._id;
  }

  public getInstanceName(): string {
    return this._descriptor.name;
  }

  public getTrackerName(): string {
    return this._descriptor.tracker.name;
  }

  public overwrite(data: DataPacket<T>) {
    if (!data.overwrite) {
      throw new Error('Data overwrite not allowed on partial data packet');
    }
    this._data = this._descriptor.factory(data.data, data.step);
  }

  public applyDataPacket(packet: DataPacketContents<T>) {
    this._data?.applyDataPacket(packet.step, packet);
  }

  public isLoading(): boolean {
    return this._data === undefined;
  }

  public getStep(): number {
    return this._data?.getStep() ?? 0;
  }

  public raw(): Trackable<T> | undefined {
    return this._data;
  }

  public deref(store: DataStore): Deref<T> | LoadingSymbolType {
    if (!this._data) {
      console.debug(
        `${this._descriptor.name} with id ${this._id} is still loading`,
      );
      return LoadingSymbol;
    }
    return this._descriptor.deref(this._data.raw(), store);
  }
}
