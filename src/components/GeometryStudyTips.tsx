import React, { useState, useEffect } from 'react';
import { Lightbulb, Shuffle, Sparkles, ChevronRight } from 'lucide-react';

export interface StudyTip {
  id: string;
  topic: '2D Lingkaran' | '3D Bangun Ruang' | 'Strategi TKA';
  title: string;
  tip: string;
  formula?: string;
  quote: string;
}

const GEOMETRY_TIPS: StudyTip[] = [
  {
    id: 'tip-1',
    topic: '2D Lingkaran',
    title: 'Proporsi Cepat Luas Juring',
    tip: 'Luas juring sebanding lurus dengan sudut pusatnya terhadap 360°. Sudut istimewa: 60° = 1/6 lingkaran, 90° = 1/4 lingkaran, 120° = 1/3 lingkaran. Coret penyebut terlebih dahulu sebelum mengalikan!',
    formula: 'Luas Juring = (θ / 360°) × πr²',
    quote: 'Ketelitian pada pecahan menyederhanakan perhitungan rumit.',
  },
  {
    id: 'tip-2',
    topic: '2D Lingkaran',
    title: 'Relasi Sudut Pusat & Sudut Keliling',
    tip: 'Jika menghadap busur yang sama, besar sudut pusat selalu DUA KALI sudut keliling (θ_pusat = 2 × θ_keliling). Sebaliknya, sudut keliling adalah setengah dari sudut pusat.',
    formula: '∠Pusat = 2 × ∠Keliling',
    quote: 'Perhatikan titik sudut: di pusat lingkaran atau di tepi lingkaran?',
  },
  {
    id: 'tip-3',
    topic: '2D Lingkaran',
    title: 'Sudut Menghadap Diameter',
    tip: 'Setiap sudut keliling yang menghadap diameter lingkaran pasti bernilai siku-siku (90°). Ini sering menjadi kunci pembantu teorema Pythagoras pada soal lingkaran gabungan!',
    formula: '∠Keliling (menghadap diameter) = 90°',
    quote: 'Cari diameter untuk menemukan segitiga siku-siku tersembunyi.',
  },
  {
    id: 'tip-4',
    topic: '3D Bangun Ruang',
    title: 'Hubungan Volume Tabung & Kerucut',
    tip: 'Jika tabung dan kerucut memiliki jari-jari alas (r) dan tinggi (t) yang sama, volume kerucut selalu tepat sepertiga (1/3) dari volume tabung.',
    formula: 'V_kerucut = (1/3) × V_tabung = (1/3)πr²t',
    quote: 'Tiga kali isi kerucut tepat memenuhi satu tabung setara.',
  },
  {
    id: 'tip-5',
    topic: '3D Bangun Ruang',
    title: 'Tripel Pythagoras Garis Pelukis Kerucut',
    tip: 'Garis pelukis (s), jari-jari (r), dan tinggi kerucut (t) membentuk segitiga siku-siku: s² = r² + t². Hafalkan tripel Pythagoras dasar: (3, 4, 5), (5, 12, 13), (7, 24, 25), dan (8, 15, 17).',
    formula: 's = √(r² + t²)',
    quote: 'Hafal tripel Pythagoras menghemat 1–2 menit per soal.',
  },
  {
    id: 'tip-6',
    topic: '3D Bangun Ruang',
    title: 'Awas Kata Kunci "Padat / Pejal"',
    tip: 'Untuk belahan bola padat (setengah bola pejal), luas permukaan total mencakup selimut (2πr²) ditambah alas lingkarannya (πr²), sehingga totalnya menjadi 3πr².',
    formula: 'L_setengah_bola_pejal = 3πr²',
    quote: 'Benda berongga hanya punya selimut, benda padat punya bidang alas.',
  },
  {
    id: 'tip-7',
    topic: '2D Lingkaran',
    title: 'Trik Pemilihan Nilai π',
    tip: 'Gunakan π = 22/7 apabila jari-jari atau diameter merupakan kelipatan 7 (7, 14, 21, 28, ...). Jika bukan kelipatan 7, gunakan π = 3,14 agar tidak terjebak pecahan bersisa.',
    formula: 'π ≈ 22/7 (kelipatan 7) atau 3,14',
    quote: 'Pilih nilai π yang membuat angka mudah dibagi.',
  },
  {
    id: 'tip-8',
    topic: '3D Bangun Ruang',
    title: 'Luas Permukaan Gabungan',
    tip: 'Pada bangun ruang gabungan (misal tabung beratap kerucut), luas sisi yang berimpit/menempel TIDAK DIHITUNG dalam luas permukaan luar!',
    formula: 'L_gabungan = L_selimut_kerucut + L_selimut_tabung + L_alas_tabung',
    quote: 'Luas permukaan adalah area yang dapat disentuh dari luar.',
  },
  {
    id: 'tip-9',
    topic: 'Strategi TKA',
    title: 'Fokus Durasi & Strategi Eliminasi',
    tip: 'Dengan 20 soal dalam 40 menit, kamu memiliki rata-rata 2 menit per soal. Jika ragu, eliminasi minimal 2 pilihan yang tidak masuk akal (misal nilai satuan keliling vs luas).',
    quote: 'Tenang, fokus pada satuan ukuran (cm, cm², cm³), dan periksa kembali.',
  },
];

interface GeometryStudyTipsProps {
  onDismiss?: () => void;
  questionNumber?: number;
}

export const GeometryStudyTips: React.FC<GeometryStudyTipsProps> = ({
  questionNumber,
}) => {
  const [currentTipIndex, setCurrentTipIndex] = useState<number>(() =>
    Math.floor(Math.random() * GEOMETRY_TIPS.length)
  );
  const [isRotating, setIsRotating] = useState<boolean>(false);

  // Rotate tip randomly or systematically when question number changes
  useEffect(() => {
    if (questionNumber !== undefined) {
      // Pick a tip that matches the question's dimension or cycle randomly
      setCurrentTipIndex((prev) => (prev + 1) % GEOMETRY_TIPS.length);
    }
  }, [questionNumber]);

  const handleShuffleTip = () => {
    setIsRotating(true);
    let nextIndex = Math.floor(Math.random() * GEOMETRY_TIPS.length);
    if (nextIndex === currentTipIndex) {
      nextIndex = (currentTipIndex + 1) % GEOMETRY_TIPS.length;
    }
    setCurrentTipIndex(nextIndex);
    setTimeout(() => setIsRotating(false), 300);
  };

  const currentTip = GEOMETRY_TIPS[currentTipIndex];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-50/90 via-sky-50/70 to-indigo-50/90 dark:from-indigo-950/40 dark:via-slate-900 dark:to-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 p-4 transition-all shadow-xs">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-indigo-200/60 dark:border-indigo-900/40">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-2xs">
            <Lightbulb className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs text-indigo-950 dark:text-indigo-200 font-display">
                Tips Belajar Geometri
              </span>
              <span aria-hidden="true" className="text-indigo-300 dark:text-indigo-700">·</span>
              <span className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-300">
                {currentTip.topic}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleShuffleTip}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 border border-indigo-200/70 dark:border-indigo-800 text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 transition-all cursor-pointer shadow-2xs active:scale-95"
          title="Tampilkan tips belajar lainnya secara acak"
        >
          <Shuffle className={`w-3 h-3 ${isRotating ? 'animate-spin' : ''}`} />
          <span>Tips Lain 🎲</span>
        </button>
      </div>

      {/* Tip Content */}
      <div className="pt-2.5 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 font-display flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>{currentTip.title}</span>
          </h4>
        </div>

        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          {currentTip.tip}
        </p>

        {currentTip.formula && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/90 dark:bg-slate-900/90 border border-indigo-100 dark:border-indigo-900/80 font-mono text-[11px] font-bold text-indigo-700 dark:text-indigo-300 shadow-2xs">
            <ChevronRight className="w-3 h-3 text-indigo-500" />
            <span>{currentTip.formula}</span>
          </div>
        )}

        <p className="text-[11px] text-slate-500 dark:text-slate-400 italic pt-0.5">
          💡 &ldquo;{currentTip.quote}&rdquo;
        </p>
      </div>
    </div>
  );
};
