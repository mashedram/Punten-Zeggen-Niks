import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Button, Text, View } from 'react-native';

export const JoinButton = () => {
  const router = useRouter();
  return (
    <View>
      <Button
        title={'Join a game'}
        onPress={() => {
          router.navigate('/lobby/join');
        }}
      />
    </View>
  );
};
