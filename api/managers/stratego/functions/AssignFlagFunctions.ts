import { RoleCard, RoleCardKeys, RoleCards } from '@/constants/RoleCards';
import { Lobby } from '../../lobby/Lobby';
import { Player } from '../../lobby/Player';
import { getPlayerData, getLobbyData } from '../StrategoGame';
import { removeRoleCardFromDeck } from './RoleCardFunctions';

export function assignFlag(lobby: Lobby, player: Player, targetPlayer: Player) {
  const playerData = getPlayerData(player);
  const targetData = getPlayerData(targetPlayer);
  const lobbyData = getLobbyData(lobby);
  const teams = lobbyData.teams;
  const team = teams.find(team => team.id === playerData.teamId);
  if (team === undefined)
    throw new Error('Could not find team while assigning a flag.');
  targetData.roleCard = RoleCards.vlag.id;
  targetData.hasRoleCard = true;
  removeRoleCardFromDeck(lobby, playerData.teamId, RoleCards.vlag.id);
  assignRandomRoleCards(lobby, playerData.teamId);
  team.hasFlag = true;
  lobbyData.teams = teams;
}

function assignRandomRoleCards(lobby: Lobby, teamId: string) {
  const players = lobby
    .getActivePlayers()
    .filter(
      player =>
        getPlayerData(player).teamId === teamId &&
        !getPlayerData(player).hasRoleCard,
    );
  for (const player of players) {
    const playerData = getPlayerData(player);
    const newRoleCard = getRandomRoleCard(lobby, teamId);
    playerData.roleCard = newRoleCard.id;
    playerData.hasRoleCard = true;
    removeRoleCardFromDeck(lobby, teamId, newRoleCard.id);
  }
}

function getRandomRoleCard(lobby: Lobby, teamId: string): RoleCard {
  const lobbyData = getLobbyData(lobby);
  const team = lobbyData.teams.find(team => team.id === teamId);
  if (team === undefined) throw new Error(`no team found on id: ${teamId}`);

  const availableCardIds = Object.keys(team.deck).filter(
    cardId => team.deck[cardId] > 0,
  );
  const randomCardId =
    availableCardIds[Math.floor(Math.random() * availableCardIds.length)];

  return RoleCards[randomCardId as RoleCardKeys];
}
