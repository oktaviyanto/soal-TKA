import React, { useState } from 'react';
import { Question, DimensionType } from '../types/geometry';
import { QUESTION_BANK } from '../data/questionBank';
import { GeometryDiagram } from './GeometryDiagram';
import {
  Bookmark,
  BookmarkX,
  Circle,
  Box,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface SavedQuestionsViewProps {
  bookmarkedIds: string[];
  onToggleBookmark: (questionId: string) => void;
  onGoToQuiz: () => void;
}

export const SavedQuestionsView: React.FC<SavedQuestionsViewProps> = ({
  bookmarkedIds,
  onToggleBookmark,
  onGoToQuiz,
}) => {
  const [filterDim, setFilterDim] = useState<DimensionType | 'ALL'>('ALL');
  const [expandedExplanations, setExpandedExplanations] = useState<Record<string, boolean>>({});
  const [interactiveAnswers, setInteractiveAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});

  // Resolve question objects from question bank
  const savedQuestions: Question[] = bookmarkedIds
    .map((id) => QUESTION_BANK.find((q) => q.id === id))
    .filter((q): q is Question => Boolean(q));

  const filteredQuestions = savedQuestions.filter((q) => {
    if (filterDim === 'ALL') return true;
    return q.dimension === filterDim;
  });

  const toggleExplanation = (qId: string) => {
    setExpandedExplanations((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const handleSelectOption = (qId: string, optId: 'A' | 'B' | 'C' | 'D') => {
    setInteractiveAnswers((prev) => ({
      ...prev,
      [qId]: optId,
    }));
    // Auto-open explanation when student tests themselves
    setExpandedExplanations((prev) => ({
      ...prev,
      [qId]: true,
    }));
  };

  const lingkaranCount = savedQuestions.filter((q) => q.dimension === 'Lingkaran').length;
  const bangunRuangCount = savedQuestions.filter((q) => q.dimension === 'Bangun Ruang').length;

  return (
    <div className="w-full space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span>Soal Tersimpan · Koleksi Belajar Mandiri</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Daftar butir soal yang kamu tandai untuk diulang, dipelajari kembali pembahasannya, dan diuji pemahamannya.
          </p>
        </div>

        <button
          onClick={onGoToQuiz}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <span>Kembali ke Latihan</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Filter & Counter Bar */}
      {savedQuestions.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Filter Topik:
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setFilterDim('ALL')}
                className={`text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  filterDim === 'ALL'
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Semua ({savedQuestions.length})
              </button>
              <button
                onClick={() => setFilterDim('Lingkaran')}
                className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  filterDim === 'Lingkaran'
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Circle className="w-3 h-3" />
                Lingkaran ({lingkaranCount})
              </button>
              <button
                onClick={() => setFilterDim('Bangun Ruang')}
                className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  filterDim === 'Bangun Ruang'
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Box className="w-3 h-3" />
                Bangun Ruang ({bangunRuangCount})
              </button>
            </div>
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Menampilkan {filteredQuestions.length} dari {savedQuestions.length} soal tersimpan
          </span>
        </div>
      )}

      {/* Main Content List */}
      {savedQuestions.length === 0 ? (
        <div className="p-8 sm:p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-500 mx-auto">
            <Bookmark className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Belum Ada Soal yang Disimpan
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
              Saat mengerjakan soal di mode <strong>Latihan Mandiri</strong> atau <strong>Simulasi Ujian</strong>, klik tombol <strong>"Simpan Soal"</strong> di pojok kanan atas lembar soal untuk menyimpannya di tab ini.
            </p>
          </div>
          <button
            onClick={onGoToQuiz}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
          >
            <span>Mulai Buka Latihan Soal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
          Tidak ada soal tersimpan untuk kategori topik ini.
        </div>
      ) : (
        <div className="space-y-6">
          {filteredQuestions.map((q) => {
            const isExplanationOpen = expandedExplanations[q.id] || false;
            const selectedOpt = interactiveAnswers[q.id];
            const isAnswered = Boolean(selectedOpt);
            const isCorrect = selectedOpt === q.correctAnswer;

            return (
              <div
                key={q.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-xs space-y-5"
              >
                {/* Card Top Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-bold text-sm text-indigo-600 dark:text-indigo-400">
                      Soal #{q.questionNumber}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {q.dimension}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{q.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                      {q.difficulty}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleBookmark(q.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60 transition-colors cursor-pointer"
                    title="Hapus dari daftar soal tersimpan"
                  >
                    <BookmarkX className="w-3.5 h-3.5" />
                    <span>Hapus Simpanan</span>
                  </button>
                </div>

                {/* Question Title & Prompt */}
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {q.title}
                  </h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {q.prompt}
                  </p>
                </div>

                {/* SVG Geometric Diagram */}
                <div className="w-full max-w-md mx-auto my-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3 border border-slate-100 dark:border-slate-800 flex items-center justify-center">
                  <GeometryDiagram config={q.diagramConfig} />
                </div>

                {/* Interactive Practice Options */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-500 block">
                    {isAnswered ? 'Jawaban Kamu:' : 'Coba Jawab Ulang Soal Ini:'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {q.options.map((opt) => {
                      const isSelected = selectedOpt === opt.id;
                      const isOptionCorrect = opt.id === q.correctAnswer;

                      let btnStyle =
                        'flex items-center gap-3 p-3 text-xs sm:text-sm font-medium rounded-xl border text-left transition-all cursor-pointer ';

                      if (isAnswered) {
                        if (isOptionCorrect) {
                          btnStyle +=
                            'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-100 font-bold ';
                        } else if (isSelected) {
                          btnStyle +=
                            'bg-rose-50 dark:bg-rose-950/60 border-rose-400 text-rose-900 dark:text-rose-100 ';
                        } else {
                          btnStyle +=
                            'bg-slate-50/70 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 text-slate-400 opacity-60 ';
                        }
                      } else {
                        btnStyle +=
                          'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 ';
                      }

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleSelectOption(q.id, opt.id)}
                          className={btnStyle}
                        >
                          <span
                            className={`w-6 h-6 rounded-lg font-bold flex items-center justify-center text-xs shrink-0 ${
                              isAnswered && isOptionCorrect
                                ? 'bg-emerald-600 text-white'
                                : isAnswered && isSelected
                                ? 'bg-rose-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {opt.id}
                          </span>
                          <span className="flex-1">{opt.text}</span>
                          {isAnswered && isOptionCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                          {isAnswered && isSelected && !isOptionCorrect && (
                            <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Explanation Toggle & Content */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => toggleExplanation(q.id)}
                    className="flex items-center justify-between w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                      <span>Kunci Jawaban & Pembahasan Lengkap</span>
                    </span>
                    {isExplanationOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  {isExplanationOpen && (
                    <div className="mt-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-4 text-xs">
                      {/* Key Formula */}
                      <div className="p-3 rounded-lg bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-900/60 text-indigo-950 dark:text-indigo-200">
                        <span className="font-bold block text-[11px] uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
                          Rumus Kunci:
                        </span>
                        <code className="font-math font-bold text-sm text-indigo-700 dark:text-indigo-300">
                          {q.explanation.keyFormula}
                        </code>
                      </div>

                      {/* Step-by-Step Breakdown */}
                      <div className="space-y-2.5">
                        <span className="font-bold text-slate-900 dark:text-slate-100 block">
                          Langkah Penyelesaian Sistematis:
                        </span>
                        {q.explanation.steps.map((st) => (
                          <div
                            key={st.stepNumber}
                            className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/70 dark:border-slate-800 space-y-1"
                          >
                            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                              Langkah {st.stepNumber}: {st.title}
                            </span>
                            <p className="text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                              {st.content}
                            </p>
                            {st.formulaSnippet && (
                              <div className="pt-1">
                                <span className="font-math font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[11px]">
                                  {st.formulaSnippet}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Quick Tip & Concept Summary */}
                      <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-950 dark:text-amber-200">
                        <span className="font-bold flex items-center gap-1 text-[11px] uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          Tips Kilat TKA:
                        </span>
                        <p className="leading-relaxed">{q.explanation.quickTip}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
