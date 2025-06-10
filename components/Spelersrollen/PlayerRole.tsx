import React from 'react';
import { StyleSheet, Image, Dimensions } from 'react-native';
import { View } from 'react-native';
import { Text } from 'react-native';
import { RoleCard } from '@/constants/RoleCards';
import { CardImages } from '@/constants/CardImages';
import { TeamColors } from '@/constants/Colors';

interface Rolecardprops {
  teamId: string;
  roleCard: RoleCard | undefined;
}

const { height, width } = Dimensions.get('window');
const CONTAINER_WIDTH = width * 0.5;
const CONTAINER_HEIGHT = height * 0.32;

export const PlayerRole = ({ teamId, roleCard }: Rolecardprops) => {
  const image = roleCard ? CardImages[roleCard.id?.toLowerCase()] : undefined;

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
          <Text style={styles.text}>No role card assigned</Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          borderColor:
            teamId === 'red' ? TeamColors.red.color : TeamColors.blue.color,
        },
      ]}>
      <Image source={image} style={styles.image} resizeMode="center" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: CONTAINER_WIDTH,
    height: CONTAINER_HEIGHT,
    borderRadius: 20,
    borderWidth: 4,
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
