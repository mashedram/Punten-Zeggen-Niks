import {
  InitalizationFailureReason,
  StategoStateUnsafe,
  useStratego,
} from './useStratego';

export function useStrategoUnsafe(): StategoStateUnsafe {
  const stratego = useStratego();

  if (!stratego.initialized) {
    if (stratego.reason === InitalizationFailureReason.NotInLobby) {
      throw new Error('Not in lobby');
    } else if (stratego.reason === InitalizationFailureReason.GameNotRunning) {
      throw new Error('Game not running');
    }
  }

  return stratego as StategoStateUnsafe;
}
