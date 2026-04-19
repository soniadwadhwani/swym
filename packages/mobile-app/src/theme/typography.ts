import { TextStyle } from 'react-native';

export const typography = {
  heroTitle: {
    fontSize: 52,
    fontWeight: '200' as const,
    letterSpacing: 12,
    color: '#FFFFFF',
  } satisfies TextStyle,

  heroSubtitle: {
    fontSize: 14,
    fontWeight: '400' as const,
    letterSpacing: 6,
    color: 'rgba(255,255,255,0.7)',
  } satisfies TextStyle,

  screenTitle: {
    fontSize: 32,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  } satisfies TextStyle,

  sectionTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    letterSpacing: 0.3,
  } satisfies TextStyle,

  cardTitle: {
    fontSize: 17,
    fontWeight: '600' as const,
    letterSpacing: 0.2,
  } satisfies TextStyle,

  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 22,
  } satisfies TextStyle,

  bodySmall: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
  } satisfies TextStyle,

  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
  } satisfies TextStyle,

  metric: {
    fontSize: 48,
    fontWeight: '200' as const,
    letterSpacing: -1,
  } satisfies TextStyle,

  metricMedium: {
    fontSize: 36,
    fontWeight: '200' as const,
    letterSpacing: -0.5,
  } satisfies TextStyle,

  metricSmall: {
    fontSize: 28,
    fontWeight: '300' as const,
    letterSpacing: -0.3,
  } satisfies TextStyle,

  label: {
    fontSize: 11,
    fontWeight: '600' as const,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
  } satisfies TextStyle,

  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
  } satisfies TextStyle,

  chip: {
    fontSize: 12,
    fontWeight: '500' as const,
  } satisfies TextStyle,

  tabLabel: {
    fontSize: 11,
    fontWeight: '600' as const,
  } satisfies TextStyle,
} as const;
