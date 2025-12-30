
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/styles/commonStyles';
import { useCreatorData } from '@/hooks/useCreatorData';
import { IconSymbol } from '@/components/IconSymbol';
import AnimatedNumber from '@/components/AnimatedNumber';
import AnimatedProgressBar from '@/components/AnimatedProgressBar';

export default function HomeScreen() {
  const { creator, loading, error, stats } = useCreatorData('avelezsanti');

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading your data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <IconSymbol 
          ios_icon_name="exclamationmark.triangle.fill" 
          android_material_icon_name="warning" 
          size={48} 
          color={colors.error} 
        />
        <Text style={styles.errorTitle}>Unable to Load Data</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => router.replace('/login')}
        >
          <Text style={styles.retryButtonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!creator || !stats) {
    return (
      <View style={styles.errorContainer}>
        <IconSymbol 
          ios_icon_name="person.crop.circle.badge.xmark" 
          android_material_icon_name="person_off" 
          size={48} 
          color={colors.textSecondary} 
        />
        <Text style={styles.errorTitle}>No Creator Data</Text>
        <Text style={styles.errorMessage}>
          We couldn&apos;t find your creator profile. Please contact support.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <Text style={styles.profileInitial}>
                {creator.first_name.charAt(0)}
              </Text>
            </View>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.welcomeText}>Welcome,</Text>
            <Text style={styles.creatorName}>
              {creator.first_name} {creator.last_name}
            </Text>
            <Text style={styles.creatorHandle}>@{creator.creator_handle}</Text>
            <View style={styles.badgesRow}>
              {creator.region && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{creator.region}</Text>
                </View>
              )}
              {creator.creator_type && creator.creator_type.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{creator.creator_type[0]}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* Monthly Diamonds - Hero Card */}
      <TouchableOpacity 
        style={styles.heroCard}
        activeOpacity={0.97}
        onPress={() => console.log('Diamonds details')}
      >
        <LinearGradient
          colors={colors.gradientPurple}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroGradient}
        >
          <View style={styles.heroContent}>
            <View style={styles.diamondCircle}>
              <AnimatedNumber 
                value={stats.monthlyDiamonds} 
                style={styles.heroNumber}
                duration={1500}
              />
            </View>
            <Text style={styles.heroLabel}>Monthly Diamonds</Text>
            <Text style={styles.heroSubtext}>Resets every 1st of each month</Text>
            <View style={styles.heroFooter}>
              <Text style={styles.heroFooterText}>Tap for details</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* Next Graduation Card */}
      <TouchableOpacity 
        style={styles.card}
        activeOpacity={0.97}
        onPress={() => router.push('/tier-explanation')}
      >
        <View style={styles.cardHeader}>
          <IconSymbol 
            ios_icon_name="star.fill" 
            android_material_icon_name="star" 
            size={24} 
            color={colors.primary} 
          />
          <Text style={styles.cardTitle}>Next Graduation: {stats.nextTarget}</Text>
        </View>
        <AnimatedProgressBar 
          progress={stats.currentProgress} 
          height={12}
          color={colors.primary}
          backgroundColor={colors.grey}
          style={styles.progressBar}
        />
        <View style={styles.progressLabels}>
          <Text style={styles.progressLabel}>
            Current Progress: {stats.currentProgress.toFixed(1)}%
          </Text>
          <Text style={styles.progressLabel}>
            Remaining: {stats.remaining.toLocaleString()}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Missions Overview Card */}
      <TouchableOpacity 
        style={styles.card}
        activeOpacity={0.97}
        onPress={() => router.push('/(tabs)/missions')}
      >
        <Text style={styles.cardTitle}>Missions Overview</Text>
        <View style={styles.missionsGrid}>
          <View style={styles.missionColumn}>
            <IconSymbol 
              ios_icon_name="book.fill" 
              android_material_icon_name="school" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.missionTitle}>🎓 Education</Text>
            <Text style={styles.missionProgress}>2/5 trainings</Text>
            <View style={styles.miniProgressBar}>
              <View style={[styles.miniProgressFill, { width: '40%' }]} />
            </View>
          </View>
          <View style={styles.missionColumn}>
            <IconSymbol 
              ios_icon_name="flame.fill" 
              android_material_icon_name="local_fire_department" 
              size={24} 
              color={colors.accent} 
            />
            <Text style={styles.missionTitle}>🔥 21-Day Challenge</Text>
            <Text style={styles.missionProgress}>7/21 completed</Text>
            <Text style={styles.missionSubtext}>14 days to go</Text>
          </View>
          <View style={styles.missionColumn}>
            <IconSymbol 
              ios_icon_name="dollarsign.circle.fill" 
              android_material_icon_name="attach_money" 
              size={24} 
              color={colors.success} 
            />
            <Text style={styles.missionTitle}>💵 Bonus Forecast</Text>
            <Text style={styles.missionProgress}>$0.00</Text>
            <View style={styles.statusPill}>
              <Text style={styles.statusPillText}>Rising</Text>
            </View>
          </View>
        </View>
        <Text style={styles.missionFooter}>
          5 hrs • {stats.monthlyDiamonds} diamonds • 1 day
        </Text>
      </TouchableOpacity>

      {/* Upcoming Battles Card */}
      <TouchableOpacity 
        style={styles.card}
        activeOpacity={0.97}
        onPress={() => router.push('/(tabs)/battles')}
      >
        <View style={styles.cardHeader}>
          <IconSymbol 
            ios_icon_name="bolt.fill" 
            android_material_icon_name="flash_on" 
            size={24} 
            color={colors.accent} 
          />
          <Text style={styles.cardTitle}>Upcoming Battles</Text>
        </View>
        <View style={styles.battleItem}>
          <Text style={styles.battleDate}>Dec 15 • 6:00 PM</Text>
          <Text style={styles.battleVs}>VS @sarah_live</Text>
        </View>
        <View style={styles.battleItem}>
          <Text style={styles.battleDate}>Dec 18 • 8:30 PM</Text>
          <Text style={styles.battleVs}>VS @mike_streams</Text>
        </View>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllButtonText}>View All Battles</Text>
        </TouchableOpacity>
      </TouchableOpacity>

      {/* LIVE Activity Summary Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <IconSymbol 
            ios_icon_name="video.fill" 
            android_material_icon_name="videocam" 
            size={24} 
            color={colors.error} 
          />
          <Text style={styles.cardTitle}>LIVE Activity Summary</Text>
        </View>
        <View style={styles.statsGrid}>
          <View style={styles.statCapsule}>
            <Text style={styles.statLabel}>LIVE Days</Text>
            <AnimatedNumber 
              value={stats.liveDays} 
              style={styles.statValue}
              duration={1000}
            />
          </View>
          <View style={styles.statCapsule}>
            <Text style={styles.statLabel}>LIVE Hours</Text>
            <AnimatedNumber 
              value={stats.liveHours} 
              style={styles.statValue}
              duration={1000}
            />
          </View>
          <View style={styles.statCapsule}>
            <Text style={styles.statLabel}>Diamonds Today</Text>
            <AnimatedNumber 
              value={stats.diamondsToday} 
              style={styles.statValue}
              duration={1000}
            />
          </View>
          <View style={styles.statCapsule}>
            <Text style={styles.statLabel}>Streak</Text>
            <Text style={styles.statValue}>{stats.streak} Day{stats.streak !== 1 ? 's' : ''}</Text>
          </View>
        </View>
      </View>

      {/* My Manager Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <IconSymbol 
            ios_icon_name="person.fill" 
            android_material_icon_name="person" 
            size={24} 
            color={colors.primary} 
          />
          <Text style={styles.cardTitle}>My Manager</Text>
        </View>
        {creator.manager ? (
          <View style={styles.managerInfo}>
            <View style={styles.managerAvatar}>
              <Text style={styles.managerInitial}>
                {creator.manager.first_name.charAt(0)}
              </Text>
            </View>
            <View style={styles.managerDetails}>
              <Text style={styles.managerName}>
                {creator.manager.first_name} {creator.manager.last_name}
              </Text>
              <Text style={styles.managerEmail}>{creator.manager.email}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.noManager}>
            <Text style={styles.noManagerText}>No manager assigned</Text>
            <TouchableOpacity style={styles.requestButton}>
              <Text style={styles.requestButtonText}>Request Manager</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Tools & Promote Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tools & Promote</Text>
        <View style={styles.toolsGrid}>
          <TouchableOpacity 
            style={styles.toolButton}
            onPress={() => console.log('Promote Myself')}
          >
            <IconSymbol 
              ios_icon_name="megaphone.fill" 
              android_material_icon_name="campaign" 
              size={32} 
              color={colors.primary} 
            />
            <Text style={styles.toolButtonText}>Promote Myself</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.toolButton}
            onPress={() => router.push('/(tabs)/battles')}
          >
            <IconSymbol 
              ios_icon_name="bolt.fill" 
              android_material_icon_name="flash_on" 
              size={32} 
              color={colors.accent} 
            />
            <Text style={styles.toolButtonText}>Battles</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.toolButton}
            onPress={() => router.push('/(tabs)/ai-flyers')}
          >
            <IconSymbol 
              ios_icon_name="wand.and.stars" 
              android_material_icon_name="auto_awesome" 
              size={32} 
              color={colors.success} 
            />
            <Text style={styles.toolButtonText}>Flyer AI</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Padding */}
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingTop: 48,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 40,
  },
  errorTitle: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  errorMessage: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  retryButton: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  header: {
    marginBottom: 24,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    marginRight: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  creatorName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  creatorHandle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  heroCard: {
    marginBottom: 16,
    borderRadius: 24,
    overflow: 'hidden',
  },
  heroGradient: {
    padding: 32,
  },
  heroContent: {
    alignItems: 'center',
  },
  diamondCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroNumber: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  heroLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  heroSubtext: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  heroFooter: {
    marginTop: 16,
  },
  heroFooterText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  card: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  progressBar: {
    marginBottom: 12,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  missionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  missionColumn: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  missionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
    textAlign: 'center',
  },
  missionProgress: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 4,
  },
  missionSubtext: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
    marginTop: 2,
  },
  miniProgressBar: {
    width: '100%',
    height: 4,
    backgroundColor: colors.grey,
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  statusPill: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: colors.success,
    borderRadius: 12,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  missionFooter: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  battleItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
  },
  battleDate: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  battleVs: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  viewAllButton: {
    marginTop: 16,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: 12,
    alignItems: 'center',
  },
  viewAllButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCapsule: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  managerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  managerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  managerInitial: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  managerDetails: {
    flex: 1,
  },
  managerName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  managerEmail: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  noManager: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  noManagerText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 16,
  },
  requestButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: 12,
  },
  requestButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  toolsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  toolButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    marginHorizontal: 4,
    backgroundColor: colors.background,
    borderRadius: 16,
  },
  toolButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
    textAlign: 'center',
  },
  bottomPadding: {
    height: 100,
  },
});
