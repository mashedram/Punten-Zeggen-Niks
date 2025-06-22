import { useMemo } from 'react';
import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const { width, height } = Dimensions.get('window');

export const LobbyQrCodeOverlay = ({
  code,
  close,
}: {
  code: string;
  close: () => void;
}) => {
  const remoteUrl = useMemo(() => {
    const baseUrl = process.env.EXPO_PUBLIC_SERVER_URL;
    if (!baseUrl) {
      throw new Error('EXPO_PUBLIC_SERVER_URL is not defined');
    }

    return `${baseUrl}/lobby/join?code=${code}`;
  }, [code]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>QR CODE</Text>

      <View style={styles.card}>
        <QRCode value={remoteUrl} size={Math.min(width * 0.8, 300)} />
      </View>

      <Pressable onPress={close}>
        <View style={styles.scanTextBox}>
          <Text style={styles.scanText}>Terug naar lobby</Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#5CA3C2',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    zIndex: 1000,
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
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    width: Math.min(width * 0.9, 350),
    height: Math.min(width * 0.9, 350),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    elevation: 5,
  },
  scanTextBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 80,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  scanText: {
    fontSize: width > 400 ? 17 : 14,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    height: height * 0.1,
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
  },
});
