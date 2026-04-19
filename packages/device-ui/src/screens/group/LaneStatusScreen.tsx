import React from 'react';
import { colors, deviceFontSizes, fontWeights, spacing, deviceLayout } from '@swym/design-system';
import type { RingState } from '@swym/design-system';
import { StatusPill } from '../../components/StatusPill';

interface LaneStatusScreenProps {
  rings: RingState[];
}

/**
 * Group Screen 1 — The Lane Status Screen (default)
 *
 * ONE JOB: "Who needs my attention right now?"
 *
 * Compact ranked list. Coach's eye goes straight to red pills.
 * Frosted glass rows, teal accent for top performer.
 */
export const LaneStatusScreen: React.FC<LaneStatusScreenProps> = ({ rings }) => {
  const sorted = [...rings]
    .filter(r => !r.signalLost)
    .sort((a, b) => a.deltaMs - b.deltaMs);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: `0 ${deviceLayout.screenPadding}px`,
      paddingBottom: deviceLayout.screenPadding,
    }}>
      {/* Swimmer rows */}
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
              height: deviceLayout.rowHeight,
              padding: `0 ${spacing.lg}px`,
              background: 'rgba(255,255,255,0.04)',
              borderRadius: 12,
              borderLeft: index === 0 ? `3px solid ${colors.accent}` : '3px solid transparent',
            }}
          >
            {/* Name */}
            <div style={{
              flex: 1,
              fontSize: deviceFontSizes.label,
              fontWeight: fontWeights.medium,
              color: colors.white,
            }}>
              {ring.swimmerName}
            </div>

            {/* Current lap */}
            <div style={{
              fontSize: deviceFontSizes.body,
              color: 'rgba(255,255,255,0.40)',
              marginRight: spacing.lg,
              fontWeight: fontWeights.light,
            }}>
              Lap {ring.currentLap}/{ring.totalLaps}
            </div>

            {/* Status pill */}
            <StatusPill status={ring.paceStatus} />
          </div>
        ))}
      </div>
    </div>
  );
};
