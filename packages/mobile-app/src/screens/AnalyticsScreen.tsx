import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '../theme';
import { AnimatedCard } from '../components/AnimatedCard';
import { InsightCard } from '../components/InsightCard';
import { RadarChart } from '../components/RadarChart';
import { LineChart } from '../components/charts/LineChart';
import { BarChart } from '../components/charts/BarChart';
import { DonutChart } from '../components/charts/DonutChart';
import { HeatmapCalendar } from '../components/charts/HeatmapCalendar';
import { CircularProgress } from '../components/charts/CircularProgress';
import {
  radarData,
  paceTrendData,
  splitConsistencyData,
  strokeBreakdownData,
  pbProgressionData,
  heatmapData,
} from '../data/mockData';
import type { AnalyticsTab } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - spacing.screenPadding * 2 - spacing.cardPadding * 2;

const TABS: AnalyticsTab[] = ['Weekly', 'Monthly', 'Stroke', 'Race Prep'];

export function AnalyticsScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('Weekly');

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Header */}
        <AnimatedCard delay={0}>
          <Text style={styles.screenTitle}>Analytics</Text>
        </AnimatedCard>

        {/* Tabs */}
        <AnimatedCard delay={50}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabRow}
          >
            {TABS.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.tabActive]}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.tabTextActive,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </AnimatedCard>

        {/* 1. Pace Trend */}
        <AnimatedCard delay={100}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Pace Trend</Text>
            <Text style={styles.cardSubtitle}>100m pace over 8 weeks</Text>
            <LineChart
              data={paceTrendData.map((d) => ({ label: d.week, value: d.pace }))}
              width={CHART_WIDTH}
              height={180}
              color={colors.accent}
            />
          </View>
        </AnimatedCard>

        {/* 2. Split Consistency */}
        <AnimatedCard delay={150}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Split Consistency</Text>
            <Text style={styles.cardSubtitle}>Deviation from target per lap</Text>
            <BarChart
              data={splitConsistencyData.map((d) => ({
                label: `L${d.lap}`,
                value: d.deviation,
              }))}
              width={CHART_WIDTH}
              height={140}
              showNegative
            />
          </View>
        </AnimatedCard>

        {/* 3. Stroke Breakdown */}
        <AnimatedCard delay={200}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Stroke Breakdown</Text>
            <Text style={styles.cardSubtitle}>Training volume by stroke</Text>
            <View style={styles.chartCenter}>
              <DonutChart data={strokeBreakdownData.map((d) => ({
                label: d.stroke,
                percentage: d.percentage,
                color: d.color,
              }))} />
            </View>
          </View>
        </AnimatedCard>

        {/* 4. Training Heatmap */}
        <AnimatedCard delay={250}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Training Volume</Text>
            <Text style={styles.cardSubtitle}>Last 4 weeks</Text>
            <View style={styles.chartCenter}>
              <HeatmapCalendar data={heatmapData} />
            </View>
          </View>
        </AnimatedCard>

        {/* 5. Recovery Score */}
        <AnimatedCard delay={300}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Recovery Score</Text>
            <Text style={styles.cardSubtitle}>Based on training load & rest</Text>
            <View style={styles.recoveryRow}>
              <CircularProgress
                value={82}
                color={colors.success}
                label="RECOVERY"
                size={130}
              />
              <View style={styles.recoveryDetails}>
                <View style={styles.recoveryItem}>
                  <View style={[styles.recoveryDot, { backgroundColor: colors.success }]} />
                  <Text style={styles.recoveryLabel}>Sleep Quality</Text>
                  <Text style={styles.recoveryValue}>Good</Text>
                </View>
                <View style={styles.recoveryItem}>
                  <View style={[styles.recoveryDot, { backgroundColor: colors.warning }]} />
                  <Text style={styles.recoveryLabel}>Muscle Load</Text>
                  <Text style={styles.recoveryValue}>Moderate</Text>
                </View>
                <View style={styles.recoveryItem}>
                  <View style={[styles.recoveryDot, { backgroundColor: colors.success }]} />
                  <Text style={styles.recoveryLabel}>HRV Status</Text>
                  <Text style={styles.recoveryValue}>Optimal</Text>
                </View>
              </View>
            </View>
          </View>
        </AnimatedCard>

        {/* 6. PB Progression */}
        <AnimatedCard delay={350}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>PB Progression</Text>
            <Text style={styles.cardSubtitle}>100m freestyle personal best</Text>
            <LineChart
              data={pbProgressionData.map((d) => ({ label: d.month, value: d.time }))}
              width={CHART_WIDTH}
              height={160}
              color={colors.success}
            />
          </View>
        </AnimatedCard>

        {/* 7. Radar Chart */}
        <AnimatedCard delay={400}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Performance Profile</Text>
            <Text style={styles.cardSubtitle}>Six-axis athlete assessment</Text>
            <View style={styles.chartCenter}>
              <RadarChart data={radarData} size={CHART_WIDTH * 0.85} />
            </View>
          </View>
        </AnimatedCard>

        {/* 8. AI Summary */}
        <AnimatedCard delay={450}>
          <InsightCard
            title="AI Performance Summary"
            insight="Strong endurance gains this month with a 5.2% pace improvement. Sprint turns need attention — your turn times have plateaued. Consider adding dedicated turn drills to your warm-up routine."
            icon="analytics"
          />
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
  screenTitle: {
    ...typography.screenTitle,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },

  // Tabs
  tabRow: {
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: spacing.buttonRadius,
    backgroundColor: colors.borderLight,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    ...typography.chip,
    color: colors.textMuted,
    fontWeight: '600',
  },
  tabTextActive: {
    color: colors.white,
  },

  // Cards
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.cardRadius,
    padding: spacing.cardPadding,
    marginBottom: spacing.lg,
    ...spacing.cardShadowLight,
  },
  cardTitle: {
    ...typography.cardTitle,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  cardSubtitle: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  chartCenter: {
    alignItems: 'center',
  },

  // Recovery
  recoveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
  },
  recoveryDetails: {
    flex: 1,
    gap: spacing.md,
  },
  recoveryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  recoveryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  recoveryLabel: {
    ...typography.bodySmall,
    color: colors.textMuted,
    flex: 1,
  },
  recoveryValue: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: '600',
  },
});
