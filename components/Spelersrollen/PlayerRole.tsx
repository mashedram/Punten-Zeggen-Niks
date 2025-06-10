import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { View } from 'react-native';
import { Text } from 'react-native';
import { RoleCard } from '@/constants/RoleCards';
import { CardImages } from '@/constants/CardImages';

interface Rolecardprops {
  attackCode: string;
  roleCard: RoleCard | undefined;
}

export const PlayerRole = ({ attackCode, roleCard }: Rolecardprops) => {
  const image = roleCard ? CardImages[roleCard.id?.toLowerCase()] : undefined;

  if (roleCard === undefined) {
    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>No role card assigned</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={image} style={styles.image} resizeMode="center" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '100%',
    height: 200,
    borderRadius: 20,
  },
  image: {
    borderRadius: 20,
    width: '100%',
    height: '100%',
  },
  text: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
