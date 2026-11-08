import React from 'react';
import { DiagramConfig } from '../types/geometry';

interface GeometryDiagramProps {
  config: DiagramConfig;
  className?: string;
}

export const GeometryDiagram: React.FC<GeometryDiagramProps> = ({ config, className = '' }) => {
  const { type, params = {} } = config;

  const renderDiagram = () => {
    switch (type) {
      // 1. Juring Lingkaran
      case 'circle_sector': {
        const angle = Number(params.angle || 60);
        const radius = String(params.radius || '21 cm');
        const showShade = params.showShade !== false;
        const rad = (angle * Math.PI) / 180;
        const cx = 130;
        const cy = 110;
        const r = 80;
        const x2 = cx + r * Math.cos(-rad);
        const y2 = cy + r * Math.sin(-rad);
        return (
          <svg viewBox="0 0 280 200" className="w-full h-full max-h-56" aria-label="Diagram Juring Lingkaran">
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" className="text-slate-300 dark:text-slate-700" />
            {showShade && (
              <path
                d={`M ${cx} ${cy} L ${cx + r} ${cy} A ${r} ${r} 0 ${angle > 180 ? 1 : 0} 0 ${x2} ${y2} Z`}
                fill="rgba(99, 102, 241, 0.18)"
                stroke="#4f46e5"
                strokeWidth="2.5"
              />
            )}
            <circle cx={cx} cy={cy} r="3" fill="#4f46e5" />
            <text x={cx - 12} y={cy + 5} className="text-xs font-bold fill-slate-700 dark:fill-slate-300">O</text>
            <line x1={cx} y1={cy} x2={cx + r} y2={cy} stroke="#4f46e5" strokeWidth="2" />
            <line x1={cx} y1={cy} x2={x2} y2={y2} stroke="#4f46e5" strokeWidth="2" />
            <text x={cx + r + 8} y={cy + 4} className="text-xs font-bold fill-slate-700 dark:fill-slate-300">A</text>
            <text x={x2 + 8} y={y2 - 2} className="text-xs font-bold fill-slate-700 dark:fill-slate-300">B</text>
            <path
              d={`M ${cx + 25} ${cy} A 25 25 0 ${angle > 180 ? 1 : 0} 0 ${cx + 25 * Math.cos(-rad)} ${cy + 25 * Math.sin(-rad)}`}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
            />
            <text x={cx + 34} y={cy - 12} className="text-xs font-bold fill-amber-600 dark:fill-amber-400">{angle}°</text>
            <text x={cx + r / 2} y={cy + 18} textAnchor="middle" className="text-xs font-semibold fill-indigo-600 dark:fill-indigo-300">r = {radius}</text>
          </svg>
        );
      }

      // 2. Sudut Pusat vs Sudut Keliling
      case 'circle_angles': {
        const centerAngle = String(params.centerAngle || '80°');
        const inscribedAngle = String(params.inscribedAngle || '40°');
        return (
          <svg viewBox="0 0 280 200" className="w-full h-full max-h-56" aria-label="Diagram Sudut Pusat dan Sudut Keliling">
            <circle cx="140" cy="110" r="75" fill="none" stroke="#4f46e5" strokeWidth="2" />
            <circle cx="140" cy="110" r="3" fill="#4f46e5" />
            <text x="140" y="125" textAnchor="middle" className="text-xs font-bold fill-slate-700 dark:fill-slate-300">O (Pusat)</text>
            {/* Points on circle: A(75, 140), B(205, 140), C(140, 35) */}
            <line x1="140" y1="110" x2="80" y2="145" stroke="#f59e0b" strokeWidth="2" />
            <line x1="140" y1="110" x2="200" y2="145" stroke="#f59e0b" strokeWidth="2" />
            <line x1="140" y1="35" x2="80" y2="145" stroke="#10b981" strokeWidth="2" />
            <line x1="140" y1="35" x2="200" y2="145" stroke="#10b981" strokeWidth="2" />
            <circle cx="80" cy="145" r="3" fill="#4f46e5" />
            <circle cx="200" cy="145" r="3" fill="#4f46e5" />
            <circle cx="140" cy="35" r="3" fill="#10b981" />
            <text x="68" y="152" className="text-xs font-bold fill-slate-600 dark:fill-slate-400">A</text>
            <text x="208" y="152" className="text-xs font-bold fill-slate-600 dark:fill-slate-400">B</text>
            <text x="140" y="24" textAnchor="middle" className="text-xs font-bold fill-emerald-600">C (Keliling)</text>
            <text x="140" y="98" textAnchor="middle" className="text-xs font-bold fill-amber-600">∠AOB = {centerAngle}</text>
            <text x="140" y="52" textAnchor="middle" className="text-xs font-bold fill-emerald-600">∠ACB = {inscribedAngle}</text>
          </svg>
        );
      }

      // 3. Garis Singgung Persekutuan Luar / Dalam
      case 'circle_tangent_common': {
        const isInternal = params.mode === 'internal';
        const R = String(params.R || '15 cm');
        const r = String(params.r || '8 cm');
        const distance = String(params.distance || '25 cm');
        const tangent = String(params.tangent || '24 cm');
        return (
          <svg viewBox="0 0 300 180" className="w-full h-full max-h-56" aria-label="Diagram Garis Singgung Persekutuan">
            {/* Center line */}
            <line x1="70" y1="95" x2="230" y2="95" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3,3" className="text-slate-400" />
            {/* Big circle */}
            <circle cx="70" cy="95" r="45" fill="rgba(99, 102, 241, 0.08)" stroke="#4f46e5" strokeWidth="2" />
            <circle cx="70" cy="95" r="3" fill="#4f46e5" />
            <text x="70" y="90" textAnchor="middle" className="text-[11px] font-bold fill-indigo-600">P</text>
            {/* Small circle */}
            <circle cx="230" cy="95" r="26" fill="rgba(99, 102, 241, 0.08)" stroke="#4f46e5" strokeWidth="2" />
            <circle cx="230" cy="95" r="3" fill="#4f46e5" />
            <text x="230" y="90" textAnchor="middle" className="text-[11px] font-bold fill-indigo-600">Q</text>
            {/* Tangent line */}
            {!isInternal ? (
              <>
                <line x1="70" y1="50" x2="230" y2="69" stroke="#ef4444" strokeWidth="2.5" />
                <line x1="70" y1="95" x2="70" y2="50" stroke="#f59e0b" strokeWidth="1.5" />
                <line x1="230" y1="95" x2="230" y2="69" stroke="#f59e0b" strokeWidth="1.5" />
                <text x="150" y="45" textAnchor="middle" className="text-xs font-bold fill-rose-600">GSPL = {tangent}</text>
              </>
            ) : (
              <>
                <line x1="70" y1="50" x2="230" y2="121" stroke="#ef4444" strokeWidth="2.5" />
                <line x1="70" y1="95" x2="70" y2="50" stroke="#f59e0b" strokeWidth="1.5" />
                <line x1="230" y1="95" x2="230" y2="121" stroke="#f59e0b" strokeWidth="1.5" />
                <text x="150" y="70" textAnchor="middle" className="text-xs font-bold fill-rose-600">GSPD = {tangent}</text>
              </>
            )}
            <text x="150" y="115" textAnchor="middle" className="text-[11px] font-semibold fill-slate-500">Jarak Pusat (p) = {distance}</text>
            <text x="50" y="75" textAnchor="end" className="text-[10px] font-bold fill-amber-600">R = {R}</text>
            <text x="245" y="85" textAnchor="start" className="text-[10px] font-bold fill-amber-600">r = {r}</text>
          </svg>
        );
      }

      // 4. Roda Berputar Lintasan
      case 'circle_wheel': {
        const radius = String(params.radius || '28 cm');
        const rotations = String(params.rotations || '100 kali');
        return (
          <svg viewBox="0 0 280 180" className="w-full h-full max-h-56" aria-label="Diagram Roda Berputar">
            {/* Ground */}
            <line x1="20" y1="140" x2="260" y2="140" stroke="currentColor" strokeWidth="2" className="text-slate-400" />
            {/* Wheel */}
            <circle cx="100" cy="85" r="55" fill="rgba(99, 102, 241, 0.1)" stroke="#4f46e5" strokeWidth="3" />
            <circle cx="100" cy="85" r="4" fill="#4f46e5" />
            {/* Wheel spokes */}
            <line x1="100" y1="30" x2="100" y2="140" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="3,2" />
            <line x1="45" y1="85" x2="155" y2="85" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="3,2" />
            {/* Arrow on ground showing path */}
            <line x1="100" y1="155" x2="240" y2="155" stroke="#10b981" strokeWidth="2" />
            <polygon points="240,150 248,155 240,160" fill="#10b981" />
            <text x="100" y="80" textAnchor="middle" className="text-[11px] font-bold fill-indigo-600">r = {radius}</text>
            <text x="175" y="172" textAnchor="middle" className="text-xs font-bold fill-emerald-600">Jarak = Putaran ({rotations}) × Keliling</text>
          </svg>
        );
      }

      // 5. Kubus 3D
      case 'cube_isometric': {
        const side = String(params.side || '12 cm');
        const showDiagonal = params.showDiagonal !== false;
        return (
          <svg viewBox="0 0 280 200" className="w-full h-full max-h-56" aria-label="Diagram Kubus 3D">
            <polygon points="60,90 140,90 140,170 60,170" fill="rgba(99, 102, 241, 0.12)" stroke="#4f46e5" strokeWidth="2" />
            <polygon points="110,40 190,40 190,120 110,120" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3,3" className="text-slate-400" />
            <line x1="60" y1="90" x2="110" y2="40" stroke="#4f46e5" strokeWidth="2" />
            <line x1="140" y1="90" x2="190" y2="40" stroke="#4f46e5" strokeWidth="2" />
            <line x1="140" y1="170" x2="190" y2="120" stroke="#4f46e5" strokeWidth="2" />
            <line x1="60" y1="170" x2="110" y2="120" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3,3" className="text-slate-400" />
            {showDiagonal && (
              <line x1="60" y1="170" x2="190" y2="40" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="5,4" />
            )}
            <text x="100" y="188" textAnchor="middle" className="text-xs font-bold fill-indigo-600 dark:fill-indigo-300">s = {side}</text>
            {showDiagonal && (
              <text x="145" y="80" textAnchor="start" className="text-xs font-bold fill-rose-600 dark:fill-rose-400">dr = s√3</text>
            )}
            <text x="50" y="175" className="text-[11px] font-semibold fill-slate-500">A</text>
            <text x="145" y="175" className="text-[11px] font-semibold fill-slate-500">B</text>
            <text x="195" y="38" className="text-[11px] font-semibold fill-slate-500">G</text>
          </svg>
        );
      }

      // 6. Balok 3D
      case 'cuboid_box': {
        const length = String(params.length || '15 m');
        const width = String(params.width || '10 m');
        const height = String(params.height || '2 m');
        return (
          <svg viewBox="0 0 300 190" className="w-full h-full max-h-56" aria-label="Diagram Balok 3D">
            <rect x="50" y="90" width="140" height="70" fill="rgba(99, 102, 241, 0.1)" stroke="#4f46e5" strokeWidth="2" />
            <polygon points="50,90 100,45 240,45 190,90" fill="rgba(99, 102, 241, 0.16)" stroke="#4f46e5" strokeWidth="2" />
            <polygon points="190,90 240,45 240,115 190,160" fill="rgba(99, 102, 241, 0.22)" stroke="#4f46e5" strokeWidth="2" />
            <line x1="50" y1="160" x2="100" y2="115" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" className="text-slate-400" />
            <line x1="100" y1="115" x2="240" y2="115" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" className="text-slate-400" />
            <line x1="100" y1="115" x2="100" y2="45" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" className="text-slate-400" />
            <text x="120" y="178" textAnchor="middle" className="text-xs font-bold fill-indigo-700 dark:fill-indigo-300">p = {length}</text>
            <text x="35" y="130" textAnchor="end" className="text-xs font-bold fill-amber-600 dark:fill-amber-400">t = {height}</text>
            <text x="225" y="70" textAnchor="start" className="text-xs font-bold fill-emerald-600 dark:fill-emerald-400">l = {width}</text>
          </svg>
        );
      }

      // 7. Tabung Air
      case 'cylinder_water': {
        const radius = String(params.radius || '7 cm');
        const height = String(params.height || '20 cm');
        const waterLevel = Number(params.waterLevel || 0.75);
        const cyH = 100;
        const topY = 40;
        const bottomY = topY + cyH;
        const waterY = bottomY - cyH * waterLevel;
        return (
          <svg viewBox="0 0 260 200" className="w-full h-full max-h-56" aria-label="Diagram Tabung Berisi Air">
            <path
              d={`M 70 ${waterY} A 60 16 0 0 0 190 ${waterY} L 190 ${bottomY} A 60 16 0 0 1 70 ${bottomY} Z`}
              fill="rgba(56, 189, 248, 0.35)"
            />
            <ellipse cx="130" cy={waterY} rx="60" ry="16" fill="rgba(56, 189, 248, 0.5)" stroke="#0284c7" strokeWidth="1.5" />
            <path d={`M 70 ${bottomY} A 60 16 0 0 0 190 ${bottomY}`} fill="none" stroke="#4f46e5" strokeWidth="2" />
            <path d={`M 70 ${bottomY} A 60 16 0 0 1 190 ${bottomY}`} fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,3" />
            <line x1="70" y1={topY} x2="70" y2={bottomY} stroke="#4f46e5" strokeWidth="2" />
            <line x1="190" y1={topY} x2="190" y2={bottomY} stroke="#4f46e5" strokeWidth="2" />
            <ellipse cx="130" cy={topY} rx="60" ry="16" fill="rgba(99, 102, 241, 0.08)" stroke="#4f46e5" strokeWidth="2" />
            <line x1="130" y1={topY} x2="190" y2={topY} stroke="#f59e0b" strokeWidth="2" />
            <circle cx="130" cy={topY} r="2.5" fill="#f59e0b" />
            <text x="160" y={topY - 8} textAnchor="middle" className="text-xs font-bold fill-amber-600 dark:fill-amber-400">r = {radius}</text>
            <line x1="210" y1={topY} x2="210" y2={bottomY} stroke="currentColor" strokeWidth="1.5" className="text-slate-400" />
            <text x="220" y={topY + cyH / 2 + 4} textAnchor="start" className="text-xs font-bold fill-slate-700 dark:fill-slate-300">t = {height}</text>
          </svg>
        );
      }

      // 8. Tabung Kenaikan Air (Dimasukkan 3 Bola Besi)
      case 'cylinder_spheres': {
        const radius = String(params.radius || '14 cm');
        const sphereR = String(params.sphereR || '7 cm');
        const rise = String(params.rise || 'Δt = ?');
        return (
          <svg viewBox="0 0 260 200" className="w-full h-full max-h-56" aria-label="Diagram Kenaikan Air Tabung">
            {/* Water level original & rise */}
            <path d="M 60 160 A 70 18 0 0 0 200 160 L 200 100 A 70 18 0 0 1 60 100 Z" fill="rgba(56, 189, 248, 0.35)" />
            {/* Water rise band */}
            <path d="M 60 100 A 70 18 0 0 0 200 100 L 200 70 A 70 18 0 0 1 60 70 Z" fill="rgba(245, 158, 11, 0.25)" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,2" />
            {/* 3 iron spheres inside */}
            <circle cx="100" cy="135" r="16" fill="#64748b" stroke="#334155" strokeWidth="2" />
            <circle cx="140" cy="140" r="16" fill="#64748b" stroke="#334155" strokeWidth="2" />
            <circle cx="160" cy="115" r="16" fill="#64748b" stroke="#334155" strokeWidth="2" />
            {/* Cylinder contours */}
            <line x1="60" y1="40" x2="60" y2="160" stroke="#4f46e5" strokeWidth="2" />
            <line x1="200" y1="40" x2="200" y2="160" stroke="#4f46e5" strokeWidth="2" />
            <ellipse cx="130" cy="40" rx="70" ry="18" fill="none" stroke="#4f46e5" strokeWidth="2" />
            <ellipse cx="130" cy="70" rx="70" ry="18" fill="rgba(56, 189, 248, 0.2)" stroke="#0284c7" strokeWidth="1.5" />
            <text x="130" y="32" textAnchor="middle" className="text-xs font-bold fill-indigo-600">r_tabung = {radius}</text>
            <text x="215" y="85" textAnchor="start" className="text-xs font-bold fill-amber-600">{rise}</text>
            <text x="130" y="185" textAnchor="middle" className="text-[11px] font-semibold fill-slate-600 dark:fill-slate-400">3 Bola Besi r = {sphereR}</text>
          </svg>
        );
      }

      // 9. Kerucut Tenda / Tumpeng
      case 'cone_tent': {
        const radius = String(params.radius || '7 m');
        const height = String(params.height || '24 m');
        const slantHeight = String(params.slantHeight || '25 m');
        return (
          <svg viewBox="0 0 260 200" className="w-full h-full max-h-56" aria-label="Diagram Kerucut">
            <polygon points="130,30 60,150 200,150" fill="rgba(99, 102, 241, 0.1)" />
            <path d="M 60 150 A 70 18 0 0 0 200 150" fill="none" stroke="#4f46e5" strokeWidth="2" />
            <path d="M 60 150 A 70 18 0 0 1 200 150" fill="none" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="3,3" />
            <line x1="130" y1="30" x2="60" y2="150" stroke="#4f46e5" strokeWidth="2.5" />
            <line x1="130" y1="30" x2="200" y2="150" stroke="#4f46e5" strokeWidth="2.5" />
            <line x1="130" y1="30" x2="130" y2="150" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,3" />
            <line x1="130" y1="150" x2="200" y2="150" stroke="#10b981" strokeWidth="2" />
            <circle cx="130" cy="150" r="2.5" fill="#f59e0b" />
            <rect x="130" y="138" width="12" height="12" fill="none" stroke="#f59e0b" strokeWidth="1.2" />
            <text x="120" y="90" textAnchor="end" className="text-xs font-bold fill-amber-600 dark:fill-amber-400">t = {height}</text>
            <text x="165" y="170" textAnchor="middle" className="text-xs font-bold fill-emerald-600 dark:fill-emerald-400">r = {radius}</text>
            <text x="180" y="85" textAnchor="start" className="text-xs font-bold fill-indigo-600 dark:fill-indigo-300">s = {slantHeight}</text>
          </svg>
        );
      }

      // 10. Limas Persegi T.ABCD
      case 'pyramid_square': {
        const base = String(params.base || '10 cm');
        const height = String(params.height || '12 cm');
        const apothem = String(params.apothem || '13 cm');
        return (
          <svg viewBox="0 0 280 200" className="w-full h-full max-h-56" aria-label="Diagram Limas Persegi T.ABCD">
            <polygon points="50,140 170,140 220,110 100,110" fill="rgba(99, 102, 241, 0.08)" stroke="#4f46e5" strokeWidth="2" />
            <line x1="135" y1="35" x2="50" y2="140" stroke="#4f46e5" strokeWidth="2.5" />
            <line x1="135" y1="35" x2="170" y2="140" stroke="#4f46e5" strokeWidth="2.5" />
            <line x1="135" y1="35" x2="220" y2="110" stroke="#4f46e5" strokeWidth="2.5" />
            <line x1="135" y1="35" x2="100" y2="110" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,3" />
            <line x1="135" y1="35" x2="135" y2="125" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,3" />
            <line x1="135" y1="35" x2="110" y2="140" stroke="#ef4444" strokeWidth="2" />
            <text x="135" y="24" textAnchor="middle" className="text-xs font-bold fill-indigo-700 dark:fill-indigo-300">T</text>
            <text x="110" y="160" textAnchor="middle" className="text-xs font-bold fill-indigo-600">sisi = {base}</text>
            <text x="145" y="80" textAnchor="start" className="text-xs font-bold fill-amber-600 dark:fill-amber-400">t = {height}</text>
            <text x="95" y="85" textAnchor="end" className="text-xs font-bold fill-rose-600 dark:fill-rose-400">t_tegak = {apothem}</text>
          </svg>
        );
      }

      // 11. Belahan Bola (Kubah)
      case 'hemisphere_dome': {
        const radius = String(params.radius || '7 m');
        return (
          <svg viewBox="0 0 260 180" className="w-full h-full max-h-56" aria-label="Diagram Belahan Bola / Kubah">
            <path
              d="M 40 120 A 90 90 0 0 1 220 120 Z"
              fill="rgba(99, 102, 241, 0.15)"
              stroke="#4f46e5"
              strokeWidth="2.5"
            />
            <ellipse cx="130" cy="120" rx="90" ry="24" fill="rgba(99, 102, 241, 0.1)" stroke="#4f46e5" strokeWidth="2" />
            <circle cx="130" cy="120" r="3" fill="#f59e0b" />
            <line x1="130" y1="120" x2="220" y2="120" stroke="#f59e0b" strokeWidth="2" />
            <line x1="130" y1="120" x2="130" y2="30" stroke="#10b981" strokeWidth="2" strokeDasharray="3,3" />
            <text x="175" y="112" textAnchor="middle" className="text-xs font-bold fill-amber-600 dark:fill-amber-400">r = {radius}</text>
            <text x="120" y="75" textAnchor="end" className="text-xs font-bold fill-emerald-600 dark:fill-emerald-400">r = {radius}</text>
          </svg>
        );
      }

      // 12. Gabungan Silo (Tabung + Kerucut)
      case 'composite_silo': {
        const radius = String(params.radius || '7 m');
        const cylHeight = String(params.cylHeight || '10 m');
        const coneHeight = String(params.coneHeight || '6 m');
        return (
          <svg viewBox="0 0 260 220" className="w-full h-full max-h-56" aria-label="Diagram Bangun Ruang Gabungan Tabung dan Kerucut">
            <line x1="70" y1="90" x2="70" y2="180" stroke="#4f46e5" strokeWidth="2" />
            <line x1="190" y1="90" x2="190" y2="180" stroke="#4f46e5" strokeWidth="2" />
            <path d="M 70 180 A 60 16 0 0 0 190 180" fill="none" stroke="#4f46e5" strokeWidth="2" />
            <path d="M 70 180 A 60 16 0 0 1 190 180" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,3" />
            <ellipse cx="130" cy="90" rx="60" ry="16" fill="rgba(99, 102, 241, 0.1)" stroke="#4f46e5" strokeWidth="1.5" strokeDasharray="4,3" />
            <line x1="130" y1="30" x2="70" y2="90" stroke="#6366f1" strokeWidth="2.5" />
            <line x1="130" y1="30" x2="190" y2="90" stroke="#6366f1" strokeWidth="2.5" />
            <line x1="130" y1="30" x2="130" y2="90" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,3" />
            <text x="145" y="60" className="text-xs font-bold fill-amber-600 dark:fill-amber-400">t_kerucut = {coneHeight}</text>
            <text x="205" y="140" className="text-xs font-bold fill-indigo-600 dark:fill-indigo-300">t_tabung = {cylHeight}</text>
            <text x="130" y="202" textAnchor="middle" className="text-xs font-bold fill-emerald-600">r = {radius}</text>
          </svg>
        );
      }

      default:
        return (
          <div className="flex items-center justify-center p-6 text-slate-400 text-sm">
            Ilustrasi Geometri
          </div>
        );
    }
  };

  return (
    <div
      className={`relative w-full flex items-center justify-center bg-slate-50/80 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800 p-3 sm:p-4 overflow-hidden ${className}`}
    >
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: '16px 16px',
        }}
      />
      <div className="w-full flex items-center justify-center relative z-10">
        {renderDiagram()}
      </div>
    </div>
  );
};
