export const fonts = {
  sans: '"Neue Montreal", "Helvetica Neue", Helvetica, Arial, sans-serif',
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
    fontSize: 72,
    lineHeight: 0.98,
    letterSpacing: -0.03,
    fontWeight: weights.light,
  },
  displaySm: {
    fontSize: 40,
    lineHeight: 1.02,
    letterSpacing: -0.025,
    fontWeight: weights.light,
  },
  h1: {
    fontSize: 28,
    lineHeight: 1.15,
    letterSpacing: -0.02,
    fontWeight: weights.regular,
  },
  h2: {
    fontSize: 26,
    lineHeight: 1.2,
    letterSpacing: -0.02,
    fontWeight: weights.regular,
  },
  h3: {
    fontSize: 19,
    lineHeight: 1.35,
    letterSpacing: -0.01,
    fontWeight: weights.regular,
  },
  body: {
    fontSize: 15,
    lineHeight: 1.75,
    fontWeight: weights.regular,
  },
  caption: {
    fontSize: 12,
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
    fontSize: 28,
    lineHeight: 1.1,
    letterSpacing: -0.02,
    fontWeight: weights.light,
    fontVariantNumeric: 'tabular-nums',
  },
  measure: 62,
} as const;
