import { PlayerGameData, StategoPlayerGameData } from './player/PlayerGameData';
import { LobbyGameData, StategoLobbyGameData } from './lobby/LobbyGameData';
import { Player } from '../managers/lobby/Player';

export type GameType<P extends PlayerGameData, L extends LobbyGameData> = {
  id: string;
  createLobbyData: () => L;
  createPlayerData: (player: Player) => P;
};

export const StrategoGameId = 'stratego';
export const StrategoGameType: GameType<
  StategoPlayerGameData,
  StategoLobbyGameData
> = {
  id: StrategoGameId,
  createLobbyData: () => ({
    gameId: StrategoGameId,
  }),
  createPlayerData: () => ({
    gameId: StrategoGameId,
    roleCard: 'mineur',
  }),
};

export const GameTypes = [StrategoGameType];
