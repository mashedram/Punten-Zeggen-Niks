import {
  DataPacket,
  trackPacket,
  UntrackPacket,
} from '@/common/networking/packet/Packet';
import { DataPacketContents } from '@/common/networking/tracking/trackable/Trackable';

export type FieldMaskValue = 'public' | 'protected' | undefined;
export type FieldMask<T> = Partial<Record<keyof T, FieldMaskValue>> & {
  '*'?: FieldMaskValue;
};

export type HasStar<T> = T[keyof T] extends '*' ? true : false;

// Type clusterfuck.
// Basically checks what the field is and removes it from BuildData if the type should be hidden.
export type PartialDataField<
  T,
  M extends FieldMaskValue,
  A extends boolean,
> = M extends 'public'
  ? T
  : M extends 'protected'
    ? A extends true
      ? T
      : undefined
    : undefined;
export type BuildData<T, M extends FieldMask<T>, A extends boolean> = {
  [K in keyof T]: PartialDataField<T[K], M[K], A | HasStar<T>>;
};
export type ProtectedData<T, M extends FieldMask<T>> = BuildData<T, M, true>;
export type PublicData<T, M extends FieldMask<T>> = BuildData<T, M, false>;

export class PacketBuilder<T> {
  private _packetIndex;
  private _fieldMask: FieldMask<T>;

  constructor(fieldMask: FieldMask<T>) {
    this._packetIndex = 0;
    this._fieldMask = fieldMask;
  }

  public build(
    data: Partial<T>,
    isAuthorized: boolean,
  ): BuildData<T, typeof this._fieldMask, typeof isAuthorized> {
    const result = {};
    const globalMask = this._fieldMask['*'];
    for (const key in data) {
      let mask = this._fieldMask[key] as FieldMaskValue;

      if (!mask) {
        if (globalMask) {
          mask = globalMask;
        } else {
          continue;
        }
      }

      if (mask === 'protected' && !isAuthorized) {
        continue;
      }

      // @ts-expect-error Can't be bothered to fight typescript
      result[key] = structuredClone(data[key]);
    }

    // TypeScript doesn't see it, but we can guarantee the type matches here
    return data as BuildData<T, typeof this._fieldMask, typeof isAuthorized>;
  }

  public pack(
    clientStep: number,
    data: DataPacketContents<T>,
    id: number,
    descriptorId: number,
    isAuthorized: boolean,
  ): DataPacket<BuildData<T, typeof this._fieldMask, typeof isAuthorized>> {
    const packetData = this.build(data.data, isAuthorized);

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

  public trackPacket(descriptorId: number, instanceId: number): trackPacket {
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
