
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/styles/commonStyles';
import { useCreatorData } from '@/hooks/useCreatorData';

export default function ShopScreen() {
  const { creator, loading } = useCreatorData();
  const [region, setRegion] = useState<string>('your region');

  useEffect(() => {
    if (creator && creator.region) {
      // Format region for display
      const formattedRegion = creator.region
        .replace('_', ' / ')
        .replace('USA_CAN', 'USA / Canada')
        .replace('LATAM', 'Latin America');
      setRegion(formattedRegion);
    }
  }, [creator]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Shop', headerShown: true }} />
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Shop', headerShown: true }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <LinearGradient
          colors={['#FFFFFF', '#DBEAFE']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.emoji}>🛍️</Text>
          </View>
          <Text style={styles.title}>JAXE Shop</Text>
          <Text style={styles.subtitle}>Coming soon to {region}</Text>
          <View style={styles.decorativeBar} />
          <Text style={styles.description}>
            We&apos;re working hard to bring exclusive creator merchandise and tools to your region.
            Stay tuned for updates!
          </Text>
        </LinearGradient>

        {/* Feature Preview Cards */}
        <View style={styles.previewContainer}>
          <LinearGradient
            colors={['#FFFFFF', '#FAF5FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.previewCard}
          >
            <Text style={styles.previewIcon}>👕</Text>
            <Text style={styles.previewTitle}>Merchandise</Text>
            <Text style={styles.previewText}>
              Exclusive JAXE branded apparel and accessories
            </Text>
          </LinearGradient>

          <LinearGradient
            colors={['#FFFFFF', '#FEF3C7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.previewCard}
          >
            <Text style={styles.previewIcon}>🎨</Text>
            <Text style={styles.previewTitle}>Creator Tools</Text>
            <Text style={styles.previewText}>
              Professional equipment and streaming gear
            </Text>
          </LinearGradient>

          <LinearGradient
            colors={['#FFFFFF', '#DCFCE7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.previewCard}
          >
            <Text style={styles.previewIcon}>🎁</Text>
            <Text style={styles.previewTitle}>Rewards</Text>
            <Text style={styles.previewText}>
              Redeem your diamonds for exclusive rewards
            </Text>
          </LinearGradient>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 120,
  },
  card: {
    borderRadius: 28,
    padding: 40,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconContainer: {
    marginBottom: 16,
  },
  emoji: {
    fontSize: 80,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  decorativeBar: {
    width: 60,
    height: 4,
    backgroundColor: colors.primary,
    borderRadius: 2,
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  previewContainer: {
    gap: 16,
  },
  previewCard: {
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  previewIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  previewText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
});
