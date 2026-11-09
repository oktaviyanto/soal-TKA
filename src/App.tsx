/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { StudentProfile, QuizResult } from './types/geometry';
import { QuizView } from './components/QuizView';
import { ShapeExplorer } from './components/ShapeExplorer';
import { FormulaCardsView } from './components/FormulaCardsView';
import { PerformanceDashboard } from './components/PerformanceDashboard';
import { SavedQuestionsView } from './components/SavedQuestionsView';
import { StudentProfileModal } from './components/StudentProfileModal';
import { TutorDrawer } from './components/TutorDrawer';
import {
  Sun,
  Moon,
  GraduationCap,
  Sparkles,
  Bot,
  Circle,
  Box,
  Compass,
  FileSpreadsheet,
  TrendingUp,
  Award,
  Bookmark,
  LogOut,
} from 'lucide-react';
import { evaluateAchievements } from './data/achievements';
import confetti from 'canvas-confetti';

const STORAGE_KEY_PROFILE = 'geotka_student_profile';
const STORAGE_KEY_THEME = 'geotka_theme';
const STORAGE_KEY_BOOKMARKS = 'geotka_bookmarked_questions';

// Helper to get student-specific storage key so each student's score and history is actual and isolated
const getStudentHistoryKey = (studentName?: string) =>
  `geotka_quiz_history_${(studentName || 'default').trim().toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

const isLegitimateQuizResult = (r: QuizResult): boolean => {
  if (!r || r.id?.startsWith('res-sample')) return false;
  const answered = Object.keys(r.userAnswers || {}).length;
  const evaluated = (r.correctCount || 0) + (r.wrongCount || 0);
  return answered > 0 || evaluated > 0;
};

const loadStudentQuizHistory = (studentName?: string): QuizResult[] => {
  try {
    const key = getStudentHistoryKey(studentName);
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        // Filter out any mock/sample items and empty entries (0 answers)
        return parsed.filter(isLegitimateQuizResult);
      }
    }
    // Also clean up any legacy global mock/empty data if present
    const legacy = localStorage.getItem('geotka_quiz_history');
    if (legacy) {
      const parsed = JSON.parse(legacy);
      if (Array.isArray(parsed)) {
        const cleaned = parsed.filter(isLegitimateQuizResult);
        if (cleaned.length !== parsed.length) {
          localStorage.setItem('geotka_quiz_history', JSON.stringify(cleaned));
        }
      }
    }
    return [];
  } catch {
    return [];
  }
};

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'latihan' | 'simulasi' | 'performa' | 'tersimpan' | 'lab' | 'rumus'>('latihan');

  // Student Profile State (strictly Kelas 9-A through 9-D)
  const [student, setStudent] = useState<StudentProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure grade is normalized to Kelas 9A - 9D
        if (!['Kelas 9-A', 'Kelas 9-B', 'Kelas 9-C', 'Kelas 9-D'].includes(parsed.grade)) {
          parsed.grade = 'Kelas 9-A';
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(!student);
  const [isTutorOpen, setIsTutorOpen] = useState<boolean>(false);
  const hasGoogleToken = false;

  // Bookmarked questions state with persistence and initial sample items
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
      if (saved) {
        return JSON.parse(saved);
      }
      return ['geo-q-02', 'geo-q-06']; // Initial sample bookmarks: soal contextual & bangun ruang
    } catch {
      return ['geo-q-02', 'geo-q-06'];
    }
  });

  const handleToggleBookmark = (questionId: string) => {
    setBookmarkedIds((prev) => {
      const exists = prev.includes(questionId);
      const updated = exists ? prev.filter((id) => id !== questionId) : [...prev, questionId];
      try {
        localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save bookmarks', e);
      }
      return updated;
    });
  };

  // Dark / Light Theme
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THEME);
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'light');
    }
  }, [isDarkMode]);

  // Quiz History State for 'Performa Saya' Dashboard (strictly actual student data)
  const [quizHistory, setQuizHistory] = useState<QuizResult[]>(() => {
    return loadStudentQuizHistory(student?.name);
  });

  const [unlockedToast, setUnlockedToast] = useState<string | null>(null);

  const handleSaveQuizResult = (newResult: QuizResult) => {
    if (!isLegitimateQuizResult(newResult)) return;

    const prevAchievements = evaluateAchievements(quizHistory, hasGoogleToken);
    const prevUnlockedIds = new Set(prevAchievements.filter((a) => a.unlocked).map((a) => a.id));

    setQuizHistory((prev) => {
      const existingIdx = prev.findIndex((item) => item.id === newResult.id);
      let updated: QuizResult[];
      if (existingIdx >= 0) {
        updated = [...prev];
        updated[existingIdx] = newResult;
      } else {
        updated = [...prev, newResult];
      }
      try {
        const key = getStudentHistoryKey(student?.name);
        localStorage.setItem(key, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save quiz history', e);
      }

      // Detect newly unlocked achievements
      const nextAchievements = evaluateAchievements(updated, hasGoogleToken);
      const newlyUnlocked = nextAchievements.filter((a) => a.unlocked && !prevUnlockedIds.has(a.id));
      if (newlyUnlocked.length > 0) {
        setUnlockedToast(
          `Selamat! Kamu membuka Lencana Baru: "${newlyUnlocked[0].title}" ${newlyUnlocked[0].icon}`
        );
        try {
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
        } catch {}
      }

      return updated;
    });
  };

  const handleClearHistory = () => {
    setQuizHistory([]);
    try {
      const key = getStudentHistoryKey(student?.name);
      localStorage.setItem(key, JSON.stringify([]));
    } catch (e) {
      console.warn('Failed to clear history', e);
    }
  };

  const handleSaveProfile = (newProfile: StudentProfile) => {
    setStudent(newProfile);
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(newProfile));
    } catch (e) {
      console.warn('Failed to save profile', e);
    }
    // Load this specific student's actual history (empty if new student)
    const newStudentHistory = loadStudentQuizHistory(newProfile.name);
    setQuizHistory(newStudentHistory);
    setIsProfileModalOpen(false);
  };

  const handleLogout = () => {
    setStudent(null);
    try {
      localStorage.removeItem(STORAGE_KEY_PROFILE);
    } catch (e) {
      console.warn('Failed to clear profile on logout', e);
    }
    setQuizHistory([]);
    setIsProfileModalOpen(true);
  };

  const AVATAR_MAP: Record<string, string> = {
    'av-1': '🔷',
    'av-2': '🔶',
    'av-3': '🟢',
    'av-4': '🟣',
    'av-5': '⭐',
    'av-6': '✒️',
  };

  const currentStudent: StudentProfile = student || {
    name: 'Siswa Kelas 9',
    grade: 'Kelas 9-A',
    school: 'SMP Indonesia',
    avatar: 'av-1',
    joinedAt: new Date().toISOString(),
  };

  // Dynamically compute badges & achievements
  const achievements = evaluateAchievements(quizHistory, hasGoogleToken);
  const unlockedBadgesCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors overflow-x-hidden">
      {/* Top Academic Ribbon with Author Credit in Corner */}
      <div className="w-full bg-slate-100/90 dark:bg-slate-900/90 border-b border-slate-200/70 dark:border-slate-800/70 py-1.5 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span className="hidden sm:inline">Kurikulum Tes Kemampuan Akademik (TKA) Matematika SMP · Geometri 2D & 3D</span>
          <span className="sm:hidden">GeoTKA SMP Kelas 9</span>
          <div className="flex items-center gap-1.5 font-medium">
            <span className="text-slate-500 dark:text-slate-400">Nama Pembuat :</span>
            <strong className="text-slate-900 dark:text-slate-100 font-semibold tracking-tight font-display">
              Oktaviyanto CFM
            </strong>
          </div>
        </div>
      </div>

      {/* ================= ZONE 1: TOP BAR (Strict 3-Zone Contract) ================= */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4 lg:gap-6">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => setActiveTab('latihan')}
            className="flex items-center gap-2 text-left shrink-0 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs group-hover:scale-105 transition-transform">
              📐
            </div>
            <span className="font-display text-base sm:text-lg lg:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap">
              GeoTKA <span className="text-indigo-600 dark:text-indigo-400">Kelas 9</span>
            </span>
          </button>

          {/* Zone 2: Concise single-line navigation links */}
          <nav className="hidden lg:flex items-center gap-3.5 xl:gap-5 text-sm font-medium text-slate-600 dark:text-slate-400">
            <button
              onClick={() => setActiveTab('latihan')}
              className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'latihan'
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                  : ''
              }`}
            >
              Latihan Mandiri
            </button>
            <button
              onClick={() => setActiveTab('simulasi')}
              className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'simulasi'
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                  : ''
              }`}
            >
              Simulasi (20 Soal)
            </button>
            <button
              onClick={() => setActiveTab('performa')}
              className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'performa'
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                  : ''
              }`}
            >
              Performa Saya
            </button>
            <button
              onClick={() => setActiveTab('tersimpan')}
              className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'tersimpan'
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                  : ''
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Soal Tersimpan</span>
              {bookmarkedIds.length > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300">
                  {bookmarkedIds.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('lab')}
              className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'lab'
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                  : ''
              }`}
            >
              Lab Interaktif
            </button>
            <button
              onClick={() => setActiveTab('rumus')}
              className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'rumus'
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                  : ''
              }`}
            >
              Bank Rumus
            </button>
          </nav>

          {/* Zone 3: Profile Switcher & Tombol Keluar (Terletak Rapi, Tidak Terlalu Kanan & Responsif di Semua Layar) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* AI Tutor Button (Desktop & Tablet) */}
            <button
              onClick={() => setIsTutorOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
              title="Tanya Tutor AI Matematika"
            >
              <Bot className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden md:inline">Tanya Tutor</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
              aria-label="Ganti Tema Gelap / Terang"
              title="Ganti Tema"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Student Profile Pill / Button */}
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800/80 text-xs font-semibold text-indigo-950 dark:text-indigo-200 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors cursor-pointer shrink-0"
              title="Buka Profil & Lencana Prestasi Siswa"
            >
              <span className="text-sm sm:text-base leading-none">
                {AVATAR_MAP[currentStudent.avatar] || '🔷'}
              </span>
              <span className="truncate max-w-[65px] xs:max-w-[85px] sm:max-w-[120px] font-bold text-slate-900 dark:text-slate-100">
                {currentStudent.name}
              </span>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hidden xs:inline">
                ({currentStudent.grade})
              </span>
            </button>

            {/* Tombol Keluar (Sesi Login Baru) - Tampil Jelas & Tidak Terpotong di Desktop Maupun HP */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 hover:text-rose-800 dark:text-rose-300 dark:hover:text-rose-200 border border-rose-200 dark:border-rose-800/80 text-xs font-bold font-display transition-all cursor-pointer shrink-0 shadow-2xs active:scale-95"
              title="Keluar dari sesi ini dan ganti siswa"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-2 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 overflow-x-auto">
        <button
          onClick={() => setActiveTab('latihan')}
          className={`px-2 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'latihan'
              ? 'bg-indigo-600 text-white font-semibold'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Latihan
        </button>
        <button
          onClick={() => setActiveTab('simulasi')}
          className={`px-2 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'simulasi'
              ? 'bg-indigo-600 text-white font-semibold'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Simulasi
        </button>
        <button
          onClick={() => setActiveTab('performa')}
          className={`px-2 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'performa'
              ? 'bg-indigo-600 text-white font-semibold'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Performa
        </button>
        <button
          onClick={() => setActiveTab('tersimpan')}
          className={`px-2 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
            activeTab === 'tersimpan'
              ? 'bg-indigo-600 text-white font-semibold'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>Tersimpan</span>
          {bookmarkedIds.length > 0 && (
            <span className={`text-[10px] px-1 rounded-full font-bold ${
              activeTab === 'tersimpan' ? 'bg-white text-indigo-700' : 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200'
            }`}>
              {bookmarkedIds.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('lab')}
          className={`px-2 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'lab'
              ? 'bg-indigo-600 text-white font-semibold'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Lab
        </button>
        <button
          onClick={() => setActiveTab('rumus')}
          className={`px-2 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'rumus'
              ? 'bg-indigo-600 text-white font-semibold'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Rumus
        </button>
        <button
          onClick={() => setIsTutorOpen(true)}
          className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 cursor-pointer"
          aria-label="Tutor AI"
        >
          <Bot className="w-4 h-4" />
        </button>
      </div>

      {/* ================= MAIN CONTENT VIEWPORT ================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Hero Context Bar */}
        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-900 to-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm relative overflow-hidden">
          <div className="relative z-10 space-y-1">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold">
              <Compass className="w-3.5 h-3.5" />
              <span>Tes Kemampuan Akademik (TKA) Matematika Kelas 9</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold font-display tracking-tight text-white">
              20 Butir Soal Geometri: Lingkaran & Bangun Ruang
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Peserta: <strong>{currentStudent.name}</strong> ({currentStudent.grade}). 
              Penskoran: 20 butir soal (Benar = 5 poin, Salah = 0 poin). Kunci & pembahasan interaktif lengkap tersedia di setiap akhir sesi dengan lembar portofolio PDF resmi.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('simulasi')}
              className="px-4 py-2 rounded-xl bg-white text-indigo-950 font-bold text-xs hover:bg-indigo-50 transition-colors shadow-xs cursor-pointer"
            >
              Mulai Ujian 20 Soal
            </button>
            <button
              onClick={() => setIsTutorOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Tanya Tutor
            </button>
          </div>

          {/* Decorative geometric background elements */}
          <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-indigo-600/20 blur-2xl pointer-events-none" />
          <div className="absolute right-32 top-0 w-32 h-32 rounded-full bg-emerald-500/10 blur-xl pointer-events-none" />
        </div>

        {/* View Switcher Container */}
        {activeTab === 'latihan' && (
          <QuizView
            key="latihan-mode"
            initialMode="latihan_mandiri"
            student={currentStudent}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            onSaveQuizResult={handleSaveQuizResult}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {activeTab === 'simulasi' && (
          <QuizView
            key="simulasi-mode"
            initialMode="simulasi"
            student={currentStudent}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            onSaveQuizResult={handleSaveQuizResult}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {activeTab === 'performa' && (
          <PerformanceDashboard
            history={quizHistory}
            student={currentStudent}
            onStartQuiz={() => setActiveTab('simulasi')}
            onClearHistory={handleClearHistory}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            hasGoogleToken={hasGoogleToken}
          />
        )}

        {activeTab === 'tersimpan' && (
          <SavedQuestionsView
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
            onGoToQuiz={() => setActiveTab('latihan')}
          />
        )}

        {activeTab === 'lab' && <ShapeExplorer />}

        {activeTab === 'rumus' && <FormulaCardsView />}
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 dark:text-slate-200">GeoTKA Kelas 9</span>
            <span aria-hidden="true">·</span>
            <span>20 Butir Soal Lingkaran & Bangun Ruang · Portofolio Nilai PDF Resmi</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1 text-slate-500">
              <Circle className="w-3 h-3 text-indigo-500" /> Lingkaran
            </span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <span className="flex items-center gap-1 text-slate-500">
              <Box className="w-3 h-3 text-indigo-500" /> Bangun Ruang
            </span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <span className="font-medium text-slate-600 dark:text-slate-300">
              Nama Pembuat : <strong className="text-slate-900 dark:text-slate-100 font-semibold font-display">Oktaviyanto CFM</strong>
            </span>
          </div>
        </div>
      </footer>

      {/* Unlocked Achievement Toast Notification Banner */}
      {unlockedToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-gradient-to-r from-amber-500 to-indigo-600 text-white p-4 rounded-2xl shadow-2xl border border-amber-300/40 flex items-center justify-between gap-3 animate-bounce">
          <div className="flex items-center gap-2.5">
            <Award className="w-6 h-6 text-amber-200 shrink-0" />
            <div className="text-xs font-medium">
              <p className="font-bold text-sm">Lencana Prestasi Terbuka!</p>
              <p>{unlockedToast}</p>
            </div>
          </div>
          <button
            onClick={() => setUnlockedToast(null)}
            className="p-1 rounded-lg hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
            aria-label="Tutup Notifikasi"
          >
            ✕
          </button>
        </div>
      )}

      {/* Student Profile & Achievements Modal */}
      <StudentProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentProfile={student}
        onSave={handleSaveProfile}
        isInitialRequired={!student}
        history={quizHistory}
        hasGoogleToken={hasGoogleToken}
        onLogout={handleLogout}
      />

      {/* AI Tutor Assistant Drawer */}
      <TutorDrawer
        isOpen={isTutorOpen}
        onClose={() => setIsTutorOpen(false)}
      />
    </div>
  );
}
