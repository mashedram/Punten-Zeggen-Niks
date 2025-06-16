import { GameType } from '@/api/game/GameType';
import { z } from 'zod';
import { Lobby } from '../lobby/Lobby';
import { Player } from '../lobby/Player';
import { RoleCard } from '@/constants/RoleCards';
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
        },
        {
          id: 'blue',
          name: 'Blauw',
          deck: createRoleCardDeck(),
        },
      ],
      gameState: String(GameState.playing),
      battleLog: [],
    }),
    createPlayerData: (lobby, player) => {
      const teamId = getNewPlayerTeam(lobby);
      const isTeamLeader = setTeamLeader(lobby, teamId);
      return {
        gameId: StrategoGameId,
        teamId,
        isTeamLeader,
        hasRoleCard: false,
        roleCard: null,
        attackCode: generateAttackCode(),
        lastFightResult: null,
      };
    },
    registerEvents: lobby => {},
  };

/////////////////
/// FUNCTIONS ///
/////////////////

// for now the first player to join a team is the team leader.
// This needs to be changed later to allow players to choose their team leader.
function setTeamLeader(lobby: Lobby, teamId: string): boolean {
  const players = lobby
    .getActivePlayers()
    .filter(
      player => player.getGameData<PlayerDataStratego>()?.teamId === teamId,
    );
  return !players.some(
    player => player.getGameData<PlayerDataStratego>()?.isTeamLeader,
  );
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
  const team = lobbyData.teams.find(team => team.id === teamId);
  if (!team || !team.deck || !team.deck[cardId]) {
    throw new Error(`Card ${cardId} not found in team ${teamId} deck.`);
  }
  console.log('removing role from deck');
  console.log(team.deck[cardId]);
  team.deck[cardId] = team.deck[cardId] - 1;
  console.log(team.deck[cardId]);
  if (team.deck[cardId] <= 0) {
    delete team.deck[cardId];
  }
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
    const lobbyData = getLobbyData(lobby);
    if (!playerData.isTeamLeader) {
      throw new Error('Only team leaders can revive players.');
    }
    if (targetData.roleCard) {
      throw new Error('Target player is already active.');
    }
    if (targetData.teamId !== playerData.teamId) {
      throw new Error('Target player is not on the same team.');
    }
    if (
      Object.keys(
        lobbyData.teams.find(team => team.id === playerData.teamId)!.deck,
      ).length <= 0
    ) {
      throw new Error('Team has no role cards left to revive players.');
    }
    const availableRoleCards = StrategoGame.getAvailableRoleCards(
      lobby,
      player,
    );
    if (!Object.keys(availableRoleCards).some(key => key === roleCard.id)) {
      throw new Error(
        `Role card ${roleCard.id} is not available in the team deck.`,
      );
    }
    targetData.roleCard = roleCard.id;
    targetData.hasRoleCard = true;
    removeRoleCardFromDeck(lobby, playerData.teamId, roleCard.id);
    console.log(
      `Player ${target.getId()} has been revived with role card: ${targetData.roleCard}`,
    );
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

    return playersWithoutRoleCards;
  },
};
