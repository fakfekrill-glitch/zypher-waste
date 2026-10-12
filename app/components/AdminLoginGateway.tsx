'use client';

import React, { useState } from 'react';
import { ThemeMode } from '../types';
import { ShieldCheck, Lock, ArrowLeft, AlertCircle, Mail, KeyRound } from 'lucide-react';

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
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    
    // Simulate slight auth verification
    setTimeout(() => {
      setIsLoading(false);
      if (cleanEmail === 'admin@zypher.id' || cleanEmail.includes('admin')) {
        if (password === 'admin123' || password === 'ZYPHER27') {
          onLoginSuccess(cleanEmail, 'Admin Gudang Pusat QC & Escrow');
          return;
        }
        setErrorMsg('Kata sandi otorisasi admin salah. Silakan periksa kembali.');
        return;
      }

      setErrorMsg('Akses ditolak: Alamat email tidak memiliki izin administratif.');
    }, 300);
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 sm:p-8 rounded-3xl border space-y-6 shadow-sm transition-all duration-300 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
      
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
            Sistem internal ZYPHER.ID khusus petugas QC untuk inspeksi unboxing fisik, penetapan alur triage kanibal, dan pelepasan dana Rekber.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl text-xs bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900 flex items-center gap-2.5 animate-shake">
          <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ADMIN LOGIN FORM */}
      <form onSubmit={handleLogin} className="space-y-4 text-xs">
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 text-slate-400" />
            <span>Email Administrator ZYPHER.ID</span>
          </label>
          <input
            type="email"
            placeholder="admin@zypher.id"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2.5 rounded-xl border text-xs outline-none bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-sky-600 focus:ring-1 focus:ring-sky-500/20 transition-all"
            required
            autoComplete="email"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <KeyRound className="h-3.5 w-3.5 text-slate-400" />
            <span>Kata Sandi Otoritas</span>
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2.5 rounded-xl border text-xs outline-none bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-sky-600 focus:ring-1 focus:ring-sky-500/20 transition-all"
            required
            autoComplete="current-password"
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" className="rounded border-slate-300 text-sky-600 focus:ring-0" defaultChecked />
            <span>Sesi aman 24 jam</span>
          </label>
          <span className="text-sky-600 dark:text-sky-400 hover:underline cursor-pointer">
            Lupa Kredensial?
          </span>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl font-bold bg-sky-600 hover:bg-sky-700 text-white transition-all shadow-sm active:scale-98 disabled:opacity-60 flex items-center justify-center gap-2 text-xs"
        >
          {isLoading ? (
            <span className="inline-block h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Lock className="h-3.5 w-3.5" />
              <span>Masuk ke Konsol Otoritas Admin</span>
            </>
          )}
        </button>
      </form>

      {/* BACK TO PUBLIC PORTAL */}
      <div className="text-center pt-3 border-t border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={onBackToUser}
          className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold inline-flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Kembali ke Portal Penjual HP (User)</span>
        </button>
      </div>

    </div>
  );
};
