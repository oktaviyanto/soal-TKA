export type DimensionType = 'Lingkaran' | 'Bangun Ruang';

export type CategoryLingkaran =
  | 'Keliling & Luas Lingkaran'
  | 'Sudut Pusat & Sudut Keliling'
  | 'Juring & Panjang Busur'
  | 'Aplikasi Kontekstual Lingkaran'
  | 'Roda Berputar & Aplikasi Lingkaran';

export type CategoryBangunRuang =
  | 'Kubus & Balok'
  | 'Prisma Tegak'
  | 'Limas Segiempat'
  | 'Tabung (Silinder)'
  | 'Kerucut'
  | 'Bola & Belahan Bola'
  | 'Bangun Ruang Gabungan';

export type QuestionCategory = CategoryLingkaran | CategoryBangunRuang;

export type DifficultyLevel = 'Dasar' | 'Sedang' | 'HOTS / Menantang';

export type GradeLevel = 'Kelas 9';

export interface QuestionOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface ExplanationStep {
  stepNumber: number;
  title: string;
  content: string;
  formulaSnippet?: string;
}

export interface DiagramConfig {
  type:
    | 'circle_sector'
    | 'circle_angles'
    | 'circle_tangent_common'
    | 'circle_wheel'
    | 'cube_isometric'
    | 'cuboid_box'
    | 'cylinder_water'
    | 'cylinder_spheres'
    | 'cone_tent'
    | 'pyramid_square'
    | 'hemisphere_dome'
    | 'sphere_solid'
    | 'composite_silo'
    | 'triangular_prism';
  params?: Record<string, string | number | boolean>;
}

export interface Question {
  id: string;
  questionNumber: number; // 1 to 20
  dimension: DimensionType;
  category: QuestionCategory;
  gradeLevel: GradeLevel;
  difficulty: DifficultyLevel;
  title: string;
  prompt: string;
  diagramConfig: DiagramConfig;
  options: QuestionOption[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: {
    keyFormula: string;
    steps: ExplanationStep[];
    quickTip: string;
    conceptSummary: string;
  };
  hintText: string;
}

export interface StudentProfile {
  name: string;
  grade: string; // Kelas 9-A, 9-B, 9-C, 9-D
  school?: string;
  avatar: string;
  joinedAt: string;
}

export interface QuizResult {
  id: string;
  date: string;
  mode: 'simulasi' | 'latihan_mandiri';
  totalQuestions: number; // 20
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  score: number; // correctCount * 5 (0 to 100)
  timeSpentSeconds: number;
  userAnswers: Record<string, 'A' | 'B' | 'C' | 'D'>;
  markedQuestions: string[];
  breakdown: {
    lingkaran: { correct: number; total: number };
    bangunRuang: { correct: number; total: number };
  };
  googleSheetUrl?: string;
}
