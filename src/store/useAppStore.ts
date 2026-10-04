import { Alert } from 'react-native';
import { request, authenticate, session, signOut } from '@/api/client';
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
  username: string;
  notifications: any[];
  venues: any[];
  login: (username: string, password: string, email?: string) => Promise<void>;
  restoreSession: () => Promise<void>;
  syncAccount: () => Promise<void>;
  loadVenues: () => Promise<void>;
  trackSearch: () => Promise<void>;
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

      username: '', notifications: [], venues: [],
      loadVenues: async () => {try {set({venues:(await request('/restaurants')).restaurants});} catch { /* discovery displays connection status separately */ }},
      trackSearch: async () => {
        if (!get().isLoggedIn || !get().searchQuery.trim()) return;
        try {await request('/me/searches',{method:'POST',body:JSON.stringify({query:get().searchQuery.trim()})});} catch(e) {Alert.alert('Search history', (e as Error).message);}
      },
      syncAccount: async () => {
        const account=get().username;
        const [saved, notices] = await Promise.all([request('/me/saved'),request('/me/notifications')]);
        if(get().isLoggedIn && get().username===account)set({savedIds:saved.ids,notifications:notices.notifications});
      },
      toggleSaved: async (id) => {
        if (!get().isLoggedIn) return;
        const saved=get().savedIds.includes(id);
        try {await request('/me/saved/'+id,{method:saved?'DELETE':'PUT'});await get().syncAccount();}
        catch(e) {Alert.alert('Could not save', (e as Error).message);}
      },
      login: async (username,password,email) => {
        const user=await authenticate(username,password,email);
        set({isLoggedIn:true,username:user.username||user.email,role:user.role==='CUSTOMER'?'customer':'restaurant'});
        await get().syncAccount();
      },
      restoreSession: async () => {
        try {
          const user=await session();
          if(user){set({isLoggedIn:true,username:user.username||user.email,role:user.role==='CUSTOMER'?'customer':'restaurant'});await get().syncAccount();}
        } catch { set({isLoggedIn:false,role:null,savedIds:[],notifications:[]}); }
      },
      logout: async () => {
        try {await signOut();} catch(e) {Alert.alert('Signed out on this device', 'Could not revoke the server session. It will expire automatically.');}
        set({isLoggedIn:false,role:null,username:'',savedIds:[],notifications:[],searchQuery:'',publishStatus:'draft'});
      },

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
      name: 'tableperk-drafts-v2',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        menuItems: state.menuItems,
        menuDate: state.menuDate,
        publishStatus: state.publishStatus,
      }),
    }
  )
);

