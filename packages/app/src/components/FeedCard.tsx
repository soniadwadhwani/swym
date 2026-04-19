import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Layout, Shadows } from '../theme';

interface Props {
  user: string;
  action: string;
  detail: string;
  time: string;
  likes: number;
  type: 'swim' | 'pb' | 'coach';
}

const typeConfig = {
  swim: { icon: 'water' as const, color: Colors.accent },
  pb: { icon: 'trophy' as const, color: Colors.warning },
  coach: { icon: 'document-text' as const, color: Colors.success },
};

export const FeedCard: React.FC<Props> = ({ user, action, detail, time, likes, type }) => {
  const { icon, color } = typeConfig[type];

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={[styles.avatar, { backgroundColor: color + '15' }]}>
          <Ionicons name={icon} size={18} color={color} />
        </View>
        <View style={styles.content}>
          <Text style={styles.headline}>
            <Text style={styles.userName}>{user}</Text> {action}
          </Text>
          <Text style={styles.detail}>{detail}</Text>
          <View style={styles.meta}>
            <Text style={styles.time}>{time}</Text>
            <TouchableOpacity style={styles.likeBtn} activeOpacity={0.6}>
              <Ionicons name="heart-outline" size={14} color={Colors.textMuted} />
              <Text style={styles.likeCount}>{likes}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: Layout.cardRadius,
    padding: Spacing.xl,
    ...Shadows.card,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  headline: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
    marginBottom: 4,
  },
  userName: {
    fontWeight: '600',
  },
  detail: {
    fontSize: 13,
    color: Colors.textMuted,
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  time: {
    fontSize: 12,
    color: Colors.textLight,
  },
  likeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  likeCount: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500',
  },
});
