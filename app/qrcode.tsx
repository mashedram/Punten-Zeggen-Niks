import { QrCode } from '@/components/QrCode';
import { Link } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Qrcodev2() {
  return (
    <View style={styles.container}>
      {/* Achtergrondkleur */}
      <View style={styles.background} />

      {/* Titel */}
      <Text style={styles.title}>QR CODE</Text>

      {/* Witte kaart voor QR */}
      <View style={styles.card}>
        <QrCode code={'test'} int={512} />
      </View>

      {/* Scan tekst */}
      <Link href="/lobby">
        <View style={styles.scanTextBox}>
          <Text style={styles.scanText}>Terug naar lobby</Text>
        </View>
      </Link>

      {/* Onderaan navigatiebalk */}
      <View style={styles.bottomBar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5CA3C2',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 60,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#5CA3C2',
  },
  title: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  backButton: {
    position: 'absolute',
    top: 66,
    left: 16,
    padding: 8,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    width: 323,
    height: 323,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    elevation: 5,
  },
  qrImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  scanTextBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 24,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  scanText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    height: 100,
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
  },
});
