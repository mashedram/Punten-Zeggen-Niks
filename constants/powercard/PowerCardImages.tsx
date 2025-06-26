import { ImageSourcePropType } from 'react-native';
import { PowerCardKeysType } from './PowerCards';

import kamikaziImage from '@/assets/images/powercards/kamikaze.png';
import bomvestImage from '@/assets/images/powercards/bomvest.png';
import strongarmImage from '@/assets/images/powercards/strongarm.png';

export const PowerCardImages = {
  kamikazi: kamikaziImage,
  bomvest: bomvestImage,
  strongarm: strongarmImage,
} satisfies Record<PowerCardKeysType, ImageSourcePropType>;
