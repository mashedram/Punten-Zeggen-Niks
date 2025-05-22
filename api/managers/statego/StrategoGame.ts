export const StrategoGameId = 'stratego';

/////////////////
/// CONSTANTS ///
/////////////////

type RoleCard = {
  id: string;
  name: string;
  value: number;
  overwrites?: string[];
};

const RoleCards: RoleCard[] = [
  {
    id: 'general',
    name: 'Generaal',
    value: 10,
  },
];

//////////////////
/// LOBBY DATA ///
//////////////////

import { GameType } from '@/api/game/GameType';
import { z } from 'zod';
import { Lobby } from '../lobby/Lobby';
import { Player } from '../lobby/Player';

export const StrategoLobbyGameDataSchema = z.object({
  gameId: z.literal(StrategoGameId),
  teams: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    }),
  ),
  battleLog: z.array(
    z.object({
      playerName: z.string(),
    }),
  ),
});
export type StrategoLobbyGameData = z.infer<typeof StrategoLobbyGameDataSchema>;

///////////////////
/// PLAYER DATA ///
///////////////////

export const StrategoPlayerGameDataSchema = z.object({
  gameId: z.literal(StrategoGameId),
  teamId: z.string(),
  roleCard: z.string().optional(),
  attackCode: z.string(),
  lastFightResult: z
    .object({
      index: z.number(),
      state: z.enum(['win', 'lose', 'draw']),
    })
    .optional(),
});
export type StrategoPlayerGameData = z.infer<
  typeof StrategoPlayerGameDataSchema
>;

/////////////////
/// GAME TYPE ///
/////////////////

export const StrategoGameType: GameType<
  StrategoPlayerGameData,
  StrategoLobbyGameData
> = {
  id: StrategoGameId,
  createLobbyData: () => ({
    gameId: StrategoGameId,
    teams: [
      {
        id: 'red',
        name: 'Rood',
      },
      {
        id: 'blue',
        name: 'Blauw',
      },
    ],
    battleLog: [],
  }),
  createPlayerData: (lobby, player) => ({
    gameId: StrategoGameId,
    teamId: getNewPlayerTeam(lobby),
    roleCard: undefined,
    attackCode: generateAttackCode(),
  }),
  registerEvents: lobby => {},
};

/////////////////
/// FUNCTIONS ///
/////////////////

function getLobbyData(lobby: Lobby): StrategoLobbyGameData {
  return lobby.getGameData<StrategoLobbyGameData>();
}

function getPlayerData(player: Player): StrategoPlayerGameData {
  return player.getGameData<StrategoPlayerGameData>();
}

function getRoleCard(cardId?: string): RoleCard | undefined {
  if (!cardId) return undefined;
  return RoleCards.find(card => card.id === cardId);
}

function getPlayerFromAttackCode(
  lobby: Lobby,
  code: string,
): Player | undefined {
  for (const player of lobby.getPlayers()) {
    const data = getPlayerData(player);
    if (data.attackCode !== code) continue;
    return player;
  }

  return undefined;
}

function generateAttackCode(): string {
  const AttackCodeLength = 6;
  let code = '';
  for (let i = 0; i < AttackCodeLength; i++) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
}

function getNewPlayerTeam(lobby: Lobby): string {
  const players = lobby.getActivePlayers();
  const teamMapping: Record<string, number> = {};

  for (const team of getLobbyData(lobby).teams) {
    teamMapping[team.id] = 0;
  }

  for (const player of players) {
    const teamId = getPlayerData(player).teamId;
    teamMapping[teamId] += 1;
  }

  let smallestTeam = Object.keys(teamMapping)[0];
  let smallestTeamSize = Number.MAX_SAFE_INTEGER;
  for (const teamId in teamMapping) {
    if (teamMapping[teamId] < smallestTeamSize) {
      smallestTeamSize = teamMapping[teamId];
      smallestTeam = teamId;
    }
  }

  return smallestTeam;
}

enum AttackResult {
  AttackerWon,
  DefenderWon,
  Draw, // Both Die
  Ignore, // Ignore
}

function performAttack(
  lobby: Lobby,
  attacker: Player,
  defender: Player,
): AttackResult {
  const attackerData = getPlayerData(attacker);
  const defenderData = getPlayerData(defender);
  const attackerCard = getRoleCard(attackerData.roleCard);
  const defenderCard = getRoleCard(defenderData.roleCard);

  if (!attackerCard || !defenderCard) {
    return AttackResult.Ignore;
  }

  if (attackerCard.value > defenderCard.value) {
    return AttackResult.AttackerWon;
  }

  if (attackerCard.value < defenderCard.value) {
    return AttackResult.DefenderWon;
  }

  return AttackResult.Draw;
}

function handleAttackResult(
  attacker: Player,
  defender: Player,
  result: AttackResult,
) {
  if (result === AttackResult.Ignore) {
    draw(attacker);
    draw(defender);
    return;
  }

  if (result === AttackResult.AttackerWon) {
    win(attacker);
    defeat(defender);
  } else if (result === AttackResult.DefenderWon) {
    win(defender);
    defeat(attacker);
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
  const data = getPlayerData(player);
  data.roleCard = undefined;
  data.lastFightResult = {
    index: data.lastFightResult ? data.lastFightResult.index + 1 : 0,
    state: 'lose',
  };
  player.sync();
}

//////////////////////////
/// EXTERNAL FUNCTIONS ///
//////////////////////////

export const StrategoGame = {
  attack(lobby: Lobby, attacker: Player, attackCode: string) {
    const defender = getPlayerFromAttackCode(lobby, attackCode);
    if (!defender) throw new Error('Invalid attack code');

    const result = performAttack(lobby, attacker, defender);
    handleAttackResult(attacker, defender, result);
  },
};
