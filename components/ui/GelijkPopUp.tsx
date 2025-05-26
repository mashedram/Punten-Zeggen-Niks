import { View, Text, StyleSheet, Image } from 'react-native';

export const GelijkPopUp = () => {
  return (
    <View style={styles.PopUpBox}>
      <Image
        source={require('@/assets/images/Neutraal.png')}
        style={styles.NeutraalImage}
      />
      <View style={styles.DeleteButton}>
        <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold' }}>
          X
        </Text>
      </View>

      <View style={styles.TekstContainer}>
        <Text style={styles.PopUpTekstTitel}>Gelijk</Text>
        <Text style={styles.PopUpTextUitleg}>Gelijkspel!</Text>
        <Text style={styles.PopUpTextUitleg}>
          Jij en je tegenstander zijn af.
        </Text>
        <Text style={styles.PopUpTextUitleg}>Zoek je aanvoeder op om</Text>
        <Text style={styles.PopUpTextUitleg}>een nieuwe kaart te krijgen.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  PopUpBox: {
    width: '90%',
    height: '50%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
    alignItems: 'center',
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 20,
  },
  TekstContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 110,
    marginBottom: 20,
  },
  NeutraalImage: {
    position: 'absolute',
    width: '30%',
    height: '52%',
    marginTop: -115,
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
