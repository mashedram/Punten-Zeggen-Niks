import { CreateButton } from '@/components/Home_page/CreateButton';
import { JoinButton } from '@/components/Home_page/JoinButton';
import { useLobby } from '@/hooks/useLobby';
import { Redirect } from 'expo-router';
import { useState } from 'react';
import { Image } from 'react-native';

import {
  View,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';

import LogoImage from '@/assets/images/Socket.png';

export default function HomePage() {
  const lobby = useLobby();

  if (lobby.loading) {
    return;
  }

  if (lobby.inLobby) {
    return <Redirect href="/lobby" />;
  }

  const dev_lobbyCode = process.env.EXPO_PUBLIC_DEV_LOBBY_CODE;
  if (dev_lobbyCode) {
    return <Redirect href={`/dev`} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContent}>
        <Image source={LogoImage} style={styles.profileImage} />
      </View>
      <View style={styles.bottomCard}>
        <JoinButton />
        <CreateButton />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5CA3C2',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    margin: -1.2,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  bottomCard: {
    backgroundColor: 'white',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: 'center',
  },
  joinButton: {
    width: '100%',
    height: 45,
    backgroundColor: '#70C25C',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  joinText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  profileImage: {
    width: '80%',
    height: '80%',
    marginRight: 0,
    marginBottom: 50,
    resizeMode: 'contain',
    marginVertical: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
