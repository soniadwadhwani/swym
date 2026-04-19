import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { colors, typography } from '../../theme';

interface CircularProgressProps {
  value: number;
  maxValue?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  unit?: string;
}

export function CircularProgress({
  value,
  maxValue = 100,
  size = 140,
  strokeWidth = 12,
  color = colors.accent,
  label,
  unit = '%',
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / maxValue, 1);
  const dashLength = progress * circumference;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${cx}, ${cy}`}>
          {/* Background track */}
          <Circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="rgba(20,12,50,0.05)"
            strokeWidth={strokeWidth}
          />
          {/* Progress arc */}
          <Circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${dashLength} ${circumference - dashLength}`}
            strokeLinecap="round"
          />
        </G>
      </Svg>

      {/* Center text */}
      <View style={[styles.centerText, { width: size, height: size }]}>
        <Text style={styles.value}>
          {value}
          <Text style={styles.unit}>{unit}</Text>
        </Text>
        {label && <Text style={styles.label}>{label}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
  },
  centerText: {
    position: 'absolute',
    top: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    ...typography.metricMedium,
    color: colors.textPrimary,
  },
  unit: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  label: {
    ...typography.label,
    color: colors.textMuted,
    marginTop: 2,
  },
});
