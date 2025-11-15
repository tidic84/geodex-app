import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@geodex_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavorites(new Set(JSON.parse(stored)));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveFavorites = async (newFavorites: Set<string>) => {
    try {
      await AsyncStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(Array.from(newFavorites))
      );
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const toggleFavorite = (locationId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(locationId)) {
        newFavorites.delete(locationId);
      } else {
        newFavorites.add(locationId);
      }
      saveFavorites(newFavorites);
      return newFavorites;
    });
  };

  const isFavorite = (locationId: string): boolean => {
    return favorites.has(locationId);
  };

  return {
    favorites,
    isLoading,
    toggleFavorite,
    isFavorite,
  };
}
