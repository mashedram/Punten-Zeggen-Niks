import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';

export const MenuButton = () => {
  const [notPressed, pressed] = useState(true);

  const handlePress = () => {
    Alert.alert('Je hebt op de afbeelding gedrukt!');
    pressed(!notPressed);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: 25,
      height: 25,
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress}>
        <Image
          source={{
            uri: 'https://www.svgrepo.com/show/26445/menu-symbol-of-three-parallel-lines.svg',
          }}
          style={styles.image}
        />
      </TouchableOpacity>
    </View>
  );
};
