import { ComponentType, LazyExoticComponent } from 'react';
import { PowerCardKeysType } from './PowerCards';

type LazyComponent<P = object> = LazyExoticComponent<ComponentType<P>>;

export const PowerCardPopups: Partial<
  Record<PowerCardKeysType, LazyComponent>
> = {
  // ruilkaart: React.lazy(
  //   () => import('@/components/stratego/popup/TradeCardPopup'),
  // ) as LazyComponent,
};
