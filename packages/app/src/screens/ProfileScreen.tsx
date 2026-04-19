import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Typography, Spacing, Layout, Shadows } from '../theme';
import { SectionHeader } from '../components/SectionHeader';
import { user, ringStatus, goals } from '../data/mockData';

// ── Setting Row ─────────────────────────────────────────────

interface SettingRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  toggle?: boolean;
}

const SettingRow: React.FC<SettingRowProps> = ({ icon, label, value, toggle }) => (
  <TouchableOpacity style={styles.settingRow} activeOpacity={toggle ? 1 : 0.5}>
    <Ionicons name={icon} size={20} color={Colors.textMuted} />
    <Text style={styles.settingLabel}>{label}</Text>
    {toggle !== undefined ? (
      <Switch
        value={toggle}
        trackColor={{ false: Colors.border, true: Colors.accent + '50' }}
        thumbColor={toggle ? Colors.accent : Colors.shimmer}
      />
    ) : (
      <View style={styles.settingRight}>
        {value && <Text style={styles.settingValue}>{value}</Text>}
        <Ionicons name="chevron-forward" size={16} color={Colors.textLight} />
      </View>
    )}
  </TouchableOpacity>
);

// ── Main Screen ─────────────────────────────────────────────

export const ProfileScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  // Battery ring
  const battPct = ringStatus.battery / 100;
  const r = 22;
  const circ = 2 * Math.PI * r;
  const dash = circ * battPct;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Profile header */}
        <Animated.View entering={FadeInDown.springify()} style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.name[0]}</Text>
          </View>
          <Text style={styles.name}>{user.fullName}</Text>
          <View style={styles.tierBadge}>
            <Ionicons name="diamond-outline" size={14} color={Colors.accent} />
            <Text style={styles.tierText}>{user.tier}</Text>
          </View>
          <Text style={styles.since}>Member since {user.memberSince}</Text>
        </Animated.View>

        {/* Ring status */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.ringCard}>
          <View style={styles.ringRow}>
            <Svg width={56} height={56}>
              <Circle cx={28} cy={28} r={r} stroke={Colors.border} strokeWidth={4} fill="none" />
              <Circle
                cx={28}
                cy={28}
                r={r}
                stroke={battPct > 0.2 ? Colors.success : Colors.error}
                strokeWidth={4}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${circ}`}
                strokeDashoffset={circ - dash}
                transform="rotate(-90, 28, 28)"
              />
            </Svg>
            <View style={styles.ringInfo}>
              <Text style={styles.ringName}>{ringStatus.name}</Text>
              <Text style={styles.ringMeta}>
                {ringStatus.connected ? 'Connected' : 'Disconnected'} · {ringStatus.battery}% battery
              </Text>
            </View>
            <View style={[styles.connDot, { backgroundColor: ringStatus.connected ? Colors.success : Colors.error }]} />
          </View>
        </Animated.View>

        {/* Goals */}
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <SectionHeader title="Goals" action="Edit" />
          <View style={styles.goalList}>
            {goals.map((g) => (
              <View key={g.label} style={styles.goalRow}>
                <View style={styles.goalInfo}>
                  <Text style={styles.goalLabel}>{g.label}</Text>
                  <Text style={styles.goalValues}>
                    {g.current} / {g.target}
                  </Text>
                </View>
                <View style={styles.goalBarBg}>
                  <View
                    style={[
                      styles.goalBarFill,
                      { width: `${Math.min(g.progress, 1) * 100}%` },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Settings */}
        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <SectionHeader title="Settings" />
          <View style={styles.settingsCard}>
            <SettingRow icon="notifications-outline" label="Notifications" value="On" />
            <SettingRow icon="moon-outline" label="Dark Mode" toggle={false} />
            <SettingRow icon="speedometer-outline" label="Pace Unit" value="min/100m" />
            <SettingRow icon="language-outline" label="Language" value="English" />
            <SettingRow icon="shield-checkmark-outline" label="Privacy" />
            <SettingRow icon="help-circle-outline" label="Help & Support" />
          </View>
        </Animated.View>

        {/* App version */}
        <Text style={styles.version}>SWYM v1.0.0 · Build 42</Text>

        <View style={{ height: Layout.tabBarHeight + Spacing['3xl'] }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.lg,
    gap: Spacing['2xl'],
  },

  // Profile header
  profileHeader: {
    alignItems: 'center',
    paddingVertical: Spacing['2xl'],
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.accent + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '300',
    color: Colors.accent,
  },
  name: {
    ...Typography.h2,
    marginBottom: Spacing.sm,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.accentSoft,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Layout.pillRadius,
    marginBottom: Spacing.sm,
  },
  tierText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.accent,
  },
  since: {
    ...Typography.caption,
  },

  // Ring
  ringCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: Layout.cardRadius,
    padding: Spacing.xl,
    ...Shadows.card,
  },
  ringRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  ringInfo: {
    flex: 1,
  },
  ringName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  ringMeta: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  connDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  // Goals
  goalList: {
    backgroundColor: Colors.cardBg,
    borderRadius: Layout.cardRadius,
    padding: Spacing.xl,
    gap: Spacing.xl,
    ...Shadows.card,
  },
  goalRow: {},
  goalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  goalLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  goalValues: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textMuted,
  },
  goalBarBg: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  goalBarFill: {
    height: 6,
    backgroundColor: Colors.accent,
    borderRadius: 3,
  },

  // Settings
  settingsCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: Layout.cardRadius,
    overflow: 'hidden',
    ...Shadows.card,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '400',
    color: Colors.textPrimary,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  settingValue: {
    fontSize: 14,
    color: Colors.textMuted,
  },

  version: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.textLight,
  },
});
