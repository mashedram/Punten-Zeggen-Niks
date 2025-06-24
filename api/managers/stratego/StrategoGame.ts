import { GameType } from '@/api/game/GameType';
import { z } from 'zod';
import { Lobby } from '../lobby/Lobby';
import { Player } from '../lobby/Player';
import { RoleCard } from '@/constants/RoleCards';
import { GameState } from '@/constants/GameState';
import { createRoleCardDeck, defaultDeckSize } from '@/constants/RoleCardDeck';
import { performAttack } from './functions/AttackFunctions';
import { revivePlayer } from './functions/reviveFunctions';
import { assignFlag } from './functions/AssignFlagFunctions';
import {
  getAvailableRoleCards,
  getPlayersWithoutRoleCards,
} from './functions/RoleCardFunctions';
import { callPowerCardHook } from './PowerCardManager';

export const StrategoGameId = 'stratego';

//////////////////
/// LOBBY DATA ///
//////////////////

export const LobbyDataSchemaStratego = z.object({
  gameId: z.literal(StrategoGameId),
  teams: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      deck: z.record(z.string(), z.number()),
      hasFlag: z.boolean(),
      currency: z.number().default(0),
      score: z.number(),
    }),
  ),
  gameState: z.enum(Object.values(GameState) as [string, ...string[]]),
  battleLog: z.array(
    z.object({
      playerName: z.string(),
    }),
  ),
});
export type LobbyDataStratego = z.infer<typeof LobbyDataSchemaStratego>;

///////////////////
/// PLAYER DATA ///
///////////////////

export const PlayerDataSchemaStratego = z.object({
  gameId: z.literal(StrategoGameId),
  name: z.string(),
  teamId: z.string(),
  roleCard: z.string().nullable(),
  hasRoleCard: z.boolean(),
  attackCode: z.string(),
  isTeamLeader: z.boolean(),
  activePowercardIndex: z.number().nullable(),
  powercards: z.array(z.string()),
  lastFightResult: z
    .discriminatedUnion('type', [
      z.object({
        type: z.literal('success'),
        index: z.number(),
        state: z.enum(['win', 'lose', 'draw', 'explode']),
      }),
      z.object({
        type: z.literal('error'),
        index: z.number(),
        error: z.string(),
      }),
    ])
    .nullable(),
});
export type PlayerDataStratego = z.infer<typeof PlayerDataSchemaStratego>;

/////////////////
/// GAME TYPE ///
/////////////////

export const GameTypeStratego: GameType<PlayerDataStratego, LobbyDataStratego> =
  {
    id: StrategoGameId,
    createLobbyData: () => ({
      gameId: StrategoGameId,
      teams: [
        {
          id: 'red',
          name: 'Rood',
          deck: createRoleCardDeck(),
          currency: 0,
          hasFlag: false,
          score: defaultDeckSize,
        },
        {
          id: 'blue',
          name: 'Blauw',
          deck: createRoleCardDeck(),
          currency: 0,
          hasFlag: false,
          score: defaultDeckSize,
        },
      ],
      gameState: String(GameState.playing),
      battleLog: [],
    }),
    createPlayerData: (lobby, player) => {
      const name = player.getName();
      return {
        gameId: StrategoGameId,
        name,
        teamId: 'red', // Default team, will be changed later
        isTeamLeader: false,
        hasRoleCard: false,
        roleCard: null,
        activePowercardIndex: null,
        powercards: [],
        attackCode: generateAttackCode(),
        lastFightResult: null,
      };
    },
    onGameStart: (lobby: Lobby) => {
      assignTeams(lobby);
      for (const team of getLobbyData(lobby).teams) {
        assignTeamLeader(lobby, team.id);
      }
    },
    onLateJoin: (lobby: Lobby, player: Player) => {
      const data = getPlayerData(player);
      data.teamId = getNewPlayerTeam(lobby);
    },
  };

/////////////////
/// FUNCTIONS ///
/////////////////

function assignTeams(lobby: Lobby) {
  const sources: { player: Player; priority: number }[] = [];

  // Add leaders
  for (const player of lobby.getActivePlayers()) {
    let score = 0;
    if (getPlayerData(player).isTeamLeader) {
      score = 1;
    }
    sources.push({ player, priority: score });
  }
  sources.sort((a, b) => b.priority - a.priority);

  const teams = getLobbyData(lobby).teams;
  for (let i = 0; i < sources.length; i++) {
    const player = sources[i].player;
    const playerData = getPlayerData(player);
    const team = teams[i % teams.length];
    playerData.teamId = team.id;
  }
  lobby.sync();
}

function assignTeamLeader(lobby: Lobby, teamId: string) {
  const playerScores: { player: Player; score: number }[] = [];
  const players = lobby.getActivePlayers().filter(player => {
    return getPlayerData(player).teamId === teamId;
  });

  for (const player of players) {
    let score = 0;
    if (player.isAdmin()) {
      score += 1;
    }
    if (player.isLeader()) {
      score += 2;
    }
    playerScores.push({ player, score });
  }
  playerScores.sort((a, b) => b.score - a.score);

  const bestTeamLeader = playerScores[0];

  if (!bestTeamLeader) {
    console.warn(
      `No team leader found for team ${teamId}, defaulting to first player.`,
    );
    return;
  }

  const playerData = getPlayerData(bestTeamLeader.player);
  playerData.isTeamLeader = true;
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

//////////////////////
/// External utils ///
//////////////////////

export function getLobbyData(lobby: Lobby): LobbyDataStratego {
  const value = lobby.getGameData<LobbyDataStratego>();
  if (!value) throw new Error('Lobby data not found');
  return value;
}

export function getPlayerData(player: Player): PlayerDataStratego {
  const value = player.getGameData<PlayerDataStratego>();
  if (!value) throw new Error('Player data not found');
  return value;
}

export function getPlayerFromAttackCode(
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

//////////////////////////
/// EXTERNAL FUNCTIONS ///
//////////////////////////

export const StrategoGame = {
  attack(lobby: Lobby, attacker: Player, defender: Player) {
    performAttack(attacker, defender);

    lobby.sync();
  },

  revive(lobby: Lobby, player: Player, target: Player, roleCard: RoleCard) {
    revivePlayer(lobby, player, target, roleCard);
    lobby.sync();
  },

  assignFlag(lobby: Lobby, player: Player, targetPlayer: Player) {
    assignFlag(lobby, player, targetPlayer);
    lobby.sync();
  },

  getAvailableRoleCards(lobby: Lobby, player: Player): Record<string, number> {
    const teamDeck = getAvailableRoleCards(lobby, player);
    lobby.sync();
    return teamDeck;
  },

  getPlayersWithoutRoleCards(lobby: Lobby, player: Player): string[] {
    const players = getPlayersWithoutRoleCards(lobby, player);
    lobby.sync();
    return players;
  },

  usePowerCard: (player: Player, index: number) => {
    const data = getPlayerData(player);
    if (index < 0 || index >= data.powercards.length) {
      throw new Error(`Invalid power card index: ${index}`);
    }

    if (
      callPowerCardHook('useHook', player, null, {
        defeat: () => {
          data.lastFightResult = {
            type: 'error',
            index: index,
            error: 'Power card cannot attack',
          };
        },
      })
    ) {
      return;
    }

    data.activePowercardIndex = index;
  },
};
