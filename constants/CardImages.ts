import { ImageSourcePropType } from 'react-native';

import SpionImage from '@/assets/images/Spion.png';
import MajoorImage from '@/assets/images/Majoor.png';
import LuitenantImage from '@/assets/images/Luitenant.png';
import KapiteinImage from '@/assets/images/Kapitein.png';
import KolonelImage from '@/assets/images/Kolonel.png';
import MineurImage from '@/assets/images/Mineur.png';
import VlagImage from '@/assets/images/Vlag.png';
import GeneraalImage from '@/assets/images/Generaal.png';
import VerkennerImage from '@/assets/images/Verkenner.png';
import SergeantImage from '@/assets/images/Sergeant.png';
import BomImage from '@/assets/images/Bom.png';
import MaarschalkImage from '@/assets/images/Maarschalk.png';

export const CardImages: Record<string, ImageSourcePropType> = {
  spion: SpionImage,
  majoor: MajoorImage,
  luitenant: LuitenantImage,
  kapitein: KapiteinImage,
  kolonel: KolonelImage,
  mineur: MineurImage,
  vlag: VlagImage,
  generaal: GeneraalImage,
  verkenner: VerkennerImage,
  sergeant: SergeantImage,
  bom: BomImage,
  maarschalk: MaarschalkImage,
};
