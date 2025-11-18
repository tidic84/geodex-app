import React from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useInventory } from '@/hooks/useInventory';
import { GEODE_TYPES, GEMS, RARITY_COLORS } from '@/services/gemService';

export default function ShopScreen() {
  const { coins } = useInventory();
  const router = useRouter();
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const primaryColor = useThemeColor({}, 'primary');

  // Get rarity distribution for gems
  const rarityStats = {
    common: GEMS.filter(g => g.rarity === 'common').length,
    uncommon: GEMS.filter(g => g.rarity === 'uncommon').length,
    rare: GEMS.filter(g => g.rarity === 'rare').length,
    epic: GEMS.filter(g => g.rarity === 'epic').length,
    legendary: GEMS.filter(g => g.rarity === 'legendary').length,
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <ThemedText type="title" style={styles.title}>
            Guide
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: textSecondaryColor }]}>
            Informations sur les géodes
          </ThemedText>
        </View>
        <View style={[styles.coinsBadge, { backgroundColor: `${primaryColor}15` }]}>
          <Ionicons name="cash" size={20} color="#F59E0B" />
          <ThemedText style={styles.coinsText}>{coins}</ThemedText>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Rarity Guide */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Raretés des pierres</ThemedText>
          <Card style={styles.rarityCard}>
            {Object.entries(rarityStats).map(([rarity, count]) => (
              <View key={rarity} style={styles.rarityRow}>
                <View style={[styles.rarityDot, { backgroundColor: RARITY_COLORS[rarity as keyof typeof RARITY_COLORS] }]} />
                <ThemedText style={styles.rarityName}>
                  {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                </ThemedText>
                <ThemedText style={[styles.rarityCount, { color: textSecondaryColor }]}>
                  {count} pierres
                </ThemedText>
              </View>
            ))}
          </Card>
        </View>

        {/* Geodes Guide */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Types de géodes</ThemedText>
          {GEODE_TYPES.map((geode) => (
            <Card key={geode.id} style={styles.geodeCard} onPress={() => router.push('/')}>
              <View style={[styles.geodeIcon, { backgroundColor: geode.color }]}>
                <Text style={styles.geodeEmoji}>🪨</Text>
              </View>
              <View style={styles.geodeInfo}>
                <ThemedText style={styles.geodeName}>{geode.name}</ThemedText>
                <View style={styles.geodeStats}>
                  <View style={styles.geodeStat}>
                    <Ionicons name="diamond" size={14} color={primaryColor} />
                    <ThemedText style={[styles.geodeStatText, { color: textSecondaryColor }]}>
                      {geode.minGems}-{geode.maxGems} pierres
                    </ThemedText>
                  </View>
                  <View style={styles.geodeStat}>
                    <Ionicons name="cash" size={14} color="#F59E0B" />
                    <ThemedText style={[styles.geodeStatText, { color: textSecondaryColor }]}>
                      {geode.cost} pièces
                    </ThemedText>
                  </View>
                </View>
                <ThemedText style={[styles.geodeHint, { color: primaryColor }]}>
                  Appuyer pour ouvrir →
                </ThemedText>
              </View>
            </Card>
          ))}
        </View>

        {/* Tips */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Conseils</ThemedText>
          <Card style={styles.tipCard}>
            <Ionicons name="bulb" size={24} color="#F59E0B" />
            <ThemedText style={[styles.tipText, { color: textColor }]}>
              Les géodes plus chères ont plus de chances de contenir des pierres rares !
            </ThemedText>
          </Card>
          <Card style={styles.tipCard}>
            <Ionicons name="gift" size={24} color="#10B981" />
            <ThemedText style={[styles.tipText, { color: textColor }]}>
              Complétez des missions pour gagner des pièces gratuites !
            </ThemedText>
          </Card>
          <Card style={styles.tipCard}>
            <Ionicons name="lock-closed" size={24} color="#8B5CF6" />
            <ThemedText style={[styles.tipText, { color: textColor }]}>
              Vous ne pouvez pas vendre votre dernière pierre d'un type pour préserver votre collection.
            </ThemedText>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  coinsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  coinsText: {
    fontSize: 16,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  rarityCard: {
    padding: 16,
  },
  rarityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  rarityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  rarityName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  rarityCount: {
    fontSize: 14,
  },
  geodeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
  },
  geodeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  geodeEmoji: {
    fontSize: 28,
  },
  geodeInfo: {
    flex: 1,
  },
  geodeName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  geodeStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 4,
  },
  geodeStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  geodeStatText: {
    fontSize: 12,
  },
  geodeHint: {
    fontSize: 12,
    fontWeight: '600',
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});
