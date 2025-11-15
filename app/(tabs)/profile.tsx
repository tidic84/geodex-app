import React from 'react';
import { StyleSheet, ScrollView, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useFavorites } from '@/hooks/useFavorites';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MOCK_LOCATIONS } from '@/services/locationService';

type SettingItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showChevron?: boolean;
};

function SettingItem({ icon, title, subtitle, onPress, showChevron = true }: SettingItemProps) {
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const iconColor = useThemeColor({}, 'icon');
  const primaryColor = useThemeColor({}, 'primary');

  const content = (
    <View style={styles.settingItem}>
      <View style={[styles.settingIcon, { backgroundColor: `${primaryColor}15` }]}>
        <Ionicons name={icon} size={22} color={primaryColor} />
      </View>
      <View style={styles.settingContent}>
        <ThemedText style={[styles.settingTitle, { color: textColor }]}>
          {title}
        </ThemedText>
        {subtitle && (
          <ThemedText style={[styles.settingSubtitle, { color: textSecondaryColor }]}>
            {subtitle}
          </ThemedText>
        )}
      </View>
      {showChevron && (
        <Ionicons name="chevron-forward" size={20} color={iconColor} />
      )}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress}>
        {content}
      </Pressable>
    );
  }

  return content;
}

export default function ProfileScreen() {
  const { favorites } = useFavorites();
  const colorScheme = useColorScheme();
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const primaryColor = useThemeColor({}, 'primary');

  const visitedCount = Math.floor(MOCK_LOCATIONS.length * 0.6);

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: primaryColor }]}>
            <Ionicons name="person" size={40} color="#FFFFFF" />
          </View>
          <ThemedText type="title" style={styles.name}>
            Explorateur
          </ThemedText>
          <ThemedText style={[styles.email, { color: textSecondaryColor }]}>
            explorateur@geodex.app
          </ThemedText>
        </View>

        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <Ionicons name="map" size={24} color={primaryColor} />
              <ThemedText style={[styles.statValue, { color: textColor }]}>
                {visitedCount}
              </ThemedText>
              <ThemedText style={[styles.statLabel, { color: textSecondaryColor }]}>
                Visités
              </ThemedText>
            </View>
          </Card>

          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <Ionicons name="heart" size={24} color="#EF4444" />
              <ThemedText style={[styles.statValue, { color: textColor }]}>
                {favorites.size}
              </ThemedText>
              <ThemedText style={[styles.statLabel, { color: textSecondaryColor }]}>
                Favoris
              </ThemedText>
            </View>
          </Card>

          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <Ionicons name="trophy" size={24} color="#F59E0B" />
              <ThemedText style={[styles.statValue, { color: textColor }]}>
                {Math.floor(visitedCount / 5)}
              </ThemedText>
              <ThemedText style={[styles.statLabel, { color: textSecondaryColor }]}>
                Badges
              </ThemedText>
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Paramètres</ThemedText>
          <Card>
            <SettingItem
              icon="notifications-outline"
              title="Notifications"
              subtitle="Gérer vos notifications"
            />
            <View style={styles.divider} />
            <SettingItem
              icon="location-outline"
              title="Localisation"
              subtitle="Toujours activée"
            />
            <View style={styles.divider} />
            <SettingItem
              icon={colorScheme === 'dark' ? 'moon' : 'sunny'}
              title="Apparence"
              subtitle={colorScheme === 'dark' ? 'Mode sombre' : 'Mode clair'}
            />
          </Card>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>À propos</ThemedText>
          <Card>
            <SettingItem
              icon="information-circle-outline"
              title="Version"
              subtitle="1.0.0"
              showChevron={false}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="document-text-outline"
              title="Conditions d'utilisation"
            />
            <View style={styles.divider} />
            <SettingItem
              icon="shield-checkmark-outline"
              title="Politique de confidentialité"
            />
          </Card>
        </View>

        <View style={styles.section}>
          <Card>
            <Pressable style={styles.logoutButton}>
              <Ionicons name="log-out-outline" size={22} color="#EF4444" />
              <ThemedText style={styles.logoutText}>
                Se déconnecter
              </ThemedText>
            </Pressable>
          </Card>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    padding: 16,
  },
  statContent: {
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    opacity: 0.3,
    marginLeft: 52,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
});
