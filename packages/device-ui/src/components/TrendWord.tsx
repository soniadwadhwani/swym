import React from 'react';
import { TrendDirection } from '@swym/design-system';
import { colors, deviceFontSizes, fontWeights } from '@swym/design-system';

interface TrendWordProps {
  direction: TrendDirection;
}

const trendColor: Record<TrendDirection, string> = {
  [TrendDirection.Improving]: colors.accent,
  [TrendDirection.Steady]: colors.accent,
  [TrendDirection.Fading]: colors.red,
};

const trendBg: Record<TrendDirection, string> = {
  [TrendDirection.Improving]: 'rgba(9,177,190,0.15)',
  [TrendDirection.Steady]: 'rgba(9,177,190,0.15)',
  [TrendDirection.Fading]: 'rgba(226,75,74,0.15)',
};

/**
 * Teal glowing pill badge — single word STEADY / IMPROVING / FADING.
 */
export const TrendWord: React.FC<TrendWordProps> = ({ direction }) => (
  <span
    style={{
      display: 'inline-block',
      color: trendColor[direction],
      backgroundColor: trendBg[direction],
      fontSize: deviceFontSizes.statusBadge,
      fontWeight: fontWeights.medium,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      padding: '4px 14px',
      borderRadius: 20,
      textShadow: direction !== TrendDirection.Fading ? '0 0 8px rgba(9,177,190,0.3)' : 'none',
    }}
  >
    {direction}
  </span>
);
