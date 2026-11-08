import React, { useState, useEffect } from 'react';
import { Question } from '../types/geometry';
import { GeometryDiagram } from './GeometryDiagram';
import { CheckCircle2, XCircle, Lightbulb, ChevronDown, ChevronUp, Bookmark, Sparkles, BookOpen } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedOption?: 'A' | 'B' | 'C' | 'D';
  onSelectOption: (option: 'A' | 'B' | 'C' | 'D') => void;
  isMarked?: boolean;
  onToggleMark?: () => void;
  isExamSubmitted?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  selectedOption,
  onSelectOption,
  isMarked = false,
  onToggleMark,
  isExamSubmitted = false,
}) => {
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isExplanationOpen, setIsExplanationOpen] = useState<boolean>(Boolean(selectedOption) || isExamSubmitted);

  // CRITICAL REQUIREMENT: Reset hint and explanation state when switching questions
  // Never show explanation/key if the new question has not been answered yet!
  useEffect(() => {
    setShowHint(false);
    setIsExplanationOpen(Boolean(selectedOption) || isExamSubmitted);
  }, [question.id, selectedOption, isExamSubmitted]);

  const isAnswered = Boolean(selectedOption);
  const isCorrect = selectedOption === question.correctAnswer;
  // Strictly reveal key and review only after the student has clicked an option or exam is submitted
  const showReviewState = isAnswered || isExamSubmitted;

  const handleOptionClick = (optId: 'A' | 'B' | 'C' | 'D') => {
    if (isExamSubmitted) return;
    onSelectOption(optId);
    // As soon as student clicks, open explanation immediately
    setIsExplanationOpen(true);
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-xs space-y-6">
      {/* Top Question Meta Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-bold text-sm text-indigo-600 dark:text-indigo-400">
            Soal {questionNumber} dari {totalQuestions}
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {question.dimension}
          </span>
          <span aria-hidden="true">·</span>
          <span>{question.category}</span>
          <span aria-hidden="true">·</span>
          <span className="text-amber-600 dark:text-amber-400 font-semibold font-math">
            Bobot: 5 Poin
          </span>
        </div>

        {/* Mark for review button */}
        {onToggleMark && !isExamSubmitted && (
          <button
            onClick={onToggleMark}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              isMarked
                ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isMarked ? 'fill-amber-500 text-amber-500' : ''}`} />
            {isMarked ? 'Ditandai Ragu-ragu' : 'Tandai Ragu-ragu'}
          </button>
        )}
      </div>

      {/* Title & Question Prompt */}
      <div className="space-y-2">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 leading-snug">
          {question.title}
        </h3>
        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
          {question.prompt}
        </p>
      </div>

      {/* Geometry Diagram Visualizer */}
      <div className="my-3">
        <GeometryDiagram config={question.diagramConfig} />
      </div>

      {/* Multiple Choice Options List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Pilihan Jawaban (Klik untuk Menjawab):
          </span>
          {!showReviewState && (
            <span className="text-[11px] text-slate-400 italic">
              Kunci & pembahasan muncul setelah kamu memilih
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {question.options.map((opt) => {
            const isThisSelected = selectedOption === opt.id;
            const isThisCorrect = opt.id === question.correctAnswer;

            let optionClasses =
              'w-full min-h-[50px] p-3.5 sm:p-4 rounded-xl border text-left flex items-start gap-3.5 transition-all text-sm font-medium focus-visible:ring-2 focus-visible:ring-indigo-500 ';

            // Review state ONLY active when the student has actually clicked an answer
            if (showReviewState) {
              if (isThisCorrect) {
                optionClasses +=
                  'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold ring-1 ring-emerald-500';
              } else if (isThisSelected && !isThisCorrect) {
                optionClasses +=
                  'bg-rose-50/80 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-200 ring-1 ring-rose-500';
              } else {
                optionClasses +=
                  'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 opacity-60';
              }
            } else {
              // Unanswered: clean state with subtle hover
              optionClasses +=
                'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 text-slate-800 dark:text-slate-200 hover:bg-slate-50/80 dark:hover:bg-slate-800/60 active:scale-[0.99] cursor-pointer';
            }

            return (
              <button
                key={opt.id}
                type="button"
                disabled={isExamSubmitted}
                onClick={() => handleOptionClick(opt.id)}
                className={optionClasses}
              >
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                    showReviewState && isThisCorrect
                      ? 'bg-emerald-600 text-white'
                      : showReviewState && isThisSelected && !isThisCorrect
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {opt.id}
                </span>
                <span className="flex-1 pt-0.5 leading-normal">{opt.text}</span>
                {showReviewState && isThisCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                )}
                {showReviewState && isThisSelected && !isThisCorrect && (
                  <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hint Accordion (Available before student answers) */}
      {!showReviewState && (
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
          >
            <Lightbulb className="w-4 h-4" />
            {showHint ? 'Sembunyikan Petunjuk Awal' : 'Perlu Petunjuk Rumus?'}
          </button>
          {showHint && (
            <div className="mt-2.5 p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/80 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
              <strong>💡 Petunjuk Pengerjaan:</strong> {question.hintText}
            </div>
          )}
        </div>
      )}

      {/* Immediate Result Banner (Triggered immediately when student clicks an answer) */}
      {showReviewState && isAnswered && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
            isCorrect
              ? 'bg-emerald-50/90 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : 'bg-rose-50/90 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
          }`}
        >
          <div className="flex items-center gap-3">
            {isCorrect ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0" />
            )}
            <div>
              <p className="text-sm font-bold flex items-center gap-2">
                {isCorrect ? 'Jawaban Benar! (+5 Poin)' : 'Jawaban Salah (+0 Poin)'}
              </p>
              <p className="text-xs opacity-90 mt-0.5">
                Pilihan Kamu: <strong>{selectedOption}</strong> · Kunci Jawaban Benar:{' '}
                <strong>Pilihan {question.correctAnswer}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsExplanationOpen(!isExplanationOpen)}
            className="text-xs font-semibold underline flex items-center gap-1 cursor-pointer"
          >
            {isExplanationOpen ? (
              <>
                Tutup Pembahasan <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                Buka Pembahasan <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      )}

      {/* Detailed Pembahasan / Solution (Only rendered after answer is selected) */}
      {showReviewState && isExplanationOpen && (
        <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Pembahasan Lengkap & Langkah Pengerjaan
            </h4>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Kunci: {question.correctAnswer}
            </span>
          </div>

          {/* Key Formula Snippet */}
          <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-xl border border-indigo-200/60 dark:border-indigo-900/60 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-0.5">
              <span className="font-semibold text-indigo-950 dark:text-indigo-200">Rumus Pokok:</span>
              <p className="font-math font-semibold text-indigo-900 dark:text-indigo-300 text-sm">
                {question.explanation.keyFormula}
              </p>
            </div>
          </div>

          {/* Step-by-step breakdown */}
          <div className="space-y-3">
            {question.explanation.steps.map((st) => (
              <div
                key={st.stepNumber}
                className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/70 dark:border-slate-800 text-xs space-y-1.5"
              >
                <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
                  <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center text-[10px]">
                    {st.stepNumber}
                  </span>
                  <span>{st.title}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 pl-7 whitespace-pre-line leading-relaxed">
                  {st.content}
                </p>
                {st.formulaSnippet && (
                  <div className="ml-7 mt-1 px-2.5 py-1 bg-white dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-700/80 font-math text-[11px] text-slate-800 dark:text-slate-200 inline-block">
                    {st.formulaSnippet}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Tip / Trik Cepat TKA */}
          <div className="p-3 bg-amber-50/60 dark:bg-amber-950/40 rounded-xl border border-amber-200/60 dark:border-amber-900/60 text-xs text-amber-950 dark:text-amber-200">
            <span className="font-bold flex items-center gap-1 mb-1">
              ⚡ Trik Cepat Ujian TKA:
            </span>
            <p className="leading-relaxed">{question.explanation.quickTip}</p>
          </div>

          {/* Concept summary */}
          <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
            Kurikulum SMP: {question.explanation.conceptSummary}
          </p>
        </div>
      )}
    </div>
  );
};
