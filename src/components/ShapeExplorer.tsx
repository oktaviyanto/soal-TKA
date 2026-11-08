import React, { useState } from 'react';
import { Layers, Box, RotateCcw, Sparkles } from 'lucide-react';

export const ShapeExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'2D' | '3D'>('2D');
  const [selectedShape2D, setSelectedShape2D] = useState<'lingkaran' | 'trapesium' | 'segitiga'>('lingkaran');
  const [selectedShape3D, setSelectedShape3D] = useState<'tabung' | 'kerucut' | 'kubus' | 'balok'>('tabung');

  // Parameters for 2D Lingkaran
  const [radius2D, setRadius2D] = useState<number>(7);
  const [angle2D, setAngle2D] = useState<number>(90);

  // Parameters for 2D Trapesium
  const [topBase, setTopBase] = useState<number>(8);
  const [bottomBase, setBottomBase] = useState<number>(14);
  const [height2D, setHeight2D] = useState<number>(6);

  // Parameters for 2D Segitiga Siku-siku
  const [triBase, setTriBase] = useState<number>(6);
  const [triHeight, setTriHeight] = useState<number>(8);

  // Parameters for 3D Tabung
  const [tabungRadius, setTabungRadius] = useState<number>(7);
  const [tabungHeight, setTabungHeight] = useState<number>(10);

  // Parameters for 3D Kerucut
  const [kerucutRadius, setKerucutRadius] = useState<number>(7);
  const [kerucutHeight, setKerucutHeight] = useState<number>(24);

  // Parameters for 3D Kubus
  const [kubusSide, setKubusSide] = useState<number>(8);

  // Parameters for 3D Balok
  const [balokP, setBalokP] = useState<number>(10);
  const [balokL, setBalokL] = useState<number>(6);
  const [balokT, setBalokT] = useState<number>(5);

  const pi = 22 / 7;

  return (
    <div className="w-full space-y-6">
      {/* Top Selector Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Lab Eksplorasi Geometri Interaktif
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Ubah parameter ukuran dan amati perubahan bentuk, luas, serta volume secara real-time.
          </p>
        </div>

        {/* Lingkaran vs Bangun Ruang Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg">
          <button
            onClick={() => setActiveTab('2D')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === '2D'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Eksplorasi Lingkaran
          </button>
          <button
            onClick={() => setActiveTab('3D')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === '3D'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            Eksplorasi Bangun Ruang
          </button>
        </div>
      </div>

      {/* Shape Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {activeTab === '2D' ? (
          <>
            <button
              onClick={() => setSelectedShape2D('lingkaran')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                selectedShape2D === 'lingkaran'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Lingkaran & Juring
            </button>
            <button
              onClick={() => setSelectedShape2D('trapesium')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                selectedShape2D === 'trapesium'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Trapesium Sama Kaki
            </button>
            <button
              onClick={() => setSelectedShape2D('segitiga')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                selectedShape2D === 'segitiga'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Segitiga Siku-siku & Pythagoras
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setSelectedShape3D('tabung')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                selectedShape3D === 'tabung'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Tabung (Silinder)
            </button>
            <button
              onClick={() => setSelectedShape3D('kerucut')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                selectedShape3D === 'kerucut'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Kerucut & Garis Pelukis
            </button>
            <button
              onClick={() => setSelectedShape3D('kubus')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                selectedShape3D === 'kubus'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Kubus
            </button>
            <button
              onClick={() => setSelectedShape3D('balok')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                selectedShape3D === 'balok'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Balok
            </button>
          </>
        )}
      </div>

      {/* Main Interactive Stage & Control Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Interactive Canvas Stage */}
        <div className="lg:col-span-7 flex flex-col justify-center items-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs relative overflow-hidden min-h-[340px]">
          {/* Subtle blueprint grid */}
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)`,
              backgroundSize: '20px 20px',
            }}
          />

          {/* 2D LINGKARAN */}
          {activeTab === '2D' && selectedShape2D === 'lingkaran' && (
            <div className="w-full max-w-sm flex flex-col items-center">
              <svg viewBox="0 0 260 220" className="w-full max-h-64">
                <circle cx="130" cy="110" r={radius2D * 4.5} fill="rgba(99, 102, 241, 0.05)" stroke="#6366f1" strokeWidth="2" strokeDasharray="4,4" />
                {/* Sector */}
                {(() => {
                  const rad = (angle2D * Math.PI) / 180;
                  const r = radius2D * 4.5;
                  const x = 130 + r * Math.cos(-rad);
                  const y = 110 + r * Math.sin(-rad);
                  const largeArc = angle2D > 180 ? 1 : 0;
                  return (
                    <path
                      d={`M 130 110 L ${130 + r} 110 A ${r} ${r} 0 ${largeArc} 0 ${x} ${y} Z`}
                      fill="rgba(99, 102, 241, 0.22)"
                      stroke="#4f46e5"
                      strokeWidth="2.5"
                    />
                  );
                })()}
                <circle cx="130" cy="110" r="3" fill="#4f46e5" />
                <text x="130" y="102" textAnchor="middle" className="text-xs font-bold fill-slate-700 dark:fill-slate-300">O</text>
                <text x={130 + (radius2D * 4.5) / 2} y="126" textAnchor="middle" className="text-xs font-bold fill-indigo-600 dark:fill-indigo-300">
                  r = {radius2D} cm
                </text>
                <text x="130" y="210" textAnchor="middle" className="text-xs font-semibold fill-amber-600 dark:fill-amber-400">
                  Sudut Pusat θ = {angle2D}°
                </text>
              </svg>
            </div>
          )}

          {/* 2D TRAPESIUM */}
          {activeTab === '2D' && selectedShape2D === 'trapesium' && (
            <div className="w-full max-w-sm flex flex-col items-center">
              <svg viewBox="0 0 280 200" className="w-full max-h-64">
                {(() => {
                  const scale = 7;
                  const topW = topBase * scale;
                  const botW = bottomBase * scale;
                  const h = height2D * scale;
                  const startX = (280 - botW) / 2;
                  const topStartX = (280 - topW) / 2;
                  const topY = 160 - h;
                  return (
                    <>
                      <polygon
                        points={`${topStartX},${topY} ${topStartX + topW},${topY} ${startX + botW},160 ${startX},160`}
                        fill="rgba(99, 102, 241, 0.15)"
                        stroke="#4f46e5"
                        strokeWidth="2.5"
                      />
                      <line x1={topStartX} y1={topY} x2={topStartX} y2="160" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
                      <text x="140" y={topY - 10} textAnchor="middle" className="text-xs font-bold fill-indigo-600 dark:fill-indigo-300">
                        a = {topBase} cm
                      </text>
                      <text x="140" y="180" textAnchor="middle" className="text-xs font-bold fill-indigo-600 dark:fill-indigo-300">
                        b = {bottomBase} cm
                      </text>
                      <text x={topStartX - 10} y={topY + h / 2} textAnchor="end" className="text-xs font-bold fill-amber-600 dark:fill-amber-400">
                        t = {height2D} cm
                      </text>
                    </>
                  );
                })()}
              </svg>
            </div>
          )}

          {/* 2D SEGITIGA */}
          {activeTab === '2D' && selectedShape2D === 'segitiga' && (
            <div className="w-full max-w-sm flex flex-col items-center">
              <svg viewBox="0 0 260 200" className="w-full max-h-64">
                {(() => {
                  const hypotenuse = Math.sqrt(triBase ** 2 + triHeight ** 2).toFixed(1);
                  return (
                    <>
                      <polygon
                        points="60,40 60,160 200,160"
                        fill="rgba(99, 102, 241, 0.12)"
                        stroke="#4f46e5"
                        strokeWidth="2.5"
                      />
                      <rect x="60" y="146" width="14" height="14" fill="none" stroke="#6366f1" strokeWidth="1.5" />
                      <text x="45" y="105" textAnchor="end" className="text-xs font-bold fill-indigo-600 dark:fill-indigo-300">t = {triHeight} cm</text>
                      <text x="130" y="180" textAnchor="middle" className="text-xs font-bold fill-indigo-600 dark:fill-indigo-300">a = {triBase} cm</text>
                      <text x="145" y="95" textAnchor="start" className="text-xs font-bold fill-rose-600 dark:fill-rose-400">c = {hypotenuse} cm</text>
                    </>
                  );
                })()}
              </svg>
            </div>
          )}

          {/* 3D TABUNG */}
          {activeTab === '3D' && selectedShape3D === 'tabung' && (
            <div className="w-full max-w-sm flex flex-col items-center">
              <svg viewBox="0 0 240 220" className="w-full max-h-64">
                {(() => {
                  const r = tabungRadius * 3.8;
                  const h = Math.min(120, tabungHeight * 5.5);
                  const cx = 120;
                  const topY = 40;
                  const botY = topY + h;
                  return (
                    <>
                      {/* Body */}
                      <path
                        d={`M ${cx - r} ${topY} L ${cx - r} ${botY} A ${r} 16 0 0 0 ${cx + r} ${botY} L ${cx + r} ${topY} Z`}
                        fill="rgba(99, 102, 241, 0.14)"
                      />
                      <ellipse cx={cx} cy={topY} rx={r} ry="16" fill="rgba(99, 102, 241, 0.22)" stroke="#4f46e5" strokeWidth="2" />
                      <path d={`M ${cx - r} ${botY} A ${r} 16 0 0 0 ${cx + r} ${botY}`} fill="none" stroke="#4f46e5" strokeWidth="2" />
                      <path d={`M ${cx - r} ${botY} A ${r} 16 0 0 1 ${cx + r} ${botY}`} fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,3" />
                      <line x1={cx - r} y1={topY} x2={cx - r} y2={botY} stroke="#4f46e5" strokeWidth="2" />
                      <line x1={cx + r} y1={topY} x2={cx + r} y2={botY} stroke="#4f46e5" strokeWidth="2" />
                      {/* Radius */}
                      <line x1={cx} y1={topY} x2={cx + r} y2={topY} stroke="#f59e0b" strokeWidth="2" />
                      <circle cx={cx} cy={topY} r="2.5" fill="#f59e0b" />
                      <text x={cx + r / 2} y={topY - 8} textAnchor="middle" className="text-xs font-bold fill-amber-600 dark:fill-amber-400">
                        r = {tabungRadius} cm
                      </text>
                      <text x={cx + r + 15} y={topY + h / 2} textAnchor="start" className="text-xs font-bold fill-indigo-600 dark:fill-indigo-300">
                        t = {tabungHeight} cm
                      </text>
                    </>
                  );
                })()}
              </svg>
            </div>
          )}

          {/* 3D KERUCUT */}
          {activeTab === '3D' && selectedShape3D === 'kerucut' && (
            <div className="w-full max-w-sm flex flex-col items-center">
              <svg viewBox="0 0 240 220" className="w-full max-h-64">
                {(() => {
                  const s = Math.sqrt(kerucutRadius ** 2 + kerucutHeight ** 2).toFixed(1);
                  return (
                    <>
                      <polygon points="120,30 50,160 190,160" fill="rgba(99, 102, 241, 0.12)" />
                      <path d="M 50 160 A 70 18 0 0 0 190 160" fill="none" stroke="#4f46e5" strokeWidth="2.5" />
                      <path d="M 50 160 A 70 18 0 0 1 190 160" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,3" />
                      <line x1="120" y1="30" x2="50" y2="160" stroke="#4f46e5" strokeWidth="2" />
                      <line x1="120" y1="30" x2="190" y2="160" stroke="#4f46e5" strokeWidth="2" />
                      <line x1="120" y1="30" x2="120" y2="160" stroke="#f59e0b" strokeWidth="1.8" strokeDasharray="3,3" />
                      <line x1="120" y1="160" x2="190" y2="160" stroke="#10b981" strokeWidth="2" />
                      <text x="110" y="100" textAnchor="end" className="text-xs font-bold fill-amber-600 dark:fill-amber-400">t = {kerucutHeight} cm</text>
                      <text x="155" y="180" textAnchor="middle" className="text-xs font-bold fill-emerald-600 dark:fill-emerald-400">r = {kerucutRadius} cm</text>
                      <text x="168" y="90" textAnchor="start" className="text-xs font-bold fill-rose-600 dark:fill-rose-400">s = {s} cm</text>
                    </>
                  );
                })()}
              </svg>
            </div>
          )}

          {/* 3D KUBUS */}
          {activeTab === '3D' && selectedShape3D === 'kubus' && (
            <div className="w-full max-w-sm flex flex-col items-center">
              <svg viewBox="0 0 240 200" className="w-full max-h-64">
                <polygon points="50,90 130,90 130,170 50,170" fill="rgba(99, 102, 241, 0.15)" stroke="#4f46e5" strokeWidth="2" />
                <polygon points="100,45 180,45 180,125 100,125" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="50" y1="90" x2="100" y2="45" stroke="#4f46e5" strokeWidth="2" />
                <line x1="130" y1="90" x2="180" y2="45" stroke="#4f46e5" strokeWidth="2" />
                <line x1="130" y1="170" x2="180" y2="125" stroke="#4f46e5" strokeWidth="2" />
                <line x1="50" y1="170" x2="100" y2="125" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="50" y1="170" x2="180" y2="45" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,3" />
                <text x="90" y="188" textAnchor="middle" className="text-xs font-bold fill-indigo-600 dark:fill-indigo-300">s = {kubusSide} cm</text>
                <text x="135" y="80" textAnchor="start" className="text-xs font-bold fill-rose-600 dark:fill-rose-400">dr = {(kubusSide * Math.sqrt(3)).toFixed(1)} cm</text>
              </svg>
            </div>
          )}

          {/* 3D BALOK */}
          {activeTab === '3D' && selectedShape3D === 'balok' && (
            <div className="w-full max-w-sm flex flex-col items-center">
              <svg viewBox="0 0 280 200" className="w-full max-h-64">
                <rect x="40" y="100" width="130" height="60" fill="rgba(99, 102, 241, 0.1)" stroke="#4f46e5" strokeWidth="2" />
                <polygon points="40,100 85,55 215,55 170,100" fill="rgba(99, 102, 241, 0.18)" stroke="#4f46e5" strokeWidth="2" />
                <polygon points="170,100 215,55 215,115 170,160" fill="rgba(99, 102, 241, 0.25)" stroke="#4f46e5" strokeWidth="2" />
                <text x="105" y="180" textAnchor="middle" className="text-xs font-bold fill-indigo-600 dark:fill-indigo-300">p = {balokP} cm</text>
                <text x="30" y="135" textAnchor="end" className="text-xs font-bold fill-amber-600 dark:fill-amber-400">t = {balokT} cm</text>
                <text x="200" y="80" textAnchor="start" className="text-xs font-bold fill-emerald-600 dark:fill-emerald-400">l = {balokL} cm</text>
              </svg>
            </div>
          )}
        </div>

        {/* Right Parameter Deck & Live Result Calculations */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">Parameter Kontrol</span>
              <button
                onClick={() => {
                  setRadius2D(7);
                  setAngle2D(90);
                  setTopBase(8);
                  setBottomBase(14);
                  setHeight2D(6);
                  setTriBase(6);
                  setTriHeight(8);
                  setTabungRadius(7);
                  setTabungHeight(10);
                  setKerucutRadius(7);
                  setKerucutHeight(24);
                  setKubusSide(8);
                  setBalokP(10);
                  setBalokL(6);
                  setBalokT(5);
                }}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Standar
              </button>
            </div>

            {/* Parameter Sliders depending on selection */}
            <div className="space-y-4 mt-4">
              {activeTab === '2D' && selectedShape2D === 'lingkaran' && (
                <>
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      <span>Jari-jari (r)</span>
                      <span className="font-math text-indigo-600 dark:text-indigo-400">{radius2D} cm</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={28}
                      step={1}
                      value={radius2D}
                      onChange={(e) => setRadius2D(Number(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      <span>Sudut Pusat Juring (θ)</span>
                      <span className="font-math text-amber-600 dark:text-amber-400">{angle2D}°</span>
                    </div>
                    <input
                      type="range"
                      min={15}
                      max={360}
                      step={15}
                      value={angle2D}
                      onChange={(e) => setAngle2D(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                </>
              )}

              {activeTab === '2D' && selectedShape2D === 'trapesium' && (
                <>
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      <span>Sisi Atas (a)</span>
                      <span className="font-math text-indigo-600">{topBase} cm</span>
                    </div>
                    <input
                      type="range"
                      min={4}
                      max={20}
                      value={topBase}
                      onChange={(e) => setTopBase(Number(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      <span>Sisi Bawah (b)</span>
                      <span className="font-math text-indigo-600">{bottomBase} cm</span>
                    </div>
                    <input
                      type="range"
                      min={topBase + 2}
                      max={30}
                      value={bottomBase}
                      onChange={(e) => setBottomBase(Number(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      <span>Tinggi (t)</span>
                      <span className="font-math text-amber-600">{height2D} cm</span>
                    </div>
                    <input
                      type="range"
                      min={3}
                      max={18}
                      value={height2D}
                      onChange={(e) => setHeight2D(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                </>
              )}

              {activeTab === '2D' && selectedShape2D === 'segitiga' && (
                <>
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      <span>Sisi Alas (a)</span>
                      <span className="font-math text-indigo-600">{triBase} cm</span>
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={24}
                      value={triBase}
                      onChange={(e) => setTriBase(Number(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      <span>Sisi Tegak (b)</span>
                      <span className="font-math text-indigo-600">{triHeight} cm</span>
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={24}
                      value={triHeight}
                      onChange={(e) => setTriHeight(Number(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>
                </>
              )}

              {activeTab === '3D' && selectedShape3D === 'tabung' && (
                <>
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      <span>Jari-jari Alas (r)</span>
                      <span className="font-math text-amber-600">{tabungRadius} cm</span>
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={21}
                      value={tabungRadius}
                      onChange={(e) => setTabungRadius(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      <span>Tinggi Tabung (t)</span>
                      <span className="font-math text-indigo-600">{tabungHeight} cm</span>
                    </div>
                    <input
                      type="range"
                      min={3}
                      max={30}
                      value={tabungHeight}
                      onChange={(e) => setTabungHeight(Number(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>
                </>
              )}

              {activeTab === '3D' && selectedShape3D === 'kerucut' && (
                <>
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      <span>Jari-jari Alas (r)</span>
                      <span className="font-math text-emerald-600">{kerucutRadius} cm</span>
                    </div>
                    <input
                      type="range"
                      min={3}
                      max={21}
                      value={kerucutRadius}
                      onChange={(e) => setKerucutRadius(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      <span>Tinggi Kerucut (t)</span>
                      <span className="font-math text-amber-600">{kerucutHeight} cm</span>
                    </div>
                    <input
                      type="range"
                      min={4}
                      max={30}
                      value={kerucutHeight}
                      onChange={(e) => setKerucutHeight(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                </>
              )}

              {activeTab === '3D' && selectedShape3D === 'kubus' && (
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    <span>Panjang Rusuk (s)</span>
                    <span className="font-math text-indigo-600">{kubusSide} cm</span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={25}
                    value={kubusSide}
                    onChange={(e) => setKubusSide(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              )}

              {activeTab === '3D' && selectedShape3D === 'balok' && (
                <>
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      <span>Panjang (p)</span>
                      <span className="font-math text-indigo-600">{balokP} cm</span>
                    </div>
                    <input
                      type="range"
                      min={4}
                      max={25}
                      value={balokP}
                      onChange={(e) => setBalokP(Number(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      <span>Lebar (l)</span>
                      <span className="font-math text-emerald-600">{balokL} cm</span>
                    </div>
                    <input
                      type="range"
                      min={3}
                      max={20}
                      value={balokL}
                      onChange={(e) => setBalokL(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      <span>Tinggi (t)</span>
                      <span className="font-math text-amber-600">{balokT} cm</span>
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={18}
                      value={balokT}
                      onChange={(e) => setBalokT(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Live Calculated Metric Cards */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800/80 space-y-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">Hasil Perhitungan Real-time</span>

            {activeTab === '2D' && selectedShape2D === 'lingkaran' && (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-600 dark:text-slate-400">Keliling Penuh (2πr):</span>
                  <span className="font-math font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                    {(2 * pi * radius2D).toFixed(1)} cm
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-600 dark:text-slate-400">Luas Lingkaran Penuh (πr²):</span>
                  <span className="font-math font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                    {(pi * radius2D ** 2).toFixed(1)} cm²
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-600 dark:text-slate-400">Panjang Busur ({angle2D}°):</span>
                  <span className="font-math font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                    {((angle2D / 360) * 2 * pi * radius2D).toFixed(1)} cm
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-600 dark:text-slate-400">Luas Juring ({angle2D}°):</span>
                  <span className="font-math font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {((angle2D / 360) * pi * radius2D ** 2).toFixed(1)} cm²
                  </span>
                </div>
              </div>
            )}

            {activeTab === '2D' && selectedShape2D === 'trapesium' && (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-600 dark:text-slate-400">Luas Trapesium (½ × (a+b) × t):</span>
                  <span className="font-math font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                    {(0.5 * (topBase + bottomBase) * height2D).toFixed(1)} cm²
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-600 dark:text-slate-400">Sisi Miring (Pythagoras):</span>
                  <span className="font-math font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                    {Math.sqrt(((bottomBase - topBase) / 2) ** 2 + height2D ** 2).toFixed(1)} cm
                  </span>
                </div>
              </div>
            )}

            {activeTab === '2D' && selectedShape2D === 'segitiga' && (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-600 dark:text-slate-400">Hipotenusa (c = √(a²+b²)):</span>
                  <span className="font-math font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                    {Math.sqrt(triBase ** 2 + triHeight ** 2).toFixed(1)} cm
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-600 dark:text-slate-400">Luas Segitiga (½ × a × t):</span>
                  <span className="font-math font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                    {(0.5 * triBase * triHeight).toFixed(1)} cm²
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-600 dark:text-slate-400">Keliling Segitiga:</span>
                  <span className="font-math font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                    {(triBase + triHeight + Math.sqrt(triBase ** 2 + triHeight ** 2)).toFixed(1)} cm
                  </span>
                </div>
              </div>
            )}

            {activeTab === '3D' && selectedShape3D === 'tabung' && (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-600 dark:text-slate-400">Volume Tabung (πr²t):</span>
                  <span className="font-math font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                    {(pi * tabungRadius ** 2 * tabungHeight).toFixed(1)} cm³
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-600 dark:text-slate-400">Luas Selimut (2πrt):</span>
                  <span className="font-math font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                    {(2 * pi * tabungRadius * tabungHeight).toFixed(1)} cm²
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-600 dark:text-slate-400">Luas Permukaan Total (2πr(r+t)):</span>
                  <span className="font-math font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {(2 * pi * tabungRadius * (tabungRadius + tabungHeight)).toFixed(1)} cm²
                  </span>
                </div>
              </div>
            )}

            {activeTab === '3D' && selectedShape3D === 'kerucut' && (
              <div className="space-y-2 text-xs">
                {(() => {
                  const s = Math.sqrt(kerucutRadius ** 2 + kerucutHeight ** 2);
                  return (
                    <>
                      <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                        <span className="text-slate-600 dark:text-slate-400">Garis Pelukis (s = √(r²+t²)):</span>
                        <span className="font-math font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                          {s.toFixed(1)} cm
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                        <span className="text-slate-600 dark:text-slate-400">Volume Kerucut (⅓πr²t):</span>
                        <span className="font-math font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                          {((1 / 3) * pi * kerucutRadius ** 2 * kerucutHeight).toFixed(1)} cm³
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-slate-600 dark:text-slate-400">Luas Selimut (πrs):</span>
                        <span className="font-math font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                          {(pi * kerucutRadius * s).toFixed(1)} cm²
                        </span>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {activeTab === '3D' && selectedShape3D === 'kubus' && (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-600 dark:text-slate-400">Volume (s³):</span>
                  <span className="font-math font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                    {kubusSide ** 3} cm³
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-600 dark:text-slate-400">Luas Permukaan (6s²):</span>
                  <span className="font-math font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                    {6 * kubusSide ** 2} cm²
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-600 dark:text-slate-400">Panjang Kawat Kerangka (12s):</span>
                  <span className="font-math font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                    {12 * kubusSide} cm
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-600 dark:text-slate-400">Diagonal Ruang (s√3):</span>
                  <span className="font-math font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                    {(kubusSide * Math.sqrt(3)).toFixed(1)} cm
                  </span>
                </div>
              </div>
            )}

            {activeTab === '3D' && selectedShape3D === 'balok' && (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-600 dark:text-slate-400">Volume (p × l × t):</span>
                  <span className="font-math font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                    {balokP * balokL * balokT} cm³
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-600 dark:text-slate-400">Luas Permukaan Lengkap:</span>
                  <span className="font-math font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                    {2 * (balokP * balokL + balokP * balokT + balokL * balokT)} cm²
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-600 dark:text-slate-400">Luas Tanpa Tutup (Kolam/Bak):</span>
                  <span className="font-math font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {balokP * balokL + 2 * (balokP * balokT + balokL * balokT)} cm²
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
