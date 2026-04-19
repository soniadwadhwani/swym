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
 * Premium minimal: coaching instruction as hero text, frosted glass metric tiles,
 * teal trend pill, subtle footer hint.
 */
export const WallScreen: React.FC<WallScreenProps> = ({ instruction }) => {
  if (!instruction) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: 'rgba(255,255,255,0.30)',
        fontSize: deviceFontSizes.heading,
        fontWeight: fontWeights.light,
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
      padding: `0 ${deviceLayout.screenPadding}px`,
    }}>
      {/* Coaching instruction — dominant hero text */}
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
          lineHeight: 1.4,
          maxWidth: '100%',
          letterSpacing: '0.01em',
        }}>
          {instruction.text}
        </div>
      </div>

      {/* Frosted glass metric tiles */}
      <div style={{
        display: 'flex',
        gap: spacing.md,
        marginBottom: spacing.lg,
      }}>
        {/* Last lap time */}
        <div style={frostedTileStyle}>
          <div style={tileLabelStyle}>Last Lap</div>
          <div style={{
            fontSize: deviceFontSizes.metricLarge,
            fontWeight: fontWeights.medium,
            color: colors.white,
          }}>
            {formatTimeMs(instruction.lastLapMs)}
          </div>
        </div>

        {/* Delta vs target */}
        <div style={frostedTileStyle}>
          <div style={tileLabelStyle}>vs Target</div>
          <PaceDelta
            deltaMs={instruction.deltaMs}
            paceStatus={instruction.paceStatus}
            size="large"
          />
        </div>
      </div>

      {/* Trend word pill */}
      <div style={{
        textAlign: 'center',
        marginBottom: spacing.lg,
      }}>
        <TrendWord direction={instruction.trendDirection} />
      </div>

      {/* Footer hint */}
      <div style={{
        textAlign: 'center',
        fontSize: deviceFontSizes.hint,
        color: 'rgba(255,255,255,0.40)',
        paddingBottom: spacing.lg,
      }}>
        press either button to continue
      </div>
    </div>
  );
};

const frostedTileStyle: React.CSSProperties = {
  flex: 1,
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: 16,
  padding: '10px 16px',
  textAlign: 'center',
};

const tileLabelStyle: React.CSSProperties = {
  fontSize: deviceFontSizes.caption,
  fontWeight: fontWeights.light,
  color: 'rgba(255,255,255,0.40)',
  marginBottom: spacing.xs,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
};
