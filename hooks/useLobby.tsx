import { useTRPC } from '@/api/query';
import { useMutation } from '@tanstack/react-query';
import React, { createContext, useCallback, useContext } from 'react';
import { useClient, useData } from './networking/useClient';
import {
  LobbyData,
  LobbyDataDescriptor,
  PlayerData,
} from '@/common/networking/tracking/descriptors/LobbyInstanceDescriptor';
import { Deref } from '@/common/networking/tracking/tracker/TrackedInstanceReference';

type LobbyDataExtended = {
  self: Deref<PlayerData>;
} & Deref<LobbyData>;

export type LobbyStateUnsafe = {
  get: () => LobbyDataExtended | undefined;
  setLeader: (target: string, state: boolean) => void;
  leave: () => void;
  setGame: (gameId: string | null) => void;
};

export type LobbyState =
  | ({
      loading: false;
      inLobby: true;
    } & LobbyStateUnsafe)
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
  const client = useClient();
  const lobbyData = useData<LobbyData>(LobbyDataDescriptor);
  const tRPC = useTRPC();

  const setLeaderMutation = useMutation(
    tRPC.lobby.setLeader.mutationOptions({}),
  );
  const joinMutation = useMutation(tRPC.lobby.joinLobby.mutationOptions({}));
  const createMutation = useMutation(
    tRPC.lobby.createLobby.mutationOptions({}),
  );
  const leaveMutation = useMutation(tRPC.lobby.leaveLobby.mutationOptions({}));

  const setGameMutation = useMutation(
    tRPC.lobby.setGame.mutationOptions({
      onError: error => {
        console.error(error);
      },
    }),
  );

  const getLobby = useCallback<
    () => Deref<LobbyDataExtended> | undefined
  >(() => {
    if (client.isLoading) return undefined;
    if (lobbyData.isLoading) return undefined;
    const data = lobbyData.data;
    if (data === undefined) return undefined;
    const self = data.players.find(p => p.id === client.getId());
    if (self === undefined) return undefined;
    const extendedData: LobbyDataExtended = { ...data, self };
    return extendedData;
  }, [
    client,
    // @ts-expect-error We need to reload when data changes, but ts will always say it is not there.
    lobbyData.data,
    lobbyData.isLoading,
  ]);

  const joinLobbyCallback = useCallback(
    (code: string, name: string) => {
      if (client.isLoading) return;
      joinMutation.mutate({ code, name });
    },
    [client, joinMutation],
  );

  const createLobbyCallback = useCallback(
    (name: string) => {
      if (client.isLoading) return;
      createMutation.mutate({ name });
    },
    [client, createMutation],
  );

  const setLeaderCallback = useCallback(
    (target: string, state: boolean) => {
      if (client.isLoading) return;
      setLeaderMutation.mutate({ target, state });
    },
    [client.isLoading, setLeaderMutation],
  );

  const leaveLobbyCallback = useCallback(() => {
    if (client.isLoading) return;
    if (lobbyData.isLoading) return;
    if (lobbyData.data === undefined) return;
    const code = lobbyData.data.code;
    leaveMutation.mutate({ code });
    console.log('Requested lobby leave');
  }, [
    client,
    leaveMutation,
    // @ts-expect-error We need to reload when data changes, but ts will always say it is not there.
    lobbyData.data,
    lobbyData.isLoading,
  ]);

  const setGameCallback = useCallback(
    (gameId: string | null) => {
      if (client.isLoading) return;
      if (lobbyData.isLoading) return;
      if (lobbyData.data === undefined) return;
      setGameMutation.mutate({
        code: lobbyData.data.code,
        gameId,
      });
    },
    [
      client,
      // @ts-expect-error We need to reload when data changes, but ts will always say it is not there.
      lobbyData.data,
      lobbyData.isLoading,
      setGameMutation,
    ],
  );

  if (client.isLoading || lobbyData.isLoading) {
    return (
      <PlayerDataContext.Provider
        value={{
          loading: true,
        }}>
        {children}
      </PlayerDataContext.Provider>
    );
  }

  if (lobbyData.data === undefined) {
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

  const state: LobbyState = {
    loading: false,
    inLobby: true,
    get: getLobby,
    setLeader: setLeaderCallback,
    leave: leaveLobbyCallback,
    setGame: setGameCallback,
  };

  return (
    <PlayerDataContext.Provider value={state}>
      {children}
    </PlayerDataContext.Provider>
  );
}
