export type GemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export type Gem = {
  id: string;
  name: string;
  rarity: GemRarity;
  color: string;
  value: number;
  description: string;
  icon: string;
};

export type GeodeType = {
  id: string;
  name: string;
  rarity: GemRarity;
  cost: number;
  color: string;
  minGems: number;
  maxGems: number;
  possibleGems: GemRarity[];
};

export const GEMS: Gem[] = [
  // Common Gems
  {
    id: 'quartz',
    name: 'Quartz',
    rarity: 'common',
    color: '#E0E0E0',
    value: 10,
    description: 'Un cristal transparent commun',
    icon: '💎',
  },
  {
    id: 'calcite',
    name: 'Calcite',
    rarity: 'common',
    color: '#F5F5DC',
    value: 12,
    description: 'Un minéral blanc cassé',
    icon: '🤍',
  },
  // Uncommon Gems
  {
    id: 'amethyst',
    name: 'Améthyste',
    rarity: 'uncommon',
    color: '#9966CC',
    value: 50,
    description: 'Une pierre violette magnifique',
    icon: '💜',
  },
  {
    id: 'citrine',
    name: 'Citrine',
    rarity: 'uncommon',
    color: '#FFA500',
    value: 55,
    description: 'Un quartz jaune doré',
    icon: '🧡',
  },
  {
    id: 'aquamarine',
    name: 'Aigue-marine',
    rarity: 'uncommon',
    color: '#7FFFD4',
    value: 60,
    description: 'Une gemme bleue cristalline',
    icon: '💙',
  },
  // Rare Gems
  {
    id: 'topaz',
    name: 'Topaze',
    rarity: 'rare',
    color: '#FFD700',
    value: 150,
    description: 'Une pierre précieuse dorée',
    icon: '✨',
  },
  {
    id: 'emerald',
    name: 'Émeraude',
    rarity: 'rare',
    color: '#50C878',
    value: 200,
    description: 'Une gemme verte étincelante',
    icon: '💚',
  },
  {
    id: 'sapphire',
    name: 'Saphir',
    rarity: 'rare',
    color: '#0F52BA',
    value: 220,
    description: 'Une pierre bleue royale',
    icon: '💙',
  },
  // Epic Gems
  {
    id: 'ruby',
    name: 'Rubis',
    rarity: 'epic',
    color: '#E0115F',
    value: 500,
    description: 'Une gemme rouge sang précieuse',
    icon: '❤️',
  },
  {
    id: 'alexandrite',
    name: 'Alexandrite',
    rarity: 'epic',
    color: '#CC00CC',
    value: 600,
    description: 'Une pierre qui change de couleur',
    icon: '🔮',
  },
  // Legendary Gems
  {
    id: 'diamond',
    name: 'Diamant',
    rarity: 'legendary',
    color: '#B9F2FF',
    value: 1000,
    description: 'La pierre la plus précieuse',
    icon: '💎',
  },
  {
    id: 'black-opal',
    name: 'Opale Noire',
    rarity: 'legendary',
    color: '#1C1C1C',
    value: 1200,
    description: 'Une gemme rare aux reflets arc-en-ciel',
    icon: '🌈',
  },
];

export const GEODE_TYPES: GeodeType[] = [
  {
    id: 'common-geode',
    name: 'Géode Commune',
    rarity: 'common',
    cost: 50,
    color: '#8B7355',
    minGems: 1,
    maxGems: 3,
    possibleGems: ['common', 'uncommon'],
  },
  {
    id: 'uncommon-geode',
    name: 'Géode Rare',
    rarity: 'uncommon',
    cost: 200,
    color: '#4A90E2',
    minGems: 2,
    maxGems: 4,
    possibleGems: ['common', 'uncommon', 'rare'],
  },
  {
    id: 'rare-geode',
    name: 'Géode Précieuse',
    rarity: 'rare',
    cost: 500,
    color: '#9B59B6',
    minGems: 3,
    maxGems: 5,
    possibleGems: ['uncommon', 'rare', 'epic'],
  },
  {
    id: 'epic-geode',
    name: 'Géode Épique',
    rarity: 'epic',
    cost: 1500,
    color: '#E74C3C',
    minGems: 4,
    maxGems: 6,
    possibleGems: ['rare', 'epic', 'legendary'],
  },
  {
    id: 'legendary-geode',
    name: 'Géode Légendaire',
    rarity: 'legendary',
    cost: 5000,
    color: '#F39C12',
    minGems: 5,
    maxGems: 8,
    possibleGems: ['epic', 'legendary'],
  },
];

export const RARITY_COLORS: Record<GemRarity, string> = {
  common: '#9E9E9E',
  uncommon: '#4CAF50',
  rare: '#2196F3',
  epic: '#9C27B0',
  legendary: '#FF9800',
};

export const RARITY_WEIGHTS: Record<GemRarity, number> = {
  common: 50,
  uncommon: 30,
  rare: 15,
  epic: 4,
  legendary: 1,
};

export function getGemsFromGeode(geodeType: GeodeType): Gem[] {
  const gemCount =
    Math.floor(Math.random() * (geodeType.maxGems - geodeType.minGems + 1)) +
    geodeType.minGems;

  const obtainedGems: Gem[] = [];

  for (let i = 0; i < gemCount; i++) {
    // Déterminer la rareté basée sur les possibilités de la géode
    const possibleRarities = geodeType.possibleGems;
    const weights = possibleRarities.map((r) => RARITY_WEIGHTS[r]);
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);

    let random = Math.random() * totalWeight;
    let selectedRarity: GemRarity = 'common';

    for (let j = 0; j < possibleRarities.length; j++) {
      random -= weights[j];
      if (random <= 0) {
        selectedRarity = possibleRarities[j];
        break;
      }
    }

    // Sélectionner une gemme aléatoire de cette rareté
    const gemsOfRarity = GEMS.filter((g) => g.rarity === selectedRarity);
    if (gemsOfRarity.length > 0) {
      const randomGem =
        gemsOfRarity[Math.floor(Math.random() * gemsOfRarity.length)];
      obtainedGems.push(randomGem);
    }
  }

  return obtainedGems;
}

export function getGemById(id: string): Gem | undefined {
  return GEMS.find((g) => g.id === id);
}

export function getGeodeById(id: string): GeodeType | undefined {
  return GEODE_TYPES.find((g) => g.id === id);
}
