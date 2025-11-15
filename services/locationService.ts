import { Location } from '@/components/LocationCard';

// Données de démonstration pour l'application
export const MOCK_LOCATIONS: Location[] = [
  {
    id: '1',
    name: 'Tour Eiffel',
    category: 'Monument',
    address: 'Champ de Mars, 5 Av. Anatole France, 75007 Paris',
    distance: 2.5,
    rating: 4.7,
    coordinates: { latitude: 48.8584, longitude: 2.2945 },
  },
  {
    id: '2',
    name: 'Musée du Louvre',
    category: 'Museum',
    address: 'Rue de Rivoli, 75001 Paris',
    distance: 1.8,
    rating: 4.8,
    coordinates: { latitude: 48.8606, longitude: 2.3376 },
  },
  {
    id: '3',
    name: 'Café de Flore',
    category: 'Cafe',
    address: '172 Boulevard Saint-Germain, 75006 Paris',
    distance: 0.8,
    rating: 4.3,
    coordinates: { latitude: 48.8542, longitude: 2.3321 },
  },
  {
    id: '4',
    name: 'Jardin du Luxembourg',
    category: 'Park',
    address: '75006 Paris',
    distance: 1.2,
    rating: 4.6,
    coordinates: { latitude: 48.8462, longitude: 2.3372 },
  },
  {
    id: '5',
    name: 'Notre-Dame de Paris',
    category: 'Monument',
    address: '6 Parvis Notre-Dame - Pl. Jean-Paul II, 75004 Paris',
    distance: 2.1,
    rating: 4.7,
    coordinates: { latitude: 48.8530, longitude: 2.3499 },
  },
  {
    id: '6',
    name: 'Le Marais',
    category: 'Shopping',
    address: 'Le Marais, 75004 Paris',
    distance: 1.5,
    rating: 4.5,
    coordinates: { latitude: 48.8584, longitude: 2.3622 },
  },
  {
    id: '7',
    name: 'Sacré-Cœur',
    category: 'Monument',
    address: '35 Rue du Chevalier de la Barre, 75018 Paris',
    distance: 3.2,
    rating: 4.6,
    coordinates: { latitude: 48.8867, longitude: 2.3431 },
  },
  {
    id: '8',
    name: 'Restaurant Le Jules Verne',
    category: 'Restaurant',
    address: 'Avenue Gustave Eiffel, 75007 Paris',
    distance: 2.6,
    rating: 4.4,
    coordinates: { latitude: 48.8583, longitude: 2.2944 },
  },
  {
    id: '9',
    name: "Musée d'Orsay",
    category: 'Museum',
    address: '1 Rue de la Légion d\'Honneur, 75007 Paris',
    distance: 1.9,
    rating: 4.7,
    coordinates: { latitude: 48.8600, longitude: 2.3266 },
  },
  {
    id: '10',
    name: 'Arc de Triomphe',
    category: 'Monument',
    address: 'Place Charles de Gaulle, 75008 Paris',
    distance: 3.5,
    rating: 4.6,
    coordinates: { latitude: 48.8738, longitude: 2.2950 },
  },
];

export const CATEGORIES = [
  'Tous',
  'Monument',
  'Museum',
  'Cafe',
  'Restaurant',
  'Park',
  'Shopping',
];

export function filterLocationsByCategory(
  locations: Location[],
  category: string
): Location[] {
  if (category === 'Tous') {
    return locations;
  }
  return locations.filter((loc) => loc.category === category);
}

export function searchLocations(
  locations: Location[],
  query: string
): Location[] {
  if (!query.trim()) {
    return locations;
  }

  const lowerQuery = query.toLowerCase();
  return locations.filter(
    (loc) =>
      loc.name.toLowerCase().includes(lowerQuery) ||
      loc.category.toLowerCase().includes(lowerQuery) ||
      loc.address.toLowerCase().includes(lowerQuery)
  );
}

export function sortLocationsByDistance(locations: Location[]): Location[] {
  return [...locations].sort((a, b) => {
    const distA = a.distance ?? Infinity;
    const distB = b.distance ?? Infinity;
    return distA - distB;
  });
}

export function sortLocationsByRating(locations: Location[]): Location[] {
  return [...locations].sort((a, b) => {
    const ratingA = a.rating ?? 0;
    const ratingB = b.rating ?? 0;
    return ratingB - ratingA;
  });
}
