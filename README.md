# GeoDex 🪨💎

Un jeu mobile de collection de pierres précieuses ! Ouvrez des géodes pour découvrir des gemmes rares et complétez votre collection.

## 🎮 Concept du jeu

GeoDex est un jeu d'ouverture de géodes où vous collectionnez des pierres précieuses. Achetez des géodes, ouvrez-les pour découvrir des gemmes de différentes raretés, et complétez votre collection !

### Comment jouer

1. **Ouvrir** - Choisissez une géode et cliquez sur le marteau pour l'ouvrir
2. **Collectionner** - Découvrez des pierres précieuses de différentes raretés
3. **Vendre** - Vendez vos doublons pour obtenir des pièces
4. **Acheter** - Utilisez vos pièces pour acheter de nouvelles géodes

## 🪨 Types de Géodes

- **Géode Commune** (50 pièces) - 1-3 pierres communes/uncommon
- **Géode Rare** (200 pièces) - 2-4 pierres communes/uncommon/rare
- **Géode Précieuse** (500 pièces) - 3-5 pierres uncommon/rare/epic
- **Géode Épique** (1500 pièces) - 4-6 pierres rare/epic/legendary
- **Géode Légendaire** (5000 pièces) - 5-8 pierres epic/legendary

## 💎 Raretés des Pierres

- **Common** (gris) - Quartz, Calcite
- **Uncommon** (vert) - Améthyste, Citrine, Aigue-marine
- **Rare** (bleu) - Topaze, Émeraude, Saphir
- **Epic** (violet) - Rubis, Alexandrite
- **Legendary** (orange) - Diamant, Opale Noire

## 📱 Fonctionnalités

- **Écran Ouvrir** 🔨 - Ouvrez des géodes et découvrez des pierres précieuses
- **Écran Collection** 📚 - Consultez toutes les pierres que vous avez découvertes
- **Écran Boutique** 🏪 - Achetez de nouvelles géodes avec vos pièces
- **Écran Profil** 👤 - Suivez vos statistiques et succès
- **Mode Sombre** 🌙 - Interface adaptative
- **Persistance** 💾 - Votre progression est sauvegardée localement

## 🎨 Technologies

- **Expo SDK 52** - Framework React Native
- **TypeScript** - Typage statique
- **AsyncStorage** - Sauvegarde locale
- **React Native Reanimated** - Animations fluides
- **Ionicons** - Icônes modernes

## 🚀 Installation

1. **Installer les dépendances**
   ```bash
   npm install
   ```

2. **Lancer l'application**
   ```bash
   npm start
   ```

3. **Ouvrir dans Expo Go**
   - Scannez le QR code avec Expo Go (iOS/Android)
   - Ou appuyez sur `w` pour ouvrir dans le navigateur

## 📦 Scripts disponibles

- `npm start` - Démarre le serveur de développement
- `npm run android` - Lance sur Android
- `npm run ios` - Lance sur iOS
- `npm run web` - Lance sur le web
- `npm test` - Lance les tests

## 🎯 Architecture

```
geodex-app/
├── app/                        # Routes (Expo Router)
│   ├── (tabs)/                # Écrans avec navigation
│   │   ├── index.tsx          # Ouvrir des géodes
│   │   ├── explore.tsx        # Collection
│   │   ├── favorites.tsx      # Boutique
│   │   └── profile.tsx        # Profil & Stats
│   └── _layout.tsx            # Layout racine
├── components/                 # Composants UI
│   ├── Card.tsx               # Carte UI réutilisable
│   ├── GemCard.tsx            # Carte de pierre précieuse
│   ├── GeodeCard.tsx          # Carte de géode
│   └── ...
├── hooks/                      # Hooks personnalisés
│   └── useInventory.ts        # Gestion inventaire & pièces
├── services/                   # Logique métier
│   └── gemService.ts          # Système de géodes et gemmes
└── constants/                  # Constantes
    └── Colors.ts              # Palette de couleurs
```

## 🏆 Succès

- **Première Pierre** - Ouvrir votre première géode
- **Collectionneur** - Collecter 10 pierres différentes
- **Expert** - Compléter 100% de la collection (12 pierres uniques)

## 🎲 Probabilités

Le système utilise des poids de rareté pour déterminer les drops :
- Common: 50%
- Uncommon: 30%
- Rare: 15%
- Epic: 4%
- Legendary: 1%

Les probabilités sont ajustées selon le type de géode ouvert.

## 🔮 Fonctionnalités futures

- [ ] Système de quêtes quotidiennes
- [ ] Récompenses journalières
- [ ] Échanges entre joueurs
- [ ] Événements saisonniers
- [ ] Nouvelles géodes et pierres
- [ ] Achievements supplémentaires
- [ ] Mode multijoueur

## 📄 Licence

MIT

## 🙏 Crédits

- Framework: Expo
- Icônes: Ionicons
- Inspiration: Jeux de gacha et collection
