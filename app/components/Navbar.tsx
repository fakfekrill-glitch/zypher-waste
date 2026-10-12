'use client';

import React from 'react';
import { UserRole } from '../types';
import { COMMODITY_PRICES } from '../lib/constants';
import { ShieldCheck, RefreshCw, Cpu, Layers, Building2, Factory, Scale } from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  activeSection,
  onSectionChange,
  onResetData,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 border-b border-slate-800/90 backdrop-blur-md">
      {/* TOP COMMODITY TICKER STRIP */}
      <div className="bg-slate-900/90 border-b border-slate-800/60 px-4 py-1.5 text-[11px] overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 min-w-max">
          <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px]">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-300">URBAN MINING SPOT INDEX:</span>
          </div>
          <div className="flex items-center gap-6">
            {COMMODITY_PRICES.map((commodity) => (
              <div key={commodity.symbol} className="flex items-center gap-1.5 font-mono">
                <span className="text-slate-400">{commodity.symbol}:</span>
                <span className="text-slate-200 font-semibold tabular-nums">
                  ${commodity.price.toFixed(2)}
                </span>
                <span
                  className={`text-[10px] font-medium ${
                    commodity.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {commodity.changePercent >= 0 ? '+' : ''}
                  {commodity.changePercent}%
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 pl-4 border-l border-slate-800">
            <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 px-2 py-0.5 rounded font-mono font-medium">
              KLHK Festronik B107d Ready
            </span>
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* BRAND */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-sm">
              <RefreshCw className="h-5 w-5 animate-spin [animation-duration:12s]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-wider text-slate-100">
                  ZYPHER<span className="text-emerald-400 font-mono text-sm ml-0.5">.CIRCULAR</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono bg-slate-900 border border-slate-700 text-slate-300 px-1.5 py-0.5 rounded">
                  B2B ITAD OS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Enterprise E-Waste Disposition, Data Sanitization & Urban Mining
              </p>
            </div>
          </div>

          {/* MAIN SECTION TABS */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => onSectionChange('overview')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeSection === 'overview'
                  ? 'bg-slate-800 text-slate-100 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Ekosistem & Alur
            </button>
            <button
              onClick={() => onSectionChange('calculator')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeSection === 'calculator'
                  ? 'bg-slate-800 text-slate-100 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Kalkulator ESG & Yield
            </button>
            <button
              onClick={() => onSectionChange('portal')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeSection === 'portal'
                  ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Konsol Portal B2B
            </button>
          </nav>

          {/* ROLE SWITCHER */}
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-900/90 border border-slate-800 rounded-lg p-1">
              <button
                onClick={() => {
                  onRoleChange('consignor');
                  onSectionChange('portal');
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-semibold transition-all ${
                  currentRole === 'consignor'
                    ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700/60'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Portal Korporasi Pemilik Aset IT"
              >
                <Building2 className="h-3.5 w-3.5" />
                <span className="hidden lg:inline">Korporasi ITAD</span>
              </button>
              <button
                onClick={() => {
                  onRoleChange('recycler');
                  onSectionChange('portal');
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-semibold transition-all ${
                  currentRole === 'recycler'
                    ? 'bg-slate-800 text-amber-400 shadow-sm border border-slate-700/60'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Portal Smelter & Pengolah Limbah"
              >
                <Factory className="h-3.5 w-3.5" />
                <span className="hidden lg:inline">Smelter & Part</span>
              </button>
              <button
                onClick={() => {
                  onRoleChange('auditor');
                  onSectionChange('portal');
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-semibold transition-all ${
                  currentRole === 'auditor'
                    ? 'bg-slate-800 text-sky-400 shadow-sm border border-slate-700/60'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Portal Inspeksi & Kepatuhan KLHK"
              >
                <Scale className="h-3.5 w-3.5" />
                <span className="hidden lg:inline">QC & B3 Audit</span>
              </button>
            </div>

            {/* RESET BUTTON */}
            <button
              onClick={onResetData}
              title="Reset data demonstrasi juri ke kondisi awal"
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-lg border border-slate-800 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
