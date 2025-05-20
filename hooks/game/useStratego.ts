import { ExpoRouter, Router, useRouter } from 'expo-router';
import { LobbyState, useLobby } from '../useLobby';
import { StategoPlayerGameData } from '@/api/game/player/PlayerGameData';
import { StategoLobbyGameData } from '@/api/game/lobby/LobbyGameData';
import { StrategoGameId } from '@/api/game/GameType';

export enum InitalizationFailureReason {
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
      lobby: StategoLobbyGameData;
      self: StategoPlayerGameData;
      otherPlayers: StategoPlayerGameData[];
    };

export function useStratego(lobby: LobbyState): StategoState {
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
