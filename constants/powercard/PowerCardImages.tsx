import { ImageSourcePropType } from 'react-native';
import { PowerCards } from './PowerCards';

export type PowerCardKeys = keyof typeof PowerCards;

export const PowerCardImages = {
  kamikazi: require('@/assets/images/Vergrootglas.jpg'),
} satisfies Record<PowerCardKeys, ImageSourcePropType>;
