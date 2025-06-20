import { PlayerRole } from '@/components/Spelersrollen/PlayerRole';
import {
  InitalizationFailureReason,
  useStratego,
} from '@/hooks/game/useStratego';
import { useLobby } from '@/hooks/useLobby';
import { Redirect } from 'expo-router';
import React, { useState } from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
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
import { FeedbackForm } from '@/components/ui/FeedbackForm';
import { PowerupBar } from '@/components/ui/PowerupBar';
import GameStatusPopup from '@/components/ui/GameStatusPopup';
import { SpelregelI } from '@/components/Spelersrollen/SpelregelI';

export default function Game() {
  const lobby = useLobby();
  const stratego = useStratego();
  const [lastFightPopup, setLastFightPopup] = useState<number | undefined>(
    undefined,
  );

  const [isLeaderPopupOpen, setLeaderPopupOpen] = useState(false);

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

  const teamRed = stratego.lobby.teams.find(team => team.id === 'red');
  const teamBlue = stratego.lobby.teams.find(team => team.id === 'blue');

  if (!teamRed || !teamBlue) {
    throw new Error(`Can not find team ${teamRed} or ${teamBlue}`);
  }

  return (
    <SafeAreaView style={styles.BackgroundView}>
      <FeedbackForm />
      <View style={styles.CardStackTrackerContainer}>
        <CardCountBar
          blueCardCount={teamBlue.score}
          redCardCount={teamRed.score}
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

        <View style={styles.playerAttackContainer}>
          <AttackButton />
        </View>
      </View>

      <View
        style={[
          styles.roleCardPickerContainer,
          isLeaderPopupOpen ? styles.roleCardPickerOpen : {},
        ]}>
        <RoleCardPicker onClose={() => setLeaderPopupOpen(false)} />
      </View>

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

      <View>
        <GameStatusPopup
          gameState={stratego.lobby.gameState}
          teamId={stratego.self.teamId}
          GameStateEnum={GameState}
        />
      </View>
      {/* Einde test gedeelte gameloop */}

      <PowerupBar />
      <SpelregelI />
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
    zIndex: 50,
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
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',

    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleCardPickerOpen: {
    transform: [{ translateY: -1000 }],
  },
  roleCardPickerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',

    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    transitionDuration: '0.3s',
  },
  playerAttackContainer: {
    marginTop: 10,
  },
});
