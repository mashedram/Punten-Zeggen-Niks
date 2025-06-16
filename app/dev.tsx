import { useTRPC } from '@/api/query';
import { useClient } from '@/hooks/networking/useClient';
import { useLobby } from '@/hooks/useLobby';
import { useMutation } from '@tanstack/react-query';
import { Redirect } from 'expo-router';
import { useEffect } from 'react';
import { Button, Pressable } from 'react-native';

export default function DevPage() {
  const lobby = useLobby();
  const tRPC = useTRPC();
  const joinDevLobbyMutation = useMutation(
    tRPC.lobby.joinDevLobby.mutationOptions({}),
  );

  useEffect(() => {
    const dev_lobbyCode = process.env.EXPO_PUBLIC_DEV_LOBBY_CODE;
    if (!dev_lobbyCode) {
      throw new Error('EXPO_PUBLIC_DEV_LOBBY_CODE is not defined');
    }
    if (joinDevLobbyMutation.isPending) {
      return;
    }
    // Automatically join the dev lobby when the component mounts
    joinDevLobbyMutation.mutate({ code: dev_lobbyCode });
  });

  if (lobby.loading) {
    return;
  }

  if (lobby.inLobby) {
    return <Redirect href="/lobby" />;
  }

  const dev_lobbyCode = process.env.EXPO_PUBLIC_DEV_LOBBY_CODE;
  if (!dev_lobbyCode) {
    throw new Error('EXPO_PUBLIC_DEV_LOBBY_CODE is not defined');
  }

  // Join the dev lobby automatically
  return (
    <Pressable
      onPress={() =>
        joinDevLobbyMutation.isPending
          ? null
          : joinDevLobbyMutation.mutate({ code: dev_lobbyCode })
      }>
      <div
        style={{
          color: 'white',
          fontSize: 20,
          fontWeight: 'bold',
          width: '100vw',
          height: '100vh',
          textAlign: 'center',
          padding: 20,
          backgroundColor: '#5CA3C2',
          borderRadius: 10,
        }}>
        Join Dev Lobby
      </div>
    </Pressable>
  );
}
