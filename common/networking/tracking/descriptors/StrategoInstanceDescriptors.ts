import { DataInstanceDescriptor } from '@/common/networking/tracking/descriptors/DataInstanceDescriptor';
import { StagedObject } from '@/common/networking/tracking/trackable/stagedobject/StagedObject';
import { DataStore } from '@/common/networking/tracking/stores/DataStore';
import { PlayerGameData } from '@/api/game/player/PlayerGameData';
import { LobbyGameData } from '@/api/game/lobby/LobbyGameData';
import { LobbyTrackerDescriptor } from '@/common/networking/tracking/descriptors/LobbyInstanceDescriptor';

const StagedObejctFactory = <T extends Record<string, unknown>>(
  data: T,
  step?: number,
) => new StagedObject<T>(data, step);

export const PlayerDataGameInstanceDescriptor: DataInstanceDescriptor<PlayerGameData> =
  {
    id: 35834793634769,
    name: 'game-player-data',
    tracker: LobbyTrackerDescriptor,
    factory: StagedObejctFactory,
    deref: (value: PlayerGameData, store: DataStore) => {
      return value;
    },
    mask: {
      global: 'public',
    },
  };

export const LobbyDataGameInstanceDescriptor: DataInstanceDescriptor<LobbyGameData> =
  {
    id: 3578367686152632,
    name: 'game-lobby-data',
    tracker: LobbyTrackerDescriptor,
    factory: StagedObejctFactory,
    deref: (value: LobbyGameData, store: DataStore) => {
      return value;
    },
    mask: {
      global: 'public',
    },
  };
