import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageSourcePropType,
  Pressable,
  Button,
} from 'react-native';

interface PowerUpPopUpProps {
  name: string;
  description: string;
  image: ImageSourcePropType;
  onDelete?: () => void;
  onInzet?: () => void;
  ingezet?: boolean;
}

export const PowerUpPopUp = ({
  name,
  description,
  image,
  onDelete,
  onInzet,
  ingezet,
}: PowerUpPopUpProps) => {
  return (
    <View style={styles.popUpContainer}>
      <View style={styles.PopUpBox}>
        <View style={styles.leftColumn}>
          <Image source={image} style={styles.cardImage} />
        </View>
        <View style={styles.rightColumn}>
          <Text style={styles.cardName}>{name}</Text>
          <Text>{description}</Text>
          <View style={styles.buttonContainer}>
            <Pressable style={styles.useButton} onPress={onDelete}>
              <Text>{ingezet ? 'Ingezet' : 'Inzetten'}</Text>
            </Pressable>
            <Pressable style={styles.closeButton} onPress={onDelete}>
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
