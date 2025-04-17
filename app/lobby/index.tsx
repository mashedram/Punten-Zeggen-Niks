import { GameStartButton } from '@/components/lobby_host/GameStartButton';
import { KickButton } from '@/components/lobby_host/KickButton';
import { PlayerCount } from '@/components/lobby_host/PlayerCount';
import { PlayerList } from '@/components/lobby_host/PlayerList';
import { ReturnButton } from '@/components/lobby_host/ReturnButton';
import { SettingsButton } from '@/components/lobby_host/SettingsButton';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useLobby } from '@/hooks/useLobby';
import { Link, useRouter } from 'expo-router';
import { Button, ScrollView, View } from 'react-native';
import { StyleSheet } from 'react-native';

export default function LobbyPage() {
  const lobby = useLobby();
  const router = useRouter();

  const activeLobby = lobby.get();

  if (!activeLobby) {
    return (
      <View>
        <ThemedText>Not in a lobby</ThemedText>
        <Link href="/">
          <ThemedText type="link">Go Home</ThemedText>
        </Link>
      </View>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">My lobby</ThemedText>
        <ThemedText type="subtitle">Code: {lobby.get()?.code}</ThemedText>
      </ThemedView>
      <ThemedView>
        <ThemedText>Aantal spelers: {activeLobby.players.length}/8</ThemedText>
        <ScrollView>
          {activeLobby.players.map(player => (
            <View key={player.id}>
              <ThemedText>Player: {player.id}</ThemedText>
            </View>
          ))}
        </ScrollView>
        <SettingsButton />
      </ThemedView>
      <ThemedView>
        <GameStartButton />
        <KickButton />
        <ReturnButton />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'column',
    gap: 8,
  },
});
