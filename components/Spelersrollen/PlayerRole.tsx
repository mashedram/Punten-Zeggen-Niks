import React, { useRef, useState } from 'react';
import { StyleSheet, Image, Animated, TouchableOpacity } from 'react-native';
import { View } from 'react-native';
import { Text } from 'react-native';
import { RoleCard } from '@/constants/RoleCards';
import { CardImages } from '@/constants/CardImages';
import { TeamColors } from '@/constants/Colors';
import QRCode from 'react-native-qrcode-svg';

interface Rolecardprops {
  teamId: string;
  attackCode: string;
  roleCard: RoleCard | undefined;
}

export const PlayerRole = ({ teamId, attackCode, roleCard }: Rolecardprops) => {
  const image = roleCard ? CardImages[roleCard.id?.toLowerCase()] : undefined;
  const [showQRcode, setShowQRcode] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;

  const handleFlipImg = () => {
    const toValue = showQRcode ? 0 : 1;
    Animated.timing(flipAnim, {
      toValue: 0.5,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setShowQRcode(prev => !prev);
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

  if (roleCard === undefined) {
    return (
      <View
        style={[
          styles.container,
          {
            borderColor:
              teamId === 'red' ? TeamColors.red.color : TeamColors.blue.color,
          },
        ]}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>You have no role card assigned</Text>
          <Text style={styles.text}>
            Go to your team leader to get a role assigned
          </Text>
        </View>
      </View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          borderColor:
            teamId === 'red' ? TeamColors.red.color : TeamColors.blue.color,
          transform: [{ rotateY }],
        },
      ]}>
      <TouchableOpacity
        style={styles.button}
        onPress={handleFlipImg}
        activeOpacity={0.8}>
        {showQRcode ? (
          <View
            style={[
              styles.qrCodeContainer,
              { transform: [{ rotateY: '180deg' }] },
            ]}>
            <QRCode value={`${attackCode}`} size={160} />
          </View>
        ) : (
          <View style={styles.imageContainer}>
            <Image source={image} style={styles.image} resizeMode="center" />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 4,
    width: 200,
    height: 200,
  },
  button: {
    width: '100%',
    height: '100%',
  },
  qrCodeContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
  },
  image: {
    borderRadius: 20,
    width: '100%',
    height: '100%',
  },
  textContainer: {
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  text: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
