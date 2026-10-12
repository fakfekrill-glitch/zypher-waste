'use client';

import React from 'react';
import { UserRole, ThemeMode } from '../types';
import { Smartphone, Wrench, ShieldCheck, Sun, Moon, RefreshCw, LogOut, LogIn } from 'lucide-react';

export interface AuthSession {
  role: UserRole;
  email: string;
  name: string;
}

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeView: 'app' | 'about' | 'auth';
  onViewChange: (view: 'app' | 'about' | 'auth') => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  session: AuthSession | null;
  onLogout: () => void;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  activeView,
  onViewChange,
  theme,
  onToggleTheme,
  session,
  onLogout,
  onResetData,
}) => {
  const isDark = theme === 'dark';

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-md transition-colors duration-300 ${
        isDark ? 'bg-slate-950/90 border-slate-800/80' : 'bg-white/90 border-slate-200/90 shadow-xs'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* BRAND LOGO */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onViewChange('app')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div
                className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-base transition-transform group-hover:scale-105 shadow-sm ${
                  isDark
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                }`}
              >
                ♻️
              </div>
              <div>
                <span className="font-extrabold text-base tracking-wider leading-none">
                  ZYPHER<span className="text-emerald-500 font-black">.ID</span>
                </span>
                <span
                  className={`hidden sm:block text-[10px] font-medium leading-tight ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  Ekosistem Sirkular E-Waste & Rekber
                </span>
              </div>
            </button>
          </div>

          {/* ROLE SWITCHER TABS */}
          <div
            className={`hidden md:flex items-center p-1 rounded-xl border text-xs font-semibold ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}
          >
            <button
              type="button"
              onClick={() => {
                onRoleChange('user');
                onViewChange('app');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                currentRole === 'user' && activeView === 'app'
                  ? isDark
                    ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700'
                    : 'bg-white text-emerald-700 shadow-sm border border-slate-200'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>Jual HP Rusak (User)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onRoleChange('b2b');
                onViewChange('app');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                currentRole === 'b2b' && activeView === 'app'
                  ? isDark
                    ? 'bg-slate-800 text-amber-400 shadow-sm border border-slate-700'
                    : 'bg-white text-amber-700 shadow-sm border border-slate-200'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Wrench className="h-3.5 w-3.5" />
              <span>Mitra B2B</span>
              {session?.role !== 'b2b' && (
                <span className="text-[10px] opacity-75 font-mono">🔒</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                onRoleChange('admin');
                onViewChange('app');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                currentRole === 'admin' && activeView === 'app'
                  ? isDark
                    ? 'bg-slate-800 text-sky-400 shadow-sm border border-slate-700'
                    : 'bg-white text-sky-700 shadow-sm border border-slate-200'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Gudang QC (Admin)</span>
              {session?.role !== 'admin' && (
                <span className="text-[10px] opacity-75 font-mono">🔒</span>
              )}
            </button>
          </div>

          {/* ACTION BUTTONS: THEME TOGGLE, ABOUT, & AUTH */}
          <div className="flex items-center gap-2">
            
            {/* LIGHT / DARK MODE TOGGLE BUTTON */}
            <button
              type="button"
              onClick={onToggleTheme}
              title={isDark ? 'Ganti ke Mode Terang (Light)' : 'Ganti ke Mode Gelap (Dark)'}
              className={`p-2 rounded-xl border transition-all duration-300 flex items-center justify-center ${
                isDark
                  ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800 hover:border-slate-700'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 hover:border-slate-300'
              }`}
            >
              {isDark ? (
                <Sun className="h-4 w-4 animate-spin [animation-duration:15s]" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            {/* RESET BUTTON FOR DEMO */}
            <button
              type="button"
              onClick={onResetData}
              title="Reset data demonstrasi juri"
              className={`p-2 rounded-xl border transition-colors ${
                isDark
                  ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-800'
              }`}
            >
              <RefreshCw className="h-4 w-4" />
            </button>

            {/* ABOUT LINK */}
            <button
              type="button"
              onClick={() => onViewChange('about')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeView === 'about'
                  ? isDark
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-200 text-slate-900'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tentang
            </button>

            {/* AUTH / LOGIN STATUS */}
            {session ? (
              <div className="flex items-center gap-1.5">
                <span
                  className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border ${
                    session.role === 'admin'
                      ? 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800'
                      : session.role === 'b2b'
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                      : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                  }`}
                >
                  <span>{session.role === 'admin' ? '👑 Admin' : session.role === 'b2b' ? '🔧 B2B' : '📱 User'}</span>
                </span>

                <button
                  type="button"
                  onClick={onLogout}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600/10 hover:bg-rose-600/20 text-rose-600 border border-rose-600/30 transition-all flex items-center gap-1.5"
                  title={`Keluar dari sesi ${session.email}`}
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Keluar</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onViewChange('auth')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${
                  isDark
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Masuk User</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
