import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { colors, typography, spacing } from '../../theme';

interface Segment {
  label: string;
  percentage: number;
  color: string;
}

interface DonutChartProps {
  data: Segment[];
  size?: number;
  strokeWidth?: number;
}

export function DonutChart({
  data,
  size = 180,
  strokeWidth = 24,
}: DonutChartProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const cy = size / 2;

  let accumulated = 0;

  return (
    <View style={styles.container}>
      <View style={styles.chartRow}>
        <Svg width={size} height={size}>
          <G rotation="-90" origin={`${cx}, ${cy}`}>
            {/* Background track */}
            <Circle
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke="rgba(20,12,50,0.04)"
              strokeWidth={strokeWidth}
            />

            {data.map((segment) => {
              const dashLength = (segment.percentage / 100) * circumference;
              const dashOffset = -(accumulated / 100) * circumference;
              accumulated += segment.percentage;

              return (
                <Circle
                  key={segment.label}
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                />
              );
            })}
          </G>
        </Svg>

        {/* Legend */}
        <View style={styles.legend}>
          {data.map((segment) => (
            <View key={segment.label} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: segment.color }]} />
              <View style={styles.legendText}>
                <Text style={styles.legendLabel}>{segment.label}</Text>
                <Text style={styles.legendValue}>{segment.percentage}%</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  legend: {
    gap: spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs,
  },
  legendLabel: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  legendValue: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: '600',
  },
});
