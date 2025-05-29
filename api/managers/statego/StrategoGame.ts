import { GameType } from '@/api/game/GameType';
import { z } from 'zod';
import { Lobby } from '../lobby/Lobby';
import { Player } from '../lobby/Player';
import { RoleCard, RoleCards } from '../../../constants/RoleCards';
import { GameState } from '../../../constants/GameState';

export const StrategoGameId = 'stratego';
const numberOfCards = 60;

//////////////////
/// LOBBY DATA ///
//////////////////

export const LobbyDataSchemaStratego = z.object({
  gameId: z.literal(StrategoGameId),
  teams: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      deck: z.number().int(),
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
  roleCard: z.string().optional(),
  attackCode: z.string(),
  lastFightResult: z
    .object({
      index: z.number(),
      state: z.enum(['win', 'lose', 'draw']),
    })
    .optional(),
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
          deck: numberOfCards,
        },
        {
          id: 'blue',
          name: 'Blauw',
          deck: numberOfCards,
        },
      ],
      gameState: String(GameState.playing),
      battleLog: [],
    }),
    createPlayerData: (lobby, player) => ({
      gameId: StrategoGameId,
      teamId: getNewPlayerTeam(lobby),
      roleCard: getRandomRoleCard(),
      attackCode: generateAttackCode(),
    }),
    registerEvents: lobby => {},
  };

/////////////////
/// FUNCTIONS ///
/////////////////

function getLobbyData(lobby: Lobby): LobbyDataStratego {
  return lobby.getGameData<LobbyDataStratego>();
}

function getPlayerData(player: Player): PlayerDataStratego {
  return player.getGameData<PlayerDataStratego>();
}

function getRoleCard(cardId?: string): RoleCard | undefined {
  if (!cardId) return undefined;
  return RoleCards[cardId];
}

function getRandomRoleCard(): string {
  const keys = Object.keys(RoleCards);
  return keys[Math.floor(Math.random() * keys.length)];
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

function performAttack(lobby: Lobby, attacker: Player, defender: Player) {
  const attackerData = getPlayerData(attacker);
  const defenderData = getPlayerData(defender);
  const attackerCard = getRoleCard(attackerData.roleCard);
  const defenderCard = getRoleCard(defenderData.roleCard);

  // check for team conflict
  if (attackerData.teamId === defenderData.teamId) {
    console.warn('Cannot attack a player from the same team.');
    return;
  }

  // check if defender has a flag
  if (defenderData.roleCard === 'flag') {
    endGame(lobby, attackerData.teamId);
    console.log(
      `Team ${attackerData.teamId} has captured the flag of team ${defenderData.teamId}.`,
    );
    return;
  }

  // no role card for attacker or defender
  if (!attackerCard || !defenderCard) {
    draw(attacker);
    draw(defender);
    console.warn('Attacker or defender does not have a role card.');
    return;
  }

  // Atacker wins
  if (attackerCard.value > defenderCard.value) {
    win(attacker);
    defeat(defender);
  }

  // Defender wins
  if (attackerCard.value < defenderCard.value) {
    win(defender);
    defeat(attacker);
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
  playerData.roleCard = undefined;
  const lobbyData = getLobbyData(player.getLobby());
  lobbyData.teams.find(team => team.id === playerData.teamId)!.deck -= 1;
  playerData.lastFightResult = {
    index: playerData.lastFightResult
      ? playerData.lastFightResult.index + 1
      : 0,
    state: 'lose',
  };
  player.sync();
}

function checkWinConditions(lobby: Lobby) {
  const lobbyData = getLobbyData(lobby);
  const teams = lobbyData.teams;
  if (teams.some(team => team.deck <= 0)) {
    const emptyDeckTeam = teams.find(team => team.deck <= 0);
    if (!checkActiveRoleCards(lobby, emptyDeckTeam!.id)) {
      const winningTeamId = teams.find(team => team.deck > 0)?.id;
      endGame(lobby, winningTeamId!);
    }
  }
}

function endGame(lobby: Lobby, winningTeamId: string) {
  const lobbyData = getLobbyData(lobby);
  lobbyData.gameState = String(GameState.ending);
  lobby.sync();
  console.log(`Game ended. Team ${winningTeamId} has won.`);
}

// Returns true if there are active platers with a role card in the given team
function checkActiveRoleCards(lobby: Lobby, teamId: string): boolean {
  const players = lobby
    .getActivePlayers()
    .filter(
      player => player.getGameData<PlayerDataStratego>().teamId === teamId,
    );
  return players.some(
    player => player.getGameData<PlayerDataStratego>().roleCard === undefined,
  );
}
//////////////////////////
/// EXTERNAL FUNCTIONS ///
//////////////////////////

export const StrategoGame = {
  attack(lobby: Lobby, attacker: Player, attackCode: string) {
    const defender = getPlayerFromAttackCode(lobby, attackCode);
    if (!defender) throw new Error('Invalid attack code');
    performAttack(lobby, attacker, defender);
    checkWinConditions(lobby);
  },
};
