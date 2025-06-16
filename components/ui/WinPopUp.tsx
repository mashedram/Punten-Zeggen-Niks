import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export const WinPopUp = ({ onClose }: { onClose: () => void }) => {
  return (
    <View style={styles.PopUpBox}>
      <Image
        source={require('@/assets/images/Groen-duimpje.png')}
        style={styles.GroeneDuimImage}
      />
      <TouchableOpacity style={styles.DeleteButton} onPress={onClose}>
        <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold' }}>
          X
        </Text>
      </TouchableOpacity>

      <View style={styles.TekstContainer}>
        <Text style={styles.PopUpTekstTitel}>Gewonnen</Text>
        <Text style={styles.PopUpTextUitleg}>Gewonnen!</Text>
        <Text style={styles.PopUpTextUitleg}>
          Je hebt je tegenstander verslagen.
        </Text>
        <Text style={styles.PopUpTextUitleg}>Je mag doorgaan zonder een</Text>
        <Text style={styles.PopUpTextUitleg}>nieuwe kaart te halen.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  PopUpBox: {
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
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
  GroeneDuimImage: {
    position: 'absolute',
    width: '30%',
    height: '52%',
    resizeMode: 'contain',
    marginTop: -125,
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
});
