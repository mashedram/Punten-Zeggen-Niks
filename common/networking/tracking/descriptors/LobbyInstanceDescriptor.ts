import {
  Deref,
  TrackedInstanceReference,
} from '@/common/networking/tracking/tracker/TrackedInstanceReference';
import {
  DataInstanceDescriptor,
  DataTrackerDescriptor,
} from '@/common/networking/tracking/descriptors/DataInstanceDescriptor';
import { DataStore } from '@/common/networking/tracking/stores/DataStore';
import { StagedObject } from '@/common/networking/tracking/trackable/stagedobject/StagedObject';
import {
  LobbyDataStratego,
  PlayerDataStratego,
} from '@/api/managers/stratego/StrategoGame';
import {
  LoadingSymbol,
  LoadingSymbolType,
} from '@/common/networking/tracking/trackable/Dereferable';

export const LobbyTrackerDescriptor: DataTrackerDescriptor = {
  name: 'lobby-tracker',
};

const StagedObejctFactory = <T extends Record<string, unknown>>(
  data: T,
  step?: number,
) => new StagedObject<T>(data, step);

export type PlayerData = {
  id: string;
  name: string;
  isAdmin: boolean;
  gameData: TrackedInstanceReference<PlayerDataStratego> | undefined;
  isLeader: boolean;
};

export const PlayerDataDescriptor: DataInstanceDescriptor<PlayerData> = {
  id: 9298935738753,
  name: 'playerdata',
  tracker: LobbyTrackerDescriptor,
  mask: {
    global: 'public',
  },
  factory: StagedObejctFactory,
  deref: function (
    value: PlayerData,
    store: DataStore,
  ): Deref<PlayerData> | LoadingSymbolType {
    const gameData =
      value.gameData && store.getFromRef(value.gameData)?.deref(store);
    if (gameData === LoadingSymbol) return LoadingSymbol;
    if (value.gameData && gameData === undefined) return LoadingSymbol;
    return {
      ...value,
      gameData,
    };
  },
};

export type LobbyData = {
  code: string;
  players: TrackedInstanceReference<PlayerData>[];
  game: TrackedInstanceReference<LobbyDataStratego> | undefined;
};

export const LobbyDataDescriptor: DataInstanceDescriptor<LobbyData> = {
  id: 6487378259325,
  name: 'lobby-data',
  tracker: LobbyTrackerDescriptor,
  mask: {
    global: 'public',
  },
  factory: StagedObejctFactory,
  deref: function (
    value: LobbyData,
    store: DataStore,
  ): Deref<LobbyData> | LoadingSymbolType {
    const players = value.players
      .map(p => store.getFromRef(p)?.deref(store))
      .filter(p => p !== undefined);
    if (players.some(p => p === LoadingSymbol)) return LoadingSymbol;
    const game = value.game && store.getFromRef(value.game)?.deref(store);
    if (game === LoadingSymbol) return LoadingSymbol;
    return {
      code: value.code,
      // @ts-expect-error Loadingsymbol gets returned early but not removed from the type
      players,
      game,
    };
  },
};
