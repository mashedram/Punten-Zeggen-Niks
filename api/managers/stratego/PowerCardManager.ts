import { Player } from '../lobby/Player';

type HookContext = {
  cardId: string;
  self: Player;
  target: Player;
};

type HookHandlers = {
  defeat: (player: Player) => void;
};

enum HookResult {
  // Continue the function the hook is attached to
  IGNORE = 'continue',
  // Stop the function the hook is attached to
  CONSUMED = 'stop',
}

type PowerCardHooks = {
  preAttackHook: (ctx: HookContext, handlers: HookHandlers) => HookResult;
};

type PowerCard = {
  id: string;
  name: string;
  hooks: Partial<PowerCardHooks>;
};

const powerCards: PowerCard[] = [
  {
    id: 'kamikazi',
    name: 'Kamikazi',
    hooks: {
      preAttackHook: (context, handlers) => {
        handlers.defeat(context.self);
        handlers.defeat(context.target);
        return HookResult.CONSUMED;
      },
    },
  },
];

export function callPowerCardHook(
  hookId: keyof PowerCardHooks,
  context: HookContext,
  handlers: HookHandlers,
): boolean {
  const card = powerCards.find(card => card.id === context.cardId);
  if (!card) {
    throw new Error(`Power card with id ${context.cardId} not found.`);
  }

  const hook = card.hooks[hookId];
  if (!hook) {
    console.warn(`Power card ${context.cardId} does not have hook ${hook}.`);
    return false;
  }

  const result = hook(context, handlers);

  return result === HookResult.CONSUMED;
}
