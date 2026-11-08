import { getAccessToken } from './googleAuth';

export interface QuizSubmissionData {
  studentName: string;
  grade: string;
  score: number; // 0 to 100
  correctCount: number;
  wrongCount: number;
  timeSpentSeconds: number;
  answers: Record<number, 'A' | 'B' | 'C' | 'D' | '-'>;
  totalQuestions: number; // 20
}

export interface SheetExportResult {
  spreadsheetId: string;
  spreadsheetUrl: string;
  isNewSheet: boolean;
}

const DEFAULT_SHEET_TITLE = 'Rekap Nilai GeoTKA SMP Kelas 9 - Lingkaran & Bangun Ruang';

/**
 * Automatically creates or appends to a Google Spreadsheet in the user's Google Drive
 */
export const exportQuizResultToGoogleSheet = async (
  data: QuizSubmissionData
): Promise<SheetExportResult> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Belum terhubung ke Akun Google. Silakan login dengan Google terlebih dahulu.');
  }

  // 1. Search for existing spreadsheet in user's Google Drive
  const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
    `name='${DEFAULT_SHEET_TITLE}' and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false`
  )}&fields=files(id,name)`;

  const searchRes = await fetch(searchUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!searchRes.ok) {
    const errText = await searchRes.text();
    console.error('Drive search failed:', errText);
    throw new Error('Gagal memeriksa file di Google Drive: ' + searchRes.statusText);
  }

  const searchJson = await searchRes.json();
  let spreadsheetId: string | null = null;
  let isNew = false;

  if (searchJson.files && searchJson.files.length > 0) {
    spreadsheetId = searchJson.files[0].id;
  }

  // 2. If no spreadsheet exists yet, create one with headers
  if (!spreadsheetId) {
    isNew = true;
    const headerRow = [
      'Waktu Pengerjaan',
      'Nama Siswa',
      'Kelas',
      'Skor Akhir (Max 100)',
      'Benar (x5 poin)',
      'Salah',
      'Waktu Selesai',
      ...Array.from({ length: 20 }, (_, i) => `Soal ${i + 1}`),
    ];

    const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          title: DEFAULT_SHEET_TITLE,
        },
        sheets: [
          {
            properties: {
              title: 'Rekap Nilai Siswa',
              gridProperties: {
                frozenRowCount: 1,
              },
            },
            data: [
              {
                startRow: 0,
                startColumn: 0,
                rowData: [
                  {
                    values: headerRow.map((col) => ({
                      userEnteredValue: { stringValue: col },
                      userEnteredFormat: {
                        textFormat: { bold: true },
                        backgroundColor: { red: 0.93, green: 0.94, blue: 0.98 },
                      },
                    })),
                  },
                ],
              },
            ],
          },
        ],
      }),
    });

    if (!createRes.ok) {
      const errText = await createRes.text();
      console.error('Create sheet failed:', errText);
      throw new Error('Gagal membuat Spreadsheet di Google Drive.');
    }

    const createdData = await createRes.json();
    spreadsheetId = createdData.spreadsheetId;
  }

  // 3. Append the student's answer row
  const m = Math.floor(data.timeSpentSeconds / 60);
  const s = data.timeSpentSeconds % 60;
  const timeFormatted = `${m}m ${s < 10 ? '0' : ''}${s}s`;

  // Array of answers for question 1 to 20
  const questionAnswers: string[] = [];
  for (let i = 1; i <= 20; i++) {
    questionAnswers.push(data.answers[i] || '-');
  }

  const rowValues = [
    new Date().toLocaleString('id-ID'),
    data.studentName,
    data.grade,
    data.score, // 5 per correct answer (0-100)
    `${data.correctCount} (${data.score} poin)`,
    data.wrongCount,
    timeFormatted,
    ...questionAnswers,
  ];

  const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Rekap Nilai Siswa'!A1:append?valueInputOption=USER_ENTERED`;

  const appendRes = await fetch(appendUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: [rowValues],
    }),
  });

  if (!appendRes.ok) {
    // If the sheet title was default Sheet1
    const fallbackAppendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1:append?valueInputOption=USER_ENTERED`;
    const fallbackRes = await fetch(fallbackAppendUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [rowValues],
      }),
    });

    if (!fallbackRes.ok) {
      const errText = await fallbackRes.text();
      console.error('Append row failed:', errText);
      throw new Error('Gagal menambahkan data nilai ke Google Sheets.');
    }
  }

  return {
    spreadsheetId: spreadsheetId!,
    spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
    isNewSheet: isNew,
  };
};
