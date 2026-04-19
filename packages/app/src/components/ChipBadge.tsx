import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '../theme';

interface Props {
  label: string;
  icon?: string;
  color?: string;
  bgColor?: string;
}

export const ChipBadge: React.FC<Props> = ({
  label,
  icon,
  color = Colors.accent,
  bgColor,
}) => (
  <View style={[styles.chip, { backgroundColor: bgColor ?? color + '18' }]}>
    {icon && <Text style={styles.icon}>{icon}</Text>}
    <Text style={[styles.label, { color }]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 100,
    gap: Spacing.xs,
  },
  icon: {
    fontSize: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
