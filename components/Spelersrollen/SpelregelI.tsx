import React from 'react';
import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { StyleSheet } from 'react-native';
import { GameRuleOverlayContent } from '../ui/GameRuleOverlay';

export const SpelregelI = () => {
  const [showInfo, setShowInfo] = useState(false);
  return (
    <>
      <View style={styles.InfoButtonContainer}>
        <Pressable onPress={() => setShowInfo(prev => !prev)}>
          <View style={styles.InfoIconContainer}>
            <Text style={styles.InfoButtonIcon}>i</Text>
          </View>
        </Pressable>
      </View>
      {showInfo && (
        <GameRuleOverlayContent onClose={() => setShowInfo(false)} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  InfoButtonContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
  },

  InfoIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1976d2',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  InfoButtonIcon: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 22,
  },

  SpelregelContainer: {
    position: 'absolute',
    top: 80,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    alignItems: 'center',
    zIndex: 20,
    width: 300,
    height: 460,
  },

  SluitStyling: {
    color: '#1976d2',
    fontWeight: 'bold',
  },
  PijlStyling: {
    fontSize: 38,
    marginHorizontal: 16,
    fontWeight: 'bold',
  },
  ButtonContainerStyling: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    bottom: 15,
  },

  PijlContainerStyling: {
    position: 'absolute',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    left: 0,
    bottom: 30,
    flexDirection: 'row',
    marginTop: 8,
  },
  TekstStyling: {
    textAlign: 'left',
    fontSize: 18,
    fontWeight: '600',
  },
  TitelStyling: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  Subtitel: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 18,
  },
  Subtekst: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
  },
});
