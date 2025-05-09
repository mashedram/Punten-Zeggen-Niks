import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export const SettingsButton = () => {
  const router = useRouter();

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
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push('/settings')}>
      <Image
        source={{
          uri: 'https://i.pinimg.com/736x/9a/19/4e/9a194ee95fafa71205bd41d97ddb1c95.jpg',
        }}
        style={styles.image}
      />
    </TouchableOpacity>
  );
};
