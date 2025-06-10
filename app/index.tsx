import { CreateButton } from '@/components/Home_page/CreateButton';
import { JoinButton } from '@/components/Home_page/JoinButton';
import { useLobby } from '@/hooks/useLobby';
import { Redirect } from 'expo-router';
import { Image } from 'react-native';

import {
  View,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';

export default function HomePage() {
  const lobby = useLobby();

  if (!lobby.loading && lobby.inLobby) {
    return <Redirect href="/lobby" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContent}>
        <Image
          source={require('../assets/images/Socket.png')}
          style={styles.profileImage}
        />
      </View>

      <View style={styles.bottomCard}>
        <JoinButton />
        <CreateButton />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5CA3C2',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    margin: -1.2,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  time: {
    fontSize: 17,
    fontWeight: '600',
    color: 'black',
  },
  statusIcons: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    backgroundColor: 'black',
    borderRadius: 10,
  },

  batteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  batteryBody: {
    width: 24,
    height: 12,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 3,
    justifyContent: 'center',
    padding: 1,
  },

  batteryLevel: {
    width: '50%',
    height: '100%',
    backgroundColor: 'black',
    borderRadius: 2,
  },

  batteryCap: {
    width: 2,
    height: 6,
    backgroundColor: 'black',
    marginLeft: 1,
    borderRadius: 1,
  },

  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  levelInfo: {
    alignItems: 'flex-start',
    width: '90%',
  },
  levelNumber: {
    color: 'white',
    fontSize: 40,
    fontWeight: '700',
  },
  levelLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  progressBar: {
    width: '90%',
    height: 6,
    backgroundColor: '#EEEEEE',
    borderRadius: 5,
    marginTop: 8,
  },
  progressFill: {
    width: '65%',
    height: '100%',
    backgroundColor: '#C27B5C',
    borderRadius: 5,
  },
  progressText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
    alignSelf: 'flex-end',
    marginRight: '5%',
    marginTop: 4,
  },
  bottomCard: {
    backgroundColor: 'white',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: 'center',
  },
  joinButton: {
    width: '100%',
    height: 45,
    backgroundColor: '#70C25C',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  joinText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  Text: {
    color: '#665858',
    marginTop: 16,
    fontWeight: '700',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'black',
    paddingVertical: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  footerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'white',
  },
  profileImage: {
    width: '80%',
    height: '80%',
    marginRight: 0,
    marginBottom: 50,
    resizeMode: 'contain',
    marginVertical: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
