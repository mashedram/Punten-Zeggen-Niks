import React from 'react';
import { Modal, View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface GameStatusPopupProps {
  gameState: string;
  teamId: string;
  GameStateEnum: {
    playing: string;
  };
}

const GameStatusPopup: React.FC<GameStatusPopupProps> = ({
  gameState,
  teamId,
  GameStateEnum,
}) => {
  const navigation = useNavigation();

  const isPlaying = gameState === GameStateEnum.playing;
  const isWinner = gameState === teamId && !isPlaying;
  const isLoser = gameState !== teamId && !isPlaying;

  const handleGoToLobby = () => {
    navigation.navigate('lobby'); // path nog invoeren
  };

  return (
    <Modal visible={isWinner || isLoser} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.popup}>
          {isWinner && <Text style={styles.text}>Je hebt gewonnen!</Text>}
          {isLoser && <Text style={styles.text}>Je hebt verloren.</Text>}

          <View style={styles.buttonContainer}>
            <Button title="Terug naar lobby" onPress={handleGoToLobby} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 15,
    elevation: 10,
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 10,
    width: '100%',
  },
});

export default GameStatusPopup;
