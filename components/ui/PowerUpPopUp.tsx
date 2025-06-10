import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageSourcePropType,
  Pressable,
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
    <View style={styles.PopUpBox}>
      <Image source={image} style={styles.PowerUpImage} />
      <Pressable style={styles.DeleteButton} onPress={onDelete}>
        <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold' }}>
          X
        </Text>
      </Pressable>

      <View style={styles.TekstContainer}>
        <Text style={styles.PopUpTekstTitel}>{name} </Text>
        <Text style={styles.PopUpTextUitleg}>{description}</Text>
      </View>

      <Pressable style={styles.InzetButton} onPress={onInzet}>
        <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
          Inzetten
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  PopUpBox: {
    width: '90%',
    height: '90%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
    alignItems: 'center',
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 20,
    borderColor: 'black',
    borderWidth: 2,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  TekstContainer: {
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
    marginBottom: 1,
    marginLeft: 100,
    borderColor: 'black',
    borderWidth: 0,
    width: '65%',
    height: '30%',
  },
  PowerUpImage: {
    position: 'absolute',
    width: '30%',
    height: '56%',
    marginTop: -115,
    marginLeft: -220,
    flexShrink: 0,
  },
  DeleteButton: {
    position: 'absolute',
    right: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '12%',
    height: '15%',
    backgroundColor: 'red',
    borderRadius: 15,
    marginTop: -180,
    marginRight: 10,
  },
  PopUpTextUitleg: {
    fontSize: 18,
    color: 'black',
  },
  PopUpTekstTitel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  InzetButton: {
    position: 'relative',
    flexShrink: 0,
    width: '60%',
    height: '13%',
    backgroundColor: 'rgba(112, 194, 92, 1)',
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowRadius: 4,
    borderRadius: 12,
    marginTop: 40,
    marginLeft: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
// {PowerUpsIndex !== undefined && (
//             <PowerUpPopUp
//               name={PowerUpList[PowerUpsIndex].name}
//               description={PowerUpList[PowerUpsIndex].description}
//               image={PowerUpList[PowerUpsIndex].image}
//               onDelete={() => setPowerupsIndex(undefined)}
//               onInzet={() => {
//                 setIngezettePowerupIndex(PowerUpsIndex);
//                 setPowerupsIndex(undefined);
//               }}
//             />
//           )}
