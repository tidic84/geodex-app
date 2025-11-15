import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useFavorites } from '@/hooks/useFavorites';
import { MOCK_LOCATIONS } from '@/services/locationService';
import { Location } from '@/components/LocationCard';

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const primaryColor = useThemeColor({}, 'primary');

  const initialRegion = {
    latitude: 48.8566,
    longitude: 2.3522,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  const handleMarkerPress = (location: Location) => {
    setSelectedLocation(location);
    mapRef.current?.animateToRegion({
      latitude: location.coordinates.latitude,
      longitude: location.coordinates.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  const handleRecenterPress = () => {
    mapRef.current?.animateToRegion(initialRegion);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {MOCK_LOCATIONS.map((location) => (
          <Marker
            key={location.id}
            coordinate={location.coordinates}
            onPress={() => handleMarkerPress(location)}
          >
            <View style={[styles.marker, { backgroundColor: primaryColor }]}>
              <Ionicons name="location" size={20} color="#FFFFFF" />
            </View>
          </Marker>
        ))}
      </MapView>

      <View style={styles.header}>
        <ThemedView style={styles.headerContent}>
          <ThemedText type="title" style={styles.title}>
            GeoDex
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Découvrez les lieux autour de vous
          </ThemedText>
        </ThemedView>
      </View>

      <Pressable
        style={[styles.recenterButton, { backgroundColor: primaryColor }]}
        onPress={handleRecenterPress}
      >
        <Ionicons name="locate" size={24} color="#FFFFFF" />
      </Pressable>

      {selectedLocation && (
        <View style={styles.cardContainer}>
          <Card style={styles.locationCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardInfo}>
                <Text style={[styles.locationName, { color: textColor }]}>
                  {selectedLocation.name}
                </Text>
                <Text style={[styles.locationCategory, { color: textSecondaryColor }]}>
                  {selectedLocation.category}
                </Text>
              </View>

              <Pressable
                onPress={() => toggleFavorite(selectedLocation.id)}
                hitSlop={8}
              >
                <Ionicons
                  name={isFavorite(selectedLocation.id) ? 'heart' : 'heart-outline'}
                  size={28}
                  color={isFavorite(selectedLocation.id) ? '#EF4444' : textSecondaryColor}
                />
              </Pressable>
            </View>

            <View style={styles.cardDetails}>
              <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={16} color={textSecondaryColor} />
                <Text style={[styles.detailText, { color: textSecondaryColor }]} numberOfLines={2}>
                  {selectedLocation.address}
                </Text>
              </View>

              {selectedLocation.distance !== undefined && (
                <View style={styles.detailRow}>
                  <Ionicons name="navigate-outline" size={16} color={textSecondaryColor} />
                  <Text style={[styles.detailText, { color: textSecondaryColor }]}>
                    {selectedLocation.distance < 1
                      ? `${Math.round(selectedLocation.distance * 1000)}m`
                      : `${selectedLocation.distance.toFixed(1)}km`}
                  </Text>
                </View>
              )}

              {selectedLocation.rating !== undefined && (
                <View style={styles.detailRow}>
                  <Ionicons name="star" size={16} color="#F59E0B" />
                  <Text style={[styles.detailText, { color: textColor }]}>
                    {selectedLocation.rating.toFixed(1)} / 5
                  </Text>
                </View>
              )}
            </View>

            <Pressable onPress={() => setSelectedLocation(null)} style={styles.closeButton}>
              <Ionicons name="close" size={20} color={textSecondaryColor} />
            </Pressable>
          </Card>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  headerContent: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  marker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  recenterButton: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
  },
  locationCard: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardInfo: {
    flex: 1,
    marginRight: 12,
  },
  locationName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  locationCategory: {
    fontSize: 14,
  },
  cardDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
  },
});
