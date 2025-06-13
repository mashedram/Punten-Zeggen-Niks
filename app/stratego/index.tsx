import { useTRPC } from '@/api/query';
import { PlayerRole } from '@/components/Spelersrollen/PlayerRole';
import {
  InitalizationFailureReason,
  useStratego,
} from '@/hooks/game/useStratego';
import { useLobby } from '@/hooks/useLobby';
import { useMutation } from '@tanstack/react-query';
import { Redirect } from 'expo-router';
import React, { useState } from 'react';
import {
  Button,
  SafeAreaView,
  Text,
  TextInput,
  StyleSheet,
  View,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { GameState } from '@/constants/GameState';
import { CardCountBar } from '@/components/ui/CardCountBar';
import { RoleCardPicker } from '@/components/ui/RoleCardPicker';
import { AllRoleCards } from '@/constants/RoleCards';

export default function Game() {
  const lobby = useLobby();
  const trpc = useTRPC();
  const stratego = useStratego();
  const sendAttackMutation = useMutation(
    trpc.stratego.attack.mutationOptions({}),
  );

  const [enemyAttackCode, setEnemyAttackCode] = useState('');

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

  return (
    <SafeAreaView style={styles.BackgroundView}>
      <View style={styles.CardStackTrackerContainer}>
        <CardCountBar blueCardCount={60} redCardCount={30} />
      </View>

      {stratego.self.isTeamLeader && (
        <View style={styles.CaptainIconContainer}>
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
        </View>
      )}

      {(stratego.self.isTeamLeader && (
        <View style={styles.roleContainer}>
          <PlayerRole
            teamId={stratego.self.teamId}
            roleCard={AllRoleCards.find(
              card => card.id === stratego.self.roleCard,
            )}
          />
          <View style={styles.roleCardPickerContainer}>
            <RoleCardPicker />
          </View>
        </View>
      )) || (
        <View style={styles.roleContainer}>
          <PlayerRole
            teamId={stratego.self.teamId}
            roleCard={AllRoleCards.find(
              card => card.id === stratego.self.roleCard,
            )}
          />
        </View>
      )}

      {/* Gameloop test gedeelte kan later weg */}
      <View>
        {/* Wat is de aanvalscode van de speler */}
        <Text>{stratego.self.attackCode}</Text>

        {/* invoer veld voor de aanvalscode van de vijand */}
        <TextInput
          onChangeText={text => setEnemyAttackCode(text)}
          value={enemyAttackCode}
          style={{ backgroundColor: 'white' }}
        />
        <Button
          onPress={() =>
            sendAttackMutation.mutate({
              attackCode: enemyAttackCode,
            })
          }
          title="Attack"
          color={stratego.self.teamId === 'red' ? 'red' : 'blue'}
        />

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
    top: 0,
    marginTop: '1%',
  },
  CaptainIconContainer: {
    position: 'absolute',
    top: 0,
    marginTop: '10%',
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
    marginTop: '25%',
  },
  roleCardPickerContainer: {
    rowGap: 10,
    marginTop: 20,
  },
});
