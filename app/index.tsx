import { CreateButton } from '@/components/Home_page/CreateButton';
import { JoinButton } from '@/components/Home_page/JoinButton';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { StyleSheet, Image, Text } from 'react-native';
import { ThemedView } from '@/components/ThemedView';

export default function HomePage() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#90FFAC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={{ uri: 'https://twopine.nl/opengraph.jpg' }}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.container}>
        <Text style={styles.gamePin}>Game Pin</Text>{' '}
        {/* Toevoegen van Game Pin */}
        <JoinButton />
        <CreateButton />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    marginTop: 300,
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
  gamePin: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16, // optioneel, om wat ruimte te geven
  },
});
