export const colors = {
  ink: '#20201D',
  orange: '#FF5B35',
  coral: '#FF7557',
  cream: '#FFF7EF',
  yellow: '#FFD766',
  line: '#E8E1D9',
  muted: '#746F69',
  white: '#FFFFFF',
  black: '#000000',
  success: '#42A56C',
  open: '#6DB37C',
  forecastBg: '#F1ECE2',
  discountBg: '#EFF09C',
  cardShadow: 'rgba(54, 32, 23, 0.09)',
} as const;

export type ColorKey = keyof typeof colors;
