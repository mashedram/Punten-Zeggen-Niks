import type { LobbyData } from '@/api/managers/lobby/Lobby';
import type { PlayerEvent } from '@/api/managers/lobby/Player';
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

export type LobbyState =
  | {
      loading: false;
      inLobby: true;
      getToken: () => string;
      get: () => LobbyData | null;
      setEventHandler: (callback: LobbyEventCallback) => void;
      leave: () => void;
      setGame: (gameId: string) => void;
    }
  | {
      loading: false;
      inLobby: false;
      join: (code: string, name: string) => void;
      create: (name: string) => void;
    }
  | {
      loading: true;
    };

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

export function LobbyProvider({ children }: { children?: React.ReactNode }) {
  const tRPC = useTRPC();

  const [token, setToken] = useMMKVString(TOKEN_STORAGE_KEY);
  const [lobbyState, setLobbyState] = useState<LobbyData | null>(null);
  const eventCallbackRef = useRef<LobbyEventCallback | null>(null);

  useSubscription(
    tRPC.lobby.listen.subscriptionOptions(token ? { token } : skipToken, {
      onData: event => {
        switch (event.type) {
          case 'lobby-state':
            setLobbyState(event.content as LobbyData);
            return;
        }

        if (!eventCallbackRef.current) return;

        eventCallbackRef.current(event as PlayerEvent<unknown>);
      },
      onError: error => {
        setToken(undefined);
      },
    }),
  );

  const joinMutation = useMutation(
    tRPC.lobby.joinLobby.mutationOptions({
      onSuccess: data => {
        setToken(data);
      },
    }),
  );
  const createMutation = useMutation(
    tRPC.lobby.createLobby.mutationOptions({
      onSuccess: data => {
        setToken(data);
      },
    }),
  );

  const setGameMutation = useMutation(tRPC.lobby.setGame.mutationOptions());

  const getLobby = useCallback(() => {
    return lobbyState;
  }, [lobbyState]);

  const joinLobbyCallback = useCallback(
    (code: string, name: string) => {
      joinMutation.mutate({ code, name });
    },
    [joinMutation],
  );

  const createLobbyCallback = useCallback(
    (name: string) => {
      createMutation.mutate({ name });
    },
    [createMutation],
  );

  const leaveLobbyCallback = useCallback(() => {
    setToken(undefined);
    setLobbyState(null);
  }, [setToken]);

  const setGameCallback = useCallback(
    (gameId: string) => {
      if (!token) throw new Error('Not in a lobby');
      setGameMutation.mutate({ token, gameId });
    },
    [token, setGameMutation],
  );

  const setEventHandler = useCallback((callback: LobbyEventCallback) => {
    eventCallbackRef.current = callback;
  }, []);

  if (!token) {
    return (
      <PlayerDataContext.Provider
        value={{
          loading: false,
          inLobby: false,
          join: joinLobbyCallback,
          create: createLobbyCallback,
        }}>
        {children}
      </PlayerDataContext.Provider>
    );
  }

  if (!lobbyState) {
    return (
      <PlayerDataContext.Provider value={{ loading: true }}>
        {children}
      </PlayerDataContext.Provider>
    );
  }

  const state: LobbyState = {
    loading: false,
    inLobby: true,
    getToken: () => token,
    get: getLobby,
    setEventHandler: setEventHandler,
    leave: leaveLobbyCallback,
    setGame: setGameCallback,
  };

  return (
    <PlayerDataContext.Provider value={state}>
      {children}
    </PlayerDataContext.Provider>
  );
}
