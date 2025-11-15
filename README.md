# GeoDex 🗺️

Une application mobile moderne de découverte de lieux d'intérêt géographiques, construite avec Expo et React Native.

## 📱 Fonctionnalités

- **Carte Interactive** - Explorez les lieux sur une carte en temps réel avec des marqueurs personnalisés
- **Découverte** - Parcourez et recherchez des lieux par catégorie avec filtres intelligents
- **Favoris** - Sauvegardez vos lieux préférés pour un accès rapide
- **Profil** - Suivez vos statistiques d'exploration et gérez vos paramètres
- **Mode Sombre** - Interface adaptative qui s'ajuste automatiquement à vos préférences système
- **Design Moderne** - Interface utilisateur épurée avec des composants cohérents et des icônes Ionicons

## 🏗️ Architecture

L'application est construite avec une architecture moderne et modulaire :

```
geodex-app/
├── app/                        # Routing (Expo Router)
│   ├── (tabs)/                # Écrans avec navigation par onglets
│   │   ├── index.tsx          # Écran Carte
│   │   ├── explore.tsx        # Écran Découvrir
│   │   ├── favorites.tsx      # Écran Favoris
│   │   └── profile.tsx        # Écran Profil
│   ├── _layout.tsx            # Layout racine
│   └── +not-found.tsx         # Page 404
├── components/                 # Composants réutilisables
│   ├── Button.tsx             # Bouton personnalisé
│   ├── Card.tsx               # Carte UI
│   ├── LocationCard.tsx       # Carte de lieu
│   ├── SearchBar.tsx          # Barre de recherche
│   ├── ThemedText.tsx         # Texte avec thème
│   └── ThemedView.tsx         # Vue avec thème
├── constants/                  # Constantes
│   └── Colors.ts              # Palette de couleurs
├── hooks/                      # Hooks personnalisés
│   ├── useFavorites.ts        # Gestion des favoris
│   ├── useColorScheme.ts      # Détection du thème
│   └── useThemeColor.ts       # Couleurs du thème
└── services/                   # Services métier
    └── locationService.ts     # Logique de gestion des lieux
```

## 🎨 Technologies

- **Expo SDK 52** - Framework React Native
- **TypeScript** - Typage statique
- **React Native Maps** - Cartes interactives
- **AsyncStorage** - Persistance locale
- **Expo Location** - Géolocalisation
- **Ionicons** - Icônes modernes
- **Expo Router** - Navigation basée sur les fichiers

## 🚀 Démarrage

1. **Installer les dépendances**
   ```bash
   npm install
   ```

2. **Lancer l'application**
   ```bash
   npm start
   ```

3. **Ouvrir dans Expo Go**
   - Scannez le QR code avec l'app Expo Go (iOS/Android)
   - Ou appuyez sur `w` pour ouvrir dans le navigateur

## 📦 Scripts disponibles

- `npm start` - Démarre le serveur de développement
- `npm run android` - Lance sur Android
- `npm run ios` - Lance sur iOS
- `npm run web` - Lance sur le web
- `npm test` - Lance les tests
- `npm run lint` - Vérifie le code

## 🎯 Fonctionnalités à venir

- [ ] Intégration avec des APIs de lieux réels (Google Places, Foursquare, etc.)
- [ ] Géolocalisation en temps réel
- [ ] Itinéraires et navigation
- [ ] Avis et notes des utilisateurs
- [ ] Partage de lieux
- [ ] Mode hors-ligne
- [ ] Filtres avancés
- [ ] Notifications de proximité

## 🔧 Configuration

### Permissions

L'application nécessite les permissions suivantes :
- **Location** - Pour afficher votre position sur la carte
- **Internet** - Pour charger les données des lieux

### Variables d'environnement

Pour utiliser des services tiers, créez un fichier `.env` :

```env
GOOGLE_MAPS_API_KEY=votre_clé_api
```

## 📱 Déploiement

### Build iOS

```bash
npx eas build --platform ios
```

### Build Android

```bash
npx eas build --platform android
```

Pour plus de détails, consultez la [documentation Expo](https://docs.expo.dev/build/introduction/).

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

MIT

## 🙏 Remerciements

- Expo pour le framework
- Icônes par Ionicons
- Cartes par react-native-maps
