import { Packet, PacketDataLayout } from '@/common/networking/packet/Packet';
import {
  getDataInstanceDescriptor,
  DataInstanceDescriptor,
} from '@/common/networking/tracking/descriptors/DataInstanceDescriptor';
import {
  Deref,
  TrackedInstanceReference,
} from '@/common/networking/tracking/tracker/TrackedInstanceReference';
import { useTRPC } from '@/api/query';
import { useMutation } from '@tanstack/react-query';
import { useSubscription } from '@trpc/tanstack-react-query';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { LoadingSymbol } from '@/common/networking/tracking/trackable/Dereferable';
import { ClientTrackedInstance } from './ClientTrackedInstance';
import { ClientDataStore } from './ClientDataStore';

type ClientContextType =
  | {
      isLoading: false;
      getId: () => string;
      getToken: () => string;
      getInstance: <T>(
        descriptor: DataInstanceDescriptor<T>,
      ) => ClientTrackedInstance<T> | undefined;
      refetch: (ref: TrackedInstanceReference<never>) => void;
      getStore: () => ClientDataStore;
    }
  | {
      isLoading: true;
    };

function useToken() {
  const KEY = 'player_token';
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    setToken(localStorage.getItem(KEY) ?? undefined);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (token) {
      localStorage.setItem(KEY, token);
      return;
    }

    localStorage.removeItem(KEY);
  }, [isLoading, token]);

  const value = {
    isLoading,
    value: token,
  };

  return [value, setToken] as const;
}

const ClientContext = createContext<ClientContextType | null>(null);

export function ClientProvider({ children }: { children?: React.ReactNode }) {
  const tRPC = useTRPC();
  const [id, setId] = useState<string>('');
  const [token, setToken] = useToken();
  const [isLoading, setIsLoading] = useState(true);
  const [tokenCapture, setTokenCapture] = useState<
    { value: string | undefined } | undefined
  >(undefined);
  const data = useRef(new ClientDataStore());
  const [, setStep] = useState(0);

  if (!token.isLoading && tokenCapture === undefined) {
    setTokenCapture({
      value: token.value,
    });
  }

  const refetchMutation = useMutation(tRPC.sync.refetch.mutationOptions({}));

  const refreshState = () => setStep(old => old + 1);

  const handlePacket = useCallback(
    (packet: Packet<never>) => {
      if (packet.type === 'identify') {
        console.debug('Setting token and id', packet.id);
        setId(packet.id);
        setToken(packet.token);
        setIsLoading(false);
        return;
      }

      if (token.isLoading || !token.value) throw new Error('No token');
      if (packet.type === 'track') {
        const descriptor = getDataInstanceDescriptor(packet.descriptorId);
        if (!descriptor) {
          throw new Error(`Descriptor ${packet.descriptorId} not found`);
        }
        data.current.startTracking(
          packet.instanceId,
          descriptor as unknown as DataInstanceDescriptor<never>,
        );
        refreshState();
        return;
      }

      if (packet.type === 'untrack') {
        data.current.stopTracking(packet.instanceId);
        refreshState();
        console.debug('Untracked', packet.instanceId);
        return;
      }

      if (packet.type === 'data') {
        const object = data.current.get(packet.instanceId);
        if (!object) {
          console.debug("Object hasn't been instantiated yet.", data);
          refetchMutation.mutate({
            instanceId: packet.instanceId,
            descriptorId: packet.descriptorId,
            reinstantiate: true,
          });
          return;
        }

        if (packet.overwrite) {
          object.overwrite(packet);
          refreshState();
          console.debug(`Received complete packet`, packet);
          return;
        }

        // If we receive a partial packet when the object is supposed to be reloading, or if we receive a packet that's too far ahead, we should refetch
        if (packet.clientExpectedStep > object.getStep()) {
          if (token.isLoading) throw new Error('No token');
          if (!token.value) throw new Error('No token');
          refetchMutation.mutate({
            instanceId: packet.instanceId,
            descriptorId: packet.descriptorId,
            step: object.getStep(),
          });
          console.debug(
            `Refetching instance ${packet.instanceId} with descriptor ${packet.descriptorId}, expected step: ${packet.clientExpectedStep}, received step: ${packet.step}, known step: ${object.getStep()}`,
          );
          return;
        }

        console.debug(
          `Object ${object.getInstanceName()} upgraded from: ${object.getStep()}, to received step: ${packet.step}. All okay!`,
          packet.data,
        );
        object.applyDataPacket(packet);
        refreshState();
      }
    },
    [refetchMutation, setToken, token.isLoading, token.value],
  );

  useSubscription(
    tRPC.sync.listen.subscriptionOptions(undefined, {
      onData: event => {
        const packet = data.current.decode(event.data);
        handlePacket(packet);
      },
      onStarted: () => {
        console.debug('Started listening');
        data.current.clear();
      },
    }),
  );

  const context: ClientContextType =
    token.isLoading || isLoading
      ? {
          isLoading: true,
        }
      : ({
          isLoading: false,
          getId: () => id,
          getToken: () => token.value,
          getInstance: <T extends PacketDataLayout>(
            descriptor: DataInstanceDescriptor<T>,
          ) => {
            const object = data.current.find(descriptor);
            if (!object) {
              console.debug('Object not found', descriptor);
              return undefined;
            }
            return object;
          },
          getStore: () => data.current,
        } as ClientContextType);

  return (
    <ClientContext.Provider value={context}>{children}</ClientContext.Provider>
  );
}

export function useClient() {
  const context = useContext(ClientContext);
  if (!context) throw new Error('No client context');
  return context;
}

export function useData<T>(
  descriptor: DataInstanceDescriptor<T>,
): { data: Deref<T> | undefined; isLoading: false } | { isLoading: true } {
  const client = useClient();
  return useMemo(() => {
    if (client.isLoading) return { isLoading: true };
    const data = client.getInstance(descriptor)?.deref(client.getStore());
    return data === LoadingSymbol
      ? { isLoading: true }
      : { isLoading: false, data };
  }, [client, descriptor]);
}
