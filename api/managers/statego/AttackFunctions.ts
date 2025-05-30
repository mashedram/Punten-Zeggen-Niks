import { Lobby } from '../lobby/Lobby';
import { Player } from '../lobby/Player';
import { getPlayerData, getRoleCardFromDeck, endGame } from './StrategoGame';
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

  // check if defender has a flag
  // TODO: vlag kan niet aanvallen, maar kan wel verdedigen
  if (defenderCard.name === RoleCards.vlag.name) {
    endGame(lobby, attackerData.teamId);
    console.log(
      `Team ${attackerData.teamId} has captured the flag of team ${defenderData.teamId}.`,
    );
    return;
  }

  if (attackerCard.beats.includes(defenderCard)) {
    console.log(
      `Attacker ${attacker.getId()} wins against defender ${defender.getId()}.`,
    );
    win(defender);
    defeat(attacker);
    return;
  }

  if (defenderCard.beats.includes(attackerCard)) {
    console.log(
      `Defender ${defender.getId()} wins against attacker ${attacker.getId()}.`,
    );
    win(attacker);
    defeat(defender);
    return;
  }

  if (attackerCard === defenderCard) {
    if (
      attackerCard.name === RoleCards.bom.name ||
      defenderCard.name === RoleCards.bom.name
    ) {
      console.log(
        `Both players ${attacker.getId()} and ${defender.getId()} have a bomb. Both players explode.`,
      );
      explode(attacker);
      explode(defender);
      return;
    }
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
    index: data.lastFightResult ? data.lastFightResult.index + 1 : 0,
    state: 'draw',
  };
  player.sync();
}

function win(player: Player) {
  const data = getPlayerData(player);
  data.lastFightResult = {
    index: data.lastFightResult ? data.lastFightResult.index + 1 : 0,
    state: 'win',
  };
  player.sync();
}

function defeat(player: Player) {
  const playerData = getPlayerData(player);
  playerData.roleCard = getRoleCardFromDeck(
    player.getLobby(),
    playerData.teamId,
  );
  playerData.lastFightResult = {
    index: playerData.lastFightResult
      ? playerData.lastFightResult.index + 1
      : 0,
    state: 'lose',
  };
  player.sync();
}

function explode(player: Player) {
  const playerData = getPlayerData(player);
  playerData.roleCard = getRoleCardFromDeck(
    player.getLobby(),
    playerData.teamId,
  );
  playerData.lastFightResult = {
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
