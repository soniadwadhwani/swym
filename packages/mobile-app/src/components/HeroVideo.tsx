import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface HeroVideoProps {
  children: React.ReactNode;
}

/**
 * Full-screen hero background with deep gradient.
 * To add video: install expo-av, import Video, and render it
 * with StyleSheet.absoluteFill inside the container before the gradient.
 *
 * Example:
 *   <Video source={require('../../assets/videos/water.mp4')}
 *     style={StyleSheet.absoluteFill} resizeMode="cover"
 *     shouldPlay isLooping isMuted />
 */
export function HeroVideo({ children }: HeroVideoProps) {
  return (
    <View style={styles.container}>
      {/* Deep ambient gradient background */}
      <LinearGradient
        colors={['#080412', '#140C32', '#1c1252', '#100a38', '#0a0618']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
      />

      {/* Decorative ambient orbs */}
      <View style={styles.orbLarge} />
      <View style={styles.orbMedium} />
      <View style={styles.orbSmall} />

      {/* Subtle vignette overlay */}
      <LinearGradient
        colors={['rgba(10,6,24,0.3)', 'transparent', 'rgba(10,6,24,0.5)']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    height,
    position: 'relative',
    overflow: 'hidden',
  },
  orbLarge: {
    position: 'absolute',
    width: width * 1.6,
    height: width * 1.6,
    borderRadius: width * 0.8,
    backgroundColor: 'rgba(112,124,255,0.04)',
    top: -width * 0.4,
    left: -width * 0.3,
  },
  orbMedium: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    backgroundColor: 'rgba(112,124,255,0.03)',
    bottom: -width * 0.2,
    right: -width * 0.4,
  },
  orbSmall: {
    position: 'absolute',
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: 'rgba(112,124,255,0.05)',
    top: height * 0.3,
    right: -width * 0.1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
});
