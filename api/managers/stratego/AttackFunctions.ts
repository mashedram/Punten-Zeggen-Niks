import { publicDecrypt } from 'crypto';
import { Lobby } from '../lobby/Lobby';
import { Player } from '../lobby/Player';
import { getPlayerData, endGame, PlayerDataStratego } from './StrategoGame';
import { RoleCard, RoleCards } from '@/constants/RoleCards';

type PlayerFightResult = {
  index: number;
  state: 'win' | 'lose' | 'draw' | 'explode';
};

class PlayerFightState {
  private _index: number;
  private _player: Player;
  private _roleCard: RoleCard;
  private _defeated: boolean;

  constructor(index: number, player: Player, roleCard: RoleCard) {
    this._index = index;
    this._player = player;
    this._roleCard = roleCard;
    this._defeated = false;
  }

  public getPlayer(): Player {
    return this._player;
  }

  public getRoleCard(): RoleCard {
    return this._roleCard;
  }

  public defeat() {
    this._defeated = true;
  }
}

type FightState = {
  attacker: PlayerFightState;
  defender: PlayerFightState;
};

function getFightIndex(playerData: PlayerDataStratego): number {
  return (playerData.lastFightResult?.index ?? 0) + 1;
}

function buildPlayerFightState(
  player: Player,
  data: PlayerDataStratego = getPlayerData(player),
): PlayerFightState {
  const index = getFightIndex(data);
  const roleCard = getRoleCard(data.roleCard);
  if (!roleCard) {
    console.warn(`Player ${player.getName()} has no role card.`);
    throw new Error(`Player ${player.getName()} has no role card.`);
  }
  return new PlayerFightState(index, player, roleCard);
}

function buildFightState(attacker: Player, defender: Player): FightState {
  const attackerData = getPlayerData(attacker);
  const defenderData = getPlayerData(defender);

  if (attackerData.teamId === defenderData.teamId) {
    console.warn('Cannot attack a player from the same team.');
    throw new Error('Cannot attack a player from the same team.');
  }

  const attackerState = buildPlayerFightState(attacker, attackerData);
  const defenderState = buildPlayerFightState(defender, defenderData);

  return {
    attacker: attackerState,
    defender: defenderState,
  };
}

function shouldForceWin(from: PlayerFightState, to: PlayerFightState): boolean {
  const forceWins = from.getRoleCard().forceWins;
  if (!forceWins || forceWins.length === 0) {
    return false;
  }

  const toCard = to.getRoleCard();
  return forceWins.includes(toCard.id);
}

function handleForceWin(
  attacker: PlayerFightState,
  defender: PlayerFightState,
): boolean {
  if (shouldForceWin(attacker, defender)) {
    console.log(
      `Attacker ${attacker.getPlayer().getId()} forces a win against defender ${defender.getPlayer().getId()}.`,
    );
    defender.defeat();
    return true;
  }

  if (shouldForceWin(defender, attacker)) {
    console.log(
      `Defender ${defender.getPlayer().getId()} forces a win against attacker ${attacker.getPlayer().getId()}.`,
    );
    attacker.defeat();
    return true;
  }
  return false;
}

function handleValueComparison(
  attacker: PlayerFightState,
  defender: PlayerFightState,
) {
  const attackerValue = attacker.getRoleCard().value;
  const defenderValue = defender.getRoleCard().value;

  if (attackerValue === defenderValue) {
    return;
  }

  if (attackerValue > defenderValue) {
    console.log(
      `Attacker ${attacker.getPlayer().getId()} wins against defender ${defender.getPlayer().getId()}.`,
    );
    defender.defeat();
    return;
  }
  x;
  attacker.defeat();
}

function handleAttackLogic(
  lobby: Lobby,
  attacker: Player,
  defender: Player,
): FightState {
  const state = buildFightState(attacker, defender);

  if (handleForceWin(state.attacker, state.defender)) {
    return state;
  }

  handleValueComparison(state.attacker, state.defender);

  return state;
}

function setErrorState(player: Player, errorMessage: string) {
  const playerData = getPlayerData(player);
  playerData.lastFightResult = {
    type: 'error',
    index: getFightIndex(playerData),
    message: errorMessage,
  };
  console.error(`Error for player ${player.getId()}: ${errorMessage}`);
  player.sync();
}

export function performAttack(
  lobby: Lobby,
  attacker: Player,
  defender: Player,
) {
  let result: FightState;
  try {
    result = handleAttackLogic(lobby, attacker, defender);
  } catch (error: Error) {
    console.error(error);
    setErrorState(attacker, `Attack failed: ${error}`);
    setErrorState(defender, `Attack failed: ${error}`);
    return;
  }
}
