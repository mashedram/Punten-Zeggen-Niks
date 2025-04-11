import { Tabs } from 'expo-router';
import React from 'react';
import { OpaqueColorValue, Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

    return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
<<<<<<< HEAD
          tabBarIcon: ({ color }: {color: string} ) => <IconSymbol size={28} name="house.fill" color={color} />,
=======
          tabBarIcon: ({ color }: { color: OpaqueColorValue }) => <IconSymbol size={28} name="house.fill" color={color} />,
>>>>>>> f5c2565 (Added:)
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
<<<<<<< HEAD
<<<<<<< HEAD
          tabBarIcon: ({ color }: { color: string }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
=======
          tabBarIcon: ({ color }: { color: OpaqueColorValue }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
>>>>>>> ee73fa6 (Added:)
=======
          tabBarIcon: ({ color }: { color: OpaqueColorValue }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
>>>>>>> f5c2565 (Added:)
        }}
      />


    <Tabs.Screen
        name="join-lobby"
        options={{
            title: 'Join lobby',
            tabBarIcon: ({ color }: {color: string }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
    />
    </Tabs>
  );
}
