import { PlayerRole } from '@/components/Spelersrollen/PlayerRole';
import {
  InitalizationFailureReason,
  useStratego,
} from '@/hooks/game/useStratego';
import { useLobby } from '@/hooks/useLobby';
import { Redirect } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { GameState } from '@/constants/GameState';
import { CardCountBar } from '@/components/ui/CardCountBar';
import { RoleCardPicker } from '@/components/ui/RoleCardPicker';
import { AllRoleCards } from '@/constants/RoleCards';
import { AttackButton } from '@/components/ui/AttackButton';
import { WinPopUp } from '@/components/ui/WinPopUp';
import { VerlorenPopUp } from '@/components/ui/VerlorenPopUp';
import { GelijkPopUp } from '@/components/ui/GelijkPopUp';
import { ExplodePopUp } from '@/components/ui/ExplodePopUp';
import { PowerupBar } from '@/components/ui/PowerupBar';
import GameStatusPopup from '@/components/ui/GameStatusPopup';
import { MainMenu } from '@/components/stratego/MainMenu';
import { CaptainButton } from '@/components/stratego/CaptainButton';

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
        <ExplodePopUp
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.BackgroundView}>
      <View style={styles.CardStackTrackerContainer}>
        <CardCountBar
          blueCardCount={teamBlue.score}
          redCardCount={teamRed.score}
        />
      </View>

      <View
        style={[
          styles.roleCardPickerContainer,
          isLeaderPopupOpen && stratego.self.isTeamLeader
            ? styles.roleCardPickerOpen
            : {},
        ]}
        pointerEvents="box-none">
        <RoleCardPicker onClose={() => setLeaderPopupOpen(false)} />
      </View>

      {stratego.self.isTeamLeader && (
        <CaptainButton
          count={availablePlayers}
          onPress={() => {
            if (availablePlayers > 0 || isLeaderPopupOpen) {
              setLeaderPopupOpen(!isLeaderPopupOpen);
            }
          }}
        />
      )}

      <View style={styles.roleOuter} pointerEvents="box-none">
        <View style={styles.roleContainer}>
          <PlayerRole
            teamId={stratego.self.teamId}
            attackCode={stratego.self.attackCode}
            roleCard={AllRoleCards.find(
              card => card.id === stratego.self.roleCard,
            )}
            isTeamLeader={stratego.self.isTeamLeader}
          />

          <AttackButton />
        </View>
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
      <MainMenu />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  BackgroundView: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
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
  roleOuter: {
    ...StyleSheet.absoluteFillObject,

    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleContainer: {
    height: '72%',
  },
  roleCardPickerOpen: {
    transform: [{ translateY: 0 }],
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
    transform: [{ translateY: -1000 }],

    zIndex: 1000,
  },
  playerAttackContainer: {
    marginTop: 10,
  },
});
