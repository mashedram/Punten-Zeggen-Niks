import { useTRPC } from '@/api/query';
import { ThemedText } from '@/components/ThemedText';
import {
  InitalizationFailureReason,
  useStratego,
} from '@/hooks/game/useStratego';
import { useLobby } from '@/hooks/useLobby';
import { useMutation } from '@tanstack/react-query';
import { Redirect } from 'expo-router';
import { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';

export default function Game() {
  const lobby = useLobby();
  const trpc = useTRPC();
  const stratego = useStratego(lobby);

  const [attackCode, setAttackCode] = useState('');

  const attackMutation = useMutation(trpc.stratego.attack.mutationOptions({}));

  if (lobby.loading || !lobby.inLobby) {
    return;
  }

  if (!stratego.initialized) {
    if (stratego.reason === InitalizationFailureReason.NotInLobby) {
      return <Redirect href="/" />;
    } else if (stratego.reason === InitalizationFailureReason.GameNotRunning) {
      return <Redirect href="/lobby" />;
    }
    return;
  }

  return (
    <View style={{ backgroundColor: stratego.self.teamId }}>
      <ThemedText>{stratego.self.teamId}</ThemedText>
      <Text>{stratego.self.roleCard}</Text>
      <Text>{stratego.self.attackCode}</Text>
      <TextInput onChangeText={text => setAttackCode(text)} />
      <Button
        onPress={() =>
          attackMutation.mutate({ token: lobby.getToken(), attackCode })
        }
        title="Attack"
      />
      {stratego.self.lastFightResult && (
        <ThemedText>{stratego.self.lastFightResult.state}</ThemedText>
      )}
    </View>
  );
}
