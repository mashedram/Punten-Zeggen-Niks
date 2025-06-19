import { Lobby } from '../../lobby/Lobby';
import { Player } from '../../lobby/Player';
import { getLobbyData, getPlayerData } from '../StrategoGame';

export function getAvailableRoleCards(
  lobby: Lobby,
  player: Player,
): Record<string, number> {
  const lobbyData = getLobbyData(lobby);
  const playerData = getPlayerData(player);
  const teamId = playerData.teamId;
  const team = lobbyData.teams.find(team => team.id === teamId);
  if (!team) throw new Error(`Team ${teamId} not found in lobby data.`);
  if (team.deck.vlag > 0) return { vlag: 1 };
  return team.deck;
}

export function getPlayersWithoutRoleCards(
  lobby: Lobby,
  player: Player,
): string[] {
  const playerData = getPlayerData(player);
  if (!playerData.isTeamLeader)
    throw new Error(
      'Only team leaders can check for players without role cards.',
    );
  const teamId = playerData.teamId;
  const playersWithoutRoleCards: string[] = [];

  for (const p of lobby.getActivePlayers()) {
    const pData = getPlayerData(p);
    if (pData.teamId === teamId && !pData.roleCard) {
      playersWithoutRoleCards.push(p.getId());
    }
  }

  return playersWithoutRoleCards;
}

export function removeRoleCardFromDeck(
  lobby: Lobby,
  teamId: string,
  cardId: string,
) {
  const lobbyData = getLobbyData(lobby);
  const teams = lobbyData.teams;
  const team = teams.find(team => team.id === teamId);
  if (!team || !team.deck || !team.deck[cardId])
    throw new Error(`Card ${cardId} not found in team ${teamId} deck.`);
  team.deck[cardId] = team.deck[cardId] - 1;
  if (team.deck[cardId] <= 0) {
    delete team.deck[cardId];
  }
  console.log(
    `Removed ${cardId} from deck in team ${teamId}, team has ${team.deck[cardId]} left of role ${cardId}`,
  );
  lobbyData.teams = teams;
}

export function checkActiveRoleCards(lobby: Lobby, teamId: string): boolean {
  const players = lobby
    .getActivePlayers()
    .filter(player => getPlayerData(player).teamId === teamId);
  return players.some(player => getPlayerData(player).roleCard === undefined);
}
