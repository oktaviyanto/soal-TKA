import React from 'react';
import { QuizResult } from '../types/geometry';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Cell,
  LabelList,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Target,
  Trophy,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from 'lucide-react';

export interface ScoreTrendBarChartProps {
  history: QuizResult[];
  onStartQuiz?: () => void;
}

interface ChartItem {
  session: string;
  shortLabel: string;
  fullDate: string;
  score: number;
  correctCount: number;
  wrongCount: number;
  durationSeconds: number;
  mode: string;
  color: string;
  statusLabel: string;
  grade: string;
}

const getScoreColor = (score: number): { color: string; label: string; grade: string } => {
  if (score >= 85) {
    return { color: '#10b981', label: 'Sangat Memuaskan', grade: 'A' }; // Emerald
  }
  if (score >= 75) {
    return { color: '#4f46e5', label: 'Tuntas KKM', grade: 'B' }; // Indigo
  }
  if (score >= 60) {
    return { color: '#f59e0b', label: 'Cukup / Penguatan', grade: 'C' }; // Amber
  }
  return { color: '#f43f5e', label: 'Perlu Pendampingan', grade: 'D' }; // Rose
};

export const ScoreTrendBarChart: React.FC<ScoreTrendBarChartProps> = ({
  history,
  onStartQuiz,
}) => {
  // Filter legitimate completed sessions with answered questions
  const completedHistory = history.filter((item) => {
    if (!item || !item.totalQuestions) return false;
    const answeredCount = Object.keys(item.userAnswers || {}).length;
    const evaluatedCount = (item.correctCount || 0) + (item.wrongCount || 0);
    return answeredCount > 0 || evaluatedCount > 0;
  });

  const hasData = completedHistory.length > 0;

  // Transform data for bar chart visualization over time
  const data: ChartItem[] = completedHistory.map((item, idx) => {
    const meta = getScoreColor(item.score);
    const shortDate = item.date ? item.date.split(',')[0] || item.date : `Sesi ${idx + 1}`;

    return {
      session: `Sesi ${idx + 1}`,
      shortLabel: completedHistory.length > 6 ? `#${idx + 1}` : `Sesi ${idx + 1}`,
      fullDate: item.date || `Sesi ${idx + 1}`,
      score: item.score,
      correctCount: item.correctCount,
      wrongCount: item.wrongCount,
      durationSeconds: item.timeSpentSeconds,
      mode: item.mode === 'simulasi' ? 'Simulasi Ujian' : 'Latihan Mandiri',
      color: meta.color,
      statusLabel: meta.label,
      grade: meta.grade,
    };
  });

  // Trend analysis calculations
  const totalSessions = data.length;
  const latestScore = totalSessions > 0 ? data[totalSessions - 1].score : 0;
  const firstScore = totalSessions > 0 ? data[0].score : 0;
  const highestScore = totalSessions > 0 ? Math.max(...data.map((d) => d.score)) : 0;
  const avgScore =
    totalSessions > 0
      ? Math.round(data.reduce((acc, curr) => acc + curr.score, 0) / totalSessions)
      : 0;

  const scoreDiff = totalSessions > 1 ? latestScore - firstScore : 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-display flex items-center gap-2">
                <span>Grafik Batang Tren Skor Kuis</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {totalSessions} Sesi Selesai
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Visualisasi dinamika capaian skor aktual siswa dari waktu ke waktu (skala 0 - 100).
              </p>
            </div>
          </div>
        </div>

        {/* Legend Pills */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#10b981]" />
            <span>&ge;85 (A)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#4f46e5]" />
            <span>75-80 (B)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#f59e0b]" />
            <span>60-70 (C)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#f43f5e]" />
            <span>&lt;60 (D)</span>
          </span>
        </div>
      </div>

      {/* Mini KPI Highlights */}
      {hasData && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800/80">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
              Skor Terakhir (Aktual)
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-bold font-math text-slate-900 dark:text-slate-100">
                {latestScore}
              </span>
              <span className="text-[11px] text-slate-400">/ 100</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
              Skor Tertinggi
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-bold font-math text-emerald-600 dark:text-emerald-400">
                {highestScore}
              </span>
              <span className="text-[11px] text-slate-400">/ 100</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
              Rata-rata Skor
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-bold font-math text-indigo-600 dark:text-indigo-400">
                {avgScore}
              </span>
              <span className="text-[11px] text-slate-400">/ 100</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
              Dinamika Tren
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              {scoreDiff > 0 ? (
                <>
                  <ArrowUpRight className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-math">
                    +{scoreDiff} Poin
                  </span>
                </>
              ) : scoreDiff < 0 ? (
                <>
                  <ArrowDownRight className="w-4 h-4 text-rose-500 shrink-0" />
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-400 font-math">
                    {scoreDiff} Poin
                  </span>
                </>
              ) : (
                <>
                  <Minus className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    Stabil
                  </span>
                </>
              )}
              <span className="text-[10px] text-slate-400 ml-1">vs Sesi 1</span>
            </div>
          </div>
        </div>
      )}

      {/* Chart Viewport */}
      {!hasData ? (
        <div className="h-64 flex flex-col items-center justify-center p-6 text-center space-y-3 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
          <BarChart3 className="w-8 h-8 text-slate-400" />
          <div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Belum ada riwayat skor kuis untuk divisualisasikan
            </p>
            <p className="text-xs text-slate-500 max-w-sm mt-0.5">
              Grafik batang tren skor akan otomatis muncul di sini setelah kamu menyelesaikan minimal 1 sesi latihan atau simulasi (20 butir soal).
            </p>
          </div>
          {onStartQuiz && (
            <button
              onClick={onStartQuiz}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Mulai Sesi Ujian Sekarang
            </button>
          )}
        </div>
      ) : (
        <div className="w-full h-72 sm:h-80 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 22, right: 16, left: -20, bottom: 6 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#94a3b8"
                opacity={0.2}
              />
              <XAxis
                dataKey="shortLabel"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
              />
              <YAxis
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload as ChartItem;
                    const m = Math.floor(d.durationSeconds / 60);
                    const s = d.durationSeconds % 60;
                    const durStr = `${m}m ${s < 10 ? '0' : ''}${s}s`;

                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1.5 border border-slate-700 min-w-[170px]">
                        <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-1">
                          <span className="font-bold text-sm text-indigo-300">{d.session}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-white/10">
                            {d.mode}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          <span>{d.fullDate}</span>
                        </div>
                        <div className="pt-1 space-y-1">
                          <div className="flex justify-between items-center gap-4">
                            <span className="text-slate-300">Skor Kuis:</span>
                            <span
                              className="font-math font-bold text-sm px-2 py-0.5 rounded-md"
                              style={{ backgroundColor: `${d.color}25`, color: d.color }}
                            >
                              {d.score} / 100
                            </span>
                          </div>
                          <div className="flex justify-between items-center gap-4 text-[11px]">
                            <span className="text-slate-400">Predikat:</span>
                            <span className="font-semibold text-slate-200">
                              {d.statusLabel} ({d.grade})
                            </span>
                          </div>
                          <div className="flex justify-between items-center gap-4 text-[11px]">
                            <span className="text-slate-400">Jawaban Benar:</span>
                            <span className="font-math font-medium text-emerald-400">
                              {d.correctCount} / 20 Soal
                            </span>
                          </div>
                          <div className="flex justify-between items-center gap-4 text-[11px]">
                            <span className="text-slate-400">Durasi:</span>
                            <span className="font-math text-slate-300">{durStr}</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {/* Target KKM line: 75 */}
              <ReferenceLine
                y={75}
                stroke="#f59e0b"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                label={{
                  value: 'Batas Tuntas KKM (75)',
                  position: 'insideTopRight',
                  fill: '#f59e0b',
                  fontSize: 11,
                  fontWeight: 600,
                }}
              />

              {/* Bar Component */}
              <Bar dataKey="score" name="Skor Kuis" radius={[6, 6, 0, 0]} maxBarSize={48}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                <LabelList
                  dataKey="score"
                  position="top"
                  style={{ fill: '#64748b', fontSize: 11, fontWeight: 'bold' }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Footer Info Strip */}
      {hasData && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-amber-500" />
            <span>Target kelulusan standar asesmen TKA Matematika SMP: <strong>75 poin (KKM)</strong>.</span>
          </div>
          <span>Diperbarui otomatis setiap sesi kuis diselesaikan.</span>
        </div>
      )}
    </div>
  );
};
