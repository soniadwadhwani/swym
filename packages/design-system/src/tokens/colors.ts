// Design tokens: Colors
// Two-state semantic colors + brand + structural grays

export const colors = {
  // Semantic — pace status
  green: '#639922',
  amber: '#EF9F27',
  red: '#E24B4A',

  // Brand
  purple: '#534AB7',
  purpleLight: '#6E63D5',
  purpleDark: '#3F3690',

  // Swimmer identity (group views)
  teal: '#1D9E75',

  // Grays — structural, disabled, neutral
  gray50: '#FAFAFA',
  gray100: '#F5F5F5',
  gray200: '#EEEEEE',
  gray300: '#E0E0E0',
  gray400: '#BDBDBD',
  gray500: '#9E9E9E',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',

  white: '#FFFFFF',
  black: '#000000',
} as const;

// Semantic aliases for quick access
export const semantic = {
  onPace: colors.green,
  slightlyOff: colors.amber,
  significantlyOff: colors.red,
  improving: colors.green,
  steady: colors.amber,
  fading: colors.red,
  primary: colors.purple,
  background: colors.gray900,
  surface: colors.gray800,
  textPrimary: colors.white,
  textSecondary: colors.gray400,
  textMuted: colors.gray500,
  border: colors.gray700,
} as const;

export type SemanticColor = keyof typeof semantic;
