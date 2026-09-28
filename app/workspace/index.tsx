import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  Switch,
  Pressable,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { useAppStore } from '@/store/useAppStore';
import { colors } from '@/theme/colors';
import { spacing, radius } from '@/theme/spacing';
import { typography } from '@/theme/typography';

const CATEGORIES = ['Mains', 'Starters', 'Desserts', 'Drinks'] as const;

export default function WorkspaceScreen() {
  const router = useRouter();
  const {
    restaurantName,
    menuDate,
    menuItems,
    publishStatus,
    setMenuDate,
    updateMenuItem,
    addMenuItem,
    removeMenuItem,
    publishMenu,
    logout,
  } = useAppStore();

  const handleLogout = () => {
    logout();
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.heading}>
          <Text style={[typography.eyebrow, { color: colors.orange }]}>
            RESTAURANT WORKSPACE
          </Text>
          <Text style={styles.title}>Today’s menu, made easy.</Text>
          <Text style={styles.subtitle}>
            Add what’s available today, update prices and publish it to your Tableperk listing.
          </Text>
        </View>

        <View style={styles.sidebar}>
          <Text style={styles.sidebarLabel}>SIGNED IN AS</Text>
          <Text style={styles.sidebarName}>{restaurantName}</Text>

          <Text style={styles.fieldLabel}>Menu date</Text>
          <TextInput
            style={styles.input}
            value={menuDate}
            onChangeText={setMenuDate}
            placeholder="YYYY-MM-DD"
          />

          <View style={styles.publishRow}>
            <View
              style={[
                styles.dot,
                publishStatus === 'published' && styles.dotPublished,
              ]}
            />
            <Text style={styles.publishText}>
              {publishStatus === 'published' ? 'Published for today' : 'Draft changes'}
            </Text>
          </View>
        </View>

        <View style={styles.editor}>
          <View style={styles.toolbar}>
            <View>
              <Text style={styles.editorTitle}>Menu items</Text>
              <Text style={styles.editorCount}>
                {menuItems.length} item{menuItems.length === 1 ? '' : 's'}
              </Text>
            </View>
            <Button title="Add item +" onPress={addMenuItem} style={{ height: 40 }} />
          </View>

          {menuItems.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>✳</Text>
              <Text style={styles.emptyTitle}>Your menu is empty</Text>
              <Text style={styles.emptyBody}>Add the first item available for this date.</Text>
            </View>
          ) : (
            menuItems.map((item) => (
              <View key={item.id} style={styles.menuRow}>
                <Text style={styles.fieldLabel}>Item name</Text>
                <TextInput
                  style={styles.input}
                  value={item.name}
                  onChangeText={(v) => updateMenuItem(item.id, { name: v })}
                />

                <Text style={styles.fieldLabel}>Description</Text>
                <TextInput
                  style={styles.input}
                  value={item.description}
                  onChangeText={(v) => updateMenuItem(item.id, { description: v })}
                />

                <View style={styles.row2}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fieldLabel}>Price</Text>
                    <TextInput
                      style={styles.input}
                      value={item.price}
                      keyboardType="decimal-pad"
                      onChangeText={(v) => updateMenuItem(item.id, { price: v })}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fieldLabel}>Category</Text>
                    <View style={styles.categoryRow}>
                      {CATEGORIES.map((cat) => (
                        <Pressable
                          key={cat}
                          style={[
                            styles.catChip,
                            item.category === cat && styles.catChipActive,
                          ]}
                          onPress={() => updateMenuItem(item.id, { category: cat })}
                        >
                          <Text
                            style={[
                              styles.catText,
                              item.category === cat && styles.catTextActive,
                            ]}
                          >
                            {cat}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                </View>

                <View style={styles.actions}>
                  <View style={styles.switchRow}>
                    <Switch
                      value={item.available}
                      onValueChange={(v) => updateMenuItem(item.id, { available: v })}
                      trackColor={{ true: colors.orange, false: colors.line }}
                    />
                    <Text style={styles.switchLabel}>Available today</Text>
                  </View>
                  <Pressable onPress={() => removeMenuItem(item.id)}>
                    <Text style={styles.remove}>Remove</Text>
                  </Pressable>
                </View>
              </View>
            ))
          )}

          <View style={styles.footer}>
            <Button
              title="Publish today’s menu →"
              onPress={publishMenu}
              style={{ flex: 1 }}
            />
          </View>
        </View>

        <Button
          title="Log out"
          variant="secondary"
          onPress={handleLogout}
          style={{ marginTop: spacing.xl }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  content: {
    padding: spacing.lg,
    paddingBottom: 48,
  },
  heading: {
    marginBottom: spacing.xxl,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    paddingBottom: spacing.xxl,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -1.2,
    color: colors.ink,
    marginTop: spacing.sm,
  },
  subtitle: {
    ...typography.bodyMuted,
    marginTop: spacing.sm,
  },
  sidebar: {
    backgroundColor: colors.cream,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  sidebarLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: colors.muted,
  },
  sidebarName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.ink,
    marginTop: 4,
    marginBottom: spacing.xl,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.muted,
    marginBottom: 6,
    marginTop: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.ink,
  },
  publishRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: '#EADED2',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.orange,
  },
  dotPublished: {
    backgroundColor: colors.success,
  },
  publishText: {
    fontSize: 12,
    color: colors.ink,
  },
  editor: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: spacing.xl,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    paddingBottom: spacing.lg,
    marginBottom: spacing.lg,
  },
  editorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.ink,
  },
  editorCount: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  menuRow: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  row2: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  catChip: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  catChipActive: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  catText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.ink,
  },
  catTextActive: {
    color: colors.white,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  switchLabel: {
    fontSize: 12,
    color: colors.muted,
  },
  remove: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.orange,
  },
  footer: {
    marginTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: spacing.lg,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.huge,
  },
  emptyIcon: {
    fontSize: 28,
    color: colors.orange,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
    marginTop: spacing.sm,
  },
  emptyBody: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 4,
  },
});
