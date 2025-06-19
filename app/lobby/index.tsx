import { SettingsButton } from '@/components/lobby_host/SettingsButton';
import { useLobby } from '@/hooks/useLobby';
import { ExternalPathString, Redirect, useRouter } from 'expo-router';
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  Platform,
  StatusBar,
  ScrollView,
} from 'react-native';
import { StyleSheet } from 'react-native';
import { QrButton } from '@/components/lobby_host/QrButton';
import { StrategoGameId } from '@/api/managers/stratego/StrategoGame';

export default function LobbyPage() {
  const lobby = useLobby();
  const router = useRouter();

  if (lobby.loading) {
    return <Text>Loading...</Text>;
  }

  if (!lobby.inLobby) {
    return <Redirect href="/" />;
  }

  const activeLobby = lobby.get();
  console.debug('activeLobby', activeLobby);

  if (!activeLobby) {
    return <Redirect href="/" />;
  }

  if (activeLobby.game) {
    return (
      <Redirect href={`/${activeLobby.game.gameId}` as ExternalPathString} />
    );
  }

  const canStart = activeLobby.self.isAdmin;

  return (
    <View style={stylesheet.BackgroundContainer}>
      <View style={stylesheet.CodeContainer}>
        <View style={stylesheet.CodeBox}>
          <View style={stylesheet.QrButton}>
            <QrButton />
          </View>
          <Text style={stylesheet.Cijfercode}>{lobby.get()?.code}</Text>
        </View>
      </View>

      <View style={stylesheet.StrategoContainer}>
        <Image
          source={require('@/assets/images/stratego.png')}
          style={stylesheet.StrategoImage}
        />
      </View>

      <View style={stylesheet.SpelerlijstContainer}>
        <ScrollView
          style={stylesheet.list}
          contentContainerStyle={stylesheet.listContentContainer}>
          <View style={stylesheet.NaamBox}>
            {activeLobby.players.map(player => {
              console.log(player.name);
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
                      source={require('@/assets/images/CrownImage.png')}
                    />
                  )}
                  {player.isLeader && (
                    <ImageBackground
                      style={stylesheet.LeaderImage}
                      source={require('@/assets/images/CrownImage.png')}
                    />
                  )}
                </View>
              );
            })}
          </View>
        </ScrollView>

        <View style={stylesheet.check} />
        <View style={stylesheet.settingsAndPlayers}>
          <SettingsButton />
          <Text style={stylesheet.title}>
            Spelers: {activeLobby.players.length}
          </Text>
        </View>
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
    </View>
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
    flex: 0,
    justifyContent: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 2,
    margin: -1.2,
  },

  bottomCard: {
    width: '100%',
    height: '20%',
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: 'center',
    marginTop: 595,
  },

  CodeContainer: {
    position: 'absolute',
    width: '100%',
    height: '130%',
    marginTop: 50,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    left: 0,
    marginBottom: 680,
  },

  CodeBox: {
    position: 'relative',
    flexShrink: 0,
    height: '5%',
    width: '98%',
    backgroundColor: 'rgba(71, 72, 73, 1)',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderRadius: 8,
    margin: '1%',
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
    position: 'absolute',
    alignSelf: 'flex-end',
    width: 20,
    height: 20,
    color: 'rgb(255, 255, 255)',
    margin: 20,
  },

  SpelerlijstContainer: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexShrink: 0,
    height: '43%',
    width: '90%',
    paddingTop: 18,
    paddingBottom: 0,
    marginTop: 20,
    marginBottom: -40,
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
    position: 'absolute',
    flexShrink: 0,
    height: '90%',
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
    paddingHorizontal: 20,
    marginBottom: 35,
    marginRight: 50,
    marginTop: -240,
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
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: '38%',
    height: '22%',
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
    marginBottom: 420,
  },
  StrategoImage: {
    position: 'relative',
    flexGrow: 1,
    width: '88%',
    height: '890%',
    marginTop: 20,
    marginBottom: 20,
    resizeMode: 'contain',
    borderRadius: 300,
  },
  QrButton: {
    marginRight: 10,
  },
});
