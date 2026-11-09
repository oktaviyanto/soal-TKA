import { QuizResult } from '../types/geometry';
import { QUESTION_BANK } from '../data/questionBank';

export interface ActionStep {
  number: number;
  title: string;
  description: string;
}

export interface DiagnosticRecommendation {
  totalSessions: number;
  actualScore: number;
  actualDate: string;
  actualCorrect: number;
  actualWrong: number;
  actualLingCorrect: number;
  actualLingTotal: number;
  actualLingAcc: number;
  actualBRCorrect: number;
  actualBRTotal: number;
  actualBRAcc: number;
  missedCategories: string[];
  missedQuestionCount: number;
  statusGrade: string;
  statusLabel: string;
  statusColorHex: string;
  summaryDiagnostic: string;
  actionSteps: ActionStep[];
  pdfFormattedText: string;
}

/**
 * Produces an accurate, personalized pedagogical diagnostic and actionable improvement steps
 * based strictly on the student's actual latest quiz session and actual answered questions.
 */
export const getAccuratePerformanceRecommendation = (
  completedHistory: QuizResult[]
): DiagnosticRecommendation => {
  const totalSessions = completedHistory.length;

  if (totalSessions === 0) {
    return {
      totalSessions: 0,
      actualScore: 0,
      actualDate: '-',
      actualCorrect: 0,
      actualWrong: 0,
      actualLingCorrect: 0,
      actualLingTotal: 8,
      actualLingAcc: 0,
      actualBRCorrect: 0,
      actualBRTotal: 12,
      actualBRAcc: 0,
      missedCategories: [],
      missedQuestionCount: 0,
      statusGrade: '-',
      statusLabel: 'Belum Ada Sesi',
      statusColorHex: '#64748b',
      summaryDiagnostic:
        'Siswa belum memiliki riwayat pengerjaan latihan atau simulasi. Disarankan memulai dengan mode "Latihan Mandiri" untuk 20 butir soal geometri (Lingkaran & Bangun Ruang) guna memetakan pemahaman konsep awal dan mengidentifikasi topik yang membutuhkan penguatan.',
      actionSteps: [
        {
          number: 1,
          title: 'Mulai Ujian Diagnostik',
          description:
            'Kerjakan 20 butir soal geometri (8 Lingkaran dan 12 Bangun Ruang) di mode Latihan Mandiri untuk mengukur baseline pemahaman.',
        },
        {
          number: 2,
          title: 'Eksplorasi Bank Rumus',
          description:
            'Pahami rumus kunci sudut pusat, luas juring, volume kerucut, bola, dan tabung sebelum mencoba simulasi berbatas waktu.',
        },
        {
          number: 3,
          title: 'Target Nilai KKM (75)',
          description:
            'Tetapkan target awal minimal 15 dari 20 soal dijawab benar untuk mencapai nilai batas kelulusan TKA SMP.',
        },
      ],
      pdfFormattedText:
        'Siswa belum memiliki riwayat pengerjaan latihan atau simulasi. Disarankan memulai dengan mode "Latihan Mandiri" untuk 20 butir soal geometri (Lingkaran & Bangun Ruang) guna memetakan pemahaman konsep awal dan mengidentifikasi topik yang membutuhkan penguatan.',
    };
  }

  // Get the student's actual latest session
  const latest = completedHistory[completedHistory.length - 1];
  const actualScore = latest.score;
  const actualDate = latest.date;
  const actualCorrect = latest.correctCount;
  const actualWrong = latest.wrongCount;

  const actualLingCorrect = latest.breakdown.lingkaran.correct;
  const actualLingTotal = latest.breakdown.lingkaran.total || 8;
  const actualLingAcc = Math.round((actualLingCorrect / actualLingTotal) * 100);

  const actualBRCorrect = latest.breakdown.bangunRuang.correct;
  const actualBRTotal = latest.breakdown.bangunRuang.total || 12;
  const actualBRAcc = Math.round((actualBRCorrect / actualBRTotal) * 100);

  // Identify specific questions and categories missed in the actual session
  const missedQuestions = QUESTION_BANK.filter((q) => {
    if (!latest.userAnswers) return false;
    // Question was answered incorrectly
    return latest.userAnswers[q.id] && latest.userAnswers[q.id] !== q.correctAnswer;
  });

  const rawMissedCats = missedQuestions.map((q) => q.category);
  const missedCategories = Array.from(new Set(rawMissedCats));
  const missedQuestionCount = missedQuestions.length;

  let statusGrade = 'D';
  let statusLabel = 'Perlu Pendampingan Khusus';
  let statusColorHex = '#ef4444'; // Rose

  if (actualScore >= 85) {
    statusGrade = 'A';
    statusLabel = 'Sangat Memuaskan';
    statusColorHex = '#10b981'; // Emerald
  } else if (actualScore >= 75) {
    statusGrade = 'B';
    statusLabel = 'Tuntas KKM';
    statusColorHex = '#4f46e5'; // Indigo
  } else if (actualScore >= 60) {
    statusGrade = 'C';
    statusLabel = 'Cukup / Penguatan';
    statusColorHex = '#d97706'; // Amber
  }

  // Construct highly specific diagnosis
  let summaryDiagnostic = '';
  const actionSteps: ActionStep[] = [];

  const missedCategoriesStr =
    missedCategories.length > 0
      ? `Fokus perbaikan teridentifikasi pada subtopik: ${missedCategories.slice(0, 3).join(', ')}.`
      : '';

  if (actualScore >= 85) {
    if (actualScore === 100) {
      summaryDiagnostic = `Capaian Sempurna! Skor Aktual siswa ${actualScore}/100 (${actualCorrect}/20 soal benar). Seluruh konsep geometri 2D (Lingkaran: 100%) dan 3D (Bangun Ruang: 100%) dikuasai secara prima tanpa kesalahan.`;
      actionSteps.push({
        number: 1,
        title: 'Latihan Penalaran HOTS Kombinasi',
        description:
          'Tantang diri dengan soal kombinasi multi-bangun ruang kontekstual (gabungan kerucut, tabung, dan bola) untuk mengasah logika analitis.',
      });
      actionSteps.push({
        number: 2,
        title: 'Efisiensi Durasi Waktu',
        description:
          'Pertahankan akurasi 100% sambil melatih kecepatan pengerjaan per soal di bawah 2 menit pada mode Simulasi Ujian.',
      });
      actionSteps.push({
        number: 3,
        title: 'Berbagi Pengetahuan / Tutor Sebaya',
        description:
          'Manfaatkan pemahaman mendalam untuk berdiskusi dengan rekan sekelas dalam memecahkan soal-soal geometri menantang.',
      });
    } else {
      summaryDiagnostic = `Capaian Sangat Memuaskan! Skor Aktual ${actualScore}/100 (Benar: ${actualCorrect}/20 soal). Penguasaan konsep sangat solid (Lingkaran: ${actualLingAcc}%, Bangun Ruang: ${actualBRAcc}%). ${missedCategoriesStr}`;
      actionSteps.push({
        number: 1,
        title: 'Review Soal yang Keliru',
        description: `Buka pembahasan detail untuk ${missedQuestionCount} soal yang belum tepat pada subtopik ${missedCategories.slice(0, 2).join(' & ')}.`,
      });
      actionSteps.push({
        number: 2,
        title: 'Visualisasi di Lab 3D',
        description:
          'Gunakan Lab Interaktif untuk meninjau kembali bentuk geometri dan irisan bangun ruang yang sempat membingungkan.',
      });
      actionSteps.push({
        number: 3,
        title: 'Target Skor 100',
        description:
          'Ulangi sesi kuis untuk meraih predikat nilai sempurna 100 dan mengunci lencana prestasi "Perfect Score".',
      });
    }
  } else if (actualScore >= 75) {
    if (actualLingAcc < actualBRAcc) {
      summaryDiagnostic = `Capaian Tuntas KKM. Skor Aktual ${actualScore}/100 (${actualCorrect}/20 soal). Pemahaman materi Bangun Ruang (${actualBRAcc}%) sudah baik, namun materi Lingkaran (${actualLingAcc}%) memerlukan penguatan konsep. ${missedCategoriesStr}`;
      actionSteps.push({
        number: 1,
        title: 'Prioritas Penguatan Materi Lingkaran',
        description:
          'Perdalam rumus sudut pusat vs sudut keliling (θ_pusat = 2 × θ_keliling) dan perbandingan luas juring / panjang busur di Bank Rumus.',
      });
      actionSteps.push({
        number: 2,
        title: 'Simpan Soal Menantang',
        description:
          'Gunakan fitur Bookmark untuk menyimpan soal-soal juring dan sudut lingkaran yang keliru agar dapat diulang pada tab Soal Tersimpan.',
      });
      actionSteps.push({
        number: 3,
        title: 'Target Peningkatan ke Skor 85+',
        description:
          'Dengan menuntaskan 2-3 soal lingkaran tambahan, nilai dapat meningkat ke predikat Sangat Memuaskan (Grade A).',
      });
    } else if (actualBRAcc < actualLingAcc) {
      summaryDiagnostic = `Capaian Tuntas KKM. Skor Aktual ${actualScore}/100 (${actualCorrect}/20 soal). Pemahaman materi Lingkaran (${actualLingAcc}%) sudah baik, namun materi Bangun Ruang (${actualBRAcc}%) memerlukan ketelitian perhitungan lebih tinggi. ${missedCategoriesStr}`;
      actionSteps.push({
        number: 1,
        title: 'Prioritas Penguatan Materi Bangun Ruang',
        description:
          'Pelajari kembali luas selimut dan volume bangun ruang sisi lengkung (tabung, kerucut, bola) di Bank Rumus.',
      });
      actionSteps.push({
        number: 2,
        title: 'Eksplorasi Lab Interaktif 3D',
        description:
          'Putar dan amati jaring-jaring prisma, limas, dan kerucut di Lab 3D untuk memvisualisasikan tinggi tegak vs garis pelukis.',
      });
      actionSteps.push({
        number: 3,
        title: 'Target Peningkatan ke Skor 85+',
        description:
          'Tingkatkan ketelitian eliminasi variabel π pada rumus volume gabungan untuk meraih skor di atas 85.',
      });
    } else {
      summaryDiagnostic = `Capaian Tuntas KKM. Skor Aktual ${actualScore}/100 (${actualCorrect}/20 soal). Penguasaan Lingkaran (${actualLingAcc}%) dan Bangun Ruang (${actualBRAcc}%) berimbang namun masih ada ruang peningkatan ketelitian. ${missedCategoriesStr}`;
      actionSteps.push({
        number: 1,
        title: 'Evaluasi Kesalahan Hitung',
        description:
          'Periksa kembali langkah-langkah perkalian pecahan (seperti 22/7 dan 3,14) yang kerap menjadi sumber selisih jawaban.',
      });
      actionSteps.push({
        number: 2,
        title: 'Latihan Fokus dengan Pomodoro',
        description:
          'Manfaatkan timer belajar di Latihan Mandiri untuk membangun ritme konsentrasi tinggi tanpa tergesa-gesa.',
      });
      actionSteps.push({
        number: 3,
        title: 'Target Skor Unggul',
        description:
          'Konsisten berlatih hingga mencapai minimal 18 soal benar (skor 90) pada simulasi berikutnya.',
      });
    }
  } else if (actualScore >= 60) {
    summaryDiagnostic = `Capaian Cukup (Belum Memenuhi KKM 75). Skor Aktual ${actualScore}/100 (${actualCorrect}/20 soal benar, ${actualWrong} salah). Penguasaan konsep dasar geometri masih membutuhkan pembinaan terarah. ${missedCategoriesStr}`;
    actionSteps.push({
      number: 1,
      title: 'Pembenahan Rumus Dasar',
      description:
        actualLingAcc < actualBRAcc
          ? 'Fokus pelajari rumus dasar lingkaran: keliling, luas, busur, dan juring di Bank Rumus sebelum mengerjakan soal gabungan.'
          : 'Fokus pelajari rumus volume dan luas permukaan kubus, balok, prisma, dan tabung secara terpisah di Bank Rumus.',
    });
    actionSteps.push({
      number: 2,
      title: 'Gunakan Petunjuk Pembahasan',
      description:
        'Kerjakan mode Latihan Mandiri tanpa timer, baca petunjuk rumus (Hint), dan pelajari langkah pembahasan bertahap.',
    });
    actionSteps.push({
      number: 3,
      title: 'Target Melampaui KKM (75)',
      description:
        'Fokuskan upaya untuk menambah 3-4 jawaban benar pada sesi berikutnya agar melewati batas KKM 75.',
    });
  } else {
    // actualScore < 60
    summaryDiagnostic = `Capaian Perlu Pendampingan Khusus. Skor Aktual ${actualScore}/100 (${actualCorrect}/20 soal benar, ${actualWrong} butir salah). Konsep geometri 2D dan 3D belum dipahami secara tuntas. ${missedCategoriesStr}`;
    actionSteps.push({
      number: 1,
      title: 'Konsultasi Guru & Tanya Tutor AI',
      description:
        'Gunakan fitur Tanya Tutor AI atau konsultasikan hasil asesmen ini dengan Guru Pembimbing Matematika untuk penjelasan langkah demi langkah.',
    });
    actionSteps.push({
      number: 2,
      title: 'Mulai dari Soal Tingkat Dasar',
      description:
        'Buka Bank Rumus, catat formula kunci, lalu kerjakan kembali soal-soal bertingkat kesulitan Dasar di mode Latihan Mandiri.',
    });
    actionSteps.push({
      number: 3,
      title: 'Bangun Pemahaman Visual',
      description:
        'Manfaatkan Lab Interaktif 3D untuk melihat bentuk nyata bangun ruang dan hubungan sudut pada lingkaran sebelum menghitung angka.',
    });
  }

  // PDF formatted multi-line block
  const stepLines = actionSteps
    .map((s) => `• Langkah ${s.number} (${s.title}): ${s.description}`)
    .join('\n');

  const pdfFormattedText = `${summaryDiagnostic}\n\nRekomendasi Tindak Lanjut & Peningkatan:\n${stepLines}`;

  return {
    totalSessions,
    actualScore,
    actualDate,
    actualCorrect,
    actualWrong,
    actualLingCorrect,
    actualLingTotal,
    actualLingAcc,
    actualBRCorrect,
    actualBRTotal,
    actualBRAcc,
    missedCategories,
    missedQuestionCount,
    statusGrade,
    statusLabel,
    statusColorHex,
    summaryDiagnostic,
    actionSteps,
    pdfFormattedText,
  };
};
