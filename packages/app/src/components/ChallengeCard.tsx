import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, Layout, Shadows } from '../theme';

interface Props {
  title: string;
  progress: number;
  participants: number;
  icon: string;
}

export const ChallengeCard: React.FC<Props> = ({ title, progress, participants, icon }) => {
  const isComplete = progress >= 1;

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7}>
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.barBg}>
          <View
            style={[
              styles.barFill,
              {
                width: `${Math.min(progress, 1) * 100}%`,
                backgroundColor: isComplete ? Colors.success : Colors.accent,
              },
            ]}
          />
        </View>
        <Text style={styles.meta}>
          {isComplete ? '✓ Completed' : `${Math.round(progress * 100)}%`}
          {' · '}{participants} swimmers
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderRadius: Layout.cardRadiusSmall,
    padding: Spacing.lg,
    gap: Spacing.md,
    ...Shadows.soft,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.shimmer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  barBg: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: Spacing.xs,
  },
  barFill: {
    height: 4,
    borderRadius: 2,
  },
  meta: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
  },
});
