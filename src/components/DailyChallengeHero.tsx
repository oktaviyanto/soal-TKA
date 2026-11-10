import React, { useState, useEffect } from 'react';
import {
  DailyChallengeQuestion,
  DailyChallengeRecord,
  DailyChallengeState,
  DailyTopic,
} from '../types/dailyChallenge';
import {
  DAILY_CHALLENGES,
  getDailyChallengeForDate,
  formatIndonesianDate,
  getTodayKey,
} from '../data/dailyChallengeBank';
import {
  Flame,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Award,
  Layers,
  Compass,
} from 'lucide-react';

const STORAGE_KEY_DAILY = 'geotka_daily_challenge_state';

interface DailyChallengeHeroProps {
  onGoToTopicQuiz?: (topic: string) => void;
}

export const DailyChallengeHero: React.FC<DailyChallengeHeroProps> = () => {
  const todayKey = getTodayKey();
  const todayFormatted = formatIndonesianDate();
  const defaultTodayQuestion = getDailyChallengeForDate();

  // Selected question (defaults to today's question, but student can explore other daily pool items)
  const [activeQuestion, setActiveQuestion] = useState<DailyChallengeQuestion>(defaultTodayQuestion);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [activeTopicFilter, setActiveTopicFilter] = useState<DailyTopic | 'Semua'>('Semua');

  // Daily Challenge state from LocalStorage
  const [dailyState, setDailyState] = useState<DailyChallengeState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DAILY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse daily challenge state', e);
    }
    return {
      records: {},
      streak: 0,
      lastCompletedDate: '',
      totalSolved: 0,
    };
  });

  // Check if today's challenge is already completed
  const todayRecord: DailyChallengeRecord | undefined = dailyState.records[todayKey];
  const isTodayCompleted = Boolean(todayRecord);

  // Sync submission state when activeQuestion changes or mounts
  useEffect(() => {
    const recordForThisQuestion = Object.values(dailyState.records).find(
      (r) => r.questionId === activeQuestion.id
    );

    if (recordForThisQuestion) {
      setSelectedOption(recordForThisQuestion.selectedAnswer);
      setIsSubmitted(true);
    } else {
      setSelectedOption(null);
      setIsSubmitted(false);
      setShowHint(false);
    }
  }, [activeQuestion.id, dailyState.records]);

  // Handle Answer Submission
  const handleSubmitAnswer = () => {
    if (!selectedOption) return;

    const isCorrect = selectedOption === activeQuestion.correctAnswer;
    const isTodayQuestion = activeQuestion.id === defaultTodayQuestion.id;

    const newRecord: DailyChallengeRecord = {
      dateString: todayKey,
      questionId: activeQuestion.id,
      selectedAnswer: selectedOption,
      isCorrect,
      completedAt: new Date().toISOString(),
    };

    // Calculate streak
    let newStreak = dailyState.streak;
    if (isTodayQuestion && !isTodayCompleted) {
      // Check if last completed was yesterday
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayKey = getTodayKey(yesterday);

      if (dailyState.lastCompletedDate === yesterdayKey) {
        newStreak += 1;
      } else if (dailyState.lastCompletedDate === todayKey) {
        // already counted today
      } else {
        newStreak = 1; // start new streak
      }
    }

    const updatedState: DailyChallengeState = {
      ...dailyState,
      records: {
        ...dailyState.records,
        [todayKey]: isTodayQuestion ? newRecord : (dailyState.records[todayKey] || newRecord),
        [`extra-${activeQuestion.id}`]: newRecord,
      },
      streak: newStreak,
      lastCompletedDate: isTodayQuestion ? todayKey : dailyState.lastCompletedDate,
      totalSolved: dailyState.totalSolved + (isCorrect ? 1 : 0),
    };

    setDailyState(updatedState);
    try {
      localStorage.setItem(STORAGE_KEY_DAILY, JSON.stringify(updatedState));
    } catch (e) {
      console.error('Failed to save daily challenge state', e);
    }

    setIsSubmitted(true);
  };

  // Re-attempt question
  const handleReset = () => {
    setIsSubmitted(false);
    setSelectedOption(null);
    setShowHint(false);
  };

  // Topic badge color helper
  const getTopicStyle = (topic: DailyTopic) => {
    switch (topic) {
      case 'Phytagoras':
        return 'bg-indigo-500/20 text-indigo-200 border-indigo-400/40';
      case 'Segitiga':
        return 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40';
      case 'Segiempat':
        return 'bg-amber-500/20 text-amber-200 border-amber-400/40';
      case 'Transformasi Geometri':
        return 'bg-purple-500/20 text-purple-200 border-purple-400/40';
      case 'Lingkaran':
        return 'bg-blue-500/20 text-blue-200 border-blue-400/40';
      case 'Bangun Ruang':
        return 'bg-cyan-500/20 text-cyan-200 border-cyan-400/40';
      default:
        return 'bg-white/10 text-white border-white/20';
    }
  };

  // Available topics for filtering
  const allTopics: DailyTopic[] = [
    'Phytagoras',
    'Segitiga',
    'Segiempat',
    'Transformasi Geometri',
    'Lingkaran',
    'Bangun Ruang',
  ];

  const filteredQuestions =
    activeTopicFilter === 'Semua'
      ? DAILY_CHALLENGES
      : DAILY_CHALLENGES.filter((q) => q.topic === activeTopicFilter);

  return (
    <div className="mt-4 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-indigo-500/30 overflow-hidden shadow-lg transition-all duration-300">
      {/* ================= COMPACT HERO HEADER / STRIP ================= */}
      <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-indigo-950/80 via-slate-900/90 to-purple-950/80">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-md shadow-rose-900/30 animate-pulse">
              <Flame className="w-5 h-5 fill-amber-200 text-amber-100" />
            </div>
            {dailyState.streak > 0 && (
              <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-black border border-slate-900">
                {dailyState.streak}
              </span>
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-black tracking-wider uppercase bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">
                Daily Challenge Geometri
              </span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-xs text-slate-300 font-medium">{todayFormatted}</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getTopicStyle(
                  activeQuestion.topic
                )}`}
              >
                {activeQuestion.topic}
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2 mt-0.5">
              <span>{activeQuestion.title}</span>
              {isSubmitted && selectedOption === activeQuestion.correctAnswer && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/40">
                  <CheckCircle2 className="w-3 h-3" />
                  Tuntas
                </span>
              )}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          {dailyState.streak > 0 ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{dailyState.streak} Hari Berturut-turut</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-400 text-[11px]">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>+15 XP Harian</span>
            </div>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isExpanded
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs'
                : 'bg-white text-slate-900 hover:bg-slate-100 shadow-sm'
            }`}
          >
            <span>{isExpanded ? 'Tutup Soal' : isSubmitted ? 'Lihat Pembahasan' : 'Kerjakan Tantangan'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* ================= EXPANDED CHALLENGE WORKSPACE ================= */}
      {isExpanded && (
        <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-950/60 space-y-5 animate-in fade-in duration-200">
          {/* Topic Filter Pills (Segitiga, Segiempat, Phytagoras, Transformasi Geometri, dll) */}
          <div className="space-y-2 pb-3 border-b border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-medium">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>Pilihan Topik Tantangan (Diperluas):</span>
              </span>
              <button
                onClick={() => setActiveQuestion(defaultTodayQuestion)}
                className="text-xs text-indigo-400 hover:text-indigo-300 underline underline-offset-2 cursor-pointer"
              >
                Kembali ke Soal Hari Ini
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setActiveTopicFilter('Semua')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTopicFilter === 'Semua'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                Semua Topik ({DAILY_CHALLENGES.length})
              </button>
              {allTopics.map((topic) => {
                const count = DAILY_CHALLENGES.filter((q) => q.topic === topic).length;
                return (
                  <button
                    key={topic}
                    onClick={() => setActiveTopicFilter(topic)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeTopicFilter === topic
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {topic} ({count})
                  </button>
                );
              })}
            </div>

            {/* Quick selector bar for questions in chosen topic */}
            {activeTopicFilter !== 'Semua' && (
              <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-thin">
                <span className="text-[11px] text-slate-500 shrink-0">Pilih Soal:</span>
                {filteredQuestions.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => setActiveQuestion(q)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      activeQuestion.id === q.id
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/50 font-bold'
                        : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    #{idx + 1}: {q.subtopic}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Question Details Card */}
          <div className="bg-slate-900/80 rounded-xl p-4 sm:p-5 border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getTopicStyle(
                    activeQuestion.topic
                  )}`}
                >
                  {activeQuestion.topic}
                </span>
                <span className="text-xs text-slate-400 font-medium">• {activeQuestion.subtopic}</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                Tingkat: <strong>{activeQuestion.difficulty}</strong>
              </span>
            </div>

            {/* Prompt */}
            <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-sans font-medium">
              {activeQuestion.prompt}
            </p>

            {/* Options Selection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {activeQuestion.options.map((opt) => {
                const isSelected = selectedOption === opt.id;
                const isCorrect = opt.id === activeQuestion.correctAnswer;

                let optClass =
                  'bg-slate-800/70 hover:bg-slate-800 text-slate-200 border-slate-700';

                if (isSubmitted) {
                  if (isCorrect) {
                    optClass =
                      'bg-emerald-950/80 text-emerald-200 border-emerald-500 font-bold shadow-xs';
                  } else if (isSelected && !isCorrect) {
                    optClass = 'bg-rose-950/80 text-rose-200 border-rose-500 font-medium line-through';
                  } else {
                    optClass = 'bg-slate-900/60 text-slate-500 border-slate-800 opacity-60';
                  }
                } else if (isSelected) {
                  optClass =
                    'bg-indigo-600/30 text-indigo-100 border-indigo-400 ring-2 ring-indigo-500/40 font-semibold';
                }

                return (
                  <button
                    key={opt.id}
                    disabled={isSubmitted}
                    onClick={() => setSelectedOption(opt.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left text-xs sm:text-sm transition-all cursor-pointer disabled:cursor-default ${optClass}`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSubmitted && isCorrect
                          ? 'bg-emerald-600 text-white'
                          : isSubmitted && isSelected && !isCorrect
                          ? 'bg-rose-600 text-white'
                          : isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-700/80 text-slate-300'
                      }`}
                    >
                      {opt.id}
                    </span>
                    <span className="font-math">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Action Bar (Hint, Submit, Re-attempt) */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>{showHint ? 'Sembunyikan Petunjuk' : 'Petunjuk Rumus'}</span>
                </button>

                {isSubmitted && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Coba Lagi</span>
                  </button>
                )}
              </div>

              {!isSubmitted ? (
                <button
                  type="button"
                  disabled={!selectedOption}
                  onClick={handleSubmitAnswer}
                  className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
                    selectedOption
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  <span>Kirim Jawaban</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div className="flex items-center gap-2 text-xs font-bold">
                  {selectedOption === activeQuestion.correctAnswer ? (
                    <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-500/40">
                      <CheckCircle2 className="w-4 h-4" />
                      Jawaban Benar! +15 XP
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-rose-400 bg-rose-950/60 px-3 py-1.5 rounded-xl border border-rose-500/40">
                      <XCircle className="w-4 h-4" />
                      Jawaban Belum Tepat
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Hint Box */}
            {showHint && (
              <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-200 text-xs space-y-1 animate-in fade-in">
                <div className="flex items-center gap-1.5 font-bold text-amber-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Petunjuk Kunci & Formula:</span>
                </div>
                <p className="font-math">{activeQuestion.keyFormula}</p>
                <p className="text-amber-200/90 text-[11px] pt-1">{activeQuestion.hint}</p>
              </div>
            )}
          </div>

          {/* Explanation Step-by-Step Card (Visible after submit) */}
          {isSubmitted && (
            <div className="p-4 sm:p-5 rounded-xl bg-slate-900 border border-indigo-500/30 space-y-3.5 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  <span>Pembahasan Langkah Demi Langkah</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-400">
                  Kunci Jawaban: <strong className="text-emerald-400">{activeQuestion.correctAnswer}</strong>
                </span>
              </div>

              {/* Steps */}
              <div className="space-y-2.5">
                {activeQuestion.explanation.steps.map((step) => (
                  <div key={step.stepNumber} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-indigo-900/80 border border-indigo-700 text-indigo-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {step.stepNumber}
                    </span>
                    <div className="space-y-0.5">
                      <strong className="text-slate-100 block">{step.title}</strong>
                      <p className="text-slate-300 leading-relaxed font-sans">{step.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-200 leading-relaxed">
                <strong>Kesimpulan:</strong> {activeQuestion.explanation.summary}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
