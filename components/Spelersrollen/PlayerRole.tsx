import React from 'react';
import { useState } from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { View } from 'react-native';
import { Text } from 'react-native';
import { RoleCard } from '@/constants/RoleCards';
import { CardImages } from '@/constants/CardImages';

interface Rolecardprops {
  attackCode: string;
  roleCard: RoleCard | undefined;
}

export const PlayerRole = ({ attackCode, roleCard }: Rolecardprops) => {
  const [imageToggled, setToggled] = useState(false);

  const image = roleCard ? CardImages[roleCard.id?.toLowerCase()] : undefined;

  if (roleCard == undefined) {
    return (
      <View style={[styles.image]}>
        <Text style={styles.text}>Je hebt (nog) geen rol gekregen!</Text>
      </View>
    );
  }
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => setToggled(!imageToggled)}
      activeOpacity={0.8}>
      {imageToggled ? (
        <View style={styles.image}>
          <QRCode value={`${roleCard.name}?${attackCode}`} />
        </View>
      ) : image ? (
        <Image style={styles.image} resizeMode="contain" source={image} />
      ) : null}
      {/* <View style={styles.image}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 18,
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
              Je hebt (nog) geen rol gekregen!
            </Text>
          </View>
        </View>
      )} */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: 240,
    height: 240,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#444',
  },
  text: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
