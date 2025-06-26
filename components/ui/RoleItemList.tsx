import { CardImages } from '@/constants/CardImages';
import { RoleCard } from '@/constants/RoleCards';
import {
  StyleSheet,
  Text,
  View,
  Image,
  StyleProp,
  TextStyle,
} from 'react-native';

interface RoleItemListProps {
  roleCard: RoleCard;
  size?: number;
  textStyle?: StyleProp<TextStyle>;
}
export const RoleItemList: React.FC<RoleItemListProps> = ({
  roleCard,
  size,
  textStyle,
}) => {
  const image = CardImages[roleCard.id?.toLowerCase()];

  let imageSize = 0;
  if (!size) {
    imageSize = 50;
  } else {
    imageSize = size;
  }

  return (
    <View style={styles.primaryContainer}>
      <View style={{ display: 'flex', width: '20%' }}>
        <Image
          source={image}
          style={{
            width: imageSize,
            height: imageSize,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
          }}
          resizeMode="contain"
        />
      </View>
      <View style={{ display: 'flex', width: '45%' }}>
        <Text style={textStyle ?? styles.text}>Rol: {roleCard.name}</Text>
      </View>
      <View style={{ display: 'flex' }}>
        <Text style={textStyle ?? styles.text}>waarde: {roleCard.points}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  primaryContainer: {
    width: '100%',
    flexDirection: 'row',
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
  },
});
