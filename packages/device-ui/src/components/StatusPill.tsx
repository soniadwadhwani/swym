import React from 'react';
import { PaceStatus } from '@swym/design-system';
import { colors, deviceFontSizes, fontWeights } from '@swym/design-system';

interface StatusPillProps {
  status: PaceStatus;
  /** Optional override label. Defaults to semantic label per status. */
  label?: string;
}

const pillStyles: Record<PaceStatus, { bg: string; text: string; label: string }> = {
  [PaceStatus.OnPace]: { bg: 'rgba(9,177,190,0.15)', text: colors.accent, label: 'On Pace' },
  [PaceStatus.Ahead]: { bg: 'rgba(9,177,190,0.15)', text: colors.accent, label: 'Ahead' },
  [PaceStatus.SlightlyOff]: { bg: 'rgba(239,159,39,0.15)', text: colors.amber, label: 'Behind' },
  [PaceStatus.SignificantlyOff]: { bg: 'rgba(226,75,74,0.20)', text: colors.red, label: 'Off Pace' },
};

/**
 * Frosted glass pace status pill for group mode.
 * Coach's eye goes to red pills, not to numbers.
 */
export const StatusPill: React.FC<StatusPillProps> = ({ status, label }) => {
  const style = pillStyles[status];
  return (
    <span
      style={{
        display: 'inline-block',
        backgroundColor: style.bg,
        color: style.text,
        fontSize: deviceFontSizes.statusBadge,
        fontWeight: fontWeights.medium,
        padding: '3px 12px',
        borderRadius: 20,
        whiteSpace: 'nowrap',
        lineHeight: 1.3,
        letterSpacing: '0.02em',
      }}
    >
      {label ?? style.label}
    </span>
  );
};
