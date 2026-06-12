import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';
import type { StackScreenProps } from '@react-navigation/stack';
import type { LearnStackParamList } from '../../navigation/types';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';

type Props = StackScreenProps<LearnStackParamList, 'TopicList'>;

// TODO: replace with real topic data fetched by subjectId
const MOCK_TOPICS = [
  { id: 't1', name: 'Algebra', mastery: 80, subtopicCount: 4 },
  { id: 't2', name: 'Geometry', mastery: 60, subtopicCount: 5 },
  { id: 't3', name: 'Statistics', mastery: 45, subtopicCount: 3 },
  { id: 't4', name: 'Trigonometry', mastery: 30, subtopicCount: 4 },
  { id: 't5', name: 'Calculus', mastery: 15, subtopicCount: 6 },
];

function getMasteryColor(mastery: number): string {
  if (mastery >= 70) return colors.success;
  if (mastery >= 40) return colors.warning;
  return colors.error;
}

export function TopicListScreen({ navigation, route }: Props): React.JSX.Element {
  const { subjectName } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={MOCK_TOPICS}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.subjectLabel}>{subjectName}</Text>
            <Text style={styles.title}>Topics</Text>
            <Text style={styles.subtitle}>{MOCK_TOPICS.length} topics to master</Text>
          </View>
        }
        renderItem={({ item }) => {
          const masteryColor = getMasteryColor(item.mastery);
          return (
            <TouchableOpacity
              style={styles.topicCard}
              onPress={() =>
                navigation.navigate('AIChat', {
                  topicId: item.id,
                  title: item.name,
                })
              }
              activeOpacity={0.8}
            >
              <View style={styles.topicLeft}>
                <View
                  style={[styles.masteryIndicator, { backgroundColor: masteryColor }]}
                />
                <View>
                  <Text style={styles.topicName}>{item.name}</Text>
                  <Text style={styles.subtopicCount}>{item.subtopicCount} subtopics</Text>
                </View>
              </View>

              <View style={styles.topicRight}>
                <Text style={[styles.masteryPct, { color: masteryColor }]}>
                  {item.mastery}%
                </Text>
                <View style={styles.miniBarTrack}>
                  <View
                    style={[
                      styles.miniBarFill,
                      { width: `${item.mastery}%`, backgroundColor: masteryColor },
                    ]}
                  />
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.aiChatFab}>
        <TouchableOpacity
          style={styles.fabButton}
          onPress={() =>
            navigation.navigate('AIChat', {
              title: `${subjectName} Tutor`,
            })
          }
          activeOpacity={0.85}
        >
          <Text style={styles.fabText}>🤖 Ask AI Tutor</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  listHeader: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  subjectLabel: {
    fontSize: typography.fontSizeSm,
    color: colors.primary,
    fontWeight: typography.fontWeightSemiBold,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: typography.fontSize3xl,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSizeMd,
    color: colors.textSecondary,
  },
  list: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 100,
    gap: spacing.md,
  },
  topicCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topicLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  masteryIndicator: {
    width: 12,
    height: 12,
    borderRadius: borderRadius.full,
  },
  topicName: {
    fontSize: typography.fontSizeMd,
    fontWeight: typography.fontWeightSemiBold,
    color: colors.textPrimary,
  },
  subtopicCount: {
    fontSize: typography.fontSizeSm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  topicRight: {
    alignItems: 'flex-end',
    gap: 4,
    minWidth: 60,
  },
  masteryPct: {
    fontSize: typography.fontSizeSm,
    fontWeight: typography.fontWeightBold,
  },
  miniBarTrack: {
    width: 60,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
  },
  miniBarFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  aiChatFab: {
    position: 'absolute',
    bottom: spacing.xxl,
    left: spacing.xl,
    right: spacing.xl,
  },
  fabButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  fabText: {
    color: colors.textPrimary,
    fontSize: typography.fontSizeMd,
    fontWeight: typography.fontWeightBold,
  },
});
