import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import type { LearnStackScreenProps } from '../../navigation/types';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';

type Props = LearnStackScreenProps<'TopicList'>;

interface SubtopicData {
  id: string;
  name: string;
  completed: boolean;
}

interface TopicData {
  id: string;
  name: string;
  subtopics: SubtopicData[];
  mastery: number;
  status: 'locked' | 'in-progress' | 'completed';
}

function generateTopics(subjectName: string): TopicData[] {
  const topicNames: Record<string, string[]> = {
    Math: ['Algebra', 'Geometry', 'Trigonometry', 'Statistics', 'Calculus', 'Number Theory'],
    Reading: ['Main Idea', 'Inference', 'Vocabulary in Context', 'Text Structure', 'Author Purpose', 'Evidence'],
    Writing: ['Grammar', 'Punctuation', 'Sentence Structure', 'Essay Organization', 'Style', 'Revision'],
    default: ['Fundamentals', 'Core Concepts', 'Applications', 'Advanced Topics', 'Problem Solving', 'Review'],
  };

  const names = topicNames[subjectName] ?? topicNames['default'];

  return names.map((name, i) => ({
    id: `topic-${i + 1}`,
    name,
    mastery: i === 0 ? 85 : i === 1 ? 60 : i === 2 ? 30 : 0,
    status: i === 0 ? 'completed' : i <= 2 ? 'in-progress' : 'locked',
    subtopics: [
      { id: `${i}-1`, name: `${name} Basics`, completed: i === 0 },
      { id: `${i}-2`, name: `${name} Practice`, completed: i === 0 },
      { id: `${i}-3`, name: `${name} Advanced`, completed: false },
    ],
  }));
}

export function TopicListScreen({ navigation, route }: Props): React.JSX.Element {
  const { subjectId, subjectName } = route.params;
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);

  const topics = generateTopics(subjectName);
  const completedCount = topics.filter((t) => t.status === 'completed').length;
  const overallMastery = Math.round(topics.reduce((sum, t) => sum + t.mastery, 0) / topics.length);

  function toggleTopic(topicId: string, status: TopicData['status']): void {
    if (status === 'locked') return;
    setExpandedTopicId(expandedTopicId === topicId ? null : topicId);
  }

  function getStatusIcon(status: TopicData['status']): string {
    if (status === 'completed') return '✓';
    if (status === 'in-progress') return '▶';
    return '🔒';
  }

  function getStatusColor(status: TopicData['status']): string {
    if (status === 'completed') return colors.success;
    if (status === 'in-progress') return colors.primary;
    return colors.textMuted;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Overview Card */}
        <View style={styles.overviewCard}>
          <View style={styles.overviewStats}>
            <View style={styles.overviewStat}>
              <Text style={styles.overviewStatValue}>{overallMastery}%</Text>
              <Text style={styles.overviewStatLabel}>Mastery</Text>
            </View>
            <View style={styles.overviewDivider} />
            <View style={styles.overviewStat}>
              <Text style={styles.overviewStatValue}>{completedCount}/{topics.length}</Text>
              <Text style={styles.overviewStatLabel}>Completed</Text>
            </View>
            <View style={styles.overviewDivider} />
            <View style={styles.overviewStat}>
              <Text style={styles.overviewStatValue}>{topics.length * 3}</Text>
              <Text style={styles.overviewStatLabel}>Subtopics</Text>
            </View>
          </View>
          <View style={styles.overallBar}>
            <View style={[styles.overallBarFill, { width: `${overallMastery}%` }]} />
          </View>
        </View>

        {/* Topics */}
        {topics.map((topic, index) => {
          const isExpanded = expandedTopicId === topic.id;
          const statusColor = getStatusColor(topic.status);
          const isLocked = topic.status === 'locked';

          return (
            <TouchableOpacity
              key={topic.id}
              style={[styles.topicCard, isLocked && styles.topicCardLocked]}
              onPress={() => toggleTopic(topic.id, topic.status)}
              activeOpacity={isLocked ? 1 : 0.8}
            >
              <View style={styles.topicHeader}>
                <View style={[styles.topicNumber, { borderColor: statusColor }]}>
                  <Text style={[styles.topicNumberText, { color: statusColor }]}>
                    {getStatusIcon(topic.status)}
                  </Text>
                </View>
                <View style={styles.topicInfo}>
                  <Text style={[styles.topicName, isLocked && styles.topicNameLocked]}>
                    {index + 1}. {topic.name}
                  </Text>
                  <Text style={styles.topicSubtopicsCount}>
                    {topic.subtopics.length} subtopics
                  </Text>
                </View>
                {!isLocked && (
                  <Text style={styles.topicChevron}>{isExpanded ? '▾' : '▸'}</Text>
                )}
              </View>

              {!isLocked && (
                <View style={styles.topicBarBg}>
                  <View
                    style={[
                      styles.topicBarFill,
                      { width: `${topic.mastery}%`, backgroundColor: statusColor },
                    ]}
                  />
                </View>
              )}

              {isExpanded && (
                <View style={styles.subtopicsContainer}>
                  {topic.subtopics.map((subtopic) => (
                    <View key={subtopic.id} style={styles.subtopicRow}>
                      <View
                        style={[
                          styles.subtopicDot,
                          subtopic.completed ? styles.subtopicDotDone : styles.subtopicDotPending,
                        ]}
                      />
                      <Text
                        style={[
                          styles.subtopicName,
                          subtopic.completed && styles.subtopicNameDone,
                        ]}
                      >
                        {subtopic.name}
                      </Text>
                      {subtopic.completed && (
                        <Text style={styles.subtopicCheck}>✓</Text>
                      )}
                    </View>
                  ))}
                  <TouchableOpacity
                    style={styles.practiceButton}
                    onPress={() =>
                      navigation.navigate('AIChat', {
                        topicId: topic.id,
                        title: `AI Tutor: ${topic.name}`,
                      })
                    }
                    activeOpacity={0.85}
                  >
                    <Text style={styles.practiceButtonText}>🤖 Ask AI Tutor</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          style={styles.aiPracticeButton}
          onPress={() =>
            navigation.navigate('AIChat', {
              title: `AI Tutor: ${subjectName}`,
            })
          }
          activeOpacity={0.85}
        >
          <Text style={styles.aiPracticeButtonText}>🤖 Practice {subjectName} with AI Tutor</Text>
        </TouchableOpacity>
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
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.massive,
  },
  overviewCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  overviewStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.lg,
  },
  overviewStat: {
    alignItems: 'center',
  },
  overviewStatValue: {
    fontSize: typography.fontSizeXl,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
  },
  overviewStatLabel: {
    fontSize: typography.fontSizeXs,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  overviewDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  overallBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  overallBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  topicCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  topicCardLocked: {
    opacity: 0.6,
  },
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  topicNumber: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceElevated,
  },
  topicNumberText: {
    fontSize: typography.fontSizeSm,
    fontWeight: typography.fontWeightBold,
  },
  topicInfo: {
    flex: 1,
  },
  topicName: {
    fontSize: typography.fontSizeMd,
    fontWeight: typography.fontWeightSemiBold,
    color: colors.textPrimary,
  },
  topicNameLocked: {
    color: colors.textMuted,
  },
  topicSubtopicsCount: {
    fontSize: typography.fontSizeXs,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  topicChevron: {
    fontSize: typography.fontSizeMd,
    color: colors.textMuted,
  },
  topicBarBg: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  topicBarFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  subtopicsContainer: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.md,
  },
  subtopicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  subtopicDot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.full,
  },
  subtopicDotDone: {
    backgroundColor: colors.success,
  },
  subtopicDotPending: {
    backgroundColor: colors.border,
  },
  subtopicName: {
    flex: 1,
    fontSize: typography.fontSizeSm,
    color: colors.textSecondary,
  },
  subtopicNameDone: {
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  subtopicCheck: {
    fontSize: typography.fontSizeSm,
    color: colors.success,
    fontWeight: typography.fontWeightBold,
  },
  practiceButton: {
    marginTop: spacing.sm,
    backgroundColor: colors.primary + '15',
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary + '40',
  },
  practiceButtonText: {
    fontSize: typography.fontSizeSm,
    color: colors.primary,
    fontWeight: typography.fontWeightSemiBold,
  },
  aiPracticeButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.xl,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  aiPracticeButtonText: {
    fontSize: typography.fontSizeMd,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
  },
});
