import { CreateWSSContextFnOptions } from '@trpc/server/adapters/ws';
import { Client } from '../common/networking/client/Client';
import { CLIENT_MANAGER } from '@/common/networking/Globals';

export type TrpcContext = {
  client: Client;
};

export const createContext = (opts: CreateWSSContextFnOptions): TrpcContext => {
  const token = opts.info.connectionParams?.token;
  return {
    client: CLIENT_MANAGER.authClient(token),
  };
};
