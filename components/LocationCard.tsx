import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Card } from './Card';

export type Location = {
  id: string;
  name: string;
  category: string;
  address: string;
  distance?: number;
  rating?: number;
  isFavorite?: boolean;
  coordinates: {
    latitude: number;
    longitude: number;
  };
};

type LocationCardProps = {
  location: Location;
  onPress?: () => void;
  onFavoritePress?: () => void;
};

export function LocationCard({ location, onPress, onFavoritePress }: LocationCardProps) {
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const primaryColor = useThemeColor({}, 'primary');
  const warningColor = useThemeColor({}, 'warning');

  const getCategoryIcon = (category: string): keyof typeof Ionicons.glyphMap => {
    const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
      restaurant: 'restaurant',
      cafe: 'cafe',
      park: 'leaf',
      museum: 'business',
      shopping: 'cart',
      hotel: 'bed',
      entertainment: 'game-controller',
      sports: 'basketball',
      health: 'medical',
      education: 'school',
      default: 'location',
    };
    return icons[category.toLowerCase()] || icons.default;
  };

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${primaryColor}15` }]}>
          <Ionicons
            name={getCategoryIcon(location.category)}
            size={24}
            color={primaryColor}
          />
        </View>

        <View style={styles.headerContent}>
          <Text style={[styles.name, { color: textColor }]} numberOfLines={1}>
            {location.name}
          </Text>
          <Text style={[styles.category, { color: textSecondaryColor }]}>
            {location.category}
          </Text>
        </View>

        <Pressable
          onPress={onFavoritePress}
          hitSlop={8}
        >
          <Ionicons
            name={location.isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={location.isFavorite ? '#EF4444' : textSecondaryColor}
          />
        </Pressable>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={16} color={textSecondaryColor} />
          <Text style={[styles.detailText, { color: textSecondaryColor }]} numberOfLines={1}>
            {location.address}
          </Text>
        </View>

        <View style={styles.footer}>
          {location.distance !== undefined && (
            <View style={styles.detailRow}>
              <Ionicons name="navigate-outline" size={16} color={textSecondaryColor} />
              <Text style={[styles.detailText, { color: textSecondaryColor }]}>
                {location.distance < 1
                  ? `${Math.round(location.distance * 1000)}m`
                  : `${location.distance.toFixed(1)}km`}
              </Text>
            </View>
          )}

          {location.rating !== undefined && (
            <View style={styles.detailRow}>
              <Ionicons name="star" size={16} color={warningColor} />
              <Text style={[styles.detailText, { color: textColor }]}>
                {location.rating.toFixed(1)}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  category: {
    fontSize: 14,
  },
  details: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    gap: 16,
  },
});
