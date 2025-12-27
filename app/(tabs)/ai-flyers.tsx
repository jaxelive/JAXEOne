
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Image, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { colors } from '@/styles/commonStyles';
import { supabase } from '@/app/integrations/supabase/client';
import { useCreatorData } from '@/hooks/useCreatorData';
import { IconSymbol } from '@/components/IconSymbol';

interface BattleOption {
  id: string;
  creator_1_handle: string;
  creator_2_handle: string;
  battle_date: string;
  battle_time: string;
}

const THEMES = [
  { id: 'warrior', name: 'Warrior', emoji: '⚔️', gradient: ['#FF6B6B', '#FF8E53'] },
  { id: 'tiktok', name: 'TikTok', emoji: '🎵', gradient: ['#00F2EA', '#FF0050'] },
  { id: 'galaxy', name: 'Galaxy', emoji: '🌌', gradient: ['#667EEA', '#764BA2'] },
  { id: 'minimal', name: 'Minimal', emoji: '✨', gradient: ['#F5F5F5', '#E0E0E0'] },
  { id: 'neon', name: 'Neon', emoji: '💫', gradient: ['#FF00FF', '#00FFFF'] },
  { id: 'sunset', name: 'Sunset', emoji: '🌅', gradient: ['#FF6B6B', '#FFD93D'] },
];

export default function AIFlyersScreen() {
  const { creator } = useCreatorData();
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState(new Date());
  const [eventTime, setEventTime] = useState(new Date());
  const [creatorHandles, setCreatorHandles] = useState('');
  const [notes, setNotes] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedFlyer, setGeneratedFlyer] = useState<string | null>(null);
  const [battles, setBattles] = useState<BattleOption[]>([]);
  const [selectedBattle, setSelectedBattle] = useState<BattleOption | null>(null);

  const fetchUpcomingBattles = useCallback(async () => {
    if (!creator) return;

    try {
      const { data, error } = await supabase
        .from('battles_calendar')
        .select('*')
        .or(`creator_1_id.eq.${creator.id},creator_2_id.eq.${creator.id}`)
        .gte('battle_date', new Date().toISOString())
        .order('battle_date', { ascending: true })
        .limit(10);

      if (error) throw error;
      setBattles(data || []);
    } catch (error: any) {
      console.error('Error fetching battles:', error);
    }
  }, [creator]);

  useEffect(() => {
    fetchUpcomingBattles();
  }, [creator]);



  const handleSelectBattle = (battle: BattleOption) => {
    setSelectedBattle(battle);
    setEventTitle(`Battle: ${battle.creator_1_handle} vs ${battle.creator_2_handle}`);
    setCreatorHandles(`${battle.creator_1_handle}, ${battle.creator_2_handle}`);
    setEventDate(new Date(battle.battle_date));
    const [hours, minutes] = battle.battle_time.split(':');
    const time = new Date();
    time.setHours(parseInt(hours), parseInt(minutes));
    setEventTime(time);
  };

  const generateFlyer = async () => {
    if (!eventTitle.trim()) {
      Alert.alert('Error', 'Please enter an event title');
      return;
    }

    setLoading(true);
    try {
      // Show integration instructions
      Alert.alert(
        'AI Flyer Generation',
        'To generate AI flyers with Google Gemini or similar AI services:\n\n1. Click the Integration button in Natively\n2. Select "Image Generation" integration\n3. Connect your AI service (Google Gemini, DALL-E, etc.)\n4. Return here to generate flyers\n\nFor now, we\'ll show you a preview of what your flyer will look like.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Simulate flyer generation with a preview
              setGeneratedFlyer('preview');
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Error generating flyer:', error);
      Alert.alert('Error', 'Failed to generate flyer');
    } finally {
      setLoading(false);
    }
  };

  const saveToGallery = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant permission to save to gallery');
        return;
      }

      Alert.alert(
        'Save to Gallery',
        'Once AI integration is complete, your flyer will be saved to your device gallery automatically.',
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      console.error('Error saving to gallery:', error);
      Alert.alert('Error', 'Failed to save to gallery');
    }
  };

  const shareFlyer = async () => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Error', 'Sharing is not available on this device');
        return;
      }

      Alert.alert(
        'Share Flyer',
        'Once AI integration is complete, you\'ll be able to share your flyer directly to social media, messaging apps, and more!',
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      console.error('Error sharing flyer:', error);
      Alert.alert('Error', 'Failed to share flyer');
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'AI Flyers',
          headerShown: true,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header */}
        <LinearGradient
          colors={['#FFFFFF', '#E9D5FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerCard}
        >
          <Text style={styles.emoji}>✨</Text>
          <Text style={styles.headerTitle}>AI Flyer Generator</Text>
          <Text style={styles.headerSubtitle}>Create stunning promotional flyers with AI</Text>
        </LinearGradient>

        {/* Pre-booked Battles */}
        {battles.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select a Battle</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.battleScroll}>
              {battles.map((battle) => (
                <TouchableOpacity
                  key={battle.id}
                  style={[
                    styles.battleOption,
                    selectedBattle?.id === battle.id && styles.battleOptionSelected,
                  ]}
                  onPress={() => handleSelectBattle(battle)}
                >
                  <Text style={styles.battleOptionText}>
                    {battle.creator_1_handle} vs {battle.creator_2_handle}
                  </Text>
                  <Text style={styles.battleOptionDate}>
                    {new Date(battle.battle_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Theme Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Theme</Text>
          <View style={styles.themeGrid}>
            {THEMES.map((theme) => (
              <TouchableOpacity
                key={theme.id}
                style={[
                  styles.themeCard,
                  selectedTheme.id === theme.id && styles.themeCardSelected,
                ]}
                onPress={() => setSelectedTheme(theme)}
              >
                <LinearGradient
                  colors={theme.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.themeGradient}
                >
                  <Text style={styles.themeEmoji}>{theme.emoji}</Text>
                </LinearGradient>
                <Text style={styles.themeName}>{theme.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Event Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Event Details</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Event Title</Text>
            <TextInput
              style={styles.input}
              value={eventTitle}
              onChangeText={setEventTitle}
              placeholder="Battle Night 2024"
              placeholderTextColor={colors.textTertiary}
            />
          </View>

          <TouchableOpacity
            style={styles.inputButton}
            onPress={() => setShowDatePicker(true)}
          >
            <IconSymbol ios_icon_name="calendar" android_material_icon_name="calendar-today" size={20} color={colors.primary} />
            <Text style={styles.inputButtonText}>{formatDate(eventDate)}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={eventDate}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (date) setEventDate(date);
              }}
            />
          )}

          <TouchableOpacity
            style={styles.inputButton}
            onPress={() => setShowTimePicker(true)}
          >
            <IconSymbol ios_icon_name="clock" android_material_icon_name="access-time" size={20} color={colors.primary} />
            <Text style={styles.inputButtonText}>{formatTime(eventTime)}</Text>
          </TouchableOpacity>

          {showTimePicker && (
            <DateTimePicker
              value={eventTime}
              mode="time"
              display="default"
              onChange={(event, time) => {
                setShowTimePicker(Platform.OS === 'ios');
                if (time) setEventTime(time);
              }}
            />
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Creator Handles (comma separated)</Text>
            <TextInput
              style={styles.input}
              value={creatorHandles}
              onChangeText={setCreatorHandles}
              placeholder="@creator1, @creator2"
              placeholderTextColor={colors.textTertiary}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Additional Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any special details..."
              placeholderTextColor={colors.textTertiary}
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        {/* Generate Button */}
        <TouchableOpacity
          style={[styles.generateButton, loading && styles.buttonDisabled]}
          onPress={generateFlyer}
          disabled={loading}
        >
          <LinearGradient
            colors={colors.gradientPurple}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientButton}
          >
            <IconSymbol ios_icon_name="sparkles" android_material_icon_name="auto-awesome" size={24} color="#FFFFFF" />
            <Text style={styles.generateButtonText}>
              {loading ? 'Generating...' : 'Generate Flyer'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Generated Flyer Preview */}
        {generatedFlyer && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Flyer Preview</Text>
            <View style={styles.flyerPreview}>
              <LinearGradient
                colors={selectedTheme.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.flyerGradient}
              >
                <Text style={styles.flyerEmoji}>{selectedTheme.emoji}</Text>
                <Text style={styles.flyerTitle}>{eventTitle}</Text>
                <Text style={styles.flyerDate}>{formatDate(eventDate)}</Text>
                <Text style={styles.flyerTime}>{formatTime(eventTime)}</Text>
                {creatorHandles && (
                  <Text style={styles.flyerCreators}>{creatorHandles}</Text>
                )}
                {notes && (
                  <Text style={styles.flyerNotes}>{notes}</Text>
                )}
              </LinearGradient>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton} onPress={saveToGallery}>
                <IconSymbol ios_icon_name="arrow.down.circle" android_material_icon_name="download" size={24} color={colors.primary} />
                <Text style={styles.actionButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={shareFlyer}>
                <IconSymbol ios_icon_name="square.and.arrow.up" android_material_icon_name="share" size={24} color={colors.primary} />
                <Text style={styles.actionButtonText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  battleScroll: {
    marginBottom: 8,
  },
  battleOption: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    minWidth: 180,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  battleOptionSelected: {
    borderColor: colors.primary,
  },
  battleOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  battleOptionDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  themeCard: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  themeCardSelected: {
    borderColor: colors.primary,
  },
  themeGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  themeName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    paddingVertical: 8,
    backgroundColor: colors.backgroundAlt,
  },
  inputContainer: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  inputButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  generateButton: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    gap: 12,
  },
  generateButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  flyerPreview: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 16,
    aspectRatio: 9 / 16,
  },
  flyerGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  flyerEmoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  flyerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  flyerDate: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  flyerTime: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  flyerCreators: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  flyerNotes: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
});
