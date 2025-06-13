export type PacketDataLayout = Record<string, unknown>;

export const packetTypes = ['data', 'identify', 'track', 'untrack'] as const;
export type PacketTypes = (typeof packetTypes)[number];

export type BasePacket<T extends PacketTypes> = {
  index: number;
  type: T;
};

export type IdentifyPacket = {
  id: string;
  token: string;
} & BasePacket<'identify'>;

export type trackPacket = {
  instanceId: number;
  descriptorId: number;
} & BasePacket<'track'>;

export type UntrackPacket = {
  instanceId: number;
} & BasePacket<'untrack'>;

export type DataPacket<T> = {
  instanceId: number;
  descriptorId: number;
  step: number;
  clientExpectedStep: number;
} & (
  | {
      overwrite: true;
      data: T;
    }
  | {
      overwrite: false;
      data: Partial<T>;
    }
) &
  BasePacket<'data'>;

export type Packet<T> =
  | DataPacket<T>
  | IdentifyPacket
  | UntrackPacket
  | trackPacket;
