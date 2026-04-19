import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../theme';
import { HeroVideo } from '../components/HeroVideo';
import { MetricCard } from '../components/MetricCard';
import { WorkoutCard } from '../components/WorkoutCard';
import { PaceSelector } from '../components/PaceSelector';
import { InsightCard } from '../components/InsightCard';
import { AnimatedCard } from '../components/AnimatedCard';
import { todayWorkout, weeklyMetrics } from '../data/mockData';

const { width, height } = Dimensions.get('window');

export function HomeScreen() {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const heroContentStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [0, height * 0.25],
      [1, 0],
      Extrapolation.CLAMP
    ),
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [0, height * 0.5],
          [0, -80],
          Extrapolation.CLAMP
        ),
      },
      {
        scale: interpolate(
          scrollY.value,
          [0, height * 0.3],
          [1, 0.92],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* ── HERO SECTION ──────────────────────────── */}
        <HeroVideo>
          <Animated.View style={[styles.heroContent, heroContentStyle]}>
            <Text style={styles.logo}>SWYM</Text>
            <Text style={styles.tagline}>SWIM YOUR PACE</Text>

            <View style={styles.chipRow}>
              <View style={[styles.chip, styles.chipConnected]}>
                <View style={styles.chipDot} />
                <Text style={styles.chipText}>Ring Connected</Text>
              </View>
              <View style={styles.chip}>
                <Text style={styles.chipText}>Recovery 82%</Text>
              </View>
              <View style={styles.chip}>
                <Text style={styles.chipText}>Next 6:30 PM</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.primaryCta} activeOpacity={0.85}>
              <Text style={styles.primaryCtaText}>Start Swim</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryCta} activeOpacity={0.7}>
              <Text style={styles.secondaryCtaText}>Plan Session</Text>
            </TouchableOpacity>

            {/* Scroll hint */}
            <View style={styles.scrollHint}>
              <Ionicons name="chevron-down" size={20} color="rgba(255,255,255,0.3)" />
            </View>
          </Animated.View>
        </HeroVideo>

        {/* ── DASHBOARD SECTION ─────────────────────── */}
        <View style={styles.dashboard}>
          {/* Today's Workout */}
          <AnimatedCard delay={100}>
            <Text style={styles.sectionTitle}>Today's Workout</Text>
            <View style={styles.sectionContent}>
              <WorkoutCard workout={todayWorkout} />
            </View>
          </AnimatedCard>

          {/* Pace Selector */}
          <AnimatedCard delay={200}>
            <View style={styles.sectionContent}>
              <PaceSelector />
            </View>
          </AnimatedCard>

          {/* Weekly Snapshot */}
          <AnimatedCard delay={300}>
            <Text style={styles.sectionTitle}>This Week</Text>
            <View style={styles.metricsGrid}>
              <View style={styles.metricsRow}>
                <MetricCard {...weeklyMetrics[0]} />
                <MetricCard {...weeklyMetrics[1]} />
              </View>
              <View style={styles.metricsRow}>
                <MetricCard {...weeklyMetrics[2]} />
                <MetricCard {...weeklyMetrics[3]} />
              </View>
            </View>
          </AnimatedCard>

          {/* AI Insight */}
          <AnimatedCard delay={400}>
            <View style={styles.sectionContent}>
              <InsightCard
                insight="Your pace drops after lap 6 consistently. Recommend focusing on endurance threshold sets to build late-race stamina."
              />
            </View>
          </AnimatedCard>

          {/* Continue Last Session */}
          <AnimatedCard delay={500}>
            <View style={styles.sectionContent}>
              <TouchableOpacity style={styles.continueCard} activeOpacity={0.8}>
                <View style={styles.continueLeft}>
                  <Text style={styles.continueLabel}>CONTINUE LAST SESSION</Text>
                  <Text style={styles.continueTitle}>Threshold Freestyle</Text>
                  <Text style={styles.continueSub}>1200m of 1800m completed</Text>
                </View>
                <Ionicons name="play-circle" size={48} color={colors.accent} />
              </TouchableOpacity>
            </View>
          </AnimatedCard>

          <View style={{ height: 120 }} />
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // ── Hero ────────────────────────────────
  heroContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  logo: {
    ...typography.heroTitle,
    marginBottom: 8,
  },
  tagline: {
    ...typography.heroSubtitle,
    marginBottom: 40,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 44,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: spacing.chipRadius,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  chipConnected: {
    borderColor: 'rgba(34,197,94,0.3)',
  },
  chipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
    marginRight: 6,
  },
  chipText: {
    ...typography.chip,
    color: 'rgba(255,255,255,0.8)',
  },
  primaryCta: {
    backgroundColor: colors.accent,
    paddingVertical: 18,
    paddingHorizontal: 56,
    borderRadius: spacing.buttonRadius,
    marginBottom: 16,
    minWidth: 220,
    alignItems: 'center',
  },
  primaryCtaText: {
    ...typography.button,
    color: colors.white,
  },
  secondaryCta: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: spacing.buttonRadius,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
    minWidth: 200,
    alignItems: 'center',
  },
  secondaryCtaText: {
    ...typography.button,
    color: 'rgba(255,255,255,0.7)',
  },
  scrollHint: {
    marginTop: 36,
    opacity: 0.6,
  },

  // ── Dashboard ───────────────────────────
  dashboard: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.xxl,
    backgroundColor: colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
  },
  sectionTitle: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  sectionContent: {
    marginBottom: spacing.lg,
  },
  metricsGrid: {
    gap: 12,
    marginBottom: spacing.lg,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
  },

  // ── Continue Card ───────────────────────
  continueCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.cardRadius,
    padding: spacing.cardPadding,
    flexDirection: 'row',
    alignItems: 'center',
    ...spacing.cardShadow,
  },
  continueLeft: {
    flex: 1,
  },
  continueLabel: {
    ...typography.label,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  continueTitle: {
    ...typography.cardTitle,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  continueSub: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
});
