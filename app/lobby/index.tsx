import { SettingsButton } from '@/components/lobby_host/SettingsButton';
import { ThemedText } from '@/components/ThemedText';
import { useLobby } from '@/hooks/useLobby';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Image,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { StyleSheet } from 'react-native';
import { useState } from 'react';
import { useEffect } from 'react';
import { QrButton } from '@/components/lobby_host/QrButton';

export default function LobbyPage() {
  const lobby = useLobby();
  const router = useRouter();
  const activeLobby = lobby.get();

  const handlePress = () => {
    Alert.alert('Je hebt op de afbeelding gedrukt!');
  };

  type Item = {
    id: number;
    name: string;
    host: boolean;
  };

  const [items, setItems] = useState<Item[]>([
    { id: 1, name: 'naam', host: true },
  ]);

  if (!activeLobby) {
    return (
      <View>
        <ThemedText>Not in a lobby</ThemedText>
        <Link href="/">
          <ThemedText type="link">Go Home</ThemedText>
        </Link>
      </View>
    );
  }

  return (
    <SafeAreaView style={stylesheet.BackgroundContainer}>
      <View style={stylesheet.CodeContainer}>
        <View style={stylesheet.QrButton}>
          <QrButton />
        </View>
        <Text style={stylesheet.Cijfercode}>{lobby.get()?.code}</Text>
      </View>

      <View style={stylesheet.StrategoContainer}>
        <TouchableOpacity onPress={handlePress}>
          <Image
            source={require('@/assets/images/stratego.png')}
            style={stylesheet.StrategoImage}
          />
        </TouchableOpacity>
      </View>

      <View style={stylesheet.SpelerlijstContainer}>
        <View style={stylesheet.list}>
          <View style={stylesheet.NaamBox}>
            {items.map(item => (
              <>
                <Text
                  key={item.id}
                  style={[stylesheet.NaamTekst, { marginBottom: 10 }]}>
                  {item.name}
                </Text>
                {item.host && (
                  <ImageBackground
                    style={stylesheet.CrownImage}
                    source={require('@/assets/images/CrownImage.png')}
                  />
                )}
              </>
            ))}
          </View>
        </View>
        <View style={stylesheet.check} />
        <View style={stylesheet.settingsAndPlayers}>
          <SettingsButton />
          <Text style={stylesheet.title}>
            Players: {activeLobby.players.length}/8
          </Text>
        </View>
      </View>

      <SafeAreaView>
        {activeLobby.players.map(player => (
          <View key={player.id}>
            <ThemedText>Player: {player.id}</ThemedText>
          </View>
        ))}
      </SafeAreaView>

      <View style={stylesheet.bottomCard}>
        <TouchableOpacity style={stylesheet.PlayButtonContainer}>
          <Text style={stylesheet.PlayText}>Start</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={stylesheet.ReturnButtonContainer}
          onPress={() => {
            lobby.leave();
            router.navigate('/');
          }}>
          <Text style={stylesheet.PlayText}>Return</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const stylesheet = StyleSheet.create({
  BackgroundContainer: {
    position: 'relative',
    backgroundColor: 'rgba(92, 163, 194, 1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },

  bottomCard: {
    width: '28%',
    top: 30,
    backgroundColor: 'white',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: 'center',
  },

  CodeContainer: {
    marginVertical: 10,
    position: 'relative',
    flexShrink: 0,
    height: 44,
    width: 394,
    backgroundColor: 'rgba(71, 72, 73, 1)',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderRadius: 8,
  },

  Cijfercode: {
    position: 'relative',
    marginRight: 125,
    flexShrink: 0,
    textAlign: 'left',
    color: 'rgba(255, 255, 255, 1)',
    fontFamily: 'Inter',
    fontSize: 36,
    fontWeight: 400,
  },

  PlayButtonContainer: {
    position: 'relative',
    flexShrink: 0,
    height: 45,
    width: '100%',
    paddingTop: 4,
    paddingBottom: 3,
    backgroundColor: 'rgba(112, 194, 92, 1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 10,
    paddingHorizontal: 59,
    borderRadius: 12,
    marginVertical: 10,
  },

  ReturnButtonContainer: {
    width: '100%',
    height: 45,
    position: 'relative',
    flexShrink: 0,
    flexGrow: 1,
    paddingTop: 4,
    paddingBottom: 3,
    backgroundColor: 'rgba(71, 72, 73, 1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 10,
    paddingHorizontal: 59,
    borderRadius: 15,
  },

  PlayText: {
    position: 'relative',
    flexShrink: 0,
    textAlign: 'left',
    color: 'rgba(255, 255, 255, 1)',
    fontSize: 16,
    fontWeight: 700,
  },

  NaamTekst: {
    color: 'rgb(255, 255, 255)',
    position: 'relative',
    flexShrink: 0,
    marginTop: 10,
    height: 35,
    width: 340,
    backgroundColor: 'rgb(179,179,179)',
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 8,
    borderRadius: 20,
  },

  SpelerlijstContainer: {
    position: 'relative',
    flexShrink: 0,
    height: 314,
    width: 359,
    paddingTop: 17,
    paddingBottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: 0,
    paddingHorizontal: 0,
    borderRadius: 8,
  },

  list: {
    position: 'absolute',
    flexShrink: 0,
    height: 274,
    width: 344,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    rowGap: 2,
    paddingHorizontal: 4,
    paddingVertical: 0,
  },

  NaamBox: {
    position: 'absolute',
    flexShrink: 0,
    top: 12,
    left: -4,
    width: 340,
    shadowColor: 'rgba(255, 255, 255, 0.25)',
    shadowRadius: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 8,
    borderRadius: 20,
  },

  logo: {
    position: 'relative',
    flexShrink: 0,
  },

  CrownImage: {
    flexShrink: 0,
    marginTop: -25,
    top: -13,
    left: -129,
    width: 20,
    height: 20,
    color: 'rgb(255, 255, 255)',
  },

  check: {
    position: 'absolute',
    flexShrink: 0,
    top: 32,
    height: 40,
    left: 23,
    width: 40,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    rowGap: 0,
  },
  settingsAndPlayers: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 190,
    marginTop: -275,
  },
  title: {
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 1)',
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: '400',
    marginLeft: 10,
  },

  StrategoContainer: {
    display: 'flex',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: 120,
    height: 120,
    borderStyle: 'solid',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 4,
    borderWidth: 4,
    borderColor: 'rgba(0, 0, 0, 1)',
    borderRadius: 36,
    marginVertical: 10,
  },

  StrategoImage: {
    position: 'relative',
    flexGrow: 1,
    width: 100,
    height: 100,
    borderRadius: 20,
  },
  QrButton: {
    marginRight: 10,
  },
});
