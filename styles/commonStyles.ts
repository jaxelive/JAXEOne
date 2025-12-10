
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

// Modern, fresh color palette with soft pastels and vibrant accents
export const colors = {
  // Primary gradient colors - soft purple/pink blend
  primary: '#8B5CF6',           // Vibrant purple
  primaryLight: '#C084FC',      // Light purple
  primaryDark: '#7C3AED',       // Deep purple
  
  // Accent colors - fresh and youthful
  accent: '#EC4899',            // Pink accent
  accentLight: '#F9A8D4',       // Light pink
  
  // Secondary colors
  secondary: '#06B6D4',         // Cyan
  secondaryLight: '#67E8F9',    // Light cyan
  
  // Background colors - soft and clean
  background: '#FAFAFA',        // Very light grey (almost white)
  backgroundAlt: '#FFFFFF',     // Pure white for cards
  backgroundGradientStart: '#FAF5FF', // Very light purple
  backgroundGradientEnd: '#FDF4FF',   // Very light pink
  
  // Text colors
  text: '#1F2937',              // Dark grey (softer than black)
  textSecondary: '#6B7280',     // Medium grey
  textTertiary: '#9CA3AF',      // Light grey
  
  // UI elements
  grey: '#F3F4F6',              // Very light grey
  greyMedium: '#E5E7EB',        // Medium grey
  greyDark: '#9CA3AF',          // Dark grey
  
  // Status colors - vibrant and friendly
  success: '#10B981',           // Green
  successLight: '#6EE7B7',      // Light green
  warning: '#F59E0B',           // Orange
  warningLight: '#FCD34D',      // Light orange
  error: '#EF4444',             // Red
  errorLight: '#FCA5A5',        // Light red
  
  // Special colors
  border: '#F3F4F6',            // Very light border
  shadow: 'rgba(139, 92, 246, 0.1)', // Soft purple shadow
  overlay: 'rgba(0, 0, 0, 0.3)', // Dark overlay
  
  // Gradient colors for cards
  gradientPurple: ['#8B5CF6', '#C084FC'],
  gradientPink: ['#EC4899', '#F9A8D4'],
  gradientCyan: ['#06B6D4', '#67E8F9'],
  gradientSunset: ['#F59E0B', '#EC4899'],
  gradientOcean: ['#06B6D4', '#8B5CF6'],
};

export const buttonStyles = StyleSheet.create({
  instructionsButton: {
    backgroundColor: colors.primary,
    alignSelf: 'center',
    width: '100%',
  },
  backButton: {
    backgroundColor: colors.backgroundAlt,
    alignSelf: 'center',
    width: '100%',
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 24,
    textAlign: 'center',
  },
  section: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 24,
    padding: 20,
    marginVertical: 8,
    width: '100%',
    boxShadow: '0px 8px 24px rgba(139, 92, 246, 0.08)',
    elevation: 4,
  },
  icon: {
    width: 60,
    height: 60,
    tintColor: colors.primary,
  },
});
