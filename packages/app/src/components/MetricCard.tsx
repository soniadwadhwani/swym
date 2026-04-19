import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Layout, Shadows } from '../theme';

interface Props {
  label: string;
  value: string;
  unit: string;
  change?: string;
  positive?: boolean;
}

export const MetricCard: React.FC<Props> = ({
  label,
  value,
  unit,
  change,
  positive = true,
}) => (
  <View style={styles.card}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.valueRow}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.unit}>{unit}</Text>
    </View>
    {change && (
      <Text style={[styles.change, { color: positive ? Colors.success : Colors.error }]}>
        {change}
      </Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.cardBg,
    borderRadius: Layout.cardRadiusSmall,
    padding: Spacing.lg,
    ...Shadows.card,
  },
  label: {
    ...Typography.label,
    marginBottom: Spacing.sm,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  value: {
    ...Typography.metricSmall,
  },
  unit: {
    ...Typography.metricUnit,
  },
  change: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: Spacing.xs,
  },
});
