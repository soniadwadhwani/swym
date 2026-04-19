import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../../theme';

interface HeatmapDay {
  date: string;
  volume: number;
}

interface HeatmapCalendarProps {
  data: HeatmapDay[];
}

const DAY_SIZE = 32;
const DAY_GAP = 4;
const COLS = 7;

function getHeatColor(volume: number): string {
  if (volume === 0) return 'rgba(20,12,50,0.04)';
  if (volume < 2000) return 'rgba(112,124,255,0.15)';
  if (volume < 3000) return 'rgba(112,124,255,0.35)';
  if (volume < 3500) return 'rgba(112,124,255,0.55)';
  return 'rgba(112,124,255,0.8)';
}

export function HeatmapCalendar({ data }: HeatmapCalendarProps) {
  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <View style={styles.container}>
      {/* Day labels */}
      <View style={styles.labelRow}>
        {dayLabels.map((label, i) => (
          <Text key={i} style={styles.dayLabel}>
            {label}
          </Text>
        ))}
      </View>

      {/* Grid */}
      <View style={styles.grid}>
        {data.map((day, i) => (
          <View
            key={day.date}
            style={[
              styles.cell,
              { backgroundColor: getHeatColor(day.volume) },
            ]}
          />
        ))}
      </View>

      {/* Legend */}
      <View style={styles.legendRow}>
        <Text style={styles.legendText}>Less</Text>
        {[0, 1500, 2500, 3200, 3800].map((vol, i) => (
          <View
            key={i}
            style={[styles.legendCell, { backgroundColor: getHeatColor(vol) }]}
          />
        ))}
        <Text style={styles.legendText}>More</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  labelRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
    gap: DAY_GAP,
  },
  dayLabel: {
    width: DAY_SIZE,
    textAlign: 'center',
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: DAY_GAP,
    maxWidth: COLS * (DAY_SIZE + DAY_GAP),
  },
  cell: {
    width: DAY_SIZE,
    height: DAY_SIZE,
    borderRadius: 8,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.md,
  },
  legendCell: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  legendText: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 10,
  },
});
