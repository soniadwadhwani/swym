import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Layout, Shadows } from '../theme';

interface Props {
  title: string;
  body: string;
  tag?: string;
}

export const InsightCard: React.FC<Props> = ({ title, body, tag }) => (
  <View style={styles.card}>
    <View style={styles.header}>
      <View style={styles.iconCircle}>
        <Ionicons name="sparkles" size={18} color={Colors.accent} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {tag && (
        <View style={styles.tag}>
          <Text style={styles.tagText}>{tag}</Text>
        </View>
      )}
    </View>
    <Text style={styles.body}>{body}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: Layout.cardRadius,
    padding: Spacing['2xl'],
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
    ...Shadows.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...Typography.h3,
    fontSize: 15,
    flex: 1,
  },
  tag: {
    backgroundColor: Colors.accentLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.accent,
  },
  body: {
    ...Typography.bodyMuted,
    fontSize: 14,
    lineHeight: 21,
  },
});
