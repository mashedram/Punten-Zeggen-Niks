import { AnimatedSwitch } from '@/components/AnimatedSwitch';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { Link } from 'expo-router';

const { height } = Dimensions.get('window');

const MIN_PLAYER_COUNT = 1;
const MAX_PLAYER_COUNT = 999;

export default function Settingsv2() {
  const [playerCount, setPlayerCount] = useState(1);
  const [switchStates, setSwitchStates] = useState([
    true,
    false,
    true,
    true,
    false,
  ]);

  const toggleSwitch = (index: number) => {
    setSwitchStates(prevStates => {
      prevStates[index] = !prevStates[index];
      return [...prevStates];
    });
  };

  const incrementPlayerCount = () => {
    setPlayerCount(prev => Math.min(prev + 1, MAX_PLAYER_COUNT));
  };

  const decrementPlayerCount = () => {
    setPlayerCount(prev => Math.max(prev - 1, MIN_PLAYER_COUNT));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Link href="/lobby">
            <Svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <Path
                d="M7.04199 15.6667L16.3753 25.0001L14.0003 27.3334L0.666992 14.0001L14.0003 0.666748L16.3753 3.00008L7.04199 12.3334H27.3337V15.6667H7.04199Z"
                fill="white"
              />
            </Svg>
          </Link>
        </TouchableOpacity>
        <Text style={styles.headerText}>Settings</Text>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Switches */}
        <View style={styles.switchContainer}>
          {switchStates.map((selected, index) => (
            <View key={index} style={styles.switchRow}>
              <View style={styles.switchLabel}>
                <Text style={styles.switchLabelText}>
                  lorem ipsum dolor sit amet
                </Text>
              </View>
              <TouchableOpacity onPress={() => toggleSwitch(index)}>
                <AnimatedSwitch selected={selected} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Player Count Adjustment */}
        <Text style={styles.sectionTitle}>Select player count</Text>
        <View style={styles.playerCountContainer}>
          <View style={styles.playerCountControls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={decrementPlayerCount}>
              <Text style={styles.controlButtonText}>-</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.playerCountInput}
              keyboardType="numeric"
              value={playerCount.toString()}
              onChangeText={text => {
                const value = parseInt(text, 10);
                if (!isNaN(value)) {
                  setPlayerCount(
                    Math.max(
                      MIN_PLAYER_COUNT,
                      Math.min(value, MAX_PLAYER_COUNT),
                    ),
                  );
                }
              }}
            />
            <TouchableOpacity
              style={styles.controlButton}
              onPress={incrementPlayerCount}>
              <Text style={styles.controlButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <TouchableOpacity style={styles.confirmButton}>
          <Text style={styles.confirmText}>Confirm</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5CA3C2',
    margin: -1.2,
  },
  header: {
    height: height * 0.1,
    backgroundColor: '#5CA3C2',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 16,
    flex: 1,
    textAlign: 'center',
  },
  content: {
    padding: 16,
    alignItems: 'center',
  },
  switchContainer: {
    flexDirection: 'column',
    gap: 16,
    width: '100%',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  switchLabel: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 8,
    marginRight: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  switchLabelText: {
    fontSize: 14,
    color: '#000000',
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 24,
    textAlign: 'center',
  },
  playerCountContainer: {
    marginTop: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E6E0E9',
    borderRadius: 12,
    backgroundColor: '#F9F9F9',
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  playerCountLabel: {
    fontSize: 34,
    fontWeight: '400',
    color: '#000000',
    marginBottom: 8,
  },
  playerCountControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  controlButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#AE5CC2',
    borderRadius: 8,
    marginHorizontal: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  controlButtonText: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  playerCountInput: {
    height: 50,
    width: 50,
    borderWidth: 5,
    borderColor: '#000000',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
    backgroundColor: '#FFFFFF',
  },
  confirmButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#70C25C',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  confirmText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
