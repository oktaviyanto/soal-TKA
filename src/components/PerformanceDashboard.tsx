import React, { useState } from 'react';
import { QuizResult, StudentProfile } from '../types/geometry';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import {
  TrendingUp,
  Award,
  Target,
  Clock,
  Circle,
  Box,
  FileSpreadsheet,
  ExternalLink,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Download,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { evaluateAchievements } from '../data/achievements';
import { AchievementBadgeCard } from './AchievementBadgeCard';
import { generateStudentPortfolioPdf } from '../services/pdfReportGenerator';

interface PerformanceDashboardProps {
  history: QuizResult[];
  student: StudentProfile;
  onStartQuiz: () => void;
  onClearHistory: () => void;
  onOpenProfile?: () => void;
  hasGoogleToken?: boolean;
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  history,
  student,
  onStartQuiz,
  onClearHistory,
  onOpenProfile,
  hasGoogleToken = false,
}) => {
  const [activeMetricTab, setActiveMetricTab] = useState<'all' | 'score' | 'accuracy'>('all');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [pdfSuccessToast, setPdfSuccessToast] = useState<boolean>(false);

  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      await generateStudentPortfolioPdf({
        history,
        student,
        hasGoogleToken,
      });
      setPdfSuccessToast(true);
      setTimeout(() => setPdfSuccessToast(false), 4500);
    } catch (err) {
      console.error('Failed to generate PDF portfolio:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // If user has no sessions yet, provide clean progression data
  const hasActualHistory = history.length > 0;

  // Prepare chart data
  const chartData = (hasActualHistory ? history : []).map((item, idx) => {
    const accuracy = Math.round((item.correctCount / item.totalQuestions) * 100);
    const lingAcc =
      item.breakdown.lingkaran.total > 0
        ? Math.round((item.breakdown.lingkaran.correct / item.breakdown.lingkaran.total) * 100)
        : 0;
    const brAcc =
      item.breakdown.bangunRuang.total > 0
        ? Math.round((item.breakdown.bangunRuang.correct / item.breakdown.bangunRuang.total) * 100)
        : 0;

    return {
      session: `Sesi ${idx + 1}`,
      date: item.date,
      skor: item.score,
      akurasi: accuracy,
      lingkaran: lingAcc,
      bangunRuang: brAcc,
      durasiMenit: Math.round(item.timeSpentSeconds / 60),
      sheetUrl: item.googleSheetUrl,
    };
  });

  // Calculate statistics
  const totalSessions = history.length;
  const highestScore = totalSessions > 0 ? Math.max(...history.map((h) => h.score)) : 0;
  const avgScore =
    totalSessions > 0
      ? Math.round(history.reduce((acc, h) => acc + h.score, 0) / totalSessions)
      : 0;
  const avgAccuracy =
    totalSessions > 0
      ? Math.round(
          history.reduce(
            (acc, h) => acc + (h.correctCount / h.totalQuestions) * 100,
            0
          ) / totalSessions
        )
      : 0;

  const totalLingkaranCorrect = history.reduce((acc, h) => acc + h.breakdown.lingkaran.correct, 0);
  const totalLingkaranAttempted = history.reduce((acc, h) => acc + h.breakdown.lingkaran.total, 0);
  const lingOverallAcc =
    totalLingkaranAttempted > 0
      ? Math.round((totalLingkaranCorrect / totalLingkaranAttempted) * 100)
      : 0;

  const totalBRCorrect = history.reduce((acc, h) => acc + h.breakdown.bangunRuang.correct, 0);
  const totalBRAttempted = history.reduce((acc, h) => acc + h.breakdown.bangunRuang.total, 0);
  const brOverallAcc =
    totalBRAttempted > 0 ? Math.round((totalBRCorrect / totalBRAttempted) * 100) : 0;

  // Achievements evaluation
  const achievements = evaluateAchievements(history, hasGoogleToken);
  const unlockedBadgesCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="w-full space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Performa Saya · Grafik Perkembangan TKA
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Visualisasi skor, persentase akurasi, dan perbandingan penguasaan materi Lingkaran vs Bangun Ruang.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {hasActualHistory && (
            <button
              onClick={onClearHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 transition-colors cursor-pointer"
              title="Bersihkan riwayat sesi"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Riwayat</span>
            </button>
          )}

          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf || history.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            title="Unduh Laporan Portofolio Belajar PDF Resmi"
          >
            {isGeneratingPdf ? (
              <div className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <FileText className="w-3.5 h-3.5 text-indigo-400 dark:text-indigo-600" />
            )}
            <span>{isGeneratingPdf ? 'Menyusun PDF...' : 'Unduh Portofolio PDF'}</span>
          </button>

          <button
            onClick={onStartQuiz}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <span>Mulai Latihan Baru</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Skor Tertinggi */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Skor Tertinggi</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-display text-indigo-600 dark:text-indigo-400 tabular-nums">
            {highestScore}
            <span className="text-xs font-normal text-slate-400"> / 100</span>
          </div>
          <p className="text-[11px] text-slate-500">
            {highestScore >= 80 ? 'Target Lulus TKA Tercapai' : 'Target KKM: 75'}
          </p>
        </div>

        {/* Card 2: Rata-rata Skor */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Rata-rata Skor</span>
            <Target className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-slate-100 tabular-nums">
            {avgScore}
            <span className="text-xs font-normal text-slate-400"> / 100</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Dari {totalSessions} kali pengerjaan
          </p>
        </div>

        {/* Card 3: Rata-rata Akurasi */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Akurasi Jawaban</span>
            <Sparkles className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-display text-emerald-600 dark:text-emerald-400 tabular-nums">
            {avgAccuracy}%
          </div>
          <p className="text-[11px] text-slate-500">
            Persentase jawaban tepat
          </p>
        </div>

        {/* Card 4: Sesi Selesai */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Total Sesi Ujian</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-slate-100 tabular-nums">
            {totalSessions}
          </div>
          <p className="text-[11px] text-slate-500">
            Kelas: {student.grade}
          </p>
        </div>
      </div>

      {/* Main Chart: Progress Over Time (Recharts AreaChart) */}
      <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>Grafik Perkembangan Skor & Akurasi dari Waktu ke Waktu</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Menunjukkan tren perolehan nilai (skala 0 - 100) dan target nilai lulus (75).
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setActiveMetricTab('all')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                activeMetricTab === 'all'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setActiveMetricTab('score')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                activeMetricTab === 'score'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Skor Saja
            </button>
            <button
              onClick={() => setActiveMetricTab('accuracy')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                activeMetricTab === 'accuracy'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Akurasi Saja
            </button>
          </div>
        </div>

        {/* Chart Viewport */}
        {chartData.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center p-6 text-center space-y-3 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
            <TrendingUp className="w-8 h-8 text-slate-400" />
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Belum ada data riwayat pengerjaan
              </p>
              <p className="text-xs text-slate-500 max-w-sm mt-0.5">
                Selesaikan minimal 1 sesi latihan atau simulasi (20 butir soal) untuk melihat grafik perkembangan nilai kamu di sini.
              </p>
            </div>
            <button
              onClick={onStartQuiz}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Mulai Ujian 20 Soal Sekarang
            </button>
          </div>
        ) : (
          <div className="w-full h-72 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="accGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" opacity={0.2} />
                <XAxis
                  dataKey="session"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis
                  domain={[0, 100]}
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                  ticks={[0, 25, 50, 75, 100]}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1.5 border border-slate-700">
                          <p className="font-bold text-sm text-indigo-300">{data.session}</p>
                          <p className="text-[11px] text-slate-400">{data.date}</p>
                          <div className="pt-1 space-y-1 border-t border-slate-800">
                            <p className="flex justify-between gap-4">
                              <span>Skor Total:</span>
                              <strong className="text-indigo-400 font-math text-sm">{data.skor} / 100</strong>
                            </p>
                            <p className="flex justify-between gap-4">
                              <span>Akurasi:</span>
                              <strong className="text-emerald-400 font-math">{data.akurasi}%</strong>
                            </p>
                            <p className="flex justify-between gap-4">
                              <span>Akurasi Lingkaran:</span>
                              <span className="font-math">{data.lingkaran}%</span>
                            </p>
                            <p className="flex justify-between gap-4">
                              <span>Akurasi Bangun Ruang:</span>
                              <span className="font-math">{data.bangunRuang}%</span>
                            </p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />

                {/* Target line: 75 */}
                <ReferenceLine
                  y={75}
                  stroke="#f59e0b"
                  strokeDasharray="4 4"
                  label={{ value: 'Target KKM (75)', position: 'insideTopRight', fill: '#f59e0b', fontSize: 11 }}
                />

                {(activeMetricTab === 'all' || activeMetricTab === 'score') && (
                  <Area
                    type="monotone"
                    dataKey="skor"
                    name="Skor Ujian (Max 100)"
                    stroke="#4f46e5"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#scoreGradient)"
                    dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6 }}
                  />
                )}

                {(activeMetricTab === 'all' || activeMetricTab === 'accuracy') && (
                  <Area
                    type="monotone"
                    dataKey="akurasi"
                    name="Akurasi Jawaban (%)"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#accGradient)"
                    dot={{ r: 3.5, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Secondary Chart & Topic Mastery Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Bar Chart Komparasi Lingkaran vs Bangun Ruang per Sesi */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Perbandingan Akurasi: Lingkaran vs Bangun Ruang
            </h3>
            <p className="text-xs text-slate-500">
              Melihat konsistensi pemahaman materi pada setiap sesi ujian yang telah diselesaikan.
            </p>
          </div>

          {chartData.length > 0 ? (
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                  <XAxis dataKey="session" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-lg text-xs space-y-1">
                            <span className="font-bold text-indigo-300">{d.session}</span>
                            <p className="flex justify-between gap-3 text-slate-300">
                              <span>Lingkaran:</span>
                              <strong className="text-indigo-400 font-math">{d.lingkaran}%</strong>
                            </p>
                            <p className="flex justify-between gap-3 text-slate-300">
                              <span>Bangun Ruang:</span>
                              <strong className="text-emerald-400 font-math">{d.bangunRuang}%</strong>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend verticalAlign="top" height={30} iconType="circle" />
                  <Bar dataKey="lingkaran" name="Lingkaran (%)" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="bangunRuang" name="Bangun Ruang (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-56 flex items-center justify-center text-xs text-slate-400">
              Grafik komparasi akan muncul setelah sesi pertama selesai.
            </div>
          )}
        </div>

        {/* Right: Topic Mastery Breakdown Cards */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Ringkasan Penguasaan Materi
            </h3>
            <p className="text-xs text-slate-500">
              Akumulasi tingkat keberhasilan menjawab dari seluruh sesi.
            </p>
          </div>

          <div className="space-y-4">
            {/* Lingkaran Progress */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                  <Circle className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Lingkaran (8 Soal per Sesi)</span>
                </span>
                <span className="font-math font-bold text-indigo-600 dark:text-indigo-400">
                  {lingOverallAcc}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full bg-indigo-600 transition-all duration-500 rounded-full"
                  style={{ width: `${lingOverallAcc}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-500 block">
                {totalLingkaranCorrect} benar dari {totalLingkaranAttempted} total soal lingkaran
              </span>
            </div>

            {/* Bangun Ruang Progress */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                  <Box className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Bangun Ruang (12 Soal per Sesi)</span>
                </span>
                <span className="font-math font-bold text-emerald-600 dark:text-emerald-400">
                  {brOverallAcc}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full bg-emerald-600 transition-all duration-500 rounded-full"
                  style={{ width: `${brOverallAcc}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-500 block">
                {totalBRCorrect} benar dari {totalBRAttempted} total soal bangun ruang
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/70 dark:border-indigo-900/60 text-xs text-indigo-950 dark:text-indigo-200 space-y-1">
            <span className="font-bold flex items-center gap-1">
              💡 Rekomendasi Belajar:
            </span>
            <p className="leading-relaxed">
              {lingOverallAcc > brOverallAcc
                ? 'Penguasaan Lingkaran kamu sangat kuat! Pertahankan dan perbanyak latihan rumus Bangun Ruang Gabungan (Tabung + Kerucut/Bola).'
                : 'Pemahaman Bangun Ruang kamu sudah mantap! Perkuat kembali penerapan konsep juring dan keliling lingkaran pada soal kontekstual.'}
            </p>
          </div>
        </div>
      </div>

      {/* Achievements Showcase Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Lencana Prestasi Siswa ({unlockedBadgesCount} dari {achievements.length} Terbuka)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Raih lencana dengan mencapai skor sempurna 100, menyelesaikan soal kilat, dan belajar secara konsisten.
            </p>
          </div>

          {onOpenProfile && (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-semibold transition-colors cursor-pointer self-start sm:self-auto"
            >
              <span>Buka di Profil Siswa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {achievements.map((badge) => (
            <AchievementBadgeCard
              key={badge.id}
              badge={badge}
              onClick={onOpenProfile}
            />
          ))}
        </div>
      </div>

      {/* Portofolio Belajar Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 shadow-sm border border-indigo-900/40 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5 z-10 max-w-xl">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold">
            <FileText className="w-4 h-4 text-indigo-400" />
            <span>Dokumen Resmi Portofolio Asesmen Matematika</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold font-display tracking-tight text-white">
            Portofolio Perkembangan Belajar Siswa (Format PDF)
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Simpan dan cetak laporan perkembangan belajar lengkap dalam format PDF standar A4. Memuat identitas siswa ({student.name} · {student.grade}), rekapitulasi skor per sesi, akurasi materi Lingkaran vs Bangun Ruang, lencana prestasi terbuka, serta lembar tanda tangan guru dan orang tua.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-indigo-200/90 pt-0.5">
            <span>Standar A4 Siap Cetak</span>
            <span aria-hidden="true">·</span>
            <span>{totalSessions} Sesi Tersimpan</span>
            <span aria-hidden="true">·</span>
            <span>Verifikasi Mandiri</span>
          </div>
        </div>

        <div className="z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 w-full md:w-auto">
          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf || history.length === 0}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingPdf ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Menyusun Dokumen PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Unduh Portofolio PDF</span>
              </>
            )}
          </button>
        </div>

        {/* Decorative subtle background elements */}
        <div className="absolute right-0 top-0 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* History Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Riwayat Lembar Jawaban & Rekap Nilai
            </h3>
            <p className="text-xs text-slate-500">
              Daftar sesi latihan dan ketersediaan rekap Google Sheets di Google Drive.
            </p>
          </div>
        </div>

        {history.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">
            Belum ada riwayat pengerjaan yang tersimpan.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3">Sesi</th>
                  <th className="py-2.5 px-3">Tanggal</th>
                  <th className="py-2.5 px-3">Mode</th>
                  <th className="py-2.5 px-3">Skor (Max 100)</th>
                  <th className="py-2.5 px-3">Akurasi</th>
                  <th className="py-2.5 px-3">Durasi</th>
                  <th className="py-2.5 px-3 text-right">Google Drive</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {history.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                      Sesi #{history.length - idx}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{item.date}</td>
                    <td className="py-2.5 px-3">
                      <span className="capitalize text-slate-700 dark:text-slate-300">
                        {item.mode === 'simulasi' ? 'Simulasi Ujian' : 'Latihan Mandiri'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-math font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                        {item.score}
                      </span>
                      <span className="text-slate-400 text-[11px]"> / 100</span>
                    </td>
                    <td className="py-2.5 px-3 font-math font-medium text-slate-700 dark:text-slate-300">
                      {Math.round((item.correctCount / item.totalQuestions) * 100)}% ({item.correctCount}/20)
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 font-math">
                      {Math.floor(item.timeSpentSeconds / 60)}m {item.timeSpentSeconds % 60}s
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {item.googleSheetUrl ? (
                        <a
                          href={item.googleSheetUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5" />
                          <span>Buka Sheet</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-400 text-[11px]">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PDF Download Success Toast */}
      {pdfSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2.5 text-xs font-semibold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Portofolio Belajar PDF berhasil dibuat dan diunduh!</span>
        </div>
      )}
    </div>
  );
};
