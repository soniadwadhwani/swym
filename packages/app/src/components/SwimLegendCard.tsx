import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Layout, Shadows } from '../theme';

interface Props {
  name: string;
  discipline: string;
  bestTime: string;
  description: string;
}

export const SwimLegendCard: React.FC<Props> = ({ name, discipline, bestTime, description }) => (
  <TouchableOpacity style={styles.card} activeOpacity={0.7}>
    <LinearGradient
      colors={[Colors.primaryDark, '#1E1650']}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Decorative wave */}
      <View style={styles.waveAccent} />

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{name[0]}</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.discipline}>{discipline}</Text>
          </View>
        </View>

        <Text style={styles.time}>{bestTime}</Text>
        <Text style={styles.description}>{description}</Text>

        <View style={styles.cta}>
          <Text style={styles.ctaText}>Swim Their Pace →</Text>
        </View>
      </View>
    </LinearGradient>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: Layout.cardRadius,
    overflow: 'hidden',
    width: 260,
    ...Shadows.card,
  },
  gradient: {
    padding: Spacing.xl,
    minHeight: 200,
  },
  waveAccent: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 100,
    height: 100,
    backgroundColor: Colors.accent + '10',
    borderBottomLeftRadius: 100,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.accent + '30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.accent,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.white,
  },
  discipline: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  time: {
    fontSize: 32,
    fontWeight: '200',
    color: Colors.accent,
    letterSpacing: -1,
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 18,
    marginBottom: Spacing.lg,
  },
  cta: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Spacing.md,
    backgroundColor: Colors.accent + '20',
    borderWidth: 1,
    borderColor: Colors.accent + '40',
  },
  ctaText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.accent,
  },
});
