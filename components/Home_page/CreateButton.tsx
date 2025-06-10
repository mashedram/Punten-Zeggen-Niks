import { useLobby } from '@/hooks/useLobby';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';

export const CreateButton = () => {
  const lobby = useLobby();
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.createButton}
      // disabled={lobby.loading}
      onPress={() => {
        if (lobby.loading) return;
        if (lobby.inLobby) return;
        // @ts-ignore

        router.navigate('/lobby/create');
      }}>
      <Text style={styles.createText}>Maak een spel aan</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  createButton: {
    width: '100%',
    height: 45,
    backgroundColor: 'rgb(214, 214, 214)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  createText: {
    color: '#665858',
    // marginTop: 16,
    fontWeight: '700',
    fontSize: 16,
  },
});
