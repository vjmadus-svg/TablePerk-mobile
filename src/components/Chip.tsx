import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

interface ChipProps {
  label: string;
  active?: boolean;
  onPress: () => void;
}

export function Chip({ label, active = false, onPress }: ChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, active && styles.active]}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Text style={[styles.label, active && styles.activeLabel]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  active: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.ink,
  },
  activeLabel: {
    color: colors.white,
  },
});
