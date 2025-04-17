import React, { useState } from 'react';
import { Button, View } from 'react-native';

export const KickButton = () => {
  const [deletePlayer, playerDeleted] = useState(true);

  return (
    <View>
      <Button
        onPress={() => {
          playerDeleted(false);
        }}
        disabled={!deletePlayer}
        title={deletePlayer ? 'kick' : 'kicked'}
      />
    </View>
  );
};
