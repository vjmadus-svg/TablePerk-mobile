import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { restaurants } from '@/data/restaurants';
import { useAppStore } from '@/store/useAppStore';
import { RestaurantCard } from '@/components/RestaurantCard';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export default function SavedScreen() {
  const router = useRouter();
  const { savedIds, toggleSaved, isLoggedIn, venues } = useAppStore();
  const saved = venues.filter((r) => savedIds.includes(r.id));

  if(!isLoggedIn)return <Redirect href='/account' />;
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={typography.h2}>Saved places</Text>
        <Text style={styles.sub}>
          {saved.length === 0
            ? 'Heart restaurants you love and find them here.'
            : `${saved.length} saved for later`}
        </Text>
      </View>

      {saved.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>♡</Text>
          <Text style={styles.emptyTitle}>Nothing saved yet</Text>
          <Text style={styles.emptyBody}>
            Tap the heart on any deal card to keep it here for later.
          </Text>
        </View>
      ) : (
        <FlatList
          data={saved}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <RestaurantCard
              restaurant={item}
              isSaved
              onPress={() => router.push(`/restaurant/${item.id}`)}
              onToggleSave={() => toggleSaved(item.id)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  sub: {
    ...typography.bodyMuted,
    marginTop: 4,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 40,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxxl,
  },
  emptyIcon: {
    fontSize: 48,
    color: colors.orange,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.ink,
  },
  emptyBody: {
    ...typography.bodyMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});

