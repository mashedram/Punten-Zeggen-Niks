import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'react-native';

export const QrButton = () => {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.navigate('/qrcode')}>
      <Image
        source={{
          uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1024px-QR_code_for_mobile_English_Wikipedia.svg.png',
        }}
        style={styles.image}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(255, 252, 252)',
    borderRadius: 10,
    padding: 0.5,
    margin: 0.5,
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  image: {
    width: 38,
    height: 38,
    borderRadius: 10,
  },
});
