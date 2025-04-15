import { View } from 'react-native';

export const PlayerCount = ({ aantal }: { aantal: number }) => {
  return (
    <View>
      <>Aantal spelers: {aantal}/8</>
    </View>
  );
};
