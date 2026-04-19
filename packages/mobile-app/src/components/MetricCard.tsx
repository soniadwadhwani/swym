import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../theme';

interface MetricCardProps {
  label: string;
  value: string;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
}

export function MetricCard({ label, value, unit, trend }: MetricCardProps) {
  const trendIcon =
    trend === 'up' ? 'trending-up' : trend === 'down' ? 'trending-down' : 'remove';
  const trendColor =
    trend === 'up' ? colors.success : trend === 'down' ? colors.error : colors.textMuted;

  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueRow}>
        <Text style={styles.value}>{value}</Text>
        {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </View>
      {trend ? (
        <View style={styles.trendRow}>
          <Ionicons name={trendIcon as any} size={14} color={trendColor} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.cardRadius,
    padding: spacing.cardPadding,
    flex: 1,
    minWidth: 140,
    ...spacing.cardShadow,
  },
  label: {
    ...typography.label,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.xs,
  },
  value: {
    ...typography.metricSmall,
    color: colors.textPrimary,
  },
  unit: {
    ...typography.caption,
    color: colors.textMuted,
    marginLeft: 4,
  },
  trendRow: {
    marginTop: 2,
  },
});
