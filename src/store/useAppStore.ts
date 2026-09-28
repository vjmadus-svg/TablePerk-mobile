import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Cuisine, DiningTime, SortOption, UserRole, MenuItem } from '@/types';
import { seededMenu } from '@/data/restaurants';

interface AppState {
  // Filters
  searchQuery: string;
  activeCuisine: Cuisine;
  timeFilter: DiningTime;
  sortBy: SortOption;

  // Saved
  savedIds: string[];

  // Auth
  isLoggedIn: boolean;
  role: UserRole;
  restaurantName: string;

  // Menu editor
  menuDate: string;
  menuItems: MenuItem[];
  publishStatus: 'draft' | 'published';

  // Actions
  setSearchQuery: (q: string) => void;
  setActiveCuisine: (c: Cuisine) => void;
  setTimeFilter: (t: DiningTime) => void;
  setSortBy: (s: SortOption) => void;
  toggleSaved: (id: string) => void;
  login: (role: UserRole) => void;
  logout: () => void;
  setMenuDate: (date: string) => void;
  setMenuItems: (items: MenuItem[]) => void;
  updateMenuItem: (id: string, patch: Partial<MenuItem>) => void;
  addMenuItem: () => void;
  removeMenuItem: (id: string) => void;
  publishMenu: () => void;
  loadMenuForDate: (date: string) => void;
}

const today = () => new Date().toISOString().slice(0, 10);

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      searchQuery: '',
      activeCuisine: 'All cuisines',
      timeFilter: 'Any time',
      sortBy: 'recommended',
      savedIds: [],
      isLoggedIn: false,
      role: null,
      restaurantName: 'Luna Pizza Bar',
      menuDate: today(),
      menuItems: JSON.parse(JSON.stringify(seededMenu)),
      publishStatus: 'draft',

      setSearchQuery: (q) => set({ searchQuery: q }),
      setActiveCuisine: (c) => set({ activeCuisine: c }),
      setTimeFilter: (t) => set({ timeFilter: t }),
      setSortBy: (s) => set({ sortBy: s }),

      toggleSaved: (id) =>
        set((state) => ({
          savedIds: state.savedIds.includes(id)
            ? state.savedIds.filter((x) => x !== id)
            : [...state.savedIds, id],
        })),

      login: (role) => set({ isLoggedIn: true, role }),
      logout: () =>
        set({
          isLoggedIn: false,
          role: null,
          publishStatus: 'draft',
        }),

      setMenuDate: (date) => {
        set({ menuDate: date });
        get().loadMenuForDate(date);
      },

      setMenuItems: (items) => set({ menuItems: items, publishStatus: 'draft' }),

      updateMenuItem: (id, patch) =>
        set((state) => ({
          menuItems: state.menuItems.map((item) =>
            item.id === id ? { ...item, ...patch } : item
          ),
          publishStatus: 'draft',
        })),

      addMenuItem: () =>
        set((state) => ({
          menuItems: [
            ...state.menuItems,
            {
              id: Date.now().toString(),
              name: 'New menu item',
              description: 'Add a description',
              price: '0.00',
              category: 'Mains',
              available: true,
            },
          ],
          publishStatus: 'draft',
        })),

      removeMenuItem: (id) =>
        set((state) => ({
          menuItems: state.menuItems.filter((item) => item.id !== id),
          publishStatus: 'draft',
        })),

      publishMenu: () => set({ publishStatus: 'published' }),

      loadMenuForDate: (_date) => {
        // In a real app this would load from a keyed store.
        // For demo we keep the current in-memory items or seed.
        const current = get().menuItems;
        if (current.length === 0) {
          set({ menuItems: JSON.parse(JSON.stringify(seededMenu)) });
        }
      },
    }),
    {
      name: 'tableperk-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        savedIds: state.savedIds,
        isLoggedIn: state.isLoggedIn,
        role: state.role,
        menuItems: state.menuItems,
        menuDate: state.menuDate,
        publishStatus: state.publishStatus,
      }),
    }
  )
);
