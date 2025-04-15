import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useLobby } from '@/hooks/useLobby';
import { Button } from '@/stories/Button';
import { Link } from 'expo-router';
import { View } from 'react-native';

export default function LobbyPage() {
  const lobby = useLobby();

  if (!lobby.self) {
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
    </ThemedView>
  );
}
