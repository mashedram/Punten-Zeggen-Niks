import type { PlayerData, PlayerEvent } from '@/api/managers/lobby/Player';
import { useTRPC } from '@/api/query';
import { skipToken, useMutation } from '@tanstack/react-query';
import { useSubscription } from '@trpc/tanstack-react-query';
import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import { useMMKVString } from 'react-native-mmkv';

type LobbyEventCallback = (event: PlayerEvent<unknown>) => void;

interface LobbyState {
  self: PlayerData | null;
  setEventHandler: (callback: LobbyEventCallback) => void;
  join: (code: string) => void;
  create: () => void;
}

const PlayerDataContext = createContext<LobbyState | null>(null);

const TOKEN_STORAGE_KEY = 'token.value';

/**
 * Hook to access the current lobby state.
 *
 * This hook must be used within a `LobbyProvider`.
 *
 * The returned state is an object with the following properties:
 *
 * - `self`: The player data for the current user, or null if the user is not in a lobby.
 * - `join`: A function to join a lobby. The function takes the lobby code as a parameter.
 * - `create`: A function to create a new lobby.
 */
export function useLobby(): LobbyState {
  const state = useContext(PlayerDataContext);

  if (!state) throw new Error('useLobby must be used within a LobbyProvider');

  return state;
}

export function LobbyProvider({ children }: { children: React.ReactNode }) {
  const trpc = useTRPC();

  const [token, setToken] = useMMKVString(TOKEN_STORAGE_KEY);
  const [selfState, setSelfState] = useState<PlayerData | null>(null);
  const eventCallbackRef = useRef<LobbyEventCallback | null>(null);

  useSubscription(
    trpc.lobby.listen.subscriptionOptions(token ? { token } : skipToken, {
      onData: event => {
        // Middleware to handle the player-state package
        if (event.type === 'player-state') {
          setSelfState(event.content as PlayerData);
          return;
        }

        if (!eventCallbackRef.current) return;

        eventCallbackRef.current(event as PlayerEvent<unknown>);
      },
    }),
  );

  const joinMutation = useMutation(
    trpc.lobby.joinLobby.mutationOptions({
      onSuccess: data => {
        setToken(data);
      },
    }),
  );
  const createMutation = useMutation(
    trpc.lobby.createLobby.mutationOptions({
      onSuccess: data => {
        setToken(data);
      },
    }),
  );

  const joinLobbyCallback = useCallback(
    (code: string) => {
      joinMutation.mutate({ code });
    },
    [joinMutation],
  );

  const createLobbyCallback = useCallback(() => {
    createMutation.mutate();
  }, [createMutation]);

  const setEventHandler = useCallback((callback: LobbyEventCallback) => {
    eventCallbackRef.current = callback;
  }, []);

  const state: LobbyState = {
    self: selfState,
    setEventHandler: setEventHandler,
    join: joinLobbyCallback,
    create: createLobbyCallback,
  };

  return (
    <PlayerDataContext.Provider value={state}>
      {children}
    </PlayerDataContext.Provider>
  );
}
