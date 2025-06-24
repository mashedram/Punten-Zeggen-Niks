import React, { useState } from 'react';
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
        },
      ]}>
      <TouchableOpacity
        style={[styles.button]}
        onPress={() => setShowQRcode(!showQRcode)}
        activeOpacity={0.8}>
        <View
          style={[styles.qrCodeContainer, showQRcode ? {} : styles.flipButton]}>
          <QRCode value={`${attackCode}`} size={160} />
        </View>
        <View
          style={[styles.imageContainer, showQRcode ? styles.flipButton : {}]}>
          <Image source={image} style={styles.image} resizeMode="center" />
        </View>
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
    transitionDuration: '0.3s',
  },
  flipButton: {
    transform: [{ rotateY: '180deg' }],
  },
  qrCodeContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
    transitionDuration: '0.3s',
  },
  imageContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    transitionDuration: '0.3s',
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
