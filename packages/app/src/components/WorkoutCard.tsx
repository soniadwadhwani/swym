import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Layout, Shadows } from '../theme';

interface SetItem {
  label: string;
  detail: string;
  distance: number;
  color: string;
}

interface Props {
  coach: string;
  title: string;
  distance: number;
  sets: SetItem[];
  totalTime: string;
  onViewPlan?: () => void;
}

export const WorkoutCard: React.FC<Props> = ({
  coach,
  title,
  distance,
  sets,
  totalTime,
  onViewPlan,
}) => (
  <View style={styles.card}>
    {/* Header */}
    <View style={styles.header}>
      <View style={styles.coachAvatar}>
        <Text style={styles.coachInitial}>M</Text>
      </View>
      <View style={styles.headerText}>
        <Text style={styles.coach}>{coach}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>

    {/* Distance bar */}
    <View style={styles.distanceRow}>
      <Text style={styles.distanceValue}>{distance}m</Text>
      <Text style={styles.distanceLabel}>planned · {totalTime}</Text>
    </View>

    {/* Set breakdown bar */}
    <View style={styles.breakdownBar}>
      {sets.map((set, i) => (
        <View
          key={i}
          style={[
            styles.barSegment,
            {
              flex: set.distance,
              backgroundColor: set.color,
              borderTopLeftRadius: i === 0 ? 6 : 0,
              borderBottomLeftRadius: i === 0 ? 6 : 0,
              borderTopRightRadius: i === sets.length - 1 ? 6 : 0,
              borderBottomRightRadius: i === sets.length - 1 ? 6 : 0,
            },
          ]}
        />
      ))}
    </View>

    {/* Set labels */}
    <View style={styles.setList}>
      {sets.map((set, i) => (
        <View key={i} style={styles.setRow}>
          <View style={[styles.setDot, { backgroundColor: set.color }]} />
          <Text style={styles.setLabel}>{set.label}</Text>
          <Text style={styles.setDetail}>{set.detail}</Text>
        </View>
      ))}
    </View>

    {/* CTA */}
    <TouchableOpacity style={styles.button} onPress={onViewPlan} activeOpacity={0.7}>
      <Text style={styles.buttonText}>View Plan</Text>
      <Ionicons name="chevron-forward" size={16} color={Colors.accent} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: Layout.cardRadius,
    padding: Spacing['2xl'],
    ...Shadows.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  coachAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accent + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coachInitial: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.accent,
  },
  headerText: {
    flex: 1,
  },
  coach: {
    ...Typography.caption,
    marginBottom: 2,
  },
  title: {
    ...Typography.h3,
    fontSize: 16,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  distanceValue: {
    ...Typography.metricSmall,
    fontSize: 28,
  },
  distanceLabel: {
    ...Typography.bodyMuted,
    fontSize: 13,
  },
  breakdownBar: {
    flexDirection: 'row',
    height: 8,
    gap: 2,
    marginBottom: Spacing.lg,
  },
  barSegment: {
    height: 8,
    opacity: 0.8,
  },
  setList: {
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  setDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  setLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    width: 60,
  },
  setDetail: {
    fontSize: 13,
    color: Colors.textMuted,
    flex: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    borderRadius: Spacing.md,
    backgroundColor: Colors.accentSoft,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.accent,
  },
});
