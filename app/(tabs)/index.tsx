import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, Modal, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { GemCard } from '@/components/GemCard';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useInventory } from '@/hooks/useInventory';
import { GEODE_TYPES, getGemsFromGeode, Gem } from '@/services/gemService';
import { hapticsService } from '@/services/hapticsService';

export default function HomeScreen() {
  const [selectedGeodeId, setSelectedGeodeId] = useState<string | null>(null);
  const [openedGems, setOpenedGems] = useState<Gem[]>([]);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  // Animations
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const modalScaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const { coins, spendCoins, addGems } = useInventory();
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const primaryColor = useThemeColor({}, 'primary');
  const backgroundColor = useThemeColor({}, 'background');

  const selectedGeode = selectedGeodeId
    ? GEODE_TYPES.find((g) => g.id === selectedGeodeId)
    : null;

  const handleGeodePress = (geodeId: string) => {
    hapticsService.selection();
    setSelectedGeodeId(geodeId);
  };

  const handleOpenGeode = async () => {
    if (!selectedGeode || isOpening) return;

    if (spendCoins(selectedGeode.cost)) {
      setIsOpening(true);

      // Haptic feedback for opening
      hapticsService.geodeOpen();

      // Complex animation sequence
      // 1. Shake animation
      const shakeSequence = Animated.sequence([
        ...Array(6).fill(null).map((_, i) =>
          Animated.timing(shakeAnim, {
            toValue: i % 2 === 0 ? 10 : -10,
            duration: 50,
            useNativeDriver: true,
          })
        ),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]);

      // 2. Scale and glow animation
      const scaleGlowSequence = Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 0.8,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1.3,
            duration: 300,
            easing: Easing.back(2),
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]);

      // Run animations
      Animated.sequence([shakeSequence, scaleGlowSequence]).start();

      // Obtenir les pierres
      const gems = getGemsFromGeode(selectedGeode);
      setOpenedGems(gems);
      addGems(gems);

      // Check for rare gems and provide haptic feedback
      const hasLegendary = gems.some(g => g.rarity === 'legendary');
      const hasEpic = gems.some(g => g.rarity === 'epic');
      const hasRare = gems.some(g => g.rarity === 'rare');

      if (hasLegendary) {
        setTimeout(() => hapticsService.legendaryGem(), 500);
      } else if (hasEpic || hasRare) {
        setTimeout(() => hapticsService.rareGem(), 500);
      }

      // Afficher les récompenses après un délai
      setTimeout(() => {
        setShowRewardModal(true);
        // Modal appear animation
        Animated.spring(modalScaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }).start();
        setIsOpening(false);
        // Reset rotation
        rotateAnim.setValue(0);
      }, 700);
    } else {
      hapticsService.error();
    }
  };

  const handleCloseModal = () => {
    hapticsService.lightTap();
    // Animate modal out
    Animated.timing(modalScaleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowRewardModal(false);
      setOpenedGems([]);
      setSelectedGeodeId(null);
    });
  };

  // Interpolate rotation
  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <ThemedText type="title" style={styles.title}>
            Ouvrir une Géode
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: textSecondaryColor }]}>
            Choisissez une géode à ouvrir
          </ThemedText>
        </View>
        <View style={[styles.coinsBadge, { backgroundColor: `${primaryColor}15` }]}>
          <Ionicons name="cash" size={20} color="#F59E0B" />
          <Text style={[styles.coinsText, { color: textColor }]}>{coins}</Text>
        </View>
      </View>

      {/* Selected Geode Display */}
      {selectedGeode && (
        <View style={styles.selectedContainer}>
          <Animated.View
            style={[
              styles.geodeDisplay,
              {
                transform: [
                  { scale: scaleAnim },
                  { translateX: shakeAnim },
                  { rotate: rotateInterpolate },
                ],
              },
            ]}
          >
            <Animated.View
              style={[
                styles.glowEffect,
                {
                  opacity: glowAnim,
                  backgroundColor: selectedGeode.color,
                },
              ]}
            />
            <View style={[styles.bigGeode, { backgroundColor: selectedGeode.color }]}>
              <Text style={styles.bigGeodeEmoji}>🪨</Text>
            </View>
          </Animated.View>

          <ThemedText style={styles.selectedName}>{selectedGeode.name}</ThemedText>
          <Text style={[styles.selectedInfo, { color: textSecondaryColor }]}>
            {selectedGeode.minGems}-{selectedGeode.maxGems} pierres précieuses
          </Text>

          <Pressable
            style={[
              styles.openButton,
              {
                backgroundColor:
                  coins >= selectedGeode.cost ? primaryColor : textSecondaryColor,
              },
            ]}
            onPress={handleOpenGeode}
            disabled={coins < selectedGeode.cost}
          >
            <Ionicons name="hammer" size={20} color="#FFFFFF" />
            <Text style={styles.openButtonText}>
              {coins >= selectedGeode.cost
                ? `Ouvrir (${selectedGeode.cost})`
                : 'Pas assez de pièces'}
            </Text>
          </Pressable>
        </View>
      )}

      {/* Geode List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.geodeList}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={styles.sectionTitle}>Géodes disponibles</ThemedText>
        {GEODE_TYPES.map((geode) => (
          <Pressable
            key={geode.id}
            onPress={() => handleGeodePress(geode.id)}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <Card
              style={[
                styles.geodeCard,
                selectedGeodeId === geode.id && {
                  borderWidth: 2,
                  borderColor: primaryColor,
                },
              ]}
            >
              <View style={[styles.geodeIcon, { backgroundColor: geode.color }]}>
                <Text style={styles.geodeEmoji}>🪨</Text>
              </View>
              <View style={styles.geodeInfo}>
                <Text style={[styles.geodeName, { color: textColor }]}>{geode.name}</Text>
                <Text style={[styles.geodeDetails, { color: textSecondaryColor }]}>
                  {geode.minGems}-{geode.maxGems} pierres
                </Text>
                <View style={styles.costRow}>
                  <Ionicons
                    name="cash"
                    size={14}
                    color={coins >= geode.cost ? '#F59E0B' : '#EF4444'}
                  />
                  <Text
                    style={[
                      styles.geodeCost,
                      { color: coins >= geode.cost ? textColor : '#EF4444' },
                    ]}
                  >
                    {geode.cost}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={textSecondaryColor} />
            </Card>
          </Pressable>
        ))}
      </ScrollView>

      {/* Reward Modal */}
      <Modal
        visible={showRewardModal}
        transparent
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContent,
              {
                backgroundColor,
                transform: [{ scale: modalScaleAnim }],
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🎉 Félicitations !</Text>
              <Text style={[styles.modalSubtitle, { color: textSecondaryColor }]}>
                Vous avez obtenu {openedGems.length} pierre{openedGems.length > 1 ? 's' : ''} !
              </Text>
            </View>

            <ScrollView style={styles.gemsScroll}>
              {openedGems.map((gem, index) => (
                <GemCard key={`${gem.id}-${index}`} gem={gem} showValue={false} />
              ))}
            </ScrollView>

            <Pressable
              style={[styles.closeButton, { backgroundColor: primaryColor }]}
              onPress={handleCloseModal}
            >
              <Text style={styles.closeButtonText}>Fermer</Text>
            </Pressable>
          </Animated.View>
        </View>
      </Modal>
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
  selectedContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  geodeDisplay: {
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowEffect: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    opacity: 0.5,
  },
  bigGeode: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  bigGeodeEmoji: {
    fontSize: 64,
  },
  selectedName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  selectedInfo: {
    fontSize: 14,
    marginBottom: 16,
  },
  openButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  openButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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
    marginBottom: 12,
  },
  geodeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
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
    marginBottom: 2,
  },
  geodeDetails: {
    fontSize: 12,
    marginBottom: 4,
  },
  costRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  geodeCost: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    maxHeight: '70%',
    borderRadius: 20,
    padding: 24,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
  },
  gemsScroll: {
    maxHeight: 300,
    marginBottom: 20,
  },
  closeButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
