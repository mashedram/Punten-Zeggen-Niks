import { useTRPC } from '@/api/query';
import { PlayerRole } from '@/components/Spelersrollen/PlayerRole';
import { CartStackTracker } from '@/components/ui/CartStackTracker';
import { PowerUpPopUp } from '@/components/ui/PowerUpPopUp';
import { CardImages } from '@/constants/CardImages';
import {
  InitalizationFailureReason,
  useStratego,
} from '@/hooks/game/useStratego';
import { useLobby } from '@/hooks/useLobby';
import { Picker } from '@react-native-picker/picker';
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

export default function Game() {
  const lobby = useLobby();
  const trpc = useTRPC();
  const stratego = useStratego(lobby);

  const [attackCode, setAttackCode] = useState('');

  const attackMutation = useMutation(trpc.stratego.attack.mutationOptions({}));

  const [isPowerCardOpen, setPowerCardOpen] = React.useState(false);
  const [selectedName, setSelectedName] = React.useState('Kies een speler');
  const namen = ['Bas', 'Jan', 'Oscar', 'Mark'];
  const [selectedRang, setSelectedRang] = React.useState('Kies een rang');
  const rangen = ['Generaal', 'Verkenner', 'Sergeant', 'Bom'];
  const [PowerupsIndex, setPowerupsIndex] = React.useState<
    number | undefined
  >();
  const [ingezettePowerupIndex, setIngezettePowerupIndex] = React.useState<
    number | null
  >(null);

  const powerups = [
    {
      id: 'vergrootglas',
      image: require('@/assets/images/Vergrootglas.jpg'),
      name: 'Vergrootglas',
      description: 'Onthul alle power-ups van de spelers in de omgeving.',
    },
    {
      id: 'bomvest',
      image: require('@/assets/images/Bomvest.jpg'),
      name: 'Bomvest',
      description: 'Bescherm jezelf tegen bommen voor 1 beurt.',
    },
    {
      id: 'spion',
      image: require('@/assets/images/SpionP.jpg'),
      name: 'Spion',
      description:
        'Versla elke rang en niet alleen rang 10, uitzondering van de bom.',
    },
  ];

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

  return (
    <SafeAreaView style={styles.backgroundView}>
      <>
        <View style={styles.CardStackTrackerContainer}>
          <CartStackTracker />
        </View>
        <View style={styles.CaptainIconContainer}>
          <Svg
            style={styles.CaptainEllipse}
            width={20}
            height={20}
            viewBox="0 0 20 20"
            fill="none">
            <Circle cx={10} cy={10} r={10} fill="#FF2424" />
          </Svg>
          <Text style={styles.CaptainIcon}>🎖</Text>
          <Text style={styles.CaptainUitroepteken}>!</Text>
        </View>

        <View style={styles.BattleLogButtonContainer}>
          <View style={styles.BattlelogButton}>
            <Text style={styles.BattleLogButtonArrow}>{'➔'} </Text>
          </View>
        </View>

        {(false && (
          <View style={styles.SelectScreenContainer}>
            <Picker
              style={styles.SelectFieldContainer}
              selectedValue={selectedName}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedName(itemValue)
              }>
              {namen.map(naam => (
                <Picker.Item key={naam} label={naam} value={naam} />
              ))}
            </Picker>

            <Picker
              style={styles.SelectFieldContainer}
              selectedValue={selectedRang}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedRang(itemValue)
              }>
              {rangen.map(rang => (
                <Picker.Item key={rang} label={rang} value={rang} />
              ))}
            </Picker>

            <Image
              source={require('@/assets/images/Generaal.png')}
              style={styles.SpelerCardSelect}></Image>
            <View style={styles.ConfirmButtom}>
              <Text
                style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
                Confirm
              </Text>
            </View>
          </View>
        )) || (
          <PlayerRole
            actie={selectedRang}
            image={CardImages[selectedRang]}
            code={selectedRang.toUpperCase()}
          />
        )}
        <View style={styles.PopUpContainer}>
          {PowerupsIndex !== undefined && (
            <PowerUpPopUp
              name={powerups[PowerupsIndex].name}
              description={powerups[PowerupsIndex].description}
              image={powerups[PowerupsIndex].image}
              onDelete={() => setPowerupsIndex(undefined)}
              onInzet={() => {
                setIngezettePowerupIndex(PowerupsIndex);
                setPowerupsIndex(undefined);
              }}
            />
          )}
        </View>
        <>
          <TextInput
            onChangeText={text => setAttackCode(text)}
            value={attackCode}
            style={{ backgroundColor: 'white' }}
          />
          <Button
            onPress={() =>
              attackMutation.mutate({ token: lobby.getToken(), attackCode })
            }
            title="Attack"
          />
        </>
        <Pressable
          style={{
            transform: [{ translateY: isPowerCardOpen ? '5%' : '80%' }],
            ...styles.PowerupBarContainer,
          }}
          onPress={() => setPowerCardOpen(!isPowerCardOpen)}>
          <View style={styles.PowerCardTitleContainer}>
            <Text
              style={{
                transform: [{ rotate: isPowerCardOpen ? '90deg' : '-90deg' }],
                ...styles.PowerupArrow,
              }}>
              ➔
            </Text>
            <Text style={styles.PowerupsTekst}>Power-ups</Text>
          </View>
          <View style={styles.PowerupCardContainer}>
            {powerups.map((powerup, index) => (
              <Pressable
                key={powerup.id}
                style={[
                  styles.PowerupPressable,
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
                <Image source={powerup.image} style={styles.PowerupCard} />
              </Pressable>
            ))}
          </View>
        </Pressable>
      </>
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
    margin: -1.2,
    overflow: 'hidden',
  },
  SpelerCard: {
    position: 'relative',
    flexShrink: 0,
    width: '70%',
    height: '41%',
    borderRadius: 12,
    marginBottom: 60,
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
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
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
  CaptainUitroepteken: {
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
  PowerupBarContainer: {
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
  PowerupArrow: {
    color: 'rgba(255, 255, 255, 1)',
    fontFamily: 'Inter',
    fontSize: 24,
    fontWeight: 400,
    transitionDuration: '0.3s',
  },
  PowerupsTekst: {
    color: 'rgba(255, 255, 255, 1)',
    fontFamily: 'Inter',
    fontSize: 24,
    fontWeight: 400,
  },
  PowerupCardContainer: {
    height: '80%',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  PowerupPressable: {
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
    position: 'relative',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    rowGap: 8,
    width: '80%',
    height: '40%',
    marginBottom: 240,
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
