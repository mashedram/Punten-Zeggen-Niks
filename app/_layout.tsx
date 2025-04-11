// @ts-ignore
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

<<<<<<< HEAD
import { useColorScheme } from "@/hooks/useColorScheme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createTRPCClient,
  createWSClient,
  loggerLink,
  wsLink,
} from "@trpc/client";
import { AppRouter } from "@/api/router/root";
import { TRPCProvider } from "@/api/query";
import { LobbyProvider } from "@/hooks/useLobby";
=======
import { useColorScheme } from '@/hooks/useColorScheme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createTRPCClient, createWSClient, loggerLink, wsLink } from '@trpc/client';
import { AppRouter } from '@/api/router/root';
import { createTRPCContext } from '@trpc/tanstack-react-query';
import { TRPCProvider } from '@/api/query';
import { NFCProvider } from '@/hooks/useNFCContext';
>>>>>>> f5c2565 (Added:)

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

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
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  /**
   * Use the 'EXPO_PUBLIC_SERVER_ADDRESS' environment variable to set the remote server address
   * Source: https://docs.expo.dev/guides/environment-variables/
   */
  const remote_server_address = process.env.EXPO_PUBLIC_SERVER_ADDRESS;

  if (!remote_server_address)
    throw new Error("EXPO_PUBLIC_SERVER_ADDRESS is not defined");

  const [trpcClient] = useState(() => {
    // Networking init
    const wsClient = createWSClient({
      url: remote_server_address,
    });

    return createTRPCClient<AppRouter>({
      links: [
        wsLink({
          client: wsClient,
        }),
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
      ],
    });
  });

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider queryClient={queryClient} trpcClient={trpcClient}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </TRPCProvider>
    </QueryClientProvider>
  );
}
