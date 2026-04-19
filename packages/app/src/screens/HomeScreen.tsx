import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  FadeInDown,
} from 'react-native-reanimated';
import { Colors, Typography, Spacing, Layout } from '../theme';
import { HeroVideo } from '../components/HeroVideo';
import { SectionHeader } from '../components/SectionHeader';
import { WorkoutCard } from '../components/WorkoutCard';
import { PaceSelector } from '../components/PaceSelector';
import { MetricCard } from '../components/MetricCard';
import { InsightCard } from '../components/InsightCard';
import { ContinueSession } from '../components/ContinueSession';
import {
  todayWorkout,
  weeklyStats,
  paceModes,
  aiInsight,
  lastSession,
  recovery,
  ringStatus,
} from '../data/mockData';

export const HomeScreen: React.FC = () => {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        bounces={true}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ─── Hero Video Section ─── */}
        <HeroVideo
          scrollY={scrollY}
          recovery={recovery.score}
          nextSwim={recovery.nextSwim}
          ringConnected={ringStatus.connected}
        />

        {/* ─── Dashboard Cards ─── */}
        <View style={styles.dashboard}>
          {/* Today's Workout */}
          <Animated.View entering={FadeInDown.delay(100).springify()}>
            <SectionHeader title="Today's Workout" action="All Plans" />
            <WorkoutCard
              coach={todayWorkout.coach}
              title={todayWorkout.title}
              distance={todayWorkout.distance}
              sets={todayWorkout.sets}
              totalTime={todayWorkout.totalTime}
            />
          </Animated.View>

          {/* Pace Selector */}
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <SectionHeader title="Target Pace" />
            <PaceSelector modes={paceModes} />
          </Animated.View>

          {/* Weekly Snapshot */}
          <Animated.View entering={FadeInDown.delay(300).springify()}>
            <SectionHeader title="This Week" action="Details" />
            <View style={styles.grid}>
              <MetricCard
                label="DISTANCE"
                value={weeklyStats.distance.value}
                unit={weeklyStats.distance.unit}
                change={weeklyStats.distance.change}
              />
              <MetricCard
                label="SESSIONS"
                value={weeklyStats.sessions.value}
                unit={weeklyStats.sessions.unit}
                change={weeklyStats.sessions.change}
              />
            </View>
            <View style={[styles.grid, { marginTop: Spacing.md }]}>
              <MetricCard
                label="AVG PACE"
                value={weeklyStats.avgPace.value}
                unit={weeklyStats.avgPace.unit}
                change={weeklyStats.avgPace.change}
              />
              <MetricCard
                label="CONSISTENCY"
                value={weeklyStats.consistency.value}
                unit={weeklyStats.consistency.unit}
                change={weeklyStats.consistency.change}
              />
            </View>
          </Animated.View>

          {/* AI Coach Insight */}
          <Animated.View entering={FadeInDown.delay(400).springify()}>
            <SectionHeader title="AI Coach" />
            <InsightCard
              title={aiInsight.title}
              body={aiInsight.body}
              tag={aiInsight.tag}
            />
          </Animated.View>

          {/* Continue Last Session */}
          <Animated.View entering={FadeInDown.delay(500).springify()}>
            <SectionHeader title="Continue" />
            <ContinueSession
              name={lastSession.name}
              date={lastSession.date}
              distance={lastSession.distance}
              pace={lastSession.pace}
              progress={lastSession.progress}
            />
          </Animated.View>

          {/* Bottom spacer for tab bar */}
          <View style={{ height: Layout.tabBarHeight + Spacing['2xl'] }} />
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.primaryDark,
  },
  scrollContent: {
    flexGrow: 1,
  },
  dashboard: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: Layout.cardRadius,
    borderTopRightRadius: Layout.cardRadius,
    marginTop: -Layout.cardRadius,
    paddingTop: Spacing['3xl'],
    paddingHorizontal: Spacing.screenPadding,
    gap: Spacing['3xl'],
  },
  grid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
});
