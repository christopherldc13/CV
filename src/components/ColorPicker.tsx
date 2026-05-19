import React from 'react';
import type { AccentColor } from '../types/cv.types';
import type { Language } from '../i18n/translations';

interface Props {
  selected: AccentColor;
  onChange: (color: AccentColor) => void;
  language: Language;
}

const colors: { id: AccentColor; hex: string; en: string; es: string }[] = [
  { id: 'blue',    hex: '#2563eb', en: 'Blue',    es: 'Azul' },
  { id: 'emerald', hex: '#059669', en: 'Emerald', es: 'Esmeralda' },
  { id: 'violet',  hex: '#7c3aed', en: 'Violet',  es: 'Violeta' },
  { id: 'rose',    hex: '#e11d48', en: 'Rose',    es: 'Rosa' },
  { id: 'amber',   hex: '#d97706', en: 'Amber',   es: 'Ámbar' },
  { id: 'slate',   hex: '#334155', en: 'Slate',   es: 'Gris' },
  { id: 'teal',    hex: '#0d9488', en: 'Teal',    es: 'Verde Azulado' },
  { id: 'indigo',  hex: '#4f46e5', en: 'Indigo',  es: 'Índigo' },
  { id: 'orange',  hex: '#ea580c', en: 'Orange',  es: 'Naranja' },
  { id: 'dark',    hex: '#111827', en: 'Dark',    es: 'Oscuro' },
];

export const ColorPicker: React.FC<Props> = ({ selected, onChange, language }) => {
  const isEs = language === 'es';
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {isEs ? 'Color de Acento' : 'Accent Color'}
      </p>
      <div className="flex gap-2 flex-wrap">
        {colors.map((c) => (
          <button
            key={c.id}
            onClick={() => onChange(c.id)}
            title={isEs ? c.es : c.en}
            className={`w-7 h-7 rounded-full border-2 transition-all duration-150 ${
              selected === c.id ? 'border-gray-800 scale-110 shadow-md' : 'border-transparent hover:border-gray-300 hover:scale-105'
            }`}
            style={{ backgroundColor: c.hex }}
          >
            {selected === c.id && (
              <svg className="w-3 h-3 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
