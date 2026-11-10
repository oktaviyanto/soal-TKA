import { DailyChallengeQuestion } from '../types/dailyChallenge';

export const DAILY_CHALLENGES: DailyChallengeQuestion[] = [
  // ================= 1. TOPIK PHYTAGORAS =================
  {
    id: 'daily-phy-01',
    dayIndex: 0,
    topic: 'Phytagoras',
    subtopic: 'Aplikasi Tangga Bersandar pada Tembok',
    difficulty: 'Dasar',
    title: 'Tinggi Tembok yang Dicapai Ujung Tangga',
    prompt:
      'Sebuah tangga dengan panjang 10 meter disandarkan pada dinding tembok tegak. Jika jarak antara pangkal bawah tangga dengan dinding adalah 6 meter, berapakah tinggi dinding yang dicapai oleh ujung atas tangga tersebut?',
    options: [
      { id: 'A', text: '7 meter' },
      { id: 'B', text: '8 meter' },
      { id: 'C', text: '9 meter' },
      { id: 'D', text: '11,6 meter' },
    ],
    correctAnswer: 'B',
    keyFormula: 'c² = a² + b²  ⟺  t = √(c² - b²)',
    hint: 'Gunakan dalil Pythagoras pada segitiga siku-siku: tinggi² = (panjang tangga)² - (jarak kaki)²',
    explanation: {
      steps: [
        {
          stepNumber: 1,
          title: 'Memodelkan Masalah ke Segitiga Siku-siku',
          content:
            'Panjang tangga merupakan sisi miring (hipotenusa c = 10 m). Jarak pangkal bawah tangga ke dinding adalah sisi alas (b = 6 m), dan tinggi dinding adalah sisi tegak (t).',
        },
        {
          stepNumber: 2,
          title: 'Menerapkan Dalil Pythagoras',
          content:
            't² = c² - b²  ⟹  t = √(10² - 6²) = √(100 - 36) = √64 = 8 meter.',
        },
      ],
      summary:
        'Kombinasi 6, 8, 10 adalah kelipatan dari tripel Pythagoras dasar 3, 4, 5. Jadi tinggi tembok yang dicapai adalah 8 meter.',
    },
    accentColor: '#4f46e5',
  },

  {
    id: 'daily-phy-02',
    dayIndex: 1,
    topic: 'Phytagoras',
    subtopic: 'Navigasi Kapal & Jarak Terdekat',
    difficulty: 'Sedang',
    title: 'Jarak Terdekat Kapal dari Pelabuhan Asal',
    prompt:
      'Sebuah kapal berlayar dari pelabuhan P ke arah utara sejauh 24 mil laut. Selanjutnya kapal tersebut berbelok tepat ke arah barat sejauh 7 mil laut menuju pelabuhan Q. Jarak terpendek (lurus) dari pelabuhan P ke pelabuhan Q adalah...',
    options: [
      { id: 'A', text: '23 mil laut' },
      { id: 'B', text: '25 mil laut' },
      { id: 'C', text: '27 mil laut' },
      { id: 'D', text: '31 mil laut' },
    ],
    correctAnswer: 'B',
    keyFormula: 'Jarak Terpendek = √(Utara² + Barat²)',
    hint: 'Arah utara dan barat saling tegak lurus membentuk sudut 90°. Gunakan tripel Pythagoras (7, 24, 25).',
    explanation: {
      steps: [
        {
          stepNumber: 1,
          title: 'Identifikasi Hubungan Tegak Lurus Arah Mata Angin',
          content:
            'Arah utara dan arah barat membentuk sudut siku-siku (90°). Jarak tempuh utara a = 24 mil dan barat b = 7 mil.',
        },
        {
          stepNumber: 2,
          title: 'Perhitungan Jarak Terpendek',
          content:
            'Jarak PQ = √(24² + 7²) = √(576 + 49) = √625 = 25 mil laut.',
        },
      ],
      summary:
        'Bilangan 7, 24, dan 25 merupakan salah satu tripel Pythagoras primitif. Jarak lurus kapal dari pelabuhan asal adalah 25 mil laut.',
    },
    accentColor: '#0284c7',
  },

  {
    id: 'daily-phy-03',
    dayIndex: 2,
    topic: 'Phytagoras',
    subtopic: 'Diagonal Ruang Balok',
    difficulty: 'Sedang',
    title: 'Panjang Kawat Diagonal Ruang Kotak Balok',
    prompt:
      'Sebuah kotak perkakas berbentuk balok memiliki ukuran panjang 12 cm, lebar 9 cm, dan tinggi 8 cm. Berapakah panjang diagonal ruang balok tersebut?',
    options: [
      { id: 'A', text: '15 cm' },
      { id: 'B', text: '17 cm' },
      { id: 'C', text: '19 cm' },
      { id: 'D', text: '21 cm' },
    ],
    correctAnswer: 'B',
    keyFormula: 'd_ruang = √(p² + l² + t²)',
    hint: 'Hitung diagonal bidang alas terlebih dahulu d_alas = √(12² + 9²), lalu cari diagonal ruangnya.',
    explanation: {
      steps: [
        {
          stepNumber: 1,
          title: 'Menghitung Diagonal Bidang Alas',
          content:
            'd_alas = √(12² + 9²) = √(144 + 81) = √225 = 15 cm.',
        },
        {
          stepNumber: 2,
          title: 'Menghitung Diagonal Ruang Balok',
          content:
            'd_ruang = √(d_alas² + t²) = √(15² + 8²) = √(225 + 64) = √289 = 17 cm.',
        },
      ],
      summary:
        'Secara langsung d = √(12² + 9² + 8²) = √(144 + 81 + 64) = √289 = 17 cm.',
    },
    accentColor: '#0d9488',
  },

  {
    id: 'daily-phy-04',
    dayIndex: 3,
    topic: 'Phytagoras',
    subtopic: 'Klasifikasi Jenis Segitiga Berdasarkan Sisi',
    difficulty: 'HOTS / Menantang',
    title: 'Menentukan Kelompok Sisi yang Membentuk Segitiga Tumpul',
    prompt:
      'Diberikan empat kelompok panjang sisi segitiga berikut. Manakah kelompok sisi yang membentuk segitiga tumpul?',
    options: [
      { id: 'A', text: '6 cm, 8 cm, 10 cm' },
      { id: 'B', text: '7 cm, 24 cm, 25 cm' },
      { id: 'C', text: '8 cm, 15 cm, 17 cm' },
      { id: 'D', text: '5 cm, 12 cm, 14 cm' },
    ],
    correctAnswer: 'D',
    keyFormula: 'Segitiga Tumpul: c² > a² + b² (dengan c sisi terpanjang)',
    hint: 'Bandingkan kuadrat sisi terpanjang (c²) dengan jumlah kuadrat dua sisi lainnya (a² + b²).',
    explanation: {
      steps: [
        {
          stepNumber: 1,
          title: 'Uji Opsi A, B, dan C',
          content:
            'Opsi A: 10² = 100 dan 6² + 8² = 100 (Siku-siku). Opsi B: 25² = 625 dan 7² + 24² = 625 (Siku-siku). Opsi C: 17² = 289 dan 8² + 15² = 289 (Siku-siku).',
        },
        {
          stepNumber: 2,
          title: 'Uji Opsi D',
          content:
            'Sisi terpanjang c = 14 cm (c² = 196). Jumlah kuadrat sisi lain: 5² + 12² = 25 + 144 = 169. Karena 196 > 169 (c² > a² + b²), maka segitiga tersebut adalah segitiga tumpul.',
        },
      ],
      summary:
        'Jika kuadrat sisi terpanjang melebihi jumlah kuadrat dua sisi lainnya, segitiga yang terbentuk pasti tumpul.',
    },
    accentColor: '#e11d48',
  },

  // ================= 2. TOPIK SEGITIGA =================
  {
    id: 'daily-tri-01',
    dayIndex: 4,
    topic: 'Segitiga',
    subtopic: 'Kesebangunan Segitiga & Bayangan Pohon',
    difficulty: 'Dasar',
    title: 'Menghitung Tinggi Pohon Menggunakan Bayangan Sinar Matahari',
    prompt:
      'Pada waktu yang sama, sebatang tongkat pramuka dengan tinggi 1,5 meter tegak lurus tanah menghasilkan bayangan sepanjang 2 meter. Di dekatnya, sebuah pohon cemara menghasilkan bayangan sepanjang 16 meter. Berapakah tinggi pohon cemara tersebut?',
    options: [
      { id: 'A', text: '10 meter' },
      { id: 'B', text: '12 meter' },
      { id: 'C', text: '14 meter' },
      { id: 'D', text: '15 meter' },
    ],
    correctAnswer: 'B',
    keyFormula: 'Tinggi Pohon / Tinggi Tongkat = Bayangan Pohon / Bayangan Tongkat',
    hint: 'Gunakan konsep perbandingan senilai pada dua segitiga siku-siku sebangun yang dibentuk oleh sinar matahari.',
    explanation: {
      steps: [
        {
          stepNumber: 1,
          title: 'Prinsip Kesebangunan Sinar Matahari',
          content:
            'Karena sudut datang sinar matahari sama, segitiga yang dibentuk tongkat dan pohon adalah sebangun.',
        },
        {
          stepNumber: 2,
          title: 'Menyusun Persamaan Rasio',
          content:
            't_pohon / 1,5 = 16 / 2  ⟹  t_pohon / 1,5 = 8  ⟹  t_pohon = 8 × 1,5 = 12 meter.',
        },
      ],
      summary:
        'Dengan perbandingan senilai kesebangunan segitiga, tinggi pohon cemara adalah 12 meter.',
    },
    accentColor: '#16a34a',
  },

  {
    id: 'daily-tri-02',
    dayIndex: 5,
    topic: 'Segitiga',
    subtopic: 'Luas Segitiga Siku-Siku Melalui Phytagoras',
    difficulty: 'Sedang',
    title: 'Menghitung Luas Segitiga Siku-Siku dari Sisi Miring',
    prompt:
      'Pada segitiga siku-siku ABC yang siku-siku di titik B, diketahui panjang sisi AB = 12 cm dan panjang sisi miring AC = 20 cm. Berapakah luas segitiga ABC tersebut?',
    options: [
      { id: 'A', text: '80 cm²' },
      { id: 'B', text: '96 cm²' },
      { id: 'C', text: '120 cm²' },
      { id: 'D', text: '192 cm²' },
    ],
    correctAnswer: 'B',
    keyFormula: 'Luas = 1/2 × alas × tinggi, dengan BC = √(AC² - AB²)',
    hint: 'Cari panjang sisi BC terlebih dahulu menggunakan dalil Pythagoras sebelum menghitung luas.',
    explanation: {
      steps: [
        {
          stepNumber: 1,
          title: 'Menghitung Sisi Tegak BC',
          content:
            'BC = √(AC² - AB²) = √(20² - 12²) = √(400 - 144) = √256 = 16 cm.',
        },
        {
          stepNumber: 2,
          title: 'Menghitung Luas Segitiga Siku-Siku',
          content:
            'Luas = 1/2 × alas × tinggi = 1/2 × 12 × 16 = 6 × 16 = 96 cm².',
        },
      ],
      summary:
        'Panjang sisi siku-siku kedua adalah 16 cm, sehingga luas segitiga ABC adalah 96 cm².',
    },
    accentColor: '#ea580c',
  },

  {
    id: 'daily-tri-03',
    dayIndex: 6,
    topic: 'Segitiga',
    subtopic: 'Perbandingan Sudut-Sudut Segitiga',
    difficulty: 'Dasar',
    title: 'Menentukan Sudut Terbesar dari Perbandingan Sudut Dalam',
    prompt:
      'Perbandingan besar sudut-sudut dalam suatu segitiga adalah 2 : 3 : 5. Berapakah besar sudut terbesar pada segitiga tersebut?',
    options: [
      { id: 'A', text: '75°' },
      { id: 'B', text: '80°' },
      { id: 'C', text: '90°' },
      { id: 'D', text: '100°' },
    ],
    correctAnswer: 'C',
    keyFormula: 'Sudut A + Sudut B + Sudut C = 180°',
    hint: 'Jumlahkan seluruh angka perbandingan (2 + 3 + 5 = 10 bagian), lalu bagi 180° dengan total bagian tersebut.',
    explanation: {
      steps: [
        {
          stepNumber: 1,
          title: 'Menghitung Nilai Satu Bagian Rasio',
          content:
            'Jumlah perbandingan = 2 + 3 + 5 = 10 bagian. Nilai 1 bagian = 180° / 10 = 18°.',
        },
        {
          stepNumber: 2,
          title: 'Menghitung Sudut Terbesar',
          content:
            'Sudut terbesar adalah bagian dengan rasio 5: Sudut = 5 × 18° = 90° (segitiga siku-siku).',
        },
      ],
      summary:
        'Ketiga sudutnya adalah 36°, 54°, dan 90°. Sudut terbesarnya adalah 90°.',
    },
    accentColor: '#8b5cf6',
  },

  {
    id: 'daily-tri-04',
    dayIndex: 7,
    topic: 'Segitiga',
    subtopic: 'Luas Segitiga Sama Kaki',
    difficulty: 'Sedang',
    title: 'Luas Segitiga Sama Kaki dengan Kaki 13 cm dan Alas 10 cm',
    prompt:
      'Sebuah segitiga sama kaki PQR memiliki panjang kedua kakinya PQ = PR = 13 cm dan panjang sisi alas QR = 10 cm. Berapakah luas segitiga PQR tersebut?',
    options: [
      { id: 'A', text: '50 cm²' },
      { id: 'B', text: '60 cm²' },
      { id: 'C', text: '65 cm²' },
      { id: 'D', text: '120 cm²' },
    ],
    correctAnswer: 'B',
    keyFormula: 'Luas = 1/2 × alas × tinggi, dengan t = √(kaki² - (alas/2)²)',
    hint: 'Garis tinggi pada segitiga sama kaki membagi alas QR menjadi dua bagian yang sama panjang (5 cm).',
    explanation: {
      steps: [
        {
          stepNumber: 1,
          title: 'Menghitung Tinggi Segitiga Sama Kaki',
          content:
            'Garis tinggi tegak lurus alas membagi alas menjadi 5 cm dan 5 cm. t = √(13² - 5²) = √(169 - 25) = √144 = 12 cm.',
        },
        {
          stepNumber: 2,
          title: 'Menghitung Luas Segitiga',
          content:
            'Luas = 1/2 × alas × tinggi = 1/2 × 10 × 12 = 5 × 12 = 60 cm².',
        },
      ],
      summary:
        'Tinggi segitiga adalah 12 cm, sehingga luas segitiga sama kaki PQR adalah 60 cm².',
    },
    accentColor: '#d97706',
  },

  // ================= 3. TOPIK SEGIEMPAT =================
  {
    id: 'daily-quad-01',
    dayIndex: 8,
    topic: 'Segiempat',
    subtopic: 'Keliling Belah Ketupat dari Kedua Diagonal',
    difficulty: 'Sedang',
    title: 'Keliling Belah Ketupat dengan Panjang Diagonal 16 cm dan 12 cm',
    prompt:
      'Sebuah belah ketupat ABCD memiliki panjang diagonal AC = 16 cm dan BD = 12 cm. Berapakah keliling belah ketupat ABCD tersebut?',
    options: [
      { id: 'A', text: '32 cm' },
      { id: 'B', text: '40 cm' },
      { id: 'C', text: '48 cm' },
      { id: 'D', text: '96 cm' },
    ],
    correctAnswer: 'B',
    keyFormula: 's = √((d₁/2)² + (d₂/2)²),  Keliling = 4 × s',
    hint: 'Kedua diagonal belah ketupat berpotongan tegak lurus dan saling membagi dua sama panjang (8 cm dan 6 cm).',
    explanation: {
      steps: [
        {
          stepNumber: 1,
          title: 'Menentukan Setengah Panjang Tiap Diagonal',
          content:
            'Setengah diagonal d₁/2 = 16/2 = 8 cm dan d₂/2 = 12/2 = 6 cm.',
        },
        {
          stepNumber: 2,
          title: 'Menghitung Panjang Sisi Belah Ketupat',
          content:
            'Sisi s = √(8² + 6²) = √(64 + 36) = √100 = 10 cm.',
        },
        {
          stepNumber: 3,
          title: 'Menghitung Keliling Belah Ketupat',
          content:
            'Keliling = 4 × s = 4 × 10 cm = 40 cm.',
        },
      ],
      summary:
        'Panjang setiap sisi belah ketupat adalah 10 cm, maka keliling belah ketupat adalah 40 cm.',
    },
    accentColor: '#7c3aed',
  },

  {
    id: 'daily-quad-02',
    dayIndex: 9,
    topic: 'Segiempat',
    subtopic: 'Luas Trapesium Sama Kaki',
    difficulty: 'HOTS / Menantang',
    title: 'Luas Trapesium Sama Kaki dengan Panjang Sisi Miring 13 cm',
    prompt:
      'Trapesium sama kaki ABCD memiliki panjang sisi-sisi sejajar AB = 24 cm dan CD = 14 cm. Jika panjang sisi miringnya masing-masing 13 cm, berapakah luas trapesium tersebut?',
    options: [
      { id: 'A', text: '190 cm²' },
      { id: 'B', text: '228 cm²' },
      { id: 'C', text: '247 cm²' },
      { id: 'D', text: '456 cm²' },
    ],
    correctAnswer: 'B',
    keyFormula: 'Luas = ((a + b) / 2) × t, dengan t = √(miring² - x²)',
    hint: 'Hitung selisih sisi sejajar (24 - 14 = 10 cm), bagi dua untuk mencari proyeksi alas segitiga samping (5 cm).',
    explanation: {
      steps: [
        {
          stepNumber: 1,
          title: 'Menentukan Proyeksi Alas Siku-siku',
          content:
            'x = (AB - CD) / 2 = (24 - 14) / 2 = 10 / 2 = 5 cm.',
        },
        {
          stepNumber: 2,
          title: 'Menghitung Tinggi Trapesium Melalui Pythagoras',
          content:
            't = √(13² - 5²) = √(169 - 25) = √144 = 12 cm.',
        },
        {
          stepNumber: 3,
          title: 'Menghitung Luas Trapesium',
          content:
            'Luas = ((24 + 14) / 2) × 12 = (38 / 2) × 12 = 19 × 12 = 228 cm².',
        },
      ],
      summary:
        'Tinggi trapesium adalah 12 cm, sehingga luas trapesium sama kaki tersebut adalah 228 cm².',
    },
    accentColor: '#2563eb',
  },

  {
    id: 'daily-quad-03',
    dayIndex: 10,
    topic: 'Segiempat',
    subtopic: 'Luas Layang-layang',
    difficulty: 'Dasar',
    title: 'Luas Kerangka Layang-Layang Kertas Hias',
    prompt:
      'Budi membuat sebuah layang-layang festival dari bambu dengan panjang diagonal masing-masing 30 cm dan 18 cm. Berapakah luas kertas minimal yang dibutuhkan untuk menutupi seluruh permukaan layang-layang tersebut?',
    options: [
      { id: 'A', text: '240 cm²' },
      { id: 'B', text: '270 cm²' },
      { id: 'C', text: '480 cm²' },
      { id: 'D', text: '540 cm²' },
    ],
    correctAnswer: 'B',
    keyFormula: 'Luas Layang-layang = 1/2 × d₁ × d₂',
    hint: 'Gunakan rumus luas layang-layang: setengah dari perkalian kedua diagonalnya.',
    explanation: {
      steps: [
        {
          stepNumber: 1,
          title: 'Memasukkan Nilai Diagonal ke Formula',
          content:
            'Luas = 1/2 × d₁ × d₂ = 1/2 × 30 × 18.',
        },
        {
          stepNumber: 2,
          title: 'Menyederhanakan Perhitungan',
          content:
            'Luas = 15 × 18 = 270 cm².',
        },
      ],
      summary:
        'Luas permukaan kertas yang dibutuhkan adalah 270 cm².',
    },
    accentColor: '#059669',
  },

  {
    id: 'daily-quad-04',
    dayIndex: 11,
    topic: 'Segiempat',
    subtopic: 'Keliling Jajar Genjang',
    difficulty: 'Dasar',
    title: 'Keliling Tanah Taman Berbentuk Jajar Genjang',
    prompt:
      'Sebuah taman kota berbentuk jajar genjang memiliki panjang sisi alas 15 meter dan panjang sisi miringnya 10 meter. Jika tinggi jajar genjang tersebut adalah 8 meter, berapakah keliling taman kota tersebut?',
    options: [
      { id: 'A', text: '40 meter' },
      { id: 'B', text: '50 meter' },
      { id: 'C', text: '60 meter' },
      { id: 'D', text: '120 meter' },
    ],
    correctAnswer: 'B',
    keyFormula: 'Keliling = 2 × (sisi alas + sisi miring)',
    hint: 'Hati-hati! Tinggi hanya digunakan untuk menghitung luas. Keliling dihitung dari jumlah keempat sisi luarnya.',
    explanation: {
      steps: [
        {
          stepNumber: 1,
          title: 'Membedakan Keliling dan Luas',
          content:
            'Tinggi (8 m) tidak dipakai dalam keliling. Keliling jajar genjang adalah jumlah seluruh batas sisi luarnya.',
        },
        {
          stepNumber: 2,
          title: 'Menghitung Keliling Jajar Genjang',
          content:
            'Keliling = 2 × (15 + 10) = 2 × 25 = 50 meter.',
        },
      ],
      summary:
        'Keliling taman berbentuk jajar genjang tersebut adalah 50 meter.',
    },
    accentColor: '#c026d3',
  },

  // ================= 4. TOPIK TRANSFORMASI GEOMETRI =================
  {
    id: 'daily-trans-01',
    dayIndex: 12,
    topic: 'Transformasi Geometri',
    subtopic: 'Translasi Titik Koordinat Bidang Kartesius',
    difficulty: 'Dasar',
    title: 'Koordinat Bayangan Titik Akibat Pergeseran (Translasi)',
    prompt:
      'Titik A(3, -5) ditranslasikan oleh komponen translasi T = (-4, 7). Koordinat bayangan titik A setelah pergeseran tersebut adalah...',
    options: [
      { id: 'A', text: '(-1, 2)' },
      { id: 'B', text: '(7, -12)' },
      { id: 'C', text: '(-7, 2)' },
      { id: 'D', text: '(1, -2)' },
    ],
    correctAnswer: 'A',
    keyFormula: 'P(x, y)  —[T(a, b)]—>  P\'(x + a, y + b)',
    hint: 'Jumlahkan absis x dengan a, dan ordinat y dengan b.',
    explanation: {
      steps: [
        {
          stepNumber: 1,
          title: 'Menerapkan Vektor Translasi ke Koordinat Titik',
          content:
            'x\' = x + a = 3 + (-4) = -1.',
        },
        {
          stepNumber: 2,
          title: 'Menghitung Ordinat Bayangan y\'',
          content:
            'y\' = y + b = -5 + 7 = 2.',
        },
      ],
      summary:
        'Jadi koordinat bayangan titik A setelah ditranslasikan adalah A\'(-1, 2).',
    },
    accentColor: '#6366f1',
  },

  {
    id: 'daily-trans-02',
    dayIndex: 13,
    topic: 'Transformasi Geometri',
    subtopic: 'Refleksi terhadap Garis y = x',
    difficulty: 'Sedang',
    title: 'Pencerminan (Refleksi) Titik terhadap Garis y = x',
    prompt:
      'Titik B(-4, 6) dicerminkan terhadap garis y = x. Koordinat bayangan titik B setelah proses pencerminan tersebut adalah...',
    options: [
      { id: 'A', text: '(4, -6)' },
      { id: 'B', text: '(-6, 4)' },
      { id: 'C', text: '(6, -4)' },
      { id: 'D', text: '(-4, -6)' },
    ],
    correctAnswer: 'C',
    keyFormula: 'P(x, y)  —[Refleksi y = x]—>  P\'(y, x)',
    hint: 'Pada pencerminan terhadap garis y = x, nilai absis dan ordinat saling bertukar posisi: (x, y) menjadi (y, x).',
    explanation: {
      steps: [
        {
          stepNumber: 1,
          title: 'Mengingat Matriks Transformasi Garis y = x',
          content:
            'Refleksi terhadap garis y = x memetakan setiap titik (x, y) ke bayangan (y, x).',
        },
        {
          stepNumber: 2,
          title: 'Menentukan Bayangan Titik B',
          content:
            'x = -4 dan y = 6. Setelah ditukar posisinya: x\' = 6 dan y\' = -4.',
        },
      ],
      summary:
        'Koordinat bayangan titik B setelah dicerminkan terhadap garis y = x adalah (6, -4).',
    },
    accentColor: '#0891b2',
  },

  {
    id: 'daily-trans-03',
    dayIndex: 14,
    topic: 'Transformasi Geometri',
    subtopic: 'Rotasi 90° Berlawanan Jarum Jam Pusat (0,0)',
    difficulty: 'Sedang',
    title: 'Perputaran (Rotasi) 90° Berlawanan Arah Putaran Jarum Jam',
    prompt:
      'Titik C(5, -2) dirotasikan sebesar 90° berlawanan arah putaran jarum jam dengan pusat rotasi O(0, 0). Koordinat bayangan titik C adalah...',
    options: [
      { id: 'A', text: '(2, 5)' },
      { id: 'B', text: '(-2, -5)' },
      { id: 'C', text: '(-5, 2)' },
      { id: 'D', text: '(5, 2)' },
    ],
    correctAnswer: 'A',
    keyFormula: 'P(x, y)  —[R(O, +90°)]—>  P\'(-y, x)',
    hint: 'Rotasi 90° berlawanan arah jarum jam memiliki aturan koordinat: absis baru = -y, ordinat baru = x.',
    explanation: {
      steps: [
        {
          stepNumber: 1,
          title: 'Aturan Rotasi 90° Positif Pusat (0,0)',
          content:
            'Sudut putar berlawanan jarum jam bernilai positif (+90°). Aturan transformasinya adalah (x, y) ⟶ (-y, x).',
        },
        {
          stepNumber: 2,
          title: 'Memasukkan Koordinat Titik C(5, -2)',
          content:
            'x\' = -y = -(-2) = 2, dan y\' = x = 5.',
        },
      ],
      summary:
        'Koordinat bayangan titik C adalah C\'(2, 5).',
    },
    accentColor: '#9333ea',
  },

  {
    id: 'daily-trans-04',
    dayIndex: 15,
    topic: 'Transformasi Geometri',
    subtopic: 'Dilatasi (Perbesaran Skala)',
    difficulty: 'HOTS / Menantang',
    title: 'Luas Bayangan Segitiga Setelah Dilatasi dengan Skala k = 3',
    prompt:
      'Sebuah segitiga ABC memiliki luas 14 cm². Segitiga tersebut didilatasikan dengan faktor skala k = 3 dan pusat dilatasi O(0, 0). Berapakah luas bayangan segitiga A\'B\'C\' yang dihasilkan?',
    options: [
      { id: 'A', text: '42 cm²' },
      { id: 'B', text: '84 cm²' },
      { id: 'C', text: '126 cm²' },
      { id: 'D', text: '252 cm²' },
    ],
    correctAnswer: 'C',
    keyFormula: 'Luas Bayangan = k² × Luas Awal',
    hint: 'Perhatikan bahwa luas bangun datar sebanding dengan kuadrat faktor skala dilatasi (k²), bukan hanya k!',
    explanation: {
      steps: [
        {
          stepNumber: 1,
          title: 'Pengaruh Dilatasi terhadap Luas Bangun Datar',
          content:
            'Jika panjang sisi diperbesar k kali, maka luas bangun datar akan diperbesar k² kali lipat.',
        },
        {
          stepNumber: 2,
          title: 'Menghitung Luas Bayangan',
          content:
            'Luas A\'B\'C\' = k² × Luas ABC = 3² × 14 = 9 × 14 = 126 cm².',
        },
      ],
      summary:
        'Luas bayangan setelah didilatasi dengan faktor skala 3 adalah 126 cm².',
    },
    accentColor: '#db2777',
  },

  // ================= 5. TOPIK LINGKARAN & BANGUN RUANG =================
  {
    id: 'daily-cir-01',
    dayIndex: 16,
    topic: 'Lingkaran',
    subtopic: 'Sudut Pusat dan Sudut Keliling',
    difficulty: 'Dasar',
    title: 'Hubungan Besar Sudut Pusat dan Sudut Keliling Lingkaran',
    prompt:
      'Pada sebuah lingkaran berpusat di O, sudut pusat ∠AOB menghadap busur AB dengan besar sudut 110°. Jika titik C berada pada lingkaran dan sudut keliling ∠ACB juga menghadap busur AB yang sama, berapakah besar sudut ∠ACB?',
    options: [
      { id: 'A', text: '55°' },
      { id: 'B', text: '70°' },
      { id: 'C', text: '110°' },
      { id: 'D', text: '220°' },
    ],
    correctAnswer: 'A',
    keyFormula: 'Sudut Keliling = 1/2 × Sudut Pusat (menghadap busur sama)',
    hint: 'Besar sudut keliling adalah setengah dari besar sudut pusat yang menghadap busur yang sama.',
    explanation: {
      steps: [
        {
          stepNumber: 1,
          title: 'Teorema Sudut Pusat dan Sudut Keliling',
          content:
            'Jika sudut pusat dan sudut keliling menghadap busur yang sama, maka Sudut Keliling = 1/2 × Sudut Pusat.',
        },
        {
          stepNumber: 2,
          title: 'Menghitung Sudut ∠ACB',
          content:
            '∠ACB = 1/2 × 110° = 55°.',
        },
      ],
      summary:
        'Besar sudut keliling ∠ACB adalah 55°.',
    },
    accentColor: '#2563eb',
  },

  {
    id: 'daily-geo3d-01',
    dayIndex: 17,
    topic: 'Bangun Ruang',
    subtopic: 'Volume Kerucut Melalui Phytagoras',
    difficulty: 'Sedang',
    title: 'Volume Kerucut dari Jari-jari dan Garis Pelukis',
    prompt:
      'Sebuah kerucut memiliki panjang jari-jari alas r = 7 cm dan panjang garis pelukis s = 25 cm. Dengan nilai π = 22/7, berapakah volume kerucut tersebut?',
    options: [
      { id: 'A', text: '616 cm³' },
      { id: 'B', text: '1.232 cm³' },
      { id: 'C', text: '2.464 cm³' },
      { id: 'D', text: '3.696 cm³' },
    ],
    correctAnswer: 'B',
    keyFormula: 'Volume = 1/3 × π × r² × t, dengan t = √(s² - r²)',
    hint: 'Hitung tinggi kerucut (t) terlebih dahulu menggunakan segitiga siku-siku antara r, t, dan s: t = √(25² - 7²).',
    explanation: {
      steps: [
        {
          stepNumber: 1,
          title: 'Menghitung Tinggi Kerucut',
          content:
            't = √(s² - r²) = √(25² - 7²) = √(625 - 49) = √576 = 24 cm.',
        },
        {
          stepNumber: 2,
          title: 'Menghitung Volume Kerucut',
          content:
            'V = 1/3 × π × r² × t = 1/3 × (22/7) × 7 × 7 × 24 = 1/3 × 22 × 7 × 24 = 22 × 7 × 8 = 154 × 8 = 1.232 cm³.',
        },
      ],
      summary:
        'Tinggi kerucut adalah 24 cm, sehingga volume kerucut adalah 1.232 cm³.',
    },
    accentColor: '#f59e0b',
  },
];

/**
 * Returns today's daily challenge deterministically based on date (YYYY-MM-DD).
 */
export function getDailyChallengeForDate(dateObj: Date = new Date()): DailyChallengeQuestion {
  // Compute day of the year or hash of YYYY-MM-DD
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth();
  const day = dateObj.getDate();

  // Create a stable daily seed
  const startOfYear = new Date(year, 0, 1);
  const diffMs = dateObj.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const index = Math.abs(dayOfYear) % DAILY_CHALLENGES.length;
  return DAILY_CHALLENGES[index];
}

/**
 * Formats date to Indonesian readable format (e.g., '10 November 2026')
 */
export function formatIndonesianDate(dateObj: Date = new Date()): string {
  const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];
  return `${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
}

/**
 * Returns date in YYYY-MM-DD format
 */
export function getTodayKey(dateObj: Date = new Date()): string {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
