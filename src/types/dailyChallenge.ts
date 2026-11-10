export type DailyTopic =
  | 'Phytagoras'
  | 'Segitiga'
  | 'Segiempat'
  | 'Transformasi Geometri'
  | 'Lingkaran'
  | 'Bangun Ruang';

export interface DailyChallengeOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface DailyChallengeStep {
  stepNumber: number;
  title: string;
  content: string;
}

export interface DailyChallengeQuestion {
  id: string;
  dayIndex: number; // for deterministic rotation
  topic: DailyTopic;
  subtopic: string;
  difficulty: 'Dasar' | 'Sedang' | 'HOTS / Menantang';
  title: string;
  prompt: string;
  options: DailyChallengeOption[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  keyFormula: string;
  hint: string;
  explanation: {
    steps: DailyChallengeStep[];
    summary: string;
  };
  accentColor?: string;
}

export interface DailyChallengeRecord {
  dateString: string; // Format: YYYY-MM-DD
  questionId: string;
  selectedAnswer: 'A' | 'B' | 'C' | 'D';
  isCorrect: boolean;
  completedAt: string;
}

export interface DailyChallengeState {
  records: Record<string, DailyChallengeRecord>;
  streak: number;
  lastCompletedDate: string;
  totalSolved: number;
}
