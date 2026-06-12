import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from '../../navigation/types';
import { colors, typography, spacing, borderRadius, shadows } from '../../constants/theme';

type Props = BottomTabScreenProps<MainTabParamList, 'Practice'>;

interface PracticeMode {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  stat: string;
  statLabel: string;
}

const PRACTICE_MODES: PracticeMode[] = [
  {
    id: 'flashcards',
    title: 'Flashcards',
    description: 'Spaced repetition for long-term memory',
    icon: '🃏',
    color: '#6C63FF',
    stat: '24',
    statLabel: 'due today',
  },
  {
    id: 'quick-quiz',
    title: 'Quick Quiz',
    description: '10 questions, instant feedback',
    icon: '⚡',
    color: '#FF9800',
    stat: '85%',
    statLabel: 'avg score',
  },
  {
    id: 'mock-exam',
    title: 'Mock Exam',
    description: 'Full timed practice test',
    icon: '📝',
    color: '#FF6584',
    stat: '2',
    statLabel: 'completed',
  },
  {
    id: 'past-papers',
    title: 'Past Papers',
    description: 'Real exam questions from previous years',
    icon: '📄',
    color: '#4CAF50',
    stat: '12',
    statLabel: 'available',
  },
];

export function PracticeHubScreen({ navigation }: Props): React.JSX.Element {
  function handlePress(mode: PracticeMode) {
    if (mode.id === 'flashcards') {
      (navigation as any).navigate('Flashcard', { subtopicId: 'default', title: 'Flashcards' });
    } else if (mode.id === 'quick-quiz') {
      (navigation as any).navigate('Quiz', { title: 'Quick Quiz' });
    }
    // TODO: implement mock exam and past papers navigation
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Practice</Text>
          <Text style={styles.subtitle}>Choose how you want to study today</Text>
        </View>

        {/* Daily challenge banner */}
        <View style={styles.dailyBanner}>
          <Text style={styles.dailyIcon}>🎯</Text>
          <View style={styles.dailyInfo}>
            <Text style={styles.dailyTitle}>Daily Challenge</Text>
            <Text style={styles.dailyDesc}>5 mixed questions • +50 XP</Text>
          </View>
          <TouchableOpacity style={styles.dailyBtn} activeOpacity={0.85}>
            <Text style={styles.dailyBtnText}>Start</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          {PRACTICE_MODES.map((mode) => (
            <TouchableOpacity
              key={mode.id}
              style={styles.card}
              onPress={() => handlePress(mode)}
              activeOpacity={0.8}
            >
              <View style={[styles.cardIconBg, { backgroundColor: mode.color + '20' }]}>
                <Text style={styles.cardIcon}>{mode.icon}</Text>
              </View>
              <Text style={styles.cardTitle}>{mode.title}</Text>
              <Text style={styles.cardDescription}>{mode.description}</Text>
              <View style={styles.cardStat}>
                <Text style={[styles.statNumber, { color: mode.color }]}>{mode.stat}</Text>
                <Text style={styles.statLabel}>{mode.statLabel}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Sessions</Text>
          {[
            { subject: 'Math', score: '8/10', time: '2h ago', type: 'Quiz' },
            { subject: 'Reading', score: '15 cards', time: 'Yesterday', type: 'Flashcards' },
          ].map((session, i) => (
            <View key={i} style={styles.sessionRow}>
              <Text style={styles.sessionType}>{session.type}</Text>
              <Text style={styles.sessionSubject}>{session.subject}</Text>
              <Text style={styles.sessionScore}>{session.score}</Text>
              <Text style={styles.sessionTime}>{session.time}</Text>
            </View>
          ))}
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
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize3xl,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: typography.fontSizeMd,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  dailyBanner: {
    marginHorizontal: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  dailyIcon: {
    fontSize: 28,
  },
  dailyInfo: {
    flex: 1,
  },
  dailyTitle: {
    fontSize: typography.fontSizeMd,
    fontWeight: typography.fontWeightSemiBold,
    color: colors.textPrimary,
  },
  dailyDesc: {
    fontSize: typography.fontSizeSm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  dailyBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  dailyBtnText: {
    color: colors.textPrimary,
    fontSize: typography.fontSizeSm,
    fontWeight: typography.fontWeightBold,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  card: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadows.sm,
  },
  cardIconBg: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIcon: {
    fontSize: 24,
  },
  cardTitle: {
    fontSize: typography.fontSizeMd,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
  },
  cardDescription: {
    fontSize: typography.fontSizeXs,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  cardStat: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginTop: spacing.sm,
  },
  statNumber: {
    fontSize: typography.fontSizeLg,
    fontWeight: typography.fontWeightBold,
  },
  statLabel: {
    fontSize: typography.fontSizeXs,
    color: colors.textMuted,
  },
  recentSection: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  sectionTitle: {
    fontSize: typography.fontSizeLg,
    fontWeight: typography.fontWeightSemiBold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  sessionType: {
    fontSize: typography.fontSizeXs,
    color: colors.primary,
    fontWeight: typography.fontWeightMedium,
    width: 70,
  },
  sessionSubject: {
    flex: 1,
    fontSize: typography.fontSizeSm,
    color: colors.textPrimary,
    fontWeight: typography.fontWeightMedium,
  },
  sessionScore: {
    fontSize: typography.fontSizeSm,
    color: colors.success,
    fontWeight: typography.fontWeightSemiBold,
  },
  sessionTime: {
    fontSize: typography.fontSizeXs,
    color: colors.textMuted,
    width: 60,
    textAlign: 'right',
  },
});
