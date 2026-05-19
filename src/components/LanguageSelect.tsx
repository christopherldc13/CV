import React from 'react';
import type { Language } from '../i18n/translations';

interface Props {
  onSelect: (lang: Language) => void;
}

export const LanguageSelect: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <span className="text-2xl font-bold text-white tracking-tight">CV Builder</span>
            <span className="ml-2 text-xs bg-blue-500/30 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded-full font-semibold">Pro</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Choose your language</h1>
            <p className="text-blue-200/70 text-sm">Elige tu idioma · Select your language</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* English */}
            <button
              onClick={() => onSelect('en')}
              className="group relative flex flex-col items-center gap-4 p-6 rounded-2xl border-2 border-white/10 bg-white/5 hover:bg-blue-500/20 hover:border-blue-400/60 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="text-5xl">🇺🇸</span>
              <div className="text-center">
                <p className="text-white font-bold text-lg">English</p>
                <p className="text-blue-200/60 text-xs mt-0.5">Continue in English</p>
              </div>
              <div className="absolute inset-0 rounded-2xl ring-2 ring-blue-400 ring-opacity-0 group-hover:ring-opacity-50 transition-all duration-200 pointer-events-none" />
            </button>

            {/* Spanish */}
            <button
              onClick={() => onSelect('es')}
              className="group relative flex flex-col items-center gap-4 p-6 rounded-2xl border-2 border-white/10 bg-white/5 hover:bg-blue-500/20 hover:border-blue-400/60 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="text-5xl">🇪🇸</span>
              <div className="text-center">
                <p className="text-white font-bold text-lg">Español</p>
                <p className="text-blue-200/60 text-xs mt-0.5">Continuar en español</p>
              </div>
              <div className="absolute inset-0 rounded-2xl ring-2 ring-blue-400 ring-opacity-0 group-hover:ring-opacity-50 transition-all duration-200 pointer-events-none" />
            </button>
          </div>
        </div>

        <p className="text-center text-blue-200/30 text-xs mt-6">
          You can change this later from the app · Puedes cambiarlo después desde la app
        </p>
      </div>
    </div>
  );
};
