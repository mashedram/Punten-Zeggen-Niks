import { CardImages } from '@/constants/CardImages';
import { RoleCard } from '@/constants/RoleCards';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';

interface RoleButtonProps {
  onPress: () => void;
  roleCard: RoleCard;
}

export const RoleButton: React.FC<RoleButtonProps> = ({
  onPress,
  roleCard,
}) => {
  const image = CardImages[roleCard.id?.toLowerCase()];

  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
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
  image: {
    width: '100%',
    height: '100%',
  },
});
