/**
 * Schermcomponent voor het invoeren van een game PIN-code.
 * Gebruikt een aangepaste CodeInput-component, en laat de gebruiker
 * deelnemen aan een lobby via de useLobby hook.
 * Navigatie verloopt via Expo Router.
 *
 * @returns {JSX.Element} De weergave van het PIN-invoerscherm.
 */

import { useLobby } from '@/hooks/useLobby'; // Lobby hook voor game-join functionaliteit
import { Redirect, useRouter } from 'expo-router'; // Navigatie hook van Expo Router
import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TextInput,
} from 'react-native';

export default function EnterPinScreen() {
  /** Lobby functionaliteit ophalen */
  const lobby = useLobby();

  /** Navigatie initialiseren via Expo Router */
  const router = useRouter();

  /**
   * State voor de ingevoerde code (PIN)
   * @type {[string, React.Dispatch<React.SetStateAction<string>>]}
   */

  const [name, setName] = useState('');

  if (lobby.loading) {
    return <Text>Loading...</Text>;
  }

  if (lobby.inLobby) {
    return <Redirect href="/lobby" />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'android' ? 'padding' : undefined}>
        <View style={styles.createContainer}>
          {/* Invoerveld voor de naam van de speler */}
          <TextInput
            value={name}
            onChangeText={setName}
            style={styles.TextInput}
            placeholder="Vul je naam in"
            placeholderTextColor="#888"
            autoCapitalize="words"
          />

          {/* Knop om spel te joinen - alleen actief als er een code is ingevuld */}
          <Pressable
            style={[styles.createButton, !name && styles.buttonDisabled]}
            onPress={async () => {
              if (!name.trim()) {
                Alert.alert('Fout', 'Voer een naam in om verder te gaan.');
              } else {
                await lobby.create(name.trim()); // Join het spel met de ingevoerde code
                router.push('/lobby'); // Navigeer naar de lobby-pagina
              }
            }}
            disabled={!name.trim()} // Schakel knop uit als code leeg of alleen spaties is
          >
            <Text style={styles.buttonText}>Lobby aanmaken</Text>
          </Pressable>
        </View>

        {/* Decoratief onderste blok */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.ReturnButtonContainer}
            onPress={() => {
              router.navigate('/');
            }}>
            <Text style={styles.PlayText}>Terug</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Stijlen voor componenten
const styles = StyleSheet.create({
  ReturnButtonContainer: {
    width: '80%',
    height: 45,
    position: 'absolute',
    paddingLeft: 25,
    paddingRight: 20,
    marginTop: 35,
    marginLeft: 40,
    flexShrink: 0,
    flexGrow: 1,
    paddingTop: 4,
    paddingBottom: 3,
    backgroundColor: 'rgba(71, 72, 73, 1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 10,
    paddingHorizontal: 59,
    borderRadius: 15,
  },

  PlayText: {
    position: 'relative',
    flexShrink: 0,
    textAlign: 'left',
    color: 'rgba(255, 255, 255, 1)',
    fontSize: 16,
    fontWeight: 700,
  },

  safeArea: {
    flex: 1,
    backgroundColor: '#5CA3C2',
    margin: -1.2, // Blauwgroene achtergrond
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  createContainer: {
    backgroundColor: 'white',
    padding: 28,
    borderRadius: 16,
    width: '108%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 130,
  },
  CodeInput: {
    width: '100%',
    backgroundColor: '#D9D9D9',
    borderRadius: 10,
    paddingVertical: 18,
    marginRight: 0,
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
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
  },
  TextInput: {
    width: '100%',
    backgroundColor: '#D9D9D9',
    borderRadius: 10,
    paddingVertical: 18,
    marginRight: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 20,
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  createButton: {
    backgroundColor: '#7ACF71', // Groene kleur voor actieve knop
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    height: '28%',
    justifyContent: 'center',
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
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '15%',
    backgroundColor: 'white',
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
  },
});
