import { useLobby } from '@/hooks/useLobby';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Button, Text, View } from 'react-native';

export const CreateButton = () => {
  const lobby = useLobby();
  const router = useRouter();

  return (
    <View>
      <Button
        title={'Create a game'}
        onPress={() => {
          lobby.create();
          router.navigate('/lobby');
        }}
      />
    </View>
  );
};
