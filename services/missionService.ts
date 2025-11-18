export type MissionType =
  | 'open_geodes'
  | 'collect_gems'
  | 'collect_unique'
  | 'collect_rarity'
  | 'accumulate_coins';

export type MissionStatus = 'active' | 'completed' | 'claimed';

export type Mission = {
  id: string;
  type: MissionType;
  title: string;
  description: string;
  target: number;
  reward: number;
  icon: string;
  rarity?: string; // For collect_rarity missions
};

export const MISSIONS: Mission[] = [
  // Beginner missions
  {
    id: 'open_1',
    type: 'open_geodes',
    title: 'Premier Pas',
    description: 'Ouvrir votre première géode',
    target: 1,
    reward: 100,
    icon: '🎯',
  },
  {
    id: 'collect_5',
    type: 'collect_gems',
    title: 'Collectionneur Débutant',
    description: 'Collecter 5 pierres précieuses',
    target: 5,
    reward: 150,
    icon: '💎',
  },
  {
    id: 'unique_3',
    type: 'collect_unique',
    title: 'Diversité',
    description: 'Collecter 3 pierres différentes',
    target: 3,
    reward: 200,
    icon: '🌈',
  },

  // Intermediate missions
  {
    id: 'open_10',
    type: 'open_geodes',
    title: 'Explorateur',
    description: 'Ouvrir 10 géodes',
    target: 10,
    reward: 300,
    icon: '🔍',
  },
  {
    id: 'collect_25',
    type: 'collect_gems',
    title: 'Collectionneur Averti',
    description: 'Collecter 25 pierres précieuses',
    target: 25,
    reward: 500,
    icon: '💰',
  },
  {
    id: 'unique_6',
    type: 'collect_unique',
    title: 'Amateur de Variété',
    description: 'Collecter 6 pierres différentes',
    target: 6,
    reward: 400,
    icon: '✨',
  },
  {
    id: 'rare_common',
    type: 'collect_rarity',
    title: 'Chasseur de Communes',
    description: 'Collecter 10 pierres communes',
    target: 10,
    reward: 250,
    icon: '⚪',
    rarity: 'common',
  },

  // Advanced missions
  {
    id: 'open_50',
    type: 'open_geodes',
    title: 'Expert en Géodes',
    description: 'Ouvrir 50 géodes',
    target: 50,
    reward: 1000,
    icon: '🏆',
  },
  {
    id: 'collect_100',
    type: 'collect_gems',
    title: 'Grand Collectionneur',
    description: 'Collecter 100 pierres précieuses',
    target: 100,
    reward: 1500,
    icon: '👑',
  },
  {
    id: 'unique_all',
    type: 'collect_unique',
    title: 'Maître Collectionneur',
    description: 'Collecter les 12 pierres différentes',
    target: 12,
    reward: 2000,
    icon: '🎖️',
  },
  {
    id: 'rare_uncommon',
    type: 'collect_rarity',
    title: 'Chasseur de Peu Communes',
    description: 'Collecter 8 pierres peu communes',
    target: 8,
    reward: 600,
    icon: '🟢',
    rarity: 'uncommon',
  },
  {
    id: 'rare_rare',
    type: 'collect_rarity',
    title: 'Chasseur de Rares',
    description: 'Collecter 5 pierres rares',
    target: 5,
    reward: 800,
    icon: '🔵',
    rarity: 'rare',
  },
  {
    id: 'rare_epic',
    type: 'collect_rarity',
    title: 'Chasseur d\'Épiques',
    description: 'Collecter 3 pierres épiques',
    target: 3,
    reward: 1200,
    icon: '🟣',
    rarity: 'epic',
  },
  {
    id: 'rare_legendary',
    type: 'collect_rarity',
    title: 'Chasseur de Légendaires',
    description: 'Collecter 1 pierre légendaire',
    target: 1,
    reward: 2500,
    icon: '🟠',
    rarity: 'legendary',
  },

  // Wealth missions
  {
    id: 'coins_1000',
    type: 'accumulate_coins',
    title: 'Économe',
    description: 'Accumuler 1000 pièces',
    target: 1000,
    reward: 500,
    icon: '💵',
  },
  {
    id: 'coins_5000',
    type: 'accumulate_coins',
    title: 'Riche',
    description: 'Accumuler 5000 pièces',
    target: 5000,
    reward: 1500,
    icon: '💸',
  },
  {
    id: 'coins_10000',
    type: 'accumulate_coins',
    title: 'Millionnaire',
    description: 'Accumuler 10000 pièces',
    target: 10000,
    reward: 3000,
    icon: '🤑',
  },
];
