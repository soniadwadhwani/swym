import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing } from '../theme';

interface Props {
  title: string;
  action?: string;
  onAction?: () => void;
}

export const SectionHeader: React.FC<Props> = ({ title, action, onAction }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    {action && (
      <TouchableOpacity onPress={onAction} activeOpacity={0.6}>
        <Text style={styles.action}>{action}</Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.h3,
  },
  action: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.accent,
  },
});
