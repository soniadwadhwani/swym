import { Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─── Colors ───────────────────────────────────────────────
export const Colors = {
  primaryDark: '#140C32',
  background: '#F3F1EE',
  softSecondary: '#D1DEDF',
  accent: '#707CFF',
  accentLight: '#707CFF20',
  accentSoft: '#707CFF12',
  white: '#FFFFFF',
  textPrimary: '#140C32',
  textMuted: 'rgba(20,12,50,0.55)',
  textLight: 'rgba(20,12,50,0.35)',
  success: '#22C55E',
  successLight: '#22C55E18',
  warning: '#F59E0B',
  warningLight: '#F59E0B18',
  error: '#EF4444',
  errorLight: '#EF444418',
  border: 'rgba(20,12,50,0.06)',
  cardBg: '#FFFFFF',
  heroOverlay: 'rgba(20,12,50,0.55)',
  tabBarBg: '#FFFFFFFA',
  shimmer: '#F8F7F5',
} as const;

// ─── Typography ───────────────────────────────────────────
export const Typography = {
  heroTitle: {
    fontSize: 42,
    fontWeight: '300' as const,
    letterSpacing: -1.5,
    color: Colors.white,
  },
  heroSubtitle: {
    fontSize: 15,
    fontWeight: '400' as const,
    letterSpacing: 3,
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase' as const,
  },
  h1: {
    fontSize: 32,
    fontWeight: '300' as const,
    letterSpacing: -0.8,
    color: Colors.textPrimary,
  },
  h2: {
    fontSize: 24,
    fontWeight: '400' as const,
    letterSpacing: -0.5,
    color: Colors.textPrimary,
  },
  h3: {
    fontSize: 18,
    fontWeight: '500' as const,
    letterSpacing: -0.3,
    color: Colors.textPrimary,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 22,
    color: Colors.textPrimary,
  },
  bodyMuted: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 22,
    color: Colors.textMuted,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500' as const,
    letterSpacing: 0.3,
    color: Colors.textMuted,
  },
  label: {
    fontSize: 11,
    fontWeight: '600' as const,
    letterSpacing: 0.8,
    textTransform: 'uppercase' as const,
    color: Colors.textMuted,
  },
  metric: {
    fontSize: 36,
    fontWeight: '200' as const,
    letterSpacing: -1,
    color: Colors.textPrimary,
  },
  metricSmall: {
    fontSize: 24,
    fontWeight: '300' as const,
    letterSpacing: -0.5,
    color: Colors.textPrimary,
  },
  metricUnit: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: Colors.textMuted,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    letterSpacing: 0.2,
  },
} as const;

// ─── Spacing ──────────────────────────────────────────────
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
  screenPadding: 20,
} as const;

// ─── Layout ───────────────────────────────────────────────
export const Layout = {
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
  cardRadius: 24,
  cardRadiusSmall: 16,
  pillRadius: 100,
  tabBarHeight: Platform.OS === 'ios' ? 88 : 68,
  heroHeight: SCREEN_HEIGHT * 0.85,
} as const;

// ─── Shadows ──────────────────────────────────────────────
export const Shadows = {
  card: {
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 3,
  },
  cardHover: {
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 32,
    elevation: 6,
  },
  soft: {
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  tabBar: {
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;
