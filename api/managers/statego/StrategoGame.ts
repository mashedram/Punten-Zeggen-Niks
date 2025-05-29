import { GameType } from '@/api/game/GameType';
import { z } from 'zod';
import { Lobby } from '../lobby/Lobby';
import { Player } from '../lobby/Player';
import { RoleCard, RoleCards } from '../../../constants/RoleCards';
import { GameState } from '../../../constants/GameState';
import { createRoleCardDeck } from '@/constants/RoleCardDeck';
import { console } from 'inspector';

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
  roleCard: z.string().optional(),
  attackCode: z.string(),
  lastFightResult: z
    .object({
      index: z.number(),
      state: z.enum(['win', 'lose', 'draw', 'explode']),
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
      return {
        gameId: StrategoGameId,
        teamId,
        roleCard: getRoleCardFromSelection(lobby, teamId),
        attackCode: generateAttackCode(),
      };
    },
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

function getRoleCardFromSelection(
  lobby: Lobby,
  teamId: string,
): string | undefined {
  const lobbyData = getLobbyData(lobby);
  const team = lobbyData.teams.find(team => team.id === teamId);
  if (!team || !team.deck) {
    throw new Error(`Team ${teamId} or its deck not found in lobby data.`);
  }
  const availableCards = Object.keys(team.deck);
  console.log(`Available cards for team ${teamId}:`, team.deck);
  if (team.deck[RoleCards.vlag.name] > 0) {
    removeRoleCardFromDeck(lobby, teamId, RoleCards.vlag.name);
    return RoleCards.vlag.name;
  }
  if (availableCards.length === 0) {
    return undefined;
  }
  const cardName =
    availableCards[Math.floor(Math.random() * availableCards.length)];
  removeRoleCardFromDeck(lobby, teamId, cardName);
  return cardName;
}

function removeRoleCardFromDeck(lobby: Lobby, teamId: string, cardId: string) {
  const lobbyData = getLobbyData(lobby);
  const team = lobbyData.teams.find(team => team.id === teamId);
  if (!team || !team.deck || !team.deck[cardId]) {
    throw new Error(`Card ${cardId} not found in team ${teamId} deck.`);
  }
  team.deck[cardId] -= 1;
  if (team.deck[cardId] <= 0) {
    delete team.deck[cardId];
  }
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

////////////////////////
/// Attack functions ///
////////////////////////

function performAttack(lobby: Lobby, attacker: Player, defender: Player) {
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
  playerData.roleCard = getRoleCardFromSelection(
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
  playerData.roleCard = getRoleCardFromSelection(
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

function endGame(lobby: Lobby, winningTeamId: string) {
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
    console.log('Received attack request from player:', attacker.getId());
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
};
