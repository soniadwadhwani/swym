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
  swimmerCount: number;
  currentIndex: number;
  isAutoCycle: boolean;
}

/**
 * Group Screen 2 — The Individual Drill-Down Screen
 *
 * ONE JOB: "What is happening with this specific swimmer?"
 *
 * Premium minimal: hero coaching text, frosted glass tiles, trend pill.
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
        color: 'rgba(255,255,255,0.30)',
        fontSize: deviceFontSizes.heading,
        fontWeight: fontWeights.light,
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
      padding: `0 ${deviceLayout.screenPadding}px`,
      paddingBottom: spacing.lg,
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
          color: colors.accent,
        }}>
          {ring.swimmerName}
          {isAutoCycle && (
            <span style={{ color: colors.amber, fontSize: deviceFontSizes.caption, marginLeft: spacing.sm, fontWeight: fontWeights.light }}>
              AUTO
            </span>
          )}
        </div>
        <div style={{
          fontSize: deviceFontSizes.caption,
          color: 'rgba(255,255,255,0.30)',
          fontWeight: fontWeights.light,
        }}>
          {currentIndex} / {swimmerCount}
        </div>
      </div>

      {/* Frosted glass stat tiles */}
      <div style={{ display: 'flex', gap: spacing.md }}>
        <div style={frostedTileStyle}>
          <div style={tileLabelStyle}>Last Split</div>
          <div style={{
            fontSize: deviceFontSizes.metricLarge,
            fontWeight: fontWeights.medium,
            color: colors.white,
          }}>
            {formatTimeMs(ring.lastSplitMs)}
          </div>
        </div>
        <div style={frostedTileStyle}>
          <div style={tileLabelStyle}>vs Target</div>
          <PaceDelta deltaMs={ring.deltaMs} paceStatus={ring.paceStatus} size="large" />
        </div>
      </div>

      {/* Trend word pill */}
      <div style={{ textAlign: 'center' }}>
        <TrendWord direction={ring.trendDirection} />
      </div>

      {/* Coaching instruction — hero text */}
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
          lineHeight: 1.4,
          letterSpacing: '0.01em',
        }}>
          {instruction.text}
        </div>
      </div>

      {/* Footer hint */}
      <div style={{
        textAlign: 'center',
        fontSize: deviceFontSizes.hint,
        color: 'rgba(255,255,255,0.40)',
      }}>
        press button to cycle • tap ring for direct access
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
  marginBottom: 2,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
};
