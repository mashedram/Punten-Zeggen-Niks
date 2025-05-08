/**
 * Schermcomponent voor het invoeren van een game PIN-code.
 * Gebruikt een aangepaste CodeInput-component, en laat de gebruiker
 * deelnemen aan een lobby via de useLobby hook.
 * Navigatie verloopt via Expo Router.
 *
 * @returns {JSX.Element} De weergave van het PIN-invoerscherm.
 */

import CodeInput from '@/components/CodeInput'; // Aangepaste inputcomponent voor PIN-code
import { useLobby } from '@/hooks/useLobby'; // Lobby hook voor game-join functionaliteit
import { useRouter } from 'expo-router'; // Navigatie hook van Expo Router
import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

function EnterPinScreen() {
  /** Lobby functionaliteit ophalen */
  const lobby = useLobby();

  /** Navigatie initialiseren via Expo Router */
  const router = useRouter();

  /**
   * State voor de ingevoerde code (PIN)
   * @type {[string, React.Dispatch<React.SetStateAction<string>>]}
   */
  const [code, setCode] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.card}>
          {/* Invoerveld voor de PIN-code */}
          <CodeInput
            code={code}
            onChange={code => setCode(code as string)}
            style={styles.input}
            placeholder="Enter game PIN"
            placeholderTextColor="#888"
          />

          {/* Knop om de ingevoerde code te wissen */}
          <Pressable style={styles.clearButton} onPress={() => setCode('')}>
            <Text style={styles.clearButtonText}>Code wissen</Text>
          </Pressable>

          {/* Knop om spel te joinen - alleen actief als er een code is ingevuld */}
          <Pressable
            style={[styles.button, !code && styles.buttonDisabled]}
            onPress={() => {
              if (!code.trim()) {
                Alert.alert('Fout', 'Voer een PIN in om verder te gaan.');
              } else {
                lobby.join(code.trim()); // Join het spel met de ingevoerde code
                router.push('/lobby'); // Navigeer naar de lobby-pagina
              }
            }}
            disabled={!code.trim()} // Schakel knop uit als code leeg of alleen spaties is
          >
            <Text style={styles.buttonText}>Spel deelnemen</Text>
          </Pressable>
        </View>

        {/* Decoratief onderste blok */}
        <View style={styles.rectangle47Container} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Stijlen voor componenten
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#5CA3C2', // Blauwgroene achtergrond
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
    backgroundColor: '#7ACF71', // Groene kleur voor actieve knop
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 24,
  },
  buttonDisabled: {
    backgroundColor: '#A9A9A9', // Grijze kleur voor uitgeschakelde knop
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  clearButton: {
    backgroundColor: '#FF6F61', // Rode knop voor wissen
    paddingVertical: 12,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 16,
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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
