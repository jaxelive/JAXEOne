
import React, { useRef, useEffect, useState } from "react";
import { Stack, router } from "expo-router";
import { 
  ScrollView, 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  TouchableOpacity,
  Animated,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import { HeaderRightButton, HeaderLeftButton } from "@/components/HeaderButtons";
import { useCreatorData } from "@/hooks/useCreatorData";
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { supabase } from "@/app/integrations/supabase/client";

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });
  
  const { creator, loading, error, stats, refetch } = useCreatorData();
  const [nextBattle, setNextBattle] = useState<any>(null);
  const [challengeProgress, setChallengeProgress] = useState(0);
  const [educationProgress, setEducationProgress] = useState(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (creator) {
      fetchBattleData();
      fetchLearningData();
    }
  }, [creator]);

  const fetchBattleData = async () => {
    if (!creator) return;

    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('battles_calendar')
        .select('*')
        .or(`creator_1_id.eq.${creator.id},creator_2_id.eq.${creator.id}`)
        .gte('battle_date', now)
        .order('battle_date', { ascending: true })
        .limit(1);

      if (error) throw error;
      if (data && data.length > 0) {
        setNextBattle(data[0]);
      }
    } catch (error: any) {
      console.error('Error fetching battle data:', error);
    }
  };

  const fetchLearningData = async () => {
    if (!creator) return;

    try {
      // Fetch 21-day challenge progress
      const { data: challengeData, error: challengeError } = await supabase
        .from('learning_challenge_progress')
        .select('*')
        .eq('creator_id', creator.id)
        .eq('is_completed', true);

      if (challengeError) throw challengeError;
      setChallengeProgress(challengeData?.length || 0);

      // Fetch UR education progress
      const { data: educationData, error: educationError } = await supabase
        .from('ur_education_progress')
        .select('*')
        .eq('creator_id', creator.id)
        .eq('quiz_passed', true);

      if (educationError) throw educationError;
      setEducationProgress(educationData?.length || 0);
    } catch (error: any) {
      console.error('Error fetching learning data:', error);
    }
  };

  if (loading || !fontsLoaded) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "JAXE One",
            headerShown: false,
          }}
        />
        <View style={[styles.container, styles.centerContent]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading your dashboard...</Text>
        </View>
      </>
    );
  }

  if (error || !creator || !stats) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "JAXE One",
            headerShown: false,
          }}
        />
        <View style={[styles.container, styles.centerContent]}>
          <Text style={styles.errorText}>
            {error || 'No creator data found'}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={refetch}>
            <LinearGradient
              colors={colors.gradientPurple}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.retryButtonGradient}
            >
              <Text style={styles.retryButtonText}>Try Again</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  const fullName = `${creator.first_name} ${creator.last_name}`.trim() || creator.creator_handle;
  const profileImageUrl = creator.avatar_url || creator.profile_picture_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop';
  const region = creator.region || 'USA / Canada';
  const language = creator.language || 'English';

  const formatBattleDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatBattleTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "JAXE One",
          headerShown: false,
        }}
      />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          <Animated.View style={{ opacity: fadeAnim }}>
            {/* HEADER CARD */}
            <LinearGradient
              colors={['#FFFFFF', '#FAF5FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.headerCard}
            >
              <Image
                source={{ uri: profileImageUrl }}
                style={styles.headerAvatar}
              />
              <Text style={styles.headerGreeting}>Hello, {fullName}</Text>
              <Text style={styles.headerHandle}>@{creator.creator_handle}</Text>
              <View style={styles.headerBadges}>
                <View style={styles.headerBadge}>
                  <Text style={styles.headerBadgeText}>{region}</Text>
                </View>
                <View style={styles.headerBadge}>
                  <Text style={styles.headerBadgeText}>{language}</Text>
                </View>
              </View>
            </LinearGradient>

            {/* DIAMONDS PROGRESS CARD */}
            <CardPressable onPress={() => console.log('Diamonds tapped')}>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardEmoji}>💎</Text>
                  <View style={styles.cardHeaderText}>
                    <Text style={styles.cardTitleLarge}>Diamonds This Month</Text>
                    <Text style={styles.cardSubtitle}>Resets every 1st of the month</Text>
                  </View>
                </View>
                <Text style={styles.bigNumber}>{stats.monthlyDiamonds.toLocaleString()}</Text>
                <View style={styles.progressBarContainer}>
                  <LinearGradient
                    colors={colors.gradientPurple}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.progressBarFill, { width: `${Math.min(stats.currentProgress, 100)}%` }]}
                  />
                </View>
                <Text style={styles.progressHint}>
                  You need {stats.remaining.toLocaleString()} more diamonds to reach your next bonus
                </Text>
              </View>
            </CardPressable>

            {/* LIVE HOURS & VALID DAYS CARD */}
            <CardPressable onPress={() => console.log('Live stats tapped')}>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardEmoji}>📊</Text>
                  <View style={styles.cardHeaderText}>
                    <Text style={styles.cardTitleLarge}>Live Activity</Text>
                    <Text style={styles.cardSubtitle}>Last 30 days</Text>
                  </View>
                </View>
                <View style={styles.statsRow}>
                  <View style={styles.statBox}>
                    <Text style={styles.statNumber}>{stats.liveHours}</Text>
                    <Text style={styles.statLabel}>Live Hours</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statNumber}>{stats.liveDays}</Text>
                    <Text style={styles.statLabel}>Valid Days</Text>
                  </View>
                </View>
              </View>
            </CardPressable>

            {/* GRADUATION STATUS CARD */}
            <CardPressable onPress={() => console.log('Graduation tapped')}>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardEmoji}>🎓</Text>
                  <View style={styles.cardHeaderText}>
                    <Text style={styles.cardTitleLarge}>Graduation Status</Text>
                    <Text style={styles.cardSubtitle}>{stats.currentStatus}</Text>
                  </View>
                </View>
                <View style={styles.progressBarContainer}>
                  <LinearGradient
                    colors={colors.gradientPurple}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.progressBarFill, { width: `${Math.min(stats.currentProgress, 100)}%` }]}
                  />
                </View>
                <Text style={styles.progressHint}>
                  You are {stats.currentProgress.toFixed(1)}% of the way to {stats.nextTarget}
                </Text>
              </View>
            </CardPressable>

            {/* BONUSES & CONTESTS SNAPSHOT CARD */}
            <CardPressable onPress={() => router.push('/(tabs)/bonuses')}>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardEmoji}>💰</Text>
                  <View style={styles.cardHeaderText}>
                    <Text style={styles.cardTitleLarge}>Bonuses & Contests</Text>
                    <Text style={styles.cardSubtitle}>Your earnings overview</Text>
                  </View>
                </View>
                <View style={styles.statsRow}>
                  <View style={styles.statBox}>
                    <Text style={styles.statNumber}>$0</Text>
                    <Text style={styles.statLabel}>Earned</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statNumber}>$0</Text>
                    <Text style={styles.statLabel}>Pending</Text>
                  </View>
                </View>
                <Text style={styles.contestInfo}>No active contests</Text>
              </View>
            </CardPressable>

            {/* BATTLE REMINDER CARD */}
            <CardPressable onPress={() => router.push('/(tabs)/battles')}>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardEmoji}>⚔️</Text>
                  <View style={styles.cardHeaderText}>
                    <Text style={styles.cardTitleLarge}>Battle Reminder</Text>
                    <Text style={styles.cardSubtitle}>Monthly battles</Text>
                  </View>
                </View>
                {nextBattle ? (
                  <>
                    <Text style={styles.battleScheduled}>
                      Next battle: {formatBattleDate(nextBattle.battle_date)} at {formatBattleTime(nextBattle.battle_time)}
                    </Text>
                    <Text style={styles.battleOpponent}>
                      vs @{nextBattle.creator_1_id === creator.id ? nextBattle.creator_2_handle : nextBattle.creator_1_handle}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.battleStatus}>Your monthly battle is not scheduled</Text>
                    <TouchableOpacity style={styles.scheduleButton}>
                      <LinearGradient
                        colors={colors.gradientPurple}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.scheduleButtonGradient}
                      >
                        <Text style={styles.scheduleButtonText}>Schedule Battle</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </CardPressable>

            {/* LEARNING HUB CARD */}
            <CardPressable onPress={() => router.push('/(tabs)/learning-hub')}>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardEmoji}>📚</Text>
                  <View style={styles.cardHeaderText}>
                    <Text style={styles.cardTitleLarge}>Learning Hub</Text>
                    <Text style={styles.cardSubtitle}>Your education progress</Text>
                  </View>
                </View>
                <View style={styles.learningRow}>
                  <View style={styles.learningItem}>
                    <Text style={styles.learningTitle}>21-Day Challenge</Text>
                    <Text style={styles.learningProgress}>{challengeProgress}/21</Text>
                    <View style={styles.miniProgressBar}>
                      <View style={[styles.miniProgressFill, { width: `${(challengeProgress / 21) * 100}%` }]} />
                    </View>
                  </View>
                  <View style={styles.learningItem}>
                    <Text style={styles.learningTitle}>UR Education</Text>
                    <Text style={styles.learningProgress}>{educationProgress}/5</Text>
                    <View style={styles.miniProgressBar}>
                      <View style={[styles.miniProgressFill, { width: `${(educationProgress / 5) * 100}%` }]} />
                    </View>
                  </View>
                </View>
              </View>
            </CardPressable>

            {/* MANAGER CARD */}
            <CardPressable onPress={() => console.log('Manager tapped')}>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardEmoji}>👤</Text>
                  <View style={styles.cardHeaderText}>
                    <Text style={styles.cardTitleLarge}>My Manager</Text>
                    <Text style={styles.cardSubtitle}>Get personalized support</Text>
                  </View>
                </View>
                {creator.assigned_manager_id ? (
                  <Text style={styles.managerInfo}>Manager assigned</Text>
                ) : (
                  <>
                    <Text style={styles.noManagerText}>No manager assigned yet</Text>
                    <TouchableOpacity style={styles.requestButton}>
                      <LinearGradient
                        colors={colors.gradientPurple}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.requestButtonGradient}
                      >
                        <Text style={styles.requestButtonText}>Request Manager</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </CardPressable>

            {/* SHOP CARD */}
            <CardPressable onPress={() => router.push('/(tabs)/shop')}>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardEmoji}>🛍️</Text>
                  <View style={styles.cardHeaderText}>
                    <Text style={styles.cardTitleLarge}>JAXE Shop</Text>
                    <Text style={styles.cardSubtitle}>Coming soon to your region</Text>
                  </View>
                </View>
              </View>
            </CardPressable>
          </Animated.View>
        </ScrollView>
      </View>
    </>
  );
}

function CardPressable({ children, onPress }: { children: React.ReactNode; onPress: () => void }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 50,
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    color: colors.error,
    textAlign: 'center',
    paddingHorizontal: 32,
    marginBottom: 16,
  },
  retryButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  retryButtonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  retryButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  headerCard: {
    borderRadius: 28,
    padding: 32,
    alignItems: 'center',
    marginBottom: 20,
  },
  headerAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  headerGreeting: {
    fontSize: 28,
    fontFamily: 'Poppins_700Bold',
    color: colors.text,
    marginBottom: 4,
  },
  headerHandle: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    color: colors.primary,
    marginBottom: 12,
  },
  headerBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  headerBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  headerBadgeText: {
    fontSize: 13,
    fontFamily: 'Poppins_600SemiBold',
    color: colors.primary,
  },
  card: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 28,
    padding: 24,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitleLarge: {
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold',
    color: colors.text,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: colors.textSecondary,
  },
  bigNumber: {
    fontSize: 48,
    fontFamily: 'Poppins_700Bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: colors.grey,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 10,
  },
  progressHint: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.grey,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontFamily: 'Poppins_700Bold',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    fontFamily: 'Poppins_500Medium',
    color: colors.textSecondary,
  },
  contestInfo: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 12,
  },
  battleStatus: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  battleScheduled: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  battleOpponent: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: colors.primary,
    textAlign: 'center',
  },
  scheduleButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  scheduleButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  scheduleButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#FFFFFF',
  },
  learningRow: {
    flexDirection: 'row',
    gap: 12,
  },
  learningItem: {
    flex: 1,
  },
  learningTitle: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: colors.text,
    marginBottom: 6,
  },
  learningProgress: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    color: colors.primary,
    marginBottom: 8,
  },
  miniProgressBar: {
    height: 6,
    backgroundColor: colors.grey,
    borderRadius: 6,
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 6,
  },
  managerInfo: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    color: colors.text,
    textAlign: 'center',
  },
  noManagerText: {
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  requestButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  requestButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  requestButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#FFFFFF',
  },
});
