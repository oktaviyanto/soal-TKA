export interface GeometryFormulaItem {
  id: string;
  name: string;
  dimension: 'Lingkaran' | 'Bangun Ruang';
  badge: string;
  summary: string;
  formulas: { label: string; formula: string; note?: string }[];
  keyVariables: string[];
  tipsTKA: string;
}

export const FORMULA_BANK: GeometryFormulaItem[] = [
  {
    id: 'f-lingkaran-dasar',
    name: 'Keliling & Luas Lingkaran',
    dimension: 'Lingkaran',
    badge: 'Lingkaran',
    summary: 'Konstanta rasio keliling terhadap diameter (π ≈ 22/7 jika r kelipatan 7, atau 3,14).',
    formulas: [
      { label: 'Keliling Lingkaran', formula: 'K = 2 × π × r = π × d' },
      { label: 'Luas Lingkaran', formula: 'L = π × r² = ¼ × π × d²' },
      { label: 'Jarak Putaran Roda', formula: 'Jarak = n (putaran) × K' },
      { label: 'Luas Cincin Melingkar', formula: 'L = π × (R² - r²)' },
    ],
    keyVariables: ['r = jari-jari', 'd = diameter (2r)', 'n = banyak putaran roda'],
    tipsTKA: 'Hafalkan luas lingkaran sakti: r=7 → L=154 cm², r=14 → L=616 cm², r=21 → L=1.386 cm².',
  },
  {
    id: 'f-juring-busur',
    name: 'Juring & Panjang Busur',
    dimension: 'Lingkaran',
    badge: 'Lingkaran',
    summary: 'Bagian keliling dan luas lingkaran yang sebanding dengan sudut pusat θ.',
    formulas: [
      { label: 'Panjang Busur', formula: 'Busur = (θ / 360°) × 2πr' },
      { label: 'Luas Juring', formula: 'Juring = (θ / 360°) × πr²' },
      { label: 'Sudut Pusat vs Keliling', formula: '∠Keliling = ½ × ∠Pusat' },
      { label: 'Sudut Menghadap Diameter', formula: '∠ACB = 90° (siku-siku)' },
    ],
    keyVariables: ['θ = besar sudut pusat (derajat)', 'r = jari-jari lingkaran'],
    tipsTKA: 'Sudut 60° = 1/6 lingkaran, sudut 90° = 1/4 lingkaran, sudut 120° = 1/3 lingkaran.',
  },
  {
    id: 'f-aplikasi-lingkaran',
    name: 'Aplikasi Kontekstual Lingkaran (Taman, Roda, Kipas & Sprinkler)',
    dimension: 'Lingkaran',
    badge: 'Kontekstual',
    summary: 'Penerapan rumus lingkaran pada masalah nyata: jalan cincin taman, keliling kipas, jangkauan semprotan sprinkler, dan jarak tempuh roda.',
    formulas: [
      { label: 'Luas Cincin Jalan Taman', formula: 'L = π × (R² - r²)' },
      { label: 'Keliling Juring Kipas', formula: 'Keliling = Busur + 2r' },
      { label: 'Jangkauan Sprinkler (Juring)', formula: 'L = (α / 360°) × πr²' },
      { label: 'Jarak Tempuh Roda Berputar', formula: 'Jarak = Keliling × Banyak Putaran' },
      { label: 'Sisa Pelat (Persegi - Lingkaran)', formula: 'L_sisa = s² - πr²' },
    ],
    keyVariables: ['R = jari-jari luar', 'r = jari-jari dalam', 'α = sudut semprotan/bukaan kipas', 's = panjang sisi persegi'],
    tipsTKA: 'Hati-hati pada keliling juring (seperti kipas lipat): wajib menambahkan 2 kali jari-jari (bilah samping) ke panjang busurnya!',
  },
  {
    id: 'f-kubus-balok',
    name: 'Kubus & Balok',
    dimension: 'Bangun Ruang',
    badge: 'Sisi Datar',
    summary: 'Bangun ruang prisma segiempat beraturan.',
    formulas: [
      { label: 'Volume Kubus', formula: 'V = s³' },
      { label: 'Luas Permukaan Kubus', formula: 'L = 6 × s²' },
      { label: 'Diagonal Ruang Kubus', formula: 'dr = s√3' },
      { label: 'Kawat Kerangka Kubus', formula: 'Kawat = 12 × s' },
      { label: 'Volume Balok', formula: 'V = p × l × t' },
      { label: 'Luas Balok Tanpa Tutup (Kolam)', formula: 'L = pl + 2(pt + lt)' },
      { label: 'Kawat Kerangka Balok', formula: 'Kawat = 4(p + l + t)' },
    ],
    keyVariables: ['s = rusuk kubus', 'p, l, t = panjang, lebar, tinggi balok'],
    tipsTKA: 'Jika rusuk kubus diperbesar k kali, maka luas permukaannya naik k² kali, dan volumenya naik k³ kali!',
  },
  {
    id: 'f-tabung',
    name: 'Tabung (Silinder)',
    dimension: 'Bangun Ruang',
    badge: 'Sisi Lengkung',
    summary: 'Prisma lingkaran dengan bidang alas dan tutup yang kongruen.',
    formulas: [
      { label: 'Volume Tabung', formula: 'V = π × r² × t' },
      { label: 'Luas Selimut', formula: 'L_selimut = 2 × π × r × t' },
      { label: 'Luas Tabung Penuh', formula: 'L = 2πr(r + t)' },
      { label: 'Luas Tabung Tanpa Tutup', formula: 'L = πr² + 2πrt = πr(r + 2t)' },
      { label: 'Kenaikan Air Tabung (Archimedes)', formula: 'π r² Δt = Volume Benda Masuk' },
    ],
    keyVariables: ['r = jari-jari alas', 't = tinggi tabung', 'Δt = pertambahan tinggi air'],
    tipsTKA: 'Untuk wadah tanpa tutup (kaleng/drum), alas lingkaran hanya ada SATU: πr² + 2πrt.',
  },
  {
    id: 'f-kerucut',
    name: 'Kerucut & Garis Pelukis',
    dimension: 'Bangun Ruang',
    badge: 'Sisi Lengkung',
    summary: 'Limas beratap lengkung dengan alas lingkaran dan titik puncak T.',
    formulas: [
      { label: 'Garis Pelukis', formula: 's = √(r² + t²)' },
      { label: 'Volume Kerucut', formula: 'V = ⅓ × π × r² × t' },
      { label: 'Luas Selimut Kerucut (Tenda)', formula: 'L_selimut = π × r × s' },
      { label: 'Luas Permukaan Penuh', formula: 'L = πr(r + s)' },
    ],
    keyVariables: ['r = jari-jari alas', 't = tinggi kerucut', 's = garis pelukis miring'],
    tipsTKA: 'Volume kerucut tepat ⅓ volume tabung. Sisi miring s dihitung dengan tripel Pythagoras r, t, dan s.',
  },
  {
    id: 'f-bola',
    name: 'Bola & Belahan Bola',
    dimension: 'Bangun Ruang',
    badge: 'Sisi Lengkung',
    summary: 'Bangun ruang dengan jarak permukaan seragam dari titik pusat.',
    formulas: [
      { label: 'Volume Bola', formula: 'V = ⁴⁄₃ × π × r³' },
      { label: 'Luas Permukaan Bola Penuh', formula: 'L = 4 × π × r²' },
      { label: 'Luas Kubah Belahan Berongga', formula: 'L = 2 × π × r²' },
      { label: 'Luas Belahan Bola Pejal (Padat)', formula: 'L = 3 × π × r²' },
    ],
    keyVariables: ['r = jari-jari bola', 'd = diameter bola (2r)'],
    tipsTKA: 'Kubah masjid adalah setengah bola berongga = 2πr². Belahan semangka/bola padat = 3πr².',
  },
  {
    id: 'f-limas',
    name: 'Limas Segiempat Persegi',
    dimension: 'Bangun Ruang',
    badge: 'Sisi Datar',
    summary: 'Limas dengan alas persegi beraturan dan 4 sisi tegak segitiga sama kaki.',
    formulas: [
      { label: 'Volume Limas', formula: 'V = ⅓ × Luas Alas × t' },
      { label: 'Tinggi Segitiga Tegak (Apotema)', formula: 't_tegak = √(t² + (½ sisi)²)' },
      { label: 'Luas Permukaan Limas', formula: 'L = (sisi²) + 4 × (½ × sisi × t_tegak)' },
    ],
    keyVariables: ['sisi = rusuk alas persegi', 't = tinggi limas', 't_tegak = tinggi miring segitiga'],
    tipsTKA: 'Jangan gunakan tinggi limas untuk menghitung luas segitiga sisi tegak. Gunakan apotema t_tegak melalui Pythagoras!',
  },
  {
    id: 'f-gabungan',
    name: 'Bangun Ruang Gabungan (Silo & Kapsul)',
    dimension: 'Bangun Ruang',
    badge: 'Gabungan',
    summary: 'Kombinasi bangun ruang seperti Tabung + Kerucut atau Tabung + Belahan Bola.',
    formulas: [
      { label: 'Volume Silo (Tabung + Kerucut)', formula: 'V = πr²(t_tabung + ⅓ t_kerucut)' },
      { label: 'Volume Kapsul (Tabung + Bola)', formula: 'V = πr²t + ⁴⁄₃ πr³' },
    ],
    keyVariables: ['r = jari-jari bersama', 't = tinggi masing-masing bangun'],
    tipsTKA: 'Faktorkan rumus untuk mempercepat hitungan dan menghindari kesalahan hitung berulang.',
  },
];
