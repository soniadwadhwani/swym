import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../theme';
import { liveLapSplits } from '../data/mockData';

const { width } = Dimensions.get('window');

function formatTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  const centis = Math.floor((ms % 1000) / 10);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${centis.toString().padStart(2, '0')}`;
}

function formatSplit(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  const tenths = Math.floor((ms % 1000) / 100);
  return `${mins}:${secs.toString().padStart(2, '0')}.${tenths}`;
}

interface LiveSwimScreenProps {
  navigation?: any;
}

export function LiveSwimScreen({ navigation }: LiveSwimScreenProps) {
  const insets = useSafeAreaInsets();
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [currentLap, setCurrentLap] = useState(liveLapSplits.length);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const startTime = liveLapSplits.reduce((acc, l) => acc + l.time, 0);
    setElapsed(startTime);

    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => prev + 10);
      }, 10);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const lastSplit = liveLapSplits[liveLapSplits.length - 1];
  const delta = lastSplit.time - lastSplit.target;
  const deltaSign = delta > 0 ? '+' : '';
  const deltaFormatted = `${deltaSign}${(delta / 1000).toFixed(1)}s`;

  const paceStatus =
    Math.abs(delta) < 500 ? 'On Pace' : delta > 0 ? 'Slow' : 'Fast';
  const paceColor =
    Math.abs(delta) < 500
      ? colors.success
      : delta > 0
      ? colors.error
      : colors.accent;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Close button */}
      <Animated.View entering={FadeIn.delay(300)} style={styles.closeRow}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation?.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={24} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </Animated.View>

      {/* Main timer */}
      <Animated.View entering={FadeInUp.delay(200).duration(600)} style={styles.timerSection}>
        <Text style={styles.lapLabel}>LAP {currentLap + 1} · 50M FREE</Text>
        <Text style={styles.timer}>{formatTime(elapsed)}</Text>
      </Animated.View>

      {/* Split info */}
      <Animated.View entering={FadeInUp.delay(400).duration(600)} style={styles.splitSection}>
        <View style={styles.splitCard}>
          <Text style={styles.splitLabel}>LAST SPLIT</Text>
          <Text style={styles.splitValue}>{formatSplit(lastSplit.time)}</Text>
        </View>
        <View style={styles.splitCard}>
          <Text style={styles.splitLabel}>TARGET</Text>
          <Text style={styles.splitValue}>{formatSplit(lastSplit.target)}</Text>
        </View>
        <View style={styles.splitCard}>
          <Text style={styles.splitLabel}>DELTA</Text>
          <Text style={[styles.splitValue, { color: paceColor }]}>{deltaFormatted}</Text>
        </View>
      </Animated.View>

      {/* Pace status */}
      <Animated.View entering={FadeInUp.delay(600).duration(600)} style={styles.statusSection}>
        <View style={[styles.statusPill, { backgroundColor: paceColor }]}>
          <Text style={styles.statusText}>{paceStatus}</Text>
        </View>
      </Animated.View>

      {/* Lap history */}
      <Animated.View entering={FadeInUp.delay(800).duration(600)} style={styles.lapHistory}>
        {liveLapSplits.map((lap) => {
          const d = lap.time - lap.target;
          const lColor = Math.abs(d) < 500 ? colors.success : d > 0 ? colors.error : colors.accent;
          return (
            <View key={lap.lap} style={styles.lapRow}>
              <Text style={styles.lapNum}>L{lap.lap}</Text>
              <Text style={styles.lapTime}>{formatSplit(lap.time)}</Text>
              <Text style={[styles.lapDelta, { color: lColor }]}>
                {d > 0 ? '+' : ''}{(d / 1000).toFixed(1)}s
              </Text>
            </View>
          );
        })}
      </Animated.View>

      {/* Controls */}
      <View style={[styles.controls, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setIsRunning(!isRunning)}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isRunning ? 'pause' : 'play'}
            size={28}
            color={colors.white}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButtonSecondary} activeOpacity={0.8}>
          <Ionicons name="flag" size={22} color="rgba(255,255,255,0.6)" />
          <Text style={styles.controlLabel}>Split</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.controlButtonStop}
          activeOpacity={0.8}
          onPress={() => navigation?.goBack()}
        >
          <Ionicons name="stop" size={22} color={colors.white} />
          <Text style={styles.controlLabel}>End</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#080412',
  },

  // Close
  closeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.md,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239,68,68,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
  },
  liveText: {
    ...typography.label,
    color: colors.error,
    fontSize: 11,
  },

  // Timer
  timerSection: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
  },
  lapLabel: {
    ...typography.label,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: spacing.sm,
  },
  timer: {
    fontSize: 72,
    fontWeight: '100',
    color: colors.white,
    letterSpacing: -2,
    fontVariant: ['tabular-nums'],
  },

  // Splits
  splitSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.screenPadding,
    marginTop: spacing.xxl,
  },
  splitCard: {
    alignItems: 'center',
  },
  splitLabel: {
    ...typography.label,
    color: 'rgba(255,255,255,0.35)',
    fontSize: 10,
    marginBottom: 6,
  },
  splitValue: {
    fontSize: 24,
    fontWeight: '300',
    color: colors.white,
    fontVariant: ['tabular-nums'],
  },

  // Status
  statusSection: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  statusPill: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: spacing.buttonRadius,
  },
  statusText: {
    ...typography.button,
    color: colors.white,
    fontSize: 18,
  },

  // Lap history
  lapHistory: {
    paddingHorizontal: spacing.screenPadding,
    marginTop: spacing.xl,
    gap: 8,
  },
  lapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  lapNum: {
    ...typography.label,
    color: 'rgba(255,255,255,0.3)',
    width: 40,
    fontSize: 11,
  },
  lapTime: {
    ...typography.body,
    color: 'rgba(255,255,255,0.8)',
    flex: 1,
    fontVariant: ['tabular-nums'],
  },
  lapDelta: {
    ...typography.body,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },

  // Controls
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
    paddingTop: spacing.lg,
    backgroundColor: 'rgba(8,4,18,0.9)',
  },
  controlButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonSecondary: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonStop: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(239,68,68,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlLabel: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.5)',
    fontSize: 9,
    marginTop: 2,
  },
});
