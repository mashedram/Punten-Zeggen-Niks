import React, { ComponentType, LazyExoticComponent } from 'react';
import { PowerCardKeys } from './PowerCardImages';

type LazyComponent<P = object> = LazyExoticComponent<ComponentType<P>>;

export const PowerCardPopups: Partial<Record<PowerCardKeys, LazyComponent>> = {
  ruilkaart: React.lazy(
    () => import('@/components/stratego/popup/TradeCardPopup'),
  ) as LazyComponent,
};
