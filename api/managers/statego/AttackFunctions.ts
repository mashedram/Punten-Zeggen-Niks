import { Lobby } from '../lobby/Lobby';
import { Player } from '../lobby/Player';
import {
  getLobbyData,
  getPlayerData,
  getRoleCardFromDeck,
  endGame,
} from './StrategoGame';
import { GameState } from '../../../constants/GameState';
import { RoleCard, RoleCards } from '../../../constants/RoleCards';

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
  console.log(
    `Performing attack: ${attacker.getId()} ${attackerData.roleCard} vs ${defender.getId()} ${defenderData.roleCard}`,
  );

  // check for team conflict
  if (attackerData.teamId === defenderData.teamId) {
    console.warn('Cannot attack a player from the same team.');
    return;
  }
  // check if game is still active
  if (getLobbyData(lobby).gameState !== String(GameState.playing)) {
    console.warn('Game is not active, cannot perform attack.');
    return;
  }

  // no role card for attacker or defender
  if (!attackerCard) {
    console.warn('Attacker does not have a role card.', attackerCard);
    return;
  }
  if (!defenderCard) {
    console.warn('Defender does not have a role card.', defenderCard);
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
  // spion verslaat maarschalk
  // TODO???: spion verliest als hij aangevallen wordt door maarschalk
  if (
    attackerCard.name === RoleCards.spion.name &&
    defenderCard.name === RoleCards.maarschalk.name
  ) {
    console.log('Spion vs Maarschalk detected. Spion wins.');
    win(attacker);
    defeat(defender);
    return;
  }
  if (
    defenderCard.name === RoleCards.spion.name &&
    attackerCard.name === RoleCards.maarschalk.name
  ) {
    console.log('Maarschalk vs Spion detected. Spion wins.');
    win(defender);
    defeat(attacker);
    return;
  }

  // TODO: bom kan niet aanvallen, maar kan wel verdedigen
  if (
    attackerCard.name === RoleCards.bom.name ||
    defenderCard.name === RoleCards.bom.name
  ) {
    console.log(
      'Bom detected in the fight. attacker:',
      attackerCard.name,
      'defender:',
      defenderCard.name,
    );
    if (
      attackerCard.name === RoleCards.mineur.name ||
      defenderCard.name !== RoleCards.mineur.name
    ) {
      if (attackerCard.name === RoleCards.mineur.name) {
        win(attacker);
        defeat(defender);
        console.log('Attacker wins, mineur defuses bom');
        return;
      }
      if (defenderCard.name === RoleCards.mineur.name) {
        win(defender);
        defeat(attacker);
        console.log('Defender wins, mineur defuses bom');
        return;
      }
    }

    if (
      attackerCard.name === RoleCards.bom.name &&
      defenderCard.name === RoleCards.bom.name
    ) {
      explode(attacker);
      explode(defender);
      console.log('Both players explode');
      return;
    }
    if (attackerCard.name === RoleCards.bom.name) {
      explode(attacker);
      defeat(defender);
      console.log('Attacker loses, bom explodes');
      return;
    }
    if (defenderCard.name === RoleCards.bom.name) {
      explode(defender);
      defeat(attacker);
      console.log('Defender loses, bom explodes');
      return;
    }
  }

  // Atacker wins
  if (attackerCard.value > defenderCard.value) {
    console.log(
      `Attacker wins: ${attackerCard.name} (${attackerCard.value}) vs ${defenderCard.name} (${defenderCard.value})`,
    );
    win(attacker);
    defeat(defender);
    return;
  }

  // Defender wins
  if (attackerCard.value < defenderCard.value) {
    console.log(
      `Defender wins: ${defenderCard.name} (${defenderCard.value}) vs ${attackerCard.name} (${attackerCard.value})`,
    );
    win(defender);
    defeat(attacker);
    return;
  }

  // Both cards have the same value, resulting in a draw
  // TODO: Implement edgecases
  console.log(
    `Both players have the same card value: ${attackerCard.value}. It's a draw.`,
  );
  draw(attacker);
  draw(defender);
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
