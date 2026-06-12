import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { useStudyStore } from '../../store/studyStore';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getXPForLevel(level: number): number {
  return level * 500;
}

function getLevelFromXP(xp: number): number {
  return Math.floor(xp / 500) + 1;
}

export function ProfileScreen(): React.JSX.Element {
  const { profile, user, logout } = useAuthStore();
  const { xp, resetStudyData } = useStudyStore();

  const displayName = profile?.displayName ?? 'Learner';
  const email = user?.email ?? '';
  const examType = profile?.examType ?? 'SAT';
  const tier = profile?.subscriptionTier ?? 'free';

  const level = getLevelFromXP(xp);
  const xpForCurrentLevel = getXPForLevel(level - 1);
  const xpForNextLevel = getXPForLevel(level);
  const xpProgress = (xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel);

  const tierColors: Record<string, string> = {
    free: colors.textMuted,
    pro: colors.primary,
    premium: colors.warning,
  };

  function handleLogout(): void {
    logout();
    resetStudyData();
  }

  const settingsItems = [
    { icon: '🔔', label: 'Notifications', onPress: () => {} },
    { icon: '⏰', label: 'Study Reminders', onPress: () => {} },
    { icon: '📅', label: 'Exam Date', onPress: () => {} },
    { icon: '🎨', label: 'Appearance', onPress: () => {} },
  ];

  const supportItems = [
    { icon: '❓', label: 'Help Center', onPress: () => {} },
    { icon: '🔒', label: 'Privacy Policy', onPress: () => {} },
    { icon: '📄', label: 'Terms of Service', onPress: () => {} },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Profile</Text>

        {/* Avatar + Info */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitials}>{getInitials(displayName)}</Text>
          </View>
          <Text style={styles.displayName}>{displayName}</Text>
          <Text style={styles.email}>{email}</Text>
          <View style={styles.examBadge}>
            <Text style={styles.examBadgeText}>{examType}</Text>
          </View>

          {/* Level & XP */}
          <View style={styles.levelSection}>
            <View style={styles.levelHeader}>
              <Text style={styles.levelText}>Level {level}</Text>
              <Text style={styles.xpText}>{xp} / {xpForNextLevel} XP</Text>
            </View>
            <View style={styles.xpBar}>
              <View style={[styles.xpBarFill, { width: `${Math.min(xpProgress * 100, 100)}%` }]} />
            </View>
          </View>
        </View>

        {/* Subscription */}
        <View style={styles.subscriptionCard}>
          <View style={styles.subscriptionLeft}>
            <Text style={styles.subscriptionLabel}>Current Plan</Text>
            <View style={[styles.tierBadge, { borderColor: tierColors[tier] }]}>
              <Text style={[styles.tierBadgeText, { color: tierColors[tier] }]}>
                {tier.charAt(0).toUpperCase() + tier.slice(1)}
              </Text>
            </View>
          </View>
          {tier === 'free' && (
            <TouchableOpacity style={styles.upgradeButton} activeOpacity={0.85}>
              <Text style={styles.upgradeButtonText}>Upgrade ✨</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Settings */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Settings</Text>
          <View style={styles.menuCard}>
            {settingsItems.map((item, index) => (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.menuItem,
                  index < settingsItems.length - 1 && styles.menuItemBorder,
                ]}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <Text style={styles.menuItemIcon}>{item.icon}</Text>
                <Text style={styles.menuItemLabel}>{item.label}</Text>
                <Text style={styles.menuItemChevron}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Support */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Support</Text>
          <View style={styles.menuCard}>
            {supportItems.map((item, index) => (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.menuItem,
                  index < supportItems.length - 1 && styles.menuItemBorder,
                ]}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <Text style={styles.menuItemIcon}>{item.icon}</Text>
                <Text style={styles.menuItemLabel}>{item.label}</Text>
                <Text style={styles.menuItemChevron}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout */}
        <View style={styles.dangerSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.85}>
            <Text style={styles.logoutButtonText}>Log Out</Text>
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
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  pageTitle: {
    fontSize: typography.fontSize2xl,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
    marginBottom: spacing.xl,
  },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xxl,
    alignItems: 'center',
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarInitials: {
    fontSize: typography.fontSize2xl,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
  },
  displayName: {
    fontSize: typography.fontSizeXl,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  email: {
    fontSize: typography.fontSizeSm,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  examBadge: {
    backgroundColor: colors.primary + '20',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.primary,
    marginBottom: spacing.xl,
  },
  examBadgeText: {
    fontSize: typography.fontSizeSm,
    color: colors.primary,
    fontWeight: typography.fontWeightSemiBold,
  },
  levelSection: {
    width: '100%',
    gap: spacing.sm,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  levelText: {
    fontSize: typography.fontSizeMd,
    fontWeight: typography.fontWeightSemiBold,
    color: colors.textPrimary,
  },
  xpText: {
    fontSize: typography.fontSizeSm,
    color: colors.textMuted,
  },
  xpBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  subscriptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  subscriptionLeft: {
    gap: spacing.xs,
  },
  subscriptionLabel: {
    fontSize: typography.fontSizeSm,
    color: colors.textMuted,
  },
  tierBadge: {
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1.5,
    alignSelf: 'flex-start',
  },
  tierBadgeText: {
    fontSize: typography.fontSizeSm,
    fontWeight: typography.fontWeightBold,
  },
  upgradeButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  upgradeButtonText: {
    fontSize: typography.fontSizeSm,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
  },
  menuSection: {
    marginBottom: spacing.xl,
  },
  menuSectionTitle: {
    fontSize: typography.fontSizeSm,
    fontWeight: typography.fontWeightSemiBold,
    color: colors.textMuted,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    gap: spacing.md,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemIcon: {
    fontSize: 18,
    width: 24,
    textAlign: 'center',
  },
  menuItemLabel: {
    flex: 1,
    fontSize: typography.fontSizeMd,
    color: colors.textPrimary,
  },
  menuItemChevron: {
    fontSize: typography.fontSizeXl,
    color: colors.textMuted,
  },
  dangerSection: {
    marginBottom: spacing.xl,
  },
  logoutButton: {
    backgroundColor: colors.error + '15',
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.error,
  },
  logoutButtonText: {
    fontSize: typography.fontSizeMd,
    fontWeight: typography.fontWeightSemiBold,
    color: colors.error,
  },
  version: {
    textAlign: 'center',
    fontSize: typography.fontSizeXs,
    color: colors.textMuted,
    marginBottom: spacing.xl,
  },
});
