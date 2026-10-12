'use client';

import React, { useState } from 'react';
import { ThemeMode } from '../types';
import { Wrench, Lock, ArrowLeft, AlertCircle, Mail, KeyRound } from 'lucide-react';

interface B2BLoginGatewayProps {
  theme: ThemeMode;
  onLoginSuccess: (email: string, name: string) => void;
  onBackToUser: () => void;
}

export const B2BLoginGateway: React.FC<B2BLoginGatewayProps> = ({
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
      if (cleanEmail === 'mitra@zypher.id' || cleanEmail.includes('b2b') || cleanEmail.includes('mitra')) {
        if (password === 'mitra123' || password === 'admin123') {
          onLoginSuccess(cleanEmail, 'Mitra Servis Sentosa (Surabaya)');
          return;
        }
        setErrorMsg('Kata sandi salah. Silakan periksa kembali.');
        return;
      }

      setErrorMsg('Akun tidak terdaftar sebagai mitra B2B resmi ZYPHER.');
    }, 300);
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 sm:p-8 rounded-3xl border space-y-6 shadow-sm transition-all duration-300 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
      
      {/* HEADER BADGE */}
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 mb-1 shadow-xs">
          <Wrench className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            Jaringan Tertutup Teknisi & Pengepul
          </span>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
            Portal Kemitraan B2B
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Silakan masukkan kredensial mitra terdaftar untuk mengakses katalog suku cadang kanibalan dan borongan limbah e-waste.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl text-xs bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900 flex items-center gap-2.5 animate-shake">
          <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* B2B LOGIN FORM */}
      <form onSubmit={handleLogin} className="space-y-4 text-xs">
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 text-slate-400" />
            <span>Email Bisnis / Mitra</span>
          </label>
          <input
            type="email"
            placeholder="nama@mitra-servis.id"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2.5 rounded-xl border text-xs outline-none bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-amber-600 focus:ring-1 focus:ring-amber-500/20 transition-all"
            required
            autoComplete="email"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <KeyRound className="h-3.5 w-3.5 text-slate-400" />
            <span>Kata Sandi</span>
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2.5 rounded-xl border text-xs outline-none bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-amber-600 focus:ring-1 focus:ring-amber-500/20 transition-all"
            required
            autoComplete="current-password"
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" className="rounded border-slate-300 text-amber-600 focus:ring-0" defaultChecked />
            <span>Ingat perangkat ini</span>
          </label>
          <span className="text-amber-600 dark:text-amber-400 hover:underline cursor-pointer">
            Bantuan Akses?
          </span>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl font-bold bg-amber-600 hover:bg-amber-700 text-white transition-all shadow-sm active:scale-98 disabled:opacity-60 flex items-center justify-center gap-2 text-xs"
        >
          {isLoading ? (
            <span className="inline-block h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Lock className="h-3.5 w-3.5" />
              <span>Masuk ke Portal B2B</span>
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
