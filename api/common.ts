import { CreateWSSContextFnOptions } from '@trpc/server/adapters/ws';
import { Client } from '../common/networking/client/Client';
import { CLIENT_MANAGER } from '@/common/networking/Globals';

export type TrpcContext = {
  client: Client | undefined;
};

export const createContext = (opts: CreateWSSContextFnOptions): TrpcContext => {
  // @ts-expect-error Type resolving doesn't go well on this bit
  const token = opts.info.connectionParams.token;
  console.log(`Creating context for token: ${token}`);
  return {
    client: CLIENT_MANAGER.authClient(token),
  };
};
