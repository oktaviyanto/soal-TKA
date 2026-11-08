import React from 'react';
import { Achievement, BadgeRarity } from '../types/achievements';
import { Lock, CheckCircle2 } from 'lucide-react';

interface AchievementBadgeCardProps {
  badge: Achievement;
  onClick?: () => void;
}

const RARITY_COLORS: Record<BadgeRarity, { text: string; bg: string; border: string; glow: string }> = {
  Umum: {
    text: 'text-slate-600 dark:text-slate-300',
    bg: 'bg-slate-100 dark:bg-slate-800',
    border: 'border-slate-200 dark:border-slate-700',
    glow: 'group-hover:border-slate-400',
  },
  Langka: {
    text: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/60',
    border: 'border-blue-200 dark:border-blue-800',
    glow: 'group-hover:border-blue-500 group-hover:shadow-blue-500/10',
  },
  Epik: {
    text: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-950/60',
    border: 'border-purple-200 dark:border-purple-800',
    glow: 'group-hover:border-purple-500 group-hover:shadow-purple-500/10',
  },
  Legendaris: {
    text: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/60',
    border: 'border-amber-200 dark:border-amber-800',
    glow: 'group-hover:border-amber-500 group-hover:shadow-amber-500/20',
  },
};

export const AchievementBadgeCard: React.FC<AchievementBadgeCardProps> = ({ badge, onClick }) => {
  const rarityStyle = RARITY_COLORS[badge.rarity] || RARITY_COLORS.Umum;
  const progressPercent = Math.min(100, Math.round((badge.progress / badge.maxProgress) * 100));

  return (
    <div
      onClick={onClick}
      className={`relative p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between group ${
        badge.unlocked
          ? `bg-white dark:bg-slate-900 ${rarityStyle.border} shadow-xs hover:shadow-md ${rarityStyle.glow}`
          : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 opacity-80 hover:opacity-100'
      }`}
    >
      <div>
        {/* Top Header: Badge Icon & Status Chip */}
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform duration-200 group-hover:scale-110 shadow-xs ${
              badge.unlocked
                ? rarityStyle.bg
                : 'bg-slate-200/70 dark:bg-slate-700/60 grayscale opacity-60'
            }`}
          >
            {badge.icon}
          </div>

          <div className="flex flex-col items-end gap-1">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${rarityStyle.bg} ${rarityStyle.text} ${rarityStyle.border}`}
            >
              {badge.rarity}
            </span>

            {badge.unlocked ? (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-100 dark:fill-emerald-950" />
                <span>Terbuka</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                <Lock className="w-3 h-3" />
                <span>Terkunci</span>
              </span>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {badge.title}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
          {badge.description}
        </p>
      </div>

      {/* Bottom Progress Bar */}
      <div className="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between text-[11px] font-medium mb-1 text-slate-500">
          <span>Target Milestone</span>
          <span className="font-math font-semibold text-slate-700 dark:text-slate-300">
            {badge.progress} / {badge.maxProgress}
          </span>
        </div>

        <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              badge.unlocked
                ? 'bg-emerald-500'
                : 'bg-indigo-600'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
