import { Restaurant, Cuisine, DiningTime, SortOption } from '@/types';

export function filterAndSortRestaurants(
  restaurants: Restaurant[],
  query: string,
  cuisine: Cuisine,
  time: DiningTime,
  sortBy: SortOption
): Restaurant[] {
  const q = query.trim().toLowerCase();

  let matches = restaurants.filter((r) => {
    const matchesCuisine = cuisine === 'All cuisines' || r.cuisine === cuisine;
    const matchesQuery =
      !q ||
      `${r.name} ${r.cuisine} ${r.suburb} ${r.keywords || ''}`
        .toLowerCase()
        .includes(q);
    const matchesTime =
      time === 'Any time' || r.time === time || r.time === 'Any time';
    return matchesCuisine && matchesQuery && matchesTime;
  });

  if (sortBy === 'discount') {
    matches = [...matches].sort((a, b) => b.discount - a.discount);
  } else if (sortBy === 'rating') {
    matches = [...matches].sort((a, b) => b.rating - a.rating);
  }

  return matches;
}
