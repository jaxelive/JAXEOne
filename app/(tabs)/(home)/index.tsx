
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
  
  const { creator, loading, error, stats, refetch } = useCreatorData('avelezsanti');
  const [nextBattle, setNextBattle] = useState<any>(null);
  const [challengeProgress, setChallengeProgress] = useState(7);
  const [educationProgress, setEducationProgress] = useState(3);
  const [bonusForecast, setBonusForecast] = useState(100);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (creator) {
      console.log('[HomeScreen] Creator loaded:', {
        handle: creator.creator_handle,
        name: `${creator.first_name} ${creator.last_name}`,
        monthlyDiamonds: creator.diamonds_monthly,
        totalDiamonds: creator.total_diamonds,
        liveDays: creator.live_days_30d,
        liveHours: Math.floor(creator.live_duration_seconds_30d / 3600)
      });
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

      if (error) {
        console.error('[HomeScreen] Error fetching battle data:', error);
        return;
      }
      
      if (data && data.length > 0) {
        console.log('[HomeScreen] Next battle found:', data[0]);
        setNextBattle(data[0]);
      } else {
        console.log('[HomeScreen] No upcoming battles found');
      }
    } catch (error: any) {
      console.error('[HomeScreen] Unexpected error fetching battle data:', error);
    }
  };

  const fetchLearningData = async () => {
    if (!creator) return;

    try {
      const { data: challengeData, error: challengeError } = await supabase
        .from('learning_challenge_progress')
        .select('*')
        .eq('creator_id', creator.id)
        .eq('is_completed', true);

      if (challengeError) {
        console.error('[HomeScreen] Error fetching challenge data:', challengeError);
      } else {
        const completedDays = challengeData?.length || 0;
        console.log('[HomeScreen] Challenge progress:', completedDays, '/21');
        setChallengeProgress(completedDays);
      }

      const { data: educationData, error: educationError } = await supabase
        .from('ur_education_progress')
        .select('*')
        .eq('creator_id', creator.id)
        .eq('quiz_passed', true);

      if (educationError) {
        console.error('[HomeScreen] Error fetching education data:', educationError);
      } else {
        const completedVideos = educationData?.length || 0;
        console.log('[HomeScreen] Education progress:', completedVideos, '/12');
        setEducationProgress(completedVideos);
      }
    } catch (error: any) {
      console.error('[HomeScreen] Unexpected error fetching learning data:', error);
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
  const region = creator.region || 'USA';
  const creatorType = creator.creator_type?.[0] || 'Creator';

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
            {/* HEADER */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Image
                  source={{ uri: profileImageUrl }}
                  style={styles.headerAvatar}
                />
                <View style={styles.headerInfo}>
                  <Text style={styles.headerGreeting}>Welcome back,</Text>
                  <Text style={styles.headerName}>{fullName} ⭐</Text>
                  <View style={styles.headerBadges}>
                    <View style={styles.headerBadge}>
                      <Text style={styles.headerBadgeText}>Live / Shop</Text>
                    </View>
                    <View style={styles.headerBadge}>
                      <Text style={styles.headerBadgeText}>{creatorType}</Text>
                    </View>
                  </View>
                  <View style={styles.headerRegions}>
                    <View style={styles.regionBadge}>
                      <Text style={styles.regionBadgeText}>{region}</Text>
                    </View>
                    <View style={styles.regionBadge}>
                      <Text style={styles.regionBadgeText}>Canada</Text>
                    </View>
                  </View>
                </View>
              </View>
              <TouchableOpacity style={styles.headerIcon}>
                <IconSymbol 
                  ios_icon_name="bell.fill" 
                  android_material_icon_name="notifications" 
                  size={24} 
                  color={colors.text} 
                />
              </TouchableOpacity>
            </View>

            {/* DIAMONDS EARNED CARD */}
            <CardPressable onPress={() => console.log('Diamonds tapped')}>
              <LinearGradient
                colors={['#7C3AED', '#A78BFA']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.diamondsCard}
              >
                <View style={styles.diamondsHeader}>
                  <View style={styles.diamondsLeft}>
                    <Text style={styles.diamondsLabel}>DIAMONDS EARNED 💎</Text>
                    <Text style={styles.diamondsValue}>{stats.monthlyDiamonds.toLocaleString()}</Text>
                  </View>
                  <View style={styles.diamondsRight}>
                    <View style={styles.silverBadge}>
                      <Text style={styles.silverBadgeText}>Silver ⭐</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.progressSection}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressTitle}>Progress to Goal</Text>
                    <Text style={styles.progressRemaining}>Remaining: {stats.remaining.toLocaleString()}</Text>
                  </View>
                  <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBarFill, { width: `${Math.min(stats.currentProgress, 100)}%` }]} />
                  </View>
                  <View style={styles.progressFooter}>
                    <View>
                      <Text style={styles.progressLabel}>TOTAL GOAL</Text>
                      <Text style={styles.progressValue}>{stats.targetAmount.toLocaleString()}</Text>
                    </View>
                    <View style={styles.progressRight}>
                      <Text style={styles.progressLabel}>NEXT TIER</Text>
                      <Text style={styles.progressValue}>{stats.nextTarget}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.bonusSection}>
                  <Text style={styles.bonusTitle}>Bonus Forecast</Text>
                  <Text style={styles.bonusSubtitle}>Upcoming bonus: ${bonusForecast}</Text>
                  <Text style={styles.bonusNext}>Next bonus ${bonusForecast + 75}</Text>
                  <View style={styles.bonusProgressBar}>
                    <View style={[styles.bonusProgressFill, { width: '60%' }]} />
                  </View>
                  <View style={styles.bonusRequirements}>
                    <Text style={styles.bonusRequirement}>REQUIREMENTS</Text>
                    <View style={styles.bonusStats}>
                      <View style={styles.bonusStat}>
                        <Text style={styles.bonusStatLabel}>LIVE Days</Text>
                        <Text style={styles.bonusStatValue}>{stats.liveDays} / 15</Text>
                      </View>
                      <View style={styles.bonusStat}>
                        <Text style={styles.bonusStatLabel}>LIVE Hours</Text>
                        <Text style={styles.bonusStatValue}>{stats.liveHours} / 40</Text>
                      </View>
                      <View style={styles.bonusStat}>
                        <Text style={styles.bonusStatLabel}>Battles Booked</Text>
                        <Text style={styles.bonusStatValue}>0 / 1 ☐</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </CardPressable>

            {/* 21-DAY CHALLENGE CARD */}
            <CardPressable onPress={() => router.push('/(tabs)/missions')}>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderLeft}>
                    <IconSymbol 
                      ios_icon_name="calendar" 
                      android_material_icon_name="calendar-today" 
                      size={24} 
                      color={colors.primary} 
                    />
                    <Text style={styles.cardTitle}>21-Day Challenge</Text>
                  </View>
                  <View style={styles.pendingBadge}>
                    <Text style={styles.pendingBadgeText}>2 PENDING</Text>
                  </View>
                </View>
                <View style={styles.challengeDays}>
                  <View style={styles.challengeDay}>
                    <View style={styles.challengeDayCircle}>
                      <IconSymbol 
                        ios_icon_name="checkmark" 
                        android_material_icon_name="check" 
                        size={16} 
                        color={colors.success} 
                      />
                    </View>
                    <Text style={styles.challengeDayLabel}>Day 4</Text>
                  </View>
                  <View style={[styles.challengeDay, styles.challengeDayActive]}>
                    <View style={[styles.challengeDayCircle, styles.challengeDayCircleActive]}>
                      <Text style={styles.challengeDayNumber}>5</Text>
                    </View>
                    <Text style={styles.challengeDayLabel}>Today</Text>
                  </View>
                  <View style={styles.challengeDay}>
                    <View style={[styles.challengeDayCircle, styles.challengeDayCircleLocked]}>
                      <IconSymbol 
                        ios_icon_name="lock.fill" 
                        android_material_icon_name="lock" 
                        size={16} 
                        color={colors.textTertiary} 
                      />
                    </View>
                    <Text style={styles.challengeDayLabel}>Day 6</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.continueButton}>
                  <Text style={styles.continueButtonText}>Continue Today&apos;s Task</Text>
                </TouchableOpacity>
              </View>
            </CardPressable>

            {/* ACADEMY CARD */}
            <CardPressable onPress={() => router.push('/(tabs)/learning-hub')}>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderLeft}>
                    <Text style={styles.cardTitle}>Academy</Text>
                  </View>
                  <View style={styles.quizBadge}>
                    <Text style={styles.quizBadgeText}>Quiz: Not started 🔒</Text>
                  </View>
                </View>
                <View style={styles.requiredBadge}>
                  <Text style={styles.requiredBadgeText}>REQUIRED TO COMPLETE</Text>
                </View>
                <View style={styles.academyContent}>
                  <View style={styles.academyLeft}>
                    <Text style={styles.academyProgress}>Progress</Text>
                    <Text style={styles.academyVideos}>{educationProgress} / 12 videos</Text>
                    <View style={styles.academyProgressBar}>
                      <LinearGradient
                        colors={colors.gradientPurple}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.academyProgressFill, { width: `${(educationProgress / 12) * 100}%` }]}
                      />
                    </View>
                    <TouchableOpacity style={styles.continueLink}>
                      <Text style={styles.continueLinkText}>Continue learning →</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.academyRight}>
                    <Image
                      source={{ uri: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&h=200&fit=crop' }}
                      style={styles.academyThumbnail}
                    />
                    <View style={styles.playButton}>
                      <IconSymbol 
                        ios_icon_name="play.fill" 
                        android_material_icon_name="play-arrow" 
                        size={20} 
                        color={colors.text} 
                      />
                    </View>
                  </View>
                </View>
              </View>
            </CardPressable>

            {/* MANAGER CARD */}
            <CardPressable onPress={() => console.log('Manager tapped')}>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderLeft}>
                    <Image
                      source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop' }}
                      style={styles.managerAvatar}
                    />
                    <View>
                      <Text style={styles.managerLabel}>MANAGER</Text>
                      <Text style={styles.managerName}>Michael Chen</Text>
                      <View style={styles.managerStatus}>
                        <View style={styles.managerStatusDot} />
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.emailButton}>
                    <IconSymbol 
                      ios_icon_name="envelope.fill" 
                      android_material_icon_name="email" 
                      size={20} 
                      color={colors.primary} 
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </CardPressable>

            {/* VS BATTLE CARD */}
            {nextBattle && (
              <CardPressable onPress={() => router.push('/(tabs)/battles')}>
                <View style={styles.card}>
                  <View style={styles.battleHeader}>
                    <Text style={styles.battleTitle}>VS Battle</Text>
                    <Text style={styles.battleSubtitle}>Monesto Airlines</Text>
                  </View>
                  <View style={styles.battleContent}>
                    <View style={styles.battleCreator}>
                      <Image
                        source={{ uri: profileImageUrl }}
                        style={styles.battleAvatar}
                      />
                      <Text style={styles.battleCreatorName}>You</Text>
                    </View>
                    <View style={styles.battleCenter}>
                      <Text style={styles.battleStarting}>STARTING IN</Text>
                      <Text style={styles.battleTimer}>14:02:10</Text>
                      <Text style={styles.battleDate}>TOMORROW</Text>
                    </View>
                    <View style={styles.battleCreator}>
                      <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop' }}
                        style={styles.battleAvatar}
                      />
                      <View style={styles.battleProBadge}>
                        <Text style={styles.battleProBadgeText}>PRO</Text>
                      </View>
                      <Text style={styles.battleCreatorName}>@AlexD</Text>
                    </View>
                  </View>
                  <View style={styles.battleFooter}>
                    <Text style={styles.battlePoints}>••••• 1001</Text>
                  </View>
                </View>
              </CardPressable>
            )}
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
      toValue: 0.97,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  headerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  headerInfo: {
    flex: 1,
  },
  headerGreeting: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: colors.textSecondary,
    marginBottom: 2,
  },
  headerName: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    color: colors.text,
    marginBottom: 6,
  },
  headerBadges: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6,
  },
  headerBadge: {
    backgroundColor: colors.grey,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  headerBadgeText: {
    fontSize: 11,
    fontFamily: 'Poppins_500Medium',
    color: colors.text,
  },
  headerRegions: {
    flexDirection: 'row',
    gap: 6,
  },
  regionBadge: {
    backgroundColor: colors.grey,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  regionBadgeText: {
    fontSize: 11,
    fontFamily: 'Poppins_500Medium',
    color: colors.textSecondary,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.grey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  diamondsCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
  },
  diamondsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  diamondsLeft: {
    flex: 1,
  },
  diamondsLabel: {
    fontSize: 12,
    fontFamily: 'Poppins_600SemiBold',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  diamondsValue: {
    fontSize: 48,
    fontFamily: 'Poppins_700Bold',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  diamondsRight: {
    alignItems: 'flex-end',
  },
  silverBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  silverBadgeText: {
    fontSize: 12,
    fontFamily: 'Poppins_600SemiBold',
    color: '#FFFFFF',
  },
  progressSection: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  progressRemaining: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 11,
    fontFamily: 'Poppins_500Medium',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  progressValue: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    color: '#FFFFFF',
  },
  progressRight: {
    alignItems: 'flex-end',
  },
  bonusSection: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 16,
    padding: 16,
  },
  bonusTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  bonusSubtitle: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
  },
  bonusNext: {
    fontSize: 13,
    fontFamily: 'Poppins_500Medium',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
  },
  bonusProgressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 12,
  },
  bonusProgressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
  },
  bonusRequirements: {
    marginTop: 8,
  },
  bonusRequirement: {
    fontSize: 11,
    fontFamily: 'Poppins_600SemiBold',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  bonusStats: {
    gap: 8,
  },
  bonusStat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bonusStatLabel: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  bonusStatValue: {
    fontSize: 13,
    fontFamily: 'Poppins_600SemiBold',
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: colors.text,
  },
  pendingBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pendingBadgeText: {
    fontSize: 11,
    fontFamily: 'Poppins_600SemiBold',
    color: '#FFFFFF',
  },
  challengeDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  challengeDay: {
    alignItems: 'center',
  },
  challengeDayActive: {
    opacity: 1,
  },
  challengeDayCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.grey,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  challengeDayCircleActive: {
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  challengeDayCircleLocked: {
    opacity: 0.5,
  },
  challengeDayNumber: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    color: '#FFFFFF',
  },
  challengeDayLabel: {
    fontSize: 12,
    fontFamily: 'Poppins_500Medium',
    color: colors.textSecondary,
  },
  continueButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
    color: colors.background,
  },
  quizBadge: {
    backgroundColor: colors.grey,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  quizBadgeText: {
    fontSize: 11,
    fontFamily: 'Poppins_500Medium',
    color: colors.textSecondary,
  },
  requiredBadge: {
    backgroundColor: colors.error,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  requiredBadgeText: {
    fontSize: 10,
    fontFamily: 'Poppins_600SemiBold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  academyContent: {
    flexDirection: 'row',
    gap: 16,
  },
  academyLeft: {
    flex: 1,
  },
  academyProgress: {
    fontSize: 13,
    fontFamily: 'Poppins_500Medium',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  academyVideos: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: colors.text,
    marginBottom: 8,
  },
  academyProgressBar: {
    height: 6,
    backgroundColor: colors.grey,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 12,
  },
  academyProgressFill: {
    height: '100%',
    borderRadius: 6,
  },
  continueLink: {
    marginTop: 4,
  },
  continueLinkText: {
    fontSize: 13,
    fontFamily: 'Poppins_600SemiBold',
    color: colors.primary,
  },
  academyRight: {
    position: 'relative',
  },
  academyThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  managerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  managerLabel: {
    fontSize: 11,
    fontFamily: 'Poppins_500Medium',
    color: colors.textSecondary,
    marginBottom: 2,
  },
  managerName: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: colors.text,
    marginBottom: 4,
  },
  managerStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  managerStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  emailButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.grey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  battleHeader: {
    marginBottom: 16,
  },
  battleTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: colors.text,
    marginBottom: 4,
  },
  battleSubtitle: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: colors.textSecondary,
  },
  battleContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  battleCreator: {
    alignItems: 'center',
    flex: 1,
  },
  battleAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  battleCreatorName: {
    fontSize: 13,
    fontFamily: 'Poppins_600SemiBold',
    color: colors.text,
  },
  battleCenter: {
    alignItems: 'center',
    flex: 1,
  },
  battleStarting: {
    fontSize: 11,
    fontFamily: 'Poppins_500Medium',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  battleTimer: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    color: colors.text,
    marginBottom: 4,
  },
  battleDate: {
    fontSize: 11,
    fontFamily: 'Poppins_500Medium',
    color: colors.textSecondary,
  },
  battleProBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 4,
  },
  battleProBadgeText: {
    fontSize: 10,
    fontFamily: 'Poppins_600SemiBold',
    color: '#FFFFFF',
  },
  battleFooter: {
    alignItems: 'center',
  },
  battlePoints: {
    fontSize: 13,
    fontFamily: 'Poppins_500Medium',
    color: colors.textSecondary,
  },
});
