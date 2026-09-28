import { TextStyle } from 'react-native';
import { colors } from './colors';

export const typography = {
  brand: {
    fontSize: 26,
    fontWeight: '800' as TextStyle['fontWeight'],
    letterSpacing: -1.2,
    color: colors.ink,
  },
  h1: {
    fontSize: 36,
    fontWeight: '800' as TextStyle['fontWeight'],
    letterSpacing: -1.5,
    color: colors.ink,
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: -1,
    color: colors.ink,
  },
  h3: {
    fontSize: 20,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: -0.5,
    color: colors.ink,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as TextStyle['fontWeight'],
    color: colors.ink,
    lineHeight: 22,
  },
  bodyMuted: {
    fontSize: 14,
    fontWeight: '400' as TextStyle['fontWeight'],
    color: colors.muted,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '600' as TextStyle['fontWeight'],
    color: colors.muted,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800' as TextStyle['fontWeight'],
    letterSpacing: 1.8,
    color: colors.ink,
    textTransform: 'uppercase' as TextStyle['textTransform'],
  },
  button: {
    fontSize: 15,
    fontWeight: '800' as TextStyle['fontWeight'],
    color: colors.white,
  },
} as const;
