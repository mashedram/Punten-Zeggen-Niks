import { StyleSheet, Image, TouchableOpacity } from 'react-native';

export const SettingsButton = () => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: 38,
      height: 38,
      borderRadius: 10,
    },
  });

  return (
    <TouchableOpacity>
      <Image style={styles.image} />
    </TouchableOpacity>
  );
};
