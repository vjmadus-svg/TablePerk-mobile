import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './Button';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { DEMO_EMAIL, DEMO_PASSWORD } from '@/data/restaurants';
import { UserRole } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { useRouter } from 'expo-router';

interface Props {
  visible: boolean;
  onClose: () => void;
  defaultRole?: UserRole;
}

export function LoginModal({ visible, onClose, defaultRole = 'customer' }: Props) {
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [message, setMessage] = useState('');
  const login = useAppStore((s) => s.login);
  const router = useRouter();

  const handleLogin = () => {
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      setMessage('Demo login successful — welcome to Tableperk.');
      login(role);
      onClose();
      if (role === 'restaurant') {
        router.push('/workspace');
      }
    } else {
      setMessage('Use the sample credentials shown above.');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.centered}
        >
          <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
            <Pressable style={styles.close} onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={28} color={colors.ink} />
            </Pressable>

            <Text style={[typography.eyebrow, { color: colors.orange }]}>TABLEPERK DEMO</Text>
            <Text style={styles.title}>Welcome back.</Text>
            <Text style={styles.copy}>
              Use the sample account below to test the login flow. This demo does not send
              credentials to a server.
            </Text>

            <View style={styles.credentials}>
              <Text style={styles.credLabel}>Test email</Text>
              <Text style={styles.credValue}>{DEMO_EMAIL}</Text>
              <Text style={styles.credLabel}>Test password</Text>
              <Text style={styles.credValue}>{DEMO_PASSWORD}</Text>
            </View>

            <Text style={styles.label}>Account type</Text>
            <View style={styles.roleRow}>
              <Pressable
                style={[styles.roleBtn, role === 'customer' && styles.roleActive]}
                onPress={() => setRole('customer')}
              >
                <Text style={[styles.roleText, role === 'customer' && styles.roleTextActive]}>
                  Customer
                </Text>
              </Pressable>
              <Pressable
                style={[styles.roleBtn, role === 'restaurant' && styles.roleActive]}
                onPress={() => setRole('restaurant')}
              >
                <Text style={[styles.roleText, role === 'restaurant' && styles.roleTextActive]}>
                  Restaurant partner
                </Text>
              </Pressable>
            </View>

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Button title="Continue to demo →" onPress={handleLogin} style={{ marginTop: 20 }} />
            {message ? <Text style={styles.message}>{message}</Text> : null}
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(32,32,29,0.72)',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  centered: {
    width: '100%',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.xxxl,
    position: 'relative',
  },
  close: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    zIndex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -1,
    color: colors.ink,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  copy: {
    ...typography.bodyMuted,
    fontSize: 13,
    lineHeight: 20,
  },
  credentials: {
    backgroundColor: colors.cream,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginVertical: spacing.xl,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  credLabel: {
    width: '40%',
    fontSize: 12,
    color: colors.muted,
  },
  credValue: {
    width: '55%',
    fontSize: 12,
    fontWeight: '700',
    color: colors.ink,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.ink,
    marginTop: spacing.md,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.ink,
  },
  roleRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  roleBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    paddingVertical: 12,
    alignItems: 'center',
  },
  roleActive: {
    borderColor: colors.orange,
    backgroundColor: colors.cream,
  },
  roleText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.muted,
  },
  roleTextActive: {
    color: colors.orange,
  },
  message: {
    marginTop: spacing.md,
    fontSize: 12,
    color: colors.orange,
    textAlign: 'center',
  },
});
