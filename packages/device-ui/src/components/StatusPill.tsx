import React from 'react';
import { PaceStatus } from '@swym/design-system';
import { colors, deviceFontSizes, fontWeights, spacing } from '@swym/design-system';

interface StatusPillProps {
  status: PaceStatus;
  /** Optional override label. Defaults to semantic label per status. */
  label?: string;
}

const pillStyles: Record<PaceStatus, { bg: string; text: string; label: string }> = {
  [PaceStatus.OnPace]: { bg: colors.green, text: colors.white, label: 'On Pace' },
  [PaceStatus.Ahead]: { bg: colors.green, text: colors.white, label: 'Ahead' },
  [PaceStatus.SlightlyOff]: { bg: colors.amber, text: colors.gray900, label: 'Behind' },
  [PaceStatus.SignificantlyOff]: { bg: colors.red, text: colors.white, label: 'Off Pace' },
};

/**
 * Color-coded pace status pill for group mode.
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
        fontSize: deviceFontSizes.body,
        fontWeight: fontWeights.medium,
        padding: `${spacing.xs}px ${spacing.md}px`,
        borderRadius: 20,
        whiteSpace: 'nowrap',
        lineHeight: 1.2,
      }}
    >
      {label ?? style.label}
    </span>
  );
};
