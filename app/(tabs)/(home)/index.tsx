
import React, { useRef, useEffect } from "react";
import { 
  ScrollView, 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const headerScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.95],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <Animated.View 
          style={[
            styles.welcomeSection,
            {
              opacity: headerOpacity,
              transform: [{ scale: headerScale }],
            }
          ]}
        >
          <View style={styles.profileRow}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop' }}
              style={styles.profilePhoto}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.welcomeTitle}>Welcome, Camilo Cossio!</Text>
              <Text style={styles.welcomeSubtitle}>Lifestyle & Vibes • LIVE Creator</Text>
              <Text style={styles.tiktokHandle}>@camilocossio</Text>
              <View style={styles.badgeRow}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>USA / Canada</Text>
                </View>
                <View style={[styles.badge, styles.liveBadge]}>
                  <Text style={styles.liveBadgeText}>LIVE</Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim }}>
          <CardPressable onPress={() => console.log('Monthly Diamonds tapped')}>
            <View style={[styles.card, styles.heroCard]}>
              <View style={styles.progressRing}>
                <View style={styles.progressRingInner}>
                  <Text style={styles.diamondNumber}>54</Text>
                </View>
              </View>
              <Text style={styles.cardTitle}>Monthly Diamonds</Text>
              <Text style={styles.cardSubtext}>Resets every 1st of each month</Text>
              <Text style={styles.tapDetails}>Tap for details</Text>
            </View>
          </CardPressable>

          <CardPressable onPress={() => console.log('Next Graduation tapped')}>
            <View style={styles.card}>
              <Text style={styles.cardTitleLarge}>Next Graduation: Silver</Text>
              <View style={styles.progressBarContainer}>
                <LinearGradient
                  colors={[colors.primary, colors.primaryLight]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.progressBarFill}
                />
              </View>
              <View style={styles.progressLabels}>
                <Text style={styles.progressLabel}>Current Progress: 0.0%</Text>
                <Text style={styles.progressLabel}>Remaining: 80k</Text>
              </View>
              <View style={styles.milestoneInfo}>
                <Text style={styles.milestoneText}>Current: 120k diamonds</Text>
                <Text style={styles.milestoneText}>Target: 200k diamonds</Text>
                <Text style={styles.milestoneStatus}>Status: Rookie (New)</Text>
              </View>
            </View>
          </CardPressable>

          <CardPressable onPress={() => console.log('Missions tapped')}>
            <View style={styles.card}>
              <Text style={styles.cardTitleLarge}>Missions Overview</Text>
              <View style={styles.missionsGrid}>
                <View style={styles.missionColumn}>
                  <Text style={styles.missionIcon}>🎓</Text>
                  <Text style={styles.missionTitle}>Education</Text>
                  <Text style={styles.missionProgress}>2/5 trainings</Text>
                  <Text style={styles.missionProgress}>completed</Text>
                  <View style={styles.miniProgressBar}>
                    <View style={[styles.miniProgressFill, { width: '40%' }]} />
                  </View>
                </View>
                <View style={styles.missionColumn}>
                  <Text style={styles.missionIcon}>🔥</Text>
                  <Text style={styles.missionTitle}>21-Day Challenge</Text>
                  <Text style={styles.missionProgress}>7/21 completed</Text>
                  <Text style={styles.missionProgress}>14 days to go</Text>
                  <View style={styles.miniProgressBar}>
                    <View style={[styles.miniProgressFill, { width: '33%' }]} />
                  </View>
                </View>
                <View style={styles.missionColumn}>
                  <Text style={styles.missionIcon}>💵</Text>
                  <Text style={styles.missionTitle}>Bonus Forecast</Text>
                  <Text style={styles.bonusAmount}>$0.00</Text>
                  <View style={styles.statusPill}>
                    <Text style={styles.statusPillText}>Rising</Text>
                  </View>
                  <Text style={styles.bonusSubtext}>5 hrs • 54 diamonds • 1 day</Text>
                </View>
              </View>
            </View>
          </CardPressable>

          <CardPressable onPress={() => console.log('Battles tapped')}>
            <View style={styles.card}>
              <Text style={styles.cardTitleLarge}>Upcoming Battles</Text>
              <View style={styles.battleItem}>
                <View style={styles.battleInfo}>
                  <Text style={styles.battleDate}>Dec 15 • 6:00 PM</Text>
                  <Text style={styles.battleOpponent}>VS @sarah_live</Text>
                </View>
              </View>
              <View style={styles.battleItem}>
                <View style={styles.battleInfo}>
                  <Text style={styles.battleDate}>Dec 18 • 8:30 PM</Text>
                  <Text style={styles.battleOpponent}>VS @mike_streams</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.ctaButton}>
                <Text style={styles.ctaButtonText}>View All Battles</Text>
              </TouchableOpacity>
            </View>
          </CardPressable>

          <CardPressable onPress={() => console.log('LIVE Activity tapped')}>
            <View style={styles.card}>
              <Text style={styles.cardTitleLarge}>LIVE Activity Summary</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statCapsule}>
                  <Text style={styles.statValue}>1</Text>
                  <Text style={styles.statLabel}>LIVE Days</Text>
                </View>
                <View style={styles.statCapsule}>
                  <Text style={styles.statValue}>5</Text>
                  <Text style={styles.statLabel}>LIVE Hours</Text>
                </View>
                <View style={styles.statCapsule}>
                  <Text style={styles.statValue}>54</Text>
                  <Text style={styles.statLabel}>Diamonds Today</Text>
                </View>
                <View style={styles.statCapsule}>
                  <Text style={styles.statValue}>1 Day</Text>
                  <Text style={styles.statLabel}>Streak</Text>
                </View>
              </View>
            </View>
          </CardPressable>

          <CardPressable onPress={() => console.log('Manager tapped')}>
            <View style={styles.card}>
              <Text style={styles.cardTitleLarge}>My Manager</Text>
              <Text style={styles.noManagerText}>No manager assigned</Text>
              <TouchableOpacity style={styles.requestButton}>
                <Text style={styles.requestButtonText}>Request Manager</Text>
              </TouchableOpacity>
            </View>
          </CardPressable>

          <CardPressable onPress={() => console.log('Tools tapped')}>
            <View style={styles.card}>
              <Text style={styles.cardTitleLarge}>Tools & Promote</Text>
              <View style={styles.toolsGrid}>
                <TouchableOpacity style={styles.toolButton}>
                  <IconSymbol 
                    ios_icon_name="megaphone.fill" 
                    android_material_icon_name="campaign" 
                    size={28} 
                    color={colors.primary} 
                  />
                  <Text style={styles.toolButtonText}>Promote Myself</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.toolButton}>
                  <IconSymbol 
                    ios_icon_name="flame.fill" 
                    android_material_icon_name="whatshot" 
                    size={28} 
                    color={colors.primary} 
                  />
                  <Text style={styles.toolButtonText}>Battles</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.toolButton}>
                  <IconSymbol 
                    ios_icon_name="wand.and.stars" 
                    android_material_icon_name="auto-awesome" 
                    size={28} 
                    color={colors.primary} 
                  />
                  <Text style={styles.toolButtonText}>Flyer AI</Text>
                </TouchableOpacity>
              </View>
            </View>
          </CardPressable>
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
}

function CardPressable({ children, onPress }: { children: React.ReactNode; onPress: () => void }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  profilePhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  tiktokHandle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary,
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    backgroundColor: colors.grey,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
  },
  liveBadge: {
    backgroundColor: colors.primary,
  },
  liveBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.06)',
    elevation: 3,
  },
  heroCard: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  progressRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 8,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressRingInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  diamondNumber: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.primary,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  cardSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  tapDetails: {
    fontSize: 12,
    color: colors.textTertiary,
    position: 'absolute',
    bottom: 16,
    right: 20,
  },
  cardTitleLarge: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.grey,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    width: '0%',
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  milestoneInfo: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.grey,
  },
  milestoneText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  milestoneStatus: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 4,
  },
  missionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  missionColumn: {
    flex: 1,
    alignItems: 'center',
  },
  missionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  missionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  missionProgress: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
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
    borderRadius: 2,
  },
  bonusAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  statusPill: {
    backgroundColor: colors.success,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 6,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bonusSubtext: {
    fontSize: 9,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: 4,
  },
  battleItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
  },
  battleInfo: {
    flexDirection: 'column',
  },
  battleDate: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  battleOpponent: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  ctaButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '600',
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
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  noManagerText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  requestButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  requestButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  toolsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  toolButton: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    marginTop: 8,
    textAlign: 'center',
  },
});
