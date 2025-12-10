
import React from 'react';
import { Stack } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { HeaderRightButton, HeaderLeftButton } from '@/components/HeaderButtons';

export default function LiveScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'LIVE',
          headerRight: () => <HeaderRightButton />,
          headerLeft: () => <HeaderLeftButton />,
        }}
      />
      <View style={styles.container}>
        <Text style={styles.title}>LIVE</Text>
        <Text style={styles.subtitle}>Coming Soon</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});
