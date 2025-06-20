import { StyleSheet } from 'react-native';
import { Text } from 'react-native';
import { View } from 'react-native';

const TradecardPopup = () => {
  return (
    <View style={styles.container}>
      <Text>Trade Card</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 3000,
  },
});

export default TradecardPopup;
