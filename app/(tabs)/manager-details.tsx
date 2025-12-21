
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';

// TEMPORARY DATA - Ivan Martinez
const TEMP_MANAGER = {
  firstName: 'Ivan',
  lastName: 'Martinez',
  role: 'Creator Manager',
  email: 'ivan@jaxe.co',
  whatsapp: '+1 (305) 555-0199',
  tiktok: '@ivan.jaxe',
  profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
};

export default function ManagerDetailsScreen() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const handleTikTokPress = () => {
    const url = `https://www.tiktok.com/${TEMP_MANAGER.tiktok}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open TikTok');
    });
  };

  const handleEmailPress = () => {
    Linking.openURL(`mailto:${TEMP_MANAGER.email}`).catch(() => {
      Alert.alert('Error', 'Could not open email app');
    });
  };

  const handleWhatsAppPress = () => {
    const phoneNumber = TEMP_MANAGER.whatsapp.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${phoneNumber}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open WhatsApp');
    });
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Manager Details',
          headerShown: true,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: TEMP_MANAGER.profilePhoto }}
              style={styles.profileImage}
            />
            <View style={styles.onlineIndicator} />
          </View>

          <Text style={styles.managerName}>
            {TEMP_MANAGER.firstName} {TEMP_MANAGER.lastName}
          </Text>

          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>{TEMP_MANAGER.role.toUpperCase()}</Text>
          </View>
        </View>

        {/* Contact Options */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Contact Options</Text>

          {/* TikTok */}
          <TouchableOpacity style={styles.contactCard} onPress={handleTikTokPress}>
            <View style={styles.contactIconContainer}>
              <IconSymbol
                ios_icon_name="music.note"
                android_material_icon_name="music-note"
                size={24}
                color={colors.primary}
              />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>TikTok</Text>
              <Text style={styles.contactValue}>{TEMP_MANAGER.tiktok}</Text>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={20}
              color={colors.textTertiary}
            />
          </TouchableOpacity>

          {/* Email */}
          <TouchableOpacity style={styles.contactCard} onPress={handleEmailPress}>
            <View style={styles.contactIconContainer}>
              <IconSymbol
                ios_icon_name="envelope.fill"
                android_material_icon_name="email"
                size={24}
                color={colors.primary}
              />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>{TEMP_MANAGER.email}</Text>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={20}
              color={colors.textTertiary}
            />
          </TouchableOpacity>

          {/* WhatsApp */}
          <TouchableOpacity style={styles.contactCard} onPress={handleWhatsAppPress}>
            <View style={styles.contactIconContainer}>
              <IconSymbol
                ios_icon_name="message.fill"
                android_material_icon_name="chat"
                size={24}
                color={colors.primary}
              />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>WhatsApp</Text>
              <Text style={styles.contactValue}>{TEMP_MANAGER.whatsapp}</Text>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={20}
              color={colors.textTertiary}
            />
          </TouchableOpacity>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <IconSymbol
            ios_icon_name="info.circle.fill"
            android_material_icon_name="info"
            size={24}
            color={colors.primary}
          />
          <Text style={styles.infoText}>
            Your manager is here to support you on your creator journey. Feel free to reach out with any questions or concerns.
          </Text>
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
  profileCard: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: colors.primary,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.success,
    borderWidth: 4,
    borderColor: colors.backgroundAlt,
  },
  managerName: {
    fontSize: 26,
    fontFamily: 'Poppins_700Bold',
    color: colors.text,
    marginBottom: 12,
  },
  roleBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  roleBadgeText: {
    fontSize: 12,
    fontFamily: 'Poppins_700Bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  contactSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: colors.text,
    marginBottom: 16,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  contactIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.grey,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 13,
    fontFamily: 'Poppins_500Medium',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
    color: colors.text,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    padding: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
