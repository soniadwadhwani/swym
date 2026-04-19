// Design tokens: Typography
// Light (300) for labels, Regular (400) for body, Medium (500) for values/metrics

export const fontWeights = {
  light: '300',
  regular: '400',
  medium: '500',
} as const;

// Device display — pushed up aggressively for pool visibility
export const deviceFontSizes = {
  hint: 11,          // subtle footer hints
  caption: 12,       // muted labels
  body: 14,          // secondary text
  label: 16,         // light-weight labels
  heading: 18,       // screen titles
  metric: 24,        // standard metrics
  metricLarge: 32,   // large values inside tiles
  metricHero: 40,    // hero number — target, lap counter
  instruction: 30,   // coaching instruction — the visual hero
  statusBadge: 14,   // trend pill, verdict pill
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
