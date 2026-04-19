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
 * Compact ranked list of 5-7 swimmers. Each row shows name, current lap,
 * and a COLOR-CODED STATUS PILL (not numeric delta).
 * Coach's eye goes straight to red rows.
 */
export const LaneStatusScreen: React.FC<LaneStatusScreenProps> = ({ rings }) => {
  // Sort by delta ascending (best performers first)
  const sorted = [...rings]
    .filter(r => !r.signalLost)
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
        Lane Status
      </div>

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
              padding: `0 ${spacing.md}px`,
              background: index === 0 ? `${colors.purple}18` : colors.gray800,
              borderRadius: 8,
              borderLeft: index === 0 ? `3px solid ${colors.purple}` : '3px solid transparent',
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
              color: colors.gray400,
              marginRight: spacing.lg,
              fontWeight: fontWeights.medium,
            }}>
              Lap {ring.currentLap}/{ring.totalLaps}
            </div>

            {/* Status pill — NOT numeric delta */}
            <StatusPill status={ring.paceStatus} />
          </div>
        ))}
      </div>
    </div>
  );
};
