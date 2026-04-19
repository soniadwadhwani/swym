import React from 'react';
import { PaceStatus } from '@swym/design-system';
import { colors, deviceFontSizes, fontWeights, spacing } from '@swym/design-system';

interface PaceDeltaProps {
  deltaMs: number;
  paceStatus: PaceStatus;
  /** Show as large hero metric or inline */
  size?: 'large' | 'normal';
}

const statusColorMap: Record<PaceStatus, string> = {
  [PaceStatus.OnPace]: colors.green,
  [PaceStatus.Ahead]: colors.green,
  [PaceStatus.SlightlyOff]: colors.amber,
  [PaceStatus.SignificantlyOff]: colors.red,
};

/**
 * Color-coded pace delta display: +2s (amber), -1s (green), etc.
 */
export const PaceDelta: React.FC<PaceDeltaProps> = ({ deltaMs, paceStatus, size = 'normal' }) => {
  const seconds = Math.round(deltaMs / 1000);
  const sign = seconds > 0 ? '+' : '';
  const color = statusColorMap[paceStatus];
  const fontSize = size === 'large' ? deviceFontSizes.metricLarge : deviceFontSizes.metric;

  return (
    <span
      style={{
        color,
        fontSize,
        fontWeight: fontWeights.medium,
        letterSpacing: '-0.02em',
      }}
    >
      {sign}{seconds}s
    </span>
  );
};
