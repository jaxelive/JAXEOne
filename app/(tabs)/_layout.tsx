
import React from 'react';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';

export default function TabLayout() {
  const tabs: TabBarItem[] = [
    {
      name: '(home)',
      route: '/(tabs)/(home)/',
      icon: 'home',
      label: 'Home',
    },
    {
      name: 'missions',
      route: '/(tabs)/missions',
      icon: 'assignment',
      label: 'Missions',
    },
    {
      name: 'live',
      route: '/(tabs)/live',
      icon: 'videocam',
      label: 'LIVE',
    },
    {
      name: 'rewards',
      route: '/(tabs)/rewards',
      icon: 'card-giftcard',
      label: 'Rewards',
    },
    {
      name: 'profile',
      route: '/(tabs)/profile',
      icon: 'person',
      label: 'Profile',
    },
  ];

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen key="home" name="(home)" />
        <Stack.Screen key="missions" name="missions" />
        <Stack.Screen key="live" name="live" />
        <Stack.Screen key="rewards" name="rewards" />
        <Stack.Screen key="profile" name="profile" />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
