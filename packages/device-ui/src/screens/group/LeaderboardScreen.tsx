import React from 'react';
import { colors, deviceFontSizes, fontWeights, spacing, deviceLayout } from '@swym/design-system';
import { formatTimeMs } from '@swym/design-system';
import type { RingState } from '@swym/design-system';

interface LeaderboardScreenProps {
  rings: RingState[];
}

/**
 * Group Screen 4 — The Leaderboard Screen
 *
 * ONE JOB: "Who is winning?"
 *
 * Designed to be left visible during competitive training sets as social pressure.
 * Large text: rank, name, pace. NOTHING ELSE.
 * No delta, no lap count, no trend. Pure competitive ranking.
 */
export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ rings }) => {
  // Sort by average pace (deltaMs ascending — lower delta = better performance)
  const sorted = [...rings]
    .filter(r => !r.signalLost && r.currentLap > 0)
    .sort((a, b) => a.deltaMs - b.deltaMs);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: deviceLayout.screenPadding,
    }}>
      {/* Header */}
      <div style={{
        fontSize: deviceFontSizes.heading,
        fontWeight: fontWeights.medium,
        color: colors.gray400,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        textAlign: 'center',
        marginBottom: spacing.lg,
      }}>
        Leaderboard
      </div>

      {/* Ranked rows */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.sm,
      }}>
        {sorted.map((ring, index) => (
          <div
            key={ring.ringId}
            style={{
              display: 'flex',
              alignItems: 'center',
              height: deviceLayout.leaderboardRowHeight,
              padding: `0 ${spacing.lg}px`,
              background: index === 0 ? `${colors.purple}20` : colors.gray800,
              borderRadius: 8,
              borderLeft: index === 0 ? `4px solid ${colors.purple}` : '4px solid transparent',
            }}
          >
            {/* Rank */}
            <div style={{
              width: 36,
              fontSize: deviceFontSizes.metricLarge,
              fontWeight: fontWeights.medium,
              color: index === 0 ? colors.purple : colors.gray500,
              textAlign: 'center',
            }}>
              {index + 1}
            </div>

            {/* Name */}
            <div style={{
              flex: 1,
              fontSize: deviceFontSizes.metric,
              fontWeight: fontWeights.medium,
              color: colors.white,
              marginLeft: spacing.md,
            }}>
              {ring.swimmerName}
            </div>

            {/* Pace (last split) */}
            <div style={{
              fontSize: deviceFontSizes.metric,
              fontWeight: fontWeights.medium,
              color: colors.gray300,
            }}>
              {ring.lastSplitMs > 0 ? formatTimeMs(ring.lastSplitMs) : '—'}
            </div>
          </div>
        ))}

        {sorted.length === 0 && (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.gray600,
            fontSize: deviceFontSizes.label,
          }}>
            Waiting for lap data…
          </div>
        )}
      </div>
    </div>
  );
};
