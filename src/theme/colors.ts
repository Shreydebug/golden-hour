export const palette = {
  background: '#050505',
  shadow: '#0D0D0D',
  warmBlack: '#141414',
  sunsetOrange: 'rgba(255, 176, 88, 0.9)',
  goldenLight: 'rgba(255, 210, 138, 0.85)',
  warmWhite: '#FAFAFA',
  mutedWhite: 'rgba(255, 255, 255, 0.65)',
  deepCrimson: 'rgba(255, 96, 58, 0.55)',
  blueHour: 'rgba(98, 122, 226, 0.6)',
  eveningIndigo: 'rgba(64, 78, 176, 0.5)',
} as const;

export const lightPalette = {
  background: '#FDFCFA',
  shadow: '#F2EFEA',
  warmBlack: '#141210',
  sunsetOrange: 'rgba(208, 138, 64, 0.75)',
  goldenLight: 'rgba(178, 132, 58, 0.7)',
  warmWhite: '#0A0A0A',
  mutedWhite: 'rgba(10, 10, 10, 0.62)',
  deepCrimson: 'rgba(196, 96, 62, 0.45)',
  blueHour: 'rgba(92, 112, 196, 0.4)',
  eveningIndigo: 'rgba(72, 88, 156, 0.35)',
} as const;

export const extended = {
  fog: 'rgba(250, 250, 250, 0.05)',
  emerald: 'rgba(255, 255, 255, 0.8)',
  rose: 'rgba(255, 112, 84, 0.55)',
  horizonGold: 'rgba(255, 210, 138, 0.5)',
  horizonOrange: 'rgba(255, 176, 88, 0.45)',
  indigoDeep: '#101018',
  cream: '#FBF8F2',
  warmSand: '#F2EEE6',
  paleGold: '#F3EBDD',
} as const;

export const semantic = {
  success: extended.emerald,
  warning: palette.goldenLight,
  danger: extended.rose,
} as const;

export const colors = {
  dark: palette,
  light: lightPalette,
} as const;
