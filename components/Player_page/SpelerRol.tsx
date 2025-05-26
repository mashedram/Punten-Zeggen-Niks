import React from 'react';
import { useState } from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';

export const SpelerRol = () => {
  const [toggled, setToggled] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: 38,
      height: 38,
      borderRadius: 10,
    },
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => setToggled(!toggled)}>
      <Image
        source={{
          uri: toggled
            ? 'https://example.com/other-image.jpg'
            : 'https://i.pinimg.com/736x/9a/19/4e/9a194ee95fafa71205bd41d97ddb1c95.jpg',
        }}
        style={styles.image}
      />
    </TouchableOpacity>
  );
};
