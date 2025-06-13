import {
  BasePacket,
  DataPacket,
  IdentifyPacket,
  PacketTypes as PacketType,
  trackPacket,
  UntrackPacket,
} from '@/common/networking/packet/Packet';

export type EncodeFormat = unknown[];
export type EncodedPacket = [index: number, type: number, ...EncodeFormat];

type PackMap<T extends BasePacket<PacketType>> = Record<
  keyof Omit<T, 'index' | 'type'>,
  0
>;

const TypeIndexMap: Record<PacketType, number> = {
  identify: 0,
  track: 1,
  untrack: 2,
  data: 3,
};

export class PacketCodex<I extends PacketType, T extends BasePacket<I>> {
  private _type: I;
  private _packMap: PackMap<T>;

  constructor(type: I, packMap: PackMap<T>) {
    this._type = type;
    this._packMap = packMap;
  }

  public encode(packet: T): EncodedPacket {
    const index = packet.index;
    const type = TypeIndexMap[this._type];
    const result: EncodedPacket = [index, type];

    for (const key in this._packMap) {
      if (key in packet) {
        // @ts-expect-error We We can garantee this object can be indexed by these keys.
        const value = packet[key] as never;
        result.push(value);
      }
    }

    return result;
  }

  public decode(packet: EncodedPacket): T {
    const index = packet[0];
    const type =
      Object.keys(TypeIndexMap)[
        Object.values(TypeIndexMap).findIndex(t => t === packet[1])
      ];

    const results: Record<string, unknown> = {};
    const keys = Object.keys(this._packMap);
    for (let i = 0; i < keys.length; i++) {
      const valueKey = keys[i];
      results[valueKey] = packet[i + 2];
    }

    return {
      index,
      type,
      ...results,
    } as unknown as T;
  }

  public isA(t: PacketType): this is PacketCodexMap[typeof t] {
    return t === this._type;
  }
}

type PacketCodexMap = {
  identify: PacketCodex<'identify', IdentifyPacket>;
  track: PacketCodex<'track', trackPacket>;
  untrack: PacketCodex<'untrack', UntrackPacket>;
  data: PacketCodex<'data', DataPacket<never>>;
};

const packetCodexMap: PacketCodexMap = {
  identify: new PacketCodex('identify', {
    id: 0,
    token: 0,
  }),
  track: new PacketCodex('track', {
    instanceId: 0,
    descriptorId: 0,
  }),
  untrack: new PacketCodex('untrack', {
    instanceId: 0,
  }),
  data: new PacketCodex('data', {
    step: 0,
    clientExpectedStep: 0,
    instanceId: 0,
    descriptorId: 0,
    overwrite: 0,
    data: 0,
  }),
};

export class PacketTransformer {
  public getEncodedType(packet: EncodedPacket): PacketType {
    const index = packet[1];
    return Object.keys(TypeIndexMap)[index] as PacketType;
  }

  public encode<T extends BasePacket<PacketType>>(packet: T) {
    const codex = packetCodexMap[packet.type];
    // @ts-expect-error Typescript cannot correctly resolve the type of the array. As long as the type matches, it is valid.
    return codex.encode(packet);
  }

  public decode<T extends BasePacket<PacketType>>(packet: EncodedPacket): T {
    const type = this.getEncodedType(packet);
    // @ts-expect-error Same as above, typescript cannot resolve this type correctly.
    return packetCodexMap[type].decode(packet);
  }
}
