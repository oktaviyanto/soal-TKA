import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { QuizResult, StudentProfile } from '../types/geometry';
import { evaluateAchievements } from '../data/achievements';
import { QUESTION_BANK } from '../data/questionBank';
import { getAccuratePerformanceRecommendation } from '../utils/performanceRecommendation';

export interface GeneratePdfOptions {
  history: QuizResult[];
  student: StudentProfile;
  hasGoogleToken?: boolean;
}

/**
 * Formats seconds into a human-friendly Indonesian string (e.g., '18m 45s' or '1j 20m').
 */
const formatDuration = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}j ${minutes}m`;
  }
  return `${minutes}m ${seconds < 10 ? '0' : ''}${seconds}s`;
};

/**
 * Returns a formal competency grade and description based on score and session count.
 */
const getPredicate = (
  score: number,
  totalSessions: number
): { label: string; grade: string; color: [number, number, number] } => {
  if (totalSessions === 0) {
    return { label: 'Belum Ada Sesi', grade: '-', color: [100, 116, 139] };
  }
  if (score >= 85) {
    return { label: 'Sangat Memuaskan', grade: 'A', color: [16, 185, 129] }; // Emerald
  }
  if (score >= 75) {
    return { label: 'Tuntas KKM', grade: 'B', color: [79, 70, 229] }; // Indigo
  }
  if (score >= 60) {
    return { label: 'Cukup / Penguatan', grade: 'C', color: [217, 119, 6] }; // Amber
  }
  return { label: 'Perlu Pendampingan', grade: 'D', color: [239, 68, 68] }; // Rose
};

/**
 * Generates and downloads a high-quality, professional PDF portfolio report.
 */
export const generateStudentPortfolioPdf = async ({
  history,
  student,
  hasGoogleToken = false,
}: GeneratePdfOptions): Promise<void> => {
  // Create A4 portrait document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 14; // mm

  // ================= 1. HEADER SECTION (KOP DOKUMEN PORTOFOLIO) =================
  // Header navy background accent
  doc.setFillColor(30, 27, 75); // Deep Indigo (#1e1b4b)
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Accent divider line
  doc.setFillColor(79, 70, 229); // Indigo 600 (#4f46e5)
  doc.rect(0, 28, pageWidth, 1.5, 'F');

  // School / App Title in Header
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('PORTOFOLIO ASESMEN & PERKEMBANGAN BELAJAR SISWA', margin, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(224, 231, 255);
  doc.text(
    'Tes Kemampuan Akademik (TKA) Matematika SMP · Geometri 2D & 3D (Lingkaran & Bangun Ruang)',
    margin,
    18
  );

  doc.setFontSize(8);
  doc.setTextColor(199, 210, 254);
  const todayFormatted = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  doc.text(`Tanggal Cetak: ${todayFormatted} · Nama Pembuat : Oktaviyanto CFM · Akun: ${hasGoogleToken ? 'Google Drive Aktif' : 'Lokal'}`, margin, 23);

  // ================= 2. BIODATA SISWA (STUDENT IDENTITY) =================
  let currentY = 36;

  doc.setFillColor(248, 250, 252); // Slate 50
  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.roundedRect(margin, currentY, pageWidth - margin * 2, 24, 2, 2, 'FD');

  doc.setTextColor(15, 23, 42); // Slate 900
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('IDENTITAS SISWA & SASARAN BELAJAR', margin + 4, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105); // Slate 600

  // Column 1
  doc.text('Nama Lengkap', margin + 4, currentY + 13);
  doc.text(':', margin + 30, currentY + 13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(student.name || 'Siswa Kelas 9', margin + 33, currentY + 13);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Kelas Terdaftar', margin + 4, currentY + 19);
  doc.text(':', margin + 30, currentY + 19);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(79, 70, 229);
  doc.text(student.grade || 'Kelas 9-A', margin + 33, currentY + 19);

  // Column 2
  const col2X = margin + 95;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Asal Sekolah', col2X, currentY + 13);
  doc.text(':', col2X + 26, currentY + 13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(student.school || 'SMP Indonesia', col2X + 29, currentY + 13);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Kurikulum', col2X, currentY + 19);
  doc.text(':', col2X + 26, currentY + 19);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('TKA SMP (20 Butir Soal Geometri)', col2X + 29, currentY + 19);

  currentY += 30;

  // ================= 3. STATISTIK UTAMA (EXECUTIVE SUMMARY TILES) =================
  // Only include completed quiz sessions with actual answered questions
  const completedHistory = history.filter((item) => {
    if (!item || !item.totalQuestions) return false;
    const answeredCount = Object.keys(item.userAnswers || {}).length;
    const evaluatedCount = (item.correctCount || 0) + (item.wrongCount || 0);
    return answeredCount > 0 || evaluatedCount > 0;
  });

  const totalSessions = completedHistory.length;

  // Total curriculum questions available (20 total: 8 Lingkaran, 12 Bangun Ruang)
  const TOTAL_AVAILABLE = QUESTION_BANK.length; // 20
  const TOTAL_LINGKARAN_AVAILABLE = QUESTION_BANK.filter((q) => q.dimension === 'Lingkaran').length; // 8
  const TOTAL_BANGUN_RUANG_AVAILABLE = QUESTION_BANK.filter((q) => q.dimension === 'Bangun Ruang').length; // 12

  // Track unique questions answered correctly across completed attempts
  const masteredQuestionIds = new Set<string>();
  completedHistory.forEach((session) => {
    QUESTION_BANK.forEach((q) => {
      if (session.userAnswers && session.userAnswers[q.id] === q.correctAnswer) {
        masteredQuestionIds.add(q.id);
      }
    });
  });

  const masteredLingkaranCount = QUESTION_BANK.filter(
    (q) => q.dimension === 'Lingkaran' && masteredQuestionIds.has(q.id)
  ).length;

  const masteredBangunRuangCount = QUESTION_BANK.filter(
    (q) => q.dimension === 'Bangun Ruang' && masteredQuestionIds.has(q.id)
  ).length;

  const totalMasteredCount = masteredQuestionIds.size;
  const ketuntasanPersen = Math.round((totalMasteredCount / TOTAL_AVAILABLE) * 100);
  const ketuntasanLingkaran = Math.round((masteredLingkaranCount / TOTAL_LINGKARAN_AVAILABLE) * 100);
  const ketuntasanBangunRuang = Math.round((masteredBangunRuangCount / TOTAL_BANGUN_RUANG_AVAILABLE) * 100);

  const highestScore = totalSessions > 0 ? Math.max(...completedHistory.map((h) => h.score)) : 0;
  const avgScore =
    totalSessions > 0 ? Math.round(completedHistory.reduce((a, b) => a + b.score, 0) / totalSessions) : 0;
  const overallPredicate = getPredicate(avgScore, totalSessions);
  const diagnostic = getAccuratePerformanceRecommendation(completedHistory);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('RINGKASAN CAPAIAN KOMPETENSI MATEMATIKA', margin, currentY);
  currentY += 4;

  const tileWidth = (pageWidth - margin * 2 - 12) / 4;
  const tileHeight = 20;

  const metrics = [
    {
      label: 'Skor Aktual',
      value: totalSessions > 0 ? `${diagnostic.actualScore} / 100` : '- / 100',
      sub: totalSessions > 0 ? `${diagnostic.statusLabel} (${diagnostic.actualDate})` : 'Belum ada sesi',
      color:
        totalSessions > 0
          ? diagnostic.actualScore >= 75
            ? ([16, 185, 129] as [number, number, number])
            : ([217, 119, 6] as [number, number, number])
          : ([100, 116, 139] as [number, number, number]),
    },
    {
      label: 'Rata-rata Skor',
      value: totalSessions > 0 ? `${avgScore} / 100` : '- / 100',
      sub: totalSessions > 0 ? `Dari ${totalSessions} sesi (Max: ${highestScore})` : 'Predikat: -',
      color: totalSessions > 0 ? ([15, 23, 42] as [number, number, number]) : ([100, 116, 139] as [number, number, number]),
    },
    {
      label: 'Ketuntasan Lingkaran',
      value: totalSessions > 0 ? `${ketuntasanLingkaran}%` : '0%',
      sub: `${masteredLingkaranCount}/${TOTAL_LINGKARAN_AVAILABLE} soal tuntas terjawab benar`,
      color: totalSessions > 0 ? ([79, 70, 229] as [number, number, number]) : ([100, 116, 139] as [number, number, number]),
    },
    {
      label: 'Ketuntasan Bangun Ruang',
      value: totalSessions > 0 ? `${ketuntasanBangunRuang}%` : '0%',
      sub: `${masteredBangunRuangCount}/${TOTAL_BANGUN_RUANG_AVAILABLE} soal tuntas terjawab benar`,
      color: totalSessions > 0 ? ([59, 130, 246] as [number, number, number]) : ([100, 116, 139] as [number, number, number]),
    },
  ];

  metrics.forEach((m, idx) => {
    const tileX = margin + idx * (tileWidth + 4);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(tileX, currentY, tileWidth, tileHeight, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(m.label, tileX + 3, currentY + 5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(m.color[0], m.color[1], m.color[2]);
    doc.text(m.value, tileX + 3, currentY + 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(m.sub, tileX + 3, currentY + 17);
  });

  currentY += tileHeight + 8;

  // ================= 4. TABEL RIWAYAT SESI PENGERJAAN SOAL =================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('RIWAYAT LATIHAN & SIMULASI UJIAN (20 BUTIR SOAL PER SESI)', margin, currentY);
  currentY += 2;

  const tableRows = completedHistory.map((res, idx) => {
    const pred = getPredicate(res.score, 1);
    const m = Math.floor(res.timeSpentSeconds / 60);
    const s = res.timeSpentSeconds % 60;
    const dur = `${m}m ${s < 10 ? '0' : ''}${s}s`;

    const lingStr = `${res.breakdown.lingkaran.correct}/8 (${Math.round(
      (res.breakdown.lingkaran.correct / 8) * 100
    )}%)`;
    const brStr = `${res.breakdown.bangunRuang.correct}/12 (${Math.round(
      (res.breakdown.bangunRuang.correct / 12) * 100
    )}%)`;

    return [
      `Sesi ${idx + 1}`,
      res.date,
      res.mode === 'simulasi' ? 'Simulasi 20 Soal' : 'Latihan Mandiri',
      `${res.score} / 100`,
      `${res.correctCount} Soal`,
      `${res.wrongCount} Soal`,
      lingStr,
      brStr,
      dur,
      pred.label,
    ];
  });

  autoTable(doc, {
    startY: currentY,
    head: [
      [
        'Sesi',
        'Tanggal',
        'Mode Ujian',
        'Skor Akhir',
        'Benar (x5)',
        'Salah (x0)',
        'Lingkaran (8)',
        'Bangun Ruang (12)',
        'Durasi',
        'Predikat',
      ],
    ],
    body: tableRows.length > 0 ? tableRows : [['-', '-', 'Belum ada sesi', '-', '-', '-', '-', '-', '-', '-']],
    theme: 'grid',
    headStyles: {
      fillColor: [55, 48, 163], // Indigo 800 (#3730a3)
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7.5,
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [30, 41, 59],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 14 },
      1: { halign: 'center', cellWidth: 18 },
      2: { halign: 'left', cellWidth: 26 },
      3: { halign: 'center', fontStyle: 'bold', cellWidth: 18 },
      4: { halign: 'center', cellWidth: 17 },
      5: { halign: 'center', cellWidth: 17 },
      6: { halign: 'center', cellWidth: 24 },
      7: { halign: 'center', cellWidth: 24 },
      8: { halign: 'center', cellWidth: 16 },
      9: { halign: 'center', cellWidth: 22 },
    },
    margin: { left: margin, right: margin },
  });

  // Calculate position after table
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lastAutoTable = (doc as any).lastAutoTable;
  currentY = (lastAutoTable ? lastAutoTable.finalY : currentY) + 8;

  // Check if we need to add a page or continue
  if (currentY > pageHeight - 75) {
    doc.addPage();
    currentY = 20;
  }

  // ================= 5. LENCANA PRESTASI & PENGHARGAAN (ACHIEVEMENTS) =================
  const achievements = evaluateAchievements(completedHistory, hasGoogleToken);
  const unlocked = achievements.filter((a) => a.unlocked);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(`LENCANA PRESTASI TERCAPAI (${unlocked.length} DARI ${achievements.length} TERBUKA)`, margin, currentY);
  currentY += 4;

  if (unlocked.length > 0) {
    const badgeCols = 3;
    const badgeWidth = (pageWidth - margin * 2 - (badgeCols - 1) * 4) / badgeCols;
    const badgeHeight = 14;

    unlocked.forEach((b, idx) => {
      const col = idx % badgeCols;
      const row = Math.floor(idx / badgeCols);
      const bX = margin + col * (badgeWidth + 4);
      const bY = currentY + row * (badgeHeight + 3);

      // Check page boundary
      if (bY + badgeHeight > pageHeight - 50) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFillColor(241, 245, 249);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(bX, bY, badgeWidth, badgeHeight, 1.5, 1.5, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(79, 70, 229);
      doc.text(`[Lencana] ${b.title}`, bX + 3, bY + 5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(100, 116, 139);
      const shortDesc = b.description.length > 48 ? b.description.slice(0, 46) + '...' : b.description;
      doc.text(shortDesc, bX + 3, bY + 10);
    });

    currentY += Math.ceil(unlocked.length / badgeCols) * (badgeHeight + 3) + 6;
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('Belum ada lencana yang terbuka. Selesaikan lebih banyak latihan untuk meraih prestasi.', margin, currentY + 4);
    currentY += 12;
  }

  // ================= 6. ANALISIS KOMPETENSI & REKOMENDASI GURU/TUTOR =================
  const recLines = doc.splitTextToSize(diagnostic.pdfFormattedText, pageWidth - margin * 2 - 8);
  const recBoxHeight = Math.max(26, recLines.length * 3.4 + 9);

  if (currentY + recBoxHeight > pageHeight - 45) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, pageWidth - margin * 2, recBoxHeight, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('SARAN PERBAIKAN & PENINGKATAN BELAJAR (SKOR AKTUAL):', margin + 4, currentY + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(51, 65, 85);
  doc.text(recLines, margin + 4, currentY + 10);

  currentY += recBoxHeight + 6;

  // ================= 7. LEMBAR PENGESAHAN / VALIDASI (SIGNATURES) =================
  if (currentY > pageHeight - 45) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);

  const sigColWidth = (pageWidth - margin * 2) / 3;

  // Column 1: Siswa (Hapus NISN dan kelas sesuai permintaan)
  doc.text('Mengetahui / Siswa,', margin + sigColWidth * 0 + 6, currentY);
  doc.text(`( ${student.name || 'Siswa'} )`, margin + sigColWidth * 0 + 6, currentY + 20);

  // Column 2: Orang Tua / Wali (Hanya tanda tangan saja, tanpa tanggal sesuai permintaan)
  doc.text('Orang Tua / Wali Siswa,', margin + sigColWidth * 1 + 6, currentY);
  doc.text('( ........................................ )', margin + sigColWidth * 1 + 6, currentY + 20);

  // Column 3: Guru Pengampu Matematika (Tanpa NIP sesuai permintaan)
  doc.text('Guru Pembimbing Matematika,', margin + sigColWidth * 2 + 6, currentY);
  doc.text('( ........................................ )', margin + sigColWidth * 2 + 6, currentY + 20);

  // ================= 8. FOOTER NUMBERING ON ALL PAGES =================
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184); // Slate 400

    doc.setDrawColor(226, 232, 240);
    doc.line(margin, pageHeight - 10, pageWidth - margin, pageHeight - 10);

    doc.text(
      'Dokumen Portofolio Resmi GeoTKA SMP Kelas 9 · Nama Pembuat : Oktaviyanto CFM · Otomatis Google Sheets & Drive',
      margin,
      pageHeight - 6
    );
    doc.text(`Halaman ${i} dari ${totalPages}`, pageWidth - margin - 22, pageHeight - 6);
  }

  // Sanitize filename for download
  const cleanName = (student.name || 'Siswa')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .slice(0, 20);
  const dateStr = new Date().toISOString().slice(0, 10);
  const filename = `Portofolio_TKA_Geometri_${student.grade.replace(/[^a-zA-Z0-9]/g, '')}_${cleanName}_${dateStr}.pdf`;

  // Trigger browser download
  doc.save(filename);
};
