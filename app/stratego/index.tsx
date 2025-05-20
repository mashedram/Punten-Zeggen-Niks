import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {
  InitalizationFailureReason,
  useStratego,
} from '@/hooks/game/useStratego';
import { useLobby } from '@/hooks/useLobby';
import { Redirect, useRootNavigationState, useRouter } from 'expo-router';

export default function Game() {
  const lobby = useLobby();
  const stratego = useStratego(lobby);

  if (!stratego.initialized) {
    if (stratego.reason === InitalizationFailureReason.NotInLobby) {
      return <Redirect href="/" />;
    } else if (stratego.reason === InitalizationFailureReason.GameNotRunning) {
      return <Redirect href="/lobby" />;
    }
    return;
  }

  return (
    <ThemedView>
      <ThemedText></ThemedText>
    </ThemedView>
  );
}
