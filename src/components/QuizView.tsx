import React, { useState, useEffect } from 'react';
import { Question, QuizResult, StudentProfile, DimensionType } from '../types/geometry';
import { QUESTION_BANK } from '../data/questionBank';
import { QuestionCard } from './QuestionCard';
import { QuizReportModal } from './QuizReportModal';
import { PomodoroTimer } from './PomodoroTimer';
import { Clock, Play, RotateCcw, AlertCircle, Circle, Box, Filter, FileSpreadsheet } from 'lucide-react';
import { getAccessToken, googleSignIn, getCurrentUser } from '../services/googleAuth';

interface QuizViewProps {
  initialMode: 'simulasi' | 'latihan_mandiri';
  student: StudentProfile;
  onOpenProfile: () => void;
  onSaveQuizResult?: (result: QuizResult) => void;
  bookmarkedIds?: string[];
  onToggleBookmark?: (questionId: string) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  initialMode,
  student,
  onOpenProfile: _onOpenProfile,
  onSaveQuizResult,
  bookmarkedIds = [],
  onToggleBookmark,
}) => {
  const [mode, setMode] = useState<'simulasi' | 'latihan_mandiri'>(initialMode);
  const [filterDimension, setFilterDimension] = useState<DimensionType | 'ALL'>('ALL');
  const [showPomodoro, setShowPomodoro] = useState<boolean>(true);

  // Filtered questions for the active session (all 20 items by default)
  const [questions, setQuestions] = useState<Question[]>(() => QUESTION_BANK);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [markedQuestions, setMarkedQuestions] = useState<string[]>([]);

  // Timer for Simulation Mode (default: 25 minutes = 1500 seconds)
  const initialSeconds = 25 * 60;
  const [timeLeft, setTimeLeft] = useState<number>(initialSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(initialMode === 'simulasi');
  const [timeSpent, setTimeSpent] = useState<number>(0);

  // Submission & Result state
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState<boolean>(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);

  // Google Auth state
  const [hasGoogleToken, setHasGoogleToken] = useState<boolean>(false);

  useEffect(() => {
    getAccessToken().then((tok) => setHasGoogleToken(Boolean(tok)));
  }, []);

  // Update questions list when filter changes
  useEffect(() => {
    if (isSubmitted) return;
    let list = [...QUESTION_BANK];
    if (filterDimension !== 'ALL') {
      list = list.filter((q) => q.dimension === filterDimension);
    }
    setQuestions(list);
    setCurrentIndex(0);
  }, [filterDimension, isSubmitted]);

  // Countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (mode === 'simulasi' && isTimerRunning && !isSubmitted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleForceSubmit();
            return 0;
          }
          return prev - 1;
        });
        setTimeSpent((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [mode, isTimerRunning, isSubmitted, timeLeft]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSelectOption = (option: 'A' | 'B' | 'C' | 'D') => {
    if (isSubmitted) return;
    const currentQ = questions[currentIndex];
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: option,
    }));
  };

  const handleToggleMark = () => {
    const currentQ = questions[currentIndex];
    setMarkedQuestions((prev) =>
      prev.includes(currentQ.id) ? prev.filter((id) => id !== currentQ.id) : [...prev, currentQ.id]
    );
  };

  // Requirement 5: 20 soal, Benar = 5 poin, Salah = 0 poin (Max 100 poin)
  const calculateResults = (): QuizResult => {
    let correct = 0;
    let wrong = 0;
    let unanswered = 0;

    let lingCorrect = 0;
    let lingTotal = 0;
    let brCorrect = 0;
    let brTotal = 0;

    questions.forEach((q) => {
      if (q.dimension === 'Lingkaran') lingTotal++;
      if (q.dimension === 'Bangun Ruang') brTotal++;

      const ans = userAnswers[q.id];
      if (!ans) {
        unanswered++;
      } else if (ans === q.correctAnswer) {
        correct++;
        if (q.dimension === 'Lingkaran') lingCorrect++;
        if (q.dimension === 'Bangun Ruang') brCorrect++;
      } else {
        wrong++;
      }
    });

    const score = correct * 5; // 5 points per correct answer

    return {
      id: 'res-' + Date.now(),
      date: new Date().toLocaleDateString('id-ID'),
      mode,
      totalQuestions: questions.length,
      correctCount: correct,
      wrongCount: wrong,
      unansweredCount: unanswered,
      score,
      timeSpentSeconds: timeSpent,
      userAnswers,
      markedQuestions,
      breakdown: {
        lingkaran: { correct: lingCorrect, total: lingTotal },
        bangunRuang: { correct: brCorrect, total: brTotal },
      },
    };
  };

  const handleForceSubmit = () => {
    const res = calculateResults();
    setQuizResult(res);
    setIsSubmitted(true);
    setIsTimerRunning(false);
    setShowConfirmSubmit(false);
    setShowReportModal(true);
    onSaveQuizResult?.(res);
  };

  const handleResetSession = () => {
    setUserAnswers({});
    setMarkedQuestions([]);
    setCurrentIndex(0);
    setTimeLeft(initialSeconds);
    setTimeSpent(0);
    setIsSubmitted(false);
    setIsTimerRunning(mode === 'simulasi');
    setShowReportModal(false);
  };

  const handleConnectGoogle = async () => {
    try {
      const res = await googleSignIn();
      if (res?.accessToken) {
        setHasGoogleToken(true);
      }
    } catch (e) {
      console.warn('Google connect failed', e);
    }
  };

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(userAnswers).length;
  const currentTotalScore = Object.entries(userAnswers).reduce((acc, [qId, ans]) => {
    const q = questions.find((item) => item.id === qId);
    return acc + (q && q.correctAnswer === ans ? 5 : 0);
  }, 0);

  const currentUser = getCurrentUser();

  return (
    <div className="w-full space-y-6">
      {/* Top Banner / Mode Controller */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {mode === 'simulasi' ? 'Simulasi Ujian TKA (20 Soal)' : 'Latihan Soal Geometri Kelas 9'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Topik: <strong>Lingkaran (8 Soal)</strong> & <strong>Bangun Ruang (12 Soal)</strong>. Penskoran: Benar = 5 poin, Salah = 0.
          </p>
        </div>

        {/* Mode Selector and Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Google Sheets Connection Status */}
          {hasGoogleToken ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold">
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Drive:</span>
              <span className="truncate max-w-[100px]">{currentUser?.email || 'Tersambung'}</span>
            </div>
          ) : (
            <button
              onClick={handleConnectGoogle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              title="Sambungkan akun Google agar rekap otomatis masuk ke Google Drive"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sambungkan Google Drive</span>
            </button>
          )}

          {/* Mode switch */}
          {!isSubmitted && (
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <button
                onClick={() => {
                  setMode('latihan_mandiri');
                  setIsTimerRunning(false);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  mode === 'latihan_mandiri'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Latihan Mandiri
              </button>
              <button
                onClick={() => {
                  setMode('simulasi');
                  setIsTimerRunning(true);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  mode === 'simulasi'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Simulasi Ujian
              </button>
            </div>
          )}

          {/* Timer Display for Simulation */}
          {mode === 'simulasi' && !isSubmitted && (
            <div
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border font-math font-bold text-sm ${
                timeLeft < 180
                  ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-600 animate-pulse'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
              }`}
            >
              <Clock className="w-4 h-4 text-indigo-500" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          )}

          {/* Finish or Reset button */}
          {mode === 'simulasi' && !isSubmitted && (
            <button
              onClick={() => setShowConfirmSubmit(true)}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer"
            >
              Selesaikan Ujian
            </button>
          )}

          {isSubmitted && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowReportModal(true)}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs cursor-pointer"
              >
                Buka Rapor Nilai
              </button>
              <button
                onClick={handleResetSession}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Ulangi
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Pomodoro Study Timer (Exclusive to Latihan Mandiri mode) */}
      {mode === 'latihan_mandiri' && !isSubmitted && showPomodoro && (
        <PomodoroTimer />
      )}

      {/* Filter Bar (Only in Latihan Mandiri mode and before submit) */}
      {mode === 'latihan_mandiri' && !isSubmitted && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Filter Topik:
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setFilterDimension('ALL')}
                className={`text-xs px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  filterDimension === 'ALL'
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Semua 20 Soal
              </button>
              <button
                onClick={() => setFilterDimension('Lingkaran')}
                className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  filterDimension === 'Lingkaran'
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Circle className="w-3 h-3" />
                Khusus Lingkaran (8)
              </button>
              <button
                onClick={() => setFilterDimension('Bangun Ruang')}
                className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  filterDimension === 'Bangun Ruang'
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Box className="w-3 h-3" />
                Khusus Bangun Ruang (12)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowPomodoro(!showPomodoro)}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                showPomodoro
                  ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200/80 dark:border-indigo-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
              title={showPomodoro ? 'Sembunyikan Timer Pomodoro' : 'Tampilkan Timer Pomodoro'}
            >
              <span>🍅</span>
              <span>{showPomodoro ? 'Sembunyikan Timer' : 'Timer Pomodoro'}</span>
            </button>

            <div className="text-xs text-slate-500">
              Skor: <strong className="text-indigo-600 dark:text-indigo-400 font-math">{currentTotalScore}</strong> / 100 poin
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Left Navigation Numbers + Center Question Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Question Viewport (Center / Main) */}
        <div className="lg:col-span-8 space-y-4">
          {currentQuestion && (
            <QuestionCard
              question={currentQuestion}
              questionNumber={currentQuestion.questionNumber}
              totalQuestions={questions.length}
              selectedOption={userAnswers[currentQuestion.id]}
              onSelectOption={handleSelectOption}
              isMarked={markedQuestions.includes(currentQuestion.id)}
              onToggleMark={handleToggleMark}
              isBookmarked={bookmarkedIds.includes(currentQuestion.id)}
              onToggleBookmark={() => onToggleBookmark?.(currentQuestion.id)}
              isExamSubmitted={isSubmitted}
            />
          )}

          {/* Pagination Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              ← Soal Sebelumnya
            </button>

            <span className="text-xs text-slate-500 font-medium">
              Soal {currentIndex + 1} dari {questions.length}
            </span>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors cursor-pointer"
              >
                Soal Selanjutnya →
              </button>
            ) : mode === 'simulasi' && !isSubmitted ? (
              <button
                onClick={() => setShowConfirmSubmit(true)}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer"
              >
                Kirim Lembar Ujian ✓
              </button>
            ) : (
              <div />
            )}
          </div>
        </div>

        {/* Right Sidebar: Number Navigation Grid */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Navigasi 20 Soal TKA
            </h3>
            <span className="text-xs text-slate-500 tabular-nums">
              {answeredCount}/{questions.length} Terjawab
            </span>
          </div>

          {/* Quick Status Legend */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-indigo-600" />
              <span>Terjawab</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-amber-500" />
              <span>Ragu-ragu</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700" />
              <span>Belum Terjawab</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs border-2 border-indigo-500" />
              <span>Posisi Aktif</span>
            </div>
          </div>

          {/* Numbers Grid (1 to 20) */}
          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, idx) => {
              const isCurrent = idx === currentIndex;
              const hasAnswer = Boolean(userAnswers[q.id]);
              const isMarked = markedQuestions.includes(q.id);
              const isCorrect = userAnswers[q.id] === q.correctAnswer;

              let btnClass =
                'h-11 rounded-xl font-bold text-xs flex flex-col items-center justify-center transition-all relative cursor-pointer ';

              if (isSubmitted || hasAnswer) {
                if (hasAnswer) {
                  if (isCorrect) {
                    btnClass += 'bg-emerald-600 text-white ';
                  } else {
                    btnClass += 'bg-rose-600 text-white ';
                  }
                } else {
                  btnClass += 'bg-slate-100 dark:bg-slate-800 text-slate-500 ';
                }
              } else if (isMarked) {
                btnClass += 'bg-amber-500 text-white ';
              } else {
                btnClass +=
                  'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 ';
              }

              if (isCurrent) {
                btnClass += 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900 scale-105 z-10 font-black ';
              }

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={btnClass}
                >
                  <span className="text-sm">{q.questionNumber}</span>
                  <span className="text-[9px] opacity-80 font-normal">
                    {q.dimension === 'Lingkaran' ? 'Lingk' : 'Ruang'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Student info & Google sync status */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-1.5">
            <div className="flex justify-between">
              <span>Siswa:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{student.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Kelas:</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{student.grade}</span>
            </div>
            <div className="flex justify-between">
              <span>Skor Sementara:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 font-math">
                {currentTotalScore} / 100 Poin
              </span>
            </div>
            <div className="flex justify-between items-center pt-1 text-[11px]">
              <span>Google Sheets:</span>
              {hasGoogleToken ? (
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  ✓ Siap Masuk Drive
                </span>
              ) : (
                <button
                  onClick={handleConnectGoogle}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  Sambungkan
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal Before Submit */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 space-y-5 text-center">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 flex items-center justify-center text-amber-600 dark:text-amber-400 mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Selesaikan Ujian Sekarang?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Kamu telah menjawab <strong>{answeredCount}</strong> dari{' '}
                <strong>{questions.length}</strong> soal (Skor kamu: <strong>{currentTotalScore}</strong> / 100).
                {questions.length - answeredCount > 0 && (
                  <span className="text-rose-500 block font-semibold mt-1">
                    Masih ada {questions.length - answeredCount} soal yang belum dijawab!
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmSubmit(false)}
                className="flex-1 py-2.5 px-4 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                Periksa Lagi
              </button>
              <button
                type="button"
                onClick={handleForceSubmit}
                className="flex-1 py-2.5 px-4 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Ya, Selesaikan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Report Modal upon submission */}
      {showReportModal && quizResult && (
        <QuizReportModal
          result={quizResult}
          student={student}
          onReviewAll={() => setShowReportModal(false)}
          onRetry={handleResetSession}
          onClose={() => setShowReportModal(false)}
          onResultUpdated={(updated) => {
            setQuizResult(updated);
            onSaveQuizResult?.(updated);
          }}
        />
      )}
    </div>
  );
};
