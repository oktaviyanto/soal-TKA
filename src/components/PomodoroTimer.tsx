import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Volume2,
  VolumeX,
  Coffee,
  Brain,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';

type PomodoroMode = 'focus' | 'short_break' | 'long_break';

interface PomodoroTimerProps {
  onSessionComplete?: (type: PomodoroMode, sessionCount: number) => void;
  className?: string;
}

const DURATIONS: Record<PomodoroMode, { seconds: number; label: string; icon: string }> = {
  focus: { seconds: 25 * 60, label: 'Fokus Belajar', icon: '🎯' },
  short_break: { seconds: 5 * 60, label: 'Istirahat Singkat', icon: '☕' },
  long_break: { seconds: 15 * 60, label: 'Istirahat Panjang', icon: '🌴' },
};

function playChime(type: 'focus' | 'break') {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(type === 'focus' ? 523.25 : 659.25, now); // C5 or E5
    gain1.gain.setValueAtTime(0.18, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.5);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(type === 'focus' ? 783.99 : 987.77, now + 0.2); // G5 or B5
    gain2.gain.setValueAtTime(0.2, now + 0.2);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.2);
    osc2.stop(now + 0.9);
  } catch (err) {
    console.warn('Audio chime failed', err);
  }
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  onSessionComplete,
  className = '',
}) => {
  const [currentMode, setCurrentMode] = useState<PomodoroMode>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(DURATIONS.focus.seconds);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedCycles, setCompletedCycles] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const initialDuration = DURATIONS[currentMode].seconds;
  const progressPercent = Math.min(100, Math.max(0, ((initialDuration - timeLeft) / initialDuration) * 100));

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerFinished();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft, currentMode, completedCycles]);

  const handleTimerFinished = () => {
    setIsRunning(false);

    if (currentMode === 'focus') {
      const nextCount = completedCycles + 1;
      setCompletedCycles(nextCount);
      if (soundEnabled) playChime('focus');

      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      } catch {}

      const isLongBreak = nextCount % 4 === 0;
      const nextMode: PomodoroMode = isLongBreak ? 'long_break' : 'short_break';
      setToastMessage(
        isLongBreak
          ? `🎉 Hebat! Kamu telah menyelesaikan 4 sesi fokus! Waktunya istirahat panjang 15 menit.`
          : `🎉 Sesi fokus 25 menit selesai! Istirahat santai sejenak selama 5 menit.`
      );

      setCurrentMode(nextMode);
      setTimeLeft(DURATIONS[nextMode].seconds);
      onSessionComplete?.('focus', nextCount);
    } else {
      if (soundEnabled) playChime('break');
      setToastMessage('⏰ Waktu istirahat selesai! Ayo kembali fokus latihan soal geometri.');
      setCurrentMode('focus');
      setTimeLeft(DURATIONS.focus.seconds);
      onSessionComplete?.(currentMode, completedCycles);
    }
  };

  const handleSwitchMode = (mode: PomodoroMode) => {
    setIsRunning(false);
    setCurrentMode(mode);
    setTimeLeft(DURATIONS[mode].seconds);
    setToastMessage(null);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(DURATIONS[currentMode].seconds);
    setToastMessage(null);
  };

  const handleSkip = () => {
    if (currentMode === 'focus') {
      const isLongBreak = (completedCycles + 1) % 4 === 0;
      const nextMode: PomodoroMode = isLongBreak ? 'long_break' : 'short_break';
      setCurrentMode(nextMode);
      setTimeLeft(DURATIONS[nextMode].seconds);
    } else {
      setCurrentMode('focus');
      setTimeLeft(DURATIONS.focus.seconds);
    }
    setIsRunning(false);
    setToastMessage(null);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 ${
        currentMode === 'focus'
          ? 'bg-gradient-to-r from-indigo-50/90 via-white to-indigo-50/60 dark:from-indigo-950/40 dark:via-slate-900 dark:to-indigo-950/30 border-indigo-200/80 dark:border-indigo-800/60'
          : 'bg-gradient-to-r from-emerald-50/90 via-white to-emerald-50/60 dark:from-emerald-950/40 dark:via-slate-900 dark:to-emerald-950/30 border-emerald-200/80 dark:border-emerald-800/60'
      } ${className}`}
    >
      {/* Timer Bar Header / Collapsed View */}
      <div className="p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-xs ${
              currentMode === 'focus'
                ? 'bg-indigo-600 text-white'
                : 'bg-emerald-600 text-white'
            }`}
          >
            {DURATIONS[currentMode].icon}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Pomodoro Study Timer
              </span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  currentMode === 'focus'
                    ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300'
                    : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                }`}
              >
                {DURATIONS[currentMode].label}
              </span>
            </div>

            {/* Completed Pomodoros indicators */}
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-600 dark:text-slate-400">
              <span>Siklus:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4].map((step) => {
                  const isDone = (completedCycles % 4 >= step) || (completedCycles > 0 && completedCycles % 4 === 0 && step <= 4);
                  return (
                    <span
                      key={step}
                      title={`Sesi ke-${step}`}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        isDone
                          ? 'bg-rose-500 ring-2 ring-rose-200 dark:ring-rose-950'
                          : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                    />
                  );
                })}
              </div>
              <span className="font-math font-medium text-slate-700 dark:text-slate-300">
                ({completedCycles} sesi fokus selesai)
              </span>
            </div>
          </div>
        </div>

        {/* Big Time Display & Primary Play / Pause Button */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span
              className={`font-math text-2xl sm:text-3xl font-black tracking-tight tabular-nums ${
                isRunning
                  ? currentMode === 'focus'
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              {formatTime(timeLeft)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsRunning(!isRunning)}
              className={`h-9 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                isRunning
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : currentMode === 'focus'
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Jeda</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Mulai</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              title="Reset Timer"
              aria-label="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleSkip}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              title="Lewati ke Sesi Berikutnya"
              aria-label="Lewati ke Sesi Berikutnya"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              title={soundEnabled ? 'Alarm Suara Aktif' : 'Alarm Suara Mati'}
              aria-label="Toggle Alarm Suara"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer ml-1"
              title={isExpanded ? 'Sembunyikan Pengaturan' : 'Tampilkan Pengaturan'}
              aria-label="Toggle Expand"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Progress Line */}
      <div className="w-full h-1 bg-slate-200/80 dark:bg-slate-800 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            currentMode === 'focus' ? 'bg-indigo-600' : 'bg-emerald-500'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Expanded Controls & Presets */}
      {isExpanded && (
        <div className="p-3 sm:p-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Mode Switchers */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-500 font-semibold mr-1">Pilih Mode:</span>

            <button
              type="button"
              onClick={() => handleSwitchMode('focus')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                currentMode === 'focus'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>Fokus 25 Menit</span>
            </button>

            <button
              type="button"
              onClick={() => handleSwitchMode('short_break')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                currentMode === 'short_break'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>Istirahat 5 Menit</span>
            </button>

            <button
              type="button"
              onClick={() => handleSwitchMode('long_break')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                currentMode === 'long_break'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Istirahat 15 Menit</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <span>💡 <strong>Tips Belajar:</strong> 25 menit fokus menyelesaikan 4–5 soal geometri, lalu 5 menit rehat mata.</span>
          </div>
        </div>
      )}

      {/* Completion Toast Banner */}
      {toastMessage && (
        <div className="mx-3 mb-3 p-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold flex items-center justify-between gap-2 shadow-sm animate-fade-in">
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="p-1 rounded hover:bg-white/20 text-white cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
