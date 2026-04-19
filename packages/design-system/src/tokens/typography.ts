// Design tokens: Typography
// Two weights only — Regular (400) for body/data, Medium (500) for labels/headings/metrics

export const fontWeights = {
  regular: '400',
  medium: '500',
} as const;

// Device display — must be legible from 1-2 metres in pool lighting
export const deviceFontSizes = {
  body: 16,       // minimum on device
  label: 18,
  metric: 24,
  metricLarge: 28,
  metricHero: 36,  // lap counter, primary number
  heading: 20,
  instruction: 22, // coaching instruction text — dominant
  statusBadge: 18,
} as const;

// App (React Native) — standard mobile scale
export const appFontSizes = {
  caption: 12,
  body: 14,
  bodyLarge: 16,
  label: 14,
  heading3: 18,
  heading2: 22,
  heading1: 28,
  metric: 32,
  metricLarge: 40,
} as const;

export const fontFamily = {
  base: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
} as const;

export const lineHeights = {
  tight: 1.1,
  normal: 1.3,
  relaxed: 1.5,
} as const;
