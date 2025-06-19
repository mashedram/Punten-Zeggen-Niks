import { Lobby } from '../lobby/Lobby';
import { Player } from '../lobby/Player';
import {
  getLobbyData,
  getPlayerData,
  LobbyDataStratego,
  PlayerDataStratego,
} from './StrategoGame';
import { RoleCard, RoleCards } from '@/constants/RoleCards';
import { callHook } from './PowerCardManager';

type FightResultType = 'win' | 'lose' | 'draw' | 'explode';

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

  public isDefeated(): boolean {
    return this._defeated;
  }

  public defeat() {
    this._defeated = true;
  }

  public getIndex(): number {
    return this._index;
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

  if (data.roleCard === null) {
    console.warn(`Player ${player.getName()} has no role card.`);
    throw new Error(`Player ${player.getName()} has no role card.`);
  }

  const roleCard = RoleCards[data.roleCard];
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
    console.debug(
      `Attacker ${attacker.getPlayer().getId()} - ${attackerValue} wins against defender ${defender.getPlayer().getId()} - ${defenderValue}.`,
    );
    defender.defeat();
    return;
  }

  console.debug(
    `Defender ${defender.getPlayer().getId()} - ${defenderValue} wins against attacker ${attacker.getPlayer().getId()} - ${attackerValue}.`,
  );
  attacker.defeat();
}

function handleAttackLogic(attacker: Player, defender: Player): FightState {
  const state = buildFightState(attacker, defender);

  if (
    callHook(
      'preAttackHook',
      state.attacker.getPlayer(),
      state.defender.getPlayer(),
      {
        defeat: (player: Player) => {
          console.debug(`Defeat hook called for player ${player.getId()}`);
          if (player === state.attacker.getPlayer()) {
            state.attacker.defeat();
          } else {
            state.defender.defeat();
          }
        },
      },
    )
  )
    return state;

  if (handleForceWin(state.attacker, state.defender)) {
    console.debug(
      `Force win applied in attack between ${state.attacker.getPlayer().getId()} and ${state.defender.getPlayer().getId()}`,
    );
    return state;
  }

  handleValueComparison(state.attacker, state.defender);
  console.debug(
    `Value comparison done in attack between ${state.attacker.getPlayer().getId()} and ${state.defender.getPlayer().getId()}`,
  );

  return state;
}

function setErrorState(player: Player, errorMessage: string) {
  const playerData = getPlayerData(player);
  playerData.lastFightResult = {
    type: 'error',
    index: getFightIndex(playerData),
    error: errorMessage,
  };
  console.error(`Error for player ${player.getId()}: ${errorMessage}`);
  player.sync();
}

function toIndex(state: boolean): number {
  return state ? 1 : 0;
}

function applyResultToSelf(self: PlayerFightState, result: FightResultType) {
  const player = self.getPlayer();
  const playerData = getPlayerData(player);
  playerData.lastFightResult = {
    type: 'success',
    index: self.getIndex(),
    state: result,
  };

  if (result === 'lose' || result === 'explode') {
    playerData.roleCard = null;
    playerData.hasRoleCard = false;
  }

  player.sync();
}

function applyStateToSelf(self: PlayerFightState, target: PlayerFightState) {
  const defeatMap: [FightResultType, FightResultType][][] = [
    [
      ['draw', 'draw'],
      ['win', 'lose'],
    ],
    [
      ['lose', 'win'],
      ['explode', 'explode'],
    ],
  ];

  const [selfState, targetState] =
    defeatMap[toIndex(self.isDefeated())][toIndex(target.isDefeated())];

  applyResultToSelf(self, selfState);
  applyResultToSelf(target, targetState);
}

function awardPlayerPoints(
  lobby: LobbyDataStratego,
  state: PlayerFightState,
  points: number,
) {
  if (points <= 0) {
    return;
  }

  const playerData = getPlayerData(state.getPlayer());
  const teams = lobby.teams;
  const team = teams.find(team => team.id === playerData.teamId);
  if (!team) {
    console.warn(`Team not found for player ${state.getPlayer().getId()}`);
    return;
  }

  console.debug(
    `Awarding ${points} points to team ${team.id} for player ${state.getPlayer().getId()}`,
  );
  team.currency += points;

  lobby.teams = teams;
}

function awardFightPoints(lobby: Lobby, state: FightState) {
  const lobbyData = getLobbyData(lobby);
  const attackerValue = state.attacker.getRoleCard().value;
  const defenderValue = state.defender.getRoleCard().value;

  awardPlayerPoints(
    lobbyData,
    state.attacker,
    state.defender.isDefeated() ? attackerValue : 0,
  );
  awardPlayerPoints(
    lobbyData,
    state.defender,
    state.attacker.isDefeated() ? defenderValue : 0,
  );
}

export function performAttack(attacker: Player, defender: Player) {
  let result: FightState;
  try {
    result = handleAttackLogic(attacker, defender);
  } catch (error) {
    console.error(error);
    setErrorState(attacker, `Attack failed: ${error}`);
    setErrorState(defender, `Attack failed: ${error}`);
    return;
  }

  console.log(
    `Attack result: ${result.attacker.getPlayer().getId()} - ${result.attacker.isDefeated()} vs ${result.defender.getPlayer().getId()} - ${result.defender.isDefeated()}`,
  );

  const attackerState = result.attacker;
  const defenderState = result.defender;

  applyStateToSelf(attackerState, defenderState);
  awardFightPoints(attacker.getLobby(), result);
}
