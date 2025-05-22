import { useTRPC } from '@/api/query';
import { LobbyState } from '../useLobby';
import {
  type StrategoPlayerGameData,
  type StrategoLobbyGameData,
  StrategoGameId,
} from '@/api/managers/statego/StrategoGame';
import { useCallback } from 'react';

export enum InitalizationFailureReason {
  Loading,
  NotInLobby,
  GameNotRunning,
}

export type StategoState =
  | {
      initialized: false;
      reason: InitalizationFailureReason;
    }
  | {
      initialized: true;
      lobby: StrategoLobbyGameData;
      self: StrategoPlayerGameData;
      otherPlayers: StrategoPlayerGameData[];
    };

export function useStratego(lobby: LobbyState): StategoState {
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
    return {
      initialized: false,
      reason: InitalizationFailureReason.NotInLobby,
    };
  }
  if (!data.game) {
    return {
      initialized: false,
      reason: InitalizationFailureReason.GameNotRunning,
    };
  }

  const lobbyData = data.game;
  if (lobbyData.gameId !== StrategoGameId)
    return {
      initialized: false,
      reason: InitalizationFailureReason.GameNotRunning,
    };

  const selfData = data.self.gameData;
  if (selfData.gameId !== StrategoGameId)
    return {
      initialized: false,
      reason: InitalizationFailureReason.GameNotRunning,
    };

  const otherPlayerData = [];
  for (const player of data.players) {
    const playerData = player.gameData;
    // Other players not using the game ID will be counted as not playing
    if (playerData.gameId !== StrategoGameId) continue;
    otherPlayerData.push(playerData);
  }

  return {
    initialized: true,
    lobby: lobbyData,
    self: selfData,
    otherPlayers: otherPlayerData,
  };
}
