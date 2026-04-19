import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../theme';
import { AnimatedCard } from '../components/AnimatedCard';
import { profileData } from '../data/mockData';

export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Profile header */}
        <AnimatedCard delay={0}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{profileData.avatar}</Text>
            </View>
            <Text style={styles.name}>{profileData.name}</Text>
            <View style={styles.tierBadge}>
              <Ionicons name="diamond" size={14} color={colors.accent} />
              <Text style={styles.tierText}>{profileData.tier} Member</Text>
            </View>
            <Text style={styles.memberSince}>
              Member since {profileData.memberSince}
            </Text>
          </View>
        </AnimatedCard>

        {/* Stats row */}
        <AnimatedCard delay={100}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profileData.totalDistance}</Text>
              <Text style={styles.statLabel}>TOTAL DISTANCE</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profileData.totalSessions}</Text>
              <Text style={styles.statLabel}>SESSIONS</Text>
            </View>
          </View>
        </AnimatedCard>

        {/* Ring status */}
        <AnimatedCard delay={150}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="bluetooth" size={20} color={colors.accent} />
              <Text style={styles.cardHeaderTitle}>SWYM Ring</Text>
            </View>
            <View style={styles.ringRow}>
              <View style={styles.ringInfo}>
                <View style={styles.ringStatus}>
                  <View
                    style={[
                      styles.statusDot,
                      {
                        backgroundColor: profileData.ringConnected
                          ? colors.success
                          : colors.error,
                      },
                    ]}
                  />
                  <Text style={styles.ringStatusText}>
                    {profileData.ringConnected ? 'Connected' : 'Disconnected'}
                  </Text>
                </View>
              </View>
              <View style={styles.batterySection}>
                <View style={styles.batteryOuter}>
                  <View
                    style={[
                      styles.batteryFill,
                      {
                        width: `${profileData.ringBattery}%`,
                        backgroundColor:
                          profileData.ringBattery > 30
                            ? colors.success
                            : colors.error,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.batteryText}>
                  {profileData.ringBattery}%
                </Text>
              </View>
            </View>
          </View>
        </AnimatedCard>

        {/* Goals */}
        <AnimatedCard delay={200}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="flag" size={20} color={colors.accent} />
              <Text style={styles.cardHeaderTitle}>Goals</Text>
            </View>
            {profileData.goals.map((goal, index) => {
              const currentVal = parseFloat(goal.current);
              const targetVal = parseFloat(goal.target.replace(/[^\d.]/g, ''));
              const progress = Math.min((currentVal / targetVal) * 100, 100);
              return (
                <View
                  key={index}
                  style={[
                    styles.goalItem,
                    index < profileData.goals.length - 1 && styles.goalBorder,
                  ]}
                >
                  <View style={styles.goalHeader}>
                    <Text style={styles.goalLabel}>{goal.label}</Text>
                    <Text style={styles.goalValues}>
                      {goal.current}{' '}
                      <Text style={styles.goalTarget}>/ {goal.target}</Text>
                    </Text>
                  </View>
                  <View style={styles.goalBar}>
                    <View
                      style={[
                        styles.goalFill,
                        { width: `${Math.min(progress, 100)}%` },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </AnimatedCard>

        {/* Settings */}
        <AnimatedCard delay={300}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="settings" size={20} color={colors.accent} />
              <Text style={styles.cardHeaderTitle}>Preferences</Text>
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons
                  name="notifications-outline"
                  size={20}
                  color={colors.textMuted}
                />
                <Text style={styles.settingLabel}>Notifications</Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{
                  false: colors.border,
                  true: colors.accentMedium,
                }}
                thumbColor={notifications ? colors.accent : colors.secondary}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons
                  name="moon-outline"
                  size={20}
                  color={colors.textMuted}
                />
                <Text style={styles.settingLabel}>Dark Mode</Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{
                  false: colors.border,
                  true: colors.accentMedium,
                }}
                thumbColor={darkMode ? colors.accent : colors.secondary}
              />
            </View>

            {[
              { icon: 'water-outline', label: 'Pool Settings' },
              { icon: 'watch-outline', label: 'Ring Calibration' },
              { icon: 'document-text-outline', label: 'Export Data' },
              { icon: 'help-circle-outline', label: 'Help & Support' },
            ].map((item) => (
              <TouchableOpacity
                key={item.label}
                style={styles.settingItem}
                activeOpacity={0.7}
              >
                <View style={styles.settingLeft}>
                  <Ionicons
                    name={item.icon as any}
                    size={20}
                    color={colors.textMuted}
                  />
                  <Text style={styles.settingLabel}>{item.label}</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            ))}
          </View>
        </AnimatedCard>

        {/* Sign out */}
        <AnimatedCard delay={400}>
          <TouchableOpacity style={styles.signOutButton} activeOpacity={0.7}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </AnimatedCard>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.lg,
  },

  // Profile header
  profileHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '300',
    color: colors.white,
    letterSpacing: 2,
  },
  name: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.accentSoft,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: spacing.chipRadius,
    marginBottom: spacing.sm,
  },
  tierText: {
    ...typography.chip,
    color: colors.accent,
    fontWeight: '600',
  },
  memberSince: {
    ...typography.caption,
    color: colors.textMuted,
  },

  // Stats
  statsRow: {
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.cardRadius,
    padding: spacing.cardPadding,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...spacing.cardShadow,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...typography.metricSmall,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    ...typography.label,
    color: colors.textMuted,
    fontSize: 10,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },

  // Card
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.cardRadius,
    padding: spacing.cardPadding,
    marginBottom: spacing.lg,
    ...spacing.cardShadowLight,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  cardHeaderTitle: {
    ...typography.cardTitle,
    color: colors.textPrimary,
  },

  // Ring
  ringRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ringInfo: {
    flex: 1,
  },
  ringStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  ringStatusText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  batterySection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  batteryOuter: {
    width: 48,
    height: 20,
    borderRadius: 6,
    backgroundColor: colors.borderLight,
    overflow: 'hidden',
  },
  batteryFill: {
    height: '100%',
    borderRadius: 6,
  },
  batteryText: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },

  // Goals
  goalItem: {
    paddingVertical: spacing.md,
  },
  goalBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  goalLabel: {
    ...typography.body,
    color: colors.textPrimary,
  },
  goalValues: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  goalTarget: {
    color: colors.textMuted,
    fontWeight: '400',
  },
  goalBar: {
    height: 4,
    backgroundColor: colors.borderLight,
    borderRadius: 2,
    overflow: 'hidden',
  },
  goalFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 2,
  },

  // Settings
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  settingLabel: {
    ...typography.body,
    color: colors.textPrimary,
  },

  // Sign out
  signOutButton: {
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  signOutText: {
    ...typography.button,
    color: colors.error,
  },
});
