import { Player } from '../lobby/Player';
import { getPlayerData, PlayerDataStratego } from './StrategoGame';
import { PowerCard } from '@/common/stratego/powercard/PowerCard';
import {
  PowerCardKeys,
  PowerCardKeysType,
  PowerCards,
} from '@/constants/powercard/PowerCards';
import {
  RoleCardKeys,
  RoleCardKeysType,
  RoleCards,
} from '@/constants/RoleCards';

type HookContext = {
  cardId: PowerCardKeysType;
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

const PowerCardHooks: Record<PowerCardKeysType, Partial<PowerCardHooksType>> = {
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
  bomvest: {
    preAttackHook: [
      200,
      (ctx: HookContext, handlers: HookHandlers) => {
        if (!ctx.target) return HookResult.IGNORE;
        const targetData = getPlayerData(ctx.target);
        const enemyPowerCard = getPlayerPowerCard(targetData);

        const isTargetBomb = targetData.roleCard === RoleCardKeys.bom;
        const isTargetExplosivePowerup =
          enemyPowerCard?.id === PowerCardKeys.kamikazi;
        console.log(
          `Target is bomb: ${isTargetBomb}, Target has explosive powerup: ${isTargetExplosivePowerup}`,
          enemyPowerCard,
        );
        if (!isTargetBomb && !isTargetExplosivePowerup) {
          return HookResult.IGNORE;
        }

        handlers.defeat(ctx.target);
        return HookResult.CONSUMED;
      },
    ],
  },
  strongarm: {
    preAttackHook: [
      100,
      (ctx: HookContext, handlers: HookHandlers) => {
        if (!ctx.target) return HookResult.IGNORE;
        const selfData = getPlayerData(ctx.self);
        const targetData = getPlayerData(ctx.target);

        if (targetData.roleCard === null) {
          console.warn('Target has no role card, ignoring strongarm hook.');
          return HookResult.IGNORE;
        }

        if (selfData.roleCard !== targetData.roleCard) {
          return HookResult.IGNORE;
        }

        const targetHasPowerCard =
          getPlayerPowerCard(targetData)?.id === PowerCardKeys.strongarm;

        const selfValue =
          RoleCards[selfData.roleCard as RoleCardKeysType].value;
        const targetValue =
          RoleCards[targetData.roleCard as RoleCardKeysType].value;

        if (selfValue !== targetValue) {
          return HookResult.IGNORE; // Only consume if values are equal
        }

        if (targetHasPowerCard) {
          // We can confirm the target has a strongarm power card
          const cards = targetData.powercards;
          cards.splice(targetData.activePowercardIndex!, 1); // Remove the active power card
          targetData.powercards = cards; // Update the power cards array
          targetData.activePowercardIndex = null; // Clear active power card index
          console.debug('Strongarm power card consumed, removing from target.');
          return HookResult.CONSUMED;
        }

        handlers.defeat(ctx.target);

        return HookResult.CONSUMED;
      },
    ],
  },
};

function getPlayerPowerCard(
  player: PlayerDataStratego,
): ({ id: string } & PowerCard) | null {
  if (player.activePowercardIndex === null || player.powercards.length === 0) {
    return null;
  }

  const powerCardId = player.powercards[player.activePowercardIndex];
  if (!powerCardId) {
    return null;
  }

  const powerCard = PowerCards[powerCardId as PowerCardKeysType];

  if (!powerCard) {
    console.error(`Power card ${powerCardId} does not exist.`);
    return null;
  }

  return {
    ...powerCard,
    id: powerCardId,
  };
}

function getPowerCardHook(
  cardId: PowerCardKeysType | null,
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
        console.log('Power card hook consumed, removing active power card.');
        if (data.activePowercardIndex != null) {
          const cards = data.powercards;
          cards.splice(data.activePowercardIndex, 1); // Remove the active power card
          data.powercards = cards; // Update the power cards array
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
export function callPowerCardHook(
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
      ? (selfData.powercards[
          selfData.activePowercardIndex
        ] as PowerCardKeysType)
      : null;
  const targetCardId =
    targetData?.activePowercardIndex != null
      ? (targetData.powercards[
          targetData.activePowercardIndex
        ] as PowerCardKeysType)
      : null;

  console.debug(`Self card ID: ${selfCardId}, Target card ID: ${targetCardId}`);

  const selfHook = getPowerCardHook(selfCardId, hookId, handlers, () => ({
    cardId: selfCardId as PowerCardKeysType,
    self,
    target,
  }));

  const targetHook = getPowerCardHook(targetCardId, hookId, handlers, () => ({
    cardId: targetCardId as PowerCardKeysType,
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
