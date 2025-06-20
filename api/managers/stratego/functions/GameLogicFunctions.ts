import { GameState } from '@/constants/GameState';
import { Lobby } from '../../lobby/Lobby';
import { getLobbyData } from '../StrategoGame';
import { checkActiveRoleCards } from './RoleCardFunctions';

export function endGame(lobby: Lobby, winningTeamId: string) {
  const lobbyData = getLobbyData(lobby);
  if (winningTeamId === 'red') {
    lobbyData.gameState = String(GameState.red_wins);
  } else if (winningTeamId === 'blue') {
    lobbyData.gameState = String(GameState.blue_wins);
  } else {
    // there is no state where a game can draw, but we handle it just in case
    console.warn('Game ended in a draw, no winning team found.');
    lobbyData.gameState = String(GameState.draw);
  }
  lobby.sync();
  console.log(`Game ended. Team ${winningTeamId} has won.`);
}

export function checkWinConditions(lobby: Lobby) {
  const lobbyData = getLobbyData(lobby);
  const teams = lobbyData.teams;
  if (teams.some(team => Object.keys(team.deck).length <= 0)) {
    const emptyDeckTeam = teams.find(
      team => Object.keys(team.deck).length <= 0,
    )?.id;
    if (!checkActiveRoleCards(lobby, emptyDeckTeam!)) {
      const winningTeamId = teams.find(team => team.deck.length > 0)?.id;
      endGame(lobby, winningTeamId!);
    }
  }
}
