import { request } from '@/api/client';
import { SavingsPlanner } from '@/components/SavingsPlanner';
import React, { useMemo, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { restaurants } from '@/data/restaurants';
import { useAppStore } from '@/store/useAppStore';
import { colors } from '@/theme/colors';
import { spacing, radius } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { savedIds, toggleSaved, isLoggedIn, venues } = useAppStore();

  const restaurant = useMemo(
    () => venues.find((r) => r.id === id),
    [id, venues]
  );

  const [sampleMenu,setMenu]=useState<any[]>([]);
  useEffect(()=>{void request('/restaurants/'+id+'/menu').then(data=>setMenu(data.items.map((i:any)=>({name:i.name,description:i.description,old:'',price:`$${(i.price_cents/100).toFixed(2)}`})))).catch(()=>setMenu([]));},[id]);
  if (!restaurant) {
    return (
      <View style={styles.center}>
        <Text>Restaurant not found</Text>
      </View>
    );
  }

  const isSaved = savedIds.includes(restaurant.id);
  const discounted = (price: number) =>
    `$${(price * (1 - restaurant.discount / 100)).toFixed(2)}`;

  const more = venues.filter((r) => r.id !== restaurant.id).slice(0, 4);

  return (
    <>
      <Stack.Screen
        options={{
          title: restaurant.name,
          headerRight: () => isLoggedIn ? (
            <Pressable onPress={() => toggleSaved(restaurant.id)} hitSlop={12}>
              <Ionicons
                name={isSaved ? 'bookmark' : 'bookmark-outline'}
                size={24}
                color={isSaved ? colors.orange : colors.ink}
              />
            </Pressable>
          ) : null,
        }}
      />

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <ImageBackground
          source={{ uri: restaurant.image }}
          style={styles.heroImage}
          imageStyle={{ borderRadius: radius.xl }}
        >
          <View style={styles.heroOverlay}>
            <View style={styles.offerPill}>
              <Text style={styles.offerText}>Today’s offers</Text>
            </View>
          </View>
        </ImageBackground>

        <SavingsPlanner restaurantId={id} />
        <View style={styles.info}>
          <Text style={styles.breadcrumbs}>
            All venues / {restaurant.suburb}
          </Text>
          <Text style={styles.title}>{restaurant.name}</Text>
          <Text style={styles.address}>
            ⌖ {restaurant.address || 'Address not published'}
          </Text>

        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.overview}>
            {restaurant.description || 'Restaurant details will appear here when published.'}
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.menuHeader}>
            <Text style={styles.sectionTitle}>Menu</Text>
            <View style={styles.discountBadge}>
              <Text style={styles.discountBadgeText}>Published prices</Text>
            </View>
          </View>
          {sampleMenu.map((item) => (
            <View key={item.name} style={styles.menuRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.menuName}>{item.name}</Text>
                <Text style={styles.menuDesc}>{item.description}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.oldPrice}>{item.old}</Text>
                <Text style={styles.newPrice}>{item.price}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>More great venues</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {more.map((r) => (
              <Pressable
                key={r.id}
                style={styles.moreCard}
                onPress={() => router.push(`/restaurant/${r.id}`)}
              >
                <ImageBackground
                  source={{ uri: r.image }}
                  style={styles.moreImage}
                  imageStyle={{ borderRadius: radius.lg }}
                />
                <Text style={styles.moreName} numberOfLines={1}>
                  {r.name}
                </Text>
                <View style={styles.moreMeta}>
                  <Text style={styles.moreSuburb}>{r.suburb}</Text>
                  <View style={styles.moreDiscount}>
                    <Text style={styles.moreDiscountText}>{r.discount}% OFF</Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  content: { paddingBottom: 48 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  heroImage: {
    height: 280,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  heroOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: spacing.lg,
  },
  offerPill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.ink,
    paddingHorizontal: spacing.lg,
    paddingVertical: 8,
    borderRadius: radius.full,
  },
  offerText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  info: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
  },
  breadcrumbs: {
    fontSize: 13,
    color: colors.muted,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -1.5,
    color: colors.ink,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  address: {
    fontSize: 15,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  openRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  openDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.open,
  },
  openText: {
    fontSize: 15,
    color: colors.ink,
  },
  section: {
    marginTop: spacing.xxxl,
    paddingHorizontal: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.ink,
    paddingTop: spacing.xxl,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '500',
    letterSpacing: -0.5,
    color: colors.ink,
    marginBottom: spacing.lg,
  },
  overview: {
    fontSize: 17,
    lineHeight: 26,
    color: colors.ink,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  discountBadge: {
    backgroundColor: colors.discountBg,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: radius.sm,
  },
  discountBadgeText: {
    fontWeight: '600',
    color: colors.ink,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    gap: spacing.md,
  },
  menuName: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.ink,
    marginBottom: 4,
  },
  menuDesc: {
    fontSize: 13,
    color: colors.muted,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  oldPrice: {
    backgroundColor: '#E9E5DC',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    color: colors.muted,
    textDecorationLine: 'line-through',
  },
  newPrice: {
    backgroundColor: colors.discountBg,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    fontWeight: '500',
    color: colors.ink,
  },
  moreCard: {
    width: 160,
    marginRight: spacing.md,
  },
  moreImage: {
    height: 140,
    marginBottom: spacing.sm,
  },
  moreName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.ink,
  },
  moreMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  moreSuburb: {
    fontSize: 12,
    color: colors.muted,
  },
  moreDiscount: {
    backgroundColor: '#E1E2A0',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  moreDiscountText: {
    fontSize: 11,
    fontWeight: '700',
  },
});

