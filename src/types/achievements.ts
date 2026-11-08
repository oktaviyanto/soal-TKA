export type BadgeRarity = 'Umum' | 'Langka' | 'Epik' | 'Legendaris';

export type AchievementCategory = 'performa' | 'kecepatan' | 'konsistensi' | 'spesial';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  rarity: BadgeRarity;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  unlockedAt?: string;
  criteriaDescription: string;
}
