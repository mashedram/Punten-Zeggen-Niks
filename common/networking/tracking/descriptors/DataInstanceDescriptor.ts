import { FieldMask } from '@/common/networking/packet/PacketBuilder';
import { DataStore } from '@/common/networking/tracking/stores/DataStore';
import { LoadingSymbolType } from '@/common/networking/tracking/trackable/Dereferable';
import { Trackable } from '@/common/networking/tracking/trackable/Trackable';
import { Deref } from '@/common/networking/tracking/tracker/TrackedInstanceReference';
import {
  LobbyDataDescriptor,
  PlayerDataDescriptor,
} from '@/common/networking/tracking/descriptors/LobbyInstanceDescriptor';
import {
  LobbyDataGameInstanceDescriptor,
  PlayerDataGameInstanceDescriptor,
} from '@/common/networking/tracking/descriptors/StrategoInstanceDescriptors';

export type TrackableFactory<T> = (data: T, step?: number) => Trackable<T>;

export type DataInstanceDescriptor<T> = {
  /**
   * Any unique number will suffice.
   */
  id: number;
  name: string;
  tracker: DataTrackerDescriptor;
  mask: FieldMask<T>;
  factory: TrackableFactory<T>;
  deref: (value: T, store: DataStore) => Deref<T> | LoadingSymbolType;
};

export type DataTrackerDescriptor = {
  name: string;
};

const DESCRIPTOR_REGISTRY = {
  [LobbyDataDescriptor.id]: LobbyDataDescriptor,
  [PlayerDataDescriptor.id]: PlayerDataDescriptor,
  [LobbyDataGameInstanceDescriptor.id]: LobbyDataGameInstanceDescriptor,
  [PlayerDataGameInstanceDescriptor.id]: PlayerDataGameInstanceDescriptor,
};

export function getDataInstanceDescriptor(
  id: number,
): DataInstanceDescriptor<unknown> | undefined {
  return DESCRIPTOR_REGISTRY[id] as DataInstanceDescriptor<unknown> | undefined;
}
