import { useLobby } from '../useLobby';
import {
  type PlayerDataStratego,
  type LobbyDataStratego,
  StrategoGameId,
} from '@/api/managers/stratego/StrategoGame';
import { useClient } from '../networking/useClient';

export enum InitalizationFailureReason {
  // eslint-disable-next-line no-unused-vars
  Loading,
  // eslint-disable-next-line no-unused-vars
  NotInLobby,
  // eslint-disable-next-line no-unused-vars
  GameNotRunning,
}
type PlayerDataStrategoExtended = PlayerDataStratego & {
  id: string;
};

export type StategoStateUnsafe = {
  lobby: LobbyDataStratego;
  self: PlayerDataStrategoExtended;
  players: PlayerDataStrategoExtended[];
};

export type StategoState =
  | {
      initialized: false;
      reason: InitalizationFailureReason;
    }
  | ({
      initialized: true;
    } & StategoStateUnsafe);

export function useStratego(): StategoState {
  const client = useClient();
  const lobby = useLobby();

  if (client.isLoading) {
    return {
      initialized: false,
      reason: InitalizationFailureReason.Loading,
    };
  }

  if (lobby.loading) {
    return {
      initialized: false,
      reason: InitalizationFailureReason.Loading,
    };
  }

  if (!lobby.inLobby) {
    return {
      initialized: false,
      reason: InitalizationFailureReason.NotInLobby,
    };
  }

  const data = lobby.get();

  if (!data) {
    console.error('Lobby data not found');
    return {
      initialized: false,
      reason: InitalizationFailureReason.NotInLobby,
    };
  }

  const lobbyData = data.game;

  if (!lobbyData) {
    console.debug('Lobby game data not found');
    return {
      initialized: false,
      reason: InitalizationFailureReason.GameNotRunning,
    };
  }

  if (lobbyData.gameId !== StrategoGameId) {
    return {
      initialized: false,
      reason: InitalizationFailureReason.GameNotRunning,
    };
  }

  const selfData = data.players.find(p => p.id === client.getId())?.gameData;
  if (!selfData) {
    console.debug('Self game data not found');
    return {
      initialized: false,
      reason: InitalizationFailureReason.Loading,
    };
  }

  if (selfData.gameId !== StrategoGameId) {
    console.debug('Self game data not set to stratego');
    return {
      initialized: false,
      reason: InitalizationFailureReason.GameNotRunning,
    };
  }

  const selfDataExtender: PlayerDataStrategoExtended = {
    ...selfData,
    id: client.getId(),
  };

  const otherPlayerData: PlayerDataStrategoExtended[] = [];
  for (const player of data.players) {
    const playerData = player.gameData;
    if (!playerData) {
      console.debug('Player game data not found');
      continue;
    }
    // Other players not using the game ID will be counted as not playing
    if (playerData.gameId !== StrategoGameId) {
      console.debug('Player game data not set to stratego');
      continue;
    }
    otherPlayerData.push({ ...playerData, id: player.id });
  }

  return {
    initialized: true,
    lobby: lobbyData,
    self: selfDataExtender,
    players: otherPlayerData,
  };
}
