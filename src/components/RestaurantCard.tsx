import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Restaurant } from '@/types';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

interface Props {
  restaurant: Restaurant;
  isSaved: boolean;
  onPress: () => void;
  onToggleSave: () => void;
}

export function RestaurantCard({ restaurant, isSaved, onPress, onToggleSave }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`${restaurant.name}, ${restaurant.discount}% off`}
    >
      <ImageBackground
        source={{ uri: restaurant.image }}
        style={styles.image}
        imageStyle={styles.imageStyle}
      >
        <View style={styles.imageOverlay}>
          <Text style={styles.cuisineBadge}>{restaurant.cuisine}</Text>
        </View>
        <TouchableOpacity
          style={styles.heart}
          onPress={(e) => {
            e.stopPropagation?.();
            onToggleSave();
          }}
          hitSlop={12}
          accessibilityLabel={isSaved ? 'Remove from saved' : 'Save restaurant'}
        >
          <Ionicons
            name={isSaved ? 'heart' : 'heart-outline'}
            size={22}
            color={isSaved ? colors.orange : colors.ink}
          />
        </TouchableOpacity>
      </ImageBackground>

      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {restaurant.name}
        </Text>
        <Text style={styles.meta}>
          {restaurant.cuisine} · {restaurant.suburb} · ★ {restaurant.rating}
        </Text>
        <View style={styles.dealRow}>
          <View>
            <Text style={styles.discount}>Up to {restaurant.discount}% off</Text>
            <Text style={styles.time}>{restaurant.time}</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>TABLEPERK</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  pressed: {
    opacity: 0.95,
    transform: [{ scale: 0.99 }],
  },
  image: {
    height: 180,
    justifyContent: 'flex-end',
  },
  imageStyle: {
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'flex-end',
    padding: spacing.md,
  },
  cuisineBadge: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  heart: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    padding: spacing.lg,
  },
  name: {
    ...typography.h3,
    marginBottom: 4,
  },
  meta: {
    ...typography.bodyMuted,
    fontSize: 13,
  },
  dealRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  discount: {
    color: colors.orange,
    fontSize: 17,
    fontWeight: '700',
  },
  time: {
    ...typography.caption,
    marginTop: 2,
  },
  tag: {
    backgroundColor: colors.cream,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 3,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: colors.orange,
  },
});
