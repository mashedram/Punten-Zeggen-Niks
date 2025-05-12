import { SettingsButton } from '@/components/lobby_host/SettingsButton';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useLobby } from '@/hooks/useLobby';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import {
  Button,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Alert,
  Image,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { StyleSheet } from 'react-native';

export default function LobbyPage() {
  const lobby = useLobby();
  const router = useRouter();
  const activeLobby = lobby.get();

  const handlePress = () => {
    Alert.alert('Je hebt op de afbeelding gedrukt!');
  };
  const items: { id: number; name: string }[] = [{ id: 1, name: 'naam' }];

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
      <View style={stylesheet.Code}>
        <Text style={stylesheet.myVar}>{lobby.get()?.code}</Text>
      </View>

      <View style={stylesheet.rectangle35Container}>
        <TouchableOpacity onPress={handlePress}>
          <Image
            source={{
              uri: 'https://s1.mzstatic.com/us/r1000/083/Purple/v4/3c/e0/1b/3ce01b78-4114-f175-b78a-812ea1b32c86/mzl.ucksqmgs.png',
            }}
            style={stylesheet.strategoIContainer}
          />
        </TouchableOpacity>
      </View>

      <View style={stylesheet.spelerlijstContainer}>
        <View style={stylesheet.titlebar} />
        <View style={stylesheet.list}>
          <View style={stylesheet.itembox}>
            {items.map(item => (
              <Text
                key={item.id}
                style={[stylesheet.NaamContainer, { marginBottom: 10 }]}>
                {item.name}
              </Text>
            ))}
          </View>

          <ImageBackground
            style={
              stylesheet.crownicondesignontransparentbackgroundPNGremovebgpreview2
            }
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/57/57113.png',
            }}
          />
        </View>
        <View style={stylesheet.check} />
        <Text style={stylesheet.title}>
          Players: {activeLobby.players.length}/8
        </Text>
      </View>

      <SafeAreaView>
        {activeLobby.players.map(player => (
          <View key={player.id}>
            <ThemedText>Player: {player.id}</ThemedText>
          </View>
        ))}
      </SafeAreaView>

      <View style={stylesheet.bottomCard}>
        <TouchableOpacity style={stylesheet.Container}>
          <Text style={stylesheet.Play}>Play</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={stylesheet.Container2}
          onPress={() => {
            lobby.leave();
            router.navigate('/');
          }}>
          <Text style={stylesheet.Play}>Return</Text>
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

  Code: {
    marginVertical: 10,
    position: 'relative',
    flexShrink: 0,
    height: 44,
    width: 394,
    backgroundColor: 'rgba(71, 72, 73, 1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 10,
    borderRadius: 8,
  },

  myVar: {
    position: 'relative',
    flexShrink: 0,
    textAlign: 'left',
    color: 'rgba(255, 255, 255, 1)',
    fontFamily: 'Inter',
    fontSize: 36,
    fontWeight: 400,
  },

  Container: {
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

  Container2: {
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

  Play: {
    position: 'relative',
    flexShrink: 0,
    textAlign: 'left',
    color: 'rgba(255, 255, 255, 1)',
    fontSize: 16,
    fontWeight: 700,
  },

  NaamContainer: {
    color: 'rgb(255, 255, 255)',
    position: 'relative',
    flexShrink: 0,
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

  spelerlijstContainer: {
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

  titlebar: {
    position: 'relative',
    flexShrink: 0,
    width: 357,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    rowGap: 10,
    paddingHorizontal: 12,
    paddingVertical: 0,
  },

  group43: {
    position: 'absolute',
    flexShrink: 0,
    top: 53,
    height: 274,
    left: 13,
    width: 344,
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

  itembox: {
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

  crownicondesignontransparentbackgroundPNGremovebgpreview2: {
    position: 'absolute',
    flexShrink: 0,
    top: 18,
    left: 17,
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

  title: {
    position: 'absolute',
    flexShrink: 0,
    top: 17,
    left: 135,
    width: 214,
    height: 24,
    textAlign: 'left',
    color: 'rgba(0, 0, 0, 1)',
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: 400,
  },

  rectangle35Container: {
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

  strategoIContainer: {
    position: 'relative',
    flexGrow: 1,
    width: 100,
    height: 100,
    borderRadius: 20,
  },
});
