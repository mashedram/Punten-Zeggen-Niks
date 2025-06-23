import { useLobby } from '@/hooks/useLobby';
import { ExternalPathString, Redirect, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  Platform,
  StatusBar,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { StyleSheet } from 'react-native';
import { StrategoGameId } from '@/api/managers/stratego/StrategoGame';
import { FontAwesome } from '@expo/vector-icons';

import CrownImage from '@/assets/images/CrownImage.png';
import StrategoImage from '@/assets/images/stratego.png';
import { LobbyQrCodeOverlay } from '@/components/ui/LobbyQrCodeOverlay';

export default function LobbyPage() {
  const lobby = useLobby();
  const router = useRouter();
  const [qrCodeVisible, setQrCodeVisible] = useState(false);

  if (lobby.loading) {
    return <Text>Loading...</Text>;
  }

  if (!lobby.inLobby) {
    return <Redirect href="/" />;
  }

  const activeLobby = lobby.get();

  if (!activeLobby) {
    return <Redirect href="/" />;
  }

  if (activeLobby.game) {
    return <Redirect href={`/${activeLobby.game.gameId}`} />;
  }

  const canStart = activeLobby.self.isAdmin;

  return (
    <SafeAreaView style={stylesheet.BackgroundContainer}>
      {qrCodeVisible && (
        <LobbyQrCodeOverlay
          code={activeLobby.code}
          close={() => setQrCodeVisible(false)}
        />
      )}
      <View style={stylesheet.CodeContainer}>
        <View style={stylesheet.CodeBox}>
          <TouchableOpacity
            style={stylesheet.QrButton}
            onPress={() => setQrCodeVisible(true)}>
            <Image
              source={{
                uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1024px-QR_code_for_mobile_English_Wikipedia.svg.png',
              }}
              style={stylesheet.QrButtonImage}
            />
          </TouchableOpacity>
          <Text style={stylesheet.Cijfercode}>{lobby.get()?.code}</Text>
        </View>
      </View>

      <View style={stylesheet.StrategoContainer}>
        <View style={stylesheet.StrategoBox}>
          <Image source={StrategoImage} style={stylesheet.StrategoImage} />
        </View>
      </View>

      <View style={stylesheet.SpelerlijstContainer}>
        <View style={stylesheet.settingsAndPlayers}>
          <Text style={stylesheet.title}>
            Spelers: {activeLobby.players.length}
          </Text>
        </View>

        <ScrollView
          style={stylesheet.list}
          contentContainerStyle={stylesheet.listContentContainer}>
          <View style={stylesheet.NaamBox}>
            {activeLobby.players.map(player => {
              return (
                <View style={[stylesheet.SpelerNaamEntity]}>
                  <Text
                    key={player.id}
                    style={[stylesheet.NaamTekst]}
                    onPress={() => {
                      lobby.setLeader(player.id, !player.isLeader);
                    }}>
                    {player.name}
                  </Text>
                  {player.isAdmin && (
                    <ImageBackground
                      style={stylesheet.CrownImage}
                      source={CrownImage}
                    />
                  )}
                  {player.isLeader && (
                    <Text style={stylesheet.LeaderImage}>
                      <FontAwesome name={'flag'} size={20} />
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>

      <View style={stylesheet.bottomCard}>
        <TouchableOpacity
          style={
            canStart
              ? stylesheet.PlayButtonContainer
              : stylesheet.PlayButtonContainerDisabled
          }
          onPress={() => {
            if (activeLobby.game) return;
            lobby.setGame(StrategoGameId);
          }}
          disabled={!canStart}>
          <Text style={stylesheet.PlayText}>Start</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={stylesheet.ReturnButtonContainer}
          onPress={() => {
            lobby.leave();
            router.navigate('/');
          }}>
          <Text style={stylesheet.PlayText}>Terug</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const stylesheet = StyleSheet.create({
  BackgroundContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(92, 163, 194, 1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 2,
  },

  bottomContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  bottomCard: {
    width: '100%',
    height: '20%',
    display: 'flex',
    alignSelf: 'flex-end',
    flexDirection: 'column',
    backgroundColor: 'white',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: 'center',
  },

  CodeContainer: {
    width: '100%',
    height: '8%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  CodeBox: {
    height: '100%',
    width: '98%',
    backgroundColor: 'rgba(71, 72, 73, 1)',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    borderRadius: 8,
    marginTop: 5,
  },

  Cijfercode: {
    flexShrink: 0,
    textAlign: 'left',
    color: 'rgba(255, 255, 255, 1)',
    fontFamily: 'Inter',
    fontSize: 36,
    fontWeight: 400,
  },

  QrButton: {
    height: '80%',
    aspectRatio: 1,

    position: 'absolute',
    left: '1%',

    backgroundColor: 'white',
    borderRadius: 8,
  },

  QrButtonImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },

  PlayButtonContainer: {
    position: 'relative',
    flexShrink: 0,
    height: '40%',
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

  PlayButtonContainerDisabled: {
    position: 'relative',
    flexShrink: 0,
    height: '40%',
    width: '100%',
    paddingTop: 4,
    paddingBottom: 3,
    backgroundColor: 'rgb(82, 82, 82)',
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
    height: '40%',
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
  SpelerNaamEntity: {
    color: 'rgb(255, 255, 255)',
    position: 'relative',
    marginTop: 10,
    width: '100%',
    height: 40,
    backgroundColor: 'rgb(179,179,179)',
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
    borderRadius: 20,
  },
  NaamTekst: {
    position: 'absolute',
    fontSize: 18,
  },
  CrownImage: {
    position: 'absolute',
    alignSelf: 'flex-start',
    width: 20,
    height: 20,
    color: 'rgb(255, 255, 255)',
    margin: 20,
  },
  LeaderImage: {
    alignSelf: 'flex-end',
    width: 20,
    height: 20,
    color: 'rgb(255, 255, 255)',
    fontWeight: 'bold',
    margin: 20,
  },

  SpelerlijstContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexShrink: 0,
    height: '45%',
    width: '90%',
    paddingTop: 18,
    paddingBottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 4,
    justifyContent: 'center',
    rowGap: 0,
    paddingHorizontal: 0,
    borderRadius: 8,
  },
  list: {
    height: '95%',
    width: '100%',
  },
  listContentContainer: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    display: 'flex',
    position: 'relative',
    rowGap: 2,
    paddingHorizontal: 4,
    paddingVertical: 0,
  },
  NaamBox: {
    position: 'absolute',
    flexShrink: 0,
    top: 12,
    marginLeft: -1,
    width: '95%',
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
    justifyContent: 'center',
    width: '100%',
  },
  title: {
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 1)',
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: '400',
  },
  StrategoContainer: {
    width: '100%',
    height: '20%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  StrategoBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    aspectRatio: 1,
    height: '100%',
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
  },
  StrategoImage: {
    position: 'relative',
    flexGrow: 1,
    width: '100%',
    height: 'auto',
    marginTop: 20,
    marginBottom: 20,
    resizeMode: 'contain',
    borderRadius: 300,
  },
});
