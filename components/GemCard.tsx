import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Card } from './Card';
import { Gem, RARITY_COLORS } from '@/services/gemService';

type GemCardProps = {
  gem: Gem;
  quantity?: number;
  onPress?: () => void;
  onSell?: () => void;
  showValue?: boolean;
};

export function GemCard({ gem, quantity, onPress, onSell, showValue = true }: GemCardProps) {
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const rarityColor = RARITY_COLORS[gem.rarity];

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={[styles.gemIcon, { backgroundColor: `${gem.color}30` }]}>
        <Text style={styles.gemEmoji}>{gem.icon}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.name, { color: textColor }]}>{gem.name}</Text>
          {quantity !== undefined && quantity > 1 && (
            <View style={[styles.quantityBadge, { backgroundColor: rarityColor }]}>
              <Text style={styles.quantityText}>×{quantity}</Text>
            </View>
          )}
        </View>

        <View style={[styles.rarityBadge, { backgroundColor: `${rarityColor}20` }]}>
          <Text style={[styles.rarityText, { color: rarityColor }]}>
            {gem.rarity.toUpperCase()}
          </Text>
        </View>

        <Text style={[styles.description, { color: textSecondaryColor }]} numberOfLines={1}>
          {gem.description}
        </Text>

        {showValue && (
          <View style={styles.valueContainer}>
            <Ionicons name="cash" size={14} color="#F59E0B" />
            <Text style={[styles.value, { color: textColor }]}>{gem.value} pièces</Text>
          </View>
        )}
      </View>

      {onSell && quantity && quantity > 0 && (
        <Pressable
          onPress={quantity > 1 ? onSell : undefined}
          style={[styles.sellButton, quantity === 1 && styles.sellButtonDisabled]}
          hitSlop={8}
          disabled={quantity === 1}
        >
          <Ionicons
            name={quantity === 1 ? "lock-closed" : "cash-outline"}
            size={24}
            color={quantity === 1 ? textSecondaryColor : "#10B981"}
          />
        </Pressable>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 16,
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
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  name: {
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
  description: {
    fontSize: 13,
    marginBottom: 4,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
  },
  sellButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#10B98120',
  },
  sellButtonDisabled: {
    backgroundColor: '#6B728020',
    opacity: 0.6,
  },
});
