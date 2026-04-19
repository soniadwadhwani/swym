import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../theme';
import { AnimatedCard } from '../components/AnimatedCard';
import { StoryRow } from '../components/StoryRow';
import {
  storyUsers,
  feedItems,
  challenges,
  legendSwimmers,
} from '../data/mockData';

export function CommunityScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Header */}
        <AnimatedCard delay={0}>
          <Text style={styles.screenTitle}>Community</Text>
        </AnimatedCard>

        {/* Stories */}
        <AnimatedCard delay={100}>
          <View style={styles.storiesSection}>
            <Text style={styles.sectionLabel}>TRAINING NOW</Text>
            <StoryRow users={storyUsers} />
          </View>
        </AnimatedCard>

        {/* Feed */}
        <AnimatedCard delay={200}>
          <View style={styles.feedSection}>
            {feedItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.feedCard}
                activeOpacity={0.8}
              >
                <View style={styles.feedAvatar}>
                  <Text style={styles.feedAvatarText}>{item.avatar}</Text>
                </View>
                <View style={styles.feedContent}>
                  <Text style={styles.feedText}>
                    <Text style={styles.feedUsername}>{item.user}</Text>
                    {' '}{item.action}{' '}
                    <Text style={styles.feedDetail}>{item.detail}</Text>
                  </Text>
                  <View style={styles.feedMeta}>
                    <Text style={styles.feedTime}>{item.time}</Text>
                    <View style={styles.feedLikes}>
                      <Ionicons name="heart" size={12} color={colors.error} />
                      <Text style={styles.feedLikeCount}>{item.likes}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </AnimatedCard>

        {/* Challenges */}
        <AnimatedCard delay={300}>
          <Text style={styles.sectionTitle}>Challenges</Text>
          <View style={styles.challengeList}>
            {challenges.map((challenge) => {
              const progress = (challenge.progress / challenge.total) * 100;
              return (
                <TouchableOpacity
                  key={challenge.id}
                  style={styles.challengeCard}
                  activeOpacity={0.8}
                >
                  <View style={styles.challengeHeader}>
                    <Text style={styles.challengeTitle}>{challenge.title}</Text>
                    <View style={styles.daysChip}>
                      <Text style={styles.daysText}>{challenge.daysLeft}d left</Text>
                    </View>
                  </View>
                  <View style={styles.progressBar}>
                    <View
                      style={[styles.progressFill, { width: `${progress}%` }]}
                    />
                  </View>
                  <Text style={styles.challengeProgress}>
                    {challenge.progress} / {challenge.total} {challenge.unit}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </AnimatedCard>

        {/* Swim With Legends */}
        <AnimatedCard delay={400}>
          <Text style={styles.sectionTitle}>Swim With Legends</Text>
          <Text style={styles.sectionSubtitle}>
            Train at the pace of champions
          </Text>
          <View style={styles.legendList}>
            {legendSwimmers.map((legend) => (
              <TouchableOpacity
                key={legend.id}
                style={styles.legendCard}
                activeOpacity={0.8}
              >
                <View style={styles.legendAvatar}>
                  <Text style={styles.legendAvatarText}>{legend.avatar}</Text>
                </View>
                <View style={styles.legendInfo}>
                  <Text style={styles.legendName}>{legend.name}</Text>
                  <Text style={styles.legendEvent}>{legend.event}</Text>
                </View>
                <View style={styles.legendPaceSection}>
                  <Text style={styles.legendPace}>{legend.pace}</Text>
                  <TouchableOpacity style={styles.trainButton} activeOpacity={0.7}>
                    <Text style={styles.trainButtonText}>Train</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </AnimatedCard>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingTop: spacing.lg,
  },

  screenTitle: {
    ...typography.screenTitle,
    color: colors.textPrimary,
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.lg,
  },

  // Stories
  storiesSection: {
    marginBottom: spacing.xl,
  },
  sectionLabel: {
    ...typography.label,
    color: colors.textMuted,
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.md,
  },

  // Feed
  feedSection: {
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.xl,
    gap: 2,
  },
  feedCard: {
    flexDirection: 'row',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  feedAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  feedAvatarText: {
    ...typography.chip,
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 14,
  },
  feedContent: {
    flex: 1,
  },
  feedText: {
    ...typography.body,
    color: colors.textMuted,
    lineHeight: 22,
  },
  feedUsername: {
    fontWeight: '600',
    color: colors.textPrimary,
  },
  feedDetail: {
    color: colors.textPrimary,
  },
  feedMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: 6,
  },
  feedTime: {
    ...typography.caption,
    color: colors.textMuted,
  },
  feedLikes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  feedLikeCount: {
    ...typography.caption,
    color: colors.textMuted,
  },

  // Section titles
  sectionTitle: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.sm,
  },
  sectionSubtitle: {
    ...typography.body,
    color: colors.textMuted,
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.lg,
  },

  // Challenges
  challengeList: {
    paddingHorizontal: spacing.screenPadding,
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  challengeCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.cardRadius,
    padding: spacing.cardPadding,
    ...spacing.cardShadowLight,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  challengeTitle: {
    ...typography.cardTitle,
    color: colors.textPrimary,
    flex: 1,
  },
  daysChip: {
    backgroundColor: colors.accentSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  daysText: {
    ...typography.chip,
    color: colors.accent,
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.borderLight,
    borderRadius: 3,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 3,
  },
  challengeProgress: {
    ...typography.caption,
    color: colors.textMuted,
  },

  // Legends
  legendList: {
    paddingHorizontal: spacing.screenPadding,
    gap: spacing.md,
  },
  legendCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.cardRadius,
    padding: spacing.cardPadding,
    flexDirection: 'row',
    alignItems: 'center',
    ...spacing.cardShadowLight,
  },
  legendAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  legendAvatarText: {
    ...typography.chip,
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  legendInfo: {
    flex: 1,
  },
  legendName: {
    ...typography.cardTitle,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  legendEvent: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  legendPaceSection: {
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  legendPace: {
    ...typography.bodySmall,
    color: colors.textMuted,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  trainButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: spacing.buttonRadius,
  },
  trainButtonText: {
    ...typography.chip,
    color: colors.white,
    fontWeight: '600',
  },
});
