import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Layout, Shadows } from '../theme';

interface Props {
  name: string;
  date: string;
  distance: string;
  pace: string;
  progress: number;
}

export const ContinueSession: React.FC<Props> = ({
  name,
  date,
  distance,
  pace,
  progress,
}) => (
  <TouchableOpacity style={styles.card} activeOpacity={0.7}>
    <View style={styles.row}>
      <View style={styles.iconWrap}>
        <Ionicons name="play-circle" size={32} color={Colors.accent} />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.meta}>{date} · {distance} · {pace}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
    </View>
    {/* Progress bar */}
    <View style={styles.barBg}>
      <View style={[styles.barFill, { width: `${progress * 100}%` }]} />
    </View>
    <Text style={styles.progressLabel}>{Math.round(progress * 100)}% completed</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: Layout.cardRadius,
    padding: Spacing['2xl'],
    ...Shadows.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  name: {
    ...Typography.h3,
    fontSize: 15,
    marginBottom: 2,
  },
  meta: {
    ...Typography.caption,
  },
  barBg: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  barFill: {
    height: 6,
    backgroundColor: Colors.accent,
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textMuted,
  },
});
