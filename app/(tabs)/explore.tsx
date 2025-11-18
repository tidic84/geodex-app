import React, { useMemo, useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useInventory } from '@/hooks/useInventory';
import { GEMS, GemRarity, RARITY_COLORS } from '@/services/gemService';

const RARITY_FILTERS: (GemRarity | 'all')[] = ['all', 'common', 'uncommon', 'rare', 'epic', 'legendary'];

export default function MuseumScreen() {
  const [selectedRarity, setSelectedRarity] = useState<GemRarity | 'all'>('all');
  const [accumulatedIncome, setAccumulatedIncome] = useState(0);
  const {
    inventory,
    sellGem,
    coins,
    getPassiveIncomeRate,
    getAccumulatedIncome,
    collectIncome
  } = useInventory();

  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const primaryColor = useThemeColor({}, 'primary');
  const borderColor = useThemeColor({}, 'border');

  // Update accumulated income every second
  useEffect(() => {
    const updateIncome = () => {
      setAccumulatedIncome(getAccumulatedIncome());
    };

    updateIncome();
    const interval = setInterval(updateIncome, 1000);
    return () => clearInterval(interval);
  }, [getAccumulatedIncome]);

  const incomeRate = getPassiveIncomeRate();

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
      income: Math.floor(gem.value * 0.1) * (inventory.get(gem.id)?.quantity || 0),
    }));
  }, [selectedRarity, inventory]);

  const handleCollectIncome = () => {
    if (accumulatedIncome > 0) {
      const collected = collectIncome();
      Alert.alert(
        '💰 Revenus collectés !',
        `Vous avez collecté ${collected} pièces de votre musée !`,
        [{ text: 'Super !' }]
      );
    } else {
      Alert.alert(
        'Pas de revenus',
        'Vos revenus s\'accumulent au fil du temps. Revenez plus tard !',
        [{ text: 'OK' }]
      );
    }
  };

  const getRarityLabel = (rarity: GemRarity | 'all'): string => {
    if (rarity === 'all') return 'Toutes';
    return rarity.charAt(0).toUpperCase() + rarity.slice(1);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <ThemedText type="title" style={styles.title}>
            Mon Musée
          </ThemedText>
          <View style={[styles.coinsBadge, { backgroundColor: `${primaryColor}15` }]}>
            <Ionicons name="cash" size={20} color="#F59E0B" />
            <ThemedText style={styles.coinsText}>{coins}</ThemedText>
          </View>
        </View>

        {/* Passive Income Card */}
        <Card style={styles.incomeCard}>
          <View style={styles.incomeHeader}>
            <View style={styles.incomeInfo}>
              <View style={styles.incomeLabelRow}>
                <Ionicons name="trending-up" size={18} color="#10B981" />
                <ThemedText style={[styles.incomeLabel, { color: textSecondaryColor }]}>
                  Revenu passif
                </ThemedText>
              </View>
              <ThemedText style={[styles.incomeRate, { color: textColor }]}>
                {incomeRate} <ThemedText style={[styles.incomeUnit, { color: textSecondaryColor }]}>/ heure</ThemedText>
              </ThemedText>
            </View>
            <View style={styles.accumulatedContainer}>
              <ThemedText style={[styles.accumulatedLabel, { color: textSecondaryColor }]}>
                Accumulé
              </ThemedText>
              <ThemedText style={[styles.accumulatedValue, { color: '#F59E0B' }]}>
                +{accumulatedIncome}
              </ThemedText>
            </View>
          </View>
          <Pressable
            onPress={handleCollectIncome}
            style={[
              styles.collectButton,
              {
                backgroundColor: accumulatedIncome > 0 ? '#10B981' : textSecondaryColor + '40',
              }
            ]}
          >
            <Ionicons name="wallet" size={20} color="#FFFFFF" />
            <ThemedText style={styles.collectButtonText}>
              {accumulatedIncome > 0 ? `Collecter ${accumulatedIncome}` : 'Rien à collecter'}
            </ThemedText>
          </Pressable>
        </Card>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="business" size={20} color={primaryColor} />
            <ThemedText style={styles.statText}>
              {collectionStats.owned}/{collectionStats.total} exposées
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
          filteredGems.map(({ gem, owned, quantity, income }) => (
            <View key={gem.id} style={[styles.gemWrapper, !owned && styles.notOwned]}>
              {owned ? (
                <Card style={styles.gemCard}>
                  <View style={[styles.gemIcon, { backgroundColor: `${gem.color}30` }]}>
                    <ThemedText style={styles.gemEmoji}>{gem.icon}</ThemedText>
                  </View>
                  <View style={styles.gemContent}>
                    <View style={styles.gemHeader}>
                      <ThemedText style={[styles.gemName, { color: textColor }]}>{gem.name}</ThemedText>
                      {quantity > 1 && (
                        <View style={[styles.quantityBadge, { backgroundColor: RARITY_COLORS[gem.rarity] }]}>
                          <ThemedText style={styles.quantityText}>×{quantity}</ThemedText>
                        </View>
                      )}
                    </View>
                    <View style={[styles.rarityBadge, { backgroundColor: `${RARITY_COLORS[gem.rarity]}20` }]}>
                      <ThemedText style={[styles.rarityText, { color: RARITY_COLORS[gem.rarity] }]}>
                        {gem.rarity.toUpperCase()}
                      </ThemedText>
                    </View>
                    <View style={styles.incomeRow}>
                      <Ionicons name="trending-up" size={14} color="#10B981" />
                      <ThemedText style={[styles.gemIncome, { color: '#10B981' }]}>
                        +{income}/h
                      </ThemedText>
                    </View>
                  </View>
                  {quantity > 1 && (
                    <Pressable
                      onPress={() => sellGem(gem.id)}
                      style={styles.sellButton}
                      hitSlop={8}
                    >
                      <Ionicons name="cash-outline" size={24} color="#10B981" />
                    </Pressable>
                  )}
                </Card>
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
  incomeCard: {
    padding: 16,
    marginBottom: 16,
  },
  incomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  incomeInfo: {
    flex: 1,
  },
  incomeLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  incomeLabel: {
    fontSize: 14,
  },
  incomeRate: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  incomeUnit: {
    fontSize: 14,
    fontWeight: 'normal',
  },
  accumulatedContainer: {
    alignItems: 'flex-end',
  },
  accumulatedLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  accumulatedValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  collectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  collectButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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
  gemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
  },
  gemIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  gemEmoji: {
    fontSize: 28,
  },
  gemContent: {
    flex: 1,
  },
  gemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  gemName: {
    fontSize: 16,
    fontWeight: '600',
  },
  quantityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  quantityText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  rarityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  rarityText: {
    fontSize: 11,
    fontWeight: '700',
  },
  incomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  gemIncome: {
    fontSize: 14,
    fontWeight: '600',
  },
  sellButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#10B98120',
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
