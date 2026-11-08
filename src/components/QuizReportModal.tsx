import React, { useState, useEffect } from 'react';
import { QuizResult, StudentProfile } from '../types/geometry';
import {
  Trophy,
  CheckCircle,
  XCircle,
  Clock,
  RotateCcw,
  BookOpen,
  Circle,
  Box,
  FileSpreadsheet,
  ExternalLink,
  Check,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { exportQuizResultToGoogleSheet } from '../services/googleSheets';
import { googleSignIn, getCurrentUser, getAccessToken } from '../services/googleAuth';

interface QuizReportModalProps {
  result: QuizResult;
  student: StudentProfile;
  onReviewAll: () => void;
  onRetry: () => void;
  onClose: () => void;
  onResultUpdated?: (result: QuizResult) => void;
}

export const QuizReportModal: React.FC<QuizReportModalProps> = ({
  result,
  student,
  onReviewAll,
  onRetry,
  onResultUpdated,
}) => {
  // Score: 20 questions, 5 points per correct answer (max 100)
  const score = result.correctCount * 5;

  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportedUrl, setExportedUrl] = useState<string | null>(result.googleSheetUrl || null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [isGoogleConnected, setIsGoogleConnected] = useState<boolean>(false);

  useEffect(() => {
    if (score >= 70) {
      try {
        confetti({
          particleCount: 85,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        console.warn('Confetti effect failed', err);
      }
    }

    // Check if token already exists
    getAccessToken().then((token) => {
      setIsGoogleConnected(Boolean(token));
      // Auto export if already connected
      if (token && !exportedUrl) {
        handleExportToGoogle(token);
      }
    });
  }, [score]);

  const handleExportToGoogle = async (existingToken?: string) => {
    setIsExporting(true);
    setExportError(null);
    try {
      let token = existingToken || (await getAccessToken());
      if (!token) {
        const signResult = await googleSignIn();
        if (!signResult?.accessToken) {
          throw new Error('Gagal login ke Google.');
        }
        token = signResult.accessToken;
        setIsGoogleConnected(true);
      }

      // Map answers to 1-20 indexing
      const answersMap: Record<number, 'A' | 'B' | 'C' | 'D' | '-'> = {};
      for (let i = 1; i <= 20; i++) {
        // Question ID format: geo-q-01 to geo-q-20
        const qId = `geo-q-${i < 10 ? '0' : ''}${i}`;
        answersMap[i] = result.userAnswers[qId] || '-';
      }

      const res = await exportQuizResultToGoogleSheet({
        studentName: student.name,
        grade: student.grade,
        score,
        correctCount: result.correctCount,
        wrongCount: result.wrongCount,
        timeSpentSeconds: result.timeSpentSeconds,
        answers: answersMap,
        totalQuestions: 20,
      });

      setExportedUrl(res.spreadsheetUrl);
      result.googleSheetUrl = res.spreadsheetUrl;
      onResultUpdated?.({ ...result, googleSheetUrl: res.spreadsheetUrl });
    } catch (err: any) {
      console.error('Export error:', err);
      setExportError(err.message || 'Gagal menyimpan ke Google Sheets');
    } finally {
      setIsExporting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  let gradeBadge = {
    title: 'Perlu Latihan Tambahan',
    desc: 'Pelajari kembali rumus lingkaran dan bangun ruang di tab Bank Rumus.',
    color: 'text-amber-600 dark:text-amber-400',
  };

  if (score >= 90) {
    gradeBadge = {
      title: 'Sangat Menguasai (Istimewa) 🏆',
      desc: 'Pemahaman konsep lingkaran dan bangun ruang kamu sangat luar biasa!',
      color: 'text-emerald-600 dark:text-emerald-400',
    };
  } else if (score >= 75) {
    gradeBadge = {
      title: 'Hebat & Memuaskan 🌟',
      desc: 'Analisis soal TKA geometri kamu sudah siap menghadapi ujian nasional.',
      color: 'text-indigo-600 dark:text-indigo-400',
    };
  } else if (score >= 60) {
    gradeBadge = {
      title: 'Cukup Baik 👍',
      desc: 'Tingkatkan ketelitian pada rumus bangun ruang gabungan.',
      color: 'text-blue-600 dark:text-blue-400',
    };
  }

  const currentUser = getCurrentUser();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 my-6 text-center space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Top Trophy Header */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 mx-auto">
          <Trophy className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Rapor Hasil Latihan TKA (Lingkaran & Bangun Ruang)
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            {student.name}
          </h2>
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500 mt-0.5">
            <span className="font-bold text-indigo-600 dark:text-indigo-400">{student.grade}</span>
            <span aria-hidden="true">·</span>
            <span>{student.school || 'SMP'}</span>
          </div>
        </div>

        {/* Big Score Box (Requirement 5: 20 soal, Benar = 5, Salah = 0, Max = 100) */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="text-5xl font-black font-display text-indigo-600 dark:text-indigo-400 tabular-nums">
            {score}
            <span className="text-lg text-slate-400 font-normal"> / 100</span>
          </div>
          <div className={`text-sm font-bold ${gradeBadge.color}`}>
            {gradeBadge.title}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
            {result.correctCount} Soal Benar × 5 poin = {score} Poin.
          </p>
        </div>

        {/* Lingkaran vs Bangun Ruang Breakdown */}
        <div className="grid grid-cols-2 gap-3 text-left">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Circle className="w-3.5 h-3.5 text-indigo-500" />
              <span>Lingkaran (8 Soal)</span>
            </div>
            <div className="text-base font-bold text-slate-900 dark:text-slate-100 tabular-nums">
              {result.breakdown.lingkaran.correct} / {result.breakdown.lingkaran.total} Benar
            </div>
            <p className="text-[11px] text-slate-500">
              {result.breakdown.lingkaran.total > 0
                ? `${result.breakdown.lingkaran.correct * 5} Poin diperoleh`
                : '-'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Box className="w-3.5 h-3.5 text-indigo-500" />
              <span>Bangun Ruang (12 Soal)</span>
            </div>
            <div className="text-base font-bold text-slate-900 dark:text-slate-100 tabular-nums">
              {result.breakdown.bangunRuang.correct} / {result.breakdown.bangunRuang.total} Benar
            </div>
            <p className="text-[11px] text-slate-500">
              {result.breakdown.bangunRuang.total > 0
                ? `${result.breakdown.bangunRuang.correct * 5} Poin diperoleh`
                : '-'}
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-emerald-600 font-semibold mb-0.5">
              <CheckCircle className="w-3.5 h-3.5" />
              Benar (+5)
            </div>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200 tabular-nums">
              {result.correctCount} soal
            </span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-rose-600 font-semibold mb-0.5">
              <XCircle className="w-3.5 h-3.5" />
              Salah (+0)
            </div>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200 tabular-nums">
              {result.wrongCount} soal
            </span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-slate-500 font-semibold mb-0.5">
              <Clock className="w-3.5 h-3.5" />
              Waktu
            </div>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200 tabular-nums">
              {formatTime(result.timeSpentSeconds)}
            </span>
          </div>
        </div>

        {/* Requirement 6: Google Sheets & Drive Output Card */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-left space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-emerald-950 dark:text-emerald-200">
                  Output Rekap Nilai ke Google Sheets
                </h4>
                <p className="text-[11px] text-emerald-800/80 dark:text-emerald-300">
                  Data nama, kelas, skor, dan jawaban per butir (1-20) otomatis tersimpan ke Google Drive.
                </p>
              </div>
            </div>

            {exportedUrl && (
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1 shrink-0 bg-white dark:bg-slate-900 px-2 py-1 rounded-md border border-emerald-300 dark:border-emerald-700">
                <Check className="w-3 h-3 text-emerald-600" /> Tersimpan di Drive
              </span>
            )}
          </div>

          {exportError && (
            <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{exportError}</span>
            </div>
          )}

          {exportedUrl ? (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-1">
              <span className="text-xs text-slate-600 dark:text-slate-400 truncate max-w-xs">
                File: <strong>Rekap Nilai GeoTKA SMP Kelas 9</strong>
              </span>
              <a
                href={exportedUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors shrink-0"
              >
                <span>Buka Google Sheets di Drive</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ) : (
            <button
              onClick={() => handleExportToGoogle()}
              disabled={isExporting}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Menyimpan ke Google Drive...</span>
                </>
              ) : isGoogleConnected ? (
                <>
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Kirim Hasil ke Google Sheets ({currentUser?.email || 'Drive'})</span>
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Sambungkan Akun Google & Simpan ke Drive</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={onReviewAll}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            Buka Pembahasan Soal
          </button>
          <button
            onClick={onRetry}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Coba Simulasi Lagi
          </button>
        </div>
      </div>
    </div>
  );
};
