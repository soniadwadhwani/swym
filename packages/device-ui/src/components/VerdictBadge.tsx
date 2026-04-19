import React from 'react';
import { PaceStatus } from '@swym/design-system';
import { colors, deviceFontSizes, fontWeights, spacing } from '@swym/design-system';

interface VerdictBadgeProps {
  verdict: 'On Target' | 'Slightly Off' | 'Significantly Off';
}

const verdictStyles: Record<string, { bg: string; text: string }> = {
  'On Target': { bg: colors.green, text: colors.white },
  'Slightly Off': { bg: colors.amber, text: colors.gray900 },
  'Significantly Off': { bg: colors.red, text: colors.white },
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
        padding: `${spacing.xs}px ${spacing.lg}px`,
        borderRadius: 8,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
      }}
    >
      {verdict}
    </span>
  );
};
