import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { LoginModal } from '@/components/LoginModal';
import { useAppStore } from '@/store/useAppStore';
import { colors } from '@/theme/colors';
import { spacing, radius } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export default function AccountScreen() {
  const router = useRouter();
  const { isLoggedIn, role, logout, restaurantName, username } = useAppStore();
  const [loginVisible, setLoginVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={typography.h2}>Account</Text>
        <Text style={styles.sub}>Sign in to save offers and track your discounts.</Text>

        <View style={styles.card}>
          {isLoggedIn ? (
            <>
              <Text style={styles.label}>Signed in as</Text>
              <Text style={styles.value}>
                {role === 'restaurant' ? restaurantName : username}
              </Text>
              <Text style={styles.roleBadge}>
                {role === 'restaurant' ? 'Restaurant partner' : 'Customer'}
              </Text>

              {role === 'restaurant' && (
                <Button
                  title="Open restaurant workspace"
                  onPress={() => router.push('/workspace')}
                  style={{ marginTop: spacing.xl }}
                />
              )}

              <Button
                title="Log out"
                variant="secondary"
                onPress={logout}
                style={{ marginTop: spacing.md }}
              />
            </>
          ) : (
            <>
              <Text style={styles.value}>Not signed in</Text>
              <Text style={styles.hint}>
                Create an account or sign in with your username and password.
              </Text>
              <Button
                title="Log in"
                onPress={() => setLoginVisible(true)}
                style={{ marginTop: spacing.xl }}
              />
            </>
          )}
        </View>

        <View style={styles.info}>
          <Text style={styles.infoTitle}>Your account</Text>
          <Text style={styles.infoBody}>
            Your saved venues, searches and discount notifications are linked to your account.
          </Text>
        </View>
      </View>

      <LoginModal visible={loginVisible} onClose={() => setLoginVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  sub: {
    ...typography.bodyMuted,
    marginTop: 4,
    marginBottom: spacing.xxl,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: spacing.xxl,
    backgroundColor: colors.cream,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    color: colors.muted,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.ink,
    marginTop: 6,
  },
  roleBadge: {
    marginTop: spacing.sm,
    fontSize: 13,
    color: colors.orange,
    fontWeight: '600',
  },
  hint: {
    ...typography.bodyMuted,
    marginTop: spacing.sm,
  },
  info: {
    marginTop: spacing.xxxl,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  infoBody: {
    ...typography.bodyMuted,
    lineHeight: 21,
  },
});

