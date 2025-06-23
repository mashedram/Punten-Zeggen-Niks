import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

import ExplodeImages from '@/assets/images/Explode.png';

export const ExplodePopUp = ({ onClose }: { onClose: () => void }) => {
  return (
    <View style={styles.PopUpBox}>
      <Image source={ExplodeImages} style={styles.ExplodeImage} />
      <TouchableOpacity style={styles.DeleteButton} onPress={onClose}>
        <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold' }}>
          X
        </Text>
      </TouchableOpacity>

      <View style={styles.TekstContainer}>
        <Text style={styles.PopUpTekstTitel}>Bam</Text>
        <Text style={styles.PopUpTextUitleg}>Ontploffing!</Text>
        <Text style={styles.PopUpTextUitleg}>
          {' '}
          Jij en je tegenstander zijn ontploft.{' '}
        </Text>
        <Text style={styles.PopUpTextUitleg}> Zoek je aanvoeder op om </Text>
        <Text style={styles.PopUpTextUitleg}>
          {' '}
          een nieuwe kaart te krijgen.
        </Text>
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
    marginTop: 110,
    marginBottom: 20,
  },
  ExplodeImage: {
    position: 'absolute',
    width: '30%',
    height: '52%',
    marginTop: -155,
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
