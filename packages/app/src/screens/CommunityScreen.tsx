import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Typography, Spacing, Layout, Shadows } from '../theme';
import { SectionHeader } from '../components/SectionHeader';
import { StoryRow } from '../components/StoryRow';
import { FeedCard } from '../components/FeedCard';
import { ChallengeCard } from '../components/ChallengeCard';
import { SwimLegendCard } from '../components/SwimLegendCard';
import { stories, feedItems, challenges, legends } from '../data/mockData';

export const CommunityScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Community</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Stories */}
        <Animated.View entering={FadeInDown.springify()}>
          <StoryRow stories={stories} />
        </Animated.View>

        <View style={styles.padded}>
          {/* Feed */}
          <Animated.View entering={FadeInDown.delay(100).springify()}>
            <SectionHeader title="Activity" action="See All" />
            <View style={styles.feedList}>
              {feedItems.map((item) => (
                <FeedCard
                  key={item.id}
                  user={item.user}
                  action={item.action}
                  detail={item.detail}
                  time={item.time}
                  likes={item.likes}
                  type={item.type}
                />
              ))}
            </View>
          </Animated.View>

          {/* Challenges */}
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <SectionHeader title="Challenges" action="Browse" />
            <View style={styles.challengeList}>
              {challenges.map((c) => (
                <ChallengeCard
                  key={c.id}
                  title={c.title}
                  progress={c.progress}
                  participants={c.participants}
                  icon={c.icon}
                />
              ))}
            </View>
          </Animated.View>

          {/* Swim With Legends */}
          <Animated.View entering={FadeInDown.delay(300).springify()}>
            <SectionHeader title="Swim With Legends" />
          </Animated.View>
        </View>

        {/* Horizontal legend cards */}
        <Animated.View entering={FadeInDown.delay(400).springify()}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.legendScroll}
          >
            {legends.map((leg) => (
              <SwimLegendCard
                key={leg.name}
                name={leg.name}
                discipline={leg.event}
                bestTime={leg.pace}
                description={`Race their pace in ${leg.event}`}
              />
            ))}
          </ScrollView>
        </Animated.View>

        <View style={{ height: Layout.tabBarHeight + Spacing['3xl'] }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.lg,
  },
  title: {
    ...Typography.h1,
  },
  scroll: {
    gap: Spacing['3xl'],
    paddingTop: Spacing.lg,
  },
  padded: {
    paddingHorizontal: Spacing.screenPadding,
    gap: Spacing['3xl'],
  },
  feedList: {
    gap: Spacing.md,
  },
  challengeList: {
    gap: Spacing.md,
  },
  legendScroll: {
    paddingHorizontal: Spacing.screenPadding,
    gap: Spacing.lg,
  },
});
