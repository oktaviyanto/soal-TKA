import { Achievement } from '../types/achievements';
import { QuizResult } from '../types/geometry';

export const MASTER_ACHIEVEMENTS: Omit<Achievement, 'unlocked' | 'progress'>[] = [
  {
    id: 'ten_perfect_scores',
    title: '10 Perfect Scores',
    description: 'Raih skor sempurna 100 poin (20 butir soal benar) sebanyak 10 kali.',
    icon: '👑',
    category: 'performa',
    rarity: 'Legendaris',
    maxProgress: 10,
    criteriaDescription: 'Mendapatkan 10 kali skor 100/100 pada ujian',
  },
  {
    id: 'fast_solver',
    title: 'Fast Solver',
    description: 'Selesaikan ujian 20 butir soal dalam waktu di bawah 15 menit dengan skor minimal 80.',
    icon: '⚡',
    category: 'kecepatan',
    rarity: 'Epik',
    maxProgress: 1,
    criteriaDescription: 'Durasi < 15 menit & skor >= 80 poin',
  },
  {
    id: 'consistent_learner',
    title: 'Consistent Learner',
    description: 'Tunjukkan konsistensi belajar dengan menyelesaikan minimal 5 sesi latihan atau simulasi.',
    icon: '📚',
    category: 'konsistensi',
    rarity: 'Langka',
    maxProgress: 5,
    criteriaDescription: 'Menyelesaikan 5 sesi pengerjaan soal',
  },
  {
    id: 'circle_guru',
    title: 'Pakar Lingkaran',
    description: 'Kuasai seluruh soal Lingkaran (8 soal) dengan akurasi 100% dalam satu sesi ujian.',
    icon: '⭕',
    category: 'performa',
    rarity: 'Epik',
    maxProgress: 1,
    criteriaDescription: 'Akurasi 8/8 soal Lingkaran dalam satu sesi',
  },
  {
    id: 'space_architect',
    title: 'Arsitek Bangun Ruang',
    description: 'Jawab benar seluruh soal Bangun Ruang (12 soal) tanpa satu pun kesalahan dalam satu sesi.',
    icon: '🏛️',
    category: 'performa',
    rarity: 'Epik',
    maxProgress: 1,
    criteriaDescription: 'Akurasi 12/12 soal Bangun Ruang dalam satu sesi',
  },
  {
    id: 'first_milestone',
    title: 'Langkah Pertama',
    description: 'Selamat memulai perjalanan persiapan TKA Geometri dengan menyelesaikan sesi perdana.',
    icon: '🚀',
    category: 'spesial',
    rarity: 'Umum',
    maxProgress: 1,
    criteriaDescription: 'Menyelesaikan sesi latihan/ujian pertama',
  },
  {
    id: 'high_achiever',
    title: 'Bintang Prestasi',
    description: 'Tembus nilai istimewa dengan memperoleh skor minimal 90 poin pada simulasi ujian.',
    icon: '⭐',
    category: 'performa',
    rarity: 'Langka',
    maxProgress: 1,
    criteriaDescription: 'Mendapat skor >= 90 poin pada sesi simulasi',
  },
  {
    id: 'cloud_sync_master',
    title: 'Tuntas KKM',
    description: 'Raih skor minimal 75 poin pada simulasi ujian sebagai bukti ketuntasan standar materi geometri.',
    icon: '🎯',
    category: 'performa',
    rarity: 'Langka',
    maxProgress: 1,
    criteriaDescription: 'Mendapat skor >= 75 poin pada sesi simulasi',
  },
];

/**
 * Evaluates achievements dynamically against the current session history and Google auth status.
 */
export function evaluateAchievements(
  history: QuizResult[],
  hasGoogleToken: boolean
): Achievement[] {
  // Metric aggregations
  const perfectScoresCount = history.filter((h) => h.score === 100).length;

  const fastSolverCount = history.filter(
    (h) => h.totalQuestions === 20 && h.timeSpentSeconds < 900 && h.score >= 80
  ).length;

  const totalSessions = history.length;

  const circleGuruCount = history.filter(
    (h) => h.breakdown.lingkaran.total >= 8 && h.breakdown.lingkaran.correct === h.breakdown.lingkaran.total
  ).length;

  const spaceArchitectCount = history.filter(
    (h) => h.breakdown.bangunRuang.total >= 12 && h.breakdown.bangunRuang.correct === h.breakdown.bangunRuang.total
  ).length;

  const highAchieverCount = history.filter((h) => h.score >= 90).length;

  return MASTER_ACHIEVEMENTS.map((badge) => {
    let progress = 0;
    let unlocked = false;

    switch (badge.id) {
      case 'ten_perfect_scores':
        progress = Math.min(perfectScoresCount, 10);
        unlocked = progress >= 10;
        break;

      case 'fast_solver':
        progress = fastSolverCount > 0 ? 1 : 0;
        unlocked = progress >= 1;
        break;

      case 'consistent_learner':
        progress = Math.min(totalSessions, 5);
        unlocked = progress >= 5;
        break;

      case 'circle_guru':
        progress = circleGuruCount > 0 ? 1 : 0;
        unlocked = progress >= 1;
        break;

      case 'space_architect':
        progress = spaceArchitectCount > 0 ? 1 : 0;
        unlocked = progress >= 1;
        break;

      case 'first_milestone':
        progress = totalSessions > 0 ? 1 : 0;
        unlocked = progress >= 1;
        break;

      case 'high_achiever':
        progress = highAchieverCount > 0 ? 1 : 0;
        unlocked = progress >= 1;
        break;

      case 'cloud_sync_master': {
        const kkmCount = history.filter((h) => h.score >= 75).length;
        progress = kkmCount > 0 ? 1 : 0;
        unlocked = progress >= 1;
        break;
      }

      default:
        progress = 0;
        unlocked = false;
        break;
    }

    return {
      ...badge,
      progress,
      unlocked,
      unlockedAt: unlocked ? 'Terbuka' : undefined,
    };
  });
}
