
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/styles/commonStyles';
import { supabase } from '@/app/integrations/supabase/client';
import { useCreatorData } from '@/hooks/useCreatorData';

interface Bonus {
  id: string;
  bonus_cents: number;
  status: string;
  period_start: string;
  period_end: string;
  paid_at: string | null;
  diamonds: number;
}

interface Contest {
  id: string;
  title: string;
  description: string;
  region: string | null;
  start_at: string;
  end_at: string;
  prize_cents: number;
}

export default function EarningsScreen() {
  const { creator, loading: creatorLoading } = useCreatorData();
  const [bonuses, setBonuses] = useState<Bonus[]>([]);
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    fetchData();
  }, [creator]);

  useEffect(() => {
    if (!loading) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [loading]);

  const fetchData = async () => {
    if (!creator) return;

    try {
      setLoading(true);

      // Fetch bonuses
      const { data: bonusData, error: bonusError } = await supabase
        .from('bonuses')
        .select('*')
        .eq('creator_id', creator.id)
        .order('period_start', { ascending: false })
        .limit(10);

      if (bonusError) {
        console.error('Error fetching bonuses:', bonusError);
      } else {
        setBonuses(bonusData || []);
      }

      // Fetch contests for creator's region
      const { data: contestData, error: contestError } = await supabase
        .from('contests')
        .select('*')
        .or(`region.eq.${creator.region},region.is.null`)
        .gte('end_at', new Date().toISOString())
        .order('start_at', { ascending: true });

      if (contestError) {
        console.error('Error fetching contests:', contestError);
      } else {
        setContests(contestData || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateBonusSummary = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const thisMonthBonuses = bonuses.filter((bonus) => {
      const bonusDate = new Date(bonus.period_start);
      return (
        bonusDate.getMonth() === currentMonth &&
        bonusDate.getFullYear() === currentYear
      );
    });

    const earnedThisMonth = thisMonthBonuses
      .filter((b) => b.status === 'PAID')
      .reduce((sum, b) => sum + b.bonus_cents, 0);

    const pending = bonuses
      .filter((b) => b.status === 'PENDING' || b.status === 'APPROVED')
      .reduce((sum, b) => sum + b.bonus_cents, 0);

    const lastPayout = bonuses.find((b) => b.status === 'PAID' && b.paid_at);

    return {
      earnedThisMonth: earnedThisMonth / 100,
      pending: pending / 100,
      lastPayout: lastPayout?.paid_at
        ? new Date(lastPayout.paid_at).toLocaleDateString()
        : 'No payouts yet',
    };
  };

  const getGraduationInfo = () => {
    if (!creator) return null;

    const silverTarget = creator.silver_target || 200000;
    const goldTarget = creator.gold_target || 500000;
    const totalDiamonds = creator.total_diamonds || 0;

    let currentTier = 'Rookie';
    let nextTier = 'Silver';
    let nextThreshold = silverTarget;
    let progress = 0;

    if (totalDiamonds >= goldTarget) {
      currentTier = 'Gold';
      nextTier = 'Elite';
      nextThreshold = 1000000;
      progress = (totalDiamonds / nextThreshold) * 100;
    } else if (totalDiamonds >= silverTarget) {
      currentTier = 'Silver';
      nextTier = 'Gold';
      nextThreshold = goldTarget;
      progress = ((totalDiamonds - silverTarget) / (goldTarget - silverTarget)) * 100;
    } else {
      progress = (totalDiamonds / silverTarget) * 100;
    }

    return {
      currentTier,
      nextTier,
      progress: Math.min(progress, 100),
      remaining: Math.max(0, nextThreshold - totalDiamonds),
      nextThreshold,
    };
  };

  const AnimatedCounter = ({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
      let start = 0;
      const end = value;
      const duration = 1000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setDisplayValue(end);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }, [value]);

    return (
      <Text style={styles.statValue}>
        {prefix}
        {displayValue.toLocaleString()}
        {suffix}
      </Text>
    );
  };

  if (creatorLoading || loading) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Earnings', headerShown: true }} />
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading earnings data...</Text>
      </View>
    );
  }

  if (!creator) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Earnings', headerShown: true }} />
        <Text style={styles.errorText}>No creator data available</Text>
      </View>
    );
  }

  const bonusSummary = calculateBonusSummary();
  const graduationInfo = getGraduationInfo();

  return (
    <>
      <Stack.Screen options={{ title: 'Earnings', headerShown: true }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Bonuses Summary */}
          <LinearGradient
            colors={['#FFFFFF', '#FAF5FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>💰</Text>
              <Text style={styles.cardTitle}>Bonuses Summary</Text>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Earned This Month</Text>
                <AnimatedCounter value={bonusSummary.earnedThisMonth} prefix="$" />
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Pending Payouts</Text>
                <AnimatedCounter value={bonusSummary.pending} prefix="$" />
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Last Payout</Text>
              <Text style={styles.infoValue}>{bonusSummary.lastPayout}</Text>
            </View>
          </LinearGradient>

          {/* Graduation Overview */}
          {graduationInfo && (
            <LinearGradient
              colors={['#FFFFFF', '#FDF4FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.card}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardIcon}>🎓</Text>
                <Text style={styles.cardTitle}>Graduation Progress</Text>
              </View>
              <View style={styles.tierRow}>
                <View style={styles.tierBadge}>
                  <Text style={styles.tierLabel}>Current Tier</Text>
                  <Text style={styles.tierValue}>{graduationInfo.currentTier}</Text>
                </View>
                <Text style={styles.tierArrow}>→</Text>
                <View style={styles.tierBadge}>
                  <Text style={styles.tierLabel}>Next Tier</Text>
                  <Text style={styles.tierValue}>{graduationInfo.nextTier}</Text>
                </View>
              </View>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <Animated.View
                    style={[
                      styles.progressFill,
                      { width: `${graduationInfo.progress}%` },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {graduationInfo.progress.toFixed(1)}% Complete
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Diamonds Remaining</Text>
                <Text style={styles.infoValue}>
                  {graduationInfo.remaining.toLocaleString()}
                </Text>
              </View>
            </LinearGradient>
          )}

          {/* Contests */}
          {contests.length > 0 && (
            <LinearGradient
              colors={['#FFFFFF', '#DBEAFE']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.card}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardIcon}>🏆</Text>
                <Text style={styles.cardTitle}>Active Contests</Text>
              </View>
              {contests.map((contest, index) => (
                <View key={contest.id}>
                  {index > 0 && <View style={styles.divider} />}
                  <View style={styles.contestItem}>
                    <Text style={styles.contestTitle}>{contest.title}</Text>
                    <Text style={styles.contestDescription}>
                      {contest.description}
                    </Text>
                    <View style={styles.contestDetails}>
                      <View style={styles.contestDetail}>
                        <Text style={styles.contestDetailLabel}>Reward</Text>
                        <Text style={styles.contestDetailValue}>
                          ${(contest.prize_cents / 100).toLocaleString()}
                        </Text>
                      </View>
                      <View style={styles.contestDetail}>
                        <Text style={styles.contestDetailLabel}>Deadline</Text>
                        <Text style={styles.contestDetailValue}>
                          {new Date(contest.end_at).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </LinearGradient>
          )}

          {/* Monthly Breakdown */}
          <LinearGradient
            colors={['#FFFFFF', '#FEF3C7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>📊</Text>
              <Text style={styles.cardTitle}>Monthly Breakdown</Text>
            </View>
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statBoxLabel}>Diamonds</Text>
                <AnimatedCounter value={creator.diamonds_monthly || 0} />
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statBoxLabel}>Live Hours</Text>
                <AnimatedCounter
                  value={Math.floor((creator.live_duration_seconds_30d || 0) / 3600)}
                />
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statBoxLabel}>Valid Days</Text>
                <AnimatedCounter value={creator.live_days_30d || 0} />
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
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
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  tierRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  tierBadge: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
  },
  tierLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  tierValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  tierArrow: {
    fontSize: 24,
    color: colors.textSecondary,
    marginHorizontal: 12,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 12,
    backgroundColor: colors.background,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  contestItem: {
    paddingVertical: 8,
  },
  contestTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  contestDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  contestDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contestDetail: {
    flex: 1,
  },
  contestDetailLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  contestDetailValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statBoxLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
  },
});
