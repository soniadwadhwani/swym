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
 * Designed for social pressure. Large, minimal, pure ranking.
 */
export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ rings }) => {
  const sorted = [...rings]
    .filter(r => !r.signalLost && r.currentLap > 0)
    .sort((a, b) => a.deltaMs - b.deltaMs);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: `0 ${deviceLayout.screenPadding}px`,
      paddingBottom: deviceLayout.screenPadding,
    }}>
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
              background: 'rgba(255,255,255,0.04)',
              borderRadius: 12,
              borderLeft: index === 0 ? `3px solid ${colors.accent}` : '3px solid transparent',
            }}
          >
            {/* Rank */}
            <div style={{
              width: 32,
              fontSize: deviceFontSizes.metric,
              fontWeight: fontWeights.medium,
              color: index === 0 ? colors.accent : 'rgba(255,255,255,0.30)',
              textAlign: 'center',
            }}>
              {index + 1}
            </div>

            {/* Name */}
            <div style={{
              flex: 1,
              fontSize: deviceFontSizes.heading,
              fontWeight: fontWeights.medium,
              color: colors.white,
              marginLeft: spacing.md,
            }}>
              {ring.swimmerName}
            </div>

            {/* Pace (last split) */}
            <div style={{
              fontSize: deviceFontSizes.heading,
              fontWeight: fontWeights.light,
              color: 'rgba(255,255,255,0.50)',
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
            color: 'rgba(255,255,255,0.25)',
            fontSize: deviceFontSizes.label,
            fontWeight: fontWeights.light,
          }}>
            Waiting for lap data…
          </div>
        )}
      </div>
    </div>
  );
};
