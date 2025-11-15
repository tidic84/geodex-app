import React from 'react';
import { StyleSheet, ScrollView, View, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useInventory } from '@/hooks/useInventory';
import { useColorScheme } from '@/hooks/useColorScheme';
import { GEMS } from '@/services/gemService';

export default function ProfileScreen() {
  const { inventory, coins, getTotalValue, getTotalGems, getUniqueGems } = useInventory();
  const colorScheme = useColorScheme();
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const primaryColor = useThemeColor({}, 'primary');

  const collectionProgress = Math.round((getUniqueGems() / GEMS.length) * 100);

  const stats = [
    {
      icon: 'diamond' as const,
      label: 'Pierres totales',
      value: getTotalGems(),
      color: '#2563EB',
    },
    {
      icon: 'albums' as const,
      label: 'Uniques',
      value: `${getUniqueGems()}/${GEMS.length}`,
      color: '#8B5CF6',
    },
    {
      icon: 'cash' as const,
      label: 'Pièces',
      value: coins,
      color: '#F59E0B',
    },
    {
      icon: 'trending-up' as const,
      label: 'Valeur totale',
      value: getTotalValue(),
      color: '#10B981',
    },
  ];

  const handleResetProgress = () => {
    Alert.alert(
      'Réinitialiser',
      'Cette fonctionnalité permet de réinitialiser votre progression. Elle sera disponible prochainement!',
      [{ text: 'OK' }]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: primaryColor }]}>
            <Ionicons name="person" size={40} color="#FFFFFF" />
          </View>
          <ThemedText type="title" style={styles.name}>
            Collectionneur
          </ThemedText>
          <ThemedText style={[styles.username, { color: textSecondaryColor }]}>
            @geodex_master
          </ThemedText>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <Card key={index} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: `${stat.color}15` }]}>
                <Ionicons name={stat.icon} size={24} color={stat.color} />
              </View>
              <ThemedText style={[styles.statValue, { color: textColor }]}>
                {stat.value}
              </ThemedText>
              <ThemedText style={[styles.statLabel, { color: textSecondaryColor }]}>
                {stat.label}
              </ThemedText>
            </Card>
          ))}
        </View>

        {/* Collection Progress */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Progression de collection</ThemedText>
          <Card style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <ThemedText style={styles.progressTitle}>
                {collectionProgress}% complété
              </ThemedText>
              <Ionicons name="trophy" size={24} color="#F59E0B" />
            </View>
            <View style={[styles.progressBarContainer, { backgroundColor: textSecondaryColor + '20' }]}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    backgroundColor: primaryColor,
                    width: `${collectionProgress}%`,
                  },
                ]}
              />
            </View>
            <ThemedText style={[styles.progressText, { color: textSecondaryColor }]}>
              {getUniqueGems()} sur {GEMS.length} pierres découvertes
            </ThemedText>
          </Card>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Succès</ThemedText>
          <Card style={styles.achievementCard}>
            <View style={[styles.achievementIcon, { backgroundColor: '#F59E0B20' }]}>
              <Ionicons name="ribbon" size={28} color="#F59E0B" />
            </View>
            <View style={styles.achievementContent}>
              <ThemedText style={styles.achievementTitle}>Première Pierre</ThemedText>
              <ThemedText style={[styles.achievementDesc, { color: textSecondaryColor }]}>
                Ouvrir votre première géode
              </ThemedText>
            </View>
            <Ionicons
              name={getTotalGems() > 0 ? 'checkmark-circle' : 'lock-closed'}
              size={24}
              color={getTotalGems() > 0 ? '#10B981' : textSecondaryColor}
            />
          </Card>

          <Card style={styles.achievementCard}>
            <View style={[styles.achievementIcon, { backgroundColor: '#2563EB20' }]}>
              <Ionicons name="diamond" size={28} color="#2563EB" />
            </View>
            <View style={styles.achievementContent}>
              <ThemedText style={styles.achievementTitle}>Collectionneur</ThemedText>
              <ThemedText style={[styles.achievementDesc, { color: textSecondaryColor }]}>
                Collecter 10 pierres différentes
              </ThemedText>
            </View>
            <Ionicons
              name={getUniqueGems() >= 10 ? 'checkmark-circle' : 'lock-closed'}
              size={24}
              color={getUniqueGems() >= 10 ? '#10B981' : textSecondaryColor}
            />
          </Card>

          <Card style={styles.achievementCard}>
            <View style={[styles.achievementIcon, { backgroundColor: '#8B5CF620' }]}>
              <Ionicons name="sparkles" size={28} color="#8B5CF6" />
            </View>
            <View style={styles.achievementContent}>
              <ThemedText style={styles.achievementTitle}>Expert</ThemedText>
              <ThemedText style={[styles.achievementDesc, { color: textSecondaryColor }]}>
                Compléter 100% de la collection
              </ThemedText>
            </View>
            <Ionicons
              name={collectionProgress === 100 ? 'checkmark-circle' : 'lock-closed'}
              size={24}
              color={collectionProgress === 100 ? '#10B981' : textSecondaryColor}
            />
          </Card>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Paramètres</ThemedText>
          <Card>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons name={colorScheme === 'dark' ? 'moon' : 'sunny'} size={20} color={primaryColor} />
                <ThemedText style={styles.settingText}>Thème</ThemedText>
              </View>
              <ThemedText style={[styles.settingValue, { color: textSecondaryColor }]}>
                {colorScheme === 'dark' ? 'Sombre' : 'Clair'}
              </ThemedText>
            </View>
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
  username: {
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    padding: 16,
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  progressCard: {
    padding: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  progressBarContainer: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 13,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  achievementDesc: {
    fontSize: 13,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: 16,
  },
  settingValue: {
    fontSize: 14,
  },
});
