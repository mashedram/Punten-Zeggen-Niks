import React from 'react';
import { useState } from 'react';
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { View } from 'react-native';

interface Rolecardprops {
  actie: string;
  image: ImageSourcePropType;
  code: string;
}

export const Spion = ({ actie, image, code }: Rolecardprops) => {
  const [toggled, setToggled] = useState(false);

  const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    image: {
      width: 100,
      height: 100,
      borderRadius: 40,
      padding: 100,
    },
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => setToggled(!toggled)}
      activeOpacity={0.8}>
      {toggled ? (
        <View style={styles.image}>
          <QRCode value={`${actie}?${Math.random()}`} size={100} />
        </View>
      ) : (
        <Image
          style={styles.image}
          resizeMode="contain"
          // source={}
        />
      )}
    </TouchableOpacity>
  );
};
