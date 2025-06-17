import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export const VerlorenPopUp = ({ onClose }: { onClose: () => void }) => {
  return (
    <View style={styles.PopUpBox}>
      <Image
        source={require('@/assets/images/Rood-duimpje.png')}
        style={styles.RoodDuimpjeImage}
      />
      <TouchableOpacity style={styles.DeleteButton} onPress={onClose}>
        <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold' }}>
          X
        </Text>
      </TouchableOpacity>

      <View style={styles.TekstContainer}>
        <Text style={styles.PopUpTekstTitel}>Verloren</Text>
        <Text style={styles.PopUpTextUitleg}>Verloren!</Text>
        <Text style={styles.PopUpTextUitleg}>Je bent verslagen! </Text>
        <Text style={styles.PopUpTextUitleg}>Zoek je aanvoeder op om</Text>
        <Text style={styles.PopUpTextUitleg}>een nieuwe kaart te krijgen.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  PopUpBox: {
    width: '90%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'absolute',
    alignItems: 'center',
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 20,
    left: '5%',
    top: '-25%',
    padding: 40,
  },
  TekstContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 120,
  },
  RoodDuimpjeImage: {
    position: 'absolute',
    width: '30%',
    height: '51%',
    marginTop: -125,
    flexShrink: 0,
    resizeMode: 'contain',
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
});
