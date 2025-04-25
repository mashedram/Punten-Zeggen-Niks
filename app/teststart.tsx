import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function HomePage() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}></View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <View style={styles.profileBox} />
        <View style={styles.levelInfo}>
          <Text style={styles.levelNumber}>05</Text>
          <Text style={styles.levelLabel}>LEVEL</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
        </View>
        <Text style={styles.progressText}>133 / 200</Text>
      </View>

      {/* Bottom Card */}
      <View style={styles.bottomCard}>
        <TouchableOpacity style={styles.joinButton}>
          <Text style={styles.joinText}>JOIN ROOM</Text>
        </TouchableOpacity>

        <Text style={styles.menuOption}>CREATE LOBBY</Text>
        <Text style={styles.menuOption}>SETTINGS</Text>
        <Text style={styles.menuOption}>SUPPORT</Text>
      </View>

      {/* Footer Nav */}
      <View style={styles.footer}>
        {[...Array(4)].map((_, i) => (
          <View key={i} style={styles.footerIcon} />
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5CA3C2',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
    width: '50%', // pas aan op basis van percentage
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
  profileBox: {
    width: width * 0.4,
    maxWidth: 150,
    aspectRatio: 1,
    backgroundColor: '#D9D9D9',
    borderRadius: 100,
    elevation: 4,
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
  menuOption: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '700',
    color: '#665858',
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
});
