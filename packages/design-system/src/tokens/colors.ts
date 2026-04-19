// Design tokens: Colors
// Premium minimal palette — deep navy + white + teal accent

export const colors = {
  // Semantic — pace status
  green: '#09b1be',    // teal accent doubles as "on-pace"
  amber: '#EF9F27',
  red: '#E24B4A',

  // Brand / Accent
  accent: '#09b1be',
  purple: '#09b1be',   // alias for backward compat — now teal
  purpleLight: '#0cc8d6',
  purpleDark: '#078a94',

  // Swimmer identity (group views)
  teal: '#09b1be',

  // Grays — structural, disabled, neutral (tuned for #0b1f2a base)
  gray50: '#FAFAFA',
  gray100: '#F5F5F5',
  gray200: '#EEEEEE',
  gray300: '#d0dce2',
  gray400: '#8a9faa',
  gray500: '#5e7785',
  gray600: '#3a5264',
  gray700: '#17323f',
  gray800: '#112832',
  gray900: '#0b1f2a',

  white: '#FFFFFF',
  black: '#000000',
} as const;

// Semantic aliases for quick access
export const semantic = {
  onPace: colors.accent,
  slightlyOff: colors.amber,
  significantlyOff: colors.red,
  improving: colors.accent,
  steady: colors.accent,
  fading: colors.red,
  primary: colors.accent,
  background: colors.gray900,
  surface: 'rgba(255,255,255,0.06)',
  surfaceBorder: 'rgba(255,255,255,0.10)',
  textPrimary: colors.white,
  textSecondary: colors.gray400,
  textMuted: colors.gray500,
  border: 'rgba(255,255,255,0.10)',
} as const;

export type SemanticColor = keyof typeof semantic;
