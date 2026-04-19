import React from 'react';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { ViewStyle, StyleProp } from 'react-native';

interface AnimatedCardProps {
  children: React.ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}

export function AnimatedCard({ children, delay = 0, style }: AnimatedCardProps) {
  return (
    <Animated.View
      entering={FadeInUp.delay(delay).duration(600).springify()}
      style={style}
    >
      {children}
    </Animated.View>
  );
}
