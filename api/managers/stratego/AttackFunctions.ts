import { Lobby } from '../lobby/Lobby';
import { Player } from '../lobby/Player';
import { getPlayerData, endGame } from './StrategoGame';
import { RoleCard, RoleCards } from '@/constants/RoleCards';

export function performAttack(
  lobby: Lobby,
  attacker: Player,
  defender: Player,
) {
  const attackerData = getPlayerData(attacker);
  const defenderData = getPlayerData(defender);
  if (!attackerData || !defenderData) {
    console.warn('Player data not found for attacker or defender.');
    return;
  }
  const attackerCard = getRoleCard(attackerData.roleCard);
  const defenderCard = getRoleCard(defenderData.roleCard);

  // check for team conflict
  if (attackerData.teamId === defenderData.teamId) {
    console.warn('Cannot attack a player from the same team.');
    return;
  }

  // no role card for attacker or defender
  if (!attackerCard || !defenderCard) {
    console.warn(
      'Attacker or defender does not have a role card.',
      attackerCard,
      defenderCard,
    );
    return;
  }

  // check if attacker can attack
  if (!attackerCard.canAttack) {
    console.warn(
      `Attacker ${attacker.getId()} cannot attack with card ${attackerCard.id}.`,
    );
    return;
  }

  // check if defender has a flag
  if (defenderCard.id === RoleCards.vlag.id) {
    endGame(lobby, attackerData.teamId);
    console.log(
      `Team ${attackerData.teamId} has captured the flag of team ${defenderData.teamId}.`,
    );
    return;
  }

  if (attackerCard.beats.includes(defenderCard)) {
    console.log(
      `Attacker ${attacker.getId()}, ${attackerCard.id} wins against defender ${defender.getId()}, ${defenderCard.id}.`,
    );
    win(attacker);
    defeat(defender);
    return;
  }

  if (defenderCard.beats.includes(attackerCard)) {
    console.log(
      `Defender ${defender.getId()} wins against attacker ${attacker.getId()}.`,
    );
    if (defenderCard.id === RoleCards.bom.id) {
      explode(defender);
    } else {
      win(defender);
    }
    defeat(attacker);
    return;
  }

  if (attackerCard === defenderCard) {
    console.log(
      `Both players ${attacker.getId()} and ${defender.getId()} have the same card. It's a draw.`,
    );
    draw(attacker);
    draw(defender);
    return;
  }
}

function draw(player: Player) {
  const data = getPlayerData(player);
  data.lastFightResult = {
    type: 'success',
    index: data.lastFightResult ? data.lastFightResult.index + 1 : 0,
    state: 'draw',
  };
}

function win(player: Player) {
  console.log(`Player ${player.getId()} wins the fight.`);
  const data = getPlayerData(player);
  data.lastFightResult = {
    type: 'success',
    index: data.lastFightResult ? data.lastFightResult.index + 1 : 0,
    state: 'win',
  };
}

function defeat(player: Player) {
  console.log(`Player ${player.getId()} loses the fight.`);
  const playerData = getPlayerData(player);
  deleteRoleCard(player);
  playerData.lastFightResult = {
    type: 'success',
    index: playerData.lastFightResult
      ? playerData.lastFightResult.index + 1
      : 0,
    state: 'lose',
  };
  player.sync();
}

function explode(player: Player) {
  console.log(`Player ${player.getId()} explodes.`);
  const playerData = getPlayerData(player);
  deleteRoleCard(player);
  playerData.lastFightResult = {
    type: 'success',
    index: playerData.lastFightResult
      ? playerData.lastFightResult.index + 1
      : 0,
    state: 'explode',
  };
  player.sync();
}

function getRoleCard(cardId?: string): RoleCard | undefined {
  console.log(`Getting role card for cardId: ${cardId}`);
  if (cardId === undefined) {
    console.warn(`Role card with id ${cardId} not found.`);
    return undefined;
  }

  const RoleCard = RoleCards[cardId];
  if (!RoleCard) {
    console.warn(`Role card with id ${cardId} not found.`);
    return undefined;
  }
  return RoleCards[cardId];
}

function deleteRoleCard(player: Player) {
  const playerData = getPlayerData(player);
  const lobby = player.getLobby();
  if (!playerData.roleCard) {
    console.warn(`Player ${player.getId()} has no role card to remove.`);
    return;
  }
  playerData.roleCard = undefined;
  playerData.hasRoleCard = false;
  lobby.sync();
}
