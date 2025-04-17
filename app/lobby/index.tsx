import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useLobby } from '@/hooks/useLobby';
import { Link, useRouter } from 'expo-router';
import { Button, ScrollView, View } from 'react-native';

export default function LobbyPage() {
  const lobby = useLobby();
  const router = useRouter();

  if (!lobby.get()) {
    return (
      <View>
        <ThemedText>Not in a lobby</ThemedText>
        <Link href="/">Go Home</Link>
      </View>
    );
  }

  return (
    <ThemedView>
      <ThemedText>lobby</ThemedText>
      <ThemedText>Code: {lobby.get()?.code}</ThemedText>
      <Button
        onPress={() => {
          lobby.leave();
          router.navigate('/');
        }}
        title="Leave"
      />
      <ScrollView>
        {lobby.get()?.players.map(player => (
          <View key={player.id}>
            <ThemedText>Player: {player.id}</ThemedText>
          </View>
        ))}
      </ScrollView>
    </ThemedView>
  );
}
