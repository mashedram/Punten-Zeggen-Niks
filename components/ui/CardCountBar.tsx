import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { defaultDeckSize } from '@/constants/RoleCardDeck';

type CardCountBarProps = {
  blueCardCount?: number;
  redCardCount?: number;
};

export const CardCountBar: React.FC<CardCountBarProps> = ({
  blueCardCount: blueCount,
  redCardCount: redCount,
}) => {
  if (blueCount == null || redCount == null) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.text}>Laden...</Text>
      </View>
    );
  }

  const teamBlueRatio = blueCount / defaultDeckSize;
  const teamRedRatio = redCount / defaultDeckSize;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{blueCount}</Text>
      <View style={styles.barContainer}>
        <View style={styles.edge} />
        <View style={[styles.blueBar, { flex: teamBlueRatio }]} />
        <View style={styles.centerSeparator} />
        <View style={[styles.redBar, { flex: teamRedRatio }]} />
        <View style={styles.edge} />
      </View>
      <Text style={styles.text}>{redCount}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5DA3B5',
    padding: 4,
    borderRadius: 4,
  },
  loadingContainer: {
    padding: 8,
    backgroundColor: '#5DA3B5',
    borderRadius: 4,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    marginHorizontal: 6,
    fontSize: 16,
  },
  barContainer: {
    flexDirection: 'row',
    flex: 1,
    height: 20,
    borderRadius: 4,
    overflow: 'hidden',
  },
  edge: {
    width: 4,
    backgroundColor: 'white',
  },
  blueBar: {
    backgroundColor: 'blue',
  },
  centerSeparator: {
    width: 8,
    backgroundColor: 'black',
  },
  redBar: {
    backgroundColor: 'red',
  },
});

export default CardCountBar;
