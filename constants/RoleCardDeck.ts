import { RoleCards } from '../constants/RoleCards';

export const defaultDeckSize = 60; // Total number of role cards in the deck

export function createRoleCardDeck(
  setDeckSize?: number,
): Record<string, number> {
  const deckSize =
    setDeckSize && setDeckSize > 0 ? setDeckSize : defaultDeckSize;

  const deck: Record<string, number> = {};

  // Adjust the deck for specific cards
  deck[RoleCards.vlag.id] = 1; // Only one flag per deck
  deck[RoleCards.maarschalk.id] = 1; // Only one marshal per deck
  deck[RoleCards.generaal.id] = 1; // Only one general per deck
  deck[RoleCards.kolonel.id] = Math.ceil(deckSize * 0.05);
  deck[RoleCards.majoor.id] = Math.ceil(deckSize * 0.07);
  deck[RoleCards.kapitein.id] = Math.ceil(deckSize * 0.1);
  deck[RoleCards.luitenant.id] = Math.ceil(deckSize * 0.12);
  deck[RoleCards.sergeant.id] = Math.ceil(deckSize * 0.17);
  deck[RoleCards.spion.id] = Math.ceil(deckSize * 0.02);
  deck[RoleCards.bom.id] = Math.ceil(deckSize * 0.15);

  // fill the deck with mineurs till we reach numnerOfCards
  const totalCards = Object.values(deck).reduce((sum, count) => sum + count, 0);
  deck[RoleCards.mineur.name] = deckSize - totalCards;

  return deck;
}
