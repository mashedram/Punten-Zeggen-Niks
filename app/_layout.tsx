import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useMemo } from 'react';
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

import SpaceMonoFont from '@/assets/fonts/SpaceMono-Regular.ttf';

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
    SpaceMono: SpaceMonoFont,
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
  const websocketServerUrl = process.env.EXPO_PUBLIC_WEBSOCKET_URL;

  if (!websocketServerUrl)
    throw new Error('EXPO_PUBLIC_WEBSOCKET_URL is not defined');

  const tRPCClient = useMemo(() => {
    // Networking init
    const wsClient = createWSClient({
      url: websocketServerUrl,
      connectionParams: () => {
        const token = localStorage.getItem('player_token') ?? undefined;
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
  }, [websocketServerUrl]);

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
