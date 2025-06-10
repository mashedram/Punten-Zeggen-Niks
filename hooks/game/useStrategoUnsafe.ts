import { useLobby } from '../useLobby';
import {
  InitalizationFailureReason,
  StategoStateUnsafe,
  useStratego,
} from './useStratego';

export function useStrategoUnsafe(): StategoStateUnsafe {
  const lobby = useLobby();
  const stratego = useStratego(lobby);

  if (lobby.loading) {
    throw new Error('Lobby is loading');
  }

  if (!lobby.inLobby) {
    throw new Error('Not in lobby');
  }

  if (!stratego.initialized) {
    if (stratego.reason === InitalizationFailureReason.NotInLobby) {
      throw new Error('Not in lobby');
    } else if (stratego.reason === InitalizationFailureReason.GameNotRunning) {
      throw new Error('Game not running');
    }
  }

  return stratego as StategoStateUnsafe;
}
