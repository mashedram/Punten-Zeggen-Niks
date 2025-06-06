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
import { Text } from 'react-native';
import { RoleCard, AllRoleCards } from '@/constants/RoleCards';
import { CardImages } from '@/constants/CardImages';

interface Rolecardprops {
  attackCode: string;
  roleCard: RoleCard | undefined;
}

export const PlayerRole = ({ attackCode, roleCard }: Rolecardprops) => {
  const [toggled, setToggled] = useState(false);

  const image = roleCard ? CardImages[roleCard.name?.toLowerCase()] : undefined;

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
    },
  });

  if (!roleCard) {
    return (
      <View style={[styles.image, { backgroundColor: '#444' }]}>
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
    );
  }
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => setToggled(!toggled)}
      activeOpacity={0.8}>
      {toggled ? (
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
