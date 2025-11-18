import React, { useMemo, useState } from 'react';
import { StyleSheet, ScrollView, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { GemCard } from '@/components/GemCard';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useInventory } from '@/hooks/useInventory';
import { GEMS, GemRarity } from '@/services/gemService';

const RARITY_FILTERS: (GemRarity | 'all')[] = ['all', 'common', 'uncommon', 'rare', 'epic', 'legendary'];

export default function CollectionScreen() {
  const [selectedRarity, setSelectedRarity] = useState<GemRarity | 'all'>('all');
  const { inventory, sellGem, coins } = useInventory();

  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const primaryColor = useThemeColor({}, 'primary');
  const borderColor = useThemeColor({}, 'border');

  const collectionStats = useMemo(() => {
    const owned = inventory.size;
    const total = GEMS.length;
    const percentage = total > 0 ? Math.round((owned / total) * 100) : 0;

    return { owned, total, percentage };
  }, [inventory]);

  const filteredGems = useMemo(() => {
    let gems = GEMS;

    if (selectedRarity !== 'all') {
      gems = gems.filter((g) => g.rarity === selectedRarity);
    }

    return gems.map((gem) => ({
      gem,
      owned: inventory.has(gem.id),
      quantity: inventory.get(gem.id)?.quantity || 0,
    }));
  }, [selectedRarity, inventory]);

  const getRarityLabel = (rarity: GemRarity | 'all'): string => {
    if (rarity === 'all') return 'Toutes';
    return rarity.charAt(0).toUpperCase() + rarity.slice(1);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <ThemedText type="title" style={styles.title}>
            Ma Collection
          </ThemedText>
          <View style={[styles.coinsBadge, { backgroundColor: `${primaryColor}15` }]}>
            <Ionicons name="cash" size={20} color="#F59E0B" />
            <ThemedText style={styles.coinsText}>{coins}</ThemedText>
          </View>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="albums" size={20} color={primaryColor} />
            <ThemedText style={styles.statText}>
              {collectionStats.owned}/{collectionStats.total}
            </ThemedText>
          </View>
          <View style={[styles.progressBar, { backgroundColor: borderColor }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: primaryColor,
                  width: `${collectionStats.percentage}%`,
                },
              ]}
            />
          </View>
          <ThemedText style={[styles.percentageText, { color: textSecondaryColor }]}>
            {collectionStats.percentage}% complété
          </ThemedText>
        </View>
      </View>

      {/* Rarity Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {RARITY_FILTERS.map((rarity) => (
          <Pressable
            key={rarity}
            onPress={() => setSelectedRarity(rarity)}
            style={[
              styles.filterChip,
              {
                backgroundColor:
                  selectedRarity === rarity ? primaryColor : 'transparent',
                borderColor: selectedRarity === rarity ? primaryColor : borderColor,
              },
            ]}
          >
            <ThemedText
              style={[
                styles.filterText,
                {
                  color: selectedRarity === rarity ? '#FFFFFF' : textColor,
                },
              ]}
            >
              {getRarityLabel(rarity)}
            </ThemedText>
          </Pressable>
        ))}
      </ScrollView>

      {/* Gems List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.gemsContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredGems.length > 0 ? (
          filteredGems.map(({ gem, owned, quantity }) => (
            <View key={gem.id} style={[styles.gemWrapper, !owned && styles.notOwned]}>
              {owned ? (
                <GemCard
                  gem={gem}
                  quantity={quantity}
                  onSell={() => sellGem(gem.id)}
                />
              ) : (
                <View style={styles.lockedGem}>
                  <View style={[styles.lockedIcon, { backgroundColor: `${textSecondaryColor}20` }]}>
                    <Ionicons name="lock-closed" size={24} color={textSecondaryColor} />
                  </View>
                  <View style={styles.lockedInfo}>
                    <ThemedText style={[styles.lockedName, { color: textSecondaryColor }]}>
                      ???
                    </ThemedText>
                    <ThemedText style={[styles.lockedText, { color: textSecondaryColor }]}>
                      Non découvert
                    </ThemedText>
                  </View>
                </View>
              )}
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="diamond-outline" size={64} color={textSecondaryColor} style={styles.emptyIcon} />
            <ThemedText style={styles.emptyText}>
              Aucune pierre dans cette catégorie
            </ThemedText>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
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
  statsContainer: {
    gap: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statText: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 12,
  },
  filtersContainer: {
    marginBottom: 16,
  },
  filtersContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  gemsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  gemWrapper: {
    opacity: 1,
  },
  notOwned: {
    opacity: 0.5,
  },
  lockedGem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  lockedIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  lockedInfo: {
    flex: 1,
  },
  lockedName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  lockedText: {
    fontSize: 13,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.3,
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.6,
  },
});
