// Design tokens: Spacing
// 4px base unit scale

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
} as const;

// Device-specific layout values
export const deviceLayout = {
  screenPadding: 16,
  rowHeight: 48,        // group mode swimmer row
  leaderboardRowHeight: 56,
  sectionGap: 16,
  statTileGap: 12,
} as const;

// App-specific layout values
export const appLayout = {
  screenPadding: 16,
  cardPadding: 16,
  minTapTarget: 44,     // minimum 44x44pt tap targets
  tabBarHeight: 56,
  cardBorderRadius: 12,
  pillBorderRadius: 20,
} as const;
