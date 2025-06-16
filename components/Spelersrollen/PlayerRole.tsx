import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { View } from 'react-native';
import { Text } from 'react-native';
import { RoleCard } from '@/constants/RoleCards';
import { CardImages } from '@/constants/CardImages';
import { TeamColors } from '@/constants/Colors';

interface Rolecardprops {
  teamId: string;
  roleCard: RoleCard | undefined;
}

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
          <Text style={styles.text}>You have no role card assigned</Text>
          <Text style={styles.text}>
            Go to your team leader to get a role assigned
          </Text>
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
    borderRadius: 20,
    borderWidth: 4,
    width: 200,
    height: 200,
    alignItems: 'center',
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
    marginLeft: 90,
  },
});
