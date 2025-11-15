import React from 'react';
import { StyleSheet, ScrollView, View, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { GeodeCard } from '@/components/GeodeCard';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useInventory } from '@/hooks/useInventory';
import { GEODE_TYPES } from '@/services/gemService';

export default function ShopScreen() {
  const { coins, spendCoins } = useInventory();
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const primaryColor = useThemeColor({}, 'primary');

  const handleBuyGeode = (geodeId: string) => {
    const geode = GEODE_TYPES.find((g) => g.id === geodeId);
    if (!geode) return;

    if (coins < geode.cost) {
      Alert.alert(
        'Pas assez de pièces',
        `Il vous faut ${geode.cost} pièces pour acheter cette géode. Vendez des pierres pour obtenir plus de pièces !`,
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Acheter une géode',
      `Voulez-vous acheter ${geode.name} pour ${geode.cost} pièces ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Acheter',
          onPress: () => {
            if (spendCoins(geode.cost)) {
              Alert.alert(
                'Achat réussi!',
                `Vous avez acheté ${geode.name}! Allez dans l'onglet "Ouvrir" pour l'ouvrir.`,
                [{ text: 'OK' }]
              );
            }
          },
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <ThemedText type="title" style={styles.title}>
            Boutique
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: textSecondaryColor }]}>
            Achetez des géodes avec vos pièces
          </ThemedText>
        </View>
        <View style={[styles.coinsBadge, { backgroundColor: `${primaryColor}15` }]}>
          <Ionicons name="cash" size={20} color="#F59E0B" />
          <ThemedText style={styles.coinsText}>{coins}</ThemedText>
        </View>
      </View>

      {/* Info Banner */}
      <View style={[styles.infoBanner, { backgroundColor: `${primaryColor}15` }]}>
        <Ionicons name="information-circle" size={20} color={primaryColor} />
        <ThemedText style={[styles.infoText, { color: textColor }]}>
          Vendez vos pierres précieuses pour obtenir plus de pièces
        </ThemedText>
      </View>

      {/* Geodes List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.geodeList}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={styles.sectionTitle}>Géodes disponibles</ThemedText>

        {GEODE_TYPES.map((geode) => (
          <Pressable key={geode.id} onPress={() => handleBuyGeode(geode.id)}>
            <GeodeCard geode={geode} coins={coins} showCost />
          </Pressable>
        ))}

        {/* Daily Rewards Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Pièces gratuites</ThemedText>
          <View style={[styles.rewardCard, { borderColor: primaryColor }]}>
            <View style={styles.rewardIcon}>
              <Ionicons name="gift" size={32} color={primaryColor} />
            </View>
            <View style={styles.rewardContent}>
              <ThemedText style={styles.rewardTitle}>Récompense quotidienne</ThemedText>
              <ThemedText style={[styles.rewardDesc, { color: textSecondaryColor }]}>
                Revenez demain pour obtenir 50 pièces gratuites!
              </ThemedText>
            </View>
            <Pressable
              style={[styles.rewardButton, { backgroundColor: `${primaryColor}30` }]}
              disabled
            >
              <ThemedText style={[styles.rewardButtonText, { color: primaryColor }]}>
                Bientôt
              </ThemedText>
            </Pressable>
          </View>
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
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  geodeList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  section: {
    marginTop: 24,
  },
  rewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
  },
  rewardIcon: {
    marginRight: 16,
  },
  rewardContent: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  rewardDesc: {
    fontSize: 13,
  },
  rewardButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  rewardButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
