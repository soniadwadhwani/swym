import React from 'react';
import { colors, deviceFontSizes, fontWeights } from '@swym/design-system';

interface VerdictBadgeProps {
  verdict: 'On Target' | 'Slightly Off' | 'Significantly Off';
}

const verdictStyles: Record<string, { bg: string; text: string }> = {
  'On Target': { bg: 'rgba(9,177,190,0.15)', text: colors.accent },
  'Slightly Off': { bg: 'rgba(239,159,39,0.15)', text: colors.amber },
  'Significantly Off': { bg: 'rgba(226,75,74,0.18)', text: colors.red },
};

export const VerdictBadge: React.FC<VerdictBadgeProps> = ({ verdict }) => {
  const style = verdictStyles[verdict];
  return (
    <span
      style={{
        display: 'inline-block',
        backgroundColor: style.bg,
        color: style.text,
        fontSize: deviceFontSizes.statusBadge,
        fontWeight: fontWeights.medium,
        padding: '4px 14px',
        borderRadius: 20,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
      }}
    >
      {verdict}
    </span>
  );
};
