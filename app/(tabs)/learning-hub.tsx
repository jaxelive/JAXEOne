
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, ResizeMode } from 'expo-video';
import { colors } from '@/styles/commonStyles';
import { supabase } from '@/app/integrations/supabase/client';
import { useCreatorData } from '@/hooks/useCreatorData';
import { IconSymbol } from '@/components/IconSymbol';

interface ChallengeProgress {
  day_number: number;
  is_completed: boolean;
  completed_at?: string;
}

interface EducationProgress {
  video_number: number;
  watched_percentage: number;
  video_completed: boolean;
  quiz_passed: boolean;
  quiz_attempts: number;
  unlocked: boolean;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: number;
}

const EDUCATION_VIDEOS = [
  {
    number: 1,
    title: 'Getting Started with LIVE',
    duration: '8:30',
    videoUrl: 'https://example.com/video1.mp4',
    quiz: [
      {
        question: 'What is the minimum LIVE duration recommended?',
        options: ['30 minutes', '1 hour', '2 hours', '3 hours'],
        correct_answer: 1,
      },
      {
        question: 'How often should you go LIVE?',
        options: ['Once a week', 'Daily', '3-4 times per week', 'Whenever you feel like it'],
        correct_answer: 2,
      },
      {
        question: 'What is the most important metric?',
        options: ['Views', 'Diamonds', 'Engagement', 'Duration'],
        correct_answer: 2,
      },
    ],
  },
  {
    number: 2,
    title: 'Building Your Audience',
    duration: '10:15',
    videoUrl: 'https://example.com/video2.mp4',
    quiz: [
      {
        question: 'What is the best way to grow your audience?',
        options: ['Buy followers', 'Consistent content', 'Spam comments', 'Follow/unfollow'],
        correct_answer: 1,
      },
      {
        question: 'How important is engagement?',
        options: ['Not important', 'Somewhat important', 'Very important', 'Critical'],
        correct_answer: 3,
      },
      {
        question: 'What should you do during LIVE?',
        options: ['Ignore chat', 'Respond to viewers', 'Just perform', 'Read script'],
        correct_answer: 1,
      },
    ],
  },
  {
    number: 3,
    title: 'Maximizing Diamonds',
    duration: '12:00',
    videoUrl: 'https://example.com/video3.mp4',
    quiz: [
      {
        question: 'What encourages diamond gifts?',
        options: ['Begging', 'Quality content', 'Threats', 'Ignoring viewers'],
        correct_answer: 1,
      },
      {
        question: 'When should you thank gifters?',
        options: ['Never', 'End of stream', 'Immediately', 'Next stream'],
        correct_answer: 2,
      },
      {
        question: 'What builds loyalty?',
        options: ['Consistency', 'Randomness', 'Absence', 'Complaints'],
        correct_answer: 0,
      },
    ],
  },
  {
    number: 4,
    title: 'Advanced Strategies',
    duration: '15:20',
    videoUrl: 'https://example.com/video4.mp4',
    quiz: [
      {
        question: 'What is a battle?',
        options: ['Fight', 'Competition', 'Collaboration', 'Argument'],
        correct_answer: 1,
      },
      {
        question: 'How do you prepare for battles?',
        options: ['Wing it', 'Practice', 'Ignore', 'Worry'],
        correct_answer: 1,
      },
      {
        question: 'What matters most in battles?',
        options: ['Winning', 'Participation', 'Learning', 'All of the above'],
        correct_answer: 3,
      },
    ],
  },
  {
    number: 5,
    title: 'Sustaining Success',
    duration: '11:45',
    videoUrl: 'https://example.com/video5.mp4',
    quiz: [
      {
        question: 'How do you avoid burnout?',
        options: ['Stream 24/7', 'Take breaks', 'Ignore health', 'Push harder'],
        correct_answer: 1,
      },
      {
        question: 'What is key to long-term success?',
        options: ['Luck', 'Consistency', 'Shortcuts', 'Complaints'],
        correct_answer: 1,
      },
      {
        question: 'How should you handle setbacks?',
        options: ['Quit', 'Learn and adapt', 'Blame others', 'Give up'],
        correct_answer: 1,
      },
    ],
  },
];

export default function LearningHubScreen() {
  const { creator } = useCreatorData();
  const [activeTab, setActiveTab] = useState<'challenge' | 'education'>('challenge');
  const [challengeProgress, setChallengeProgress] = useState<ChallengeProgress[]>([]);
  const [educationProgress, setEducationProgress] = useState<EducationProgress[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [videoWatchPercentage, setVideoWatchPercentage] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (creator) {
      fetchChallengeProgress();
      fetchEducationProgress();
    }
  }, [creator]);

  const fetchChallengeProgress = async () => {
    if (!creator) return;

    try {
      const { data, error } = await supabase
        .from('learning_challenge_progress')
        .select('*')
        .eq('creator_id', creator.id)
        .order('day_number', { ascending: true });

      if (error) throw error;
      setChallengeProgress(data || []);
    } catch (error: any) {
      console.error('Error fetching challenge progress:', error);
    }
  };

  const fetchEducationProgress = async () => {
    if (!creator) return;

    try {
      const { data, error } = await supabase
        .from('ur_education_progress')
        .select('*')
        .eq('creator_id', creator.id)
        .order('video_number', { ascending: true });

      if (error) throw error;

      // Initialize progress for all videos if not exists
      const allProgress: EducationProgress[] = EDUCATION_VIDEOS.map((video) => {
        const existing = data?.find((p) => p.video_number === video.number);
        return existing || {
          video_number: video.number,
          watched_percentage: 0,
          video_completed: false,
          quiz_passed: false,
          quiz_attempts: 0,
          unlocked: video.number === 1,
        };
      });

      setEducationProgress(allProgress);
    } catch (error: any) {
      console.error('Error fetching education progress:', error);
    }
  };

  const isDayUnlocked = (dayNumber: number): boolean => {
    if (dayNumber === 1) return true;
    const previousDay = challengeProgress.find((p) => p.day_number === dayNumber - 1);
    return previousDay?.is_completed || false;
  };

  const handleCompleteDay = async (dayNumber: number) => {
    if (!creator) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('learning_challenge_progress')
        .upsert({
          creator_id: creator.id,
          day_number: dayNumber,
          is_completed: true,
          completed_at: new Date().toISOString(),
        });

      if (error) throw error;

      Alert.alert('🎉 Success!', `Day ${dayNumber} completed!`, [
        {
          text: 'Continue',
          onPress: () => {
            setSelectedDay(null);
            fetchChallengeProgress();
          },
        },
      ]);
    } catch (error: any) {
      console.error('Error completing day:', error);
      Alert.alert('Error', 'Failed to mark day as completed');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoProgress = async (percentage: number) => {
    setVideoWatchPercentage(percentage);

    if (percentage >= 90 && selectedVideo && creator) {
      const progress = educationProgress.find((p) => p.video_number === selectedVideo);
      if (!progress?.video_completed) {
        try {
          await supabase
            .from('ur_education_progress')
            .upsert({
              creator_id: creator.id,
              video_number: selectedVideo,
              watched_percentage: percentage,
              video_completed: true,
            });

          fetchEducationProgress();
        } catch (error: any) {
          console.error('Error updating video progress:', error);
        }
      }
    }
  };

  const handleSubmitQuiz = async () => {
    if (!creator || !selectedVideo) return;

    const video = EDUCATION_VIDEOS.find((v) => v.number === selectedVideo);
    if (!video) return;

    let correctCount = 0;
    video.quiz.forEach((q, index) => {
      if (quizAnswers[index] === q.correct_answer) {
        correctCount++;
      }
    });

    const score = (correctCount / video.quiz.length) * 100;
    const passed = score >= 70;

    setLoading(true);
    try {
      const progress = educationProgress.find((p) => p.video_number === selectedVideo);
      
      await supabase
        .from('ur_education_progress')
        .upsert({
          creator_id: creator.id,
          video_number: selectedVideo,
          quiz_passed: passed,
          quiz_attempts: (progress?.quiz_attempts || 0) + 1,
          quiz_score: score,
        });

      if (passed) {
        // Unlock next video
        if (selectedVideo < EDUCATION_VIDEOS.length) {
          await supabase
            .from('ur_education_progress')
            .upsert({
              creator_id: creator.id,
              video_number: selectedVideo + 1,
              unlocked: true,
            });
        }

        Alert.alert('🎉 Congratulations!', `You passed with ${score.toFixed(0)}%!`, [
          {
            text: 'Continue',
            onPress: () => {
              setShowQuiz(false);
              setSelectedVideo(null);
              setQuizAnswers([]);
              fetchEducationProgress();
            },
          },
        ]);
      } else {
        Alert.alert('Try Again', `You scored ${score.toFixed(0)}%. You need 70% to pass.`, [
          {
            text: 'Retry',
            onPress: () => {
              setQuizAnswers([]);
              fetchEducationProgress();
            },
          },
        ]);
      }
    } catch (error: any) {
      console.error('Error submitting quiz:', error);
      Alert.alert('Error', 'Failed to submit quiz');
    } finally {
      setLoading(false);
    }
  };

  const completedChallenges = challengeProgress.filter((p) => p.is_completed).length;
  const completedVideos = educationProgress.filter((p) => p.quiz_passed).length;

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Learning Hub',
          headerShown: true,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header */}
        <LinearGradient
          colors={['#FFFFFF', '#DBEAFE']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerCard}
        >
          <Text style={styles.emoji}>🎓</Text>
          <Text style={styles.headerTitle}>Learning Hub</Text>
          <Text style={styles.headerSubtitle}>Master your creator journey</Text>
        </LinearGradient>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'challenge' && styles.activeTab]}
            onPress={() => setActiveTab('challenge')}
          >
            <Text style={[styles.tabText, activeTab === 'challenge' && styles.activeTabText]}>
              21-Day Challenge
            </Text>
            <Text style={[styles.tabBadge, activeTab === 'challenge' && styles.activeTabBadge]}>
              {completedChallenges}/21
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'education' && styles.activeTab]}
            onPress={() => setActiveTab('education')}
          >
            <Text style={[styles.tabText, activeTab === 'education' && styles.activeTabText]}>
              UR Education
            </Text>
            <Text style={[styles.tabBadge, activeTab === 'education' && styles.activeTabBadge]}>
              {completedVideos}/5
            </Text>
          </TouchableOpacity>
        </View>

        {/* 21-Day Challenge */}
        {activeTab === 'challenge' && (
          <View style={styles.section}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressText}>
                {completedChallenges} of 21 days completed
              </Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${(completedChallenges / 21) * 100}%` },
                  ]}
                />
              </View>
            </View>

            <View style={styles.daysGrid}>
              {Array.from({ length: 21 }, (_, i) => i + 1).map((day) => {
                const progress = challengeProgress.find((p) => p.day_number === day);
                const isCompleted = progress?.is_completed || false;
                const isUnlocked = isDayUnlocked(day);

                return (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayCard,
                      isCompleted && styles.dayCardCompleted,
                      !isUnlocked && styles.dayCardLocked,
                    ]}
                    onPress={() => isUnlocked && setSelectedDay(day)}
                    disabled={!isUnlocked}
                  >
                    {isCompleted ? (
                      <IconSymbol
                        ios_icon_name="checkmark.circle.fill"
                        android_material_icon_name="check-circle"
                        size={24}
                        color={colors.success}
                      />
                    ) : !isUnlocked ? (
                      <IconSymbol
                        ios_icon_name="lock.fill"
                        android_material_icon_name="lock"
                        size={20}
                        color={colors.greyDark}
                      />
                    ) : null}
                    <Text
                      style={[
                        styles.dayNumber,
                        isCompleted && styles.dayNumberCompleted,
                        !isUnlocked && styles.dayNumberLocked,
                      ]}
                    >
                      {day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* UR Education */}
        {activeTab === 'education' && (
          <View style={styles.section}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressText}>
                {completedVideos} of 5 videos completed
              </Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${(completedVideos / 5) * 100}%` },
                  ]}
                />
              </View>
            </View>

            {EDUCATION_VIDEOS.map((video) => {
              const progress = educationProgress.find((p) => p.video_number === video.number);
              const isUnlocked = progress?.unlocked || false;
              const isCompleted = progress?.quiz_passed || false;

              return (
                <TouchableOpacity
                  key={video.number}
                  style={[
                    styles.videoCard,
                    isCompleted && styles.videoCardCompleted,
                    !isUnlocked && styles.videoCardLocked,
                  ]}
                  onPress={() => isUnlocked && setSelectedVideo(video.number)}
                  disabled={!isUnlocked}
                >
                  <View style={styles.videoIcon}>
                    {isCompleted ? (
                      <IconSymbol
                        ios_icon_name="checkmark.circle.fill"
                        android_material_icon_name="check-circle"
                        size={32}
                        color={colors.success}
                      />
                    ) : !isUnlocked ? (
                      <IconSymbol
                        ios_icon_name="lock.fill"
                        android_material_icon_name="lock"
                        size={28}
                        color={colors.greyDark}
                      />
                    ) : (
                      <IconSymbol
                        ios_icon_name="play.circle.fill"
                        android_material_icon_name="play-circle"
                        size={32}
                        color={colors.primary}
                      />
                    )}
                  </View>
                  <View style={styles.videoInfo}>
                    <Text
                      style={[
                        styles.videoTitle,
                        !isUnlocked && styles.videoTitleLocked,
                      ]}
                    >
                      {video.number}. {video.title}
                    </Text>
                    <Text style={styles.videoDuration}>{video.duration}</Text>
                    {progress && progress.watched_percentage > 0 && !isCompleted && (
                      <View style={styles.watchProgress}>
                        <View
                          style={[
                            styles.watchProgressFill,
                            { width: `${progress.watched_percentage}%` },
                          ]}
                        />
                      </View>
                    )}
                  </View>
                  <IconSymbol
                    ios_icon_name="chevron.right"
                    android_material_icon_name="chevron-right"
                    size={20}
                    color={colors.textTertiary}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Day Detail Modal */}
        <Modal visible={selectedDay !== null} animationType="slide" presentationStyle="pageSheet">
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Day {selectedDay}</Text>
              <TouchableOpacity onPress={() => setSelectedDay(null)}>
                <IconSymbol
                  ios_icon_name="xmark.circle.fill"
                  android_material_icon_name="cancel"
                  size={28}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContent}>
              <Text style={styles.modalInstructions}>
                Complete today&apos;s challenge to unlock the next day!
              </Text>
              <Text style={styles.modalDescription}>
                Go LIVE for at least 1 hour and engage with your audience. Focus on building
                connections and creating quality content.
              </Text>
              <TouchableOpacity
                style={[styles.completeButton, loading && styles.buttonDisabled]}
                onPress={() => selectedDay && handleCompleteDay(selectedDay)}
                disabled={loading}
              >
                <Text style={styles.completeButtonText}>
                  {loading ? 'Marking...' : 'Mark as Completed'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>

        {/* Video/Quiz Modal */}
        <Modal
          visible={selectedVideo !== null}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedVideo && EDUCATION_VIDEOS[selectedVideo - 1]?.title}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setSelectedVideo(null);
                  setShowQuiz(false);
                  setQuizAnswers([]);
                }}
              >
                <IconSymbol
                  ios_icon_name="xmark.circle.fill"
                  android_material_icon_name="cancel"
                  size={28}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContent}>
              {!showQuiz ? (
                <>
                  <View style={styles.videoPlaceholder}>
                    <IconSymbol
                      ios_icon_name="play.circle"
                      android_material_icon_name="play-circle-outline"
                      size={64}
                      color={colors.primary}
                    />
                    <Text style={styles.videoPlaceholderText}>
                      Video player would appear here
                    </Text>
                    <Text style={styles.videoPlaceholderSubtext}>
                      Watch at least 90% to unlock the quiz
                    </Text>
                  </View>
                  <View style={styles.watchProgressContainer}>
                    <Text style={styles.watchProgressText}>
                      Watch Progress: {videoWatchPercentage.toFixed(0)}%
                    </Text>
                    <View style={styles.watchProgressBar}>
                      <View
                        style={[
                          styles.watchProgressBarFill,
                          { width: `${videoWatchPercentage}%` },
                        ]}
                      />
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.quizButton,
                      videoWatchPercentage < 90 && styles.buttonDisabled,
                    ]}
                    onPress={() => setShowQuiz(true)}
                    disabled={videoWatchPercentage < 90}
                  >
                    <Text style={styles.quizButtonText}>
                      {videoWatchPercentage < 90
                        ? `Watch ${(90 - videoWatchPercentage).toFixed(0)}% more to unlock quiz`
                        : 'Take Quiz'}
                    </Text>
                  </TouchableOpacity>
                  {/* Simulate video watching */}
                  <TouchableOpacity
                    style={styles.simulateButton}
                    onPress={() => handleVideoProgress(95)}
                  >
                    <Text style={styles.simulateButtonText}>
                      [Demo: Simulate 95% watched]
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.quizTitle}>Quiz Time!</Text>
                  <Text style={styles.quizSubtitle}>You need 70% to pass</Text>
                  {selectedVideo &&
                    EDUCATION_VIDEOS[selectedVideo - 1]?.quiz.map((q, index) => (
                      <View key={index} style={styles.quizQuestion}>
                        <Text style={styles.questionText}>
                          {index + 1}. {q.question}
                        </Text>
                        {q.options.map((option, optIndex) => (
                          <TouchableOpacity
                            key={optIndex}
                            style={[
                              styles.quizOption,
                              quizAnswers[index] === optIndex && styles.quizOptionSelected,
                            ]}
                            onPress={() => {
                              const newAnswers = [...quizAnswers];
                              newAnswers[index] = optIndex;
                              setQuizAnswers(newAnswers);
                            }}
                          >
                            <View
                              style={[
                                styles.radioButton,
                                quizAnswers[index] === optIndex && styles.radioButtonSelected,
                              ]}
                            />
                            <Text style={styles.optionText}>{option}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    ))}
                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      (quizAnswers.length !==
                        (selectedVideo && EDUCATION_VIDEOS[selectedVideo - 1]?.quiz.length) ||
                        loading) &&
                        styles.buttonDisabled,
                    ]}
                    onPress={handleSubmitQuiz}
                    disabled={
                      quizAnswers.length !==
                        (selectedVideo && EDUCATION_VIDEOS[selectedVideo - 1]?.quiz.length) ||
                      loading
                    }
                  >
                    <Text style={styles.submitButtonText}>
                      {loading ? 'Submitting...' : 'Submit Quiz'}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
          </View>
        </Modal>
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
  headerCard: {
    borderRadius: 28,
    padding: 32,
    alignItems: 'center',
    marginBottom: 20,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  tabBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textTertiary,
  },
  activeTabBadge: {
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 24,
  },
  progressHeader: {
    marginBottom: 20,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.greyMedium,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  dayCard: {
    width: '13%',
    aspectRatio: 1,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  dayCardCompleted: {
    backgroundColor: colors.successLight,
    borderColor: colors.success,
  },
  dayCardLocked: {
    backgroundColor: colors.grey,
    opacity: 0.5,
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  dayNumberCompleted: {
    color: colors.success,
  },
  dayNumberLocked: {
    color: colors.greyDark,
  },
  videoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    gap: 16,
  },
  videoCardCompleted: {
    backgroundColor: colors.successLight,
  },
  videoCardLocked: {
    opacity: 0.5,
  },
  videoIcon: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  videoTitleLocked: {
    color: colors.textSecondary,
  },
  videoDuration: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  watchProgress: {
    height: 4,
    backgroundColor: colors.greyMedium,
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  watchProgressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalInstructions: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  modalDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 24,
  },
  completeButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  videoPlaceholder: {
    aspectRatio: 16 / 9,
    backgroundColor: colors.grey,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  videoPlaceholderText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: 12,
  },
  videoPlaceholderSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  watchProgressContainer: {
    marginBottom: 20,
  },
  watchProgressText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  watchProgressBar: {
    height: 8,
    backgroundColor: colors.greyMedium,
    borderRadius: 4,
    overflow: 'hidden',
  },
  watchProgressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  quizButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  quizButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  simulateButton: {
    backgroundColor: colors.greyMedium,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  simulateButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  quizTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  quizSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  quizQuestion: {
    marginBottom: 24,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  quizOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    gap: 12,
  },
  quizOptionSelected: {
    backgroundColor: colors.primaryLight,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.greyDark,
  },
  radioButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  optionText: {
    fontSize: 15,
    color: colors.text,
    flex: 1,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
