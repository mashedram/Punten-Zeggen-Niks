import { TeamColors } from '@/constants/Colors';
import { useStrategoUnsafe } from '@/hooks/game/useStrategoUnsafe';
import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface AttackQrCodeProps {
  onQrScan: (qrAttackCode: string) => void;
}

const AttackScanner = ({
  onScan,
  currentTeamColor,
  onExit,
}: {
  onScan: (data: { data: string }) => void;
  currentTeamColor: string;
  onExit: () => void;
}) => {
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission?.granted) {
    return (
      <View style={styles.cameraPermission}>
        <Text>Camera toestemming is vereist.</Text>
        <TouchableOpacity
          style={[
            styles.permissionButtonContainer,
            { backgroundColor: currentTeamColor },
          ]}
          onPress={requestPermission}>
          <Text style={styles.buttonText}>Toestemming geven</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.permissionButtonContainer,
            { backgroundColor: currentTeamColor },
          ]}
          onPress={() => onExit()}>
          <Text style={styles.buttonText}>Sluiten</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <CameraView
      style={styles.cameraView}
      barcodeScannerSettings={{
        barcodeTypes: ['qr'],
      }}
      onBarcodeScanned={onScan}
      autofocus="on">
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[
            styles.permissionButtonContainer,
            { backgroundColor: currentTeamColor },
          ]}
          onPress={() => onExit()}>
          <Text style={styles.buttonText}>Sluiten</Text>
        </TouchableOpacity>
      </View>
    </CameraView>
  );
};

export const AttackQrCode: React.FC<AttackQrCodeProps> = ({ onQrScan }) => {
  const stratego = useStrategoUnsafe();

  const [scannerVisible, setScannerVisible] = useState(false);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScannerVisible(false);
    onQrScan(data);
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
          <AttackScanner
            onScan={handleBarCodeScanned}
            currentTeamColor={currentTeamColor}
            onExit={() => setScannerVisible(false)}
          />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});
