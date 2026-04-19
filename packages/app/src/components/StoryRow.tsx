import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing } from '../theme';

interface Story {
  id: string;
  name: string;
  active: boolean;
}

interface Props {
  stories: Story[];
}

export const StoryRow: React.FC<Props> = ({ stories }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.scroll}
  >
    {stories.map((story) => (
      <TouchableOpacity key={story.id} style={styles.item} activeOpacity={0.7}>
        <View style={styles.ring}>
          {story.active && (
            <LinearGradient
              colors={[Colors.accent, '#22C55E']}
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          )}
          <View style={styles.avatar}>
            <Text style={styles.initial}>{story.name[0]}</Text>
          </View>
        </View>
        <Text style={styles.name} numberOfLines={1}>{story.name}</Text>
        {story.active && <View style={styles.dot} />}
      </TouchableOpacity>
    ))}
  </ScrollView>
);

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Spacing.screenPadding,
    gap: Spacing.lg,
  },
  item: {
    alignItems: 'center',
    width: 64,
  },
  ring: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 28,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.softSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  initial: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primaryDark,
  },
  name: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.textMuted,
    textAlign: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
    position: 'absolute',
    top: 2,
    right: 8,
  },
});
