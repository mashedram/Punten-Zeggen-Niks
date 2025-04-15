import ParallaxScrollView from '@/components/ParallaxScrollView';
import { Image, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import CodeInput from '@/components/CodeInput';
import { useLobby } from '@/hooks/useLobby';
import { useRoute } from '@react-navigation/native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const lobby = useLobby();
  const router = useRouter();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#90ffac', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/two-pine-logo.jpeg')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Join a lobby</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Enter a Code</ThemedText>
        <ThemedText>Enter the code you received from your friend.</ThemedText>
        <CodeInput
          onSubmit={code => {
            lobby.join(code);
            router.navigate('/lobby');
          }}
        />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
