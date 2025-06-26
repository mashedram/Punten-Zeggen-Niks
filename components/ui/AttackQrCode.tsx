import { TeamColors } from '@/constants/Colors';
import { useStrategoUnsafe } from '@/hooks/game/useStrategoUnsafe';
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Button,
} from 'react-native';
import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';

interface AttackQrCodeProps {
  onQrScan: (qrAttackCode: string) => void;
}

export const AttackQrCode: React.FC<AttackQrCodeProps> = ({ onQrScan }) => {
  const stratego = useStrategoUnsafe();

  const [scannerVisible, setScannerVisible] = useState(false);

  const handleBarCodeScanned = (data: IDetectedBarcode[]) => {
    setScannerVisible(false);

    const code = data[0].rawValue;
    onQrScan(code);
  };

  const currentTeamColor =
    stratego.self.teamId === 'red'
      ? TeamColors.red.color
      : TeamColors.blue.color;

  return (
    <>
      <TouchableOpacity
        style={[
          styles.permissionButtonContainer,
          { backgroundColor: currentTeamColor },
        ]}
        onPress={() => setScannerVisible(true)}>
        <Text style={styles.buttonText}>Scan QR Code</Text>
      </TouchableOpacity>
      <Modal visible={scannerVisible} animationType="slide">
        <View style={styles.container}>
          <Scanner
            allowMultiple={true}
            formats={['qr_code']}
            onScan={handleBarCodeScanned}
          />
          <View style={styles.buttonsContainer}>
            <Button
              color={currentTeamColor}
              title="Close"
              onPress={() => setScannerVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  permissionButtonContainer: {
    marginTop: 15,
    alignSelf: 'center',
    width: '70%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    borderRadius: 5,
  },
  buttonText: {
    fontWeight: 700,
    color: 'white',
  },
  cameraPermission: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraViewContainer: {},
  cameraView: {},
  buttonsContainer: {
    position: 'absolute',
    bottom: 0,

    width: '100%',
  },
});
