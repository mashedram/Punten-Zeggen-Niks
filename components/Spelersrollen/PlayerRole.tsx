import React from 'react';
import { useState } from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { View } from 'react-native';
import { Text } from 'react-native';
import { RoleCard } from '@/constants/RoleCards';
import { CardImages } from '@/constants/CardImages';
import { Animated } from 'react-native';
import { useRef } from 'react';

interface Rolecardprops {
  attackCode: string;
  roleCard: RoleCard | undefined;
}

export const PlayerRole = ({ attackCode, roleCard }: Rolecardprops) => {
  const [imageToggled, setToggled] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;
  if (roleCard === undefined) {
    return (
      <View style={[styles.image]}>
        <Text style={styles.text}>Je hebt (nog) geen rol gekregen!</Text>
      </View>
    );
  }
  const image = roleCard ? CardImages[roleCard.id?.toLowerCase()] : undefined;

  const handleToggle = () => {
    const toValue = imageToggled ? 0 : 1;
    Animated.timing(flipAnim, {
      toValue: 0.5,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setToggled(prev => !prev);
      Animated.timing(flipAnim, {
        toValue,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });
  };
  const rotateY = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <Animated.View style={[styles.image, { transform: [{ rotateY }] }]}>
      <TouchableOpacity
        style={styles.container}
        onPress={handleToggle}
        activeOpacity={0.8}>
        {imageToggled ? (
          <View style={styles.image}>
            <View style={{ transform: [{ rotateY: '180deg' }] }}>
              <QRCode value={`${roleCard.id}?${attackCode}`} size={220} />
            </View>
          </View>
        ) : image ? (
          <Image style={styles.image} source={image} resizeMode="cover" />
        ) : null}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    height: 320,
    width: 240,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 20,
  },
  image: {
    height: 320,
    width: 240,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 90,
  },
});
