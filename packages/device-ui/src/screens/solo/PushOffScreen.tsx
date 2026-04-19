import React from 'react';
import { colors, deviceFontSizes, fontWeights, spacing, deviceLayout } from '@swym/design-system';
import { formatTimeMs } from '@swym/design-system';
import type { RingState, SetDefinition } from '@swym/design-system';

interface PushOffScreenProps {
  ring: RingState | null;
  currentSet: SetDefinition | null;
}

/**
 * Solo Screen 1 — The Push-Off Screen
 *
 * ONE JOB: "What does this lap need from me?"
 *
 * Shows ONLY: set name, target for this lap, lap X of Y.
 * No elapsed time, no total distance, no delta.
 * This is what the swimmer reads in the 10 seconds before pushing off.
 */
export const PushOffScreen: React.FC<PushOffScreenProps> = ({ ring, currentSet }) => {
  const setName = currentSet?.name ?? 'Free Swim';
  const targetMs = ring?.target.perLapMs ?? 0;
  const targetStr = targetMs > 0 ? formatTimeMs(targetMs) : '—';
  const currentLap = ring ? ring.currentLap + 1 : 1;
  const totalLaps = ring?.totalLaps ?? 0;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      padding: deviceLayout.screenPadding,
      gap: spacing['2xl'],
    }}>
      {/* Set name */}
      <div style={{
        fontSize: deviceFontSizes.heading,
        fontWeight: fontWeights.medium,
        color: colors.gray400,
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
      }}>
        {setName}
      </div>

      {/* Target pace — the hero number */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontSize: deviceFontSizes.label,
          fontWeight: fontWeights.medium,
          color: colors.gray500,
          marginBottom: spacing.sm,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}>
          Target
        </div>
        <div style={{
          fontSize: deviceFontSizes.metricHero,
          fontWeight: fontWeights.medium,
          color: colors.white,
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
        }}>
          {targetStr}
        </div>
      </div>

      {/* Lap counter */}
      <div style={{
        fontSize: deviceFontSizes.metricLarge,
        fontWeight: fontWeights.medium,
        color: colors.purple,
      }}>
        Lap {currentLap} of {totalLaps || '—'}
      </div>
    </div>
  );
};
