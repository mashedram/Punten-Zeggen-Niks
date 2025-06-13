import {
  DataPacket,
  trackPacket,
  UntrackPacket,
} from '@/common/networking/packet/Packet';
import { DataPacketContents } from '@/common/networking/tracking/trackable/Trackable';
import { Client } from '../client/Client';

export type FieldMaskValue<T> =
  | 'public'
  | ((client: Client, data: T) => boolean);
export type FieldMask<T> = {
  [K in keyof T]?: FieldMaskValue<T>;
};

export type PacketMask<T> = {
  global?: FieldMaskValue<T>;
  fieldOverwrites?: FieldMask<T>;
};

export class PacketBuilder<T> {
  private _packetIndex;
  private _fieldMask: FieldMask<T>;
  private _globalMask: FieldMaskValue<T> | undefined;

  constructor(fieldMask: PacketMask<T>) {
    this._packetIndex = 0;
    this._fieldMask = fieldMask.fieldOverwrites ?? {};
    this._globalMask = fieldMask.global;
  }

  private getMaskResult(
    client: Client,
    data: T,
    mask?: FieldMaskValue<T>,
  ): boolean {
    if (!mask) {
      return false;
    }

    if (mask === 'public') {
      return true;
    }

    if (typeof mask === 'function') {
      return mask(client, data);
    }

    return false;
  }

  public build(client: Client, raw: T, data: Partial<T>): Partial<T> {
    const globalMask = this.getMaskResult(client, raw, this._globalMask);

    return Object.fromEntries(
      Object.entries(data).filter(([key, value]) => {
        const maskValue = this._fieldMask[key as keyof T];
        return maskValue
          ? this.getMaskResult(client, raw, maskValue)
          : globalMask;
      }),
    ) as Partial<T>;
  }

  public pack(
    client: Client,
    clientStep: number,
    raw: T,
    data: DataPacketContents<T>,
    id: number,
    descriptorId: number,
  ): DataPacket<Partial<T>> {
    const packetData = this.build(client, raw, data.data);

    return {
      index: this._packetIndex++,
      instanceId: id,
      descriptorId: descriptorId,
      type: 'data',
      step: data.step,
      clientExpectedStep: clientStep,
      overwrite: data.overwrite,
      data: packetData,
    };
  }

  public trackPacket(
    client: Client,
    raw: T,
    descriptorId: number,
    instanceId: number,
  ): trackPacket | null {
    const mask = this.getMaskResult(client, raw, this._globalMask);

    if (!mask) {
      return null; // Client does not have permission to track this packet
    }

    return {
      type: 'track',
      index: this._packetIndex++,
      instanceId,
      descriptorId,
    };
  }

  public untrackPacket(instanceId: number): UntrackPacket {
    return {
      type: 'untrack',
      index: this._packetIndex++,
      instanceId,
    };
  }
}
