import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Card } from './Card';
import { GeodeType } from '@/services/gemService';

type GeodeCardProps = {
  geode: GeodeType;
  onPress?: () => void;
  showCost?: boolean;
  coins?: number;
};

export function GeodeCard({ geode, onPress, showCost = true, coins }: GeodeCardProps) {
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const canAfford = coins !== undefined ? coins >= geode.cost : true;

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={[styles.geodeIcon, { backgroundColor: geode.color }]}>
        <Text style={styles.geodeEmoji}>🪨</Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.name, { color: textColor }]}>{geode.name}</Text>
        <Text style={[styles.rarity, { color: textSecondaryColor }]}>
          {geode.minGems}-{geode.maxGems} pierres
        </Text>

        {showCost && (
          <View style={styles.costContainer}>
            <Ionicons name="cash" size={16} color={canAfford ? '#F59E0B' : '#EF4444'} />
            <Text style={[styles.cost, { color: canAfford ? textColor : '#EF4444' }]}>
              {geode.cost}
            </Text>
          </View>
        )}
      </View>

      {onPress && (
        <Ionicons name="chevron-forward" size={24} color={textSecondaryColor} />
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
  geodeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  geodeEmoji: {
    fontSize: 32,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  rarity: {
    fontSize: 14,
    marginBottom: 4,
  },
  costContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cost: {
    fontSize: 16,
    fontWeight: '600',
  },
});
