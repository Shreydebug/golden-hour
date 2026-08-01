export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 36,
  huge: 56,
  massive: 80,
  giant: 128,
  colossal: 192,
} as const;

export const sectionGap = {
  mobile: spacing.xxxl,
  desktop: spacing.giant,
} as const;

export const screenPadding = {
  mobile: spacing.xl,
  desktop: spacing.xxl,
} as const;
