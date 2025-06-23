import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export const GameRuleOverlay = () => {
  const [isOpen, setOpen] = useState(true);

  if (!isOpen) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.primaryContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Game Rule Overlay</Text>
        </View>
        <View style={styles.textContainer}>
          <Text>Game rules go here...</Text>
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <Pressable onPress={() => setOpen(false)} style={styles.button}>
          <Text>Close</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(92, 163, 194, 1)',

    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  primaryContainer: {
    width: '100%',
    height: '90%',
  },
  titleContainer: {
    width: '100%',
    height: '10%',

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  textContainer: {},
  buttonsContainer: {
    width: '100%',
    height: '10%',

    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    width: '90%',
    height: '55%',

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 5,
  },
});
