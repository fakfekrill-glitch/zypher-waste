'use client';

import React, { useState } from 'react';
import { Calculator, Sparkles, TrendingUp, Leaf, ShieldAlert, Coins, ArrowRight, Check } from 'lucide-react';
import { COMMODITY_PRICES } from '../lib/constants';

interface EsgYieldCalculatorProps {
  onApplyToBatch?: (data: { category: string; units: number; weightKg: number; estValue: number }) => void;
}

export const EsgYieldCalculator: React.FC<EsgYieldCalculatorProps> = ({ onApplyToBatch }) => {
  // SLIDER STATES
  const [servers, setServers] = useState<number>(24);
  const [laptops, setLaptops] = useState<number>(80);
  const [pcbScrapKg, setPcbScrapKg] = useState<number>(350);
  const [lithiumBatteriesKg, setLithiumBatteriesKg] = useState<number>(500);

  const [copied, setCopied] = useState<boolean>(false);

  // COMPUTATION ENGINE (WEEE Empirical Coefficients)
  // Servers: ~26 kg/unit, ~3.8g Au/unit, ~3.2kg Cu/unit, ~0.075 ton CO2e/unit
  const serverWeight = servers * 26;
  const serverAu = servers * 3.8;
  const serverCu = servers * 3.2;
  const serverCo2 = servers * 0.075;

  // Laptops: ~2.2 kg/unit, ~0.22g Au/unit, ~0.28kg Cu/unit, ~0.042 ton CO2e/unit
  const laptopWeight = laptops * 2.2;
  const laptopAu = laptops * 0.22;
  const laptopCu = laptops * 0.28;
  const laptopCo2 = laptops * 0.042;

  // Telecom PCB: ~0.22g Au/kg, ~0.18kg Cu/kg, ~0.0036 ton CO2e/kg
  const pcbAu = pcbScrapKg * 0.22;
  const pcbCu = pcbScrapKg * 0.18;
  const pcbCo2 = pcbScrapKg * 0.0036;

  // Lithium Battery: ~0.12kg Cu/kg, ~0.15kg Li-equivalent/kg, ~0.0028 ton CO2e/kg
  const batteryCu = lithiumBatteriesKg * 0.12;
  const batteryCo2 = lithiumBatteriesKg * 0.0028;

  // AGGREGATE TOTALS
  const totalWeightKg = Math.round(serverWeight + laptopWeight + pcbScrapKg + lithiumBatteriesKg);
  const totalAuGrams = Number((serverAu + laptopAu + pcbAu).toFixed(1));
  const totalCuKg = Number((serverCu + laptopCu + pcbCu + batteryCu).toFixed(1));
  const totalCo2eAvoidedTon = Number((serverCo2 + laptopCo2 + pcbCo2 + batteryCo2).toFixed(2));
  const groundwaterProtectedLiters = Math.round(totalWeightKg * 240); // Lead leaching diversion factor

  // MONETARY RECOVERY CALCULATION (IDR Kurs ~16,200)
  const auPriceUsd = COMMODITY_PRICES.find((c) => c.symbol.includes('Au'))?.price || 78.45;
  const cuPriceUsd = COMMODITY_PRICES.find((c) => c.symbol.includes('Cu'))?.price || 9.28;

  const rawAuValueIdr = totalAuGrams * auPriceUsd * 16200;
  const rawCuValueIdr = totalCuKg * cuPriceUsd * 16200;
  const estimatedNetRecoveryIdr = Math.round(rawAuValueIdr + rawCuValueIdr);

  const handleCopySummary = () => {
    const text = `ZYPHER CIRCULAR - ESG & URBAN MINING PROJECTION:
- Total Berat Limbah: ${totalWeightKg.toLocaleString()} Kg
- Potensi Pemulihan Emas (Au): ${totalAuGrams} Gram
- Potensi Pemulihan Tembaga (Cu): ${totalCuKg} Kg
- Emisi CO2e Dihindari (Scope 3): ${totalCo2eAvoidedTon} Ton CO2e
- Perlindungan Air Tanah dari Toksisitas Timbal: ${groundwaterProtectedLiters.toLocaleString()} Liter
- Nilai Estimasi Pelepasan Aset: Rp ${estimatedNetRecoveryIdr.toLocaleString('id-ID')}
Standar: WEEE Methodology & Permen LHK No. 6/2021 (B107d)`;

    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 sm:p-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700/60 text-slate-300 text-[11px] font-mono uppercase mb-2">
            <Calculator className="h-3.5 w-3.5 text-emerald-400" />
            Empirical ESG & Precious Metal Recovery Engine
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
            Kalkulator Simulasi Sirkularitas & Nilai Pemulihan Logam
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1">
            Hitung perkiraan hasil ekstraksi emas (Au), tembaga (Cu), serta emisi Scope 3 GHG yang dihindari
            berdasarkan inventaris limbah IT korporat Anda sebelum pelepasan aset.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: INTERACTIVE SLIDERS */}
        <div className="lg:col-span-6 space-y-6 bg-slate-950/80 border border-slate-800 rounded-xl p-5 sm:p-6">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-2.5">
            Komposisi Aset yang Didekomisioning:
          </h3>

          {/* SERVERS */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-200">Rack / Blade Servers (Dell/HPE/Lenovo)</span>
              <span className="font-mono text-emerald-400 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                {servers} Unit <span className="text-slate-500">({serverWeight} kg)</span>
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              step="2"
              value={servers}
              onChange={(e) => setServers(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">Estimasi konsentrasi: ~3.8g Au & ~3.2kg Cu per server blade.</p>
          </div>

          {/* LAPTOPS */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-200">Laptop Korporat & Workstation</span>
              <span className="font-mono text-emerald-400 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                {laptops} Unit <span className="text-slate-500">({Math.round(laptopWeight)} kg)</span>
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="500"
              step="10"
              value={laptops}
              onChange={(e) => setLaptops(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">Estimasi konsentrasi: ~0.22g Au & ~0.28kg Cu per laptop.</p>
          </div>

          {/* TELECOM PCB */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-200">Modul PCB BTS & Kartu Jaringan Scrap</span>
              <span className="font-mono text-emerald-400 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                {pcbScrapKg} Kg
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="2000"
              step="50"
              value={pcbScrapKg}
              onChange={(e) => setPcbScrapKg(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">Papan sirkuit grade tinggi dengan pin konektor gold-plated.</p>
          </div>

          {/* LITHIUM BATTERIES */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-200">Baterai UPS Industri & Lithium Pack</span>
              <span className="font-mono text-emerald-400 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                {lithiumBatteriesKg} Kg
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="3000"
              step="50"
              value={lithiumBatteriesKg}
              onChange={(e) => setLithiumBatteriesKg(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">Mengandung anoda tembaga, katoda nikel/kobalt, dan litium terpulihkan.</p>
          </div>

        </div>

        {/* RIGHT COLUMN: REAL-TIME YIELD DASHBOARD */}
        <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* GOLD YIELD CARD */}
            <div className="bg-slate-950/80 border border-amber-900/40 rounded-xl p-4 relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-amber-300 font-semibold uppercase">Emas Murni (Au)</span>
                <Coins className="h-4 w-4 text-amber-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono tabular-nums">
                {totalAuGrams} <span className="text-sm font-sans font-medium text-amber-400/80">Gram</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Nilai komoditas Au: ~Rp {Math.round(rawAuValueIdr).toLocaleString('id-ID')}
              </p>
            </div>

            {/* COPPER YIELD CARD */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-slate-300 font-semibold uppercase">Tembaga Katoda (Cu)</span>
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-mono tabular-nums">
                {totalCuKg} <span className="text-sm font-sans font-medium text-slate-400">Kg</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Nilai komoditas Cu: ~Rp {Math.round(rawCuValueIdr).toLocaleString('id-ID')}
              </p>
            </div>

            {/* CO2e AVERTED */}
            <div className="bg-slate-950/80 border border-emerald-950/60 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-emerald-400 font-semibold uppercase">Scope 3 CO₂e Averted</span>
                <Leaf className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tabular-nums">
                {totalCo2eAvoidedTon} <span className="text-sm font-sans font-medium text-emerald-400/80">Ton CO₂e</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Emisi tambang primer yang dihindari melalui daur ulang sirkular.
              </p>
            </div>

            {/* TOXIC RUNOFF DIVERTED */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-sky-400 font-semibold uppercase">Air Tanah Terlindungi</span>
                <ShieldAlert className="h-4 w-4 text-sky-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-sky-300 font-mono tabular-nums">
                {groundwaterProtectedLiters.toLocaleString()} <span className="text-sm font-sans font-medium text-slate-400">Liter</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Bebas dari resapan timbal (Pb), kadmium, dan merkuri ke akuifer.
              </p>
            </div>

          </div>

          {/* RECOVERY VALUATION HERO BOX */}
          <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono text-emerald-300 font-semibold uppercase block">
                Estimasi Total Nilai Pemulihan Aset (Rekber)
              </span>
              <div className="text-2xl sm:text-3xl font-black text-slate-100 font-mono tracking-tight mt-0.5">
                Rp {estimatedNetRecoveryIdr.toLocaleString('id-ID')}
              </div>
              <span className="text-[10px] text-slate-400">
                Total bobot: {totalWeightKg.toLocaleString()} kg limbah elektronik teralokasi.
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={handleCopySummary}
                className="px-3.5 py-2.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : null}
                <span>{copied ? 'Tersalin!' : 'Salin Laporan ESG'}</span>
              </button>
              
              {onApplyToBatch && (
                <button
                  type="button"
                  onClick={() =>
                    onApplyToBatch({
                      category: servers > 0 ? 'server_blade' : 'laptops_pc',
                      units: servers + laptops,
                      weightKg: totalWeightKg,
                      estValue: estimatedNetRecoveryIdr,
                    })
                  }
                  className="px-4 py-2.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>Daftarkan Batch</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
