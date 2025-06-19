import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  createTRPCClient,
  createWSClient,
  loggerLink,
  wsLink,
} from '@trpc/client';
import { AppRouter } from '@/api/router/root';
import { TRPCProvider } from '@/api/query';
import { LobbyProvider } from '@/hooks/useLobby';
import { ClientProvider } from '@/hooks/networking/useClient';
import SuperJSON from 'superjson';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync().catch(e => console.warn(e));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    // Require does work in the browser on react.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync().catch(e => console.warn(e));
    }
  }, [loaded]);

  /**
   * Use the 'EXPO_PUBLIC_SERVER_ADDRESS' environment variable to set the remote server address
   * Source: https://docs.expo.dev/guides/environment-variables/
   */
  const remote_server_address = process.env.EXPO_PUBLIC_SERVER_ADDRESS;

  if (!remote_server_address)
    throw new Error('EXPO_PUBLIC_SERVER_ADDRESS is not defined');

  const [tRPCClient] = useState(() => {
    // Networking init
    const wsClient = createWSClient({
      url: remote_server_address,
      connectionParams: () => {
        const token = sessionStorage.getItem('player_token') ?? undefined;
        return {
          token,
        };
      },
    });

    return createTRPCClient<AppRouter>({
      links: [
        wsLink({
          client: wsClient,
          transformer: SuperJSON,
        }),
        loggerLink({
          enabled: opts =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
      ],
    });
  });

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider queryClient={queryClient} trpcClient={tRPCClient}>
        <ThemeProvider
          value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <ClientProvider>
            <LobbyProvider>
              <Stack screenOptions={{ headerShown: false }} />
            </LobbyProvider>
          </ClientProvider>
        </ThemeProvider>
      </TRPCProvider>
    </QueryClientProvider>
  );
}
