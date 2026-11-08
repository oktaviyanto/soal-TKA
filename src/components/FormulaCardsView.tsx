import React, { useState } from 'react';
import { FORMULA_BANK } from '../data/formulaBank';
import { Search, Sparkles, Circle, Box } from 'lucide-react';

export const FormulaCardsView: React.FC = () => {
  const [filterDim, setFilterDim] = useState<'all' | 'Lingkaran' | 'Bangun Ruang'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = FORMULA_BANK.filter((item) => {
    const matchDim = filterDim === 'all' || item.dimension === filterDim;
    const matchSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tipsTKA.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.formulas.some((f) => f.label.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchDim && matchSearch;
  });

  return (
    <div className="w-full space-y-6">
      {/* Header and Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Bank Rumus Lingkaran & Bangun Ruang Kelas 9
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Kumpulan rumus pokok TKA: Lingkaran kontekstual, juring & busur, Kubus, Balok, Tabung, Kerucut, Bola, dan Limas.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg shrink-0">
          <button
            onClick={() => setFilterDim('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              filterDim === 'all'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Semua ({FORMULA_BANK.length})
          </button>
          <button
            onClick={() => setFilterDim('Lingkaran')}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              filterDim === 'Lingkaran'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Circle className="w-3.5 h-3.5" />
            Lingkaran
          </button>
          <button
            onClick={() => setFilterDim('Bangun Ruang')}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              filterDim === 'Bangun Ruang'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            Bangun Ruang
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Cari rumus (misal: juring, sprinkler, volume tabung, selimut kerucut, kubah)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 dark:text-slate-100"
        />
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4 hover:border-indigo-300 dark:hover:border-indigo-700/60 transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {item.dimension}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {item.badge}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {item.name}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {item.summary}
              </p>

              {/* Formulas */}
              <div className="pt-2 space-y-2">
                {item.formulas.map((f, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs"
                  >
                    <span className="text-slate-500 dark:text-slate-400 block mb-0.5 text-[11px]">
                      {f.label}
                    </span>
                    <span className="font-math font-semibold text-slate-900 dark:text-slate-100 text-sm">
                      {f.formula}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Tip & Variables */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block">Variabel Kunci:</span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  {item.keyVariables.join(' · ')}
                </p>
              </div>

              <div className="p-2 rounded-lg bg-amber-50/70 dark:bg-amber-950/40 text-[11px] text-amber-900 dark:text-amber-200">
                <strong>💡 Tips TKA:</strong> {item.tipsTKA}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
