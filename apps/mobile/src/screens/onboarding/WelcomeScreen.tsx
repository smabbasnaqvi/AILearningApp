import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import type { AuthScreenProps } from '../../navigation/types';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type Props = AuthScreenProps<'Welcome'>;

export function WelcomeScreen({ navigation }: Props): React.JSX.Element {
  const features = [
    { icon: '🤖', text: 'Adaptive AI Tutoring' },
    { icon: '🃏', text: 'Spaced Repetition Flashcards' },
    { icon: '📊', text: 'Track Your Progress' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        <View style={styles.heroSection}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoEmoji}>🧠</Text>
          </View>
          <Text style={styles.title}>Master Your Exam</Text>
          <Text style={styles.subtitle}>
            AI-powered personalized learning for SAT, ACT, A-Levels & IB
          </Text>
        </View>

        <View style={styles.featuresSection}>
          {features.map((feature) => (
            <View key={feature.text} style={styles.featureRow}>
              <View style={styles.featureIconContainer}>
                <Text style={styles.featureIcon}>{feature.icon}</Text>
              </View>
              <Text style={styles.featureText}>{feature.text}</Text>
              <Text style={styles.checkmark}>✓</Text>
            </View>
          ))}
        </View>

        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('ExamTypeSelection')}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('ExamTypeSelection')}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryButtonText}>I already have an account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xxl,
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: SCREEN_HEIGHT * 0.06,
    paddingBottom: spacing.xxxl,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.xxl,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  logoEmoji: {
    fontSize: 52,
  },
  title: {
    fontSize: typography.fontSize3xl,
    fontWeight: typography.fontWeightExtraBold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: typography.fontSizeMd,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeightLg,
    paddingHorizontal: spacing.lg,
  },
  featuresSection: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginBottom: spacing.xxxl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  featureIconContainer: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  featureIcon: {
    fontSize: 18,
  },
  featureText: {
    flex: 1,
    fontSize: typography.fontSizeMd,
    fontWeight: typography.fontWeightMedium,
    color: colors.textPrimary,
  },
  checkmark: {
    fontSize: typography.fontSizeLg,
    color: colors.success,
    fontWeight: typography.fontWeightBold,
  },
  actionsSection: {
    gap: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: typography.fontSizeLg,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  secondaryButtonText: {
    fontSize: typography.fontSizeMd,
    color: colors.primary,
    fontWeight: typography.fontWeightMedium,
  },
});
