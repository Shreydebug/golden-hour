export const fonts = {
  sans: 'var(--font-switzer), ui-sans-serif, system-ui, -apple-system, sans-serif',
} as const;

export const weights = {
  thin: 200,
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
} as const;

export const typography = {
  display: {
    fontSize: 96,
    lineHeight: 0.98,
    letterSpacing: -0.045,
    fontWeight: weights.light,
  },
  displaySm: {
    fontSize: 64,
    lineHeight: 1.02,
    letterSpacing: -0.04,
    fontWeight: weights.light,
  },
  h1: {
    fontSize: 48,
    lineHeight: 1.08,
    letterSpacing: -0.03,
    fontWeight: weights.regular,
  },
  h2: {
    fontSize: 32,
    lineHeight: 1.16,
    letterSpacing: -0.02,
    fontWeight: weights.regular,
  },
  h3: {
    fontSize: 22,
    lineHeight: 1.3,
    letterSpacing: -0.015,
    fontWeight: weights.regular,
  },
  body: {
    fontSize: 16,
    lineHeight: 1.75,
    fontWeight: weights.regular,
  },
  caption: {
    fontSize: 13,
    lineHeight: 1.5,
    fontWeight: weights.regular,
  },
  eyebrow: {
    fontSize: 11,
    lineHeight: 1.4,
    fontWeight: weights.medium,
    letterSpacing: 0.16,
    textTransform: 'uppercase',
  },
  numeric: {
    fontSize: 32,
    lineHeight: 1.1,
    letterSpacing: -0.02,
    fontWeight: weights.light,
    fontVariantNumeric: 'tabular-nums',
  },
  measure: 62,
} as const;
