import { useTRPC } from '@/api/query';
import { PowerUpPopUp } from '@/components/ui/PowerUpPopUp';
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
  Image,
  StyleSheet,
  View,
  Pressable,
  Platform,
  StatusBar,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { PowerUpList } from '@/constants/PowerUpList';
import { GameState } from '@/constants/GameState';
import { CardCountBar } from '@/components/ui/CardCountBar';
import { RoleCardPicker } from '@/components/ui/RoleCardPicker';

export default function Game() {
  const lobby = useLobby();
  const trpc = useTRPC();
  const stratego = useStratego(lobby);
  const sendAttackMutation = useMutation(
    trpc.stratego.attack.mutationOptions({}),
  );

  const [enemyAttackCode, setEnemyAttackCode] = useState('');
  const [isPowerCardOpen, setPowerCardOpen] = React.useState(false);
  const [PowerUpsIndex, setPowerupsIndex] = React.useState<
    number | undefined
  >();
  const [ingezettePowerupIndex, setIngezettePowerupIndex] = React.useState<
    number | null
  >(null);

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

  const availablePlayers = stratego.otherPlayers.filter(
    p => p.hasRoleCard === false && p.teamId === stratego.self.teamId,
  ).length;

  return (
    <SafeAreaView style={styles.BackgroundView}>
      <View style={styles.CardStackTrackerContainer}>
        <CardCountBar blueCardCount={60} redCardCount={30} />
      </View>

      {(stratego.self.isTeamLeader && (
        <View style={styles.CaptainIconContainer}>
          {availablePlayers > 0 && (
            <>
              <Svg
                style={styles.CaptainEllipse}
                width={20}
                height={20}
                viewBox="0 0 20 20"
                fill="none">
                <Circle cx={10} cy={10} r={10} fill="#FF2424" />
              </Svg>
              <Text style={styles.CaptainExclamationMark}>
                {availablePlayers}
              </Text>
            </>
          )}
          <Text style={styles.CaptainIcon}>🎖</Text>
        </View>
      )) || <View style={styles.CaptainIconContainer}></View>}

      <View style={styles.BattleLogButtonContainer}>
        <View style={styles.BattlelogButton}>
          <Text style={styles.BattleLogButtonArrow}>{'➔'} </Text>
        </View>
      </View>

      {(stratego.self.isTeamLeader && (
        <View style={styles.SelectScreenContainer}>
          <Image
            source={require('@/assets/images/Generaal.png')}
            style={styles.SpelerCardSelect}></Image>
          <RoleCardPicker />
        </View>
      )) || (
        <View style={styles.SelectScreenContainer}>
          <Image
            source={require('@/assets/images/Spion.png')}
            style={styles.SpelerCardSelect}></Image>
        </View>
      )}

      <View style={styles.PopUpContainer}>
        {PowerUpsIndex !== undefined && (
          <PowerUpPopUp
            name={PowerUpList[PowerUpsIndex].name}
            description={PowerUpList[PowerUpsIndex].description}
            image={PowerUpList[PowerUpsIndex].image}
            onDelete={() => setPowerupsIndex(undefined)}
            onInzet={() => {
              setIngezettePowerupIndex(PowerUpsIndex);
              setPowerupsIndex(undefined);
            }}
          />
        )}
      </View>

      {/* Gameloop test gedeelte kan later weg */}
      <View>
        {/* Welke rol heeft de speler */}
        <Text>
          {stratego.self.roleCard !== undefined
            ? `Jouw rol: ${stratego.self.roleCard}`
            : 'Je hebt nog geen rolkaart.'}
        </Text>

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
              token: lobby.getToken(),
              attackCode: enemyAttackCode,
            })
          }
          title="Attack"
          color={stratego.self.teamId === 'red' ? '#FF2424' : '#1E90FF'}
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

      <Pressable
        style={{
          transform: [{ translateY: isPowerCardOpen ? '5%' : '80%' }],
          ...styles.PowerUpBarContainer,
        }}
        onPress={() => setPowerCardOpen(!isPowerCardOpen)}>
        <View style={styles.PowerCardTitleContainer}>
          <Text
            style={{
              transform: [{ rotate: isPowerCardOpen ? '90deg' : '-90deg' }],
              ...styles.PowerUpArrow,
            }}>
            ➔
          </Text>
          <Text style={styles.PowerUpTekst}>Power-ups</Text>
        </View>
        <View style={styles.PowerUpCardContainer}>
          {PowerUpList.map((powerUp, index) => (
            <Pressable
              key={powerUp.id}
              style={[
                styles.PowerUpPressable,
                index === ingezettePowerupIndex && {
                  borderWidth: 6,
                  borderColor: '#70C25C',
                  borderRadius: 16,
                  shadowColor: 'rgba(0, 0, 0, 0.25)',
                  shadowOffset: { width: 0, height: 8 },
                  shadowRadius: 8,
                  shadowOpacity: 8,
                },
              ]}
              onPress={event => {
                event.stopPropagation();
                if (isPowerCardOpen) setPowerupsIndex(index);
              }}>
              <Image source={powerUp.image} style={styles.PowerupCard} />
            </Pressable>
          ))}
        </View>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  BackgroundView: {
    position: 'relative',
    backgroundColor: 'rgba(92, 163, 194, 1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    margin: -1.2,
    overflow: 'hidden',
  },
  SpelerCard: {
    width: '70%',
    height: '40%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  SpelerCardSelect: {
    position: 'relative',
    flexShrink: 0,
    width: '80%',
    height: '90%',
    borderRadius: 12,
    marginTop: 10,
    marginLeft: 30,
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
    transform: [{ rotate: '180deg' }],
  },
  CardStackTrackerContainer: {
    position: 'absolute',
    width: '100%',
    top: 0,
    marginTop: 10,
  },
  PopUpContainer: {
    width: '90%',
    height: '35%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
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
  CaptainEllipse: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 36, 36, 1)',
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    marginRight: 55,
    marginTop: -45,
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
  CaptainExclamationMark: {
    position: 'absolute',
    width: 20,
    height: 20,
    textAlign: 'left',
    color: 'rgba(255, 255, 255, 1)',
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '700',
    marginTop: -40,
    marginLeft: -39,
  },
  PowerUpBarContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '35%',
    backgroundColor: 'rgba(194, 123, 92, 1)',
    borderRadius: 36,
    transitionDuration: '0.3s',
  },
  PowerCardTitleContainer: {
    height: '20%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  PowerUpArrow: {
    color: 'rgba(255, 255, 255, 1)',
    fontFamily: 'Inter',
    fontSize: 24,
    fontWeight: 400,
    transitionDuration: '0.3s',
  },
  PowerUpTekst: {
    color: 'rgba(255, 255, 255, 1)',
    fontFamily: 'Inter',
    fontSize: 24,
    fontWeight: 400,
  },
  PowerUpCardContainer: {
    height: '80%',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  PowerUpPressable: {
    height: '90%',
    width: '30%',
  },
  PowerupCard: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'black',
  },
  SelectScreenContainer: {
    // position: 'relative',
    // flexShrink: 0,
    // display: 'flex',
    // flexDirection: 'column',
    // alignItems: 'flex-start',
    rowGap: 8,
    width: '80%',
    height: '40%',
    marginBottom: 150,
  },
  SelectFieldContainer: {
    width: '70%',
    height: '10%',
    marginTop: 10,
    marginLeft: 50,
    color: 'black',
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
  },
  ConfirmButtom: {
    position: 'relative',
    flexShrink: 0,
    width: '90%',
    height: '10%',
    backgroundColor: 'rgba(112, 194, 92, 1)',
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowRadius: 4,
    borderRadius: 12,
    marginTop: 50,
    marginLeft: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
