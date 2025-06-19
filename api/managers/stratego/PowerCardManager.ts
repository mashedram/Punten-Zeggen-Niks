import { PowerCardKeys } from '@/constants/powercard/PowerCardImages';
import { Player } from '../lobby/Player';
import { getPlayerData, PlayerDataStratego } from './StrategoGame';

type HookContext = {
  cardId: PowerCardKeys;
  self: Player;
  target: Player | null;
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
        console.debug('Kamikazi preAttackHook');
        handlers.defeat(ctx.self);
        if (ctx.target) {
          handlers.defeat(ctx.target);
        }
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

function buildHookCaller(
  hook: (() => HookResult) | null,
  data: PlayerDataStratego | null,
): () => boolean {
  if (!hook) {
    return () => false; // No hook to call, continue execution
  }

  return () => {
    const result = hook();
    if (result === HookResult.CONSUMED) {
      if (data != null) {
        if (data.activePowercardIndex != null) {
          data.powercards.splice(data.activePowercardIndex, 1); // Remove the active power card
        }
        data.activePowercardIndex = null; // Clear active power card index
      }
      return true; // Hook consumed, stop further execution
    }
    return false; // Hook did not consume, continue
  };
}

/**
 * @returns True if the hook cancels the current function
 */
export function callHook(
  hookId: keyof PowerCardHooksType,
  self: Player,
  target: Player | null,
  handlers: HookHandlers,
): boolean {
  const selfData = getPlayerData(self);
  const targetData = target ? getPlayerData(target) : null;

  console.debug(
    `Self power card: ${selfData.powercards}, selected: ${selfData.activePowercardIndex}`,
  );
  console.debug(
    `Target power card: ${targetData?.powercards}, selected: ${targetData?.activePowercardIndex}`,
  );

  const selfCardId =
    selfData.activePowercardIndex != null
      ? (selfData.powercards[selfData.activePowercardIndex] as PowerCardKeys)
      : null;
  const targetCardId =
    targetData?.activePowercardIndex != null
      ? (targetData.powercards[
          targetData.activePowercardIndex
        ] as PowerCardKeys)
      : null;

  console.debug(`Self card ID: ${selfCardId}, Target card ID: ${targetCardId}`);

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

  const selfHookCaller = buildHookCaller(selfHook?.[1] ?? null, selfData);

  const targetHookCaller = buildHookCaller(targetHook?.[1] ?? null, targetData);

  const hookOrder =
    (selfHook?.[0] ?? 0) >= (targetHook?.[0] ?? 0)
      ? [selfHookCaller, targetHookCaller]
      : [targetHookCaller, selfHookCaller];

  return hookOrder[0]() || hookOrder[1]();
}
