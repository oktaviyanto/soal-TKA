import { getAccessToken } from './googleAuth';

export interface QuizSubmissionData {
  studentName: string;
  grade: string;
  score: number; // 0 to 100 (Benar x 5)
  correctCount: number;
  wrongCount: number;
  timeSpentSeconds: number;
  answers: Record<number, 'A' | 'B' | 'C' | 'D' | '-'>;
  totalQuestions: number; // 20
}

export interface SheetExportResult {
  spreadsheetId: string;
  spreadsheetUrl: string;
  folderId: string;
  folderUrl: string;
  isNewSheet: boolean;
}

export const TARGET_FOLDER_NAME = 'ujicoba aplikasi';
export const DEFAULT_SHEET_TITLE = 'Rekap Nilai GeoTKA SMP Kelas 9 - Lingkaran & Bangun Ruang';

const HEADER_ROW = [
  'Waktu Pengerjaan',
  'Nama Siswa',
  'Kelas',
  'Skor Akhir (Max 100)',
  'Jumlah Benar (x5 poin)',
  'Jumlah Salah',
  'Durasi Pengerjaan',
  ...Array.from({ length: 20 }, (_, i) => `Soal ${i + 1}`),
];

/**
 * Searches for or creates the 'ujicoba aplikasi' folder in the user's Google Drive.
 */
export const findOrCreateAppFolder = async (token: string): Promise<{ id: string; url: string }> => {
  // 1. Search for existing folder
  const query = `mimeType='application/vnd.google-apps.folder' and (name='${TARGET_FOLDER_NAME}' or name='Ujicoba Aplikasi' or name='Uji Coba Aplikasi') and trashed=false`;
  const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name,webViewLink)`;

  const searchRes = await fetch(searchUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (searchRes.ok) {
    const searchJson = await searchRes.json();
    if (searchJson.files && searchJson.files.length > 0) {
      const folder = searchJson.files[0];
      return {
        id: folder.id,
        url: folder.webViewLink || `https://drive.google.com/drive/folders/${folder.id}`,
      };
    }
  }

  // 2. If not found, create folder in Google Drive
  const createFolderRes = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: TARGET_FOLDER_NAME,
      mimeType: 'application/vnd.google-apps.folder',
      description: 'Folder penyimpanan otomatis hasil latihan dan rekap nilai GeoTKA SMP Kelas 9',
    }),
  });

  if (!createFolderRes.ok) {
    const errText = await createFolderRes.text();
    console.error('Failed to create folder in Drive:', errText);
    throw new Error('Gagal membuat folder "ujicoba aplikasi" di Google Drive.');
  }

  const createdFolder = await createFolderRes.json();
  return {
    id: createdFolder.id,
    url: `https://drive.google.com/drive/folders/${createdFolder.id}`,
  };
};

/**
 * Ensures the Google Spreadsheet exists inside the target 'ujicoba aplikasi' folder.
 */
export const findOrCreateSpreadsheetInFolder = async (
  token: string,
  folderId: string
): Promise<{ id: string; url: string; isNew: boolean }> => {
  // 1. Check if spreadsheet already exists inside this folder
  const inFolderQuery = `'${folderId}' in parents and mimeType='application/vnd.google-apps.spreadsheet' and name='${DEFAULT_SHEET_TITLE}' and trashed=false`;
  const searchInFolderUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(inFolderQuery)}&fields=files(id,name,webViewLink)`;

  const searchRes = await fetch(searchInFolderUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (searchRes.ok) {
    const json = await searchRes.json();
    if (json.files && json.files.length > 0) {
      const file = json.files[0];
      return {
        id: file.id,
        url: `https://docs.google.com/spreadsheets/d/${file.id}/edit`,
        isNew: false,
      };
    }
  }

  // 2. Check if it exists elsewhere in user's Drive, and if so move it into the folder
  const globalQuery = `mimeType='application/vnd.google-apps.spreadsheet' and name='${DEFAULT_SHEET_TITLE}' and trashed=false`;
  const searchGlobalUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(globalQuery)}&fields=files(id,name,parents)`;
  const globalRes = await fetch(searchGlobalUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (globalRes.ok) {
    const globalJson = await globalRes.json();
    if (globalJson.files && globalJson.files.length > 0) {
      const existingId = globalJson.files[0].id;
      // Move into folder
      try {
        await fetch(`https://www.googleapis.com/drive/v3/files/${existingId}?addParents=${folderId}&enforceSingleParent=true`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (e) {
        console.warn('Could not move existing sheet into folder:', e);
      }
      return {
        id: existingId,
        url: `https://docs.google.com/spreadsheets/d/${existingId}/edit`,
        isNew: false,
      };
    }
  }

  // 3. Create fresh spreadsheet with formatted header row
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
                  values: HEADER_ROW.map((col) => ({
                    userEnteredValue: { stringValue: col },
                    userEnteredFormat: {
                      textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } },
                      backgroundColor: { red: 0.31, green: 0.27, blue: 0.90 }, // Indigo
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
    throw new Error('Gagal membuat Spreadsheet rekap nilai di Google Sheets.');
  }

  const createdData = await createRes.json();
  const spreadsheetId = createdData.spreadsheetId;

  // 4. Move newly created spreadsheet into the 'ujicoba aplikasi' folder
  try {
    await fetch(`https://www.googleapis.com/drive/v3/files/${spreadsheetId}?addParents=${folderId}&enforceSingleParent=true`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    console.warn('Move to folder warning:', err);
  }

  return {
    id: spreadsheetId,
    url: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
    isNew: true,
  };
};

/**
 * Initializes the folder and spreadsheet in Google Drive proactively.
 */
export const initializeDriveFolderAndSheet = async (existingToken?: string): Promise<SheetExportResult> => {
  const token = existingToken || (await getAccessToken());
  if (!token) {
    throw new Error('Belum terhubung ke Akun Google. Silakan login terlebih dahulu.');
  }

  // 1. Ensure folder exists
  const folder = await findOrCreateAppFolder(token);

  // 2. Ensure sheet exists in folder
  const sheet = await findOrCreateSpreadsheetInFolder(token, folder.id);

  return {
    spreadsheetId: sheet.id,
    spreadsheetUrl: sheet.url,
    folderId: folder.id,
    folderUrl: folder.url,
    isNewSheet: sheet.isNew,
  };
};

/**
 * Records student quiz results into the Google Spreadsheet inside 'ujicoba aplikasi' folder.
 */
export const exportQuizResultToGoogleSheet = async (
  data: QuizSubmissionData
): Promise<SheetExportResult> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Belum terhubung ke Akun Google. Silakan login dengan Google terlebih dahulu.');
  }

  // 1. Get or create folder and sheet
  const setup = await initializeDriveFolderAndSheet(token);

  // 2. Format row data
  const m = Math.floor(data.timeSpentSeconds / 60);
  const s = data.timeSpentSeconds % 60;
  const timeFormatted = `${m}m ${s < 10 ? '0' : ''}${s}s`;

  const questionAnswers: string[] = [];
  for (let i = 1; i <= 20; i++) {
    questionAnswers.push(data.answers[i] || '-');
  }

  const rowValues = [
    new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
    data.studentName,
    data.grade,
    data.score, // 0 to 100
    `${data.correctCount} (${data.score} poin)`,
    data.wrongCount,
    timeFormatted,
    ...questionAnswers,
  ];

  // 3. Append to 'Rekap Nilai Siswa'
  const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${setup.spreadsheetId}/values/'Rekap Nilai Siswa'!A1:append?valueInputOption=USER_ENTERED`;

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
    // Fallback if sheet tab title is default Sheet1
    const fallbackAppendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${setup.spreadsheetId}/values/A1:append?valueInputOption=USER_ENTERED`;
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
      throw new Error('Gagal menambahkan baris nilai siswa ke Google Sheets.');
    }
  }

  return setup;
};
