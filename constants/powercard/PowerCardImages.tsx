import { ImageSourcePropType } from 'react-native';
import { PowerCards } from './PowerCards';

import kamikaziImage from '@/assets/images/Vergrootglas.jpg';
import ruilkaartImage from '@/assets/images/SpionP.jpg';

export type PowerCardKeys = keyof typeof PowerCards;

export const PowerCardImages = {
  kamikazi: kamikaziImage,
  ruilkaart: ruilkaartImage,
} satisfies Record<PowerCardKeys, ImageSourcePropType>;
