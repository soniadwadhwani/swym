import React from 'react';
import { TrendDirection } from '@swym/design-system';
import { colors, deviceFontSizes, fontWeights } from '@swym/design-system';

interface TrendWordProps {
  direction: TrendDirection;
}

const colorMap: Record<TrendDirection, string> = {
  [TrendDirection.Improving]: colors.green,
  [TrendDirection.Steady]: colors.amber,
  [TrendDirection.Fading]: colors.red,
};

/**
 * Single-word trend indicator: IMPROVING, STEADY, or FADING.
 * Replaces the 3-bar sparkline — one word, one color, zero interpretation time.
 */
export const TrendWord: React.FC<TrendWordProps> = ({ direction }) => (
  <span
    style={{
      color: colorMap[direction],
      fontSize: deviceFontSizes.statusBadge,
      fontWeight: fontWeights.medium,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
    }}
  >
    {direction}
  </span>
);
