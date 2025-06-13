import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useState } from 'react';
import { Button, Modal, View, Text } from 'react-native';

export const AttackQrCode = () => {
  const [scannerVisible, setScannerVisible] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    setScannerVisible(false);
    alert(`QR code scanned: ${data}`);
    console.log(`scanned qr code with data: ${data}`);
  };

  return (
    <>
      <Button title="Scan QR Code" onPress={() => setScannerVisible(true)} />
      <Modal visible={scannerVisible} animationType="slide">
        <View style={{ flex: 1 }}>
          {!permission?.granted ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text>Camera permission is required.</Text>
              <Button title="Grant Permission" onPress={requestPermission} />
              <Button title="Close" onPress={() => setScannerVisible(false)} />
            </View>
          ) : (
            <CameraView
              style={{ flex: 1 }}
              barcodeScannerSettings={{
                barcodeTypes: ['qr'],
              }}
              onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}>
              <View
                style={{
                  position: 'absolute',
                  bottom: 40,
                  left: 0,
                  right: 0,
                  alignItems: 'center',
                }}>
                <Button
                  title="Close"
                  onPress={() => setScannerVisible(false)}
                />
              </View>
            </CameraView>
          )}
        </View>
      </Modal>
    </>
  );
};
