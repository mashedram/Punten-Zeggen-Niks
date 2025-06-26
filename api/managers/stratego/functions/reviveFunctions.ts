import { RoleCard } from '@/constants/RoleCards';
import { Lobby } from '../../lobby/Lobby';
import { Player } from '../../lobby/Player';
import { getLobbyData, getPlayerData } from '../StrategoGame';
import { removeRoleCardFromDeck } from './RoleCardFunctions';

export function revivePlayer(
  lobby: Lobby,
  player: Player,
  target: Player,
  roleCard: RoleCard,
) {
  const playerData = getPlayerData(player);
  const targetData = getPlayerData(target);
  const lobbyData = getLobbyData(lobby);
  const teams = lobbyData.teams;
  const team = teams.find(team => team.id === playerData.teamId);
  if (team === undefined)
    throw new Error('Could not find team while assigning a flag.');
  targetData.roleCard = roleCard.id;
  targetData.hasRoleCard = true;
  team.hasFlag = true;
  lobbyData.teams = teams;
  removeRoleCardFromDeck(lobby, playerData.teamId, roleCard.id);
  console.log(
    `Player ${target.getId()}, ${target.getName()} has been revived with role card: ${targetData.roleCard}`,
  );
}
