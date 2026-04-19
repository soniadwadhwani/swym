import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../theme';

interface InsightCardProps {
  title?: string;
  insight: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function InsightCard({
  title = 'AI Coach Insight',
  insight,
  icon = 'sparkles',
}: InsightCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconBg}>
          <Ionicons name={icon} size={18} color={colors.accent} />
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.text}>{insight}</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accentSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  title: {
    ...typography.cardTitle,
    color: colors.textPrimary,
  },
  text: {
    ...typography.body,
    color: colors.textMuted,
    lineHeight: 24,
  },
});
