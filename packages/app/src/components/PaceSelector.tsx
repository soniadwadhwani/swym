import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, Layout, Shadows } from '../theme';

interface PaceMode {
  label: string;
  pace: string;
  color: string;
}

interface Props {
  modes: PaceMode[];
}

export const PaceSelector: React.FC<Props> = ({ modes }) => {
  const [selectedIndex, setSelectedIndex] = useState(2); // default Race Pace
  const selected = modes[selectedIndex];

  // Convert pace string to slider-like visual position
  const position = ((selectedIndex) / (modes.length - 1)) * 100;

  return (
    <View style={styles.card}>
      <Text style={styles.label}>TARGET 100M PACE</Text>

      {/* Large pace display */}
      <View style={styles.paceDisplay}>
        <Text style={[styles.paceValue, { color: selected.color }]}>{selected.pace}</Text>
        <Text style={styles.paceUnit}>/100m</Text>
      </View>

      {/* Visual slider track */}
      <View style={styles.track}>
        <View style={[styles.trackFill, { width: `${position}%`, backgroundColor: selected.color }]} />
        <View
          style={[
            styles.thumb,
            {
              left: `${position}%`,
              backgroundColor: selected.color,
            },
          ]}
        />
      </View>

      {/* Mode pills */}
      <View style={styles.pills}>
        {modes.map((mode, i) => {
          const isActive = i === selectedIndex;
          return (
            <TouchableOpacity
              key={mode.label}
              style={[
                styles.pill,
                isActive && { backgroundColor: mode.color + '18', borderColor: mode.color },
              ]}
              onPress={() => setSelectedIndex(i)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.pillText,
                  isActive && { color: mode.color, fontWeight: '600' },
                ]}
              >
                {mode.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: Layout.cardRadius,
    padding: Spacing['2xl'],
    ...Shadows.card,
  },
  label: {
    ...Typography.label,
    marginBottom: Spacing.lg,
  },
  paceDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing['2xl'],
  },
  paceValue: {
    fontSize: 48,
    fontWeight: '200',
    letterSpacing: -2,
  },
  paceUnit: {
    ...Typography.metricUnit,
    fontSize: 16,
  },
  track: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    marginBottom: Spacing['2xl'],
    position: 'relative',
  },
  trackFill: {
    height: 6,
    borderRadius: 3,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  thumb: {
    position: 'absolute',
    top: -7,
    width: 20,
    height: 20,
    borderRadius: 10,
    marginLeft: -10,
    borderWidth: 3,
    borderColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  pills: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  pill: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: Spacing.md,
    alignItems: 'center',
    backgroundColor: Colors.shimmer,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  pillText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textMuted,
  },
});
