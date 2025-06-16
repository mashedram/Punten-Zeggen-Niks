import { PlayerRole } from '@/components/Spelersrollen/PlayerRole';
import {
  InitalizationFailureReason,
  useStratego,
} from '@/hooks/game/useStratego';
import { useLobby } from '@/hooks/useLobby';
import { Redirect } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { GameState } from '@/constants/GameState';
import { CardCountBar } from '@/components/ui/CardCountBar';
import { RoleCardPicker } from '@/components/ui/RoleCardPicker';
import { AllRoleCards } from '@/constants/RoleCards';
import { AttackButton } from '@/components/ui/AttackButton';
import { FontAwesome } from '@expo/vector-icons';
import { defaultDeckSize } from '@/constants/RoleCardDeck';

export default function Game() {
  const lobby = useLobby();
  const stratego = useStratego();

  const [isLeaderPopupOpen, setLeaderPopupOpen] = useState(false);

  const slideAnim = useRef(new Animated.Value(-500)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isLeaderPopupOpen ? 0 : -500,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [isLeaderPopupOpen, slideAnim]);

  if (lobby.loading) {
    return;
  }

  if (!lobby.inLobby) {
    return <Redirect href="/" />;
  }

  if (!stratego.initialized) {
    if (stratego.reason === InitalizationFailureReason.NotInLobby) {
      return <Redirect href="/" />;
    } else if (stratego.reason === InitalizationFailureReason.GameNotRunning) {
      return <Redirect href="/lobby" />;
    }
    return;
  }

  const availablePlayers = stratego.players.filter(
    p => p.hasRoleCard === false && p.teamId === stratego.self.teamId,
  ).length;

  console.log(stratego.lobby.teams);
  const teamRedDeck = stratego.lobby.teams.find(
    team => team.id === 'red',
  )?.deck;
  const teamBlueDeck = stratego.lobby.teams.find(
    team => team.id === 'red',
  )?.deck;
  console.log(teamBlueDeck);
  console.log(teamRedDeck);
  const teamRedDeckSize = teamRedDeck
    ? Object.values(teamRedDeck).reduce((sum, value) => sum + value, 0)
    : defaultDeckSize;
  console.log(teamRedDeckSize);
  const teamBlueDeckSize = teamBlueDeck
    ? Object.values(teamBlueDeck).reduce((sum, value) => sum + value, 0)
    : defaultDeckSize;
  console.log(teamBlueDeckSize);

  return (
    <SafeAreaView style={styles.BackgroundView}>
      <View style={styles.CardStackTrackerContainer}>
        <CardCountBar blueCardCount={60} redCardCount={60} />
      </View>

      {stratego.self.isTeamLeader && (
        <TouchableOpacity
          style={styles.CaptainIconContainer}
          onPress={() => {
            if (availablePlayers > 0 || isLeaderPopupOpen) {
              setLeaderPopupOpen(!isLeaderPopupOpen);
            }
          }}>
          {availablePlayers > 0 && (
            <View>
              <Svg
                style={styles.CaptainEllipse}
                width={20}
                height={20}
                viewBox="0 0 20 20"
                fill="none">
                <Circle cx={10} cy={10} r={10} fill="#FF2424" />
              </Svg>
              <Text style={styles.CaptainText}>{availablePlayers}</Text>
            </View>
          )}
          <Text style={styles.CaptainIcon}>🎖</Text>
        </TouchableOpacity>
      )}
      <View style={styles.roleContainer}>
        <PlayerRole
          teamId={stratego.self.teamId}
          attackCode={stratego.self.attackCode}
          roleCard={AllRoleCards.find(
            card => card.id === stratego.self.roleCard,
          )}
        />
      </View>

      <View style={styles.playerAttackContainer}>
        <AttackButton />
      </View>

      <Animated.View
        style={[
          styles.roleCardSelectionContainer,
          { transform: [{ translateY: slideAnim }] },
        ]}
        pointerEvents={isLeaderPopupOpen ? 'auto' : 'none'}>
        <TouchableOpacity
          style={styles.closeCardSelection}
          onPress={() => {
            setLeaderPopupOpen(!isLeaderPopupOpen);
          }}>
          <FontAwesome name="close" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.roleCardPickerContainer}>
          <Text style={styles.rolePickerText}>
            Select a player and role to rivive the chosen player.
          </Text>
          <RoleCardPicker />
        </View>
      </Animated.View>

      {/* Gameloop test gedeelte kan later weg */}
      <View>
        {/* status van de game */}
        <View>
          {stratego.lobby.gameState === GameState.playing && (
            <Text>Game is running...</Text>
          )}
          {stratego.lobby.gameState === stratego.self.teamId &&
            stratego.lobby.gameState !== GameState.playing && (
              <Text>
                Je hebt gewonnen! Gefeliciteerd, {stratego.self.teamId} team!
              </Text>
            )}
          {stratego.lobby.gameState !== stratego.self.teamId &&
            stratego.lobby.gameState !== GameState.playing && (
              <Text>
                Je hebt verloren. Volgende keer beter team{' '}
                {stratego.self.teamId}.
              </Text>
            )}
        </View>
      </View>
      {/* Einde test gedeelte gameloop */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  BackgroundView: {
    backgroundColor: 'rgba(92, 163, 194, 1)',
    alignItems: 'center',
    flex: 1,
  },
  CardStackTrackerContainer: {
    width: '100%',
    maxWidth: 500,
    top: 0,
    marginTop: 5,
  },
  CaptainIconContainer: {
    position: 'absolute',
    top: 0,
    marginTop: 40,
  },
  CaptainEllipse: {
    position: 'absolute',
    borderRadius: 10,
  },
  CaptainIcon: {
    textAlign: 'left',
    color: 'rgba(0, 0, 0, 1)',
    fontFamily: 'Inter',
    fontSize: 60,
    fontWeight: '700',
  },
  CaptainText: {
    position: 'absolute',
    color: 'rgba(255, 255, 255, 1)',
    fontFamily: 'Inter',
    fontSize: 11,
    fontWeight: '700',
    left: 8,
    top: 4,
  },
  roleContainer: {
    marginTop: 90,
    alignItems: 'center',
  },
  roleCardSelectionContainer: {
    width: 250,
    height: 250,
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 200,
    zIndex: 100,
  },
  closeCardSelection: {
    marginLeft: 210,
  },
  roleCardPickerContainer: {
    marginTop: 20,
    width: 200,
  },
  rolePickerText: {
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: 700,
    fontSize: 16,
  },
  playerAttackContainer: {
    marginTop: 10,
  },
});
