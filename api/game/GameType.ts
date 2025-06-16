import { Lobby } from '../managers/lobby/Lobby';
import { Player } from '../managers/lobby/Player';
import { GameTypeStratego } from '../managers/stratego/StrategoGame';
import { LobbyGameData } from './lobby/LobbyGameData';
import { PlayerGameData } from './player/PlayerGameData';

export type GameType<P extends PlayerGameData, L extends LobbyGameData> = {
  id: string;
  createLobbyData: () => L;
  createPlayerData: (lobbyData: Lobby, player: Player) => P;
  onGameStart?: (lobby: Lobby) => void;
  onLateJoin?: (lobby: Lobby, player: Player) => void;
};

export const GameTypes = [GameTypeStratego];
