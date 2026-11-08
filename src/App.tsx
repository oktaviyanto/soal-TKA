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
  FolderOpen,
} from 'lucide-react';
import { getAccessToken, googleSignIn, getCurrentUser } from './services/googleAuth';
import { initializeDriveFolderAndSheet, TARGET_FOLDER_NAME } from './services/googleSheets';
import { evaluateAchievements } from './data/achievements';
import confetti from 'canvas-confetti';

const STORAGE_KEY_PROFILE = 'geotka_student_profile';
const STORAGE_KEY_THEME = 'geotka_theme';
const STORAGE_KEY_HISTORY = 'geotka_quiz_history';
const STORAGE_KEY_BOOKMARKS = 'geotka_bookmarked_questions';

// Default initial progression data to visualize immediately upon launch
const DEFAULT_SAMPLE_HISTORY: QuizResult[] = [
  {
    id: 'res-sample-1',
    date: '04/03/2026',
    mode: 'simulasi',
    totalQuestions: 20,
    correctCount: 14,
    wrongCount: 6,
    unansweredCount: 0,
    score: 70,
    timeSpentSeconds: 1140,
    userAnswers: {},
    markedQuestions: [],
    breakdown: {
      lingkaran: { correct: 6, total: 8 },
      bangunRuang: { correct: 8, total: 12 },
    },
  },
  {
    id: 'res-sample-2',
    date: '06/03/2026',
    mode: 'simulasi',
    totalQuestions: 20,
    correctCount: 16,
    wrongCount: 4,
    unansweredCount: 0,
    score: 80,
    timeSpentSeconds: 1020,
    userAnswers: {},
    markedQuestions: [],
    breakdown: {
      lingkaran: { correct: 7, total: 8 },
      bangunRuang: { correct: 9, total: 12 },
    },
  },
  {
    id: 'res-sample-3',
    date: '07/03/2026',
    mode: 'simulasi',
    totalQuestions: 20,
    correctCount: 18,
    wrongCount: 2,
    unansweredCount: 0,
    score: 90,
    timeSpentSeconds: 880,
    userAnswers: {},
    markedQuestions: [],
    breakdown: {
      lingkaran: { correct: 8, total: 8 },
      bangunRuang: { correct: 10, total: 12 },
    },
  },
];

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
  const [hasGoogleToken, setHasGoogleToken] = useState<boolean>(false);
  const [driveFolderInfo, setDriveFolderInfo] = useState<{ folderUrl: string; sheetUrl: string } | null>(null);
  const [isInitializingDrive, setIsInitializingDrive] = useState<boolean>(false);

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

  useEffect(() => {
    getAccessToken().then((token) => {
      if (token) {
        setHasGoogleToken(true);
        initializeDriveFolderAndSheet(token)
          .then((res) => {
            setDriveFolderInfo({ folderUrl: res.folderUrl, sheetUrl: res.spreadsheetUrl });
          })
          .catch((err) => {
            console.warn('Drive check on startup:', err);
          });
      }
    });
  }, []);

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

  // Quiz History State for 'Performa Saya' Dashboard
  const [quizHistory, setQuizHistory] = useState<QuizResult[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (saved) {
        return JSON.parse(saved);
      }
      return DEFAULT_SAMPLE_HISTORY;
    } catch {
      return DEFAULT_SAMPLE_HISTORY;
    }
  });

  const [unlockedToast, setUnlockedToast] = useState<string | null>(null);

  const handleSaveQuizResult = (newResult: QuizResult) => {
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
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
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
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify([]));
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
    setIsProfileModalOpen(false);
  };

  const handleConnectGoogle = async () => {
    try {
      setIsInitializingDrive(true);
      const res = await googleSignIn();
      if (res?.accessToken) {
        setHasGoogleToken(true);
        const setup = await initializeDriveFolderAndSheet(res.accessToken);
        setDriveFolderInfo({ folderUrl: setup.folderUrl, sheetUrl: setup.spreadsheetUrl });
        setUnlockedToast(`Tersambung ke Google Drive! Folder "${TARGET_FOLDER_NAME}" & Spreadsheet telah siap.`);
      }
    } catch (err) {
      console.warn('Google sign-in error:', err);
    } finally {
      setIsInitializingDrive(false);
    }
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

  const currentUser = getCurrentUser();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* ================= ZONE 1: TOP BAR (Strict 3-Zone Contract) ================= */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => setActiveTab('latihan')}
            className="flex items-center gap-2 text-left shrink-0 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs group-hover:scale-105 transition-transform">
              📐
            </div>
            <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap shrink-0">
              GeoTKA <span className="text-indigo-600 dark:text-indigo-400">Kelas 9</span>
            </span>
          </button>

          {/* Zone 2: Concise single-line navigation links */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
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

          {/* Zone 3: 1 Primary Action & Profile Switcher */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Google Sheets / Drive Button */}
            {hasGoogleToken ? (
              <a
                href={driveFolderInfo?.folderUrl || 'https://drive.google.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors cursor-pointer"
                title={`Buka Folder '${TARGET_FOLDER_NAME}' di Google Drive (${currentUser?.email || ''})`}
              >
                <FolderOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span className="truncate max-w-[120px]">Folder Drive</span>
              </a>
            ) : (
              <button
                onClick={handleConnectGoogle}
                disabled={isInitializingDrive}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
                title="Sambungkan Akun Google untuk Rekap Nilai Otomatis ke Folder 'ujicoba aplikasi' di Google Drive"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isInitializingDrive ? 'Menyiapkan...' : 'Google Drive'}</span>
              </button>
            )}

            {/* Theme Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Ganti Tema Gelap / Terang"
              title="Ganti Tema"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* AI Tutor Button */}
            <button
              onClick={() => setIsTutorOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
              title="Tanya Kak Geo"
            >
              <Bot className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Tanya Tutor</span>
            </button>

            {/* Student Profile Pill / Button */}
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800/80 text-xs font-semibold text-indigo-950 dark:text-indigo-200 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors whitespace-nowrap cursor-pointer"
              title="Buka Profil & Lencana Prestasi Siswa"
            >
              <span className="text-base leading-none">
                {AVATAR_MAP[currentStudent.avatar] || '🔷'}
              </span>
              <div className="flex flex-col text-left leading-tight hidden xs:block">
                <div className="flex items-center gap-1.5">
                  <span className="truncate max-w-[90px] font-bold">{currentStudent.name}</span>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-0.5" title={`${unlockedBadgesCount} Lencana Terbuka`}>
                    🏆 {unlockedBadgesCount}
                  </span>
                </div>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">{currentStudent.grade}</span>
              </div>
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
              Penskoran: 20 butir soal (Benar = 5 poin, Salah = 0 poin). Kunci & pembahasan tampil setelah mengklik jawaban, nilai otomatis tersimpan ke spreadsheet di folder <strong>ujicoba aplikasi</strong> Google Drive!
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
            <span>20 Butir Soal Lingkaran & Bangun Ruang · Output Otomatis Google Sheets & Drive</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1">
              <Circle className="w-3 h-3 text-indigo-500" /> Lingkaran
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Box className="w-3 h-3 text-indigo-500" /> Bangun Ruang
            </span>
            <span aria-hidden="true">·</span>
            <span>Standar TKA SMP</span>
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
      />

      {/* AI Tutor Assistant Drawer */}
      <TutorDrawer
        isOpen={isTutorOpen}
        onClose={() => setIsTutorOpen(false)}
      />
    </div>
  );
}
