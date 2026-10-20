import { useAppStore } from '@/store/useAppStore';
import { NotificationBell } from '@/components/NotificationBell';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';

export default function TabLayout() {
  const isLoggedIn = useAppStore(s=>s.isLoggedIn);
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.orange,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          borderTopColor: colors.line,
          backgroundColor: colors.white,
          height: 60,
          paddingBottom: 8,
        },
        headerStyle: { backgroundColor: colors.white },
        headerShadowVisible: false,
        headerRight: () => isLoggedIn ? <NotificationBell /> : null,
        headerTitleStyle: { fontWeight: '800', letterSpacing: -0.5 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
          headerTitle: 'tableperk',
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          href: isLoggedIn ? '/saved' : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bookmark" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

