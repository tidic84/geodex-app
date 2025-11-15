import React, { useState, useMemo } from 'react';
import { StyleSheet, ScrollView, View, Pressable } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { SearchBar } from '@/components/SearchBar';
import { LocationCard, Location } from '@/components/LocationCard';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useFavorites } from '@/hooks/useFavorites';
import {
  MOCK_LOCATIONS,
  CATEGORIES,
  filterLocationsByCategory,
  searchLocations,
  sortLocationsByDistance,
} from '@/services/locationService';

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const { isFavorite, toggleFavorite } = useFavorites();

  const backgroundColor = useThemeColor({}, 'background');
  const primaryColor = useThemeColor({}, 'primary');
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');

  const filteredLocations = useMemo(() => {
    const locationsWithFavorites = MOCK_LOCATIONS.map((loc) => ({
      ...loc,
      isFavorite: isFavorite(loc.id),
    }));

    let locations = filterLocationsByCategory(locationsWithFavorites, selectedCategory);
    locations = searchLocations(locations, searchQuery);
    locations = sortLocationsByDistance(locations);

    return locations;
  }, [searchQuery, selectedCategory, isFavorite]);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Découvrir
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          {filteredLocations.length} lieu{filteredLocations.length > 1 ? 'x' : ''} trouvé{filteredLocations.length > 1 ? 's' : ''}
        </ThemedText>
      </View>

      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Rechercher un lieu..."
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {CATEGORIES.map((category) => (
          <Pressable
            key={category}
            onPress={() => setSelectedCategory(category)}
            style={[
              styles.categoryChip,
              {
                backgroundColor:
                  selectedCategory === category
                    ? primaryColor
                    : backgroundColor,
                borderColor: borderColor,
              },
            ]}
          >
            <ThemedText
              style={[
                styles.categoryText,
                {
                  color:
                    selectedCategory === category
                      ? '#FFFFFF'
                      : textColor,
                },
              ]}
            >
              {category}
            </ThemedText>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.locationsContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredLocations.length > 0 ? (
          filteredLocations.map((location) => (
            <LocationCard
              key={location.id}
              location={location}
              onFavoritePress={() => toggleFavorite(location.id)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyText}>
              Aucun lieu trouvé
            </ThemedText>
            <ThemedText style={styles.emptySubtext}>
              Essayez de modifier vos filtres
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
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
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.6,
  },
});
