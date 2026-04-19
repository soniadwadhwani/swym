import React from 'react';
import {
  colors,
  deviceFontSizes,
  fontWeights,
  spacing,
  deviceLayout,
} from '@swym/design-system';
import {
  formatTimeMs,
  generateCoachingInstruction,
  type CoachingInstruction,
} from '@swym/design-system';
import type { RingState } from '@swym/design-system';
import { PaceDelta } from '../../components/PaceDelta';
import { TrendWord } from '../../components/TrendWord';

interface DrillDownScreenProps {
  ring: RingState | null;
  toleranceMs: number;
  /** Total number of swimmers (for cycling indicator) */
  swimmerCount: number;
  /** 1-based index of current swimmer */
  currentIndex: number;
  /** Whether auto-cycle is active (showing worst-delta swimmer) */
  isAutoCycle: boolean;
}

/**
 * Group Screen 2 — The Individual Drill-Down Screen
 *
 * ONE JOB: "What is happening with this specific swimmer?"
 *
 * Shows ONE swimmer's full data: name, current lap, last split, numeric delta,
 * trend word, and coaching instruction. Button press cycles to next swimmer.
 * NFC tap jumps directly. Auto-cycle option shows worst-delta swimmer.
 */
export const DrillDownScreen: React.FC<DrillDownScreenProps> = ({
  ring,
  toleranceMs,
  swimmerCount,
  currentIndex,
  isAutoCycle,
}) => {
  if (!ring) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: colors.gray500,
        fontSize: deviceFontSizes.heading,
      }}>
        No swimmer selected
      </div>
    );
  }

  const instruction = generateCoachingInstruction(
    ring.deltaMs,
    ring.trendDirection,
    ring.totalLaps - ring.currentLap,
    ring.target.perLapMs,
    ring.lastSplitMs,
    toleranceMs,
  );

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: deviceLayout.screenPadding,
      gap: spacing.md,
    }}>
      {/* Header: swimmer name + cycle indicator */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{
          fontSize: deviceFontSizes.heading,
          fontWeight: fontWeights.medium,
          color: colors.teal,
        }}>
          {ring.swimmerName}
          {isAutoCycle && (
            <span style={{ color: colors.amber, fontSize: deviceFontSizes.body, marginLeft: spacing.sm }}>
              AUTO
            </span>
          )}
        </div>
        <div style={{
          fontSize: deviceFontSizes.body,
          color: colors.gray500,
        }}>
          {currentIndex} / {swimmerCount}
        </div>
      </div>

      {/* Current lap */}
      <div style={{
        fontSize: deviceFontSizes.metricHero,
        fontWeight: fontWeights.medium,
        color: colors.white,
        textAlign: 'center',
      }}>
        Lap {ring.currentLap} of {ring.totalLaps}
      </div>

      {/* Stats row: Last Split | Delta */}
      <div style={{ display: 'flex', gap: spacing.md }}>
        <StatTile label="Last Split" value={formatTimeMs(ring.lastSplitMs)} />
        <div style={{
          flex: 1,
          background: colors.gray800,
          borderRadius: 8,
          padding: spacing.md,
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: deviceFontSizes.body,
            fontWeight: fontWeights.medium,
            color: colors.gray400,
            marginBottom: spacing.xs,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}>
            vs Target
          </div>
          <PaceDelta deltaMs={ring.deltaMs} paceStatus={ring.paceStatus} size="large" />
        </div>
      </div>

      {/* Trend word */}
      <div style={{ textAlign: 'center' }}>
        <TrendWord direction={ring.trendDirection} />
      </div>

      {/* Coaching instruction */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: `0 ${spacing.sm}px`,
      }}>
        <div style={{
          fontSize: deviceFontSizes.instruction,
          fontWeight: fontWeights.medium,
          color: colors.white,
          lineHeight: 1.35,
        }}>
          {instruction.text}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        fontSize: deviceFontSizes.body,
        color: colors.gray500,
      }}>
        press button to cycle • tap ring for direct access
      </div>
    </div>
  );
};

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      flex: 1,
      background: colors.gray800,
      borderRadius: 8,
      padding: spacing.md,
      textAlign: 'center',
    }}>
      <div style={{
        fontSize: deviceFontSizes.body,
        fontWeight: fontWeights.medium,
        color: colors.gray400,
        marginBottom: spacing.xs,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
      }}>
        {label}
      </div>
      <div style={{
        fontSize: deviceFontSizes.metricLarge,
        fontWeight: fontWeights.medium,
        color: colors.white,
      }}>
        {value}
      </div>
    </div>
  );
}
