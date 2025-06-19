import { RoleCard } from '@/constants/RoleCards';
import { Lobby } from '../../lobby/Lobby';
import { Player } from '../../lobby/Player';
import { getPlayerData } from '../StrategoGame';
import { removeRoleCardFromDeck } from './RoleCardFunctions';

export function revivePlayer(
  lobby: Lobby,
  player: Player,
  target: Player,
  roleCard: RoleCard,
) {
  const playerData = getPlayerData(player);
  const targetData = getPlayerData(target);
  targetData.roleCard = roleCard.id;
  targetData.hasRoleCard = true;
  removeRoleCardFromDeck(lobby, playerData.teamId, roleCard.id);
  console.log(
    `Player ${target.getId()}, ${target.getName()} has been revived with role card: ${targetData.roleCard}`,
  );
}
