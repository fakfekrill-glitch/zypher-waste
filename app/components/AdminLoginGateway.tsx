'use client';

import React, { useState } from 'react';
import { ThemeMode } from '../types';
import { ShieldCheck, Lock, AlertCircle, Sparkles, LogIn } from 'lucide-react';

interface AdminLoginGatewayProps {
  theme: ThemeMode;
  onLoginSuccess: (email: string, name: string) => void;
  onBackToUser: () => void;
}

export const AdminLoginGateway: React.FC<AdminLoginGatewayProps> = ({
  theme,
  onLoginSuccess,
  onBackToUser,
}) => {
  const isDark = theme === 'dark';
  const [email, setEmail] = useState<string>('admin@zypher.id');
  const [password, setPassword] = useState<string>('admin123');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail === 'admin@zypher.id' || cleanEmail.includes('admin')) {
      if (password === 'admin123' || password === 'ZYPHER27') {
        onLoginSuccess(cleanEmail, 'Admin Gudang Pusat QC & Escrow');
        return;
      }
      setErrorMsg('Kata sandi admin salah. Gunakan: admin123');
      return;
    }

    setErrorMsg('Akses ditolak: Hanya email admin terdaftar yang diizinkan (admin@zypher.id).');
  };

  const handleQuickDemoLogin = () => {
    onLoginSuccess('admin@zypher.id', 'Kepala QC Gudang Pusat ZYPHER.ID');
  };

  return (
    <div className="max-w-md mx-auto my-6 p-6 sm:p-8 rounded-3xl border space-y-6 shadow-sm transition-all duration-300 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
      
      {/* HEADER BADGE */}
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400 mb-1 shadow-xs">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
            Akses Terbatas: Hanya Petugas Berwenang
          </span>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
            Konsol Otoritas Admin Gudang & Escrow
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Otoritas inspeksi unboxing fisik, penetapan alur triage sirkular, dan pelepasan dana Rekber.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl text-xs bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-900 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* QUICK DEMO ACCESS FOR JURI HACKATHON */}
      <div className="p-3.5 rounded-2xl border border-sky-200 dark:border-sky-900/60 bg-sky-50/60 dark:bg-sky-950/30 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-sky-900 dark:text-sky-300 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-sky-600" />
            <span>Akses Cepat Pengujian Juri Hackathon</span>
          </span>
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-sky-200 dark:bg-sky-900 text-sky-900 dark:text-sky-200 font-bold">
            1-Klik
          </span>
        </div>
        <p className="text-[10px] text-slate-600 dark:text-slate-400">
          Akun admin: <strong className="font-mono text-slate-900 dark:text-slate-200">admin@zypher.id</strong> / Kata sandi: <strong className="font-mono text-slate-900 dark:text-slate-200">admin123</strong>
        </p>
        <button
          type="button"
          onClick={handleQuickDemoLogin}
          className="w-full py-2.5 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-98"
        >
          <LogIn className="h-3.5 w-3.5" />
          <span>Masuk Instan sebagai Admin Gudang</span>
        </button>
      </div>

      <div className="flex items-center my-2">
        <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
        <span className="px-3 text-[10px] text-slate-400 uppercase font-mono">Atau Kredensial Khusus</span>
        <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
      </div>

      {/* MANUAL ADMIN LOGIN FORM */}
      <form onSubmit={handleManualLogin} className="space-y-3.5 text-xs">
        <div>
          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
            Email Administrator ZYPHER.ID
          </label>
          <input
            type="email"
            placeholder="admin@zypher.id"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2.5 rounded-xl border text-xs outline-none bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-sky-600"
            required
          />
        </div>

        <div>
          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
            Kata Sandi Otoritas
          </label>
          <input
            type="password"
            placeholder="Kata sandi admin..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2.5 rounded-xl border text-xs outline-none bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-sky-600"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl font-bold bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-950 transition-all shadow-sm active:scale-98"
        >
          Masuk ke Konsol Otoritas Admin
        </button>
      </form>

      {/* BACK TO USER PORTAL */}
      <div className="text-center pt-2 border-t border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={onBackToUser}
          className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold inline-flex items-center gap-1 transition-colors"
        >
          <span>&larr; Kembali ke Portal Penjual HP (User)</span>
        </button>
      </div>

    </div>
  );
};
