import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from '../../navigation/types';
import { useStudyStore } from '../../store/studyStore';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';

type Props = BottomTabScreenProps<MainTabParamList, 'Learn'>;

// TODO: replace with real subject data from API / store
const MOCK_SUBJECTS = [
  { id: 'math', name: 'Math', mastery: 72, topicCount: 12, color: '#6C63FF', icon: '📐' },
  { id: 'reading', name: 'Reading', mastery: 58, topicCount: 8, color: '#FF6584', icon: '📖' },
  { id: 'writing', name: 'Writing', mastery: 85, topicCount: 6, color: '#4CAF50', icon: '✍️' },
  { id: 'science', name: 'Science', mastery: 40, topicCount: 10, color: '#FF9800', icon: '🔬' },
];

interface SubjectItem {
  id: string;
  name: string;
  mastery: number;
  topicCount: number;
  color: string;
  icon: string;
}

export function LearnScreen({ navigation }: Props): React.JSX.Element {
  const currentExamType = useStudyStore((s) => s.currentExamType);

  function renderSubject({ item }: { item: SubjectItem }) {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          (navigation as any).navigate('TopicList', {
            subjectId: item.id,
            subjectName: item.name,
          })
        }
        activeOpacity={0.8}
      >
        <View style={[styles.cardAccent, { backgroundColor: item.color }]} />
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.icon}>{item.icon}</Text>
            <View style={styles.cardInfo}>
              <Text style={styles.subjectName}>{item.name}</Text>
              <Text style={styles.topicCount}>{item.topicCount} topics</Text>
            </View>
            <Text style={[styles.masteryPct, { color: item.color }]}>{item.mastery}%</Text>
          </View>

          <View style={styles.masteryTrack}>
            <View
              style={[
                styles.masteryFill,
                { width: `${item.mastery}%`, backgroundColor: item.color },
              ]}
            />
          </View>

          <View style={styles.masteryLabel}>
            <Text style={styles.masteryLabelText}>
              {item.mastery < 40 ? '🔴 Needs work' : item.mastery < 70 ? '🟡 Progressing' : '🟢 Strong'}
            </Text>
            <Text style={styles.continueText}>Continue →</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Learn</Text>
        {currentExamType && (
          <View style={styles.examBadge}>
            <Text style={styles.examBadgeText}>{currentExamType}</Text>
          </View>
        )}
      </View>

      <FlatList
        data={MOCK_SUBJECTS}
        keyExtractor={(item) => item.id}
        renderItem={renderSubject}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize3xl,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
  },
  examBadge: {
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  examBadgeText: {
    fontSize: typography.fontSizeSm,
    color: colors.primary,
    fontWeight: typography.fontWeightSemiBold,
  },
  list: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  cardAccent: {
    width: 4,
  },
  cardContent: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  icon: {
    fontSize: 28,
  },
  cardInfo: {
    flex: 1,
  },
  subjectName: {
    fontSize: typography.fontSizeLg,
    fontWeight: typography.fontWeightSemiBold,
    color: colors.textPrimary,
  },
  topicCount: {
    fontSize: typography.fontSizeSm,
    color: colors.textSecondary,
  },
  masteryPct: {
    fontSize: typography.fontSizeXl,
    fontWeight: typography.fontWeightBold,
  },
  masteryTrack: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
  },
  masteryFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  masteryLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  masteryLabelText: {
    fontSize: typography.fontSizeSm,
    color: colors.textSecondary,
  },
  continueText: {
    fontSize: typography.fontSizeSm,
    color: colors.primary,
    fontWeight: typography.fontWeightMedium,
  },
});
