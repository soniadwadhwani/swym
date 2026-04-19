import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, typography, spacing } from '../theme';
import { StoryUser } from '../types';

interface StoryRowProps {
  users: StoryUser[];
}

export function StoryRow({ users }: StoryRowProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {users.map((user) => (
        <TouchableOpacity key={user.id} style={styles.storyItem} activeOpacity={0.7}>
          <View style={[styles.avatarRing, user.isLive && styles.liveRing]}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user.avatar}</Text>
            </View>
          </View>
          <Text style={styles.name} numberOfLines={1}>
            {user.name}
          </Text>
          {user.isLive && <View style={styles.liveBadge}><Text style={styles.liveText}>LIVE</Text></View>}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.screenPadding,
    gap: spacing.md,
  },
  storyItem: {
    alignItems: 'center',
    width: 72,
  },
  avatarRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2.5,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  liveRing: {
    borderColor: colors.accent,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    ...typography.chip,
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 16,
  },
  name: {
    ...typography.caption,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  liveBadge: {
    position: 'absolute',
    bottom: 18,
    backgroundColor: colors.accent,
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  liveText: {
    fontSize: 8,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.5,
  },
});
