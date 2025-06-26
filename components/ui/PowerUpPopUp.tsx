import {
  PowerCardImages,
  PowerCardKeysType,
} from '@/constants/powercard/PowerCardImages';
import { PowerCards } from '@/constants/powercard/PowerCards';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';

interface PowerUpPopUpProps {
  index: number;
  cardId: PowerCardKeysType;
  inUse: boolean;
  use: (index: number) => void;
  close: () => void;
}

export const PowerUpPopUp = ({
  index,
  cardId,
  inUse,
  use,
  close,
}: PowerUpPopUpProps) => {
  const card = PowerCards[cardId];
  const image = PowerCardImages[cardId];

  return (
    <View style={styles.popUpContainer}>
      <View style={styles.PopUpBox}>
        <View style={styles.leftColumn}>
          <Image source={image} style={styles.cardImage} />
        </View>
        <View style={styles.rightColumn}>
          <Text style={styles.cardName}>{card.name}</Text>
          <Text>{card.description}</Text>
          <View style={styles.buttonContainer}>
            <Pressable style={styles.useButton} onPress={() => use(index)}>
              <Text>{inUse ? 'Ingezet' : 'Inzetten'}</Text>
            </Pressable>
            <Pressable style={styles.closeButton} onPress={close}>
              <Text>Sluiten</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  popUpContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  PopUpBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxWidth: 400,
    height: '30%',
    maxHeight: 400,

    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftColumn: {
    width: '35%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightColumn: {
    marginLeft: '5%',
    width: '60%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'baseline',
  },
  cardName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  useButton: {
    width: '100%',
    padding: 10,
    backgroundColor: '#70C25C',
    borderRadius: 5,
    marginBottom: 10,
  },
  closeButton: {
    width: '100%',
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  cardImage: {
    resizeMode: 'center',
    width: '100%',
  },
});
