import React, { useState, useEffect } from 'react';
import {
  Lightbulb,
  Shuffle,
  Sparkles,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Calendar,
  BookmarkCheck,
  Check,
  Copy,
  BookOpen,
} from 'lucide-react';

export interface StudyTip {
  id: string;
  topic: '2D Lingkaran' | '3D Bangun Ruang' | 'Strategi TKA';
  title: string;
  tip: string;
  formula?: string;
  quote: string;
  highlightTag: string;
}

export const GEOMETRY_TIPS: StudyTip[] = [
  {
    id: 'tip-1',
    topic: '2D Lingkaran',
    title: 'Proporsi Cepat Luas Juring',
    tip: 'Luas juring sebanding lurus dengan sudut pusatnya terhadap 360°. Sudut istimewa: 60° = 1/6 lingkaran, 90° = 1/4 lingkaran, 120° = 1/3 lingkaran. Sederhanakan pecahan sudut terlebih dahulu sebelum mengalikan jari-jari!',
    formula: 'Luas Juring = (θ / 360°) × πr²',
    quote: 'Ketelitian pada pecahan menyederhanakan perhitungan geometri yang tampak rumit.',
    highlightTag: 'Sudut Istimewa',
  },
  {
    id: 'tip-2',
    topic: '2D Lingkaran',
    title: 'Relasi Sudut Pusat & Sudut Keliling',
    tip: 'Jika menghadap busur yang sama, besar sudut pusat selalu DUA KALI sudut keliling (θ_pusat = 2 × θ_keliling). Sebaliknya, sudut keliling adalah setengah dari sudut pusat.',
    formula: '∠Pusat = 2 × ∠Keliling (busur sama)',
    quote: 'Perhatikan titik puncak sudut: apakah tepat di titik pusat atau menempel di keliling lingkaran?',
    highlightTag: 'Konsep Kunci TKA',
  },
  {
    id: 'tip-3',
    topic: '2D Lingkaran',
    title: 'Sudut Keliling Menghadap Diameter',
    tip: 'Setiap sudut keliling yang menghadap diameter lingkaran pasti bernilai siku-siku (90°). Ini sering menjadi kunci pembantu teorema Pythagoras pada soal lingkaran gabungan!',
    formula: '∠Keliling (menghadap diameter) = 90°',
    quote: 'Temukan diameter untuk mengungkap segitiga siku-siku tersembunyi.',
    highlightTag: 'Trik Pythagoras',
  },
  {
    id: 'tip-4',
    topic: '2D Lingkaran',
    title: 'Garis Singgung Persekutuan Luar (GSPL)',
    tip: 'Jarak pusat dua lingkaran (p), jari-jari besar (R), dan jari-jari kecil (r). Panjang GSPL dicari dengan mengurangkan jari-jari (R - r).',
    formula: 'd_luar = √(p² - (R - r)²)',
    quote: 'Ingat tanda minus: GSPL jari-jarinya dikurangkan, sedangkan GSPD jari-jarinya dijumlahkan.',
    highlightTag: 'Rumus GSPL',
  },
  {
    id: 'tip-5',
    topic: '2D Lingkaran',
    title: 'Garis Singgung Persekutuan Dalam (GSPD)',
    tip: 'Pada garis singgung persekutuan dalam, kedua jari-jari dijumlahkan (R + r) sebelum dikuadratkan dan dikurangkan dari kuadrat jarak kedua titik pusat (p).',
    formula: 'd_dalam = √(p² - (R + r)²)',
    quote: 'Garis bersilangan di dalam, sehingga kedua radius saling menambah beban jarak.',
    highlightTag: 'Rumus GSPD',
  },
  {
    id: 'tip-6',
    topic: '3D Bangun Ruang',
    title: 'Hubungan Volume Tabung & Kerucut',
    tip: 'Jika tabung dan kerucut memiliki jari-jari alas (r) dan tinggi (t) yang sama, volume kerucut selalu tepat sepertiga (1/3) dari volume tabung.',
    formula: 'V_kerucut = (1/3) × V_tabung = (1/3)πr²t',
    quote: 'Tiga kali isi kerucut tepat memenuhi satu tabung berdimensi setara.',
    highlightTag: 'Rasio Volume',
  },
  {
    id: 'tip-7',
    topic: '3D Bangun Ruang',
    title: 'Tripel Pythagoras Garis Pelukis Kerucut',
    tip: 'Garis pelukis (s), jari-jari (r), dan tinggi kerucut (t) membentuk segitiga siku-siku: s² = r² + t². Hafalkan tripel Pythagoras dasar: (3, 4, 5), (5, 12, 13), (7, 24, 25), dan (8, 15, 17).',
    formula: 's = √(r² + t²)',
    quote: 'Hafal tripel Pythagoras menghemat 1–2 menit berharga di setiap soal kerucut.',
    highlightTag: 'Tripel Pythagoras',
  },
  {
    id: 'tip-8',
    topic: '3D Bangun Ruang',
    title: 'Awas Kata Kunci "Setengah Bola Padat / Pejal"',
    tip: 'Untuk belahan bola padat (setengah bola pejal), luas permukaan total mencakup selimut (2πr²) ditambah bidang alas lingkarannya (πr²), sehingga totalnya menjadi 3πr².',
    formula: 'L_setengah_bola_pejal = 3πr²',
    quote: 'Benda berongga hanya punya selimut (2πr²), benda padat punya bidang alas penutup (+πr²).',
    highlightTag: 'Jebakan Soal Ujian',
  },
  {
    id: 'tip-9',
    topic: '3D Bangun Ruang',
    title: 'Luas Permukaan Bangun Gabungan',
    tip: 'Pada bangun ruang gabungan (misal tabung beratap kerucut), luas bidang yang berimpit/menempel di dalam TIDAK DIHITUNG dalam luas permukaan luar!',
    formula: 'L_total = L_selimut_kerucut + L_selimut_tabung + L_alas_tabung',
    quote: 'Luas permukaan adalah area terluar yang bisa dicat atau disentuh dari luar.',
    highlightTag: 'Konsep Gabungan',
  },
  {
    id: 'tip-10',
    topic: '2D Lingkaran',
    title: 'Trik Pemilihan Nilai π (Pi)',
    tip: 'Gunakan π = 22/7 apabila jari-jari atau diameter merupakan kelipatan 7 (7, 14, 21, 28, 35, ...). Jika bukan kelipatan 7, gunakan π = 3,14 agar perhitungan desimal tidak menghasilkan pecahan berulang.',
    formula: 'π ≈ 22/7 (kelipatan 7) atau 3,14',
    quote: 'Pilih nilai π yang membuat proses perkalian dan pembagian paling efisien.',
    highlightTag: 'Ketelitian Hitung',
  },
  {
    id: 'tip-11',
    topic: '2D Lingkaran',
    title: 'Menghitung Luas Tembereng Lingkaran',
    tip: 'Tembereng adalah daerah yang dibatasi oleh busur dan tali busur. Luas tembereng dihitung dengan mencari Luas Juring dikurangi Luas Segitiga yang dibentuk jari-jari dan tali busur.',
    formula: 'L_tembereng = L_juring - L_segitiga',
    quote: 'Bila sudut pusat 90°, luas segitiga pengurang sangat mudah dihitung: 1/2 × r × r.',
    highlightTag: 'Trik Tembereng',
  },
  {
    id: 'tip-12',
    topic: '3D Bangun Ruang',
    title: 'Volume Bola dalam Tabung Sempurna',
    tip: 'Jika bola dimasukkan ke dalam tabung yang tepat menyinggung sisi alas, tutup, dan selimutnya (tinggi tabung = diameter bola = 2r), maka volume bola = 2/3 volume tabung.',
    formula: 'V_bola = (2/3) × V_tabung = (4/3)πr³',
    quote: 'Penemuan legendaris Archimedes yang selalu diuji pada soal TKA penalaran tinggi.',
    highlightTag: 'Archimedes Theorem',
  },
  {
    id: 'tip-13',
    topic: 'Strategi TKA',
    title: 'Pemeriksaan Satuan Ukuran (cm, cm², cm³)',
    tip: 'Sebelum memilih jawaban akhir, selalu cek satuan pada opsi pilihan ganda: panjang busur & keliling bersatuan cm, luas bersatuan cm², dan volume bersatuan cm³ atau liter (1 liter = 1 dm³ = 1.000 cm³).',
    formula: '1 Liter = 1 dm³ = 1.000 cm³',
    quote: 'Eliminasi opsi salah yang salah satuan untuk menghemat waktu analisis.',
    highlightTag: 'Manajemen Waktu',
  },
];

// Helper to calculate a stable daily tip index based on calendar date
const getDailySeedIndex = (): number => {
  const now = new Date();
  const dayOfYear = Math.floor(
    (Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) -
      Date.UTC(now.getFullYear(), 0, 0)) /
      (24 * 60 * 60 * 1000)
  );
  return Math.abs(dayOfYear) % GEOMETRY_TIPS.length;
};

interface GeometryStudyTipsProps {
  sessionKey?: string | number;
  initialCollapsed?: boolean;
}

export const GeometryStudyTips: React.FC<GeometryStudyTipsProps> = ({
  sessionKey,
  initialCollapsed = false,
}) => {
  // Select initial tip based on daily seed or sessionKey
  const [currentTipIndex, setCurrentTipIndex] = useState<number>(() => {
    if (sessionKey !== undefined) {
      // Deterministic hash based on session key
      const num = typeof sessionKey === 'number' ? sessionKey : sessionKey.length;
      return (getDailySeedIndex() + num) % GEOMETRY_TIPS.length;
    }
    return getDailySeedIndex();
  });

  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(initialCollapsed);
  const [copiedFormula, setCopiedFormula] = useState<boolean>(false);

  // When a new session is started (sessionKey changes), select a new tip for that session
  useEffect(() => {
    if (sessionKey !== undefined) {
      const num = typeof sessionKey === 'number' ? sessionKey : String(sessionKey).length;
      const nextIdx = (getDailySeedIndex() + num) % GEOMETRY_TIPS.length;
      setCurrentTipIndex(nextIdx);
    }
  }, [sessionKey]);

  const handleShuffleTip = () => {
    setIsRotating(true);
    let nextIndex = Math.floor(Math.random() * GEOMETRY_TIPS.length);
    if (nextIndex === currentTipIndex) {
      nextIndex = (currentTipIndex + 1) % GEOMETRY_TIPS.length;
    }
    setCurrentTipIndex(nextIndex);
    setTimeout(() => setIsRotating(false), 300);
  };

  const currentTip = GEOMETRY_TIPS[currentTipIndex] || GEOMETRY_TIPS[0];

  const todayFormatted = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleCopyFormula = (formulaText: string) => {
    try {
      navigator.clipboard.writeText(formulaText);
      setCopiedFormula(true);
      setTimeout(() => setCopiedFormula(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <aside 
      aria-label="Tips Belajar Harian Geometri"
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50/95 via-sky-50/70 to-indigo-50/95 dark:from-indigo-950/40 dark:via-slate-900/90 dark:to-indigo-950/40 border border-indigo-200/90 dark:border-indigo-900/70 p-4 transition-all shadow-xs"
    >
      {/* Decorative ambient accent */}
      <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-indigo-500/10 blur-xl pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 flex items-center justify-between gap-3 pb-2.5 border-b border-indigo-200/60 dark:border-indigo-900/40">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <Lightbulb className="w-4 h-4 text-amber-300" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs sm:text-sm text-indigo-950 dark:text-indigo-200 font-display">
                Tips Belajar Harian
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800">
                {currentTip.topic}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
              <Calendar className="w-3 h-3 text-indigo-500" />
              <span>{todayFormatted}</span>
            </div>
          </div>
        </div>

        {/* Action Controls: Acak Tips & Minimalkan/Lebarkan */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleShuffleTip}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/90 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 border border-indigo-200/80 dark:border-indigo-800 text-[11px] font-bold text-indigo-700 dark:text-indigo-300 transition-all cursor-pointer shadow-2xs active:scale-95"
            title="Ganti tips belajar geometri lainnya secara acak"
          >
            <Shuffle className={`w-3 h-3 ${isRotating ? 'animate-spin' : ''}`} />
            <span className="hidden xs:inline">Tips Lain</span>
            <span>🎲</span>
          </button>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label={isCollapsed ? 'Tampilkan detail tips' : 'Sembunyikan detail tips'}
            title={isCollapsed ? 'Tampilkan detail tips' : 'Sembunyikan detail tips'}
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Tip Content (Collapsible) */}
      {!isCollapsed ? (
        <div className="relative z-10 pt-3 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 font-display flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{currentTip.title}</span>
            </h4>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60">
              #{currentTip.highlightTag}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
            {currentTip.tip}
          </p>

          {currentTip.formula && (
            <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200/80 dark:border-indigo-800/80 font-math text-xs font-bold text-indigo-700 dark:text-indigo-300 shadow-2xs">
                <ChevronRight className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>{currentTip.formula}</span>
              </div>

              <button
                onClick={() => handleCopyFormula(currentTip.formula!)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
                title="Salin rumus ke papan klip"
              >
                {copiedFormula ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-600 font-bold">Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Salin Rumus</span>
                  </>
                )}
              </button>
            </div>
          )}

          <div className="pt-1 border-t border-indigo-100/70 dark:border-indigo-900/40 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 italic">
            <BookmarkCheck className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span>&ldquo;{currentTip.quote}&rdquo;</span>
          </div>
        </div>
      ) : (
        /* Minimized preview mode */
        <div className="relative z-10 pt-2 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          <span className="truncate max-w-[85%] font-medium">
            💡 <strong>{currentTip.title}</strong>: {currentTip.tip}
          </span>
          <button
            onClick={() => setIsCollapsed(false)}
            className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0 cursor-pointer ml-2"
          >
            Buka Detail
          </button>
        </div>
      )}
    </aside>
  );
};
