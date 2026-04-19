import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../theme';
import { AnimatedCard } from '../components/AnimatedCard';
import { todayWorkout } from '../data/mockData';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type SetType = 'warmup' | 'main' | 'cooldown';

const setColors: Record<SetType, string> = {
  warmup: colors.success,
  main: colors.accent,
  cooldown: colors.secondary,
};

const setLabels: Record<SetType, string> = {
  warmup: 'WARM UP',
  main: 'MAIN SET',
  cooldown: 'COOL DOWN',
};

interface TrainScreenProps {
  navigation?: NativeStackNavigationProp<any>;
}

export function TrainScreen({ navigation }: TrainScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Header */}
        <AnimatedCard delay={0}>
          <Text style={styles.screenTitle}>Train</Text>
          <Text style={styles.subtitle}>Today's Session</Text>
        </AnimatedCard>

        {/* Session overview */}
        <AnimatedCard delay={100}>
          <View style={styles.overviewCard}>
            <View style={styles.overviewHeader}>
              <View style={styles.coachAvatar}>
                <Ionicons name="person" size={16} color={colors.white} />
              </View>
              <View>
                <Text style={styles.coachName}>{todayWorkout.coach}</Text>
                <Text style={styles.sessionTitle}>{todayWorkout.title}</Text>
              </View>
            </View>
            <View style={styles.overviewMetrics}>
              <View style={styles.overviewMetric}>
                <Text style={styles.overviewValue}>{todayWorkout.totalDistance}m</Text>
                <Text style={styles.overviewLabel}>TOTAL</Text>
              </View>
              <View style={styles.overviewMetric}>
                <Text style={styles.overviewValue}>{todayWorkout.sets.length}</Text>
                <Text style={styles.overviewLabel}>SETS</Text>
              </View>
              <View style={styles.overviewMetric}>
                <Text style={styles.overviewValue}>~45</Text>
                <Text style={styles.overviewLabel}>MINUTES</Text>
              </View>
            </View>
          </View>
        </AnimatedCard>

        {/* Set list */}
        {todayWorkout.sets.map((set, index) => (
          <AnimatedCard key={index} delay={200 + index * 80}>
            <View style={styles.setCard}>
              <View style={[styles.setIndicator, { backgroundColor: setColors[set.type] }]} />
              <View style={styles.setContent}>
                <View style={styles.setHeader}>
                  <Text style={[styles.setType, { color: setColors[set.type] }]}>
                    {setLabels[set.type]}
                  </Text>
                  <Text style={styles.setDistance}>{set.distance}m</Text>
                </View>
                <Text style={styles.setDescription}>{set.description}</Text>
                <View style={styles.setMeta}>
                  {set.targetPace && (
                    <View style={styles.metaChip}>
                      <Ionicons name="speedometer-outline" size={12} color={colors.textMuted} />
                      <Text style={styles.metaText}>{set.targetPace}</Text>
                    </View>
                  )}
                  {set.rest && (
                    <View style={styles.metaChip}>
                      <Ionicons name="time-outline" size={12} color={colors.textMuted} />
                      <Text style={styles.metaText}>{set.rest} rest</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </AnimatedCard>
        ))}

        {/* Start button */}
        <AnimatedCard delay={600}>
          <TouchableOpacity
            style={styles.startButton}
            activeOpacity={0.85}
            onPress={() => navigation?.navigate('LiveSwim')}
          >
            <Ionicons name="play" size={22} color={colors.white} />
            <Text style={styles.startButtonText}>Start Live Swim</Text>
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

  // Header
  screenTitle: {
    ...typography.screenTitle,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: spacing.xl,
  },

  // Overview card
  overviewCard: {
    backgroundColor: colors.primary,
    borderRadius: spacing.cardRadius,
    padding: spacing.cardPadding,
    marginBottom: spacing.lg,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  coachAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  coachName: {
    ...typography.caption,
    color: colors.textOnDarkMuted,
    marginBottom: 2,
  },
  sessionTitle: {
    ...typography.cardTitle,
    color: colors.textOnDark,
  },
  overviewMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overviewMetric: {
    alignItems: 'center',
  },
  overviewValue: {
    ...typography.metricSmall,
    color: colors.textOnDark,
  },
  overviewLabel: {
    ...typography.label,
    color: colors.textOnDarkMuted,
    fontSize: 10,
    marginTop: 4,
  },

  // Set cards
  setCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.cardRadius,
    padding: spacing.cardPadding,
    marginBottom: spacing.md,
    flexDirection: 'row',
    ...spacing.cardShadowLight,
  },
  setIndicator: {
    width: 4,
    borderRadius: 2,
    marginRight: spacing.md,
  },
  setContent: {
    flex: 1,
  },
  setHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  setType: {
    ...typography.label,
    fontSize: 10,
  },
  setDistance: {
    ...typography.cardTitle,
    color: colors.textPrimary,
  },
  setDescription: {
    ...typography.body,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  setMeta: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    ...typography.caption,
    color: colors.textMuted,
  },

  // Start button
  startButton: {
    backgroundColor: colors.accent,
    borderRadius: spacing.buttonRadius,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  startButtonText: {
    ...typography.button,
    color: colors.white,
    fontSize: 18,
  },
});
