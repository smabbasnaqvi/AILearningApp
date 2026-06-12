export const colors = {
  primary: '#6C63FF',
  primaryLight: '#9D97FF',
  primaryDark: '#4A43CC',
  secondary: '#FF6584',
  secondaryLight: '#FF92A8',
  secondaryDark: '#CC3D5E',
  backgroundDark: '#0F0F1A',
  backgroundLight: '#FFFFFF',
  surface: '#1A1A2E',
  surfaceElevated: '#252540',
  success: '#4CAF50',
  successLight: '#80E27E',
  warning: '#FF9800',
  warningLight: '#FFB74D',
  error: '#F44336',
  errorLight: '#EF9A9A',
  textPrimary: '#FFFFFF',
  textSecondary: '#B0B0C8',
  textMuted: '#6B6B8A',
  textDark: '#0F0F1A',
  border: '#2A2A42',
  borderLight: '#3A3A55',
  overlay: 'rgba(0,0,0,0.5)',
  transparent: 'transparent',
} as const;

export const typography = {
  fontSizeXs: 11,
  fontSizeSm: 13,
  fontSizeMd: 15,
  fontSizeLg: 17,
  fontSizeXl: 20,
  fontSize2xl: 24,
  fontSize3xl: 30,
  fontSize4xl: 36,

  fontWeightRegular: '400' as const,
  fontWeightMedium: '500' as const,
  fontWeightSemiBold: '600' as const,
  fontWeightBold: '700' as const,
  fontWeightExtraBold: '800' as const,

  lineHeightSm: 18,
  lineHeightMd: 22,
  lineHeightLg: 26,
  lineHeightXl: 32,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
  massive: 64,
} as const;

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
} as const;
