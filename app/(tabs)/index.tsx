import { SavingsPlanner } from '@/components/SavingsPlanner';
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { restaurants, cuisines } from '@/data/restaurants';
import { useAppStore } from '@/store/useAppStore';
import { filterAndSortRestaurants } from '@/utils/filterRestaurants';
import { RestaurantCard } from '@/components/RestaurantCard';
import { Chip } from '@/components/Chip';
import { Button } from '@/components/Button';
import { LoginModal } from '@/components/LoginModal';
import { colors } from '@/theme/colors';
import { spacing, radius } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { Cuisine, DiningTime, SortOption } from '@/types';

export default function DiscoverScreen() {
  const router = useRouter();
  const [loginVisible, setLoginVisible] = useState(false);

  const {
    venues,
    searchQuery,
    activeCuisine,
    timeFilter,
    sortBy,
    savedIds,
    setSearchQuery,
    setActiveCuisine,
    setTimeFilter,
    setSortBy,
    toggleSaved,
    isLoggedIn,
    role,
  } = useAppStore();

  useEffect(()=>{if(!searchQuery.trim()||!isLoggedIn)return;const timer=setTimeout(()=>{void useAppStore.getState().trackSearch();},900);return ()=>clearTimeout(timer);},[searchQuery,isLoggedIn]);
  const filtered = useMemo(
    () =>
      filterAndSortRestaurants(
        venues,
        searchQuery,
        activeCuisine,
        timeFilter,
        sortBy
      ),
    [venues, searchQuery, activeCuisine, timeFilter, sortBy]
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={[typography.eyebrow, { color: colors.muted }]}>
            MELBOURNE'S TABLES, BETTER VALUE
          </Text>
          <Text style={styles.heroTitle}>
            Good food is{'\n'}
            <Text style={styles.heroEm}>always</Text> in season.
          </Text>
          <Text style={styles.heroIntro}>
            Discover delicious last-minute deals at the restaurants you love — and a few
            you're about to.
          </Text>
          <View style={styles.sticker}>
            <Text style={styles.stickerSmall}>UP TO</Text>
            <Text style={styles.stickerBig}>50%</Text>
            <Text style={styles.stickerSmall}>OFF DINING</Text>
          </View>
        </View>

        {/* Search panel */}
        <View style={styles.searchPanel}>
          <View style={styles.searchRow}>
            <Ionicons name="search" size={20} color={colors.muted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Restaurant, cuisine or suburb"
              placeholderTextColor={colors.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
          </View>

          <View style={styles.filterRow}>
            <View style={styles.pickerWrap}>
              <Text style={styles.filterLabel}>Time</Text>
              <View style={styles.segment}>
                {(['Any time', 'Lunch', 'Dinner'] as DiningTime[]).map((t) => (
                  <Chip
                    key={t}
                    label={t}
                    active={timeFilter === t}
                    onPress={() => setTimeFilter(t)}
                  />
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Cuisine chips */}
        <Text style={[typography.eyebrow, styles.sectionEyebrow]}>RIGHT NOW IN MELBOURNE</Text>
        <Text style={styles.sectionTitle}>Make tonight delicious.</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {cuisines.map((c) => (
            <Chip
              key={c}
              label={c}
              active={activeCuisine === c}
              onPress={() => setActiveCuisine(c as Cuisine)}
            />
          ))}
        </ScrollView>

        {/* Results header */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultCount}>
            <Text style={{ fontWeight: '700', color: colors.ink }}>{filtered.length}</Text>{' '}
            places to try
          </Text>
          <View style={styles.sortRow}>
            {(['recommended', 'discount', 'rating'] as SortOption[]).map((s) => (
              <Chip
                key={s}
                label={
                  s === 'recommended'
                    ? 'Recommended'
                    : s === 'discount'
                      ? 'Biggest discount'
                      : 'Highest rated'
                }
                active={sortBy === s}
                onPress={() => setSortBy(s)}
              />
            ))}
          </View>
        </View>

        <SavingsPlanner />
        {/* Cards */}
        {filtered.map((r) => (
          <RestaurantCard
            key={r.id}
            restaurant={r}
            isSaved={savedIds.includes(r.id)}
            onPress={() => router.push(`/restaurant/${r.id}`)}
            onToggleSave={() => toggleSaved(r.id)}
          />
        ))}

        {filtered.length === 0 && (
          <Text style={styles.empty}>No tables match that search. Try another suburb or cuisine.</Text>
        )}

        {/* How it works */}
        <View style={styles.how}>
          <Text style={[typography.eyebrow, { color: colors.orange }]}>DINING, SIMPLIFIED</Text>
          <Text style={styles.howTitle}>More reasons to{'\n'}go out tonight.</Text>
          {[
            { n: '01', icon: 'search', title: 'Find your flavour', body: 'Browse local restaurants and discover your next favourite.' },
            { n: '02', icon: 'sparkles', title: 'Choose your perk', body: 'Pick a deal that suits your plans, budget and appetite.' },
            { n: '03', icon: 'heart', title: 'Enjoy the good stuff', body: 'Save your table and turn an ordinary night into a good one.' },
          ].map((step) => (
            <View key={step.n} style={styles.step}>
              <Text style={styles.stepNum}>{step.n}</Text>
              <Ionicons name={step.icon as any} size={28} color={colors.orange} style={{ marginVertical: 12 }} />
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepBody}>{step.body}</Text>
            </View>
          ))}
        </View>

        {/* Partner CTA */}
        <View style={styles.partnerCta}>
          <Text style={styles.partnerTitle}>Restaurant partner?</Text>
          <Text style={styles.partnerBody}>
            Manage today’s menu, prices and availability in the partner workspace.
          </Text>
          <Button
            title={isLoggedIn && role === 'restaurant' ? 'Open workspace' : 'Restaurant workspace'}
            onPress={() => {
              if (isLoggedIn && role === 'restaurant') {
                router.push('/workspace');
              } else {
                setLoginVisible(true);
              }
            }}
            style={{ marginTop: spacing.lg }}
          />
        </View>
      </ScrollView>

      <LoginModal
        visible={loginVisible}
        onClose={() => setLoginVisible(false)}
        defaultRole="restaurant"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  container: { flex: 1 },
  content: { paddingBottom: 40 },
  hero: {
    backgroundColor: colors.cream,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: radius.xxl,
    padding: spacing.xxxl,
    position: 'relative',
    overflow: 'hidden',
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -1.5,
    color: colors.ink,
    lineHeight: 38,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  heroEm: {
    color: colors.orange,
    fontStyle: 'italic',
    fontWeight: '400',
  },
  heroIntro: {
    ...typography.bodyMuted,
    maxWidth: 280,
  },
  sticker: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-12deg' }],
  },
  stickerSmall: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  stickerBig: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -1,
  },
  searchPanel: {
    marginHorizontal: spacing.lg,
    marginTop: -20,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.line,
    shadowColor: '#362017',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.ink,
    paddingVertical: 8,
  },
  filterRow: { marginTop: 4 },
  filterLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.muted,
    marginBottom: 6,
  },
  segment: { flexDirection: 'row', flexWrap: 'wrap' },
  pickerWrap: {},
  sectionEyebrow: {
    marginTop: spacing.huge,
    marginHorizontal: spacing.lg,
    color: colors.orange,
  },
  sectionTitle: {
    ...typography.h2,
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  chips: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  resultsHeader: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    paddingBottom: spacing.md,
  },
  resultCount: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: spacing.sm,
  },
  sortRow: { flexDirection: 'row', flexWrap: 'wrap' },
  empty: {
    textAlign: 'center',
    color: colors.muted,
    marginVertical: spacing.xxxl,
    marginHorizontal: spacing.lg,
  },
  how: {
    marginTop: spacing.huge,
    marginHorizontal: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: spacing.xxxl,
  },
  howTitle: {
    ...typography.h2,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  step: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginBottom: spacing.md,
  },
  stepNum: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
    color: colors.orange,
  },
  stepTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 4,
  },
  stepBody: {
    ...typography.bodyMuted,
    fontSize: 13,
  },
  partnerCta: {
    margin: spacing.lg,
    marginTop: spacing.xxxl,
    backgroundColor: colors.ink,
    borderRadius: radius.xl,
    padding: spacing.xxxl,
  },
  partnerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.white,
  },
  partnerBody: {
    color: '#BCB5AE',
    marginTop: spacing.sm,
    lineHeight: 20,
  },
});

