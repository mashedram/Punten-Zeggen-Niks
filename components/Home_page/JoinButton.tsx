import { useRouter } from 'expo-router';
import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';

export const JoinButton = () => {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.joinButton}
      onPress={() => router.navigate('/lobby/join')}>
      <Text style={styles.joinText}>Join a game</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
});
