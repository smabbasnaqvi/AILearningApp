import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { useStudyStore } from '../../store/studyStore';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';

interface SettingsItem {
  id: string;
  icon: string;
  label: string;
  value?: string;
  onPress: () => void;
}

export function ProfileScreen(): React.JSX.Element {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const resetStudyData = useStudyStore((s) => s.resetStudyData);
  const currentExamType = useStudyStore((s) => s.currentExamType);
  const xp = useStudyStore((s) => s.xp);

  const displayName = user?.email?.split('@')[0] ?? 'Learner';
  const initial = displayName[0]?.toUpperCase() ?? 'L';

  function handleLogout() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          resetStudyData();
          logout();
        },
      },
    ]);
  }

  const settingsGroups: Array<{ title: string; items: SettingsItem[] }> = [
    {
      title: 'Study Settings',
      items: [
        {
          id: 'exam',
          icon: '📋',
          label: 'Exam Type',
          value: currentExamType ?? 'Not set',
          onPress: () => {},
        },
        {
          id: 'daily-goal',
          icon: '🎯',
          label: 'Daily Goal',
          value: '2 sessions',
          onPress: () => {},
        },
        {
          id: 'notifications',
          icon: '🔔',
          label: 'Notifications',
          value: 'On',
          onPress: () => {},
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          id: 'subscription',
          icon: '⭐',
          label: 'Subscription',
          value: 'Free',
          onPress: () => {},
        },
        {
          id: 'privacy',
          icon: '🔒',
          label: 'Privacy Policy',
          onPress: () => {},
        },
        {
          id: 'terms',
          icon: '📄',
          label: 'Terms of Service',
          onPress: () => {},
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* Avatar and info */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitial}>{initial}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{displayName}</Text>
            <Text style={styles.profileEmail}>{user?.email ?? ''}</Text>
            <View style={styles.badgesRow}>
              {currentExamType && (
                <View style={styles.examBadge}>
                  <Text style={styles.examBadgeText}>{currentExamType}</Text>
                </View>
              )}
              <View style={styles.xpBadge}>
                <Text style={styles.xpBadgeText}>⚡ {xp} XP</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsCard}>
          {[
            { label: 'Sessions', value: '24', icon: '📚' },
            { label: 'Streak', value: '7 days', icon: '🔥' },
            { label: 'Mastery', value: '65%', icon: '📈' },
          ].map((stat) => (
            <View key={stat.label} style={styles.statItem}>
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Settings groups */}
        {settingsGroups.map((group) => (
          <View key={group.title} style={styles.settingsGroup}>
            <Text style={styles.settingsGroupTitle}>{group.title}</Text>
            <View style={styles.settingsCard}>
              {group.items.map((item, idx) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.settingsRow,
                    idx < group.items.length - 1 && styles.settingsRowBorder,
                  ]}
                  onPress={item.onPress}
                  activeOpacity={0.7}
                >
                  <Text style={styles.settingsIcon}>{item.icon}</Text>
                  <Text style={styles.settingsLabel}>{item.label}</Text>
                  <View style={styles.settingsRight}>
                    {item.value && (
                      <Text style={styles.settingsValue}>{item.value}</Text>
                    )}
                    <Text style={styles.chevron}>›</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Sign out */}
        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.version}>AILearningApp v1.0.0</Text>
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    gap: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: typography.fontSize3xl,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
  },
  profileInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  profileName: {
    fontSize: typography.fontSizeXl,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
  },
  profileEmail: {
    fontSize: typography.fontSizeSm,
    color: colors.textSecondary,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  examBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  examBadgeText: {
    fontSize: typography.fontSizeXs,
    color: colors.primary,
    fontWeight: typography.fontWeightSemiBold,
  },
  xpBadge: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  xpBadgeText: {
    fontSize: typography.fontSizeXs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeightMedium,
  },
  statsCard: {
    flexDirection: 'row',
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: 4,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  statIcon: {
    fontSize: 22,
  },
  statValue: {
    fontSize: typography.fontSizeMd,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: typography.fontSizeXs,
    color: colors.textMuted,
  },
  settingsGroup: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  settingsGroupTitle: {
    fontSize: typography.fontSizeSm,
    color: colors.textMuted,
    fontWeight: typography.fontWeightSemiBold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  settingsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  settingsRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingsIcon: {
    fontSize: 20,
    width: 28,
  },
  settingsLabel: {
    flex: 1,
    fontSize: typography.fontSizeMd,
    color: colors.textPrimary,
    fontWeight: typography.fontWeightMedium,
  },
  settingsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  settingsValue: {
    fontSize: typography.fontSizeSm,
    color: colors.textSecondary,
  },
  chevron: {
    fontSize: 20,
    color: colors.textMuted,
    fontWeight: typography.fontWeightBold,
  },
  logoutSection: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  logoutBtn: {
    backgroundColor: colors.error + '15',
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.error,
  },
  logoutText: {
    color: colors.error,
    fontSize: typography.fontSizeLg,
    fontWeight: typography.fontWeightBold,
  },
  version: {
    textAlign: 'center',
    fontSize: typography.fontSizeXs,
    color: colors.textMuted,
    paddingBottom: spacing.xxl,
  },
});
