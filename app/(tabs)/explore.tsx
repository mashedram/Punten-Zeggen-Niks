import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { PlayerCount } from '@/components/lobby_host/PlayerCount';
import { ReturnButton } from '@/components/lobby_host/ReturnButton';
import { GameStartButton } from '@/components/lobby_host/GameStartButton';
import { PlayerList } from '@/components/lobby_host/PlayerList';
import { KickButton } from '@/components/lobby_host/KickButton';
import { SettingsButton } from '@/components/lobby_host/SettingsButton';
import { LobbyCode } from '@/components/lobby_host/LobbyCode';

export default function TabTwoScreen() {
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
        <LobbyCode code={'123456'} />
      </ThemedView>
      <ThemedView>
        <PlayerCount aantal={1} />
        <PlayerList />
        <SettingsButton />
      </ThemedView>
      <ThemedView style={styles.bottom}>
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
    flexDirection: 'row',
    gap: 8,
  },
  bottom: {},
});
