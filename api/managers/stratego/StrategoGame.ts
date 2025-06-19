import { GameType } from '@/api/game/GameType';
import { z } from 'zod';
import { Lobby } from '../lobby/Lobby';
import { Player } from '../lobby/Player';
import { RoleCard, RoleCards } from '@/constants/RoleCards';
import { GameState } from '@/constants/GameState';
import { createRoleCardDeck } from '@/constants/RoleCardDeck';
import { console } from 'inspector';
import { performAttack } from './AttackFunctions';

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
  attackCode: z.string(),
  isTeamLeader: z.boolean(),
  hasRoleCard: z.boolean(),
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
          hasFlag: false,
        },
        {
          id: 'blue',
          name: 'Blauw',
          deck: createRoleCardDeck(),
          hasFlag: false,
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

  const playerData = getPlayerData(playerScores[0].player);
  playerData.isTeamLeader = true;
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

function checkWinConditions(lobby: Lobby) {
  const lobbyData = getLobbyData(lobby);
  const teams = lobbyData.teams;
  if (teams.some(team => Object.keys(team.deck).length <= 0)) {
    const emptyDeckTeam = teams.find(
      team => Object.keys(team.deck).length <= 0,
    )?.id;
    if (!checkActiveRoleCards(lobby, emptyDeckTeam!)) {
      const winningTeamId = teams.find(team => team.deck.length > 0)?.id;
      endGame(lobby, winningTeamId!);
    }
  }
}

// Returns true if there are active platers with a role card in the given team
function checkActiveRoleCards(lobby: Lobby, teamId: string): boolean {
  const players = lobby
    .getActivePlayers()
    .filter(player => getPlayerData(player).teamId === teamId);
  return players.some(player => getPlayerData(player).roleCard === undefined);
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
  if (team === undefined) {
    throw new Error(`no team found on id: ${teamId}`);
  }
  const availableCardIds = Object.keys(team.deck).filter(
    cardId => team.deck[cardId] > 0,
  );
  const randomCardId =
    availableCardIds[Math.floor(Math.random() * availableCardIds.length)];
  return RoleCards[randomCardId];
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

export function endGame(lobby: Lobby, winningTeamId: string) {
  const lobbyData = getLobbyData(lobby);
  if (winningTeamId === 'red') {
    lobbyData.gameState = String(GameState.red_wins);
  } else if (winningTeamId === 'blue') {
    lobbyData.gameState = String(GameState.blue_wins);
  } else {
    // there is no state where a game can draw, but we handle it just in case
    console.warn('Game ended in a draw, no winning team found.');
    lobbyData.gameState = String(GameState.draw);
  }
  lobby.sync();
  console.log(`Game ended. Team ${winningTeamId} has won.`);
}

export function removeRoleCardFromDeck(
  lobby: Lobby,
  teamId: string,
  cardId: string,
) {
  const lobbyData = getLobbyData(lobby);
  const teams = lobbyData.teams;
  const team = teams.find(team => team.id === teamId);
  if (!team || !team.deck || !team.deck[cardId]) {
    throw new Error(`Card ${cardId} not found in team ${teamId} deck.`);
  }
  team.deck[cardId] = team.deck[cardId] - 1;
  if (team.deck[cardId] <= 0) {
    delete team.deck[cardId];
  }
  console.log(
    `Removed ${cardId} from deck in team ${teamId}, team has ${team.deck[cardId]} left of role ${cardId}`,
  );
  lobbyData.teams = teams;
}

//////////////////////////
/// EXTERNAL FUNCTIONS ///
//////////////////////////

export const StrategoGame = {
  attack(lobby: Lobby, attacker: Player, attackCode: string) {
    const defender = getPlayerFromAttackCode(lobby, attackCode);
    if (!defender) throw new Error('Invalid attack code');
    console.log(
      'attacker:',
      getPlayerData(attacker).teamId,
      'defender:',
      getPlayerData(defender).teamId,
    );
    performAttack(lobby, attacker, defender);
    checkWinConditions(lobby);
    lobby.sync();
  },

  revive(lobby: Lobby, player: Player, target: Player, roleCard: RoleCard) {
    const playerData = getPlayerData(player);
    const targetData = getPlayerData(target);
    targetData.roleCard = roleCard.id;
    targetData.hasRoleCard = true;
    removeRoleCardFromDeck(lobby, playerData.teamId, roleCard.id);
    console.log(
      `Player ${target.getId()}, ${target.getName()} has been revived with role card: ${targetData.roleCard}`,
    );
    lobby.sync();
  },

  assignFlag(lobby: Lobby, player: Player, targetPlayer: Player) {
    const playerData = getPlayerData(player);
    const targetData = getPlayerData(targetPlayer);
    const lobbyData = getLobbyData(lobby);
    const teams = lobbyData.teams;
    const team = teams.find(team => team.id === playerData.teamId);
    if (team === undefined) {
      throw new Error('Could not find team while assigning a flag.');
    }
    targetData.roleCard = RoleCards.vlag.id;
    targetData.hasRoleCard = true;
    removeRoleCardFromDeck(lobby, playerData.teamId, RoleCards.vlag.id);
    assignRandomRoleCards(lobby, playerData.teamId);
    team.hasFlag = true;
    lobbyData.teams = teams;
    lobby.sync();
  },

  getAvailableRoleCards(lobby: Lobby, player: Player): Record<string, number> {
    const lobbyData = getLobbyData(lobby);
    const playerData = getPlayerData(player);
    const teamId = playerData.teamId;
    const team = lobbyData.teams.find(t => t.id === teamId);
    if (!team) {
      throw new Error(`Team ${teamId} not found in lobby data.`);
    }
    if (team.deck.vlag > 0) {
      return { vlag: 1 };
    }
    lobby.sync();
    return team.deck;
  },

  getPlayersWithoutRoleCards(lobby: Lobby, player: Player): string[] {
    const playerData = getPlayerData(player);
    if (!playerData.isTeamLeader) {
      throw new Error(
        'Only team leaders can check for players without role cards.',
      );
    }
    const teamId = playerData.teamId;
    const playersWithoutRoleCards: string[] = [];

    for (const p of lobby.getActivePlayers()) {
      const pData = getPlayerData(p);
      if (pData.teamId === teamId && !pData.roleCard) {
        playersWithoutRoleCards.push(p.getId());
      }
    }
    lobby.sync();
    return playersWithoutRoleCards;
  },
};
