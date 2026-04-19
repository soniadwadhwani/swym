import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Typography, Spacing, Layout, Shadows } from '../theme';
import { SectionHeader } from '../components/SectionHeader';
import { todayWorkout } from '../data/mockData';

type ViewMode = 'plan' | 'live';

export const TrainScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<ViewMode>('plan');

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Train</Text>
        <View style={styles.toggle}>
          <TouchableOpacity
            style={[styles.toggleBtn, mode === 'plan' && styles.toggleActive]}
            onPress={() => setMode('plan')}
            activeOpacity={0.7}
          >
            <Text style={[styles.toggleText, mode === 'plan' && styles.toggleTextActive]}>
              Plan
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, mode === 'live' && styles.toggleActive]}
            onPress={() => setMode('live')}
            activeOpacity={0.7}
          >
            <Text style={[styles.toggleText, mode === 'live' && styles.toggleTextActive]}>
              Live
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {mode === 'plan' ? <PlanView /> : <LiveView />}
        <View style={{ height: Layout.tabBarHeight + Spacing['2xl'] }} />
      </ScrollView>
    </View>
  );
};

// ── Plan View ───────────────────────────────────────────────
const PlanView: React.FC = () => (
  <View style={styles.planContainer}>
    {/* Workout title card */}
    <Animated.View entering={FadeInDown.springify()} style={styles.workoutHeader}>
      <Text style={styles.workoutTitle}>{todayWorkout.title}</Text>
      <Text style={styles.workoutMeta}>
        {todayWorkout.coach} · {todayWorkout.distance}m · {todayWorkout.totalTime}
      </Text>
    </Animated.View>

    {/* Set sections */}
    {todayWorkout.sets.map((set, i) => (
      <Animated.View
        key={set.label}
        entering={FadeInDown.delay(100 * (i + 1)).springify()}
        style={styles.setCard}
      >
        <View style={styles.setHeader}>
          <View style={[styles.setIndicator, { backgroundColor: set.color }]} />
          <Text style={styles.setLabel}>{set.label}</Text>
          <Text style={styles.setDistance}>{set.distance}m</Text>
        </View>
        <Text style={styles.setDetail}>{set.detail}</Text>
      </Animated.View>
    ))}

    {/* Start button */}
    <Animated.View entering={FadeInDown.delay(600).springify()}>
      <TouchableOpacity style={styles.startBtn} activeOpacity={0.8}>
        <Ionicons name="play" size={22} color={Colors.white} />
        <Text style={styles.startBtnText}>Start Session</Text>
      </TouchableOpacity>
    </Animated.View>
  </View>
);

// ── Live View (preview/mockup) ──────────────────────────────
const LiveView: React.FC = () => (
  <View style={styles.liveContainer}>
    {/* Timer */}
    <Animated.View entering={FadeInDown.springify()} style={styles.timerCard}>
      <Text style={styles.timerLabel}>ELAPSED</Text>
      <Text style={styles.timerValue}>14:32</Text>
      <View style={styles.timerDivider} />
      <View style={styles.splitRow}>
        <View style={styles.splitItem}>
          <Text style={styles.splitLabel}>CURRENT SPLIT</Text>
          <Text style={styles.splitValue}>1:08</Text>
        </View>
        <View style={styles.splitSep} />
        <View style={styles.splitItem}>
          <Text style={styles.splitLabel}>TARGET SPLIT</Text>
          <Text style={styles.splitValue}>1:10</Text>
        </View>
      </View>
    </Animated.View>

    {/* Status indicator */}
    <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.statusCard}>
      <View style={[styles.statusDot, { backgroundColor: Colors.success }]} />
      <Text style={styles.statusText}>On Pace</Text>
      <Text style={styles.statusDetail}>2s ahead of target</Text>
    </Animated.View>

    {/* Lap counter */}
    <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.lapCard}>
      <View style={styles.lapRow}>
        <View style={styles.lapCol}>
          <Text style={styles.lapLabel}>LAP</Text>
          <Text style={styles.lapNum}>7 / 12</Text>
        </View>
        <View style={styles.lapCol}>
          <Text style={styles.lapLabel}>SET</Text>
          <Text style={styles.lapNum}>Main Set</Text>
        </View>
        <View style={styles.lapCol}>
          <Text style={styles.lapLabel}>DISTANCE</Text>
          <Text style={styles.lapNum}>950m</Text>
        </View>
      </View>
    </Animated.View>

    {/* Recent laps */}
    <Animated.View entering={FadeInDown.delay(400).springify()}>
      <SectionHeader title="Recent Laps" />
      {[
        { lap: 7, time: '1:08.2', delta: '-1.8s', fast: true },
        { lap: 6, time: '1:10.5', delta: '+0.5s', fast: false },
        { lap: 5, time: '1:09.1', delta: '-0.9s', fast: true },
      ].map((l) => (
        <View key={l.lap} style={styles.lapHistRow}>
          <Text style={styles.lapHistNum}>Lap {l.lap}</Text>
          <Text style={styles.lapHistTime}>{l.time}</Text>
          <Text
            style={[
              styles.lapHistDelta,
              { color: l.fast ? Colors.success : Colors.warning },
            ]}
          >
            {l.delta}
          </Text>
        </View>
      ))}
    </Animated.View>
  </View>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.lg,
  },
  title: {
    ...Typography.h1,
  },
  toggle: {
    flexDirection: 'row',
    backgroundColor: Colors.shimmer,
    borderRadius: Spacing.md,
    padding: 3,
  },
  toggleBtn: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: Spacing.md - 2,
  },
  toggleActive: {
    backgroundColor: Colors.white,
    ...Shadows.soft,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  toggleTextActive: {
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  scroll: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.lg,
  },

  // Plan
  planContainer: {
    gap: Spacing.lg,
  },
  workoutHeader: {
    backgroundColor: Colors.cardBg,
    borderRadius: Layout.cardRadius,
    padding: Spacing['2xl'],
    ...Shadows.card,
  },
  workoutTitle: {
    ...Typography.h2,
    marginBottom: Spacing.sm,
  },
  workoutMeta: {
    ...Typography.bodyMuted,
    fontSize: 14,
  },
  setCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: Layout.cardRadiusSmall,
    padding: Spacing.xl,
    ...Shadows.soft,
  },
  setHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  setIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  setLabel: {
    ...Typography.h3,
    fontSize: 15,
    flex: 1,
  },
  setDistance: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  setDetail: {
    ...Typography.bodyMuted,
    fontSize: 14,
    paddingLeft: 20,
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.accent,
    paddingVertical: Spacing.lg,
    borderRadius: Layout.cardRadiusSmall,
    marginTop: Spacing.lg,
  },
  startBtnText: {
    ...Typography.button,
    color: Colors.white,
  },

  // Live
  liveContainer: {
    gap: Spacing.xl,
  },
  timerCard: {
    backgroundColor: Colors.primaryDark,
    borderRadius: Layout.cardRadius,
    padding: Spacing['3xl'],
    alignItems: 'center',
  },
  timerLabel: {
    ...Typography.label,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: Spacing.sm,
  },
  timerValue: {
    fontSize: 64,
    fontWeight: '200',
    color: Colors.white,
    letterSpacing: -2,
  },
  timerDivider: {
    width: 60,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginVertical: Spacing.xl,
  },
  splitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['2xl'],
  },
  splitItem: {
    alignItems: 'center',
  },
  splitSep: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  splitLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: Spacing.xs,
  },
  splitValue: {
    fontSize: 28,
    fontWeight: '300',
    color: Colors.white,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.cardBg,
    borderRadius: Layout.cardRadiusSmall,
    padding: Spacing.xl,
    ...Shadows.card,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.success,
    flex: 1,
  },
  statusDetail: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  lapCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: Layout.cardRadiusSmall,
    padding: Spacing.xl,
    ...Shadows.card,
  },
  lapRow: {
    flexDirection: 'row',
  },
  lapCol: {
    flex: 1,
    alignItems: 'center',
  },
  lapLabel: {
    ...Typography.label,
    fontSize: 10,
    marginBottom: Spacing.xs,
  },
  lapNum: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  lapHistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  lapHistNum: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  lapHistTime: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textMuted,
    marginRight: Spacing.lg,
  },
  lapHistDelta: {
    fontSize: 14,
    fontWeight: '600',
    minWidth: 50,
    textAlign: 'right',
  },
});
