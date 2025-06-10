import { CreateWSSContextFnOptions } from '@trpc/server/adapters/ws';
import { Client } from '../common/networking/client/Client';

export type TrpcContext = {
  client: Client | undefined;
};

export const createContext = (opts: CreateWSSContextFnOptions): TrpcContext => {
  return {
    client: undefined,
  };
};
