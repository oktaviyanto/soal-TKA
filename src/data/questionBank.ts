import { Question } from '../types/geometry';

export const QUESTION_BANK: Question[] = [
  // ================= SOAL 1 - 8: TOPIK LINGKARAN =================
  {
    id: 'geo-q-01',
    questionNumber: 1,
    dimension: 'Lingkaran',
    category: 'Juring & Panjang Busur',
    gradeLevel: 'Kelas 9',
    difficulty: 'Dasar',
    title: 'Luas Juring Lingkaran dengan Sudut Pusat 60°',
    prompt:
      'Sebuah lingkaran berpusat di titik O memiliki panjang jari-jari 21 cm. Terdapat sebuah juring lingkaran AOB dengan sudut pusat ∠AOB = 60°. Dengan menggunakan nilai π = 22/7, berapakah luas juring AOB tersebut?',
    diagramConfig: {
      type: 'circle_sector',
      params: {
        angle: 60,
        radius: '21 cm',
        showShade: true,
      },
    },
    options: [
      { id: 'A', text: '184 cm²' },
      { id: 'B', text: '231 cm²' },
      { id: 'C', text: '462 cm²' },
      { id: 'D', text: '693 cm²' },
    ],
    correctAnswer: 'B',
    explanation: {
      keyFormula: 'Luas Juring = (θ / 360°) × π × r²',
      steps: [
        {
          stepNumber: 1,
          title: 'Menentukan Proporsi Sudut terhadap 1 Putaran Penuh',
          content: 'Proporsi juring lingkaran = θ / 360° = 60° / 360° = 1 / 6 bagian.',
          formulaSnippet: 'Rasio = 60° / 360° = 1/6',
        },
        {
          stepNumber: 2,
          title: 'Menghitung Luas Lingkaran Penuh',
          content: 'Luas lingkaran penuh = π × r² = (22/7) × 21 × 21 = 22 × 3 × 21 = 1.386 cm².',
          formulaSnippet: 'L_lingkaran = 1.386 cm²',
        },
        {
          stepNumber: 3,
          title: 'Menghitung Luas Juring AOB',
          content: 'Luas Juring = (1/6) × 1.386 cm² = 231 cm².',
          formulaSnippet: 'Luas Juring = 231 cm²',
        },
      ],
      quickTip:
        'Coret pecahan: (1/6) × (22/7) × 21 × 21. Coret 21 dengan 7 menyisakan 3. Coret 3 dengan 6 menyisakan 2 di bawah. 22 : 2 = 11. Langsung hitung 11 × 21 = 231 cm²!',
      conceptSummary:
        'Luas juring merupakan pecahan luas lingkaran yang sebanding dengan perbandingan sudut pusatnya terhadap 360°.',
    },
    hintText: 'Hitung (60° / 360°) × (22/7) × 21 × 21.',
  },

  {
    id: 'geo-q-02',
    questionNumber: 2,
    dimension: 'Lingkaran',
    category: 'Juring & Panjang Busur',
    gradeLevel: 'Kelas 9',
    difficulty: 'Dasar',
    title: 'Panjang Busur Lingkaran dengan Sudut 90°',
    prompt:
      'Diketahui sebuah lingkaran berpusat di O dengan panjang jari-jari 14 cm. Jika sudut pusat ∠POQ = 90°, dengan nilai π = 22/7, berapakah panjang busur lingkaran PQ?',
    diagramConfig: {
      type: 'circle_sector',
      params: {
        angle: 90,
        radius: '14 cm',
        showShade: false,
      },
    },
    options: [
      { id: 'A', text: '18 cm' },
      { id: 'B', text: '22 cm' },
      { id: 'C', text: '28 cm' },
      { id: 'D', text: '44 cm' },
    ],
    correctAnswer: 'B',
    explanation: {
      keyFormula: 'Panjang Busur = (θ / 360°) × 2 × π × r',
      steps: [
        {
          stepNumber: 1,
          title: 'Proporsi Sudut terhadap Keliling',
          content: 'Sudut 90° adalah seperempat lingkaran: 90° / 360° = 1 / 4.',
          formulaSnippet: 'Rasio = 1/4',
        },
        {
          stepNumber: 2,
          title: 'Menghitung Keliling Lingkaran',
          content: 'Keliling = 2 × π × r = 2 × (22/7) × 14 = 2 × 22 × 2 = 88 cm.',
          formulaSnippet: 'K = 88 cm',
        },
        {
          stepNumber: 3,
          title: 'Menghitung Panjang Busur PQ',
          content: 'Panjang Busur = (1/4) × 88 cm = 22 cm.',
          formulaSnippet: 'Panjang Busur = 22 cm',
        },
      ],
      quickTip:
        'Keliling lingkaran berjari-jari 14 cm selalu bernilai 88 cm. Karena sudutnya siku-siku (90°), langsung bagi 88 dengan 4 = 22 cm.',
      conceptSummary:
        'Panjang busur lingkaran berbanding lurus dengan besar sudut pusat yang menghadap busur tersebut.',
    },
    hintText: 'Sudut 90° adalah 1/4 dari keliling lingkaran utuh (2 × π × r).',
  },

  {
    id: 'geo-q-03',
    questionNumber: 3,
    dimension: 'Lingkaran',
    category: 'Sudut Pusat & Sudut Keliling',
    gradeLevel: 'Kelas 9',
    difficulty: 'Sedang',
    title: 'Hubungan Sudut Pusat dan Sudut Keliling',
    prompt:
      'Pada sebuah lingkaran, sudut pusat ∠AOB dan sudut keliling ∠ACB menghadap busur yang sama, yaitu busur AB. Jika besar sudut pusat ∠AOB adalah 80°, berapakah besar sudut keliling ∠ACB?',
    diagramConfig: {
      type: 'circle_angles',
      params: {
        centerAngle: '80°',
        inscribedAngle: '40°',
      },
    },
    options: [
      { id: 'A', text: '40°' },
      { id: 'B', text: '50°' },
      { id: 'C', text: '120°' },
      { id: 'D', text: '160°' },
    ],
    correctAnswer: 'A',
    explanation: {
      keyFormula: 'Sudut Keliling = ½ × Sudut Pusat (menghadap busur yang sama)',
      steps: [
        {
          stepNumber: 1,
          title: 'Mengingat Teorema Sudut pada Lingkaran',
          content:
            'Jika sudut pusat dan sudut keliling menghadap busur yang sama persis, maka besar sudut keliling selalu sama dengan setengah kali besar sudut pusatnya.',
          formulaSnippet: '∠ACB = ½ × ∠AOB',
        },
        {
          stepNumber: 2,
          title: 'Perhitungan Nilai Sudut',
          content: '∠ACB = ½ × 80° = 40°.',
          formulaSnippet: '∠ACB = 40°',
        },
      ],
      quickTip:
        'Kuncinya: PUSAT lebih besar (2 kali lipat), KELILING lebih kecil (setengahnya), asalkan menghadap busur yang sama.',
      conceptSummary:
        'Sudut pusat adalah sudut yang titik sudutnya di pusat lingkaran, sedangkan sudut keliling titik sudutnya terletak pada busur keliling lingkaran.',
    },
    hintText: 'Besar sudut keliling adalah setengah dari besar sudut pusat jika menghadap busur yang sama.',
  },

  {
    id: 'geo-q-04',
    questionNumber: 4,
    dimension: 'Lingkaran',
    category: 'Aplikasi Kontekstual Lingkaran',
    gradeLevel: 'Kelas 9',
    difficulty: 'Sedang',
    title: 'Jangkauan Semprotan Alat Penyiram Rumput Otomatis',
    prompt:
      'Sebuah alat penyiram rumput otomatis (rotary sprinkler) dipasang di sudut sebuah taman rumput. Alat tersebut menyemprotkan air dengan jangkauan radius 14 meter dan berputar dengan sudut putaran 135° membentuk juring lingkaran. Berapakah luas area rumput yang terkena siraman air tersebut? (Gunakan π = 22/7)',
    diagramConfig: {
      type: 'circle_sector',
      params: {
        angle: 135,
        radius: '14 m',
        showShade: true,
      },
    },
    options: [
      { id: 'A', text: '154 m²' },
      { id: 'B', text: '231 m²' },
      { id: 'C', text: '308 m²' },
      { id: 'D', text: '462 m²' },
    ],
    correctAnswer: 'B',
    explanation: {
      keyFormula: 'Luas Juring = (α / 360°) × π × r²',
      steps: [
        {
          stepNumber: 1,
          title: 'Sederhanakan Pecahan Sudut Putaran',
          content:
            'Sudut semprotan α = 135°.\nPecahan lingkaran = 135° / 360° = (135 ÷ 45) / (360 ÷ 45) = 3/8 bagian lingkaran.',
          formulaSnippet: 'Pecahan = 3/8 bagian',
        },
        {
          stepNumber: 2,
          title: 'Hitung Luas Lingkaran Penuh (r = 14 m)',
          content: 'L_penuh = π × r² = (22/7) × 14 × 14 = 22 × 2 × 14 = 616 m².',
          formulaSnippet: 'L_penuh = 616 m²',
        },
        {
          stepNumber: 3,
          title: 'Hitung Luas Area Terkena Air',
          content: 'Luas Area = (3/8) × 616 = 3 × 77 = 231 m².',
          formulaSnippet: 'Luas Area = 231 m²',
        },
      ],
      quickTip:
        'Kuasai penyederhanaan sudut istimewa: 135° selalu sama dengan 3/8 lingkaran (karena 45° = 1/8, maka 3 × 45° = 3/8). Cukup kalikan 3/8 × 616 = 231 m²!',
      conceptSummary:
        'Alat penyiram berputar (sprinkler) di sudut lapangan membentuk juring lingkaran. Luas area jangkauan air dihitung proporsional terhadap besar sudut rotasinya.',
    },
    hintText: 'Sederhanakan 135° / 360° menjadi 3/8, lalu kalikan dengan luas lingkaran penuh (616 m²).',
  },

  {
    id: 'geo-q-05',
    questionNumber: 5,
    dimension: 'Lingkaran',
    category: 'Roda Berputar & Aplikasi Lingkaran',
    gradeLevel: 'Kelas 9',
    difficulty: 'Sedang',
    title: 'Jarak Tempuh Sepeda dari Putaran Roda',
    prompt:
      'Sebuah roda sepeda memiliki jari-jari 28 cm. Jika roda tersebut berputar lurus sebanyak 100 kali putaran di atas jalan mendatar, berapakah jarak lintasan yang telah ditempuh sepeda tersebut? (Gunakan π = 22/7)',
    diagramConfig: {
      type: 'circle_wheel',
      params: {
        radius: '28 cm',
        rotations: '100 kali',
      },
    },
    options: [
      { id: 'A', text: '88 meter' },
      { id: 'B', text: '176 meter' },
      { id: 'C', text: '246 meter' },
      { id: 'D', text: '352 meter' },
    ],
    correctAnswer: 'B',
    explanation: {
      keyFormula: 'Jarak Tempuh = Banyak Putaran (n) × Keliling Lingkaran (K)',
      steps: [
        {
          stepNumber: 1,
          title: 'Menghitung Keliling Roda Sepeda',
          content: 'K = 2 × π × r = 2 × (22/7) × 28 = 2 × 22 × 4 = 176 cm.',
          formulaSnippet: 'K = 176 cm (1 putaran)',
        },
        {
          stepNumber: 2,
          title: 'Menghitung Total Jarak untuk 100 Putaran',
          content: 'Jarak = 100 × 176 cm = 17.600 cm.',
          formulaSnippet: 'Jarak = 17.600 cm',
        },
        {
          stepNumber: 3,
          title: 'Konversi Satuan ke Meter',
          content: '17.600 cm / 100 = 176 meter.',
          formulaSnippet: 'Jarak = 176 m',
        },
      ],
      quickTip:
        'Satu putaran roda selalu sama dengan 1 keliling lingkaran. Ingat konversi: 1 meter = 100 cm, jadi 100 putaran langsung menghasilkan angka keliling dalam satuan meter!',
      conceptSummary:
        'Setiap kali roda berputar 1 putaran penuh tanpa slip, titik pada roda menempuh jarak sejauh keliling roda tersebut.',
    },
    hintText: 'Jarak tempuh = 100 × keliling roda. Hitung keliling roda 2 × (22/7) × 28 cm.',
  },

  {
    id: 'geo-q-06',
    questionNumber: 6,
    dimension: 'Lingkaran',
    category: 'Keliling & Luas Lingkaran',
    gradeLevel: 'Kelas 9',
    difficulty: 'HOTS / Menantang',
    title: 'Luas Jalan Setapak Cincin Melingkari Kolam',
    prompt:
      'Di tengah taman kota terdapat kolam ikan berbentuk lingkaran dengan jari-jari 7 meter. Di sekeliling kolam tersebut dibangun jalan setapak melingkar dengan lebar 7 meter, sehingga jari-jari lingkaran luar menjadi 14 meter. Berapakah luas area jalan setapak tersebut? (Gunakan π = 22/7)',
    diagramConfig: {
      type: 'circle_sector',
      params: {
        angle: 360,
        radius: '14 m',
        showShade: true,
      },
    },
    options: [
      { id: 'A', text: '308 m²' },
      { id: 'B', text: '462 m²' },
      { id: 'C', text: '516 m²' },
      { id: 'D', text: '616 m²' },
    ],
    correctAnswer: 'B',
    explanation: {
      keyFormula: 'Luas Cincin Lingkaran = π × (R² - r²)',
      steps: [
        {
          stepNumber: 1,
          title: 'Menghitung Luas Lingkaran Luar (R = 14 m)',
          content: 'L_luar = π × R² = (22/7) × 14 × 14 = 22 × 2 × 14 = 616 m².',
          formulaSnippet: 'L_luar = 616 m²',
        },
        {
          stepNumber: 2,
          title: 'Menghitung Luas Kolam Ikan (r = 7 m)',
          content: 'L_kolam = π × r² = (22/7) × 7 × 7 = 22 × 7 = 154 m².',
          formulaSnippet: 'L_kolam = 154 m²',
        },
        {
          stepNumber: 3,
          title: 'Menghitung Luas Jalan Setapak (Selisih Luas)',
          content: 'Luas Jalan = L_luar - L_kolam = 616 - 154 = 462 m².',
          formulaSnippet: 'L_jalan = 462 m²',
        },
      ],
      quickTip:
        'Hafalkan angka sakti lingkaran kelipatan 7: r=7 luasnya 154, r=14 luasnya 616. Luas cincin = 616 - 154 = 462 m²!',
      conceptSummary:
        'Luas bidang antara dua lingkaran sepusat (konsentris) adalah selisih luas lingkaran besar dikurangi luas lingkaran kecil.',
    },
    hintText: 'Kurangkan luas lingkaran besar (jari-jari 14 m) dengan luas lingkaran kecil kolam (jari-jari 7 m).',
  },

  {
    id: 'geo-q-07',
    questionNumber: 7,
    dimension: 'Lingkaran',
    category: 'Aplikasi Kontekstual Lingkaran',
    gradeLevel: 'Kelas 9',
    difficulty: 'HOTS / Menantang',
    title: 'Kebutuhan Pita Renda pada Kerajinan Kipas Tradisional',
    prompt:
      'Seorang pengrajin membuat kipas lipat tradisional berbentuk juring lingkaran dengan sudut bukaan 120° dan panjang bilah rangka (jari-jari) 21 cm. Di sekeliling seluruh tepi terluar kipas (meliputi busur lengkung dan kedua bilah samping) akan dipasangi pita renda perak. Berapakah panjang minimal pita renda yang dibutuhkan pengrajin tersebut? (Gunakan π = 22/7)',
    diagramConfig: {
      type: 'circle_sector',
      params: {
        angle: 120,
        radius: '21 cm',
        showShade: true,
      },
    },
    options: [
      { id: 'A', text: '44 cm' },
      { id: 'B', text: '65 cm' },
      { id: 'C', text: '86 cm' },
      { id: 'D', text: '128 cm' },
    ],
    correctAnswer: 'C',
    explanation: {
      keyFormula: 'Keliling Juring = Panjang Busur + 2 × Jari-jari',
      steps: [
        {
          stepNumber: 1,
          title: 'Hitung Panjang Busur Lengkung Kipas',
          content:
            'Panjang Busur = (120° / 360°) × 2 × π × r\n= (1/3) × 2 × (22/7) × 21\n= (1/3) × 2 × 22 × 3 = 44 cm.',
          formulaSnippet: 'Panjang Busur = 44 cm',
        },
        {
          stepNumber: 2,
          title: 'Perhitungkan Kedua Bilah Samping (2 × r)',
          content:
            'Kipas lipat dibatasi oleh 2 bilah rangka samping berukuran r = 21 cm.\nPanjang bilah samping = 2 × 21 = 42 cm.',
          formulaSnippet: '2 × r = 42 cm',
        },
        {
          stepNumber: 3,
          title: 'Hitung Total Keliling Kipas (Panjang Pita Minimal)',
          content: 'Total Pita = Panjang Busur + (2 × r) = 44 + 42 = 86 cm.',
          formulaSnippet: 'Keliling Total = 86 cm',
        },
      ],
      quickTip:
        'Hati-hati jebakan umum: Banyak siswa hanya menghitung panjang busur (44 cm, opsi A). Ingat kata kunci "sekeliling seluruh tepi", sehingga kedua bilah samping (2 × 21 cm = 42 cm) wajib ditambahkan!',
      conceptSummary:
        'Keliling bangun juring lingkaran pada benda nyata (seperti kipas lipat atau potongan pizza) tersusun dari 1 busur lingkaran ditambah 2 buah ruas jari-jari penutupnya.',
    },
    hintText:
      'Hitung panjang busur kipas terlebih dahulu, lalu jangan lupa tambahkan 2 kali panjang jari-jari (bilah samping).',
  },

  {
    id: 'geo-q-08',
    questionNumber: 8,
    dimension: 'Lingkaran',
    category: 'Sudut Pusat & Sudut Keliling',
    gradeLevel: 'Kelas 9',
    difficulty: 'Dasar',
    title: 'Besar Sudut Keliling yang Menghadap Diameter',
    prompt:
      'Garis ruas AB merupakan diameter sebuah lingkaran yang berpusat di titik O. Titik C terletak pada keliling lingkaran tersebut (C ≠ A dan C ≠ B). Berapakah besar sudut ∠ACB?',
    diagramConfig: {
      type: 'circle_angles',
      params: {
        centerAngle: '180°',
        inscribedAngle: '90°',
      },
    },
    options: [
      { id: 'A', text: '45°' },
      { id: 'B', text: '60°' },
      { id: 'C', text: '90°' },
      { id: 'D', text: '180°' },
    ],
    correctAnswer: 'C',
    explanation: {
      keyFormula: 'Sudut keliling menghadap diameter = ½ × 180° = 90°',
      steps: [
        {
          stepNumber: 1,
          title: 'Analisis Sudut Pusat Diameter',
          content: 'Diameter lingkaran AB adalah garis lurus yang melalui titik pusat O, sehingga sudut pusat ∠AOB = 180° (sudut lurus).',
          formulaSnippet: '∠AOB = 180°',
        },
        {
          stepNumber: 2,
          title: 'Menghitung Sudut Keliling',
          content: 'Sudut keliling ∠ACB menghadap busur setengah lingkaran yang sama:\n∠ACB = ½ × 180° = 90° (sudut siku-siku).',
          formulaSnippet: '∠ACB = 90°',
        },
      ],
      quickTip:
        'Teorema Thales: Sembarang sudut keliling yang menghadap diameter lingkaran SELALU berupa sudut siku-siku (90°). Segitiga ACB pasti segitiga siku-siku!',
      conceptSummary:
        'Teorema Thales menyatakan bahwa jika A, B, dan C adalah titik-titik pada lingkaran dengan AB adalah diameter, maka sudut ∠ACB adalah 90°.',
    },
    hintText: 'Diameter membentuk sudut pusat 180°. Sudut kelilingnya adalah setengah dari 180°.',
  },

  // ================= SOAL 9 - 20: TOPIK BANGUN RUANG =================
  {
    id: 'geo-q-09',
    questionNumber: 9,
    dimension: 'Bangun Ruang',
    category: 'Kubus & Balok',
    gradeLevel: 'Kelas 9',
    difficulty: 'Dasar',
    title: 'Kawat Kerangka dan Diagonal Ruang Kubus',
    prompt:
      'Sebuah kerangka kubus dibuat dari kawat logam. Jika panjang rusuk kubus yang dibuat adalah 12 cm, berapakah total panjang kawat yang dibutuhkan untuk membuat kerangka kubus tersebut?',
    diagramConfig: {
      type: 'cube_isometric',
      params: {
        side: '12 cm',
        showDiagonal: true,
      },
    },
    options: [
      { id: 'A', text: '96 cm' },
      { id: 'B', text: '120 cm' },
      { id: 'C', text: '144 cm' },
      { id: 'D', text: '168 cm' },
    ],
    correctAnswer: 'C',
    explanation: {
      keyFormula: 'Panjang Kawat Kerangka Kubus = 12 × s',
      steps: [
        {
          stepNumber: 1,
          title: 'Mengetahui Jumlah Rusuk Kubus',
          content: 'Sebuah kubus memiliki 12 buah rusuk yang sama panjang.',
          formulaSnippet: 'Jumlah Rusuk = 12',
        },
        {
          stepNumber: 2,
          title: 'Menghitung Panjang Kawat',
          content: 'Panjang Kawat = 12 × 12 cm = 144 cm.',
          formulaSnippet: 'Total = 144 cm',
        },
      ],
      quickTip:
        'Kubus punya 12 rusuk, 6 bidang sisi, dan 8 titik sudut. Kerangka kawat = 12 × rusuk.',
      conceptSummary:
        'Panjang kerangka bangun ruang adalah jumlah panjang seluruh rusuk-rusuk pembentuknya.',
    },
    hintText: 'Kalikan jumlah rusuk kubus (12 buah) dengan panjang rusuk 12 cm.',
  },

  {
    id: 'geo-q-10',
    questionNumber: 10,
    dimension: 'Bangun Ruang',
    category: 'Kubus & Balok',
    gradeLevel: 'Kelas 9',
    difficulty: 'Sedang',
    title: 'Perubahan Volume Kubus Akibat Perbesaran Rusuk',
    prompt:
      'Jika panjang setiap rusuk sebuah kubus diperbesar menjadi 3 kali panjang rusuk semula, berapakah perbandingan volume kubus yang baru terhadap volume kubus mula-mula?',
    diagramConfig: {
      type: 'cube_isometric',
      params: {
        side: '3s',
        showDiagonal: false,
      },
    },
    options: [
      { id: 'A', text: '3 kali lipat' },
      { id: 'B', text: '9 kali lipat' },
      { id: 'C', text: '18 kali lipat' },
      { id: 'D', text: '27 kali lipat' },
    ],
    correctAnswer: 'D',
    explanation: {
      keyFormula: 'Volume Baru = k³ × Volume Mula-mula (k = faktor skala)',
      steps: [
        {
          stepNumber: 1,
          title: 'Memisalkan Rusuk Awal',
          content: 'Misal rusuk awal = s, maka volume awal V₁ = s³.',
          formulaSnippet: 'V₁ = s³',
        },
        {
          stepNumber: 2,
          title: 'Menghitung Volume Rusuk Baru (3s)',
          content: 'V₂ = (3s)³ = 3³ × s³ = 27s³.',
          formulaSnippet: 'V₂ = 27 × s³ = 27 V₁',
        },
      ],
      quickTip:
        'Aturan dimensi perbesaran skala k:\n- Panjang = k\n- Luas = k² (misal luas sisi naik 3² = 9 kali)\n- Volume = k³ (maka volume naik 3³ = 27 kali).',
      conceptSummary:
        'Volume sebanding dengan pangkat tiga dari faktor perbesaran linier rusuknya.',
    },
    hintText: 'Pangkatkan 3 faktor perbesarannya: 3³ = ?',
  },

  {
    id: 'geo-q-11',
    questionNumber: 11,
    dimension: 'Bangun Ruang',
    category: 'Kubus & Balok',
    gradeLevel: 'Kelas 9',
    difficulty: 'HOTS / Menantang',
    title: 'Luas Keramik Kolam Renang Balok Tanpa Tutup',
    prompt:
      'Sebuah kolam renang berbentuk balok memiliki ukuran panjang 15 meter, lebar 10 meter, dan kedalaman (tinggi) 2 meter. Bagian lantai dasar dan seluruh dinding dalam kolam akan dipasangi keramik. Berapakah luas permukaan yang dipasangi keramik?',
    diagramConfig: {
      type: 'cuboid_box',
      params: {
        length: '15 m',
        width: '10 m',
        height: '2 m',
      },
    },
    options: [
      { id: 'A', text: '200 m²' },
      { id: 'B', text: '250 m²' },
      { id: 'C', text: '350 m²' },
      { id: 'D', text: '400 m²' },
    ],
    correctAnswer: 'B',
    explanation: {
      keyFormula: 'Luas Balok Tanpa Tutup = (p × l) + 2(p × t) + 2(l × t)',
      steps: [
        {
          stepNumber: 1,
          title: 'Memahami Bidang Kolam',
          content: 'Kolam renang terbuka di bagian atas (tanpa tutup), sehingga luasnya hanya terdiri dari 1 lantai dasar dan 4 dinding vertikal.',
          formulaSnippet: 'L = Lantai + 4 Dinding',
        },
        {
          stepNumber: 2,
          title: 'Menghitung Masing-Masing Bidang',
          content: 'Lantai dasar = 15 × 10 = 150 m².\nDinding depan & belakang = 2 × (15 × 2) = 60 m².\nDinding kiri & kanan = 2 × (10 × 2) = 40 m².',
          formulaSnippet: 'Dinding = 60 + 40 = 100 m²',
        },
        {
          stepNumber: 3,
          title: 'Menjumlahkan Total Luas',
          content: 'Total Luas Keramik = 150 + 100 = 250 m².',
          formulaSnippet: 'Total = 250 m²',
        },
      ],
      quickTip:
        'Rumus kilat luas 4 dinding balok = Keliling alas × tinggi = 2(15 + 10) × 2 = 50 × 2 = 100 m². Tambahkan lantai (15 × 10 = 150 m²), didapat 250 m²!',
      conceptSummary:
        'Pada soal balok terbuka seperti kolam, bak mandi, dan kardus tanpa tutup, jangan menghitung bidang tutup atas (p × l kedua).',
    },
    hintText: 'Hitung luas lantai dasar (15 × 10) ditambah luas 4 dinding sekelilingnya.',
  },

  {
    id: 'geo-q-12',
    questionNumber: 12,
    dimension: 'Bangun Ruang',
    category: 'Kubus & Balok',
    gradeLevel: 'Kelas 9',
    difficulty: 'Dasar',
    title: 'Panjang Kawat Model Kerangka Balok',
    prompt:
      'Ali akan membuat sebuah model kerangka balok dari kawat dengan ukuran panjang 20 cm, lebar 12 cm, dan tinggi 8 cm. Berapakah panjang kawat yang diperlukan Ali?',
    diagramConfig: {
      type: 'cuboid_box',
      params: {
        length: '20 cm',
        width: '12 cm',
        height: '8 cm',
      },
    },
    options: [
      { id: 'A', text: '120 cm' },
      { id: 'B', text: '160 cm' },
      { id: 'C', text: '180 cm' },
      { id: 'D', text: '200 cm' },
    ],
    correctAnswer: 'B',
    explanation: {
      keyFormula: 'Panjang Kawat Kerangka Balok = 4 × (p + l + t)',
      steps: [
        {
          stepNumber: 1,
          title: 'Rusuk-Rusuk Balok',
          content: 'Balok memiliki 12 rusuk yang terbagi menjadi 4 rusuk panjang, 4 rusuk lebar, dan 4 rusuk tinggi.',
          formulaSnippet: 'Kawat = 4p + 4l + 4t',
        },
        {
          stepNumber: 2,
          title: 'Menghitung Total Panjang',
          content: 'Kawat = 4 × (20 + 12 + 8) = 4 × 40 = 160 cm.',
          formulaSnippet: 'Kawat = 160 cm',
        },
      ],
      quickTip:
        'Jumlahkan dulu p + l + t = 20 + 12 + 8 = 40. Lalu langsung kalikan 4 = 160 cm.',
      conceptSummary:
        'Balok memiliki 4 rusuk berukuran p, 4 rusuk berukuran l, dan 4 rusuk berukuran t.',
    },
    hintText: 'Gunakan rumus kawat balok: 4 × (panjang + lebar + tinggi).',
  },

  {
    id: 'geo-q-13',
    questionNumber: 13,
    dimension: 'Bangun Ruang',
    category: 'Tabung (Silinder)',
    gradeLevel: 'Kelas 9',
    difficulty: 'Sedang',
    title: 'Volume Air ¾ Kapasitas Tabung',
    prompt:
      'Sebuah wadah berbentuk tabung memiliki diameter alas 14 cm dan tinggi 20 cm. Wadah tersebut saat ini terisi air sebanyak ¾ dari kapasitas penuhnya. Berapakah volume air di dalam wadah tersebut? (Gunakan π = 22/7)',
    diagramConfig: {
      type: 'cylinder_water',
      params: {
        radius: '7 cm',
        height: '20 cm',
        waterLevel: 0.75,
      },
    },
    options: [
      { id: 'A', text: '1.540 cm³' },
      { id: 'B', text: '2.310 cm³' },
      { id: 'C', text: '3.080 cm³' },
      { id: 'D', text: '4.620 cm³' },
    ],
    correctAnswer: 'B',
    explanation: {
      keyFormula: 'Volume Air = ¾ × (π × r² × t)',
      steps: [
        {
          stepNumber: 1,
          title: 'Menentukan Jari-Jari Alas',
          content: 'Diameter d = 14 cm, maka r = 14 / 2 = 7 cm.',
          formulaSnippet: 'r = 7 cm',
        },
        {
          stepNumber: 2,
          title: 'Menghitung Volume Tabung Penuh',
          content: 'V_penuh = (22/7) × 7 × 7 × 20 = 154 × 20 = 3.080 cm³.',
          formulaSnippet: 'V_penuh = 3.080 cm³',
        },
        {
          stepNumber: 3,
          title: 'Menghitung ¾ Bagian Air',
          content: 'V_air = ¾ × 3.080 cm³ = 3 × 770 = 2.310 cm³.',
          formulaSnippet: 'V_air = 2.310 cm³',
        },
      ],
      quickTip:
        'Luas lingkaran r=7 cm selalu 154 cm². Karena airnya ¾ dari tinggi 20 cm, tinggi air = ¾ × 20 = 15 cm. Maka V = 154 × 15 = 2.310 cm³.',
      conceptSummary:
        'Volume tabung adalah luas alas lingkaran dikali tinggi wadah.',
    },
    hintText: 'Jari-jari alas adalah 7 cm. Hitung volume tabung utuh lalu kalikan 3/4.',
  },

  {
    id: 'geo-q-14',
    questionNumber: 14,
    dimension: 'Bangun Ruang',
    category: 'Tabung (Silinder)',
    gradeLevel: 'Kelas 9',
    difficulty: 'Sedang',
    title: 'Luas Seng untuk Membuat Kaleng Tanpa Tutup',
    prompt:
      'Seorang pengrajin ingin membuat wadah kaleng silinder terbuka (tanpa tutup) dari lembaran seng. Jari-jari alas kaleng adalah 7 cm dan tingginya 10 cm. Berapakah luas seng minimal yang diperlukan? (Gunakan π = 22/7)',
    diagramConfig: {
      type: 'cylinder_water',
      params: {
        radius: '7 cm',
        height: '10 cm',
        waterLevel: 0,
      },
    },
    options: [
      { id: 'A', text: '440 cm²' },
      { id: 'B', text: '594 cm²' },
      { id: 'C', text: '748 cm²' },
      { id: 'D', text: '890 cm²' },
    ],
    correctAnswer: 'B',
    explanation: {
      keyFormula: 'Luas Tabung Tanpa Tutup = π r² + 2 π r t',
      steps: [
        {
          stepNumber: 1,
          title: 'Menghitung Luas Alas Lingkaran (1 bidang)',
          content: 'L_alas = (22/7) × 7 × 7 = 154 cm².',
          formulaSnippet: 'L_alas = 154 cm²',
        },
        {
          stepNumber: 2,
          title: 'Menghitung Luas Selimut Tabung',
          content: 'L_selimut = 2 × (22/7) × 7 × 10 = 44 × 10 = 440 cm².',
          formulaSnippet: 'L_selimut = 440 cm²',
        },
        {
          stepNumber: 3,
          title: 'Menjumlahkan Luas Total',
          content: 'Total Luas = 154 + 440 = 594 cm².',
          formulaSnippet: 'Total = 594 cm²',
        },
      ],
      quickTip:
        'Rumus ringkas: πr(r + 2t) = 22 × (7 + 20) = 22 × 27 = 594 cm².',
      conceptSummary:
        'Tabung tanpa tutup hanya memiliki 1 bidang alas lingkaran dan 1 selimut persegi panjang.',
    },
    hintText: 'Kaleng terbuka tidak punya tutup atas: jumlahkan 1 luas alas lingkaran (154) dengan luas selimut (440).',
  },

  {
    id: 'geo-q-15',
    questionNumber: 15,
    dimension: 'Bangun Ruang',
    category: 'Tabung (Silinder)',
    gradeLevel: 'Kelas 9',
    difficulty: 'HOTS / Menantang',
    title: 'Kenaikan Air Tabung Akibat Dimasukkan 3 Bola Besi',
    prompt:
      'Sebuah wadah tabung dengan jari-jari alas 14 cm berisi air sebagian. Ke dalam tabung tersebut dimasukkan 3 buah bola besi padat yang masing-masing berjari-jari 7 cm hingga seluruhnya tenggelam. Berapakah pertambahan tinggi air (kenaikan air) di dalam tabung tersebut?',
    diagramConfig: {
      type: 'cylinder_spheres',
      params: {
        radius: '14 cm',
        sphereR: '7 cm',
        rise: 'Δt = ?',
      },
    },
    options: [
      { id: 'A', text: '3,5 cm' },
      { id: 'B', text: '7 cm' },
      { id: 'C', text: '10,5 cm' },
      { id: 'D', text: '14 cm' },
    ],
    correctAnswer: 'B',
    explanation: {
      keyFormula: 'Volume Kenaikan Air Tabung = Total Volume 3 Bola Besi',
      steps: [
        {
          stepNumber: 1,
          title: 'Prinsip Archimedes Pemindahan Volume Zat Cair',
          content:
            'Volume pertambahan air tabung = 3 × Volume bola\nπ × (r_tabung)² × Δt = 3 × (⁴⁄₃ × π × (r_bola)³)',
          formulaSnippet: 'π × 14² × Δt = 4 × π × 7³',
        },
        {
          stepNumber: 2,
          title: 'Penyederhanaan Persamaan',
          content:
            'Coret nilai π pada kedua sisi:\n14 × 14 × Δt = 4 × 7 × 7 × 7\n196 × Δt = 4 × 343\n196 × Δt = 1.372\nΔt = 1.372 / 196 = 7 cm.',
          formulaSnippet: 'Δt = 7 cm',
        },
      ],
      quickTip:
        'Coret faktor 7 dari 14:\n(2 × 2) × Δt = 4 × 7 ⟹ 4 × Δt = 28 ⟹ Δt = 7 cm! Tidak perlu mengalikan angka ribuan.',
      conceptSummary:
        'Ketika benda padat dimasukkan ke dalam bejana air, volume cairan yang terdesak naik sama persis dengan total volume benda padat yang tercelup.',
    },
    hintText: 'Gunakan kesamaan volume: π × (r_tabung)² × kenaikan tinggi = 3 × (4/3 × π × r_bola³).',
  },

  {
    id: 'geo-q-16',
    questionNumber: 16,
    dimension: 'Bangun Ruang',
    category: 'Kerucut',
    gradeLevel: 'Kelas 9',
    difficulty: 'HOTS / Menantang',
    title: 'Luas Selimut Kain Terpal Tenda Kerucut',
    prompt:
      'Sebuah tenda kemah pramuka berbentuk kerucut tanpa alas memiliki diameter lingkaran dasar 14 meter dan tinggi puncak 24 meter. Berapakah luas kain terpal minimal yang dibutuhkan untuk membuat selimut tenda tersebut? (Gunakan π = 22/7)',
    diagramConfig: {
      type: 'cone_tent',
      params: {
        radius: '7 m',
        height: '24 m',
        slantHeight: '25 m',
      },
    },
    options: [
      { id: 'A', text: '480 m²' },
      { id: 'B', text: '528 m²' },
      { id: 'C', text: '550 m²' },
      { id: 'D', text: '616 m²' },
    ],
    correctAnswer: 'C',
    explanation: {
      keyFormula: 'Luas Selimut Kerucut = π × r × s dengan s = √(r² + t²)',
      steps: [
        {
          stepNumber: 1,
          title: 'Mencari Garis Pelukis (s)',
          content: 'Jari-jari r = 14 / 2 = 7 m, tinggi t = 24 m.\ns = √(7² + 24²) = √(49 + 576) = √625 = 25 m.',
          formulaSnippet: 's = 25 m (Tripel 7, 24, 25)',
        },
        {
          stepNumber: 2,
          title: 'Menghitung Luas Selimut',
          content: 'Luas Selimut = (22/7) × 7 × 25 = 22 × 25 = 550 m².',
          formulaSnippet: 'L_selimut = 550 m²',
        },
      ],
      quickTip:
        'Tripel pythagoras (7, 24, 25) sangat sering dipakai di kerucut SMP. Coret angka 7 pada r dan penyebut π, tinggal 22 × 25 = 550 m².',
      conceptSummary:
        'Selimut kerucut jika direbahkan berbentuk juring lingkaran dengan jari-jari sama dengan garis pelukis s.',
    },
    hintText: 'Cari dulu garis pelukis s = √(7² + 24²), lalu kalikan π × r × s.',
  },

  {
    id: 'geo-q-17',
    questionNumber: 17,
    dimension: 'Bangun Ruang',
    category: 'Kerucut',
    gradeLevel: 'Kelas 9',
    difficulty: 'Sedang',
    title: 'Volume Nasi Tumpeng Berbentuk Kerucut',
    prompt:
      'Sebuah nasi tumpeng untuk acara syukuran dibuat berbentuk kerucut dengan diameter alas 14 cm dan tinggi 18 cm. Berapakah volume nasi tumpeng tersebut? (Gunakan π = 22/7)',
    diagramConfig: {
      type: 'cone_tent',
      params: {
        radius: '7 cm',
        height: '18 cm',
        slantHeight: 's',
      },
    },
    options: [
      { id: 'A', text: '724 cm³' },
      { id: 'B', text: '924 cm³' },
      { id: 'C', text: '1.232 cm³' },
      { id: 'D', text: '2.772 cm³' },
    ],
    correctAnswer: 'B',
    explanation: {
      keyFormula: 'Volume Kerucut = ⅓ × π × r² × t',
      steps: [
        {
          stepNumber: 1,
          title: 'Menentukan Jari-Jari Alas',
          content: 'r = 14 / 2 = 7 cm, tinggi t = 18 cm.',
          formulaSnippet: 'r = 7 cm, t = 18 cm',
        },
        {
          stepNumber: 2,
          title: 'Menghitung Luas Alas Lingkaran',
          content: 'Luas alas = (22/7) × 7 × 7 = 154 cm².',
          formulaSnippet: 'L_alas = 154 cm²',
        },
        {
          stepNumber: 3,
          title: 'Menghitung Volume Kerucut',
          content: 'Volume = ⅓ × 154 × 18 = 154 × 6 = 924 cm³.',
          formulaSnippet: 'V = 924 cm³',
        },
      ],
      quickTip:
        'Coret 18 dengan ⅓ menjadi 6. Lalu tinggal 154 × 6 = 924 cm³!',
      conceptSummary:
        'Volume kerucut adalah sepertiga dari volume tabung dengan luas alas dan tinggi yang sama.',
    },
    hintText: 'Gunakan rumus volume kerucut: 1/3 × π × r² × t dengan r = 7 cm dan t = 18 cm.',
  },

  {
    id: 'geo-q-18',
    questionNumber: 18,
    dimension: 'Bangun Ruang',
    category: 'Limas Segiempat',
    gradeLevel: 'Kelas 9',
    difficulty: 'HOTS / Menantang',
    title: 'Luas Seluruh Permukaan Limas Persegi T.ABCD',
    prompt:
      'Sebuah limas beraturan T.ABCD memiliki alas berbentuk persegi dengan panjang sisi 10 cm. Jika tinggi limas (jarak puncak T ke pusat alas) adalah 12 cm, berapakah luas seluruh permukaan limas tersebut?',
    diagramConfig: {
      type: 'pyramid_square',
      params: {
        base: '10 cm',
        height: '12 cm',
        apothem: '13 cm',
      },
    },
    options: [
      { id: 'A', text: '260 cm²' },
      { id: 'B', text: '340 cm²' },
      { id: 'C', text: '360 cm²' },
      { id: 'D', text: '400 cm²' },
    ],
    correctAnswer: 'C',
    explanation: {
      keyFormula: 'Luas Permukaan Limas = Luas Alas Persegi + 4 × (Luas Segitiga Sisi Tegak)',
      steps: [
        {
          stepNumber: 1,
          title: 'Menghitung Luas Alas Persegi',
          content: 'L_alas = sisi × sisi = 10 × 10 = 100 cm².',
          formulaSnippet: 'L_alas = 100 cm²',
        },
        {
          stepNumber: 2,
          title: 'Mencari Tinggi Segitiga Sisi Tegak dengan Pythagoras',
          content:
            'Jarak pusat alas ke sisi samping = 10 / 2 = 5 cm.\nTinggi segitiga tegak (t_tegak) = √(12² + 5²) = √(144 + 25) = √169 = 13 cm.',
          formulaSnippet: 't_tegak = 13 cm (Tripel 5, 12, 13)',
        },
        {
          stepNumber: 3,
          title: 'Menghitung Luas 4 Segitiga dan Total Permukaan',
          content:
            'Luas 1 Segitiga = ½ × 10 × 13 = 65 cm².\nLuas 4 Segitiga = 4 × 65 = 260 cm².\nTotal Luas Permukaan = 100 + 260 = 360 cm².',
          formulaSnippet: 'Total = 360 cm²',
        },
      ],
      quickTip:
        'Hati-hati: jangan pakai tinggi limas 12 cm untuk luas segitiga! Pakai tinggi miring segitiga 13 cm dari tripel pythagoras 5, 12, 13.',
      conceptSummary:
        'Limas segiempat beraturan memiliki 1 alas persegi dan 4 sisi tegak berbentuk segitiga sama kaki yang kongruen.',
    },
    hintText: 'Cari tinggi segitiga sisi tegak dulu dengan pythagoras: √(12² + 5²) = 13 cm.',
  },

  {
    id: 'geo-q-19',
    questionNumber: 19,
    dimension: 'Bangun Ruang',
    category: 'Bola & Belahan Bola',
    gradeLevel: 'Kelas 9',
    difficulty: 'Sedang',
    title: 'Biaya Pengecatan Kubah Masjid Belahan Bola',
    prompt:
      'Kubah sebuah masjid berbentuk setengah bola berongga dengan diameter 14 meter. Permukaan luar kubah akan dicat dengan biaya Rp40.000 per m². Berapakah total biaya yang harus dikeluarkan? (Gunakan π = 22/7)',
    diagramConfig: {
      type: 'hemisphere_dome',
      params: {
        radius: '7 m',
      },
    },
    options: [
      { id: 'A', text: 'Rp6.160.000' },
      { id: 'B', text: 'Rp12.320.000' },
      { id: 'C', text: 'Rp18.480.000' },
      { id: 'D', text: 'Rp24.640.000' },
    ],
    correctAnswer: 'B',
    explanation: {
      keyFormula: 'Luas Kubah Belahan Bola Berongga = 2 × π × r²',
      steps: [
        {
          stepNumber: 1,
          title: 'Menentukan Jari-Jari Kubah',
          content: 'Diameter d = 14 m, maka r = 14 / 2 = 7 m.',
          formulaSnippet: 'r = 7 m',
        },
        {
          stepNumber: 2,
          title: 'Menghitung Luas Permukaan Setengah Bola',
          content: 'Luas = 2 × (22/7) × 7 × 7 = 2 × 22 × 7 = 308 m².',
          formulaSnippet: 'Luas = 308 m²',
        },
        {
          stepNumber: 3,
          title: 'Menghitung Total Biaya Pengecatan',
          content: 'Biaya = 308 m² × Rp40.000/m² = Rp12.320.000.',
          formulaSnippet: 'Biaya = Rp12.320.000',
        },
      ],
      quickTip:
        'Kubah berongga = 2πr² (tanpa alas penutup). Jika belahan bola padat = 3πr².',
      conceptSummary:
        'Luas seluruh bola adalah 4πr², sehingga kubah setengah bola berongga memiliki luas tepat 2πr².',
    },
    hintText: 'Kubah masjid adalah setengah bola tanpa alas, rumusnya 2 × π × r² dengan r = 7 m.',
  },

  {
    id: 'geo-q-20',
    questionNumber: 20,
    dimension: 'Bangun Ruang',
    category: 'Bangun Ruang Gabungan',
    gradeLevel: 'Kelas 9',
    difficulty: 'HOTS / Menantang',
    title: 'Kapasitas Volume Wadah Silo Gandum (Tabung + Kerucut)',
    prompt:
      'Sebuah silo penyimpan gandum berbentuk gabungan tabung dan kerucut di bagian atapnya. Jari-jari tabung dan kerucut sama, yaitu 7 meter. Jika tinggi tabung adalah 10 meter dan tinggi kerucut adalah 6 meter, berapakah total volume wadah silo tersebut? (Gunakan π = 22/7)',
    diagramConfig: {
      type: 'composite_silo',
      params: {
        radius: '7 m',
        cylHeight: '10 m',
        coneHeight: '6 m',
      },
    },
    options: [
      { id: 'A', text: '1.694 m³' },
      { id: 'B', text: '1.848 m³' },
      { id: 'C', text: '2.156 m³' },
      { id: 'D', text: '2.464 m³' },
    ],
    correctAnswer: 'B',
    explanation: {
      keyFormula: 'Volume Gabungan = Volume Tabung + Volume Kerucut = π r² (t_tabung + ⅓ t_kerucut)',
      steps: [
        {
          stepNumber: 1,
          title: 'Menghitung Luas Alas Lingkaran',
          content: 'Luas alas = (22/7) × 7 × 7 = 154 m².',
          formulaSnippet: 'L_alas = 154 m²',
        },
        {
          stepNumber: 2,
          title: 'Menghitung Volume Bagian Tabung',
          content: 'V_tabung = 154 × 10 = 1.540 m³.',
          formulaSnippet: 'V_tabung = 1.540 m³',
        },
        {
          stepNumber: 3,
          title: 'Menghitung Volume Bagian Kerucut Atap',
          content: 'V_kerucut = ⅓ × 154 × 6 = 154 × 2 = 308 m³.',
          formulaSnippet: 'V_kerucut = 308 m³',
        },
        {
          stepNumber: 4,
          title: 'Menjumlahkan Volume Total',
          content: 'V_total = 1.540 + 308 = 1.848 m³.',
          formulaSnippet: 'Total = 1.848 m³',
        },
      ],
      quickTip:
        'Trik faktorisasi: V = 154 × (10 + 6/3) = 154 × (10 + 2) = 154 × 12 = 1.848 m³!',
      conceptSummary:
        'Volume bangun ruang gabungan adalah jumlah dari volume masing-masing bangun ruang penyusunnya.',
    },
    hintText: 'Jumlahkan volume tabung (π r² t) dan volume kerucut (1/3 π r² t).',
  },
];
