import React, { useMemo } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { LocationCard } from '@/components/LocationCard';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useFavorites } from '@/hooks/useFavorites';
import { MOCK_LOCATIONS } from '@/services/locationService';

export default function FavoritesScreen() {
  const { isFavorite, toggleFavorite } = useFavorites();
  const iconColor = useThemeColor({}, 'icon');

  const favoriteLocations = useMemo(() => {
    return MOCK_LOCATIONS.filter((loc) => isFavorite(loc.id)).map((loc) => ({
      ...loc,
      isFavorite: true,
    }));
  }, [isFavorite]);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Mes Favoris
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          {favoriteLocations.length} lieu{favoriteLocations.length > 1 ? 'x' : ''} favori{favoriteLocations.length > 1 ? 's' : ''}
        </ThemedText>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.locationsContainer}
        showsVerticalScrollIndicator={false}
      >
        {favoriteLocations.length > 0 ? (
          favoriteLocations.map((location) => (
            <LocationCard
              key={location.id}
              location={location}
              onFavoritePress={() => toggleFavorite(location.id)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="heart-outline" size={64} color={iconColor} style={styles.emptyIcon} />
            <ThemedText style={styles.emptyText}>
              Aucun favori
            </ThemedText>
            <ThemedText style={styles.emptySubtext}>
              Explorez des lieux et ajoutez-les à vos favoris
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
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  scrollView: {
    flex: 1,
  },
  locationsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.3,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
