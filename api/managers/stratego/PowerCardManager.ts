import { PowerCardKeys } from '@/constants/powercard/PowerCardImages';
import { Player } from '../lobby/Player';
import { getPlayerData } from './StrategoGame';

type HookContext = {
  cardId: PowerCardKeys;
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

type PowerCardHook = [
  priority: number,
  (ctx: HookContext, handlers: HookHandlers) => HookResult,
];

type PowerCardHooksType = {
  preAttackHook: PowerCardHook;
  useHook: PowerCardHook;
};

const PowerCardHooks: Record<PowerCardKeys, Partial<PowerCardHooksType>> = {
  kamikazi: {
    preAttackHook: [
      100,
      (ctx: HookContext, handlers: HookHandlers) => {
        handlers.defeat(ctx.self);
        handlers.defeat(ctx.target);
        return HookResult.CONSUMED;
      },
    ],
  },
};

function getPowerCardHook(
  cardId: PowerCardKeys | null,
  hookId: keyof PowerCardHooksType,
  handlers: HookHandlers,
  contextBuilder: () => HookContext,
): [number, () => HookResult] | null {
  if (!cardId) {
    console.warn('No power card is active.');
    return null;
  }

  const card = PowerCardHooks[cardId];
  if (!card) {
    console.error(`Power card ${cardId} does not exist.`);
    return null;
  }

  const hook = card[hookId];
  if (!hook) {
    console.warn(`Power card ${cardId} does not have hook ${hookId}.`);
    return null;
  }

  const context = contextBuilder();
  const callback = hook[1];
  return [
    hook[0],
    () => {
      return callback(context, handlers);
    },
  ];
}

function buildHookCaller(hook: (() => HookResult) | null): () => boolean {
  if (!hook) {
    return () => true; // No hook, so we can continue
  }

  return () => {
    const result = hook();
    if (result === HookResult.CONSUMED) {
      return false; // Hook consumed, stop further execution
    }
    return true; // Continue execution
  };
}

export function callHook(
  hookId: keyof PowerCardHooksType,
  self: Player,
  target: Player,
  handlers: HookHandlers,
): () => boolean {
  const selfData = getPlayerData(self);
  const targetData = getPlayerData(target);

  const selfCardId = selfData.activePowercardIndex
    ? (selfData.powercards[selfData.activePowercardIndex] as PowerCardKeys)
    : null;
  const targetCardId = targetData.activePowercardIndex
    ? (targetData.powercards[targetData.activePowercardIndex] as PowerCardKeys)
    : null;

  const selfHook = getPowerCardHook(selfCardId, hookId, handlers, () => ({
    cardId: selfCardId as PowerCardKeys,
    self,
    target,
  }));

  const targetHook = getPowerCardHook(targetCardId, hookId, handlers, () => ({
    cardId: targetCardId as PowerCardKeys,
    self,
    target,
  }));

  const selfHookCaller = buildHookCaller(selfHook?.[1] ?? null);

  const targetHookCaller = buildHookCaller(targetHook?.[1] ?? null);

  const hookOrder =
    (selfHook?.[0] ?? 0) >= (targetHook?.[0] ?? 0)
      ? [selfHookCaller, targetHookCaller]
      : [targetHookCaller, selfHookCaller];

  return () => {
    return hookOrder[0]() && hookOrder[1]();
  };
}
