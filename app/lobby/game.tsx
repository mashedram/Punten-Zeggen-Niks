import { CartStackTracker } from '@/components/ui/CartStackTracker';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function StrategoGame() {
  return (
    <SafeAreaView style={styles.backgroundView}>
      <View style={styles.CardStackTrackerContainer}>
        <CartStackTracker />
      </View>
      <View style={styles.CaptainIconContainer}>
        <Text style={styles.CaptainIcon}>🎖</Text>
      </View>

      <View style={styles.BattleLogButtonContainer}>
        <View style={styles.BattlelogButton}>
          <Text style={styles.BattleLogButtonArrow}>{'<'} </Text>
        </View>
      </View>
      <Image
        source={require('@/assets/images/Spion.png')}
        style={styles.kaartcontainer}></Image>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backgroundView: {
    position: 'relative',
    backgroundColor: 'rgba(92, 163, 194, 1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    margin: 0,
  },
  kaartcontainer: {
    position: 'relative',
    flexShrink: 0,
    width: 247,
    height: 277,
    borderRadius: 12,
  },
  BattleLogButtonContainer: {
    position: 'absolute',
    right: 0,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  BattlelogButton: {
    position: 'relative',
    width: 28,
    height: 143,
    backgroundColor: 'rgba(194, 123, 92, 1)',
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    borderRadius: 15,
    marginRight: 12,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  BattleLogButtonArrow: {
    color: 'rgba(255, 255, 255, 1)',
    fontFamily: 'Inter',
    fontSize: 24,
    fontWeight: 400,
  },
  CardStackTrackerContainer: {
    position: 'absolute',
    width: '100%',
    top: 0,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  CaptainIconContainer: {
    position: 'absolute',
    width: '100%',
    top: 0,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 72,
  },
  CaptainIcon: {
    width: 67,
    height: 66,
    textAlign: 'left',
    color: 'rgba(0, 0, 0, 1)',
    fontFamily: 'Inter',
    fontSize: 60,
    fontWeight: '700',
  },
});
