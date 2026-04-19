import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../theme';
import { Workout } from '../types';

interface WorkoutCardProps {
  workout: Workout;
  onViewPlan?: () => void;
}

export function WorkoutCard({ workout, onViewPlan }: WorkoutCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.coachRow}>
        <View style={styles.coachAvatar}>
          <Ionicons name="person" size={16} color={colors.white} />
        </View>
        <View style={styles.coachInfo}>
          <Text style={styles.coachName}>{workout.coach}</Text>
          <Text style={styles.workoutTitle}>{workout.title}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.detailRow}>
        <View style={styles.detail}>
          <Text style={styles.detailValue}>{workout.totalDistance}m</Text>
          <Text style={styles.detailLabel}>PLANNED</Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.detailValue}>{workout.sets.length}</Text>
          <Text style={styles.detailLabel}>SETS</Text>
        </View>
        <TouchableOpacity style={styles.viewButton} onPress={onViewPlan}>
          <Text style={styles.viewButtonText}>View Plan</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.accent} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.cardRadius,
    padding: spacing.cardPadding,
    ...spacing.cardShadow,
  },
  coachRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
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
  coachInfo: {
    flex: 1,
  },
  coachName: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: 2,
  },
  workoutTitle: {
    ...typography.cardTitle,
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detail: {
    marginRight: spacing.xl,
  },
  detailValue: {
    ...typography.cardTitle,
    color: colors.textPrimary,
  },
  detailLabel: {
    ...typography.label,
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.accentSoft,
    borderRadius: spacing.buttonRadius,
  },
  viewButtonText: {
    ...typography.chip,
    color: colors.accent,
    fontWeight: '600',
    marginRight: 4,
  },
});
