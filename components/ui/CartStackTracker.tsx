import { View, Text, StyleSheet } from 'react-native';

export const CartStackTracker = () => {
  return (
    <View style={styles.BackgroundView}>
      <Text style={styles.NumberText}>60</Text>
      <View style={styles.WhiteBar}>
        <View style={styles.BlueBar}></View>
        <View style={styles.BlackBar}></View>
        <View style={styles.RedBar}></View>
      </View>
      <Text style={styles.NumberText}>60</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  BackgroundView: {
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  NumberText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    margin: 0,
  },
  WhiteBar: {
    width: '80%',
    height: 20,
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  BlueBar: {
    width: '40%',
    height: 20,
    backgroundColor: 'rgb(25, 0, 255)',
    paddingLeft: 1,
  },
  BlackBar: {
    width: '20%',
    height: 20,
    backgroundColor: 'black',
  },
  RedBar: {
    width: '40%',
    height: 20,
    backgroundColor: 'red',
    paddingRight: 1,
  },
});
