import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  type SharedValue,
} from 'react-native-reanimated';
import { Colors, Typography, Spacing, Layout } from '../theme';
import { ChipBadge } from './ChipBadge';

// Conditionally import expo-av — it can crash on web
let VideoComponent: any = null;
let ResizeModeValue: any = null;
try {
  const av = require('expo-av');
  VideoComponent = av.Video;
  ResizeModeValue = av.ResizeMode?.COVER ?? 'cover';
} catch {
  // expo-av not available on web — skip video
}

interface Props {
  scrollY: SharedValue<number>;
  recovery: number;
  nextSwim: string;
  ringConnected: boolean;
  onStartSwim?: () => void;
  onPlanSession?: () => void;
}

let waterVideo: any = null;
try {
  waterVideo = require('../../../video/water.mp4');
} catch {
  // video asset not found — use fallback
}

export const HeroVideo: React.FC<Props> = ({
  scrollY,
  recovery,
  nextSwim,
  ringConnected,
  onStartSwim,
  onPlanSession,
}) => {
  const heroAnimStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, Layout.heroHeight * 0.5],
      [1, 0],
      Extrapolation.CLAMP,
    );
    const scale = interpolate(
      scrollY.value,
      [0, Layout.heroHeight * 0.5],
      [1, 0.95],
      Extrapolation.CLAMP,
    );
    return { opacity, transform: [{ scale }] };
  });

  return (
    <Animated.View style={[styles.hero, heroAnimStyle]}>
      {/* Video background — falls back to solid color on web */}
      {VideoComponent && waterVideo ? (
        <VideoComponent
          source={waterVideo}
          style={StyleSheet.absoluteFillObject}
          resizeMode={ResizeModeValue}
          shouldPlay
          isLooping
          isMuted
        />
      ) : (
        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: Colors.primaryDark }]} />
      )}

      {/* Dark gradient overlay */}
      <LinearGradient
        colors={['rgba(20,12,50,0.25)', 'rgba(20,12,50,0.65)', 'rgba(20,12,50,0.85)']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Content */}
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoWrap}>
          <Text style={styles.logo}>SWYM</Text>
          <Text style={styles.tagline}>SWIM YOUR PACE</Text>
        </View>

        {/* Floating chips */}
        <View style={styles.chips}>
          <ChipBadge
            label={ringConnected ? 'Ring Connected' : 'Ring Offline'}
            icon="●"
            color={ringConnected ? '#22C55E' : '#EF4444'}
            bgColor="rgba(255,255,255,0.12)"
          />
          <ChipBadge
            label={`Recovery ${recovery}%`}
            icon="♥"
            color="#FFFFFF"
            bgColor="rgba(255,255,255,0.12)"
          />
          <ChipBadge
            label={`Next Swim ${nextSwim}`}
            icon="◷"
            color="#FFFFFF"
            bgColor="rgba(255,255,255,0.12)"
          />
        </View>

        {/* Buttons */}
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.primaryBtn} onPress={onStartSwim} activeOpacity={0.8}>
            <Text style={styles.primaryBtnText}>Start Swim</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={onPlanSession} activeOpacity={0.7}>
            <Text style={styles.secondaryBtnText}>Plan Session</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  hero: {
    height: Layout.heroHeight,
    justifyContent: 'flex-end',
  },
  content: {
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: Spacing['5xl'],
    gap: Spacing['2xl'],
  },
  logoWrap: {
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  logo: {
    fontSize: 52,
    fontWeight: '200',
    letterSpacing: 8,
    color: Colors.white,
  },
  tagline: {
    ...Typography.heroSubtitle,
    fontSize: 13,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  buttons: {
    gap: Spacing.md,
  },
  primaryBtn: {
    backgroundColor: Colors.accent,
    paddingVertical: Spacing.lg,
    borderRadius: Spacing.lg,
    alignItems: 'center',
  },
  primaryBtnText: {
    ...Typography.button,
    color: Colors.white,
  },
  secondaryBtn: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingVertical: Spacing.lg,
    borderRadius: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  secondaryBtnText: {
    ...Typography.button,
    color: Colors.white,
  },
});
