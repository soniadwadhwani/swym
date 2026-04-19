import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Rect, Path, Circle, Line, Text as SvgText } from 'react-native-svg';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Typography, Spacing, Layout, Shadows } from '../theme';
import { SectionHeader } from '../components/SectionHeader';
import { InsightCard } from '../components/InsightCard';
import { RadarChart } from '../components/RadarChart';
import {
  paceData,
  splitData,
  strokeDistribution,
  radarStats,
  heatmapData,
  analyticsAI,
  recovery,
} from '../data/mockData';

const TABS = ['Weekly', 'Monthly', 'Stroke', 'Race Prep'] as const;
type Tab = typeof TABS[number];

// ── Inline chart components ─────────────────────────────────

const CHART_W = Layout.screenWidth - Spacing.screenPadding * 2 - Spacing['2xl'] * 2;

const PaceLineChart: React.FC = () => {
  const h = 140;
  const pad = 24;
  const w = CHART_W;
  const maxPace = Math.max(...paceData.map((d) => d.pace));
  const minPace = Math.min(...paceData.map((d) => d.pace)) - 2;
  const range = maxPace - minPace;

  const xStep = (w - pad * 2) / (paceData.length - 1);
  const y = (val: number) => pad + ((maxPace - val) / range) * (h - pad * 2);

  const pacePath = paceData
    .map((d, i) => `${i === 0 ? 'M' : 'L'}${pad + i * xStep},${y(d.pace)}`)
    .join(' ');
  const targetPath = paceData
    .map((d, i) => `${i === 0 ? 'M' : 'L'}${pad + i * xStep},${y(d.target)}`)
    .join(' ');

  return (
    <View style={styles.chartCard}>
      <Text style={styles.chartTitle}>Pace Trend</Text>
      <Svg width={w} height={h}>
        {/* Target line */}
        <Path d={targetPath} stroke={Colors.textLight} strokeWidth={1} strokeDasharray="4,4" fill="none" />
        {/* Pace line */}
        <Path d={pacePath} stroke={Colors.accent} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {/* Points */}
        {paceData.map((d, i) => (
          <Circle key={i} cx={pad + i * xStep} cy={y(d.pace)} r={3.5} fill={Colors.accent} stroke={Colors.white} strokeWidth={2} />
        ))}
        {/* X labels */}
        {paceData.map((d, i) => (
          <SvgText key={`l-${i}`} x={pad + i * xStep} y={h - 4} textAnchor="middle" fontSize={10} fill={Colors.textMuted}>{d.day}</SvgText>
        ))}
      </Svg>
    </View>
  );
};

const SplitBarChart: React.FC = () => {
  const h = 140;
  const w = CHART_W;
  const maxTime = Math.max(...splitData.map((d) => d.time));
  const barW = (w - 48) / splitData.length - 6;

  return (
    <View style={styles.chartCard}>
      <Text style={styles.chartTitle}>Split Times</Text>
      <Svg width={w} height={h}>
        {splitData.map((d, i) => {
          const barH = (d.time / (maxTime + 2)) * (h - 30);
          const x = 24 + i * (barW + 6);
          return (
            <React.Fragment key={i}>
              <Rect x={x} y={h - 20 - barH} width={barW} height={barH} rx={4} fill={i <= 2 ? Colors.accent : Colors.accent + '60'} />
              <SvgText x={x + barW / 2} y={h - 4} textAnchor="middle" fontSize={10} fill={Colors.textMuted}>{d.lap}</SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
};

const DonutChart: React.FC = () => {
  const size = 160;
  const r = 56;
  const strokeW = 18;
  const cx = size / 2;
  const cy = size / 2;

  let cumulative = 0;
  const arcs = strokeDistribution.map((s) => {
    const start = cumulative;
    cumulative += s.pct / 100;
    return { ...s, start, end: cumulative };
  });

  return (
    <View style={styles.chartCard}>
      <Text style={styles.chartTitle}>Stroke Distribution</Text>
      <View style={styles.donutRow}>
        <Svg width={size} height={size}>
          {arcs.map((arc, i) => {
            const startAngle = arc.start * Math.PI * 2 - Math.PI / 2;
            const endAngle = arc.end * Math.PI * 2 - Math.PI / 2;
            const x1 = cx + r * Math.cos(startAngle);
            const y1 = cy + r * Math.sin(startAngle);
            const x2 = cx + r * Math.cos(endAngle);
            const y2 = cy + r * Math.sin(endAngle);
            const large = arc.pct > 50 ? 1 : 0;
            return (
              <Path
                key={i}
                d={`M${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2}`}
                stroke={arc.color}
                strokeWidth={strokeW}
                fill="none"
                strokeLinecap="round"
              />
            );
          })}
        </Svg>
        <View style={styles.donutLegend}>
          {strokeDistribution.map((s) => (
            <View key={s.stroke} style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: s.color }]} />
              <Text style={styles.legendLabel}>{s.stroke}</Text>
              <Text style={styles.legendPct}>{s.pct}%</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const HeatmapCalendar: React.FC = () => {
  const cellSize = 28;
  const gap = 4;
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const intensityColors = [Colors.border, Colors.accent + '25', Colors.accent + '50', Colors.accent + '80', Colors.accent];

  return (
    <View style={styles.chartCard}>
      <Text style={styles.chartTitle}>Activity Heatmap</Text>
      {/* Day headers */}
      <View style={styles.heatRow}>
        {days.map((d, i) => (
          <Text key={i} style={[styles.heatLabel, { width: cellSize }]}>{d}</Text>
        ))}
      </View>
      {/* Weeks */}
      {heatmapData.map((week, wi) => (
        <View key={wi} style={styles.heatRow}>
          {week.map((val, di) => (
            <View
              key={`${wi}-${di}`}
              style={[
                styles.heatCell,
                {
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: intensityColors[val] || intensityColors[0],
                },
              ]}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const RecoveryWidget: React.FC = () => {
  const pct = recovery.score / 100;
  const size = 80;
  const r = 32;
  const strokeW = 6;
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference * (1 - pct);

  return (
    <View style={styles.recoveryCard}>
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={Colors.border} strokeWidth={strokeW} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={Colors.success}
          strokeWidth={strokeW}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
        />
      </Svg>
      <View style={styles.recoveryText}>
        <Text style={styles.recoveryValue}>{recovery.score}%</Text>
        <Text style={styles.recoveryLabel}>Recovery Score</Text>
      </View>
    </View>
  );
};

// ── Main Screen ─────────────────────────────────────────────

export const AnalyticsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>('Weekly');

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabRow}
      >
        {TABS.map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setTab(t)}
            style={[styles.tab, tab === t && styles.tabActive]}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Pace line chart */}
        <Animated.View entering={FadeInDown.springify()}>
          <PaceLineChart />
        </Animated.View>

        {/* Split bar chart */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <SplitBarChart />
        </Animated.View>

        {/* Donut + Recovery */}
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <RecoveryWidget />
            </View>
          </View>
        </Animated.View>

        {/* Donut chart */}
        <Animated.View entering={FadeInDown.delay(250).springify()}>
          <DonutChart />
        </Animated.View>

        {/* Heatmap calendar */}
        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <HeatmapCalendar />
        </Animated.View>

        {/* Radar chart */}
        <Animated.View entering={FadeInDown.delay(400).springify()}>
          <SectionHeader title="Performance Radar" />
          <RadarChart data={radarStats} />
        </Animated.View>

        {/* AI Summary */}
        <Animated.View entering={FadeInDown.delay(500).springify()}>
          <SectionHeader title="AI Summary" />
          <InsightCard
            title={analyticsAI.title}
            body={analyticsAI.body}
            tag="Monthly"
          />
        </Animated.View>

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
  header: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  title: {
    ...Typography.h1,
  },
  tabRow: {
    paddingHorizontal: Spacing.screenPadding,
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  tab: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: Layout.pillRadius,
    backgroundColor: Colors.shimmer,
  },
  tabActive: {
    backgroundColor: Colors.primaryDark,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  tabTextActive: {
    color: Colors.white,
    fontWeight: '600',
  },
  scroll: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.lg,
    gap: Spacing['2xl'],
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  chartCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: Layout.cardRadius,
    padding: Spacing['2xl'],
    ...Shadows.card,
  },
  chartTitle: {
    ...Typography.label,
    marginBottom: Spacing.lg,
  },
  donutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xl,
  },
  donutLegend: {
    flex: 1,
    gap: Spacing.sm,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 13,
    color: Colors.textPrimary,
    flex: 1,
  },
  legendPct: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  heatRow: {
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
    marginBottom: 4,
  },
  heatLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textMuted,
    textAlign: 'center',
  },
  heatCell: {
    borderRadius: 6,
  },
  recoveryCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: Layout.cardRadius,
    padding: Spacing['2xl'],
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xl,
    ...Shadows.card,
  },
  recoveryText: {
    flex: 1,
  },
  recoveryValue: {
    fontSize: 32,
    fontWeight: '200',
    color: Colors.success,
    letterSpacing: -1,
  },
  recoveryLabel: {
    ...Typography.caption,
    marginTop: 4,
  },
});
