import { CardImages } from '@/constants/CardImages';
import { RoleCard } from '@/constants/RoleCards';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, Image, View } from 'react-native';

interface RoleButtonProps {
  onPress: () => void;
  roleCard: RoleCard;
}

export const RoleButton: React.FC<RoleButtonProps> = ({
  onPress,
  roleCard,
}) => {
  const image = CardImages[roleCard.id?.toLowerCase()];
  const [flash, setFlash] = useState(false);

  const onButtonPress = () => {
    setFlash(true); // Start flash
    setTimeout(() => setFlash(false), 200);
    onPress();
  };

  return (
    <TouchableOpacity onPress={onButtonPress} style={styles.button}>
      {flash && <View style={styles.flashView}></View>}
      <Image source={image} style={styles.image} resizeMode="center" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
    height: '100%',
  },
  flashView: {
    position: 'absolute',
    borderRadius: 5,
    width: '100%',
    height: '100%',
    backgroundColor: 'limegreen',
    zIndex: 100,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
