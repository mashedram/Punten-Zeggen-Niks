import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function EnterPinScreen() {
  const [pin, setPin] = useState('');

  const handleSubmit = () => {
    if (pin.length === 5) {
      Alert.alert('PIN accepted', `Entered PIN: ${pin}`);
    } else {
      Alert.alert('Fout', 'De PIN moet 5 cijfers bevatten.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Game PIN"
            placeholderTextColor="#888"
            keyboardType="numeric"
            maxLength={5}
            value={pin}
            onChangeText={setPin}
          />
          <Pressable style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Enter</Text>
          </Pressable>
        </View>
        {/* UI-component onderin (zoals Figma design) */}
        <View style={styles.rectangle47Container} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#5CA3C2',
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: 'white',
    padding: 28,
    borderRadius: 16,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 40,
  },
  input: {
    width: '100%',
    backgroundColor: '#D9D9D9',
    borderRadius: 10,
    paddingVertical: 18,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 24,
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  button: {
    backgroundColor: '#7ACF71',
    paddingVertical: 16,
    paddingHorizontal: '10%',
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  rectangle47Container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 112,
    backgroundColor: 'white',
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
  },
});
