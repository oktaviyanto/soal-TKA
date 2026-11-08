import React, { useState, useMemo } from 'react';
import { StudentProfile, QuizResult } from '../types/geometry';
import { Achievement } from '../types/achievements';
import { evaluateAchievements } from '../data/achievements';
import { AchievementBadgeCard } from './AchievementBadgeCard';
import {
  UserCheck,
  GraduationCap,
  School,
  X,
  Award,
  Settings,
  Calendar,
  Sparkles,
  Info,
} from 'lucide-react';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose?: () => void;
  currentProfile: StudentProfile | null;
  onSave: (profile: StudentProfile) => void;
  isInitialRequired?: boolean;
  history?: QuizResult[];
  hasGoogleToken?: boolean;
}

const AVATAR_OPTIONS = [
  { id: 'av-1', label: 'Hexa Biru', icon: '🔷' },
  { id: 'av-2', label: 'Kubus Emas', icon: '🔶' },
  { id: 'av-3', label: 'Lingkaran Toska', icon: '🟢' },
  { id: 'av-4', label: 'Prisma Ungu', icon: '🟣' },
  { id: 'av-5', label: 'Bintang Prestasi', icon: '⭐' },
  { id: 'av-6', label: 'Pena Matematika', icon: '✒️' },
];

const KELAS_9_OPTIONS = ['Kelas 9-A', 'Kelas 9-B', 'Kelas 9-C', 'Kelas 9-D'];

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSave,
  isInitialRequired = false,
  history = [],
  hasGoogleToken = false,
}) => {
  const [activeTab, setActiveTab] = useState<'lencana' | 'edit'>(
    isInitialRequired ? 'edit' : 'lencana'
  );
  const [badgeFilter, setBadgeFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [selectedBadgeDetail, setSelectedBadgeDetail] = useState<Achievement | null>(null);

  // Form states
  const [name, setName] = useState(currentProfile?.name || '');
  const [grade, setGrade] = useState(currentProfile?.grade || 'Kelas 9-A');
  const [school, setSchool] = useState(currentProfile?.school || '');
  const [selectedAvatar, setSelectedAvatar] = useState(currentProfile?.avatar || 'av-1');
  const [errorMsg, setErrorMsg] = useState('');

  // Dynamically compute achievements
  const achievements = useMemo(() => {
    return evaluateAchievements(history, hasGoogleToken);
  }, [history, hasGoogleToken]);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const completionPercentage = Math.round((unlockedCount / achievements.length) * 100);

  const filteredBadges = useMemo(() => {
    if (badgeFilter === 'unlocked') return achievements.filter((a) => a.unlocked);
    if (badgeFilter === 'locked') return achievements.filter((a) => !a.unlocked);
    return achievements;
  }, [achievements, badgeFilter]);

  if (!isOpen) return null;

  const currentAvatarObj =
    AVATAR_OPTIONS.find((av) => av.id === (currentProfile?.avatar || selectedAvatar)) ||
    AVATAR_OPTIONS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Mohon isi nama lengkap kamu.');
      return;
    }
    if (!grade.trim()) {
      setErrorMsg('Mohon pilih salah satu kelas (9A - 9D).');
      return;
    }

    const newProfile: StudentProfile = {
      name: name.trim(),
      grade: grade.trim(),
      school: school.trim() || 'SMP Indonesia',
      avatar: selectedAvatar,
      joinedAt: currentProfile?.joinedAt || new Date().toISOString(),
    };

    onSave(newProfile);
    if (onClose) onClose();
  };

  const formattedJoinDate = currentProfile?.joinedAt
    ? new Date(currentProfile.joinedAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Maret 2026';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Close Button */}
        {!isInitialRequired && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header Section */}
        {isInitialRequired ? (
          <div className="p-6 sm:p-7 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3.5 bg-slate-50/50 dark:bg-slate-800/40">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-indigo-600/20 shrink-0">
              📐
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Masuk Peserta GeoTKA SMP
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Pilih nama dan kelas untuk memulai latihan soal Geometri & sinkronisasi Google Sheets.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-5 sm:p-6 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white relative overflow-hidden shrink-0">
            {/* Background elements */}
            <div className="absolute -right-6 -bottom-6 w-36 h-36 rounded-full bg-indigo-500/20 blur-xl pointer-events-none" />
            <div className="absolute right-32 top-0 w-24 h-24 rounded-full bg-amber-400/10 blur-lg pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl shadow-inner">
                  {currentAvatarObj.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white font-display">
                      {currentProfile?.name || 'Siswa GeoTKA'}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 text-xs font-bold">
                      {currentProfile?.grade || 'Kelas 9-A'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-indigo-200/80 mt-1">
                    <span className="flex items-center gap-1">
                      <School className="w-3.5 h-3.5 text-indigo-300" />
                      <span>{currentProfile?.school || 'SMP Indonesia'}</span>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-indigo-300" />
                      <span>Terdaftar: {formattedJoinDate}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Achievements summary pill */}
              <div className="flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300 text-base">
                  🏆
                </div>
                <div className="text-left">
                  <span className="text-[10px] text-indigo-200 uppercase tracking-wider block font-semibold">
                    Lencana Terbuka
                  </span>
                  <span className="text-sm font-black font-display text-white">
                    {unlockedCount} <span className="text-xs font-normal text-indigo-200">/ {achievements.length}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Sub Tabs: Lencana vs Edit Profile */}
            <div className="flex items-center gap-1 mt-5 pt-3 border-t border-white/10 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('lencana')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'lencana'
                    ? 'bg-white text-indigo-950 font-bold shadow-xs'
                    : 'text-indigo-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>Lencana Prestasi ({unlockedCount}/{achievements.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('edit')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'edit'
                    ? 'bg-white text-indigo-950 font-bold shadow-xs'
                    : 'text-indigo-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Ubah Data Diri</span>
              </button>
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}

          {/* TAB 1: LENCANA PRESTASI */}
          {!isInitialRequired && activeTab === 'lencana' && (
            <div className="space-y-4">
              {/* Progress Bar Header */}
              <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Kemajuan Koleksi Lencana Milestones</span>
                  </span>
                  <span className="font-math font-bold text-indigo-600 dark:text-indigo-400">
                    {completionPercentage}% Selesai
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500 rounded-full"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Raih lencana dengan menyelesaikan ujian 20 butir soal, mencetak skor sempurna 100, menyelesaikan soal kilat, dan menjaga konsistensi belajar!
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
                  <button
                    onClick={() => setBadgeFilter('all')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      badgeFilter === 'all'
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Semua ({achievements.length})
                  </button>
                  <button
                    onClick={() => setBadgeFilter('unlocked')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      badgeFilter === 'unlocked'
                        ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Terbuka ({unlockedCount})
                  </button>
                  <button
                    onClick={() => setBadgeFilter('locked')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      badgeFilter === 'locked'
                        ? 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Terkunci ({achievements.length - unlockedCount})
                  </button>
                </div>

                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  Klik lencana untuk detail kriteria
                </span>
              </div>

              {/* Badges Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {filteredBadges.map((badge) => (
                  <AchievementBadgeCard
                    key={badge.id}
                    badge={badge}
                    onClick={() => setSelectedBadgeDetail(badge)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: EDIT PROFIL FORM */}
          {(isInitialRequired || activeTab === 'edit') && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Pilih Maskot Profil Siswa
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                  {AVATAR_OPTIONS.map((av) => (
                    <button
                      type="button"
                      key={av.id}
                      onClick={() => setSelectedAvatar(av.id)}
                      className={`h-14 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        selectedAvatar === av.id
                          ? 'bg-white dark:bg-slate-700 shadow-md border-2 border-indigo-500 scale-105'
                          : 'opacity-70 hover:opacity-100 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                      }`}
                      title={av.label}
                    >
                      <span className="text-xl">{av.icon}</span>
                      <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300 truncate max-w-[80%]">
                        {av.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Nama Siswa */}
              <div>
                <label
                  htmlFor="student-name-input"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Nama Lengkap Siswa <span className="text-rose-500">*</span>
                </label>
                <input
                  id="student-name-input"
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 dark:text-slate-100"
                />
              </div>

              {/* Pilihan Kelas: Strictly Kelas 9A - 9D */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Pilih Kelas (Tingkat Kelas 9) <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-math">
                    {grade}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {KELAS_9_OPTIONS.map((item) => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => {
                        setGrade(item);
                        if (errorMsg) setErrorMsg('');
                      }}
                      className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                        grade === item
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900 scale-[1.02]'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600'
                      }`}
                    >
                      <span>🏫</span>
                      <span>{item}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Asal Sekolah (Opsional) */}
              <div>
                <label
                  htmlFor="student-school-input"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5"
                >
                  <School className="w-3.5 h-3.5 text-slate-400" />
                  Asal Sekolah (Opsional)
                </label>
                <input
                  id="student-school-input"
                  type="text"
                  placeholder="Contoh: SMP Negeri 1"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 dark:text-slate-100"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all shadow-md shadow-indigo-600/20 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  {isInitialRequired ? 'Mulai Latihan TKA' : 'Simpan Perubahan Profil'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Selected Badge Detail Modal Overlay */}
        {selectedBadgeDetail && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-4xl mx-auto shadow-sm">
                {selectedBadgeDetail.icon}
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  {selectedBadgeDetail.rarity} · Kategori: {selectedBadgeDetail.category}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-2">
                  {selectedBadgeDetail.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {selectedBadgeDetail.description}
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs text-left space-y-1.5">
                <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-indigo-500" />
                  Kriteria Membuka:
                </span>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {selectedBadgeDetail.criteriaDescription}
                </p>
                <div className="pt-1 flex items-center justify-between text-xs">
                  <span>Progres Kamu:</span>
                  <strong className="font-math text-indigo-600 dark:text-indigo-400">
                    {selectedBadgeDetail.progress} / {selectedBadgeDetail.maxProgress}{' '}
                    {selectedBadgeDetail.unlocked ? '(Terbuka ✓)' : '(Belum Terbuka)'}
                  </strong>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBadgeDetail(null)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                Tutup Detail Lencana
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
