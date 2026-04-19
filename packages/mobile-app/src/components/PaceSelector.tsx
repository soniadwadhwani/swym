import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing } from '../theme';
import { paceModes } from '../data/mockData';

export function PaceSelector() {
  const [selected, setSelected] = useState(1);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Target 100m Pace</Text>

      <Text style={styles.paceDisplay}>{paceModes[selected].pace}</Text>
      <Text style={styles.paceLabel}>{paceModes[selected].label}</Text>

      <View style={styles.modeRow}>
        {paceModes.map((mode, index) => (
          <TouchableOpacity
            key={mode.label}
            style={[
              styles.modeButton,
              selected === index && { backgroundColor: mode.color },
            ]}
            onPress={() => setSelected(index)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.modeLabel,
                selected === index && styles.modeLabelActive,
              ]}
            >
              {mode.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.cardRadius,
    padding: spacing.cardPadding,
    alignItems: 'center',
    ...spacing.cardShadow,
  },
  title: {
    ...typography.label,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  paceDisplay: {
    ...typography.metric,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  paceLabel: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  modeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  modeButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: spacing.buttonRadius,
    backgroundColor: colors.borderLight,
  },
  modeLabel: {
    ...typography.chip,
    color: colors.textMuted,
    fontWeight: '600',
  },
  modeLabelActive: {
    color: colors.white,
  },
});
