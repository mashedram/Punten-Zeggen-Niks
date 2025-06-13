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
  Pressable,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { GameState } from '@/constants/GameState';
import { CardCountBar } from '@/components/ui/CardCountBar';
import { RoleCardPicker } from '@/components/ui/RoleCardPicker';
import { AllRoleCards } from '@/constants/RoleCards';
import { AttackButton } from '@/components/ui/AttackButton';
import { WinPopUp } from '@/components/ui/WinPopUp';
import { VerlorenPopUp } from '@/components/ui/VerlorenPopUp';
import { GelijkPopUp } from '@/components/ui/GelijkPopUp';
import { defaultDeckSize } from '@/constants/RoleCardDeck';
import { FeedbackForm } from '@/components/ui/FeedbackForm';

export default function Game() {
  const lobby = useLobby();
  const stratego = useStratego();
  const [lastFightPopup, setLastFightPopup] = useState<number | undefined>(
    undefined,
  );

  const [isLeaderPopupOpen, setLeaderPopupOpen] = useState(false);

  const slideAnim = useRef(new Animated.Value(-1500)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isLeaderPopupOpen ? -700 : -1500,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [isLeaderPopupOpen, slideAnim]);
  const [showInfo, setShowInfo] = React.useState(false);


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

  const lastFightResult = stratego.self.lastFightResult;
  let fightPopUp = null;
  if (
    lastFightResult?.type === 'success' &&
    lastFightResult.index !== lastFightPopup
  ) {
    if (lastFightResult.state === 'win') {
      fightPopUp = (
        <WinPopUp onClose={() => setLastFightPopup(lastFightResult.index)} />
      );
    } else if (lastFightResult.state === 'lose') {
      fightPopUp = (
        <VerlorenPopUp
          onClose={() => setLastFightPopup(lastFightResult.index)}
        />
      );
    } else if (lastFightResult.state === 'draw') {
      fightPopUp = (
        <GelijkPopUp onClose={() => setLastFightPopup(lastFightResult.index)} />
      );
    } else if (lastFightResult.state === 'explode') {
      fightPopUp = (
        <VerlorenPopUp
          onClose={() => setLastFightPopup(lastFightResult.index)}
        />
      );
    }
  }

  const availablePlayers = stratego.players.filter(
    p => p.hasRoleCard === false && p.teamId === stratego.self.teamId,
  ).length;

  const teamRedDeck = stratego.lobby.teams.find(
    team => team.id === 'red',
  )?.deck;
  const teamBlueDeck = stratego.lobby.teams.find(
    team => team.id === 'blue',
  )?.deck;
  const teamRedDeckSize = teamRedDeck
    ? Object.values(teamRedDeck).reduce((sum, value) => sum + value, 0)
    : defaultDeckSize;
  const teamBlueDeckSize = teamBlueDeck
    ? Object.values(teamBlueDeck).reduce((sum, value) => sum + value, 0)
    : defaultDeckSize;

  return (
    <SafeAreaView style={styles.BackgroundView}>
      <FeedbackForm />
      <View style={styles.CardStackTrackerContainer}>
        <CardCountBar
          blueCardCount={teamBlueDeckSize}
          redCardCount={teamRedDeckSize}
        />
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
          styles.roleCardPickerContainer,
          { transform: [{ translateY: slideAnim }] },
        ]}
        pointerEvents={isLeaderPopupOpen ? 'auto' : 'none'}>
        <RoleCardPicker onClose={() => setLeaderPopupOpen(false)} />
      </Animated.View>

      <View
        style={{
          flex: 1,
          width: '100%',
          position: 'absolute',
          marginTop: 200,
          zIndex: 100,
        }}>
        {fightPopUp}
      </View>

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
        <Text>{stratego.self.name}</Text>
      </View>
      {/* Einde test gedeelte gameloop */}


      {/* Info button */}

      <View style={{ position: 'absolute', top: 40, right: 20, zIndex: 10 }}>
        <Pressable onPress={() => setShowInfo(true)}>
          <View style={styles.infoButton}>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 22 }}>
              i
            </Text>
          </View>
        </Pressable>
      </View>

      {showInfo && (
        <View style={styles.SpelregelinfoI}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
            Algemene spelregels:
          </Text>
          <Text style={{ textAlign: 'center', marginBottom: 8 }}>
            • Je wint zodra je de vlag van het andere team (blauw/rood) verovert
            {'\n'}•{'\n'}•{'\n'}•{'\n'}•{'\n'}
          </Text>
          <Pressable onPress={() => setShowInfo(false)}>
            <Text style={{ color: '#1976d2', fontWeight: 'bold' }}>
              Sluiten
            </Text>
          </Pressable>
        </View>
      )}
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
  },
  roleCardPickerContainer: {
    marginTop: 20,
    alignItems: 'center',
    zIndex: 100,
  },
  playerAttackContainer: {
    marginTop: 10,
  },
  infoButton: {
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
  SpelregelinfoI: {
    position: 'absolute',
    top: '30%',
    left: '50%',
    transform: [{ translateX: -150 }, { translateY: -150 }],
    width: '72%',
    height: '30%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
});
