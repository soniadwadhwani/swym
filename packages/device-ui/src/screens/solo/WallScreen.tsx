import React from 'react';
import {
  colors,
  deviceFontSizes,
  fontWeights,
  spacing,
  deviceLayout,
} from '@swym/design-system';
import { formatTimeMs, type CoachingInstruction } from '@swym/design-system';
import { TrendWord } from '../../components/TrendWord';
import { PaceDelta } from '../../components/PaceDelta';

interface WallScreenProps {
  instruction: CoachingInstruction | null;
}

/**
 * Solo Screen 2 — The Wall Screen
 *
 * ONE JOB: "How was that lap and what do I adjust?"
 *
 * Auto-triggers on every wall-touch. The swimmer has 2 seconds of attention.
 * Dominant coaching instruction, last lap time, delta in color,
 * single-word trend indicator (IMPROVING / STEADY / FADING).
 */
export const WallScreen: React.FC<WallScreenProps> = ({ instruction }) => {
  if (!instruction) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: colors.gray500,
        fontSize: deviceFontSizes.heading,
      }}>
        Waiting for lap…
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: deviceLayout.screenPadding,
    }}>
      {/* Coaching instruction — dominant, top, large */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: `0 ${spacing.lg}px`,
      }}>
        <div style={{
          fontSize: deviceFontSizes.instruction,
          fontWeight: fontWeights.medium,
          color: colors.white,
          lineHeight: 1.35,
          maxWidth: '100%',
        }}>
          {instruction.text}
        </div>
      </div>

      {/* Stats row: Last Lap | Delta */}
      <div style={{
        display: 'flex',
        gap: spacing.md,
        marginBottom: spacing.lg,
      }}>
        {/* Last lap time */}
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
            Last Lap
          </div>
          <div style={{
            fontSize: deviceFontSizes.metricLarge,
            fontWeight: fontWeights.medium,
            color: colors.white,
          }}>
            {formatTimeMs(instruction.lastLapMs)}
          </div>
        </div>

        {/* Delta vs target */}
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
          <PaceDelta
            deltaMs={instruction.deltaMs}
            paceStatus={instruction.paceStatus}
            size="large"
          />
        </div>
      </div>

      {/* Trend word */}
      <div style={{
        textAlign: 'center',
        marginBottom: spacing.lg,
      }}>
        <TrendWord direction={instruction.trendDirection} />
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        fontSize: deviceFontSizes.body,
        color: colors.gray500,
        paddingBottom: spacing.sm,
      }}>
        press either button to continue
      </div>
    </div>
  );
};
